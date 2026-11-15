#!/usr/bin/env python3
"""Sound effects for the UPSC monsoon film (GEO-07 part 1): our own sounds, synthesised in numpy, placed from the film's timeline.
Nothing is downloaded. It reuses the synthesis helpers and levels of scripts/datayt/long_sfx.py (the Namakkal tool, not edited) and
adds the effects this film needs, all under new names (`up_*.wav`) in public/datayt/sfx/own/.

  .venv/bin/python scripts/upsc/long_sfx_upsc.py make [--force]                    # writes the up_* effects and up_audition.wav
  .venv/bin/python scripts/upsc/long_sfx_upsc.py cues                              # writes .../upsc/geo07-p1/sfx_cues.json
  .venv/bin/python scripts/upsc/long_sfx_upsc.py mix --video V.mp4 [--voice V.wav] --out OUT.mp4

Cues sit on the frame the picture appears (scene `from` + reveal, 30 fps logical clock; seconds = frame / 30), so they hold at any
render fps. Levels as long_sfx: a point cue peaks at -18 dBFS under the voice and -12 dBFS in a gap (plus a per-effect trim), point cues
are at most 5 a second, and a side-chain holds every effect 8 dB under real speech. Beds (cicada, rain, trickle, bubbling, wind, creak)
run for their scene, fade in and out over 0.4 s inside it, and follow the same under-voice / gap levels sample by sample.
With no voice the mix is the effects alone at the gap level (a silent draft); with a voice, voice + effects are set to -16 LUFS.
The video stream is copied, never re-rendered.
"""
import argparse, json, os, re, shutil, subprocess, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "datayt"))
import long_sfx as L                                   # the Namakkal tool: imported, never edited
from long_sfx import SR, UNDER, GAP, MIN_GAP, _t, _rng, _norm, _glide, _bandnoise, _stereo, write_wav, rms_db

ROOT = L.ROOT
FILM = os.environ.get("UPSC_FILM", "geo07-p1")   # UPSC_FILM=geo07-p2 for Part 2
BASE = os.path.join(ROOT, "public/datayt/long/upsc", FILM)
OWN = L.OWN
PEAK_SCENE = {"geo07-p1": "s038", "geo07-p2": "s039"}.get(FILM, "")   # p2: s039, the rain belt sliding back south (the turn, beat b14); the globe "split" scene: Storyboard beat b14, "Peak ... Music rises" (the brief said s052, which is "overhead")
FADE = 0.4                 # bed fade in and out, seconds, inside the scene


# ---- small helpers -------------------------------------------------------------------------------------------------------------
def _fn(sec, lo, hi, seed, tilt=0.0):
    """FFT-shaped noise (fast, any length): band-pass between lo and hi Hz (soft slopes), `tilt` = dB-ish spectral slope, unit rms."""
    n = int(sec * SR); F = np.fft.rfft(_rng(seed).standard_normal(n)); f = np.fft.rfftfreq(n, 1 / SR)
    m = 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4) / np.sqrt(1 + (f / hi) ** 4) * (np.maximum(f, 50) / 1000) ** tilt
    y = np.fft.irfft(F * m, n)
    return y / max(1e-9, y.std())


def _slow(sec, rate, seed):
    """Smooth random control curve in about -1..1 (moves at roughly `rate` Hz)."""
    y = _fn(sec, rate * 0.05, rate, seed)
    return np.clip(y / 2.5, -1, 1)


def _lr(fn, sec, seed):
    return np.stack([fn(sec, seed), fn(sec, seed + 101)], axis=1)


def _place(y, kernel, i, amp=1.0):
    if i < 0 or i >= len(y): return
    e = min(len(y), i + len(kernel)); y[i:e] += kernel[:e - i] * amp


def _fade(e, sec=FADE):
    n = min(len(e) // 2, int(sec * SR)); g = np.ones(len(e)); r = np.linspace(0, 1, n) ** 2 * (3 - 2 * np.linspace(0, 1, n))
    g[:n] = r; g[len(e) - n:] = r[::-1]
    return e * g[:, None]


# ---- point effects ---------------------------------------------------------------------------------------------------------------
def up_pop(): return L._pop(470, 250, 0.12, 30)                    # a soft pop for badges, numbers and bubbles
def up_tick(): return L.tick()                                      # a light tick for pills and labels


def up_scribble(sec=0.6, seed=21):
    """A pencil on paper: grainy band-passed noise, swelling and fading with each back-and-forth stroke."""
    n = int(sec * SR); t = np.arange(n) / SR; r = _rng(seed)
    f = 8.5 + 1.5 * _slow(sec, 1.5, seed + 1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    stroke = np.abs(np.sin(ph)) ** 0.8 * (0.55 + 0.45 * np.interp(np.arange(n), np.arange(n // 4000 + 2) * 4000, r.uniform(0.2, 1, n // 4000 + 2)))
    grain = _fn(sec, 1800, 6500, seed + 2) * (0.7 + 0.3 * r.standard_normal(n).clip(-2, 2) / 2)
    return _norm(grain * stroke * np.minimum(1, t * 90) * np.minimum(1, (sec - t) * 40))


def up_strike():
    """One quick pencil strike-through: a fast rising scratch that stops dead, with a tiny tap at the end."""
    sec = 0.2; n = int(sec * SR); u = np.linspace(0, 1, n)
    sw = _bandnoise(sec, lambda v: 1500 + 4800 * v, 1.6, 22)
    y = _norm(sw) * np.minimum(1, u * 25) * np.minimum(1, (1 - u) * 30) * (0.5 + 0.5 * u)
    tap = L.tick()[:int(0.04 * SR)] * 0.5; o = int(0.16 * SR); y[o:o + len(tap)] += tap[:n - o]
    return _norm(y)


def up_airy(sec=0.9, seed=23):
    """A soft air whoosh: low band-passed breath that opens and closes, quieter and rounder than long_sfx.whoosh."""
    n = int(sec * SR)
    y = _norm(_bandnoise(sec, lambda u: 420 * 4.2 ** np.sin(np.pi * u), 0.9, seed)) * np.hanning(n) ** 1.8
    return _stereo(_norm(y), np.linspace(-0.4, 0.4, n))


def up_airy_long(): return up_airy(1.5, 24)


def up_shimmer(sec=1.6):
    """A faint heat shimmer: glassy detuned partials with a fast flutter, and a breath of high air."""
    t = _t(sec); n = len(t)
    parts = sum(w * np.sin(2 * np.pi * f * t + p) for f, w, p in ((2400, 1, 0), (2407, 0.8, 1.3), (3100, 0.7, 2.1), (3113, 0.6, 0.4), (3900, 0.5, 3.0)))
    flut = 0.55 + 0.45 * np.sin(2 * np.pi * 9.5 * t + 0.6 * np.sin(2 * np.pi * 1.3 * t))
    y = (0.5 * _norm(parts) + 0.5 * _fn(sec, 4200, 9000, 25) / 4) * flut * np.hanning(n) ** 1.3
    return _stereo(_norm(y), np.linspace(-0.2, 0.2, n))


def up_card():
    """A very soft card slide for a statement card."""
    n = int(0.35 * SR); u = np.linspace(0, 1, n)
    return _norm(_fn(0.35, 250, 1400, 26) * np.hanning(n) ** 2 * (0.6 + 0.4 * u))


def up_thunder(sec=4.6, seed=27):
    """One thunder roll: a short crack, then low rumble in rolling waves that dies away."""
    n = int(sec * SR); t = np.arange(n) / SR
    def wave_env(onsets): return sum(a * np.minimum(1, np.maximum(0, t - o) * 18) * np.exp(-np.maximum(0, t - o) * d) * (t >= o) for o, a, d in onsets)
    lo = np.stack([_fn(sec, 35, 200, seed + k) for k in (0, 1)], axis=1) * wave_env(((0.05, 1, 1.4), (0.55, 0.8, 1.6), (1.2, 0.65, 1.5), (2.1, 0.4, 1.7)))[:, None]
    mid = np.stack([_fn(sec, 140, 700, seed + 2 + k) for k in (0, 1)], axis=1) * wave_env(((0.0, 0.8, 4.5), (0.5, 0.5, 4.0), (1.15, 0.4, 3.5)))[:, None]
    crack = _fn(sec, 900, 3800, seed + 4) * np.exp(-t * 38) * (t < 0.3) * 1.6
    y = lo * 0.9 + mid * 0.5 + crack[:, None] * 0.35
    y *= (np.minimum(1, (sec - t) * 2.5))[:, None]
    return y / np.abs(y).max()


def up_swell(sec=4.0):
    """One rising swell for the peak: a breath of air opening upward under a warm chord that climbs and blooms, then lets go."""
    n = int(sec * SR); t = np.arange(n) / SR; u = t / sec; rise = 3.5 / sec
    ramp = np.minimum(u / rise, 1) ** 2.2
    air = _norm(_bandnoise(sec, lambda v: 250 * 14 ** min(1, v / rise), 1.1, 28)) * ramp
    glide = 1 + 0.09 * np.minimum(u / rise, 1)
    chord = sum(w * np.sin(2 * np.pi * np.cumsum(f * glide) / SR) for f, w in ((110, 0.8), (165, 0.7), (220, 1.0), (277.2, 0.6), (330, 0.5), (440, 0.35)))
    tail = np.where(u <= rise, 1.0, np.exp(-(u - rise) * sec * 7))
    y = (0.65 * _norm(air) + 0.55 * _norm(chord)) * ramp * tail * np.minimum(1, t * 30)
    return _stereo(_norm(y), np.linspace(-0.25, 0.25, n))


# ---- beds: generated at the length of their scene, stereo, peak 1 ------------------------------------------------------------------
def bed_cicada(sec, seed=31):
    """A quiet, hot, cicada-like drone: a high buzzy band amplitude-modulated near 85 Hz, swelling slowly."""
    n = int(sec * SR); t = np.arange(n) / SR; out = []
    for k in (0, 1):
        r = _rng(seed + k); f_am = 85 + 9 * _slow(sec, 0.5, seed + 3 + k)
        am = (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(f_am) / SR + r.uniform(0, 6))) ** 1.4
        swell = 0.65 + 0.35 * np.sin(2 * np.pi * 0.23 * t + r.uniform(0, 6)) * (0.7 + 0.3 * _slow(sec, 0.3, seed + 7 + k))
        buzz = 0.7 * _fn(sec, 3300, 7200, seed + 11 + k) + 0.6 * np.sin(2 * np.pi * (4300 + 40 * _slow(sec, 0.4, seed + 13 + k)) * t)
        out.append(buzz * am * swell + 0.12 * _fn(sec, 400, 1500, seed + 17 + k))
    y = np.stack(out, axis=1)
    return y / np.abs(y).max()


def bed_rain(sec, seed=41):
    """Steady rain: a wide soft hiss plus a patter of tiny drops."""
    n = int(sec * SR); out = []
    kern = np.exp(-np.arange(int(0.006 * SR)) / SR * 900) * _rng(5).standard_normal(int(0.006 * SR))
    for k in (0, 1):
        r = _rng(seed + k); drops = np.zeros(n); idx = r.integers(0, n, int(sec * 140))
        np.add.at(drops, idx, r.exponential(1.0, len(idx)))
        patter = np.convolve(drops, kern, "same")
        hiss = _fn(sec, 900, 9000, seed + 3 + k, tilt=-0.4)
        out.append((hiss * 0.8 + patter * 1.0 / max(1e-9, patter.std()) * 0.55) * (1 + 0.15 * _slow(sec, 0.3, seed + 7 + k)))
    y = np.stack(out, axis=1)
    return y / np.abs(y).max()


def _droplet(f0, f1, sec, decay):
    t = _t(sec); return _glide(f0, f1, sec, 0.8) * np.exp(-t * decay) * np.minimum(1, t * 800)


def bed_trickle(sec, seed=51):
    """Water trickling into a bucket: small bright droplets, a faint stream under them."""
    n = int(sec * SR); r = _rng(seed); y = np.zeros((n, 2))
    kern = [_droplet(f, f * 1.55, 0.06, 75) for f in (1250, 1500, 1750, 2050, 2400)]
    t = 0.05
    while t < sec - 0.08:
        pan = r.uniform(-0.5, 0.5); k = kern[r.integers(len(kern))] * r.uniform(0.4, 1.0)
        i = int(t * SR); e = min(n, i + len(k))
        y[i:e] += _stereo(k[:e - i], pan)
        t += r.exponential(0.13) + 0.04
    y /= np.abs(y).max()
    stream = np.stack([_fn(sec, 1500, 4500, seed + 1), _fn(sec, 1500, 4500, seed + 2)], axis=1) * (0.5 + 0.5 * _slow(sec, 0.6, seed + 3))[:, None] * 0.07
    y = y + stream
    return y / np.abs(y).max()


def bed_bubble(sec, seed=61):
    """A pot on the boil: low bubbles that blip upward at irregular beats, over a soft rumble."""
    n = int(sec * SR); r = _rng(seed); y = np.zeros((n, 2)); t = 0.05
    while t < sec - 0.2:
        f0 = r.uniform(130, 330); k = (_droplet(f0, f0 * r.uniform(1.4, 1.9), 0.13, 20) + 0.4 * _droplet(2 * f0, 3.4 * f0, 0.13, 26)) * r.uniform(0.35, 1.0)
        i = int(t * SR); e = min(n, i + len(k)); y[i:e] += _stereo(k[:e - i], r.uniform(-0.5, 0.5))
        t += r.exponential(0.16) + 0.05
    y /= np.abs(y).max()
    rumble = np.stack([_fn(sec, 60, 280, seed + 1), _fn(sec, 60, 280, seed + 2)], axis=1) * (0.5 + 0.5 * _slow(sec, 1.2, seed + 3))[:, None] * 0.14
    hiss = np.stack([_fn(sec, 1300, 3200, seed + 4), _fn(sec, 1300, 3200, seed + 5)], axis=1) * 0.03
    y = y + rumble + hiss
    return y / np.abs(y).max()


def bed_wind(sec, seed=71):
    """A gentle breeze: low air that swells and slackens, with a thin high whistle of motion on top."""
    out = []
    for k in (0, 1):
        body = _fn(sec, 160, 1000, seed + k) * (0.6 + 0.4 * _slow(sec, 0.35, seed + 3 + k))
        hi = _fn(sec, 1400, 3400, seed + 5 + k) * (0.25 * (0.5 + 0.5 * _slow(sec, 0.25, seed + 7 + k)))
        out.append(body + hi)
    y = np.stack(out, axis=1)
    return y / np.abs(y).max()


def bed_creak(sec, seed=81):
    """A small roundabout creak, looping every 1.9 s: stick-slip pulses on a wooden resonance (~520 Hz) that rise and ease."""
    n = int(sec * SR); y = np.zeros(n); r = _rng(seed); t0 = 0.15; ev = 0.6
    while t0 < sec - 0.05:
        m = int(ev * SR); tt = np.arange(m) / SR; u = tt / ev
        f = (46 + 16 * np.sin(np.pi * u) ** 0.8) * (1 + 0.025 * r.standard_normal() + 0.02 * _slow(ev, 4, int(r.integers(1e6)))[:m])
        ph = 2 * np.pi * np.cumsum(f) / SR; res = r.uniform(460, 600)
        k = np.arange(1, 36)[:, None]; w = np.exp(-0.5 * ((k * 52 - res) / 170) ** 2) / k ** 0.3
        ev_sig = (w * np.sin(k * ph[None, :] + 0.3 * k)).sum(axis=0) * np.hanning(m) ** 1.4
        _place(y, ev_sig, int(t0 * SR), r.uniform(0.8, 1.0))
        t0 += 1.9
    y /= max(1e-9, np.abs(y).max())
    return np.stack([y, np.roll(y, int(0.0007 * SR))], axis=1)


FIXED = {"up_pop": up_pop, "up_tick": up_tick, "up_scribble": up_scribble, "up_scribble_long": lambda: up_scribble(1.4, 22), "up_strike": up_strike,
         "up_airy": up_airy, "up_airy_long": up_airy_long, "up_shimmer": up_shimmer, "up_card": up_card, "up_thunder": up_thunder, "up_swell": up_swell}
BEDS = {"up_cicada": bed_cicada, "up_rain": bed_rain, "up_trickle": bed_trickle, "up_bubble": bed_bubble, "up_wind": bed_wind, "up_creak": bed_creak}
# effect: (trim in dB against the cue level, priority when two point cues are too close). Priority None = sustained, not limited.
LEVEL = {"up_pop": (0, 2), "up_tick": (-5, 1), "up_scribble": (-3, 3), "up_scribble_long": (-3, 3), "up_strike": (1, 4), "up_card": (-9, 1),
         "up_airy": (-1, None), "up_airy_long": (-2, None), "up_shimmer": (-6, None), "up_thunder": (-1, None), "up_swell": (0, None),
         "up_cicada": (-5, None), "up_rain": (-5, None), "up_trickle": (-3, None), "up_bubble": (-3, None), "up_wind": (-4, None), "up_creak": (-4, None)}
_cache = {}


def point_effect(c):
    """Stereo array for a point cue (scribbles are made to the length of the line they write)."""
    fx = c["fx"]
    if fx == "up_scribble" and c.get("sec"): key = ("scr", round(c["sec"], 1)); fn = lambda: up_scribble(round(c["sec"], 1), 21 + int(c["f"]) % 7)
    else: key = fx; fn = FIXED[fx]
    e = _cache.setdefault(key, fn()); e = e if e.ndim == 2 else _stereo(e, c.get("pan", 0.0))
    return e / max(1.0, np.abs(e).max())                  # constant-power panning can overshoot 1: keep every point effect's peak at 1


# ---- cues from the timeline ----------------------------------------------------------------------------------------------------------
AIR = {"seabreeze-giant": ("up_airy_long", 0.0), "monsoon-sw": ("up_airy_long", -0.25), "trades-se": ("up_airy", 0.0), "somali": ("up_airy", -0.2),
       "tej": ("up_airy", 0.3), "bend": ("up_airy", 0.0), "cross": ("up_airy", -0.15),
       # Part 2 layers
       "stream-bay": ("up_airy", 0.25), "stream-arabian": ("up_airy", -0.25), "branch-arabian": ("up_airy_long", -0.2), "branch-bay": ("up_airy_long", 0.2),
       "easterlies": ("up_airy", 0.3), "depression": ("up_airy_long", 0.1)}


def scene_cues(s):
    sp, rv, k, F = s["spec"], s.get("reveals", {}), s["kind"], s["from"]; out = []
    def add(fx, f, pan=0.0, **kw): out.append({"fx": fx, "f": F + f, "pan": round(pan, 2), "scene": s["id"], **kw})
    def bed(fx, **kw): out.append({"fx": fx, "bed": True, "f": F, "frames": s["dur"], "scene": s["id"], **kw})
    at = lambda key: rv.get(key, -1)
    live = lambda key: at(key) > 2                     # keys at frame 0-2 show at once what the last scene ended on: no sound
    px = lambda x: ((x or 960) / 1920 - 0.5) * 0.7
    used = set()
    def tick(key):
        if key and live(key) and key not in used: used.add(key); add("up_tick", at(key))
    def pop(key, pan=0.0, d=0):
        if key and live(key) and key not in used: used.add(key); add("up_pop", at(key) + d, pan)

    if s["id"] == PEAK_SCENE:                          # one rising swell, ending as the newer view's label lands
        end = at("nv") if live("nv") else 150
        add("up_swell", max(0, end - 120)); used.add("nv")
    if k == "statement":
        add("up_card", 6)
    elif k == "stage":
        if sp.get("time") == "may": bed("up_cicada")
        if sp.get("rain") is True: bed("up_rain")          # "spells" (Part 2) turns to sun mid-scene: no full-length rain bed
        if any(p.get("icon") == "bucket" and p.get("state") == "filling" for p in sp.get("props", [])): bed("up_trickle")
        if sp.get("thunder"): add("up_thunder", 24)
        for b in sp.get("badges", []): pop(b.get("key"), px(b.get("x")))
        for b in ([sp["bubble"]] if sp.get("bubble") else []) + sp.get("bubbles", []): pop(b.get("key"), px(b.get("x")))
        for p in sp.get("props", []): pop(p.get("enter"), px(p.get("x")))
        for a in sp.get("actors", []): pop(a.get("enter"), px(a.get("x")))
        for p in sp.get("pills", []): tick(p.get("key"))
        for key in rv: tick(key)
    elif k == "windmap":
        for ly in sp["layers"]:
            if ly["id"] == "labels":
                for it in ly.get("items", []): tick(it.get("key"))
                continue
            key = ly.get("key")
            if ly["id"] in AIR and key and live(key):
                fx, pan = AIR[ly["id"]]; add(fx, at(key), pan); used.add(key)
            elif ly["id"] == "heatlow" and key and live(key): add("up_shimmer", at(key), 0.0); used.add(key)
            elif key: tick(key)
            if ly.get("badge"):
                bk = ly["badge"]["key"]
                if bk == key and key in used and live(bk): add("up_pop", at(bk) + 7);
                else: pop(bk)
        for key in rv: tick(key)
    elif k == "analogy":
        w = sp["which"]
        if w == "pot": bed("up_bubble")
        elif w == "breeze": bed("up_wind")
        elif w == "roundabout": bed("up_creak")
        for it in sp.get("labels", []): tick(it.get("key"))
        for key in rv: tick(key)
    elif k == "globe":
        for it in sp.get("labels", []): tick(it.get("key"))
        for key in rv: tick(key)
    elif k == "notebook":
        for it in sp["lines"]:
            if live(it["key"]): add("up_scribble", at(it["key"]), sec=min(1.7, max(0.5, 0.25 + 0.03 * len(it["text"])))); used.add(it["key"])
        st = sp.get("strike")
        if st and live(st["key"]): add("up_strike", at(st["key"])); used.add(st["key"])
    elif k == "sketch":
        for it in sp["lines"]:
            if live(it["key"]): add("up_scribble", at(it["key"]), sec=0.9); used.add(it["key"])
    return out


def build_cues():
    tl = json.load(open(os.path.join(BASE, "timeline.json")))
    cues = []
    for s in tl["scenes"]: cues += scene_cues(s)           # scene cuts: no sound
    cues.sort(key=lambda c: c["f"])
    keep, dropped = [], []                                 # point cues: at most 5 a second; of two too close the higher priority stays
    for c in cues:
        pr = LEVEL[c["fx"]][1]
        if pr is None: keep.append(c); continue
        prev = next((x for x in reversed(keep) if LEVEL[x["fx"]][1] is not None), None)
        if prev is None or c["f"] - prev["f"] >= MIN_GAP: keep.append(c)
        elif pr > LEVEL[prev["fx"]][1]: keep.remove(prev); dropped.append(prev); keep.append(c)
        else: dropped.append(c)
    return tl, keep, dropped


def cmd_cues():
    tl, keep, dropped = build_cues(); fps = tl["fps"]
    for c in keep:
        c["t"] = round(c["f"] / fps, 3)
        if c.get("bed"): c["t_end"] = round((c["f"] + c["frames"]) / fps, 3)
    json.dump({"film": FILM, "clock_fps": fps, "own_sounds": True, "peak_scene": PEAK_SCENE,
               "note": "f = logical frame (30 fps clock), t = seconds; bed cues run from t to t_end with 0.4 s fades; render fps does not matter",
               "cues": keep}, open(os.path.join(BASE, "sfx_cues.json"), "w"), indent=0)
    n = {}
    for c in keep: n[c["fx"]] = n.get(c["fx"], 0) + 1
    print(FILM, len(keep), "cues,", len(dropped), "dropped by the 5-a-second limit;", dict(sorted(n.items())))
    return tl, keep


# ---- ffmpeg ----------------------------------------------------------------------------------------------------------------------------
def ff_cmd():
    if os.path.isfile("/tmp/ffbin/ffmpeg") and os.access("/tmp/ffbin/ffmpeg", os.X_OK): return ["/tmp/ffbin/ffmpeg"]
    return ["npx", "remotion", "ffmpeg"]                  # Remotion's ffmpeg: no lavfi, but loudnorm, aac, libx264 and mp4 are there


def ff(args, **kw): return subprocess.run(ff_cmd() + args, cwd=ROOT, **kw)


def read_mono(path):
    tmp = path + ".48k.wav"
    ff(["-v", "error", "-y", "-i", path, "-vn", "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", "-f", "wav", tmp], check=True)
    w = wave.open(tmp); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768; w.close(); os.remove(tmp)
    return a


def loudness(path):
    err = ff(["-hide_banner", "-i", path, "-vn", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", err).group(0))
    return float(j["input_i"]), float(j["input_tp"])


def duration(path):
    err = ff(["-hide_banner", "-i", path], capture_output=True, text=True).stderr
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


# ---- mixing ----------------------------------------------------------------------------------------------------------------------------
def build_fx(keep, fps, total, voice):
    """Sum every cue into a stereo track at its level. `voice` (mono, same length) or None for a silent draft."""
    fx = np.zeros((total, 2)); placed = under = 0
    if voice is not None:
        hop = int(0.05 * SR); env = np.sqrt(np.convolve(voice ** 2, np.ones(hop) / hop, "same")); talk = (env > 10 ** (-38 / 20)).astype(float)
        talk_s = np.convolve(talk, np.hanning(int(0.3 * SR)) / np.hanning(int(0.3 * SR)).sum(), "same")
    for c in keep:
        i = int(round(c["f"] / fps * SR))
        if i >= total: continue
        if c.get("bed"):
            sec = c["frames"] / fps; e = _fade(BEDS[c["fx"]](sec, 100 + int(c["scene"][1:])))
            end = min(total, i + len(e)); e = e[:end - i]
            lev = GAP + LEVEL[c["fx"]][0] + ((UNDER - GAP) * talk_s[i:end] if voice is not None else 0)
            fx[i:end] += e * (10 ** (lev / 20))[:, None] if voice is not None else e * 10 ** (lev / 20)
            placed += 1; continue
        e = point_effect(c); j = i
        if j < 0: e = e[-j:]; j = 0
        end = min(total, j + len(e))
        if end <= j: continue
        speaking = voice is not None and env[j:min(end, j + int(0.4 * SR))].max(initial=0) > 10 ** (-38 / 20)
        under += bool(speaking); placed += 1
        fx[j:end] += e[:end - j] * 10 ** (((UNDER if speaking else GAP) + LEVEL[c["fx"]][0]) / 20)
    return fx, placed, under


def sidechain(fx, voice, total):
    """The voice stays on top: in each 10 ms of real speech the effects are held 8 dB under it, with a smooth gain (as long_sfx.mix)."""
    w = int(0.01 * SR); m = total // w; SPEECH, HEAD = 10 ** (-30 / 20), 10 ** (-8 / 20)
    blocks = lambda mono: np.sqrt((mono[:m * w].reshape(m, w) ** 2).mean(axis=1))
    vb, fb = blocks(voice), blocks(fx.mean(axis=1)); vs = np.convolve(vb, np.ones(5) / 5, "same"); speech = vs > SPEECH
    g = np.ones(m); hot = speech & (fb > 1e-6); g[hot] = np.minimum(1, HEAD * vs[hot] / fb[hot])
    g = np.array([g[max(0, i - 2):i + 3].min() for i in range(m)]); g = np.convolve(g, np.ones(7) / 7, "same")
    fx = fx * np.interp(np.arange(total), (np.arange(m) + 0.5) * w, g)[:, None]
    fb = blocks(fx.mean(axis=1)); both = speech & (fb > 10 ** (-70 / 20))
    return fx, 100 * (g < 0.97).mean(), (20 * np.log10(fb[both] / vs[both]) if both.any() else np.array([-99.0]))


def mix(video, voice_path, out, keep_wav=None):
    tl, keep = cmd_cues(); fps = tl["fps"]
    total = int(round(duration(video) * SR)); voice = None
    if voice_path:
        voice = read_mono(voice_path); voice = np.pad(voice, (0, max(0, total - len(voice))))[:total]
    fx, placed, under = build_fx(keep, fps, total, voice)
    note = ""
    if voice is not None:
        fx, ducked, ratio = sidechain(fx, voice, total)
        st = np.stack([voice, voice], axis=1) + fx; peak = np.abs(st).max()
        tmp = out + ".tmp.wav"; write_wav(tmp, st / max(1.0, peak)); i0, _ = loudness(tmp)
        g = 10 ** ((-16 - i0) / 20) / max(1.0, peak); ceiling = 10 ** (-1.5 / 20) / (peak * g)
        if ceiling < 1: g *= ceiling
        audio = st * g; os.remove(tmp)
        note = f"; effects against speech median {np.median(ratio):.1f} dB, over -6 dB in {100 * (ratio > -6).mean():.1f}%, ducked {ducked:.1f}% of the film"
    else:
        peak = np.abs(fx).max(); audio = fx / max(1.0, peak / 10 ** (-1 / 20))        # silent draft: gap level kept, only guarded against clipping
    wav = keep_wav or (out + ".sfx.wav"); write_wav(wav, audio)
    ff(["-v", "error", "-y", "-i", video, "-i", wav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "-f", "mp4", out], check=True)
    if not keep_wav: os.remove(wav)
    i1, tp1 = loudness(out)
    print(f"{placed} cues ({under} point cues under the voice), peak {20 * np.log10(np.abs(audio).max() + 1e-9):.1f} dBFS, {i1:.1f} LUFS, true peak {tp1:.1f} dB{note} -> {out}")


# ---- make ------------------------------------------------------------------------------------------------------------------------------
def safe_write(path, st, force=False):
    """Write a wav only to a new name; an identical rerun is a no-op; a different existing file is never replaced without --force."""
    tmp = path + ".new"; write_wav(tmp, st)
    if os.path.exists(path) and not force:
        same = open(path, "rb").read() == open(tmp, "rb").read(); os.remove(tmp)
        if not same: raise SystemExit(f"{path} exists and differs: not overwriting (use --force for our own up_ files)")
        return
    os.replace(tmp, path)


def make(force=False):
    os.makedirs(OWN, exist_ok=True); parts = []; sheet = []; pos = 0.0
    items = [(nm, FIXED[nm]()) for nm in sorted(FIXED)] + [(nm, fn(5.0)) for nm, fn in sorted(BEDS.items())]
    for nm, e in items:
        assert nm.startswith("up_")
        e = e if e.ndim == 2 else _stereo(e)
        safe_write(os.path.join(OWN, f"{nm}.wav"), e * 0.5, force)
        lev = 10 ** ((LEVEL[nm][0] - 3) / 20)                       # audition at roughly the gap level, with each trim, so it sounds like the film
        sheet.append(f"{pos:6.2f} s  {nm}  ({len(e) / SR:.2f} s)")
        parts += [e * 0.5 * 2 * lev, np.zeros((int(0.6 * SR), 2))]; pos += len(e) / SR + 0.6
    aud = np.concatenate(parts); safe_write(os.path.join(OWN, "up_audition.wav"), aud, force)
    open(os.path.join(OWN, "up_audition.txt"), "w").write("\n".join(sheet) + "\n")
    print(len(items), "effects in", OWN, "- audition", round(pos, 1), "s: peak %.1f dBFS, rms %.1f dBFS" % (20 * np.log10(np.abs(aud).max()), rms_db(aud)))
    return os.path.join(OWN, "up_audition.wav")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    m = sub.add_parser("make"); m.add_argument("--force", action="store_true")
    sub.add_parser("cues")
    x = sub.add_parser("mix"); x.add_argument("--video", required=True); x.add_argument("--voice"); x.add_argument("--out", required=True)
    a = ap.parse_args()
    if a.cmd == "make": make(a.force)
    elif a.cmd == "cues": cmd_cues()
    else:
        if os.path.abspath(a.out) == os.path.abspath(a.video): raise SystemExit("--out must be a different file from --video")
        mix(a.video, a.voice, a.out)

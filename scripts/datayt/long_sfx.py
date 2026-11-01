#!/usr/bin/env python3
"""Sound effects for a long-form film: our own sounds, synthesised here, placed from the film's timeline. Nothing is downloaded.

  .venv/bin/python scripts/datayt/long_sfx.py make                # writes public/datayt/sfx/own/*.wav and an audition file
  .venv/bin/python scripts/datayt/long_sfx.py cues A              # writes public/datayt/long/namakkal/A/sfx_cues.json
  .venv/bin/python scripts/datayt/long_sfx.py mix A en            # English mp4 with effects (video stream copied, no re-render)
  .venv/bin/python scripts/datayt/long_sfx.py mix A hi            # regional track with the same effects (hi, ta, te)

Each cue lands on the frame its picture appears (scene `from` + reveal, in the 30 fps logical clock), so the effects follow the
picture in every language; only the level changes with that language's voice. Levels follow LOOKS_SPEC: a cue peaks at -18 dBFS
under the voice and -12 dBFS in a gap, with a per-effect trim, then a side-chain holds them 8 dB under any speech. Point cues are at most 5 a second; the price line's pitch is
read from the same series the line draws. Outputs are new files: the films and tracks without effects stay as they are.
"""
import json, os, re, subprocess, sys, wave
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BASE = os.path.join(ROOT, "public/datayt/long/namakkal")
OWN = os.path.join(ROOT, "public/datayt/sfx/own")
OUT = os.path.join(ROOT, "out/datakadai/long/namakkal")
FF = "/tmp/ffbin/ffmpeg"
SR = 48000
UNDER, GAP = -18.0, -12.0
MIN_GAP = 6                                            # logical frames between point cues (5 a second)
LANGS = ("en", "hi", "ta", "te")


# ---- synthesis: every effect is mono or stereo float, peak 1 --------------------------------------------------------------------
def _t(sec): return np.arange(int(sec * SR)) / SR
def _rng(seed): return np.random.default_rng(seed)
def _norm(a): return a / max(1e-9, np.abs(a).max())


def _glide(f0, f1, sec, curve=1.0):
    u = np.linspace(0, 1, int(sec * SR)) ** curve
    return np.sin(2 * np.pi * np.cumsum(f0 * (f1 / f0) ** u) / SR)


def _bandnoise(sec, f_of_u, q=1.2, seed=1):
    """White noise through a state-variable band-pass whose centre moves with u in 0..1."""
    x = _rng(seed).standard_normal(int(sec * SR)); y = np.zeros_like(x); lo = bd = 0.0
    n = len(x)
    for i in range(n):
        g = 2 * np.sin(np.pi * min(f_of_u(i / n), SR / 6.5) / SR)
        lo += g * bd; hi = x[i] - lo - bd / q; bd += g * hi; y[i] = bd
    return y


def _stereo(a, pan=0.0):
    """pan -1..1, a number or an array over time (constant power)."""
    th = (np.asarray(pan) + 1) * np.pi / 4
    return np.stack([a * np.cos(th), a * np.sin(th)], axis=1) * np.sqrt(2)


def whoosh():
    env = np.hanning(int(0.8 * SR)) ** 1.5
    return _stereo(_norm(_bandnoise(0.8, lambda u: 350 * 10 ** (1.05 * np.sin(np.pi * u)))) * env, np.linspace(-0.6, 0.6, len(env)))


def air():
    env = np.hanning(int(0.34 * SR)) ** 2
    return _stereo(_norm(_bandnoise(0.34, lambda u: 1200 * 4 ** u, seed=2)) * env, np.linspace(-0.3, 0.3, len(env)))


def thud():
    t = _t(0.42)                                       # the 2nd and 3rd partials carry it on a phone speaker
    return _norm((_glide(110, 52, 0.42, 0.5) + 0.55 * _glide(220, 110, 0.42, 0.5) + 0.25 * _glide(440, 220, 0.42, 0.5)) * np.exp(-t * 11))


def boom():
    t = _t(1.5); tail = _bandnoise(1.5, lambda u: 500 * 0.3 ** u, seed=3)
    return _norm((_glide(80, 42, 1.5, 0.4) + 0.5 * _glide(160, 84, 1.5, 0.4) + 0.25 * _glide(320, 168, 1.5, 0.4)) * np.exp(-t * 3.2) + 0.5 * _norm(tail) * np.exp(-t * 4.5))


def riser():
    u = np.linspace(0, 1, int(1.0 * SR))
    return _norm(_norm(_bandnoise(1.0, lambda v: 300 * 16 ** v, seed=4)) * u ** 2.2 * np.minimum(1, (1 - u) * 40) + 0.35 * _glide(180, 720, 1.0, 1.4) * u ** 2 * np.minimum(1, (1 - u) * 40))


def _pop(f0, f1, sec=0.11, decay=34):
    t = _t(sec); click = _rng(5).standard_normal(len(t)) * np.exp(-t * 900) * 0.25
    return _norm((_glide(f0, f1, sec, 0.45) + 0.3 * _glide(f0 * 2, f1 * 2, sec, 0.45)) * np.exp(-t * decay) + click)


def pop(): return _pop(560, 280)
def pop_low(): return _pop(320, 165, 0.14, 26)
def pop_hi(): return _pop(1050, 640, 0.07, 55)


def tick():
    t = _t(0.05)
    return _norm(np.sin(2 * np.pi * 1750 * t) * np.exp(-t * 170) + 0.5 * np.sin(2 * np.pi * 3100 * t) * np.exp(-t * 240) + 0.3 * _rng(6).standard_normal(len(t)) * np.exp(-t * 500))


def soft():
    t = _t(0.2)
    return _norm((np.sin(2 * np.pi * 190 * t) + 0.5 * np.sin(2 * np.pi * 380 * t) + 0.2 * np.sin(2 * np.pi * 760 * t)) * np.minimum(1, t * 250) * np.exp(-t * 20))


def _lock(root):
    t = _t(0.55)                                       # a wooden knock and a short mellow bell: a number landing
    knock = (np.sin(2 * np.pi * 880 * t) + 0.6 * np.sin(2 * np.pi * 1430 * t)) * np.exp(-t * 75)
    bell = (np.sin(2 * np.pi * root * t) + 0.4 * np.sin(2 * np.pi * root * 2 * t) + 0.12 * np.sin(2 * np.pi * root * 3.01 * t)) * np.exp(-t * 7.5) * np.minimum(1, t * 400)
    return _norm(knock + 0.8 * bell)


def lock1(): return _lock(523.25)
def lock2(): return _lock(587.33)
def lock3(): return _lock(659.25)


def egg():
    t = _t(0.16)                                       # two taps on a shell
    a = sum(w * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, w, d in ((2300, 1, 110), (3650, 0.7, 150), (5200, 0.4, 210)))
    y = np.zeros(int(0.26 * SR)); y[:len(a)] += a; g = int(0.085 * SR); y[g:g + len(a)] += 0.7 * a
    return _norm(y)


def paper():
    n = int(0.46 * SR); r = _rng(7)
    flut = np.interp(np.arange(n), np.arange(0, n + 700, 700), r.uniform(0.15, 1, n // 700 + 2))
    return _stereo(_norm(_bandnoise(0.46, lambda u: 3200 - 1400 * u, 0.8, 8)) * flut * np.hanning(n) ** 0.6, np.linspace(0.25, -0.25, n))


def marker():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return _norm(_bandnoise(1.2, lambda u: 3100 + 500 * np.sin(u * 20), 3.0, 9) * (0.75 + 0.25 * np.sin(2 * np.pi * 7 * t)) * np.minimum(1, t * 30) * np.minimum(1, (1.2 - t) * 6))


def stamp():
    t = _t(0.3)
    return _norm((_glide(150, 75, 0.3, 0.4) + 0.5 * _glide(300, 150, 0.3, 0.4)) * np.exp(-t * 19) + 0.65 * _norm(_bandnoise(0.3, lambda u: 1100, 0.9, 10)) * np.exp(-t * 55))


def crate():
    t = _t(0.26)
    return _norm(sum(w * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, w, d in ((210, 1, 26), (345, 0.8, 34), (690, 0.4, 60))))


def pin():
    t = _t(0.36); n = len(t)                           # a small drop: a falling whistle into a light knock
    whistle = _glide(1500, 620, 0.16, 0.8) * np.hanning(int(0.16 * SR)) * 0.5
    y = np.zeros(n); y[:len(whistle)] = whistle; a = int(0.15 * SR)
    t2 = t[:n - a]; y[a:] += (np.sin(2 * np.pi * 620 * t2) + 0.6 * np.sin(2 * np.pi * 930 * t2)) * np.exp(-t2 * 26)
    return _norm(y)


def fill():
    t = _t(0.7)
    return _norm((np.sin(2 * np.pi * 262 * t) + 0.7 * np.sin(2 * np.pi * 392 * t) + 0.35 * np.sin(2 * np.pi * 523 * t)) * np.hanning(len(t)) ** 1.5)


def chime():
    t = _t(1.1); y = np.zeros(len(t)); g = int(0.12 * SR)
    for f, o, w in ((523.25, 0, 0.8), (783.99, g, 1.0)):
        tt = t[:len(t) - o]
        y[o:] += w * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt)) * np.exp(-tt * 5) * np.minimum(1, tt * 400)
    return _norm(y)


def drop():
    t = _t(0.62)
    return _norm((_glide(520, 150, 0.62, 0.8) + 0.3 * _glide(1040, 300, 0.62, 0.8)) * np.minimum(1, t * 60) * np.exp(-t * 3.2))


def car():
    n = int(1.8 * SR); t = np.arange(n) / SR; u = t / 1.8
    f = 62 + 26 * np.sin(np.pi * u) + 2.2 * np.sin(2 * np.pi * 9 * t); ph = 2 * np.pi * np.cumsum(f) / SR
    eng = sum(np.sin(k * ph) / k for k in range(1, 7))
    road = _norm(_bandnoise(1.8, lambda v: 700 + 500 * np.sin(np.pi * v), 0.8, 11))
    return _stereo(_norm(_norm(eng) + 0.45 * road) * np.hanning(n) ** 0.8, np.linspace(-0.75, 0.75, n))


def ticks(frames, step=6):
    """Quiet ticks climbing in pitch, one every `step` logical frames, for columns or tiles filling in."""
    k = max(1, frames // step); y = np.zeros(int((frames + 3) / 30 * SR)); t = _t(0.04)
    for i in range(k):
        f = 900 * 2 ** (i / max(1, k - 1) * 0.9 if k > 1 else 0); o = int(i * step / 30 * SR)
        a = np.sin(2 * np.pi * f * t) * np.exp(-t * 170); end = min(len(y), o + len(a)); y[o:end] += a[:end - o]
    return _norm(y)


def draw(values, y0, y1, frames_u):
    """The price line's own tone: pitch read from the series at each moment the line draws (one octave and a half over the axis)."""
    n = int(len(frames_u) / 30 * SR); xp = np.linspace(0, len(values) - 1, len(values))
    cut = np.interp(np.linspace(0, len(frames_u) - 1, n), np.arange(len(frames_u)), frames_u) * (len(values) - 1)
    v = np.interp(cut, xp, values); f = 196 * 2 ** ((v - y0) / (y1 - y0) * 1.5); ph = 2 * np.pi * np.cumsum(f) / SR
    t = np.arange(n) / SR; dur = n / SR
    return _norm((np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.1 * np.sin(3 * ph)) * np.minimum(1, t * 8) * np.minimum(1, (dur - t) * 5))


FIXED = {k: globals()[k] for k in "whoosh air thud boom riser pop pop_low pop_hi tick soft lock1 lock2 lock3 egg paper marker stamp crate pin fill chime drop car".split()}
# effect: trim in dB against the cue level, and priority when two point cues are too close. Sustained effects (None) are not limited.
LEVEL = {"whoosh": (2, None), "air": (-7, None), "thud": (3, 3), "boom": (5, None), "riser": (0, None), "pop": (0, 2), "pop_low": (0, 2), "pop_hi": (-2, 2),
         "tick": (-5, 1), "soft": (0, 1), "lock1": (2, 5), "lock2": (2, 5), "lock3": (2, 5), "egg": (-2, 3), "paper": (-3, None), "marker": (-8, None),
         "stamp": (3, 4), "crate": (0, 3), "pin": (2, 4), "fill": (-4, None), "chime": (0, None), "drop": (2, 5), "car": (-1, None), "ticks": (-7, None), "draw": (-5, None)}
_cache = {}


def effect(c):
    if c["fx"] == "ticks": return ticks(c["frames"])
    if c["fx"] == "draw": return draw(np.array(c["values"]), c["y0"], c["y1"], np.array(c["u"]))
    return _cache.setdefault(c["fx"], FIXED[c["fx"]]())


# ---- cues from the timeline ------------------------------------------------------------------------------------------------------
ICON = {"egg": "egg", "chick": "pop_hi", "hen": "pop_low", "deshen": "pop_low", "crate": "crate", "ratesheet": "paper", "doc": "paper", "car": "car", "van": "car"}


def smooth(a, b):
    u = np.clip((np.arange(a, b) - a) / max(1, b - 1 - a), 0, 1)
    return (u * u * (3 - 2 * u)).tolist()


def scene_cues(s, series):
    sp, rv = s["spec"], s.get("reveals", {}); k = s["kind"]; out = []
    def add(fx, f, pan=0.0, **kw): out.append({"fx": fx, "f": s["from"] + f, "pan": round(pan, 2), "scene": s["id"], **kw})
    def at(key): return rv.get(key, -1)
    live = lambda key: at(key) > 2                     # keys at frame 0-2 show at once what the last scene ended on: no sound
    px = lambda x: ((x or 960) / 1920 - 0.5) * 0.7

    if k == "chapter":
        add("thud", 3); add("chime", 12)
    elif k == "title":
        add("riser", -30); add("boom", 3)
        n = 0
        for st in sp.get("steps", []):
            if live(st["key"]): add("tick", at(st["key"]) + n * 12); n += 1
    elif k == "statement":
        for i, _ in enumerate(sp["lines"]): add("soft", 6 + i * 12)
    elif k == "counter":
        for i, it in enumerate(sp["items"]):
            if live(it["key"]): add(f"lock{min(i, 2) + 1}", at(it["key"]))
    elif k == "share-map":
        for l in sp.get("lit", []) + sp.get("states", []):
            if l.get("key") and live(l["key"]): add("fill", at(l["key"]))
        if sp.get("pin") and live(sp["pin"]["key"]): add("pin", at(sp["pin"]["key"]))
    elif k == "price-line":
        if not sp.get("drawn"):
            end = at(sp["drawKey"]) if sp.get("drawKey") else round(s["dur"] * 0.6)
            add("draw", 8, values=[p[1] for p in series[sp["series"]]], y0=sp["y0"], y1=sp["y1"], u=smooth(8, end))
        for i, m in enumerate(sp["marks"]):
            if live(m["key"]): add("drop" if m["key"] == "fall" else f"lock{min(i, 2) + 1}", at(m["key"]))
    elif k == "bars":
        keys = [at(m["key"]) for m in sp["marks"]] + ([at(sp["highlight"]["key"])] if sp.get("highlight") else [])
        first = min(keys)
        if first >= 30: add("ticks", 6, frames=max(6, min(200, first - 20) - 20))
        for i, m in enumerate(sp["marks"]):
            if live(m["key"]): add("drop" if m["key"] == "fall" else f"lock{min(i, 2) + 1}", at(m["key"]))
        if sp.get("highlight") and live(sp["highlight"]["key"]): add("fill", at(sp["highlight"]["key"]))
    elif k == "seasons":
        if live(sp["key"]): add("ticks", max(0, at(sp["key"]) - 10), frames=36)
        if live(sp["lowKey"]): add("lock2", at(sp["lowKey"]))
    elif k == "timeline":
        for i, p in enumerate(sp["points"]):
            if live(p["key"]): add(f"lock{min(i, 2) + 1}", at(p["key"]))
        for p in sp.get("pins", []):
            if live(p["key"]): add("pin", at(p["key"]))
    elif k == "doc":
        add("paper", 2)
        if live(sp["quoteKey"]): add("marker", at(sp["quoteKey"]))
        if sp.get("creditKey") and live(sp["creditKey"]): add("tick", at(sp["creditKey"]))
    elif k == "quote":
        add("paper", 2)
    elif k == "split":
        add("soft", 2); add("soft", 10)
        if live(sp["discKey"]): add("stamp", at(sp["discKey"]))
    elif k == "stage":
        order, known = {}, set()
        def delay(key): order[key] = order.get(key, -1) + 1; return order[key] * 4
        for a in sp.get("actors", []):
            if a.get("enter"):
                known.add(a["enter"])
                if live(a["enter"]): add("pop_low", at(a["enter"]) + delay(a["enter"]), px(a.get("x")))
        for p in sp.get("props", []):
            if p.get("enter"):
                known.add(p["enter"])
                if live(p["enter"]):
                    fx = ICON.get(p["icon"], "pop")
                    add(fx, at(p["enter"]) + (0 if fx == "car" else delay(p["enter"])), 0 if fx in ("car", "paper") else px(p.get("x")))
        for b in sp.get("badges", []):
            known.add(b["key"])
            if live(b["key"]): add("lock1", at(b["key"]), px(b.get("x")))
        for key in rv:
            if key not in known and live(key): add("tick", at(key))
    return out


def build_cues(film):
    tl = json.load(open(os.path.join(BASE, film, "timeline.json")))
    series = json.load(open(os.path.join(BASE, "figures.json")))["meta"]["nk_series"]
    cues = []
    for i, s in enumerate(tl["scenes"]):
        if i and s.get("transition") == "wipe": cues.append({"fx": "whoosh", "f": s["from"] - 12, "pan": 0, "scene": s["id"]})
        elif i: cues.append({"fx": "air", "f": s["from"] - 5, "pan": 0, "scene": s["id"]})
        cues += scene_cues(s, series)
    cues.sort(key=lambda c: c["f"])
    # point cues: at most 5 a second; of two too close, the higher priority stays
    keep, dropped = [], []
    for c in cues:
        pr = LEVEL[c["fx"]][1]
        if pr is None: keep.append(c); continue
        prev = next((x for x in reversed(keep) if LEVEL[x["fx"]][1] is not None), None)
        if prev is None or c["f"] - prev["f"] >= MIN_GAP: keep.append(c)
        elif pr > LEVEL[prev["fx"]][1]: keep.remove(prev); dropped.append(prev); keep.append(c)
        else: dropped.append(c)
    return tl, keep, dropped


def cmd_cues(film):
    tl, keep, dropped = build_cues(film)
    slim = [{k: v for k, v in c.items() if k not in ("values", "u")} for c in keep]
    json.dump({"film": film, "clock_fps": tl["fps"], "own_sounds": True, "cues": slim}, open(os.path.join(BASE, film, "sfx_cues.json"), "w"), indent=0)
    n = {}
    for c in keep: n[c["fx"]] = n.get(c["fx"], 0) + 1
    print(film, len(keep), "cues,", len(dropped), "dropped by the 5-a-second limit;", dict(sorted(n.items())))
    return tl, keep


# ---- mixing ----------------------------------------------------------------------------------------------------------------------
def read_mono(path):
    tmp = path + ".48k.wav"                            # the /tmp/ffbin wrapper only muxes wav
    subprocess.run([FF, "-v", "error", "-y", "-i", path, "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", "-f", "wav", tmp], check=True)
    w = wave.open(tmp); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768; w.close()
    os.remove(tmp)
    return a


def write_wav(path, st):
    w = wave.open(path, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()


def loudness(path):
    err = subprocess.run([FF, "-hide_banner", "-i", path, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", err).group(0))
    return float(j["input_i"]), float(j["input_tp"])


def rms_db(a):
    return 20 * np.log10(np.sqrt(np.mean(np.asarray(a) ** 2)) + 1e-9)


def mix(film, lang):
    tl, keep = cmd_cues(film)
    d = os.path.join(BASE, film)
    src = os.path.join(d, "vo", "narration.wav") if lang == "en" else os.path.join(d, "tracks", f"{film}_{lang}_DRAFT.wav")
    total = int(round(tl["total"] / tl["fps"] * SR))
    voice = read_mono(src); voice = np.pad(voice, (0, max(0, total - len(voice))))[:total]
    hop = int(0.05 * SR); env = np.sqrt(np.convolve(voice ** 2, np.ones(hop) / hop, "same"))
    fx = np.zeros((total, 2)); under = 0; placed = 0
    for c in keep:
        e = effect(c); e = e if e.ndim == 2 else _stereo(e, c.get("pan", 0.0))
        i = int(round(c["f"] / tl["fps"] * SR))
        if i < 0: e = e[-i:]; i = 0
        end = min(total, i + len(e))
        if end <= i: continue
        speaking = env[i:min(end, i + int(0.4 * SR))].max(initial=0) > 10 ** (-38 / 20)
        under += speaking; placed += 1
        fx[i:end] += e[:end - i] * 10 ** (((UNDER if speaking else GAP) + LEVEL[c["fx"]][0]) / 20)
    # the voice stays on top: in each 10 ms of real speech the effects are held 8 dB under it, with a smooth gain
    w = int(0.01 * SR); m = total // w; SPEECH, HEAD = 10 ** (-30 / 20), 10 ** (-8 / 20)
    def blocks(mono): return np.sqrt((mono[:m * w].reshape(m, w) ** 2).mean(axis=1))
    vb, fb = blocks(voice), blocks(fx.mean(axis=1))
    vs = np.convolve(vb, np.ones(5) / 5, "same"); speech = vs > SPEECH
    g = np.ones(m); hot = speech & (fb > 1e-6); g[hot] = np.minimum(1, HEAD * vs[hot] / fb[hot])
    g = np.array([g[max(0, i - 2):i + 3].min() for i in range(m)]); g = np.convolve(g, np.ones(7) / 7, "same")
    fx *= np.interp(np.arange(total), (np.arange(m) + 0.5) * w, g)[:, None]
    ducked = 100 * (g < 0.97).mean()
    fb = blocks(fx.mean(axis=1)); both = speech & (fb > 10 ** (-70 / 20))
    ratio = 20 * np.log10(fb[both] / vs[both])
    st = np.stack([voice, voice], axis=1) + fx
    os.makedirs(os.path.join(d, "tracks"), exist_ok=True)
    tmp = os.path.join(d, "tracks", f"{film}_{lang}_sfx_tmp.wav")
    peak = np.abs(st).max()
    write_wav(tmp, st / max(1.0, peak))
    i0, _ = loudness(tmp)
    g = 10 ** ((-16 - i0) / 20) / max(1.0, peak)
    ceiling = 10 ** (-1.5 / 20) / (peak * g)
    if ceiling < 1: g *= ceiling
    wav = os.path.join(d, "tracks", f"{film}_{lang}_SFX.wav")
    write_wav(wav, st * g)
    os.remove(tmp)
    i1, tp1 = loudness(wav)
    rf = ["npx", "remotion", "ffmpeg", "-v", "error", "-y"]
    if lang == "en":
        out = os.path.join(OUT, f"namakkal-{film}-english-60fps-sfx.mp4")
        subprocess.run(rf + ["-i", os.path.join(OUT, f"namakkal-{film}-english-60fps.mp4"), "-i", wav, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "-f", "mp4", out], check=True, cwd=ROOT)
    else:
        out = os.path.join(OUT, f"namakkal-{film}-{lang}-sfx_DRAFT.m4a")
        subprocess.run(rf + ["-i", wav, "-c:a", "aac", "-b:a", "192k", "-f", "mp4", out], check=True, cwd=ROOT)
    print(f"{film} {lang}: {placed} cues ({under} under the voice), {i1:.1f} LUFS, true peak {tp1:.1f} dB, effects against speech: median {np.median(ratio):.1f} dB, over -6 dB in {100 * (ratio > -6).mean():.1f}% of {len(ratio) / 100:.0f} s shared, ducked {ducked:.1f}% of the film -> {os.path.basename(out)}", flush=True)


def make():
    os.makedirs(OWN, exist_ok=True)
    names = sorted(FIXED); parts = []; sheet = []; pos = 0.0
    for nm in names:
        e = FIXED[nm](); e = e if e.ndim == 2 else _stereo(e)
        write_wav(os.path.join(OWN, f"{nm}.wav"), e * 0.5)
        sheet.append(f"{pos:6.2f} s  {nm}")
        parts += [e * 0.5, np.zeros((int(0.7 * SR), 2))]; pos += len(e) / SR + 0.7
    write_wav(os.path.join(OWN, "_audition.wav"), np.concatenate(parts))
    open(os.path.join(OWN, "_audition.txt"), "w").write("\n".join(sheet) + "\n")
    print(len(names), "effects in", OWN, "audition", round(pos, 1), "s")


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["make"]: make()
    elif a[:1] == ["cues"] and len(a) == 2: cmd_cues(a[1])
    elif a[:1] == ["mix"] and len(a) == 3 and a[2] in LANGS: mix(a[1], a[2])
    else: raise SystemExit(__doc__)

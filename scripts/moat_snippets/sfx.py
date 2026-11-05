#!/usr/bin/env python3
"""Sound effects for a Moat Snippet, made in code (no downloaded packs, no licence or credit), mixed under the voice.

    python3 scripts/moat_snippets/sfx.py A1            # needs numpy; writes assets/mix.wav and out/hyperframes/moat-snippet-a1.mp4
    python3 scripts/moat_snippets/sfx.py A1 --dry      # print the cue sheet only

Run after voice.py and the render. Cues sit on the same word anchors the scene animates on (T() in the sample's index.html),
so every sound lands on a visible action and a new voice needs no re-cueing. The synths are the ones AK approved on the
Namakkal films (scripts/datayt/long_sfx.py on datakadai/namakkal-looks, 1 Nov 2026). The voice stays on top: effects
are held 8 dB under speech in every 10 ms of it, and ffmpeg loudnorm sets the mix to -16 LUFS, true peak -1.5 dB. The video is copied, not re-rendered.
"""
import argparse, json, re, subprocess, sys, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SR = 48000
UNDER, GAP = -18.0, -12.0                              # effect level under speech / in the gaps, before each effect's own trim


# ---- synthesis (from long_sfx.py): every effect is mono or stereo float, peak 1
def _t(sec): return np.arange(int(sec * SR)) / SR
def _rng(seed): return np.random.default_rng(seed)
def _norm(a): return a / max(1e-9, np.abs(a).max())
def _glide(f0, f1, sec, curve=1.0):
    u = np.linspace(0, 1, int(sec * SR)) ** curve
    return np.sin(2 * np.pi * np.cumsum(f0 * (f1 / f0) ** u) / SR)
def _bandnoise(sec, f_of_u, q=1.2, seed=1):
    x = _rng(seed).standard_normal(int(sec * SR)); y = np.zeros_like(x); lo = bd = 0.0; n = len(x)
    for i in range(n):
        g = 2 * np.sin(np.pi * min(f_of_u(i / n), SR / 6.5) / SR); lo += g * bd; hi = x[i] - lo - bd / q; bd += g * hi; y[i] = bd
    return y
def _stereo(a, pan=0.0):
    th = (np.asarray(pan) + 1) * np.pi / 4
    return np.stack([a * np.cos(th), a * np.sin(th)], axis=1) * np.sqrt(2)
def whoosh():
    env = np.hanning(int(0.8 * SR)) ** 1.5
    return _stereo(_norm(_bandnoise(0.8, lambda u: 350 * 10 ** (1.05 * np.sin(np.pi * u)))) * env, np.linspace(-0.6, 0.6, len(env)))
def air():
    env = np.hanning(int(0.34 * SR)) ** 2
    return _stereo(_norm(_bandnoise(0.34, lambda u: 1200 * 4 ** u, seed=2)) * env, np.linspace(-0.3, 0.3, len(env)))
def thud():
    t = _t(0.42)
    return _norm((_glide(110, 52, 0.42, 0.5) + 0.55 * _glide(220, 110, 0.42, 0.5) + 0.25 * _glide(440, 220, 0.42, 0.5)) * np.exp(-t * 11))
def boom():
    t = _t(1.5); tail = _bandnoise(1.5, lambda u: 500 * 0.3 ** u, seed=3)
    return _norm((_glide(80, 42, 1.5, 0.4) + 0.5 * _glide(160, 84, 1.5, 0.4) + 0.25 * _glide(320, 168, 1.5, 0.4)) * np.exp(-t * 3.2) + 0.5 * _norm(tail) * np.exp(-t * 4.5))
def _pop(f0, f1, sec=0.11, decay=34):
    t = _t(sec); click = _rng(5).standard_normal(len(t)) * np.exp(-t * 900) * 0.25
    return _norm((_glide(f0, f1, sec, 0.45) + 0.3 * _glide(f0 * 2, f1 * 2, sec, 0.45)) * np.exp(-t * decay) + click)
def pop(): return _pop(560, 280)
def pop_low(): return _pop(320, 165, 0.14, 26)
def pop_hi(): return _pop(1050, 640, 0.07, 55)
def tick():
    t = _t(0.05)
    return _norm(np.sin(2 * np.pi * 1750 * t) * np.exp(-t * 170) + 0.5 * np.sin(2 * np.pi * 3100 * t) * np.exp(-t * 240) + 0.3 * _rng(6).standard_normal(len(t)) * np.exp(-t * 500))
def _lock(root):
    t = _t(0.55)
    knock = (np.sin(2 * np.pi * 880 * t) + 0.6 * np.sin(2 * np.pi * 1430 * t)) * np.exp(-t * 75)
    bell = (np.sin(2 * np.pi * root * t) + 0.4 * np.sin(2 * np.pi * root * 2 * t) + 0.12 * np.sin(2 * np.pi * root * 3.01 * t)) * np.exp(-t * 7.5) * np.minimum(1, t * 400)
    return _norm(knock + 0.8 * bell)
def lock1(): return _lock(523.25)
def lock2(): return _lock(587.33)
def lock3(): return _lock(659.25)
def paper():
    n = int(0.46 * SR); r = _rng(7)
    flut = np.interp(np.arange(n), np.arange(0, n + 700, 700), r.uniform(0.15, 1, n // 700 + 2))
    return _stereo(_norm(_bandnoise(0.46, lambda u: 3200 - 1400 * u, 0.8, 8)) * flut * np.hanning(n) ** 0.6, np.linspace(0.25, -0.25, n))
def stamp():
    t = _t(0.3)
    return _norm((_glide(150, 75, 0.3, 0.4) + 0.5 * _glide(300, 150, 0.3, 0.4)) * np.exp(-t * 19) + 0.65 * _norm(_bandnoise(0.3, lambda u: 1100, 0.9, 10)) * np.exp(-t * 55))
def pin():
    t = _t(0.36); n = len(t)
    whistle = _glide(1500, 620, 0.16, 0.8) * np.hanning(int(0.16 * SR)) * 0.5
    y = np.zeros(n); y[:len(whistle)] = whistle; a = int(0.15 * SR); t2 = t[:n - a]
    y[a:] += (np.sin(2 * np.pi * 620 * t2) + 0.6 * np.sin(2 * np.pi * 930 * t2)) * np.exp(-t2 * 26)
    return _norm(y)
def chime():
    t = _t(1.1); y = np.zeros(len(t)); g = int(0.12 * SR)
    for f, o, w in ((523.25, 0, 0.8), (783.99, g, 1.0)):
        tt = t[:len(t) - o]; y[o:] += w * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2 * tt)) * np.exp(-tt * 5) * np.minimum(1, tt * 400)
    return _norm(y)
def drop():
    t = _t(0.62)
    return _norm((_glide(520, 150, 0.62, 0.8) + 0.3 * _glide(1040, 300, 0.62, 0.8)) * np.minimum(1, t * 60) * np.exp(-t * 3.2))
def coin():
    t = _t(0.3)                                        # a small bright coin: two inharmonic partials, fast attack
    return _norm((np.sin(2 * np.pi * 2093 * t) + 0.6 * np.sin(2 * np.pi * 2637 * t) + 0.3 * np.sin(2 * np.pi * 4186 * t)) * np.exp(-t * 16) * np.minimum(1, t * 900))

FX = dict(whoosh=whoosh, air=air, thud=thud, boom=boom, pop=pop, pop_low=pop_low, pop_hi=pop_hi, tick=tick, lock1=lock1, lock2=lock2,
          lock3=lock3, paper=paper, stamp=stamp, pin=pin, chime=chime, drop=drop, coin=coin)
TRIM = dict(whoosh=-4, air=-6, thud=0, boom=-3, pop=-3, pop_low=-2, pop_hi=-5, tick=-10, lock1=-2, lock2=-2, lock3=-2, paper=-4, stamp=0,
            pin=-3, chime=-2, drop=-3, coin=-7)       # dB per effect, so a tick never shouts over a boom


# ---- cues: word anchors exactly as the scene finds them
def timing(sid):
    js = (ROOT / "hyperframes" / "samples" / f"s18-snippet-{sid.lower()}" / "assets" / "timing.js").read_text()
    return json.loads(js.split("=", 1)[1].strip().rstrip(";"))

def anchors(W):
    nz = lambda s: re.sub(r"\.$", "", re.sub(r"[^a-z0-9.%$]", "", s.lower()))
    cur = [0]
    def T(phrase):
        p = [nz(x) for x in phrase.split()]
        for i in range(cur[0], len(W) - len(p) + 1):
            if all(nz(W[i + k]["w"]) == x for k, x in enumerate(p)): cur[0] = i; return W[i]["t0"]
        sys.exit(f"no anchor: {phrase}")
    return T

def wipes(starts, end):                                # the two-panel wipe before each new scene and the end card
    return [(s - 0.3, "whoosh") for s in starts] + [(end - 0.2, "whoosh"), (end + 0.15, "chime")]

def cues_a1(T, end):
    A = {}
    for k, p in [("think", "think of"), ("leaving", "leaving is"), ("photos", "your photos"), ("watch", "your watch"), ("ear", "your earbuds"), ("go", "go to"),
                 ("apple", "apple has"), ("and", "and in"), ("about", "about 90%"), ("your", "your photo library"), ("if_", "if comfort")]: A[k] = T(p)
    c = [(0.05, "air"), (0.35, "pop_hi"), (0.6, "pop"), (0.85, "pop_low"),
         (A["think"] + 0.1, "lock1"), (A["leaving"], "drop"), (A["leaving"] + 0.3, "thud"),
         (A["photos"], "pop"), (A["watch"], "pop"), (A["ear"], "pop"), (A["go"], "paper"),
         (A["apple"] + 0.2, "tick"), (A["apple"] + 0.6, "tick"), (A["apple"] + 1.0, "tick"), (A["apple"] + 1.7, "lock2"),
         (A["and"], "paper"), (A["about"] + 1.3, "lock3"),
         (A["your"] + 0.05, "air"), (A["your"] + 0.7, "pop"),
         (A["if_"] + 0.05, "thud"), (A["if_"] + 0.9, "pin")]
    return c + wipes([A["think"], A["apple"], A["and"], A["your"], A["if_"]], end)

def cues_a2(T, end):
    A = {}
    for k, p in [("isnt", "isn't a phone"), ("pic", "picture a"), ("dev", "developers on"), ("you", "you on the"), ("toll", "apple takes"), ("svc", "services is"),
                 ("but", "but 44%"), ("phone", "the phone is"), ("sub", "the subscription"), ("poss", "and possibly"), ("court", "the supreme court"),
                 ("cont", "contempt fight"), ("does", "does the bridge")]: A[k] = T(p)
    c = [(0.05, "air"), (A["isnt"], "stamp"),
         (A["pic"], "thud"), (A["dev"], "pop"), (A["you"], "pop"), (A["toll"], "pin"), (A["toll"] + 0.45, "thud")]
    for i in range(7):                                 # each coin pays as it passes the booth (scene: x crosses 540 at u = 0.479 of a 1.6 s lap)
        for k in range(4):
            t = A["toll"] + 0.2 + i * 0.42 + (0.479 + k) * 1.6
            if t < A["svc"] - 0.35: c.append((t, "coin"))
    c += [(A["svc"] + 0.4, "lock1"), (A["but"] + 0.3, "lock3"),
          (A["phone"], "air"), (A["phone"] + 0.6, "stamp"), (A["sub"], "paper")]
    t, last = A["sub"], 2026                           # a tick each time the year turns over (scene: 2026 + floor(r^1.6 * 3.2))
    while t < A["court"] - 0.3:
        y = 2026 + int(((t - A["sub"]) ** 1.6) * 3.2)
        if y != last: c.append((t, "tick")); last = y
        t += 0.25
    c += [(A["poss"], "drop"), (A["court"], "boom"), (A["court"] + 0.3, "pop"), (A["cont"] + 0.35, "stamp"), (A["does"] + 0.3, "drop")]
    return c + wipes([A["pic"], A["svc"], A["phone"], A["court"], A["does"]], end)

def take(T, pairs):
    return {k: T(p) for k, p in pairs}

def cues_a4(T, end):
    A = take(T, [("brain", "brain"), ("apple", "apple says"), ("and", "and a significant"), ("pic", "picture a"), ("rents", "rents the"), ("asked", "asked about"),
                 ("tsmc", "tsmcs ceo"), ("lord", "thats landlordspeak"), ("up", "going up"), ("so", "so who"), ("chef", "the chef or")])
    c = [(0.05, "air"), (A["brain"], "lock1"), (A["apple"], "paper")] + [(A["apple"] + 0.3 + i * 0.35, "tick") for i in range(5)] + [(A["apple"] + 1.8, "pop_hi")]
    c += [(A["and"] + 0.2 + i * 0.25, "pop_low") for i in range(4)]
    c += [(A["pic"], "thud"), (A["pic"] + 0.3, "air"), (A["pic"] + 0.8, "paper"), (A["rents"], "pop"), (A["asked"], "thud"), (A["tsmc"], "pop"),
          (A["lord"], "thud"), (A["lord"] + 0.3, "pop"), (A["up"], "lock3"), (A["so"], "thud"), (A["chef"], "pop_low")]
    return c + wipes([A["apple"], A["pic"], A["asked"], A["lord"], A["so"]], end)

def cues_v1(T, end):
    A = take(T, [("because", "because a"), ("build", "build a"), ("right", "right and"), ("every", "every shop"), ("card", "and every card"), ("loop", "that loop"),
                 ("n", "45.9"), ("up", "up 15%"), ("beat", "to beat"), ("sw", "switch at"), ("who", "who organises")])
    c = [(0.05, "air"), (A["because"] + 0.1, "pop_low"), (A["because"] + 0.4, "pop"), (A["because"] + 0.7, "pop_hi")] + [(A["because"] + 0.9 + i * 0.3, "tick") for i in range(3)]
    c += [(A["build"], "thud"), (A["build"] + 0.6, "pop"), (A["right"], "drop"), (A["every"], "pop"), (A["every"] + 0.25, "pop"), (A["every"] + 0.6, "air"), (A["card"], "air")]
    c += [(A["n"] + i * 0.4, "tick") for i in range(3)] + [(A["n"] + 1.4, "lock2"), (A["up"], "stamp"), (A["beat"], "paper"), (A["sw"], "pop_hi"), (A["sw"] + 0.4, "pop_hi"),
          (A["who"] - 0.4, "air"), (A["who"] + 0.2, "pop_hi"), (A["who"] + 0.65, "pop"), (A["who"] + 1.1, "pop_low")]
    return c + wipes([A["because"], A["build"], A["every"], A["loop"], A["beat"]], end)

def cues_v2(T, end):
    A = take(T, [("near", "near 60%"), ("by", "by running"), ("pot", "the potholes"), ("when", "when you"), ("bank", "the bank takes"), ("net", "the network"), ("fee", "fee at"),
                 ("flow", "sent no flowers"), ("jul", "in july"), ("v", "59.8%"), ("m", "mastercards"), ("same", "same number"), ("most", "most businesses"), ("why", "so why")])
    c = [(0.3 + i * 0.4, "tick") for i in range(4)] + [(A["near"] + 0.4, "lock1"), (A["by"], "thud"), (A["by"] + 0.4, "pin")]
    c += [(A["pot"] + i * 0.15, "pop_low") for i in range(3)] + [(A["when"] + 0.2, "thud")] + [(A["bank"] + 0.3 + i * 0.35, "tick") for i in range(3)]
    c += [(A["net"], "air"), (A["fee"], "coin"), (A["flow"] - 0.2, "pop"), (A["flow"] + 0.4, "drop"), (A["jul"] + 0.3, "air"), (A["v"], "lock2"), (A["m"] + 0.3, "lock3"),
          (A["same"], "air"), (A["most"], "pin")] + [(A["why"] + 0.2 + i * 0.18, "pop") for i in range(5)]
    return c + wipes([A["by"], A["jul"], A["same"], A["why"]], end)

def cues_v3(T, end):
    A = take(T, [("sticker", "tiny sticker"), ("its", "its the"), ("nob", "nobody reads"), ("ev", "everybody trusts"), ("mc", "mastercards gross"), ("n", "3 trillion"),
                 ("and", "and trust"), ("food", "food poisoning"), ("so", "so what"), ("qr", "qr code")])
    c = [(0.05, "air"), (A["sticker"], "pop_hi"), (A["its"], "thud"), (A["its"] + 0.3, "pop"), (A["nob"] - 0.2, "paper"), (A["ev"], "lock1")]
    c += [(A["mc"] + 0.3 + i * 0.6, "tick") for i in range(3)] + [(A["n"] + 1.2, "lock2"), (A["and"], "air"), (A["food"], "stamp"), (A["food"] + 0.2, "drop"),
          (A["food"] + 1.3, "pop"), (A["so"], "thud"), (A["qr"] - 0.1, "pin"), (A["qr"] + 0.5, "pop_hi")]
    return c + wipes([A["its"], A["mc"], A["and"], A["so"]], end)

CUES = {"A1": cues_a1, "A2": cues_a2, "A4": cues_a4, "V1": cues_v1, "V2": cues_v2, "V3": cues_v3}


# ---- mix
def ff(*args, **kw): return subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True, **kw)

def read_mono(path, tmp):
    ff("-i", str(path), "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", str(tmp))
    w = wave.open(str(tmp)); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768; w.close(); tmp.unlink()
    return a

def write_wav(path, st):
    w = wave.open(str(path), "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()

def loudness(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", err).group(0)); return float(j["input_i"]), float(j["input_tp"])

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("id"); ap.add_argument("--dry", action="store_true"); a = ap.parse_args(); sid = a.id.upper()
    if sid not in CUES: sys.exit(f"no cue sheet for {sid}; have {', '.join(CUES)}")
    TM = timing(sid); end = TM["duration"] + 0.5
    cues = sorted((round(t, 3), f) for t, f in CUES[sid](anchors(TM["words"]), end) if t >= 0)
    if a.dry:
        for t, f in cues: print(f"{t:6.2f}  {f}")
        return
    s = ROOT / "hyperframes" / "samples" / f"s18-snippet-{sid.lower()}" / "assets"
    vid = ROOT / "out" / "hyperframes" / f"s18-snippet-{sid.lower()}.mp4"; out = ROOT / "out" / "hyperframes" / f"moat-snippet-{sid.lower()}.mp4"
    if not vid.exists(): sys.exit(f"render first: python3 hyperframes/tools/hf.py render s18-snippet-{sid.lower()}")
    vdur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(vid)], capture_output=True, text=True, check=True).stdout)
    total = int(vdur * SR)
    voice = read_mono(s / "vo.mp3", s / "vo.48k.wav"); voice = np.pad(voice, (0, max(0, total - len(voice))))[:total]
    hop = int(0.05 * SR); env = np.sqrt(np.convolve(voice ** 2, np.ones(hop) / hop, "same"))
    fx = np.zeros((total, 2)); bank = {}; under = 0
    for t, f in cues:
        e = bank.get(f); e = bank.setdefault(f, FX[f]()) if e is None else e
        e = e if e.ndim == 2 else _stereo(e)
        i = int(t * SR); j = min(total, i + len(e))
        if j <= i: continue
        speaking = env[i:min(j, i + int(0.4 * SR))].max(initial=0) > 10 ** (-38 / 20); under += speaking
        fx[i:j] += e[:j - i] * 10 ** (((UNDER if speaking else GAP) + TRIM[f]) / 20)
    # keep the voice on top: in each 10 ms of speech the effects sit at least 8 dB under it (smooth gain)
    w = int(0.01 * SR); m = total // w; SPEECH, HEAD = 10 ** (-30 / 20), 10 ** (-8 / 20)
    blocks = lambda mono: np.sqrt((mono[:m * w].reshape(m, w) ** 2).mean(axis=1))
    vb, fb = blocks(voice), blocks(fx.mean(axis=1)); vs = np.convolve(vb, np.ones(5) / 5, "same"); speech = vs > SPEECH
    g = np.ones(m); hot = speech & (fb > 1e-6); g[hot] = np.minimum(1, HEAD * vs[hot] / fb[hot])
    g = np.array([g[max(0, k - 2):k + 3].min() for k in range(m)]); g = np.convolve(g, np.ones(7) / 7, "same")
    fx *= np.interp(np.arange(total), (np.arange(m) + 0.5) * w, g)[:, None]
    st = np.stack([voice, voice], axis=1) + fx; wav = s / "mix.wav"; write_wav(wav, st / max(1.0, np.abs(st).max()))
    # the MiniMax voice is peaky (about 25 dB crest), so a plain gain can't reach -16 LUFS under -1.5 dB: loudnorm levels it, as voice.py does
    ff("-i", str(vid), "-i", str(wav), "-map", "0:v:0", "-map", "1:a:0", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{vdur}", "-movflags", "+faststart", str(out))
    i1, tp = loudness(out)
    print(f"{sid}: {len(cues)} cues ({under} under the voice), {i1:.1f} LUFS, true peak {tp:.1f} dB, ducked {100 * (g < 0.97).mean():.0f}% -> {out}")


if __name__ == "__main__":
    main()

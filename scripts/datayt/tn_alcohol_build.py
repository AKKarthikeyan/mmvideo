#!/usr/bin/env python3
"""NFHS-6 'Alcohol use among men in Tamil Nadu' map video: data + timeline + code-composed sound bed.

Writes public/datayt/tn_alcohol/data.json (values, buckets, scene timings, per-district reveal times) and public/datayt/tn_alcohol/bed.wav
(150 BPM chase cue + a pluck for every district reveal, synced to the same timeline). Geometry comes from tn_alcohol_geo.py.
Run from the repo root: python3 scripts/datayt/tn_alcohol_build.py
"""
import json, math, wave, os, numpy as np

FPS = 30
# District values as published in the NFHS-6 district map (share of men who drink alcohol, %).
# Thiruvarur's label is cut off in the source image ("32..."); set the exact figure in THIRUVARUR when confirmed.
THIRUVARUR = None   # e.g. 32.4
V = {
    "Chennai": 16.0, "Kanniyakumari": 16.4, "Tirunelveli": 17.1, "Tuticorin": 18.0, "Ranipet": 19.3,
    "Tiruchirappalli": 19.4, "Tenkasi": 19.8, "Vellore": 20.2, "Coimbatore": 20.2,
    "Thiruvallur": 21.2, "Salem": 21.4, "Tirupathur": 21.8, "Krishnagiri": 22.2, "Madurai": 22.3, "Theni": 22.7,
    "Virudhunagar": 22.7,
    "Sivaganga": 22.9, "Perambalur": 23.5, "Thanjavur": 23.7, "Dindigul": 23.9, "Chengalpattu": 24.2, "Karur": 24.3,
    "Ramanathapuram": 25.9,
    "Pudukkottai": 26.3, "Erode": 26.5, "Ariyalur": 26.6, "Namakkal": 27.2, "Tiruppur": 27.3, "Kanchipuram": 28.5,
    "Tiruvannamalai": 28.5, "Kallakurichi": 28.9,
    "Villupuram": 29.1, "Cuddalore": 29.1, "Nagapattinam": 29.2, "The Nilgiris": 29.4, "Mayiladuthurai": 30.8,
    "Dharmapuri": 30.9, "Thiruvarur": THIRUVARUR or 32.0,
}
LABEL = {k: f"{v:.1f}%" for k, v in V.items()}
if THIRUVARUR is None:
    LABEL["Thiruvarur"] = "32%+"

# Legend buckets from the source map; upper bound inclusive.
BUCKETS = [
    {"label": "Up to 20.2%", "hi": 20.2, "color": "#FBF1DC"},
    {"label": "20.2 to 22.7%", "hi": 22.7, "color": "#EBC27A"},
    {"label": "22.7 to 25.9%", "hi": 25.9, "color": "#D08D45"},
    {"label": "25.9 to 28.9%", "hi": 28.9, "color": "#A9493F"},
    {"label": "Above 28.9%", "hi": 99, "color": "#6B1E35"},
]
bucket = lambda v: next(i for i, b in enumerate(BUCKETS) if v <= b["hi"])

# Label nudges (map units) for districts whose pill would sit on a neighbour or be too small; leader line drawn.
NUDGE = {"Chennai": (70, 30), "Ranipet": (45, -85), "Kanchipuram": (0, -10), "Thiruvarur": (-30, 5),
         "Nagapattinam": (70, 40), "Mayiladuthurai": (55, 5), "Villupuram": (35, -5), "Cuddalore": (30, 0),
         "Thanjavur": (-25, 15), "Perambalur": (-25, 0), "Ariyalur": (25, 10), "Vellore": (-30, 10),
         "Thiruvallur": (-20, -15), "Chengalpattu": (5, 10)}

# Scene timeline, locked to a 150 BPM grid so cuts land on the downbeat (1 bar = 1.6 s).
BPM = 150
BEAT = 60 / BPM
BAR = 4 * BEAT
SCENES = [("title", 2 * BAR), ("draw", 2 * BAR)] + [(f"b{i}", 2 * BAR) for i in range(5)] + \
         [("all", 3 * BAR), ("top", 3 * BAR), ("bottom", 3 * BAR), ("gap", 3 * BAR), ("end", 3 * BAR)]
T, t = {}, 0.0
for k, d in SCENES:
    T[k] = [round(t, 3), round(t + d, 3)]; t += d
TOTAL = t

geo = json.load(open("public/datayt/tn_alcohol/geo.json"))
names = {d["name"] for d in geo["districts"]}
assert names == set(V), (names ^ set(V))

districts = []
for i, b in enumerate(BUCKETS):
    mem = sorted([k for k in V if bucket(V[k]) == i], key=lambda k: (V[k], k))
    s0 = T[f"b{i}"][0] + BEAT          # first district on beat 2, then one per eighth note
    for j, k in enumerate(mem):
        at = s0 + j * BEAT / 2
        districts.append({"name": k, "v": V[k], "label": LABEL[k], "bucket": i, "at": round(at, 3),
                          "nudge": NUDGE.get(k, (0, 0))})
    b["count"] = len(mem)

rank = sorted(V, key=lambda k: -V[k])
top, bottom = rank[:5], rank[::-1][:5]
data = {"fps": FPS, "total": round(TOTAL, 3), "t": T, "buckets": BUCKETS, "districts": districts,
        "top": top, "bottom": bottom, "approx": THIRUVARUR is None,
        "hi": rank[0], "lo": rank[-1], "ratio": round(V[rank[0]] / V[rank[-1]], 2)}
json.dump(data, open("public/datayt/tn_alcohol/data.json", "w"), indent=1)
print(f"total {TOTAL:.1f}s · top {top} · bottom {bottom} · ratio {data['ratio']}")
print({k: b["count"] for k, b in zip("12345", BUCKETS)})

# ---------------- score: 150 BPM chase cue in D minor ----------------
# Four-on-the-floor kick, 16th-note saw bass and string ostinato (i-VI-VII-V), offbeat hats, claps on 2 and 4,
# a riser into every cut, crash on every downbeat cut, a drop before "the gap", and a pluck per district reveal.
SR = 44100
N = int((TOTAL + 1.5) * SR)
rng = np.random.default_rng(11)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
S16 = BEAT / 4
LAYERS = {k: np.zeros(N) for k in ("kick", "bass", "str", "hat", "clap", "fx", "tick")}


def add(layer, sig, at, gain=1.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if 0 <= i < N:
        LAYERS[layer][i:j] += sig[: j - i] * gain


def saw(f, dur):
    x = np.arange(int(dur * SR)) / SR
    return 2 * ((x * f) % 1) - 1


def lowpass(sig, cutoff):
    F = np.fft.rfft(sig); fr = np.fft.rfftfreq(len(sig), 1 / SR)
    return np.fft.irfft(F / np.sqrt(1 + (fr / cutoff) ** 4), len(sig))


def adsr(n, a=0.003, r=0.03):
    e = np.ones(n); na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr)
    return e


def kick():
    x = np.arange(int(0.32 * SR)) / SR
    ph = 2 * np.pi * np.cumsum(45 + 110 * np.exp(-x * 30)) / SR
    return np.sin(ph) * np.exp(-x * 9) + 0.15 * rng.standard_normal(len(x)) * np.exp(-x * 120)


def noise_hit(dur, decay, hp=True):
    x = np.arange(int(dur * SR)) / SR
    n = rng.standard_normal(len(x))
    if hp:
        n = np.diff(n, prepend=0)
    return n * np.exp(-x * decay)


ROOTS = [38, 34, 36, 33]                         # D, Bb, C, A (bass, MIDI)
CHORDS = [[62, 65, 69], [58, 62, 65], [60, 64, 67], [57, 61, 64]]
end_music = T["end"][1] - BAR                     # last bar: just the final hit and tail
drop0, drop1 = T["gap"][0] - BEAT, T["gap"][0]    # one-beat drop before the gap hit
title_end = T["title"][1]
nbeats = int(end_music / BEAT)
for b in range(nbeats):
    t0 = b * BEAT
    bar = int(t0 / BAR); chord = bar % 4
    in_drop = drop0 <= t0 < drop1
    intro = t0 < title_end
    # kick: half-time in the title, every beat after
    if not in_drop and (not intro or b % 2 == 0):
        add("kick", kick(), t0, 1.0)
    # clap on 2 and 4 after the title
    if not intro and not in_drop and b % 2 == 1:
        add("clap", noise_hit(0.18, 28), t0, 0.5)
    for k in range(4):
        ts = t0 + k * S16
        if in_drop:
            continue
        # bass: 16ths, octave jump on the last 16th of each beat
        m = ROOTS[chord] + (12 if k == 3 else 0)
        if not intro or b >= 4:
            sig = saw(hz(m), S16 * 0.9) + 0.5 * saw(hz(m) * 1.005, S16 * 0.9)
            add("bass", sig * adsr(len(sig), 0.002, 0.02), ts, 0.5 if k else 0.35)
        # strings ostinato: chord tones up and down
        if not intro:
            note = CHORDS[chord][[0, 1, 2, 1][k]] + (12 if bar % 2 else 0)
            sig = saw(hz(note), S16 * 0.8) + saw(hz(note) * 1.004, S16 * 0.8)
            add("str", sig * adsr(len(sig), 0.004, 0.03), ts, 0.22)
        # hats: offbeat open-ish, 16th ticks
        if not intro or b % 2 == 1:
            add("hat", noise_hit(0.05 if k % 2 else 0.12, 90 if k % 2 else 40), ts, 0.10 if k % 2 else (0.22 if k == 2 else 0.06))

# risers into every cut + crash on the downbeat
for k, (a, b) in T.items():
    if k == "title":
        continue
    L = int(BAR * SR); x = np.arange(L) / SR
    r = rng.standard_normal(L) * (x / BAR) ** 3
    add("fx", np.diff(r, prepend=0) * 0.6 + np.sin(2 * np.pi * np.cumsum(300 + 1500 * (x / BAR) ** 2) / SR) * 0.08 * (x / BAR) ** 2, a - BAR, 0.5)
    add("fx", noise_hit(1.6, 3.5), a, 0.35)
    add("kick", kick(), a, 0.6)
# toms fill in the last beat before each band
for i in range(5):
    a = T[f"b{i}"][0]
    for j, m in enumerate([50, 47, 43, 40]):
        x = np.arange(int(0.12 * SR)) / SR
        add("kick", np.sin(2 * np.pi * hz(m) * x) * np.exp(-x * 25), a - BEAT + j * S16, 0.45)
# the gap: sub boom + crash
x = np.arange(int(1.8 * SR)) / SR
add("kick", np.sin(2 * np.pi * np.cumsum(70 * np.exp(-x * 0.8)) / SR) * np.exp(-x * 2.2), T["gap"][0], 1.2)
# final hit
add("kick", kick(), end_music, 1.2)
add("fx", noise_hit(2.5, 1.8), end_music, 0.5)
x = np.arange(int(2.5 * SR)) / SR
for m in [38, 50, 62, 65, 69]:
    add("str", (saw(hz(m), 2.5) + saw(hz(m) * 1.003, 2.5)) * np.exp(-x * 1.4), end_music, 0.12)

# district reveal plucks, pitched up the D-minor scale per band
for d in districts:
    L = int(0.18 * SR); x = np.arange(L) / SR
    f = hz([74, 76, 77, 79, 81][d["bucket"]] + (5 if d["v"] >= 30 else 0))
    add("tick", (np.sin(2 * np.pi * f * x) + 0.4 * np.sin(2 * np.pi * 2 * f * x)) * np.exp(-x * 26), d["at"], 0.35)

LAYERS["bass"] = lowpass(LAYERS["bass"], 700)
LAYERS["str"] = lowpass(LAYERS["str"], 3200)
LAYERS["hat"] = LAYERS["hat"] - lowpass(LAYERS["hat"], 6000)
# sidechain pump: duck bass and strings after every beat
tt = np.arange(N) / SR
pump = 1 - 0.55 * np.exp(-((tt % BEAT) / 0.07))
mix = LAYERS["kick"] * 0.9 + (LAYERS["bass"] * 1.4 + LAYERS["str"]) * pump + LAYERS["hat"] * 1.6 + LAYERS["clap"] \
      + LAYERS["fx"] + LAYERS["tick"]
mix = np.tanh(mix * 1.3) / np.tanh(1.3)            # glue / soft clip
fade = np.ones(N); nf = int(0.05 * SR); fade[:nf] = np.linspace(0, 1, nf)
nf = int(1.2 * SR); fade[-nf:] = np.linspace(1, 0, nf)
mix *= fade
mix /= max(1e-9, np.abs(mix).max()) / 0.85
st = np.stack([mix + 0.15 * np.roll(LAYERS["hat"], 300), mix + 0.15 * np.roll(LAYERS["str"], 500)], 1)
st /= np.abs(st).max() / 0.89
with wave.open("public/datayt/tn_alcohol/bed.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("wrote public/datayt/tn_alcohol/data.json, public/datayt/tn_alcohol/bed.wav")

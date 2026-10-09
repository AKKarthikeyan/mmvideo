#!/usr/bin/env python3
"""NFHS-6 'Alcohol use among men in Tamil Nadu' map video: data + timeline + code-composed sound bed.

Writes public/tnmap/data.json (values, buckets, scene timings, per-district reveal times) and public/tnmap/bed.wav
(soft pad + a tick for every district reveal, synced to the same timeline). Geometry comes from tn_alcohol_geo.py.
Run from the repo root: python3 scripts/tn_alcohol_build.py
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

# Scene timeline (seconds).
SCENES = [("title", 4.5), ("draw", 5.5)] + [(f"b{i}", 4.6) for i in range(5)] + \
         [("all", 6.5), ("top", 7.5), ("bottom", 7.5), ("gap", 6.5), ("end", 6.0)]
T, t = {}, 0.0
for k, d in SCENES:
    T[k] = [round(t, 3), round(t + d, 3)]; t += d
TOTAL = t

geo = json.load(open("public/tnmap/geo.json"))
names = {d["name"] for d in geo["districts"]}
assert names == set(V), (names ^ set(V))

districts = []
for i, b in enumerate(BUCKETS):
    mem = sorted([k for k in V if bucket(V[k]) == i], key=lambda k: (V[k], k))
    s0 = T[f"b{i}"][0] + 0.55
    for j, k in enumerate(mem):
        at = s0 + j * min(0.32, 2.0 / max(1, len(mem)))
        districts.append({"name": k, "v": V[k], "label": LABEL[k], "bucket": i, "at": round(at, 3),
                          "nudge": NUDGE.get(k, (0, 0))})
    b["count"] = len(mem)

rank = sorted(V, key=lambda k: -V[k])
top, bottom = rank[:5], rank[::-1][:5]
data = {"fps": FPS, "total": round(TOTAL, 3), "t": T, "buckets": BUCKETS, "districts": districts,
        "top": top, "bottom": bottom, "approx": THIRUVARUR is None,
        "hi": rank[0], "lo": rank[-1], "ratio": round(V[rank[0]] / V[rank[-1]], 2)}
json.dump(data, open("public/tnmap/data.json", "w"), indent=1)
print(f"total {TOTAL:.1f}s · top {top} · bottom {bottom} · ratio {data['ratio']}")
print({k: b["count"] for k, b in zip("12345", BUCKETS)})

# ---------------- sound bed ----------------
SR = 44100
N = int((TOTAL + 0.5) * SR)
mix = np.zeros(N)
rng = np.random.default_rng(11)
tt = np.arange(N) / SR
hz = lambda m: 440 * 2 ** ((m - 69) / 12)


def add(sig, at, gain=1.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if 0 <= i < N:
        mix[i:j] += sig[: j - i] * gain


# Pad: slow chords (Am - F - C - G), 4 chords cycling every ~6.5 s, soft attack, detuned saws filtered by averaging.
CH = [[57, 60, 64], [53, 57, 60], [48, 55, 64], [55, 59, 62]]
seg = 6.5
for n in range(int(TOTAL / seg) + 1):
    t0 = n * seg; L = int((seg + 2.0) * SR); x = np.arange(L) / SR
    e = np.minimum(1, x / 1.6) * np.clip((seg + 2.0 - x) / 2.0, 0, 1)
    sig = np.zeros(L)
    for m in CH[n % 4]:
        f = hz(m)
        for det in (-0.12, 0.12):
            sig += np.sin(2 * np.pi * f * (1 + det / 100) * x) * 0.5 + np.sin(2 * np.pi * 2 * f * x) * 0.08
    sig += np.sin(2 * np.pi * hz(CH[n % 4][0] - 12) * x) * 0.6
    add(sig * e, t0, 0.045)

# Tick per district reveal: short pitched pluck rising with the bucket.
for d in districts:
    L = int(0.22 * SR); x = np.arange(L) / SR
    f = hz(72 + [0, 2, 4, 7, 9][d["bucket"]] + (2 if d["v"] >= 30 else 0))
    sig = (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x)) * np.exp(-x * 22)
    add(sig, d["at"], 0.18)

# Soft whoosh into each scene + low hit on the gap reveal.
for k, (a, b) in T.items():
    if k == "title":
        continue
    L = int(0.6 * SR); x = np.arange(L) / SR
    noise = np.convolve(rng.standard_normal(L), np.ones(40) / 40, "same")
    add(noise * np.sin(np.pi * x / 0.6) ** 2, a - 0.45, 0.25)
L = int(1.4 * SR); x = np.arange(L) / SR
add(np.sin(2 * np.pi * 55 * x * (1 - 0.15 * x)) * np.exp(-x * 3), T["gap"][0] + 0.9, 0.5)

fade = np.ones(N); nf = int(2.5 * SR); fade[-nf:] = np.linspace(1, 0, nf); fade[: int(0.3 * SR)] = np.linspace(0, 1, int(0.3 * SR))
mix *= fade
mix /= max(1e-9, np.abs(mix).max()) / 0.7
st = np.stack([mix, np.roll(mix, int(0.012 * SR))], 1)
with wave.open("public/tnmap/bed.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("wrote public/tnmap/data.json, public/tnmap/bed.wav")

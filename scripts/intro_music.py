#!/usr/bin/env python3
"""Code-composed score for the channel intro, synced to its frames (no third-party provider).
Sections: projector leader -> vintage piano (old film + sepia) -> riser + hit on the colour wipe -> modern pulse -> logo swell.
Music is ducked under every narration line. Writes public/intro/music.wav."""
import json, math, wave, numpy as np

SR = 44100
B = json.load(open("/Volumes/DarwinSSD/MMVideo/public/intro/beats.json"))
t = 50; speech = []; starts = {}
for b in B:
    n = math.ceil((b["sec"] + 0.6) * 30); starts[b["key"]] = t / 30; speech.append((t / 30, (t + b["sec"] * 30) / 30)); t += n
TOTAL = (t + 20) / 30
WIPE = starts["c4"] + 44 / 30          # torn-paper wipe completes
LOGO = starts["c8"]
N = int(TOTAL * SR)
rng = np.random.default_rng(7)
mix = np.zeros(N)

def add(sig, at, gain=1.0):
    i = int(at * SR); j = min(N, i + len(sig))
    if i < N: mix[i:j] += sig[: j - i] * gain

def env(n, a=0.005, r=0.05):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e

def hz(note):  # MIDI -> Hz
    return 440 * 2 ** ((note - 69) / 12)

def piano(note, dur, vel=0.5):
    n = int((dur + 1.2) * SR); tt = np.arange(n) / SR; f = hz(note); s = np.zeros(n)
    for k in range(1, 7):
        s += (1 / k ** 1.4) * np.sin(2 * np.pi * k * f * (1 + 0.0004 * k * k) * tt) * np.exp(-tt * (1.2 + 0.7 * k))
    return s * env(n, 0.004, 0.3) * vel

def pad(notes, dur, vel=0.15):
    n = int(dur * SR); tt = np.arange(n) / SR; s = np.zeros(n)
    for nt in notes:
        for det in (-0.12, 0.0, 0.12):
            f = hz(nt + det)
            for k in range(1, 5): s += (1 / k ** 1.6) * np.sin(2 * np.pi * k * f * tt + k)
    s /= len(notes) * 3
    return s * env(n, 0.6, 0.8) * vel

def pluck(note, vel=0.35):
    n = int(0.6 * SR); tt = np.arange(n) / SR; f = hz(note)
    s = sum((1 / k ** 1.2) * np.sin(2 * np.pi * k * f * tt) * np.exp(-tt * (6 + 3 * k)) for k in range(1, 6))
    return s * env(n, 0.002, 0.05) * vel

def bass(note, dur, vel=0.4):
    n = int(dur * SR); tt = np.arange(n) / SR; f = hz(note)
    s = np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)
    return s * env(n, 0.01, 0.08) * np.exp(-tt * 1.5) * vel

def kick(vel=0.7):
    n = int(0.35 * SR); tt = np.arange(n) / SR
    f = 45 + 80 * np.exp(-tt * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 9) * vel

def shaker(vel=0.08):
    n = int(0.07 * SR); s = rng.standard_normal(n); s = np.diff(s, prepend=0)
    return s * np.exp(-np.arange(n) / SR * 60) * vel

def click(vel=0.25):
    n = int(0.02 * SR); return rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 400) * vel

def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")

# ---- leader: projector clicks on each countdown number + motor hum
for i in range(3): add(click(0.35), i * 16 / 30)
tl = np.arange(int(starts["c1"] * SR)) / SR
add(0.03 * np.sin(2 * np.pi * 60 * tl) * np.linspace(0.3, 1, len(tl)), 0)

# ---- vintage: A minor waltz-ish piano, 84 bpm, from c1 to the wipe
beat = 60 / 84
prog = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]   # Am F C G
mel = [76, 74, 72, 71, 72, 69, 67, 69, 72, 71, 69, 67]
vin = np.zeros(N); tt0 = starts["c1"]; bar = 0; x = tt0
while x < WIPE - 1.2:
    root, ch = prog[bar % 4]
    seg = np.zeros(N)
    def put(sig, at, g=1.0):
        i = int(at * SR); j = min(N, i + len(sig)); vin[i:j] += sig[: j - i] * g
    put(piano(root - 12, beat * 3, 0.45), x)
    for k in range(3):
        put(piano(ch[k % 3] + 12 * (k == 2), beat * 0.9, 0.22), x + beat * (k + (0 if k == 0 else 0)))
    if bar >= 1:
        put(piano(mel[bar % len(mel)], beat * 2, 0.28), x + beat * 0.02)
        put(piano(mel[(bar + 3) % len(mel)], beat, 0.2), x + beat * 2)
    x += beat * 3; bar += 1
# sepia from c2: add a soft string pad under the piano
x = starts["c2"]; bar = 0
while x < WIPE - 1.2:
    _, ch = prog[bar % 4]; add(pad([n + 12 for n in ch], beat * 3.2, 0.12), x); x += beat * 3; bar += 1
# old-record colouring: soften, crackle, hiss
vin = lowpass(vin, 6)
crackle = np.zeros(N); idx = rng.integers(0, int(WIPE * SR), 900); crackle[idx] = rng.uniform(-0.25, 0.25, len(idx))
crackle = lowpass(crackle, 3); hiss = lowpass(rng.standard_normal(N), 12) * 0.006
old = np.zeros(N); end = int(WIPE * SR); old[:end] = 1
mix += (vin + crackle * 0.5 + hiss) * old

# ---- riser into the wipe, hit exactly on it
rl = 2.2; n = int(rl * SR); tr = np.arange(n) / SR
noise = lowpass(rng.standard_normal(n), 4) * (tr / rl) ** 2 * 0.25
sweep = np.sin(2 * np.pi * np.cumsum(200 + 700 * (tr / rl) ** 2) / SR) * (tr / rl) ** 2 * 0.12
add(noise + sweep, WIPE - rl)
add(kick(0.9), WIPE); add(piano(36, 2.0, 0.5), WIPE)
hn = int(1.6 * SR); add(np.diff(rng.standard_normal(hn), prepend=0) * np.exp(-np.arange(hn) / SR * 3) * 0.06, WIPE)

# ---- modern pulse: 100 bpm from the wipe to the logo
bt = 60 / 100; prog2 = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]   # C G Am F
x = WIPE; bar = 0
while x < LOGO - 0.05:
    root, ch = prog2[bar % 4]
    add(pad(ch, bt * 4.2, 0.11), x)
    for q in range(4):
        tq = x + q * bt
        if tq >= LOGO: break
        add(kick(0.45 if q % 2 == 0 else 0.3), tq)
        add(bass(root - 12 if q != 2 else root - 5, bt * 0.9, 0.3), tq)
        for e in range(2): add(shaker(0.06 if e else 0.09), tq + e * bt / 2)
        arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12]
        for e in range(2): add(pluck(arp[(q * 2 + e) % 4], 0.14), tq + e * bt / 2)
    x += bt * 4; bar += 1

# ---- logo: resolving C major swell, fading to the end
add(kick(0.7), LOGO); add(pad([48, 55, 60, 64, 67, 72], TOTAL - LOGO + 0.2, 0.3), LOGO)
for i, nt in enumerate([60, 64, 67, 72]): add(piano(nt, 3.0, 0.3), LOGO + i * 0.12)

# ---- simple room reverb
rev = mix.copy()
for d, g in [(0.043, 0.35), (0.077, 0.25), (0.113, 0.18), (0.171, 0.12)]:
    k = int(d * SR); rev[k:] += mix[:-k] * g
mix = rev

# ---- duck under narration, swell in gaps
g = np.full(N, 1.0)
for a, b in speech:
    g[int(a * SR):int((b + 0.1) * SR)] = 0.32
g = np.convolve(g, np.ones(int(0.25 * SR)) / int(0.25 * SR), mode="same")
mix *= g
# fade in/out, normalise music bus to about -16 dBFS peak
mix[: int(0.3 * SR)] *= np.linspace(0, 1, int(0.3 * SR))
mix[-int(3 * SR):] *= np.linspace(1, 0, int(3 * SR))
mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.45
st = np.stack([mix, np.roll(mix, int(0.011 * SR)) * 0.96], axis=1)   # slight stereo width
pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
with wave.open("/Volumes/DarwinSSD/MMVideo/public/intro/music.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f"music.wav {TOTAL:.2f}s  wipe {WIPE:.2f}s  logo {LOGO:.2f}s  speech segments {len(speech)}")

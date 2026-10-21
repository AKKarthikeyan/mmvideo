#!/usr/bin/env python3
"""Sound cues for the Katha films, synthesised in numpy (no samples, nothing to license): a conch (shankha) blast, bansuri
flute phrases in raga Bhupali (Sa Re Ga Pa Dha, Sa = C#4 to sit on the tanpura bed's Sa = C#3), and a soft swell for the
light of Gita 11. Writes public/katha/sfx/*.wav (wav files are not in git; run this before rendering).
  python3 scripts/katha/sounds.py"""
import pathlib, numpy as np, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "dharma"))
from tanpura import write_wav

SR = 44100
OUT = pathlib.Path(__file__).resolve().parent.parent.parent / "public" / "katha" / "sfx"
rng = np.random.default_rng(7)

def env(n, a, d, r, peak=1.0):
    e = np.ones(n) * peak; A, R = int(a * SR), int(r * SR)
    e[:A] = np.linspace(0, peak, A) ** 1.6; e[-R:] *= np.linspace(1, 0, R) ** 1.4
    return e

def lowpass(x, cut):
    # one-pole low-pass, twice
    a = np.exp(-2 * np.pi * cut / SR); y = np.zeros_like(x); s = 0.0
    for _ in range(2):
        for i in range(len(x)): s = a * s + (1 - a) * x[i]; y[i] = s
        x, s = y.copy(), 0.0
    return y

def reverb(x, wet=0.28, room=1.0):
    y = x.copy()
    for d, g in [(0.029, 0.6), (0.037, 0.55), (0.043, 0.5), (0.051, 0.45), (0.067, 0.4), (0.083, 0.35), (0.11, 0.3), (0.149, 0.22)]:
        k = int(d * room * SR); y[k:] += g * wet * x[:-k]
    tail = int(1.4 * SR); out = np.concatenate([y, np.zeros(tail)])
    for d, g in [(0.21, 0.35), (0.33, 0.25), (0.47, 0.18), (0.71, 0.12)]:
        k = int(d * room * SR); out[k:] += g * wet * out[:-k]
    return out

def conch(dur=4.2, f0=277.18 * 1.0, voices=3):
    n = int(dur * SR); t = np.arange(n) / SR; sig = np.zeros(n)
    for v in range(voices):
        det = 1 + (v - 1) * 0.006; glide = 1 - 0.06 * np.exp(-t * 5)          # the pitch rises into the note
        vib = 1 + 0.004 * np.sin(2 * np.pi * (4.6 + v * 0.3) * t) * np.clip(t - 0.6, 0, 1)
        ph = 2 * np.cumsum(np.pi * f0 * det * glide * vib / SR)
        for h in range(1, 14):                                                  # bright, brassy, a strong second and third
            amp = (1 / h ** 0.85) * (1.3 if h in (2, 3) else 1) * (0.6 if h > 8 else 1)
            sig += amp * np.sin(h * ph + v)
    breath = lowpass(rng.standard_normal(n), 1800) * 0.25
    sig = sig / np.abs(sig).max() + breath
    sig *= env(n, 0.35, 0, 1.3) * (1 + 0.08 * np.sin(2 * np.pi * 5.2 * t))
    return reverb(sig, 0.35, 1.3)

BHUPALI = {"S": 0, "R": 2, "G": 4, "P": 7, "D": 9, "S'": 12, "R'": 14, "D,": -3, "P,": -5}
def flute(phrase, sa=277.18, beat=0.62):
    """phrase: list of (note, beats); glides between notes (meend), breathy bansuri tone with vibrato."""
    total = sum(b for _, b in phrase) * beat + 1.2; n = int(total * SR); t = np.arange(n) / SR
    f = np.zeros(n); amp = np.zeros(n); pos = 0
    for i, (note, b) in enumerate(phrase):
        k = int(b * beat * SR); target = sa * 2 ** (BHUPALI[note] / 12)
        prev = f[pos - 1] if pos else target
        g = int(min(0.12, b * beat * 0.4) * SR)
        f[pos:pos + k] = target; f[pos:pos + g] = np.linspace(prev, target, g)
        a = np.ones(k); a[: int(0.05 * SR)] = np.linspace(0.3 if i else 0, 1, int(0.05 * SR)); amp[pos:pos + k] = a
        pos += k
    f[pos:] = f[pos - 1]; amp[pos:] = np.linspace(1, 0, n - pos) ** 2
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.1 * t) * np.clip((t % 2.0) / 0.8, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib / SR)
    tone = np.sin(ph) + 0.22 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    breath = lowpass(rng.standard_normal(n), 3200) * 0.16
    sig = (tone + breath * (0.6 + 0.4 * np.sin(ph * 0.5))) * amp * env(n, 0.08, 0, 0.6)
    return reverb(sig, 0.4, 1.6)

def swell(dur=9.0, sa=138.59):
    n = int(dur * SR); t = np.arange(n) / SR; sig = np.zeros(n)
    for r, a in [(1, 1), (1.5, 0.7), (2, 0.8), (3, 0.35), (4, 0.3), (6, 0.15)]:
        for d in (-0.002, 0.0, 0.003):
            sig += a * np.sin(2 * np.pi * sa * r * (1 + d) * t + r)
    sig *= (np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5) * (1 + 0.1 * np.sin(2 * np.pi * 0.25 * t))
    return reverb(sig / np.abs(sig).max(), 0.45, 1.8)

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    stereo = lambda x, w=0.12: np.stack([x * (1 - w), np.concatenate([np.zeros(int(0.011 * SR)), x[:-int(0.011 * SR)]]) * (1 - w) + x * w], 1)
    write_wav(OUT / "conch.wav", stereo(conch()), 0.9)
    phrases = [
        [("S", 2), ("R", 1), ("G", 2), ("P", 1), ("G", 1), ("R", 1), ("S", 3)],
        [("G", 1), ("P", 1), ("D", 2), ("S'", 2), ("D", 1), ("P", 1), ("G", 3)],
        [("P,", 1), ("D,", 1), ("S", 2), ("R", 1), ("G", 2), ("R", 1), ("S", 1), ("D,", 1), ("S", 3)],
        [("S'", 2), ("D", 1), ("P", 2), ("G", 1), ("R", 1), ("G", 1), ("S", 4)],
    ]
    for i, p in enumerate(phrases, 1): write_wav(OUT / f"flute{i}.wav", stereo(flute(p)), 0.7)
    write_wav(OUT / "swell.wav", stereo(swell()), 0.7)
    for p in sorted(OUT.glob("*.wav")): print(p.relative_to(OUT.parent.parent.parent), round(p.stat().st_size / SR / 4, 1), "s")

#!/usr/bin/env python3
"""Compose the Surasamharam film's score in code and write public/katha/sura/score[-lang].wav (not in git; regenerate).

  python3 scripts/katha/sura_score.py en ta hi

AK, 16 Nov 2026: the plain tanpura loop under the first cut was "very bad". This is a scored bed that follows the film,
beat by beat (it reads the beat times from the film's data): a plucked tanpura and a soft pad; a veena-like plucked
lead with slides; a bansuri-like flute; a frame drum for the war; a bell on the verse cards and at the split. Arun's
evening is in a dark pentatonic (S g m P n); the text's world and the morning are in Mohanam (S R G P D).
Nothing is sampled or licensed: every sound is synthesised here with numpy. Nobody has listened to it in this
session; AK must judge it by ear."""
import json, sys, wave, pathlib
import numpy as np
ROOT = pathlib.Path(__file__).resolve().parents[2]
SR = 44100
SA = 138.59                                   # C#3, the film's Sa
DARK = [0, 3, 5, 7, 10]                        # S g m P n
MOH = [0, 2, 4, 7, 9]                          # S R G P D (Mohanam)
def hz(semi, octave=0): return SA * 2 ** (octave + semi / 12)
def deg(scale, d):                             # scale degree d (may run past the octave either way) -> semitones
    return scale[d % 5] + 12 * (d // 5)
class Mix:
    def __init__(self, sec): self.n = int(sec * SR) + SR * 4; self.L = np.zeros(self.n); self.R = np.zeros(self.n)
    def add(self, t, x, g=1.0, pan=0.0):
        i = int(t * SR)
        if i >= self.n or i < 0: return
        x = x[: self.n - i]; a = np.cos((pan + 1) * np.pi / 4), ; b = np.sin((pan + 1) * np.pi / 4)
        self.L[i:i + len(x)] += x * g * a[0]; self.R[i:i + len(x)] += x * g * b
def env(n, a, r):                              # attack / release in samples, flat between
    e = np.ones(n); a = min(a, n // 2); r = min(r, n - a)
    if a > 0: e[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2
    if r > 0: e[-r:] = np.cos(np.linspace(0, np.pi / 2, r)) ** 2
    return e
def pluck_ks(f, dur, bright=0.5, seed=0):      # Karplus-Strong string: the tanpura
    n = int(dur * SR); D = max(2, int(SR / f)); rng = np.random.default_rng(seed)
    buf = rng.uniform(-1, 1, D); buf = np.convolve(buf, np.ones(3) / 3, "same")
    out = np.empty(n); k = 0
    while k < n:
        m = min(D, n - k); out[k:k + m] = buf[:m]; k += m
        buf = (bright * buf + (1 - bright) * np.roll(buf, 1)) * 0.996
    return out * env(n, 30, int(0.4 * SR))
def lead(f0, f1, dur, glide=0.09, vib=0.0, seed=0):   # a plucked string that slides into its note: the veena
    n = int(dur * SR); t = np.arange(n) / SR
    g = np.clip(t / glide, 0, 1); f = f0 + (f1 - f0) * (3 * g * g - 2 * g ** 3)
    f = f * (1 + vib * 0.006 * np.sin(2 * np.pi * 5.2 * t) * np.clip((t - 0.25) * 3, 0, 1))
    ph = 2 * np.pi * np.cumsum(f) / SR; x = np.zeros(n)
    for k in range(1, 9): x += np.sin(k * ph + 0.3 * k) / k ** 1.25 * np.exp(-t * (1.1 + 0.75 * k))
    x += 0.4 * np.sin(ph) * np.exp(-t * 0.9)
    return x * env(n, 90, int(0.08 * SR))
def flute(f0, f1, dur, seed=0):                # a breathy pipe: the bansuri
    n = int(dur * SR); t = np.arange(n) / SR; rng = np.random.default_rng(seed)
    g = np.clip(t / 0.12, 0, 1); f = f0 + (f1 - f0) * (3 * g * g - 2 * g ** 3)
    f = f * (1 + 0.007 * np.sin(2 * np.pi * 4.6 * t) * np.clip((t - 0.3) * 2, 0, 1))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.28 * np.sin(2 * ph) + 0.1 * np.sin(3 * ph)
    br = np.convolve(rng.normal(0, 1, n), np.ones(24) / 24, "same") * 0.5
    return (x + br * 0.6) * env(n, int(0.09 * SR), int(0.22 * SR)) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.7 * t))
def bell(f, dur=7.0):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for r, a, d in [(1, 1, 0.55), (2.0, 0.5, 0.8), (2.76, 0.42, 1.0), (5.4, 0.22, 1.7), (8.93, 0.1, 2.6)]: x += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d)
    return x * env(n, 40, int(0.5 * SR))
def drum(kind, seed=0):                        # "dhum": a low skin; "ta": a dry rim
    rng = np.random.default_rng(seed)
    if kind == "dhum":
        n = int(0.5 * SR); t = np.arange(n) / SR; f = 62 + 70 * np.exp(-t * 28)
        return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) + 0.15 * rng.normal(0, 1, n) * np.exp(-t * 60))
    n = int(0.16 * SR); t = np.arange(n) / SR
    x = np.convolve(rng.normal(0, 1, n), np.ones(5) / 5, "same") * np.exp(-t * 55) + 0.5 * np.sin(2 * np.pi * 330 * t) * np.exp(-t * 40)
    return x
def pad(freqs, dur):                           # a soft held chord of pure tones, breathing
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for i, f in enumerate(freqs): x += np.sin(2 * np.pi * f * t + i) * (0.6 + 0.4 * np.sin(2 * np.pi * (0.05 + 0.013 * i) * t + i))
    return x / len(freqs) * env(n, int(2.5 * SR), int(3.5 * SR))
def reverb(x, mix=0.3):
    out = np.zeros_like(x)
    for D, g in [(1557, 0.84), (1617, 0.83), (1491, 0.82), (1422, 0.81), (1277, 0.80), (1356, 0.79)]:
        y = np.zeros_like(x)
        for i in range(0, len(x), D):
            m = min(D, len(x) - i); y[i:i + m] = x[i:i + m] + (g * y[i - D:i - D + m] if i >= D else 0)
        out += y
    out /= 6
    for D, g in [(225, 0.5), (556, 0.5)]:
        y = np.zeros_like(out)
        for i in range(0, len(out), D):
            m = min(D, len(out) - i); prev_x = out[i - D:i - D + m] if i >= D else 0; prev_y = y[i - D:i - D + m] if i >= D else 0
            y[i:i + m] = -g * out[i:i + m] + prev_x + g * prev_y
        out = y
    return x * (1 - mix) + out * mix
# Phrases: (scale degree, beats). None = a rest. Written to breathe: a phrase, then air.
DARK_PH = [[(0, 2), (2, 1), (1, 3), (None, 2)], [(-1, 1), (0, 1), (2, 2), (1, 1), (0, 3), (None, 2)], [(3, 2), (2, 1), (1, 1), (0, 4), (None, 2)], [(2, 1), (3, 1), (2, 1), (1, 1), (-1, 2), (0, 4), (None, 3)]]
MOH_PH = [[(2, 1), (3, 1), (4, 2), (5, 3), (None, 1)], [(4, 1), (3, 1), (2, 2), (1, 1), (0, 3), (None, 1)], [(0, 1), (1, 1), (2, 1), (3, 1), (4, 1), (3, 1), (2, 3), (None, 1)], [(5, 2), (4, 1), (3, 1), (2, 1), (1, 1), (0, 4), (None, 2)], [(3, 1), (4, 1), (5, 1), (6, 1), (5, 2), (4, 1), (3, 3), (None, 2)]]
def melody(M, t0, t1, scale, phrases, beat, voice, octave, gain, pan, start=0):
    t = t0; last = None; k = start
    while t < t1 - beat * 2:
        for d, b in phrases[k % len(phrases)]:
            dur = b * beat
            if t + dur > t1: break
            if d is not None:
                f = hz(deg(scale, d), octave); f0 = last if last else f * 0.97
                x = lead(f0, f, dur + 1.6, vib=1.0 if b >= 2 else 0.0) if voice == "veena" else flute(f0, f, dur * 0.96, seed=int(t * 10))
                M.add(t, x, gain, pan); last = f
            t += dur
        k += 1
def score(lang):
    sfx = "" if lang == "en" else "-" + lang
    D = json.loads((ROOT / f"public/katha/sura/data{sfx}.json").read_text())
    T = {}; t = 0.0
    for b in D["beats"]: T[b["key"]] = t; t += np.ceil((b["sec"] + 0.6) * 30) / 30
    total = t + 14 / 30; T["end"] = total
    M = Mix(total)
    # the drone throughout: Pa Sa' Sa' Sa, every 1.7 s, two strings a hair apart; quieter under Arun
    k = 0; tt = 0.0
    while tt < total:
        note = [hz(7, -1), hz(0, 0), hz(0, 0), hz(0, -1)][k % 4]; quiet = 0.55 if tt < T["b04"] else 1.0
        for j, det in enumerate((1.0, 1.003)): M.add(tt + j * 0.02, pluck_ks(note * det, 6.5, bright=0.62, seed=k * 2 + j), 0.16 * quiet, -0.25 + 0.5 * j)
        tt += 1.7; k += 1
    M.add(0, pad([hz(0, -1), hz(7, -1), hz(0, 0)], T["b04"] + 3), 0.10)
    M.add(T["b04"] - 2, pad([hz(0, -1), hz(7, -1), hz(0, 0), hz(4, 0)], T["b14"] - T["b04"] + 4), 0.11)
    M.add(T["b14"] - 2, pad([hz(0, -1), hz(7, -1), hz(0, 0)], T["b17"] - T["b14"] + 4), 0.09)
    M.add(T["b17"] - 2, pad([hz(0, -1), hz(7, -1), hz(0, 0), hz(4, 0), hz(7, 0)], total - T["b17"] + 2), 0.12)
    # Arun's evening: a lonely string, dark scale, slow
    melody(M, T["b01"] + 1.5, T["b04"] - 1, DARK, DARK_PH, 0.86, "veena", 1, 0.20, -0.15)
    # the text's world: Mohanam on the string; the flute answers from the birth of the child
    melody(M, T["b04"] + 1, T["b08"] - 0.5, MOH, MOH_PH, 0.74, "veena", 1, 0.20, -0.15)
    melody(M, T["b07"] + 2, T["b08"] - 1, MOH, MOH_PH, 1.48, "flute", 2, 0.085, 0.3, start=2)
    # the war: a frame drum in eight, growing; the string climbs
    bt = 0.37; tt = T["b08"] + 0.6; i = 0; n8 = max(1, int((T["b09"] - T["b08"]) / bt))
    while tt < T["b09"] - 0.3:
        g = 0.10 + 0.20 * (i / n8); s = i % 8
        if s in (0, 3, 6): M.add(tt, drum("dhum", i), g * 1.6, 0.0)
        if s in (2, 4, 5, 7): M.add(tt, drum("ta", i), g * 0.8, 0.25 if s % 2 else -0.25)
        tt += bt; i += 1
    melody(M, T["b08"] + 1, T["b09"] - 0.5, MOH, MOH_PH, 0.74, "veena", 1, 0.17, -0.15, start=2)
    # the tree: the drone alone, a low swell; then the bell for the verse
    M.add(T["b09"], pad([hz(0, -2), hz(7, -2), hz(0, -1)], T["b10"] - T["b09"] + 1), 0.22)
    for key in ("b05", "b10", "b13"): M.add(T[key] + 0.4, bell(hz(0, 2)), 0.10, 0.0)
    # the throw: a roll that tightens; the split: one great bell, then the flute, clear
    tt = T["b11"] + 0.3; i = 0; span = T["b12"] - T["b11"]
    while tt < T["b12"] - 0.1:
        u = (tt - T["b11"]) / span; M.add(tt, drum("ta" if i % 4 else "dhum", i), 0.10 + 0.26 * u, 0.3 * np.sin(i)); tt += 0.34 - 0.2 * u; i += 1
    M.add(T["b12"] + 0.45, bell(hz(0, 1), 10), 0.30); M.add(T["b12"] + 0.45, bell(hz(7, 1), 9), 0.14, 0.3); M.add(T["b12"] + 0.45, drum("dhum", 9), 0.5)
    melody(M, T["b12"] + 3.5, T["b13"] - 0.5, MOH, MOH_PH, 1.3, "flute", 2, 0.10, 0.25, start=3)
    # our reading: the string alone, unhurried
    melody(M, T["b14"] + 1, T["b17"] - 1, MOH, MOH_PH, 0.92, "veena", 1, 0.17, -0.15, start=1)
    # the morning: flute and string together, warm, coming home to Sa
    melody(M, T["b17"] + 0.8, T["b20"] - 1, MOH, MOH_PH, 0.8, "veena", 1, 0.19, -0.2)
    melody(M, T["b17"] + 2.4, T["b20"] - 1.5, MOH, MOH_PH, 1.6, "flute", 2, 0.10, 0.3, start=3)
    M.add(T["b20"] + 0.3, lead(hz(7, 1), hz(0, 1), 6, vib=1), 0.2, -0.1); M.add(T["b20"] + 0.5, bell(hz(0, 2), 9), 0.10)
    n = int(total * SR)
    L, R = reverb(M.L[:n], 0.3), reverb(M.R[:n], 0.3)
    fade = env(n, int(1.5 * SR), int(4 * SR)); L *= fade; R *= fade
    peak = max(np.abs(L).max(), np.abs(R).max()); L, R = L / peak * 0.89, R / peak * 0.89
    out = ROOT / f"public/katha/sura/score{sfx}.wav"
    with wave.open(str(out), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.stack([L, R], 1) * 32767).astype("<i2").tobytes())
    rms = float(np.sqrt(np.mean(L ** 2)))
    print(f"wrote {out.relative_to(ROOT)}: {total:.0f}s, rms {20 * np.log10(rms):.1f} dBFS")
if __name__ == "__main__":
    for lang in ([a for a in sys.argv[1:] if a in ("en", "ta", "hi")] or ["en"]): score(lang)

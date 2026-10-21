#!/usr/bin/env python3
"""Code-composed tanpura bed and a singing-bowl bell for the dharma channel (no third-party provider, nothing to license).
Same approach as scripts/intro_music.py: numpy synthesis straight to WAV.

  python3 scripts/dharma/tanpura.py                 # public/dharma/tanpura.wav (64 s seamless loop) + bell.wav
  python3 scripts/dharma/tanpura.py --sa 146.83 --seconds 90 --out out/audio/tanpura_d.wav

The tanpura: four strings plucked in the classic order Pa, Sa, Sa, Sa(low), one pluck every ~0.8 s, each ringing for
seconds so they overlap into a drone. The jawari buzz is approximated by a long, slowly shimmering harmonic series.
The loop is seamless: the tails that run past the end are folded back onto the start (the pluck pattern is periodic).
Mix it under narration at about -22 dB (the engine ducks music under every spoken line anyway)."""
import argparse, math, pathlib, wave
import numpy as np

SR = 44100
HERE = pathlib.Path(__file__).resolve().parent.parent.parent   # repo root


def write_wav(path: pathlib.Path, stereo: np.ndarray, peak=0.5):
    """stereo: (n, 2) float array. Normalised to `peak` so the bed sits well under the voice."""
    path.parent.mkdir(parents=True, exist_ok=True)
    m = np.max(np.abs(stereo)) or 1.0
    pcm = np.clip(stereo / m * peak, -1, 1)
    data = (pcm * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())


def string_pluck(f0: float, dur: float, rng: np.random.Generator, nh=28, decay=0.55, bright=1.0) -> np.ndarray:
    """One tanpura string. Harmonics fall off gently (jawari keeps the upper partials alive), each with a slow,
    independent amplitude shimmer and a hair of stretch, so the drone breathes instead of sitting still."""
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, nh + 1):
        fk = f0 * k * (1 + 0.00035 * k * k)                    # slight inharmonic stretch, like a real string
        amp = (1.0 / k ** 0.85) * bright ** (k - 1)
        shimmer = 1 + 0.35 * np.sin(2 * math.pi * (0.11 + 0.07 * (k % 5)) * t + rng.uniform(0, 2 * math.pi))
        env = np.exp(-t * (decay + 0.09 * k))                    # higher partials die sooner
        s += amp * shimmer * env * np.sin(2 * math.pi * fk * t + rng.uniform(0, 2 * math.pi))
    # the jawari "buzz": a soft, slowly opening band of the upper partials
    buzz = np.sin(2 * math.pi * f0 * 7 * t) * np.sin(2 * math.pi * f0 * 9 * t) * np.exp(-t * 1.6) * 0.12
    s += buzz * (0.6 + 0.4 * np.sin(2 * math.pi * 0.23 * t))
    a = int(0.012 * SR); s[:a] *= np.linspace(0, 1, a)       # a finger, not a hammer
    return s


def tanpura(sa: float, seconds: float, seed=108, period=3.4) -> np.ndarray:
    """A seamless loop of `seconds`. Strings (Hz): Pa = 1.5 Sa, Sa, Sa, Sa/2. Returns (n, 2)."""
    rng = np.random.default_rng(seed)
    N = int(seconds * SR); L = np.zeros(N + int(9 * SR)); R = np.zeros_like(L)
    strings = [(sa * 1.5, 0.00, -0.25), (sa, 0.25, 0.1), (sa, 0.50, 0.2), (sa / 2, 0.75, -0.1)]   # (Hz, phase in cycle, pan)
    ring = 7.5
    ncyc = int(math.ceil(seconds / period))
    for c in range(ncyc):
        for hz, ph, pan in strings:
            t0 = (c + ph) * period + rng.uniform(-0.02, 0.02)   # a human hand is never exactly on the beat
            if t0 >= seconds: continue
            vel = 0.9 + rng.uniform(-0.08, 0.08)
            p = string_pluck(hz, ring, rng, decay=0.5 if hz < sa else 0.6) * vel
            i = int(t0 * SR); j = min(len(L), i + len(p))
            g = 0.5 - 0.5 * pan, 0.5 + 0.5 * pan
            L[i:j] += p[: j - i] * g[0]; R[i:j] += p[: j - i] * g[1]
    # fold the ring-out past the end back onto the start: the pattern is periodic, so the join is silent
    L[:len(L) - N] += L[N:]; R[:len(R) - N] += R[N:]
    L, R = L[:N], R[:N]
    # warm it: a gentle low-pass (moving average) keeps it under the voice
    k = 5; L = np.convolve(L, np.ones(k) / k, mode="same"); R = np.convolve(R, np.ones(k) / k, mode="same")
    # a short room
    for d, g in [(0.031, 0.22), (0.067, 0.14), (0.109, 0.09)]:
        s = int(d * SR); L[s:] += L[:-s] * g; R[s:] += R[:-s] * g * 0.9
    return np.stack([L, R], axis=1)


def bell(f0=528.0, dur=9.0) -> np.ndarray:
    """A singing bowl for chapter changes: inharmonic partials with a slow beat, long fade. Returns (n, 2)."""
    n = int(dur * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for ratio, amp, dec in [(1.0, 1.0, 0.55), (2.71, 0.45, 0.9), (4.95, 0.22, 1.3), (7.9, 0.1, 1.8), (1.003, 0.6, 0.6)]:
        s += amp * np.sin(2 * math.pi * f0 * ratio * t) * np.exp(-t * dec)
    a = int(0.004 * SR); s[:a] *= np.linspace(0, 1, a)
    s *= 1 + 0.08 * np.sin(2 * math.pi * 4.2 * t)             # the bowl's wobble
    return np.stack([s * 0.95, s], axis=1)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--sa", type=float, default=138.59, help="Sa in Hz (default C#3, a low male tuning that stays under the voice)")
    ap.add_argument("--seconds", type=float, default=64.0, help="loop length (default 64)")
    ap.add_argument("--out", type=pathlib.Path, default=HERE / "public/dharma/tanpura.wav")
    ap.add_argument("--bell", type=pathlib.Path, default=HERE / "public/dharma/bell.wav")
    a = ap.parse_args()
    write_wav(a.out, tanpura(a.sa, a.seconds), peak=0.45); print("wrote", a.out, f"{a.seconds:.0f}s loop, Sa={a.sa} Hz")
    write_wav(a.bell, bell(), peak=0.6); print("wrote", a.bell)


if __name__ == "__main__":
    main()

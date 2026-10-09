"""Data YT Shorts score: original, code-composed music, so it is 100% ours and copyright-free (no Content ID risk).

Style: upbeat Indo-electronic at 124 BPM. Dhol-style low drum pattern, shaker 16ths, claps, warm sub bass,
marimba/pluck hook in a major-pentatonic key. Each Short gets a variant (key + melody + drum fill) from its seed, so a
run of Shorts doesn't all sound identical, while the cuts stay on the same bar grid as the video timeline.

make(path, total_s, seed, hits=[], ticks=[], drop=None)
  hits  = times (s) for a big reveal hit (boom + crash)
  ticks = times (s) for small pitched pops (state fills, options, counters)
  drop  = (start, end) seconds of a breakdown (drums out, filtered pad) before a reveal
"""
import math, wave
import numpy as np

SR = 44100
BPM = 124
BEAT = 60 / BPM
BAR = 4 * BEAT
KEYS = [62, 64, 65, 67, 69]                      # D, E, F, G, A (major pentatonic roots)
PENTA = [0, 2, 4, 7, 9]
PROG = [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]]   # I - vi - IV - V (relative to key)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)


def _lp(sig, cutoff):
    F = np.fft.rfft(sig); fr = np.fft.rfftfreq(len(sig), 1 / SR)
    return np.fft.irfft(F / np.sqrt(1 + (fr / cutoff) ** 4), len(sig))


def make(path, total_s, seed=0, hits=(), ticks=(), drop=None):
    rng = np.random.default_rng(seed)
    key = KEYS[seed % len(KEYS)]
    N = int((total_s + 1.0) * SR)
    L = {k: np.zeros(N) for k in ("drum", "perc", "bass", "keys", "lead", "fx")}

    def add(layer, sig, at, g=1.0):
        i = int(at * SR); j = min(N, i + len(sig))
        if 0 <= i < N:
            L[layer][i:j] += sig[: j - i] * g

    def tone(f, dur, decay, harm=(1, 0.5, 0.25)):
        x = np.arange(int(dur * SR)) / SR
        return sum(a * np.sin(2 * np.pi * f * (n + 1) * x) for n, a in enumerate(harm)) * np.exp(-x * decay)

    def dhol(low=True):                      # pitched membrane: fast pitch drop + slap noise
        x = np.arange(int((0.35 if low else 0.16) * SR)) / SR
        f0, f1 = (95, 55) if low else (330, 210)
        ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-x * 40)) / SR
        slap = rng.standard_normal(len(x)) * np.exp(-x * (90 if low else 160))
        return np.sin(ph) * np.exp(-x * (7 if low else 22)) + 0.25 * slap

    def kick():
        x = np.arange(int(0.3 * SR)) / SR
        ph = 2 * np.pi * np.cumsum(48 + 120 * np.exp(-x * 35)) / SR
        return np.sin(ph) * np.exp(-x * 10)

    def noise(dur, decay, hp=True):
        x = np.arange(int(dur * SR)) / SR
        n = rng.standard_normal(len(x))
        return (np.diff(n, prepend=0) if hp else n) * np.exp(-x * decay)

    in_drop = lambda t: drop is not None and drop[0] <= t < drop[1]
    # dhol pattern over 2 beats (16ths): D = low, t = high, . = rest; variant per seed
    pats = ["D..tD.t.", "D.t.D.tt", "D..tD..t", "Dt.tD.t."]
    pat = pats[seed % len(pats)]
    # lead hook: 8 eighth-notes per bar from the pentatonic, seeded, repeated each 2 bars with a variation
    hook = [int(rng.integers(0, 5)) for _ in range(16)]
    nb = int(total_s / BEAT)
    for b in range(nb):
        t0 = b * BEAT
        bar = int(t0 / BAR); ch = PROG[bar % 4]
        intro = bar < 1
        d = in_drop(t0)
        if not d:
            if not intro:
                add("drum", kick(), t0, 0.9)
            if b % 2 == 1 and not intro:
                add("perc", noise(0.16, 30), t0, 0.45)                     # clap on 2 and 4
        for k in range(4):
            ts = t0 + k * BEAT / 4
            if not d:
                add("perc", noise(0.04, 120), ts, 0.07 if k % 2 == 0 else 0.11)   # shaker
                c = pat[(b % 2) * 4 + k]
                if c == "D":
                    add("drum", dhol(True), ts, 0.55)
                elif c == "t":
                    add("drum", dhol(False), ts, 0.35)
            # bass: root on beat, octave on the "and"
            if not d and not intro and k in (0, 2):
                m = key - 24 + ch[0] + (12 if k == 2 else 0)
                x = np.arange(int(BEAT / 2 * 0.9 * SR)) / SR
                add("bass", (np.sin(2 * np.pi * hz(m) * x) + 0.3 * np.sin(4 * np.pi * hz(m) * x)) * np.minimum(1, x * 200) * np.exp(-x * 4), ts, 0.55)
        # chord stabs on the off-beat (keys)
        if not intro:
            for m in ch:
                add("keys", tone(hz(key - 12 + m), 0.22, 14, (1, 0.35, 0.1)), t0 + BEAT / 2, 0.10 if not d else 0.05)
        # lead: marimba-like on eighths
        for e in range(2):
            i = (b * 2 + e) % 16
            if (b * 2 + e) % 8 in (3, 7) and rng.random() < 0.5:
                continue
            m = key + PENTA[hook[i]] + (12 if (bar % 4 == 3 and e == 1) else 0)
            add("lead", tone(hz(m), 0.3, 9, (1, 0.0, 0.3, 0.0, 0.12)), t0 + e * BEAT / 2, 0.16 if not d else 0.10)
    # drop: soft pad swell + riser into the reveal
    if drop:
        a, z = drop; n = int((z - a) * SR); x = np.arange(n) / SR
        pad = sum(np.sin(2 * np.pi * hz(key - 12 + m) * x) for m in PROG[0]) * (x / (z - a))
        add("keys", pad, a, 0.06)
        r = np.diff(rng.standard_normal(n), prepend=0) * (x / (z - a)) ** 3
        add("fx", r, a, 0.35)
    for h in hits:
        x = np.arange(int(1.6 * SR)) / SR
        add("drum", np.sin(2 * np.pi * np.cumsum(60 * np.exp(-x * 0.9)) / SR) * np.exp(-x * 2.4), h, 1.1)
        add("fx", noise(1.8, 2.2), h, 0.35)
        add("lead", tone(hz(key + 12), 1.2, 3, (1, 0.5, 0.3, 0.2)), h, 0.18)
    for t in ticks:
        add("lead", tone(hz(key + 24 + PENTA[int(rng.integers(0, 5))]), 0.12, 30, (1, 0.3)), t, 0.18)

    L["bass"] = _lp(L["bass"], 400)
    L["perc"] = L["perc"] - _lp(L["perc"], 5000)
    L["lead"] = _lp(L["lead"], 6000)
    tt = np.arange(N) / SR
    pump = 1 - 0.4 * np.exp(-((tt % BEAT) / 0.08))
    mix = L["drum"] + L["perc"] * 1.3 + (L["bass"] + L["keys"]) * pump + L["lead"] + L["fx"]
    mix = np.tanh(mix * 1.2) / np.tanh(1.2)
    fade = np.ones(N); nf = int(1.0 * SR); fade[-nf:] = np.linspace(1, 0, nf)
    mix *= fade
    mix /= max(1e-9, np.abs(mix).max()) / 0.88
    st = np.stack([mix + 0.12 * np.roll(L["lead"], 400), mix + 0.12 * np.roll(L["perc"], 250)], 1)
    st /= np.abs(st).max() / 0.89
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())

# The Inventor's Desk: generate the short dry clock tick used by No. 004 (public/gadget/nuclearclock/tick.wav; *.wav is git-ignored).
# Run: python3 scripts/gadget/gk_tick.py
import wave, math, struct, random, pathlib
OUT = pathlib.Path(__file__).resolve().parents[2] / "public/gadget/nuclearclock/tick.wav"
sr = 44100; n = int(0.09 * sr); random.seed(4); out = []
for i in range(n):
    t = i / sr; s = 0.0
    for t0, f, a in ((0.0, 2400, 0.9), (0.028, 1700, 0.5)):
        if t >= t0:
            d = t - t0; s += a * math.exp(-d * 180) * math.sin(2 * math.pi * f * d) + a * 0.25 * math.exp(-d * 400) * (random.random() * 2 - 1)
    out.append(int(max(-1, min(1, s * 0.8)) * 32767))
OUT.parent.mkdir(parents=True, exist_ok=True)
w = wave.open(str(OUT), "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes(b"".join(struct.pack("<h", x) for x in out)); w.close(); print("wrote", OUT)

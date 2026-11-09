"""Synthesised music bed for a silent HyperFrames Short, then muxed onto the video.
No samples or downloads: a soft chord pad, a low pulse, whooshes on scene changes and thuds on stamps.

usage: python3 music_bed.py <in.mp4> <out.mp4> <mood: warm|night> <whoosh s,s,...> [thud s,s,...] [ping s,s,...]
The voice-over still comes from the normal build pipeline; this is a placeholder bed for drafts.
"""
import subprocess
import sys
import wave

import numpy as np

SR = 44100
CHORDS = {
    "warm": [[110, 164.8, 220, 277.2], [98, 146.8, 196, 246.9], [87.3, 130.8, 174.6, 220], [98, 146.8, 196, 293.7]],   # A, G, F, G
    "night": [[110, 130.8, 164.8, 220], [87.3, 130.8, 174.6, 207.7], [98, 146.8, 174.6, 233.1], [82.4, 123.5, 164.8, 207.7]],  # Am, Fm-ish, Gm-ish, E
}


def bed(dur, mood, whooshes, thuds, pings):
    n = int(dur * SR)
    t = np.arange(n) / SR
    rng = np.random.RandomState(5)
    out = np.zeros(n)
    seg = n // 4
    for i, ch in enumerate(CHORDS[mood]):
        a, b = i * seg, (n if i == 3 else (i + 1) * seg)
        tt = t[a:b] - t[a]
        env = np.minimum(1, tt / 1.5) * np.minimum(1, (tt[-1] - tt + 1e-3) / 1.5)
        for f in ch:
            out[a:b] += 0.045 * np.sin(2 * np.pi * f * tt) * env + 0.018 * np.sin(2 * np.pi * f * 2.003 * tt) * env
    step = 0.5 if mood == "warm" else 0.75
    for k in np.arange(1.5, dur - 0.5, step):
        a, m = int(k * SR), int(0.18 * SR)
        tt = np.arange(m) / SR
        out[a:a + m] += 0.18 * np.sin(2 * np.pi * (50 + 55 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 18)
    for s in whooshes:
        m = int(0.7 * SR); a = max(0, int(s * SR) - m // 2); m = min(m, n - a)
        sw = np.convolve(rng.randn(m), np.ones(14) / 14, mode="same")
        out[a:a + m] += 0.2 * sw * np.sin(np.linspace(0, np.pi, m)) ** 2
    for s in thuds:
        a, m = int(s * SR), int(0.35 * SR); tt = np.arange(m) / SR
        out[a:a + m] += 0.5 * np.sin(2 * np.pi * 68 * tt) * np.exp(-tt * 13)
    for s in pings:
        a, m = int(s * SR), int(0.6 * SR); tt = np.arange(m) / SR
        out[a:a + m] += 0.08 * (np.sin(2 * np.pi * 880 * tt) + 0.5 * np.sin(2 * np.pi * 1320 * tt)) * np.exp(-tt * 6)
    fade = np.minimum(1, (dur - t) / 1.2)
    return np.tanh(out * 1.4) * 0.8 * fade


def main():
    src, dst, mood = sys.argv[1:4]
    lists = [[float(x) for x in a.split(",") if x] for a in (sys.argv[4:7] + ["", "", ""])[:3]]
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src]).strip())
    wav = dst.rsplit(".", 1)[0] + ".bed.wav"
    with wave.open(wav, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((bed(dur, mood, *lists) * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", dst], check=True)
    print("wrote", dst)


if __name__ == "__main__":
    main()

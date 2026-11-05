"""Master the voiced DATA-nl Shorts: one gain per file to -16 LUFS, peak held at or under -1 dBFS; video stream copied.

  <scratch venv with pyloudnorm>/python nl_master.py out/datakadai/nightlights/BR.mp4 [...]
Writes <ID>_final.mp4 next to each input and prints the before/after loudness.
"""
import subprocess, sys, tempfile, wave
import numpy as np
import pyloudnorm as pl

FF = "/tmp/ffbin/ffmpeg"
TARGET, CEIL = -16.0, -1.0


def read(path, d):
    w = f"{d}/a.wav"
    subprocess.run([FF, "-loglevel", "error", "-y", "-i", path, "-vn", "-ac", "2", "-ar", "48000", "-c:a", "pcm_s16le", w], check=True)
    f = wave.open(w)
    return np.frombuffer(f.readframes(f.getnframes()), np.int16).reshape(-1, 2) / 32768


for src in sys.argv[1:]:
    with tempfile.TemporaryDirectory() as d:
        a = read(src, d)
        lufs, peak = pl.Meter(48000).integrated_loudness(a), 20 * np.log10(np.abs(a).max())
        gain = min(TARGET - lufs, CEIL - peak)
        out = src.replace(".mp4", "_final.mp4")
        subprocess.run([FF, "-loglevel", "error", "-y", "-i", src, "-c:v", "copy", "-af", f"volume={gain:.2f}dB",
                        "-c:a", "aac", "-b:a", "256k", out], check=True)
        b = read(out, d)
        print(f"{src.split('/')[-1]}: {lufs:.1f} LUFS, peak {peak:.1f} -> gain {gain:+.1f} dB -> "
              f"{pl.Meter(48000).integrated_loudness(b):.1f} LUFS, peak {20 * np.log10(np.abs(b).max()):.1f}")

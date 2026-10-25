# Frame check for a rendered GeoShort: one frame from the middle of every beat plus the end card -> one contact sheet.
#   python3 scripts/geo/frame_sheet.py <id> <video.mp4> <out.jpg>
import json, os, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
F = str(ROOT / "node_modules/@remotion/compositor-darwin-arm64")
ENV = dict(os.environ, DYLD_LIBRARY_PATH=F)
GAP, END_HOLD = 0.12, 1.2          # same as src/geo/engine/GeoShort.tsx
vid, mp4, out = sys.argv[1:4]
beats = json.load(open(ROOT / "public" / "geo" / vid / "data.json"))["beats"]
t, marks = 0.0, []
for b in beats:
    marks.append((b["key"], t + b["sec"] * 0.6)); t += b["sec"] + GAP
marks.append(("end", t + END_HOLD - 0.3))
tiles = []
with tempfile.TemporaryDirectory() as d:
    for k, s in marks:
        p = f"{d}/{k}.png"
        subprocess.run([F + "/ffmpeg", "-loglevel", "error", "-ss", f"{s:.2f}", "-i", mp4, "-frames:v", "1", "-y", p], env=ENV, check=True)
        im = Image.open(p).convert("RGB").resize((324, 576)); ImageDraw.Draw(im).text((8, 8), f"{k} @ {s:.1f}s", fill="yellow")
        tiles.append(im)
sheet = Image.new("RGB", (324 * 5, 576 * 2), "black")
for i, im in enumerate(tiles): sheet.paste(im, ((i % 5) * 324, (i // 5) * 576))
sheet.save(out, quality=85); print(out)

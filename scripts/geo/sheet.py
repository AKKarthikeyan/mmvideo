# Review sheet: one frame from the globe + the middle of each beat -> out/geo/week1/sheets/<id>.png
# python3 scripts/geo/sheet.py chenab
import json, os, subprocess, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
F = str(ROOT / "node_modules/@remotion/compositor-darwin-arm64"); ENV = dict(os.environ, DYLD_LIBRARY_PATH=F)
vid = sys.argv[1]
d = json.load(open(ROOT / "public" / "geo" / vid / "data.json"))
t, times = 0.0, [0.8]
for b in d["beats"]:
    times.append(round(t + b["sec"] * 0.7, 2)); t += b["sec"] + 0.12
times.append(round(t + 0.8, 2))
mp4 = ROOT / "out" / "geo" / "week1" / f"{vid}.mp4"; tmp = ROOT / "out" / "geo" / "week1" / "sheets"; tmp.mkdir(parents=True, exist_ok=True)
ims = []
for i, s in enumerate(times):
    png = tmp / f"_{vid}_{i}.png"
    subprocess.run([F + "/ffmpeg", "-y", "-loglevel", "error", "-ss", str(s), "-i", str(mp4), "-frames:v", "1", str(png)], env=ENV, check=True)
    ims.append(Image.open(png).resize((270, 480))); png.unlink()
cols = 6; rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (270 * cols, 480 * rows))
for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * 270, (i // cols) * 480))
sheet.save(tmp / f"{vid}.png"); print(tmp / f"{vid}.png", times)

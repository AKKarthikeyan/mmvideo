# edgecheck: per 4 fps frame (640x360), flags ink touching the 5% safe margin or a card cut by the frame edge. Chips are masked. PIL only.
import sys, glob, json, os
from PIL import Image
d, out = sys.argv[1], sys.argv[2]
def cnt(im, box, lo, hi):
    h = im.crop(box).histogram(); return sum(h[lo:hi + 1])
res = []; files = sorted(glob.glob(os.path.join(d, "f*.jpg")))
for f in files:
    n = int(os.path.basename(f)[1:6]); t = (n - 1) / 4
    im = Image.open(f).convert("L"); W, H = im.size
    mean = sum(i * c for i, c in enumerate(im.histogram())) / (W * H); dark = mean < 90
    lo, hi = (170, 255) if dark else (0, 95)
    fl = []
    if cnt(im, (0, 30, 32, H - 30), lo, hi) > 60: fl.append("ink-left-margin")
    if cnt(im, (W - 32, 0, W, H), lo, hi) > 60: fl.append("ink-right-margin")
    if cnt(im, (300, 0, W, 16), lo, hi) > 60: fl.append("ink-top-margin")
    if cnt(im, (350, H - 14, W, H), lo, hi) > 60: fl.append("ink-bottom-margin")
    if not dark:
        if cnt(im, (0, 0, 1, H), 243, 255) > 25 or cnt(im, (W - 1, 0, W, H), 243, 255) > 25: fl.append("card-cut-by-edge")
    if fl: res.append({"t": t, "frame": n, "flags": fl})
json.dump(res, open(out, "w"))
print(len(res), "flagged of", len(files))

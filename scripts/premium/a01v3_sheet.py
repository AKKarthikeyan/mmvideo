#!/usr/bin/env python3
"""Contact sheet of images: a01v3_sheet.py out.jpg cols width img1 img2 ... (labels = file names)."""
import sys
from PIL import Image, ImageDraw
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); files = sys.argv[4:]
ims = [Image.open(f).convert("RGB") for f in files]
h = max(int(w * im.height / im.width) for im in ims)
rows = (len(ims) + cols - 1) // cols
S = Image.new("RGB", (cols * w, rows * (h + 22)), (40, 40, 40)); d = ImageDraw.Draw(S)
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = (i % cols) * w, (i // cols) * (h + 22)
    S.paste(im.resize((w, int(w * im.height / im.width))), (x, y + 22)); d.text((x + 6, y + 5), f.split("/")[-1], fill=(255, 255, 255))
S.save(out, quality=88); print(out, S.size)

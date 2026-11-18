# contact sheets from a folder of stills (sorted by name): python3 asianpaintsq2_sheet.py DIR OUTPREFIX COLS ROWS W
import sys, glob, os
from PIL import Image, ImageDraw
d, outp, cols, rows, w = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
fs = sorted(glob.glob(os.path.join(d, "*.jpg")) + glob.glob(os.path.join(d, "*.png")))
h = w * 9 // 16; n = cols * rows
for s in range(0, len(fs), n):
    sheet = Image.new("RGB", (cols * w, rows * (h + 22)), "white"); dr = ImageDraw.Draw(sheet)
    for i, f in enumerate(fs[s:s + n]):
        im = Image.open(f).convert("RGB").resize((w, h)); x, y = (i % cols) * w, (i // cols) * (h + 22)
        sheet.paste(im, (x, y + 22)); dr.text((x + 4, y + 4), os.path.basename(f), fill="black")
    sheet.save(f"{outp}_{s // n + 1:02d}.jpg", quality=80); print(f"{outp}_{s // n + 1:02d}.jpg")

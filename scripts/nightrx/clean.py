#!/usr/bin/env python3
"""Soften the made-up lettering image-01 paints on signs and boxes, as an out-of-focus lens would.
Reads public/nightrx/styletest/img/<p>.jpeg and writes .../img/clean/<p>.jpeg (the Remotion piece reads clean/).
Boxes are full-resolution (x0, y0, x1, y1), found by eye on gridded contact sheets, 24 Oct 2026."""
import pathlib
from PIL import Image, ImageDraw, ImageFilter

import os
LOOK = os.environ.get("NRX_LOOK", "ink")
IMG = pathlib.Path(__file__).resolve().parents[2] / ("public/nightrx/styletest_live/img" if LOOK == "live" else "public/nightrx/styletest/img")
BOXES = {
    "p04": [(0, 800, 360, 1000), (380, 620, 560, 740)],
    "p05": [(1230, 120, 1480, 260), (470, 380, 650, 570), (480, 950, 720, 1080)],
    "p06": [(1470, 290, 1740, 400), (90, 460, 250, 660)],
    "p07": [(105, 340, 260, 520)],
    "p08": [(1610, 0, 1920, 570), (70, 230, 670, 510)],
    "p09": [(1140, 0, 1680, 170), (290, 310, 520, 430), (1730, 350, 1920, 450)],
    "p11": [(1720, 180, 1920, 840), (1300, 180, 1720, 320), (1650, 830, 1920, 1080)],
    "p12": [(0, 120, 145, 250), (1405, 140, 1720, 272)],
}
if LOOK == "live":   # live-action panels, 24 Oct: shop sign, wall signs
    BOXES = {"p01": [(400, 380, 1000, 650), (0, 630, 90, 740)], "p05": [(240, 195, 470, 330)],
             "p08": [(470, 245, 760, 445), (0, 50, 175, 220), (1715, 0, 1920, 280)],
             "p10": [(0, 800, 300, 970)], "p12": [(0, 0, 265, 130), (1380, 0, 1710, 250), (1760, 260, 1920, 460)]}
FEATHER = 18


def main():
    out = IMG / "clean"; out.mkdir(exist_ok=True)
    for src in sorted(IMG.glob("p*.jpeg")):
        im = Image.open(src).convert("RGB")
        boxes = BOXES.get(src.stem, [])
        if boxes:
            soft = im.filter(ImageFilter.GaussianBlur(16))
            mask = Image.new("L", im.size, 0); d = ImageDraw.Draw(mask)
            for b in boxes: d.rectangle(b, fill=255)
            im = Image.composite(soft, im, mask.filter(ImageFilter.GaussianBlur(FEATHER)))
        im.save(out / src.name, quality=93)
        print(" clean", src.stem, len(boxes), "boxes")


if __name__ == "__main__":
    main()

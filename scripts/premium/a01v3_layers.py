#!/usr/bin/env python3
"""A01 v3: pre-cut parallax layers as RGBA PNGs so the page never waits on CSS mask images.
castle: sky (full plate, slowest), mid_dry (plate minus sky, castle kept), water (wet plate cut by the water mask),
fg (near trees, bush, bottom grass). Street: fg (near pots and counters) and a window/bulb light map."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = "/Volumes/DarwinSSD/MMVideo/public/premium/a01v3/plates/"
W, H = 1920, 1080
def feather(m, r): return m.filter(ImageFilter.GaussianBlur(r))
def rgba(src, mask, out):
    im = Image.open(D + src).convert("RGB").convert("RGBA"); im.putalpha(mask); im.save(D + out); print(out)
# castle mid: everything below the far ridge, plus the castle and its towers
m = Image.new("L", (W, H), 0); d = ImageDraw.Draw(m)
d.polygon([(0, 560), (300, 470), (560, 400), (800, 420), (1100, 430), (1400, 380), (1700, 330), (1920, 300), (1920, 1080), (0, 1080)], fill=255)
d.polygon([(780, 470), (790, 330), (850, 300), (880, 240), (930, 300), (980, 170), (1020, 80), (1060, 170), (1090, 300), (1130, 470)], fill=255)
mid = feather(m, 18)
rgba("castle_dry.jpg", mid, "castle_mid_dry.png")
wm = Image.open(D + "castle_water_mask.png").convert("L")
rgba("castle_wet.jpg", wm, "castle_water.png")
f = Image.new("L", (W, H), 0); d = ImageDraw.Draw(f)
d.rectangle((0, 985, W, H), fill=255); d.polygon([(0, 560), (255, 600), (275, 1080), (0, 1080)], fill=255); d.polygon([(1700, 670), (1920, 640), (1920, 1080), (1690, 1080)], fill=255)
rgba("castle_dry.jpg", feather(f, 14), "castle_fg.png")
# street near layer: left pot and counter, right flower crates and door
s = Image.new("L", (W, H), 0); d = ImageDraw.Draw(s)
d.polygon([(0, 600), (215, 600), (215, 820), (660, 780), (670, 980), (0, 1080)], fill=255)
d.polygon([(1290, 880), (1420, 740), (1700, 740), (1920, 420), (1920, 1080), (1290, 1080)], fill=255)
rgba("street.jpg", feather(s, 10), "street_fg.png")

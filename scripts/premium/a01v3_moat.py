#!/usr/bin/env python3
"""A01 v3: from the one painted castle plate make (1) the water mask, (2) a DRY plate where the moat is an empty earth
ditch (same painting, water recoloured to earth keeping its brush texture), so code can fill the moat exactly in place.
Outputs public/premium/a01v3/plates/castle_wet.jpg, castle_dry.jpg, castle_water_mask.png"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
import sys
RB = float(sys.argv[1]) if len(sys.argv) > 1 else 0.62
D = "/Volumes/DarwinSSD/MMVideo/public/premium/a01v3/plates/"
im = Image.open(D + "raw/castle2_2.jpeg").convert("RGB"); a = np.asarray(im).astype(np.float32) / 255
hsv = np.asarray(im.convert("HSV")).astype(np.float32)
h, s, v = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255, hsv[..., 2] / 255
H, W = h.shape
rb = a[..., 2] / ((a[..., 0] + a[..., 1]) / 2 + 1e-3)
yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
ring = ((xx - 942) / 850.0) ** 2 + ((yy - 690) / 285.0) ** 2 < 1
from PIL import ImageDraw
isl = Image.new("L", (a.shape[1], a.shape[0]), 0)
ImageDraw.Draw(isl).polygon([(600,622),(640,592),(690,548),(785,440),(1192,440),(1192,570),(1240,608),(1298,668),(1282,700),(1050,735),(780,706),(622,660)], fill=255)
island = np.asarray(isl) > 0
ring = ((xx - 942) / 830.0) ** 2 + ((yy - 690) / 285.0) ** 2 < 1
water = ((rb > RB) | (s < 0.30)) & (v > 0.12) & ring & ~island
water |= ring & island & (rb > 0.8) & (s > 0.15) & (v > 0.5)
frc = Image.new("L", (a.shape[1], a.shape[0]), 0); fd = ImageDraw.Draw(frc)
fd.polygon([(722,470),(752,470),(752,528),(722,540)], fill=255); fd.ellipse((604,632,628,652), fill=255)
water |= np.asarray(frc) > 0
water &= ~((xx > 1430) & (yy < 532))
water &= ~((xx > 1290) & (xx < 1440) & (yy < 500)) & ~((xx > 1590) & (xx < 1700) & (yy > 520) & (yy < 590))  # x>1430: far-bank grass, not water
water[:468] = False                     # the sky and far hills are never water
water = nd.binary_closing(water, iterations=4); water = nd.binary_opening(water, iterations=2)
lab, n = nd.label(water); sz = nd.sum(water, lab, range(1, n + 1)); water = lab == (1 + int(np.argmax(sz)))
water = nd.binary_fill_holes(water) & ~nd.binary_fill_holes(np.zeros_like(water))
# keep holes (the island) as not-water: fill_holes would swallow the island, so only fill small holes
holes = nd.binary_fill_holes(water) & ~water; hl, hn = nd.label(holes)
if hn:
    hs = nd.sum(holes, hl, range(1, hn + 1)); small = np.isin(hl, [i + 1 for i, x in enumerate(hs) if x < 4000]); water |= small
m = Image.fromarray((water * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.0))
m.save(D + "castle_water_mask.png")
mf = np.asarray(m).astype(np.float32)[..., None] / 255
L = (a[..., 0] * 0.3 + a[..., 1] * 0.59 + a[..., 2] * 0.11)[..., None]
# earth ditch: darker toward the middle of the ring (distance from the ring edge), brush texture from the water's own luma
dist = nd.distance_transform_edt(water); dn = np.clip(dist / 38.0, 0, 1)[..., None]
dark = np.array([0.36, 0.25, 0.15]); light = np.array([0.80, 0.64, 0.42])
Ln = (L - L[water].mean()) * 1.4 + 0.5
earth = dark + (light - dark) * np.clip(Ln * (1 - 0.45 * dn), 0, 1)
dry = a * (1 - mf) + earth * mf
im.save(D + "castle_wet.jpg", quality=94)
Image.fromarray((np.clip(dry, 0, 1) * 255).astype(np.uint8)).save(D + "castle_dry.jpg", quality=94)
ys, xs = np.where(water); print("water px", water.sum(), "bbox", xs.min(), ys.min(), xs.max(), ys.max())

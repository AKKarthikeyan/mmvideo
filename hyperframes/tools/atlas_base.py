"""Shaded-relief base map from AWS Terrain Tiles (Terrarium), in Web Mercator, for map zooms.

usage: atlas_base.py <zoom> <lon0> <lat0> <lon1> <lat1> <out.jpg> [r,g,b]      (west, south, east, north)
With the optional r,g,b the sea is drawn flat in that colour with a soft glow near coasts, and depth data is ignored:
use it at zoom 10+, where open-sea tiles carry no depth (elevation 0) and would otherwise show as hard-edged squares,
and to match satellite imagery laid over the innermost level.
Prints the image size and its exact bounds in Mercator world units (x0, y0, x1, y1 in 0..1), which the page needs to
place the layer. Land and sea are tinted for the dark "atlas" look with a north-west hillshade; no borders are drawn.
Tiles: https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png (elevation = R*256 + G + B/256 - 32768).
"""
import io
import math
import sys
from concurrent.futures import ThreadPoolExecutor

import numpy as np
import requests
from PIL import Image

z, lon0, lat0, lon1, lat1 = int(sys.argv[1]), *map(float, sys.argv[2:6]); out = sys.argv[6]
n = 2 ** z
mx = lambda lon: (lon + 180) / 360
my = lambda lat: 0.5 - math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) / (2 * math.pi)
tx0, tx1 = int(mx(lon0) * n), int(mx(lon1) * n)
ty0, ty1 = int(my(lat1) * n), int(my(lat0) * n)
W, H = (tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256
elev = np.zeros((H, W), dtype=np.float32)
ses = requests.Session()


def get(xy):
    x, y = xy
    for _ in range(4):
        try:
            r = ses.get(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png", timeout=40)
            if r.status_code == 200:
                a = np.asarray(Image.open(io.BytesIO(r.content)).convert("RGB")).astype(np.float32)
                return xy, a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
        except Exception:
            pass
    return xy, np.zeros((256, 256), dtype=np.float32)


with ThreadPoolExecutor(12) as ex:
    for (x, y), e in ex.map(get, [(x, y) for x in range(tx0, tx1 + 1) for y in range(ty0, ty1 + 1)]):
        elev[(y - ty0) * 256:(y - ty0 + 1) * 256, (x - tx0) * 256:(x - tx0 + 1) * 256] = e


def ramp(v, stops):
    xs = [s[0] for s in stops]
    return np.stack([np.interp(v, xs, [s[1][k] for s in stops]) for k in range(3)], axis=-1)


deep = tuple(map(float, sys.argv[7].split(","))) if len(sys.argv) > 7 else None
if deep:
    from PIL import ImageFilter
    glow = np.asarray(Image.fromarray(((elev > 0) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(26))).astype(np.float32) / 255
    glow = np.clip(glow * 1.6, 0, 1)[..., None]
    sea = np.array(deep)[None, None, :] * (1 - glow) + np.array([24, 66, 98])[None, None, :] * glow
else:
    sea = ramp(-elev, [(0, (26, 62, 88)), (60, (17, 44, 70)), (300, (12, 30, 52)), (3000, (9, 22, 40)), (7000, (6, 14, 28))])
land = ramp(elev, [(0, (54, 70, 52)), (200, (72, 82, 56)), (700, (104, 100, 72)), (1800, (140, 130, 104)), (3500, (182, 174, 158)), (5500, (236, 234, 228))])
# hillshade (light from the north-west); metres per pixel varies with latitude
rows = np.arange(H)[:, None]
lat = np.degrees(2 * np.arctan(np.exp((0.5 - (ty0 + (rows + 0.5) / 256) / n) * 2 * math.pi)) - math.pi / 2)
mpp = 156543.03 * np.cos(np.radians(lat)) / n
exag = 2.2 if z <= 8 else 1.4
gy, gx = np.gradient(elev)
gx, gy = gx / mpp * exag, gy / mpp * exag
slope = np.pi / 2 - np.arctan(np.hypot(gx, gy)); aspect = np.arctan2(-gx, gy)
az, alt = math.radians(315), math.radians(42)
hs = np.sin(alt) * np.sin(slope) + np.cos(alt) * np.cos(slope) * np.cos(az - aspect)
hs = np.clip(hs / math.sin(alt), 0.35, 1.5)[..., None]
is_land = (elev > 0)[..., None]
rgb = np.where(is_land, land * (0.25 + 0.75 * hs), sea if deep else sea * (0.7 + 0.3 * hs))
# coast: a thin light edge
m = is_land[..., 0].astype(np.float32)
edge = (np.abs(np.gradient(m)[0]) + np.abs(np.gradient(m)[1])) > 0
rgb[edge] = rgb[edge] * 0.45 + np.array([200, 214, 224]) * 0.55
Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(out, quality=90)
print(out, (W, H), "bounds", [round(tx0 / n, 8), round(ty0 / n, 8), round((tx1 + 1) / n, 8), round((ty1 + 1) / n, 8)])

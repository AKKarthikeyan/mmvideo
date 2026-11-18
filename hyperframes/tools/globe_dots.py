"""Land data for the globe sample: evenly spread dots on land, and the land rings for the globe's texture.

usage: globe_dots.py <out dir> [--n 70000]
Writes <out dir>/dots.js (window.DOTS = flat [lat, lon, ...]) and <out dir>/land.js (window.LAND = rings of [lon, lat]).
Dots are a Fibonacci sphere of n points kept where they fall on Natural Earth 110m land (public domain).
"""
import argparse
import json
import subprocess
from pathlib import Path

import numpy as np

CACHE = Path(__file__).resolve().parents[2] / "out" / "hyperframes" / "cache"
LAND = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out"); ap.add_argument("--n", type=int, default=70000)
    a = ap.parse_args()
    src = CACHE / "ne_110m_land.geojson"
    if not src.exists():
        src.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sf", "-m", "120", "-o", str(src), LAND], check=True)
    rings = []
    for f in json.loads(src.read_text())["features"]:
        g = f["geometry"]
        for p in g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]:
            rings.append(p[0])
    i = np.arange(a.n) + 0.5
    lat = np.degrees(np.arcsin(1 - 2 * i / a.n))
    lon = (np.degrees(np.pi * (1 + 5 ** 0.5) * i) % 360) - 180
    inside = np.zeros(a.n, bool)
    for r in rings:  # even-odd ray casting, only for points inside the ring's bounding box
        r = np.array(r); x0, y0 = r[:, 0], r[:, 1]; x1, y1 = np.roll(x0, -1), np.roll(y0, -1)
        idx = np.where((lon >= x0.min()) & (lon <= x0.max()) & (lat >= y0.min()) & (lat <= y0.max()))[0]
        if len(idx):
            X, Y = lon[idx][:, None], lat[idx][:, None]
            c = ((y0 > Y) != (y1 > Y)) & (X < (x1 - x0) * (Y - y0) / (y1 - y0 + 1e-12) + x0)
            inside[idx] ^= c.sum(1) % 2 == 1
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    dots = np.stack([lat[inside], lon[inside]], 1).round(2)
    (out / "dots.js").write_text("window.DOTS = " + json.dumps(dots.ravel().tolist(), separators=(",", ":")) + ";\n")
    land = [[[round(x, 2), round(y, 2)] for x, y in r] for r in rings]
    (out / "land.js").write_text("window.LAND = " + json.dumps(land, separators=(",", ":")) + ";\n")
    print(out, len(dots), "land dots,", len(land), "rings")


if __name__ == "__main__":
    main()

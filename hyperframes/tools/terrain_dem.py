"""Elevation grid (and Natural Earth rivers) for a terrain flyover, from AWS Terrain Tiles (terrarium PNGs).

usage: terrain_dem.py <lat0> <lat1> <lon0> <lon1> <out.js> [--zoom 9] [--grid 560x440]
Writes window.DEM = {w, h, lat0, lat1, lon0, lon1, rivers: [{name, pts}], dem: base64 Int16 metres, row 0 = north}.
Tiles and the rivers file are cached in out/hyperframes/cache/. s02 used 29.4 31.6 77.6 80.4 at zoom 9.
Terrain Tiles: registry.opendata.aws/terrain-tiles (SRTM and other public sources); rivers: Natural Earth (public domain).
"""
import argparse
import base64
import json
import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

CACHE = Path(__file__).resolve().parents[2] / "out" / "hyperframes" / "cache"
TILE = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
RIVERS = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson"


def fetch(url, dst):
    if not dst.exists():
        dst.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sf", "-m", "120", "-o", str(dst), url], check=True)
    return dst


def tile_xy(lat, lon, z):
    n = 2 ** z
    return int((lon + 180) / 360 * n), int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)


def main():
    ap = argparse.ArgumentParser()
    for k in ("lat0", "lat1", "lon0", "lon1"):
        ap.add_argument(k, type=float)
    ap.add_argument("out")
    ap.add_argument("--zoom", type=int, default=9)
    ap.add_argument("--grid", default="560x440")
    a = ap.parse_args()
    z = a.zoom
    x0, y0 = tile_xy(a.lat1, a.lon0, z)
    x1, y1 = tile_xy(a.lat0, a.lon1, z)
    mos = np.zeros(((y1 - y0 + 1) * 256, (x1 - x0 + 1) * 256), np.float32)
    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            png = fetch(TILE.format(z=z, x=x, y=y), CACHE / f"terrarium/{z}_{x}_{y}.png")
            t = np.asarray(Image.open(png).convert("RGB")).astype(np.float32)
            mos[(y - y0) * 256:(y - y0 + 1) * 256, (x - x0) * 256:(x - x0 + 1) * 256] = t[..., 0] * 256 + t[..., 1] + t[..., 2] / 256 - 32768
    W, Hh = map(int, a.grid.split("x"))
    lons = np.linspace(a.lon0, a.lon1, W)
    lats = np.linspace(a.lat1, a.lat0, Hh)
    n = 2 ** z
    gx, gy = np.meshgrid((lons + 180) / 360 * n * 256 - x0 * 256,
                         (1 - np.arcsinh(np.tan(np.radians(lats))) / math.pi) / 2 * n * 256 - y0 * 256)
    ix, iy = np.floor(gx).astype(int), np.floor(gy).astype(int)
    fx, fy = gx - ix, gy - iy
    at = lambda yy, xx: mos[np.clip(yy, 0, mos.shape[0] - 1), np.clip(xx, 0, mos.shape[1] - 1)]
    h = at(iy, ix) * (1 - fx) * (1 - fy) + at(iy, ix + 1) * fx * (1 - fy) + at(iy + 1, ix) * (1 - fx) * fy + at(iy + 1, ix + 1) * fx * fy
    h = np.clip(h, 0, 9000).astype(np.int16)
    riv = []
    g = json.loads(fetch(RIVERS, CACHE / "ne_10m_rivers_lake_centerlines.geojson").read_text())
    for f in g["features"]:
        geom = f["geometry"]
        for ln in geom["coordinates"] if geom["type"] == "MultiLineString" else [geom["coordinates"]]:
            pts = [p for p in ln if a.lon0 <= p[0] <= a.lon1 and a.lat0 <= p[1] <= a.lat1]
            if len(pts) > 2:
                riv.append({"name": f["properties"].get("name"), "pts": [[round(p[0], 4), round(p[1], 4)] for p in pts]})
    meta = {"w": W, "h": Hh, "lat0": a.lat0, "lat1": a.lat1, "lon0": a.lon0, "lon1": a.lon1, "rivers": riv,
            "dem": base64.b64encode(h.tobytes()).decode()}
    Path(a.out).write_text("window.DEM = " + json.dumps(meta) + ";\n")
    iy_, ix_ = np.unravel_index(np.argmax(h), h.shape)
    print(a.out, h.shape, "range", h.min(), h.max(), "m; highest at", round(lats[iy_], 3), round(lons[ix_], 3),
          "; rivers:", sorted({r["name"] for r in riv}))


if __name__ == "__main__":
    main()

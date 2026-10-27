"""Wind field for the flow map, from a NOAA GFS 0.25° analysis on AWS (only the two needed GRIB messages are downloaded).

usage: gfs_wind.py <YYYYMMDD> <HH> <level> <india.geojson> <out.js> [--box 40,110,-2,40] [--step 0.5]
level is a GRIB level string from the .idx file: "850 mb" or "10 m above ground".
Writes window.WIND = {lon0, lat1, step, nx, ny, u, v, high, jet, land, india}: u/v in m/s on the grid (row 0 = north),
high = 1 where the ground is above 1,500 m (850 hPa is underground there), jet = [lat, lon, m/s] of the fastest wind
south of 25°N, land = Natural Earth 110m land rings, india = India's outer boundary segments from the geojson.
s06 used 20250715 00 "850 mb". Needs the eccodes Python package. Source: noaa-gfs-bdp-pds (AWS Open Data).
"""
import argparse
import collections
import json
import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

CACHE = Path(__file__).resolve().parents[2] / "out" / "hyperframes" / "cache"
GFS = "https://noaa-gfs-bdp-pds.s3.amazonaws.com/gfs.{d}/{h}/atmos/gfs.t{h}z.pgrb2.0p25.f000"
TILE = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/4/{x}/{y}.png"
LAND = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson"


def curl(url, dst, rng=None):
    if not dst.exists():
        dst.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sf", "-m", "180", *(["-r", rng] if rng else []), "-o", str(dst), url], check=True)
    return dst


def message(d, h, var, level):
    url = GFS.format(d=d, h=h)
    idx = curl(url + ".idx", CACHE / f"gfs/{d}{h}.idx").read_text().splitlines()
    for i, line in enumerate(idx):
        f = line.split(":")
        if f[3] == var and f[4] == level:
            end = int(idx[i + 1].split(":")[1]) - 1 if i + 1 < len(idx) else ""
            g = curl(url, CACHE / f"gfs/{d}{h}_{var}_{level.replace(' ', '_')}.grib2", f"{f[1]}-{end}")
            import eccodes
            with open(g, "rb") as fh:
                gid = eccodes.codes_grib_new_from_file(fh)
                vals = eccodes.codes_get_values(gid).reshape(eccodes.codes_get(gid, "Nj"), eccodes.codes_get(gid, "Ni"))
                eccodes.codes_release(gid)
            return vals  # 0.25° grid, lat 90 -> -90, lon 0 -> 359.75
    raise SystemExit(f"{var} at {level} not in the GFS index for {d} {h}z")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("date"); ap.add_argument("hour"); ap.add_argument("level"); ap.add_argument("geojson"); ap.add_argument("out")
    ap.add_argument("--box", default="40,110,-2,40"); ap.add_argument("--step", type=float, default=0.5)
    a = ap.parse_args()
    lon0, lon1, lat0, lat1 = map(float, a.box.split(","))
    lons, lats = np.arange(lon0, lon1 + 1e-6, a.step), np.arange(lat1, lat0 - 1e-6, -a.step)
    ri, ci = ((90 - lats) / 0.25).round().astype(int), ((lons % 360) / 0.25).round().astype(int)
    U = message(a.date, a.hour, "UGRD", a.level)[np.ix_(ri, ci)]
    V = message(a.date, a.hour, "VGRD", a.level)[np.ix_(ri, ci)]
    # coarse elevation (zoom 4 terrarium tiles) to mark ground above 1,500 m
    n = 16
    tx0, tx1 = int((lon0 + 180) / 360 * n), int((lon1 + 180) / 360 * n)
    ty = lambda lat: int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)
    ty0, ty1 = ty(lat1), ty(lat0)
    mos = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256), np.float32)
    for x in range(tx0, tx1 + 1):
        for y in range(ty0, ty1 + 1):
            t = np.asarray(Image.open(curl(TILE.format(x=x, y=y), CACHE / f"terrarium/4_{x}_{y}.png")).convert("RGB")).astype(np.float32)
            mos[(y - ty0) * 256:(y - ty0 + 1) * 256, (x - tx0) * 256:(x - tx0 + 1) * 256] = t[..., 0] * 256 + t[..., 1] + t[..., 2] / 256 - 32768
    gx = ((lons + 180) / 360 * n * 256 - tx0 * 256).round().astype(int)
    gy = ((1 - np.arcsinh(np.tan(np.radians(lats))) / math.pi) / 2 * n * 256 - ty0 * 256).round().astype(int)
    high = (mos[np.clip(gy, 0, mos.shape[0] - 1)][:, np.clip(gx, 0, mos.shape[1] - 1)] > 1500).astype(np.uint8)
    spd = np.hypot(U, V)
    i, j = np.unravel_index(np.argmax(spd * (1 - high) * (lats[:, None] < 25)), spd.shape)
    land = []
    for f in json.loads(curl(LAND, CACHE / "ne_110m_land.geojson").read_text())["features"]:
        g = f["geometry"]
        for p in g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]:
            if any(lon0 - 10 <= x <= lon1 + 10 and lat0 - 10 <= y <= lat1 + 10 for x, y in p[0]):
                land.append([[round(x, 3), round(y, 3)] for x, y in p[0]])
    gj = json.loads(Path(a.geojson).read_text())
    whole = {f["properties"]["st_nm"] for f in gj["features"] if "district" not in f["properties"]}
    cnt = collections.Counter()
    for f in gj["features"]:
        if f["properties"]["st_nm"] in whole and "district" in f["properties"]:
            continue
        g = f["geometry"]
        for p in g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]:
            r = [(round(x, 3), round(y, 3)) for x, y in p[0]]
            for e0, e1 in zip(r, r[1:] + r[:1]):
                if e0 != e1:
                    cnt[(e0, e1) if e0 < e1 else (e1, e0)] += 1
    india = [c for e, k in cnt.items() if k == 1 for c in (*e[0], *e[1])]
    data = {"lon0": lon0, "lat1": lat1, "step": a.step, "nx": len(lons), "ny": len(lats),
            "u": np.round(U, 2).ravel().tolist(), "v": np.round(V, 2).ravel().tolist(), "high": high.ravel().tolist(),
            "jet": [float(lats[i]), float(lons[j]), round(float(spd[i, j]), 1)], "land": land, "india": india}
    Path(a.out).write_text("window.WIND = " + json.dumps(data, separators=(",", ":")) + ";\n")
    print(a.out, U.shape, "max", round(float(spd.max()), 1), "m/s; jet", data["jet"])


if __name__ == "__main__":
    main()

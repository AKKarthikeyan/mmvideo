"""Land around India (Sri Lanka and the neighbours) for route maps, clipped to a box.

usage: region_land.py <out.js> [--box 60,-2,100,40] [--res 50m]
Writes window.LANDR = [[lon, lat, lon, lat, ...], ...]: Natural Earth land rings (public domain) clipped to the box
(lon0, lat0, lon1, lat1) with Sutherland-Hodgman, rounded to 0.01 degree. India itself is drawn from
shared/geo/india_districts.js; this file is the backdrop and the island of Sri Lanka.
"""
import argparse
import json
import subprocess
from pathlib import Path

CACHE = Path(__file__).resolve().parents[2] / "out" / "hyperframes" / "cache"
URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_{}_land.geojson"


def clip(ring, x0, y0, x1, y1):
    edges = [(lambda p: p[0] >= x0, lambda a, b: (x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0]))),
             (lambda p: p[0] <= x1, lambda a, b: (x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0]))),
             (lambda p: p[1] >= y0, lambda a, b: (a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0)),
             (lambda p: p[1] <= y1, lambda a, b: (a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1))]
    pts = ring
    for inside, cut in edges:
        if not pts:
            break
        out, prev = [], pts[-1]
        for cur in pts:
            if inside(cur):
                if not inside(prev):
                    out.append(cut(prev, cur))
                out.append(cur)
            elif inside(prev):
                out.append(cut(prev, cur))
            prev = cur
        pts = out
    return pts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out"); ap.add_argument("--box", default="60,-2,100,40"); ap.add_argument("--res", default="50m")
    a = ap.parse_args()
    box = [float(v) for v in a.box.split(",")]
    src = CACHE / f"ne_{a.res}_land.geojson"
    if not src.exists():
        src.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sf", "-m", "300", "-o", str(src), URL.format(a.res)], check=True)
    rings = []
    for f in json.loads(src.read_text())["features"]:
        g = f["geometry"]
        for poly in g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]:
            r = clip([tuple(p[:2]) for p in poly[0]], *box)
            flat, last = [], None
            for x, y in r:
                q = (round(x, 2), round(y, 2))
                if q != last:
                    flat += q; last = q
            if len(flat) >= 8:
                rings.append(flat)
    Path(a.out).write_text("window.LANDR = " + json.dumps(rings, separators=(",", ":")) + ";\n")
    print(a.out, len(rings), "rings", sum(len(r) for r in rings) // 2, "points")


if __name__ == "__main__":
    main()

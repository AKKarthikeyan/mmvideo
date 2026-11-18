"""India GeoJSON -> per-state prism data for the 3D seats map (sample s15).

usage: geo3d.py <india.geojson> <map beat json> <out .js>
Writes window.GEO = {states: [{name, seats, polys, edges, c}], coast, box}.
polys are the state outline (or its districts, where the file has no outline) as outer ring + holes
in map units; edges are the state's boundary segments; coast is every edge no other state shares.
Source used so far: github.com/udit-001/india-maps-data geojson/india.geojson (community data, unverified).
"""
import collections
import json
import math
import sys

LON0, LAT0, K = 82.5, 22.0, math.cos(math.radians(22))


def proj(p):
    return (round((p[0] - LON0) * K, 4), round(p[1] - LAT0, 4))


def area_c(r):
    a = cx = cy = 0.0
    for (x0, y0), (x1, y1) in zip(r, r[1:] + r[:1]):
        f = x0 * y1 - x1 * y0
        a += f; cx += (x0 + x1) * f; cy += (y0 + y1) * f
    return a / 2, (cx / (3 * a) if a else 0), (cy / (3 * a) if a else 0)


def main(geo_path, beat_path, out):
    g = json.load(open(geo_path))
    seats = json.load(open(beat_path))["beats"][0]["scene"]["values"]
    polys = collections.defaultdict(list)
    count = collections.defaultdict(collections.Counter)   # state -> edge -> times seen
    every = collections.Counter()                          # edge -> times seen anywhere
    # The file mixes whole-state outlines with districts; use the state outline where one exists.
    whole = {f["properties"]["st_nm"] for f in g["features"] if "district" not in f["properties"]}
    for f in g["features"]:
        st = f["properties"]["st_nm"]
        if st in whole and "district" in f["properties"]:
            continue
        geom = f["geometry"]
        for poly in (geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]):
            rings = []
            for ring in poly:
                r = [proj(p) for p in ring]
                r = [p for i, p in enumerate(r) if i == 0 or p != r[i - 1]]
                if r[0] == r[-1]:
                    r = r[:-1]
                if len(r) < 3:
                    continue
                rings.append(r)
                for a, b in zip(r, r[1:] + r[:1]):
                    e = (a, b) if a < b else (b, a)
                    count[st][e] += 1
                    every[e] += 1
            if rings:
                polys[st].append(rings)
    states = []
    for st, ps in polys.items():
        A = X = Y = 0.0
        for rings in ps:
            a, cx, cy = area_c(rings[0])
            A += abs(a); X += cx * abs(a); Y += cy * abs(a)
        edges = [c for e, n in count[st].items() if n == 1 for c in (*e[0], *e[1])]
        states.append({"name": st, "seats": seats[st], "c": [round(X / A, 3), round(Y / A, 3)],
                       "polys": [[[c for p in r for c in p] for r in rings] for rings in ps], "edges": edges})
    coast = [c for e, n in every.items() if n == 1 for c in (*e[0], *e[1])]
    xs = [p[0] for s in polys.values() for rings in s for p in rings[0]]
    ys = [p[1] for s in polys.values() for rings in s for p in rings[0]]
    data = {"states": states, "coast": coast, "box": [min(xs), min(ys), max(xs), max(ys)]}
    assert sum(s["seats"] for s in states) == 543, sum(s["seats"] for s in states)
    open(out, "w").write("window.GEO = " + json.dumps(data, separators=(",", ":")) + ";\n")
    print(out, len(states), "states", sum(len(s["edges"]) // 4 for s in states), "state edges",
          len(coast) // 4, "coast edges", data["box"])


if __name__ == "__main__":
    main(*sys.argv[1:4])

"""Decode Natural Earth TopoJSON (world-atlas land-50m.json + countries-50m.json) into a small JS data file:
window.LAND50 = land rings [[lon, lat], ...] and window.BORDERS50 = shared country-border lines.

usage: python3 -I topo_world.py <land-50m.json> <countries-50m.json> <out.js>
Get the JSON with `npm pack world-atlas@2` (Natural Earth, public domain; package ISC). Only reads data, runs no package code.
"""
import json
import sys


def decode_arcs(topo):
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    out = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((round(x * sx + tx, 2), round(y * sy + ty, 2)))
        out.append(pts)
    return out


def ring(arcs, idxs):
    pts = []
    for i in idxs:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts.extend(a if not pts else a[1:])
    return pts


def main(land_path, ctry_path, out_path):
    land = json.load(open(land_path))
    la = decode_arcs(land)
    rings = []
    for g in land["objects"]["land"]["geometries"]:
        polys = [g["arcs"]] if g["type"] == "Polygon" else g["arcs"]
        for poly in polys:
            rings.append(ring(la, poly[0]))
    ctry = json.load(open(ctry_path))
    ca = decode_arcs(ctry)
    users = {}
    for k, g in enumerate(ctry["objects"]["countries"]["geometries"]):
        polys = [] if g["type"] is None else ([g["arcs"]] if g["type"] == "Polygon" else g["arcs"])
        for poly in polys:
            for rg in poly:
                for i in rg:
                    users.setdefault(i if i >= 0 else ~i, set()).add(k)
    borders = [ca[i] for i, u in sorted(users.items()) if len(u) > 1]
    js = ("// Natural Earth 1:50m land and country borders (public domain), from world-atlas@2.0.2 via tools/topo_world.py\n"
          f"window.LAND50={json.dumps(rings, separators=(',', ':'))};\n"
          f"window.BORDERS50={json.dumps(borders, separators=(',', ':'))};\n")
    open(out_path, "w").write(js)
    print("rings", len(rings), "points", sum(map(len, rings)), "borders", len(borders), "bytes", len(js))


if __name__ == "__main__":
    main(*sys.argv[1:4])

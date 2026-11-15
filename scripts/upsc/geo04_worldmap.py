#!/usr/bin/env python3
"""GEO-04 world map (UPSC volcano film): simplified Pacific-centred country outlines as SVG path data.
Source: Natural Earth 10 m admin-0 countries, India's point of view (public domain). Equirectangular, centre 165 E, so the Pacific
sits in the middle and India (68-97 E, Ladakh to the Andaman and Nicobar Islands and Lakshadweep) is whole at the left.
No plate boundaries are drawn (no licensed data). Run: python3 -I scripts/upsc/geo04_worldmap.py
"""
import json, math, os, sys

SRC = "/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_admin_0_countries_ind.geojson"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "datayt", "long", "upsc", "geo04_worldmap.json")
C, K = 165.0, 5.2            # centre longitude, px per degree
LA0, LA1 = -58.0, 76.0       # south and north edges kept
LON0 = C - 180.0; LON1 = C + 180.0
W = 360 * K                  # 1872
TOL = 0.6


def clip(pts, x0, y0, x1, y1):
    def edge(pts, inside, inter):
        out = []
        for i, p in enumerate(pts):
            q = pts[i - 1]
            if inside(p):
                if not inside(q): out.append(inter(q, p))
                out.append(p)
            elif inside(q): out.append(inter(q, p))
        return out
    ix = lambda xv: (lambda a, b: (xv, a[1] + (b[1] - a[1]) * (xv - a[0]) / (b[0] - a[0])))
    iy = lambda yv: (lambda a, b: (a[0] + (b[0] - a[0]) * (yv - a[1]) / (b[1] - a[1]), yv))
    for ins, it in ((lambda p: p[0] >= x0, ix(x0)), (lambda p: p[0] <= x1, ix(x1)), (lambda p: p[1] >= y0, iy(y0)), (lambda p: p[1] <= y1, iy(y1))):
        if not pts: return []
        pts = edge(pts, ins, it)
    return pts


def dp(pts, tol):
    if len(pts) < 4: return pts
    keep = [False] * len(pts); keep[0] = keep[-1] = True
    st = [(0, len(pts) - 1)]
    while st:
        a, b = st.pop()
        ax, ay = pts[a]; bx, by = pts[b]; dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy)
        bi, bd = -1, tol
        for i in range(a + 1, b):
            px, py = pts[i]
            d = abs(dy * (px - ax) - dx * (py - ay)) / L if L else math.hypot(px - ax, py - ay)
            if d > bd: bi, bd = i, d
        if bi >= 0: keep[bi] = True; st += [(a, bi), (bi, b)]
    return [p for p, k in zip(pts, keep) if k]


def area(p): return 0.5 * sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p)))


def rings(geom):
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    for poly in polys:
        for r in poly[:1]:
            yield r


def main():
    g = json.load(open(SRC)); d = {"land": [], "india": []}; n = 0
    for f in g["features"]:
        name = "india" if f["properties"].get("ADMIN") == "India" else "land"
        if f["properties"].get("ADMIN") == "Antarctica": continue
        for ring in rings(f["geometry"]):
            for sh in (-360, 0, 360):
                pts = [(p[0] + sh, p[1]) for p in ring]
                if max(p[0] for p in pts) < LON0 or min(p[0] for p in pts) > LON1: continue
                cl = clip(pts, LON0, LA0, LON1, LA1)
                if len(cl) < 3: continue
                pp = [((a - LON0) * K, (LA1 - b) * K) for a, b in cl]
                if name != "india" and abs(area(pp)) < 9.0: continue
                raw = pp
                pp = dp(pp + [pp[0]], TOL if name == "india" else TOL * 1.6)[:-1]
                if len(pp) < 3: pp = raw if name == "india" else []
                if len(pp) < 3: continue
                d[name].append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pp) + "Z"); n += len(pp)
    out = {"source": "Natural Earth 10m admin-0 countries, India point of view (public domain); simplified, no plate boundaries",
           "w": round(W, 1), "h": round((LA1 - LA0) * K, 1), "lon0": LON0, "lat1": LA1, "k": K, "land": "".join(d["land"]), "india": "".join(d["india"])}
    json.dump(out, open(OUT, "w"), separators=(",", ":"))
    print("points", n, "bytes", os.path.getsize(OUT), file=sys.stderr)


main()

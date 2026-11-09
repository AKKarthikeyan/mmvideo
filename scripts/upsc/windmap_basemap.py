#!/usr/bin/env python3
"""Windmap basemap (UPSC monsoon film, GEO-07): simplified, projected SVG path data for the three focus boxes.
Source: Natural Earth 10 m admin-0 countries, India's point of view (public domain; the file Indica Atlas uses).
India's outline is taken from that file unchanged in shape (only simplified). Equirectangular, one scale per box,
every box exactly 1920 x 1080 px. Run: python3 -I scripts/upsc/windmap_basemap.py
"""
import json, math, os, sys

SRC = "/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_admin_0_countries_ind.geojson"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "datayt", "long", "upsc", "basemap.json")
W, H = 1920, 1080
# name: (centre lon, lat0 (south), lat1 (north), simplify tolerance in px)
BOXES = {"ocean": (65.0, -44.0, 26.0, 0.8), "india": (80.0, -3.0, 39.0, 0.55), "asia": (80.0, -10.0, 45.0, 0.7)}
PAD = 3.0  # degrees of land kept beyond the frame so clipped edges are off screen


def rings_of(geom):
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    for poly in polys:
        for i, r in enumerate(poly):
            yield r, i == 0


def clip(ring, x0, y0, x1, y1):
    def edge(pts, inside, inter):
        out = []
        for i, p in enumerate(pts):
            q = pts[i - 1]
            if inside(p):
                if not inside(q): out.append(inter(q, p))
                out.append(p)
            elif inside(q): out.append(inter(q, p))
        return out
    def ix(xv):
        return lambda a, b: (xv, a[1] + (b[1] - a[1]) * (xv - a[0]) / (b[0] - a[0]))
    def iy(yv):
        return lambda a, b: (a[0] + (b[0] - a[0]) * (yv - a[1]) / (b[1] - a[1]), yv)
    pts = [tuple(p[:2]) for p in ring]
    for ins, it in ((lambda p: p[0] >= x0, ix(x0)), (lambda p: p[0] <= x1, ix(x1)),
                    (lambda p: p[1] >= y0, iy(y0)), (lambda p: p[1] <= y1, iy(y1))):
        if not pts: return []
        pts = edge(pts, ins, it)
    return pts


def dp(pts, tol):
    if len(pts) < 3: return pts
    keep = [False] * len(pts); keep[0] = keep[-1] = True
    st = [(0, len(pts) - 1)]
    while st:
        a, b = st.pop()
        ax, ay = pts[a]; bx, by = pts[b]
        dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy)
        bi, bd = -1, tol
        for i in range(a + 1, b):
            px, py = pts[i]
            d = abs(dy * (px - ax) - dx * (py - ay)) / L if L else math.hypot(px - ax, py - ay)
            if d > bd: bi, bd = i, d
        if bi >= 0:
            keep[bi] = True; st += [(a, bi), (bi, b)]
    return [p for p, k in zip(pts, keep) if k]


def area(p):
    return 0.5 * sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p)))


def build(feats, c, la0, la1, tol):
    k = H / (la1 - la0)
    lon0 = c - W / (2 * k); lon1 = c + W / (2 * k)
    X = lambda lo: (lo - lon0) * k
    Y = lambda la: (la1 - la) * k
    d_all = {"land": [], "india": []}; n = {"land": 0, "india": 0}
    for f in feats:
        name = "india" if f["properties"].get("ADMIN") == "India" else "land"
        for ring, outer in rings_of(f["geometry"]):
            cl = clip(ring, lon0 - PAD, la0 - PAD, lon1 + PAD, la1 + PAD)
            if len(cl) < 3: continue
            pp = [(X(a), Y(b)) for a, b in cl]
            if name != "india" and abs(area(pp)) < 14.0: continue   # drop specks of non-India land; India keeps every island (Andaman and Nicobar, Lakshadweep)
            t = tol if name == "india" else tol * 2.4
            raw = pp
            pp = dp(pp + [pp[0]], t)[:-1] if len(pp) > 3 else pp
            if len(pp) < 3 and name == "india": pp = raw   # keep tiny Indian islands unsimplified
            if len(pp) < 3: continue
            d_all[name].append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pp) + "Z"); n[name] += len(pp)
    return {"lon0": round(lon0, 4), "lon1": round(lon1, 4), "lat0": la0, "lat1": la1, "k": round(k, 6),
            "land": "".join(d_all["land"]), "india": "".join(d_all["india"])}, n


def main():
    g = json.load(open(SRC))
    out = {"source": "Natural Earth 10m admin-0 countries, India point of view (public domain)", "w": W, "h": H, "boxes": {}}
    for name, (c, a, b, tol) in BOXES.items():
        box, n = build(g["features"], c, a, b, tol)
        out["boxes"][name] = box
        print(name, "points", n, "k=%.3f px/deg" % box["k"], "lon %.1f..%.1f" % (box["lon0"], box["lon1"]), file=sys.stderr)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(out, open(OUT, "w"), separators=(",", ":"))
    print("wrote", os.path.normpath(OUT), os.path.getsize(OUT), "bytes", file=sys.stderr)


main()

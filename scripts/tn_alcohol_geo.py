"""Tamil Nadu district map for the NFHS-6 alcohol video: GeoJSON -> simplified SVG paths + label anchors.

Usage: python3 scripts/tn_alcohol_geo.py <TAMIL_NADU_DISTRICTS.geojson>
Source geometry: github.com/datta07/INDIAN-SHAPEFILES (STATES/TAMIL NADU/TAMIL NADU_DISTRICTS.geojson, 38 districts).
Writes public/tnmap/geo.json in a W x H unit box (equirectangular, longitude scaled by cos(mid-lat)).
"""
import json, math, sys, os

W, H = 1000, 1300
TOL = 0.9          # Douglas-Peucker tolerance, map units
MIN_RING = 40.0    # drop islands smaller than this (map units^2)


def rings_of(geom):
    """Every ring as its own list (some 'Polygon's carry extra outers, not holes); paths render with evenodd."""
    polys = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
    return [[ring] for poly in polys for ring in poly]


def dp(pts, tol):
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = pts[a]; bx, by = pts[b]
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy) or 1e-9
        best, bi = -1, -1
        for i in range(a + 1, b):
            px, py = pts[i]
            d = abs(dy * (px - ax) - dx * (py - ay)) / L
            if d > best:
                best, bi = d, i
        if best > tol:
            keep[bi] = True
            stack += [(a, bi), (bi, b)]
    return [p for p, k in zip(pts, keep) if k]


def area(r):
    return 0.5 * sum(r[i][0] * r[i - 1][1] - r[i - 1][0] * r[i][1] for i in range(len(r)))


def inside(x, y, r):
    c = False
    j = len(r) - 1
    for i in range(len(r)):
        xi, yi = r[i]; xj, yj = r[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi:
            c = not c
        j = i
    return c


def seg_dist(x, y, r):
    best = 1e18
    for i in range(len(r)):
        ax, ay = r[i - 1]; bx, by = r[i]
        dx, dy = bx - ax, by - ay
        t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy + 1e-12)))
        best = min(best, math.hypot(x - ax - t * dx, y - ay - t * dy))
    return best


def anchor(r):
    """Approximate pole of inaccessibility: coarse grid then refine."""
    xs = [p[0] for p in r]; ys = [p[1] for p in r]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    best = (-1, (x0 + x1) / 2, (y0 + y1) / 2)
    step = max(x1 - x0, y1 - y0) / 24
    cx, cy = best[1], best[2]
    for _ in range(4):
        gx = [cx + (i - 12) * step for i in range(25)] if _ else [x0 + i * (x1 - x0) / 24 for i in range(25)]
        gy = [cy + (i - 12) * step for i in range(25)] if _ else [y0 + i * (y1 - y0) / 24 for i in range(25)]
        for x in gx:
            for y in gy:
                if inside(x, y, r):
                    d = seg_dist(x, y, r)
                    if d > best[0]:
                        best = (d, x, y)
        cx, cy = best[1], best[2]
        step /= 6
    return best[1], best[2], best[0]


def main(src):
    feats = json.load(open(src))["features"]
    allpts = [p for f in feats for poly in rings_of(f["geometry"]) for ring in poly for p in ring]
    lo0, lo1 = min(p[0] for p in allpts), max(p[0] for p in allpts)
    la0, la1 = min(p[1] for p in allpts), max(p[1] for p in allpts)
    k = math.cos(math.radians((la0 + la1) / 2))
    sx = (lo1 - lo0) * k; sy = la1 - la0
    s = min((W - 20) / sx, (H - 20) / sy)
    ox = (W - sx * s) / 2; oy = (H - sy * s) / 2
    proj = lambda p: ((p[0] - lo0) * k * s + ox, (la1 - p[1]) * s + oy)

    out = []
    for f in feats:
        name = f["properties"]["dtname"].strip()
        polys, big = [], None
        for poly in rings_of(f["geometry"]):
            outer = [proj(p) for p in poly[0]]
            a = abs(area(outer))
            if a < MIN_RING:
                continue
            # closed ring: split at the vertex farthest from the start so DP has a real baseline
            m = max(range(len(outer)), key=lambda i: math.dist(outer[0], outer[i]))
            simp = dp(outer[:m + 1], TOL)[:-1] + dp(outer[m:], TOL)
            if len(simp) < 4:
                continue
            polys.append(simp)
            if big is None or a > big[0]:
                big = (a, simp)
        d = " ".join("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in r) + "Z" for r in polys)
        ax, ay, rad = anchor(big[1])
        out.append({"name": name, "d": d, "lx": round(ax, 1), "ly": round(ay, 1), "r": round(rad, 1), "area": round(big[0])})
        print(f"{name:18s} rings={len(polys):2d} pts={sum(len(r) for r in polys):5d} anchor=({ax:.0f},{ay:.0f}) r={rad:.0f}")
    os.makedirs("public/tnmap", exist_ok=True)
    json.dump({"w": W, "h": H, "districts": out}, open("public/tnmap/geo.json", "w"), separators=(",", ":"))
    print("bytes", os.path.getsize("public/tnmap/geo.json"))


if __name__ == "__main__":
    main(sys.argv[1])

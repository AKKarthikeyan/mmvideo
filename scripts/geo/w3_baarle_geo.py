# W3-03 Baarle: SCHEMATIC enclave outlines for src/geo/week3/baarle_geo.ts (8 Nov 2026).
# Source geometry is official only (research folder, method/ outputs):
#   Kadaster PDOK gemeentegebied Baarle-Nassau (CRS84): part 8 = main body with 22 holes (Belgian enclaves), parts 0-7 = Dutch pieces
#   Digitaal Vlaanderen VRBG refgem Baarle-Hertog (EPSG:4326): 26 parts (22 enclaves + 4 other parts)
# The enclaves are far too small for the satellite map, so each view is ENLARGED (uniform scale in lon and lat, so shapes stay true)
# and placed in an inset card above the real spot. Views: A = whole municipality, C = the largest Belgian
# enclave (165 ha) with its six Dutch pieces. C is clipped to the card (Sutherland-Hodgman).
# Run: python3 -I scripts/geo/w3_baarle_geo.py   (writes src/geo/week3/baarle_geo.ts)
import json, math, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "docs/geo/research/W3-03-baarle/sources")
OUT = os.path.join(ROOT, "src/geo/week3/baarle_geo.ts")

# Camera used for every schematic beat (must equal SCH in baarle.ts) and the projection constants of the engine.
CAM_LON, CAM_LAT, SPAN, HAND_LAT = 4.93, 51.878, 4.0, 51.44
COS0 = math.cos(math.radians(HAND_LAT))
PX_LON = 1080 / SPAN              # px per degree of longitude
PX_LAT = 1080 / (SPAN * COS0)     # px per degree of latitude
# Card on screen (px): x 60-920, y 500-1080; drawing area inside it leaves a strip at the top for the SCHEMATIC tag.
CARD = (60, 920, 500, 1080)
AREA = (85, 895, 590, 1060)


def to_ll(x, y):
    return (CAM_LON + (x - 540) / PX_LON, CAM_LAT - (y - 960) / PX_LAT)


def ring_area(r):  # signed, in deg^2 (just for sorting)
    return 0.5 * sum(r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1] for i in range(len(r) - 1))


def clip(ring, x0, x1, y0, y1):  # Sutherland-Hodgman against an axis-aligned box in lon/lat
    def cut(pts, inside, inter):
        out = []
        for i in range(len(pts)):
            a, b = pts[i - 1], pts[i]
            if inside(b):
                if not inside(a): out.append(inter(a, b))
                out.append(b)
            elif inside(a):
                out.append(inter(a, b))
        return out

    def ix(a, b, x): t = (x - a[0]) / (b[0] - a[0]); return (x, a[1] + t * (b[1] - a[1]))
    def iy(a, b, y): t = (y - a[1]) / (b[1] - a[1]); return (a[0] + t * (b[0] - a[0]), y)
    p = ring[:-1] if ring[0] == ring[-1] else ring
    for inside, inter in ((lambda q: q[0] >= x0, lambda a, b: ix(a, b, x0)), (lambda q: q[0] <= x1, lambda a, b: ix(a, b, x1)),
                          (lambda q: q[1] >= y0, lambda a, b: iy(a, b, y0)), (lambda q: q[1] <= y1, lambda a, b: iy(a, b, y1))):
        p = cut(p, inside, inter)
        if not p: return []
    return p


def thin(r, tol):  # drop points closer than tol (degrees) to the last kept one
    out = [r[0]]
    for q in r[1:]:
        if math.hypot(q[0] - out[-1][0], q[1] - out[-1][1]) >= tol: out.append(q)
    return out if len(out) >= 3 else []


nl = json.load(open(os.path.join(SRC, "pdok_gemeentegebied_baarle_nassau_crs84.json")))["features"][0]["geometry"]["coordinates"]
be = json.load(open(os.path.join(SRC, "vrbg_refgem_baarle_hertog_4326.json")))["features"][0]["geometry"]["coordinates"]
body_i = max(range(len(nl)), key=lambda i: len(nl[i][0]))
BODY = nl[body_i][0]
HOLES = nl[body_i][1:]
NLP = [nl[i][0] for i in range(len(nl)) if i != body_i]
BEP = [p[0] for p in be]
assert len(HOLES) == 22 and len(NLP) == 8 and len(BEP) == 26, (len(HOLES), len(NLP), len(BEP))
big_hole = max(HOLES, key=lambda r: abs(ring_area(r)))


def bbox(rings):
    xs = [q[0] for r in rings for q in r]; ys = [q[1] for r in rings for q in r]
    return min(xs), max(xs), min(ys), max(ys)


def view(win_rings, pad, do_clip):
    """Fit the bbox of win_rings (+pad fraction) into AREA; return a transform and the clip window in source lon/lat."""
    x0, x1, y0, y1 = bbox(win_rings)
    w, h = (x1 - x0) * (1 + 2 * pad), (y1 - y0) * (1 + 2 * pad)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    aw, ah = AREA[1] - AREA[0], AREA[3] - AREA[2]
    k = min(aw / (w * PX_LON), ah / (h * PX_LAT))        # enlargement factor
    acx, acy = to_ll((AREA[0] + AREA[1]) / 2, (AREA[2] + AREA[3]) / 2)
    win = (cx - aw / (2 * k * PX_LON), cx + aw / (2 * k * PX_LON), cy - ah / (2 * k * PX_LAT), cy + ah / (2 * k * PX_LAT))
    tol = 1.2 / (k * PX_LON)                                # ~1.2 px on screen

    def tf(r):
        if do_clip: r = clip(r, *win)
        if not r: return []
        r = thin(r, tol)
        return [[round(acx + (q[0] - cx) * k, 5), round(acy + (q[1] - cy) * k, 5)] for q in r]

    def pt(lon, lat):
        return [round(acx + (lon - cx) * k, 4), round(acy + (lat - cy) * k, 4)]
    return tf, pt, k


def centroid(r):
    return sum(q[0] for q in r) / len(r), sum(q[1] for q in r) / len(r)


views = {}
for name, win, pad, cl in (("A", [BODY] + BEP, 0.02, False), ("C", [big_hole], 0.08, True)):
    tf, pt, k = view(win, pad, cl)
    v = {"body": tf(BODY), "be": [x for x in (tf(r) for r in BEP) if x], "nl": [x for x in (tf(r) for r in NLP) if x], "holes": [x for x in (tf(r) for r in HOLES) if x], "k": round(k, 1)}
    v["bigHole"] = pt(*centroid(big_hole))
    v["nlInBig"] = [pt(*centroid(r)) for r in NLP if abs(ring_area(r)) > 0 and
                    min(q[0] for q in big_hole) < centroid(r)[0] < max(q[0] for q in big_hole) and
                    min(q[1] for q in big_hole) < centroid(r)[1] < max(q[1] for q in big_hole)]
    views[name] = v
    print(name, "k", v["k"], "body pts", len(v["body"]), "be", len(v["be"]), "nl", len(v["nl"]), "nl in big-hole bbox", len(v["nlInBig"]))

c0, c1 = to_ll(CARD[0], CARD[2]), to_ll(CARD[1], CARD[3])
card = [[round(c0[0], 4), round(c0[1], 4)], [round(c1[0], 4), round(c0[1], 4)], [round(c1[0], 4), round(c1[1], 4)], [round(c0[0], 4), round(c1[1], 4)]]
real = centroid(big_hole)

with open(OUT, "w") as f:
    f.write("// GENERATED by scripts/geo/w3_baarle_geo.py from the official Kadaster (PDOK) and Digitaal Vlaanderen (VRBG) polygons\n")
    f.write("// saved in docs/geo/research/W3-03-baarle/sources. SCHEMATIC: enlarged (uniform scale) and placed in an inset card; not map positions.\n")
    f.write("type P = [number, number];\n")
    f.write(f"export const BAARLE_CARD: P[] = {json.dumps(card)};\n")
    f.write(f"export const BAARLE_REAL: P = [{real[0]:.4f}, {real[1]:.4f}];   // centre of the largest Belgian enclave, real position\n")
    for n, v in views.items():
        f.write(f"export const BAARLE_{n} = {{k: {v['k']}, body: {json.dumps(v['body'])} as P[], be: {json.dumps(v['be'])} as P[][], "
                f"nl: {json.dumps(v['nl'])} as P[][], holes: {json.dumps(v['holes'])} as P[][], bigHole: {json.dumps(v['bigHole'])} as P, nlInBig: {json.dumps(v['nlInBig'])} as P[]}};\n")
print("wrote", OUT, os.path.getsize(OUT), "bytes; card", card, "real", real)

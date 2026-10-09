"""India state map for Data YT Shorts: GeoJSON -> simplified SVG paths + label anchors, named as in NFHS-6.

Usage: python3 scripts/datayt/india_geo.py <INDIA_STATES.geojson>
Source: github.com/datta07/INDIAN-SHAPEFILES INDIA/INDIA_STATES.geojson (37 features, LGD state codes). Its northern
boundary follows the official map of India (J&K incl. PoK; Ladakh incl. Gilgit-Baltistan and Aksai Chin): keep it.
Writes public/datayt/india/geo.json.
"""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from tn_alcohol_geo import dp, area, anchor   # same simplifier / pole-of-inaccessibility as the TN map

W, H = 1000, 1100
TOL, MIN_RING = 0.7, 1.5
NAME = {"ANDAMAN & NICOBAR": "Andaman and Nicobar Islands", "DADRA & NAGAR HAVELI": "Dadra & Nagar Haveli and Daman & Diu",
        "DAMAN & DIU": "Dadra & Nagar Haveli and Daman & Diu", "DELHI": "NCT of Delhi", "JAMMU & KASHMIR": "Jammu and Kashmir"}
title = lambda s: NAME.get(s, s.title().replace(" And ", " and "))


def main(src):
    feats = json.load(open(src))["features"]
    rings_of = lambda g: [[r] for poly in ([g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]) for r in poly]
    allp = [p for f in feats for pl in rings_of(f["geometry"]) for r in pl for p in r]
    lo0, lo1 = min(p[0] for p in allp), max(p[0] for p in allp)
    la0, la1 = min(p[1] for p in allp), max(p[1] for p in allp)
    k = math.cos(math.radians((la0 + la1) / 2))
    s = min((W - 20) / ((lo1 - lo0) * k), (H - 20) / (la1 - la0))
    ox = (W - (lo1 - lo0) * k * s) / 2; oy = (H - (la1 - la0) * s) / 2
    proj = lambda p: ((p[0] - lo0) * k * s + ox, (la1 - p[1]) * s + oy)
    out = {}
    for f in feats:
        nm = title(f["properties"]["STNAME"].strip())
        rec = out.setdefault(nm, {"name": nm, "rings": [], "big": None})
        for pl in rings_of(f["geometry"]):
            ring = [proj(p) for p in pl[0]]
            a = abs(area(ring))
            if a < MIN_RING and nm != "Lakshadweep":   # keep Lakshadweep's atolls, drop other specks
                continue
            m = max(range(len(ring)), key=lambda i: math.dist(ring[0], ring[i]))
            simp = dp(ring[:m + 1], TOL)[:-1] + dp(ring[m:], TOL)
            if len(simp) < 3:
                simp = ring if len(ring) >= 3 else simp
            if len(simp) < 3:
                continue
            rec["rings"].append(simp)
            if rec["big"] is None or a > rec["big"][0]:
                rec["big"] = (a, simp)
    res = []
    for nm, r in out.items():
        d = " ".join("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in ring) + "Z" for ring in r["rings"])
        ax, ay, rad = anchor(r["big"][1])
        xs = [x for ring in r["rings"] for x, _ in ring]; ys = [y for ring in r["rings"] for _, y in ring]
        res.append({"name": nm, "d": d, "lx": round(ax, 1), "ly": round(ay, 1), "r": round(rad, 1),
                    "bbox": [round(min(xs), 1), round(min(ys), 1), round(max(xs), 1), round(max(ys), 1)]})
        print(f"{nm:40s} rings={len(r['rings']):3d} r={rad:5.1f}")
    os.makedirs("public/datayt/india", exist_ok=True)
    json.dump({"w": W, "h": H, "states": res}, open("public/datayt/india/geo.json", "w"), separators=(",", ":"))
    print("bytes", os.path.getsize("public/datayt/india/geo.json"))


if __name__ == "__main__":
    main(sys.argv[1])

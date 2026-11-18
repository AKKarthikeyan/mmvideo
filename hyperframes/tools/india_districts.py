"""All-India district map for the district export videos: 820 current districts, borders simplified together so
neighbours still meet, plus state lines and the national outline.

usage: india_districts.py <out.js> [--eps 0.012]
Writes window.INDIA = {districts: [{n, s, code, c: [lon, lat], rings: [[lon, lat, ...], ...]}], states: [...segments],
outline: [...segments]} with coordinates in degrees (3 decimals). Segments are flat [lon0, lat0, lon1, lat1, ...] runs.
--eps is the simplification tolerance in degrees (0.012 ≈ 1.3 km, under a pixel for all-India at 1080p).
Source: github.com/datta07/INDIAN-SHAPEFILES INDIA/INDIA_DISTRICTS.geojson (community data: replace with Survey of India
boundaries before publishing).
"""
import argparse
import json
import subprocess
from collections import defaultdict
from pathlib import Path

CACHE = Path(__file__).resolve().parents[2] / "out" / "hyperframes" / "cache"
SRC = "https://raw.githubusercontent.com/datta07/INDIAN-SHAPEFILES/master/INDIA/INDIA_DISTRICTS.geojson"


# The source spells some letters with symbols (KOLK>TA, DEHRAD@N, BENGAL#RU, B\\DAR) and cuts some Karnataka names
# short (B, H, KOL). Symbols decode one-for-one; the short names are restored from their Census 2011 district codes,
# whose centroids check out (0556 at 16.3N 75.6E is Bagalkote, 0581 at 13.2N 78.3E is Kolar, and so on).
SYMBOLS = str.maketrans({">": "a", "|": "i", "\\": "i", "@": "u", "#": "u"})
SHORT = {"0556": "Bagalkote", "0555": "Belagavi", "0565": "Ballari", "0578": "Chamarajanagara", "0582": "Chikkaballapura",
         "0567": "Davanagere", "0562": "Dharwad", "0564": "Haveri", "0574": "Hassan", "0581": "Kolar", "0580": "Yadgir",
         "0584": "Ramanagara"}


def name(p):
    if p["dist_code"] in SHORT and p["state"] == "KARNATAKA":
        return SHORT[p["dist_code"]]
    return (p["district"] or "").translate(SYMBOLS).title()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out"); ap.add_argument("--eps", type=float, default=0.012)
    a = ap.parse_args()
    src = CACHE / "INDIA_DISTRICTS.geojson"
    if not src.exists():
        src.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-sf", "-m", "600", "-o", str(src), SRC], check=True)
    import topojson
    from shapely.geometry import shape

    gj = json.loads(src.read_text())
    feats = [f for f in gj["features"] if f["geometry"]]
    topo = topojson.Topology({"type": "FeatureCollection", "features": feats}, prequantize=False,
                             toposimplify=a.eps, simplify_with="shapely", simplify_algorithm="dp")
    out = json.loads(topo.to_geojson())
    districts = []
    for f in out["features"]:
        p, g = f["properties"], f["geometry"]
        if not g:
            continue
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        rings = [[round(v, 3) for pt in ring for v in pt] for poly in polys for ring in poly if len(ring) > 3]
        c = shape(g).representative_point()
        d = {"n": name(p), "s": (p["state"] or "").title(), "code": p["dist_code"],
             "c": [round(c.x, 3), round(c.y, 3)], "rings": rings}
        if not p["district"]:  # small disputed inter-state patches: kept as unlabelled land so the map has no holes
            d["note"] = p.get("remarks") or "unassigned area"
        districts.append(d)
    # edges: owners by state; one owner = national outline, two states = state line
    owners = defaultdict(set)
    for d in districts:
        for r in d["rings"]:
            pts = list(zip(r[0::2], r[1::2]))
            for e in zip(pts, pts[1:] + pts[:1]):
                if e[0] != e[1]:
                    owners[tuple(sorted(e))].add((d["s"], d["n"]))
    states, outline = [], []
    for (p0, p1), o in owners.items():
        if len(o) == 1:
            outline += [*p0, *p1]
        elif len({s for s, _ in o}) > 1:
            states += [*p0, *p1]
    Path(a.out).write_text("window.INDIA = " + json.dumps({"districts": districts, "states": states, "outline": outline},
                                                          separators=(",", ":")) + ";\n")
    print(a.out, len(districts), "districts,", len(states) // 4, "state-line segments,", len(outline) // 4, "outline segments,",
          round(Path(a.out).stat().st_size / 1e6, 2), "MB")


if __name__ == "__main__":
    main()

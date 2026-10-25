#!/usr/bin/env python3
"""Build public/datakadai/geo/india.json: 36 state/UT paths (Lambert conic, 1000 px wide) + the national outline.

Source: DataMeet India state boundaries (CC BY 4.0), which follow the Government of India's claimed boundary
(all of J&K and Ladakh incl. Gilgit-Baltistan and Aksai Chin, all of Arunachal). Never swap in another map without
running this script: it refuses to write if any check point falls outside India. Needs node (npx mapshaper).
Usage: build_geo.py
"""
import json, math, pathlib, subprocess, sys, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "sources" / "geo"; SRC.mkdir(parents=True, exist_ok=True)
OUT = ROOT / "public" / "datakadai" / "geo"; OUT.mkdir(parents=True, exist_ok=True)
RAW = "https://raw.githubusercontent.com/datameet/maps/master"
FILES = {f"Admin2.{e}": f"{RAW}/States/Admin2.{e}" for e in ("shp", "dbf", "shx", "prj")}
FILES["india-composite.geojson"] = f"{RAW}/Country/india-composite.geojson"
MAPSHAPER = "mapshaper@0.6.121"
SIMPLIFY = "1.2%"
W = 1000

# short ids used in every Data Kadai data file
IDS = {"Andaman & Nicobar": "AN", "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR", "Assam": "AS", "Bihar": "BR",
       "Chandigarh": "CH", "Chhattisgarh": "CG", "Dadra and Nagar Haveli and Daman and Diu": "DH", "Delhi": "DL",
       "Goa": "GA", "Gujarat": "GJ", "Haryana": "HR", "Himachal Pradesh": "HP", "Jammu & Kashmir": "JK",
       "Jharkhand": "JH", "Karnataka": "KA", "Kerala": "KL", "Ladakh": "LA", "Lakshadweep": "LD",
       "Madhya Pradesh": "MP", "Maharashtra": "MH", "Manipur": "MN", "Meghalaya": "ML", "Mizoram": "MZ",
       "Nagaland": "NL", "Odisha": "OD", "Puducherry": "PY", "Punjab": "PB", "Rajasthan": "RJ", "Sikkim": "SK",
       "Tamil Nadu": "TN", "Telangana": "TS", "Tripura": "TR", "Uttar Pradesh": "UP", "Uttarakhand": "UK",
       "West Bengal": "WB"}
SHORT = {"DH": "DNH & DD", "AN": "A&N Islands"}

# (name, lon, lat, state id it must fall in): the places a non-official map usually gets wrong
CHECKS = [("Gilgit", 74.31, 35.92, "LA"), ("Muzaffarabad", 73.47, 34.37, "JK"), ("Mirpur", 73.75, 33.15, "JK"),
          ("Aksai Chin", 79.40, 35.20, "LA"), ("Shaksgam", 76.70, 36.10, "LA"), ("Tawang", 91.86, 27.59, "AR"),
          ("Srinagar", 74.80, 34.08, "JK"), ("Leh", 77.58, 34.16, "LA"), ("Chennai", 80.27, 13.08, "TN")]
ISLANDS = {"AN": 20, "LD": 5}  # min parts left after simplifying, so the island UTs never vanish


def fetch():
    for name, url in FILES.items():
        p = SRC / name
        if not p.exists():
            print(" downloading", name); urllib.request.urlretrieve(url, p)


def simplify():
    states, outline = SRC / "states_wgs.json", SRC / "outline_wgs.json"
    # one command so the outline is dissolved from the same simplified arcs as the states (borders line up);
    # explode first so keep-shapes protects each island (Lakshadweep, Andamans), not just each state
    subprocess.run(["npx", "--yes", MAPSHAPER, "-i", str(SRC / "Admin2.shp"), "-explode", "-filter-islands",
                    "min-area=1km2", "-simplify", SIMPLIFY, "keep-shapes", "-dissolve", "ST_NM", "-clean",
                    "-o", str(states), "format=geojson", "precision=0.0001", "-dissolve",
                    "-o", str(outline), "format=geojson", "precision=0.0001"], check=True, cwd=SRC)
    return json.load(open(states)), json.load(open(outline))


def polys(geom):
    return [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]


def inside(lon, lat, geom):
    hit = False
    for poly in polys(geom):
        for ring in poly:  # even-odd over all rings handles holes
            for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
                if (y1 > lat) != (y2 > lat) and lon < x1 + (lat - y1) * (x2 - x1) / (y2 - y1):
                    hit = not hit
    return hit


# spherical Lambert conformal conic, the projection Survey of India uses for the national map
P1, P2, P0, L0 = (math.radians(v) for v in (12.472944, 35.172806, 24.0, 80.0))
N = math.log(math.cos(P1) / math.cos(P2)) / math.log(math.tan(math.pi / 4 + P2 / 2) / math.tan(math.pi / 4 + P1 / 2))
F = math.cos(P1) * math.tan(math.pi / 4 + P1 / 2) ** N / N
R0 = F / math.tan(math.pi / 4 + P0 / 2) ** N


def lcc(lon, lat):
    r = F / math.tan(math.pi / 4 + math.radians(lat) / 2) ** N
    t = N * (math.radians(lon) - L0)
    return r * math.sin(t), R0 - r * math.cos(t)


def main():
    fetch()
    states, outline = simplify()
    composite = json.load(open(SRC / "india-composite.geojson"))["features"][0]["geometry"]
    feats = {IDS[f["properties"]["ST_NM"]]: f for f in states["features"]}
    assert len(feats) == 36, f"expected 36 states/UTs, got {len(feats)}"
    bad = [n for n, lon, lat, sid in CHECKS if not (inside(lon, lat, feats[sid]["geometry"]) and inside(lon, lat, composite))]
    bad += [sid for sid, n in ISLANDS.items() if len(polys(feats[sid]["geometry"])) < n]
    if bad:
        sys.exit(f"REFUSING to write a non-official India map: outside expected state or outline -> {bad}")

    pts = [lcc(*p) for f in states["features"] for poly in polys(f["geometry"]) for ring in poly for p in ring]
    x0, x1 = min(p[0] for p in pts), max(p[0] for p in pts); y0, y1 = min(p[1] for p in pts), max(p[1] for p in pts)
    k = W / (x1 - x0); H = round((y1 - y0) * k)
    xy = lambda lon, lat: ((lcc(lon, lat)[0] - x0) * k, (y1 - lcc(lon, lat)[1]) * k)

    def path(geom):
        out = []
        for poly in polys(geom):
            for ring in poly:
                q = [xy(*p) for p in ring]
                out.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in q) + "Z")
        return "".join(out)

    def anchor(geom):  # area-weighted centroid of the largest polygon: where a label or pin goes
        best = (0, 0, 0)
        for poly in polys(geom):
            q = [xy(*p) for p in poly[0]]
            a = cx = cy = 0
            for (xa, ya), (xb, yb) in zip(q, q[1:] + q[:1]):
                c = xa * yb - xb * ya; a += c; cx += (xa + xb) * c; cy += (ya + yb) * c
            if abs(a) > abs(best[0]): best = (a, cx / (3 * a), cy / (3 * a))
        return round(best[1], 1), round(best[2], 1), round(abs(best[0]) / 2)

    out = {"w": W, "h": H, "projection": "Lambert conformal conic (12.47N, 35.17N; 24N, 80E)",
           "attribution": "Map: DataMeet India (CC BY 4.0), boundaries as per Government of India",
           "states": [], "outline": path(outline["geometries"][0])}  # attribute-less dissolve is a GeometryCollection
    for name, sid in sorted(IDS.items(), key=lambda kv: kv[1]):
        g = feats[sid]["geometry"]; cx, cy, area = anchor(g)
        out["states"].append({"id": sid, "name": name, "short": SHORT.get(sid, name), "d": path(g),
                              "cx": cx, "cy": cy, "area": area})
    p = OUT / "india.json"; json.dump(out, open(p, "w"), separators=(",", ":"))
    print(f"wrote {p.relative_to(ROOT)}: {W}x{H}, {p.stat().st_size // 1024} KB, checks passed: {len(CHECKS)}")


if __name__ == "__main__":
    main()

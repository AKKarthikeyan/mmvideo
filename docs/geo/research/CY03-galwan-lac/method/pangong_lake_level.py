#!/usr/bin/env python3
"""Lake-surface elevation of Natural Earth's 'Banggong Co' polygon: median SRTM 30 m elevation of 12 polygon vertices
(shoreline vertices read through OpenTopoData srtm30m). Method note: shoreline pixels can read a few metres off the water level."""
import json, statistics, urllib.request, time, sys
d = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "../sources/ne_lakes.src"))
f = [x for x in d["features"] if x["properties"].get("name") == "Banggong Co"][0]
g = f["geometry"]; c = g["coordinates"]
P = c[0] if g["type"] == "Polygon" else max((poly[0] for poly in c), key=len)
step = max(1, len(P)//12); S = P[::step][:12]
vals = []
for lon, lat in S:
    u = f"https://api.opentopodata.org/v1/srtm30m?locations={lat},{lon}"
    r = json.load(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "IndicaAtlasResearch/1.0"}), timeout=30))["results"][0]["elevation"]
    vals.append(r); print(round(lat, 4), round(lon, 4), r); time.sleep(1.1)
print("vertices", len(P), "sampled", len(vals), "median", statistics.median(vals), "min", min(vals), "max", max(vals))

#!/usr/bin/env python3
"""Which country polygon of Natural Earth 10m admin-0 (India point of view file used by this project) contains each point?
Ray casting, no libraries. Points: Galwan clash-site finding-aid point, Demchok (India-side village finding aid), Yangtse,
Leh (Natural Earth), Pangong Tso lake-polygon vertex centroid. Purpose: tell us what the house outline colours as India."""
import json, sys
d = json.load(open(sys.argv[1]))
def inring(x, y, ring):
    c = False
    for i in range(len(ring)):
        x1, y1 = ring[i]; x2, y2 = ring[(i+1) % len(ring)]
        if (y1 > y) != (y2 > y) and x < (x2-x1)*(y-y1)/(y2-y1)+x1: c = not c
    return c
def inpoly(x, y, g):
    polys = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
    for p in polys:
        if inring(x, y, p[0]) and not any(inring(x, y, h) for h in p[1:]): return True
    return False
P = {"Galwan clash-site (finding aid)": (78.2130416, 34.7692312), "Demchok (India-side village, finding aid)": (79.4467432, 32.7040811),
     "Yangtse, Tawang (finding aid)": (92.0240021, 27.7698150), "Leh (Natural Earth)": (77.572291, 34.161559),
     "Pangong Tso (NE lake polygon vertex near 78.62E 33.85N)": (78.6183, 33.8461)}
for k, (x, y) in P.items():
    hit = [f["properties"].get("NAME") or f["properties"].get("ADMIN") for f in d["features"] if inpoly(x, y, f["geometry"])]
    print(f"{k}: {hit}")

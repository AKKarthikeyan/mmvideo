"""Distances from My Son to India, computed from Natural Earth 1:10m admin-0 (India point of view).
My Son point = UNESCO World Heritage Centre page, whc.unesco.org/en/list/949/ (opened 2026-11-01): N15 46 25.835  E108 6 33.008.
Method: haversine (R=6371.0088 km) from that point to every vertex of every outer ring of the named country's polygons;
minimum reported with the coordinates of the nearest vertex. Natural Earth 10m coast vertices are dense (tens to hundreds of metres),
so the vertex minimum is within about 1 km of the true polygon distance; figures are rounded to the nearest 10 km in any claim.
India parts: a polygon is 'Andaman and Nicobar Islands' if its bounding box lies within lon 92-94.5, lat 6-14.5; otherwise 'mainland'
(the mainland polygon is the biggest).
Usage: python3 -I distances.py <ne_10m_admin_0_countries_ind.geojson>"""
import json, math, sys
R = 6371.0088
def dms(d, m, s): return d + m / 60 + s / 3600
LAT, LON = dms(15, 46, 25.835), dms(108, 6, 33.008)
def hav(la1, lo1, la2, lo2):
    p1, p2 = math.radians(la1), math.radians(la2)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lo2 - lo1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))
gj = json.load(open(sys.argv[1]))
print(f"My Son point: {LAT:.5f}N {LON:.5f}E")
def polys(f):
    g = f["geometry"]; return g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
def best(ring):
    return min(((hav(LAT, LON, y, x), x, y) for x, y in ring))
for f in gj["features"]:
    name = f["properties"].get("ADMIN")
    if name not in ("India", "Vietnam"): continue
    print(f"== {name} (NAME={f['properties'].get('NAME')}, polygons={len(polys(f))})")
    res = {}
    for p in polys(f):
        ring = p[0]; xs = [c[0] for c in ring]; ys = [c[1] for c in ring]
        if name == "India":
            part = "Andaman and Nicobar" if (92 <= min(xs) and max(xs) <= 94.5 and 6 <= min(ys) and max(ys) <= 14.5) else "mainland+other"
        else:
            part = "all"
        d = best(ring)
        if part not in res or d < res[part]: res[part] = d
        # report the biggest rings anyway
    for part, (d, x, y) in res.items():
        print(f"  nearest {name} {part}: {d:.0f} km (vertex {y:.3f}N {x:.3f}E)")

# Nearest point of India's mainland east coast: vertices of the largest India polygon inside the window lon 79-88E, lat 8-22N
# (Coromandel / Andhra / Odisha coast; excludes Arunachal and the islands). Window is a crude coast filter, so also print the
# nearest vertex's coordinates for a human check.
ind = [f for f in gj["features"] if f["properties"].get("ADMIN") == "India"][0]
big = max(polys(ind), key=lambda p: len(p[0]))[0]
win = [(x, y) for x, y in big if 79 <= x <= 88 and 8 <= y <= 22]
d, x, y = best(win)
print(f"== India mainland east-coast window (lon 79-88, lat 8-22): {len(win)} vertices; nearest {d:.0f} km (vertex {y:.3f}N {x:.3f}E)")
# Chennai-ish check: distance to the vertex of that window nearest 13.08N (Chennai latitude is NOT a source; just a latitude slice)
for lat0 in (10.0, 13.0, 16.0, 20.0):
    s = [(x, y) for x, y in win if abs(y - lat0) < 0.15]
    if s:
        dd = min((hav(LAT, LON, y, x), x, y) for x, y in s)
        print(f"   coast vertex near {lat0}N: {dd[0]:.0f} km (vertex {dd[2]:.3f}N {dd[1]:.3f}E)")

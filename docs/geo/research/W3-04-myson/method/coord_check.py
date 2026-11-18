"""Is the nomination cover-sheet coordinate (15 31 N, 108 34 E) on land? Point-in-polygon test against Natural Earth 10m admin-0 (India view),
and distance from that point to the UNESCO page coordinate (N15 46 25.835, E108 6 33.008) and to the nearest Vietnam coast vertex.
Usage: python3 -I coord_check.py <ne_10m_admin_0_countries_ind.geojson>"""
import json, math, sys
gj = json.load(open(sys.argv[1]))
R = 6371.0088
def hav(la1, lo1, la2, lo2):
    p1, p2 = math.radians(la1), math.radians(la2)
    a = math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(math.radians(lo2 - lo1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))
def inside(pt, ring):
    x, y = pt; c = False
    for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
    return c
cover = (108 + 34 / 60, 15 + 31 / 60)
unesco = (108 + 6 / 60 + 33.008 / 3600, 15 + 46 / 60 + 25.835 / 3600)
print(f"cover sheet point {cover[1]:.4f}N {cover[0]:.4f}E; UNESCO page point {unesco[1]:.4f}N {unesco[0]:.4f}E")
print(f"distance between the two points: {hav(cover[1], cover[0], unesco[1], unesco[0]):.0f} km")
for name, pt in (("cover sheet", cover), ("UNESCO page", unesco)):
    on_land = []
    for f in gj["features"]:
        g = f["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for p in polys:
            if inside(pt, p[0]) and not any(inside(pt, h) for h in p[1:]): on_land.append(f["properties"].get("ADMIN"))
    d = min(hav(pt[1], pt[0], y, x) for f in gj["features"] if f["properties"].get("ADMIN") == "Vietnam"
            for p in (f["geometry"]["coordinates"] if f["geometry"]["type"] == "MultiPolygon" else [f["geometry"]["coordinates"]]) for x, y in p[0])
    print(f"{name}: inside a country polygon: {on_land or 'NO (sea)'}; nearest Vietnam outline vertex {d:.0f} km")

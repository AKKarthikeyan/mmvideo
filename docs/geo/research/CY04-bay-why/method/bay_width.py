"""Width of the Bay of Bengal along parallels, from Natural Earth 1:10m admin-0 (India point of view).
For each latitude, sample longitudes 78-100E every 0.005 deg, mark land if inside any country polygon,
take the widest continuous sea run that contains 88E (the bay's axis), report its west and east coast longitudes
and the great-circle distance between them (haversine, R=6371.0088 km).
Coast labels in the output say only the country (admin-0). Checked separately against Natural Earth admin-1
(ne_10m_admin_1_states_provinces.geojson), a point just inland of each crossing: 16N west = Andhra Pradesh, east = Ayeyarwady (Myanmar);
21.5N west (87.101E) = Odisha, east (91.861E) = Chittagong division (Bangladesh); 21N west (86.882E) = Odisha.
Usage: python3 -I bay_width.py <ne_10m_admin_0_countries_ind.geojson>"""
import json, math, sys
gj = json.load(open(sys.argv[1]))
rings = []
for f in gj["features"]:
    g = f["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    for p in polys:
        for ring in p[:1]:  # outer rings only (no lakes matter at sea)
            xs = [c[0] for c in ring]; ys = [c[1] for c in ring]
            if max(xs) < 75 or min(xs) > 102 or max(ys) < 5 or min(ys) > 25: continue
            rings.append((min(ys), max(ys), ring, f["properties"].get("ADMIN") or f["properties"].get("NAME")))
def crossings(lat):
    xs = []
    for y0, y1, ring, name in rings:
        if not (y0 <= lat <= y1): continue
        for (xa, ya), (xb, yb) in zip(ring, ring[1:]):
            if (ya > lat) != (yb > lat):
                xs.append((xa + (lat - ya) * (xb - xa) / (yb - ya), name))
    return sorted(xs)
def hav(lat, lon1, lon2):
    R = 6371.0088; p = math.radians(lat); d = math.radians(lon2 - lon1)
    a = math.cos(p) ** 2 * math.sin(d / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))
for lat in [12.0, 14.0, 16.0, 18.0, 20.0, 21.0, 21.5, 22.0]:
    xs = crossings(lat)
    west = max([x for x in xs if x[0] < 88.0], default=None)
    east = min([x for x in xs if x[0] > 88.0], default=None)
    if west and east:
        print(f"lat {lat:5.1f}N: west coast {west[0]:.3f}E ({west[1]}), east coast {east[0]:.3f}E ({east[1]}), width {hav(lat, west[0], east[0]):.0f} km")
    else:
        print(f"lat {lat}N: no closed crossing (west={west}, east={east})")

# Build map data + imagery for the Siliguri Short -> public/geo/siliguri/{geo.json, region.jpg, world.jpg}
# Borders: Natural Earth 10m, India point of view (ne_10m_admin_0_countries_ind). Imagery: NASA Blue Marble NG (Dec 2004).
import json, math
from pathlib import Path
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "sources" / "geo"
OUT = ROOT / "public" / "geo" / "siliguri"
HI = (84.0, 94.0, 23.0, 30.5)       # region.jpg box, 240 ppd
WIDE = (66.0, 106.0, 6.0, 40.0)    # wide.jpg box, 80 ppd

def clip_ring(ring, box):
    x0, y0, x1, y1 = box
    return any(x0 <= x <= x1 and y0 <= y <= y1 for x, y in ring)

def simplify(ring, tol):
    out = [ring[0]]
    for p in ring[1:]:
        if abs(p[0] - out[-1][0]) + abs(p[1] - out[-1][1]) >= tol: out.append(p)
    return [[round(x, 4), round(y, 4)] for x, y in out]

def polys(geom):
    return geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]

def take(feat, box, tol):
    rings = []
    for poly in polys(feat["geometry"]):
        if clip_ring(poly[0], box): rings.append(simplify(poly[0], tol))
    return rings

wide = (60, 0, 110, 45)
countries = {}
for f in json.load(open(SRC / "ne_10m_admin_0_countries_ind.geojson"))["features"]:
    iso = f["properties"]["ADM0_A3"]
    if iso in ("IND", "NPL", "BTN", "BGD", "CHN", "MMR", "PAK", "LKA"):
        countries[iso] = take(f, wide, 0.01)
# coarse India outline for the globe
india_globe = [simplify(r, 0.08) for r in countries["IND"]]

NE = ["Assam", "Arunachal Pradesh", "Meghalaya", "Nagaland", "Manipur", "Mizoram", "Tripura", "Sikkim"]
states = {}
for f in json.load(open(SRC / "ne_10m_admin_1_states_provinces.geojson"))["features"]:
    p = f["properties"]
    if p.get("adm0_a3") == "IND" and p.get("name") in NE + ["West Bengal"]:
        states[p["name"]] = take(f, wide, 0.01)
missing = [n for n in NE + ["West Bengal"] if n not in states]
assert not missing, missing

# Narrowest Nepal-Bangladesh gap (the corridor's width), brute force on border vertices near Siliguri
def pts(rings, box):
    return [p for r in rings for p in r if box[0] <= p[0] <= box[2] and box[1] <= p[1] <= box[3]]
box = (87.8, 25.8, 88.9, 27.0)
full = {}
for f in json.load(open(SRC / "ne_10m_admin_0_countries_ind.geojson"))["features"]:
    if f["properties"]["ADM0_A3"] in ("NPL", "BGD"):
        full[f["properties"]["ADM0_A3"]] = [r for poly in polys(f["geometry"]) for r in poly]
npl, bgd = pts(full["NPL"], box), pts(full["BGD"], box)
def km(a, b):
    la = math.radians((a[1] + b[1]) / 2)
    return math.hypot((a[0] - b[0]) * 111.32 * math.cos(la), (a[1] - b[1]) * 110.57)
best = min(((km(a, b), a, b) for a in npl for b in bgd), key=lambda t: t[0])
print(f"narrowest Nepal-Bangladesh gap in Natural Earth data: {best[0]:.1f} km  {best[1]} -> {best[2]}")

places = {   # lon, lat
    "Siliguri": [88.43, 26.71], "Guwahati": [91.75, 26.14], "Kolkata": [88.36, 22.57],
    "Delhi": [77.21, 28.61], "Doklam": [88.93, 27.29], "Yadong": [88.91, 27.48],
}
json.dump({"box": list(HI), "wide": list(WIDE), "countries": countries, "indiaGlobe": india_globe,
           "states": states, "ne": NE, "gap": {"km": round(best[0], 1), "a": best[1], "b": best[2]}, "places": places},
          open(OUT / "geo.json", "w"))

# Imagery: 21600x21600 tiles cover 90 degrees at 240 ppd. C1 = 0..90E, D1 = 90..180E, both 90N..0.
c1 = Image.open(SRC / "world.topo.bathy.200412.3x21600x21600.C1.jpg")
d1 = Image.open(SRC / "world.topo.bathy.200412.3x21600x21600.D1.jpg")
def crop(l0, l1, b0, b1, ppd, name):
    y0, y1 = int((90 - b1) * 240), int((90 - b0) * 240)
    left = c1.crop((int(l0 * 240), y0, int(min(l1, 90) * 240), y1))
    img = Image.new("RGB", (int((l1 - l0) * 240), y1 - y0)); img.paste(left, (0, 0))
    if l1 > 90: img.paste(d1.crop((0, y0, int((l1 - 90) * 240), y1)), (left.width, 0))
    img = img.resize((int((l1 - l0) * ppd), int((b1 - b0) * ppd)), Image.LANCZOS)
    img.save(OUT / name, quality=90); print(name, img.size)
crop(*HI, 240, "region.jpg")      # sharp close-ups around the corridor
crop(*WIDE, 80, "wide.jpg")       # zoomed-out scenes + globe hand-off
Image.open(SRC / "world.topo.bathy.200412.3x5400x2700.jpg").save(OUT / "world.jpg", quality=90)

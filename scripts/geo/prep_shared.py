# Shared GeoTales assets -> public/geo/_shared/{asia.jpg, world.jpg, geo.json} and per-video close-ups public/geo/<id>/hi.jpg
# Imagery: NASA Blue Marble NG (Dec 2004) 21600x21600 tiles, 240 px/deg: C1 0-90E/N, D1 90-180E/N, C2 0-90E/S, D2 90-180E/S.
# Borders: Natural Earth 10m, India point of view.
import json
from pathlib import Path
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[2]
SRC, PUB = ROOT / "sources" / "geo", ROOT / "public" / "geo"
ASIA = (40.0, 150.0, -25.0, 75.0)          # lon0, lon1, lat0, lat1
ASIA_PPD = 40
HI = {                                      # per-video close-up boxes at 160 px/deg
    "chenab": (73.5, 76.5, 32.0, 35.0), "brahmaputra": (92.5, 97.0, 27.5, 31.0), "andaman": (91.5, 95.0, 5.5, 15.0),
    "himalaya": (85.5, 88.5, 26.5, 29.0), "malacca": (98.5, 105.0, -0.5, 5.5), "chinatime": (70.5, 77.5, 36.0, 40.5),
    "enclaves": (88.3, 90.0, 25.7, 26.7), "islamabad": (72.5, 73.5, 33.3, 34.0), "indiatime": (81.8, 83.2, 24.6, 25.6),
}
HI_PPD = 160
TILES = {"C1": (0, 90, 0, 90), "D1": (90, 180, 0, 90), "C2": (0, 90, -90, 0), "D2": (90, 180, -90, 0)}

def blank(box, ppd):
    return Image.new("RGB", (round((box[1] - box[0]) * ppd), round((box[3] - box[2]) * ppd)))

outs = {"asia": (ASIA, ASIA_PPD, blank(ASIA, ASIA_PPD))}
for k, b in HI.items(): outs[k] = (b, HI_PPD, blank(b, HI_PPD))
for t, (tl0, tl1, tb0, tb1) in TILES.items():
    need = [k for k, (b, _, _) in outs.items() if b[0] < tl1 and b[1] > tl0 and b[2] < tb1 and b[3] > tb0]
    if not need: continue
    tile = Image.open(SRC / f"world.topo.bathy.200412.3x21600x21600.{t}.jpg"); tile.load()
    for k in need:
        b, ppd, img = outs[k]
        l0, l1, b0, b1 = max(b[0], tl0), min(b[1], tl1), max(b[2], tb0), min(b[3], tb1)
        piece = tile.crop((round((l0 - tl0) * 240), round((tb1 - b1) * 240), round((l1 - tl0) * 240), round((tb1 - b0) * 240)))
        piece = piece.resize((round((l1 - l0) * ppd), round((b1 - b0) * ppd)), Image.LANCZOS)
        img.paste(piece, (round((l0 - b[0]) * ppd), round((b[3] - b1) * ppd)))
    del tile; print("tile", t, "->", need, flush=True)
(PUB / "_shared").mkdir(parents=True, exist_ok=True)
outs["asia"][2].save(PUB / "_shared" / "asia.jpg", quality=88)
for k in HI:
    (PUB / k).mkdir(parents=True, exist_ok=True); outs[k][2].save(PUB / k / "hi.jpg", quality=90)
Image.open(SRC / "world.topo.bathy.200412.3x5400x2700.jpg").save(PUB / "_shared" / "world.jpg", quality=90)

# ---- vectors ----
def polys(g): return g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
def simp(r, tol):
    o = [r[0]]
    for p in r[1:]:
        if abs(p[0] - o[-1][0]) + abs(p[1] - o[-1][1]) >= tol: o.append(p)
    return [[round(x, 3), round(y, 3)] for x, y in o]
def inbox(r, b): return any(b[0] <= x <= b[1] and b[2] <= y <= b[3] for x, y in r)
countries, names = {}, {}
for f in json.load(open(SRC / "ne_10m_admin_0_countries_ind.geojson"))["features"]:
    p = f["properties"]; iso = p["ADM0_A3"]
    rings = [simp(poly[0], 0.02) for poly in polys(f["geometry"]) if inbox(poly[0], ASIA) and len(poly[0]) > 8]
    rings = [r for r in rings if len(r) > 3]
    if rings: countries[iso] = rings; names[iso] = p["NAME_EN"]
states = {}
for f in json.load(open(SRC / "ne_10m_admin_1_states_provinces.geojson"))["features"]:
    p = f["properties"]
    if p.get("adm0_a3") == "IND":
        states[p["name"]] = [simp(poly[0], 0.015) for poly in polys(f["geometry"]) if len(poly[0]) > 8]
rivers = {}
for f in json.load(open(SRC / "ne_10m_rivers_lake_centerlines.geojson"))["features"]:
    n = f["properties"].get("name")
    if n in ("Brahmaputra", "Yarlung", "Ganges", "Chenab", "Indus"):
        g = f["geometry"]; lines = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
        rivers.setdefault(n, []).extend([[[round(x, 3), round(y, 3)] for x, y in l] for l in lines])
json.dump({"asia": list(ASIA), "hi": {k: list(v) for k, v in HI.items()}, "countries": countries, "names": names,
           "states": states, "rivers": rivers}, open(PUB / "_shared" / "geo.json", "w"), separators=(",", ":"))
print("geo.json", (PUB / "_shared" / "geo.json").stat().st_size // 1024, "KB;", len(countries), "countries,", len(states), "states,",
      {k: len(v) for k, v in rivers.items()}, "river segments")

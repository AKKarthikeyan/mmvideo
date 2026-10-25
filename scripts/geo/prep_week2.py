# Week 2 map assets (25 Oct 2026). Extends the shared satellite map west from 40°E to 0°E (Austria, Egypt's Red Sea coast,
# Zanzibar) and adds Week 2 close-ups. Week 1's files are backed up to public/geo/_shared/wk1/ first.
# The D2 tile (90-180E, south) and the 5400 px world image are no longer in sources/geo, so the old asia.jpg is pasted in
# first and only the new western strip comes from tiles C1/C2.
#   python3 scripts/geo/prep_week2.py
import json, shutil
from pathlib import Path
from PIL import Image
Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parents[2]
SRC, PUB = ROOT / "sources" / "geo", ROOT / "public" / "geo"
SH = PUB / "_shared"
OLD_ASIA = (40.0, 150.0, -25.0, 75.0)
ASIA = (0.0, 150.0, -25.0, 75.0)            # lon0, lon1, lat0, lat1
PPD = 40
HI_PPD = 160
HI2 = {                                     # Week 2 close-up boxes (lon0, lon1, lat0, lat1)
    "minicoy": (71.5, 77.0, 6.5, 12.5), "austria": (92.4, 94.2, 6.5, 9.5), "kuttanad": (75.9, 77.0, 8.9, 10.2),
    "thumba": (76.4, 77.4, 8.1, 9.0), "zanzibar": (38.6, 40.0, -7.0, -5.3), "barmer": (70.0, 73.0, 24.5, 27.0),
    "berenike": (32.0, 37.0, 22.5, 27.0), "panipat": (75.4, 78.6, 27.6, 30.6), "bhitarkanika": (86.3, 87.3, 20.3, 21.0),
    "thibaw": (72.9, 73.8, 16.6, 17.3), "narcondam": (92.5, 94.8, 12.4, 14.4), "sikhpolice": (113.8, 122.2, 21.9, 31.6),
}
TILES = {"C1": (0, 90, 0, 90), "D1": (90, 180, 0, 90), "C2": (0, 90, -90, 0), "D2": (90, 180, -90, 0)}

bk = SH / "wk1"; bk.mkdir(exist_ok=True)
for f in ("asia.jpg", "geo.json"):
    if not (bk / f).exists(): shutil.copy2(SH / f, bk / f)
old_geo = json.load(open(bk / "geo.json"))

def blank(box, ppd): return Image.new("RGB", (round((box[1] - box[0]) * ppd), round((box[3] - box[2]) * ppd)))
asia = blank(ASIA, PPD)
asia.paste(Image.open(bk / "asia.jpg"), (round((OLD_ASIA[0] - ASIA[0]) * PPD), 0))
west = (ASIA[0], OLD_ASIA[0], ASIA[2], ASIA[3])           # only the new strip comes from tiles
outs = {"asia": (west, PPD, asia, ASIA)}
for k, b in HI2.items(): outs[k] = (b, HI_PPD, blank(b, HI_PPD), b)
for t, (tl0, tl1, tb0, tb1) in TILES.items():
    need = [k for k, (b, _, _, _) in outs.items() if b[0] < tl1 and b[1] > tl0 and b[2] < tb1 and b[3] > tb0]
    if not need: continue
    p = SRC / f"world.topo.bathy.200412.3x21600x21600.{t}.jpg"
    if not p.exists(): print("missing tile", t, "for", need); continue
    tile = Image.open(p); tile.load()
    for k in need:
        b, ppd, img, frame = outs[k]
        l0, l1, b0, b1 = max(b[0], tl0), min(b[1], tl1), max(b[2], tb0), min(b[3], tb1)
        piece = tile.crop((round((l0 - tl0) * 240), round((tb1 - b1) * 240), round((l1 - tl0) * 240), round((tb1 - b0) * 240)))
        piece = piece.resize((round((l1 - l0) * ppd), round((b1 - b0) * ppd)), Image.LANCZOS)
        img.paste(piece, (round((l0 - frame[0]) * ppd), round((frame[3] - b1) * ppd)))
    del tile; print("tile", t, "->", need, flush=True)
asia.save(SH / "asia.jpg", quality=86)
for k in HI2:
    (PUB / k).mkdir(parents=True, exist_ok=True); outs[k][2].save(PUB / k / "hi.jpg", quality=90)

# ---- vectors (same method as prep_shared.py, wider box, plus the Nile) ----
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
rivers = dict(old_geo["rivers"])
for f in json.load(open(SRC / "ne_10m_rivers_lake_centerlines.geojson"))["features"]:
    if f["properties"].get("name") == "Nile":
        g = f["geometry"]; lines = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
        rivers.setdefault("Nile", []).extend([[[round(x, 3), round(y, 3)] for x, y in l] for l in lines])
hi = dict(old_geo["hi"]); hi.update({k: list(v) for k, v in HI2.items()})
json.dump({"asia": list(ASIA), "hi": hi, "countries": countries, "names": names, "states": old_geo["states"], "rivers": rivers},
          open(SH / "geo.json", "w"), separators=(",", ":"))
print("asia.jpg", asia.size, "| geo.json", (SH / "geo.json").stat().st_size // 1024, "KB;", len(countries), "countries; Nile segments:", len(rivers.get("Nile", [])))

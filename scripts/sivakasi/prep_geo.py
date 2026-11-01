"""Simplified geodata for the Sivakasi films. Sources: Natural Earth (public domain): countries with the India point of view
(ne_10m_admin_0_countries_ind), admin-1 (Tamil Nadu), populated places. Sivakasi is NOT in Natural Earth: its pin is APPROXIMATE
(artistic, 9.45N 77.80E, to be replaced by a Census/Bhuvan point, claim C032)."""
import json, math, zlib, struct, random
S = "/Volumes/DarwinSSD/MMVideo/sources/geo/"
def rdp(pts, eps):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]; dx, dy = b[0]-a[0], b[1]-a[1]; L = math.hypot(dx, dy) or 1e-12
    best, idx = 0, 0
    for i in range(1, len(pts)-1):
        d = abs(dy*(pts[i][0]-a[0]) - dx*(pts[i][1]-a[1])) / L
        if d > best: best, idx = d, i
    if best <= eps: return [a, b]
    return rdp(pts[:idx+1], eps)[:-1] + rdp(pts[idx:], eps)
def rings(geom, eps, minarea=0.0):
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    out = []
    for p in polys:
        r = p[0]
        area = abs(sum(r[i][0]*r[i+1][1]-r[i+1][0]*r[i][1] for i in range(len(r)-1)))/2
        if area < minarea: continue
        m = len(r)//2
        s = rdp(r[:m+1], eps)[:-1] + rdp(r[m:], eps)
        if len(s) >= 4: out.append([[round(x, 3), round(y, 3)] for x, y in s])
    return out
countries = json.load(open(S+"ne_10m_admin_0_countries_ind.geojson"))["features"]
world, india = [], []
for f in countries:
    nm = f["properties"].get("NAME") or f["properties"].get("ADMIN")
    if nm == "India": india = rings(f["geometry"], 0.02, 0.01)
    world.append({"n": nm, "r": rings(f["geometry"], 0.25 if nm != "India" else 0.25, 0.3)})
st = json.load(open(S+"ne_10m_admin_1_states_provinces.geojson"))["features"]
tn = [rings(f["geometry"], 0.01, 0.0) for f in st if f["properties"].get("name") == "Tamil Nadu" and f["properties"].get("admin") == "India"]
pp = {f["properties"]["name"]: f["geometry"]["coordinates"] for f in json.load(open(S+"ne_10m_populated_places_simple.geojson"))["features"]}
want = ["Kolkata", "Mumbai", "Chennai", "Madurai", "New Delhi", "Kochi", "Tuticorin", "Coimbatore"]
places = {k: pp[k] for k in want if k in pp}
places["Sivakasi (approx)"] = [77.80, 9.45]
json.dump({"world": world, "india": india, "tn": tn[0] if tn else [], "places": places}, open("/Volumes/DarwinSSD/MMVideo/public/sivakasi/geo.json", "w"))
print("india rings", len(india), "pts", sum(len(r) for r in india), "tn", len(tn[0]) if tn else 0, "places", list(places))
# film grain tile (grayscale PNG 256x256)
random.seed(7); w = h = 256
raw = b"".join(b"\x00" + bytes(min(255, max(0, int(random.gauss(128, 38)))) for _ in range(w)) for _ in range(h))
def chunk(t, d): c = struct.pack(">I", len(d)) + t + d; return c + struct.pack(">I", zlib.crc32(t+d) & 0xffffffff)
open("/Volumes/DarwinSSD/MMVideo/public/sivakasi/grain.png", "wb").write(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 0, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))

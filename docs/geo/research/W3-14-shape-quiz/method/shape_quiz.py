# W3-14-shape-quiz method (8 Nov 2026). Run: python3 -I method/shape_quiz.py > method/shape_quiz_output.txt
# 1) Census 2011 A-01 (parsed with zipfile, no extra libraries) state areas (sources/census2011_A01.xlsx) -> ranks among the 28 states of 2011.
# 2) House outlines public/geo/_shared/geo.json "states" (Natural Earth, India view): keys, neighbours, distance to foreign land.
import json, math, os, sys
import zipfile, re, html
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEO = "/Volumes/DarwinSSD/MMVideo/public/geo/_shared/geo.json"
PICK = ["Madhya Pradesh", "Tamil Nadu", "Goa"]
UT = {"04","07","25","26","31","34","35"}  # Census 2011 UT codes: Chandigarh, Delhi, Daman&Diu, DNH, Lakshadweep, Puducherry, A&N
z = zipfile.ZipFile(os.path.join(HERE, "sources/census2011_A01.xlsx"))
ss = [html.unescape(re.sub('<[^>]+>', '', x)) for x in re.findall(r'<si>(.*?)</si>', z.read('xl/sharedStrings.xml').decode(), re.S)]
sh = z.read('xl/worksheets/sheet1.xml').decode()
def cells(x):
    out = {}
    for ref, t, v in re.findall(r'<c r="([A-Z]+)\d+"([^>]*)>(?:<f>.*?</f>)?<v>(.*?)</v>', x, re.S):
        out[ref] = ss[int(v)] if 't="s"' in t else v
    return out
rows = {}
for rn, x in re.findall(r'<row [^>]*r="(\d+)"[^>]*>(.*?)</row>', sh, re.S):
    c = cells(x)
    if c.get('B') == '000' and c.get('C') == '00000' and c.get('F') == 'Total' and c.get('D') == 'STATE':
        rows[c['A']] = dict(name=c['E'].replace('@', '').strip(), area=float(c['N']), pop=int(c['K']), row=int(rn))
print("== 1. Census 2011 A-01 state-level rows found:", len(rows))
states = {c: v for c, v in rows.items() if c not in UT}
print("states (non-UT):", len(states))
rank = sorted(states.values(), key=lambda v: -v["area"])
for i, v in enumerate(rank, 1):
    print(f"{i:2d} {v['name']:<28} {v['area']:>10,.0f} sq km  pop {v['pop']:>12,}")
a = {v["name"].upper(): v["area"] for v in states.values()}
mp, mh, goa, tn = a["MADHYA PRADESH"], a["MAHARASHTRA"], a["GOA"], a["TAMIL NADU"]
print(f"MP - Maharashtra = {mp-mh:,.0f} sq km ({(mp-mh)/mh*100:.2f}% of Maharashtra)")
print(f"MP / Goa = {mp/goa:.1f}; TN / Goa = {tn/goa:.1f}")
print(f"Goa / India (3,287,469 printed) = {goa/3287469*100:.3f}%")

print("\n== 2. House outlines (geo.json 'states')")
g = json.load(open(GEO)); S = g["states"]; C = g["countries"]
def pts(rings):
    out = []
    def walk(x):
        if isinstance(x[0], (int, float)): out.append((x[0], x[1]))
        else:
            for y in x: walk(y)
    walk(rings); return out
def km(p, q):
    la = math.radians((p[1]+q[1])/2)
    return math.hypot((p[0]-q[0])*111.32*math.cos(la), (p[1]-q[1])*110.57)
foreign = []
for k, v in C.items():
    if k == "IND": continue
    geom = v if isinstance(v, list) else v.get("rings") or v.get("coordinates") or v
    try: foreign += [p for p in pts(geom) if 60 < p[0] < 100 and 0 < p[1] < 40]
    except Exception: pass
print("foreign vertices in window:", len(foreign))
for k in PICK:
    print(f"\n{k!r} present: {k in S}")
    P = pts(S[k]); xs = [p[0] for p in P]; ys = [p[1] for p in P]
    print(f"  vertices {len(P)}, rings {len(S[k])}, bbox lon {min(xs)}..{max(xs)} lat {min(ys)}..{max(ys)}")
    Pset = set(P); nb = []
    for o, r in S.items():
        if o == k: continue
        Q = pts(r); 
        shared = sum(1 for q in Q if q in Pset)
        if shared == 0:
            near = min((km(p, q) for q in Q[::3] for p in P[::7]), default=999)
            if near < 2: shared = f"near({near:.1f} km)"
        if shared: nb.append((o, shared))
    print("  neighbours (shared vertices):", nb)
    d = min(km(p, q) for p in P[::2] for q in foreign) if foreign else None
    print(f"  nearest foreign-country vertex: {d:,.0f} km")
    if k == "Tamil Nadu":
        s = min(P, key=lambda p: p[1]); print("  southernmost vertex (lon, lat):", s)

print("\n== 3. Extras")
tnp, mpp = 72147030, 72626809
print(f"TN pop / MP pop (2011) = {tnp/mpp*100:.1f}%; TN area / MP area = {tn/mp*100:.1f}%; difference in people = {mpp-tnp:,}")
# which foreign country is nearest to Tamil Nadu, and what Natural Earth place sits at TN's southern tip
best = None
for k2, v in C.items():
    if k2 == "IND": continue
    try: Q = [q for q in pts(v) if 60 < q[0] < 100 and 0 < q[1] < 40]
    except Exception: continue
    for q in Q:
        for p in pts(S["Tamil Nadu"])[::2]:
            dd = km(p, q)
            if best is None or dd < best[0]: best = (dd, k2)
print(f"nearest foreign country to Tamil Nadu outline: {best[1]} at {best[0]:,.0f} km (sea, no shared vertex)")
pp = json.load(open("/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_populated_places_simple.geojson"))
tip = (77.511, 8.076)
for f in pp["features"]:
    pr = f["properties"]; x, y = f["geometry"]["coordinates"][:2]
    if pr.get("adm0_a3") == "IND" and km((x, y), tip) < 40:
        print(f"  NE place within 40 km of TN southern tip: {pr.get('name')} ({x:.3f},{y:.3f}) {km((x,y),tip):.1f} km, adm1={pr.get('adm1name')}")

print("\n== 4. Kanniyakumari district (Census 2011 A-01 sub-district rows 19826-19835) vs SRA 1956 s.4 taluks")
tal = {"Vilavancode": 395.03921100891483, "Kalkulam": 632.98431507182227, "Thovala": 377.7402728087352, "Agastheeswaram": 278.2350765246577}
s4 = sum(tal.values()); dist = 1683.99887541413
print(f"sum of 4 sub-district areas = {s4:,.2f} sq km; district row = {dist:,.2f}; share of Tamil Nadu = {dist/tn*100:.2f}%")
print(f"district population 1,870,374 = {1870374/tnp*100:.2f}% of Tamil Nadu")

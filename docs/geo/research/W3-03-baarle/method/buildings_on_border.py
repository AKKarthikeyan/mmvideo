"""Count BAG buildings (Kadaster, PDOK) whose footprint is cut by the Belgium/Netherlands boundary drawn in the Kadaster municipal polygon of Baarle-Nassau,
for the largest Belgian enclave (H1, the town centre, 165 ha). A building counts as CUT when an edge of its footprint properly crosses an edge of the boundary ring (no touching).
BAG holds Dutch buildings only; a building lying wholly on the Belgian side is not in this file, so this can only undercount.
Fetch: python3 -I buildings_on_border.py fetch   | Analyse: python3 -I buildings_on_border.py"""
import json, sys, urllib.request, urllib.parse, math
SRC = '../sources/pdok_gemeentegebied_baarle_nassau.json'
BAG = '../sources/pdok_bag_pand_bighole.json'
d = json.load(open(SRC))
main = max(d['features'][0]['geometry']['coordinates'], key=lambda p: len(p[0]))
def A(r): return abs(sum(r[i][0]*r[(i+1)%len(r)][1]-r[(i+1)%len(r)][0]*r[i][1] for i in range(len(r))))/2
hole = max(main[1:], key=A)
xs = [x for x, y in hole]; ys = [y for x, y in hole]
if len(sys.argv) > 1 and sys.argv[1] == 'fetch':
    bb = f'{min(xs)-30},{min(ys)-30},{max(xs)+30},{max(ys)+30}'
    feats = []
    u = 'https://api.pdok.nl/kadaster/bag/ogc/v2/collections/pand/items?' + urllib.parse.urlencode({'f': 'json', 'bbox': bb, 'bbox-crs': 'http://www.opengis.net/def/crs/EPSG/0/28992', 'crs': 'http://www.opengis.net/def/crs/EPSG/0/28992', 'limit': 1000})
    while u:
        j = json.loads(urllib.request.urlopen(u, timeout=120).read())
        feats += j['features']; print('got', len(j['features']), 'total', len(feats))
        u = next((l['href'] for l in j.get('links', []) if l.get('rel') == 'next'), None)
    json.dump({'features': feats, 'bbox': bb}, open(BAG, 'w'))
    sys.exit()
bag = json.load(open(BAG))['features']
def ccw(a, b, c): return (c[1]-a[1])*(b[0]-a[0]) - (b[1]-a[1])*(c[0]-a[0])
TOL = 0.3  # metres: both ends of the footprint edge must lie at least this far from the boundary line, so that edges that merely run along the boundary (clipped footprints, rounding) are not counted
def cross(p1, p2, q1, q2):
    d1, d2, d3, d4 = ccw(q1, q2, p1), ccw(q1, q2, p2), ccw(p1, p2, q1), ccw(p1, p2, q2)
    if not (d1*d2 < 0 and d3*d4 < 0): return False
    L = math.dist(q1, q2) or 1e-9
    return abs(d1)/L >= TOL and abs(d2)/L >= TOL
def rings(g):
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    return [r for p in polys for r in p]
edges = [(hole[i], hole[(i+1) % len(hole)]) for i in range(len(hole))]
cut = []
for f in bag:
    hit = False
    for r in rings(f['geometry']):
        xs_ = [p[0] for p in r]; ys_ = [p[1] for p in r]
        if max(xs_) < min(xs) or min(xs_) > max(xs) or max(ys_) < min(ys) or min(ys_) > max(ys): continue
        for i in range(len(r)-1):
            a, b = r[i], r[i+1]
            if any(cross(a, b, e1, e2) for e1, e2 in edges): hit = True; break
        if hit: break
    if hit: cut.append(f)
print('BAG buildings in box:', len(bag))
print('buildings whose footprint is properly crossed by the H1 boundary ring:', len(cut))
for f in cut:
    p = f['properties']; print(' ', p['identificatie'], p.get('gebruiksdoel'), p.get('bouwjaar'), p.get('status'))

# ---- summary (added after first run) ----
use = [f for f in cut if f['properties'].get('status') == 'Pand in gebruik']
withfn = [f for f in use if (f['properties'].get('aantal_verblijfsobjecten') or 0) > 0]
def has(f, w): return w in (f['properties'].get('gebruiksdoel') or '')
print('--- summary ---')
print('crossed, status "Pand in gebruik" (in use):', len(use), '| demolished/other status:', len(cut)-len(use))
print('in use AND with at least one registered verblijfsobject (a unit with a use):', len(withfn))
for w in ['woonfunctie', 'winkelfunctie', 'bijeenkomstfunctie', 'logiesfunctie', 'industriefunctie', 'kantoorfunctie']:
    print(f'  with {w}:', sum(1 for f in withfn if has(f, w)))
print('in use AND bijeenkomstfunctie:', [(f['properties']['identificatie'], f['properties']['gebruiksdoel'], f['properties']['bouwjaar']) for f in use if has(f, 'bijeenkomstfunctie')])

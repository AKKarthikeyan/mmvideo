"""Count Belgian holes and Dutch pieces in the Baarle-Nassau municipality polygon (Kadaster / PDOK BRK Bestuurlijke Gebieden, gemeentegebied).
Run: python3 -I count_enclaves_pdok.py  (reads ../sources/pdok_gemeentegebied_baarle_nassau.json, RD New EPSG:28992, metres)"""
import json, math
d = json.load(open('../sources/pdok_gemeentegebied_baarle_nassau.json'))
print('features:', len(d['features']), 'numberMatched', d.get('numberMatched'))
def area(r):
    return abs(sum(r[i][0]*r[(i+1)%len(r)][1]-r[(i+1)%len(r)][0]*r[i][1] for i in range(len(r))))/2
def perim(r):
    return sum(math.dist(r[i], r[(i+1)%len(r)]) for i in range(len(r)))
for f in d['features']:
    p = f['properties']; g = f['geometry']
    print('props:', {k: p[k] for k in p if k in ('naam','code','identificatie','ligt_in_provincie_naam','begingeldigheid','eindegeldigheid')})
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    print('geometry type', g['type'], 'polygons (outer parts):', len(polys))
    tot_holes = 0; tot_outer = 0
    rows = []
    for k, poly in enumerate(polys):
        outer, holes = poly[0], poly[1:]
        rows.append((area(outer)/1e4, len(holes), len(outer), [area(h)/1e4 for h in holes], perim(outer)))
        tot_holes += len(holes)
    rows.sort(reverse=True)
    for i, (a, nh, nv, ha, per) in enumerate(rows):
        print(f'part {i}: outer area {a:,.2f} ha, vertices {nv}, outer perimeter {per/1000:.2f} km, holes {nh}')
        if nh: print('   holes (ha):', ', '.join(f'{x:,.2f}' for x in sorted(ha, reverse=True)))
    print('TOTAL outer parts:', len(polys), 'holes:', tot_holes)
    # parts that are inside a hole: small parts count = Dutch pieces other than the main body
    print('area of main body (ha): %.1f' % rows[0][0])
    print('sum of the other', len(rows)-1, 'parts (ha): %.2f' % sum(r[0] for r in rows[1:]))
    print('sum of all holes (ha): %.2f' % sum(sum(r[3]) for r in rows))

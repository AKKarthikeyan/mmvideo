"""Count the pieces of the Belgian municipality Baarle-Hertog in the Flemish government's reference municipal boundaries (Digitaal Vlaanderen, VRBG Refgem), Belgian Lambert 72 (EPSG:31370), metres.
python3 -I count_enclaves_flanders.py   (input ../sources/vrbg_refgem_baarle_hertog.json)"""
import json, math
d = json.load(open('../sources/vrbg_refgem_baarle_hertog.json'))
print('features:', len(d['features']))
def area(r): return abs(sum(r[i][0]*r[(i+1)%len(r)][1]-r[(i+1)%len(r)][0]*r[i][1] for i in range(len(r))))/2
def perim(r): return sum(math.dist(r[i], r[(i+1)%len(r)]) for i in range(len(r)))
for f in d['features']:
    print({k: v for k, v in f['properties'].items() if k in ('NAAM','NISCODE','GEMEENTE','NAAMGEM','UIDN','OIDN','TERRITD','PROVINCIE','LENGTE','OPPERVL')} or list(f['properties'].items())[:8])
    g = f['geometry']; polys = g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
    print('geometry', g['type'], 'parts:', len(polys), 'parts with holes:', sum(1 for p in polys if len(p) > 1))
    A = sorted([area(p[0])/1e4 for p in polys], reverse=True)
    print('areas ha:', ', '.join(f'{a:.2f}' for a in A))
    print('sum of part areas: %.2f ha' % sum(A))
    print('sum of outer perimeters: %.2f km' % (sum(perim(p[0]) for p in polys)/1000))
    print('sum of hole areas (Dutch inside Belgian parts): %.2f ha' % (sum(area(h) for p in polys for h in p[1:])/1e4))
    print('sum of hole perimeters: %.2f km' % (sum(perim(h) for p in polys for h in p[1:])/1000))

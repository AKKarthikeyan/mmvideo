"""Cross-check: the 22 Belgian holes in the Dutch (Kadaster) Baarle-Nassau polygon vs the 22 smallest Baarle-Hertog parts in the Flemish (VRBG Refgem) polygon.
Different agencies, different CRS (RD New vs Belgian Lambert 72). python3 -I compare_nl_be_areas.py"""
import json
def area(r): return abs(sum(r[i][0]*r[(i+1)%len(r)][1]-r[(i+1)%len(r)][0]*r[i][1] for i in range(len(r))))/2/1e4
nl = json.load(open('../sources/pdok_gemeentegebied_baarle_nassau.json'))['features'][0]['geometry']['coordinates']
main = max(nl, key=lambda p: len(p[0]))
holes = sorted((area(h) for h in main[1:]), reverse=True)
be = json.load(open('../sources/vrbg_refgem_baarle_hertog.json'))['features'][0]['geometry']['coordinates']
parts = sorted((area(p[0]) for p in be), reverse=True)
print('NL holes (ha):', len(holes)); print('BE parts (ha):', len(parts))
# match each NL hole to the closest-unused BE part
rest = parts[:]; maxdiff = 0; unmatched = []
for h in holes:
    j = min(range(len(rest)), key=lambda k: abs(rest[k]-h)); 
    d = abs(rest[j]-h); maxdiff = max(maxdiff, d); print(f'  NL hole {h:8.2f} ha  <->  BE part {rest[j]:8.2f} ha  diff {d:.2f}'); rest.pop(j)
print('BE parts not matched to any NL hole (ha):', [round(x, 2) for x in rest])
print('max area difference over the 22 matched pairs: %.2f ha' % maxdiff)
print('BE parts with holes:', sum(1 for p in be if len(p) > 1), '| total Dutch holes inside BE parts: %d' % sum(len(p)-1 for p in be))

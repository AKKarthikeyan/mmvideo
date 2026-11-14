"""Second pass: which Dutch piece sits inside which Belgian hole; border lengths. Same input as count_enclaves_pdok.py. python3 -I"""
import json, math
d = json.load(open('../sources/pdok_gemeentegebied_baarle_nassau.json'))
g = d['features'][0]['geometry']['coordinates']
def area(r): return abs(sum(r[i][0]*r[(i+1)%len(r)][1]-r[(i+1)%len(r)][0]*r[i][1] for i in range(len(r))))/2
def perim(r): return sum(math.dist(r[i], r[(i+1)%len(r)]) for i in range(len(r)))
def inside(pt, ring):
    x, y = pt; c = False
    for i in range(len(ring)):
        x1, y1 = ring[i]; x2, y2 = ring[(i+1) % len(ring)]
        if (y1 > y) != (y2 > y) and x < (x2-x1)*(y-y1)/(y2-y1)+x1: c = not c
    return c
main = max(g, key=lambda p: area(p[0]))
holes = sorted(main[1:], key=area, reverse=True)
parts = sorted([p[0] for p in g if p is not main], key=area, reverse=True)
print('Belgian holes:', len(holes), '| Dutch detached parts:', len(parts))
inh = 0
for i, r in enumerate(parts):
    pt = r[0]
    hit = [k for k, h in enumerate(holes) if inside(pt, h)]
    # is the part also outside the main outer ring?
    out = not inside(pt, main[0])
    print(f'Dutch part {i}: {area(r)/1e4:.2f} ha; inside hole #{hit[0]+1 if hit else None} ({(area(holes[hit[0]])/1e4 if hit else 0):.2f} ha); outside main body: {out}')
    inh += bool(hit)
print('Dutch parts inside a Belgian hole:', inh, '| not inside any hole:', len(parts)-inh)
L_holes = sum(perim(h) for h in holes)
L_sub = sum(perim(r) for r in parts)
print('sum of hole perimeters: %.2f km' % (L_holes/1000))
print('sum of detached Dutch part perimeters: %.2f km' % (L_sub/1000))
print('holes + 7 sub-enclaves inside holes: %.2f km' % ((L_holes + sum(perim(r) for r in parts if any(inside(r[0], h) for h in holes)))/1000))
print('vertices holes: %d ; vertices detached parts: %d' % (sum(len(h) for h in holes), sum(len(r) for r in parts)))

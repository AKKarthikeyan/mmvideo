"""W4-02 Ganga at Varanasi: bearing and length of the northward stretch (our measurement).
Data: Natural Earth 10m rivers_lake_centerlines (feature name 'Ganges'), populated_places_simple (Varanasi, Allahabad).
Run: python3 -I ganga_north.py > ganga_north_output.txt
"""
import json, math
G = '/Volumes/DarwinSSD/MMVideo/sources/geo/'
R = 6371.0088
def hav(a, b):
    lo1, la1, lo2, la2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
def brg(a, b):
    lo1, la1, lo2, la2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    x = math.sin(lo2-lo1)*math.cos(la2); y = math.cos(la1)*math.sin(la2)-math.sin(la1)*math.cos(la2)*math.cos(lo2-lo1)
    return (math.degrees(math.atan2(x, y)) + 360) % 360
riv = json.load(open(G+'ne_10m_rivers_lake_centerlines.geojson'))
parts = [f for f in riv['features'] if f['properties'].get('name') == 'Ganges']
print('Ganges features:', len(parts))
lines = []
for f in parts:
    g = f['geometry']; lines += [g['coordinates']] if g['type'] == 'LineString' else g['coordinates']
print('line parts:', len(lines), [len(l) for l in lines])
# the part that passes Varanasi
L = [l for l in lines if any(82.9 < c[0] < 83.1 and 25.2 < c[1] < 25.35 for c in l)][0]
print('part endpoints:', L[0], L[-1], '(first vertex west/upstream?)', L[0][0] < L[-1][0])
pl = {f['properties']['name']: f['geometry']['coordinates'] for f in json.load(open(G+'ne_10m_populated_places_simple.geojson'))['features'] if f['properties']['name'] in ('Varanasi', 'Allahabad', 'Patna')}
print('NE places:', pl)
# vertices around Varanasi, in file order (downstream)
win = [(i, c) for i, c in enumerate(L) if 82.80 < c[0] < 83.25 and 25.05 < c[1] < 25.55]
print('\nVertices near Varanasi (index, lon, lat, bearing to next, km to next):')
for i, c in win:
    n = L[i+1]; print(f'  {i:4d} {c[0]:.6f} {c[1]:.6f}  {brg(c, n):6.1f}  {hav(c, n):5.2f}')
# longest contiguous run with northward component (lat increasing) that includes the Varanasi city reach
vi = min(range(len(L)), key=lambda i: hav(L[i], pl['Varanasi']))
print('\nVertex nearest NE Varanasi point:', vi, L[vi], f'{hav(L[vi], pl["Varanasi"]):.2f} km away')
def run(i0):
    a = i0
    while a > 0 and L[a][1] > L[a-1][1]: a -= 1
    b = i0
    while b < len(L)-1 and L[b+1][1] > L[b][1]: b += 1
    return a, b
for label, i0 in [('run through Varanasi vertex', vi - 1 if L[vi][1] > L[vi-1][1] else vi)]:
    a, b = run(i0)
    seg = L[a:b+1]; ln = sum(hav(seg[k], seg[k+1]) for k in range(len(seg)-1))
    print(f'\n{label}: vertices {a}-{b}  start {seg[0]}  end {seg[-1]}')
    print(f'  river length along line: {ln:.1f} km; straight start-end: {hav(seg[0], seg[-1]):.1f} km; overall bearing {brg(seg[0], seg[-1]):.0f} deg; northward gain {(seg[-1][1]-seg[0][1])*111.2:.1f} km')
# strict north quadrant (bearing 315-45) runs near Varanasi
print('\nNorth-quadrant (bearing within 45 deg of north) runs in window:')
cur = []
for i, c in win[:-1]:
    b = brg(c, L[i+1])
    if b >= 315 or b <= 45: cur.append(i)
    elif cur:
        ln = sum(hav(L[k], L[k+1]) for k in cur); print(f'  vertices {cur[0]}-{cur[-1]+1}: {ln:.1f} km, from {L[cur[0]]} to {L[cur[-1]+1]}, bearing {brg(L[cur[0]], L[cur[-1]+1]):.0f}'); cur = []
# whole-river context: direction from first to last vertex of the part, and share of length flowing with a northward component
tot = sum(hav(L[k], L[k+1]) for k in range(len(L)-1))
nth = sum(hav(L[k], L[k+1]) for k in range(len(L)-1) if L[k+1][1] > L[k][1])
print(f'\nWhole NE Ganges part: {tot:.0f} km of line; overall bearing first->last vertex {brg(L[0], L[-1]):.0f} deg; length with any northward component {nth:.0f} km ({100*nth/tot:.0f}%)')
print(f'Allahabad->Varanasi straight: {hav(pl["Allahabad"], pl["Varanasi"]):.0f} km, bearing {brg(pl["Allahabad"], pl["Varanasi"]):.0f}')

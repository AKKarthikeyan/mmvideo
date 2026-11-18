"""W4-04 root bridges: our measurements from Ludwig et al. 2019 Table S1 (S01) and UNESCO TL 6606 (S02).
Run: python3 -I method/rootbridge_numbers.py <folder>"""
import sys, re, math, pathlib
d = pathlib.Path(sys.argv[1])
lines = [l.strip() for l in (d/'sources/ludwig2019_tableS1.txt').read_text().splitlines()]
# Table S1 is a flat list of cells: ID, name, lat, lon, alt, village, river, maint, length, comment, age
end = next(i for i,l in enumerate(lines) if l.startswith('Abbreviations for maintenance'))
cells = lines[:end]
rows = {}
i = 0
while i < len(cells):
    if re.fullmatch(r'\d{1,2}', cells[i]) and i+9 < len(cells) and re.fullmatch(r'-?|\d+\.\d+', cells[i+2]) is not None and cells[i+1] and not re.fullmatch(r'[\d.,]+', cells[i+1]):
        bid = int(cells[i]); r = cells[i:i+11]
        rows.setdefault(bid, []).append(r); i += 11
    else:
        i += 1
ids = sorted(rows)
print('bridge IDs in Table S1:', len(ids), 'range', ids[0], '-', ids[-1])
lengths = []
for bid in ids:
    for r in rows[bid]:
        try: lengths.append((float(r[8]), bid, r[1]))
        except ValueError: pass
print('measured lengths:', len(lengths))
print('longest:', max(lengths)); print('shortest:', min(lengths))
print('lengths < 20 m:', sum(1 for l in lengths if l[0] < 20))
geo = [(bid, float(rows[bid][0][2]), float(rows[bid][0][3])) for bid in ids if re.fullmatch(r'\d+\.\d+', rows[bid][0][2] or '')]
print('geolocated bridges:', len(geo))
s = rows[50][0]; print('Siej #50 row:', s)
print('Siej start year if 66 y counted from 2017 or 2018 (S1 footnote: ages refer to 2017/2018):', 2017-66, 'to', 2018-66)
def hav(a, b):
    R = 6371.0088
    p1, p2 = math.radians(a[0]), math.radians(b[0]); dl = math.radians(b[1]-a[1]); dp = p2-p1
    return 2*R*math.asin(math.sqrt(math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2))
lat = [g[1] for g in geo]; lon = [g[2] for g in geo]
print('S1 extent lat %.4f-%.4f lon %.4f-%.4f' % (min(lat), max(lat), min(lon), max(lon)))
print('S1 west-east span km (at mean lat): %.1f' % hav((sum(lat)/len(lat), min(lon)), (sum(lat)/len(lat), max(lon))))
print('S1 south-north span km: %.1f' % hav((min(lat), 91.8), (max(lat), 91.8)))
# UNESCO village table
v = []
for l in (d/'sources/unesco_tl_6606_note.txt').read_text().splitlines():
    m = re.match(r"(\d+)\|(.+)\|25°(\d+)' N, (\d+)°(\d+)' E", l)
    if m: v.append((int(m[1]), m[2], 25+int(m[3])/60, int(m[4])+int(m[5])/60))
print('UNESCO village rows:', len(v))
vl = [x[2] for x in v]; vo = [x[3] for x in v]
print('UNESCO extent lat %.3f-%.3f lon %.3f-%.3f' % (min(vl), max(vl), min(vo), max(vo)))
print('UNESCO west-east span km: %.1f' % hav((sum(vl)/len(vl), min(vo)), (sum(vl)/len(vl), max(vo))))
print('UNESCO south-north span km: %.1f' % hav((min(vl), 91.8), (max(vl), 91.8)))
nongriat = (float(rows[6][0][2]), float(rows[6][0][3])); longb = (float(rows[37][0][2]), float(rows[37][0][3]))
print('Nongriat double-decker #6', nongriat, '-> Rangthylliang 12 #37 (52.7 m)', longb, 'km %.1f' % hav(nongriat, longb))
print('52.7 m / 7 m typical (Ummonoi, Fig 1): %.1f x' % (52.7/7))

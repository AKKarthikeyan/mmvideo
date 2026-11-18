"""W4-03-numerals: our measurements (python3 -I). Pins from Natural Earth ne_10m_populated_places_simple
(/Volumes/DarwinSSD/MMVideo/sources/geo/). Great-circle distance, haversine, R = 6371.0088 km (IUGG mean radius)."""
import json, math
NE = '/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_populated_places_simple.geojson'
want = {('Peshawar','Pakistan'),('Béjaïa','Algeria'),('Pisa','Italy'),('Oxford','United Kingdom'),('Cambridge','United Kingdom'),('Baghdad','Iraq')}
pins = {}
for f in json.load(open(NE))['features']:
    p = f['properties']
    if (p.get('name'), p.get('adm0name')) in want:
        pins[p['name']] = (p['latitude'], p['longitude'])
def hav(a, b, R=6371.0088):
    (la1, lo1), (la2, lo2) = [tuple(map(math.radians, x)) for x in (a, b)]
    h = math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
print('== Pins (lat, lon), Natural Earth ne_10m_populated_places_simple')
for k, v in sorted(pins.items()): print(f'{k:10s} {v[0]:.4f}, {v[1]:.4f}')
print('\n== Great-circle legs (km)')
legs = [('Peshawar','Béjaïa'),('Béjaïa','Pisa'),('Peshawar','Pisa'),('Peshawar','Baghdad'),('Baghdad','Béjaïa'),('Peshawar','Oxford'),('Pisa','Oxford')]
for a, b in legs: print(f'{a} -> {b}: {hav(pins[a], pins[b]):,.0f}')
via = hav(pins['Peshawar'], pins['Béjaïa']) + hav(pins['Béjaïa'], pins['Pisa'])
print(f'Peshawar -> Béjaïa -> Pisa (two legs): {via:,.0f}')
print('\n== Time gaps (years), dates as printed in the sources')
# S01: Bakhshali 'as early as the 3rd or 4th century'; Gwalior inscription '9th-century'; S01: 'approximately five centuries older'
# S02: Liber abaci incipit 'M cc ij' = 1202
for start, label in ((201, 'start of 3rd century'), (400, 'end of 4th century')):
    print(f'Bakhshali earliest leaves ({label}, {start}) -> Liber abaci 1202: {1202-start} years')
print('Brahmagupta 628 (S01) -> Liber abaci 1202:', 1202-628, 'years')
print('\n== Symbol count in Liber abaci ch.1: nine Indian figures + the sign 0 =', 9+1)

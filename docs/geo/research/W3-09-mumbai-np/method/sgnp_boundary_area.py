"""Area and extent of Sanjay Gandhi National Park from the 12 official boundary points A-L.
Source: Gazette of India, Extraordinary, S.O. 229(E), 22 Jan 2016 (draft ESZ notification), Annexure,
'Location of Various Points on the Boundary of Sanjay Gandhi National Park, Borivali' (sources/moef_so229e_draft.txt).
Method: points joined in the listed order A..L (a closed ring), projected with a local equirectangular
projection (x = R*dlon*cos(lat0), y = R*dlat, R = 6371.0088 km), polygon area by the shoelace formula.
Distances: haversine, R = 6371.0088 km. NOTE: straight lines between 12 points only approximate the real boundary,
so the area is an estimate to compare with the official figures, not a replacement."""
import json, math
R = 6371.0088
def dms(d, m, s): return d + m/60 + s/3600
P = {
 'A': (dms(19,20,26.91), dms(72,54,27.07)), 'B': (dms(19,19,49.81), dms(72,55,44.18)),
 'C': (dms(19,17,6.50),  dms(72,55,53.31)), 'D': (dms(19,15,32.08), dms(72,58,11.00)),
 'E': (dms(19,12,20.36), dms(72,56,59.00)), 'F': (dms(19,10,1.07),  dms(72,55,49.04)),
 'G': (dms(19,8,34.24),  dms(72,53,37.85)), 'H': (dms(19,10,53.22), dms(72,52,24.63)),
 'I': (dms(19,14,17.20), dms(72,52,27.43)), 'J': (dms(19,15,56.40), dms(72,52,52.39)),
 'K': (dms(19,17,11.84), dms(72,53,25.24)), 'L': (dms(19,17,27.11), dms(72,54,40.80)),
}
lat0 = sum(p[0] for p in P.values())/len(P)
def xy(p):
    return (math.radians(p[1])*R*math.cos(math.radians(lat0)), math.radians(p[0])*R)
pts = [xy(P[k]) for k in 'ABCDEFGHIJKL']
a = 0
for i in range(len(pts)):
    x1,y1 = pts[i]; x2,y2 = pts[(i+1)%len(pts)]
    a += x1*y2 - x2*y1
area = abs(a)/2
def hav(p,q):
    f1,l1 = map(math.radians,p); f2,l2 = map(math.radians,q)
    h = math.sin((f2-f1)/2)**2 + math.cos(f1)*math.cos(f2)*math.sin((l2-l1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
lats=[p[0] for p in P.values()]; lons=[p[1] for p in P.values()]
ns = hav((min(lats),P['A'][1]),(max(lats),P['A'][1]))
ew = hav((P['A'][0],min(lons)),(P['A'][0],max(lons)))
# Natural Earth populated places: Mumbai point and distance from southern boundary point G
d = json.load(open('/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_populated_places_simple.geojson'))
mum = [f for f in d['features'] if f['properties']['name'] in ('Mumbai','Bombay') or f['properties'].get('nameascii')=='Mumbai']
out = {'lat0': round(lat0,4), 'polygon_area_km2': round(area,2), 'ns_extent_km': round(ns,1), 'ew_extent_km': round(ew,1),
       'ref_official_areas_km2': {'administered 103.84 (SGNP site)': 103.84, 'ESZ-minutes administrative 103.68': 103.68, 'notified (WII, ESZ minutes) 86.96': 86.96}}
for f in mum:
    lon,lat = f['geometry']['coordinates']
    out['NE_Mumbai_point'] = {'lat': lat, 'lon': lon, 'name': f['properties']['name'], 'pop_max': f['properties'].get('pop_max')}
    out['km_from_NE_Mumbai_point_to_boundary_point_G_south'] = round(hav((lat,lon), P['G']),1)
    out['km_from_NE_Mumbai_point_to_boundary_point_A_north'] = round(hav((lat,lon), P['A']),1)
print(json.dumps(out, indent=1))

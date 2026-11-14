# Our own NE-geometry area (authalic sphere) for the five pairs, so a map overlay at equal scale is honest. India-view admin-0 for countries; admin-1 for states.
import json, math
R=6371007.181
def ring_area(r):
    s=0.0
    for (x1,y1),(x2,y2) in zip(r,r[1:]):
        dl=math.radians(x2-x1)
        if dl>math.pi: dl-=2*math.pi
        if dl<-math.pi: dl+=2*math.pi
        s+=dl*(2+math.sin(math.radians(y1))+math.sin(math.radians(y2)))
    return abs(s)*R*R/2
def poly_area(rings): return ring_area(rings[0])-sum(ring_area(h) for h in rings[1:])
def geom_area(g): return poly_area(g['coordinates']) if g['type']=='Polygon' else sum(poly_area(p) for p in g['coordinates'])
S='/Volumes/DarwinSSD/MMVideo/sources/geo/'
c=json.load(open(S+'ne_10m_admin_0_countries_ind.geojson')); s=json.load(open(S+'ne_10m_admin_1_states_provinces.geojson'))
cm={}
for f in c['features']:
    p=f['properties']; cm[p.get('ADM0_A3') or p.get('adm0_a3')]=(p.get('ADMIN') or p.get('admin'),geom_area(f['geometry'])/1e6)
sm={f['properties'].get('iso_3166_2'):(f['properties'].get('name'),geom_area(f['geometry'])/1e6) for f in s['features'] if str(f['properties'].get('iso_3166_2','')).startswith('IN-')}
pairs=[('IN-UP','NGA'),('IN-MH','JPN'),('IN-BR','MEX'),('IN-RJ','DEU'),('IN-KA','GBR'),('IN-WB','VNM'),('IN-KL','MYS')]
for a,b in pairs:
    if a in sm: print(f"{sm[a][0]:16s} {sm[a][1]:10,.0f} km2 | {cm[b][0]:16s} {cm[b][1]:10,.0f} km2 | country/state = {cm[b][1]/sm[a][1]:.2f}")
    else: print(a,'missing in admin-1; have',[k for k in sm][:40])

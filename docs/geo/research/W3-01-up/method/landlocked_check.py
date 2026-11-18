# Is Uttar Pradesh landlocked? Distance from UP to the nearest point of India's sea coast, from Natural Earth geometry.
# Coast vertices = vertices of India's admin-0 outline (IND point of view) that are not within 0.03 deg of any other country's vertex
# (those are land borders). Distance = min haversine over UP admin-1 vertices x coast vertices.
import json, math
S='/Volumes/DarwinSSD/MMVideo/sources/geo/'
c=json.load(open(S+'ne_10m_admin_0_countries_ind.geojson'))
def rings(g):
    P=[g['coordinates']] if g['type']=='Polygon' else g['coordinates']
    for p in P:
        for r in p: yield r
ind=None; other=set()
for f in c['features']:
    p=f['properties']; a3=p.get('ADM0_A3') or p.get('adm0_a3')
    pts=[pt for r in rings(f['geometry']) for pt in r]
    if a3=='IND': ind=pts
    else:
        for x,y in pts: other.add((round(x/0.03),round(y/0.03)))
def near_border(pt):
    kx,ky=round(pt[0]/0.03),round(pt[1]/0.03)
    return any((kx+i,ky+j) in other for i in(-1,0,1) for j in(-1,0,1))
coast=[pt for pt in ind if not near_border(pt)]
s=json.load(open(S+'ne_10m_admin_1_states_provinces.geojson'))
up=[f for f in s['features'] if f['properties'].get('iso_3166_2')=='IN-UP'][0]
upp=[pt for r in rings(up['geometry']) for pt in r]
def hav(a,b):
    R=6371.0088; p1,p2=math.radians(a[1]),math.radians(b[1]); dl=math.radians(b[0]-a[0]); dp=p2-p1
    h=math.sin(dp/2)**2+math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(h))
best=min(((hav(a,b),a,b) for a in upp for b in coast),key=lambda t:t[0])
print("India outline vertices:",len(ind),"coast vertices:",len(coast),"UP vertices:",len(upp))
print("min distance UP vertex -> India sea-coast vertex: %.0f km"%best[0], best[1], best[2])
bb=(min(p[0] for p in upp),min(p[1] for p in upp),max(p[0] for p in upp),max(p[1] for p in upp))
print("UP bbox lon/lat:",bb)

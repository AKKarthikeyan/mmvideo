# Our own area: Natural Earth 1:10m geometry, spherical-excess-free formula on the authalic sphere
# (area of a polygon on a sphere via sum (lon2-lon1)*(2+sin lat1+sin lat2) * R^2 / 2), holes subtracted.
# Countries: ne_10m_admin_0_countries_ind (India point of view, house rule). UP: ne_10m_admin_1_states_provinces (name 'Uttar Pradesh').
import json, math, csv
R=6371007.181  # authalic radius of WGS84, metres
def ring_area(r):
    s=0.0
    for (x1,y1),(x2,y2) in zip(r,r[1:]):
        dl=math.radians(x2-x1)
        if dl>math.pi: dl-=2*math.pi
        if dl<-math.pi: dl+=2*math.pi
        s+=dl*(2+math.sin(math.radians(y1))+math.sin(math.radians(y2)))
    return abs(s)*R*R/2
def poly_area(rings): return ring_area(rings[0])-sum(ring_area(h) for h in rings[1:])
def geom_area(g):
    if g['type']=='Polygon': return poly_area(g['coordinates'])
    return sum(poly_area(p) for p in g['coordinates'])
S='/Volumes/DarwinSSD/MMVideo/sources/geo/'
c=json.load(open(S+'ne_10m_admin_0_countries_ind.geojson'))
out=[]
for f in c['features']:
    p=f['properties']; out.append((p.get('ADMIN') or p.get('admin'),p.get('ADM0_A3') or p.get('adm0_a3'),geom_area(f['geometry'])/1e6))
s=json.load(open(S+'ne_10m_admin_1_states_provinces.geojson'))
up=[f for f in s['features'] if f['properties'].get('iso_3166_2')=='IN-UP'][0]
up_a=geom_area(up['geometry'])/1e6
ind=[o for o in out if o[1]=='IND'][0]
print(f"NE UP area = {up_a:,.0f} km2 ; NE India area = {ind[2]:,.0f} km2 ; UP share = {up_a/ind[2]*100:.2f}%")
big=sorted(out,key=lambda o:-o[2])
n_bigger=sum(1 for o in out if o[2]>up_a)
print(f"countries/areas in NE file larger than UP: {n_bigger}; of {len(out)}")
print("neighbours by NE area:")
for i,o in enumerate(big):
    if abs(o[2]-up_a)/up_a<0.12: print(f"  rank {i+1}: {o[0]} {o[2]:,.0f}")
json.dump({'up_km2':up_a,'countries':[(a,b,c_) for a,b,c_ in out]},open('area_ne_output.json','w'))

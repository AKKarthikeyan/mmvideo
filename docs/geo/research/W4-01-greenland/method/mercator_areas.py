# W4-01 Greenland vs India: true area vs apparent area on a (Web) Mercator map. Our measurement.
# Inputs: official areas from UN DYB 2023 Table 3 (S01); geometry from Natural Earth 1:10m admin-0, India view (S03).
# True area: authalic sphere (same function as W3-13 area_ne_pairs.py). Apparent area: shoelace on Mercator x/y, rescaled to
# km2 "as if read with the equator's scale", i.e. what a viewer comparing the two shapes on the map sees.
import json, math
R=6371007.181
OFF={'Greenland':2166086,'India':3287263}  # S01, km2
def ring_area(r):
    s=0.0
    for (x1,y1),(x2,y2) in zip(r,r[1:]):
        dl=math.radians(x2-x1)
        if dl>math.pi: dl-=2*math.pi
        if dl<-math.pi: dl+=2*math.pi
        s+=dl*(2+math.sin(math.radians(y1))+math.sin(math.radians(y2)))
    return abs(s)*R*R/2
def merc(x,y):
    y=max(min(y,85.05112878),-85.05112878)
    return R*math.radians(x), R*math.log(math.tan(math.pi/4+math.radians(y)/2))
def ring_merc(r):
    p=[merc(x,y) for x,y in r]; return abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(p,p[1:])))/2
def area(g,f):
    polys=[g['coordinates']] if g['type']=='Polygon' else g['coordinates']
    return sum(f(p[0])-sum(f(h) for h in p[1:]) for p in polys)
c=json.load(open('/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_admin_0_countries_ind.geojson'))
G={f['properties']['ADMIN']:f for f in c['features'] if f['properties']['ADMIN'] in OFF}
res={}
for n,f in G.items():
    g=f['geometry']; pts=[pt for poly in ([g['coordinates']] if g['type']=='Polygon' else g['coordinates']) for ring in poly for pt in ring]
    lat=[p[1] for p in pts]; lon=[p[0] for p in pts]
    t=area(g,ring_area)/1e6; m=area(g,ring_merc)/1e6
    res[n]=dict(true_ne=t,merc=m,inflation=m/t,lat_min=min(lat),lat_max=max(lat),lon_min=min(lon),lon_max=max(lon),
               label=(f['properties']['LABEL_X'],f['properties']['LABEL_Y']))
    print(f"{n:10s} official {OFF[n]:>10,} km2 | NE true {t:>10,.0f} km2 ({t/OFF[n]-1:+.1%} vs official) | Mercator apparent {m:>12,.0f} km2 | inflation x{m/t:.2f}")
    print(f"           extent lat {min(lat):.2f}..{max(lat):.2f}  lon {min(lon):.2f}..{max(lon):.2f}  NE label point {res[n]['label']}")
g,i=res['Greenland'],res['India']
print()
print(f"Official: India / Greenland = {OFF['India']/OFF['Greenland']:.3f}; Greenland / India = {OFF['Greenland']/OFF['India']:.3f}; difference = {OFF['India']-OFF['Greenland']:,} km2")
print(f"NE true:  India / Greenland = {i['true_ne']/g['true_ne']:.3f}")
print(f"Mercator map: Greenland looks {g['merc']/i['merc']:.2f} x India's size (apparent area ratio)")
print(f"Mercator inflates Greenland {g['inflation']/i['inflation']:.2f} x more than it inflates India")
for lat in (8,22.7,37,60,66.6,70,74.3,80,83.6):
    k=1/math.cos(math.radians(lat)); print(f"  lat {lat:5.1f}: linear scale x{k:.2f}, area scale x{k*k:.2f}")

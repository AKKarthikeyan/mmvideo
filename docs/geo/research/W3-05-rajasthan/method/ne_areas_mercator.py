"""Areas from Natural Earth polygons (our own computation) and how big each looks on a Mercator map.
Data: sources/geo/ne_10m_admin_0_countries_ind.geojson (India point of view), ne_10m_admin_1_states_provinces.geojson (Rajasthan).
Area: WGS84 ellipsoid, Lambert cylindrical equal-area + shoelace (exact for the polygon as drawn).
Mercator: spherical Mercator (EPSG:3857 style), shoelace on projected coordinates, expressed as multiples of true area.
Run: python3 -I ne_areas_mercator.py"""
import json, math
G='/Volumes/DarwinSSD/MMVideo/sources/geo/'
a=6378137.0; e2=0.00669437999014; e=math.sqrt(e2)
def q(phi):
    s=math.sin(phi)
    return (1-e2)*(s/(1-e2*s*s)-(1/(2*e))*math.log((1-e*s)/(1+e*s)))
qp=q(math.pi/2)
Re=a*math.sqrt(qp/2)  # authalic radius not needed; use cylindrical eq-area: x=a*lam, y=a*q/2
def ring_area(r,proj):
    pts=[proj(x,y) for x,y in r]
    s=0
    for i in range(len(pts)-1):
        s+=pts[i][0]*pts[i+1][1]-pts[i+1][0]*pts[i][1]
    return s/2
def ea(lon,lat): return (a*math.radians(lon), a*q(math.radians(lat))/2)
def mer(lon,lat): return (a*math.radians(lon), a*math.log(math.tan(math.pi/4+math.radians(lat)/2)))
def poly_area(poly,proj):
    return abs(ring_area(poly[0],proj))-sum(abs(ring_area(h,proj)) for h in poly[1:])
def parts(g):
    return g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
def measure(g,filt=lambda p:True):
    t=m=0; lats=[]
    for p in parts(g):
        if not filt(p): continue
        t+=poly_area(p,ea); m+=poly_area(p,mer)
        la=[y for x,y in p[0]]; lats+= [min(la),max(la)]
    return t/1e6, m/1e6, (min(lats),max(lats))   # km2 true, km2 'as drawn' on Mercator (scaled units^2/1e6)
res=[]
a0=json.load(open(G+'ne_10m_admin_0_countries_ind.geojson'))
a1=json.load(open(G+'ne_10m_admin_1_states_provinces.geojson'))
raj=[f for f in a1['features'] if f['properties']['name']=='Rajasthan'][0]['geometry']
t,m,lr=measure(raj); res.append(('Rajasthan (NE admin-1)',t,m,lr))
byname={f['properties']['NAME']:f['geometry'] for f in a0['features']}
def mainland(p): return p[0][0][1]<72 and max(y for x,y in p[0])<72
for n in ['Finland','Norway','Sweden','Germany','Poland','Italy','United Kingdom','Spain']:
    g=byname[n]
    if n=='Norway':
        t,m,lr=measure(g,lambda p:min(y for x,y in p[0])>55 and max(y for x,y in p[0])<72); res.append(('Norway mainland (parts 55-72N; Bouvet excluded)',t,m,lr))
        t,m,lr=measure(g,lambda p:max(y for x,y in p[0])>=72); res.append(('Norway Svalbard+Jan Mayen parts (>=72N or Jan Mayen)',t,m,lr))
    elif n=='Spain':
        t,m,lr=measure(g,lambda p:min(y for x,y in p[0])>35); res.append(('Spain (parts N of 35N: mainland+Balearics)',t,m,lr))
    else:
        t,m,lr=measure(g); res.append((n+' (NE admin-0)',t,m,lr))
rt,rm=res[0][1],res[0][2]
print('%-52s %12s %9s  %-14s %s'%('shape','true km2','vs Raj','lat range','area on Mercator map / true area  |  looks X times Rajasthan'))
for n,t,m,lr in res:
    print('%-52s %12.0f %8.2fx  %5.1f-%5.1fN    %6.2f  |  %6.2f'%(n,t,t/rt,lr[0],lr[1],m/t,(m/rm)))

# Same ratio with the statistical offices' true areas instead of polygon areas (as drawn = official area x local Mercator inflation m/t)
OFF={'Finland (NE admin-0)':338493,'Norway mainland (parts 55-72N; Bouvet excluded)':323805,'Sweden (NE admin-0)':438574,'Germany (NE admin-0)':357683,'Poland (NE admin-0)':312679,'Italy (NE admin-0)':302068}
print('\nUsing official areas (Rajasthan 342,239): true ratio and as-drawn ratio')
infl={n:m/t for n,t,m,lr in res}; rinf=infl['Rajasthan (NE admin-1)']
for n,o in OFF.items():
    print('%-52s true %.3fx  as drawn on Mercator %.2fx Rajasthan'%(n,o/342239,(o*infl[n])/(342239*rinf)))

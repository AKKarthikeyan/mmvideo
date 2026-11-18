# Lite (3-source) version of the pairs, 8 Nov 2026. Sources: S02 NCP Table 11 (1 July), S03 UN WPP 2024 Medium (1 July),
# S05 Natural Earth 1:10m (admin-0 India view for countries, admin-1 for states): our own area on an authalic sphere.
# One year (2026), one date (1 July), one area basis (Natural Earth geometry) for both sides of every pair.
import json, csv, math
ncp=json.load(open('ncp_table11_parsed.json'))
pop={}
with open('../../W3-01-up/sources/WPP2024_TotalPopulationBySex.csv',encoding='utf-8-sig') as f:
    for r in csv.DictReader(f):
        if r['Variant']=='Medium' and r['LocTypeName']=='Country/Area' and r['Time'] in ('2011','2026'): pop[(r['Location'],r['Time'])]=float(r['PopTotal'])
R=6371007.181
def ring(r):
    s=0.0
    for (x1,y1),(x2,y2) in zip(r,r[1:]):
        dl=math.radians(x2-x1)
        if dl>math.pi: dl-=2*math.pi
        if dl<-math.pi: dl+=2*math.pi
        s+=dl*(2+math.sin(math.radians(y1))+math.sin(math.radians(y2)))
    return abs(s)*R*R/2
def poly(p): return ring(p[0])-sum(ring(h) for h in p[1:])
def area(g): return (poly(g['coordinates']) if g['type']=='Polygon' else sum(poly(p) for p in g['coordinates']))/1e6
S='/Volumes/DarwinSSD/MMVideo/sources/geo/'
cm={}
for f in json.load(open(S+'ne_10m_admin_0_countries_ind.geojson'))['features']:
    p=f['properties']; cm[p.get('ADM0_A3') or p.get('adm0_a3')]=area(f['geometry'])
sm={f['properties'].get('iso_3166_2'):area(f['geometry']) for f in json.load(open(S+'ne_10m_admin_1_states_provinces.geojson'))['features'] if str(f['properties'].get('iso_3166_2','')).startswith('IN-')}
k=pop[('India','2026')]/ncp['2026']['INDIA']
print(f"UN India 2026 {pop[('India','2026')]:,.0f}k / NCP India 2026 {ncp['2026']['INDIA']:,.0f}k = {k:.4f}")
pairs=[('Maharashtra','IN-MH','Japan','JPN'),('Bihar','IN-BR','Mexico','MEX'),('Rajasthan','IN-RJ','Germany','DEU'),('Karnataka','IN-KA','United Kingdom','GBR'),('West Bengal','IN-WB','Viet Nam','VNM'),('Kerala','IN-KL','Malaysia','MYS'),('Jharkhand','IN-JH','Canada','CAN')]
for s,si,c,ci in pairs:
    a=ncp['2026'][s]; w=pop[(c,'2026')]; a11=ncp['2011'][s]; w11=pop[(c,'2011')]
    sa,ca=sm[si],cm[ci]
    print(f"{s:12s} vs {c:15s} | 2026 A {a:9,.0f}k vs {w:9,.0f}k {a/w-1:+.1%} | B {a*k:9,.0f}k {a*k/w-1:+.1%} | 1Jul2011 NCP {a11:9,.0f}k vs WPP {w11:9,.0f}k {a11/w11-1:+.1%} | NE area {sa:9,.0f} vs {ca:9,.0f} km2 ({ca/sa:.2f}x) | density 2026 {a*1000/sa:5,.0f} vs {w*1000/ca:4,.0f} /km2")
print('Bihar vs Maharashtra NCP 1 July:', {y:(ncp[y]['Bihar'],ncp[y]['Maharashtra']) for y in ('2011','2023','2026') if y in ncp})

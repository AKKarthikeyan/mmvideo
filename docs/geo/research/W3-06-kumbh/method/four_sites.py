"""Positions of the four Kumbh cities from Natural Earth 10m populated places (simple), states from NE admin-1,
great-circle (haversine, R=6371.0088 km) distances, and the nearest NE river centreline name to each city.
Run: python3 -I four_sites.py   (reads ../sources/ne_*.geojson)"""
import json, math, os
HERE=os.path.dirname(os.path.abspath(__file__)); S="/Volumes/DarwinSSD/MMVideo/sources/geo"  # house copies of Natural Earth 10m (India point of view for admin-0); not re-copied here (40 MB)
pp=json.load(open(os.path.join(S,"ne_10m_populated_places_simple.geojson")))
names={"Haridwar":["Haridwar","Hardwar"],"Allahabad":["Allahabad","Prayagraj"],"Ujjain":["Ujjain"],"Nashik":["Nashik","Nasik"]}
pts={}
for f in pp["features"]:
    p=f["properties"]; n=p.get("name") or ""
    for k,al in names.items():
        if n in al or (p.get("nameascii") in al) :
            if p.get("adm0name")=="India" or p.get("adm0_a3")=="IND":
                pts[k]=(f["geometry"]["coordinates"][0],f["geometry"]["coordinates"][1],n,p.get("adm1name"),p.get("pop_max"))
# Haridwar is not in Natural Earth populated places (checked 10m full and simple). Use the district's own published point
# (haridwar.nic.in/about-district: "latitude and longitude are 29.58 degree north and 78.13 degree east") - a DISTRICT point, not Har-ki-Pauri.
pts["Haridwar"]=(78.13,29.58,"Haridwar (district point, haridwar.nic.in)","Uttarakhand",None)
out=["Natural Earth 10m populated places (simple) points: name, lon, lat, adm1name, pop_max"]
for k in names: out.append(f"  {k}: {pts.get(k)}")

def hav(a,b):
    R=6371.0088; la1,lo1,la2,lo2=map(math.radians,(a[1],a[0],b[1],b[0]))
    h=math.sin((la2-la1)/2)**2+math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2
    return 2*R*math.asin(math.sqrt(h))
ks=list(names)
out.append("\nGreat-circle distances between city points (km, haversine R=6371.0088)")
for i in range(4):
    for j in range(i+1,4):
        out.append(f"  {ks[i]}-{ks[j]}: {hav(pts[ks[i]],pts[ks[j]]):.0f}")
# point in polygon for states
st=json.load(open(os.path.join(S,"ne_10m_admin_1_states_provinces.geojson")))
def inring(x,y,ring):
    c=False; n=len(ring)
    for i in range(n):
        x1,y1=ring[i][:2]; x2,y2=ring[(i+1)%n][:2]
        if (y1>y)!=(y2>y) and x<(x2-x1)*(y-y1)/(y2-y1)+x1: c=not c
    return c
def inpoly(x,y,g):
    polys=[g["coordinates"]] if g["type"]=="Polygon" else g["coordinates"]
    return any(inring(x,y,p[0]) and not any(inring(x,y,h) for h in p[1:]) for p in polys)
out.append("\nNE admin-1 state containing each city point")
for k in ks:
    x,y=pts[k][:2]
    if k=="Haridwar":
        out.append("  Haridwar: not tested (district point lies on the generalised NE UP/Uttarakhand line; state taken from UNESCO file section D: Uttarakhand)"); continue
    r=[f["properties"].get("name") for f in st["features"] if f["properties"].get("admin")=="India" and f["geometry"] and inpoly(x,y,f["geometry"])]
    out.append(f"  {k}: {r}")
# nearest river centreline
rv=json.load(open(os.path.join(S,"ne_10m_rivers_lake_centerlines.geojson")))
def seg_dist(p,a,b):
    # planar approx in degrees scaled by cos(lat)
    k=math.cos(math.radians(p[1]))
    px,py=p[0]*k,p[1]; ax,ay=a[0]*k,a[1]; bx,by=b[0]*k,b[1]
    dx,dy=bx-ax,by-ay; L=dx*dx+dy*dy
    t=0 if L==0 else max(0,min(1,((px-ax)*dx+(py-ay)*dy)/L))
    return math.hypot(px-(ax+t*dx),py-(ay+t*dy))*111.19
out.append("\nNearest NE river centreline (name, km) to each city point")
for k in ks:
    best=[]
    for f in rv["features"]:
        g=f["geometry"]; lines=[g["coordinates"]] if g["type"]=="LineString" else g["coordinates"]
        ds=[seg_dist(pts[k][:2],l[i],l[i+1]) for l in lines for i in range(len(l)-1)]
        if not ds: continue
        d=min(ds)
        best.append((d,f["properties"].get("name"),f["properties"].get("name_en")))
    best.sort(); out.append(f"  {k}: "+"; ".join(f"{n or ne} {d:.0f} km" for d,n,ne in best[:3]))
open(os.path.join(HERE,"four_sites_output.txt"),"w").write("\n".join(out)+"\n"); print("\n".join(out))

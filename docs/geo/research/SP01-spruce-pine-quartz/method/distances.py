#!/usr/bin/env python3
"""Great-circle (haversine, mean Earth radius 6371.0088 km) and WGS84 geodesic (Vincenty) distances from Spruce Pine NC.
Coordinates and provenance:
 Spruce Pine  35.913964, -82.069702  US Census 2024 Gazetteer (place internal point) [C28]; GNIS not reachable (Cloudflare)
 Charleston SC 32.828017, -79.972896 US Census 2024 Gazetteer, city internal point [C28]  (proxy for the port)
 Wilmington NC 34.209225, -77.885767 US Census 2024 Gazetteer, city internal point [C28]  (proxy for the port)
 Hsinchu       24.816791, 120.976740 Natural Earth 10m populated places [C29]
 Dholera       22.213, 72.218        Wikipedia SIR coordinates (22d12m47s N 72d13m06s E) - NOT primary, finding aid only; flagged
 Ahmedabad     23.031999, 72.578058  Natural Earth [C29] (cross-check: Gujarat govt FAQ says Dholera ~100 km SW of Ahmedabad [C30])
"""
import math
P={"Spruce Pine NC":(35.913964,-82.069702),"Hsinchu (Taiwan)":(24.816791,120.976740),
"Dholera SIR (Gujarat)":(22.213,72.218),"Ahmedabad (check)":(23.031999,72.578058),
"Charleston SC (city centre, port proxy)":(32.828017,-79.972896),"Wilmington NC (city centre, port proxy)":(34.209225,-77.885767)}
def hav(a,b,R=6371.0088):
    p1,l1,p2,l2=map(math.radians,(*a,*b));d=p2-p1;dl=l2-l1
    h=math.sin(d/2)**2+math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(h))
def vincenty(a,b):
    A=6378137.0;f=1/298.257223563;B=A*(1-f)
    U1=math.atan((1-f)*math.tan(math.radians(a[0])));U2=math.atan((1-f)*math.tan(math.radians(b[0])))
    L=math.radians(b[1]-a[1]);lam=L
    for _ in range(200):
        sS=math.hypot(math.cos(U2)*math.sin(lam),math.cos(U1)*math.sin(U2)-math.sin(U1)*math.cos(U2)*math.cos(lam))
        cS=math.sin(U1)*math.sin(U2)+math.cos(U1)*math.cos(U2)*math.cos(lam);s=math.atan2(sS,cS)
        sa=math.cos(U1)*math.cos(U2)*math.sin(lam)/sS;c2a=1-sa**2
        c2m=cS-2*math.sin(U1)*math.sin(U2)/c2a if c2a else 0
        C=f/16*c2a*(4+f*(4-3*c2a));lp=lam
        lam=L+(1-C)*f*sa*(s+C*sS*(c2m+C*cS*(-1+2*c2m**2)))
        if abs(lam-lp)<1e-12:break
    u2=c2a*(A*A-B*B)/(B*B);k1=(math.sqrt(1+u2)-1)/(math.sqrt(1+u2)+1);k=k1*(1-0)  # k1
    Aa=(1+k1**2/4)/(1-k1);Bb=k1*(1-3*k1**2/8)
    ds=Bb*sS*(c2m+Bb/4*(cS*(-1+2*c2m**2)-Bb/6*c2m*(-3+4*sS**2)*(-3+4*c2m**2)))
    return B*Aa*(s-ds)/1000
o=P["Spruce Pine NC"]
for k,v in P.items():
    if k==list(P)[0]:continue
    print(f"{k:42s} haversine {hav(o,v):9.1f} km   geodesic(WGS84) {vincenty(o,v):9.1f} km")

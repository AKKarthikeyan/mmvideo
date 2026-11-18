#!/usr/bin/env python3
"""Tolerance scan for the Galwan-Shyok placement point (CY03 fix 2).
The position read off the Survey of India map is 34.76 N, 78.19 E with error +-0.05 degree (checker's SRTM grid puts the junction near 78.16 E).
For a 3 x 3 grid at +-0.05 degree and the two named candidates, print SRTM 30 m and ASTER 30 m elevation and the haversine distance from Leh."""
import json, math, time, urllib.request
LEH = (34.161559, 77.572291)
def hav(a, b):
    R = 6371.0088
    p1, p2 = math.radians(a[0]), math.radians(b[0]); dl = math.radians(b[1]-a[1]); dp = p2-p1
    h = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(h))
def elev(ds, lat, lon):
    u = f"https://api.opentopodata.org/v1/{ds}?locations={lat},{lon}"
    for _ in range(3):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "IndicaAtlasResearch/1.0"}), timeout=30))["results"][0]["elevation"]
        except Exception:
            time.sleep(3)
pts = [(34.76, 78.19), (34.76, 78.16)] + [(34.76+dy, 78.19+dx) for dy in (-0.05, 0, 0.05) for dx in (-0.05, 0, 0.05)]
ds, dd = [], []
for la, lo in pts:
    s, a, d = elev("srtm30m", la, lo), elev("aster30m", la, lo), hav(LEH, (la, lo))
    ds.append(d); print(f"{la:.3f} {lo:.3f}  SRTM {s}  ASTER {a}  Leh {d:.1f} km", flush=True); time.sleep(1.1)
print(f"distance range over the grid: {min(ds):.1f}-{max(ds):.1f} km")

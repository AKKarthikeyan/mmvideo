#!/usr/bin/env python3
"""CY03 placement points. FOR PLACEMENT ONLY (map pins). Tolerance +-0.05 deg (about 5 km); see tolerance_scan.py. No point is given for PP-15: the sheet has several "Hot Spring" labels and no text says which is PP-15.
Source of positions: Survey of India, LADAKH State Map, 3rd edition 2026, 1:1,000,000 (sources/soi_ladakh_map_3rd_2026.pdf),
read by eye against the printed graticule on 200/300 dpi crops (calibration in soi_map_readings.md). Leh = Natural Earth 10m
populated places (India point of view data set family). Elevation = SRTM 30 m (NASA/USGS) and ASTER GDEM 30 m (NASA/METI)
read through the OpenTopoData API. Cross-check column = OpenStreetMap Nominatim finding-aid value (tier X, NOT evidence).
Distance = haversine, R = 6371.0088 km."""
import json, math, urllib.request, time
PTS = {  # name: (lat, lon, label on the SoI map)
 "Leh": (34.161559, 77.572291, "LEH (Natural Earth populated places)"),
 "Galwan-Shyok confluence": (34.76, 78.19, "Galwan River / Shyok River"),
 "Depsang Plains (label centre)": (35.27, 78.00, "Depsang Plains"),
 "Gogra (Umlung)": (34.365, 78.905, "Gogra (Umlung)"),
 "Kongka La": (34.33, 79.14, "Kongka La"),
 "Chushul": (33.606, 78.65, "Chushul"),
 "Pangong Tso (visible lake, centre of Indian-side reach)": (33.825, 78.60, "Pangong Tso (Brackish)"),
 "Demchok": (32.675, 79.49, "Demchok"),
}
CROSS = {"Galwan-Shyok confluence": (34.7692312, 78.2130416), "Demchok": (32.7040811, 79.4467432)}
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
            time.sleep(2)
for k, (la, lo, lab) in PTS.items():
    print(f"{k}: lat {la:.3f} lon {lo:.3f} | SoI label '{lab}' | SRTM30m {elev('srtm30m', la, lo)} m | ASTER30m {elev('aster30m', la, lo)} m")
    time.sleep(1.1)
for k, c in CROSS.items():
    p = PTS[k]; print(f"cross-check {k}: SoI reading vs OSM finding aid differ by {hav((p[0], p[1]), c):.1f} km")
leh = PTS["Leh"]; g = PTS["Galwan-Shyok confluence"]; d = PTS["Demchok"]
print(f"great-circle Leh -> Galwan-Shyok confluence: {hav(leh[:2], g[:2]):.1f} km (straight line; roads are longer)")
print(f"great-circle Leh -> Demchok: {hav(leh[:2], d[:2]):.1f} km; Leh -> Depsang label: {hav(leh[:2], PTS['Depsang Plains (label centre)'][:2]):.1f} km")

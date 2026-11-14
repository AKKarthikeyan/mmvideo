"""W3-07 Konkan Railway: our own computations from recorded official values (python3 -I, standard library only).
Usage: python3 -I distance_and_arithmetic.py <ne_10m_populated_places_simple.geojson>
(1) Great-circle distance Mumbai-Mangaluru from Natural Earth populated-place points (haversine, R=6371.0088 km).
(2) Arithmetic on figures recorded in claims.jsonl (ids in brackets). Inputs are copied here with their claim id."""
import json, math, sys, datetime as dt
def hav(a, b, R=6371.0088):
    la1, lo1, la2, lo2 = map(math.radians, (a[1], a[0], b[1], b[0]))
    d = 2*R*math.asin(math.sqrt(math.sin((la2-la1)/2)**2 + math.cos(la1)*math.cos(la2)*math.sin((lo2-lo1)/2)**2))
    return d
pts = {}
for f in json.load(open(sys.argv[1]))["features"]:
    p = f["properties"]
    if p.get("adm0name") == "India" and p["nameascii"] in ("Mumbai", "Mangaluru", "Panaji"):
        pts[p["nameascii"]] = f["geometry"]["coordinates"]
print("Natural Earth points (lon,lat):", pts)
gc = hav(pts["Mumbai"], pts["Mangaluru"])
print(f"(1) Mumbai-Mangaluru great-circle: {gc:.0f} km")
print(f"    KRCL rail distance via Konkan 914 km [C-dist]: rail/great-circle = {914/gc:.2f}; old route 2041 km / great-circle = {2041/gc:.2f}")
print(f"    KRCL saving 2041-914 = {2041-914} km ({(2041-914)/2041*100:.0f}% of old route)")
print()
print("(2) Arithmetic")
route = 738.941; tun = 84.496
print(f"    tunnels: 84.496 km of 738.941 km = {tun/route*100:.1f}% of the route; 91 tunnels = one per {route/91:.1f} km")
print(f"    longest tunnel 6.5 km = {6.5/tun*100:.1f}% of all tunnel length")
d0 = dt.date(1990, 9, 15); d1 = dt.date(1998, 1, 26)
days = (d1-d0).days; yrs = days/365.25
print(f"    foundation stone 15 Sep 1990 -> whole line open 26 Jan 1998 = {days} days = {yrs:.2f} years (7 y 4 m)")
d0b = dt.date(1990, 10, 15)
daysb = (d1-d0b).days; yrsb = daysb/365.25
print(f"    if the start was 15 Oct 1990 (KRCL 2016 note; Sida says October 1990): {daysb} days = {yrsb:.2f} years (7 y 3 m)")
from datetime import date
def add_years(d, y):
    return d + dt.timedelta(days=round(y*365.25))
for lab, st in (("15 Sep 1990", d0), ("15 Oct 1990", d0b)):
    due = add_years(st, 4.5)
    print(f"    planned 4.5 years from {lab} -> due about {due}; late by {(d1-due).days/365.25:.2f} years")
print(f"    pace: 738.941 km / {yrs:.2f} y = {route/yrs:.0f} km a year")
print(f"    planned period 4.5 years (Sida) -> planned pace {route/4.5:.0f} km a year; actual/plan time = {yrs/4.5:.2f}")
# Apta-Roha: works begun 1980 (RS 27.06.1980: 'commencing the work on the first 62 kms'), opened March 1986 (KRCL)
print(f"    Apta-Roha 62 km: begun 1980 (month not stated; answer dated 27 Jun 1980), opened Mar 1986 = 5.7 to 6.3 years -> {62/6.3:.0f} to {62/5.7:.0f} km a year")
print(f"    RS 08 Aug 1984: 20.35 km done Apta-Pen since 1980 start: about {20.35/4.1:.0f} km a year (4.1 y from 27 Jun 1980)")
print(f"    ratio Konkan pace to Apta-Roha pace: {route/yrs/(62/5.7):.0f}x to {route/yrs/(62/6.3):.0f}x")
# Roha-Veer doubling: commenced Oct 2016, completed 30 Aug 2021, 46.8 km (KRCL press)
dd0 = dt.date(2016, 10, 1); dd1 = dt.date(2021, 8, 30); dy = (dd1-dd0).days/365.25
print(f"    Roha-Veer doubling 46.8 km: Oct 2016 -> 30 Aug 2021 = {dy:.1f} years = {46.8/dy:.1f} km a year")
print(f"    whole-line pace was {route/yrs/(46.8/dy):.0f}x the doubling pace")
print(f"    doubled share today (Lok Sabha 12.08.2026): 55 km of 739 route km = {55/739*100:.1f}%")
# cost
print(f"    cost: initial Rs 1073 crore (RS 29.11.1996) -> final Rs 3555 crore (RS 26.07.2019) = {3555/1073:.2f}x, +{(3555/1073-1)*100:.0f}%")
print(f"    cost: Rs 1000 crore (RS 10.08.1990 estimate) -> 3555 = {3555/1000:.2f}x ; Rs 862 crore (RS 08.03.1989, 837 km) -> 3555 = {3555/862:.2f}x")
print(f"    final cost split: 2520 works + 1035 financing = {2520+1035}; financing share {1035/3555*100:.0f}%")
print(f"    cost per route km at completion: 3555 crore / 738.941 km = Rs {3555/738.941:.2f} crore a km (nominal, mixed years)")
print(f"    length history: 910 km (RS 1984, Apta-Mangalore) / 837 km (RS 1989-90, Roha-Mangalore) / 760 km (KRCL plan) / 738.941 km built: built is {(837-738.941)/837*100:.0f}% shorter than 837")
print(f"    states: 382+105+273 = {382+105+273} km (3ie / RS 26.07.1996 MP speech); share Maharashtra {382/760*100:.0f}%, Goa {105/760*100:.0f}%, Karnataka {273/760*100:.0f}%")
print(f"    equity 1990 (RS 10.08.1990): Union 128 + Maharashtra 55 + Goa 15 + Karnataka 37 + Kerala 15 = {128+55+15+37+15} crore of 250 authorised; Kerala {15/250*100:.0f}%")
print(f"    LS 12.08.2026 shareholding sum: {66.79+14.91+10.17+4.07+4.07:.2f}")

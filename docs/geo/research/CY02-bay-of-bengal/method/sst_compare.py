"""Mean sea-surface temperature, NOAA ERSST v5 (2-degree monthly), 1991-2020, two boxes:
Bay of Bengal 10-20N, 82-92E and Arabian Sea 10-20N, 60-72E. Ocean cells only (NaN = land, skipped).
Plain average of grid cells (cos-latitude weighting changes results by <0.05 C at these latitudes; also printed)."""
import csv, sys, math
from collections import defaultdict
rows = list(csv.reader(open(sys.argv[1])))[2:]
acc = defaultdict(lambda: [0.0, 0, 0.0, 0.0])
for t, d, la, lo, s in rows:
    if s in ("NaN", ""): continue
    la, lo, s, m = float(la), float(lo), float(s), int(t[5:7])
    box = "Bay" if 82 <= lo <= 92 else ("Arabian" if 60 <= lo <= 72 else None)
    if not box: continue
    w = math.cos(math.radians(la))
    a = acc[(box, m)]; a[0] += s; a[1] += 1; a[2] += s * w; a[3] += w
print("month  Bay(mean C)  Arabian(mean C)  Bay-Arabian   [cos-lat weighted Bay / Arabian]")
for m in range(1, 13):
    b, a = acc[("Bay", m)], acc[("Arabian", m)]
    print(f"{m:5d}  {b[0]/b[1]:10.2f}  {a[0]/a[1]:14.2f}  {b[0]/b[1]-a[0]/a[1]:+10.2f}   [{b[2]/b[3]:.2f} / {a[2]/a[3]:.2f}]  cells/yr-month Bay={b[1]//30} Ar={a[1]//30}")
yb = sum(acc[("Bay", m)][0] for m in range(1,13)) / sum(acc[("Bay", m)][1] for m in range(1,13))
ya = sum(acc[("Arabian", m)][0] for m in range(1,13)) / sum(acc[("Arabian", m)][1] for m in range(1,13))
print(f"annual  {yb:10.2f}  {ya:14.2f}  {yb-ya:+10.2f}")

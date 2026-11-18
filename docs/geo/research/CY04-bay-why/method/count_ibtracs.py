"""Count North Indian Ocean storms by genesis sub-basin from IBTrACS v04r01 (NI list), using RSMC New Delhi (IMD) winds.
Genesis sub-basin = SUBBASIN of the storm's first point that has a NEWDELHI_WIND value (first IMD-tracked fix).
Sub-basin codes: BB = Bay of Bengal (incl. Andaman Sea), AS = Arabian Sea, MM = IBTrACS "missing" sub-basin.
Only one storm has MM: Gay 1989, whose first IMD fix is in the Gulf of Thailand (western Pacific basin, near 7N 105E).
We count Gay as Bay (BB+MM) by choice, because it matured and made landfall in the Bay. Without Gay, Bay CS+ = 121
(ratio 2.42, share 71%, SCS+ 62%); no headline number changes.
Peak = max NEWDELHI_WIND (kt, IMD 3-min). IMD classes: CS>=34, SCS>=48, VSCS>=64, ESCS>=90, SuCS>=120.
Only TRACK_TYPE=main rows. Seasons 1982-2024 (IMD winds start 1982 in IBTrACS; 2025 still partly provisional in the 27 Oct 2026 file)."""
import csv, sys, json
from collections import defaultdict
f = sys.argv[1]
r = csv.reader(open(f)); h = next(r); next(r)
ix = {k: h.index(k) for k in ["SID","SEASON","BASIN","SUBBASIN","NAME","ISO_TIME","TRACK_TYPE","NEWDELHI_WIND","NEWDELHI_GRADE","LAT","LON","DIST2LAND"]}
storms = defaultdict(list)
for row in r:
    if row[ix["TRACK_TYPE"]] != "main": continue
    storms[row[ix["SID"]]].append(row)
out = []
for sid, rows in storms.items():
    nd = [x for x in rows if x[ix["NEWDELHI_WIND"]].strip()]
    if not nd: continue
    first_any = rows[0]
    g = nd[0]
    peak = max(int(float(x[ix["NEWDELHI_WIND"]])) for x in nd)
    pk = max(nd, key=lambda x: float(x[ix["NEWDELHI_WIND"]]))
    out.append(dict(sid=sid, season=int(g[ix["SEASON"]]), name=g[ix["NAME"]], gen_sub=g[ix["SUBBASIN"]], gen_basin=g[ix["BASIN"]],
                    first_basin=first_any[ix["BASIN"]], first_time=first_any[ix["ISO_TIME"]], gen_time=g[ix["ISO_TIME"]],
                    gen_month=int(g[ix["ISO_TIME"]][5:7]), peak=peak, peak_sub=pk[ix["SUBBASIN"]], peak_time=pk[ix["ISO_TIME"]]))
json.dump(out, open(sys.argv[2], "w"), indent=0)
def cls(w):
    return [("CS+",34),("SCS+",48),("VSCS+",64),("ESCS+",90),("SuCS",120)]
def tab(lo, hi):
    sel = [s for s in out if lo <= s["season"] <= hi]
    print(f"\n== Seasons {lo}-{hi}: {len(sel)} IMD-tracked systems ==")
    for sub in ["BB","AS","MM","NA"]:
        ss = [s for s in sel if s["gen_sub"] == sub]
        line = f"{sub}: all={len(ss)}"
        for nm, t in cls(0):
            line += f"  {nm}={sum(1 for s in ss if s['peak']>=t)}"
        print(line)
    for nm, t in cls(0):
        b = sum(1 for s in sel if s['gen_sub'] in ('BB','MM') and s['peak']>=t)
        a = sum(1 for s in sel if s['gen_sub']=='AS' and s['peak']>=t)
        print(f"  {nm}: Bay(BB+MM)={b} Arabian={a} ratio={b/a if a else float('nan'):.2f} Bay share={b/(a+b) if a+b else 0:.0%}")
for lo, hi in [(1982,2024),(1990,2024),(1982,2003),(2004,2024)]:
    tab(lo, hi)
print("\nSuper cyclonic storms (peak>=120 kt):")
for s in sorted(out, key=lambda s: -s["peak"]):
    if s["peak"] >= 120: print(" ", s["season"], s["name"], s["gen_sub"], s["peak"], s["peak_time"])
print("\nTop 12 by IMD peak wind:")
for s in sorted(out, key=lambda s: -s["peak"])[:12]: print(" ", s["season"], s["name"], s["gen_sub"], s["peak"])
print("\nSystems whose IBTrACS track starts in the WP basin (Pacific remnants), CS+ in NI:")
wp = [s for s in out if s["first_basin"] == "WP"]
for s in wp: print(" ", s["season"], s["name"], s["gen_sub"], s["peak"], s["first_time"], "->", s["gen_time"])
print("count all WP-origin:", len(wp), " of which CS+:", sum(1 for s in wp if s['peak']>=34))
print("\nMonth of genesis, CS+ storms 1982-2024 (Bay=BB+MM, Arabian=AS), and SCS+ ")
for m in range(1,13):
    b=[s for s in out if s['gen_sub'] in ('BB','MM') and s['peak']>=34 and s['gen_month']==m and s['season']<=2024]
    a=[s for s in out if s['gen_sub']=='AS' and s['peak']>=34 and s['gen_month']==m and s['season']<=2024]
    bs=sum(1 for s in b if s['peak']>=48); as_=sum(1 for s in a if s['peak']>=48)
    print(f"  {m:2d}: Bay CS+={len(b):3d} SCS+={bs:3d} | Arabian CS+={len(a):3d} SCS+={as_:3d}")

print("\nPer-storm odds: of the cyclonic storms (CS+) born in each basin, what share reached each higher class (IMD winds)")
for lo, hi in [(1982, 2024), (1990, 2024), (2004, 2024)]:
    for lab, subs in [("Bay", ("BB", "MM")), ("Arabian", ("AS",))]:
        cs = [s for s in out if lo <= s["season"] <= hi and s["gen_sub"] in subs and s["peak"] >= 34]
        n = len(cs)
        print(f"  {lo}-{hi} {lab}: CS+={n}  SCS+ {sum(s['peak']>=48 for s in cs)/n:.0%}  VSCS+ {sum(s['peak']>=64 for s in cs)/n:.0%}  ESCS+ {sum(s['peak']>=90 for s in cs)/n:.0%}")

# Robustness: same storms, JTWC (USA_WIND, 1-min) peak, Saffir-Simpson thresholds
r2 = csv.reader(open(f)); h2 = next(r2); next(r2)
iu = h2.index("USA_WIND"); isid = h2.index("SID"); itt = h2.index("TRACK_TYPE")
usa = defaultdict(int)
for row in r2:
    if row[itt] == "main" and row[iu].strip():
        usa[row[isid]] = max(usa[row[isid]], int(float(row[iu])))
print("\nRobustness with JTWC 1-min winds (USA_WIND), same genesis rule, storms with JTWC peak >=35 kt")
for lo, hi in [(1982, 2024), (1982, 2003), (2004, 2024)]:
    line = f"  {lo}-{hi}:"
    for lab, subs in [("Bay", ("BB", "MM")), ("Arabian", ("AS",))]:
        ss = [s for s in out if lo <= s["season"] <= hi and s["gen_sub"] in subs]
        w = [usa.get(s["sid"], 0) for s in ss]
        line += f"  {lab}: TS+={sum(x>=35 for x in w)} Cat1+={sum(x>=64 for x in w)} Cat3+={sum(x>=96 for x in w)} Cat4+={sum(x>=113 for x in w)} Cat5={sum(x>=137 for x in w)} |"
    print(line)

print("\nStorms with JTWC peak >=137 kt (Saffir-Simpson Cat 5 equivalent), 1982-2024, with IMD peak for comparison")
for s in sorted(out, key=lambda s: s["season"]):
    if s["season"] <= 2024 and usa.get(s["sid"], 0) >= 137:
        print(f"  {s['season']} {s['name']} genesis={s['gen_sub']} JTWC={usa[s['sid']]} kt IMD={s['peak']} kt")

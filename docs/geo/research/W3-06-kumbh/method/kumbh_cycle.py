"""(1) Years in which Jupiter is in sidereal Aquarius on the day the Sun enters sidereal Aries (the Haridwar rule as stated on
kumbh.gov.in / UNESCO file / Hardwicke 1796). (2) Jupiter's mean sidereal period from unwrapped longitude 1993-2041.
(3) Gap table of the last five Kumbh events from official dates. Uses the saved Horizons CSV from jupiter_signs.py.
Run: python3 -I kumbh_cycle.py"""
import csv, os, datetime as dt, importlib.util, io, contextlib
HERE=os.path.dirname(os.path.abspath(__file__))
spec=importlib.util.spec_from_file_location("js",os.path.join(HERE,"jupiter_signs.py"))
with contextlib.redirect_stdout(io.StringIO()):
    js=importlib.util.module_from_spec(spec); spec.loader.exec_module(js)
data=js.data; days=sorted(data); SIGNS=js.SIGNS
sid=lambda d,i:(data[d][i]-js.ayan(d))%360
out=[]
out.append("1. Years (1993-2040) when, on the day the Sun enters sidereal Aries (Lahiri), Jupiter is in each sign")
prevs=None
for d in days:
    s=int(sid(d,1)//30)
    if prevs==11 and s==0:
        j=sid(d,0); out.append(f"  {d}: Sun enters Aries; Jupiter {SIGNS[int(j//30)]} ({j:.1f} deg)")
    prevs=s
out.append("")
# Jupiter mean sidereal period
import math
lons=[data[d][0] for d in days]; unw=[lons[0]]
for x in lons[1:]:
    prev=unw[-1]; k=round((prev-x)/360.0); unw.append(x+360*k)
years=(days[-1]-days[0]).days/365.25
rev=(unw[-1]-unw[0])/360.0
out.append(f"2. Jupiter tropical longitude advanced {unw[-1]-unw[0]:.1f} deg in {years:.2f} years ({days[0]} to {days[-1]}): {rev:.3f} revolutions; mean period {years/rev:.3f} years (tropical-year basis; sidereal period is within 0.01 y of this)")
out.append("   (12 - mean period) x 1 cycle = %.3f y/cycle, so a fixed 12-year count drifts one year in about %.0f years" % (12-years/rev, 1/((12-years/rev)/12)*12/12*1 if False else 12/(12-years/rev)))
out.append("")
out.append("3. Last five Kumbh events (start dates from official pages in sources/): site, start, years since previous")
ev=[("Prayagraj (Allahabad)",dt.date(2013,1,14),"CAG report: 14 Jan - 10 Mar 2013"),("Nashik-Trimbakeshwar",dt.date(2015,1,1),"nashik.gov.in: 'Simhastha ... 2015-16' (year only; start = Jul 2015 flag date, see note)"),
    ("Ujjain",dt.date(2016,4,22),"PIB Ministry of Culture: starting April 22, 2016"),("Haridwar",dt.date(2021,3,11),"haridwar.nic.in: 11/03/2021 - 27/03/2021"),("Prayagraj",dt.date(2025,1,13),"PIB / kumbh.gov.in: 13 Jan - 26 Feb 2025")]
for i,(n,d,src) in enumerate(ev):
    gap="" if i==0 else f"  gap {(d-ev[i-1][1]).days/365.25:.1f} y (calendar years apart: {d.year-ev[i-1][1].year})"
    out.append(f"  {n}: {d.year}{gap}   [{src}]")
out.append("   Calendar-year gaps 2013->2015->2016->2021->2025 = 2, 1, 5, 4 years. Every site recurs 11-12 years apart (Prayagraj 2013->2025 = 12; Haridwar 2010->2021 = 11).")
out.append("")
out.append("4. Jupiter sidereal sign at the Kumbh events (mid-event date)")
for n,d in [("Prayagraj 2013",dt.date(2013,2,10)),("Nashik 2015 (Sep)",dt.date(2015,9,13)),("Ujjain 2016",dt.date(2016,5,1)),("Haridwar 2021 (14 Apr)",dt.date(2021,4,14)),("Prayagraj 2025",dt.date(2025,1,29))]:
    j=sid(d,0); out.append(f"  {n}: Jupiter {SIGNS[int(j//30)]} ({j:.1f})")
open(os.path.join(HERE,"kumbh_cycle_output.txt"),"w").write("\n".join(out)+"\n"); print("\n".join(out))

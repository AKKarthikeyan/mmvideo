"""Jupiter and Sun sidereal rashi (sign) by date, from JPL Horizons geocentric apparent ecliptic longitude
(tropical, of date; Horizons quantity 31 ObsEcLon) minus Lahiri ayanamsa (Calendar Reform Committee value
23 deg 15' 00.658" at 1956-03-21, advanced with IAU 2006 general precession). Run: python3 -I jupiter_signs.py
Outputs: horizons_jupiter_sun_daily.csv (raw) and jupiter_signs_output.txt (summary)."""
import urllib.request, urllib.parse, re, csv, math, datetime as dt, os, sys
HERE=os.path.dirname(os.path.abspath(__file__))
SIGNS=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
def horizons(cmd,start,stop):
    p={"format":"text","COMMAND":f"'{cmd}'","OBJ_DATA":"'NO'","MAKE_EPHEM":"'YES'","EPHEM_TYPE":"'OBSERVER'","CENTER":"'500@399'",
       "START_TIME":f"'{start}'","STOP_TIME":f"'{stop}'","STEP_SIZE":"'1d'","QUANTITIES":"'31'","ANG_FORMAT":"'DEG'","CAL_FORMAT":"'CAL'"}
    u="https://ssd.jpl.nasa.gov/api/horizons.api?"+urllib.parse.urlencode(p)
    t=urllib.request.urlopen(u,timeout=120).read().decode()
    rows={}
    s=t.split("$$SOE")[1].split("$$EOE")[0]
    for ln in s.strip().splitlines():
        m=re.match(r"\s*(\d{4})-(\w{3})-(\d\d) (\d\d):(\d\d)\s+([\d.]+)\s+([-\d.]+)",ln)
        if m:
            d=dt.datetime.strptime(f"{m[1]}-{m[2]}-{m[3]}","%Y-%b-%d").date()
            rows[d]=float(m[6])
    return rows
def ayan(d):
    T=((d-dt.date(2000,1,1)).days-0.5)/36525.0
    T0=((dt.date(1956,3,21)-dt.date(2000,1,1)).days-0.5)/36525.0
    pa=lambda T:5028.796195*T+1.1054348*T*T
    return (23+15/60+0.658/3600)+(pa(T)-pa(T0))/3600.0
def load():
    path=os.path.join(HERE,"horizons_jupiter_sun_daily.csv")
    if os.path.exists(path):
        out={}
        for r in csv.DictReader(open(path)): out[dt.date.fromisoformat(r["date"])]=(float(r["jup_trop"]),float(r["sun_trop"]))
        return out
    J={};S={}
    for y0,y1 in [(1993,2010),(2010,2027),(2027,2041)]:
        J.update(horizons(599,f"{y0}-01-01",f"{y1}-01-01")); S.update(horizons(10,f"{y0}-01-01",f"{y1}-01-01"))
    with open(path,"w") as f:
        f.write("date,jup_trop,sun_trop\n")
        for d in sorted(J): f.write(f"{d},{J[d]},{S[d]}\n")
    return {d:(J[d],S[d]) for d in J}
data=load()
def sid(d,i): return (data[d][i]-ayan(d))%360
def sign(d,i): return SIGNS[int(sid(d,i)//30)]
days=sorted(data)
out=[]
out.append("Jupiter sidereal (Lahiri) sign ingresses, UT dates, 1993-2040 (daily sampling; ingress = first day in new sign; retrograde re-entries shown)")
prev=sign(days[0],0)
for d in days[1:]:
    s=sign(d,0)
    if s!=prev: out.append(f"  {d}  Jupiter enters {s}  (sidereal lon {sid(d,0):.2f})"); prev=s
out.append("")
out.append("Sun sidereal sign ingresses in April and Jan (sankranti) for sample years")
for y in (2010,2013,2015,2016,2021,2025,2027,2028,2033,2037):
    ds=[d for d in days if d.year==y]; prev=sign(ds[0],1)
    for d in ds[1:]:
        s=sign(d,1)
        if s!=prev:
            if s in("Aries","Capricorn"): out.append(f"  {d}  Sun enters {s}")
            prev=s
out.append("")
def state(d): return f"{d}: Jupiter {sign(d,0)} ({sid(d,0):.1f}), Sun {sign(d,1)} ({sid(d,1):.1f})"
out.append("Official Kumbh dates tested (dates from official pages in sources/)")
for lab,d in [("Haridwar 2021 start 11 Mar",dt.date(2021,3,11)),("Haridwar 2021 end 27 Mar",dt.date(2021,3,27)),("Haridwar 2021 Mesha-sankranti period 14 Apr",dt.date(2021,4,14)),("Haridwar 2021 27 Apr",dt.date(2021,4,27)),
              ("Haridwar 2010 14 Apr",dt.date(2010,4,14)),("Prayagraj 2025 start 13 Jan",dt.date(2025,1,13)),("Prayagraj 2025 end 26 Feb",dt.date(2025,2,26)),("Prayagraj 2025 Mauni Amavasya 29 Jan",dt.date(2025,1,29)),
              ("Prayagraj 2013 14 Jan",dt.date(2013,1,14)),("Prayagraj 2013 10 Feb",dt.date(2013,2,10)),("Nashik 2015 14 Jul",dt.date(2015,7,14)),("Nashik 2015 25 Sep",dt.date(2015,9,25)),
              ("Ujjain 2016 22 Apr",dt.date(2016,4,22)),("Ujjain 2016 21 May",dt.date(2016,5,21)),("Ujjain 2004 5 May",dt.date(2004,5,5))]:
    out.append("  "+lab+" -> "+state(d))
open(os.path.join(HERE,"jupiter_signs_output.txt"),"w").write("\n".join(out)+"\n")
print("\n".join(out))

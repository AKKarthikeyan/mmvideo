"""W3-12-thar-west computations (python3 -I). Inputs: values copied from sources/ (Census DCHB Jaisalmer Part A; Census A-02 Rajasthan; CGWB Jaisalmer aquifer report 2017)."""
import pathlib, sys
base = pathlib.Path(sys.argv[1])
def page_of(fname, needle):
    t = (base / "sources" / fname).read_text(errors="ignore")
    i = t.find(needle)
    return t[:i].count("\f") + 1 if i >= 0 else None
# Census 2011: Jaisalmer population (A-02 / DCHB) and area (DCHB)
pop, area = 669919, 38401.00
state_pop, state_area, state_den = 68548437, 342239, 200
print(f"Jaisalmer density = {pop}/{area} = {pop/area:.2f} per sq km (Census prints 17)")
print(f"State density check = {state_pop}/{state_area} = {state_pop/state_area:.1f} (Census prints 200)")
print(f"State density / Jaisalmer density = 200/17 = {200/17:.1f}; unrounded {(state_pop/state_area)/(pop/area):.1f}")
print(f"Share of state population = {100*pop/state_pop:.2f}% ; share of state area = {100*area/state_area:.2f}%")
p1901 = 75551
print(f"Growth 1901->2011 = {pop}/{p1901} = {pop/p1901:.2f}x")
print(f"Rajasthan 1901->2011 = {state_pop}/10294090 = {state_pop/10294090:.2f}x")
print(f"Decade 2001-11: Jaisalmer +31.81% vs Rajasthan +21.31% (A-02, printed)")
# CGWB Table 7: irrigated area by source (ha)
canal, tw, wells, other, tot = 210880, 129732, 1632, 18, 342262
print(f"CGWB Table 7: canal share = {100*canal/tot:.2f}% ; groundwater share = {100*(tw+wells)/tot:.2f}% (report prints 61.61 / 38.38)")
print(f"People per sq km -> sq km per 100 people = {100*area/pop:.2f}")
for f, n in [("dchb_jaisalmer_A.txt","DISTRICT HIGHLIGHTS- 2011 CENSUS"),("dchb_jaisalmer_A.txt","The annual normal rainfall of the district is 185.5 mm"),
             ("dchb_jaisalmer_A.txt","It shares almost 0.98"),("dchb_jaisalmer_A.txt","equal to the state of Kerala"),("dchb_jaisalmer_A.txt","On the completion of the Indira Gandhi Nahar"),
             ("dchb_jaisalmer_A.txt","Density of Population (Persons"),
             ("cgwb_jaisalmer_2017.txt","annual rainfall in the district during the period 1901 to 2006"),("cgwb_jaisalmer_2017.txt","about 61.61% area is irrigated by canal"),
             ("cgwb_jaisalmer_2017.txt","mbgl to 124.39 mbgl"),("cgwb_jaisalmer_2017.txt","deeper tube well"),("cgwb_jaisalmer_2017.txt","even in canal command areas water level is declining"),
             ("census_A02_rajasthan.txt","Jaisalmer        1901")]:
    print(f"PDF page of '{n[:45]}' in {f}: {page_of(f, n)}")
import re
rows = re.findall(r"^08\s+(\d{3})\s+(\S+)", (base/"sources"/"census_A02_rajasthan.txt").read_text(errors="ignore"), re.M)
d = [r for r in rows if r[0] != "000"]
print(f"Districts listed in Census A-02 Rajasthan (2011 boundaries): {len(d)} -> rank 33rd = last")

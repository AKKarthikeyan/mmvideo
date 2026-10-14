#!/usr/bin/env python3
"""Data Kadai long-form 01: turn the price release pages read on 14 Oct 2026 into state tables the builder reads.

Input: the raw reads in research/2026-10-14/longform/raw/ (tables copied from the PIB release pages, read in a browser,
and from MoSPI's eSankhyiki data service). Output: public/datayt/sources/mospi/cpi2024_*.json in the Handbook's shape
({title, publisher, unit, columns, notes, states}, the all-India row "India"), read with {"tbl": ["mospi/<file>", column]}.
Usage (repo root): python3 scripts/datayt/cpi2024_tables.py <raw folder>
"""
import json, os, sys
RAW = sys.argv[1]; OUT = "public/datayt/sources/mospi"; os.makedirs(OUT, exist_ok=True)
J = lambda f: json.load(open(os.path.join(RAW, f)))
NAME = {"Andaman And Nicobar Islands": "Andaman and Nicobar Islands", "Jammu And Kashmir": "Jammu and Kashmir", "NCT of Delhi": "Delhi", "Chandigarh*": "Chandigarh",
        "The Dadra And Nagar Haveli And Daman And Diu": "Dadra and Nagar Haveli and Daman and Diu", "All India": "India"}
nm = lambda s: NAME.get(s, s)
num = lambda x: None if x in ("-", "", None) else float(x)
SEP = "MoSPI via PIB, Press release of Consumer Price Index on base 2024=100 for September, 2026, PRID 2322244, 12 Oct 2026, Annexure III"
AUG = "MoSPI via PIB, Press release of Consumer Price Index on base 2024=100 for August, 2026, PRID 2310058, 14 Sep 2026"
PORTAL = "MoSPI eSankhyiki portal (CPI base 2024=100, series Current), read 14 Oct 2026"
states = {}
for r in J("pib_2322244_states.json"):
    s = nm(r[1]); states[s] = dict(zip(["Rural index Sep 2026", "Urban index Sep 2026", "Combined index Sep 2026", "Rural inflation Sep 2026", "Urban inflation Sep 2026", "Combined inflation Sep 2026"], map(num, r[2:8])))
states["India"] = dict(zip(["Rural index Sep 2026", "Urban index Sep 2026", "Combined index Sep 2026", "Rural inflation Sep 2026", "Urban inflation Sep 2026", "Combined inflation Sep 2026"], [110.11, 108.71, 109.49, 6.08, 4.88, 5.54]))
for r in J("pib_2310058_states.json")["rows"]:
    states[nm(r[0])].update(dict(zip(["Rural inflation Aug 2026 (provisional)", "Urban inflation Aug 2026 (provisional)", "Combined inflation Aug 2026 (provisional)"], map(num, r[4:7]))))
states["India"].update({"Rural inflation Aug 2026 (provisional)": 5.23, "Urban inflation Aug 2026 (provisional)": 4.31, "Combined inflation Aug 2026 (provisional)": 4.82, "Combined inflation Aug 2026 (final)": 4.83})
E = J("esankhyiki_2026-09.json")
for key, col in (("food_states_sep2026_combined", "Food inflation Sep 2026"), ("onion_states_sep2026_combined", "Onion inflation Sep 2026")):
    for s, _, v in E[key]:
        states[nm(s)][col] = num(v)
cols = sorted({c for v in states.values() for c in v}, key=lambda c: (("Aug" in c), c))
assert len(states) == 37 and all(len(v) >= 9 for v in states.values()), {s: len(v) for s, v in states.items()}
json.dump({"title": "Consumer Price Index (base 2024=100): index and year-on-year inflation by state, September 2026 (provisional), with August 2026 and food and onion inflation",
           "publisher": "Ministry of Statistics and Programme Implementation (National Statistics Office)", "url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2322244",
           "unit": ["(index, 2024=100; inflation in per cent, year on year)"], "columns": cols,
           "notes": [f"September: {SEP}. August (provisional, as first published): {AUG}; the September release prints only the all-India final August figure (4.83).",
                     f"Food (Consumer Food Price Index, group 01.1) and onion (item) inflation by state: {PORTAL}; MoSPI: state-level item indices may rest on thin samples of price quotations.",
                     "No rural market in Chandigarh. Read 14 Oct 2026; September is provisional and is revised with October's release on 12 Nov 2026."],
           "states": states}, open(f"{OUT}/cpi2024_states_2026_09.json", "w"), ensure_ascii=False, indent=1)
months = {}
for r in J("pib_2322244_monthly.json"):
    m = r[0].rstrip("*"); months[m] = {"Rural index": num(r[1]), "Urban index": num(r[2]), "Combined index": num(r[3]), "Rural inflation": num(r[4]), "Urban inflation": num(r[5]), "Combined inflation": num(r[6])}
MON = {"January": "Jan", "February": "Feb", "March": "Mar", "April": "Apr", "May": "May", "June": "Jun", "July": "Jul", "August": "Aug", "September": "Sep", "October": "Oct", "November": "Nov", "December": "Dec"}
for key, pre in (("food_all_india_monthly_combined", "Food"), ("onion_all_india_monthly_combined", "Onion")):
    for y, m, idx, inf in E[key]:
        k = f"{MON[m]}-{y[2:]}"; months.setdefault(k, {}).update({f"{pre} index": num(idx), f"{pre} inflation": num(inf)})
json.dump({"title": "Consumer Price Index (base 2024=100), all India, by month: general index (rural, urban, combined), food and onion (combined)", "publisher": "Ministry of Statistics and Programme Implementation",
           "notes": [f"General: {SEP}, Annexure IV. Food and onion: {PORTAL}. Year-on-year rates exist from January 2026 only (the series starts with January 2025 as its first year). January 2026 onion as printed in PRID 2227012: -29.27 (the portal gives -29.30)."],
           "months": months}, open(f"{OUT}/cpi2024_monthly.json", "w"), ensure_ascii=False, indent=1)
W = J("pib_2227012_weights.json"); wt = {r[0].lower(): r for r in W["rows"]}
divs = {}
for r in J("pib_2322244_divisions.json"):
    if not r[0]: continue
    w = wt.get(r[1].lower()) or wt.get(r[1].lower().replace("education services", "education services"))
    divs[r[0]] = {"name": r[1], "rural": num(r[5]), "urban": num(r[6]), "combined": num(r[7]),
                  "weight combined 2024": num(w[6]) if w else None, "weight rural 2024": num(w[2]) if w else None, "weight urban 2024": num(w[4]) if w else None, "weight combined 2012": num(w[5]) if w else None}
groups = {r[0]: {"name": r[1], "rural": num(r[5]), "urban": num(r[6]), "combined": num(r[7])} for r in J("pib_2322244_groups.json")}
I = J("pib_2322244_items.json")
items = {r[1]: {"weight": num(r[3]), "Aug 2026": num(r[4]), "Sep 2026": num(r[5])} for r in I["high"] + I["low"]}
json.dump({"title": "Consumer Price Index (base 2024=100), all India, September 2026 (provisional): inflation by division, group and the five highest and lowest items",
           "publisher": "Ministry of Statistics and Programme Implementation", "notes": [f"{SEP} (Annexures I and II, key items); division weights from {W['source']}.",
           "Division 02 (paan, tobacco and intoxicants) and its groups are kept for the totals but never put on screen (channel rule)."],
           "divisions": divs, "groups": groups, "items": items, "key": I["key"], "facts": W["facts"] | {"response": I["response"]}}, open(f"{OUT}/cpi2024_breakdown_2026_09.json", "w"), ensure_ascii=False, indent=1)
print("written:", len(states), "state rows,", len(months), "months,", len(divs), "divisions,", len(groups), "groups,", len(items), "items")

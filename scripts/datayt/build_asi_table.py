#!/usr/bin/env python3
"""Build public/datayt/sources/evergreen/built_asi_2024_25.json from MoSPI's ASI 2024-25 Annexure II Table 3.

Input: research/2026-11-04/asi/raw/Table_3.xlsx (downloaded from the link printed in MoSPI's factsheet).
GVA = Net Value Added + Depreciation (reproduces the factsheet's Table 5 shares: Maharashtra 15.92%, Tamil Nadu 10.90%).
"""
import json
from pathlib import Path
import openpyxl

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "research/2026-11-04/asi/raw/Table_3.xlsx"
OUT = ROOT / "public/datayt/sources/evergreen/built_asi_2024_25.json"
RENAME = {"Keralam": "Kerala", "Chattisgarh": "Chhattisgarh", "Chandigarh(U.T.)": "Chandigarh",
          "Jammu & Kashmir": "Jammu and Kashmir", "All India*": "India"}
SKIP = {"Dadra & N Haveli & Daman & Diu", "Andaman & N. Island"}  # not on the Data Kadai map

ws = openpyxl.load_workbook(RAW, data_only=True).active
rows = {}
for r in ws.iter_rows(min_row=7, values_only=True):
    name = r[0]
    if not isinstance(name, str) or not isinstance(r[1], (int, float)):
        continue
    name = RENAME.get(name.strip(), name.strip())
    if name in SKIP:
        continue
    fac, pe, emol, out, dep, nva = r[1], r[6], r[8], r[10], r[11], r[12]
    rows[name] = dict(fac=fac, pe=pe, emol=emol, gva=nva + dep)

ind = rows["India"]
cols = ["Number of factories", "Total persons engaged", "Total emoluments (Rs lakh)", "Gross value added (Rs lakh)",
        "GVA per person engaged (Rs lakh)", "Share of India's factories (%)", "Share of India's persons engaged (%)",
        "Share of India's total emoluments (%)", "Share of India's GVA (%)"]
states = {}
for n, v in rows.items():
    states[n] = {cols[0]: float(v["fac"]), cols[1]: float(v["pe"]), cols[2]: float(v["emol"]), cols[3]: float(v["gva"]),
                 cols[4]: round(v["gva"] / v["pe"], 2),
                 cols[5]: round(100 * v["fac"] / ind["fac"], 2), cols[6]: round(100 * v["pe"] / ind["pe"], 2),
                 cols[7]: round(100 * v["emol"] / ind["emol"], 2), cols[8]: round(100 * v["gva"] / ind["gva"], 2)}
d = {
    "title": "State-wise principal characteristics of factories, ASI 2024-25",
    "unit": ["(factories and persons in number; emoluments and GVA in Rs lakh; shares in per cent of the all-India estimate)"],
    "columns": cols, "states": states,
    "source": "Ministry of Statistics and Programme Implementation, Annual Survey of Industries 2024-25, Annexure II Table 3 'Principal Characteristics by Major States'. GVA = Net Value Added + Depreciation. Shares and GVA per person engaged are computed from that table.",
    "url": "https://www.mospi.gov.in/uploads/documents/documents/1790753247981-Table_3.xlsx",
    "as_on": "ASI 2024-25 (factsheet 30 Sep 2026; Volume I 4 Nov 2026)", "table": "evergreen/built_asi_2024_25", "page": "Annexure II, Table 3",
    "notes": ["All-India row is the estimate printed in the table (it includes Lakshadweep). Dadra & Nagar Haveli and Daman & Diu and Andaman & Nicobar are left off the map list but stay in the India total.",
              "Persons engaged are all people in factories (workers, supervisors, managers, unpaid), not only workers. Registered factories and other ASI-covered units only; not all manufacturing."]}
OUT.write_text(json.dumps(d, indent=1, ensure_ascii=False))
print(len(states), "rows ->", OUT)
for n in ("India", "Maharashtra", "Tamil Nadu", "Gujarat"):
    print(n, {k: states[n][k] for k in cols[4:]})
print(sorted(((v[cols[4]], n) for n, v in states.items() if n != "India"), reverse=True)[:6])
print(sorted(((v[cols[4]], n) for n, v in states.items() if n != "India"))[:4])

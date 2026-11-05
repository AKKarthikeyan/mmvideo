#!/usr/bin/env python3
"""Data Kadai: GST (October 2026) and NPCI UPI source tables, read 1 Nov 2026.

Input: the GSTN revenue report PDFs (gst.gov.in/newsandupdates/read/680 and /673) and a JSON snapshot of the NPCI UPI statistics
pages (monthly table Apr-Sep 2026; daily table Oct 2026), each saved as printed.
Output under public/datayt/sources/ (git-ignored):
  gst/gst_2026_10.json    national table (Oct-25 v Oct-26, Apr-Oct) and the state tables 1-4 of the October report
  gst/gst_2026_09.json    the national table of the September report (month-on-month)
  npci/upi_monthly_daily_2026.json   NPCI UPI monthly (Apr-Sep 2026) and daily (1-10 Oct 2026) as the page prints them
Every derived figure is computed here from printed figures and labelled as ours. The script stops if a total does not add up.
Usage (repo root): python3 scripts/datayt/gst_npci_sources.py <folder with oct.pdf, sep.pdf, npci.json>
"""
import json, os, re, shutil, subprocess, sys

RAW = sys.argv[1]; SRC = "public/datayt/sources"
NUM = lambda s: int(s.replace(",", ""))
GEO = {"Delhi": "NCT of Delhi", "Maharastra": "Maharashtra", "Chattisgarh": "Chhattisgarh", "Andaman & Nicobar Islands": "Andaman and Nicobar Islands",
       "Dadra and Nagar Haveli": "Dadra & Nagar Haveli and Daman & Diu", "Dadra and Nagar Haveli and Daman and Diu": "Dadra & Nagar Haveli and Daman & Diu",
       "Dadra and Nagar Haveli and Daman & Diu": "Dadra & Nagar Haveli and Daman & Diu",
       "Islands": "Andaman and Nicobar Islands"}   # Table 4 prints this state's name over two lines; the numbers sit on the second
NOT_STATE = {"Other Territory", "Center Jurisdiction", "OIDAR"}
NUMTOK = r"-?[\d,]+(?:\.\d+)?%?|-"


def write(path, obj):
    os.makedirs(os.path.dirname(f"{SRC}/{path}"), exist_ok=True)
    json.dump(obj, open(f"{SRC}/{path}.json", "w"), ensure_ascii=False, indent=1); print("wrote", f"{SRC}/{path}.json")


def text(pdf):
    out = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True, check=True).stdout
    return out.splitlines()


def national(lines):
    """Rows of table A-C: label -> [monthly last year, monthly this year, growth, yearly last year, yearly this year, growth]."""
    want = {"Gross Domestic Revenue", "Gross Import Revenue", "Total Gross GST Revenue", "Refund - Domestic", "Refund - Imports", "Total Refund",
            "Net Domestic Revenue", "Net Customs Revenue", "Total Net GST Revenue"}
    rows = {}; comp = {}; sect = None
    for ln in lines:
        s = ln.strip()
        m = re.match(r"^(A\.1|A\.2|A\.3|B\.1|B\.2|B\.3|C\.1|C\.2|C\.3)", s)
        if m: sect = m.group(1)
        m = re.match(r"^(CGST|SGST|IGST)\s+((?:[\d,]+\s*)+)$", s)
        if m and sect:
            v = [NUM(x) for x in m.group(2).split()]
            if len(v) == 4: comp[f"{sect} {m.group(1)}"] = v
        for w in want:
            if s.startswith(w):
                t = re.findall(r"-?[\d,]+\.?\d*%?", s[len(w):])
                nums = [x for x in t if not x.endswith("%")]; pct = [x for x in t if x.endswith("%")]
                rows[w] = {"monthly last year": NUM(nums[0]), "monthly this year": NUM(nums[1]), "monthly growth %": float(pct[0][:-1]),
                           "yearly last year": NUM(nums[2]), "yearly this year": NUM(nums[3]), "yearly growth %": float(pct[1][:-1])}
    return rows, comp


def state_rows(lines, start, stop, ncol):
    """Rows of a state table between two markers: name, then ncol tokens (numbers and percents)."""
    out = {}; on = False
    for ln in lines:
        if start in ln: on = True; continue
        if on and stop in ln: break
        if not on: continue
        m = re.match(r"^\s*(?:\d+\s+)?([A-Za-z][A-Za-z &.\-]*?)\s*(" + NUMTOK + r")(?=\s|$)", ln)
        if not m: continue
        name = m.group(1).strip(); rest = ln[ln.index(name) + len(name):]
        t = re.findall(NUMTOK, rest)
        if len(t) == ncol: out[name] = t
    return out


def norm(n): return GEO.get(n, n)


# ------------------------------------------------------------------ October report
oct_pdf = f"{RAW}/oct.pdf"; L = text(oct_pdf)
nat, comp = national(L)
gross = nat["Total Gross GST Revenue"]; dom = nat["Gross Domestic Revenue"]; imp = nat["Gross Import Revenue"]
assert gross["monthly this year"] == 231290 and dom["monthly this year"] + imp["monthly this year"] == gross["monthly this year"], "October national totals moved"
assert abs(dom["monthly last year"] + imp["monthly last year"] - gross["monthly last year"]) <= 1

# Table 3: state-wise domestic GST this October (pre-settlement; excludes GST on imports)
t3 = state_rows(L, "Table 3: State-wise growth", "Grand Total", 3)
g3 =next(l for l in L[[i for i, l in enumerate(L) if "Table 3: State-wise growth" in l][0]:] if l.strip().startswith("Grand Total"))
t3["Grand Total"] = re.findall(NUMTOK, g3.replace("Grand Total", ""))
states3 = {}; non3 = {}
for n, t in t3.items():
    if n == "Grand Total": continue
    rec = {"Oct-25 (Rs crore)": NUM(t[0]), "Oct-26 (Rs crore)": NUM(t[1]), "Growth % (printed)": int(t[2][:-1])}
    rec["Growth % (our calculation, 1 decimal)"] = round((rec["Oct-26 (Rs crore)"] / rec["Oct-25 (Rs crore)"] - 1) * 100, 1)
    (non3 if n in NOT_STATE else states3)[norm(n)] = rec
s26 = sum(v["Oct-26 (Rs crore)"] for v in states3.values()) + sum(v["Oct-26 (Rs crore)"] for v in non3.values())
s25 = sum(v["Oct-25 (Rs crore)"] for v in states3.values()) + sum(v["Oct-25 (Rs crore)"] for v in non3.values())
assert s26 == NUM(t3["Grand Total"][1]) == dom["monthly this year"], f"table 3 does not add up: {s26}"
assert abs(s25 - NUM(t3["Grand Total"][0])) <= 2, f"table 3 Oct-25 does not add up: {s25}"

# Table 1 and 2: SGST and SGST portion of IGST settled (pre- and post-settlement)
def settle(start, stop):
    rows = state_rows(L, start, stop, 6)
    # the Dadra row prints its two names run together ("Daman58& Diu"): read it from the layout text
    out = {}
    for n, t in rows.items():
        out[norm(n)] = {"pre Oct-25": NUM(t[0]), "pre Oct-26": NUM(t[1]), "pre growth %": int(t[2][:-1]), "post Oct-25": NUM(t[3]), "post Oct-26": NUM(t[4]), "post growth %": int(t[5][:-1])}
    return out
t1 = settle("Table 1: SGST", "Table-2")
t2 = state_rows(L, "Table-2: SGST", "Post-Settlement GST is cumulative", 6)
t2 = {norm(n): {"pre 2025-26": NUM(t[0]), "pre 2026-27": NUM(t[1]), "pre growth %": int(t[2][:-1]), "post 2025-26": NUM(t[3]), "post 2026-27": NUM(t[4]), "post growth %": int(t[5][:-1])} for n, t in t2.items()}
if "Dadra & Nagar Haveli and Daman & Diu" not in t1:   # the garbled row, as printed: "Dadra and Nagar Haveli and Daman58& Diu 78 34% 115 132 15%"
    row = next(l for l in L if l.startswith("Dadra and Nagar Haveli and Daman58"))
    assert re.findall(NUMTOK, row.replace("Daman58&", "Daman &"))[:1] == ["78"], row
    t1["Dadra & Nagar Haveli and Daman & Diu"] = {"pre Oct-25": 58, "pre Oct-26": 78, "pre growth %": 34, "post Oct-25": 115, "post Oct-26": 132, "post growth %": 15}
for k, d in (("Table 1 (October)", t1), ("Table 2 (to October)", t2)):
    d.pop("Grand Total", None)
pre26 = sum(v["pre Oct-26"] for v in t1.values()); post26 = sum(v["post Oct-26"] for v in t1.values())
assert abs(pre26 - 51340) <= 40 and abs(post26 - 103341) <= 60, (pre26, post26)   # Grand Total row: 51,340 and 1,03,341 (rounding)

# Table 4: state-wise domestic collection, Apr-Oct 2026 (central + state formations); TOTAL and the printed growth
t4 = {}
i0 = next(i for i, l in enumerate(L) if l.strip().startswith("Table 4"))
for ln in L[i0:]:
    m = re.match(r"^\s*(\d+)?\s*([A-Za-z][A-Za-z ()&]*?)\s{2,}(.*)$", ln)
    if not m: continue
    name = m.group(2).strip(); toks = re.findall(NUMTOK, m.group(3))
    if len(toks) < 8 or name in ("state_Cd State", "No.of GSTINS as on") or not any(x.endswith("%") for x in toks): continue
    pct = [x for x in toks if x.endswith("%")]; first = next(i for i, x in enumerate(toks) if x.endswith("%"))
    t4[name] = {"Total domestic Apr-Oct 2026 (Rs crore)": NUM(toks[first - 1]), "Growth on Apr-Oct 2025 % (printed)": float(pct[-1][:-1])}
    if len(toks) >= 17: t4[name].update({"GSTINs, central formations, 31 Oct 2026": NUM(toks[0]), "GSTINs, state formations, 31 Oct 2026": NUM(toks[5])})
if "GRAND TOTAL" not in t4: raise SystemExit("table 4 total not read")
t4 ={norm(k): v for k, v in t4.items()}
grand4 = t4.pop("GRAND TOTAL")
assert grand4["Total domestic Apr-Oct 2026 (Rs crore)"] == 1033411

# ---- our findings from the printed national table (labelled as ours)
d_dom = dom["monthly this year"] - dom["monthly last year"]; d_imp = imp["monthly this year"] - imp["monthly last year"]
y_dom = dom["yearly this year"] - dom["yearly last year"]; y_imp = imp["yearly this year"] - imp["yearly last year"]
ours = {
    "Rise in gross GST, October, from imports (Rs crore)": d_imp, "Rise in gross GST, October, from domestic (Rs crore)": d_dom,
    "Imports' share of the October rise, % (our calculation)": round(d_imp / (d_imp + d_dom) * 100, 1),
    "Imports' share of gross GST, Oct-25, % (our calculation)": round(imp["monthly last year"] / gross["monthly last year"] * 100, 1),
    "Imports' share of gross GST, Oct-26, % (our calculation)": round(imp["monthly this year"] / gross["monthly this year"] * 100, 1),
    "Rise in gross GST, Apr-Oct, from imports (Rs crore)": y_imp, "Rise in gross GST, Apr-Oct, from domestic (Rs crore)": y_dom,
    "Imports' share of the Apr-Oct rise, % (our calculation)": round(y_imp / (y_imp + y_dom) * 100, 1),
    "Imports' share of gross GST, Apr-Oct 2025, % (our calculation)": round(imp["yearly last year"] / gross["yearly last year"] * 100, 1),
    "Imports' share of gross GST, Apr-Oct 2026, % (our calculation)": round(imp["yearly this year"] / gross["yearly this year"] * 100, 1),
}
rank = sorted(((v["Total domestic Apr-Oct 2026 (Rs crore)"], k) for k, v in t4.items() if k not in NOT_STATE), reverse=True)

flat = {}
for st in states3:
    r = {**states3[st]}; r["Growth, Oct-26 over Oct-25, times (our calculation)"] = round(r["Oct-26 (Rs crore)"] / r["Oct-25 (Rs crore)"], 4)
    if r["Oct-25 (Rs crore)"] >= 50: r["Growth %, states over Rs 50 crore in Oct-25 (our calculation, 1 decimal)"] = r["Growth % (our calculation, 1 decimal)"]   # leaves out Lakshadweep (2 to 4), Andaman and Nicobar, Mizoram: tiny bases
    for k, v in t1.get(st, {}).items(): r[f"Settled SGST, Oct: {k}"] = v
    for k, v in t2.get(st, {}).items(): r[f"Settled SGST, Apr-Oct: {k}"] = v
    for k, v in t4.get(st, {}).items(): r[f"Apr-Oct domestic: {k}"] = v
    if "Apr-Oct domestic: GSTINs, central formations, 31 Oct 2026" in r:
        r["GSTINs, both formations added, 31 Oct 2026 (our calculation)"] = r["Apr-Oct domestic: GSTINs, central formations, 31 Oct 2026"] + r["Apr-Oct domestic: GSTINs, state formations, 31 Oct 2026"]
    if "GSTINs, both formations added, 31 Oct 2026 (our calculation)" in r: r["GSTINs, lakh (our calculation, 2 decimals)"] = round(r["GSTINs, both formations added, 31 Oct 2026 (our calculation)"] / 1e5, 2)
    flat[st] = r
cols = list(flat["Maharashtra"])
write("gst/gst_2026_10", {
    "columns": cols, "states_flat_note": "states carries every column the builder may read; the printed Table 3 fields are under their own names",
    "title": "GST: gross and net collections for October 2026, with state tables (GSTN report, provisional)",
    "publisher": "Goods and Services Tax Network (GSTN), for the Ministry of Finance", "url": "https://www.gst.gov.in/newsandupdates/read/680",
    "file": "https://tutorial.gst.gov.in/downloads/news/gst_revenue_report_final_for_publishing_oct_2026.pdf",
    "unit": ["rupees crore (as printed, Indian grouping)"], "release_status": "provisional (the report says the numbers may vary on finalisation)",
    "notes": ["Read 1 Nov 2026 from the PDF the GST portal links under 'Gross and Net GST revenue collections for the month of October, 2026' (posted Nov 1st, 2026).",
              "Domestic GST excludes GST on imports of goods. State figures in Table 3 are domestic collections in the state; Table 1 and 2 are what the state receives after the SGST share of IGST is settled; Table 4 is Apr-Oct domestic by approving authority.",
              "'Other Territory', 'Center Jurisdiction' and 'OIDAR' are rows in the report that are not states. They are kept apart under non_state and are in the totals.",
              "The printed growth percentages are rounded to whole numbers; the 1-decimal growth is our calculation from the printed rupee figures.",
              "Report's own line: 'The above numbers are provisional and the actuals number may have slightly vary on finalisation.'",
              "Compensation cess is no longer collected (phased out Feb 2026 per the brief; not in this report): like-for-like comparison with Oct-25 uses the printed Oct-25 column, which is the same four heads."],
    "national": nat, "national_components": comp, "our_findings": ours,
    "states": flat, "non_state": non3,
    "settled_october": t1, "settled_to_october": t2, "domestic_apr_oct_by_state": t4, "domestic_apr_oct_total": grand4,
    "items": {"gross": {"name": "Total gross GST revenue, Oct-26, Rs crore", "value": gross["monthly this year"]},
              "gross_last": {"name": "Total gross GST revenue, Oct-25, Rs crore", "value": gross["monthly last year"]},
              "net": {"name": "Total net GST revenue, Oct-26, Rs crore", "value": nat["Total Net GST Revenue"]["monthly this year"]},
              "import_igst": {"name": "Gross import GST (IGST), Oct-26, Rs crore", "value": imp["monthly this year"]},
              "domestic_igst": {"name": "Domestic IGST, Oct-26, Rs crore", "value": comp["A.1 IGST"][1]},
              "apr_oct_rank1": {"name": f"Largest state, Apr-Oct 2026 domestic (our rank): {rank[0][1]}", "value": rank[0][0]}},
})
for k in ("A.1 IGST", "A.2 IGST"): assert k in comp, f"component {k} not read"
assert comp["A.1 IGST"][1] == 64769 and comp["A.2 IGST"][1] == 72246

# ------------------------------------------------------------------ September report: the national table, for month on month
nat9, comp9 = national(text(f"{RAW}/sep.pdf"))
assert nat9["Total Gross GST Revenue"]["monthly this year"] == 203521
write("gst/gst_2026_09", {
    "title": "GST: gross and net collections for September 2026 (GSTN report, provisional): national table",
    "publisher": "Goods and Services Tax Network (GSTN), for the Ministry of Finance", "url": "https://www.gst.gov.in/newsandupdates/read/673",
    "file": "https://tutorial.gst.gov.in/downloads/news/final_gst_revenue_report_for_publishing_monthly_sep_2026.pdf",
    "unit": ["rupees crore"], "release_status": "provisional",
    "notes": ["Read 1 Nov 2026. October's report is the later edition; the September figure here is as first printed (a later release may have revised it)."],
    "national": nat9, "national_components": comp9})

# ------------------------------------------------------------------ NPCI snapshot
N = json.load(open(f"{RAW}/npci.json"))
mon = {r["month"]: {"Banks live": NUM(r["banks"]), "Volume (mn)": float(r["volume"].replace(",", "")), "Value (Rs crore)": float(r["value"].replace(",", ""))} for r in N["monthly"]}
day = {r["day"]: {"Volume (mn)": float(r["volume"].replace(",", "")), "Value (Rs crore)": float(r["value"].replace(",", ""))} for r in N["daily"]}
assert len(mon) == 6 and len(day) == 10
write("npci/upi_monthly_daily_2026", {
    "title": "UPI product statistics: monthly volume and value, April to September 2026, and daily, 1 to 10 October 2026",
    "publisher": "National Payments Corporation of India (npci.org.in/product/upi/product-statistics)", "url": "https://www.npci.org.in/product/upi/product-statistics",
    "unit": ["million transactions", "rupees crore"],
    "notes": ["Read 1 Nov 2026 in a browser (the page refuses plain fetches). Monthly table: 2026-27, April to September; October is NOT on the page yet. Daily table (October 2026): the page lists only 1 to 10 October.",
              "Press reports of 1 Nov quote 25.47 billion transactions and Rs 31.53 lakh crore for October. Those are not on NPCI's page at the time of this read: UNVERIFIED here until NPCI's monthly table shows October.",
              "NPCI's page note: data in crores or millions, day wise or month wise, adjusted to the nearest 2 decimals; daily and monthly sums may differ slightly from the absolute monthly or yearly figures.",
              "'This data excludes the transactions having debit/credit to the same account for the month of August 2018 onwards' (page footnote)."],
    "monthly": mon, "daily_october_2026": day,
    "our_findings": {"Average per day, 1-10 Oct 2026, volume (mn) (our calculation)": round(sum(v["Volume (mn)"] for v in day.values()) / 10, 2),
                     "Average per day, 1-10 Oct 2026, value (Rs crore) (our calculation)": round(sum(v["Value (Rs crore)"] for v in day.values()) / 10, 2),
                     "Average per day, September 2026, value (Rs crore) (our calculation: month value / 30)": round(mon["September-2026"]["Value (Rs crore)"] / 30, 2)}})

os.makedirs(f"{SRC}/gst/raw", exist_ok=True)
shutil.copy(oct_pdf, f"{SRC}/gst/raw/gst_revenue_report_2026_10.pdf"); shutil.copy(f"{RAW}/sep.pdf", f"{SRC}/gst/raw/gst_revenue_report_2026_09.pdf")
print("states in Table 3:", len(states3), "| Table 1:", len(t1), "| Table 2:", len(t2), "| Table 4:", len(t4))

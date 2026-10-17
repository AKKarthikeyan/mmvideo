#!/usr/bin/env python3
"""Data Kadai festive money Shorts (Oct-Nov 2026): the source tables, from the reads of 17 Oct 2026.

Input: the raw reads in research/2026-10-17/shorts/raw/ (each saved by a reader with every figure as printed, the URL and the date):
  jandhan.json      PMJDY portal: state-wise accounts and balances, and the national progress report, as on 07/10/2026
  muhurat.json      NSE and BSE index closes on each Diwali Muhurat session 2015-2025 and the session before, with BSE's notice for each year
  upi_diwali.json   NPCI UPI daily statistics (Oct 2022, Nov 2023, Oct and Nov 2024, Oct 2025) and the official greetings that date Dhanteras and Diwali
  forgotten.json    RBI Annual Report 2025-26 and PIB (Finance) on unclaimed deposits, the DEA Fund and the 'Your Money, Your Right' campaign
Output under public/datayt/sources/ (git-ignored): the tables the Shorts read with {"item": [path, code, column], "item_name": ...} and {"tbl": ...}.
Every derived figure (an average, a rank, a percentage change) is computed here from the printed figures and labelled as ours.
Usage (repo root): python3 scripts/datayt/money_sources.py <raw folder>
"""
import datetime, json, os, re, sys
RAW = sys.argv[1]; SRC = "public/datayt/sources"
J = lambda f: json.load(open(os.path.join(RAW, f)))


def write(path, obj):
    os.makedirs(os.path.dirname(f"{SRC}/{path}"), exist_ok=True)
    json.dump(obj, open(f"{SRC}/{path}.json", "w"), ensure_ascii=False, indent=1); print("wrote", f"{SRC}/{path}.json")


def item(name, value, **kw):
    return {"name": name, "value": value, **kw}


# ---------------------------------------------------------------- Jan Dhan: every state, and the national report
D = J("jandhan.json"); st_page, nat_page, pib = D["pages"][0], D["pages"][1], D["pages"][2]
GEO = {"Andaman And Nicobar Islands": "Andaman and Nicobar Islands", "Jammu And Kashmir": "Jammu and Kashmir", "Delhi": "NCT of Delhi",
       "Dadra And Nagar Haveli And Daman And Diu": "Dadra & Nagar Haveli and Daman & Diu", "The Dadra And Nagar Haveli And Daman And Diu": "Dadra & Nagar Haveli and Daman & Diu"}
title = lambda s: " ".join(w if w in ("and", "And") else w for w in s.split())
states = {}
for r in st_page["rows"]:
    n = r["num"]; nm = "India" if r["state"].strip().lower() == "total" else GEO.get(r["state"].strip(), r["state"].strip())
    states[nm] = {"Beneficiaries": n["total_beneficiaries"], "Balance (Rs crore)": n["balance_crore"], "Rural and semi-urban": n["rural_semi_urban"],
                  "Urban and metro": n["urban_metro"], "RuPay cards": n["rupay_cards"],
                  "Average balance per account (Rs, our calculation)": round(n["balance_crore"] * 1e7 / n["total_beneficiaries"], 2)}
tot = states["India"]
assert tot["Beneficiaries"] == 595422978 and tot["Balance (Rs crore)"] == 320947.17, "the Total row moved"
assert sum(v["Beneficiaries"] for k, v in states.items() if k != "India") == tot["Beneficiaries"], "the state rows do not add up to the Total"
grand = next(r for r in nat_page["rows"] if "Total" in r["bank_type"])
f = lambda x: float(x.replace(",", ""))
rank = sorted(((v["Average balance per account (Rs, our calculation)"], k) for k, v in states.items() if k != "India"), reverse=True)
assert rank[0][1] == "Lakshadweep" and rank[-1][1] == "Manipur", "the highest or lowest average moved"
write("pmjdy/jandhan_2026_10_07", {
    "title": "Pradhan Mantri Jan Dhan Yojana: accounts and balances by state and union territory, as on 07/10/2026",
    "publisher": "Department of Financial Services, Ministry of Finance (pmjdy.gov.in)", "url": st_page["url"],
    "unit": ["accounts (beneficiaries), rupees crore, rupees"],
    "columns": list(tot),
    "notes": [f"State table: '{st_page['title']}'; national report: '{nat_page['title']}', {nat_page['as_on']}. Read 17 Oct 2026.",
              "The portal calls account holders 'beneficiaries'. The average balance is the state's balance divided by its accounts: our calculation, and it includes accounts with no balance.",
              f"The state balances add up to {sum(v['Balance (Rs crore)'] for k, v in states.items() if k != 'India'):,.2f} crore against the printed total of 3,20,947.17 (rounding); the printed total is used.",
              f"Highest average: {rank[0][1]} {rank[0][0]:,.0f}; lowest: {rank[-1][1]} {rank[-1][0]:,.0f}."],
    "states": states,
    "items": {"accounts": item("Jan Dhan accounts, crore", f(grand["total_beneficiaries"])), "deposits": item("Deposits in Jan Dhan accounts, Rs crore", f(grand["deposits_in_accounts_crore"])),
              "deposits_lakh": item("Deposits in Jan Dhan accounts, Rs lakh crore (the printed Rs crore divided by 1,00,000)", round(f(grand["deposits_in_accounts_crore"]) / 1e5, 6)),
              "female": item("Women account holders, crore", f(grand["female"])), "rupay": item("RuPay cards, crore", f(grand["rupay_cards"])),
              "rural": item("Rural and semi-urban accounts, crore", f(grand["rural_semi_urban"])),
              "avg_india": item("Average balance per account, all India, Rs (our calculation)", tot["Average balance per account (Rs, our calculation)"]),
              **{f"avg_{k}": item(f"Average balance per account, {k}, Rs (our calculation)", v["Average balance per account (Rs, our calculation)"]) for k, v in states.items() if k != "India"},
              **{f"accounts_{k}": item(f"Jan Dhan accounts, {k}", v["Beneficiaries"]) for k, v in states.items() if k != "India"}},
    "text": {"pib_2025": " ".join(pib["sentences"])}})

# ---------------------------------------------------------------- Muhurat trading: eleven Diwali sessions
M = J("muhurat.json"); items = {}
for s in M["sessions"]:
    n, x = s["nifty50"], s["sensex"]
    items[str(s["year"])] = {"name": f"Muhurat {s['year']}", "date": s["muhurat_date"], "weekday": s["weekday"],
                             "nifty close": n["close_num"], "nifty previous close": n["prev_close_num"], "nifty change %": round((n["close_num"] / n["prev_close_num"] - 1) * 100, 4),
                             "sensex close": x["close_num"], "sensex previous close": x["prev_close_num"], "sensex change %": round((x["close_num"] / x["prev_close_num"] - 1) * 100, 4),
                             "bse notice": f"{s['bse_notice']['notice_no']} ({s['bse_notice']['notice_date']}): {s['bse_notice']['subject']} Date in notice: {s['bse_notice']['date_stated_in_notice']}",
                             "continuous trading": s["bse_notice"]["session_windows_as_printed"].get("continuous_trading", "")}
    assert abs(items[str(s["year"])]["nifty change %"] - n["change_pct_derived"]) < 0.01, s["year"]
assert len(items) == 11 and sum(v["nifty change %"] > 0 for v in items.values()) == 9 and sum(v["sensex change %"] > 0 for v in items.values()) == 9
c16 = M["close_16_oct_2026"]
write("markets/muhurat_2015_2025", {
    "title": "Diwali Muhurat trading sessions, 2015 to 2025: Nifty 50 and Sensex closes, and the change from the session before",
    "publisher": "NSE (index history) and BSE (index archive, Muhurat notices)",
    "notes": ["Closes as printed by the exchanges' index data, read 17 Oct 2026. The change in per cent is our calculation from the two closes.",
              "Each date is the date printed in BSE's Muhurat notice for that year (HTML notices at bseindia.com); NSE's circulars are PDFs and were not opened.",
              "The Muhurat session is about an hour of trading; the change is against the previous trading session's close.",
              f"16 Oct 2026: Nifty 50 {c16['nifty50']['close']}, Sensex {c16['sensex']['close']}."],
    "items": items, "text": {"nse_2026": M["nse_holidays_2026"]["sentences"][0], "timing_2026": M["timing_circular_2026"]["nse"]}})

# ---------------------------------------------------------------- UPI around Dhanteras and Diwali
U = J("upi_diwali.json"); rows = {}
for p in U["pages"]:
    for r in p.get("rows") or []:
        if isinstance(r, dict) and "day" in r and "otal" not in r["day"]:
            d = datetime.datetime.strptime(r["day"], "%B %d, %Y").date(); rows[d] = (r["volume_mn"], r["value_cr"], r["volume_mn_printed"], r["value_cr_printed"])
greet = {p["title"] + " " + p["as_on"]: p for p in U["pages"] if "rows" not in p}
DAYS = {"dhanteras 2023": "2023-11-10", "diwali 2023": "2023-11-12", "dhanteras 2024": "2024-10-29", "diwali 2024": "2024-10-31", "dhanteras 2025": "2025-10-18", "diwali 2025": "2025-10-20"}
WHO = {"dhanteras 2023": "PIB PRID 1976047, 10 NOV 2023 (PM greets the nation on Dhanteras)", "diwali 2023": "pmindia.gov.in, 12 Nov 2023 (PM conveys Diwali wishes)",
       "dhanteras 2024": "PIB PRID 2069064, 29 OCT 2024", "diwali 2024": "pmindia.gov.in, 31 Oct 2024", "dhanteras 2025": "PIB PRID 2180621, 18 OCT 2025", "diwali 2025": "PIB PRID 2180946, 20 OCT 2025"}
items = {}
for k, ds in DAYS.items():
    d = datetime.date.fromisoformat(ds); m = {x: v for x, v in rows.items() if (x.year, x.month) == (d.year, d.month)}
    vol, val = rows[d][0], rows[d][1]
    items[k] = {"name": f"UPI on {k.title()}", "date": ds, "weekday": d.strftime("%A"), "dated by": WHO[k],
                "volume mn": vol, "value cr": val, "volume printed": rows[d][2], "value printed": rows[d][3],
                "volume rank in month (1 = most)": 1 + sum(v[0] > vol for v in m.values()), "value rank in month (1 = most)": 1 + sum(v[1] > val for v in m.values()),
                "days in month": len(m), "month average volume mn": round(sum(v[0] for v in m.values()) / len(m), 3), "month average value cr": round(sum(v[1] for v in m.values()) / len(m), 2)}
for y in ("2023", "2024", "2025"):
    a, b = items[f"dhanteras {y}"], items[f"diwali {y}"]
    items[f"change {y}"] = {"name": f"UPI value, Diwali against Dhanteras {y}, % (our calculation)", "value": round((b["value cr"] / a["value cr"] - 1) * 100, 2)}
    items[f"top2 {y}"] = {"name": f"Dhanteras {y} in the top two days of its month by number of payments", "value": float(a["volume rank in month (1 = most)"] <= 2)}
assert items["dhanteras 2025"]["volume rank in month (1 = most)"] == 1 and items["dhanteras 2025"]["volume mn"] == 754.37
write("npci/upi_festive_days_2023_2025", {
    "title": "UPI on Dhanteras and Diwali, 2023 to 2025: payments and value on the day, and the day's place in its month",
    "publisher": "NPCI (UPI product statistics, daily); dates from the President's and the Prime Minister's greetings (PIB, pmindia.gov.in)",
    "url": "https://www.npci.org.in/product/upi/product-statistics",
    "notes": ["Daily volume in million and value in rupees crore as the page prints them (two decimals), read 17 Oct 2026 from the page's own data.",
              "Ranks, month averages and changes are our calculation from every day of the month.",
              "2022 is left out: no official page dates Dhanteras 2022 (the Ayush ministry dates Dhanvantari Jayanti to 23 Oct 2022).",
              "Diwali 2024 is dated 31 Oct by the government's greetings; the exchanges held Muhurat trading on 1 Nov 2024. Diwali 2025 is dated 20 Oct by PIB; the exchanges' holiday was 21 Oct.",
              "NPCI's page note: " + next(p["page_disclaimer"] for p in U["pages"] if p.get("page_disclaimer"))],
    "items": items})

# ---------------------------------------------------------------- unclaimed money: the DEA Fund and the campaign
F = J("forgotten.json"); P = {p["url"]: p for p in F["pages"]}
bs = P["https://www.rbi.org.in/Scripts/AnnualReportPublications.aspx?Id=1472"]["rows"][0]
camp = P["https://www.rbi.org.in/Scripts/AnnualReportPublications.aspx?Id=1464"]["rows"][0]
pibp = next(p for u, p in P.items() if "2244475" in u); pr = {r["item"]: r for r in pibp["rows"]}
sent = [s for p in F["pages"] for s in (p.get("sentences") or [])]
find = lambda w: next(s for s in sent if w in s)
text = {"no_time_limit": find("no time limit"), "udgam": find("UDGAM refers to"), "ten_years": find("not been operated upon for a period of 10 years"),
        "restituted": find("restituted"), "campaign": find("IV.12"), "definition": find("are classified as"), "portals": find("Bima Bharosa")}
nums = {"5777": "₹5,777 crore", "22.95": "22.95 lakh claims", "2876": "₹2,876 crore"}
assert "10 years" in text["ten_years"] and "5,777 crore" in text["restituted"] and "22.95 lakh" in text["restituted"] and "2,876 crore" in text["campaign"]
pv = lambda key: next(r["value_crore"] for k, r in pr.items() if key in k.lower())
write("rbi/unclaimed_2026", {
    "title": "Unclaimed money: the RBI's Depositor Education and Awareness Fund, and the 'Your Money, Your Right' campaign of October-December 2025",
    "publisher": "Reserve Bank of India (Annual Report 2025-26); Ministry of Finance via PIB (PRID 2244475, 24 Mar 2026)",
    "notes": ["Read 17 Oct 2026 in a browser. The DEA Fund figure is the line on the RBI's balance sheet (Schedule 2, Deposits, Others). The PSB figure (Rs 60,518 crore) is only what public sector banks transferred; it is a different measure.",
              "The Rs 2,876 crore is bank deposits settled by public sector and regional rural banks during the campaign (RBI); the Rs 5,777 crore is all unclaimed financial assets returned (banks, insurance, mutual funds) as on 28 Feb 2026 (PIB).",
              "No newer official figure (Apr-Oct 2026) was found on rbi.org.in or pib.gov.in on 17 Oct 2026."],
    "items": {"dea_2026": item("DEA Fund, 31 Mar 2026, Rs crore", bs["value_2026"]), "dea_2025": item("DEA Fund, 31 Mar 2025, Rs crore", bs["value_2025"]),
              "dea_rise_pct": item("DEA Fund, rise in a year, % (our calculation)", round((bs["value_2026"] / bs["value_2025"] - 1) * 100, 2)),
              "campaign_settled": item("Unclaimed deposits settled by PSBs and RRBs in the campaign, Rs crore", camp["value_crore"]),
              "returned": item("Unclaimed financial assets returned, as on 28 Feb 2026, Rs crore", 5777.0), "claims_lakh": item("Claims settled, lakh, as on 28 Feb 2026", 22.95),
              "insurance": item("Unclaimed insurance with insurers, 28 Feb 2026, Rs crore", pv("insurance")), "mutual_funds": item("Unclaimed amounts in mutual funds, 28 Feb 2026, Rs crore", pv("mutual")),
              "psb": item("Unclaimed amount transferred by PSBs to the DEA Fund, 31 Jan 2026, Rs crore", pv("psb")),
              "dormant_years": item("Years an account goes without operation before its balance goes to the DEA Fund", 10.0)},
    "text": text})

# ---------------------------------------------------------------- the gift rules: Income Tax Department pages, Income-tax Act, 2025 and Income-tax Rules, 2026
G = J("gifts.json"); pages = G["pages"]
gp = next(p for p in pages if "tax-treatment-of-gifts" in p["url"]); act = next(p for p in pages if "vis-a-vis-income-tax-act-2025" in p["url"])
rule = next(p for p in pages if "Rule 15" in p["title"]); th = next(p for p in pages if "threshold-limits" in p["url"])
S = lambda p: [x.get("text") or "; ".join(x.get("list", [])) for x in p["sentences"]]
gs, acts = S(gp), {x["section"]: x["text"] for x in act["sentences"]}
pick = lambda lst, w: next(s for s in lst if w in s)
text = {"whole": pick(gs, "the total amount of gifts, not the amount in excess"), "example": pick(gs, "the entire amount of Rs. 53,000"),
        "marriage": pick(gs, "Apart from marriage, there is no other occasion"), "relatives": pick(gs, "Gifts received from relatives are not charged to tax"),
        "friends": pick(gs, "A friend is not a 'relative'"), "tv": pick(gs, "television set"), "jewellery": pick(gs, "Prescribed movable property means"),
        "act_2025": G["act_in_force_note"],
        "s92": next(v for k, v in acts.items() if "92(2)(m)(i)" in k), "s186": next(v for k, v in acts.items() if "186" in k), "s451": next(v for k, v in acts.items() if "451" in k),
        "employer": next(x["text"] for x in rule["sentences"] if "Rs. 15,000" in x["text"]),
        "old_employer": next(r["threshold"] for r in th["rows"] if "employer" in r["particulars"])}
for k, w in {"s92": "exceeds Rs. 50000, the whole of such sum", "example": "Rs. 53,000 (Rs. 25,000 + Rs. 28,000)", "employer": "below Rs. 15,000 in aggregate during the tax year",
             "s186": "Rs. 200000 or more", "s451": "a penalty equal to the sum received", "marriage": "monetary gifts received on occasions such as birthdays, anniversaries, etc. will be subject to tax"}.items():
    assert w in text[k], f"gifts: '{w}' is not in {k}"
write("incometax/gift_rules_2026", {
    "title": "Gifts and cash under the Income-tax Act, 2025 (tax year 2026-27): the Income Tax Department's own pages",
    "publisher": "Income Tax Department (incometaxindia.gov.in)",
    "notes": ["Read 17 Oct 2026 in a browser. The gifts page says it contains the provisions of the Income-tax Act, 2025, as amended by the Finance Act, 2026; the Act's sections were read in the department's own 1961-to-2025 correspondence viewer.",
              "Employer gifts: the Income-tax Rules, 2026 (rule 15(5)(a), Table IV, item 4) set the nil value below Rs 15,000 a year; the department's older threshold page, framed under the 1961 Act, still shows Rs 5,000 'if received in kind'.",
              "These are the department's rules as printed, not advice on any one person's tax."],
    "items": {"limit": item("Gifts from non-relatives in a tax year: taxed in full above, Rs", 50000.0), "ex_a": item("Department's example: first gift, Rs", 25000.0),
              "ex_b": item("Department's example: second gift, Rs", 28000.0), "ex_total": item("Department's example: total, all taxed, Rs", 53000.0),
              "employer": item("Employer gift, voucher or token: nil value below this in a tax year, Rs", 15000.0), "employer_old": item("Older page, 1961 Act framing: employer gift in kind, Rs", 5000.0),
              "cash": item("Cash: no one may receive this much or more from a person in a day, Rs", 200000.0)},
    "text": text})

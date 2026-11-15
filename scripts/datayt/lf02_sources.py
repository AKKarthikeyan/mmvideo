#!/usr/bin/env python3
"""Data Kadai long-form 02 (festival season in numbers): the source tables, read on 17 Oct 2026.

Input: the raw reads in research/2026-10-17/lf02/raw/:
  doca.html                       Department of Consumer Affairs, daily average retail prices (fcainfoweb.nic.in/Reports/DB/DBprices.aspx), page as served
  nddb_pc.html, nddb_prod.html    NDDB: per capita availability of milk by state, and milk production in India (nddb.coop), pages as served
  metro_5318.html, metro_5342.html  Metro Railway Kolkata press releases of 28 Sep and 3 Oct 2025, pages as served
  rbi_currency.json               RBI Bulletin sentences on currency in circulation (Sep 2026, Nov 2025), read in a browser
  rbi_holiday_matrix_2026_10.json the RBI Holiday Matrix for October 2026, read in a browser (marked dates per office)
  pib_2323256_plb.json            Cabinet, the railway bonus, PIB 14 Oct 2026, read in a browser
  checks_vahan_indiapost.json     VAHAN dashboard and India Post holiday list as read on 17 Oct 2026 by a researcher and confirmed by a second reader
Output under public/datayt/sources/ (git-ignored), read by build_long.py with {"breakdown": [path, section, key, field]} or {"tbl": ...}.
Every number typed into "facts" is tested against the sentence it came from, so a typing slip stops this script.
Usage (repo root): python3 scripts/datayt/lf02_sources.py <raw folder>
"""
import html, json, os, re, sys
RAW = sys.argv[1]; SRC = "public/datayt/sources"
J = lambda f: json.load(open(os.path.join(RAW, f)))
H = lambda f: open(os.path.join(RAW, f), encoding="utf-8", errors="ignore").read()
cell = lambda s: html.unescape(re.sub(r"<[^>]+>", " ", s)).replace("\xa0", " ").strip()
cell = (lambda c: lambda s: re.sub(r"\s+", " ", c(s)))(cell)


def write(path, obj):
    os.makedirs(os.path.dirname(f"{SRC}/{path}"), exist_ok=True)
    json.dump(obj, open(f"{SRC}/{path}.json", "w"), ensure_ascii=False, indent=1); print("wrote", f"{SRC}/{path}.json")


def rows(page):
    """Every table row of a page as a list of cell texts."""
    return [[cell(c) for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, re.S)] for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", page, re.S)]


def checked(facts, text):
    """{key: {field: (value, sentence key, words as printed)}}: the words must be in the sentence and must print the value."""
    out = {}
    for k, f in facts.items():
        out[k] = {}
        for field, (v, key, words) in f.items():
            assert words in text[key], f"{k}.{field}: '{words}' is not in the sentence '{key}'"
            assert str(v).rstrip("0").rstrip(".") in words.replace(",", "") or f"{v:.2f}" in words, f"{k}.{field}: {v} is not printed in '{words}'"
            out[k][field] = v
        out[k]["from"] = sorted({key for _, key, _ in f.values()})
    return out


# ---------------------------------------------------------------- Consumer Affairs: the daily all-India average retail prices
page = H("doca.html"); R = rows(page)
date = re.search(r"Date:\s*(\d\d/\d\d/\d{4})", cell(page)).group(1)
head = next(r for r in R if r[:1] == ["Price As On"] or "Price As On" in r)
when = next(r for r in R if r and r[0] == date)      # the row of dates under the column names
cols = ["today", "1 week back", "1 month back", "6 months back", "1 year back", "2 years back"]
items = {}
for r in R:
    if len(r) == 8 and r[1] and re.match(r"\d", r[2]):
        name, unit = r[0], r[1]; vals = {}
        for c, d, x in zip(cols, when, r[2:]):
            m = re.match(r"([\d.]+)(?:\s*\((-?[\d.]+)\))?", x)
            vals[c] = float(m.group(1)) if m else None
            vals[c + " date"] = d
            if m and m.group(2) is not None: vals[c + " change %"] = float(m.group(2))
        items[name] = {"unit": unit, **vals}
assert date == "16/10/2026" and items["Onion"]["today"] == 52.7 and items["Onion"]["1 year back"] == 26.88 and items["Sugar"]["1 year back change %"] == 24.08
for k in ("Onion", "Sugar", "Gur", "Desi Ghee", "Mustard Oil (Packed)", "Tur/Arhar Dal", "Tomato", "Potato", "Milk (₹/ltr)"):
    it = items[k]
    for c in ("1 year back", "2 years back"):      # the page's bracketed figure is the change of today's price over the earlier one, in per cent
        if it.get(c) and it.get(c + " change %") is not None:
            assert abs((it["today"] / it[c] - 1) * 100 - it[c + " change %"]) < 0.006, f"{k} {c}: the bracket is not the change in per cent"
write("consumer_affairs/daily_prices_2026_10_16", {
    "title": "Department of Consumer Affairs (Price Monitoring Division): daily all-India average retail prices of essential commodities, 16 Oct 2026, with one week, one month, six months, one year and two years back",
    "publisher": "Ministry of Consumer Affairs, Food and Public Distribution (Department of Consumer Affairs)",
    "url": "https://fcainfoweb.nic.in/Reports/DB/DBprices.aspx",
    "notes": [f"Page dated {date}, read 17 Oct 2026. Prices in rupees per unit as printed (kg unless the unit says otherwise; milk per litre). Source line on the page: State Civil Supplies Departments.",
              "The page prints each earlier price with a bracketed figure; it is the change of today's price over that price, in per cent (tested here for every item used)."],
    "items": items})

# ---------------------------------------------------------------- NDDB: milk available per person per day, by state, and all India
R = rows(H("nddb_pc.html"))
top = next(r for r in R if r and r[0] == "State")
years = ["20" + y.split("-")[0] + "-" + y.split("-")[1] for y in top[1:]]      # 09-10 -> 2009-10
assert years[-1] == "2023-24" and years[0] == "2009-10", years
GEO = {"All India": "India", "Jammu & Kashmir": "Jammu and Kashmir", "Delhi": "NCT of Delhi", "Andaman & Nicobar Islands": "Andaman and Nicobar Islands", "A & N Islands": "Andaman and Nicobar Islands", "A&N Islands": "Andaman and Nicobar Islands"}
states = {}
for r in R:
    if r and r[0] not in ("State",) and len(r) == len(top):
        nm = GEO.get(r[0], r[0]); v = {y: (float(x.replace(",", "")) if re.match(r"^[\d,.]+$", x) else None) for y, x in zip(years, r[1:])}
        states[nm] = v
dnh = states.pop("Dadra & Nagar Haveli")      # the row is Dadra and Nagar Haveli alone; the map's territory is the merged Dadra & Nagar Haveli and Daman & Diu, so it stays off the map
assert states["India"]["2023-24"] == 471 and states["Punjab"]["2023-24"] == 1245 and states["Mizoram"]["2023-24"] == 56, "NDDB rows moved"
P = rows(H("nddb_prod.html")); unit_row = next(r for r in P if any("gms/day" in c for c in r))
prod = {r[0]: {"production million tonnes": float(r[1]), "per capita gms/day": float(r[2])} for r in P if len(r) == 3 and re.match(r"\d{4}-", r[0])}
assert prod["2023-24"]["per capita gms/day"] == states["India"]["2023-24"], "the two NDDB pages disagree on the all-India figure"
write("nddb/milk_percapita_states", {
    "title": "Per capita availability of milk by states and union territories, 2009-10 to 2023-24 (grams per day)",
    "publisher": "National Dairy Development Board, from Basic Animal Husbandry Statistics (Department of Animal Husbandry and Dairying)",
    "url": "https://www.nddb.coop/information/stats/percapitavail",
    "unit": ["grams per person per day"],
    "columns": years,
    "notes": ["Read 17 Oct 2026. The state page prints no unit; NDDB's 'Milk Production in India' page prints the same all-India series as 'Per Capita Availibilty (gms/day)' (471 for 2023-24), tested here.",
              "Availability is the milk produced in a state divided by its population. It is not consumption: milk moves between states.",
              "Rows as printed: " + ", ".join(r for r in states) + ", Dadra & Nagar Haveli.",
              f"Dadra & Nagar Haveli alone ({dnh['2023-24']:g} in 2023-24) is left out: the map draws the merged territory with Daman & Diu, and the page has no Daman & Diu figure for 2023-24."],
    "states": states, "items": prod})

# ---------------------------------------------------------------- Metro Railway Kolkata, Durga Puja 2025
t1 = cell(H("metro_5318.html")).replace("\xad", ""); t2 = cell(H("metro_5342.html")).replace("\xad", "")
grab = lambda t, a: re.search(re.escape(a) + r".*?\.(?=\s+[A-Z]|$)", t).group(0).replace("\xad", "")      # a sentence ends at a full stop before a capital (9.82 has a point in it)
text = {"record": grab(t1, "Metro Railway,Kolkata has set a new record"), "record_2": grab(t1, "More than 9.82 lakh passengers have travelled"),
        "previous": grab(t1, "The previous highest daily passenger count"), "total": grab(t2, "From Panchami to Dashami of this Durga Puja"),
        "last_year": grab(t2, "In the last year,"), "puja_high": grab(t2, "The previous highest passenger count in Puja")}
facts = checked({
    "panchami 2025": {"lakh": (9.82, "record_2", "More than 9.82 lakh passengers")},
    "previous record": {"lakh": (9.61, "previous", "9.61 lakh")},
    "puja 2025": {"lakh": (46.56, "total", "46.56 lakh passengers")},
    "puja 2024": {"lakh": (41.15, "last_year", "41.15 lakh passengers")},
    "puja 2019": {"lakh": (45.61, "puja_high", "45.61 lakh in 2019")}}, text)
write("metro_kolkata/puja_2025", {
    "title": "Metro Railway, Kolkata: passengers on the Durga Puja days, 2025 (press releases of 28 Sep and 3 Oct 2025)",
    "publisher": "Metro Railway, Kolkata (Indian Railways)",
    "notes": ["https://mtp.indianrailways.gov.in/view_detail.jsp?lang=0&id=0,4,268&dcd=5318 (28 Sep 2025) and dcd=5342 (3 Oct 2025); read 17 Oct 2026.",
              "Counts as reported by Metro Railway. The press list showed no 2026 Puja ridership release on 17 Oct 2026."],
    "facts": facts, "text": text})

# ---------------------------------------------------------------- RBI: currency in circulation
C = J("rbi_currency.json"); s9, s11 = C["sep2026"]["sentences"], C["nov2025"]["sentences"]
text = {"sep": s9[1], "five_years": s9[0], "nov": s11[2], "festive": s11[1]}
facts = checked({"growth": {"15 Sep 2026": (13.2, "sep", "to 13.2 per cent (y-o-y) as on September 15, 2026"), "15 Aug 2026": (12.4, "sep", "from 12.4 per cent as on August 15, 2026"),
                            "17 Oct 2025": (8.8, "nov", "8.8 per cent (y-o-y) as on October 17, 2025"), "14 Nov 2025": (8.1, "nov", "8.1 per cent (y-o-y) as on November 14, 2025")}}, text)
write("rbi/currency_2026_09", {
    "title": "Reserve Bank of India: growth in currency in circulation, year on year (RBI Bulletin, State of the Economy, September 2026 and November 2025)",
    "publisher": "Reserve Bank of India",
    "notes": [f"{C['sep2026']['url']} and {C['nov2025']['url']}; read 17 Oct 2026. {C['latest_bulletin_on_list']}.",
              "'text' holds the sentences as printed (footnote numbers dropped); the RBI gives growth rates here, not rupee levels."],
    "facts": facts, "text": text})

# ---------------------------------------------------------------- RBI: bank holidays by office, October 2026
M = J("rbi_holiday_matrix_2026_10.json")
write("rbi/holiday_matrix_2026_10", {
    "title": M["title"], "publisher": "Reserve Bank of India", "url": M["url"],
    "notes": [f"Read {M['read']}."] + M["notes"],
    "items": {o: {"holidays": len(d), "dates": ", ".join(f"{x} Oct" for x in d)} for o, d in M["rows"].items()},
    "facts": {"offices": {"count": len(M["rows"])}}})

# ---------------------------------------------------------------- Cabinet: the railway bonus
P2 = J("pib_2323256_plb.json"); text = P2["paras"]
facts = checked({"plb": {"crore": (2009.61, "approval", "Rs.2009.61 crore"), "employees": (1140770, "approval", "11,40,770 railway employees"),
                         "days": (78, "approval", "PLB of 78 days"), "max rupees": (17951, "max", "Rs.17,951/-"), "lakh staff": (11.40, "timing", "about 11.40 lakh")}}, text)
write("pib/plb_2026_10", {
    "title": "Cabinet: Productivity Linked Bonus of 78 days for railway employees, 14 Oct 2026",
    "publisher": "Press Information Bureau (Cabinet)", "url": P2["url"],
    "notes": [f"Posted {P2['posted']}; read {P2['read']}."], "facts": facts, "text": text})

# ---------------------------------------------------------------- VAHAN and India Post: read by a researcher on 17 Oct 2026 and confirmed by a second reader
K = J("checks_vahan_indiapost.json"); seen = " ".join(k["seen"] for k in K)
text = {"vahan": " ".join(k["seen"] for k in K if "parivahan" in k["seen"].lower() or k["title"].startswith("Vahan")),
        "post": " ".join(k["seen"] + " " + k.get("note", "") for k in K if "India Post" in k["title"])}
vahan = checked({"Oct 2024": {"vehicles": (2931894, "vahan", "2024-October 29,31,894")}, "Sep 2025": {"vehicles": (1930637, "vahan", "2025-September 19,30,637")},
                 "Oct 2025": {"vehicles": (4170198, "vahan", "2025-October 41,70,198")}, "Nov 2025": {"vehicles": (3451254, "vahan", "2025-November 34,51,254")},
                 "Sep 2026": {"vehicles": (2567144, "vahan", "2026-September 25,67,144")}, "Oct 2026 to 17 Oct": {"vehicles": (1171371, "vahan", "2026-October 11,71,371")}}, text)
write("vahan/monthly_registrations_2026_10", {
    "title": "VAHAN public dashboard: vehicles registered in India, all classes, by month (selected months)",
    "publisher": "Ministry of Road Transport and Highways (Parivahan)", "url": "https://analytics.parivahan.gov.in/analytics/publicdashboard/vahan",
    "notes": ["Read 17 Oct 2026 in a browser (the dashboard is drawn by JavaScript and prints no as-on date); a second reader confirmed every figure the same day.",
              "October 2026 is a part month (to about 17 Oct) and still rising. The dashboard's own growth column is month on month and is not used."],
    "items": vahan, "text": text})
circles = ["Arunachal Pradesh", "Himachal Pradesh", "Jharkhand", "Kerala", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Sikkim", "Tamil Nadu", "Tripura", "West Bengal"]
assert all(c in text["post"] for c in circles) and "13 tabs show a 19-October-2026 Monday holiday" in text["post"] and "31 circle tabs" in text["post"]
for w in ("Dussehra (Vijay Dashmi) 20-October-2026 Tuesday", "Diwali (Deepavali) 08-November-2026 Sunday", "Guru Nanak's Birthday 24-November-2026 Tuesday",
          "Chhath Puja (Usha Arghya) 16-November-2026 Monday", "All India tab has 14 data rows. Sunday: Diwali only."):
    assert w in text["post"], w
write("indiapost/holidays_2026", {
    "title": "Department of Posts: holidays list 2026, All India and circle tabs", "publisher": "Department of Posts, Ministry of Communications",
    "url": "https://www.indiapost.gov.in/holidays-list",
    "notes": ["Read 17 Oct 2026 in a browser by a researcher, every circle tab re-read by a second reader. These are post office holidays, not state or bank holidays.",
              "Circles with Monday 19 Oct 2026 listed: " + ", ".join(circles) + "."],
    "facts": {"all india": {"holidays": 14, "on a Sunday": 1}, "circles": {"tabs": 31, "Monday 19 Oct": len(circles)}},
    "text": text})

# ---------------------------------------------------------------- the dates of Diwali and Dhanteras in past years: the President's and the Prime Minister's greetings
G = J("festival_greetings_read.json")
pages = [p for p in G["pages"] if "rows" not in p]
text, notes = {}, []
for p in pages:
    said = " ".join(p["sentences"]).lower(); yr = re.search(r"(20\d\d)", p["as_on"]).group(1)
    kind = "dhanteras" if "Dhanteras" in p["title"] else "ayurveda day" if "Ayurveda" in p["title"] else "diwali eve" if "eve of" in said else "diwali"
    key = f"{kind} {yr}"; assert key not in text, f"two greetings read as {key}"
    text[key] = " ".join(p["sentences"]); notes.append(f"{key}: {p['title']}, dated {p['as_on']}, {p['url']}")
assert "occasion of Diwali" in text["diwali 2025"] and "20 OCT 2025" in " ".join(notes), "the 2025 Diwali greeting moved"
write("pib/festival_greetings_2022_2025", {
    "title": "Greetings on Diwali and Dhanteras from the President and the Prime Minister, 2022 to 2025: the official dates of the festivals",
    "publisher": "Press Information Bureau; President's Secretariat; PMO (pmindia.gov.in)",
    "notes": ["Read 17 Oct 2026 in a browser. The date of each greeting dates the festival; the eve message is the day before."] + notes,
    "text": text})

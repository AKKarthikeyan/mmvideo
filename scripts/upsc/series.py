#!/usr/bin/env python3
"""The UPSC series as serials: each subject is a serial of seasons, each season an ordered run of episodes that build on
one another (Polity from the Preamble, History from Plassey to today, and so on).

Writes docs/upsc/series.csv and docs/upsc/SERIES.md from the order below, and checks it against docs/upsc/catalogue.csv:
every catalogue topic has exactly one home episode in one serial. A topic may also be listed in another serial's playlist
("also"), because one YouTube video can sit in two playlists.

  python3 -I scripts/upsc/series.py
"""
import csv, json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
CAT = ROOT / "docs/upsc/catalogue.csv"

# Topics researched so far split into more than one video (research/upsc/<id>/checklist.csv). Everything else is 1 until
# its NCERT mapping says otherwise.
PARTS = {
    "POL-06": ["Article 368 to Kesavananda", "What the doctrine became"],
    "HIS-30": ["Siraj-ud-daula to Plassey", "Mir Jafar to the diwani"],
    "GEO-07": ["The engine: what pulls it in", "The behaviour: onset, rain map, breaks, normal"],
    "ECO-15": ["What the RBI controls", "How a rate change travels", "Inflation targeting and its limits"],
    "AGR-07": ["What MSP is and how it is set", "Who gains: procurement and the debate"],
    "POL-03": ["Equal, but how? Equality and the reservation puzzle", "Can any law take your liberty? Freedom, life and liberty",
               "Religion, culture, limits and the Directive Principles"],   # 3 parts: the dossier's split (154 claims; GOLD_STANDARD D1)
    "ECO-12": ["Who really pays? Incidence, direct and indirect taxes", "GST in the Constitution: the 101st Amendment and the Council",
               "The money: compensation, rates and the Budget"],   # 3 parts: dossier split (103 claims), AK 11 Nov 2026
    "GEO-03": ["Why the ground breaks: waves, magnitude and India's zones", "Why some coasts are at risk: tsunamis and the warning chain"],
               # 2 parts: dossier split (74 claims), AK 11 Nov 2026
}

# serial -> [(season title, what the season is for, [topic ids in viewing order], [ids also shown in this playlist])]
SERIALS = {
 "Polity": [
  ("The Constitution and its promises", "Why India wrote a constitution, then its opening parts in their own order",
   ["POL-41", "POL-01", "POL-02", "POL-37", "POL-40", "POL-38", "POL-03", "POL-04", "POL-05", "POL-06", "POL-07"], []),
  ("How India is governed", "The parliamentary system, organ by organ: who holds power and who checks it",
   ["POL-08", "POL-13", "POL-12", "POL-10", "POL-09", "POL-11", "POL-17", "POL-15", "POL-16", "POL-14", "POL-29"], ["ECO-10"]),
  ("Centre, states and villages", "How power and money are shared down to the panchayat",
   ["POL-18", "POL-39", "POL-19", "POL-20"], ["ECO-13", "GEO-35"]),
  ("Elections and the watchdogs", "Who runs elections and who audits power",
   ["POL-21", "POL-22", "POL-23", "POL-24", "POL-25"], []),
  ("Governance in practice", "How policy reaches people, and how citizens push back",
   ["POL-26", "POL-27", "POL-28", "POL-42", "POL-30", "POL-31", "POL-32", "POL-33", "POL-34", "POL-35", "POL-36"], ["ECO-09"]),
 ],
 "History": [
  ("Plassey to Partition: how a company took India, and how India took it back", "Modern India in order, 1757 to 1947",
   ["HIS-30", "HIS-31", "HIS-32", "ECO-02", "ECO-03", "HID-07", "HIS-33", "HIS-34", "HIS-72", "HIS-35", "HIS-70", "HIS-71", "HIS-36", "HIS-37", "HIS-38", "HIS-39",
    "HIS-40", "HIS-41", "HIS-42", "HIS-43", "HIS-44", "HIS-45", "HIS-46", "HIS-47"], []),
  ("1947 to today: building a nation", "From integration to liberalisation, in time order; + marks an episode from another serial played here",
   ["HIS-48", "+POL-01", "HIS-49", "+ECO-04", "HIS-50", "+AGR-06", "+ECO-05", "+AGR-05", "HIS-51", "+POL-07", "HIS-52", "+ECO-06", "+POL-20"], []),
  ("Ancient India: from the first farmers to the Cholas", "Sources, then the story in order",
   ["HIS-01", "HIS-02", "HIS-03", "HIS-04", "HIS-05", "HIS-06", "HIS-07", "HIS-08", "HIS-09", "HIS-10", "HIS-11", "HIS-12", "HIS-13",
    "HIS-14", "HIS-15", "HIS-17", "HID-01", "HID-02", "HID-08"], []),
  ("Medieval India: Sultans, Vijayanagara, Mughals and Marathas", "750 to 1761, ending where the Plassey season begins",
   ["HIS-16", "HIS-19", "HIS-20", "HID-03", "HIS-21", "HID-04", "HIS-22", "HIS-23", "HIS-24", "HIS-25", "HIS-26", "HIS-27", "HID-05",
    "HIS-28", "HID-06", "HIS-29"], []),
  ("Art and culture across the ages", "Temples, dance, music, painting and thought, as one thread",
   ["HIS-18"], ["HIS-12", "HIS-16", "HIS-17", "HIS-25"]),
  ("The world since the Enlightenment", "Revolutions, empires, wars and the world India joined",
   ["HIS-53", "HIS-54", "HIS-55", "HIS-56", "HIS-57", "HIS-58", "HIS-59", "HIS-60", "HIS-61", "HIS-62", "HIS-63", "HIS-64", "HIS-65",
    "HIS-66", "HIS-67", "HIS-68", "HIS-69"], []),
 ],
 "Geography": [
  ("Reading the Earth, and our restless planet", "Maps, latitude and time first; then inside the Earth, plates, quakes, volcanoes and landforms",
   ["GEO-42", "GEO-43", "GEO-01", "GEO-02", "GEO-03", "GEO-04", "GEO-05"], []),
  ("Air and weather", "Winds, the monsoon, cyclones and climates",
   ["GEO-06", "GEO-44", "GEO-07", "GEO-08", "GEO-09", "GEO-10", "GEO-39"], []),
  ("The oceans", "Currents, the sea floor, corals and the rising sea",
   ["GEO-11", "GEO-12", "GEO-13"], []),
  ("India: the land", "Where India sits, its shapes, rivers, soils, forests, floods and the map",
   ["GEO-16", "GEO-17", "GEO-18", "GEO-14", "GEO-15", "GEO-19", "GEO-40"], ["AGR-02"]),
  ("India: resources and industry", "Minerals, energy, water, wildlife, factories and the ways things move",
   ["GEO-45", "GEO-20", "GEO-21", "GEO-22", "GEO-23", "GEO-24", "GEO-25", "GEO-26", "GEO-27", "GEO-28", "GEO-29"], ["ECO-26"]),
  ("India: people and places", "Population, migration, languages, villages and cities",
   ["GEO-30", "GEO-31", "GEO-32", "GEO-33", "GEO-34"], ["ECO-23"]),
  ("Regions and issues", "Borders, rivers shared between states, the Indian Ocean, hazards and planning",
   ["GEO-35", "GEO-36", "GEO-37", "GEO-38", "GEO-41"], ["ECO-28"]),
 ],
 "Economics": [
  ("Basics: how an economy works", "Scarcity and choice, prices, markets, and how output and prices are measured",
   ["ECO-32", "ECO-30", "ECO-49", "ECO-01", "ECO-44"], []),
  ("Money and banking in daily life", "From the coin in your pocket to UPI, the banks, the RBI and bad loans",
   ["ECO-33", "ECO-34", "ECO-35", "ECO-36", "ECO-16", "ECO-37", "ECO-51", "ECO-14", "ECO-15", "ECO-38", "ECO-39", "ECO-17"], []),
  ("Saving, investing and insurance", "How families keep money safe and how businesses raise it (explained, never advised)",
   ["ECO-41", "ECO-40", "ECO-29", "ECO-42", "ECO-43"], []),
  ("The government's money", "Budget, taxes, deficits, the Finance Commission, subsidies and black money",
   ["ECO-10", "ECO-45", "ECO-12", "ECO-11", "ECO-13", "ECO-47", "ECO-46", "ECO-25", "ECO-26"], []),
  ("India and the world economy", "Trade, the rupee, oil, foreign investment and the global lenders",
   ["ECO-19", "ECO-18", "ECO-48", "ECO-20", "ECO-22", "ECO-50"], []),
  ("The story of India's economy", "From planning to liberalisation, in order",
   ["ECO-04", "ECO-05", "ECO-31", "ECO-06", "ECO-21"], ["ECO-02", "ECO-03", "AGR-05"]),
  ("Development and people", "Poverty, jobs, inclusion, schools and hospitals, and the gaps between states",
   ["ECO-07", "ECO-08", "ECO-09", "ECO-23", "ECO-24", "ECO-27", "ECO-28"], []),
 ],
 "Agriculture": [
  ("The farm: soil, seasons and water", "What grows where, and why",
   ["AGR-04", "AGR-02", "AGR-01", "AGR-03", "AGR-18", "AGR-19"], ["GEO-14"]),
  ("How Indian farming changed", "Land reforms, the Green Revolution, missions and the livestock economy",
   ["AGR-06", "AGR-05", "AGR-15", "AGR-14"], []),
  ("Prices and markets", "MSP, the mandi, insurance, subsidies and the WTO",
   ["AGR-07", "AGR-11", "AGR-12", "AGR-17", "AGR-10", "AGR-16"], []),
  ("Food for everyone", "The ration shop, the godown, food processing and hunger",
   ["AGR-08", "AGR-09", "AGR-13", "AGR-20"], []),
 ],
}

# International relations (AK, 10 Nov 2026): GS II's IR lines and PSIR Paper II, built from the 313 Mains IR questions no
# episode taught (docs/upsc/planner/NEW_EPISODES.md). Neighbours and borders are sensitive: official sources only, no side.
SERIALS["International relations"] = [
 ("How to study world politics", "The ideas first: power, the theories, and how political systems are compared",
  ["IRS-01", "IRS-02", "IRS-03", "IRS-04", "IRS-05", "IRS-06", "IRS-07"], []),
 ("The world order since 1945", "Cold War, non-alignment, the unipolar moment and the rules of the world economy",
  ["IRS-08", "IRS-09", "IRS-10", "IRS-11", "+ECO-22", "IRS-12"], []),
 ("The UN and the global problems", "What the institutions do, and the concerns no country solves alone",
  ["IRS-13", "IRS-14", "IRS-15", "IRS-16", "IRS-17", "IRS-18", "IRS-19", "IRS-20"], []),
 ("India's foreign policy", "How India decides, how its policy has changed, and its nuclear choices",
  ["IRS-21", "IRS-22", "IRS-23", "IRS-24"], []),
 ("India and its neighbours", "South Asia, one neighbour at a time, and the rivers they share",
  ["IRS-25", "IRS-26", "IRS-27", "IRS-28", "IRS-29", "IRS-30", "IRS-31"], ["GEO-37"]),
 ("India and the powers", "The great powers, the regions and the groupings India works through",
  ["IRS-32", "IRS-33", "IRS-34", "IRS-35", "IRS-36", "IRS-37", "IRS-38", "IRS-39"], []),
]

# Optional-paper ("advanced") serials: after the core serials, in the order of the optional syllabus.
ADVANCED = {
 "Polity (optional)": ["PTH-01", "PTH-02", "PTH-03", "PTH-04", "PTH-05", "PTH-06", "PTH-07", "PTH-08", "PTH-09", "PTH-10",
                       "PTH-11", "PTH-12", "PTH-13", "PTH-14", "PTH-15", "PTH-16", "PTH-17", "PTH-18"],   # PSIR Paper I, political theory and thought
 "Economics (optional)": ["ECD-01", "ECD-02", "ECD-03", "ECD-04", "ECD-05", "ECD-06", "ECD-07", "ECD-08", "ECD-09", "ECD-10",
                          "ECD-11", "ECD-12", "ECD-13", "ECD-14", "ECD-15", "ECD-16"],
 "Geography (optional)": ["GED-01", "GED-02", "GED-03", "GED-04", "GED-05", "GED-06", "GED-07", "GED-08", "GED-09", "GED-10",
                          "GED-11", "GED-12", "GED-13"],
 "Agriculture (optional)": ["AGD-01", "AGD-02", "AGD-03", "AGD-04", "AGD-05", "AGD-06", "AGD-07", "AGD-08", "AGD-09", "AGD-10",
                            "AGD-11", "AGD-12", "AGD-13", "AGD-14", "AGD-15", "AGD-16", "AGD-17", "AGD-18", "AGD-19", "AGD-20", "AGD-21"],
}


# RBI Grade B (economics and finance), in the order of the notice's syllabus. "+" shows an episode whose home is another serial.
RBI = [
 ("Growth and development", "Measuring growth, poverty and jobs, and what growth costs the planet (ESI, Growth and Development)",
  ["+ECO-01", "+ECO-44", "+ECO-07", "+ECO-08", "+ECO-09", "+ECO-24", "ECR-01"], []),
 ("The Indian economy since 1947", "History, reforms, the Survey and Budget, industry, farms and services (ESI, Indian Economy)",
  ["+ECO-02", "+ECO-03", "+ECO-04", "+ECO-05", "+ECO-06", "+ECO-31", "+ECO-21", "ECR-02", "ECR-03", "ECR-06", "ECR-04", "+AGR-05", "+AGR-07"], []),
 ("Globalisation", "Payments, trade rules, global lenders, blocs and debt (ESI, Globalisation)",
  ["+ECO-19", "+ECO-18", "+ECO-22", "+ECO-50", "+ECO-20", "ECR-05", "ECR-09", "ECR-10"], []),
 ("Society and the economy", "Population, cities, women, caste and inequality (ESI, Social Structure)",
  ["+ECO-23", "+GEO-31", "+GEO-34", "ECR-07", "ECR-08"], []),
 ("Public finance", "Budget, taxes, deficits, states and subsidies (ESI and Paper III)",
  ["+ECO-10", "+ECO-45", "+ECO-12", "+ECO-11", "+ECO-13", "+ECO-47"], []),
 ("The financial system", "Money, the RBI, banks, shadow banks, payments, inclusion and governance (Paper III, Financial System)",
  ["+ECO-33", "+ECO-14", "+ECO-37", "+ECO-51", "+ECO-38", "+ECO-39", "ECR-16", "ECR-17", "+ECO-17", "+ECO-34", "+ECO-35", "+ECO-36", "+ECO-16", "+ECO-15"], []),
 ("Financial markets and risk", "Money, bond, forex and equity markets, derivatives, risk and project finance (Paper III, Markets and General Topics)",
  ["+ECO-29", "ECR-11", "ECR-12", "ECR-13", "+ECO-42", "ECR-14", "ECR-15", "ECR-21", "ECR-20", "+ECO-25"], []),
 ("Accounts and ratios", "Balance sheet, profit and loss, cash flow and ratio analysis (Paper III, Accounting)",
  ["ECR-18", "ECR-19"], []),
 ("DEPR: microeconomics", "Consumer, firm, market, distribution and welfare theory",
  ["+ECO-30", "+ECO-49", "ECR-22", "ECR-23", "ECR-24", "ECR-25", "+ECD-01", "+ECD-02", "+ECD-03", "+ECD-04"], []),
 ("DEPR: macroeconomics", "Output, cycles, inflation, money, growth, trade and public finance theory",
  ["ECR-26", "+ECD-05", "+ECD-06", "+ECD-07", "ECR-28", "ECR-27", "ECR-29", "+ECD-13", "+ECD-14", "+ECD-08", "+ECD-09", "+ECD-10",
   "+ECD-11", "+ECD-12", "ECR-30", "ECR-31", "+ECD-15"], []),
 ("DEPR: quantitative methods", "Mathematics, statistics and econometrics for economists",
  ["ECR-32", "ECR-33", "ECR-34", "ECR-35", "ECR-36", "ECR-37", "ECR-38"], []),
]


def load_parts():
    """Named parts for researched topics; elsewhere the count from research/upsc/_map/parts.json (an estimate)."""
    f = ROOT / "research/upsc/_map/parts.json"
    est = json.load(open(f))["parts"] if f.exists() else {}
    out = {t: [f"Part {i} of {n}" if n > 1 else "" for i in range(1, n + 1)] for t, n in est.items()}
    out.update(PARTS)
    return out


def main():
    global PARTS
    PARTS = load_parts()
    cat = {r["id"]: r for r in csv.DictReader(open(CAT, encoding="utf-8"))}
    rows, home, problems = [], {}, []
    allserials = list(SERIALS.items()) + [(k, [("Advanced", "Optional-paper level, in syllabus order", v, [])]) for k, v in ADVANCED.items()]
    allserials.append(("RBI Grade B (economics and finance)", RBI))
    for serial, seasons in allserials:
        ep = 0
        for sn, (stitle, why, ids, also) in enumerate(seasons, 1):
            for tid in ids:
                if tid.startswith("+"):
                    tid = tid[1:]
                    if tid not in cat:
                        problems.append(f"{serial}: inline {tid} is not in the catalogue"); continue
                    rows.append(dict(serial=serial, season=sn, season_title=stitle, episode="", topic=tid, part="",
                                     title=cat[tid]["title"], kind="inline"))
                    continue
                if tid not in cat:
                    problems.append(f"{serial}: {tid} is not in the catalogue"); continue
                if tid in home:
                    problems.append(f"{tid} is home in both {home[tid]} and {serial}")
                home[tid] = serial
                parts = PARTS.get(tid, [""])
                for pi, ptitle in enumerate(parts, 1):
                    ep += 1
                    rows.append(dict(serial=serial, season=sn, season_title=stitle, episode=ep, topic=tid,
                                     part=f"{pi}/{len(parts)}" if len(parts) > 1 else "",
                                     title=cat[tid]["title"] + ((f" ({ptitle})" if ptitle.startswith("Part ") else f" (Part {pi}: {ptitle})") if ptitle else ""), kind="home"))
            for tid in also:
                if tid not in cat:
                    problems.append(f"{serial}: also-listed {tid} is not in the catalogue"); continue
                rows.append(dict(serial=serial, season=sn, season_title=stitle, episode="", topic=tid, part="",
                                 title=cat[tid]["title"], kind="also"))
    missing = [t for t in cat if t not in home]
    for t in missing:
        problems.append(f"{t} ({cat[t]['title']}) has no home episode")
    for r in rows:
        if r["kind"] in ("also", "inline") and r["topic"] not in home:
            problems.append(f"{r['topic']} is also-listed in {r['serial']} but has no home")

    out = ROOT / "docs/upsc/series.csv"
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader(); w.writerows(rows)

    md = ["# UPSC series as serials (plan, rendered by `scripts/upsc/series.py`; edit the script, not this file)", "",
          "Each subject is a serial watched in order. A season is a run of episodes that build on one another. "
          "Episode numbers run through the whole serial. \"Also in this playlist\" are episodes from another serial that "
          "fit here: the same video sits in both playlists. Topics with more than one part were split by their research; "
          "every other topic counts as one video until its NCERT mapping is done, so the totals will grow.", ""]
    tot = {}
    for serial, seasons in allserials:
        sr = [r for r in rows if r["serial"] == serial]
        n = sum(1 for r in sr if r["kind"] == "home")
        tot[serial] = n
        md += [f"## {serial}: {n} episodes", ""]
        for sn, (stitle, why, ids, also) in enumerate(seasons, 1):
            md += [f"### Season {sn}: {stitle}", f"*{why}*", "", "| Ep | Topic | Episode |", "|---:|---|---|"]
            for r in sr:
                if r["season"] == sn and r["kind"] == "home":
                    md.append(f"| {r['episode']} | {r['topic']} | {r['title']} |")
                elif r["season"] == sn and r["kind"] == "inline":
                    md.append(f"| + | {r['topic']} | {r['title']} *(from {home.get(r['topic'], '?')})* |")
            al = [r for r in sr if r["season"] == sn and r["kind"] == "also"]
            if al:
                md += ["", "Also in this playlist: " + "; ".join(f"{r['topic']} {r['title']}" for r in al)]
            md.append("")
    md[2:2] = ["| Serial | Episodes |", "|---|---:|"] + [f"| {k} | {v} |" for k, v in tot.items()] + [f"| **All** | **{sum(tot.values())}** |", ""]
    (ROOT / "docs/upsc/SERIES.md").write_text("\n".join(md) + "\n", encoding="utf-8")

    print(f"{len(cat)} topics, {sum(tot.values())} episodes in {len(allserials)} serials")
    for k, v in tot.items():
        print(f"  {k:<24} {v}")
    for p in problems:
        print("  PROBLEM", p)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())

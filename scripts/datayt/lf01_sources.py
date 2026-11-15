#!/usr/bin/env python3
"""Data Kadai long-form 01: the second set of source tables, read on 15 Oct 2026 (the first set is cpi2024_tables.py).

Input: the raw reads in research/2026-10-15/longform/raw/:
  esankhyiki_allindia_items_2026-08-09.json   MoSPI's eSankhyiki data service, every all-India row (division to item), August and September 2026
  rbi_2026-10-07.json                         the RBI's MPC resolution and Governor's statement of 7 Oct 2026, and the August minutes, as printed
  pib_2303587_onion.json                      Consumer Affairs on the onion buffer, PIB, 26 Aug 2026, paragraphs as printed
Output, read by build_long.py with {"breakdown": [path, section, key, field]} and checked by its "text" tests:
  public/datayt/sources/mospi/cpi2024_allindia_items_2026_09.json   "items": {code: {name, level, Sep 2026, Aug 2026, index Sep 2026}}
  public/datayt/sources/rbi/mpc_2026_10.json                         "facts" (the numbers, typed from the text) and "text" (the sentences)
  public/datayt/sources/consumer_affairs/onion_2026_08.json          the same shape
Every number typed into "facts" is tested against its own sentence below, so a typing slip stops this script.
Usage (repo root): python3 scripts/datayt/lf01_sources.py <raw folder>
"""
import json, os, sys
RAW = sys.argv[1]; SRC = "public/datayt/sources"
J = lambda f: json.load(open(os.path.join(RAW, f)))
num = lambda x: None if x in (None, "", "-") else float(x)

def write(path, obj):
    os.makedirs(os.path.dirname(f"{SRC}/{path}"), exist_ok=True)
    json.dump(obj, open(f"{SRC}/{path}.json", "w"), ensure_ascii=False, indent=1); print("wrote", f"{SRC}/{path}.json")

def check(facts, text):
    """Each fact names the sentence it came from and the words that print it; the words must be in that sentence."""
    for k, f in facts.items():
        for field, (v, key, words) in list(f.items()):
            assert words in text[key], f"{k}.{field}: '{words}' is not in the sentence '{key}'"
            assert str(v).rstrip("0").rstrip(".") in words.replace(",", "") or f"{v:.2f}" in words, f"{k}.{field}: {v} is not printed in '{words}'"
            f[field] = v
        f["from"] = sorted({key for _, key, _ in facts_src[k].values()})

# ---------------------------------------------------------------- MoSPI: every all-India row, August and September
E = J("esankhyiki_allindia_items_2026-08-09.json")
items = {}
for r in E["rows"]:
    code = r["code"] or "00"
    if code.startswith("02"):
        continue      # paan, tobacco and intoxicants: never shown (channel rule), so not saved here either
    level = next(l for l in ("item", "sub_class", "class", "group", "division") if r[l])
    items[code] = {"name": r[level], "level": level, "Sep 2026": num(r["inflation Sep 2026"]), "Aug 2026": num(r["inflation Aug 2026"]), "index Sep 2026": num(r["index Sep 2026"])}
assert items["00"]["Sep 2026"] == 5.54 and items["01.1"]["Sep 2026"] == 7.74, "the portal's headline or food figure is not the release's"
assert items["01.1.7.4.1.01"]["name"] == "Onion" and items["01.1.7.4.1.01"]["Sep 2026"] == 108.09
write("mospi/cpi2024_allindia_items_2026_09", {
    "title": "Consumer Price Index (base 2024=100), all India, combined: inflation for every division, group, class, sub-class and item, September 2026 (provisional) and August 2026",
    "publisher": "Ministry of Statistics and Programme Implementation (National Statistics Office)",
    "notes": [f"{E['source']}; read {E['read_at']}. Keyed by MoSPI's code (00 is CPI General). Year-on-year inflation in per cent; index 2024=100.",
              "September 2026 is provisional and is revised with October's release on 12 Nov 2026.",
              "Division 02 (paan, tobacco and intoxicants) is left out of this table (channel rule); the raw read keeps it."],
    "items": items})

# ---------------------------------------------------------------- RBI, 7 Oct 2026
R = J("rbi_2026-10-07.json"); res, gov = R["resolution"], R["governor"]
text = {"decision": res["para 2"], "projection": res["para 9"], "food": res["para 8"], "minutes": res["para 17"], "next": res["para 18"], "dissent": res["para 15"],
        "onion": gov["footnote 13"], "sugar": gov["footnote 12"], "aug": R["aug_minutes"]["para 6"]}
facts_src = {
    "repo": {"after": (5.50, "decision", "by 25 bps to 5.50 per cent"), "change bps": (25, "decision", "by 25 bps to 5.50 per cent"),
             "sdf": (5.25, "decision", "stands adjusted at 5.25 per cent"), "msf": (5.75, "decision", "the Bank Rate at 5.75 per cent"),
             "before": (5.25, "aug", "unchanged at 5.25 per cent")},
    "projection": {"2026-27": (5.2, "projection", "projected to be 5.2 per cent for 2026-27"), "Q2": (4.9, "projection", "Q2 at 4.9 per cent"),
                   "Q3": (6.0, "projection", "Q3 at 6.0 per cent"), "Q4": (5.7, "projection", "Q4 at 5.7 per cent"), "core 2026-27": (4.4, "projection", "Core inflation is projected at 4.4 per cent")},
    "onion": {"rise": (85, "onion", "about 85 per cent by end-September over end-June")},
    "sugar": {"rise": (34, "sugar", "about 34 per cent from early July")},
}
facts = {k: dict(v) for k, v in facts_src.items()}; check(facts, text)
assert abs(facts["repo"]["after"] - facts["repo"]["before"] - facts["repo"]["change bps"] / 100) < 1e-9, "August's rate plus the rise is not the new rate"
write("rbi/mpc_2026_10", {
    "title": "Reserve Bank of India: the Monetary Policy Committee's decision and projections, 7 October 2026",
    "publisher": "Reserve Bank of India",
    "notes": [f"Resolution of the MPC, 5 to 7 Oct 2026: {res['url']} (press release {res['press_release']}). Governor's Statement, 7 Oct 2026: {gov['url']}. Read on rbi.org.in, 15 Oct 2026.",
              "'text' holds the sentences as printed (paragraph and footnote numbers dropped from the start); 'facts' holds the numbers typed from them, each checked against its sentence when this table was written.",
              f"repo.before is the rate the August meeting kept unchanged: Minutes of the MPC meeting of 3 to 5 Aug 2026, {R['aug_minutes']['url']} (published 19 Aug 2026), paragraph 6.",
              "The decision was announced on 7 Oct 2026, five days before the September CPI release of 12 Oct 2026."],
    "facts": facts, "text": text})

# ---------------------------------------------------------------- Consumer Affairs, 26 Aug 2026
P = J("pib_2303587_onion.json"); p = P["paras"]
text = {"retail": p["retail"], "production": p["production"], "festive": p["festive"], "release": p["release"], "exports": p["exports"], "monitoring": p["monitoring"]}
facts_src = {
    "sale": {"rupees per kg": (35, "retail", "Retail sale of onions at ₹35 per kg")},
    "production": {"2025-26": (307.37, "production", "estimated production of 307.37 LMT in 2025-26"), "previous year": (307.67, "production", "previous year's production of 307.67 LMT")},
    "buffer": {"target": (2.00, "production", "procurement target of 2.00 LMT"), "procured": (1.21, "production", "Around 1.21 LMT of onions have been procured")},
    "exports": {"Apr-Jun 2026": (3.82, "exports", "exports stood at approximately 3.82 LMT")},
}
facts = {k: dict(v) for k, v in facts_src.items()}; check(facts, text)
write("consumer_affairs/onion_2026_08", {
    "title": "Ministry of Consumer Affairs, Food and Public Distribution: onion availability and the release of buffer stocks, 26 August 2026",
    "publisher": "Ministry of Consumer Affairs, Food and Public Distribution (Department of Consumer Affairs)",
    "notes": [f"PIB, {P['posted']}: {P['url']}. Read on pib.gov.in, 15 Oct 2026. LMT is lakh metric tonnes.",
              "The latest onion-specific release from the Ministry found on 14 and 15 Oct 2026. 'text' holds the sentences as printed; 'facts' the numbers typed from them, each checked against its sentence."],
    "facts": facts, "text": text})

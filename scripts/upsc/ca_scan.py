#!/usr/bin/env python3
"""Current affairs linked to the syllabus (AK, 3 Nov 2026): sorts the day's official releases into Economics, Geography and
Polity, links each to the serial episode and syllabus line it updates, and flags living facts it may change.

Input: public/datayt/hot/<date>.json from the Data Kadai hot scan (PIB, RBI, SEBI, Lok Sabha; scripts/datayt/hot_scan.py).
Output: docs/upsc/current/<date>.md (candidates for AK to pick) and docs/upsc/current/<date>.json.

  python3 -I scripts/upsc/ca_scan.py [YYYY-MM-DD] [--min 3]

This is triage by keywords, not a judgement: every pick still goes through research and the Gold Standard checks.
"""
import csv, json, pathlib, re, sys
from collections import defaultdict

ROOT = pathlib.Path(__file__).resolve().parents[2]
FOCUS = {"Economics": "ECO", "Geography": "GEO", "Polity": "POL"}
STOP = set("""about after again their there these those which while where would could should other first second third
under between through during before being every without within since until india indian government ministry national
scheme schemes minister union state states centre central today years year month report about whose""".split())
# Terms that mark a release as syllabus-relevant beyond what the catalogue titles say (term -> topic ids).
EXTRA = {
 "repo": ["ECO-15"], "monetary policy": ["ECO-15"], "inflation": ["ECO-15", "ECO-01"], "consumer price index": ["ECO-15"],
 "wholesale price": ["ECO-15"], "gdp": ["ECO-01"], "gross domestic": ["ECO-01"], "index of industrial": ["ECO-01"],
 "fiscal deficit": ["ECO-11"], "budget": ["ECO-10"], "gst": ["ECO-12"], "finance commission": ["ECO-13"],
 "forex": ["ECO-18", "ECO-19"], "rupee": ["ECO-18"], "current account": ["ECO-19"], "fdi": ["ECO-20"],
 "foreign direct investment": ["ECO-20"], "disinvestment": ["ECO-21"], "wto": ["ECO-22"], "trade agreement": ["ECO-22"],
 "sebi": ["ECO-29"], "mutual fund": ["ECO-29"], "bond": ["ECO-29"], "periodic labour force": ["ECO-08"],
 "unemployment": ["ECO-08"], "jan dhan": ["ECO-17"], "upi": ["ECO-17"], "payments": ["ECO-17"], "poverty": ["ECO-07"],
 "mgnrega": ["ECO-09"], "employment guarantee": ["ECO-09"], "coal": ["GEO-21", "ECO-26"], "power generation": ["ECO-26"],
 "renewable": ["GEO-21"], "solar": ["GEO-21"], "monsoon": ["GEO-07"], "rainfall": ["GEO-07", "GEO-19"], "cyclone": ["GEO-09"],
 "earthquake": ["GEO-03"], "tsunami": ["GEO-03"], "flood": ["GEO-19"], "drought": ["GEO-19"], "heatwave": ["GEO-39"],
 "glacier": ["GEO-39"], "mineral": ["GEO-20"], "mining": ["GEO-20"], "groundwater": ["GEO-22"], "tiger": ["GEO-23"],
 "wildlife": ["GEO-23"], "forest": ["GEO-15", "GEO-23"], "port": ["GEO-28"], "railway": ["GEO-27"], "highway": ["GEO-27", "ECO-25"],
 "isro": ["GEO-29"], "satellite": ["GEO-29"], "census": ["GEO-30"], "migration": ["GEO-31"], "smart cities": ["GEO-34"],
 "urban": ["GEO-34"], "landslide": ["GEO-38"], "coral": ["GEO-13"], "ocean": ["GEO-11"],
 "constitution": ["POL-01"], "amendment": ["POL-06"], "fundamental right": ["POL-03"], "supreme court": ["POL-15"],
 "high court": ["POL-16"], "tribunal": ["POL-16"], "parliament": ["POL-09", "POL-10"], "lok sabha": ["POL-10"],
 "rajya sabha": ["POL-10"], "bill": ["POL-09"], "president": ["POL-13"], "governor": ["POL-14"], "election commission": ["POL-21"],
 "election": ["POL-21"], "panchayat": ["POL-20"], "municipal": ["POL-20"], "comptroller": ["POL-23"], "cag": ["POL-23"],
 "upsc": ["POL-23"], "human rights commission": ["POL-24"], "commission for women": ["POL-24"], "scheduled castes": ["POL-24", "POL-31"],
 "scheduled tribes": ["POL-24", "POL-39"], "forest rights": ["POL-39"], "right to information": ["POL-26"], "e-governance": ["POL-27"],
 "digital india": ["POL-27"], "civil services": ["POL-28"], "welfare": ["POL-31"], "self-help group": ["POL-32"],
 "union territory": ["POL-40"], "police": ["POL-42"], "fir": ["POL-42"], "cooperative federalism": ["POL-19"],
}


# Releases that are not current affairs for the syllabus: orders against individuals, speech transcripts and shares,
# military exercise names that happen to contain a keyword, routine auction notices.
SKIP = re.compile(r"recovery certificate|adjudication order|settlement order|order for compliance|in the matter of|"
                  r"prime minister shares|english rendering|text of|exercise [a-z]+ \\d{4}|opening ceremony of exercise|"
                  r"to conduct .*auction|result of the .*auction", re.I)


def words(t):
    return {w for w in re.findall(r"[a-z]{5,}", t.lower()) if w not in STOP}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    mn = float(sys.argv[sys.argv.index("--min") + 1]) if "--min" in sys.argv else 3
    files = sorted((ROOT / "public/datayt/hot").glob("20*.json"))
    f = ROOT / f"public/datayt/hot/{args[0]}.json" if args else files[-1]
    day = f.stem
    items = json.load(open(f))["items"]
    cat = {r["id"]: r for r in csv.DictReader(open(ROOT / "docs/upsc/catalogue.csv", encoding="utf-8"))}
    ser = {r["topic"]: r for r in csv.DictReader(open(ROOT / "docs/upsc/series.csv", encoding="utf-8")) if r["kind"] == "home"}
    topics = {t: c for t, c in cat.items() if t[:3] in FOCUS.values()}
    kw = {t: words(c["title"] + " " + c["covers"]) for t, c in topics.items()}
    living = {}
    for lf in (ROOT / "docs/upsc/living").glob("*.csv"):
        for r in csv.DictReader(open(lf, encoding="utf-8")):
            living.setdefault(lf.stem, []).append(r.get("fact") or r.get("claim") or "")

    picks = []
    for it in items:
        if SKIP.search(it.get("title", "")):
            continue
        text = f"{it.get('title', '')} {it.get('text', '')[:6000]}".lower()
        tw = words(text)
        score = defaultdict(float)
        for t, k in kw.items():
            hit = len(k & tw)
            if hit:
                score[t] += hit
        for term, ts in EXTRA.items():
            n = len(re.findall(r"\b" + re.escape(term) + r"\b", text))
            if n:
                for t in ts:
                    if t in topics:
                        score[t] += 2 + min(n, 5)
        if not score:
            continue
        best = sorted(score.items(), key=lambda kv: -kv[1])[:3]
        if best[0][1] < mn:
            continue
        top = best[0][0]
        subj = next(s for s, p in FOCUS.items() if top.startswith(p))
        picks.append(dict(subject=subj, score=round(best[0][1] + it.get("score", 0) / 10, 1), title=it.get("title"),
                          url=it.get("url"), publisher=it.get("publisher"), date=it.get("posted") or it.get("date"),
                          topics=[dict(id=t, title=cat[t]["title"], syllabus=cat[t]["syllabus"],
                                       episode=(f"{ser[t]['serial']} ep {ser[t]['episode']}" if t in ser else ""), weight=w) for t, w in best],
                          living=top in living, key_lines=it.get("key_lines", [])[:3]))
    picks.sort(key=lambda p: -p["score"])
    out = ROOT / "docs/upsc/current"; out.mkdir(parents=True, exist_ok=True)
    json.dump(dict(date=day, source=str(f.relative_to(ROOT)), picks=picks), open(out / f"{day}.json", "w"), indent=1, ensure_ascii=False)
    md = [f"# Current affairs linked to the syllabus: {day}", "",
          f"From the hot scan ({len(items)} official releases). Sorted by keyword match to Economics, Geography and Polity topics. "
          "Triage only: a pick goes through research and the Gold Standard like any episode.", "",
          "Formats: **Update Short** (30-45 s, links to its parent episode) when the release changes a fact an episode teaches; "
          "**Explainer** when it is new syllabus-relevant ground; a living-fact flag means a recorded fact may need checking.", ""]
    for subj in FOCUS:
        sp = [p for p in picks if p["subject"] == subj]
        md += [f"## {subj} ({len(sp)})", ""]
        for p in sp[:12]:
            t0 = p["topics"][0]
            md.append(f"- **{p['title']}** ({p['publisher']}, {p['date']}) [link]({p['url']})")
            md.append(f"  - Links to {t0['id']} {t0['title']} ({t0['episode']}); syllabus {t0['syllabus']}"
                      + ("; **living fact may change**" if p["living"] else ""))
            if len(p["topics"]) > 1:
                md.append("  - Also: " + "; ".join(f"{t['id']} {t['title']}" for t in p["topics"][1:]))
            for kl in p["key_lines"][:2]:
                md.append(f"  - \"{kl[:160]}\"")
        md.append("")
    (out / f"{day}.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"{day}: {len(items)} releases, {len(picks)} linked: " + ", ".join(f"{s} {sum(p['subject'] == s for p in picks)}" for s in FOCUS))


if __name__ == "__main__":
    sys.exit(main())

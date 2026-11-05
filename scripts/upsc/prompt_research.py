#!/usr/bin/env python3
"""Writes the research prompt for one topic, for AK to paste into Gemini (web app, Deep Research where available).
AK pastes Gemini's research note back; Claude cross-checks it at the sources before any script is written (PIPELINE.md).

  python3 -I scripts/upsc/prompt_research.py POL-41 [--part 1]   # writes docs/upsc/prompts/<id>_research.md and prints it
"""
import csv, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
MAPS = {"POL": "polity", "HIS": "history", "GEO": "geography", "ECO": "economics"}


# Hand-set chapters for topics the map's keyword match placed badly: topic -> ([(book code, chapter)], note for Gemini).
CHAPTERS = {
    "ECO-32": ([("iest1", 8), ("leec2", 1), ("kest1", 1)], ""),
    "ECO-30": ([("leec2", 2), ("leec2", 4), ("leec2", 5), ("iest1", 9), ("gees1", 12)], ""),
    "ECO-49": ([("leec2", 3), ("leec2", 4), ("gees1", 12)],
               "NCERT's Class 12 chapter on non-competitive markets (monopoly, oligopoly) was removed in the 2022 rationalisation; "
               "say what the current books still teach, and take monopoly and oligopoly from the earlier NCERT edition (say which) "
               "and from IGNOU or NIOS economics units."),
}


def chapters_and_headings(tid, c):
    m = MAPS.get(tid[:3])
    if not m:
        return [], []
    rows = list(csv.DictReader(open(ROOT / f"research/upsc/_map/{m}_subtopics.csv", encoding="utf-8")))
    mine = [r for r in rows if tid in re.split(r"[;| ]+", r["topic_id"])]
    if not mine:   # a topic made from the map's gaps: unassigned rows that share its words
        words = re.findall(r"[a-z]{5,}", (c["title"] + " " + c["covers"]).lower())
        mine = [r for r in rows if r["topic_id"] == "NONE" and any(w in (r["heading"] + " " + r["subheading"]).lower() for w in words)]
    chaps = []
    for r in mine:
        mm = re.match(r"\s*([a-z]{4,5}\d)[\s,]+(.*?)[\s,]+ch(?:apter)?\s*(\d+)\s*([^,]*?)(?:,|\s+p\.|$)", r["source_ref"]) if r["source"] == "ncert" else None
        if mm:
            title = re.sub(r"\s*(p\.\S*|pdf)\s*$", "", mm.group(4).strip())
            if (mm.group(1), int(mm.group(3))) not in {(x[0], x[2]) for x in chaps}:
                chaps.append((mm.group(1), mm.group(2).strip(), int(mm.group(3)), title))
    if tid in CHAPTERS:   # keep only the hand-set chapters, in their order
        want = CHAPTERS[tid][0]
        allref = {}
        for r in rows:
            mm2 = re.match(r"\s*([a-z]{4,5}\d)[\s,]+(.*?)[\s,]+ch(?:apter)?\s*(\d+)", r["source_ref"]) if r["source"] == "ncert" else None
            if mm2 and (mm2.group(1), int(mm2.group(3))) in want and (mm2.group(1), int(mm2.group(3))) not in allref:
                allref[(mm2.group(1), int(mm2.group(3)))] = (mm2.group(1), mm2.group(2).strip(), int(mm2.group(3)), "")
        chaps = [allref[k] for k in want if k in allref]
    keys = {(b, n) for b, _, n, _ in chaps}
    heads, seen = [], set()
    for r in rows:   # every heading of those chapters, not only the ones assigned to this topic
        mm = re.match(r"\s*([a-z]{4,5}\d)[\s,].*?\bch(?:apter)?\s*(\d+)", r["source_ref"]) if r["source"] == "ncert" else None
        if mm and (mm.group(1), int(mm.group(2))) in keys:
            h = (r["heading"] + (" > " + r["subheading"] if r["subheading"] else "")).strip()
            if h and h not in seen:
                seen.add(h); heads.append(f"{mm.group(1)} ch{int(mm.group(2))}: {h}")
    syl = [f"{r['source_ref']}: {r['heading']}" for r in mine if r["source"] == "syllabus"]
    pyq = [f"{r['source_ref']}: {r['heading']}" for r in mine if r["source"] == "pyq"]
    return chaps, heads, syl, pyq


def main():
    tid = sys.argv[1]
    part = int(sys.argv[sys.argv.index("--part") + 1]) if "--part" in sys.argv else 1
    cat = {r["id"]: r for r in csv.DictReader(open(ROOT / "docs/upsc/catalogue.csv", encoding="utf-8"))}
    c = cat[tid]
    ser = [r for r in csv.DictReader(open(ROOT / "docs/upsc/series.csv", encoding="utf-8")) if r["kind"] == "home"]
    me = [r for r in ser if r["topic"] == tid]
    same = [r for r in ser if me and r["serial"] == me[0]["serial"]]
    i = same.index(me[0]) if me else 0
    prev = same[i - 1]["title"] if me and i else "none (first episode of the serial)"
    nxt = next((r["title"] for r in same[i + 1:] if r["topic"] != tid), "none")
    chaps, heads, syl, pyq = chapters_and_headings(tid, c)
    L = []
    L.append(f"You are the researcher for an educational video series that teaches the UPSC Civil Services syllabus in depth, "
             f"so that students can use it as their main study reference. Research the topic below thoroughly, using web search "
             f"and the official PDFs. Today's date is in your system; use it.")
    L.append("")
    L.append(f"TOPIC: {c['title']}")
    L.append(f"COVERS: {c['covers']}")
    L.append(f"SUBJECT: {c['subject']}" + (f", serial episode {me[0]['episode']} of season '{me[0]['season_title']}', {len(me)} part(s); this is part {part}" if me else ""))
    L.append(f"PREVIOUS EPISODE: {prev}. NEXT EPISODE: {nxt}. Do not cover their ground in depth.")
    L.append("")
    if chaps:
        L.append("NCERT CHAPTERS TO READ FIRST (current editions at https://ncert.nic.in/textbook/pdf/<code><chapter number, two digits>.pdf, for example iest106.pdf):")
        L += [f"- {b} ({cl}), chapter {n} {t}" for b, cl, n, t in chaps]
        L.append("Also look for any other current NCERT chapter that teaches this topic, and say which.")
        if tid in CHAPTERS and CHAPTERS[tid][1]:
            L.append(CHAPTERS[tid][1])
        L.append("")
    if heads:
        L.append("EVERY ONE OF THESE NCERT HEADINGS MUST BE COVERED BY AT LEAST ONE CLAIM (or marked 'not for this topic' with a reason):")
        L += [f"- {h}" for h in heads]
        L.append("")
    if syl:
        L.append("UPSC SYLLABUS WORDS FOR THIS TOPIC:"); L += [f"- {s}" for s in syl]; L.append("")
    if pyq:
        L.append("PAST UPSC QUESTIONS ON THIS TOPIC (the episode must let a viewer answer these):"); L += [f"- {s}" for s in pyq]; L.append("")
    L.append("""SOURCE RULES
1. NCERT first: what NCERT says, with book, class, chapter and printed page.
2. Then the publisher of record for every law, article, judgment, official figure, definition, date and current position:
   the Constitution and Acts (legislative.gov.in, indiacode.nic.in), Supreme Court judgments, Parliament (sansad.in),
   Election Commission, RBI, MoSPI, IMD, ministries, PIB, Census.
3. For ideas beyond NCERT: IGNOU (egyankosh.ac.in), NIOS, and named university-press scholars.
4. Never use as evidence: news sites, blogs, coaching or exam-prep sites, Wikipedia, YouTube, or other AI answers.
5. Open every source you cite and give the exact page URL, not a home page. Never invent a URL, page, number or date.
   If you cannot find something at an allowed source, mark it NOT FOUND. That is a good answer; a wrong answer is the worst.
6. Report disagreement as disagreement and name who holds each view. Say who said a thing and in what capacity
   (NCERT Class 9, the Supreme Court majority, one judge, the Election Commission). Mark your own inference as inference.
7. Quote at most 15 words from any source. Use your own words otherwise.
8. No party politics, no opinion on governments or politicians, no mocking any community or state.
9. Current, not dated: give the position as it stands today, checked at the publisher (the current commission, law,
   scheme, rate or data series). Older versions appear only as history, with dates, where they explain today.

AUDIENCE: anyone who wants to understand the subject, not only exam candidates: a student, a parent, a curious teenager.
The video must be thorough and fun, so also collect material that makes it easy and enjoyable to learn.

WHAT TO RETURN (plain text and tables, so it can be pasted back):

PART A. DOSSIER (about one page)
1. What the topic is, why it matters in a viewer's daily life, and the order a learner must meet its ideas in.
2. The hard parts and common misconceptions, each with the correct position and its source.
3. Debates: who holds which view.
4. What has changed since the NCERT text was written, with dates.
5. Sensitive points.
6. How many 10-minute parts this topic needs, and where to split.

PART B. CLAIMS TABLE (40 to 80 rows; one checkable fact per row; cover everything a thorough teacher would say)
| ID | Claim | Source (publisher, title) | Exact URL | Page or section | Status: FOUND / CONFLICT / NOT FOUND | Note |

PART C. HEADING CHECK
| NCERT heading (from the list above) | Claim IDs that cover it, or "not for this topic" with a reason |

PART D. MATERIAL FOR UNDERSTANDING AND FUN (each item sourced like a claim, with an ID in the claims table)
- Everyday examples from a viewer's own life that show each idea (a price paid, a bank message, a bill).
- Real examples from India today, with dates and the official source.
- Surprising true facts a viewer would want to share.
- Short real stories of people, institutions or decisions behind the idea.
- Questions people commonly ask about this topic, and the common confusions.
- Ideas for "guess first" moments, small games or "spot the mistake" questions, with the correct answer sourced.

PART E. OPEN ITEMS
Everything you could not find or could not open, and why.""")
    text = "\n".join(L) + "\n"
    out = ROOT / "docs/upsc/prompts"; out.mkdir(parents=True, exist_ok=True)
    (out / f"{tid}_p{part}_research.md").write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    sys.exit(main())

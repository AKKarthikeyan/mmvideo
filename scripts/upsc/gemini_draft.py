#!/usr/bin/env python3
"""Gemini does the first pass of an episode: research (with Google Search) and a first-draft script.
Claude then checks the research at its sources and revises the script (docs/upsc/PIPELINE.md).

  zsh -lic 'python3 -I scripts/upsc/gemini_draft.py POL-41 [--part 1] [--model gemini-3.1-pro-preview] [--step research|draft|both]'

Writes research/upsc/<id>/gemini/: research_raw.md, research.json, grounding.json, draft_p<N>.json, usage.json.
Gemini's output is a lead, never evidence: every claim it returns stays UNCHECKED until it is opened at its source.
The key is read from GEMINI_API_KEY in the environment (the Mini's login shell) and is never printed or written.
"""
import argparse, csv, json, os, pathlib, re, sys, time, urllib.error, urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
UP = ROOT / "research/upsc"
API = "https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent"
MAPS = {"POL": "polity", "HIS": "history", "GEO": "geography", "ECO": "economics"}

RULES = """House rules (Gold Standard and storytelling, condensed):
- NCERT first: name the current NCERT chapters for this topic (book, class, chapter, pages). Then the publisher of record
  (Constitution and Acts at legislative.gov.in or indiacode.nic.in, Supreme Court judgments, Parliament, RBI, MoSPI, IMD,
  ministries, Census) for every figure, law and current position. Government teaching material (IGNOU, NIOS) and
  university-press scholars only for what goes beyond NCERT, named.
- Never use news sites, blogs, coaching sites, Wikipedia or AI answers as evidence. Never invent a URL, page, date or number.
  If you could not open a source, say so. A claim you cannot support is marked UNVERIFIED. Wrong and confident is the worst outcome.
- Report disagreement as disagreement, naming who holds each view. Say who said something and in what capacity
  (the Court's majority, one judge, NCERT Class 11, IMD). Mark your own inference as inference.
- Never quote more than 15 words from any source.
- Teaching: as simple as a child can follow, as deep as the exam needs. Every concept climbs five rungs: a picture from
  daily life, the real term, the real mechanism, where it gets hard (exceptions, limits, debates), one exam-grade sentence.
  Keep every technical term; define it before use. One idea per sentence. Analogies are labelled with where they stop being true.
- No politics, no party views, no mocking any community or state. Contested history: evidence and named views only.
"""

STORY = """Script rules (storytelling v2):
- One promise: the title's question, delivered in the first sentence, in the title's own words.
- Pick one arc: three-act, story-circle, kishotenketsu, misconception-first, wow-first, serial-momentum, evidence-first,
  modular-value or claim-verdict. Say why.
- Stacked open loops: one primary (opens by 0:30, answered last), a secondary, a tertiary, and small micro loops; a question
  opened or answered at least every 3 minutes; a small question answered by 2:00. The link between beats is "but" or
  "therefore", never "and then". A "turn" beat where the first answer is complicated or reversed.
- Pay off and stop: the exam-ready answer is part of the payoff; after it only a short hand-off to the next episode
  (under 30 seconds). No spoken subscribe or like ask.
- Sentences of 15 words or fewer where possible, never over 20. Numbers as words in `say`, numerals in `cap`.
  On-screen text is keywords only. Every factual sentence lists the claim ids that support it.
- About 1,500 spoken words (about 10 minutes) for one part.
"""


def call(model, key, prompt, search=False, json_out=False, max_tokens=32768):
    body = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.3, "maxOutputTokens": max_tokens}}
    if search:
        body["tools"] = [{"google_search": {}}]
    if json_out:
        body["generationConfig"]["responseMimeType"] = "application/json"
    req = urllib.request.Request(API.format(m=model), data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json", "x-goog-api-key": key})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=900) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:400]
            if e.code in (429, 500, 503) and attempt < 2:
                time.sleep(30 * (attempt + 1)); continue
            raise SystemExit(f"Gemini HTTP {e.code}: {msg}")
    raise SystemExit("Gemini: no response")


def text_of(resp):
    c = resp.get("candidates", [{}])[0]
    return "".join(p.get("text", "") for p in c.get("content", {}).get("parts", [])), c.get("groundingMetadata", {})


def resolve(uri):
    """Grounding links are redirects; follow one hop to get the publisher's address (no page body is read)."""
    try:
        req = urllib.request.Request(uri, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.geturl()
    except Exception as e:
        return f"UNRESOLVED ({type(e).__name__})"


def context(tid):
    cat = {r["id"]: r for r in csv.DictReader(open(ROOT / "docs/upsc/catalogue.csv", encoding="utf-8"))}
    if tid not in cat:
        raise SystemExit(f"{tid} is not in docs/upsc/catalogue.csv")
    c = cat[tid]
    ser = [r for r in csv.DictReader(open(ROOT / "docs/upsc/series.csv", encoding="utf-8")) if r["kind"] == "home"]
    me = [r for r in ser if r["topic"] == tid]
    neigh = ""
    if me:
        same = [r for r in ser if r["serial"] == me[0]["serial"]]
        i = same.index(me[0])
        prev = same[i - 1]["title"] if i else "(first episode of the serial)"
        nxt = next((r["title"] for r in same[i + 1:] if r["topic"] != tid), "(last episode)")
        neigh = f"Serial {me[0]['serial']}, season {me[0]['season']} ({me[0]['season_title']}), {len(me)} part(s). Previous episode: {prev}. Next episode: {nxt}."
    rows = []
    m = MAPS.get(tid[:3])
    if m:
        allrows = list(csv.DictReader(open(UP / f"_map/{m}_subtopics.csv", encoding="utf-8")))
        rows = [r for r in allrows if tid in re.split(r"[;| ]+", r["topic_id"])]
        if not rows:   # a topic created from the map's gaps: take the unassigned rows that match its own words
            words = [w for w in re.findall(r"[a-z]{5,}", (c["title"] + " " + c["covers"]).lower())]
            rows = [r for r in allrows if r["topic_id"] == "NONE" and any(w in (r["heading"] + " " + r["subheading"]).lower() for w in words)]
    sub = "\n".join(f"- [{r['source']}] {r['source_ref']} | {r['heading']}" + (f" > {r['subheading']}" if r["subheading"] else "") for r in rows[:220])
    # The NCERT chapters themselves (local copies, for Gemini to read; not published anywhere), deepest first, about 60k words at most.
    chap, seen = [], set()
    for r in rows:
        mm = re.match(r"\s*([a-z]{4,5}\d)\s*,.*?\bch(?:apter)?\s*(\d+)", r["source_ref"], re.I) if r["source"] == "ncert" else None
        if mm and (mm.group(1), int(mm.group(2))) not in seen:
            seen.add((mm.group(1), int(mm.group(2))))
            f = UP / "_ncert" / f"{mm.group(1)}{int(mm.group(2)):02d}.txt"
            if f.exists():
                chap.append((f.name, re.sub(r"[ \t]+", " ", f.read_text(errors="ignore"))))
    chap.sort(key=lambda x: -len(x[1]))
    text, n = [], 0
    for name, t in chap:
        w = len(t.split())
        if n + w > 60000: continue
        text.append(f"=== NCERT {name} ===\n{t}"); n += w
    return c, neigh, sub, "\n\n".join(text)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("tid"); ap.add_argument("--part", type=int, default=1)
    ap.add_argument("--model", default="gemini-3.1-pro-preview"); ap.add_argument("--step", default="both")
    a = ap.parse_args()
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        raise SystemExit("GEMINI_API_KEY is not set: run inside zsh -lic on the Mini")
    out = UP / a.tid / "gemini"; out.mkdir(parents=True, exist_ok=True)
    c, neigh, sub, ncert = context(a.tid)
    usage = json.load(open(out / "usage.json")) if (out / "usage.json").exists() else []
    topic = (f"Topic {a.tid}: {c['title']}\nCovers: {c['covers']}\nSubject: {c['subject']}. Syllabus tags: {c['syllabus']}\n{neigh}\n"
             f"Subtopic map (NCERT headings, syllabus phrases and past-paper ideas this topic must cover):\n{sub or '(none mapped yet)'}\n")

    if a.step in ("research", "both"):
        prompt = (f"You are the researcher for an educational cartoon video series that teaches the UPSC Civil Services syllabus "
                  f"in depth. Research this topic for part {a.part}. Today is {time.strftime('%d %b %Y')}.\n\n{topic}\n{RULES}\n"
                  "Return two things. First, a short plain-language dossier: what the topic is and the order a learner should meet "
                  "its ideas; the hard parts and common misconceptions with the correct position; debates and who holds which view; "
                  "what changed since NCERT was written, with dates; sensitive points; how many 10-minute parts the topic needs and why.\n"
                  "Second, one fenced ```json block with: {\"ncert_map\": [{\"book\", \"class\", \"chapter\", \"pages\", \"role\"}], "
                  "\"checklist\": [{\"item_id\", \"type\": \"ncert_heading|ncert_concept|syllabus_term|current_position|debate|misconception|past_paper\", "
                  "\"item\", \"source_ref\", \"part\"}], \"claims\": [{\"claim_id\", \"claim\", \"value\", \"as_of\", \"source\", \"url\", "
                  "\"page_or_section\", \"status\": \"FOUND|UNVERIFIED|CONFLICT\", \"second_source\", \"second_url\", \"note\"}], "
                  "\"open_items\": [string], \"parts\": number, \"beyond_ncert\": [{\"q\", \"why\"}]}. In this pass, write claims only "
                  "from the NCERT text below. Put everything the topic needs from outside NCERT (articles of the Constitution, laws, "
                  "judgments, official figures and definitions, the current position, debates among scholars) as 10 to 25 precise "
                  "questions in beyond_ncert; a second pass will search for them. One fact per claim, written so it can be checked. Cover everything "
                  "a thorough teacher would say for this part, not only the headline facts: every NCERT heading in the map must have "
                  "at least one claim or checklist item, and expect 40 to 80 claims for a full topic.\n"
                  "Sources: for what NCERT says, cite the chapter text given below by book code, chapter and printed page "
                  "(url = https://ncert.nic.in/textbook/pdf/<code>.pdf). For everything beyond NCERT (laws, articles, judgments, "
                  "figures, dates, official definitions, current position), do not write claims here: list them in beyond_ncert.\n\n"
                  f"NCERT chapter text (for reading only; quote at most 15 words):\n{ncert or '(no NCERT chapter on file)'}")
        r = call(a.model, key, prompt)
        txt, gm = text_of(r)
        (out / "research_raw.md").write_text(txt, encoding="utf-8")
        chunks = [dict(title=ch.get("web", {}).get("title"), uri=ch.get("web", {}).get("uri")) for ch in gm.get("groundingChunks", [])]
        for ch in chunks:
            ch["resolved"] = resolve(ch["uri"]) if ch["uri"] else ""
        json.dump(dict(queries=gm.get("webSearchQueries", []), chunks=chunks), open(out / "grounding.json", "w"), indent=1)
        mjs = re.search(r"```json\s*(\{.*\})\s*```", txt, re.S)
        if not mjs:
            raise SystemExit("research: no JSON block in Gemini's answer (see research_raw.md)")
        res = json.loads(mjs.group(1))
        json.dump(res, open(out / "research.json", "w"), indent=1, ensure_ascii=False)
        usage.append(dict(step="research", model=a.model, at=time.strftime("%Y-%m-%d %H:%M"), usage=r.get("usageMetadata", {})))
        print(f"research: {len(res.get('claims', []))} claims, {len(res.get('checklist', []))} checklist items, "
              f"{len(chunks)} grounding sources, parts {res.get('parts')}")

    if a.step in ("research", "search", "both"):
        res = json.load(open(out / "research.json"))
        qs = res.get("beyond_ncert", [])
        found, allchunks = [], []
        OFFICIAL = re.compile(r"(\.gov\.in|\.nic\.in|sansad\.in|rbi\.org\.in|sci\.gov\.in|ncert|ignou|nios|eci\.gov|\.ac\.in|un\.org|imf\.org|worldbank\.org|wto\.org|cambridge\.org|oup\.com)", re.I)
        for i, q in enumerate(qs, 1):            # one plain question a call: that is what makes the model search
            prompt = (f"Search the web: {q.get('q')}\nAnswer in two to four sentences, only from official or academic publishers "
                      "(Indian government sites, Parliament, courts, the Election Commission, RBI, NCERT, IGNOU, NIOS, universities). "
                      "Not news, blogs, coaching sites or Wikipedia. Name the publisher and page you used. If no such source has it, say NOT FOUND.")
            r = call(a.model, key, prompt, search=True, max_tokens=4096)
            txt, gm = text_of(r)
            ch = [dict(title=c.get("web", {}).get("title"), uri=c.get("web", {}).get("uri")) for c in gm.get("groundingChunks", [])]
            for c in ch:
                c["resolved"] = resolve(c["uri"]) if c["uri"] else ""
                c["q"] = f"Q{i}"
            allchunks += ch
            off = [c["resolved"] for c in ch if OFFICIAL.search(c["resolved"] or "") or OFFICIAL.search(c["title"] or "")]
            status = "NOT FOUND" if ("NOT FOUND" in txt.upper() or not ch) else ("FOUND" if off else "UNOFFICIAL ONLY")
            found.append(dict(q=q.get("q"), answer=" ".join(txt.split()), claim=" ".join(txt.split())[:400],
                              source="; ".join(c["title"] or "" for c in ch if c["resolved"] in off)[:200],
                              url=off[0] if off else (ch[0]["resolved"] if ch else ""), page_or_section="",
                              status=status, searched=bool(ch), note=f"{len(ch)} pages from search; official: {len(off)}"))
            usage.append(dict(step=f"search Q{i}", model=a.model, at=time.strftime("%Y-%m-%d %H:%M"),
                              queries=gm.get("webSearchQueries", []), usage=r.get("usageMetadata", {})))
        n0 = len(res.get("claims", []))
        for k, x in enumerate(found, 1):
            if x.get("status") in ("NOT FOUND", "UNOFFICIAL ONLY"):
                res.setdefault("open_items", []).append(f"not found by search: {x.get('q')} {x.get('note', '')}"); continue
            res["claims"].append(dict(claim_id=f"S{k:02d}", claim=x.get("claim", ""), value=x.get("answer", ""), as_of="",
                                      source=x.get("source", ""), url=x.get("url", ""), page_or_section=x.get("page_or_section", ""),
                                      status=x.get("status", "FOUND"), second_source="", second_url="",
                                      note=x.get("note", "")))
        json.dump(res, open(out / "research.json", "w"), indent=1, ensure_ascii=False)
        json.dump(dict(chunks=allchunks), open(out / "grounding.json", "w"), indent=1)
        print(f"search: {len(qs)} questions, {len(res['claims']) - n0} claims added, {len(allchunks)} sources opened, "
              f"{sum(1 for x in found if x['status'] == 'FOUND')} answered from an official page, {sum(1 for x in found if x['status'] != 'FOUND')} not")

    if a.step in ("draft", "both"):
        res = json.load(open(out / "research.json"))
        dossier = (out / "research_raw.md").read_text(encoding="utf-8").split("```json")[0]
        prompt = (f"You write the first draft of a script for part {a.part} of this episode of an educational cartoon series "
                  f"(a curious kid and an unseen narrator; flat 2D cartoon, maps and diagrams).\n\n{topic}\n{RULES}\n{STORY}\n"
                  f"Research dossier:\n{dossier}\n\nResearch ledger (use only these claims; cite their ids):\n"
                  f"{json.dumps(dict(claims=res.get('claims', []), checklist=[i for i in res.get('checklist', []) if str(i.get('part', '1')) in (str(a.part), '')]), ensure_ascii=False)}\n\n"
                  "Return JSON only: {\"title\", \"promise\", \"arc\", \"arc_reason\", \"tier\": \"broad|nurture|authority\", "
                  "\"beats\": [{\"ch\": int, \"key\": \"b00\", \"link\": \"\"|\"but\"|\"therefore\", \"say\", \"cap\", \"pic\", "
                  "\"claims\": [claim ids], \"rung\", \"term\", \"note\"}], \"loops\": [{\"id\", \"kind\": \"primary|secondary|tertiary|micro\", "
                  "\"q\", \"open\": beat key, \"close\": beat key}], \"turn\": beat key, \"plants\": [[setup key, payoff key]], "
                  "\"critical\": [{\"what\", \"src\"}], \"fallback\", \"checklist_covered\": [item ids], \"checklist_left_for_later\": [item ids]}.")
        r = call(a.model, key, prompt, json_out=True)
        txt, _ = text_of(r)
        d = json.loads(txt)
        json.dump(d, open(out / f"draft_p{a.part}.json", "w"), indent=1, ensure_ascii=False)
        usage.append(dict(step=f"draft p{a.part}", model=a.model, at=time.strftime("%Y-%m-%d %H:%M"), usage=r.get("usageMetadata", {})))
        words = sum(len(b.get("say", "").split()) for b in d.get("beats", []))
        print(f"draft p{a.part}: {len(d.get('beats', []))} beats, {words} words, arc {d.get('arc')}")
    json.dump(usage, open(out / "usage.json", "w"), indent=1)


if __name__ == "__main__":
    sys.exit(main())

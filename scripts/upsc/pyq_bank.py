#!/usr/bin/env python3
"""Mains question bank: every question of the downloaded Mains papers (GS I-III and the Geography, Economics, PSIR and
Agriculture optionals, 2016-2026), one row per question or part, tagged by subject, directive word and a first-pass link
to a catalogue topic.

  python3 -I scripts/upsc/pyq_bank.py

Reads research/upsc/_pyq/mains/<year>_<paper>.txt (OCR of UPSC's own PDFs; the papers are bilingual and only the English
lines are kept). Writes research/upsc/_pyq/mains/questions.csv and BANK_CHECK.md (git-ignored: question text is UPSC's).
The topic link is a keyword match, a first pass for planning; a person checks it before a video is made.
"""
import csv, math, pathlib, re, sys
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parents[2]
D = ROOT / "research/upsc/_pyq/mains"
WORDS = {w.strip().lower() for w in open("/usr/share/dict/words", encoding="utf-8", errors="ignore")}
WORDS |= {"india", "indian", "gdp", "upsc", "covid", "gst", "rbi", "msp", "wto", "brics", "asean", "saarc", "un", "fdi",
          "ngos", "ngo", "msme", "msmes", "aadhaar", "panchayati", "lok", "sabha", "rajya", "himalayas", "himalayan"}
PAPER_SUBJECT = {"geo1": "Geography", "geo2": "Geography", "eco1": "Economics", "eco2": "Economics",
                 "psir1": "Polity", "psir2": "International relations", "agri1": "Agriculture", "agri2": "Agriculture"}
DIRECTIVES = ["critically examine", "critically analyse", "critically evaluate", "critically discuss", "critically comment",
              "discuss", "examine", "analyse", "analyze", "evaluate", "explain", "elucidate", "describe", "comment", "elaborate",
              "highlight", "compare", "distinguish", "differentiate", "justify", "assess", "bring out", "account for", "illustrate",
              "trace", "identify", "enumerate", "outline", "define", "what", "why", "how", "do you", "can", "is it", "give"]
# GS subject by keywords (a first pass; GS I = history, society, geography; GS II = polity, governance, social justice, IR;
# GS III = economy, agriculture, science, environment, security, disasters).
GS_KEYS = {
    "gs1": [("Geography", r"monsoon|cyclone|climat|ocean|river|earthquake|volcan|landslide|mineral|soil|glacier|desert|"
                          r"coral|wetland|rainfall|drought|flood|plateau|mountain|island|latitude|tectonic|urbani[sz]|"
                          r"industr(y|ies) location|resource|population|migration|water|forest|el ni|jet stream|tsunami"),
            ("History", r"art|architect|temple|sculpt|dynasty|mughal|british|colonial|freedom|gandhi|nehru|1857|revolt|"
                        r"movement|war|century|revolution|empire|ancient|medieval|bhakti|sufi|literature|independence|partition"),
            ("Society", r"women|caste|tribal|secular|communal|globali[sz]ation|diversity|family|urban|poverty|elderly|youth|"
                        r"social|culture|religio")],
    "gs2": [("International relations", r"foreign|bilateral|treaty|united nations|\bun\b|wto|brics|asean|saarc|bimstec|"
                                        r"quad|diaspora|china|pakistan|nepal|bangladesh|sri lanka|myanmar|afghanistan|"
                                        r"usa|united states|russia|japan|africa|gulf|indo-pacific|global|international|"
                                        r"neighbour|g-?20|sco|imf|world bank|nuclear"),
            ("Social justice", r"health|education|poverty|hunger|welfare|women|child|disab|vulnerable|scheme|self-help|"
                               r"ngo|civil society|tribal|minorit|elderly|nutrition|malnutrition"),
            ("Polity", r"constitution|article|parliament|legislat|judiciar|supreme court|high court|governor|president|"
                       r"federal|election|fundamental|amendment|panchayat|municipal|tribunal|commission|speaker|"
                       r"cabinet|ordinance|rights|accountab|transparen|governance|e-governance|bureaucra|civil serv")],
    "gs3": [("Agriculture", r"agricultur|farm|crop|irrigat|msp|food process|livestock|fisher|seed|fertili[sz]|"
                            r"land reform|food security|pds|apmc|horticult|dairy"),
            ("Environment", r"environment|pollut|climate|biodivers|conserv|emission|carbon|wildlife|eia|wetland|forest"),
            ("Security", r"terror|security|insurgen|naxal|left wing|border|cyber|money laundering|extremis|armed forces|"
                         r"organi[sz]ed crime|smuggl"),
            ("Disaster management", r"disaster|earthquake|flood|cyclone|landslide|drought|tsunami|heat wave"),
            ("Science and technology", r"technolog|space|isro|satellite|nano|biotech|robot|artificial intelligence|"
                                       r"\bai\b|nuclear|vaccine|genome|quantum|drone|semiconductor|5g|blockchain"),
            ("Economics", r".")],
}
SUBJECT_TO_CAT = {"Geography": "Geography", "Economics": "Economics", "Polity": "Polity", "Agriculture": "Agriculture",
                  "History": "History", "Social justice": "Polity",
                  "Environment": "Geography", "Disaster management": "Geography"}


def english(line):
    toks = re.findall(r"[A-Za-z]+", line)
    if len(toks) < 2:
        return False
    good = sum(1 for t in toks if t.lower() in WORDS and (len(t) > 2 or t.lower() in {"a", "an", "of", "in", "to", "is", "on", "by", "or", "as", "it", "be", "do", "at"}))
    return good / len(toks) >= 0.6


def body(text):
    """Lines after the instructions (the last 'struck off' line), with page footers dropped."""
    lines = text.splitlines()
    cut = max((i for i, l in enumerate(lines) if re.search(r"struck\s+off|crossed\s+out", l, re.I)), default=-1)
    out = []
    for l in lines[cut + 1:]:
        if re.search(r"^\s*[A-Z]{2,4}-[A-Z]-[A-Z]{2,5}|^\s*[A-Z]-[A-Z]{3,}|SDF-|\bP\.T\.O\b|^\s*\d+\s*$", l):
            continue
        out.append(l.rstrip())
    return out


MARK = r"(?:10|15|20|12\s*[½1/2]{0,3}|12\.5|8|5|40|50)"
QSTART = re.compile(r"^\s*Q?\s*(\d{1,2})\s*[.)]\s*(?:\(([a-e])\)\s*)?")
PSTART = re.compile(r"^\s*\(([a-e]|co|ce|b\)|d\)|c\)|e\))\)?\s*")


def units(lines, optional):
    """Walk the lines; question and part markers set the current unit, English lines join it."""
    cur, res, order = None, {}, []
    for l in lines:
        q = QSTART.match(l)
        p = None
        if q and int(q.group(1)) <= (8 if optional else 20):
            n = int(q.group(1))
            part = q.group(2) or ""
            cur = (n, part if optional else "")
            l = l[q.end():]
        elif optional and re.match(r"^\s*\(([a-e]|co|ce)\)", l):
            p = re.match(r"^\s*\(([a-e]|co|ce)\)\s*", l)
            letter = {"co": "c", "ce": "e"}.get(p.group(1), p.group(1))
            if cur:
                cur = (cur[0], letter)
            l = l[p.end():]
        if cur is None or not l.strip():
            continue
        if english(l):
            if cur not in res:
                res[cur] = []; order.append(cur)
            res[cur].append(l.strip())
    return [(k, " ".join(res[k])) for k in order]


def split_by_limit(lines):
    """GS fallback: the English text, cut after each '(Answer in N words)'."""
    t = " ".join(l.strip() for l in lines if english(l))
    t = re.sub(r"^.*?(answers? the following|in not more than \d+ words each.*?\d+\s*=\s*\d+)", "", t, flags=re.I | re.S) if False else t
    parts = re.split(r"(\(\s*Answer\s+in\s+\d+\s+words\s*\)\s*(?:\d+\s*)?)", t, flags=re.I)
    out = []
    for i in range(0, len(parts) - 1, 2):
        out.append(parts[i].strip() + " " + parts[i + 1].strip())
    return out


def clean(t):
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"^(Answer the following.*?each\s*:?\s*[\dx×= ]*)", "", t, flags=re.I)
    return t


def marks_words(t, paper, qn, year):
    m = re.search(r"Answer\s+in\s+(\d+)\s+words\s*\)\s*(\d+)?", t, re.I)
    words = int(m.group(1)) if m else None
    mk = int(m.group(2)) if m and m.group(2) else None
    if mk is None:
        m2 = re.search(r"\b(10|15|20)\s*[—-]?\s*$", t)
        mk = int(m2.group(1)) if m2 else None
    if paper.startswith("gs"):
        if year == 2016:
            words, mk = 200, 12.5
        elif words is None:
            words = 150 if qn <= 10 else 250
        if mk is None:
            mk = 10 if qn <= 10 else 15
    return mk, words


def directive(t):
    """The instruction word: the last directive in the question (UPSC puts it at the end), longest match first."""
    low = t.lower()
    best = (-1, "")
    for d in sorted(DIRECTIVES, key=len, reverse=True):
        for m in re.finditer(r"\b" + d + r"\b", low):
            if m.start() > best[0] + (0 if len(d) > len(best[1]) else 3):
                best = (m.start(), d)
    return best[1]


def gs_subject(paper, t):
    low = t.lower()
    for subj, rx in GS_KEYS[paper]:
        if re.search(r"\b(?:" + rx + ")", low):
            return subj
    return ""


def topic_index():
    cat = list(csv.DictReader(open(ROOT / "docs/upsc/catalogue.csv", encoding="utf-8")))
    docs = {r["id"]: (r["subject"], Counter(w for w in re.findall(r"[a-z]{4,}", (r["title"] + " " + r["covers"]).lower()) if w not in STOP)) for r in cat}
    df = Counter(w for _, c in docs.values() for w in c)
    N = len(docs)
    return cat, docs, {w: math.log(N / (1 + n)) for w, n in df.items()}


STOP = set("what which with their there these those about from into that this have been were will would should could your more "
           "most other also such than them they then when where while does under over upon each between discuss examine explain "
           "analyse critically comment india indian words answer role factors present major".split())


def link(t, subj, idx):
    cat, docs, idf = idx
    want = SUBJECT_TO_CAT.get(subj)
    if not want:   # International relations, Society, Security, Science: no catalogue serial yet
        return "", 0.0
    ws = Counter(w for w in re.findall(r"[a-z]{4,}", t.lower()) if w not in STOP)
    best, score = "", 0.0
    for tid, (s, c) in docs.items():
        if want and s != want:
            continue
        sc = sum(idf.get(w, 0) for w in ws if w in c or (w[:-1] in c) or (w + "s" in c))
        if sc > score:
            best, score = tid, sc
    return (best, round(score, 1)) if score >= 4 else ("", round(score, 1))


def main():
    idx = topic_index()
    rows, check = [], []
    for f in sorted(D.glob("20??_*.txt")):
        year, paper = int(f.stem[:4]), f.stem[5:]
        optional = not paper.startswith("gs")
        ex = D / "extract" / f"{f.stem}.csv"
        if ex.exists():   # read by an agent from the OCR text, paper by paper (preferred)
            us = [((int(r["q"]), r["part"]), r["text"] + (f" (Answer in {r['words']} words) {r['marks']}" if r.get("words") else (f" {r['marks']}" if r.get("marks") else "")))
                  for r in csv.DictReader(open(ex, encoding="utf-8")) if r.get("q", "").strip().isdigit()]
            method = "agent read"
        else:
            lines = body(f.read_text(encoding="utf-8", errors="ignore"))
            us = units(lines, optional)
            method = "markers"
            if not optional and len([u for u in us if len(u[1]) > 40]) < 18:
                sp = split_by_limit(lines)
                if len(sp) >= 15:
                    us = [((i + 1, ""), s) for i, s in enumerate(sp)]
                    method = "word limit"
        n_ok = 0
        for (qn, part), t in us:
            t = clean(t)
            if len(t) < 12:
                continue
            n_ok += 1
            mk, words = marks_words(t, paper, qn, year)
            t2 = re.sub(r"\(\s*Answer\s+in\s+\d+\s+words\s*\)\s*\d*\s*$", "", t, flags=re.I).strip()
            t2 = re.sub(r"\s*\b(10|15|20|12\s*[—-]+)\s*$", "", t2).strip()
            subj = PAPER_SUBJECT.get(paper) or gs_subject(paper, t2)
            tid, sc = link(t2, subj, idx)
            rows.append(dict(year=year, paper=paper, q=qn, part=part, marks=mk or "", words=words or "",
                             directive=directive(t2), subject=subj, topic=tid, link_score=sc, text=t2))
        want = "20" if not optional else "about 28 (8 questions; Q1 and Q5 in 5 parts)"
        check.append(f"| {year} | {paper} | {method} | {n_ok} | {want} |")
    with open(D / "questions.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
    md = ["# Question bank check (`scripts/upsc/pyq_bank.py`)", "", f"{len(rows)} questions or parts from {len(check)} papers.", "",
          "| Year | Paper | Split by | Found | Expected |", "|---:|---|---|---:|---|"] + check
    (D / "BANK_CHECK.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print(f"{len(rows)} rows from {len(check)} papers")


if __name__ == "__main__":
    sys.exit(main())

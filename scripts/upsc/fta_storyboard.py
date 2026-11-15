#!/usr/bin/env python3
"""Builds the storyboard of one Fix This Answer episode (look B) from its module, checks it, then writes its estimated timeline.

  python3 scripts/upsc/fta_storyboard.py fta-01     # research/upsc/fta/fta-01/fta.py -> public/datayt/long/upsc/fta-01/{storyboard,timeline}.json

The module (fta.py) is the single source of the page, the repair and the narration. The question and the transfer question come
from their answer modules (research/upsc/pyq/<id>/answer.py), so their wording, budget and minutes are the checked ones.
Checks, and the build stops on any of them:
  - every number on screen in a repair line, a note, a card line or the transfer card is in the claims it cites (claim + value +
    source of the ledger rows) or in the answer modules' budget and minutes; the illustrative answer's own numbers are reported, not locked
  - every reveal word is a word of its scene's narration; every op has a key that is revealed
  - the storyboard's narration is the module's, word for word
  - the words left on the page after the repair are within the count the narration says (SAID_COUNT)
Scene kinds and specs: src/looks/upsc_rich_b/fta/CONTRACT_FTA.md.
"""
import csv, importlib.util, json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RES = os.path.join(os.environ.get("UPSC_MAIN", ROOT), "research/upsc")      # UPSC_MAIN: the main checkout, if research lives elsewhere
UP = os.path.join(ROOT, "public/datayt/long/upsc")
DIRECTIVE_MEANING = {"describe": "set out how it works", "analyse": "split into parts, show the links"}


def module(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


def ledger(names):
    rows = {}
    for led in names:
        with open(os.path.join(RES, led, "claims.csv"), encoding="utf-8") as fh:
            for r in csv.DictReader(fh):
                rows[r["claim_id"]] = " ".join([r["claim"], r["value"], r.get("source", "")])
    return rows


NUM = re.compile(r"\d[\d,]*(?:\.\d+)?")
words = lambda t: len([w for w in t.replace("_", "").split() if re.search(r"[A-Za-z0-9₹]", w)])
toks = lambda t: re.findall(r"[\w'’-]+[.,?!:]?", t)


def main():
    eid = sys.argv[1]
    src = os.path.join(RES, "fta", eid, "fta.py")
    F = module(src, "fta")
    QA = module(os.path.join(RES, F.QUESTION, "answer.py"), "qa").A
    TA = module(os.path.join(RES, F.TRANSFER, "answer.py"), "ta").A
    LED = ledger(F.LEDGERS + [F.TRANSFER])
    problems, notes = [], []
    allowed = {str(x) for x in (*QA["budget"], QA["minutes"], *TA["budget"], TA["minutes"], QA["marks"] if "marks" in QA else 0)}

    def lock(where, text, claims, illustrative=False):
        pool = " ".join(LED.get(c, "") for c in claims)
        missing = [c for c in claims if c not in LED]
        if missing:
            problems.append(f"{where}: claim ids not in the ledgers: {missing}")
        have = {x.replace(",", "") for x in NUM.findall(pool)} | allowed
        clean = re.sub(r"\b[AD]\d+\b", "", text)                      # rule ids (A1-A12) and demand ids (D1) are labels, not figures
        for x in NUM.findall(clean):
            if x.replace(",", "") not in have:
                (notes if illustrative else problems).append(f"{where}: {x} {'(illustrative, not locked)' if illustrative else 'is not in its claims'}")

    items = {it["id"]: it for it in F.ITEMS}
    for it in F.ITEMS:
        lock(it["id"], it["text"], it.get("claims", []), illustrative=it["kind"] == "orig")
    for k, n in F.NOTES.items():
        lock(f"note {k}", n["text"], n["claims"])

    q = QA["question"]
    credit = f"UPSC CSE (Main) {q['year']} · {q['label']} · Q{q['q']}" + (f"({q['part']})" if q.get("part") else "")
    marks = f"{q['marks']} marks"
    t = TA["question"]
    tcredit = f"UPSC CSE (Main) {t['year']} · {t['label']} · Q{t['q']}" + (f"({t['part']})" if t.get("part") else "") + f" · {t['marks']} marks"
    demands = [dict(id=d["id"], label=d["label"]) for d in F.DEMANDS]
    if [d["id"] for d in F.DEMANDS] != [d["id"] for d in QA["demands"]]:
        problems.append("demand ids differ from the answer module's")

    page = dict(stamp=F.STAMP, items=[dict(id=i["id"], kind=i["kind"], text=i["text"]) for i in F.ITEMS], demands=demands,
                budget=list(QA["budget"]), minutes=QA["minutes"], notes={k: dict(kind=n["kind"], title=n["title"], tag=n["tag"], text=n["text"]) for k, n in F.NOTES.items()})
    ops0, scenes, n = [], [], 0
    for b in F.BEATS:
        ss = [s for s in re.split(r"(?<=[.?!])\s+", b["say"]) if s]
        for kind, idx, extra, reveals in b["scenes"]:
            n += 1
            vo = " ".join(ss[i] for i in idx) if idx else b["say"]
            ws = toks(vo)
            rv = list(reveals)
            if kind == "pyq_question":
                spec = dict(credit=credit, marks=marks, text=q["text"], glow=extra.get("glow", []))
            elif kind == "pyq_xray":
                spec = dict(text=q["text"], directives=[dict(word=w, meaning=m, key=k) for w, m, k, _ in extra["directives"]],
                            demands=[dict(id=d["id"], label=d["label"], key=d["id"].lower()) for d in demands])
                rv += [(k, w) for _, _, k, w in extra["directives"]] + [(d["id"].lower(), extra["demand_words"][d["id"]]) for d in demands]
            elif kind == "pyq_card":
                for l in extra["lines"]:
                    lock(f"{b['key']} card", l["text"], l["claims"])
                spec = dict(title=extra["title"], lines=[dict(text=l["text"], key=l["key"]) for l in extra["lines"]])
            elif kind == "fta_page":
                for op in extra["ops"]:
                    for i in op.get("ids", []):
                        if i not in items:
                            problems.append(f"{b['key']}: op {op['op']} names unknown line {i}")
                    if op["key"] not in {k for k, _ in rv}:
                        problems.append(f"{b['key']}: op {op['op']} key {op['key']} has no reveal word")
                spec = dict(page, ops0=[dict(o) for o in ops0], ops=extra["ops"])
                ops0 += [o for o in extra["ops"] if o["op"] in ("write", "stamp", "strike", "remove", "insert", "status")]
            elif kind == "fta_transfer":
                lock(f"{b['key']} transfer", extra["limits"], [])
                spec = dict(label="NOW YOU · SAME SKILL, NEW QUESTION", credit=tcredit, text=t["text"], skill=extra["skill"], limits=extra["limits"],
                            checks=extra["checks"], cta=extra["cta"])
            else:
                problems.append(f"{b['key']}: unknown kind {kind}")
                continue
            for k, w in rv:
                if not any(x == w or x.rstrip(".,?!:") == w.rstrip(".,?!:") for x in ws):
                    problems.append(f"s{n:03d} ({b['key']}): reveal word {w!r} not in the narration")
            scenes.append(dict(id=f"s{n:03d}", act=b["key"], kind=kind, spec=spec, vo=vo, reveals=[dict(key=k, word=w) for k, w in rv],
                               transition="cut", beat=b["key"]))

    # the page after every op: the words the narration counts
    gone = {i for o in ops0 if o["op"] == "remove" for i in o["ids"]}
    added = {i for o in ops0 if o["op"] == "insert" for i in o["ids"]}
    left = sum(words(it["text"]) for it in F.ITEMS if (it["kind"] == "orig" and it["id"] not in gone) or it["id"] in added)
    lo, hi = F.SAID_COUNT
    if not lo <= left <= hi:
        problems.append(f"the page keeps {left} words; the narration says {lo}-{hi}")
    if " ".join(s["vo"] for s in scenes).split() != " ".join(b["say"] for b in F.BEATS).split():
        problems.append("storyboard narration is not word for word the module's")

    out = os.path.join(UP, eid)
    os.makedirs(out, exist_ok=True)
    sb = os.path.join(out, "storyboard.json")
    for x in notes:
        print("  note", x)
    print(f"{len(scenes)} scenes; the repaired page keeps {left} words")
    for p in problems:
        print("  PROBLEM", p)
    if problems:
        return 1
    json.dump(dict(id=eid, format="long-16x9", target_minutes=round(sum(len(b["say"].split()) for b in F.BEATS) / 150, 1),
                   script=os.path.relpath(src, ROOT), scenes=scenes), open(sb, "w"), indent=1, ensure_ascii=False)
    print("->", os.path.relpath(sb, ROOT))
    r = subprocess.run([sys.executable, os.path.join(ROOT, "scripts/datayt/long_timeline.py"), sb, "--out", os.path.join(out, "timeline.json")],
                       capture_output=True, text=True)
    print(r.stdout.strip()[-600:], r.stderr.strip()[-600:])
    return r.returncode


if __name__ == "__main__":
    sys.exit(main())

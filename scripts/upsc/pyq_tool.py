#!/usr/bin/env python3
"""Checks and renders one Mains answer video (formats A, B, C; docs/upsc/PYQ_ANSWERS_PLAN.md).

  python3 -I scripts/upsc/pyq_tool.py research/upsc/pyq/<id>/answer.py [--story-check <story_check.py>] [--wpm 150]

The answer module defines A = dict(id, fmt, title, question, budget, minutes, ledgers, demands, sheet, weak, cousins, beats, story).
Checks: the question text matches the bank (research/upsc/_pyq/mains/questions.csv); the sheet stays inside its word budget;
every demand is covered by a sheet block; every claim id exists in a listed ledger with a status that may be used; every
number on the sheet appears in one of that block's claims (the number lock); narration sentences are short and beats are
joined by 'but' or 'therefore' (docs/STORYTELLING.md). Writes ANSWER.md beside the module.
"""
import csv, importlib.util, pathlib, re, shutil, subprocess, sys, tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
USE = {"CONFIRMED", "CORRECTED"}
NUM = re.compile(r"\d[\d,.]*")


def arg(flag, default=None):
    return sys.argv[sys.argv.index(flag) + 1] if flag in sys.argv else default


def load(path):
    spec = importlib.util.spec_from_file_location("answer", path)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.A


def words(t):
    return len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'’%.,°/-]*", t))


def norm(t):
    return re.sub(r"[^a-z0-9]+", " ", t.lower()).strip()


def sentences(t):
    return [s.strip() for s in re.split(r"(?<=[.?!])\s+", t) if s.strip()]


def main():
    path = pathlib.Path(sys.argv[1]).resolve()
    A = load(path)
    wpm = float(arg("--wpm", 150))
    claims = {}
    for led in A["ledgers"]:
        for r in csv.DictReader(open(ROOT / "research/upsc" / led / "claims.csv", encoding="utf-8")):
            claims[r["claim_id"]] = r
    fails, warns = [], []
    q = A["question"]

    bank = [r for r in csv.DictReader(open(ROOT / "research/upsc/_pyq/mains/questions.csv", encoding="utf-8"))
            if (int(r["year"]), r["paper"], int(r["q"]), r["part"]) == (q["year"], q["paper"], q["q"], q["part"])]
    if not bank:
        fails.append("question: not in the bank")
    elif norm(bank[0]["text"]) != norm(q["text"]):
        fails.append("question: text differs from the bank (check against the PDF)")

    plain = lambda s: s.replace("_", "")
    n = sum(words(plain(b["text"])) for b in A["sheet"] if b["kind"] != "diagram")
    lo, hi = A["budget"]
    if not lo <= n <= hi:
        fails.append(f"sheet: {n} words, budget {lo}-{hi}")
    # docs/upsc/ANSWER_STANDARD.md, rules A1-A10
    for d in A["demands"]:
        if not any(d["id"] in b.get("demands", []) for b in A["sheet"]):
            fails.append(f"demand {d['id']} ({d['text']}) is not covered by any sheet block")
        if not any(b["kind"] in ("head", "intro") and d["id"] in b.get("demands", []) for b in A["sheet"]):   # "explain the statement" is the intro's job
            fails.append(f"A1: demand {d['id']} has no heading of its own")
        if d.get("view") and not any(b["kind"] == "close" and d["id"] in b.get("demands", []) for b in A["sheet"]):
            fails.append(f"A2: demand {d['id']} asks for a view; the conclusion does not give it")
    for kind, cap, level in (("intro", 0.15, fails), ("close", 0.15, warns)):
        k = sum(words(plain(b["text"])) for b in A["sheet"] if b["kind"] == kind)
        if n and k / n > cap:
            level.append(f"A5/A10: {kind} is {k} words, {k / n:.0%} of the answer (cap {cap:.0%})")
    for i, b in enumerate(A["sheet"]):
        if b["kind"] == "para" and not b.get("formula"):
            warns.append(f"A6: sheet[{i}] is a paragraph in the body; toppers write points (mark formula=True for a derivation)")
        if b["kind"] in ("points", "para") and not b.get("claims"):
            fails.append(f"A7: sheet[{i}] names no source")
    marks = sum(len(re.findall(r"_[^_]+_", b["text"])) for b in A["sheet"])
    if not 4 <= marks <= 10:
        warns.append(f"A8: {marks} underlined terms (aim 4-10)")
    if sum(b["kind"] == "diagram" for b in A["sheet"]) > 1:
        warns.append("A9: more than one diagram")

    def check_claims(where, ids, text):
        for c in ids:
            if c not in claims:
                fails.append(f"{where}: claim {c} not in the ledgers")
            elif claims[c]["status"] not in USE:
                fails.append(f"{where}: claim {c} is {claims[c]['status']}")
        pool = " ".join(claims[c]["claim"] + " " + claims[c]["value"] for c in ids if c in claims)
        pool_n = {x.replace(",", "").rstrip(".") for x in NUM.findall(pool)}
        for x in NUM.findall(text):
            v = x.replace(",", "").rstrip(".")
            if v and v not in pool_n:
                fails.append(f"{where}: number {x} is not in its claims {ids}")

    for i, b in enumerate(A["sheet"]):
        txt = re.sub(r"^\d+\.\s*", "", b["text"]) if b["kind"] == "head" else b["text"]
        txt = txt.replace("_", "")   # section numbers are not figures
        lab = re.sub(r"^Fig\. \d+:\s*", "", b.get("label", "")) + " " + " ".join((b.get("labels") or {}).values()) + " " + " ".join(i["when"] + " " + i["what"] for i in b.get("items") or [])
        check_claims(f"sheet[{i}] {b['kind']}", b.get("claims", []), txt + " " + lab)
    for i, w in enumerate(A["weak"]):
        check_claims(f"weak[{i}]", w.get("claims", []), w["text"])

    spoken = 0
    for k, b in enumerate(A["beats"]):
        spoken += len(b["say"].split())
        check_claims(f"beat {b['key']}", b["claims"], "")
        if b["scene"]["type"] == "idea":   # idea captions are drawn on screen as cards: their numbers are locked to the beat's claims
            check_claims(f"beat {b['key']} cap", b["claims"], re.sub(r"\b(19|20)\d\d\b", "", b.get("cap", "")))
        if k and b["link"] not in ("but", "therefore"):
            fails.append(f"beat {b['key']}: link must be 'but' or 'therefore'")
        for s in sentences(b["say"]):
            m = len(s.split())
            if m > 20:
                fails.append(f"beat {b['key']}: {m}-word sentence: {s[:60]}")
            elif m > 15:
                warns.append(f"beat {b['key']}: {m}-word sentence: {s[:60]}")

    print(f"{A['id']}: sheet {n} words (budget {lo}-{hi}), {len(A['demands'])} demands, {len(A['beats'])} beats, "
          f"{spoken} spoken words, about {spoken / wpm:.1f} min")
    for w in warns:
        print("  warn ", w)
    for f in fails:
        print("  FAIL ", f)
    render(A, path, n)

    sc = arg("--story-check")
    if sc:
        with tempfile.TemporaryDirectory() as d:
            d = pathlib.Path(d) / "scripts"; d.mkdir()
            shutil.copy(sc, d / "story_check.py")
            beats = [dict(key=b["key"], say=b["say"], scene=b["scene"]) for b in A["beats"]]
            (d / "vx_scripts.py").write_text("VIDEOS = [" + repr(dict(id=A["id"], title=A["title"], beats=beats, story=A["story"])) + "]\n")
            r = subprocess.run([sys.executable, "-I", str(d / "story_check.py"), A["id"], "--wpm", str(wpm)], capture_output=True, text=True, cwd=d)
            print("story_check.py (exit %d):" % r.returncode)
            print(r.stdout.rstrip() or r.stderr.rstrip())
    return 1 if fails else 0


def render(A, path, n):
    q = A["question"]
    L = [f"# {A['id']}: {A['title']}", "", f"Format {A['fmt']}. Rendered by `scripts/upsc/pyq_tool.py` from `answer.py`; edit that file, not this one.", "",
         f"**Question** (UPSC CSE (Main) {q['year']}, {q['label']}, Q{q['q']}{'(' + q['part'] + ')' if q['part'] else ''}, {q['marks']} marks):",
         f"> {q['text']}", "", f"Checked against the PDF: {q['pdf']} page {q['page']}.", "",
         f"**Working budget:** {A['budget'][0]}-{A['budget'][1]} words, about {A['minutes']} minutes in the hall ({A['budget_note']}). Sheet: {n} words.", "",
         "## Demands", ""] + [f"- **{d['id']}** {d['text']}" for d in A["demands"]] + ["", "## The answer sheet", ""]
    for b in A["sheet"]:
        tag = f" _(demands {', '.join(b.get('demands', []))}; claims {', '.join(b.get('claims', []))})_"
        if b["kind"] == "head":
            L.append(f"**{b['text']}**{tag}")
        elif b["kind"] == "diagram":
            L.append(f"[Diagram: {b['label']}] {b['text']}{tag}")
        elif b["kind"] == "points":
            L.append(b["text"].replace(" • ", "\n- ").replace("• ", "- ") + tag)
        else:
            L.append(b["text"] + tag)
        L.append("")
    L += ["## The weaker answer (ours, for comparison)", ""] + [f"- {w['text']} → **{w['miss']}**" for w in A["weak"]]
    L += ["", "## Cousin questions", ""] + [f"- {c}" for c in A["cousins"]]
    L += ["", "## Narration", "", "| Key | Link | Says | On screen | Claims |", "|---|---|---|---|---|"]
    for b in A["beats"]:
        L.append(f"| {b['key']} | {b['link']} | {b['say']} | {b['scene']['type']}: {b['scene']['pic']} | {', '.join(b['claims'])} |")
    (path.parent / "ANSWER.md").write_text("\n".join(L) + "\n", encoding="utf-8")


if __name__ == "__main__":
    sys.exit(main())

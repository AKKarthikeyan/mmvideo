#!/usr/bin/env python3
"""A/V check: does every line of a long-video script have a picture with one job, before anyone animates it?

Reads a script in our two-column block format (docs/INDIA_LEDGER_EP1_SCRIPT.md is the model):
  ## ACT n · Title (m:ss–m:ss)
  **PICTURE:** what the viewer sees (one job)
  **SCREEN:** on-screen words, elements separated by " · "
  **SRC:** the source line shown small
  **VO:** (narration follows on the next lines, until the next **TAG:** or heading)

A "scene" starts at each PICTURE. SCREEN, SRC and VO lines that follow belong to it. Rules (docs/storytelling/
VOX_CRAFT.md section 2, from Mayer & Moreno 2003 in EVIDENCE.md E12 and the kit's on-screen text rules):

  FAIL  hook       a greeting or "in this video" in the first 30 s of narration
  FAIL  source     a SCREEN number (digit, %, ₹, $) in a scene with no SRC, unless the scene says "illustrative"
  FAIL  redundant  a SCREEN element repeats 5+ consecutive narration words of its scene (identical text and voice: 0.69)
  FAIL  label      a SCREEN element longer than 8 words (it becomes a sentence to read while listening)
  WARN  label      a SCREEN element of 5-8 words (kit rule: 4 words or fewer; numbers with units excepted)
  WARN  dwell      a scene's narration runs longer than 40 s with no new PICTURE (change the visual every 20-40 s)
  WARN  read       a scene shows more SCREEN words than its narration gives time to read (0.3 s a word + 1 s)
  WARN  jobs       a PICTURE asks for more than two things at once (three or more ";" / "then" clauses)
  WARN  push       three push-ins in a row (vary the camera; kit camera rule)
  WARN  chapters   an 8-12 minute script with fewer than 3 or more than 6 chapters (ACT headings)
  INFO  pace       words, estimated runtime at the voice's speed, words a minute

Usage:
  av_check.py <script.md> [--wps 2.5] [--quiet]     exit 0 = no FAIL, 1 = at least one FAIL
--wps: spoken words a second for the runtime estimate (2.5 = 150 a minute; MiniMax measured 2.9 in structure_check.py).
"""
import argparse, re, sys

TAG = re.compile(r"^\*\*(PICTURE|SCREEN|SRC|VO|SOURCE)(?::\*\*|\*\*:)\s*(.*)$")
HEAD = re.compile(r"^##\s+(.*)$")
NUM = re.compile(r"[0-9₹$%]")
GREET = re.compile(r"\b(welcome( back)?|hey (guys|everyone)|hi (guys|everyone)|hello (guys|everyone|friends)|in (this|today'?s) video|"
                   r"before we (start|begin)|don'?t forget to subscribe|smash (that|the) like)\b", re.I)
PUSH = re.compile(r"\b(push(es|ing)?[- ]in|zoom(s|ing)? in|push(es)? (in|into|toward|towards)|close-up|closes in)\b", re.I)
WORD = re.compile(r"[A-Za-z0-9₹$%'’.,+\-×]+")
UNIT = re.compile(r"^[0-9₹$+\-−–.,%×≈]+$|^(lakh|crore|cr|kg|g|t|tonnes?|bn|mn|km|%|x|×|a|per|year|yr|"
                  r"jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)$", re.I)
QUOTE = re.compile(r"[\"“”]")


def words(s):
    return [w.strip(".,").lower() for w in WORD.findall(s) if w.strip(".,")]


def parse(path):
    scenes, chapters, cur, mode, in_story = [], [], None, None, False
    pre = {"picture": "(before the first PICTURE)", "screen": [], "src": [], "vo": [], "line": 0, "chapter": None}
    cur = pre
    for i, raw in enumerate(open(path, encoding="utf-8"), 1):
        line = raw.rstrip("\n")
        h = HEAD.match(line)
        if h:
            title = h.group(1).strip()
            # narration lives under ACT / CHAPTER / PART headings; any other heading (notes, checklist) ends it
            in_story = bool(re.match(r"(act|chapter|part|cold open|hook|intro|outro|ending)\b", title, re.I))
            if re.match(r"(act|chapter|part)\b", title, re.I):
                chapters.append(title)
            mode = "vo" if in_story and scenes else None
            continue
        m = TAG.match(line.strip())
        if m:
            tag, text = m.group(1), m.group(2).strip()
            if tag == "PICTURE":
                cur = {"picture": text, "screen": [], "src": [], "vo": [], "line": i, "chapter": chapters[-1] if chapters else None}
                scenes.append(cur)
                mode = None
            elif tag == "SCREEN":
                text = re.sub(r"\([^)]*\)", "", text)          # (stage directions) are not on-screen words
                cur["screen"] += [e.strip() for e in text.split(" · ") if e.strip()]
                mode = "vo" if cur["vo"] or scenes else None   # narration often runs on after a SCREEN line
            elif tag in ("SRC", "SOURCE"):
                cur["src"].append(text); mode = "vo" if scenes else None
            else:
                mode = "vo"
                if text:
                    cur["vo"].append(text)
            continue
        if line.strip() == "---":
            continue
        if mode == "vo" and in_story and line.strip() and not line.startswith(("|", "**", ">", "_", "*(")):
            cur["vo"].append(line.strip())
    if pre["vo"] or pre["screen"]:
        scenes.insert(0, pre)
    return scenes, chapters


def label_words(e):
    """Words a viewer has to read in one SCREEN element; numbers and their units count as one."""
    ws = [w for w in re.split(r"\s+", re.sub(r"[·→↑↓⟳()\"“”:]", " ", e)) if w]
    out, prev_num = [], False
    for w in ws:
        isnum = bool(UNIT.match(w))
        if isnum and prev_num:
            continue
        out.append(w); prev_num = isnum
    return len(out)


def shared_run(a, b):
    """Longest run of consecutive words of a found inside b."""
    best, bs = 0, " " + " ".join(b) + " "
    for i in range(len(a)):
        for j in range(i + best + 1, len(a) + 1):
            if " " + " ".join(a[i:j]) + " " in bs:
                best = j - i
            else:
                break
    return best


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("--wps", type=float, default=2.5)
    ap.add_argument("--quiet", action="store_true", help="only FAIL and WARN lines")
    a = ap.parse_args()
    scenes, chapters = parse(a.script)
    if not scenes:
        print(f"FAIL  format     no **PICTURE:** blocks found in {a.script}; see the format in this script's docstring")
        return 1
    out, t = [], 0.0
    pushes = 0
    total_words = 0
    for n, s in enumerate(scenes, 1):
        vo = " ".join(s["vo"])
        vw = words(vo)
        total_words += len(vw)
        dur = len(vw) / a.wps
        where = f"L{s['line']} {('[' + s['chapter'].split('·')[0].strip() + '] ') if s['chapter'] else ''}{s['picture'][:52]}"
        if t < 30 and GREET.search(vo):
            out.append(("FAIL", "hook", where, f"greeting in the first 30 s: “{GREET.search(vo).group(0)}”"))
        illustrative = re.search(r"illustrat", s["picture"] + " ".join(s["src"]), re.I)
        for e in s["screen"]:
            if NUM.search(e) and not s["src"] and not illustrative:
                out.append(("FAIL", "source", where, f"number on screen with no SRC: “{e}”"))
            n_w = label_words(e)
            if QUOTE.search(e):                              # a short verbatim quote with its attribution
                if n_w > 14:
                    out.append(("WARN", "label", where, f"{n_w}-word quote card: “{e}” (trim to the phrase that matters)"))
            elif n_w > 8:
                out.append(("FAIL", "label", where, f"{n_w} words in one element: “{e}” (split it, or move it to the voice)"))
            elif n_w > 4:
                out.append(("WARN", "label", where, f"{n_w} words: “{e}” (aim for 4 or fewer)"))
            run = shared_run(words(e), vw)
            if run >= 5:
                out.append(("FAIL", "redundant", where, f"screen repeats {run} spoken words: “{e}” (show the number, say the meaning)"))
        if dur > 40:
            out.append(("WARN", "dwell", where, f"≈{dur:.0f} s of narration on one picture (change the visual every 20-40 s)"))
        sw = sum(label_words(e) for e in s["screen"])
        if s["screen"] and vw and sw * 0.3 + 1.0 > dur:
            out.append(("WARN", "read", where, f"{sw} screen words need ≈{sw * 0.3 + 1:.1f} s; the voice gives ≈{dur:.1f} s"))
        clauses = len(re.findall(r";|\bthen\b", s["picture"], re.I))
        if clauses >= 2:
            out.append(("WARN", "jobs", where, f"{clauses + 1} actions in one PICTURE: keep one job, split the rest into scenes"))
        pushes = pushes + 1 if PUSH.search(s["picture"]) else 0
        if pushes >= 3:
            out.append(("WARN", "push", where, "third push-in in a row: cut, pan, or pull out instead"))
        t += dur
    mins = t / 60
    if 8 <= mins <= 12 and not 3 <= len(chapters) <= 6:
        out.append(("WARN", "chapters", "-", f"{len(chapters)} chapters for ≈{mins:.1f} min (3-6 keeps the segments learnable)"))
    for lvl, rule, where, msg in out:
        print(f"{lvl:5} {rule:10} {where}\n      {msg}")
    fails = sum(1 for o in out if o[0] == "FAIL"); warns = sum(1 for o in out if o[0] == "WARN")
    if not a.quiet or out:
        print(f"INFO  pace       {len(scenes)} scenes · {len(chapters)} chapters · {total_words} spoken words · "
              f"≈{mins:.1f} min at {a.wps} words/s ({a.wps * 60:.0f} a minute) · {fails} FAIL, {warns} WARN")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())

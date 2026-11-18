#!/usr/bin/env python3
"""Structure check for long-form research videos, run before render.
Spec: ~/mm-content/contentengine/youtube/STRUCTURE.md (the channel structure of 5 Oct 2026).

Checks one video entry against the structure: the five-question gate, the spine question, the hook,
re-hooks at most 3 minutes apart, the midpoint turn, the counterargument, plants paid off late,
the known / unknown / monitor ending, the hand-off, and the source ledger (every number on screen
has a sourced row that a human has checked).

Usage:
  structure_check.py <id> [--module path/to/scripts.py]   report; exit 0 = ready to render, 1 = not ready
  structure_check.py <id> --timeline                      also print the beat map (mm:ss per beat), for reading retention graphs
  structure_check.py <id> --ledger-template               create or extend scripts/ledger/<id>.csv, one row per on-screen number

The video entry gains these fields (old videos without them simply fail the check):
  spine="One question the whole video answers?", keyword="primary keyword",
  gate=dict(changed=, care=, added=, invalidate=, monitor=), next_video="title of the hand-off video",
  marks=dict(hook=[keys], rehooks=[keys], turn=key, counter=[keys], plants=[(plant_key, payoff_key)],
             known=key, unknown=key, monitor=key, handoff=key, moat=key, margin=key)
checked_by / checked_on in the ledger are for the human editor only; Claude never fills them."""
import csv, datetime, importlib.util, json, os, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
PUBLIC = HERE.parent / "public" / "vx"
LEDGER_DIR = pathlib.Path(os.environ.get("MM_LEDGER_DIR", HERE / "ledger"))
WPS = 2.9          # MiniMax narration speed measured on the kpigreen long video (844 words, 290.6 s)
GAP = 0.4          # pause between beats when estimating
QUESTION_BY = 15   # the spine question (or another open question) must be spoken by this second
KEYWORD_BY = 30    # the primary keyword must be spoken by this second (YouTube Guide)
HOOK_END_BY = 30   # hook beats end by this second (YouTube Guide)
MAX_GAP = 180      # longest stretch without a re-hook (seconds)
TURN_WINDOW = (0.40, 0.60)
LATE = 0.70        # payoffs and the ending sit in the last 30% of the runtime
EARLY = 0.35       # plants sit in the first 35%
SCENE_MAX = 40     # change the visual every 20-40 s (YouTube Guide)
GATE_KEYS = ["changed", "care", "added", "invalidate", "monitor"]
LEDGER_COLS = ["beat", "screen_text", "value", "units", "source_url", "doc_title", "doc_date", "page",
               "quote_or_section", "calculation", "checked_by", "checked_on", "note"]
MONTHS = "jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec"
DATE_RE = re.compile(r"\b(\d{1,2})\s+(" + MONTHS + r")[a-z]*\.?,?\s+(\d{4})\b", re.I)
NUM_RE = re.compile(r"(?<![A-Za-z0-9.])[₹$]?\d[\d,]*(?:\.\d+)?(?![A-Za-z]*\d)")
SKIP_SCENE_KEYS = {"at", "clip", "hl", "type", "events", "show", "add", "v", "red", "fill", "decimals", "to", "unit", "x", "y"}


def load_video(vid, module):
    spec = importlib.util.spec_from_file_location("scripts_module", module)
    m = importlib.util.module_from_spec(spec)
    sys.path.insert(0, str(pathlib.Path(module).parent))
    spec.loader.exec_module(m)
    for v in m.VIDEOS:
        if v["id"] == vid:
            return v
    sys.exit(f"no video with id {vid!r} in {module}")


def timings(v):
    """Start and length of each beat: real seconds from public/vx/<id>/data.json when built, else estimated."""
    built = {}
    data = next((d / v["id"] / "data.json" for d in (PUBLIC, PUBLIC.parent / "tpl") if (d / v["id"] / "data.json").exists()), None)
    if data:
        for b in json.load(open(data)).get("beats", []):
            if b.get("sec"):
                built[b["key"]] = float(b["sec"])
    t, rows, source = 0.0, [], "built audio" if built else "estimate"
    for b in v["beats"]:
        sec = built.get(b["key"]) or len(b["say"].split()) / WPS + GAP
        rows.append(dict(key=b["key"], start=t, sec=sec, beat=b))
        t += sec
    return rows, t, source


def mmss(s):
    return f"{int(s // 60)}:{int(s % 60):02d}"


def norm(tok):
    tok = tok.replace("₹", "").replace("$", "").replace(",", "")
    if "." in tok:
        tok = tok.rstrip("0").rstrip(".")
    return tok


def tokens(text):
    """Numbers and dates shown on screen. Bare years and counts up to 10 are left out."""
    out, rest = [], text
    for m in DATE_RE.finditer(text):
        mon = m.group(2)[:3].lower()
        out.append(f"{int(m.group(1))} {mon} {m.group(3)}")
    rest = DATE_RE.sub(" ", text)
    for m in NUM_RE.finditer(rest):
        n = norm(m.group(0))
        if not n or not re.search(r"\d", n):
            continue
        if re.fullmatch(r"(19|20)\d\d", n):
            continue
        if re.fullmatch(r"\d+", n) and int(n) <= 10:
            continue
        out.append(n)
    return out


def scene_text(x, key=None):
    if isinstance(x, dict):
        return " | ".join(scene_text(v, k) for k, v in x.items() if k not in SKIP_SCENE_KEYS)
    if isinstance(x, (list, tuple)):
        return " | ".join(scene_text(i, key) for i in x)
    return x if isinstance(x, str) else ""


def screen_numbers(b):
    """(token, snippet) for every number or date the viewer reads in this beat: caption plus scene text."""
    seen, out = set(), []
    for text in [b.get("cap") or "", scene_text(b.get("scene") or {})]:
        for tok in tokens(text):
            if tok in seen:
                continue
            seen.add(tok)
            i = text.find(tok.split(" ")[0])
            out.append((tok, text[max(0, i - 40): i + 40].strip() if i >= 0 else text[:80]))
    return out


def row_tokens(r):
    toks = set()
    for f in ("value", "screen_text", "doc_date"):
        toks.update(tokens(r.get(f) or ""))
        v = (r.get(f) or "").strip()
        if v:
            toks.add(norm(v))
    return toks


def read_ledger(vid):
    p = LEDGER_DIR / f"{vid}.csv"
    if not p.exists():
        return p, []
    with open(p, newline="") as f:
        return p, list(csv.DictReader(f))


def ledger_template(v):
    p, rows = read_ledger(v["id"])
    covered = {(k, t) for r in rows for k in (r.get("beat") or "").split() for t in row_tokens(r)}
    new = {}  # one row per number; a number repeated across beats lists all its beats
    for b in v["beats"]:
        for tok, snip in screen_numbers(b):
            if (b["key"], tok) not in covered:
                r = new.setdefault(tok, dict(beat="", screen_text=snip, value=tok, note=f"added {datetime.date.today()}"))
                r["beat"] = (r["beat"] + " " + b["key"]).strip()
    new = list(new.values())
    LEDGER_DIR.mkdir(exist_ok=True)
    fresh = not p.exists()
    with open(p, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=LEDGER_COLS)
        if fresh:
            w.writeheader()
        for r in new:
            w.writerow(r)
    print(f"{p}: {'created' if fresh else 'extended'}, {len(new)} new rows. Fill source_url, doc_title, doc_date, page, "
          "units and calculation; checked_by/checked_on are for the human editor.")


def check(v, show_timeline):
    rows, total, source = timings(v)
    at = {r["key"]: r for r in rows}
    marks = v.get("marks") or {}
    res = []  # (level, name, detail)

    def add(ok, name, detail, level="FAIL"):
        res.append(("PASS" if ok else level, name, detail))

    def start(k):
        return at[k]["start"] if k in at else None

    def end(k):
        return at[k]["start"] + at[k]["sec"] if k in at else None

    def pct(s):
        return f"{mmss(s)} ({s / total:.0%})"

    def missing(keys):
        return [k for k in keys if k not in at]

    # 1. Gate and spine
    gate = v.get("gate") or {}
    weak = [k for k in GATE_KEYS if len((gate.get(k) or "").strip()) < 20]
    add(not weak, "Gate: five answers", "all five answered" if not weak else "missing or too thin: " + ", ".join(weak))
    spine = (v.get("spine") or "").strip()
    add(spine.endswith("?"), "Spine question", spine or "no spine question set")
    if spine:
        add(len(spine) <= 90, "Spine is one short question", f"{len(spine)} chars", "WARN")

    # 2. Hook: an open question by 15 s, keyword by 30 s, hook beats end by 30 s
    q_time = None
    for r in rows:
        say = r["beat"]["say"]
        if "?" in say:
            words = say.split()
            idx = next(i for i, w in enumerate(words) if "?" in w)
            q_time = r["start"] + r["sec"] * (idx + 1) / len(words)
            break
    add(q_time is not None and q_time <= QUESTION_BY, "Hook asks its question by 0:15",
        f"first question at {mmss(q_time)}" if q_time is not None else "no question in the narration")
    if v.get("keyword"):
        heard = " ".join(r["beat"]["say"] for r in rows if r["start"] < KEYWORD_BY).lower()
        add(v["keyword"].lower() in heard, "Keyword spoken by 0:30", v["keyword"])
    hook = marks.get("hook") or []
    if not hook or missing(hook):
        add(False, "Hook marked", f"marks.hook = {hook}")
    else:
        e = max(end(k) for k in hook)
        add(e <= HOOK_END_BY, "Hook ends by 0:30", f"hook ends at {mmss(e)}", "WARN")

    # 3. Re-hooks every <= 3 minutes, from the question until the counterargument
    rehooks = marks.get("rehooks") or []
    add(not missing(rehooks), "Re-hooks marked", f"unknown keys: {missing(rehooks)}" if missing(rehooks) else f"{len(rehooks)} re-hooks")
    counter = marks.get("counter") or []
    turn = marks.get("turn")
    stop = start(counter[0]) if counter and counter[0] in at else total
    points = sorted({q_time or 0.0, stop} | {start(k) for k in rehooks + ([turn] if turn else []) if k in at})
    points = [p for p in points if p <= stop]
    gaps = [(b - a, a) for a, b in zip(points, points[1:])]
    worst = max(gaps) if gaps else (stop, 0.0)
    add(worst[0] <= MAX_GAP, "No stretch over 3:00 without a re-hook", f"longest gap {mmss(worst[0])} from {mmss(worst[1])}")
    for k in rehooks:
        if k in at:
            s = at[k]["beat"]["say"]
            ok = "?" in s or re.search(r"\b(but|yet|so why|which raises|that leaves)\b", s, re.I)
            add(bool(ok), f"Re-hook {k} opens a new question", s[:80], "WARN")

    # 4. Midpoint turn
    if not turn or turn not in at:
        add(False, "Midpoint turn", f"marks.turn = {turn!r}")
    else:
        s = start(turn)
        add(TURN_WINDOW[0] <= s / total <= TURN_WINDOW[1], "Midpoint turn at 40-60%", pct(s))

    # 5. Counterargument
    add(bool(counter) and not missing(counter), "Counterargument", f"{counter}" if counter else "no counter beats marked")
    if counter and turn in at and counter[0] in at:
        add(start(counter[0]) > start(turn), "Counterargument after the turn", pct(start(counter[0])), "WARN")

    # 6. Plants paid off late
    plants = marks.get("plants") or []
    add(bool(plants), "At least one plant and payoff", f"{len(plants)} pair(s)")
    for p, q in plants:
        if p not in at or q not in at:
            add(False, f"Plant {p} -> {q}", "unknown key")
            continue
        add(start(p) < start(q), f"Plant {p} before payoff {q}", f"{pct(start(p))} -> {pct(start(q))}")
        add(start(p) <= EARLY * total, f"Plant {p} is early", pct(start(p)), "WARN")
        add(start(q) >= LATE * total, f"Payoff {q} is late", pct(start(q)), "WARN")

    # 7. Ending: known, unknown, monitor
    for part in ("known", "unknown", "monitor"):
        k = marks.get(part)
        if not k or k not in at:
            add(False, f"Ending: {part}", f"marks.{part} = {k!r}")
        else:
            add(start(k) >= LATE * total, f"Ending: {part} in the last 30%", pct(start(k)), "WARN")

    # 7b. Moat and margin verdicts (STRUCTURE.md section 2, AK 5 Oct)
    for part in ("moat", "margin"):
        k = marks.get(part)
        add(bool(k) and k in at, f"Verdict: {part}", f"marks.{part} = {k!r}" if not (k and k in at) else pct(start(k)))

    # 8. Hand-off
    h = marks.get("handoff")
    add(bool(v.get("next_video")), "Next video named", v.get("next_video") or "next_video not set")
    if not h or h not in at:
        add(False, "Hand-off beat", f"marks.handoff = {h!r}")
    else:
        add(total - start(h) <= 30, "Hand-off in the last 0:30", f"starts {mmss(total - start(h))} before the end", "WARN")

    # 9. Pace and AK's 3 Oct rule
    long_beats = [f"{r['key']} {r['sec']:.0f}s" for r in rows if r["sec"] > SCENE_MAX]
    add(not long_beats, "Visual changes within 40 s", ", ".join(long_beats) or "every beat <= 40 s", "WARN")
    notes = [r["key"] for r in rows if re.search(r"not investment advice|not a sebi", r["beat"]["say"], re.I)]
    add(not notes, "No disclaimer beat in the long video (AK 3 Oct)", ", ".join(notes) or "none", "WARN")

    # 10. Source ledger
    p, ledger = read_ledger(v["id"])
    need = [(b["key"], tok) for b in v["beats"] for tok, _ in screen_numbers(b)]
    by_beat = {}
    for r in ledger:
        for k in (r.get("beat") or "").split():
            by_beat.setdefault(k, []).append(r)
    uncovered, incomplete, unchecked = [], set(), set()
    for k, tok in need:
        hits = [r for r in by_beat.get(k, []) if tok in row_tokens(r)]
        if not hits:
            uncovered.append(f"{k}:{tok}")
            continue
        for r in hits:
            rid = (r.get("beat"), r.get("value"))
            if not all((r.get(c) or "").strip() for c in ("source_url", "doc_date", "page", "units")):
                incomplete.add(rid)
            if not (r.get("checked_by") or "").strip():
                unchecked.add(rid)
    if not ledger:
        add(False, "Source ledger", f"{p} missing; run with --ledger-template ({len(need)} numbers on screen)")
    else:
        add(not uncovered, "Every on-screen number has a ledger row",
            f"{len(need) - len(uncovered)}/{len(need)} covered" + (f"; missing {', '.join(uncovered[:12])}" if uncovered else ""))
        add(not incomplete, "Ledger rows sourced (url, date, page, units)", f"{len(incomplete)} incomplete row(s)")
        add(not unchecked, "Ledger checked by the human editor", f"{len(unchecked)} row(s) without checked_by")

    # Report
    fails = [r for r in res if r[0] == "FAIL"]
    warns = [r for r in res if r[0] == "WARN"]
    print(f"{v['id']}: {v.get('title', '')}")
    print(f"runtime {mmss(total)} ({source})\n")
    for level, name, detail in res:
        print(f"  {level:4}  {name}: {detail}")
    if show_timeline:
        role = {}
        for name in ("hook", "rehooks", "counter"):
            for k in marks.get(name) or []:
                role.setdefault(k, []).append(name.rstrip("s") if name == "rehooks" else name)
        for name in ("turn", "known", "unknown", "monitor", "handoff", "moat", "margin"):
            if marks.get(name):
                role.setdefault(marks[name], []).append(name)
        for a, b in plants:
            role.setdefault(a, []).append(f"plant>{b}")
            role.setdefault(b, []).append(f"payoff<{a}")
        print("\n  beat map")
        for r in rows:
            text = (r["beat"].get("cap") or r["beat"]["say"]).replace("\n", " ")
            print(f"  {mmss(r['start']):>5}  {r['key']:<6} {','.join(role.get(r['key'], [])):<18} {text[:70]}")
    print(f"\n{len(fails)} fail, {len(warns)} warn -> {'READY TO RENDER' if not fails else 'NOT READY'}")
    return not fails


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or args[0].startswith("-"):
        sys.exit(__doc__)
    module = str(HERE / "vx_scripts.py")
    if "--module" in args:
        module = args[args.index("--module") + 1]
    v = load_video(args[0], module)
    if "--ledger-template" in args:
        ledger_template(v)
    else:
        sys.exit(0 if check(v, "--timeline" in args) else 1)

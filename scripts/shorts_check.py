#!/usr/bin/env python3
"""Shorts gate: checks a built Short against the hard rules in docs/SHORTS_RULES.md (AK, 10 Nov 2026).
Reads the built timings in public/vx/<id>/data.json (run the build first). Times follow VoxEngine: a beat lasts `sec`
plus a 0.12 s gap in loop Shorts (0.35 s otherwise), and an on-screen element appears when its `at` phrase is spoken
("phrase|frames" adds a frame offset).

usage: shorts_check.py <id> [--short N]     one video's Shorts (all, or only Short N, counted from 1)
       shorts_check.py --all [--summary]     every Short in public/vx/
exit 0 = every hard rule holds, 1 = at least one FAIL. WARN lines are soft rules: fix them unless there is a reason.

Hard rules (FAIL):
  H1 length 15-60 s                         (over 60 s: completion drops and a Content ID music claim blocks it worldwide)
  H2 first word within 0.3 s, no dead air    (the voice starts on frame 1)
  H3 hook text on screen by 0.5 s, first sentence spoken by 4.0 s and at most 14 words
  H4 picture changes at least every 4.0 s    (a new scene or a new on-screen element)
  H5 pace 130-200 words a minute
  H6 one idea: at most 10 beats and 140 words
Soft rules (WARN):
  S1 length 20-45 s (our sweet spot)          S2 an open question by 8 s ('?' in the narration)
  S3 loop: loop=True and the last line runs into the first (ends on a connector such as 'Because' or ',')
  S4 the payoff is in the last 30 %: a number, a 'but'/'actually' turn, or a question
  S5 title at most 50 characters (Shorts feed and Reels cover cut longer titles)
  S7 first sentence spoken by 2.5 s (the tightest openers)
  S8 frame 1 is a picture, not text on a plain background (first beat is not kinetic/strips/list/title) — docs/SHORTS_FORMAT.md
  S6 picture changes at least every 3.0 s
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
FPS = 30
TEXT_ONLY = {"kinetic", "strips", "list", "title"}
CONNECTORS = ("because", "so", "and", "but", "which", "that's why", "here's why")


def at_times(scene, say, sec):
    """Seconds into the beat at which each on-screen element appears."""
    out = []

    def walk(x):
        if isinstance(x, dict):
            for k, v in x.items():
                if k == "at" and isinstance(v, (str, int, float)):
                    out.append(v)
                elif k == "add" and isinstance(v, list):
                    out.extend(a for a in v if isinstance(a, (str, int, float)))
                else:
                    walk(v)
        elif isinstance(x, list):
            for v in x:
                walk(v)

    walk(scene)
    ts = []
    for a in out:
        if isinstance(a, (int, float)):
            ts.append(a / FPS); continue
        p, _, o = str(a).partition("|")
        i = say.lower().find(p.lower())
        if i < 0:
            continue
        ts.append(sec * i / max(len(say), 1) + (int(o) / FPS if o.lstrip("-").isdigit() else 0))
    return sorted(t for t in ts if 0 <= t <= sec)


def check(D, idx):
    S = D["shorts"][idx]; by = {b["key"]: b for b in D["beats"]}
    bs = [by[k] for k in S["beats"] if k in by]
    loop = bool(S.get("loop")); gap = 0.12 if loop else 0.35
    res = []  # (level, rule, message)

    def add(ok, level, rule, msg):
        res.append(("ok  " if ok else level, rule, msg))

    t = 0.0; events = []; words = 0; first_q = None; first_end = None; first_words = 0
    first_el = min([0.0] if (bs and bs[0].get('scene', {}).get('type') in ('title', 'hook')) else at_times(bs[0].get('scene') or {}, bs[0]['say'], bs[0]['sec']) or [99]) if bs else 99
    for b in bs:
        say = b["say"]; sec = b["sec"]; scene = b.get("scene") or {}
        events.append(t)
        events += [t + x for x in at_times(scene, say, sec)]
        if first_end is None:
            m = re.search(r"[.!?:](\s|$)", say)
            if m: first_end = t + sec * (m.end() / len(say)); first_words = len(say[:m.end()].split())
        if first_q is None and "?" in say:
            first_q = t + sec * say.index("?") / len(say)
        words += len(say.split()); t += sec + gap
    dur = t
    if first_end is None: first_end = bs[0]["sec"] if bs else 99; first_words = len(bs[0]["say"].split()) if bs else 0
    if S.get("hook"): first_el = 0.0                                      # the engine puts the hook card on frame 1
    events = sorted(set(round(e, 2) for e in events)) + [round(dur, 2)]
    gaps = [(b - a, a) for a, b in zip(events, events[1:])]
    worst, worst_at = max(gaps) if gaps else (dur, 0)
    wpm = words / dur * 60 if dur else 0
    last = bs[-1]["say"].strip().lower() if bs else ""
    lead = (bs[0].get("lead") or 0) if bs else 0

    add(15 <= dur <= 60, "FAIL", "H1", f"length {dur:.1f} s (15-60)")
    add(lead <= 0.3, "FAIL", "H2", f"voice starts at {lead:.2f} s")
    add(first_el <= 0.5 and first_end <= 4.0 and first_words <= 14, "FAIL", "H3",
        f"hook text on screen at {first_el:.1f} s, first sentence ends at {first_end:.1f} s, {first_words} words (0.5 s / 4.0 s / 14)")
    add(worst <= 4.0, "FAIL", "H4", f"longest hold {worst:.1f} s at {worst_at:.1f} s (max 4.0)")
    add(130 <= wpm <= 200, "FAIL", "H5", f"pace {wpm:.0f} wpm (130-200)")
    add(len(bs) <= 10 and words <= 140, "FAIL", "H6", f"{len(bs)} beats, {words} words (max 10 / 140)")
    add(20 <= dur <= 45, "WARN", "S1", f"length {dur:.1f} s (20-45)")
    add(first_q is not None and first_q <= 8, "WARN", "S2", f"first question at {first_q:.1f} s" if first_q is not None else "no question in the narration")
    ends = last.rstrip(" .").endswith(CONNECTORS) or last.endswith((",", ":", "?"))
    add(loop and ends, "WARN", "S3", f"loop={loop}, ends '…{last[-28:]}'")
    tail_start = dur * 0.7; tt = 0.0; tail = ""
    for b in bs:
        if tt + b["sec"] >= tail_start: tail += " " + b["say"]
        tt += b["sec"] + gap
    turn = re.search(r"\d|\b(but|actually|catch|instead|only|still|yet|not)\b|\?", tail.lower()) or re.search(r"\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|lakh|crore|percent)\b", tail.lower())
    add(bool(turn), "WARN", "S4", "payoff marker in the last 30 %" if turn else "no number, turn or question in the last 30 %")
    add(len(S.get("title", "")) <= 50, "WARN", "S5", f"title {len(S.get('title', ''))} chars")
    add(worst <= 3.0, "WARN", "S6", f"longest hold {worst:.1f} s (aim 3.0)")
    add(first_end <= 2.5, "WARN", "S7", f"first sentence ends at {first_end:.1f} s (aim 2.5)")
    t0 = (bs[0].get("scene") or {}).get("type", "") if bs else ""
    add(t0 not in TEXT_ONLY, "WARN", "S8", f"first scene '{t0}'" + (" is text only: open on the subject itself" if t0 in TEXT_ONLY else ""))
    return dur, res


def main():
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(2)
    files = sorted((ROOT / "public/vx").glob("*/data.json")) if a[0] == "--all" else [ROOT / "public/vx" / a[0] / "data.json"]
    only = int(a[a.index("--short") + 1]) - 1 if "--short" in a else None
    summary = "--summary" in a; bad = 0; n = 0; fails = {}
    for f in files:
        D = json.load(open(f))
        for i, S in enumerate(D.get("shorts") or []):
            if only is not None and i != only: continue
            if not any(k in {b["key"] for b in D["beats"]} for k in S["beats"]): continue
            dur, res = check(D, i); n += 1
            nf = sum(1 for r in res if r[0] == "FAIL"); bad += nf > 0
            for r in res:
                if r[0] == "FAIL": fails[r[1]] = fails.get(r[1], 0) + 1
            if summary:
                print(f"{'FAIL' if nf else 'PASS'}  {D['id']} #{i + 1}  {dur:4.1f} s  " + " ".join(r[1] for r in res if r[0] != "ok  "))
                continue
            print(f"{D['id']} Short {i + 1}: {S.get('title', '')} ({dur:.1f} s)")
            for lv, rule, msg in res: print(f"  {lv}  {rule}  {msg}")
    if n > 1: print(f"{n} Shorts, {bad} with a FAIL" + ("  ·  fails by rule: " + ", ".join(f"{k} {v}" for k, v in sorted(fails.items())) if fails else ""))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()

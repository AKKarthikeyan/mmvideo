#!/usr/bin/env python3
"""Story-ledger check for a long video (rules: docs/STORYTELLING.md, AK 2 Nov 2026). Replaces hook_check.py.
Reads V["story"] (promise, arc, loops, turn, plants) from scripts/vx_scripts.py or scripts/vx_letters.py. Beat timings come
from public/vx/<id>/data.json when it matches the script, else from a word count (--wpm).
usage: story_check.py <id> [--wpm 165] [--open-by 30] [--tail 30] [--max-quiet 180] [--first-win 120]
exit 0 = no FAIL (warnings allowed), 1 = at least one FAIL, 2 = unknown video"""
import json, math, pathlib, re, sys
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
ARCS = {"three-act", "story-circle", "kishotenketsu", "misconception-first", "wow-first", "serial-momentum",
        "evidence-first", "modular-value", "claim-verdict"}
KINDS = ("primary", "secondary", "tertiary", "micro")
THEN = re.compile(r"^\s*(and then|then|next|after that|afterwards|meanwhile)\b", re.I)
TIERS = ("broad", "nurture", "authority")
STOP = {"this", "that", "with", "from", "what", "when", "your", "have", "does", "about", "their", "into", "than", "them", "were", "will", "just", "more", "most", "only", "over", "some", "video", "explained", "simply", "short", "shorts"}
ASK = re.compile(r"\b(subscribe|hit the bell|like (and|this)|follow us|link in (the )?bio|link below)\b", re.I)

def arg(flag, default): return float(sys.argv[sys.argv.index(flag) + 1]) if flag in sys.argv else default
def fmt(s): return f"{int(s // 60)}:{int(s % 60):02d}"

def find(vid):
    for mod in ("vx_scripts", "vx_letters"):
        try: videos = __import__(mod).VIDEOS
        except Exception: continue
        for v in videos:
            if v["id"] == vid: return v
    return None

def timings(V, wpm):
    """[(key, start, end, say, scene type)] per beat; the padding matches the engine (0.5 s, 1.1 s after a title)."""
    beats, notes = V["beats"], []
    built = HERE.parent / "public/vx" / V["id"] / "data.json"
    secs = None
    if built.exists():
        D = json.load(open(built))["beats"]
        if [b["key"] for b in D] == [b["key"] for b in beats]: secs = [b["sec"] for b in D]
        else: notes.append("built data.json does not match the script: using a word count")
    if secs is None: secs = [len(b["say"].split()) * 60.0 / wpm for b in beats]; notes.append(f"timings estimated at {wpm:.0f} wpm")
    t, out = 0.0, []
    for b, s in zip(beats, secs):
        typ = b["scene"].get("type") if isinstance(b["scene"], dict) else b["scene"]
        n = math.ceil((s + (1.1 if typ == "title" else 0.5)) * 30) / 30
        out.append((b["key"], t, t + n, b["say"], typ)); t += n
    return out, t, notes

def main():
    if len(sys.argv) < 2 or sys.argv[1].startswith("--"): print(__doc__); return 2
    vid, WPM, OPEN_BY, TAIL, QUIET, WIN = sys.argv[1], arg("--wpm", 165.0), arg("--open-by", 30.0), arg("--tail", 30.0), arg("--max-quiet", 180.0), arg("--first-win", 120.0)
    V = find(vid)
    if V is None: print(f"no video with id {vid} in vx_scripts.py or vx_letters.py"); return 2
    T, total, notes = timings(V, WPM)
    idx = {k: i for i, (k, *_) in enumerate(T)}
    fails, warns = [], []
    print(f"{vid}: {fmt(total)} total, {len(T)} beats" + "".join(f"  [{n}]" for n in notes))
    S = V.get("story")
    if not isinstance(S, dict):
        print("  FAIL  no V['story'] ledger (docs/STORYTELLING.md section 7)"); return 1
    if not str(S.get("promise", "")).strip(): fails.append("story.promise is empty")
    if S.get("arc") not in ARCS: fails.append(f"story.arc must be one of {sorted(ARCS)}, got {S.get('arc')!r}")
    loops = S.get("loops") or []
    if not loops: fails.append("story.loops is empty")
    ok = []   # loops with usable keys
    for L in loops:
        miss = [k for k in ("id", "kind", "q", "open", "close") if not L.get(k)]
        if miss: fails.append(f"loop {L.get('id', '?')}: missing {', '.join(miss)}"); continue
        if L["kind"] not in KINDS: fails.append(f"loop {L['id']}: kind must be one of {KINDS}"); continue
        bad = [k for k in (L["open"], L["close"]) if k not in idx]
        if bad: fails.append(f"loop {L['id']}: no such beat {', '.join(bad)}"); continue
        if idx[L["open"]] >= idx[L["close"]]: fails.append(f"loop {L['id']}: must close in a later beat than it opens"); continue
        ok.append(L)
    if len({L.get("id") for L in loops}) != len(loops): fails.append("loop ids are not unique")
    prim = [L for L in loops if L.get("kind") == "primary"]
    if len(prim) != 1: fails.append(f"exactly one primary loop is required, found {len(prim)}")
    ok_prim = [L for L in ok if L["kind"] == "primary"]
    if ok_prim:
        P = ok_prim[0]; o = T[idx[P["open"]]][1]
        if o > OPEN_BY: fails.append(f"primary loop opens at {fmt(o)} ({P['open']}), after the {OPEN_BY:.0f} s limit")
        later = [L["id"] for L in ok if idx[L["close"]] > idx[P["close"]]]
        if later: fails.append(f"primary loop closes before {', '.join(later)}: the primary must resolve last")
        tail = total - T[idx[P["close"]]][2]
        if tail > TAIL: warns.append(f"{fmt(tail)} of video after the payoff ({P['close']}); the limit is {TAIL:.0f} s")
    if ok:   # re-engagement: a loop opening or resolving is an event; no stretch between events may exceed --max-quiet
        ev = sorted({(T[idx[L[e]]][1], f"{L['id']} {e}s") for L in ok for e in ("open", "close")})
        for (a, ia), (b, ib) in zip(ev, ev[1:]):
            if b - a > QUIET: fails.append(f"{fmt(b - a)} with no question opened or answered, {fmt(a)} ({ia}) to {fmt(b)} ({ib}); the limit is {QUIET:.0f} s")
    if ok:   # an early small win: the first answer lands soon, which buys patience for the heavy explanation (Rober)
        first = min(T[idx[L["close"]]][1] for L in ok)
        if first > WIN: warns.append(f"first question answered at {fmt(first)}; an early small win is expected by {WIN:.0f} s")
    kw = {w for w in re.findall(r"[a-z]{4,}", f"{V.get('title', '')} {S.get('promise', '')}".lower()) if w not in STOP}
    opening = " ".join(say for k, t0, t1, say, typ in T if t0 <= OPEN_BY).lower()
    hit = {w for w in kw if w in opening}
    if len(kw) >= 2 and len(hit) < 2: warns.append(f"the first {OPEN_BY:.0f} s echo {len(hit)} of the title's keywords ({', '.join(sorted(kw)[:6])}); echo at least 2 so the opening confirms the click")
    crit = S.get("critical")
    if not crit: warns.append("no story.critical: list the 2 or 3 documents or figures the story cannot exist without, each with its source")
    else:
        for c in crit:
            if not (isinstance(c, dict) and c.get("what") and c.get("src")): warns.append(f"story.critical entry needs what and src: {c!r}")
    if S.get("tier") is not None and S["tier"] not in TIERS: fails.append(f"story.tier must be one of {TIERS}")
    kinds = {L["kind"] for L in ok}
    if total >= 300 and not {"primary", "secondary", "tertiary"} <= kinds:
        warns.append(f"a {fmt(total)} video should stack a primary, a secondary and a tertiary loop; missing: {', '.join(sorted({'primary', 'secondary', 'tertiary'} - kinds))}")
    turn = S.get("turn")
    if turn is None: warns.append("no story.turn (the 'but' beat)")
    elif turn not in idx: fails.append(f"story.turn: no such beat {turn}")
    for pair in S.get("plants") or []:
        try: a, b = pair
        except Exception: fails.append(f"plant {pair!r} must be (setup beat, payoff beat)"); continue
        if a not in idx or b not in idx: fails.append(f"plant {pair!r}: no such beat")
        elif idx[a] >= idx[b]: fails.append(f"plant {pair!r}: the payoff must come after the setup")
    for k, t0, t1, say, typ in T[1:]:   # a beat that opens with "and then": it follows only because it came next in time
        if typ != "timeline" and THEN.match(say): warns.append(f"{fmt(t0)} {k}: \"and then\" opener: {say[:60]}")
    for k, t0, t1, say, typ in T[-4:]:
        m = ASK.search(say)
        if m: warns.append(f"{fmt(t0)} {k}: spoken ask near the end: \"{m.group(0)}\" (put it in the description or pinned comment)")
    print("  loops:")
    for L in ok: print(f"    {L['id']} {L['kind']:9} {fmt(T[idx[L['open']]][1])} {L['open']:5} -> {fmt(T[idx[L['close']]][2])} {L['close']:5} {L['q']}")
    for w in warns: print(f"  warn  {w}")
    for f in fails: print(f"  FAIL  {f}")
    print(f"{len(fails)} problem(s), {len(warns)} warning(s)" if fails or warns else "story ledger holds")
    return 1 if fails else 0

if __name__ == "__main__": sys.exit(main())

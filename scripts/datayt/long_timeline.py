#!/usr/bin/env python3
"""Builds the long-form cartoon timeline (public/datayt/long/babies/timeline.json) from a storyboard.

  .venv/bin/python scripts/datayt/long_timeline.py public/datayt/long/babies/storyboard.json
  .venv/bin/python scripts/datayt/long_timeline.py <storyboard.json> --words word_times.json    # measured from the voice
  .venv/bin/python scripts/datayt/long_timeline.py <storyboard.json> --out /tmp/t.json --table  # elsewhere, with a per-scene table
  .venv/bin/python scripts/datayt/long_timeline.py --selftest

The storyboard shape is in long_validate.py (run that first: this script only stops on what it cannot build, such as a
reveal word that is not in the vo). The output is the Timeline type of src/looks/cartoon/long/contract.ts, which
LongCartoon.tsx plays: per scene {id, act, kind, spec, vo, from, dur, reveals, transition?}, frames at 30 fps, `from`
cumulative, and `reveals` = {key: local frame from which the number or label may be drawn}.

The rule: a number is never revealed before its word.

  estimated (no --words)   speech time = words / 2.6 per second. dur = speech + 0.5 s lead-out, at least 75 frames. A
                           reveal frame = where the reveal word sits in the speech (its position share of the words, a
                           sub-word such as the 4 of NFHS-4 counted by its share of the word) + 4 frames.
  measured (--words F)     F maps scene id -> [{w, start, end}] in seconds from the start of that scene's voice line (the
                           words of the vo, as scripts/datayt/word_times.py writes them; {"scenes": {...}} and a list of
                           {id, words} are read too). dur = the last word's end (or the line's "sec" if longer) + 0.5 s,
                           at least 75 frames. A reveal frame = round(word start * 30) + 1, so the frame is always after
                           the word began. Words are matched to the vo by text, so a recogniser that split or merged a
                           word is tolerated. A scene with a vo and no measured words stops the build (no mixing).
The file is written whole or not at all (temp file, then rename), so a render never meets half a timeline.
"""
import argparse, contextlib, difflib, io, json, math, os, sys, tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import long_validate as V

FPS = 30
LEAD_OUT_S = 0.5
MIN_FRAMES = 75                      # 2.5 s
EST_MARGIN = 4                       # frames after the estimated word start
MEASURED_MARGIN = 1                  # frames after the measured word start
SHORT_SHOW = 24                      # frames: a number revealed less than this long before its scene ends is reported (it is on screen under 0.8 s)
SUB_WORD_MARGIN = 2                  # extra frames for a word that starts inside a measured word (the 4 of NFHS-4): its start is a share, not a measurement
OUT = os.path.join(V.LONG, "timeline.json")


class TimelineError(ValueError):
    """The storyboard or the word times cannot be turned into a timeline."""


def ceil6(x):
    """ceil that ignores float dust (13 / 2.6 * 30 is 150.00000000000003)."""
    return math.ceil(round(x, 6))


# ---------------------------------------------------------------- the word-times file
def load_words(path):
    """-> {scene id: {"words": [{w, start, end}], "sec": seconds or None}}. Entries that are not word lists (id, fps, made...) are skipped."""
    with open(path, encoding="utf-8") as fh:
        d = json.load(fh)
    if isinstance(d, dict) and isinstance(d.get("scenes"), (dict, list)):
        d = d["scenes"]
    if isinstance(d, list):
        d = {(e.get("id") or e.get("scene")): e for e in d if isinstance(e, dict)}
    out = {}
    for sid, e in (d.items() if isinstance(d, dict) else []):
        words = e.get("words") if isinstance(e, dict) else e
        if not isinstance(words, list):
            continue
        ws = []
        for i, w in enumerate(words):
            text = next((w[k] for k in ("w", "text", "word") if isinstance(w, dict) and isinstance(w.get(k), str)), None)
            if text is None or not all(isinstance(w.get(k), (int, float)) for k in ("start", "end")):
                raise TimelineError(f'word times for scene "{sid}", word {i}: needs w (text), start and end in seconds, got {json.dumps(w, ensure_ascii=False)[:80]}')
            ws.append({"w": text, "start": float(w["start"]), "end": float(w["end"])})
        sec = e.get("sec") if isinstance(e, dict) and isinstance(e.get("sec"), (int, float)) else None
        out[sid] = {"words": ws, "sec": sec}
    return out


def norm(s):
    return "".join(t for t, *_ in V.tokenize(s)[1])


def align(sid, chunks, words):
    """(start, end) seconds for each chunk of the vo from the measured words. Equal counts pair up in order; otherwise the
    words are matched by text and the chunks between matches share the time of the words between them (by length)."""
    ws = [w for w in words if V.tokenize(w["w"])[1]]               # a bare dash is not a word
    if not ws or not chunks:
        raise TimelineError(f'scene "{sid}": no measured words to place the reveals on' if chunks else f'scene "{sid}": empty vo')
    if any(b["start"] < a["start"] - 1e-6 for a, b in zip(ws, ws[1:])):
        raise TimelineError(f'scene "{sid}": measured word starts go backwards')
    if len(ws) == len(chunks):
        return [(w["start"], max(w["end"], w["start"])) for w in ws]
    a, b = [norm(c) for c in chunks], [norm(w["w"]) for w in ws]
    m = [None] * len(a)
    for i, j, n in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(n):
            m[i + k] = j + k
    if all(x is None for x in m):
        raise TimelineError(f'scene "{sid}": the measured words ({len(ws)}) do not match the vo ({len(chunks)} words); re-measure this line')
    times, i = [None] * len(a), 0
    while i < len(a):
        if m[i] is not None:
            times[i] = (ws[m[i]]["start"], max(ws[m[i]]["end"], ws[m[i]]["start"]))
            i += 1
            continue
        i1 = i
        while i1 < len(a) and m[i1] is None:
            i1 += 1
        j0 = m[i - 1] + 1 if i > 0 else 0                          # measured words that no chunk claimed, between the neighbours
        j1 = m[i1] if i1 < len(a) else len(ws)
        if j0 < j1:
            lo, hi = ws[j0]["start"], ws[j1 - 1]["end"]
        else:
            lo = ws[m[i - 1]]["end"] if i > 0 else ws[0]["start"]
            hi = ws[m[i1]]["start"] if i1 < len(a) else ws[-1]["end"]
        span, tot, acc = max(hi - lo, 0.0), sum(len(a[k]) or 1 for k in range(i, i1)), 0
        for k in range(i, i1):
            w = len(a[k]) or 1
            times[k] = (lo + span * acc / tot, lo + span * (acc + w) / tot)
            acc += w
        i = i1
    return times


# ---------------------------------------------------------------- one scene
def scene_timing(sc, wt, wps):
    """-> (dur frames, {key: local frame}). wt is None for estimated timing, else {"words": [...], "sec": ...}."""
    sid, vo = sc["id"], sc["vo"]
    chunks, toks = V.tokenize(vo)
    items, errs = V.reveal_items(sc)
    if errs:
        raise TimelineError(f'scene "{sid}": ' + "; ".join(errs))
    where = []
    for it in items:
        idx, hits = V.find_word(toks, it["word"], it["nth"])
        if idx is None:
            raise TimelineError(f'scene "{sid}": reveal "{it["key"]}": word "{it["word"]}"' + (f" occurrence {it['nth']}" if it["nth"] > 1 else "")
                                + f" is not in the vo (found {hits}x)")
        where.append((it["key"], toks[idx]))
    reveals, starts = {}, []
    if wt is None:                                                  # estimated
        n, speech = len(chunks), len(chunks) / wps
        dur = max(MIN_FRAMES, ceil6(speech * FPS + LEAD_OUT_S * FPS))
        for key, (_, ci, si, ns) in where:
            t = (ci + si / ns) / n * speech
            reveals[key] = round(t * FPS) + EST_MARGIN
            starts.append((key, t))
    else:                                                           # measured
        times = align(sid, chunks, wt["words"]) if chunks else []
        end = max([e for _, e in times] + [w["end"] for w in wt["words"]] + [wt["sec"] or 0.0])
        dur = max(MIN_FRAMES, ceil6(end * FPS) + round(LEAD_OUT_S * FPS))
        for key, (_, ci, si, ns) in where:
            s0, e0 = times[ci]
            t = s0 + (e0 - s0) * si / ns
            reveals[key] = round(t * FPS) + MEASURED_MARGIN + (SUB_WORD_MARGIN if si else 0)
            starts.append((key, t))
    for key, t in starts:                                           # the rule, checked on the way out
        if reveals[key] / FPS < t - 1e-9:
            raise TimelineError(f'scene "{sid}": reveal "{key}" at frame {reveals[key]} comes before its word ({t:.3f} s)')
        if reveals[key] >= dur:
            raise TimelineError(f'scene "{sid}": reveal "{key}" at frame {reveals[key]} is after the scene ends ({dur} frames)')
    return dur, reveals


def build(scenes, words=None, wps=V.WPS, tid="babies"):
    """-> (timeline dict, notes). `words` is load_words() output for measured timing, None for estimated."""
    out, notes, ids, at = [], [], set(), 0
    for n, sc in enumerate(scenes):
        if not isinstance(sc, dict) or not isinstance(sc.get("id"), str) or not sc["id"]:
            raise TimelineError(f"scene #{n + 1}: needs an object with a string id")
        sid = sc["id"]
        if sid in ids:
            raise TimelineError(f'scene "{sid}": duplicate id')
        ids.add(sid)
        if not isinstance(sc.get("kind"), str) or not isinstance(sc.get("vo"), str):
            raise TimelineError(f'scene "{sid}": needs a string kind and a string vo')
        if not isinstance(sc.get("spec", {}), dict):
            raise TimelineError(f'scene "{sid}": spec should be an object')
        if sc.get("transition") not in V.TRANSITIONS:
            raise TimelineError(f'scene "{sid}": transition should be "wipe" or "cut", got {sc.get("transition")!r}')
        wt = None
        if words is not None:
            wt = words.get(sid)
            if wt is None and V.tokenize(sc["vo"])[0]:
                raise TimelineError(f'scene "{sid}": no measured words in the word-times file (measured timing needs every voiced scene)')
            wt = wt or {"words": [], "sec": None}
        dur, reveals = scene_timing(sc, wt, wps)
        late = [k for k, v in reveals.items() if dur - v < SHORT_SHOW]
        if late:
            notes.append(f'scene "{sid}": {", ".join(late)} appear{"s" if len(late) == 1 else ""} under {SHORT_SHOW / FPS:.1f} s before the scene ends (say it earlier in the sentence, or let the scene run on)')
        scene = {"id": sid, "act": sc.get("act") or "", "kind": sc["kind"], "spec": sc.get("spec") or {}, "vo": sc["vo"], "from": at, "dur": dur, "reveals": reveals}
        if sc.get("transition"):
            scene["transition"] = sc["transition"]
        out.append(scene)
        at += dur
    if words is not None:
        extra = sorted(set(words) - ids)
        if extra:
            notes.append(f'word times for scenes not in the storyboard (ignored): {", ".join(extra[:6])}{"..." if len(extra) > 6 else ""}')
    return {"id": tid, "fps": FPS, "total": at, "timing": "measured" if words is not None else "estimated", "scenes": out}, notes


def write_atomic(path, tl):
    """Whole file or nothing: a render that bundles timeline.json never sees half of it."""
    d = os.path.dirname(os.path.abspath(path))
    os.makedirs(d, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix=".timeline-", suffix=".json", dir=d)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            json.dump(tl, fh, ensure_ascii=False, separators=(",", ":"))
        os.replace(tmp, path)
    except BaseException:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise


def mmss(frames):
    m, s = divmod(round(frames / FPS), 60)
    return f"{m}:{s:02d}"


# ---------------------------------------------------------------- self-test
def check_shape(tl):
    """The Timeline type of contract.ts: what LongCartoon.tsx reads."""
    assert set(tl) == {"id", "fps", "total", "timing", "scenes"} and tl["fps"] == FPS and tl["timing"] in ("estimated", "measured")
    at = 0
    for s in tl["scenes"]:
        assert {"id", "act", "kind", "spec", "vo", "from", "dur", "reveals"} <= set(s) <= {"id", "act", "kind", "spec", "vo", "from", "dur", "reveals", "transition"}, s
        assert isinstance(s["from"], int) and isinstance(s["dur"], int) and s["from"] == at and s["dur"] >= MIN_FRAMES
        assert all(isinstance(v, int) and 0 <= v < s["dur"] for v in s["reveals"].values()), s["reveals"]
        assert s.get("transition", "cut") in ("wipe", "cut")
        at += s["dur"]
    assert tl["total"] == at


def selftest():
    import random
    vo_a = "In 2015 Bihar had 3.4 children and today it is 2.7 per woman."             # 13 words = 5.0 s
    scenes = [
        {"id": "a", "act": "hook", "kind": "title", "vo": vo_a, "spec": {"title": "t"}, "reveals": [{"key": "k34", "word": "3.4"}, {"key": "k27", "word": "2.7"}]},
        {"id": "b", "act": "x", "kind": "statement", "vo": "Short one.", "spec": {"lines": ["x"]}, "transition": "wipe"},
        {"id": "c", "act": "x", "kind": "title", "vo": "", "spec": {"title": "silent"}, "reveals": []},
        {"id": "d", "act": "y", "kind": "title", "transition": "cut", "spec": {}, "vo": "NFHS-4 said 2.2 for India, 2.2 of course, India.",
         "reveals": [{"key": "p", "word": "2.2"}, {"key": "q", "word": "2.2", "nth": 2}, {"key": "r", "word": "4"}, {"key": "s", "word": "of course"}, {"key": "u", "word": "India", "nth": 2}]},
    ]
    # estimated: 13 words / 2.6 = 5.0 s = 150 frames + 15 lead-out; "Short one." is under the 75 frame floor
    tl, _ = build(scenes)
    check_shape(tl)
    a, b, c, d = tl["scenes"]
    assert (a["from"], a["dur"], b["from"], b["dur"], c["from"], c["dur"], d["from"]) == (0, 165, 165, 75, 240, 75, 315), tl
    assert a["reveals"] == {"k34": round(4 / 13 * 150) + 4, "k27": round(10 / 13 * 150) + 4} == {"k34": 50, "k27": 119}, a["reveals"]
    assert "transition" not in a and b["transition"] == "wipe" and d["transition"] == "cut" and a["act"] == "hook" and a["spec"] == {"title": "t"} and a["vo"] == vo_a
    assert tl["timing"] == "estimated" and tl["total"] == sum(s["dur"] for s in tl["scenes"])
    late = [{"id": "L", "kind": "title", "spec": {}, "vo": "one two three four five six seven eight nine ten eleven twelve 2.7",
             "reveals": [{"key": "k", "word": "2.7"}, {"key": "j", "word": "one"}]}]                  # the number is the last word: 23 frames of 165 left
    assert [n.split(" under")[0] for n in build(late)[1]] == ['scene "L": k appears'], build(late)[1]
    r = d["reveals"]                                                                   # NFHS-4 said 2.2 for India, 2.2 of course, India. (9 words)
    assert r["p"] < r["q"] and r["r"] < r["p"] and r["p"] >= round(2 / 9 * 9 / 2.6 * FPS) + 4 and r["u"] > r["s"] > r["q"], r
    assert r["r"] == round((0 + 1 / 2) / 9 * (9 / 2.6) * FPS) + 4                       # the 4 of NFHS-4: half way into the first word
    assert build(scenes, wps=3.9)[0]["scenes"][0]["dur"] == ceil6(13 / 3.9 * FPS + 15)

    # measured: frames come from the word starts
    ws = [("In", 0.0, 0.2), ("2015", 0.2, 0.9), ("Bihar", 0.9, 1.3), ("had", 1.3, 1.5), ("3.4", 1.5, 2.1), ("children", 2.1, 2.6), ("and", 2.6, 2.7),
          ("today", 2.7, 3.1), ("it", 3.1, 3.2), ("is", 3.2, 3.3), ("2.7", 3.21, 3.8), ("per", 3.8, 3.95), ("woman.", 3.95, 4.4)]
    split = "NFHS 4 said 2.2 for India, 2.2 of course, India.".split()                  # a recogniser that split NFHS-4 in two
    words = {"a": {"words": [{"w": w, "start": s, "end": e} for w, s, e in ws], "sec": None},
             "b": {"words": [{"w": "Short", "start": 0.0, "end": 0.4}, {"w": "one.", "start": 0.4, "end": 0.7}], "sec": 1.0},
             "d": {"words": [{"w": w, "start": i * 0.4, "end": i * 0.4 + 0.35} for i, w in enumerate(split)], "sec": None}, "zz": {"words": [], "sec": None}}
    tl, notes = build(scenes, words)
    check_shape(tl)
    a, b, c, d = tl["scenes"]
    assert tl["timing"] == "measured" and a["dur"] == ceil6(4.4 * FPS) + 15 == 147 and b["dur"] == 75 and c["dur"] == 75 and any("zz" in n for n in notes), (a["dur"], notes)
    assert a["reveals"] == {"k34": round(1.5 * FPS) + 1, "k27": round(3.21 * FPS) + 1} == {"k34": 46, "k27": 97}, a["reveals"]
    # whisper split NFHS-4 into NFHS and 4 (0 to 0.75 s together): the 4 is half way, +1 +2 frames; 2.2 is the 4th and 7th measured word
    assert d["reveals"]["r"] == round(0.375 * FPS) + 1 + 2 == 14 and d["reveals"]["r"] / FPS >= 0.4, d["reveals"]
    assert d["reveals"]["p"] == round(3 * 0.4 * FPS) + 1 and d["reveals"]["q"] == round(6 * 0.4 * FPS) + 1, d["reveals"]
    assert d["reveals"]["u"] == round(9 * 0.4 * FPS) + 1 and d["reveals"]["s"] == round(7 * 0.4 * FPS) + 1, d["reveals"]    # last India is the 10th measured word
    # raw recogniser output that spelled the digits out: the chunk "2.0" takes the span of "two point zero", so the reveal lands on "two"
    sp = {"id": "n", "kind": "title", "spec": {}, "vo": "It fell to 2.0 again, below 2.1.", "reveals": [{"key": "x", "word": "2.0"}, {"key": "y", "word": "2.1"}]}
    heard = [{"w": w, "start": i * 0.3, "end": i * 0.3 + 0.25} for i, w in enumerate("it fell to two point zero again below two point one".split())]
    assert build([sp], {"n": {"words": heard, "sec": None}})[0]["scenes"][0]["reveals"] == {"x": round(3 * 0.3 * FPS) + 1, "y": round(8 * 0.3 * FPS) + 1} == {"x": 28, "y": 73}
    # a "sec" longer than the last word stretches the scene; a reveal late in a long line stays inside it
    words["a"]["sec"] = 6.0
    assert build(scenes, words)[0]["scenes"][0]["dur"] == 6 * FPS + 15
    # the rule, on random starts: no reveal frame is ever before its word starts
    rng = random.Random(7)
    for _ in range(300):
        t, ws2 = 0.0, []
        for w in vo_a.split():
            t += rng.random() * 0.3
            ws2.append({"w": w, "start": t, "end": t + 0.05 + rng.random() * 0.4})
            t = ws2[-1]["end"]
        got, _ = build(scenes[:1], {"a": {"words": ws2, "sec": None}})
        for key, idx in (("k34", 4), ("k27", 10)):
            f = got["scenes"][0]["reveals"][key]
            assert f / FPS >= ws2[idx]["start"] and f - ws2[idx]["start"] * FPS <= 1.5 + 1e-9, (key, f, ws2[idx])

    def fails(mut, words_=None, text=""):
        s = json.loads(json.dumps(scenes))
        mut(s)
        try:
            build(s, words_)
        except TimelineError as e:
            assert text in str(e), (text, str(e))
            return
        raise AssertionError(f"build should have stopped: {text}")
    fails(lambda s: s[0]["reveals"].append({"key": "z", "word": "Kerala"}), None, "not in the vo")
    fails(lambda s: s[0]["reveals"].append({"key": "z", "word": "2.7", "nth": 2}), None, "occurrence 2")
    fails(lambda s: s[0]["reveals"].append({"key": "k34", "word": "2.7"}), None, "listed twice")
    fails(lambda s: s[1].update(id="a"), None, "duplicate id")
    fails(lambda s: s[1].update(transition="fade"), None, "transition")
    fails(lambda s: s[1].pop("vo"), None, "string kind")
    fails(lambda s: None, {"a": words["a"], "d": words["d"]}, 'scene "b": no measured words')
    fails(lambda s: None, {**words, "a": {"words": [{"w": "x", "start": 0, "end": 1}], "sec": None}}, "do not match the vo")
    fails(lambda s: None, {**words, "a": {"words": [dict(w, start=-w["start"]) for w in words["a"]["words"]], "sec": None}}, "backwards")
    s_empty = [{"id": "e", "kind": "title", "vo": "", "spec": {}, "reveals": [{"key": "k", "word": "x"}]}]
    try:
        build(s_empty)
        raise AssertionError("a reveal in a silent scene must stop the build")
    except TimelineError:
        pass

    # the word-times file shapes, and the whole CLI through a temp dir (never touches public/)
    def dump(path, obj):
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(obj, fh)

    def quiet(argv):                                                                    # the CLI's own messages are not the test's
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            return main(argv)
    with tempfile.TemporaryDirectory() as td:
        sb, wf, out = (os.path.join(td, n) for n in ("sb.json", "words.json", "timeline.json"))
        dump(sb, {"id": "demo", "scenes": scenes})
        dump(wf, {"id": "babies", "fps": 30, "made": "x", "a": words["a"]["words"], "b": {"words": words["b"]["words"], "sec": 1.0}, "d": {"words": words["d"]["words"]}})
        assert quiet([sb, "--out", out]) == 0 and json.load(open(out))["timing"] == "estimated"
        assert quiet([sb, "--words", wf, "--out", out, "--table"]) == 0                  # no words for the silent scene c, and none needed
        got = json.load(open(out))
        check_shape(got)
        assert got["id"] == "demo" and got["timing"] == "measured" and got["scenes"][0]["reveals"] == {"k34": 46, "k27": 97}
        assert sorted(os.listdir(td)) == ["sb.json", "timeline.json", "words.json"], os.listdir(td)       # no temp file left behind
        dump(wf, {"scenes": [{"id": "a", "words": words["a"]["words"]}]})
        assert list(load_words(wf)) == ["a"]
        assert quiet([sb, "--words", wf, "--out", out]) == 1                                              # b and d have no measured words
        before = open(out).read()
        dump(sb, {"scenes": [dict(scenes[0], reveals=[{"key": "k", "word": "nope"}])]})
        assert quiet([sb, "--out", out]) == 1 and open(out).read() == before                             # a failed build leaves the old file alone
        assert quiet([os.path.join(td, "missing.json"), "--out", out]) == 2
    print("long_timeline selftest OK")


# ---------------------------------------------------------------- main
def main(argv=None):
    ap = argparse.ArgumentParser(description="Build timeline.json for the long-form cartoon from a storyboard.")
    ap.add_argument("storyboard", nargs="?", default=V.STORYBOARD)
    ap.add_argument("--words", help="word_times.json: scene id -> [{w, start, end}] seconds (measured timing)")
    ap.add_argument("--out", default=OUT, help=f"where to write (default {os.path.relpath(OUT, V.ROOT)})")
    ap.add_argument("--wps", type=float, default=V.WPS, help="narration pace for estimated timing, words per second")
    ap.add_argument("--table", action="store_true", help="print one line per scene")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args(argv)
    if a.selftest:
        return selftest()
    try:
        tid, scenes = V.load_storyboard(a.storyboard)
        words = load_words(a.words) if a.words else None
        tl, notes = build(scenes, words, a.wps, tid)
    except FileNotFoundError as e:
        print(f"cannot read {e.filename}", file=sys.stderr)
        return 2
    except (V.StoryboardError, TimelineError, json.JSONDecodeError) as e:
        print(f"NOT BUILT: {e}", file=sys.stderr)
        return 1
    write_atomic(a.out, tl)
    if a.table:
        print(f'{"scene":<8}{"kind":<12}{"from":>7}{"dur":>6}  reveals')
        for s in tl["scenes"]:
            print(f'{s["id"]:<8}{s["kind"]:<12}{s["from"]:>7}{s["dur"]:>6}  ' + " ".join(f"{k}@{v}" for k, v in s["reveals"].items()))
    for n in notes:
        print("note:", n, file=sys.stderr)
    print(f'{a.out}: {len(tl["scenes"])} scenes, {tl["total"]} frames ({mmss(tl["total"])}), {tl["timing"]} timing, '
          f'{sum(len(s["reveals"]) for s in tl["scenes"])} reveals')
    return 0


if __name__ == "__main__":
    sys.exit(main())

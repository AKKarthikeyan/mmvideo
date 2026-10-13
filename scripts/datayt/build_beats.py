#!/usr/bin/env python3
"""Data Kadai "beat" Shorts: one thing on screen at a time, very large type, a cut every bar or two.
Built after the Shorts benchmark (docs/datakadai/SHORTS_BENCHMARK.md) to sit beside the all-states templates.

  clues       Guess the state from five clues, hardest first, then a 3-2-1 and the reveal
  countdown   Top five, one state per beat from #5 to #1, then the all-states map as the closing beat
  versus      State against state across five categories, with a running score
  paradox     Two official numbers about one state that seem to disagree, a second state for contrast, what the two
              numbers have to do with each other across all states, then every state on the map
  fact        One state, one fact: the same cards as a paradox with one measure (the state's figure, the country or
              the next state for scale, our own reading), then every state on the map
  share       One state's share of a national total on a 100-square grid, the reveal, the split among the leading
              states, one or two cards on why, then every state's share on the map
  race        Two states' lines over the years: the old leader ahead, then the run to the latest year, what changed,
              the new leader against a stack of the next largest (or, with "n": 1, against the next state alone when
              the lead is clear and three years old), then every state on the map
  then        One number at two dates: the place on the map, the earlier figure, the later figure and the change,
              one or two cards on why, our own reading of it, then every state's change on the map. The years around
              both dates are tested, so a freak starting year or a rise that has since reversed stops the build
  pick        Higher or lower: a few rounds, each one question about two states with a pause to decide before the
              numbers appear, then a card with every answer
  over        A ratio that passes 100: 100 squares for the whole and the extra squares spilling out below, the states
              above the line as bars against it, a finding, then every state on the map
  place       How a place became part of India: the hook on the map, then one dated event per beat on a timeline,
              each naming the Act, treaty or record it comes from. Every span of years in the script is recomputed
              from the dates in the config

One story = one config, public/datayt/beats/configs/<id>.json. Data specs are the same as build_story.py
({"nfhs": id}, {"plfs": [...]}, {"values": {...}}), plus {"coverage": key} for the mobile-coverage table, {"gw": key} for the ground water table,
{"rbi": [table, year]} for a table of the RBI Handbook of Statistics on Indian States and {"ls": [table id, column]} for a state table from a Lok Sabha answer.
A figure built from tables: {"ratio": [spec, spec], "scale": 100} (a rate, state by state), {"add": [spec, ...]} and {"minus": [spec, spec]}.
Every claim in a clue ("highest", "lowest") is checked against the data before anything is voiced.
Writes public/datayt/beats/<id>/data.json, music.wav, narration and src/datayt/beatData.ts. Template: src/datayt/BeatStory.tsx.
Run from the repo root: python3 scripts/datayt/build_beats.py <id> [...]
Add --check to test scripts without voicing them: every data check runs, spoken lengths are estimated from the word
count, nothing is sent to the voice service, and the result goes to out/datakadai/bank_check/ (configs are then read
from public/datayt/bank/scripts/ as well as the beats folder).
Add --mute to build the text-led cut of a script: music and timing as usual, estimated line lengths, no narration.

House rules. The Short skeleton and the checklist in docs/datakadai/VIDEO_TEMPLATES_AND_YT_RULES.md, and the limits in
docs/datakadai/bank/WRITER_GUIDE.md, are tested by house_rules() before a line is voiced: the hook is on the map,
three to five beats follow, every state's number closes the story, the last card carries the source and one question,
the title claims only numbers the video shows, the length is 30 to 45 seconds. A script written under these rules
("rules": 2, the default for the script bank) stops when it breaks one; the Shorts approved before them only list what
they would break.
"""
import glob, json, math, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import music_shorts as M
import voice_dk as V
from build_india_shorts import PALETTES
from build_mapped import ALIAS as GEO_ALIAS, NUDGE, GEO
from build_story import series as base_series, fmt, SHORT

FPS, VO_LEAD = 30, 0.12
BASE = "public/datayt/beats"      # --check writes under out/ instead
MIN_BARS = {"hook": 2, "clue": 2, "count": 1, "reveal": 2, "recap": 2, "rank": 2, "map": 2, "versus": 2, "score": 2, "end": 2,
            "spot": 2, "fact": 2, "say": 2, "mapend": 2, "grid": 2, "race": 2, "stack": 3, "pick": 2, "tally": 2, "event": 2, "line100": 3, "shift": 2}
MUTE = False      # --mute: the text-led cut, no narration
SPLITS = {"Telangana": 2014, "Andhra Pradesh": 2014, "Ladakh": 2019, "Jammu and Kashmir": 2019}      # a figure from before a state was split covers a different area
PAGE = "#F7F4EE"
BANNED = re.compile(r"\b(truth|reality|secret|exposed|shocking|worst|best|backward|failed|no\.? ?1|number one|today|currently|right now|independent country)\b|#1", re.I)
NUMBER_WORDS = dict(zip("1 2 3 4 5 6 7 8 9 10 11 12".split(), "one two three four five six seven eight nine ten eleven twelve".split()))
COVERAGE = "public/datayt/coverage/mobile_coverage_2026-02-28.json"
GROUNDWATER = "public/datayt/groundwater/gw_2025.json"
PCT = {"g5_pct": ("g5", "total"), "uncovered_pct": ("uncovered", "total")}
geo = lambda s: GEO_ALIAS.get(s, s)
nm = lambda s: SHORT.get(s, s)
SAY = {"NCT of Delhi": "Delhi", "Jammu and Kashmir": "Jammu and Kashmir", "Dadra & Nagar Haveli and Daman & Diu": "Dadra, Nagar Haveli, Daman and Diu"}
say = lambda s: SAY.get(s, s)


def series(spec):
    if "ratio" in spec or "add" in spec or "minus" in spec:      # a figure built from two or more tables, state by state: a rate, a sum or a gap
        parts = [series(x) for x in spec.get("ratio") or spec.get("add") or spec["minus"]]
        k = spec.get("scale", 1); common = set.intersection(*(set(v) for v, _ in parts)); tot = [i for _, i in parts]
        assert len(common) >= spec.get("min_states", 15), f"only {len(common)} states are in every table of {spec}"
        if "add" in spec:
            return {s: k * sum(v[s] for v, _ in parts) for s in common}, (k * sum(tot) if all(i is not None for i in tot) else None)
        assert len(parts) == 2, "a ratio or a gap takes exactly two tables"
        (a, ia), (b, ib) = parts
        if "minus" in spec:
            return {s: k * (a[s] - b[s]) for s in common}, (k * (ia - ib) if ia is not None and ib is not None else None)
        return {s: k * a[s] / b[s] for s in common if b[s]}, (k * ia / ib if ia is not None and ib else None)
    if "coverage" in spec:
        d = json.load(open(COVERAGE)); k = spec["coverage"]; tot = d["published_total_row"]
        india = round(100 * tot[PCT[k][0]] / tot[PCT[k][1]], 1) if k in PCT else tot.get(k)
        return {s: r[k] for s, r in d["states"].items()}, india
    if "gw" in spec:      # the 2025 ground water assessment table: recharge, extractable, extraction, stage
        d = json.load(open(GROUNDWATER)); k = spec["gw"]
        return {s: r[k] for s, r in d["states"].items()}, d["published_total_row"][k]
    if "ls" in spec:      # a state table parsed from a Lok Sabha answer (scripts/datayt/parse_loksabha.py): [table id, column number from 0]
        tid, col = spec["ls"]
        t = next(x for x in json.load(open(f"public/datayt/sources/loksabha/tables/{tid.split('-')[1]}.json"))["tables"] if x["id"] == tid)
        v = {s: r[col] for s, r in t["rows"].items() if col < len(r) and isinstance(r[col], (int, float))}
        tot = (t.get("total") or [None] * (col + 1))[col] if t.get("total") and col < len(t["total"]) else None
        return v, tot if tot is not None else (sum(v.values()) if spec.get("sum") else None)      # "sum": the answer prints no total row, and its rows are the whole country
    if "rbi" in spec:
        no, year = spec["rbi"]
        t = json.load(open(f"public/datayt/sources/rbi_handbook/T{int(no):03d}.json"))
        col = [c for c in t["columns"] if c == year or c.split("|")[-1].strip() == year]      # the year, or the full label of a two-level column ("2024-25 | Female")
        assert len(col) == 1, f"T{int(no):03d}: no single column for {year}"
        v = {s: r[col[0]] for s, r in t["states"].items() if r.get(col[0]) is not None}      # states with no figure that year are left out
        return v, v.pop("India", None)
    return base_series(spec)


def tint(c, p, to=PAGE):
    """A colour moved the fraction p toward the page colour."""
    h = lambda x, i: int(x[1 + 2 * i:3 + 2 * i], 16)
    return "#" + "".join(f"{round(h(c, i) + (h(to, i) - h(c, i)) * p):02X}" for i in range(3))


def is_dark(c):
    return (0.299 * int(c[1:3], 16) + 0.587 * int(c[3:5], 16) + 0.114 * int(c[5:7], 16)) / 255 < 0.56


signed = lambda v, dec=1: f"{v:+.{dec}f}".replace("-", "−") if round(v, dec) else f"{0:.{dec}f}"      # a change that rounds to nothing carries no sign


def spoken(text):
    """Seconds this narrator takes for a line, fitted on the 67 lines voiced by 11 Oct 2026 (typical error 0.5 s)."""
    return round(0.24 * len(text.replace("-", " ").split()) + 0.60 * max(1, len(re.findall(r"[.!?:;]+(?:\s|$)", text))) + 0.65 * text.count(",") + 0.26, 2)


def inr(v):
    """Rupees with Indian digit grouping: 387623 -> ₹3,87,623."""
    s = str(int(round(v))); head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:]); head = head[:-2]
    return "₹" + ",".join(([head] if head else []) + parts + [tail])


show = lambda v, unit: inr(v) if unit == "₹" else fmt(v, unit)


def spearman(a, b):
    """Rank correlation of two {state: value} series over the states both have; returns (rho, n)."""
    ks = sorted(set(a) & set(b))
    def ranks(v):
        o = sorted(range(len(v)), key=lambda i: v[i]); r = [0.0] * len(v); i = 0
        while i < len(o):
            j = i
            while j + 1 < len(o) and v[o[j + 1]] == v[o[i]]:
                j += 1
            for k in range(i, j + 1):
                r[o[k]] = (i + j) / 2 + 1
            i = j + 1
        return r
    x, y = ranks([a[k] for k in ks]), ranks([b[k] for k in ks])
    mx, my = sum(x) / len(x), sum(y) / len(y)
    cov = sum((p - mx) * (q - my) for p, q in zip(x, y))
    return cov / math.sqrt(sum((p - mx) ** 2 for p in x) * sum((q - my) ** 2 for q in y)), len(ks)


def value(q, st):
    """A number from a small spec: a state's figure ({"data": spec}), its share of the all-India figure in percent
    ({"share": spec}), or the ratio or difference of two such specs ({"ratio": [a, b]}, {"diff": [a, b]}). "state" overrides the story's state ("India" for
    the all-India row) and "scale" multiplies the result."""
    if "ratio" in q:
        return value(q["ratio"][0], st) / value(q["ratio"][1], st) * q.get("scale", 1)
    if "diff" in q:
        return (value(q["diff"][0], st) - value(q["diff"][1], st)) * q.get("scale", 1)
    spec = q.get("share") or q["data"]
    vals, india = series(spec); s = q.get("state", st)
    v = india if s == "India" else find(vals, s)
    assert v is not None and ("share" not in q or india), f"no value for {s} in {spec}"
    return (100 * v / india if "share" in q else v) * q.get("scale", 1)


def run_checks(sid, cfg, st):
    """Recompute every spoken or printed comparison listed under "tests"; a failed one stops the build."""
    done = []
    for k in cfg.get("tests", []):
        v = value(k["value"], st)
        if "equals" in k:
            assert math.floor(v + 0.5) == k["equals"], f"{sid}: '{k['says']}' fails: {v:g} does not round to {k['equals']}"      # halves round up, as a reader would
        else:
            assert k["min"] <= v <= k["max"], f"{sid}: '{k['says']}' fails: {v:g} is outside {k['min']} to {k['max']}"
        done.append(f"{k['says']}: {v:.2f}")
    return done


def fact_beats(cfg, st0):
    """The "why" cards of the share and then stories: a state's outline, one computed number, a line of meaning and bars to compare."""
    out = []
    for c in cfg.get("facts", []):
        st = c.get("state", st0); u = c.get("unit", "%")
        bars = [{"name": b["name"], "v": value(b, st), "unit": b.get("unit", u)} for b in c.get("bars", [])]
        top = c.get("bar_max") or max([b["v"] for b in bars] or [1])
        out.append({"kind": "fact", "name": nm(st), "geo": geo(st), "kicker": c["kicker"], "big": show(value(c["value"], st), u), "text": c.get("text", ""), "sub": c.get("sub", ""),
                    "bars": [{"name": b["name"], "label": show(b["v"], b["unit"]), "frac": min(1, b["v"] / top)} for b in bars], "vo": c["vo"]})
    return out


def house_rules(sid, cfg, beats, extra):
    """What the research and the writer's guide ask of every Short, as far as code can test it. Returns the rules broken."""
    typ, kinds, bad = cfg["type"], [b["kind"] for b in beats], []
    seen = []      # every string a viewer can read
    def walk(x):
        if isinstance(x, str):
            seen.append(x)
        elif isinstance(x, dict):
            for k, v in x.items():
                if k not in ("vo", "color", "geo"):
                    walk(v)
        elif isinstance(x, list):
            for v in x:
                walk(v)
    walk(beats); walk({k: v for k, v in extra.items() if k != "checked"}); walk([cfg["chip"], cfg["source_short"]])
    screen = " ".join(seen).replace("*", "").lower()
    words = lambda t: len(t.replace("*", "").split())
    hook = " ".join(beats[0].get("lines") or [])
    if words(hook) > 12:
        bad.append(f"the hook is {words(hook)} words on screen (at most 12)")
    for b in beats:
        for l in b.get("lines") or []:
            if words(l) > 8:
                bad.append(f"a screen line is {words(l)} words (at most 8): '{l}'")
        v = b.get("vo") or ""
        if len(v.split()) > 13:
            bad.append(f"a voice line is {len(v.split())} words (at most 13): '{v}'")
        if re.search(r"\d", re.sub(r"\b[2-6]G\b", "", v)):      # "5G" is a name, not a number to spell out
            bad.append(f"a voice line has digits (spell numbers and years out): '{v}'")
    title = cfg.get("yt_title", "")
    for where, text in [("title", title)] + [("screen", x) for x in seen] + [("voice", b.get("vo") or "") for b in beats]:
        m = BANNED.search(text.replace("*", ""))
        if m:
            bad.append(f"'{m.group(0)}' in the {where}: '{text[:70]}'")
    if not 0 < len(title) <= 60:
        bad.append(f"the title is {len(title)} characters (1 to 60)")
    for n in re.findall(r"\d+(?:\.\d+)?", title):      # a number in the title must be shown in the video
        if n not in screen and NUMBER_WORDS.get(n, "\0") not in screen:
            bad.append(f"the title says {n}, which never appears on screen")
    if not re.search(r"(19|20)\d\d", cfg["source_short"]) or not cfg.get("source"):
        bad.append("the source line needs the publisher and the period")
    if "?" not in (beats[-1].get("q") or ""):
        bad.append("the last card needs one question to answer in the comments")
    if typ != "pick" and kinds[0] != "spot":
        bad.append("the hook is not on the map: open on the place, lit on the India map (share scripts: \"open\": \"map\")")
    if typ not in ("pick", "place"):
        if kinds[-2:] != ["map", "mapend"]:
            bad.append("the story does not close on every state's number on the map")
        if not 3 <= len(kinds) - 3 <= 5:
            bad.append(f"{len(kinds) - 3} beats between the hook and the map (three to five)")
    if not extra.get("checked"):
        bad.append("no computed finding is carried as a test")
    for b in beats:
        if b["kind"] in ("map", "mapend") and len(b.get("note") or "") > 165:      # three lines hold about 165 characters
            bad.append(f"the map note is {len(b['note'])} characters (at most 165, or it runs into the source line)"); break
    if 22 * len(cfg["chip"]) + 13 * len(cfg["source_short"]) > 1000:
        bad.append("the chip and the source line together are too wide for the top row: shorten the source line")
    if kinds[-1] == "mapend" and len(cfg["source"]) > 590:      # ten small lines fit under the map; the full reference goes in the post pack
        bad.append(f"the source text is {len(cfg['source'])} characters (at most 590 on the last card, or it runs off the frame)")
    for b in beats:
        for r in b.get("bars") or []:
            if len(r["label"]) > 9:      # the figure beside a bar has a narrow column
                bad.append(f"a bar figure is too long to read beside its bar: '{r['label']}' (move the unit to the line under the bars)"); break
    return bad


def find(vals, state):
    """The value for a state whatever spelling the dataset uses."""
    for k in (state, geo(state), next((a for a, g in GEO_ALIAS.items() if g == state), state)):
        if k in vals:
            return vals[k]
    raise SystemExit(f"no value for {state}")


def build(cfg):
    sid, typ = cfg["id"], cfg["type"]
    pal = PALETTES[cfg.get("palette", "A")]
    d = f"{BASE}/{sid}"; os.makedirs(d, exist_ok=True)
    beats = [{"kind": "hook", "lines": cfg.get("hook", []), "vo": cfg.get("hook_vo") or " ".join(cfg.get("hook", [])).replace("*", "")}]
    extra = {}
    if typ == "clues":
        st = cfg["state"]
        for i, c in enumerate(cfg["clues"]):
            vals, _ = series(c["data"]); v = find(vals, st)
            if c.get("claim") in ("highest", "lowest"):
                rk = sorted(vals.values(), reverse=c["claim"] == "highest")
                lead = abs(rk[0] - rk[1])
                assert rk[0] == v and lead >= c.get("min_lead", 0.5), f"{sid} clue {i + 1}: {st} is not clearly the {c['claim']} ({v} vs {rk[:3]})"
            big = c.get("big") or fmt(v, c.get("unit", "%"))
            beats.append({"kind": "clue", "n": i + 1, "of": len(cfg["clues"]), "big": big, "text": c["text"], "vo": c.get("vo") or f"Clue {i + 1}. {c['text']}"})
        beats.append({"kind": "count", "text": "Which state?", "vo": "Which state is it?"})
        beats.append({"kind": "reveal", "name": nm(st), "geo": geo(st), "sub": cfg.get("reveal_sub", ""), "vo": f"It's {say(st)}!"})
        beats.append({"kind": "recap", "name": nm(st), "geo": geo(st), "items": [{"big": b["big"], "text": b["text"]} for b in beats if b["kind"] == "clue"],
                      "vo": cfg.get("recap_vo", "How many clues did you need?")})
    elif typ == "countdown":
        vals, india = series(cfg["data"]); unit = cfg.get("unit", "%")
        rk = sorted(vals.items(), key=lambda x: -x[1])
        assert rk[0][1] - rk[1][1] >= cfg.get("min_lead", 1.0), f"{sid}: lead of #1 is under the minimum"
        top = rk[:5]
        for i in range(4, -1, -1):
            s_, v = top[i]
            beats.append({"kind": "rank", "rank": i + 1, "name": nm(s_), "geo": geo(s_), "big": fmt(v, unit), "frac": v / top[0][1], "label": cfg["label"],
                          "vo": (f"{['One', 'Two', 'Three', 'Four', 'Five'][i]}: {say(s_)}, {v:g}." if i else f"Number one: {say(s_)}, {v:g} percent.")})
        asc = sorted(vals, key=lambda s_: (vals[s_], s_)); n = len(asc)
        extra["map"] = [{"name": geo(s_), "label": fmt(vals[s_], ""), "bucket": min(4, i * 5 // n), "nudge": NUDGE.get(geo(s_), (0, 0))} for i, s_ in enumerate(asc)]
        beats.append({"kind": "map", "title": cfg["map_title"], "sub": f"India {fmt(india, unit)}" if india is not None else "",
                      "vo": cfg.get("map_vo") or (f"Every state, mapped. India: {india:g} percent." if india is not None else "Every state, mapped.")})
    elif typ == "versus":
        a, b = cfg["a"], cfg["b"]; sa = sb = 0
        for c in cfg["categories"]:
            vals, _ = series(c["data"]); va, vb = find(vals, a), find(vals, b)
            assert va != vb, f"{sid}: {c['label']} is a tie"
            high = c.get("better", "high") == "high"
            win = "a" if (va > vb) == high else "b"
            sa += win == "a"; sb += win == "b"
            u = c.get("unit", "%")
            beats.append({"kind": "versus", "label": c["label"], "note": "higher is better" if high else "lower is better", "a": fmt(va, u), "b": fmt(vb, u), "win": win, "sa": sa, "sb": sb,
                          "vo": c.get("vo") or f"Round {len([x for x in beats if x['kind'] == 'versus']) + 1}, {c['say']}: {say(a if win == 'a' else b)}."})
        lead = a if sa > sb else b
        beats.append({"kind": "score", "sa": sa, "sb": sb, "vo": f"Final score: {say(lead)} {max(sa, sb)}, {say(b if lead == a else a)} {min(sa, sb)}."})
        extra["a"] = {"name": nm(a), "geo": geo(a)}; extra["b"] = {"name": nm(b), "geo": geo(b)}
    elif typ in ("paradox", "fact"):      # "fact": one state, one fact, told on the same cards without a second measure
        st0 = cfg["state"]; checked = []
        beats[0].update({"kind": "spot", "geo": geo(st0), "name": nm(st0)})
        for i, c in enumerate(cfg["facts"]):
            vals, india = series(c["data"]); st = c["state"]; u = c.get("unit", "%")
            if c.get("as") == "share":      # each state's share of the all-India figure, in percent
                assert india, f"{sid} fact {i + 1}: no all-India figure to take a share of"
                vals, india = {s_: 100 * x / india for s_, x in vals.items()}, 100.0
            v = find(vals, st)
            if c.get("claim") in ("highest", "lowest"):
                rk = sorted(vals.values(), reverse=c["claim"] == "highest")
                assert rk[0] == v and rk[0] != rk[1], f"{sid} fact {i + 1}: {st} is not the {c['claim']} ({v} vs {rk[:3]})"
                lead = abs(rk[0] - rk[1])      # under the house rules a "highest" or "lowest" needs a clear lead over the next state
                assert cfg.get("rules", 1) < 2 or (lead >= 0.03 * abs(rk[1]) and (u != "%" or lead >= 1)), \
                    f"{sid} fact {i + 1}: {st} leads the next state by only {lead:g}: level, not the {c['claim']}"
                checked.append(f"{st} is the {c['claim']} of {len(vals)} with data ({show(v, u)})")
            ctx = {"n": len(vals), "v": show(v, u)}
            bars = [{"name": nm(st), "label": show(v, u), "v": v}]
            for o in c.get("compare", []):
                ov = india if o == "India" else find(vals, o)
                assert ov is not None, f"{sid} fact {i + 1}: no value for {o}"
                bars.append({"name": nm(o), "label": show(ov, u), "v": ov})
            top = c.get("bar_max") or max(x["v"] for x in bars)
            sub = c.get("sub", "")
            if "counts" in c:      # the two counts behind a share, read from the coverage table
                row = json.load(open(COVERAGE))["states"]; r = row.get(st) or row[next(a for a, g in GEO_ALIAS.items() if g == st)]
                a, b = (r[k] for k in c["counts"])
                assert abs(100 * a / b - v) < 0.06, f"{sid} fact {i + 1}: counts do not give {v}"
                sub = f"{a:,} of {b:,} {c.get('counts_unit', 'villages')}"
            beats.append({"kind": "fact", "name": nm(st), "geo": geo(st), "kicker": c["kicker"], "big": show(v, u), "text": c.get("text", "").format(**ctx), "sub": sub.format(**ctx),
                          "bars": [{"name": x["name"], "label": x["label"], "frac": x["v"] / top} for x in bars] if len(bars) > 1 else [], "vo": c["vo"].format(**ctx)})
        for k in cfg.get("checks", []):      # every spoken comparison is recomputed here; a failed check stops the build
            if k["kind"] == "ratio":
                r = find(series(k["num"]["data"])[0], k["num"]["state"]) / find(series(k["den"]["data"])[0], k["den"]["state"])
                assert r >= k["min"], f"{sid}: ratio is {r:.2f}, under {k['min']}"
                checked.append(f"{k['num']['state']} / {k['den']['state']} = {r:.2f} (at least {k['min']})")
            elif k["kind"] == "round":
                vals, india = series(k["data"]); v = india if k["state"] == "India" else find(vals, k["state"])
                assert round(v) == k["equals"], f"{sid}: {k['state']} is {v}, which does not round to {k['equals']}"
                checked.append(f"{k['state']} {v:g} rounds to {k['equals']}")
            else:
                raise SystemExit(f"{sid}: unknown check {k['kind']}")
        so = cfg["so"]; ctx = {}
        if "weak_link" in so:      # "only weakly linked" is voiced only when the rank correlation across states is small
            rho, n = spearman(series(so["weak_link"]["a"])[0], series(so["weak_link"]["b"])[0])
            assert abs(rho) <= so["weak_link"].get("max_abs", 0.3), f"{sid}: rank correlation is {rho:.2f}; 'weakly linked' is not supported"
            ctx = {"n": n, "rho": f"{rho:.2f}"}; checked.append(f"rank correlation across {n} states = {rho:.2f}")
        beats.append({"kind": "say", "lines": [l.format(**ctx) for l in so["lines"]], "vo": so["vo"].format(**ctx)})
        m = cfg["map"]; vals, india = series(m["data"]); unit = m.get("unit", "%")
        if m.get("as") == "share":
            assert india, f"{sid}: the map has no all-India figure to take a share of"
            vals, india = {s_: 100 * x / india for s_, x in vals.items()}, None
        asc = sorted(vals, key=lambda s_: (vals[s_], s_)); n = len(asc)
        dec = m.get("dec", 0 if all(float(x).is_integer() for x in vals.values()) else None)      # counts are whole numbers on the map
        extra["map"] = [{"name": geo(s_), "label": fmt(vals[s_], "", dec), "bucket": min(4, i * 5 // n), "nudge": NUDGE.get(geo(s_), (0, 0))} for i, s_ in enumerate(asc)]
        missing = {x["name"] for x in extra["map"]} - set(GEO)
        assert not missing, f"{sid}: states not on the map: {missing}"
        ctx = {"india": fmt(india, unit) if india is not None else ""}
        ring = [geo(x) for x in m.get("ring", [])]
        beats.append({"kind": "map", "title": m["title"], "sub": m.get("sub", "").format(**ctx), "note": m.get("note", ""), "anim": True, "ring": ring, "vo": m["vo"].format(**ctx)})
        extra["checked"] = checked
        cfg["end"] = {"kind": "mapend", "note": m.get("note", ""), "ring": ring, **cfg["end"]}
    elif typ == "share":
        st0 = cfg["state"]
        vals, india = series(cfg["data"])
        assert india, f"{sid}: the table has no all-India row"
        assert abs(sum(vals.values()) / india - 1) < 0.005, f"{sid}: state rows do not add up to the all-India row"
        sh = {s_: 100 * v / india for s_, v in vals.items()}
        named = cfg["parts"]; rk = sorted(sh, key=lambda s_: -sh[s_])
        assert named[0] == st0 and rk[:len(named)] == named, f"{sid}: the named parts are not the top {len(named)} in order ({rk[:4]})"
        cols = [pal["accent"], pal["bands"][2], pal["bands"][0]]
        rest = 100 - sum(sh[s_] for s_ in named)
        assert round(rest) == cfg["split"].get("rest_rounds", round(rest)), f"{sid}: the rest is {rest:.2f}, not {cfg['split']['rest_rounds']}"
        extra["grid"] = {"parts": [{"name": nm(s_), "v": round(sh[s_], 3), "label": f"{sh[s_]:.1f}", "color": cols[i]} for i, s_ in enumerate(named)] +
                                  [{"name": cfg.get("rest_name", "All other states"), "v": round(rest, 3), "label": f"{rest:.1f}", "color": "#B9A898"}],
                         "caption": cfg["grid_caption"]}
        ctx = {"share": f"{sh[st0]:.1f}%", "n": len(vals)}
        if cfg.get("open") == "map":      # the place and the surprise on the map in the first frame; the squares follow
            beats[0].update({"kind": "spot", "geo": geo(st0), "name": nm(st0)})
        else:      # the first two Shorts of this type: the squares first, then the state revealed
            beats[0].update({"kind": "grid", "mode": "hook"})
            beats.append({"kind": "reveal", "name": nm(st0), "geo": geo(st0), "sub": cfg["reveal"]["sub"].format(**ctx), "vo": cfg["reveal"]["vo"]})
        beats.append({"kind": "grid", "mode": "split", "kicker": cfg["split"]["kicker"], "vo": cfg["split"]["vo"]})
        beats += fact_beats(cfg, st0)
        m = cfg["map"]; cuts = m["bands"]
        asc = sorted(sh, key=lambda s_: (sh[s_], s_))
        extra["map"] = [{"name": geo(s_), "label": "<0.1" if sh[s_] < 0.05 else f"{sh[s_]:.1f}", "bucket": sum(sh[s_] >= c for c in cuts), "nudge": NUDGE.get(geo(s_), (0, 0))} for s_ in asc]
        missing = {x["name"] for x in extra["map"]} - set(GEO)
        assert not missing, f"{sid}: states not on the map: {missing}"
        ring = [geo(x) for x in m.get("ring", [])]
        beats.append({"kind": "map", "title": m["title"], "sub": m.get("sub", ""), "note": m.get("note", ""), "anim": True, "ring": ring, "vo": m["vo"]})
        extra["checked"] = [f"state rows add up to the all-India row ({sum(vals.values()) / india:.4f})", f"{st0} is first with {sh[st0]:.2f}% of the all-India figure"] + run_checks(sid, cfg, st0)
        cfg["end"] = {"kind": "mapend", "note": m.get("note", ""), "ring": ring, **cfg["end"]}
    elif typ == "race":
        t = json.load(open(f"public/datayt/sources/rbi_handbook/T{int(cfg['table']):03d}.json"))
        yr = lambda c: c.split("|")[-1].strip()
        years = [yr(c) for c in t["columns"]]
        use = [c for c in t["columns"][years.index(cfg["from"]):years.index(cfg["to"]) + 1] if yr(c) not in cfg.get("skip", [])]
        a, b = cfg["a"], cfg["b"]; cut = [yr(c) for c in use].index(cfg["cut"])
        va, vb = [t["states"][a][c] for c in use], [t["states"][b][c] for c in use]
        assert all(v is not None for v in va + vb), f"{sid}: a year is missing for {a} or {b}"
        sc = cfg.get("scale", 1)      # the table's unit to the unit shown (thousand tonnes to lakh tonnes is 0.01)
        va, vb = [v * sc for v in va], [v * sc for v in vb]
        for i, c in enumerate(use):      # the story says who was largest each year: check it against every state
            col = {s_: r[c] for s_, r in t["states"].items() if s_ != "India" and r.get(c) is not None}
            first = max(col, key=col.get); want = b if i <= cut else a
            assert first == want, f"{sid}: in {yr(c)} the largest is {first}, not {want}"
        clean = lambda y: y.replace(" (P)", "")
        ylab = [clean(yr(c)) for c in use]
        extra["race"] = {"years": ylab, "cut": cut, "note": cfg["run"].get("note", ""),
                         "a": {"name": nm(a), "v": va, "sub": f"{va[-1] / va[cut]:.1f}× since {ylab[cut]}"},
                         "b": {"name": nm(b), "v": vb, "sub": f"{vb[-1] / vb[cut]:.1f}× since {ylab[cut]}"},
                         "marks": [{"i": ylab.index(m_["year"]), "text": m_["text"]} for m_ in cfg["run"].get("marks", [])]}
        last = {s_: r[use[-1]] * sc for s_, r in t["states"].items() if s_ != "India" and r.get(use[-1]) is not None}
        india = t["states"]["India"][use[-1]] * sc
        nxt = sorted((s_ for s_ in last if s_ != a), key=lambda s_: -last[s_])[:cfg["stack"]["n"]]
        tot = sum(last[s_] for s_ in nxt)
        assert last[a] > tot, f"{sid}: {a} ({last[a]}) is not above the next {len(nxt)} together ({tot:.2f})"
        gap, rel = 100 * (last[a] - last[nxt[0]]) / india, last[a] / last[nxt[0]] - 1      # a lead under 1 point of the all-India total, or under 3%, is level
        assert gap >= 1 and rel >= 0.03, f"{sid}: {a} is ahead of {nxt[0]} by {gap:.2f} points of the all-India total ({100 * rel:.1f}%): level, not a lead"
        led = len(use) - 1 - cut
        if len(nxt) == 1:      # with no stack behind it, the lead itself has to be three years old
            assert led >= 3, f"{sid}: {a} has led for {led} years since {cfg['cut']}; a handover told without a stack needs three"
        ctx = {"a_x": f"{va[-1] / va[cut]:.1f}", "b_pct": f"{100 * (vb[-1] / vb[cut] - 1):.0f}", "a_now": f"{va[-1]:.1f}", "b_now": f"{vb[-1]:.1f}", "india": f"{india:.1f}",
               "share": f"{100 * va[-1] / india:.0f}", "ratio": f"{va[-1] / vb[-1]:.1f}", "a_cut": f"{va[cut]:.1f}", "b_cut": f"{vb[cut]:.1f}", "b_x": f"{vb[-1] / vb[cut]:.1f}",
               "gap": f"{gap:.1f}", "next": nm(nxt[0]), "next_now": f"{last[nxt[0]]:.1f}", "led": led}
        extra["stack"] = {"a": {"name": nm(a), "v": last[a], "label": f"{last[a]:.1f}"}, "parts": [{"name": nm(s_), "v": last[s_], "label": f"{last[s_]:.1f}"} for s_ in nxt],
                          "sum": f"{tot:.1f}", "sumName": cfg["stack"].get("name") or nm(nxt[0]), "note": cfg["stack"].get("note", "").format(**ctx)}
        if "spots" in cfg:      # open on the map with both states lit and their figures at the cut year
            beats[0].update({"kind": "spot", "spots": [{"geo": geo(x["state"]), "also": [geo(y_) for y_ in x.get("also", [])], "name": x["name"], "big": x["big"].format(**ctx),
                                                         "note": x.get("note", ""), "tone": x["tone"], "at": x["at"]} for x in cfg["spots"]]})
        else:
            beats[0].update({"kind": "race", "mode": "lead"})
        beats.append({"kind": "race", "mode": "run", "kicker": cfg["run"]["kicker"], "vo": cfg["run"]["vo"]})
        beats.append({"kind": "stack", "lines": [l.format(**ctx) for l in cfg["stack"]["lines"]], "vo": cfg["stack"]["vo"]})
        for c in cfg.get("says", []):
            beats.append({"kind": "say", "lines": [l.format(**ctx) for l in c["lines"]], "note": c.get("note", ""), "vo": c["vo"]})
        m = cfg["map"]; cuts = m["bands"]
        asc = sorted(last, key=lambda s_: (last[s_], s_))
        extra["map"] = [{"name": geo(s_), "label": "<0.1" if last[s_] < 0.05 else f"{last[s_]:.1f}", "bucket": sum(last[s_] >= c for c in cuts), "nudge": NUDGE.get(geo(s_), (0, 0))} for s_ in asc]
        missing = {x["name"] for x in extra["map"]} - set(GEO)
        assert not missing, f"{sid}: states not on the map: {missing}"
        ring = [geo(x) for x in m.get("ring", [])]
        beats.append({"kind": "map", "title": m["title"], "sub": m.get("sub", "").format(**ctx), "note": m.get("note", ""), "anim": True, "ring": ring, "vo": m["vo"]})
        extra["checked"] = [f"{b} is the largest in every year from {cfg['from']} to {cfg['cut']}, {a} in every year after, among all states in the table",
                            f"{a} {last[a]:.2f} is above the next {len(nxt)} together ({', '.join(nxt)}: {tot:.2f})",
                            f"{a} is ahead of {nxt[0]} by {gap:.2f} points of the all-India total ({100 * rel:.1f}%), and has been largest for {led} years",
                            f"{a} grew {va[-1] / va[cut]:.2f} times and {b} {vb[-1] / vb[cut]:.2f} times from {cfg['cut']} to {clean(cfg['to'])}"] + run_checks(sid, cfg, a)
        cfg["end"] = {"kind": "mapend", "note": m.get("note", ""), "ring": ring, **cfg["end"]}
    elif typ == "then":
        st0 = cfg["state"]; share = cfg["measure"] == "share"; sc = cfg.get("scale", 1); unit = cfg.get("unit", "%" if share else "")
        clean = lambda y: y.replace(" (P)", "").replace(" (p)", "")
        def measured(vals, india, what):      # one column as the measure: each state's share of the all-India row, or the figure itself
            if not share:
                return {s_: v * sc for s_, v in vals.items()}, (india * sc if india is not None else None)
            assert india, f"{sid}: no all-India figure for {what}"
            cover = sum(vals.values()) / india
            assert abs(cover - 1) < 0.05, f"{sid}: in {what} the state rows add up to {100 * cover:.0f}% of the all-India row"
            return {s_: 100 * v / india for s_, v in vals.items()}, 100.0
        if "table" in cfg:      # a table with a column a year: the years around both dates are tested below
            t = json.load(open(f"public/datayt/sources/rbi_handbook/T{int(cfg['table']):03d}.json"))
            years = [c.split("|")[-1].strip() for c in t["columns"]]
            assert len(set(years)) == len(years), f"{sid}: the table has more than one column a year; use 'points' with two data specs"
            col = lambda i: ({s_: r[t["columns"][i]] for s_, r in t["states"].items() if s_ != "India" and r.get(t["columns"][i]) is not None}, t["states"].get("India", {}).get(t["columns"][i]))
            at = lambda i: find(measured(*col(i), years[i])[0], st0)
            i0, i1 = years.index(cfg["from"]), years.index(cfg["to"]); p0, p1 = cfg["from"], cfg["to"]
            (M0, I0), (M1, I1) = measured(*col(i0), p0), measured(*col(i1), p1)
        else:      # two survey rounds or two separate tables: nothing lies between them to test
            a_, b_ = cfg["points"]; p0, p1 = a_["period"], b_["period"]
            (M0, I0), (M1, I1) = measured(*series(a_["data"]), p0), measured(*series(b_["data"]), p1)
        then, now = find(M0, st0), find(M1, st0); ch = now - then
        assert then > 0, f"{sid}: {st0} has nothing above zero in {p0}: a start from nothing is a change in reporting, not a rise"
        times = now / then
        if share:
            assert abs(ch) >= cfg.get("min_change", 1.0), f"{sid}: the change is {ch:+.2f} points of the all-India total: level, not a change"
        else:
            assert abs(times - 1) >= cfg.get("min_change", 0.1), f"{sid}: the change is {100 * (times - 1):+.1f}%: level, not a change"
        checked = [f"{st0}: {then:.2f} in {p0}, {now:.2f} in {p1}: {ch:+.2f}, {times:.2f} times"]
        if "table" in cfg:
            before = []
            for i in (i0 - 2, i0 - 1):      # the two years before the start, where the table has them
                try:
                    before.append(at(i) if i >= 0 else None)
                except (AssertionError, SystemExit):
                    before.append(None)
            base = (max if ch > 0 else min)([then] + [v for v in before if v is not None])      # the start must not be a dip (or a spike) against the years just before it
            assert (now - base) * ch > 0 and abs(now - base) >= 0.6 * abs(ch), \
                f"{sid}: {p0} is an unusual year for {st0} ({then:.2f}, against {base:.2f} just before): most of the change comes from the starting year"
            late = [at(i) for i in range(i1 - 2, i1 + 1)]
            for i, v in zip(range(i1 - 2, i1 + 1), late):      # the change must be there in each of the last three years
                assert (v - then) * ch > 0 and abs(v - then) >= abs(ch) / 3, f"{sid}: the change does not hold in {years[i]} ({v:.2f} against {then:.2f} in {p0})"
            assert abs(ch) >= 0.6 * max(abs(v - then) for v in late), f"{sid}: {st0} has fallen back from a recent peak ({', '.join(f'{v:.2f}' for v in late)}): not a change that holds"
            checked += [f"the years just before {p0} do not make it a freak year: measured from {base:.2f} the change is still {now - base:+.2f}",
                        f"the change holds in each of {', '.join(years[i1 - 2:i1 + 1])}: " + ", ".join(f"{v:.2f}" for v in late)]
        y0, y1 = (int(re.search(r"\d{4}", x).group()) for x in (p0, p1))
        if SPLITS.get(st0) and y0 < SPLITS[st0]:
            assert cfg.get("boundary_note"), f"{sid}: {st0} was split in {SPLITS[st0]}, so its {p0} figure covers a different area: start later, or say so on screen in 'boundary_note'"
        m = cfg["map"]
        if "(P)" in p1.upper():
            assert "provisional" in (m.get("note", "") + cfg["source"]).lower(), f"{sid}: {p1} is provisional: say so on screen"
        rank = lambda M, v: 1 + sum(x > v for s_, x in M.items() if s_ in M0 and s_ in M1)
        lab = lambda v: f"{v:.1f}%" if share else show(v, unit)
        kind = cfg.get("delta", "points" if share else "times")
        delta = {"points": f"{signed(ch)} points", "times": f"{times:.1f}×", "percent": f"{signed(100 * (times - 1), 0)}%"}[kind]
        ctx = {"then": lab(then), "now": lab(now), "change": signed(ch), "times": f"{times:.1f}", "years": y1 - y0, "from": clean(p0), "to": clean(p1),
               "rank_then": rank(M0, then), "rank_now": rank(M1, now), "n": len(set(M0) & set(M1)),
               "india_then": lab(I0) if I0 is not None and not share else "", "india_now": lab(I1) if I1 is not None and not share else ""}
        for k, want in cfg.get("expect", {}).items():      # figures the script states in words (a rank, a span of years)
            assert str(ctx[k]) == str(want), f"{sid}: the script expects {k} = {want}; the table gives {ctx[k]}"
            checked.append(f"{k} = {ctx[k]}")
        cfg["chip"] = cfg["chip"].format(**ctx)
        beats[0].update({"kind": "spot", "geo": geo(st0), "name": nm(st0), "lines": [l.format(**ctx) for l in cfg["hook"]]})
        pair = {"geo": geo(st0), "name": nm(st0), "kicker": cfg["kicker"], "big": delta, "p0": {"period": clean(p0), "label": lab(then), "frac": then / max(then, now)},
                "p1": {"period": clean(p1), "label": lab(now), "frac": now / max(then, now)}}
        beats.append({**pair, "kind": "shift", "mode": "then", "text": cfg["then"].get("text", "").format(**ctx), "vo": cfg["then"]["vo"]})
        beats.append({**pair, "kind": "shift", "mode": "now", "text": cfg["now"].get("text", "").format(**ctx), "vo": cfg["now"]["vo"]})
        beats += fact_beats(cfg, st0)
        assert cfg.get("says"), f"{sid}: a then-and-now script needs one card of our own reading of the change, under 'says'"
        for c in cfg["says"]:
            beats.append({"kind": "say", "lines": [l.format(**ctx) for l in c["lines"]], "note": c.get("note", "").format(**ctx), "vo": c["vo"]})
        as_ = m.get("as", "points" if share else "percent")      # every state's change: in points, or in percent of where it started
        apart = {s_ for s_, y_ in SPLITS.items() if y0 < y_ <= y1}      # split between the two dates: the two figures cover different areas, so no change is shown
        chg = {s_: (M1[s_] - M0[s_] if as_ == "points" else 100 * (M1[s_] / M0[s_] - 1)) for s_ in M1 if M0.get(s_, 0) > 0 and s_ not in apart}
        for s_ in sorted(apart & set(M0) & set(M1)):
            assert s_ in m.get("note", ""), f"{sid}: {s_} is left off the map (its boundary changed in {SPLITS[s_]}): say so in the map note"
        cuts = m["bands"]
        assert len(cuts) == 4 and cuts == sorted(cuts), f"{sid}: the map needs four rising cuts"
        if min(chg.values()) >= 0 or max(chg.values()) <= 0:      # every state moved the same way: one ramp, light to dark
            bands = pal["bands"]
        else:      # falls in one colour, rises in the other, level in between
            assert cuts[1] < 0 < cuts[2], f"{sid}: some states rose and some fell, so the map needs its cuts around zero (fell a lot, fell, level, rose, rose a lot)"
            assert len(m.get("key", [])) == 3, f"{sid}: a map of rises and falls needs a three-word key in the map block: fell, level, rose"
            bands = [pal["accent2"], tint(pal["accent2"], 0.5), "#DDD5C8", tint(pal["accent"], 0.45), pal["accent"]]
        asc = sorted(chg, key=lambda s_: (chg[s_], s_))
        extra["map"] = [{"name": geo(s_), "label": signed(chg[s_], 1 if as_ == "points" else 0), "bucket": sum(chg[s_] >= c for c in cuts),
                         "dark": is_dark(bands[sum(chg[s_] >= c for c in cuts)]), "nudge": NUDGE.get(geo(s_), (0, 0))} for s_ in asc]
        missing = {x["name"] for x in extra["map"]} - set(GEO)
        assert not missing, f"{sid}: states not on the map: {missing}"
        ring = [geo(x) for x in [st0] + m.get("ring", [])]
        legend = [{"color": bands[i], "label": l} for i, l in zip((0, 2, 4), m["key"]) if l] if m.get("key") else None      # what the colours mean: low end, middle, high end
        beats.append({"kind": "map", "title": m["title"], "sub": m.get("sub", "").format(**ctx), "note": m.get("note", ""), "anim": True, "ring": ring, "vo": m["vo"],
                      **({"legend": legend} if legend else {})})
        extra["bands_override"] = bands
        extra["checked"] = checked + run_checks(sid, cfg, st0)
        cfg["end"] = {"kind": "mapend", "note": m.get("note", ""), "ring": ring, **({"legend": legend} if legend else {}), **cfg["end"]}
    elif typ == "over":
        stage, india = series(cfg["stage"]); res, ires = series(cfg["whole"]); ext, iext = series(cfg["drawn"]); rech, _ = series(cfg["recharge"])
        over = sorted((s_ for s_ in stage if stage[s_] > 100), key=lambda s_: -stage[s_])
        assert over == cfg["over"], f"{sid}: the states above 100 are {over}, not {cfg['over']}"
        for s_ in over:      # "more is taken out in a year than goes back in" must hold for each named state, against total recharge
            assert ext[s_] > rech[s_], f"{sid}: {s_}: extraction {ext[s_]} is not above recharge {rech[s_]}"
            assert abs(100 * ext[s_] / res[s_] - stage[s_]) < 0.5, f"{sid}: {s_}: the ratio of the two columns is not {stage[s_]}"
        assert not [s_ for s_ in stage if s_ not in over and ext[s_] > rech[s_]], f"{sid}: another state also takes out more than its recharge"
        gr, gx = sum(res[s_] for s_ in over), sum(ext[s_] for s_ in over)
        v0, rs, es = 100 * gx / gr, 100 * gr / ires, 100 * gx / iext
        for key, got in (("whole_share", rs), ("drawn_share", es), ("group", v0)):
            lo, hi = cfg["ranges"][key]
            assert lo <= got <= hi, f"{sid}: {key} is {got:.2f}, outside {lo} to {hi}"
        nxt = max((stage[s_], s_) for s_ in stage if s_ not in over)
        ctx = {"v": f"{v0:.0f}", "extra": f"{v0 - 100:.0f}", "res": f"{rs:.0f}", "ext": f"{es:.0f}", "india": f"{india:.0f}", "n": len(over), "gx": f"{gx:.2f}", "gr": f"{gr:.2f}",
               "next": nm(nxt[1]), "next_v": f"{nxt[0]:.0f}"}
        bands = pal["bands"][:4] + [pal["accent2"]]      # one ramp for everyone under 100, one accent for those above it
        extra["bands_override"] = bands
        extra["grid"] = {"parts": [{"name": cfg["grid"]["whole"], "v": 100, "label": "100", "color": pal["bands"][2]},
                                  {"name": cfg["grid"]["extra"], "v": round(v0 - 100, 2), "label": f"+{v0 - 100:.0f}", "color": pal["accent2"]}],
                         "caption": cfg["grid"]["caption"].format(**ctx)}
        beats[0].update({"kind": "spot", "spots": [{"geo": geo(s_), "name": nm(s_), "tone": "b"} for s_ in over]})
        beats.append({"kind": "grid", "mode": "over", "lines": [l.format(**ctx) for l in cfg["grid"]["lines"]], "vo": cfg["grid"]["vo"]})
        b_ = cfg["bars"]
        extra["line100"] = {"rows": [{"name": nm(s_), "v": find(stage, s_), "label": f"{find(stage, s_):.0f}"} for s_ in b_["states"]] +
                                    [{"name": "India", "v": india, "label": f"{india:.0f}", "india": True}],
                            "max": b_.get("max", 170), "note": b_.get("note", "").format(**ctx), "line": b_.get("line", "100")}
        beats.append({"kind": "line100", "lines": b_["lines"], "vo": b_["vo"]})
        for c in cfg.get("says", []):
            beats.append({"kind": "say", "lines": [l.format(**ctx) for l in c["lines"]], "note": c.get("note", "").format(**ctx), "vo": c["vo"]})
        m = cfg["map"]; cuts = m["bands"]
        asc = sorted(stage, key=lambda s_: (stage[s_], s_))
        extra["map"] = [{"name": geo(s_), "label": "<1" if stage[s_] < 0.5 else f"{stage[s_]:.0f}", "bucket": sum(stage[s_] >= c for c in cuts), "nudge": NUDGE.get(geo(s_), (0, 0))} for s_ in asc]
        missing = {x["name"] for x in extra["map"]} - set(GEO)
        assert not missing, f"{sid}: states not on the map: {missing}"
        ring = [geo(x) for x in over]
        beats.append({"kind": "map", "title": m["title"], "sub": m.get("sub", "").format(**ctx), "note": m.get("note", ""), "anim": True, "ring": ring, "vo": m["vo"]})
        extra["checked"] = [f"above 100: {', '.join(f'{s_} {stage[s_]}' for s_ in over)}; next highest {nxt[1]} {nxt[0]}; all-India {india}",
                            "in each of them the year's extraction is above the year's total recharge: " + ", ".join(f"{s_} {ext[s_]} against {rech[s_]}" for s_ in over) + "; in no other state",
                            f"together: {gx:.2f} taken out against {gr:.2f} extractable = {v0:.2f} per 100",
                            f"together they have {rs:.2f}% of the all-India extractable resource and {es:.2f}% of the all-India extraction",
                            f"{len(stage)} states and UTs in the table"] + run_checks(sid, cfg, over[0])
        cfg["end"] = {"kind": "mapend", "note": m.get("note", ""), "ring": ring, **cfg["end"]}
    elif typ == "place":
        import datetime as _dt
        st0 = cfg["state"]
        assert geo(st0) in GEO, f"{sid}: {st0} is not on the map"
        beats[0].update({"kind": "spot", "geo": geo(st0), "name": nm(st0), "note": cfg.get("map_note", "")})
        day = lambda x: _dt.date(*[int(p_) for p_ in (x.split("-") + ["1", "1"])[:3]])
        checked = []
        for k in cfg.get("spans", []):      # every "N years" in the script is recomputed from its two dates
            yrs = (day(k["to"]) - day(k["from"])).days / 365.2425
            got = int(yrs) if "full_years" in k else round(yrs)
            want = k.get("full_years", k.get("about_years"))
            assert got == want, f"{sid}: '{k['says']}' fails: {k['from']} to {k['to']} is {yrs:.2f} years"
            checked.append(f"{k['says']}: {k['from']} to {k['to']} = {yrs:.2f} years")
        ctx = {}
        if "poll" in cfg:      # a vote: the parts must add up to the votes cast; shares are of valid votes
            q_ = cfg["poll"]; valid = q_["a"] + q_["b"]
            assert valid + q_["invalid"] == q_["voted"], f"{sid}: the poll counts do not add up to the votes cast"
            grp = lambda n_: inr(n_)[1:]
            ctx = {"a_pct": f"{100 * q_['a'] / valid:.1f}", "b_pct": f"{100 * q_['b'] / valid:.1f}", "turnout": f"{100 * q_['voted'] / q_['electors']:.1f}",
                   "a_n": grp(q_["a"]), "b_n": grp(q_["b"]), "electors": grp(q_["electors"])}
            checked.append(f"poll: {q_['a']} + {q_['b']} + {q_['invalid']} invalid = {q_['voted']} votes cast; {ctx['a_pct']}% and {ctx['b_pct']}% of valid votes; turnout {ctx['turnout']}%")
        ticks = list(cfg.get("timeline_lead", [])) + [e["tick"] for e in cfg["events"] if e.get("tick")]      # the lead ticks come before the first event (the hook's year)
        extra["timeline"] = [{"label": t_} for t_ in ticks]
        for e in cfg["events"]:
            beats.append({"kind": "event", "kicker": e["date"], "big": e["year"], "lines": e["head"], "text": e.get("cite", "").format(**ctx), "sub": e.get("stat_label", "").format(**ctx),
                          "label": e.get("stat", "").format(**ctx), "n": ticks.index(e["tick"]) if e.get("tick") else -1, "geo": geo(st0), "vo": e["vo"]})
        extra["checked"] = checked
    elif typ == "pick":
        beats.clear()      # no intro: the first frame is round one's question
        checked, tally = [], []
        for i, r in enumerate(cfg["rounds"]):
            vals, india = series(r["data"]); a, b = r["pair"]; va, vb = find(vals, a), find(vals, b); sc = r.get("scale", 1)
            assert india, f"{sid} round {i + 1}: the table has no all-India row"
            gap, ratio = 100 * abs(va - vb) / india, max(va, vb) / min(va, vb)
            assert gap >= r.get("min_gap", 1.5), f"{sid} round {i + 1}: the gap is only {gap:.2f} points of the all-India figure; too thin for a round"
            lo, hi = r["says"]
            assert lo <= ratio <= hi, f"{sid} round {i + 1}: the spoken comparison needs a ratio of {lo} to {hi}; it is {ratio:.2f}"
            win = "a" if va > vb else "b"
            lab = lambda v: f"{v * sc:,.1f}"
            side = lambda s_, v: {"name": nm(s_), "geo": geo(s_), "label": lab(v)}
            assert geo(a) in GEO and geo(b) in GEO, f"{sid} round {i + 1}: a state is not on the map"
            base = {"n": i + 1, "of": len(cfg["rounds"]), "lines": r["q"], "measure": r["measure"], "pa": side(a, va), "pb": side(b, vb), "win": win,
                    "big": f"+{100 * (ratio - 1):.0f}%"}
            beats.append({**base, "kind": "pick", "mode": "ask", "pause": r.get("think", cfg.get("think", 0.8)), "vo": r["ask"]})
            beats.append({**base, "kind": "pick", "mode": "tell", "vo": r["tell"]})
            w, l_ = (a, b) if win == "a" else (b, a)
            tally.append({"q": r["measure"], "win": nm(w), "wl": lab(max(va, vb)), "lose": nm(l_), "ll": lab(min(va, vb))})
            checked.append(f"round {i + 1}: {w} {max(va, vb):g} against {l_} {min(va, vb):g}: {ratio:.2f} times, a gap of {gap:.2f} points of the all-India figure")
        extra["tally"] = tally; extra["checked"] = checked
        cfg["end"] = {"kind": "tally", **cfg["end"]}
    else:
        raise SystemExit(f"{sid}: unknown type {typ}")
    e = cfg["end"]
    beats.append({**{k: v for k, v in e.items() if k not in ("kind", "vo")}, "kind": e.get("kind", "end"), "vo": e.get("vo") or f"{e['q']} {e['sub']}".replace("*", "")})
    for bt in beats:
        g = bt.get("geo")
        assert g is None or g in GEO, f"{sid}: {g} is not on the map"
    broken = house_rules(sid, cfg, beats, extra)      # before anything is voiced
    if cfg.get("rules", 1) >= 2:
        assert not broken, f"{sid}: breaks the house rules: " + "; ".join(broken)
    for x in broken:
        print(f"{sid}: approved before the rules, would break: {x}")

    t, vo = 0.0, []
    for i, bt in enumerate(beats):
        need = 0
        if bt.get("vo"):
            fn, dur = V.say(bt["vo"], f"{d}/vo_{i:02d}")
            vo.append({"file": fn, "sec": dur, "at": round(t + VO_LEAD, 3), "text": bt["vo"]})
            need = dur + VO_LEAD + 0.3 + bt.get("pause", 0)      # a "pause" is thinking time after the voice stops
        nb = max(MIN_BARS[bt["kind"]], math.ceil(need / M.BAR))
        bt["t0"], bt["t1"] = round(t, 3), round(t + nb * M.BAR, 3); t += nb * M.BAR
    total = round(t + 0.4, 3)
    if not 30 <= total <= 45:      # the research's band for a Short; an estimate (--check, --mute) only warns
        msg = f"{sid}: {total:.1f} s is outside 30 to 45 seconds"
        assert ESTIMATE or cfg.get("rules", 1) < 2, msg
        print(msg + (" (estimated)" if ESTIMATE else ""))
    for bt in beats:      # an animated map fills state by state, lowest value first, then holds
        if bt["kind"] == "map" and bt.get("anim"):
            step = min(M.BEAT / 4, (bt["t1"] - bt["t0"] - 2.0) / len(extra["map"]))
            for k, s_ in enumerate(extra["map"]):
                s_["at"] = round(bt["t0"] + 0.35 + k * step, 3)
    out = {"id": sid, "type": typ, "chip": cfg["chip"], "sourceShort": cfg["source_short"], "source": cfg["source"], "accent": pal["accent"], "accent2": pal["accent2"],
           "bands": extra.pop("bands_override", pal["bands"]), "beats": beats, "total": total, "fps": FPS, "beat": M.BEAT, **extra, "vo": [] if MUTE else vo,
           "voiceEngine": "none" if MUTE else V.ENGINE, "voice": "" if MUTE else V.VOICE,
           "ytTitle": cfg.get("yt_title", "")}
    json.dump(out, open(f"{d}/data.json", "w"), indent=1, ensure_ascii=False)
    hits = [bt["t0"] for bt in beats if bt["kind"] in ("reveal", "score", "map") or (bt["kind"] == "rank" and bt["rank"] == 1) or (bt["kind"] == "pick" and bt["mode"] == "tell")]
    drop_at = hits[0] if hits else beats[-1]["t0"]
    M.make(f"{d}/music.wav", total, seed=sum(map(ord, sid)) % 50, hits=hits, ticks=[bt["t0"] for bt in beats], drop=(drop_at - M.BEAT * 2, drop_at))
    print(f"{sid}: {typ} · {len(beats)} beats · {total:.1f}s · voice {'none (text-led cut)' if MUTE else V.ENGINE}")


def write_registry():
    ids = sorted(os.path.basename(os.path.dirname(p)) for p in glob.glob("public/datayt/beats/*/data.json"))
    lines = ["// Generated by scripts/datayt/build_beats.py: every built beat Short, for the Remotion registry."]
    lines += [f'import {i} from "../../public/datayt/beats/{i}/data.json";' for i in ids]
    lines += ['import type {BeatData} from "./BeatStory";', "", f"export const BEATS = [{', '.join(ids)}] as unknown as BeatData[];", ""]
    open("src/datayt/beatData.ts", "w").write("\n".join(lines))


ESTIMATE = False      # line lengths are estimated, not voiced


if __name__ == "__main__":
    check, MUTE = "--check" in sys.argv, "--mute" in sys.argv
    ESTIMATE = check or MUTE
    want = set(a for a in sys.argv[1:] if not a.startswith("--"))
    files = sorted(glob.glob("public/datayt/beats/configs/*.json"))
    if ESTIMATE:      # nothing is sent to the voice service
        V.say = lambda text, stem, voice=None: ("check.mp3", spoken(text))
    if check:      # no music either: every data check and every house rule runs, and the result goes under out/
        BASE = "out/datakadai/bank_check"
        M.make = lambda *a, **k: None
        files += sorted(glob.glob("public/datayt/bank/scripts/*.json"))
    ok, bad = 0, []
    for f in files:
        cfg = json.load(open(f))
        cfg.setdefault("rules", 2 if "/bank/scripts/" in f else 1)      # the script bank is written under the house rules
        if not want or cfg["id"] in want:
            if not check:
                build(cfg); continue
            try:
                build(cfg); ok += 1
            except (AssertionError, SystemExit, KeyError, ValueError, TypeError, ZeroDivisionError, StopIteration) as e:
                bad.append(cfg["id"]); print(f"{cfg['id']}: FAILED: {type(e).__name__}: {e}")
    if check:
        print(f"check: {ok} passed, {len(bad)} failed" + (": " + ", ".join(bad) if bad else ""))
    else:
        write_registry()

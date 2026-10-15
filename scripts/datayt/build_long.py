#!/usr/bin/env python3
"""Data Kadai long-form videos: 16:9 (1920x1080), five to eight minutes, one theme, chapters on YouTube.
The Shorts builder (build_beats.py) makes 40-second vertical cuts; this one lays a script of scenes on a timeline and hands it to
src/datayt/LongStory.tsx.

One video = one config, public/datayt/long/configs/<id>.json. Run from the repo root:
    python3 scripts/datayt/build_long.py --check <id> [...]
--check: every figure is resolved and every test runs, line lengths are ESTIMATED (build_beats.spoken), nothing is voiced, no music is
written, nothing is sent to any service. The build without --check voices every line (voice_dk.say) and makes the bed (music_shorts.make);
those two calls live in voice() and music() below and nowhere else.
Writes public/datayt/long/<id>/data.json and chapters.txt, and src/datayt/longData.ts (the registry of built videos).

THE CONFIG
  id, title, chip (top right), source_short (default source line), source (full), palette (build_india_shorts.PALETTES key)
  tables   {"states": "mospi/cpi2024_states_2026_09", ...}: short names for tables under public/datayt/sources/; "@states" is replaced everywhere
  specs    {"name": spec}: a data spec written once, used as {"$": "name"} anywhere
  vals     every figure the screen or the narrator says: {"name": {"v": <value spec>, "dec": 2, "unit": "%", "equals": 5.54}}.
           Text uses {name} (as shown, with its unit), {name:n} (number only); a voice line says the number in words. "sign": show +/-,
           "abs": drop the minus (the text says "fell"), "plain": no thousands comma (a year), "prefix": "₹" before the number (said "rupees").
           A val with no test fails the build.
  chapters [{"id", "title", "label"?}]   the chapter of the first scene is the YouTube chapter; label "" hides the name on screen
  scenes   [{"kind", "chapter": id, "vo": [lines], "source"?, "min"? (seconds), "hold"? (seconds when there is no voice), ...}]
  tests    claims the script makes, run before anything else is written (see run_tests)
  sources  the end card's list: [{"table": "@states", "text": "..."}]
  thumb    {"lines": [1-3 lines of at most 14 characters], "sub"?}: the thumbnail's words (src/datayt/LongPosts.tsx draws it)

VALUE SPECS (a number from the data; every reader below sits on top of build_beats.series)
  {"data": {"tbl": [path, column]}, "state": "Puducherry"}              a state table in the Handbook's shape ("state": "India" for the national row)
  {"data": {"months": [path, column, [first, last]]}, "at": "Sep-26"}   the monthly table; the spec alone is the series (first to last, no gaps)
  {"data": {"breakdown": [path, "divisions"|"groups"|"items"|"facts", key, field]}}   a named row of the breakdown table; in "facts" a text
        row is read with field "#N": the N-th number in the sentence (0 is the first)
  {"ratio": [a, b]}  {"diff": [a, b]}  {"sum": [a, b, ...]}  {"agg": "max"|"min"|"mean", "of": <series spec>}  {"val": "name"}
  {"count_above": <state series spec>, "than": <value spec or number>}  {"count_below": ..., "than": ...}  {"n_states": <state series spec>}
Division 02 (paan, tobacco and intoxicants) is never shown: the reader refuses it and so does the text check.

SCENE KINDS and their keys (text may use *accent*, {name}; every text is checked against src/datayt/longBoxes.json, the same file the template reads)
  cold     lines [2-3], map {"lit": state, "label": "{name}"}?
  card     sub?                       chapter number and title come from the chapter list
  line     title?, series [{"name", "data": {"months": ...}, "dec", "unit", "equals": last point}] (1-3), marks [{"at": month, "var": name, "series"?}],
           caption?, ymin?
  bars     title?, rows [{"label", "v": spec, "equals", "w": spec?, "w_equals"?, "hi"?}] (3-12), dec, unit, wdec, sign, sort ("desc"|"asc"), expect_top?, expect_bottom?,
           weight_head? (names the column when rows carry a weight: the bar is thicker for a larger weight), caption?
  map      data: <state series spec>, title, sub?, dec, unit, top (5), bottom (3), key ["lowest", "highest"], note?, ring_top (true)
  quote    text, by, date, verify [path, section, key]: the text must be a sentence of that saved source, word for word
  compare  title?, a {"label", "var", "sub"?}, b {...}, caption?
  tiles    title?, tiles [{"var", "caption", "hi"?}] (3-4), note?
  end      q, next, sources are the config's list
"""
import copy, glob, json, math, os, re, sys
from decimal import Decimal, ROUND_HALF_UP
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_beats as B      # the Shorts builder: its data reader (series, value), the state names, the narrator estimate, the banned words
from build_india_shorts import PALETTES

M, V = B.M, B.V      # music_shorts and voice_dk, exactly as build_beats holds them
FPS = 30
SRC, BASE, BOXES = "public/datayt/sources", "public/datayt/long", "src/datayt/longBoxes.json"
LEAD, TAIL, GAP = 0.5, 0.7, 0.3      # seconds before a scene's first line, after its last, and between two lines
MIN_SEC = {"cold": 6, "card": 2.5, "line": 6, "bars": 6, "map": 7, "quote": 6, "compare": 5, "tiles": 6, "end": 8}      # the longest animation of each kind
CHECK = False
UNIT_WORDS = {"%": " percent", "": "", " points": " points", "×": " times"}
ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()
PH = re.compile(r"\{([a-z][a-z0-9_]*)(?::([a-z]+))?\}")
DATE = re.compile(r"\b\d{1,2}(?:st|nd|rd|th)? (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b")
YEAR = re.compile(r"\b(?:19|20)\d\d\b")
NUM = re.compile(r"\d[\d,]*(?:\.\d+)?")
NEVER = re.compile(r"tobacco|intoxicant|\bpaan\b", re.I)      # division 02 stays off the screen (channel rule)
TABLES = {}
CTX = None      # the build in progress: {"val": name} in a spec reads its figures


# ---------------------------------------------------------------- the data readers
def table(path):
    path = path[:-5] if path.endswith(".json") else path
    if path not in TABLES:
        TABLES[path] = json.load(open(f"{SRC}/{path}.json"))
    return TABLES[path]


def months(spec):
    """{"months": [path, column, [first, last]]} -> [(month, value)] from first to last in table order. A gap is an error."""
    path, col, (first, last) = spec["months"]
    t = table(path)["months"]; keys = list(t)
    assert first in t and last in t, f"{path}: months {first} or {last} are not in the table ({keys[0]} to {keys[-1]})"
    ks = keys[keys.index(first): keys.index(last) + 1]
    assert col in t[ks[0]], f"{path}: no column '{col}' (has {', '.join(t[ks[0]])})"
    out = [(k, t[k][col]) for k in ks]
    assert all(v is not None for _, v in out), f"{path}: '{col}' has no figure for {', '.join(k for k, v in out if v is None)}"
    return out


def breakdown(spec):
    """{"breakdown": [path, section, key, field]} -> one number from a named row."""
    path, section, key, field = spec["breakdown"]
    t = table(path)
    assert section in ("divisions", "groups", "items", "facts") and section in t, f"{path}: no section '{section}'"
    if (section in ("divisions", "groups") or (section == "items" and re.match(r"\d\d(\.|$)", key))) and key.split(".")[0] == "02":
        raise SystemExit(f"{path}: division 02 (paan, tobacco and intoxicants) is never shown")
    assert key in t[section], f"{path}: no {section} row '{key}' (has {', '.join(t[section])})"
    row = t[section][key]
    if isinstance(row, dict):
        assert field in row, f"{path}: {section} '{key}' has no field '{field}' (has {', '.join(row)})"
        return row[field]
    if isinstance(row, list):
        return row[int(field)]
    nums = NUM.findall(row); i = int(str(field).lstrip("#"))      # a sentence: the i-th number in it
    assert i < len(nums), f"{path}: '{key}' has only {len(nums)} numbers"
    return float(nums[i].replace(",", ""))


def scalar(q):
    """One number from a value spec (see the module docstring). Anything build_beats.value can read is read by build_beats.value."""
    if isinstance(q, (int, float)):
        return float(q)
    if "val" in q:
        return CTX.vals[q["val"]].v
    if "ratio" in q:
        return scalar(q["ratio"][0]) / scalar(q["ratio"][1]) * q.get("scale", 1)
    if "diff" in q:
        return (scalar(q["diff"][0]) - scalar(q["diff"][1])) * q.get("scale", 1)
    if "sum" in q:
        return sum(scalar(x) for x in q["sum"]) * q.get("scale", 1)
    if "agg" in q:
        s = q["of"]; vals = [v for _, v in months(s)] if "months" in s else list(B.series(s)[0].values())
        return {"max": max, "min": min, "mean": lambda x: sum(x) / len(x)}[q["agg"]](vals)
    if "count_above" in q or "count_below" in q:
        vals, _ = B.series(q.get("count_above") or q["count_below"]); thr = scalar(q["than"])
        return float(sum((v > thr) if "count_above" in q else (v < thr) for v in vals.values()))
    if "n_states" in q:
        return float(len(B.series(q["n_states"])[0]))
    d = q["data"]
    if "months" in d:
        got = dict(months(d)); assert q["at"] in got, f"{d['months'][0]}: {q['at']} is outside {d['months'][2]}"
        return got[q["at"]]
    if "breakdown" in d:
        return breakdown(d)
    return B.value(q, q.get("state", "India"))      # a state table: build_beats reads it


def dec_of(x):
    s = str(x)
    return len(s.split(".")[1]) if "." in s else 0


def check_value(says, v, k):
    """The tests of build_beats ('equals', 'min'/'max') plus a tolerance and 'round'. Returns a line for the report; a failure stops the build."""
    if "equals" in k:
        tol = k.get("tol", 0.5 * 10 ** -dec_of(k["equals"]))      # default: the figure as printed, to its last decimal
        assert abs(v - k["equals"]) <= tol + 1e-9, f"'{says}' fails: {v:g} is not {k['equals']} (tolerance {tol:g})"
    elif "round" in k:
        assert math.floor(v + 0.5) == k["round"], f"'{says}' fails: {v:g} does not round to {k['round']}"      # halves round up, as in build_beats
    elif "min" in k or "max" in k:
        assert k.get("min", -math.inf) <= v <= k.get("max", math.inf), f"'{says}' fails: {v:g} is outside {k.get('min')} to {k.get('max')}"
    else:
        raise SystemExit(f"test '{says}' has none of equals, round, min, max")
    return f"{says}: {v:.4g}"


def canon(names):
    return [B.geo(x) for x in names]


def run_tests(cfg, X):
    """Every claim of the script, recomputed. 'value' + equals/tol/round/min/max; 'top'/'bottom' + 'of': the named states are the highest (in order) or
    the lowest (lowest first) of a state series; 'rising': a monthly series that goes up every month; 'text' + 'contains': a sentence of a saved table."""
    for k in cfg.get("tests", []):
        says = k["says"]
        if "top" in k or "bottom" in k:
            vals, _ = B.series(k["of"]); up = "bottom" in k; want = k["bottom"] if up else k["top"]
            rk = sorted(vals.items(), key=lambda x: (x[1], x[0]) if up else (-x[1], x[0]))
            assert canon([s for s, _ in rk[:len(want)]]) == canon(want), f"'{says}' fails: the {'lowest' if up else 'highest'} are {[s for s, _ in rk[:len(want)]]}"
            assert rk[len(want) - 1][1] != rk[len(want)][1], f"'{says}' fails: a tie at the cut ({rk[len(want) - 1]}, {rk[len(want)]})"
            X.checked.append(f"{says}: {', '.join(f'{s} {v:g}' for s, v in rk[:len(want)])}")
        elif "rising" in k:
            pts = months(k["rising"]); assert all(b[1] > a[1] for a, b in zip(pts, pts[1:])), f"'{says}' fails: {[round(v, 2) for _, v in pts]}"
            X.checked.append(f"{says}: {pts[0][0]} to {pts[-1][0]} {pts[0][1]:g} to {pts[-1][1]:g}")
        elif "text" in k:
            path, section, key = k["text"]; s = table(path)[section][key]
            assert k["contains"] in s, f"'{says}' fails: '{k['contains']}' is not in {path} {section}/{key}"
            X.checked.append(f"{says}: found in {path}")
        else:
            X.checked.append(check_value(says, scalar(k["value"]), k))
        X.n_tests += 1


# ---------------------------------------------------------------- numbers as the screen shows them and as the narrator says them
def rhu(v, dec):
    """v to dec places, halves away from zero, read from the figure as printed (8.25 -> 8.3, 8.35 -> 8.4), as readers and the Shorts round.
    Python's round() and format() round an exact half to even (8.25 -> 8.2)."""
    return float(Decimal(repr(v)).quantize(Decimal(1).scaleb(-dec), rounding=ROUND_HALF_UP))


def fnum(v, dec, sign=False, group=True):
    r = rhu(v, dec); s = f"{abs(r):,.{dec}f}" if group else f"{abs(r):.{dec}f}"
    return ("−" if r < 0 else "+" if sign and r > 0 else "") + s


def words(n):
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ("-" + ONES[n % 10] if n % 10 else "")
    if n < 1000: return ONES[n // 100] + " hundred" + (" and " + words(n % 100) if n % 100 else "")      # Indian and British English: "one hundred and eight"
    return words(n // 1000) + " thousand" + ((" and " if n % 1000 < 100 else " ") + words(n % 1000) if n % 1000 else "")


def say_num(v, dec):
    """The figure as the screen rounds it, in words; trailing zeros are not spoken (5.50 is "five point five", 6.0 is "six")."""
    r = rhu(v, dec); s = f"{abs(r):.{dec}f}"; ip, _, fp = s.partition("."); fp = fp.rstrip("0")
    return ("minus " if r < 0 else "") + words(int(ip)) + (" point " + " ".join(ONES[int(c)] for c in fp) if fp else "")


assert fnum(8.25, 1) == "8.3" and fnum(8.35, 1) == "8.4" and fnum(-11.5, 1) == "−11.5" and say_num(5.50, 2) == "five point five", "rounding: halves go up"


class Val:
    def __init__(self, name, v, d):
        self.name, self.v, self.d = name, v, d
        self.dec, self.unit, self.prefix = d.get("dec", 2), d.get("unit", "%"), d.get("prefix", "")      # prefix: "₹" goes before the number
        self.say_unit = d.get("say_unit", " rupees" if self.prefix == "₹" else UNIT_WORDS.get(self.unit, self.unit))

    def num(self):
        return fnum(abs(self.v) if self.d.get("abs") else self.v, self.dec, self.d.get("sign", False) and not self.d.get("abs"), not self.d.get("plain"))

    def text(self):
        n = self.num(); sgn = n[0] if n[:1] in "+−" else ""
        return sgn + self.prefix + n[len(sgn):] + self.unit

    def say(self):
        return say_num(abs(self.v) if self.d.get("abs") else self.v, self.dec) + self.say_unit


# ---------------------------------------------------------------- text boxes: the same limits LongStory.tsx draws with
BX = json.load(open(BOXES)) if os.path.exists(BOXES) else {}
plain = lambda t: t.replace("*", "")


def n_lines(text, size, width, ratio):
    """Lines a text wraps into (the same count as wrapFit in LongStory.tsx)."""
    per = width / (size * ratio); n, cur = 1, 0
    for w in plain(text).split(" "):
        if cur and cur + 1 + len(w) > per: n += 1; cur = len(w)
        else: cur += (1 if cur else 0) + len(w)
    return n


def check_box(name, text, field, w=None, mx=None):
    b = BX[name]; w = w or b["w"]
    if "sizes" in b:
        small = min(b["sizes"])
        assert n_lines(text, small, w, b["ratio"]) <= b["lines"], f"{field}: '{plain(text)}' wraps to more than {b['lines']} lines even at {small} px in {w} px"
    else:
        size = min(mx or b["max"], w / (max(1, len(plain(text))) * b["ratio"]))
        assert size >= b["min"], f"{field}: '{plain(text)}' would shrink to {size:.0f} px to fit {w} px (at least {b['min']})"


class Ctx:
    """The build in progress: resolved figures, the report, and the checks every text goes through."""
    def __init__(self, cfg):
        self.cfg, self.vals, self.checked, self.n_tests, self.texts = cfg, {}, [], 0, []

    def load_vals(self):
        global CTX
        CTX = self
        for name, d in self.cfg.get("vals", {}).items():
            v = scalar(d["v"])
            self.checked.append("val " + check_value(name, v, d)); self.n_tests += 1      # no test, no figure on screen
            self.vals[name] = Val(name, v, d)

    def test(self, says, v, k):
        self.checked.append(check_value(says, v, k)); self.n_tests += 1

    def expand(self, tpl, spoken=False):
        def one(m):
            assert m.group(1) in self.vals, f"'{{{m.group(1)}}}' is not in vals"
            v = self.vals[m.group(1)]
            return v.say() if spoken else v.num() if m.group(2) == "n" else v.text()
        return PH.sub(one, tpl)

    def t(self, tpl, box=None, field="", w=None, mx=None, free=False):
        """Text for the screen: no figure typed by hand (a year or a date may be), placeholders filled, banned words and division 02 refused, box checked."""
        if not free:
            bad = re.findall(r"\d+", YEAR.sub("", DATE.sub("", PH.sub("", tpl))))
            assert not bad, f"{field}: '{tpl}' types the figure {bad[0]} by hand: give it a name under vals and write {{name}}"
        s = self.expand(tpl)
        assert not NEVER.search(s), f"{field}: division 02 is never shown: '{s}'"
        m = B.BANNED.search(plain(s)); assert not m, f"{field}: '{m.group(0)}' is not allowed on screen: '{s}'"
        if box: check_box(box, s, field, w, mx)
        self.texts.append(s)
        return s

    def v(self, tpl, field):
        """A line for the narrator: every figure in words, no digits, short."""
        s = self.expand(tpl, spoken=True)
        assert not re.search(r"\d", s), f"{field}: a voice line has digits (spell numbers out): '{s}'"
        assert len(s.split()) <= 20, f"{field}: a voice line is {len(s.split())} words (at most 20): '{s}'"
        m = B.BANNED.search(s); assert not m, f"{field}: '{m.group(0)}' is not allowed in the voice: '{s}'"
        return s


# ---------------------------------------------------------------- scene kinds: config -> what the template draws
def r_cold(sc, X, i):
    lines = [X.t(l, "cold.line", f"scene {i} line", w=BX["cold.line"]["w" if sc.get("map") else "wFull"]) for l in sc["lines"]]
    assert 2 <= len(lines) <= 3, f"scene {i}: a cold open has two or three lines"
    out = {"lines": lines}
    if sc.get("map"):
        st = sc["map"]["lit"]; assert B.geo(st) in B.GEO, f"scene {i}: {st} is not on the map"
        out["lit"] = {"geo": B.geo(st), "name": B.nm(st), "label": X.t(sc["map"]["label"], None, f"scene {i} map label")}
    return out


def r_card(sc, X, i):
    ch = X.cfg["chapters"][X.ch_index[sc["chapter"]]]
    check_box("card.title", ch["title"], f"chapter {ch['id']} title")
    out = {"n": f"{X.ch_index[sc['chapter']]:02d}", "title": ch["title"]}
    if sc.get("sub"): out["sub"] = X.t(sc["sub"], "card.sub", f"scene {i} sub")
    return out


def r_line(sc, X, i):
    ser = []
    for k, s in enumerate(sc["series"]):
        pts = months(s["data"]); X.test(f"scene {i} {s['name']}, last point", pts[-1][1], s)      # the figure the chart ends on
        ser.append({"name": X.t(s["name"], "line.name", f"scene {i} series name"), "color": k, "label": fnum(pts[-1][1], s.get("dec", 2)) + s.get("unit", "%"),
                    "pts": [{"m": m, "v": v} for m, v in pts]})
    assert 1 <= len(ser) <= 3, f"scene {i}: a line chart has one to three series"
    assert len({tuple(p["m"] for p in s["pts"]) for s in ser}) == 1, f"scene {i}: the series cover different months"
    marks = []
    for mk in sc.get("marks", []):
        s_i = mk.get("series", 0); got = dict(months(sc["series"][s_i]["data"]))[mk["at"]]; val = X.vals[mk["var"]]
        assert abs(got - val.v) < 1e-9, f"scene {i}: {mk['var']} ({val.v}) is not the {mk['at']} point of the series ({got})"
        marks.append({"m": mk["at"], "s": s_i, "text": val.text()})
    out = {"series": ser, "marks": marks}
    if "ymin" in sc: out["ymin"] = sc["ymin"]
    return out


def r_bars(sc, X, i):
    n = len(sc["rows"]); assert 3 <= n <= 12, f"scene {i}: bars take 3 to 12 rows"
    fs = 38 if n >= 9 else 42 if n >= 6 else 50      # the label size LongStory.tsx draws for this many rows
    dec, unit, wdec = sc.get("dec", 2), sc.get("unit", "%"), sc.get("wdec", 1)
    rows = []
    for r in sc["rows"]:
        v = scalar(r["v"]); X.test(f"scene {i} {r['label']}", v, r)
        row = {"label": X.t(r["label"], "bars.label", f"scene {i} row label", mx=fs), "v": v, "text": fnum(v, dec, sc.get("sign", False)) + unit, "hi": bool(r.get("hi"))}
        if "w" in r:
            w = scalar(r["w"]); X.test(f"scene {i} {r['label']} weight", w, {"equals": r["w_equals"]} if "w_equals" in r else {})
            row.update({"w": w, "wtext": fnum(w, wdec) + "%"})
        rows.append(row)
    weighted = [("w" in r) for r in rows]
    assert all(weighted) or not any(weighted), f"scene {i}: either every row has a weight or none does"
    if sc.get("sort"): rows.sort(key=lambda r: r["v"], reverse=sc["sort"] == "desc")
    if sc.get("expect_top"):
        top = max(rows, key=lambda r: r["v"])["label"]
        assert top == sc["expect_top"], f"scene {i}: the largest bar is '{top}', not '{sc['expect_top']}'"
    if sc.get("expect_bottom"):      # the voice says which row is lowest: every row of the set must be on the chart
        low = min(rows, key=lambda r: r["v"])["label"]
        assert low == sc["expect_bottom"], f"scene {i}: the smallest bar is '{low}', not '{sc['expect_bottom']}'"
    out = {"rows": rows}
    if any(weighted):
        out["weightHead"] = X.t(sc.get("weight_head", "Share of basket"), "bars.head", f"scene {i} weight head")
    return out


def r_map(sc, X, i):
    vals, india = B.series(sc["data"]); dec, unit = sc.get("dec", 1), sc.get("unit", "%")
    asc = sorted(vals, key=lambda s: (vals[s], s)); n = len(asc); bucket = {s: min(4, k * 5 // n) for k, s in enumerate(asc)}      # five bands by rank, as the Shorts
    states = [{"name": B.geo(s), "label": fnum(vals[s], dec), "bucket": bucket[s], "nudge": list(B.NUDGE.get(B.geo(s), (0, 0)))} for s in asc]
    missing = {x["name"] for x in states} - set(B.GEO); assert not missing, f"scene {i}: states not on the map: {missing}"
    desc = asc[::-1]; kt, kb = sc.get("top", 5), sc.get("bottom", 3)
    row = lambda rank, s: {"rank": rank, "name": B.nm(s), "text": fnum(vals[s], dec) + unit, "bucket": bucket[s]}
    for s in desc[:kt] + desc[-kb:]:
        check_box("map.name", B.nm(s), f"scene {i} list", w=330)
    key = sc.get("key", ["lowest", "highest"])
    out = {"top": [row(k + 1, s) for k, s in enumerate(desc[:kt])], "bottom": [row(n - kb + 1 + k, s) for k, s in enumerate(desc[-kb:])],      # the last row of the list is the lowest
           "states": states, "ring": [B.geo(s) for s in desc[:kt]] if sc.get("ring_top", True) else [],
           "legend": {"lo": fnum(vals[asc[0]], dec), "hi": fnum(vals[desc[0]], dec), "loWord": key[0], "hiWord": key[1]},
           "title": X.t(sc["title"], "map.title", f"scene {i} title")}
    if sc.get("sub"): out["sub"] = X.t(sc["sub"], "map.sub", f"scene {i} sub")
    if sc.get("note"): out["note"] = X.t(sc["note"], "map.note", f"scene {i} note")
    return out


def r_quote(sc, X, i):
    path, section, key = sc["verify"]; norm = lambda s: re.sub(r"\s+", " ", s).strip()
    assert norm(sc["text"]) in norm(table(path)[section][key]), f"scene {i}: the quote is not a sentence of {path} {section}/{key}"
    check_box("quote.text", sc["text"], f"scene {i} quote")
    by = X.t(sc["by"], "quote.by", f"scene {i} by", free=True); date = X.t(sc["date"], "quote.by", f"scene {i} date", free=True)
    X.checked.append(f"scene {i} quote is word for word from {path}")
    return {"text": sc["text"], "by": by, "date": date}


def r_compare(sc, X, i):
    out = {}
    for side in ("a", "b"):
        s = sc[side]; val = X.vals[s["var"]]; assert val.v > 0, f"scene {i}: a bar under a figure needs a positive figure"
        out[side] = {"label": X.t(s["label"], "cmp.label", f"scene {i} label"), "text": val.text(), "v": val.v, "sub": X.t(s.get("sub", ""), "cmp.sub", f"scene {i} sub")}
        check_box("cmp.big", val.text(), f"scene {i} figure")
    return out


def r_tiles(sc, X, i):
    n = len(sc["tiles"]); assert 3 <= n <= 4, f"scene {i}: three or four tiles"
    tw = (1740 - 36 * (n - 1)) / n - 56      # the room inside a tile, as LongStory.tsx lays it out
    tiles = []
    for t in sc["tiles"]:
        val = X.vals[t["var"]]; check_box("tile.big", val.text(), f"scene {i} tile figure", w=tw)
        tiles.append({"big": val.text(), "caption": X.t(t["caption"], "tile.caption", f"scene {i} tile caption", w=tw), "hi": bool(t.get("hi"))})
    return {"tiles": tiles}


def r_end(sc, X, i):
    out = {"q": X.t(sc["q"], "end.q", f"scene {i} question"), "next": X.t(sc["next"], "end.next", f"scene {i} next"), "sources": []}
    assert 1 <= len(X.cfg.get("sources", [])) <= 5, "the end card lists one to five sources"
    for s in X.cfg["sources"]:
        assert os.path.exists(f"{SRC}/{s['table']}.json"), f"source table {s['table']} is not saved"
        out["sources"].append(X.t(s["text"], "end.src", f"source {s['table']}", free=True))
    return out


KINDS = {"cold": r_cold, "card": r_card, "line": r_line, "bars": r_bars, "map": r_map, "quote": r_quote, "compare": r_compare, "tiles": r_tiles, "end": r_end}


# ---------------------------------------------------------------- the two services: the only place either is called
def voice(text, stem):
    """THE VOICING HOOK. --check: an estimate from the word count, nothing leaves this machine. Otherwise one voice_dk.say per line
    (MiniMax, or the Kokoro placeholder when no key is set), exactly as build_beats does it. Returns (file name, seconds)."""
    if CHECK:
        return "check.mp3", B.spoken(text)
    return V.say(text, stem)


def music(path, total, scenes):
    """THE MUSIC HOOK. --check: no bed. Otherwise music_shorts.make: a hit on every map and on the cold open, a tick at every cut, a breakdown
    before the first map. Returns the file name or None."""
    if CHECK:
        return None
    maps = [s["t0"] for s in scenes if s["kind"] == "map"]
    hits = [scenes[0]["t0"]] + maps
    M.make(path, total, seed=sum(map(ord, os.path.basename(os.path.dirname(path)))) % 50, hits=hits, ticks=[s["t0"] for s in scenes],
           drop=(maps[0] - M.BEAT * 2, maps[0]) if maps else None)
    return os.path.basename(path)


def lay_out(scenes, X, d):
    """Scenes on the timeline: each lasts its lead, its spoken lines with a pause between them, and its tail (at least the kind's animation time)."""
    t, vo = 0.0, []
    for i, s in enumerate(scenes):
        lines = [X.v(l, f"scene {i} voice") for l in s.pop("_vo")]; least, hold = s.pop("_min"), s.pop("_hold")
        lead = LEAD; at = t + lead; used = lead; s["cues"], s["vo"] = [], []
        for j, text in enumerate(lines):
            fn, sec = voice(text, f"{d}/vo_{i:02d}_{j:02d}")
            s["cues"].append(round(at - t, 3)); s["vo"].append({"text": text, "at": round(at, 3), "sec": round(sec, 3)})
            vo.append({"file": fn, "sec": round(sec, 3), "at": round(at, 3), "text": text})
            at += sec + GAP; used += sec + GAP
        need = used - GAP + TAIL if lines else hold
        dur = math.ceil(max(least, need) * FPS) / FPS
        s["t0"], s["t1"] = round(t, 3), round(t + dur, 3); t += dur
    return round(t + 0.4, 3), vo


def stamp(sec):
    sec = int(sec); h, m, s = sec // 3600, sec // 60 % 60, sec % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def expand_refs(cfg):
    tables, specs = cfg.get("tables", {}), cfg.get("specs", {})
    def walk(x):
        if isinstance(x, str): return tables[x[1:]] if x.startswith("@") and x[1:] in tables else x
        if isinstance(x, list): return [walk(y) for y in x]
        if isinstance(x, dict):
            return walk(copy.deepcopy(specs[x["$"]])) if set(x) == {"$"} else {k: walk(v) for k, v in x.items()}
        return x
    return {k: (v if k in ("tables", "specs") else walk(v)) for k, v in cfg.items()}


def build(path):
    cfg = expand_refs(json.load(open(path))); sid = cfg["id"]
    pal = PALETTES[cfg.get("palette", "A")]; d = f"{BASE}/{sid}"; os.makedirs(d, exist_ok=True)
    X = Ctx(cfg); X.load_vals()
    X.ch_index = {c["id"]: k for k, c in enumerate(cfg["chapters"])}
    run_tests(cfg, X)
    scenes = []
    for i, sc in enumerate(cfg["scenes"]):
        assert sc["kind"] in KINDS, f"scene {i}: unknown kind {sc['kind']}"
        assert sc["chapter"] in X.ch_index, f"scene {i}: no chapter '{sc['chapter']}'"
        out = {"i": i, "kind": sc["kind"], "ch": X.ch_index[sc["chapter"]], "_vo": sc.get("vo", []), "_min": sc.get("min", MIN_SEC[sc["kind"]]), "_hold": sc.get("hold", 2.5)}
        if sc.get("source"): out["source"] = X.t(sc["source"], "src", f"scene {i} source", free=True)
        for k, box in (("title", "head"), ("caption", "caption"), ("note", "caption")):      # a heading (two lines at most) and a note under the picture (the map has its own)
            if sc.get(k) and sc["kind"] != "map":
                out[k] = X.t(sc[k], box, f"scene {i} {k}")
        out.update(KINDS[sc["kind"]](sc, X, i))
        scenes.append(out)
    assert [s["ch"] for s in scenes] == sorted(s["ch"] for s in scenes), "scenes must follow the order of the chapters"
    for k in range(len(cfg["chapters"])):
        assert any(s["ch"] == k for s in scenes), f"chapter {cfg['chapters'][k]['id']} has no scene"
    total, vo = lay_out(scenes, X, d)
    for s in scenes:      # an animated map fills state by state, lowest first, then holds
        if s["kind"] == "map":
            step = min(M.BEAT / 4, (s["t1"] - s["t0"] - 2.5) / len(s["states"]))
            for k, st in enumerate(s["states"]): st["at"] = round(0.4 + k * step, 3)
    chapters = []
    for k, c in enumerate(cfg["chapters"]):
        t0 = next(s["t0"] for s in scenes if s["ch"] == k)
        lab = c.get("label", f"{k:02d}  {c['title']}" if k else "")
        if lab: check_box("chapter", lab, f"chapter {c['id']} label")
        chapters.append({"i": k, "id": c["id"], "title": c["title"], "label": lab, "t0": t0})
    for k, c in enumerate(chapters):
        c["t1"] = chapters[k + 1]["t0"] if k + 1 < len(chapters) else total
    warns = [f"chapter '{c['title']}' is {c['t1'] - c['t0']:.1f} s (YouTube chapters need at least 10 s)" for c in chapters if c["t1"] - c["t0"] < 10]
    if len(chapters) < 3: warns.append("YouTube needs at least three chapters")
    with open(f"{d}/chapters.txt", "w") as f:
        f.write("\n".join(f"{stamp(c['t0'])} {c['title']}" for c in chapters) + "\n")
    thumb = None
    if cfg.get("thumb"):      # the thumbnail's own words: two or three short lines and a sub line, figures from vals like any screen text
        th = cfg["thumb"]; assert 1 <= len(th["lines"]) <= 3, "thumb: one to three lines"
        thumb = {"lines": [X.t(l, None, "thumb line") for l in th["lines"]], "sub": X.t(th["sub"], None, "thumb sub") if th.get("sub") else ""}
        assert all(len(plain(l)) <= 14 for l in thumb["lines"]), f"thumb: a line over 14 characters is too small to read: {thumb['lines']}"
    music_file = music(f"{d}/music.wav", total, scenes)
    out = {"id": sid, "title": cfg["title"], "chip": cfg["chip"], "sourceShort": cfg["source_short"], "source": cfg["source"], "accent": pal["accent"], "accent2": pal["accent2"],
           "bands": pal["bands"], "fps": FPS, "total": total, "chapters": chapters, "scenes": scenes, "vo": [] if CHECK else vo, "music": music_file, "voiced": not CHECK,
           "voiceEngine": "none" if CHECK else V.ENGINE, "checked": X.checked,
           "figures": {n: {"value": round(v.v, 6), "shows": v.text()} for n, v in X.vals.items()}}
    if thumb: out["thumb"] = thumb
    json.dump(out, open(f"{d}/data.json", "w"), indent=1, ensure_ascii=False)
    print(f"{sid}: {len(scenes)} scenes · {len(chapters)} chapters · {stamp(total)} ({total:.1f} s) · {X.n_tests} tests passed · "
          + ("line lengths estimated, no audio, no music" if CHECK else f"voice {V.ENGINE}"))
    for c in chapters:
        print(f"  {stamp(c['t0']):>5}  {c['title']}  ({c['t1'] - c['t0']:.1f} s)")
    for w in warns: print(f"  note: {w}")
    print(f"  total {total:.1f} s")


def write_registry():
    ids = sorted(os.path.basename(os.path.dirname(p)) for p in glob.glob(f"{BASE}/*/data.json"))
    name = lambda i: "d_" + re.sub(r"\W", "_", i)
    lines = ["// Generated by scripts/datayt/build_long.py: every built long-form video, for the Remotion registry."]
    lines += [f'import {name(i)} from "../../public/datayt/long/{i}/data.json";' for i in ids]
    lines += ['import type {LongData} from "./LongStory";', "", f"export const LONGS = [{', '.join(name(i) for i in ids)}] as unknown as LongData[];", ""]
    open("src/datayt/longData.ts", "w").write("\n".join(lines))


if __name__ == "__main__":
    CHECK = "--check" in sys.argv
    want = {a for a in sys.argv[1:] if not a.startswith("--")}
    ok, bad = 0, []
    for f in sorted(glob.glob(f"{BASE}/configs/*.json")):
        sid = os.path.basename(f)[:-5]
        if want and sid not in want: continue
        try:
            build(f); ok += 1
        except (AssertionError, SystemExit, KeyError, ValueError, TypeError, ZeroDivisionError, StopIteration, IndexError) as e:
            bad.append(sid); print(f"{sid}: FAILED: {type(e).__name__}: {e}")
    write_registry()
    print(f"check: {ok} passed, {len(bad)} failed" + (": " + ", ".join(bad) if bad else ""))
    sys.exit(1 if bad else 0)

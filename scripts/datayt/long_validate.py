#!/usr/bin/env python3
"""Checks a long-form cartoon storyboard before anything is voiced, timed or rendered.

  .venv/bin/python scripts/datayt/long_validate.py public/datayt/long/babies/storyboard.json
  .venv/bin/python scripts/datayt/long_validate.py <storyboard.json> --strict      # warnings fail too
  .venv/bin/python scripts/datayt/long_validate.py <storyboard.json> --json        # machine-readable table
  .venv/bin/python scripts/datayt/long_validate.py --selftest

Storyboard shape (long_timeline.py turns it into timeline.json). A bare list of scenes is accepted too.
  {"id": "babies", "scenes": [
     {"id": "s01", "act": "hook", "kind": "title", "vo": "narration of this scene", "spec": {...},
      "reveals": [{"key": "k1", "word": "2.1", "nth": 1}],        # nth (optional): which occurrence of the word, default 1
      "transition": "wipe"}                                       # "wipe" | "cut", optional; wipe on the first scene of an act
  ]}
  A reveal is "this spec key may be drawn from the moment the narrator says this word". "word" may be a phrase
  ("two point one"); the reveal lands on its first word. The first scene is the hook: it has "hook": true, or "hook" /
  "cold open" in its act or id.

Everything about specs is derived from src/looks/cartoon/long/CONTRACT.md at run time (the scene kinds, their fields,
which are optional, enums, key fields, library names), so amend the contract and this check follows.

ERROR (exit 1)                                           WARN (pacing and things to look at; exit 1 only with --strict)
  invalid JSON, unknown kind, duplicate or missing id      scene speech under 2.5 s or over 8.5 s (words / 2.6)
  top-level spec field the contract does not list          the same kind more than 3 scenes in a row
  required top-level field missing, wrong type or enum     nested field not in the contract / missing / library name unknown
  reveal key not in the spec, or reveal word not in vo     two keys revealed on the same word occurrence
  a key the spec draws with no reveal (render would throw) a figure printed on a word that does not say it
  FigRef that does not resolve in figures.json             digits typed into text fields (the number rule: use fig() / {const})
  state named in a spec absent from figures.json           a figure a chart will skip (survey has no value)
  vo word count outside 1,300-1,500, first scene no hook   act change without a wipe, figures.json still PROVISIONAL
"""
import argparse, difflib, json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
LONG = os.path.join(ROOT, "public/datayt/long/babies")
CONTRACT = os.path.join(ROOT, "src/looks/cartoon/long/CONTRACT.md")
FIGURES = os.path.join(LONG, "figures.json")
STORYBOARD = os.path.join(LONG, "storyboard.json")

WPS = 2.6                                   # narration pace, words per second (the same estimate long_timeline.py uses)
LIMITS = {"scene_s": (2.5, 8.5), "run": 3, "words": (1300, 1500)}
FRAME = (1920, 1080)
TRANSITIONS = (None, "wipe", "cut")


# ---------------------------------------------------------------- words (shared with long_timeline.py)
TOKEN = re.compile(r"\d+(?:[.,]\d+)*|[^\W\d_]+")


def tokenize(text):
    """-> (chunks, toks). chunks: the whitespace-separated pieces of the text that carry a letter or digit (a bare dash or
    percent sign is not a word). toks: [(token, chunk index, sub index, sub count)], lower case, thousands commas dropped,
    so '2.0' is one token, 'twenty-five' two, 'NFHS-4' two and "Bihar's" two (so a reveal on "Bihar" finds it)."""
    chunks, toks = [], []
    for raw in str(text).split():
        parts = [m.replace(",", "") if m[0].isdigit() else m for m in TOKEN.findall(raw.lower())]
        if not parts:
            continue
        for s, m in enumerate(parts):
            toks.append((m, len(chunks), s, len(parts)))
        chunks.append(raw)
    return chunks, toks


def find_word(toks, word, nth=1):
    """Index in toks where the nth occurrence of `word` (a token or a phrase) starts -> (index or None, how many occurrences)."""
    w = [t for t, *_ in tokenize(word)[1]]
    seq = [t for t, *_ in toks]
    hits = [i for i in range(len(seq) - len(w) + 1) if w and seq[i:i + len(w)] == w]
    return (hits[nth - 1] if 0 < nth <= len(hits) else None), len(hits)


def reveal_items(sc):
    """-> (items, errors). items: [{key, word, nth}] from a scene's "reveals": a list of {key, word, nth?} (or a dict
    {key: word} / {key: {word, nth}}). Empty or missing means no reveals."""
    raw, items, errs = sc.get("reveals"), [], []
    if raw is None or raw == [] or raw == {}:
        return items, errs
    if isinstance(raw, dict):
        raw = [{"key": k, **(v if isinstance(v, dict) else {"word": v})} for k, v in raw.items()]
    if not isinstance(raw, list):
        return items, [f'"reveals" should be a list of {{key, word}}, not {type(raw).__name__}']
    seen = set()
    for i, r in enumerate(raw):
        if not isinstance(r, dict) or not isinstance(r.get("key"), str) or not r.get("key") or not isinstance(r.get("word"), str) or not r["word"].strip():
            errs.append(f'reveals[{i}] should be {{"key": "...", "word": "..."}}, got {json.dumps(r, ensure_ascii=False)[:80]}')
            continue
        nth = r.get("nth", 1)
        if not isinstance(nth, int) or isinstance(nth, bool) or nth < 1:
            errs.append(f'reveals[{i}] ({r["key"]}): nth should be an integer from 1, got {nth!r}')
            continue
        if r["key"] in seen:
            errs.append(f'reveals[{i}]: key "{r["key"]}" is listed twice')
            continue
        seen.add(r["key"])
        items.append({"key": r["key"], "word": r["word"], "nth": nth})
    return items, errs


class StoryboardError(ValueError):
    """The storyboard file is not usable (bad JSON or shape), as opposed to a contract or figures problem."""


def load_storyboard(path):
    """-> (id, scenes list). Raises StoryboardError with a readable message on bad JSON or shape."""
    try:
        with open(path, encoding="utf-8") as fh:
            sb = json.load(fh)
    except json.JSONDecodeError as e:
        raise StoryboardError(f"not valid JSON: {e}")
    scenes = sb.get("scenes") if isinstance(sb, dict) else sb
    if not isinstance(scenes, list) or not scenes:
        raise StoryboardError('storyboard needs a non-empty "scenes" list')
    return (sb.get("id") if isinstance(sb, dict) else None) or "babies", scenes


# ---------------------------------------------------------------- the contract, read from CONTRACT.md
NAME = re.compile(r"([A-Za-z_]\w*)(\?)?")
QUOTED = re.compile(r'"([^"]*)"')


class Field:
    """One field of a spec as the contract writes it: name, optional (?), raw value notation, nested fields."""
    def __init__(self, name, opt, raw, kids, kids_open):
        self.name, self.opt, self.raw, self.kids, self.open = name, opt, raw, kids, kids_open
        self.kind, self.enum, self.item = infer(raw)


def infer(raw):
    """(kind, enum values, list item kind) from the contract's notation: string, number, boolean, FigRef, key, a "a"|"b"
    union (an enum when it has two or more literals), [{...}], {...}, T[] or a bare example value."""
    if raw is None:
        return None, None, None
    r = re.sub(r"\s*\([^)]*\)\s*$", "", raw).strip()
    if r.startswith("["):
        inner = r[1:-1].strip() if r.endswith("]") else ""
        if inner.startswith("{"):
            return "list", None, "dict"
        lits = QUOTED.findall(inner)
        return "list", (lits if len(lits) > 1 and "|" in inner else None), ("str" if lits else None)
    if r.startswith("{"):
        return "dict", None, None
    if r.endswith("[]"):
        base = r[:-2].strip().strip("()")
        lits = QUOTED.findall(base)
        if lits and set(QUOTED.sub("", base)) <= set("| "):
            return "list", (lits if len(lits) > 1 else None), "str"
        return "list", None, {"string": "str", "number": "num"}.get(base)
    if re.fullmatch(r'"[^"]*"(\s*\|\s*"[^"]*")+', r):
        return "enum", QUOTED.findall(r), None
    if re.fullmatch(r'"[^"]*"', r):
        return "str", None, None
    if r in ("true", "false"):
        return "bool", None, None
    if re.fullmatch(r"-?\d+(\.\d+)?", r):
        return "num", None, None
    return {"string": "str", "number": "num", "boolean": "bool", "FigRef": "figref", "key": "key"}.get(r), None, None


def parse_obj(s, i):
    """Parse the contract's `{a, b?: T, c: {...}, ...}` notation starting at s[i] == '{' -> (fields, open, next index)."""
    i += 1
    fields, is_open, n = {}, False, len(s)
    while i < n:
        while i < n and s[i] in " \t\n,":
            i += 1
        if i >= n:
            break
        if s[i] == "}":
            return fields, is_open, i + 1
        if s.startswith("...", i):
            is_open, i = True, i + 3
            continue
        m = NAME.match(s, i)
        if not m:
            raise ValueError(f"cannot read the contract notation at: {s[i:i + 40]!r}")
        name, opt, i = m.group(1), bool(m.group(2)), m.end()
        while i < n and s[i] in " \t":
            i += 1
        raw = kids = None
        kids_open = False
        if i < n and s[i] == ":":
            raw, kids, kids_open, i = parse_value(s, i + 1)
        fields[name] = Field(name, opt, raw, kids, kids_open)
    raise ValueError("unterminated { in the contract notation")


def parse_value(s, i):
    """Raw text of a value up to the next top-level comma or closing brace, plus the fields of the first object inside it."""
    start, depth, n, kids, kids_open = i, 0, len(s), None, False
    while i < n:
        c = s[i]
        if c == '"':
            i = s.index('"', i + 1) + 1
            continue
        if c == "{":
            k, o, i2 = parse_obj(s, i)
            if kids is None:
                kids, kids_open = k, o
            i = i2
            continue
        if c in "[(":
            depth += 1
        elif c in "])":
            depth -= 1
        elif c in ",}" and depth == 0:
            break
        i += 1
    return s[start:i].strip(), kids, kids_open, i


class Contract:
    """The scene kinds and their specs, the common fields, key / FigRef field names and library names, from CONTRACT.md text."""
    def __init__(self, text):
        sec = re.search(r"^## Scene kinds and specs\s*\n(.*?)(?=^## |\Z)", text, re.S | re.M)
        if not sec:
            raise ValueError('CONTRACT.md has no "## Scene kinds and specs" section')
        body = sec.group(1)
        self.common = {}
        para = re.search(r"All specs may also carry(.*?)(?:\n\s*\n|\Z)", body, re.S)
        for span in QUOTED_CODE.findall(para.group(1) if para else ""):
            if re.match(r"\w+\??\s*:", span):
                self.common.update(parse_obj("{" + span + "}", 0)[0])
        if not self.common:
            self.common = {"camera": Field("camera", True, "{fx, fy, s0, s1}", {k: Field(k, False, None, None, False) for k in ("fx", "fy", "s0", "s1")}, False),
                           "notes": Field("notes", True, "string", None, False)}
        self.kinds = {}
        for m in re.finditer(r"^\s*\d+\.\s+\*\*([A-Za-z0-9_-]+)\*\*(.*?)(?=^\s*\d+\.\s+\*\*|\Z)", body, re.S | re.M):
            span = next((c for c in QUOTED_CODE.findall(m.group(2)) if c.strip().startswith("{")), None)
            if span is None:
                raise ValueError(f'CONTRACT.md: scene kind "{m.group(1)}" has no `{{...}}` spec')
            self.kinds[m.group(1)] = parse_obj(span.strip(), 0)[0]
        if not self.kinds:
            raise ValueError("CONTRACT.md lists no scene kinds")
        self.keyfields, self.figrefs = {"key"}, {"ref"}
        for flds in list(self.kinds.values()) + [self.common]:
            self._collect(flds)

        def lst(rx, quoted):
            m = re.search(rx, text)
            return QUOTED.findall(m.group(1)) if m and quoted else ([w.strip() for w in m.group(1).split(",") if w.strip()] if m else [])
        self.lib = {"who": lst(r'who`?\s*:\s*((?:"[^"]+"\s*\|\s*)+"[^"]+")', True), "pose": lst(r'pose\s+((?:"[^"]+"\s*\|\s*)+"[^"]+")', True),
                    "icon": lst(r"names:\s*([a-z, ]+)", False), "set": lst(r"sets:\s*([a-z, ]+)", False)}

    def _collect(self, flds):
        for f in flds.values():
            if f.name == "key" or f.raw == "key":
                self.keyfields.add(f.name)
            if f.raw == "FigRef":
                self.figrefs.add(f.name)
            if f.kids:
                self._collect(f.kids)


QUOTED_CODE = re.compile(r"`([^`]*)`")


# ---------------------------------------------------------------- figures (mirrors figs.ts)
def fig_value(F, t, state, s=None):
    """The number fig({t, state, s}) would return, else None (figs.ts throws then)."""
    row = (F.get(t) or {}).get(state) if isinstance(F.get(t), dict) else None
    v = (row.get(s) if isinstance(row, dict) else None) if s else row
    return v if isinstance(v, (int, float)) and not isinstance(v, bool) else None


def known_state(F, state):
    return isinstance(F.get("tfr"), dict) and state in F["tfr"]


def walk(v, name="", path=""):
    """Every value in a spec -> (path, nearest field name, value); list items inherit the field name."""
    yield path, name, v
    if isinstance(v, dict):
        for k, x in v.items():
            yield from walk(x, k, f"{path}.{k}" if path else k)
    elif isinstance(v, list):
        for i, x in enumerate(v):
            yield from walk(x, name, f"{path}[{i}]")


# ---------------------------------------------------------------- spoken numbers (is the word that reveals a figure the figure?)
_UNITS = {w: i for i, w in enumerate("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split())}
_TENS = {w: 10 * (i + 2) for i, w in enumerate("twenty thirty forty fifty sixty seventy eighty ninety".split())}


def _words_to_int(ws):
    cur = 0
    for w in ws:
        if w in _UNITS:
            cur += _UNITS[w]
        elif w in _TENS:
            cur += _TENS[w]
        elif w == "hundred":
            cur = max(cur, 1) * 100
        else:
            return None
    return cur if ws else None


def spoken_number(toks):
    """['2.7'] or ['two','point','seven'] or ['twenty','eight'] -> (value, decimals) or None."""
    if len(toks) == 1 and re.fullmatch(r"\d+(\.\d+)?", toks[0]):
        return float(toks[0]), (len(toks[0].split(".")[1]) if "." in toks[0] else 0)
    ws = [w for w in toks if w != "and"]
    if "point" in ws:
        k = ws.index("point")
        whole, dec = _words_to_int(ws[:k]) if k else 0, ws[k + 1:]
        if whole is None or not dec or any(_UNITS.get(w, _UNITS["zero"] if w == "oh" else 99) > 9 for w in dec):
            return None
        return float(f"{whole}." + "".join(str(_UNITS.get(w, 0)) for w in dec)), len(dec)
    n = _words_to_int(ws)
    return (float(n), 0) if n is not None else None


# ---------------------------------------------------------------- the checks
class Report:
    def __init__(self):
        self.rows = []

    def err(self, scene, check, msg):
        self.rows.append(("ERROR", scene, check, msg))

    def warn(self, scene, check, msg):
        self.rows.append(("WARN", scene, check, msg))


TEXT_FIELDS = {"text", "prefix", "suffix", "caption", "lines", "title", "sub", "chip", "question"}
NUMBER_OK = re.compile(r"nfhs[- ]?\d|\b(?:19|20)\d\d(?:[-–]\d\d)?\b", re.I)


def check_spec(sid, kind, spec, C, F, R):
    """Field names, requireds, types, enums, library names and every FigRef / state / survey the spec names."""
    flds = C.kinds[kind]

    def obj(o, fs, is_open, path, top):
        for name, v in o.items():
            f = fs.get(name) or (C.common.get(name) if top else None)
            if f is None:
                if top:
                    R.err(sid, "field", f'{path}{name}: not a field of kind "{kind}" in CONTRACT.md (allowed: {", ".join(list(fs) + list(C.common))})')
                elif not is_open:
                    R.warn(sid, "field", f"{path}{name}: not in CONTRACT.md for {kind} (fine if the builder added it and reported it)")
                continue
            val(v, f, path + name)
        for name, f in fs.items():
            if not f.opt and name not in o:
                (R.err if top else R.warn)(sid, "field", f"{path}{name}: required field missing")

    def val(v, f, p):
        k = f.kind
        if k == "list":
            if not isinstance(v, list):
                return R.err(sid, "type", f"{p}: should be a list")
            for i, x in enumerate(v):
                if f.item == "dict" and f.kids is not None:
                    obj(x, f.kids, f.open, f"{p}[{i}].", False) if isinstance(x, dict) else R.err(sid, "type", f"{p}[{i}]: should be an object")
                elif f.item == "str" and not isinstance(x, str):
                    R.err(sid, "type", f"{p}[{i}]: should be a string, got {x!r}")
                elif f.enum and x not in f.enum:
                    R.err(sid, "enum", f"{p}[{i}]: {x!r} is not one of {', '.join(f.enum)}")
        elif k == "dict" or k == "figref":
            if not isinstance(v, dict):
                return R.err(sid, "type", f"{p}: should be an object" + (" {t, state, s?}" if k == "figref" else ""))
            if k == "dict" and f.kids is not None:
                obj(v, f.kids, f.open, p + ".", False)
        elif k in ("str", "key"):
            if not isinstance(v, str) or (k == "key" and not v):
                R.err(sid, "type", f"{p}: should be a {'key string' if k == 'key' else 'string'}, got {v!r}")
        elif k == "num":
            if not isinstance(v, (int, float)) or isinstance(v, bool):
                R.err(sid, "type", f"{p}: should be a number, got {v!r}")
        elif k == "bool":
            if not isinstance(v, bool):
                R.err(sid, "type", f"{p}: should be true or false, got {v!r}")
        elif k == "enum":
            if v not in f.enum:
                R.err(sid, "enum", f"{p}: {v!r} is not one of {', '.join(f.enum)}")

    obj(spec, flds, False, "", True)

    # FigRefs: any {t, state} object, and any field the contract types FigRef
    for p, name, v in walk(spec):
        if isinstance(v, dict) and "t" in v and "state" in v:
            if not (isinstance(v["t"], str) and isinstance(v["state"], str) and isinstance(v.get("s", ""), str)):
                R.err(sid, "fig", f"{p}: FigRef needs string t, state (and s)")
            elif fig_value(F, v["t"], v["state"], v.get("s")) is None:
                R.err(sid, "fig", f"{p}: figure missing in figures.json: {json.dumps(v)} (the render would throw)")
        elif name in C.figrefs and isinstance(v, dict):
            R.err(sid, "fig", f"{p}: should be a FigRef {{t, state, s?}}, got {json.dumps(v, ensure_ascii=False)[:60]}")

    # figures a chart reads on its own (it skips a survey with no value, never guesses)
    def state_ok(st, where):
        if not isinstance(st, str) or not known_state(F, st):
            R.err(sid, "state", f'{where}: state "{st}" is not in figures.json')
            return False
        return True

    def skip_note(st, sv, where):
        if fig_value(F, "tfr", st, sv) is None:
            R.warn(sid, "fig", f'{where}: tfr {st} {sv} has no figure, so the chart skips it')
            return False
        return True

    if kind == "tfr-line":
        for i, pt in enumerate(spec.get("points") or []):
            if isinstance(pt, dict):
                skip_note(pt.get("state", "India"), pt.get("survey"), f"points[{i}]")
    elif kind in ("slope", "multiples"):
        items = spec.get("items") if kind == "slope" else [{"state": s, "surveys": spec.get("surveys")} for s in (spec.get("states") or [])]
        for i, it in enumerate(items or []):
            if not isinstance(it, dict) or not state_ok(it.get("state"), f"{'items' if kind == 'slope' else 'states'}[{i}]"):
                continue
            have = [skip_note(it["state"], sv, f"{'items' if kind == 'slope' else 'states'}[{i}]") for sv in (it.get("surveys") or [])]
            if kind == "slope" and sum(have) < 2:
                R.warn(sid, "fig", f'items[{i}]: {it["state"]} has fewer than two surveys with a figure, so there is no slope to draw')
    elif kind == "map":
        for fld in ("highlight", "labelStates"):
            for i, st in enumerate(spec.get(fld) or []):
                state_ok(st, f"{fld}[{i}]")
    elif kind == "scatter":
        x = spec.get("x")
        if isinstance(x, str) and not isinstance(F.get(x), dict):
            R.err(sid, "fig", f'x: figures.json has no "{x}" table')
        for i, st in enumerate(spec.get("label") or []):
            if state_ok(st, f"label[{i}]") and isinstance(x, str) and fig_value(F, x, st, "nfhs6") is None:
                R.err(sid, "fig", f"label[{i}]: {st} has no {x} nfhs6 figure")

    # library names (best effort, from the contract's "Fixed library APIs")
    if kind == "stage":
        actors = [a for a in (spec.get("actors") or []) if isinstance(a, dict)]
        ids = [a.get("id") for a in actors]
        for i in {x for x in ids if ids.count(x) > 1}:
            R.err(sid, "stage", f'actor id "{i}" is used twice')
        b = spec.get("bubble")
        if isinstance(b, dict) and b.get("who") not in ids:
            R.err(sid, "stage", f'bubble.who "{b.get("who")}" is not an actor id of this scene ({", ".join(map(str, ids)) or "no actors"})')
        for lib, vals, where in (("set", [spec.get("set")], "set"), ("who", [a.get("who") for a in actors], "actors.who"),
                                 ("pose", [a.get("pose") for a in actors if a.get("pose")], "actors.pose"),
                                 ("icon", [p.get("icon") for p in (spec.get("props") or []) if isinstance(p, dict)], "props.icon")):
            for v in vals:
                if C.lib[lib] and isinstance(v, str) and v not in C.lib[lib]:
                    R.warn(sid, "library", f'{where} "{v}" is not in the contract list ({", ".join(C.lib[lib])})')

    # positions inside the frame; digits typed into text
    for p, name, v in walk(spec):
        if isinstance(v, dict) and all(isinstance(v.get(a), (int, float)) and not isinstance(v.get(a), bool) for a in "xy"):
            if not (0 <= v["x"] <= FRAME[0] and 0 <= v["y"] <= FRAME[1]):
                R.warn(sid, "frame", f'{p}: position ({v["x"]}, {v["y"]}) is outside the {FRAME[0]}x{FRAME[1]} frame')
        if name in TEXT_FIELDS and isinstance(v, str) and re.search(r"\d", NUMBER_OK.sub("", v)):
            R.warn(sid, "typed-number", f'{p}: digits typed in text "{v[:50]}" (numbers come from fig() or a {{const}}, and wait for their word)')


def check_reveals(sid, sc, spec, toks, C, F, R):
    """Reveal keys vs the spec, reveal words vs the vo, keys the spec draws vs reveals, figures printed on the right word."""
    items, errs = reveal_items(sc)
    for e in errs:
        R.err(sid, "reveal", e)
    strings = {v for p, n, v in walk(spec) if isinstance(v, str) and n != "notes"}
    drawn = {v for p, n, v in walk(spec) if n in C.keyfields and isinstance(v, str) and v}
    at = {}
    for it in items:
        if it["key"] not in strings:
            R.err(sid, "reveal-key", f'reveal key "{it["key"]}" does not appear in the spec')
        idx, hits = find_word(toks, it["word"], it["nth"])
        if idx is None:
            close = difflib.get_close_matches(" ".join(t for t, *_ in tokenize(it["word"])[1]), sorted({t for t, *_ in toks}), 3)
            R.err(sid, "reveal-word", f'reveal "{it["key"]}": word "{it["word"]}"' + (f" occurrence {it['nth']}" if it["nth"] > 1 else "") + " is not in the vo"
                  + (f" (found {hits}x)" if hits else "") + (f"; close: {', '.join(close)}" if close else ""))
        else:
            at.setdefault(idx, []).append(it["key"])
    for idx, keys in at.items():
        if len(keys) > 1:
            R.warn(sid, "reveal-same", f'keys {", ".join(keys)} all reveal on the same word ("{toks[idx][0]}"); use nth if they are different occurrences')
    for k in sorted(drawn - {it["key"] for it in items}):
        R.err(sid, "reveal-missing", f'the spec draws key "{k}" but reveals has no entry for it (the render would throw)')

    # a figure printed on a key must be revealed on the word that says it
    bound = []
    for p, n, v in walk(spec):
        if isinstance(v, dict) and isinstance(v.get("key"), str) and isinstance(v.get("ref"), dict):
            bound.append((v["key"], v["ref"], p))
    if sc.get("kind") == "tfr-line":
        for i, pt in enumerate(spec.get("points") or []):
            if isinstance(pt, dict) and isinstance(pt.get("key"), str):
                bound.append((pt["key"], {"t": "tfr", "state": pt.get("state", "India"), "s": pt.get("survey")}, f"points[{i}]"))
    by_key = {it["key"]: it for it in items}
    for key, ref, p in bound:
        it = by_key.get(key)
        v = fig_value(F, ref.get("t"), ref.get("state"), ref.get("s")) if isinstance(ref, dict) else None
        if it is None or v is None:
            continue
        sp = spoken_number([t for t, *_ in tokenize(it["word"])[1]])
        if sp is None:
            R.warn(sid, "reveal-figure", f'{p}: key "{key}" prints {v} but is revealed on "{it["word"]}", which is not the number (reveal it on the word that says it)')
        elif abs(sp[0] - abs(v)) > 0.5 * 10 ** -sp[1] + 1e-9:         # a minus sign is not a token, so compare sizes
            R.warn(sid, "reveal-figure", f'{p}: key "{key}" prints {v} but is revealed on the number "{it["word"]}"')


def validate(scenes, C, F, limits=None):
    """-> (report, stats). Every check in the module docstring."""
    L = {**LIMITS, **(limits or {})}
    R, ids = Report(), set()
    total_words, est = 0, 0.0
    if isinstance(F.get("meta"), dict) and str(F["meta"].get("status", "")).upper().startswith("PROVISIONAL"):
        R.warn("-", "figures", "figures.json meta.status is still PROVISIONAL (the verification step replaces it)")
    no_act = []
    for n, sc in enumerate(scenes):
        sid = sc.get("id") if isinstance(sc, dict) and isinstance(sc.get("id"), str) and sc.get("id") else f"#{n + 1}"
        if not isinstance(sc, dict):
            R.err(sid, "structure", "a scene should be an object")
            continue
        if not isinstance(sc.get("id"), str) or not sc.get("id"):
            R.err(sid, "id", "scene has no string id")
        elif sid in ids:
            R.err(sid, "id", "duplicate scene id")
        ids.add(sid)
        if not sc.get("act"):
            no_act.append(sid)
        if sc.get("transition") not in TRANSITIONS:
            R.err(sid, "transition", f'transition should be "wipe" or "cut", got {sc.get("transition")!r}')
        vo = sc.get("vo")
        if not isinstance(vo, str):
            R.err(sid, "vo", 'scene needs a "vo" string (the narration, empty if silent)')
            vo = ""
        chunks, toks = tokenize(vo)
        total_words += len(chunks)
        secs = len(chunks) / WPS
        est += max(secs + 0.5, 2.5)
        if not chunks:
            R.warn(sid, "pace", "no narration in this scene")
        elif secs < L["scene_s"][0] or secs > L["scene_s"][1]:
            R.warn(sid, "pace", f'{len(chunks)} words = {secs:.1f} s of speech; keep scenes between {L["scene_s"][0]} and {L["scene_s"][1]} s')
        kind, spec = sc.get("kind"), sc.get("spec")
        if kind not in C.kinds:
            R.err(sid, "kind", f'unknown kind {kind!r} (known: {", ".join(C.kinds)})')
            continue
        if not isinstance(spec, dict):
            R.err(sid, "spec", '"spec" should be an object')
            continue
        check_spec(sid, kind, spec, C, F, R)
        check_reveals(sid, sc, spec, toks, C, F, R)
    if no_act:
        R.warn(no_act[0], "act", f'{len(no_act)} scene(s) have no "act" ({", ".join(no_act[:4])}{"..." if len(no_act) > 4 else ""}); the timeline wants one per scene')

    valid = [sc for sc in scenes if isinstance(sc, dict)]
    run = 1
    for i in range(1, len(valid) + 1):
        if i < len(valid) and valid[i].get("kind") == valid[i - 1].get("kind"):
            run += 1
            continue
        if run > L["run"]:
            first = valid[i - run]
            R.warn(first.get("id", f"#{i - run + 1}"), "kind-run", f'{run} {first.get("kind")} scenes in a row (more than {L["run"]}); vary the kinds')
        run = 1
    for a, b in zip(valid, valid[1:]):
        if a.get("act") and b.get("act") and a["act"] != b["act"] and b.get("transition") != "wipe":
            R.warn(b.get("id", "?"), "transition", f'act changes ({a["act"]} -> {b["act"]}) without a "wipe" transition')
    lo, hi = L["words"]
    if not lo <= total_words <= hi:
        R.err("-", "words", f"the vo is {total_words:,} words; the script wants {lo:,}-{hi:,}")
    first = valid[0] if valid else {}
    if not (first.get("hook") is True or re.search(r"hook|cold.?open", f'{first.get("act", "")} {first.get("id", "")}', re.I)):
        R.err(first.get("id", "#1"), "hook", 'the first scene should be the hook (set "hook": true, or put "hook" in its act or id)')
    return R, {"scenes": len(scenes), "words": total_words, "est_sec": est}


# ---------------------------------------------------------------- output
def table(rows):
    if not rows:
        return "no problems"
    w = [max(len(r[i]) for r in rows + [("SEV", "SCENE", "CHECK", "")]) for i in range(3)]
    out = [f'{"SEV":<{w[0]}}  {"SCENE":<{w[1]}}  {"CHECK":<{w[2]}}  MESSAGE']
    out += [f"{s:<{w[0]}}  {sc:<{w[1]}}  {ck:<{w[2]}}  {m}" for s, sc, ck, m in rows]
    return "\n".join(out)


def run(path, contract, figures, strict=False, as_json=False):
    """Returns the exit code: 0 clean, 1 on any ERROR (or any WARN with strict), 2 when an input cannot be read."""
    try:
        with open(contract, encoding="utf-8") as fh:
            C = Contract(fh.read())
        with open(figures, encoding="utf-8") as fh:
            F = json.load(fh)
        _, scenes = load_storyboard(path)
    except FileNotFoundError as e:
        print(f"cannot read {e.filename}", file=sys.stderr)
        return 2
    except StoryboardError as e:
        rows = [("ERROR", "-", "json" if "JSON" in str(e) else "structure", str(e))]
        print(json.dumps({"errors": 1, "warnings": 0, "problems": rows}) if as_json else table(rows))
        return 1
    except ValueError as e:
        print(f"contract or figures unreadable: {e}", file=sys.stderr)
        return 2
    R, st = validate(scenes, C, F)
    order = {sc.get("id", f"#{i + 1}") if isinstance(sc, dict) else f"#{i + 1}": i for i, sc in enumerate(scenes)}
    rows = sorted(R.rows, key=lambda r: (r[0] != "ERROR", order.get(r[1], len(order))))     # errors first, then by scene
    errors, warns = sum(r[0] == "ERROR" for r in rows), sum(r[0] == "WARN" for r in rows)
    if as_json:
        print(json.dumps({"errors": errors, "warnings": warns, "stats": st, "problems": [dict(zip(("sev", "scene", "check", "msg"), r)) for r in rows]}, ensure_ascii=False))
    else:
        print(table(rows))
        m, s = divmod(round(st["est_sec"]), 60)
        print(f'\n{st["scenes"]} scenes, {st["words"]:,} words, about {m}:{s:02d} at {WPS} words/s | {errors} error(s), {warns} warning(s)')
    return 1 if errors or (strict and warns) else 0


# ---------------------------------------------------------------- self-test
MINI = '''
## Fixed library APIs (SVG)
- `Actor`: `<Actor who x y/>`; `who`: "uncle"|"mother"|"baby"; pose "idle"|"point"; mouth = A-H.
- `Icon`: names: book, school, ring.
- `Set`: sets: home, void.

## Scene kinds and specs
All specs may also carry `camera?: {fx, fy, s0, s1}` (push-in) and `notes?: string`.

1. **title**: opening card. `{title, sub?, chip?}`.
2. **stage**: a scene. `{set, actors: [{id, who, x, y, h, pose?, enter?: key}], badges?: [{key, ref?: FigRef, text?: string, x, y, accent?: "underline"|"circle"}], bubble?: {who: actorId, text, x, y}}`.
3. **tfr-line**: chart. `{points: [{survey: "nfhs3"|"nfhs4", state: "India", key}], line: {const: 2.1, key}, years?: {nfhs3: "2005-06", ...}, cross?: key}`.
4. **statement**: `{lines: string[], accent?: string[] (words in yellow), mascot?: boolean}`.

## Checks
'''
MINI_FIGS = {"meta": {"status": "VERIFIED"}, "tfr": {"India": {"nfhs3": 2.7, "nfhs4": 2.2}, "Bihar": {"nfhs4": 3.4, "nfhs6": 2.7}}}


def selftest():
    import copy
    C = Contract(MINI)
    assert set(C.kinds) == {"title", "stage", "tfr-line", "statement"}, list(C.kinds)
    assert "camera" in C.common and "notes" in C.common and not C.kinds["title"]["title"].opt and C.kinds["title"]["sub"].opt
    assert C.kinds["stage"]["actors"].item == "dict" and "enter" in C.kinds["stage"]["actors"].kids and C.kinds["stage"]["actors"].kids["enter"].raw == "key"
    assert C.kinds["tfr-line"]["points"].kids["survey"].enum == ["nfhs3", "nfhs4"] and C.kinds["tfr-line"]["years"].open
    assert C.kinds["stage"]["badges"].enum is None and C.kinds["stage"]["badges"].kids["accent"].enum == ["underline", "circle"]     # a union inside an object is not the list's enum
    assert C.kinds["statement"]["accent"].kind == "list" and C.kinds["statement"]["mascot"].kind == "bool"
    assert {"key", "enter", "cross"} <= C.keyfields and "ref" in C.figrefs
    assert C.lib["who"] == ["uncle", "mother", "baby"] and C.lib["pose"] == ["idle", "point"] and C.lib["icon"] == ["book", "school", "ring"] and C.lib["set"] == ["home", "void"], C.lib
    real = Contract(open(CONTRACT, encoding="utf-8").read())      # the real contract still parses, all ten kinds
    assert len(real.kinds) >= 10 and "stage" in real.kinds and "set" in real.kinds["stage"], list(real.kinds)
    assert real.kinds["stage"]["badges"].enum is None and real.kinds["tfr-line"]["points"].enum is None and "enter" in real.keyfields

    assert tokenize("In 2015-16, NFHS-4 said 2.2; 1,400 babies – 87 % (twenty-five).")[1][0][0] == "in"
    assert [t for t, *_ in tokenize("It’s 2.0, not −0.36 or 1,400 NFHS-4")[1]] == ["it", "s", "2.0", "not", "0.36", "or", "1400", "nfhs", "4"]
    assert find_word(tokenize("Bihar's rate fell")[1], "Bihar")[0] == 0 and find_word(tokenize("Bihar's rate fell")[1], "Bihar's")[0] == 0
    assert len(tokenize("a — b % c")[0]) == 3                                       # bare dashes and signs are not words
    assert find_word(tokenize("two is two and two")[1], "two", 2)[0] == 2 and find_word(tokenize("two is two")[1], "two", 3) == (None, 2)
    assert find_word(tokenize("fell to two point one today")[1], "Two point ONE")[0] == 2
    assert spoken_number(["2.7"]) == (2.7, 1) and spoken_number(["two", "point", "seven"]) == (2.7, 1) and spoken_number(["twenty", "eight"]) == (28.0, 0)
    assert spoken_number(["bihar"]) is None and spoken_number(["87"]) == (87.0, 0)
    assert fig_value(MINI_FIGS, "tfr", "Bihar", "nfhs6") == 2.7 and fig_value(MINI_FIGS, "tfr", "Bihar", "nfhs3") is None and fig_value(MINI_FIGS, "tfr", "Bihar") is None

    vo = "In nineteen ninety one India had many babies and today the fertility rate is 2.1 only."      # 16 words
    good = [
        {"id": "s01", "act": "hook", "kind": "title", "vo": vo, "spec": {"title": "Babies", "sub": "A map"}, "reveals": []},
        {"id": "s02", "act": "a1", "kind": "stage", "vo": "Two parents, two children, and one more reason to look at 2.7 in Bihar today.", "transition": "wipe",
         "spec": {"set": "home", "actors": [{"id": "u", "who": "uncle", "x": 400, "y": 900, "h": 500, "enter": "ek"}],
                  "badges": [{"key": "bk", "ref": {"t": "tfr", "state": "Bihar", "s": "nfhs6"}, "x": 900, "y": 300}], "bubble": {"who": "u", "text": "Hello", "x": 500, "y": 200}},
         "reveals": [{"key": "ek", "word": "Two"}, {"key": "bk", "word": "2.7"}]},
        {"id": "s03", "act": "a1", "kind": "tfr-line", "vo": "In 2.7 and then 2.2 India sat near the line of two point one children per woman.",
         "spec": {"points": [{"survey": "nfhs3", "state": "India", "key": "p3"}, {"survey": "nfhs4", "state": "India", "key": "p4"}], "line": {"const": 2.1, "key": "ln"}, "cross": "cr"},
         "reveals": [{"key": "p3", "word": "2.7"}, {"key": "p4", "word": "2.2"}, {"key": "ln", "word": "two point one"}, {"key": "cr", "word": "children"}]},
    ]
    lim = {"scene_s": (1.0, 9.0), "run": 3, "words": (30, 60)}
    def checks(scenes, **kw):
        R, _ = validate(scenes, C, kw.get("F", MINI_FIGS), lim)
        return R.rows

    rows = checks(good)
    assert rows == [], rows
    def bad(mutate, want, sev="ERROR", F=None):
        s = copy.deepcopy(good)
        mutate(s)
        rows = checks(s, F=F or MINI_FIGS)
        assert (sev, want) in {(r[0], r[2]) for r in rows}, (want, rows)
        return rows
    bad(lambda s: s[1].update(kind="nope"), "kind")
    bad(lambda s: s[1].update(id="s01"), "id")
    bad(lambda s: s[0]["spec"].update(colour="red"), "field")
    bad(lambda s: s[0]["spec"].pop("title"), "field")
    bad(lambda s: s[2]["spec"].update(cross=5), "type")
    bad(lambda s: s[2]["spec"].update(points="nfhs3"), "type")
    bad(lambda s: s[2]["spec"]["points"][0].update(survey="nfhs9"), "enum")
    bad(lambda s: s[1]["reveals"].append({"key": "zz", "word": "Two"}), "reveal-key")
    bad(lambda s: s[1]["reveals"].__setitem__(1, {"key": "bk", "word": "3.3"}), "reveal-word")
    bad(lambda s: s[1]["reveals"].pop(), "reveal-missing")
    bad(lambda s: s[1]["spec"]["badges"][0]["ref"].update(state="Atlantis"), "fig")
    bad(lambda s: s[1]["spec"]["badges"][0]["ref"].update(s="nfhs3"), "fig")
    bad(lambda s: s[1]["spec"]["bubble"].update(who="ghost"), "stage")
    bad(lambda s: s[0].update(act="intro"), "hook")
    bad(lambda s: s[0].update(vo=vo * 5), "words")
    bad(lambda s: s[1].update(transition="fade"), "transition")
    bad(lambda s: s[1]["spec"]["actors"][0].update(who="grandma"), "library", "WARN")
    bad(lambda s: s[1]["spec"]["actors"][0].update(speed=3), "field", "WARN")
    bad(lambda s: s[1]["spec"]["badges"][0].update(text="2.7 children", x=2400), "frame", "WARN")
    bad(lambda s: s[1]["spec"]["badges"][0].update(text="2.7 children"), "typed-number", "WARN")
    bad(lambda s: s[1]["reveals"].__setitem__(1, {"key": "bk", "word": "Bihar"}), "reveal-figure", "WARN")
    bad(lambda s: s[1]["reveals"].__setitem__(1, {"key": "bk", "word": "Two"}), "reveal-figure", "WARN")
    bad(lambda s: s[1]["reveals"].__setitem__(0, {"key": "ek", "word": "2.7"}), "reveal-same", "WARN")
    bad(lambda s: s[2]["spec"]["points"][0].update(survey="nfhs3"), "fig", "WARN", F={**MINI_FIGS, "tfr": {"India": {"nfhs4": 2.2}}})
    bad(lambda s: s[1].update(vo="Short."), "pace", "WARN")
    bad(lambda s: s[2].update(act="a2"), "transition", "WARN")
    bad(lambda s: None, "figures", "WARN", F={**MINI_FIGS, "meta": {"status": "PROVISIONAL: replaced later"}})
    run4 = copy.deepcopy(good[:1]) + [dict(copy.deepcopy(good[2]), id=f"t{i}") for i in range(4)]
    assert ("WARN", "kind-run") in {(r[0], r[2]) for r in checks(run4)}
    assert ("WARN", "kind-run") not in {(r[0], r[2]) for r in checks(run4[:4])}
    assert ("ERROR", "vo") in {(r[0], r[2]) for r in checks([{"id": "x", "kind": "title", "spec": {"title": "t"}}])}       # a missing vo is reported, not a crash
    assert ("ERROR", "structure") in {(r[0], r[2]) for r in checks(["scene"])}
    print("long_validate selftest OK")


def main():
    ap = argparse.ArgumentParser(description="Validate a long-form cartoon storyboard against CONTRACT.md and figures.json.")
    ap.add_argument("storyboard", nargs="?", default=STORYBOARD)
    ap.add_argument("--contract", default=CONTRACT)
    ap.add_argument("--figures", default=FIGURES)
    ap.add_argument("--strict", action="store_true", help="warnings fail too")
    ap.add_argument("--json", action="store_true", help="print the problems as JSON")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return selftest()
    sys.exit(run(a.storyboard, a.contract, a.figures, a.strict, a.json))


if __name__ == "__main__":
    main()

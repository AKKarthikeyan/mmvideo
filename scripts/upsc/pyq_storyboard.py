#!/usr/bin/env python3
"""Builds the storyboard of one Mains answer video (format A) from its answer module, then its estimated timeline.

  .venv/bin/python scripts/upsc/pyq_storyboard.py 2018-geo1-3a      # writes public/datayt/long/upsc/pyq-<id>/storyboard.json + timeline.json

The answer module is the single source of the words, the sheet and the numbers:
/Volumes/DarwinSSD/DataKadai/mmvideo-dk/research/upsc/pyq/<id>/answer.py (checked by scripts/upsc/pyq_tool.py there).
This file only cuts beats into scenes and gives each scene a kind and a spec (CONTRACT_PYQ.md). Idea scenes reuse specs of the
concept film's own scenes (for example the monsoon film geo07-p1), with reveal words remapped to this narration.
"""
import csv, importlib.util, json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MAIN = "/Volumes/DarwinSSD/DataKadai/mmvideo-dk"
UP = os.path.join(ROOT, "public/datayt/long/upsc")


def load(vid):
    p = os.path.join(MAIN, "research/upsc/pyq", vid, "answer.py")
    spec = importlib.util.spec_from_file_location("answer", p)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.A, p


def film(name):
    return {s["id"]: s for s in json.load(open(os.path.join(UP, name, "storyboard.json")))["scenes"]}


def sentences(t):
    return [s for s in re.split(r"(?<=[.?!])\s+", t.strip()) if s]


def borrow(fname, sid, remap):
    """a scene of the concept film, its spec copied whole and its reveal keys tied to words of this narration"""
    s = film(fname)[sid]
    keys = [r["key"] for r in s.get("reveals", [])]
    missing = [k for k in keys if k not in remap]
    if missing:
        raise SystemExit(f"borrow {fname}/{sid}: no word for keys {missing}")
    return s["kind"], s["spec"], [(k, remap[k]) for k in keys]


def year_strip(term):
    rows = list(csv.DictReader(open(os.path.join(MAIN, "research/upsc/_pyq/mains/questions.csv"), encoding="utf-8")))
    years = sorted({r["year"] for r in rows})
    hits = sorted({r["year"] for r in rows if re.search(term, r["text"], re.I)})
    return years, hits


# Per video: short demand labels, directives, glow phrases, which sheet blocks each sheet beat writes, and the idea scenes.
PLANS = {
    "2018-geo1-3a": dict(
        labels={"D1": "Origin", "D2": "Progress", "D3": "Retreat", "D4": "Economy"},
        glow=[("origin", "g1"), ("progress", "g2"), ("retreat", "g3"), ("impact on the Indian economy", "g4")],
        glow_words={"g1": "origin,", "g2": "progress", "g3": "retreat", "g4": "economy."},
        strip=dict(term=r"monsoon|el ni[nñ]o", word="seven.", note="Sittings with a monsoon question · our count from UPSC's papers"),
        directives=[("Explain", "show how and why", "x1", "Explain"), ("discuss", "weigh more than one effect", "x2", "Discuss")],
        demand_words={"D1": "origin,", "D2": "progress,", "D3": "retreat,", "D4": "economy."},
        sheet={"b07": (0, 0), "b08": (1, 2), "b09": (3, 3), "b10": (4, 5), "b11": (6, 7), "b12": (8, 9), "b13": (10, 10)},
        diagram="monsoon",
        ideas={
            "b03": [(None, "geo07-p1", "s006", {"l1": "land", "l2": "sea.", "g1": "flows"})],
            "b04": [(None, "statement", {"lines": [{"text": "NCERT, Class XI", "key": "c11"}, "No single theory has fully explained the monsoon",
                                                    {"text": "India: hotter in May than in July", "key": "hm"}], "accent": ["No single theory"]},
                     {"c11": "Class", "hm": "hotter"})],
            "b05": [((0, 1, 2), "geo07-p1", "s035", {"fs": "sun"}), ((3, 4), "geo07-p1", "s037", {"ij": "twenty", "mt": "trough."})],
            "b06": [((0, 1), "geo07-p1", "s022", {"eq": "equator", "tr": "Winds", "cx": "cross", "bd": "swing", "ex": "south-west."}),
                    ((2, 3), "geo07-p1", "s045", {"mh2": "fast", "sj": "jet", "sl": "Somalia", "jj": "coast."})],
        },
        next="Monsoon, Part 1: If heat brings the monsoon, why does the rain wait?",
        next_word="watch",
        weak_words=["cause.", "date.", "retreat.", "economy.", "diagram."],
        cousin_words=["factors", "unpredictable.", "erratic."],
    ),
    "2019-gs2-12": dict(
        labels={"D1": "The statement", "D2": "What Article 368 allows", "D3": "Can the power grow?", "D4": "Weigh it"},
        glow=[("destroy the Basic Structure", "g1"), ("by expanding its amending power", "g2")],
        glow_words={"g1": "destroy", "g2": "expanding"},
        directives=[("explain whether", "a reasoned yes or no", "x1", "whether")],
        demand_words={"D1": "statement.", "D2": "allows.", "D3": "grow.", "D4": "weigh"},
        sheet={"b06": (0, 0), "b07": (1, 2), "b08": (3, 5), "b09": (6, 8)},
        diagram="timeline",
        ideas={
            "b02": [(None, "statement", {"lines": [{"text": "Article {const:368}", "key": "a1"}, "add, change or repeal any provision",
                                                    {"text": "special majority in each House", "key": "sm"}, {"text": "some changes: half the States too", "key": "hs"}],
                                          "accent": ["any provision"]}, {"a1": "Article", "sm": "special", "hs": "half"})],
            "b03": [(None, "pyq_timeline", {"title": "THE AMENDING POWER AND ITS LIMIT", "items": [
                        {"when": "Art. 368", "what": "the power to amend"}, {"when": "1973", "what": "Kesavananda: 13 judges, 7 to 6, a limit", "key": "k1"}]},
                     {"k1": "Kesavananda"})],
            "b04": [(None, "pyq_timeline", {"title": "THE AMENDING POWER AND ITS LIMIT", "items": [
                        {"when": "Art. 368", "what": "the power to amend"}, {"when": "1973", "what": "Kesavananda: 13 judges, 7 to 6, a limit"},
                        {"when": "1976", "what": "42nd Amendment: courts barred, 'no limitation whatever'", "key": "k2", "red": True}]},
                     {"k2": "Forty-second"})],
            "b05": [(None, "pyq_timeline", {"title": "THE AMENDING POWER AND ITS LIMIT", "items": [
                        {"when": "Art. 368", "what": "the power to amend"}, {"when": "1973", "what": "Kesavananda: 13 judges, 7 to 6, a limit"},
                        {"when": "1976", "what": "42nd Amendment: courts barred, 'no limitation whatever'", "red": True},
                        {"when": "1980", "what": "Minerva Mills: both clauses struck down, 5 to 0", "key": "k3"}],
                        "quote": {"text": "The power to destroy is not a power to amend.", "cite": "Minerva Mills, 1980", "key": "q1"}},
                     {"k3": "Minerva", "q1": "destroy"})],
        },
        next="Coming in the Polity series: Basic Structure, the case that limited Parliament",
        next_word="episode",
        weak_words=["written", "list.", "myth", "Rights", "clauses"],
        cousin_words=["Coelho", "sixty-eight", "sovereignty."],
    ),
    "2025-eco1-4c": dict(
        labels={"D1": "Definition", "D2": "Determinants", "D3": "How control works"},
        glow=[("Define money multiplier", "g1"), ("determinants", "g2"), ("control money supply", "g3")],
        glow_words={"g1": "Define", "g2": "determinants.", "g3": "control"},
        directives=[("Define", "a precise meaning, with the formula", "x1", "Define"), ("discuss", "more than one side", "x2", "Discuss")],
        demand_words={"D1": "definition,", "D2": "determinants,", "D3": "controls"},
        sheet={"b05": (0, 0), "b06": (1, 3), "b07": (4, 5), "b08": (6, 8)},
        diagram="bars",
        ideas={
            "b02": [(None, "eco16-p2", "s011", {"rr": "twenty", "r0": "hundred", "r1": "Eighty", "r2": "sixty-four", "tot": "on."})],
            "b03": [(None, "eco16-p2", "s012", {"rs": "reserves", "dp": "deposits.", "mm": "multiplier.", "fm": "over"})],
            "b04": [(None, "eco16-p2", "s013", {"lk": "stops", "cd": "cash", "fm": "formula"})],
        },
        next="Money, Part 2: Where does a bank's loan money come from?",
        next_word="watch",
        weak_words=["stops.", "thirty-three.", "SLR.", "works.", "example."],
        cousin_words=["high-powered", "hoard", "creation."],
    ),
}



DIRECTIVE_MEANING = {"critically": "weigh strengths and weaknesses", "discuss": "weigh more than one side", "examine": "look closely at the facts and issues",
                     "explain": "show how and why", "comment": "take and back a position", "analyse": "split into parts, show the links",
                     "evaluate": "judge worth with evidence", "elucidate": "make clear, with examples", "mention": "name briefly",
                     "describe": "set out the features", "illustrate": "explain with examples", "assess": "judge how far",
                     "why": "give the reasons", "how": "show the process"}
TOK = re.compile(r"[\w'’-]+[.,?!:]?")


def toks(vo):
    return TOK.findall(vo)


def pick(vo, wants, default_first=True):
    """the first token of vo that starts with any of the wanted words (case-insensitive); else the first token"""
    ws = toks(vo)
    for w in ws:
        bare = w.rstrip(".,?!:").lower()
        if any(bare.startswith(x.lower()) for x in wants if len(x) > 2):
            return w
    return ws[0] if (ws and default_first) else None


def spread(vo, n):
    """n tokens of vo spread evenly from about a fifth of the way in"""
    ws = toks(vo)
    if not ws: return []
    idx = [min(len(ws) - 1, int(len(ws) * (0.15 + 0.75 * i / max(1, n)))) for i in range(n)]
    return [ws[i] for i in idx]


def short(text, n=4):
    t = re.split(r"[:(,;]", text)[0]
    t = re.sub(r"^(The|A|An)\s+", "", t.strip())
    return " ".join(t.split()[:n])


SHORT = {   # short demand labels for the boxes (the automatic cut of the demand text reads badly)
    "2021-gs1-7": {"D1": "The eruptions of 2021", "D2": "Their regional impact"},
    "2020-gs1-4": {"D1": "What and where", "D2": "Plates and relief", "D3": "Earthquakes", "D4": "Volcanoes"},
    "2023-gs1-7": {"D1": "Why 'Purvaiya'", "D2": "Its mark on culture"},
    "2017-gs1-17": {"D1": "Monsoon traits", "D2": "How it feeds Asia", "D3": "Check the premise"},
    "2026-gs2-1": {"D1": "Privacy and identity", "D2": "What the Act changed", "D3": "Its effect"},
    "2024-gs2-12": {"D1": "Privacy in Article 21", "D2": "Paternity DNA tests", "D3": "The child in the womb"},
    "2017-gs2-12": {"D1": "What Puttaswamy decided", "D2": "How rights widened", "D3": "Who is bound; limits", "D4": "How far it reaches"},
    "2024-gs1-18": {"D1": "The framework", "D2": "Why benefits lag", "D3": "The verdict"},
    "2023-gs2-12": {"D1": "The provisions", "D2": "The cases", "D3": "Laws and figures", "D4": "Weighing it"},
    "2022-gs2-2": {"D1": "Free, for citizens", "D2": "The limits", "D3": "The courts' view"},
}


def auto_plan(A, vid=""):
    """A plan derived from the answer module itself, for answers without a hand-made PLANS entry."""
    q, beats = A["question"], A["beats"]
    P = dict(labels={d["id"]: SHORT.get(vid, {}).get(d["id"]) or d.get("short") or short(d["text"]) for d in A["demands"]}, glow=[], glow_words={})
    xb = next((b for b in beats if b["scene"]["type"] == "xray"), None)
    qt = q["text"].lower()
    dirs = [w for w in DIRECTIVE_MEANING if re.search(r"\b" + w + r"\b", qt)]
    if xb:
        found = []
        for i, w in enumerate(dirs[:2]):
            word = pick(xb["say"], [w], default_first=False)
            if word:
                m = re.search(r"\b(" + w + r")\b", q["text"], re.I)
                found.append((m.group(1) if m else w, DIRECTIVE_MEANING[w], f"x{i + 1}", word))
        P["directives"] = found
        P["demand_words"] = {d["id"]: pick(xb["say"], P["labels"][d["id"]].split()) for d in A["demands"]}
    sheet_beats = [b["key"] for b in beats if b["scene"]["type"] == "sheet"]
    groups, cur = [], []
    for i, b in enumerate(A["sheet"]):
        if b["kind"] == "head" and cur: groups.append(cur); cur = []
        cur.append(i)
    if cur: groups.append(cur)
    K = len(sheet_beats)
    if len(groups) >= K:
        merged = groups[:K - 1] + [[i for g in groups[K - 1:] for i in g]]
    else:
        nb = len(A["sheet"]); cuts = [round(i * nb / K) for i in range(K + 1)]
        merged = [list(range(cuts[i], max(cuts[i] + 1, cuts[i + 1]))) for i in range(K)]
    P["sheet"] = {k: (g[0], g[-1]) for k, g in zip(sheet_beats, merged)}
    dg = next((b for b in A["sheet"] if b["kind"] == "diagram"), None)
    if dg:
        tx = dg["text"].lower()
        P["diagram"] = "monsoon" if dg.get("labels") else "bars" if "bar" in tx[:20] else "flow" if "flow" in tx[:20] else "timeline"
    P["ideas"] = {}
    for b in beats:
        if b["scene"]["type"] == "idea":
            parts = [x.strip() for x in re.split(r"·|\|", b.get("cap", "")) if x.strip()][:4] or \
                    [s for s in sentences(b["say"]) if len(s.split()) >= 5][:4]
            ws = spread(b["say"], len(parts))
            P["ideas"][b["key"]] = [(None, "pyq_card", {"title": (lambda t: t if len(t) <= 72 else t[:72].rsplit(" ", 1)[0])(A["title"].split(":")[0].split(" (UPSC")[0]), "lines": [{"text": x, "key": f"l{i + 1}"} for i, x in enumerate(parts)]},
                                     {f"l{i + 1}": ws[i] for i in range(len(parts))})]
    cmp_b = next((b for b in beats if b["scene"]["type"] == "compare"), None)
    P["weak_words"] = spread(cmp_b["say"], len(A["weak"])) if cmp_b else []
    cz = next((b for b in beats if b["scene"]["type"] == "cousins"), None)
    ncous = min(3, len(A["cousins"]))
    P["cousin_words"] = spread(cz["say"], ncous + 1)[:ncous] if cz else []
    cat = {r["id"]: r for r in csv.DictReader(open(os.path.join(MAIN, "docs/upsc/catalogue.csv"), encoding="utf-8"))}
    topic = next((l for l in A["ledgers"] if not l.startswith("pyq")), "")
    P["next"] = "The concept episode: " + cat.get(topic, {}).get("title", topic)
    P["next_word"] = spread(cz["say"], 1)[0] if cz else "watch"
    if cz:
        ws = toks(cz["say"]); P["next_word"] = ws[-3] if len(ws) > 3 else ws[-1]
    P["strip"] = dict(topic=topic, word=None, note="Sittings with a question on this idea · our count from UPSC's papers")
    return P

def main():
    vid = sys.argv[1]
    A, src = load(vid)
    P = PLANS.get(vid) or auto_plan(A, vid)
    global LED
    LED = {}
    for led in A["ledgers"]:
        for r in csv.DictReader(open(os.path.join(MAIN, "research/upsc", led, "claims.csv"), encoding="utf-8")):
            LED[r["claim_id"]] = r["claim"] + " " + r["value"]
    q = A["question"]
    demands = [dict(id=d["id"], label=P["labels"][d["id"]]) for d in A["demands"]]
    blocks = []
    for b in A["sheet"]:
        x = dict(kind=b["kind"], text=b["text"])
        if b.get("label"): x["label"] = b["label"]
        if b["kind"] == "diagram": x["diagram"] = dict(name=P["diagram"], labels=b.get("labels") or {}, items=b.get("items") or [])
        blocks.append(x)
    nwords = lambda t: len([w for w in t.split() if re.search(r"[A-Za-z0-9]", w)])
    weights = [nwords(b["text"]) if b["kind"] != "diagram" else 0 for b in A["sheet"]]
    textw = sum(weights)
    diag = textw / max(1, A["minutes"] - 1)
    weights = [w if b["kind"] != "diagram" else diag for w, b in zip(weights, A["sheet"])]
    W = sum(weights)
    usable = A["minutes"] - 0.4
    last_block = {d["id"]: max(i for i, b in enumerate(A["sheet"]) if d["id"] in b["demands"]) for d in A["demands"]}
    scenes, problems, n = [], [], 0
    done = []

    def add(kind, spec, vo, reveals, beat, visual, claims):
        nonlocal n
        n += 1
        ws = re.findall(r"[\w'’-]+[.,?!:]?", vo)
        for k, w in reveals:
            if not any(x == w or x.rstrip(".,?!:") == w.rstrip(".,?!:") for x in ws):
                problems.append(f"s{n:03d} ({beat}): reveal word {w!r} not in vo")
        scenes.append(dict(id=f"s{n:03d}", act=beat, kind=kind, spec=spec, vo=vo, reveals=[dict(key=k, word=w) for k, w in reveals],
                           transition="cut", visual=visual, beat=beat, claims=claims))

    credit = f"UPSC CSE (Main) {q['year']} · {q['label']} · Q{q['q']}" + (f"({q['part']})" if q["part"] else "")
    marks = f"{q['marks']} marks" + (f" · {q['words']} words" if q.get("words") else "")
    seen = set()
    for b in A["beats"]:
        k, vo, t = b["key"], b["say"], b["scene"]["type"]
        seen.update(b["claims"])
        if t == "question":
            spec = dict(credit=credit, marks=marks, text=q["text"])
            rv = []
            if k == A["beats"][0]["key"]:
                spec["glow"] = [dict(text=g, key=key) for g, key in P["glow"]]
                rv = [(key, P["glow_words"][key]) for _, key in P["glow"]]
            else:
                if P["strip"].get("topic"):
                    rows = list(csv.DictReader(open(os.path.join(MAIN, "research/upsc/_pyq/mains/questions.csv"), encoding="utf-8")))
                    yrs = sorted({r["year"] for r in rows}); hits = sorted({r["year"] for r in rows if P["strip"]["topic"] in (r["topic"], r.get("topic2", ""))})
                    word = toks(vo)[len(toks(vo)) // 2]
                else:
                    yrs, hits = year_strip(P["strip"]["term"]); word = P["strip"]["word"]
                spec["strip"] = dict(years=yrs, hits=hits, key="st", note=P["strip"]["note"])
                rv = [("st", word)]
            add("pyq_question", spec, vo, rv, k, b["scene"]["pic"], b["claims"])
        elif t == "xray":
            spec = dict(text=q["text"], directives=[dict(word=w, meaning=m, key=key) for w, m, key, _ in P["directives"]],
                        demands=[dict(id=d["id"], label=d["label"], key=d["id"].lower()) for d in demands])
            rv = [(key, word) for _, _, key, word in P["directives"]] + [(d["id"].lower(), P["demand_words"][d["id"]]) for d in demands]
            add("pyq_xray", spec, vo, rv, k, b["scene"]["pic"], b["claims"])
        elif t == "idea":
            ss = sentences(vo)
            for part in P["ideas"][k]:
                idx = part[0] if part[0] is not None else tuple(range(len(ss)))
                v = " ".join(ss[i] for i in idx)
                if part[1] in ("statement", "pyq_timeline", "pyq_card"):
                    kind, spec, rv = part[1], part[2], list(part[3].items())
                    if part[1] == "pyq_card": add(kind, spec, v, rv, k, b["scene"]["pic"], b["claims"]); continue
                    seen.update(b["claims"])   # number lock: figures typed in this plan must be in the claims of this beat or an earlier one
                    pool = " ".join(LED.get(c, "") for c in seen)
                    have = {x.replace(",", "").rstrip(".,") for x in re.findall(r"\d[\d,.]*", pool)}
                    def texts(o):
                        if isinstance(o, dict): return " ".join(texts(v) for kk, v in o.items() if kk != "key")
                        if isinstance(o, list): return " ".join(texts(v) for v in o)
                        return str(o) if isinstance(o, str) else ""
                    for x in re.findall(r"\d[\d,.]*", texts(spec)):
                        if x.replace(",", "").rstrip(".,") not in have:
                            problems.append(f"{k}: number {x} in the {kind} spec is not in the beat's claims")
                else:
                    kind, spec, rv = borrow(part[1], part[2], part[3])
                add(kind, spec, v, rv, k, b["scene"]["pic"], b["claims"])
        elif t == "sheet":
            a, z = P["sheet"][k]
            before, upto = sum(weights[:a]), sum(weights[:z + 1])
            new = [d for d, lb in last_block.items() if a <= lb <= z]
            spec = dict(blocks=blocks, **{"from": a, "to": z}, minutes=[round(A["minutes"] - usable * before / W, 3), round(A["minutes"] - usable * upto / W, 3)],
                        total=A["minutes"], words0=sum(nwords(x["text"]) for x in A["sheet"][:a] if x["kind"] != "diagram"),
                        budget=A["budget"][1], demands=demands, done0=list(done), done=new, start="w")
            done += new
            first = re.findall(r"[\w'’-]+[.,?!:]?", vo)[0]
            add("pyq_sheet", spec, vo, [("w", first)], k, b["scene"]["pic"], b["claims"])
        elif t == "compare":
            heads = [x["text"] for x in A["sheet"] if x["kind"] == "head"]
            weak = [dict(text=w["text"], miss=w["miss"], key=f"w{i + 1}") for i, w in enumerate(A["weak"])]
            ws = P["weak_words"]
            fig = next((x.get("label") for x in A["sheet"] if x["kind"] == "diagram" and x.get("label")), None)
            add("pyq_compare", dict(weak=weak, heads=heads, fig=fig, demands=demands, title_weak="THE EASY ANSWER (OURS, FOR COMPARISON)", title_good="ONE GOOD ANSWER"),
                vo, [(f"w{i + 1}", ws[i]) for i in range(len(weak))], k, b["scene"]["pic"], b["claims"])
        elif t == "cousins":
            cz = [dict(text=c, key=f"c{i + 1}") for i, c in enumerate(A["cousins"][:len(P["cousin_words"])])]
            add("pyq_cousins", dict(demands=demands, cousins=cz, next=dict(text=P["next"], key="nx"), title="SAME FRAME, OTHER YEARS"),
                vo, [(f"c{i + 1}", w) for i, w in enumerate(P["cousin_words"])] + [("nx", P["next_word"])], k, b["scene"]["pic"], b["claims"])
        else:
            problems.append(f"{k}: unknown scene type {t}")
    if " ".join(s["vo"] for s in scenes).split() != " ".join(b["say"] for b in A["beats"]).split():
        problems.append("storyboard vo is not word for word the answer module")
    out = os.path.join(UP, f"pyq-{vid}")
    os.makedirs(out, exist_ok=True)
    sb = os.path.join(out, "storyboard.json")
    json.dump(dict(id=f"pyq-{vid}", format="long-16x9", target_minutes=round(sum(len(b["say"].split()) for b in A["beats"]) / 150, 1), script=src, scenes=scenes),
              open(sb, "w"), indent=1, ensure_ascii=False)
    print(f"{len(scenes)} scenes -> {sb}")
    for p in problems:
        print("  PROBLEM", p)
    if problems:
        return 1
    r = subprocess.run([sys.executable, os.path.join(ROOT, "scripts/datayt/long_timeline.py"), sb, "--out", os.path.join(out, "timeline.json")], capture_output=True, text=True)
    print(r.stdout.strip()[-800:], r.stderr.strip()[-800:])
    return r.returncode


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Builds the storyboards of the two Namakkal films in the Kurz look:
  public/datayt/long/namakkal/A/storyboard.json   (Script A, The Paradox)
  public/datayt/long/namakkal/C/storyboard.json   (Script C, The Long Road)

  .venv/bin/python scripts/datayt/namakkal_storyboards.py [scripts_dir]

The narration is read from the approved script files (darwin-research, contentengine/youtube/namakkal_egg_city/scripts/A_PARADOX.md and
C_LONG_ROAD.md): each beat's SAY line with its claim tags removed. A beat may be split over several scenes; the pieces must join back to the
SAY line exactly, or the build stops. Every printed number is a FigRef into public/datayt/long/namakkal/figures.json (namakkal_figures.py).
Scene kinds and specs: src/looks/kurz/CONTRACT_KURZ.md. Then: long_timeline.py <storyboard> --out <dir>/timeline.json.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCRIPTS = sys.argv[1] if len(sys.argv) > 1 else "/Volumes/DarwinSSD/darwin-research/contentengine/youtube/namakkal_egg_city/scripts"
OUT = os.path.join(ROOT, "public/datayt/long/namakkal")


def beats(path):
    t = open(path).read()
    out = {}
    for m in re.finditer(r"\*\*([AC]\d+b?)\*\*[^\n]*\n((?:- [A-Z]+:[^\n]*\n)+)", t):
        say = re.search(r"- SAY: (.*)", m.group(2)).group(1)
        out[m.group(1)] = re.sub(r"\s*\[[^\]]*\]", "", say).strip()
    return out


class Board:
    def __init__(self, fid, src):
        self.fid, self.say, self.scenes, self.used = fid, beats(src), [], set()

    def add(self, beat, kind, spec, reveals=(), vo=None, act="", transition="cut", visual="", part=None):
        """vo=None takes the whole beat; otherwise vo is one piece of the beat, and the pieces are checked when the beat is closed."""
        n = len(self.scenes) + 1
        text = self.say[beat] if vo is None and beat else (vo or "")
        self.scenes.append({"id": f"{self.fid.lower()}{n:03d}", "beat": beat, "act": act, "kind": kind, "spec": spec, "vo": text,
                            "reveals": [dict(r) for r in reveals], "transition": transition, "visual": visual})
        if beat:
            self.used.add(beat)

    def check(self):
        for b, say in self.say.items():
            got = " ".join(s["vo"] for s in self.scenes if s["beat"] == b)
            if b not in self.used:
                sys.exit(f"{self.fid}: beat {b} has no scene")
            if got != say:
                sys.exit(f"{self.fid}: beat {b} pieces do not join to the script line:\n  script: {say}\n  scenes: {got}")
        for s in self.scenes:
            low = s["vo"].lower()
            for r in s["reveals"]:
                w = r["word"].lower()
                if not re.search(r"(?<![a-z])" + re.escape(w) + r"(?![a-z])", low):
                    sys.exit(f"{s['id']}: reveal word {r['word']!r} not in vo {s['vo']!r}")

    def write(self):
        self.check()
        for s in self.scenes:                    # a breath after every number (Story Engine T13), longer where the number lands late
            if s["reveals"] and s["kind"] in NUMBER_KINDS and "hold" not in s:
                s["hold"] = 1.0
        d = os.path.join(OUT, self.fid)
        os.makedirs(d, exist_ok=True)
        sb = {"id": f"namakkal-{self.fid}", "format": FORMATS[self.fid], "target_minutes": 7, "fps": 60, "brand": "indicaatlas", "scenes": self.scenes}
        json.dump(sb, open(os.path.join(d, "storyboard.json"), "w"), ensure_ascii=False, indent=1)
        kinds = {}
        for s in self.scenes:
            kinds[s["kind"]] = kinds.get(s["kind"], 0) + 1
        words = sum(len(s["vo"].split()) for s in self.scenes)
        print(f"{self.fid}: {len(self.scenes)} scenes, {words} words; kinds {kinds}")


NUMBER_KINDS = {"stage", "counter", "timeline", "bars", "seasons", "price-line", "share-map", "doc", "split"}
FORMATS = {"A": "F10 The Paradox + F5 own words (scripts/A_PARADOX.md)", "C": "F2 The Long Road, Bhagyaraj heart, Nolan hairpin (scripts/C_LONG_ROAD.md)"}


# ---- spec helpers -------------------------------------------------------------------------------------------------------------------------
def R(key, word, nth=None):
    r = {"key": key, "word": word}
    if nth:
        r["nth"] = nth
    return r


def num(key, t, s, state="Namakkal", dec=0, prefix="", suffix="", **kw):
    d = {"key": key, "ref": {"t": t, "state": state, "s": s}, "decimals": dec}
    if prefix:
        d["prefix"] = prefix
    if suffix:
        d["suffix"] = suffix
    d.update(kw)
    return d


def share(key, state, color, caption, bx, by):
    d = num(key, "nk_share25", "y2024_25", state=state, dec=2, color=color, caption=caption, bx=bx, by=by)
    d["state"] = state                       # ShareItem: the state to light (its FigRef carries the same state)
    return d


def actor(id_, who, x, y=900, h=420, **kw):
    return {"id": id_, "who": who, "x": x, "y": y, "h": h, **kw}


def prop(icon, x, y, s=1.0, **kw):
    return {"icon": icon, "x": x, "y": y, "s": s, **kw}


def pill(text, x=96, y=72, key=None):
    p = {"text": text, "x": x, "y": y}
    if key:
        p["key"] = key
    return p


RATE = num("rate", "nk_rate", "2026-10-29", dec=2, prefix="₹", caption="an egg · NECC suggested rate · 29 Oct 2026", x=1380, y=380, size=170)
HENS6 = [prop("deshen", 760 + i * 70, 880 - (i % 2) * 26, 0.9, seed=i, enter="hens") for i in range(6)]


def stage(set_, actors=(), props=(), badges=(), pills=(), **kw):
    return {"set": set_, "actors": list(actors), "props": list(props), "badges": list(badges), "pills": list(pills), **kw}


# ---- scenes shared by both films (same picture, the film's own words) ----------------------------------------------------------------------
def open_rate(b, beat, act):
    b.add(beat, "stage", stage("village", [actor("farmer", "farmer", 1560, h=440, flip=True)],
                               [prop("hen", 1080, 870, 1.2, enter="hen"), prop("hen", 1220, 900, 1.0, seed=2, enter="hen"), prop("egg", 900, 560, 1.7),
                                prop("ratesheet", 560, 520, 1.5, enter="sheet")],
                               [RATE], [pill("NAMAKKAL, TAMIL NADU", key="nk")], camera={"fx": 960, "fy": 600, "s0": 1.0, "s1": 1.08}),
          [R("sheet", "number"), R("hen", "farmers"), R("nk", "Namakkal"), R("rate", "five")], act=act,
          visual="Dawn over the village; the rate sheet unrolls; the ₹5.70 lands on 'five rupees seventy'.")


def map_namakkal(b, beat, act, title, pin_word, tn_word, vo=None):
    b.add(beat, "share-map", {"states": [], "lit": [{"state": "Tamil Nadu", "key": "tn", "color": "#F58A1F"}],
                              "pin": {"name": "Namakkal", "key": "pin", "label": "NAMAKKAL"}, "zoom": {"u": 352, "v": 900, "s": 2.6},
                              "title": title, "source": "nk_district"},
          [R("pin", pin_word), R("tn", tn_word)], vo=vo, act=act, visual="The globe gives way to India, then the camera falls into Tamil Nadu and the Namakkal pin pulses.")


def postmaster_1969(b, beat, act, vo=None):
    b.add(beat, "stage", stage("hospital", [actor("pm", "postmaster", 560, h=460, enter="pm"), actor("vet", "vet", 1460, h=470, flip=True)],
                               HENS6, [num("hens", "nk_story", "hens_1969", caption="red desi hens", x=1250, y=300, size=150)],
                               [pill("1969", key="yr"), pill("ILLUSTRATIVE", x=96, y=150)], tint="sepia"),
          [R("yr", "nineteen"), R("pm", "postmaster"), R("hens", "six")], vo=vo, act=act,
          visual="A sepia 1969 morning: the postmaster walks up to the veterinary hospital with six red hens in a basket.")


def vet_advice(b, beat, act, vo=None):
    b.add(beat, "stage", stage("hospital", [actor("pm", "postmaster", 480, h=440), actor("vet", "vet", 1000, h=470, pose="present")],
                               [prop("hen", 1380, 860, 1.2, enter="eggs"), prop("egg", 1520, 880, 0.8, enter="eggs"), prop("egg", 1600, 900, 0.8, enter="eggs")],
                               [], [pill("MORE EGGS", 1300, 200, "eggs"), pill("MORE MANURE", 1300, 290, "manure"), pill("MORE INCOME", 1300, 380, "income"),
                                    pill("ILLUSTRATIVE", x=96, y=72)], tint="sepia"),
          [R("eggs", "eggs"), R("manure", "manure"), R("income", "income")], vo=vo, act=act)


def drive_1970(b, beat, act, vo=None):
    b.add(beat, "stage", stage("road", [], [prop("car", 700, 820, 2.0, enter="car"), prop("chick", 1300, 880, 0.8, enter="chicks"),
                                            prop("chick", 1380, 900, 0.8, enter="chicks", seed=1), prop("chick", 1460, 880, 0.8, enter="chicks", seed=2)],
                               [num("chicks", "nk_story", "chicks_1970", caption="chicks", x=1400, y=330, size=160)],
                               [pill("1970", key="yr"), pill("COIMBATORE", 96, 150, "cbe"), pill("ILLUSTRATIVE", 96, 228)], tint="sepia"),
          [R("yr", "seventy"), R("car", "drove"), R("cbe", "Coimbatore"), R("chicks", "four")],
          vo=vo, act=act, visual="The vet's car on the Coimbatore road with four farmers; boxes of chicks on the way back.")


def sheds(b, beat, act, morning_word, vo=None):
    b.add(beat, "stage", stage("sheds", [actor("vet", "vet", 1500, h=440, enter="vet", flip=True)],
                               [prop("chick", 700 + i * 80, 900 - (i % 3) * 20, 0.7, seed=i) for i in range(8)],
                               [num("each", "nk_story", "chicks_each", caption="chicks in each shed", x=640, y=330, size=150)],
                               [pill("EVERY MORNING · FREE", 96, 72, "morning"), pill("ILLUSTRATIVE", 96, 150)], tint="sepia"),
          [R("each", "hundred"), R("vet", "vet"), R("morning", morning_word)], vo=vo, act=act)


def snub(b, beat, act, vo):
    b.add(beat, "stage", stage("market", [actor("trader", "trader", 1300, h=440, pose="refuse")],
                               [prop("crate", 560, 860, 1.4), prop("crate", 700, 880, 1.2, seed=1), prop("egg", 640, 720, 0.8)],
                               [], [pill("NOBODY WANTED THE EGGS", 96, 72, "snub"), pill("ILLUSTRATIVE", 96, 150)], tint="sepia"),
          [R("snub", vo.split()[-1].strip(".,"))], vo=vo, act=act, visual="A town market: crates of the new white eggs; the buyer shakes his head.")


def desi_quote(b, beat, act, vo, word):
    b.add(beat, "quote", {"quote": "consumers and restaurant owners preferred only desi chicken eggs", "who": "TANUVAS case study", "role": "2020",
                          "kind": "study", "key": "q"}, [R("q", word)], vo=vo, act=act)


def club(b, beat, act, word, vo=None):
    b.add(beat, "stage", stage("sheds", [actor("f1", "farmer", 420, h=400), actor("f2", "farmer2", 760, h=400, seed=1),
                                         actor("f3", "farmer", 1160, h=400, seed=2, flip=True), actor("f4", "farmer2", 1500, h=400, seed=3, flip=True)],
                               [prop("crate", 960, 900, 1.6, enter="club")], [], [pill("FARM CLUB", 96, 72, "club"), pill("ILLUSTRATIVE", 96, 150)], tint="sepia"),
          [R("club", word)], vo=vo, act=act, visual="Four farmers, four sheds; then one shared crate in the middle.")


def train_chennai(b, beat, act, vo=None):
    b.add(beat, "stage", stage("train", [], [prop("crate", 1450, 860, 1.2, seed=i) for i in range(1)],
                               [num("p22", "nk_story", "paise_chennai", suffix=" paise", caption="an egg, in Chennai", x=1380, y=320, size=150)],
                               [pill("TO CHENNAI, BY TRAIN", 96, 72, "chennai"), pill("ILLUSTRATIVE", 96, 150)], tint="sepia"),
          [R("chennai", "Chennai"), R("p22", "twenty")], vo=vo, act=act)


def hall_meetings(b, beat, act, vo):
    b.add(beat, "stage", stage("hall", [actor("crowd", "crowd", 960, h=380)], [],
                               [num("meet", "nk_story", "meetings", suffix="+", caption="meetings across India", x=1420, y=300, size=150)],
                               [pill("NECC'S OWN HISTORY", 96, 72), pill("ILLUSTRATIVE", 96, 150)], tint="warm"),
          [R("meet", "three")], vo=vo, act=act)


def slogan(b, beat, act, vo):
    b.add(beat, "quote", {"quote": "My egg, my price, my life", "who": "Dr B. V. Rao's call", "role": "NECC's own history", "kind": "slogan", "key": "q"},
          [R("q", "egg")], vo=vo, act=act)


def necc_1982(b, beat, act, word_assoc, vo=None):
    b.add(beat, "stage", stage("hall", [actor("crowd", "crowd", 960, h=360)], [prop("ratesheet", 1460, 560, 1.8, enter="sheet")], [],
                               [pill("NECC · 14 MAY 1982", 96, 72, "necc"), pill("A FARMERS' ASSOCIATION, NOT A GOVERNMENT BODY", 96, 150, "assoc")], tint="warm"),
          [R("necc", "fourteenth"), R("sheet", "declaring"), R("assoc", word_assoc)], vo=vo, act=act,
          visual="The first price is chalked up: NECC's board goes live on 14 May 1982.")


def van(b, beat, act, vo):
    b.add(beat, "stage", stage("road", [actor("trader", "trader", 1500, h=430, flip=True)], [prop("van", 680, 820, 2.0)],
                               [num("v19", "nk_story", "van_agreed", suffix=" paise", caption="agreed", x=520, y=300, size=110),
                                num("v15", "nk_story", "van_offer", suffix=" paise", caption="offered", x=960, y=300, size=110),
                                num("v17", "nk_story", "van_settled", suffix=" paise", caption="settled", x=1400, y=300, size=130)],
                               [pill("RECOLLECTION · P. K. VENKATACHALAM", 96, 72), pill("ILLUSTRATIVE", 96, 150)], tint="sepia"),
          [R("v19", "nineteen"), R("v15", "fifteen"), R("v17", "seventeen")], vo=vo, act=act)


def regulator(b, beat, act, vo=None):
    b.add(beat, "stage", stage("regulator", [actor("off", "official", 1400, h=440, flip=True)], [prop("doc", 700, 600, 1.6, enter="cases")], [],
                               [pill("COMPETITION COMMISSION OF INDIA", 96, 72, "cci"), pill("2017 · TWO COMPLAINTS", 96, 150, "cases")]),
          [R("cci", "Competition"), R("cases", "complaints")], vo=vo, act=act)


def order_115(b, beat, act, vo=None):
    b.add(beat, "doc", {"org": "Competition Commission of India", "doc": "Final order · 14 January 2022 · para 115", "quote": "the de facto price in the market",
                        "quoteKey": "q", "credit": "CCI ORDER, CASE NOS. 09 AND 36 OF 2017", "creditKey": "c", "label": "DRAWING, NOT THE ORDER'S PAGE"},
          [R("q", "de"), R("c", "because")], vo=vo, act=act)


def price_peak(b, beat, act, peak_word, peak_nth=None, vo=None):
    b.add(beat, "price-line", {"series": "jun_aug_2026", "y0": 5.0, "y1": 7.5, "ystep": 0.5, "drawKey": "pk", "band": {"value": "max", "key": "pk"},
                               "marks": [num("pk", "nk_rate", "peak_2026", dec=2, prefix="₹", at="max", caption="16–24 Jul 2026", color="#E03A3E")],
                               "title": "Namakkal, rupees an egg, Jun to Aug 2026", "source": "nk_rate"},
          [R("pk", peak_word, peak_nth)], vo=vo, act=act)


def price_fall(b, beat, act, end_word, fall_word=None, vo=None):
    marks = [num("pk", "nk_rate", "peak_2026", dec=2, prefix="₹", at="max", caption="16–24 Jul 2026", color="#E03A3E"),
             num("end", "nk_rate", "late_aug_2026", dec=2, prefix="₹", at="last", caption="from 22 Aug", side="above", dx=-100)]
    rev = [R("pk", vo.split()[0] if vo else b.say[beat].split()[0]), R("end", end_word)]
    if fall_word:
        marks.append(num("fall", "nk_rate", "fall_pct_2026", suffix="%", at="2026-08-01", caption="from the peak", side="left", dy=40, color="#E03A3E"))
        rev.append(R("fall", fall_word))
    b.add(beat, "price-line", {"series": "jun_aug_2026", "y0": 5.0, "y1": 7.5, "ystep": 0.5, "drawn": True, "band": {"value": "max", "key": "pk"},
                               "marks": marks, "title": "Namakkal, rupees an egg, Jun to Aug 2026", "source": "nk_rate"}, rev, vo=vo, act=act)


def exports(b, beat, act, avg_word, fall_word=None, vo=None):
    marks = [num("avg", "nk_exports", "avg_month_2025", state="India", dec=1, suffix=" crore", caption="eggs a month, 2025 average", line=True)]
    rev = [R("avg", avg_word)]
    if fall_word:
        marks += [num("jan", "nk_exports", "jan_2026", state="India", dec=1, suffix=" crore", at="2026-01", caption="Jan 2026"),
                  num("fall", "nk_exports", "fall_jan_mar_2026_pct", state="India", suffix="%", at="2026-03", caption="Jan → Mar 2026", color="#E03A3E")]
        rev += [R("jan", "Gulf") if "Gulf" in (vo or b.say[beat]) else R("jan", fall_word), R("fall", fall_word)]
    b.add(beat, "bars", {"series": "nk_exports_monthly", "from": "2023-01", "marks": marks, "title": "India's hen-egg exports, crore eggs a month",
                         "source": "nk_exports", "highlight": {"from": "2025-01", "to": "2025-12", "key": "avg", "label": "2025: a record year"}},
          rev, vo=vo, act=act)


def seasons(b, beat, act, grid_word, low_word, vo=None):
    b.add(beat, "seasons", {"series": "nk_monthly", "key": "grid", "lowKey": "low",
                            "count": num("low", "nk_seasons", "low_marapr", caption="years the cheapest month was March or April"),
                            "of": num("of", "nk_seasons", "years"), "source": "nk_seasons"},
          [R("grid", grid_word), R("low", low_word), R("of", low_word)], vo=vo, act=act,
          visual="Sixteen rows of twelve months; each year's cheapest month lights up, and the March-April column glows.")


def paise_to_rupees(b, beat, act, w22, w570, vo=None):
    b.add(beat, "counter", {"mode": "pair", "visual": "coins", "items": [
        num("p22", "nk_story", "paise_chennai", suffix=" paise", label="the club's first eggs, Chennai"),
        num("r570", "nk_rate", "2026-10-29", dec=2, prefix="₹", label="NECC's suggestion, 29 Oct 2026")],
        "note": "not adjusted for inflation", "source": "nk_story"}, [R("p22", w22), R("r570", w570)], vo=vo, act=act)


def chapter(b, n, title, icon, year=None):
    spec = {"n": n, "title": title, "icon": icon}
    if year:
        spec["year"] = year
    b.add(None, "chapter", spec, act=title, transition="wipe")


# ---- Film A: The Paradox ------------------------------------------------------------------------------------------------------------------
def film_a():
    b = Board("A", os.path.join(SCRIPTS, "A_PARADOX.md"))
    act = "Cold open"
    open_rate(b, "A01", act)
    b.add("A02", "share-map", {"states": [], "lit": [{"state": "Tamil Nadu", "key": "tn", "color": "#F58A1F"}, {"state": "Andhra Pradesh", "key": "ap", "color": "#2F6FDE"}],
                               "title": "INDIA'S EGG STATES", "source": "nk_share25"}, [R("tn", "Tamil"), R("ap", "biggest")], act=act)
    b.add("A03", "statement", {"lines": ["HOW DOES ONE CORNER", "OF THE *SECOND* STATE", "SET THE PRICE?"]}, act=act)
    b.add(None, "title", {"kicker": "INDICA ATLAS", "title": "The Egg City Isn't in the Top Egg State", "sub": "So who sets the price of an egg?"}, act=act)
    b.scenes[-1]["hold"] = 3.0                   # silent title card: 2.5 s minimum + 3 s to read
    chapter(b, 1, "The map", "globe")
    act = "The map"
    map_namakkal(b, "A11", act, "NAMAKKAL · PART OF SALEM UNTIL 1997", "Namakkal", "Tamil")
    b.add("A12", "counter", {"mode": "pair", "visual": "eggs", "items": [
        num("bn", "nk_india", "eggs_bn_2024_25", state="India", dec=2, suffix=" bn", label="eggs a year, India, 2024-25"),
        num("rank", "nk_india", "world_rank_2024", state="India", prefix="No. ", label="in the world, after China (FAOSTAT)")], "source": "nk_india"},
          [R("bn", "hundred"), R("rank", "second")], act=act)
    b.add("A13", "share-map", {"states": [
        share("tn", "Tamil Nadu", "#F58A1F", "Tamil Nadu · second", 380, 640), share("ap", "Andhra Pradesh", "#2F6FDE", "Andhra Pradesh · first", 1480, 520)],
        "title": "SHARE OF INDIA'S EGGS, 2024-25", "source": "nk_share25"}, [R("ap", "Andhra"), R("tn", "Tamil")], act=act)
    b.add("A13b", "counter", {"mode": "compare", "visual": "eggs", "items": [
        num("tn", "nk_district", "share_tn_2022_23", suffix="%", label="of Tamil Nadu's eggs"),
        num("in", "nk_district", "share_india_2022_23", dec=1, suffix="%", label="of India's eggs")], "note": "Namakkal district, 2022-23", "source": "nk_district"},
          [R("tn", "two"), R("in", "ten")], act=act)
    b.add("A14", "statement", {"lines": ["ONE EGG IN TEN", "DOES NOT SET THE PRICE", "FOR THE OTHER *NINE*"]}, act=act)
    chapter(b, 2, "Six hens", "hen", "1969")
    act = "Six hens"
    postmaster_1969(b, "A21", act)
    vet_advice(b, "A22", act)
    drive_1970(b, "A23", act)
    sheds(b, "A24", act, "morning")
    snub(b, "A25", act, "The hens grew, and began to lay. And then the real problem: nobody wanted their eggs.")
    desi_quote(b, "A25", act, "The study says consumers and restaurant owners wanted only desi eggs.", "consumers")
    club(b, "A26", act, "club")
    train_chennai(b, "A27", act)
    b.add("A28", "timeline", {"points": [num("b82", "nk_story", "birds_1982", label="1982"), num("b85", "nk_story", "birds_1985", label="1985")],
                              "unit": "lakh birds", "pins": [{"key": "col", "label": "VETERINARY COLLEGE, NAMAKKAL · 14 JUN 1985", "at": "1985"}],
                              "title": "BIRDS AROUND NAMAKKAL", "source": "nk_story"},
          [R("b82", "thirty"), R("b85", "seventy"), R("col", "college")], act=act)
    chapter(b, 3, "The committee", "ratesheet", "1982")
    act = "The committee"
    b.add("A31", "statement", {"lines": ["EGGS DO NOT WAIT.", "TOO MANY AT ONCE,", "AND THE *PRICE FALLS*."]}, act=act)
    b.add("A32", "counter", {"mode": "trio", "visual": "crates", "items": [
        num("feed", "nk_story", "feed_rise_pct", prefix="+", suffix="%", label="feed, in five years"),
        num("egg", "nk_story", "paise_1981", suffix=" paise", label="an egg"),
        num("out", "nk_story", "stopped_pct", suffix="%", label="of poultry farmers had stopped")], "note": "c. 1981 · NECC's own account", "source": "nk_story"},
          [R("feed", "two"), R("egg", "thirty"), R("out", "forty")], act=act)
    say = b.say["A33"]
    i = say.index(" Their slogan")
    hall_meetings(b, "A33", act, say[:i])
    slogan(b, "A33", act, say[i + 1:])
    necc_1982(b, "A34", act, "association")
    van(b, "A35", act, b.say["A35"])
    b.add("A36", "statement", {"lines": ["NOT THE MOST EGGS.", "THE FIRST TO SAY", "A *PRICE* OUT LOUD."]}, act=act)
    chapter(b, 4, "The regulator", "doc", "2022")
    act = "The regulator"
    regulator(b, "A41", act)
    order_115(b, "A42", act)
    b.add("A43", "statement", {"lines": ["1970: NOBODY WANTED THEIR EGGS.", "2022: NOBODY ELSE *NAMED A PRICE*."]}, act=act)
    b.add("A44", "doc", {"org": "Competition Commission of India", "doc": "Final order · paras 208-209", "quote": "only suggestive", "quoteKey": "q",
                         "credit": "NO MORE THREATS · PRICES \"ONLY SUGGESTIVE\"", "creditKey": "c", "label": "DRAWING, NOT THE ORDER'S PAGE"},
          [R("c", "threat"), R("q", "suggestive")], act=act)
    b.add("A45", "statement", {"lines": ["NO FINE.", "APPEAL: *DISMISSED*, 2022.", "SUPREME COURT: PENDING."]}, act=act)
    chapter(b, 5, "The suggestion today", "egg", "2026")
    act = "The suggestion today"
    price_peak(b, "A51", act, "six", 2)
    price_fall(b, "A52", act, "rupees", "quarter")
    exports(b, "A52b", act, "eighteen", "seven")
    seasons(b, "A53", act, "every", "thirteen")
    paise_to_rupees(b, "A54", act, "twenty", "five")
    act = "End"
    b.add("A61", "statement", {"lines": ["SECOND IN EGGS.", "THE PRICE THE TRADE *READS FIRST*."]}, act=act, transition="wipe")
    b.add("A62", "split", {"left": {"set": "village", "caption": "Tomorrow morning: a new number"},
                           "right": {"set": "ratesheet", "caption": "NECC rate sheet"},
                           "disclaimer": "merely suggestive and not mandatory", "discKey": "d"}, [R("d", "suggestive")], act=act)
    b.write()


# ---- Film C: The Long Road ----------------------------------------------------------------------------------------------------------------
def film_c():
    b = Board("C", os.path.join(SCRIPTS, "C_LONG_ROAD.md"))
    act = "Cold open"
    open_rate(b, "C01", act)
    b.add("C02", "stage", stage("hospital", [actor("pm", "postmaster", 700, h=460, enter="pm")], HENS6, [], [pill("1969"), pill("ILLUSTRATIVE", 96, 150)], tint="sepia"),
          [R("pm", "postmaster"), R("hens", "six")], act=act, transition="wipe", visual="The rate sheet's morning dissolves to a sepia morning in 1969.")
    b.add("C03", "title", {"kicker": "INDICA ATLAS", "title": "Six Hens Nobody Wanted", "sub": "How a postmaster and a vet built India's egg city",
                           "steps": [{"text": "TRY 1", "key": "t"}, {"text": "TRY 2", "key": "t"}, {"text": "TRY 3", "key": "t"}, {"text": "TRY 4", "key": "t"}]},
          [R("t", "four")], act=act)
    chapter(b, 1, "Try one: six hens", "hen", "1969")
    act = "Try one"
    map_namakkal(b, "C11", act, "NAMAKKAL · PART OF SALEM UNTIL 1997", "Namakkal", "Tamil")
    postmaster_1969(b, "C12", act)
    b.add("C13", "stage", stage("hospital", [], [prop("deshen", 860, 860, 1.6), prop("egg", 1080, 900, 0.7, enter="few")], [],
                                [pill("HARDY", 1300, 260, "hardy"), pill("FEW EGGS", 1300, 350, "few"), pill("ILLUSTRATIVE", 96, 72)], tint="sepia"),
          [R("hardy", "hardy"), R("few", "few")], act=act)
    vet_advice(b, "C14", act)
    chapter(b, 2, "Try two: the chicks", "chick", "1970")
    act = "Try two"
    drive_1970(b, "C21", act)
    sheds(b, "C22", act, "morning")
    say = b.say["C23"]
    i = say.index(" Consumers")
    snub(b, "C23", act, say[:i])
    desi_quote(b, "C23", act, say[i + 1:], "Consumers")
    b.add("C24", "stage", stage("sheds", [actor("f1", "farmer", 420, h=400), actor("f2", "farmer2", 760, h=400, seed=1),
                                          actor("f3", "farmer", 1160, h=400, seed=2, flip=True), actor("f4", "farmer2", 1500, h=400, seed=3, flip=True)],
                                [prop("crate", 420 + i * 360, 920, 0.9, seed=i) for i in range(4)], [],
                                [pill("SELL ALONE?", 96, 72, "alone"), pill("OR TOGETHER?", 96, 150, "tog"), pill("ILLUSTRATIVE", 96, 228)], tint="sepia"),
          [R("alone", "alone"), R("tog", "together")], act=act)
    club(b, "C25", act, "club")
    train_chennai(b, "C26", act)
    chapter(b, 3, "Try three: the boom", "hen", "1975")
    act = "Try three"
    b.add("C31", "timeline", {"points": [num("b75", "nk_story", "birds_1975", label="1975-76"), num("b78", "nk_story", "birds_1978", label="1978-79"),
                                         num("b82", "nk_story", "birds_1982", label="1982-83")], "unit": "lakh birds", "title": "BIRDS AROUND NAMAKKAL",
                              "source": "nk_story"}, [R("b75", "three"), R("b78", "twelve"), R("b82", "thirty")], act=act)
    b.add("C32", "statement", {"lines": ["MORE HENS, MORE EGGS.", "TOO MANY AT ONCE,", "AND THE *PRICE FALLS*."]}, act=act)
    b.add("C33", "counter", {"mode": "trio", "visual": "crates", "items": [
        num("feed", "nk_story", "feed_rise_pct", prefix="+", suffix="%", label="feed, in five years"),
        num("egg", "nk_story", "paise_1981", suffix=" paise", label="an egg"),
        num("out", "nk_story", "stopped_pct", suffix="%", label="of poultry farmers had stopped")], "note": "c. 1981 · NECC's own account", "source": "nk_story"},
          [R("feed", "two"), R("egg", "thirty"), R("out", "forty")], act=act)
    b.add("C34", "statement", {"lines": ["THE CLUB COULD SELL EGGS.", "IT COULD NOT *STOP THE FALL*."]}, act=act)
    chapter(b, 4, "Try four: the price", "ratesheet", "1982")
    act = "Try four"
    van(b, "C41", act, b.say["C41"])
    b.add("C42", "stage", stage("hall", [actor("crowd", "crowd", 960, h=380)], [], [],
                                [pill("NAMAKKAL COMMITTEE", 96, 72, "nk"), pill("HYDERABAD", 1300, 220, "hy"), pill("CHITTOOR", 1300, 300, "ch"),
                                 pill("PUNE", 1300, 380, "pu"), pill("RECOLLECTION · P. K. VENKATACHALAM", 96, 150)], tint="warm"),
          [R("nk", "Namakkal"), R("hy", "Hyderabad"), R("ch", "Chittoor"), R("pu", "Pune")], act=act)
    say = b.say["C43"]
    i = say.index(" with one slogan")
    hall_meetings(b, "C43", act, say[:i])
    slogan(b, "C43", act, say[i + 1:])
    necc_1982(b, "C44", act, "association")
    b.add("C45", "timeline", {"points": [num("b75", "nk_story", "birds_1975", label="1975-76", shown=True), num("b78", "nk_story", "birds_1978", label="1978-79", shown=True),
                                         num("b82", "nk_story", "birds_1982", label="1982-83", shown=True), num("b85", "nk_story", "birds_1985", label="1985")],
                              "unit": "lakh birds", "pins": [{"key": "col", "label": "VETERINARY COLLEGE, NAMAKKAL · 14 JUN 1985", "at": "1985"}],
                              "title": "BIRDS AROUND NAMAKKAL", "source": "nk_story"}, [R("b85", "seventy"), R("col", "college")], act=act)
    chapter(b, 5, "The price of a price", "doc", "2022")
    act = "The price of a price"
    regulator(b, "C51", act)
    order_115(b, "C52", act)
    b.add("C53", "statement", {"lines": ["NO MORE THREATS.", "PRICES: *ONLY SUGGESTIVE*.", "NO FINE · APPEAL DISMISSED", "SUPREME COURT: PENDING"]}, act=act)
    chapter(b, 6, "The road today", "egg", "2026")
    act = "Today"
    b.add("C60", "counter", {"mode": "compare", "visual": "eggs", "items": [
        num("cd", "nk_district", "crore_day_2022_23", dec=1, suffix=" crore", label="eggs a day, Namakkal"),
        num("tn", "nk_district", "share_tn_2022_23", suffix="%", label="of Tamil Nadu's eggs")], "note": "Tamil Nadu's own count, 2022-23", "source": "nk_district"},
          [R("cd", "four"), R("tn", "two")], act=act)
    exports(b, "C60b", act, "eighteen")
    say = b.say["C61"]
    i = say.index(" and Namakkal's rate")
    exports(b, "C61", act, "Eggs", "seven", vo=say[:i])
    b.add("C61", "price-line", {"series": "feb_apr_2026", "y0": 3.5, "y1": 5.5, "ystep": 0.5, "drawKey": "low",
                                "marks": [num("low", "nk_rate", "mar_low_2026", dec=2, prefix="₹", at="min", caption="27–29 Mar 2026", side="left", color="#E03A3E")],
                                "title": "Namakkal, rupees an egg, Feb to Apr 2026", "source": "nk_rate"}, [R("low", "three")], vo=say[i + 1:], act=act)
    b.add("C62", "price-line", {"series": "jun_aug_2026", "y0": 5.0, "y1": 7.5, "ystep": 0.5, "drawKey": "pk", "band": {"value": "max", "key": "pk"},
                                "marks": [num("pk", "nk_rate", "peak_2026", dec=2, prefix="₹", at="max", caption="16–24 Jul 2026", color="#E03A3E"),
                                          num("end", "nk_rate", "late_aug_2026", dec=2, prefix="₹", at="last", caption="from 22 Aug", side="above", dx=-100)],
                                "title": "Namakkal, rupees an egg, Jun to Aug 2026", "source": "nk_rate"}, [R("pk", "six"), R("end", "five")], act=act)
    seasons(b, "C63", act, "thirteen", "March")
    act = "End"
    paise_to_rupees(b, "C71", act, "twenty", "five")
    b.add("C72", "split", {"left": {"set": "sheds", "caption": "1970 · every morning, the vet", "tint": "sepia"},
                           "right": {"set": "ratesheet", "caption": "2026 · every morning, a number"},
                           "disclaimer": "merely suggestive and not mandatory", "discKey": "d"}, [R("d", "suggestion")], act=act)
    b.write()


if __name__ == "__main__":
    film_a()
    film_c()

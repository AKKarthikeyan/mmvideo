#!/usr/bin/env python3
"""Data Kadai: draft a batch of Short scripts from the verified NFHS-6 state table, for AK's review.

Picks stories from public/datayt/nfhs6/shorts_catalog.csv (scored by nfhs6_shorts.py) plus the stories already in
docs/datakadai/ops/QUEUE.md, re-reads every number from public/datayt/nfhs6/nfhs6_states.json, and writes
  docs/datakadai/scripts/<batch>.md      one block per script: title, on-screen hook, narration, numbers, checks
  public/datayt/scripts/<batch>.json     the same, structured, for the video and chart builders
Nothing is voiced, rendered or posted. Run from the repo root: python3 scripts/datayt/make_scripts.py [batch-001] [100]

Rules enforced here (see .claude/agents/dk-planner.md): `*` and `( )` cells never used; Lakshadweep out of rankings;
a "#1" or "biggest" claim needs a lead of at least MIN_LEAD over the next state, otherwise the story is dropped.
"""
import csv, json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from nfhs6_meta import META, SHORT_NAME, SOUTH

RAW = json.load(open("public/datayt/nfhs6/nfhs6_states.json"))["states"]
SOURCE = "NFHS-6 (2023-24), IIPS · state fact sheets"
SKIP_RANK = {"India", "Lakshadweep"}
UTS = {"Andaman and Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Jammu and Kashmir", "Ladakh",
       "Lakshadweep", "NCT of Delhi", "Puducherry"}
STATES = [s for s in RAW if s not in SKIP_RANK]
MIN_LEAD = 1.0          # points (0.1 for the fertility rate)
SPOKEN = {"Jammu and Kashmir": "Jammu and Kashmir", "Dadra & Nagar Haveli and Daman & Diu": "Dadra, Nagar Haveli, Daman and Diu",
          "NCT of Delhi": "Delhi", "Andaman and Nicobar Islands": "Andaman and Nicobar"}
# Well-known states for quiz decoys: a viewer could plausibly guess any of them.
DECOY_POOL = ["Kerala", "Bihar", "Uttar Pradesh", "Goa", "Punjab", "Tamil Nadu", "Maharashtra", "Gujarat", "West Bengal",
              "Rajasthan", "Karnataka", "Telangana", "Haryana", "Madhya Pradesh", "Odisha", "Assam", "NCT of Delhi"]

# id: (clause with {v}, noun phrase, who is counted). Wording follows the fact-sheet indicator; the basis is shown
# on screen under the chart. Age groups follow the NFHS fact-sheet definitions and are re-checked at review.
P = {
    2: ("{v} of people are under 15", "people under 15", "household population"),
    3: ("{v} of people are 60 or older", "people aged 60 or older", "household population"),
    5: ("{v} of homes have an improved drinking-water source", "homes with an improved drinking-water source", "households"),
    7: ("{v} of homes have someone covered by health insurance", "homes with health insurance", "households"),
    9: ("{v} of women and girls have ever been to school", "women and girls who have been to school", "females age 6+"),
    10: ("{v} of homes have a woman who owns a house or land", "homes where a woman owns a house or land", "households"),
    11: ("{v} of children aged 2 to 4 go to pre-school", "young children in pre-school", "children age 2-4"),
    12: ("{v} of women have 10 or more years of schooling", "women with 10 or more years of schooling", "women age 15-49"),
    13: ("{v} of men have 10 or more years of schooling", "men with 10 or more years of schooling", "men age 15-49"),
    14: ("{v} of women have used the internet", "women who have used the internet", "women age 15-49"),
    15: ("{v} of men have used the internet", "men who have used the internet", "men age 15-49"),
    16: ("{v} of young women were married before 18", "young women married before 18", "women age 20-24"),
    17: ("{v} of young men were married before 21", "young men married before 21", "men age 25-29"),
    18: ("the average woman has {v} children", "children per woman", "total fertility rate"),
    19: ("{v} of girls aged 15 to 19 are already mothers or pregnant", "teenage girls who are already mothers or pregnant", "women age 15-19"),
    20: ("{v} of married women use a family planning method", "married women using family planning", "currently married women 15-49"),
    23: ("{v} of married women have been sterilised", "married women who have been sterilised", "currently married women 15-49"),
    24: ("{v} of couples rely on male sterilisation", "couples relying on male sterilisation", "currently married women 15-49"),
    35: ("{v} of babies are born in a hospital or health centre", "babies born in a hospital or health centre", "births in the last 5 years"),
    36: ("{v} of babies are born in a government facility", "babies born in a government facility", "births in the last 5 years"),
    38: ("{v} of babies are delivered by C-section", "C-section births", "births in the last 5 years"),
    39: ("{v} of private-hospital births are C-sections", "C-sections in private hospitals", "births in private facilities"),
    40: ("{v} of government-hospital births are C-sections", "C-sections in government hospitals", "births in public facilities"),
    44: ("{v} of toddlers are fully vaccinated", "fully vaccinated toddlers", "children age 12-23 months"),
    56: ("{v} of children got most of their vaccines at a private clinic", "children vaccinated at private clinics", "children age 12-23 months"),
    62: ("{v} of babies under 6 months are exclusively breastfed", "babies who are exclusively breastfed", "children under 6 months"),
    68: ("{v} of babies aged 6 to 23 months get an adequate diet", "babies who get an adequate diet", "children age 6-23 months"),
    69: ("{v} of children under 5 are stunted, too short for their age", "stunted children", "children under 5"),
    70: ("{v} of children under 5 are wasted, too thin for their height", "wasted children", "children under 5"),
    72: ("{v} of children under 5 are underweight", "underweight children", "children under 5"),
    73: ("{v} of children under 5 are overweight", "overweight children", "children under 5"),
    74: ("{v} of women are underweight", "underweight women", "women age 15-49"),
    75: ("{v} of men are underweight", "underweight men", "men age 15-49"),
    76: ("{v} of women are overweight or obese", "overweight or obese women", "women age 15-49"),
    77: ("{v} of men are overweight or obese", "overweight or obese men", "men age 15-49"),
    80: ("{v} of women have high blood sugar or take medicine for it", "women with high blood sugar", "women age 15+"),
    83: ("{v} of men have high blood sugar or take medicine for it", "men with high blood sugar", "men age 15+"),
    86: ("{v} of women have high blood pressure or take medicine for it", "women with high blood pressure", "women age 15+"),
    89: ("{v} of men have high blood pressure or take medicine for it", "men with high blood pressure", "men age 15+"),
    90: ("{v} of married women take part in household decisions", "married women who take part in household decisions", "currently married women 15-49"),
    91: ("{v} of women worked in the past year and were paid in cash", "women paid in cash for work", "women age 15-49"),
    92: ("{v} of women have a bank account they use themselves", "women with their own bank account", "women age 15-49"),
    93: ("{v} of women have a mobile phone they use themselves", "women with their own mobile phone", "women age 15-49"),
    94: ("{v} of young women use hygienic period protection", "young women using hygienic period protection", "women age 15-24"),
    95: ("{v} of married women have faced violence from their husband", "married women who have faced spousal violence", "ever-married women 18-49"),
    98: ("{v} of women use tobacco", "women who use tobacco", "women age 15+"),
    99: ("{v} of men use tobacco", "men who use tobacco", "men age 15+"),
    100: ("{v} of women drink alcohol", "women who drink alcohol", "women age 15+"),
    101: ("{v} of men drink alcohol", "men who drink alcohol", "men age 15+"),
}
SENSITIVE = {95, 96, 97, 16, 19}      # neutral wording, no jokes, no "wins"
VIOLENCE = {95, 96, 97}               # never a guessing game or a head-to-head
BIG_SWING = 25                        # a 4-year change this large gets a "re-check the fact sheet" flag


def num(x):
    s = str(x).strip()
    if s.startswith("(") or s in ("*", "na", "-", ""):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def val(st, k, col=2):
    r = RAW.get(st, {}).get(str(k))
    return num(r[col]) if r else None


def table(k, col=2, states=None):
    return sorted([(val(s, k, col), s) for s in (states or STATES) if val(s, k, col) is not None], reverse=True)


nm = lambda s: SHORT_NAME.get(s, s)                 # on screen
say = lambda s: SPOKEN.get(s, s)                    # narration
lead_ok = lambda a, b, k: abs(a - b) >= (0.1 if k == 18 else MIN_LEAD)
scr = lambda v, k: f"{v:g}" if k == 18 else f"{v:g}%"                 # on screen
spk = lambda v, k: f"{v:g}" if k == 18 else f"{v:g} percent"          # narration
kind = lambda s: "union territory" if s in UTS else "state"

FRACS = [(1, 10), (1, 8), (1, 6), (1, 5), (1, 4), (3, 10), (1, 3), (2, 5), (1, 2), (3, 5), (2, 3), (7, 10), (3, 4), (4, 5), (9, 10)]


def frac(v):
    """'nearly 1 in 4' style phrase when the value sits within 1.5 points of a simple fraction, else None."""
    for a, b in FRACS:
        t = 100 * a / b
        if abs(v - t) <= 1.5:
            pre = "nearly " if v < t - 0.4 else "more than " if v > t + 0.4 else ""
            return f"{pre}{'half' if (a, b) == (1, 2) else f'{a} in {b}'}"
    return None


def clause(k, v, spoken=True, use_frac=False):
    c = P[k][0]
    if k == 18:
        return c.format(v=f"{v:g}")
    f = frac(v) if use_frac else None
    if f and c.startswith("{v} of "):
        rest = c[len("{v} of "):]
        return f"{f} of {rest}" if f.endswith("half") else f"{f} {rest}"
    return c.format(v=spk(v, k) if spoken else scr(v, k))


def times(v, base):
    r = v / base if base else 0
    if r < 1.5:
        return None
    return "Twice" if 1.95 <= r < 2.05 else f"{r:.0f} times" if r >= 10 else f"{r:.1f} times"


def words(lines):
    return sum(len(re.findall(r"[\w'%.-]+", t)) for t in lines.values())


def decoys(k, answer, top3):
    """Two well-known states that are not in the top 3 (or bottom 3), spread across the ranking."""
    pool = [s for s in DECOY_POOL if s != answer and s not in top3 and val(s, k) is not None]
    pool.sort(key=lambda s: (hash((k, s)) % 97))
    return pool[:2]


# ---- one generator per series; each returns a script dict or None when a rule fails ----------------------------

def gts(k, side="top", states_only=False, hook=None, dec=None, sid=None, status="new"):
    st = [s for s in STATES if not (states_only and s in UTS)]
    t = table(k, states=st)
    if side == "bottom":
        t = t[::-1]
    (v, a), (v2, b) = t[0], t[1]
    if not lead_ok(v, v2, k):
        return None
    india = val("India", k)
    d = dec or decoys(k, a, {x[1] for x in t[:3]})
    scope = "Of 28 states, in one" if states_only else ("In one state" if a not in UTS else "In one part of India")
    hk = hook or f"{scope}, {clause(k, v, use_frac=True)}."
    tm = times(v, india) if side == "top" else None
    lines = {
        "hook": hk,
        "quiz": f"Which {'state' if a not in UTS else 'one'}? {say(d[0])}, {say(a)}, or {say(d[1])}?",
        "reveal": f"It's {say(a)}!",
        "fill": f"{spk(v, k)}." if k != 18 else f"{v:g} children per woman.",
        "hold": f"{tm} India's {spk(india, k)}." if tm else f"The India average is {spk(india, k)}.",
        "top": (f"Second is {say(b)}, far behind at {spk(v2, k)}." if abs(v - v2) >= 10 else f"Next is {say(b)}, at {spk(v2, k)}."),
        "end": "Where does your state rank? Tell us in the comments.",
    }
    word = ("highest" if side == "top" else "lowest")
    return dict(series="GUESS THE STATE", template="IndiaShort (ready)", ind=k, status=status, config_id=sid,
                title=f"Guess the state: {P[k][1]} 🗺️", screen=[hk, "Which state?", f"A · B · C  (3-2-1)", f"{nm(a)}: {scr(v, k)}", f"India: {scr(india, k)}"],
                vo=lines, numbers={nm(a): v, nm(b): v2, "India": india}, lead=round(abs(v - v2), 1),
                config=dict(ind=k, answer=a, decoys=d, side=side, **({"states_only": True} if states_only else {})),
                note=f"{word} of {len(t)} ranked; lead over #2 {abs(v - v2):.1f} points", states=[a])


def ranked(k):
    t = table(k)
    if len(t) < 10 or not lead_ok(t[0][0], t[1][0], k):
        return None
    india = val("India", k); top = t[:5]; last = t[-1]
    n = P[k][1]
    lines = {
        "hook": f"Which state has the highest share of {n}? Here's the top five.",
        "five": f"Number five: {say(top[4][1])}, {spk(top[4][0], k)}.",
        "four": f"Four: {say(top[3][1])}, {spk(top[3][0], k)}.",
        "three": f"Three: {say(top[2][1])}, {spk(top[2][0], k)}.",
        "two": f"Two: {say(top[1][1])}, {spk(top[1][0], k)}.",
        "one": f"And number one: {say(top[0][1])}, at {spk(top[0][0], k)}.",
        "context": f"India's average is {spk(india, k)}. Lowest of all: {say(last[1])}, {spk(last[0], k)}.",
        "end": "Is your state on the list? Comment below.",
    }
    return dict(series="RANKED", template="Top 10 countdown (to build)", ind=k, status="new",
                title=f"Top 5 states: {n}", screen=[f"Highest share: {n}", "Bars 10 → 1, voice from 5", f"#1 {nm(top[0][1])} {scr(top[0][0], k)}",
                                                    f"India {scr(india, k)} · lowest {nm(last[1])} {scr(last[0], k)}"],
                vo=lines, numbers={**{nm(s): v for v, s in t[:10]}, "India": india, f"{nm(last[1])} (last)": last[0]},
                lead=round(t[0][0] - t[1][0], 1), note=f"{len(t)} ranked; lead over #2 {t[0][0] - t[1][0]:.1f} points", states=[top[0][1]])


def then_now(k):
    ch = sorted([(val(s, k) - val(s, k, 3), s) for s in STATES if val(s, k) is not None and val(s, k, 3) is not None])
    if len(ch) < 10:
        return None
    up, up2, dn = ch[-1], ch[-2], ch[0]
    riser = abs(up[0]) >= abs(dn[0])
    mv, other = (up, up2) if riser else (dn, ch[1])
    s = mv[1]; a, b = val(s, k, 3), val(s, k); ia, ib = val("India", k, 3), val("India", k)
    if ia is None or ib is None or abs(mv[0]) < 8:
        return None
    biggest = lead_ok(mv[0], other[0], k)
    opp = dn if riser else up
    opp_moves = (opp[0] < -1) if riser else (opp[0] > 1)
    n = P[k][1]
    lines = {
        "hook": f"{say(s)}, in the 2019 to 21 survey: {clause(k, a)}.",
        "now": f"Four years later? {spk(b, k)}.",
        "claim": (f"That's the biggest {'jump' if riser else 'fall'} of any state." if biggest else
                  f"That's one of the biggest {'jumps' if riser else 'falls'} in the country."),
        "india": f"India as a whole went from {spk(ia, k)} to {spk(ib, k)}.",
        "twist": (f"And {say(opp[1])} went the other way: {spk(val(opp[1], k, 3), k)} to {spk(val(opp[1], k), k)}." if opp_moves else
                  f"Next biggest: {say(other[1])}, {spk(val(other[1], k, 3), k)} to {spk(val(other[1], k), k)}."),
        "end": "How has your state changed? Comment below.",
    }
    return dict(series="THEN vs NOW", template="Before/after bars (to build)", ind=k, status="new",
                title=f"{nm(s)} in 4 years: {scr(a, k)} → {scr(b, k)}", screen=[f"{nm(s)} · {n}", f"2019-21: {scr(a, k)}", f"2023-24: {scr(b, k)}",
                                                                              f"India {scr(ia, k)} → {scr(ib, k)}"],
                vo=lines, numbers={f"{nm(s)} NFHS-5": a, f"{nm(s)} NFHS-6": b, "India NFHS-5": ia, "India NFHS-6": ib,
                                   f"{nm(opp[1] if opp_moves else other[1])} NFHS-5": val(opp[1] if opp_moves else other[1], k, 3),
                                   f"{nm(opp[1] if opp_moves else other[1])} NFHS-6": val(opp[1] if opp_moves else other[1], k)},
                lead=round(abs(mv[0] - other[0]), 1), note=f"change {mv[0]:+.1f} points; next {other[0]:+.1f}" +
                (" · **unusually large 4-year change: re-check both fact sheets before use**" if abs(mv[0]) >= BIG_SWING else ""), states=[s])


def vs(k, a, b):
    va, vb = val(a, k), val(b, k)
    if va is None or vb is None or abs(va - vb) < 5 or k in VIOLENCE:
        return None
    hi, lo = (a, b) if va > vb else (b, a); vh, vl = max(va, vb), min(va, vb); india = val("India", k)
    n = P[k][1]; r = vh / vl if vl else 0
    gap = (f"That's {r:.0f} times higher." if r >= 3 else f"That's {r:.1f} times higher." if r >= 1.5 else f"A gap of {vh - vl:.1f} points.")
    lines = {
        "hook": f"{say(a)} versus {say(b)}. Which has the higher share of {n}?",
        "pause": "Lock in your guess.",
        "reveal": f"{say(hi)}: {spk(vh, k)}.",
        "other": f"{say(lo)}: just {spk(vl, k)}." if r >= 1.5 and k not in SENSITIVE else f"{say(lo)}: {spk(vl, k)}.",
        "gap": gap,
        "india": f"The India average is {spk(india, k)}.",
        "end": "Which two states should we compare next?",
    }
    return dict(series="STATE vs STATE", template="Split screen (to build)", ind=k, status="new",
                title=f"{nm(a)} vs {nm(b)}: {n}", screen=[f"{nm(a)} vs {nm(b)}", n, f"{nm(hi)} {scr(vh, k)}", f"{nm(lo)} {scr(vl, k)}", f"India {scr(india, k)}"],
                vo=lines, numbers={nm(a): va, nm(b): vb, "India": india}, lead=round(vh - vl, 1), note=f"gap {vh - vl:.1f} points", states=[a, b])


def south(k):
    sv = table(k, states=SOUTH)
    if len(sv) < 5 or not lead_ok(sv[0][0], sv[1][0], k):
        return None
    india = val("India", k); n = P[k][1]
    mid = ", ".join(f"{say(s)} {v:g}" for v, s in sv[1:-1])
    tn = next((i for i, x in enumerate(sv) if x[1] == "Tamil Nadu"), None)
    lines = {
        "hook": f"South India, ranked: {n}.",
        "top": f"Number one: {say(sv[0][1])}, at {spk(sv[0][0], k)}.",
        "middle": f"Then {mid}.",
        "last": f"Lowest: {say(sv[-1][1])}, at {spk(sv[-1][0], k)}.",
        "india": f"The all-India figure is {spk(india, k)}.",
        "end": "Did your state surprise you? Comment below.",
    }
    return dict(series="SOUTH LEAGUE", template="Bar race (to build)", ind=k, status="new",
                title=f"South India ranked: {n}", screen=[f"South India · {n}"] + [f"{i + 1}. {nm(s)} {scr(v, k)}" for i, (v, s) in enumerate(sv)] + [f"India {scr(india, k)}"],
                vo=lines, numbers={**{nm(s): v for v, s in sv}, "India": india}, lead=round(sv[0][0] - sv[1][0], 1),
                note=f"{len(sv)} southern states/UTs; Tamil Nadu is #{tn + 1 if tn is not None else '-'}", states=[sv[0][1]])


def paradox(s, g, b):
    def place(k):
        t = table(k); names = [x[1] for x in t]
        if s not in names:
            return None
        r = names.index(s)
        if r == 0 and lead_ok(t[0][0], t[1][0], k):
            return "number one in India", t
        if r < 3 and lead_ok(t[r][0], t[3][0], k):
            return "in India's top three", t
        return None
    pg, pb = place(g), place(b)
    if not pg or not pb:
        return None
    vg, vb = val(s, g), val(s, b); ig, ib = val("India", g), val("India", b)
    both_one = pg[0] == pb[0] == "number one in India"
    lines = {
        "hook": (f"{say(s)} is number one in India for two very different things." if both_one else
                 f"{say(s)} is near the very top in India for two very different things."),
        "good": f"One: {P[g][1]}. {spk(vg, g)}, {pg[0]}. The India average is {spk(ig, g)}.",
        "bad": f"Two: {P[b][1]}. {spk(vb, b)}, {pb[0]}. The India average is {spk(ib, b)}.",
        "line": "The same place, high on both lists.",
        "end": f"Does that match the {say(s)} you know? Comment below.",
    }
    return dict(series="PARADOX", template="Two rank ladders (to build)", ind=g, ind2=b, status="new",
                title=f"{nm(s)}: high on two opposite lists", screen=[f"{nm(s)} · two lists", f"{P[g][1]}: {scr(vg, g)} (India {scr(ig, g)})",
                                                                     f"{P[b][1]}: {scr(vb, b)} (India {scr(ib, b)})"],
                vo=lines, numbers={f"{nm(s)} · {P[g][1]}": vg, f"India · {P[g][1]}": ig, f"{nm(s)} · {P[b][1]}": vb, f"India · {P[b][1]}": ib,
                                   **{f"top 4 · {P[k][1]} · {nm(x[1])}": x[0] for k, t in ((g, pg[1]), (b, pb[1])) for x in t[:4] if x[1] != s}},
                lead=None, note=f"{P[g][1]}: {pg[0]}; {P[b][1]}: {pb[0]} (rank claims hold with the minimum lead)", states=[s])


GENDER = [(14, 15, "have used the internet"), (12, 13, "have 10 or more years of schooling"), (76, 77, "are overweight or obese"),
          (80, 83, "have high blood sugar"), (86, 89, "have high blood pressure"), (98, 99, "use tobacco"), (100, 101, "drink alcohol"),
          (74, 75, "are underweight")]


def gender(wk, mk, phrase):
    rows = [(val(s, wk), val(s, mk), s) for s in STATES if val(s, wk) is not None and val(s, mk) is not None]
    if len(rows) < 25:
        return None
    w_more = [r for r in rows if r[0] > r[1]]; n_all = len(rows)
    iw, im = val("India", wk), val("India", mk)
    big = max(rows, key=lambda r: abs(r[0] - r[1])); bw, bm, bs = big
    minority = w_more if len(w_more) <= n_all / 2 else [r for r in rows if r[0] <= r[1]]
    women_lead_most = len(w_more) > n_all / 2
    lines = {
        "hook": f"Women or men: who is more likely to {phrase.replace('have ', 'have ', 1).replace('are ', 'be ', 1)} in India?",
        "india": f"Across India: women {spk(iw, wk)}, men {spk(im, mk)}.",
        "count": (f"Women are ahead in {len(w_more)} of {n_all} states and union territories." if women_lead_most else
                  f"Men are ahead in {n_all - len(w_more)} of {n_all} states and union territories."),
        "gap": f"The widest gap is in {say(bs)}: women {spk(bw, wk)}, men {spk(bm, mk)}.",
        "end": "Did you guess right? Tell us in the comments.",
    }
    if 0 < len(minority) <= 3:
        lines["twist"] = "The exception" + ("s" if len(minority) > 1 else "") + ": " + ", ".join(say(r[2]) for r in minority) + "."
        lines = {k_: lines[k_] for k_ in ("hook", "india", "count", "twist", "gap", "end")}
    return dict(series="WOMEN vs MEN", template="Icon array (to build)", ind=wk, ind2=mk, status="new",
                title=f"Women vs men: who is more likely to {phrase.replace('are ', 'be ', 1)}?"[:70],
                screen=[f"Women vs men · {phrase}", f"India: women {scr(iw, wk)} · men {scr(im, mk)}",
                        f"Women ahead in {len(w_more)} of {n_all}", f"Widest gap: {nm(bs)} {scr(bw, wk)} vs {scr(bm, mk)}"],
                vo=lines, numbers={"India women": iw, "India men": im, f"{nm(bs)} women": bw, f"{nm(bs)} men": bm, "states where women are ahead": len(w_more),
                                   "states compared": n_all}, lead=round(abs(bw - bm), 1), note=f"{n_all} states/UTs with both values", states=[bs])


def trend(k):
    a, b = val("India", k, 3), val("India", k); d = META[k][2]
    if a is None or b is None or abs(b - a) < 2:
        return None
    ch = sorted([(val(s, k) - val(s, k, 3), s) for s in STATES if val(s, k) is not None and val(s, k, 3) is not None])
    up = b > a
    same_dir = [c for c in ch if (c[0] > 0) == up and c[0] != 0]
    worst = ch[-1] if up else ch[0]
    n = P[k][1]; verdict = "" if d == 0 else (" That's the wrong direction." if (b - a) * d < 0 else " That's progress.")
    lines = {
        "hook": f"In just four years, India changed on this: {n}.",
        "then": f"2019 to 21: {spk(a, k)}.",
        "now": f"2023 to 24: {spk(b, k)}.{verdict}",
        "spread": f"{len(same_dir)} of {len(ch)} states and union territories moved the same way.",
        "worst": f"The biggest change: {say(worst[1])}, from {spk(val(worst[1], k, 3), k)} to {spk(val(worst[1], k), k)}.",
        "end": "What's driving it? Tell us what you think.",
    }
    return dict(series="THEN vs NOW · INDIA", template="National line + map (to build)", ind=k, status="new",
                title=f"India in 4 years: {n} {scr(a, k)} → {scr(b, k)}"[:72], screen=[f"India · {n}", f"2019-21 {scr(a, k)}", f"2023-24 {scr(b, k)}",
                                                                                 f"{len(same_dir)} of {len(ch)} moved the same way", f"{nm(worst[1])} {scr(val(worst[1], k, 3), k)} → {scr(val(worst[1], k), k)}"],
                vo=lines, numbers={"India NFHS-5": a, "India NFHS-6": b, f"{nm(worst[1])} NFHS-5": val(worst[1], k, 3), f"{nm(worst[1])} NFHS-6": val(worst[1], k),
                                   "states moving the same way": len(same_dir), "states compared": len(ch)}, lead=round(abs(b - a), 1),
                note=f"India change {b - a:+.1f} points" + (" · **unusually large state change: re-check both fact sheets**"
                                                            if abs(worst[0]) >= BIG_SWING else ""), states=[worst[1]])


def report(s):
    recs = []
    for k in P:
        t = table(k)
        if len(t) < 25 or k in SENSITIVE:
            continue
        names = [x[1] for x in t]
        if names[0] == s and lead_ok(t[0][0], t[1][0], k):
            recs.append((META[k][3], k, "highest", t[0][0]))
        elif names[-1] == s and lead_ok(t[-1][0], t[-2][0], k):
            recs.append((META[k][3], k, "lowest", t[-1][0]))
    seen, pick = set(), []
    for r in sorted(recs, reverse=True):
        if META[r[1]][1] not in seen:
            pick.append(r); seen.add(META[r[1]][1])
    if len(pick) < 3:
        return None
    pick = pick[:4]
    lines = {"hook": f"{say(s)} holds {len(pick)} national records. How many can you guess?"}
    for i, (_, k, w, v) in enumerate(pick):
        lines[f"rec{i + 1}"] = f"{['One', 'Two', 'Three', 'Four'][i]}: the {w} share of {P[k][1]}, {spk(v, k)}." if k != 18 else \
            f"{['One', 'Two', 'Three', 'Four'][i]}: the {w} fertility rate, {v:g} children per woman."
    lines["end"] = f"Which one surprised you? Comment below."
    return dict(series="STATE REPORT CARD", template="Rapid cards (to build)", ind=pick[0][1], status="new",
                title=f"{nm(s)}: {len(pick)} national records", screen=[f"{nm(s)} · {len(pick)} records"] + [f"{w.title()}: {P[k][1]} {scr(v, k)}" for _, k, w, v in pick],
                vo=lines, numbers={f"{w} · {P[k][1]}": v for _, k, w, v in pick}, lead=None,
                note="each record leads the next state by the minimum margin; sensitive indicators left out", states=[s])


# ---- selection -------------------------------------------------------------------------------------------------
QUOTA = [("GUESS THE STATE", 24), ("RANKED", 16), ("THEN vs NOW", 14), ("STATE vs STATE", 14), ("SOUTH LEAGUE", 8), ("PARADOX", 7),
         ("WOMEN vs MEN", 6), ("THEN vs NOW · INDIA", 5), ("STATE REPORT CARD", 6)]
# Stories already in docs/datakadai/ops/QUEUE.md, in queue order (gts11 is on hold there: lead too thin).
QUEUE = [("gts01", 10, "top", False, "In one state, 2 in 3 homes have a woman who owns a house or land.", ["Kerala", "Goa"]),
         ("gts02", 100, "top", False, "In one state, nearly 1 in 4 women drink alcohol.", ["Goa", "Kerala"]),
         ("gts03", 99, "top", False, "In one state, nearly 3 in 4 men use tobacco.", ["Bihar", "Uttar Pradesh"]),
         ("gts05", 18, "bottom", True, "Of 28 states, in one the average woman has just 1 child.", ["Kerala", "Goa"]),
         ("gts06", 24, "top", False, "The state where men get sterilised.", ["Kerala", "Tamil Nadu"]),
         ("gts07", 39, "top", False, "9 in 10 private-hospital births here are C-sections.", ["Telangana", "Kerala"]),
         ("gts08", 17, "top", False, "3 in 10 men here marry before 21.", ["Rajasthan", "Uttar Pradesh"]),
         ("gts04", 98, "top", False, "Here, 6 in 10 women use tobacco.", ["Tripura", "Bihar"]),
         ("gts09", 16, "top", False, "Child-marriage number one isn't Bihar. Guess it.", ["Bihar", "Rajasthan"]),
         ("gts10", 38, "top", False, "6 in 10 births here are C-sections. Guess the state.", ["Kerala", "Tamil Nadu"]),
         ("gts12", 76, "top", False, "Half the women here are overweight.", ["Punjab", "Kerala"]),
         ("gts13", 19, "top", False, "18 percent of teenage girls here are already mothers or pregnant.", ["Bihar", "Jharkhand"]),
         ("gts14", 3, "top", False, "The state with India's oldest population.", ["Goa", "Himachal Pradesh"]),
         ("gts15", 35, "bottom", False, "Only 6 in 10 babies here are born in a hospital or health centre.", ["Bihar", "Jharkhand"])]


def candidates():
    """Every script that passes its rules, per series, best first."""
    out = {name: [] for name, _ in QUOTA}
    cat = list(csv.DictReader(open("public/datayt/nfhs6/shorts_catalog.csv")))
    done_gts = set()
    for sid, k, side, so, hook, dec in QUEUE:
        s = gts(k, side, so, hook, dec, sid, "in queue")
        if s:
            out["GUESS THE STATE"].append((99, s)); done_gts.add((k, side))
    for r in cat:
        key, sc = r["key"], float(r["score"]); p_ = key.split("-")
        try:
            if p_[0] == "C" and (int(p_[1]), p_[2]) not in done_gts and int(p_[1]) in P and int(p_[1]) not in VIOLENCE:
                s = gts(int(p_[1]), p_[2]); name = "GUESS THE STATE"
            elif p_[0] == "A" and int(p_[1]) in P:
                s = ranked(int(p_[1])); name = "RANKED"
            elif p_[0] == "B" and int(p_[1]) in P:
                s = then_now(int(p_[1])); name = "THEN vs NOW"
            elif p_[0] == "D" and int(p_[-1]) in P:
                s = vs(int(p_[-1]), *r["states"].split("; ")); name = "STATE vs STATE"
            elif p_[0] == "K" and int(p_[1]) in P:
                s = south(int(p_[1])); name = "SOUTH LEAGUE"
            elif p_[0] == "G" and int(p_[-1]) in P and int(p_[-2]) in P:
                s = paradox(r["states"], int(p_[-2]), int(p_[-1])); name = "PARADOX"
            elif p_[0] == "H" and int(p_[1]) in P:
                s = trend(int(p_[1])); name = "THEN vs NOW · INDIA"
            elif p_[0] == "I":
                s = report(r["states"]); name = "STATE REPORT CARD"
            else:
                continue
        except (ValueError, KeyError, IndexError):
            continue
        if s:
            out[name].append((sc, s))
    # extra Guess the State stories: any hook-worthy indicator whose #1 leads clearly, beyond the catalog's outliers
    for k in P:
        for side in ("top",):
            if (k, side) in done_gts or META[k][3] < 3 or k in VIOLENCE or any(c[1]["ind"] == k for c in out["GUESS THE STATE"]):
                continue
            s = gts(k, side)
            if s and s["lead"] >= 2:
                out["GUESS THE STATE"].append((META[k][3] * 2 + min(3, s["lead"] / 5), s))
    for wk, mk, ph in GENDER:
        s = gender(wk, mk, ph)
        if s:
            out["WOMEN vs MEN"].append((META[wk][3] * 2 + min(3, s["lead"] / 10), s))
    for k in P:      # national trends in either direction, not only "got worse"
        if not any(c[1]["ind"] == k for c in out["THEN vs NOW · INDIA"]):
            s = trend(k)
            if s:
                out["THEN vs NOW · INDIA"].append((META[k][3] * 2 + min(3, s["lead"] / 4), s))
    return {n: sorted(v, key=lambda x: -x[0]) for n, v in out.items()}


def select(total):
    cand = candidates(); picked = []; used_ind, used_state = {}, {}
    quota = dict(QUOTA); scale = total / sum(quota.values())
    spare = []
    for name, _ in QUOTA:
        want = round(quota[name] * scale); got = 0; seen_ind = {}; seen_state = set()
        for sc, s in cand[name]:
            inds = [s["ind"]] + ([s["ind2"]] if s.get("ind2") else [])
            st = s["states"][0]
            cap_i = 1 if name in ("GUESS THE STATE", "RANKED", "SOUTH LEAGUE", "THEN vs NOW", "THEN vs NOW · INDIA") else 2
            if name in ("PARADOX", "STATE REPORT CARD") and st in seen_state:
                continue                                    # one per state, never as a top-up either
            g_cap = 99 if name == "WOMEN vs MEN" else 4
            if any(seen_ind.get(i, 0) >= cap_i for i in inds) or any(used_ind.get(i, 0) >= g_cap for i in inds) or used_state.get(st, 0) >= 7:
                if name not in ("PARADOX", "STATE REPORT CARD"):
                    spare.append((sc, name, s))
                continue
            if got >= want:
                if name not in ("PARADOX", "STATE REPORT CARD"):
                    spare.append((sc, name, s))
                continue
            picked.append(s); got += 1; seen_state.add(st)
            for i in inds:
                seen_ind[i] = seen_ind.get(i, 0) + 1; used_ind[i] = used_ind.get(i, 0) + 1
            used_state[st] = used_state.get(st, 0) + 1
    have = {json.dumps(s["vo"], sort_keys=True) for s in picked}
    for sc, name, s in sorted(spare, key=lambda x: -x[0]):      # top up if a series ran short
        if len(picked) >= total:
            break
        n_series = sum(1 for x in picked if x["series"] == name)
        if json.dumps(s["vo"], sort_keys=True) not in have and n_series < quota[name] * scale * 1.3 + 1:
            picked.append(s); have.add(json.dumps(s["vo"], sort_keys=True))
    return picked[:total]


def main():
    batch = sys.argv[1] if len(sys.argv) > 1 else "batch-001"
    total = int(sys.argv[2]) if len(sys.argv) > 2 else 100
    picked = select(total)
    order = {n: i for i, (n, _) in enumerate(QUOTA)}
    picked.sort(key=lambda s: order[s["series"]])
    os.makedirs("docs/datakadai/scripts", exist_ok=True); os.makedirs("public/datayt/scripts", exist_ok=True)
    md = [f"# Data Kadai scripts: {batch} ({len(picked)} drafts for AK's review)", "",
          "Status: **DRAFT, not voiced, not rendered, not posted.** Every number below was read by code from",
          "`public/datayt/nfhs6/nfhs6_states.json` (NFHS-6, 2023-24). Mark each script ✅ keep, ✏️ edit or ❌ drop.", "",
          "- Narration voice: MiniMax English_Diligent_Man. Lengths are rough estimates (gts01 came out at 35.5 s);",
          "  the real length is set by the music grid when the video is built.",
          "- A `#1` or `biggest` line is only written when the lead over the next state is at least 1 point.",
          "- `( )` and `*` small-sample cells and Lakshadweep are never used.",
          "- \"Counted\" is who the percentage is out of. It goes on screen under the chart. Age groups follow the NFHS",
          "  fact-sheet definitions and must be confirmed against the NFHS-6 sheet before a video is made.",
          "- Template \"ready\" means the video can be built today; \"to build\" means the animation still has to be written.", ""]
    counts = {}
    for s in picked:
        counts[s["series"]] = counts.get(s["series"], 0) + 1
    md += ["| Series | Scripts | Video template |", "| --- | --- | --- |"]
    for n, _ in QUOTA:
        if counts.get(n):
            md.append(f"| {n} | {counts[n]} | {next(s['template'] for s in picked if s['series'] == n)} |")
    md.append("")
    cur = None
    for i, s in enumerate(picked, 1):
        s["id"] = f"S{i:03d}"; s["words"] = words(s["vo"]); s["est_sec"] = 35.0 if s["series"] == "GUESS THE STATE" else round(s["words"] / 2.3 + 0.7 * len(s["vo"]) + 2, 1)
        s["source"] = SOURCE; s["counted"] = P[s["ind"]][2] + (f" / {P[s['ind2']][2]}" if s.get("ind2") else "")
        if s["series"] != cur:
            cur = s["series"]; md += [f"## {cur}", ""]
        md += [f"### {s['id']} · {s['title']}",
               f"- [ ] Review · indicator {s['ind']}{' + ' + str(s['ind2']) if s.get('ind2') else ''} ({META[s['ind']][0]}) · "
               f"{s['words']} words, about {s['est_sec']:.0f} s · {s['status']}{' as `' + s['config_id'] + '`' if s.get('config_id') else ''}",
               f"- Counted: {s['counted']} · Check: {s['note']}" + (" · **sensitive topic: neutral wording**" if s["ind"] in SENSITIVE or s.get("ind2") in SENSITIVE else ""),
               f"- On screen: " + " → ".join(s["screen"]), "", "| Beat | Narration |", "| --- | --- |"]
        md += [f"| {k} | {t} |" for k, t in s["vo"].items()]
        md += ["", "Numbers: " + " · ".join(f"{k} {v:g}" for k, v in s["numbers"].items() if v is not None), ""]
    open(f"docs/datakadai/scripts/{batch}.md", "w").write("\n".join(md))
    json.dump({"batch": batch, "source": SOURCE, "status": "draft", "scripts": picked}, open(f"public/datayt/scripts/{batch}.json", "w"), indent=1, ensure_ascii=False)
    print(f"{batch}: {len(picked)} scripts ·", ", ".join(f"{n} {c}" for n, c in counts.items()))
    w = [s["words"] for s in picked]; print(f"words min {min(w)} max {max(w)} · est seconds min {min(s['est_sec'] for s in picked)} max {max(s['est_sec'] for s in picked)}")


if __name__ == "__main__":
    main()

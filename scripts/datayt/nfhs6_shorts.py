#!/usr/bin/env python3
"""Data YT: every NFHS-6 Shorts idea, counted and scored.

Reads public/datayt/nfhs6/nfhs6_states.json ({state: {indicator id: [urban, rural, total, nfhs5_total]}}) and writes
  public/datayt/nfhs6/shorts_catalog.csv  every candidate that clears its format's bar, scored and ranked
  docs/DATAYT_SHORTS_PLAN.md               raw permutation counts, filtered counts, top picks with hooks
Run from the repo root: python3 scripts/datayt/nfhs6_shorts.py
"""
import csv, json, math, os, sys, itertools
sys.path.insert(0, os.path.dirname(__file__))
from nfhs6_meta import META, GENDER_PAIRS, RIVALS, SOUTH, SHORT_NAME

RAW = json.load(open("public/datayt/nfhs6/nfhs6_states.json"))
# Lakshadweep (tiny sample, ~65k people) and starred/bracketed cells are kept out of rankings
SKIP_RANK = {"India", "Lakshadweep"}


def num(x):
    s = str(x).strip()
    if s.startswith("(") or s in ("*", "na", "-", ""):
        return None            # () = 25-49 unweighted cases, * = <25 cases: not reliable for a ranking
    try:
        return float(s)
    except ValueError:
        return None


def val(st, k, col=2):
    r = RAW.get(st, {}).get(str(k))
    return num(r[col]) if r else None


STATES = [s for s in RAW if s not in SKIP_RANK]
nm = lambda s: SHORT_NAME.get(s, s)
INDIA = lambda k: val("India", k)


def p(v, k):
    return f"{v:.1f}" if k == 18 else f"{v:.1f}%"


def table(k, col=2):
    return sorted([(val(s, k, col), s) for s in STATES if val(s, k, col) is not None], reverse=True)


ideas = []


SMALL_UT = {"Chandigarh", "Puducherry", "Dadra & Nagar Haveli and Daman & Diu", "Ladakh", "Andaman and Nicobar Islands"}


def add(fmt_, score, title, hook, beats, keys, ind=None, states=()):
    if states and states[0] in SMALL_UT:
        score -= 1.0           # small samples: still usable, but noisier and smaller audiences
    ideas.append({"format": fmt_, "score": round(score, 2), "title": title, "hook": hook, "beats": beats,
                  "indicator": ind, "topic": META[ind][1] if ind else "", "states": "; ".join(states), "key": keys})


raw_counts = {}
n_ind, n_st = len(META), len(STATES)

# A. Countdown: top 10 states for one indicator ------------------------------------------------------------
raw_counts["A. Countdown (indicator, top 10)"] = n_ind
for k, (lab, top, d, h) in META.items():
    t = table(k)
    if len(t) < 10:
        continue
    hi, lo = t[0], t[-1]
    spread = (hi[0] - lo[0]) / (abs(INDIA(k) or hi[0]) + 1)
    score = h * 2 + min(3, spread * 2)
    add("A Countdown", score, f"Top 10 states: {lab}",
        f"Which Indian state has the most {lab.lower()}? #1 is {p(hi[0], k)}.",
        f"10→1 bar countdown; India avg {p(INDIA(k), k)}; reveal #1 {nm(hi[1])}; flash last place {nm(lo[1])} {p(lo[0], k)}",
        f"A-{k}", k, (hi[1],))

# B. Movers: biggest rise and fall since NFHS-5 ----------------------------------------------------------
raw_counts["B. Biggest movers since NFHS-5 (indicator)"] = n_ind
for k, (lab, top, d, h) in META.items():
    ch = [(val(s, k) - val(s, k, 3), s) for s in STATES if val(s, k) is not None and val(s, k, 3) is not None]
    if len(ch) < 10:
        continue
    ch.sort()
    up, dn = ch[-1], ch[0]
    big = max(abs(up[0]), abs(dn[0]))
    score = h * 2 + min(3, big / 6)
    add("B Movers", score, f"Who changed most in 4 years: {lab}",
        (f"{nm(up[1])}: {lab.lower()} went {p(val(up[1], k, 3), k)} → {p(val(up[1], k), k)} in 4 years. "
         f"{nm(dn[1])} went the other way: {p(val(dn[1], k, 3), k)} → {p(val(dn[1], k), k)}."),
        f"before/after bars for 5 risers + 5 fallers; biggest faller {nm(dn[1])} {p(val(dn[1], k, 3), k)} → {p(val(dn[1], k), k)}",
        f"B-{k}", k, (up[1], dn[1]))

# C. Outlier: one state far ahead of everyone (#1 vs #2 gap) -----------------------------------------------
raw_counts["C. Lone outlier (indicator x state)"] = n_ind * n_st
for k, (lab, top, d, h) in META.items():
    t = table(k)
    if len(t) < 10:
        continue
    vals = [v for v, _ in t]
    mu = sum(vals) / len(vals); sd = math.sqrt(sum((v - mu) ** 2 for v in vals) / len(vals)) or 1
    for side, (a, b) in (("top", (t[0], t[1])), ("bottom", (t[-1], t[-2]))):
        gap = abs(a[0] - b[0]) / sd
        z = abs(a[0] - mu) / sd
        if gap < 0.9 or z < 1.8:
            continue
        score = h * 2 + min(3, gap * 1.2) + (0.5 if side == "top" else 0)
        word = "highest" if side == "top" else "lowest"
        add("C Outlier", score, f"Guess the state: India's {word} {lab.lower()}",
            (f"One state is way off the chart on {lab.lower()}: {p(a[0], k)}. Next closest: {p(b[0], k)}. Guess it."
             if side == "top" else f"Every state has {lab.lower()} above {p(b[0], k)}. Except one: {p(a[0], k)}. Guess it."),
            f"quiz: 3 options, 3-second timer, reveal {nm(a[1])}; India avg {p(INDIA(k), k)}", f"C-{k}-{side}", k, (a[1],))

# D. Rivals: state vs state on one indicator --------------------------------------------------------------
raw_counts["D. Head-to-head (all state pairs x indicator)"] = math.comb(n_st, 2) * n_ind
for a, b in RIVALS:
    if a not in STATES or b not in STATES:
        continue
    for k, (lab, top, d, h) in META.items():
        va, vb = val(a, k), val(b, k)
        if va is None or vb is None or h < 2:
            continue
        rel = abs(va - vb) / (max(va, vb) + 1)
        if rel < 0.35 or abs(va - vb) < 5:
            continue
        w = a if va > vb else b
        score = h * 1.7 + min(3, rel * 4) + (0.6 if "Tamil Nadu" in (a, b) else 0)
        add("D Rivals", score, f"{nm(a)} vs {nm(b)}: {lab}",
            f"{nm(a)} {p(va, k)} vs {nm(b)} {p(vb, k)}: {lab.lower()}. Guess who wins.",
            f"split screen, bars race up, {nm(w)} wins; India avg {p(INDIA(k), k)}; end: 'Which state should we compare next?'",
            f"D-{a}-{b}-{k}", k, (a, b))

# E. Gender gap inside a state --------------------------------------------------------------------------
raw_counts["E. Women vs men (gender pair x state)"] = len(GENDER_PAIRS) * n_st
for wk, mk, phrase in GENDER_PAIRS:
    for s in STATES:
        w, m = val(s, wk), val(s, mk)
        if w is None or m is None:
            continue
        flip = (w > m) and phrase in ("internet use", "10+ years of school", "alcohol", "tobacco", "overweight/obese",
                                      "high blood sugar", "high blood pressure")
        ratio = (max(w, m) + 0.5) / (min(w, m) + 0.5)
        if not flip and ratio < 3:
            continue
        score = 4 + (2.5 if flip else 0) + min(2, math.log(ratio))
        lead = "Women" if w > m else "Men"
        add("E Gender", score, f"{nm(s)}: women vs men, {phrase}",
            f"In {nm(s)}, {lead.lower()} beat {('men' if lead == 'Women' else 'women')} on {phrase}: {w:.1f}% women vs {m:.1f}% men.",
            "two-person icon array filling up, then India's gap for contrast", f"E-{s}-{wk}", wk, (s,))

# F. Urban vs rural flip -------------------------------------------------------------------------------
raw_counts["F. Village vs city (indicator x state)"] = n_ind * n_st
CITY_THINGS = {14, 15, 76, 77, 80, 83, 86, 89, 38, 39, 12, 13, 93}
for k, (lab, top, d, h) in META.items():
    if h < 2:
        continue
    for s in STATES:
        u, r = val(s, k, 0), val(s, k, 1)
        if u is None or r is None:
            continue
        flip = k in CITY_THINGS and r > u + 2
        gap = abs(u - r)
        if not flip and gap < 15:
            continue
        score = h * 1.5 + (2.5 if flip else 0) + min(2.5, gap / 10)
        add("F Village vs city", score, f"{nm(s)}: villages vs cities, {lab}",
            f"In {nm(s)}, {lab.lower()} is {p(r, k)} in villages and {p(u, k)} in cities. {'Villages win.' if flip else ''}".strip(),
            "map pin city vs village, two bars, then India's split", f"F-{s}-{k}", k, (s,))

# G. Paradox: same state top-3 in a good thing and top-3 in a bad thing -------------------------------------
goods = [k for k, m in META.items() if m[2] == 1 and m[3] >= 2]
bads = [k for k, m in META.items() if m[2] == -1 and m[3] >= 2]
raw_counts["G. Paradox (state x good indicator x bad indicator)"] = n_st * len([k for k in META if META[k][2] == 1]) * \
    len([k for k in META if META[k][2] == -1])
rank = {k: [s for _, s in table(k)] for k in META}
for s in STATES:
    best = []
    for g in goods:
        for b in bads:
            if META[g][1] == META[b][1]:
                continue
            rg, rb = rank[g].index(s) if s in rank[g] else 99, rank[b].index(s) if s in rank[b] else 99
            if rg < 3 and rb < 3:
                best.append((META[g][3] + META[b][3] - (rg + rb) * 0.4, g, b, rg, rb))
    for sc, g, b, rg, rb in sorted(best, reverse=True)[:3]:
        add("G Paradox", 3 + sc, f"{nm(s)}: #{rg + 1} for {META[g][0].lower()}, #{rb + 1} for {META[b][0].lower()}",
            f"{nm(s)} is India's #{rg + 1} for {META[g][0].lower()}… and #{rb + 1} for {META[b][0].lower()}.",
            f"two rank ladders side by side; {p(val(s, g), g)} vs {p(val(s, b), b)}", f"G-{s}-{g}-{b}", g, (s,))

# H. India got worse --------------------------------------------------------------------------------------
raw_counts["H. India got worse (indicator)"] = n_ind
for k, (lab, top, d, h) in META.items():
    a, b = val("India", k, 3), val("India", k)
    if a is None or b is None or d == 0:
        continue
    worse = (b - a) * d < 0
    if not worse or abs(b - a) < 1.5:
        continue
    n_worse = sum(1 for s in STATES if val(s, k) is not None and val(s, k, 3) is not None and (val(s, k) - val(s, k, 3)) * d < 0)
    add("H Got worse", h * 2 + min(3, abs(b - a) / 2), f"India got worse: {lab}",
        f"In 4 years, {lab.lower()} went from {p(a, k)} to {p(b, k)} across India. {n_worse} states got worse.",
        "national line up/down, then the worst 5 states light up on a map", f"H-{k}", k)

# I. State report card -------------------------------------------------------------------------------------
raw_counts["I. State report card (state)"] = n_st
for s in STATES:
    ext = []
    for k, (lab, top, d, h) in META.items():
        if s in rank[k] and h >= 2 and len(rank[k]) >= 20:
            r = rank[k].index(s)
            if r == 0 or r == len(rank[k]) - 1:
                ext.append((h, k, "#1" if r == 0 else "last"))
    if len(ext) >= 3:
        ext.sort(reverse=True)
        bits = "; ".join(f"{e[2]} {META[e[1]][0].lower()}" for e in ext[:5])
        add("I Report card", 4 + min(4, len(ext) * 0.6), f"{nm(s)}: 5 records nobody talks about",
            f"{nm(s)} ranks {ext[0][2]} in India for {META[ext[0][1]][0].lower()}. That's not even the strangest one.",
            f"5 rapid cards: {bits}", f"I-{s}", ext[0][1], (s,))

# K. South India league -------------------------------------------------------------------------------------
raw_counts["K. South India league (indicator)"] = n_ind
for k, (lab, top, d, h) in META.items():
    sv = [(val(s, k), s) for s in SOUTH if val(s, k) is not None]
    if len(sv) < 5 or h < 2:
        continue
    sv.sort(reverse=True)
    rel = (sv[0][0] - sv[-1][0]) / (sv[0][0] + 1)
    if rel < 0.3:
        continue
    add("K South league", h * 2 + min(3, rel * 4) + 0.5, f"South India: {lab}",
        f"South India ranked on {lab.lower()}. {nm(sv[0][1])} {p(sv[0][0], k)}, {nm(sv[-1][1])} only {p(sv[-1][0], k)}.",
        "6 southern states race; Tamil Nadu highlighted; end 'Where's your state?'", f"K-{k}", k, tuple(s for _, s in sv))

# --------------------------------------------------------------------------------------------------------
ideas.sort(key=lambda r: -r["score"])
# keep variety: at most 2 ideas per indicator in the top list and 3 per state
seen_i, seen_s, top = {}, {}, []
for r in ideas:
    i = r["indicator"]; ss = r["states"].split("; ") if r["states"] else []
    if seen_i.get(i, 0) >= 2 or any(seen_s.get(s, 0) >= 3 for s in ss):
        continue
    top.append(r); seen_i[i] = seen_i.get(i, 0) + 1
    for s in ss[:2]:
        seen_s[s] = seen_s.get(s, 0) + 1
    if len(top) >= 100:
        break

os.makedirs("public/datayt/nfhs6", exist_ok=True)
with open("public/datayt/nfhs6/shorts_catalog.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["rank", "format", "score", "title", "hook", "beats", "indicator", "topic", "states", "key"])
    w.writeheader()
    for i, r in enumerate(ideas, 1):
        w.writerow({"rank": i, **r})

by_fmt = {}
for r in ideas:
    by_fmt[r["format"]] = by_fmt.get(r["format"], 0) + 1
strong = [r for r in ideas if r["score"] >= 8]
json.dump({"raw": raw_counts, "raw_total": sum(raw_counts.values()), "candidates": len(ideas), "by_format": by_fmt,
           "strong": len(strong), "top": top}, open("public/datayt/nfhs6/shorts_plan.json", "w"), indent=1)
print("raw", sum(raw_counts.values()), "candidates", len(ideas), "strong(>=8)", len(strong), by_fmt)
for r in top[:40]:
    print(f'{r["score"]:5.2f} {r["format"]:18s} {r["hook"][:150]}')

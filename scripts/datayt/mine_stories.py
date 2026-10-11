#!/usr/bin/env python3
"""Data Kadai story miner: scan every collected table for stories the Short templates can tell, and rank them.

Reads the RBI Handbook tables, NFHS-6, the mobile-coverage and ground water tables. For each table it looks for the
shapes the templates need (docs/datakadai/STORYTELLING_FRAMEWORK.md and scripts/datayt/build_beats.py):

  share        one state holds a large share of a national total, well ahead of the next        -> beat type "share"
  stack        the first state is above the next two or three together                          -> "race" stack / "share"
  race         the leader changed between an old year and now, or two states were level then     -> "race"
  climber      a state's share of the national total rose or fell by several points              -> "race" / "change"
  pick         of two states, the one that is usually the smaller is clearly the higher          -> "pick" rounds
  gap          a rate differs several-fold between the highest and lowest state                  -> "paradox" / "ranking"
  outlier      one state is far above or below every other on a rate                             -> "myth" / "ranking"
  rate_change  a rate rose or fell sharply in a state over about ten years                       -> "change"
  nfhs_*       the same shapes on the family health survey, including NFHS-5 to NFHS-6 change   -> "change", "ranking"
  paradox      a state at one end on income per person and at the other end on another measure   -> "paradox"

Every candidate carries the numbers behind it, a score and a tier (A strong, B usable, C weak), and flags for what a
writer must check (provisional, thin lead, stale year, sensitive topic, small territory). It is a list of leads: a
script is written and its numbers recomputed by the builder only after a lead is chosen.
Writes public/datayt/bank/candidates.json and docs/datakadai/bank/CANDIDATES.md.
Run from the repo root: python3 scripts/datayt/mine_stories.py
"""
import glob, json, math, os, re, statistics, sys
sys.path.insert(0, os.path.dirname(__file__))
import nfhs6_meta as NM

RBI = "public/datayt/sources/rbi_handbook"
SMALL = {"Lakshadweep", "Andaman and Nicobar Islands", "Chandigarh", "Puducherry", "Ladakh", "Dadra and Nagar Haveli and Daman and Diu",
         "Dadra & Nagar Haveli and Daman & Diu", "Dadra and Nagar Haveli", "Daman and Diu", "Sikkim", "Goa", "Delhi", "NCT of Delhi", "Mizoram", "Nagaland",
         "Manipur", "Tripura", "Meghalaya", "Arunachal Pradesh"}
EVERYDAY = ("milk", "egg", "fish", "meat", "rice", "wheat", "sugarcane", "cotton", "pulses", "oilseed", "foodgrain", "income", "per capita", "wage", "power", "electric",
            "telephone", "road", "rail", "bank", "deposit", "credit", "tourist", "factor", "export", "birth", "death", "infant", "life expectancy", "fertility",
            "unemploy", "internet", "school", "literacy", "vehicle", "tax", "debt", "ground water", "forest", "rain", "irrigat", "gold", "airport", "atm")
SENSITIVE = ("meat", "liquor", "alcohol", "crime", "suicide", "violence", "caste", "religio", "tribe")
YEAR = re.compile(r"((?:19|20)\d\d)(?:-(\d\d))?")
C = []      # every candidate


def year_of(col):
    m = YEAR.findall(col)
    return int(m[-1][0]) if m else None


def measure_of(col):
    """The column name with its year removed: tables that carry several measures are split on this."""
    m = list(YEAR.finditer(col))
    return (col[:m[-1].start()] + col[m[-1].end():]).replace("(P)", "").replace("()", "").strip(" |()") if m else col


def add(kind, template, key, title, numbers, score, flags=(), **more):
    C.append({"kind": kind, "template": template, "key": key, "title": title, "numbers": numbers, "score": round(score, 2), "flags": sorted(set(flags)), **more})


def base_flags(title, col, states):
    f = []
    t = title.lower()
    if "(P)" in col or "provisional" in col.lower():
        f.append("provisional")
    y = year_of(col)
    if y is not None and y < 2021:
        f.append("stale year")
    if any(w in t for w in SENSITIVE):
        f.append("sensitive topic")
    if any(s in SMALL for s in states):
        f.append("small state or UT")
    return f


def boost(title):
    return 1.0 if any(w in title.lower() for w in EVERYDAY) else 0.0


def series_by_measure(t):
    """{measure: [(year, column, {state: value}, india)]} in year order, columns with at least 15 states only."""
    out = {}
    for col in t["columns"]:
        y = year_of(col)
        if y is None:
            continue
        vals = {s: r[col] for s, r in t["states"].items() if s != "India" and isinstance(r.get(col), (int, float))}
        if len(vals) < 15:
            continue
        india = t["states"].get("India", {}).get(col)
        out.setdefault(measure_of(col), []).append((y, col, vals, india if isinstance(india, (int, float)) else None))
    return {m: sorted(v, key=lambda x: x[0]) for m, v in out.items()}


def is_additive(vals, india):
    return india and all(v >= 0 for v in vals.values()) and 0.85 <= sum(vals.values()) / india <= 1.05


profiles = {}      # state -> its shares of each additive national total, for a sense of the state's usual size
additive_tables = []
rate_tables = []


def scan_rbi():
    for f in sorted(glob.glob(f"{RBI}/T*.json")):
        t = json.load(open(f)); no = t.get("table")
        for meas, ser in series_by_measure(t).items():
            y, col, vals, india = ser[-1]
            title = t["title"] + (f" [{meas}]" if meas and len(series_by_measure(t)) > 1 else "")
            rec = {"table": no, "title": title, "unit": " ".join(t.get("unit") or []), "measure": meas, "ser": ser}
            if is_additive(vals, india):
                additive_tables.append(rec)
                for s, v in vals.items():
                    profiles.setdefault(s, []).append(100 * v / india)
            elif min(vals.values()) >= 0:
                rate_tables.append(rec)


def old_point(ser, min_gap=8):
    """The series point closest to ten years before the latest, at least eight years back."""
    y1 = ser[-1][0]
    cands = [p for p in ser if y1 - p[0] >= min_gap]
    return min(cands, key=lambda p: abs((y1 - p[0]) - 10)) if cands else None


def mine_additive(rec, profile):
    ser, title, no = rec["ser"], rec["title"], rec["table"]
    y, col, vals, india = ser[-1]
    sh = {s: 100 * v / india for s, v in vals.items()}
    rk = sorted(sh, key=lambda s: -sh[s])
    if len(rk) < 5 or sh[rk[0]] <= 0:
        return
    fl = base_flags(title, col, rk[:1]); b = boost(title); key = f"T{no:03d}|{rec['measure']}"
    s1, s2 = sh[rk[0]], sh[rk[1]]
    typical = profile.get(rk[0], 0)
    if s1 >= 20 and s1 - s2 >= 5:
        surprise = s1 / typical if typical else 1
        add("share", "share", key, f"{rk[0]} has {s1:.0f}% of India's total: {title} ({col})",
            {"state": rk[0], "share": round(s1, 2), "next": rk[1], "next_share": round(s2, 2), "usual_share": round(typical, 1), "year": col},
            3 + min(3, s1 / 15) + min(2, surprise / 2) + b, fl + (["size effect"] if surprise < 1.4 else []), table=no)
    for k in (3, 2):
        if s1 > sum(sh[s] for s in rk[1:1 + k]) and sh[rk[1]] >= 3:
            add("stack", "race", key, f"{rk[0]} is above the next {k} states together: {title} ({col})",
                {"state": rk[0], "share": round(s1, 2), "next": rk[1:1 + k], "next_sum": round(sum(sh[s] for s in rk[1:1 + k]), 2), "year": col},
                3.5 + (1 if k == 3 else 0) + b, fl, table=no)
            break
    old = old_point(ser)
    if old:
        y0, col0, v0, i0 = old
        if i0 and is_additive(v0, i0):
            sh0 = {s: 100 * v / i0 for s, v in v0.items()}
            rk0 = sorted(sh0, key=lambda s: -sh0[s])
            if rk0[0] != rk[0] and s1 - sh.get(rk0[0], 0) >= 1.5 and rk0[0] in sh:
                add("race", "race", key, f"{rk0[0]} led in {col0}; {rk[0]} leads in {col}: {title}",
                    {"now": rk[0], "then": rk0[0], "now_share": round(s1, 2), "then_leader_now": round(sh[rk0[0]], 2), "from": col0, "to": col},
                    4.5 + min(2, (s1 - sh[rk0[0]]) / 5) + b, fl + ["check every year between"], table=no)
            both = [s for s in sh if s in sh0]
            if both:
                up = max(both, key=lambda s: sh[s] - sh0[s]); dn = min(both, key=lambda s: sh[s] - sh0[s])
                if sh[up] - sh0[up] >= 4:
                    add("climber", "race", key, f"{up}'s share of India's total rose from {sh0[up]:.0f}% to {sh[up]:.0f}%: {title} ({col0} to {col})",
                        {"state": up, "from_share": round(sh0[up], 2), "to_share": round(sh[up], 2), "from": col0, "to": col}, 3 + min(3, (sh[up] - sh0[up]) / 4) + b,
                        base_flags(title, col, [up]), table=no)
                if sh[dn] - sh0[dn] <= -4:
                    add("faller", "race", key, f"{dn}'s share of India's total fell from {sh0[dn]:.0f}% to {sh[dn]:.0f}%: {title} ({col0} to {col})",
                        {"state": dn, "from_share": round(sh0[dn], 2), "to_share": round(sh[dn], 2), "from": col0, "to": col}, 2.5 + min(3, (sh0[dn] - sh[dn]) / 4) + b,
                        base_flags(title, col, [dn]) + ["do not frame as decline of a state"], table=no)
    # pick: the usually smaller state is clearly the higher, and has been for the last three years in the table
    last3 = [p for p in ser[-3:]]
    picks = []
    for hi in rk[:12]:
        for lo in rk[:14]:
            if hi == lo or sh[hi] <= sh[lo] or hi in SMALL or lo in SMALL:
                continue
            gap, ratio = sh[hi] - sh[lo], sh[hi] / sh[lo] if sh[lo] else 9
            ph, pl = profile.get(hi, 0), profile.get(lo, 0)
            if gap >= 1.5 and ratio >= 1.15 and ph > 0 and pl >= 1.4 * ph and all(p[2].get(hi, 0) > p[2].get(lo, 0) for p in last3):
                picks.append((pl / ph * min(ratio, 3), hi, lo, gap, ratio))
    for sc, hi, lo, gap, ratio in sorted(picks, reverse=True)[:2]:
        add("pick", "pick", key, f"{hi} is higher than {lo}: {title} ({col})",
            {"higher": hi, "lower": lo, "higher_share": round(sh[hi], 2), "lower_share": round(sh[lo], 2), "ratio": round(ratio, 2), "gap_points": round(gap, 2), "year": col},
            2.5 + min(3, sc / 1.5) + b, base_flags(title, col, [hi, lo]), table=no)


def mine_rate(rec):
    ser, title, no = rec["ser"], rec["title"], rec["table"]
    y, col, vals, india = ser[-1]
    big = {s: v for s, v in vals.items() if s not in SMALL}
    if len(big) < 12:
        return
    rk = sorted(big, key=lambda s: -big[s]); b = boost(title); key = f"T{no:03d}|{rec['measure']}"
    hi, lo = big[rk[0]], big[rk[-1]]
    med = statistics.median(big.values())
    if lo > 0 and hi / lo >= 3:
        add("gap", "paradox", key, f"{rk[0]} is {hi / lo:.1f} times {rk[-1]}: {title} ({col})",
            {"high": rk[0], "high_v": hi, "low": rk[-1], "low_v": lo, "ratio": round(hi / lo, 2), "india": india, "year": col}, 2.5 + min(3, math.log(hi / lo, 2)) + b,
            base_flags(title, col, [rk[0], rk[-1]]) + ["larger states only"], table=no)
    if big[rk[1]] > 0 and (hi - big[rk[1]]) / big[rk[1]] >= 0.15 and med > 0 and hi / med >= 1.6:
        add("outlier", "ranking", key, f"{rk[0]} is far above every other larger state: {title} ({col})",
            {"state": rk[0], "v": hi, "next": rk[1], "next_v": big[rk[1]], "median": med, "india": india, "year": col}, 3 + min(2, hi / med / 2) + b,
            base_flags(title, col, [rk[0]]) + ["larger states only"], table=no)
    old = old_point(ser)
    if old:
        y0, col0, v0, i0 = old
        both = [s for s in big if isinstance(v0.get(s), (int, float)) and v0[s] > 0]
        if len(both) >= 12:
            ch = {s: big[s] / v0[s] for s in both}
            up = max(ch, key=ch.get); dn = min(ch, key=ch.get)
            medc = statistics.median(ch.values())
            if medc > 0 and ch[up] >= 1.5 and ch[up] / medc >= 1.3:
                add("rate_change", "change", key, f"{up} rose {ch[up]:.1f} times; the typical state {medc:.1f} times: {title} ({col0} to {col})",
                    {"state": up, "from_v": v0[up], "to_v": big[up], "times": round(ch[up], 2), "typical_times": round(medc, 2), "from": col0, "to": col}, 3 + min(2.5, ch[up] / medc) + b,
                    base_flags(title, col, [up]) + ["check price basis if a money figure"], table=no)
            r0 = sorted(both, key=lambda s: -v0[s]); r1 = sorted(both, key=lambda s: -big[s])
            jump = max(both, key=lambda s: r0.index(s) - r1.index(s))
            if r0.index(jump) - r1.index(jump) >= 7:
                add("rank_jump", "change", key, f"{jump} moved from rank {r0.index(jump) + 1} to {r1.index(jump) + 1} of {len(both)}: {title} ({col0} to {col})",
                    {"state": jump, "from_rank": r0.index(jump) + 1, "to_rank": r1.index(jump) + 1, "of": len(both), "from": col0, "to": col}, 3.2 + min(2, (r0.index(jump) - r1.index(jump)) / 6) + b,
                    base_flags(title, col, [jump]) + ["larger states only"], table=no)


def num(x):
    s = str(x).strip()
    if s.startswith("(") or s in ("*", "na", "-", ""):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def mine_nfhs():
    raw = json.load(open("public/datayt/nfhs6/nfhs6_states.json"))["states"]
    for i, (label, topic, direction, weight) in NM.META.items():
        if topic == "violence":
            continue
        rows = {s: [num(x) for x in r.get(str(i), [None] * 4)] for s, r in raw.items()}
        india = rows.get("India", [None] * 4)
        tot = {s: r[2] for s, r in rows.items() if s not in ("India", "Lakshadweep") and r[2] is not None}
        if len(tot) < 20 or india[2] is None:
            continue
        fl = ["sensitive topic"] if topic in ("alcohol", "tobacco") else []
        key = f"NFHS|{i}"; w = min(1.5, weight / 60) if weight else 0
        rk = sorted(tot, key=lambda s: -tot[s])
        for side, a, b_ in (("highest", rk[0], rk[1]), ("lowest", rk[-1], rk[-2])):
            lead = abs(tot[a] - tot[b_]); rel = tot[a] / india[2] if india[2] else 1
            if lead >= 1.0 and (rel >= 1.5 or rel <= 0.67):
                add("nfhs_extreme", "ranking", key, f"{a} is the {side}: {label} ({tot[a]:g} against India {india[2]:g})",
                    {"state": a, "v": tot[a], "next": b_, "next_v": tot[b_], "india": india[2], "side": side}, 2.8 + min(2, abs(math.log(max(rel, 0.01), 2))) + w,
                    fl + (["small state or UT"] if a in SMALL else []) + (["thin lead"] if lead < 2 else []), indicator=i)
        ch = {s: r[2] - r[3] for s, r in rows.items() if s not in ("India", "Lakshadweep") and r[2] is not None and r[3] is not None}
        if len(ch) >= 20 and india[3] is not None:
            up = max(ch, key=ch.get); dn = min(ch, key=ch.get); di = india[2] - india[3]
            if abs(di) >= 5:
                add("nfhs_india_change", "change", key, f"India moved from {india[3]:g} to {india[2]:g}: {label} (NFHS-5 to NFHS-6)",
                    {"from_v": india[3], "to_v": india[2], "most_up": up, "most_up_change": round(ch[up], 1), "most_down": dn, "most_down_change": round(ch[dn], 1)}, 3.2 + min(2.5, abs(di) / 6) + w,
                    fl + ["survey years differ by state"], indicator=i)
            for s_, sign in ((up, 1), (dn, -1)):
                if abs(ch[s_]) >= 12:
                    add("nfhs_state_change", "change", key, f"{s_} moved by {ch[s_]:+.1f} points: {label} (NFHS-5 to NFHS-6; India {di:+.1f})",
                        {"state": s_, "change": round(ch[s_], 1), "to_v": rows[s_][2], "from_v": rows[s_][3], "india_change": round(di, 1)}, 2.6 + min(2.5, abs(ch[s_]) / 10) + w,
                        fl + (["small state or UT"] if s_ in SMALL else []) + ["survey years differ by state", "check sample size"], indicator=i)
        if india[0] is not None and india[1] is not None and abs(india[0] - india[1]) >= 15:
            add("nfhs_urban_rural", "faceoff", key, f"Urban {india[0]:g}, rural {india[1]:g} across India: {label}", {"urban": india[0], "rural": india[1], "total": india[2]},
                2.8 + min(2, abs(india[0] - india[1]) / 15) + w, fl, indicator=i)


def spearman(a, b):
    ks = sorted(set(a) & set(b))
    if len(ks) < 15:
        return None, len(ks)
    def ranks(v):
        o = sorted(range(len(v)), key=lambda i: v[i]); r = [0.0] * len(v)
        for k, i in enumerate(o):
            r[i] = k + 1
        return r
    x, y = ranks([a[k] for k in ks]), ranks([b[k] for k in ks])
    mx, my = sum(x) / len(x), sum(y) / len(y)
    den = math.sqrt(sum((p - mx) ** 2 for p in x) * sum((q - my) ** 2 for q in y))
    return (sum((p - mx) * (q - my) for p, q in zip(x, y)) / den if den else 0), len(ks)


def mine_paradox():
    """A state at one end on income per person and at the other end on another rate."""
    t = json.load(open(f"{RBI}/T019.json"))
    col = [c for c in t["columns"] if sum(isinstance(r.get(c), (int, float)) for r in t["states"].values()) >= 20][-1]
    inc = {s: r[col] for s, r in t["states"].items() if s != "India" and isinstance(r.get(col), (int, float)) and s not in SMALL}
    ri = sorted(inc, key=lambda s: inc[s]); n = len(ri)
    others = [(f"T{r['table']:03d}|{r['measure']}", r["title"], r["ser"][-1][1], {s: v for s, v in r["ser"][-1][2].items() if s not in SMALL}) for r in rate_tables if r["table"] != 19]
    cov = json.load(open("public/datayt/coverage/mobile_coverage_2026-02-28.json"))["states"]
    others.append(("COVERAGE|g5", "Villages with 5G (%)", "Feb 2026", {s: r["g5_pct"] for s, r in cov.items() if s not in SMALL}))
    raw = json.load(open("public/datayt/nfhs6/nfhs6_states.json"))["states"]
    for i, (label, topic, direction, weight) in NM.META.items():
        if topic != "violence":
            others.append((f"NFHS|{i}", label, "NFHS-6", {s: num(r.get(str(i), [None] * 4)[2]) for s, r in raw.items() if s not in SMALL and s != "India" and num(r.get(str(i), [None] * 4)[2]) is not None}))
    found = []
    for key, title, period, v in others:
        rho, m = spearman(inc, v)
        if rho is None:
            continue
        rv = sorted((s for s in v if s in inc), key=lambda s: v[s])
        for s in ri[:3] + ri[-3:]:
            if s not in rv:
                continue
            pi, pv = ri.index(s) / (n - 1), rv.index(s) / (len(rv) - 1)
            if abs(pi - pv) >= 0.8:
                found.append((abs(pi - pv) + (0.3 if abs(rho) < 0.3 else 0) + boost(title) * 0.3, key, title, period, s, inc[s], v[s], rho, m, pi < 0.5))
    seen = {}
    for sc, key, title, period, s, iv, vv, rho, m, low_income in sorted(found, reverse=True):
        if seen.get(s, 0) >= 12 or seen.get(key, 0) >= 2:
            continue
        seen[s] = seen.get(s, 0) + 1; seen[key] = seen.get(key, 0) + 1
        add("paradox", "paradox", f"{key}|{s}", f"{s}: {'low' if low_income else 'high'} income per person, but at the {'top' if low_income else 'bottom'} end on: {title} ({period})",
            {"state": s, "income": iv, "income_year": col, "other": vv, "rank_correlation": round(rho, 2), "states_compared": m}, 3 + sc * 2,
            ["direction of 'better' must be checked", "larger states only"] + (["weak link across states"] if abs(rho) < 0.3 else ["the state is an exception to a real link"]),
            table=19)


def mine_loksabha(profile):
    """Leads from the Lok Sabha answer tables. Only columns whose state rows add up to the printed total are used for
    shares, and only tables whose columns are a run of years for change; the rest need a person to read the header."""
    per_answer = {}
    for f in sorted(glob.glob("public/datayt/sources/loksabha/tables/*.json")):
        for t in json.load(open(f))["tables"]:
            rows, k = t["rows"], t["n_cols"]; where = f"{t['ministry']}, {t['date']}"; subj = t["subject"]; b = boost(subj)
            fl0 = ["read the answer: " + ("columns are years" if t["year_columns"] else "column meaning not parsed"), "check for a newer answer"]
            if any(w in subj.lower() for w in SENSITIVE):
                fl0.append("sensitive topic")
            found = []
            j = k - 1      # the last column is usually the latest year or the total
            vals = {s: v[j] for s, v in rows.items()}
            tot = t["total"][j] if t["total"] else None
            if tot and t["sum_matches_total"][j] and tot > 0 and min(vals.values()) >= 0:
                sh = {s: 100 * v / tot for s, v in vals.items()}; rk = sorted(sh, key=lambda s: -sh[s])
                s1, s2 = sh[rk[0]], sh[rk[1]]; typical = profile.get(rk[0], 0)
                col = t["year_columns"][j] if t["year_columns"] else f"last of {k} columns"
                if s1 >= 20 and s1 - s2 >= 5 and rk[0] not in SMALL:
                    surprise = s1 / typical if typical else 1
                    found.append(("ls_share", "share", f"{rk[0]} has {s1:.0f}% of the national total: {subj} [{col}] ({where})",
                                  {"state": rk[0], "share": round(s1, 2), "next": rk[1], "next_share": round(s2, 2), "usual_share": round(typical, 1), "column": col},
                                  2.2 + min(3, s1 / 15) + min(2, surprise / 2) + b, fl0 + (["size effect"] if surprise < 1.4 else [])))
                if s1 > sh[rk[1]] + sh[rk[2]] and sh[rk[1]] >= 3 and rk[0] not in SMALL:
                    found.append(("ls_stack", "race", f"{rk[0]} is above the next two states together: {subj} [{col}] ({where})",
                                  {"state": rk[0], "share": round(s1, 2), "next": rk[1:3], "column": col}, 3 + b, fl0))
            yc = t["year_columns"]
            if yc and k >= 3:
                a0 = {s: v[0] for s, v in rows.items()}; a1 = {s: v[-1] for s, v in rows.items()}
                big = [s for s in rows if s not in SMALL and a0[s] > 0 and a1[s] > 0]
                if len(big) >= 12:
                    ch = {s: a1[s] / a0[s] for s in big}; med = statistics.median(ch.values()); up = max(ch, key=ch.get)
                    if med > 0 and ch[up] >= 1.6 and ch[up] / med >= 1.4:
                        found.append(("ls_change", "change", f"{up} changed {ch[up]:.1f} times between {yc[0]} and {yc[-1]}; the typical larger state {med:.1f} times: {subj} ({where})",
                                      {"state": up, "from_v": a0[up], "to_v": a1[up], "times": round(ch[up], 2), "typical_times": round(med, 2), "from": yc[0], "to": yc[-1]},
                                      2.6 + min(2.5, ch[up] / med) + b, fl0 + ["larger states only"]))
            for kind, template, title, numbers, score, flags in sorted(found, key=lambda x: -x[4])[:2]:
                if per_answer.get(t["answer"], 0) >= 2:
                    break
                per_answer[t["answer"]] = per_answer.get(t["answer"], 0) + 1
                add(kind, template, f"LS|{t['id']}", title, numbers, score, flags, answer=t["answer"], url=t["url"])


def main():
    scan_rbi()
    profile = {s: statistics.median(v) for s, v in profiles.items() if len(v) >= 10}
    for rec in additive_tables:
        mine_additive(rec, profile)
    for rec in rate_tables:
        mine_rate(rec)
    mine_nfhs()
    mine_paradox()
    mine_loksabha(profile)
    for c in C:
        pen = 1.2 * ("sensitive topic" in c["flags"]) + 0.8 * ("stale year" in c["flags"]) + 0.5 * ("size effect" in c["flags"]) + 0.4 * ("thin lead" in c["flags"])
        c["score"] = round(c["score"] - pen, 2)
        c["tier"] = "A" if c["score"] >= 5.5 else "B" if c["score"] >= 4.2 else "C"
    C.sort(key=lambda c: -c["score"])
    for n, c in enumerate(C, 1):
        c["id"] = f"K{n:04d}"
    os.makedirs("public/datayt/bank", exist_ok=True); os.makedirs("docs/datakadai/bank", exist_ok=True)
    json.dump({"made_by": "scripts/datayt/mine_stories.py", "tables": {"rbi_additive": len(additive_tables), "rbi_rates": len(rate_tables), "nfhs_indicators": len(NM.META)},
               "candidates": C}, open("public/datayt/bank/candidates.json", "w"), indent=1, ensure_ascii=False)
    kinds = sorted({c["kind"] for c in C})
    L = ["# Data Kadai story bank: candidates", "",
         f"Made by `scripts/datayt/mine_stories.py` from the tables on this drive: {len(additive_tables)} RBI series that add up to a national total, "
         f"{len(rate_tables)} RBI rate or per-person series, {len(NM.META)} NFHS-6 indicators, the mobile-coverage table, and the state-wise tables parsed from Lok Sabha answers "
         "(`scripts/datayt/parse_loksabha.py`).", "",
         "These are leads found by code, not scripts. Tier A is a strong, clear effect on a familiar subject; B is usable; C is weak or carries a caution. "
         "A lead becomes a script only after its number is read at the publisher, a newer release is ruled out, and the builder recomputes every comparison.", "",
         "| Kind | Template | A | B | C | All |", "| --- | --- | --- | --- | --- | --- |"]
    for k in kinds:
        cs = [c for c in C if c["kind"] == k]
        L.append(f"| {k} | {cs[0]['template']} | {sum(c['tier'] == 'A' for c in cs)} | {sum(c['tier'] == 'B' for c in cs)} | {sum(c['tier'] == 'C' for c in cs)} | {len(cs)} |")
    L.append(f"| **All** | | {sum(c['tier'] == 'A' for c in C)} | {sum(c['tier'] == 'B' for c in C)} | {sum(c['tier'] == 'C' for c in C)} | {len(C)} |")
    for tier in "AB":
        L += ["", f"## Tier {tier}", "", "| ID | Kind | Lead | Score | Check before use |", "| --- | --- | --- | --- | --- |"]
        L += [f"| {c['id']} | {c['kind']} | {c['title'].replace('|', '/')} | {c['score']} | {'; '.join(c['flags']) or 'none'} |" for c in C if c["tier"] == tier]
    open("docs/datakadai/bank/CANDIDATES.md", "w").write("\n".join(L) + "\n")
    print(f"{len(C)} candidates: A {sum(c['tier'] == 'A' for c in C)}, B {sum(c['tier'] == 'B' for c in C)}, C {sum(c['tier'] == 'C' for c in C)}")
    for k in kinds:
        cs = [c for c in C if c["kind"] == k]
        print(f"  {k:18s} {len(cs):4d}  A {sum(c['tier'] == 'A' for c in cs):3d}  B {sum(c['tier'] == 'B' for c in cs):3d}")


if __name__ == "__main__":
    main()

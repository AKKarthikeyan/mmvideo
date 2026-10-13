#!/usr/bin/env python3
"""Data Kadai themed weeks: checks the plan in public/datayt/bank/themes.json and writes docs/datakadai/ops/PLAN.md.

AK's rules of 13 Oct 2026: 14 Shorts a week (two a day), one theme a day, two finance days a week.
A week may carry its own seven themes ("themes": seven theme keys, from "days" and "more_themes"), as week four does
after AK asked for more market and money data; it still needs at least two finance days.
The plan is written by hand in themes.json ("weeks": seven days of two ids each, "new" for an empty slot); this script
only checks it and prints it, so a broken rule is seen before anything is posted.
Usage (repo root): python3 scripts/datayt/week_plan.py          check and write PLAN.md
                   python3 scripts/datayt/week_plan.py --check  check only
Nothing is posted: posting needs AK's go.
"""
import json, os, re, sys

T = json.load(open("public/datayt/bank/themes.json"))
DAYS, VID = T["days"], T["videos"]
THEME = {d["key"]: d for d in DAYS + T.get("more_themes", [])}
def days_of(w):
    """The seven day-themes of a week: the standing ones, or the week's own list."""
    return [{**THEME[k], "day": n + 1} for n, k in enumerate(w["themes"])] if w.get("themes") else DAYS
FORMAT = {"paradox": "paradox", "then": "then and now", "fact": "one state, one fact", "share": "share", "race": "race", "pick": "game", "over": "over 100", "place": "place story"}
def data(i):
    f = f"public/datayt/beats/{i}/data.json"
    return json.load(open(f)) if os.path.exists(f) else None
def todo():
    """What each Short still needs before posting, from the week documents written when it was built."""
    out = {}
    for n in (1, 2, 3):
        f = f"docs/datakadai/ops/WEEK-0{n}.md"
        for l in open(f).read().splitlines() if os.path.exists(f) else []:
            c = [x.strip() for x in l.strip().strip("|").split("|")]
            if l.startswith("|") and len(c) >= 6 and re.fullmatch(r"[a-z]{2}\d\d", c[2]):
                out[c[2]] = c[-1]
    out.update(T.get("todo", {}))
    return out
bad, order, pos = [], [], {}
assert sum(d["finance"] for d in DAYS) == 2 and len(DAYS) == 7, "seven day-themes, two of them finance"
for w in T["weeks"]:
    assert len(w["days"]) == 7 and len(days_of(w)) == 7, f"week {w['week']}: seven days"
    assert sum(d["finance"] for d in days_of(w)) >= 2, f"week {w['week']}: at least two finance days"
    for d, ids in zip(days_of(w), w["days"]):
        if len(ids) != 2:
            bad.append(f"week {w['week']} day {d['day']}: {len(ids)} Shorts, not two")
        for slot, i in enumerate(ids):
            if i == "new":
                bad.append(f"week {w['week']} day {d['day']} ({d['name']}): an empty slot"); continue
            if i in pos:
                bad.append(f"{i} is scheduled twice")
            if VID.get(i) != d["key"]:
                bad.append(f"week {w['week']} day {d['day']}: {i} is filed under '{VID.get(i)}', not '{d['key']}'")
            if not data(i):
                bad.append(f"{i} is not built")
            pos[i] = 7 * (w["week"] - 1) + d["day"]; order.append((w["week"], d, slot, i))
for a, b in zip(order, order[1:]):      # the research: never the same template twice in a row
    da, db = data(a[3]), data(b[3])
    if da and db and da["type"] == db["type"]:
        bad.append(f"{a[3]} then {b[3]} (week {b[0]} day {b[1]['day']}): the same format twice in a row ({FORMAT.get(da['type'], da['type'])})")
for a, b, gap, why in T.get("apart", []):
    if a in pos and b in pos and abs(pos[a] - pos[b]) < gap:
        bad.append(f"{a} and {b} are {abs(pos[a] - pos[b])} days apart, need {gap}: {why}")
unfiled = sorted(i for i in VID if i not in pos and i not in T.get("stock", []))
if unfiled:
    bad.append("filed under a theme but neither scheduled nor in stock: " + ", ".join(unfiled))
for l in bad:
    print("PLAN:", l)
print(f"plan: {len(order)} Shorts scheduled over {len(T['weeks'])} weeks, {sum(i == 'new' for w in T['weeks'] for d in w['days'] for i in d)} empty slots, {len(T.get('stock', []))} in stock, {len(bad)} problems")
if "--check" in sys.argv:
    sys.exit(1 if bad else 0)
TODO = todo()
L = ["# Data Kadai: the themed weeks", "",
     f"The rule ({T['rule'].split(':')[0]}): {T['rule'].split(': ', 1)[1]}", "",
     "This page is the posting order. It replaces the orders in `WEEK-01.md`, `WEEK-02.md` and `WEEK-03.md`, which stay as the record of each build round. Nothing is posted: AK approves each pack and posts it.", "",
     "## The seven days", "", "| Day | Theme | Finance | What it covers |", "| --- | --- | --- | --- |"]
L += [f"| {d['day']} | {d['name']} | {'yes' if d['finance'] else ''} | {d['covers']} |" for d in DAYS]
L += [f"| | {d['name']} | {'yes' if d['finance'] else ''} | {d['covers']} (only in a week that lists it) |" for d in T.get("more_themes", [])]
for w in T["weeks"]:
    n = sum(i != "new" for d in w["days"] for i in d)
    L += ["", f"## Week {w['week']} ({n} of 14)", ""] + ([w["why"], ""] if w.get("why") else []) + ["| Day | Theme | Slot | ID | Title | Format | Length | Before posting |", "| --- | --- | --- | --- | --- | --- | --- | --- |"]
    for d, ids in zip(days_of(w), w["days"]):
        for slot, i in enumerate(ids):
            x = data(i) if i != "new" else None
            L.append(f"| {d['day']} | {d['name']} | {('first', 'second')[slot]} | {i if x else 'empty'} | {x['ytTitle'] if x else ''} | {FORMAT.get(x['type'], x['type']) if x else ''} | {f'''{x['total']:.0f} s''' if x else ''} | {TODO.get(i, 'Watch with sound. Add the source link.') if x else ''} |")
if T.get("stock"):
    L += ["", "## Built, waiting for a later week", ""]
    L += [f"- `{i}` ({THEME[VID[i]]['name']}): {data(i)['ytTitle']}" for i in T["stock"]]
if T.get("apart"):
    L += ["", "## Pairs kept apart", ""] + [f"- `{a}` and `{b}`: at least {g} days ({why})." for a, b, g, why in T["apart"]]
L += ["", "## Problems the check found", ""] + ([f"- {b}" for b in bad] or ["None."])
L += ["", "Videos: `DarwinSSD/DataKadai/videos/<id>-<date>-short.mp4`. Post packs: `docs/datakadai/posts/<date>-<id>.md`. Check the plan again with `python3 scripts/datayt/week_plan.py --check`."]
open("docs/datakadai/ops/PLAN.md", "w").write("\n".join(L) + "\n")
print("docs/datakadai/ops/PLAN.md written")

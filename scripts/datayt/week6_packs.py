#!/usr/bin/env python3
"""Data Kadai week six (22 Oct 2026): post packs for the state-comparison Shorts, written from each Short's own built cards
(public/datayt/beats/<id>/data.json), so every number in a pack is one the video shows. Usage: python3 scripts/datayt/week6_packs.py"""
import json, re
IDS = ["vs02", "cn02", "vs04", "cn04", "vs06", "sp05", "vs03", "cn09", "vs05", "cn11", "vs07", "cn10", "vs08", "cn08"]
TAGS = {"money": ["Banking", "Money"], "farm": ["Farming", "Agriculture"], "women": ["Women", "WomenInIndia"], "economy": ["Economy", "GDP"],
        "power": ["Electricity", "Energy"], "school_health": ["Education", "Health"], "states": ["IndianStates", "Geography"]}
clean = lambda s: (s or "").replace("*", "")
IDEA = ("Week six, all state comparisons (AK, 22 Oct 2026: \"State comparisions attract more views\"; sample vs05 approved: \"Good.\"). "
        "Written from official tables already on the drive, checked by an independent numbers and viewer editor, built to the house rules "
        "(map opening, every state on the closing map), voiced, rendered in the new clear-area layout and frame-checked.")
for sid in IDS:
    D = json.load(open(f"public/datayt/beats/{sid}/data.json")); C = json.load(open(f"public/datayt/beats/configs/{sid}.json"))
    B = D["beats"]; typ = D["type"]; theme = C.get("theme", "")
    desc, xs = [], ""
    if typ == "versus":
        a, b = C["a"], C["b"]; rounds = [x for x in B if x["kind"] == "versus"]; sc = next(x for x in B if x["kind"] == "score")
        lead, n1, n2 = (a, sc["sa"], sc["sb"]) if sc["sa"] > sc["sb"] else (b, sc["sb"], sc["sa"])
        other = b if lead == a else a
        lines = [f"{r['label']}: {a} {r['a']}, {b} {r['b']} ({a if r['win'] == 'a' else b} ahead; {r['note']})" for r in rounds]
        desc = [f"{a} vs {b}, five rounds of official data. Final score: {lead} {n1}, {other} {n2}.", "\n".join(lines)]
        xs = f"{a} vs {b}, 5 rounds: " + "; ".join(f"{r['label']} {r['a']} vs {r['b']}" for r in rounds[:3]) + f"... Final: {lead} {n1}-{n2}."
        q = "Which two states should we compare next?"
    elif typ == "countdown":
        ranks = sorted([x for x in B if x["kind"] == "rank"], key=lambda x: x["rank"])
        lab = ranks[0]["label"]
        desc = [clean(" ".join(B[0].get("lines", []))) + f" ({lab}).", "\n".join(f"#{r['rank']} {r['name']}: {r['big']}" for r in ranks)]
        xs = f"Top 5, {lab}: " + ", ".join(f"{r['name']} {r['big']}" for r in ranks) + ". Every state on the map."
        q = clean(B[-1].get("q", "Where does your state stand?"))
    elif typ == "pick":
        tells = [x for x in B if x["kind"] == "pick" and x["mode"] == "tell"]
        desc = ["Higher or lower: four rounds, two states each.", "\n".join(f"{t['measure']}: {t['pa']['name']} {t['pa']['label']} vs {t['pb']['name']} {t['pb']['label']}" for t in tells)]
        xs = "Higher or lower, 4 rounds: " + "; ".join(f"{t['pa']['name']} or {t['pb']['name']}?" for t in tells) + " Answers in the video."
        q = "How many did you get right?"
    else:
        facts = [x for x in B if x["kind"] == "fact"]
        desc = [clean(" ".join(B[0].get("lines", []))), "\n".join(f"{f['name']}: {f['big']} {clean(f['text'])}" for f in facts)]
        xs = clean(" ".join(B[0].get("lines", []))) + " " + " ".join(f"{f['name']} {f['big']}." for f in facts[:2])
        q = clean(B[-1].get("q", "What do you make of it?"))
    mp = next((x for x in B if x["kind"] == "map"), None)
    if mp: desc.append(f"Closing map: {clean(mp['title'])} ({mp.get('sub', '')}). {mp.get('note', '')}")
    xs = xs + f" Source: {D['sourceShort']}."
    if len(xs) > 270: xs = xs[:266].rsplit(" ", 1)[0] + "..."
    pack = {"idea": IDEA, "alt_title": "", "description": desc, "question": q, "tags": TAGS.get(theme, []) + ["StateComparison"],
            "x": xs, "instagram": desc[0] + " Swipe for every round and the map. Source: " + D["sourceShort"] + ".",
            "pinned": "Source: " + D["source"], "source": D["source"], "source_short": D["sourceShort"],
            "done": ["Every figure read from a saved official table and tested by the builder (rules 2: leads of at least 5% or rank steps of at least 3%, earlier years checked where the table has them).",
                     "Independent numbers and viewer editor re-computed every figure, checked directions and wording; fixes applied before voicing.",
                     "Rendered in the clear-area layout (22 Oct 2026) and frame-checked."],
            "open": ["Watch with sound before posting."], "signoff": []}
    if C.get("caveats_for_ak"): pack["signoff"] = C["caveats_for_ak"]
    json.dump(pack, open(f"public/datayt/beats/packs/{sid}.json", "w"), ensure_ascii=False, indent=1)
    print(sid, typ, len(xs), D["ytTitle"])

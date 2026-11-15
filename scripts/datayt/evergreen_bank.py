#!/usr/bin/env python3
"""Data Kadai evergreen bank: gather the facts the collectors wrote, mark overlaps and holds, rank them, print the list.

AK, 13 Oct 2026: "Collect more evergreen facts." An evergreen fact rests on something slow (geography, a census, a count
of things built or notified rarely, a date in a law), so a Short on it does not go stale when the next monthly table
comes out. Collectors write public/datayt/bank/evergreen/<name>.json and the tables behind them under
public/datayt/sources/evergreen/ (read by the builder with {"tbl": ["evergreen/<table>", column]}).

This script reads those files, applies the editor's marks below (a duplicate keeps one fact per claim; a hold waits for
AK), asks Jev (TypeSafe) the same four questions as scripts/datayt/rank_jev.py about each fact's sentence, and writes
public/datayt/bank/evergreen.json and docs/datakadai/bank/EVERGREEN.md. Jev's answers are cached in
public/datayt/bank/evergreen_jev.json. A Jev score is a judgment of the wording, not a forecast of views.
A fact here is a checked lead, not a script: a writer still builds the config and the builder recomputes every number.

Run from the repo root: python3 scripts/datayt/evergreen_bank.py            (needs TYPESAFE_API_KEY for facts not yet scored)
                        python3 scripts/datayt/evergreen_bank.py --no-jev   (list and marks only)
"""
import collections, glob, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))

BANK = "public/datayt/bank"
# One fact per claim. The fact kept is the one read at the publisher's own document; the other is its cross-check.
DUP = {"drive-01": ("built-01", "the same claim on a newer count: 2,713 of 6,598 in a Lok Sabha answer of Aug 2026. Re-read both before a script."),
       "drive-22": ("built-09", "the same RBI Handbook column"),
       "drive-08": ("land-01", "the same Forest Survey figure, from a Lok Sabha answer"),
       "drive-03": ("land-15", "the same tiger estimate, from a Lok Sabha answer")}
# Waiting for AK: true and sourced, but outside what the channel has said it covers.
HOLD = {"people-13": "people per Lok Sabha seat: arithmetic, but it is the delimitation debate. The channel's rule is no politics.",
        "people-14": "the 1971-census freeze on Lok Sabha seats: the Constitution's words, but it is the delimitation debate.",
        "people-15": "people per Rajya Sabha seat: the same debate."}
SHAPE = {"fact": "one state against India or the next state on one measure", "paradox": "a state's share of something against its share of land or people, or two states of one size far apart",
         "then": "one thing at two dates", "game": "two states compared on one measure"}
TIER = {"A": 9, "B": 6, "C": 3}


def jev(facts):
    import rank_jev as R
    path = f"{BANK}/evergreen_jev.json"
    cache = json.load(open(path)) if os.path.exists(path) else {}
    todo = [f for f in facts if f"{R.QSET}|{f['fact']}" not in cache]
    if todo:
        key = os.environ.get("TYPESAFE_API_KEY") or sys.exit("set TYPESAFE_API_KEY to score the new facts, or pass --no-jev")
        for n, f in enumerate(todo, 1):
            cache[f"{R.QSET}|{f['fact']}"] = R.flat(R.ask({"finding": f["fact"], "comparison": SHAPE.get(f.get("format"), "one state on one measure")}, key))
            if n % 20 == 0:
                json.dump(cache, open(path, "w"), indent=0, ensure_ascii=False); print(f"  Jev: {n} of {len(todo)}")
        json.dump(cache, open(path, "w"), indent=0, ensure_ascii=False)
    for f in facts:
        j = cache[f"{R.QSET}|{f['fact']}"]
        f["jev"] = {k: j[k] for k in ("surprise", "everyday", "clear", "talk", "named", "sensitive", "shaming", "topic")}
        f["rank"] = R.rank_of({"score": TIER.get(f.get("tier"), 3)}, j)
        f["flags"] = (["Jev: touches a sensitive subject"] if j["sensitive"] >= 0.5 else []) + (["Jev: may read as running a state down"] if j["shaming"] >= 0.5 else [])


def main():
    facts = []
    for path in sorted(glob.glob(f"{BANK}/evergreen/*.json")):
        for f in json.load(open(path)):
            f["collector"] = os.path.basename(path)[:-5]
            f["status"] = "duplicate" if f["id"] in DUP else "hold" if f["id"] in HOLD else "spare" if f.get("tier") == "C" else "ready"
            if f["id"] in DUP:
                f["dup_of"], f["why"] = DUP[f["id"]]
            if f["id"] in HOLD:
                f["why"] = HOLD[f["id"]]
            facts.append(f)
    ids = [f["id"] for f in facts]
    assert len(ids) == len(set(ids)), "two facts share an id"
    missing = [f["id"] for f in facts if not os.path.exists(f"public/datayt/sources/{f.get('table', '')}.json") and not os.path.exists(f"public/datayt/sources/evergreen/{f.get('table', '')}.json")]
    if "--no-jev" not in sys.argv:
        jev(facts)
    facts.sort(key=lambda f: (-f.get("rank", TIER.get(f.get("tier"), 3)), f["id"]))
    json.dump({"made_by": "scripts/datayt/evergreen_bank.py", "facts": facts}, open(f"{BANK}/evergreen.json", "w"), indent=1, ensure_ascii=False)
    n = collections.Counter(f["status"] for f in facts)
    cut = lambda s, k: (s[:k - 1].rstrip() + "…") if len(s) > k else s
    L = ["# Data Kadai evergreen bank", "",
         "AK, 13 Oct 2026: \"Collect more evergreen facts.\" Made by `scripts/datayt/evergreen_bank.py` from the collectors' files in `public/datayt/bank/evergreen/`.", "",
         "An evergreen fact rests on something slow: geography, a census, a count of things built or notified rarely, a date in a law. Each one here was read at the publisher's own document, carries its as-on date, and says what would change it. The tables behind them are in `public/datayt/sources/evergreen/`; the builder reads them with `{\"tbl\": [\"evergreen/<table>\", column]}`.", "",
         "These are checked leads, not scripts. A script is still written to the writer's guide and every number recomputed by the builder. The full record of each fact (source, link, lead margin, how a size effect was ruled out, cautions) is in `public/datayt/bank/evergreen.json`.", "",
         f"**{len(facts)} facts:** {n['ready']} ready (tier A or B), {n['spare']} spare (tier C: weak or with a caution), {n['hold']} waiting for AK, {n['duplicate']} set aside as the same claim as another.", "",
         "The score is Jev's judgment of the sentence (surprise, how close to daily life, how clear, how likely to be shared), moved a little by the tier. It ranks wording, not truth, and it is not a forecast of views.", ""]
    for theme in sorted({f.get("theme", "") for f in facts}, key=lambda t: -sum(1 for f in facts if f.get("theme") == t and f["status"] == "ready")):
        rows = [f for f in facts if f.get("theme") == theme and f["status"] == "ready"]
        if not rows:
            continue
        L += [f"## {theme} ({len(rows)})", "", "| Score | ID | Fact | Tier | Format | Stays true until | Caution |", "| --- | --- | --- | --- | --- | --- | --- |"]
        L += [f"| {f.get('rank', '')} | `{f['id']}` | {f['fact']} | {f.get('tier', '')} | {f.get('format', '')} | {cut(str(f.get('stays_true', '')), 150)} | {cut('; '.join(f.get('flags', []) + [str(f.get('caution') or '')]).strip('; '), 170)} |" for f in rows]
        L += [""]
    for status, title, intro in (("hold", "Waiting for AK", "True and sourced, but outside what the channel has said it covers. Not for a script until AK says."),
                                 ("spare", "Spares (tier C)", "Weak, or true only for a short while. Listed so nobody collects them again."),
                                 ("duplicate", "Set aside: the same claim as another fact", "Kept as the cross-check for the fact named.")):
        rows = [f for f in facts if f["status"] == status]
        if rows:
            L += [f"## {title} ({len(rows)})", "", intro, ""] + [f"- `{f['id']}`: {f['fact']}" + (f" Same as `{f['dup_of']}`: {f['why']}." if status == "duplicate" else f" {f['why']}" if f.get("why") else f" {cut(str(f.get('caution') or ''), 200)}") for f in rows] + [""]
    states = collections.Counter(f.get("state", "") for f in facts if f["status"] == "ready")
    L += ["## Spread", "", "Ready facts by lead state: " + ", ".join(f"{s} {k}" for s, k in states.most_common()) + ".", "",
          "Facts from one table tell one story: use one per fortnight (the dam register, the tiger estimate, the forest report, the 2025 coastline, the handloom census, the university survey).", ""]
    if missing:
        L += ["## To fix", "", "No table file found for: " + ", ".join(missing) + ".", ""]
    open("docs/datakadai/bank/EVERGREEN.md", "w").write("\n".join(L))
    print(f"evergreen: {len(facts)} facts · {n['ready']} ready · {n['spare']} spare · {n['hold']} hold · {n['duplicate']} duplicate" + (f" · no table for {len(missing)}" if missing else ""))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Bake the printed qualifiers of the source tables for the Counter look.

A source table item may carry a "printed" field: the figure as the publisher prints it ("almost 15%", "roughly 7%").
data.json keeps only the number, so a look would show false precision. This reads every Counter story's config, follows
each card's item spec (and each bar's) to its source table, and writes public/looks/counter/printed.json:
  {id: {card name: {"big": "almost 15%", "<bar name>": "roughly 7%"}}}
Only items whose table prints a form are written. Run from the repo root:
  .venv/bin/python src/looks/counter/bake_printed.py
"""
import json, os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
REG = os.path.join(ROOT, "src/looks/shared/registry.ts")
OUT = os.path.join(ROOT, "public/looks/counter/printed.json")


def printed(spec):
    if not (isinstance(spec, list) and len(spec) >= 2):
        return None
    p = os.path.join(ROOT, "public/datayt/sources", spec[0] + ".json")
    if not os.path.exists(p):
        return None
    item = json.load(open(p)).get("items", {}).get(spec[1], {})
    return item.get("printed")


def main():
    ids = json.loads(re.search(r"LOOK_STORIES: string\[\] = (\[[^\]]*\])", open(REG).read()).group(1))
    out = {}
    for sid in ids:
        cfg = json.load(open(os.path.join(ROOT, "public/datayt/beats/configs", sid + ".json")))
        for card in cfg.get("cards", []):
            got = {}
            s = printed(card.get("item"))
            if s:
                got["big"] = s
            for bar in card.get("bars", []) or []:
                s = printed(bar.get("item"))
                if s:
                    got[bar["name"]] = s
            if got:
                out.setdefault(sid, {})[card["name"]] = got
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(out, open(OUT, "w"), indent=1, ensure_ascii=False)
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()

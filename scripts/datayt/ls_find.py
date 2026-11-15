#!/usr/bin/env python3
"""List Lok Sabha answers whose subject has all the given words, newest first: use it to look for a newer answer on a subject.
usage: python3 scripts/datayt/ls_find.py <word> [word ...]"""
import glob, json, sys
words = [w.lower() for w in sys.argv[1:]]
seen = {}
for f in glob.glob("public/datayt/sources/loksabha/tables/*.json"):
    for t in json.load(open(f))["tables"]:
        if all(w in t["subject"].lower() for w in words):
            seen.setdefault(t["answer"], [t["date"], t["ministry"], t["subject"], 0])[3] += 1
key = lambda d: tuple(reversed(d.split(".")))
for a, (d, m, s, n) in sorted(seen.items(), key=lambda x: key(x[1][0]), reverse=True):
    print(f"{d}  {a:18s} {m[:34]:34s} {n} table(s)  {s}")

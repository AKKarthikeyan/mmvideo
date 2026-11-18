#!/usr/bin/env python3
"""A01 v4 hook check on the REAL audio (hook_check equivalent): every question, tease, surprise and turn listed in
script.md v4.1 ("Every question, tease, surprise and turn in order"), timed at the end of the sentence that carries it
(MiniMax sentence timings, vo/timing.json, plus the beat starts in vo/timeline.json). Rules: the first question ends
within 5 s; never more than 45 s between two hooks. Exit 1 on a breach. Prints a table (also written to vo/hooks.json)."""
import json, pathlib, sys
V = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/a01v4/vo")
T = json.loads((V / "timing.json").read_text()); S = json.loads((V / "timeline.json").read_text())
HOOKS = [("c01", "QUESTION", "Why would anyone sell this machine"), ("c02", "SURPRISE", "Less than it cost to take them away"),
 ("c03", "TURN", "Now the strange part"), ("c04", "BIG QUESTION", "but not that trust"), ("c05", "TEASE", "first shows up a year later"),
 ("c05", "TEASE", "Not about candy"), ("c05", "PLANT", "A three question check comes last"), ("m01", "CHAPTER QUESTION", "What is a moat?"),
 ("m02", "KILL THE OBVIOUS", "Were the machines junk?"), ("m03", "SURPRISE", "less than nothing"), ("m03", "QUESTION", "So where was the value?"),
 ("m05", "PAYOFF + TURN", "Now, the word"), ("m06", "OPEN LOOP", "So what was in GEICO's gap?"), ("n01", "CHAPTER QUESTION", "Why does a business need a moat?"),
 ("n03", "SURPRISE", "Nobody sees better"), ("n04", "QUESTION", "And the candy store?"), ("n04", "SURPRISE", "eight hundred and fifty seven million"),
 ("n05", "PAYOFF", "that is why even new looms found no buyer"), ("w01", "CHAPTER QUESTION", "What is a moat made of?"), ("w02", "PAYOFF", "Back to GEICO's gap"),
 ("w03", "QUESTION", "Who wins?"), ("w05", "QUESTION", "Can a trusted name survive vanishing?"), ("w06", "SURPRISE", "that day at zero"),
 ("w07", "QUESTION", "Would you bother?"), ("w08", "QUESTION", "Why can't a rival just copy that?"), ("w09", "OPEN LOOP", "So far."),
 ("w10", "OPEN LOOP", "has a catch"), ("f01", "CHAPTER QUESTION", "How do you spot a fake moat?"), ("f02", "QUESTION", "What makes a fake one look real?"),
 ("f03", "QUESTION", "Why had Buffett trusted it?"), ("s01", "CHAPTER QUESTION", "Can one star person be a moat?"), ("s02", "TURN", "The Mayo Clinic is different"),
 ("l01", "CHAPTER QUESTION", "Does a moat last forever?"), ("l02", "BUT TURN", "But a moat only proves itself under attack"),
 ("l03", "SURPRISE", "one hundred and thirty seven depots"), ("l04", "QUESTION", "So did Asian Paints' moat hold?"), ("l05", "PAYOFF", "Remember the catch with rules?"),
 ("l06", "PAYOFF", "And IEX's crowd, so far?"), ("x01", "PAYOFF", "Try our three question check"), ("x02", "QUESTION", "Could rivals copy its machines?"),
 ("e01", "CALLBACK", "Back to the loom")]
rows, bad = [], []
for b, kind, ph in HOOKS:
    hit = [s for s in T[b]["sents"] if ph.lower().rstrip("?.") in s[2].lower()]
    if not hit: bad.append(f"phrase not found: {b} {ph}"); continue
    t = round(S["start"][b] + hit[0][1], 2)
    rows.append((t, b, kind, ph))
rows.sort()
prev, worst = 0.0, (0, "")
for t, b, kind, ph in rows:
    gap = t - prev
    if gap > worst[0]: worst = (round(gap, 1), f"before {b} {ph!r}")
    print(f"{int(t // 60)}:{t % 60:05.2f}  +{gap:5.1f}s  {b}  {kind:<17} {ph}")
    prev = t
tail = S["total"] - prev
print(f"end {S['total']} s; after the last hook {tail:.1f} s (ending: callback + answer + end card)")
first_q = next(t for t, b, k, p in rows if "QUESTION" in k)
print("first question ends at", first_q, "s; longest gap", worst)
if first_q > 5: bad.append("first question after 5 s")
if worst[0] > 45: bad.append("gap over 45 s: %s" % (worst,))
(V / "hooks.json").write_text(json.dumps({"rows": rows, "first_question_s": first_q, "longest_gap": worst, "problems": bad}, indent=1))
print("PROBLEMS:", bad or "none"); sys.exit(1 if bad else 0)

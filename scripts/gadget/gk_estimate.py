# The Inventor's Desk: placeholder timing.json from script.json, so a Short can be built and checked as a silent draft before
# voicing. Words are paced like 002 Fridge; gaps are 0.28 s + pause + hold. "estimate": true keeps the voice track off.
# gk_align.py overwrites this file with real word times once the narration is voiced.
# Run: python3 scripts/gadget/gk_estimate.py src/gadget/<id>/script.json
import json, sys, pathlib
sp = pathlib.Path(sys.argv[1]); S = json.load(open(sp))
t, words, beats = 0.05, [], {}
for b in S["beats"]:
    for w in b["say"].split():
        d = 0.16 + 0.045 * len(w.strip(".,?:!'"))
        if w[-1] in ".?:!": d += 0.12
        words.append([w, round(t, 3), round(t + d, 3), b["key"]]); t += d + 0.02
    beats[b["key"]] = [words[-len(b["say"].split())][1], words[-1][2]]
    t += 0.28 + b.get("pause", 0) + b.get("hold", 0)
K = 86.3 / 107.7   # calibrated on 002 Fridge (real tight read 86.3 s vs this estimate 107.7 s)
words = [[w, round(a * K, 3), round(b * K, 3), k] for w, a, b, k in words]; beats = {k: [round(a * K, 3), round(b * K, 3)] for k, (a, b) in beats.items()}; t *= K
json.dump({"estimate": True, "total": round(t, 3), "beats": beats, "words": words}, open(sp.parent / "timing.json", "w"), indent=0)
print("estimated total", round(t, 1), "s")

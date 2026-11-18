# English SRT for "Jio's Size Advantage Has a Catch" from src/voxplus/scale/scaleTiming.ts (beat starts + word times).
import json, re, sys
ts = open("/Volumes/DarwinSSD/MMVideo/src/voxplus/scale/scaleTiming.ts").read()
g = lambda n: json.loads(re.search(r"export const %s[^=]*= (.*);" % n, ts).group(1))
B, O, W = g("BEAT"), g("ORDER"), g("WORDS")
fmt = lambda t: "%02d:%02d:%02d,%03d" % (t // 3600, t % 3600 // 60, t % 60, round((t - int(t)) * 1000) % 1000)
cues = []
for k in O:
    cur, cs = [], None
    for w, s, e in W[k]:
        if not cur: cs = B[k] + s
        cur.append(w); ce = B[k] + e
        text = " ".join(cur)
        if (len(text) >= 70 or w.endswith((".", "?", "!")) and len(text) >= 30 or ce - cs >= 5.5):
            cues.append([cs, ce, text]); cur = []
    if cur: cues.append([cs, ce, " ".join(cur)])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1] + 0.35, cues[i + 1][0] - 0.02)
def wrap(t):
    if len(t) <= 42: return t
    mid = len(t) // 2; i = t.rfind(" ", 0, mid + 8)
    return t[:i] + "\n" + t[i + 1:]
out = "\n".join(f"{n}\n{fmt(a)} --> {fmt(b)}\n{wrap(t)}\n" for n, (a, b, t) in enumerate(cues, 1))
open(sys.argv[1], "w").write(out); print(len(cues), "cues; last ends", fmt(cues[-1][1]))

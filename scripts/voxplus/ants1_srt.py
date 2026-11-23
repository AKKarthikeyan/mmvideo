# ants1 English SRT (copy of kotakq2_srt.py; caption words = the approved script text with figures, "cap") from src/voxplus/KotakTiming.ts (beat starts + whisper word times on the pause-fixed audio),
# with the script's own words: whisper tokens are mapped back onto the script text so spelling/numbers follow the script.
import json, re, sys
ts = open("/Volumes/DarwinSSD/MMVideo-atlas-ant/src/voxplus/AntTiming.ts").read()
g = lambda n: json.loads(re.search(r"export const %s[^=]*= (.*);" % n, ts).group(1))
B, O, W = g("BEAT"), g("ORDER"), g("WORDS"); SAY = {b["key"]: b["cap"] for b in json.load(open("/Volumes/DarwinSSD/MMVideo-atlas-ant/scripts/voxplus/ants1_beats.json"))}
fmt = lambda t: "%02d:%02d:%02d,%03d" % (t // 3600, t % 3600 // 60, t % 60, round((t - int(t)) * 1000) % 1000)
cues = []
for k in O:
    ws = W[k]; words = SAY[k].split()
    # spread the script words over the whisper word timings (same count in practice; else proportional)
    n, m = len(words), len(ws)
    times = [(ws[min(m - 1, int(i * m / n))][1], ws[min(m - 1, int((i + 1) * m / n) - 1 if int((i + 1) * m / n) > 0 else 0)][2]) for i in range(n)] if m else \
            [(i / n * 5, (i + 1) / n * 5) for i in range(n)]
    cur, cs = [], None
    for w, (s, e) in zip(words, times):
        if not cur: cs = B[k] + s
        cur.append(w); ce = B[k] + e; text = " ".join(cur)
        if len(text) >= 70 or (w.endswith((".", "?", "!", ":")) and len(text) >= 28) or ce - cs >= 5.5:
            cues.append([cs, ce, text]); cur = []
    if cur: cues.append([cs, ce, " ".join(cur)])
for i in range(len(cues) - 1): cues[i][1] = min(cues[i][1] + 0.35, cues[i + 1][0] - 0.02)
def wrap(t):
    if len(t) <= 42: return t
    mid = len(t) // 2; i = t.rfind(" ", 0, mid + 8)
    return t[:i] + "\n" + t[i + 1:]
open(sys.argv[1], "w").write("\n".join(f"{n}\n{fmt(a)} --> {fmt(b)}\n{wrap(t)}\n" for n, (a, b, t) in enumerate(cues, 1)))
print(len(cues), "cues; last ends", fmt(cues[-1][1]))

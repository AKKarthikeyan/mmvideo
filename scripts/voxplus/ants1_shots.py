# ants1: list every shot's cut time (film seconds) from the S files + AntTiming.ts, the same phrase lookup as AntCue.tsx.
# python3 ants1_shots.py [mid|cut]  -> prints one time per shot (mid = 60% into the shot)
import json, re, sys, pathlib
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo-atlas-ant/src/voxplus")
ts = (R / "AntTiming.ts").read_text()
g = lambda n: json.loads(re.search(r"export const %s[^=]*= (.*);" % n, ts).group(1))
B, D, WD, SAY, TOT = g("BEAT"), g("DUR"), g("WORDS"), g("SAY"), float(re.search(r"FILM_TOTAL_S = ([\d.]+)", ts).group(1))
norm = lambda s: re.sub(r"[^a-z0-9]+", " ", s.lower().replace("’", "").replace("'", "")).strip()
def wt(k, p):
    toks = norm(p).split(); flat = [(t, i) for i, w in enumerate(WD[k]) for t in norm(w[0]).split()]
    for i in range(len(flat) - len(toks) + 1):
        if all(flat[i + j][0] == toks[j] or (j == len(toks) - 1 and flat[i + j][0].startswith(toks[j])) for j in range(len(toks))): return WD[k][flat[i][1]][1]
    s = SAY[k].lower(); c = s.find(p.lower())
    if c < 0: raise SystemExit(f"phrase not in {k}: {p}")
    print("  (fallback)", k, p, file=sys.stderr); return D[k] * c / len(s)
cuts = []
for f in ["AntS1.tsx", "AntS2.tsx", "AntS3.tsx", "AntS4.tsx"]:
    for k, x in re.findall(r'\bS\("(\w\d\d)", (-?[\d.]+|"[^"]+")', (R / f).read_text()):
        cuts.append((B[k] + (float(x) if not x.startswith('"') else wt(k, x.strip('"'))), k, x))
cuts.sort()
mode = sys.argv[1] if len(sys.argv) > 1 else "mid"
for i, (t, k, x) in enumerate(cuts):
    nxt = cuts[i + 1][0] if i + 1 < len(cuts) else TOT
    print(round(t + 0.6 * (nxt - t), 2) if mode == "mid" else f"{t:7.2f} {nxt - t:5.2f}s {k} {x}")
print(len(cuts), "shots", file=sys.stderr)

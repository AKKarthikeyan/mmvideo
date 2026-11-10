"""Within-channel analysis of public Shorts listings (title + view count).
For each channel: median, share >=1M; features compared between each channel's top and bottom quartile;
and an OLS of log10(views) on features with channel fixed effects (demeaned within channel)."""
import json, glob, re, math, statistics as st, sys, os
import numpy as np

CAT = dict(l.strip().split("|")[::-1] for l in open("channels.txt") if "|" in l)
EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿]")
DEVA = re.compile("[ऀ-ॿ]"); TAMIL = re.compile("[஀-௿]")
F = {
 "number":      lambda t: bool(re.search(r"\d", t)),
 "money":       lambda t: bool(re.search(r"[₹$€£]|\b(crore|lakh|billion|million|trillion|rupees?|dollars?)\b", t, re.I)),
 "question":    lambda t: "?" in t,
 "why/how":     lambda t: bool(re.match(r"\s*(why|how)\b", t, re.I)) or bool(re.search(r"\b(why|how)\b", t, re.I)),
 "what if":     lambda t: bool(re.search(r"\bwhat (if|happens|would)\b", t, re.I)),
 "superlative": lambda t: bool(re.search(r"\b(biggest|largest|most|richest|fastest|worst|best|deadliest|tallest|smallest|only|first|last|world'?s|ever)\b", t, re.I)),
 "you":         lambda t: bool(re.search(r"\b(you|your)\b", t, re.I)),
 "negation/twist": lambda t: bool(re.search(r"\b(never|not|no one|nobody|can'?t|won'?t|don'?t|isn'?t|doesn'?t|actually|secret|truth|really|banned|illegal|hidden)\b", t, re.I)),
 "india":       lambda t: bool(re.search(r"\b(india|indian|bharat|delhi|mumbai|chennai|bengaluru|bangalore|kolkata|hyderabad|tamil|kerala|gujarat|ambani|adani|tata)\b", t, re.I)),
 "vs/comparison": lambda t: bool(re.search(r"\b(vs\.?|versus|compared|bigger than|than)\b", t, re.I)),
 "emoji":       lambda t: bool(EMOJI.search(t)),
 "hashtag":     lambda t: "#" in t,
 "allcaps word": lambda t: bool(re.search(r"\b[A-Z]{4,}\b", t)),
 "hindi script": lambda t: bool(DEVA.search(t)),
 "tamil script": lambda t: bool(TAMIL.search(t)),
 "short title (<=40)": lambda t: len(t) <= 40,
}
rows = []; chan = []
for f in sorted(glob.glob("raw/*.json")):
    h = os.path.basename(f)[:-5]
    try: D = json.load(open(f))
    except Exception: continue
    if not D: continue
    E = [e for e in (D.get("entries") or []) if e.get("view_count") and e.get("title")]
    if len(E) < 30: continue
    v = [e["view_count"] for e in E]
    chan.append(dict(h=h, cat=CAT.get(h, "?"), subs=D.get("channel_follower_count"), n=len(E), med=st.median(v),
                     p1m=sum(x >= 1e6 for x in v) / len(v), p100k=sum(x >= 1e5 for x in v) / len(v), top=max(v)))
    for e in E: rows.append((h, e["title"], e["view_count"], e.get("id")))

print(f"{len(chan)} channels, {len(rows)} Shorts\n")
print(f"{'channel':30} {'cat':7} {'subs':>10} {'n':>4} {'median':>10} {'>=100k':>7} {'>=1M':>6}")
for c in sorted(chan, key=lambda c: -c["med"]):
    print(f"{c['h']:30} {c['cat']:7} {c['subs'] or 0:>10,} {c['n']:>4} {c['med']:>10,.0f} {c['p100k']:>6.0%} {c['p1m']:>6.0%}")
allp = sum(r[2] >= 1e6 for r in rows) / len(rows)
print(f"\nall Shorts: {allp:.1%} reach 1M; channel median of 'share >=1M': {st.median(c['p1m'] for c in chan):.0%}")
print("top/median ratio within channel (median over channels):", round(st.median(c['top'] / c['med'] for c in chan), 1))

# within-channel quartiles
print(f"\n{'feature':22} {'top-25% has':>12} {'bottom-25% has':>15} {'lift':>6}   {'FE coef (log10 views)':>22}")
top = []; bot = []
by = {}
for r in rows: by.setdefault(r[0], []).append(r)
for h, R in by.items():
    R = sorted(R, key=lambda r: r[2]); q = max(1, len(R) // 4)
    bot += R[:q]; top += R[-q:]
names = list(F)
X = []; y = []; g = []
for h, t, v, _ in rows:
    X.append([float(F[k](t)) for k in names] + [len(t) / 10]); y.append(math.log10(v)); g.append(h)
X = np.array(X); y = np.array(y); g = np.array(g)
for h in set(g):
    m = g == h; X[m] -= X[m].mean(0); y[m] -= y[m].mean()
coef, *_ = np.linalg.lstsq(X, y, rcond=None)
res = y - X @ coef; dof = len(y) - X.shape[1] - len(set(g))
se = np.sqrt(np.diag(np.linalg.pinv(X.T @ X)) * (res @ res) / dof)
for i, k in enumerate(names):
    a = sum(F[k](r[1]) for r in top) / len(top); b = sum(F[k](r[1]) for r in bot) / len(bot)
    print(f"{k:22} {a:>12.0%} {b:>15.0%} {a / b if b else float('inf'):>6.2f}   {coef[i]:+.3f} ± {1.96 * se[i]:.3f}  (x{10 ** coef[i]:.2f})")
print(f"{'title length /10 chars':22} {'':>12} {'':>15} {'':>6}   {coef[-1]:+.3f} ± {1.96 * se[-1]:.3f}")
print(f"mean title length: top {st.mean(len(r[1]) for r in top):.0f}, bottom {st.mean(len(r[1]) for r in bot):.0f} chars")

if "--examples" in sys.argv:
    for h, R in by.items():
        R = sorted(R, key=lambda r: -r[2])
        print(f"\n== {h} ({CAT.get(h)})  TOP:"); [print(f"  {r[2]:>11,}  {r[1]}") for r in R[:6]]
        print("   BOTTOM:"); [print(f"  {r[2]:>11,}  {r[1]}") for r in R[-3:]]
json.dump(dict(chan=chan, rows=rows), open("study.json", "w"))

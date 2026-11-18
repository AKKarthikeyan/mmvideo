# Build the Indica Atlas Weeks 2-5 plan from both Jev-scored lists (AK 25 Oct 2026: 70% India / 30% global).
#   python3 scripts/geo/build_plan.py   ->  docs/geo/plan/PLAN_WEEKS_2-5.md
import json, re, collections

P_DIR = "docs/geo/plan/"
new = [{**json.loads(l), "src": "new"} for l in open(P_DIR + "jev_plan_2026-10-25.jsonl")]
old = [{**json.loads(l), "src": "500"} for l in open(P_DIR + "jev_plan500_2026-10-25.jsonl")]
FMT = {"A": "Nobody lives here", "B": "Map is lying", "C": "Strange borders", "D": "Explained in 60 s", "E": "Quiz",
       "F": "Strategic geography", "G": "Big builds", "H": "Scale", "I": "Isolated places", "J": "History map"}
for r in new: r["cat"] = FMT[r["fmt"]]
for r in old: r["cat"] = r["fmt"]

DONE = re.compile(r"siliguri|chicken'?s neck|chenab|time zone|one clock|brahmaputra|princely|closer to myanmar|everest|"
                  r"malacca|enclave|monsoon|hyderabad|islamabad|languages", re.I)   # Week 1 topics
DUPES = ["minicoy", "longwa", "colachel", "austria", "sikh policemen", "dholavira", "coffee", "pundits", "chola", "chandigarh", "coastline"]
SENS_MAX = 0.7          # leave out topics Jev rates this sensitive or more
CAT_MAX = 7             # at most this many from one category
# formats the 1M-view research shows work on YouTube even though Jev scores their plain titles low: slots kept for them
RESERVE = {"A": 4, "D": 1, "E": 3}
# Week 2 fixed by AK's 25 Oct ask: all "Why" topics, under-covered on YouTube (no same-topic video with 100K+ views,
# checked with scripts/geo/yt_coverage.py; data in docs/geo/plan/youtube_coverage_*.json). Order = posting order.
WEEK2 = [("Why Minicoy is closer to the Maldives than to Kerala", "I"), ("Why Austria once had a colony in the Nicobars", "G"),
         ("Why Kuttanad farms below sea level", "I"), ("Why Sikh policemen patrolled Shanghai and Hong Kong", "G"),
         ("Why India's sea zone is over 2 million square kilometres", "I"), ("Why Nain Singh counted his steps with prayer beads", "I"),
         ("Why India's first rocket launched from a church", "I"), ("Why Zanzibar's carved doors look Indian", "G"),
         ("Why Barmer's desert has oil", "I"), ("Why Indian traders reached Egypt's Berenike", "G"),
         ("Why Panipat recycles the world's woollens", "I"), ("Why Bhitarkanika has India's biggest crocodiles", "I"),
         ("Why Burma's last king was exiled to Ratnagiri", "I"), ("Why Narcondam island has its own hornbill", "I")]

W2T = {t for t, _ in WEEK2}; wk2 = {}
pool, seen, out_sens = [], [], []
for r in sorted(new + old, key=lambda r: -r["composite"]):
    t = r["title"].lower()
    if DONE.search(t): continue
    d = [k for k in DUPES if k in t]
    if d and d[0] in seen: continue
    if d: seen.append(d[0])
    if r["title"] in W2T: wk2[r["title"]] = r; continue
    if r["sensitive"] >= SENS_MAX: out_sens.append(r); continue
    pool.append(r)

P = []
for f, n in RESERVE.items():
    P += [r for r in pool if r["src"] == "new" and r["fmt"] == f and r["sensitive"] < 0.5][:n]
cat = collections.Counter(r["cat"] for r in P)
need = {"I": 30 - sum(r["aud"] == "I" for r in P), "G": 12 - sum(r["aud"] == "G" for r in P)}
for r in pool:
    if r in P or cat[r["cat"]] >= CAT_MAX or need[r["aud"]] <= 0: continue
    P.append(r); need[r["aud"]] -= 1; cat[r["cat"]] += 1
assert len(P) == 42, len(P)
assert len(wk2) == 14, sorted(W2T - set(wk2))

W = [[] for _ in range(3)]
for r in sorted(P, key=lambda r: -r["composite"]):
    ok = [w for w in range(3) if len(W[w]) < 14 and sum(x["aud"] == r["aud"] for x in W[w]) < (4 if r["aud"] == "G" else 10)
          and (r["sensitive"] < 0.5 or sum(x["sensitive"] >= 0.5 for x in W[w]) < 2)]
    W[min(ok, key=lambda w: (sum(x["cat"] == r["cat"] for x in W[w]), sum(x["composite"] for x in W[w])))].append(r)

n500 = sum(r["src"] == "500" for r in P) + sum(r["src"] == "500" for r in wk2.values())
L = ["# Indica Atlas: content plan, Weeks 2–5 (56 Shorts), v2\n",
     "Made 25 Oct 2026. This replaces v1 from earlier the same day: it now also draws on Jev's 500-topic list from 20 Oct.",
     "**Mix (AK's decision):** 70% India, 30% global or India-and-the-world, so each week has 10 India Shorts and 4 global.\n",
     "**How the 56 were picked** (`scripts/geo/build_plan.py`):",
     "1. Pool: Jev's 500 topics (20 Oct) plus the 70 new format ideas from the 1M-view research (`docs/geo/research/CONTENT_REFRESH_2026-10-25.md`).",
     "2. Jev re-scored all 570 with one 70/30 rubric (`scripts/geo/jev_rank_plan.py`): hook 35%, appeal to the topic's main audience 30%,",
     "   the other audience 15%, map visuals 20%. The 20 Oct scores were for Indian viewers only and rewarded obscure topics, so they",
     "   could not be compared directly.",
     f"3. Removed: the 14 Week 1 topics, duplicates, and topics Jev rates {SENS_MAX} or more on sensitivity (listed at the end; AK can add any back).",
     "   Week 2 is fixed (see below); Weeks 3-5 are filled from the rest.",
     "4. Kept slots for the formats the YouTube research backs but Jev under-scores because of plain titles:",
     "   4 \"why nobody lives here\" (the hottest format right now), 3 quizzes and 1 \"explained\".",
     f"5. Took the highest scores, with at most {CAT_MAX} from one category. Each week gets a mix and at most 2 ⚑ topics.\n",
     f"**Result:** {n500} from Jev's 500 list and {56 - n500} from the new research list.\n",
     "**Rules for scripting:** titles here are pitches. Final titles go under 60 characters, put the surprise in the title, and use",
     "at most one emoji. Every figure is read at its primary source (Census, Survey of India, India Code, Indian Railways, ASI, the",
     "foreign government's own records) before scripting. Explain every Indian term for global viewers, show India's official map",
     "only, and take no side. ⚑ = Jev sensitivity 0.5–0.7, so the wording needs extra care.\n",
     "Dates are approximate: Week 2 starts the day after Week 1's last Short (about 28 Oct). Two a day, AM and PM.\n"]
COV = {}
for f in ("youtube_coverage_why46_2026-10-25.json", "youtube_coverage_whyI12_2026-10-25.json"):
    for c in json.load(open(P_DIR + f)): COV[c["title"]] = c
L.append("\n## Week 2: all \"Why\" topics nobody has covered well (AK, 25 Oct)\n")
L.append("Each was searched on YouTube: none has a same-topic video with 100K+ views (biggest one shown).\n")
L.append("| Day | Slot | India/Global | Topic (pitch) | Category | Jev | Biggest YouTube video on it |\n|---|---|---|---|---|---|---|")
w2 = [wk2[t] for t, _ in WEEK2]
for d in range(7):
    for s, r in (("AM", w2[2 * d]), ("PM", w2[2 * d + 1])):
        top = (COV.get(r["title"], {}).get("top") or {}).get("views")
        L.append(f"| {d + 1} | {s} | {'India' if r['aud'] == 'I' else 'Global'} | {r['title']} | {r['cat']} | {r['composite']:.2f} | "
                 f"{f'{top:,} views' if top else 'none found'} |")
for i, w in enumerate(W):
    w = sorted(w, key=lambda r: -r["composite"]); am, pm = w[:7], w[7:]
    L.append(f"\n## Week {i + 3}\n\n| Day | Slot | India/Global | Topic (pitch) | Category | Jev | From |\n|---|---|---|---|---|---|---|")
    for d in range(7):
        for s, r in (("AM", am[d]), ("PM", pm[d])):
            L.append(f"| {d + 1} | {s} | {'India' if r['aud'] == 'I' else 'Global'} | {r['title']}{' ⚑' if r['sensitive'] >= 0.5 else ''} | "
                     f"{r['cat']} | {r['composite']:.2f} | {'500 list' if r['src'] == '500' else 'new'} |")
L.append(f"\n## Left out for sensitivity (Jev {SENS_MAX} or more), highest score first\n")
for r in out_sens[:25]: L.append(f"- {r['title']} (Jev {r['composite']:.2f}, sensitivity {r['sensitive']:.2f})")
L += ["\n## Next in line (best unused topics, for swaps)\n"]
for r in [r for r in pool if r not in P][:20]: L.append(f"- {r['title']} ({'India' if r['aud'] == 'I' else 'Global'}, Jev {r['composite']:.2f})")
L += ["\n## How to check the plan works",
      "After Week 2, read YouTube Studio > Analytics > Audience > Top geographies, and each Short's views and swipe-away rate.",
      "Keep the formats that beat our current best (7,800 views), and swap out the ones under 1,000 for the next topics in line."]
open(P_DIR + "PLAN_WEEKS_2-5.md", "w").write("\n".join(L) + "\n")
for i, w in enumerate(W): print("Week", i + 3, dict(collections.Counter(x["aud"] for x in w)), "flagged", sum(x["sensitive"] >= 0.5 for x in w))
print("from 500:", n500, "| new:", 56 - n500)

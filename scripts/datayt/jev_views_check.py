#!/usr/bin/env python3
"""Ask Jev (TypeSafe) whether this week's titles have what million-view Shorts have, after checking that Jev can tell
real Indian hits from misses at all.

Jev reads wording, not channels, thumbnails or the algorithm, so this is a judgment of the title, not a forecast.
The calibration set is real Shorts from three Indian money and business channels (views from vidIQ, 25 Oct 2026),
compared only within a channel so that channel size does not decide the result. If Jev cannot order those, its
scores for our titles mean little.

Run from the repo root, on the machine whose login shell holds TYPESAFE_API_KEY:
  python3 scripts/datayt/jev_views_check.py
Writes docs/datakadai/week44/JEV_CHECK.md; answers are cached in public/datayt/bank/jev_views_answers.json.
"""
import concurrent.futures, hashlib, itertools, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from rank_jev import ask, MODEL

CACHE = "public/datayt/bank/jev_views_answers.json"
OUT = "docs/datakadai/week44/JEV_CHECK.md"
# fixed before any answer came back; not tuned on the calibration set
WEIGHTS = {"curiosity": 0.30, "mass": 0.25, "stakes": 0.20, "surprise": 0.15, "clear": 0.10}
Q = {
    "curiosity": {"type": "score", "instructions": "How strongly would `title` make an ordinary Indian viewer scrolling YouTube Shorts stop to find out the answer?", "criteria": [
        "Nothing to find out: the title states a topic or a fact with no open question.",
        "A mild question that most viewers could guess or would not wonder about.",
        "A clear open question that some viewers would want answered.",
        "A strong open question or claim that most viewers would want answered.",
        "An irresistible question, contradiction or reveal that almost anyone would stop for."]},
    "mass": {"type": "score", "instructions": "How many people in India would personally care about the subject of `title`?", "criteria": [
        "Only specialists or people in one trade or industry.",
        "People with a particular interest, such as investors, founders or policy watchers.",
        "People from one region or state, or one age group.",
        "Most urban adults in India.",
        "Almost every household in India, in cities and villages."]},
    "stakes": {"type": "score", "instructions": "How much does `title` touch the viewer's own money, family, pride or fears?", "criteria": [
        "Not at all: an abstract or faraway subject.",
        "A little: something the viewer has heard of but that does not affect them.",
        "Clearly: something that affects the viewer's spending, job, family or state.",
        "Strongly: the viewer's own money, family's future, or pride in their state or country is directly at stake."]},
    "surprise": {"type": "score", "instructions": "How unexpected is the claim or finding in `title` to an ordinary adult in India?", "criteria": [
        "It says what almost everyone already assumes.",
        "New information, but it fits what people expect.",
        "Most people would say they did not know that.",
        "It goes against a common belief, or names a winner nobody would guess."]},
    "clear": {"type": "score", "instructions": "How quickly can a viewer understand what `title` is about?", "criteria": [
        "It needs a technical term or acronym explained first.",
        "It can be followed with a second look.",
        "It is understood at a glance, with one unfamiliar word.",
        "It is understood instantly by anyone, a child could repeat it."]},
    "million": {"type": "noul", "instructions": "Is `title` the kind of YouTube Short that ordinary viewers across India would watch and share widely enough to reach a million views?"},
}
QSET = hashlib.sha1(json.dumps([MODEL, Q], sort_keys=True).encode()).hexdigest()[:10]

# (channel, title, views), vidIQ 25 Oct 2026; only Shorts at least five days old
CAL = [
    ("Think School", "Using AI is no longer enough. You need to know how to BUILD with it.", 15730540),
    ("Think School", "Why Elon Musk Wants to Bomb Mars", 1468089),
    ("Think School", "12 Years of BJP: Growth or Failure?", 1083447),
    ("Think School", "Ex-ISRO Scientist Reveals Space Secrets!", 1056170),
    ("Think School", "Get to $1 Million With Just 20 Clients!", 34304),
    ("Think School", "This AI Helps Founders Scale Faster", 27914),
    ("Think School", "This AI Cut Marketing Costs by 83%", 30739),
    ("Think School", "Most Loneliness Happens in Joint Families", 35450),
    ("Think School", "Comet's Secret Marketing Strategy", 37633),
    ("Think School", "This Company Is Bringing Foreign Universities to India", 37561),
    ("Finshots TV", "India's Silver Crash Explained: From ₹1.9 Lakh to ₹1.56 Lakh in Days", 440150),
    ("Finshots TV", "Why Bengaluru's ₹40,000 Crore Metro Didn't Fix Traffic", 328347),
    ("Finshots TV", "Lenskart IPO: The High Valuation vs. Grey Market Hype!", 182417),
    ("Finshots TV", "The Government's Smartest Tax Trick Yet", 175136),
    ("Finshots TV", "Trump Does it Again!", 4204),
    ("Finshots TV", "Why are India's ultra-rich preferring Gurugram over Mumbai", 5211),
    ("Finshots TV", "India's Ethanol Masterplan backfired?", 6412),
    ("Finshots TV", "Indians love Beer!", 8830),
    ("Finshots TV", "This Sector Could Shock Everyone in 2026", 8969),
    ("Finshots TV", "Gold Hit ₹1 Lakh… But Jewellers Are Still Struggling", 12684),
    ("Wint Wealth", "Is Gold Savings Scheme the best way to invest in gold?", 7669604),
    ("Wint Wealth", "Is Being Employed Stupid?", 5830168),
    ("Wint Wealth", "How much money you need to RETIRE?", 3310060),
    ("Wint Wealth", "Countries to TRAVEL below 1.5 Lakh Budget", 1861380),
    ("Wint Wealth", "Cost of raising a child in Metro Cities?", 113497),
    ("Wint Wealth", "How to Choose a Mutual Fund", 130938),
    ("Wint Wealth", "Why are Zudio products cheap?", 295651),
    ("Wint Wealth", "Indians SPENDING more than Americans?", 321495),
]
# this week, from week44/WEEK_PLAN.md: (day, slot, title)
WEEK = [
    ("Mon 26", "A", "Indian Homes Hold 3× More Gold Than the US Government"),
    ("Mon 26", "B vs03", "Maharashtra vs Gujarat: 5 Rounds of Economy Data"),
    ("Tue 27", "A", "The ₹10 Cola War: Campa vs Coke and Pepsi"),
    ("Tue 27", "B vs05", "Karnataka vs Tamil Nadu: 5 Rounds, Power and 5G"),
    ("Wed 28", "A", "India's Baby Map: One Region Now Below 1 Child per Woman"),
    ("Wed 28", "B cn02", "Bank Loans vs State Output: Delhi at 153%, Top 5"),
    ("Thu 29", "A", "Diwali Gold: Indians Buy Less, Pay More"),
    ("Thu 29", "B vs02 (fallback)", "Punjab vs Haryana: 5 Rounds of Money Data"),
    ("Thu 29", "Long", "India Is Running Out of Babies. Here's the Map."),
    ("Fri 30", "A", "110 Crore Orders in 10 Minutes"),
    ("Fri 30", "B vs06", "Gujarat vs Rajasthan: 5 Rounds on Women and Girls"),
    ("Sat 31", "A", "Which State Pays India's GST?"),
    ("Sat 31", "B cn08", "Kerala or West Bengal? 4 Rounds of Higher or Lower"),
    ("Sat 31", "Long", "10 Minutes vs DMart vs the Kirana Anna: Who's Winning?"),
    ("Sun 1", "A", "UPI October Scorecard: Festive Record?"),
    ("Sun 1", "B vs07", "West Bengal vs Odisha: 5 Rounds of School and Health Data"),
]

# hook titles for the built state comparisons, 25 Oct 2026; every claim is a round in the Short's own post pack
RETITLE = {
    "vs03": ["Gujarat Beats Maharashtra 3–2: Factories Decide It",
             "Gujarat's Factory Output per Person Is 2.4× Maharashtra's",
             "Maharashtra vs Gujarat: Which Economy Wins? 5 Rounds"],
    "vs05": ["Tamil Nadu Gets 25% More Power per Person Than Karnataka",
             "Karnataka Wins on 5G. Tamil Nadu Wins on Power. Who Wins?",
             "Tamil Nadu Beats Karnataka 3–2 on Power and 5G"],
    "vs02": ["Haryana Has 68% More Personal Loans per Person Than Punjab",
             "Punjab Beats Haryana 3–2 on Money. Haryana Borrows More",
             "Punjab vs Haryana: Who Wins on Money? 5 Rounds"],
    "vs06": ["Rajasthan Beats Gujarat 3–2 on Women and Girls",
             "88% vs 67%: Rajasthan Beats Gujarat on Period Protection",
             "Gujarat or Rajasthan: Where Do Women and Girls Do Better?"],
    "vs07": ["West Bengal Beats Odisha 3–2 on Schools and Health",
             "Odisha Wins on Mothers. West Bengal Wins on Schools.",
             "West Bengal or Odisha: Who Wins on Schools and Health?"],
    "cn02": ["Banks Have Lent Delhi 1.5× Its Yearly Output",
             "Which State Runs Most on Bank Loans? #1 Isn't Maharashtra",
             "Delhi Owes Banks More Than Its Whole Year's Output"],
    "cn08": ["Kerala or West Bengal: Which Is More Crowded?",
             "Can You Beat This India Quiz? 4 Rounds of Higher or Lower",
             "Kerala or West Bengal? Most People Guess Wrong"],
}
OLD = {"vs03": WEEK[1][2], "vs05": WEEK[3][2], "vs02": WEEK[7][2], "vs06": WEEK[10][2], "vs07": WEEK[15][2],
       "cn02": WEEK[5][2], "cn08": WEEK[12][2]}


def judge(title, cache, key):
    k = f"{QSET}|{title}"
    if k not in cache:
        r = ask({"title": title, "platform": "YouTube Shorts, viewers in India"}, key, Q)
        a = r["answers"]
        cache[k] = {q: (round(a[q]["score"] / (len(Q[q]["criteria"]) - 1), 3) if Q[q]["type"] == "score" else round(a[q]["noul"], 3)) for q in Q}
    return cache[k]


def score(j):
    return round(100 * sum(w * j[q] for q, w in WEIGHTS.items()), 1)


def pairs_right(rows, val):
    """Within each channel, the share of (hit, miss) pairs where the hit gets the higher value; ties count half."""
    right = n = 0
    for ch in {r[0] for r in rows}:
        rs = [r for r in rows if r[0] == ch]
        top = sorted(rs, key=lambda r: -r[2])[: len(rs) // 2]
        low = [r for r in rs if r not in top]
        for h, m in itertools.product(top, low):
            n += 1
            right += 1 if val(h) > val(m) else 0.5 if val(h) == val(m) else 0
    return right / n, n


def main():
    key = os.environ.get("TYPESAFE_API_KEY") or sys.exit("TYPESAFE_API_KEY is not set")
    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    titles = [c[1] for c in CAL] + [w[2] for w in WEEK] + [t for ts in RETITLE.values() for t in ts]
    with concurrent.futures.ThreadPoolExecutor(6) as ex:
        list(ex.map(lambda t: judge(t, cache, key), titles))
    json.dump(cache, open(CACHE, "w"), indent=1, ensure_ascii=False)
    J = {t: cache[f"{QSET}|{t}"] for t in titles}

    acc_s, n = pairs_right(CAL, lambda r: score(J[r[1]]))
    acc_m, _ = pairs_right(CAL, lambda r: J[r[1]]["million"])
    hits = [score(J[c[1]]) for c in CAL if c[2] >= 1_000_000]
    per_q = {q: pairs_right(CAL, lambda r, q=q: J[r[1]][q])[0] for q in Q}
    bar = min(hits)

    L = ["# Jev check: are this week's titles million-view material?", "",
         f"Made by `scripts/datayt/jev_views_check.py` with TypeSafe `{MODEL}` (question set `{QSET}`), 25 Oct 2026.", "",
         "Jev reads the title only. It does not see the video, the thumbnail, the channel or the algorithm, so this is a",
         "judgment of the wording, not a forecast of views. A new channel with no subscribers rarely reaches a million on",
         "any title.", "",
         "## Step 1: can Jev tell real hits from misses?", "",
         f"{len(CAL)} real Shorts from Think School, Finshots TV and Wint Wealth (views from vidIQ, 25 Oct 2026). Within each",
         "channel, the top half by views is compared with the bottom half, so channel size does not decide it.", "",
         "| Measure | Pairs ordered right (50 % = coin toss) |", "| --- | --- |",
         f"| Jev score (weighted) | {acc_s:.0%} of {n} |",
         f"| Jev's \"a million views?\" probability | {acc_m:.0%} of {n} |"]
    L += [f"| {q} alone | {v:.0%} |" for q, v in per_q.items()]
    L += ["", "| Channel | Title | Views | Jev score | Million? |", "| --- | --- | --- | --- | --- |"]
    L += [f"| {c} | {t} | {v:,} | {score(J[t])} | {J[t]['million']:.0%} |" for c, t, v in sorted(CAL, key=lambda c: (c[0], -c[2]))]
    L += ["", f"Lowest Jev score among the {len(hits)} real million-view titles: **{bar}**.", "",
          "## Step 2: this week's titles", "",
          "| Day | Slot | Title | Jev score | Million? | Curiosity | Mass | Stakes | Surprise | Clear |",
          "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"]
    for d, s, t in sorted(WEEK, key=lambda w: -score(J[w[2]])):
        j = J[t]
        L.append(f"| {d} | {s} | {t} | **{score(j)}** | {j['million']:.0%} | " + " | ".join(f"{j[q]:.2f}" for q in ["curiosity", "mass", "stakes", "surprise", "clear"]) + " |")
    L += ["", "## Step 3: hook titles for the built state comparisons", "",
          "Ranked by Jev's \"Million?\" judgment, the measure that held up in step 1. Best per Short in bold.", "",
          "| Short | Title | Chars | Million? |", "| --- | --- | --- | --- |"]
    for sid, ts in RETITLE.items():
        best = max(ts, key=lambda t: J[t]["million"])
        L.append(f"| {sid} | {OLD[sid]} *(current)* | {len(OLD[sid])} | {J[OLD[sid]]['million']:.0%} |")
        L += [f"| {sid} | {'**' + t + '**' if t == best else t} | {len(t)} | {J[t]['million']:.0%} |" for t in sorted(ts, key=lambda t: -J[t]["million"])]
    open(OUT, "w").write("\n".join(L) + "\n")
    print("\n".join(L))


if __name__ == "__main__":
    main()

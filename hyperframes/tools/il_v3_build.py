"""India Ledger gold episode V3 ("The Govt Bet Against Gold and Lost. You're Paying for It."), docs/INDIA_LEDGER_EP1_V3.md.

Voiced like Acts 1-5 (one MiniMax call per paragraph, beat timings from MiniMax's sentence timestamps), reusing their code.
usage:
  il_v3_build.py draft | build | verify | mux
The check() below stops the build if any spoken number disagrees with scripts/india_ledger_gold.py.
"""
import contextlib, io, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import il_act1_build as A   # noqa: E402
import il_act2_build as A2  # noqa: E402
G, SB = A.G, A.SB
A.ID = "il-gold-v3"
A.PROJ = A.ROOT / "hyperframes" / "videos" / A.ID
A.ADIR = SB.OUT / "shorts_audio" / A.ID
A.PARA_GAP = 0.6

# (emotion, [(beat id, text)]) ; beat ids are prefixed by scene number so index.html can find them
A.PARAS = [
  # 1 The bet
  (None, [("s1_bet", "In twenty fifteen, the Government of India made a bet against gold."),
          ("s1_lost", "<#0.6#>It lost.<#0.4#> Gold went up almost five times.")]),
  ("surprised", [("s1_week", "Last week, one batch of its gold bonds paid back four point four times the money.")]),
  (None, [("s1_bill", "And the bill?<#0.4#> You're paying it.<#0.3#> About six hundred and fifty rupees for every Indian."),
          ("s1_q", "<#0.7#>So how do you lose money on gold that only went up?"),
          ("s1_bangle", "<#0.5#>It starts with a bangle.")]),
  # 2 The pile India can't touch
  (None, [("s2_meet", "Meet Amma. This bangle was her mother's. It has never left her locker."),
          ("s2_pile", "<#0.5#>Now multiply Amma by crores of homes. Indian families hold an estimated thirty one thousand tonnes of gold."),
          ("s2_mined", "<#0.5#>And almost none of it was dug up in India. For every gram India mines, it buys four hundred and forty three from abroad."),
          ("s2_import", "<#0.5#>Gold is India's second-biggest import, after crude oil. Paid in dollars. Every single year."),
          ("s2_saw", "<#0.6#>So the government looked at Amma's locker, and saw a problem.<#0.3#> And an opportunity.")]),
  # 3 Two plans
  (None, [("s3_launch", "On the fifth of November twenty fifteen, Prime Minister Narendra Modi launched the plans to get at it."),
          ("s3_a", "<#0.5#>Plan A: get Amma to hand over her gold."),
          ("s3_b", "<#0.4#>Plan B: if she won't, sell her gold that doesn't exist.")]),
  # 4 Plan A
  (None, [("s4_simple", "Plan A sounded simple. Lend your gold to a bank. Earn interest. Help the country."),
          ("s4_rules", "<#0.5#>But read the rules. Your jewellery is tested, and melted. You get back gold.<#0.3#> Never your piece."),
          ("s4_asking", "<#0.5#>So the government wasn't asking for idle gold. It was asking for the bangle from her mother. And offering to return it as a bar."),
          ("s4_no", "<#0.6#>Amma said no.<#0.3#> So did almost everyone."),
          ("s4_tonnes", "<#0.5#>In nine years, India lent about thirty one tonnes. The country imports that much in about sixteen days."),
          ("s4_dead", "<#0.6#>Plan A was dead.<#0.3#> Plan B was the real bet.")]),
  # 5 Plan B
  ("happy", [("s5_ravi", "Ravi, next door, loved Plan B."),
             ("s5_terms", "<#0.4#>Pay rupees today for ten grams of gold. Eight years later, the government pays you whatever ten grams is worth. Plus two and a half percent interest, every year."),
             ("s5_locker", "<#0.4#>No locker. No making charges. No uncle asking if it's real.")]),
  (None, [("s5_never", "Here's what Ravi didn't think about.<#0.4#> The government never bought any gold."),
          ("s5_spent", "<#0.5#>It took his rupees and spent them, like any other loan. All it kept was a promise: to pay back at whatever gold costs on the day."),
          ("s5_flat", "<#0.5#>If gold stayed flat, that's a very cheap loan. If gold shot up, the government pays the difference."),
          ("s5_bet", "<#0.6#>That was the bet. That gold wouldn't rise much.<#0.4#> In India.")]),
  # 6 The bet goes wrong
  (None, [("s6_again", "From twenty fifteen to twenty twenty four, the government sold this bet again and again. Seventy two thousand crore rupees of it."),
          ("s6_does", "<#0.6#>Then gold did what gold does in India."),
          ("s6_price", "<#0.4#>When the first bond was sold, ten grams cost under twenty seven thousand rupees. This week, about one lakh thirty thousand."),
          ("s6_bill", "<#0.5#>Every time gold went up, the government's bill went up with it."),
          ("s6_owes", "<#0.5#>Today it owes about one point six lakh crore rupees on bonds still out there. And that number moves every single day."),
          ("s6_breakfast", "<#0.6#>Most of us check the gold price before a wedding. Someone in the finance ministry checks it before breakfast.")]),
  # 7 Who pays
  (None, [("s7_who", "So who pays?<#0.4#> Not Ravi. Ravi won, fair and square. He bought what was offered. And if he held to the end, his gain is tax-free."),
          ("s7_you", "<#0.5#>The bill goes to the budget.<#0.3#> And the budget is you."),
          ("s7_fair", "<#0.6#>Now, to be fair, most of that one point six lakh crore is money the government borrowed. It would owe that on any loan."),
          ("s7_went", "<#0.5#>So we went bond by bond, all sixty seven of them, and took that out."),
          ("s7_real", "<#0.5#>What's left is the real price of the bet: close to one lakh crore rupees. About six hundred and fifty rupees for every man, woman and child in India."),
          ("s7_never", "<#0.6#>A bet you never placed.<#0.3#> A bill you're paying.")]),
  # 8 Amma won twice
  ("happy", [("s8_twice", "And Amma? She won twice. She got the full rise in gold. And she still has the bangle."),
             ("s8_pawn", "<#0.5#>She still won't lend her gold to a bank. But she will pawn it. Bank loans against gold jewellery grew almost ninety percent in one year."),
             ("s8_same", "<#0.5#>Same bangle goes in.<#0.3#> Same bangle comes out.")]),
  # 9 Was it a scam?
  (None, [("s9_scam", "So was it a scam?<#0.4#> No. And this part matters."),
          ("s9_fell", "<#0.5#>In the three years before the first bond, gold actually fell. For three years after, it barely moved. Nobody knew it was about to go up almost five times."),
          ("s9_lost", "<#0.5#>It was a reasonable bet. It just lost. And a bet that loses still has to be paid."),
          ("s9_last", "<#0.5#>The last new gold bond was sold in February twenty twenty four.")]),
  # 10 You're paying for it
  (None, [("s10_wgc", "Now there's a new proposal, from the World Gold Council: a national gold board, to bring household gold into the system. Attempt number three."),
          ("s10_ask", "<#0.5#>This time, maybe someone asks Amma first."),
          ("s10_end", "<#0.7#>The government bet against gold. It lost. Ravi won. Amma kept her bangle."),
          ("s10_you", "<#0.6#>And you?<#0.4#> You're paying for it.")]),
]

GOLD_LOAN_PCT = 88        # RBI Bulletin Sep 2026, bank credit by sector, 31 Jul 2026 (D-gold loans)
LAST_ISSUE = "February 2024"
WEEK_X = 4.41             # RBI press release 13 Nov 2026: +341% (issue price -> redemption price)

def numbers():
    with contextlib.redirect_stdout(io.StringIO()):
        imp = G.imports(); sgb = G.sgb_model()
    t = sgb["tranches"]
    return {"x": round(G.PRICE_TODAY / float(t.iloc[0].issue_price), 2), "first10": float(t.iloc[0].issue_price) * 10,
            "today10": G.PRICE_TODAY * 10, "today_label": G.PRICE_LABEL, "owed_cr": round(sgb["owed"]), "net_cr": round(sgb["net"]),
            "per_indian": round(sgb["per_indian"]), "n_tr": len(t), "raised_cr": round(float(t.raised.sum())),
            "household_t": G.HOUSEHOLD_T, "mined_per": round(imp["t26"] / G.MINE_OUTPUT_T), "rank": int(imp["rank26"]),
            "gms_t": round(G.GMS_KG / 1000, 1), "gms_days": round(G.GMS_KG / 1000 / imp["t26"] * 365, 1),
            "gold_loan_pct": GOLD_LOAN_PCT, "week_x": WEEK_X,
            "price_series": [[d.strftime("%Y-%m-%d"), float(v)] for d, v in zip(t.d, t.issue_price)] + [[G.PRICE_DATE, float(G.PRICE_TODAY)]]}

def check(n):
    said = " ".join(A.say_of(x) for _, parts in A.PARAS for _, x in parts)
    want = {
        "Gold went up almost five times": 4.5 <= n["x"] < 5,
        "four point four times": round(n["week_x"], 1) == 4.4,
        "six hundred and fifty rupees": 640 <= n["per_indian"] <= 665,
        "thirty one thousand tonnes": n["household_t"] == 31_000,
        "four hundred and forty three": n["mined_per"] == 443,
        "second-biggest import": n["rank"] == 2,
        "about thirty one tonnes": round(n["gms_t"]) == 31,
        "about sixteen days": round(n["gms_days"]) == 16,
        "Seventy two thousand crore": 72_000 <= n["raised_cr"] < 73_000,
        "under twenty seven thousand": n["first10"] < 27_000,
        "about one lakh thirty thousand": 125_000 <= n["today10"] <= 135_000,
        "one point six lakh crore": round(n["owed_cr"] / 1e5, 1) == 1.6,
        "all sixty seven": n["n_tr"] == 67,
        "close to one lakh crore": 90_000 <= n["net_cr"] < 100_000,
        "almost ninety percent": 85 <= n["gold_loan_pct"] < 90,
    }
    bad = [k for k, ok in want.items() if k not in said or not ok]
    if bad: sys.exit(f"script and data disagree: {bad}")
    print("spoken numbers agree with the data:", len(want), "checks")

A.numbers = numbers; A2.numbers = numbers; A2.check = check
if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    if cmd in ("build", "check"): check(numbers())
    if cmd != "check": {"draft": A2.draft, "build": A.build, "verify": A.verify, "mux": A.mux}[cmd]()

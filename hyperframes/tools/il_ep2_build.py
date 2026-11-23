"""India Ledger Episode 2, "Why Is Gold Falling?" (docs/INDIA_LEDGER_EP2_SCRIPT.md, Draft 5 + 24K/22K edits).

Voiced like Episode 1 V3 (one MiniMax call per paragraph, beat timings from MiniMax's sentence timestamps), reusing its code.
usage:
  il_ep2_build.py check | draft | build | verify | mux
  then: il_ep2_page.py (fits the clips, writes index.html), hf.py check/snap/render il-gold-ep2
check() stops the build if any spoken number disagrees with the IBJA series or the constants below.
Recording-day rule: re-read IBJA 999/916 PM (ibjarates.com), refresh assets/data/ibja_series.json, re-run check.
"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import il_act1_build as A   # noqa: E402
import il_act2_build as A2  # noqa: E402
SB = A.SB
A.ID = "il-gold-ep2"
A.PROJ = A.ROOT / "hyperframes" / "videos" / A.ID
A.ADIR = SB.OUT / "shorts_audio" / A.ID
A.PARA_GAP = 0.6

A.PARAS = [
  # 1 · ₹3,800 a gram (AK 20 Nov: the hook must land by 15-20 s; the numbers follow it)
  (None, [("s1_cheap", "Twenty-four carat gold is about three thousand eight hundred rupees less a gram than in August.")]),
  ("surprised", [("s1_up", "Strange. Right now, gold should be going up."),
                 ("s1_worry", "<#0.3#>Worried people buy gold, and prices in America are still rising."),
                 ("s1_usa", "<#0.3#>Central banks are buying it by the tonne.")]),
  (None, [("s1_why", "So why is gold falling?<#0.3#> And who is selling?"),
          ("s1_end", "<#0.4#>By the end of this video, you'll know. The answer is one simple idea.")]),
  (None, [("s1_aug", "First, how big is the fall? In August, one gram of twenty-four carat gold cost about sixteen thousand two hundred rupees."),
          ("s1_today", "<#0.4#>Today, about twelve thousand four hundred."),
          ("s1_less", "<#0.5#>On just ten grams, that's about thirty-eight thousand rupees,<#0.3#> gone."),
          ("s1_22k", "<#0.6#>And twenty-two carat, the gold most jewellery is made of? About three thousand five hundred rupees less a gram.")]),
  # 2 · Gold pays you nothing
  (None, [("s2_fact", "Now, one simple fact about gold."),
          ("s2_fd", "<#0.4#>Put a hundred rupees in a bank FD, and the bank pays you extra every year. That's interest."),
          ("s2_shop", "<#0.3#>Own a shop, and you can rent it out. Buy a company's share, and it may pay you a dividend."),
          ("s2_gold", "<#0.5#>Now buy a hundred rupees of gold. Keep it for a year. You still have exactly that gold. Nothing extra.<#0.3#> Not one rupee."),
          ("s2_zero", "<#0.6#>Gold pays you nothing.")]),
  (None, [("s2_why", "So why do people own it? Because when bad times come, gold usually holds its value. It's a safety net."),
          ("s2_cost", "<#0.4#>But a safety net isn't free. And right now, it's become very costly to hold. Here's why.")]),
  # 3 · America's FD pays more now
  (None, [("s3_fd", "The world's biggest investors also have something like an FD. It's lending money to the American government. They call it a government bond."),
          ("s3_five", "<#0.5#>Right now, for every hundred rupees you lend the American government for ten years, it pays you about five rupees every year."),
          ("s3_three", "<#0.4#>Even after you take out the rise in prices in America, you still keep almost three rupees."),
          ("s3_miss", "<#0.5#>So think like a big investor. If you keep your money in gold, you miss that three rupees, every year, on every hundred rupees.")]),
  (None, [("s3_ago", "A few years ago, that bond paid almost nothing. So keeping gold cost almost nothing."),
          ("s3_today", "<#0.4#>Today, keeping gold costs more than it has in years. And when something costs more to keep, some people stop keeping it."),
          ("s3_why", "<#0.5#>So why is America paying so much? That's where the real story starts.")]),
  # 4 · America's RBI changed its mind
  (None, [("s4_rbi", "In India, the RBI decides interest rates. America has its own RBI. It's called the Federal Reserve."),
          ("s4_cut", "<#0.5#>At the start of this year, people expected America's RBI to cut interest rates. Lower rates are good for gold, because then the bond pays less and gold looks better. That hope helped push gold to its record.")]),
  (None, [("s4_sep", "But prices in America kept going up. So in September, America's RBI did the opposite. It raised interest rates."),
          ("s4_oct", "<#0.4#>In October it waited. But two of its members wanted to raise them again, right away."),
          ("s4_min", "<#0.4#>On the eighteenth of November, it published the notes of that meeting. Almost all its members said more increases would probably be needed."),
          ("s4_opp", "<#0.5#>So the one thing gold needed, lower interest rates, turned into its opposite."),
          ("s4_dec", "<#0.5#>America's RBI decides again on the ninth of December.<#0.3#> Remember that date.")]),
  # 5 · The dollar, and our rupee
  (None, [("s5_dollar", "The second push came from the dollar."),
          ("s5_usd", "<#0.4#>Around the world, gold is bought and sold in US dollars. When America pays more interest, money from everywhere rushes into dollars. The dollar gets stronger."),
          ("s5_cost", "<#0.4#>A stronger dollar makes gold costlier for every country outside America. So they buy less. And the price falls."),
          ("s5_may", "<#0.4#>This month, the dollar became its strongest since May last year.")]),
  (None, [("s5_rupee", "But we don't buy gold in dollars. We buy it in rupees."),
          ("s5_price", "<#0.4#>Our price is, roughly, the world price, changed into rupees, plus the tax India charges on gold coming in."),
          ("s5_nov", "<#0.5#>So when the rupee gets stronger, gold falls even faster here. That happened in early November. The rupee rose, and gold in India fell more than five percent in under two weeks."),
          ("s5_15", "<#0.5#>In just the last fifteen days, one gram of twenty-four carat got about two thousand rupees cheaper.")]),
  # 6 · So who is buying? (peak)
  (None, [("s6_run", "So far, it sounds like everyone is running away from gold."),
          ("s6_guess", "<#0.5#>Before you see the answer, take a guess. From July to September, did the world's central banks buy more gold, or less, than a year before?")]),
  ("surprised", [("s6_more", "<#1.2#>They bought more. Three hundred and twenty-one tonnes in just three months. That's about as heavy as sixty elephants. And forty-two percent more than a year before.")]),
  (None, [("s6_two", "So the price isn't falling because everyone is selling. There are two kinds of gold owners."),
          ("s6_fast", "<#0.5#>The first kind is fast money: traders and big funds who move money every day. Many of them even borrow to buy gold. When interest rates and the dollar turn against gold, they sell, fast."),
          ("s6_forced", "<#0.3#>And when the price falls quickly, the ones who borrowed are forced to sell more. That pushes the price down again."),
          ("s6_slow", "<#0.5#>The second kind is slow money: central banks, like our RBI, saving gold for the long run. They don't sell because of one meeting in America."),
          ("s6_now", "<#0.5#>Right now, the fast money is deciding the price.")]),
  (None, [("s6_answer", "So here's the answer. Gold isn't falling because the world got safer."),
          ("s6_paying", "<#0.4#>It's falling because money in the bank started paying again."),
          ("s6_first", "<#0.8#>And the fastest money noticed first.")]),
  # 7 · Indian families and gold
  (None, [("s7_home", "Now let's bring this home."),
          ("s7_less", "<#0.4#>When gold was at record prices, Indians bought less of it. From July to September, India bought twenty-nine percent less gold, by weight, than a year before."),
          ("s7_light", "<#0.4#>People still spent money on gold. But they bought lighter, smaller pieces."),
          ("s7_fest", "<#0.5#>Now that gold is cheaper, some buyers may come back. This festive season, Indians spent fifteen to twenty-five percent more on gold, but the grams they bought stayed about the same."),
          ("s7_wait", "<#0.5#>So if you were waiting for gold to get cheaper, it just did. But nobody can tell you if this is the lowest it will go.")]),
  # 8 · Read the fine print
  (None, [("s8_hide", "Before we finish, two things these numbers hide."),
          ("s8_units", "<#0.4#>One. If you see a headline saying gold crashed by a third, check the units. That's usually the dollar price, per ounce, abroad. Your price is in rupees, per gram, and it moved by a different amount."),
          ("s8_est", "<#0.5#>Two. Many central banks don't tell anyone every tonne they buy. So part of that buying is an estimate.")]),
  # 9 · What to watch, and the close
  (None, [("s9_where", "So where does gold go from here? Honestly, nobody knows. Anyone who tells you a date and a price is lying."),
          ("s9_three", "<#0.5#>But you can watch three things."),
          ("s9_one", "<#0.4#>One: America's RBI, on the ninth of December. If it raises rates again, that's bad for gold. If it says it's done, that helps."),
          ("s9_two", "<#0.4#>Two: the dollar. If it gets weaker, gold gets room to breathe."),
          ("s9_slow", "<#0.4#>Three: the slow money. If central banks keep buying while traders sell, someone is quietly collecting what others are dropping.")]),
  (None, [("s9_idea", "And remember the one idea from the start. Gold pays nothing."),
          ("s9_fine", "<#0.3#>That's fine when the bank pays nothing too."),
          ("s9_harder", "<#0.4#>But when the bank pays again, gold has to work much harder.")]),
]

# primary-source constants (fact ledger in the script doc)
DGS10, DFII10 = 5.1, 2.9          # FRED DGS10 5.07-5.15 %, DFII10 2.88-2.92 %, 13-18 Nov 2026
CB_T, CB_PCT = 321, 42            # WGC Gold Demand Trends Q3 2026: central banks
INDIA_Q3_PCT = -29                # WGC India Focus Q3 2026, by weight
INDIA_NOV_PCT = -5.3              # WGC India market update, 17 Nov 2026 (to 12 Nov)
FEST = (15, 25)                   # WGC India update: festive value +15-25 %, volume flat
ELEPHANT_T = 5                    # illustrative, our arithmetic
SERIES = A.PROJ / "assets" / "data" / "ibja_series.json"
AUG, NOV5 = "2026-08-24", "2026-11-05"


def numbers():
    s = json.loads(SERIES.read_text())
    d, g9, g6 = s["d"], s["g999"], s["g916"]
    g = lambda arr, day: arr[d.index(day)] / 10
    today = d[-1]
    return {"aug": g(g9, AUG), "now": g(g9, today), "aug22": g(g6, AUG), "now22": g(g6, today), "nov5": g(g9, NOV5),
            "today": today, "dgs10": DGS10, "dfii10": DFII10, "cb_t": CB_T, "cb_pct": CB_PCT, "india_pct": INDIA_Q3_PCT,
            "india_nov": INDIA_NOV_PCT, "fest": FEST, "elephants": round(CB_T / ELEPHANT_T),
            "series": [[x, v / 10] for x, v in zip(d, g9)]}


def check(n):
    said = " ".join(A.say_of(x) for _, parts in A.PARAS for _, x in parts)
    drop, drop22, drop15 = n["aug"] - n["now"], n["aug22"] - n["now22"], n["nov5"] - n["now"]
    want = {
        "sixteen thousand two hundred rupees": round(n["aug"] / 100) == 162,
        "about twelve thousand four hundred": round(n["now"] / 100) == 124,
        "about three thousand eight hundred rupees less": 3750 <= drop < 3850,
        "about thirty-eight thousand rupees": 37_500 <= drop * 10 < 38_500,
        "About three thousand five hundred rupees less a gram": 3450 <= drop22 < 3550,
        "about two thousand rupees cheaper": 1900 <= drop15 < 2100,
        "about five rupees every year": 4.8 <= n["dgs10"] < 5.3,
        "almost three rupees": 2.7 <= n["dfii10"] < 3.0,
        "Three hundred and twenty-one tonnes": n["cb_t"] == 321,
        "about as heavy as sixty elephants": 58 <= n["elephants"] <= 66,
        "forty-two percent more": n["cb_pct"] == 42,
        "twenty-nine percent less gold": n["india_pct"] == -29,
        "more than five percent in under two weeks": n["india_nov"] <= -5,
        "fifteen to twenty-five percent more": tuple(n["fest"]) == (15, 25),
    }
    bad = [k for k, ok in want.items() if k not in said or not ok]
    if bad:
        sys.exit(f"script and data disagree: {bad}")
    print("spoken numbers agree with the data:", len(want), "checks · IBJA last day", n["today"],
          f"· 24K {n['aug']:.0f}->{n['now']:.0f} (-{drop:.0f}) · 22K -{drop22:.0f} · 15 days -{drop15:.0f}")


A.numbers = numbers; A2.numbers = numbers; A2.check = check
if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    if cmd in ("build", "check"):
        check(numbers())
    if cmd != "check":
        {"draft": A2.draft, "build": A.build, "verify": A.verify, "mux": A.mux}[cmd]()

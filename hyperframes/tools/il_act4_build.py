"""India Ledger gold episode, Act 4: "Who pays, who gains, and what families do now" (docs/INDIA_LEDGER_EP1_SCRIPT.md).

Built exactly like Acts 1-3 and reusing their code: paragraphs voiced in one MiniMax call each, beat timings from
MiniMax's sentence timestamps, every number from scripts/india_ledger_gold.py or a primary source named below.

usage:
  python3 hyperframes/tools/il_act4_build.py draft     estimated timings (no voice, no cost) so the picture can be checked
  python3 hyperframes/tools/il_act4_build.py           voice the act (MiniMax), write videos/il-gold-act4/act.js
  python3 hyperframes/tools/il_act4_build.py verify    transcribe the voice track; every script word must be heard
  python3 hyperframes/tools/hf.py sync il-gold-act4 && python3 hyperframes/tools/hf.py render il-gold-act4
  python3 hyperframes/tools/il_act4_build.py mux       -> out/hyperframes/il-gold-act4-final.mp4 (voice only, -16 LUFS)
"""
import contextlib
import io
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import il_act1_build as A   # noqa: E402  (tts_para, decode, build, verify, mux)
import il_act2_build as A2  # noqa: E402  (draft, write; importing it points A at Act 2, so repoint below)

G, SB = A.G, A.SB
A.ID = "il-gold-act4"
A.PROJ = A.ROOT / "hyperframes" / "videos" / A.ID
A.ADIR = SB.OUT / "shorts_audio" / A.ID

# Bank credit to "loans against gold jewellery", Rs crore: RBI Bulletin, Sep 2026, Current Statistics, p. 119 (D22)
GOLD_LOANS_CR, GOLD_LOANS_PREV_CR = 552_261, 293_568    # 31 Jul 2026, 25 Jul 2025

A.PARAS = [
    (None, [("bill", "So here's the bill."),
            ("out", "<#0.5#>About a hundred and twenty three tonnes of these bonds are still out there. At this month's price, the government owes about one point six lakh crore rupees on them."),
            ("moves", "<#0.6#>And it moves every day. Every time gold goes up by a thousand rupees a gram, the bill goes up by about twelve thousand crore.")]),
    ("happy", [("block", "Most of us check the gold price before a wedding.<#0.3#> Someone in North Block checks it before breakfast.")]),
    (None, [("cash", "About eighty thousand crore of it can be cashed in at the next redemption windows: those bonds are past five years, and the holders decide when."),
            ("waves", "<#0.5#>The bigger waves come in twenty twenty eight, and in twenty thirty one."),
            ("fund", "<#0.3#>The government has set up a fund to pay for it, and in twenty twenty five, that fund covered about half.")]),
    (None, [("pays", "So who pays?<#0.4#> The budget. Which means every taxpayer."),
            ("gains", "<#0.6#>Who gains? The bondholders. Fair and square: they bought what was offered."),
            ("tax", "<#0.3#>Hold to maturity from issue, and the gain is tax-free.")]),
    ("happy", [("hold", "If you hold a gold bond: congratulations, you won the bet."),
               ("taxp", "<#0.4#>If you pay income tax: congratulations, you also paid for it.")]),
    (None, [("fam", "And families? They still won't deposit their gold.<#0.4#> But they will pawn it."),
            ("loans", "<#0.5#>Bank loans against gold jewellery grew almost ninety percent in a year, to about five and a half lakh crore rupees.")]),
    ("happy", [("plan", "So the Indian family plan is: never sell the gold. Let the bank babysit it for a while."),
               ("same", "<#0.4#>Same bangle goes in. Same bangle comes out. That's the whole difference.")]),
    (None, [("verdict", "The government reached the same conclusion. In twenty twenty five, its own Economic Affairs Secretary called the bonds fairly high-cost borrowing, and said gold imports hadn't come down the way they'd hoped."),
            ("nonew", "<#0.5#>No new bonds have been sold since February twenty twenty four.")]),
    (None, [("scam", "But before you forward this video with SCAM in capital letters, stop."),
            ("hide", "<#0.5#>Because the numbers hide a few things.")]),
]


def numbers():
    with contextlib.redirect_stdout(io.StringIO()):
        sgb = G.sgb_model()
    t = sgb["tranches"]
    due = sgb["due"]
    return {
        "owed_cr": round(sgb["owed"]), "out_t": round(sgb["out_t"], 1), "per1000": round(sgb["per1000"]),
        "price": G.PRICE_TODAY, "today_label": G.PRICE_LABEL,
        "early_cr": round(sgb["early_cr"]), "early_t": round(sgb["early_t"], 1), "early_n": None,
        "due": [[f"FY {fy - 1}–{str(fy)[2:]}", round(v)] for fy, v in due.items()],
        "loans": GOLD_LOANS_CR, "loans_prev": GOLD_LOANS_PREV_CR,
        "loans_pct": round((GOLD_LOANS_CR / GOLD_LOANS_PREV_CR - 1) * 100, 1),
        "issues": [d.strftime("%Y-%m-%d") for d in t.d], "last_issue": t.d.max().strftime("%-d %b %Y"),
        "n_tr": len(t),
    }


def check(n):
    """The spoken numbers must agree with the data; fail loudly before paying for a voice."""
    said = " ".join(x for _, parts in A.PARAS for _, x in parts)
    due = dict(n["due"])
    big = sorted(due, key=due.get)[-2:]
    want = {
        "a hundred and twenty three tonnes": round(n["out_t"]) == 123,
        "one point six lakh crore": round(n["owed_cr"] / 1e5, 1) == 1.6,
        "about twelve thousand crore": round(n["per1000"], -3) == 12_000,
        "About eighty thousand crore": round(n["early_cr"], -4) == 80_000,
        "twenty twenty eight, and in twenty thirty one": sorted(big) == ["FY 2028–29", "FY 2031–32"],
        "almost ninety percent": 85 <= n["loans_pct"] < 90,
        "five and a half lakh crore": round(n["loans"] / 1e5, 1) == 5.5,
        "since February twenty twenty four": n["issues"][-1].startswith("2024-02"),
    }
    bad = [k for k, ok in want.items() if k not in said or not ok]
    if bad:
        sys.exit(f"script and data disagree: {bad}")
    print("spoken numbers agree with the data")


A.numbers = numbers
A2.check = check
A2.numbers = numbers

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    if cmd == "build":
        check(numbers())
    {"draft": A2.draft, "build": A.build, "verify": A.verify, "mux": A.mux}[cmd]()

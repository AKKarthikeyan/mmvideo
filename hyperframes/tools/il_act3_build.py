"""India Ledger gold episode, Act 3: "Two plans, one catch" (docs/INDIA_LEDGER_EP1_SCRIPT.md).

Built exactly like Acts 1 and 2 and reusing their code (il_act1_build.py, il_act2_build.py): paragraphs voiced in one
MiniMax call each, beat timings from MiniMax's sentence timestamps, every number from scripts/india_ledger_gold.py.

usage:
  python3 hyperframes/tools/il_act3_build.py draft     estimated timings (no voice, no cost) so the picture can be checked
  python3 hyperframes/tools/il_act3_build.py           voice the act (MiniMax), write videos/il-gold-act3/act.js
  python3 hyperframes/tools/il_act3_build.py verify    transcribe the voice track; every script word must be heard
  python3 hyperframes/tools/hf.py sync il-gold-act3 && python3 hyperframes/tools/hf.py render il-gold-act3
  python3 hyperframes/tools/il_act3_build.py mux       -> out/hyperframes/il-gold-act3-final.mp4 (voice only, -16 LUFS)
"""
import contextlib
import io
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
import il_act1_build as A   # noqa: E402  (tts_para, decode, build, verify, mux)
import il_act2_build as A2  # noqa: E402  (draft, write; importing it points A at Act 2, so repoint below)

G, SB = A.G, A.SB
A.ID = "il-gold-act3"
A.PROJ = A.ROOT / "hyperframes" / "videos" / A.ID
A.ADIR = SB.OUT / "shorts_audio" / A.ID

GMS_T, GMS_DEPOSITORS = 31.164, 5_693    # Gold Monetisation Scheme to Nov 2024: Ministry of Finance statement, 25 Mar 2025, as reported

A.PARAS = [
    (None, [("planA", "Plan A was simple. Indian homes hold an estimated thirty one thousand tonnes of gold."),
            ("lockers", "<#0.5#>If even a small part of it came out of lockers and into banks, India could import less."),
            ("wins", "<#0.4#>You deposit your gold. You earn interest. The country saves dollars. Everybody wins.")]),
    (None, [("howmuch", "So how much came out of the lockers?"),
            ("nota", "<#0.6#>Not a thousand tonnes.<#0.3#> Not a hundred."),
            ("t31", "<#0.7#>Thirty one tonnes. In nine years. From fewer than six thousand depositors."),
            ("pct01", "<#0.5#>That's zero point one percent of the gold in Indian homes."),
            ("days", "<#0.6#>India imports that much in about sixteen days."),
            ("shop", "<#0.5#>Nine years of persuasion.<#0.3#> Sixteen days of shopping.")]),
    (None, [("why", "Why did it fail? Here's the line in the rules that nobody puts on the poster."),
            ("melt", "<#0.7#>Your jewellery is tested, and with your consent, melted. After that, you can only get back gold.<#0.3#> Never the piece."),
            ("idle", "<#0.6#>So the government wasn't asking for idle gold."),
            ("bangle", "<#0.3#>It was asking for the bangle from her wedding. The chain her mother gave her. And it was offering to return it as a bar.")]),
    ("happy", [("amma", "You can guess what Amma said.<#0.3#> You can probably guess the tone, too.")]),
    (None, [("shut", "In March twenty twenty five, the government shut the long-term parts of Plan A."),
            ("toB", "<#0.4#>Which brings us to Plan B.")]),
    (None, [("planB", "Plan B was clever. If families won't give you their gold, sell them gold that doesn't exist."),
            ("bond", "<#0.6#>A Sovereign Gold Bond. You pay rupees today, for, say, ten grams."),
            ("later", "<#0.3#>Eight years later, the government pays you whatever ten grams of gold is worth on that day."),
            ("coupon", "<#0.3#>Plus two and a half percent interest every year.")]),
    ("happy", [("loved", "No locker. No making charges. No uncle asking if it's real.<#0.3#> People loved it.")]),
    (None, [("issues", "Sixty seven issues, from twenty fifteen to twenty twenty four. A hundred and forty seven tonnes' worth. Seventy two thousand crore rupees."),
            ("catch", "<#0.7#>And here's the catch."),
            ("never", "<#0.6#>The government never bought the gold."),
            ("loan", "<#0.6#>Legally, a gold bond is a government loan. The rupees came in, and were spent like any other borrowing."),
            ("promise", "<#0.4#>What the government kept was a promise: to repay at whatever gold costs on the day.")]),
    (None, [("flat", "Think about what that means. If gold stays flat, it's a cheap loan: two and a half percent, instead of the seven or so a normal government bond pays."),
            ("up", "<#0.4#>If gold shoots up, the government pays the difference."),
            ("bet", "<#0.6#>It's a bet that gold won't rise much."),
            ("mother", "<#0.4#>Against the one asset every Indian mother has been buying since before the government existed.")]),
    (None, [("ten", "Ten grams cost twenty six thousand eight hundred rupees when the first bond was sold."),
            ("month", "<#0.4#>This month: one lakh thirty three thousand."),
            ("five", "<#0.5#>Five times.")]),
    (None, [("first", "The very first batch: counting the interest, it cost the government twelve point nine percent a year."),
            ("normal", "<#0.3#>A normal loan that month cost seven point seven five."),
            ("all", "<#0.6#>Across every bond that's been repaid so far, it works out to about sixteen percent a year."),
            ("double", "<#0.3#>More than double a normal loan.")]),
    ("happy", [("lender", "Somewhere, a moneylender is taking notes.")]),
    (None, [("ammab", "And Amma? She held the real thing. She got the full rise, and she still has the bangle."),
            ("both", "<#0.5#>She won both ways.<#0.3#> She also never had to log into a demat account.")]),
]


def numbers():
    with contextlib.redirect_stdout(io.StringIO()):
        imp = G.imports()
        sgb = G.sgb_model()
    t = sgb["tranches"]
    f = t.iloc[0]
    m = t[t.matured]
    fy = (t.d.dt.year + (t.d.dt.month >= 4)).value_counts().sort_index()
    return {
        "household_t": G.HOUSEHOLD_T, "gms_t": GMS_T, "gms_dep": GMS_DEPOSITORS,
        "gms_pct": round(GMS_T / G.HOUSEHOLD_T * 100, 2), "gms_days": round(GMS_T / imp["t26"] * 365, 1),
        "n_tr": len(t), "sgb_t": round(t.units_g.sum() / 1e6, 2), "sgb_cr": round(t.raised.sum()),
        "per_fy": [[f"{y - 1}–{str(y)[2:]}", int(n)] for y, n in fy.items()],
        "first10": round(f.issue_price * 10), "today10": round(G.PRICE_TODAY * 10), "today_label": G.PRICE_LABEL,
        "x": round(G.PRICE_TODAY / f.issue_price, 1),
        "price": [[d.strftime("%Y-%m-%d"), float(p)] for d, p in zip(t.d, t.issue_price)] + [[G.PRICE_DATE, float(G.PRICE_TODAY)]],
        "first_rate": round(f.sgb_rate, 1), "first_gsec": round(f.y, 2),
        "mat_n": len(m), "mat_rate": round(sgb["matured_rate"], 1), "mat_gsec": round(sgb["matured_gsec"], 1),
        "owed_cr": round(sgb["owed"]),
    }


def check(n):
    """The spoken numbers must agree with the data; fail loudly before paying for a voice."""
    said = " ".join(x for _, parts in A.PARAS for _, x in parts)
    want = {
        "thirty one thousand tonnes": n["household_t"] == 31_000,
        "Thirty one tonnes": round(n["gms_t"]) == 31, "fewer than six thousand": n["gms_dep"] < 6000,
        "zero point one percent": round(n["gms_pct"], 1) == 0.1, "about sixteen days": round(n["gms_days"]) == 16,
        "Sixty seven issues": n["n_tr"] == 67, "A hundred and forty seven tonnes": round(n["sgb_t"]) == 147,
        "Seventy two thousand crore": round(n["sgb_cr"], -3) == 72_000,
        "twenty six thousand eight hundred": round(n["first10"], -2) == 26_800,
        "one lakh thirty three thousand": round(n["today10"], -3) == 133_000, "Five times": round(n["x"]) == 5,
        "twelve point nine percent": n["first_rate"] == 12.9, "seven point seven five": n["first_gsec"] == 7.75,
        "about sixteen percent a year": round(n["mat_rate"]) == 16, "More than double": n["mat_rate"] > 2 * n["mat_gsec"],
        "seven or so": 6.5 <= n["mat_gsec"] <= 7.5,
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

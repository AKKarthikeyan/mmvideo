"""India Ledger gold episode, Act 5: "What the numbers hide" (docs/INDIA_LEDGER_EP1_SCRIPT.md).

Built exactly like Acts 1-4 and reusing their code: paragraphs voiced in one MiniMax call each, beat timings from
MiniMax's sentence timestamps, every number from scripts/india_ledger_gold.py or a primary source named below.

usage:
  python3 hyperframes/tools/il_act5_build.py draft     estimated timings (no voice, no cost) so the picture can be checked
  python3 hyperframes/tools/il_act5_build.py           voice the act (MiniMax), write videos/il-gold-act5/act.js
  python3 hyperframes/tools/il_act5_build.py verify    transcribe the voice track; every script word must be heard
  python3 hyperframes/tools/hf.py sync il-gold-act5 && python3 hyperframes/tools/hf.py render il-gold-act5
  python3 hyperframes/tools/il_act5_build.py mux       -> out/hyperframes/il-gold-act5-final.mp4 (voice only, -16 LUFS)
"""
import contextlib
import io
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import il_act1_build as A   # noqa: E402  (tts_para, decode, build, verify, mux)
import il_act2_build as A2  # noqa: E402  (draft, write; importing it points A at Act 2, so repoint below)

G, SB = A.G, A.SB
A.ID = "il-gold-act5"
A.PROJ = A.ROOT / "hyperframes" / "videos" / A.ID
A.ADIR = SB.OUT / "shorts_audio" / A.ID

# Mumbai, Rs per 10 g, yearly average: RBI Handbook of Statistics on Indian Economy 2019, Table 39 (D23)
RBI_HANDBOOK = [["2012–13", 30_164], ["2013–14", 29_190], ["2014–15", 27_415], ["2015–16", 26_534],
                ["2016–17", 29_665], ["2017–18", 29_300], ["2018–19", 31_193]]
SAVED_USD_BN = 3.3      # imports saved by the bonds in FY 2023-24, one estimate: Business Standard, Mar 2024 (D15)
WGC_PCT = (10, 15)      # WGC "Swarnim Udaan 2047", 4 Aug 2026: mobilise 10-15% of household gold (D29)

A.PARAS = [
    (None, [("one", "One. Owing isn't losing."),
            ("part", "<#0.5#>Part of that one point six lakh crore is just the money the government borrowed. It would owe that on any loan."),
            ("cheap", "<#0.4#>And for years, it paid two and a half percent instead of seven."),
            ("went", "<#0.6#>So we went bond by bond, all sixty seven of them, and took that out.")]),
    (None, [("real", "The real extra cost of the bet, compared with borrowing normally: close to one lakh crore rupees, at today's price."),
            ("per", "<#0.5#>Almost seven hundred rupees for every Indian."),
            ("small", "<#0.6#>Smaller than the headline. Still the price of a lot of hospitals.")]),
    (None, [("two", "Two. It wasn't useless."),
            ("saved", "<#0.4#>One estimate says the bonds cut India's gold imports by three point three billion dollars in a single year.")]),
    (None, [("three", "Three. It looked safe at the time."),
            ("fell", "<#0.5#>In the three years before the first bond was sold, gold actually fell. For three years after, it barely moved."),
            ("knew", "<#0.5#>Nobody knew it would then go up five times.")]),
    ("happy", [("carat", "Hindsight is twenty four carat.")]),
    (None, [("four", "Four. Gold doesn't only go up. It dipped on the way, including when import duty was cut in twenty twenty four."),
            ("daily", "<#0.5#>The bill rises and falls with it, every single day.")]),
    (None, [("wgc", "Now a new plan is being proposed. The World Gold Council wants India to bring ten to fifteen percent of household gold into the system, with a National Gold Board.")]),
    ("happy", [("third", "Attempt number three.<#0.3#> Maybe this one asks Amma first.<#0.3#> And doesn't bring a furnace.")]),
    (None, [("right", "So who was right about gold?"),
            ("won", "<#0.6#>The bondholders won. The taxpayers paid.<#0.3#> And your mother kept her bangle."),
            ("left", "<#0.7#>Which leaves just one question.")]),
    (None, [("q", "How do you lose money… on gold that only went up?")]),
]


def numbers():
    with contextlib.redirect_stdout(io.StringIO()):
        sgb = G.sgb_model()
    t = sgb["tranches"]
    o = t[~t.matured]
    p = t[["d", "issue_price"]].reset_index(drop=True)
    hi = int(p[p.d.dt.year == 2020].issue_price.idxmax())                           # the 2020 peak (Aug 2020)
    lo = int(p[(p.index > hi) & (p.d.dt.year <= 2021)].issue_price.idxmin())          # the low after it (Mar 2021)
    return {
        "owed_cr": round(sgb["owed"]), "raised_out": round(o.raised.sum()), "gain_out": round(o.gold_gain.sum()),
        "gain_all": round(t.gold_gain.sum()), "saved_all": round(t.saved.sum()), "net": round(sgb["net"]),
        "net_lo": round(sgb["net_lo"]), "net_hi": round(sgb["net_hi"]), "per_indian": round(sgb["per_indian"]),
        "price": G.PRICE_TODAY, "lo_price": G.PRICE_TODAY - 2000, "hi_price": G.PRICE_TODAY + 2000,
        "per1000": round(sgb["per1000"]), "n_tr": len(t), "gsec": round(sgb["matured_gsec"], 1),
        "handbook": RBI_HANDBOOK, "saved_usd": SAVED_USD_BN, "wgc": list(WGC_PCT), "household_t": G.HOUSEHOLD_T,
        "price_series": [[d.strftime("%Y-%m-%d"), float(v)] for d, v in zip(t.d, t.issue_price)] + [[G.PRICE_DATE, float(G.PRICE_TODAY)]],
        "dip": [[p.d[hi].strftime("%b %Y"), float(p.issue_price[hi])], [p.d[lo].strftime("%b %Y"), float(p.issue_price[lo])]],
        "x": round(G.PRICE_TODAY / float(t.iloc[0].issue_price), 1), "first": float(t.iloc[0].issue_price),
        "today_label": G.PRICE_LABEL,
    }


def check(n):
    """The spoken numbers must agree with the data; fail loudly before paying for a voice."""
    said = " ".join(x for _, parts in A.PARAS for _, x in parts)
    hb = dict(n["handbook"])
    want = {
        "one point six lakh crore": round(n["owed_cr"] / 1e5, 1) == 1.6,
        "two and a half percent instead of seven": round(n["gsec"]) == 7,
        "all sixty seven": n["n_tr"] == 67,
        "close to one lakh crore": 90_000 <= n["net"] < 100_000,
        "Almost seven hundred rupees": 650 <= n["per_indian"] < 700,
        "three point three billion": n["saved_usd"] == 3.3,
        "gold actually fell": hb["2012–13"] > hb["2013–14"] > hb["2014–15"] > hb["2015–16"],
        "barely moved": abs(hb["2018–19"] / hb["2015–16"] - 1) < 0.2,
        "go up five times": round(n["x"]) == 5,
        "It dipped on the way": n["dip"][1][1] < n["dip"][0][1],
        "ten to fifteen percent": n["wgc"] == [10, 15],
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

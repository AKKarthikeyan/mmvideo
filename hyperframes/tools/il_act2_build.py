"""India Ledger gold episode, Act 2: "The problem India couldn't dig its way out of" (docs/INDIA_LEDGER_EP1_SCRIPT.md).

Built exactly like Act 1 and reusing its code (il_act1_build.py): paragraphs voiced in one MiniMax call each, beat timings
from MiniMax's sentence timestamps, every number from scripts/india_ledger_gold.py and the DGCIS file it reads.

usage:
  python3 hyperframes/tools/il_act2_build.py draft     estimated timings (no voice, no cost) so the picture can be checked
  python3 hyperframes/tools/il_act2_build.py           voice the act (MiniMax, 06:45-22:10 IST), write videos/il-gold-act2/act.js
  python3 hyperframes/tools/il_act2_build.py verify    transcribe the voice track; every script word must be heard
  python3 hyperframes/tools/hf.py sync il-gold-act2 && python3 hyperframes/tools/hf.py render il-gold-act2
  python3 hyperframes/tools/il_act2_build.py mux       -> out/hyperframes/il-gold-act2-final.mp4 (voice only, -16 LUFS)
"""
import contextlib
import io
import json
import re
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
import il_act1_build as A  # noqa: E402  (tts_para, decode, build, verify, mux; module globals are pointed at Act 2 below)

G, SB = A.G, A.SB
A.ID = "il-gold-act2"
A.PROJ = A.ROOT / "hyperframes" / "videos" / A.ID
A.ADIR = SB.OUT / "shorts_audio" / A.ID

# Act 2 as five paragraphs. Numbers are spelled the way they are said; each one is checked against the data in check().
A.PARAS = [
    (None, [("gram", "For every one gram of gold India digs out of its own ground… it buys four hundred and forty three."),
            ("mines", "<#0.6#>India mines about one point six tonnes a year. Last year, it imported seven hundred and twenty one."),
            ("second", "<#0.6#>Which makes gold India's second-biggest import. Right after crude oil.")]),
    ("happy", [("oil", "We run the country on oil. We run weddings on gold.<#0.4#> Priorities.")]),
    (None, [("dear", "And it's getting expensive. Four years ago, India paid three point four lakh crore rupees, for eight hundred and seventy nine tonnes."),
            ("less", "<#0.5#>Last year, it paid six point four lakh crore.<#0.35#> For less gold."),
            ("pct", "<#0.6#>Eighty six percent more money. Eighteen percent less gold."),
            ("veg", "<#0.4#>Like your vegetable vendor. But in tonnes.")]),
    (None, [("fly", "Most of it doesn't come by ship. It flies in."),
            ("delhi", "<#0.45#>More than a third of India's gold lands at one airport.<#0.35#> Delhi."),
            ("swiss", "<#0.55#>About half of it arrives from Switzerland and the UAE, which refine and trade it."),
            ("dollar", "<#0.6#>Every one of those grams is paid for in dollars. And dollars are what a country runs short of, when it imports too much.")]),
    (None, [("decide", "So in twenty fifteen, the government decided to do something about it."),
            ("same", "<#0.45#>On one day, it launched three gold schemes. Two of them matter here."),
            ("planA", "<#0.7#>Plan A: borrow the gold that's already here."),
            ("planB", "<#0.55#>Plan B: if you can't get the gold… sell people something that feels like gold."),
            ("target", "<#0.8#>Both had the same target.<#0.6#> Your mother.")]),
]

AIRPORT = re.compile(r"\bAIR\b|AIRPORT|A\.C\.|^ACC ")   # DGCIS port names for air cargo stations
CITY = {  # where each entry point is, degrees (lon, lat): positions only, no borders are drawn
    "DELHI AIR": ("Delhi airport", 77.10, 28.56), "MUMBAI AIR": ("Mumbai airport", 72.87, 19.09),
    "J MATADEE CHENNAI": ("Chennai free-trade warehouse", 79.98, 12.97), "GIFT SEZ": ("GIFT City SEZ", 72.68, 23.16),
    "CHENNAI AIR": ("Chennai airport", 80.17, 12.99), "AHMEDABAD AIR CARGO COMPLEX": ("Ahmedabad airport", 72.63, 23.07),
    "HYDERABAD AIRPORT": ("Hyderabad airport", 78.43, 17.24), "KOLKATA AIR": ("Kolkata airport", 88.45, 22.65),
    "BANGALORE AIRPORT": ("Bengaluru airport", 77.71, 13.20),
}
COUNTRY = {"SWITZERLAND": "Switzerland", "U ARAB EMTS": "UAE", "PERU": "Peru", "GHANA": "Ghana", "SOUTH AFRICA": "South Africa"}
COMMODITY = {"PETROLEUM: CRUDE": "Crude oil", "GOLD": "Gold", "ELECTRONICS COMPONENTS": "Electronic parts",
             "PETROLEUM PRODUCTS": "Petroleum products", "COAL,COKE AND BRIQUITTES ETC": "Coal and coke",
             "TELECOM INSTRUMENTS": "Telecom equipment"}


def numbers():
    with contextlib.redirect_stdout(io.StringIO()):
        imp = G.imports()
        sgb = G.sgb_model()
    df = pd.read_parquet(G.PARQUET, columns=["Commodity", "Year", "Month", "Type", "INR Value", "USD Value"])
    df["FY"] = df.Year + (df.Month >= 4)
    im = df[(df.Type == "Import") & (df.FY == 2026)]
    tot = im["INR Value"].sum()
    top = (im.groupby("Commodity")["INR Value"].sum() / 1e7).sort_values(ascending=False).head(6)
    by = imp["by_fy"]
    ports, ctry = imp["ports"], imp["countries"]
    usd = im[im.Commodity == "GOLD"]["USD Value"].sum() / 1e9
    return {
        "mined_t": G.MINE_OUTPUT_T, "t26": round(imp["t26"]), "mined_per": round(imp["t26"] / G.MINE_OUTPUT_T),
        "cr26": round(imp["cr26"]), "share26": round(imp["share26"], 1), "rank26": int(imp["rank26"]),
        "top": [[COMMODITY.get(k, k.title()), round(v), round(v * 1e7 / tot * 100, 1)] for k, v in top.items()],
        "fy": [[f"FY {fy - 1}–{str(fy)[2:]}", round(r.t), round(r.cr)] for fy, r in by.iterrows()],
        "money_pct": round((by.loc[2026].cr / by.loc[2022].cr - 1) * 100), "tonnes_pct": round((by.loc[2026].t / by.loc[2022].t - 1) * 100),
        "air_pct": round(ports[ports.index.str.contains(AIRPORT)].sum(), 1),
        "ports": [[CITY[k][0], CITY[k][1], CITY[k][2], round(v, 1)] for k, v in ports.items() if k in CITY],
        "countries": [[COUNTRY.get(k, k.title()), round(v, 1)] for k, v in ctry.head(4).items()],
        "swiss_uae": round(ctry.get("SWITZERLAND", 0) + ctry.get("U ARAB EMTS", 0), 1),
        "usd_bn": round(usd, 1), "n_ports": int(imp["n_ports"]), "owed_cr": round(sgb["owed"]),
    }


def check(n):
    """The spoken numbers must agree with the data; fail loudly before paying for a voice."""
    said = " ".join(x for _, parts in A.PARAS for _, x in parts)
    want = {
        "four hundred and forty three": n["mined_per"] == 443, "one point six tonnes": round(n["mined_t"], 1) == 1.6,
        "seven hundred and twenty one": n["t26"] == 721, "second-biggest": n["rank26"] == 2 and n["top"][0][0] == "Crude oil",
        "three point four lakh crore": round(n["fy"][0][2] / 1e5, 1) == 3.4, "eight hundred and seventy nine": n["fy"][0][1] == 879,
        "six point four lakh crore": round(n["fy"][-1][2] / 1e5, 1) == 6.4, "Eighty six percent more": n["money_pct"] == 86,
        "Eighteen percent less": n["tonnes_pct"] == -18, "Most of it doesn't come by ship": n["air_pct"] > 50,
        "More than a third": n["ports"][0][0] == "Delhi airport" and 33.4 < n["ports"][0][3] < 50,
        "About half of it arrives from Switzerland and the UAE": 45 <= n["swiss_uae"] <= 55,
    }
    bad = [k for k, ok in want.items() if k not in said or not ok]
    if bad:
        sys.exit(f"script and data disagree: {bad}")
    print("spoken numbers agree with the data")


def draft():
    """Timings estimated at 2.55 spoken words a second, so the page can be checked before the voice exists."""
    n = numbers()
    check(n)
    t, beats = 0.6, []
    for emo, parts in A.PARAS:
        for bid, x in parts:
            pause = sum(float(p) for p in re.findall(r"<#([0-9.]+)#>", x))
            t += pause
            d = len(A.say_of(x).split()) / 2.55
            beats.append({"id": bid, "t0": round(t, 3), "t1": round(t + d, 3), "say": A.say_of(x), "emotion": emo or "auto"})
            t += d + 0.12
        t += A.PARA_GAP
    dur = round(t + 0.9, 2)
    write(dur, beats, n, voiced=False)
    print(f"{A.ID}: draft, {len(beats)} beats, about {dur:.1f} s")


def write(dur, beats, n, voiced):
    (A.PROJ / "act.js").write_text("window.ACT = " + json.dumps({"dur": dur, "beats": beats, "n": n, "voiced": voiced},
                                                                ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    idx = A.PROJ / "index.html"
    h = idx.read_text(encoding="utf-8")
    h = re.sub(r'data-duration="[0-9.]+"', f'data-duration="{dur}"', h)
    h = re.sub(r"HF\.setup\([0-9.]+\)", f"HF.setup({dur})", h)
    idx.write_text(h, encoding="utf-8")


A.numbers = numbers

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "build"
    if cmd == "build":
        check(numbers())
    {"draft": draft, "build": A.build, "verify": A.verify, "mux": A.mux}[cmd]()

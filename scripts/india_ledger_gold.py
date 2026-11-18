"""Every number in the India Ledger gold episode (week of 23 Nov 2026), in one place.

usage: python3 scripts/india_ledger_gold.py
Needs out/hyperframes/cache/export-import.parquet (the DGCIS mirror that hyperframes/tools/export_videos.py downloads)
and pyarrow. Numbers typed in below carry their source; the rest is our arithmetic, labelled "our arithmetic" on screen.
The plan and script that use these are in docs/INDIA_LEDGER_WEEK1.md.
"""
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
PARQUET = ROOT / "out" / "hyperframes" / "cache" / "export-import.parquet"

# --- Typed-in figures, each with its source (checked 18 Nov 2026) ---
# Bond figures (issued, raised, first tranche, yields) come from the files below, not from typed-in numbers.
GMS_KG, GMS_DEPOSITORS = 31_164, 5_693          # Ministry of Finance statement, 25 Mar 2025 (to Nov 2024)
MINE_OUTPUT_T = 1.627                            # India gold output 2024-25, "Gold (total)" 1,627 kg: Ministry of Mines, Monthly Summary
#   April 2025 (dated 30 May 2025), table 2.1, source IBM. (2023-24: 1,583 kg.) Excludes gold refined from imported concentrate
HOUSEHOLD_T = 31_000                             # WGC "Swarnim Udaan 2047", 4 Aug 2026
POPULATION_CRORE = 142.59                        # projected population, 1 Mar 2026: 1,425.90 million. Report of the Technical
#   Group on Population Projections 2011-2036 (MoHFW, July 2020), as tabled in MoSPI, Women and Men in India 2023, Table 1.1

# --- The bond-by-bond model (D11). Inputs are files in data/india_ledger/ ---
TRANCHES = ROOT / "data" / "india_ledger" / "sgb_tranches.csv"   # 67 tranches: issue date, issue price, grams sold, redemption
#   price. From the RBI tranche data as tabled on Wikipedia ("Sovereign Gold Bond", fetched 18 Nov 2026); its totals match
#   RBI's 146.96 t and Rs 72,274 crore exactly. Redemption prices of matured tranches are RBI final-redemption prices.
YIELDS = ROOT / "data" / "india_ledger" / "india_10y_yield_fred.csv"  # FRED INDIRLTLT01STM, India 10-year G-sec, monthly
PRICE_TODAY = 13_345      # Rs/g, RBI redemption price for the premature redemption of SGB 2020-21 Series II due 19 Nov 2026
#   (RBI press release of 18 Nov 2026, prid=63996: simple average of IBJA 999 closing prices, 16-18 Nov 2026).
#   Previous value 14,024 (final redemption of SGB 2018-19 Series III, 13 Nov 2026). Update all three lines together.
PRICE_DATE, PRICE_LABEL = "2026-11-19", "19 Nov 2026"
TODAY = "2026-11-18"
TERM_YEARS = 8
COUPON_HIGH_UNTIL = 3     # tranches 1-3 (FY 2015-16) paid 2.75%; from 2016-17 Series I, 2.5%

def crore(x):
    return f"₹{x:,.0f} crore" if x < 100_000 else f"₹{x / 100_000:.2f} lakh crore"


def imports():
    df = pd.read_parquet(PARQUET, columns=["Commodity", "Country", "Port", "Year", "Month", "Type", "Quantity", "INR Value"])
    df["FY"] = df.Year + (df.Month >= 4)          # FY2026 = Apr 2025 - Mar 2026
    im = df[df.Type == "Import"]
    g = im[im.Commodity == "GOLD"]
    by = g.groupby("FY").agg(t=("Quantity", lambda s: s.sum() / 1000), cr=("INR Value", lambda s: s.sum() / 1e7))
    f = g[g.FY == 2026]
    tot = f["INR Value"].sum()
    print("== DGCIS gold imports (commodity GOLD) ==")
    for fy, r in by.loc[2022:2026].iterrows():
        print(f"  FY{fy - 1}-{str(fy)[2:]}: {r.t:,.0f} t, {crore(r.cr)}, ₹{r.cr * 1e7 / (r.t * 1000) / 1e5:.1f} lakh a kg")
    a, b = by.loc[2022], by.loc[2026]
    print(f"  FY22 -> FY26: value x{b.cr / a.cr:.2f} ({b.cr / a.cr * 100 - 100:+.0f}%), tonnes {b.t / a.t * 100 - 100:+.0f}%")
    share = tot / im[im.FY == 2026]["INR Value"].sum() * 100
    rank = im[im.FY == 2026].groupby("Commodity")["INR Value"].sum().rank(ascending=False)["GOLD"]
    print(f"  FY26 share of all imports: {share:.1f}% (rank {rank:.0f})")
    for col in ("Port", "Country"):
        top = (f.groupby(col)["INR Value"].sum() / tot * 100).sort_values(ascending=False).head(6)
        print(f"  by {col.lower()}: " + ", ".join(f"{k} {v:.1f}%" for k, v in top.items()))
    print(f"  entry points used in FY26: {f.Port.nunique()}")
    shares = {col: (f.groupby(col)["INR Value"].sum() / tot * 100).sort_values(ascending=False) for col in ("Port", "Country")}
    return {"by_fy": by.loc[2022:2026], "t26": b.t, "cr26": b.cr, "share26": share, "rank26": rank,
            "ports": shares["Port"], "countries": shares["Country"], "n_ports": f.Port.nunique()}


def xirr(p0, p1, coupon, years):
    """Yearly cost of one bond to the government, %: pay p0 in, coupon (% of p0) every half year, p1 back at the end."""
    def npv(r):
        n = round(years * 2)
        return -p0 + sum(p0 * coupon / 200 / (1 + r) ** (k / 2) for k in range(1, n + 1)) + p1 / (1 + r) ** years
    lo, hi = -0.5, 1.0
    for _ in range(80):
        m = (lo + hi) / 2
        lo, hi = (m, hi) if npv(m) > 0 else (lo, m)
    return m * 100


def sgb_model():
    """Extra cost of each tranche versus borrowing the same rupees with a normal government bond.

    For each tranche: what the government pays back above what it raised (gold gain), minus the interest it saved by paying
    the bond coupon instead of the 10-year G-sec yield of the issue month, for the years the money was held. Matured tranches
    use their final redemption price and 8 years. Tranches not yet matured are valued as if settled today, at today's
    RBI price, with interest saved up to today. Premature redemptions (not published by tranche) are treated as still
    outstanding; they were paid at window prices close to recent prices, so the total moves little.
    """
    t = pd.read_csv(TRANCHES)
    y = pd.read_csv(YIELDS)
    y.columns = ["date", "y"]
    y["m"] = pd.to_datetime(y.date).dt.to_period("M")
    t["d"] = pd.to_datetime(t.issue_date)
    t["y"] = t.d.dt.to_period("M").map(dict(zip(y.m, y.y)))
    t["c"] = [2.75 if n <= COUPON_HIGH_UNTIL else 2.5 for n in t.n]
    today = pd.Timestamp(TODAY)
    t["matured"] = t.d + pd.DateOffset(years=TERM_YEARS) <= today
    t["years"] = [TERM_YEARS if m else (today - d).days / 365.25 for m, d in zip(t.matured, t.d)]
    t["paid_price"] = [r.redemption_price if r.matured else PRICE_TODAY for r in t.itertuples()]
    t["raised"] = t.units_g * t.issue_price / 1e7                        # Rs crore
    t["gold_gain"] = t.units_g * (t.paid_price - t.issue_price) / 1e7
    t["saved"] = t.raised * (t.y - t.c) / 100 * t.years                  # simple interest
    t["extra"] = t.gold_gain - t.saved
    t["sgb_rate"] = [xirr(r.issue_price, r.paid_price, r.c, r.years) for r in t.itertuples()]   # cost a year to the government
    assert t.y.notna().all(), "missing yield month"
    print("\n== Sovereign Gold Bonds, bond by bond ==")
    print(f"  {len(t)} tranches, {t.units_g.sum() / 1e6:.2f} t, raised {crore(t.raised.sum())} (RBI: 146.96 t, Rs 72,274 crore)")
    first = t.iloc[0]
    print(f"  first tranche: Rs {first.issue_price:,.0f} -> Rs {first.paid_price:,.0f}/g; normal bond that month {first.y:.2f}%")
    m, o = t[t.matured], t[~t.matured]
    print(f"  matured and repaid: {len(m)} tranches, {m.units_g.sum() / 1e6:.2f} t; still out (at most): {o.units_g.sum() / 1e6:.2f} t")
    owed = o.units_g.sum() * PRICE_TODAY / 1e7
    print(f"  owed on bonds still out, at Rs {PRICE_TODAY:,}/g (RBI, {PRICE_LABEL}): {crore(owed)}")
    print(f"  every Rs 1,000 on a gram moves that by {crore(o.units_g.sum() * 1000 / 1e7)}")
    for name, part in (("already repaid", m), ("still out, settled today", o), ("ALL", t)):
        print(f"  {name:26s} gold gain {crore(part.gold_gain.sum()):>18s}  interest saved {crore(part.saved.sum()):>16s}"
              f"  extra cost {crore(part.extra.sum()):>16s}")
    net = t.extra.sum()
    print(f"  => the bonds cost about {crore(net)} more than normal borrowing (our estimate), "
          f"≈ Rs {net * 1e7 / (POPULATION_CRORE * 1e7):,.0f} per Indian")
    for dp in (-2000, -1000, 1000, 2000):
        print(f"     at Rs {PRICE_TODAY + dp:,}/g: {crore(net + o.units_g.sum() * dp / 1e7)}")
    comp = (t.raised * (((1 + t.y / 100) ** t.years) - ((1 + t.c / 100) ** t.years))).sum()
    print(f"  check, interest saved compounded instead of simple: {crore(comp)} saved -> extra cost {crore(t.gold_gain.sum() - comp)}")
    w = (m.sgb_rate * m.raised).sum() / m.raised.sum()          # matured only: real money, full 8 years
    wy = (m.y * m.raised).sum() / m.raised.sum()
    print(f"  matured bonds (paid in full): the government paid about {w:.1f}% a year vs {wy:.1f}% on normal bonds"
          f" (weighted by rupees; range {m.sgb_rate.min():.1f}-{m.sgb_rate.max():.1f}%)")
    print("  not counted: tax-free gains (lost tax, raises the cost); Rs 50/g online discount (raises it); premature redemptions"
          " paid at earlier, mostly lower prices (lowers it)")
    # Why now: what can be called in today, and when the rest falls due (at today's price)
    o2 = o.copy()
    o2["mat"] = o2.d + pd.DateOffset(years=TERM_YEARS)
    o2["fy"] = o2.mat.dt.year + (o2.mat.dt.month >= 4)
    early = o2[o2.d + pd.DateOffset(years=5) <= today]
    print(f"  can be cashed early right now (5+ years old): {len(early)} tranches, {early.units_g.sum() / 1e6:.1f} t,"
          f" {crore(early.units_g.sum() * PRICE_TODAY / 1e7)} at today's price")
    due = o2.groupby("fy").units_g.sum() * PRICE_TODAY / 1e7
    print("  final maturities at today's price: " + ", ".join(f"FY{fy - 1}-{str(fy)[2:]} {crore(v)}" for fy, v in due.items()))
    big = t.sort_values("extra", ascending=False).head(3)
    print("  costliest tranches: " + "; ".join(f"{r.tranche} ({crore(r.extra)})" for r in big.itertuples()))
    return {"tranches": t, "owed": owed, "per1000": o.units_g.sum() * 1000 / 1e7, "net": net,
            "net_lo": net - o.units_g.sum() * 2000 / 1e7, "net_hi": net + o.units_g.sum() * 2000 / 1e7,
            "per_indian": net / POPULATION_CRORE, "out_t": o.units_g.sum() / 1e6, "matured_rate": w, "matured_gsec": wy,
            "early_cr": early.units_g.sum() * PRICE_TODAY / 1e7, "early_t": early.units_g.sum() / 1e6, "due": due,
            "first": first}


def main():
    imp = imports()
    t26 = imp["t26"]
    print("\n== Gold deposit scheme vs imports ==")
    print(f"  {GMS_KG / 1000:.1f} t in 9 years, {GMS_DEPOSITORS:,} depositors = {GMS_KG / 1000 / HOUSEHOLD_T * 100:.2f}% of household gold")
    print(f"  India imports that much in {GMS_KG / 1000 / t26 * 365:.1f} days (FY26 pace)")
    print(f"  Mines: {MINE_OUTPUT_T} t a year = {MINE_OUTPUT_T / t26 * 100:.2f}% of imports (1 g mined per {t26 / MINE_OUTPUT_T:,.0f} g imported)")

    sgb_model()


if __name__ == "__main__":
    main()

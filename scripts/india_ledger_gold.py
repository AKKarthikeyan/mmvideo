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
GMS_KG, GMS_DEPOSITORS = 31_164, 5_693          # Ministry of Finance statement, 25 Mar 2025 (to Nov 2024)
SGB_TONNES_ISSUED, SGB_CRORE_RAISED = 146.96, 72_274   # RBI Annual Report 2023-24; MoF Rajya Sabha reply (67 tranches)
SGB_TONNES_OUT = 125.3                           # outstanding, 23 Oct 2026 (Free Press Journal; IMPRI says 125.65)
SGB_FIRST_ISSUE, SGB_FIRST_REDEEM = 2_684, 6_132  # ₹/g, SGB 2015-I, RBI press release 2023-24/1359 (24 Nov 2023)
SGB_FIRST_RETURN_RBI = 12.9                      # % a year, RBI, as reported by Outlook Money
GSEC_10Y_NOV2015 = 7.75                          # % monthly average, FRED INDIRLTLT01STM
SGB_COUPON = 2.5                                 # % a year (2.75% on the first tranches)
MOF_REDEEMED_PAID, MOF_INTEREST_PAID = 11_801.12, 6_055.39  # ₹ crore to FY 2024-25, MoF (as reported)
MINE_OUTPUT_T = 1.62                             # India's primary gold output 2024-25 (as reported; Ministry of Mines)
HOUSEHOLD_T = 31_000                             # WGC "Swarnim Udaan 2047", 4 Aug 2026
POPULATION_CRORE = 146                           # VERIFY: MoHFW / RBI population projection for 2026

# --- Assumptions for our estimate of the bond cost (state them on screen) ---
PRICE_G = 12_567          # ₹/g used for "today"; IMPRI's mid-2026 price. Re-run with the IBJA rate on the build day.
REDEEMED_AVG_ISSUE = 2_950  # ₹/g, rough average issue price of the early tranches already redeemed (2015-17: ₹2,600-3,200)
GSEC_AVG = 7.2            # % a year, the rate normal government bonds paid on average over 2018-2026 (approximate)
YEARS_HELD = 6.5          # average years from issue to redemption for the outstanding bonds (early exit after 5)


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
    return b.t


def main():
    t26 = imports()
    print("\n== Gold deposit scheme vs imports ==")
    print(f"  {GMS_KG / 1000:.1f} t in 9 years, {GMS_DEPOSITORS:,} depositors = {GMS_KG / 1000 / HOUSEHOLD_T * 100:.2f}% of household gold")
    print(f"  India imports that much in {GMS_KG / 1000 / t26 * 365:.1f} days (FY26 pace)")
    print(f"  Mines: {MINE_OUTPUT_T} t a year = {MINE_OUTPUT_T / t26 * 100:.2f}% of imports (1 g mined per {t26 / MINE_OUTPUT_T:,.0f} g imported)")

    print("\n== Sovereign Gold Bonds ==")
    avg_issue = SGB_CRORE_RAISED * 1e7 / (SGB_TONNES_ISSUED * 1e6)
    print(f"  issued {SGB_TONNES_ISSUED} t for {crore(SGB_CRORE_RAISED)} (average ₹{avg_issue:,.0f}/g)")
    print(f"  first tranche: ₹{SGB_FIRST_ISSUE:,} -> ₹{SGB_FIRST_REDEEM:,}/g = x{SGB_FIRST_REDEEM / SGB_FIRST_ISSUE:.2f};"
          f" RBI: {SGB_FIRST_RETURN_RBI}% a year vs {GSEC_10Y_NOV2015}% on a normal 10-year bond that month")
    owed = SGB_TONNES_OUT * 1e6 * PRICE_G / 1e7
    print(f"  owed today on {SGB_TONNES_OUT} t at ₹{PRICE_G:,}/g: {crore(owed)}")
    print(f"  every ₹1,000 on the price of a gram changes it by {crore(SGB_TONNES_OUT * 1e6 * 1000 / 1e7)}")
    redeemed_t = SGB_TONNES_ISSUED - SGB_TONNES_OUT
    principal_out = SGB_CRORE_RAISED - redeemed_t * 1e6 * REDEEMED_AVG_ISSUE / 1e7
    gain_out = owed - principal_out
    saved_out = principal_out * (GSEC_AVG - SGB_COUPON) / 100 * YEARS_HELD
    redeemed_extra = MOF_REDEEMED_PAID - redeemed_t * 1e6 * REDEEMED_AVG_ISSUE / 1e7
    net = gain_out - saved_out + redeemed_extra
    print(f"  our estimate (approximate): principal still out {crore(principal_out)}; gold gain owed {crore(gain_out)};")
    print(f"    minus interest saved vs normal bonds {crore(saved_out)}; plus gain already paid on redeemed {crore(redeemed_extra)}")
    print(f"    = net extra cost ≈ {crore(net)} (range ±25%: {crore(net * 0.75)} to {crore(net * 1.25)})")
    print(f"    per Indian ({POPULATION_CRORE} crore people): ≈ ₹{net / POPULATION_CRORE * 1e7 / 1e7:,.0f}")


if __name__ == "__main__":
    main()

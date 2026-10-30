#!/usr/bin/env python3
"""Builds public/datayt/long/namakkal/figures.json, the only place the Namakkal long-form scenes read numbers from.

  .venv/bin/python scripts/datayt/namakkal_figures.py [data_dir]

data_dir defaults to the darwin-research checkout next to the SSD repos (branch claude/namakkal-egg-city-research-yihbbg):
/Volumes/DarwinSSD/darwin-research/contentengine/youtube/namakkal_egg_city/data. Rates are read from the NECC CSVs there.
The five state shares are PIB's (Basic Animal Husbandry Statistics 2024, release of 26 Nov 2024), as read at PIB and
recorded in that folder's RESEARCH.md; they are not in a CSV, so they are written once here, with their source.
Tables are prefixed nk_ so they never collide with the babies tables when figs.ts merges both files.
"""
import csv, json, os, sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = sys.argv[1] if len(sys.argv) > 1 else "/Volumes/DarwinSSD/darwin-research/contentengine/youtube/namakkal_egg_city/data"
OUT = os.path.join(ROOT, "public/datayt/long/namakkal/figures.json")
RENDER_DAY = date(2026, 10, 29)                 # e01: replace with the render-day sheet

# PIB, BAHS 2024 (26 Nov 2024), share of India's eggs 2023-24, per cent
SHARES = {"Andhra Pradesh": 17.85, "Tamil Nadu": 15.64, "Telangana": 12.88, "West Bengal": 11.37, "Karnataka": 6.63}
SRC = os.path.join(os.path.dirname(DATA), "sources")       # the four primary-source checks of 29 Oct 2026, each with FINDINGS.md
# BAHS 2025 Table 53 (lakh eggs): India 2022-23 and 2024-25; shares 2024-25 (sources/ahd/FINDINGS.md section 1)
INDIA_LAKH = {"2022_23": 1383762.78, "2024_25": 1491114.25}
SHARES_2425 = {"Andhra Pradesh": 18.37, "Tamil Nadu": 15.63, "Telangana": 12.98, "West Bengal": 10.72, "Karnataka": 6.67}
# TN DES, Statistical Hand Book 2022-23, Table 7.10 (lakh eggs): Namakkal and the state total (sources/ahd/FINDINGS.md section 2)
NAMAKKAL_LAKH_2223, TN_LAKH_2223 = 145750.502, 215606.616
# Attributed accounts, said as accounts on screen: the TANUVAS 2020 case study (key-informant interview) and NECC's own history page
# ("The Beginning", e2necc.com), and P. K. Venkatachalam's recollection (Times of India, 13 Feb 2023; Indica Atlas only). Beats per SCRIPT.md.
STORY = {"hens_1969": 6, "farmers_1970": 4, "chicks_1970": 400, "chicks_each": 100, "chick_rs_lo": 3, "chick_rs_hi": 4, "paise_chennai": 22,
         "birds_1975": 3, "birds_1978": 12, "birds_1982": 30, "birds_1985": 75, "feed_rise_pct": 250, "paise_1981": 35, "stopped_pct": 40,
         "meetings": 300, "van_agreed": 19, "van_offer": 15, "van_settled": 17}
# Namakkal town, 11.219 N 78.167 E; Tamil Nadu spans about 76.23-80.35 E and 8.08-13.50 N. The pin is placed inside Tamil Nadu's box in
# public/datayt/india/geo.json by linear interpolation: good enough for a dot, not a survey position.
NAMAKKAL_LL = (78.167, 11.219)
TN_LL_BOX = (76.23, 80.35, 8.08, 13.50)


def daily_all():
    out = {}
    for r in csv.DictReader(open(os.path.join(DATA, "necc_daily_all_centres_paise.csv"))):
        if r["centre"] == "Namakkal" and r["section"] == "NECC SUGGESTED EGG PRICES":
            out[date.fromisoformat(r["date"])] = float(r["paise"]) / 100
    return out


def main():
    d = daily_all()
    if RENDER_DAY not in d:
        sys.exit(f"no Namakkal rate for {RENDER_DAY}")
    win = [(k, v) for k, v in sorted(d.items()) if date(2026, 6, 1) <= k <= date(2026, 8, 31)]
    if len(win) != 92:
        sys.exit(f"Jun-Aug 2026: {len(win)} days, need 92")
    top = max(v for _, v in win)
    peak_days = [k for k, v in win if v == top]
    end = win[-1][1]
    end_from = min(k for k, v in win if k > peak_days[-1] and all(w == end for kk, w in win if kk >= k))
    geo = json.load(open(os.path.join(ROOT, "public/datayt/india/geo.json")))
    tn = next(s for s in geo["states"] if s["name"] == "Tamil Nadu")["bbox"]
    lo0, lo1, la0, la1 = TN_LL_BOX
    pin = [round(tn[0] + (NAMAKKAL_LL[0] - lo0) / (lo1 - lo0) * (tn[2] - tn[0]), 1),
           round(tn[1] + (la1 - NAMAKKAL_LL[1]) / (la1 - la0) * (tn[3] - tn[1]), 1)]
    # Feb-Apr 2026 from the selected-months daily file (the all-centres file has no Feb 2026 rows)
    sel = {}
    for r in csv.DictReader(open(os.path.join(DATA, "necc_daily_namakkal_selected_months_paise.csv"))):
        y, m = map(int, r["ym"].split("-"))
        sel[date(y, m, int(r["day"]))] = float(r["paise"]) / 100
    for k, v in sel.items():
        if k in d and abs(d[k] - v) > 1e-9:
            sys.exit(f"{k}: the two NECC daily files disagree ({d[k]} vs {v})")
    feb = [(k, v) for k, v in sorted(sel.items()) if date(2026, 2, 1) <= k <= date(2026, 4, 30)]
    if len(feb) != 89:
        sys.exit(f"Feb-Apr 2026: {len(feb)} days, need 89")
    mar_low = min(v for _, v in feb)
    # NECC monthly averages (rupees) for the seasons grid: full years only
    mon = [(int(r["year"]), int(r["month"]), float(r["rs_per_egg"])) for r in csv.DictReader(open(os.path.join(DATA, "namakkal_monthly_rupees.csv")))]
    full = [y for y in sorted({y for y, _, _ in mon}) if sum(1 for yy, _, _ in mon if yy == y) == 12]
    low_month = {y: min((v, m) for yy, m, v in mon if yy == y)[1] for y in full}
    # Official hen-egg exports (TradeStat, ITC-HS 04072100), crore eggs a month (sources/trade)
    ex = {}
    for r in csv.DictReader(open(os.path.join(SRC, "trade", "tables", "monthly_egg_exports.csv"))):
        if r["hs"] == "04072100" and r["eggs_number"]:
            ex[f'{int(r["year"]):04d}-{int(r["month"]):02d}'] = round(float(r["eggs_number"]) / 1e7, 2)
    y25 = [ex[f"2025-{m:02d}"] for m in range(1, 13)]
    jan26, mar26 = ex["2026-01"], ex["2026-03"]
    fig = {
        "nk_rate": {"Namakkal": {RENDER_DAY.isoformat(): d[RENDER_DAY], "peak_2026": top, "late_aug_2026": end,
                                 "fall_pct_2026": round((end / top - 1) * 100), "mar_low_2026": mar_low, "feb1_2026": feb[0][1]}},
        "nk_india": {"India": {"eggs_bn_2024_25": round(INDIA_LAKH["2024_25"] / 1e4, 2), "world_rank_2024": 2,
                               "crore_day_2022_23": round(INDIA_LAKH["2022_23"] * 1e5 / 365 / 1e7, 1)}},
        "nk_share25": {s_: {"y2024_25": v} for s_, v in SHARES_2425.items()},
        "nk_district": {"Namakkal": {"crore_day_2022_23": round(NAMAKKAL_LAKH_2223 * 1e5 / 365 / 1e7, 1),
                                     "share_tn_2022_23": round(NAMAKKAL_LAKH_2223 / TN_LAKH_2223 * 100),
                                     "share_india_2022_23": round(NAMAKKAL_LAKH_2223 / INDIA_LAKH["2022_23"] * 100, 1)},
                        "Tamil Nadu": {"crore_day_2022_23": round(TN_LAKH_2223 * 1e5 / 365 / 1e7, 1)}},
        "nk_story": {"Namakkal": STORY},
        "nk_seasons": {"Namakkal": {"low_marapr": sum(1 for m in low_month.values() if m in (3, 4)), "years": len(low_month)}},
        "nk_exports": {"India": {"avg_month_2025": round(sum(y25) / 12, 1), "jan_2026": jan26, "mar_2026": mar26,
                                 "fall_jan_mar_2026_pct": round((mar26 / jan26 - 1) * 100)}},
        "nk_share": {s: {"y2023_24": v} for s, v in SHARES.items()},
        "meta": {
            "nk_series": {"jun_aug_2026": [[k.isoformat(), v] for k, v in win], "feb_apr_2026": [[k.isoformat(), v] for k, v in feb]},
            "nk_monthly": {"years": full, "low_month": {str(y): m for y, m in low_month.items()},
                           "rs": {f"{y}-{m:02d}": v for y, m, v in mon}},
            "nk_exports_monthly": {k: v for k, v in sorted(ex.items()) if k >= "2023-01"},
            "nk_dates": {"render_day": RENDER_DAY.isoformat(), "peak_from": peak_days[0].isoformat(), "peak_to": peak_days[-1].isoformat(),
                         "late_aug_from": end_from.isoformat()},
            "nk_pin": {"Namakkal": pin},
            "nk_sources": {"nk_rate": "NECC daily rate sheets, e2necc.com (suggested rate, not mandatory)",
                           "nk_monthly": "NECC monthly-average rate sheets, e2necc.com · nominal rupees",
                           "nk_india": "Basic Animal Husbandry Statistics 2025 (DAHD) · FAOSTAT",
                           "nk_share25": "Basic Animal Husbandry Statistics 2025, 2024-25 (DAHD)",
                           "nk_district": "Statistical Hand Book of Tamil Nadu 2022-23, Table 7.10 (Dept of Economics and Statistics)",
                           "nk_seasons": "NECC monthly-average rate sheets, e2necc.com · full years 2009-2025, 2020 excluded",
                           "nk_story": "TANUVAS case study (2020) · NECC, 'The Beginning'",
                           "nk_exports": "DGCI&S via TradeStat, Ministry of Commerce · ITC-HS 04072100 (hen eggs)",
                           "nk_share": "PIB, Basic Animal Husbandry Statistics 2024, 26 Nov 2024 (2023-24)"},
        },
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(fig, open(OUT, "w"), ensure_ascii=False, indent=1)
    print(f"Feb-Apr 2026: {feb[0][1]:.2f} on {feb[0][0]}, low {mar_low:.2f}; lowest month Mar/Apr in "
          f"{sum(1 for m in low_month.values() if m in (3, 4))} of {len(low_month)} full years; exports 2025 {sum(y25) / 12:.2f} crore a month, "
          f"Jan 2026 {jan26}, Mar 2026 {mar26}; Namakkal {fig['nk_district']}")
    print(f"wrote {os.path.relpath(OUT, ROOT)}: {RENDER_DAY} {d[RENDER_DAY]:.2f}; peak {top:.2f} {peak_days[0]}..{peak_days[-1]}; "
          f"{end:.2f} from {end_from}; pin {pin}")


if __name__ == "__main__":
    main()

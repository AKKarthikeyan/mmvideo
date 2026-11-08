"""Build the two Muhurat trading Shorts (Data Kadai and Moat & Margin) from NSE Nifty 50 closing levels.

usage: muhurat_shorts.py
Writes hyperframes/videos/dk-muhurat-short/story.js, hyperframes/videos/mm-muhurat-short/story.js and the fact
ledger scripts/ledger/muhurat-shorts.csv. Then: hf.py sync dk-muhurat-short mm-muhurat-short, hf.py render <id>.

Data (cached in out/hyperframes/cache/muhurat/, fetched with git on first run):
- NSE's Nifty 50 end-of-day history, 3 Jan 2000 to 30 Sep 2026, in NSE's own historical-index export format
  (fields EOD_CLOSE_INDEX_VAL, EOD_TIMESTAMP, HIT_TURN_OVER), mirrored at github.com/niranjan-bhol/temp
  (data/nse/json/NIFTY_50.json).
- Nifty 50 one-minute bars for 2026 from github.com/technovusin/nifty50-historical-data (MIT), used for 1 Oct to
  6 Nov 2026. From 3 Aug 2026 the day's last bar equals NSE's official close: all 42 overlapping days (3 Aug to
  30 Sep 2026) match to the paisa, and the script stops if any of them does not. Before August the last bar is not the
  official close (off by up to ~20 points), so earlier one-minute bars are not used.

Definitions shown on screen:
- Muhurat session move: Muhurat close against the previous trading day's close.
- Samvat year: Muhurat close to the last close before the next Muhurat session (Samvat 2082: 21 Oct 2025 to 6 Nov 2026).
- Price index only; dividends are not included.
Each Muhurat date is checked against turnover: a Muhurat session trades about a fifth of a normal day, and the script
stops if a listed date does not look like one.
"""
import csv
import datetime as dt
import glob
import json
import statistics as st
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VID = ROOT / "hyperframes" / "videos"
CACHE = ROOT / "out" / "hyperframes" / "cache" / "muhurat"
LEDGER = ROOT / "scripts" / "ledger" / "muhurat-shorts.csv"
EOD_REPO, EOD_FILE = "https://github.com/niranjan-bhol/temp.git", "data/nse/json/NIFTY_50.json"
MIN_REPO = "https://github.com/technovusin/nifty50-historical-data.git"
# Lakshmi Puja (Muhurat session) dates, 2000-2026. Samvat number = Gregorian year of that Diwali + 57.
MUHURAT = """2000-10-26 2001-11-14 2002-11-04 2003-10-25 2004-11-12 2005-11-01 2006-10-21 2007-11-09 2008-10-28 2009-10-17
2010-11-05 2011-10-26 2012-11-13 2013-11-03 2014-10-23 2015-11-11 2016-10-30 2017-10-19 2018-11-07 2019-10-27
2020-11-14 2021-11-04 2022-10-24 2023-11-12 2024-11-01 2025-10-21 2026-11-08""".split()
TODAY = dt.date(2026, 11, 8)
MATCH_FROM = dt.date(2026, 8, 3)  # first day the one-minute last bar equals NSE's close


def fetch():
    eod, mins = CACHE / "eod", CACHE / "min"
    if not (eod / EOD_FILE).exists():
        subprocess.run(["git", "clone", "--depth", "1", "--filter=blob:none", "--sparse", EOD_REPO, str(eod)], check=True)
        subprocess.run(["git", "-C", str(eod), "sparse-checkout", "set", "--skip-checks", EOD_FILE], check=True)
    if not mins.exists():
        subprocess.run(["git", "clone", "--depth", "1", MIN_REPO, str(mins)], check=True)
    return eod / EOD_FILE, sorted(glob.glob(str(mins / "1min" / "2026" / "*.csv")))


def closes():
    eod_file, min_files = fetch()
    C, T = {}, {}
    for r in json.load(open(eod_file))["data"]:
        d = dt.datetime.strptime(r["EOD_TIMESTAMP"], "%d-%b-%Y").date()
        C[d], T[d] = float(r["EOD_CLOSE_INDEX_VAL"]), r["HIT_TURN_OVER"]
    last_bar = {}
    for f in min_files:
        for r in csv.DictReader(open(f)):
            last_bar[dt.date.fromisoformat(r["Timestamp"][:10])] = float(r["Close"])
    overlap = [d for d in last_bar if d in C and d >= MATCH_FROM]
    bad = [d for d in overlap if abs(last_bar[d] - C[d]) > 0.005]
    if not overlap or bad:
        sys.exit(f"one-minute closes do not match NSE closes on {bad or 'any day'}")
    for d, v in last_bar.items():
        if d >= MATCH_FROM:
            C.setdefault(d, v)
    return C, T, len(overlap)


def main():
    C, T, n_overlap = closes()
    days = sorted(C)
    mu = [dt.date.fromisoformat(s) for s in MUHURAT]
    rows = []
    for i, d in enumerate(mu[:-1]):
        j = days.index(d)
        p = days[j - 1]
        normal = st.median(T[x] for x in days[j - 10:j] if T.get(x))
        if not T.get(d) or T[d] > 0.45 * normal:
            sys.exit(f"{d} does not look like a Muhurat session (turnover {T.get(d)} vs ~{normal:.0f})")
        seg = [x for x in days if d <= x < mu[i + 1]]
        end = seg[-1]
        rows.append(dict(samvat=d.year + 57, date=d.isoformat(), close=C[d], prev_date=p.isoformat(), prev=C[p],
                         hour=round((C[d] / C[p] - 1) * 100, 2), pts=round(C[d] - C[p], 2),
                         end_date=end.isoformat(), end=C[end], year=round((C[end] / C[d] - 1) * 100, 1)))
    hour = [r["hour"] for r in rows]
    year = [r["year"] for r in rows]
    up = sum(h > 0 for h in hour)
    small = sum(abs(h) < 1 for h in hour)
    big = max(rows, key=lambda r: r["hour"])
    # the outlier: 2008 came the day after the year's lowest close
    y08 = [x for x in days if x.year == 2008]
    low08 = min(y08, key=lambda x: C[x])
    cross = dict(gg=0, gr=0, rg=0, rr=0)
    for h, y in zip(hour, year):
        cross[("g" if h > 0 else "r") + ("g" if y > 0 else "r")] += 1
    # Samvat 2082, day by day
    s0, s1 = mu[-2], days[-1]
    path = [(x.isoformat(), C[x]) for x in days if s0 <= x <= s1]
    pk = max(path, key=lambda p: p[1])
    lo = min(path, key=lambda p: p[1])
    wk = [x for x in days if x <= s1 - dt.timedelta(days=7)][-1]
    stats = dict(
        n=len(rows), up=up, down=len(rows) - up, small=small,
        median=round(st.median(hour), 2), mean_abs_hour=round(st.mean(abs(h) for h in hour), 2),
        mean_abs_year=round(st.mean(abs(y) for y in year), 1), years_up=sum(y > 0 for y in year),
        big=dict(date=big["date"], hour=big["hour"], pts=big["pts"]), low08=dict(date=low08.isoformat(), close=C[low08]),
        cross=cross,
        first=dict(date=rows[0]["date"], close=rows[0]["close"]), last=dict(date=s1.isoformat(), close=C[s1]),
        times=round(C[s1] / rows[0]["close"], 1),
        s2082=dict(start=path[0], end=path[-1], peak=pk, low=lo, ret=rows[-1]["year"],
                   fall=round((lo[1] / pk[1] - 1) * 100, 1), rise=round((path[-1][1] / lo[1] - 1) * 100, 1),
                   week_from=(wk.isoformat(), C[wk]), week=round((C[s1] / C[wk] - 1) * 100, 1)),
        today=TODAY.isoformat(), overlap_days=n_overlap,
    )
    src = "NSE · Nifty 50 closing levels, 2000–2026"
    for vid, channel, theme in (("dk-muhurat-short", "DATA KADAI", "kadai"), ("mm-muhurat-short", "MOAT & MARGIN", "paper")):
        (VID / vid).mkdir(parents=True, exist_ok=True)
        story = dict(channel=channel, theme=theme, source=src, rows=rows, stats=stats,
                     path=path if vid.startswith("mm") else None)
        (VID / vid / "story.js").write_text("window.STORY = " + json.dumps(story, ensure_ascii=False, indent=1) + ";\n")
    ledger(rows, stats)
    print(json.dumps(stats, indent=1))


def ledger(rows, s):
    url = "https://www.nseindia.com/reports-indices-historical-index-data"
    base = dict(source_url=url, doc_title="NSE historical index data, NIFTY 50 (closing levels)", page="", checked_by="",
                checked_on="", note="added 2026-11-08; computed by hyperframes/tools/muhurat_shorts.py")
    out = []
    add = lambda beat, text, value, units, quote, calc, date="": out.append(
        dict(base, beat=beat, screen_text=text, value=value, units=units, doc_date=date, quote_or_section=quote, calculation=calc))
    for r in rows:
        add("dk-bars mm-bars", f"Samvat {r['samvat']}: Muhurat {r['hour']:+.2f}%, year {r['year']:+.1f}%", r["hour"],
            "% Muhurat close vs previous close", f"close {r['date']} {r['close']}; prev {r['prev_date']} {r['prev']}",
            f"{r['close']}/{r['prev']}-1", r["date"])
        add("mm-bars", f"Samvat {r['samvat']} year", r["year"], "% Muhurat close to last close before next Muhurat",
            f"close {r['end_date']} {r['end']}", f"{r['end']}/{r['close']}-1", r["end_date"])
    add("dk-hook", f"{s['up']} of {s['n']}", s["up"], "sessions closing higher", "count of the rows above", "count hour > 0")
    add("dk-typical", f"Median move {s['median']:+.2f}%", s["median"], "%", "median of the rows above", "median")
    add("dk-typical", f"{s['small']} of {s['n']} moved less than 1%", s["small"], "sessions", "rows above", "count |hour| < 1")
    add("dk-typical", "Lowest close of 2008", s["low08"]["close"], "index points", s["low08"]["date"], "min of 2008 closes",
        s["low08"]["date"])
    add("mm-hook", f"Hour {s['mean_abs_hour']}% vs year {s['mean_abs_year']}%", s["mean_abs_hour"], "% mean absolute move",
        "rows above", f"mean |hour| = {s['mean_abs_hour']}; mean |year| = {s['mean_abs_year']}")
    c = s["cross"]
    add("mm-signal", f"Red hour then green year {c['rg']} of {c['rg'] + c['rr']}", c["rg"], "years", "rows above",
        f"gg {c['gg']} gr {c['gr']} rg {c['rg']} rr {c['rr']}")
    v = s["s2082"]
    for k, lab in (("start", "Muhurat 2025 close"), ("peak", "Samvat 2082 high close"), ("low", "Samvat 2082 low close"),
                   ("end", "Last close before Muhurat 2026")):
        add("mm-2082", lab, v[k][1], "index points", v[k][0], "", v[k][0])
    add("mm-2082", f"Fall from high {v['fall']}%", v["fall"], "%", "", f"{v['low'][1]}/{v['peak'][1]}-1")
    add("mm-2082", f"Last week {v['week']:+.1f}%", v["week"], "%", f"from {v['week_from'][0]} {v['week_from'][1]}",
        f"{v['end'][1]}/{v['week_from'][1]}-1")
    add("mm-long", f"{s['first']['close']} to {s['last']['close']}, about {s['times']}x", s["times"], "times",
        f"{s['first']['date']} to {s['last']['date']}", f"{s['last']['close']}/{s['first']['close']}")
    fields = "beat,screen_text,value,units,source_url,doc_title,doc_date,page,quote_or_section,calculation,checked_by,checked_on,note"
    with open(LEDGER, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields.split(","))
        w.writeheader()
        w.writerows(out)


if __name__ == "__main__":
    main()

"""Build the Namakkal egg-price line beats (e45, e75, e46) as HyperFrames videos from the NECC CSVs.

usage: namakkal_lines.py [data_dir]
data_dir defaults to ../darwin-research/contentengine/youtube/namakkal_egg_city/data next to this repo
(branch claude/namakkal-egg-city-research-yihbbg). Every number on screen is computed here from those files.
Writes hyperframes/videos/nk-<beat>/index.html (from videos/_line) and story.js. Then: hf.py sync, hf.py render nk-e45.
"""
import csv
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VID = ROOT / "hyperframes" / "videos"
DATA = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "darwin-research/contentengine/youtube/namakkal_egg_city/data"
MON = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()
KICKER = "NAMAKKAL · NECC EGG RATE"
DAILY_SRC = "Source: NECC daily rate sheets, e2necc.com"
NOTE = "NECC's rate is suggested, not mandatory"


def rs(p):
    return f"₹{p / 100:.2f}"


def pct(a, b):
    return f"{(b / a - 1) * 100:+.0f}%".replace("-", "−")


def days(lo, hi):
    """'16–24 Jul' for a run of days in one month, or a single day."""
    (y1, m1, d1), (y2, m2, d2) = lo, hi
    return f"{d1} {MON[m1 - 1]}" if (m1, d1) == (m2, d2) else f"{d1}–{d2} {MON[m2 - 1]}"


def daily():
    rows = {}
    for r in csv.DictReader(open(DATA / "necc_daily_namakkal_selected_months_paise.csv")):
        y, m = map(int, r["ym"].split("-"))
        rows[date(y, m, int(r["day"]))] = float(r["paise"])
    return rows


def window(rows, start, end):
    pts = [(d, p) for d, p in sorted(rows.items()) if start <= d <= end]
    want = (end - start).days + 1
    if len(pts) != want:
        sys.exit(f"{start}..{end}: {len(pts)} daily rows, need {want}")
    return pts


def run_of(pts, value, near):
    """The consecutive days around `near` on which the rate equals `value`."""
    i = next(k for k, (d, _) in enumerate(pts) if d == near)
    a = b = i
    while a > 0 and pts[a - 1][1] == value:
        a -= 1
    while b + 1 < len(pts) and pts[b + 1][1] == value:
        b += 1
    return pts[a][0], pts[b][0]


def ymd(d):
    return d.year, d.month, d.day


def daily_story(pts, head, caps_fn, marks_fn, y0, y1, dur, draw):
    start = pts[0][0]
    x = lambda d: (d - start).days
    ticks = [{"x": x(d), "label": f"1 {MON[d.month - 1]}"} for d, _ in pts if d.day == 1]
    return {
        "dur": dur, "draw": draw, "kicker": KICKER, "head": head, "unit": "₹ a egg", "src": DAILY_SRC, "note": NOTE,
        "x0": 0, "x1": x(pts[-1][0]), "y0": y0, "y1": y1, "ystep": 0.5, "xticks": ticks,
        "series": [[x(d), round(p / 100, 2)] for d, p in pts],
        "marks": marks_fn(x), "caps": caps_fn(),
    }


def e45(rows):
    pts = window(rows, date(2026, 6, 1), date(2026, 8, 31))
    top = max(p for _, p in pts)
    first_top = next(d for d, p in pts if p == top)
    lo, hi = run_of(pts, top, first_top)
    end_d, end_p = pts[-1]
    fall_from = next(d for d, p in pts if d > hi and all(q == end_p for e, q in pts if e >= d))
    ch = pct(top, end_p)
    mid = lo + (hi - lo) / 2
    caps = lambda: [
        {"at": 1.0, "text": f"NECC's suggested rate for Namakkal eggs, 1 Jun to 31 Aug 2026"},
        {"at": 6.2, "text": f"Peak {rs(top)} a egg, {days(ymd(lo), ymd(hi))} 2026"},
        {"at": 10.6, "text": f"{rs(end_p)} from {days(ymd(fall_from), ymd(fall_from))}: {ch} from the peak"},
    ]
    marks = lambda x: [
        {"x": x(mid), "y": top / 100, "dy": -26, "v": rs(top), "d": f"{days(ymd(lo), ymd(hi))} 2026", "cls": "gold", "at": 6.0},
        {"x": x(end_d), "y": end_p / 100, "dy": 30, "dx": -40, "v": rs(end_p), "d": f"from {days(ymd(fall_from), ymd(fall_from))}",
         "cls": "red below", "at": 10.4},
        {"x": x(fall_from) - 18, "y": (top + end_p) / 200, "v": ch, "d": "peak to late Aug", "cls": "red left", "at": 11.6},
    ]
    print(f"e45: peak {rs(top)} {lo}..{hi}; {rs(end_p)} from {fall_from}; {ch}")
    return daily_story(pts, f"A RECORD IN JULY. {ch} BY LATE AUGUST", caps, marks, 5.0, 7.0, 16.1, 9.5)


def e75(rows):
    pts = window(rows, date(2026, 2, 1), date(2026, 4, 30))
    s_d, s_p = pts[0]
    low = min(p for _, p in pts)
    first_low = next(d for d, p in pts if p == low)
    lo, hi = run_of(pts, low, first_low)
    ch = pct(s_p, low)
    mid = lo + (hi - lo) / 2
    caps = lambda: [
        {"at": 1.0, "text": "NECC's suggested rate for Namakkal eggs, 1 Feb to 30 Apr 2026"},
        {"at": 5.4, "text": f"{rs(s_p)} on {days(ymd(s_d), ymd(s_d))} 2026"},
        {"at": 9.2, "text": f"{rs(low)} on {days(ymd(lo), ymd(hi))} 2026: {ch} in under two months"},
    ]
    marks = lambda x: [
        {"x": x(s_d), "y": s_p / 100, "dx": 26, "v": rs(s_p), "d": f"{days(ymd(s_d), ymd(s_d))}", "cls": "right", "at": 5.2},
        {"x": x(mid), "y": low / 100, "dy": 30, "v": rs(low), "d": f"{days(ymd(lo), ymd(hi))} 2026", "cls": "red below", "at": 9.0},
        {"x": x(lo) - 40, "y": (s_p + low) / 200 + 0.1, "v": ch, "d": f"{days(ymd(s_d), ymd(s_d))} to {days(ymd(lo), ymd(lo))}",
         "cls": "red left", "at": 10.2},
    ]
    days_span = (lo - s_d).days
    if days_span >= 60:
        sys.exit(f"e75 caption says under two months, but it is {days_span} days")
    print(f"e75: {rs(s_p)} {s_d}; low {rs(low)} {lo}..{hi}; {ch} in {days_span} days")
    return daily_story(pts, "THE MARCH 2026 CRASH", caps, marks, 3.5, 5.5, 15.3, 8.6)


def e46():
    mon = [(int(r["year"]), int(r["month"]), float(r["rs_per_egg"]))
           for r in csv.DictReader(open(DATA / "namakkal_monthly_rupees.csv"))]
    ann = {int(r["year"]): (float(r["avg_rs_per_egg"]), int(r["months_published"]))
           for r in csv.DictReader(open(DATA / "namakkal_annual_rupees.csv"))}
    full = sorted(y for y, (_, n) in ann.items() if n == 12)
    have = {(y, m) for y, m, _ in mon}
    for y in full:
        got = [m for m in range(1, 13) if (y, m) in have]
        if len(got) != 12:
            sys.exit(f"{y} is marked complete but has {len(got)} months")
        mean = sum(v for yy, m, v in mon if yy == y) / 12
        if abs(mean - ann[y][0]) > 0.006:
            sys.exit(f"{y}: annual file says {ann[y][0]}, months average {mean:.3f}")
    a, b = full[0], max(y for y in full if y < 2026)
    cagr = (ann[b][0] / ann[a][0]) ** (1 / (b - a)) - 1
    lowest = sum(1 for y in full if min((v, m) for yy, m, v in mon if yy == y)[1] in (3, 4))
    y_first, y_last = mon[0][0], mon[-1][0]
    x = lambda y, m: (y - y_first) * 12 + (m - 1)
    series, prev = [], None
    for y, m, v in mon:
        if prev is not None and x(y, m) != prev + 1:
            series.append([prev + 0.5, None])          # 2020: Jan-Sep not published
        series.append([x(y, m), v])
        prev = x(y, m)
    bands = []
    for y in range(y_first, y_last + 1):
        bands.append({"x0": x(y, 3) - 0.5, "x1": x(y, 4) + 0.5, "kind": "low", "at": 9.6})
        if (y, 11) in have:
            bands.append({"x0": x(y, 11) - 0.5, "x1": x(y, 12) + 0.5, "kind": "high", "at": 9.6})
    peak_y, peak_m, peak_v = max(mon, key=lambda r: r[2])
    print(f"e46: {a} {ann[a][0]} -> {b} {ann[b][0]}, {cagr * 100:.1f}% a year; Mar/Apr lowest in {lowest} of {len([y for y in full if y < 2026])}; "
          f"highest month {MON[peak_m - 1]} {peak_y} {peak_v}")
    n_years = len([y for y in full if y < 2026])
    cagr_s = f"+{cagr * 100:.1f}% a year"
    return {
        "dur": 16.5, "draw": 7.6, "kicker": KICKER, "head": "THE LONG CLIMB, AND THE YEARLY DIP", "unit": "₹ a egg, monthly average",
        "src": "Source: NECC monthly-average rate sheets, e2necc.com", "note": f"Nominal rupees, not adjusted for inflation · 2020: only Oct–Dec published · {NOTE}",
        "x0": 0, "x1": x(y_last, 12), "y0": 1.5, "y1": 7.0, "ystep": 1.0,
        "xticks": [{"x": x(y, 1), "label": str(y)} for y in range(y_first, y_last + 1, 2)],
        "series": series, "bands": bands,
        "legend": [{"kind": "low", "label": "March–April"}, {"kind": "high", "label": "November–December"}],
        "dots": [{"x": x(a, 7) - 0.5, "y": ann[a][0], "at": 3.0}, {"x": x(b, 7) - 0.5, "y": ann[b][0], "at": 7.4}],
        "marks": [
            {"x": x(a, 7), "y": ann[a][0], "dy": -30, "dx": 40, "v": f"₹{ann[a][0]:.2f}", "d": f"{a} average", "cls": "gold", "at": 3.0},
            {"x": x(b, 7), "y": ann[b][0], "dy": 34, "v": f"₹{ann[b][0]:.2f}", "d": f"{b} average", "cls": "gold below", "at": 7.4},
        ],
        "caps": [
            {"at": 1.0, "text": f"Namakkal, NECC monthly average rate, Jan {y_first} to {MON[mon[-1][1] - 1]} {y_last}"},
            {"at": 7.6, "text": f"Annual average: {a} ₹{ann[a][0]:.2f} → {b} ₹{ann[b][0]:.2f} ({cagr_s})"},
            {"at": 11.0, "text": f"Lowest month: March or April in {lowest} of {n_years} full years"},
        ],
    }


def main():
    rows = daily()
    for beat, story in (("e45", e45(rows)), ("e75", e75(rows)), ("e46", e46())):
        d = VID / f"nk-{beat}"
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text((VID / "_line" / "index.html").read_text().replace("__DURATION__", str(story["dur"])))
        (d / "story.js").write_text("window.STORY = " + json.dumps(story, ensure_ascii=False, indent=1) + ";\n")
        print("wrote", d.relative_to(ROOT))


if __name__ == "__main__":
    main()

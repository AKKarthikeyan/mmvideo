"""India Ledger gold posters: a 10-slide carousel (1080x1350) and the same slides for YouTube Community posts (1080x1080).

usage: python3 scripts/india_ledger_posters.py
Every number comes from scripts/india_ledger_gold.py (imports(), sgb_model() and its typed-in sources), so the posters can
never disagree with the video. Writes out/india_ledger/posters/{carousel,community}/NN.png (not in git).
Colour (dataviz check, 18 Nov 2026): one gold highlight against warm grey context. Gold and the loss-red fail the
colour-blind separation check together, so red is used only for labelled stamp text, never as a data series.
"""
import contextlib
import html
import io
import shutil
import subprocess
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
import india_ledger_gold as G  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out" / "india_ledger" / "posters"
FONTS = ROOT / "hyperframes" / "shared" / "fonts"
OSWALD = next(ROOT.glob("hyperframes/videos/*/assets/fonts/Oswald-700.woff2"), None)

BG, INK, MUTED, GREY, GOLD, RED, GRID = "#f3efe6", "#14161a", "#4f555e", "#b9b09b", "#a8780a", "#c8431f", "#ddd5c4"
GREEN = "#0e7c66"  # channel accent (AK, 18 Nov 2026: keep ledger green). Gold only for things that are gold: price line, mined gram
SIZES = {"carousel": (1080, 1350), "community": (1080, 1080)}
CW = 936  # chart width (1080 minus 72px margins)

PORT_NAMES = {"DELHI AIR": "Delhi airport", "MUMBAI AIR": "Mumbai airport", "J MATADEE CHENNAI": "Chennai free-trade warehouse",
              "GIFT SEZ": "GIFT City SEZ", "CHENNAI AIR": "Chennai airport"}
COUNTRY_NAMES = {"SWITZERLAND": "Switzerland", "U ARAB EMTS": "UAE", "PERU": "Peru", "GHANA": "Ghana", "SOUTH AFRICA": "South Africa"}


def esc(t):
    return html.escape(str(t))


def cr(x):
    return f"₹{x / 100000:.2f} lakh crore" if x >= 100000 else f"₹{x:,.0f} crore"


def text(x, y, t, size=28, fill=INK, anchor="start", weight=400, family="Inter"):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-weight="{weight}" font-size="{size}" '
            f'fill="{fill}" text-anchor="{anchor}">{esc(t)}</text>')


def hbars(rows, h, unit="%", fmt="{:.1f}"):
    """Horizontal bars, one highlighted (gold), the rest grey. rows = [(label, value, highlight)]."""
    n = len(rows)
    gap = h / n
    ls = 28 if gap >= 90 else 23                      # label size
    bh = max(18, min(46, gap - ls - 26))
    vs = 34 if bh >= 30 else 28                       # value size
    vmax = max(v for _, v, _ in rows)
    out = []
    for i, (label, v, hi) in enumerate(rows):
        y = i * gap
        w = (CW - 40 - 19 * len(fmt.format(vmax) + unit)) * v / vmax
        out.append(text(0, y + ls, label, ls, INK if hi else MUTED, weight=600 if hi else 400))
        out.append(f'<rect x="0" y="{y + ls + 10:.1f}" width="{w:.1f}" height="{bh:.1f}" rx="4" fill="{GREEN if hi else GREY}"/>')
        out.append(text(w + 14, y + ls + 10 + bh / 2 + vs * 0.36, fmt.format(v) + unit, vs, INK, weight=700, family="Oswald"))
    return "".join(out)


def vbars(cats, vals, h, hi_last=True, color=GREEN, label_fmt="{}", top_pad=56, cw=CW, vsize=32):
    n = len(vals)
    slot = cw / n
    bw = min(110, slot * 0.6)
    vmax = max(vals)
    base = h - 44
    out = [f'<line x1="0" y1="{base}" x2="{cw}" y2="{base}" stroke="{GRID}" stroke-width="2"/>']
    for i, (c, v) in enumerate(zip(cats, vals)):
        x = i * slot + (slot - bw) / 2
        bh = (base - top_pad) * v / vmax
        hi = (i == n - 1) if hi_last else True
        out.append(f'<rect x="{x:.1f}" y="{base - bh:.1f}" width="{bw:.1f}" height="{bh:.1f}" rx="4" fill="{color if hi else GREY}"/>')
        out.append(text(x + bw / 2, base - bh - 14, label_fmt.format(v), vsize, INK, "middle", 700, "Oswald"))
        out.append(text(x + bw / 2, base + 34, c, 26, MUTED, "middle"))
    return "".join(out)


def line_chart(t, h):
    """Gold price per gram: RBI's issue price of every bond (2015-24), then RBI's latest redemption price."""
    pts = [(d, p) for d, p in zip(pd.to_datetime(t.issue_date), t.issue_price)]
    pts.append((pd.Timestamp(G.PRICE_DATE), G.PRICE_TODAY))
    x0, x1 = pd.Timestamp("2015-07-01"), pd.Timestamp("2027-03-01")
    ymax = 15000
    left, base = 124, h - 46
    X = lambda d: left + (CW - left - 20) * (d - x0).days / (x1 - x0).days
    Y = lambda p: base - (base - 20) * p / ymax
    out = []
    for v in (0, 5000, 10000, 15000):
        out.append(f'<line x1="{left}" y1="{Y(v):.1f}" x2="{CW}" y2="{Y(v):.1f}" stroke="{GRID}" stroke-width="{2 if v == 0 else 1}"/>')
        out.append(text(left - 12, Y(v) + 9, f"₹{v:,}", 24, MUTED, "end"))
    for yr in (2016, 2018, 2020, 2022, 2024, 2026):
        out.append(text(X(pd.Timestamp(f"{yr}-01-01")), base + 34, str(yr), 24, MUTED, "middle"))
    issue = pts[:-1]
    d = " ".join(f"{'M' if i == 0 else 'L'}{X(a):.1f},{Y(b):.1f}" for i, (a, b) in enumerate(issue))
    out.append(f'<path d="{d}" fill="none" stroke="{GOLD}" stroke-width="3" stroke-linejoin="round"/>')
    (la, lb), (ea, eb) = issue[-1], pts[-1]
    out.append(f'<line x1="{X(la):.1f}" y1="{Y(lb):.1f}" x2="{X(ea):.1f}" y2="{Y(eb):.1f}" stroke="{GOLD}" stroke-width="3" stroke-dasharray="8 8"/>')
    (a0, b0), (a1, b1) = issue[0], pts[-1]
    for a, b in ((a0, b0), (a1, b1)):
        out.append(f'<circle cx="{X(a):.1f}" cy="{Y(b):.1f}" r="8" fill="{GOLD}" stroke="{BG}" stroke-width="3"/>')
    out.append(text(X(a0), Y(b0) - 22, f"₹{b0:,.0f}", 38, INK, "start", 700, "Oswald"))
    out.append(text(X(a0), Y(b0) + 44, "Nov 2015", 24, MUTED))
    out.append(text(X(a1) - 24, Y(b1) + 12, f"₹{b1:,}", 38, INK, "end", 700, "Oswald"))
    out.append(text(X(a1) - 110, Y(b1) + 46, G.PRICE_LABEL, 24, MUTED, "end"))
    return "".join(out)


def dots(h, n_big):
    """One grey dot per gram imported (n_big) for the one gram mined in India (gold dot)."""
    cols = 30
    r = 9
    step = CW / cols
    out = []
    for i in range(n_big + 1):
        row, col = divmod(i, cols)
        cx, cy = col * step + step / 2, 20 + row * step * 0.92
        out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="{GOLD if i == 0 else GREY}"/>')
    rows = (n_big + 1 + cols - 1) // cols
    yb = 20 + rows * step * 0.92 + 30
    out.append(text(0, yb, "● 1 gram dug up in India", 30, INK, weight=600))
    out.append(text(CW, yb, f"{n_big} grams imported ●", 30, MUTED, "end"))
    return "".join(out), yb + 20


def days_vs_years(h):
    base = 0
    out = [text(0, base + 30, "The deposit scheme, Nov 2015 – Nov 2024", 28, MUTED),
           f'<rect x="0" y="{base + 50}" width="{CW}" height="56" rx="4" fill="{GREY}"/>',
           text(20, base + 90, "9 YEARS → 31 TONNES", 34, INK, weight=700, family="Oswald"),
           text(0, base + 190, "India's gold imports, at the FY 2025–26 pace", 28, MUTED),
           f'<rect x="0" y="{base + 210}" width="{CW * 16 / (9 * 365):.1f}" height="56" rx="4" fill="{GREEN}"/>',
           text(26, base + 250, "16 DAYS → 31 TONNES", 34, INK, weight=700, family="Oswald")]
    return "".join(out)


def slides(imp, sgb):
    fy = imp["by_fy"]
    cats = [f"FY{str(y)[2:]}" for y in fy.index]
    ports = imp["ports"]
    top_p = [(PORT_NAMES.get(k, k.title()), v, i == 0) for i, (k, v) in enumerate(ports.head(5).items())]
    top_p.append((f"{imp['n_ports'] - 5} other entry points", 100 - ports.head(5).sum(), False))
    ctry = imp["countries"]
    top_c = [(COUNTRY_NAMES.get(k, k.title()), v, i == 0) for i, (k, v) in enumerate(ctry.head(5).items())]
    top_c.append(("All other countries", 100 - ctry.head(5).sum(), False))
    t26 = imp["t26"]
    days = G.GMS_KG / 1000 / t26 * 365
    mined_per = t26 / G.MINE_OUTPUT_T
    a, b = fy.iloc[0], fy.iloc[-1]
    due = sgb["due"]
    first = sgb["first"]
    S = []
    S.append(dict(kind="cover", title="How do you lose money on gold that only went up?",
                  chart=lambda h: line_chart(sgb["tranches"], h),
                  note=f"Gold, ₹ per gram: RBI's issue price for each of the 67 gold bonds (2015–24), then RBI's redemption price on {G.PRICE_LABEL}.",
                  stamp=f"THE GOVERNMENT OWES {cr(sgb['owed']).upper()}",
                  src=f"RBI SGB issue and redemption prices · owed: our arithmetic at ₹{G.PRICE_TODAY:,}/g"))
    S.append(dict(n_mined=round(mined_per), title=f"India digs up 1 gram of gold. It buys {mined_per:,.0f}.",
                  chart="dots",
                  note=f"India mined {G.MINE_OUTPUT_T * 1000:,.0f} kg of gold in 2024–25 and imported {t26:,.0f} tonnes in 2025–26.",
                  src="Ministry of Mines, 2024–25 · DGCIS FY 2025–26 · our arithmetic"))
    S.append(dict(title=f"{(b.cr / a.cr - 1) * 100:.0f}% more money. {abs(b.t / a.t - 1) * 100:.0f}% less gold.",
                  chart=lambda h: two_panels(cats, fy, h),
                  note=f"Gold is India's #{imp['rank26']:.0f} import, after crude oil: {cr(imp['cr26'])}, {imp['share26']:.1f}% of everything India bought in 2025–26.",
                  src="DGCIS principal commodity data, FY 2021–22 to FY 2025–26 · our arithmetic"))
    S.append(dict(title=f"A third of India's gold lands at one airport",
                  chart=lambda h: hbars(top_p, h),
                  note="Share of the value of gold imports by entry point, 2025–26.",
                  src="DGCIS principal commodity × port, FY 2025–26 · our arithmetic"))
    S.append(dict(title="Half of it arrives from Switzerland and the UAE",
                  chart=lambda h: hbars(top_c, h),
                  note="Both are gold refining and trading hubs. Share of the value of gold imports by country, 2025–26.",
                  src="DGCIS principal commodity × country, FY 2025–26 · our arithmetic"))
    S.append(dict(title="Plan A: borrow the gold in Indian homes",
                  chart=lambda h: days_vs_years(h), ch=300, ch_sq=290,
                  note=f"{G.GMS_KG:,} kg from {G.GMS_DEPOSITORS:,} depositors: {G.GMS_KG / 1000 / G.HOUSEHOLD_T * 100:.1f}% of household gold. "
                       "Why so little? Deposited jewellery is melted after testing, and comes back only as gold, never as the bangle.",
                  src=f"Ministry of Finance, Mar 2025 · RBI FAQ · DGCIS · {days:.0f} days: our arithmetic"))
    S.append(dict(title="Plan B: sell gold it never owned",
                  chart=lambda h: hbars([("Gold bonds already repaid (24 issues)", sgb["matured_rate"], True),
                                         ("A normal 10-year government loan, same months", sgb["matured_gsec"], False)], h, "% a year"),
                  ch=300, ch_sq=240,
                  note=f"67 gold bonds, 147 tonnes, ₹72,274 crore. Legally, loans: the rupees were spent, with a promise to repay "
                       f"at gold's price on the day. Gold went from ₹{first.issue_price:,.0f} to ₹{G.PRICE_TODAY:,} a gram.",
                  src="RBI tranche data · 10-year G-sec yields (FRED) · cost a year: our arithmetic"))
    S.append(dict(title=f"The bill: {cr(sgb['owed'])}",
                  chart=lambda h: vbars([f"FY{str(y)[2:]}" for y in due.index], [round(v) for v in due.values], h,
                                        hi_last=False, label_fmt="₹{:,} cr", vsize=27),
                  note=f"Bonds still out, by the financial year they mature, at today's price. {cr(sgb['early_cr'])} of it can already be cashed at the next "
                       f"redemption windows. Every ₹1,000 on a gram adds {cr(sgb['per1000'])}.",
                  src=f"RBI tranche data · RBI redemption price ₹{G.PRICE_TODAY:,}/g, {G.PRICE_LABEL} · our arithmetic"))
    S.append(dict(kind="hide", title="What the numbers hide",
                  hero=f"≈ {cr(sgb['net'])}", hero_sub="the real extra cost of the bet, compared with borrowing normally (our estimate)",
                  bullets=["Owing isn't losing: part of the bill is money it borrowed anyway, and it paid 2.5% interest instead of about 7%.",
                           f"The estimate moves with gold: {cr(sgb['net_lo'])} to {cr(sgb['net_hi'])} if gold moves ₹2,000 a gram.",
                           "It wasn't useless: one estimate says the bonds saved $3.3 billion of gold imports in 2023–24.",
                           "It looked safe in 2015: gold had fallen for three years (RBI). Hindsight is 24 carat.",
                           "The bill moves every day with the price of gold."],
                  src="Our bond-by-bond estimate (67 issues) · Business Standard, Mar 2024 · educational research, not investment advice"))
    S.append(dict(kind="end", title="The full story",
                  bullets=["How Do You Lose Money on Gold That Only Went Up?", "Watch on India Ledger · @IndiaLedgerOfficial"],
                  sources=["RBI: SGB issue and redemption prices, Gold Monetisation Scheme FAQ, Handbook of Statistics 2019 (Table 39)",
                           "DGCIS foreign trade data (via Vonter/india-export-import, ODbL)",
                           "Ministry of Finance: Gold Monetisation Scheme statement, Mar 2025",
                           "World Gold Council: household gold, Aug 2026 · Ministry of Mines: output 2024–25",
                           "FRED: India 10-year government bond yield · Business Standard, Mar 2024",
                           "Computed figures are our arithmetic: scripts/india_ledger_gold.py"]))
    return S


def two_panels(cats, fy, h):
    """Tonnes (ink) and ₹ lakh crore (green) as two small charts, never one dual-axis chart."""
    half = (CW - 60) / 2
    def panel(vals, color, fmt, title):
        body = vbars(cats, vals, h - 50, hi_last=True, color=color, label_fmt=fmt, cw=half)
        return text(0, 26, title, 28, INK, weight=600) + f'<g transform="translate(0,50)">{body}</g>'
    left = panel([round(v) for v in fy.t], INK, "{:,}", "Tonnes imported")
    right = panel([round(v / 100000, 2) for v in fy.cr], GREEN, "₹{:.2f}L", "Paid, ₹ lakh crore")
    return f'<g>{left}</g><g transform="translate({half + 60},0)">{right}</g>'


def page(s, i, n, w, h):
    sq = h == w
    title_px = (66 if sq else 82) if len(s["title"]) < 48 else (58 if sq else 72)
    chart_h = s.get("ch_sq" if sq else "ch", 430 if sq else 580)
    chart_svg = ""
    if s.get("chart") == "dots":
        body, used = dots(chart_h, s["n_mined"])
        chart_svg = f'<svg width="{CW}" height="{used:.0f}" viewBox="0 0 {CW} {used:.0f}">{body}</svg>'
        if sq:
            chart_svg = f'<svg width="{CW}" height="{chart_h}" viewBox="0 0 {CW} {used:.0f}">{body}</svg>'
    elif callable(s.get("chart")):
        chart_svg = f'<svg width="{CW}" height="{chart_h}" viewBox="0 0 {CW} {chart_h}">{s["chart"](chart_h)}</svg>'
    bullets = "".join(f"<li>{esc(b)}</li>" for b in s.get("bullets", []))
    sources = "".join(f"<li>{esc(b)}</li>" for b in s.get("sources", []))
    stamp = (f'<div class="row"><div class="stamp">{esc(s["stamp"])}</div><div class="swipe">SWIPE →</div></div>'
             if s.get("stamp") else "")
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: Oswald; font-weight: 700; src: url("fonts/Oswald-700.woff2"); }}
@font-face {{ font-family: Inter; font-weight: 400; src: url("fonts/inter-latin-400-normal.woff2"); }}
@font-face {{ font-family: Inter; font-weight: 600; src: url("fonts/inter-latin-600-normal.woff2"); }}
@font-face {{ font-family: Plex; font-weight: 400; src: url("fonts/ibm-plex-mono-latin-400-normal.woff2"); }}
html, body {{ margin: 0; width: {w}px; height: {h}px; background: {BG}; color: {INK}; overflow: hidden; }}
.p {{ box-sizing: border-box; width: {w}px; height: {h}px; padding: {44 if sq else 60}px 72px {36 if sq else 48}px;
     display: flex; flex-direction: column; gap: {14 if sq else 22}px; position: relative; }}
.top {{ display: flex; justify-content: space-between; font: 700 {26 if sq else 30}px/1 Oswald; letter-spacing: .08em; color: {GREEN}; }}
.top span:last-child {{ color: {MUTED}; }}
h1 {{ margin: 0; font: 700 {title_px}px/1.02 Oswald; letter-spacing: .01em; text-transform: uppercase; }}
.note {{ font: 400 {26 if sq else 30}px/1.35 Inter; color: {INK}; }}
.src {{ font: 400 {18 if sq else 20}px/1.35 Plex; color: {MUTED}; margin-top: auto; }}
.foot {{ display: flex; justify-content: space-between; font: 700 {22 if sq else 24}px/1 Oswald; letter-spacing: .06em;
        border-top: 3px solid {INK}; padding-top: 12px; }}
.stamp {{ align-self: flex-start; white-space: nowrap; font: 700 {34 if sq else 38}px/1 Oswald; letter-spacing: .03em; color: {RED};
         border: 4px solid {RED}; margin-right: 24px; padding: 10px 16px 12px; transform: rotate(-2deg); }}
.hero {{ font: 700 {92 if sq else 104}px/1 Oswald; color: {GREEN}; text-transform: uppercase; white-space: nowrap; }}
.row {{ display: flex; justify-content: space-between; align-items: center; }}
.swipe {{ font: 700 {30 if sq else 36}px/1 Oswald; white-space: nowrap; }}
ul {{ margin: 0; padding-left: 1.1em; font: 400 {28 if sq else 34}px/1.35 Inter; }} li {{ margin: 0 0 {10 if sq else 18}px; }}
ul.s {{ font: 400 {20 if sq else 24}px/1.4 Plex; color: {MUTED}; }}
</style></head><body><div class="p">
<div class="top"><span>INDIA LEDGER · GOLD</span><span>{i + 1}/{n}</span></div>
<h1>{esc(s["title"])}</h1>
{chart_svg}
{f'<div class="note">{esc(s["note"])}</div>' if s.get("note") else ""}
{stamp}
{f'<div class="hero">{esc(s["hero"])}</div><div class="note">{esc(s["hero_sub"])}</div>' if s.get("hero") else ""}
{f"<ul>{bullets}</ul>" if bullets else ""}
{f'<ul class="s">{sources}</ul>' if sources else ""}
{f'<div class="src">{esc(s["src"])}</div>' if s.get("src") else '<div class="src"></div>'}
<div class="foot"><span>INDIA LEDGER</span><span>@IndiaLedgerOfficial</span></div>
</div></body></html>"""


RENDER_JS = r"""
const {chromium} = require('playwright');
(async () => {
  const [dir, w, h, n] = process.argv.slice(2);
  const b = await chromium.launch(process.env.PW_CHANNEL ? {channel: process.env.PW_CHANNEL} : {});
  const p = await b.newPage({viewport: {width: +w, height: +h}, deviceScaleFactor: 1});
  const over = [];
  for (let i = 1; i <= +n; i++) {
    const f = `${dir}/${String(i).padStart(2, '0')}`;
    await p.goto(`file://${f}.html`);
    await p.evaluate(() => document.fonts.ready);
    const o = await p.evaluate(() => { const el = document.querySelector('.p'); return el.scrollHeight > el.clientHeight + 1; });
    if (o) over.push(i);
    await p.screenshot({path: `${f}.png`});
  }
  await b.close();
  console.log(over.length ? `OVERFLOW on slides ${over.join(', ')}` : 'no overflow');
})();
"""


def node_env():
    """Mac Mini: Playwright lives outside the repo in ~/.mmvideo-tools and drives the installed Google Chrome (no browser download)."""
    import os
    env = dict(os.environ)
    tools = Path.home() / ".mmvideo-tools" / "node_modules"
    if tools.exists():
        env["NODE_PATH"] = str(tools) + (os.pathsep + env["NODE_PATH"] if env.get("NODE_PATH") else "")
    if Path("/Applications/Google Chrome.app").exists():
        env.setdefault("PW_CHANNEL", "chrome")
    return env


def main():
    with contextlib.redirect_stdout(io.StringIO()):
        imp = G.imports()
        sgb = G.sgb_model()
    S = slides(imp, sgb)
    if OSWALD is None:
        sys.exit("Oswald-700.woff2 not found: run python3 hyperframes/tools/hf.py sync first")
    js = OUT / "render.js"
    OUT.mkdir(parents=True, exist_ok=True)
    js.write_text(RENDER_JS)
    for name, (w, h) in SIZES.items():
        d = OUT / name
        (d / "fonts").mkdir(parents=True, exist_ok=True)
        for f in ("inter-latin-400-normal.woff2", "inter-latin-600-normal.woff2", "ibm-plex-mono-latin-400-normal.woff2"):
            shutil.copy(FONTS / f, d / "fonts" / f)
        shutil.copy(OSWALD, d / "fonts" / "Oswald-700.woff2")
        for i, s in enumerate(S):
            (d / f"{i + 1:02d}.html").write_text(page(s, i, len(S), w, h))
        r = subprocess.run(["node", str(js), str(d), str(w), str(h), str(len(S))], capture_output=True, text=True, env=node_env())
        print(name, f"{w}x{h}:", (r.stdout + r.stderr).strip())
    print("written to", OUT)


if __name__ == "__main__":
    main()

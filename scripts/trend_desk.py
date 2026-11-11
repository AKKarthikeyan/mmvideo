#!/usr/bin/env python3
"""Trend desk: the morning sweep for "ride the trend" explainers (docs/PREMIUM_LOOKS_AND_TRENDS.md, section 4).

usage: trend_desk.py [--geo IN] [--out out/trend]      writes out/trend/<date>.md and prints the shortlist

What it does: polls Google Trends "Trending Now", Google News top stories, Reddit r/india, and the RBI, SEBI and PIB
release feeds; counts on how many signals each trending topic appears; guesses which of our channels it fits; marks
red flags; and lists the day's official releases, which are the primary documents an explainer needs.

What it does not do: decide. It pre-fills two of the five checks (slope, fit). The owner scores the other three
(gap, shelf life, edge) and applies the go rule: 7 or more out of 10 with no zero on fit, two primary sources in
hand, no red flag, and the Short can ship within 24 hours. Trend data is a lead, not a fact: verify every claim
against a primary document before scripting.
"""
import datetime as dt
import html
import pathlib
import re
import sys
import xml.etree.ElementTree as ET

import requests

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = {"User-Agent": "Mozilla/5.0 (trend desk)"}
FEEDS = {
    "trends": "https://trends.google.com/trending/rss?geo={geo}",
    "news": "https://news.google.com/rss?hl=en-{geo}&gl={geo}&ceid={geo}:en",
    "business": "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-{geo}&gl={geo}&ceid={geo}:en",
    "reddit": "https://www.reddit.com/r/india/top/.rss?t=day",
    "rbi": "https://www.rbi.org.in/pressreleases_rss.xml",
    "sebi": "https://www.sebi.gov.in/sebirss.xml",
    "pib": "https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",
}
# which channel a topic fits: words in the trend title or its headlines
FIT = {
    "Moat & Margin": r"\b(share|stock|ipo|results|profit|revenue|bank|rbi|sebi|nifty|sensex|rupee|inflation|gdp|tax|gst|budget|loan|emi|merger|acquisition|earnings|crore|tariff|export|import)\b|शेयर|बैंक|ब्याज|मुनाफ़ा|मुनाफा|आईपीओ|रुपया|महंगाई|जीएसटी|बजट|பங்கு|వడ్డీ",
    "Indica Atlas": r"\b(cyclone|monsoon|rain|flood|earthquake|river|border|island|coast|state|district|map|weather|heatwave|snow|himalaya|port|railway|highway|airport|census)\b",
    "UPSC Mains": r"\b(bill|act|amendment|supreme court|high court|parliament|lok sabha|rajya sabha|constitution|governor|election commission|census|delimitation|scheme|yojana|policy|ordinance|cabinet|treaty|summit)\b|विधेयक|संशोधन|सुप्रीम कोर्ट|संसद|लोक सभा|राज्य सभा|संविधान|जनगणना|योजना|कैबिनेट",
    "Data Kadai": r"\b(price|prices|cost|fare|airfare|petrol|diesel|gold|silver|salary|rent|onion|tomato|lpg|electricity|recharge|toll|rate)\b|कीमत|दाम|किराया|सोना|चांदी|पेट्रोल|डीज़ल|विलை|రేటు|ధర",
    "Moat Atlas": r"\b(airport|port|metro|expressway|bridge|tunnel|plant|factory|refinery|mine|dam|corridor|fab|semiconductor|data centre|data center)\b",
    "The Inventor Desk": r"\b(invent|patent|launch|isro|rocket|satellite|chip|ai model|robot|vaccine|battery|ev)\b",
}
# never a go without a second look
RED = {
    "named accusation": r"\b(arrest|arrested|accused|fir|scam|fraud|raid|chargesheet|rape|murder|molest)\b|गिरफ्तार|आरोप|घोटाला|हत्या",
    "pending case": r"\b(hearing|bail|verdict|petition|contempt|sub judice|trial)\b",
    "election period": r"\b(poll|polling|exit poll|election result|voting|by-election|bypoll)\b",
    "stock price talk": r"\b(share price|stock price|share target|target price|multibagger|buy or sell|should you buy)\b|टारगेट|शेयर खरीदें|चढ़ा स्टॉक",
    "death or disaster": r"\b(dies|dead|death|killed|crash|blast|stampede)\b",
}
SOFT = r"\b(vs|match|cricket|ipl|t20|odi|test|football|trailer|movie|film|song|actor|actress|bigg boss|birthday|horoscope|lottery|result 20\d\d)\b"


def fetch(url):
    try:
        r = requests.get(url, headers=UA, timeout=30)
        r.raise_for_status()
        return ET.fromstring(r.content)
    except Exception as e:
        print(f"  feed failed: {url.split('/')[2]}: {str(e)[:80]}")
        return None


def text(el, tag):
    x = el.find(tag)
    return html.unescape(re.sub("<[^>]+>", "", x.text or "")).strip() if x is not None and x.text else ""


def items(root):
    """RSS <item> or Atom <entry>, as (title, link, published)."""
    if root is None:
        return []
    out = []
    for it in root.iter("item"):
        out.append((text(it, "title"), text(it, "link"), text(it, "pubDate")))
    A = "{http://www.w3.org/2005/Atom}"
    for it in root.iter(A + "entry"):
        link = it.find(A + "link")
        out.append((text(it, A + "title"), link.get("href") if link is not None else "", text(it, A + "updated")))
    return out


def words(s):
    return {w for w in re.findall(r"\w+", s.lower()) if len(w) > 2}        # any script: Hindi, Tamil and Telugu trends are common


def main():
    a = sys.argv[1:]
    geo = a[a.index("--geo") + 1] if "--geo" in a else "IN"
    out_dir = pathlib.Path(a[a.index("--out") + 1]) if "--out" in a else ROOT / "out" / "trend"
    today = dt.datetime.now(dt.timezone(dt.timedelta(hours=5, minutes=30)))
    roots = {k: fetch(u.format(geo=geo)) for k, u in FEEDS.items()}
    HT = "{https://trends.google.com/trending/rss}"
    trends = []
    if roots["trends"] is not None:
        for it in roots["trends"].iter("item"):
            heads = [(text(n, HT + "news_item_title"), text(n, HT + "news_item_url"), text(n, HT + "news_item_source")) for n in it.iter(HT + "news_item")]
            trends.append(dict(title=text(it, "title"), traffic=text(it, HT + "approx_traffic"), heads=heads))
    news = items(roots["news"]) + items(roots["business"]); reddit = items(roots["reddit"])
    rows = []
    for t in trends:
        blob = (t["title"] + " " + " ".join(h[0] for h in t["heads"])).lower()
        key = words(t["title"]) or set(t["title"].lower().split())
        hit = lambda pool: [x for x in pool if key & words(x[0]) and len(key & words(x[0])) >= max(1, min(2, len(key)))]
        n_news, n_red = hit(news), hit(reddit)
        signals = 1 + bool(n_news) + bool(n_red)
        fit = [c for c, rx in FIT.items() if re.search(rx, blob)]
        red = [k for k, rx in RED.items() if re.search(rx, blob)]
        soft = bool(re.search(SOFT, blob))
        slope = 2 if signals >= 3 else 1 if signals == 2 else 0
        fit_score = 0 if not fit or soft else 2 if len(fit) == 1 or fit[0] in ("Moat & Margin", "Indica Atlas", "UPSC Mains") else 1
        rows.append(dict(t=t, signals=signals, news=n_news, fit=fit, red=red, soft=soft, slope=slope, fit_score=fit_score))
    rows.sort(key=lambda r: (-(r["fit_score"] > 0), -(r["slope"] + r["fit_score"]), bool(r["red"])))

    L = [f"# Trend desk · {today:%a %d %b %Y, %H:%M} IST · {geo}", "",
         "Leads, not facts: verify against a primary document before scripting. Go rule: 7+/10 with no zero on fit, two",
         "primary sources, no red flag, Short within 24 hours (docs/PREMIUM_LOOKS_AND_TRENDS.md).", "",
         "## Shortlist (slope and fit are pre-filled; score gap, shelf life and edge yourself, 0-2 each)", "",
         "| # | Trending search | Top headline | Traffic | Signals | Slope | Fit | Channel | Red flags | Gap | Shelf | Edge |",
         "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"]
    for i, r in enumerate(rows, 1):
        top = (r["t"]["heads"][0][0][:90] if r["t"]["heads"] else "").replace("|", "/")
        L.append(f"| {i} | {r['t']['title']} | {top} | {r['t']['traffic']} | {r['signals']}/3 | {r['slope']} | {r['fit_score']} | "
                 f"{', '.join(r['fit']) or ('sport or entertainment' if r['soft'] else 'no fit')} | {', '.join(r['red']) or 'none'} |  |  |  |")
    L += ["", "## Headlines behind each trend", ""]
    for r in rows:
        if r["fit_score"] == 0:
            continue
        L.append(f"**{r['t']['title']}** ({r['t']['traffic']})")
        for h in r["t"]["heads"][:3]:
            L.append(f"- {h[0]} · {h[2]} · {h[1]}")
        L.append("")
    L += ["## Official releases (primary documents)", ""]
    for name, key in (("RBI", "rbi"), ("SEBI", "sebi"), ("PIB", "pib")):
        its = items(roots[key])[:8]
        L.append(f"**{name}**" + ("" if its else " (feed unavailable)"))
        L += [f"- {t} · {d[:16]} · {u}" for t, u, d in its] + [""]
    L += ["## Top stories (Google News, India)", ""] + [f"- {t}" for t, _, _ in items(roots["news"])[:12]]
    out_dir.mkdir(parents=True, exist_ok=True)
    f = out_dir / f"{today:%Y-%m-%d}.md"
    f.write_text("\n".join(L) + "\n", encoding="utf-8")
    print("\n".join(L[: 12 + len(rows)]))
    print(f"\nfull sheet: {f}")


if __name__ == "__main__":
    main()

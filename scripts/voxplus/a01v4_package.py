#!/usr/bin/env python3
"""A01 v4 packaging: SRT (from MiniMax sentence timings + the film timeline; spoken numbers written as figures) and the
.youtube.txt (titles, description, chapters, questions answered, sources, media credits, disclaimer, holdings line).
Usage: python3 a01v4_package.py OUT_STEM   (writes OUT_STEM.srt and OUT_STEM.youtube.txt; refuses to overwrite unless -f)"""
import json, pathlib, re, sys
V = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/a01v4/vo")
T = json.loads((V / "timing.json").read_text()); S = json.loads((V / "timeline.json").read_text())
stem = pathlib.Path(sys.argv[1]); force = "-f" in sys.argv
NUM = [("one hundred and sixty three thousand, one hundred and twenty two dollars", "$163,122"), ("three hundred and fifty eight million dollars", "$358 million"),
 ("eight hundred and fifty seven million", "$857 million"), ("one hundred and thirty seven depots", "137 depots"), ("ten thousand crore rupees", "₹10,000 crore"),
 ("thirty three point three in every hundred", "33.3 in every 100"), ("thirty five thousand tonnes", "35,000 tonnes"), ("nine thousand participants", "9,000 participants"),
 ("one point six five lakh", "1.65 lakh"), ("twenty three and a half", "23.5"), ("from thirty five rupees to twenty eight", "from ₹35 to ₹28"),
 ("from twenty rupees to five", "from ₹20 to ₹5"), ("twenty five million dollars", "$25 million"), ("thirteen million dollars", "$13 million"),
 ("Five thousand dollars", "$5,000"), ("twenty six dollars", "$26"), ("Twenty six dollars", "$26"), ("fifty dollars", "$50"), ("every hundred dollars", "every $100"),
 ("forty four percent", "44%"), ("forty percent", "40%"), ("April two thousand twenty six", "April 2026"), ("July two thousand twenty six", "July 2026"),
 ("June two thousand fifteen", "June 2015"), ("two thousand twenty four", "2024"), ("two thousand twenty two", "2022"), ("two thousand seven", "2007"),
 ("two thousand five", "2005"), ("nineteen eighty one", "1981"), ("nineteen eighty three", "1983"), ("nineteen eighty six", "1986"), ("nineteen eighty nine", "1989"),
 ("nineteen ninety three", "1993"), ("nineteen ninety four", "1994"), ("nineteen ninety six", "1996"), ("nineteen ninety nine", "1999"), ("nineteen seventy two", "1972"),
 ("Thirteen letters", "13 letters"), ("thirty times", "30 times"), ("fifteen more", "15 more"), ("about sixty", "about 60"), ("eleven months", "11 months"),
 ("the fifth of October", "5 October"), ("three question check", "three-question check"), ("one word name", "one-word name")]
def written(t):
    for a, b in NUM: t = t.replace(a, b)
    return t
def chunks(text, t0, t1, maxc=84):
    parts = [p for p in re.split(r"(?<=[.?!:])\s+", text) if p]
    out = []
    for p in parts:
        while len(p) > maxc:
            cut = p.rfind(", ", 0, maxc); cut = cut + 1 if cut > 20 else p.rfind(" ", 0, maxc)
            out.append(p[:cut].strip()); p = p[cut:].strip()
        out.append(p)
    merged = []
    for p in out:
        if merged and len(merged[-1]) + 1 + len(p) <= 60: merged[-1] += " " + p
        else: merged.append(p)
    tot = sum(len(m) for m in merged); res, t = [], t0
    for m in merged:
        d = (t1 - t0) * len(m) / tot; res.append((t, t + d, m)); t += d
    return res
def lines2(s, w=42):
    if len(s) <= w: return s
    words, a = s.split(), ""
    best = min(range(1, len(s.split())), key=lambda i: abs(len(" ".join(words[:i])) - len(s) / 2))
    return " ".join(words[:best]) + "\n" + " ".join(words[best:])
def ts(x):
    h, m = int(x // 3600), int(x % 3600 // 60); s = x % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}"
cues = []
for b in S["order"]:
    for s0, s1, text in T[b]["sents"]:
        cues += chunks(written(text), S["start"][b] + s0, S["start"][b] + s1)
srt = "\n".join(f"{i}\n{ts(a)} --> {ts(z)}\n{lines2(t)}\n" for i, (a, z, t) in enumerate(cues, 1))
mmss = lambda x: f"{int(x // 60)}:{int(x % 60):02d}"
ch = lambda b: S["start"][b] - 0.7
CHAP = [(0, "Why would anyone sell a loom for $26?"), (ch("m01"), "What is a moat?"), (ch("n01"), "Why does a business need a moat?"),
        (ch("w01"), "What is a moat made of?"), (ch("f01"), "How do you spot a fake moat?"), (ch("s01"), "Can one star person be a moat?"),
        (ch("l01"), "Does a moat last forever?"), (ch("x01"), "How do you test a business?")]   # no 'Sources' chapter: the end card is under YouTube's 10 s chapter minimum
QA = [(0, "Why would anyone sell a $5,000 loom for $26? Berkshire's mill closed; no one would pay even $50, and the looms went for scrap at $26, less than it cost to take them away (letter for 1985). Our reading of why: rivals copied the mill's spending, so profits stayed poor."),
 (ch("m01"), "What is a moat? Around a castle, deep water that keeps attackers out. In business, whatever keeps rivals from taking your customers, for years (our plain words)."),
 (ch("n01"), "Why does a business need a moat? Because rivals keep attacking any castle that earns well (letter for 2007). See's, bought for $25 million in 1972, had earned $857 million before tax by the letter for 1999."),
 (ch("w01"), "What is a moat made of? Something rivals cannot copy fast. Our five kinds: low cost (GEICO), a trusted name (Coke, Maggi), being hard to leave, a crowd (IEX), a licence."),
 (ch("f01"), "How do you spot a fake moat? Buffett called them Roman Candles. Our two signs: a long past of profits, and a moat that must keep being rebuilt."),
 (ch("s01"), "Can one star person be a moat? A business that needs a superstar cannot be called great (letter for 2007). Our reading: the moat belongs to the place."),
 (ch("l01"), "Does a moat last forever? No. Buffett wrote that each of his businesses grows stronger or weaker daily (letter for 2005); Indian paint is that fight now, with no ending yet."),
 (ch("x01"), "How do you test a business? Our three-question check: could a rival with money copy it, must it be rebuilt all the time, would it walk out with one person?")]
yt = f"""LONG VIDEO (Vox Motion+) · {stem.name}.mp4 · {mmss(S['total'])} · 1920x1080 · 60 fps
Title options (A/B test):
  A. What Is a Moat? The $26 Loom That Explains It
  B. Why Did $5,000 Looms Sell for $26? What Is a Moat?
  C. The $26 Loom and the Candy Store: What Is a Moat?
Thumbnails: {stem.name}-thumb-1.png ($26?), -thumb-2.png (WHY $26?), -thumb-3.png (WHAT IS A MOAT?)

DESCRIPTION:
In 1981 Warren Buffett's company, Berkshire, bought fairly new looms for $5,000 each. When it shut its cloth mill, no one would buy them even at $50, and they went for scrap at $26 each. The same letter says the goodwill of one See's candy store, or of two paper routes in Buffalo, was worth more than all that machinery sold for. Why could rivals copy the mill's machines, but not that trust?
This video explains what a moat is, in plain words a school student can follow, with Buffett's letters on screen: why a business needs one, the five kinds we sort moats into (low cost, a trusted name, being hard to leave, a crowd, a licence), how to spot a fake one, why one star person is not a moat, why no moat lasts forever (Indian paint is that fight now), and a three-question check you can try on a shop on your street.
Lines marked 'our reading', 'our count', 'our arithmetic', 'our picture' or 'made-up example' are ours. Company figures are the companies' own claims, dated on screen.

QUESTIONS THIS VIDEO ANSWERS
""" + "\n".join(f"{mmss(t)} {q}" for t, q in QA) + """

Our articles used in this video:
Wide-Moat Stocks in India: We Scored 507 Companies and Found None (9 Aug 2026): https://www.moatmarginresearch.com/wide-moat-stocks-india/
IEX: A Monopoly the Regulator Can Dissolve (refreshed 5 Oct 2026): https://www.moatmarginresearch.com/iex-moat/
The Market That Became Too Successful (4 Sep 2026, update 5 Oct 2026): https://www.moatmarginresearch.com/the-market-that-became-too-successful/
The Paint Wars: Six Companies, Not One Wide Moat (21 Jul 2026, updated 17 Aug 2026): https://www.moatmarginresearch.com/paint-wars-asian-paints/
Does Asian Paints Have a Moat? The Filings Answer (17 Aug 2026): https://www.moatmarginresearch.com/does-asian-paints-have-a-moat/

CHAPTERS
""" + "\n".join(f"{int(t // 60):02d}:{int(t % 60):02d} {q}" for t, q in CHAP) + """

SOURCES
Berkshire Hathaway shareholder letters (index): https://www.berkshirehathaway.com/letters/letters.html
  Letter for 1985 (textile mill, looms, See's and the paper routes, the parade): https://www.berkshirehathaway.com/letters/1985.html
  Letter for 1986 (GEICO, the first 'moat' in the letters we have): https://www.berkshirehathaway.com/letters/1986.html
  Letters for 1983 (See's goodwill), 1989 (USAir), 1991 (See's purchase), 1993 (Coke, Gillette), 1994 and 1996 (USAir), 1999 (See's earnings), 2004 ("I'll have a Coke"), 2005 (stronger or weaker; widening the moat), 2007 (castles, Roman Candles, the surgeon and the Mayo Clinic); one line each from 2008, 2013 and 2016
Nestlé India, Annual Report 2015 (pp.20-21): https://www.nestle.in/sites/g/files/pydnoa451/files/investors/stockandfinancials/documents/annual_report/01_nestle-india-annual-report-15.pdf
Nestlé India, Annual Report 2016 (pp.5, 21): https://www.nestle.in/sites/g/files/pydnoa451/files/investors/stockandfinancials/documents/annual_report/nestle-india-annual-report-2016.pdf
Asian Paints, Q1 FY2025 earnings call transcript, 17 Jul 2024 (the company's filed transcript): [AK to add link]
CERC, draft Power Market (Second Amendment) Regulations, 2026 (17 Apr 2026), as cited in our IEX article; not final as of our check on 5 Oct 2026
IEX analyst meet, 24 Jul 2026 (9,000+ participants), as quoted in our IEX article

MEDIA CREDITS
Loom photo: Draper looms, Bamberg Cotton Mill, South Carolina, 1987, Jack E. Boucher, Historic American Engineering Record (HAER) / Library of Congress (public domain). Shown as "looms like these", not Berkshire's looms.
Weaving shed photo: Northrop looms, C.W.S. Radcliffe weaving shed, 1912 (public domain), shown as an illustration.
Box of chocolates: Evan-Amos, Wikimedia Commons (CC0). Generic box, no See's packaging.
Maps: Natural Earth (public domain), India point of view.
Music: "Curious Ambience" by Reg1n0ld and "Strings with Percussion" by BuytheField (CC0, Freesound). Sound effects: Kingofgamers_cz, zembacraftworks, elliott.klein, mpuffenbarger, cabled_mess, BranRainey, Kinoton, ConarB13, greenvwbeetle (CC0, Freesound).
Everything else is drawn in code by Moat & Margin.

Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. No buy/sell recommendations, no price targets.
#MoatMargin #WhatIsAMoat #WarrenBuffett

PINNED COMMENT: Questions this video answers: """ + " · ".join(f"{mmss(t)} {q.split('?')[0]}?" for t, q in QA) + """. Which kind of moat should we go deeper on next? Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. No buy/sell recommendations, no price targets.
Holdings disclosure line: [AK to fill]
"""
for ext, body in ((".srt", srt), (".youtube.txt", yt)):
    p = stem.with_name(stem.name + ext)
    if p.exists() and not force: raise SystemExit(f"exists: {p} (pass -f)")
    p.write_text(body); print("wrote", p, len(body))
print(len(cues), "subtitle cues; chapters:", [(mmss(t), q) for t, q in CHAP])

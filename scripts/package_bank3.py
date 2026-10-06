#!/usr/bin/env python3
"""4 Oct 2026: SRTs + upload sheet for bank napkin Shorts set 3 (bkl–bko). Facts: out/vx/bank-q2-forensic-scripts-v2.md"""
import json, math, re, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from package_shyam import srt, split
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx"); H = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/hand")
S = [
 ("bkl", "bank-q2-tmb-105-years-startup", "WATCH", "A 105-year-old bank growing like a startup #shorts",
  "Tamilnad Mercantile Bank: total advances ₹46,930 → ₹60,715 crore (+29.37%), third-fastest of the 22 banks we track (behind Ujjivan 32.12% and Equitas 29.58%). Deposits ₹55,421 → ₹69,546 crore (+25.49%); CASA +16.26%. 82.5% of new deposits were term deposits; CASA share 27.4% → 25.3% (our maths on the 1 Oct 2026 filing).",
  "Fast growth funded by costlier deposits: strength or strain? Tag someone from Thoothukudi."),
 ("bkm", "bank-q2-canara-pnb-other-side-of-baroda", "WATCH", "Canara and PNB: the other side of Bank of Baroda #shorts",
  "Canara Bank, India: advances +16.83% (+₹1,82,005 crore) vs deposits +10.96% (+₹1,52,870 crore); gap ₹29,135 crore (our maths, 1 Oct 2026 filing). PNB overseas advances (global − domestic) ₹51,707 → ₹84,110 crore (+62.7%); overseas loans per ₹100 of overseas deposits 97 → 129 (our maths, 2 Oct 2026 filing).",
  "Spare deposits at home, or a funding gap: which bank's position would you rather be in, and why?"),
 ("bkn", "bank-q2-karnataka-bank-number-two", "WATCH", "Karnataka Bank lent ₹149 for every ₹100 raised #shorts",
  "Karnataka Bank: gross advances ₹73,644 → ₹92,015 crore (+24.94%, +₹18,370 crore); deposits ₹1,02,817 → ₹1,15,138 crore (+11.98%, +₹12,321 crore). Loan-to-deposit ratio 71.6% → 79.9% (our maths). CASA +14.88%; CASA ratio 31.01% → 31.81% (filed, 1 Oct 2026).",
  "Union is #1 at ₹213, Karnataka #2 at ₹149. Where's your bank? Full table in the 22-bank Short."),
 ("bko", "bank-q2-22-banks-league", "—", "22 banks, one napkin: how much did they lend per ₹100? #shorts",
  "₹ lent per ₹100 of new deposits, one year to 30 Sep 2026 (our maths: increase in advances ÷ increase in deposits, as filed by each bank, 1–3 Oct 2026). Union 213, Karnataka 149, Equitas 138, UCO 133, Bandhan 125, Capital SFB 122, Punjab & Sind 116, Canara 113, PNB 108, Karur Vysya 107, Indian Bank 107, CSB 106, J&K 103, TMB 98, Ujjivan 97, Bank of Baroda 93, ESAF 86, AU 86, Dhanlaxmi 84, South Indian 80, Bank of India 79, IDBI 79. Each bank's own basis (global or total); IDBI uses net advances; Bandhan includes PTC; UCO and Indian Bank file rounded lakh crore.",
  "Find your bank and comment its number. SBI, HDFC Bank, ICICI and others haven't filed yet: we'll add them."),
]
lines = ["BANK Q2 NAPKIN SHORTS · SET 3 (4 Shorts: TMB, Canara+PNB, Karnataka, 22-bank roundup) · Indian-accent narrator · loop endings · AK approved scripts 4 Oct",
 "Storyline: hook → CLUE 1 → CLUE 2 → THE TWIST → VERDICT stamp (GOOD / WATCH / CONCERN — on the filing, not the stock).",
 "Scripts + full fact tables: bank-q2-forensic-scripts-v3.md. Scoreboard link for descriptions: https://www.moatmarginresearch.com/q2-fy27-bank-scoreboard/",
 "Posting order (after set 2): TMB → Canara+PNB → Karnataka → 22-bank roundup last (one a day, 12:30 or 20:30 IST). Pin the roundup on the channel; link it from the Union and Karnataka pinned comments.",
 "Description footer on all: Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. #MoatMargin #shorts #banking", ""]
for n, (sid, fn, verdict, title, facts, pin) in enumerate(S, 1):
    bs = json.load(open(H / sid / "beats.json")); t = 0; ent = []
    for b in bs:
        parts = [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", b["text"]) if p.strip()]
        ent += split(b["text"], t, t + b["sec"], parts); t += math.ceil((b["sec"] + 0.15) * FPS) / FPS
    srt(ent, OUT / f"{fn}-napkin.srt")
    lines += [f"SHORT {n} · {fn}-napkin.mp4 · {t:.1f} s · VERDICT: {verdict}", f"Title: {title}", "Script:"]
    lines += [f"  {b['key']} {b['text']}" for b in bs]
    lines += [f"Description facts: {facts}", f"Pinned comment: {pin}", ""]
(OUT / "shorts-2026-10-04-bank-set3.txt").write_text("\n".join(lines))
print("\n".join(l for l in lines if l.startswith("SHORT")))

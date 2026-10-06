#!/usr/bin/env python3
"""4 Oct 2026: SRTs + upload sheet for bank napkin Shorts set 2 (bkd–bkk). Facts: out/vx/bank-q2-forensic-scripts-v2.md"""
import json, math, re, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from package_shyam import srt, split
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx"); H = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/hand")
S = [
 ("bkd", "bank-q2-bob-savers-india-borrowers-abroad", "WATCH", "Bank of Baroda: savers in India, borrowers abroad #shorts",
  "In India, Bank of Baroda's deposits grew ₹74,973 crore more than its loans. Abroad, loans grew ₹57,311 crore more than deposits. Overseas loans are 21.5% of the book but 39.5% of the year's loan growth (our maths on BoB's 3 Oct 2026 filing: global minus domestic).",
  "Should banks report India and overseas loan growth separately in the headline? PNB's overseas loans grew 62.7% too."),
 ("bke", "bank-q2-union-213-per-100", "WATCH", "Union Bank lent ₹213 for every ₹100 it raised #shorts",
  "Union Bank's gross advances grew ₹1,80,723 crore in a year; total deposits grew ₹84,836 crore (filed, 1 Oct 2026). Domestic CASA +14.66%; domestic term deposits +3.1% (our maths: deposits minus CASA). Domestic CD ratio 77.01% → 84.34% (filed).",
  "₹213 lent per ₹100 raised was the highest of the 22 banks we track. Which bank do you want on the napkin next?"),
 ("bkf", "bank-q2-boi-75000-crore-90-days", "GOOD ?", "Bank of India raised ₹75,000 crore in 90 days #shorts",
  "Bank of India's domestic deposits rose from ₹8,24,963 crore (30 Jun) to ₹9,00,218 crore (30 Sep 2026): +₹75,255 crore, 44% of the year's growth (our maths). Domestic advances rose ₹29,252 crore in the quarter. Global deposits +21.60% YoY, the fastest of the 8 government banks that have reported.",
  "Sticky savings or quarter-end money? What's your guess? We'll check the December numbers."),
 ("bkg", "bank-q2-thrissur-gold-csb-dhanlaxmi", "WATCH", "Two 100-year-old Kerala banks are betting on gold #shorts",
  "CSB Bank: gold loans ₹16,456 → ₹22,301 crore, 47.4% → 52.6% of gross advances (excludes receivables secured against gold). Dhanlaxmi Bank: gold loans ₹4,447 → ₹6,823 crore, 34.1% → 42.8%; gold (+2,376) and MSME (+672) grew more than the whole book (+2,907). Shares are our maths on the banks' 1 Oct 2026 filings.",
  "Gold loans are secured. Is one-collateral concentration a strength or a risk? Tag someone from Thrissur."),
 ("bkh", "bank-q2-esaf-625-crore-write-off", "CONCERN", "ESAF wrote off ₹625 crore in one quarter #shorts",
  "ESAF Small Finance Bank's Q2 FY27 update: technical write-off of ₹625 crore during Q2; the bank says growth would have been 28.32% instead of 25.05% without it. ₹625 crore is 2.6% of gross advances of ₹23,931 crore (our maths). Ujjivan reported ₹43 crore of write-offs in Q2 on a ₹45,699 crore book; definitions may differ.",
  "Should banks show write-offs as a growth adjustment or as a cost? Tell us."),
 ("bki", "bank-q2-equitas-microfinance-contrarian", "WATCH", "Peers exit microfinance. Equitas walks in. #shorts",
  "Equitas SFB: microfinance & micro loans ₹3,392 → ₹6,331 crore; excluding ₹579 crore of purchased agri loans (bank's footnote), ₹5,752 crore, +70% (our maths). CASA −1.04% YoY while deposits +19.03% (filed). Ujjivan's group loans fell to 34.3% of its book; ESAF's micro loans fell 4.6% in the quarter.",
  "Contrarian bet or early to a recovery? Which way are you leaning?"),
 ("bkj", "bank-q2-jk-bank-moat-thinner", "WATCH", "J&K Bank's deposit moat is getting thinner #shorts",
  "J&K Bank: CASA ratio 45.89% → 42.01% (−388 bps, filed). Deposits +₹24,766 crore in a year, of which CASA +₹4,503 crore; 82% came from term deposits (our maths). Gross advances +23.72%.",
  "42% CASA is still high. Is it a moat if it's shrinking? Share with someone who banks with J&K."),
 ("bkk", "bank-q2-au-sfb-deposit-engine", "GOOD", "13 of 22 banks lent more than they raised. Not AU. #shorts",
  "AU Small Finance Bank: deposits +₹37,951 crore vs gross advances +₹32,765 crore in a year (filed, 3 Oct 2026). CASA +29.1%, CASA ratio 29.4% → 29.5%. Gross loan portfolio incl. securitised +25.1%; sold-down book ₹5,352 → ₹3,480 crore. In 13 of the 22 banks we track, loans grew by more rupees than deposits (our maths).",
  "Which matters more to you in a bank: loan growth or deposit growth?"),
]
lines = ["BANK Q2 NAPKIN SHORTS · SET 2 (8 Shorts, 9 banks) · Indian-accent narrator · loop endings · AK approved scripts 4 Oct",
 "Storyline: hook → CLUE 1 → CLUE 2 → THE TWIST → VERDICT stamp (GOOD / WATCH / CONCERN — on the filing, not the stock).",
 "Scripts + full fact tables: bank-q2-forensic-scripts-v2.md. Scoreboard link for descriptions: https://www.moatmarginresearch.com/q2-fy27-bank-scoreboard/",
 "Posting order: bkd BoB → bke Union → bkg Gold → bkh ESAF → bkk AU → bkf BoI → bki Equitas → bkj J&K (one a day, 12:30 or 20:30 IST).",
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
(OUT / "shorts-2026-10-04-bank-set2.txt").write_text("\n".join(lines))
print("\n".join(l for l in lines if l.startswith("SHORT")))

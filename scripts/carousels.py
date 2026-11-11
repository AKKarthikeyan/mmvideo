#!/usr/bin/env python3
"""Instagram carousels: every spec in one place. Writes public/carousel/<id>/carousel.json for src/carousel/.
Usage: carousels.py <id> [<id> ...]      (carousels.py --all rewrites every one)

A spec is (kicker, slides). A slide that names a "clip" shows that filing clipping from the video of the same id
(public/vx/<id>/data.json, written by build_vx.py), so build the video first. Every figure is from the published article."""
import json, sys
import mm

CAROUSELS = {
 # 28 Sep 2026 theme articles: UPI MDR, IRDAI distribution reset, PB Fintech.
 "mdr": ("UPI MDR · 28 SEP 2026", [
  {"type":"cover","lines":["UPI GETS","A PRICE:","0.4% MDR"],"clip":"npci_example","stamp":"FROM 15 OCT 2026"},
  {"type":"stat","heading":"UPI PAYMENTS ABOVE ₹2,000","was":"FREE","big":"0.4%","sub":"PAID BY THE MERCHANT · CAPPED AT ₹300",
   "body":"Up to ₹2,000 stays free. Consumers pay nothing, and apps may not add a platform fee."},
  {"type":"bars","heading":"WHAT THE MERCHANT PAYS (₹)","rows":[
    {"name":"₹3,000 PURCHASE","v":12,"label":"₹12"},
    {"name":"₹50,000 PURCHASE","v":200,"label":"₹200"},
    {"name":"₹1,00,000 PURCHASE (CAP)","v":300,"label":"₹300","red":True}],
   "body":"NPCI's own examples. Without the cap, ₹1 lakh would cost ₹400."},
  {"type":"quote","heading":"WHO GETS THE 0.4%?","text":"“The operational parameters, fee distribution models, and category caps are decided by the UPI and Services Steering Committee”",
   "who":"NPCI FAQ · 15 SEP 2026","clip":"npci_committee"},
  {"type":"stat","heading":"PAYTM'S MARGIN TODAY","big":"4 BPS+","sub":"THE NEW MDR: 40 BPS GROSS",
   "body":"Payment processing margin was 'comfortably above 4bps' in Q1 FY27. Even a small share of 0.4% is large next to that."},
  {"type":"quote","heading":"THE RACE FOR MERCHANTS","text":"“With new monetization levers emerging, we want to walk the talk by investing back into the ecosystem”",
   "who":"PINE LABS CEO · 10 LAKH SOUNDBOXES","clip":"pine_quote"},
  {"type":"moat","heading":"THE MOAT QUESTION","label":"FOCUS MOAT · D2 SWITCHING COSTS","focus":"OWN THE MERCHANT",
   "body":"Every provider earns the same regulated rate. The moat is how many merchants you hold, and how hard it is for them to leave.",
   "score":"PAYTM 5.51 · PINE LABS 5.20"},
  {"type":"list","heading":"THE BEAR CASE","items":["A COMMITTEE SET THE RATE; ONE CAN CHANGE IT","PAYMENTS UP TO ₹2,000 STAY FREE",
    "NEW REVENUE SPENT ON ACQUIRING MERCHANTS","THE SPLIT MAY FAVOUR BANKS"],"lastRed":True},
  {"type":"end","sources":[
   "NPCI, FAQs on MDR on select UPI (P2M) payments, 15 Sep 2026",
   "Paytm: NPCI disclosure 15 Sep; Q1 FY27 release, 20 Jul 2026",
   "Pine Labs press release, 24 Sep 2026",
   "MoatSCOREs: Moat Screener, 28 Sep 2026"]}]),
 "irdai": ("IRDAI · 28 SEP 2026", [
  {"type":"cover","lines":["IRDAI'S","DISTRIBUTION","RESET"],"clip":"irdai_unwound","stamp":"COMMENTS BY 25 OCT 2026"},
  {"type":"bars","heading":"GROWTH, FY23 → FY25 (%)","rows":[
    {"name":"NEW-BUSINESS PREMIUM (CORPORATE AGENTS)","v":28,"label":"28%"},
    {"name":"DISTRIBUTOR REMUNERATION","v":125,"label":"125%","red":True},
    {"name":"PREMIUM PLACED BY GENERAL BROKERS","v":37,"label":"37%"},
    {"name":"BROKER COMMISSIONS","v":173,"label":"173%","red":True}],
   "body":"Payouts grew four to five times faster than premium."},
  {"type":"stat","heading":"PRIVATE LIFE INSURERS' EXPENSES","was":"16.5% IN FY21","big":"20.2%","sub":"OF PREMIUM IN FY26",
   "body":"Down from 21.3% in FY15, then back up after the 2023 reforms removed commission caps."},
  {"type":"list","heading":"WHAT IRDAI PROPOSES","items":["LIFE EXPENSES: 15% IN 2 YRS, 12.5% IN 5","GENERAL: 25% IN 2 YRS, 20% IN 5",
    "HARD CAPS ON EVERY COMMISSION","NO COMPULSORY INSURANCE WITH LOANS","NO SALES INCENTIVES FOR BANK STAFF"]},
  {"type":"bars","heading":"CAPS FOR BROKERS, BANKS, AGGREGATORS (%)","rows":[
    {"name":"LIFE, 10 YRS+: FIRST YEAR","v":20,"label":"20%"},
    {"name":"HEALTH: FIRST TIME","v":15,"label":"15%"},
    {"name":"HEALTH: RENEWAL OR PORTING","v":5,"label":"5%","red":True},
    {"name":"LIFE, SINGLE-PREMIUM SAVINGS","v":1,"label":"1%","red":True}],
   "body":"Agents get higher caps. Sales tied to a loan get lower ones."},
  {"type":"quote","heading":"BANKS","text":"“prohibit any volume linked or reward linked incentive for bank or NBFC staff selling insurance”",
   "who":"IRDAI CONSULTATION PAPER · 23 SEP 2026","clip":"irdai_staff"},
  {"type":"bars","heading":"COMMISSION, % OF PREMIUM · FY26","rows":[
    {"name":"LARGEST PRIVATE LIFE INSURER","v":4,"label":"4%"},
    {"name":"PUBLIC-SECTOR LIFE INSURER","v":5,"label":"5%"},
    {"name":"PRIVATE LIFE AVERAGE","v":9,"label":"9%","red":True}],
   "body":"The cheapest sellers are already inside the proposed limits."},
  {"type":"moat","heading":"THE MOAT QUESTION","label":"FOCUS MOAT · D3 COST ADVANTAGE","focus":"THE CHEAP SELLER",
   "body":"For insurers that already sell cheaply, the reform is not a cost. It is a constraint on their competitors.",
   "score":"BANKS 5.14–6.05 · INSURERS 5.19–5.94"},
  {"type":"list","heading":"THE BEAR CASE","items":["IT IS A DRAFT: COMMENTS TILL 25 OCT","LOWER COMMISSIONS MAY MEAN LOWER SALES",
    "CHEAPER SELLING ≠ HIGHER INSURER PROFIT","BANKS MAY RESTRUCTURE HOW THEY ARE PAID"],"lastRed":True},
  {"type":"end","sources":[
   "IRDAI, Recalibrating Economics of Insurance Distribution",
   "Public consultation paper, Parts 1 and 2, 23 Sep 2026",
   "MoatSCOREs: Moat Screener, 28 Sep 2026"]}]),
 "pb": ("PB FINTECH · 28 SEP 2026", [
  {"type":"cover","lines":["POLICYBAZAAR","AFTER","THE CAP"],"clip":"pb_third","stamp":"STILL A MOAT?"},
  {"type":"stat","heading":"GENERAL INSURANCE REVENUE","big":"33–40%","sub":"OF TODAY · MANAGEMENT'S OWN ESTIMATE",
   "body":"Life insurance stays 'in the same neighborhood'. Core revenue is roughly half general, half life."},
  {"type":"bars","heading":"CORE REVENUE · MANAGEMENT'S EXAMPLE","rows":[
    {"name":"TODAY","v":100,"label":"100"},
    {"name":"IF GENERAL INSURANCE IS CUT 60%","v":70,"label":"~70","red":True}],
   "body":"Before any recovery in volume. Management hopes to win back 15–20% through growth."},
  {"type":"list","heading":"WHAT HITS PB","items":["HEALTH RENEWALS CAPPED AT 5% FOR BROKERS","AGENTS GET HIGHER CAPS THAN BROKERS",
    "POSPS PAID OUT OF PB'S OWN CAP","NO LEADS FROM PRICE INFORMATION","INSURER-OWNED PLATFORMS PREFERRED"],"lastRed":True},
  {"type":"stat","heading":"Q1 FY27 · GOING IN","big":"₹999 CR","sub":"ANNUALISED RENEWAL REVENUE, UP 48%",
   "body":"The book that makes the model profitable over time, and the one the 5% renewal cap goes straight at."},
  {"type":"quote","heading":"MANAGEMENT · 24 SEP 2026","text":"“FY28 will be a year of challenges and discovery”",
   "who":"PB FINTECH ANALYST CALL","clip":"pb_fy28"},
  {"type":"moat","heading":"THE MOAT QUESTION","label":"FOCUS MOAT · D1 NETWORK EFFECTS","focus":"THE MARKETPLACE",
   "body":"With the price capped, the marketplace must prove itself in volume, not price.","score":"PB FINTECH 5.55"},
  {"type":"list","heading":"THE CASE THAT IT HOLDS","items":["IT IS A DRAFT: COMMENTS TILL 25 OCT","NO IMPACT ON FY27, SAYS MANAGEMENT",
    "MARKETING SPEND CAN BE CUT","ONLINE PERSISTENCY: 71% VS 48%"]},
  {"type":"end","sources":[
   "PB Fintech analyst call, 24 Sep 2026 (NSE)",
   "PB Fintech Q1 FY27 results; letter to exchanges, 27 Sep",
   "IRDAI consultation paper, 23 Sep 2026",
   "MoatSCORE: Moat Screener, 28 Sep 2026"]}]),
 # Angel One commodity-share article (7 Oct 2026). Every figure is in the article / video ledger.
 "angelone": ("ANGEL ONE · 6 OCT 2026", [
 {"type": "cover", "lines": ["ANGEL ONE", "COMMODITY SHARE", "41.7%"], "clip": "ao_q2", "stamp": "LOWEST SINCE JAN 2022"},
 {"type": "stat", "heading": "Q2 FY27 · ANGEL ONE'S OWN FILING", "was": "65.1% A YEAR AGO", "big": "44.0%", "sub": "COMMODITY MARKET SHARE · SEPTEMBER: 41.7%",
  "body": "Commodity turnover more than doubled (+105.5%) to ₹2,438 bn a day. The share still fell 21 points."},
 {"type": "bars", "heading": "THE MARKET TRIPLED · ₹ BN A DAY · OUR ARITHMETIC", "rows": [
   {"name": "IMPLIED MARKET, Q2 FY26", "v": 1823, "label": "1,823"},
   {"name": "IMPLIED MARKET, Q2 FY27", "v": 5541, "label": "5,541", "red": True}],
  "body": "Turnover ÷ share. The market grew ~3.0×; Angel One grew 2.05×. Most new trading went to other brokers."},
 {"type": "bars", "heading": "COMMODITY SHARE · FIVE YEARS OF FILINGS", "rows": [
   {"name": "SEP 2021", "v": 27.8, "label": "27.8%"}, {"name": "AUG 2025 · THE PEAK", "v": 67.6, "label": "67.6%"},
   {"name": "SEP 2025", "v": 64.3, "label": "64.3%"}, {"name": "SEP 2026", "v": 41.7, "label": "41.7%", "red": True}],
  "body": "Sep 2022–24: 53–62%. Two-thirds of the climb gone (our arithmetic)."},
 {"type": "list", "heading": "THE CORE HELD", "items": ["F&O SHARE: 21.7% → 22.1%", "CASH SHARE: 18.7% → 16.8%", "F&O ≈ 45% OF GROSS REVENUE", "COMMODITY ≈ 6% OF GROSS REVENUE"]},
 {"type": "list", "heading": "THE CASE IT DOESN'T MATTER", "items": ["COMMODITY TURNOVER STILL DOUBLED", "REVENUE SHARE ~3% → ~6% IN TWO YEARS", "SHARE OF TURNOVER, NOT OF PROFIT", "BUT: JUL 48.0% → AUG 43.7% → SEP 41.7%"], "lastRed": True},
 {"type": "list", "heading": "NOT IN THE FILINGS", "items": ["WHO GAINED THE SHARE", "WHY IT FELL", "WHAT A COMMODITY TRADE EARNS", "NO LISTED PEER DISCLOSES IT"], "lastRed": True},
 {"type": "moat", "heading": "THE MOAT QUESTION", "label": "FOCUS MOAT · SCALE IN RETAIL BROKING", "focus": "CORE HOLDING, EDGE SLIPPING",
  "body": "F&O share held at 22.1%. In commodities, other brokers are winning most of the new trading. Watch the October update in early November.",
  "score": "5.64 · AS PUBLISHED 7 OCT 2026"},
 {"type": "end", "sources": ["Angel One business updates, Sep 2021 – Sep 2026 (NSE)", "Angel One Q1 FY27 presentation, 15 Jul 2026",
   "Implied market and give-back: our arithmetic", "MoatSCORE: Moat Screener, 7 Oct 2026"]},
 ]),
 # DMart Q2 FY27 article (11 Oct 2026). Every figure is in the article / video ledger (scripts/ledger/dmartq2.csv).
 "dmartq2": ("DMART · 10 OCT 2026", [
 {"type": "cover", "lines": ["DMART Q2", "SALES +18.4%", "PROFIT +7.6%"], "clip": "dm_pr", "stamp": "WHERE DID THE MARGIN GO?"},
 {"type": "stat", "heading": "Q2 FY27 · STANDALONE · DMART'S OWN FILING", "was": "SALES +18.4%", "big": "+7.6%", "sub": "PROFIT AFTER TAX · ₹804 CRORE",
  "body": "Revenue ₹19,206 crore. EBITDA margin 7.3%, against 7.6% a year ago."},
 {"type": "bars", "heading": "GROSS MARGIN HELD · OUR ARITHMETIC", "rows": [
   {"name": "Q2 FY26", "v": 14.24, "label": "14.24%"}, {"name": "Q2 FY27", "v": 14.15, "label": "14.15%", "red": True}],
  "body": "No price war. Stores two years and older grew 9.5%, against 6.8% a year ago."},
 {"type": "list", "heading": "WHERE THE MARGIN WENT · POINTS OF REVENUE", "items": ["OTHER EXPENSES: 0.16", "GROSS MARGIN: 0.09", "WAGES: 0.02", "BELOW OPERATING PROFIT: 0.28"], "lastRed": True},
 {"type": "bars", "heading": "STORES ADDED EACH YEAR · OWN PRESENTATIONS", "rows": [
   {"name": "FY22", "v": 50, "label": "50"}, {"name": "FY23", "v": 40, "label": "40"}, {"name": "FY24", "v": 41, "label": "41"},
   {"name": "FY25", "v": 50, "label": "50"}, {"name": "FY26", "v": 85, "label": "85", "red": True}],
  "body": "518 stores now. Depreciation rose 26% and finance costs 87%."},
 {"type": "bars", "heading": "CURRENT BORROWINGS · ₹ CRORE · BALANCE SHEET", "rows": [
   {"name": "31 MAR 2026", "v": 965, "label": "965"}, {"name": "30 SEP 2026", "v": 2629, "label": "2,629", "red": True}],
  "body": "Still small: total debt, leases included, is 0.15 times equity on DMart's own chart."},
 {"type": "list", "heading": "THE CAUTIOUS READING", "items": ["PROFIT: UNDER HALF THE PACE OF SALES", "EBITDA MARGIN: 8.7% (FY23) → 7.8% (FY26)", "SALES PER SQ FT DIPPED IN FY26", "BORROWINGS NEARLY TRIPLED"], "lastRed": True},
 {"type": "moat", "heading": "THE MOAT QUESTION", "label": "FOCUS MOAT · COST ADVANTAGE", "focus": "MOAT HOLDING, MARGIN WEAKER",
  "body": "Customers are buying more at the same gross margin. The margin is paying for 85 stores a year. Watch the December quarter.",
  "score": "5.15 · AS PUBLISHED 11 OCT 2026"},
 {"type": "end", "sources": ["Avenue Supermarts press release and results, 10 Oct 2026 (NSE)", "Investor presentation, 10 Oct; Analyst Meet, 24 Jul 2026",
   "Cost shares and gross margin: our arithmetic", "MoatSCORE: Moat Screener, 11 Oct 2026"]},
 ]),
 # Den and GTPL cable article (14 Oct 2026): https://www.moatmarginresearch.com/cable-subscription-channel-cost-den-gtpl/
 # The figures are what the companies BOOK; the filings do not say what a home pays.
 "cablesub": ("DEN · GTPL · 13 OCT 2026", [
 {"type": "cover", "lines": ["DEN BOOKED ₹86 CR", "CHANNEL COST: ₹162 CR", "WHAT COVERS THE REST?"], "stamp": "JUL–SEP 2026 · FROM THE FILINGS"},
 {"type": "bars", "heading": "DEN NETWORKS · JUL–SEP 2026 · ₹ CRORE", "rows": [
   {"name": "CHANNEL (CONTENT) COST", "v": 162, "label": "162"},
   {"name": "PLACEMENT AND MARKETING INCOME", "v": 141, "label": "141"},
   {"name": "SUBSCRIPTION INCOME BOOKED", "v": 86, "label": "86", "red": True}],
  "body": "Group figures from Den's investor update, in whole crores. Unaudited, limited review."},
 {"type": "bars", "heading": "GTPL HATHWAY · JUL–SEP 2026 · ₹ CRORE", "rows": [
   {"name": "PAY CHANNEL COST", "v": 778.8, "label": "778.8"},
   {"name": "PLACEMENT, CARRIAGE AND MARKETING INCOME", "v": 620.3, "label": "620.3"},
   {"name": "CABLE SUBSCRIPTION BOOKED", "v": 345.5, "label": "345.5", "red": True}],
  "body": "Group figures from GTPL's results presentation, converted from ₹ million. Unaudited, limited review."},
 {"type": "bars", "heading": "SUBSCRIPTION BOOKED, AS A SHARE OF CHANNEL COST", "rows": [
   {"name": "DEN NETWORKS", "v": 53, "label": "53%"}, {"name": "GTPL HATHWAY", "v": 44, "label": "44%", "red": True}],
  "body": "Our arithmetic. A year earlier: 66% at Den and 49% at GTPL. These are amounts the companies book."},
 {"type": "list", "heading": "WHAT THE FILINGS DO NOT SAY", "items": [
   "WHAT A HOME PAYS", "WHAT THE LOCAL OPERATOR KEEPS", "WHY CHANNEL COST EXCEEDS BOOKED SUBSCRIPTION"], "lastRed": True},
 {"type": "list", "heading": "DEN NETWORKS · THE QUARTER", "items": [
   "CABLE SEGMENT: LOSS ₹8.0 CRORE", "BROADBAND SEGMENT: LOSS ₹0.7 CRORE", "OTHER INCOME: ₹60.7 CRORE", "PROFIT BEFORE TAX: ₹48.9 CRORE"]},
 {"type": "stat", "heading": "DEN · CASH AND EQUIVALENTS · ITS OWN SLIDE", "big": "₹3,417 CR", "sub": "IT REPORTS \"ZERO GROSS DEBT\"",
  "body": "Our reading: the interest it earns says nothing about how the cable business is doing."},
 {"type": "bars", "heading": "GTPL · CHANNEL COST AFTER FEES, % OF SUBSCRIPTION", "rows": [
   {"name": "JUL–SEP 2025", "v": 42.2, "label": "42.2%"}, {"name": "APR–JUN 2026", "v": 41.0, "label": "41.0%"}, {"name": "JUL–SEP 2026", "v": 45.9, "label": "45.9%", "red": True}],
  "body": "Our arithmetic. If scale gives bargaining power, this share should fall as GTPL grows. EBITDA: ₹110.3 crore, against ₹110.1 crore."},
 {"type": "list", "heading": "THE CASE AGAINST OUR READING", "items": [
   "FEES ARE PAYMENT FOR SERVICES, NOT A REFUND", "FEE INCOME IS GROWING: +9%, +27%", "GTPL'S OPERATING EBITDA: ₹103.3 CR VS ₹101.6 CR", "ONE QUARTER, TWO COMPANIES, NO PEER READ"]},
 {"type": "end", "sources": ["Den Networks: investor update and results, 13 Oct 2026 (NSE)", "GTPL Hathway: results and presentation, 13 Oct 2026 (NSE)",
   "Both annual reports, FY2025-26; TRAI regulations, 2017 and 2024", "Shares and ratios: our arithmetic"]},
 ]),
 # ICICI Lombard article (15 Oct 2026): https://www.moatmarginresearch.com/icici-lombard-underwriting-loss-float-profit/
 # Industry ratios are the company's own figures.
 "lombardq2": ("ICICI LOMBARD · 14 OCT 2026", [
 {"type": "cover", "lines": ["ICICI LOMBARD · JUL–SEP", "INSURANCE: −₹318 CR", "PROFIT: ₹946 CR"], "stamp": "HOW? THE FLOAT"},
 {"type": "bars", "heading": "JUL–SEP 2026 · AUDITED · ₹ CRORE", "rows": [
   {"name": "PREMIUM EARNED, NET OF REINSURANCE", "v": 6651.87, "label": "6,651.87"},
   {"name": "CLAIMS, COMMISSION AND COSTS", "v": 6970.25, "label": "6,970.25", "red": True}],
  "body": "The insurance alone lost ₹318.38 crore. Combined ratio 107.0%: above 100% means the insurance lost money."},
 {"type": "bars", "heading": "WHAT CARRIED THE PROFIT · JUL–SEP 2026 · ₹ CRORE", "rows": [
   {"name": "INVESTMENT INCOME, POLICYHOLDERS' FUNDS", "v": 1160.83, "label": "1,160.83"},
   {"name": "INVESTMENT INCOME, SHAREHOLDERS' FUNDS", "v": 407.36, "label": "407.36"},
   {"name": "UNDERWRITING LOSS", "v": 318.38, "label": "318.38", "red": True}],
  "body": "Profit after tax: ₹946.40 crore. Capital gains in the quarter: ₹453 crore."},
 {"type": "list", "heading": "WHAT IS FLOAT?", "items": [
   "PREMIUM COMES IN BEFORE CLAIMS ARE PAID", "THE INSURER INVESTS IT MEANWHILE", "₹47,379 CR HELD AGAINST POLICYHOLDERS' FUNDS", "ITS COST: THE UNDERWRITING LOSS"], "lastRed": True},
 {"type": "bars", "heading": "COMBINED RATIO · FY2026 · AS THE COMPANY GIVES IT", "rows": [
   {"name": "INDUSTRY", "v": 117.8, "label": "117.8%", "red": True}, {"name": "ICICI LOMBARD", "v": 103.4, "label": "103.4%"}],
  "body": "Above 100% means the insurance lost money. On the company's ten-year chart, the industry was above 100% every year, FY17 to FY26."},
 {"type": "stat", "heading": "JUL–SEP 2026 · TWO PROFIT FIGURES", "was": "N BASIS: ₹1,031 CR, +27.5%", "big": "₹946 CR", "sub": "AUDITED · IRDAI'S 1/N BASIS · +15.5%",
  "body": "1/n spreads the premium on a multi-year policy over its years of cover. \"n basis\" is the company's own term."},
 {"type": "list", "heading": "HALF YEAR · APR–SEP 2026", "items": [
   "1/N BASIS: ₹1,350 CR, DOWN 13.9%", "N BASIS: ₹1,454 CR, DOWN 5.8%", "APR–JUN, PER THE COMPANY: FIRES ₹63 CR, RESERVE ₹165 CR"]},
 {"type": "list", "heading": "WHERE OUR READING COULD BREAK", "items": [
   "CAPITAL GAINS ARE LUMPY: ₹453 CR THIS QUARTER", "CLAIMS INCLUDE ESTIMATES (RESERVES)", "FLOAT INCOME DEPENDS ON MARKETS AND TIMING", "ONE COMPANY; INDUSTRY FIGURES ARE ITS OWN"]},
 {"type": "list", "heading": "WHAT TO TRACK IN THE FILINGS", "items": [
   "COMBINED RATIO AGAINST THE INDUSTRY'S", "INVESTMENT INCOME WITHOUT CAPITAL GAINS", "BOTH PROFIT FIGURES, AND THE GAP"]},
 {"type": "end", "sources": ["ICICI Lombard: results and presentation, 14 Oct 2026 (NSE)", "ICICI Lombard: earnings calls, Jul 2026 and Jan 2025 (NSE)",
   "IRDAI master circular, 17 May 2024", "Ratios and multiples: our arithmetic"]},
 ]),
}


def main():
    ids = list(CAROUSELS) if sys.argv[1:] == ["--all"] else sys.argv[1:]
    unknown = [i for i in ids if i not in CAROUSELS]
    if not ids or unknown:
        sys.exit((f"no carousel {unknown}\n" if unknown else "") + "usage: carousels.py <id> [<id> ...]   ids: " + " ".join(CAROUSELS))
    for cid in ids:
        kicker, slides = CAROUSELS[cid]
        used = {s["clip"] for s in slides if s.get("clip")}
        clips = {k: v for k, v in mm.vx(cid)["clips"].items() if k in used} if used else {}
        if used - set(clips): sys.exit(f"{cid}: clips not in public/vx/{cid}/data.json: {sorted(used - set(clips))}")
        out = mm.PUBLIC / "carousel" / cid; out.mkdir(parents=True, exist_ok=True)
        json.dump({"id": cid, "vid": cid, "kicker": kicker, "slides": slides, "clips": clips}, open(out / "carousel.json", "w"), indent=1, ensure_ascii=False)
        print(cid, len(slides), "slides", sorted(used))


if __name__ == "__main__":
    main()

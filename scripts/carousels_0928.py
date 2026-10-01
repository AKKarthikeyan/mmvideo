"""Carousel specs for the 28 Sep theme articles (MDR, IRDAI, PB). Every figure is from the published article."""
import json, pathlib
ROOT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public")
DISC_SRC = {
 "mdr": ["NPCI, FAQs on MDR on select UPI (P2M) payments, 15 Sep 2026",
         "Paytm: NPCI disclosure 15 Sep; Q1 FY27 release, 20 Jul 2026",
         "Pine Labs press release, 24 Sep 2026",
         "MoatSCOREs: Moat Screener, 28 Sep 2026"],
 "irdai": ["IRDAI, Recalibrating Economics of Insurance Distribution",
           "Public consultation paper, Parts 1 and 2, 23 Sep 2026",
           "MoatSCOREs: Moat Screener, 28 Sep 2026"],
 "pb": ["PB Fintech analyst call, 24 Sep 2026 (NSE)",
        "PB Fintech Q1 FY27 results; letter to exchanges, 27 Sep",
        "IRDAI consultation paper, 23 Sep 2026",
        "MoatSCORE: Moat Screener, 28 Sep 2026"],
}
SPECS = {
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
  {"type":"end"}]),
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
  {"type":"end"}]),
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
  {"type":"end"}]),
}
for cid, (kicker, slides) in SPECS.items():
    vx = json.load(open(ROOT / "vx" / cid / "data.json"))
    used = {s["clip"] for s in slides if s.get("clip")}
    clips = {k: vx["clips"][k] for k in used}
    for s in slides:
        if s["type"] == "end": s["sources"] = DISC_SRC[cid]
    out = ROOT / "carousel" / cid; out.mkdir(parents=True, exist_ok=True)
    json.dump({"id": cid, "vid": cid, "kicker": kicker, "slides": slides, "clips": clips}, open(out / "carousel.json", "w"), ensure_ascii=False, indent=1)
    print(cid, len(slides), "slides", sorted(used))

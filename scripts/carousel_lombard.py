"""Instagram carousel for the ICICI Lombard article (15 Oct 2026):
https://www.moatmarginresearch.com/icici-lombard-underwriting-loss-float-profit/
Every figure is in the published article. Industry ratios are the company's own figures."""
import json, pathlib
ROOT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public")
slides = [
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
]
out = {"id": "lombardq2", "vid": "lombardq2", "kicker": "ICICI LOMBARD · 14 OCT 2026", "slides": slides, "clips": {}}
(ROOT / "carousel/lombardq2").mkdir(parents=True, exist_ok=True)
json.dump(out, open(ROOT / "carousel/lombardq2/carousel.json", "w"), indent=1, ensure_ascii=False)
print("slides", len(slides))

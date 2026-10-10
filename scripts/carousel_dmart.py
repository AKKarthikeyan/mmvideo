"""Instagram carousel for the DMart Q2 FY27 article (11 Oct 2026). Every figure is in the article / video ledger (scripts/ledger/dmartq2.csv)."""
import json, pathlib
ROOT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public")
data = json.load(open(ROOT / "vx/dmartq2/data.json"))
slides = [
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
]
need = {s["clip"] for s in slides if s.get("clip")}
out = {"id": "dmartq2", "vid": "dmartq2", "kicker": "DMART · 10 OCT 2026", "slides": slides,
       "clips": {k: v for k, v in data["clips"].items() if k in need}}
(ROOT / "carousel/dmartq2").mkdir(parents=True, exist_ok=True)
json.dump(out, open(ROOT / "carousel/dmartq2/carousel.json", "w"), indent=1, ensure_ascii=False)
print("slides", len(slides), "clips", list(out["clips"]))

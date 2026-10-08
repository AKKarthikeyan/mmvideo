"""Instagram carousel for the Angel One commodity-share article (7 Oct 2026). Every figure is in the article / video ledger."""
import json, pathlib
ROOT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public")
data = json.load(open(ROOT / "vx/angelone/data.json"))
slides = [
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
]
need = {s["clip"] for s in slides if s.get("clip")}
out = {"id": "angelone", "vid": "angelone", "kicker": "ANGEL ONE · 6 OCT 2026", "slides": slides,
       "clips": {k: v for k, v in data["clips"].items() if k in need}}
json.dump(out, open(ROOT / "carousel/angelone/carousel.json", "w"), indent=1, ensure_ascii=False)
print("slides", len(slides), "clips", list(out["clips"]))

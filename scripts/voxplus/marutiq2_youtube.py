# marutiq2 .youtube.txt: title, description, chapters (from the real timing), sources, disclaimer. Chapters start at each chapter card (0.85 s before the
# chapter's first beat). Usage: python3 marutiq2_youtube.py OUT.txt   (pattern of kotakq2_youtube.py)
import json, re, sys
ts = open("/Volumes/DarwinSSD/MMVideo/src/voxplus/MarutiTiming.ts").read()
B = json.loads(re.search(r"export const BEAT[^=]*= (.*);", ts).group(1))
fm = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
ch = [(0, "A record quarter, and less profit"), (B["r01"] - 0.85, "How strong was the demand?"), (B["m01"] - 0.85, "What does it cost to make a vehicle? (₹100 of sales)"),
      (B["p01"] - 0.85, "One vehicle: what it got, what it cost"), (B["w01"] - 0.85, "The reasons the company gives"), (B["i01"] - 0.85, "The second hole: other income"),
      (B["b01"] - 0.85, "But... where our own reading can break"), (B["e01"] - 0.7, "Back to the number")]
txt = f"""TITLE
Maruti Sold 696,654 Vehicles. Why Did Its Profit Fall?

ALTERNATE TITLES
Maruti's Record Quarter, and a Thinner Profit
Record Sales, Lower Profit: Maruti's September Quarter

DESCRIPTION
In July to September 2026 Maruti Suzuki India sold 696,654 vehicles, the highest quarterly volume in its own words, and net sales rose 26.1%. Yet operating EBITDA fell 6.3% and profit after tax fell 26.9%. This video reads the company's four filings of 27 October 2026 (the results statement, the investor presentation, the press release and a board letter) to ask where the extra money went.

What the video covers: material cost as a share of sales (79.9% against 75.7%, shown as coins out of every ₹100 of sales), the other cost lines, the same numbers per vehicle, the reasons the company itself lists on slide 7 of its investor deck (adverse commodity prices in the context of West Asia conflict, adverse foreign exchange movement, lower non-operating income from mark-to-market losses on invested surplus, set against improved realization, operating leverage and cost reduction), and the second hole: about half of the fall in profit before tax sits in other income net of interest. Then what the filings do not say: no size for any item on the company's list, no commodity named, no rupee size for the mark-to-market loss, no rival numbers, and no amount yet for the end-of-life vehicle rules.

How to read the numbers:
- "Our arithmetic" and "our conversion" mean we worked the number out ourselves from the company's figures (for example material cost rebuilt from the results statement, per-vehicle averages, the ₹2,100 crore illustration, the 49% share of the fall); they are not company figures. The company reports in ₹ million; 10 million = 1 crore.
- The per-vehicle figures are net sales (or material cost) divided by all vehicles sold, exports and sales to other carmakers included, with no split for spare parts. They are averages, not the price of any model.
- The 40.8% domestic market share is the press release's own wording; the release names no base period or market definition beyond its passage on the domestic passenger vehicle market.
- The press release gives different growth figures for SUVs (68.2%) and small cars (35.9%) than the investor deck's segment table (utility vehicles +52.3%, passenger cars +31.9% in units), which is the table this video uses.
- The causes shown are the company's own list, quoted and attributed. We do not say what caused the fall. All figures are Maruti Suzuki India standalone; last year's quarter is restated for the Suzuki Motor Gujarat merger.

Read the article: https://www.moatmarginresearch.com/maruti-q2-material-cost-margin/

CHAPTERS
""" + "\n".join(f"{fm(t)} {n}" for t, n in ch) + """

SOURCES
Maruti Suzuki India, investor presentation, Q2 and H1 FY27 standalone results, 27 October 2026: https://nsearchives.nseindia.com/corporate/MARUTI_27102026154352_STxIntimation_InvestorPresentation_27Oct2026.pdf
Maruti Suzuki India, press release on Q2 and H1 FY27 results, 27 October 2026: https://nsearchives.nseindia.com/corporate/MARUTI_27102026153704_STxIntimation_PR_27Oct2026.pdf
Maruti Suzuki India, standalone and consolidated results with notes and auditors' limited review reports, 27 October 2026: https://nsearchives.nseindia.com/corporate/MARUTI_27102026152412_QuickResults_27Oct2026_signed.pdf
Pages are shown on screen with each figure; the results PDF is a scan and its figures were read from the page images.

MOATSCORE
[AK to fill: read live from the Moat Screener, https://www.moatmarginresearch.com/moat-screener/]

DISCLAIMER
Educational research, not investment advice. No buy, sell or hold recommendation, no price target, no share prices. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. Do your own research.

HOLDINGS
[AK to fill]

CREDITS
Narration: MiniMax speech-2.6-hd (synthetic voice); set "Altered or synthetic content: Yes". Music: "Curious Ambience" by Reg1n0ld and "Strings with Percussion" by buythefield (CC0). Sound effects: CC0 (Freesound). All graphics drawn in code; icons are illustrations.

TAGS
Maruti Suzuki, Maruti Suzuki results, material cost, operating margin, EBITDA, Q2 FY27, auto sector, moat, Moat and Margin
"""
open(sys.argv[1], "w").write(txt); print(txt[txt.index("CHAPTERS"):txt.index("SOURCES")])

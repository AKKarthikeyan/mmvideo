# tatamotorsq2 .youtube.txt: title, description, chapters (from the real timing), sources, disclaimer. Chapters start at each
# chapter card (0.85 s before the chapter's first beat). Usage: python3 tatamotorsq2_youtube.py OUT.txt   (copy of swiggyq2_youtube.py, 24 Oct 2026)
import json, re, sys
ts = open("/Volumes/DarwinSSD/MMVideo/src/voxplus/TataMotorsTiming.ts").read()
B = json.loads(re.search(r"export const BEAT[^=]*= (.*);", ts).group(1))
fm = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
ch = [(0, "Why raise the offer by 30 cents?"), (B["w01"] - 0.85, "Which Tata Motors?"), (B["v01"] - 0.85, "Where the trucks went"),
      (B["m01"] - 0.85, "Why it kept less"), (B["k01"] - 0.85, "The cash"), (B["i01"] - 0.85, "The Iveco offer"),
      (B["b01"] - 0.85, "But... what the filings do not say"), (B["e01"] - 0.7, "Back to €14.40")]
txt = f"""TITLE
Why Tata Motors Raised Its Iveco Offer by 30 Cents

ALTERNATE TITLES
Tata Motors: 42% More Trucks, a Thinner Margin
₹42,561 Crore for Iveco: What Tata Motors' Filings Say

DESCRIPTION
On 9 October 2026 Tata Motors, the commercial-vehicle company formerly called TML Commercial Vehicles, raised its tender offer for Iveco Group from €14.10 to €14.40 a share. Its own slide gives the reason: "the slight delay in the completion of the Offer". Its results put the revised maximum offer value at about ₹42,561 crore (€3.91 billion).

The same results show the truck and bus business in the September 2026 quarter: 42% more vehicles wholesaled, revenue up 42% to ₹23,930 crore, but EBITDA (a measure the company defines itself) up only 31%, so it kept ₹11.70 of every ₹100 of sales against ₹12.60 a year earlier. The chief financial officer cites commodity cost pressures, "particularly in steel and rubber"; the filings put no number on them. Free cash flow (the company's own definition) was ₹4,606 crore, of which ₹2,679 crore came from working capital, 58% by our arithmetic.

What the filings do not say: how the Iveco offer will be paid for, what acceptance level the offer needs, or what Iveco will do to the margin or the debt. As of 22 October, 35% of shares had been tendered; the acceptance period is due to close on 26 October and settlement is scheduled for 30 October, subject to the offer conditions being met.

Standalone figures include the joint operation with Tata Cummins, as the company reports them. Every figure is from Tata Motors' filings of 23 October 2026; derived figures are labelled as our arithmetic. Statements about the coming quarter are the company's expectations, not ours.

Read the article: https://www.moatmarginresearch.com/tata-motors-q2-trucks-margin-iveco/

CHAPTERS
""" + "\n".join(f"{fm(t)} {n}" for t, n in ch) + """

SOURCES (NSE filings)
Tata Motors Limited (formerly TML Commercial Vehicles Limited), outcome of board meeting: audited standalone and unaudited consolidated results for the quarter and half year ended 30 September 2026, with press release, 23 October 2026: https://nsearchives.nseindia.com/corporate/TMLCOMMERCIAL_23102026154330_NSEBSELETTER.pdf
Tata Motors Limited, investor presentation, Q2 FY27, 23 October 2026: https://nsearchives.nseindia.com/corporate/TMLCOMMERCIAL_23102026171720_IR.pdf
Pages are shown on screen with each figure.

DISCLAIMER
Educational research, not investment advice. No buy, sell or hold recommendation, no price target, no share prices. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. Do your own research.

HOLDINGS
[AK to fill]

CREDITS
Narration: MiniMax speech-2.6-hd (synthetic voice). Music: "Curious Ambience" by Reg1n0ld and "Strings with Percussion" by buythefield (CC0). Sound effects: CC0 (Freesound). Icons, blocks, the torn sheet and the seesaw are illustrations. All graphics drawn in code by Moat & Margin; document excerpts are from the filings above.

TAGS
Tata Motors, Iveco, commercial vehicles, trucks, EBITDA margin, steel prices, free cash flow, working capital, tender offer, Q2 FY27, moat, Moat and Margin
"""
open(sys.argv[1], "w").write(txt); print(txt[txt.index("CHAPTERS"):txt.index("SOURCES")])

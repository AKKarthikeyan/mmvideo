# eternalq2 .youtube.txt: title, description, chapters (from the real timing), sources, disclaimer. Chapters start at each
# chapter card (0.85 s before the chapter's first beat). Usage: python3 eternalq2_youtube.py OUT.txt
import json, re, sys
ts = open("/Volumes/DarwinSSD/MMVideo/src/voxplus/EternalTiming.ts").read()
B = json.loads(re.search(r"export const BEAT[^=]*= (.*);", ts).group(1))
fm = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
ch = [(0, "Why does ninety paise matter?"), (B["p01"] - 0.85, "Where does the money come from?"), (B["q01"] - 0.85, "Why ninety paise matters"),
      (B["a01"] - 0.85, "Can a computer shop around Blinkit?"), (B["b01"] - 0.85, "But... the company's own argument"), (B["e01"] - 0.7, "Back to ninety paise")]
txt = f"""TITLE
Why Does 90 Paise Matter to Blinkit?

ALTERNATE TITLES
Can an AI Agent Skip Blinkit? Eternal Says No
90 Paise in ₹100: Eternal's Answer to AI Shoppers

DESCRIPTION
In the September 2026 quarter, Eternal's quick-commerce app Blinkit made ₹184 crore on the company's own adjusted EBITDA measure, on ₹20,940 crore of order value after discounts: about 0.9%, or roughly 90 paise in every ₹100 (184 ÷ 20,940 = 0.88%, which the company rounds to 0.9%). A year earlier, on the same measure, it lost ₹156 crore.

Then the strange part: the longest answer in Eternal's shareholder letter is about AI agents that shop for you. We read the letter and the results to ask one question: when a computer can do your shopping, what part of Blinkit can it not skip?

Adjusted EBITDA and adjusted revenue are Eternal's own (non-GAAP) measures. Every figure is from Eternal's filings of 21 October 2026; derived figures are labelled as our arithmetic. The letter's arguments about AI agents are the company's view, not ours, and the letter itself flags an incumbent's bias.

Read the article: https://www.moatmarginresearch.com/eternal-q2-blinkit-margin-agents/ (goes live with the article)

CHAPTERS
""" + "\n".join(f"{fm(t)} {n}" for t, n in ch) + """

SOURCES (NSE filings, 21 October 2026)
Eternal, shareholders' letter, Q2 FY27: https://nsearchives.nseindia.com/corporate/ZOMATO_21102026152512_SHLsigned.pdf
Eternal, outcome of board meeting with unaudited standalone and consolidated results for the quarter ended 30 September 2026: https://nsearchives.nseindia.com/corporate/ZOMATO_21102026153325_OutcomeSIGNED.pdf
Pages are shown on screen with each figure.

DISCLAIMER
Educational research, not investment advice. No buy, sell or hold recommendation, no price target, no share prices. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. Do your own research.

HOLDINGS
[AK to fill]

CREDITS
Narration: MiniMax speech-2.6-hd (synthetic voice). Music: "Curious Ambience" by Reg1n0ld and "Strings with Percussion" by buythefield (CC0). Sound effects: CC0 (Freesound). Map: Natural Earth (public domain), India point of view; dots are illustrations, not store locations. All other graphics drawn in code by Moat & Margin.

TAGS
Eternal, Zomato, Blinkit, quick commerce, food delivery, AI agents, agentic commerce, dark stores, adjusted EBITDA, Q2 FY27, moat, Moat and Margin
"""
open(sys.argv[1], "w").write(txt); print(txt[txt.index("CHAPTERS"):txt.index("SOURCES")])

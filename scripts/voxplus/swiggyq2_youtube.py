# swiggyq2 .youtube.txt: title, description, chapters (from the real timing), sources, disclaimer. Chapters start at each
# chapter card (0.85 s before the chapter's first beat). Usage: python3 swiggyq2_youtube.py OUT.txt   (copy of eternalq2_youtube.py)
import json, re, sys
ts = open("/Volumes/DarwinSSD/MMVideo/src/voxplus/SwiggyTiming.ts").read()
B = json.loads(re.search(r"export const BEAT[^=]*= (.*);", ts).group(1))
fm = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
ch = [(0, "What does a nine rupee store cost?"), (B["f01"] - 0.85, "The part with a profit"), (B["q01"] - 0.85, "What did the loss buy?"),
      (B["k01"] - 0.85, "What does break-even take?"), (B["b01"] - 0.85, "But... the company's own forecast"), (B["e01"] - 0.7, "Back to the nine rupee store")]
txt = f"""TITLE
What Does Swiggy's Nine Rupee Store Cost?

ALTERNATE TITLES
On Swiggy's Own Measure: Food +₹341 Cr, Instamart –₹895 Cr
₹30 an Order: What Instamart Says It Needs to Break Even

DESCRIPTION
Swiggy's shareholder letter for the September 2026 quarter names an "INR 9 Store" among the price offers it ran on Instamart, its quick-delivery app. The letter gives no price for it. It does give the loss: on the company's own adjusted EBITDA measure, Instamart lost ₹895 crore in the quarter, up from ₹778 crore in the quarter before, while Swiggy's food delivery made a record ₹341 crore on the same measure.

We read the letter and the results to ask one question: what is that loss buying, and what does Swiggy say it needs before the losses stop? The letter's own answer: faster growth, more users and busier stores now, and for break-even on its measure about 2.3 times today's scale and ₹30 of contribution per order. By our arithmetic, at the quarter's average order of ₹708 and a contribution margin of –1.0% of gross order value, each order was about ₹7 short.

Adjusted EBITDA is the company's own (non-GAAP) measure. Every figure is from Swiggy's filings of 22 October 2026 (and, for one line on Blinkit, Eternal's shareholder letter of 21 October 2026); derived figures are labelled as our arithmetic. The break-even path, the December-quarter range and the inventory benefit are the company's expectations, not ours. On the standard (Ind AS) accounts, the Swiggy group lost ₹922 crore in the quarter (unaudited).

Read the article: https://www.moatmarginresearch.com/swiggy-q2-instamart-loss-food-margin/
Related: our Eternal (Blinkit) article: https://www.moatmarginresearch.com/eternal-q2-blinkit-margin-agents/

CHAPTERS
""" + "\n".join(f"{fm(t)} {n}" for t, n in ch) + """

SOURCES (NSE filings)
Swiggy, shareholders' letter, Q2 FY27, 22 October 2026: https://nsearchives.nseindia.com/corporate/SWIGGY_22102026155201_Covering_Letter_Letter_to_Shareholders_Signed.pdf
Swiggy, unaudited standalone and consolidated results for the quarter and half year ended 30 September 2026, 22 October 2026: https://nsearchives.nseindia.com/corporate/SWIGGY_22102026154451_SE_intimation_Financials_Signed.pdf
Swiggy, press release, 22 October 2026: https://nsearchives.nseindia.com/corporate/SWIGGY_22102026155420_Covering_Letter_Press_Release_Signed.pdf
Eternal, shareholders' letter, Q2 FY27, 21 October 2026 (Blinkit figures only): https://nsearchives.nseindia.com/corporate/ZOMATO_21102026152512_SHLsigned.pdf
Pages are shown on screen with each figure.

DISCLAIMER
Educational research, not investment advice. No buy, sell or hold recommendation, no price target, no share prices. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. Do your own research.

HOLDINGS
[AK to fill]

CREDITS
Narration: MiniMax speech-2.6-hd (synthetic voice). Music: "Curious Ambience" by Reg1n0ld and "Strings with Percussion" by buythefield (CC0). Sound effects: CC0 (Freesound). Street grid, dots and cursors are illustrations. All graphics drawn in code by Moat & Margin; document excerpts are from the filings above.

TAGS
Swiggy, Instamart, quick commerce, food delivery, dark stores, adjusted EBITDA, contribution margin, Toing, Q2 FY27, moat, Moat and Margin
"""
open(sys.argv[1], "w").write(txt); print(txt[txt.index("CHAPTERS"):txt.index("SOURCES")])

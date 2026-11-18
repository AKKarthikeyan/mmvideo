# a02gates .youtube.txt (pattern of asianpaintsq2_youtube.py). Chapters from the real timing. Usage: python3 a02gates_youtube.py OUT.txt
import json, re, sys
ts = open("/Volumes/DarwinSSD/MMVideo/src/voxplus/A02Timing.ts").read()
B = json.loads(re.search(r"export const BEAT[^=]*= (.*);", ts).group(1))
fm = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
ch = [(0, "Why hand savings back? The castle with 5 gates"), (B["b04"] - 0.85, "Gate 1: Can a brand be a moat? (Marico)"), (B["b09"] - 0.85, "Gate 2: Can a low price be a moat? (DMart)"),
      (B["b11"] - 0.85, "Gate 3: Can a lock be a moat? (TCS)"), (B["b15"] - 0.85, "Gate 4: Can a crowd be a moat? (IEX)"), (B["b19"] - 0.85, "Gate 5: Can a licence be a moat? (CDSL)"),
      (B["b23"] - 0.85, "Who holds the hinge?"), (B["b28"] - 0.85, "The verdict: are all five holding?")]
txt = f"""TITLE
How Do 5 Indian Companies Keep Rivals Out?

ALTERNATE TITLES
5 Kinds of Moat, With One Indian Example Each
A Castle With 5 Gates: How Companies Keep Rivals Out

DESCRIPTION
What is a moat, and what does it look like in India? This video walks through one castle with five gates, one Indian company at each gate: Marico (a brand people trust), DMart (a thin profit and the lowest everyday price), TCS (a lock that makes leaving hard), IEX (a crowd that rivals cannot copy overnight) and CDSL (a licence). Every gate also hangs on a hinge, the one weak spot that could swing it open. Two of the five hinges are held by a regulator. Which two? Watch to the end.

Experts count the kinds of moat differently; five gates is our simple teaching cut, not a full list. Everything is read from our published articles, which are built from company filings (links below); the dates are shown on screen.

Questions this video answers:
""" + "\n".join(f"{fm(t)} {n}" for t, n in ch) + """

How to read the numbers:
- "Our article" means a Moat & Margin article built from the company's filings; "our reading" and "our arithmetic" mean our own interpretation or calculation, not a company statement.
- Marico: Parachute Rigids volume +10% and revenue +23% (investor presentation of 4 August 2026, p.34), with price growth moderating. DMart: about Rs 4 of profit after tax from every Rs 100 sold in the September quarter of 2026 is our arithmetic (804 / 19,206). TCS: the Best Buy deal (about 450 people, Rs 1 lakh) is the figure in our TCS article, which cites TCS's 1 October 2026 notice and 8 October press release. IEX: an 80 to 85% market share (analyst meet, 24 July 2026), "They had 17 years to replicate this" (FY26 earnings call, p.12). CDSL: KYC fees cut from Rs 20 to Rs 5 and from Rs 35 to Rs 28 (our article of 9 August 2026).
- IEX gate: the electricity regulator's draft rules (April 2026) were not final as of 5 October 2026 (the date of our last check); this may have changed since.
- The made-up examples (biscuit packet, salary account, vegetable markets, bus permits) are labelled on screen as made up.
- The verdict is about whether each business's moat is holding in our articles from July to October 2026. It is not about any share price.

Sources (our articles, each built from company filings):
Why Moat?: https://www.moatmarginresearch.com/why-moat/
Marico: https://www.moatmarginresearch.com/marico-pricing-power/
DMart Q2: https://www.moatmarginresearch.com/dmart-q2-fy27-moat-margin/
TCS Q2: https://www.moatmarginresearch.com/tcs-q2-fy27-moat-margin/
Wide-moat stocks in India: https://www.moatmarginresearch.com/wide-moat-stocks-india/
IEX: https://www.moatmarginresearch.com/iex-moat/
The Market That Became Too Successful: https://www.moatmarginresearch.com/the-market-that-became-too-successful/

MOATSCORE
[AK to fill: read live from the Moat Screener, https://www.moatmarginresearch.com/moat-screener/ ; or leave out]

DISCLAIMER
Educational research, not investment advice. No buy, sell or hold recommendation, no price target, no share prices. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. Do your own research.

HOLDINGS
[AK to fill]

CREDITS
Narration: MiniMax speech-2.6-hd (synthetic voice); set "Altered or synthetic content: Yes". Audio tracks: Hindi by Google Gemini TTS (synthetic voice); Tamil and Telugu by Maya2 from Maya Research (Apache-2.0), using the Kyutai Mimi audio codec (CC-BY-4.0) (synthetic voice). Music: "Curious Ambience" by Reg1n0ld and "Strings with Percussion" by buythefield (CC0). Sound effects: CC0 (Freesound). All graphics drawn in code; no company logos or photos are used.

TAGS
moat, economic moat, types of moat, moat examples India, Marico, DMart, TCS, IEX, CDSL, competitive advantage, how companies stop competition, Moat and Margin
"""
open(sys.argv[1], "w").write(txt); print(txt[txt.index("Questions"):txt.index("How to read")])

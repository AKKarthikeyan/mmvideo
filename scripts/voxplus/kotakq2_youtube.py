# kotakq2 .youtube.txt: title, description, chapters (from the real timing), sources, disclaimer. Chapters start at each chapter card (0.85 s before the
# chapter's first beat). Usage: python3 kotakq2_youtube.py OUT.txt   (pattern of tatamotorsq2_youtube.py)
import json, re, sys
ts = open("/Volumes/DarwinSSD/MMVideo/src/voxplus/KotakTiming.ts").read()
B = json.loads(re.search(r"export const BEAT[^=]*= (.*);", ts).group(1))
fm = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
ch = [(0, "A deposit slip and a falling margin"), (B["f01"] - 0.85, "The foreign money (FCNR deposits)"), (B["s01"] - 0.85, "Where did it go?"), (B["m01"] - 0.85, "The margin"),
      (B["k01"] - 0.85, "The cheap-money advantage (CASA)"), (B["p01"] - 0.85, "Why profit still rose"), (B["n01"] - 0.85, "One more thing: the new chief executive"),
      (B["b01"] - 0.85, "But... what the filings do not say"), (B["e01"] - 0.7, "Back to the slip")]
txt = f"""TITLE
Kotak Took In ₹55,344 Crore. Why Did Its Margin Fall?

ALTERNATE TITLES
Kotak's Margin Fell as ₹55,344 Crore Came In
A Bank, Foreign Deposits and a Thinner Margin

DESCRIPTION
In the September 2026 quarter Kotak Mahindra Bank took in about ₹55,344 crore of FCNR(B) deposits (fixed-term deposits in a foreign currency). Its own release says the fall in its net interest margin, to 4.31% from 4.54% a year earlier, was "largely on account of" them. Yet standalone profit rose 29% to ₹4,212 crore.

This video reads the bank's filings of 24 October 2026: how big the foreign deposits are, what the bank's own adjusted figures say (deposit growth 13% instead of 23%, net advances growth 19% instead of 25%, CASA ratio 41.8% instead of 38.2%), where the money sits on the balance sheet, why profit still rose, and what the filings do not say: what the deposits cost, how long they run, the terms of the RBI swap facility, the margin without them, or any outlook.

The 13%, 19% and 41.8% are the bank's own adjusted figures. Lines marked "our arithmetic" (for example 8.5% of deposits, cash balances up 81%, +19.4% if both pieces are taken off, 41.8% re-derived from 249,105 / 596,147, fees about 15% without the ₹158 crore of processing fees) are ours. The FCNR(B) definition is a plain definition from the Reserve Bank's own FAQ (as on 16 January 2025), not from the bank's filings. All figures are Kotak Mahindra Bank standalone.

Read the article: https://www.moatmarginresearch.com/kotak-q2-fcnr-margin/

CHAPTERS
""" + "\n".join(f"{fm(t)} {n}" for t, n in ch) + """

SOURCES
Kotak Mahindra Bank, media release on Q2 FY27 results, 24 October 2026: https://nsearchives.nseindia.com/corporate/KMBLTAB_24102026132632_MediareleaseBMOct242026SIGNED.pdf
Kotak Mahindra Bank, investor presentation Q2 FY27, 24 October 2026: https://nsearchives.nseindia.com/corporate/KMBLTAB_24102026133347_InvestorPresentationOct242026SIGNED.pdf
Kotak Mahindra Bank, appointment of MD & CEO, 24 October 2026: https://nsearchives.nseindia.com/corporate/KMBLTAB_24102026154235_OutcomeofBM24102026MDIDSIGNED.pdf
Reserve Bank of India, FAQ "Accounts in India by Non-residents" (as on 16 January 2025), for the FCNR(B) definition: https://www.rbi.org.in/commonman/Upload/English/FAQs/PDFs/Accountresidents16012025.pdf
Pages are shown on screen with each figure.

MOATSCORE
[AK to fill: read live from the Moat Screener, https://www.moatmarginresearch.com/moat-screener/]

DISCLAIMER
Educational research, not investment advice. No buy, sell or hold recommendation, no price target, no share prices. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. Do your own research.

HOLDINGS
[AK to fill]

CREDITS
Narration: MiniMax speech-2.6-hd (synthetic voice); set "Altered or synthetic content: Yes". Music: "Curious Ambience" by Reg1n0ld and "Strings with Percussion" by buythefield (CC0). Sound effects: CC0 (Freesound). All graphics drawn in code; icons are illustrations.

TAGS
Kotak Mahindra Bank, FCNR deposits, net interest margin, NIM, CASA ratio, bank results, Q2 FY27, moat, Moat and Margin
"""
open(sys.argv[1], "w").write(txt); print(txt[txt.index("CHAPTERS"):txt.index("SOURCES")])

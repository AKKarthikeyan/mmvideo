# asianpaintsq2 .youtube.txt: title, description, chapters (from the real timing), sources, disclaimer. Chapters start at each chapter card (0.85 s before
# the chapter's first beat). Usage: python3 asianpaintsq2_youtube.py OUT.txt   (pattern of marutiq2_youtube.py). Figures: script.md ledger rows 1-34.
import json, re, sys
ts = open("/Volumes/DarwinSSD/MMVideo/src/voxplus/AsianPaintsTiming.ts").read()
B = json.loads(re.search(r"export const BEAT[^=]*= (.*);", ts).group(1))
fm = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
ch = [(0, "Sold more, thinner margin: how?"), (B["v01"] - 0.85, "The buyers"), (B["m01"] - 0.85, "A hundred rupees of sales"),
      (B["p01"] - 0.85, "The price"), (B["o01"] - 0.85, "The rest of the bill"), (B["b01"] - 0.85, "But... what the filings do not say"),
      (B["e01"] - 0.85, "Back to the tin")]
txt = f"""TITLE
Asian Paints Sold More. Why Is Its Margin Thinner?

ALTERNATE TITLES
Asian Paints: Volume Up 6.4%, Gross Margin Down 339 bps
Asian Paints Raised Prices. So Why Did Its Margin Fall?

DESCRIPTION
From July to September 2026, Asian Paints' Decorative Business (India) grew its volume by 6.4% and its value by 14.5%, and the company's own slide calls the volume growth resilient. Yet the standalone gross margin fell to 40.3% from 43.7%, down 339 bps. This video reads the company's filings of 29 October 2026 (the board-meeting outcome with the audited results and the press release, the investor presentation, and the notice of the investor-call recording) to ask which part of a moat showed up this quarter: the power to raise prices and keep the margin, or the reach that keeps buyers buying after prices rise.

What the video covers: the buyers (volume 6.4% after 9.0% in April to June; a year ago it was the other way round, volume 10.9% and value 6.0%); what was left of every ₹100 of sales after materials (about ₹43.70 a year ago, about ₹40.30 now; total material cost up 21.8% against sales up 14.8%); the price boxes on slide 24 (April to June: material about 25%, price about 7%; July to September: material about 3%, price about 5%; the slide states no base) and the company's own words, that pricing of about 12% "partially" offset the impact; the rest of the bill (PBDIT up 5.9% to ₹1,440.3 crore, its margin 17.1% against 18.5%; other expenses ₹16.50 of every ₹100 against ₹18.20); and the other businesses, where bath fittings is the exception (profit before tax ₹8.7 crore against a loss of ₹4.0 crore). Then the "But...": the CEO says the company absorbed part of the cost inflation "to protect consumer demand"; standalone inventories rose 24.5% since 31 March; the company sees inflation "showing little sign of easing" and "competitive intensity" that "remains elevated"; and the filings give no market share, name no competitor, and the call transcript was not yet filed.

How to read the numbers:
- "Our arithmetic" means we worked the number out ourselves from the company's figures (the ₹100 picture, the 21.8%, the about ₹286 crore at last year's margin, the about 7.6% for price and mix together, the 24.5% rise in inventories, the 7 + 5 = 12 sum); these are not company figures. The ₹286 crore is an illustration of scale, not a cause.
- "Standalone" means Asian Paints Limited on its own, without its subsidiaries. The gross margin, the ₹100 picture, the material lines, other expenses, PBDIT and inventories are standalone.
- The 6.4% volume and 14.5% value growth are for the "Decorative Business (India)", as the press release and slides 14 and 15 name it; the filings do not say whether these are standalone or consolidated, so the video does not tie them to the standalone rupee figures.
- Slide 24's material and price boxes are spoken with "about", as the slide shows them; the slide does not say what each is measured against. The "about 12%" is 7 and 5 added, never compounded.
- The reasons shown are the company's own, quoted and attributed. Our reading (the volume test passed, the price test only partly) is labelled as ours; we do not say what caused the fall.

Read the article: https://www.moatmarginresearch.com/asian-paints-q2-volume-held-margin-paid/

CHAPTERS
""" + "\n".join(f"{fm(t)} {n}" for t, n in ch) + """

SOURCES
Asian Paints, outcome of the board meeting: audited standalone and consolidated results for the quarter ended 30 September 2026, with the press release (PDF pages 17 to 20), 29 October 2026: https://nsearchives.nseindia.com/corporate/ASIANPAINT_29102026140213_OutcomeofBM29102026signed.pdf
Asian Paints, investor presentation, Q2 FY27, 29 October 2026: https://nsearchives.nseindia.com/corporate/ASIANPAINT_29102026164544_SEIntimation_Investor_Presentation_Q2FY26-27pdfsigned.pdf
Asian Paints, intimation of the investor conference audio recording, Q2 FY27, 29 October 2026: https://nsearchives.nseindia.com/corporate/ASIANPAINT_29102026211830_SE_intimation__Audio_Recording_Q2FY26-27signed.pdf
Pages and slides are shown on screen with each figure; the results statement and slides 14, 15 and 24 are images, and their figures were read from the page images.

MOATSCORE
[AK to fill: read live from the Moat Screener, https://www.moatmarginresearch.com/moat-screener/]

DISCLAIMER
Educational research, not investment advice. No buy, sell or hold recommendation, no price target, no share prices. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. Do your own research.

HOLDINGS
[AK to fill]

CREDITS
Narration: MiniMax speech-2.6-hd (synthetic voice); set "Altered or synthetic content: Yes". Audio tracks: Hindi by Google Gemini TTS (synthetic voice); Tamil and Telugu by Maya2 from Maya Research (Apache-2.0), using the Kyutai Mimi audio codec (CC-BY-4.0) (synthetic voice). Music: "Curious Ambience" by Reg1n0ld and "Strings with Percussion" by buythefield (CC0). Sound effects: CC0 (Freesound). All graphics drawn in code; the paint tin is an illustration, not a product.

TAGS
Asian Paints, Asian Paints results, gross margin, paint industry, pricing power, volume growth, Q2 FY27, moat, Moat and Margin
"""
open(sys.argv[1], "w").write(txt); print(txt[txt.index("CHAPTERS"):txt.index("SOURCES")])

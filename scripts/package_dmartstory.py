#!/usr/bin/env python3
"""DMart story kit (11 Oct 2026): the plain-words, illustrated long video `dmartstory` (remake of dmartq2 after AK's feedback:
real hook, a hook every 45 s, illustrated motion graphics, told to a viewer who does not follow the market). Captions, chapters,
description, top 10 with links, sources. Thumbnails are the ILLUS-thumb stills (src/vx/illus/Thumb.tsx)."""
import json, math, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from srt_util import srt, split
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx"); VX = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx")
D = json.load(open(VX / "dmartstory/data.json")); t = 0; ent = []; chap = {}
for b in D["beats"]:
    chap.setdefault(b["ch"], t)
    if b["scene"]["type"] != "title": ent += split(b["cap"], t, t + b["sec"], b["cues"])
    t += math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) / FPS
srt(ent, OUT / "dmart-story-keeps-less.srt")
chapters = "\n".join(f"{int(s//60):02}:{int(s%60):02} {D['chapters'][c]}" for c, s in sorted(chap.items()))
long_len = f"{int(t//60)}:{int(t%60):02}"
B = "https://nsearchives.nseindia.com/corporate/"; P = B + "DMART_"
ART = "https://www.moatmarginresearch.com/dmart-q2-fy27-moat-margin/"
DIGEST = "https://www.moatmarginresearch.com/daily-filing-digest-2026-10-10/"
TOP10 = [
 ("Avenue Supermarts (DMart): July to September sales +18.4%, profit +7.6%", ART),
 ("Jain Irrigation: CRISIL keeps a negative outlook; about ₹449 crore of debt due in March 2027; signed term sheet to refinance up to ₹800 crore", B + "JISLJALEQS_10102026125113_SE_Letter_Credit_Ratings_Crisil_10102026_.pdf"),
 ("Oswal Pumps: subsidiary to build a 1.2 GW solar cell plant for about ₹456 crore", B + "OSWALPUMPS_10102026180647_SE_LetterPressReleaseOPL10102026.pdf"),
 ("Western Capital Advisors (debt-listed): about ₹18.96 crore of unauthorised transfers; suspected cyber fraud", "https://nsearchives.nseindia.com/content/debt/WDM/WCAPLcompliance_10102026112503_Intimationo_of_cyber_fraud.pdf"),
 ("Signature Global: Q2 pre-sales ₹18.3 billion, against ₹20.2 billion a year ago", B + "SGLOBAL_10102026185842_PressRelease.pdf"),
 ("Authum Investment: ₹350 crore commitment paid under the Wind World (India) resolution plan", B + "Authum123_10102026191402_Acquisitondis.pdf"),
 ("KEC International: ₹1,014 crore of transmission orders", B + "KEC_10102026144951_PressRelease.pdf"),
 ("Viviana Power Tech: contracts of ₹466.74 crore from Madhya Gujarat Vij Company", B + "VIVIANA_10102026133007_VIVIANA__Intimation_of_Receiving_Order_MGVCL_10102026.pdf"),
 ("Kesoram Industries: CFO resigns, leaves on 2 January 2027", B + "KESORAMIND_10102026153232_Reg30.pdf"),
 ("Milky Mist Dairy Food: says it has received no specific notice from FSSAI or Tamil Nadu's food safety department directing an inquiry into its paneer", B + "MILKYMIST_10102026124100_intimationonclarificationofnewsreports10102026.pdf"),
]
DISC = "Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. No buy/sell recommendations, no price targets."
FOOT = DISC + "\n#MoatMargin #DMart #AvenueSupermarts #Retail"
L = [f"LONG VIDEO (Vox, illustrated, plain words) · dmart-story-keeps-less.mp4 · {long_len} · 1920x1080 · narrator MALE",
 "Title options (A/B test):",
 "  A. DMart Sells More but Keeps Less of Every ₹100. Why?",
 "  B. Who Took 56 Paise From Every ₹100 DMart Sells?",
 "  C. DMart Opened 85 New Stores. Here Is What It Cost.",
 "Thumbnails: dmart-story-thumb-1.png (the torn ₹100 note, recommended), -2 (trolley and coin), -3 (85 new stores)", "",
 "DESCRIPTION:",
 "Out of every ₹100 DMart sells, how much does it keep? In July to September 2025 it kept ₹6.18. In July to September 2026, ₹5.62 (before income tax; our arithmetic from DMart's own results). 56 paise went missing, while sales grew 18.4%. This video follows that ₹100 and finds every paisa: about 10 paise more on the goods themselves, 2 on salaries, 16 on other running costs, 9 on wear and tear (depreciation), 11 on interest, and 8 from lower other income.",
 "The clue is 85: DMart opened 85 new stores last year, against 40 to 50 a year before. Its short-term borrowings rose from ₹965 crore to ₹2,629 crore in six months, and in the half year its operations brought in ₹599 crore of cash against ₹2,090 crore of capital spending. Our reading: the low-price moat is holding, and DMart keeps less of every ₹100.",
 "The split of the ₹100 is our arithmetic from the standalone results table. Where the filings do not give a reason, the video says so.",
 "MoatSCORE (Moat Screener, read 11 Oct 2026, first pass): Avenue Supermarts 5.15 · https://www.moatmarginresearch.com/moat-screener/",
 "", "Full article: " + ART, f"Saturday's full filing digest (every filing, with links): {DIGEST}", "", "CHAPTERS", chapters, "",
 "TEN COMPANY ANNOUNCEMENTS (filings of Saturday, 10 Oct 2026)"]
L += [f"{i}. {x} → {u}" for i, (x, u) in enumerate(TOP10, 1)]
L += [f"Every other filing of the day: {DIGEST}", "", "SOURCES",
 "Avenue Supermarts press release, Q2 FY27 (10 Oct 2026): " + P + "10102026153213_ASLPressRelease10102026.pdf",
 "Avenue Supermarts results with balance sheet and cash flow (10 Oct 2026): " + P + "10102026151828_ASLOutcomeofBM10102026.pdf",
 "Avenue Supermarts investor presentation, H1 FY27 (10 Oct 2026): " + P + "10102026153516_ASLInvestorPresentation10102026.pdf",
 "Presentation for the Analyst/Investor Meet 2026 (24 Jul 2026): " + P + "24072026191836_PresentationforAnalystInvestorMeet2026.pdf",
 "Avenue Supermarts press release, Q2 FY26 (11 Oct 2025): " + P + "11102025153950_ASLPressRelease11102025.pdf",
 "V-Mart Retail business update, Q2 FY27 (1 Oct 2026): " + B + "VMART_01102026185733_BusinessUpdateQ2FY27.pdf",
 "DMart figures are standalone unless marked consolidated. The example of how a new store's cost is spread over years is made up and labelled so on screen.",
 "", FOOT, "",
 "PINNED COMMENT: Out of every ₹100 DMart sells, it kept ₹6.18 a year ago and ₹5.62 now. Which of the six pieces surprised you most? Ten company announcements from Saturday, with links, are in the description. " + DISC,
 "Holdings disclosure line: [AK to fill]",
 "NEXT VIDEO (hand-off): DMart's Festival Months: What About the 85 New Stores?"]
(OUT / "youtube-2026-10-11-dmart-story.txt").write_text("\n".join(L))
print(long_len); print(chapters)

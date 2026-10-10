#!/usr/bin/env python3
"""11 Oct 2026 kit: DMart Q2 FY27 Vox long video (top-10 of 10 Oct + digest link), Vox Short, napkin twin Short (same seven lines). Male voice."""
import json, math, re, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from srt_util import srt, split
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx"); VX = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx")
D = json.load(open(VX / "dmartq2/data.json")); t = 0; ent = []; chap = {}
for b in D["beats"]:
    chap.setdefault(b["ch"], t)
    if b["scene"]["type"] != "title": ent += split(b["cap"], t, t + b["sec"], b["cues"])
    t += math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) / FPS
srt(ent, OUT / "dmart-q2-margin.srt")
chapters = "\n".join(f"{int(s//60):02}:{int(s%60):02} {D['chapters'][c]}" for c, s in sorted(chap.items()))
long_len = f"{int(t//60)}:{int(t%60):02}"
S = json.load(open(VX / "dmartq2s/data.json")); by = {b["key"]: b for b in S["beats"]}; t2 = 0; ent = []
for k in S["shorts"][0]["beats"]:
    b = by[k]; ent += split(b["cap"], t2, t2 + b["sec"], b["cues"]); t2 += math.ceil((b["sec"] + 0.12) * FPS) / FPS
srt(ent, OUT / "dmart-q2-short-vox.srt")
H = json.load(open("/Volumes/DarwinSSD/MMVideo/public/hand/bkv/beats.json")); t3 = 0; ent = []
for b in H:
    b["text"] = b["text"].replace("D Mart", "DMart"); parts = [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", b["text"]) if p.strip()]
    ent += split(b["text"], t3, t3 + b["sec"], parts); t3 += math.ceil((b["sec"] + 0.15) * FPS) / FPS
srt(ent, OUT / "dmart-q2-short-napkin.srt")
B = "https://nsearchives.nseindia.com/corporate/"; P = B + "DMART_"
ART = "https://www.moatmarginresearch.com/dmart-q2-fy27-moat-margin/"
DIGEST = "https://www.moatmarginresearch.com/daily-filing-digest-2026-10-10/"
TOP10 = [
 ("Avenue Supermarts (DMart): Q2 sales +18.4%, profit +7.6%", ART),
 ("Jain Irrigation: CRISIL reaffirms BBB-/Negative; about ₹449 crore due in March 2027", B + "JISLJALEQS_10102026125113_SE_Letter_Credit_Ratings_Crisil_10102026_.pdf"),
 ("Oswal Pumps: subsidiary to build a 1.2 GW solar cell plant for about ₹456 crore", B + "OSWALPUMPS_10102026180647_SE_LetterPressReleaseOPL10102026.pdf"),
 ("Western Capital Advisors: about ₹18.96 crore of unauthorised transfers disclosed", "https://nsearchives.nseindia.com/content/debt/WDM/WCAPLcompliance_10102026112503_Intimationo_of_cyber_fraud.pdf"),
 ("Signature Global: Q2 pre-sales ₹18.3 billion, against ₹20.2 billion a year ago", B + "SGLOBAL_10102026185842_PressRelease.pdf"),
 ("Authum Investment: ₹350 crore paid under the Wind World (India) resolution plan", B + "Authum123_10102026191402_Acquisitondis.pdf"),
 ("KEC International: ₹1,014 crore of transmission orders", B + "KEC_10102026144951_PressRelease.pdf"),
 ("Viviana Power Tech: contracts of ₹466.74 crore from Madhya Gujarat Vij Company", B + "VIVIANA_10102026133007_VIVIANA__Intimation_of_Receiving_Order_MGVCL_10102026.pdf"),
 ("Milky Mist Dairy Food: says it has received no notice from FSSAI about its paneer", B + "MILKYMIST_10102026124100_intimationonclarificationofnewsreports10102026.pdf"),
 ("Kesoram Industries: CFO resigns, leaves on 2 January 2027", B + "KESORAMIND_10102026153232_Reg30.pdf"),
]
DISC = "Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. No buy/sell recommendations, no price targets."
FOOT = DISC + "\n#MoatMargin #DMart #AvenueSupermarts #Retail"
L = [f"LONG VIDEO (Vox) · dmart-q2-margin.mp4 · {long_len} · 1920x1080 · narrator MALE",
 "Title options (A/B test):",
 "  A. DMart Q2: Sales Up 18%, Profit Up 7.6%. Where Did It Go?",
 "  B. DMart Opened 85 Stores in a Year. Here's the Bill.",
 "  C. DMart Didn't Cut Prices. So Why Did Its Margin Fall?",
 "Thumbnails: dmart-q2-margin-thumbH-1..3.png (pair with titles A-C; #2 and #3 have no filing strip)", "",
 "DESCRIPTION:",
 "DMart's sales grew 18.4% in the September quarter, to ₹19,206 crore. Its profit grew 7.6%, to ₹804 crore. The gap is not a price war: the gross margin barely moved (14.24% to 14.15%, our arithmetic). It is the cost of growing faster. DMart added 85 stores last year against 40 to 50 in earlier years, and depreciation and interest are rising with them. Current borrowings went from ₹965 crore to ₹2,629 crore in six months. We read DMart's results, balance sheet and five years of its presentations to answer: where did the margin go, and is the low-price moat intact?",
 "Cost shares of revenue are our arithmetic from the results table. Peer figures are each company's latest reported quarter.",
 "", "Full article: " + ART, f"Today's full filing digest (every filing, with links): {DIGEST}", "", "CHAPTERS", chapters, "",
 "TODAY'S TOP 10 FILINGS (10 Oct 2026)"]
L += [f"{i}. {x} → {u}" for i, (x, u) in enumerate(TOP10, 1)]
L += [f"Every other filing of the day: {DIGEST}", "", "SOURCES",
 "Avenue Supermarts press release, Q2 FY27 (10 Oct 2026): " + P + "10102026153213_ASLPressRelease10102026.pdf",
 "Avenue Supermarts results with balance sheet and cash flow (10 Oct 2026): " + P + "10102026151828_ASLOutcomeofBM10102026.pdf",
 "Avenue Supermarts investor presentation, H1 FY27 (10 Oct 2026): " + P + "10102026153516_ASLInvestorPresentation10102026.pdf",
 "Presentation for the Analyst/Investor Meet 2026 (24 Jul 2026): " + P + "24072026191836_PresentationforAnalystInvestorMeet2026.pdf",
 "Avenue Supermarts press release, Q2 FY26 (11 Oct 2025): " + P + "11102025153950_ASLPressRelease11102025.pdf",
 "Vishal Mega Mart press release, Q1 FY27 (23 Jul 2026): " + B + "VMMP2024_23072026124239_Disclosure_Press_Release_VMM_July_2026.pdf",
 "Trent revenue and store update, Q2 FY27 (5 Oct 2026): " + B + "TRENT_05102026183958_Press_release_Q2FY27.pdf",
 "V-Mart Retail business update, Q2 FY27 (1 Oct 2026): " + B + "VMART_01102026185733_BusinessUpdateQ2FY27.pdf",
 "Reliance Industries media release, Q1 FY27 (17 Jul 2026): " + B + "kavinavora_17072026191923_SE_MR_1.pdf",
 "Moat Screener: https://www.moatmarginresearch.com/moat-screener/",
 "DMart figures are standalone unless marked consolidated. Unit conversions and ratios are our arithmetic.",
 "", FOOT, "",
 "PINNED COMMENT: Sales +18.4%, profit +7.6%, and the gross margin held. The gap is 85 new stores: more depreciation, more interest, and borrowings up from ₹965 crore to ₹2,629 crore. Is that the right trade? Today's top 10 filings, with links, are in the description. " + DISC,
 "Holdings disclosure line: [AK to fill]",
 "NEXT VIDEO (hand-off): DMart Q3: Did the Festive Season Show Up?", "", "─" * 60, ""]
L += [f"SHORT 1 (Vox · loop · male) · dmart-q2-short-vox.mp4 · {t2:.1f} s",
 "Title: DMart sold 18% more. Profit grew 7.6%. Why? #shorts",
 "Description: DMart's Q2 sales rose 18.4%, profit 7.6%. The gross margin barely moved, so it did not cut prices. It opened 85 stores last year against 40 to 50 before; depreciation is up 26%, interest costs 87%, and borrowings went from ₹965 crore to ₹2,629 crore in six months. Full story: " + ART + " · Today's digest: " + DIGEST,
 FOOT, "Pinned comment: So is the low-price engine broken? " + DISC, "",
 f"SHORT 2 (napkin math · same 7 lines as the Vox Short · male · loop) · dmart-q2-short-napkin.mp4 · {t3:.1f} s",
 "Title: DMart: 85 new stores, and the bill (napkin math) #shorts",
 "Description: Same story as the Vox Short, drawn as napkin math, from DMart's own filings. Full read: " + ART,
 FOOT, "Pinned comment: Napkin math: sales +18%, profit +7.6%, 85 new stores, borrowings nearly tripled. " + DISC,
 "Posting rule: neither Short within 2 hours before the long upload; each links to the long video."]
(OUT / "youtube-2026-10-11-dmart.txt").write_text("\n".join(L))
print(long_len, f"{t2:.1f}", f"{t3:.1f}"); print(chapters)

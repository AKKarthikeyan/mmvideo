#!/usr/bin/env python3
"""9 Oct 2026 kit: TCS Q2 FY27 moat-and-margin Vox long video (top-10 of 8 Oct + digest link), Vox Short, napkin twin Short (same seven lines). Male voice."""
import json, math, re, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from srt_util import srt, split
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx"); VX = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx")
D = json.load(open(VX / "tcsq2/data.json")); t = 0; ent = []; chap = {}
for b in D["beats"]:
    chap.setdefault(b["ch"], t)
    if b["scene"]["type"] != "title": ent += split(b["cap"], t, t + b["sec"], b["cues"])
    t += math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) / FPS
srt(ent, OUT / "tcs-q2-fy27-results-moat-margin.srt")
chapters = "\n".join(f"{int(s//60):02}:{int(s%60):02} {D['chapters'][c]}" for c, s in sorted(chap.items()))
long_len = f"{int(t//60)}:{int(t%60):02}"
S = json.load(open(VX / "tcsq2s/data.json")); by = {b["key"]: b for b in S["beats"]}; t2 = 0; ent = []
for k in S["shorts"][0]["beats"]:
    b = by[k]; ent += split(b["cap"], t2, t2 + b["sec"], b["cues"]); t2 += math.ceil((b["sec"] + 0.12) * FPS) / FPS
srt(ent, OUT / "tcs-q2-short-vox.srt")
H = json.load(open("/Volumes/DarwinSSD/MMVideo/public/hand/bkt/beats.json")); t3 = 0; ent = []
acr = lambda x: re.sub(r"\b[A-Z](?: [A-Z])+\b", lambda m: m.group(0).replace(" ", ""), x)
for b in H:
    b["text"] = acr(b["text"]); parts = [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", b["text"]) if p.strip()]
    ent += split(b["text"], t3, t3 + b["sec"], parts); t3 += math.ceil((b["sec"] + 0.15) * FPS) / FPS
srt(ent, OUT / "tcs-q2-short-napkin.srt")
B = "https://nsearchives.nseindia.com/corporate/"; BS = "https://www.bseindia.com/xml-data/corpfiling/AttachLive/"
ART = "https://www.moatmarginresearch.com/tcs-q2-fy27-moat-margin/"
DIGEST = "https://www.moatmarginresearch.com/daily-filing-digest-2026-10-08/"
TOP10 = [
 ("TCS: +2.8% in constant currency, margin 24.0%", ART),
 ("Cochin Shipyard: ₹1,800 crore repair-yard JV with Drydocks World", B + "Aswi4739_08102026103735_SE_Intimation_PB_Notice_08_10_2026_sd.pdf"),
 ("Evonile Pharma (ex-Novartis India): rights issue up to ₹900 crore", BS + "d6b79094-622e-45f0-9ee8-a34c53a26e62.pdf"),
 ("Ajanta Pharma: 2.1% more shares pledged; 7.41% now pledged", B + "SAST_10082026115634_53869.zip"),
 ("Dr Reddy's: USFDA Form 483, two observations", B + "DRREDDY_08102026155720_SE_intimation_08102026_signed.pdf"),
 ("Polycab: appeal to NCLAT against insolvency admission", B + "POLYCAB_08102026204050_StockExchangeIntimationCIRPupdate08102026F.pdf"),
 ("NCC: ₹1,286 crore road contract", B + "NCC_08102026171912_Reg_30.pdf"),
 ("KEC International: ₹1,030 crore of orders", B + "KEC_08102026205717_PressRelease.pdf"),
 ("Embassy Developments: ~₹3,225 crore Q2 pre-sales", B + "EMBDL_08102026140727_EDL_KeyOp_Q2_2027.pdf"),
 ("GMR Airports: Groupe ADP withdraws its Deputy CEO nominee", B + "GMRINFRA_08102026231343_STX_Intimation_of_Resignation_of_Director_Mr_Alexis.pdf"),
]
DISC = "Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. No buy/sell recommendations, no price targets."
FOOT = DISC + "\n#MoatMargin #TCS #ITStocks #Q2Results"
L = [f"LONG VIDEO (Vox) · tcs-q2-fy27-results-moat-margin.mp4 · {long_len} · 1920x1080 · narrator MALE",
 "Title options (A/B test):",
 "  A. TCS Grew 11%. Really, 2.8%. Where the Margin Went.",
 "  B. TCS Q2 Results: Is the IT Slowdown Over?",
 "  C. Is AI Eating TCS's Old Business? Q2 FY27 Explained",
 "Thumbnails: tcs-q2-thumbH-1..3.png (pair with titles A-C; #2 has no filing strip)", "",
 "DESCRIPTION:",
 "TCS reported Q2 FY27 revenue of ₹73,188 crore, up 11.2% in rupees but just 2.8% in constant currency. Its operating margin slipped to 24.0% from 25.2%, and the cause wasn't salaries: subcontractors, a bigger bench and partner costs pushed other operating expenses from 12.5% to 15.2% of revenue. AI revenue reached $3.1 billion a year, more than 10% of revenue, while the CEO said AI brings a 'deflation' from productivity. We read nine quarters of TCS's own filings, five years of margins and four peers to answer: is the slowdown over, and is the moat holding?",
 "Call quotes are from our transcript of TCS's 8 Oct earnings-call audio, checked across two transcription models.",
 "", "Full article: " + ART, f"Today's full filing digest (every filing, with links): {DIGEST}", "", "CHAPTERS", chapters, "",
 "TODAY'S TOP 10 FILINGS (8 Oct 2026)"]
L += [f"{i}. {x} → {u}" for i, (x, u) in enumerate(TOP10, 1)]
L += [f"Every other filing of the day: {DIGEST}", "", "SOURCES",
 "TCS Q2 FY27 press release (8 Oct 2026): " + B + "TCS_CORPCS_08102026154325_PressReleaseletter.pdf",
 "TCS Q2 FY27 results with segments (8 Oct 2026): " + B + "TCS_CORPCS_08102026153124_Post_BM_SE_Letter_fin.pdf",
 "TCS earnings-call audio link (8 Oct 2026): " + B + "TCS_CORPCS_08102026223847_SEInt09072026_signed.pdf",
 "TCS Q2 FY26 press release (9 Oct 2025): " + B + "TCS_CORPCS_09102025155609_PressReleaseletter.pdf",
 "TCS Q4 FY26 press release (9 Apr 2026): " + B + "TCS_CORPCS_09042026155806_PressReleaseletter_signed.pdf",
 "TCS Q1 FY27 press release (9 Jul 2026): " + B + "TCS_CORPCS_09072026155553_Press_release_signed.pdf",
 "TCS acquisition of BBY Services India LLP (1 Oct 2026): " + B + "TCS_CORPCS_01102026182634_Signed_SE_Letter.pdf",
 "TCS Q4 FY21–FY24 releases: " + B + "TCS_12042021184708_SEfilingPg1and2.pdf · " + B + "TCS_11042022173852_SEIntimation.pdf · " + B + "TCS_12042023173338_SEPressReleasesigned.pdf · " + B + "TCS_12042024154356_SELetterPressRelease.pdf",
 "Infosys Q1 FY27: " + B + "Infosys_23072026161911_Outcome23072026V1_1.pdf",
 "HCLTech Q1 FY27: " + B + "HCLTECH_13072026174615_InvestorRelease.pdf",
 "Wipro Q1 FY27: " + B + "Cslogin_16072026155512_PressRelease.pdf",
 "Tech Mahindra Q1 FY27: " + B + "TECHM_16072026160902_Intimation-OutcomeQ1FY26_S.pdf",
 "Cost ratios, segment margins, the currency effect and margin gaps are our arithmetic.",
 "", FOOT, "",
 "PINNED COMMENT: Growth is back, but it's 2.8%, and the margin fell on subcontractors and bench, not salaries. Is AI growing TCS or shrinking it? Today's top 10 filings, with links, are in the description. " + DISC,
 "Holdings disclosure line: [AK to fill]",
 "NEXT VIDEO (hand-off): Infosys Q2: Is the IT Slowdown Sector-Wide?", "", "─" * 60, ""]
L += [f"SHORT 1 (Vox · loop · male) · tcs-q2-short-vox.mp4 · {t2:.1f} s",
 "Title: TCS grew 11%. Really, 2.8%. #shorts",
 "Description: TCS's Q2 FY27 revenue rose 11.2% in rupees but 2.8% in constant currency. AI revenue is $3.1 billion a year, up ~70% in nine months, yet total revenue barely moved. Its CEO on the call: 'there is a deflation because of the productivity benefit.' Full story: " + ART + " · Today's digest: " + DIGEST,
 FOOT, "Pinned comment: Is AI growing TCS, or shrinking it? " + DISC, "",
 f"SHORT 2 (napkin math · same 7 lines as the Vox Short · male · loop) · tcs-q2-short-napkin.mp4 · {t3:.1f} s",
 "Title: 11% − the rupee = 2.8% (napkin math) #shorts",
 "Description: Same story as the Vox Short, drawn as napkin math, from TCS's own Q2 FY27 filing; AI growth is our arithmetic. Full read: " + ART,
 FOOT, "Pinned comment: Napkin math: +11.2% in rupees − the weaker rupee = +2.8%. " + DISC,
 "Posting rule: neither Short within 2 hours before the long upload; each links to the long video."]
(OUT / "youtube-2026-10-09-tcs.txt").write_text("\n".join(L))
print(long_len, f"{t2:.1f}", f"{t3:.1f}"); print(chapters)

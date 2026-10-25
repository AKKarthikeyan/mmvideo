#!/usr/bin/env python3
"""10 Oct 2026 kit: Persistent / Nagarro Vox long video (top-10 of 9 Oct + digest link), Vox Short, napkin twin Short (same seven lines). Male voice."""
import json, math, re, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from srt_util import srt, split
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx"); VX = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx")
D = json.load(open(VX / "persistent/data.json")); t = 0; ent = []; chap = {}
for b in D["beats"]:
    chap.setdefault(b["ch"], t)
    if b["scene"]["type"] != "title": ent += split(b["cap"], t, t + b["sec"], b["cues"])
    t += math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) / FPS
srt(ent, OUT / "persistent-nagarro-who-pays.srt")
chapters = "\n".join(f"{int(s//60):02}:{int(s%60):02} {D['chapters'][c]}" for c, s in sorted(chap.items()))
long_len = f"{int(t//60)}:{int(t%60):02}"
S = json.load(open(VX / "persistents/data.json")); by = {b["key"]: b for b in S["beats"]}; t2 = 0; ent = []
for k in S["shorts"][0]["beats"]:
    b = by[k]; ent += split(b["cap"], t2, t2 + b["sec"], b["cues"]); t2 += math.ceil((b["sec"] + 0.12) * FPS) / FPS
srt(ent, OUT / "persistent-nagarro-short-vox.srt")
H = json.load(open("/Volumes/DarwinSSD/MMVideo/public/hand/bku/beats.json")); t3 = 0; ent = []
acr = lambda x: re.sub(r"\b[A-Z](?: [A-Z])+\b", lambda m: m.group(0).replace(" ", ""), x)
for b in H:
    b["text"] = acr(b["text"]); parts = [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", b["text"]) if p.strip()]
    ent += split(b["text"], t3, t3 + b["sec"], parts); t3 += math.ceil((b["sec"] + 0.15) * FPS) / FPS
srt(ent, OUT / "persistent-nagarro-short-napkin.srt")
B = "https://nsearchives.nseindia.com/corporate/"; P = B + "PERSISTENTUSER1_"
ART = "https://www.moatmarginresearch.com/persistent-nagarro-94-percent-debt/"
DIGEST = "https://www.moatmarginresearch.com/daily-filing-digest-2026-10-09/"
TOP10 = [
 ("Persistent Systems: 94.04% of Nagarro secured; squeeze-out planned", ART),
 ("Polycab: NCLAT stays the insolvency admission; next hearing 26 Oct", B + "POLYCAB_09102026194506_StockexchangeCIRP09102026.pdf"),
 ("PTC Industries: QIP closes, about ₹1,800 crore raised", B + "PTCINDUSTRIES_09102026234318_Exchange_Intimation_QIP_Allotment.pdf"),
 ("Hexaware: 77.5% of institutional votes against the RSU plan, which passed", B + "HEXAWARETECH_09102026204816_Intimation_of_result.pdf"),
 ("Poonawalla Fincorp: Q2 FY27 profit after tax ₹375 crore", B + "POONAWALLA_09102026163448_PFLPressrelease09102026.pdf"),
 ("Thermax: evaluating a growth partner for its renewables arm", B + "THERMAXNSE_09102026171828_SEIntimationclarificationFEPL.pdf"),
 ("Siemens Energy India: final appeal in Russia rejected (₹443.76 million award)", B + "ENRIN_09102026125414_Reg30Ruppur91026.pdf"),
 ("Premier Energies: ₹4,001 crore of orders in Q2", B + "PEL2024_09102026191736_SE_Intimation_-_Press_Release_Signed.pdf"),
 ("Indian Hotels: CARE upgrades long-term rating to AAA", B + "bakhtawar_irani_tajhotels_com_09102026184815_Credit_Rating_upload.pdf"),
 ("M&M: Mahindra Defence Systems to sell 51% of Novavayu Aerospace to Embraer", B + "AmitDodani_09102026232007_Novavayu_SE_Intimation_Investment_Agreement_Revised.pdf"),
]
DISC = "Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. No buy/sell recommendations, no price targets."
FOOT = DISC + "\n#MoatMargin #PersistentSystems #Nagarro #ITStocks"
L = [f"LONG VIDEO (Vox) · persistent-nagarro-who-pays.mp4 · {long_len} · 1920x1080 · narrator MALE",
 "Title options (A/B test):",
 "  A. Persistent's Nagarro Deal: Who Pays for It?",
 "  B. Persistent Has 94% of Nagarro. Now Comes the Debt.",
 "  C. Persistent Said No Share Sale. Then Approved One.",
 "Thumbnails: persistent-nagarro-thumbH-1..3.png (pair with titles A-C; #2 has no filing strip)", "",
 "DESCRIPTION:",
 "Persistent Systems has secured 94.04% of Nagarro, the German digital engineering company, and plans to squeeze out the rest. In June the deal was to be funded entirely by a €1.4 billion, 18-month bridge loan, and the CEO said there would be no QIP. In October shareholders approved up to $450 million of equity inside a $1,250 million long-term funding plan. The EGM notice explains why: the bridge must be replaced, and for two years Persistent has limited access to Nagarro's cash flows. We read five of Persistent's filings since June to answer: who pays, and what does it do to the moat and the margin?",
 "Quotes are from Persistent's own filed transcript of its 28 June 2026 investor call.",
 "", "Full article: " + ART, f"Today's full filing digest (every filing, with links): {DIGEST}", "", "CHAPTERS", chapters, "",
 "TODAY'S TOP 10 FILINGS (9 Oct 2026)"]
L += [f"{i}. {x} → {u}" for i, (x, u) in enumerate(TOP10, 1)]
L += [f"Every other filing of the day: {DIGEST}", "", "SOURCES",
 "Persistent, update on the Nagarro offer (9 Oct 2026): " + P + "09102026173743_PSLUpdateonVoluntaryPublicTakeoverOfferofNagarroSigned.pdf",
 "Persistent press release (9 Oct 2026): " + P + "09102026190022_PSLPressReleaseOctober92026sd.pdf",
 "ICRA rating letters (9 Oct 2026): " + P + "09102026203133_PSLIntimationofCreditRatingNCDsd.pdf",
 "Resignation of the Chief Delivery Officer (9 Oct 2026): " + P + "09102026192354_PSLSMPResignationIntimation9102026sd.pdf",
 "Board outcome: Nagarro offer and bridge loan (27 Jun 2026): " + P + "27062026030030_PSLFinalSEOutcomeoftheBMJune272026Signed.pdf",
 "Investor call transcript (call of 28 Jun 2026): " + P + "03072026121301_PSLInvestorCallTranscriptSubmissionSd.pdf",
 "ICRA rating rationale (7 Jul 2026): " + P + "07072026220507_PSLRevisioninCreditRating07062026Sd.pdf",
 "Board outcome: long-term debt and equity (2 Sep 2026): " + P + "02092026221625_PersistentSEOutcomeoftheBMSeptember22026signed.pdf",
 "Notice of EGM (12 Sep 2026): " + P + "12092026122147_PersistentEGMNoticeSE_IntimationSigned.pdf",
 "Investor presentation (19 Sep 2026): " + P + "19092026223809_PSLInvestorsPresentation19092026Sd.pdf",
 "Q1 FY27 fact sheet (2 Aug 2026): " + P + "02082026145704_PSLFactSheetQ1FY27095signed.pdf",
 "Q2 FY27 earnings call intimation (8 Oct 2026): " + P + "08102026095146_PSLIntimationofEarningsCallOctober152026Sd.pdf",
 "Nagarro's figures are as Persistent and ICRA report them. Peer growth figures are from Persistent's presentation, credited to Zinnov. Unit conversions are our arithmetic.",
 "", FOOT, "",
 "PINNED COMMENT: 94% of Nagarro, an 18-month bridge loan, and two years without Nagarro's cash. Who pays: lenders, or new shareholders? Today's top 10 filings, with links, are in the description. " + DISC,
 "Holdings disclosure line: [AK to fill]",
 "NEXT VIDEO (hand-off): Persistent Q2: How Will It Fund Nagarro?", "", "─" * 60, ""]
L += [f"SHORT 1 (Vox · loop · male) · persistent-nagarro-short-vox.mp4 · {t2:.1f} s",
 "Title: Persistent has 94% of Nagarro. Who pays? #shorts",
 "Description: Persistent secured 94.04% of Nagarro. In June its CEO said 'We don't intend doing any QIP'. In October shareholders approved up to $450 million of equity. The loan behind the deal runs 18 months, and for two years Persistent has limited access to Nagarro's cash flows. Full story: " + ART + " · Today's digest: " + DIGEST,
 FOOT, "Pinned comment: So who pays for this deal? " + DISC, "",
 f"SHORT 2 (napkin math · same 7 lines as the Vox Short · male · loop) · persistent-nagarro-short-napkin.mp4 · {t3:.1f} s",
 "Title: €1.4 bn loan, 18 months, who pays? (napkin math) #shorts",
 "Description: Same story as the Vox Short, drawn as napkin math, from Persistent's own filings. Full read: " + ART,
 FOOT, "Pinned comment: Napkin math: 94% of Nagarro, an 18-month loan, and two years without Nagarro's cash. " + DISC,
 "Posting rule: neither Short within 2 hours before the long upload; each links to the long video."]
(OUT / "youtube-2026-10-10-persistent.txt").write_text("\n".join(L))
print(long_len, f"{t2:.1f}", f"{t3:.1f}"); print(chapters)

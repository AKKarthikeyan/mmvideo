#!/usr/bin/env python3
"""8 Oct 2026 kit (AK: napkin math template, male voice): jewellers-vs-gold napkin LONG video (top-10 of 7 Oct + digest link),
Vox Short, napkin twin Short (same seven lines)."""
import json, math, re, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from srt_util import srt, split
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx"); VX = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx")
D = json.load(open(VX / "jewel/data.json")); t = 0; ent = []; chap = {}
for b in D["beats"]:
    chap.setdefault(b["ch"], t)
    if b["scene"]["type"] != "title": ent += split(b["cap"], t, t + b["sec"], b["cues"])
    t += math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) / FPS
srt(ent, OUT / "jewellers-gold-napkin-long.srt")
chapters = "\n".join(f"{int(s//60):02}:{int(s%60):02} {D['chapters'][c]}" for c, s in sorted(chap.items()))
long_len = f"{int(t//60)}:{int(t%60):02}"
S = json.load(open(VX / "jewels/data.json")); by = {b["key"]: b for b in S["beats"]}; t2 = 0; ent = []
for k in S["shorts"][0]["beats"]:
    b = by[k]; ent += split(b["cap"], t2, t2 + b["sec"], b["cues"]); t2 += math.ceil((b["sec"] + 0.12) * FPS) / FPS
srt(ent, OUT / "jewellers-gold-short-vox.srt")
H = json.load(open("/Volumes/DarwinSSD/MMVideo/public/hand/bks/beats.json")); t3 = 0; ent = []
for b in H:
    parts = [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", b["text"]) if p.strip()]
    ent += split(b["text"], t3, t3 + b["sec"], parts); t3 += math.ceil((b["sec"] + 0.15) * FPS) / FPS
srt(ent, OUT / "jewellers-gold-short-napkin.srt")
B = "https://nsearchives.nseindia.com/corporate/"
ART = "https://www.moatmarginresearch.com/jewellers-q2-growth-gold-price/"
DIGEST = "https://www.moatmarginresearch.com/daily-filing-digest-2026-10-07/"
TOP10 = [
 ("Jewellers: Q2 growth ≈ the gold price (Kalyan, Senco, PC Jeweller, Titan)", ART),
 ("RBI repo 5.50%: seven banks raise repo-linked lending rates", B + "BANKINDIA2_07102026160629_RBLR_.pdf"),
 ("Polycab: NCLT admits ₹2.79 crore operational-debt petition", B + "POLYCAB_07102026224543_Intimationtostockexchange.pdf"),
 ("Prime Focus: income-tax search at its offices", B + "PFOCUS_07102026152825_PFLReplytoNSE07102026signed.pdf"),
 ("Ola Electric: ₹1,000 crore rights issue at ₹27", B + "OLAELECTRIC_07102026185359_OutcomeRightsIssueOctober072026.pdf"),
 ("Inox Green: ₹550 crore for Wind World's 4.5 GW O&M business", B + "IGESL_07102026072235_IGESL_Acq_WWIL_Reg30_dsc.pdf"),
 ("Torrent Power: 300 MW wind PPA ended, ₹39.78 crore damages", B + "TORNTPOWER_07102026184836_Termination_of_Agreement.pdf"),
 ("Tata Steel: India crude steel +10% in Q2", B + "NIDHIFADNAVIS_07102026215052_BSENSE.pdf"),
 ("JSW Steel: US$500 million notes repaid early", B + "jessydenny_07102026221350_Redemption_of_Notes.pdf"),
 ("Adani Enterprises: CARE upgrade to AA/Stable", B + "nishant_joshi_adani_com_07102026181135_AELIntimationCreditRating07102026.pdf"),
]
DISC = "Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. No buy/sell recommendations, no price targets."
FOOT = DISC + "\n#MoatMargin #Jewellery #GoldPrice"
L = [f"LONG VIDEO (napkin math template) · jewellers-gold-napkin-long.mp4 · {long_len} · 1920x1080 · narrator MALE",
 "Title options (A/B test):",
 "  A. India's Jewellers Grew 26–29%. Gold Rose 28%.",
 "  B. Is Jewellery Demand Real, or Just the Gold Price?",
 "  C. Titan, Kalyan, Senco: Growth vs the Gold Price",
 "Thumbnails: jewellers-gold-thumbH-1..3.png (pair with titles A-C; #2 has no filing strip)", "",
 "DESCRIPTION:",
 "Kalyan, Senco and PC Jeweller grew 26–29% in Q2 FY27; Titan's jewellery about 21%. Senco says gold prices averaged about 28% higher. Strip out the gold price and growth is roughly flat, and same-store sales trail it. Last year, when gold rose 43%, Senco grew just 6.5% and Titan's buyers slipped. What grew beyond the price: diamonds, studded jewellery and new stores.",
 "", "Full article: " + ART, f"Today's full filing digest (every filing, with links): {DIGEST}", "", "CHAPTERS", chapters, "",
 "TODAY'S TOP 10 FILINGS (7 Oct 2026)"]
L += [f"{i}. {x} → {u}" for i, (x, u) in enumerate(TOP10, 1)]
L += [f"Every other filing of the day: {DIGEST}", "", "SOURCES",
 "Senco Gold Q2 FY27 update (7 Oct 2026): " + B + "Sencogold_07102026175129_SE_Intimation_Business_Update_07102026.pdf",
 "Kalyan Jewellers Q2 FY27 update (7 Oct 2026): " + B + "KALYANKJIL_07102026073927_Q2_Update.pdf",
 "PC Jeweller Q2 FY27 update (7 Oct 2026): " + B + "PCJEWELLER_07102026191523_update07102026.pdf",
 "Titan Q2 FY27 update (6 Oct 2026): " + B + "TITAN_06102026182232_Q2update202627.pdf",
 "Senco Gold Q2 FY26 update (8 Oct 2025): " + B + "Sencogold_08102025174001_BusinessUpdateQ2H1FY26.pdf",
 "Titan Q2 FY26 update (7 Oct 2025): " + B + "TITAN_07102025164635_Q2update202526.pdf",
 "Titan Q2 FY25 update (4 Oct 2024): " + B + "TITAN_04102024190046_Q2update202425.pdf",
 "The gold-price rise is Senco's statement; 'beyond gold' figures are our rough arithmetic.",
 "", FOOT, "",
 "PINNED COMMENT: Revenue grew about as fast as gold. Is that demand, or price? Today's top 10 filings, with links, are in the description. " + DISC,
 "Holdings disclosure line: [AK to fill]",
 "NEXT VIDEO (hand-off): Titan's Q2 Results: What Gold Did to Margins", "", "─" * 60, ""]
L += [f"SHORT 1 (Vox · loop · male) · jewellers-gold-short-vox.mp4 · {t2:.1f} s",
 "Title: Jewellers grew 29%. Gold rose 28%. #shorts",
 "Description: India's listed jewellers grew up to 29% in Q2 FY27; Senco says gold averaged ~28% higher. Existing stores grew less than gold (Kalyan ~20%, Senco 19%). Diamonds grew 7% by volume at Senco. Full story: " + ART + " · Today's digest: " + DIGEST,
 FOOT, "Pinned comment: Demand, or just the price of gold? " + DISC, "",
 f"SHORT 2 (napkin math · same 7 lines as the Vox Short · male · loop) · jewellers-gold-short-napkin.mp4 · {t3:.1f} s",
 "Title: Same gold, higher price. (napkin math) #shorts",
 "Description: Same story as the Vox Short, drawn as napkin math. Senco's figures; growth-vs-gold is our rough arithmetic. Full read: " + ART,
 FOOT, "Pinned comment: Napkin math: same grams × gold +28% = revenue +28%. " + DISC,
 "Posting rule: neither Short within 2 hours before the long upload; each links to the long video."]
(OUT / "youtube-2026-10-08-jewellers.txt").write_text("\n".join(L))
print(long_len, f"{t2:.1f}", f"{t3:.1f}"); print(chapters)

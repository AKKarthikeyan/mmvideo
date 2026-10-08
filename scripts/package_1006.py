#!/usr/bin/env python3
"""6 Oct 2026 kit: FCNR long video (with top-10 filings + blog link), FCNR Vox Short, Suryoday napkin Short."""
import json, math, re, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from package_shyam import srt, split
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx"); VX = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx")
D = json.load(open(VX / "fcnr/data.json")); t = 0; ent = []; chap = {}
for b in D["beats"]:
    chap.setdefault(b["ch"], t)
    if b["scene"]["type"] != "title": ent += split(b["cap"], t, t + b["sec"], b["cues"])
    t += math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) / FPS
srt(ent, OUT / "fcnr-deposits-seven-banks-mostly-borrowed.srt")
chapters = "\n".join(f"{int(s//60):02}:{int(s%60):02} {D['chapters'][c]}" for c, s in sorted(chap.items()))
long_len = f"{int(t//60)}:{int(t%60):02}"
S = json.load(open(VX / "fcnrs/data.json")); by = {b["key"]: b for b in S["beats"]}; t2 = 0; ent = []
for k in S["shorts"][0]["beats"]:
    b = by[k]; ent += split(b["cap"], t2, t2 + b["sec"], b["cues"]); t2 += math.ceil((b["sec"] + 0.12) * FPS) / FPS
srt(ent, OUT / "fcnr-loop-short-vox.srt")
H = json.load(open("/Volumes/DarwinSSD/MMVideo/public/hand/bkp/beats.json")); t3 = 0; ent = []
for b in H:
    parts = [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", b["text"]) if p.strip()]
    ent += split(b["text"], t3, t3 + b["sec"], parts); t3 += math.ceil((b["sec"] + 0.15) * FPS) / FPS
srt(ent, OUT / "bank-q2-suryoday-writeoff-napkin.srt")
B = "https://nsearchives.nseindia.com/corporate/"
TOP10 = [
 ("FCNR(B): ₹3.4 lakh crore raised by five banks, ~70% matched by loans", "https://www.moatmarginresearch.com/fcnr-deposits-seven-banks-leveraged/"),
 ("Suryoday SFB: GNPA 2.9% after a ₹591 crore write-off", "https://www.moatmarginresearch.com/suryoday-gnpa-write-off-q2/"),
 ("Marico: ₹1,012 crore for 24.09% of Plix", "https://www.moatmarginresearch.com/marico-plix-stake-price/"),
 ("Trent: Q2 revenue +23%, 1,000th Zudio store", B + "TRENT_05102026183958_Press_release_Q2FY27.pdf"),
 ("Apollo Micro Systems: open offer for 26% of Premier Explosives", B + "team_sandeshc_05102026105341_APOLLO.zip"),
 ("Central Bank of India: loans +29.8%, deposits +14.4%", B + "CENTRALBK_05102026111657_Final_SE_Provis_Fig.pdf"),
 ("BGR Energy: ₹3,736 crore debt restructured with NARCL", B + "BGRENERGY_05102026192305_BGRMasterAgreementIntimationFinal.pdf"),
 ("Granules India: promoter-group member bought 9.12% in the open market", B + "GRANULES_10052026123936_53707.zip"),
 ("Godrej Consumer: expects high-teens revenue growth", B + "GODREJCP_05102026184216_Pre_Quarter_Note_Signed.pdf"),
 ("Juniper Hotels: buying Novotel Imagicaa for ₹248 crore", B + "9930371292_05102026184102_Imagicaa_-_Reg_30-MOU_signed.pdf"),
]
DIGEST = "https://www.moatmarginresearch.com/daily-filing-digest-2026-10-05/"
FOOT = "Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. No buy/sell recommendations, no price targets.\n#MoatMargin #banking #FCNR"
L = []
L += [f"LONG VIDEO · fcnr-deposits-seven-banks-mostly-borrowed.mp4 · {long_len} · 1920x1080",
 "Title options (A/B test; thumbnails 1-3 pair with A-C):",
 "  A. ₹3.4 Lakh Crore of Bank Deposits, Mostly Borrowed",
 "  B. HDFC, Axis, Kotak: The FCNR Loop Inside Q2 Deposits",
 "  C. The RBI Window That Inflated Bank Deposit Growth",
 "Thumbnails: fcnr-deposits-seven-banks-thumbH-1..3.png (hero images by MiniMax, numbers from the filings)", "",
 "DESCRIPTION:",
 "Seven private banks raised FCNR(B) deposits in the RBI's June–August swap window. Their own filings show about 70% of the money was matched by loans against the same deposits. Here's how the loop works, what it does to growth numbers, and what it means for a bank's moat.",
 "", "Full article: https://www.moatmarginresearch.com/fcnr-deposits-seven-banks-leveraged/",
 f"Today's full filing digest (every filing, with links): {DIGEST}", "", "CHAPTERS", chapters, "",
 "TODAY'S TOP 10 FILINGS (5 Oct 2026)"]
L += [f"{i}. {t} → {u}" for i, (t, u) in enumerate(TOP10, 1)]
L += [f"Every other filing of the day: {DIGEST}", "", "SOURCES",
 "HDFC Bank Q2 FY27 update (4 Oct): " + B + "HDFCBANK_04102026220033_initial_Final_disclosure_Sep2026.pdf",
 "Yes Bank (4 Oct): " + B + "YESBANK_04102026130032_YBL_SE_Intimation_Pre_Results_Disclosure-Q2FY27_Signed.pdf",
 "Axis Bank (5 Oct): " + B + "AXISBANK_05102026174953_SE_Intimation_Finance_Q2_FY_27_Signed.pdf",
 "Kotak Mahindra Bank (5 Oct): " + B + "KOTAK_05102026161039_PrebusinessupdateQ2H1FY27.pdf",
 "IDFC First Bank (5 Oct): " + B + "IDFCFIRSTB_05102026151710_IDFCFB_Provisional_Release_Sep_26_sign.pdf",
 "IndusInd Bank (5 Oct): " + B + "INDUSINDBK3_05102026201747_SE_Key_NumbersQ2FY2027.pdf",
 "RBL Bank (5 Oct): " + B + "RBLBANK_05102026071703_IntimationunderSEBILODRQ2FY27Signed.pdf",
 "Totals and matched shares are our arithmetic on filed figures. Images in this video are AI-generated illustrations (MiniMax); no real people or events are depicted.",
 "", FOOT, "",
 "PINNED COMMENT: The window closed on 31 August. Should banks report deposit growth with and without it, as Yes Bank and Axis did? Today's top 10 filings, with links, are in the description.",
 "Holdings disclosure line: [AK to fill]", "", "─" * 60, ""]
L += [f"SHORT 1 (Vox · loop) · fcnr-loop-short-vox.mp4 · {t2:.1f} s",
 "Title: ₹3.4 lakh crore of deposits. Most of it borrowed. #shorts",
 "Description: Seven banks raised FCNR(B) deposits in the RBI swap window; their filings show ~70% (five banks, our arithmetic) was matched by loans against the same deposits. IDFC First: the money it lent NRI customers \"was in turn booked as FCNR (B) deposits\". Full story: https://www.moatmarginresearch.com/fcnr-deposits-seven-banks-leveraged/ · Today's digest: " + DIGEST,
 FOOT, "Pinned comment: Deposit growth or deposit loop? What do you think?", "",
 f"SHORT 2 (napkin · Indian accent · loop) · bank-q2-suryoday-writeoff-napkin.mp4 · {t3:.1f} s",
 "Title: Bad loans halved in 90 days. Then look closer. #shorts",
 "Description: Suryoday Small Finance Bank's GNPA fell from 6.5% (June) to 2.9% (September 2026) after a ₹591 crore write-off in the quarter. Add it back and the ratio is about 6.6% (our estimate, assuming the write-off was bad loans). Provisions cover ~31% of GNPA (our arithmetic). Full read: https://www.moatmarginresearch.com/suryoday-gnpa-write-off-q2/ · Today's digest: " + DIGEST,
 FOOT, "Pinned comment: Cleaner book or cleaner number? Which way would you read it?", ""]
(OUT / "youtube-2026-10-06-fcnr.txt").write_text("\n".join(L))
print(long_len, f"{t2:.1f}", f"{t3:.1f}"); print(chapters)

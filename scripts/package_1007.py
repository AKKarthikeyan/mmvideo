#!/usr/bin/env python3
"""7 Oct 2026 kit: Angel One commodity-share long video (top-10 filings of 6 Oct + digest link), Vox Short, napkin Short."""
import json, math, re, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from srt_util import srt, split
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx"); VX = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx")
D = json.load(open(VX / "angelone/data.json")); t = 0; ent = []; chap = {}
for b in D["beats"]:
    chap.setdefault(b["ch"], t)
    if b["scene"]["type"] != "title": ent += split(b["cap"], t, t + b["sec"], b["cues"])
    t += math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) / FPS
srt(ent, OUT / "angel-one-commodity-share-2022-low.srt")
chapters = "\n".join(f"{int(s//60):02}:{int(s%60):02} {D['chapters'][c]}" for c, s in sorted(chap.items()))
long_len = f"{int(t//60)}:{int(t%60):02}"
S = json.load(open(VX / "angelones/data.json")); by = {b["key"]: b for b in S["beats"]}; t2 = 0; ent = []
for k in S["shorts"][0]["beats"]:
    b = by[k]; ent += split(b["cap"], t2, t2 + b["sec"], b["cues"]); t2 += math.ceil((b["sec"] + 0.12) * FPS) / FPS
srt(ent, OUT / "angel-one-commodity-short-vox.srt")
H = json.load(open("/Volumes/DarwinSSD/MMVideo/public/hand/bkr/beats.json")); t3 = 0; ent = []
for b in H:
    parts = [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", b["text"]) if p.strip()]
    ent += split(b["text"], t3, t3 + b["sec"], parts); t3 += math.ceil((b["sec"] + 0.15) * FPS) / FPS
srt(ent, OUT / "angel-one-commodity-short-napkin.srt")
B = "https://nsearchives.nseindia.com/corporate/"
ART = "https://www.moatmarginresearch.com/angel-one-commodity-market-share/"
DIGEST = "https://www.moatmarginresearch.com/daily-filing-digest-2026-10-06/"
TOP10 = [
 ("Angel One: commodity share 41.7% in September, lowest since Jan 2022", ART),
 ("Zee Entertainment: MCA investigation notice under Section 210", B + "ZEEL_06102026144845_SEDisclosureInvestigationsigned.pdf"),
 ("Reliance Communications: DoT terminates its auctioned spectrum", B + "RCOM_06102026231513_DisclosureSEterminationofassig.pdf"),
 ("Titan: consumer businesses ~+25% in Q2", B + "TITAN_06102026182232_Q2update202627.pdf"),
 ("Max Estates: ~₹2,100 crore Q2 pre-sales vs ₹156 crore", B + "MEL_06102026124000_20261006PressReleasePreSalesH1.pdf"),
 ("IEX: Q2 volume +12.7%, day-ahead price +46%", B + "IEX_06102026073150_IEX_Media_Release_Power_Market_Update_September26_signed.pdf"),
 ("KNR Constructions: road SPV sold for ₹549.14 crore (₹225.72 crore invested)", B + "KNRCON_06102026122824_Intimation.pdf"),
 ("Adani Power + Druk Green Power: 770 MW Chamkharchhu-I, Bhutan", B + "ADANIPOWER_06102026065235_APLSigningofSHAtosetup770MWChamkharchhuHEPinBhutan05102026.pdf"),
 ("Tata Chemicals: Supreme Court bars coercive action at Mithapur", B + "TATACHEMYS_06102026111239_SE_Intimation_signed.pdf"),
 ("AXISCADES: Jupiter Capital sold 10.86%", B + "Disclosure4_10062026113439_53783.zip"),
]
DISC = "Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. No buy/sell recommendations, no price targets."
FOOT = DISC + "\n#MoatMargin #AngelOne #MCX"
L = [f"LONG VIDEO · angel-one-commodity-share-2022-low.mp4 · {long_len} · 1920x1080 · narrator MALE (AK 8 Oct: male voice only)",
 "Title options (A/B test; thumbnails 1-3 pair with A-C):",
 "  A. Angel One's Commodity Share Is Back to 2022 Levels",
 "  B. Angel One Doubled Commodity Trading. Its Share Fell.",
 "  C. Is Angel One Losing India's Commodity Traders?",
 "Thumbnails: angel-one-commodity-thumbH-1..3.png (one without the filing strip, per STRUCTURE §5)", "",
 "DESCRIPTION:",
 "Angel One's commodity turnover more than doubled in Q2 FY27, yet its share of retail commodity trading fell to 44.0% (41.7% in September), the lowest in its monthly filings since January 2022. Five years of its own filings show the climb from 27.8% to a 67.6% peak, and how much has been given back. Then the core: F&O share held at 22.1%, and commodity is about 6% of revenue.",
 "", "Full article: " + ART, f"Today's full filing digest (every filing, with links): {DIGEST}", "", "CHAPTERS", chapters, "",
 "TODAY'S TOP 10 FILINGS (6 Oct 2026)"]
L += [f"{i}. {x} → {u}" for i, (x, u) in enumerate(TOP10, 1)]
L += [f"Every other filing of the day: {DIGEST}", "", "SOURCES",
 "Angel One business update, Sep 2026 and Q2 FY27 (6 Oct 2026): " + B + "ANGEL8896_06102026073616_October062026_Intimation_of_Business_updates.pdf",
 "Angel Broking business update, Sep 2021: " + B + "ANGELBRKG_05102021082516_October052021Intimationofmonthlybusinessupdate.pdf",
 "Angel One business update, Aug 2025 (peak): " + B + "ANGEL8896_04092025071949_September042025_Intimation_of_Business_Update_August_2025.pdf",
 "Angel One investor presentation Q1 FY27 (15 Jul 2026): " + B + "ANGEL8896_15072026180330_15072026InvestorPresentationAOL.pdf",
 "Angel One board meeting intimation (15 Oct 2026): " + B + "ANGEL8896_06102026161317_October062026_Prior_intimation_of_dividend.pdf",
 "Implied market size, growth multiples and the share of the climb given back are our arithmetic. Images in this video are AI-generated illustrations (MiniMax); no real people, logos or places are depicted.",
 "", FOOT, "",
 "PINNED COMMENT: Angel One's commodity share is at its lowest since January 2022, while its F&O share held. Who do you think is winning the new commodity traders? Today's top 10 filings, with links, are in the description. " + DISC,
 "Holdings disclosure line: [AK to fill]",
 "NEXT VIDEO (hand-off / end screen): Angel One's Q2 Results: Did Revenue Double Too? (after the 15 Oct board meeting)", "", "─" * 60, ""]
L += [f"SHORT 1 (Vox · loop · male) · angel-one-commodity-short-vox.mp4 · {t2:.1f} s",
 "Title: Angel One doubled. Its share fell anyway. #shorts",
 "Description: Angel One's commodity turnover more than doubled in Q2 FY27, but its market share fell to 44.0% (41.7% in September). The market roughly tripled (our arithmetic: turnover ÷ share). Its F&O share held at 22.1%. Full story: " + ART + " · Today's digest: " + DIGEST,
 FOOT, "Pinned comment: Losing the new traders, or just a bigger market? " + DISC, "",
 f"SHORT 2 (napkin · same 7 lines as the Vox Short · male · loop) · angel-one-commodity-short-napkin.mp4 · {t3:.1f} s",
 "Title: Angel One doubled. Its share fell anyway. (napkin math) #shorts",
 "Description: Angel One, Q2 FY27: ₹2,438 bn a day of commodity turnover at a 44.0% share; a year ago ₹1,187 bn at 65.1%. Divide turnover by share and the market went from ~₹1,823 bn to ~₹5,541 bn a day (our arithmetic). Full read: " + ART + " · Today's digest: " + DIGEST,
 FOOT, "Pinned comment: Napkin math: turnover ÷ share = the market. " + DISC,
 "Posting rule: neither Short within 2 hours before the long upload; each links to the long video."]
(OUT / "youtube-2026-10-07-angelone.txt").write_text("\n".join(L))
print(long_len, f"{t2:.1f}", f"{t3:.1f}"); print(chapters)

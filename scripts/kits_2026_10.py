#!/usr/bin/env python3
"""October 2026 upload kits, one function per upload day: caption files (.srt) and the YouTube text sheet, into out/vx/.
Usage: kits_2026_10.py <kit>      kits: shorts_1003 shyam 1004 bank2 bank3 1006 1007 1008 1009 1010 1011 dmartstory

A kit is the words for one day's uploads. The timings come from the built videos (mm.py reads them the way the players
do), so build the videos and voice the napkin Short first. For a new story video use package_story.py; this file is the
record of what went out in October, and re-running a kit rewrites the same files."""
import sys
import mm
from mm import DISC

OUT = mm.OUT / "vx"


def shorts_1003():
    """SRT captions for the HAL napkin Short and the CEO-chain kinetic Short (3 Oct 2026)."""
    t, _ = mm.napkin_captions("hal", "hal-hatsoff-short-napkin-math"); print(f"hal: {t:.1f}s")
    t = mm.loop_captions("ceos", "ceo-chain-icici-short-kinetic"); print(f"ceo: {t:.1f}s")


def shyam():
    """Shyam Metalics kit (3 Oct 2026): chapter timestamps + SRT captions for the long video and both Shorts."""
    long_len, chapters = mm.long_captions("shyam", "shyam-metalics-latest-news-50000-crore-mou")
    print(f"long: {long_len}"); print(chapters)
    t = mm.loop_captions("shyams", "shyam-metalics-short1-vox"); print(f"short1: {t:.1f}s")
    t, _ = mm.napkin_captions("shyam", "shyam-metalics-short2-napkin-math"); print(f"short2: {t:.1f}s")


def k1004():
    """4 Oct 2026 kit: chapters + SRT for the Q2 bank long video, the JLR kinetic Short and the Vedanta napkin Short."""
    long_len, chapters = mm.long_captions("banksq2", "bank-q2-results-preview-22-banks")
    print(f"BANK LONG {long_len}"); print(chapters)
    t = mm.loop_captions("jlrs", "jlr-q2-short-kinetic"); print(f"JLR short {t:.1f}s")
    t, _ = mm.napkin_captions("vog", "vedanta-oil-gas-cambay-short-napkin-math"); print(f"VOG short {t:.1f}s")


def _napkin_set(S, lines, sheet):
    """A set of napkin Shorts: one SRT each, and one upload sheet (title, script, description facts, pinned comment)."""
    for n, (sid, fn, verdict, title, facts, pin) in enumerate(S, 1):
        t, bs = mm.napkin_captions(sid, f"{fn}-napkin")
        lines += [f"SHORT {n} · {fn}-napkin.mp4 · {t:.1f} s · VERDICT: {verdict}", f"Title: {title}", "Script:"]
        lines += [f"  {b['key']} {b['text']}" for b in bs]
        lines += [f"Description facts: {facts}", f"Pinned comment: {pin}", ""]
    (OUT / sheet).write_text("\n".join(lines))
    print("\n".join(l for l in lines if l.startswith("SHORT")))


def bank2():
    """4 Oct 2026: SRTs + upload sheet for bank napkin Shorts set 2 (bkd–bkk). Facts: out/vx/bank-q2-forensic-scripts-v2.md"""
    S = [
     ("bkd", "bank-q2-bob-savers-india-borrowers-abroad", "WATCH", "Bank of Baroda: savers in India, borrowers abroad #shorts",
      "In India, Bank of Baroda's deposits grew ₹74,973 crore more than its loans. Abroad, loans grew ₹57,311 crore more than deposits. Overseas loans are 21.5% of the book but 39.5% of the year's loan growth (our maths on BoB's 3 Oct 2026 filing: global minus domestic).",
      "Should banks report India and overseas loan growth separately in the headline? PNB's overseas loans grew 62.7% too."),
     ("bke", "bank-q2-union-213-per-100", "WATCH", "Union Bank lent ₹213 for every ₹100 it raised #shorts",
      "Union Bank's gross advances grew ₹1,80,723 crore in a year; total deposits grew ₹84,836 crore (filed, 1 Oct 2026). Domestic CASA +14.66%; domestic term deposits +3.1% (our maths: deposits minus CASA). Domestic CD ratio 77.01% → 84.34% (filed).",
      "₹213 lent per ₹100 raised was the highest of the 22 banks we track. Which bank do you want on the napkin next?"),
     ("bkf", "bank-q2-boi-75000-crore-90-days", "GOOD ?", "Bank of India raised ₹75,000 crore in 90 days #shorts",
      "Bank of India's domestic deposits rose from ₹8,24,963 crore (30 Jun) to ₹9,00,218 crore (30 Sep 2026): +₹75,255 crore, 44% of the year's growth (our maths). Domestic advances rose ₹29,252 crore in the quarter. Global deposits +21.60% YoY, the fastest of the 8 government banks that have reported.",
      "Sticky savings or quarter-end money? What's your guess? We'll check the December numbers."),
     ("bkg", "bank-q2-thrissur-gold-csb-dhanlaxmi", "WATCH", "Two 100-year-old Kerala banks are betting on gold #shorts",
      "CSB Bank: gold loans ₹16,456 → ₹22,301 crore, 47.4% → 52.6% of gross advances (excludes receivables secured against gold). Dhanlaxmi Bank: gold loans ₹4,447 → ₹6,823 crore, 34.1% → 42.8%; gold (+2,376) and MSME (+672) grew more than the whole book (+2,907). Shares are our maths on the banks' 1 Oct 2026 filings.",
      "Gold loans are secured. Is one-collateral concentration a strength or a risk? Tag someone from Thrissur."),
     ("bkh", "bank-q2-esaf-625-crore-write-off", "CONCERN", "ESAF wrote off ₹625 crore in one quarter #shorts",
      "ESAF Small Finance Bank's Q2 FY27 update: technical write-off of ₹625 crore during Q2; the bank says growth would have been 28.32% instead of 25.05% without it. ₹625 crore is 2.6% of gross advances of ₹23,931 crore (our maths). Ujjivan reported ₹43 crore of write-offs in Q2 on a ₹45,699 crore book; definitions may differ.",
      "Should banks show write-offs as a growth adjustment or as a cost? Tell us."),
     ("bki", "bank-q2-equitas-microfinance-contrarian", "WATCH", "Peers exit microfinance. Equitas walks in. #shorts",
      "Equitas SFB: microfinance & micro loans ₹3,392 → ₹6,331 crore; excluding ₹579 crore of purchased agri loans (bank's footnote), ₹5,752 crore, +70% (our maths). CASA −1.04% YoY while deposits +19.03% (filed). Ujjivan's group loans fell to 34.3% of its book; ESAF's micro loans fell 4.6% in the quarter.",
      "Contrarian bet or early to a recovery? Which way are you leaning?"),
     ("bkj", "bank-q2-jk-bank-moat-thinner", "WATCH", "J&K Bank's deposit moat is getting thinner #shorts",
      "J&K Bank: CASA ratio 45.89% → 42.01% (−388 bps, filed). Deposits +₹24,766 crore in a year, of which CASA +₹4,503 crore; 82% came from term deposits (our maths). Gross advances +23.72%.",
      "42% CASA is still high. Is it a moat if it's shrinking? Share with someone who banks with J&K."),
     ("bkk", "bank-q2-au-sfb-deposit-engine", "GOOD", "13 of 22 banks lent more than they raised. Not AU. #shorts",
      "AU Small Finance Bank: deposits +₹37,951 crore vs gross advances +₹32,765 crore in a year (filed, 3 Oct 2026). CASA +29.1%, CASA ratio 29.4% → 29.5%. Gross loan portfolio incl. securitised +25.1%; sold-down book ₹5,352 → ₹3,480 crore. In 13 of the 22 banks we track, loans grew by more rupees than deposits (our maths).",
      "Which matters more to you in a bank: loan growth or deposit growth?"),
    ]
    lines = ["BANK Q2 NAPKIN SHORTS · SET 2 (8 Shorts, 9 banks) · Indian-accent narrator · loop endings · AK approved scripts 4 Oct",
     "Storyline: hook → CLUE 1 → CLUE 2 → THE TWIST → VERDICT stamp (GOOD / WATCH / CONCERN — on the filing, not the stock).",
     "Scripts + full fact tables: bank-q2-forensic-scripts-v2.md. Scoreboard link for descriptions: https://www.moatmarginresearch.com/q2-fy27-bank-scoreboard/",
     "Posting order: bkd BoB → bke Union → bkg Gold → bkh ESAF → bkk AU → bkf BoI → bki Equitas → bkj J&K (one a day, 12:30 or 20:30 IST).",
     "Description footer on all: Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. #MoatMargin #shorts #banking", ""]
    _napkin_set(S, lines, "shorts-2026-10-04-bank-set2.txt")


def bank3():
    """4 Oct 2026: SRTs + upload sheet for bank napkin Shorts set 3 (bkl–bko). Facts: out/vx/bank-q2-forensic-scripts-v2.md"""
    S = [
     ("bkl", "bank-q2-tmb-105-years-startup", "WATCH", "A 105-year-old bank growing like a startup #shorts",
      "Tamilnad Mercantile Bank: total advances ₹46,930 → ₹60,715 crore (+29.37%), third-fastest of the 22 banks we track (behind Ujjivan 32.12% and Equitas 29.58%). Deposits ₹55,421 → ₹69,546 crore (+25.49%); CASA +16.26%. 82.5% of new deposits were term deposits; CASA share 27.4% → 25.3% (our maths on the 1 Oct 2026 filing).",
      "Fast growth funded by costlier deposits: strength or strain? Tag someone from Thoothukudi."),
     ("bkm", "bank-q2-canara-pnb-other-side-of-baroda", "WATCH", "Canara and PNB: the other side of Bank of Baroda #shorts",
      "Canara Bank, India: advances +16.83% (+₹1,82,005 crore) vs deposits +10.96% (+₹1,52,870 crore); gap ₹29,135 crore (our maths, 1 Oct 2026 filing). PNB overseas advances (global − domestic) ₹51,707 → ₹84,110 crore (+62.7%); overseas loans per ₹100 of overseas deposits 97 → 129 (our maths, 2 Oct 2026 filing).",
      "Spare deposits at home, or a funding gap: which bank's position would you rather be in, and why?"),
     ("bkn", "bank-q2-karnataka-bank-number-two", "WATCH", "Karnataka Bank lent ₹149 for every ₹100 raised #shorts",
      "Karnataka Bank: gross advances ₹73,644 → ₹92,015 crore (+24.94%, +₹18,370 crore); deposits ₹1,02,817 → ₹1,15,138 crore (+11.98%, +₹12,321 crore). Loan-to-deposit ratio 71.6% → 79.9% (our maths). CASA +14.88%; CASA ratio 31.01% → 31.81% (filed, 1 Oct 2026).",
      "Union is #1 at ₹213, Karnataka #2 at ₹149. Where's your bank? Full table in the 22-bank Short."),
     ("bko", "bank-q2-22-banks-league", "—", "22 banks, one napkin: how much did they lend per ₹100? #shorts",
      "₹ lent per ₹100 of new deposits, one year to 30 Sep 2026 (our maths: increase in advances ÷ increase in deposits, as filed by each bank, 1–3 Oct 2026). Union 213, Karnataka 149, Equitas 138, UCO 133, Bandhan 125, Capital SFB 122, Punjab & Sind 116, Canara 113, PNB 108, Karur Vysya 107, Indian Bank 107, CSB 106, J&K 103, TMB 98, Ujjivan 97, Bank of Baroda 93, ESAF 86, AU 86, Dhanlaxmi 84, South Indian 80, Bank of India 79, IDBI 79. Each bank's own basis (global or total); IDBI uses net advances; Bandhan includes PTC; UCO and Indian Bank file rounded lakh crore.",
      "Find your bank and comment its number. SBI, HDFC Bank, ICICI and others haven't filed yet: we'll add them."),
    ]
    lines = ["BANK Q2 NAPKIN SHORTS · SET 3 (4 Shorts: TMB, Canara+PNB, Karnataka, 22-bank roundup) · Indian-accent narrator · loop endings · AK approved scripts 4 Oct",
     "Storyline: hook → CLUE 1 → CLUE 2 → THE TWIST → VERDICT stamp (GOOD / WATCH / CONCERN — on the filing, not the stock).",
     "Scripts + full fact tables: bank-q2-forensic-scripts-v3.md. Scoreboard link for descriptions: https://www.moatmarginresearch.com/q2-fy27-bank-scoreboard/",
     "Posting order (after set 2): TMB → Canara+PNB → Karnataka → 22-bank roundup last (one a day, 12:30 or 20:30 IST). Pin the roundup on the channel; link it from the Union and Karnataka pinned comments.",
     "Description footer on all: Educational research, not investment advice. Moat & Margin is not a SEBI-registered Research Analyst or Investment Adviser. #MoatMargin #shorts #banking", ""]
    _napkin_set(S, lines, "shorts-2026-10-04-bank-set3.txt")


def k1006():
    """6 Oct 2026 kit: FCNR long video (with top-10 filings + blog link), FCNR Vox Short, Suryoday napkin Short."""
    long_len, chapters = mm.long_captions("fcnr", "fcnr-deposits-seven-banks-mostly-borrowed")
    t2 = mm.loop_captions("fcnrs", "fcnr-loop-short-vox")
    t3, _ = mm.napkin_captions("bkp", "bank-q2-suryoday-writeoff-napkin")
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


def k1007():
    """7 Oct 2026 kit: Angel One commodity-share long video (top-10 filings of 6 Oct + digest link), Vox Short, napkin Short."""
    long_len, chapters = mm.long_captions("angelone", "angel-one-commodity-share-2022-low")
    t2 = mm.loop_captions("angelones", "angel-one-commodity-short-vox")
    t3, _ = mm.napkin_captions("bkr", "angel-one-commodity-short-napkin")
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


def k1008():
    """8 Oct 2026 kit (AK: napkin math template, male voice): jewellers-vs-gold napkin LONG video (top-10 of 7 Oct + digest link),
    Vox Short, napkin twin Short (same seven lines)."""
    long_len, chapters = mm.long_captions("jewel", "jewellers-gold-napkin-long")
    t2 = mm.loop_captions("jewels", "jewellers-gold-short-vox")
    t3, _ = mm.napkin_captions("bks", "jewellers-gold-short-napkin")
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


def k1009():
    """9 Oct 2026 kit: TCS Q2 FY27 moat-and-margin Vox long video (top-10 of 8 Oct + digest link), Vox Short, napkin twin Short (same seven lines). Male voice."""
    long_len, chapters = mm.long_captions("tcsq2", "tcs-q2-fy27-results-moat-margin")
    t2 = mm.loop_captions("tcsq2s", "tcs-q2-short-vox")
    t3, _ = mm.napkin_captions("bkt", "tcs-q2-short-napkin", fix=mm.acronyms)
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


def k1010():
    """10 Oct 2026 kit: Persistent / Nagarro Vox long video (top-10 of 9 Oct + digest link), Vox Short, napkin twin Short (same seven lines). Male voice."""
    long_len, chapters = mm.long_captions("persistent", "persistent-nagarro-who-pays")
    t2 = mm.loop_captions("persistents", "persistent-nagarro-short-vox")
    t3, _ = mm.napkin_captions("bku", "persistent-nagarro-short-napkin", fix=mm.acronyms)
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


def k1011():
    """11 Oct 2026 kit: DMart Q2 FY27 Vox long video (top-10 of 10 Oct + digest link), Vox Short, napkin twin Short (same seven lines). Male voice."""
    long_len, chapters = mm.long_captions("dmartq2", "dmart-q2-margin")
    t2 = mm.loop_captions("dmartq2s", "dmart-q2-short-vox")
    t3, _ = mm.napkin_captions("bkv", "dmart-q2-short-napkin", fix=lambda x: x.replace("D Mart", "DMart"))
    B = "https://nsearchives.nseindia.com/corporate/"; P = B + "DMART_"
    ART = "https://www.moatmarginresearch.com/dmart-q2-fy27-moat-margin/"
    DIGEST = "https://www.moatmarginresearch.com/daily-filing-digest-2026-10-10/"
    TOP10 = [
     ("Avenue Supermarts (DMart): Q2 sales +18.4%, profit +7.6%", ART),
     ("Jain Irrigation: CRISIL reaffirms BBB-/Negative; about ₹449 crore due in March 2027", B + "JISLJALEQS_10102026125113_SE_Letter_Credit_Ratings_Crisil_10102026_.pdf"),
     ("Oswal Pumps: subsidiary to build a 1.2 GW solar cell plant for about ₹456 crore", B + "OSWALPUMPS_10102026180647_SE_LetterPressReleaseOPL10102026.pdf"),
     ("Western Capital Advisors (debt-listed): about ₹18.96 crore of unauthorised transfers disclosed", "https://nsearchives.nseindia.com/content/debt/WDM/WCAPLcompliance_10102026112503_Intimationo_of_cyber_fraud.pdf"),
     ("Signature Global: Q2 pre-sales ₹18.3 billion, against ₹20.2 billion a year ago", B + "SGLOBAL_10102026185842_PressRelease.pdf"),
     ("Authum Investment: ₹350 crore paid under the Wind World (India) resolution plan", B + "Authum123_10102026191402_Acquisitondis.pdf"),
     ("KEC International: ₹1,014 crore of transmission orders", B + "KEC_10102026144951_PressRelease.pdf"),
     ("Viviana Power Tech: contracts of ₹466.74 crore from Madhya Gujarat Vij Company", B + "VIVIANA_10102026133007_VIVIANA__Intimation_of_Receiving_Order_MGVCL_10102026.pdf"),
     ("Milky Mist Dairy Food: says it has received no specific notice from FSSAI directing an inquiry into its paneer", B + "MILKYMIST_10102026124100_intimationonclarificationofnewsreports10102026.pdf"),
     ("Kesoram Industries: CFO resigns, leaves on 2 January 2027", B + "KESORAMIND_10102026153232_Reg30.pdf"),
    ]
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


def dmartstory():
    """DMart story kit (11 Oct 2026): the plain-words, illustrated long video `dmartstory` (remake of dmartq2 after AK's feedback:
    real hook, a hook every 45 s, illustrated motion graphics, told to a viewer who does not follow the market). Captions, chapters,
    description, top 10 with links, sources. Thumbnails are the ILLUS-thumb stills (src/vx/illus/Thumb.tsx)."""
    long_len, chapters = mm.long_captions("dmartstory", "dmart-story-keeps-less")
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


KITS = {"shorts_1003": shorts_1003, "shyam": shyam, "1004": k1004, "bank2": bank2, "bank3": bank3, "1006": k1006, "1007": k1007, "1008": k1008, "1009": k1009, "1010": k1010, "1011": k1011, "dmartstory": dmartstory}

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in KITS:
        sys.exit("usage: kits_2026_10.py <kit>   kits: " + " ".join(KITS))
    OUT.mkdir(parents=True, exist_ok=True)
    KITS[sys.argv[1]]()

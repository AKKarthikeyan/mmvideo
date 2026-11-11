# ECO-16 independent audit (gate S5), 3 Nov 2026

**Result: 124 rows audited: 115 PASS, 9 FIX (all applied), 0 FAIL.**
Method: every row was reopened in its saved `.txt` at the cited place (PDF page layout checked against the printed page for NCERT; the Prelims page image viewed); meaning, number, unit, date and speaker were checked, not just the phrase; all arithmetic redone. No row needed a status downgrade. 9 UNVERIFIED/BLOCKED rows are correctly marked and stay off screen.

## The three NCERT errors, redone from the NCERT text
1. **Appendix 3.1 (XII p.51)** prints "a = 1 and r = 0.4 ... 1/(1-0.4) = 5/3". In the 20% example each round lends 0.8 of the last (100, 80, 64), so r = 0.8 and 1/(1-0.8) = 5; 100/(1-0.8) = 500. Researcher is right (A04).
2. **25% example (XII p.42)**: "in the previous case, Rs 100 in reserves could support deposits of Rs 400". The previous (20%) case gave deposits of Rs 500 and loans of Rs 400; the 25% case gives multiplier 4, deposits Rs 400, loans Rs 300 (NCERT's "Rs 300 only" is right). Researcher is right (A05).
3. **Class X "about half" (p.49)** vs Graph 1 (p.48): 51 + 10 + 5 = 66% formal; NSS 77th round (MoSPI note) gives 66/34 rural. Researcher is right that they disagree (N37). Caution: the sentence is about "credit needs", the graph about the source split, so on screen say "does not match its own graph", not "NCERT is wrong".

## The CONFLICT row (T02, with T01, T03-T06)
Quote is exact (BoE QB 2014 Q1 p.14: banks do not simply lend out deposits "and nor do they 'multiply up' central bank money"). Bundesbank April 2017 supports it independently (opening summary; fn 35 says the multiplier is a reduced form, not a causal link). Both sides are named in the row, but it needed fixing for fairness (applied): authors' views not BoE policy; UK and euro area; NCERT 3.3 itself says a loan opens a new deposit; IGNOU says reality is a mix. BoE and Bundesbank still accept limits on lending (profit, regulation, demand), so never script "banks can create unlimited money".

## Checklist coverage
All K-items map to real claim ids (script check: no dangling ids, every `local_file` exists). Gaps for the researcher, not auto-fixed:
- **K29 Box 3.2 Demonetisation** is set aside "belongs with ECO-14 if taught": conditional. GOLD_STANDARD section 6 needs a named home; add it to the ECO-14 map or the subtopic map.
- **Appendix 3.3 / Table 3.5 (monetary base)** and **Class XII Exercises 1-11** (Q8 multiplier, Q10 "is a bank a creator of money?") have no checklist row; add them under K09/K14/K33.
- **Grade 7 Part 1 Ch 11 "From Barter to Money"**: only pp.242-243 are claimed (N55). Other headings and Grade 7 Part 2 items (passbook debit/credit p.198, ATM p.203, temples as banks p.202) have no row or set-aside reason.
- **P01** syllabus line also contains "Goals and Instruments of Monetary Management", "Relation between the Central Bank and the Treasury", "Proposal for ceiling on growth rate of money": confirm they are mapped elsewhere (ECO-14/15).
- S4: I10's second source (PIB) repeats the MoSPI note, so it is not independent; NCERT Graph 1 is the same data.

## Living figures
All carry an as-of date: M3 and components (31 Jul 2026; newest level readable, 15 Oct release behind CAPTCHA), CRR/SLR/rates (3 Nov 2026), Jan Dhan (19 Aug 2026), payments (June 2026, FY26), DICGC limit (read 3 Nov 2026), NABARD SHGs (31 Mar 2024), AIDIS (debt as on 30 Jun 2018). I05's deposit and lending rows have no date of their own on the RBI page; the claim says so. Only 2025 Directions (BLOCKED, U01) remain for a person to open in a browser.

## Row table
| claim_id | verdict | evidence | exact fix |
|---|---|---|---|
| ECO16-N01 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N02 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N03 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N04 | PASS | Cashless paragraph is on PDF p.2 (printed p.37); names Jan Dhan, Aadhar-enabled payments, e-wallets, NFS. | none |
| ECO16-N05 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N06 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N07 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N08 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N09 | PASS | Lala story pp.38-39: 100 kg, 25 kg loan, receipts 125 kg, "out of thin air"; NCERT calls it a story. | none |
| ECO16-N10 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N11 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N12 | PASS | Assets = Reserves + Loans etc. on p.39; Net Worth defined top of p.40 (claim page p.39 is where the balance sheet starts). | none |
| ECO16-N13 | PASS | Table 3.1 p.40: Rs 100 reserves, Rs 100 deposits, M1 = 100. | none |
| ECO16-N14 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N15 | PASS | Rounds 100/80, 180/36/64, ... 500/100/400 in Tables 3.2-3.3 (pp.41-42); text-layer text re-read. Example spans pp.40-42; claim cites p.42 (the end). | none |
| ECO16-N16 | PASS | Text on p.42: "reserves of Rs 100 create deposits of Rs (5 x 100) = Rs 500"; the formula is an image (checked: the picture slot is blank in the layer). | none |
| ECO16-N17 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N18 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N19 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N20 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N21 | PASS | Re-did: 10/1.05 + 110/1.05^2 = 109.297 (NCERT prints 109.29 approx.); at 6% = 107.333. Matches. | none |
| ECO16-N22 | PASS | p.47: liquidity trap wording and Eq 3.5 as claimed. | none |
| ECO16-N23 | PASS | p.47 notes RBI, coins Government; demand and time deposits. Second source RBI FAQ (updated 15 Apr 2025): coins under Coinage Act 2011 s.6, notes RBI s.22/26. Matches. | none |
| ECO16-N24 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N25 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N26 | PASS | Re-read in ncert_leec103.txt at the cited place; wording, numbers (v=1/k, MdT=kPY, M1-M4 definitions, CRR/SLR) match; page = PDF page+35 holds. | none |
| ECO16-N27 | PASS | grep of the chapter: "currency deposit ratio" and "reserve deposit ratio" occur only in the Key Concepts list (lines 691-692). | none |
| ECO16-N28 | PASS | Table 3.4 prints M1 6584081 and M3 27286589 for 2024-25 (caption says "(2023-24)" but the table runs to 2024-25; another small NCERT slip). Dated figure, correctly flagged. | none |
| ECO16-N29 | PASS | Class X text re-read; footer-page mapping (pdf p.n = printed 37+n) holds. N35 slices 51+10+5+23+7+3+1=100. | none |
| ECO16-N30 | PASS | Class X text re-read; footer-page mapping (pdf p.n = printed 37+n) holds. N35 slices 51+10+5+23+7+3+1=100. | none |
| ECO16-N31 | PASS | Class X text re-read; footer-page mapping (pdf p.n = printed 37+n) holds. N35 slices 51+10+5+23+7+3+1=100. | none |
| ECO16-N32 | PASS | p.42: "banks in India these days hold about 5 per cent of their deposits as cash". Correctly marked dated vs CRR 3.00% today. | none |
| ECO16-N33 | PASS | Class X text re-read; footer-page mapping (pdf p.n = printed 37+n) holds. N35 slices 51+10+5+23+7+3+1=100. | none |
| ECO16-N34 | PASS | Class X text re-read; footer-page mapping (pdf p.n = printed 37+n) holds. N35 slices 51+10+5+23+7+3+1=100. | none |
| ECO16-N35 | PASS | Class X text re-read; footer-page mapping (pdf p.n = printed 37+n) holds. N35 slices 51+10+5+23+7+3+1=100. | none |
| ECO16-N36 | PASS | Class X text re-read; footer-page mapping (pdf p.n = printed 37+n) holds. N35 slices 51+10+5+23+7+3+1=100. | none |
| ECO16-N37 | PASS | Text (p.49) says formal sector "still meets only about half of the total credit needs of the rural people"; Graph 1 (p.48) formal = 51+10+5 = 66%. Status CORRECTED fits. Caution: the text speaks of credit needs, the graph of the source split, so say "does not match its own graph", not "wrong". | Optional: soften note to "text and graph do not agree" when scripted. |
| ECO16-N38 | PASS | Graph 2 text p.49 gives 54% and 17% with no source or year; UNVERIFIED is right. | none |
| ECO16-N39 | PASS | Class X text re-read; footer-page mapping (pdf p.n = printed 37+n) holds. N35 slices 51+10+5+23+7+3+1=100. | none |
| ECO16-N40 | PASS | Box p.52: "over 9 million members in about 81,600 villages" (2018), Yunus 2006 Nobel Peace Prize; unverified at Grameen, status right. | none |
| ECO16-N41 | PASS | Class X text re-read; footer-page mapping (pdf p.n = printed 37+n) holds. N35 slices 51+10+5+23+7+3+1=100. | none |
| ECO16-N42 | PASS | Class X text re-read; footer-page mapping (pdf p.n = printed 37+n) holds. N35 slices 51+10+5+23+7+3+1=100. | none |
| ECO16-N43 | FIX | Definition of financial infrastructure is on printed p.194 (PDF p.2), not p.193. | Page cell changed to p.193-194 (applied). |
| ECO16-N44 | PASS | Grade 7 Part 2 text re-read; footer numbers = PDF page+192. Rs 1,060 / 1,123.60 / 2,012.20, 128 / 32,768 / "over 210 crore", Rs 200 at 2% and 5% = Rs 6, Jan Dhan 15 crore to 50 crore, UPI 2016 NPCI, Nepal 2022, helpline 1930 all as claimed. N48, N53 correctly UNVERIFIED. | none |
| ECO16-N45 | PASS | Grade 7 Part 2 text re-read; footer numbers = PDF page+192. Rs 1,060 / 1,123.60 / 2,012.20, 128 / 32,768 / "over 210 crore", Rs 200 at 2% and 5% = Rs 6, Jan Dhan 15 crore to 50 crore, UPI 2016 NPCI, Nepal 2022, helpline 1930 all as claimed. N48, N53 correctly UNVERIFIED. | none |
| ECO16-N46 | PASS | Grade 7 Part 2 text re-read; footer numbers = PDF page+192. Rs 1,060 / 1,123.60 / 2,012.20, 128 / 32,768 / "over 210 crore", Rs 200 at 2% and 5% = Rs 6, Jan Dhan 15 crore to 50 crore, UPI 2016 NPCI, Nepal 2022, helpline 1930 all as claimed. N48, N53 correctly UNVERIFIED. | none |
| ECO16-N47 | PASS | Grade 7 Part 2 text re-read; footer numbers = PDF page+192. Rs 1,060 / 1,123.60 / 2,012.20, 128 / 32,768 / "over 210 crore", Rs 200 at 2% and 5% = Rs 6, Jan Dhan 15 crore to 50 crore, UPI 2016 NPCI, Nepal 2022, helpline 1930 all as claimed. N48, N53 correctly UNVERIFIED. | none |
| ECO16-N48 | PASS | Grade 7 Part 2 text re-read; footer numbers = PDF page+192. Rs 1,060 / 1,123.60 / 2,012.20, 128 / 32,768 / "over 210 crore", Rs 200 at 2% and 5% = Rs 6, Jan Dhan 15 crore to 50 crore, UPI 2016 NPCI, Nepal 2022, helpline 1930 all as claimed. N48, N53 correctly UNVERIFIED. | none |
| ECO16-N49 | PASS | p.201 text matches. Caution: IFCI "funds power and textiles" is NCERT's statement only, not checked at IFCI; use only as "NCERT says". | none |
| ECO16-N50 | FIX | 1935 and 1949 sentence is on p.201, but the "printing and distributing banknotes / benchmark interest rates" box is on p.202 and says RBI "sets rules regarding" them (claim said "prints currency and fixes"). | Page and wording changed (applied). |
| ECO16-N51 | PASS | Grade 7 Part 2 text re-read; footer numbers = PDF page+192. Rs 1,060 / 1,123.60 / 2,012.20, 128 / 32,768 / "over 210 crore", Rs 200 at 2% and 5% = Rs 6, Jan Dhan 15 crore to 50 crore, UPI 2016 NPCI, Nepal 2022, helpline 1930 all as claimed. N48, N53 correctly UNVERIFIED. | none |
| ECO16-N52 | PASS | Grade 7 Part 2 text re-read; footer numbers = PDF page+192. Rs 1,060 / 1,123.60 / 2,012.20, 128 / 32,768 / "over 210 crore", Rs 200 at 2% and 5% = Rs 6, Jan Dhan 15 crore to 50 crore, UPI 2016 NPCI, Nepal 2022, helpline 1930 all as claimed. N48, N53 correctly UNVERIFIED. | none |
| ECO16-N53 | PASS | Grade 7 Part 2 text re-read; footer numbers = PDF page+192. Rs 1,060 / 1,123.60 / 2,012.20, 128 / 32,768 / "over 210 crore", Rs 200 at 2% and 5% = Rs 6, Jan Dhan 15 crore to 50 crore, UPI 2016 NPCI, Nepal 2022, helpline 1930 all as claimed. N48, N53 correctly UNVERIFIED. | none |
| ECO16-N54 | PASS | Grade 7 Part 2 text re-read; footer numbers = PDF page+192. Rs 1,060 / 1,123.60 / 2,012.20, 128 / 32,768 / "over 210 crore", Rs 200 at 2% and 5% = Rs 6, Jan Dhan 15 crore to 50 crore, UPI 2016 NPCI, Nepal 2022, helpline 1930 all as claimed. N48, N53 correctly UNVERIFIED. | none |
| ECO16-N55 | PASS | Part 1 Ch 11 p.243 (RBI sole issuer; digital money) and Part 2 Stock Market p.207-208 re-read (BSE 1875). | none |
| ECO16-N56 | PASS | Part 1 Ch 11 p.243 (RBI sole issuer; digital money) and Part 2 Stock Market p.207-208 re-read (BSE 1875). | none |
| ECO16-R01 | PASS | rbi_pub9795 para 2.6 quotes s.5(b) BR Act exactly as claimed; Act text itself blocked, stated. | none |
| ECO16-R02 | FIX | Para 4 is in Chapter IV and says banks keep a cash reserve "in India"; the balance "with the Reserve Bank" is para 6(a). | Page cell corrected (applied). |
| ECO16-R03 | PASS | Circular RBI/2025-26/46 dated 6 Jun 2025 para 2: 100 bps in four tranches to 3.0% of NDTL; 3.75/3.5/3.25/3.0 from fortnights beginning 6 Sep, 4 Oct, 1 Nov, 29 Nov. Current 3.00% confirmed in R05. | none |
| ECO16-R04 | PASS | Master Direction para 6(a): 4.50% to 13 Dec 2024, 4.25% from 14 Dec, 4.00% from 28 Dec 2024. | none |
| ECO16-R05 | PASS | rbi_home.txt Current Rates: CRR 3.00%, SLR 18.00%; site updated 3 Nov 2026. As-of present. | none |
| ECO16-R06 | FIX | Para 14 gives 18% of "net demand and time liabilities" (claim ok); para 13 ceiling 40% of "demand and time liabilities"; the asset list (cash, gold, approved securities) is para 17, not cited. | Page cell extended (applied). |
| ECO16-R07 | PASS | rbi_home.txt Current Rates: CRR 3.00%, SLR 18.00%; site updated 3 Nov 2026. As-of present. | none |
| ECO16-R08 | PASS | Handbook notes (15 Sep 2014) definitions of M0-M4 read; M0 shown as the components half of RBI's formula. RBI also defines NM aggregates; WSS shows M3. | none |
| ECO16-R09 | PASS | WSS Table 6 row 1.4 "Other deposits with Reserve Bank" 122,607; 122,607/32,281,302 = 0.38%. CORRECTED (NCERT omits this item) fits; it is a simplification not an error, which the note says. | none |
| ECO16-R10 | PASS | Reports page 293 line: WG (Reddy, June 1998) recommended M0, M1, M2, M3 on norms of progressive liquidity; 1961 and 1977 groups in pub 9455. | none |
| ECO16-R11 | PASS | FAQ: s.22 sole right to issue notes; s.26 legal tender and Central Government guarantee, subject to s.26(2) and "unless withdrawn from circulation"; coins Coinage Act 2011 s.6. Teach with that caveat. | none |
| ECO16-R12 | PASS | FAQ Q1: s.26, Bank liable to pay value on demand; clause denotes obligation towards the holder. | none |
| ECO16-R13 | PASS | DICGC guide and FAQ: Rs 5,00,000 principal+interest, same right and capacity, per bank separately, premium borne by the bank. Guide itself is undated; leaflet 2024-25 agrees. Living limit, as-of present. | none |
| ECO16-R14 | PASS | About Us: established 1 Apr 1935; fully Government-owned since 1949 nationalisation. | none |
| ECO16-R15 | PASS | Fed page: ratios cut to zero effective 26 Mar 2020, eliminating reserve requirements. | none |
| ECO16-R16 | PASS | Master Circular para 2.3.16(a) October 1996 withdrawal and CVC concern as claimed. | none |
| ECO16-R17 | FIX | WSS note says definition of fortnight changed "from alternate Fridays to 15th and last calendar day of a month" w.e.f. 15 Dec 2025; the claim's "1st-15th and 16th-last day" is an interpretation. | Wording changed to the note's own words (applied). |
| ECO16-I01 | PASS | WSS 21 Aug 2026 Table 6: M3 32,281,302 (31 Jul), 31,453,126 (31 Mar), +14.7% y-o-y; components 4,185,446 + 3,585,981 + 24,387,268 + 122,607 = 32,281,302. Bulletin Aug 2026 note 58 confirms 14.7%. As-of dated. | none |
| ECO16-I02 | PASS | WSS 21 Aug 2026 Table 6: M3 32,281,302 (31 Jul), 31,453,126 (31 Mar), +14.7% y-o-y; components 4,185,446 + 3,585,981 + 24,387,268 + 122,607 = 32,281,302. Bulletin Aug 2026 note 58 confirms 14.7%. As-of dated. | none |
| ECO16-I03 | PASS | Table 4: deposits 26,941,367 (+15.4%), bank credit 22,078,095 (+19.3%). | none |
| ECO16-I04 | PASS | Bulletin Aug 2026 note 57: 12.6% (adjusted for CRR first-round effect), currency 12.5%. | none |
| ECO16-I05 | PASS | Home page rates: savings 2.50%, term >1 yr 6.00-6.75%, MCLR 7.85-8.00%, base 8.40-10.00%, repo 5.50%. Rows carry no own date; the claim says so. | none |
| ECO16-I06 | PASS | PIB: 59.09 crore, Rs 3,16,514 crore, 55.7% women, 77.8% rural/semi-urban, as on 19 Aug 2026. | none |
| ECO16-I07 | PASS | Payment System Indicators June 2026: UPI 227,160.66 lakh / Rs 28,92,139 cr (June 2026), FY26 2,416,168.86 lakh / Rs 31,423,250 cr; RTGS 319.29 lakh / Rs 22,984,140 cr; CTS 425.55 lakh / Rs 607,843 cr; ATM 4,007.78 lakh / Rs 217,595 cr. Column order checked (FY, Jun 2025, May 2026, Jun 2026). | none |
| ECO16-I08 | PASS | Payment System Indicators June 2026: UPI 227,160.66 lakh / Rs 28,92,139 cr (June 2026), FY26 2,416,168.86 lakh / Rs 31,423,250 cr; RTGS 319.29 lakh / Rs 22,984,140 cr; CTS 425.55 lakh / Rs 607,843 cr; ATM 4,007.78 lakh / Rs 217,595 cr. Column order checked (FY, Jun 2025, May 2026, Jun 2026). | none |
| ECO16-I09 | PASS | Payment System Indicators June 2026: UPI 227,160.66 lakh / Rs 28,92,139 cr (June 2026), FY26 2,416,168.86 lakh / Rs 31,423,250 cr; RTGS 319.29 lakh / Rs 22,984,140 cr; CTS 425.55 lakh / Rs 607,843 cr; ATM 4,007.78 lakh / Rs 217,595 cr. Column order checked (FY, Jun 2025, May 2026, Jun 2026). | none |
| ECO16-I10 | PASS | MoSPI note and PIB: rural 66/34, urban 87/13, outstanding cash debt, NSS 77th round. Caution (S4): the PIB release repeats the MoSPI note, so it is not an independent second source; NCERT Graph 1 is the same data again. | none |
| ECO16-I11 | PASS | NABARD table: 144.22 lakh SHGs, Rs 65,089.15 crore savings, 77.41 lakh credit-linked at 31 Mar 2024. | none |
| ECO16-T01 | PASS | Summary p.14: "majority of money ... created by commercial banks making loans". Attributed to article authors; fine. | none |
| ECO16-T02 | FIX | Quote matches (summary p.14). The row put only the BoE side in the claim and the other side in the note, and did not say these are authors' views about the UK/euro area, that NCERT itself says a loan opens a deposit (N11), or that IGNOU calls reality a mix (T08). | Note rewritten with both sides and exact attribution (applied). Status CONFLICT is right. |
| ECO16-T03 | FIX | Text is in "Two misconceptions" printed p.15-16 (Overview is p.14 only). Content correct: reserves "multiplied up", constant ratio assumed, "not an accurate description". | Page cell corrected (applied). |
| ECO16-T04 | PASS | Summary p.14 as claimed. | none |
| ECO16-T05 | PASS | Bundesbank April 2017 opening summary as claimed; euro-area view. Fn 35 (p.24-25) on the money multiplier is the better citation if the multiplier point is used. | none |
| ECO16-T06 | PASS | Bundesbank April 2017 opening summary as claimed; euro-area view. Fn 35 (p.24-25) on the money multiplier is the better citation if the multiplier point is used. | none |
| ECO16-T07 | PASS | IGNOU Unit 13: M=C+D, H=C+R, m=(cdr+1)/(cdr+rr); cdr=0 gives 1/rr (our algebra, correctly labelled). | none |
| ECO16-T08 | PASS | IGNOU 13.3 exogenous vs endogenous; "convex combination" of the two. Note IGNOU's endogenous money works "through the money multiplier process", unlike the BoE meaning. | none |
| ECO16-T09 | FIX | 35% fall (Mar 1930-Mar 1933) and base +20% match. IGNOU gives the two reasons (cdr up, excess reserves) in its own voice; it credits Friedman and Schwartz only with arguing that the fall in money was a major factor in the Depression. | Wording changed to separate the two (applied). |
| ECO16-T10 | PASS | Fisher 1911 preface: five factors and "equation of exchange". Fisher hedges "if the principles here advocated are correct"; keep when quoting. | none |
| ECO16-T11 | PASS | IGNOU 18.4: MV=PT, T fixed at full employment, V long-term constant. | none |
| ECO16-T12 | PASS | IGNOU Unit 5 5.4.2: Marshall, Pigou, Robertson, Keynes; Cambridge k reciprocal of velocity. | none |
| ECO16-T13 | PASS | Pigou 1950: "we may call, if we like, the Marshallian liquidity preference function"; inverse of income velocity. | none |
| ECO16-T14 | PASS | Keynes ch13 three divisions; ch15 income-motive and business-motive. Web transcription only, as disclosed. | none |
| ECO16-T15 | PASS | IGNOU 18.6-18.7: five asset forms, permanent income, no Keynesian motives, v relatively stable. | none |
| ECO16-P01 | PASS | UPSC notice 05/2026 dated 04.02.2026, Economics Paper I, 3(a); text is on PDF p.61 (60 page breaks before). Syllabus line also carries "Goals and Instruments of Monetary Management..., Relation between the Central Bank and the Treasury, Proposal for ceiling on growth rate of money", which is not in this episode's claim or checklist (check it is mapped to ECO-14/15). | none |
| ECO16-P02 | PASS | Viewed the page image: Q.52 on p.23-A, Statement I and II as claimed. | none |
| ECO16-P03 | PASS | BIS Dec 2004 summary: more efficient sharing of risk. BIS Mar 2022: credit lines 41%/term loans 48% non-bank, 50%/40% banks. | none |
| ECO16-P04 | PASS | BIS Dec 2004 summary: more efficient sharing of risk. BIS Mar 2022: credit lines 41%/term loans 48% non-bank, 50%/40% banks. | none |
| ECO16-P05 | PASS | UNVERIFIED is right: option (c) is inference only; official key not read. | none |
| ECO16-S01 | PASS | Nobel press release (2 equal parts, "from below") and 2006 speech "over 95 per cent ... women". | none |
| ECO16-S02 | PASS | Nobel press release (2 equal parts, "from below") and 2006 speech "over 95 per cent ... women". | none |
| ECO16-A01 | PASS | 1000x1.06^12 = 2012.196; 2^31 = 2,147,483,648 (214.7 crore); sum of 32 squares 429.5 crore. | none |
| ECO16-A02 | PASS | 1000x1.06^12 = 2012.196; 2^31 = 2,147,483,648 (214.7 crore); sum of 32 squares 429.5 crore. | none |
| ECO16-A03 | FIX | Arithmetic right (109.297 and 107.334) but the claim called NCERT's 109.29 "rounded"; it is truncated. | Wording corrected (applied). |
| ECO16-A04 | PASS | NCERT App. 3.1 p.51: "a = 1 and r = 0.4 ... 1/(1-0.4) = 5/3". Redone: lending rounds 100, 80, 64 have ratio 0.8; 1/(1-0.8) = 5; 100/(1-0.8) = 500. NCERT is wrong for its own 20% example. CORRECTED right. | none |
| ECO16-A05 | PASS | NCERT p.42: "in the previous case, Rs 100 in reserves could support deposits of Rs 400. ... loan Rs 300 only". Redone: 20% case gives deposits 500, loans 400; 25% gives multiplier 4, deposits 400, loans 300. The Rs 400 should be Rs 500. CORRECTED right. | none |
| ECO16-A06 | PASS | 1/0.03 = 33.3; caveat correct. | none |
| ECO16-A07 | PASS | Table 3.4 M3 27,286,589 / (3,724,448+113,307+991,488 = 4,829,243) = 5.650; cash-in-banks misprint 9396 (3,724,448-3,630,751 = 93,697) confirmed. UNVERIFIED right. | none |
| ECO16-A08 | PASS | 4,185,446/32,281,302 = 12.97% (13.0%); cdr 4,185,446/27,973,249 = 0.1496; credit/deposit 22,078,095/26,941,367 = 81.95% (rounds to 81.9 or 82.0; write "about 82%"). | none |
| ECO16-A09 | PASS | 4,185,446/32,281,302 = 12.97% (13.0%); cdr 4,185,446/27,973,249 = 0.1496; credit/deposit 22,078,095/26,941,367 = 81.95% (rounds to 81.9 or 82.0; write "about 82%"). | none |
| ECO16-A10 | PASS | UPI 28,92,139 cr / 227,160.66 lakh = Rs 1,273; RTGS = Rs 71.99 lakh; 227,160.66/425.55 = 533.8 (about 534). | none |
| ECO16-A11 | PASS | Rs 10 - Rs 4 = Rs 6. | none |
| ECO16-U01 | PASS | Open items, correctly BLOCKED/UNVERIFIED; nothing may go on screen from them. | none |
| ECO16-U02 | PASS | Open items, correctly BLOCKED/UNVERIFIED; nothing may go on screen from them. | none |
| ECO16-U03 | PASS | Open items, correctly BLOCKED/UNVERIFIED; nothing may go on screen from them. | none |
| ECO16-U04 | PASS | Open items, correctly BLOCKED/UNVERIFIED; nothing may go on screen from them. | none |
| ECO16-U05 | PASS | Open items, correctly BLOCKED/UNVERIFIED; nothing may go on screen from them. | none |
| ECO16-U06 | PASS | Open items, correctly BLOCKED/UNVERIFIED; nothing may go on screen from them. | none |
| ECO16-U07 | PASS | Open items, correctly BLOCKED/UNVERIFIED; nothing may go on screen from them. | none |

## Changes made to claims.csv (9 rows, only page/wording/note; no status changed)
1. N43 page: "printed p.193" to "p.193-194 (definition on p.194)".
2. N50 claim: "prints currency and fixes the benchmark interest rate" to "on the next page, sets the rules for printing and distributing banknotes and for fixing the benchmark interest rate"; page to p.201-202.
3. R02 page: "Chapter II, para 4" to "Chapter IV, para 4 (balance kept with RBI: para 6(a))".
4. R06 page: added para 17 for eligible assets and that para 14 says net demand and time liabilities.
5. R17 claim: fortnight wording changed to the RBI note's "15th and the last calendar day of a month".
6. T02 note: rewritten to state both sides fairly with exact attribution (CONFLICT status kept).
7. T03 page: "p.14-15" to "Overview and Two misconceptions, printed p.15-16".
8. T09 claim: separated IGNOU's own two reasons from the Friedman and Schwartz credit (they are credited only with "the fall in money was a major factor in the Depression").
9. A03 claim: NCERT's 109.29 is truncated (exact 109.297), not rounded.

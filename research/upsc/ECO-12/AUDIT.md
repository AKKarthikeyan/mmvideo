# ECO-12 Tax incidence, direct and indirect taxes, GST: independent audit of claims.csv (gate S5), 11 Nov 2026

**Method.** All 103 rows were reopened against the saved local file (pdftotext; NCERT printed pages mapped from the margin numbers: Class XII leec105 printed = PDF page + 65, IGNOU Unit 10 printed = PDF page + 154, Budget at a Glance printed page read from the page) or the publisher page. Value, holder and capacity, date, strength and whether a line is our own inference were compared. The Budget tables were re-added, the GST portal's monthly data for 31/03/2026 was fetched once, and the GST Council website was read once for the commencement dates. Nothing behind a bot check was touched.

**Result.** PASS 83, FIX 17, FAIL 1, FLAGGED 2 (total 103). FAIL: E12-J06. Every FIX was a clear-cut correction and is applied in `claims.csv` (19 rows carry '[Audit 11 Nov 2026]': the 18 FIX/FAIL rows plus C02, whose note was upgraded). Status counts after edits: CONFIRMED 91, CORRECTED 8, CONFLICT 2, UNVERIFIED 1, NOT FOUND 1. Backup of the original: scratchpad `eco12.claims.orig.csv`.

## Answers to the points asked

- **GST rates today.** The 56th Council (3 Sep 2025) recommended Standard 18%, Merit 5%, de-merit 40%; services and goods (except pan masala, gutkha, cigarettes, chewing tobacco, unmanufactured tobacco, bidi) from 22 Sep 2025 (H01, H02). Tobacco and pan masala moved to 40% (bidi 18%) from 1 Feb 2026 (H05). The 57th (8 Oct 2026) did not change the structure (H07 fixed). Special low rates (gold, diamonds) are not in any saved source: unverified.
- **Budget 2026-27.** All receipts and expenditure figures re-added and match (F05, F07, F08, B07). GST (CGST) Rs 10,19,020 crore is 23.1% of gross tax revenue Rs 44,04,086 crore. The paise-in-the-rupee shares are of receipts that include States' share (F09 note was wrong, fixed).
- **Cess.** Budget GST line carries compensation cess of Rs 88,000 crore in 2025-26 RE and none in 2026-27 (F07). The PIB 2025-26 gross GST of Rs 22.27 lakh crore is WITHOUT cess (GST portal: Rs 22,27,096 crore); PIB's 2024-25 Rs 22.08 lakh crore seems to include cess, so the two are not like-for-like (F06 fixed).
- **101st Amendment.** Assent 8 Sep 2016. Footnotes in the Constitution: Art 279A w.e.f. 12 Sep 2016, everything else 16 Sep 2016; the GST Council website agrees. The S.O. notifications were not opened (C02 stands, note upgraded).
- **Art 279A voting.** (7), (9) read; arithmetic is ours and correct (D01).
- **Mohit Minerals.** Holding para 148(i) correct, pages correct. 'Accommodative federalism' is not in the judgment (0 hits). The Union's argument was 'impasse', not 'disorder' (D05 fixed).
- **Compensation Act.** ss.2, 3, 4, 5, 6, 7, 8, 10 and the 2018 s.10(3A) all match (G01-G07).
- **1 Feb 2026 cess withdrawal.** Notification 03/2025-Compensation Cess (Rate), 31.12.2025, with rates in 19/2025-Central Tax (Rate), same date (G16).
- **NCERT.** Page cites fixed for A08 and A09 (IGNOU, was off by about 23 pages). The CORRECTED Box 5.3 row (H06) is right: printed p.83 prints the six old rates.
- **CONFLICT rows.** A10 (NCERT vs IGNOU on why indirect taxes are regressive) and F03 (octroi wording of three CBIC pages vs the Compensation Act): each side read correctly and named.

## Verdict per row

| claim_id | verdict | evidence |
|---|---|---|
| E12-A01 | PASS | NCERT iest205 PDF p.12 = printed p.118: taxes as compulsory payments for public services. IGNOU Unit 13 s.13.2 'compulsory contribution' read. |
| E12-A02 | PASS | p.118 direct (income/profits) vs indirect (added to price, GST); IGNOU Unit 10 s.10.2 p.156 (PDF p.2; offset 154). |
| E12-A03 | PASS | IGNOU Unit 10 p.156: impact and incidence same unit for direct; shifting depends on elasticity; distinction blurs. Unit 13 p.2 shifting sentence read. Paraphrase labelled. |
| E12-A04 | PASS | Unit 10 s.10.5.3 p.164: 'entire increase in price may not be passed on', smaller fall in demand, smaller price rise. Fig 10.2 is on the next page. |
| E12-A05 | PASS | CGST Act s.9(1) (PDF p.25): 'shall be paid by the taxable person'. FAQ Q1 'burden ... borne by the final consumer' read. |
| E12-A06 | PASS | FAQ Q1 (PDF p.5) destination-based, credit at each stage, burden on final consumer. NCERT Box 5.3 p.82 read. Inference labelled. |
| E12-A07 | PASS | NCERT leec105 PDF p.3 = printed p.68 (PDF page + 65): direct/indirect lists, 'paper taxes'; footnote 1 (GST from 1 July 2017) on same page. NCERT itself adds 'now abolished' for wealth/gift/estate. |
| E12-A08 | FIX | All of it is on printed p.68, not pp.68-69. Content matches. Page cite fixed. |
| E12-A09 | FIX | IGNOU Block 7 s.22.5 definitions match, but the page cite 'p.~342+' was wrong: section is on printed pp.365-366 (PDF pp.25-26). Heading prints '(C) Progressive' by mistake. Cite fixed. |
| E12-A10 | FIX | CONFLICT kept; both sides read correctly: NCERT p.80 (PDF p.15) 'regressive in nature ... impact all income groups equally'; IGNOU Unit 10 p.156 'regressive ... may increase inequalities'. 'Standard reason' was unsourced; IGNOU gives the share-of-income reason on excise at p.161. Claim reworded, source added. |
| E12-A11 | PASS | Grade 9 p.118: progressive, exempt below a limit; slab table on p.119 (PDF p.13), Nil to 4 lakh ... 30% above 24 lakh. |
| E12-B01 | PASS | Constitution Art 112(1) PDF p.82 = printed p.51 (continues p.52). |
| E12-B02 | PASS | Art 265 text read (PDF p.183): 'No tax shall be levied or collected except by authority of law'. |
| E12-B03 | PASS | NCERT s.5.1.1 starts PDF p.2 = printed p.67; stabilisation ends p.68. Matches. |
| E12-B04 | PASS | s.5.1.2 pp.68-69: revenue receipts do not create a claim; tax/non-tax; capital receipts; non-tax items incl. grants. |
| E12-B05 | PASS | s.5.1.3 starts printed p.69 (PDF p.4); definitions match. |
| E12-B06 | PASS | Printed p.70 (PDF p.5): implicit/explicit subsidies; 2.02% (2014-15) and 1.2% (2022-23 BE) read; book's own figures, dated. |
| E12-B07 | FIX | Fertiliser 1,70,781; food 2,27,629; petroleum 12,085; total 53,47,315 all match the Expenditure table (BE 2026-27). Sum 4,10,495 = 7.68% (ours). Page was printed p.11 (PDF p.15), not p.12. |
| E12-B08 | FIX | Chart 'Major Subsidies, 6' read. 6 paise is of gross outlay incl. States' share (note 1), unlike the 7.7% of B07. Note added. |
| E12-B09 | PASS | Box 5.1 starts PDF p.7 = printed p.72; fiscal policy, taxes and expenditure. |
| E12-C01 | PASS | 101st Act gazette: assent 8 Sep 2016. NCERT Box 5.3 p.83 agrees (prints '101th'). |
| E12-C02 | PASS | Constitution footnotes: s.12 (Art 279A) w.e.f. 12-9-2016; ss.2,3,5-11,13-17 w.e.f. 16-9-2016, incl. Seventh Schedule edits. GST Council site confirms 12 Sep (notified 10 Sep) and 16 Sep. Notifications not opened; note updated. |
| E12-C03 | PASS | Act s.2: Art 246A(1),(2) 'exclusive power' for inter-State. Matches. |
| E12-C04 | PASS | Act s.9: Art 269A(1) with import explanation, (2) not part of Consolidated Fund. |
| E12-C05 | PASS | Act s.10: Art 270(1A),(1B). Matches. |
| E12-C06 | PASS | Act s.12: 279A(2),(3) composition and Vice-Chairperson. |
| E12-C07 | PASS | 279A(4)(a)-(h) match; 11 States counted. |
| E12-C08 | PASS | 279A(5) five petroleum goods, date by Council. |
| E12-C09 | PASS | 279A(6) 'harmonised structure ... harmonised national market'. NCERT p.83 'common market'. |
| E12-C10 | PASS | 279A(11) dispute mechanism (a)-(c). |
| E12-C11 | PASS | Act s.14: 366(12A), (26A), (26B). Matches. |
| E12-C12 | PASS | Act s.13: Art 286 (i),(ii) and (iii) clause (3) omitted. |
| E12-C13 | PASS | Act ss.6,7: 268 words omitted; 268A omitted. |
| E12-C14 | PASS | Act s.17: entry 84 (six goods), 92 and 92C omitted; State entries 52, 55 omitted; 54 and 62 substituted. Footnotes agree. |
| E12-C15 | PASS | Act s.16: Sixth Schedule para 8(3)(e). |
| E12-C16 | PASS | Act s.15: '279A' added to the proviso to 368(2)(a). Reading labelled ours. |
| E12-C17 | PASS | Act s.18: compensation for five years. |
| E12-C18 | PASS | Act s.19: continue until amended/repealed or one year, whichever is earlier. |
| E12-C19 | PASS | NCERT Box 5.3 p.83: biggest tax reform, midnight session 30 June/1 July 2017. PIB 30 Jun 2026: launch 1 July 2017. |
| E12-D01 | PASS | Art 279A(7),(9): quorum one-half; three-fourths of weighted votes present and voting; Centre one-third, States two-thirds of votes cast. Arithmetic labelled ours and correct (1/3 > 1/4 blocks; 2/3 < 3/4). |
| E12-D02 | PASS | Mohit Minerals (CA 1390/2022, 19 May 2022) para 148(i), printed pp.150-151: recommendations 'not binding' and 'persuasive'. Three signatures; single judgment. |
| E12-D03 | PASS | 148(i)(a): deletion of Art 279B and inclusion of '279(1)' (the Court's own typographical wording, noted), cooperative federalism; (b): no non-obstante clause, 246A not subject to 279A, simultaneous power, 'binding edicts would disrupt fiscal federalism'. |
| E12-D04 | PASS | 148(i)(c): rule-making bound by recommendations; not all binding on primary legislation. |
| E12-D05 | FIX | Union's argument was an 'impasse' (paras 45-46, printed pp.77-78), not 'disorder' (word not in the judgment). Reworded; pages added. Court rejects it at 148(i). |
| E12-D06 | PASS | 148(i)(b), printed p.151: 'dialogue between cooperative and uncooperative federalism ... collaboration to contestation'; 'equal power to legislate'. 'Accommodative federalism' appears nowhere in the judgment (0 hits); note stands. |
| E12-D07 | PASS | 148(ii)-(v), 149 (printed pp.151-153): CIF import, composite supply, s.5(4) deeming by delegated legislation; appeals dismissed. |
| E12-D08 | PASS | PIB 30 Jun 2026: 'Building co-operative federalism' paragraph; GSTN '50% Centre: 50% State'. |
| E12-E01 | PASS | Box 5.3 p.82: single comprehensive indirect tax, from 1 July 2017, destination based, ITC. FAQ Q1-Q2. |
| E12-E02 | PASS | Box 5.3 pp.82-83: cascading and value addition. Flyer p.1. |
| E12-E03 | PASS | Flyer: inputs Rs 10 with Rs 1 excise at 10%, pen Rs 20 with Rs 2, price Rs 22, VAT on Rs 22. No VAT rate in flyer. |
| E12-E04 | PASS | PIB Dual GST paragraph (CGST/SGST, IGST, 'generally 2x'); UTGST and import-as-inter-State come from the flyer list (a)-(d); IGST sharing from CBIC About GST. Combined, each part sourced. |
| E12-E05 | FIX | Flyer table matches s.49(5), but the claim omitted s.49A/49B and the provisos (IGST credit first; SGST credit to IGST only if CGST balance unavailable). Completed. |
| E12-E06 | PASS | CGST s.9(1): 'not exceeding twenty per cent', alcohol excluded. Matches. |
| E12-E07 | PASS | FAQ Q5: alcohol by definition, five petroleum goods temporarily, electricity out. PIB 2026: '5 goods ... as and when approved'. NCERT tobacco GST plus excise (p.83). |
| E12-E08 | FIX | 66.5 lakh, 1.65 crore (May 2026), Rs 20 to 40 lakh (Apr 2019), Rs 75 lakh to 1.5 crore match the Nine Years release. The 1.51 crore second figure is in PIB 4 Sep 2025, not the 56th press release. Second source fixed. |
| E12-E09 | FIX | FAQ Q2 gives the destination principle only; the Tamil Nadu to Kerala example is on the About GST page. Attribution fixed. |
| E12-E10 | PASS | FAQ Q13: cascading, common national market, burden on goods 'currently estimated at 25%-30%' (the burden, not the saving). NCERT 2% GDP p.83 read. |
| E12-F01 | PASS | FAQ Q3 central list a-h (7 taxes + cesses/surcharges); About GST page agrees. |
| E12-F02 | PASS | FAQ Q3 State list a-i; NCERT p.83 adds octroi. |
| E12-F03 | PASS | CONFLICT kept; each side read: About GST 'Entry tax not in lieu of Octroi'; FAQ Q3 'Entry tax (all forms)'; flyer 'Octroi and Entry Tax (all forms)'. Compensation Act s.5(1)(c) names entry tax, octroi, local body tax under old entry 52. Use the Act. |
| E12-F04 | PASS | PIB 30 Jun 2026: 17 taxes and 13 cesses. Single publisher, flagged. |
| E12-F05 | PASS | Budget at a Glance Receipts (PDF p.10, printed p.6): Customs 2,71,200; Union Excise 3,88,910 (BE 2026-27). |
| E12-F06 | FIX | Figures match PIB Nine Years. Cess status checked at GST portal (31/03/2026): 2025-26 gross Rs 22,27,096 crore is WITHOUT cess; PIB's 2024-25 Rs 22.08 lakh crore appears to include cess, so not like-for-like. Claim now says 'without cess'. |
| E12-F07 | FIX | GST line 10,19,020 (CGST only), gross tax 44,04,086 = 23.1%, RE 2025-26 cess 88,000 inside GST line: all match. Receipt Budget cite fixed (item 8, not 'section 9'); ex-cess status of 22.27 added. |
| E12-F08 | PASS | Recomputed: direct 12,31,000 + 14,66,000 = 26,97,000 / 44,04,086 = 61.2%; 10,19,020 + 2,71,200 + 3,88,910 = 16,79,130 = 38.1%. Other taxes 17,700 and UT 10,256 omitted as stated. |
| E12-F09 | FIX | Paise values read (GST and other taxes 15, income tax 21, corporation tax 18, excise 6, customs 4, borrowings 24) and reconcile with the tables. The note was wrong: chart note 1 says receipts INCLUDE the States' share. Note fixed. |
| E12-F10 | FIX | 41% retained and accepted (paras 3-4); Rs 15,26,255 crore matches the table. Note wrongly said the period is not stated: para 2 gives 2026-27 to 2030-31. Fixed. |
| E12-G01 | PASS | Compensation Act long title and s.7(1); 101st Act s.18. |
| E12-G02 | PASS | Act s.3: fourteen per cent per annum. |
| E12-G03 | PASS | Act s.4 (base year ending 31 Mar 2016), s.5(1)(a)-(g), proviso (petroleum, alcohol out), s.5(5) CAG. |
| E12-G04 | PASS | Act s.6 illustration 100(1+14/100)^3 for 2018-19; s.7(2)-(4) bi-monthly provisional, final after CAG. DoE paper background agrees. |
| E12-G05 | PASS | Act s.2(1)(q),(r) transition date and five years; s.8(1) 'five years or such period as may be prescribed'. 30 Jun 2022 labelled ours. |
| E12-G06 | PASS | Act s.8(2) caps; s.10(1) non-lapsable Fund in the Public Account; s.10(2); s.10(3) 50:50. BaG footnote 5 (PDF p.15) read. |
| E12-G07 | PASS | Amendment Act 2018 s.3 inserts s.10(3A) (50% to Centre, 50% to States by base-year revenue); s.2 renames CBEC to CBIC. |
| E12-G08 | PASS | DoE paper Annex 1 para 3: 1,65,302 released vs 95,444 collected (2019-20); table 62,612; 95,081; part-year 1,20,498 explained. |
| E12-G09 | PASS | Annex 1 para 5 (41st meeting, 27 Aug 2020, shortfall 3 lakh crore) and Annex 2 AG opinion. The AG opinion itself not read; labelled. |
| E12-G10 | PASS | Option 1 items I-IV, VI, X match; second source PIB 20 Sep 2020 quotes the same text. |
| E12-G11 | PASS | Option 2: 2,35,000 crore, interest by States, principal from cess after transition. |
| E12-G12 | PASS | PIB 7 Dec 2021: Rs 1.1 lakh crore (2020-21), Rs 1.59 lakh crore (2021-22) back-to-back. Receipt Budget Annex 1 row 1.01(c): 1,10,208 and 1,59,000; asset statement 2,69,208. |
| E12-G13 | FIX | Amounts 78,104; 1,23,604; 67,500 match (total 2,69,208). Cite fixed: repayments are in the borrowings text (PDF p.23), balances in the Statement of Assets (PDF p.63, nil at end 2025-26 RE); labels 'RE 2024-25' and 'BE 2025-26' noted. |
| E12-G14 | PASS | Period of Levy and Collection of Cess Rules, 2022 (issued 24 Jun 2022): in force 1 Jul 2022; cess up to 31 Mar 2026. PIB 7 Dec 2021 commitment read. |
| E12-G15 | PASS | PIB 7 Dec 2021: 'for 5 years as per the Constitutional provision', cess extended beyond 5 years. 30 Jun 2022 labelled ours. |
| E12-G16 | FIX | Council newsletter Dec 2025: 19/2025-Central Tax (Rate) and 03/2025-Compensation Cess (Rate), both dated 31.12.2025, from 1 Feb 2026 (not Central Tax 19/2025, which is Rule 31D RSP). 56th release para (c) read. Note updated; no source says loans repaid. |
| E12-G17 | PASS | Receipt Budget item 9.03: Health Security se National Security Cess Act, 2025; 2,330 (RE 2025-26) and 14,000 (BE 2026-27). Matches Other Taxes 17,700. |
| E12-H01 | PASS | 56th release 3 Sep 2025: 4-tier to Standard 18%, Merit 5%, de-merit 40%. Special low rates (e.g. gold, diamonds) not in saved sources; not verified. |
| E12-H02 | PASS | 56th release part III (a),(b): services and goods except pan masala, gutkha, cigarettes, chewing tobacco, unmanufactured tobacco, bidi from 22 Sep 2025. PIB 2026 agrees. |
| E12-H03 | PASS | Opening bullets: breads/UHT milk/paneer Nil; hair oil, soap, shampoo, toothpaste, bicycles 5%; AC, TVs, small cars, motorcycles up to 350 cc, cement 28% to 18%; individual life and health insurance exempt. |
| E12-H04 | PASS | PIB 30 Jun 2026: 40% list as claimed. |
| E12-H05 | PASS | Newsletter Dec 2025 p.1/3: bidi 18% (9%+9%), pan masala/tobacco/nicotine inhalation 40%, RSP valuation, cess nil, from 1 Feb 2026. |
| E12-H06 | PASS | CORRECTED kept. NCERT Box 5.3 printed p.83: 'six standard rates 0%, 3%, 5%, 12%, 18% and 28%'. Now 5/18/40 (H01). Not reworded. |
| E12-H07 | FIX | Dates, penalty 25,000 to 10,000 (7.3) and prosecution 1 to 5 crore (11.2) match. 'No rate cut' too strong: item-level steps (psyllium Nil, 5% EV transport and delivery, TDS 2% on scrap). Value fixed. |
| E12-J01 | PASS | Seventh Schedule: List I entry 82; List II entry 46. |
| E12-J02 | PASS | Income-tax Act 2025 s.2(5)(a)-(d) read; commencement s.1(3) 1 Apr 2026; assent 21 Aug 2025. |
| E12-J03 | PASS | Schedule II Sl.1 'Agricultural income. Nil.' |
| E12-J04 | PASS | s.2(22)(iii)(A),(B) and table: 10,000 population; 2, 6, 8 km. |
| E12-J05 | FLAGGED | UNVERIFIED kept: our reading of s.2(5); no ruling or answer key read. |
| E12-J06 | FAIL | 'Part IV-B of the First Schedule' not in the 2025 Act text. Only s.405(2) (advance tax) mentions net agricultural income. Claim, value, status corrected. |
| E12-J07 | FLAGGED | NOT FOUND kept: no primary source on a State actually taxing agricultural income; sansad PDF not reached. |
| E12-K01 | PASS | NCERT Box 5.3 p.83 and PIB 2026. |
| E12-K02 | FIX | Table and rates match p.104 (PDF p.15). NCERT prints 0.966 for 338/3500 (slip, correct is 0.0966); 9.66% right. Note added. |
| E12-K03 | PASS | NCERT XI keec103 printed p.42: 2016 amendment, 'one nation, one tax and one market'. |
| E12-K04 | PASS | NCERT Box 5.3 title vs 279A(6) 'harmonised national market'. |
| E12-K05 | PASS | CGST s.9(1) payer; FAQ Q1 burden. |

## Changes made to claims.csv

FIX/FAIL rows (field: change). A08 page; A09 page; A10 claim, second_source; B07 page; B08 note; D05 claim, page, status CORRECTED; E05 claim, page, status CORRECTED; E08 second source and URL, status CORRECTED; E09 claim, page, status CORRECTED; F06 claim ('without cess'), note, status CORRECTED; F07 second_source cite, note; F09 note; F10 note; G13 page, note; G16 note; H07 value, note, status CORRECTED; J06 claim, value, page, status CORRECTED; K02 note. C02: note only (PASS).

## Open items

1. C02: the two commencement notifications (S.O. numbers, Gazette) were not opened; the Constitution's footnotes and the Council website agree on 12 and 16 Sep 2016.
2. H01/H06: special low GST rates (gold, diamonds and similar) after 22 Sep 2025 not in any saved source.
3. F06: 7.4 (2017-18) and 13.76 (2021-22) lakh crore not checked at the GST portal; ex-cess status known only for 2025-26 and 2024-25.
4. G09: the Attorney General's opinion itself not read (Department of Expenditure's account only).
5. J02, J04, J06: the Income-tax Act, 1961 text (the Act the UPSC question names) was not opened; 'unchanged' must not be said. J05 and J07 stay open.
6. D01, C10: whether the Art 279A(11) dispute mechanism exists in practice is not checked.

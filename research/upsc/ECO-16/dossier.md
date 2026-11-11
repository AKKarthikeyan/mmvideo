# ECO-16 dossier: How banks create money

Research only. Read 3 Nov 2026 (copies from ECO-15 read 2 Nov 2026 are marked in `claims.csv`). Claim ids (`ECO16-N01` ...) are in `claims.csv`; depth items (`ECO16-K01` ...) in `checklist.csv`; NCERT pages and the heading check in `ncert_map.md`; every search in `search_log.md`. No script, no analogies here.

**Counts.** 124 claim rows: **106 CONFIRMED, 4 CORRECTED, 1 CONFLICT, 9 UNVERIFIED, 4 BLOCKED** (`ECO16-N` NCERT 56, `R` rules and law 17, `I` India today 11, `T` theory and debate 15, `P` syllabus and past paper 5, `S` stories 2, `A` our arithmetic 11, `U` not found 7). "CONFIRMED" on an NCERT row means NCERT says it, not that the world agrees; where NCERT is dated or wrong a separate CORRECTED row carries the right position.

## A1. What the topic is, why it matters, and the order to meet the ideas

**The one question:** when a bank gives you a loan, where does the money come from, and what stops it giving more? The viewer's own life: a salary that arrives as a message on the phone (a bank deposit, which counts as money, N31), a home loan, a UPI payment at a fruit cart (N55). Three facts frame it: only about **13%** of India's broad money (M3) is notes and coins, about **87%** is bank deposits (A08, 31 Jul 2026); banks hold reserves with RBI as a **3.00%** share of deposits (R05); and a loan, when made, opens a new deposit in the borrower's name (N11).

Order a learner must meet things in (parts in brackets, see A6):
1. **Money and what it does:** barter's double coincidence of wants; medium of exchange, unit of account, store of value; purchasing power falls when prices rise (N01-N03) [Part 1].
2. **Demand for money:** more with income, less when interest rates are high (N05); Keynes's three motives, liquidity preference, liquidity trap (N20-N22, T14); the Cambridge and quantity-theory forms (T10-T13) [Part 1].
3. **Supply of money:** RBI makes notes, Government makes coins (N23, R11); bank deposits are money (N30, N31); fiat money and legal tender (N24); M1 to M4 (N25, R08); today's numbers (I01-I02) [Part 1].
4. **The banker's secret:** the goldsmith story (N09, a made-up story), banks lend because not everyone withdraws at once (N10), a loan opens a deposit (N11), the balance sheet (N12-N13) [Part 2].
5. **What limits it:** reserves, the CRR and SLR (N14, R02-R07); the 100-to-500 rounds and multiplier 5 (N15-N16, A04); the real multiplier with currency (T07); RBI changing the ratio (N17-N19) [Part 2].
6. **Does the textbook picture hold?** Bank of England and Bundesbank staff say lending comes first and reserves do not bind; IGNOU and NCERT teach the multiplier process (T01-T09) [Part 2].
7. **Credit in daily life:** credit helps or traps (N33), terms of credit (N34), formal and informal credit (N35-N38, I10), self-help groups (N39, I11), the safety net (R13, R12) [Part 3].
8. **How the money moves:** cash, cheque, debit card, net banking, UPI (N51-N52); June 2026 numbers (I07-I09, A10); syndicated lending and the 2024 past paper (P02-P05) [Part 3].

## A2. Hard parts and common misconceptions, each with the correct position

| Misconception | Correct position | Claims |
|---|---|---|
| "The bank lends out my deposit, so my money is gone from my account." | A loan opens a **new** deposit; your own balance stays. Money supply rises by the new deposit (NCERT). Central-bank staff add that banks do not first collect deposits then lend (Bank of England 2014; Bundesbank 2017) | N11, T02, T05 |
| "RBI prints notes for every loan." | Notes are RBI's liability; most money is deposits (cash 13%). RBI affects lending mainly through its policy rate and reserve rules | R11, A08, T04 |
| "NCERT's multiplier of 5 is how it works today." | The 20% reserve ratio is a made-up example. CRR is **3.00%** (not 20%); the naive 1/0.03 = 33 would be a toy ceiling. NCERT's own printed tables imply about 5.65 (unverified) | N15, R05, A06, A07 |
| "The CRR is the only limit on lending." | SLR (at least 18% of NDTL in liquid assets), profit, regulation and the demand for loans also limit it (Bundesbank). Cash held by the public leaks out of the multiplier | R06, T05, T07 |
| "Reserves are cash in the vault." | NCERT: reserves are cash plus deposits with RBI. CRR is kept with RBI as a share of NDTL | N12, R02 |
| "Money supply is the number of notes." | M3 = M1 + time deposits; deposits make up about 87% | N25, I02, A08 |
| "A cheque is money like a note." | Notes and coins are legal tender and cannot be refused; a cheque can be refused, though the deposit behind it is money | N24 |
| "Banks hold about 5% cash" (Class X) | Dated. CRR is 3.00% now, plus an SLR of 18% | N32, R05, R07 |
| "The formal sector meets only about half of rural credit" (Class X text) | NCERT's own graph says 66%; MoSPI's survey says 66% institutional, 34% informal (rural, debt as on 30 Jun 2018) | N37, I10 |
| NCERT arithmetic slips | Appendix 3.1 uses r = 0.4 (should be 0.8); the 25% example calls the previous case Rs 400 (it was Rs 500) | A04, A05 |
| "Can a syndicated loan be a credit line?" (Prelims 2024 Q.52) | Yes: syndicated loans come as term loans and credit lines, and syndication spreads risk across lenders. Answer (c) by our reasoning; UPSC's key not read | P02-P05 |

## A3. Debates: who holds which view (name them on screen)

| Question | View A | View B |
|---|---|---|
| How do banks create money? | **Multiplier view:** the central bank supplies reserves, banks lend a fraction and re-lend, money = reserves x 1/reserve ratio. Taught in NCERT Class XII 3.3.2 and IGNOU Unit 13 (N15-N16, T07) | **Credit-creation view:** Bank of England staff (McLeay, Radia, Thomas, 2014) say banks create deposits by lending, do not simply lend out saved deposits and do not "multiply up" central bank money; Bundesbank staff (2017) say lending has nothing to do with existing excess reserves; limits are profit, regulation, and borrowers' demand (T01-T06). CONFLICT (T02). The textbook process still shows how a reserve ratio *would* cap lending, and IGNOU itself says reality is a mix |
| Who controls the money supply? | **Exogenous:** the monetary authority fixes it (classical model) | **Endogenous:** banks, firms and households influence it (T08); IGNOU: in practice a combination |
| What determines the price level and money demand? | **Quantity theory:** Fisher's equation of exchange, with velocity steady and output fixed (T10, T11); Cambridge k (Marshall, Pigou, Robertson, Keynes, T12); Friedman's restatement, money as an asset, stable demand function (T15) | **Keynes:** liquidity preference with transactions, precautionary and speculative motives (T14); the interest rate is set by demand and supply of money (IGNOU Unit 13). Pigou (1950) calls the Cambridge function the Marshallian liquidity preference function (T13) |
| Why did money shrink in the US in the early 1930s? | **Friedman and Schwartz (as IGNOU reports):** money stock fell about 35% while the base rose about 20%, because the currency-deposit ratio rose and banks held excess reserves (T09). Their original book was not opened (U05) | No rival view was read; do not present T09 as the only explanation |

## A4. What has changed since the NCERT text was written (with dates)

| Item | NCERT (2026-27 reprint of earlier text) | Now (checked at the publisher) |
|---|---|---|
| CRR | 20% in an example; Class X says banks hold "about 5 per cent" cash | **3.00% of NDTL**, reached in four steps Sep-Nov 2025 (R03); on RBI's panel 3 Nov 2026 (R05). Was 4.50% to Dec 2024 (R04) |
| SLR | Named, no number | **18% of NDTL** minimum; ceiling 40% in law (R06, R07) |
| Broad money M3 | Rs 2,72,86,589 crore in 2024-25 (Appendix 3.2) | **Rs 3,22,81,302 crore on 31 Jul 2026** (I01); cash 13.0% (A08) |
| Bank credit and deposits | none | SCB deposits Rs 2,69,41,367 crore (+15.4%), credit Rs 2,20,78,095 crore (+19.3%), 31 Jul 2026 (I03) |
| Jan Dhan accounts | "over 50 crore" (Grade 7) | **59.09 crore** and Rs 3,16,514 crore on 19 Aug 2026 (I06) |
| UPI | launched 2016 (Grade 7) | 2,271.6 crore payments worth Rs 28,92,139 crore in **June 2026**; 24,162 crore in FY 2025-26 (I07, I08) |
| Rural credit split | Graph 1 "2019"; text "about half" | 66% formal / 34% informal (survey 2019, debt as on 30 Jun 2018) (I10) |
| Banking Laws (Amendment) Act 2025 | not in NCERT | "fortnight" redefined from 15 Dec 2025 (R17); a dating detail |
| Reserve requirements abroad | none | US Federal Reserve set them to 0% on 26 Mar 2020 (R15) |
| Repo as "main tool"; Bank Rate meaning | NCERT 3.4 | Out of scope here; corrected in ECO-15 (X02, X03) |

## A5. Sensitive points

- **Demonetisation (Box 3.2, Nov 2016)** is not on this episode's list and is contested; leave it to ECO-14 and do not take a side.
- **Grameen Bank and Muhammad Yunus:** teach the 2006 Nobel award and the microcredit idea only (S01, S02). Do not bring in later politics in Bangladesh.
- **Bank failures and deposit insurance:** explain the DICGC limit (R13) without naming any failed bank.
- **Moneylenders, rural debt, Swapna's story:** explain why informal credit exists (banks absent, no collateral) without mocking borrowers, lenders or any community or state.
- **Jan Dhan and UPI** are government schemes: give the Ministry's figures and the date, no praise or blame; NCERT's "India's gift to the world" is NCERT's wording.
- **No investment or advice content:** the stock market section is set aside (N56); no bond or share talk beyond the liquid-asset idea; no interest-rate predictions.
- **Prelims past paper:** the key is not read; do not say "UPSC's key says (c)" (P05).

## A6. How many parts

The brief says one part. The depth checklist (39 items, 27 NCERT headings plus the debate and the current position) does not fit in 10 or 15 minutes. **Recommended: three parts of about 12-15 minutes**, split where the ideas change:
1. **What money is, why we want it, and who supplies it** (3.1, 3.2, Box 3.1 demand motives and measures, Class X modern forms) [K01-K08, K10-K11, K30-K31, K36].
2. **How banks create money, and what limits it** (3.3, 3.3.1, 3.3.2, 3.4, Lala, balance sheet, CRR, SLR, multiplier, deposits and loans in Grade 7 and Class X, the debate, the 1930s, deposit insurance) [K09, K12-K19, K33-K35, K37-K38].
3. **Credit and payments in daily life** (Class X credit sections, formal and informal credit, SHGs, other institutions, payment modes and UPI, the 2024 past paper) [K20-K27, K32, K39]; set aside: K28 stock market, K29 demonetisation.
If AK keeps two parts, Part 3 folds into ECO-17 (inclusion) for self-help groups and Jan Dhan, and into the next episode (kinds of banks) for other institutions, and the PYQ stays in Part 2. Decide with the lead.

## D. Material for understanding and fun (each item sourced by a claim id)

**Everyday life:** a salary message is a deposit, and a deposit is money (N31, A08); a cheque to a supplier moves money between two bank accounts in a couple of days (N31); a QR code on a fruit cart (N55); a home loan at 12%, collateral and monthly instalments (N34); the spread between the 2.5% savings rate and bank lending rates on RBI's panel, 3 Nov 2026 (I05, N47, A11).
**India today:** M3 and its parts (I01, I02, A08, A09); credit grew faster than deposits, 19.3% against 15.4% (I03); UPI vs cheques vs RTGS in June 2026 (I07, I09, A10); Jan Dhan 59.09 crore accounts (I06); 144.22 lakh SHGs savings-linked at 31 Mar 2024 (I11); formal credit 66% (I10); CRR 3.00% (R05).
**Surprising true facts:** only 13% of India's money is cash (A08); UPI payments outnumbered cheques about 534 to 1 in June 2026 (A10); the average UPI payment was about Rs 1,273 and the average RTGS payment about Rs 72 lakh (A10); the US has had no reserve requirement since 26 Mar 2020 (R15); in the early 1930s US money shrank about 35% while the base grew about 20% (T09); the note's promise clause is RBI's own obligation to the holder (R12); a Rs 1,000 deposit at 6% becomes Rs 2,012.20 in 12 years (A01); the 32nd chessboard square alone holds 214.7 crore grains (A02).
**Short real stories:** the goldsmith who lends other people's gold, told by NCERT as a fiction (N09); Salim's festival order and Swapna's failed crop (N33); Grameen Bank and the 2006 Nobel Peace Prize (S01, S02); Fisher in 1911 listing the five things that fix the price level (T10); how a bank run changes the multiplier (T09).
**Questions people ask:** Where does the bank get the money it lends me? (N11, T02) Does RBI print money for each loan? (A08, R11) What if everybody withdraws at once? (N10, N32, T09, R13) Why do banks pay 2.5% and charge more? (I05, N47) Is my deposit safe? (R13) Why is there both a CRR and an SLR? (R02, R06) Why does RBI's note say "I promise to pay"? (R12)
**Guess-first and spot-the-mistake:** (1) *Guess:* what share of India's money is notes and coins? Answer 13.0% (A08). (2) *Guess:* if banks must keep 3% in reserve, how many times can reserves multiply in the toy model? Answer 33.3, but real banks never get near it (A06, T05). (3) *Spot the mistake:* NCERT says Rs 100 of reserves at 20% supported Rs 400 of deposits; the answer is Rs 500 (A05). (4) *Spot the mistake:* "r = 0.4, the sum is 5/3" for the lending rounds; the ratio is 0.8 and the sum is 5 (A04). (5) *True or false:* a syndicated loan cannot be a credit line (false: P04). (6) *Guess:* which is bigger, the average UPI payment or the average RTGS payment? (A10).

## E. Open items (nothing here may go on screen as fact)

1. **BLOCKED, not bypassed:** `rbidocs.rbi.org.in` PDFs and XLSX return a CAPTCHA: the 2025 CRR and SLR Directions (U01), the Handbook of Statistics tables and the fortnightly Money Supply releases (U02), the 1998 Working Group report. Consequence: the **real money multiplier today (M3 / reserve money) was not found**; only growth rates (I04) and NCERT's own tables (A07, unverified) exist. A person with a browser should open them.
2. **BLOCKED:** India Code (Banking Regulation Act, RBI Act) and NPCI (U03, U04). RBI's own FAQ and Master Direction stand in for the Acts; UPI facts stay "NCERT says".
3. **UNVERIFIED:** NCERT Graph 2 (54% and 17%, N38); Grameen's 2018 figures (N40, U06); "15 crore accounts before 2014" (N48); Nepal first to adopt UPI (N53); the official key for Prelims 2024 Q.52 (P05); Pigou 1917, Friedman 1956, Friedman and Schwartz originals (U05); current RBI rule on syndication (U07).
4. **Dated by the data:** all I, R05, R07 and A08-A10 rows are living figures (dates in the row). Money-supply level is as of 31 Jul 2026 because the later release is a blocked PDF. Add them to `docs/upsc/living/ECO-16.csv` when the script is written.
5. **Single-source theory rows:** Cambridge k, Friedman and the 1930s account rest on IGNOU only; the Keynes rows rest on a web transcription of the 1936 text. S4 needs a second source for any of these that goes on screen.
6. **Quantity theory and the repo/inflation side belong to ECO-15** (checklist K10, K11 there); ECO-16 holds only the demand-for-money doorway.
7. **Gate S5 is not passed by this file.** The self-check below only proves the phrase is in the saved text. The pilot audit failed 22 of 178 rows after such checks, so an independent person must open each used claim at its cited page and check who said it, in what capacity and how strongly.

## Self-check (run 3 Nov 2026)

For each claim with a saved source text, a key number or phrase was searched (whitespace and quote marks ignored) in the file named in `local_file`. **116 of 116 rows with a key phrase were found; 0 missed.** Eight rows have no key because the source was blocked or not opened (U01-U07, P05). Where the saved text was split by pages, the page is in `page_or_section`. This check does not prove the claim says what the row says (see open item 7).

| Claim | Saved text file | Key phrase searched | Result |
|---|---|---|---|
| N01 | ncert_leec103.txt | double coincidence of wants | FOUND, printed p.36 |
| N02 | ncert_leec103.txt | convenient unit of account | FOUND, printed p.36 |
| N03 | ncert_leec103.txt | deterioration in the purchasing power | FOUND, printed p.37 |
| N04 | ncert_leec103.txt | cashless society | FOUND, printed p.37 |
| N05 | ncert_leec103.txt | at higher interest rates, money demanded comes down | FOUND, printed p.37 |
| N06 | ncert_leec103.txt | money comprises cash and bank deposits | FOUND, printed p.38 |
| N07 | ncert_leec103.txt | high-powered money | FOUND, printed p.38 |
| N08 | ncert_leec103.txt | called the | FOUND, printed p.38 |
| N09 | ncert_leec103.txt | have risen to 125 kgs | FOUND, printed p.39 |
| N10 | ncert_leec103.txt | fully confident of getting them back on demand | FOUND, printed p.39 |
| N11 | ncert_leec103.txt | a new deposit is opened in that person | FOUND, printed p.39 |
| N12 | ncert_leec103.txt | Assets = Reserves + Loans | FOUND, printed p.39 |
| N13 | ncert_leec103.txt | Reserves Rs 100 Deposits Rs 100 | FOUND, printed p.40 |
| N14 | ncert_leec103.txt | over lending | FOUND, printed p.40 |
| N15 | ncert_leec103.txt | money supply increases from Rs 100 to Rs 500 | FOUND, printed p.42 |
| N16 | ncert_leec103.txt | create deposits of Rs | FOUND, printed p.42 |
| N17 | ncert_leec103.txt | lender of last resort | FOUND, printed p.42 |
| N18 | ncert_leec103.txt | Qualitative tools | FOUND, printed p.42 |
| N19 | ncert_leec103.txt | increases the total amount of reserves | FOUND, printed p.42 |
| N20 | ncert_leec103.txt | velocity of circulation | FOUND, printed p.44 |
| N21 | ncert_leec103.txt | 109.29 | FOUND, printed p.45 |
| N22 | ncert_leec103.txt | Such a situation is called a liquidity trap | FOUND, printed p.47 |
| N23 | ncert_leec103.txt | coins are issued by the Government of India | FOUND, printed p.47 |
| N24 | ncert_leec103.txt | fiat money | FOUND, printed p.48 |
| N25 | ncert_leec103.txt | M3 is the most commonly used measure | FOUND, printed p.48 |
| N26 | ncert_leec103.txt | sterilises the money supply | FOUND, printed p.49 |
| N27 | ncert_leec103.txt | Currency deposit ratio | FOUND, printed p.50 |
| N28 | ncert_leec103.txt | 27286589 | FOUND, printed p.51 |
| N29 | ncert_jess203.txt | double coincidence of wants | FOUND, printed p.39 |
| N30 | ncert_jess203.txt | no other individual or | FOUND, printed p.40 |
| N31 | ncert_jess203.txt | share the essential features of money | FOUND, printed p.41 |
| N32 | ncert_jess203.txt | about 5 per cent | FOUND, printed p.42 |
| N33 | ncert_jess203.txt | Credit (loan) refers to | FOUND, printed p.43 |
| N34 | ncert_jess203.txt | terms of credit | FOUND, printed p.44 |
| N35 | ncert_jess203.txt | Banks, 51% | FOUND, printed p.48 |
| N36 | ncert_jess203.txt | supervises the functioning of formal | FOUND, printed p.48 |
| N37 | ncert_jess203.txt | the formal sector still meets only about | FOUND, printed p.49 |
| N38 | ncert_jess203.txt | 54 per cent of the loans | FOUND, printed p.49 |
| N39 | ncert_jess203.txt | 15-20 members | FOUND, printed p.51 |
| N40 | ncert_jess203.txt | 81,600 villages | FOUND, printed p.52 |
| N41 | ncert_jess203.txt | SUMMING UP | FOUND, printed p.52 |
| N42 | ncert_jess203.txt | Look at a 10 rupee note | FOUND, printed p.52 |
| N43 | ncert_gees208.txt | financial infrastructure | FOUND, printed p.193 |
| N44 | ncert_gees208.txt | Fixed deposit account | FOUND, printed p.196 |
| N45 | ncert_gees208.txt | 2012.20 | FOUND, printed p.197 |
| N46 | ncert_gees208.txt | 32,768 | FOUND, printed p.198 |
| N47 | ncert_gees208.txt | do not lend all the deposits | FOUND, printed p.199 |
| N48 | ncert_gees208.txt | only 15 crore Indians | FOUND, printed p.200 |
| N49 | ncert_gees208.txt | Kisan Vikas Patra | FOUND, printed p.201 |
| N50 | ncert_gees208.txt | since 1949 | FOUND, printed p.201 |
| N51 | ncert_gees208.txt | Internet Banking | FOUND, printed p.205 |
| N52 | ncert_gees208.txt | National Payments | FOUND, printed p.207 |
| N53 | ncert_gees208.txt | Nepal was the first country | FOUND, printed p.207 |
| N54 | ncert_gees208.txt | 1930 | FOUND, printed p.210 |
| N55 | ncert_gees111.txt | it is not legal for anybody | FOUND, printed p.243 |
| N56 | ncert_gees208.txt | Stock exchange | FOUND, printed p.208 |
| R01 | rbi_pub9795.txt | withdrawable by cheque, draft, order or otherwise | FOUND |
| R02 | rbi_notif12131.txt | Every bank shall maintain in India by way of cash reserve | FOUND |
| R03 | eco15_crr_notif.txt | 3.75 per cent, 3.5 per cent, 3.25 per cent and 3.0 per cent | FOUND |
| R04 | rbi_notif12131.txt | 4.00 per cent from fortnight beginning December 28, 2024 | FOUND |
| R05 | rbi_home.txt | CRR : 3.00% | FOUND |
| R06 | rbi_notif12131.txt | not exceeding forty per cent | FOUND |
| R07 | rbi_home.txt | SLR : 18.00% | FOUND |
| R08 | rbi_pub16037.txt | M3 = M1 + Time deposits with the banking system | FOUND |
| R09 | rbi_wss_20260821.txt | 'Other' Deposits with Reserve Bank | FOUND |
| R10 | rbi_pub9455.txt | Chairman: Dr. Y.V. Reddy | FOUND |
| R11 | rbi_faq_currency.txt | sole right to issue banknotes | FOUND, PDF p.2 |
| R12 | rbi_faq_currency.txt | denotes the obligation on the part of the Bank | FOUND, PDF p.4 |
| R13 | dicgc_guide.txt | 5,00,000 (Rupees Five Lakhs) | FOUND |
| R14 | eco15_AboutusDisplay.txt | established on April 1, 1935 | FOUND |
| R15 | fed_reservereq.txt | reduced reserve requirement ratios to zero percent effective | FOUND |
| R16 | rbi_mastercirc_9902.txt | withdrawn by Reserve Bank of India in October 1996 | FOUND |
| R17 | rbi_wss_20260821.txt | definition of fortnight has been revised | FOUND |
| I01 | rbi_wss_20260821.txt | 32281302 | FOUND |
| I02 | rbi_wss_20260821.txt | 24387268 | FOUND |
| I03 | rbi_wss_20260821.txt | 26941367 | FOUND |
| I04 | rbi_bulletin24377.txt | Growth in reserve money (adjusted for the first-round impact | FOUND |
| I05 | rbi_home.txt | Savings Deposit Rate : 2.50% | FOUND |
| I06 | pib_pmjdy12.txt | 59.09 crore | FOUND |
| I07 | rbi_psi.txt | 227160.66 | FOUND |
| I08 | rbi_psi.txt | 2416168.86 | FOUND |
| I09 | rbi_psi.txt | 425.55 | FOUND |
| I10 | mospi_aidis_note.txt | 66% against 34% | FOUND, PDF p.4 |
| I11 | nabard_somfi_2023_24.txt | 144.22 | FOUND, PDF p.10 |
| T01 | boe_money_creation.txt | the majority of money in the modern economy is created by co | FOUND, PDF p.1 |
| T02 | boe_money_creation.txt | lending out deposits that savers place with them | FOUND, PDF p.1 |
| T03 | boe_money_creation.txt | so-called 'money multiplier' approach | FOUND, PDF p.2 |
| T04 | boe_money_creation.txt | ultimately depends on the monetary policy of the central ban | FOUND, PDF p.1 |
| T05 | bbk_moneycreation.txt | excess reserves or deposits at its disposal | FOUND, PDF p.1 |
| T06 | bbk_moneycreation.txt | through its interest rate policy | FOUND, PDF p.1 |
| T07 | ign_u13.txt | currency-deposit ratio rr = reserve-deposit ratio | FOUND, PDF p.12 |
| T08 | ign_u13.txt | convex combination | FOUND, PDF p.9 |
| T09 | ign_u13.txt | fell by 35 percent between March 1930 and March 1933 | FOUND, PDF p.16 |
| T10 | fisher_ppm_1911.txt | five definite factors | FOUND |
| T11 | ign_b8.txt | M.V = P.T | FOUND, PDF p.8 |
| T12 | ign_u5.txt | Alfred Marshall, A.C. Pigou, D.H. Robertson | FOUND, PDF p.7 |
| T13 | pigou1950_retrospective.txt | the Marshallian liquidity preference function | FOUND, PDF p.26 |
| T14 | keynes_gt_ch15.txt | (iv) There remains the Speculative-motive | FOUND |
| T15 | ign_b8.txt | has made a restatement of the Quantity | FOUND, PDF p.16 |
| P01 | eco15_upsc_notice_2026.txt | Demand for and Supply of Money : Money Multiplier Quantity T | FOUND, PDF p.61 |
| P02 | upsc_2024_prelims_gs1_p23.txt | Syndicated lending spreads the risk of | FOUND |
| P03 | bis_syndloan_2004.txt | more efficient geographical and institutional sharing of ris | FOUND |
| P04 | bis_syndloan_2022.txt | Credit lines comprise 41% and term loans 48% of all non-bank | FOUND |
| P05 | upsc_anskeys.txt | - | n/a |
| S01 | nobel_2006_pr.txt | divided into two equal parts, to Muhammad Yunus and Grameen  | FOUND |
| S02 | nobel_2006_speech.txt | Over 95 per cent of the borrowers are women | FOUND |
| A01 | ncert_gees208.txt | 2012.20 | FOUND, printed p.197 |
| A02 | ncert_gees208.txt | 128 grains | FOUND, printed p.198 |
| A03 | ncert_leec103.txt | 107.33 | FOUND, printed p.46 |
| A04 | ncert_leec103.txt | a = 1 and r = 0.4 | FOUND, printed p.51 |
| A05 | ncert_leec103.txt | could support deposits of Rs 400 | FOUND, printed p.42 |
| A06 | rbi_home.txt | CRR : 3.00% | FOUND |
| A07 | ncert_leec103.txt | 27286589 | FOUND, printed p.51 |
| A08 | rbi_wss_20260821.txt | 4185446 | FOUND |
| A09 | rbi_wss_20260821.txt | 22078095 | FOUND |
| A10 | rbi_psi.txt | 319.29 | FOUND |
| A11 | ncert_gees208.txt | earns ₹6 | FOUND, printed p.199 |
| U01 | - | - | n/a |
| U02 | - | - | n/a |
| U03 | - | - | n/a |
| U04 | - | - | n/a |
| U05 | - | - | n/a |
| U06 | - | - | n/a |
| U07 | - | - | n/a |

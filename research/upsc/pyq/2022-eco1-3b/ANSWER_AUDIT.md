# Answer audit: 2022-ECO1-3B (deposit vs money multiplier; effect of cards; 15 marks)

Independent audit, 11 Nov 2026, of ANSWER.md (from answer.py) against claims.csv, ECO-16/claims.csv, saved sources and docs/upsc/ANSWER_STANDARD.md. answer.py not edited.
Sources reopened: sources/rbi_cash_vs_digital_bs4344.txt (lines 116, 153, 241, 396, 510), sources/rbi_bulletin21069.txt (note 12), research/upsc/_pyq/mains/2022_eco1.txt (Q3(b) text; the marks are not in the text layer, so "15" rests on the answer's own page-4 check).

**Counts (facts):** sheet 14 lines: PASS 10, FIX 4, FAIL 0. Narration 10 lines: PASS 6, FIX 4, FAIL 0. Exam fit: 4 FIX, 4 PASS.

## 1. Facts: answer sheet

| Sheet line | Verdict | Evidence | Rewording |
|---|---|---|---|
| Intro: "Both multipliers show how far reserves stretch" | PASS | Our framing, plain; consistent with N16, T07. | - |
| Intro: m = 1/rr "deposit multiplier"; m = (cdr+1)/(cdr+rr) "money multiplier"; "labels are ours; NCERT and IGNOU do not define them" | FIX | -09 (UNVERIFIED): the phrase "deposit multiplier" was searched only in the saved NCERT Ch 3 text and IGNOU Units 5, 8, 13, so "NCERT and IGNOU do not define them" over-reaches. The formulas are right (N16, T07, RBI note 12). | "We found 'deposit multiplier' defined neither in NCERT Ch 3 nor in IGNOU Unit 13; we use it for 1/rr (our label) and 'money multiplier' for M/H (IGNOU)." |
| Sec 1: deposit multiplier = deposits per rupee of reserves when no cash is held; 20%: Rs 100 supports Rs 500, m = 5 | PASS | N16, A04, T07 (cdr = 0). | - |
| Sec 1: money multiplier = M/H, counts cash (cdr); cash leaks, so it is smaller | PASS | T07, RBI note 12 (inverse to cdr and r), A14 algebra. "so it is smaller" is algebra (A14 note). | - |
| Sec 1: "At today's CRR 3.00%: 1/rr 33.3, money multiplier 6.40 with cdr 0.1496 (toy figures, 31 Jul 2026)" | PASS | A14: 1.1496/0.1796 = 6.40, cdr from A09 (all deposits), CRR 3.00% (R05, re-read in 2024-ECO1-4A-02). Labelled toy and dated. Add "our arithmetic" and that the CRR was read 11 Nov 2026. | - |
| Sec 1: "RBI's actual multiplier fell from 5.57 in 2019-20 to 5.20 in 2021-22 (RBI Bulletin, June 2022)" | PASS | 2024-ECO1-4A-07; bulletin lines 289-292 (M3 / base money). Say "M3 / base money". | - |
| Fig. 1 "Same reserves, two multipliers (toy figures at CRR 3.00%)" | PASS | A14 | - |
| Sec 2 bullet 1: card payment shifts a deposit; if it replaces cash, cdr falls, m rises | PASS | -10 (reasoning, labelled "ours, not an official figure") with -08 formula. | - |
| Sec 2 bullet 2: "RBI staff paper (authors' views) finds digital payments inversely linked to currency use, but income's effect outweighs it; may lower cdr over time" | FIX | -01, -02 match (lines 396: "overshadowed by the dominant income effect"; "can potentially moderate"). But the paper's variable is the total value of digital payments (line 281), not cards, and the sheet uses it as evidence about cards. | "...digital payments (all modes, not cards alone) are inversely linked ..." Name the authors (Awasthy, Misra, Dhal, 2022). |
| Sec 2 bullet 3: "Cards are small: Rs 2,36,660 crore in June 2026, 0.75% of digital payment value" | FIX | -05, -07 match (0.745%). The 0.75% is our arithmetic and not marked. | "(our arithmetic from RBI Payment System Indicators)" |
| Sec 2 bullet 3: "Debit cards mostly draw cash: ATM withdrawals Rs 2,16,359 crore against Rs 35,299 crore of debit-card payments" | PASS | -06 (June 2026; 6.1 times). Year carried by the previous bullet; repeat "June 2026". | - |
| Sec 3: "Yes, but the impact is small" | FIX | Direction is our reasoning (-10 UNVERIFIED); "small" is our inference from card share (-07 note). The verdict is not labelled, only the last sentence is. | "Yes, in direction (our reasoning), but small on today's data (our inference)." |
| Sec 3: "Less cash raises the money multiplier, but cards are a sliver of payments and income still dominates" | PASS | T07/-08; -07; -01 | - |
| Sec 3: "We found no measured fall in cdr caused by cards" | PASS | -11 BLOCKED, NOTES "NOT FOUND"; honest. | - |

## 1. Facts: narration

| Narration sentence | Verdict | Evidence | Rewording |
|---|---|---|---|
| b00 "The words deposit multiplier are not in NCERT" | FIX | -09 searched only the saved Ch 3 and IGNOU units. | "not in NCERT's money chapter or IGNOU's unit" |
| b01 directive meanings | PASS | Teaching practice, footnoted. | - |
| b02 20%: Rs 100 supports 500; "one over the reserve ratio. We call it the deposit multiplier" | PASS | N16, A04, label ours | - |
| b03 cash stops a round; toy 33 to 6.4 at today's reserve ratio | PASS | T07, A14; "Every rupee held as cash stops a round" is our reasoning but obvious algebra. | - |
| b04 card moves a deposit; "our reasoning, and we label it so" | PASS | -10; cites -08. | - |
| b05 "Cards were under one percent of digital payment value in June 2026. Debit cards mostly draw cash. And an RBI staff paper says income still dominates." | FIX | -07, -06, -01 match. "an RBI staff paper" fine, but the paper measures digital payments, not cards (see sheet). | "...a staff paper on all digital payments says income still dominates." |
| b06 "No word limit is printed" (cites P007) | FIX | P007 is the 2025 paper. 2022_eco1.txt shows "Word limit ... wherever specified" and Q3(b) prints none; no claim row for 2022. | Add a claim row for the 2022 paper. |
| b07 "Yes ... direction of a higher multiplier. But it is small today. ... no measured fall ... found" | PASS | Same as sheet verdict; narration marks no-measure. Apply the sheet's labels here too. | - |
| b08 weaker answer | PASS | Ours; A14. | - |
| b09 cousins 2025 control, 2019 hoarding, 2024 credit creation | FIX | Cited claim ECO16-T07 sources no question. PDFs: 2025 Q4(c) and 2019 Q5(a) text confirm the wording; 2024 Q4(a) confirmed. | Cite the PDFs, not T07. Add 2018 Q1(e) (high-powered money). |

## 2. Exam fit (ANSWER_STANDARD A1-A12)

| Item | Verdict | Evidence | Rewording or addition |
|---|---|---|---|
| A1 D1 "Compare" | FIX | Directive is compare, yet the comparison is four bullets and a bar-style diagram; no side-by-side table (A9 allows a table for economics) and no explicit "difference in one line each": formula, what is counted, size, who uses it. | Use a two-column table: formula, cash counted?, toy value at CRR 3.00% (33.3 v 6.40), RBI actual (5.20). Replace the bar diagram or fold into it. |
| A1 D2 credit AND debit cards | FIX | Sheet treats "cards" as one. Audited support -05/-06: credit cards 5,812.59 lakh transactions, Rs 2,01,362 crore; debit Rs 35,299 crore, mostly ATM draws. Credit cards do not change reserves (-10 reasoning). | One line: "Credit cards (Rs 2,01,362 crore) are a deferred-payment loan, not cash; debit cards (Rs 35,299 crore of purchases vs Rs 2,16,359 crore of ATM cash) mostly draw cash." Label the first half ours. |
| A1 D3 "Justify" | FIX | Justification omits audited evidence that supports it: -03 (cash in circulation peaked at 14.4% of GDP in 2020-21 despite fast digital growth: the "currency demand paradox") and -04 (precautionary motive stays; PoS cash 71% to 27%, 2019-2022, cited via FIS in the RBI paper). | Add: "RBI staff paper: currency stayed at a peak 14.4% of GDP in 2020-21 while digital payments grew 27% a year by value (2016-17 to 2022-23)." |
| A5 intro | FIX | 38 of 249 words = 15.3%, over the 15% limit, and it spends a sentence on "labels are ours". | Trim to under 35 words; move the label note into the table caption. |
| A7 named evidence per heading | PASS | Sec 1: NCERT/IGNOU/RBI Bulletin; sec 2: RBI paper, RBI Payment System Indicators; sec 3 repeats. Authors not named (see above). | - |
| A9 diagram | PASS | One diagram, economics-appropriate, toy figures labelled. | - |
| A10 conclusion | PASS | 33 words (13%), balanced, no question. | - |
| A11 dated | PASS | June 2026, 31 Jul 2026, 2019-20 to 2021-22 all stated. | - |

# Answer audit: 2024-ECO1-4A (credit creation, multiplier, limitations; 20 marks)

Independent audit, 11 Nov 2026, of ANSWER.md (from answer.py) against claims.csv, ECO-16/claims.csv, the saved sources and docs/upsc/ANSWER_STANDARD.md. answer.py not edited.
Sources reopened: sources/rbi_bulletin21069.txt (lines 279-292, 381-385), sources/rbi_home_20261111.txt, ECO-16/sources/ign_u13.txt (pp. on 1930s, loan demand), ECO-16/sources/ncert_leec103.txt, research/upsc/_pyq/mains/2024_eco1.txt.

**Counts (part 1, facts):** sheet 16 lines: PASS 8, FIX 8, FAIL 0. Narration 10 lines: PASS 6, FIX 4, FAIL 0. Part 2 (exam fit): 5 FIX, 2 PASS rows, listed at the end.

## 1. Facts: answer sheet

| Sheet line | Verdict | Evidence | Rewording |
|---|---|---|---|
| Intro: "banks' power to lend more than the cash they hold ... a new deposit opens ... money supply rises" | FIX | N11 supports only "new deposit opened in the borrower's name, money supply rises". "lend more than the cash they hold" is our gloss, in no claim. | "When a bank lends, a new deposit opens in the borrower's name and the money supply rises (NCERT 3.3)." |
| Sec 1: banks lend part of deposits; spread is profit | PASS | N08 (spread), N10 (depositors do not all withdraw together) | - |
| Sec 1: "A loan opens a deposit. NCERT's example assumes the loan comes back to the same bank." | PASS | N11; -01 (NCERT PDF p.5: "deposits the loan amount in the bank itself") | - |
| Sec 1: at 20%, Rs 100 gives Rs 500 deposits, Rs 400 loans | PASS | N15 (Tables 3.2, 3.3) | Add "(NCERT's made-up 20%)" so it is not read as an Indian rate. |
| Sec 1: "RBI sets the CRR by law. 3.00% and SLR 18.00%, read on 11 Nov 2026" | PASS | N14 (legal requirement), R02 (s.42(1) RBI Act), -02: rbi_home_20261111.txt lines 137-141 CRR 3.00%, SLR 18.00%. Dated. SLR is liquid assets, not a cash reserve (A06 note); sheet does not add them. | - |
| Fig. 1 rounds Rs 100, 80, 64 ... Rs 500 | PASS | N15, A04 (geometric series, sum 500) | - |
| Sec 2: "Rs 1 of reserves supports Rs 5 of deposits: m = 1/rr" | FIX | N16 gives the multiplier 5 but the NCERT formula is a picture; T07 note says 1/rr is "our own algebra" (IGNOU's cdr = 0 case). Not marked. | "m = 1/rr (IGNOU's formula with cdr = 0)" |
| Sec 2: "m = (cdr + 1)/(cdr + rr), cdr is the currency-deposit ratio" | FIX (minor) | T07 and RBI note 12 give the same notation, so the formula is right. rr is never defined; RBI note 12 says r is reserves to deposits including CRR plus excess reserves (line 383). | Define "rr = reserve-deposit ratio (RBI: CRR plus excess reserves)". |
| Sec 2: RBI multiplier (M3/base) 5.57, 5.48, 5.20 in 2019-20 to 2021-22, cdr 0.16 to 0.18; "latest year printed is 2021-22" | PASS | -07; bulletin lines 289-292 match; year carried. -08 BLOCKED justifies "latest printed". Say "latest we could read". | Optional: RBI says this cdr rise equals about a 200 bps CRR increase (line 292), audited text, unused. |
| Sec 2: "1/rr is 33.3 at today's CRR, which real lending never reaches" | FIX | A06 calls it "a ceiling in a toy model, not a forecast". "never reaches" is an absolute no claim shows; the only India figure is 5.20 for 2021-22. Not marked as our arithmetic. | "Our arithmetic: 1/rr at today's CRR of 3.00% is 33.3, a toy ceiling. RBI's printed multiplier was 5.20 (2021-22)." |
| Sec 3 Cash drain: higher cdr cuts m; crisis cash; lower CRR can offset (RBI Bulletin) | PASS | -06; bulletin lines 279, 381 | - |
| Sec 3 Excess reserves: "1930-1933 US money fell about 35% while the base rose about 20%" | FIX | T09/IGNOU p.16: M3-type money -35% Mar 1930 to Mar 1933, base +20%, from two causes: rising cdr AND excess reserves (and the Fed raising reserve requirements). Sheet hangs the whole episode on excess reserves and names no source. | "IGNOU: US money (M3-type) fell about 35% from March 1930 to March 1933 while the base rose about 20%, as cdr and excess reserves both rose." |
| Sec 3 Loan demand: process continues only with sufficient demand; profit and regulation also limit (Bundesbank 2017) | PASS | -03 (IGNOU p.11), T05 (Bundesbank Apr 2017: profit, regulation, demand). Name IGNOU for the first clause. | - |
| Sec 3: "multiplier is a reduced form, not a causal rule (Bundesbank)" | PASS | -05 (fn 35: "a reduced form", not causal between reserves and money) | - |
| Sec 3: "Bank of England staff (2014) argue that policy rates, not reserves, set money" | FIX | T04: money created "ultimately depends on the central bank's monetary policy, which in normal times works by setting interest rates"; T03: textbook multiplier is not how money is created in practice. "not reserves" is a paraphrase stronger than T04. | "Bank of England staff (2014): in normal times the amount of money ultimately depends on monetary policy, set through interest rates, not on a multiplier of reserves." |
| Conclusion: "the multiplier shows its outer limit ... a ceiling that cash habits, idle reserves and weak loan demand keep well below its textbook value" | FIX | Verdict is ours, unlabelled. "well below its textbook value" is true against 1/rr (33.3) but the RBI figure 5.20 is above NCERT's own 5; causes for India's 5.20 are only cdr (-07); idle reserves and weak demand are not shown for India. Also sits against the Bundesbank/BoE point that the multiplier is not causal. | "In our reading, the multiplier is a ceiling in a toy model: cash habits, spare reserves and loan demand keep real money below it, and central banks say it is not a causal rule." |

## 1. Facts: narration

| Narration sentence | Verdict | Evidence | Rewording |
|---|---|---|---|
| b00 "The textbook story ... holds only if nobody keeps cash." | FIX | T07: cdr = 0 reduces to 1/rr. Cash is one leak; excess reserves and loans leaving the banking system (-01) are others. "only if" is too narrow. | "holds only if nobody keeps cash and every loan comes back as a deposit." |
| b01 "Describe means ... step by step. Analyse means break it into parts and weigh them." | PASS | Teaching practice, footnoted on screen per ANSWER_STANDARD; not a fact claim. | - |
| b02 loan opens a deposit; new money; depositors do not all come at once | PASS | N11, N10 | - |
| b03 20%: 100, 80, 64; rounds add to 500; multiplier 5 | PASS | N15, A04 | - |
| b04 "Every rupee that leaves the chain stops a round" | FIX | Our reasoning, no claim; "banks keep spare reserves" is -04. India fall 5.57 to 5.20 correct (-07). | "In our reading, every rupee that leaves the chain stops a round." |
| b05 "No word limit is printed" (cites P007) | FIX | P007 is the 2025 paper's cover and Q4(c). The 2024 Q4(a) text (2024_eco1.txt lines 140-143: "10+10=20", no words) does not appear in any claim row. Verified true in the PDF text. | Add a claim row for the 2024 paper (cover "Three Hours, 250"; Q4(a) prints no word limit; marks 10+10=20). |
| b06 one diagram, a minute, "proves you understand" | PASS | Our advice (A9). | - |
| b07 limits then caution not causal; verdict "ceiling, not a constant" | PASS | -05, T09; verdict ours, as the sentence says "verdict". | - |
| b08 weaker answer: one over CRR, thirty-three; only CRR and SLR as limits | PASS | A06; weaker answer is ours and labelled. | - |
| b09 cousins 2025 Q4(c), 2019 Q5(a), 2018 Q1(e) | FIX | Cited claim is ECO16-T07, which does not source questions. PDFs agree: 2025 Q4(c) 15 marks; 2019 Q5(a) partial hoarding plus excess reserves; 2018 Q1(e) (10 marks, 150 words) high-powered money and short-term policy. | Cite the PDFs (2018/2019/2025_eco1.txt). Note 2018 and 2019 are 10-markers. |

## 2. Exam fit (ANSWER_STANDARD A1-A12)

| Item | Verdict | Evidence | Rewording or addition |
|---|---|---|---|
| A1 marks split | FIX | Printed "10+10=20" (2024_eco1.txt line 143): mechanism with implications is 10, limitations 10. Sheet: intro + sec 1 + sec 2 about 205 words; limitations about 96. Limitations get 30% of words for 50% of marks. | Cut sec 1-2 to about 150 words; lift limitations to about 150. |
| A1 D2 "implications on multiplier effect" | FIX | Sec 2 gives formulas and the RBI series but not the implication. Audited support: N18 (raise reserve ratio, banks cut lending, money falls), N19 (OMO changes reserves), A05 (at 25%, Rs 100 supports Rs 400, not Rs 500). | "So RBI can move deposits by a multiple: at a 25% ratio Rs 100 of reserves supports Rs 400, not Rs 500 (NCERT, our arithmetic); CRR and open market operations change reserves or the ratio." |
| Limitations missing though audited | FIX | -01 (same-bank assumption: loans that leave as cash or go to another bank break the chain; mark as ours), A09 (credit-deposit ratio 81.9% on 31 Jul 2026, banks do not lend everything; mark as our reading), R06/N14 (SLR and CRR caps). | Add two bullets: "Leakage: NCERT's example assumes the loan returns to the same bank (ours: loans paid out as cash or to other banks break the chain)." "Banks lent about 82% of deposits on 31 Jul 2026 (our arithmetic from RBI)." |
| Mechanism: central-bank view | FIX | T01 (BoE staff 2014: most money is created by loans) is only in limitations; the mechanism heading shows only the textbook order. | One line in sec 1: "BoE staff (2014): loans create deposits first; reserves follow." |
| A2 view and A10 conclusion | PASS | Balanced verdict present, 31 words (about 10%), no question as ending. Reword the unlabelled parts (see facts). | - |
| A5, A6, A7, A8, A9, A11 | PASS | Intro 31 words (10%); points under headings; each heading names a source (NCERT, RBI Bulletin, IGNOU/Bundesbank); 8 terms underlined; one diagram; figures dated. | - |
| Ambiguity | FIX (minor) | "Multiplier effect" can also read as the Keynesian multiplier. The sheet silently takes the money multiplier. | Add half a line: "multiplier = money (credit) multiplier". |

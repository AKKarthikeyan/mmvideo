# Answer audit: 2021-ECO1-4B (high-powered money theory; assumptions; 15 marks, printed 8+7)

Independent audit, 11 Nov 2026, of ANSWER.md (from answer.py) against claims.csv, ECO-16/claims.csv, saved sources and docs/upsc/ANSWER_STANDARD.md. answer.py not edited.
Sources reopened: sources/rbi_bulletin21069.txt (lines 175-183, 279-292, 369-385), ECO-16/sources/ign_u13.txt (1930s passage), research/upsc/_pyq/mains/2021_eco1.txt line 158-160 (question, marks "8+7").

**Counts (facts):** sheet 15 lines: PASS 10, FIX 5, FAIL 0. Narration 9 lines: PASS 5, FIX 4, FAIL 0. Exam fit: 3 FIX, 5 PASS.

## 1. Facts: answer sheet

| Sheet line | Verdict | Evidence | Rewording |
|---|---|---|---|
| Intro: H = currency held by the public plus bank reserves; M = m x H | PASS | -02 (IGNOU glossary p.22), N07 (NCERT: currency issued by the central bank, held by public or banks) | - |
| Sec 1: M = C + D, H = C + R, m = (cdr+1)/(cdr+rr), cdr = C/D, rr = R/D | PASS | -01 (IGNOU p.12: D is demand deposits). Same notation as source. | - |
| Sec 1: cdr = 0 gives m = 1/rr; at 20% m = 5 | PASS | T07, N16 (the 1/rr reduction is "our own algebra" per T07 note; mark if space allows) | - |
| Sec 1: "RBI controls H: sole issuer and lender of last resort, and moves reserves by CRR and open market operations" | FIX | N17 supports "only issuer of currency" and lender of last resort. N19 supports OMO changing reserves. CRR (N18) changes the required ratio, i.e. rr, and so the multiplier; it does not move H (I04 notes the adjustment "for the first-round effect of CRR changes"). RBI authors (-05, bulletin line 176) also say money is not exogenously set by the central bank. | "RBI is the only issuer of currency and lender of last resort (NCERT). It changes H by open market operations; a CRR change alters rr, and so m." |
| Sec 1: RBI's reserve money M0 = currency in circulation + bankers' deposits + 'other' deposits with RBI | PASS | -03 (Box I; RBI page calls M0 "monetary base"). Never tell the reader M0 is "our H": say "RBI's measure of H". | - |
| Sec 1: "Mar 2020 to Mar 2022 base +28.2%, broad +22.0%; multiplier 5.57 (2019-20) to 5.20 (2021-22)" | FIX | -04 and bulletin line 369 match. But the formula above has M = C + D, while 22.0% and 5.57/5.20 use M3 / base money (bulletin line 289-290). Different M; not said. | "RBI's multiplier is M3 / base money: 5.57 (2019-20), 5.20 (2021-22)." |
| Sec 2 heading: "(our reading; no source lists them)" | FIX | -06: "no primary source read prints them as a list". "no source" claims more than was read. | "(our reading of the derivation; no source we read lists them)" |
| Sec 2: cdr and rr taken as given and stable | PASS | -01 derivation; -06 ours (labelled) | - |
| Sec 2: money is cash plus demand deposits only | PASS | -01 (M = C + D, D demand deposits) | - |
| Sec 2: desired excess reserves a fixed fraction of deposits, counted inside rr | PASS | -04 (IGNOU p.22 desired excess reserve ratio); RBI note 12: r includes excess reserves | - |
| Sec 2: the central bank sets H | PASS | T08 (IGNOU exogenous money: the authority fixes supply). IGNOU adds the real world is a mix; sec 3 covers it. | - |
| Sec 3: crisis, cdr rises, m falls (RBI Bulletin) | PASS | -06; bulletin line 279 | - |
| Sec 3: "Banks may hold large excess reserves: in 1930-1933 the US base rose about 20% but money fell about 35%" | FIX | T09/IGNOU p.16: M3-type money -35% (Mar 1930 to Mar 1933), base +20%, from a jump in cdr and in excess reserves plus higher reserve requirements. The sheet gives only excess reserves and no source. | "IGNOU: from March 1930 to March 1933 US money fell about 35% while the base rose about 20%, as cdr, excess reserves and reserve requirements all rose." |
| Sec 3: "RBI Bulletin authors say money is determined endogenously and the link from H breaks in shocks" | PASS | -05; bulletin lines 176, 279. "Authors say" is the right attribution. | - |
| Conclusion: "a useful first approximation ... In shocks it describes a limit, not a rule" | FIX | "useful first approximation" is our verdict, unlabelled. "describes a limit, not a rule" is not in any claim, and a multiplier that falls in a shock is not a limit. Supported: m moves with cdr and rr (-04, -06); the H-to-M link breaks in shocks (-05). | "In our view M = m x H holds while cdr and rr are stable; in shocks m moves and, RBI authors say, the link from H breaks." |

## 1. Facts: narration

| Narration sentence | Verdict | Evidence | Rewording |
|---|---|---|---|
| b00 "Few sources print the assumptions, so you must read them out of the derivation." | FIX | -06: none we read prints them. "Few" implies some do. | "None of the sources we read lists them, so we read them out of the derivation." |
| b01 "Describe ... In brief means short. State means list, without arguing." | PASS | Teaching practice, footnoted. (Conflicts with sheet sec 3; see exam fit.) | - |
| b02 H is currency, held by the public or by banks as reserves; RBI its only issuer | PASS | N07, N17, -02 | - |
| b03 M = cash + deposits; H = cash + reserves; divide; cdr = 0 gives 1/rr | PASS | -01, T07 | - |
| b04 four padlocks: ratios stable; money = cash + demand deposits; spare reserves fixed share; central bank sets the base | PASS | -06 (each item traced to -01, -04, T08) | - |
| b05 "No word limit is printed" (cites P007) | FIX | P007 is the 2025 paper. 2021_eco1.txt lines 158-160 shows the question with "8+7" and no word limit; no claim row exists for the 2021 paper. | Add a claim row for the 2021 paper (cover, Q4(b) text and 8+7). |
| b06 "Say plainly the list is our reading, because no source prints it." | FIX | Same wording issue as the sec 2 heading. | "...because none we read prints it." |
| b07 weaker answer: H is printed money; 1/CRR; CRR as the only assumption | PASS | Ours; T07, -04. | - |
| b08 cousins 2025 Q4(c), 2019 Q5(a), 2022 Q3(b) | FIX | Cited claim T07 sources no question. PDF text confirms 2025 Q4(c), 2019 Q5(a), 2022 Q3(b). The closest cousin is missing: 2018 Q1(e) "What is high-powered money? Explain how changes in short-term monetary policy affect high-powered money and money multiplier" (2018_eco1.txt lines 81-82). | Cite the PDFs; add 2018 Q1(e). |

## 2. Exam fit (ANSWER_STANDARD A1-A12)

| Item | Verdict | Evidence | Rewording or addition |
|---|---|---|---|
| A1 marks 8+7 | PASS | Theory (intro + sec 1) about 155 words; assumptions plus failures about 107. Close to 8:7. | - |
| A1/A3 "in brief" and "State" | FIX | The question says "in brief" and "State"; the narration itself says "State means list, without arguing". Sec 3 ("Where the assumptions fail", 59 words) argues, and the sheet sits at 269 words, the top of the 220-270 budget. The 7 marks for assumptions get 40 words of actual assumptions. | Turn sec 3 into a half-line per assumption ("fails when ..."), and spend the saved words on stating each assumption fully (public holds a stable cdr; banks keep required plus desired excess reserves; RBI fixes H; only C + D count as money). Trim the India figures (see above). |
| Missing though audited | FIX | (a) How RBI's data relate: the formula's M = C + D is narrower than RBI's M3 (-03 R08 defines M1, M3); one line fixes the mismatch. (b) The policy use of the theory: raising CRR lowers m, OMO changes H (N18, N19). Currently stated wrongly or not at all. | "RBI changes H by OMO and rr by CRR, so M moves." |
| A9 diagram | FIX (optional) | None on the sheet, although narration b02 draws H splitting into C and R. A one-minute box ("H = C + R: public cash C, bank reserves R, then M = C + D") would suit a theory answer. | One small box diagram. |
| A5, A10 | PASS | Intro 29 words (11%); conclusion 32 words (12%); no question as ending. | - |
| A7 named evidence | PASS | Sec 1 IGNOU/NCERT/RBI; sec 3 RBI Bulletin/IGNOU. | - |
| A8 key terms | PASS | high-powered money, money supply, m formula, open market operations, reserve money underlined. | - |
| A11 dated | PASS | Mar 2020-Mar 2022; 2019-20, 2021-22 given. | - |

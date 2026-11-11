# Answer audit: 2019-GS3-1 (taxes subsumed in GST; revenue since July 2017)

Independent read, 11 Nov 2026. Checked against claims.csv (-01 to -15), saved sources, and `docs/upsc/ANSWER_STANDARD.md`. answer.py not edited.

## 1. Facts: sheet lines

| Line | Verdict | Evidence | Rewording |
|---|---|---|---|
| Intro: GST began 1 July 2017, merged many Union and State taxes | PASS | -03 | - |
| Union (8 heads): central excise, other excise, CVD, SAD, service tax, cesses | PASS | -01 (8 heads counted) | - |
| States (9 heads): VAT, CST, purchase, luxury, entry, entertainment, advertisement, lottery and betting, cesses | PASS | -02 (9 counted; entertainment tax "except by local bodies" is dropped, harmless) | - |
| Outside: alcohol; five petroleum goods until the Council names a date | FIX | -03: "from a date to be recommended by the Council", read at CBIC as on 1 Jan 2018; not rechecked for today | "Outside (CBIC, 2018): alcohol; five petroleum goods until a date the Council recommends." |
| Basis: gross collection with cess | PASS | -04, -07 (bases reconcile) | - |
| Rs 7.41 lakh crore (nine months, 2017-18) to 20.18 lakh crore (2023-24) and 22.09 lakh crore (2024-25) | PASS | -04 (7,40,650; 20,18,249), -09 (22,08,861). Same basis, nine months labelled | - |
| One fall: 12.22 to 11.37 lakh crore in 2020-21, "the COVID year" | FIX | Figures -04 (12,22,116; 11,36,805; -7.0%). No row ties the fall to COVID | "...in 2020-21, the year of the pandemic (our reading)." |
| Compensation protected States at 14% growth on 2015-16 | PASS | -12 (ss.3-4; direction fixed in audit) | - |
| Rs 49,000 crore, 83,000 crore and 1.65 lakh crore for 2017-18 to 2019-20 | FIX | -11 is the PIB status note of 27 Apr 2022 on amounts *released* ("about"); the Finance Minister gave Rs 1,60,000 crore for 2019-20 at the 42nd Council (2020-GS3-12-17). The sheet gives no holder or "about" | "PIB (Apr 2022): compensation released was about Rs 49,000 crore, 83,000 crore and 1.65 lakh crore." |
| Close: "Revenue grew strongly, with one COVID dip." | FIX | Same COVID label as above. "Strongly": the series is +3.8% in 2019-20 and +11.6% in 2023-24; "strong" is our judgment | "Revenue rose, with one fall in 2020-21 (our reading: the pandemic)." |
| Close: "No official like-for-like comparison with the replaced taxes exists." | FIX | -14 and -15 are NOT FOUND; the Revenue Neutral Rate report was seen but not read. "Exists" asserts a negative | "We found no official like-for-like comparison with the replaced taxes." |
| Demand list shows D1 twice in ANSWER.md | FIX | Rendering: two demands both carry id D1, so the D2 tick may not map | In answer.py give the second demand id D2 (and the comment demand D3). Not edited here. |

## 1b. Facts: weaker answer

| Line | Verdict | Evidence | Rewording |
|---|---|---|---|
| GST collected more than the old taxes -> no like-for-like figure found | PASS | -14 | - |
| Collections rose every year -> fell 12.22 to 11.37 | PASS | -04 | - |
| "Alcohol and petrol are taxed under GST today" -> alcohol outside; five petroleum goods wait for a date | FIX | -03 is as at 2018; "today" and "wait" not rechecked (2017-GS2-11 NOTES say the same) | "...alcohol is outside; for the five petroleum goods CBIC (2018) says the Council will recommend a date." |
| Mixes with and without cess -> one basis; 22.09 with cess for 2024-25 | PASS | -07, -09 | - |

## 1c. Facts: narration

| Beat | Verdict | Evidence | Rewording |
|---|---|---|---|
| b00 "Two sets of GST totals are in circulation" | PASS | -07, -09 (cites -03, should cite -07, -09) | Fix the cite. |
| b01 | PASS | - | - |
| b02 Union eight heads, States nine | PASS | -01, -02 | - |
| b03 "Five petroleum goods wait for a date the Council recommends" | FIX | as above, -03 | "per the CBIC note of 2018" |
| b04 "7.41 ... 20.18" with cess | PASS | -04 | - |
| b05 "In twenty twenty-one it fell ... That was COVID. ... compensation at fourteen per cent growth on a twenty fifteen-sixteen base" | FIX | "Twenty twenty-one" should be 2020-21 (financial year); COVID cause is ours. 14%/2015-16: -12 | "In 2020-21 it fell. That was the pandemic year (our reading)." |
| b06 | PASS | - | - |
| b07 "No official figure shows that." | FIX | -14 NOT FOUND | "We found no official figure that shows that." |
| b08 cousins | PASS | - | - |

## 2. Exam fit (A1-A12)

| Rule | Verdict | Note |
|---|---|---|
| A1 / A3 | PASS | Enumerate (D1) and comment (D2); 140 words in 120-150. |
| A5 / A10 | PASS | Intro 14 words; close 12%. |
| A6 / A7 | PASS | Heads are named; revenue lines carry figures. |
| A9 diagram | FIX | Economics: "a graph or table". None on the sheet; the bar chart exists only in the narration. A six-row year-wise table (2017-18 nine months to 2024-25, with 2020-21 ringed) is drawable in a minute and carries the comment demand. |
| A11 current | FIX | Series stops at 2024-25. FY 2025-26 (-08: Rs 22,27,096 crore, +8.3%, ex-cess, provisional) is available; it cannot be mixed into the with-cess series. Add a clause on the other basis: "FY26 22.27 lakh crore without cess (GSTN, provisional)". Do not add cess yourself unless you label it ours (22.27 plus cess 1.05 gives about 23.3, our arithmetic from -08). |
| "Comment on revenue implications": missing but supported | FIX | (a) Who gained: -06 derived claim, both the Union's retained amount and the States' share are 1.7 times 2018-19 by 2023-24. (b) Compensation cess as a fiscal tool (-13). (c) The 2020-21 borrowing (2020-GS3-12-19). (d) The 56th Council rate cut (2017-GS2-11-24) as the forward point. Any one of (a) and (d), about 25 words, would turn a description into a comment; the answer now gives collection numbers with little interpretation. |
| A10 conclusion forward-looking | WARN | The close restates; a way-forward (rate rationalisation of Sept 2025, or the missing RNR figure) is absent. |

Counts (facts tables): PASS 15, FIX 10, FAIL 0. Exam fit: 1 WARN, 4 FIX.

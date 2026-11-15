# Audit (gate S5): 2022-ECO1-3B (deposit vs money multiplier; effect of card use)

Method: independent audit (gate S5), 11 Nov 2026, following 2024-gs2-12/AUDIT.md. Rows reopened at saved files (RBI Occasional Paper text, RBI Payment System Indicators June 2026, RBI Bulletin Jun 2022, NCERT/IGNOU searches). Card arithmetic re-run. Fixes applied in claims.csv (valid CSV, 13 columns); changed rows carry '[Audit 11 Nov 2026]'.

**Counts:** 11 rows: PASS 9, FIX 1 (-01), FLAGGED 1 (-11 BLOCKED). FAIL 0.

| claim_id | verdict | evidence | fix |
|---|---|---|---|
| 2022-ECO1-3B-01 | FIX | Occasional Papers Vol 43 No 2 (Awasthy, Misra, Dhal): 'inverse and statistically significant association with currency use' in Conclusion = Section VIII; 'overshadowed by the dominant income effect' in VII. Paper says views are the authors', not the RBI's | section cite corrected; attribution note |
| 2022-ECO1-3B-02 | PASS | Section VII: 'can potentially moderate' income effect and 'lower the currency-to-deposit ratio over time': matches; authors' inference | - |
| 2022-ECO1-3B-03 | PASS | Introduction: CiC/GDP peak 14.4% (2020-21); CAGR 51% volume, 27% value, 2016-17 to 2022-23 | - |
| 2022-ECO1-3B-04 | PASS | Section V: PoS cash 27% (2022) from 71% (2019), cited to FIS 2023 (secondary); Conclusion on precautionary motive | - |
| 2022-ECO1-3B-05 | PASS | PSI June 2026 Part I row 4, column 4: 6,783.52 lakh, Rs 2,36,660 crore; credit 5,812.59 / 2,01,362; debit 970.93 / 35,299 (credit + debit volume sums exactly; values differ by 1 crore, rounding). Part III row 1: cards 1,215.91 and 10,318.66 lakh | - |
| 2022-ECO1-3B-06 | PASS | Part II row 3.2 col 4: 3,984.29 lakh, Rs 2,16,359 crore; 216,359 / 35,299 = 6.13 | - |
| 2022-ECO1-3B-07 | PASS | Total Digital Payments Rs 3,17,64,092 crore: 0.745%; UPI Rs 28,92,139 crore: 8.18%; average card payment Rs 3,489 | - |
| 2022-ECO1-3B-08 | PASS | Bulletin note 12: (1+c)/(c+r), inversely related to cdr and reserve-deposit ratio (CRR plus excess reserves) | - |
| 2022-ECO1-3B-09 | PASS | 'deposit multiplier' absent from NCERT Ch 3, IGNOU Units 5, 8, 13 (text search); labelled our reading, UNVERIFIED | - |
| 2022-ECO1-3B-10 | PASS | Reasoning, labelled so on row, UNVERIFIED | - |
| 2022-ECO1-3B-11 | FLAGGED | BLOCKED; rbidocs PDF not reopened (CAPTCHA, not bypassed). 1.31/1.68 correctly unused | note extended |

## ECO16 ids cited in NOTES.md
All exist. CONFIRMED or CORRECTED and fitting: A04, A08, A09, A10, A14, I07, I08, N13, N15, N16, T07.
- **A07 is UNVERIFIED** (M3/RM about 5.65 from NCERT's printed tables, a misprint noted in its row). NOTES cites it as 'NCERT worked tie to RBI'; teach only as 'about 5 to 6 by NCERT's tables', never as an RBI figure, or drop it.
- A09 cdr (all deposits) is not IGNOU's demand-deposit cdr; NOTES already says so.
- Cross-folder cite of 2024-ECO1-4A-07 is valid (same bulletin; copy in sources/ has the same checksum).

## NOTES.md coverage
Part 1 supported by NCERT/IGNOU/RBI Bulletin; the two labels are our reading (-09). Part 2: theory is reasoning (-10); official evidence is a staff paper (authors' views, say so), card size from RBI PSI June 2026. 'Cards are small so the effect is small' is our inference; NOTES says so. No measured cdr fall caused by cards: NOT FOUND, correctly stated.

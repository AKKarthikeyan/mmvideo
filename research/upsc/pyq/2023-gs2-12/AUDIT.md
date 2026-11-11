# Audit (gate S5): 2023-GS2-12 (constitutional perspectives of gender justice)

Method: independent audit (gate S5), 10 Nov 2026. Every row of claims.csv was reopened at its saved local file (PDF page text re-extracted with pdftotext, or saved HTML/JSON text) at the cited page or section, and value, attribution, status and wording were compared. Page numbers are PDF page indices. Fixes were applied directly in claims.csv (valid CSV re-checked with python3 -I csv); each changed row carries an '[Audit 10 Nov 2026]' note. Mirror use (Indian Kanoon) was checked for an explicit statement on the row.

**Counts:** 24 rows: PASS 18, FIX 5 (-05, -08, -14, -20, -23), FAIL 0, FLAGGED 1 (-18).

| claim_id | verdict | evidence | fix |
|---|---|---|---|
| 2023-GS2-12-01 | PASS | Constitution PDF p.38 Art 15(3) text matches | - |
| 2023-GS2-12-02 | PASS | Arts 39(a),(d),(e) PDF p.52 and 42 p.53 match | - |
| 2023-GS2-12-03 | PASS | Art 51A(e) PDF p.56 ('to renounce practices derogatory to the dignity of women') matches | - |
| 2023-GS2-12-04 | PASS | 243D(3)-(4) p.152 and 243T(3) p.161 match | - |
| 2023-GS2-12-05 | FIX | Act ss.1(2), 2-5, Arts 330A/332A/334A text and pages (221, 223, 224) verified; note said POL03-C21 is UNVERIFIED but it is now CONFIRMED with the footnote caveat | note corrected |
| 2023-GS2-12-06 | PASS | IK mirror stated; bench, date, Art 32/141, guideline 7, 51(c) read; (1997) 6 SCC 241 not shown in the mirror but correct | - |
| 2023-GS2-12-07 | PASS | IK mirror; paras 56-57: s.198 CrPC declared unconstitutional; Sowmithri Vishnu and V. Revathi overruled; bench matches | - |
| 2023-GS2-12-08 | FIX | Court copy of Navtej exists in 2017-gs2-12/sources/navtej.pdf, so the mirror is not needed; content verified (Chandrachud J. p.442, Misra CJI pp.165-166, Malhotra J. conclusions pp.493-494) | Court copy added as second source |
| 2023-GS2-12-09 | PASS | IK mirror: Order 3:2; para 45 sits inside Nariman J.'s opinion; row states the limit | - |
| 2023-GS2-12-10 | PASS | IK mirror: 6 Dec 2007, Sinha and Bedi JJ., paras 3, 42, 55 match | - |
| 2023-GS2-12-11 | PASS | IK mirror: 17 Feb 2020, paras 54, 61, 70 match | - |
| 2023-GS2-12-12 | PASS | IK mirror: Nitisha para 119 matches; bench Chandrachud, Shah, Khanna JJ. | - |
| 2023-GS2-12-13 | PASS | IK mirror: 24 Feb 1986 Bhagwati CJ and Pathak J.; closing paragraph matches; CORRECTED status right | - |
| 2023-GS2-12-14 | FIX | Paras 88-90 (read down, Arts 14/15/21, POCSO, prospective, no view on marital rape) are Deepak Gupta J.'s concurring opinion (paras 87-90); Lokur J. reads Exception 2 at paras ~103-106 | attribution and paras corrected |
| 2023-GS2-12-15 | PASS | IK mirror: 11 Aug 2020, para 129(i)-(iii) match | - |
| 2023-GS2-12-16 | PASS | PIB 13 Oct 2025 and 15 Jul 2019 text match | - |
| 2023-GS2-12-17 | PASS | PIB 13 Oct 2025 figures match | - |
| 2023-GS2-12-18 | FLAGGED | Gap record, correctly UNVERIFIED; Sabarimala now covered by -23/-24; NALSA and Sukanya Shantha unread | - |
| 2023-GS2-12-19 | PASS | s.2(n) five limbs match | - |
| 2023-GS2-12-20 | FIX | s.2(a)(ii) and s.2(o) match; the 'clause (o)(v) cut off' note is stale, full words now confirmed, (o)(vi) dwelling place | note corrected |
| 2023-GS2-12-21 | PASS | s.3(1)-(2) match | - |
| 2023-GS2-12-22 | PASS | s.4(1)-(3) match; handle 514901 | - |
| 2023-GS2-12-23 | FIX | Conclusions (iii)-(xii) are on pp.92-95; p.96 is Nariman J. | page corrected |
| 2023-GS2-12-24 | PASS | Sabarimala Malhotra J. para 16 (i)-(vi), PDF pp.410-411, quotes match; 4:1 from signatures | - |

## NOTES.md coverage

All four demands in NOTES.md map to rows; ledger ids B01, B04, B08, D08, E01, F01, I04 (and I02, I01, I07, B05, C21) exist and are CONFIRMED. Unsupported: the Preamble (named in NOTES.md but no claim row supports it); NALSA 2014 and Sukanya Shantha 2024 (unread); the Muslim Women (Protection of Rights on Marriage) Act 2019, PWDVA 2005, Hindu Succession (Amendment) Act 2005 and dowry laws (texts not retrieved); the date the 106th Amendment's seat reservation starts to operate (Legislative Department file is internally unclear; Art 334A says after delimitation); the Maternity Benefit Act's current legal home (Codes not checked). Case copies other than Sabarimala are Indian Kanoon mirrors and each row says so; Navtej's Court copy is held (see -08).

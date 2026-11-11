# Audit (gate S5): 2024-GS1-18 (why underprivileged sections miss full benefit of affirmative action)

Method: independent audit (gate S5), 10 Nov 2026. Every row of claims.csv was reopened at its saved local file (PDF page text re-extracted with pdftotext, or saved HTML/JSON text) at the cited page or section, and value, attribution, status and wording were compared. Page numbers are PDF page indices. Fixes were applied directly in claims.csv (valid CSV re-checked with python3 -I csv); each changed row carries an '[Audit 10 Nov 2026]' note. Mirror use (Indian Kanoon) was checked for an explicit statement on the row.

**Counts:** 23 rows: PASS 17, FIX 4 (-02, -07, -12, -15), FAIL 1 (-18), FLAGGED 1 (-19).

| claim_id | verdict | evidence | fix |
|---|---|---|---|
| 2024-GS1-18-01 | PASS | pib_repr_1579065: 17.49/8.47/21.57 per cent, 78 Ministries, 1.1.2016; 16.55 per cent 1.1.2012 | - |
| 2024-GS1-18-02 | FIX | 2019 PIB gives all figures (para 4); the 2021 reply gives only the 31.12.2016 split 8,223/6,955/13,535, not 92,589 or 63,876 | page_or_section corrected |
| 2024-GS1-18-03 | PASS | pib_unfilled_1741816 table: all twelve values match; column order verified | - |
| 2024-GS1-18-04 | PASS | pib_2093839: over 4 lakh 2016-2023 v 1.08 lakh 2004-2013; SC/ST met 15/7.5 at 1.1.2024; OBC above 27 in direct recruitment | - |
| 2024-GS1-18-05 | PASS | OM 13 Sep 2017 paras 1-3 match, effective 1 Sep 2017 | - |
| 2024-GS1-18-06 | PASS | PIB 5 Feb 2020 text matches (MoS Krishan Pal Gurjar, B.P. Sharma committee 8.3.2019, report 17.9.2019) | - |
| 2024-GS1-18-07 | FIX | 'Under Article 340' is not in the PIB release; the 'in 2007' text is Mithal J. para 49, PDF p.537, not p.27 | claim trimmed; note corrected |
| 2024-GS1-18-08 | PASS | Davinder Singh PDF pp.138-139 para 205(e)-(f) | - |
| 2024-GS1-18-09 | PASS | p.139 para 205(f)(i)-(ii) | - |
| 2024-GS1-18-10 | PASS | pp.139-140 para 205(f)(iii) | - |
| 2024-GS1-18-11 | PASS | p.20 summary item g (i)-(iv) | - |
| 2024-GS1-18-12 | FIX | Para 6 (Act, 2006) on p.7, para 7 and ss.4(2),(5) on p.8; 's.4(5) ... if available' | page to pp.7-8 |
| 2024-GS1-18-13 | PASS | Trivedi J. paras 67-69 pp.495-497; Nath J. p.422-423, Mithal J. para 83 pp.560-561, Sharma J. para 2 p.565 favour excluding creamy layer (POL03-C16 pages) | - |
| 2024-GS1-18-14 | PASS | pib_aishe_1999713: all figures match; shares 15.3/6.3/37.6 recomputed | - |
| 2024-GS1-18-15 | FIX | Figures match; but note said OBC share 'matches' 27 per cent: it is 40.0 per cent | note corrected |
| 2024-GS1-18-16 | PASS | pib_central_inst_2294032: 15/7.5/27 per cent text matches | - |
| 2024-GS1-18-17 | PASS | pib_2002992 matches (committee wording fully readable now) | - |
| 2024-GS1-18-18 | FAIL | Figures from a search summary; Committee report unread (BLOCKED) | note: FAIL, do not use |
| 2024-GS1-18-19 | FLAGGED | NOT FOUND record, correctly UNVERIFIED | note |
| 2024-GS1-18-20 | PASS | DoPT AR 2024-25 PDF p.43 para 4.8 table: every figure matches | - |
| 2024-GS1-18-21 | PASS | AR PDF pp.42-43 paras 4.2-4.7 match | - |
| 2024-GS1-18-22 | PASS | LS AU687 text matches | - |
| 2024-GS1-18-23 | PASS | LS AU1384 text matches (quota wording is for all-India open competition) | - |

## NOTES.md coverage

Demands 1-3 in NOTES.md are mapped to rows; POL03-B05, B06, B07, B09, B10, C02, C17, C18, C22, C23, C15, C16 all exist (C22 is the 50 per cent cap OM, C16 holds Gavai J. para 295 with other judges' pages). Three typos corrected in NOTES.md (cabinet row is -19 not -20; Ledger C22 is not a vacancy table; Rohini '2007' is Mithal J. para 49). Unsupported: current unfilled backlog (DoPT gives none, -22/-23); group-wise vacancies; faculty representation in central universities; Parliamentary Committee figures (-18); Cabinet stand after Aug 2024 (-19); Rohini recommendations and number of sub-categories; OBC creamy-layer limit after 9 Feb 2022 not checked (the DoPT AR 2024-25 still says Rs 8 lakh 'presently'). Indra Sawhney (POL03-C03) is UNVERIFIED in the ledger.

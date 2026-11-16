# Audit (gate S5): 2017-GS2-12 (scope of Fundamental Rights after the privacy judgment)

Method: independent audit (gate S5), 10 Nov 2026. Every row of claims.csv was reopened at its saved local file (PDF page text re-extracted with pdftotext, or saved HTML/JSON text) at the cited page or section, and value, attribution, status and wording were compared. Page numbers are PDF page indices. Fixes were applied directly in claims.csv (valid CSV re-checked with python3 -I csv); each changed row carries an '[Audit 10 Nov 2026]' note. Mirror use (Indian Kanoon) was checked for an explicit statement on the row.

**Counts:** 21 rows: PASS 12, FIX 8 (-09, -11, -15 to -20; mostly page or part cites, -15 a missing conclusion), FAIL 0, FLAGGED 1 (-21).

| claim_id | verdict | evidence | fix |
|---|---|---|---|
| 2017-GS2-12-01 | PASS | Order of the Court pp.546-547 items (i)-(iv); nine signatures | - |
| 2017-GS2-12-02 | PASS | Part A pp.5-7: 8 and 6 judges, 18 Jul 2017 reference, Order para 1 names six opinions | - |
| 2017-GS2-12-03 | PASS | p.262 3(A)-(B); Part G p.101 'primordial rights' present | - |
| 2017-GS2-12-04 | PASS | p.262 3(C)-(D) | - |
| 2017-GS2-12-05 | PASS | pp.262-263 3(E)-(F) | - |
| 2017-GS2-12-06 | PASS | p.263 3(G) 'felt necessities of time' | - |
| 2017-GS2-12-07 | PASS | p.264 3(H) | - |
| 2017-GS2-12-08 | PASS | p.264 3(I) and 5; Srikrishna OM 31 Jul 2017 at p.260 para 185 | - |
| 2017-GS2-12-09 | FIX | Gopalan silos Part D/E and p.238; 'seriously flawed' p.118 para 119; 'must be and is accordingly overruled' is p.120 para 121 | page extended to pp.118-120 |
| 2017-GS2-12-10 | PASS | Part I paras 124-128 pp.121-125 | - |
| 2017-GS2-12-11 | FIX | Quote starts p.539 (para 79) and ends p.540 | page to pp.539-540 |
| 2017-GS2-12-12 | PASS | pp.83-84 para 84 | - |
| 2017-GS2-12-13 | PASS | cross-reference: POL03-D08 (Art 21) and D10 (Maneka 'right and just and fair') exist, CONFIRMED | - |
| 2017-GS2-12-14 | PASS | cross-reference: POL03-A01, A03-A05, A10, D13, D15, X06 all exist, CONFIRMED | - |
| 2017-GS2-12-15 | FIX | Conclusion (viii) (privacy a fundamental right after Puttaswamy) was not in the cite; (ii),(vii),(xvi)-(xviii) verified pp.156-166 | cite extended with (viii) |
| 2017-GS2-12-16 | FIX | (i) on p.156; (vi) pp.159-160, not 156-161 | page corrected |
| 2017-GS2-12-17 | FIX | Quote is under PART F at p.332, not Part E | part corrected |
| 2017-GS2-12-18 | FIX | Four-stage test is item (e) on p.549 (not 548); triple test p.546; Sikri J. for CJI, himself, Khanwilkar J. | page corrected |
| 2017-GS2-12-19 | FIX | 'dignity as a facet' p.547; 'minimal intrusion' p.550 item (i); dignity-v-dignity p.551 | pages 547-551 |
| 2017-GS2-12-20 | FIX | Items (i)-(iv) p.545, (v) ends p.546 | pages 545-546 |
| 2017-GS2-12-21 | FLAGGED | BLOCKED record, no claim made; correct handling | note |

## NOTES.md coverage

All six parts in NOTES.md are mapped to existing rows. Ledger ids D09, D12, D14, D15, D13, D10, A01, X06, L03 verified present. Unsupported: Joseph Shine (2018) Court copy not reached (-21), so do not claim how it used privacy and dignity; separate opinions of Nariman, Bobde, Chelameswar and Sapre JJ. not mined; Aadhaar dissent not mined. The 'overruled' wording for ADM Jabalpur is now cited at p.120. Navtej and Aadhaar rows are 2018 follow-ups, beyond a strict reading of 'latest judgment' (NOTES says optional).

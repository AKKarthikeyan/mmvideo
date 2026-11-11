# Audit (gate S5): 2024-GS2-12 (Art 21 privacy; DNA test of a child in the womb)

Method: independent audit (gate S5), 10 Nov 2026. Every row of claims.csv was reopened at its saved local file (PDF page text re-extracted with pdftotext, or saved HTML/JSON text) at the cited page or section, and value, attribution, status and wording were compared. Page numbers are PDF page indices. Fixes were applied directly in claims.csv (valid CSV re-checked with python3 -I csv); each changed row carries an '[Audit 10 Nov 2026]' note. Mirror use (Indian Kanoon) was checked for an explicit statement on the row.

**Counts:** 18 rows: PASS 12, FIX 4 (-06, -07, -12, -14; all page cites), FAIL 1 (-17), FLAGGED 1 (-18, correctly UNVERIFIED).

| claim_id | verdict | evidence | fix |
|---|---|---|---|
| 2024-GS2-12-01 | PASS | Puttaswamy p.262 3(B)-(C) match | - |
| 2024-GS2-12-02 | PASS | p.262 3(E) match | - |
| 2024-GS2-12-03 | PASS | p.263 3(F) match | - |
| 2024-GS2-12-04 | PASS | p.264 3(H) match | - |
| 2024-GS2-12-05 | PASS | Firodia pp.71-72 para 36: appeal allowed, other evidence of infidelity not barred | - |
| 2024-GS2-12-06 | FIX | s.112 'conclusive proof' and 280 days are on PDF p.18; burden of proof p.19 | page corrected to pp.18-19 |
| 2024-GS2-12-07 | FIX | Five Goutam Kundu principles are on p.33; para 11.2(i) starts p.32 | page corrected to pp.32-33 |
| 2024-GS2-12-08 | PASS | Firodia p.33 para 11.2(ii): Bhabani Prasad Jena summary matches | - |
| 2024-GS2-12-09 | PASS | p.31 para 11.1: Sharda (2003) 4 SCC 493, 'not mechanically' match | - |
| 2024-GS2-12-10 | PASS | p.32 para 11.2: both quotes match | - |
| 2024-GS2-12-11 | PASS | pp.25-27: Dipanwita Roy (2015) 1 SCC 365 facts and adverse inference match | - |
| 2024-GS2-12-12 | FIX | Art 8 CRC passage is on p.43; quotes at p.40 verified word for word | page corrected to pp.40-43 |
| 2024-GS2-12-13 | PASS | p.71 para 33 and p.72 paras 35-36 match ('pawn' is para 33, Ramasubramanian J.) | - |
| 2024-GS2-12-14 | FIX | 'may' not 'shall' is para 31 p.70 and para 9.1 p.24; 'not prudent in every case' is p.48; old cite p.27 is the Dipanwita Roy extract | page_or_section corrected |
| 2024-GS2-12-15 | PASS | indiacode_bsa_s116.txt text matches; Act 47 of 2023, enforcement 1-7-2024 as stated | - |
| 2024-GS2-12-16 | PASS | indiacode_pcpndt_s4.txt s.4(2)-(4) match; 'paternity not listed' is our reading, flagged on row | - |
| 2024-GS2-12-17 | FAIL | Source is a law-site report (LiveLaw); Court copy never obtained; row itself notes opposite headnote on another site | note: FAIL, do not use; status stays UNVERIFIED |
| 2024-GS2-12-18 | FLAGGED | NOT FOUND record, correctly UNVERIFIED. Ivan Rathinam (2025 INSC 115, in sources/) is a CrPC s.125 case, nothing on a foetus | note extended |

## NOTES.md coverage

Part 1 (privacy within Art 21): supported by -01 to -04 and POL03-D08, D12, D13, D15, L05 (all exist, CONFIRMED). Part 2 (DNA paternity law): supported by -05 to -16. Unsupported: the 'child in the womb' limb has no case law (-18 NOT FOUND; -17 Nikhat Parveen 2026 is FAIL and is a post-birth case anyway). The answer on a foetus can only be reasoning by analogy (s.112/s.116 speak of a child 'born'; PC-PNDT s.4(2)-(4) closed list; consent; Puttaswamy), as NOTES.md already says. Also unsupported: rape-case foetal DNA and MTP Act; Goutam Kundu, Bhabani Prasad Jena, Sharda and Dipanwita Roy are read only through Firodia's quotations.

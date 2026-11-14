G6: PASS

# W3-10 Kerala land: independent check (G6, Shorts lite), 8 Nov 2026

Method: live S01 re-fetched (desagri.gov.in archive page, "Revised-Final-LUS-publication-2023-24" PDF); its SHA-256 is identical to sources/lus_2023_24.pdf, and Table II and Table 5 text re-extracted with pdftotext. S02 read from the saved copy. S03 (census xlsx) read from the saved copy only: the live download was not re-fetched (only the catalog page https://censusindia.gov.in/nada/index.php/catalog/42526 was found by search); I re-parsed the xlsx myself with the Python standard library (zip + XML), not the researcher's script.

| Claim | Result | Evidence |
|---|---|---|
| C01 | PASS | xlsx row 32/KERALA/Total: pop 33406061, area 38852, density 860 |
| C02 | PASS | Bihar 1106, West Bengal 1028, Kerala 860 in xlsx; researcher ranking shows 5 UTs ahead, Kerala 8th of 35 |
| C03 | PASS | Live PDF Table II: Kerala 0.2+0.0+2.6+1.3+1.5 = 5.6; ALL INDIA 5.4+3.3+3.8+3.6+4.9 = 21.0; 1/17.7 and 1/4.8 |
| C04 | PASS | Live PDF Table II Kerala row: forest 27.8, non-agri 15.7, NSA 50.8 |
| C05 | PASS | Live PDF Table 5 (Kerala): non-agri 526 (2014-15) and 610 (2023-24p); 84/526 = 16.0%. Net sown 2043 to 1973 per Table 5 contd. (-70) |
| C06 | PASS | S02 text A.1, A.2, A.6 match the quoted words (forest also "or administered as forest") |
| C07 | PASS | xlsx Kerala Total: 1017 inhabited, 1 uninhabited, 520 towns |
| C08 | PASS | xlsx: urban 15,934,926 / 33,406,061 = 47.7%; 7598.8 / 38852 = 19.6%; densities 2097 and 559 |
| C09 (non-spine) | PASS | Table 5 col.4 = 1082 in all ten Kerala rows |
| C10 (non-spine) | PASS | Re-ranked output: Kerala 10th lowest by B among 36 states/UTs (ALL INDIA row excluded); Punjab 3.0, West Bengal 3.5 lower |

Method re-runs: lus_idle_share.py and kerala_decade_change.py reproduce the saved outputs exactly (python3 -I). census_a01_kerala.py cannot run here (openpyxl is not installed); I reproduced its Kerala, Bihar and West Bengal figures by hand-parsing the xlsx. Basis consistency: land shares all LUS 2023-24 (p); people and villages all Census 2011; the mixed-basis figure (~1,192) is marked DO NOT USE in conflicts.md and is not in any claim or the beat list. OK.

Statuses: VERIFIED-P is honest (each figure is stated by the publisher). No tier-X source. Myths M1-M3 verdicts match the evidence.

Notes and wording risks:
- S01 and S02 are P2, S03 is P1. The sources.jsonl url fields are only site roots; fix by adding https://desagri.gov.in/wp-content/uploads/2025/10/Revised-Final-LUS-publication-2023-24-to-be-uploaded-printed_compressed.pdf for S01 and the NADA catalog page above for S03 (not a blocker).
- 2023-24 is the provisional year and the desagri page now also carries a 2024-25 edition; the script should say "provisional" or "2023-24" and not "latest".
- "Idle" must not be shortened to "empty" (the dossier already says this). Kerala is the 10th, not the lowest, in idle share; do not imply it is the extreme.
- "Forest" is a legal class (wooded or not): keep beat 10 as written.
- C05 "grew 16%" is land under non-agricultural uses; do not say "built-up".

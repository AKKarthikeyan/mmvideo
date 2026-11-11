# Audit (gate S5) of 2017-gs1-17

Auditor: independent reviewer, 2026-11-10. Did not write the ledger.

## Method
Recomputed rows 01-04 from the saved UN WPP 2024 CSV and rows 07-09 from the saved FAOSTAT normalized CSV (flags checked). Re-read FAO strategy PDF, JMA page and Geen 2020 text at the cited passages. For IPCC AR6 Ch.8 (rows 11, 13) checked the saved copy and then downloaded the live final PDF from the cited URL once. Ledger ids named in NOTES (M001-M118 list) all exist in GEO-07/claims.csv.

## Counts
PASS 11, FIX 3, FAIL 0 (of 14 rows). FIXes are applied in claims.csv.

## Table
| claim_id | verdict | evidence | fix |
|---|---|---|---|
| 2017-GS1-17-01 | PASS | Recomputed from the saved WPP 2024 CSV: World 8,161,972,572; Asia 4,806,898,007 = 58.89%. |  |
| 2017-GS1-17-02 | PASS | Recomputed: E 1,656,115,405 + SE 695,149,428 + S 2,064,056,491 = 4,415,321,324 = 54.10%; shares 25.3/20.3/8.5. |  |
| 2017-GS1-17-03 | PASS | Recomputed: India 1,450,935,791 + China 1,419,321,278 = 2,870,257,069 = 35.17%; Indonesia 283.5m, Pakistan 251.3m, Bangladesh 173.6m, Viet Nam 101.0m. |  |
| 2017-GS1-17-04 | PASS | Recomputed: 1950 three regions 1,300,537,920 of 2,493,092,848 = 52.17%; Asia 54.87%; ratio 3.39x. |  |
| 2017-GS1-17-05 | PASS | Geen et al. 2020 Plain Language Summary: monsoons 'influencing over one third of the world's population'. CONFLICT label right. |  |
| 2017-GS1-17-06 | FIX | FAO strategy text: 'central to the food security of about half of the world population', 'more than 90 percent of world rice production and consumption', 'around 140 million rice-farming households': all present. But FAOSTAT 2024 (claim 07) gives Asia 89.4%, so '>90%' is FAO's rounded older figure. | note added: use FAOSTAT 89.4% for any number on screen; '>90%' only as FAO's wording |
| 2017-GS1-17-07 | PASS | Recomputed from FAOSTAT CSV: Asia 733,657,460 t of world 820,223,278 = 89.45%; area 147,043,505 of 172,414,425 = 85.3%; 2023 Asia 721.2 Mt of 804.7 Mt; flag A. |  |
| 2017-GS1-17-08 | PASS | Recomputed: India 217.87, China 209.17, Bangladesh 60.57, Indonesia 53.14, Viet Nam 43.45 Mt; shares 26.6/25.5/7.4/6.5/5.3; five = 71.2%; Thailand 33.6, Myanmar 27.65 (flag X). |  |
| 2017-GS1-17-09 | PASS | FAO text: 'Of the total rice area in Asia of 144 million hectares ... 60 percent irrigated, 34 percent rainfed lowland ... 6 percent rainfed upland'. FAOSTAT 2023 Asia area 144.3 Mha agrees. |  |
| 2017-GS1-17-10 | PASS | FAO text: 'multiple sources of risk, with the major sources being instability in rainfall and market prices. Large swings ... insufficient or excessive rainfall, especially in rainfed areas'. |  |
| 2017-GS1-17-11 | FIX | Wording is right (SAsiaM JJAS, EAsiaM JJA, six regional monsoons), but the saved local copy (ipcc_ar6_wg1_ch08.pdf / ipcc_ch08.txt) is the 'Final Government Distribution - Do Not Cite' draft, not the final published PDF the row names. Reopened the live final PDF at the cited URL: same text. | source description corrected: saved copy is the draft; verified against the live final (PDF p.41, Fig 8.11 caption) |
| 2017-GS1-17-12 | PASS | JMA page: Baiu early June to late July except Hokkaido; Okinawa/Amami about a month earlier; Okinawa ~10 May-21 June; Kanto/Koshin ~7 June-19 July. |  |
| 2017-GS1-17-13 | FIX | Same problem as 11: sentence 'Large human populations in the monsoon regions of the world heavily depend on freshwater supply for agriculture, water resources, industry, transport and various socio-economic activities' is in the live final PDF (sec 8.3.2.4, PDF p.40); the saved copy is the Do-Not-Cite draft. Row says 'other' where the text says 'various'. | draft/final labelled, page filled in, 'other' replaced by 'various' |
| 2017-GS1-17-14 | PASS | Pointer row: ledger GEO-07 M087 exists and holds the NCERT Class X kharif/rice >100 cm statement. Not re-read at NCERT here (row says so); the ledger row is that ledger's responsibility. |  |

## NOTES.md mapping
NOTES.md maps Part A (characteristics) to M-ids plus -10, -11, -12 and Part B (feeding) to -01 to -09, -13. Premise flag is correct and supported by -02, -04, -05: 'more than 50 percent in Monsoon Asia' holds only for whole UN regions (54.1%), an upper bound. Unsupported parts (as NOTES says): a single official figure for people living under the Asian monsoon; FAO per-country rice consumption; Indochina onset dates. Added: FAO's '>90%' vs FAOSTAT 89.4% tension (row 06).

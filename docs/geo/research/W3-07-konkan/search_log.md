# W3-07 Konkan Railway: search log (Shorts lite mode; run 1 on 1 Nov 2026 interrupted, finished 8 Nov 2026)

Researcher: Claude (research agent). Pitch tested: "Konkan Railway: the line they said could not be built". Lite mode (AK, 1 Nov 2026): 2-3 original sources.

Examined sources: 3 cited (S01 KRCL, S02 Rajya Sabha answers, S03 Sida Evaluation 97/25)
Saturation: yes (lite: all 8 spine claims verified in these three; no further search)

Run 1 (1 Nov) saved more than lite mode needs. Those copies stay in `sources/` but were NOT used as evidence and were not re-read on 8 Nov: Lok Sabha answers (`ls_answers/`, found by `method/ls_search.py`), ~120 other Rajya Sabha answers 1960-2025 (`rs_answers/`, found by `method/rs_search.py`), 3ie report IE114 (`3ie/`), Ratnagiri District Gazetteer 1880 OCR (`gaz/`), KRCL achievements PDF 2025, KRCL system map 2026, KRCL MCA filing, ICCHGE 2013 conference page. `sources/t.out` and `sources/x.out` are fetch leftovers (no evidence). Nothing was fetched on 8 Nov.

| # | Source opened | How found | Kept for |
|---|---|---|---|
| 1 | KRCL website: The Beginning, Introduction, Salient Features, Construction Challenge; Annual Report 2011-12; Coffee Table Book 2023 (S01) | konkanrailway.com, the owner | C02-C07, C09, C11, C12 |
| 2 | Rajya Sabha written answers 11 Aug 1969 (Q 464) and 27 Jun 1980 (Q 1171) (S02) | Rajya Sabha question API, title search "Konkan Railway" | C01, C02 |
| 3 | Sida Evaluation 97/25, Karlis Goppers (S03) | cited by KRCL's Construction Challenge page; PDF from cdn.sida.se, OCR made locally | C04, C07, C08, C10 |

Searched for a named person or report saying the line "could not be built": none found in S01-S03 (grep for impossib*, not feasib*, not possible, impractical*). See myths.md M1.

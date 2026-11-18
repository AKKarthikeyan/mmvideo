# W3-14-shape-quiz "Guess the Indian state from its shape": search log (lite)

1 Nov 2026 run (interrupted after saving sources) + 8 Nov 2026 finish under SHORTS LITE MODE (2-3 original sources).

## Kept (cited in claims.jsonl)
| Src | What | Why |
|---|---|---|
| S01 | Census 2011 Table A-01 (ORGI; areas from Survey of India), xlsx + text extract of the rows used | Area ranks, populations, Kanniyakumari district rows |
| S02 | States Reorganisation Act 1956, India Code consolidated text | 1956 formation of MP (s.9); Kanyakumari taluks to Madras (s.4) |
| S03 | House Natural Earth outlines, public/geo/_shared/geo.json, measured by us | Keys exist; neighbours; no foreign land border |

## Opened and NOT kept
- Kerala Alternative Name Bill 2026 (sources/kerala_alt_name_bill_2026.*): saved on 1 Nov when Kerala was a candidate; Kerala is now excluded (used by another Week 3 Short).
- Capitals: knowindia.india.gov.in timed out twice (8 Nov); india.gov.in profile/states pages returned 404; India Code search timed out. Not widened further (lite cap). Capital clue dropped (open_questions 1).

## Computations
`method/shape_quiz.py` -> `method/shape_quiz_output.txt`; `method/census_extract.py` -> `sources/census2011_A01_extract.txt` (python3 -I, 8 Nov).

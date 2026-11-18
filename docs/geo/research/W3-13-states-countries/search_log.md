# W3-13-states-countries "If Indian states were countries": search log (lite)

1 Nov 2026 run (interrupted) + 8 Nov 2026 finish under SHORTS LITE MODE (2-3 original sources). Kept sources are the three that own the numbers.

## Kept (cited in claims.jsonl)
| Src | What | Why |
|---|---|---|
| S02 | NCP Technical Group, Population Projections 2011-2036, Table 11 (1 July), text excerpt (re-used from W3-01-up's verified PDF) | Official state projection for 2026 |
| S03 | UN DESA WPP 2024, total population, medium variant, 1 July (CSV re-used from W3-01-up) | Country populations, same date |
| S05 | Natural Earth 1:10m admin-0 (India view) + admin-1, house copies | Our own area for state and country on one basis |

## Opened on 1 Nov and NOT kept (lite cap or unusable)
- Census 2011 A-01 (state counts and areas): replaced by NCP 1 July 2011 and Natural Earth areas so one basis serves both sides; 1 Nov extracts remain in method/.
- World Bank WDI surface area (FAO), GDP current US$, official exchange rate, India metadata (fiscal-year note), GDP definition: GDP leg dropped (open_questions 1); area replaced by Natural Earth. Copies in sources/ (local only).
- RBI Handbook of Statistics on Indian States index page; Table 21 XLSX/PDF returned a bot-check page (not bypassed); data.gov.in (HTTP 403); mospi.gov.in GSDP page (certificate rejected); esankhyiki (JavaScript shell).
- PIB Census 2027 deck: verified in W3-01-up; not re-cited.
- Tier X seen only as search snippets, never opened as evidence: Wikipedia GDP-by-state list, indiastat, factodata, dataful.

## Computations
`method/lite_pairs.py` -> `method/lite_pairs_output.txt` (8 Nov; python3 -I). Earlier: `combined_world.py`, `match_countries.py`, `states_pop_rank.py`, `pairs.py`, `area_ne_pairs.py` with saved outputs. Backups of the 1 Nov ledgers: `method/*_1nov_full.jsonl.bak`.

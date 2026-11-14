G6: PASS. All 13 spine claims pass on independent re-check (round 2, 1 Nov 2026); all measurements reproduce exactly. Round 1 (FAIL) found C008 percentage mislabelled and C011 citing World Bank instead of UNSD; both now fixed and re-verified.

# W3-05 Rajasthan vs Europe: independent verification (G6), 1 Nov 2026

Checker did not do the research. Every public source was re-fetched on 1 Nov 2026 and compared byte for byte with the saved copy where possible; every `method/` script was re-run with `python3 -I`; three computations were redone independently (see below).

## What was re-fetched and compared
| Source | Re-fetch result |
|---|---|
| S03 UNSD DYB 2022 Table 3 PDF | byte-identical to saved copy; I re-extracted the Europe block with `pdftotext -layout` and read every figure by eye |
| S02 UN M49 overview page | byte-identical; I parsed region code 150 myself: 306 cells = 51 countries/areas x 6 languages |
| S01 Census 2011 A-1 xlsx (censusindia.gov.in catalog 42526, file 46152) | byte-identical; re-parsed: Rajasthan 342239 |
| S07 Finland in Figures 2026 PDF | byte-identical; Area 338 493, Land 304 068, Fresh water 34 424, Sea water 52 414 |
| S08 SSB table 11342 (API) | re-queried; Area 2025 and 2026 = 323,805; note "whole country = mainland without Svalbard and Jan Mayen"; "Seawater excluded. Fresh water included." |
| S06 Eurostat reg_area3 | re-queried: DE 357,569; ES 505,983; FR 638,475; IT 302,079 (2021-23); PL 311,928; SE 447,424; FI 338,411 (2018-23), 338,363 (2024-26); NO 384,486 (2021-23); NO0B 60,676; UK 244,423 (2021-23) |
| S09 Destatis | page differs from saved copy only in the generated-on timestamp; Bodenfläche insgesamt 357 683, includes Gewässer 8 256 (so total incl. inland water) |
| S15 SSB table note | note 1 text confirmed |
| S12 NITI digital library | sentence "An area of 3.42 lakh sq. kms. of Rajasthan makes it today the largest State in the country." found on the live page |
| S13 USGS PP 1395 | same size as saved PDF (22,466,124 bytes); saved text lines 2615-2616 carry the quoted sentence |
| S04 FAOSTAT bulk | re-downloaded; Country area 2024: Norway 62450, Sweden 52886, Finland 33848.5, Germany 35768 (1000 ha) |

## Spine claims
| Claim | Verdict | Evidence |
|---|---|---|
| C001 Rajasthan 342,239 | PASS | A-1 row Rajasthan Total, Area 342239; footnote "State/District area figures are provided by Survey of India"; NITI 3.42 lakh corroborates |
| C003 M49 Europe 51 / 44 states, all Russia | PASS | My own parse gives 51 rows; minus Åland, Faroe, Gibraltar, Guernsey, Isle of Man, Jersey, Svalbard and Jan Mayen = 44 (Holy See counted). Russian Federation (643) is a single Europe row |
| C004 six larger states and their areas | PASS | DYB: Russia 17 098 246; Ukraine 603 500; France 551 500; Spain 506 009; Sweden 438 574; Germany 357 581; all read in my own pdftotext |
| C005 38 of 44 (86%); 45 of 51 | PASS | `dyb_europe.py` reproduces; 38/44 = 86.4%; I confirmed no smaller state exceeds 342,239 (next is Finland 336,884) |
| C006 Finland 338,493, +3,746 (1.1%) | PASS | Statistics Finland table as quoted; 342,239-338,493 = 3,746; 1.09% of Rajasthan, 1.11% of Finland. Eurostat 338,411/338,363 and FAO 338,485 agree within 0.5% |
| C007 Norway mainland vs Kingdom | PASS | SSB 323,805 (mainland, incl. fresh water); Eurostat 384,486 = 323,810 + 60,676; UNSD lists Norway 323 772 and Svalbard and Jan Mayen 62 422 separately. Hedging is correct |
| C008 Germany 357,683, 15,444 more (round 1: percentage mislabelled; fixed) | PASS (round 2) | Destatis 357 683 and DYB 357 581 correct. But 15,444 / 342,239 = 4.51%, so Germany is 4.5% larger; 4.3% (15,444 / 357,683) is how much smaller Rajasthan is. Fix: "Germany is 4.5% larger than Rajasthan; equivalently Rajasthan is 4.3% smaller." Dossier safe-to-say fact 5 "Germany is only 4% bigger" should read "about 4.5% bigger" or "Rajasthan is 4% smaller" |
| C009 no state between Finland and Germany | PASS | sorted DYB list: Germany 357,581, Finland 336,884 (338,467 with Åland), Norway mainland 323,772. Eurostat set gives the same order. Gap holds on every basis tried |
| C010 Poland, Italy, UK, Romania, Belarus smaller | PASS | DYB 312 679; 302 068; 244 376 (footnote 177 excludes Channel Islands, Isle of Man); 238 398; 207 600. Eurostat Poland 311,928, Italy 302,079, UK 244,423 agree |
| C011 same basis: total area incl. inland water (round 1: UNSD half cited World Bank; fixed with S16) | PASS (round 2) | Basis is correct and I confirmed it, but the claim says "as UNSD's surface area ... do" while its only cited definition is the World Bank/FAO note (S05), a different dataset. UNSD's own definition exists: DYB 2022 Notes03.pdf (https://unstats.un.org/unsd/demographic-social/products/dyb/documents/DYB2022/Notes03.pdf): "Surface area ... refers to the total surface area, comprising land area and inland waters (assumed to consist of major rivers and lakes)". Fix: add that quote as an S03-family source/evidence line (new source id for Notes03.pdf). Destatis (Gewässer included), SSB and Statistics Finland each confirm their own basis |
| C013 latitude ranges | PASS | `ne_areas_mercator.py` reproduces 23.0-30.2 N (Rajasthan), 59.8-70.1 (Finland), 58.0-71.2 (Norway mainland), 55.3-69.0 (Sweden), 47.3-55.1 (Germany) |
| C014 Mercator areal scale sec^2 phi | PASS | Snyder p. 44 text as quoted (OCR garbles phi) |
| C015 Finland ~4.3x on Mercator | PASS | Saved script output reproduced exactly (Finland 4.20 polygon / 4.28 with official areas; Norway 4.15; Sweden 4.94; Germany 2.11). Independent re-computation with a different true-area method (spherical, shoelace on sin(phi)): Finland 4.20 polygon / 4.31 with official areas. Sanity check: sec^2 of 26.5 N = 1.25, of 64.5 N = 5.4, ratio 4.3. "About four times" is safe; do not say "exactly" |

## Non-spine claims (all four spot-checked, more than one in three)
| Claim | Verdict | Evidence |
|---|---|---|
| C002 largest state, 10.41% of India | PASS | census_area.py: MP 308,252; Maharashtra 307,713; India 3,287,469; 342,239/3,287,469 = 10.41%. Note: the India total includes areas that Survey of India counts as India but that others dispute; do not narrate "10.41% of India" without a thought (⚑ light) |
| C012 FAO Norway 624,500 / Sweden 528,860 | PASS | Re-downloaded FAOSTAT bulk file |
| C016 population 68,548,437 vs UK 63,379,787 | PASS | A-1 row and DYB UK row (census 27 III 2011); +8.2%; Germany 80 219 695 |
| C017 polygon areas | PASS | reproduced: Rajasthan 343,082; Finland 333,060 |

## Measurements re-run (`python3 -I`, from `method/`)
`dyb_europe.py`, `ne_areas_mercator.py`, `census_area.py`, `eurostat_areas.py`, `europe_areas.py`: all five outputs identical to the saved `_output.txt` files. Definitions are consistent: total area including inland water, sea excluded, for UNSD, Statistics Finland, SSB, Destatis and Eurostat; Rajasthan's "geographical area" basis is unstated (open_questions Q1), but this cannot flip any result: if it excludes water the lead over Finland only grows, if it includes water it is the same basis. The 1.1% margin over Finland is therefore safe in direction; a viewer-facing line should still say "about 1%".

## Honesty of statuses, myths, safe-to-say list
- Statuses: no tier-X source. C011 is marked CORROBORATED but its three pieces cover three different datasets; after adding DYB Notes03 it is properly corroborated. Own computations (C013, C015, C017) are VERIFIED-P under the rule that allows measurements from official geodata with the method recorded.
- myths.md: M1-M11 verdicts match the evidence (M9: 38/43 = 88%; M4 Germany contradicted; M6 Norway embellished; M8 UK confirmed).
- Safe-to-say list: all ten facts carry an ID that passes except fact 5 (wording above, via C008).

## Wording risks
- Say "UN's Europe" and "total area" on screen (as the dossier already says); "bigger than all but six of Europe's 44 countries" is false under other definitions of Europe (for example one that includes Turkey or Cyprus).
- "Rajasthan fits exactly between Finland and Germany": true; "exactly" only means the gap contains no state. Avoid implying a precise fit.
- Germany: "4.5% bigger", not "4% bigger" and never "4.3% bigger".
- Ukraine and Russia are as reported to the UN; the DYB footnote says Ukraine cannot report Crimea. No map of that area.
- Mercator hook: "about four times", framed as a way of drawing.

## Round 2 re-check of the two fixes (1 Nov 2026)
- C008: 357,683 - 342,239 = 15,444; 15,444/342,239 = 4.51% (Germany larger); 15,444/357,683 = 4.32% (Rajasthan smaller). Claim, method line, myths M4, dossier table, safe-to-say 5, hook line and open_questions now say 4.5% larger / 4.3% smaller correctly. Grep of the whole folder (excluding this file) finds no "4.3%" or "4% bigger" used the wrong way; method output "Rajasthan is 4.3% smaller" (UNSD 357,581: 4.29%) is the correct direction.
- C011: S16 (Notes03.pdf) saved PDF is byte-identical to the live file fetched today. Locator: Notes to Table 3, paragraph "Surface area", line 19 of the text: "Surface area, expressed in square kilometres, refers to the total surface area, comprising land area and inland waters (assumed to consist of major rivers and lakes) and excluding polar regions as well as uninhabited islands." The claim's quote matches (line break after "land area and"). CORROBORATED is now honest (UNSD + Statistics Finland + SSB + World Bank).

## research_check.py
See hand-back report.

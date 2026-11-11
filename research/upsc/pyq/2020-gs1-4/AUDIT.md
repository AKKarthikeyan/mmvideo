# Audit (gate S5) of 2020-gs1-4

Auditor: independent reviewer, 2026-11-10. Did not write the ledger.

## Method
Reopened every row at its saved local file: NOAA pages and USGS GIP pages text-searched; USGS ComCat JSON tectonic summary read; NCEI earthquake JSON parsed (11 items); NCERT kegy204 text searched; ledger GEO-04 V027 (and V024-V026 listed in NOTES) confirmed to exist.

## Counts
PASS 13, FIX 1, FAIL 0 (of 14 rows). FIXes are applied in claims.csv.

## Table
| claim_id | verdict | evidence | fix |
|---|---|---|---|
| 2020-GS1-4-01 | PASS | NOAA: 'more than 450 volcanoes', 'nearly 40,250 kilometers', most active volcanoes underwater. |  |
| 2020-GS1-4-02 | PASS | USGS tectonics page: 'circum-Pacific Ring of Fire ... most seismically and volcanically active zone'. |  |
| 2020-GS1-4-03 | PASS | USGS: trenches 'thousands of kilometers long and 8 to 10 km deep'; Peru-Chile trench, Nazca under S America, Andes. |  |
| 2020-GS1-4-04 | PASS | NOAA: Challenger Deep ~10,935 m, Mariana Trench; average depth 3,682 m. |  |
| 2020-GS1-4-05 | PASS | USGS GIP: subduction zones trenches/shallow-to-deep quakes; 'Less than 10 percent' within plate interiors. |  |
| 2020-GS1-4-06 | PASS | ComCat tectonic summary: 0-70, 70-300, >300 km; volcanoes frequently above 100 km contour. |  |
| 2020-GS1-4-07 | PASS | 580 km and 675 km, ~75 mm/yr, 35 other events >M7.5 since 1900, 50-90 mm/yr. |  |
| 2020-GS1-4-08 | PASS | NCERT kegy204: rim of Pacific quakes deep-seated; 'rim of fire' wording present; 'Reprint 2026-27' in file. |  |
| 2020-GS1-4-09 | FIX | JSON: M8.8+ post-1900 are 1906, 1952, 1960, 1964, 2004, 2010, 2011, 2025 = 8, 7 on the rim; magnitudes match. 'items 4-11' locator was wrong (the rows are not contiguous). | locator corrected |
| 2020-GS1-4-10 | PASS | JSON: 1960 M9.5 depth 33, deathsTotal 2226 vs deaths 2000; 1964 M9.2; 2011 M9.1 deathsTotal 18423. CONFLICT status right. |  |
| 2020-GS1-4-11 | PASS | USGS developing: Atlantic expanding, Pacific shrinking, crust consumed in trenches. |  |
| 2020-GS1-4-12 | PASS | USGS: Pacific Plate grinding past North American Plate 10 million years, ~5 cm/yr; links East Pacific Rise (divergent). |  |
| 2020-GS1-4-13 | PASS | Ledger V027 exists (Hawaii hotspot, 3,200 km from nearest boundary, Wilson 1963); USGS hotspots text matches. |  |
| 2020-GS1-4-14 | PASS | Honest UNVERIFIED gap row; no figure claimed. |  |

## NOTES.md mapping
All seven parts mapped to claims and verified. Unsupported (flagged in claim 14 and NOTES): gravity anomalies at trenches, heat flow, seafloor age, Pacific plate size, '90% of earthquakes', '75% of volcanoes'. Tsunami share of Pacific not read. No GEO-03 ledger exists.

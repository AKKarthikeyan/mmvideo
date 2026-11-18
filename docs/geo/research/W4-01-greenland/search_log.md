# W4-01-greenland: search log (lite, 14 Nov 2026)

SHORTS LITE MODE: 2-3 original sources. Kept sources are the ones that own the numbers.

## Kept (cited in claims.jsonl)
| Src | What | Why |
|---|---|---|
| S01 | UNSD Demographic Yearbook 2023, Table 3 (PDF + pdftotext) | Owner-compiled surface area for BOTH Greenland and India on one basis; Greenland population and density |
| S02 | NSIDC Ice Sheet Quick Facts (HTML + text) | Ice-sheet share and area; "largest island" |
| S03 | Natural Earth 1:10m admin-0, India view (house copy) | Our true and Mercator areas; coordinates for the camera move |

## Tried and NOT reached / not kept
- Statistics Greenland "Greenland in Figures" 2024 and 2023 PDFs (stat.gl), stat.gl, bank.stat.gl, naalakkersuisut.gl: connection timed out (curl, IPv4 and default) and the built-in browser was refused. Greenland's own figure reaches us through UNSD (footnote 50: from registers).
- knowindia.india.gov.in: DNS failure; surveyofindia.gov.in: timed out. India's area taken from the same UN table instead (one basis).
- USGS FAQ on map projections (to cite the belief): curl 403; built-in browser loaded an empty page. Not used.
- Reachability only (not opened as evidence): geus.dk, dst.dk, polarportal.dk (200).

## Computations
`method/mercator_areas.py` -> `method/mercator_areas_output.txt` (python3 -I).

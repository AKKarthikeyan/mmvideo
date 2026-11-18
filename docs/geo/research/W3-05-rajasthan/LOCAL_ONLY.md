# W3-05: files that must stay on the SSD (never commit, never publish)

The repo is public. These are copies of official documents or datasets, or text extracted from them, kept only as evidence for the research ledger.

| File | Why local only |
|---|---|
| `sources/census2011_A1_area.xlsx`, `census_A1_footnotes.txt` | Census of India table (ORGI); government data, keep the copy here rather than re-hosting |
| `sources/dyb2022_table03.pdf`, `.xls`, `.txt`, `dyb2022_notes03.pdf`, `.txt`, `dyb2022_index.html` | UN Demographic Yearbook (UN copyright; keep local) |
| `sources/fao/` (zip and csv), `fao_europe_extract.txt` | FAOSTAT bulk file (50 MB) |
| `sources/wb_*.json` | World Bank API copies |
| `sources/eurostat_*.json` | Eurostat extracts |
| `sources/finland_in_figures_2026.pdf`, `.txt` | Statistics Finland publication |
| `sources/ssb_*.json`, `ssb_*.html`, `ssb_protected_areas_table.txt` | Statistics Norway |
| `sources/destatis_bodenflaeche.html`, `.txt` | Destatis page |
| `sources/snyder_usgs_pp1395.pdf` (22 MB), `snyder.txt` | USGS report (US government work, public domain, but large) |
| `sources/m49*.html/json/txt` | UNSD M49 page |
| `sources/planning_commission_2001_quote.txt` | One-sentence note, the PDF was not downloaded |

Public-domain or our own, safe to share: everything in `method/` (our scripts and outputs). Natural Earth is public domain and is not copied into this folder (read from `MMVideo/sources/geo/`).

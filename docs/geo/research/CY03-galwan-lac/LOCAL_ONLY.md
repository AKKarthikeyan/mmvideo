# CY03: files that must stay on the SSD (never commit, never publish)

The repo is public. These are copies of other people's documents or data, kept only as evidence for the ledger.

| File | Why local only |
|---|---|
| `sources/soi_ladakh_map_3rd_2026.pdf`, `sources/soi_state_maps.html` | Survey of India map, marked "Reproduction in whole or part ... prohibited without written permission"; we read coordinates from it, never re-use the image |
| `sources/prc_mnd_netizens_4879531.*`, `sources/prc_mnd_hero_4887381.*` | China Daily / China Military Online articles (copyright of the publishers) hosted on the Chinese MND site |
| `sources/galwan_servant_of_sahibs_djvu.txt` | OCR text of the 1923/24 book (Digital Library of India scan on the Internet Archive; the book is out of copyright, the scan's OCR layer is kept local anyway) |
| `sources/un_*.pdf`, `sources/un_*.txt`, `sources/peacemaker_9230.html` | United Nations Peacemaker copies of treaty texts |
| `sources/mea_*`, `sources/pib_*`, `sources/cgivladi_*` | Indian government documents; public, but keep the copies here rather than re-hosting them |
| `sources/prc_*`, `sources/yfao_*` | Chinese government and ministry pages; public, kept here for the ledger only |
| `sources/ne_*.src`, `sources/ne_10m_admin_0_countries_ind.geojson` | Natural Earth (public domain) and the house outline copy; may be shared |
| `method/nominatim_finding_aid_raw.txt` | OpenStreetMap data (ODbL, attribution required); not evidence, kept as the cross-check record |

Public-domain or our own, may be shared: everything else in `method/` (our scripts and outputs: `geo_points.py`, `geo_points_output.txt`, `pangong_lake_level.py`, `pangong_lake_level_output.txt`, `pip_check.py`, `pip_check_output.txt`, `soi_map_readings.md`).

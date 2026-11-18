G6: PASS. All six spine claims found verbatim in the saved sources, all four public PDFs re-fetched byte-identical (sha256), and 120 vs 51 (ratio 2.35) re-computed; three minor wording fixes listed.

Verifier: independent G6 check, 3 Nov 2026. Re-fetch dir: scratchpad/verify/ (outside the research folder). Re-fetch: S90 (IMD NB17), S01 (IMD FAQ), S23 (annualcd.pdf) all HTTP 200 and sha256 identical to sources/. S07 (Wiley) and S09 (Mausam) not re-fetched; read from saved copies only.

| claim | quote found | supports wording | re-fetch | note |
|---|---|---|---|---|
| C001 | yes (count_imd_annual_output.txt line 4) | yes | S23 identical; `python3 -I method/count_imd_annual.py sources/imd_annualcd_layout.txt` gives 1982-2024: Bay 120, Arabian 51, ratio 2.35; 1891-2024 536 vs 139 | "more than twice" correct. Years are 1982-2024, not "to now" |
| C002 | yes (NB17 subject line; table row 02.11.26/2030, 100-110 gusting 120, Severe Cyclonic Storm) | yes | S90 identical | fine |
| C003 | yes (FAQ: "relatively colder than Bay of Bengal and hence inhibits the formation and intensification") | partly: IMD says cold inhibits; "warm water feeds storms" is the inverse inference | S01 identical | acceptable; see F2 |
| C004 | yes, 3 quotes in S07 abstract | yes (post-monsoon, north Bay scope kept in caption and speech) | not re-fetched | fine |
| C005 | yes (Dube 1.2 list a, b) | partly: these are reasons surges are disastrous, not reasons for more cyclones | not re-fetched | see F1 |
| C006 | yes (FAQ Q54, Q56) | yes | S01 identical | fine |

Required fixes
1. F1 (b5): the "Three reasons" frame answers "Why so many?", but shallow water and convergence explain surge damage, not cyclone count. Reword b5: "Three: the shape. At the Bay's head it narrows like a funnel, over shallow water, so surges pile up." (b7 already says the funnel makes them deadly; consistent.)
2. F2 (b3): say "warm water fuels storms" is our mechanism statement; IMD's sentence is that the colder Arabian Sea inhibits them. Safer: "The Arabian Sea is colder, and IMD says that holds storms back." Keep "warmer" caption.
3. F3 (b1): add the end year: "...the Bay of Bengal's record from nineteen eighty-two to twenty twenty-four." (or "in IMD's count"), since 1891-2024 is almost 4:1 and the 2.35 applies to the satellite era only.


## Fixes applied (3 Nov 2026, main session)
All listed fixes applied to script_v1.json and scripts/geo/cyclone.py. Spoken words now 109.

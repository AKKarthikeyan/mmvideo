G6: PASS. All spine claims (C001, C004, C005, C006, C007, C008, C011, C012) pass on independent re-check (Lite mode, 8 Nov 2026); lite_pairs.py and combined_world.py reproduce their saved outputs exactly; two small housekeeping residuals are listed at the end.

# W3-13 states vs countries: independent verification (G6, Shorts Lite)

Verifier: a separate Claude Code session that did not do the research. Today 8 Nov 2026. I re-fetched both live sources myself (NCP report PDF, 11.5 MB, via pdftotext; UN WPP 2024 CSV.gz, 17 MB) and compared digit by digit. No API key used or printed; nothing published.

## Basis check (one year, one basis)
Every pair in lite_pairs.py uses 2026 only for the headline: states from NCP Table 11 (1 July 2026, printed headers "as on 1st July"), countries from WPP 2024 Medium, Time=2026 (1 July). Variant, LocTypeName='Country/Area'. Basis B scales states by UN India / NCP India = 1.0348 (live: 1,476,625.576 / 1,426,907). The 2011 comparison is also like for like (NCP Table 11 1 July 2011 vs WPP Time=2011). Areas: all pairs use Natural Earth areas computed by one function on both sides. Consistent.

## Spine claims
| Claim | Result | Evidence |
|---|---|---|
| C001 basis + India 14,26,907 | PASS | Live PDF Table 11 row 2026: India 14,26,907 (1 hit). Saved excerpt identical. Parsed JSON India 2026 = 1,426,907 |
| C004 Maharashtra vs Japan | PASS | Live: Maharashtra 2026 1,29,584; 2011 1,12,798. WPP: Japan 122,427.731 (2026), 128,096.432 (2011). +5.8%, +9.5%, -11.9% recomputed in rerun |
| C005 Bihar vs Mexico | PASS | Live Bihar 1,32,850; WPP Mexico 132,997.658; -0.1%, +3.4%; area 94,876 vs 1,962,242 (20.68x) from rerun |
| C006 Rajasthan vs Germany | PASS | Live 83,879; WPP Germany 83,644.258; +0.3%, +3.8%; area 343,697 vs 356,379 (1.04x) |
| C007 Karnataka vs UK | PASS (note below) | Live Karnataka 69,074; WPP UK 69,931.528; -1.2%, +2.2% |
| C008 ranks | PASS | combined_world.py rerun identical: A UP 5, Bihar 12, Maharashtra 13, WB 19, MP 21, Raj 23, 12 in top 50; B Bihar 11, Maha 12, WB 18 |
| C011 densities | PASS | Rerun: Bihar 1,400 vs 68; Kerala 957 vs 110; WB 1,163 vs 310 |
| C012 UN vs NCP India | PASS | Live: UN India 1,476,625.576 vs NCP 1,426,907 = 1.0348 (3.5%) |

## Non-spine (all checked, lite)
C002 UP 2,43,466 live; Pakistan 259,300 and Nigeria 242,432 match WPP: PASS. C009 232 of 236 and 22 of 37: rerun identical, PASS. C010 live rows: 2022 Bihar 1,25,532 vs Maharashtra 1,25,736 (still behind); 2023 1,27,368 vs 1,26,710 (passes); 2011 1,04,771 vs 1,12,798: PASS. C013 Jharkhand 41,108 live vs Canada 40,467.728: PASS. C014 WB 1,00,631, Kerala 36,239 live; Vietnam 102,177.431, Malaysia 36,385.115: PASS. C015 not re-opened beyond saved output (Kosovo excluded from the Short).

## Statuses, myths, dossier
VERIFIED-P is fair for the NCP and WPP values (each source states them). Numbers derived from areas rest on our own Natural Earth measure and are described as such. Myths M1-M3 verdicts match the evidence (Russia 143.4m not re-fetched, not used in script; Kerala-Canada contradicted by 36.2 vs 40.5; M3 unverifiable, unused). Every "safe to say" line cites a passing claim ID. Wording is hedged ("projected", "about as many as", "if states were separate countries"). Watch: line 6 "In 2011 it was the other way round" must stay tied to the NCP-vs-UN 1 July 2011 basis; never say "census" for 2026.

## Residuals (not blocking)
1. C007 notes quote old areas (Karnataka 191,791 vs UK 243,610, UK 1.27x); the script gives 192,535 vs 242,737 (1.26x), which the dossier uses. Fix the note to 1.26x.
2. Excerpt line numbers in several locators are off by about 2 (for example UP row is line 168, not 170). The quoted rows themselves are exact.

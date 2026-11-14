G6: PASS (independent check, 8 Nov 2026, lite mode)

Checker re-opened S01, S02, S03 (saved text copies) and re-fetched S02 live. S01 and S03 are Census PDFs whose exact URLs were not logged (sources.jsonl), so no live re-fetch was possible for them: CANNOT-REACH live, checked on saved copy only (non-blocking, see fix F1).

| Claim | Result | Evidence |
|---|---|---|
| C001 | PASS | S01 quote found (p.58 "17 persons per Sq. Km ... state density (200"); area 38401.00 and 342239 found at p.21. 669919/38401 = 17.45; 17/200 = 0.085, "less than a tenth" holds. |
| C002 | PASS | S01 p.19 "ranks 33rd in terms of population, 1st in terms of area and 33rd in ... density" found; S03 lists 33 district rows. 2011 boundaries caveat stated. |
| C003 | PASS | S01 quote "0.98 percent ... 11.22 percent" found, p.58. |
| C004 | PASS | 6,69,919 found in S01, S02 and S03 (row 2011). |
| C005 | PASS | S01 185.5 mm found; S02 184.34 mm found in saved and live PDF. "about 185 mm" fine. |
| C006 | PASS | "0.8 mbgl to 124.39 mbgl" and "deeper tube well water has more saline than the dug well water even in same village" found in saved and live S02. Wording "often saltier" is slightly softer than the source's flat statement; acceptable. |
| C007 | PASS | S01 "no perennial river" found. |
| C008 | PASS | S02 "about 61.61% area is irrigated by canal" found (live too); 210880/342262 = 61.61%. S01 58,860 vs 42,469 ha (2010-11) found; 58,860+42,469 = 1,01,329 = printed total; 58%. Year/basis difference is logged in conflicts.md and the "most" wording is safe. |
| C009 (non-spine) | PASS | S03 1901 Jaisalmer 75,551; 2011 6,69,919; Rajasthan 1,02,94,090 and 6,85,48,437 found. 8.87x and 6.66x recomputed. |
| C010 (non-spine) | PASS | S03 +31.81 (Jaisalmer) and +21.31 (Rajasthan) found. |
| C011 (non-spine) | PASS | "even in canal command areas water level is declining" found, saved and live. |
| C012 (non-spine) | PASS, hedged | Quote found; Kerala area not checked, so it must stay unnarrated (not in the Short beats). |

Computations: `python3 -I method/compute.py .` (folder as argument) reproduces method/compute_output.txt exactly.
Consistency: all density, share and rank figures are 2011 census, 2011 boundaries. Rainfall and groundwater figures are different bases, not compared with each other. Canal share is not given as a single number in the dossier's Short beats.
Statuses honest: VERIFIED-P claims have a primary source stating them; CORROBORATED claims (C004, C005, C008) have independent origins (note C005's S01 figure is DES Rajasthan data, S02 is CGWB IMD-period average, fine). No tier-X source. myths.md verdicts match the evidence. Every "safe to say" beat cites a passing claim ID.
Wording scan: no disputed fact stated as fact; border, military land and policy explicitly not implied. Minor: the beat "Jaisalmer is Rajasthan's biggest district" needs "(2011)" retained, as written; "grew almost ninefold" uses 1901 figures recast to 2011 boundaries, so say "since 1901" not "the town".

Fixes: none blocking.
F1 (optional): log exact censusindia.gov.in URLs for S01 and S03 in sources.jsonl so a live re-fetch is possible.

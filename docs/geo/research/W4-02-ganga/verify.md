G6: PASS. All 8 spine claims (C01-C08) pass on independent re-check (14 Nov 2026, Shorts Lite); the method script reproduces its saved output exactly. Wording residuals are listed at the end; none touches a spine claim.

# W4-02 Ganga at Varanasi: independent verification (G6, Shorts Lite)

Verifier: a separate Claude Code session. Live pages re-fetched 14 Nov 2026 (HTTP 200 on all three), quotes searched in the live HTML; saved copies in sources/ were also grepped. Script re-run with `python3 -I`, output diffed against the saved file: identical.

| Claim | Result | Evidence |
|---|---|---|
| C01 | PASS | cwc.gov.in/lgbo/about-basins: "Gangotri glaciers in the Himalayas at an elevation of about 7,010m" and "total length of about 2,525 km up to its outfall into the Bay of Bengal" |
| C02 | PASS | "The holy city of Varanasi is situated on the left bank of 41 Ganga about 195 km downstream of Allahabad" (the stray 41 is a page artefact, noted in sources.jsonl) |
| C03 | PASS | varanasi.nic.in Other Important Places: "Varanasi is a holy town situated on the west bank of the River Ganga" |
| C04 | PASS | Logic holds: facing downstream, left = west only when flowing north. CWC "bounded on the north by the Himalayas" found; method run vertices 461-467 14.8 km re-run. Status CORROBORATED honest (neither page says "north" in words) |
| C05 | PASS | Re-run: vertices 461-467, 14.8 km, 83.008311 25.21072 to 83.041515 25.323065, bearing 15. Per-leg bearings 31.6, 14.2, 354.6, 336.6, 323.6, 43.3 are all within 45 degrees of north |
| C06 | PASS | Re-run: 58.0 km along line, 42.7 km straight, bearing 31, gain 36.7 km; latitude rises at every vertex 460-480 (checked in the vertex table) |
| C07 | PASS | Re-run: whole-part bearing 128 deg; CWC "Thereafter, the Ganga flows in almost eastern direction" found, after the Gomti sentence |
| C08 | PASS | Re-run: Allahabad to Varanasi 117 km, bearing 97; CWC 195 km by river. Bases differ (NE place pins vs river length) and the claim says so |

Units and definitions: 2,525 km (CWC, whole river) vs 2,106 km (NE generalised line to the part's end) are never compared in the dossier. All distances are km.

## Non-spine and statuses
- C09 PASS (556 km, 26% reproduced). C11 PASS (both quotes found live in the History page, credited as belief). C10 stays SECONDARY-ONLY, correctly excluded (not rechecked). C12 UNVERIFIED, correctly dropped.
- Spine statuses honest. No tier-X source is cited as evidence. myths.md M1-M3 verdicts match C09/C05/C06/C07.
- Reveal Loop section: every number has a passing claim ID: 15 km (C05), 58 km and 37 km (C06), 25.332 N 82.998 E and the vertex coordinates 460-467 and 25.535 N 83.213 E (C05/C06 method output; the pin is the NE populated-place point, S03), 117 and 195 km (C08), "almost two km north for every three" = 37/58 = 0.64 (C06, arithmetic checks). Quote "believed to have the power to wash away the sins" (C11). 88 ghats (C10) is flagged do-not-use. Note: the Reveal Loop says the pin is at 25.332 N 82.998 E, which the output confirms.

## Wording risks (fixes, none blocking)
1. "Past Varanasi it turns and runs north for about 15 km" (verdict, beats 2 and 6): the 15 km stretch starts about 13 km south of the city pin (25.211 N) and ends about 1 km south of it (25.323 N), vertex 467 being 4.5 km east of the pin. Safer: "at Varanasi" or "along the city". C03/C04 say "at the city".
2. Beat 5 "Both can be true only if the river is flowing north there" is sound geometry but is our inference: say "which means" and credit the two pages, not "they say".
3. Camera move: the "arrow" must be labelled approximate (generalised 1:10m line, vertices 1-9 km apart); the dossier already says so.
4. Religion flag: beats are credited as belief (C11); keep "believed" on screen. Do not state Uttarvahini (C12).

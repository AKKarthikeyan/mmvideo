G6: PASS. All 8 spine claims (C001-C008) pass on independent re-check (lite mode, 14 Nov 2026); the Mercator and ratio script reproduces its saved output byte for byte.

# W4-01-greenland: independent verification (G6, Shorts lite)

Verifier: a separate Claude Code session that did not do the research. Sources: S01 re-fetched live (HTTP 200, PDF byte-identical to sources/table03.pdf), S02 re-fetched live (HTTP 200, same text as the saved copy), S03 is our own measurement (re-run). The script was run with `python3 -I` and diffed against method/mercator_areas_output.txt: identical.

| Claim | Result | Evidence |
|---|---|---|
| C001 Greenland 2,166,086 km2 | PASS | S01 Table 3 Greenland row, surface area 2023 column prints "2 166 086"; density "0" |
| C002 India 3,287,263 km2 | PASS | Same table, India row prints "3 287 263" |
| C003 1.52x / 66% / diff 1,121,177 | PASS | 3,287,263/2,166,086 = 1.518; inverse 0.659; difference 1,121,177. Both areas from the same UN table, same year (2023), same basis (surface area incl. ice) |
| C004 Mercator 8.92x | PASS | Re-run output "Greenland looks 8.92 x India's size". Mercator areas use Natural Earth outlines (not the UN figures), true ratio on the same outlines is 1.531, consistent with 1.518. Definitions are consistent; the 8.9x is an outline-on-map ratio and is labelled "our measurement" |
| C005 13.7x / 1.17x / 16.4x / 1.2x | PASS | sec^2(74.3)=13.66, sec^2(22.7)=1.17; whole-outline inflation 16.42 and 1.20 in re-run |
| C006 ice sheet ~80%, 1.7 million km2 | PASS | Live NSIDC: "covers about 80 percent of the world's largest island, stretching across 1.7 million square kilometers" |
| C007 about 57 thousand, density 0, India 2020 1,353 thousand | PASS | Row prints 5650 (2020) and 5750 (2023) with footnote 50 digits glued on; fn 50 "compiled from registers"; India 2020 column "1 353 378" (fn 91); India 2023 column is "..." so the 2020 label is correct |
| C008 largest island in the world | PASS | Live NSIDC intro: "Greenland, the largest island in the world" |

Non-spine: C009 (56,462, 1 Jan 2008) and C010 (extents and label points match the re-run) both PASS. Statuses are honest (VERIFIED-P for a primary table plus our own labelled measurement); no tier-X source; myths.md M1-M3 verdicts match the evidence.

Reveal Loop numbers cross-check: 8.92x [C004], 1.52x [C003], 13.7x and 1.17x [C005], 57,000 and density zero [C007], 80% and 1.7 million km2 [C006], coordinates [C010]: every number has a passing claim ID. "India is about one and a half Greenlands" [C003] is fine.

Wording risks (none fails a claim):
- Reveal Loop item 1 "bigger than India, maybe even as big as Africa" is a belief with no cited source (the dossier says so honestly); keep it as a framing line, not a fact.
- "Moved to India's latitude... smaller than India's" (beat 9) rests on C003 and C005 only; keep it as animation, not a new number.
- Never put UN footnote 91 (Jammu and Kashmir wording) on screen. "Mercator" must stay "on a Mercator map", not "your map" (unsourced).
- The 0 density is a rounding (about 0.03/km2): say "rounds to zero".

No FAIL or CANNOT-REACH.

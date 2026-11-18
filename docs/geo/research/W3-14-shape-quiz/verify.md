G6: PASS. All 8 spine claims (C001-C008) pass on independent re-check, 8 Nov 2026 (Shorts lite mode); the script reproduces its saved output exactly. One housekeeping note, no spine claim affected.

# W3-14-shape-quiz: independent verification (G6, lite)

Verifier: a separate Claude Code session that did not do the research. Never published or posted; no key used.

## Sources re-opened
- S01 live: https://censusindia.gov.in/nada/index.php/catalog/42526 (HTTP 200, A-01 listed); the xlsx download is byte-identical to sources/census2011_A01.xlsx (same SHA-1 aaaf68f0...). Saved extract rows match the xlsx.
- S02 saved copy sources/sra1956_thc.txt read at ss. 2(a), 4, 9. Live: indiacode.nic.in times out from here (the exact URL was never logged, see note). Cross-check against a public mirror of the Act (advocatekhoj.com, ss. 4 and 9, HTTP 200): wording identical to the saved text. Mirror is a cross-check only, not a new origin.
- S03 re-run locally (see below).

## Spine claims
| Claim | Result | Evidence |
|---|---|---|
| C001 MP 308,252, 2nd of 28 | PASS | Row 11633 N=308252; Rajasthan row 1691 N=342239; my reading of the script ranking: Rajasthan 1, MP 2, 28 states |
| C002 MP beats Maharashtra by 539 (0.18%) | PASS | Maharashtra row 13592 N=307713; 308252-307713=539; 539/307713=0.175% |
| C003 MP formed 1 Nov 1956 from five pieces | PASS | s.9(1)(a)-(e) and s.2(a) match the quotes (Madhya Bharat minus Sunel tappa; Sironj of Kotah; Bhopal; Vindhya Pradesh); live mirror agrees |
| C004 TN 130,060; 72,147,030 people = 99.3% of MP; 42.2% of land | PASS | Rows 19172 and 11633; 72147030/72626809=99.34%; 130060/308252=42.19% |
| C005 four taluks to Madras, Kanya Kumari district; Shencottah to Tirunelveli | PASS | s.4 and 4(b),(c) match the quotes (Shencottah is of Quilon district in the Act; the claim does not misplace it) |
| C006 Kanniyakumari = 4 sub-districts, 1,684 sq km, 1,870,374 people, 1.3% / 2.6% of TN | PASS | District row 19823 K=1870374, N=1683.9989; sub-districts 395.04+632.98+377.74+278.24=1684.00; names match the Act's four taluks; 1684/130060=1.29%, 1870374/72147030=2.59% |
| C007 Goa 3,702, smallest; next Sikkim 7,096; MP 83x, TN 35x | PASS | Rows 18860, 5396; 308252/3702=83.3; 130060/3702=35.1; Goa is rank 28 in the script list |
| C008 keys and no foreign touch | PASS | I loaded geo.json: 'states' has exactly 'Madhya Pradesh', 'Tamil Nadu', 'Goa'. Script output: MP nearest foreign vertex 254 km, Goa 839 km, TN 29 km (LKA, sea, no shared vertex); neighbours are all Indian states. No international land border for any of the three |

## Computations
`python3 -I method/shape_quiz.py` output is identical to method/shape_quiz_output.txt (diff clean). Definitions are consistent: all areas and populations are Census 2011 Table A-01 (Survey of India areas), same 28-state basis, one year throughout.

## Statuses, myths, wording
- VERIFIED-P is honest for C001-C008 (official table or statute states each fact; C002, C004, C007 are arithmetic on those). No tier-X source. C006 corroborates C005 across two independent records.
- myths.md M1-M3 verdicts match the evidence. Every "safe to say" line in dossier.md cites a passing claim.
- Non-spine C009, C010 also checked: C009 heading text matches; C010 footnote (row 20017) matches, but the footnote says sub-district areas are derived by digitalisation in ORGI (only state/district areas are Survey of India). Do not credit sub-district sums to Survey of India; the script uses them only to cross-check the district row, which is Survey of India.
- Wording: all fine and properly hedged (2011 basis, "then Madras", "smallest by area", no rename year, no highlight of Kanyakumari on the outline). Hook "the size of 83 Goas" is MP only, acceptable.

## Housekeeping (no spine impact)
- sources.jsonl S02 url is a generic India Code root; log the exact PDF URL. Live India Code was not reachable here (CANNOT-REACH); the mirror matches the saved text.

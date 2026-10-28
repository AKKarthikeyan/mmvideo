G6: PASS. All 23 spine claims pass on re-check after the researcher's fixes, and every measurement script reproduces its saved output exactly. Two small residuals are listed at the end; neither touches a spine claim.

# CY02 Bay of Bengal cyclones: independent verification (G6), round 2, 27 Oct 2026

Verifier: Claude Code, a separate session that did not do the research. Round 1 (earlier today) returned G6: FAIL. Nothing in this file is taken on the researcher's word; every fix was re-opened.

## What failed in round 1 (now fixed)
- **C034 (spine):** the claim named "West Bengal" at the west end of the 21.5N line; Natural Earth admin-1 puts it in Odisha.
- **C019 / M12 / K6:** "CONTRADICTED" was too strong, because the 3,000 figure is Calcutta only.
- Smaller points: C003, C004 and C008 corroboration was IMD-origin only; C043 and M3 said "four in five" for 76%; C013 called a telecom-regulator slide "Bangladesh's own record"; C021 lacked the "29 sails" quote; the Gay 1989 method comment was wrong; only 2 of 26 sources had an archive link; the dossier hook was more absolute than the data.

## Re-check of each fix
| # | Fix | Result | Evidence |
|---|---|---|---|
| 1 | C034 wording | PASS | Re-ran `bay_width.py`: 16N 1397 km (81.156E to 94.224E), 21.5N 492 km (87.101E to 91.861E), identical to the saved output. Natural Earth admin-1 crossings re-computed: 16N west = Andhra Pradesh (81.156), east = Ayeyarwady, Myanmar (94.224); 21.5N west = **Odisha** (87.101), east = **Chittagong division**, Bangladesh (91.861). The claim now says "Odisha coast to the Chittagong coast of Bangladesh" and "Andhra Pradesh coast to the Ayeyarwady coast" |
| 2 | C019 / M12 / K6 | PASS | C019 is DISPUTED, M12 is "Unverifiable", K6 says unverifiable. All four Bilham quotes were found in my own `pdftotext` of Bilham 1994: "near 3000 Inhabitants were killed"; the abstract line "list 3000 fatalities"; the "either the 300,000 ... exaggerated version of the 3000" line; and "Although official reports discuss only the damage in Calcutta, and it is possible that the 300,000 estimated fatalities include those in coastal villages in what is now East Bengal and Bangladesh". The claim text says no more than they do |
| 3 | C003, C004, C008 JTWC evidence | PASS, with a caveat on C004 | The new S02 lines are in `count_ibtracs_output.txt` verbatim: 1982-2024 Bay Cat1+ 56 of TS+ 141 vs Arabian 27 of 66 (40% vs 41%); 2004-2024 Bay Cat3+ 12, Cat4+ 9, Cat5 5 vs Arabian 13, 6, 1; "1999 UNNAMED genesis=BB JTWC=140 kt IMD=140 kt". The Deshpande Table 2 row is in the live PDF: ARB 25 (6), 38 (15), 63 (21); BoB 67 (23), 62 (21), 129 (44), so VSCS share 44/129 = 34% vs 21/63 = 33%. C003 and C008 are honestly CORROBORATED by a second agency. C004: JTWC independently matches only the "matched" half (Cat 3+ 12 vs 13); at Cat 4+ and Cat 5 JTWC favours the Bay, and the "2 vs 1 super cyclonic" half is IMD-only. The claim is explicitly "IMD winds" and the notes disclose this. Narration must say "by IMD's count" |
| 4 | C043 / M3 | PASS | C043 now says "about three in four (76%)"; M3 is "Embellished" with 458 of 554 = 83% for 1891-1995 (458/554 = 82.7%), consistent with M2 |
| 5 | C013 / K3 / S15 | PASS | The saved ITU/ESCAP slide deck is "Presented by Md. Golam Razzaque, Deputy Director, Legal & Licensing Division, Bangladesh Telecommunication Regulatory Commission (BTRC)"; the "1970 the height was 10 m" and "1876 ... 13.6 m" lines are on the slide. Claim, notes and K3 now say so and forbid calling it Bangladesh's own record |
| 6 | C021 "29 sails" | PASS | The added quote ("Only the Duke of Dorset was to be seen in the river, whereas the evening before there were more than 29 sails of vessels great and small, many now being drriven ashore. Some broke to and others foundered.") is in the saved letter page. The claim wording follows it |
| 7 | Gay 1989 comment | PASS | Script docstring and claim method text now say MM = "missing" and Gay's first IMD fix is in the Gulf of Thailand (WP basin, ~7N 105E); round 1 confirmed this from the CSV (7.4N 104E at the first IMD fix). Only the docstring of `count_ibtracs.py` changed: all seven scripts re-run to outputs **identical** to the saved ones (diff empty) |
| 8 | archive links | PASS with a gap | 25 of 26 sources now have an `archive_url`; **S15 (ITU slide deck) has none**. Fetched and compared: S01, S06, S10, S11, S23 are byte-identical to the saved copies; S07 returns the right Sengupta 2008 article (contains "caps a deep warm layer"); S26 returns the right NORA record. Seven of 25 checked; the Wayback Machine then answered HTTP 429 (rate limit) for the rest, so I could not reach one third. No mismatch was seen |
| 9 | dossier hook | PASS | Headline now "there is no sign they are stronger per storm"; Hook A "There is no sign of that per storm"; G7 item 1 says "worded 'no sign', not 'false'" and names the Cat 5 8 vs 1 exception. That fits my round-1 tests (Fisher p = 1.0 for severe share; Cat 5 8 vs 1 p = 0.28) |

## Measurements (re-run with `python3 -I` on copies, scratchpad only)
| Script | Result |
|---|---|
| `count_ibtracs.py` | Identical. 1982-2024 Bay 122 vs Arabian 50 (2.44, 71%); SCS+ 62% vs 62%; 2004-2024 ESCS+ 10 vs 10, SuCS 1 vs 2; WP-origin 13 (CS+ 10); Nov 38, Oct 26, May 22; Jul 2, Aug 0 |
| `count_imd_xls.py` | Identical. 1990-2024 CS+ 95 vs 45; SCS+ 57 vs 29 |
| `count_imd_annual.py` | Identical. 1982-2024 120 vs 51, severe share 61% vs 69%; 1891-2024 536 vs 139, severe share 46% vs 62% |
| `monsoon_depressions.py` | Identical. 622 vs 89 |
| `postmonsoon_depressions.py` | Identical. 468 vs 113 |
| `bay_width.py` | Identical. 1397 km and 492 km |
| `sst_compare.py` | Identical. 28.64 vs 27.95 C; May +0.21; Aug +1.66 |

Round 1 also showed the IBTrACS count is unchanged on a fresh NCEI download, and one ERSST month re-pulled from ERDDAP matched.

## Quote and claim re-check
- Every quote in `claims.jsonl` was searched for in my own text extraction of the saved sources (`pdftotext` on each PDF; HTML and OCR text otherwise): **0 missing**. Every quote that cites a method output was found in the output files: **0 missing**.
- Spine claims: all 23 re-checked against the current ledger (C001 C003 C004 C005 C008 C009 C010 C011 C012 C014 C022 C023 C025 C026 C027 C033 C034 C035 C037 C038 C039 C044 C046). Round-1 evidence stands; the changed ones (C003, C004, C008, C034) were re-opened above.
- Non-spine: re-opened C002, C006, C013, C015, C016, C017, C018, C019, C020, C021, C036, C040, C041, C043 and C045 this round (quote presence, and for C015 and C018 the NDMA Table 1.1 image: 21 of 23 rows India or Bangladesh; 1999 = 9,893; 1737 = 300,000).
- Statuses: C003 and C008 are honestly CORROBORATED (two agencies). C004 is CORROBORATED for ESCS+ "matched" and IMD-only for "2 vs 1 SuCS" (disclosed). C019 DISPUTED and C013 DISPUTED are correct.
- Myths and conflicts: M1 "Embellished", M3 "Embellished", M12 "Unverifiable", M14 "Embellished" match the evidence. Bangladesh and Myanmar handling is neutral and uses each country's own joint or WMO record, with the missing Bangladesh source flagged.

## Residuals (do not block G6)
1. **S15 has no `archive_url`**, and only 7 of the other 25 archive links could be fetched before Wayback rate-limited me. Add an S15 link and re-test the rest when Wayback allows.
2. **dossier.md line 5-6** still say "NOT CLEARED ... G6 pending" and "FAIL G6 (pending)". Update to G6: PASS (round 2) after the next research_check run. Narration of C004 must keep "by IMD's count".

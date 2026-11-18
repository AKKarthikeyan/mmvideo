G6: PASS. All 14 spine claims (C001-C009, C012, C014, C016, C017, C024) pass on independent re-check; two non-spine wording fixes are listed below.

# W3-03 Baarle: independent verification (G6, Shorts lite mode), 8 Nov 2026

Verifier: Claude Code, a separate session that did not do the research. Live re-fetches were done today (HTTP 200 unless noted). Scripts re-run with `python3 -I` on a copy of `method/` and `sources/`.

## Sources re-opened
| Source | Live check 8 Nov | Result |
|---|---|---|
| S01 Tractatenblad 1974 nr 188 PDF | byte-identical to saved copy | same |
| S02, S03 Verdragenbank 001294, 002268 | byte-identical | same |
| S04 wetten.overheid.nl BWBV0006026 | curl got empty reply (not bypassed); opened in the built-in browser, page text contains Art. 1 "plan spécial, en quatre feuilles", "dix-millième", "statu-quo", "interrompue", Dutch "afgebroken" | confirmed |
| S05 Chamber doc 197 PDF | byte-identical (OCR text, so quotes are checked on corrected reading) | same |
| S06 Chamber dossier 19K0197 | live HTML shows 24/05/1893 and caducité 19/09/1894 | confirmed |
| S09 PDOK Kadaster | live JSON: MultiPolygon, 9 parts, 22 holes in part 0 | confirmed |
| S10 Flemish VRBG | live geometry equal to saved; 26 parts, NISCODE 13002 | confirmed |
| S13 ICJ resume (node 103797), open page | OCR text reads "Par 10 voix contre 4 ... souveraineté ... appartenait à la Belgique", plots 91 et 92, 20 juin 1959. The ICJ PDF itself was not opened (bot check, not bypassed) | confirmed from the ICJ page |
| S14 Baarle-Nassau municipality page | text has "legpuzzel van 30 enclaves" and "in 2021 naar een Benelux Groepering" | confirmed |
| S15 Franckx PDF (vliz) | byte-identical | same |

## Spine claims
| Claim | Verdict | Evidence |
|---|---|---|
| C001 30 enclaves (22 + 8) | PASS | live PDOK 9 parts/22 holes, Flemish 26 parts/3 with holes (22 matched + 4 unmatched: 467.7, 18.49, 14.54, 9.08 ha), municipality says 30 |
| C002 22 enclaves match by area | PASS | compare script reproduces 165.24 vs 165.28 ha, max diff 0.04; "l'enclave H 22" in S15 note 28/p.345 |
| C003 7 of 8 Dutch pieces in Belgian enclaves | PASS | geometry output: 6 in the 165.24 ha hole, 1 in the 42.46 ha hole, 1 (2.85 ha) in none; Franckx p.341 "seven Dutch enclaves" |
| C004 about 35 km | PASS | 30.17 + 5.04 = 35.21 km; Franckx "a little bit more than 35 km" |
| C005 treaty 8 Aug / 3 Oct 1843 | PASS | S02 data block, S01 |
| C006 special plan, 4 sheets 1:10,000 | PASS | S04 Art. 1 |
| C007 "limit is interrupted", markers 214/215 | PASS | S04 Art. 14 §5 FR and NL; S01 grenspaal 214; S15 p.342 |
| C008 status quo Art. 14 of 1842 | PASS | S04, S15, S05 (OCR "Le statu quo sera" present) |
| C009 1974 Turnhout proces-verbal | PASS | S03 title "with the exception of all the enclaves", S01 |
| C012 ICJ 10 to 4, plots 91, 92 | PASS | ICJ resume page (see above) |
| C014 1892 exchange | PASS | S05 OCR "hameau de Castelré" line present; S07 bill title; S16 |
| C016 lapse 19 Sep 1894, deposited 24 May 1893 | PASS | live dossier page (the saved copy is only a WebFetch note; live HTML confirms) |
| C017 both municipalities still exist | PASS | NISCODE 13002 / GM0744 in live data |
| C024 names | PASS | see warnings below |

## Computations
All five scripts in `method/` re-run with `python3 -I`: output identical to the saved output files (count_enclaves_pdok, count_enclaves_flanders, enclave_geometry_pdok, compare_nl_be_areas, buildings_on_border). Basis is consistent: both counts come from current municipal polygons (Kadaster RD New metres, Flemish Lambert 72), areas in hectares, perimeters in km; the 35 km figure sums holes (22 Belgian enclaves) and detached Dutch parts, and the same-order figure from Franckx is for the 1995 line. Not equal in basis: the 34.39 km "holes + sub-enclaves" line in the output is a different sum and is not used in a claim.

## research_check.py warnings the caller asked about
- **C022/S15**: the quote was normalised. The saved text reads "F or a picture o f a house divided in two by one o f these lines, see the internet site mentioned above" (OCR spacing). Quote is real. The substantive problem is wording, see fix below.
- **C024/S10**: the quote "NAAM Baarle-Hertog" is the field print-out from the feature properties, not prose; confirmed in the live Flemish data (`'NAAM': 'Baarle-Hertog'`). The other two C024 quotes pass verbatim. No fix to the claim.
- The other WARNs (S09/S10/S11 method output lines, S05/S06 OCR or WebFetch notes, C011/S15 OCR spacing) are print-outs or OCR, not failures; the facts behind them were checked above.

## Statuses, sources, myths
- No tier X source in claims (S17 is myths-only). Statuses honest: C010, C011, C013, C018 SECONDARY-ONLY (Franckx/Wortel only; Moniteur belge not opened) and C021, C022 UNVERIFIED are correctly not spine. C003 and C004 CORROBORATED rests on two agencies plus Franckx. C015 VERIFIED-P rests on an OCR scan; reading "728 / 726" checked in the OCR text.
- Non-spine spot check (C010, C011, C013, C015, C021, C022): quotes found in S15 (C010/C011/C013) and the OCR (C015); C021 numbers (41 in use, 10 with a use, 4 homes, 5 shops, 2 assembly) match the saved output.

## Wording fixes needed (not spine; none blocks the verdict)
1. **C022 and dossier.md "Verdict" paragraph**: "the line cuts through houses (named by the 1995 procès-verbal via Franckx)" overstates. Franckx note 30 only says a picture of a house divided in two can be seen on a website; it names no house. Fix: "Franckx points to a published photo of a house divided by one of these lines" or drop the PV attribution. Same for the C022 claim text.
2. **dossier.md "most fragmented in Europe by the owners' own count"**: no claim or source carries "most fragmented in Europe". Fix: delete the superlative or add a sourced claim.
3. C021 (UNVERIFIED) stays out of the script; say "buildings are crossed" only with the tolerance caveat.
4. Safe-to-say facts 1-9 each map to claim IDs that pass; fact 10 (C010) must carry its hedge.

## Could not do
- ICJ judgment PDF behind a Cloudflare check: not opened, the ICJ web resume was used instead.
- Moniteur belge 26 June 1996 (source of C010/C011/C013) not opened by anyone; those claims stay hedged.

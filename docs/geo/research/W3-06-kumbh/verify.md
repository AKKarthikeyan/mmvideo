G6: PASS. All 21 spine claims in claims.jsonl pass on independent re-check (Shorts Lite Mode, 8 Nov 2026); all four method scripts reproduce their saved outputs byte for byte. Three wording notes below; none changes a spine claim.

# W3-06 Kumbh Mela: independent verification (G6, Shorts Lite)

Verifier: a separate Claude Code session that did not do the research. Date of check: 8 Nov 2026. Method: (1) every spine quote was machine-searched (whitespace, case and long-s normalised) in the saved copy in `sources/`; (2) the public pages were re-fetched live (HTTP 200) and key phrases re-searched; (3) the four scripts were copied to a scratch folder and run with `python3 -I`, then diffed against the saved outputs; (4) the Lahiri constant and a second ayanamsa were tested independently; (5) the dossier was read for wording. No API key was used or printed. The 1-in-3 non-spine spot check was skipped (no spine claim failed), except C035 (checked because it is a hook) and the C024/C026 absence tests (below).

## Spine claims (21: C001-C005, C007-C009, C012-C015, C019, C024, C025, C027-C029, C032-C034)

| Claim | Result | Evidence |
|---|---|---|
| C001, C002 | PASS | Saved UNESCO page and decision text contain every quoted phrase. Live ich.unesco.org returned its human-check page (not bypassed); saved browser copy relied on, CANNOT-REACH live but saved copy matches claim. |
| C003, C004, C025, C029 (nomination quotes) | PASS | All quotes present in `unesco_nomination_01258_excerpts.txt` (nomination .doc not re-downloaded; saved excerpts relied on). Nashik "Dakshin Ganga" and India-WRIS "Bay of Bengal" re-found live. |
| C005 | PASS | All seven rules re-found live on kumbh.gov.in/en/astrologicalsignificance (Aquarius/Aries Haridwar; Leo Nasik; Leo+Aries Ujjain; Libra+Kartik Amavasya; Cancer/Godavari; Aries+Capricorn Prayagraj). |
| C007 | PASS | "almost 12 years for Jupiter" live on nashik.gov.in; 11.874 y in kumbh_cycle output reproduced. |
| C008, C009 | PASS | Brahmkund/Har-Ki-Pauri and "once in every twelve years" live on haridwar.nic.in/history; Mohini, "four drops were spilled" and the four tirthas live on prayagraj.nic.in. |
| C012, C013 (Jupiter signs) | PASS | See computation block. |
| C014 | PASS | "SIMHASTHA" in nomination; "known as Simhastha Kumbh" live on nashik.gov.in. |
| C015 (gap table) | PASS | 2013: CAG page live ("14 January 2013 to 10 March 2013"). 2015-16: nashik.gov.in live. 2016: PIB live ("April 22, 2016"). 2021: haridwar.nic.in/event/maha-kumbh-2021 live ("11/03/2021 - 27/03/2021"). 2025: prayagraj.nic.in live ("January 13th, 2025 to February 26th, 2025"). Gaps 2,1,5,4 recomputed. See note 1. |
| C019 (Hardwicke) | PASS | `asiatick_researches_v6_1799.txt` lines 16196-16208: "every twelfth year, when Jupiter is in Aquarius, at the time of the Sun's entering Aries, the concourse ... greatly augmented. The present is one of those periods"; fair on "the 8th of April" (OCR long-s only, no ambiguity); "May, 1796." heading present. archive.org scan itself not re-fetched. |
| C024 | PASS | Beal vol. 1 Prayaga excerpt and Watters excerpt contain the quoted phrases. Absence test: no "pitcher/vase/jar/twelve/Jupiter/planet" in either excerpt; "kumbh" in full Beal vol. 1 = 0 hits; vol. 2 and Watters hits are only Kumbhakara, Kumbhaghonam, kumbhira (crocodile), Kumbhan stupa, unrelated. |
| C027 | PASS | "1,067 m" and "1,465 km" live on indiawris godavari page. |
| C028 | PASS | "Entire Ujjain district falls in Ganga basin" in saved MPPCB plan (live PDF returned 200, 4.4 MB; phrase present in saved text); "Chambal" live on India-WRIS Ganga page. |
| C032, C033 | PASS | four_sites.py reproduced exactly (Haridwar-Nashik 1152, Ujjain-Nashik 411, Allahabad UP, etc.); Haridwar 29.58 N 78.13 E found in saved district page. |
| C034 | PASS | Gazette number live on prayagrajdivision.nic.in; "Simhastha Kumbh Mela 2027 in Nashik and Trimbakeshwar" live on divcomnashik. |

Non-spine checked: C026 (see note 3), C031 (garhwal.uk.gov.in/kumbh-mela live, HTTP 200, mentions Kumbh; kept as SECONDARY-ONLY by the researcher, correctly hedged), C035 (script output: Leo 2026-11-01, Cancer 2027-01-25, Leo 2027-06-26, Virgo 2027-11-27, as the dossier says).

## Computations re-run (python3 -I, scratch copies)

| Script | Result |
|---|---|
| jupiter_signs.py | exit 0; output identical to saved (diff clean). |
| historic_check.py | exit 0; identical. |
| kumbh_cycle.py | exit 0; identical (gaps 2,1,5,4; mean period 11.874 y; Taurus 42.5 / Leo 133.0 / Leo 139.3 / Aquarius 301.5 / Taurus 47.1). |
| four_sites.py | exit 0; identical. |
| Raw data check | Live JPL Horizons for 2015-07-15 returns ObsEcLon 144.2662973, equal to the CSV. |
| Lahiri constant, independent | My own 23.853 deg at J2000 + 50.27"/yr gives the same ingress dates (Leo 2015-07-15, Virgo 2016-08-12) and the same sign at every event. A third value (KP 23.76) gives Leo 2015-07-14, same Virgo date. |
| Other ayanamsa (Raman ~22.46) | Event signs unchanged (Taurus 2013, Leo 2015/16, Aquarius 2021, Taurus 2025). Ingress dates move: Leo from 7 Jul 2015, a dip into Virgo 21 Dec 2015 to 27 Jan 2016, Virgo for good 5 Aug 2016. Conclusions hold; exact dates are ayanamsa-dependent. |
| Definitions | Basis consistent across all figures: geocentric apparent, sidereal Lahiri, event mid-date. The 2013 and 2025 Jupiter positions (42.5, 47.1 deg) are 12 to 17 deg into Taurus, safe margins. Haridwar 2021 is 1.5 deg inside Aquarius, thin but correct under three ayanamsas. |

## Statuses, tiers, myths

Statuses honest: VERIFIED-P claims rest on pages that state the thing (government or UNESCO origin); CORROBORATED claims (C012, C013, C014, C028, C033) have two distinct origins or origin plus our computation. Legend claims stay attributed ("according to"). No tier-X source is cited on a spine claim (Wikipedia S-X is listed in sources.jsonl only as a rejected lead). myths.md verdict rows are consistent with the evidence checked. Every "safe to say" fact in dossier section 6 carries a claim ID that passes.

## Wording notes (not FAIL)

1. Gap table: "Nashik 2015" is the Simhastha's first year; the official page says "2015-16" and the Ujjain event is 2016, so a viewer could count Nashik as 2016. The script computes the Nashik gap from a July 2015 flag date. Keep script wording "2015" with "Nashik-Trimbakeshwar 2015-16" on screen, or the gaps 2,1,5,4 become 3,0,5,4. Haridwar's 11-27 March 2021 dates are disputed (conflicts K5); show the year only, as the dossier says.
2. Jupiter ingress dates (15 Jul 2015, 12 Aug 2016, "around 1 Nov 2026" with only 0.09 deg margin) depend on the ayanamsa. Any Short line must say "about", say "in the Indian zodiac", and not give a dated minute. H4 ("Jupiter entered Leo around 1 November 2026") is acceptable only with "around".
3. C026 and dossier F6 (Bhagavata 8.7-8.12 contain no four places) rest on one GRETIL e-text; keep out of the Short unless a Sanskritist confirms, as the dossier already says. Safe-fact 3 ("the city is set by where Jupiter, Sun and Moon stand") must stay attributed to Indian government pages, as written. No other wording takes a side or states a disputed point as fact.

CANNOT-REACH (live, logged, not blocking): ich.unesco.org pages (human-check page; saved browser copies used, not bypassed); nomination .doc and archive.org scans not re-downloaded (saved copies searched).

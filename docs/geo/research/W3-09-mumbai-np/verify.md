G6: PASS. All 8 spine claims (C001-C008) re-confirmed digit by digit against saved copies; the SGNP pages also against the live site on 8 Nov 2026; method script reproduces its saved output.

# W3-09 Mumbai national park: independent verification (G6, lite mode), 8 Nov 2026

Verifier: separate Claude Code session. Lite mode: only the 3 sources were re-opened; non-spine spot-check skipped (no spine failure).

| Claim | Source / locator | Result | Evidence |
|---|---|---|---|
| C001 | S01 gazette, WHEREAS clause | PASS (saved copy) | "is a unique habitat enclosed in the metropolis of Mumbai and is located in the Thane and Mumbai District of Maharashtra" in moef_so229e_draft.txt line 1479-1480. Live egazette not re-fetched: no URL recorded. |
| C002 | S02 History page, slide 5 | PASS (saved + live) | "103.84 sq.km. of SGNP known today" at live /1215/History-of-SGNP. |
| C003 | S02 slide 1 + S01 table | PASS (saved + live) | Carousel index 0 = 1870; first item "Vihar and Tulsi lakes were constructed by the British government to supply drinking water to Mumbai city." Gazette row 1 "Tulsi Lake in village Tulsi". Year-to-caption pairing holds (5 indicators, 5 items, same order). |
| C004 | S02 slide 2 + S01 | PASS | Index 1 = 1942; Bombay Municipal Corporation caption exact. Gazette line 1744 "purpose of MCGM for their existing reservoirs of tulsi". Causal "why" is the park's own narrative, hedged correctly. |
| C005 | S02 slides 3-5 + prose | PASS | 1950 "about 20 sq km", 1968 "68.27 sq.km.", 1981 re-dedicated all present. Prose gives 1969 and 1974 (conflicts K1/K2 disclosed). Dossier does not state the early years as fact beyond "(timeline)". |
| C006 | S02 Kanheri page + S01 pt 18 | PASS (saved + live) | "2,000-year-old complex sits within the park"; "derived from Sanskrit word 'Krishnagiri' ... 'black mountain'". Gazette point 18 Kanheri. Cave count correctly excluded. |
| C007 | S03 PDF report summary | PASS (saved copy only) | "52 adult leopard individuals and six cubs were detected in SGNP in 2023, followed by 54 adult leopard individuals and four cubs in 2024" in wework_leopards.txt. Live PDF URL not recorded and not located; the saved PDF is the evidence. Page number "p.04" not independently confirmed. |
| C008 | S02 Living with Leopards | PASS (saved + live) | "domestic prey contributed 43% of the leopard's diet in SGNP, with stray dogs accounting for 24%". |
| C009 (non-spine) | S01 | PASS | 6110.629 ha in table and para 1(1); "up to Four kilometres from the boundary". |
| C010 (non-spine) | S02 | PASS | "20,925 people per sq. km (according to the 2011 census)" live and saved. |

## Computation
method/sgnp_boundary_area.py run with python3 -I: output identical to saved output. Only a rough cross-check; not used for any claim figure.

## Statuses and wording
- VERIFIED-P statuses are supported (primary sources state each). No tier-X sources. Myths M1-M3 "Unverifiable/Embellished" match the evidence.
- Wording risks (minor): dossier Short beat 5 says "That forest became Krishnagiri National Park, later Borivali" and beat 9 "a quarter (24%)" are fine; beat 4 "bought" is stronger than the source's "acquired" - use "acquired". Beat 1 quote: say "the gazette's draft notification". "Mumbai kept a forest to guard its drinking water" is the park's own narrative, not a gazette fact; attribute it.
- Housekeeping: sources.jsonl lacks exact URLs. Live pages: https://sgnp.maharashtra.gov.in/1215/History-of-SGNP, /1231/Kanheri-Caves, /1221/Living-with-Leopards. S01 and S03 URLs still unrecorded.

# CY03 Galwan and the LAC: open questions, wording risks, and gaps (28 Oct 2026)

## A. Wording risks for AK (sensitive topic: live border dispute with a neighbour, soldiers killed)

1. **It is live right now.** On 2 Oct 2026 the Ministry of Home Affairs published 28 standard names for places in Ladakh on the Survey of India map (the list includes Gogra and Hot Spring); on 13 Oct China's Foreign Ministry called this "illegal and void"; MEA answered the same day [C020, C021]. A Short on this topic published in November lands inside that exchange. Do not put any of the 28 new names on screen, and do not use the words "illegal", "void", "integral" or "inalienable" except as attributed quotes. AK should decide whether to wait.
2. **The title.** "Never ended" and "still face off" are not supported by the official record (dossier section 1). Using them would state something both governments' 2026 texts do not say. Three fact-based alternatives are in the dossier; the choice is AK's (rule 7).
3. **Words for the event.** India says "violent face-off"; China says "skirmish", "fierce physical conflict". Each is that side's word. A neutral frame is "the clash of 15 June 2020", with "India says ... China says ..." for who did what and where.
4. **No blame verbs in the narrator's voice.** Avoid "attacked", "intruded", "transgressed", "aggression", "retreated", "gave up", "conceded", "won" or "lost ground". They are all in one side's official text and none is neutral. India's Defence Minister said "we have not conceded anything" (Feb 2021); that is India's claim, not ours.
5. **The dead.** Never name them (the Indian and Chinese texts both do). Avoid "martyr" and "supreme sacrifice" (both governments' words, with emotional load). Say "20 Indian personnel died, according to India" and, if used, "China says four of its soldiers died" with the hedge (SECONDARY-ONLY; the original Chinese announcement was not retrieved). Never compare the two numbers as a score.
6. **No line, no side shading.** The research rules forbid drawing any disputed border. There is no agreed LAC; the official Indian sheet has none. Pins and labels only. Do not shade "Indian" and "Chinese" sides at Galwan: each government places the valley on its own side [C030, C032].
7. **Do not use the word "buffer zone"** as if it were official. The official terms are "temporary moratorium" (Pangong north bank) and "steps of a temporary and limited nature" (EAM). Which places they cover is not listed [C051, C057, C067].
8. **Names.** "Pangong Tso" (Survey of India) not "Banggong Co" (Natural Earth label), not "Bangong". Gogra-Hot Springs is "Jianan Daban" in China's text: do not equate them on screen. "PP14" for Galwan is not in any official text; leave it out [C066].
9. **"China" vs "Chinese".** Say "China's army" or "the PLA" and "China's government", never "the Chinese" as a people. Same for India.
10. **Territory-claim numbers** (38,000 sq km, 5,180 sq km, 90,000 sq km) are in the Indian texts. They are not needed for this story and are deliberately not in claims.jsonl.
11. **Hedge on "never".** A hook that says the treaty "never produced a shared line" is absolute; the supportable form is "India's government says the LAC still has no common understanding in some areas" [C011, C016].
12. **Disclosure:** AI narration, "Altered or synthetic content: Yes" (house rule 9). Platform policy on disputed-territory maps was not researched.
13. **Copyright:** the Survey of India sheet is marked "Reproduction in whole or part ... prohibited without written permission". We read coordinates from it; its image must not be re-used in the video. Use the house outline and our own drawn terrain.

## B. Gaps and unreachable sources

| # | Gap | What would close it |
|---|---|---|
| Q1 | The Chinese casualty count (four, C070) rests on a China Daily article hosted on the Ministry of National Defense site and on a reporter's question in the Chinese MFA transcript. The ministry's own statement of the number, or the Central Military Commission announcement of 19 Feb 2021, was not retrieved | Open the Xinhua or PLA Daily text of 19 Feb 2021 in a browser; or a Chinese MND transcript. Until then the number is hedged or left out |
| Q2 | A post on X attributed to the EAM (date as reported by news, unverified) about carrying arms and the long-standing practice not to use firearms. The primary was not opened (X needs a login). C040 stays UNVERIFIED | AK or a verifier opens the post; then add it as a P-tier quote |
| Q3 | "Patrolling Point 14" and the Galwan point; any official use of "buffer zone"; the "few other places" under "temporary and limited" steps. None is in the official texts read. The Sansad (Lok Sabha / Rajya Sabha) question archive was searched by web search only, not browsed | Browse sansad.in question search for "PP-14", "buffer", "Galwan" 2020-2026 |
| Q4 | Which "Hot Spring" label is PP-15 (Gogra-Hot Springs)? CANNOT BE RESOLVED from what we read: the Survey of India sheet has at least four "Hot Spring" labels (Kugrang valley, Chang Chenmo valley, near Demchok, near Chushul, and another in Nubra) and no official text says which is PP-15. No PP-15 coordinate is given anywhere in this folder (C083) | Survey of India topo sheet at 1:250,000 (sheet 52 B or similar) or an official description of PP-15 |
| Q5 | Elevations come from two NASA datasets read through a public API. A third source (Copernicus GLO-30 tile read with GDAL) was planned and not done because the default Python has no GDAL/numpy | Install rasterio in a venv and read the tile; or accept the two |
| Q6 | The Chinese text behind India's "1959 LAC" reply (MEA 29 Sep 2020) was not found on the Chinese MFA site | Search the MFA transcripts of 28-29 Sep 2020 in a browser |
| Q7 | MEA's copy of the 1993 Agreement was not located; the UN Peacemaker copy is used. The MEA scans of the 1996 and 2005 texts are saved but OCR-garbled | Treaty database page on mea.gov.in |
| Q8 | Not searched: 1962-period records, colonial maps of the Ladakh boundary, Tibetan or Ladakhi names. Not needed for a 30-second Short | Only if a long film is planned |
| Q9 | Army Chief's January 2026 statements ("stable but needs constant monitoring", "not looking at reduction of troop levels") reached us only through news; no PIB or Army transcript was found. They are not used | Indian Army or PIB release of the annual press conference |
| Q10 | Whether any sector's LAC maps were ever exchanged (India: clarification exercise to 2003). No official text read says | Parliament answers or SR-talk records; ask AK whether the point matters |
| Q11 | Kongka La: named as a friction area in Sept 2020; no separate disengagement notice found | MEA or MoD answer naming it |
| Q12 | The MEA "Kazan" meeting readouts and the Tianjin readout were not opened (dates come from the MEA July 2026 brief) | Open MEA press release of 23 Oct 2024 and 31 Aug 2025 |
| Q13 | G6 (independent verification) is pending: a separate checker must re-open every spine source, re-run `method/geo_points.py`, `method/pangong_lake_level.py`, `method/pip_check.py`, and re-read the map positions | see verify.md. The checker's SRTM grid put the Galwan-Shyok junction near 78.16 E, about 4,150 m, 85.6 km from Leh; the folder now states a range (78.16-78.19 E, about 4,200 m, 85-87 km; method/tolerance_scan_output.txt) |

## C. Draft requests for AK

- Ask AK: (1) which framing (dossier section 1: a, b or c), (2) whether to wait until the 28-names exchange of October cools, (3) whether a hedged mention of China's figure of four is acceptable, (4) whether to open the EAM's post on X in a browser (Q2).

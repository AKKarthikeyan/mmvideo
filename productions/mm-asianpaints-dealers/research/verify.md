G6: PASS. All 12 spine claims and 7 randomly drawn others re-opened on the saved PDFs and confirmed; one unsampled claim (C023) failed the arithmetic re-run and is downgraded to DISPUTED, which touches no spine claim.

# mm-asianpaints-dealers: independent verification (G6), 22 Nov 2026

Verifier: a fresh Claude Code session (fact-checker role, contract 02) that did not do the research. Run on the Mac Mini. Every quote below was searched in a **fresh PyMuPDF extraction of the saved PDF**, not in the researcher's `*.pages.txt`. PDF page = 1-based index into the PDF, matching the researcher's locators.

## How claims were chosen
- **Spine (12, all re-opened):** C001, C002, C003, C004, C012, C013, C016, C017, C025, C027, C028, C030.
- **Others (21, one in three = 7):** seeded draw, `random.Random(20261122).sample(sorted(non-spine IDs), 7)` over the 21 non-spine IDs. Drawn: **C006, C014, C019, C021, C026, C031, C032**.
- **Extra, not required:** every one of the 46 quote entries across all 33 claims was also searched on its stated PDF page (mechanical check, 46/46 found); and every calculation was re-run (C020, C023, C033). The extra mechanical pass is why C023 was caught although it was not in the draw. For judgement (claim vs quote, tier, hedge) I read the surrounding text of the 19 formal claims plus C020, C023, C033.

## Calculations re-run
- C033: 75,793 - 72,873 = 2,920; 2,920 / 75,793 = 3.853% -> "about 3.9%". PASS.
- C020: 11,500 / 6,679 = 1.7218 -> +72%. The rendered page (PDF p.31, printed p.59) shows 11,500 vs 6,679 and an up-arrow 72%. PASS.
- C023: ~4,50,000 / ~2,63,000 = 1.711 -> **+71%**, but the chart's badge reads **42%** (rendered page viewed). 42% matches neither growth on those numbers; it is close to the FY25 gap as a share of FY26 ((4.50-2.63)/4.50 = 41.6%), i.e. the company's badge appears to be computed on the wrong base. The claim repeats "up 42% on FY25 (about 2,63,000)" next to values that imply +71%. **FAIL for the 42% part** (see below). The "nearly 4.5 lakh active contractors and painters" part is confirmed at PDF p.12 and p.31.

## Spine claims
| ID | Verdict | Check |
|---|---|---|
| C001 | Confirmed | PDF p.164, BRSR Principle 9 table: "Number of dealers/distributors to whom sales are made 72,873 75,793", columns FY 2025-26 then FY 2024-25. Note 3 on the page says Deloitte gave reasonable assurance on this indicator, so it is better than a bare company claim. Claim says "dealers/distributors", as the table does |
| C002 | Confirmed | Same table: 99.0% / 99.0% and top-10 0.9% / 0.9%. Note 2: gross sales used. Claim reads the metric correctly (top 10 as share of sales to dealers/distributors) |
| C003 | Confirmed | PDF p.17: "During the year, we added nearly 6,000 new retail touchpoints." Claim says "Asian Paints says" and does not equate touchpoints with dealers: hedge right |
| C004 | Confirmed | PDF p.17, next sentence: "The overall network strength remains one of our strongest competitive advantages." Management's own claim; claim text is attributed ("Asian Paints calls") |
| C012 | Confirmed (company claim) | PDF p.12: "over 50,000 dealers across more than 11,500 towns, supported by 146 depots"; p.30 repeats 50,000 / 11,500 and "146 depots by March 2026". One origin, so VERIFIED-P not CORROBORATED is right. Attributed to Grasim in the claim |
| C013 | Confirmed (company claim) | PDF p.30: "with dealers armed with new-age compact tinting machines enabling real-time data analytics" (the ASCII hyphen vs the PDF's non-breaking hyphen is the only difference). Claim attributed to Grasim; no machine count stated |
| C016 | Confirmed (company claim) | PDF p.12: "No.2 player by capacity market share and crossed 10% revenue market share in March 2026". Attributed. No base or measurer given, as the researcher says |
| C017 | Confirmed (company claim) | PDF p.30: "become the third-largest decorative paints brand in India in under two years of launch". Attributed. p.12 says "third-largest organised decorative paints player"; the script must not mix the two wordings (conflicts K3/K4) |
| C025 | Confirmed (company claim) | PDF p.31 rendered: Outlook box, "The competitive dynamics that Birla Opus helped catalyse ... will be most beneficial for a challenger with brand strength, capacity, and distribution depth to capitalise on growing demand." The claim's gloss "the competitive dynamics Birla Opus helped catalyse" is in the sentence. Attributed |
| C027 | Confirmed, one nuance | PDF p.1: WP 2887 of 2025, Asian Paints v. CCI and Grasim (Birla Paints Division); p.2: CORAM Revati Mohite Dere and Dr. Neela Gokhale, pronounced 11 September 2025; p.39 para 41: "we find no merit in the petition. The petition is accordingly dismissed." Nuance: para 2 says the petition challenges "the orders dated 1st July 2025", the first uploaded 1 July and "allegedly/purportedly replaced by the second order of the same date uploaded ... on 2nd July 2025" in Case No.32/2024. The claim's "order of 1 July 2025" is fair, but the script should not give an upload date |
| C028 | Confirmed, allegation | PDF p.27 para 30: "It appears that the Respondent No. 2 had made a representation to the CCI in December 2024 ... alleging therein, that the Petitioner has abused its dominance". p.29 item (iii): "Directing its dealers to return/ not use or not install the tinting machines supplied by the Informant". The court itself hedges ("It appears"). The claim text says "records that Grasim ... alleging" and the notes forbid narrating it as fact: hedge right. It must stay an allegation, and still unproven (no finding) |
| C030 | Confirmed | PDF p.33 para 34 and p.39 para 40, quotes exact. Claim says what the court recorded; no merits finding is implied |

## Drawn non-spine claims
| ID | Verdict | Check |
|---|---|---|
| C006 | Confirmed | PDF p.14, both quotes found; the chairman's letter calls it part of the "growth philosophy"; "pillars" is the researcher's word, harmless. "Counter share" correctly left undefined |
| C014 | Confirmed (company claim) | PDF p.63, quote exact; attributed to Grasim |
| C019 | Confirmed (company claim) | PDF p.30: "covering 100% of towns each with more than 50,000 population, available in over 6,000 pin codes". In the source, "covering" attaches to the 50,000 dealers; the claim's wording matches. Pin-code figure is ambiguous (dealers vs brand availability), as the researcher noted; keep it out of the voice unless needed |
| C021 | Confirmed (company claim) | PDF p.90, quote exact incl. "Signature Club" and the three countries. Claim does not allege anything about the entrant |
| C026 | Confirmed (company claim) | PDF p.12, exact; framing only |
| C031 | Confirmed | PDF p.39 para 39: the court quotes Bharti Airtel para 121. Exact. Good guard rail |
| C032 | Confirmed | PDF p.30 para 31: JSW representation in 2019; DG investigation order 14 January 2020; 8 September 2022 dismissal "as no case of contravention of Sections 3 and 4 had been made out". The claim's date and sections are as the court states them. Para 31 also says Grasim invoked different sections, and p.31 says JSW's appeal is pending before the Appellate Tribunal: the script must not imply this proves Grasim's case will fail |

## Not confirmed
| ID | Status set | Why |
|---|---|---|
| C023 | VERIFIED-P -> **DISPUTED** | "Up 42%" does not follow from ~2,63,000 -> ~4,50,000 (+71%); the chart's own 42% badge and its values disagree. Narration may say "nearly 4.5 lakh contractors" (confirmed) but must not state a growth rate. Researcher: split the claim into the 4.5 lakh figure and a separate note on the chart inconsistency. Not spine |

## Source notes
- **S03 (Bombay HC judgment) from a news CDN:** acceptable as P2 for this use. Evidence: footer on every page ":::Uploaded on - 12/09/2025 :::Downloaded on - 15/09/2025 12:36:19", the Bombay High Court neutral citation "2025:BHC-OS:15008-DB" and a digital-signature stamp of the court's officer (Shagufta Qutbuddin Pathan, 2025.09.12) printed on page 1, 40 pages, and the PDF metadata (producer FPDF 1.53, created 15 Sep 2025 12:36:19) match the footer time, so the file is the court portal's own download generated at that moment and then re-hosted, not a retyped copy. Limits: there is no embedded cryptographic signature to validate, and I did not compare bytes with the court's site. Because the film quotes only paragraph-level text and the claims already say "the court records", the risk is low. Before publishing, a person should fetch the same judgment from the court's site and compare the paragraphs used (hash or a read of paras 30, 34, 39-41).
- **S01/S02 tier:** the researcher uses P4 with "company claim" in notes and claim text. This is workable here because each Grasim claim text begins "Grasim says" and the Asian Paints claims are attributed or assured (BRSR). It is not a rules-clean answer (see STATUS dry-run notes). No claim is narratable as independent fact: all Birla Opus market-share, dealer and network figures are the entrant describing itself.
- **G7 (self-declared in dossier.md):** re-judged by me. Facts 5 (towns +72%), the CCI allegations as allegations (C028/C029/C031) and the failed JSW precedent (C032) are verified and not in the popular version, and C032 or the 99.0% / 0.9% concentration with a falling dealer count (C001/C002/C033) can carry a hook. I agree with the G7 line, but the dossier must not use C023's 42% (fresh-angle list item 5 uses C020, not C023, so it is unaffected).
- **myths.md:** M5 and M6 are "Confirmed" but are company claims only; they are labelled so in the text. Fine as long as the script says "Grasim says".
- **Ledger CSV:** none in this research folder.

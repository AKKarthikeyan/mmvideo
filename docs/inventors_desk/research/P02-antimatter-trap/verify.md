G6: PASS

# G6 independent verification: P02 antimatter trap

- **Verifier:** a separate Claude Code agent (Opus) with fresh context. It did not do the research and had no part in the ledger.
- **Date:** 27 Oct 2026
- **Read:** `claims.jsonl`, `sources.jsonl`, `sources/`, `popular/` and the rules (RESEARCH_RULES.md sections 1, 4 and 9). The researcher's notes (dossier, myths, conflicts, search_log and the old verify.md) were not opened.
- **Method:** each quote was searched for in the local copy after normalising whitespace and quote marks, then read in its surrounding text. S01 was checked against `pdftotext` of the PDF itself, not only the researcher's `_flow.txt`. The S07 quotes were read off an image of `US2197079.pdf` page 3 rendered at 110 and 300 dpi.
- **Random sample:** `random.seed(20261027)`, then `random.sample(non_spine_ids, 12)` over the 34 non-spine IDs in file order. Sampled: **C008, C013, C018, C019, C020, C021, C033, C042, C048, C065, C074, C081**. That is 12 of 34, at least one in three.
- **Also checked:** C045 (one of the S07 quotes the task named). Because of the failures, every other claim from the affected sources was re-checked: C009, C011, C014, C016, C022, C056, C061, C062.

## Verdict in brief

- **Quotes:** every quote in all 51 claims checked is really in its source, at or near its locator.
- **Support:** every claim's content is supported by its sources, apart from one gloss in C048.
- **Why G6 fails:** four spine claims (C003, C017, C057, C058) are labelled **CORROBORATED** although their two sources share one origin. Section 4.4 says that does not count as independent. Each still has a Tier P source that states the fact directly, so the right status is **VERIFIED-P**. That status still allows narration, so G2 is not at risk once they are relabelled.
- **One unsupported detail:** non-spine C048 adds "(Philips)" for Holst, which its only source does not say.
- **To pass:** no spine fact needs to change. Relabel the four claims, fix C048, then re-run G6.

## Results table

| Claim | Source | Quote found? | Supports claim? | Notes |
|---|---|---|---|---|
| C001 (spine) | S01 p.1 | Yes, exact (PDF p.1; repeated in the p.5 summary) | Yes | The author list matches the PDF metadata. "First" means the first quantum cyclotron, as the claim's note says. |
| C002 (spine) | S02 | Yes, exact | Yes | The kind of date is right: journal publication 21 Oct 2026, received 2 May, accepted 19 Aug. |
| C003 (spine) | S01 p.2; S03 | Yes, both exact | Yes, for "months" | **FAIL (status).** S03 is Northwestern's press office describing the same group's result, so it is not independent of S01. The claim's own note admits this. The status should be VERIFIED-P (S01 is Tier P5). **On duration:** no source gives anything more exact. The paper, the NU release, ScienceAlert and Smithsonian all say "months". Scientific American's headline, photo caption and one body line say "**a month**", but the same article also says "for months at a time". Keep "for months" and never give a number. |
| C004 (spine) | S01 p.1; S03 | Yes, both | Yes | 300 mK = 0.3 K. |
| C005 (spine) | S01 p.1 | Yes, exact | Yes | |
| C006 (spine) | S01 p.1 | Yes, exact | Yes | "Up to 546 keV" is the beta endpoint, as also stated on p.2 and p.5. |
| C007 (spine) | S01 p.2, p.3 | Yes, both | Yes | The 625 µm hole and the Rydberg positronium are on p.3, next to the quoted text, but neither quote carries the "625" figure. Add a quote for the 625 µm hole if it is said in the voice-over. |
| C010 (spine) | S01 p.2; S03; S04 Fig.1 | Yes, all | Yes | CORROBORATED is valid because S04 (Dehmelt 1989) is independent of S01/S03. S04 also gives "a weak electric quadrupole field" and "homogeneous magnetic field", which support "weak" and "uniform". The 206 MHz figure rests on S01 alone, which is fine because S01 is Tier P. |
| C012 (spine) | S01 p.4, p.3 | Yes, both | Yes | QND (nondemolition, measured without changing the state) is stated on p.1 and p.5 but is not quoted. "One level at a time" matches "one-quantum cyclotron excitations" on p.4. |
| C015 (spine) | S01 p.5 | Yes, exact | Yes | "Not yet measured" is a fair reading of "now seems feasible". |
| C017 (spine) | S15 abstract; S03 | Yes, both | Yes | **FAIL (status).** S03 (Northwestern press office) reports the group's own S15 result, so it is not independent. The status should be VERIFIED-P (S15 is P1). The citation "PRL 130, 071801 (2023)" is **not in S15's local copy**. It is in S22 (Gabrielse CV), which is not listed as evidence. S15 v2 is dated 7 Dec 2022; the arXiv ID 2209 shows v1 was posted in Sept 2022. **Wording:** 0.13 ppt is about 1 part in 7.7 trillion, so "about one part in ten trillion" (S03's rounding) slightly overstates the precision. |
| C030 (spine) | S21 | Yes, exact | Yes | Locator is off: both quotes are on printed **p.324** (PDF p.5), not pp.322-323. Easy to find. |
| C032 (spine) | S20 p.367 | Yes, exact (p.367 confirmed) | Yes | Cloud chamber, cosmic rays and magnetic field are on p.366 of the same lecture. The kind of date (paper publication) is right. |
| C034 (spine) | S19 FAQ; S01 p.1 | Yes, both | Yes | Sources are independent (CERN and Gabrielse group). "Isolate them from all normal matter ... extremely high vacuum" is in S19 right after the quote. |
| C040 (spine) | S07 scan | Yes, **on the scan image** | Yes | Header read on US2197079.pdf **page 3**. That is the first page of the patent text; the locator calls it "scan p.1". |
| C041 (spine) | S07 scan; S08 register | Yes, both (S07 on the image) | Yes | The scan reads "Application October 21, 1936, Serial No. 106,915 / In Germany May 28, 1936" (the OCR's "108,915" is wrong). S08 gives priority 1936-05-29. **Wording:** the DE register says the application was "filed by Philips Patentverwaltung GmbH". Penning is the inventor, so "the invention was first filed" is more exact than "Penning first filed". |
| C043 (spine) | S07 col.1 l.1-3; S08 | Yes, both | Yes | Checked on the scan image. |
| C044 (spine) | S07 col.2 l.3-7, col.1 l.50-55 | Yes, both **on the scan image** | Yes | The wording matches exactly, including "or even for more than hundred times". The patent allows angles from about 40° up to near-perpendicular, so "across" is fine. |
| C050 (spine) | S06 para 1; S04 title | Yes, both | Yes | Sources are independent. The Ramsey half and "introduced and developed the ion trap technique" are both in S06. |
| C051 (spine) | S05; S28 p.A1 | Yes, all three | Yes, as **what Dehmelt said** | The claim attributes it correctly ("Dehmelt later wrote (1989)"), and the status (VERIFIED-P, one origin) is right under rule 4.3. **Wording:** in S05 the wondering is set off jointly by Becker's dot, by hearing that an electron's wave function spreads over all space, and by reading about ion trapping in radio tubes as a teen. The claim gives the dot alone. Keep "Becker's localization feat" or mention the other two. |
| C052 (spine) | S05 | Yes, exact | Yes | |
| C053 (spine) | S05 | Yes, exact | Yes | This is his recollection (1989) of 1959, and the claim's note says so. |
| C055 (spine) | S09; S06 | Yes, both | Yes | 19 Nov 1973 confirmed on the S09 record. Sources are independent (paper and Academy). |
| C057 (spine) | S11; S04 | Yes, both | Yes | **FAIL (status).** S04 cites S11 directly ("(Gabrielse et al. 1985)"), so the two are one origin under rule 4.4. The status should be VERIFIED-P (S11 is P1). S11 gives Gabrielse as first author, 11 Feb 1985, and "more than 10 months". |
| C058 (spine) | S10; S25 | Yes, both | Yes | **FAIL (status).** Both sources have origin "Dehmelt group, Seattle" (same authors), so they are not independent. The status should be VERIFIED-P (S10 is P1). S10 confirms the g-factor anomaly measurement; published 14 Dec 1981. |
| C059 (spine) | S13 | Yes, both | Yes | Equal "to about two parts in a trillion" is the ±2.1×10⁻¹² uncertainty. That is fine. |
| C060 (spine) | S06; S29 | Yes, both | Yes | |
| C070 (spine) | S22 | Yes, both | Yes | The Harvard (1987-2017) and Northwestern (2017-present) dates are in the same Positions block but not quoted. |
| C071 (spine) | S12 | Yes, both | Yes | "3-kV potential" is in the same abstract but not quoted. Published 17 Nov 1986. |
| C072 (spine) | S14 | Yes, exact | Yes | |
| C008 (sample) | S01 p.2 | Yes | Yes | |
| C013 (sample) | S01 p.4 | Yes, both | Yes | |
| C018 (sample) | S24 | Yes | Yes | Gabrielse quoted in Scientific American. |
| C019 (sample) | S03 | Yes | Yes | |
| C020 (sample) | S03 | Yes | Yes | |
| C021 (sample) | S03 | Yes | Yes | |
| C033 (sample) | S19 | Yes | Yes | Keep the hedge, as the claim's note says. |
| C042 (sample) | S07 scan; S08 | Yes, both | Yes, DISPUTED fits | Scan: May 28; register: 1936-05-29 (DE and NL49158). |
| C048 (sample) | S33 | Yes | **Partly** | **FAIL (unsupported detail).** S33 lists Gilles Holst as "prof, Eindhoven" and the nominator as Gerhard J. Elias, Delft. "(Philips)" is not in S33. The only saved source that ties Holst to Philips is S36 (Tier S). Drop "(Philips)" or source it. S33 has no other claims to re-check. |
| C065 (sample) | S28 | Yes, both | Yes | |
| C074 (sample) | S35 | Yes | Yes | S35 says "such a trap", meaning the UW group's trap described in the sentence before. Weak P3 source; the note already says don't narrate it alone. |
| C081 (sample) | S17 | Yes | Yes | CERN claim (P5). |
| C045 (S07 special) | S07 col.1 l.7-12 | Yes, **on the scan image** | Yes | "Leaked mercury vapour" comes from l.13-25 of the same column. True, but not in the quote. |
| C009 (re-check S01) | S01 p.2 | Yes, both | Yes | |
| C011 (re-check S01) | S01 p.2 | Yes | Yes | |
| C014 (re-check S01) | S01 p.5 | Yes | Yes | |
| C016 (re-check S01) | S01 p.5 | Yes | Yes | |
| C022 (re-check S03) | S03; S23 | Yes, both | Yes | Independence is weak: the press office and Gabrielse's own interview. Acceptable for a non-spine claim. |
| C056 (re-check S04) | S04; S26 p.233 | Yes, all (the S26 OCR line-break hyphen confirmed) | Yes | The word "geonium" is in the sentence just before the S04 quote. S26's footnote gives the name to Dehmelt. |
| C061 (re-check S04) | S04 | Yes | Yes | |
| C062 (re-check S04) | S04 epigraph | Yes | Yes, RECOLLECTION fits | |

## Failures and fixes

1. **C003 (spine):** relabel CORROBORATED → **VERIFIED-P**, because S03 is not independent of S01. Keep the wording "for months".
2. **C017 (spine):** relabel → **VERIFIED-P** (S03 is not independent of S15). Add S22 (CV) as evidence for "PRL 130, 071801 (2023)", or drop the citation. For the voice-over, prefer "0.13 parts per trillion", or "about one part in eight trillion" if a ratio is needed. "One part in ten trillion" is the press office's rounding.
3. **C057 (spine):** relabel → **VERIFIED-P** (S04 cites S11). Two genuinely independent sources would be needed to keep CORROBORATED.
4. **C058 (spine):** relabel → **VERIFIED-P** (S10 and S25 are the same group). The second source can stay as support.
5. **C048:** drop "(Philips)", or cite a Tier P source for Holst's Philips post. S36 is Tier S and would need a hedge.

Re-checks (rule G6): every other claim from S01, S03, S04, S10, S11, S15, S25 and S33 was checked (table above). No further content failures were found.

## Other observations (not failures)

- **The same status mistake recurs.** In four claims, sources sharing one `origin` were treated as two independent sources: a press release of the group's own paper, a lecture citing its own group's paper, two papers by the same group. The researcher should check `origin` before using CORROBORATED.
- **Locators:**
  - C030 is on p.324, not pp.322-323.
  - S07 "scan p.1" means PDF page 3 of `US2197079.pdf`.
  - S01 page locators match the PDF.
- **Figures that are in the source but not in the quote** (worth adding if they are narrated): C007 (625 µm), C010 (206 MHz is quoted, but "weak" comes from S04), C012 (QND), C070 (Harvard and Northwestern dates), C071 (3 kV).
- **Hook risk:** Scientific American's "for a month" headline contradicts the paper's "months". Don't borrow it.
- **C044 / C040-C041:** the OCR text (`US2197079A.txt`) has garbles ("ampliedand", "108,915"). The scan image is the authority, and it matches the ledger quotes.

## Re-check (27 Oct 2026, after the researcher's fixes)

The 8 changed claims were re-opened in their sources. All 8 now pass, so the verdict at the top is now **G6: PASS**. The earlier sections above are kept as they were at the first check, which is why they still say FAIL.

| Claim | Outcome | Notes |
|---|---|---|
| C003 | PASS | Now VERIFIED-P, resting on S01 p.2 ("A single positron has been trapped for months."). The S03 quote is kept as non-independent support, and the note says so. |
| C007 | PASS | The new S01 quote "travels through a very small (625 µm) hole in a silver trap electrode" is on PDF p.3, as the locator says. |
| C017 | PASS | Now VERIFIED-P on S15. The new wording "0.13 parts per trillion (1.3 parts in 10^13)" matches S15 "[0.13 ppt]". The S22 quote "Phys. Rev. Lett. 130 , 071801 (2023)" is in the CV's publications list. The voice-over note is right. |
| C030 | PASS | Both quotes are on printed p.324 of S21, as the corrected locators say. |
| C041 | PASS | The new wording is supported. The S07 scan (PDF p.3) reads "Application October 21, 1936 ... In Germany May 28, 1936". The S08 register says the DE application was "filed by Philips Patentverwaltung GmbH", priority 1936-05-29. The register also lists NL49158 with the same priority date, so "late May 1936" is safe. Germany is the filing the US patent claims. |
| C048 | PASS | S33 gives "Gilles Holst ... City: Eindhoven" and "Gerhard J Elias ... City: Delft", which matches the new wording. |
| C057 | PASS | Now VERIFIED-P on S11 (P1). The S04 quote is kept and the note marks it as the same origin. |
| C058 | PASS | Now VERIFIED-P on S10 (P1). The S25 quote is kept and the note marks it as the same group. |

**Other statuses:** the ledger still has 64 claims. Every status I recorded at the first check is unchanged apart from the four relabels. That covers all 30 spine claims, the 12 sampled claims, C045 and the 8 re-checked claims; the remaining CORROBORATED claims (C010, C022, C034, C047, C050, C055, C056) are still CORROBORATED. The first check did not record the original status of C023, C031, C035, C054, C063, C064, C066, C073, C080 or C082, so I can't confirm those ten are unchanged. All ten are non-spine and now read VERIFIED-P.

## Round 2 (27 Oct 2026, late evening: S37-S43 and new claims)

**Result: PASS.** All 3 new spine claims (C064, C090, C099), the 2 re-checked claims (C051, C053) and all 7 new non-spine claims pass. The random sample used `random.seed(20261028)`, then `random.sample(["C091".."C097"], 3)`, which drew **C095, C096, C097**. I also checked the other four (C091-C094), so every new claim was checked.

**Method:**
- **S37:** quotes were checked in the PDF's own text layer (`pdftotext`; the scan was OCR'd by Acrobat Capture, not the researcher), and pp.102 and 104 were checked on the page image.
- **S38:** the scan has no text layer, so the quotes were read on page images: journal p.17 (PDF p.2) and p.21 (PDF p.6).
- **S39:** read on the page image.
- **S40:** checked in the PDF text layer.
- **S43:** has no local copy and is not cited as evidence by any claim, so I did not open it.

| Claim | Source | Quote found? | Supports claim? | Notes |
|---|---|---|---|---|
| C064 (spine) | S38 sect. II; S41 title; S26 p.233 | Yes, all (S38 on the image) | Yes, attributed ("Dehmelt wrote (1990)") | S38 reads "This device (see Fig. 1), which I demonstrated^1,2,4 in 1959 and named a Penning trap ... Most immediately it is derived from a gas discharge tube demonstrated by Penning in 1936." **Locator is wrong:** the passage is on **journal p.21** (PDF p.6), not p.18. The section label "II" is right, so it can be found, but fix it. S41 was published 23 Sep 1974. VERIFIED-P fits, as Dehmelt's own words. |
| C090 (spine) | S37 abstract, p.104 sect. 3; S35 | Yes, all | Yes | Abstract: "confinement of the individual positron, Priscilla, for 3 months". p.104: "Van Dyck et al. [3] were able to announce on 15 September 1984: '... for the last 3 months!'". VERIFIED-P rests on S37 (P1). S35 ("a number of days") does **not** support "3 months" or the name; it only shows that a positron was held for days. The kind of date is right: 15 Sep 1984 is the announcement date. |
| C099 (spine) | S01 p.1 | Yes, exact (PDF text) | Yes | The sentence ends "[3]", and S01's ref. [3] is Van Dyck, Schwinberg, Dehmelt, PRL 59, 26 (1987) = S13 (Seattle). |
| C051 (re-check) | S37 p.102 sect. 1 (+ S05, S28 as before) | Yes, on the image | Yes | S37 was received 28 Aug 1987 and published 1988. That makes it the **earliest telling**, with almost the same words as the 1989 version. The claim's "(1989)" is still true; optionally say "wrote in 1988 and again in 1989". |
| C053 (re-check) | S37 p.102 | Yes, on the image | Yes, for the year 1959 | |
| C091 | S37 p.104 sect. 3 | Yes | Yes | The full quote in the claim matches S37 word for word. The image shows **30 µm / 60 µm** (the OCR's "30pm" is wrong). This is the group's announcement as quoted by Dehmelt, and the claim attributes it that way. |
| C092 | S37 p.104 | Yes | Yes | |
| C093 | S37 sect. 8 (p.108); S10 | Yes, both | Yes | **VERIFIED-P is correct** (same Seattle group). The weak built-in source ("< 1 milliCuri positron emitter built into the vacuum envelope") and ref. [54] (Schwinberg et al. 1981) are in the same paragraph. |
| C094 | S38 sect. I, p.17 | Yes, on the image | Yes | |
| C095 (sample) | S39 p.A10 | Yes, on the image ("which reads SEPARIS") | Yes | The NSF-category gloss is in the next sentence. |
| C096 (sample) | S40 p.327; S37 p.102 | Yes, both | Yes, **CONTRADICTED fits** | S40: "In 1955, he developed the 'Penning trap'". Dehmelt gives 1959 in three of his own accounts (S37, S38, S05). Drift note: S39 says "Dehmelt began his work in 1958". |
| C097 (sample) | S42 | Yes | Yes, **SECONDARY-ONLY fits** | S42 has a bibliography that cites Dehmelt, Science 247:539-545 (1990), and that paper's body is paywalled. Keep the hedge "reportedly". |

**research_check.py "not found" warnings: confirmed as an artifact.** `norm()` runs `re.sub(r"<[^>]+>", " ", s)`. In S37's text, the first "<" is in "R, < lO-*Ocm" in the abstract, and the next ">" is in "<r,Z>" on p.103. The regex swallows the **6,392 characters** between them. That removes the C051 quote, the C053/C096 quote "demonstrated a Penning trap in 1959", and the C090 abstract quote. With the tag-strip removed, all of them match, and all are on the page images. Suggested fix: strip tags only for `.html` sources, or use the pattern `<[A-Za-z/!][^>]*>`.

**Tiers of S37-S43:**
- S37 P1, S38 P1, S39 P3, S40 P3 and S42 S: correct. S42 is an NAS book with a bibliography that cites the primary.
- **S41: should be P3, not P1.** McGuire and Fortson are not the inventors; their 1974 title is a record made at the time by others. No status changes, because C064 rests on S38.
- **S43: should be P1, not P2.** It is Dehmelt's own paper, not an official record. It is not cited as evidence, so nothing changes.

**Fixes to make (none blocks G6):**
1. C064: change the S38 locator to p.21.
2. S41: change the tier to P3.
3. S43: change the tier to P1.
4. C090: note that S35 supports only "days", not "3 months" or the name.
5. C051: optionally add that the earliest telling is S37 (1988).

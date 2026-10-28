G6: PASS (round 2, 27 Oct 2026). All 27 spine claims reproduce after the researcher's fixes. Two minor wording items and one evidence-file note are listed below; none blocks scripting.

# CY01 Odisha cyclone deaths: independent verification (gate G6)

Verifier: Claude (Sonnet 5.5), fresh context, 27 Oct 2026. I did not do the research. I edited no other research file.

## Round 1 (first check, same day): FAIL
- C015 (spine): "Phailin's winds themselves killed 21". The sources say "due to cyclone", not wind.
- C032 (spine): "inland" and "hilly" Gajapati appear in no cited source.
- C029 (non-spine): INR 29,315 crore was used as "damage and loss"; it is the DLNA's recovery-needs figure.
- K15 not logged: IMD's 2024 Dana report gives the 1999 crossing as 120 kt, against 140 kt in IMD's 2000 report.
- Status labels: many "CORROBORATED" claims came from one origin. S21 treated as P5 for second-hand figures. M4 rested on IMD describing itself.

## Round 2: what I re-checked, independently of the researcher's notes
- **Sources unchanged.** I re-downloaded every PDF and image source: all are byte-identical to the saved copies (SHA-256). HTML pages (S14, S18-S20) still carry the quoted text. S01 and S24 scan pages re-read as images in round 1 are unchanged.
- **Arithmetic and scripts re-run with `python3 -I`:** 12 district deaths sum to 9,887; 8,119 / 9,887 = 0.8212; Phailin 21 + 45 + 6 = 72; Titli 47+19+2+1+1+1+1 = 72; Fani 6+3+4+4+4+43 = 64; 1,557,170 / 150,000 = 10.38; 9,887 / 64 = 154.5; knots to km/h 140 = 259, 120 = 222, 115 = 213; C049 distances 103.8, 105.9, 89.1, 220.4, 72.5, 320.7 km (match the ledger).
- **Every quote in claims.jsonl re-found** in the saved text copies (0 not found, 59 claims).

### The five fixes
1. **C015 fixed.** Now "Phailin killed 21 people in Odisha in the State's 'cyclone' column (the floods that followed killed 51 more)". S02 "Human Casualty due to cyclone : 21" and the S09 table (cyclone column 21, floods 45 + 6) re-read. I searched dossier.md, myths.md, conflicts.md, open_questions.md and claims.jsonl: no "winds themselves" or similar remains. PASS.
2. **C032 fixed.** Claim text and dossier no longer say "inland" or "hilly" (the only "inland" left is the 35 km surge, C005, which is in S01). The dossier adds a warning and open_questions item 11 asks for a Census or State source. PASS.
3. **C029 fixed.** I re-opened the Fani DLNA (S15) myself: PDF p.14 "total damage ... INR 16,465 crore ... total loss ... INR 7,712 crore. The estimated recovery needs are INR 29,315 crore"; p.16 Table 0.2 total row (read on the page image): damage 16,465, loss 7,712, damage + loss 24,176, recovery cost total 29,315; p.201 "Damages and losses ... INR 24,176 crore"; p.205 "GSDP ... INR 4.86 lakh crore"; p.180 "about 5% ... of 2018-19"; p.12 the executive-summary sentence that wrongly calls 29,315 "total damage and loss". 16,465 + 7,712 = 24,177 (printed 24,176); 24,176 / 486,000 = 4.97%; 29,315 / 486,000 = 6.03%. All locators match the ledger's page numbers. K16 is logged correctly in conflicts.md. Leftover check: 29,315 appears only in C029 (as recovery needs), K16, open_questions 12 and the dossier, always labelled recovery needs; "5%" is attached only to 24,176. PASS.
4. **K15 and C058, and the weaker-storm caveat.** Both IMD values are really there: S07 (Dana report) PDF p.5 "crossed Odisha coast in the morning (0930-1200 hrs IST) of 29th October, 1999 (120 kt)"; S01 PDF p.60 Table 2.7.1 rows 29.10.99 03 and 06 UTC "912 140 98 SuCS"; S01 PDF p.53 (printed 50) "weakened before landfall as seen in the satellite images". C004, C014, C021, M3 and the dossier angle 2 now rest on pressure and surge. Values re-found: Phailin 940 hPa (S02 PDF p.2) and 2-2.5 m (S02 PDF p.22, sec. 5.3), 3.5 m (S16 sec. 1.2); 1999 5-6 m and 912 hPa (S01); Fani about 1.5 m (S04 sec. 7.3, PDF p.38/65) and 952 hPa at 03 UTC (S04 PDF p.5 best-track row). Phailin 940 vs 912 hPa and 2-3.5 m vs 5-6 m hold. C058 DISPUTED is the right status. PASS.
5. **Relabels.** C002, C003, C015, C018, C021, C023, C025, C031, C034, C036, C038 are now VERIFIED-P; each has a Tier P document that states the value directly (S01, S02, S04, S10, S11, S12, S07, S13), as checked in round 1. M4 now says the verdict rests only on IMD describing itself and says to attribute it. S21's origin note in sources.jsonl now marks it Tier S for deaths, evacuation and shelters. PASS.

### New claim C059 (about 7,000 deaths in Erasma block; SECONDARY-ONLY)
Both quotes are in S21: "Huge lose of life of about 7,000 people in Erasma block very close to the track" and "colossal death toll of more than 7000 in Erasma block". Consistent with S01 (Jagatsinghpur 8,119) and S21 ("8119 ... Jagatsinghpur alone"). S17 spells the block "Ersama". Hedge and status are honest (one IMD scientist's paper; no block figure in S01). Minor: the first quote's locator says "sec. 6"; it sits at the end of section 5, just before "6. Numerical models". PASS.

### Spine table (27 of 27)
All spine claims pass: C001-C005, C011, C013-C016, C018, C021, C023, C025, C026, C028, C030-C038, C048, C049 as in round 1, plus the fixes above. Values for C004 and C014 now appear in the claim text with the 120-140 kt range.

### Non-spine spot-check (more than one in three of those not read in context last time)
C040 (S17 "Date of Publication: October 29, 2012", 135 + 49), C043 (S19: 23.11.2015, 1205 villages in 22 blocks; text names siren and digital mobile radio), C047 (page image), C052 (S23), C053, C057, C017, C039, C056, C059 and the K16 numbers all pass. All S15 quotes were also re-found in a fresh, unedited extraction of the original PDF.

## The edited evidence file, `sources/osdma_fani_dlna_2019.raw.txt`
The researcher edited this saved extraction. I regenerated the original with `pdftotext osdma_fani_dlna_2019.pdf` from the live-identical PDF and diffed it against the edited file. **The only difference is one line (line 27126, a table of women's indicators): `married <18 years (%)a` became `married &lt;18 years (%)a`.** No number or word changed. It is the only "<" in the file, and it does not touch any claim. Why it mattered: research_check.py strips anything between "<" and ">" as HTML, so a stray "<" could swallow real text from the haystack. The unedited extraction is exactly reproducible (`pdftotext` default mode, 880,363 bytes). Recommendation: keep the file as edited but add a one-line note in LOCAL_ONLY.md saying what was changed and why, and save the unedited extraction beside it as `osdma_fani_dlna_2019.raw.orig.txt` (or note the command that regenerates it). I made neither change.

## Minor items (not blocking)
- C021 note and dossier line 14 call the 03 UTC best-track row "an hour or two before landfall". IMD's crossing window is 0230-0430 UTC and the State gives 08:30 IST (03:00 UTC), so 03 UTC is at landfall. The 100 kt and 952 hPa values are right; fix the phrase.
- C026 (only S15 gives 879) and C037 (the second source is media) are still labelled CORROBORATED; VERIFIED-P is the honest label. Spine gate unaffected.
- C059 locator "sec. 6" should read "sec. 5".
- S02 gives Phailin's landfall as 1700 UTC and elsewhere 1600 UTC (21:30 IST); not logged. C013 uses the 22:30 IST statement (S02 introduction).

## research_check.py output (27 Oct 2026, after this file was written)
```
PASS  G1 sourced
PASS  G2 spine
PASS  G5 no banned evidence
PASS  G3 coverage
PASS  G4 floor+saturation  (examined 32, tier-P 24)
PASS  G8 myths audited  (13 myths)
PASS  G6 independent verification  (see verify.md)
PASS  G7 fresh angle  (see dossier.md)
CLEARED FOR SCRIPTING
```
No quote warnings.

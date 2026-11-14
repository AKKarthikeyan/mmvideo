# W3-04-myson: independent verification (G6, Shorts lite mode)

G6: PASS (checker run 8 Nov 2026; 17 spine claims PASS, no FAIL; live re-fetch of S02 CANNOT-REACH, saved copy checked instead; wording fixes below must be applied before scripting)

Method. Every evidence quote of every claim (C001-C037) was machine-matched (accents/case/spacing normalised) against the saved copy; for S01, S03 the live PDF was re-downloaded and is byte-identical to the saved PDF; S10, S11, S12 were re-fetched live and matched; S05/S06 OCR quotes with OCR noise were checked by fuzzy match (ratio 0.95-1.0) and the surrounding text read. method/distances.py and method/coord_check.py were re-run with `python3 -I`; output identical to the saved outputs. Haversine for three points recomputed separately: 1509 / 2337 / 3006 km, same.

## Spine claims
| Claim | Verdict | Evidence |
|---|---|---|
| C001 location | PASS | S01 identification box and S02 saved copy carry the line |
| C002 coordinate | PASS (saved copy) | S02 live = Cloudflare "Just a moment" (CANNOT-REACH); saved S02 text has N15 46 25.835 E108 6 33.008; decimals recomputed 15.77384, 108.10917 |
| C003 inscribed 1999, (ii)(iii) | PASS | S03 live PDF identical to saved; decision text and session dates match |
| C004 Committee wording (ii) | PASS | S03 and S02 saved: "an indigenous society adapting to external cultural influences, notably the Hindu art and architecture..." |
| C006 UNESCO summary | PASS | S02 saved and S01 |
| C007 "exact date is not known" | PASS | S01 History, verbatim |
| C008 192 CE | PASS | S01, S02 saved, S08 p. xxi |
| C009 kings came to My Son | PASS | S04 history, verbatim |
| C011 oldest inscription | PASS | Finot 1904 (S05) fuzzy 1.0; Finot 1915 (S06) heading; Majumdar p. 27. Note: "oldest" is as of 1904-1927 (see wording) |
| C012 dates | PASS | S05 "vers 400 A.D."; S06 "IVe siecle caka"; hedged as in dossier |
| C013 burned under Rudravarman I, rebuilt by Cambhuvarman | PASS | S05 and BEFEO 1904 excerpt "sous le regne de Rudravarman Ier"; S08 "burnt by fire" |
| C014 probably wooden | PASS | S05 p. ~913 "sans doute en bois, puisque Cambhuvarman declare qu'elles ont brule" (read in context) |
| C015 towers dates | PASS | S01 Description, History |
| C016 Buddhism / state religion | PASS | S01, S02 saved |
| C023 Kaundinya legend | PASS | S05 vv. XV-XVIII read in context (Naga king's daughter founds the Soma race; Kaundinya married her); S08 No. 12 |
| C027 ASI 2017-2022, handover 20 Dec 2022 | PASS | S10 live and S12 live (Vietnamese, "Sang ngay 20/12") |
| C028 A10 linga, A13 idol | PASS (single source) | S10 live para matches; one Government of India page, not independent; dossier already says "ASI reports" |
| C030 1,509 km Andaman | PASS | re-run and recomputed |
| C031 2,337 / 3,006 km | PASS | re-run and recomputed; slices are our choice (flagged in claim notes) |
| C036 4th-13th centuries | PASS | S01, S02 saved |

## Non-spine spot checks (all machine-matched; surprising ones read)
C005 PASS (S01 recommendation text verbatim, with its own typo "introduction the Hindu"); C017 PASS (S05 four quotes, 1.0/0.95; "about 20 km" is Finot's; one edition only); C018, C021 (S07), C022 (S06 "20 en skr. et 5 en cam"), C026, C029 (S10 + S11 live), C033, C034, C025 and C037 (S08 pp. 152, 27, 36) all PASS. C010 DISPUTED honest. Myths M1-M13 verdicts agree with the evidence, except M12 (see below).

## Status and wording fixes needed (none changes a spine verdict)
1. C017 is marked CORROBORATED but every quote is S05 (one edition, 1904). Change to VERIFIED-P and say so in the voice only as "Finot's reading". Same for C023 only if the two translators are treated as one stele: they are two translations of one stele, so CORROBORATED is acceptable.
2. C001, C003, C006 are "CORROBORATED" by UNESCO pages that share one origin (S01 history follows the nomination S04). VERIFIED-P (official record) is the honest label.
3. Dossier F1/Hook C says "ICOMOS's own draft". S01 is ICOMOS's recommendation, not a draft. Write "ICOMOS recommended". "The Committee changed ICOMOS's wording" is fine as a comparison; the reason is unknown (dossier already says so).
4. "Named after the king/kings", "the god was named after kings" (dossier verdict, safe-to-say #4, F3, M9, Hook A): only the Bhadravarman origin of Bhadresvara is a Majumdar reading (C037, secondary). C013 supports only the new name Cambhubhadresvara, not that "Cambhu" is Cambhuvarman's own name. Rephrase to "scholars read the name as taken from the king (Majumdar)" and drop "his own name added" unless a source says so. F3 "renamed after the next king" same fix.
5. "The oldest inscription at My Son" (safe-to-say #2): true of Finot (1904) and Majumdar (1927); no modern corpus was checked. Say "the oldest that Finot found" or "among the oldest".
6. M12 "Contradicted" is too strong for one scholar's reading; use "Disputed reading".
7. Safe-to-say #7 is one stele read by Finot alone; keep "Finot reads" attribution. Hook B "built by Cham kings" rests on inscriptions naming Cham kings as founders; do not say they built every tower.

## Cannot confirm
S02 live page (Cloudflare challenge; not bypassed). Natural Earth file not re-downloaded (its vertices reproduce the saved outputs). Kaundinya/Dong-duong pages were checked in the archive.org OCR text only, not the page scan image.

research_check.py --lite (8 Nov 2026): G1-G8 all PASS; only warning is that 12 sources are cited (lite rule says 2-3). Script says CLEARED FOR SCRIPTING; apply wording fixes 3-7 first.

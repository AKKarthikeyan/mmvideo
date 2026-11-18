G6: PASS. All 15 spine claims (C001-C005, C007, C008, C010, C012, C014, C015, C020, C026-C028) re-checked against page images or live pages and every value is confirmed; the saved output of `method/ww1_numbers.py` reproduces exactly. Six fixes and seven wording risks are listed below; none changes a spine figure.

# W3-02-ww1 independent verification (G6), 1 Nov 2026

Verifier: Claude Code, a separate session that did not do the research. I rendered the table pages from the saved PDFs to images (300-500 dpi crops) and read every number myself. I re-fetched the three CWGC pages and the Hansard page live (HTTP 200, no bot check) and checked the archive.org identifiers (all five exist; titles and years match). The CWGC Delhi Memorial page itself still returns 403 (Azure WAF): CANNOT-REACH, logged, not bypassed. It carries no spine claim (C013 is SECONDARY-ONLY and uses the CWGC "How to find" page, which I read).

## Spine claims
| Claim | Result | Evidence (what I saw) |
|---|---|---|
| C001 | PASS | HMSO 1922 p.777 image: British officers 4,744; British other ranks 72,209; serving 159,134; reservists 34,767; non-combatants 45,660; grand totals 76,953 and 239,561. 159,134+34,767 = 193,901; 193,901+45,660 = 239,561. S02 quote found in text |
| C002 | PASS | p.777 image para 2: 877,068; 563,369; 1,440,437 (sum correct). S02 text found. CWGC "nearly 1.4 million by 1918" found live. Status label: fix 5 |
| C003 | PASS | p.777 table bottom line: Indian 1,096,013; all ranks 1,338,620; +42,430; 1,381,050. S02 "1,096,013 Indian or to 1,381,050 all told" found. CWGC live: "More than one million service personnel from Indian forces served overseas". Status label: fix 5 |
| C004 | PASS | Column totals as printed: 16,162; 605,062; 474,789; 1,096,013. 16,162+605,062 = 621,224; 621,224+474,789 = 1,096,013; 474,789/1,096,013 = 43.32 per cent. The claim note about why rows differ is wrong (fix 1) |
| C005 | PASS | Indian totals by theatre read digit by digit: France 138,608; East Africa 47,704; Mesopotamia 675,391; Egypt 143,993; Gallipoli 4,950; Salonica 9,931; Aden 26,205; Persian Gulf 49,198 (Palestine 33). The nine printed totals sum to 1,096,013. 675,391/1,096,013 = 61.62 per cent; 138,608/1,096,013 = 12.65 per cent computed as 12.647, so 12.6 is correct |
| C007 | PASS | Rotated p.177 read at 400 dpi. Mesopotamia 730+380+905+19,186+12,261 = 33,462; France 380+189+17+6,094+2,227 = 8,907; printed grand totals 1,467 / 847 / 1,195 / 38,749 / 18,783 sum to 61,041, equal to the printed summary. 33,462/61,041 = 54.82 per cent; 8,907/61,041 = 14.59 per cent; ratio 3.76. Wounded (67,771) and missing (1,262) columns also sum to their printed totals |
| C008 | PASS (quote typo, fix 2) | Table is on printed p.277 (leaf 284), not "277-278". Punjab 349,688 / 97,288 / 446,976; UP 163,578 / 117,565; Bengal 7,117 / 51,935. Totals 683,149 / 414,493 / 1,097,642. 349,688/683,149 = 51.19 per cent; 163,578/683,149 = 23.94 per cent; 7,117/683,149 = 1.04 per cent. Twelve combatant entries sum to 683,149 and the twelve non-combatant entries to 414,493 |
| C010 | PASS | S09 text: "The first convoy arrived on the morning of the 26th September with the Lahore Division and part of the Indian Cavalry Corps"; Sirhind Brigade "finally reached Marseilles on the 30th November". The claim's quoted sentence does not itself say "first" (fix 3) |
| C012 | PASS (status, fix 5) | Live: Republic Day page "more than 4,700 Indian soldiers and labourers"; Courage page "over 4,700"; Find page "more than 4,700 soldiers and labourers of Undivided India who have no known grave" |
| C014 | PASS | S08 paras 23-25 read in full: "reduced from nine to seven"; equipment "regulated by the requirements of frontier warfare alone"; "in no branch of military expenditure was the pressure so much felt as in connection with the medical establishments"; "suddenly and unexpectedly called upon" |
| C015 | PASS | Quotes found in S02 text |
| C020 | PASS | Hansard live: Montagu quotes "the increasing association of Indians in every branch of the administration ..." and "on the 20th of August last year" |
| C026 | PASS | HMSO p.237 image: Indian (b) row: officers 904; other ranks 61,152; total 62,056; wounds 1,680 + 65,209 = 66,889; prisoners 258 + 10,812 = 11,070. Footnote and "to 31st December 1920" heading as stated. 904+61,152 = 62,056 |
| C027 | PASS | See C007. Header "up to 30th April 1920 for overseas forces, and up to 19th September 1920 for frontier operations" read on the page |
| C028 | PASS (status, fix 5) | Live: Courage page "approximately 74,000 officers and enlisted men of the Indian Army who died in the First World War ... some 8,000 ... remaining 65,000"; Republic Day "74,000 of the First World War" |

## Measurements (`method/`)
`python3 -I ww1_numbers.py` output is byte-identical to `ww1_numbers_output.txt`. I re-keyed the printed values from the images and re-summed them. Definitions are consistent within each comparison (HMSO table 3 for shares of Indians sent overseas; GoI p.177 for shares of dead; the two are never mixed, and the dossier says the GoI table includes British ranks and followers). Corrections to the script's typed inputs, none of which changes a claim figure:
- Palestine row: Indian other ranks is 1, not 4 (4+1+28 = 33, the printed total). With this the other-ranks column sums to exactly 605,062. The claim note "4+4+28 = 36" is wrong.
- The 3-unit gap in non-combatants (rows sum 474,786; printed 474,789) sits inside the printed table, at Aden: 480+19,936+5,786 = 26,202, printed 26,205 (smudged digits in the scan). It is not an OCR or typing error as C004's note says. Grand totals are used as printed.
- Province totals typed in section E are wrong in four rows: the page prints Bengal 59,052, NWFP 45,231, Bihar and Orissa 41,552, Central Provinces 15,007, Assam 15,124. The script's own sum (1,100,762) therefore differs from the printed 1,097,642 and the script does not flag it. The page's printed rows sum to 1,097,642.
- Census p.58: Punjab persons 25,101,060 is confirmed by males 13,732,048 + females 11,369,012 (the leading digit is smudged); "Provinces" 270,950,433 = males 139,243,123 + females 131,707,310. Punjab = 9.26 per cent of the provinces. The script's sum of 15 province rows is 18,000 below the printed total (blurred digits in Baluchistan, NWFP, CP persons); immaterial to "about 9 per cent".

## Statuses, myths, conflicts
- No tier-X source is cited as evidence in `claims.jsonl`.
- Every evidence quote from S02-S11 was re-found in the saved text (OCR variants aside). S01 and S02 table "summaries" are read from images, which I did.
- C016 and C021 are correctly RECOLLECTION; C011 and C013 correctly SECONDARY-ONLY; C006 is DISPUTED and kept apart from C026-C028. The three death counts (61,041 Government of India; 62,056 War Office; about 74,000 CWGC) are attributed to the right bodies in C006, C026, C027, C028, conflicts K1/K2 and the dossier; never merged.
- Non-spine spot-checks (more than one in three): C006, C009, C011, C013, C016, C017, C018, C019, C021, C022, C024, C025 all re-found. C013 Lutyens and inscription found live; CWGC's inscription continues "Also of those whose names are here recorded and who fell in India on the North West frontier and during the Third Afghan War": the claim's quote stops early, so do not show the truncated text as the whole inscription.

## Fixes needed (none changes a spine figure)
1. C004 note and `ww1_numbers.py`: correct the reason for the 3-unit gap (Aden row prints 26,205 but its parts sum to 26,202) and the Palestine entry (4, 1, 28).
2. C008: Bengal total in the quote is 59,052 on the page, not 59,062 (OCR misread); locator is printed p.277 (leaf 284). Fix section E row totals in `ww1_numbers.py` as above.
3. C010: add the sentence "The first convoy arrived on the morning of the 26th September with the Lahore Division and part of the Indian Cavalry Corps" as evidence; the claim says "first".
4. C006 and K2: add the CWGC "more than 73,000 Indian servicemen from World War One" (Find page, last Q&A) as a further CWGC figure beside 74,000, 70,000 and 160,950 for both wars.
5. Status labels: C012 and C028 are CORROBORATED but all evidence is one owner (CWGC, several pages); relabel VERIFIED-P (CWGC owns its commemoration records). C002 and C003 are CORROBORATED on S01+S02 (one origin, as the claim says) plus CWGC, which states no source; keep CORROBORATED only if the script names "the War Office and the Government of India"; else VERIFIED-P.
6. myths.md: M2 verdict "Confirmed" for "1.3 million served" is too strong; its own row says neither figure is "Indian soldiers" (1,302,394 includes British ranks): use "Embellished". M10 "Punjab supplied half the Indian army": 51.2 per cent is of provincial recruits only; with the 115,891 States recruits the book counts, Punjab is 349,688 of 826,855 = 42.3 per cent (Nepal's 58,904 separate). Use "Embellished", or add "of recruits from British India's provinces".

## Wording risks in dossier.md (for the scriptwriter)
a. Section 1, bullet 2: "'Fought' is wrong for most of the million." Not what the sources show: 621,224 (56.7 per cent) were combatants, and Mesopotamia was a fighting front (326,656 Indian combatants went there). The finding is "most went to Mesopotamia, not France" and "43 per cent were non-combatants". Do not say most did not fight.
b. Section 1, bullet 3: "a Government that declared the war for India" states as fact what C015 does not: the book only has the Viceroy telling the Council the Empire "was plunged into war". C015's own note calls who decided in law an open question. Reword or drop.
c. Section 3 item 6, section 4 twist and section 6 item 8: "a family allowance" is presented as a reason. Duli Chand writes "I do not at all like this, but I am helpless ... my family will get an allowance"; the allowance is about what follows if he dies, not why he fought. Say "one soldier wrote that his family would get an allowance" and keep his reluctance. "Duty" is Gulab Ram's word alone: two letters, one each.
d. Section 3 item 4: "Cuts, not courage, shaped Mesopotamia" is the dossier's own line. C014 says the army was unprepared and its medical services starved; not that cuts shaped the campaign. Attribute to the Commission or drop.
e. Section 3 item 3 and section 6 item 7: "about half the fighting recruits" must carry "of those enlisted in British India's provinces" (see fix 6).
f. Loaded words: "loyal", "voluntary", "forgotten" and "cannon fodder" do not appear in the narrator's voice in dossier.md or myths.md. "Voluntary" and "loyalty" are attributed to the Government's book (section 4, section 7, M7, M8, K5); "forgotten" appears only in M12 as a word to avoid; "cannon fodder" is absent. Keep it that way in the script.
g. Section 5 says the CWGC Delhi page was blocked and the inscription is "as quoted by CWGC": confirmed, but see the truncation note above.

## research_check.py
Run after this file was written: all gates PASS (G1, G2, G3, G4, G5, G6, G7, G8), "CLEARED FOR SCRIPTING". 14 WARN lines (quote not found verbatim) are for quotes that are table summaries read from page images or OCR variants of text; I re-found the text ones myself (C016, C021, C017, C019, C025) and the table ones on the page images.

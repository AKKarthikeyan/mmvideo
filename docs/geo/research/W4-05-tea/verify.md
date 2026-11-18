# W4-05-tea: independent check (G6, lite mode, 14 Nov 2026)
G6: PASS

Checker re-opened S01, S02 (saved copy and live archive.org djvu text for S01; archive.org metadata for both ids returns 200) and S03 (live Tea Board PDF re-downloaded: byte-identical to saved copy).

| Claim | Result | Evidence |
|---|---|---|
| C001 | PASS | Preface quotes (Court of Directors deputed; 20 June 1848 Southampton) found in saved and live S01 |
| C002 | PASS | "Upwards of twenty thousand tea-plants, eight first-rate manu- facturers" found; attributed to Fortune |
| C003 | PASS | "nicely dressed by the barber" found |
| C004 | PASS | "sixteen glazed cases", "16th of February, 1851", "arrived at Calcutta on the 15th of March" all found |
| C005 | PASS | Hawulbaugh text (six miles NW of Almorah; 4500 ft) found; OCR spells Gurhwal. S01 has 0 hits for Darjeeling (confirmed) |
| C006 | PASS | "beyond all doubt indigenous in Upper Assam", "Dec. 24, 1834" found in S02 |
| C007 | PASS | "habit of drinking an in- fusion of the leaves" found; second-hand, hedged |
| C008 | PASS | Table "2024-25 (APR-MAR)- FINAL": Assam 666.82, All India 1315.77 (Total column). Rerun python3 -I: 50.7%, identical to saved output |
| C009 (non-spine) | PASS | "identical tea of China" found |
| C010 (non-spine) | PASS | 27 47' 38" N in S01; Manche 27 29' 16" N, long 97 29' in S02 (OCR asterisk for degree sign); 18.4 arcmin = 34 km reproduced |
| C011 (non-spine) | PASS | Darjeeling 5.75; 116x and 0.44% reproduced |

Computation: all five outputs match saved output. Definitions consistent (2024-25 FINAL, M.Kg, Total column, one basis for Assam, Darjeeling, All India). Note Assam row is whole Assam (Valley + Cachar), as stated.

Statuses honest: P1 sources for S01/S02, P2 for S03; self-reports hedged; no tier-X. myths.md verdicts match evidence (M3 Unverifiable is right).

Wording scan: "spy/thief/smuggler" never appears as fact. dossier.md line 24 and line 28 use "spy"/"smuggled" only as the popular belief, labelled as not from sources; open_questions.md forbids them as fact. Risks (not FAILs):
1. Dossier says Fortune's plants "went on to" Kumaon and Garhwal; C005 proves the plantations and his orders to visit them, not that his specific plants were planted there. Safer: "meant for the Company's Himalayan plantations".
2. Belief commonness is unshown (dossier admits it).
3. Beat 9 says "black-tea hills" at same latitude: latitude-only, fine as hedged.

G6: PASS (8 Nov 2026, independent checker; Shorts LITE mode; all 8 spine claims C001-C008 pass; 3 wording fixes below)

| Claim | Check | Result |
|---|---|---|
| C001 | Port page quotes "It is believed ... AD 1341 ... heavy floods in the river Periyar"; "Muziris got silted up ... new opening formed at Cochin" found in saved evolution.txt and in a live re-fetch of cochinport.gov.in/historytimeline (HTTP 200). Cochin Saga reference in saved PDF. | PASS |
| C002 | Menon OCR (line 24078-79) "dated in the Pucluvaippn (literally, new deposit) era, commen- cing A. I). 1341" found. Visscher djvu lines 7317-7320 "Pooda Vaipum ... new style ... This was 383 years ago"; letter text gives current year 1723 (line 7314). 1723-383=1340 (1-yr gap disclosed). | PASS |
| C003 | Menon l.24076 "The date of its appearance or, more probably, of the peopling of the place" (line-wrapped, found); Visscher l.7318-7319 "first established when the island of Vypeen was recovered from the sea and inhabited by men". Hedge preserved. | PASS |
| C004 | Menon l.1141 "formed only in the fourteenth century"; l.24074 "formed by the deposit of silt"; l.1153 "Pudu Vaipu, new deposit". | PASS |
| C005 | Menon l.671 "after the formation of the harbour in 1341"; l.674-676 "No mention of Cochin ... Pliny ... Ptolomy ... Periplus ... Marco Polo". Dossier attributes to the 1911 manual only. | PASS |
| C006 | Re-ran `python3 -I method/era_check.py` from folder root: output identical to saved era_check_output.txt (flood words only 'inundat' once, farm context). Negative finding is correctly limited to the three texts held. | PASS |
| C007 | Milestones PDF "30 March 1928 Sand bar ... cut open"; "26 May 1928 ... s.s. Padma"; evolution.txt l.10 "first ship entered ... 26th May 1928". Live timeline HTML shows the bar-cut line but not the Padma row (dates sit in the saved PDFs). | PASS |
| C008 | "13 April 1920 Arrival of Sir Robert Bristow" (PDF spells "Robbert"); "mere roadstead into a modern harbour is credited to Sir Robert Bristow ... (1920-1941)". | PASS |
| C009 (non-spine) | Row 1341 "Closure of the ancient port of Muziris and widening of Cochin Gut" in saved and live. | PASS |

Statuses: honest. C002/C003 CORROBORATED (two independent origins, Dutch chaplain 1723 and state manual 1911); the rest are single primary/official. Sources are tier P1/P2, no tier-X. Myths M1-M3 verdicts match evidence. Pitch verdict "not true as worded" is fair and does not overstate either way: it says the flood is "the legend" and "later believed" while the C006 note limits the negative finding to the sources held.

Wording fixes (non-blocking, apply before scripting):
1. Dossier "Honest wording" and angle 1: "later explanation / later belief". Evidence only shows that the sources held pre-1912 do not mention a flood; it does not date the flood story. Say "the flood story appears only in the modern port page we read", or "is not in the old records we read".
2. Angle 2 "For 587 years after 1341, big ships anchored outside the bar" and beat 9 "Big ships entered only after the sand bar was cut" go beyond C007/C008. The port says only "mere roadstead" and that Bristow cut a proper shipping channel; its own text also says other powers traded at Kochi for centuries and ships such as Ma Huan's era visited. Use "the dredged channel and modern harbour date from 1920-1928" and "first ship entered through the cut on 26 May 1928".
3. Beat 1-6 are fine. Beat 8 "No old record we read" is correctly hedged. Beat 10 should read "arrived 13 April 1920 and is credited with the channel".

# Audit (gate S5) of 2023-gs1-7

Auditor: independent reviewer, 2026-11-10. Did not write the ledger.

## Method
Reopened every row at its saved file (Jassal 2012 and Chauhan-Mishra 2024 text-searched for the song lines and phrases; IMD report/FAQ, NCERT kegy104, Census C-16, CRIDA plan re-read at the cited passage; Gadgil 2018 checked for the second source). The Sangeet Natak Akademi PDF (row 18) was re-downloaded once from its URL (not kept locally) and the Bhojpuri songs entry found. Ledger rows M013-M117 named in NOTES all exist in GEO-07/claims.csv.

## Counts
PASS 17, FIX 3, FAIL 0 (of 20 rows). FIXes are applied in claims.csv.

## Table
| claim_id | verdict | evidence | fix |
|---|---|---|---|
| 2023-GS1-7-01 | FIX | Jassal text: 'Jhuruke pavan puruvaiya ... Gusts of easterly winds blow', Shanti Tewari, Atra, Jaunpur: matches. But the page says chapter three (page 150), not chapter 4. | locator corrected to ch.3, song 21, p.150 |
| 2023-GS1-7-02 | PASS | Chauhan & Mishra: 'Agan gagan sakhi bahat purvai rama' / 'the Purva wind is blowing'; 'Purva wind (Easterly wind) acts as an enemy here' (pp.6-7). |  |
| 2023-GS1-7-03 | PASS | IMD report sec 2.2.5 'Monsoon trough': 'traced from Ganganagar to Kolkata, passing through Prayagraj', westerlies SW on southern side, easterlies/SE on northern. Gadgil 2018 confirms easterly component north of trough (850 hPa). Inference labelled as own. |  |
| 2023-GS1-7-04 | PASS | IMD FAQ text: 'In July and August winds on the surface are westerly/south-westerly to the south of monsoon trough and south easterly/easterly to its north and are generally stronger over the seas'. Sits in the cyclone-genesis answer, as the row says. |  |
| 2023-GS1-7-05 | PASS | NCERT Class XI Ch4 text: Arakan Hills deflect the Bay branch, monsoon enters West Bengal and Bangladesh from south and south-east; one branch moves westward along the Ganga plains to the Punjab plains. |  |
| 2023-GS1-7-06 | PASS | Jassal introduction: 'Purabiya and Bhojpuri-speaking countryside of northern India, namely, eastern Uttar Pradesh and western Bihar'. |  |
| 2023-GS1-7-07 | PASS | Census C-16 text: Bhojpuri 5,05,79,447. |  |
| 2023-GS1-7-08 | PASS | CRIDA sec 1.2: SW monsoon 906 mm, 51 rainy days, onset 2nd week June, cessation 2nd week Oct; NE 58 mm, winter 28 mm. |  |
| 2023-GS1-7-09 | PASS | CRIDA: rice 82.3 th ha, 155.3 th t, 1885 kg/ha; kharif-irrigated sowing 3rd wk June-4th wk July; canals 60.6% (72.952 kharif + 29.7 rabi of gross irrigated 169.1 = 60.7%). |  |
| 2023-GS1-7-10 | PASS | NCERT Ch4 traditional seasons table: Varsha Sravana-Bhadra July-August; Sharada Asvina-Kartika September-October. |  |
| 2023-GS1-7-11 | PASS | Jassal ch.2 p.103: 'the rainy season is when agricultural activity is at its slowest, making it the ideal time for wives to spend a couple of months with their natal families'; 'coaxing and cajoling'; fieldwork at monsoon onset. |  |
| 2023-GS1-7-12 | PASS | Jassal ch.2 song 8 (p.91): 'Rimi jhimi barase la paniya, ava cali dhan ropai dhaniya' / 'It's raining, let's go transplant paddy'. |  |
| 2023-GS1-7-13 | PASS | Jassal ch.3 conclusion: 'kajli genre ... women's monsoon frolic ... laugh, joke, and engage in humorous banter'; song 11 line 'Kajariya khelei javai re naiharava' (p.103). |  |
| 2023-GS1-7-14 | FIX | Chauhan & Mishra: Kajari 'mainly performed' by women (Jassal def.), Sawan July-August, dark clouds, kohl, prevalent in eastern UP and parts of Bihar. But the dark-clouds line is introduced as 'It is believed that', and the claim stated it as fact. | claim text hedged ('it is believed'); note records that Sawan/clouds origin is the authors' hedged belief |
| 2023-GS1-7-15 | PASS | Chauhan & Mishra p.4: 'Migration gave birth to distinct folk culture in the Bhojpuri region (Singh, 2016)'; Biraha (Ahir), Bidesiya, Kajari; 1833 sentence follows, as noted. |  |
| 2023-GS1-7-16 | FIX | Authors list Mirzapur, Bengal, Rangoon, Braj, Mathura and 'Pardes or bides' (p.4). The Sawan-aggravates-loneliness reading is on a later page (p.12), outside the cited pp.4-5. | locator extended to p.4 and p.12 |
| 2023-GS1-7-17 | PASS | Authors p.7: 'the same rain, and clouds function as a life-giver to millions of peasants but ... as an enemy for left-behind women'; cuckoo, peacock and breeze painful. |  |
| 2023-GS1-7-18 | PASS | Re-downloaded the PDF (HTTP 200): 'Special Documentation of Bhojpuri Songs by Smt. Pushpa Prasad', Meghdoot Theatre-III, 20 August 2016. No monsoon mention nearby, as the row says. |  |
| 2023-GS1-7-19 | PASS | Honest UNVERIFIED row; no source claimed. Jassal text has only the song line. |  |
| 2023-GS1-7-20 | PASS | Honest UNVERIFIED row; no source claimed. |  |

## NOTES.md mapping
NOTES.md maps both halves. Part A (why Purvaiya): word = -01, -02; physics = M016/M017, M042, -03, -04, -05; the Bhojpur-specific step is our inference and flagged. Part B (cultural ethos): -06 to -18. Unsupported parts, correctly flagged by NOTES: the '-aiya' etymology and the proverb (-19), festivals tied to the easterly (-20). Also: no source says Bhojpur itself has easterly winds (IMD and NCERT never name it). Local numbers (-08, -09) are 2013 CRIDA normals.

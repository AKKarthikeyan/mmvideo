# UPSC pilots: independent audit of the five claim ledgers (2 Nov 2026)

**Method.** Every row audited was reopened in its local file at the cited place (text, or the page OCR / PDF re-extracted with pdftotext); for POL-06 each court row was traced to the judge's own opinion (opinion boundaries found in the file) and for the other four pilots the dossier headline rows plus the 20 CONFIRMED rows from `random.Random(2026).sample` (file order) were checked for value, attribution, meaning/strength, second-source independence and status. No ledger was changed. Locations: "lines" = line numbers in the `.txt`; "offset" = character offset in the `.txt`; paras as printed in the judgment.

---

## POL-06 (Constitutional amendments and the basic structure)

Opinion boundaries found: Minerva Mills `ik_minerva.txt` Chandrachud CJ (majority) lines 2005-3405, Bhagwati J. lines 3406-7461. Indira Gandhi `ik_indira.txt` Ray CJ paras 1-158, Khanna 159-254, Mathew 255-386, Beg 387-636, Chandrachud 637-696. NJAC `ik_njac.txt` Khehar offset 0-816k, Chelameswar 816k-979k, Lokur 979k-1533k, Kurian 1533k-1572k, Goel 1572k-end.

| claim_id | problem | evidence | exact fix proposed |
|---|---|---|---|
| POL06-F01 | Attribution wrong. Para 696 ("clauses (4) and (5) ... unconstitutional and therefore void") is the last paragraph of Chandrachud J.'s concurring opinion, not Beg J.'s. Beg J. does not say void. "Held void" is not a unanimous wording. | `ik_indira.txt`: Chandrachud's opinion starts at para 637 (offset 585472), para 696 is its end. Beg J. ends at para 636: "Article 329A (4) does not stand in the way of the consideration of the appeals". Khanna para 213 strikes only clause (4). Mathew para 343: "clause (4) is bad", no opinion on clauses 1-3. Ray CJ paras 62-65: cl.(4) is a declaratory judgment, cl.(5) cannot operate. | Page cell: "Chandrachud J. para 696 (clauses (4) and (5) void); Khanna 213 and Mathew 343 (clause (4) void); Ray CJ 62-65; Beg 636 (cl.(4) does not bar the appeals); appeal allowed Ray 158, Khanna 254, Mathew 386, Beg 636". Claim: "held unconstitutional" becomes "clause (4) was struck down or held unable to stand by the five judges on different grounds; Chandrachud J. also names clause (5)". Never write "the Court unanimously struck down both clauses". |
| POL06-E01 | Second-source note credits the wrong judge. Sikri's list is not in Chandrachud CJ's recap. | Chandrachud CJ's recap of Sikri is lines 2065-2082 and gives no feature list. The list (supremacy, republican/democratic form, secular, separation of powers, federalism, dignity of the individual) is in Bhagwati J.'s opinion, lines 4163-4168. Goel J. in NJAC (para 15.1, offset 1607432) also lists them. | Note: replace "Minerva Mills (Chandrachud CJ) summarises" with "Bhagwati J. (separate opinion), lines 4163-4168; Goel J., NJAC para 15.1". Second_source cell: "Bhagwati J. in Minerva Mills (not the majority opinion)". |
| POL06-E02 | Second source (Minerva, no judge named) is Bhagwati J. only, and does not match item for item: he says Shelat and Grover "added" justice (social, economic, political) and unity and integrity; the SCR headnote list has no "justice" item. | Bhagwati lines 4168-4170. Headnote list `kbj_engJud.txt` offset 62362 (items 1-6, p.280). | Second_source cell: "Bhagwati J., Minerva Mills lines 4168-4170 (his paraphrase; adds 'justice' that the headnote list does not carry)". Keep CONFIRMED for the headnote list only. |
| POL06-E03 | Second source is one concurring judge, not "the NJAC case" as a whole. | Passage ("only illustrative and not exhaustive", offset 1359097) lies in Lokur J.'s opinion (starts offset 984866) and quotes Hegde and Mukherjea. | Second_source cell: "Lokur J. (concurring with the 4:1 majority), NJAC, quoting Kesavananda". |
| POL06-E04 | Second source (Minerva) is Bhagwati J.'s separate opinion, unnamed. | Lines 4172-4177. | Second_source cell: "Bhagwati J., Minerva Mills lines 4172-4177". |
| POL06-E05 | Attribution and strength. "Minerva Mills reads him as ..." is Bhagwati J., not the majority. The statement that Khanna held democracy, secularism and judicial review basic is hedged in the source ("appeared to be of the view"); the claim makes it firm. | Lines 4177-4182. | Claim: "Bhagwati J. in Minerva Mills says Khanna J. treated the right to property as a matter of detail and 'appeared to be of the view' that democratic form, secular character and judicial review are part of the structure". |
| POL06-E06 | Second source contradicts the core of the claim. The claim says the six lists were "not a majority opinion" and obiter. Goel J. (NJAC para 15.1) calls them illustrations "by the majority of seven Judges". The Court itself is not agreed. | `ik_njac.txt` offset 1607432 (Goel J., para 15.1) versus `ik_minerva.txt` lines 4192-4202 (Bhagwati J.). | Status CONFLICT (or CONFIRMED only as "Bhagwati J. said"). Add Goel J.'s counting as the opposite view. Second_source cell must say it disagrees. |
| POL06-E07 | Own inference stated as a value. "statement is false" is not in NCERT (the note admits it) and leans on E06, which is contested. | `_ncert/keps209.txt` offset 43106 (item printed with no answer). | Value: "NCERT item is for the student to judge; our reading: no single official list (see E06 conflict)". Mark the answer "ours". |
| POL06-H06 | Attribution. "Minerva Mills attributes the 'matter of detail' reasoning to Khanna J. alone" is Bhagwati J., not the majority. | `ik_minerva.txt` lines 4177-4180. | Replace "Minerva Mills attributes" with "Bhagwati J. (separate opinion) in Minerva Mills attributes". |
| POL06-D04 | Weak second source and counting basis. The second source is the Court's own explainer that D12 says to distrust; the 7:6 count comes from the SCR reporter's headnote, not from any judgment or the signed summary (9 signatures, D09). | `kbj_home_intro.html` ("7:6"); headnote `kbj_engJud.txt` offset 12000-13400. | Note: "count is the SCR reporter's headnote, same publisher as the explainer, not independent". Drop the explainer as "second source". |

**Counts POL-06:** audited 37 (C01-C04, B01, D01-D12, E01-E07, F01-F09, H01, H03, H06, H07); passed 27; failed 10. Passed rows included the C/D/F votes, benches, dates and the three-way Shankari/Sajjan/Golaknath attribution. The Minerva passage D10 (Chandrachud lines 2159-2167, Bhagwati 3977-3999) is correctly attributed.

---

## HIS-30 (Plassey, Buxar, diwani)

| claim_id | problem | evidence | exact fix proposed |
|---|---|---|---|
| H30-C076 | Hedge dropped and single source labelled CONFIRMED. The third head in the 1773 resolution is "16 lacs or more", so Rs 20.8 lakh is a floor. Dossier repeats "counted Rs 20.8 lakh". Only Malcolm (biographer) is cited; S4 asks two sources for a headline figure. | `malcolm_clive_v3_gut54848.txt` offsets 468308 and 447280 ("a further sum of 16 lacs or more ... amounting together to 20 lacs and 80,000"). | Claim: "at least Rs 20 lakh 80,000 (2 + 2.8 + '16 lacs or more')". Status: "CONFIRMED (single secondary source: Malcolm printing the resolutions; Journal of the House not read)" or add Commons Journal. Dossier section 2: "counted at least Rs 20.8 lakh". |
| H30-C050 | Meaning changed. Clive does not say he fired on them "taking them for enemy"; he says they proved to be friends but gave no signal, so he fired "to make them keep their distance", and they sent a congratulatory message after the battle. | `hill_bengalin175657se02hilluoft.txt` doc 501 (offset ~1091300): "never discovered themselves by any signal ... keep their distance. When the battle was over they sent a congratulatory message". Hill Intro (`se01`) says Mir Jafar and Rai Durlabh "remained neutral". | Claim: "Mir Jafar and Rai Durlabh stood on the English right and did not fight (Hill; Seir). Clive reports he fired on the unsignalling troops to keep them at a distance, and they sent a message after the battle". |
| H30-C049 | Second source is not independent. Hill repeats Clive's figure; ledger note says so but status and the dossier treat it as two sources. | Doc 501 p.458 ("computed ... about 500") and Hill Intro p.cci. | Second_source cell: "none independent (Hill repeats Clive)". Dossier: "Clive's estimate, about 500". |
| H30-C035 | Source mismatch. The negative "no NCERT book read teaches the Black Hole" is our own search, but the source cell cites Dodwell p.156. | `grep -il "black hole" research/upsc/_ncert/*.txt` returns no file (66 files). | Source: "own text search of `_ncert/*.txt`, 2 Nov 2026"; keep Dodwell/Hill for "accounts differ". |

**Counts HIS-30:** audited 35 (H30-C001, C007, C010, C011, C012, C018, C023, C024, C025, C035, C039, C040, C041, C043, C046, C047, C048, C049, C050, C052, C054, C055, C056, C057, C059, C060, C065, C069, C070, C071, C072, C075, C076, C077, C079); passed 31; failed 4. Checked and right: treaty articles 4-7 (Aitchison No. III), 150 lakh and half-down (Hill doc 501 p.460), 22+50 and 15,000+35,000 (doc 501), Clive's 16 lakh evidence (Commons vol. III), the 12 Aug 1765 farman with its 26-lakh clause (Aitchison No. X, first version), 53,86,131, Munro's 857/5,297/918. Not fully re-read: C055 (Seir, only the turban and "cold answer" passage), C001 (UPSC notice, matched by text search).

---

## GEO-07 (Monsoon)

| claim_id | problem | evidence | exact fix proposed |
|---|---|---|---|
| M060 | Percentages do not agree with the mm figures printed beside them (own arithmetic not marked). IMD prints "35% (342.0 mm)" of 943.7 mm and "48% (447.4 mm)". | 342.0 / 943.7 = 36.2%; 447.4 / 943.7 = 47.4%. Source `imd_chennai_ne_monsoon_2020.txt` offset 5271. | Claim: "IMD prints about 35% and 48%; its mm figures (342.0 and 447.4 of 943.7) work out to 36% and 47%". On screen use mm or "about a third / almost half". |
| M084 | Source is the pre-typeset "Final Government Distribution" draft, watermarked "Do Not Cite, Quote or Distribute". The Executive Summary also says observed monsoon changes were "limited over much of the 20th century" because GHG increases and aerosol decreases offset (high confidence); the claim gives only the weakening half. | `ipcc_ch08.txt` Exec. Summary (offset ~54646) and sec. 8.3.2.4.1 summary. | Cite the published AR6 WG1 Ch.8 (CUP 2021) before screen use; add the offsetting sentence. Statements and confidence levels quoted are otherwise correct. |

**Counts GEO-07:** audited 32 (M001, M006, M007, M008, M015, M017, M020, M028, M029, M033, M035, M044, M045, M046, M047, M048, M049, M054, M055, M060, M061, M066, M067, M068, M071, M078, M080, M081, M082, M083, M084, M091); passed 30; failed 2. Checked and right: 74.9% and the monthly shares, 868.6 / 1160.1, LPA monthly table, the 8 July, 17 Sept and 15 July dates (IMD RR 3/2020), 96-104% band, the 2026 and 2025 season figures, Gadgil r = -0.38 and "abandoned", Rajeevan et al. spell statistics, Kerala onset criteria.

---

## ECO-15 (Repo rate and prices)

| claim_id | problem | evidence | exact fix proposed |
|---|---|---|---|
| ECO15-I10 | "Second source" is not one: the UCB directions cover primary co-operative banks, a different bank class. SLR 18.00% for commercial banks is therefore single-source (RBI Current Rates panel); status CONFIRMED overstates. | `rbi_home.txt` offset 2613; ledger note says commercial-bank directions are CAPTCHA-blocked (U02). | Status: "CONFIRMED, single source" (or UNVERIFIED until U02 is read in a browser). Second_source cell: "none". Keep SLR off screen until read. |
| ECO15-I21 | Our inference written into the claim: "therefore follows a long pause and cuts". The note admits this is not an RBI sentence. Second source is the same document as the first (MPR Table II.7). | `mpr_oct2026.txt` Table II.7 (+250 May 2022-Jan 2025 "tightening cycle", -125 Feb 2025-Sep 2026). | Delete the last sentence of the claim or label it "our reading of RBI tables". Second_source: "RBI Bulletin Oct 2024 (the 2022-23 hikes)". |
| ECO15-T04 | Second source does not support the figure. Gupta para 47 says only that policy "works with a lag". The 6-to-18-month range is the MPR's citation of two working papers that were not opened. | `mpc_min_oct2026.txt` Gupta statement paras 45-50; `mpr_oct2026.txt` offset 65525. | Second_source: "none; underlying papers (Khundrakpam and Jain 2012; Raj et al. 2020) not opened". Claim: "RBI's report cites a 6-to-18-month lag". |
| Dossier section 3 (not a row) | Attribution blurred. "Saugata Bhattacharya and Indranil Bhattacharyya argued for tightening and pre-emption ('cautiousness bias')": the phrase is Bhattacharyya's only (minutes para 44). Bhattacharya's statement (paras 27-35) ends with a vote for the hike and calibrated tightening but does not use the phrase. | `mpc_min_oct2026.txt` offsets 21984-24647 (Bhattacharyya) and 14818-18386 (Bhattacharya). | Rewrite: "Shri Indranil Bhattacharyya: set aside the 'cautiousness bias' and act pre-emptively (para 44); Shri Saugata Bhattacharya also voted for the hike and the stance change". |

**Counts ECO-15:** audited 41 (I01-I05, I08-I10, I17-I19, I21, F04, F07, F08, F12, F13, F15, P01, P05-P09, P14, P15, T01, T03-T07, T09, T10, X02, X03, N01, N02, N14, N16, S05); passed 38; failed 3 (the dossier fix is extra and not counted). Checked and right: all rates in resolution para 2 and Bank Rate circular, 5.54/6.08/4.88 and index 109.49/103.74 = 5.54%, 358 items, 36.75%, link factors, Gazette S.O. 1580(E), 66-of-72, Table II.7 figures, 68.2%, the stance wording, who wrote which paragraph of the minutes.

---

## AGR-07 (MSP)

| claim_id | problem | evidence | exact fix proposed |
|---|---|---|---|
| AGR N01 | Value error. NCERT lists three policy instruments (MSP, buffer stocks, PDS) as "the fourth element" of agricultural marketing; the claim says "one of four policy instruments". | `_ncert/keec105.txt` offset 20596 ("The fourth element is the policy instruments like (i) ... (ii) ... (iii) ..."). | Claim: "MSP is one of three policy instruments, listed as the fourth element of agricultural marketing". |
| AGR F09 | Two numbers that do not reconcile. Claim says "207% of A2+FL (a 106% margin)". 2610 / 1264 = 206.5% (margin 106.5%). PIB prints margin 106; CACP Table S.1 prints 207% (M03 second source). 207 and 106 cannot both come from the same rounded cost. | `pib_2316941.html` ("Wheat 2610 1264 106"); M03 second_source cell. | Claim: "PIB prints a 106% margin; CACP Table S.1 prints 207% of A2+FL; our division of the rounded figures gives 206.5%". Dossier: "about 206-207%". Same wording in M03. |
| AGR P05 | Temporal overreach. In the source the tur/urad/masur exemption from the 25% ceiling is "for 2024-25 season". The claim reads as permanent. | `pib_2055990.html` ("ceiling will not be applicable in case of Tur, Urad & Masur for 2024-25 season"). | Add: "for 2024-25; later extended to four years from 2025-26 under the Pulses Mission (P06)". |

**Counts AGR-07:** audited 33 (C01, C02, C05, C07, C08, C09, C11, C12, D01, D05, D08, F03, F08, F09, F10, F11, L03, L07, L09, L13, L14, M01, M02, M03, N01, N07, N08, P02, P05, P06, P15, P16, P17); passed 30; failed 3. Checked and right: 6% passage and C01 figures, NSS 70 and 59 numbers, 88.4% / 31.1%, 17.8 / 49.2 / 33.2 lakh, 66.2 / 62.3 / 31.7, 33.8 mt and 28%, 25% ceiling, 22 crops, FRP 100.5%, 38.8% and the 3,707 / 1,030 range, 2,441 / 1,627 / 150% / 113%, Swaminathan sentence, the N08 grep (no hits for CACP, A2+FL, AASHA etc.). Not re-read: M02, P02, P16 image tables (taken from OCR only).

---

## Totals

| Pilot | Audited | Passed | Failed |
|---|---:|---:|---:|
| POL-06 | 37 | 27 | 10 |
| HIS-30 | 35 | 31 | 4 |
| GEO-07 | 32 | 30 | 2 |
| ECO-15 | 41 | 38 | 3 |
| AGR-07 | 33 | 30 | 3 |
| **All** | **178** | **156** | **22** |

Most serious: POL06-F01 (Indira Gandhi: wrong judge, "void" not unanimous), POL06-E01/E02/E04/E05/H06 (Minerva Mills: Bhagwati J. credited as "Minerva Mills"), POL06-E06 (second source from Goel J. contradicts the claim), HIS C076 (hedge "or more" dropped).

# GEO-07 Part 2 (script_p2.py) - independent fact audit (gate S5)

Auditor: independent pass, 3 Nov 2026. Script not edited. Sources opened at the cited place (txt extracts in `sources/`, NCERT in `research/upsc/_ncert/`).
Short names: RR = IMD CRS Research Report 3/2020 (`sources/pr804.txt`); PR22 = IMD press release 14 Apr 2022 (`imd_20220414_pr_1572.txt`); FAQ = `imd_monsoonfaq.txt`; ENSO-FAQ = `imd_faq_enso_iod.txt`; CHN = `imd_chennai_ne_monsoon_2020.txt`; MM = `imd_metmono_ch3_1.txt`; NCERT-PE = `_ncert/kegy104.txt`; NCERT-FPG = `ncert_extra/kegy210.txt`, `_ncert/kegy209.txt`; Raj = `rajeevan2010_jess.pdf`.

Arithmetic checked: 300/33 = 9.1 but both inputs are loose ("more than 300", "about 33"), so "more than nine times" is not strictly provable (see b08). 32.3 + 29.4 = 61.7, above three-fifths: PASS. 342.0/943.7 = 36.2% and 447.4/943.7 = 47.4%: "about a third" and "almost half" PASS. 15 July to 8 July = 7 days: PASS. 880.6 mm = 88.1 cm, 868.6 mm = 86.9 cm: PASS. No "fifty-seven years" used.

| Beat | Sentence / item (short) | Verdict | Evidence | Suggested rewording (FIX/FAIL) |
|---|---|---|---|---|
| b00 | Konkan and Goa "more than 300 cm" (annual) | PASS | PR22 Highlights p.1: "Konkan and Goa ... more than 300 cm annually" (M056) | |
| b00 | West Rajasthan "about 33" (annual) | PASS | PR22: "about 33 cm including about 28 cm during SW monsoon" | |
| b00 | TN "almost half ... Oct to Dec" | PASS | CHN p.5: 48% (447.4 of 943.7 mm); 47.4% by our sum; "almost half" is the allowed wording (M060 note) | |
| b00 | "By then, the monsoon has left most of India" | PASS | RR p.31 (xi): most of country withdrawn by 15 Oct; NE monsoon established over south peninsula (M034) | |
| b00 | Captions (300+ cm, ~33 cm, almost 1/2 Oct-Dec, IMD) | PASS | as above | |
| b01 | "weather office sums up season in one word. Normal, or not" | PASS | Framing; IMD does label seasons (2025 report p.1 "normal"; LRF 5 categories) | |
| b01 | LPA is the yardstick; Jun-Sep all-India about 87 cm | PASS | PR22: 868.6 mm, 1971-2020 (M044) | |
| b01 | "Nearly half of India's farming is rain-fed" + caption | PASS | ENSO-FAQ Q3: "nearly half of India's agriculture remains rain-fed" (M086). "watered by rain alone" is the plain meaning of rain-fed | |
| b02 | Andaman and Nicobar about 22 May; Kerala about 1 June | PASS | RR p.31 (iii), p.2, line 565: Andaman "around 22nd May", Kerala "around 1st June" (M031, M027) | |
| b02 | "It enters in two streams. One comes over the Andaman Sea and the Bay of Bengal in May. The other reaches Kerala, on the Arabian Sea side" | FIX | RR pp.4,7-8 say the monsoon "enters ... through Andaman and Nicobar Islands around 20th May ... Subsequently it advances into the mainland through Kerala": a sequence, not "two streams". The ledger note on M041 admits it "does not itself describe" the NCERT two-branch scheme. "Two streams" is our wording, not IMD's | "It arrives at two doors. First the Andaman Sea and the Bay of Bengal, in May. Then Kerala, on the Arabian Sea side, around the first of June." |
| b02 | Caption "Andaman ~22 May, Kerala ~1 June, IMD normals" | PASS | RR p.31 | |
| b03 | "starts watching after 10 May; fourteen stations; six in ten; two days in a row; at least 2.5 mm" | PASS | IMD onset page (`imd_pages/monsooninformation_onset.html`): "If after 10th May, 60% of the available 14 stations ... 2.5 mm or more for two consecutive days" (M035). "In and near Kerala": list includes Minicoy, Amini, Mangalore, Kudulu: fair | |
| b03 | "westerly winds must also run deep" | PASS | Onset page b): westerlies to 600 hPa | |
| b03 | "satellites must see thick, tall cloud" | FIX | Source criterion is INSAT-derived OLR below 200 W/m2 in a box. No saved source says "thick, tall cloud"; that is our reading of low OLR, unlabelled | "and a satellite reading of heat escaping to space must be low." (Caption "thick cloud" -> "low OLR (satellite)") |
| b03 | "For the rest of India, there is no formula. IMD uses judgement." | FIX | RR p.5: "In 2016, IMD adopted objective criteria ... for declaring monsoon onset over Andaman and Nicobar Islands"; subjective "for other regions" (M037). Script has just said Andaman is part of the story | "Apart from the Andaman Islands, the rest of India has no such formula. IMD uses judgement." |
| b04 | Mumbai about 11 June, Delhi about 27 June | PASS | RR Table 2 lines 1003, 1016: Mumbai 10-Jun/11-Jun, Delhi 29-Jun/27-Jun (M032) | |
| b04 | "two arms": Arabian Sea branch up west coast; Bay branch into Bengal and north-east | PASS | NCERT-PE pp.35,37 (M042). It is NCERT's scheme: wording in voice is unattributed but caption/visual neutral. Advisory: say "the textbook's two arms" | |
| b04 | "moves in surges"; NLM definition; "IMD draws its front edge each day" | PASS | Onset page: "advances northwards, usually in surges"; "NLM is the northern most limit ... on any given day" (M038). "draws ... each day" is a mild extension of "on any given day" | |
| b04 | "on average, by the eighth of July covers the whole country" | PASS | RR p.31 (v) "entire country by 8th July, exactly one week before ... 15th July" (M029) | |
| b05 | Class 11 textbook says mid-July for whole country | PASS | NCERT-PE p.31: "By mid-July, southwest monsoon engulfs the entire subcontinent" (M028) | |
| b05 | "old normal, worked out from 1901 to 1940" | PASS | RR lines 161, 249, 1079: existing normal from 1901-40 data, 149 stations; 15 July (M030) | |
| b05 | "In 2020, IMD worked out new normal dates from more recent decades" | PASS | RR: onset 1961-2019, withdrawal 1971-2019. Wording is "worked out" (not "adopted"), which matches the M030 caution | |
| b05 | "a week earlier, from 15 July to 8" | PASS | RR p.31 (v) | |
| b05 | "In 2025 it covered the whole country on 27 June" | PASS | 2025 report lines 178, 1217: 27 June, normal 8 July (M040) | |
| b05 | "farmers sow kharif crops when the monsoon arrives" | PASS | NCERT Class X p.31: "Kharif crops are grown with the onset of monsoon" (M087). Advisory: add "NCERT says" | |
| b06 | Arabian Sea branch runs into the Western Ghats; moist air pushed up, cools, rains | PASS | NCERT-PE p.35 (i): branch "obstructed by the Western Ghats ... climb the slopes ... become cool" | |
| b06 | "NCERT puts the windward side at 250 to 400 cm" | PASS | NCERT-PE p.35: "Sahyadris and Western Coastal Plain receive very heavy rainfall ranging between 250 cm and 400 cm" (M058). No period is stated by NCERT: voice and caption correctly give none. Do not compare it with annual figures | |
| b06 | Orographic rain defined; air sinks and warms; little rain east; "rain shadow" | PASS | NCERT-PE p.35; NCERT-FPG p.89. Advisory: b06 lists only M058, add M059 to b06's claims | |
| b07 | Three kinds of rain (convectional, orographic, cyclonic) | PASS | NCERT-FPG p.89 (M059) | |
| b07 | "Cherrapunji ... more than ten metres of rain in a year" | PASS | NCERT-PE p.29: Cherrapunji and Mawsynram "over 1,080 cm in a year" (M057); IMD tables 1,117.6 cm (1991-2020) agree. No "world record" claim made: good | |
| b07 | "Stack that water up, and it would stand taller than a three-storey house" | FIX | Our own comparison with no ledger row; "three-storey house" height is an assumption, and 10.8 m versus roughly 9-10 m is too close for "taller than". Rule 6: mark our own arithmetic. Also the voice does not say NCERT gave the figure | "Cherrapunji, in the Meghalaya hills, gets over ten metres of rain in a year, says NCERT. Stack that water up, and it would stand about as tall as a three-storey house." (Add a ledger row: own comparison, 3 m a storey assumed) |
| b08 | "West Rajasthan ... about 33 cm in a whole year" | PASS | PR22 (M056) | |
| b08 | "Konkan and Goa get more than nine times as much" (caption "300+ cm (9x+)") | FIX | Inputs are "more than 300" and "about 33": if West Rajasthan is 33.4, 300/33.4 = 8.98, so "more than nine times" cannot be proved from the two loose figures. Our arithmetic, unmarked | "Konkan and Goa get about nine times as much, or more." Caption: "300+ cm (~9x)" |
| b08 | "by the far end of both branches, little rain is left" | FIX | No claim id. NCERT-PE p.37 says only the Arabian Sea branch that passes "west Rajasthan and along the Aravalis" gives "only a scanty rainfall"; the far end of the Bay branch is Punjab/Haryana, where the branches join. Not supported as stated | "But by the time the Arabian Sea branch reaches West Rajasthan, little rain is left." (add M042 to b08 claims) |
| b08 | "Our Class 11 textbook says the Tamil Nadu coast remains dry in this season" | PASS | NCERT-PE p.37: "why the Tamil Nadu coast remains dry during this season" (M061, with the correction coming in b13) | |
| b09 | Wet spells = active spells; dry gaps = breaks | PASS | FAQ Q47; Gadgil 2003 p.~438 (M066, M069) | |
| b09 | "In a break, the trough moves north to the Himalayan foothills. Rain stops over much of India, and the foothills get heavy rain." | FIX | Supported by FAQ Q5 ("northward migration of this trough leads to break monsoon condition over major part of India and heavy rains along foothills") and Gadgil 2003 pp.~495-505 (trough near foothills). But FAQ Q5 is in no ledger row, and the beat cites M020 (Mascarene High), which supports none of it. "Rain stops" overstates "dry monsoon conditions / interrupted rainfall" | Cite M069 plus a new row for FAQ Q5; drop M020. "Rain falls off over much of India, and the foothills get heavy rain." |
| b10 | NCERT: break is a week or more without rain | PASS | NCERT-PE p.31: "rain fails to occur for one or more weeks" (M066) | |
| b10 | "IMD's test ... looks for the trough and the winds, not a count of dry days" | PASS | FAQ Q47: trough "not seen on the surface chart and the easterlies practically absent ... for more than 2 days" (M066 note). It does count days of the circulation state, not dry days: wording survives | |
| b10 | "A study of 1951 to 2007 measured these spells ... In about one year in four, there was no break at all" | FIX | Raj abstract: its own third definition (core-zone rainfall anomaly below -1 for 3+ days), peak months July and August only; "not a single break occurred in 26% of the years". "These spells" implies IMD's test; "no break at all" drops "in July-August" | "A study of July and August from 1951 to 2007 used a third test, a rainfall dip over the core monsoon zone for three days or more. Breaks lasted longer than active spells. About a third of breaks lasted a week or more. In about one year in four, July and August had no break at all." Caption: "1951-2007 (Jul-Aug): 1/3 of breaks >= 1 week, no break in ~1/4 of years" |
| b10 | "About a third of breaks lasted a week or more" | PASS | Raj abstract: 32% (M067) | |
| b10 | "seasons with many break days tend to be poor seasons" | PASS | Gadgil 2003 lines 721-725 (Sikka 1980: more break days in poor seasons) (M069). Advisory: it follows the Raj sentences, so it can read as Raj's finding; add "Gadgil found" | |
| b11 | "low-pressure systems ... stronger ones are monsoon depressions"; "about two a month" | PASS | FAQ Q7: lows may intensify into depressions; "2 depressions form in each of the monsoon months (June-September)" (M071) | |
| b11 | "They bring most of the monsoon's rain" | PASS | FAQ Q12 (ledger says Q13): depressions "cause most of monsoon rains" | |
| b11 | July and August wettest; "more than three-fifths" (caption 32% + 29%) | PASS | PR22: 32.3% + 29.4% = 61.7% (M046). Advisory (rule 6): caption "our sum: 62%" | |
| b12 | "will not declare a withdrawal before 1 September" | PASS | Withdrawal page: "not attempted before 1st September" (M036), for "extreme north-western parts" | |
| b12 | "NW India then needs five days without rain, much drier air and a change in the winds" | PASS | Withdrawal page: rainfall ceased 5 continuous days; anticyclone at 850 hPa and below; considerable moisture reduction. "Change in the winds" is a fair plain gloss of the anticyclone | |
| b12 | "starts leaving the north-west around 17 September" | PASS | RR p.31 (vii) (M033) | |
| b12 | "Our Class 11 book says the first week of September. Again, that is the old normal." | FIX | NCERT-PE p.37: "The monsoon retreats from the western Rajasthan by the first week of September". The book names western Rajasthan, not the north-west; IMD's old normal (RR lines 405-406) is 1 Sept for "extreme western parts of north-west India", so they match, but say so | "Our Class 11 book says western Rajasthan, by the first week of September. Again, that is the old normal." Caption: "(NCERT: W Rajasthan, 1st week, old)" |
| b12 | "By the fifteenth of October, it has left most of the country" | PASS | RR p.31 (M034) | |
| b13 | "easterlies set in by about 14 October; around 20th, IMD's normal date, NE monsoon reaches coastal Tamil Nadu; season Oct to December" | PASS | CHN p.5 lines 131-133 (M062); lines 90, 118 for Oct-Dec | |
| b13 | "From June to September, Tamil Nadu gets about a third ... From October to December, almost half" | PASS | CHN p.5: 342.0 mm (printed 35%) and 447.4 mm (printed 48%) of 943.7; ours 36.2% / 47.4% (M060, M061). Sub-division is "Tamil Nadu, Puducherry and Karaikal": acceptable shorthand. Advisory: say "Tamil Nadu" only with the caption's mm | |
| b13 | "Relatively dry, then, but not dry" | PASS | M061 note; CHN "rain-shadow region during the SWM" | |
| b14 | Belt moved north with the sun in summer, slides south after | PASS | NCERT-FPG p.78: belts move with the sun, south in winter, north in summer (M095). "In autumn" is our gloss of the south-ward swing | |
| b14 | "When the belt and its storms sit over the south, Tamil Nadu gets its rain"; "In December ... rain falls away" | PASS | MM p.38: rain when ITCZ and systems present; in December "ITCZ moves further south ... rainfall sharply reduces" (M063) | |
| b14 | "Storms from the Bay of Bengal add much of it" | FIX | M063 says "add much of the rain", but neither MM nor CHN says "much". CHN p.1: Bay cyclonic disturbances "contribute significantly to NEM rainfall"; MM: lows and depressions "contributing to widespread rainfall" | "Storms from the Bay of Bengal add a lot of it." (or "contribute significantly") and fix M063's value text |
| b14 | "the monsoon lands first on the Andaman Sea in May. And its rain leaves the south last, in December" | FIX | Joins the SW monsoon (leaves the south by about 15 Oct, RR p.31) to the NE monsoon (Oct-Dec; IMD treats it as a separate monsoon). "Leaves ... in December" is not what MM says: rain falls away in December | "So the monsoon lands first on the Andaman Sea in May. And the last of the year's monsoon rain falls on the far south, as December begins to dry it out." |
| b15 | "about eighty-seven centimetres" | PASS | PR22 (M044) | |
| b15 | "typical swing is about a tenth of the average"; "biggest shortfall on record was under thirty percent" | PASS | Gadgil 2018 (printed p.3, ledger says p.2): "standard deviation is only about 10% of the mean and the largest recorded deficit ... less than 30%"; record 1871-2016 (M081). Fix ledger page | |
| b16 | Forecast normal = 96-104% of average | PASS | LRF 13 Apr 2026 table (M048) | |
| b16 | Finished all-India season: normal within 10% either way | PASS | FAQ Q4 (90-110%); 2025 report conclusion: 108% "within the normal range (+-10%)" (M049, M050) | |
| b16 | "IMD's report called 2025, at 108%, normal. On the forecast scale ... above normal" | PASS | 2025 report p.xii and lines 165, 1127; LRF table 105-110 = above normal (M050, M055) | |
| b16 | "For a single region, normal stretches to nineteen percent either way" and caption "sub-division +-19%" | FIX | FAQ Q3: the +-19% categories are for "districts, states" and for daily/weekly/monthly averages; the 2025 report applies +-19% to all-India monthly rainfall too (line 281). No saved source names "sub-division" for this scale (M051/M050 say so, the source does not) | Voice: "For a district or a state, normal stretches to nineteen percent either way." Caption: "district / state +-19%". Correct M051 claim text |
| b17 | "Every two to seven years, the eastern Pacific warms up. This is called El Nino." | FIX | ENSO-FAQ Q2: "ENSO events [El Nino and La Nina] typically develop every 2 to 7 years". The interval belongs to ENSO events, not to El Nino alone. Q1: El Nino = central and eastern equatorial Pacific | "Every two to seven years or so, the central and eastern Pacific swings warm or cool. The warm swing is called El Nino." Caption: "ENSO swings: every 2-7 years" |
| b17 | "It generally weakens India's monsoon" | PASS | ENSO-FAQ Q4: "generally suppresses" (M073) | |
| b17 | "droughts of 1982, 1987, 2002, 2009 and 2015 came in El Nino years" | PASS | ENSO-FAQ Q4: "many major drought years (such as 1982, 1987, 2002, 2009, 2015) occurred during El Nino events" | |
| b17 | "In 1997, a strong El Nino year, India's monsoon was normal" | PASS | ENSO-FAQ Q28 (M074). The IOD explanation is correctly left out | |
| b17 | "When its western side runs warmer than its eastern side, it tends to help" | FAIL | Literally false: the eastern Indian Ocean (near Indonesia) is normally the warmer side. IMD defines a positive IOD as warmer-than-normal west and cooler-than-normal east (anomalies, DMI = west minus east anomaly >= +0.4 C) (ENSO-FAQ Q25-27, M075) | "When its western side runs warmer than usual, and its eastern side cooler than usual, it tends to help." Caption: "IOD: warmer-than-usual west tends to help" |
| b17 | Exam trap: two Class 11 books describe El Nino in opposite ways; right way is warm water replacing the cold Peruvian current | PASS | NCERT-PE p.31: warm current "replaced temporarily by cold Peruvian current"; NCERT-FPG (kegy209 line 213): warm water "replaces the cool Peruvian current" (M076). 10 C and 1990-91 left out: good. Note NCERT says "cool" in FPG | |
| b18 | LPA lowered in 2022 from about 88 cm to under 87 cm, newer decades | PASS | PR22: 880.6 -> 868.6 mm, "with effect from the southwest monsoon season 2022" (M044). Caption 88.1 -> 86.9 correct | |
| b18 | "natural cycle of wetter and drier decades"; "drier phase since the 1970s" | PASS | PR22: "natural multidecadal epochal variability ... dry epoch which started since the decade of 1971-80" (M082) | |
| b18 | "IMD also reports that monsoon rain fell about six percent over fifty years ... more dry spells, and more intense wet spells" | PASS | FAQ Q37: "Based on recent studies ... declined by around 6% from last fifty years ... more frequent dry spells and more intense wet spells" (M083). Advisory: IMD is relaying studies in a 2020 FAQ: "IMD's FAQ, citing recent studies, says" | |
| b19 | "one number for all India, inside a band"; "hides a map ... a rhythm of active spells and breaks" | PASS | M044, M048, M056, M067 | |
| b19 | "hides a calendar: the Andaman Sea in May, Tamil Nadu's rain in December" | FIX | MM: in Tamil Nadu October and November are the big months; December "hardly contributes" and rainfall "sharply reduces"; CHN: season Oct-Dec | "It hides a calendar: the Andaman Sea in May, Tamil Nadu's rain from October." |
| b19 | Exam recap: Andaman 22 May, Kerala 1 June, whole country 8 July, NW withdrawal 17 Sept | PASS | RR p.31 (M031, M027, M029, M033) | |
| b19 | Windward Ghats wet, rain shadow dry; TN almost half Oct-Dec; LPA 1971-2020 about 87 cm | PASS | M058, M060, M044 | |
| b19 | "El Nino usually weakens the monsoon, but not every time" | PASS | ENSO-FAQ Q4-Q5 (M073, M074) | |
| b19 | Caption "exam card: 6 lines" | FIX | The recap has nine sentences; "6 lines" matches nothing in the voice and is an unsourced on-screen number | Caption: "exam card" (or state the true line count once the card is drawn) |
| b20 | Hand-off: jet streams; winter rain that feeds the north's winter crops | PASS | NCERT Class X p.31: winter rain from western temperate cyclones helps rabi crops in the north and north-west (M087). "Jet streams" is a teaser, not a fact | |

## Counts

PASS and FIX/FAIL counts are in the reply summary. Items with no ledger row or the wrong row, beyond verdicts: b09 cites M020 (Mascarene High) for trough and foothill statements; b06 defines orographic rain without citing M059; b08 needs M042; b11 ledger says FAQ Q13 but the quote is Q12; M081 page is 3 not 2; M041's ledger value ("two streams") is not in the cited pages; M051 says "sub-divisions" but the FAQ says "districts, states"; M063 says "much of the rain" but the sources say "significantly".

## FIX / FAIL rows

1. b02 "two streams" is not IMD's wording (RR describes a sequence). FIX.
2. b03 "thick, tall cloud" is our gloss of OLR < 200 W/m2. FIX.
3. b03 "rest of India: no formula" ignores the Andaman objective criteria (RR p.5, 2016). FIX.
4. b07 "taller than a three-storey house" is an unlabelled own comparison. FIX.
5. b08 "more than nine times" cannot be proved from "more than 300" and "about 33". FIX.
6. b08 "far end of both branches, little rain is left" has no source. FIX.
7. b09 cites M020 (wrong claim); "rain stops" overstated. FIX.
8. b10 Rajeevan breaks are a third definition, July-August only. FIX.
9. b12 NCERT says western Rajasthan, not the north-west. FIX.
10. b14 "add much of it" overstates "contribute significantly". FIX.
11. b14 "its rain leaves the south last, in December" blurs SW and NE monsoon. FIX.
12. b16 "sub-division +-19%" is not in the source (districts, states). FIX.
13. b17 "every two to seven years ... El Nino": interval is for ENSO events. FIX.
14. b17 IOD "western side warmer than eastern" is false as written. FAIL.
15. b19 "Tamil Nadu's rain in December" contradicts MM and b13. FIX.
16. b19 "exam card: 6 lines" matches nothing. FIX.

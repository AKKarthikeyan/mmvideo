# GEO-04 Volcanoes: independent audit of claims.csv (gate S5), 3 Nov 2026

**Method.** Every one of the 71 rows was reopened at the cited page or section. NCERT PDFs were re-extracted page by page with pdftotext to check printed page numbers; USGS, NOAA and journal texts were grepped and read in context; the NCEI JSON files were parsed; the UPSC 2024 page 3 was rendered and read. Meaning, number, unit, date, place, speaker and status were checked, not phrases alone.

**Result.** PASS 62, FIX 8, FAIL 1 (total 71). FAIL: V017. Every FIX was a clear-cut correction and has been applied to `claims.csv` (see the change list). Status counts after edits: CONFIRMED 54, CONFLICT 9, CORRECTED 3, UNVERIFIED 4, BLOCKED 1.

| claim_id | verdict | evidence | exact fix |
|---|---|---|---|
| V001 | PASS | NCERT kegy203 p.23 definition read; USGS volc_text 'Nature of Volcanoes' gives vent + cone and the 'opening or vent' sense. |  |
| V002 | PASS | NCERT p.23 'recent past'; USGS volc_text 'Volcano Environments': erupted at least once in recorded history. CONFLICT status fits. |  |
| V003 | PASS | NCERT p.23 'moving towards the crust or reaches the surface ... lava'; USGS 'magma ... after it erupts it is called lava'. CORRECTED fits. |  |
| V004 | PASS | kegy203 p.23 list matches word for word (chlorene is NCERT's typo). |  |
| V005 | PASS | fs002-97.txt line 15: >90% water vapour; CO2, SO2, H2S, H2, fluorine; no nitrogen compounds. Fact sheet is marked superseded (line 6); status CONFLICT with the NCERT list is fair. |  |
| V006 | PASS | Rendered page 3 of 2024_prelims_gs1.pdf: Q3 text and options (a)-(d) exactly as claimed. Answer (d) correctly labelled our inference; key not read. |  |
| V007 | PASS | fs002-97 line 12: bombs within 2 miles, ash under about 0.1 inch. Single source, so no on-screen use without S4. |  |
| V008 | PASS | fs002-97 line 21: 'as hot as 1,500 F'; 800 C is our conversion (1,500 F = 816 C), labelled. |  |
| V009 | PASS | volc_text: thin lava lets gas escape, thick pasty lava builds pressure; thumb-on-bottle analogy; dynamic_tectonics line 209 repeats it. The 'limit' sentence is ours and says so. |  |
| V010 | PASS | volc_text: pumice, 'floats on water'. One source, flagged. |  |
| V011 | PASS | kegy203 pp.23-24 five types; volc_text 'four main kinds'; calderas and lava plateaus treated separately by USGS. |  |
| V012 | PASS | kegy203 p.23-24 Hawaiian, basalt, explosive if water enters vent; volc_text: Mauna Loa largest shield and largest active volcano, 13,677 ft. |  |
| V013 | PASS | kegy203 p.24 cooler, more viscous lava; volc_text lists Fuji and Cotopaxi (Ecuador) and 'stratovolcanoes'. |  |
| V014 | FIX | NCERT p.24 and volc_text confirm collapse, Crater Lake 6,800 years ago. But USGS says circular calderas 1 to 15 miles, elongated ones up to 60 miles; '1 to 15 miles across' alone narrowed the range. | Applied: added 'and elongated ones up to 60 miles long'. |
| V015 | PASS | volc_types.txt: simplest type; 1943 farm at Paricutin; 1,200 ft; 'During 9 years of activity'. |  |
| V016 | PASS | kegy203 p.24 '>50 m' and 'hundreds of km'; volc_text plateaus (Iceland, Washington, Oregon, Idaho; Columbia/Snake flows over a mile thick). |  |
| V017 | FAIL | Claim and note say USGS gives about 65,000 km. No saved USGS text says that; both saved This Dynamic Earth pages say more than 50,000 km (dynamic_developing.txt 56-57, 120; dynamic_tectonics.txt 306). NOAA mid_ocean_ridge.txt 'nearly 65,000 km (40,390 miles)' and NCERT p.24 'more than 70,000 km' are right. The dossier's NCERT-error list and 'spot the mistake: 70,000 km' rest on the false USGS match. | Applied: status CORRECTED to CONFLICT; three figures named; second source swapped to USGS TDE. Dossier lines 'ridge length is about 65,000 km, not more than 70,000' and the Part D spot-the-mistake must be changed before script (not edited by me). Re-check after the researcher's edit. |
| V018 | PASS | dynamic_tectonics lines 197-201 and 300-303: about three quarters of lava erupted unseen, mostly spreading centres. NOAA does not give the figure (noted). |  |
| V019 | PASS | kegy203 p.24 volcanic v plutonic; volc_text 'coarser grained, nearly completely crystalline'. |  |
| V020 | PASS | kegy203 p.25 batholith: deep domes, appear after denudation, granitic, cooled part of magma chambers. NCERT-only, flagged. |  |
| V021 | PASS | kegy203 p.25 laccolith, lapolith, phacolith, sill/sheet definitions match; 'lacolith' spelling is NCERT's. |  |
| V022 | PASS | kegy203 p.25 Karnataka domal granite hills, 'lacoliths or batholiths'. UNVERIFIED is the right status. |  |
| V023 | PASS | kegy203 p.25 dykes, western Maharashtra, feeders of the Deccan; volc_text dikes as ribs of composite cone and plug-and-dike remnants; Srivastava 2020 Damodar valley dykes 70.5-65.5 Ma. |  |
| V024 | PASS | iest102 pdf p.4 = printed p.16: 'most earthquakes and volcanoes occur along plate boundaries ... Ring of Fire'. Hotspot half is from USGS, not Grade 9. |  |
| V025 | PASS | iest102 printed p.15 convergent and divergent text matches; dynamic_tectonics 197-198 'most above-sea volcanoes near convergent boundaries'. Note that no water step is in NCERT is correct. |  |
| V026 | PASS | kegy204 printed p.29 'rim of fire'; volc_text line 399 'more than half encircle the Pacific'; dynamic_tectonics line 13 'most seismically and volcanically active'. |  |
| V027 | PASS | dynamic_hotspots lines 6-39: 3,200 km, Wilson 1963, Kauai oldest rocks about 5.5 million years. |  |
| V028 | PASS | Sen 2001 pdf p.6: Deccan to Chagos-Laccadive to Reunion; 'considerable debate' about plume source. Srivastava 2020 'supposedly related'. CONFLICT fits. |  |
| V029 | FIX | Gunda 2021 abstract: 3.54 times (1990-2020 v 1950-1989) is read as seismicity-induced decompression that 'may have caused ... eruptions or modulation'; the volcano's activity is 'preceded by seismic activity'; swarms 'are not associated with volcano'. The row said only 'linked to eruptions', which hides the direction and the clustering caveat. NCERT p.20 and USGS 'same dynamic Earth forces' fine. | Applied: claim and value now give the authors' direction and the caveat. |
| V030 | PASS | kegy205 p.38: radioactivity, rotational and tidal friction, primordial heat. UNVERIFIED shares is right; Davies and Davies give only totals. |  |
| V031 | PASS | Davies and Davies 2010 abstract: 47 +/- 2 TW. |  |
| V032 | PASS | kegy205 pp.38-39 volcanism and diastrophism text; stale 'preceding chapter' reference; BookletClass11 lists old Ch5 Minerals and Rocks as full chapter dropped. |  |
| V033 | PASS | kegy205 p.37 land-building v land-wearing; volc_text plug-and-dike after erosion. |  |
| V034 | PASS | kegy203 p.22 5 km, 30 km, 70 km Himalaya; dynamic_inside 5 / 30 / 100 km. |  |
| V035 | PASS | kegy203 p.22-23 Moho to 2,900 km, lower mantle solid; dynamic_inside 'semi-solid ... 2,900 km thick'. |  |
| V036 | PASS | kegy203 p.22 asthenosphere to 400 km, 'main source of magma'; no publisher read, so UNVERIFIED is right. |  |
| V037 | PASS | kegy203 p.23 10-200 km; volc_text about 50 miles; dynamic_inside 'at least 80 km'. |  |
| V038 | PASS | kegy203 p.23 core; dynamic_inside 2,200 km outer and 1,250 km inner core. |  |
| V039 | PASS | kegy203 p.18 'Kola, in Arctic Ocean ... 12 km'; Skuf'in: Kola Peninsula, 10 km SW of Zapolyarny, 12,262 m in 1990. CORRECTED fits. |  |
| V040 | FIX (note only) | Skuf'in: 'up to 220 C at a depth of 12 km' but the same paper later gives measured 212 C at 12 km and 180 C at about 10 km. Claim is not false. | Applied: note records the 212 C measurement. |
| V041 | FIX | kegy203 p.18 names are right; NCPOR and ECORD confirm Integrated Ocean Drilling Program 2003-2013, International Ocean Discovery Program, IODP3 from January 2025 (ECORD 12 March 2024, a forward-looking statement). 'DSDP, ODP' appear in no saved source, so the 'real sequence' was background knowledge. | Applied: DSDP/ODP removed from the claim, marked UNVERIFIED; status stays CORRECTED for Project v Program. |
| V042 | PASS | kegy203 p.19 temperature, pressure, density rise with depth; gravity anomalies, magnetic surveys, meteorites; dynamic_inside. |  |
| V043 | PASS | kegy102 printed p.15 'Barren island, the only active volcano in India'; Sheth 2009 'only active volcano in Indian territory'. |  |
| V044 | PASS | Sheth 2009 intro: about 70 km east of Andaman chain, northernmost active volcano of Indonesian arc, Indian Plate subducts at Andaman Trench. |  |
| V045 | PASS | Sheth abstract: 1787-1832, 1991, 1994-95, 2005-06, 2008 tephra; Gunda: vigorous from 2018 after 13 years, last active 2004-2005. CONFLICT fits. |  |
| V046 | PASS | Sheth title and abstract: active mafic stratovolcano, caldera wall, central cinder cone, basalt and basaltic andesite. |  |
| V047 | PASS | BLOCKED is the honest status. |  |
| V048 | PASS | Sheth intro: Narcondam dormant, about 140 km NNE, may have erupted in the Holocene; andesite and dacite with magma mixing cited from Pal et al. 2007b. |  |
| V049 | PASS | iest102 printed p.19: 'India's only mud volcano', mud bubbling due to gases and pressure. UNVERIFIED right. |  |
| V050 | FIX | NCERT p.24 flood basalt province and p.25 exercise 1(iii) (options Shield, Flood, Composite, Caldera) are right. But 'issued through long narrow fissures' is a Krishnan (1982) epigraph quoted in Sen's introduction; Sen's own abstract says multiple centres, perhaps a shield volcano-like structure in the Western Ghats. Wrong speaker. | Applied: attribution corrected in claim and value. |
| V051 | PASS | Sen abstract: start about 68 Ma, bulk 65-66 Ma; Srivastava 70.5-65.5 Ma dykes. |  |
| V052 | FIX | Sen: 1.7 km west, about 100 m east, correct. Table 2: Hooper 1999 says 1-2 million km2, Coffin and Eldholm 1.8, Pascoe 1964 over 2.6; the row said '1.8 to 2 million (Coffin and Eldholm; Hooper)', misreporting Hooper. | Applied: figures restated as in Table 2. |
| V053 | PASS | Sen abstract: more than 1.7 km section erupted in about 55,000 years (model). One source, flagged. |  |
| V054 | FIX | jess101 printed p.7: 'typical of the Deccan trap (Basalt) region ... made up of lava flows'; climate and parent rock are the formation factors. 'Weathered material' is not NCERT's wording. (Aside: the 'Class XI soils chapter' deleted in 2022 is India: Physical Environment Ch6, per the Booklet.) | Applied: wording now says NCERT 'made up of lava flows' and marks 'weathered' as ours. |
| V055 | PASS | Lonar review: impact crater on about 65 Ma Deccan basalt, 1.83 x 1.79 km, about 150 m deep, one of 34 National Geological Monuments. |  |
| V056 | PASS | UNESCO page: Ecuadorian Andes, designation 2025, volcano 'still active'; NCEI Tungurahua records country Ecuador, morphology Stratovolcano. |  |
| V057 | PASS | 2026_prelims_gs1-15.pgm.txt Q31 and options (Ecuador, Peru, Bolivia, Colombia). |  |
| V058 | PASS | NCEI tambora.json: 1815-04-10, VEI 7, deaths 11,000, total 60,000; USGS 'most powerful eruption in recorded history', 'year without a summer'. (File is ncei_sig_volc_tambora.json, lower case; the cell says Tambora. Harmless on macOS.) |  |
| V059 | PASS | NCEI: 1883-08-27, VEI 6, total 36,417 (direct 2,000); USGS 36,000 killed, tide gauges over 7,000 km. |  |
| V060 | PASS | fs113-97 lines 97-99: nearly 20 million tons, 1 F (0.5 C), 1991-93; dynamic_tectonics 22 million tons; Self abstract 17 Mt, TOMS 20 +/- 6 Mt. |  |
| V061 | PASS | fs002-97 line 16 gives the stratospheric sulfate aerosol mechanism; kegy211 printed p.95 matches. |  |
| V062 | FIX | NCEI: Pelee 8 May 1902 28,000, VEI 4; Ruiz 13 Nov 1985 23,080, VEI 3. USGS TDE: Armero 25,000 (stated) and about 30,000 killed at Pelee (not stated, though it is a second published figure). fs002-97: lahars 20-40 mph, over 50 miles, 'one of the deadliest hazards'. | Applied: Pelee USGS 30,000 added to value and note. |
| V063 | PASS | fs002-97 line 13: about 80 jets in 15 years; 22,000 sq miles. Dated, flagged. |  |
| V064 | PASS | NCEI Hunga: 2022-01-15, VEI 6, submarine volcano. |  |
| V065 | PASS | ncei_volcanoes.txt: over 800 significant eruptions, over 1600 volcanoes; volc_text 'more than 500 active (erupted in recorded history)'. Status CONFLICT is generous (different definitions), harmless. |  |
| V066 | PASS | volc_text closing section and dynamic_tectonics 'Fertile soils', Geysers. |  |
| V067 | PASS | volc_text: Vulcano, Vulcan's forge. |  |
| V068 | PASS | iest102 printed p.33 landslides trigger; fs002-97 lahars over 50 miles. |  |
| V069 | PASS | gess203 pp.12-13 volcano as vent; boiling-water-with-lid activity. |  |
| V070 | PASS | kegy205 pp.44-45 five soil-forming factors; weathering mantle. |  |
| V071 | PASS | kegy205 p.41 exfoliation text; linked to Ch3 p.25 only by our labelled inference. |  |

## Checklist check (checklist.csv, ncert_map.md Part C)

All 71 claim ids appear in the checklist except V040 and V069 (both fun-fact or ELI5 rows; add them to K012/K031-type rows or K032). Page numbers and heading names in rows K004-K030 match the printed pages (kegy203 pp.18-25; kegy205 pp.37-45). Set-aside reasons (GEO-01, GEO-03, GEO-05, GEO-14) are sound.

Gaps, none a factual error:
1. **Sub-headings not listed.** kegy203 sub-headings are covered only under parent rows: Emergence of Shadow Zone, Propagation of Earthquake Waves, Types of Earthquakes, Measuring Earthquakes, Effects of Earthquake, Frequency of Earthquake Occurrences (all would be set aside for GEO-03); Shield Volcanoes, Composite Volcanoes, Caldera, Flood Basalt Provinces, Mid-Ocean Ridge Volcanoes (V012-V018); Batholiths, Lacoliths, Lapolith Phacolith and Sills, Dykes (V020-V023). GOLD_STANDARD section 6 asks for subheadings, so add rows.
2. **kegy204 (Ch4) headings are absent** from the heading rows: 'Distribution of Earthquakes and Volcanoes' (p.29; V026), the three plate-boundary headings (V025 uses Grade 9 instead), 'Concept of Sea Floor Spreading' (p.30). V026 is cited only through concept row K033.
3. **kegy205 headings missing:** 'Geomorphic Processes' (p.37, cited by V033), 'Biological Activity and Weathering' and 'Significance of Weathering' (p.41; GEO-05). K028 labels 'Soil-forming Factors' as under 'Erosion and Deposition'; in the book it sits under 'Soil Formation > Process of Soil Formation' (p.44).
4. **Dossier follow-ups after my edits** (not changed by me): section 2 NCERT-errors list ('ridge length is about 65,000 km, not more than 70,000') and Part D 'Spot the mistake: the ridge is 70,000 km long' must follow V017's new three-figure CONFLICT; the Self-check line 'Kola reached 220 C at 12 km (V040)' is fine but the paper also gives 212 C.
5. Open items still stand and are honest: GVP BLOCKED (V045, V047), UPSC answer keys not read (V006, V056), FS 2018-3075 full text not read (V005, V063), Class VII book status (V069). V053, V010, V015 and other single-source rows are correctly flagged for S4 before on-screen use.

## Changes made to claims.csv (backup of original: scratchpad `claims.orig.csv`)
| row | field | change |
|---|---|---|
| V014 | claim | added 'elongated ones up to 60 miles long' to the caldera size range |
| V017 | claim, value, status, second_source, second_url, note | USGS figure corrected from 65,000 km to more than 50,000 km (saved USGS TDE pages); NOAA 65,000 and NCERT 70,000 kept; status CORRECTED to CONFLICT; second source now USGS This Dynamic Earth; note rewritten, false 'USGS 65,000' statement removed |
| V029 | claim, value | authors' inference stated in their direction (seismicity-induced decompression may have caused or modulated eruptions) plus their caveat that swarms cluster along tectonic structures, not at the volcano |
| V040 | note | records the paper's measured 212 C at 12 km and 180 C at about 10 km |
| V041 | claim, note | DSDP/ODP names removed from the 'real sequence' (no saved source); marked UNVERIFIED; audit note added |
| V050 | claim, value | 'long narrow fissures' attributed to Krishnan (1982) as quoted by Sen; Sen's own view (multiple centres, perhaps a shield-like Western Ghats structure) stated |
| V052 | claim | original area restated as in Sen's Table 2: Hooper 1-2, Coffin and Eldholm 1.8, Pascoe over 2.6 million km2 |
| V054 | claim | NCERT's 'made up of lava flows' wording; 'weathered' marked as our word |
| V062 | value, note | USGS figure of about 30,000 for Pelee added beside NCEI's 28,000 |


## Open items, 10 Nov 2026

Closed (1 of 5): V030 CORRECTED. Davies and Davies (2010) give Earth's surface heat loss as 47 +/- 2 TW, with the mantle share from radioactive heating and secular cooling and "minor" other sources; they name no tidal or rotational heating, so NCERT's list is kept as "NCERT says" only (`sources/v030/`).

Still open (4): V022 UNVERIFIED (no publisher text on the Karnataka domal hills found). V036 UNVERIFIED (USGS This Dynamic Earth gives no asthenosphere depth; "400 km" and "main source" unread). V049 UNVERIFIED (OSTI abstract of Achyuthan and Eastoe 1999 fits a gas-and-mud vent, but "India's only" is unsupported; Springer overview behind a client challenge, not bypassed). V047 BLOCKED (Smithsonian GVP and USGS VHP returned 403 on 10 Nov; NOAA NCEI holds no Barren Island events; the living status still needs a human with the GVP page).

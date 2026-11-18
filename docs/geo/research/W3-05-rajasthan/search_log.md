# W3-05 Rajasthan vs Europe: search log (1 Nov 2026)

Researcher: Claude (research agent, one run). Topic: "Rajasthan is bigger than most countries in Europe" (Week 3, Map is lying). Every search is listed, including blocked or empty ones. Category numbers follow section 2 of `docs/geo/RESEARCH_RULES.md`.

Examined sources: 16 (S01-S16 in sources.jsonl; S05 is a redistributor of FAO data and S14 a finding aid)
Tier P kept: 16
Saturation: yes. The last three sources examined (S09 Destatis, S15 SSB protected-areas table, S13 Snyder) only corroborated the Germany and Norway definitions and the Mercator formula; the figure set (C001, C004-C010) had been stable since S06 Eurostat. Earlier sources (S07 Statistics Finland, S08 SSB) did add the Finland margin and the Norway definition problem, which is why the run continued past them.

Tier X seen in search results and NOT used as evidence: Wikipedia (Rajasthan; search snippet only), unacademy.com, geeksforgeeks.org, vedantu.com, vajiramandravi.com, bajajfinserv.in, anantamias.com, bharatnotes.com, citypopulation.de, ceicdata.com, worldatlas.com, georank.org, theglobaleconomy.com, statista.com, nationsonline.org, ffo.gov.in (unreachable anyway). Web-search "answers" were used only to find primary URLs; every figure in claims.jsonl was read from a document or dataset opened in this run.

## Category 1: Official map and boundary record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| MMVideo house geodata | `sources/geo/ne_10m_admin_0_countries_ind.geojson` (India POV) and `ne_10m_admin_1_states_provinces.geojson` (Rajasthan polygon) | en | 2 | S10, S11. Used only to measure and to draw outlines. Rajasthan's outer edge is the India-Pakistan international boundary and the Rajasthan edges with other Indian states; no disputed boundary is touched. |
| Survey of India | web search "geographical area of India states" (surveyofindia.gov.in, mha.gov.in, pib, loksabha) | en | 10 | No state-area table found at surveyofindia.gov.in (annual reports and vector catalogue only). The Census A-1 footnote says the state areas are provided by Survey of India, so Survey of India's figure is read at the Census (S01). Logged as: SoI primary table not found. |
| Rajasthan state portal | rajasthan.gov.in/Pages/aboutrajasthan.aspx | en | 404 | Page does not exist now. Not used. |

## Category 2: Measurements we make ourselves
| Dataset | Method | Output | Kept |
|---|---|---|---|
| Census A-1 (S01) | `method/census_area.py`: parse xlsx with zipfile, sort states by area | `method/census_area_output.txt` | C001, C002 |
| UNSD DYB Table 3 (S03) | `method/dyb_europe.py`: parse the Europe block of the pdftotext output, count states larger than Rajasthan, margins | `method/dyb_europe_output.txt` | C003-C010, C016 |
| FAOSTAT (S04) | `method/europe_areas.py`: FAO country area and land area for the 51 M49 Europe members, deduplicated by M49 code | `method/europe_areas_output.txt` | C012 (and the FAO-basis conflict) |
| Eurostat reg_area3 (S06) | `method/eurostat_areas.py` | `method/eurostat_areas_output.txt` | C004, C006-C008, C010 |
| Natural Earth (S10, S11) | `method/ne_areas_mercator.py`: ellipsoidal cylindrical equal-area area, Mercator-drawn area, latitude ranges | `method/ne_areas_mercator_output.txt` | C013, C015, C017 |

## Category 3: Treaties, gazettes, legal and official texts
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| States Reorganisation / gazette area notices | not searched | - | - | The comparison needs the state's area as published by the census; no boundary change affects Rajasthan between 2011 and today that was found. The Telangana/Andhra Pradesh split is the only 2011 vs now difference in the state list and does not touch Rajasthan. Logged as not applicable. |
| UN M49 overview (S02) | the standard M49 table | en | 1 | S02 (the geoscheme is the "definition of Europe") |
| Census Digital Library | catalog search "Number of villages, towns, households, population and area" | en | 15 | S01 (catalog/42526, A-01 2011). Catalog 20028 is the 2001 version, not opened. |

## Category 4: Period records
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| NITI Aayog Digital Library | Planning Commission Draft Annual Plan 2001-2002 Vol. 1 | en | 1 | S12 (one sentence: 3.42 lakh sq. kms., largest State). Period gazetteers (Rajputana Gazetteer) not searched: the question is today's area and a 1900s boundary (Rajputana agency) differs in extent. Logged as not needed. |

## Category 5: Old maps
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| (none) | - | - | - | Not needed for an area comparison. Skipped on purpose: a Mercator-versus-true-size picture is computed from today's geodata (C015), not from an old map. |

## Category 6: Archaeology and science
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| USGS Professional Paper 1395 (Snyder) | Mercator areal scale factor sec squared | en | 1 | S13 (p. 44, eq. 7-3 text) |
| Peer-reviewed cartography papers on Mercator distortion | not searched | - | - | One standard reference (Snyder) suffices for a formula; the numbers are our own computation. |

## Category 7: Data owners for any modern number
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| UNSD Demographic Yearbook 2022 | Table 3 (surface area) xls and pdf | en/fr | 1 | S03, S14 |
| FAOSTAT bulk | Inputs_LandUse (Country area, Land area) | en | 1 | S04 |
| World Bank WDI API | AG.SRF.TOTL.K2 and AG.LND.TOTL.K2, 2021 | en | 2 | S05 (definition only; same FAO source) |
| Eurostat | reg_area3 country and Norway NUTS | en | 2 | S06 |
| Statistics Finland | web search; Finland in Figures 2026 PDF | en | 3 | S07. stat.fi/tup/suoluk (old page) was 404; stat.fi/en/statistics/ava was an unrelated page. |
| Statistics Norway | StatBank API tables 11342, 01402; protected-areas table | en | 4 | S08, S15. Table 11342 returns 0 for Svalbard and Jan Mayen (not covered); table 01402 stops at 2010; the ssb.no/en/statbank1 pages are JavaScript. |
| Destatis | web search; Bodenfläche insgesamt table | de | 3 | S09. English Destatis pages returned 404. |
| Statistics Poland, ISTAT, INE (Spain), INSEE, Rosstat, Ukrstat | not searched | - | - | They matter only for the six larger states and the margins above 9% (Poland), which UNSD and Eurostat already cover from the offices' reports. Open question Q3. |

## Category 8: Original-language sources
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Destatis (German) | Bodenfläche insgesamt | de | 1 | S09 |
| Statistics Norway / Finland | English-language releases only | en | - | Norwegian and Finnish originals not opened; the English releases come from the same offices. |
| Hindi census pages | not searched | - | - | The census figure is a number. |

## Category 9: The other side's record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| The "other side" here is the European offices; each was read at its own office (Finland, Norway, Germany) or at UNSD/Eurostat for the rest | see category 7 | - | - | Conflicts between offices and UNSD/FAO: conflicts.md (K1-K4). |

## Category 10: Place names
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Census A-1 | state name | en | 1 | "RAJASTHAN" |
| UNSD / M49 | country names | en | 51 | Use the common names: Russia, Czechia, North Macedonia, Moldova, United Kingdom, Vatican City for the "Holy See". Pronunciation: Rajasthan = RAH-juh-stahn (Hindi राजस्थान); no voice issue found for the European names beyond Czechia (CHEK-ee-uh) and Åland (not needed). |

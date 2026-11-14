# W3-06 Kumbh Mela: search log (1 Nov 2026)

Researcher: Claude (research agent, one run). Topic: Indica Atlas Week 3, "Why the Kumbh Mela moves between four cities" (sensitive, religion). Category numbers follow section 2 of `docs/geo/RESEARCH_RULES.md`. Every search is listed, including the ones that found nothing or were blocked. Tools: built-in browser, WebFetch and WebSearch (US search, standard mode), curl for archive.org and India-WRIS.

Examined sources: 26 (S01-S26 in sources.jsonl; S25 and S26 examined but not usable as evidence)
Tier P kept: 23 (S01-S14, S16-S24; S15 Watters is tier S; S20 JPL Horizons and S21 Natural Earth are the data owners for our computations)
Saturation: yes. The last three sources examined (S22 Garhwal page, S23 Prayagraj Division gazette note, S24 NTKMA page) added only a 2010 year (SECONDARY-ONLY), the Prayagraj renaming gazette number, and the Nashik 2027 preparation; none changed the story. The three before them (S19 Ujjain plan, S17/S18 India-WRIS) did add C027-C030 (rivers), which is why the run continued past the festival-rule sources.

Access notes: UNESCO's pages returned a human-check page to a plain fetch (support-ID page): not bypassed, the same pages were opened in the built-in browser, which loaded them normally. garhwal.uk.gov.in, kumbhmela2021.iirs.gov.in and indiawris.gov.in were refused by the built-in browser's site permission ("denied or failed"); India-WRIS was fetched by curl (open), IIRS-ISRO did not resolve (DNS), Garhwal came only through WebFetch (C031 hedged). archive.org text for four OCR books fetched by curl. Tier X seen in search results and NOT opened or used as evidence: logicallyfacts.com, counterview.in, dailypioneer.com, aajtak.in, outlookindia.com, sentinelassam.com, qatar-tribune.com, iskconnews.org, shethepeople.tv, sakshipost.com, thequint.com, yourstory.com, onmanorama.com, affairscloud.com, swarajyamag.com, hinduismtoday.com, astroyogi.com, indiawrites.org, Wikipedia pages (Haridwar Kumbh Mela, Prayag Kumbh Mela, Khulasat-ut-Tawarikh; Haridwar page opened through WebFetch as a finding aid only).
Excerpt files of OCR books in `sources/` had stray "<" and ">" characters replaced by spaces so the gate script's HTML stripper does not eat the text; the full raw OCR files sit beside them.

## Category 1: Official map and boundary record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| MMVideo house geodata | `/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_admin_0_countries_ind.geojson` (Natural Earth, India point of view) | en | 1 | House outline for the map. No disputed area is part of this story: all four sites are well inside India, but Haridwar (29.6 N) is near the northern edge, so show only the national outline there (dossier section 5). Survey of India / MEA: not applicable, no boundary claim is made |
| Natural Earth admin-1 | state of each city point | en | 1 | S21: Allahabad UP, Ujjain MP, Nashik Maharashtra. Haridwar not testable (district point lies on the generalised line); state from the UNESCO file (C003) |

## Category 2: Measurements we make ourselves
| Dataset | Method | Output | Kept |
|---|---|---|---|
| JPL Horizons (Jupiter, Sun; geocentric apparent ecliptic longitude, daily) | `method/jupiter_signs.py`: minus Lahiri ayanamsa; sign ingresses 1993-2040; Sun sankranti dates; sign at each Kumbh event | `method/jupiter_signs_output.txt`, `method/horizons_jupiter_sun_daily.csv` | S20 -> C012, C013, C017, C035 |
| Same | `method/historic_check.py`: 1796 (Hardwicke), 1871-75 and 1884-85 (Nasik gazetteer), 1906 (Allahabad gazetteer) | `method/historic_check_output.txt` | S20 -> C021, C022 (computed note), C023 (computed note) |
| Same | `method/kumbh_cycle.py`: Aries-Aquarius years 1993-2040; Jupiter's mean return; gap table of five recent events | `method/kumbh_cycle_output.txt` | S20 -> C007, C013, C015, C017, C018 |
| Natural Earth populated places, rivers, admin-1 | `method/four_sites.py`: haversine distances, state point-in-polygon, nearest river line | `method/four_sites_output.txt` | S21 -> C032, C033 |
| Shelf, elevation, river lengths | not computed | - | River lengths and the Godavari's source height are taken from India-WRIS (C027), not recomputed |

## Category 3: Treaties, gazettes, legal and official texts
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| UNESCO ICH | element page 01258; decision 12.COM 11.B.12; nomination form (Word .doc, versionID 43812) | en | 3 | S01, S02, S03 (plain fetch refused by a human check; opened in the browser). The French form (43813) and the consent letters (34701-EN.pdf) were not needed |
| Government of UP | kumbh.gov.in astrological-significance | en | 1 | S04. A second URL (`/en/astrological-significance`) was only seen in search results |
| PIB | Maha Kumbh 2025 (PRID 2089991); Simhastha 2016 culture festival (relid 139039) | en | 2 | S08, S09. Other PIB 2016 and 2025 releases seen as search summaries only: not used |
| Gazette | Allahabad renamed Prayagraj | en | 1 | S23: "Government Gazette No. 1574/1-5-2018-72-2017 ... October 18, 2018". The gazette PDF itself (337 KB) was not opened. The High Court judgment (26 Feb 2019) was seen as a search summary only |
| CAG | Performance audit of Maha Kumbh Mela 2013-Allahabad | en | 1 | S10 (sentence via WebFetch of the audit page; the report PDF was not opened) |
| Maharashtra | Nashik-Trimbakeshwar Kumbh Mela Authority; Maharashtra Simhastha Kumbh Mela Act 2025; Government Resolution "August 2027" | en | 3 | S24 only. The Act and the resolution were seen as search summaries; the 2027 dates are not claimed |

## Category 4: Period records
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| archive.org | Hardwicke, Narrative of a Journey to Sirinagur, Asiatick Researches vol. 6 (1799) | en | 2 copies | S11. Full OCR (1.1 MB) searched for Coomb/Kumbh/Hurdwar/fair: the fair paragraph (the Sun's entry into Aries; every twelfth year with Jupiter in Aquarius) and the 10 April 1796 clash found. The word "Kumbh" is not in the passage |
| archive.org | Nasik Gazetteer, Bombay Presidency vol. XVI (1883) | en | 4 | S13: Simhasth passages; pilgrim counts; "next Sinhasth falls in 1884-85" |
| archive.org | Allahabad: A Gazetteer (Nevill, 1911) | en | 9 | S12: the Magh Mela and Kumbh paragraph |
| archive.org | Khulasat-ut-Tawarikh (c. 1695, Persian, 1918 edition scan) | fa | 2 | S25: OCR of the Persian is garbage; searched Latin and Arabic-script spellings of Hardwar/Kumbh with no hit; unusable |
| archive.org | Sarkar, India of Aurangzib (1901) | en | 2 | The first scan (dli id 513927) is mis-OCR'd Devanagari; the second (IndiaOfAurangzib) returned HTTP 500 twice. Not read. The 1695 "Kumbh" naming for Haridwar's fair is therefore known to us only as a lead from Wikipedia citing Lochtefeld (2008, p. 70) and Sarkar (1901): SECONDARY-ONLY and not in the claims |
| search | Kama Maclean, Pilgrimage and Power (OUP 2008) earliest textual reference | en | many | Catalogue/blurb pages and Wikipedia only; the book was not opened. Used as a map: it argues the Allahabad Kumbh was remade from the Magh Mela in the 19th century. Not in the claims (open question 4) |

## Category 5: Old maps
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| none | old maps of the four sites | - | - | Not searched: the story is about a calendar rule, and no map claim depends on how the sites were drawn in the past. Skipped with this reason |

## Category 6: Archaeology and science
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| ASI / PIB / gov.in | excavation reports Prayagraj (Jhusi, Hetta-Patti), Haridwar | en | 10 | Nothing usable: a 2011 PIB list of projects with no findings; ASI's recent-report page names other sites. Logged as nothing found |
| NASA/JPL Horizons | planetary positions (science data owner) | en | - | Used in Category 2 (S20) |

## Category 7: Data owners
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| India-WRIS (Ministry of Jal Shakti) | Godavari basin; Ganga basin; river_basins | en | 4 pages | S17, S18 (basin facts). Yamuna and Chambal pages are empty stubs |
| Madhya Pradesh Pollution Control Board | District Environmental Plan for Ujjain | en | 1 | S19 (Ganga basin; Kshipra; Ujjain coordinates; Narmada top-up) |
| Crowd counts | official Kumbh attendance figures (2013, 2016, 2025) | en | several | Seen only as news/promotional figures (tens of crores, projections). Not narrated and not needed for the "why"; not examined further. Hardwicke's 1796 and the 1906 gazetteer estimates kept as estimates (C020, C039) |

## Category 8: Original-language sources
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| GRETIL | Bhagavata Purana e-text, search of 8.7-8.12 for the four cities, rivers, Jupiter, twelve | sa | 1 e-text | S16 -> C026 (negative result, one e-text). Skanda Purana Kumbh verses (cited by the Nashik page): GRETIL's directory listing returned HTTP 403, text not reached (open question 2) |
| Xuanzang in Chinese | Chinese original of the Prayaga chapter | zh | - | Not searched: the story uses two scholarly translations (Beal 1884, Watters 1904) and the question is only whether a Kumbh is named |
| Persian | Khulasat-ut-Tawarikh | fa | 2 | See Category 4: unreadable |

## Category 9: The other side's record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Four state governments | UP (kumbh.gov.in, prayagraj.nic.in), Uttarakhand (haridwar.nic.in, garhwal.uk.gov.in), Maharashtra (nashik.gov.in, divcomnashik), Madhya Pradesh (mppcb DEP Ujjain; MP tourism page seen as a snippet only) | en | 8 | S04-S07, S19, S22, S24. They disagree on small points of the rule and the legend: conflicts.md K1-K4. India's nomination file (S02) disagrees with Uttarakhand's page on the river at Haridwar (K3). Madhya Pradesh's own Simhastha/Ujjain page for the rule was not opened (open question 3) |
| Neighbours | not applicable | - | - | No neighbouring country is involved |

## Category 10: Place names
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| UP Prayagraj Division; UNESCO; Maharashtra pages | current and old names | en | 4 | C034: Allahabad -> Prayagraj (gazette, 18 Oct 2018); UNESCO file still says Allahabad and Nasik (2017); Maharashtra pages say Nashik, UNESCO "Nasik", the 1883 gazetteer "Nasik". Haridwar (Hardwicke 1799: Hurdwar; UP gazettes: Hardwar; Uttarakhand: Haridwar). Trimbakeshwar (Maharashtra spelling). Kshipra (MP) / Shipra (PIB). Pronunciation: no authority opened; suggest "Pra-YAAG-raaj", "NAA-shik", "OO-jain", "Ha-ri-DWAAR" for the voice, to be confirmed by AK |

# CY03 Galwan and the LAC: search log (28 Oct 2026)

Researcher: Claude (research agent, one run). Topic: working title "Galwan Never Ended: Mapping the LAC Points Where India and China Still Face Off". Research only. Every search is listed, including those that found nothing or were blocked. Category numbers follow section 2 of `docs/geo/RESEARCH_RULES.md`.

Examined sources: 73 (67 kept in sources.jsonl; 6 examined and not kept as evidence: PIB copy of the Army statement of 8 Sep 2020 (same text as S13), a Yunnan forum reprint of the Chinese MFA text of the 36th WMCC, the Chinese MFA page on Hong Lei meeting the Indian Joint Secretary (27 May 2026), the UN Peacemaker index page for the 2005 Protocol, an Indian Embassy Beijing PDF that returned an error page, and OpenStreetMap Nominatim, used only as a finding aid and rejected as evidence)
Tier P kept: 65 (S01-S52 and S55-S66 are P1/P2; S67 is P3; S53 and S54 are tier S)
Saturation: yes. The last three documents opened (MEA remarks of the External Affairs Minister in Manila, 22 Jul 2026; MEA notice of the 25th SR talks, 24 Aug 2026; Chinese MFA transcript of 19 Feb 2021 re-read for the casualty question) added no new spine fact. The sweeps of MEA listings for "China", "Ladakh", "LAC", "Galwan" (all publication types) returned nothing newer than the items already read (latest: 16 Sep 2026 on the Pakistan-China boundary commission, not relevant; 13 Oct 2026 on Ladakh names, read). Items found late and which did add facts (kept as reminders that the topic is live): MEA 13 Oct 2026 response, MHA release of 2 Oct 2026, Chinese MFA transcript of 13 Oct 2026, Survey of India Ladakh map of 21 Sep 2026.

Tier X seen in search results and NOT used as evidence (listed so that nobody uses them by accident): Hindustan Times / PressReader reprints, The Quint, Deccan Herald, The Week, Business Standard, Morung Express, Tribune, Scroll, Onmanorama, TBS News, ETV Bharat, Daily Pioneer, IDRW, Factly, LogicallyFacts, Indian Defence Review, Wikipedia pages (Agreement on Military CBMs 1996), globalsecurity.org mirrors, Sputnik, impriindia.com, asianews.network, chronicleindia.in, GKToday, Stimson CBM handbook, Library of Congress blog, Delhi Policy Group PDF, USI Journal PDF, and the OpenStreetMap labels (which place the Galwan area under Chinese administrative names and so must not be used for borders or names). They were skimmed only to see which claims circulate (myths.md) or to find the address of an official text.

Access notes: MEA pages are loaded by script; the page text comes from MEA's own public endpoint `/FrontEnd/FetchPublicationDetailData?pkid=<id>` (the id is the number in the `dtl/<id>/` part of each MEA link). PIB, Survey of India, Chinese MFA and MND pages opened with an ordinary request. Nothing behind a CAPTCHA, login or paywall was opened; X (Twitter) cannot be read without logging in and was not tried further.

## Category 1: Official map and boundary record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Survey of India (surveyofindia.gov.in) | state maps page; "Ladakh State Map 3rd edition 2026" | en | 1 sheet | S63. The official sheet draws India's boundary and has no LAC entry in its legend (C018). Positions of Galwan River, Shyok, Depsang Plains, Gogra, Hot Spring, Kongka La, Pangong Tso, Chushul, Demchok read off it (method/soi_map_readings.md) |
| Survey of India | "Digital Data Register Ladakh 2025" PDF (listed by search) | en | 1 | not opened beyond the title; it is a data register, not a map |
| MEA / PIB | "no commonly delineated LAC" wording | en | 6 | S11, S26, S43 (2012, 2017 answers), S07 |
| MEA | 29 Sep 2020 reply to the Chinese statement on the "1959 LAC" | en | 1 | S14 |
| MHA / PIB | 28 place names on the Survey of India Ladakh map, 2 Oct 2026 | en | 1 | S44 |
| Natural Earth admin-0 India point of view (house file `sources/geo/ne_10m_admin_0_countries_ind.geojson`) | point-in-polygon of the placement points | - | 1 file | S64 (C085): Galwan, Demchok, Pangong, Leh inside India; a Yangtse point outside, so the outline cannot pin Yangtse |
| MHA | notification map of the two new Union Territories (search hit PIB 1590112, 2019) | en | 1 | not opened (not needed: the 2026 Survey of India sheet supersedes it) |

## Category 2: Measurements we make ourselves
| Dataset | Method | Output | Kept |
|---|---|---|---|
| Survey of India Ladakh map | reading by eye against the printed graticule on 150/200/300 dpi crops (calibration in method/soi_map_readings.md) | placement coordinates, tolerance +-0.05 degree | S63 -> C080, C083 |
| SRTM 30 m and ASTER GDEM 30 m (OpenTopoData API) | `method/geo_points.py` | method/geo_points_output.txt | S66 -> C081, C083 |
| Natural Earth lake polygon + SRTM | `method/pangong_lake_level.py` | method/pangong_lake_level_output.txt (median 4,241 m) | S66 -> C084 |
| Haversine distance | `method/geo_points.py` (R = 6371.0088 km) | Leh to Galwan confluence 87.4 km | C082 |
| Point-in-polygon on the house outline | `method/pip_check.py` | method/pip_check_output.txt | C085 |
| OpenStreetMap Nominatim | queries "Galwan Valley", "Galwan River", "Depsang Plains", "Demchok", "Gogra Post Ladakh", "Hot Springs Ladakh Kugrang", "Pangong Tso", "Yangtse Tawang", "Leh" | method/nominatim_finding_aid_raw.txt | NOT evidence. Used once, as an independent cross-check of the Survey of India readings for Galwan (2.3 km apart) and Demchok (5.2 km apart). No hit for Depsang Plains, Gogra Post, Hot Springs |
| NGA GeoNames Server (US gazetteer) | tried to download country gazetteer files | page script-driven, file URLs returned 404 | not used |
| Copernicus DEM tile / GDAL | planned as a third elevation source | no GDAL or numpy on this machine's default Python | not done (open_questions Q5) |

## Category 3: Treaties, gazettes, legal and official texts
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| UN Peacemaker (DPPA) | 1993 Agreement, 1996 CBM Agreement, 2005 Protocol (clean PDFs) | en | 3 | S01, S02, S03 |
| MEA Indian Treaties database | 1996 CBM (CH96B1124), 2005 Protocol (CH05B0642), 2012 WMCC Agreement (CH12B0194), 2013 BDCA (CH13B1134) | en | 4 | S04, S05; scans of 1996 and 2005 saved as second copies (OCR garbled) |
| MEA | 1993 Agreement on mea.gov.in | en | 0 found | the UN copy is used; open_questions Q7 |
| MEA Lok Sabha / Rajya Sabha answers 2020-2025 (listing for publication ids 61, 62, 51, 69 with keywords) | "Galwan", "LAC", "patrolling", "disengagement" | en | 11 | S18, S25, S29, S30, S31, S32 |
| MEA press releases | "India-China Border Affairs" (WMCC), "Special Representatives", "Corps Commander", "Gogra", "Pangong", "Kazan", "disengagement" | en | 100+ listings | S19, S21, S22, S27, S28, S33, S34, S35, S38, S39, S40, S41 |
| MEA speeches and statements | "China" (2026), EAM Lok Sabha statement 3 Dec 2024 | en | 1 key | S26, S46 |
| PIB / MoD | Defence Minister statements 15 Sep 2020, 17 Sep 2020, 11 Feb 2021, 13 Dec 2022; Year End Reviews 2020, 2024, 2025 | en | 7 | S11, S12, S17 (copy on a government consulate site; PIB original not found), S23, S16, S36, S37 |
| MEA | "firearms", "buffer", "Yangtse" keyword lists (all MEA publication types) | en | 0 relevant | nothing; "firing" hits were about fishermen. See C040, C066, C067 |
| Sansad / MoD parliament-replies search for "Patrolling Point 14", "buffer zones" | en | 0 relevant | open_questions Q3 |
| X (Twitter) | post attributed to the EAM (June 2020 per news; unverified) about carrying arms and firearms | en | not reachable | C040 UNVERIFIED |

## Category 4: Period records
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Internet Archive (Digital Library of India scan) | "Servant of Sahibs" (Ghulam Rassul Galwan, 1923) full text | en | 1 | S67. Searched for how the Galwan River or valley got its name: not stated (C086, myth M9) |
| Other period records (1962 period White Papers, Johnson/Macartney-MacDonald lines, colonial gazetteers of Ladakh) | not searched | - | - | skipped on purpose: the story is the 2020-2026 record and the research rules forbid drawing any border; recorded as open_questions Q8 if a long film is ever made |

## Category 5: Old maps
Not applicable to this Short: no border or line is to be drawn (C018, C010, C011), so dated historical maps of the line are not needed. The Survey of India sheet of 2026 (S63) is the only map used. If AK later wants a "how the line was drawn" story, old maps from the British Library or Library of Congress must be sourced then.

## Category 6: Archaeology and science
Not applicable (no excavation or species fact). Elevations are geodata (category 2).

## Category 7: Data owners for modern numbers
| Owner | Number | Kept |
|---|---|---|
| Government of India (PMO, Defence Minister, MoD) | Indian personnel killed, 15 Jun 2020: 20 | S10, S11, S16 (C033) |
| People's Republic of China (ministry site, state media) | Chinese losses: four (hedged) | S51, S52, S53 (C035, C070) |
| MEA | number of WMCC meetings (35, then 36th on 6 Aug 2026), SR rounds (24, then 25th on 25 Aug 2026) | S38-S42 |
| MoD (Indian Army section of the Year End Review 2025) | PLA "10 Combined Arms Brigade size forces" | S36 (C060) |
| Government of India | area claims (38,000 sq km in Ladakh) | in S11 and S26; deliberately NOT carried into claims.jsonl (not needed and sensitive) |

## Category 8: Original-language sources
The Chinese statements were read in the Chinese MFA's and MND's own English renderings (official translations). The Chinese-language originals exist on the same sites (e.g. fmprc.gov.cn Chinese transcript for 13 Dec 2022 was in the search results) but were not opened; the English text is the ministry's own. Hindi versions of the Indian statements exist (PIB offers them) and were not needed. Original-language names: Chinese "Jianan Daban" (S56) for the area India calls Gogra-Hot Springs (PP-15); "Banggong Co" for Pangong Tso (Natural Earth label, C084). No Tibetan or Ladakhi source consulted (open_questions Q8).

## Category 9: The other side's record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| China MFA | spokesperson transcripts 17, 19, 24 Jun 2020 on Galwan; 19 Feb 2021; 13 Dec 2022; 22 Oct 2024; 13 Oct 2026; 24th SR (10 points) and 25th SR readouts | en | 12 | S47, S48, S49, S50, S51, S57, S58, S60, S61, S62 |
| China MND | spokesman 19 Feb 2021; 10th corps commander joint release; Jianan Daban 29 Sep 2022; 31 Oct 2024 | en | 4 | S52, S55, S56, S59 |
| China MND website (China Daily and China Military Online articles) | Chinese casualty count | en | 2 | S53, S54 (tier S: state-media articles, not statements) |
| China MFA | Zhao Lijian press conference of 29 Sep 2020 ("only one LAC, 1959") | en | not found | Chinese text of the "1959 LAC" position not retrieved; India's record of it is S14 (open_questions Q6) |
| China MND / MFA | any official Chinese statement of troop numbers on the LAC after 2024 | en | 0 | nothing found |

## Category 10: Place names
| Name | Official spelling seen | Note |
|---|---|---|
| Galwan | "Galwan Valley" (MEA, PIB, Chinese MFA and MND); "Galvan valley" (MEA 17 Jun 2020 title); "Galwān River" (Survey of India sheet) | Pronounce GAL-wahn; spelling "Galwan" |
| Pangong Tso | "Pangong Tso (Brackish)" (Survey of India); "Pangong Lake" (Defence Minister); "Bangong Lake" (Chinese MND); "Banggong Co" (Natural Earth label) | |
| Gogra | "Gogra (Umlung)" on the Survey of India sheet; "Gogra" (MEA, Defence Minister); "Patrolling Point 17A" (MEA 6 Aug 2021); 2 Oct 2026 MHA list includes "Gogra" | |
| Hot Springs | "Gogra-Hot Springs (PP-15)" (MEA 2022); two "Hot Spring" labels on the Survey of India sheet; "Jianan Daban" (China MND for the same disengagement) | which spring is PP-15 is not stated in any text read (C083 note) |
| Depsang | "Depsang Plains" (Survey of India label), "Dopsang La" (pass on the same sheet); "Depsang" (MEA) | |
| Demchok | "Demchok" (Survey of India, MEA) | |
| Kongka La | "Kongka La" (Defence Minister; Survey of India) | no separate disengagement notice found for it |
| Yangtse | "Yangtse area of Tawang Sector" (Defence Minister) | not on the Ladakh sheet |
| Patrolling Point numbers | PP-15 and PP17A appear in MEA texts; PP14 does not (C066) | |

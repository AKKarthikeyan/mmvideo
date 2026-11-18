# W3-01-up Uttar Pradesh as a "country": search log (1 Nov 2026)

Researcher: Claude (research agent, one run). Topic: Week 3 day 1 AM, "Uttar Pradesh would be one of the world's biggest countries" (category Map is lying). Every search or fetch is listed, including ones that found nothing or were blocked. Category numbers follow section 2 of `docs/geo/RESEARCH_RULES.md`.

Examined sources: 16 (10 kept in sources.jsonl as S01-S10; 6 examined and not kept: MoSPI Table 3.8.1 wasteland page, the censusindia.gov.in catalog page 42613 (publicity efforts, irrelevant), the census.website tables and population-finder pages (load dynamically), OHRLLS pages (no list on the pages fetched), Pakistan Bureau of Statistics press release (connection refused), IBGE Brazil census pages (HTTP 403))
Tier P kept: 10 (S01-S10). No tier S used. Tier X seen in search-result snippets only (never opened, never used as evidence): Wikipedia pages, theglobalist.com, vividmaps.com, pagalguy, qz.com, pewresearch.org, unacademy, esrot.com, statisticstimes, thewire.in, ruralindiaonline, drishtiias, thesouthfirst, deccanherald, visionias, citypopulation.de, bolnews, dailypakistan, geo.tv.
Saturation: yes. The last three sources examined (S10 Census 2027 deck, then the PBS and IBGE pages, which could not be read, then OHRLLS) added only the 2027 reference date (S10) and nothing else; the three before them (S08, S09, S07) added the area cross-check and the landlocked list, which is why the run continued past them.

## Category 1: Official map and boundary record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| MMVideo house geodata | `sources/geo/ne_10m_admin_1_states_provinces.geojson`, feature iso_3166_2 = IN-UP | en | 1 | S06: UP polygon for area (C022) and distance to the sea (C017). Natural Earth, not Survey of India; Survey of India's state outline was not opened (open_questions.md #1) |
| MMVideo house geodata | `sources/geo/ne_10m_admin_0_countries_ind.geojson` (India point of view) | en | 248 features | S05: countries for area comparison; India outline for the coast test |
| (none needed) | Survey of India / MEA | | | No disputed border is part of this story. UP's boundaries are with other Indian states and with Nepal. If the full India outline is shown behind it, use the IND file (house rule). UP's border with Nepal is an international border on the official map; no side-taking needed |

## Category 2: Measurements we make ourselves
| Dataset | Method | Output | Kept |
|---|---|---|---|
| WPP 2024 + NCP projection + Census | `method/rank_population.py`: rank UP among 237 countries/areas, Census 2011, NCP 2011/2026/2036; one year, one basis | `method/rank_population_output.txt` | S03 -> C008, C009, C010 |
| WPP + NCP + Census + WDI | `method/derived.py`: sensitivity (UP share x UN India), margins, area ratios, density, LLDC maxima | `method/derived_output.txt` | C009, C011, C014, C015, C016, C018, C021 |
| WDI surface area + WPP ISO3 list | `method/rank_area.py`: UP area rank among 215 countries | `method/rank_area_output.txt` | S04 -> C012 |
| Natural Earth admin-0/admin-1 | `method/area_ne.py`: spherical-area of UP and countries (authalic sphere) | `method/area_ne_output.txt`, `area_ne_output.json` | S05/S06 -> C013, C015, C022 |
| Natural Earth admin-0/admin-1 | `method/landlocked_check.py`: UP vertices to India's sea-coast vertices, haversine | `method/landlocked_check_output.txt` | C017 |
| Census A-01 xlsx | `method/census_a01_extract.py`: INDIA and UP rows | `method/census_a01_extract_output.txt` | S01 -> C001-C005 |

## Category 3: Treaties, gazettes, legal and official texts
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| web search | Census Act / Census 2027 reference date 1 March 2027, gazette, houselisting | en | 15 snippets | One PIB-hosted official deck read (S10). Gazette PDF itself not opened. News and explainer pages (thewire, thesouthfirst, drishti, visionias, deccanherald) seen in snippets only, tier X, not used |
| (not applicable) | treaties | | | None for this story |

## Category 4: Period records
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| censusindia.gov.in NADA | `?sk=Uttar+Pradesh+provisional+population+totals` | en | 6 | Only 1971/1981/1991 provisional totals appeared; not needed. UP's 2000 split (Uttarakhand) is why 2011 UP is smaller than the old UP; not researched because it does not change the Short |

## Category 5: Old maps
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| (skipped) | | | | Skipped on purpose: the Short compares today's sizes. No historical map is needed. Reason logged |

## Category 6: Archaeology and science
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| (skipped) | | | | Not applicable to a population/area comparison. Logged |

## Category 7: Data owners for any modern number
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Census of India (NADA catalog) | search "Census 2011 Uttar Pradesh" collection census-2011 | en | 15+ | Found A-01 (catalog 42526); downloaded the xlsx (S01) |
| censusindia.gov.in old paths | 2011-prov-results/data_files/... PDFs; 2011census/PCA... xlsx | en | 404 | Dead; the NADA catalog is the current home |
| National Commission on Population / MoHFW | Technical Group projections 2011-2036 | en | 1 report (268 pp) | S02. The original mohfw.gov.in address returned no response to curl; used a mirror of the same PDF (disclosed in sources.jsonl; the report text itself carries the NCP/MoHFW name and date) |
| UN DESA Population Division | WPP 2024 TotalPopulationBySex csv.gz | en | 1 | S03. Looked for a WPP 2026 edition: search said the next one is expected later (postponed to 2027, one secondary report); WPP 2024 is the latest edition read |
| World Bank API (FAO data) | AG.SRF.TOTL.K2 2021 | en | 264 values | S04 |
| UP Department of Planning | UP in Figures / At a Glance 2022 | en | 1 | S07 |
| MoSPI | State-wise geographical area; found Table 3.5.3 (source ISFR 2009) | en | 3 | S08; Table 3.8.1 not kept (older district sums) |
| Pakistan Bureau of Statistics | 2023 census press release, `pbs.gov.pk/.../Press Release.pdf` | en | 0 | UNREACHABLE: connection refused from this network (curl and WebFetch). Search snippets give 241.49 million; tier X, not used. Logged for the checker |
| IBGE (Brazil) | Censo 2022 panorama, agency news | pt/en | 0 | UNREACHABLE: HTTP 403. Snippets give 203,080,756 (reference 31 July 2022), not used as evidence |
| UN OHRLLS | landlocked developing countries list | en | 0 | The OHRLLS pages fetched had no list (one 404, one news index). Used UNCTAD's list page (S09) instead |
| Lok Sabha / ECI | UP's 80 of 543 seats | en | 0 | Dropped: not part of this brief; snippets only, tier X. Logged in open_questions.md |

## Category 8: Original-language sources
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| IBGE (Portuguese) | Censo 2022 | pt | 403 | See above. Not needed for UP itself. Hindi name: Uttar Pradesh (उत्तर प्रदेश) is the Census/state name |

## Category 9: The other side's record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Pakistan Bureau of Statistics; IBGE; Nigeria's NPC | each country's own census | en/pt | 0 | The countries UP is compared with are read in UN DESA's harmonised estimates (S03), not in their own censuses (PBS and IBGE unreachable; Nigeria's last census is not read, open_questions.md #2). No border or dispute is involved |

## Category 10: Place names
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Census A-01 (S01) | state name and code | en | 1 | "UTTAR PRADESH", state code 09. Official English spelling "Uttar Pradesh"; say "UT-tar pra-DESH" for voice, stress on the last syllable of Pradesh. UN names kept as in WPP ("United States of America", "Russian Federation") but spoken as "the United States", "Russia" |

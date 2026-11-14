# W3-03 Baarle (Belgium/Netherlands): search log (1 Nov 2026)

Researcher: Claude (research agent, one run). Topic: "Baarle: the town where the border runs through cafes" (Indica Atlas Week 3, global audience). Categories follow section 2 of `docs/geo/RESEARCH_RULES.md`.

Examined sources: 18 (17 kept in sources.jsonl; 1 examined and not kept: a second Belgian Chamber PDF, `K21051850`, which has no Baarle text)
Tier P kept: 14 (S01-S14); tier S: 2 (S15 Franckx, S16 Wortel); tier X: 1 (S17 Visit Baarle, myths only)
Saturation: yes. The last three sources examined (S13 ICJ summary, S16 Wortel, the second Chamber PDF) added no new spine fact; the Wortel article added only the disputed fate of the 1892 bill (K3). The three before them (S05, S06, S07) did add C014-C016, which is why the run went past them.

Tier X seen in search results and NOT used as evidence: Wikipedia (Baarle, Baarle-Nassau, Baarle-Hertog), omroepbrabant.nl, dutchnews.nl, bigthink.com, atlasobscura.com, travelbook.de, linkiesta.it, slate.fr, lonelyplanet.com, expatica.com, brusselstimes.com, wolfstad.com, barrysborderpoints.com, citymonitor.ai, voicemap.me, vrt.be news, bnnvara.nl, FOTW flags page, ontology.buffalo.edu (Smith, "Baarle" page, personal/academic site, not opened), dutchgenealogy.nl, Czech photo gallery denik.cz. Visit Baarle (S17) opened for what the tourist board claims only.

## Category 1: Official map and boundary record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| PDOK / Kadaster BRK Bestuurlijke Gebieden | gemeentegebied, naam=Baarle-Nassau, EPSG:28992 and CRS84 | - | 1 feature, 9 parts | S09 -> C001-C004, C017 |
| Digitaal Vlaanderen VRBG Refgem WFS | NAAM='Baarle-Hertog', EPSG:31370 and 4326 | - | 1 feature, 26 parts | S10 -> C001-C003, C017 |
| Natural Earth ne_10m_admin_0_countries_ind (house geodata) | not needed for the enclave map (country scale only; no enclaves at 1:10m) | - | - | Use only for the Europe locator; the enclave map must come from S09/S10 |
| Survey of India / MEA | not applicable: no Indian border or disputed area in this topic | - | - | logged as not applicable |

## Category 2: Measurements we make ourselves
| Dataset | Method | Output | Kept |
|---|---|---|---|
| Kadaster gemeentegebied | `method/count_enclaves_pdok.py`: parts, holes, areas, perimeters | `method/count_enclaves_pdok_output.txt` | C001, C002 |
| Kadaster gemeentegebied | `method/enclave_geometry_pdok.py`: which Dutch piece sits in which hole; ring lengths | `method/enclave_geometry_pdok_output.txt` | C003, C004 |
| Flemish VRBG Refgem | `method/count_enclaves_flanders.py` | `method/count_enclaves_flanders_output.txt` | C001, C003 |
| both | `method/compare_nl_be_areas.py`: match 22 holes to 22 Belgian parts by area | `method/compare_nl_be_areas_output.txt` | C002 |
| Kadaster BAG pand + boundary ring | `method/buildings_on_border.py`: footprints properly crossed by the H1 ring (tolerance 0.3 m) | `method/buildings_on_border_output.txt` | C021 (UNVERIFIED: tolerance-sensitive) |
| Area of the enclaves, 249 ha 55 a 25 ca (PV) | not recomputed: our hole areas sum to 246.66 ha but include the 7 Dutch pieces inside; the PV figure's basis is unknown | - | not used |

## Category 3: Treaties, gazettes, legal and official texts
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| wetten.overheid.nl BWBV0006026 | consolidated 1843 convention (French + Dutch), Articles 1 and 14 | fr, nl | full text | S04 -> C005-C008 |
| Overheid.nl treaty database 001294 | 1843 agreement and its child treaties | en | 1 | S02 -> C005 (child list: 1847, 1869, 1888, 1905, 1974, 1976, 1981, 1993, 2016; no 1995 entry) |
| Overheid.nl treaty database 002268 | 1974 report | en | 1 | S03 -> C009 |
| Tractatenblad 1974, 188 (officielebekendmakingen.nl) | text of the 1974 PV rules, notes on 1843 | nl | 9 pages | S01 -> C005, C007, C009, C019 |
| Tractatenblad 1995, 18 (officielebekendmakingen.nl) | surfaced by search as a possible 1995/6 instrument | nl | HTTP 403 | not read; logged unreachable |
| Moniteur belge 26 June 1996 pp. 17565-17594 (ejustice.just.fgov.be) | the 1995 procès-verbal | fr | HTTP 500 on the summary page; search found no copy | not read; C010/C011 stay SECONDARY-ONLY |
| ICJ judgment 20 June 1959 (api.icj-cij.org, www.icj-cij.org PDF) | judgment text | en, fr | Cloudflare bot check ("Just a moment..."); browser pane stopped at it; not bypassed | S13 read through ICJ web-page OCR via WebFetch only |
| Belgian Chamber document 197 and dossier 19K0197 | 1892 convention bill | fr | 2 | S05, S06 -> C014-C016 |

## Category 4: Period records
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Belgian Chamber, Expose des motifs on the 1892 convention (S05) | the history from 1841 to 1892, commission reports of 1846, 1865, 1875-76, 1882 | fr | 1 | S05 -> C014, C015; also records the 1856 date by which the cadastre could assign parcels |
| Tweede Kamer Bijlagen 1894-95, 1895-96 | bills approving the 1892 agreement | nl | 2 index pages | S07, S08 -> C014, C018 |
| Procès-verbal of 29 Nov 1836 / 22 Mar 1841 (communal record) | quoted inside the 1843 convention and ICJ papers | nl, fr | quoted in S15 notes only | not opened as a document |

## Category 5: Old maps
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Popp, Atlas cadastral parcellaire de la Belgique 1842-1879 (metadata.vlaanderen.be) | surfaced by search for Baarle | nl | 1 record | listed, not opened (map would only illustrate; no claim depends on it). Open question |
| 1843 plan (four sheets 1:10,000, two sheets 1:2,500) | annexed to the 1843 convention | fr | not found online | Article 1 describes it (C006); the sheets themselves not found. Open question |

## Category 6: Archaeology and science
Not applicable. No excavation or species claim in this topic. Logged as skipped for that reason.

## Category 7: Data owners for modern numbers
| Dataset | Query | Kept |
|---|---|---|
| Kadaster BAG (buildings) via PDOK | footprints in the bbox of H1 | S11 -> C021 (UNVERIFIED) |
| Kadaster BAG catalogue | definition of bijeenkomstfunctie | S12 -> C020 |
| Population (CBS / Statbel) | not searched: no population figure is needed for the Short and the 1995 figures (2,072 and 5,900 inhabitants) come only from Franckx | skipped on purpose |

## Category 8: Original-language sources
French (1843 convention, Chamber document 197, Franckx quotes), Dutch (Tractatenblad, Tweede Kamer, municipality page, Wortel). All quotes in claims.jsonl keep the original with an English translation. Dutch and French names used: Baarle-Hertog / Baerle-Duc / Baarle-Duc.

## Category 9: The other side's record
| Side | Record | Kept |
|---|---|---|
| Netherlands | Tractatenblad, treaty database, Tweede Kamer annexes, Kadaster geodata, municipality page | S01-S04, S07-S09, S11, S12, S14 |
| Belgium | Chamber document 197 and dossier, Flemish geodata, Moniteur belge (via Franckx) | S05, S06, S10, S15 |
| Both texts of one treaty | French original + Dutch version of the 1843 convention | S04 |
| Baarle-Hertog municipality site (baarle-hertog.be/30-enclaves) | connection refused (ECONNREFUSED) from curl, WebFetch and the browser pane; search snippets said 22 + 7 + 1 | not read; logged unreachable |

## Category 10: Place names
| Name | Source |
|---|---|
| Baarle-Hertog (Flemish/Dutch), NIS 13002 | S10 |
| Baerle-Duc / Baarle-Duc (French, Belgian official texts) | S04, S05, S15 |
| Baarle-Nassau, GM0744 | S09 |
| Pronunciation | not found in a primary source; open question for the voice |

## Searches (web)
| # | Date | Engine | Query (short) | Hits | Kept |
|---|---|---|---|---|---|
| 1 | 2026-11-01 | WebSearch | Baarle enclaves 1995 protocol boundary commission treaty text | ~18 | S15 (Franckx), S01, trb 1974; all tourism/news dropped |
| 2 | 2026-11-01 | WebSearch | Kadaster Baarle grens enclaves grensverdrag 1995 tractatenblad | ~18 | confirmed no Tractatenblad entry for 1995 surfaced |
| 3 | 2026-11-01 | WebSearch | Traite de limites Maestricht 1843 Baerle-Duc texte | ~16 | ICJ pages, dekamer.be; date 8 Aug 1843 |
| 4 | 2026-11-01 | WebSearch | Proces-verbaal afbakening enclaves 1995 Tractatenblad | ~18 | nothing new |
| 5 | 2026-11-01 | WebSearch | Belgisch Staatsblad proces-verbaal 1995 22 enclaves | ~18 | nothing new |
| 6 | 2026-11-01 | WebSearch | Moniteur belge 26 juin 1996 PV enclaves | ~16 | no copy of the PV found |
| 7 | 2026-11-01 | WebSearch | grens loopt door cafe restaurant huis gemeente | ~18 | no official source; M1 |
| 8 | 2026-11-01 | WebSearch (domain-limited) | kadaster.nl Baarle enclaves | 10 | municipality pages; PDOK |
| 9 | 2026-11-01 | WebSearch (domain-limited) | Baarle gemeente 24 delen enclaves | 10 | Visit Baarle (X) |
| 10 | 2026-11-01 | WebSearch | verdrag 1892 Baarle Castelre Ulicoten niet bekrachtigd | ~18 | S05 found; dbnl Wortel (S16); Tweede Kamer annexes |
| 11 | 2026-11-01 | WebSearch | Handelingen Tweede Kamer 1897 wetsontwerp 1892 Baarle | ~18 | S08; outcome not found |
| 12 | 2026-11-01 | WebSearch (domain-limited) | visitbaarle cafe restaurant border through building | 10 | no cafe confirmed; cultural centre (tourism) |
| 13 | 2026-11-01 | WebSearch | BAG catalogus bijeenkomstfunctie | ~18 | S12 |
| 14 | 2026-11-01 | WebSearch (domain-limited) | Overheid treaty database / Tractatenblad / ejustice 1995 PV | 10 | wetten.nl BWBV0006026 (S04); no 1995 instrument |
| 15 | 2026-11-01 | WebSearch | etaamb Baerle-Duc enclaves 1996 | 10 | nothing new |

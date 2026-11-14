# W3-04-myson "Why Vietnam's My Son has Hindu temples": search log (1 Nov 2026)

Researcher: Claude (research agent, one run). Topic: Indica Atlas Week 3, topic W3-04-myson, flagged sensitive (religion). The pitch is a claim to test. Category numbers follow section 2 of `docs/geo/RESEARCH_RULES.md`.

Examined sources: 15 (13 kept in sources.jsonl: S01-S12 and S14; 2 examined and not kept: the OCR of Coedes and Parmentier's 1923 "Listes generales" (unusable OCR of the tables) and InforMEA's mirror of the 1999 decision (same text as S03))
Tier P kept: 12 (S01-S07, S09-S12, S14, with S09 and S14 tier P1); S08 (Majumdar 1927) is tier S, used only for translations and as a map to the inscriptions.
Saturation: yes. The last three sources examined (S11 Embassy heritage page, S12 My Son board news item, the InforMEA mirror) only corroborated S10 and S03 or added one small figure (US$ 2.25 million, C029) and one discrepancy (5 vs 6 years, K5). Extra searches for a 2014 MoU text, the Cham Hindu population and a Chinese-history primary added nothing usable (logged below as gaps).

Tier X seen in search results and NOT used as evidence: Wikipedia pages (Vo Canh inscription, Sanskrit inscriptions in Maritime Southeast Asia, Hinduism in Vietnam, Louis Finot), oxalisadventure.com, localvietnam.com, lesandshotel.com, ecured.cu, travel and tour sites, seasia.co, historyrise.com, offroadvietnam.com, joshuaproject.net, holylandvietnamstudies.com, vietnamparadisetravel.com, a Statesman news tag page, Hinduism Today, news pages on the ASI work (qdnd, vietnamnews, thanhnien, vnexpress, baomoi: found through links on S11, not opened).

## Category 1: Official map and boundary record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| MMVideo house geodata | `sources/geo/ne_10m_admin_0_countries_ind.geojson` (Natural Earth, India point of view), copied to `sources/` | en | 1 | S09, used by method/distances.py (C030-C032) |
| UNESCO property page | whc.unesco.org/en/list/949/ (browser) | en | 1 | S02: coordinate (C002), area 142 ha and buffer zone 920 ha (C033). The nomination cover sheet prints a different coordinate (K1) |
| (none needed) | Survey of India / MEA | | | No disputed border is part of this story. The only borders on screen would be the Indian coast (house outline) and Vietnam's coast. The sea off Vietnam is named differently by Vietnam and others: avoid labelling it (open_questions.md, wording risks) |

## Category 2: Measurements we make ourselves
| Dataset | Method | Output | Kept |
|---|---|---|---|
| NE IND outline + UNESCO coordinate | `method/distances.py` (haversine, nearest vertex); `method/coord_check.py` (the two published coordinates are 57 km apart, both inside Vietnam's outline) | `method/distances_output.txt` | S14 -> C030 (Andamans 1,509 km), C031 (Odisha 2,337 km; 13 N coast 3,006 km), C032 (Vietnam coast 27 km) |
| Saka-era conversion | Saka year + 78 = CE, the rule ISAW applies to C. 75 (913 -> 991) and C. 87 (609 -> 687); we applied it to Finot's 579 (-> 657, matches Majumdar) and 797 (-> 875, matches Finot's own equivalent) | in claim notes | C012, C013, C017, C023 |

## Category 3: Treaties, gazettes, legal and official texts
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| UNESCO World Heritage Committee | 23rd session report (decision on My Son), file whc-99-conf209-22e.pdf | en/fr | 1 | S03 -> C003, C004, C005 |
| UNESCO | Nomination file 949 (State Party Viet Nam), uploads/nominations/949.pdf | en | 1 | S04 (OCR) -> C009, C010, C012, C014, C016, C035 |
| UNESCO | ICOMOS Advisory Body Evaluation 949 (archive/advisory_body_evaluation/949.pdf) | en/fr | 1 | S01 |
| Embassy of India, Hanoi | press release 20 Dec 2022 (browser) | en | 1 | S10 -> C027-C029 |
| Embassy of India, Hanoi | Heritage Conservation Cooperation page (browser) | en | 1 | S11 -> C029 |
| WebSearch (mea.gov.in, pib.gov.in, asi.nic.in, indembassyhanoi.gov.in) | "India Vietnam MoU conservation restoration My Son ... 2014" | en | 10 | the 2014 MoU text itself was not found; only the Embassy's statement that it exists (C029). Snippets mention a 2024 PM statement and a 2020 Joint Vision naming "F block": not opened (open_questions.md) |
| whc.unesco.org/en/decisions/2638 and /document/164774 via WebFetch | decision page and Periodic Report | en | 0 | HTTP 403 (Cloudflare). Not passed. The same decision text was read in the PDF report (S03) and on InforMEA |

## Category 4: Period records (inscriptions, administrative accounts, explorers)
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| archive.org advanced search | titles "Bulletin de l'Ecole francaise d'Extreme-Orient", "Ancient Indian colonies in the Far East", "Inscriptions du Champa" | fr/en | 12+ | BEFEO 1904 volume (dli.ministry.10703) -> S05; Majumdar 1927 (dli.ministry.09209) -> S08; Coedes-Parmentier 1923 Listes generales (in.ernet.dli.2015.69442) examined, OCR of the tables unusable, not kept |
| WebSearch | "persee BEFEO Finot Notes d'epigraphie Mi-son inscription Bhadravarman Bhadresvara" | fr/en | 10 | found the Persee record of Finot 1904 (XI. Les inscriptions de Mi-son); Finot 1915 PDF copy at cdn.angkordatabase.asia -> S06 |
| Persee | docAsPDF of Finot 1904 | fr | 0 | altcha bot-check page. Not passed. Read the archive.org scan of the same volume (S05) |
| WebSearch | "Vo Canh inscription earliest Sanskrit ... date" | en | 10 | scholars' dates range from the 2nd-3rd century to about 400 CE (search snippets, tier X/S, not used); Finot 1915 (S06) used for the content of the text; its date is not narrated |
| Chinese dynastic histories (Linyi, Fan Hu-da) | not opened | zh | | Majumdar summarises them and Maspero's identification of Fan-Hou-ta with Bhadravarman as "probable but not certain" (C012 note). Primary not opened; logged as a gap |

## Category 5: Old maps
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| (not searched) | Parmentier's plans in the Inventaire descriptif des monuments cams (1909-18) | fr | | The A-H lettering of the groups is described in ICOMOS (S01) and UNESCO (S02), which is all the Short needs. No border or place name depends on an old map. Parmentier's Inventaire is borrow-only on archive.org (inventairedescri0000henr): not opened |

## Category 6: Archaeology and science
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| ASI conservation reports | Embassy press release (S10): A10 linga, A13 idol and yoni pitha | en | 1 | C028. The ASI booklet (Dec 2022) on the Embassy site returned HTTP 403 to curl and was not opened |
| ICOMOS / UNESCO site descriptions | E1 had wood, A10 before 875, 1969 bombing | en | 2 | C014, C015, C034 |
| WebSearch | "ASI conservation My Son temples Vietnam Group K ..." | en | 10 | led to S10, S11, S12; other hits are news items (tier X, not used) |
| Peer-reviewed papers on Cham archaeology | not searched | | | The Short does not depend on dating a single brick; excavation results (Quang Nam, Tra Kieu, Hoa Lai) are listed as a gap |

## Category 7: Data owners for modern numbers
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| UNESCO WHC | 71 monuments, 142 ha, 920 ha buffer | en | 1 | S02 -> C033 |
| WebSearch | "Cham population Vietnam 2019 census religion Brahmanism Ba La Mon ... General Statistics Office" | en | 20 | No GSO table opened; snippets (tier X) give conflicting Cham totals (167,729 vs 178,948) and a Hindu figure from a tertiary source. NOT USED. The Short need not say how many Cham Hindus there are today. Listed in open_questions.md |
| Embassy of India | outlay US$ 2.25 million | en | 1 | S11 -> C029 |

## Category 8: Original-language sources
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| EFEO / ISAW Corpus of the Inscriptions of Campa | index, list of 49 inscriptions, C. 75, 79, 80, 86, 87, 97 (Sanskrit and Old Cam with English translation) | san/oldcam/en | 6 | C. 75, 79, 87 -> S07 -> C019-C021. C. 80, 86, 97 downloaded, not used |
| BEFEO 1904 (Finot) | Sanskrit text and French translation of the Mi-son steles | san/fr | | S05 -> C011-C014, C017, C018, C023 |
| My Son board news item (Vietnamese) | handover of K, H, A groups | vi | 1 | S12 -> C027 |
| Coedes, Inscriptions du Champa / Indianized States | archive.org | fr/en | | The Indianized States item is borrow-only (HTTP 401 on the text). Not circumvented. The EFEO's Coedes edition is not online |

## Category 9: The other side's record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Viet Nam's own nomination dossier | S04 | en | 1 | Viet Nam's own account of why the site exists, plus its admission that Cham history has "a lot of vacuum" (C035) |
| My Son Management Board (Viet Nam) | S12 | vi | 1 | the Vietnamese record of the ASI handover (C027) |
| Government of India | S10, S11 | en | 2 | India's own account of its role and its phrase "confluence with India" (interested party) |
| Cham community voices | not searched | | | No source from a Cham organisation was opened. Listed as a gap and wording risk |

## Category 10: Place names and spellings
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| UNESCO / ICOMOS | "My Son (the name in Vietnamese means 'Beautiful Mountain')" | en | | S01. Vietnamese Mỹ Sơn; older French Mi-sơn (Finot 1904), Mi-son, Myson (Majumdar), Mĩ Sơn |
| ISAW | Old and Sanskrit forms | | | Bhadreśvara (Sanskrit, "Lord of Bhadra[varman]" is Majumdar's reading, C011 note), Prakāśadharman, Īśānabhadreśvara, Cambhubhadreśvara; Cham (people), Champa (kingdom, Sanskrit Campā) |
| Pronunciation | not sourced | | | No source gives a pronunciation of Mỹ Sơn. Voice: AK/voice owner to choose; suggested English rendering "mee sun" is OUR guess, not sourced |

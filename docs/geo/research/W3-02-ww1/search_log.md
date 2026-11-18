# W3-02-ww1 Why over a million Indians fought in World War One: search log (1 Nov 2026)

Researcher: Claude (research agent, one run). Topic: Week 3 No. 2, "Why over a million Indians fought in World War One" (flagged sensitive: colonial history). Every search is listed, including the ones that found nothing or were blocked. Category numbers follow section 2 of `docs/geo/RESEARCH_RULES.md`.

Examined sources: 16 opened (12 kept in sources.jsonl: S01-S12; 4 opened and not kept, listed below); 3 more were found and left unopened (Omissi 1999 lending copy, TNA WO 95/3926, British Library IOR/L/MIL/5/825 scans)
Tier P kept: 12 (S01-S12; S11 is a volunteer transcription of British Library records and is hedged; the original was not opened)
Saturation: yes for the figures: after S01 and S02 (the two owners of the numbers) the next sources only re-stated or disputed totals (S03-S06, CWGC), and the last three kept sources (S09 Indian Corps history, S11 censor extracts, S12 geodata) added no new number. S08 (Mesopotamia Commission) and S02 pp.242, 224 and 166 added the "why" claims (C014, C017-C019).

Examined and NOT kept (reason): Gandhi Heritage Portal, Collected Works vol. 14 (the viewer pages returned only a quotation and no document text; unreachable as text); CWGC Delhi Memorial page `cwgc.org/visit-us/find-cemeteries-memorials/cemetery-details/2043900/...` (403 / Azure WAF bot check, not bypassed); CWGC "Three CWGC memorials" blog (only repeats names counts, adds nothing; copy saved as sources/cwgc_three_memorials.txt); CWGC "who we commemorate" URL (404); plus the search-result pages named under Tier X below. (Note: the OCR text of the tables in S01 and S02 was unusable; every table figure used was read from the page image, listed in the claims.)

Tier X seen in search results and NOT used as evidence: Wikipedia (I Corps British India page), pwonlyias.com, prepp.in, iasbaba.com, brainscape, educationprovince.com, marxists.org (Clemens Dutt, Judd), tribune.com.pk, arabnews.com, defencejournal.com, brownpundits.com, mainstreamweekly.net, thewire.in, historynewsnetwork.org, asiasamachar.com, easterneye.biz, batleynews.co.uk, ufvcascade.ca, mahmoodawan.com, southasianbritain.org, longlongtrail.co.uk, cityofparramatta.nsw.gov.au blog, history-pas-de-calais.com, croixdeguerre-valeurmilitaire.fr, livreshebdo.fr, hal.univ-reunion.fr, nishaannagaara.com, fibis wiki, gre.ac.uk, standardebooks.org and mkgandhi.org (Gandhi's autobiography, a later recollection, not opened as evidence), franpritchett.com, transcend.org. These were skimmed only for the claim list in myths.md.

## Category 1: Official map and boundary record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| MMVideo house geodata | `sources/geo/ne_10m_admin_0_countries_ind.geojson` (Natural Earth, India point of view) | en | 1 | S12. House outline for any India map. No border is the subject of this story |
| (none needed) | Survey of India / MEA | | | Not applicable beyond the house outline. Do NOT draw the 1914 Indian Army's old frontiers or any pre-1947 India as a border. Show theatres as pins on Natural Earth countries (Iraq, France, Egypt, Kenya, Tanzania) only |

## Category 2: Measurements we make ourselves
| Dataset | Method | Output | Kept |
|---|---|---|---|
| S01 table 3, S02 p.177 table, S02 p.278 table, S10 Subsidiary Table III | `method/ww1_numbers.py` blocks A-F: shares, ratios, checks that the printed rows sum to the printed totals | `method/ww1_numbers_output.txt` | C004, C005, C007, C008, C009 |
| Natural Earth 10m populated places | `method/ww1_numbers.py` block G: haversine great-circle between city points | same output | C023 (not sea routes) |
| Sea route distance (Bombay to Marseilles via Suez) | not computed | | No official geodata for shipping lanes in the repo; would need a P1 nautical source. Skipped, not needed for the claims |

## Category 3: Treaties, gazettes, legal and official texts
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| UK Hansard (historic-hansard) | Montagu 20 Aug 1917 declaration (via WebSearch, allowed_domains parliament.uk) | en | 8 | S07 (6 Aug 1918 speech quotes the 20 Aug 1917 text). The 20 Aug 1917 sitting itself was not in the results |
| CWGC | eligibility criteria for commemoration; "4 August 1914" "31 August 1921" | en | 10 | S06 |
| UK Parliament | Mesopotamia Commission report (archive.org search by title) | en | 1 | S08 |
| Government of India Act / King's Declaration of war on India's behalf | not searched | | Open question: who in law brought India into the war (open_questions.md) |
| Indian National Congress 1914 Madras session report | archive.org title search; WebSearch | en | 0 on archive.org | Not found as a document. WebSearch said the report exists in a digital archive; not located. Open question |

## Category 4: Period records
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| archive.org | "Statistics of the military effort of the British Empire during the Great War" | en | 3 (statisticsofmili00grea, b32171407, dli copy) | S01 (Toronto scan). Page images read for pp.237 and 777 |
| archive.org | "India's contribution to the Great War" | en | 1 (in.ernet.dli.2015.32085) | S02 |
| archive.org | "The Indian Corps in France" | en | 6 | S09 (indiancorpsinfra00ltco) |
| archive.org | Census of India 1911 / 1921 Vol I | en | 3 | S10 (1921 Part I Report). 1911 Part II tables: djvu text 404, not pursued |
| archive.org | "Indian Voices of the Great War" (Omissi, 1999) | en | 1 (borrow-only) | Not opened (secondary, lending copy). Its footnotes point to the British Library censor reports |
| New Forest Remembers / British Library | "Reports of the Censor of Indian Mails in France IOR/L/MIL/5/825" | en | 15 | S11 (volunteer transcription of the British Library reports). The British Library scans not opened |
| gandhiheritageportal.org | Gandhi's April 1918 letter to the Viceroy and recruiting appeal (CWMG vol. 14) | en | 5 portal links | Not kept: viewer pages gave no document text |
| qdl.qa / British Library India Office Records | IOR/L/MIL/5/825 | en | 0 usable | Not opened |
| The National Archives (UK) | WO 95/3926 "Welcome for the Indian troops in Marseilles" | en | catalogue page seen in search | Not opened. Listed as a lead |
| Hardinge's 8 Sep 1914 speech | inside S02 pp.66-67 | en | 1 | C015 |

## Category 5: Old maps
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| British Library / India Office Records | map of Indian Expeditionary Forces theatres 1914-1918 | en | 10 (FIBIS wiki, USI journal, none a map) | None kept. No dated map of the theatres reached. We draw the pins from Natural Earth instead; no old map is shown, so no old border risk |

## Category 6: Archaeology and science
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| | | | | Not applicable: no excavation or species claim. Logged as skipped on purpose |

## Category 7: Data owners for any modern number
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| CWGC web pages | Indian dead, Neuve-Chapelle, India Gate, "5 facts" (web search with allowed_domains cwgc.org, then page fetches) | en | 10 | S03, S04, S05 (S06 for dates) |
| CWGC casualty database | `cwgc.org/find-records/find-war-dead/search-results/?...` | en | 403 | Not reached (403). Open question: ask CWGC for a count by service "Indian Army", dates, and country of commemoration |
| Census Commissioner of India | 1921 population by province | en | 1 | S10 (C009) |
| Punjab war registers (Punjab Government, 320,000 names) | web search | en | news items only | Not kept: news. The registers themselves are in the Lahore Museum, via a UK project; not opened |

## Category 8: Original-language sources
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| web search (French) | "troupes indiennes arrivée Marseille septembre 1914 Corps expéditionnaire indien archives Gallica Petit Marseillais" | fr | 15 | None kept. Found a French defence-ministry archive item and croixdeguerre-valeurmilitaire.fr (secondary). Gallica was not reached. French date 26 Sept 1914 agrees with C010 in a snippet only |
| Urdu / Hindi / Gurmukhi originals of the soldiers' letters | | | | The originals are lost or sit in the British Library; S11 gives only the English the censor wrote. Said plainly in C021 |

## Category 9: The other side's record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| web search | "Pakistan official figure Indian Army First World War soldiers Punjab recruited ... ISPR OR Bangladesh National Archives" | en | 17 | No official Pakistan or Bangladesh figure found; only news and commentary (Tier X). Logged. Nepal's count (58,904) is in S02 |
| web search (French) | French record of the arrival | fr | | see Category 8 |
| German or Ottoman records of Indian prisoners | not searched | | | Out of scope for this Short |

## Category 10: Place names
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Natural Earth populated places | Basra, Marseille, Mumbai, Karachi, Mombasa | en | 5 | S12: current names (Basra, Iraq; Marseille, France). Period names in the sources: Mesopotamia, Marseilles, Neuve Chapelle (S09 spells it without a hyphen), Busra not used. CWGC spells "Neuve-Chapelle". Pronunciation of Neuve-Chapelle and Marseille for the voice: not verified here; ask the voice step for a check |

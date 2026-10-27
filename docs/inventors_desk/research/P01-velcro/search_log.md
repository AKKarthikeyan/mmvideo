# P01 Velcro: search log (27 Oct 2026)

Researcher: Claude (the first sample run of RESEARCH_RULES.md). Every search is listed, including those that found nothing or were blocked.

Examined sources: 16 (14 kept as evidence in sources.jsonl; 2 used only as finding aids: Wikipedia and JSTOR Daily)
Tier P kept: 10 (S01, S02, S03, S04, S05, S06, S10, S11, S12, S13, S14; S06 counts for its 1961 title and date only)
Saturation: no. Category 6 is now done (both RTS films), but they added 16 new claims, and category 2 (Swiss newspapers) is with AK.

## Category 1: Patents
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Google Patents | US2717437A full text | en | 1 | S01. Full description and claims read; PDF saved. Family: BE514797A, CH295638A, FR1064360A, NL173040B |
| Google Patents | US3009235A full text | en | 1 | S02. Read; PDF scan p.5 viewed to confirm 120 / 30% / 1000 |
| Google Patents | CH295638A (fr) | fr | 1 | S03, bibliographic data only. No OCR text online, so the French description was NOT read (open question) |
| Google Patents XHR | inventor=Mestral, priority before 1950 | — | 5 | S04 (CH264212A, 1947 vine stake). No toy aeroplane patent found. Others are other Mestrals (Paul, Gérard) |
| Full-text grep of S01, S02 | burr, burdock, plant, nature | en | 0 | Supports C012 |

## Category 2: Newspapers from the time
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| e-newspaperarchives.ch | "Mestral velcro", 1950–1975 | fr | blocked | A bot check ("Performing security verification") stopped both script and browser. Not bypassed (rule 7.2). AK to search by hand |
| letempsarchives.ch (Journal de Genève, Gazette de Lausanne) | velcro Mestral, 1950–1975 | fr | blocked | Connection refused, in the script and in the browser |
| scriptorium.bcu-lausanne.ch | velcro | fr | — | The site is a JavaScript app; the search could not be scripted. AK to search by hand |
| Chronicling America | velcro 1950–1963 | en | none | The JSON endpoint returned 404 (the API has moved). Its coverage mostly ends before 1963 anyway |
| NYT archive (via Wikipedia's reference) | 1990 obituary | en | 1 | S05 (Reuters obituary, 12 Feb 1990, sec. D p. 13), archive copy |

## Category 3: Digitised books and periodicals
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Internet Archive metadata | velcro, dates 1950–1965 | en | 5 | S11 (DTIC AD0297343, USAF 1963). Others irrelevant (CIA balloon report, a film, a children's story) |
| HathiTrust full text | velcro mestral | en | blocked | Bot check, not bypassed |
| JSTOR (via JSTOR Daily's links) | Science News-Letter, 25 Sep 1965, p.197 (Gemini 6) | en | not read | JSTOR blocks scripts. Open question |

## Category 4: Journals
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Web search, then the journal | Arctium burr hook morphology | en | several | S13 (Saunders 2015, read in the browser). Gorb & Gorb 2002 (Plant Physiol Biochem 40:373) noted as a lead, not read |
| JSTOR Daily "Versatile Velcro" | footnote map | en | 6 refs | Finding aid only. Gave the Science News-Letter 1965 and Scientific American 1996 leads |

## Category 5: Archives and museums
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Science Museum Group collection API | velcro mestral | en | error | Returned non-JSON. Retry in the browser |
| Library of Congress "Everyday Mysteries" page | finding aid | en | 403 | Not read |
| Smithsonian / Lemelson | — | — | not searched | Skipped: the Smithsonian Open Access API needs a key. Next run |
| Velcro Companies archive / Archives cantonales vaudoises | — | — | not contacted | Outreach is AK's call; drafts in open_questions.md |

## Category 6: Oral histories and interviews
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| RTS archives (via web search) | de Mestral velcro interview | fr | 2 | S06 (1961, 13 min) and S07 (1984, 7 min). **Downloaded 27 Oct with AK's OK** (SRG integration layer → public MP4), transcribed locally (mlx-whisper large-v3-turbo, French), 15 frames viewed. His own account of the hunt, the dog's ears, the microscope, Lyon, the wrong thread, the Trient hut, 5%/95% |
| RTS ABE 2012 | — | fr | 1 | A modern retelling (Tier X), not used |

## Category 7: Official records
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| USPTO TSDR | registration 0661700 (VELCRO lead) | en | 429 | Rate-limited; stopped politely. Retry another day |
| Justia trademark pages | VELCRO | en | several | Finding aid only (it mirrors USPTO data). Shows a 1956 first-use date on a 1991 filing |
| HLS / DHS (Historical Dictionary of Switzerland) | Mestral George de | fr, de | 1 | S08 (scholarly secondary) |
| swisstopo GeoAdmin | Commugny | — | 3 | S14 |

## Category 8: The inventor's own publications
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Patents | (see category 1) | | | His patents are his own writing |
| Books | D. Hintze, *Histoire d'une invention* (1990), from the HLS bibliography | fr | not found online | Open question (BCU Lausanne catalogue) |

## Category 9: Data owners (Today beat)
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| NASA Spinoff FAQ | Velcro | en | 1 | S10 |
| NASA NTRS API | velcro, oldest first | en | 28 | S12 (1969 tech brief). The rest is 1973 onward |
| Velcro Companies page | origin story | en | 1 | S09 (company claim) |

## Category 10: Original language
French searches were run in categories 2, 6 and 7 (RTS, HLS, the Swiss newspaper archives, the CH patents). German: HLS read in German too. Swiss German newspapers were not searched separately; e-newspaperarchives covers them but was blocked.

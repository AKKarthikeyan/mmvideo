# CY02 Bay of Bengal cyclones: search log (27 Oct 2026)

Researcher: Claude (research agent, one run). Topic: calendar idea No. 198, "Why the Bay of Bengal makes stronger cyclones". Every search is listed, including those that found nothing or were blocked. Category numbers follow section 2 of `docs/geo/RESEARCH_RULES.md`.

Examined sources: 29 (26 kept in sources.jsonl; 3 examined and not kept: IMD hazard atlas `hazard.pdf`, the BMD home page, and one popular explainer page used only for myths.md)
Tier P kept: 25 (S01-S15, S17-S26; S16 Bilham is tier S, a map to the East India Company records)
Saturation: yes. The last three sources examined (S25 Mausam 2019 abstract, S24 IMD post-monsoon table, the BMD home page) only corroborated C006 and C039 or held nothing. The three before them (S23, S26, the IMD annual table and Neetu 2012) did add C045 and C046, which is why the run continued past them.

Tier X seen in search results and NOT used as evidence: drishtiias.com PDFs, examday.ai (ex-dalvoy) UPSC page, thesouthfirst.com, vajiramandravi.com, iasparliament.com, iamrenew.com, gktoday.in, Wikipedia pages (1737 Calcutta cyclone, 1991 Bangladesh cyclone, List of disasters in Bangladesh), history.com, Down To Earth, The Statesman, TBS News, Dhaka Tribune, Financial Express BD, Jugantor, Dhaka Times, RisingBD, ITV BD, preventionweb blog, peoplespharmacy, Al Jazeera, ScienceDaily.

## Category 1: Official map and boundary record
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| MMVideo house geodata | `sources/geo/ne_10m_admin_0_countries_ind.geojson` (Natural Earth, India point of view) | en | 1 | S19. Used for the bay-width measurement and as the map base (C034, C044) |
| (none needed) | Survey of India / MEA | — | — | No border or disputed area is part of this story. India-Bangladesh-Myanmar coasts only. If the full India outline is shown, use the IND file (house rule). Logged as not applicable beyond that |

## Category 2: Measurements we make ourselves
| Dataset | Method | Output | Kept |
|---|---|---|---|
| IBTrACS v04r01 NI list (NOAA NCEI) | `method/count_ibtracs.py`: genesis sub-basin from first IMD fix; peak IMD (NEWDELHI) wind; IMD classes; JTWC (USA_WIND) robustness; WP-origin tracks; month of genesis. Seasons 1982-2024 (2025 is partly provisional in the file) | `method/count_ibtracs_output.txt`, `method/storms_1982_2024.json` | S02 -> C001, C003, C004, C007, C008, C024, C037, C039, C042, C043 |
| IMD tcintensity.xls (IMD's own list 1990-2025) | exported with xlrd to `sources/imd_tcintensity.txt`; `method/count_imd_xls.py` | `method/count_imd_xls_output.txt` | S03 -> C001, C003, C004 (3 rows left out: wind not parsed, listed in output) |
| IMD annualcd.pdf (1891-2025) | `method/count_imd_annual.py` on `pdftotext -layout` | `method/count_imd_annual_output.txt` | S23 -> C001, C002, C003, C046 |
| IMD cdmon.pdf (Jun-Sep, 1891-2025) | `method/monsoon_depressions.py` | `method/monsoon_depressions_output.txt` | S05 -> C037 |
| IMD cdpos.pdf (Oct-Dec, 1891-2025) | `method/postmonsoon_depressions.py` | `method/postmonsoon_depressions_output.txt` | S24 -> C039 |
| Natural Earth admin-0 IND | `method/bay_width.py`: widest sea run along a parallel containing 88E, haversine | `method/bay_width_output.txt` | S19 -> C034 (12N and 14N rejected: Andaman Islands) |
| NOAA ERSST v5 via CoastWatch ERDDAP | `method/sst_compare.py`, boxes 10-20N 82-92E vs 10-20N 60-72E, 1991-2020 | `method/sst_compare_output.txt` | S20 -> C025 |
| Bathymetry (shelf width) | not computed | — | Considered measuring the shelf from ETOPO; skipped because Gujarat's shelf is also broad and a single number would mislead. Surge factors taken from S09/S10/S01 instead. Open question |

## Category 3: Treaties, gazettes, legal and official texts
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| RSMC New Delhi site | FAQ, damage potential, climatology page | en | many | S01 (FAQ), S21 (damage.pdf classes), S03/S04/S05/S23/S24 (climatology tables). `terminology.pdf`, `uniquecyclone-tracks.pdf`, `cyclone_science_plan.pdf` downloaded, not needed, deleted |
| RSMC New Delhi site | link to NDMA Guidelines (Management of Cyclones, 2008) | en | 1 | S10 (Table 1.1 OCR'd with tesseract, `sources/ndma_table1_1_ocr.txt`) |
| RSMC New Delhi `report.php` pages | annual RSMC reports | en | — | The report lists load dynamically; no report PDFs reachable by script. Not pursued |
| mausam.imd.gov.in | Amphan press release 21 May 2020; 2019 press release 8 Dec 2019 | en | 404 | Both URLs return 404 now. Not used |
| mausam.imd.gov.in | WMO/ESCAP TCP 2023 operational plan (TCP2023.pdf) | en | partial | Download timed out at 18 of 21 MB; deleted. Not needed |
| WMO | records table; deadliest TC 50 years; Amphan | en | 3 | S11, S12, S13. `wmo.int/node/24439` (2017 release) is a 404; `wmo.asu.edu` record pages redirect to the archive home |

## Category 4: Period records
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Bilham's CIRES pages | 1737 Calcutta cyclone eyewitness letter | en | 1 | S17 (letter of 1737 as published by C. R. Wilson 1898) |
| Bilham 1994 (BSSA) | East India Company consultations, Oct 1737; London Magazine 1738; Gentleman's Magazine | en | 1 | S16 (tier S, used as a map to the EIC report "near 3000 Inhabitants were killed") |
| 1876 Backergunge cyclone report (Bengal Government) | not searched in archives this run | en | — | Only the Bangladesh 2006 presentation's surge figure (S15) and NDMA's death range were read. Open question |
| Period newspapers 1970 | not searched | — | — | WMO record used instead. Open question |

## Category 5: Old maps
Not applicable: no claim depends on how a place was drawn in the past. Coastlines come from Natural Earth (category 1). Logged so the gap is visible; if the script shows the 1737 or 1876 storm on a period chart, search the British Library / David Rumsey collections first.

## Category 6: Science (peer-reviewed measurements)
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Web search -> author copy | Deshpande et al. 2021 Climate Dynamics | en | 1 | S06 (rocksea.org author PDF) |
| Web search -> Wiley (browser) | Sengupta et al. 2008 ASL "does not cool SST" | en | 1 | S07. curl got a Cloudflare page; the article is Free Access and was read in the browser pane without any challenge; excerpt saved |
| Europe PMC / Unpaywall / OSTI / PNAS (browser) | Balaguru et al. 2012 PNAS | en | 1 | S08. PMC page showed a reCAPTCHA: stopped, not bypassed. Abstract saved from OSTI; results paragraph read on pnas.org in the browser |
| AOML FTP copy of Balaguru | — | en | TLS error | Certificate mismatch; did not override. Not used |
| Mausam journal (IMD) | Dube et al. 1997 storm surge | en | 1 | S09 (scanned PDF; pages 1-6 OCR'd locally) |
| Mausam journal | Sen Sarma 1996, 1737 reconstruction | en | 1 | S18 (abstract) |
| Mausam journal | 2019 season summary | en | 1 | S25 (abstract) |
| HAL / NORA | Neetu et al. 2012 JGR | en | 2 | HAL shows a bot check (not bypassed). S26 from the NORA record (abstract) |
| — | Vinayachandran 2002 (barrier layer), Murty/Flather surge papers, de Boyer Montegut 2007 | en | not opened | Leads only; C028 is SECONDARY-ONLY because the barrier-layer depth comes via S07's citation |

## Category 7: Data owners
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| NOAA NCEI IBTrACS | NI list CSV v04r01 | en | 1 | S02 |
| NOAA CoastWatch ERDDAP | nceiErsstv5 subset | en | 1 | S20 |
| IMD climatology | annualcd, cdmon, cdpos, scs.xls, tcintensity.xls, hazard.pdf | en | 6 | S23, S05, S24, S04, S03. `hazard.pdf` (IMD hazard atlas, rainfall extremes by station) examined: nothing on Bay vs Arabian Sea; not kept |
| JTWC annual reports | — | en | not opened | JTWC winds are already in IBTrACS (USA_WIND) and in S06 |
| INCOIS | — | en | not opened | Lead only (barrier-layer / storm-surge products). Next run if the script needs a live ocean-heat map |

## Category 8: Original language
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Web search | "১৯৯১ ঘূর্ণিঝড় ১,৩৮,৮৮২ জন মৃত্যু ঘূর্ণিঝড় প্রস্তুতি কর্মসূচি সরকারি তথ্য" (1991 cyclone deaths, CPP, official) | bn | 9 | All Bangladeshi news (Jugantor, Dhaka Times, RisingBD, ITV): tier X. They give 1.38 lakh to 2 lakh. No government page. Nothing kept |
| BMD website | home page (English/Bangla) | en/bn | 1 | Forecast portal only; no cyclone history. Not kept |
| Burmese | Nargis | my | not searched | The PONJA (S14) is the Myanmar government's joint official record, in English |

## Category 9: The other side's record
| Country | What we looked for | Found | Kept |
|---|---|---|---|
| Bangladesh | Official death tolls for 1970 and 1991; surge heights | Workshop slide by an official of the telecom regulator BTRC, 2006 (not a weather or disaster agency) gives surge heights 1876 13.6 m, 1970 10 m, and a list of destructive cyclones, no deaths. MoDMR National Plan 2021-25 draft (S22): no cyclone death table. modmr.portal.gov.bd draft: connection timed out | S15, S22 |
| Bangladesh | "Official government figure is one million" for 1970 | Only in a PreventionWeb blog quoting the CPP head (tier X) | Not used. Open question |
| Myanmar | Nargis toll | PONJA (Myanmar govt + ASEAN + UN): 84,537 dead, 53,836 missing as of 24 June 2008 | S14 |
| India | Deaths in Indian storms | NDMA Table 1.1 (S10), IMD tcintensity deaths column (S03) | S10, S03 |

## Category 10: Place names
| Name | Record | Note |
|---|---|---|
| Bay of Bengal / Arabian Sea | IMD (S01) | Standard. Hindi narration not planned |
| Bhola (1970 cyclone) | WMO "Cyclone Bhola" (S12); IMD "Bangladesh Cyclone of 1970" (S01) | Say "the 1970 Bhola cyclone"; voice: BHO-la |
| Odisha / Orissa, Paradip | IMD FAQ uses both "Odisha" and "Orissa" (S01); NDMA 2008 "Orissa" | Use Odisha (official since 2011) |
| Backergunge / Bakerganj / Barisal | NDMA "Backergunj" (S10); Bangladesh govt "Bakerganj" / "Backerganj" (S15) | Use Bakerganj (Bangladesh's spelling) if named |
| Chittagong / Chattogram | IMD FAQ "Chittagong" | Bangladesh's current official spelling is Chattogram (not verified in a document this run; open question) |
| Hooghly / Hugli; Calcutta / Kolkata | IMD FAQ "Hooghly river (WB)" | For 1737, "Calcutta" is the period name |
| Ayeyarwady (Irrawaddy) delta | PONJA "Ayeyarwady" | Myanmar's official spelling |

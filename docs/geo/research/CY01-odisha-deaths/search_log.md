# CY01 Odisha cyclone deaths: search log (27 Oct 2026)

Researcher: Claude (research agent, Indica Atlas RESEARCH_RULES.md v1). Every search is listed, including those that found nothing or were blocked. The Inventor's Desk category headings are used so `research_check.py` can read this file; each says how the Indica Atlas section 2 step maps onto it.

Examined sources: 32 (24 kept in sources.jsonl; 8 opened and not kept: IMD annual RSMC reports 2013, 2018, 2021, 2024 (they repeat the per-storm reports); SRC situation report 28 Oct 2025 (Montha, not an Odisha landfall); three OSDMA pages that turned out empty or JavaScript-only: shelter-building, publication/titli, publication/1999-super-cyclone)
Tier P kept: 24 (S01-S24; S21 is a peer-reviewed P5 paper whose death figures are second-hand and are marked so)
Saturation: yes. The last three sources examined (the IMD annual RSMC reports 2013/2018/2024, the SRC 2001-02 report, the 27 Oct 2026 IMD press release) added no new spine number; they repeated or only gave context. Two gaps remain and are logged in open_questions.md (the Government of Orissa's own 1999-2000 relief report; a Lok Sabha answer).

## Category 1: Official map and boundary record (Indica Atlas step 1)
Borders are not relevant to this Short: no international or disputed boundary is drawn or named. The map shows the Odisha coast, district names and landfall pins only. If the state outline is drawn it must come from the house India-view dataset (`ne_10m_admin_0_countries_ind` / Survey of India), which was not needed for any claim here.

| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| IMD RSMC New Delhi, best-track page | 1999 best track chart | en | 1 | S22 (PNG chart of the 1999 tracks) |
| IMD per-storm reports | landfall coordinates | en | 5 | Coordinates in S01, S02, S04, S06, S13 (claim C049) |

## Category 2: Measurements we make ourselves (Indica Atlas step 2)
| Measure | Method | Result | Claim |
|---|---|---|---|
| Share of 1999 deaths in Jagatsinghpur | 8119 / 9887 from S01 p.57 | 82.1% | C048 |
| Landfall-to-landfall distances | haversine great circle, R = 6371.0088 km, IMD coordinates | Phailin-Fani 104 km; Fani to the 1999 track 89-106 km; Yaas-Dana 72 km | C049 |
| 1999 vs Fani deaths | 9887 / 64 | 154.5 | C051 |
| Evacuation ratio | 1,557,170 / 150,000 | 10.4 (rests on a SECONDARY-ONLY 1999 figure) | C050 |
| Knots to km/h | x 1.852 | 140 kt = 259 km/h; 115 kt = 213 km/h | C004, C014 |

## Category 3: Treaties, gazettes and legal texts (Indica Atlas step 3)
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| OSDMA overview | founding resolution | en | 1 | S14: Finance Dept Resolution of 28 Dec 1999; renaming resolution 27 Sep 2008 |
| India Code | Orissa (Alteration of Name) Act 2011, A201115.pdf | en | 403 | Not read (curl DNS failure, WebFetch HTTP 403). Name claim rests on S14 only (C053, non-spine) |
| Odisha gazette | super cyclone / OSDMA notification | en | not searched | The resolution number and date are quoted on S14; a gazette copy is an open question |

## Category 4: Period records (Indica Atlas step 4)
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| RSMC New Delhi, annual RSMC reports (report.php menu 27) | 1999 | en | 1 | S01 (Feb 2000 report, scanned; OCR'd locally with tesseract; key pages viewed and hand-transcribed) |
| RSMC New Delhi, per-storm reports (menu 26, by year) | 2013, 2014, 2018, 2019, 2020, 2021, 2024 | en | 7 | S02 Phailin, S08 Hudhud, S03 Titli, S04 Fani, S05 Amphan, S06 Yaas, S07 Dana |
| RSMC annual reports 2013, 2014, 2018, 2020, 2021, 2024 | same storms | en | 6 downloaded | Opened 2013/2018/2021/2024: they repeat the per-storm damage text word for word. Not kept; local copies deleted (30-80 MB each). 2019 annual report is missing from the IMD list |
| srcodisha.nic.in, annual_report.php | Annual Report on Natural Calamities | en | 24 years listed | Kept S09 (2013-14), S10 (2018-19), S11 (2019-20), S12 (2021-22), S13 (2024-25), S24 (2001-02, scanned, OCR'd) |
| srcodisha.nic.in | situation report 28.10.2025 (Montha) | en | 1 | Opened; deployment table only; Montha did not land in Odisha. Not kept as evidence |
| srcodisha.nic.in | 1999-2000 annual report | en | 0 | The list starts at 2001-02. The State's own 1999 relief report is not online (open question) |
| Lok Sabha, eparlib.nic.in | AS54, 25 Jun 2019 (Fani damage table, found via web search) | en | unreachable | DNS failure (ENOTFOUND) from both curl and WebFetch; no Wayback copy. Not read |
| sansad.in Lok Sabha question API | "cyclone fani", 17th LS session 1 | en | 50 returned, 0 relevant | The API's text filter did not match; not pursued further |
| PIB | — | — | not tried | PIB refuses plain fetches (AGENTS.md); the IMD and SRC reports carried every figure needed |

## Category 5: Old maps (Indica Atlas step 5)
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| IMD best-track charts 1990-2018 (PNG) | 1999 | en | 1 | S22 (dated official track chart) |
| National Archives / BL / LoC / David Rumsey | — | — | not searched | Not needed: this is a 1999-2024 story, and the coastline comes from geodata |

## Category 6: Archaeology and science (Indica Atlas step 6)
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| MAUSAM journal (IMD) | Orissa super cyclone synopsis | en | 1 | S21 (Kalsi 2006, peer-reviewed; read in full) |
| Web search | peer-reviewed study, Fani causes of death | en | 10 | All news (Tier X). The wall-collapse / tree-fall breakdown of Fani deaths exists only in news: listed in myths.md, not used |
| Web search | IMD 1999 report pdf / 1999 deaths | en | 9 | Led to S01 via the RSMC site. ADRC recovery report, ActionAid and Down To Earth seen as snippets only (Tier X or not opened) |

## Category 7: Data owners (Indica Atlas step 7)
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| OSDMA site | DLNA Fani, shelter handbook, NCRMP-AF, EWDS, Aapada Mitra; site search 'titli', 'super cyclone' | en | 7 | S15 (DLNA, P4), S17, S18, S19, S20 |
| World Bank Open Knowledge Repository | Phailin Rapid Damage and Needs Assessment | en | 1 | S16 (text rendition saved; the Heidelberg mirror returned HTML, not the PDF) |
| Census of India | coastal population exposed | — | not searched | No population figure is planned for the script |

## Category 8: Original-language sources (Indica Atlas step 8)
| Database | Query | Lang | Hits | Kept |
|---|---|---|---|---|
| Web search | ମହାବାତ୍ୟା ୧୯୯୯ ମୃତ୍ୟୁ ସଂଖ୍ୟା ଓଡ଼ିଶା (super cyclone 1999 death count Odisha) | or | 9 | All English news, Wikipedia or spam. Nothing kept |
| OSDMA / SRC | Odia versions of the reports | or | — | The site has an Odia toggle but the reports are English-only. The State keeps these records in English, so English is the record's original language |
| S21 abstract | Hindi abstract | hi | 1 | Seen; legacy-font encoding, not read. The English abstract was used |

## Category 9: The other side's record (Indica Atlas step 9)
| Record | What it says | Claim |
|---|---|---|
| Andhra Pradesh (via IMD) | Oct 1999 Gopalpur storm: 1 death in AP (S01 p.41); Phailin: 1 (S02); Titli: 8 (S03) | C007, C030 |
| West Bengal (via IMD) | Amphan: 98 dead in West Bengal, none in Odisha (S05); Yaas: none in WB (S06); Dana: 1 in WB (S07) | C035 |
| Bangladesh | Dana: 2 deaths (S07). Not needed further | — |
| IMD vs Government of Odisha | IMD's damage numbers for Fani, Yaas and Dana are 'as per media reports'; the SRC annual reports are the owner's count and are preferred | K4, K8, K11 |

## Category 10: Place names (Indica Atlas step 10)
| Name | Forms seen | Use |
|---|---|---|
| Odisha | 'Orissa' in all 1999-2002 records; 'Odisha' later (S14 on the authority's 2008 renaming) | Say "Odisha"; a caption may say "then Orissa" |
| Paradip | Paradip (IMD), Paradeep (SRC, OSDMA handbook) | Paradip (IMD station spelling) |
| Ersama | Erasama / Erasma (IMD 1999, Mausam), Ersama (OSDMA handbook) | Ersama, a block of Jagatsinghpur district |
| Jagatsinghpur, Gopalpur, Puri, Balasore | same everywhere | — |
| Dhamara / Dhamra | Dhamara (IMD 2024, SRC), Dhamra Port (IMD 2021) | Dhamra |
| Habalikhati | 'Habalikhati Nature Camp (Bhitarkanika)' (IMD, SRC) | Pin label only if needed |
| Phailin, Fani, Titli, Yaas, Dana | IMD spellings. The pronunciation of 'Fani' was NOT checked this run | Check IMD's name list (tc-names.pdf on the RSMC site) before voicing |

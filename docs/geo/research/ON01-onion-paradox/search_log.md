# ON01 search log (merged from agents A, B, C and the lead, 12-13 Nov 2026)

---
# Search log, agent A (production geography, seasons, storage), 12 Nov 2026

## URLs tried
- OK: https://nccd.gov.in/uploads/Agricultural_Statisitcs_at_a_Glance_2024_25_11da3cd37d.pdf (476 pp; Tables 2.48, 2.50a/b on PDF pp.208-216; App. VII p.467)
- OK: https://icar.org.in/en/node/4701 ; https://nhrdf.org/pPostharvestTech_o.php
- OK: NHB Monthly Report on Onion Sept 2017 (nhb.gov.in); Indian Horticulture articles epubs.icar.org.in .../115081/... and .../116816/... (second not cited)
- OK: PIB PRID 2241379, 2271770, 2194573, 1799364
- OK: FAOSTAT bulk zip (bulks-faostat.fao.org); fenixservices API returned nothing useful
- OK: OSM Nominatim (6 places)
- FAILED: https://epubs.icar.org.in/index.php/IndHort/article/download/87722/35769/224837 (404 Not Found)
- FAILED: https://iasri.res.in/uploads/IASRI%20Data%20Book%20-2025%20_low.pdf (no response, HTTP 000); not retried
- FAILED: dogr.icar.gov.in (DNS does not resolve from the Mini/this host; also WebFetch ENOTFOUND). DOGR annual reports ar2022_c.pdf not downloadable. dogr.icar.org.in: no response.
- FAILED: https://i-scholar.in/.../220985/204564 (Current Science 2023 paper, said to give 20/20/60 production; no response)
- BLOCKED: https://www.apmclasalgaon.com/ returned HTTP 406 to plain curl; not bypassed. Lead: read in a browser for official 'largest' wording.
- NO CONTENT: agriwelfare.gov.in/en/Horticulture_Statistics (JS page, no links); lasalgaonbazar.in (HTTP 521)
- Searches (web): ICAR-DOGR 20/20/60; DA&FW 2025-26 horticulture advance estimates; Lasalgaon 'Asia's largest' on govt domains (none found); Nashik district onion area (only press/vendor results, not used).
- Not done: full state table of all states for onion. Ag Stats gives 11 states + Others; DA&FW state-wise horticulture Table 2.48 has no onion split. NHB 2017 report has 16 rows for 2016-17 (older). Full 2024-25 state list would need DA&FW horticulture final estimate xlsx (not found).

## Popular claims tested
1. National/state table 2024-25: CONFIRMED with correction. 3rd Adv. Est.: 1980.62 th ha (not 1.97 m ha; 1.97 m ha is 19.68 lakh ha FINAL), 30789.32 th t (30.77 Mt is the FINAL estimate, PIB: 307.67 lakh t). State values all match the claim: Maharashtra 978.16/13558; MP 218.27/4443.22; Karnataka 195.04/2575.61; yields MP 20.4, Maharashtra 13.9 t/ha. 2023-24: 1540.64 th ha, 24266.71 th t (confirmed). Shares: Mah 44.0% prod, 49.4% area; MP 14.4%; Karn 8.4%; top3 66.8%.
2. ICAR-DOGR 20/20/60: EMBELLISHED / only partly confirmed. ICAR says rabi = 60% of production (primary). Official NHB 2016-17: 14.7/19.8/65.4%. DA&FW March 2020 (via ICAR article) for 2018-19: 21.2/9.4/69.4%. 20/20/60 is an area split in DOGR slides per search summary (not retrieved). Harvest months: kharif Oct-Dec (ICAR magazine: Oct-Nov), late kharif Jan-Mar, rabi end Mar-May (NHB). Rabi stores best: ICAR says stored rabi serves to Oct-Nov.
3. Storage loss 30-40%: CONFIRMED as ICAR's wording; but trial data show worse: ventilated storage 54.89% in 120 days (ICAR-DOGR table), farmer bulk storage 54.6-59.0%, cold storage 5% with 27% sprouting in 15 days after removal. NHRDF gives causes, no percentages.
4. Lasalgaon 'Asia's largest': UNVERIFIED (no primary wording). Govt (DoCA, PIB 2022) calls it a 'source market'/'key mandi'. Nashik district area: UNVERIFIED. Distances: computed, straight-line: Delhi 989, Chennai 1015, Kolkata 1487, Guwahati 1910 km.
5. World rank: India #1 in FAO 2022 (31.69 Mt) and 2023 (30.21 Mt); in FAO 2024 data China (24.28 Mt, estimated) just ahead of India (24.27). World 2024 108.26 Mt.

---
# Search log, agent B (exports, export policy, price stabilisation, logistics), 12 Nov 2026

## Fetched and read (saved in sources/)
- DGFT Notification 28/2024-25 PDF (URL given in brief): OK (B01).
- PIB PRID 2114060, 2303587, 2093755, 2054953, 1985229, 2114339: all fetched with plain curl (no block) (B02,B03,B08-B11).
- https://apeda.gov.in/FreshOnions: OK (B05). APEDA's page gives no destination quantities, only names.
- https://agriexchange.apeda.gov.in/India/GenerateAPEDAProductReport/Index: found the portal's own POST endpoint (GenerateIndExpApedaProduct) from the page's JavaScript and pulled HS 07031019 country-wise and total for FY2023-24, 2024-25, 2025-26, plus HS 07031011 (rose onions) totals (B12). Other Fresh Onions HS codes (07031010, 07031001) returned null.
- https://apeda.gov.in/dgft-notifications (APEDA mirror of DGFT list, 268 rows): onion rows extracted (B15); eleven onion PDFs downloaded from apeda.gov.in/sites/default/files/dgft_notifications/ and read (B06 a-k). Scanned ones read by tesseract OCR; notification number 49/2023 checked by eye on the page image.
- https://www.dgft.gov.in/CP/?opt=notification: page served; 11 onion mentions, latest row 28/2024-25 (B16). Newest row on page 10/11/2026.
- consumeraffairs.gov.in/pages/price-monitoring: page served, no PSF guideline link found.
- fcainfoweb PMS file 2025_LS_B_2194.pdf (Lok Sabha answer 12.03.2025): OK (B13).
- PSF Operational Guidelines March 2015 (DAC) at agritech.tnau.ac.in: OK (B14).

## Failed / not achieved
- https://consumeraffairs.nic.in/.../PSF%20Operational%20Guidellines%20DOCA.pdf (brief URL): connection failed (HTTP 000); same path on consumeraffairs.gov.in: 404. DoCA-era guideline NOT read.
- https://content.dgft.gov.in (root): 403. Individual PDFs worked via apeda mirror.
- https://taxinformation.cbic.gov.in/view-pdf/1009832/ENG/Notifications (Customs 48/2023): returns a script-rendered shell, no text. cbic.gov.in home: 7 KB shell. So NO CBIC/customs notification text read. Duty facts rest on PIB only (the ministry says).
- agriexchange /IndiaExport/Home/Index and /India/ExportAnalyticalReport: reached but not needed.
- api.data.gov.in: 404 without a key path; agmarknet.gov.in: 1 KB shell; fcainfoweb Report_Menu_Web.aspx: ASP.NET form, not driven. Matched Lasalgaon modal + Delhi retail price on one date NOT achieved. Lead: use agmarknet.gov.in "Price and Arrivals" or data.gov.in API with key.
- Not searched: eparlib answers on onion export by country; CBIC 2025-26/2026-27 customs notifications one by one; PIB 1972618 (28 Oct 2023 MEP release) not opened.

## Web searches run (WebSearch tool; results used only to locate primaries)
1. DGFT notification 8 Dec 2023 prohibits export of onions ... (found notification no. 49/2023; news and taxguru pages only used as pointers).
2. content.dgft.gov.in Notification 49/2023-24 ... (pointer to PIB 1985229 and DGFT list).
3. CBIC customs notification export duty onion 40% 19 Aug 2023 (pointer: 48/2023-Customs; withdrawn 28 Oct 2023, sources disagree 61 vs 62/2023: UNVERIFIED).
4. PIB export duty onion 20% 13 September 2024 (pointer to PIB 2054953, 2093755).
5. Notification 2025-Customs onions export duty nil 1 April 2025 (pointer: 19/2025-Customs dated 22 Mar 2025; secondary only, NOT evidence).
6. Price Stabilisation Fund operational guidelines DoCA (pointer to TNAU copy and LS answers).

## Popular claims tested (brief's claims)
1. APEDA FY2025-26 ~1.548 m t, US$397.24 m: CONFIRMED (APEDA page 15,47,940.11 MT, 397.24; our re-sum of DGCIS data 1,547,940 MT, US$397.26 m). Trend: FY2023-24 1,717,439 MT / US$473.7 m (PIB 17.17 LMT agrees); FY2024-25 1,147,722 MT / US$454.0 m. Destinations list CONFIRMED but APEDA's order is by value; by quantity Malaysia 298 kt, UAE 296 kt, Sri Lanka 271 kt. Nepal 158 kt, Bangladesh only 87 kt (was 724 kt in FY24, 480 kt in FY25).
2. Policy timeline: ban 8 Dec 2023 (Notif. 49/2023 dated 7 Dec): CONFIRMED; extended until further orders 22 Mar 2024 (81/2023): CONFIRMED; lifted 4 May 2024 with MEP US$550 (10/2024-25): CONFIRMED; 40% duty with it: PIB-only (not CBIC text); 13 Sep 2024 MEP removed (28/2024-25), duty 40% to 20%: CONFIRMED (duty part PIB-only); 20% duty removed 1 Apr 2025 (PIB 22 Mar 2025): CONFIRMED (PIB). Aug 2023 40% duty: UNVERIFIED at CBIC. Oct 2023 MEP US$800: CONFIRMED (42/2023 dated 28 Oct, in force 29 Oct; re-notified 45/2023 on 23 Nov). Correction: the brief said ban "to 31 Mar 2024 and its extension": confirmed; the report's "3/4 May" lift: PIB says prohibition ran "till 3rd May", 40% duty and MEP from 4 May.
3. Restriction after 1 Apr 2025: none found (DGFT list to 10 Nov 2026, APEDA mirror to 19 Oct 2026). Absence from lists only.
4. Kanda Express 14 rakes / 12,000 MT (5 cities) 2024-25 and 86 rakes / 88,000 MT (16 cities) 2025-26: CONFIRMED (PIB 26 Aug 2026). Rs 35/kg via NCCF, NAFED, Safal, Kendriya Bhandar: CONFIRMED. Buffer targets: 2.00 LMT (2026-27, 1.21 LMT procured) and 4.7 LMT (Rabi 2024) CONFIRMED; "3 lakh t": UNVERIFIED. PSF wording: harvest-time steep fall quote CONFIRMED in the 2015 DAC text, not the DoCA URL.
5. Matched price pair: NOT ACHIEVED. Nearest: Lasalgaon modal Rs 1,330/qtl on 21 Mar 2025 (PIB B02) and all-India avg retail Rs 37.87/kg on 26 Aug 2026 (PIB B03): different dates.

---
# Search log, agent C (politics, culture, history), 12 Nov 2026

## Fetched and saved (sources/C_*)
- ECI Delhi 1998 and 1993 statistical reports: found by reading the ECI old-site file pages (old.eci.gov.in/files/file/3873-delhi-1998/ and 3872-delhi-1993/), downloading the public PDF (no captcha). www.eci.gov.in/statistical-reports/ is a JavaScript shell; eci.gov.in/files/file/4150-delhi-1998/ returned the same shell.
- Dar, Gupta, Verma PDF (aadityadar.com): OK.
- Journal of Ethnic Foods review PMC9589551: OK.
- Business Standard 17 Aug 1998 (period record): OK.
- WisdomLib Charaka Samhita (English, Gulabkunverba 1949) and siva.sh verse viewer: OK.
- Jainworld "foods that are not Jain", koyil.org Ahara niyamam FAQ, Down To Earth "Myth of onion": OK.

## BLOCKED or failed (lead to read in a browser)
- eparlib.sansad.in (all bitstreams, incl. the brief's .../755688/1/1078.pdf, .../798601/1/12_IV_23021999_p102_p102_79.pdf, .../792799/1/12_III_01121998_p4_p4_s21.pdf, .../759044/1/lsd_12_02_15-07-1998.pdf): connection refused/timeout from the Mini (curl 000, WebFetch ECONNREFUSED 164.100.166.186), and the in-app browser navigation failed. eparlib.nic.in no longer resolves (ENOTFOUND).
- rsdebate.nic.in PQ_184_09071998_U2448_p59_p60.pdf and U2449, PD_184_28071998_30...: returns an HTML app shell, not the PDF. Read at sansad.in Rajya Sabha debates.
- jpsonline.co.in (The Palaeobotanist; Pokharia 2008 table, Raja-Nal-Ka-Tila onion): NXDOMAIN, both articles 246 and 169.
- Springer Veg Hist Archaeobot 10.1007/s00334-020-00798-8 (Spengler et al 2020, Barikot): redirect to login; iris.unive.it PDF 403.
- jaina.org blog on turmeric vs onion: page body empty (994 bytes).
- agriexchange.apeda.gov.in Major_Exporing_Countries page: 404/none from curl.
- ihjs Vol55_4_2020 Art06 (Jain University): 404.

## Searches (WebSearch, standard)
1. ECI statistical report 1998 Delhi pdf -> Wikipedia mirrors only (poll date 25 Nov 1998 appears only there; NOT verified, see C-C05).
2. eci.gov.in Delhi 1998 52 seats -> Wikipedia mirrors, outlookindia constituency results (news, not opened).
3. eparlib onion prices 1998 NAFED -> leads listed above (RS 9 Jul 1998 NAFED 1,777 t; LS 23 Feb 1999 imports 687 t of 10,000 t; export ban partly lifted 21.1.99). All UNREAD (BLOCKED).
4. Raja Nala Ka Tila archaeobotany x2 -> Pokharia 2008 Palaeobotanist table (1600-700 BC) and Spengler 2020 (1300-700 BCE). UNREAD (see above).
5. Jain diet anantakaya scholarly x2 -> Jainworld, JAINA, Wikipedia; no peer-reviewed source reached. Flugel 2003, Tattvartha Sutra not retrieved.
6. Indira Gandhi 1980 onion Lok Sabha 1979 -> only news/analysis; an eparlib 1981 item (07_VII_26-11-1981) unrelated. No 1979-80 Lok Sabha onion debate found.
7. Charaka onion palandu -> WisdomLib / siva.sh (used).
8. Srirangam Journal of Hindu Studies -> nothing; community pages only.
9. Lasalgaon "Asia's largest" -> news only; official APMC site not found.
10. India largest onion exporter -> APEDA/PIB snippets (unread): Netherlands 1st, India 2nd by quantity; India 1st producer ~28.65%. Hand to trade agent.

## Popular claims tested
| Claim | Verdict | Corrected wording | Evidence |
|---|---|---|---|
| BJP lost the 1998 Delhi election; Congress won 52 of 70 | Confirmed | INC 52, BJP 15, JD 1, IND 2; INC 47.76%, BJP 34.02% (1993: BJP 49 seats, 42.82%) | C-C01..C03 (ECI) |
| Poll date Nov 1998 | Unverifiable here | not in ECI report | C-C05 |
| Dar et al show onion prices swing with elections | Confirmed, but narrower | prices drop as state elections near, rise after; no claim that onion prices decided any election; mechanism 'suggestive' | C-C06..C09 |
| Onions toppled governments in 1980 and 1998 | Embellished | onion was a central 1980 campaign cry and is cited as a factor ('partly') in BJP's 1998 Delhi (state) loss | C-C10, C-C23 |
| 1980 'onion election' | Confirmed as a campaign theme (via Dar et al summarising Wallace 1980); period record not read | | C-C23 |
| Onion prices doubled before the 1998 poll | Unverifiable | Dar says 'doubled over a few months' citing NYT; no official series read | C-C10, C-C13 |
| Export ban in 1998 | Partly confirmed | minister directed a temporary ban Aug 1998 (BS); January 1998 ban claimed in a party memorandum | C-C12, C-C13 |
| Lasalgaon is Asia's biggest onion market | Unverifiable ('Asia') ; 'largest in India' per Dar | | C-C20 |
| India is the largest onion exporter | Unverifiable here; likely contradicted (2nd) | check Comtrade | C-C24 |
| Jains avoid onion/garlic because of one-bodied-many-lives | Partly confirmed (community source) | lay practice varies; monastics strict; reason: whole-plant death and many jivas | C-C18 |
| Sattvic/Vaishnava avoid onion/garlic | Confirmed for specific traditions | rajasic/over-stimulating; Ahara Niyama; Sri Vaishnava site firm | C-C15..C17 |
| Not all Hindus avoid onion | Unverifiable at a peer-reviewed source | | C-C19 |
| Onion remains at Raja-Nal-Ka-Tila ~1300-700 BCE | Unverified; dates conflict in snippets (1600 vs 1300) | | C-C22 |
| Onion in Charaka Samhita | Confirmed | Sutrasthana 27.175 describes properties | C-C21 |

---
## Lead (13 Nov 2026)
- https://www.apmclasalgaon.com/ read in a browser (curl gave 406): home page has no 'Asia's largest' wording; saved as L01.


## Totals
Examined sources: 64
Saturation: yes (the last three sources added, L01 APMC page, B15 notification list, A16 PIB, confirmed existing claims and added no new facts)

## Category 1
Official map and boundary record: the India state map is the house file public/datayt/india/geo.json (official boundary of India, J&K and Ladakh as on the official map); the trade map is land only, with no country borders. No disputed area is named in narration.

## Category 2
Our own measurements: haversine straight-line distances Lasalgaon to Delhi, Chennai, Kolkata, Guwahati (method/distances_A.txt); production and area shares (A-C04..A-C16); export share, Rs/kg and lakh conversions (L-C02..L-C04).

## Category 3
Legal texts in full: DGFT notifications 42/2023, 45/2023, 49/2023, 63/2023, 65/2023, 67/2023, 81/2023, 10/2024-25, 28/2024-25 (PDFs saved). CBIC duty notifications not reachable (script-rendered portal); duty facts rest on PIB.

## Category 4
Period records: ECI statistical reports, Delhi assembly 1993 and 1998; Business Standard, 17 Aug 1998 (period newspaper, C-C12). Lok Sabha 1998 debates (eparlib) unreachable: logged in search_log_C.

## Category 5
Old maps: not applicable (no historical boundary or place-position claim in the film).

## Category 6
Science: ICAR storage trial and cold-storage page (A-C23..A-C25); NHRDF post-harvest (A-C26); Dar, Gupta & Verma working paper (C-C06..C-C09); Charaka Samhita translation (C-C21). Raja-Nal-Ka-Tila papers not opened.

## Category 7
Data owners: DA&FW (Agricultural Statistics at a Glance 2024-25; PIB final and advance estimates), NHB, FAOSTAT, APEDA/DGCIS, Department of Consumer Affairs (PIB releases), Lok Sabha answer 2025.

## Category 8
Original language: Lasalgaon APMC home page in Marathi (L01, translated by the lead).

## Category 9
The other side's record: export figures are India's (DGCIS); importing countries' records not needed for India's own policy notices; Bangladesh's fall is narrated without a cause.

## Category 10
Place names: Nashik, Lasalgaon (Niphad taluka, Nashik district), Kanda Express (spelled as in PIB 26 Aug 2026), rabi and kharif.


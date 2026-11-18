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

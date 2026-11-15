# AGR-07 search log

All work on 2 Nov 2026 (the machine date). Web search was used only to find which page to open. No search snippet, news site, think-tank page or coaching page is cited as evidence. Downloaded copies are in `sources/` (git-ignored).

## 1. NCERT (order 1)

| Source | Result |
|---|---|
| `research/upsc/_ncert/` keec105, keec102, jess104, legy203, lesy204, hess403 plus front pages keec1, jess2, legy2 | Read. MSP found in keec105, keec102 (procurement only), jess104. None in legy203, lesy204, hess403 |
| `ncert.nic.in/textbook/pdf/` jess1ps, lesy2ps, hess4ps, hess3ps, jess201, jess202, jess204, jess205, keec103, keec101, 104, 107, 108, legy201, 205, 206, jess203 | Downloaded and searched for "support price", MSP, procurement, buffer stock. Hit only in jess201 (one table cell) and keec103 (one sentence). Others: none |
| Class IX Economics (Food Security) `iess1ps`, `iess101-105`, `iess2*`, `iess3*`, `iess4*` | **HTTP 404 for every code tried.** The textbook listing page is JavaScript-driven and gave no links. NOT READ (open item O03) |
| `ncert.nic.in/textbook/pdf/Rationalised.pdf` | Read: two sentences, no list of removed content. Per-book rationalisation pages give criteria only |
| Class XII books `legy2` etc. | legy203 = Ch.3 Land Resources and Agriculture (of People and Economy) |

## 2. Publisher of record: CACP (cacp.da.gov.in), order 2

| Page | Result |
|---|---|
| `/` , `/Home/AboutUs`, `/Home/mandate`, `/Home/DeterminantsofMSP`, `/Home/CompOfCommission` | Read. About Us: 1965 resolution; Mandate: 22 crops list; Determinants of MSP |
| `/Home/kharifreports`, `/Home/rabireports` | Read; listing of reports. Latest kharif: KMS 2026-27 (file dated 13 May 2026, report dated 15 Mar 2026); latest rabi: RMS 2027-28 (uploaded 6 Oct 2026, report dated 15 Jul 2026) |
| `/Home/latestKharifReports`, `/Home/latestRabiReports` | Served PDFs, but the connection dropped partway (37 MB and 49 MB of larger files); files were corrupt. Re-fetched from the named URLs with `curl --http1.1 -C -` resumable loops: KMS 2026-27 (56.5 MB, 387 pp), RMS 2027-28 (64.7 MB, 259 pp), KMS 2025-26 (17.2 MB, text layer) all complete |
| KMS 2026-27 and RMS 2027-28 reports | **Scanned images, no text layer.** OCRed with tesseract (150 dpi, psm 4) for the pages needed (KMS pp.1-82 and 160-200; RMS pp.1-82 and 134-142). **OCR misreads the rupee sign as a digit or percent sign** (found: wheat bonus Rs 40/Rs 150 read as "240/2150"; NE freight Rs 200 crore read as "2200"). Every rupee figure used was checked against PIB or by eye on the page image (see section 8) |
| `/document/cost_concepts.pdf` | Text layer unreadable (letters scattered); read from page image. Definitions A1 to C3 and imputation rule |
| `/Home/MSP` (Crop and Year-wise MSP table, "Updated on 30.09.2026") | **Table not in the served HTML (JavaScript).** Not read (O02). PIB tables used instead |
| `/Home/Circulars`, other menu pages | Not needed |

## 3. Publisher of record: PIB (pib.gov.in)

PIB did **not** block `curl` with a browser user agent today (the brief expected it might). Releases fetched: 2316941 (Rabi MSP 2027-28, 30 Sep 2026); 2260617 (Kharif MSP 2026-27, 13 May 2026); 2173566 (Rabi 2026-27, 1 Oct 2025); 2132027 (Kharif 2025-26, 28 May 2025: used only for the date); 2222802 (Lok Sabha reply 3 Feb 2026); 2177219 (backgrounder 10 Oct 2025); 2258113 (sugarcane FRP 2026-27); 192184 (FRP 2019, Sugarcane (Control) Order 1966); 199104 (Rajya Sabha reply 7 Feb 2020, A2+FL/C2/NCF); 1741991 (Lok Sabha reply 3 Aug 2021, farmers benefited); 1896131 (Rajya Sabha reply 3 Feb 2023, 'Legal Guarantee for MSP'); 114860 (22 Jan 2015, HLC executive summary); 183409 (PM-AASHA 12 Sep 2018); 2055990 (18 Sep 2024); 2104121 (17 Feb 2025); 2173547 (pulses mission 1 Oct 2025); 1773138 (PM address 19 Nov 2021); 1784165 (Winter Session 2021); 1845115 (committee, Lok Sabha reply 26 Jul 2022); 2245994 (cotton reply, not used in claims).
Not found at PIB: any release giving KMS 2026-27 paddy procurement figures; a Cabinet decision on PM-AASHA beyond 2025-26.

## 4. Parliament

| Source | Result |
|---|---|
| `sansad.in/getFile/lsapps/loksabhaquestions/annex/188/AU1598_LJJBy5.pdf` (Lok Sabha Q.1598, 28 Jul 2026) | Read in full: answers, MSP and cost series, State-wise paddy and wheat procurement 2021-22 to 2025-26, PSS procurement |
| `.../185/AU244_Z2R9zf.pdf` (Q.244, 22 Jul 2025) | Read: formula, 22 crops, cost and MSP 2021-22 to 2025-26 |
| `.../188/AU661_wt0xvA.pdf` (Q.661, 22 Jul 2026) | Read: 48-hour DBT, no audit, KMS 2026-27 not started in the State |
| `.../188/AU1399`, `AU312`, `AU1671`, `AU1685`, `AU2742` | Downloaded; AU1399 (NHB subsidies), AU312 (carbon credit), AU1685 (CPI) not relevant; AU1671 (buffer stock of essential commodities) and AU2742 (organic MSP) not used |
| Rajya Sabha PQ 267 of 7 Feb 2025 (`rsdebate.nic.in/.../PQ_267_07022025_U506_p139_p142.pdf`) | **Returned a web-app shell, not a PDF. BLOCKED.** Needed for the status of the Committee on MSP (L12) |

## 5. MoSPI / NSO (order 2)

| Source | Result |
|---|---|
| NSS Report 587 (77th round, 2019), `mospi.gov.in/.../Report_587m_0.pdf` (4,264 pp, text layer) | Read: Statements 4.9 and 4.10, para 2.68, estimated 93.094 million agricultural households |
| NSS KI (70/33), 70th round, `.../KI_70_33_19dec14.pdf` | Read: Statements 19A and 19B (the data behind the HLC's numbers) |
| NSS Report 496 (59th round, 2003), `.../496_final.pdf` | Read: para 3.1.2.2 (MSP awareness 2003) |
| `microdata.gov.in` | Not opened |

## 6. Committees and commissions

| Source | Result |
|---|---|
| High Level Committee on restructuring FCI (Shanta Kumar), Jan 2015 | PIB executive summary of 22 Jan 2015 read in full. The full 80-page report was **not opened** (FCI site is JavaScript-driven; DFPD link not found) |
| National Commission on Farmers, Fifth and Final Report (Oct 2006) | **Not obtained.** Tried `agriwelfare.gov.in/en/Ncfarmers` (JavaScript shell), several guessed agricoop/nfsm paths (404, no response), PARI copy (journalism archive, not accepted), PRS summary (secondary). Ministry's own account in PIB 7 Feb 2020 is used (F11) |
| Committee on MSP etc. (announced 19 Nov 2021) | PIB 19 Nov 2021 and 26 Jul 2022 read. Ministry notification, membership, terms of reference, status: **not found at source** (L12) |
| Supreme Court committee on the 2020 laws (Jan-Mar 2021) | Not searched (tangential to MSP). Open item O05 |

## 7. Other

| Source | Result |
|---|---|
| Union Budget 2018-19 speech, `indiabudget.gov.in/budget_archive/ub2018-19/bs/bs.pdf` | Read paras 13-14 |
| Farm Laws Repeal Bill 2021, PRS copy of Bill No.143 of 2021 | Read |
| India Code (Farm Laws Repeal Act 2021), `indiacode.nic.in/handle/123456789/16976` | No response from the host (O06) |
| `fci.gov.in`, `dfpd.gov.in` | HTML served but data pages are JavaScript; no procurement tally readable (O01) |
| Sugarcane (Control) Order 1966 text | Not opened |
| PM-AASHA guidelines | Not opened; scheme described from PIB Cabinet notes |

Web searches run (to find pages only): MSP kharif/rabi 2026-27 and 2027-28 decisions; NCF report; HLC report; NSS 587; committee on MSP; PM-AASHA; FRP; farm laws repeal; Class IX Food Security. Results included news sites (Statesman, Tribune, Newslaundry, etc.), Wikipedia, PRS and coaching sites: **none used as evidence.**

## 8. Checks run

1. **MSP and cost tables, two independent publishers.** For all 14 kharif crops (MSP and A2+FL cost) and all 6 rabi crops, the PIB CCEA table and CACP's Table S.1 (read from scan, OCR) were compared programmatically against the figures in `docs/upsc/living/AGR-07.csv`: **80 cell-to-source comparisons, 0 mismatches.** Percent margins in PIB agree with CACP's "MSP as percent of A2+FL" (e.g. 106% margin = 207% of cost).
2. **Page images read by eye** (not OCR): CACP KMS 2026-27 pp.3 (stocks), 36 (paddy farmers chart), 39 (State shares chart), 141 (Table 5.4 costs), Box 2.1 and S.4 (NE freight), CACP RMS 2027-28 pp.46 (bonus and fees) and 114 (wheat cost). Each corrected or confirmed the OCR text.
3. **Arithmetic.** 2441/1627 = 1.500; 2610/1264 = 2.065; 33.8 mt / 120.7 mt = 28.0% (matches CACP 28%); differences in MSP rises recomputed (+622, +557, +515, +500, +12, +10).
4. **Source against source:** HLC figures (13.5%, 10%, 16.2%) against NSS KI 19A/19B (135, 100, 162 per 1000): match. Lok Sabha State procurement (wheat Punjab 119.19, MP 77.74, Haryana 70.83 LMT) against CACP (11.9, 7.8, 7.1 mt): match.
5. **Cell tally:** well over 100 individual figures were checked against a source this run (the 80 above plus State shares, farmer counts, NSS statements, stock figures); more than 40 of them (Table 5.4 and the State-wise charts) were read by eye on the page image. Anything not so checked is marked `UNVERIFIED` in `claims.csv` (11 rows).
6. **Not verified:** totals between urban and rural do not apply here. Wheat A2 cost Rs 1,011 (OCR only); State cost annexes; the HLC's full report; NCF original text.

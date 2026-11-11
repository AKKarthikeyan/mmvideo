# ECO-15 search log (all on 2 Nov 2026 unless stated)

Order followed: NCERT, then publisher of record (RBI, Gazette, MoSPI), then IGNOU. Web search was used only to find which page to open; no search snippet was used as evidence.

## 1. NCERT
| Tried | Result |
|---|---|
| `research/upsc/_ncert/leec103.pdf`, `jess203.pdf`, front pages `leec1.ps`, `jess2.ps` (already downloaded) | Read. Edition and reprint recorded in ncert_map.md |
| `ncert.nic.in/textbook/pdf/` leec101, 102, 104, 105, 106, leec201-203, keec101, 103, 104, 107, 108, jess201, 202, 204, 205, kest107, kest108, kest1ps | 200, read or searched for "inflation" |
| keec109, keec110 | 404 (no such chapter file) |
| iess101-104, iess201, iess301-304, iess1ps, iess3ps (guessing the Class IX Economics code) | 404. **Class IX Economics not checked.** Lead may supply the right code |
| `ncert.nic.in/pdf/BookletClass12.pdf`, `BookletClass10.pdf` (rationalised content lists) | 200, read 12105 and 1070 entries |
| In-book "Rationalisation of Content" page | Generic, no list |

## 2. RBI (rbi.org.in; plain `curl` with a browser user agent worked for the HTML pages)
| Tried | Result |
|---|---|
| Home page (Current Rates panel, what's new) | 200. Repo 5.50, SDF 5.25, MSF 5.75, Bank Rate 5.75, fixed reverse repo 3.35, CRR 3.00, SLR 18.00. Site "last updated Oct 31, 2026". No 'as of' date on the panel itself |
| MPC resolution 5-7 Oct 2026 (prid=63742); minutes (63839); Governor's Statement (63744); Statement on Developmental and Regulatory Policies (63743) | 200, read in full |
| Minutes April, June, August 2026 (prid 62599, 62974, 63403) | 200, voting tables read |
| Monetary Policy Report Oct 2026 (PublicationsView id=24085) | HTML text read. The PDF is on rbidocs (blocked) |
| Monetary Policy overview page (FS_Overview fn=2752) | 200, read in full. States target history, MPC rules, every instrument, meeting schedule |
| RBI notifications 13726 (SLF PDs), 13728 (Bank Rate and penal), 12858 (CRR 6 Jun 2025), 13736 (daily CRR minimum), 13226 (payments banks CRR/SLR amendment), 13031 (UCB CRR/SLR directions) | 200, read |
| Press release 63783 (forex market measures, 10 Oct 2026) | Read for context only; out of this episode's scope |
| DG Poonam Gupta speech 5 May 2026 (BS_SpeechesView Id=1557) | 200, read in full |
| RBI Bulletin Oct 2024 (Id=22929), Apr 2022 (Id=20939) | 200, read |
| About Us page (establishment date) | 200 |
| FAQs (FS_FAQs fn 2753, 2745, 2757, 2754, 6, 2765, 5, 9, 2759) | 200 but none is about monetary policy (digital rupee, bonds, forex). **No RBI FAQ on monetary policy found.** Brief asked for one: not available at the paths found |
| **rbidocs.rbi.org.in PDFs**: RBI Act (RBIA1934170510.PDF), Commercial Banks CRR and SLR Directions (150MD.PDF), discussion paper (PR951E...PDF) | **BLOCKED.** The host returns a CAPTCHA page. Not bypassed. WebFetch got the same CAPTCHA |
| RBI master-direction HTML view for commercial banks CRR/SLR (BS_ViewMasDirections id=13160) | 200 but the body is empty; only the title is shown. SLR rate for commercial banks could not be read in the Directions |

## 3. Gazette, Government of India
| Tried | Result |
|---|---|
| e-Gazette PDF CG-DL-E-25032026-271285 (`egazette.gov.in/WriteReadData/2026/271285.pdf`) | 200, read. S.O. 1580(E), 25 Mar 2026. Found via a web search hit on a Gazette tracker; the PDF itself was fetched from the official host |
| egazette.nic.in same file | Connection failed; the .gov.in host worked |
| DEA Agreement on Monetary Policy Framework PDF (`dea.gov.in/files/other_reports_documents/MPFAgreement28022015.pdf`) | 200. Scanned images; read pages 1-3 visually |
| PIB release relid=124605 (MPFA, Rajya Sabha reply) | 200, read |
| India Code RBI Act PDF (bitstream/123456789/9176/1/a1934-2reserve.pdf), act page, show-data section links | HTTP 504 or no response (tried twice, 2 Nov). **RBI Act text not read.** Open in a browser |
| legislative.gov.in A1934-02.pdf | 404 |

## 4. MoSPI
| Tried | Result |
|---|---|
| mospi.gov.in site | A JavaScript app; plain fetch returns an empty shell. WebFetch: certificate rejected |
| esankhiyki API `api.mospi.gov.in/api/cpi/getCPIIndex` | Works for base 2012 up to Dec 2025 only. **No base-2024 rows returned (2026 empty).** Swagger copied from GitHub nso-india/mospi-esankhyiki for the parameter names |
| MoSPI press release PDF for Sept 2026 CPI (`mospi.gov.in/uploads/latestreleasesfiles/1791801549227-Press Release for the month of September, 2026.pdf`) | URL found by a web search; **downloaded and read from MoSPI's own site** |
| MoSPI first press release of CPI base 2024 (12 Feb 2026) | Hosted at `static.pib.gov.in/.../doc2026212787501.pdf` (MoSPI document on PIB's server). Read (22 pages incl. FAQ) |
| MoSPI release calendar (`mospi.gov.in/release-calendar`) | WebFetch failed (certificate). Next release date taken from the Sept press release, p.4 |

## 5. UPSC
| Tried | Result |
|---|---|
| Examination Notice 05/2026-CSE dated 04.02.2026 (`upsc.gov.in/sites/default/files/Notif-CSP-2026-Engl-060226Rev.pdf`) | 200, 159 pages. Econ Paper I 3(a) at PDF p.61; GS-III at p.35; Econ Paper II at p.63 |

## 6. IGNOU (eGyanKosh)
| Tried | Result |
|---|---|
| MEC-205 Vol 2 Unit 9 "Inflation and Monetary Policy" (2021) | Read. Dated on the corridor |
| Unit 9 "Monetary Policy in India: Transmission Mechanism" (Nov 2024) | Read |
| Unit 8 "Causes and Effects of Inflation" (2021; course code not shown in the PDF) | Read |
| Not opened: Unit 21 Monetary Policy (84879); Unit 7 Central Bank (108789); other units | Found by search only |

## 7. Not tried or not reachable
- Original scholars (Fisher, Pigou, Friedman, Keynes) were not opened. The syllabus words are only partly covered by NCERT Box 3.1 and IGNOU Unit 9 (ECO15-U05).
- Central bank and Treasury relation (ways and means, FRBM) not researched (ECO15-U04).
- RBI working papers cited for the 6-18 month lag (Khundrakpam and Jain 2012; Raj et al. 2020) were not opened; the lag is cited as RBI's own sentence in the Oct 2026 MPR.
- Web search was also used with allowed domains to find: Gazette tracker (secondary, not used), taxguru/outlookmoney news on the target (not used as evidence).

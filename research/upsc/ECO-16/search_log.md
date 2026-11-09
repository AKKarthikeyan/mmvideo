# ECO-16 search log (all on 3 Nov 2026 unless stated)

Order followed: NCERT, then publisher of record (RBI, MoSPI, PIB, DICGC, UPSC), then central-bank staff papers and IGNOU for the debate, then original authors. Web search was used only to find which page to open; no search snippet was used as evidence. Every claim row names a file saved in `sources/`.

## 1. NCERT
| Tried | Result |
|---|---|
| `research/upsc/_ncert/leec103.pdf`, `jess203.pdf`, `gees208.pdf`, `gees111.pdf`, front pages `leec1.ps`, `jess2.ps`, `gees2.ps` (downloaded earlier by the lead) | Read in full, page by page with `pdftotext`; copies and paged text saved in `sources/ncert_*` |
| `BookletClass12.pdf`, `BookletClass10.pdf` (rationalised content), `BookletClass7.pdf` | Copied from ECO-15 / `_ncert`; Ch 3 untouched; Class X "No Changes"; Class 7 booklet is the old book's list |
| Word search of all NCERT text in `_ncert/` for money-creation words | Real teaching in `leec103` only; `gees111` is the Grade 7 Part 1 lead-in |
| Class IX Economics | Not checked (code not known; ECO-15 got 404 for `iess1xx`) |

## 2. RBI (rbi.org.in HTML worked with `curl` and a browser user agent)
| Tried | Result |
|---|---|
| Home page, Current Rates panel | 200, read 3 Nov 2026 (CRR 3.00, SLR 18.00, repo 5.50, deposit and lending panel) |
| CRR circular 6 Jun 2025 (Notification 12858); Master Direction CRR and SLR 2021, updated 16 Dec 2024 (Notification 12131) | 200, read. The 2025 consolidated Directions (`rbidocs ... 150MD.PDF`) are **BLOCKED** (CAPTCHA) |
| Weekly Statistical Supplement extracts: 29 May 2026 (prid 62826) and 21 Aug 2026 (prid 63420) | 200, read. Money Stock table, SCB deposits and credit. 21 Aug 2026 (data to 31 Jul 2026) is the newest level read |
| Press releases for the fortnightly Money Supply data (prid 63856, 15 Oct 2026; 63462, 15 Aug 2026) | Page 200 but the numbers are in a PDF and XLSX on `rbidocs` = **BLOCKED** (CAPTCHA, not bypassed) |
| RBI Bulletin Aug 2026 (Id 24377) and 25 Aug 2026 (Id 24427) | 200, read: reserve money and money supply growth; payment indicators table 45 |
| Payment System Indicators June 2026 (PSIUserView Id 61) | 200, read |
| Handbook of Statistics: Notes on Tables (Publications id 16037, dated 15 Sep 2014); list of 2025-26 Handbook tables (AnnualPublications) | Notes read (definitions). The tables (36 to 38, 40) are on `rbidocs` = **BLOCKED** (XLSX also returns the CAPTCHA page) |
| Money supply methodology pages (Publications id 9455; Reports ID 293) | 200, read |
| WG on Money Supply 1998 report PDF; New Monetary Aggregates paper; Comprehensive Guide (all `rbidocs`) | **BLOCKED** (CAPTCHA) |
| FAQ: Indian Currency (updated 15 Apr 2025, `commonman/Upload/.../INDIANCURRENCY15042025.pdf`) | 200, read |
| Master Circular Loans and Advances 1 Jul 2015 (BS_ViewMasCirculardetails id 9902) | 200, read; para 2.3.16 on consortium arrangements |
| Technical Paper on Differentiated Bank Licences, 19 Oct 2007 (Publications id 9795) | 200; used only for RBI's quotation of s.5(b) of the Banking Regulation Act |
| About Us (1935, 1949); fs2752 overview; Governor's statement Oct 2026; CRR daily-minimum notice | Copied from ECO-15 `sources/` (read there 2 Nov 2026) |
| WSS list page, Handbook list, Data on Money Supply list | 200; the lists load by script, so each document was reached from the links in the HTML |

## 3. Other Indian official sources
| Tried | Result |
|---|---|
| DICGC: Guide to Deposit Insurance, FAQ, information leaflet 2024-25 | 200, read |
| PIB (Ministry of Finance), PM Jan Dhan Yojana completes 12 years (PRID 2303643, posted 27 Aug 2026) | 200, read |
| MoSPI press note on NSS 77th round AIDIS (`press_note-AIDIS-240821.pdf`) and PIB PRID 1753935 | 200, read |
| NABARD Status of Microfinance in India 2023-24 | 200, read (272 pages). 2024-25 edition not found |
| UPSC Notice 05/2026 | Copied from ECO-15 (p.61 re-read) |
| UPSC Prelims 2024 GS Paper I (Set A) p.23 | Local scan from `_pyq`; page rendered and OCRed, checked by eye against the image |
| UPSC answer keys archive page | 200 but its list loads by script; no key could be read |
| India Code (Banking Regulation Act, RBI Act) | HTTP 504 / 403 **BLOCKED**; `legislative.gov.in` 404 |
| NPCI product pages (UPI statistics) | HTTP 403 **BLOCKED** |

## 4. Central banks and international bodies
Bank of England Quarterly Bulletin 2014 Q1 ("Money creation in the modern economy" and "Money in the modern economy: an introduction"), Deutsche Bundesbank Monthly Report April 2017, Federal Reserve Board Reserve Requirements page and 15 Mar 2020 press release, BIS Quarterly Review (Dec 2004 and Mar 2022): all 200 and read. Both BIS pages came as HTML summaries, which the key phrases were read from.

## 5. IGNOU (eGyanKosh) and original authors
Unit 13 Money and the Economy; Unit 5 Demand for Money; Unit 8 Demand for Money: Post-Keynesian View (saved, not used for a claim); EEC-11 Block 8 (Unit 18 Quantity Theory of Money): all 200. Original authors: Fisher 1911 full text (archive.org, public domain scan) read; Keynes 1936 ch.13 and ch.15 read as a web transcription at marxists.org; Pigou 1950 retrospective read (Digital Library of India scan). **Not opened:** Pigou 1917, Friedman 1956, Friedman and Schwartz 1963 (ECO16-U05). Fisher's full-text link from `archive.org/download` returned 200 for Fisher but 401 for Keynes, so Keynes comes from the transcription.

## 6. Sources the brief named that gave nothing usable
- Lok Sabha / sansad.in: not searched (no claim needed it).
- Grameen Bank's own site: not fetched (ECO16-U06).
- A figure for the money multiplier today and reserve money level: not obtainable without the blocked RBI files (ECO16-U02).

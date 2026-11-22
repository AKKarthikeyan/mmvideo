# mm-asianpaints-dealers: search log (2026-11-22)

Researcher: Claude (research role, Shorts mode, one run). Question: is the Asian Paints dealer and tinting network still a moat now that new entrants are spending to copy it? Shorts rule (AK, 1 Nov 2026, docs/geo/RESEARCH_RULES.md): 2-3 original sources, then stop; the 10-category log, the 12/6 floor and saturation do not apply. Every search and fetch is listed, including blocked or empty ones.

Examined sources: 3 cited (S01, S02, S03). Others opened only as listings (see below) and not used as evidence.
Tier P cited: 3 (S01 P4, S02 P4, S03 P2).
Saturation: n/a (Shorts mode); research stopped at 3 sources by rule. Dropped for lack of a primary source: see open_questions.md.

Tier X seen in search results and NOT used as evidence: Wikipedia (Asian Paints), Scribd copies of Asian Paints reports, investywise.com, finology.in, sharekhan.com note, gloom.sh, compoundingai.in, Yahoo Finance transcript pages, alphaspread.com, earningscalls.dev, trendlyne.com, tipranks.com, substack posts (writobratapaulfinanceatoz, thecapitalminds), finshots.in, outlookbusiness.com, storyboard18.com, univest.in, empor.top, business-standard.com, barandbench.com news page, lexology.com, jsalaw.com, angelone.in, competitionlawyer.in, corporateteaweekly.blog, lawtext.in. The popular claims seen only in those snippets are listed in myths.md and nothing else is taken from them.

## Searches and fetches (all 2026-11-22, all English)
| # | Where | Query / URL | Hits | Kept and why |
|---|---|---|---|---|
| 1 | Web search | Asian Paints Integrated Annual Report 2025-26 pdf asianpaints.com investor | 9 | Kept the company's own report page and the IntegratedAnnualReportFY2025-26 URL. Dropped Scribd, Wikipedia, investywise (tier X) |
| 2 | Fetch (curl, Mac Mini) | https://www.asianpaints.com/content/annualreport/annual-report-25-26.html | 200, 52 KB | Listed the report's section PDFs (static.asianpaints.com/content/dam/annual-report-2526/pdf/...). Saved as sources/ap_ar_page.html |
| 3 | Fetch (curl, Mac Mini) | https://www.asianpaints.com/IntegratedAnnualReportFY2025-26.html | 200, 46.9 MB, redirected to the full-report PDF | S01. Saved as sources/ap_iar_fy26.pdf (the first save was named .html by mistake and renamed) |
| 4 | Web search | Grasim Industries Annual Report 2025-26 Birla Opus dealers touchpoints | 9 | Kept grasim.com Integrated Annual Report PDF. Dropped finology, sharekhan, gloom, compoundingai (tier X; their numbers are not used) |
| 5 | Fetch (curl, Mac Mini) | https://www.grasim.com/integrated-annual-report-2025-26/pdf/Grasim_IAR_FY2025-26.pdf | 200, 14.9 MB | S02. Saved as sources/grasim_iar_fy26.pdf |
| 6 | Text search inside S01 (PyMuPDF, all 293 PDF pages) | tinting, dealer, touchpoint, retail touch, new entrant, Birla, JSW, Grasim, Opus, market share, counter share, depots, outlets, competitive | many | Kept 9 passages (C001-C011). AP's report gives no tinting-machine count and does not name Birla Opus, Grasim or JSW ('Opus', 'Grasim', 'JSW': zero hits in all 293 pages; 'Birla': only 'Birlasoft' in a director's other directorships, PDF p.107 and p.134) |
| 7 | Text search inside S02 (all 624 PDF pages) | dealers, tinting, touchpoint, towns near 'Opus'/'paint' | many | Kept C012-C026. No tinting-machine count anywhere in S02 |
| 8 | Fetch (curl) | https://www.asianpaints.com/more/investors/investors-landing-page.html | 200, 586 KB | Looked for Q4 FY26 earnings-call transcript or investor presentation links. None listed on the page (only governance, dividend and ESG-rating PDFs) |
| 9 | Fetch (curl), 5 guessed sub-pages | .../investors/financial-information/quarterly-results.html, .../investor-presentation.html, .../financial-information.html, .../analyst-meet.html, .../investor-information/earnings-call-transcripts.html | 404 x5 | Guessed URLs, all not found. Stopped guessing |
| 10 | Web search | Asian Paints Q4 FY26 earnings call transcript May 2026 asianpaints.com investor-relations pdf | 9 | Only third-party transcript sites (Yahoo, Gloom, Alpha Spread, earningscalls.dev, Trendlyne). The company's official transcript PDF was not found. Third-party transcripts are tier X, so the earnings-call source was DROPPED; no claim rests on it |
| 11 | Web search | static.asianpaints.com investors Q4 FY 2025-26 earnings call transcript ... dealers tinting machines Birla Opus | 9 | Same result as #10. Nothing kept |
| 12 | Web search (popular version, skim for myths only) | Asian Paints dealer network moat Birla Opus tinting machines threat | 10 | Read snippets only, to list popular claims into myths.md (substacks, finshots, outlook business, storyboard18 etc.). No wording, structure or figure used as evidence |
| 13 | Web search | cci.gov.in order section 26(1) Asian Paints Limited Grasim Industries Limited Case No. 2025 pdf | 9 | The CCI's own order PDF was not found in results (secondary law-firm and news coverage only). Found the Bombay High Court judgment PDF (WP 2887/2025) on a news CDN |
| 14 | Fetch (curl) | https://images.assettype.com/barandbench/2025-09-15/4gtykiod/Asian_Paints_v__CCI.pdf | 200, 203 KB, 40 pages | S03. Saved as sources/bombay_hc_ap_v_cci.pdf. Read in full around the allegations (paras 30-34) and the operative order (paras 39-41) |
| 15 | Wayback availability API | archive.org/wayback/available for S01, S02, S03 | 3 | S03 has a snapshot (2025-09-15). S01 and S02 have none. Did not trigger Save Page Now (writes to a third-party service) |

Blocked or not reached: the CCI's own website (cci.gov.in) was not fetched; the Bombay High Court's own site was not fetched; AP's official earnings-call transcript was not located; no JSW Paints filing was opened (Shorts rule: stop at 2-3 sources).

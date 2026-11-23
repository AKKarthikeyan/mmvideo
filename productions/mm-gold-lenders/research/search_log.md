# mm-gold-lenders: search log (23 Nov 2026)

Researcher: Claude (research role, full mode, one run, on the Mac Mini over `ssh mini-ts`). Task: research an already-written script ("When Gold Falls, Who Gets Hurt?", Draft 1, 20 Nov 2026, chapters 01-10) in the chain's shape. The source set was fixed by the script's fact ledger (11 named sources) plus one official alternative (RBI NBFC release, S09). Nothing was searched beyond that.

Examined sources: 14 (S01-S14; 13 cited, S13 opened for numbering only).
Tier P cited: 13 (S01-S06, S11, S12, S14 P4 company filings; S07-S09 P2 regulator documents; S10 P4 data owner). No tier X evidence.
Saturation: no. The source set was fixed by the script's ledger; the last sources opened (RBI NBFC release, WGC, Titan, Kalyan) each added a new claim or contradiction (R6b, W3/W4, J1 notes), so the "last four add nothing" test is not met and is not padded. Open leads are in open_questions.md.

Tier X seen in search results and NOT used as evidence (used only to find official URLs): legal500.com, corporate.cyrilamarchandblogs.com, impriindia.com, taxguru.in, iifl.com blog, novojuris.com, cagsc.in, business-standard.com, tribuneindia.com, aninews.in, knnindia.co.in, newsable.asianetnews.com, news.webindia123.com, bestcurrentaffairs.com, gjepc.org/solitaire, jewelbuzz.in. The figures in their snippets (for example 19.1% non-food credit growth) are not used.

## Searches and fetches (all 2026-11-23, all English)
| # | Where | Query / URL | Result | Kept and why |
|---|---|---|---|---|
| 1 | Local (Mini) | Script ledger and `Source files/` | 4 PDFs: Muthoot deck, Manappuram deck, SBI deck, IIFL intimation | Copied to `sources/` as S02, S04, S06, S05 |
| 2 | Local (Mini) | Results archive `DarwinWikiBackup/.../resultengine/docs/` | Found exchange-filed Muthoot PR (two byte-identical copies, 152912 and 153100), Manappuram PR, Titan outcome, Kalyan PR | Copied; later confirmed byte-identical to the NSE archive (row 3) |
| 3 | Fetch (curl, browser UA) | `https://nsearchives.nseindia.com/corporate/<file>.pdf` for the 8 company files named in the ledger | 8 x HTTP 200, sizes identical, `cmp` identical to the local copies | URLs recorded in sources.jsonl; no company-site copy fetched |
| 4 | Web search | RBI Lending Against Gold and Silver Collateral Directions, 2025 rbi.org.in | Official notification pages (Id=12903) plus tier X summaries | Used only to find rbi.org.in |
| 5 | Fetch | `rbi.org.in/Scripts/NotificationUser.aspx?Id=12903&Mode=0` | 200; the 29 Sep 2025 amendment (S13) | Numbering check only (para 12 amended; annex 17A inserted) |
| 6 | Fetch (scan of Ids 12790-12862) | `NotificationUser.aspx?Id=...` | Id 12859 = RBI/2025-26/47, "Updated as on September 29, 2025" | S07; full text inline on the page, saved as html and cleaned .txt |
| 7 | Fetch | S07's PDF links (`rbidocs.rbi.org.in/.../47NTEBC6E8C94DFB432797365CA984734797.PDF`, `.../47NT06062025_AN1.pdf`) | HTML bot-challenge page, not a PDF | Deleted; the inline page text is the saved copy |
| 8 | Web search | RBI Sectoral Deployment of Bank Credit September 2026 | rbi.org.in prid=63891 | Found official URL |
| 9 | Fetch | `rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63891` | 200 (S08) | R6 |
| 10 | Fetch | `rbidocs.rbi.org.in/rdocs/content/docs/SIBC30102026E.xlsx` (Statements I-II) | bot-challenge HTML | Not available: no gold-loan percentage (ledger already says none) |
| 11 | Fetch | `...BS_PressReleaseDisplay.aspx?prid=63940` (NBFC release, 6 Nov 2026) | 200 (S09) | The one official alternative: R6b |
| 12 | Web search | World Gold Council Gold Demand Trends Q3 2026 India Focus | gold.org page | Found official URL |
| 13 | Fetch | `gold.org/goldhub/research/gold-demand-trends/gold-demand-trends-india-focus-q3-2026` | 200, 105 KB (S10) | W2, W3, W4 |
| 14 | Fetch | WGC PDF `gold.org/download/file/21326/Gold-Demand-Trends-India-Focus-Q3-2026.pdf` | HTTP 403 | Deleted; web edition is the saved copy |
| 15 | Read | Rendered pages: Titan pp.3-4, Manappuram deck p.20 | viewed as images | Confirmed OCR figures (Titan) and bar values (Manappuram) |

| 16 | Fetch | ibjarates.com and its 30-days PDF (second pass, 23 Nov) | 200; PDF has rates 19 Oct-23 Nov | S14, claim F1 |
| 17 | Fetch | gold.org/goldhub/data/gold-prices and the Q3 GDT page | 200 but price widget empty (AWAITED) | nothing readable |
| 18 | Fetch | rbi.org.in WSSView.aspx, ibjarates.com/HistoricRates.aspx, indiagoldratesapi.com | WSS page 200 with no gold price read; Historic page 404; API site has no open history | January peak and 30 Sep prices unread |

Not attempted, by the brief's limit: company-site copies of the filings; the ledger's "still cut" items (SBI Research report, RBI Governor quote, Fitch, RBI Financial Stability Report); further price sources beyond IBJA, RBI and WGC.

## Category 1: Patents
Skipped: not an invention story; no patents bear on the question.

## Category 2: Newspapers from the time
Skipped: all claims rest on filings and regulator documents. News sites turned up only in web search and are listed above as tier X.

## Category 3: Digitised books and periodicals
Skipped: a one-quarter financial question; no book or periodical applies.

## Category 4: Journals
Skipped: no scholarly paper is needed for the ledger's claims.

## Category 5: Archives and museums
Searched the Mini's own results archive (row 2) for the exchange-filed copies of four company filings.

## Category 6: Oral histories and interviews
Skipped: the script uses no interview or call. Earnings-call audio (AGENTS.md rule 2) was not needed because every company claim has a filed document.

## Category 7: Official records
Searched: RBI notifications and press releases (rows 4-11) and NSE archive filings (row 3).

## Category 8: The inventor's own publications
Read in place of company histories: Muthoot, Manappuram, IIFL, SBI, Titan and Kalyan results press releases and investor decks (rows 1-3).

## Category 9: Data owners
Searched: RBI sectoral credit releases (S08, S09) and the World Gold Council's India Focus report (S10).

## Category 10: Original language
All sources are English (RBI and exchanges publish English originals). No Hindi, Tamil or Malayalam source is needed.

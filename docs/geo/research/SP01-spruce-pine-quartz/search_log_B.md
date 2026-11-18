# Search log, agent B (Helene, shutdown, rail, recovery), 11 Nov 2026

## Searches / URLs
- WebFetch nhc.noaa.gov AL092024_Helene.pdf: failed (size >10 MB); downloaded with curl, pdftotext -> B14.
- WebSearch Sibelco Spruce Pine restart (sibelco.com): found B01-B04. Sibelco pages show no visible date; dates taken from page metadata datePublished (curl).
- WebSearch thequartzcorp.com Helene: found B05-B07 (pages JS-rendered but curl text OK).
- WebSearch csx.com Blue Ridge: found B08-B10, B12. csx.com and investors.csx.com return Cloudflare 403 to curl/WebFetch; no bypass attempted beyond reading the public web.archive.org copy (B08-B10). FAQ PDF (B12) downloaded directly.
- WebSearch CSX cost (SEC): CSX 10-Q Q1 2025 (B20), Q3 2025 (B21), 10-K 2025 (B22) from sec.gov (excerpts around "Blue Ridge" saved).
- WebSearch NWS GSP Helene summary: weather.gov PDF (B13).
- NCDOT closure dataset PDF (B19, Mitchell rows). NCDOT press releases (100 days, 6 months, Nov 2024) found by search, NOT opened.
- WebSearch Sumco/Shin-Etsu/GlobalWafers/Siltronic/SK Siltron statements: only news/aggregators. Downloaded Siltronic Q3 2024 quarterly PDF, Sumco Q3 2024 JPX PDF, Siltronic Q3 press page: grep Helene/quartz/hurricane = 0 hits. Taipei Times / Carolina Journal / SemiAnalysis pages seen in results but not used (news). Shin-Etsu, SK Siltron, GlobalWafers own sites: nothing found.
- WebSearch Town of Spruce Pine / FEMA / DEQ: FEMA releases found (not opened). Town site not found.
- Sibelco FY2024 results (B16), FY2025 text on corporate-materials (B18), Apr 2023 (B15), Nov 2023 (B11).
- NOT done: USGS NWIS gauge pages (North Toe River at Ellijay etc.), Sibelco annual report PDFs, NCDOT I-40 / I-26 narrative releases, Town minutes, STB/FRA, NC DHHS deaths.

## Popular claims tested
1. "Over two feet (24+ in) of rain on Spruce Pine / North Toe basin": EMBELLISHED/imprecise. NWS GSP: Spruce Pine 6.6 SW CoCoRaHS 24.12 in; NHC: 7 mi SW Spruce Pine 23.31 in (Mitchell County max); Busick (Yancey) 30.78 in, 1200 UTC 25 Sep to 1200 UTC 28 Sep. Say "about 23-24 inches at gauges 6-7 miles from town, over three days". (B13, B14)
2. Both halted 26 Sep 2024: CONFIRMED (B01 Sibelco, B05 TQC; TQC says stopped "in preparation of the event").
3. Sibelco resumed after 15 days (10-11 Oct): MOSTLY CONFIRMED. Release (metadata date 9 Oct 22:00 UTC = 10 Oct Belgium) announces production AND shipments restarted. 26 Sep to 10 Oct = 14 days. "Around ten days after the storm's landfall... two weeks after halt." (B02)
4. TQC restart unknown: PARTLY RESOLVED. 23 Oct 2024 "gradually restarting", "matter of weeks" to normal (B07). Exact shipment restart not found.
5. Sibelco $1M and Rode quote: CONFIRMED with exact words (B04).
6. CSX destroyed line, $450M, first train 25 Sep 2025, 364 days severed: CONTRADICTED / CORRECTED. Cost ~$520M (10-K: ~$50M 2024 + ~$470M 2025; B22) not $450M. 25 Sep 2025 = Blue Ridge Subdivision "returned to service" (B10), CSX does not say first train into Spruce Pine. CSX "resumed operations north of Spruce Pine" mid-January 2025, limited, with The Quartz Company already benefiting (B08). ~60 miles damaged, not the whole line.
7. "Single mountain road": no primary basis found. NCDOT dataset shows NC 226 closures near Bakersville (6-15 Oct), local roads closed; no US 19E closure through Spruce Pine in Mitchell rows (B19). Not an exhaustive check.
8. 3 to 8 months of inventory (SemiAnalysis): UNVERIFIED at primary; wafer makers' own statements not found. TQC's own supply-chain claim in B06.
9. Expansions: $200M (Apr 2023, B15) CONFIRMED; $500M Expansion 2 "of the order of" with prepayments language (Nov 2023, B11) CONFIRMED as a preliminary estimate, not an approved/completed project.

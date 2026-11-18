# Search log, agent C (11 Nov 2026)

## Searches (WebSearch) and what they gave
1. SIA 2025 annual sales release Feb 2026 -> semiconductors.org release (saved C01); found SIA 2026 State of Industry PDF (C31).
2. WSTS forecast 2026 -> WSTS Spring 2026 PDF (C02), Q2 2026 release (C04). No Nov 2026 WSTS forecast found yet.
3. SEMI 2025 annual wafer shipments -> semi.org blocked (Cloudflare, C03); PR Newswire/AAP copy of the SEMI text (C05).
4. SEMI 2024 annual wafer -> AAP copy (C06).
5. Sibelco annual report 2025 HPQ revenue -> results release (C07), AR landing page (C09). No HPQ segment revenue given.
6. Imerys URD 2025 Quartz Corp -> AMF notice only (C08). Imerys site returns HTTP 202/403 (C10 empty). URD PDF not located.
7. Quartz Corp Imerys stake -> TQC history page (C13). "50% interest" appeared only in a search summary of imerys.com (blocked) = UNVERIFIED.
8. TSMC annual report share -> TSMC site Cloudflare block (C12). Only vendor (TrendForce, Counterpoint) shares: banned.
9. SIA/BCG Taiwan share -> BCG 2021 PDF (C11); BCG 2024 briefing (C32) chart labels unreadable, not used.
10. USGS MCS 2026 quartz -> C14, MCS 2025 -> C15. Silicon 2026 -> C17.
11. White House 100-day review -> whitehouse.gov direct failed (empty); Internet Archive copy worked (C18).
12. CRS on HPQ/Spruce Pine -> nothing (results were think tanks/news; banned). EU CRM study 2023 -> C19 (no quartz mention). British Geological Survey: not searched separately (time); say not checked.
13. Czochralski share / Sumco technology -> Siltronic page (C16). Sumco/GlobalWafers/Shin-Etsu technology pages not opened. No primary percentage for CZ.
14. Wafer-maker shares -> only market-research sites. None primary.
15. India: ISM/PIB fabs -> PIB Cabinet 29 Feb 2024 (C22), Semicon 2.0 (C25), ISM home (C20); Rajya Sabha PQ page shell empty (C23); sansad.in PDF fetch empty.
16. India quartz -> IBM Yearbook 2022 (C21), PIB major minerals (C26). GSI not found.
17. India solar ingot/wafer -> PIB ALMM List-III (C24).
18. Dholera coordinates -> Gujarat govt FAQ (C30, only "100 km south-west of Ahmedabad"); coordinates from Wikipedia (non-primary, flagged).
URLs failed: semi.org (Cloudflare), investor.tsmc.com (Cloudflare), imerys.com (bot block), geonames.usgs.gov GNIS (Cloudflare), edits.nationalmap.gov geonames service (404), whitehouse.gov PDF (empty).
Method files: method/fetch_C.sh, method/build_C.py, method/distances.py, method/distances_output.txt.
Note: claim-quote check was run with whitespace collapsed; table rows have multiple spaces in the saved copies.

## Popular claims tested
- "$630B (2024)": Confirmed ($630.5B, SIA C01).
- "$700B (2025)": Contradicted. 2025 was $791.7B at first (Feb 2026), revised to $795.6B (C02, C31). $700B only matches 2025 integrated circuits ($700,975M) in the WSTS table. Use "nearly $800 billion in 2025; WSTS forecasts about $1.5 trillion for 2026".
- "High-purity quartz market $1.5-1.9B": Unverifiable at primaries (vendor figures banned). Sibelco/Imerys publish no HPQ revenue line we could read.
- "Spruce Pine is a single point of failure" per US government: Unverifiable/Embellished. USGS says two companies, no economic substitutes; White House 2021 says quartz crucibles are sole-sourced or not produced in the US; neither names Spruce Pine as a single point of failure.
- "Taiwan ~90% of advanced chips": Confirmed only as 2019 capacity, <10 nm logic, per BCG/SIA 2021 ("~90%"; table 92%). Current share unverified.
- "Most wafers use Czochralski": Partly confirmed (Siltronic: "a large portion"); no percentage at a primary.
- "Quartz crucible from Spruce Pine in every CZ puller": not tested here.
- "India will grow its own wafers": Unverifiable; nothing official found that any approved fab grows ingots or wafers.

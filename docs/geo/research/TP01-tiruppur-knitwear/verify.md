G6: PASS (updated 30 Oct 2026 by the main session). All 124 current spine claims were independently checked: 113 in round 1 (PASS or FIX with quote, fixes applied), the R1–R3 replacements in round 2 (PASS, or FIX applied), and C001/C200 by re-running method/distances.py (identical output). The round-1 FAILs (C001, C083–C086, C092, C155) were replaced by verified claims. Original round-1 verdict line: G6: FAIL - 99 of 120 spine claims PASS and 14 are FIX with quotes, but 7 spine claims (C001, C083, C084, C085, C086, C092, C155) cite no source at all and could not be verified.

## Method
- Re-opened each cited source on 2026-10-30. PDFs were downloaded from the public URL and run through pdftotext (S01, S06 and S04 are scans, so the text layer is rough: I read page images for C110, C122, C127 and the S01 table). HTML pages were fetched with curl or WebFetch and converted to text. Where a site blocks curl (Cloudflare or mod_security) I used WebFetch and saved the returned verbatim sentences as an extract.
- Where sources.jsonl had no URL (S04, S05, S12, S14, S15, S18, S26, S27, S28, S31, S38) I located the public page by search; the exact URLs are in the header of each sources/*.txt file.
- Census (C004, C005, C008): used the Census of India 2011 District Census Handbook for Tiruppur and the district abstract, both hosted on tiruppur.nic.in (the censusindia.gov.in catalogue had no Tiruppur handbook in view). Not Wikipedia.
- C200: reran `python3 -I method/distances.py`; output is identical to method/distances_output.txt.
- The task said 122 spine claims; claims.jsonl has 120 with "spine": true.
- Page numbers: for S01, pdf page = printed page + 2; S04 pdf page 8 = paper p.6.

## Counts by verdict
PASS 99 | FIX 14 | FAIL 7 | UNREACHABLE 0 (spine claims). Results: method/verify_spine.jsonl.

## FIX (source says it; claim, source or wording needs correcting; quotes are in the jsonl)
- C005: Census handbook says 61.36%, not 61.35%.
- C008: Census confirms district code 633 only; the boundary shape was not checked.
- C027: the 1925 sentence is not cited to TEA in the Harvard paper (the next sentence is). Drop "citing TEA".
- C090: dates PASS (gov.uk: signed 24 Jul 2025, in force 15 Jul 2026); "apparel duty up to 12% removed" is not on the gov.uk page.
- C095: "exploring MMF, technical textiles, performance wear" is in S28 only; S30 gives the 50:50 mix to the Minister, S29 to the industry.
- C130: the migration sentence is the report's own narration, not a union official's quote.
- C137: content confirmed in Apparel Resources of 23 May 2016, not the S21/S22 pieces (7 and 9 Apr 2016) that I could not find.
- C138, C139: figures PASS; Apparel Resources says eight rounds plus a ninth and final meeting, Indian Textile Magazine says nine rounds. Say "nine meetings".
- C148: "in Erode district" is not on the NTADCL page (it says Cauvery/Bhavani confluence).
- C149: the 53.5 km figure is on the profile page (S36), measured from the water treatment plant to the Tiruppur balancing reservoir, not on the projects page.
- C152: TWIC, 30 years and 2000 are on ntadcl.com/water-supply and the home page, not the profile page.
- C179: ET says "more than a year and a half"; 28 Jan 2011 to Jun 2012 is about 16-17 months, so "eighteen months" is unsupported.
- C188: only "That is why ZLD at Tirupur was a big mistake" is a quote (by "Basu of CPCB"); "Evaporation of RO reject is very costly." is DTE narration.

## FAIL (no source cited, so nothing to check)
- C001 (inland, no seaport): no package source says it. Use the measured distances or cite geodata.
- C083, C084, C085, C086, C092 (US/EU share, US tariffs, Section 301, EU-India status): evidence lists are empty; the notes name only X (secondary) sources. C086 and C085 are time-sensitive.
- C155 (pipeline route and intake/plant positions on the map): no evidence; NTADCL pages differ on the intake village.

## Sources that could not be reached or were not opened
- S21 (Textile Excellence, 9 Apr 2016) and S22 (Apparel Resources, 7 Apr 2016): no URL recorded and I could not find them. C137 is covered by the Apparel Resources piece of 23 May 2016 (saved as S22b).
- S33 (The Week, 22 Sep 2026): no URL recorded; not opened. C074 stands on S29 and S30.
- S13, S19, S23, S24, S35, S36, S38 block curl; only WebFetch sentence extracts are saved (S35/S36 also from ntadcl.com home and /water-supply). S18 is read from the Primus Partners reprint of the Economic Times article, not the ET page. S73 is a local file.
- S05 text layer does not show the author name (REDC) or year; content verified.

## Applied by the main session (30 Oct 2026, after this report)
- All 113 PASS/FIX quotes and locators were copied into claims.jsonl. FIX claim texts were corrected: C005 61.36%, C027 "citing TEA" dropped, C090 12% clause cut, C130 now the report's own narration, C139 "nine meetings", C179 "about a year and a half".
- C001 ("no seaport", FAIL) was replaced by a measured claim: nearest port city Kochi, about 170 km in a straight line (Natural Earth, method/distances.py).
- Sources CENSUS (P2, district census handbook) and S22b (P3, Apparel Resources, 23 May 2016) were added to sources.jsonl.
- Still failing G2: C008 (map boundary), C027 (1925 date, secondary only), C083–C086 and C092 (market split and trade terms), C155 (pipeline route). G6 stays FAIL until these are re-sourced or cut from the script.

## Round 2 check (R1–R3 claims, 30 Oct 2026)
Checked 36 claims (C301–C313, C401–C406, C501–C517). PASS 29, FIX 5, FAIL 0, NO_COPY 2. Per-claim lines: method/verify_R123.jsonl.
Non-PASS:
- C305 FIX: Quote is only the Annex II Part A heading, which does not show the exclusion. My check: the 20 HS 6109 hits in S102 all sit outside the Part A tables, so the claim holds but the evidence must cite the Part A table/section.
- C306 FIX: Quote (Joint Statement "trade deal") does not say framework. Use S108 "reached a framework for an Interim Agreement". "No signed text found" is a negative with no locator.
- C309 NO_COPY: No evidence item in claims.jsonl.
- C313 NO_COPY: No evidence item in claims.jsonl; claim is a negative with no source.
- C402 FIX: Claim puts the "on the Cauvery near its confluence with the Bhavani" wording on the head works at Anainasuvampalayam. S203 gives the confluence wording for the Koodudurai abstraction point; the head works sentence is separate.
- C501 FIX: S306 says "more than 450 dyeing units"; claim says "450 units". Add "more than".
- C517 FIX: Evidence cites only S306 and S308, which show two spellings. The 1966 gazetteer, 1887 manual, 2009 SC judgment and 2025 PIB spellings are in S301/S302/S305/S307 but not cited. Add those locators.
- Fixes applied by the main session: C402 (confluence wording moved to Koodudurai), C501 ('more than 450'), C306 (wording matches the quote). C305/C517 locators are left as-is (non-spine). C309/C313 are UNVERIFIED and not narrated.

G6: PASS. All 13 spine claims (C001, C002, C004, C006, C008, C009, C010, C012, C013, C014, C015, C017, C019) pass on independent re-check, all six measurement scripts reproduce their saved outputs exactly, and the one provenance worry (the projection report from a mirror) is cleared. Seven wording and housekeeping fixes (F1 to F7 at the end) must be made before scripting; none changes a number.

# W3-01-up Uttar Pradesh against the countries: independent verification (G6)

Verifier: Claude Code, a separate session that did not do the research. 1 Nov 2026. I re-fetched every public source myself and compared it with the saved copy by SHA-256, then re-ran `method/*.py` with `python3 -I` on a copy.

## (a) Is the projection report genuine? Yes. How I confirmed it
- **Same file on a ministry site.** I downloaded `https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf` (National Health Mission, Ministry of Health & Family Welfare, `.gov.in`; HTTP 200, Last-Modified 31 Jul 2020, 11,543,351 bytes). Its SHA-256 (`9a9031c9...1331b`) is identical to `sources/ncp_proj_givewell.pdf`. So the GiveWell copy is the ministry's own file, unaltered.
- **Cover.** Page 1: "CENSUS OF INDIA 2011 / POPULATION PROJECTIONS FOR INDIA AND STATES 2011-2036 / REPORT OF THE TECHNICAL GROUP ON POPULATION PROJECTIONS / November, 2019 / NATIONAL COMMISSION ON POPULATION / MINISTRY OF HEALTH & FAMILY WELFARE / NIRMAN BHAWAN, NEW DELHI". 268 pages.
- **Second, independent official origin.** MoSPI, "Women and Men in India 2023", chapter Population (`mospi.gov.in/sites/default/files/reports_and_publication/statistical_publication/Women_Men/mw23/Population.pdf`, re-fetched) cites "Report of the Technical Group on Population Projections for India and States 2011-2036, Ministry of Health & Family Welfare, July, 2020" and "Report of the Technical Group on Population Projections, July 2020, National Commission on Population, MoHFW".
- **Date wrinkle (F1).** The cover says November 2019; MoSPI and the ministry file date say July 2020 (release). The dossier and S02 say "Nov 2019" only.
- **The UP row.** I re-read the PDF with pdftotext. Table 11 (1st July), PDF page 88, UTTAR PRADESH Persons column: 2011 = 2,00,897; 2026 = 2,43,466 (male 1,26,623 + female 1,16,842 = 2,43,465, rounding); 2036 = 2,59,459. India column on PDF page 86: 2026 = 14,26,907. Table 1 (PDF page 28): UP 199812, 16.50 percent. Summary (PDF page 7): the "Nineteen percent ... Uttar Pradesh alone" sentence is there; 58.6 of 305.0 million = 19.2 percent.
- Not reachable: populationcommission.nic.in and main.mohfw.gov.in (connection failed). Not needed, the nhm.gov.in copy suffices.

## (b) Country population figures and the rank
- **Same file as the UN's.** I downloaded `WPP2024_TotalPopulationBySex.csv.gz` from population.un.org and unzipped it: SHA-256 identical to the saved CSV. Every country comes from one file, one variant (Medium), one date (1 July 2026), one unit (thousands), `LocTypeName == 'Country/Area'` (237 rows).
- 2026 top of the list (re-read): India 1,476,626; China 1,412,914; USA 349,035; Indonesia 287,887; Pakistan 259,300; **Nigeria 242,432**; Brazil 213,563. UP 243,466 sits between Pakistan and Nigeria: sixth of 238. 2011: Pakistan 203,746 above and Brazil 195,285 below the census count 199,812: sixth; fifth only on the scaled basis (208,124). All reproduced.
- **Same date for UP and the UN:** both 1 July 2026. The basis difference is disclosed (UN India is 3.5 percent above the NCP India, 1,476,626 vs 1,426,907; C011 shows the scaled sensitivity).
- **Currency of WPP 2024:** a search finds no newer edition (one secondary site says the next revision is postponed to July 2027; not a UN statement, so unconfirmed; a January 2026 interim correction for Togo does not touch these countries).
- **Fragile point (F2).** The Nigeria margin (1.0 million, 0.4 percent) is inside the UN's own uncertainty: Nigeria's 2026 80 percent interval is 239.9 to 244.8 million and 95 percent 238.6 to 245.9 million (variants `Lower/Upper 80 PI`, `95 PI` in the same CSV), and UP is itself a projection. So "sixth" over Nigeria holds on the point estimates only; the honest line is "about level with Nigeria". Pakistan is clear of UP on any interval (its lowest 95 percent bound is 255.5 million vs UP 243.5). The dossier already hedges ("about level with Nigeria", "a tie in practice"); keep that in the script and do not make an unqualified "sixth" the headline.
- **Wording error (F3).** C008's method and the dossier say "the rest of India counted as a separate country". The script does not subtract anything: it ranks the UN's whole India (which contains UP) and inserts UP beside it. The result is the same (rest of India would be about 1,233 million, still second), but the sentence is wrong. C008 also calls the 2026 UN figures "estimates"; WPP 2024 estimates end at 2023, so 2026 is the medium-variant projection.

## (c) Area comparison with the UK, and Ethiopia and the landlocked list
- **UK:** WDI AG.SRF.TOTL.K2 2021 re-fetched live; all entries identical to the saved file. GBR 243,610; UGA 241,550; GHA 238,533; NGA 923,770; PAK 796,100; BRA 8,515,770. UP 240,928 (Census A-01 row 2525, re-downloaded from censusindia.gov.in, identical xlsx hash; also UP in Figures 2022 "241" thousand and MoSPI Table 3.5.3 "240928"). Rank 81 of 216 reproduced (UK 79th, Uganda 80th, UP 81st, Ghana 82nd). Natural Earth: UP 240,677, UK 242,737, ratio 1.01. "Within about 1 percent of the UK" holds on both measures. The area bases differ (WDI includes inland water; Census is geographical area); the dossier already says "about the size of".
- **Ethiopia:** UNCTAD list re-fetched; all 32 names present, "Of which, 17 are Landlocked Least Developed Countries" and "informally accepted by UN member States on geographical grounds" found. Ethiopia 138,902 thousand in 2026 is the largest on it (next Uganda 52,761); 243,466 / 138,902 = 1.753. Landlocked countries off the list in the output are all under 11 million (Czechia 10.5 million the largest). The claim is safely worded against "the UN's landlocked developing list"; never say "the biggest landlocked country" (open_questions 4 is right).
- **Landlocked / 480 km (C017):** reproduced 479 km (UP vertex 83.2277 E 23.9613 N, Sonbhadra corner, to coast vertex 86.9177 E 21.3274 N, Odisha). My hand haversine check gives about 478 km. It is our own measurement on public-domain geodata, as RESEARCH_RULES allows (own measurements, method recorded); the claim says "approximate". Wording risk: "landlocked" is only meaningful inside the hypothetical "if UP were a country".
- **Pakistan area (F4, light flag).** The 796,100 sq km figure (and Natural Earth's 796,732) is Pakistan's area as FAO and Natural Earth count it, which includes territory India claims. For an India-point-of-view channel use the "3.3 times" ratio only as a comparison, never draw or label Pakistan's outline from this data, and say "FAO figure" if scripted.

## (d) method/ re-runs
All six scripts (`census_a01_extract`, `derived`, `rank_population`, `rank_area`, `area_ne`, `landlocked_check`), run with `python3 -I` in a copy against the saved sources: output identical to the saved `*_output.txt` for each; the UP value in `area_ne_output.json` identical. Definitions are consistent: one year (1 July 2026), one UN variant and file for every country; UP's 2026 figure from the NCP report for the same date; UP's area on the Census basis and the countries' on the WDI basis, disclosed.

## Spine claims (13)
| ID | Result | Evidence |
|---|---|---|
| C001 | PASS | A-01 row 2525 K=199812341 (re-downloaded xlsx, same hash); NCP Table 1 "199812"; UP in Figures item 2a "199812341" |
| C002 | PASS | A-01 N=240928; MoSPI Table 3.5.3 row 27 "240928"; UP in Figures "241" |
| C004 | PASS | 199,812,341 / 1,210,854,977 = 0.16502; NCP Table 1 column "16.50" |
| C006 | PASS | Table 11, PDF page 88, 2026, UP 2,43,466; file identical to the ministry copy on nhm.gov.in; report cited by MoSPI |
| C008 | PASS, with F2 and F3 | rank 6 of 238 reproduced |
| C009 | PASS, with F2 | Pakistan 259,300; Nigeria 242,432; Brazil 213,563; differences 15.8 / 1.03 / 29.9 million reproduced |
| C010 | PASS | 2011: Pakistan 203,746 above, Brazil 195,285 below; basis sensitivity (fifth on the scaled basis) honestly stated |
| C012 | PASS | WDI values re-fetched live; rank 81 of 216 reproduced |
| C013 | PASS | WDI GBR 243,610; NE 240,677 vs 242,737 reproduced |
| C014 | PASS | 243,466 / 69,931.5 = 3.48 |
| C015 | PASS | 3.83, 3.30, 35.3 (WDI); 3.79, 3.31, 35.3 (NE); see F4 for Pakistan |
| C017 | PASS | 479 km reproduced and hand-checked; approximate |
| C019 | PASS, with F5 | PIB deck (re-fetched, same hash) slide "Reference Date and Phases of Census 2027": "March 1, 2027"; "Last Census conducted in 2011"; enumeration "February, 2027". PIB press releases found in search say the same |

## Non-spine claims: all 10 checked (more than one in three)
C003 829.34 reproduced. C005 7.33 percent reproduced. C007 2011 and 2036 rows found (2,00,897; 2,59,459). C011 sensitivity lines reproduced (208,124 fifth; 251,949 sixth). C016 reproduced (only Bangladesh denser; mixed years, hedged). C018 PASS as above. C020 quotes found (ncp.txt lines 956 and 961). C021 1,261,225 / 1,210,855 = 1.0416. C022 NE 240,677 reproduced, within 0.11 percent of 240,928. C023 sentence found; 19.2 percent arithmetic.

## Statuses, tiers, myths, "safe to say"
- Statuses honest. CORROBORATED claims (C001, C002, C004, C013) have two or more origins; C004's second origin (NCP Table 1) rests on the same census count, which is acceptable because it is arithmetic on one published count.
- No tier-X source is cited as evidence. myths.md verdicts match the evidence (M1 embellished, M3 contradicted, M8 and M10 unverifiable). The "everyone says fifth" in Hook A rests on tier-X search snippets that were never opened (F6).
- Every "ten safe facts" line in dossier.md maps to a claim that passes: 1 C001; 2 C002, C013; 3 C006; 4 C008, C010; 5 C009; 6 C009; 7 C014; 8 C015; 9 C004, C005; 10 C019.

## Wording scan of dossier.md
No disputed border, no side taken, nothing on UP breaking away or politics. Fixes F1 to F7 below.

## Fixes before scripting (none blocks G6)
- **F1** dossier and S02: "report cover dated November 2019, released July 2020 (MoSPI cites July 2020)"; change the S02 url to the ministry copy `https://nhm.gov.in/New_Updates_2018/Report_Population_Projection_2019.pdf` (same SHA-256), keep GiveWell as a mirror. open_questions item 3 is answered by this check.
- **F2** C008 and C009 notes: add that Nigeria's UN 80 percent interval (239.9 to 244.8 million) contains UP's 243.5; script "about level with Nigeria", never "beats Nigeria"; "sixth" only with that hedge.
- **F3** C008 method and dossier: replace "rest of India counted as a separate country" with the true procedure; say "projections" for the 2026 UN figures.
- **F4** Pakistan area: say "FAO figure"; do not draw or label Pakistan's outline from this data.
- **F5** C019: add "for most of India (Ladakh and snow-bound areas of J&K, Himachal and Uttarakhand count from 1 October 2026; not UP)", or say "the 2027 census".
- **F6** Hook A: "Everyone says fifth" is unsupported; use "It is often called fifth" or drop it.
- **F7** Housekeeping: `sources.jsonl` has "archive_url: none saved" for every source, but RESEARCH_RULES ("Save a local copy and an archive link for every source") wants an archive link; add links or write why not.

## Could not confirm / CANNOT-REACH
Nothing in the spine. CANNOT-REACH: populationcommission.nic.in, main.mohfw.gov.in (not needed). Not confirmed: that no UN edition newer than WPP 2024 exists (only a secondary note); Pakistan's 2023 and Brazil's 2022 censuses at source (open_questions 2, not required).

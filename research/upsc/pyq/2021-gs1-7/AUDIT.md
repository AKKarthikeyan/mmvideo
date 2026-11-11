# Audit (gate S5) of 2021-gs1-7

Auditor: independent reviewer, 2026-11-10. Did not write the ledger.

## Method
Reopened every row at its saved local file (NCEI JSON parsed; UN News, ACP, NHESS and Scientific Reports pages text-searched at the cited passage) and the ledger rows GEO-04 V043, V047, V060, V064. Rechecked value, attribution, status. Canonical URLs of both UN News pages match the cited URLs. No live fetches needed.

## Counts
PASS 14, FIX 3, FAIL 0 (of 17 rows). FIXes are applied in claims.csv.

## Table
| claim_id | verdict | evidence | fix |
|---|---|---|---|
| 2021-GS1-7-01 | PASS | JSON has exactly 7 items; dates, countries match; Americas 3, Europe 2, Africa 1, Asia 1. |  |
| 2021-GS1-7-02 | PASS | vei 4,4,3,2 and St Vincent damage 325 in JSON. |  |
| 2021-GS1-7-03 | FIX | NCEI: deaths 32, houses 5000. UN News has the destroyed-houses/schools/water line, but 'killed over 30' is an IOM quote, not OCHA. | attribution corrected in claim and note |
| 2021-GS1-7-04 | PASS | UN News: 'approximately 400,000 people are potentially affected by the evacuation order' (OCHA's Laerke). |  |
| 2021-GS1-7-05 | PASS | UN News 12 Apr: dormant since 1979, ~16,000 evacuated, entire population without clean water/electricity; 20,000 evacuees in need of shelter also there. |  |
| 2021-GS1-7-06 | PASS | Quote on banana farming, ash and lava flows, northern livelihoods present. |  |
| 2021-GS1-7-07 | PASS | ACP intro: 85 d, 1.8e8 m3, 12 km2, 2.3e7 m3, several thousand evacuated, ~3000 buildings (EMSR546); start 19 Sep 2021. NCEI 1,345 houses/924 M/1 death verified. |  |
| 2021-GS1-7-08 | PASS | Abstract: 1.8+/-0.2 Mt SO2, 19.4+/-1.8 Mt CO2, 0.05 HCl, 0.013 HF; 1.84 Mt Milford 2023 in intro. |  |
| 2021-GS1-7-09 | PASS | 1000-6000 m a.s.l.; N Africa, Europe, Atlantic to Caribbean. |  |
| 2021-GS1-7-10 | PASS | USGS FS 113-97 (ledger V060): nearly 20 million tons, 0.5 C, 1991-93; 1.8/20 = 9%. Labelled own arithmetic. |  |
| 2021-GS1-7-11 | PASS | NHESS: 19 March 2021, first on Reykjanes in ca. 800 years, 180 m fissure, Geldingadalir, 'eruption stopped on 18 September'. |  |
| 2021-GS1-7-12 | FIX | 150.8e6 m3, 4.85 km2, 124 m all present; 'within sight of Reykjavik' not in the paper. | wording replaced with paper's 'backyard of the capital' |
| 2021-GS1-7-13 | PASS | Sci Rep 12: 13-15 Aug 2021, 1300 km west, ~2 months to Okinawa. Second paper title confirmed (as the row says, read for title only). |  |
| 2021-GS1-7-14 | PASS | Abstract/intro: reefs, mangroves, WNH 2021, fishing and ship traffic obstacles, Lepas barnacle on pumice. |  |
| 2021-GS1-7-15 | FIX | JSON: vei 4, deaths 51, deathsTotal 45, missing 9, houses 2970, damage 20: all match. 'Agent is pyroclastic flows' is not in the file (agent 'T', no legend). | claim text trimmed, note records why |
| 2021-GS1-7-16 | PASS | Ledger V064 exists and holds Hunga Tonga 15 Jan 2022 VEI 6; the saved NCEI file confirms. |  |
| 2021-GS1-7-17 | PASS | Pointer row, honestly UNVERIFIED. V043 holds Barren Island as India's only active volcano; V047 is BLOCKED (current status not read). |  |

## NOTES.md mapping
All parts of the question map to claims: global occurrence (01, 02, 17, 16; total count honestly marked unsupported) and regional impacts (St Vincent 05-06, Nyiragongo 03-04, La Palma 07-09 with scale 10, Iceland 11-12, Pacific pumice 13-14, Semeru 15). Unsupported parts: total number of eruptions in 2021, SO2 at Fagradalsfjall, Barren Island 2021, any 2021 global climate effect. NOTES.md already says so.

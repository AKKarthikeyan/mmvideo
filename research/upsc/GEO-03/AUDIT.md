# GEO-03 Earthquakes and tsunamis: independent audit of claims.csv (gate S5), 11 Nov 2026

**Method.** All 74 rows were reopened at the cited page or section: NCERT PDFs by printed page (pdftotext per page), NDMA 2007 and 2010 texts at the cited paragraph, PIB replies in full, the NOAA FAQ and NCEI text, the INCOIS text, the DM Act copy, and the USGS ComCat JSON parsed (magnitude, type, depth, coordinates, UTC time). Value, speaker and capacity, strength, date and our-own-inference lines were compared, not phrases alone. One new primary source was fetched once (PIB 2205330, saved to sources/mha). No CAPTCHA or bot check was touched.

**Result.** PASS 47, FIX 21, FAIL 0, FLAGGED 6 (total 74). Every FIX was a clear correction and is applied in `claims.csv` ("[Audit 11 Nov 2026]" in the note). Status counts after edits: CONFIRMED 51, CORRECTED 10, CONFLICT 6, NOT FOUND 3, UNVERIFIED 3, BLOCKED 1. The six CONFLICT rows were each read on both sides, named correctly and kept. Backup of the original: scratchpad `claims.orig.csv`.

## Points you asked about

- **CONFLICT rows (A23, A36, A40, A45, A47, A60):** each side confirmed. A45 USGS 9.1 mw (ComCat, 00:58:53 UTC, 3.295 N 95.982 E, 30 km), NCERT Class 7 p.34 "9.0 on the Richter scale", NDMA annex row 10 "MW 9.3". A60 USGS 7.7 mwc (03:16:40 UTC, 16 km, 17 km NW of Bhachau), NCERT Class 7 p.14 "6.9", GSDMA page "7.9 on the Richter scale". A47 NOAA 227,899 killed or missing, 1,126,900 displaced; NDMA 238,000 incl. 51,500 missing, over 1.5 million, 14 countries; NCERT Grade 9 "2,30,000", Grade 6 "more than two lakh", Class 11 "more than 300,000". A36 NOAA over 7.0 (under 100 km) and over 8.0 for distant; NDMA over 6.5; NCERT over 5 is for quake effects, not tsunami (the row says so). A40 NCERT 150 m unnamed; NOAA NCEI 525 m is tree-removal splash height at Lituya Bay (tsunami at least 50 m in the bay): different measures, correct. A23: see below.
- **Four CORRECTED NCERT rows (A09, A33, A37, A63):** all fit. A09 NCERT "0-10" and "1-12" v USGS "no upper limit", MM 12 Roman levels. A33 NCERT Class 7 p.34 "huge tidal wave" v NOAA FAQ 1.3. A37 kegy106 p.59 says speed is "more in the shallow water than in the ocean deep", backwards; NOAA FAQ 3.2 correct (the "p.59" in A33's note was wrong: Table 6.1 is p.55, fixed). A63 NCERT p.68 calls it a Bill and drops "property" and "degradation"; Act s.2(d) and 23 Dec 2005 confirmed.
- **IS 1893 and the March 2026 withdrawal (A24, A25):** the reply is read correctly. Dr Jitendra Singh, MoS (IC) Earth Sciences, Lok Sabha, 1 Apr 2026: "remains the current standard, as the revised zonation has been withdrawn in March 2026". It does not say who withdrew or what the revision was. Zones II-V appear only as labels "as per IS 1893 (Part-1):2016" in a table of 14 stations (HP: IV, V; Karnataka: II, III), counts 5, 2, 3, 4 as the row says. This is not a statement about the whole map. New: MoES reply PIB 2205330 (17 Dec 2025) cites an "updated seismic zonation map" with the Himalayan arc in Zone VI, so the withdrawn revision is the Zone VI map. The BIS or Gazette notice is still not found (A25 stays NOT FOUND).
- **NCS station count (A14):** 170 observatories confirmed (PIB 1 Apr 2026) and NCS home "more than 170 stations". Older counts in saved files are 115 (30 Jul 2021) and 166 (19 Dec 2024); the note's "152" is in no saved file (removed).
- **ITEWC dates (A51-A53):** INCOIS: operational since October 2007 (no day). RTSP designation 12 Oct 2011 and 24 countries: PIB 1486040 (29 Mar 2017). 25 countries: PIB 1657421 (21 Sep 2020). The "2011 v 2012" remark was unsupported (removed). 400 seismometers, M4.0+ in the 2017 release.
- **NDMA 2004 figures (A47, A48):** 238,000 incl. 51,500 missing, over 1.5 million displaced, fourteen countries; India 10,749 dead and 5,640 missing: all in section 1.3.1. Annex row 10 says "More than 200,000" and MW 9.3, a second NDMA number.

## Row verdicts

| claim_id | verdict | evidence | exact fix |
|---|---|---|---|
| G3-A01 | PASS | kegy203 p.19 focus/hypocentre/epicentre; USGS severity text same terms. | |
| G3-A02 | PASS | gess203 p.13 "Greatest damage is usually closest"; USGS "maximum observed intensity generally occurs near the epicenter". | |
| G3-A03 | PASS | kegy203 p.19 locked blocks slide abruptly; USGS "shearing movements along faults". | |
| G3-A04 | PASS | kegy203 pp.19-20 P first, S lag, surface last and more destructive; USGS gives no order (note says so). | |
| G3-A05 | PASS | kegy203 p.20 S only through solids; USGS interior: outer core presumed liquid. | |
| G3-A06 | PASS | kegy203 p.20: both within 105; P band 105-145; S nothing beyond 105; "a little over 40 per cent". | |
| G3-A07 | PASS | gess203 p.13 box P longitudinal, S transverse, L surface. | |
| G3-A08 | PASS | kegy203 pp.20-21 five kinds, tectonic "most common". | |
| G3-A09 | PASS | see CORRECTED list above; USGS lines on no upper limit and 12 levels read. | |
| G3-A10 | PASS | USGS: magnitude one number, intensity varies by place. | |
| G3-A11 | PASS | USGS 1989 "about 31"; Johnston 1990 abstract "32" in energy, "10 in ground motion". | |
| G3-A12 | PASS | ComCat JSON parsed: Sumatra M9.1 mw; Bhuj M7.7 mwc. Johnston: "we don't use the Richter scale anymore". | |
| G3-A13 | FLAGGED | BLOCKED stays (usgs.gov bot check, not bypassed). | |
| G3-A14 | FIX | see above. | Note only: 152 removed, table scope, older counts named. |
| G3-A15 | PASS | NDMA p.7 para 1.1.1: about 59 per cent, MSK VII and above (IS 1893:2002 map). | |
| G3-A16 | FLAGGED | NOT FOUND stays; MSK definition and BIS scale statement not read. | |
| G3-A17 | PASS | iest102 p.15 boundaries and San Andreas. | |
| G3-A18 | PASS | USGS caption "Ninety percent"; "Less than 10 percent ... plate interiors". | |
| G3-A19 | PASS | kegy106 p.55 one centimetre a year, locked plates. NCERT-only figure, flagged. | |
| G3-A20 | PASS | NDMA p.7 para 1.1.2: 8.7, 8.0, 8.3, 8.6, "exceeding 8.0 on the Richter Scale". | |
| G3-A21 | PASS | NDMA p.8 para 1.3.2 Koyna 1967, Latur 1993; kegy106 p.56 Gujarat and Maharashtra years, Bhima fault. | |
| G3-A22 | FIX | NDMA p.7 list and "over 23,000 deaths ... 6 major" confirmed. | Note ref G3-A52 changed to G3-A61. |
| G3-A23 | FIX | CONFLICT kept; see above. | Note: support for four zones named (NDMA Table 2, MoES 2021, PIB 2026 table); BIS text unread. |
| G3-A24 | FIX | read correctly; see above. | Note: answerer, scope, Zone VI context. |
| G3-A25 | FLAGGED | NOT FOUND stays; PIB 2205330 is partial. | Note updated with PIB 2205330. |
| G3-A26 | FIX | NDMA Table 2 p.10 numbers exact; 2021 reply says "four seismic zones", ~11, 18, 30 per cent. | Note: reply date 12 Mar 2021 (PIB 15 Mar). |
| G3-A27 | FIX | NDMA p.8 "past trends", "return period"; NCERT p.56 names the bodies differently. | Claim: NCERT's own institution names. |
| G3-A28 | PASS | kegy106 pp.56-57 lists, Deccan "safe". | |
| G3-A29 | PASS | NCS home "nodal agency"; PIB 1 Apr 2026 same. | |
| G3-A30 | FIX | PIB 1486040 EEW pilot and "not developed anywhere" confirmed; gess203 p.14 animals. | Note: Dec 2025 status (still progress, no national system). |
| G3-A31 | PASS | gess203 p.14 safe spot and stay-away list. | |
| G3-A32 | PASS | gess205 p.34 box; NOAA FAQ 1.2-1.3. | |
| G3-A33 | FIX | claim correct. | Note: Table 6.1 is p.55. |
| G3-A34 | PASS | NOAA FAQ 2.1 "88%"; NDMA exec. summary list. | |
| G3-A35 | PASS | FAQ 2.2.1 thrust faults, "10-15 percent" strike-slip. | |
| G3-A36 | FIX | CONFLICT kept; see above. | Note: wrong row ref and over-reading fixed. |
| G3-A37 | PASS | FAQ 3.2 over 500 mph, 20-30 mph, 475 mph at 15,000 ft; kegy106 p.59 backwards. 500 mph = 805 km/h. | |
| G3-A38 | FIX | FAQ 3.3 "hundreds of miles", "rarely more than three feet". | Claim: miles, with NCEI's kilometres. |
| G3-A39 | PASS | FAQ 3.1, 3.3; iest201 "30 metres"; kegy106 "15m or more". | |
| G3-A40 | PASS | gess205 p.34 "150m"; NCEI 525 m splash, 50 m in bay. CONFLICT fits. | |
| G3-A41 | PASS | NDMA 1.4.2 shaking, receding shoreline, bubbles, colour; FAQ 3.4 "suddenly recede". | |
| G3-A42 | PASS | FAQ 4.5 "about 100 times faster". | |
| G3-A43 | PASS | NDMA p.xxii five regions; section 3.1 two warning zones. | |
| G3-A44 | FIX | annex row 9 figures exact. | Note: NDMA gives Ms 8.2 in 1.2.1. |
| G3-A45 | PASS | CONFLICT kept; values above. | |
| G3-A46 | PASS | NCEI: megathrust, India under Burma plate, "killed more people than any other". | |
| G3-A47 | PASS | CONFLICT kept; figures above. | |
| G3-A48 | FIX | NDMA 10,749 + 5,640; NCERT lists differ by book. | Note only. |
| G3-A49 | FLAGGED | gess205 pp.34-35 says "completely submerged"; no official source. UNVERIFIED stays. | |
| G3-A50 | FIX | iest201 p.9: "largely spared", "partly". | Claim reworded; UNVERIFIED stays. |
| G3-A51 | FIX | Oct 2007, 10 minutes, channels exact (INCOIS pdf p.1). | Note: why status stays CONFIRMED. |
| G3-A52 | FIX | 12 Oct 2011, 24 countries (2017); 25 (2020). | Note corrected. |
| G3-A53 | PASS | PIB 1486040 para 2. | |
| G3-A54 | PASS | iest201 pp.12-14 chain, SMS, satellite; INCOIS channels. | |
| G3-A55 | FIX | NDMA 3.1.1, 3.1.2, 3.1.8. | Claim: BPRs not buoys; "envisaged". |
| G3-A56 | PASS | NDMA 3.3.1, 3.4.1: 60 minutes, thresholds 2 m, 0.5-2 m, under 0.5 m; T+20, T+30. | |
| G3-A57 | PASS | INCOIS pdf: 11 indicators, two villages, 7 Aug 2020, National Board. | |
| G3-A58 | FLAGGED | NOT FOUND stays. | |
| G3-A59 | PASS | NDMA contents ch.4 (p.45), ch.5 (pp.59-64), 5.2 Bio-Shields. Contents-level only, as flagged. | |
| G3-A60 | PASS | CONFLICT kept; values above. | |
| G3-A61 | FIX | see CORRECTED list. | Claim and value: scope of 12,932 unclear. |
| G3-A62 | PASS | GSDMA page: registered 8 Feb 2001; 50 check-dam reservoirs. | |
| G3-A63 | FIX | status CORRECTED fits. | Note: NCERT drops "property". |
| G3-A64 | PASS | Act s.3(2)(a) PM; s.14 CM; NDMA dates April 2007, August 2010. | |
| G3-A65 | FIX | PIB 2146781: assent 29.03.2025, force 09.04.2025, Shri Nityanand Rai. | Note: second source is the Bill. |
| G3-A66 | FLAGGED | kegy106 p.68 three stages, "two-third"; UNVERIFIED stays (NCERT-only). | |
| G3-A67 | PASS | kegy106 p.57 four steps; NDMA pp.7-8 bhongas, dhajji diwari. | |
| G3-A68 | FIX | effects list and tsunami condition in kegy203 p.21. | Quote moved to kegy106 p.54. |
| G3-A69 | PASS | gess205 spring and neap tides. | |
| G3-A70 | PASS | gess205 p.34 wind waves; tsunami from quake, volcano, landslide. | |
| G3-A71 | FIX | iest201 Mariana, longest range, trenches. | "usually" to "often". |
| G3-A72 | PASS | kegy106 p.59 refers to Banda Aceh visuals; kegy306 text June 2004 image. | |
| G3-A73 | PASS | kegy106 p.55 Table 6.1. | |
| G3-A74 | PASS | kegy106 p.54 hazard v disaster, Mumbai and Chennai; Act s.2(d). | |

## Gaps (no factual error)

1. A25: BIS/Gazette notices for the 2025 revision and the withdrawal remain unread; the Zone VI map exists only in MoES replies (PIB 2205330, 17 Dec 2025).
2. A12/A13: USGS explainer pages unread (bot check).
3. A22: no source for post-2007 Indian quakes.
4. Several rows are single source (A06, A15, A44, A56, A57, A73) and need S4 before on-screen use.

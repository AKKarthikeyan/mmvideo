# Audit (gate S5): 2019-GEO1-1A (phreatic eruptions and their consequences)

Method: independent audit, 11 Nov 2026, following 2024-gs2-12/AUDIT.md. Each row was reopened at its saved local file (pdftotext for the JMA booklet and Cabinet Office PDF; saved text for GeoNet, WorkSafe, USGS) at the cited page; value, holder, date and wording compared. No bot check was bypassed; no new site was fetched. Fixes applied in claims.csv (valid CSV re-checked); changed rows carry '[Audit 11 Nov 2026]'.

**Counts:** 15 rows: PASS 10, FIX 2 (-04, -06), FLAGGED 3 (-05, -14 UNVERIFIED; -15 NOT FOUND, all correctly left).

| claim_id | verdict | evidence | fix |
|---|---|---|---|
| -01 | PASS | USGS GIP glossary (updated 24 Jun 1997) entry matches | - |
| -02 | PASS | volc_text lines 329-332 match; 'no new magma is erupted' | - |
| -03 | PASS | lines 332-335: Taal 1965, La Soufriere 1975-76, no casualty claim made | - |
| -04 | FIX | GeoNet passage matches; page is dated Tue 10 Dec 2019, not 'after 9 Dec' | as_of corrected |
| -05 | FLAGGED | UNVERIFIED (bot check on usgs.gov), correctly kept | - |
| -06 | FIX | 2.11pm NZST, 1-2 min, 12,000 ft (3-4 km), Level 1 to 2 on 18 Nov all match. But the page never says in words that 9 Dec was 'phreatic' (it defines the term and says magma-water contact is not believed at Whakaari): the label is our inference. It also says the Level 'was at Level 4' during the eruption (assigned afterwards) | note added |
| -07 | PASS | wet volcano, crater lake, little-to-no warning, projectiles, ash, surges; 'any Volcanic Alert Level' match | - |
| -08 | PASS | WorkSafe release 30 Nov 2020: 22 lost their lives, 47 on the island | see holder note |
| -09 | PASS | Update #10, Sat 14 Dec 2019: no further eruptions, degassing at shallow depths, 'highly volatile', ashfall not beyond active vent area. The '50 km offshore' remark is from the news item, as the note says | - |
| -10 | PASS | JMA portal: erupted at 11:52 JST on 27 September 2014 | - |
| -11 | PASS | JMA booklet PDF p.4: plume about 7,000 m above the crater (Japanese: from crater rim), ballistics about 1 km, flows about 2.5 km SW and 1.5 km NW, ash eruptions to about 10 Oct (Japanese text), 58 dead, 5 missing, 69 injured (FDMA, 6 Nov 2015); English text gives 63 dead or missing. Sums agree | - |
| -12 | PASS | Cabinet Office 2024 white paper PDF p.8: 'difficult-to-predict phreatic eruption', 11:52, 63 dead or missing, 15,000+ personnel until 16 Oct (20 days) | - |
| -13 | PASS | PDF p.12: entry restrictions after Level 1; evacuation facilities, radio system | - |
| -14 | FLAGGED | UNVERIFIED, correctly kept | - |
| -15 | FLAGGED | NOT FOUND, correctly kept (outside brief) | - |

## Points asked about
- **Whakaari 9 Dec 2019 and GeoNet:** GeoNet (GNS Science, Earth Sciences NZ) is the right holder for time, duration, column height and alert levels. It does not give deaths, and does not itself call the event 'phreatic' in words (-06).
- **22 deaths and WorkSafe:** WorkSafe NZ is the work-safety regulator that investigated and filed charges; the figure is its own statement as of 30 Nov 2020, adequate as an official source. The authority for cause and count of death would be the Coroner or NZ Police (not read). Cite as 'WorkSafe NZ said 22 people lost their lives'. Verdict PASS.
- **Ontake figures (JMA booklet):** all re-extracted and match, including the Japanese-only items (ash to about 10 Oct; 58+5+69). The booklet does not use 'phreatic' for Ontake; the Cabinet Office does (-12), and its 63 dead or missing equals 58+5. Cabinet Office statement matches at pp.8 and 12.

## NOTES.md coverage of GEO-04 ids
V003 (CORRECTED), V007 and V063 (CONFIRMED) all exist and are usable. They are general volcano facts (magma v lava, bombs and ash, ash risk to aircraft), not specific to phreatic eruptions; V063's '80 jets' is a 2008-text figure, so do not use it as current. No GEO04/POL03 id is cited with a status that is not usable.

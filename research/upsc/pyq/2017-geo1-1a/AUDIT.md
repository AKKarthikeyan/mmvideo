# Audit (gate S5): 2017-GEO1-1A (note on pseudovolcanic features)

Method: independent audit, 11 Nov 2026, following 2024-gs2-12/AUDIT.md. Rows reopened at saved local files (USGS GIP text and fs002-97 in GEO-04/sources, OF 96-24 glossary, NASA EO page, the saved PMC paper, OSTI abstract, NCERT PDF via pdftotext). Mindat, Springer, PMC and usgs.gov are bot-checked and were not retried. Fixes applied in claims.csv; changed rows carry '[Audit 11 Nov 2026]'.

**Counts:** 12 rows: PASS 2 (-05, -08), FIX 5 (-03, -04, -06, -07, -09), FLAGGED 5 (-01 NOT FOUND; -02, -10 UNVERIFIED; -11, -12 NOT FOUND, all correctly left).

| claim_id | verdict | evidence | fix |
|---|---|---|---|
| -01 | FLAGGED | No publisher definition of 'pseudovolcanic'. The working definition is labelled as ours on the row and in NOTES.md | - |
| -02 | FLAGGED | Mindat snippet only, correctly UNVERIFIED; not to be quoted | - |
| -03 | FIX | NASA text matches (rootless cones, no magma-chamber link, lava over swamps or ponds, Mývatn). But '(pseudocraters)' is not in the NASA text, and as_of '2022' was wrong: Image of the Day 11 Feb 2020, Landsat image 26 Jul 2017 | claim and as_of corrected |
| -04 | FIX | USGS lines 370-381 match; USGS says 'seem to represent the last stage', the row said it flatly. 'Secondary/post-volcanic' is our label, not USGS's | wording softened |
| -05 | PASS | lines 380-383: about every 65 minutes; mechanism 'not completely understood'; 1997 figure flagged | - |
| -06 | FIX | OF 96-24 quote and H2S text match. The 'more than 90%' is on the superseded FS 002-97 and is a CONFLICT in GEO-04 V005; row said CONFIRMED with the figure | figure demoted to 'largest part' |
| -07 | FIX | Values match the saved paper (impact crater in ~65 Ma Deccan basalt; ~1.83 x ~1.79 km; ~150 m). Citation 'James et al.' wrong: first author is Saranya R Chandran. The impact origin is the authors' statement in a review citing Fredriksson et al. 1973 (not opened) | citation corrected |
| -08 | PASS | OSTI abstract (US DOE index of the J. Geol. Soc. India 53(3), Mar 1999 paper): authors Hema Achyuthan (Anna University) and Chris Eastoe (University of Arizona); mud with illite, kaolinite, microfossils, volcanic glass, brine, methane, pyrite nodules of sedimentary origin all match. A peer-reviewed paper's abstract by its authors, reached via an index; the full paper was not read | - |
| -09 | FIX | NCERT Grade 9 text matches (printed p.19, which is PDF p.7). 'India's only mud volcano' is the Fig. 2.7 caption. 'Not magma' is our reading of 'Unlike fiery volcanoes'; the abstract does not say what drives the vent | page and labelling corrected |
| -10 | FLAGGED | UNVERIFIED, correctly kept | - |
| -11 | FLAGGED | NOT FOUND, correctly kept | - |
| -12 | FLAGGED | NOT FOUND, correctly kept | - |

## Points asked about
- **Each feature's description at its source:** rootless cone (NASA), geyser, fumarole, hot spring (USGS), Lonar (Geoheritage review), Baratang (OSTI abstract and NCERT) all have a description at a source. The grouping of these as 'pseudovolcanic' has no source, and USGS treats geysers, fumaroles and hot springs as volcanic-heat features: the note must say the grouping is ours.
- **Lonar, who says impact:** the Geoheritage review authors (Chandran et al., University of Kerala and others), citing earlier primary work. The National Geological Monument status is in the paper's text, attributed to the Indian Government, not read at GSI.
- **Baratang:** the OSTI abstract is the authors' abstract (Achyuthan, Eastoe), a primary scientific source. NOTES.md says mud volcanoes are 'gas-driven per the Baratang abstract and NCERT'; the abstract does not say that (it lists methane gas and volcanic glass among ejecta). Only NCERT says gases and pressure.

## NOTES.md coverage of GEO-04 ids
V003 not cited. Cited and usable: V055 (CONFIRMED, but its author citation has the same 'James et al.' slip; fix in GEO-04), V066 (CONFIRMED, The Geysers geothermal field), V043, V044, V046 (CONFIRMED). **Not usable:** V049 (UNVERIFIED; NOTES.md does mark 'only' as UNVERIFIED there) and V045 (CONFLICT); NOTES.md lists V043-V046 as the contrast, so use only V043, V044, V046.

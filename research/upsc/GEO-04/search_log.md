# GEO-04 search log (read 3 Nov 2026)

Order followed: NCERT, then the publishers of record (USGS, NOAA, UNESCO, ECORD/NCPOR, UPSC), then peer-reviewed papers for India. Web searches only suggested pages; every claim was read in a file saved under `sources/`. I used no news, blog, coaching, Wikipedia or encyclopaedia pages as evidence (several appeared in search results and were ignored).

## NCERT
- Local `research/upsc/_ncert/` copies of kegy203, kegy205, kegy204, kegy202, kegy211, kegy102, iest102, gess203, fees103, jess101 and the front pages (kegy1.ps, kegy2.ps, gess2.ps, fees1.ps, iest1.ps, jess1.ps) were compared against NCERT's live files by byte size on 3 Nov 2026: all SAME. Copied to `sources/ncert/`.
- Word search "volcan" over all local NCERT text found the chapters listed in `ncert_map.md`. BookletClass11.txt (rationalised content, 25 May 2022) read for Class XI.

## UPSC
- Past papers: local OCR pages in `sources/upsc/` (2024 Prelims GS I page 3, 2026 Prelims GS I page 15). The PDFs are image-only scans. Syllabus word "Volcanicity" taken from the earlier map (`_map/geography_subtopics.csv`, Notice 05/2026-CSE PDF p.65), not re-opened.

## USGS (pubs.usgs.gov, plain fetch OK)
- `gip/volc/text.html` and `types.html` (Volcanoes, 1997). OK.
- `gip/dynamic/` inside, hotspots, tectonics, understanding, developing, historical, slabs, unanswered (This Dynamic Earth). OK. Guessed names plate.html, Pacific.html, Vesuvius.html, volc/description.html, lava_flows.html, hazards.html returned 404 and were deleted.
- `fs/fs002-97/old html files/` (What Are Volcano Hazards?, revised March 2008, superseded by FS 2018-3075). `pubs.usgs.gov/publication/fs20183075` is only a landing page (abstract); the PDF guesses `fs/2018/3075/*.pdf` returned 404.
- `fs/1997/fs113-97/` (Pinatubo) and `pinatubo/self/` (Self et al.). OK.
- `www.usgs.gov` pages (VHP, HVO): plain fetch returned HTTP 202 with an empty body (a JS challenge). I opened one in the Browser pane: `volcanoes-can-affect-climate` stayed on "loading"; `volcanic-gases-and-their-effects` returned "Page not found". Nothing from usgs.gov was used.

## NOAA / NCEI
- `oceanexplorer.noaa.gov/facts/mid-ocean-ridge.html` OK.
- NCEI Significant Volcanic Eruptions database, public API `ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?nameInclude=<name>` queried for Tambora, Krakatau, Pinatubo, Vesuvius, Pelee, Hunga, St. Helens, Tungurahua, Ruiz, Mauna Loa, Eyjafjallajokull (Barren Island returned nothing; a Toba query returned San Cristobal and was deleted). JSON saved in `sources/noaa/`.
- NCEI volcanoes page (database descriptions) OK.

## Smithsonian Global Volcanism Program (volcano.si.edu)
- BLOCKED. Plain fetches returned HTTP 403 with a bot-check page. The Browser pane showed "Just a moment... REQUEST VERIFICATION" and did not clear after 6 seconds. I did not attempt to pass the check. No GVP fact is in the claims. Needed for: Barren Island eruption list and current status, Narcondam record, Tungurahua profile, active-volcano counts and definitions.

## Peer-reviewed and institutional papers
- Sheth et al. 2009 (Bull. Volcanol.), Barren Island: PDF from Durham mantleplumes site. OK.
- Gunda et al. 2021 (JESS 130:162), Sen 2001 (JESS 110:409), Srivastava et al. 2020 (JESS 129:96): `ias.ac.in/article/fulltext/...` returns the PDF directly. OK.
- Davies and Davies 2010 (Solid Earth) OK. Skuf'in 2021 (Nexo, doi 10.5377/nexo.v34i04.12693) OK. Lonar review (Geoheritage 14:130, PMC9702779) OK. Ganchin et al. 1998 (Tectonophysics 288), Glasgow Enlighten abstract page only (used for nothing beyond a check; kept in `sources/papers/`).
- BLOCKED or empty: Schoene et al. 2019 (Science, via Princeton: Cloudflare/"Verification required"), Pal et al. 2007 (ScienceDirect, HTTP 403), Baratang papers (Springer NASL: 3 KB bot page; ScienceDirect JAES: 403), Springer JESS 2022 Deccan review (HTML wall), earth-planets-space BF03352679 (HTML wall). Cambridge Core abstract page for the Barren Island and Narcondam paper was an abstract only and was deleted.

## UNESCO, ECORD, NCPOR
- `unesco.org/en/iggp/tungurahua-volcano-unesco-global-geopark` OK. `unesco.org/en/articles/ecuador-adds-two-new-unesco-global-geoparks` returned 503 and was not used.
- `ecord.org/?p=337` (IODP3 announcement) and `ncpor.res.in/iodps/display/291-background-and-history-` OK. `icdp-online.org` unreachable (no response).
- `igepn.edu.ec/tungurahua` (Instituto Geofisico, Ecuador) fetched and saved; used only as supporting context, not as a claim source.

## Open items (also the answer to "Part E")
1. **Smithsonian GVP (BLOCKED):** Barren Island eruption list and current state (V045 CONFLICT, V047 BLOCKED), Narcondam record, global counts (V065), the Holocene definition of active (V002). A human with a browser must read it.
2. **usgs.gov modern pages (not read):** Mauna Loa 2022 eruption (seen only as search snippets), glossary definitions for intrusive forms (V020-V023), current gas and ash facts; FS 2018-3075 full text (V005, V063).
3. **Deccan modern dating and the extinction link (BLOCKED):** Schoene 2019, Sprain 2019 (V051). Until read, do not say the Deccan "killed the dinosaurs".
4. **Baratang mud volcano:** "India's only mud volcano" and "not magma" are UNVERIFIED (V049); the October 2025 mud eruption appears only in news snippets.
5. **UPSC answer keys** for 2024 Q3 and 2026 Q31 not read; answers (d) and (a) are our inference from NCERT and UNESCO (V006, V056).
6. **UNVERIFIED NCERT statements:** asthenosphere to 400 km and "main source of magma" (V036); heat-source ranking (V030); Karnataka domal hills (V022).
7. **Tambora cooling:** USGS 1997 says up to 3 C; a modern source was not read (V058).
8. **Class VII "Our Environment" (Reprint 2024-25):** whether it is still the prescribed book was not checked (V069).
9. **Jarawa community / Baratang location:** appeared only in search snippets; confirm before any map or voice mentions it.
10. **Mauna Loa, Hunga Tonga, Barren Island recent activity:** LIVING facts, dated 3 Nov 2026 where given; recheck before any script.
11. **Not researched (GEO-01 and others):** gold-mine depth of 3-4 km (NCERT p.18), meteorites, gravity anomalies, P and S wave details, India's geothermal fields.

# Data Kadai: ops state

Maintained by dk-planner (append-only log at the bottom).

## Current status (9 Oct 2026)
- Brand: Data Kadai. Accounts live (10 Oct 2026): datakadaiahq@gmail.com, YouTube @datakadai, X @DataKadai, Instagram data.kadai. Domains not bought yet.
- Production: **STARTED 9 Oct 2026** (AK's go), English only, no Tamil lines anywhere. Publishing/uploads still need AK's explicit go each time.
- Site: not built yet (next: one-page "coming soon" with newsletter sign-up, preview only).
- Datasets ready: NFHS-6 state (`public/datayt/nfhs6/nfhs6_states.json`, verified).
- Templates: Guess the State (`src/datayt/IndiaShort.tsx`); Map Reveal / Quiz / Top 10 to build.
- Pipelines to build: Lok Sabha harvester; monthly AMFI / NSE / GSTN / Vahan pulls.

## Schedule
| Cadence | Work |
| --- | --- |
| Weekly (Sun) | Lok Sabha new answers → state tables queue; analytics log; site content refresh; link check |
| Monthly (1st week) | AMFI state AUM, NSE Market Pulse, GSTN state GST, Vahan EVs |
| Yearly | RBI state handbook (Dec), SRS, NCRB, PLFS, UDISE+, NITI indices, NFHS district sheets |

## Log
- 2026-10-09: agents created (dk-planner Opus, dk-data-worker Sonnet, dk-ops-worker Haiku) and the maintenance skill.
- 2026-10-09: production started (AK lifted the hold), English only. Plan `plan-2026-10-09.md`: gts01 (Meghalaya, NFHS-6 ind. 10) assigned to dk-video-worker. Queue checked; gts11 held (thin margin), gts15 added.
- 2026-10-09: gts01 re-voiced with MiniMax English_Diligent_Man and approved by AK. Production moved to the Mac Mini. Fixed settings and brand assets saved in `docs/datakadai/PREFERENCES.md` and `docs/datakadai/brand/`.
- 2026-10-10: AK created the accounts (domains still to buy). `make_scripts.py` wrote batch-001: 100 draft scripts from NFHS-6 for AK's review (`docs/datakadai/scripts/batch-001.md`); only the Guess the State template exists, the other 8 series need templates. `hot_scan.py` built (PIB, RBI, SEBI, Lok Sabha); first run over 3-9 Oct scored 380 items, 19 shortlisted, 8 hot scripts drafted (`docs/datakadai/scripts/hot-2026-10-10.md`). No videos or charts made: waiting for AK's script review.
- 2026-10-10 (evening): AK asked for other templates, all states' numbers on the map, and no map/text overlap. New MAPPED template built (`IndiaMapped.tsx`, `build_mapped.py`). First story `map01`: villages without mobile coverage, 8,748 (DoT, Lok Sabha Starred Q 470, as on 28 Feb 2026), 52.8 s, draft pack in `out/datakadai/daily/2026-10-10/map01/`. `gts16` (women's internet use, Tripura) also drafted the same day. Neither posted.
- 2026-10-10 (night): AK moved all Data Kadai files to DarwinSSD (`/Volumes/DarwinSSD/DataKadai/`). The Air copy and the Mini's `~/Projects/mmvideo-dk` are removed; the hot-scan schedule now runs from the SSD path.
- 2026-10-10 (late): source collection. `collect_sources.py` pulled all 181 tables of the RBI Handbook of Statistics on Indian States (97,825 state values), PLFS (LFPR, WPR, UR, 2017-18 to 2025) and state CPI for 2025 from the MoSPI API. Lok Sabha answer harvest (state-wise tables) is running in the background on the Mini, newest session first; progress in `out/collect_loksabha.log`. Catalog: `docs/datakadai/SOURCES_CATALOG.md`. Blocked or not yet done: GST portal, NSE, AMFI, Vahan, NCRB, data.gov.in (needs a key), Rajya Sabha.
- 2026-10-11: source map written (`docs/datakadai/SOURCE_MAP.md`, 212 sources: Indian statistics, regulators, ministries, institutions, NGOs, international bodies, US government). AK: map sources now, pull data only when a story needs it. Lok Sabha harvest continues through all eight sessions.
- 2026-10-11: templates built for the other five story types (ranking, change, face-off, breakdown, myth-buster): `DataStory.tsx` + `build_story.py`, with five sample Shorts rendered to `out/datakadai/templates/2026-10-11/`. Samples are drafts for AK; none posted. Chart posts (4:5, 16:9) not yet built for these templates.
- 2026-10-11: state story templates reworked on AK's go: map first (every state numbered), then top five and bottom five bars; full list moved to chart posts. Shared `StateMap.tsx`; posts in `StoryPosts.tsx` (map + list, 4:5 and 16:9). Five sample videos and 16 posts in `out/datakadai/templates/2026-10-11/`.
- 2026-10-11: benchmarked 30 data/map Shorts channels (`SHORTS_BENCHMARK.md`): story-led, one-thing-at-a-time Shorts far outperform charts shown as video. AK: keep our all-states versions and add the new style. Built `BeatStory.tsx` + `build_beats.py` with samples `clue01`, `cnt01`, `vs01` in `out/datakadai/templates/2026-10-11/`.

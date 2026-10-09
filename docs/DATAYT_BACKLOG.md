# Data YT: video backlog

Saved 9 Oct 2026. **Data YT is Shorts only (no long videos).** Full NFHS-6 Shorts plan: `docs/DATAYT_SHORTS_PLAN.md`.
Style for all new Data YT videos: fast pace, cuts on a 150 BPM grid, chase-style score
(see `scripts/datayt/tn_alcohol_build.py` for the timeline and music template).

| # | Idea | Data needed | Status |
| --- | --- | --- | --- |
| 1 | Same NFHS-6 TN district map for other topics: tobacco use, obesity, anaemia, child stunting. Map engine (`src/datayt/TnAlcohol.tsx`) is reusable; mostly new data. | NFHS-6 **district** fact sheets (not in the state compendium) | Waiting on district data |
| 2 | Before and after: NFHS-5 vs NFHS-6 per district, where drinking rose or fell. Change stories get shared more than snapshots. | NFHS-5 + NFHS-6 district fact sheets | Waiting on district data |
| 3 | TN vs Kerala vs Karnataka vs Andhra Pradesh vs Telangana: neighbour comparison, pulls regional comments. | State fact sheets: already extracted in `public/datayt/nfhs6/states_tobacco_alcohol.json` | Ready to build |
| 4 | TASMAC revenue by year as a racing bar chart (fits the chase music). | TASMAC / TN budget revenue series | Needs data |
| 5 | District rank "battles": two districts head to head in a Short, ending with "Which is yours?" | District values (TN alcohol map data has 38 districts) | Ready for alcohol; other topics need district data |

## Status: India-map Shorts template (saved 9 Oct 2026, production ON HOLD)

Built and saved, **not in production; do not render or upload until AK says go.**
- Template: `src/datayt/IndiaShort.tsx` (Guess the State: hook → A/B/C quiz + 3-2-1 → zoom reveal → colour fill →
  top 5 → "Where does your state rank?" loop), ~26 s, 1080x1920, compositions `DATA-gts01` … `DATA-gts08`.
- Look: dark navy palette (gold answer, cyan accent, indigo→gold bands). Music: original code-composed 124 BPM
  Indo-electronic score per Short (`scripts/datayt/music_shorts.py`), copyright-free.
- Map: `public/datayt/india/geo.json` from LGD-coded boundaries; official northern boundary (keep it).
- Data: `scripts/datayt/build_india_shorts.py` (8 Shorts configured; asserts each #1 claim against the data).
- To produce later: `python3 scripts/datayt/build_india_shorts.py` then
  `npx remotion render src/index.ts DATA-gts01 out/datayt/gts/GTS-01.mp4` (and so on).

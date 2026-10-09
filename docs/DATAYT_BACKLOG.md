# Data YT: video backlog

Saved 9 Oct 2026. Style for all new Data YT videos: fast pace, cuts on a 150 BPM grid, chase-style score
(see `scripts/datayt/tn_alcohol_build.py` for the timeline and music template).

| # | Idea | Data needed | Status |
| --- | --- | --- | --- |
| 1 | Same NFHS-6 TN district map for other topics: tobacco use, obesity, anaemia, child stunting. Map engine (`src/datayt/TnAlcohol.tsx`) is reusable; mostly new data. | NFHS-6 **district** fact sheets (not in the state compendium) | Waiting on district data |
| 2 | Before and after: NFHS-5 vs NFHS-6 per district, where drinking rose or fell. Change stories get shared more than snapshots. | NFHS-5 + NFHS-6 district fact sheets | Waiting on district data |
| 3 | TN vs Kerala vs Karnataka vs Andhra Pradesh vs Telangana: neighbour comparison, pulls regional comments. | State fact sheets: already extracted in `public/datayt/nfhs6/states_tobacco_alcohol.json` | Ready to build |
| 4 | TASMAC revenue by year as a racing bar chart (fits the chase music). | TASMAC / TN budget revenue series | Needs data |
| 5 | District rank "battles": two districts head to head in a Short, ending with "Which is yours?" | District values (TN alcohol map data has 38 districts) | Ready for alcohol; other topics need district data |

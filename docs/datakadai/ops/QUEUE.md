# Data Kadai story queue

The daily routine takes the first story whose status is `queued`. Built-in configs live in
`scripts/datayt/build_india_shorts.py`; new ones go in `public/datayt/shorts/configs/<id>.json`. dk-planner keeps at
least 14 stories queued, picking from `docs/DATAYT_SHORTS_PLAN.md` and `public/datayt/nfhs6/shorts_catalog.csv`.

| # | id | Story (hook) | Indicator | Answer | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | gts01 | In one state, 2 in 3 homes have a woman who owns a house or land | 10 | Meghalaya | in production (2026-10-09) |
| 2 | gts02 | In one state, nearly 1 in 4 women drink alcohol | 100 | Arunachal Pradesh | queued |
| 3 | gts03 | In one state, nearly 3 in 4 men use tobacco | 99 | Mizoram | queued |
| 4 | gts05 | Of 28 states, in one the average woman has just 1 child | 18 | Sikkim | queued |
| 5 | gts06 | The state where men get sterilised | 24 | Telangana | queued |
| 6 | gts07 | 9 in 10 private-hospital births here are C-sections | 39 | Jammu and Kashmir | queued |
| 7 | gts08 | 3 in 10 men here marry before 21 | 17 | Bihar | queued |
| 8 | gts04 | Here, 6 in 10 women use tobacco | 98 | Mizoram | queued |
| 9 | gts09 | Child-marriage #1 isn't Bihar. Guess it | 16 | West Bengal | queued (config to write) |
| 10 | gts10 | 6 in 10 births here are C-sections. Guess the state | 38 | Telangana | queued (config to write) |
| 11 | gts11 | India's sugar capital: 1 in 3 men | 83 | Goa | hold (Goa 32.1% vs Kerala 31.9%: 0.2-pt gap too thin for a #1 claim) |
| 12 | gts12 | Half the women here are overweight | 76 | Puducherry | queued (config to write; UT, check wording) |
| 13 | gts13 | Teen mothers: 18% of girls here | 19 | Tripura | queued (config to write) |
| 14 | gts14 | The state with India's oldest population | 3 | Kerala | queued (config to write) |
| 15 | gts15 | Only 6 in 10 babies here are born in a health facility | 35 (lowest) | Nagaland | queued (config to write; decoys Bihar, Jharkhand) |

Checked 2026-10-09 by dk-planner against `public/datayt/nfhs6/nfhs6_states.json` (total column, India and Lakshadweep excluded, no `*`/`( )` cells at #1). Hooks for gts01, gts02, gts03 and gts10 reworded to match the numbers.

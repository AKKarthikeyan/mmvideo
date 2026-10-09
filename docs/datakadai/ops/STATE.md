# Data Kadai: ops state

Maintained by dk-planner (append-only log at the bottom).

## Current status (9 Oct 2026)
- Brand: Data Kadai; domains bought by AK (to confirm: datakadai.com/.in, indiastatewise.com/.in).
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

# Data Kadai: week five

AK, 14 Oct 2026: "go ahead with week 5 and plan for this week long form video."

Status on 14 Oct 2026: fourteen Shorts are scheduled, eleven of them new and three from stock. None is posted. Claude checked a frame from every beat, re-ran every number test and scanned every post image; nobody has watched one end to end with sound yet. The posting order and each Short's "before posting" line are in `PLAN.md` (written by `scripts/datayt/week_plan.py`). Five weeks now hold 70 Shorts with no empty slot; `fa12` is the one left in stock.

## Back to the standing seven themes

Week four ran its own themes (Money and Markets twice each). Week five returns to the seven: Money, Farm and food, Women, Economy, Power and connections, School and health, Know your states. Money and Economy are the two finance days. AK has not said whether a Markets day should come back; `px67` (women among NSE investors) carries some market data on the Women day.

| Day | Theme | First | Second |
| --- | --- | --- | --- |
| 1 | Money | `px61` Gujarat 13.0 bank offices per lakh people, Jharkhand 8.7; women with their own account: Jharkhand 91%, Gujarat 82% | `tn60` Bank deposits in Haryana: 2.5% of India's in 2015, 3.8% in 2025 |
| 2 | Farm and food | `sh02` Maharashtra: 36% of India's cotton area, 25% of the crop (stock) | `fa07` Madhya Pradesh: 3.7 million tonnes of spices (stock) |
| 3 | Women | `tn66` Karnataka: wives with a say in all three household decisions, 82.7% to 89.2% | `px67` Rajasthan: 52% of women in the labour force, 21% of NSE investors |
| 4 | Economy | `tn71` Odisha: men's rural construction wage, 72% to 89% of India's | `px72` Telangana: 3.1 times Kerala's registered cooperatives, with 7% more people |
| 5 | Power and connections | `fa76` Madhya Pradesh: 1,370 of India's 6,628 specified dams, 21 of every 100 | `px04` Power available per person: Chhattisgarh 1.9 times West Bengal (stock) |
| 6 | School and health | `tn81` Uttar Pradesh: fully vaccinated one-year-olds, 69.9% to 81.4% | `px82` Rajasthan: 47 colleges for each university, Gujarat 24 |
| 7 | Know your states | `fa85` Goa: 50.8% said they knew three or more languages (India 7.1%), Census 2011 | `tn86` West Bengal's coastline: 157.5 km in the old count, 721 km recalculated |

## Why this order

- Proposed by the viewer editor, checked by Claude and by `week_plan.py`: no format twice in a row across the week, and the two Shorts of a day differ in format, lead state and measure.
- `fa12` (Delhi deposits per bank office) stays in stock again: it would be two days after `fa50` and seven after `px37` (both Delhi) and it shares the bank-offices table with `px61`.
- Economy takes `tn71` and `px72`, not `fa70` (Maharashtra's cooperatives): Maharashtra already leads `sh02` and is the comparison state in `fa76` and `px67`. `fa70` and `px72` use the same table, so only one of them in a fortnight.
- NFHS-6 runs three times (`px61`, `tn66`, `tn81`), on days 1, 3 and 6, each on a different row. No other Women or School-and-health script avoided it.
- Repeats Claude could not avoid: Rajasthan in `px67` and `px82` (three days apart), Madhya Pradesh in `fa07` and `fa76` (three days), West Bengal in `px04` and `tn86` (two days). Each is a different measure.

## How the round ran

Six writers produced 17 scripts from the drive's tables, each run through `build_beats.py --check`. Three numbers editors (two or three themes each) recomputed every figure against the publisher and fixed wording in place; one viewer editor rewrote five hooks and six closing questions that copied earlier Shorts, and proposed the order. Claude read every line, changed two (`fa85` card 2 now names Chandigarh as second, `px82` statement card), and built eleven. A post-pack writer drafted each description, pinned comment, Instagram and X text and the checks done and open; Claude rechecked the figures in them and removed repeated phrases from three pinned comments.

## Written, edited and not scheduled

| ID | What | Why not |
| --- | --- | --- |
| `fa65` | Jharkhand: rural women's labour force rate 2.95 times urban women's, 2023-24 | Cleared, spare. Same survey as `px67`, so not in the same week; AK may prefer to lead with 2025 (2.7 times, new survey design). |
| `fa70` | Maharashtra: 27% of India's cooperative societies, 9% of its people | Cleared, spare. Same table and map as `px72`; Maharashtra is already in three Shorts this week. |
| `tn75` | Maharashtra: National Highway length up 2.95 times, 2014 to 2025 | Cleared, spare. Maharashtra again; most of the rise is one step, 2016 to 2017 (state roads declared national highways). |
| `fa80` | Telangana: 2.7 times India's MBBS seats per lakh people, 2025-26 | Cleared, spare. NMC's 2026-27 seat list is newer (still about 2.7 times); Telangana is `px72` two days earlier. |
| `px87` | Kerala 2011: a fifth of Arunachal Pradesh's villages, 16 times the rural people | Cleared, spare. Same Census 2011 tables as `fa85`. |
| `fa63` | Punjab reported 100% of its sown land irrigated, 2023-24 | Held. The Ministry's revised-final Land Use Statistics 2023-24 could not be opened; Punjab's two cells must be read before voicing. |

The six are in `public/datayt/bank/scripts/`, tested and unbuilt.

## What changed in the builder

- A map can leave out table rows it cannot place, through a `"drop"` list in the script; the builder stops unless each dropped row is a row of the table and the map note names it. Used by `fa85` (Census 2011 prints Dadra and Nagar Haveli, and Daman and Diu, as two rows). It replaces a zero-term workaround one writer had used.
- Re-checking all 64 built configs against the current rules: 51 pass; 13 built before the 33-character heading rule fail only that rule. They rendered correctly (checked in frames) and need shorter headings only if rebuilt.

## What the frame check found

Four layout faults on the first renders, all fixed in the scripts, rendered again and checked: `px61` card 1's caption ran to two lines beside the channel name; `tn66`'s map note took four lines and met the source text on the last card; the map's sub line wrapped in `px67` and `px82`. The writer guide now gives the limits (one-line map sub of about 58 characters, notes of about 140).

## Open for AK

- Sentences for sign-off, listed in each pack: `px61` (Gujarat's lower share of women with their own account set against Jharkhand's, and the first question-style hook outside the games), `px72` (Kerala as the comparison state), `tn81` (children's vaccination as a topic), `px82` (Gujarat's university lead holds in the last two editions only).
- Theme calls: whether cooperative societies (`px72`) fit the Economy day; whether a Markets day returns in week six; the loosened change threshold in `tn66` (0.05 against the builder's 0.10).
- Freshness: NSE's October 2026 Market Pulse is due and would update `px67`'s NSE figures; RBI's end-March 2026 state bank tables are out and were not read (`px61`, `tn60`). Every card is dated, so each stays true as dated.
- Cells to re-read at the publisher before posting are in each pack's checklist (NFHS-6 sheets, PLFS state cells, AISHE Tables 1 and 4, Census Table C-17, the coastline answer).

## The long-form video for this week

The plan is `docs/datakadai/longform/LF01-plan.md`: "What Moved India's Prices in September", on MoSPI's new CPI series (base 2024 = 100) released 12 Oct 2026, about seven minutes in nine chapters, every figure read at PIB, MoSPI's eSankhyiki portal or the RBI. The 16:9 template and builder are built and proven with a silent check render. AK has not yet confirmed the topic or the length; scripting, voice and render start on that word.

Videos: `DarwinSSD/DataKadai/videos/<id>-2026-10-14-short.mp4`. Post packs: `docs/datakadai/posts/2026-10-14-<id>.md`. Post images beside each video in `out/datakadai/daily/2026-10-14/<id>/`.

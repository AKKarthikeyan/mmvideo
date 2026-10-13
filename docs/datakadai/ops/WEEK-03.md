# Data Kadai: week three

Status on 13 Oct 2026: nine Shorts are scheduled for this week and five more are built and banked. None is posted. Claude checked a frame from every beat and the audio levels; nobody has watched one end to end with sound yet.
Nine is fewer than fourteen. Twelve new scripts passed review this round; the viewer editor asked for four of them to wait because they repeat a state or a measure used in the same fortnight.

## Posting order

| Day | Slot | ID | Title | Format | Length | Before posting |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | first | fa10 | Rajasthan Made 1 in 3 Units of India's Solar Electricity | one state, one fact | 39 s | Watch with sound. Re-read the FY 2025-26 and FY 2022-23 solar tables in the answer's PDF. Add the source link. |
| 1 | second | tn12 | Karnataka: Real Output per Person Up 2.1 Times in 12 Years | then and now | 43 s | Watch with sound. Re-read Handbook Table 20; state figures on the new 2022-23 base are due by December 2026. Add the source link. |
| 2 | first | fa06 | Assam: 41% of India's Handloom Weavers, 2019-20 Census | one state, one fact | 37 s | Watch with sound. Re-read both annexures in the PDFs. The loom card has no printed reference year: keep or drop it. Add the source link. |
| 2 | second | px07 | Share of Women at Work: Tamil Nadu 1.8x Haryana, Same Income | paradox | 41 s | Watch with sound. Re-read the labour force survey's 2023-24 state table. AK to sign off: it sets Haryana's women's work share against Tamil Nadu's. Add the source link. |
| 3 | first | tn14 | Madhya Pradesh: Cropped Area Up 30% on 3% More Farmland | then and now | 39 s | Watch with sound. Re-read the land use tables. Mizoram, Manipur and Delhi are unstable small series on the map. Add the source link. |
| 4 | first | hl02 | Rajasthan or West Bengal: Foreign Tourist Visits? 4 Rounds | game | 43 s | Watch with sound. Read the 2026 tourism compendium before posting: round one uses 2024 visits and a 2025 figure is out (the winner holds on the provisional number). Add the source link. |
| 5 | first | fa09 | Tamil Nadu: Highest Textile Export Value 5 Years Running | one state, one fact | 39 s | Watch with sound. Check for a provisional footnote and for a 2025-26 state table. Add the source link. |
| 5 | second | tn10 | Odisha: Women With 10+ Years of School Up 11 Points | then and now | 37 s | Watch with sound. Read Odisha's cells in the NFHS-6 fact sheet. Add the source link. |
| 6 | first | fa08 | Maharashtra Had 1.7x Karnataka's Recognised Start-ups, 2026 | one state, one fact | 39 s | Watch with sound. Read the 11 Aug 2026 answer for a newer count. Add the source link. |

Open slots: day 3 second, day 4 second, day 6 second, day 7 both.

Videos: `DarwinSSD/DataKadai/videos/<id>-2026-10-13-short.mp4`. Post packs: `docs/datakadai/posts/2026-10-13-<id>.md`.

## Why this order

- No format runs twice in a row: four one-state facts, three then-and-now, one paradox and one game.
- The game comes 15 days after the first one (`hl01`, week one, day 3); the research asks for one a fortnight at most.
- The two Shorts that set Karnataka against Maharashtra (`tn12`, `fa08`) are five days apart; the two with Tamil Nadu (`px07`, `fa09`) are three days apart.
- Rajasthan opens both the solar Short on day 1 and the game on day 4, three days apart. Swap the game to day 7 if that feels close.

## New this week: Lok Sabha answers as a source

Five Shorts use figures a ministry gave in a Lok Sabha answer (handloom weavers, spices, recognised start-ups, textile export value, solar generation). The writer and the editor each read the answer's own text: the code that found these leads often pointed at the wrong column. Each Short says whose figure it is and its period, and its pack names the answer.

## Built and banked

- `fa07`, Madhya Pradesh: 3.7 Million Tonnes of Spices, Next State 1.4 (41 s). AK to decide whether "spices" is a fair headline: garlic is about 57% of Madhya Pradesh's tonnage on the Ministry's list. It also needs a week's distance from the other Madhya Pradesh farm Shorts.
- `tn11`, Rajasthan: 30% of India's New Installed Renewable Capacity (41 s). Rajasthan renewables again, so it waits a week after the solar Short (`fa10`). MNRE also has a March 2026 table: consider ending the story there.
- `tn13`, Odisha: Women 15+ Usually at Work, 18% to 48% in 6 Years (41 s). Same survey measure as `px07` and Odisha women again after `tn10`.
- `px08`, Men With 10+ Years of School: Himachal 76%, Andhra 59.5% (41 s). Same schooling measure as `fa02` and `tn10`, with Andhra Pradesh again as the comparison.
- `px04`, Power Available per Person: Chhattisgarh 1.9x West Bengal (45 s). From week two: same table and shape as week one's Sikkim and Goa Short.

## Held

- `fa01`, Meghalaya, a woman owns house or land: survey row wording unconfirmed; same fact as `gts01`.
- `tn08`, Madhya Pradesh vegetables: final 2024-25 horticulture figures are out; our table has an estimate.
- `px06`, Odisha and Nagaland pre-school: conflicts with ASER 2024.
- `tn04`, Jammu and Kashmir health insurance: NFHS-6 fact-sheet check and AK's sign-off.
- `tn01`, West Bengal eggs: waiting for the 2024-25 animal husbandry edition.

## What the frame check caught

The first render had layout faults on eleven of the twelve, all fixed and rendered again:

- The source text ran off the bottom of the last card on seven Shorts. The card now carries a short reference (at most 590 characters, ten small lines) and the pack carries the full one.
- The game ran 48.8 seconds once voiced, over the 45-second limit. Its spoken questions no longer say the year (it stays on screen); it is now 43 seconds. Its closing question also ran into the tally.
- Two cards printed asterisks, one bar figure wrapped onto three lines, a map of start-up counts printed "25.0", and one top row ended 13 pixels from the edge.

The builder now refuses a long source text and a long bar figure, and the template shrinks a heading or a source line that would not fit. The lessons are in `bank/WRITER_GUIDE.md`.

## Voice

MiniMax `English_Diligent_Man`, as in weeks one and two.

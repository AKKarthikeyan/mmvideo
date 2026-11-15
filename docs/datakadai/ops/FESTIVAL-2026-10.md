# Data Kadai: Navaratri and Dussehra specials (17 to 20 Oct 2026)

AK, 15 Oct 2026: "Navarathi Celebration going and 19 and 20th Oct is final days and whole India 🇮🇳 is in Holiday. How to tap that?" On the plan Claude gave, AK, 16 Oct: "Yes go ahead. Research properly before going for script, data should be 100% authentic."

Status on 16 Oct 2026: five Shorts built, voiced, rendered and frame-checked, each with its post pack and post images. None is posted. Nobody has watched them end to end with sound.

## The five Shorts and when to post them

| Post | ID | What | Length |
| --- | --- | --- | --- |
| Sat 17 Oct | `fs03` | Going home for the holidays: domestic air fares +29.9% in a year; rail +2.2%, taxi +3.3%, hotel rooms +2.4%; map: all travel fares by state | 37 s |
| Sun 18 Oct | `fs04` | Festival shopping: coconut oil −29.5%, sarees +6.0%, flowers +4.9%, bananas +7.5%, coconut −4.0% but green coconut +8.3%; map: clothing and footwear by state | 35 s |
| Mon 19 Oct (Navami) | `fs02` | Dussehra buys: gold, diamond and platinum jewellery +30.9%, silver jewellery +87.8%, cars −4.5%, two-wheelers −1.7%; map: jewellery and personal items by state | 43 s |
| Tue 20 Oct (Dussehra), morning | `fs05` | Ramlila (2008), Durga Puja in Kolkata (2021), Garba of Gujarat (2023) and Deepavali (2025) on UNESCO's intangible heritage list, in UNESCO's own words | 41 s |
| Tue 20 Oct, evening | `fs01` | Festive sweets: sugar +29.8%, jaggery +22.6%, ready-made sweets +9.4%, ghee +3.7%; map: food prices by state | 39 s |

The order is the viewer editor's; the numbers editor agreed. `fs03` goes first because people travel at the start of the long weekend; `fs02` goes on the eve of Dussehra rather than on the buying day itself. All price figures are September 2026 against September 2025, provisional; every hook, title and top bar says so, so nobody takes them for festival-week prices.

These are specials. Whether each takes one of that day's two regular slots (keeping 14 a week) or comes on top is AK's call. Suggested swap by theme: `fs02` for a Money slot, `fs01` and `fs04` for Farm and food, `fs03` for Economy, `fs05` for Know your states.

The long-form `lf01` (September prices, 7:28) suits the same weekend. Its pack now carries a festival alternative title: "Before Your Dussehra Shopping: What India's Prices Did in September".

## How the figures were made authentic

- **Prices:** every figure is one row of MoSPI's all-India CPI table (base 2024), read from MoSPI's eSankhyiki data service on 15 Oct and read again on 16 Oct; all 637 rows matched. The builder checks each item code's own name, so a slip in a code cannot put the wrong item under a label. Any number typed into a card must be one the Short reads from a table, or the build stops.
- **State maps:** the closing maps are group or division figures by state (food, other personal effects, passenger transport, clothing and footwear), read from MoSPI's data service on 14 and 16 Oct. Single items are not mapped by state, because MoSPI cautions that state-level item indices can rest on thin samples; that caution is in each source line.
- **UNESCO:** every year, place, meeting and quote was read on UNESCO's own pages (ich.unesco.org) on 16 Oct and saved; the builder checks each on-screen quote word for word against the saved copy.
- **Two independent editors** (numbers; viewer and channel rules) read all five before voicing. The numbers editor re-read the items and 23 states of every map live at MoSPI and the UNESCO pages: no mismatch.

## What the editors changed

- **Gold:** "gold up 30.9%" became "gold jewellery". MoSPI's item is gold, diamond and platinum jewellery, not the price of gold.
- **Coconut:** MoSPI's "coconut" fell 4.0%, but green coconut, a separate item, rose 8.3%. The card shows both, and coconut oil (−29.5%) leads the hook.
- **Bus:** the bus figure was dropped from the travel Short, because MoSPI's bus-and-coach figure covers commuting fares only. A hired car or bus for a ceremony or picnic (+3.9%) replaces it.
- **UNESCO:** the list is named as the *intangible* heritage list (not the World Heritage List of places). Ramlila's heading uses UNESCO's own name for it. The closing question no longer asks viewers which festivals they celebrate.
- **Period:** each hook and title now gives the period, the top bar says "provisional", and the chip reads "FESTIVE ITEMS" (not "festival prices").
- **Readings:** each reading card carries one tested finding of our own. Sugar rose about three times as much as ready-made sweets; gold jewellery over five times prices overall; the air-fare rise was over thirteen times the rail-fare rise.

## Builder and template

- New story type `basket` (all-India items) in `build_beats.py`: the hook over the whole of India, cards with India's outline, bars that show falls in green, halves rounded up, every item's name checked, every typed figure traced to a table, and equal map labels in one colour band.
- The `place` type now lights several states, gives each event its own state, and checks quotes word for word against a saved source.
- New converter `scripts/datayt/fest_sources.py` (state tables for three CPI divisions, and the re-check of the all-India items).

## Open for AK

- Watch each with sound (Ramlila, Durga Puja, Garba, Navaratri, Deepavali, Kasane and "jaggery" have not been heard by a person).
- Sign-offs in the packs: `fs02` puts prices beside a buying day (the description says it is not advice), and `fs05` is a religious-festival topic on a no-politics channel, kept to UNESCO's words.
- Post the price Shorts before 12 November, when October's index revises September.

Videos: `DarwinSSD/DataKadai/videos/fs0N-2026-10-16-short.mp4`. Packs: `docs/datakadai/posts/2026-10-16-fs0N.md`.

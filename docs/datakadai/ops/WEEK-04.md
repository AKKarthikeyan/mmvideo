# Data Kadai: week four

AK, 13 Oct 2026: "go ahead with week 4 but include more of Market and Money datas this time."

Status on 13 Oct 2026: fourteen Shorts are scheduled, twelve of them new and two from stock. None is posted. Claude checked a frame from every beat and re-ran every number test; nobody has watched one end to end with sound yet. The posting order and each Short's "before posting" line are in `PLAN.md` (written by `scripts/datayt/week_plan.py`).

## The week's own themes

Week four does not use the standing seven themes. Money runs on two days and a new theme, Markets (share-market investors, mutual funds, state bonds), on two. Women, Power and connections, and School and health sit out and return in week five unless AK says otherwise. The choice of days is Claude's; AK asked only for more market and money data.

| Day | Theme | First | Second |
| --- | --- | --- | --- |
| 1 | Money | `px37` Delhi: women hold 57% of Mudra loan accounts, 19% of the money | `fa35` Tamil Nadu: 5% of people, 36% of public-bank gold loans |
| 2 | Markets | `px52` Gujarat and Uttar Pradesh: fewer registered, more who traded | `fa55` Maharashtra: ₹60 in mutual funds per ₹100 in bank deposits |
| 3 | Farm and food | `rc01` Andhra Pradesh fish (stock) | `tn05` Chhattisgarh rice yield (stock) |
| 4 | Economy | `fa40` Haryana: GST collected was 9.2% of state output | `tn41` Tamil Nadu's share of India's FDI equity, 3.9% to 8.0% |
| 5 | Money | `fa30` Mizoram: 33% of bank deposits in regional rural banks | `tn36` Odisha: women's share of pension enrolments, 36% to 67% |
| 6 | Markets | `fa50` Delhi: 25 registered investors per 100 projected population | `tn51` Assam: registered investors up 13.3 times |
| 7 | Know your states | `px46` Karnataka and Tamil Nadu: 381 and 371 STP units, 6x exports | `fa48` Himachal: 26.5% of India's large-hydro electricity |

## Why this order

- No format runs twice in a row, and the two Shorts of a day differ in format, lead state and measure.
- `fa12` (Delhi deposits per bank office) could not run this week: it must stay 14 days from `px09`, which ran seven days earlier. So Money took four new scripts.
- Tamil Nadu leads or co-leads three Shorts (`fa35`, `tn41`, `px46`); they sit on days 1, 4 and 7. Delhi leads two (`px37`, `fa50`), five days apart.
- Each Markets day pairs different measures; day 2 pairs an NSE Short with an AMFI one. Day 6 has two NSE Shorts (a rate per population and a growth multiple).
- The viewer editor proposed `tn56` (Rajasthan) for Markets; Claude replaced it with `fa50` because `tn56` rests on an AMFI column that AMFI does not define and its first frame was rated the weakest of the week.

## Written, edited and not scheduled

| ID | What | Why not |
| --- | --- | --- |
| `tn56` | Rajasthan: equity-oriented share of fund assets, 40% to 80%, 2018-25 | Cleared, spare. AMFI does not say what its equity-oriented column holds. |
| `tn31` | Manipur: bank offices up 89% in ten years | Cleared, spare. AK to say whether a Manipur Short is wanted now. |
| `px32` | Kerala: rural banks lent ₹103 per ₹100 deposited, all banks ₹71 | Cleared, spare. The fourth loans-against-deposits story in a month. |
| `fa45` | Odisha: 28% of District Mineral Foundation collections, to Aug 2026 | Cleared, spare. Built on the Ministry of Mines' live page. |
| `px57` | Haryana and Kerala: level deposits, 2.7 times the fund assets | Held. AMFI revised its state list in March 2026; Haryana's figure fell 23% in a month on the new list. |
| `tn42` | Andhra Pradesh: rural construction pay 2.3 times in ten years | Held. The Labour Bureau's tables have no Telangana row and do not say which villages "Andhra Pradesh" covers. |
| `fa47` | Himachal: manufacturing was 26.5% of state output | Dropped. No rank, a falling share, a figure under revision. |

The four spares are in `public/datayt/bank/scripts/`, tested and unbuilt.

## New sources on the drive

- `public/datayt/sources/markets/nse_*.json`: National Stock Exchange, Market Pulse (September 2026 and earlier issues): registered investors by state for six dates, women's share, monthly registrations, traders and turnover for the top ten states, IPOs. Notes: `research/2026-10-13/week4/nse/NOTES.md`. Two issues (April and May 2026) print Andhra Pradesh and Madhya Pradesh under each other's names; eight issues and NSE's own registration counts support the September labels.
- `public/datayt/sources/markets/amfi_*.json`: Association of Mutual Funds in India, state-wise average assets, each September 2014 to 2026. AMFI revised its state list in March 2026 and its scheme categories in August 2026: do not compare a state across either.
- `public/datayt/sources/population/projected*.json`: National Commission on Population projections, the final July 2020 edition (the November 2019 draft has Odisha too low). Seven north-eastern states share one projection: do not rank two of them per person.
- `public/datayt/sources/mines/`, `cea/`, `stpi/`: one table each, read from a Ministry page or a Lok Sabha answer for `fa45`, `fa48` and `px46`.

## What changed in the builder

- `{"tbl": [path, column]}` reads any state table saved in the Handbook's shape; a week may carry its own themes (`week_plan.py`).
- Found by an editor: for fact and paradox scripts the builder ran only `"checks"` and skipped everything under `"tests"`. Fixed; all built and banked scripts were re-tested and still pass.
- Palette C was unusable (its colour code matched the banned "#1"). Fixed.
- A card heading over 33 characters now stops the build: it wraps onto the state outline. A statement card can carry a small note.

## What the frame check found

The first renders had four kinds of fault, all fixed and rendered again: card headings wrapping onto the state outline (seven Shorts), a caption colliding with the channel name (`tn51`), source text running off the last card (`tn36`), and a rupee figure printed with a decimal and without Indian grouping (`px46`).

## Open for AK

- The six sentences listed under "Sentences for AK's sign-off" in the packs of `px37`, `fa35`, `px52`, `tn36`, `fa50` and `px46`.
- NSE's October 2026 Market Pulse is due within days and will update every figure in `px52`, `fa50` and `tn51`.
- RBI's end-March 2026 state bank tables are published and were not read (`fa30`, `fa55`).
- Whether weeks five onward return to the standing seven themes or keep a Markets day.

Videos: `DarwinSSD/DataKadai/videos/<id>-2026-10-13-short.mp4`. Post packs: `docs/datakadai/posts/2026-10-13-<id>.md`.

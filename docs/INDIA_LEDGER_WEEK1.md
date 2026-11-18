# India Ledger: week 1 plan (19–26 Nov 2026)

**AK, 18 Nov 2026:** one long video and five Shorts this week. Two Shorts tell the long video's story as native Reveal
Loops (never clips), and three stand on their own. Formats: the long video follows the five-act Data Paradox
([`INDIA_LEDGER_PLAN.md`](INDIA_LEDGER_PLAN.md) section 2). Every Short follows the Reveal Loop
([`SHORTS_FORMAT.md`](SHORTS_FORMAT.md)) and passes `python3 scripts/shorts_check.py <id>` before it is rendered.

**Theme of the week: gold.** It is the first episode in the plan, it passes the topic test for every Indian state, and the
wedding season is on.

Numbers marked **VERIFY** have no source in hand yet. Pull them from the source named, or cut the line. Everything else was
checked on 18 Nov 2026 (sources at the end).

## 1. The calendar

| Day | Make | Publish |
| --- | --- | --- |
| Thu 19 Nov | Channel: rename to India Ledger, handle @IndiaLedgerOfficial, banner and description ("India's economy, in charts, from the official data"). Check Studio → Languages for multi-language audio. Pull every VERIFY number for the long video and Short 2. Write the long script. | — |
| Fri 20 Nov | Build Short 3 (its numbers are already verified in the repo). Long video: the visuals. | **Short 3** · phones |
| Sat 21 Nov | Build Short 4. Long video: the visuals. | **Short 4** · the ₹10 bottle |
| Sun 22 Nov | Long video: voice, Hindi track draft (`scripts/audio_tracks.py`), render, thumbnail. Build Shorts 1 and 5. | — |
| Mon 23 Nov | Final check of the long video (every source on screen, Act 5 present). | **Long video** |
| Tue 24 Nov | Set its Related video to the long video. | **Short 1** · the cube |
| Wed 25 Nov | — | **Short 5** · buffalo meat |
| Thu 26 Nov | Set its Related video to the long video. | **Short 2** · days of work |

The two episode Shorts go out **after** the long video, because a Related video can only point at a public video.
Publish at the same time each day. Read every Short at 48 hours and the long video at 7 days
(INDIA_LEDGER_PLAN section 4).

## 2. The long video (≈ 10 min, ≈ 1,400 words)

**Title (47 characters):** Indian Homes Own Nearly 4× America's Gold. Why?
**Thumbnail:** a stack of bangles beside a gold bar, with "4×" in the accent colour. No survey names.
**The question:** why do Indian families keep their wealth as gold, and what does it cost them and the country?

| Act | Time | Beat | Data | Picture |
| --- | --- | --- | --- | --- |
| 1. The paradox | 0:00–0:45 | "The biggest gold reserve on Earth isn't in a vault. It's in Indian homes." Households hold 31,000 tonnes, nearly 4× the US government (8,133 t) and 35× the RBI (880.5 t). The WGC calls most of it idle. | WGC, Treasury, RBI (checked) | The cube (s12) rising beside a Fort Knox bar stack; bars for US, RBI and homes |
| 2. The headline number | 0:45–2:30 | "₹315 lakh crore" is the figure everyone quotes. But it's an estimate, not a count: estimates run from 23,000 to 34,600 tonnes (2.8× to 4.3× America's), and the value moves with a price that swung by thousands of rupees per 10 g within November. | Estimate range (checked); the size of the November swing from the IBJA daily series (**VERIFY**; news sources disagree) | Dot chart (s05): one dot per 100 t, regrouping by estimate |
| 3. Why gold | 2:30–6:30 | Three datasets, each with a guess-then-reveal: (a) gold vs fixed deposits vs inflation over 20 years; (b) what Indians buy: jewellery vs bars and coins, and the rural share; (c) how much household wealth sits in gold and land, not in financial assets. | (a) IBJA and RBI series, our arithmetic; (b) WGC Gold Demand Trends; (c) RBI or the NSS household asset survey (all **VERIFY**) | Timeline (s11); money breakdown (s04); dots (s05) |
| 4. What it means for you | 6:30–8:30 | Families borrow against gold rather than sell it: gold loans have grown fast. The country pays for it in dollars: gold is one of India's biggest imports. Schemes to mobilise it (Gold Monetisation Scheme, Sovereign Gold Bonds) mostly didn't. | Gold loans: RBI sectoral credit; gold imports: DGCIS; scheme tonnes and dates (all **VERIFY**) | Flow map (s07) of gold arriving; document close-up (s03) |
| 5. What the numbers hide | 8:30–9:30 | Estimates differ on temple gold. Jewellery is 22 carat, not pure. A price on paper is not cash a family can spend. Our older Short said 3×; the WGC's 2026 estimate gives 3.8×. Then the open question: "How many days of work is the gold in your home?" | (checked) | Document close-up of the WGC report |

Rules: re-hook every 60–90 s with a "but" or "so"; sources on screen in every act; anything computed says "our
arithmetic"; illustrations are labelled "illustrative". Finance topic, so: no buy or sell language, no price forecast,
and the disclaimer on screen (rule O5).

## 3. The five Shorts

### Short 1 · from the long video · In ₹500 Notes · "India's home gold, in ₹500 notes" (≈ 29 s, 86 words)
Data: WGC (31,000 t, ₹314.9 lakh crore, Aug 2026); US Treasury (8,133 t, 30 Sep 2026); cube and stack are our arithmetic
(gold 19.32 g/cm³, 0.1 mm per note assumed, as in `samples/s12-scale`).
Visual: s12 scale. Frame 1: a gold cube already rising out of a home locker.
```
[0.0]  Indian homes hold nearly four times the gold
       of the US government.                               4× AMERICA'S GOLD
[3.4]  Thirty one thousand tonnes. How big is that?        31,000 TONNES
[5.8]  Not a mountain. Not a stadium.                      (wrong guesses struck out)
[7.6]  Melt it down, and it fits in one cube,
       under twelve metres a side.                          ≈ 11.7 M CUBE
[12.0] About as tall as a four storey building.            (building beside it, illustrative)
[14.6] But turn its value into five hundred rupee notes,   ₹315 LAKH CRORE
[17.8] and stack them.
[19.0] The stack climbs sixty three thousand kilometres.   63,000 KM (log zoom-out)
[23.0] A sixth of the way to the Moon.                     1/6 TO THE MOON
[25.8] So small, so valuable. And that's why               → loops to "Indian homes hold…"
SOURCE: World Gold Council, Aug 2026 · US Treasury, 30 Sep 2026 · cube and stack: our arithmetic
SEND LINE: everyone pictures a mountain of gold; it's a building, and the money reaches space.
```

### Short 2 · from the long video · Days of Work · "How many days of work is 10 g of gold?" (≈ 28 s)
Data: 10 g 24-carat price from IBJA on the build day (**VERIFY**); casual worker's daily earnings and a regular salaried
worker's monthly earnings from the latest PLFS bulletin tables, not the press note (**VERIFY**). Our arithmetic.
**Fallback:** if the wages aren't verified by Wed 25 Nov, publish "Indian homes hold 35× the RBI's gold" instead
(31,000 t vs 880.5 t, already checked).
```
[0.0]  How many days of work does ten grams of gold cost?  10 GRAMS = ? DAYS
[3.2]  Not a week. Not a month.                            (wrong guesses struck out)
[5.0]  Ten grams cost about ₹[price] today.                ₹[price]  VERIFY
[8.4]  A casual worker earns about ₹[wage] a day.          ₹[wage]/DAY  VERIFY
[12.0] So that's [N] days of work.                         [N] DAYS (calendar fills)
[15.8] On a regular salary of ₹[salary] a month,
       still [M] months.                                    [M] MONTHS  VERIFY
[20.4] And Indian homes hold thirty one thousand tonnes,
       bought ten grams at a time.                          31,000 TONNES
[25.0] So ask yourself:                                    → loops to "How many days of work…"
SOURCE: IBJA rate [date] · PLFS [quarter] · our arithmetic
SEND LINE: every family has bought gold; nobody has priced it in days.
```

### Short 3 · on its own · In Your Pocket · "India exports ₹3 lakh crore of this" (≈ 30 s)
Ready: the script is the worked example in SHORTS_FORMAT section 7, and its data is verified
(`hyperframes/videos/dk-phones/story.js`, DGCIS FY 2025–26). Build it first.

### Short 4 · on its own · In Your Pocket · "₹10 bottle vs Coke and Pepsi: 93% to 85%" (≈ 27 s, 78 words)
Data: NielsenIQ via Storyboard18 and Trak.in, Jan–Sep 2024 vs Jan–Sep 2025 (second-hand: NielsenIQ declined to comment).
**VERIFY** whether a 2026 reading exists; if it does, use it and change the dates. It also seeds episode 2.
```
[0.0]  For decades, two companies sold almost every
       soft drink in India.                                 COKE + PEPSI
[3.6]  Ninety three percent of the market.                 93%
[5.6]  Then came a ten rupee bottle.                       ₹10
[7.6]  Campa, from Reliance. And Lahori, a jeera drink.
[10.8] In one year, the two of them doubled.
       Seven percent, to nearly fifteen.                    7% → 15%
[15.4] Coke and Pepsi? Down to eighty five.                85%
[18.2] Most of the fight was at one price. Ten rupees.     ₹10
[21.4] So the giants launched ten rupee packs.
       Something they never needed, because                 → loops to "For decades, two companies…"
SOURCE: NielsenIQ, Jan–Sep 2024 vs Jan–Sep 2025, as reported by Storyboard18
SEND LINE: everyone has seen Campa in the shop; nobody knows it moved the market.
```

### Short 5 · on its own · "India's ₹45,000 crore meat export isn't chicken" (≈ 26 s, 75 words)
Data: DGCIS FY 2025–26, already in the repo (`hyperframes/videos/dk-buffalo/story.js`; poultry from
`hyperframes/videos/ia-poultry/story.js`). 16× is our arithmetic.
**AK's call:** buffalo meat is a legal export but a sensitive topic, and it fits none of the three series.
Swap for another product from the same DGCIS data if you prefer.
```
[0.0]  India sells forty five thousand crore rupees
       of meat abroad every year.                           ₹45,196 CR
[3.6]  Most people guess chicken. It isn't.                NOT CHICKEN
[5.8]  Chicken is under three thousand crore.
       This is sixteen times that.                          16×
[9.8]  It's buffalo meat. Up thirty one percent in a year. +31%
[13.2] And most of it isn't cleared at a port.             NOT A PORT
[15.4] More than half is cleared at inland depots
       in Uttar Pradesh: Dadri and Kanpur.                  54% · UP (map)
[20.4] The biggest buyer? Vietnam.                         VIETNAM 18%
[23.0] From UP to Vietnam. And that's why                  → loops to "India sells…"
SOURCE: DGCIS principal commodity × port × country, FY 2025–26 · 16×: our arithmetic
SEND LINE: almost everyone guesses chicken.
```

## 4. Before anything is published

1. Every VERIFY is cleared or the line is cut.
2. Each Short: `shorts_check.py` shows no FAIL; the title is at most 50 characters; 0–2 hashtags.
3. Long video: sources on screen in every act; Act 5 is in; disclaimer on screen; English captions uploaded.
4. Narrator: until AK decides on a human voice, use the MiniMax voice, and run `shorts_build.py verify` after every voiced build.
5. Related video set by hand in desktop Studio for Shorts 1 and 2.
6. Log every upload for the 48-hour and 7-day reads.

## Sources checked on 18 Nov 2026

- WGC "Swarnim Udaan 2047" press release, 4 Aug 2026: 31,000 t, ₹314.9 lakh crore — gold.org; Business Today, Outlook Money
- US Treasury, Status Report of U.S. Government Gold Reserve, 30 Sep 2026: 261,498,926 fine troy oz (8,133.5 t, our conversion) — home.treasury.gov
- RBI, Half-yearly Report on Management of Foreign Exchange Reserves (Oct 2025–Mar 2026): 880.52 t — rbi.org.in
- Estimate range: HDFC MF/Upstox 23,000–25,000 t; UBS ~28,000 t; Morgan Stanley ~34,600 t
- Campa: Storyboard18 (Nov 2025), Trak.in
- 10 g price in November moved between about ₹1.21 lakh and ₹1.44 lakh across sources: use IBJA on the day, with its date on screen

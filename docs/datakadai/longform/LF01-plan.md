# Data Kadai long-form 01: plan (14 Oct 2026)

AK, 14 Oct 2026: "plan for this week long form video. Long form video should be about current trending topics go little more detailed than our regular Shorts."

Status: plan only. Nothing is scripted, voiced or rendered for this yet, and nothing is posted.

## Recommendation: September's prices

**Working title:** What Moved India's Prices in September: Onion, Food and the New CPI
**Length:** about 7 minutes, 16:9 (1920×1080), nine chapters, the same narrator as the Shorts.

**Why this topic:**
- It is the week's data story. MoSPI released September's consumer price index on 12 Oct 2026: inflation 5.54%, up from 4.83% in August, with onion prices up 108% in a year. Business, national and regional outlets led with it on 12 and 13 Oct.
- It ties three things people are talking about: onion prices, the RBI's rate rise of 7 Oct (repo rate up to 5.50%), and the festival-season shopping that is starting.
- Every figure in the outline below was read at the publisher's own page: the PIB release (read in the built-in browser), MoSPI's eSankhyiki data portal and the RBI's press releases. That is 25 figures, none taken from a news report.
- It has a map for every state and territory (36 rows: headline, rural, urban, food and onion inflation), which is what this channel does best.
- It stays true until 12 November, when October's index comes out and revises September. Posting by 18 October leaves about three weeks of shelf life.

## The outline (about 7 minutes)

| # | Chapter | Time | What is on screen | Figures (all official, September 2026 unless stated) |
| --- | --- | --- | --- | --- |
| 0 | Cold open | 0:25 | Onion, then the India map lighting up | Onion +108% in a year; inflation 5.54%, the highest of the nine months in the new series |
| 1 | The headline | 0:45 | Line chart, January to September | 2.74% in January, then up every month to 5.54%; August 4.83%. The new series (base 2024) has only nine months of yearly rates, so no "highest since" claim |
| 2 | Food leads | 1:00 | Bars by spending group, sized by weight | Food 7.74% (August 5.97%). Sugar 13.8%, fruit 10.8%, vegetables 9.2%, cereals 3.9% (rice 8.3%, wheat 1.6%), milk and eggs 5.1%. Food and drinks are 36.8% of the basket |
| 3 | The onion story | 1:15 | Onion's price index month by month; then the items that fell | Onion's index went from 68 in June to 143 in September. In the same month potato was −11.5%, tomato −8.6%, garlic +54.6%, ginger +62.9%. Quoted as stated: the RBI's line on low rabi stocks, kharif arrivals and uneven rain, and Consumer Affairs on the buffer stock and ₹35-a-kg sales |
| 4 | Gold and silver | 0:40 | Two bars and a jar of coins | Silver jewellery +87.8%, gold jewellery +30.9%; together they lift "personal care and other goods" to 13.75% |
| 5 | Villages and cities | 0:45 | Two lines pulling apart | Rural 6.08% against urban 4.88% (level in January: 2.73 and 2.75). Food is 42% of the rural basket and 30% of the urban one; MoSPI does not say this is why, so the video will not either |
| 6 | Your state | 1:15 | Full map, then the top and bottom five | Highest: Puducherry 6.86, Tamil Nadu 6.81, Odisha 6.70, Madhya Pradesh 6.68, Telangana 6.64. Lowest: Mizoram 2.85, Nagaland 3.22, Delhi 3.40. 11 of 36 were above India. Biggest jump from August: Jharkhand, +1.9 points; only Assam fell. A second map for food inflation (Puducherry 11.2, Tamil Nadu 10.6, Andhra Pradesh 10.2) |
| 7 | What the RBI did | 0:40 | Rate card and the next dates | Repo rate up 25 basis points to 5.50% on 7 October, decided before this print. The RBI expects 5.2% inflation for 2026-27 and 6.0% in October to December. Minutes on 21 October, next meeting 2 to 4 December. No forecast of our own |
| 8 | How the number is made | 0:40 | Basket, markets, phones | Base year 2024; 358 items; prices from 1,465 villages and 1,407 urban markets; weights from the 2023-24 household spending survey. Food's weight fell from 42.6% to 36.8% in the new basket |
| 9 | Close | 0:20 | Map and the question | Next number: October's index on 12 November. Question: "Which price hit your home hardest?" Sources on screen |

About 950 spoken words. The description carries chapter timestamps, every source with its date, and the note that the video is analysed and animated by Data Kadai with an AI narrator.

## Rules this video keeps

- No cause the source does not give. MoSPI states no reasons; the onion lines are the RBI's and Consumer Affairs' own words, in quotes.
- No ranking language that runs a state down. The map says how much prices rose, not who did badly.
- Left out: the tobacco and intoxicants group, the religious-services item, any onion price in rupees (official and press figures conflict), export duties (no official notice found), and any forecast.
- Every figure is dated September 2026 and called provisional, as MoSPI does.
- A press claim the release does not support (for example "a 23-month high", which crosses the change of series) is not used.

## What has to be built (new for the channel)

1. **Saved source tables:** the release's state table, groups and items, plus MoSPI's portal series for food and onion, written to `public/datayt/sources/mospi/` with the time read, so the builder recomputes every number as it does for the Shorts.
2. **A 16:9 long-form template:** chapter cards, a line chart, weighted bars, a state map with a ranked list beside it, a quote card, a two-line comparison, an explainer card and an end card. It reuses the Shorts' map, fonts and colours.
3. **A long-form builder:** reads one script file, checks every figure against the tables, voices each line, lays the chapters on the music, and writes the chapter timestamps.
4. **The pack:** title, description with chapters and sources, a thumbnail (1280×720), the X image, an Instagram carousel and the map, as for every Short.

Then the usual gates: an editor recomputes every figure, Claude reads every line, voice, render, a frame check of every chapter, then AK watches it.

## Timetable

| Day | Step |
| --- | --- |
| Wed 14 Oct | Plan (this page). Save the source tables; start the template |
| Thu 15 Oct | Script, editor check, template finished |
| Fri 16 Oct | Voice, render, frame check, pack. To AK for review |
| Sat 17 or Sun 18 Oct | AK posts it |

## Other topics found this week

| Topic | Trending | Official data | Why not this week |
| --- | --- | --- | --- |
| Monsoon report card: which states ran dry | Strong (season ended 13% below normal, drought declared in parts of Karnataka, Andhra Pradesh and Maharashtra) | IMD state tables exist, but IMD's pages did not open; every state figure so far is from news reports, and they disagree | Best candidate for next week once IMD's own tables are read. Drought is sensitive: facts only |
| The RBI's tense week: rate rise, rupee, reserves | Strong | All read at the RBI | Folded into chapter 7; on its own it is mostly national figures with no map |
| Phones and the internet: 1.11 billion online | Steady (TRAI's quarterly report, 12 Oct) | TRAI tables by telecom circle, not by state | No figure read at TRAI yet; circles are not states |
| Gold and silver before Diwali | Rising toward Dhanteras (6 Nov) | RBI's gold holdings and price notices are official; the rest is market data | Better in the first week of November |
| Small investors: record SIPs in a falling market | Moderate | NSE and AMFI monthly tables | The October tables were not out yet |
| Stubble fires and Delhi's air | Seasonal | Fire counts for seven states only | Hard to tell without blame between governments |

## For AK to decide

1. The topic: September's prices (recommended), or one of the alternatives above.
2. The length: about 7 minutes as planned. The channel research found 12 to 18 minutes works best for long-form, but you asked for a little more detail than the Shorts.
3. Whether to cut a 40-second Short from the onion chapter to point viewers to the long video.

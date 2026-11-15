# Shorts built from the daily topic scout

Reveal Loop Shorts ([`SHORTS_FORMAT.md`](SHORTS_FORMAT.md)) built after the benchmarks, newest first. Each entry gives the topic
test, the script as voiced, and a source for every number on screen. Scripts live in `hyperframes/tools/shorts_build.py`
(`S[...]`); pages in `hyperframes/shorts/<id>/`; build steps as in [`SHORTS_BENCHMARKS.md`](SHORTS_BENCHMARKS.md#build).

| Id | Channel · series | Title | Length | Picture |
| --- | --- | --- | --- | --- |
| `dk-exports` | Data Kadai · The Catch | India's exports jumped 45%. A third was fuel | 26.4 s | Two stacks of shipping containers ($1 B each): the 15 new ones drop in, fuel lights up, fuel and jewellery are taken out |
| `ia-sunset` | Indica Atlas · Not Where You Think | India's sun sets 2 hours apart on one clock | 33.8 s | The evening of 20 Nov 2026 as a time-lapse on one IST clock: the computed night sweeps across India's terrain |

**Status (15 Nov 2026):** voiced with MiniMax (`English_Diligent_Man`), every line checked by transcription
(`shorts_build.py verify`: all 16 lines match the script), Shorts gate passed with no FAIL, HyperFrames check passed with no
error, rendered and muxed to `out/hyperframes/<id>-final.mp4` (not in git). Before publishing: AK listens to both, and decides
whether Data Kadai gets **The Catch** as a series (it is a Moat & Margin series in `SHORTS_FORMAT.md` §6; none of Data
Kadai's three series fits a "the headline hides something" story).

## `dk-exports` · Data Kadai

**Topic test.** Familiar: the "+45% exports" headline that ran everywhere on 13–14 Nov 2026. Hidden: one item, petroleum
products, is a third of the jump, and without fuel and jewellery growth is 33%. Send: "the 45% isn't what you think."
The weakest test is Familiar (exports are not an object): the picture makes it physical with containers.

**Script** (voice: `English_Diligent_Man`)
> India's goods exports jumped forty five percent this October. · What are we selling so much more of? · The biggest jump
> isn't phones. Or machines. · It's fuel. Petroleum products, up a hundred and forty percent. · From three point seven billion
> dollars to almost nine. · That one item is a third of the whole jump. · Take out fuel and jewellery, and exports grew thirty
> three percent. · Still big. Just not forty five. So when a headline says, → *(loops to "India's goods exports jumped…")*

All figures: PIB, Ministry of Commerce & Industry, "India's total exports … October 2026", 13 Nov 2026, Release ID 2335914
(read from pib.gov.in on 15 Nov 2026).

| On screen | Value | Source |
| --- | --- | --- |
| Goods exports, Oct 2025 → Oct 2026 | $34.11 B → $49.47 B | PIB Table 1 |
| +45% | 49.47 ÷ 34.11 = 1.450 | Our arithmetic (the release's own goods figures) |
| Rise | $15.36 B | 49.47 − 34.11, our arithmetic |
| Engineering goods | $9.37 B → $12.74 B (+$3.37 B, +36.01%) | PIB, major drivers |
| Electronic goods | $4.08 B → $6.64 B (+$2.56 B, +62.70%) | PIB, major drivers |
| Petroleum products | $3.70 B → $8.89 B (+$5.19 B, +140.21%) | PIB, major drivers; matches Table 3 (49.47 − 40.58 non-petroleum = 8.89) |
| Fuel is the biggest jump | +$5.19 B | The five listed drivers add up to $12.81 B of the $15.36 B rise, so all other groups together rose $2.55 B: none can beat $5.19 B. Our arithmetic |
| A third of the jump | 5.19 ÷ 15.36 = 33.8% | Our arithmetic |
| Without petroleum and gems & jewellery | $28.11 B → $37.38 B, +33.0% | PIB Table 3; the percentage is our arithmetic |
| Gems & jewellery | $2.29 B → $3.21 B | PIB, major drivers |
| Containers | 1 ≈ $1 B, rounded: base 34 (other 15, engineering 9, electronics 4, gems 2, fuel 4), rise 15 (fuel 5, gems 1, electronics 3, engineering 3, other 3) | Illustration, labelled on screen |

Wording chosen with care: "goods exports" (the 45% is merchandise only; total exports with services grew 29.90%); "the
biggest jump isn't phones" is about the size of the rise in dollars (electronics grew faster in percent, 63%, but by less
money). Not said: why fuel exports rose (price or volume): the release does not say.

## `ia-sunset` · Indica Atlas

**Topic test.** Familiar: everyone's clock and the evening. Hidden: on one clock, the sun sets about two hours apart across
India (4:07 PM in Dong, Arunachal; 6:11 PM in Guhar Moti, Kutch, on 20 Nov 2026), and Assam's tea gardens once kept their own
time. Send: north-east viewers send it to everyone who doesn't believe it gets dark at four.

**Script** (voice: `English_Diligent_Man`)
> Just after four, the sun sets in Arunachal Pradesh. · In Kutch, it's still broad daylight. When does it set there? · Not at
> five. Not even at six. · Ten past six. Two hours later, on the very same clock. · Because India is almost three thousand
> kilometres wide, but keeps one time zone. · That time is set here, at eighty two and a half degrees east, near Mirzapur. · So
> in British times, Assam's tea gardens ran an hour ahead. Bagaan time. · Same country. Same clock. And every November evening,
> → *(loops to "Just after four…")*

| On screen | Value | Source |
| --- | --- | --- |
| Sunset, 20 Nov 2026, Dong (28.17°N, 97.02°E) | 4:07 PM IST | Our calculation: NOAA general solar position equations, sun's upper limb with standard refraction (−0.833°) |
| Sunset, Guhar Moti, Kutch (23.70°N, 68.12°E) | 6:11 PM IST | Same |
| Sunset, Dibrugarh (27.47°N, 94.91°E) | 4:17 PM IST | Same |
| 2 h 04 min apart | 18:11 − 16:07 | Our arithmetic. NCERT Class 9 Geography, ch. 1 ("India: Size and Location"): "From Gujarat in the west to Arunachal Pradesh in the east there is a time lag of two hours" |
| ≈ 2,925 km east to west | 2,925.2 km | Great-circle distance Dong to Guhar Moti, our measurement (mean Earth radius 6,371.0 km) |
| 82°30′E through Mirzapur | Standard Meridian of India | NCERT Class 9 Geography, ch. 1 |
| Night on the map | elevation of the sun at every point on screen, recomputed every frame | Same equations as the sunset times; the clock is a time-lapse |
| Bagaan time, IST + 1 h, since British times | "Assam has decided to switch to Bagaan (tea garden) Time, set an hour ahead of Indian Standard Time"; "150 years after the British colonialists introduced 'chaibagaan time' … one hour ahead of IST" | Al Jazeera, "Indian state pushes to set clock right", 8 Jan 2014; timeanddate.com news, 2014 |
| Terrain | shaded relief, z6 and z7 | AWS Terrain Tiles (Terrarium), `tools/atlas_base.py`; no borders are drawn |

Rebuild the terrain: `atlas_base.py 6 54 -14 112 52 wide.jpg` (saved as `assets/img/wide.webp`, quality 80) and
`atlas_base.py 7 64 4 101 37.5 india.jpg` (resized to 2560 px, `india.webp`, quality 82).

Sunset times move about a minute between 15 and 30 November (Dong 4:09 → 4:06, Guhar Moti 6:12 → 6:10), so the spoken
"just after four" and "ten past six" hold for any day in the second half of November; the date on screen is 20 Nov 2026.
Not used on purpose: the scout's "4:15 PM in Assam" (Guwahati is 4:32 PM, Dibrugarh 4:17 PM), and the "20 million kWh a year"
saving from a CSIR-NPL study (we have not read the study itself); "ran an hour ahead" is past tense because we have no
source for what the gardens keep today.

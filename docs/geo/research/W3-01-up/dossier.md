# W3-01-up "Uttar Pradesh would be one of the world's biggest countries": research dossier (1 Nov 2026)

Week 3, day 1 AM, category "Map is lying". Research only: no script, voice or render. Rules: `docs/geo/RESEARCH_RULES.md`, brief `docs/geo/week3/RESEARCH_BRIEF.md`.

**Status: ready for G6 (independent check).** research_check.py result is in the report that came with this folder. Every figure below is read from a document or dataset opened in this run.

## Verdict on the premise
**True by people, false by land.** "One of the world's biggest countries" holds only for population: on a one-year, one-basis comparison UP would be **sixth** in the world in 2026 (about 24.3 crore, an official projection) [C008], neck and neck with Nigeria [C009], ahead of Brazil by 14% [C009]. By area it would be about **81st of 216**, the size of the United Kingdom [C012, C013]. The honest line is not "huge" but **"UK-sized land, sixth-largest crowd"**: the same land as Britain with 3.5 times the people [C014].

Two corrections to the popular version: it is **sixth, not fifth** (Pakistan is ahead in 2011 on the plain census count and in 2026 on every basis) [C010, C008, M1, M3], and the 24 crore figure is a **projection**, because the last real count was in 2011 and the next has a reference date of 1 March 2027 [C001, C019].

## The facts, in plain words
- **Last count (2011):** 199,812,341 people [C001] on 240,928 sq km [C002], 829 per sq km [C003]. That is 16.5% of India's people (1 in 6) [C004] on 7.3% of its area [C005].
- **Official projection 2026:** 243,466 thousand on 1 July 2026 [C006]; 200,897 thousand on 1 July 2011 and 259,459 thousand on 1 July 2036 [C007]. The Technical Group expects UP alone to supply 19% of India's growth from 2011 to 2036 [C023].
- **World table, 2026 (UN estimates, 1 July; UP inserted from the projection, rest of India counted as a separate country)** [C008, C009]: China, rest of India, United States, Indonesia, Pakistan (259.3 million), **Uttar Pradesh (243.5 million)**, Nigeria (242.4 million), Brazil (213.6 million). UP leads Nigeria by 1.0 million (0.4%): a tie in practice.
- **2011 on the same method** [C010]: UP's census count 199.8 million is behind Pakistan's 203.7 million (UN estimate) and ahead of Brazil's 195.3 million. If UP is scaled up to the UN's higher India figure (UN India is 4.2% above the census [C021]), it edges ahead of Pakistan: fifth [C011]. That is why 2011 is "fifth or sixth, depending on basis" and 2026 is "sixth" on both.
- **Area:** UK-size [C013] (240,928 vs 243,610 sq km; our own measure 240,677 vs 242,737 [C022]). Nigeria is 3.8 times the land of UP, Pakistan 3.3 times, Brazil 35 times [C015]; Nigeria's crowd fits in UP's land.
- **Crowding:** about 1,010 people per sq km on the 2026 projection; of countries with over 10 million people, only Bangladesh (1,205) is denser [C016] (hedged: mixed years).
- **No coast:** the sea is at least about 480 km from UP's border (our measure) [C017]. UNCTAD's list of 32 landlocked developing countries has Ethiopia as the biggest at 138.9 million; UP is 1.75 times Ethiopia [C018].
- **Why "official projection":** the Technical Group (National Commission on Population, Nov 2019) was set up to revise the "existing official projection figures" for the National Commission, NITI Aayog and others [C020].

## Fresh angles (G7)
G7: PASS. Verified facts the popular "if UP were a country" versions leave out or get wrong (myths.md lists what they say):
1. **Sixth, not fifth.** The popular line ranks UP fifth behind China, the rest of India, the US and Indonesia and skips Pakistan, whose UN-estimated 2011 population was 203.7 million against UP's 199.8 million; in 2026 it is 259.3 vs 243.5 [C010, C009, M1]. Hook candidate: "Everyone says fifth. The numbers say sixth."
2. **The land is Britain's.** UP's area is within about 1% of the United Kingdom's on two independent measures, yet it has 3.5 times the people [C013, C014]. Hook/"why" candidate: "Same land as Britain. 3.5 times the people."
3. **A photo finish with Nigeria.** UP's 2026 projection exceeds Nigeria's UN estimate by 0.4%; on the other basis by 4% [C009, C011]. Nigeria has 3.8 times UP's land [C015]. "Same crowd, one-fourth the land" is a clean, true comparison (about 3.8x).
4. **The 24 crore is not a count.** The last count was 2011; every later figure is a projection, until the census with reference date 1 March 2027 [C019, C006]. A twist for an Indian audience: the count that settles this is a few months away.
5. **No sea within about 480 km, yet bigger than every country on the UN's landlocked list by 1.75 times** [C017, C018].
6. **1 in 6 Indians on 1 in 14 of India's land** [C004, C005].

## Hook and twist candidates
- Hook A (the popular claim, then the twist): "Everyone says Uttar Pradesh would be the fifth biggest country. It would be sixth." (C008, C010)
- Hook B (a picture the viewer can hold): "Draw the United Kingdom on top of Uttar Pradesh. Same size. Now count the people: 3.5 times as many." (C013, C014)
- Hook C (the number): "24 crore people, 240,000 square kilometres." (C006, C002; label the 24 crore "projected")
- Twist/"why" (G7): "The map shows land. Population is a different map." (do NOT say the map fools you; show the comparison, C005, C004)
- Closer: "The real count comes in 2027." (C019)

## Map and visual notes (artistic items tagged)
- Base: Natural Earth admin-0 with the India point of view (`ne_10m_admin_0_countries_ind`) and admin-1 for UP (feature IN-UP, 2,100 vertices), both already on the SSD. No disputed border is involved; UP's northern edge with Uttarakhand/Nepal is as drawn in the house file, no label needed.
- UK overlay: trace the United Kingdom outline from `ne_10m_admin_0_countries_ind` at true scale (equal-area; at UP's latitude, 24 to 30N, a plain lat/lon overlay distorts, so scale both by the same equal-area projection). Our area ratio is 1.01 (C013).
- A population bar chart of the six: China, rest of India, US, Indonesia, Pakistan, UP, then Nigeria, Brazil in the "nearly" row (values in C008/C009). Round to 0.1 million or show crore.
- People-dot grid (artistic): one dot = one crore; UP 24, UK 7. Tag dots `artistic`.
- A pin or label for the sea: arrow from UP's south-east corner to the Odisha coast, "about 480 km" (C017). Label Odisha only if shown on the house map.
- Nothing outside the claims ledger: no state capitals, no district counts (not researched).

## What a 9-beat 85-100 word Short could safely say (ten strongest verified one-sentence facts)
1. Uttar Pradesh had 199,812,341 people at the 2011 census. [C001]
2. Its area is 240,928 square kilometres, about the size of the United Kingdom. [C002, C013]
3. In 2026 it has about 24.3 crore people, an official projection. [C006]
4. That would make it the sixth most populous country in the world, not the fifth. [C008, C010]
5. Pakistan, at about 26 crore, would still be ahead of it. [C009]
6. It is about level with Nigeria, and ahead of Brazil by around 3 crore. [C009]
7. The United Kingdom has less than a third of UP's people on about the same land (UP has 3.5 times as many). [C014]
8. Nigeria would have 3.8 times the land for the same crowd. [C015]
9. Uttar Pradesh holds one in six Indians on one-fourteenth of India's area. [C004, C005]
10. The next census has a reference date of 1 March 2027. [C019]
Also usable: no coast, about 480 km from the sea, with 1.75 times the people of Ethiopia, the largest country on the UN's landlocked developing list [C017, C018].

## Hedges to keep in any script
"About 24 crore" is a projection [C006]; "about level with Nigeria" [C009]; "about the size of the UK" [C013]; "sixth" on both bases for 2026 [C008, C011]; "bigger than any country on the UN's landlocked list" not "biggest landlocked in the world" [C018].

## Artistic-licence notes
Overlaying the UK on UP is a visual comparison (equal-area), tag `artistic`. The word "country" is hypothetical throughout: UP is a state of India. Dot grids are artistic.

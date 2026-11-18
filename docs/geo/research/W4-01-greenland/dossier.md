# W4-01-greenland "Greenland looks as big as India on the map. It isn't.": research dossier (lite, 14 Nov 2026)

Week 4, day 1 AM, category "Map is lying", audience Global, Kanyakumari format (Reveal Loop). Research only: no script, voice or render. Rules: `docs/geo/RESEARCH_RULES.md`; briefs `docs/geo/week4/RESEARCH_BRIEF.md` and `docs/geo/week3/RESEARCH_BRIEF.md` (SHORTS LITE MODE). Three original sources: UN Demographic Yearbook 2023 Table 3 (S01, both areas, one publisher), NSIDC Ice Sheet Quick Facts (S02), Natural Earth India-view outlines measured by us (S03).

**Status: ready for G6 (independent check).**

## Verdict on the pitch
**True, but it undersells the gap.** India is about 1.52 times Greenland's size (3,287,263 vs 2,166,086 sq km) [C001-C003]. On a Mercator map Greenland does not look "as big as" India: its outline covers about **8.9 times** as much map as India's (our measurement) [C004]. Honest wording: *"On the map, Greenland looks far bigger than India. It's actually about two-thirds of India's size."*

## The facts, in plain words
- Greenland 2,166,086 sq km; India 3,287,263 sq km; same table, same year [C001, C002]. Source line: "UN Demographic Yearbook 2023".
- India is about one and a half Greenlands; Greenland is about two-thirds of India [C003]. "Our arithmetic, UN data".
- On a Mercator map, Greenland's outline is about 9 times India's (our measurement, Natural Earth) [C004].
- Why: Mercator blows up area by about 13.7 times at Greenland's middle (74 N), 1.17 times at India's (23 N) [C005].
- About 80% of Greenland is under an ice sheet of about 1.7 million sq km [C006]. "NSIDC".
- About 57,000 people (2023); UN density prints as 0 per sq km [C007]. "UN Demographic Yearbook 2023".
- Still "the largest island in the world" (NSIDC) [C008]: huge, just not India-beating.

## Fresh angles (G7)
G7: PASS. Verified facts the popular version leaves out or gets wrong (myths.md):
1. **The map doesn't make Greenland "as big as" India; it makes it about nine times India** [C004]: the popular line understates the lie, and the true size is two-thirds of India [C003]. Hook: the gap is wider than people think.
2. **Most of that "big white land" is ice**: about 80% under an ice sheet [C006], and about 57,000 people live there, so the UN prints its density as zero [C007]. The "why it looks empty" twist.
3. (Mechanism) The stretch is about latitude, not Greenland: at 74 N area is inflated about 13.7 times, India's 1.17 [C005]. Lets the camera prove it by sliding Greenland south.

## Reveal Loop material
1. **The belief.** "On every world map, Greenland is this giant white island. Bigger than India, maybe even as big as Africa. Right?" Is the belief common? **Not shown in this run.** The lite cap (3 original sources) left no room for a textbook or quiz citation; one attempt (a USGS projection FAQ) returned 403 / empty page and is logged. What is shown: Mercator does make Greenland about 9 times India [C004], so anyone reading a Mercator map would believe it. AK decides whether that is enough.
2. **The turn.** "Not quite: India is about one and a half Greenlands." [C001, C002, C003]
3. **The camera move.** One continuous move on shaded relief + Sentinel-2, no borders: start on a Mercator world view with Greenland's true-scale outline pinned at its own place (label point 74.32 N, 39.34 W; extent 59.79-83.63 N, 73.06-11.38 W) [C010]; drag the outline south along 39 W... then east to sit on India's label point (22.69 N, 79.36 E; India extent 6.75-37.05 N, 68.14-97.36 E) [C010], re-projecting it at each latitude so it shrinks as it slides (the 13.7x -> 1.17x of C005). It lands visibly smaller than India's true-scale outline. Coordinates: Natural Earth 1:10m admin-0, India view (S03), `method/mercator_areas_output.txt`. Outlines only as true-scale shapes, never as borders.
4. **One felt comparison.** "On the map it looks nine times bigger than India. In reality India is one and a half Greenlands" (our measurement: 8.92x on Mercator; 1.52x real) [C003, C004]. Label: "our measurement".
5. **One human detail.** About 57,000 people live on the whole island; the UN's own table rounds its density to zero people per square kilometre [C007] (S01, from Greenland's registers, footnote 50).
6. **Three loop-line candidates** (opening line: "On the map, Greenland looks bigger than India."):
   - "...and that's the trick: the further north you go, the bigger it gets, so on the map," -> "Greenland looks bigger than India."
   - "...shrink it to its real size and you see why, on the map," -> "Greenland looks bigger than India."
   - "...two-thirds of India. Yet still, on the map," -> "Greenland looks bigger than India."
7. **The send line:** "People forward this because it's a map they've looked at all their life, and in ten seconds it's caught lying about their own country."
8. **The topic test.**
   - Familiar: **PASS**. The world map and India's shape are recognised in one second with the sound off.
   - Hidden: **PASS, with a caveat**. "9x on the map, 0.66x in reality" is a number they can't guess; but the Mercator-Greenland fact itself is widely known online (the Africa version), so the India angle carries it.
   - Send: **PASS**. A "did you know your map is lying about India" forward. Risk: a viewer who already knows the Africa version may scroll; AK decides.

## Hook and twist candidates
- Hook: Greenland's outline on a Mercator map, filling the frame; overlay "Bigger than India?" [C004].
- Twist: it slides south and shrinks to two-thirds of India [C003, C005].
- Second twist: and 80% of it is ice [C006]; about 57,000 people [C007].

## Map and visual notes
- Base: shaded relief + Sentinel-2 (house atlas engine). No borders drawn (house rule). Outlines of Greenland and India from Natural Earth 1:10m admin-0, India view (`/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_admin_0_countries_ind.geojson`), shown as true-scale shapes or pins only.
- The sliding outline must be re-projected at each latitude (Mercator) so the shrink is real, not a tween of scale. Use `method/mercator_areas.py` functions.
- Every number on screen gets its source line: "UN Demographic Yearbook 2023" (areas, people), "NSIDC" (ice), "Our measurement, Natural Earth" (9x, 13.7x, 1.5x).

## What an 8-beat 65-100 word Short could safely say
1. India's area is 3,287,263 sq km; Greenland's is 2,166,086 sq km (UN, 2023). [C001, C002]
2. India is about one and a half times the size of Greenland. [C003]
3. Greenland is about two-thirds of India's size. [C003]
4. On a Mercator map, Greenland looks about nine times India's size (our measurement). [C004]
5. The further from the equator, the more Mercator inflates: about 13.7 times at Greenland's middle, 1.17 times at India's. [C005]
6. About 80% of Greenland is covered by an ice sheet. [C006]
7. About 57,000 people live in Greenland; the UN rounds its density to zero per sq km. [C007]
8. It is still the world's largest island (NSIDC). [C008]
9. Moved to India's latitude at true scale, Greenland's outline sits inside a shape smaller than India's. [C003, C005]
10. The ice sheet alone is about 1.7 million sq km. [C006]

Not safe: "Google Maps/your school map uses Mercator" (unsourced here); exact ice-free area; anything about Greenland's politics or ownership (not researched).

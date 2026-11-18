# W4-04 Living root bridges, Meghalaya: dossier (14 Nov 2026, Shorts lite mode)

Sources: S01 Ludwig et al., Scientific Reports 9:12226 (2019) + Supplementary Table S1 (P5, own field measurements 2015-2017); S02 India's UNESCO Tentative List entry 6606 (P2, State Party text). Rule 6: S01's authors gain from presenting the bridges as a model for "Baubotanik" (their own research field); their numbers are measured and hedged. S02's author (Government of India) gains from a strong case for inscription; its superlatives ("wettest region on Earth", "for centuries", "masterpiece") are advocacy and are not used as our facts.

## Verdict on the pitch
"In Meghalaya people grow bridges instead of building them": TRUE, with one honest tweak. They are grown from living Ficus elastica roots (C001), but people also lay stones and soil on the path and tie and prune the roots (S01 Results, maintenance), so the honest wording is "grow and tend". Paper typo in the hint: Ludwig et al. is 2019, not 2023.

## The real story, in plain words
Villagers guide the aerial roots of India rubber trees across a stream. The roots thicken and fuse, so the bridge gets stronger every year (C003). The surveyed bridges run from 2 m to 52.7 m (C004). Some are put at about 200 years old by the people who keep them (C005). One at Siej had been growing for 66 years and was still not fully usable, and the scientists say no one can yet say how long a bridge takes (C006). India has put them on UNESCO's Tentative List (C007).

## Fresh angles (gate G7)
1. Nobody knows how long a root bridge takes: one was still unfinished after 66 years (C006). Popular copy says 10-20 years (myths M1).
2. They are not a World Heritage Site: only on the Tentative List since Feb 2022 (C007, myths M2).
3. India's own file records a belief that only a childless elder may plant the sapling (C008), attributed.
G7: PASS (angles 1 and 2 are VERIFIED-P and absent or wrong in the popular versions; angle 3 is attributed to its single source).

## Reveal Loop material
1. **The belief.** "A bridge is something you build: stone, steel, concrete. Right?" Commonness: this is a universal assumption, not a taught fact; we did NOT find a textbook or quiz that states it, so it cannot be cited. Say so to AK: the belief is plausible but uncited.
2. **The turn.** "Not quite. In Meghalaya's Khasi hills, some bridges are grown, from the living roots of rubber trees, and they get stronger every year." (C001, C002, C003)
3. **The camera move.** One continuous move: start on the Shillong Plateau edge in shaded relief, glide south and down into the steep valleys toward the Bangladesh floodplain edge (no border drawn), and settle on a pin at the Nongriat double-decker bridge, 25.25135 N, 91.67159 E, 394 m (S01 Table S1, #6). Then pull back to show all 71 geolocated bridges as pins (S01 Table S1 coordinates, WGS84). Optional measured line: Nongriat (#6) to Rangthylliang 12 (#37, the 52.7 m bridge, 25.30359 N, 91.87199 E) = 21.0 km, our measurement. Note: the bridges are under forest and only metres wide; Sentinel-2 (10 m pixels) cannot show them, so the pin carries the reveal and the photo (below) shows the bridge.
4. **One felt comparison (our measurement).** "Started around 1951, still not fully usable 66 years later" (S01 #50 age 66, ages as of 2017/2018 per Table S1 footnote; method/rootbridge_numbers.py). Second option: "the longest, 52.7 m, is seven and a half times the 7 m bridge the scientists call typical" (52.7/7 = 7.5; S01 Abstract and Fig. 1 caption).
5. **One human detail.** "As per indigenous belief, only an elder, who has no children, can plant the Ficus sapling" (S02, Criterion vi; C008). Alternative from S01: residents put the Nongriat bridge at about 200 years (C005).
6. **Three loop-line candidates** (each runs into the opening "A bridge is something you build...").
   - "Seven decades, one tree, one river crossing. So remember: not every / bridge is something you build. Right?" (adds "not every"; the opening line can carry it)
   - "In Meghalaya, they'll tell you a bridge is planted, waited for, handed down. Everywhere else, / a bridge is something you build. Right?"
   - "So the next time someone tells you / a bridge is something you build... right?"
7. **The send line:** People forward this because it is a real Indian place where a bridge is a tree you inherit from your grandparents, and the "unfinished after 66 years" fact surprises even people who have seen the photos.
8. **The topic test.**
   - Familiar: PASS. Everyone has crossed a bridge; the belief needs no setup.
   - Hidden: FAIL as pitched, PASS with the twist. "Meghalaya's root bridges" are already widely known in India (much news and tourism coverage), so "they grow bridges" alone is not hidden. The hidden part is C006 (no one knows how long; 66 years and unfinished) and C007 (not World Heritage yet). AK decides.
   - Send: PASS. Strong visual, Indian pride, a fact (66 years) people repeat.

Source lines for screen: "Ludwig et al., Scientific Reports 2019" (C003-C006, C009); "India's UNESCO Tentative List file, 2022" (C007, C008); "our measurement, from Ludwig et al. 2019 data" (1951, 7.5x, 21.0 km).

## Hook and twist candidates (for the script writer; AK decides)
- Hook: "A bridge is something you build. Right?" Twist: grown, and nobody knows how long it takes (C006).
- Hook: "This bridge was planted around 1951. It still wasn't finished." (C006, our measurement)
- Twist: "And UNESCO hasn't listed it yet" (C007).

## Map and visual notes
- Map: shaded relief + Sentinel-2, no borders (house rule). Pins from S01 Table S1 (71 geolocated bridges, WGS84). India locator outline only from `ne_10m_admin_0_countries_ind` in `public/geo/_shared/`, as an outline, no borders inside.
- Extent (our measurement): surveyed bridges span about 41.2 km west-east and 17.3 km south-north; UNESCO village entries span about 68.7 km west-east (method output).
- Bridges cannot be seen from orbit. Photos with a reuse licence (CC BY 4.0, article licence; no third-party credit line in the captions):
  - S01 Figure 1 (Ummonoi bridge #57, 7 m span, two views): https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41598-019-48652-w/MediaObjects/41598_2019_48652_Fig1_HTML.jpg
  - S01 Figure 6 (Siej #50; Nongriat #6 ca. 200 years; Nongbareh #62): https://media.springernature.com/lw1200/springer-static/image/art%3A10.1038%2Fs41598-019-48652-w/MediaObjects/41598_2019_48652_Fig6_HTML.jpg
  - Credit on screen: "Photo: Ludwig et al. 2019, Scientific Reports, CC BY 4.0 (cropped)". Not downloaded in this run. Never use CC BY-SA (most Wikimedia root-bridge photos are BY-SA; none used).

## Artistic-licence notes
- "Grown, not built": tendable wording "grown and tended" is more exact.
- Do not show a "wettest place on Earth" label: not verified here.

## What an 8-beat 65-100 word Short could safely say (strongest verified one-sentence facts)
1. In Meghalaya, some bridges are grown from the living roots of the India rubber tree, Ficus elastica. (C001)
2. Khasi villages guide the roots across streams. (C002)
3. The roots thicken and fuse, so the bridge gets stronger as it grows. (C003)
4. Scientists measured them from 2 m to 52.7 m long. (C004)
5. Some are several hundred years old; locals put the Nongriat double-decker at about 200. (C005, hedged)
6. One bridge at Siej had grown for 66 years and still wasn't fully usable; started around 1951 (our measurement). (C006)
7. Scientists say no one can yet say how long a bridge takes to grow. (C006)
8. India put them on UNESCO's Tentative List in February 2022; they are not yet World Heritage. (C007)
9. India's UNESCO file records a belief that only a childless elder may plant the sapling. (C008, attributed)
10. 68 of the 71 bridges the scientists mapped are in rainforest valleys. (C009, non-spine)

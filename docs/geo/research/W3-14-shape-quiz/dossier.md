# W3-14-shape-quiz "Guess the Indian state from its shape": research dossier (lite, 8 Nov 2026)

Week 3, day 7 PM, category Quiz (engine G3), audience India. Research only: no script, voice or render. Rules: `docs/geo/RESEARCH_RULES.md`, brief `docs/geo/week3/RESEARCH_BRIEF.md` (SHORTS LITE MODE). Two original sources: Census 2011 Table A-01 (S01, areas from Survey of India) and the States Reorganisation Act 1956 (S02); house Natural Earth outlines measured by us (S03). Started 1 Nov, finished 8 Nov.

**Status: ready for G6 (independent check).**

## Verdict on the premise
**Workable as worded; it is a format, not a claim.** Three states chosen: **Madhya Pradesh, Tamil Nadu, Goa**. All three exist in `public/geo/_shared/geo.json` "states" under those exact keys, and none touches a foreign country, so no disputed boundary can appear [C008]. Uttar Pradesh, Rajasthan and Kerala avoided. Clues verified: area rank (Census 2011) and one surprising fact per state. The capital clue is **dropped**: no capital is stated in the two sources and the portals tried failed (open_questions 1). No "only 1 in 10 get this" figure exists; none is used.

## The three states (clue, then reveal)
- **Madhya Pradesh.** 308,252 sq km, 2nd largest of 28 states in 2011 [C001]. Reveal: it beats Maharashtra for second place by just 539 sq km, 0.18% [C002]. Back-up: the 1956 Act built it from five pieces (old MP, Madhya Bharat, Bhopal, Vindhya Pradesh, Sironj) [C003].
- **Tamil Nadu.** 130,060 sq km [C004]. Reveal: its southern district was not in it before 1956; the Act moved four Travancore-Cochin taluks to the State of Madras as a new Kanya Kumari district [C005], which in Census 2011 is still exactly those four sub-districts, 1,684 sq km [C006]. Back-up: almost as many people as MP (99.3%) on 42% of the land [C004].
- **Goa.** 3,702 sq km, smallest of 28 states [C007]. Reveal: MP is about 83 times Goa [C007]; smallest by area, not by people (Sikkim has fewer) [C007].

## Fresh angles (G7)
G7: PASS. Verified facts the usual quiz versions leave out or get wrong (myths.md):
1. **The 539 sq km race.** Quiz sheets say MP is "the largest"; it is second, and only 0.18% ahead of Maharashtra [C001, C002]. Usable as the "why" of the MP reveal.
2. **The 1956 tail.** Tamil Nadu's southern district came from Travancore-Cochin by an Act of 1 November 1956; the 2011 census still shows the same four taluks [C005, C006]. Usable as the hook ("this state's tip was added by law").
3. **Same people, half the land.** Tamil Nadu had 99.3% of MP's population in 2011 on 42% of the area [C004]: ties two answers together.

## Hook and twist candidates
- Hook: "Three outlines. No names. Only one is the size of 83 Goas." [C007]
- Twist (MP): "Second, by 539 square kilometres." [C002]
- Twist (TN): "Its southern district joined in 1956, from another state." [C005, C006]
- Loop: end on Goa's outline, small enough to fit 83 times in the first shape [C007].

## Map and visual notes
- Outlines: `geo.json` "states" keys `Madhya Pradesh`, `Tamil Nadu`, `Goa` (one ring each) [C008]; India context = house `ne_10m_admin_0_countries_ind` outline. No foreign border touches any of them (nearest: Sri Lanka 29 km across the sea from TN).
- Scale: draw each alone and fitted; Goa needs its own zoom. For a size comparison, draw all three at one scale (equal-area idea) only with Census areas on screen, not our geometry.
- Do NOT highlight the Kanyakumari piece on the TN outline: no official district boundary in the house data (open_questions 2). Use a label or text card instead.
- On-screen credit: "Area: Survey of India via Census 2011" [C010]; "States Reorganisation Act 1956".

## What a 9-beat 85-100 word Short could safely say (ten strongest verified one-sentence facts)
1. Madhya Pradesh covers 308,252 square kilometres. [C001]
2. In the last census it was India's second-largest state, after Rajasthan. [C001]
3. It beats Maharashtra for second place by only 539 square kilometres. [C002]
4. A 1956 law built it from five pieces, including Bhopal and Vindhya Pradesh. [C003]
5. Tamil Nadu covers 130,060 square kilometres. [C004]
6. In 2011 it had almost as many people as Madhya Pradesh, on 42% of the land. [C004]
7. On 1 November 1956 four taluks of Travancore-Cochin were moved to the State of Madras. [C005]
8. They became Kanyakumari district, which the 2011 census still shows as those same four taluks. [C005, C006]
9. Goa, at 3,702 square kilometres, was the smallest of the 28 states. [C007]
10. Madhya Pradesh is about 83 times the size of Goa. [C007]

## Hedges to keep in any script
- "In the last census" / "2011" for every rank and population [C001, C004, C007].
- "Then called Madras" for 1956; no rename year [C009].
- "Smallest by area" for Goa [C007].
- The house outline is today's MP, not the 1956 one [C003].

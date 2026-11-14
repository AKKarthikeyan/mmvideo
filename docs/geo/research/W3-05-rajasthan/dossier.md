# W3-05 "Rajasthan is bigger than most countries in Europe": research dossier (1 Nov 2026)

Week 3, Day 3 AM, category "Map is lying", audience India. Research only: no script, voice or render. Indica Atlas rules: `docs/geo/RESEARCH_RULES.md`. Brief: `docs/geo/week3/RESEARCH_BRIEF.md`.

**Status: research complete, awaiting G6 (independent check).** research_check.py run 1 Nov 2026: see the end of this file.

## Verdict on the premise
**The pitch is true, and it understates the facts.** Rajasthan (342,239 sq km, Census of India 2011, area supplied by Survey of India) [C001] is larger than 38 of the 44 European states (86%), by the UN Statistics Division's total areas [C005]. Only six are larger: Russia, Ukraine, France, Spain, Sweden and Germany [C004]. If "Norway" is taken as the whole Kingdom including Svalbard and Jan Mayen, it is seven [C007].
- **Definition of Europe (must be stated):** the UN geoscheme (M49), 51 countries and areas, 44 of them states including the Holy See; all of Russia counts as Europe [C003].
- **Basis (must be stated):** total area including inland water for everyone [C011]. Land-only would widen Rajasthan's lead over Finland and Norway (both have many lakes).
- **Honest wording:** "Rajasthan is bigger than all but six of Europe's 44 countries" or, safer, "bigger than most of Europe's countries: only Russia, Ukraine, France, Spain, Sweden and Germany are larger" [C004, C005].

## The numbers (one basis: total area, km2)
| Country | UNSD DYB 2022 | National office / Eurostat | Rajasthan vs it | Claim |
|---|---|---|---|---|
| Rajasthan | - | 342,239 (Census 2011) | - | C001 |
| Russia | 17,098,246 | - | much smaller | C004 |
| Ukraine | 603,500 | - | smaller | C004 |
| France | 551,500 (metropolitan) | 638,475 (Eurostat, with overseas) | smaller | C004 |
| Spain | 506,009 | 505,983 (Eurostat) | smaller | C004 |
| Sweden | 438,574 | 447,424 (Eurostat 2023) | smaller | C004 |
| Germany | 357,581 | 357,683 (Destatis 31.12.2024) | Rajasthan 4.3% smaller (Germany 4.5% bigger) | C008 |
| **Rajasthan sits here** | | | | C009 |
| Finland | 336,884 (excl. Åland 1,583) | 338,493 (Statistics Finland 2026) | 1.1% bigger | C006 |
| Norway | 323,772 mainland | 323,805 mainland (SSB 2026); 384,486 Kingdom (Eurostat) | 5.7% bigger than mainland; smaller than Kingdom | C007 |
| Poland | 312,679 | 311,928 (Eurostat 2023) | 9.5% bigger | C010 |
| Italy | 302,068 | 302,079 (Eurostat 2023) | 13% bigger | C010 |
| United Kingdom | 244,376 | 244,423 (Eurostat 2023) | 40% bigger | C010 |
| Romania | 238,398 | 238,398 | 44% bigger | C010 |

## Fresh angles (gate G7)
G7: PASS. Verified facts that the pitch and the usual "bigger than X countries" posts leave out or get wrong (myths.md):
1. **"Most" is too modest, and there is an exact gap** [C004, C005, C009]. All but six, and no European state falls between Finland (338,493) and Germany (357,683): Rajasthan sits exactly in that gap. Usable as the hook or the payoff.
2. **Norway depends on a definition** [C007, K1 in conflicts.md]. Smaller than Rajasthan as mainland (323,805); larger as the Kingdom with Svalbard and Jan Mayen (384,486). The UN table lists them separately. A fact most "size comparison" posts get wrong by picking one silently.
3. **Finland is the close call** [C006]: Rajasthan is bigger by only 3,746 sq km (1.1%), and Finland's land area is 304,068 with another 34,424 sq km of lakes.
4. **The "map is lying" angle is computable** [C014, C015]. On a Mercator map, Finland is drawn about four times the area of Rajasthan although it is 1% smaller, because Mercator inflates area by sec squared of latitude (Rajasthan at 23-30 N, Finland at 60-70 N) [C013]. Usable as the "why".
5. **People as well as land** [C016]: in the same census year (2011) Rajasthan counted 68.5 million, more than the United Kingdom's 63.4 million.

## Hook and twist candidates (for the script writer; AK decides)
- Hook A (number first): "One Indian state is bigger than all but six of Europe's countries." [C004, C005]
- Hook B (map lie): "On a Mercator map, Finland looks four times the size of Rajasthan. It is actually smaller." [C015, C006]
- Twist: Rajasthan fits exactly between Finland and Germany [C009]; or Norway's answer changes if you count Svalbard [C007].
- Close with a question (house style): which of the six is the smallest of them? (Germany, about 4.5% bigger) [C008].

## Map and visual notes
- Outline of Rajasthan: Natural Earth admin-1 polygon (S11); outer edge is the India-Pakistan international boundary [C017]. India outline for context: `ne_10m_admin_0_countries_ind` (house rule). No disputed boundary is on the Rajasthan outline; if the full India outline is shown, use the IND file. Do not add Kashmir-region lines by hand.
- To compare sizes fairly, show Rajasthan next to each country in an equal-area projection (the method in `method/ne_areas_mercator.py` uses cylindrical equal-area); label with the statistical-office figures, not the polygon areas (polygons are 0.3-1.6% off) [C017].
- For the Mercator picture, draw the same outlines on a Mercator map and show a ruler-free overlay; "Mercator" is a map-maker's choice [C014]. Latitude ranges for the labels [C013].
- State the definitions on screen in small print: "Europe = UN geoscheme (Russia counted whole)", "total area, incl. inland water", "Norway = mainland".

## What a 9-beat 85-100 word Short could safely say (ten strongest verified one-sentence facts)
1. Rajasthan covers 342,239 square kilometres, India's largest state. [C001, C002]
2. Europe, in the United Nations' own list, has 44 states. [C003]
3. Rajasthan is bigger than 38 of them. [C005]
4. Only six are bigger: Russia, Ukraine, France, Spain, Sweden and Germany. [C004]
5. Germany is only about 4.5% bigger. [C008]
6. Finland is 1% smaller than Rajasthan. [C006]
7. No European country falls between Finland and Germany in size; Rajasthan fits in that gap. [C009]
8. Norway's mainland is smaller than Rajasthan, but with Svalbard and Jan Mayen the Kingdom is bigger. [C007]
9. On a Mercator map, Finland is drawn about four times the size of Rajasthan. [C015]
10. In the 2011 census Rajasthan had more people than the United Kingdom. [C016]

## Timeline
No time dimension: all figures are the latest of each office (Census 2011 for Rajasthan; 2022 UN table; 2024-2026 offices). Rajasthan's area is from the 2011 census table; whether its boundary changed since is not traced to a gazette (open_questions.md Q2).

## Sensitivity
Not flagged. The only boundary involved is the India-Pakistan international boundary along Rajasthan's west, which is not a disputed boundary; the Natural Earth outline is used. The "Europe" definition (Russia counted whole, Kosovo absent) is the UN's and is stated as such.

## Gate result (research_check.py, 1 Nov 2026)
PASS G1 sourced, G2 spine, G3 coverage, G4 floor + saturation (examined 16, tier-P 16), G5 no banned evidence, G7 fresh angle, G8 myths audited (11). G6 independent verification: pending (verify.md is a stub, as the brief requires). No quote warnings.

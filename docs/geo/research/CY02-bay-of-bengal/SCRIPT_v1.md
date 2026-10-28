# CY02 · Bay of Bengal "stronger" cyclones · script v1 (27 Oct 2026)

**Status: DRAFT for AK's review. Visual B kept (28 Oct 2026). Not voiced, not rendered, not posted.** Machine-readable copy: `script_v1.json`
(`python3 docs/inventors_desk/scripts/research_check.py docs/geo/research/CY02-bay-of-bengal --script docs/geo/research/CY02-bay-of-bengal/script_v1.json` passes).
Research: `dossier.md`, cleared by G6 round 2 (`verify.md`).

**Title (AK's pick, 27 Oct 2026): "Why the Bay of Bengal makes the deadliest cyclones"** (50 characters). Script unchanged.
Two things to know about it (not changed, since AK said to keep the script):
- *Promise vs hook.* The title promises "deadliest"; the first line says "stronger". The "deadliest" claim arrives in b3 (about 9 s in), so the title's promise is opened later than the Shorts Engine's rule C9 prefers (opened in M1). If AK wants it tighter, swap b1 and b3's idea: open with "The deadliest cyclone on record came from the Bay of Bengal. But not because it was stronger." That is a one-line change to b1.
- *Plural.* "Deadliest cyclones" is firmly supported for one storm only (1970, WMO; C010). The wider ranking is disputed (C015). The script says "the deadliest on record" and never claims more, so the title is slightly broader than the voice. If AK wants the title to match the voice exactly, "Why the Bay of Bengal makes such deadly cyclones" avoids the plural claim.

**Format:** F1 Myth Flip (research signal: a belief that the record contradicts, with primary evidence). The previous Short in this set (Odisha) is F10, so formats rotate.
**Length:** 96 spoken words, about 31 s at Week 1's pace (2.9–3.4 words a second on whole videos). Check the rendered length; trim if over 35 s.

## Script

| # | Move | Spoken line (numbers in words) | On-screen keywords | Claims |
|---|---|---|---|---|
| b1 | M1 Hook | Storm for storm, there's no sign Bay of Bengal cyclones are stronger. | Stronger? No sign, storm for storm | C003 |
| b2 | M2 Ground | India's weather service counts six in ten storms turning severe, in the Bay and the Arabian Sea. | IMD 1982–2024: 62% vs 62% turn severe | C003 |
| b3 | M3 Push (the "but") | But the Bay makes about twice as many cyclones, and the deadliest on record. | About 2× as many · deadliest on record | C001, C010 |
| b4 | M3 Push | In nineteen seventy, in what is now Bangladesh, at least three hundred thousand died, mostly from the storm surge. | 1970: 300,000+ died (WMO estimate) | C010, C011, C012 |
| b5 | M4 Turn (peak, about 20 s) | Why? At its head the Bay narrows like a funnel, with shallow water and crowded low islands. | The Bay narrows: 1,400 km → under 500 km · FUNNEL, an analogy | C033, C034 |
| b6 | M5 Echo | So it's less about stronger storms, more about where they land. | Not stronger storms: where they land | C003, C033 |
| b7 | M5 Echo | Stronger? No. Deadliest on record? Yes. | Stronger? No. Deadliest on record? Yes. | C003, C010 |

Pauses: 0.5 s after each fact, 0.7 s before the funnel line, a 1 s hold on b7 (the loop).

**Retell in three sentences (S11):** People think the Bay of Bengal makes stronger cyclones, but by India's weather service count no more of its storms turn severe than the Arabian Sea's. It does make about twice as many, and it holds the deadliest on record, at least 300,000 dead in 1970. The reason is the Bay's funnel shape at its head, not stronger storms.

## What the script leaves out, on purpose
- **"Far deadlier ones."** The title and dossier use it, but only one storm (1970) is firmly sourced as the deadliest. The wider ranking (C015, India's list of the deadliest cyclone disasters) is DISPUTED, so the script says "the deadliest on record" and nothing broader.
- **The river lid** (C026, C027, C045, the best "why more intense" fact) and the **monsoon paradox** (C037, C038). Each is a complete Short of its own. This Short answers one question, "if not stronger, why deadlier?". Split-off ideas, not wasted.
- **The 1737 "300,000" doubt** (C019): a separate myth Short. Three hundred thousand appears here only for 1970, from WMO.
- **Amphan 2020 (98 deaths after 3 million evacuated, C022):** it is the "what changed" story and fits the Odisha Short's theme. Leaving it out means this Short ends on the shape of the Bay, not on hope. AK may want a hope line added (it would cost about 12 words, so another line would need to go).

## Story gates (S1–S13) and Shorts gates (SH1–SH11)

| Gate | Result | Note |
|---|---|---|
| S1 Facts | PASS | `research_check.py --script`: every line carries claim IDs; none is hedged or unverified |
| S2 Format | PASS | F1 Myth Flip; signal above |
| S3 Question / SH1 | PASS | The belief and its contradiction are in line one (at about 3.9 s the hook has landed) |
| S4 Prime | PASS | The Bay and the Arabian Sea are named and shown before the comparison |
| S5 Resolve / SH9 | PASS | b7 rhymes with b1 ("stronger") and closes the loop; the question "why deadlier?" is answered by b5 |
| S6 Peak | PASS | b5 at about 20 s of 31 (64%) |
| S7 End | PASS | A callback to M1 |
| S8 Screen text | PASS | Keywords and numbers only |
| S9 Numbers / SH7 | WATCH | Voiced: six in ten, about twice, 1970, 300,000 (the year is a signpost). On screen: 62%, 2×, 300,000+, 1,400 km → under 500 km. Over the 30 s Engine ceiling of 2, same trade-off as Odisha (93–96 words is between the 30 s and 45 s tiers). To tighten, drop "six in ten" from the voice and keep "62% vs 62%" on screen |
| S10 Hedges | PASS | No hedged claim is used. "Funnel" is labelled an analogy on screen (dossier rule). "At least" covers WMO's 300,000–500,000 (C010, C011) |
| S11 Retell | PASS | Above |
| S12 Audience | PASS | Neighbours' disaster: WMO's estimate attributed on screen; no ranking of countries and no coping comparison (rule 4.4); "what is now Bangladesh" instead of the 1970 political name; no side-taking |
| S13 Review | DONE | Notes below |
| SH2 Words | PASS | 96 (AK 85–100) |
| SH3 One "but" | PASS | One "But" (b3) |
| SH4 But/so | PASS | b1 claim; b2 evidence; b3 but; b4 for example; b5 why; b6 so; b7 echo |
| SH5 / SH6 | PASS | Setting by the map; "In nineteen seventy" is the only jump |
| SH8 Plant/payoff | PASS | "the storm surge" (b4) is explained by the funnel (b5); "stronger" (b1) is answered in b6–b7; "deadliest on record" (b3) is paid in b4 and b7 |
| SH10 Stands alone | PASS | |
| SH11 Audio | n/a | Under 60 s |

### S13 notes
**Bhagyaraj pass (heart, plants and payoffs).**
- *The "lie" is the popular belief,* and the audience is in on it from line one. That is the nonfiction version of tool 9: nothing invented.
- *Heart:* 300,000 is the only human moment. It is kept plain, with no named person and no imagery of bodies. The Short is more head than heart than the Odisha one; that is the cost of a Myth Flip, and its warmth would come from the follow-up (what changed).
- *Plants:* "stronger" (b1) → "Stronger? No" (b7); "storm surge" (b4) → the funnel (b5); "deadliest on record" (b3) → b7.

**Nolan pass (structure and the turn).**
- *Pledge → turn → prestige:* pledge = no sign they're stronger; turn = twice as many, and the deadliest; prestige = the funnel, shown by two measured lines whose walls close in on screen.
- *Hairpin:* b7 folds back onto b1.
- *Fair play:* the funnel (b5) is only a fair surprise if "storm surge" and "low islands" are planted earlier (b4) and the map shows the head of the Bay from b4. The b4 camera is already framed on it.
- *Risk:* b5 is the longest "why" line (17 words). Hold the funnel animation through the whole line. The two width lines are measured from Natural Earth (C034); the walls joining them are artistic.

## Visual brief (scene `src/geo/cyclone/bay_b.ts`, composition `GEO-cy02bay`; AK kept this version, 28 Oct 2026)
Drawn-in-code story cards over the map; the map returns for the hook and the close. The first version (satellite-map overlays, `bay.ts`, `GEO-cy02bay-a`) is kept for reference.
- **b1:** map, "STRONGER?" on screen from frame 0.
- **b2:** two grids of 100 dots, 62 lit in each, Arabian Sea on the left to match the map. "Of every 100 cyclonic storms… turn severe · IMD, 1982–2024" (62% each, C003, normalised to 100).
- **b3:** dot picture, 10 dots (Bay, 122 storms) against 4 (Arabian Sea, 50 storms), one dot ≈ 12 storms. Title says "about 2 to 1"; the dots show 2.5 to 1 and the true count is 122 vs 50 (2.44, C001). The count is stated on screen, so the picture is not the only evidence.
- **b4:** 100 red dots, one dot ≈ 3,000 people, "300,000+ died · WMO estimate" (C010, "at least"; illustrative scale). "What is now Bangladesh."
- **b5:** funnel diagram drawn to the measured width ratio 492/1397 (C034): a cyclone glyph enters the 1,400 km mouth, amber surge builds at the under-500 km head, "shallow water" and "crowded low islands" (C033) appear. Labelled "FUNNEL · an analogy".
- **b6:** map, head of the Bay outlined (artistic, labelled approximate), "WHERE THEY LAND". **b7:** "STRONGER? NO / deadliest on record? yes".
- **Artist tags:** dots, the glyph, the surge band and the outline are `artistic`. Not shown on purpose: storm tracks, wave walls, any death-toll comparison between countries.
- **Engine:** two new panel types (`dotgrid`, `funnel`) in `src/geo/engine/GeoShort.tsx`, additive; other Shorts are unaffected.

## Open items for AK
1. **Taste:** the title (above), "deadliest on record" as the closing claim, and the S9 number count.
2. **The JTWC caveat belongs in the pinned comment, not the voice.** By the US Navy's Joint Typhoon Warning Center winds, 8 of the 9 strongest (Category 5) north Indian Ocean storms since 1982 were Bay storms (C007, a small count that IMD rates lower, conflict K2). The Short says "no sign… storm for storm", attributed to IMD. A viewer who knows the JTWC number could push back, so the comment should say so honestly.
3. **Live storm:** the Odisha research (C052) records IMD's 27 Oct 2026 warning for VSCS "Arnab" crossing near Yanam on 28 Oct. This is a Bay of Bengal cyclone explainer, so don't post it while that storm is live.
4. **Unfound sources:** Bangladesh's own official death tolls for 1970 (open_questions.md #1). The script uses WMO's estimate and says so on screen. If AK wants Bangladesh's own figure, it needs the Bangladesh Disaster Management Bureau or the Bureau of Statistics. A poor-quality source claims the official figure is one million; it is not used.
5. **Voice:** MiniMax `English_Diligent_Man`, daytime window. One command does voice, trim, render and frame sheet: `cd /Volumes/DarwinSSD/MMVideo && scripts/geo/run_cy02.sh` (it refuses outside 06:45–22:10 IST). **Not run:** AK said not to voice yet. `public/geo/cy02bay/data.json` is a marked placeholder with estimated timings. Pronunciation of "Bangladesh" and "Arabian" needs no check; none of the proper nouns here is unusual.
6. **YouTube:** narration is an AI voice. Set "Altered or synthetic content: Yes".

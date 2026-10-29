# Storyboard: "India Is Running Out of Babies. Here's the Map." (cartoon long-form, revision 2, 29 Oct 2026)

Draft storyboard for the Data Kadai Infographics Show-style cartoon explainer. Machine-readable twin: `public/datayt/long/babies/storyboard.json` (98 scenes, ids s001 to s098; the ids changed from revision 1 because scenes were merged and split, section 0 maps them). Written to `src/looks/cartoon/long/CONTRACT.md` (binding) and to the verified narration in `SCRIPT_VERIFIED.md` and `CLAIMS.md`. Nothing here is published, voiced or rendered for the final: timings are estimates (2.6 words a second plus 0.5 s lead-out per scene, the house estimator in `long_timeline.py`) until the voice step measures them.

| | |
|---|---|
| Scenes | **98** (stage 52, map 19, statement 8, tfr-line 6, multiples 4, title 3, slope 2, scatter 2, replacement 1, end 1); longest run of one kind: **3** |
| Narration | **1,432 words**, token for token the verified script with numbers spelled out (checked by script against `SCRIPT_VERIFIED.md`: 1,503 tokens equal 1,503 tokens, nothing added, nothing dropped, same order) |
| Estimated length | **10:01** (18,035 frames at 30 fps); scenes run 3.2 to 9.0 s, mean 6.1 s |
| Frame | 1920x1080, 30 fps, flat 2D cartoon in the pilot's look: the uncle host, a recurring cast, white number badges with a hard shadow, blue statement cards, a liquid wipe at each act start |
| Statement cards | **8** (34 s, 5.7% of the runtime; revision 1 had 15 cards, 81 s, 13%) |
| Host on screen | in **40 of 52** stage scenes (42% of the runtime; revision 1: 50 of 50, 52%) |
| Validator | `long_validate.py`: **0 errors, 29 warnings**, every one explained in section 8 |
| Stills | all 98 scenes were rendered as stills with the per-kind dev bundles (`replacement_a` and `tfrLine_a` for those two kinds): none throws, so every FigRef and reveal key resolves; the new or changed stage, title, statement, end, replacement and map designs were looked at and their overlaps fixed. The chart scenes (`tfr-line`, `slope`, `multiples`, `scatter`) have the specs of revision 1 and were checked for no throw and a sensible mid-animation frame |

## 0. The critic's report: what was done with each defect

Scene ids below are the NEW ids; the critic's ids (revision 1) are written `v1 sNNN`. Status: **applied**, **partly** (the part inside this task's two files, with what remains) or **rejected** (with the reason).

| # | Defect | Status | What was done, or why not |
|---|---|---|---|
| 1 | BLOCKER: the registry imports the old `replacement` and `tfrLine` (v1 s013, s023, s024, s049, s050, s083, s084; now s012, s022, s023, s047, s048, s080, s081) | real, not mine to change | Already reported as N1 in revision 1. The specs follow CONTRACT.md exactly (points `{survey, state, key}`, line `{const, key}`, `extra {const, key}`), which is what `replacement_a` and `tfrLine_a` read; `scenes/index.ts` and `CONTRACT.md` belong to the lead and I may not edit them. **Lead action 1 (section 7): point the two imports at `./replacement_a` and `./tfrLine_a`, and add the seven nested names to the contract.** This pass re-rendered s012 with the `replacement_a` bundle (the sliver caption, defect 8); the six `tfr-line` specs are unchanged from revision 1, where they were rendered with `tfrLine_a`. |
| 2 | The hook does not pay the title; the first number is late (v1 s001 to s007) | partly | **Fix B applied.** The question is on screen from frame 0 as a pill, IS INDIA RUNNING OUT OF BABIES?, and a second pill spells out NFHS = NATIONAL FAMILY HEALTH SURVEY (s001); AVERAGE PER WOMAN, NOT A FAMILY and PROVISIONAL sit on s002; the 35 is drawn as the denominator of one fraction (30 OF 35, s004) instead of a second stand-alone number. **Fix A rejected for the JSON:** opening with Opening B adds 31 spoken words and moves the verified sentences, which this task forbids ("nothing added"); it is a script decision, so it is Decision D2 with the exact text and the storyboard change. The first number still lands at 4.4 s, because the verified opening speaks the survey name and year first; "N F H S four" for the voice is note N7. |
| 3 | The family-count pictogram contradicts the film's own definition (v1 s001, s002, s095, s096, s099; now s001, s002, s093, s094, s097) | applied (differently) | The stage builder cannot clip a figure, so the partial child is not drawable. Instead no scene draws a whole-number count of children for a rate: the Bihar scenes show one mother and a pram, the age scenes one or two figures, and the only family groups left are the one that says what TFR is NOT (s011, pill NOT A HEADCOUNT) and the closing call to the viewer (s097); the three-person street scenes s090 and s091 stand for working-age and older people, not for a rate. The two-to-one pictogram of 35.6% against 20.3% is gone. |
| 4 | The closing act prints no data; s094 is a title card; add `age60plus` and `under15` tables and a `bars` kind (v1 s094 to s096; now s092 to s094) | partly: blocked outside my files | **`bars` rejected:** it is not in CONTRACT.md (binding) and has no builder, and I may not edit the contract or the registry. **Tables:** the critic is right that `figures.json` holds the age figures only three levels deep (`age_structure.Kerala.age60plus.nfhs6`), so no `{t, state, s}` FigRef can print them, and this task allows only FigRefs that exist. `figures.json` is not mine. Delivered instead: the three scenes use no digits, name the places on pills as the narrator says them, and carry a `notes` field; section 7 gives the exact badge specs to paste in the moment the two flat tables exist (a five-minute change, no new scene kind: s092 becomes a stage scene with a badge). **Lead action 4.** |
| 5 | Statement cards: 15 scenes, 81 s, echoing the narration, no `show` keys, two back to back | partly | Cards are down from 15 to 8 (34 s). Kept: the section header s008, the turns s026 (not one number), s067 (pattern, not proof), s076 (look closer), s088 (a turn or noise), the Act 5 question s050, and the answer card s095; the key-words card moved to the start of its sentence (s014, "Stay below that line for long enough"), so it lands with its words, and s016 repeats LONG ENOUGH as a pill keyed to the word. Recast as illustrated scenes: v1 s011 (s011), s021 (s020), s030 (s028), s038 (s036, five houses popping in one by one), s042 (s040), s065 (s062), s091 (s089), so no two cards touch. **`show` keys rejected:** the builder supports `lines: [{text, show}]`, but CONTRACT.md types `lines` as `string[]` and the validator errors on objects; the contract must allow it first (lead action 2). Until then every card scene's narration is cut so the card's words are spoken in its first second or two (s014, s076, s088); the section headers and turns s008, s026, s050, s067 run at most about 2 s ahead of their words, and s095 is a recap card that is not tied to its sentence. |
| 6 | The peak is not pictured; counts have no literal metaphor; add a `tally` kind | partly | **`tally` rejected** (not in the contract). Counts are pictured with what exists: the threshold map is the 30-against-5 tally (s029), five houses pop in one by one for "only five places" (s036), four houses sit under "four places" (s034), the six risers and six fallers lift off the map (s078, s079), the small-sample places lift off (s083). The peak (s074) now has a speech bubble WAIT. UP?, a GUESS FIRST: UP OR DOWN? pill, the caption "higher, by any amount" and a camera push-in on the circled 16; s075 puts 12 and 7 beside it. The 16 cannot be lifted on the map: there is no spare sentence to carry it without changing the narration. |
| 7 | The ending leaves loops open and closes on admin (v1 s097 to s100; now s095 to s098) | partly | **D3 (moving the two admin lines before "So where does your state sit") rejected for the JSON:** it reorders the verified script, which is the script owner's call (Decision D3 has the exact change and its storyboard effect). **Applied (visual only):** s095 is an answer card, BELOW THE LINE? YES. SHRINKING? ONE SURVEY CAN'T SAY. (C14, C10, C47); the end scene's bubble calls back to the cold open: "Is India running out of babies? It depends on where you live." (C04); the invented "next video" line is removed (`next` is optional; Decision D7); PIB release 2266600 (the 29 May 2026 release, S4) is added to the source board. C53 (the Data Receipt) is still UNVERIFIED: Decision D4. |
| 8 | The s013 sliver is a dangling loop (now s012) | applied | The sliver now carries the caption "a little over two" (`extra.caption`, a builder-only nested field, N2): it says what the 0.1 is without giving the reason the checker cut (C09). Rendered and checked. |
| 9 | Tone: value-coded colours, Kerala in a school and Bihar at home (v1 s044, s051, s075, s076, s085, s089, s058 to s060) | partly | **Applied:** Kerala and Bihar now stand in the same frame with the same cast, the same set and neutral labels for all three scenes (s056 to s058), and the pill PATTERN, NOT PROOF is on every Act 5 comparison scene from the first scatter on (s055, s059 carry the chart's own sticker; s056, s057, s058, s061 carry the pill; s060 says COULD PARTLY BE CHANCE). **Rejected:** `label: ["Kerala","Bihar"]` on the first scatter: the builder prints a labelled dot's own fertility rate in its tag, a number the narrator does not say in that scene (the number rule), and its reveal key is the state name, which is not in that scene's narration. **Not mine:** the red-for-falls colour in `multiples.tsx` and `slope.tsx` and the red circle on s042 (v1 s044) are builder decisions and `slope.hero` is not a contract field: lead action 5 asks for one neutral colour for both directions. |
| 10 | "Rise" wording and small-sample symmetry (v1 s075, s077, s081 to s087; now s072, s074, s078 to s084) | partly | **Applied:** the circled 16 says "higher, by any amount" and the pill ANY DIFFERENCE COUNTED (s074); no 0.1 is typed. The risers and fallers maps are headed "Printed figures, all sample sizes" and "Lifted: the biggest falls" (s078, s079), and the five small-sample places, Andaman and Nicobar Islands included, lift off together in s083. s072 keeps the narration ("slightly higher" is the verified wording; its tags say about the same). **Rejected:** a "about the same" tag on Meghalaya's first step (3.0 to 2.9): `multiples` has no `sub` field in the contract, and "lower in every round" is the verified C29. **Not possible in the contract:** dashed grey rings on small-sample places (lead action 6). The Manipur and Ladakh/Jammu and Kashmir geometry is the existing builder's; AK should still eyeball it. |
| 11 | Talking-uncle density (24 stage scenes with no number); missing literal visuals | partly | The host is absent from 12 of 52 stage scenes (three Kerala and Bihar frames plus s009, s013, s052, s053, s054, s090, s091, s093, s094), so he is on screen in 40, not all. New literal visuals: a three-rung generation ladder with one figure fewer per rung (s015); five houses for "only five" (s036); a calendar for each survey (s040); two mothers in one street (s056 to s058); a balance for "about the same". **Not possible with the contract and icons:** a ruler (no icon), dice (no icon), a leave-one-out ring (`omit` is not a field; the scatter also throws if its printed correlation differs from its own dots), and a ghost NFHS-5 trend line (the scatter must print its NFHS-6 correlation too, which the narrator does not say in those scenes). The paper trail is partly there: map, then hospital and school icons for the ministry and IIPS (s017 to s019). |
| 12 | Pacing: near-identical runs, chart runs, four cards in Act 1, nothing teases the twist for 4 minutes | applied | The longest run of one kind is 3 (v1: 3, but of near-identical stage scenes). Runs of three stage scenes change the set, the cast or the props between neighbours (the three Kerala and Bihar frames s056 to s058 are identical on purpose); the Bihar and Assam charts (s047, s048) are followed by a multiples scene, the maps alternate with stage scenes, and the school/ring pair (s052, s053) is followed by s054 and then a scatter. Act 1 has two cards (s008, s014) and 13 scenes. The twist is teased by the map's legend heading "Next: the twist" on s068 (a map has no pill field; the legend heading is its only text slot). |
| 13 | Story Engine gaps: no predict beat, one bubble, no chapter pills, no SFX | partly | T3 is implemented once, honestly, where the narration withholds the answer: s074 (pill GUESS FIRST: UP OR DOWN? and the bubble, then the 16). Elsewhere the narrator names the answer in the same sentence, so a GUESS FIRST pill would be false. Bubbles: s060 CHANCE?, s074 WAIT. UP?, s086 LEVELLING OFF?. Chapter pills: s021 (INDIA'S OWN LINE), s040 (THE BIGGEST FALLS), s089 (WHY IT MATTERS); Act 3 opens on a map (no pill slot, the wipe marks it), Act 5 on a card and a title card, Act 6 on the THE TWIST badge. **SFX is an engine matter** (note N11). |
| 14 | S9 generosity, PIB source, S13 not run | partly | Two badge pairs land about a second apart and are kept on purpose because each is one thought: 30 OF 35 (s004) and the two Bihar measures (s058). PIB release 2266600 is on the source board (s098). S13 (the Bhagyaraj and Nolan passes) belongs to the script file and is not run here. |

## 1. Story Engine format (format chooser, section 4 of STORY_ENGINE.md)

**Main format: F8 Then and Now, "Look how far it moved" (engine: surprise through change). One layer: F13 Scale Shock (perspective for the numbers, T15).** Data Kadai's existing "Change" type maps to F8 in the engine's own table.

| Signal in the research (CLAIMS.md, figures.json) | Format it points to | Used as |
|---|---|---|
| The same measure, TFR, at several dates on one definition: India NFHS-1 (1992-93) to NFHS-6 (2023-24); states NFHS-4, NFHS-5, NFHS-6 | **F8 Then and Now** | **Main spine**: Acts 2, 4 and 6 are the "expect, then reveal the change" beats; Act 3 is "every state on the map" |
| Two true facts that seem to clash: India is below 2.1 yet Bihar is 2.7; "NFHS-6 is higher in 16 places" yet "10 of them by 0.1" | F10 Paradox | The Act 6 twist (a broken expectation, T6), not the main format |
| One number too big to feel: 2.1 | **F13 Scale Shock** | **Layer**: two parents, two children and a sliver (s012); the ladder of generations (s015); 0.9 against 2.7 on the two ends of the map (s039) |
| Map of 35 places | F6 Zoom (map) | The map is a recurring device, not the format |
| A fresh claim in the news (NFHS-6 release, 29 May 2026) | F11 Claim Check | Not chosen: there is no single headline to grade; the title question frames it |

Rotation (STORY_ENGINE section 4): no Story Engine format is on record for earlier Data Kadai long-forms (LF01 and LF02 are dated before the engine, 27 Oct), so F8 does not repeat a main format.

**Trap checked (F8): a change across a definition change is not a change.** Jammu and Kashmir has no NFHS-4 point (its NFHS-4 figure covered Ladakh too); Ladakh and Dadra and Nagar Haveli and Daman and Diu have none; the Andaman and Nicobar Islands have no NFHS-4 point (two official values differ, CLAIMS C29/B9); Manipur is hatched and noted on every map (the builder's default). No scene draws or says them.

**Predict beats (T3), stated honestly.** The narration names almost every answer in the same sentence as its question, so a prediction pause would be faked. The one real one is the twist (s074). The film's own expectation (Act 2: "India fell and crossed the line") is set up in Acts 2 to 5 and broken in Act 6 (T4).

## 2. Chapter map (long-form grid, STORY_ENGINE section 6) and feeling curve (T8)

| Act | Scenes | Time | Words | Job | Feeling |
|---|---|---|---|---|---|
| Cold open | s001 to s007 (7) | 0:00 to 0:37 | 88 | The question on screen from frame 0, then Bihar's two numbers, 30 of 35, the replacement level and the map promised | curiosity, a small jolt |
| The magic number | s008 to s020 (13) | 0:37 to 2:04 | 207 | Name the parts: TFR, the 2.1 line, the generation ladder, "long enough", the source (T11) | clarity, calm |
| India crosses the line | s021 to s028 (8) | 2:04 to 2:58 | 130 | Then and Now for India: 3.4 to 2.0, the crossing, and why one number is not enough | a quiet milestone, then doubt |
| The map: two Indias | s029 to s039 (11) | 2:58 to 4:08 | 168 | The map: 30 of 35 at or below the line, the bottom, the top, the 1.8 gap | wonder |
| The biggest falls | s040 to s049 (10) | 4:08 to 5:11 | 151 | Then and Now for the movers: Meghalaya, the islands, Bihar, Assam | tension, then a caution (small sample) |
| What goes with fewer babies? Our analysis | s050 to s068 (19) | 5:11 to 7:06 | 273 | Two tested patterns on one street, their NFHS-5 versions, the Lakshadweep check, pattern not proof | curiosity, then care |
| The twist | s069 to s088 (20) | 7:06 to 8:58 | 265 | The peak: NFHS-6 is higher in 16 places, but look closer; Kerala and Tamil Nadu flat; levelling off? A later survey will say | surprise, then doubt |
| So what? | s089 to s098 (10) | 8:58 to 10:01 | 150 | Why it matters (UN on ageing), the age profiles, the answer card, the viewer's own state and family | reflection |

Hook (0:00 to 0:28): the first scene shows the question and the spelled-out NFHS on pills from frame 0; the circled **3.4** lands at 4.4 s, **2.7** at 10.7 s, the 30 OF 35 badges at 17.1 s; the question is also spoken, on the title card, at 28 s (s006), and the map is back at 32 s. Peak (T9): the twist opens at 7:06 and its biggest beat, "NFHS-6 looks different" (s074, flagged `"peak": true`), is at 7:34 (76% of the film): later than the two-thirds mark, with Act 6's resolution and Act 7 still to come.

## 3. Scene table

Seconds are estimated (words / 2.6 + 0.5 s lead-out, at least 2.5 s). The narration is the verified script, numbers spelled out for the voice; `*` marks a scene whose ON-screen numbers wait for their word (a badge, a chart point or a card row). The act headings are wipes.


### Cold open

| Scene | Kind | s | Narration | What we see |
|---|---|---|---|---|
| s001 (hook) | stage* | 7.1 | In NFHS-4, the twenty fifteen sixteen survey, Bihar's fertility rate was three point four children per woman. | From frame 0 the uncle stands in a Bihar home beside a mother, the title question and the spelled-out NFHS sit on pills, and a big circled badge lands on the narrator's number: 3.4 children per woman, an average, not a family. |
| s002 | stage* | 5.1 | In NFHS-6, the twenty twenty-three twenty-four survey, it is two point seven. | Same room, same mother and pram, no extra figures: only the badge changes, to 2.7, under pills that say it is an average per woman and that the NFHS-6 sheets are provisional. |
| s003 | map | 4.4 | Bihar is still the highest of all the places surveyed. | The India map fills state by state in the fertility colour scale and Bihar lifts off the map while the others dim. |
| s004 | stage* | 4.7 | In thirty of the thirty-five states and union territories in NFHS-6, | The uncle points at a big 30, a small pill saying OF and a smaller 35, above a row of five little houses: the count of places, shown as one fraction. |
| s005 | map | 6.7 | the rate is at or below two point one, a number demographers call the replacement level. | The map re-colours in two flat colours, the places at or below the replacement line in cool blue and the few above it in warm orange. |
| s006 | title | 4.0 | So what is really happening to India's fertility rate? | A sunburst title card: the uncle and the film's question in big type, 'Here's the map.' under it. |
| s007 | map | 5.5 | The answer depends on where you live, and the map holds some surprises. | The full fertility map fills in again, a wave from north-west to south-east, with its legend. |

### The magic number

| Scene | Kind | s | Narration | What we see |
|---|---|---|---|---|
| s008 (wipe) | statement | 5.1 | Demographers watch one number above all: the total fertility rate, or TFR. | A solid blue card with big white type, TFR in yellow, and the uncle peeking up in the corner (the section header). |
| s009 | stage* | 7.4 | It is the average number of children a woman would have by the end of her childbearing years, | A mother alone at home (no host in this one); a pram pops in on 'children' and a clock on 'end', under the pill AVERAGE CHILDREN PER WOMAN. |
| s010 | stage* | 6.3 | if she had children at the rates measured in the years just before the survey. | In a clinic a big calendar pops in on 'years' beside the mother, under the pill RATES FROM RECENT YEARS. |
| s011 | stage* | 9.0 | So it is a snapshot of the recent past. It is not a count of how many children each family actually has. | The uncle, now on the right, shows a clock for 'a snapshot', then a family pops in on 'each family' under the pill NOT A HEADCOUNT: the picture of what TFR is not. |
| s012 | replacement* | 9.0 | The magic line is two point one. The United Nations says the replacement level is about two point one children per woman: | Two parent figures, an arrow, two children and a sliver of a third captioned 'a little over two', then a bold line sweeps across with a 2.1 badge labelled replacement level. |
| s013 | stage* | 7.1 | enough, on average, for a woman to be replaced by a daughter who survives to childbearing age. | A mother, then a daughter that pops in on 'daughter' and a heart on 'survives' ('a daughter who survives to childbearing age'), under the pill REPLACED BY A DAUGHTER. |
| s014 | statement | 3.2 | Stay below that line for long enough, | A solid blue card that lands as the narrator says 'for long enough': THE KEY WORDS and LONG ENOUGH in yellow. |
| s015 | stage* | 5.9 | and if nobody moves in from elsewhere, a country's population eventually starts to shrink. | A three-rung ladder of generations pops in beside the uncle, four people, then three, then two: each rung has one fewer, with no numbers, under the pill NO ONE MOVES IN. |
| s016 | stage* | 7.8 | One survey below two point one does not mean a population is shrinking. The key words are "long enough". | A single calendar page (one survey) pops in, then a big clock (time) on 'key', and the pill LONG ENOUGH lands on 'long' to repeat the key words the card showed. |
| s017 | map | 5.9 | Every figure for India and its states comes from the National Family Health Survey, | The map of India and its states fills in again as the source of every figure. |
| s018 | stage* | 5.1 | conducted by the health ministry with the International Institute for Population Sciences. | In a school set a hospital icon pops in on 'health' (the ministry) and a school icon on 'Institute' (IIPS), under the pill HEALTH MINISTRY + IIPS. |
| s019 | map | 7.8 | The sixth round, NFHS-6, covered nearly six point eight lakh households. We use its fact sheets, which are provisional. | The NFHS-6 map again, with its legend headed NFHS-6 fact sheets (provisional): the sixth round's data as one picture. |
| s020 | stage* | 6.7 | The counts and comparisons are our own arithmetic. We will say so when we go further. | The uncle on the right beside a balance and a notebook; the pill OUR OWN ARITHMETIC lands as the narrator says it, the hedge made visible. |

### India crosses the line

| Scene | Kind | s | Narration | What we see |
|---|---|---|---|---|
| s021 (wipe) | stage* | 7.8 | Let us follow India's own line. In the first round, in nineteen ninety-two ninety-three, it was three point four. | The uncle opens the chapter with a calendar and a circled badge: India's rate in the first round, 3.4. |
| s022 | tfr-line* | 9.0 | In NFHS-3, in twenty oh-five oh-six, it was two point seven. In NFHS-4, in twenty fifteen sixteen, it was two point two, | A flat line chart draws India's rate at NFHS-3 (2.7) and NFHS-4 (2.2) with the 2.1 replacement line just beneath the second dot. |
| s023 | tfr-line* | 6.7 | just above the line. In NFHS-5, in twenty nineteen twenty-one, it fell to two point zero. | The chart now follows the dot from just above the line down through it to NFHS-5 (2.0), with a hand-drawn circle at the crossing. |
| s024 | stage* | 5.5 | That was the first NFHS round to put India below two point one. | The uncle on the right; a big calendar pops in on 'first' under the pill FIRST ROUND BELOW THE LINE. |
| s025 | stage* | 7.1 | NFHS-6, whose results the health ministry released on twenty-nine May twenty twenty-six, shows two point zero again. | A hospital icon for the health ministry and a badge with NFHS-6's India figure, 2.0, under the pill RELEASED MAY 2026. |
| s026 | statement | 5.1 | India's rate stays below the line. But India is not one number. | A solid blue card, NOT ONE in yellow: the turn from one national number to many. |
| s027 | stage* | 6.3 | It has thirty-six states and union territories, and the NFHS-6 release covers thirty-five of them. | A house, a hospital and a school stand for the places; a circled 35 pops on 'thirty-five', under the pill STATES AND UNION TERRITORIES. |
| s028 | map | 6.7 | Manipur is not in the NFHS-6 release. Those thirty-five places live in very different demographic worlds. | The map fills in with Manipur left hatched and noted 'not in NFHS-6 release', while the narrator says the 35 places live in very different worlds. |

### The map: two Indias

| Scene | Kind | s | Narration | What we see |
|---|---|---|---|---|
| s029 (wipe) | map | 7.4 | Here is NFHS-6, state by state. Of the thirty-five places, thirty are at or below two point one. | The map fills in two colours: the places at or below the replacement line in cool blue, the few above it in warm orange, with a legend. |
| s030 | map | 7.8 | Twenty-eight are below it, and two, Madhya Pradesh and Rajasthan, sit right on the line at two point one. | Madhya Pradesh and Rajasthan lift off the two-colour map: the two places that sit right on the line. |
| s031 | stage* | 5.1 | At the bottom, the Andaman and Nicobar Islands read zero point nine, | A village set with palm trees; a circled badge lands on 0.9 for the Andaman and Nicobar Islands, under the pill THE BOTTOM. |
| s032 | map* | 7.4 | the only place in the survey below one child per woman. Sikkim comes next, at one point zero. | The map lifts the Andaman and Nicobar Islands and Sikkim and a LOWEST card slides in listing both with their rates. |
| s033 | stage* | 7.4 | A caution on the islands: their figure rests on about two thousand four hundred women, a small sample. | The uncle on the right looks concerned among palm trees; the pill SMALL SAMPLE lands on 'small'. |
| s034 | stage* | 6.3 | At the top, Bihar reads two point seven. Four places follow at two point two: | A badge for Bihar, 2.7, then a second badge, 2.2, for the four places that follow, above a row of four little houses, under the pill THE TOP. |
| s035 | map* | 4.4 | Jharkhand, Meghalaya, Uttar Pradesh, and the island territory of Lakshadweep. | The five places above the line lift off the map and a HIGHEST card slides in listing them. |
| s036 | stage* | 4.7 | Only five places in the survey are above two point one. | Five houses pop in one by one on 'only five places in the survey are above': a literal tally, no digits, under the pill ABOVE THE LINE. |
| s037 | map | 4.7 | Andhra Pradesh, Karnataka, Kerala, Tamil Nadu and Telangana in the south, | The five southern states named in the sentence lift off the two-colour map. |
| s038 | stage* | 6.3 | and Gujarat, Maharashtra and Goa in the west, all read one point nine or lower. | Three pills (GUJARAT, MAHARASHTRA, GOA) pop in as named and a circled 1.9 'or lower' lands, under the pill THE WEST. |
| s039 | map* | 8.6 | Between the lowest, zero point nine, and the highest, two point seven, the gap is one point eight children per woman. | The two ends of the map lift off, each with its card, LOWEST 0.9 and HIGHEST 2.7, and the gap between them is the story. |

### The biggest falls

| Scene | Kind | s | Narration | What we see |
|---|---|---|---|---|
| s040 (wipe) | stage* | 7.1 | Some places moved a lot between NFHS-5, in twenty nineteen twenty-one, and NFHS-6, in twenty twenty-three twenty-four. | The chapter opens with the uncle between two calendars that pop in on 'NFHS-5' and 'NFHS-6', each tagged with its years, under the pill THE BIGGEST FALLS. |
| s041 | stage* | 6.7 | Meghalaya fell from two point nine to two point two, the biggest fall in the survey. | Two badges for Meghalaya, NFHS-5 2.9 and then NFHS-6 2.2 circled, under the pill MEGHALAYA. |
| s042 | slope* | 8.2 | Back in NFHS-4 it read three point zero, so most of the fall since then came between NFHS-5 and NFHS-6. | A slope line for Meghalaya across NFHS-4, NFHS-5 and NFHS-6 (3.0, 2.9, 2.2) shows how much of the fall came in the last step. |
| s043 | stage* | 7.4 | The Andaman and Nicobar Islands fell from one point three to zero point nine, again a small-sample place. | Two badges for the Andaman and Nicobar Islands, 1.3 then 0.9 circled, with the pill SMALL SAMPLE landing on 'small-sample'. |
| s044 | stage* | 5.5 | Bihar, still the highest, fell from three point zero to two point seven. | Back in the Bihar home of the cold open: badges for NFHS-5 (3.0) and NFHS-6 (2.7, circled), under the pill BIHAR: STILL THE HIGHEST. |
| s045 | map | 6.3 | Arunachal Pradesh, Assam and Mizoram each fell by zero point three on the printed figures. | Arunachal Pradesh, Assam and Mizoram lift off the map: the three places that each fell by about the same step. |
| s046 | stage* | 5.9 | Those are rounded to one decimal, so read that as about zero point three. | A balance pops in on 'rounded' beside a cautious uncle; the pill SO: ABOUT lands on 'about'. |
| s047 | tfr-line* | 5.9 | Bihar went from three point four, to three point zero, to two point seven. | A line chart follows Bihar's three dots, 3.4, 3.0 and 2.7, down toward the 2.1 line. |
| s048 | tfr-line* | 5.9 | Assam went from two point two, to one point nine, to one point six. | The same chart for Assam: 2.2, 1.9 and 1.6, crossing under the 2.1 line. |
| s049 | multiples* | 4.4 | Meghalaya, Bihar and Assam were each lower in every round. | Three small line charts side by side, Meghalaya, Bihar and Assam, each lower at every survey. |

### What goes with fewer babies? Our analysis

| Scene | Kind | s | Narration | What we see |
|---|---|---|---|---|
| s050 (wipe) | statement | 4.0 | So what do the lower-fertility places have in common? | A solid blue card asking the chapter's question, FEWER BABIES in yellow, the uncle peeking up in the corner. |
| s051 | title | 8.6 | We tested two things ourselves, using figures in the same NFHS-6 fact sheets. This part is our analysis, not the survey's. | A sunburst title card with the uncle: OUR ANALYSIS in red, 'not the survey's' under it: the hedge stated as a headline. |
| s052 | stage* | 6.7 | First, the share of women aged fifteen to forty-nine with ten or more years of schooling. | A school set with a woman and a girl; a big school icon pops in on 'ten or more years' under the pill FIRST: SCHOOLING. |
| s053 | stage* | 5.9 | Second, the share of women aged twenty to twenty-four who were married before eighteen. | A ring icon pops in on 'married' beside a grown woman, under the pill SECOND: MARRIED BEFORE EIGHTEEN. |
| s054 | stage* | 5.9 | Across all thirty-five places, where more women had ten or more years of schooling, | A woman and a school icon that pops in on 'women', under the pill ACROSS ALL THE PLACES. |
| s055 | scatter* | 5.5 | fertility tends to be lower. The correlation is minus zero point three six. | A scatter of 35 dots (schooling against fertility) with a falling trend line; a correlation badge lands with -0.36 and the sticker 'Pattern, not proof'. |
| s056 | stage* | 5.5 | In Kerala, eighty-seven percent of women had ten or more years of schooling, | Two mothers stand side by side in one street, Kerala and Bihar, same set and same cast; a circled 87% lands over Kerala's mother for schooling. |
| s057 | stage* | 5.5 | and three percent of women aged twenty to twenty-four were married before eighteen. | The same street and the same two mothers; a circled 3% lands over Kerala's mother for marriage before eighteen. |
| s058 | stage* | 4.4 | In Bihar, the figures are thirty-three percent and thirty-five percent. | The same street and the same two mothers; now Bihar's mother gets the two badges, 33% for schooling and 35% for marriage before eighteen. |
| s059 | scatter* | 5.1 | For child marriage, the link is weaker: plus zero point two nine. | The same scatter for child marriage: a rising, looser trend line and a correlation badge with +0.29. |
| s060 | stage* | 5.1 | With only thirty-five places, a link that weak could partly be chance. | A cautious uncle with a speech bubble 'CHANCE?' and a badge for the small number of places, 35, under the pill COULD PARTLY BE CHANCE. |
| s061 | stage* | 7.4 | Next, compare with NFHS-5. On the same thirty-five places, the schooling link was minus zero point five two, | A calendar for the earlier survey and a circled badge with the NFHS-5 schooling link, -0.52, under the pill COMPARE WITH NFHS-5. |
| s062 | stage* | 7.4 | and the child marriage link was plus zero point four six. So both links are weaker in NFHS-6. | A ring icon and a circled badge with the NFHS-5 child-marriage link, +0.46; the pill BOTH WEAKER NOW lands on 'weaker'. |
| s063 | map | 4.0 | Part of that comes from one small island territory. | Lakshadweep lifts off the map: the one small island territory behind part of the weakening. |
| s064 | stage* | 8.6 | Lakshadweep, where eleven hundred fifty women were interviewed, is among the highest in schooling and reads two point two on fertility. | Palm trees and a school: a badge for 1,150 women interviewed and a circled 2.2 fertility rate, under the pill LAKSHADWEEP. |
| s065 | stage* | 8.6 | Leave it out, and the schooling link is minus zero point four six, against minus zero point five zero in NFHS-5. | Two badges with the schooling link without Lakshadweep: -0.46 for NFHS-6 (circled) and -0.50 for NFHS-5, under the pill WITHOUT LAKSHADWEEP. |
| s066 | stage | 4.7 | So the link has softened a little. It has not disappeared. | A balance beside the uncle, the pill SOFTENED, NOT GONE: the link has weakened but is still there. |
| s067 | statement | 6.7 | A word of caution. This is a pattern, not proof that one thing causes the other. | A solid blue card, NOT PROOF in yellow, the uncle peeking up: the chapter's caution. |
| s068 | map | 5.1 | Many other things differ between states, and we did not test them. | The map again, a quiet reminder that many other things differ between places; its legend is headed 'Next: the twist'. |

### The twist

| Scene | Kind | s | Narration | What we see |
|---|---|---|---|---|
| s069 (wipe) | stage* | 7.4 | Here is the twist. Between NFHS-4 and NFHS-5, of the thirty-three places that can be compared, Manipur included, | A badge THE TWIST lands, then a circled 33 'places compared', under the pill MANIPUR INCLUDED. |
| s070 | stage* | 5.1 | fourteen fell by zero point three or more on the printed figures. | A big circled 14: the places that fell by 0.3 or more between NFHS-4 and NFHS-5, under the pill ON THE PRINTED FIGURES. |
| s071 | stage* | 5.1 | None rose by that much. The other nineteen were about the same. | A badge with 19 'about the same', the uncle on the right, under the pill NONE ROSE THAT MUCH. |
| s072 | multiples* | 5.5 | Two read slightly higher: Kerala, from one point six to one point eight, | A single small line chart for Kerala from NFHS-4 (1.6) to NFHS-5 (1.8): a small step, tagged about the same. |
| s073 | multiples* | 4.7 | and Tamil Nadu, from one point seven to one point eight. | The same small chart for Tamil Nadu, 1.7 to 1.8. |
| s074 (peak) | stage* | 5.9 | NFHS-6 looks different. In sixteen of the thirty-five places, NFHS-6 is higher than NFHS-5. | The turn of the film: the uncle's speech bubble says WAIT. UP? and a huge circled 16 lands with 'higher, by any amount', after a GUESS FIRST pill, with the camera pushing in. |
| s075 | stage* | 5.1 | In twelve it is lower, and in seven it is the same. | Two badges land beside the 16: 12 'lower' and 7 'the same', under the pill NFHS-6 VS NFHS-5. |
| s076 | statement | 3.6 | But look closer. In ten of those sixteen, | A solid blue card, CLOSER in yellow: the second turn. |
| s077 | stage* | 6.3 | the difference is just zero point one, and we treat that as about the same. | A balance barely tilting beside the uncle: the pill A TINY STEP, then ABOUT THE SAME lands on 'about'. |
| s078 | map | 5.5 | On the printed figures, six places are zero point three or more higher, | The map pulses the six places that rose by 0.3 or more in warm orange rings while the others stay grey; the legend says all sample sizes are included. |
| s079 | map | 4.0 | and six are zero point three or more lower. | The six places that fell by 0.3 or more lift off the map (Meghalaya, the Andaman and Nicobar Islands, Arunachal Pradesh, Assam, Bihar, Mizoram) under the legend heading 'Lifted: the biggest falls'. |
| s080 | tfr-line* | 9.0 | Among places with bigger samples, the largest rise is Jammu and Kashmir: one point four in NFHS-5, one point eight in NFHS-6. | A line chart with two dots for Jammu and Kashmir, 1.4 and 1.8, the largest rise among the places with bigger samples. |
| s081 | tfr-line* | 8.2 | Nagaland fell by a full child per woman between NFHS-4 and NFHS-5, from two point seven to one point seven. | A line chart for Nagaland: 2.7 down to 1.7, a full child per woman, against the 2.1 line. |
| s082 | slope* | 5.1 | In NFHS-6 it reads two point zero, about zero point three higher. | A slope line for Nagaland's three surveys, 2.7, 1.7 and 2.0: the third dot rises about 0.3. |
| s083 | map | 3.2 | A few small places also show jumps, | The five small-sample places lift off the map: the places the narrator leaves out. |
| s084 | stage* | 7.8 | but their samples run from about eight hundred to two thousand two hundred women, so we leave them out. | A cautious uncle beside five little houses; the pills SMALL SAMPLES and LEFT OUT (on 'leave'). |
| s085 | multiples* | 7.1 | Kerala reads one point eight again, and Tamil Nadu one point seven. Both are about the same. | Two small line charts, Kerala (1.6, 1.8, 1.8) and Tamil Nadu (1.7, 1.8, 1.7): flat, tagged about the same. |
| s086 | stage | 4.7 | So is India's fall levelling off? One survey cannot tell us. | The uncle's speech bubble asks LEVELLING OFF? beside a clock and a single calendar page: one survey, one snapshot. |
| s087 | stage* | 5.1 | The NFHS-6 numbers are provisional, and only a later survey can show | The uncle on the right points at a new calendar page that pops in on 'later'; the pills PROVISIONAL and A LATER SURVEY land with the words. |
| s088 | statement | 3.6 | whether this is a turn or just noise. | A solid blue card with the question the film leaves open: A TURN? OR JUST NOISE?, NOISE in yellow, the uncle peeking up. |

### So what?

| Scene | Kind | s | Narration | What we see |
|---|---|---|---|---|
| s089 (wipe) | stage* | 7.4 | Why does this matter? The United Nations notes that in countries below replacement level, population ageing speeds up. | The chapter opens in a clinic: a clock pops in on 'ageing', the pills WHY IT MATTERS and UNITED NATIONS. |
| s090 | stage | 7.4 | And if fertility keeps falling, then over the long run the share of people of working age shrinks, | A street of working-age adults and a clock, under the pill WORKING AGE. |
| s091 | stage* | 3.2 | and the share of older people grows. | A father and two grandmothers that pop in on 'share' and 'older', under the pill OLDER PEOPLE. |
| s092 | title | 7.4 | NFHS-6 already shows different age profiles. In Kerala, twenty point seven percent of people are sixty or older. | A sunburst title card with the uncle: Kerala and Bihar, two age profiles, the share of people aged sixty or older. |
| s093 | stage* | 6.3 | In Bihar, eleven point five percent. For India as a whole, twelve point nine percent. | One grandmother and a calendar; the pills BIHAR and INDIA AS A WHOLE land as named (no digits yet: the table is missing). |
| s094 | stage* | 9.0 | At the other end, thirty-five point six percent of people in Bihar are under fifteen, against twenty point three percent in Kerala. | Two children; the pills BIHAR: UNDER FIFTEEN and KERALA land as named (no digits yet: the table is missing). |
| s095 | statement | 3.2 | The table shows how much, not why. | A solid blue card that answers the film's question in four short lines (BELOW THE LINE? YES. SHRINKING? ONE SURVEY CAN'T SAY.), the uncle peeking up. |
| s096 | map | 4.0 | So where does your state sit on the map, | The NFHS-6 map one last time, its legend headed 'Where does your state sit?'. |
| s097 | stage* | 5.9 | and what do you see in your own family? Tell us in the comments. | The uncle points at the viewer beside a family; a heart pops in on 'family', under the pill YOUR STATE, YOUR FAMILY. |
| s098 | end | 9.0 | Every number is in the Data Receipt below. And there is a new India map on Data Kadai to look at next. | The closing scene: the uncle asks the film's question in a speech bubble, a subscribe button rings, the sources sit on a board, and an empty frame waits for YouTube's next-video element. |

## 4. Story gates S1 to S13 (section 8 of STORY_ENGINE.md)

| Gate | Status | How it is met |
|---|---|---|
| S1 Facts | PASS, 2 flags | The narration is the verified script, word for word (script-checked); every line there carries its claim IDs and uses the CORRECTED wording. Flags: C53 ("Every number is in the Data Receipt below") and C54 ("a new India map ... next") are still UNVERIFIED in CLAIMS.md and are spoken in the last scene (s098); the lead must check the Receipt before posting, and AK owns D4. No scene prints a number that CLAIMS marks UNVERIFIED or withholds. |
| S2 Format | PASS | F8 Then and Now with an F13 layer, chosen from the research signals in section 1. |
| S3 Question by 30 s | PASS | The question is on screen from frame 0 (pill, s001) and is spoken and shown as the title card at 28 s (s006); the stakes are on screen before it: Bihar 3.4 at 4.4 s, 2.7, the 30-of-35 count. T16 (pay the promise fast) is met by the pill, not by the voice. |
| S4 Prime | PASS | Before the question is spoken the viewer meets Bihar's two numbers, "still the highest" on the map (s003), the 30-of-35 count and the words "the replacement level" (s005). Act 1 then names every part (TFR, 2.1, the source) before any chart needs them (T11). |
| S5 Resolve | PASS, 1 handed on | See the loops table below: each loop is closed; the one open question (is the fall levelling off?) is asked in s086 and handed on aloud to "a later survey" (s087, s088), as the script itself says; the title question is answered on screen at s095 and in the end bubble. |
| S6 Peak | PASS, late | s074 at 7:34 (76%): the first turn that overturns Act 2's story with the numbers on screen. See D6. |
| S7 End | PARTIAL | The last two spoken sentences are admin (C53, C54) and the script order is fixed (D3 offers the reorder). The meaningful line is carried by the picture: the answer card (s095), the closing map headed "Where does your state sit?" (s096), the family and the call to the viewer (s097), and the end bubble "Is India running out of babies? It depends on where you live." (s098). |
| S8 Screen text | PASS | Keywords and numbers only: pills are at most 5 words, badge captions at most 6, cards at most 4 short lines; the card that echoed a whole sentence was recast or cut to the key words. The full sentence appears only in the draft caption strip. |
| S9 Numbers | PASS, 2 pairs | Every printed number lands on its own spoken word, and each has a reason to be there (a from-and-to pair, the 2.1 line beside it, a rank or a count the narrator is making). Two pairs land about a second apart on purpose: 30 OF 35 (s004, one fraction) and the two Bihar measures (s058, one comparison). The five age-profile figures are spoken but cannot be printed yet (D5). |
| S10 Hedges | PASS | The hedges are in the voice verbatim (provisional, "on the printed figures", "about 0.3", "a small sample", "our analysis", "pattern, not proof", "we treat that as about the same") and repeated on screen as pills, tags or card text: PROVISIONAL, SMALL SAMPLE, OUR ANALYSIS, PATTERN, NOT PROOF, ABOUT THE SAME, ON THE PRINTED FIGURES, ANY DIFFERENCE COUNTED. |
| S11 Retell | PASS | "India's fertility rate has been below 2.1 since NFHS-5 and is 2.0 in NFHS-6. But it is two Indias: 30 of 35 places are at or below the line, Bihar is at 2.7 and the islands at 0.9. NFHS-6 shows some places up and some down, mostly by 0.1, so one survey cannot say whether the fall is levelling off." |
| S12 Audience | PASS, 1 builder request | Avoid list: no rage-bait; no state mocked (Kerala and Bihar stand in one frame with one cast; the host never cheers or mourns a rate: poses are present, point, or caution about data quality); no politics; no cause the source does not state ("pattern, not proof", "untested"). Manipur is hatched and noted on every map; no disputed border is restyled. Child marriage is shown by a ring icon and an adult woman, never a child bride. The red-for-falls colour in two chart builders and the red circle on s042 are the one open point (lead action 5). |
| S13 Review | NOT RUN | The Bhagyaraj and Nolan passes belong to `SCRIPT_VERIFIED.md`, which this task does not own. Plants and payoffs are listed below for that pass. |

### Loops opened and closed (S5, E6)

| Loop opened | Where | Closed | Where |
|---|---|---|---|
| "Is India running out of babies?" (pill and title card) | s001, s006 | Below the line yes, shrinking one survey cannot say, and it depends where you live | s095, s098 |
| "What is really happening to India's fertility rate? It depends where you live; the map holds surprises" | s006, s007 | Two Indias: 30 of 35 at or below the line, the 0.9 to 2.7 gap; then the Act 6 surprise | Act 3 (s029 to s039) and Act 6 (s069 to s088) |
| "Bihar is still the highest" | s003 | Bihar 2.7 at the top of the table; its path 3.4, 3.0, 2.7 | s034, s035, s044, s047 |
| "30 of the 35 ... at or below the replacement level" | s004, s005 | 2.1 explained; 28 below and two on the line; the five above | s012 to s015, s029 to s036 |
| The sliver of a third child (the extra 0.1) | s012 | Captioned "a little over two" in the same scene | s012 |
| Manipur is blank (the note is on every map from s003) | s003, s028 | "Manipur included" in the 33 that can be compared | s069 |
| "What do the lower-fertility places have in common?" | s050 | Schooling -0.36, child marriage +0.29, both weaker than NFHS-5; "a pattern, not proof" | s055 to s067 |
| "Long enough" (one survey is not a trend) | s014 | "A turn? Or just noise?" and "one survey cannot tell us" | s086 to s088 |
| "Is India's fall levelling off?" | s086 | Not answered, handed on aloud to a later survey (the script's own ending of the question) | s087, s088 |

### Plants and payoffs (for the S13 pass)

- The Bihar mother and pram of the cold open (s001, s002) return as the Bihar home of s044 and the Bihar side of the one-street comparison (s056 to s058).
- The 2.1 line drawn in s012 is the line every later chart crosses (s022, s023, s047, s048, s049, s080, s081, s085).
- "About 0.3, rounded to one decimal" (s046) is the rule the twist pays off: about-the-same tags on Kerala and Tamil Nadu (s072, s073, s085) and on the ten rises of 0.1 (s077).
- The small-sample caution on the islands (s033, s043) returns for Lakshadweep (s064) and the small places left out (s083, s084).
- LONG ENOUGH (card s014, pill s016) returns as A TURN? OR JUST NOISE? (s088).
- The pill PATTERN, NOT PROOF (s056 to s061) is said aloud in s067.
- The turn (Nolan): Act 2 teaches "India crossed the line and fell"; s074 breaks that expectation (16 places higher), and s077 to s082 resolve it fairly: ten of the 16 are 0.1, six are 0.3 or more, Jammu and Kashmir and Nagaland are the clear cases.

## 5. Numbers: what is printed and what is only spoken

Every printed figure is a `FigRef` into `figures.json` (the validator checks each resolves) or a definitional constant (`0.1` and `2.1` in the replacement and tfr-line scenes), and is drawn only from its reveal key: 129 reveals, 34 of them on stage badges, the rest on chart points, list cards, the slope and multiples charts, the scatter badges and the replacement picture. No scene prints a number by typing it: digits in text fields are years and survey names only.

Spoken but **not** printed (no FigRef exists, so nothing is typed): 36 states and union territories; the 29 May 2026 release date; nearly 6.8 lakh households; about 2,400 women; "about 800 to 2,200" women; the gap of 1.8; "ten of those 16" and "six and six" (counts of lists, not numbers in the table); every 0.3 threshold; and the five age-profile percentages of Act 7 (20.7, 11.5, 12.9, 35.6, 20.3: section 7, lead action 4). Years and survey names are labels (2015-16, NFHS-5), not figures. Nothing UNVERIFIED in CLAIMS.md is printed.

## 6. Decisions AK must take

| ID | Decision | Storyboard default |
|---|---|---|
| D1 | Title (CLAIMS D1). "Running out of babies" is stronger than the table shows. | The question form, "Is India running out of babies?", is on the first pill (s001), the title card (s006) and the end bubble (s098): it claims nothing. If AK keeps the declarative title or takes the safer "India's Fertility Rate Is Below 2.1. Here's the Map.", change those three strings. |
| D2 | Opening B (critic's Fix A). "Is India running out of babies? The answer depends on the state: from zero point nine children per woman in the Andaman and Nicobar Islands to two point seven in Bihar." is 31 spoken words (total 1,463, inside 1,300 to 1,500) and pays the title in the first seconds. It is in `SCRIPT_VERIFIED.md` as an optional alternate. | Not used: opening A (corrected) is the verified default (CLAIMS D2). If AK chooses B, the script owner must trim the later sentences it repeats ("The answer depends on where you live", s007), and the storyboard gains one map scene before s001: the Andaman and Nicobar Islands and Bihar lifted, the two LOWEST and HIGHEST cards keyed to "zero point nine" and "two point seven" (the s039 pattern), plus a SMALL SAMPLE pill on the 0.9. |
| D3 | Ending (S7). The last spoken lines are admin (C53, C54). | Order kept as verified. Alternative (needs the script owner): move "Every number is in the Data Receipt below. And there is a new India map ..." before "So where does your state sit ...", so the film ends on "Tell us in the comments." Storyboard effect: the two admin sentences become their own short stage scene before s096 (pills DATA RECEIPT and NEXT ON THE MAP), s096 and s097 follow, and the end scene s098 runs silent over the subscribe prompt, the sources and the end bubble. |
| D4 | C53 and C54 are UNVERIFIED. The Data Receipt must exist and list every figure (C01 to C63) before posting; "a new India map" is a channel promise. | Spoken as in the verified script; AK confirms before posting. The safer C54 wording is already the one used. |
| D5 | Act 7's five age figures cannot be printed yet. | Spoken only (s092 to s094). Lead action 4 adds two flat tables; then paste the specs in section 7. Or accept a number-free Act 7. |
| D6 | Length and peak. Estimated 10:01, at the top of 8 to 10 minutes; the peak sits at 76% of the film. | Kept: the narration is fixed (1,432 words; deleting the ADDED sentences C55 to C63 leaves 1,222, under the 1,300 floor). The voice step gives the measured length; the twist needs Acts 1 to 5 to land. |
| D7 | "Next video" line on the end card. | Left empty (`next` is omitted). The invented "Saturday: the quick-commerce showdown" is removed until AK confirms the title (`week44/LONG_quick_commerce.md`). The empty frame for YouTube's end-screen element is still drawn. |
| D8 | Small-sample places (CLAIMS D4, D9). | The Andaman and Nicobar Islands carry SMALL SAMPLE pills (s033, s043); Lakshadweep shows the number of women interviewed (s064); the five small places are named only as "a few small places" (s083, s084). |
| D9 | Cast and host. | One original uncle host (the pilot's keeper) and one generic cast; AK picks the final host name, voice and look (rule 7 of the handover). |
| D10 | Three title cards (the question, OUR ANALYSIS, the age profiles) and eight blue cards. | The title card is the only kind with a headline and the host, so it marks the film's three big framing statements; the blue cards mark section changes and turns. AK may prefer fewer. |

## 7. Notes for the lead (engine, contract, figures)

**Lead actions** (files I do not own; the storyboard is written so that each is a small change):

1. **Registry.** `scenes/index.ts` imports `./replacement` and `./tfrLine`, whose specs differ from CONTRACT.md. Point them at `./replacement_a` and `./tfrLine_a`, then render stills of s012, s022, s023, s047, s048, s080, s081.
2. **Contract names** (all optional, all the builders' own, each a validator WARN today): `badges[].decimals` (counts, percentages and correlations must not print as 30.0 or 87.0), `lists.show`, `lists.low`, `lists.high`, `lists.lowKey`, `lists.highKey` (s032, s035, s039: without them the LOWEST and HIGHEST cards print five rows each with numbers not yet spoken), and `extra.caption` (s012). Adding these seven names clears 28 of the 29 warnings. Also allow `statement.lines` items `{text, show}` (the builder already supports them) so a card line can slide in on its word.
3. **Map `labelStates`** (contract: `string[]`) throws in the current `map.tsx` because every chip needs a reveal key; the storyboard names states with `highlight` and the LOWEST / HIGHEST cards. `lists.lowest` and `lists.highest` (contract names) are set too, but the builder reads `lowN` and `highN`.
4. **Age figures.** `age_structure` is three levels deep, so no `{t, state, s}` FigRef reaches it. Add two flat tables shaped like `school10`: `age60plus` and `under15`, state to `{nfhs6, nfhs5}` (copy the values from `age_structure`, indicator ids 3 and 2 in `meta`). Then change three scenes (reveal words are in the narration already):

```json
s092: kind "title" becomes "stage", spec {"set":"village","actors":[{"id":"grandmother","who":"grandmother","x":900,"y":945,"h":540}],
  "badges":[{"key":"k60","ref":{"t":"age60plus","state":"Kerala","s":"nfhs6"},"suffix":"%","caption":"Kerala, aged sixty or older","x":1250,"y":300,"size":170,"accent":"circle","decimals":1}],
  "pills":[{"text":"NFHS-6 · AGE PROFILES","x":96,"y":72}]}, reveals [{"key":"k60","word":"twenty point seven"}]
s093: add badges {"key":"b60","ref":{"t":"age60plus","state":"Bihar","s":"nfhs6"},"suffix":"%","caption":"Bihar","x":1000,"y":300,"size":160,"decimals":1}
  and {"key":"i60","ref":{"t":"age60plus","state":"India","s":"nfhs6"},"suffix":"%","caption":"India as a whole","x":1500,"y":420,"size":160,"decimals":1};
  reveals b60 on "eleven point five", i60 on "twelve point nine"
s094: add badges {"key":"bu","ref":{"t":"under15","state":"Bihar","s":"nfhs6"},"suffix":"%","caption":"Bihar, under fifteen","x":1000,"y":300,"size":160,"decimals":1}
  and {"key":"ku","ref":{"t":"under15","state":"Kerala","s":"nfhs6"},"suffix":"%","caption":"Kerala","x":1500,"y":420,"size":160,"decimals":1};
  reveals bu on "thirty-five point six", ku on "twenty point three"
```

5. **Neutral colour for falls and rises.** `multiples.tsx` (line 131) draws falls red and rises green and `slope.tsx` (line 70) circles the biggest fall in red; `slope.hero` is not a contract field, so a spec cannot switch it off. One neutral colour (the royal blue or the ink) for both directions keeps the host from "mourning" a lower rate (S12).
6. **Small-sample marking on the map** (dashed grey ring plus a SMALL SAMPLE tag on the places under 2,500 women, in the risers and fallers maps) and `multiples.sub` (so Meghalaya's first step can say about the same) would close the last two points of defects 10.
7. **Optional: `bars` and `tally` kinds.** The critic proposed them. They are not used: nothing in the storyboard needs a new kind once lead action 4 is done. If the lead wants them anyway, they must be added to CONTRACT.md and the registry first, and the storyboard's stage scenes swapped.

**Notes** (carried over from revision 1, still true):

- **N6 Chart keys.** `slope` and `multiples` draw every point from one key per item, so each key sits on the first number word the narrator says in that scene; digits never come early, some come a little late. Per-point keys would tighten the sync. `tfr-line` has per-point keys and is used wherever a state's points are read out.
- **N7 Voice text.** `vo` keeps `NFHS-4` and `NFHS-6` as written (one word, as the script's own count does); the voice step may need "N F H S four", so audition it in the first line. Years are spelled "twenty fifteen sixteen", "twenty oh-five oh-six", "nineteen ninety-two ninety-three"; 1,150 is "eleven hundred fifty".
- **N9 Reveal on a description (s023).** The chart there re-draws the NFHS-4 point (2.2, spoken in the previous scene) on the words "just above the line"; that is the one `reveal-figure` warning and is deliberate.
- **N11 SFX.** The engine plays only the voice. A pop on each of the 129 reveals and a whoosh on each of the 7 wipes can be synthesised from the timeline with ffmpeg (nothing downloaded); that is an engine task.
- **N12 Draft only.** The timeline is estimated; `public/datayt/long/babies/timeline.json` was not touched (the placeholder is still there). A test timeline built from this storyboard (98 scenes, 129 reveals) was written to the scratchpad only; no number appears before its word, and two reveals that would have shown for under 0.8 s were moved earlier in their sentence.

## 8. Validator result (`scripts/datayt/long_validate.py`): 0 errors, 29 warnings

- 28 are "nested field not in CONTRACT.md" (lead action 2): `badges[].decimals` 19, `lists.*` 8 (s032 two, s035 two, s039 four), `extra.caption` 1 (s012). No top-level field outside the contract is used.
- 1 is `reveal-figure` on s023 (N9), deliberate.
- No `kind-run`, `pace`, `transition`, `typed-number`, `frame` or `library` warning. The longest run of one kind is 3. Longest speech 22 words (8.5 s); shortest 7 words (2.7 s).
- Checked by script in Python before finishing: valid JSON; every kind known; every reveal key appears in its scene's spec; every reveal word appears in its scene's narration; 98 scenes (90 to 130); 1,432 words (1,300 to 1,500); each act after the cold open starts with a wipe and no other scene does; the first scene is the hook and the last is the end scene.

To rebuild the table or re-check: `python3 scripts/datayt/long_validate.py public/datayt/long/babies/storyboard.json`, then `python3 scripts/datayt/long_timeline.py public/datayt/long/babies/storyboard.json` (this one overwrites `timeline.json`; add `--out` to write elsewhere).

# Look B, GEO-07 Part 2 ("What does a normal monsoon really mean?"): new scene variants (contract, 3 Nov 2026)

Read `CONTRACT_B.md` first: the look, the rules and the checks there all apply unchanged. This file adds only what Part 2 needs.
Part 1 must still render unchanged (`LONG-geo07-p1-B`): add variants, never change how an existing one draws.

## The film
- Compositions `LONG-geo07-p2-B` (30 fps, for stills) and `LONG-geo07-p2-B60` (60 fps). Player `RichLong.tsx`, registry `registry.ts`.
- Storyboard `public/datayt/long/upsc/geo07-p2/storyboard.json` (55 scenes; each has `visual`, a one-line art note: follow it),
  timeline `public/datayt/long/upsc/geo07-p2/timeline.json` (estimated; the measured voice timing replaces it tomorrow, so motion must be a
  function of `f`, `dur` and `at(key)`, never of fixed frame numbers). Built by `scripts/upsc/geo07_p2_storyboard.py`. Never edit them.
- Find your scenes: `python3 -c "import json;[print(s['id'],s['kind'],s['spec'].get('which') or s['spec'].get('mode') or s['spec'].get('set'),s['visual']) for s in json.load(open('public/datayt/long/upsc/geo07-p2/timeline.json'))['scenes']]"`

## Numbers
- Text quantities: `lab(key)` from `src/looks/cartoon/long/figs.ts`. Part 2 keys start with `p2_` (table `u7_labels`). A label item is either
  `{text, key}` (print as given) or `{lab, key}` (print `lab(lab)`). Support both everywhere you read labels, pills, badges and pins.
- Numbers drawn as bars, jars or ruler positions come from `fig({t, state, s})`. Tables: `u7_months` (June/July/August/September →
  `share`, % of the season), `u7_tn` ("Tamil Nadu" → `swm` 342.0, `nem` 447.4, `annual` 943.7 mm), `u7_norm` ("India" → `y2025`, `fc_lo`,
  `fc_hi`, `s_lo`, `s_hi`, `r_lo`, `r_hi`), `u7_lpa` ("India" → `old`, `new`, mm). Never type a number in a component (years in text items
  such as "1982" come from the storyboard and are allowed).

## Builder W: windmap (owns `scenes/windmap*.tsx`, `map.tsx`)
New layers in `LAYERS` (each drawn from `at(key)` of the layer or of its items):
- `pins`: `items: [{text|lab, key, at, hl?}]`: an atlas pin (serif label card, thin leader) at an anchor; `hl` = a warm glow ring.
- `stream-bay` / `stream-arabian`: a soft stream of cloud and arrows entering over the south Andaman Sea and Bay of Bengal / onto Kerala
  from the Arabian Sea.
- `branch-arabian` / `branch-bay`: two arms of cloud. Arabian Sea branch climbs the west coast (Western Ghats, then north of Mumbai);
  Bay branch turns north into Bengal and up the north-east, then west along the Ganga plain.
- `front`: `{dir: "north"|"south", steps: [{key, lab?}]}`: a dashed front line (the northern limit of the monsoon) that jumps from one
  position to the next at each step's `at(key)`, with a short ease (surges, not a glide). North: from Kerala's latitude to covering all
  India. South: from the north-west back to the south peninsula. Clip the line to India's land outline; draw nothing outside India. A step
  with `lab` shows that label at the line.
- `wetdry`: India shaded deep green (Konkan coast, Western Ghats, north-east) to pale sand (West Rajasthan). It is an illustration, not data:
  draw a small "ILLUSTRATION" pill. Soft edges, no sub-division boundaries.
- `depression`: a slow swirl of cloud crossing from the head of the Bay inland across central India over the scene.
- `easterlies`: arrows from the east onto the Tamil Nadu coast.
- `trough` with `pos: "normal"` (its usual July place) must work, and `trough-move` to `"north"` as in Part 1.
- New anchors: `andaman`, `kerala`, `mumbai`, `delhi`, `konkan`, `wrajasthan`, `cherrapunji`, `tncoast`, `bay`, `top`, `central`, `south`,
  `nw`, `westcoast` (reuse existing ones where they exist). Place them at the real places (lon/lat) and clamp cards inside SAFE.
India whole on every map (Ladakh, Jammu and Kashmir, the Andaman and Nicobar Islands, Lakshadweep).

## Builder A1: analogy part A (owns `scenes/analogy_p2a.tsx` and helpers `scenes/analogy_p2a_*.tsx`)
Fill the record `P2A` with `which`:
- `checklist`: `{title, labels}`: a clipboard checklist, title at top, each label a line that ticks at its `at(key)`. For the onset scene
  (title contains "onset") a small Kerala coast map with a row of station dots beside it and a satellite above seeing tall cloud; for
  withdrawal, the north-west with dry air.
- `calendar-flip`: a wall calendar page "15 July" (first label) flipping to "8 July" (second label); print the label text, not a typed date.
- `orographic`: cross-section of the Western Ghats in atlas relief: moist wind from the sea climbs the west face, cloud piles and rains.
  With `lee: true`, air slides down the east side, warm and dry, over brown land, and the "RAIN SHADOW" label sits there.
- `rain-types`: three panels: convectional (warm bubble rising from hot ground, cloud above), orographic (mountain), cyclonic (swirling storm).
- `column-house`: a three-storey Indian house and beside it a glass column of water about as tall as its roof (never taller) (chip from spec).
- `spells`: a strip calendar of one July (31 day cells, blue wet spells and sand-coloured breaks, illustrative) and, below it, a tally of
  many seasons with about one in four marked "no break". Print `spec.source` small at the bottom.
- `months`: four bars June to September from `u7_months` (`fig`), July and August tallest and highlighted; month names under the bars.

## Builder A2: analogy part B (owns `scenes/analogy_p2b.tsx` and helpers `scenes/analogy_p2b_*.tsx`)
Fill `P2B` with `which`:
- `jars`: two glass jars side by side filling from `u7_tn` (`swm` June-September, `nem` October-December); the mm values printed from
  `fig`; the second taller.
- `bucket-band`: the girl's rooftop bucket (as in Part 1) on a measuring scale marked in centimetres; a green band around the average
  (label `p2_lpa`). With `wobble: true`, the water level wobbles inside the band and the other labels appear.
- `rulers`: two horizontal rulers (forecast, finished season) with green "normal" bands from `u7_norm` (`fc_lo`–`fc_hi`, `s_lo`–`s_hi`,
  % of the average); `marker: true` adds a marker at `y2025` that sits inside the season band and outside the forecast band; `third: true`
  adds a third, wider ruler for one region (`r_lo`–`r_hi`, as % departure). Labels from the spec.
- `cards`: `cards: [{text, key, good?}]`: cards drop onto a table one by one; `good` lands face up in green, the rest in drought brown.
- `seesaw`: the Indian Ocean drawn as a see-saw plank between Africa and Indonesia: the west end warmer than usual, the east end cooler than usual (label it "than usual"); chip and
  limit from the spec.
- `decades`: a vertical ruler with the old normal mark (`u7_lpa.old`, printed in cm with one decimal) and a new, slightly lower mark
  (`u7_lpa.new`). With `strip: true`, a long horizontal strip of decades shading wetter and drier in turns (illustrative, chip from spec).

## Builder G: globe and stage (owns `scenes/globe*.tsx`, `scenes/stage*.tsx`, `girl.tsx`)
- globe `belt-south`: the glowing band (as in Part 1's `seasons`) slides back south from over north India to over the south peninsula
  (labels in order), Bay storms swirl in from the east, then the band moves on south toward the equator.
- globe `pacific`: the globe turns from India to the Pacific; warm red water spreads east along the equator toward Peru.
- stage prop `postcards`: `cards: [{which: "konkan"|"thar"|"chennai", key?, hl?}]`: three painted postcards pinned to a line (Konkan coast in
  rain, Thar dunes under a dry sky, Chennai shore under heavy October cloud); a card with `key` appears at its `at(key)`; `hl` lifts it.
- stage prop `reportcard`: a season report card with one empty tick box labelled with `box`, appearing at `at(key)`.
- stage spec `belt: {key}`: the faint glowing cloud band from Part 1 drifting along the top of the frame from `at(key)`.
- stage set `field`: a rain-fed field in the plains, with `sky: "clouds"` for arriving monsoon clouds (default: dry blue sky). Actor
  `who: "farmer"`: an adult farmer drawn in the same realistic style as the girl (`girl.tsx`), poses `idle` (looking up) and `sow`
  (broadcasting seed).
- stage `rain: "spells"`: heavy rain for the first part of the scene, then sun for the rest (the bucket keeps its level).
- Badges and pills already accept `lab`; badges with `lab` print the label as the big text.

## Checks (every builder)
Run stills of each of your scenes at start, middle and end:
`npx remotion still src/index.ts LONG-geo07-p2-B out/upsc/looksB2/<scene>_<frame>.png --frame=<global frame> --scale=0.5`
(global frame = the scene's `from` + a local frame), open each PNG with the Read tool, and fix what is wrong (richness below Part 1, text
outside x 96-1824 / y 64-920, overlaps, a label before its reveal, a cropped India, unreadable type). Also render one Part 1 still that uses a
kind you touched to prove Part 1 is unchanged. Do not render the whole film. Report: files changed, scenes checked, anything you could not do.

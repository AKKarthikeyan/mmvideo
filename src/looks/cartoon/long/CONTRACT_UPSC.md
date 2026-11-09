# UPSC monsoon film (GEO-07 Part 1): new scene kinds (contract, 2 Nov 2026)

The film plays on the existing cartoon long-form engine (`CONTRACT.md` in this folder: read it first, its look, number rule and checks all
apply). Composition `LONG-geo07-p1`, timeline `public/datayt/long/upsc/geo07-p1/timeline.json` (55 scenes, 10:28, estimated timing),
built from `storyboard.json` by `scripts/upsc/geo07_p1_storyboard.py`. The narration is fixed: it is the fact-checked script. Never change
`vo`. If a visual needs a different word for a reveal, say so in your report; the lead changes the storyboard.

## Output (AK, 2 Nov 2026)
60 fps, 2K (2560 x 1440), our own synthesised sound effects. The timeline stays in 30 fps logical frames; the composition `LONG-geo07-p1-60`
plays it at 60 fps (LongCartoon `fps` prop, the same method as KurzLong), so components receive a fractional `f`: never assume an integer
frame (use `Math.floor` only where a step is wanted). Render at 2K with `--scale=1.3333333333333333` (the art is vector, so it stays sharp).
Effects: `scripts/upsc/long_sfx_upsc.py`.

## Rules that matter most here
- **Numbers and quantities.** Numbers come from `fig()`. Quantities printed as text (coordinates, heights, ranges such as "40–60° E") come
  from `lab(key)` in `figs.ts` (table `u7_labels` in `public/datayt/long/upsc/figures.json`). An item with `lab` prints `lab(lab)`; an item
  with `text` prints the text as given. Never type a number in a component. A missing key must throw.
- **Reveals.** Every keyed item is drawn only from `at(key)`. Before that frame, draw nothing or an empty outline.
- **Labels for illustration.** `chip` (for example "ANALOGY", "ILLUSTRATION") is drawn as a small pill, top left, for the whole scene. `limit`
  is drawn as a small line under the art: "Where the picture stops: <limit>".
- **Maps.** Geography comes only from Natural Earth 10 m, India's point of view (`/Volumes/DarwinSSD/MMVideo/sources/geo/ne_10m_admin_0_countries_ind.geojson`,
  public domain; this is the file Indica Atlas uses for the official Indian view of borders). Draw India's outline from it and nothing that
  contradicts it. No state lines are needed. Never use DataMeet data or NCERT figures.
- **No NCERT pages on screen.** Citations are text cards only (the existing `statement` kind does them).
- **The kid** is the cast's `girl` for now (AK will choose the look). Poses: idle, present, point, cheer, worried.
- Keep everything inside SAFE and above y 920. Something always moves (idle bob, drifting clouds, flowing arrows, slow camera).
- Files: each builder edits only its own files (listed in its brief) and may add helpers named after its kind (`scenes/windmap_*.ts`).
  Never edit `index.ts`, `contract.ts`, `LongCartoon.tsx`, `LongCompositions.tsx` or `figs.ts`: ask in your report.

## Kinds and spec fields (exactly as the storyboard uses them)

### globe (`scenes/globe.tsx`)
`{mode, glow?, labels: [{text?|lab?, key}]}`. A flat-vector Earth (ink outline, flat ocean and land, simple continents; India visible and
recognisable but small). Modes:
- `band`: a white cloud band near the equator, drifting; `glow` makes it bright.
- `coriolis`: arrows of moving air in both hemispheres curving right in the north, left in the south, a straight one on the equator.
- `zoomout`: the camera pulls back from South Asia to the whole Earth over the scene.
- `hadley`: cross-section loop over the band: rising at the equator, flowing poleward high up, sinking near 30°, returning low (the trades).
- `itcz`: trade-wind arrows from north and south meeting; a row of growing cloud towers along the meeting line.
- `seasons`: the year runs fast; a sun marker's overhead spot slides north and south; the cloud band follows like a shadow and settles over India.
- `split`: peak scene. Left half: a big sea-breeze arrow onto India, fading. Right half: the glowing band sliding up over India, trade-wind
  arrows following it across the equator.
- `overhead`: the band over India, cloud towers building, rain beneath.

### windmap (`scenes/windmap.tsx`, plus `scenes/windmap_*.ts` and a basemap build script `scripts/upsc/windmap_basemap.py`)
`{focus: "ocean"|"india"|"asia", zoomFromBeach?, layers: [{id, key, badge?: {lab, key}, pos?, to?, items?}]}`. A flat cartoon physical map
(land in flat fills, sea flat blue, coast ink lines) projected from the Natural Earth file. Suggested boxes (lon0, lon1, lat0, lat1):
ocean 30-100, -35, 30; india 60-100, 0, 38; asia 40-120, -10, 45. Layers, each drawn from `at(key)`:
- `seabreeze-giant`: one huge arrow from the Indian Ocean onto India. `monsoon-sw`: broad south-westerly arrows onto India's west coast.
- `equator`: a dashed equator line, labelled. `trades-se`: south-east trade-wind arrows south of the equator.
- `cross`: the 40-60° E band highlighted where the winds cross (badge `lab`). `bend`: the arrows curve right after crossing.
- `hot-nw`: north-west India glowing hot. `heatlow`: a shallow low swirl over north-west India and Pakistan.
- `lat20`: a 20° N line (badge). `itcz-july`: the rain band over the Gangetic plain in July (badge `itcz_july`).
- `trough`: a line from the heat low to the head of the Bay of Bengal at `pos` ("south" = south of normal); `trough-move`: it slides to
  `to` ("north", the Himalayan foothills) over the rest of the scene.
- `mascarene`: an "H" near 30° S, 50° E (badge). `somali`: a low ribbon of wind from near Madagascar up the Somali coast, bending east to India.
- `tibet`: the Tibetan Plateau shaded (badge). `tej`: a thin fast east-to-west stream high above, near Chennai's latitude.
- `labels`: text items `{text|lab, at, key}`; `at` names an anchor (india, arabian, nw, south, central, top, ganges, mascarene, somali,
  westcoast, tibet, chennai-lat). Place anchors sensibly and clamp to SAFE.
`zoomFromBeach`: the scene opens on the beach colours and zooms out to the map in the first second.

### analogy and sketch (`scenes/analogy.tsx`, `scenes/sketch.tsx`)
analogy: `{which, time?, chip?, limit?, labels: [{text, key}]}`. `which`:
- `heat-rates`: two thermometers side by side, LAND rising fast, WATER slowly.
- `column`: a tall column of air pressing down on the kid's head.
- `rooms`: a crowded room and an empty room with a door; people drift into the empty one; arrows "rise" over low, "sink" over high.
- `gradient`: isobars close together with a strong arrow, far apart with a gentle one.
- `breeze`: a beach cross-section; `time` "day": air rises over sand, sea air slides in; "night": reversed.
- `roundabout`: a playground roundabout from above, a rolled ball tracing a curve.
- `pot`: a pot of water on a stove, convection loop arrows rising in the middle and sinking at the sides.
sketch: `{chip, lines: [{label, dir: "up"|"down", key}], caption}`: two hand-drawn lines (wobble), one rising and one falling, with no axis
numbers at all; the caption under them; chip "ILLUSTRATION".

### notebook (`scenes/notebook.tsx`) and the stage additions (`sets.tsx`, `icons.tsx`, `scenes/stage.tsx`)
notebook: `{who, lines: [{text, key}], strike?: {text, key}}`: an open lined notebook filling most of the frame, the kid small at one side
holding a pencil. `strike.text` is already written at the top and gets struck through at `at(strike.key)`; each line is handwritten on (a
writing reveal) from its `at(key)`.

stage additions (keep every existing set, field and behaviour; the babies and Namakkal films must render unchanged):
- New sets: `rooftop` (a flat Indian roof with a parapet and a water tank, city behind), `beach`, `himalaya` (a wall of snowy peaks across the
  frame, cold-air arrows from the north bumping into it, clouds piling on the south side).
- New spec fields: `time` ("may" = harsh light and shimmer; "july" = grey sky; "noon"; "burst" = dark sky), `rain` (bool: falling rain),
  `thunder` (bool: lightning flashes), `intro` ("globe-band": the first 30 frames show a simple Earth with a white equatorial cloud band, no
  label, then cut to the set).
- New props: `bucket` with `state` "empty" | "filling" (water rises over the scene) | "full"; `thermometer` with `level` "high" | "mid";
  `calendar` (exists) with the June to September months highlighted; `book` with `glow`.
- Badge, pill and bubble items accept `lab` instead of `text` (printed with `lab()`).

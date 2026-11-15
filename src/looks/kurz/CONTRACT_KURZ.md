# Kurz look, Namakkal films: contract for scene builders (29 Oct 2026)

Two films, one look (AK picked the Kurzgesagt-like look B on 29 Oct 2026; AK asked for **rich, detailed HD visuals at 60 fps, good to watch on a TV
and on a phone**):
- **LONG-namakkal-A**, script A "The Paradox", 42 scenes, ≈ 7:09.
- **LONG-namakkal-C**, script C "The Long Road", 41 scenes, ≈ 6:28.

Both are 1920x1080, 60 fps, with the brand `indicaatlas`. The worktree is `/Volumes/DarwinSSD/DataKadai/mmvideo-dk-nk` (branch `datakadai/namakkal-looks`).

## How the engine works (read these first)

**Engine and data**
- `KurzLong.tsx` plays `public/datayt/long/namakkal/{A,C}/timeline.json` (made from `storyboard.json` by `scripts/datayt/long_timeline.py`).
- Each scene is one component from `registry.ts`, with props `{f, dur, spec, at, draft}` (`../cartoon/long/contract.ts`).
- Storyboards come from `scripts/datayt/namakkal_storyboards.py`. **Do not edit storyboards or timelines.** If a spec field must change, say so in your report.

**Frames at 60 fps**
- `f` is the scene's local frame on a **30 fps logical clock**. At 60 fps it is **fractional** (0, 0.5, 1, 1.5…).
- `dur` and `at(key)` are in the same logical frames.
- Write every motion as a smooth function of `f`: `interpolate`, `spring` (fractional frames are allowed), `Math.sin(f / k)`.
- Never round `f`. Never step art on `Math.floor(f / n)` unless you mean a deliberate hold. Never use `useCurrentFrame()` inside a scene.

**Numbers**
- Every number on screen comes from `figures.json` through `numOf()` in `../cartoon/long/scenes/nk_kit.tsx`, and is drawn with `KNum` or `KBadge` from `kit.tsx`.
- They throw if a number is drawn before its `at(key)`.
- **Never type a digit that is a figure.** Axis ticks, years in labels and dates are allowed.
- Draw a shape before its number lands (bars grow, dots fill), but the digits wait.

**Shared code**
- `kit.tsx` (palette `K`, `KBadge`, `KPill`, `Stars`, `Glow`, `Egg`, `Hen`, `Person`, `Coin`, `Sun`, `Dawn`) is **shared and read-only**. Put new helpers in your own files.
- The map geometry is in `../cartoon/long/scenes/map_geo.ts` (`GEO`, `MAP`).
- Series and sources are read through `meta()` in `../cartoon/long/figs.ts`, using the `meta.nk_*` paths in `figures.json`.

## The look: rich and detailed, original

Kurzgesagt-*like*, never copied: no birds, characters, logos or frames from any channel.

**Palette and shapes**
- Flat vector shapes with no outlines, on a deep navy space. Use the `K` palette in `kit.tsx`.
- **Every shape has a lit side and a shade side** (a straight cut), a soft long shadow and a subtle rim light.

**Richness means depth and life, not clutter**
- **Depth:** 3–5 parallax layers (far sky, mid hills, near ground), atmospheric haze between them, light shafts.
- **Life:** particles (dust, stars, fireflies), small secondary motions (grass sway, hens pecking, steam, flags), a slow camera drift or push-in on every scene.
- **Texture:** fine grain, a few hatch or stipple marks on big flat areas.
- **Light:** each set has a clear light source; tint by era. `tint: "sepia"` is 1969–1982, warm amber dawn with desaturated blues. `"warm"` is the 1982 meetings. The default is present day.

**Readable on a TV and on a phone (5–6 inch, landscape)**
- Keep all text and numbers inside SAFE: x 96–1824, y 64–920. The draft caption strip covers y 930–1016.
- Minimum sizes at 1080p: **body labels 34 px, captions under numbers 30 px, numbers 90 px or more**.
- No thin text on busy art: put text on a solid or blurred panel, contrast at least 4.5:1.
- One focal point per frame. At most about 8 words of on-screen text per scene (Story Engine T10).
- Keep the top-right corner (x > 1560, y < 120) clear: the brand bug sits there.

**Motion**
- Ease everything (no linear moves).
- Entrances overshoot slightly; exits are rare (scenes hard-cut).
- Something always moves.
- No strobing, and no fast full-frame flashes (TV safety).
- The motion must look smooth at 60 fps.

**Honesty labels**
- Any drawn historical scene shows its `ILLUSTRATIVE` pill (the storyboard supplies it).
- Drawn documents say "DRAWING, NOT THE ORDER'S PAGE".

## Scene kinds and their specs (as the storyboards use them)

A `NumIn` is `{key, ref: {t, state, s}, decimals, prefix?, suffix?, caption?|label?}`; draw it with `numOf(n, at(n.key))`.

**`stage`**: an illustrated scene.
- Spec: `{set, actors[], props[], badges[], pills[], camera?: {fx, fy, s0, s1}, tint?: "sepia"|"warm"}`.
- `set` is one of: `village` (Namakkal dawn, palms, hills), `hospital` (a 1960s government veterinary hospital: low building, verandah, signboard without readable text), `road` (a country road with hills; vehicles drive across), `sheds` (small thatched sheds, deep litter, chicks), `train` (a steam/diesel-era train at a platform, crates being loaded), `market` (a town market street with stalls), `hall` (a meeting hall with a crowd and a blackboard), `regulator` (a modern government office building in Delhi, columns, flag pole without a flag emblem).
- Actor: `{id, who, x, y (feet line), h (px), flip?, enter?: key, pose?: "present"|"refuse", seed?}`.
  - `who` is one of: `postmaster` (khaki uniform, cap, mail bag), `vet` (white coat, stethoscope, spectacles), `farmer` and `farmer2` (dhoti/lungi, towel on shoulder; two looks), `trader` (shirt, ledger), `official` (suit), `crowd` (a group of 8–15 seated or standing people).
  - Faces are simple (dot eyes, no mouth needed). Give each person a small idle motion.
- Prop: `{icon, x, y, s, enter?: key, seed?}`.
  - `icon` is one of: `egg`, `hen` (white hybrid layer), `deshen` (red desi hen), `chick`, `coin`, `calendar`, `car` (a 1970 Ambassador-like car, generic, no brand), `van` (a 1970s goods van), `crate` (egg tray crate), `ratesheet` (a printed rate board/sheet with rows and no readable digits), `doc` (a document stack).
- Badges: `NumIn` with `{x, y, size, caption}` (the centre), drawn with `KBadge` and revealed at its key. Pills: `{text, x, y (top-left), key?}`, drawn with `KPill`.
- An element with an `enter` key pops in at `at(enter)`; without one it is there from the start.

**`statement`**: `{lines: string[]}`, with `*starred*` words accented. A big-type card over a rich space scene (egg planet, orbit rings, stars). Lines stagger in.

**`doc`**: `{org, doc, quote, quoteKey, credit, creditKey?, label}`. A drawn document floating in a lit room or on a desk. The quote is swept with a glowing highlighter at `at(quoteKey)`; the credit pill appears at `at(creditKey)`; the label pill is always visible.

**`share-map`**: `{states: (NumIn & {state, color, caption, bx, by})[], lit?: {state, key?, color}[], pin?: {name, key, label}, zoom?: {u, v, s}, title?, source}`.
- The India map (`map_geo.ts`), lit states glowing, badges at `bx, by`.
- `pin` uses `meta.nk_pin`.
- `source` is a key of `meta.nk_sources` (show it small, on a panel). Add "map boundaries: draft".

**`price-line`**: `{series, y0, y1, ystep, drawKey?, drawn?, band?, marks: (NumIn & {at: "max"|"min"|"last"|isoDate, side?, dx?, dy?, color?, caption})[], title, source}`.
- Series come from `meta.nk_series` (`jun_aug_2026`, `feb_apr_2026`).

**`chapter`**: `{n, title, icon, year?}`. 2.5 s, silent, opens each act with an iris (engine). A big chapter number, the title, a hero illustration of the icon (egg, hen, chick, ratesheet, doc, globe), and the year if given.

**`title`**: `{kicker, title, sub?, steps?: {text, key}[]}`. The film's title card: a rich hero illustration (an egg-shaped planet over a Namakkal dawn landscape works). Steps pop in one by one starting at `at(key)`.

**`quote`**: `{quote, who, role?, kind: "study"|"slogan"|"recollection", key}`. A verbatim quote in big type, with typographic quotes and a who/role line. The text writes on or fades in by word from `at(key)`. Make it look different by kind: a study gets a document chip; a slogan gets a banner/flag motif; a recollection gets a soft portrait silhouette marked ILLUSTRATIVE.

**`timeline`**: `{points: (NumIn & {label, shown?})[], unit, pins?: {key, label, at: label}[], title, source}`.
- A horizontal time axis. At each point a flock of hen icons grows to scale (for example 1 icon = 1 lakh birds, in a dense grid), and the number lands at its key.
- `shown: true` means already visible at frame 0 (spoken in an earlier scene).
- A pin is a labelled flag at the point whose label equals `at`, popping at its key.

**`counter`**: `{mode: "pair"|"compare"|"trio", visual: "eggs"|"coins"|"crates", items: (NumIn & {label})[], note?, source}`.
- `pair`: then and now (or value and rank), side by side with an arrow and a scaled visual (a small coin against a big coin; a pile of eggs).
- `compare`: shares as filled egg grids, for example 100 eggs with 68 lit.
- `trio`: three facts in a row, each with a small illustration.

**`bars`**: `{series: "nk_exports_monthly", from, marks: (NumIn & {at?: "YYYY-MM", line?: true, caption, color?})[], title, source, highlight?: {from, to, key, label}}`.
- Monthly bars from `meta.nk_exports_monthly` (crore eggs) grow left to right.
- A mark with `line: true` is a horizontal average line with its badge.
- A mark with `at` badges that month's bar.
- `highlight` shades a span of months at its key, with a label. Give the bars a rich treatment: stacked egg crates or glowing columns.

**`seasons`**: `{series: "nk_monthly", key, lowKey, count: NumIn, of: NumIn, source}`.
- A grid of the full years in `meta.nk_monthly.years` (rows) by 12 months, cells shaded by `meta.nk_monthly.rs` price.
- At `at(lowKey)` each year's cheapest month (`meta.nk_monthly.low_month`) lights up, the March–April column glows, and the badge reads `count` "of" `of` (both from figures).

**`split`**: `{left: {set, caption, tint?}, right: {set: "ratesheet"|..., caption}, disclaimer, discKey}`.
- The ending: two panels of the same morning, 1970 and 2026.
- At `at(discKey)` the disclaimer "merely suggestive and not mandatory" (verbatim from NECC's page) appears small under the rate sheet, then the frame holds.

## Checks every builder must pass

1. **Compile.** `npx remotion bundle src/index.ts --out-dir=<your scratch dir>` with no errors. Keep your files compiling at all times (write a temp file, then move it).
2. **Isolated stills.** Render your kinds with `KURZ-scene`, for example:
   `npx remotion still <bundle> KURZ-scene out.png --frame=N --props='{"kind":"timeline","spec":{...},"dur":180,"reveals":{"b82":40}}'`
   Frame N is a 60 fps frame, so logical frame = N/2. Use the real specs from the storyboards.
3. **Stills in the films.** Render frames of every scene of your kinds inside `LONG-namakkal-A` and `LONG-namakkal-C` (the scene's `from` and `dur` are in `timeline.json`; the film frame is `(from + local) * 2`). Check before each reveal, just after it, and at the scene's end.
4. **Look at every still**, and also downscaled to 640x360 (a phone in a feed). Fix:
   - text outside SAFE, or under about 34 px;
   - overlaps, empty or flat areas;
   - a number before its key;
   - anything unreadable at 640x360.
5. **Smoothness.** Render 2 seconds of one of your scenes at 60 fps (`npx remotion render <bundle> KURZ-scene x.mp4 --frames=0-119 --props=…`) and confirm no jitter or stepping.
6. **Report:** the files you wrote, the spec fields you support, any spec change you need (say exactly which), and which stills you looked at.

## File ownership (edit only your own)

- **Art builder:** `stage.tsx`, plus new files `art_sets.tsx`, `art_cast.tsx`, `art_props.tsx` (or an `art/` folder).
- **Data builder:** `timeline.tsx`, `counter.tsx`, `bars.tsx`, `seasons.tsx`, `shareMap.tsx`, `priceLine.tsx`, plus a new `data_kit.tsx`.
- **Cards builder:** `chapter.tsx`, `title.tsx`, `quote.tsx`, `split.tsx`, `statement.tsx`, `doc.tsx`, plus a new `cards_kit.tsx`.
  - The cards builder may import art from the art builder's files once they exist (for example the village set in `split`). Until then, use `Dawn` from `kit.tsx`.
- **Nobody edits** `kit.tsx`, `KurzLong.tsx`, `registry.ts`, `scenes.tsx`, the storyboards, timelines, figures, or anything outside `src/looks/kurz/`. Ask in your report.

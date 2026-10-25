# Brief: build Week 2 map scenes (Indica Atlas, 25 Oct 2026)

You are building the animated-map scene ("spec") for some of the Week 2 Shorts. Repo: `/Volumes/DarwinSSD/MMVideo` (Mac Mini).
Never publish, upload or post anything, and never print or copy any API key. AK (the owner) reviews everything.

## What exists
- **Engine:** `src/geo/engine/GeoShort.tsx`. Read the top of the file for the `Spec` and `Layer` types, then the layer rendering code.
  - A spec has a globe fly-in from `globe` to `handoff`, then camera moves (`cams`, keyed to beats), then timed `layers`.
  - Layer kinds: `fill` (countries by ISO3 / Indian states by name / a custom polygon), `label`, `pin`, `line` (draw-on, arrow, flow), `ruler`, `river`, `particles`, `night`, `bigtext`, `counter`, `clock`, `bars`, and `panel`.
  - **Use only the existing panels `timeline` and `tiles`.** Do not add panels or edit GeoShort.tsx: it is shared, and other agents are working at the same time.
- **Examples:** `src/geo/week1/specs.ts` holds 13 finished Week 1 specs (chenab, indiatime, andaman, malacca and enclaves are good models). Copy their style.
- **Your file:** `src/geo/week2/<id>.ts` holds a starter spec (globe, hand-off and question only). Replace `cams` and `layers` with the full scene.
  - Keep the export name and `id`.
  - Edit only your own `<id>.ts` files. Do not touch `specs.ts`, `GeoRoot.tsx`, data.json or anything else.
- **Script:** `scripts/geo/week2.py` has the beats: (key b1..b9, spoken line, caption).
  - The VIS column in `docs/geo/week2/drafts/<id>.md` describes the intended visual per beat, and that file's **Map care** notes are binding.
  - The fact table there gives the figures. Put no number on screen that is not in the caption or fact table.
- **Timing:** `public/geo/<id>/data.json` has the beat lengths.
  - These are PLACEHOLDERS: silent audio sized from word count, because the voice is not recorded yet.
  - Real voice will change beat lengths, so time everything relative to beats (`in`, `dt` of a few tenths of a second, `out`). Never assume absolute seconds.
- **Map data:** `public/geo/_shared/geo.json`.
  - Countries cover 0–150°E and 25°S–75°N, keyed by ISO3, e.g. IND, PAK, CHN, MDV, MMR, EGY, TZA, AUT, ITA, LKA.
  - Indian states are keyed by name (e.g. "Kerala", "Rajasthan", "Odisha", "Haryana", "Lakshadweep", "Andaman and Nicobar", "Maharashtra"). Check the exact keys in the file.
  - Rivers: Brahmaputra, Yarlung, Ganges, Chenab, Indus, Nile.
  - Per-Short close-up imagery: `hi[<id>]` box with `public/geo/<id>/hi.jpg` at 160 px/degree. It shows when `hi: true` and the camera span is under 12°. The asia texture is 40 px/degree, so for spans under about 3° stay inside your hi box or the picture goes soft.

## Rules
- **Map care:**
  - India's official map only. The base layer already draws Natural Earth borders from India's point of view.
  - Never fill or outline a disputed area, and never colour Pakistan, China, Myanmar or the Coco Islands as India.
  - For Berenike, keep the camera north of about 23°N so the Halaib Triangle area stays out of frame.
  - Anything not drawn from real data (routes, schematic diagrams) gets a small on-screen label: "schematic", "illustrative" or "simplified".
- **Coordinates** are for placement only, but they must be right. Use real lon/lat (decimal degrees) for every place.
- **Screen safety (1080×1920):**
  - Keep text inside x 40–1040.
  - The burned-in caption sits at y≈1380 and the question at y≈1180. Keep bigtext and counters between y 220 and 1100.
  - YouTube's buttons cover the right edge (x>900) from y 900 to 1750, and the bottom from y 1600. Keep labels and pins out of those zones.
  - The channel tag sits at the top centre (y≈96).
- **Motion:** every beat should have something moving or appearing. That means a camera move, a line drawing on, a pin popping or a counter running. No still beats and no plain fades. Show the hook visually from frame 0 to beat 1.
- **Credit:** set `credit:` to a short source line for the bottom strip, e.g. `"Sources: Lakshadweep Admin · Survey of India"`. Take the names from the fact table, and stay under about 70 characters.

## Check your work (required)
Render stills from the repo root, one at a time:
`npx remotion still src/geo/index.ts GEO-<id> <your scratch dir>/<id>_f<N>.png --frame=<N> --scale=0.4`
- Take at least one frame from the middle of each beat. Beat start times are the running sum of data.json `sec` plus 0.12 s gaps, times 30 fps.
- Look at every frame. Fix:
  - text off-screen or overlapping
  - labels in the YouTube zones
  - pins in the wrong place
  - blank or soft maps
  - anything that contradicts the Map care notes
- If a render errors, read the error and fix your spec.
- Do not run full video renders; stills only.

## Report back
Per Short: done or blocked, what each beat shows (one line each), anything you could not do with the existing layer kinds, and any frame you are unsure about.

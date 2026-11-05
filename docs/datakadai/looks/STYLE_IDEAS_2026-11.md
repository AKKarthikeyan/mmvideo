# Style ideas from two MIT repos (read-only research, 4 Nov 2026)

For AK to pick from. Nothing here is built or chosen. AK decides taste.

## What was studied
| Repo | What it holds | Licence (checked in the cloned `LICENSE` file) |
|---|---|---|
| [lemomo-ai/lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) | 66 film styles. Each has a `STYLE.md` prompt (look grammar, rules) and a 30-40 s demo as web-page source | `LICENSE` = MIT. **README adds:** code and docs are MIT, but the demo films and stills are **CC BY 4.0** (credit LemoLab, link the repo), and third-party assets inside demos keep their own licences (see each demo's `CREDITS`) |
| [Vincentwei1021/mg-styles-15](https://github.com/Vincentwei1021/mg-styles-15) | 15 motion-design styles, a prompt, a 10 s demo and source each | `LICENSE` = MIT (code, prompts, films). Photos, HDRI and samples inside are CC0 or public domain; fonts are not included |

Searched both for CC BY-SA: none found. Searched for the Claude mascot: only `living-screencast` (built on "Clawd"); skipped.

**Important for reuse.** Both repos are plain HTML + canvas/WebGL pages with a `renderAt(t)` function, rendered frame by frame in headless Chrome. None is Remotion or React. So "reuse" means reading the `STYLE.md` rules and porting the drawing code into a Remotion component (canvas inside `useCurrentFrame`, or SVG). Nothing drops in. The `STYLE.md` prompts are the most useful part: they spell out the look grammar. Do not copy demo films or stills (CC BY needs credit; and they are not our stories). Three.js styles also need `@remotion/three` added (`three` is not in this repo's `package.json`).

## Ten styles that are new to us
Checked against `Common/Visuals/VISUALS.md`, `src/looks/{slab,counter,dispatch,cartoon,atlas}` and `looks/README.md`. Effort is a rough guess: S = a few hours, M = a day or two, L = several days.

| # | Style | Suits | What it takes in Remotion | Licence | Source |
|---|---|---|---|---|---|
| 1 | **Transit Map**: octilinear metro schematic that a pen draws on, growth over years, interchange capsules | Indica Atlas (rail, metro, river networks); Data Kadai (growth of a network by year) | SVG paths with 8-direction routing, stroke-dash draw-on, a year counter. Drawn wholly in code, no photos. Use our own geometry and no operator marks (the demo notes its map is a fan drawing). **M** | MIT (STYLE.md, code) | [STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/transit-map/STYLE.md), [net.js](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/transit-map/demo/net.js) |
| 2 | **Satellite Briefing**: analyst-grey satellite image, thin white measuring lines, one reading per screen, one continuous zoom | Indica Atlas (Chilika, Sundarbans, coastlines, reservoirs, city growth) | Image zoom and pan, SVG overlay lines, reticle, readouts. Imagery must be public domain (NASA, USGS) and checked per scene; no disputed borders. Moves toward Indica's no-AI-maps rule. **M** | MIT; demo imagery is NASA/USGS public domain | [STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/satellite-briefing/STYLE.md), [overlay.js](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/satellite-briefing/demo/overlay.js) |
| 3 | **Watercolor Brush**: a painted field-journal page that paints itself, one unbroken horizontal walk, hand notes beside the paint | Indica Atlas (monsoon's path, a river from source to sea); Inner Chariot (calm journeys) | Canvas brush-stroke engine (dry-brush edges, paper grain, wash bleed) driven by frame. Heaviest of the set. The demo uses a CC BY 4.0 plant image: do not reuse its assets. **L** | MIT (code); one CC BY 4.0 asset in the demo | [STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/watercolor/STYLE.md), [engine.js](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/watercolor/demo/engine.js) |
| 4 | **Silkscreen Travel Poster**: 4-6 flat inks, stepped colour bands, registration slip, one poster per stop | Indica Atlas (a poster per state or place); Data Kadai (state-series covers) | Flat SVG shapes in a fixed ink palette, offset layers for the slip, no gradients. Cheap to build and easy to template. **S-M** | MIT; demo assets CC0 | [STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/silkscreen-poster/STYLE.md), [engine/](https://github.com/lemomo-ai/lemo-opuscar/tree/main/styles/silkscreen-poster/demo/engine) |
| 5 | **Exploded Teardown**: a real product lifts apart layer by layer on one axis, camera orbits, ends with true dimensions | Inventor's Desk (radio, fridge, microwave, clock) | Three.js scene via `@remotion/three` (new dependency), staggered layer lifts, leader lines. Needs a model per device: only open-hardware or self-modelled parts, no brand CAD. **L** | MIT (demo uses a CC BY 4.0 model: do not reuse) | [STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/teardown/STYLE.md), [src/](https://github.com/lemomo-ai/lemo-opuscar/tree/main/styles/teardown/demo/src) |
| 6 | **Circuit Board**: the world drawn as a PCB seen from above; routes are copper traces, places are pads, current flows | Inventor's Desk (devices, power); Data Kadai (power grid, supply chains) | SVG traces with animated dash flow, pad markers, silkscreen text. Pure code. **M** | MIT; demo fonts OFL | [STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/circuit-board/STYLE.md), [src/](https://github.com/lemomo-ai/lemo-opuscar/tree/main/styles/circuit-board/demo/src) |
| 7 | **Copperplate Engraving**: a plate that engraves itself, line by line, hatching then cross-hatching, numbered roundels, italic captions | Inventor's Desk (patent-plate look); Indica Atlas (natural-history, old-atlas feel) | Subject drawn as stroke paths; a burin tip follows them with swelling line width; hatch fills built up in passes. The demo's `burin.js` is the core. Subject art must be our own or public domain. **M-L** | MIT; demo asset CC0 | [STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/engraving/STYLE.md), [burin.js](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/engraving/demo/engine/burin.js) |
| 8 | **Archive Light Table**: real documents on a backlit table, a loupe comes down and the detail fills the frame; one reading per screen | Moat & Margin (filing text vs. what was said); Inventor's Desk (patent drawings, standards) | Document images on a light-table backdrop, circular loupe mask with zoom, annotation lines. Needs scans we may use (company filings, patents, public-domain pages; the demo mixes in CC BY 3.0 and Wikimedia items: do not reuse those). **S-M** | MIT | [STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/archive-lighttable/STYLE.md), [film.js](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/archive-lighttable/demo/film.js) |
| 9 | **Shadow Puppetry**: carved translucent puppets against a lit cotton screen, lamp flicker, profile acting | Inner Chariot (parables, epic stories); Indica Atlas (folk tales). Indian tholu bommalata is a real tradition, so the grammar can be Indian rather than the demo's Chinese puppets | Layered silhouette SVGs with lace-cut texture, backlight glow, simple joint rigs. Needs puppet art drawn by us. **Taste/respect check:** Inner Chariot rule says Krishna appears only as symbols, so use it for parables and people, not deities. **L** | MIT; demo assets CC0 | [STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/shadow-puppet/STYLE.md), [puppet code](https://github.com/lemomo-ai/lemo-opuscar/tree/main/styles/shadow-puppet/demo) |
| 10 | **One-line Drawing**: a single ink line that never leaves the paper; scenes morph into each other instead of cutting | Inner Chariot (calm, reflective); Inventor's Desk (a short explainer with a clean line) | One long SVG path animated by draw-on, with morph targets between scenes. Content hand-authored. Grown-up and quiet. **M-L** | MIT; demo assets CC0 | [STYLE.md](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/one-line/STYLE.md), [geom.js](https://github.com/lemomo-ai/lemo-opuscar/blob/main/styles/one-line/demo/geom.js) |

Quick read on which are cheapest and most useful: #4 (poster) and #8 (light table) are small builds; #1 and #2 give Indica Atlas two map-native looks it lacks; #5 and #6 give Inventor's Desk a second look beyond paper-and-ink and the night vector look.

## Overlaps with looks we already have (no need to add)
| Their style | Our look |
|---|---|
| Whiteboard, Chalkboard, Blueprint | Seven weekly templates (whiteboard, chalkboard, blueprint) |
| Swiss Motion Graphics; mg-styles `09-bauhaus` | Seven styles (Swiss/Bauhaus), Slab |
| Risograph Print | Seven styles (Risograph) |
| Red Paper-cut; mg-styles `06-collage` | Seven styles (paper cut-out), Vox collage |
| Caption News, Broadcast News Package | Seven templates (newsroom cards), Dispatch |
| Data Storytelling (`dataviz`) | Data Kadai BeatStory, Counter |
| Data Physicalization (stacked real plates, 3D) | Counter (money as objects). Close, but 3D stacked scale is more physical; a later extension of Counter rather than a new look |
| Visual Investigation (sources on one clock) | Evidence board template, Dispatch source quotes |
| Isometric Infographic, Isometric Picture Book, Low-poly Island; mg-styles `03-isometric` | Premium C isometric diorama, Seven styles (isometric), Flow Build iso skin |
| 1920s Newsreel, Silent Film | The Letter (16 mm), channel intro |
| Dark Tech Keynote, Glass Product; mg-styles `12-aurora-glass`, `01-flat-vector` | Night look (flat vector, glow), Premium A |
| Constructivist Montage; mg-styles `18-hanazi` (variety captions) | Slab (kinetic poster type) |
| Ink Wash, Woodcut, Ukiyo-e (print and ink looks) | Gita ink, Napkin hand-drawn (different, but not a gap we have named) |
| mg-styles `02-line-art`, `08-morph` | Napkin math, Build Log / One-Shape Morph |
| mg-styles `22-hud`, Hologram HUD | No exact match, but fits none of the five channels well; left out |

## Left out on the rules
- Built on the Claude mascot: Living Screencast.
- Childish or cartoon-for-kids, which AK rejected for UPSC: Crayon Picture Book, 1930s Rubber Hose, Mid-century Cartoon, Sci-Fi Sitcom Toon, Brick Toy, Paper Pop-up Book, Microgame Frenzy, Game Show Flat, mg-styles `19-paperclip` (sticker figures) and `05-cel-boil`.
- Off-brand for these channels: 80s Cel Anime, 16-bit Pixel RPG, HD-2D, Liminal Found Footage, 60s Spy Titles, Synthwave, Art Deco.

## Before any reuse
1. Re-read the exact `CREDITS` file of any demo you borrow from. Use the code and `STYLE.md` rules only; drop the demo's own images, models and audio.
2. If any of the demo's drawing code is ported, keep its MIT notice in the file header.
3. Check every source image and font against the SSD rules (no CC BY-SA, primary sources, no brand characters).

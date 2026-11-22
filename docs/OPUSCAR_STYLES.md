# Lemo-Opuscar: the 20 styles we keep (22 Nov 2026)

[Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) by Lemomo (LemoLab) is a library of 99 film styles made
entirely in code: each is a web page with `render(t)`, captured frame by frame in headless Chrome (Three.js for 3D),
the same approach as our HyperFrames. AK asked on 22 Nov 2026 to keep the 20 that fit our channels on the SSD.

**Where:** Mac Mini, `/Volumes/DarwinSSD/vendor/lemo-opuscar/` (`repo/` = sparse clone with the 20 styles, `films/` =
their 20 demo films, about 940 MB in all). Fetch or update with:

```sh
sh scripts/vendor/fetch_opuscar_styles.sh            # NO_FILMS=1 to skip the films
```

**Licence (their `LICENSE`):** code is MIT: we may copy and adapt it, keeping their copyright notice. Docs and style
prompts (`*.md`, `STYLE.md`) are CC BY-NC 4.0 plus a permission to follow and adapt them to make our own films,
commercial ones included, but not to share them: keep them on the SSD, never in this repo (it is public). Demo films
are CC BY 4.0. Films we make with the library are ours. Clawd (Anthropic's character) and third-party material keep
their own terms.

**Our rules still apply:** their demos are mostly fictional. We take the look and the technique only; every visual
uses real data with its source on screen, and anything illustrative is labelled.

## The 20, by channel

Columns: style folder in their repo · what it looks like · where we'd use it.

### New looks we don't have yet

| Style | Look | Channel |
| --- | --- | --- |
| `spreadsheet` | The whole film inside one spreadsheet; cells are pixels, the formula bar speaks | Moat & Margin |
| `data-physical` | Real numbers as stacks of coins, plates or blocks to exact scale, lit like a product shot | Moat & Margin, India Ledger |
| `dataviz` | One chart drawn mark by mark in pencil on cream paper, with handwritten notes | Moat & Margin, India Ledger |
| `map-explainer` | Real elevation and imagery in 3D, sea by depth, glowing routes and data | Indica Atlas, Moat Atlas |
| `white-model` | White model of a real place with data projected onto it as light | Indica Atlas |
| `archive-lighttable` | Real archive objects on a light table; a loupe brings one to life | India Ledger |
| `visual-investigation` | Footage, documents and maps on one shared clock; circled freeze-frames | India Ledger, Moat & Margin |
| `precise-mechanism` | A real machine in 3D, one colour per subsystem, cut open, running true | The Inventor Desk |
| `hardcore-info` | A 3D object traced live into a black-line technical drawing with leaders | The Inventor Desk |
| `security-xray` | Objects seen only as dual-energy airport X-ray images | The Inventor Desk (Shorts reveals) |
| `glass-product` | Refractive glass with dispersion, strip-light studio, caustics, cuts on the beat | Channel intros and stings, The Inventor Desk |

### Second tier

| Style | Look | Channel |
| --- | --- | --- |
| `halftone-dossier` | Retro printed case file: halftone dots, slammed stamps, huge headlines | India Ledger |
| `kino-montage` | Archive photos and documents as one ink-and-paper poster with a single red | India Ledger |
| `countdown` | Real footage of one event in real time, screen splitting as zero nears | Budget day, results day, launches |
| `transit-map` | Metro schematic on paper, drawn on by glowing pen tips | Indica Atlas |
| `lidar-survey` | Real airborne laser points condensing into a measured surface | Indica Atlas |
| `chalkboard` | Chalk on a blackboard | UPSC Mains (Hindi) |
| `whiteboard` | Whiteboard explainer | UPSC Mains (Hindi) |
| `sketchnote` | Visual notes | UPSC Mains (Hindi), Shorts |
| `pictogram-motion` | Beat-locked grid of pictograms and bold type | Shorts on any channel |

### Not kept (already covered by our samples)

Satellite Briefing (s01), Flow-field Wind Lines (s06), Exploded Teardown (s08), Blueprint (s09), Scale Zoom Explainer
(s12), the hand-drawn notes look (s14). Cartoons, games, picture books and horror styles don't fit our channels.

## Next

Suggested first builds, each as a new HyperFrames sample with a real dataset: `spreadsheet` (Moat & Margin),
`map-explainer` (Indica Atlas), `archive-lighttable` (India Ledger). Our Three.js is r184, new enough for
`glass-product`'s dispersion (needs r163+).

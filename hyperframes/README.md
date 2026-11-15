# HyperFrames visual library

Sixteen premium explainer visuals for Moat & Margin, Indica Atlas, Data Kadai, The Inventor Desk, Moat Atlas and UPSC Mains.
Each is a working HyperFrames project (HTML + GSAP, three.js where it is 3D) built on real data, so a new
video starts from the closest sample instead of a blank page. AK asked on 26 Oct 2026 to keep these and use them
in future videos. The contact sheet is `stills/contact-sheet.jpg`.

| # | Visual | Best for | Data in the sample | Folder |
| --- | --- | --- | --- | --- |
| 01 | Satellite before/after, wipe and measured label | Moat Atlas, Indica Atlas | Sentinel-2, Navi Mumbai airport site, Jan 2018 vs Jan 2026 | `samples/s01-satellite` |
| 02 | 3D terrain flyover with river and pins | Indica Atlas | AWS Terrain Tiles + Natural Earth rivers, Haridwar to Nanda Devi | `samples/s02-terrain` |
| 03 | Document on a desk: lit page, push-in, highlighter, quote card | Moat & Margin, Moat Atlas | Nomad letter, June 2004 (`public/letters/.../p34.png`) | `samples/s03-desk` |
| 04 | Money-flow breakdown with a zoom into the small pieces | Moat & Margin, Data Kadai | DMart, Jul–Sep 2026, split from the `dmartstory` video | `samples/s04-money` |
| 05 | Dot chart: 1,000 dots regroup | Data Kadai | Census of India 1951 and 2011 urban share | `samples/s05-dots` |
| 06 | Wind and flow map, particle trails | Indica Atlas | NOAA GFS 850 hPa, 15 Jul 2025 00 UTC | `samples/s06-wind` |
| 07 | Globe with arcs and a ranked list | Moat Atlas | India's top five crude suppliers, 2023 (ranking only) | `samples/s07-globe` |
| 08 | Exploded 3D object with labelled layers | The Inventor Desk | Generic smartphone built from primitives | `samples/s08-exploded` |
| 09 | Patent-style drawing that draws itself, then lights up | The Inventor Desk | Style sample: drawing redrawn, not an original sheet | `samples/s09-patent` |
| 10 | Still picture with depth (2.5D parallax) and falling leaves | Inventor Desk, Indica Atlas, Moat & Margin | Style sample: channel illustration (AI-generated) | `samples/s10-parallax` |
| 11 | Fly-through timeline in 3D space | Inventor Desk, Indica Atlas | Transistor 1947 to iPhone 2007 | `samples/s11-timeline` |
| 12 | Scale comparison with a log zoom-out | Data Kadai, Moat & Margin | ₹1 lakh crore in ₹500 notes ≈ 200 km (0.1 mm per note assumed) | `samples/s12-scale` |
| 13 | Big-type quote with the original line below | Moat & Margin | Nick Sleep, Nomad letter, June 2004 | `samples/s13-quote` |
| 14 | Hand-drawn notes over a real page | All five | Nomad letter, June 2006 (`p99.png`) | `samples/s14-notes` |
| 15 | 3D data map: states as lit prisms | Indica Atlas, Data Kadai | Lok Sabha seats by state (ECI) | `samples/s15-seatmap` |
| 16 | Process flowchart that builds step by step, then redraws itself as the hand-drawn exam version | UPSC Mains, any how-it-works beat | How an ordinary bill becomes law: Constitution Art. 100, 107, 108, 111, 368; the three joint sittings (1961, 1978, 2002) | `samples/s16-flow` |

`samples/cards` makes the numbered title cards for the selection reel.

## Use

Needs Node 22+ (HyperFrames runs through `npx hyperframes@0.8.202`), ffmpeg on the PATH and Python 3 with numpy and
Pillow. Renders go to `out/hyperframes/` (not in git).

```sh
python3 hyperframes/tools/hf.py sync              # copy shared/ and the linked public/ images into every sample (run first)
python3 hyperframes/tools/hf.py check 3           # lint, layout and contrast check (14 Nov 2026: s16 passes; s11 and s14 report errors under the current checker)
python3 hyperframes/tools/hf.py snap 3 1.5,6,9.5  # stills -> out/hyperframes/snap/s03-desk/
python3 hyperframes/tools/hf.py render 3          # -> out/hyperframes/s03-desk.mp4 (or: render all)
python3 hyperframes/tools/hf.py reel              # cards + every sample -> out/hyperframes/visual-samples-reel.mp4
```

Render speed on the cloud container (software GPU): about 1–2 minutes per 10 s for 2D samples, about 5 minutes for 3D
ones. A machine with a GPU is faster.

## Make a new visual from a sample

1. Copy the closest sample folder to `samples/<new id>/` and run `hf.py sync`.
2. Change the data, text and timing. Keep the pattern every sample uses:
   - `const H = HF.setup(seconds)` makes one linear GSAP clock; register it inline with `window.__timelines.main = H.tl`.
   - Draw everything in `H.render = (t) => { ... }` as a pure function of `t`. Do not read back styles that GSAP tweens
     set: the renderer seeks frames out of order, so they can be stale (this bit the first 3D map).
   - Call `H.ready()` once images, fonts and data have loaded.
   - Themes: `class="paper"` (Moat & Margin tan) or `class="night"` on `#root`. Shared classes: `.kicker`, `.head`, `.src`,
     `.cap`, plus `#vig` and `#grain` overlays. Fonts: Oswald, Inter, Playfair, Plex (mono), Caveat and Virgil (handwriting).
3. Run `hf.py check`, look at `hf.py snap` stills, then render.

`shared/lib/hf.js` holds the clock and easing helpers; `shared/base.css` holds the fonts and themes.

## Sample 16: the process flowchart

Made for the UPSC Mains channel (`docs/UPSC_MAINS_PLAYBOOK.md`), where most GS-II and GS-III answers need a flowchart. It
plays in two acts: the full chart builds box by box on a dark grid, with a gold token running along each arrow as it
draws, the decision diamond branching and a side panel with one real number; then an answer-booklet page slides up and
the same chart redraws itself in pen, simplified to what an aspirant can draw in 30 seconds.

- **Language:** `const LANG = "hi"` (the UPSC Mains channel) or `"en"`. All text is in the `T` table, one block per
  language. The Hindi labels need a native speaker's check before publishing, as with every Hindi piece (`AUDIO_TRACKS.md`).
- **New process:** edit `N` (boxes: id, x, y, width, appear time, class, content, optional height), `A` (arrows: points,
  start, duration, optional label), the diamond position `DX, DY, DT`, and the sketch tables `SK` (pen strokes) and `ST`
  (handwritten labels). Positions are in px on the 1920 × 1080 frame. `ok` and `out` box classes mark outcomes.
- **Facts on screen:** Art. 107(1)–(2), 100, 108 (joint sitting: rejection, final disagreement on amendments, or six
  months; majority of members of both Houses present and voting), 111 (assent, withhold, or return a non-Money Bill once;
  if passed again, assent cannot be withheld), and no joint sitting for Money Bills (Art. 108) or Constitution amendment
  bills (Art. 368). Joint sittings: Dowry Prohibition Bill (1961), Banking Service Commission (Repeal) Bill (1978),
  Prevention of Terrorism Bill (2002). **Check the joint-sitting years against Lok Sabha Secretariat records before
  publishing:** the three bills are agreed everywhere, but secondary sources differ on exact dates.
- Sketch labels use Mukta for Hindi (no Devanagari handwriting font is in the library yet) and Virgil for English.

## Data tools

All in `tools/`. Data downloads are cached in `out/hyperframes/cache/`. Each command below rebuilds the sample's committed data
byte for byte.

| Sample | Command |
| --- | --- |
| 01 | `s2_crop.py S2A_43QBB_20180118_0 18.995 73.075 13 a.png`, same for `S2C_43QBB_20260116_0`, then `s2_grade.py samples/s01-satellite/assets/img 1.6 a.png b.png` (rename to `nmia_2018.jpg`, `nmia_2026.jpg`). Needs `rasterio`. Find scenes by listing `sentinel-cogs.s3.us-west-2.amazonaws.com/?list-type=2&prefix=sentinel-s2-l2a-cogs/<zone>/<band>/<square>/<year>/<month>/` |
| 02 | `terrain_dem.py 29.4 31.6 77.6 80.4 samples/s02-terrain/assets/data/dem.js` |
| 06 | `gfs_wind.py 20250715 00 "850 mb" <india.geojson> samples/s06-wind/assets/data/wind.js`. Needs `eccodes` |
| 07 | `globe_dots.py samples/s07-globe/assets/data` |
| 10 | `depth_map.py public/vx/mf003-textile/img/mill_gate.jpeg samples/s10-parallax/assets/img/depth.png --vp 960,790 --sky 237,223,193` |
| 15 | `geo3d.py <india.geojson> tools/indica_map_beat.json samples/s15-seatmap/assets/geo3d.js` |

`<india.geojson>` is `geojson/india.geojson` from github.com/udit-001/india-maps-data (commit 2884453). It mixes 34
whole-state outlines with 726 districts; the tools use the state outline where one exists.

`vx2hf.py` converts a VoxEngine `public/vx/<id>/data.json` into a HyperFrames project (title, strips, counter, cards, clip
and map scenes so far), for testing a whole video in HyperFrames.

## Export story videos

`videos/` holds data-driven export videos built from one template (`videos/_template/index.html`) and a generated
`story.js` per video. `tools/export_videos.py` defines the videos (topic, channel, theme, title) and computes every
number from DGCIS trade data (principal commodity × destination country × Indian port, monthly, via the ODbL mirror
github.com/Vonter/india-export-import). Scenes: hook number, five-year growth, district map, exit ports on an
all-India map, destinations, end card. Themes: `atlas` (Indica Atlas, dark) and `kadai` (Data Kadai, warm white).

| Video | Channel | Story (FY 2025–26) |
| --- | --- | --- |
| `ia-poultry` | Indica Atlas | Poultry exports ₹2,810 crore, nearly double; 66% left via Kochi and Thoothukudi; UAE 37% |
| `ia-seafood` | Indica Atlas | Marine products ₹74,521 crore, +19%; Visakhapatnam 27%; USA 27%, China 18% |
| `ia-spices` | Indica Atlas | Spices ₹37,644 crore, flat; Kochi and Nhava Sheva 41%; USA 14%, China 12% |
| `dk-phones` | Data Kadai | Phones and telecom gear ₹3.03 lakh crore, +37%, 5.5× in four years; 69% flown from Chennai and Bengaluru; USA 58% |
| `dk-buffalo` | Data Kadai | Buffalo meat ₹45,196 crore, +31%; UP inland depots (Dadri, Kanpur) 54%; Vietnam 18% |
| `dk-growth` | Data Kadai | Fastest-growing exports over ₹20,000 crore: copper +67.5%, phones +36.7%, buffalo meat +31.4% … |

```sh
python3 hyperframes/tools/export_videos.py            # rebuild every story.js (downloads the mirror once, ~170 MB)
python3 hyperframes/tools/hf.py sync videos
python3 hyperframes/tools/hf.py render ia-poultry     # -> out/hyperframes/ia-poultry.mp4
```

**District map.** The mirror has no district of origin. Put DGCIS "Export by District of Origin" figures in
`out/hyperframes/cache/district_exports.csv` with columns `state,district,commodity,value_crore` (commodity spelled as
in DGCIS principal commodities, e.g. `POULTRY PRODUCTS`) and rebuild: the "Where it is made" scene appears, shading
districts on the 820-district map (`shared/geo/india_districts.js`, from `tools/india_districts.py`) with the top five
listed. Names are matched by state and name with `ALIAS` in `export_videos.py`; unmatched names are printed, never
guessed. Without the file the scene is left out. A missing district means no reported figure, not zero.

The videos are silent drafts with captions; voice-over comes from the normal build pipeline.

## Reveal Loop Shorts (vertical, 1080 × 1920)

`shorts/` holds the benchmark Shorts built in the Reveal Loop format (`docs/SHORTS_FORMAT.md`); scripts, sources and build
steps are in `docs/SHORTS_BENCHMARKS.md`. `tools/shorts_build.py` holds each script, voices the beats and writes
`story.js` (timings and captions); the page hangs every picture change on a spoken phrase, so it follows the voice.

| Short | Channel | Picture |
| --- | --- | --- |
| `ia-southtip` | Indica Atlas (English, India) | Deep zoom through shaded terrain (z6, z8, z11) into Sentinel-2: Kanyakumari to Indira Point |
| `um-parisiman` | UPSC Mains (Hindi) | 3D Lok Sabha seat map, people-per-MP dots, freeze timeline, the April 2026 vote |
| `ma-tsmc` | Moat Atlas (English, US) | Sentinel-2 before/after of TSMC Arizona, investment ladder, per-pixel globe |

```sh
python3 hyperframes/tools/shorts_build.py story all      # needs a MiniMax key; --no-tts estimates the timings
python3 hyperframes/tools/hf.py sync shorts
python3 hyperframes/tools/hf.py render ia-southtip        # then: shorts_build.py mux ia-southtip
```

Shared: `shared/shorts.css` (layout, caption band, safe areas; Teko and Mukta for Hindi), `shared/lib/shorts.js`,
`shared/geo/world_land.js` (Natural Earth 1:110m land). `tools/atlas_base.py <zoom> <west> <south> <east> <north> <out.jpg>`
makes a shaded-relief base map from AWS Terrain Tiles and prints its Mercator bounds for the page.

## Rules for using these in a published video

- Real data only, with the source on screen. Anything that is not real (a redrawn drawing, an illustration, a generic
  model) says so on screen, as samples 08, 09 and 10 do.
- Sentinel-2 imagery needs the line "Contains modified Copernicus Sentinel data <years>".
- India maps (samples 06 and 15) use community boundary data. Replace it with Survey of India boundaries before publishing.
- Moat & Margin: no target prices, valuations or buy, sell or hold calls.
- Check a figure before reusing it: sample 07's ranking comes from news reports of 2023 volumes; check it against
  commerce ministry data before publishing.
- The samples are silent. Voice, music and sound effects come from the normal build pipeline.
- Third-party code and font licences: `shared/licenses/`.

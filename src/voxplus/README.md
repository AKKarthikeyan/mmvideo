# Vox Motion+ kit (src/voxplus/)

Built 18 Oct 2026 for Moat & Margin's explainers (A01 "What Is a Moat?" first, then the Moat 60 series), after AK chose
O1 + the "$26 loom" story. The look is "a reporter's desk, filmed": real document pages with a yellow highlighter, cut-out
archive photos on paper, charts on black, big serif words, paper maps with pins. Not painted plates, not a slide deck.

Everything is deterministic (frame number in, picture out). World coordinates are 1920x1080 at camera scale 1.
Compositions: `VOXPLUS-demo` (28.2 s reel) and `VOXPLUS-catalog` (12 s, the cards). Mounted from `src/Root.tsx`
with one import and one tag (backup: `src/Root.tsx.bak1018_voxplus`).

Render: `npx remotion render src/index.ts VOXPLUS-demo out/voxplus/voxplus_demo_1080p.mp4` (inside `zsh -lic`).

## Files

| File | What |
|---|---|
| tokens.ts | colours `C`, fonts `F`, `W/H/FPS`, `V()` (staticFile under public/voxplus), easing (`outQuint`, `inOut`, `outBack`), `ease`, `lin`, `spr`, `step` (stepped paper motion), `shake` |
| fonts.ts | local @fontsource faces + `useVoxFonts()` (call once per composition; blocks the first frame until fonts load) |
| Texture.tsx | `PaperSurface`, `InkSurface`, `Grain`, `Vignette`, `Halftone`, `Finish` |
| Camera.tsx | `camAt`, `CamKey`, `camVel`, `Layer` (parallax + rack-focus blur), `DirBlur` (directional whip blur), `CameraRig` |
| Depth.tsx | 2.5D (21 Nov 2026): `cam3At`, `Stage`, `Plane` (one perspective camera: scale, parallax, depth of field and haze from each plane's height z), `LIGHT`, `Lifted`, `liftShadow`, `liftArc`, `Hinge`, `onTwos`, `drift`, `Boil`, `project`. Rules: `docs/storytelling/VOX_CRAFT.md` section 3. Sample: `VOXPLUS-depth` (DepthDemo.tsx) |
| Marker.tsx | `Highlight`, `MarkerCircle`, `MarkerUnderline`, `MarkerStrike`, `highlightEnd` |
| DocPage.tsx | `DocPage`, `docPoint`, `docRectCentre`, `pushToward` |
| Collage.tsx | `PhotoPrint`, `Sticker`, `StickerLabel`, `TornBlock`, `piecePose` (shared entrance/exit grammar) |
| Cards.tsx | `ChapterCard`, `PauseCard`, `HeadlineStack`, `SourceTag` |
| ChartBuild.tsx | `ChartBuild` (bars or line on black), `mix` |
| BigType.tsx | `BigWord`, `BigNumber`, `PriceTag`, `SubLine` |
| MapRoute.tsx | `MapRoute`, `useGeo`, `fitProjection`, `Pin`, `Route` |
| Transitions.tsx | presentations `whip`, `pushThrough`, `paperOver`, `matchZoom` + re-exported `fade`, `slide`, `wipe`, `TransitionSeries`, `linearTiming`, `springTiming` |
| Sound.tsx | `MusicBed` (ducking under voice spans), `SfxTrack` + named `SFX` cues |
| DemoReel.tsx, Catalog.tsx, Root.tsx | the two compositions |
| tools/ | asset prep: `letter_shot.py` (document excerpts from the official page + phrase rects), `ne_india.py` (map), `prep_media.py` (paper/grain tiles, photo toning, sticker cut-out), `fetch_br.py`, `fetch_html.py` |
| LICENSES.md | every package, image, sound and data source with licence and credit line |

## Components and props

All components take `f` = the local frame (from `useCurrentFrame()` inside a `Sequence`/`TransitionSeries.Sequence`).
Times (`at`, `enterAt`, ...) are local frames at 30 fps.

### 1. DocPage (real document on paper)
`<DocPage f src imgW imgH x y width rot? margin? enter? stack? focus? ink? highlights? circles? underlines? strikes?/>`
- `src` image under public/voxplus (make it with `tools/letter_shot.py URL OUT.png ANCHOR LINES_BEFORE LINES_AFTER PHRASE...`,
  which also writes OUT.json with each phrase's line rects in image pixels).
- `x, y, width`: centre and on-screen width of the text block in world px; `rot` -2..+2 deg; `margin` paper margin share (0.07).
- `enter: {at, mode: "slide-up" | "slide-right" | "slide-left" | "drop" | "flip", dur?}`.
- `stack`: 0-4 sheets behind (page-stack look). For a page flip between pages use `enter.mode = "flip"` on the new page.
- `highlights: [{rects, at, dur?, color?}]`: yellow wipe, one continuous stroke across the lines (dur = frames per line).
- `circles / underlines / strikes: [{rect, at, dur?, color?}]` marker overlays (red by default).
- `focus: {rect, at, blur?, dur?, feather?}`: rack focus; everything outside the band softens to `blur` px.
- Camera: aim with `docRectCentre(pageProps, rect)` and a `CamKey[]` push (example in DemoReel scene B/F).

### 2. Collage (cut-outs on textured paper)
- `<PhotoPrint f src x y w h rot? border? tape? halftone? darken? crop? enter? exit? caption?/>`: photo print with white
  border, tape, halftone dots and an inner drift `crop: {s0, s1, fx?, fy?, dur?}`.
- `<Sticker f src x y w h rot? bob? shadow? enter? exit?/>`: alpha PNG with a baked white border (make it with prep_media.py).
- `<StickerLabel f text x y size? rot? dark? enter? exit? anchor?/>`: white tag, black condensed caps (or `dark`).
- `<TornBlock f x y w h rot? color? seed? enter?/>`: torn colour paper (wall blue default).
- Entrance grammar (every piece): `enter: {at, mode: "slide" | "drop" | "pop" | "none", from?: [dx, dy], rot0?, dur?, stepped?}`
  (slide = blur 50 -> 0 with a small settle; `stepped: 2` = 15 fps paper motion on the smooth camera), `exit: {at, to?, dur?}`.
- Parallax: put pieces in `<Layer cam depth>` (background 0.8, pieces 1, labels 1.12-1.3).

### 3. HeadlineStack
`<HeadlineStack f clips={[{kicker, text, date?, at, style?: "news" | "quote"}]} x? y? w?/>`: clippings drop into a pile
with shake and shadow; older ones darken. Keep each text to a short verbatim quote with its source in `kicker`.

### 4. ChartBuild (on black)
`<ChartBuild f at? title source bars? line? max? prefix? suffix? titleColor? barColor? keyColor? circleKey? box? background?/>`
- `bars: [{label, value, key?, valueText?}]`: axis first, bars grow staggered (30 frames each, 9 apart), values count up,
  the `key` bar turns Vox yellow and gets a marker circle. `line: [{label, value}]` draws a line instead.
- `box: {x, y, w, h}` plot area. Keep the baseline above y = 860 so captions never collide.

### 5. BigNumber / BigWord / PriceTag
- `<BigWord f at text x y size? color? stagger? mark? markAt? italic? align? out? maxWidth?/>`: serif words arrive one at a
  time (slide up + de-blur); words in `mark` get a yellow box.
- `<BigNumber f at to from? dur? x y size? color? prefix? suffix? decimals? sub? slam?/>`: slam-in (scale 1.5 -> 1, blur,
  shake) and quartic count-up.
- `<PriceTag f enterAt x y values={[{text, at, crossAt?, stamp?}]} scale? string?/>`: manila tag on a string from pivot
  (x, y); drops in, swings, flips to each value, red marker cross-out at `crossAt`, `stamp` value slams on in red ink.
- `<SubLine f at text x y size? color?/>`: small unit/scope line under a number.

### 6. MapRoute
`const geo = useGeo(); <MapRoute f geo bbox? focus? focusFill? pins? routes? inkAt? pinScale? labelSize? credit?/>`
- Data: `public/voxplus/map/south_asia_ind.geojson` = Natural Earth 10m countries, **India point of view** (India's
  official boundary), rings oriented for d3. Build other regions with `tools/ne_india.py` (same POV file).
- `bbox [lonMin, latMin, lonMax, latMax]` fits the frame; `pins: [{lon, lat, at, label?, side?, color?}]` drop with a squash
  and a sticker label; `routes: [{from, to, at, dur?, bend?, color?}]` draw with an arrowhead; `inkAt` draws the focus outline.
- Fly-in: wrap in `<Layer cam>` with keys from wide (scale 0.6) to 1.0. **Check every India map by eye before use.**

### 7. ChapterCard / PauseCard / SourceTag / highlighter overlays
- `<ChapterCard f n word kicker? at?/>`: cream, italic kicker (keep 4 words or fewer), "Chapter N:", huge serif word sliding up
  from a mask, yellow underline wipe, faint drifting icon grid.
- `<PauseCard f term note? icon? at?/>`: "|| PAUSE" (bars blink), term typed in marker, italic note, optional cut-out icon.
- `<SourceTag f at text until? dark? pos?: "tl" | "bl" | "br"/>`: the small source chip (never in the caption band).
- Highlighter/marker overlays are in Marker.tsx and can be used in any `<svg>` (coordinates = that svg's space).

### 8. Camera on 2D
- `camAt(f, keys)` with `CamKey = [frame, scale, x, y, easing?, roll?]` (geometric zoom interpolation).
- `<Layer cam depth blur>`: parallax depth (<1 farther, >1 nearer) and rack focus.
- Whip pans and fast slides: `<DirBlur bx by>` (true directional smear) or `CameraRig` (blur from camera speed).
- Transitions (`TransitionSeries.Transition presentation=`): `whip(dir)`, `pushThrough(x, y, scale, blur)` (fast push into a
  point, e.g. a circled word), `paperOver(dir)` (next scene arrives as a sheet), `matchZoom(x, y)` (match cut), plus `fade`,
  `slide`, `wipe`. `@remotion/motion-blur` is installed for `CameraMotionBlur`/`Trail` but costs N x render time.
- Camera rules (from v3 TECH_PLAN): vary moves; no 3 push-ins in a row; at most ~8 push-ins a minute in a full film.

### 9. Texture, colour, type
- `<PaperSurface tone="cream" | "kraft" drift? tint? bleed?/>` (bleeds 1200 px so parallax never shows an edge),
  `<InkSurface glow?/>`, `<Finish f grain? vignette? dark?/>` (grain + vignette, put last), `<Halftone/>`.
- Colour tokens `C`: paper #F3EEE3, ink #0E0E0E, highlight #FFF200, wallBlue #1F3BD6, chartBlue #2A3FD1,
  magenta #E6007E, markerRed #E0245E, map land/water/focus.
- Fonts `F`: DM Serif Display (OFL) headlines and numbers, Inter (OFL) stickers/labels, IBM Plex Mono (OFL) sources,
  Permanent Marker (Apache 2.0) handwriting. Checked with fontTools: DM Serif Display has NO ₹ glyph (U+20B9); Inter
  has it. Until a serif with ₹ is added, set ₹ figures as `prefix` in Inter or pick a serif that covers it.

### 10. Sound
- `<MusicBed src total voice? duck? open? fadeIn? fadeOut? startFrom?/>`: the a01v3 ducking curve: `duck` (0.2, about
  -30 LUFS for our beds) under each voice span `[start, end]`, opening to `open` in gaps of 1.5 s or more.
- `<SfxTrack cues={[[frame, name, gain?]]}/>` with `SFX` names: paper, highlighter, circle, stamp, click, whoosh,
  whooshDeep, pop, ding (all CC0, see LICENSES.md). In a narrated film keep to about one SFX every 10 s.

## On-screen text rules used
At most 4 words per element except document pages; every number shows its source; figures only from the shown document.

# Look B for the UPSC monsoon film: contract for scene builders (3 Nov 2026)

AK picked **look B, rich daylight illustration**, on 3 Nov 2026, after calling the cartoon look "simple childish". The approved sample is the
three scenes in this folder (`s001.tsx` rooftop, `s022.tsx` trade-wind map, `s038.tsx` the peak split) with the shared kit (`kit.tsx`, `map.tsx`,
`girl.tsx`). Render them (`npx remotion still src/looks/upsc_rich_b/index.tsx RICH-B-s001 <png> --frame=400`) and match that look exactly.
The comparison sheet AK chose from: `out/upsc/looks/compare_A_B.png` (bottom row).

## The film
- Composition `LONG-geo07-p1-B` (30 fps, for stills) and `LONG-geo07-p1-B60` (60 fps, the real one), player `RichLong.tsx`, registry `registry.ts`.
- Timeline `public/datayt/long/upsc/geo07-p1/timeline.json`, storyboard `storyboard.json`: 55 scenes. **Same kinds and spec fields as the
  cartoon film** (read `src/looks/cartoon/long/CONTRACT_UPSC.md` for every field). Never edit the storyboard, timeline or narration.
- Props `{f, dur, spec, at, draft}`. `f` is a 30 fps logical frame and is fractional at 60 fps: all motion must be smooth functions of `f`.

## The look
- Depth layers: far layers paler and bluer (haze), near layers warm and saturated; slow camera drift and parallax.
- Light: warm sun, cool shade, long soft shadows; paper grain and a light vignette (`PaperFinish`).
- Thin coloured outlines (never thick black), soft gradients, detailed environments.
- People with realistic proportions: the girl from `girl.tsx` (no big heads, no dot eyes). Other adults may appear in the same style.
- Type: Newsreader serif for headlines and big numbers, Schibsted sans for labels (`SERIF`, `SANS` from `kit.tsx`). Cards are warm paper
  cards (`cardStyle`), pills from `Pill`.
- Maps: atlas style from `map.tsx` (relief land, depth-tinted sea, coastal shelf, wave texture, graticule, serif place labels). **India must
  appear whole whenever it is on a map**: no crop of the north (Ladakh, Jammu and Kashmir) or of the Andaman and Nicobar Islands and Lakshadweep.
  Geography only from `public/datayt/long/upsc/basemap.json` (Natural Earth, India's official view). The sample `s022` crops India's north:
  fix that framing.

## Unchanged rules
- Numbers from `fig()`, quantities as text from `lab()` (`src/looks/cartoon/long/figs.ts`); never type a figure. Each keyed item appears only
  from `at(key)`. A missing key throws.
- `chip` (ANALOGY, ILLUSTRATION) shown as a small pill for the whole scene; `limit` shown as "Where the picture stops: …".
- Citations are text cards; never show NCERT pages. Text inside x 96-1824, y 64-920 (the draft caption strip sits below 930). Keep clear of the
  brand bug at the top right (x > 1560, y < 118).
- No photos, no AI art, no copied characters or logos.

## Ownership (to avoid two builders editing one file)
- `kit.tsx`: read-only for everyone. Put helpers in your own files named after your kind (`scenes/windmap_*.tsx`).
- `map.tsx`: owned by the windmap builder (others import it read-only). `girl.tsx`: owned by the stage builder (it adds poses: idle, present,
  point, cheer, worried, and a writing pose for the notebook; others import it read-only).
- Each builder replaces only its own placeholders in `scenes/`.

## Checks
Render stills of each of your scenes at start, middle and end with
`npx remotion still src/index.ts LONG-geo07-p1-B out/upsc/looksB/<kind>_<scene>_<frame>.png --frame=<frame> --scale=0.6667`
(frames from `timeline.json`: a scene runs from `from` to `from + dur`), open each with the Read tool, and fix what is wrong: anything below the
sample's richness, text outside the box or under the brand bug, overlaps, a label before its reveal, a cropped India, unreadable type.
Then render one 2-second stretch of one scene at 60 fps (`LONG-geo07-p1-B60`, `npx remotion render ... --frames=a-b`) to confirm smooth motion.

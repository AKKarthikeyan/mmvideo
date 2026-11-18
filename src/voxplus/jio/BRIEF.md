# Jio IPO review film in VoxPlus: shared brief for every builder (20 Oct 2026)

Owner: AK (Moat & Margin). The approved script and the recorded voice stay exactly as they are; you build the PICTURES.
All work is on the Mac Mini: run commands through `ssh mini-ts '...'`. Repo: /Volumes/DarwinSSD/MMVideo (Remotion 4).
Node/npx need `export PATH=/opt/homebrew/bin:$PATH`; the system python with fitz/PIL is `/usr/bin/python3`.

## The look (non-negotiable)
Match A01 v4, "What Is a Moat? The $26 Loom" (src/voxplus/A01V4Film.tsx, A01V4Parts.tsx, A01V4Cold.tsx; kit README at
src/voxplus/README.md, which you must read first). AK's words: "a reporter's desk, filmed": real document pages with a yellow
highlighter, cut-out real photos on paper, charts on black, big serif numbers, paper India maps with pins, a moving camera
(push-ins, glides, rack focus), whip and paper transitions. AK rejected flat 2D cartoon icons as "cheap": do NOT build
scenes out of cartoon shop/stack/castle icons. Icons only as small accents. Prefer, in this order: real RHP/filing pages
(DocPage + highlighter), real photos (PhotoPrint/Sticker), charts on black (ChartBuild / TwoBars), BigNumber/BigWord/
PriceTag, MapRoute, ChapterCard. Cut a new shot every ~3-5 s (A01 averages 2-5 shots per beat). Vary camera moves (no 3
push-ins in a row). Every number on screen shows its source in a SourceTag chip (e.g. "Jio RHP p.131 · FY26").
At most 4 words per on-screen element except document pages.

## Files you own and must not exceed
- Your chapter file(s) `src/voxplus/jio/chN.tsx` (export `SHOTSN: Shot[]` and `CUESN: SCue[]`; keep those names). Replace the
  placeholder. You may add `src/voxplus/jio/partsN.tsx` for helpers of your own.
- Assets you create under `public/voxplus/jio/docs/` (prefix files with your chapter, e.g. `ch3_trai_table.png`).
- DO NOT edit anything else: not A01 files, not tokens/Camera/Collage/etc., not kit.tsx/JioFilm.tsx/jioTiming.ts/Root.tsx,
  not other chapters, not src/Root.tsx, not vx_scripts.py, not the ledger, no git. If you need a kit change, write a local
  variant in your partsN.tsx.

## Timing API (src/voxplus/jio/kit.tsx)
- `S(beat, x, tr, Component)` makes a shot that CUTS IN at beat start + x, where x is seconds (number) or a spoken phrase
  ("BSNL, nine" or "BSNL, nine|-0.3"). The first shot of each beat should normally cut at 0 (or a phrase in the first second).
  Shots of all chapters are merged and sorted by cut time; a shot runs until the next shot's cut.
- Inside a shot component `({s0, d}) => {const f = useTicks(), a = useAt(s0); ...}`: `a("q31", "Airtel, forty nine")`
  = local tick (30 per second) when that phrase is spoken. Cue every number/highlight to the word that says it.
- Transitions: H0 (hard cut), WL/WR/WU/WD (whip), PU/PL (paper over), MZ (match zoom), PUSH(x,y).
- Word times are in src/voxplus/jio/jioTiming.ts (WORDS[beat] = [word, start, end] seconds into the beat). BEAT/DUR/SAY too.
- Sound: add a few SFX cues per chapter in `CUESN` as `[filmSeconds, name, gain]` using W(beat, phrase) from kit.tsx
  (names: paper, highlighter, circle, stamp, click, whoosh, whooshDeep, pop, ding). About one SFX per 10 s.

## Sources and assets
- Jio RHP PDF: /Users/akkarthikeyan/Documents/research_notes/jio_moat/rhp/jio_cdn_rhp.pdf (PDF page index = printed page - 1;
  verify by eye). Other source PDFs: /Users/akkarthikeyan/Documents/research_notes/jio_moat/ (industry_trai/, peers_airtel/,
  peers_vodafone_idea/, industry_analysys_mason/). The source key is in
  ~/Documents/research_notes/jio_moat/video_handoff/research_script_with_citations.md.
- Real document excerpt for DocPage: `/usr/bin/python3 scripts/voxplus/rhp_shot.py PDF PAGE_INDEX|-1 OUT.png "ANCHOR" LINES_BEFORE LINES_AFTER "PHRASE" ...`
  writes OUT.png (3x) + OUT.json {w, h, rects: {phrase: [[x,y,w,h],...]}} (image px). Use with
  `<DocPage f src="jio/docs/..png" imgW imgH x y width highlights=[{rects, at}] .../>` (src is relative to public/voxplus/).
  Only show text that supports what is said; the six RHP passages already used in the Vox version are the anchors in the
  `CLIPS` dict at the top of scripts/build_vx.py (keys jio_*).
- Real photos: a photo builder is sourcing licensed photos into `public/voxplus/jio/media/` with a manifest
  `public/voxplus/jio/media/MEDIA.md` (file, what it shows, licence, credit). Check MEDIA.md when you start and again before
  you finish; use what fits your beats (PhotoPrint with tape/halftone, or Sticker cut-outs). If nothing fits yet, build the
  shot from documents/charts/type rather than cartoons, and note which photo would help in your report.
- India map: MapRoute with public/voxplus/map/south_asia_ind.geojson (Natural Earth, India point of view). Check every India
  map by eye.
- Fonts: DM Serif Display has NO ₹ glyph. Set ₹ in Inter (e.g. BigNumber `prefix` styled in Inter, or a StickerLabel), never
  in the serif.

## Content rules (break none)
1. The narration (SAY) is fixed. Never change words, beats or order.
2. Numbers on screen: only figures that already appear in the ledger `scripts/ledger/jioipo.csv` for your beats (read it), or
   are spoken in your beat. No new facts. Keep the labels "our arithmetic", "reported", "industry report Jio paid for" where
   the figure is ours/press/Jio-paid.
3. SEBI rule: no price band, valuation, P/E, grey-market premium, or apply / avoid / subscribe / listing gain wording.
4. No company logos. Brand names as plain text labels only. Photos must not show logos or readable brand signage, and no
   identifiable private person as the subject (crowds/hands/backs are fine).

## Check your work (required)
- Type-check: `npx tsc --noEmit -p . 2>&1 | grep voxplus/jio` must be empty.
- Stills: `node scripts/voxplus/jio_stills.mjs out/voxplus/jio_qa/chN q31@0.5 q31@3.2 q31@BSNL ...` (beat@seconds or
  beat@first-word-of-phrase; renders at half size). Look at a still for EVERY shot (open the jpegs with your image viewer /
  Read tool) and fix overlaps, cut-off text, empty frames, unreadable numbers, numbers that never finish counting before the
  next cut, captions colliding with the bottom 15% of the frame.
- Report: shot list per beat (cut time, what's on screen, source chip), assets you created, which stills you checked, open
  issues. Keep it short.

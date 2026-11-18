# "Jio's Size Advantage Has a Catch": shared brief for scene builders (20 Oct 2026)

Owner: AK (Moat & Margin). AK wrote the script, including precise PICTURE / SCREEN / EDIT directions per scene:
`/Volumes/DarwinSSD/MMVideo/scripts/voxplus/SCRIPT_jio_size_catch_20oct.md`. READ IT FIRST, especially "Visual system and asset brief"
and "Source and calculation handoff". Your scene must follow its PICTURE/SCREEN/EDIT lines; where this brief and the script
differ, the script wins. The narration is voiced and FINAL (never change words).

Work on the Mac Mini through `ssh mini-ts '...'`. Repo /Volumes/DarwinSSD/MMVideo (Remotion 4). Node needs
`export PATH=/opt/homebrew/bin:$PATH`; system python with fitz/PIL is `/usr/bin/python3`.

## Look (AK's brief, binding)
Themed VoxPlus kit in `src/voxplus/scale/kit/` (a copy of src/voxplus with AK's palette and ONE sans, Inter 800 + 600).
Import kit pieces ONLY from `./kit/...` (never from `../`), so the theme applies. Palette tokens: C.paper (warm off-white),
C.ink (charcoal), C.teal (muted teal), C.rust, C.highlight (light-teal highlighter), C.grey, C.white. No yellow, no Vox branding,
no serif. Direct labels, zero-based bars, explicit units/periods/entity scopes, no invented intermediate points, no
paragraphs on screen. Real report pages -> crop -> highlight for document shots (never a fabricated page). Restrained
motion: introduce a visual when the explanation needs it, hold completed charts so they can be read (5-8 s for a
report highlight). Avoid constant whooshes; about one SFX per 10 s. Label schematic animations "Illustration".
Study `src/voxplus/scale/sc01.tsx` and `sc02.tsx` (built by me): match their style, framing, chips and type sizes.

## Recurring devices (use these, don't redraw them): `src/voxplus/scale/devices.tsx`
RechargePhone (generic recharge screen, tap Pay -> Paid), PaymentMarker (teal Rs token along a path), Network/makeNet +
`NET` from sc01 (the same network everywhere), CashCalendar (paper calendar "Cash payments": conceptual, no years/amounts),
DotGrid (1,000 dots, `hi` highlighted then fading), Bridge (per-Rs-100 waterfall on charcoal). Scene 04 introduces the cash
calendar; scenes 10-11 bring back THE SAME calendar graphic (same props/position) and scene 12 returns to the phone.

## Files you own
Only your `src/voxplus/scale/scNN.tsx` (keep the exports `SHOTSNN: Shot[]` and `CUESNN: SCue[]`), optional
`src/voxplus/scale/partsNN.tsx`, and assets in `public/voxplus/scale/docs/scNN_*`. Do not edit devices.tsx, cue.tsx,
Film.tsx, scaleTiming.ts, kit/, other scenes, src/Root.tsx, src/voxplus outside scale/, the ledger, or git. Need a device
change? Make a local variant in your partsNN.tsx and say so in your report.

## Timing API: `src/voxplus/scale/cue.tsx`
`S(beat, x, tr, Component)`: a shot that cuts in at beat start + x (seconds, or a spoken phrase, "phrase|-0.2" offsets).
Beats are paragraphs: s03p1, s03p2, ... (see ORDER/SAY/WORDS in scaleTiming.ts). Inside a shot:
`const f = useTicks(), a = useAt(s0); a("s03p2", "one hundred and fifty")` = local tick (30/s) when the phrase is spoken.
Cue numbers and highlights to the words that say them. Transitions H0, WL/WR/WU/WD, PU/PL, MZ, PUSH(x,y). SFX in CUESNN as
`[W(beat, phrase), name, gain]`. Shots of all scenes merge and sort by cut time; a shot runs until the next cut, so your first
shot should cut at your scene's first beat start (x = 0).

## Sources and assets
- Real document excerpts: `/usr/bin/python3 scripts/voxplus/rhp_shot.py PDF PAGE_INDEX|-1 OUT.png "ANCHOR" LINES_BEFORE LINES_AFTER "PHRASE" ...`
  -> OUT.png (3x) + OUT.json {w, h, rects: {phrase: [[x,y,w,h],...]}}. Use with
  `<DocPage f src="scale/docs/..png" imgW imgH x y width highlights=[{rects, at}] .../>` (src relative to public/voxplus/).
  For table cells, crop with fitz directly (see how scripts/voxplus/rhp_shot.py works). Crop tightly; look at every crop.
- PDFs: Jio RHP `/Users/akkarthikeyan/Documents/research_notes/jio_moat/rhp/jio_cdn_rhp.pdf` (PDF page index = printed page - 1, check by
  eye); others under `/Users/akkarthikeyan/Documents/research_notes/jio_moat/` (industry_trai/, peers_airtel/, peers_vodafone_idea/,
  industry_analysys_mason/). Source key and page refs: `~/Documents/research_notes/jio_moat/video_handoff/research_script_with_citations.md`;
  figures and pages per claim: ledger `/Volumes/DarwinSSD/MMVideo/scripts/ledger/jioipo.csv` (old beat keys; search by value).
  Existing real crops you may reuse: `public/voxplus/jio/docs/*.png` (+ .json); the six RHP passages are the `jio_*` anchors in the
  CLIPS dict at the top of scripts/build_vx.py.
- Photos: `public/voxplus/jio/media/` with MEDIA.md (NAME.jpg, NAME_print.jpg, some NAME_sticker.png). Use only CC0 / public
  domain / CC BY rows; NEVER files marked BY-SA; don't caption non-India photos as India; skip crowd_phones_row; no banknote
  close-ups. Use photos where they establish the real system (towers, fibre, phones); they must not replace explanatory graphics.
  src for PhotoPrint is relative to public/voxplus, e.g. "jio/media/tower_in_sunset_print.jpg".
- India map: MapRoute from ./kit/MapRoute (public/voxplus/map/south_asia_ind.geojson, India point of view), focusFill "#DCE8E4".

## Content rules
1. Narration fixed. On-screen figures only from the script's SCREEN/PICTURE lines or ledger rows for the same claim; if a
   figure you want isn't in the script or ledger, leave it out. Mark our calculations "our calculation".
2. No IPO details on screen (no dates of bidding, price band, issue size, ownership, application language). No valuation.
3. No logos; brand names as plain text labels only.
4. Tone: no "hidden debt", "exposed", warning sirens or red stamps for dependencies (scene 09 neutral colours).

## Check your work (required)
- `npx tsc --noEmit -p . 2>&1 | grep voxplus/scale` must be empty.
- Stills: `node scripts/voxplus/scale_stills.mjs out/voxplus/scale_qa/scNN s05p1@0.5 s05p1@4.0 s05p2@power ...` (beat@seconds or
  beat@first-word). Batch all specs in ONE call (each call bundles ~1 min). Open every jpeg (Read tool) and fix: overlaps, cut-off
  text, empty frames, unreadable numbers, counts not finished before the next cut, anything in the bottom 12% (subtitle zone).
- Report briefly: shots per beat (cut, what's on screen, source chip), assets/photos used, stills checked, open issues.

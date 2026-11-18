# Jio moat Shorts (9:16): brief for builders (20 Oct 2026)

AK approved five Shorts, one per kind of moat (low cost, a trusted name, hard to leave, a crowd, a licence), each testing Jio.
Scripts (SAY + SCREEN lines): `src/voxplus/scale/SHORTS_and_SOCIAL.md`. Voice is recorded and FINAL:
public/voxplus/scale/shorts/vo/shN.mp3; word times in src/voxplus/scale/shorts/shortsTiming.ts (WORDS.shN).
Work on the Mac Mini via `ssh mini-ts '...'`; repo /Volumes/DarwinSSD/MMVideo; node needs `export PATH=/opt/homebrew/bin:$PATH`.

## Look: the film's original VoxPlus look, vertical
Same kit as the film: import ONLY from `../kit/...` (DM Serif Display big type, Vox yellow highlighter C.highlight, black ink,
cream paper, Vox blue C.teal, marker red C.rust), plus `../devices` (EntityTag + ENTITY, RechargePhone, DotGrid, CashCalendar,
PaymentMarker). Study the film's scenes for style: `src/voxplus/scale/sc03.tsx sc05.tsx sc06.tsx sc07.tsx sc08.tsx sc12.tsx`
(their stills are in out/voxplus/scale_qa/). Frame is 1080x1920.

## Framework (done, don't edit): `src/voxplus/scale/shorts/`
- `frame.tsx`: `VFrame` (use it as each shot's root: paper/ink + gentle zoom + grain; DON'T use the kit's Desk, it's 16:9),
  `VSource` (source chip under the header), and `ShortFilm` (adds the series header at the top, word-highlight captions at
  y 1440-1560, the end card, voice, music). So keep your content between y = 200 and y = 1400, and 60 px side margins.
- `cue.tsx`: `S("shN", x, transition, Component)` cuts a shot at x = seconds into the voice or a spoken phrase ("phrase|-0.2").
  Inside a shot: `const f = useTicks(), a = useAt("shN", s0); a("two hundred and forty")` = local tick (30/s) of that phrase.
- Your file: `src/voxplus/scale/shorts/shN.tsx` exporting `SHOTS_SHN` and `CUES_SHN` (keep the names). Optional `partsN.tsx`.

## Rules
1. One dominant image per moment, big enough for a phone: numbers 120 px+, labels 34 px+; EntityTag beside every figure
   (e.g. RJIL · TELECOM COMPANY | EXIT QUARTER FY26); VSource with the source page on every shot that shows a figure.
2. Follow the Short's SCREEN lines; cut every 3-5 s; first shot cuts at 0; every shot shows a meaningful element from its first
   frame (no empty frames). The first shot is the moat card ("LOW COST?" etc.) so the hook is visible at once.
3. Each Short ends on its verdict stamp (kit `Stamp`) before the end card takes over.
4. Figures only from the script (all are in scripts/ledger/jioscale.csv). No logos, no faces, no IPO price/valuation/advice.
   Photos: public/voxplus/jio/media (MEDIA.md), CC0 / public domain / CC BY only, never BY-SA; credit in VSource.
   Real document crops you may reuse: public/voxplus/scale/docs/*.png (+ .json rects) - only if readable at 1080 wide.
5. SFX: 2-3 cues per Short in CUES_SHN as [W("shN", phrase), name, gain] (names: paper, highlighter, circle, stamp, click, whoosh, pop, ding).

## Check (required)
- `npx tsc --noEmit -p . 2>&1 | grep voxplus/scale/shorts` empty.
- Stills: `npx remotion still src/voxplus/scale/shorts/index.ts SHORT-shN out/voxplus/scale/shorts_qa/shN_<sec>.png --frame=<sec*60> --scale=0.5`
  for every shot (and 0.1 s after each cut); open each PNG and fix overlaps, cut-off text, empty frames, captions colliding.
- Report: shots (cut, what's on screen, source), stills checked, issues.

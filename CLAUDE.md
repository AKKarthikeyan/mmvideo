# Notes for Claude sessions in MMVideo

- Start with `README.md`: what each engine area is, who edits which files, and what stays out of git.
- Premium explainer visuals live in `hyperframes/` (see `hyperframes/README.md`). When a video needs a satellite
  before/after, terrain flyover, document close-up, money breakdown, dot chart, flow map, globe, exploded object,
  patent drawing, photo with depth, timeline, scale comparison, big quote, hand-drawn notes or a 3D data map, start
  from the matching sample there instead of building from scratch. AK asked for this on 26 Oct 2026.
- "Paper craft" is AK's name (12 Nov 2026) for layered paper, quilling or clay-relief scenes drawn and animated in code.
  Start from `hyperframes/samples/s16-papercraft` (engine `hyperframes/shared/lib/papercraft.js`, scenes in the
  sample's `scenes.js`; see the Paper craft section of `hyperframes/README.md`; Short example: `hyperframes/shorts/dk-onion`).
  It uses no image files. Label it on screen as an illustration.
- Run `python3 hyperframes/tools/hf.py sync` before checking or rendering a sample; renders go to `out/hyperframes/`.
- Every visual uses real data with its source on screen; anything illustrative is labelled as such on screen.
- Every Short is built in the Reveal Loop format, `docs/SHORTS_FORMAT.md` (topic test, beat sheet, series per channel).
  The benchmark Shorts to copy from are in `hyperframes/shorts/` (`docs/SHORTS_BENCHMARKS.md`; build with
  `hyperframes/tools/shorts_build.py`).
- Shorts and Reels on every channel follow `docs/SHORTS_RULES.md` (AK, 10 Nov 2026; fact-check behind it in
  `docs/SHORTS_FACTCHECK.md`). Write each Short as its own loop script, never a cut-down of long-video beats, and run
  `python3 scripts/shorts_check.py <id>` after the build: fix every FAIL before rendering.

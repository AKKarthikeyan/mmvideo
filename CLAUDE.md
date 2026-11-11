# Notes for Claude sessions in MMVideo

- Start with `README.md`: what each engine area is, who edits which files, and what stays out of git.
- Scripts share two modules: `scripts/mm.py` (where files live, how many frames a beat holds, captions, chapters) and
  `scripts/minimax.py` (voice and pictures). Import from them; do not paste a timing sum, an SRT writer, a MiniMax call or
  the checkout's path into a new script. A new napkin Short goes into `scripts/hand.py`, a carousel into
  `scripts/carousels.py`, a thumbnail set into `scripts/thumbs.py`; an upload kit comes from `scripts/package_story.py`.
  On the player side the napkin Shorts share `HandShort` in `src/handkit.tsx`, and The Moat Files run on `VoxEngine.tsx`.
- Premium explainer visuals live in `hyperframes/` (see `hyperframes/README.md`). When a video needs a satellite
  before/after, terrain flyover, document close-up, money breakdown, dot chart, flow map, globe, exploded object,
  patent drawing, photo with depth, timeline, scale comparison, big quote, hand-drawn notes or a 3D data map, start
  from the matching sample there instead of building from scratch. AK asked for this on 26 Oct 2026.
- Run `python3 hyperframes/tools/hf.py sync` before checking or rendering a sample; renders go to `out/hyperframes/`.
- Every visual uses real data with its source on screen; anything illustrative is labelled as such on screen.
- Every Short is built in the Reveal Loop format, `docs/SHORTS_FORMAT.md` (topic test, beat sheet, series per channel).
  The benchmark Shorts to copy from are in `hyperframes/shorts/` (`docs/SHORTS_BENCHMARKS.md`; build with
  `hyperframes/tools/shorts_build.py`).
- Shorts and Reels on every channel follow `docs/SHORTS_RULES.md` (AK, 10 Nov 2026; fact-check behind it in
  `docs/SHORTS_FACTCHECK.md`). Write each Short as its own loop script, never a cut-down of long-video beats, and run
  `python3 scripts/shorts_check.py <id>` after the build: fix every FAIL before rendering.

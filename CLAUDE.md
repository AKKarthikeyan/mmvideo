# Notes for Claude sessions in MMVideo

- Start with `README.md`: what each engine area is, who edits which files, and what stays out of git. On the Mac Mini,
  read `docs/HANDOFF_MAC_MINI.md` first: setup steps, where the India Ledger gold episode stands, and the open decisions.
- Premium explainer visuals live in `hyperframes/` (see `hyperframes/README.md`). When a video needs a satellite
  before/after, terrain flyover, document close-up, money breakdown, dot chart, flow map, globe, exploded object,
  patent drawing, photo with depth, timeline, scale comparison, big quote, hand-drawn notes or a 3D data map, start
  from the matching sample there instead of building from scratch. AK asked for this on 26 Oct 2026.
- Run `python3 hyperframes/tools/hf.py sync` before checking or rendering a sample; renders go to `out/hyperframes/`.
- Every visual uses real data with its source on screen; anything illustrative is labelled as such on screen.
- Every long video and Vox+ film follows `docs/DIRECTOR.md` (AK, 22 Nov 2026): one director per film, a treatment
  and an animatic that AK reviews before narration is locked, a sound plan, and a full-speed review before delivery.
  Research behind it: `docs/DIRECTION_RESEARCH.md`.
- Every Short is built in the Reveal Loop format, `docs/SHORTS_FORMAT.md` (topic test, beat sheet, series per channel).
  The benchmark Shorts to copy from are in `hyperframes/shorts/` (`docs/SHORTS_BENCHMARKS.md`; build with
  `hyperframes/tools/shorts_build.py`).
- Shorts and Reels on every channel follow `docs/SHORTS_RULES.md` (AK, 10 Nov 2026; fact-check behind it in
  `docs/SHORTS_FACTCHECK.md`). Write each Short as its own loop script, never a cut-down of long-video beats, and run
  `python3 scripts/shorts_check.py <id>` after the build: fix every FAIL before rendering.
- Motion design: the LottieFiles motion-design skill is installed at `.claude/skills/motion-design` (MIT, unmodified;
  AK, 18 Nov 2026). Use it for timing, easing, choreography and the 12 principles. Ignore its "Creator MCP" handoff: our
  MP4s are rendered by HyperFrames or Remotion. Optional libraries (Tweakpane, three.quarks, lottie-web) are in
  `hyperframes/shared/vendor/`; the Manim trial is `scripts/manim/` (`docs/TOOLS_RADAR.md`).
- Machines (AK, 18 Nov 2026): all video production (renders, voice, installs, media files, past and future) lives on
  the **Mac Mini** only, not on the MacBook Air and not in cloud sessions. Always name the machine ("Mac Mini" or
  "MacBook Air"); never write just "Mac". The Mac Mini runs on a different Claude account from the cloud sessions.

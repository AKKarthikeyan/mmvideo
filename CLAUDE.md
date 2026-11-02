# Notes for Claude sessions in MMVideo

- Start with `README.md`: what each engine area is, who edits which files, and what stays out of git.
- Premium explainer visuals live in `hyperframes/` (see `hyperframes/README.md`). When a video needs a satellite
  before/after, terrain flyover, document close-up, money breakdown, dot chart, flow map, globe, exploded object,
  patent drawing, photo with depth, timeline, scale comparison, big quote, hand-drawn notes or a 3D data map, start
  from the matching sample there instead of building from scratch. AK asked for this on 26 Oct 2026.
- Run `python3 hyperframes/tools/hf.py sync` before checking or rendering a sample; renders go to `out/hyperframes/`.
- Every visual uses real data with its source on screen; anything illustrative is labelled as such on screen.
- Storytelling: every new script (long video, Short, Reel) follows `docs/STORYTELLING.md`. AK set these on 2 Nov 2026
  and they replace all earlier storytelling rules, including the 11 Oct "question by 0:05, a hook every 45 s".
  Declare `V["story"]` in the video's entry and run `python3 scripts/story_check.py <id>` before building the voice.
  `scripts/hook_check.py` is retired. The `/story <topic | video id>` skill does all of this in one step.

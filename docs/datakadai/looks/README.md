# Premium looks for data-story Shorts (research 25 Oct 2026)

AK, 25 Oct 2026: "Map video can be use our existing Visual. But New Data based story should have new premiun 2-3 looks
otherwise all vidoes looks Templated." Then, 26 Oct: "ok save this. We can use this for Indica Atlas Also."

- `LOOKS_SPEC.md`: scores, the three chosen looks (Slab, Counter, Dispatch) with beat designs, storyboards for `gd01` and
  `cw01`, dependencies, rejected options, the resource shortlist, and the completeness critic's gaps.
- Prototype code, frames and clips, and the full machine result: `/Volumes/DarwinSSD/DataKadai/research/2026-10-25-looks/`
  (not in git; about 450 MB).
- Status: researched and prototyped only. Nothing is built in `src/`. The map and state-comparison look stays as it is.

## Decisions waiting for AK
- Which looks to build: all three, or Slab and Counter first.
- Keep digits code-only (no AI art inside numbers): recommended.
- Counter's 2.5D bars sit close to the isometric style AK dropped on 27 Sep (`src/Styles.tsx`): check `frames/gold_tower.png`.

## Blockers to fix before building (from the critic)
1. The devices fit only `gd01` and `cw01`; the other money Shorts (negatives, tallies, lakh crore, rules) and the basket
   Shorts need devices too.
2. `src/datayt/BeatPosts.tsx` imports `BeatStory` directly, so post images would keep the old look.
3. The number locks on the spoken word, but nothing measures word timing yet (MiniMax subtitle timestamps or forced alignment).
4. Gold source: label it "WGC estimate, as reported" until AK confirms the primary source.

## Reuse for Indica Atlas
Indica Atlas (geography Shorts, code in `/Volumes/DarwinSSD/MMVideo`, `src/geo`) can reuse the looks if they are built with
brand tokens per channel (palette, fonts, logo, safe area, music) instead of Data Kadai's colours baked in. Slab (kinetic
poster type) and Dispatch (editorial desk) carry over best; Counter's objects are money-specific. The no-AI-maps rule matters
even more there: every map stays code-drawn from official boundaries. Adaptation note:
`/Volumes/DarwinSSD/Indica Atlas/Research/PREMIUM_LOOKS_from_DataKadai_2026-10-25.md`.

# Role 5: Director

**Job:** own the film. Decide how it is shown and heard, get AK's approval on an animatic (long film) or key-frame
board (Short), then guide the build and the review to delivery. One director per film, from the script draft to the
final review.

## Receives
- The research folder: `dossier.md` ("Visual material", "Fresh angles"), `claims.jsonl`, `verify.md`,
  `conflicts.md`; `STATUS.md` "Blocked" and "Handover notes" (the fact-checker's limits); and the script draft.

## Rules
- `docs/DIRECTOR.md` in full: it is this role's rulebook. Also `docs/storytelling/STORY_ENGINE.md` T8, T9 and T16,
  which it points to, and `agents/COMMON.md` sections 9–11.
- **Benchmark:** a long film's benchmark is not our own (DIRECTOR.md 3.2). A Short starts from our nearest benchmark
  Short (`docs/SHORTS_BENCHMARKS.md`, `hyperframes/shorts/`). If you cannot watch video (a session over SSH), read its
  script and code and a contact sheet of stills, and say so.
- **Kit:** Vox+ (`src/voxplus/README.md`) or HyperFrames (`hyperframes/README.md`) for long films; HyperFrames for
  Shorts. One look per film; samples are ingredients, restyled to the film's look. Use the channel's accent colour; if
  it has none, propose one in `DIRECTOR_LOG.md` for AK.
- **Pictures of documents:** cleared by default; crop or defocus every unspoken figure and never show a DISPUTED,
  UNVERIFIED or CONTRADICTED figure (`COMMON.md` section 11). Write each crop into the shot list. Anything else (photos,
  people, news images) goes under "Blocked" for AK before style frames.
- **Text on screen:** captions follow DIRECTOR.md section 5's hold time. A document line on a real page may stay up
  across beats while new elements land on it; that counts as a picture change for the Shorts pace rule.
- **Sound in a Short:** one low bed under the voice from frame 1 (`SHORTS_FORMAT` section 5), at least one silence just
  before the reveal, and one peak; DIRECTOR.md section 6's "new cue per section" is for long films. List every music
  and effect file with its licence.
- **Wording and pauses:** ask the script writer for changes in `DIRECTOR_LOG.md` and under "Blocked"; the script
  writer makes them in `SCRIPT.md` and `script.json`. You don't edit the script. Facts are fixed.

## Hands over
1. `productions/<id>/TREATMENT.md`:
   - **Long film:** all ten parts of `docs/DIRECTOR.md` section 3 (logline, benchmark, three ways to tell it, visual
     anchors, reveal and signature shot, beat sheet with but/therefore, shot list with reasons, sound plan, packaging,
     re-engagement points), plus the self-check answered.
   - **Short:** logline; benchmark Short; visual anchors; frame 0 (the hook picture and line); the reveal and signature
     shot; shot list with reasons and crops; sound plan; packaging (title options and frame-0 thumbnail per
     `/Volumes/DarwinSSD/Common/Packaging/PACKAGING_CHECKLIST.md`); the self-check items that apply.
2. `productions/<id>/DIRECTOR_LOG.md`: decisions and why, newest first.
3. On the **Mac Mini**: three style frames, then
   - **long film:** the animatic (`docs/DIRECTOR.md` section 4) at `out/productions/<id>/animatic.mp4`, scratch voice;
   - **Short:** a key-frame board (one still per beat plus frame 0, with the line under each) at
     `out/productions/<id>/keyframes/`, for AK to review.
4. After AK's review: the treatment updated from his three answers (bored, confused, did the reveal land?), then
   "narration locked" in `STATUS.md`.
5. For the builder: the final shot list (in `TREATMENT.md`) and anything the builder must not change.

## Done when
- AK has approved the animatic or key-frame board (his words in `DIRECTOR_LOG.md`).
- `STATUS.md`: step 5 "handed over", narration locked.

## Never
- Change a fact or a claim ID. Skip AK's review. Let a builder improvise a shot outside the shot list without logging
  it.

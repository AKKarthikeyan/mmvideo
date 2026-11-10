# Mains answer videos in look B: contract (7 Nov 2026)

Formats A (One Question), B (Ten Years, One Idea) and C (Answer Sheet Short), AK's pick on 6 Nov 2026. The plan is in the main checkout:
`docs/upsc/PYQ_ANSWERS_PLAN.md`. Read `../CONTRACT_B.md` first; the look and its rules apply unchanged.

## Sources of truth
- **Answer module** (main checkout) `research/upsc/pyq/<id>/answer.py`: the question as printed, the demands, the answer sheet, the weaker
  answer, the cousin questions and the narration. Check it with `python3 -I scripts/upsc/pyq_tool.py research/upsc/pyq/<id>/answer.py`
  (the question must match the bank; the sheet must stay within its word budget; every demand must be covered; every claim must be CONFIRMED
  or CORRECTED; every number on the sheet, in diagram labels and in timeline items must appear in that block's claims).
- **Storyboard** `scripts/upsc/pyq_storyboard.py <id>` cuts beats into scenes (PLANS holds the per-video choices) and runs
  `scripts/datayt/long_timeline.py`. Idea scenes either copy a concept film's scene spec (`borrow`, reveal keys remapped to this narration),
  or use `statement` or `pyq_timeline` specs, whose figures are checked against the claims of the beats so far.
- Numbers drawn by the pyq kinds come from the answer module through the storyboard; they are locked by the two checks above, not by
  `fig()`. Nothing in `pyq/*.tsx` types a figure.

## Scene kinds (`pyq/scenes.tsx`, player `pyq/PyqLong.tsx`, entry `pyq/index.tsx`)
1. **pyq_question** `{credit, marks, text, glow?: [{text, key}], strip?: {years, hits, key, note?}}`: the printed question on paper on the desk;
   glow phrases are highlighted from their keys; the strip lights the sittings that asked the idea.
2. **pyq_xray** `{text, directives: [{word, meaning, key}], demands: [{id, label, key}]}`: directive words underlined in red with a margin
   note; the demands arrive as empty boxes.
3. **pyq_sheet** `{blocks, from, to, minutes: [start, end], total, words0, budget, demands, done0, done, start}`: the ruled booklet; blocks
   `from..to` are handwritten over the scene, earlier ones are already there; the page scrolls to the writing line (a diagram is shown whole);
   the clock runs from `minutes[0]` to `minutes[1]` of `total`; the counter shows the words; demand boxes tick when their last block is written.
   Block kinds: intro, head, para, points (items split on •), close, diagram (`diagram: {name: "monsoon" | "timeline", labels, items}`).
4. **pyq_compare** `{weak: [{text, miss, key}], heads, fig?, demands, title_weak, title_good}`: our weaker answer (never a real student's) with
   red rings and notes, beside the good answer's outline.
5. **pyq_cousins** `{demands, cousins: [{text, key}], next: {text, key}, title}`: the boxes tick, other years' questions arrive, the next card.
6. **pyq_timeline** `{title, items: [{when, what, key?, red?}], quote?: {text, cite, key}}`: a pen timeline built node by node.

## Answer standard
Every answer follows `docs/upsc/ANSWER_STANDARD.md` (main checkout), checked by `pyq_tool.py` (rules A1-A10). In sheet text, `_term_`
marks an underlined key term (drawn as a red underline; the underscores are not written). Headings are boxed.

## Look notes
- Handwriting is Noteworthy, a macOS system font, so nothing is downloaded or committed. A Devanagari handwriting face is needed before
  Hindi versions (Kalam, OFL, covers both; downloading it is AK's call).
- Desk: warm wood under a lamp; paper cream with a soft shadow; ink blue (#1f2d6e), corrections red (#c0392b), weaker answer in pencil grey.
- India in diagrams is the Natural Earth India-view outline from `basemap_b.json`, whole (Ladakh, Jammu and Kashmir, the Andaman and
  Nicobar Islands and Lakshadweep).

## Render
`npx remotion render src/looks/upsc_rich_b/pyq/index.tsx PYQ-<id>-60 out/upsc/pyq/<id>/<id>_60fps_2k.mp4 --scale=1.3333333333333333 --crf=18`
(60 fps, 2560 x 1440). Voice: `LONG_DIR=public/datayt/long/upsc/pyq-<id>` with `scripts/datayt/long_voice.py voice-maya`, then `words`, then
`long_timeline.py <storyboard> --words <word_times.json> --out <timeline.json>`, then `mix`.

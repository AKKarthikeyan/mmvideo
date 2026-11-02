---
name: story
description: Script or review a Moat & Margin video (long form, Short or Reel) to the storytelling rules in docs/STORYTELLING.md (AK, 2 Nov 2026). Picks the arc, fills the V["story"] ledger, runs scripts/story_check.py and the retention-editor checklist. Use for "/story <topic or video id>", "script a video on ...", "review the story of <id>", or "why did the retention dip".
argument-hint: <topic | video id | "short" topic | "diagnose" id>
---

# /story

`docs/STORYTELLING.md` is the rulebook. Read it first, every time, and follow it. Do not restate or paraphrase its rules
from memory: they were replaced on 2 Nov 2026 and the old "question by 0:05, a hook every 45 s" rule is retired.
`scripts/hook_check.py` is a stub; use `scripts/story_check.py`.

Work out the mode from `$ARGUMENTS`, then follow that mode. If the request is ambiguous, pick the closest mode and say which.

## Mode 1: write a new script (a topic, or a topic plus source documents)

1. **Evidence first.** Name the 2 or 3 critical documents or figures the story cannot exist without (section 2) and verify
   each against its source. If one fails, reframe or stop and tell AK. Name a fallback question.
2. **Promise.** One sentence a viewer would click on, framed as the question the filings answer. Pick the promise type and
   exactly one arc from the nine in section 2. Say why in one line.
3. **Outline before prose.** Lay out the beats on the default skeleton (section 2). Write the connecting word, *but* or
   *therefore*, between every pair of beats. Rewrite or cut any beat that only follows in time.
4. **Loops.** Plan the primary, secondary, tertiary and micro loops, the `turn`, and the plants (section 4). The primary opens
   by 0:30, answers last, and something is opened or answered at least every 3 minutes. Plan a small win by 2:00.
5. **Draft the beats** in the engine's own format: `T(ch, key, say, cap, scene)`, numbers as words in `say`, numerals in
   `cap`, every figure from the source with the source on screen, anything illustrative labelled, no price talk, no buy or
   sell, no verdict on a stock, quotes verbatim. Reuse scene types and the Vox, Napkin or HyperFrames samples already in
   the repo (see `README.md` and `hyperframes/README.md`); do not invent new scene types.
6. **Add `V["story"]`** (promise, arc, loops, turn, plants, critical, optional tier) as in section 7.
7. **Run the check:** `python3 scripts/story_check.py <id>`. Fix every FAIL. Treat each warning as a real finding: fix it or
   say in the report why it stays.
8. **Run the section 8 checklist** item by item. Mark each yes or no with the beat key that proves it. A "no" is fixed, not hidden.

Where it goes: daily-filings and explainer videos in `scripts/vx_scripts.py`; Letters and Moat Files in
`scripts/vx_letters.py`. **Append** the new entry and register it; never edit or replace another session's entries (README).
Do not build the voice, render, or upload: end at "script checked, not voiced, not rendered", as the existing entries do.
Delete `scripts/__pycache__/` before finishing.

## Mode 2: review an existing video (a video id)

Existing videos pre-date the ledger and are not re-cut. Run `python3 scripts/story_check.py <id>`. If it has no ledger, draft
one **in your reply** from the beats (do not edit the entry unless AK asks), run the check on that draft in a scratch copy,
and report: where the primary opens, the longest quiet stretch, the tail after the payoff, "and then" openers, spoken
asks, and the three highest-value changes. Say plainly that a remake, not a patch, is what applies the new rules.

## Mode 3: Short or Reel (`"short"` in the arguments)

Follow section 6 only: hook on frame 1, the payoff teased by 3 s, but/therefore turns, one finding and two receipts at most,
cut at the payoff, no spoken ask, the link in the caption and pinned comment. Evidence and compliance rules are in the
darwin-research template `contentengine/templates/short_video_script.md`. Shorts are not run through `story_check.py`
(it is for long videos); use the section 6 list by hand and show each point with its line of the script.

## Mode 4: diagnose a published video (`"diagnose"` and an id, with a description of the retention graph)

Use the table in section 8 to map each symptom to the rule that broke, name the beats involved, and propose the specific
re-cut or the specific change for the next video (where its pattern interrupts and re-engagements should go). One curve is a
small sample: say so, and ask for two or three videos before changing a rule.

## Report format

Finish with a short report, not the whole script: mode, arc and why, the promise, the loops in one line each, the checker's
output (verbatim exit code, FAILs, warnings), checklist items that are "no" or judgement calls, and what was not done
(voice, render). If a rule in the document seems wrong for this video, say so and leave the rule as it is.

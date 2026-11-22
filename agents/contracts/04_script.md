# Role 4: Script writer

**Job:** write the YouTube script from the checked research, as a story the viewer stays with, in pairing with the
director.

## Receives
- The research folder after step 2, including `verify.md`, and `STATUS.md` "Blocked" and "Handover notes" (the
  fact-checker's limits). The director joins as soon as a first draft exists.

## Rules
- **Length first.** If the brief names a length, use it. If not (or it says "dry run"), choose: a long film needs
  research in full mode that can fill at least three chapters; Shorts-mode research makes a Short. Write the choice
  and why at the top of `SCRIPT.md`. If the brief asks for a long film and the research can't fill it, write that
  under "Blocked" for AK and stop.
- `docs/storytelling/STORY_ENGINE.md` in full: pick the format from the research (section 4), use the toolbox (T1–T16),
  the beat grid (section 6), and pass the story gate (section 8) before handing over. Until the skills S13 names exist,
  do both passes by hand and mark S13 "PASS (by hand)" (`agents/COMMON.md` section 12). For the audience (S12), use
  the channel's profile in section 5; Moat & Margin has none yet, so use `docs/SHORTS_RULES.md` section 8's row.
- **Shorts:** `docs/SHORTS_FORMAT.md` and `docs/SHORTS_RULES.md`, written as their own loop script. Length and word
  budget come from `SHORTS_RULES` (`COMMON.md` section 10); the hook is on frame 0, the reveal still about two-thirds
  in.
- Write from `claims.jsonl` (and the ledger, if any), **not** from the article. Every `self_claim` claim is spoken as
  "<who> says"; allegations name who alleges.
- Write for the ear: short sentences, one idea each, plain words. Repetition that helps a listener is fine.
- Every beat links to the next by a logical **BUT** or **THEREFORE**, recorded in `script.json` `link`; the spoken
  word need not be "but". A beat that can only be "and then" is cut or rewritten.
- Hold back the reveal; the strongest moment sits about two-thirds in (T9). Long videos: a fresh question or turn at
  about 3 and 6 minutes.
- You may drop a hook or angle the researcher suggested; write why in `SCRIPT.md` under "Dropped".
- **Draft until AK approves the animatic (long film) or key-frame board (Short).** Wording and pause changes the
  director asks for are expected, and you make them; facts and claim IDs never change.

## Hands over
- `productions/<id>/SCRIPT.md`: the readable script (beats, narration, on-screen keywords, claim IDs per line, each
  line's label: fact / our reading / illustration).
- `productions/<id>/script.json` in the shape of `COMMON.md` section 3 (worked example:
  `productions/mm-asianpaints-dealers/script.json`).

## Done when
- `python3 docs/inventors_desk/scripts/research_check.py <research folder> --script productions/<id>/script.json`
  (add `--lite` in Shorts mode) exits 0.
- The story gate (S1–S13) is written out at the end of `SCRIPT.md`, each with pass or the reason.
- `STATUS.md`: step 4 "handed over (draft)".
- `scripts/shorts_check.py` needs a built Short: the builder runs it, not you.

## Never
- Add a fact not in the ledger. Lock the narration before AK's animatic or key-frame review. Voice it.

# Role 4: Script writer

**Job:** write the YouTube script from the checked research, as a story the viewer stays with, in pairing with the
director.

## Receives
- The research folder after step 2. The director joins as soon as a first draft exists.

## Rules
- `docs/storytelling/STORY_ENGINE.md` in full: pick the format from the research (section 4), use the toolbox (T1–T16),
  the beat grid (section 6), and pass the story gate (section 8) before handing over.
- Write from `claims.jsonl` (and the ledger, if any), **not** from the article.
- Write for the ear: short sentences, one idea each, plain words. Repetition that helps a listener is fine.
- Every beat links to the next with **"but"** or **"therefore"**; a beat that can only be "and then" is cut or
  rewritten.
- Hold back the reveal; the strongest moment sits about two-thirds in (T9). Long videos: a fresh question or turn at
  about 3 and 6 minutes.
- Shorts: `docs/SHORTS_FORMAT.md` and `docs/SHORTS_RULES.md`, written as their own loop script.
- **Draft until the director's animatic is approved.** Wording changes the director asks for are expected; facts and
  claim IDs never change.

## Hands over
- `productions/<id>/SCRIPT.md`: the readable script (beats, narration, on-screen keywords, claim IDs per line).
- `productions/<id>/script.json`: one entry per narration line with `"claims": [...]`, the shape
  `research_check.py --script` checks.

## Done when
- `python3 docs/inventors_desk/scripts/research_check.py <research folder> --script productions/<id>/script.json`
  (add `--lite` in Shorts mode) exits 0. For the `script.json` shape, copy a passing example such as
  `docs/geo/research/CY02-bay-of-bengal/script_v1.json`.
- The story gate (S1–S13) is written out at the end of `SCRIPT.md`, each with pass or the reason.
- `STATUS.md`: step 4 "handed over".

## Never
- Add a fact not in the ledger. Lock the narration before the animatic review. Voice it.

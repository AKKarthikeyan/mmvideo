# Role 6: Builder (Mac Mini only)

**Job:** build the film the director designed, cut to the real voice, with the planned sound.

## Receives
- `TREATMENT.md` (shot list and sound plan), the locked script, the ledger, and the real voice track.

## Rules
- Build only what the shot list says. If a shot doesn't work, note it in `DIRECTOR_LOG.md` and ask the director; small
  fixes (a position, a timing) are fine, new shots are not.
- The kit's own rules: Vox+ briefs and `src/voxplus/README.md` (timing API, cue every figure to the phrase that says
  it), or `hyperframes/README.md` (`hf.py sync`, `hf.py check` with 0 errors).
- Evidence rules (CLAUDE.md): every number from the ledger, shown only when spoken, with its source chip; our arithmetic
  and illustrations labelled.
- Several builders may split the scenes; each owns only its scene files, as in the Vox+ briefs.
- Sound per the plan and `docs/DIRECTOR.md` section 6; every music and effect file listed with its licence.

## Hands over
- The rendered film under `out/` (not in git), its source files committed, and in `STATUS.md` the render path.
- Still checks done for every shot (stills listed in `STATUS.md`), including 0.1 s after each cut (no empty frames).

## Done when
- Still checks pass, loudness about −14 LUFS, the voice check passes (every script word heard).
- `STATUS.md`: step 6 "handed over".

## Never
- Change narration, facts or the shot order. Publish. Put media in git.

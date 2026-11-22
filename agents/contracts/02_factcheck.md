# Role 2: Fact-checker

**Job:** independently confirm that the research says what its sources say. You did not do the research; run in a
**fresh session** with no memory of it.

## Receives
- The research folder (from `STATUS.md`), with `verify.md` as a stub.

## Rules
- Gate G6 of the channel's research rules: re-open the source for **every spine claim** and at least **one in three of
  the others, chosen at random** (write down how you chose them). Re-run every calculation and measurement from the
  numbers in the source.
- For each checked claim: does the quote exist at the locator? Does the claim say what the quote says, no more? Is the
  tier right? Is the hedge right?
- Verdicts as in the rules (Confirmed, Confirmed (secondary only), Contradicted, Embellished, Unverifiable).
- Check the ledger CSV too, if there is one: every value equals its source; units, periods and entities are explicit.

## Hands over
- `verify.md` in the research folder. Its first line must start `G6: PASS.` or `G6: FAIL.` followed by one sentence
  (that is what `research_check.py` reads); worked example: `docs/geo/research/CY02-bay-of-bengal/verify.md`.
- Claims you could not confirm: set their status as the rules say and list them in `STATUS.md` under "Blocked" for
  the research role, or mark them unusable.

## Done when
- `python3 docs/inventors_desk/scripts/research_check.py <research folder>` (with `--lite` in Shorts mode) prints
  "CLEARED FOR SCRIPTING" and exits 0. "quote not found verbatim in local copy" warnings are expected in a cloud
  session when the saved copies are on the SSD; re-run on the Mac Mini for a clean check.
- `STATUS.md`: step 2 "handed over" (or "blocked" with the reason).

## Never
- Fix the research yourself beyond claim statuses; send it back instead. Add new facts.

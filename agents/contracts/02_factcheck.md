# Role 2: Fact-checker

**Job:** independently confirm that the research says what its sources say. You did not do the research; run in a
**fresh session** with no memory of it.

## Receives
- The research folder (from `STATUS.md`), with `verify.md` as a stub, and the saved copies in `sources/`. Those exist
  only on the Mac Mini (`COMMON.md` section 8): in a cloud session, re-fetch every source you check from its `url`.

## Rules
- `agents/COMMON.md` sections 2–9 (tiers, formats, statuses, PDFs, tooling).
- **Which claims:** every spine claim, plus one in three of the others, **rounded up**, drawn at random. Draw with
  `random.Random(<today as YYYYMMDD>).sample(sorted(non_spine_ids), k)` and write the line and its result in
  `verify.md`.
- **Quote check:** for each checked claim, re-open the source itself (the PDF, not the researcher's `.pages.txt`),
  extract the page named in the locator with PyMuPDF, normalise hyphens and spaces, and find the quote on that page.
  Record found / not found per quote. Also check the printed page in the locator matches.
- **Does the claim say what the quote says, no more?** Is the tier right (`COMMON.md` section 2)? Is `self_claim` set
  where it should be? Is the hedge right (allegations named as allegations)?
- **Re-run every calculation**, including percentages and growth figures **printed in the source** itself: a quote
  can be exact while the source contradicts its own numbers.
- **Off-site copies:** judge them by `COMMON.md` section 2 and write which marks you checked.
- **G7:** re-judge the researcher's proposed line in `dossier.md`; record agreement or your change in `verify.md`.
- **Visual material:** confirm that pages flagged with unusable figures are flagged, and add any the researcher missed.
- Verdicts as in the rules (Confirmed, Confirmed (secondary only), Contradicted, Embellished, Unverifiable).
- Check the ledger CSV too, if there is one: every value equals its source; units, periods and entities are explicit.

## Hands over
- `verify.md` in the research folder. Its first line must start `G6: PASS.` or `G6: FAIL.` followed by one sentence
  (that is what `research_check.py` reads); worked example:
  `productions/mm-asianpaints-dealers/research/verify.md`.
- Claim statuses changed where a claim failed (`COMMON.md` section 4; a half-right claim becomes DISPUTED with a note
  naming the usable part). List each under "Blocked" in `STATUS.md` for the research role.
- In `STATUS.md` "Handover notes": the constraints the article, script and director must follow (which claims are
  "<who> says", which are allegations, which numbers may not be stated).

## Done when
- `python3 docs/inventors_desk/scripts/research_check.py <research folder>` (with `--lite` in Shorts mode) prints
  "CLEARED FOR SCRIPTING" and exits 0. "quote not found verbatim in local copy" warnings are expected in a cloud
  session; re-run on the Mac Mini for a clean check.
- `STATUS.md`: step 2 "handed over" (or "blocked" with the reason).

## Never
- Fix the research yourself beyond claim statuses; send it back instead. Add new facts.

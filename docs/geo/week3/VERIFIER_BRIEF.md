# SHORTS LITE MODE (AK, 1 Nov 2026): THIS NARROWS THE STEPS BELOW
The research uses only 2-3 original sources. Re-open exactly those sources (saved copy and live), confirm every spine claim and quote digit by digit, re-run every computation, and spot-check wording. Skip the one-in-three spot check of non-spine claims unless a spine claim fails. Budget about 50,000 tokens. Gate: `research_check.py <folder> --lite`.

# Indica Atlas Week 3: brief for every independent checker (gate G6), 1 Nov 2026

You did not do the research. Do not trust anything in the folder: re-check it yourself. Never publish or post anything, never print or log an API key, never bypass a CAPTCHA, paywall or bot check (log CANNOT-REACH instead). Today is 1 Nov 2026; your own knowledge is not a source.

Rules: `/Volumes/DarwinSSD/MMVideo/docs/geo/RESEARCH_RULES.md` (rule 0: nothing from memory; section 9 G6: "a separate checker re-opens every spine source, re-runs every measurement, and spot-checks one in three of the rest"). Read section 9 of `/Volumes/DarwinSSD/MMVideo/docs/inventors_desk/RESEARCH_RULES.md` and `/Volumes/DarwinSSD/MMVideo/docs/inventors_desk/scripts/research_check.py` for the exact first line verify.md needs. Examples of a good verify.md: `.../research/CY03-galwan-lac/verify.md`, `.../CY02-bay-of-bengal/verify.md`.

Do this, efficiently (fetch each source once; read only what you need):
1. For EVERY spine claim in claims.jsonl, re-open the cited source (the saved copy in `sources/` AND, if it is a public page or PDF, re-fetch it yourself; use the built-in browser tools if a site refuses plain fetches) and confirm the quoted words/values really appear at the stated locator and say what the claim says. PASS / FAIL / CANNOT-REACH per spine claim with one line of evidence.
2. Re-run every measurement or computation in `method/` with `python3 -I` and compare the output with the saved output and with the claim. Say whether definitions (year, basis, units, which countries/places) are consistent across every figure in a comparison.
3. Check the statuses are honest (VERIFIED-P needs a primary source that states it; CORROBORATED needs two independent origins; hedged claims stay hedged); no tier-X source; myths.md verdicts match the evidence; every fact the dossier lists as "safe to say" has a claim ID that passes.
4. Spot-check at least one in three of the non-spine claims, choosing the surprising or fragile ones.
5. Scan dossier.md for wording that states a disputed thing as fact, takes a side, or goes beyond what a claim says (⚑ for sensitive topics).
6. Write `verify.md` (replace the stub): a table of what you checked, each FAIL/CANNOT-REACH with the exact fix needed, and a first line in the exact form research_check.py expects (PASS only if every spine claim passes; otherwise FAIL with the list). Do not edit other research files. Then run research_check.py on the folder and include its result.

Report back in under 200 words: verdict; every FAIL or CANNOT-REACH with claim id and fix; anything you could not confirm exists; wording risks; research_check.py result.

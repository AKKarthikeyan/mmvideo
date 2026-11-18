G6: PASS. Round 1 failed on wording only; round 2 (after the fixes) passed. 5 Nov 2026.

# X2 Hormuz: independent verification (G6), 5 Nov 2026

Verifier: a separate Claude subagent (Sonnet, low effort) that did not do the research. It re-opened the two saved source texts and re-ran the arithmetic. Same agent, resumed, for round 2.

## Round 1: G6: FAIL (wording only)
- All 13 evidence quotes found in the cited texts; all claims supported as worded; `method/shares.py` identical to its saved output; 2.6/20 = 13.0%, (130-6)/130 = 95.4%.
- 89 and 74 appear in neither source as a share (the only "74" is Brent "$74/b" in the EIA text).
- Beats that overreached: b1 dropped EIA's "about" ("one in every five"); b3 "isn't headed west" is an inference EIA never makes; b4 "top buyers" for EIA's "top destinations"; b6 dropped "would likely be most affected".

## Fixes applied
b1 "about one in every five barrels"; b3 "most of its crude goes to Asia: eighty-four per cent" (no "west"); b4 "top destinations"; b6 "EIA says Asia would likely be hit hardest by a closure" (on-screen "ASIA, LIKELY HARDEST HIT"); b7 "about a fifth"; icon labels "~1 in 5".

## Round 2: G6: PASS
All 7 spoken lines and all on-screen text pass against the cited claims. No on-screen text names a party to the conflict or says who closed the strait. Minor notes, now handled: icon labels gained "~"; b7's on-screen sub has no "2024" (the credit line says "2024 data", accepted). The verifier notes that IRAN and OMAN appear only as geography labels from EIA's "between Oman and Iran"; AK may drop them (C002 supports them).

## Residuals (not blocking)
- Today's status of the strait is unknown (open_questions.md 1); every figure in the Short is dated 2024.
- No archive.org captures (lite run).

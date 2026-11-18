G6: PASS. All 6 spine claims (C001-C006) pass on an independent re-check against the saved source copies (15 Nov 2026, Shorts Lite); the method script reproduces its saved output exactly. Wording fixes are listed below; apply them in the script.

# W4-08 Bombay seven islands: independent verification (G6, Shorts Lite)

Verifier: a separate Claude Code session (not the researcher). Quotes searched in sources/gaz1_djvu.txt, gaz2_djvu.txt and mcgm_city_profile.txt. Live pages were NOT re-fetched (saved copies only). `python3 -I method/felt.py` diffed against felt_output.txt: identical.

| Claim | Result | Evidence |
|---|---|---|
| C001 | PASS | gaz1 line 761: "Bombay orig^inally consisted of seven separate islands, which remained practically unaltered in shape until the eigchteenth century" (OCR noise, hence the gate's verbatim warning); mcgm line 10: "was once made up of seven small islands" |
| C002 | PASS (not re-read in full) | Names as listed; conflict K1 stands. Name only Colaba, Mazagon, Parel, Worli, Mahim |
| C003 | PASS | gaz2 lines 7366-7367: "Hornby Vellard ... between 1771 and 1784"; mcgm lines 247-250: "took root in 1782 ... completed in 1784" |
| C004 | PASS, date hedge | gaz1 lines 4619-4623: "Grose, who visited the island in 1772 ... almost divided the island in two and made the roads impassable". But gaz1 lines 1018-1021 (a footnote) date the same Grose passage to "the Great Breach in 1754", and Grose there already describes an earlier causeway |
| C005 | PASS, hedged | gaz2 lines 7393-7401: Directors "refused to sanction"; Hornby "commenced the work without sanction"; found "an order for his suspension, which ... he put in his pocket". mcgm lines 247-248: "amidst the rejection of the plan from the Directors" |
| C006 | PASS | gaz2 lines 8548-8550: "Colaba Causeway in 1838. Colaba, which up to that date formed the only remaining vestige of the original seven islands"; mcgm line 258: "in 1838" |
| C007 | PASS | gaz1 line 654: "22*48 square miles"; mcgm line 57: "67.79 square kilometers". Definitions differ; indicative only |
| C008 | PASS (mcgm only re-read) | mcgm line 258: "Causeway connecting Mahim and Bandra was completed in 1845" |
| C009 | CONFLICT stands | Not used |

## Wording fixes
1. Do not give Grose a year. The Gazetteer gives 1772 in its text and 1754 in a footnote. Say "Grose, quoted in the 1909 Gazetteer" or "an eighteenth-century visitor".
2. Do not call the 1784 Vellard the first wall: the Gazetteer says an earlier, weaker dam existed (gaz2 lines 7367-7369). Say "the Vellard, finished in 1784, shut the sea out".
3. Hornby acting without permission: keep "reportedly" (the Gazetteer prints it as an anecdote from Maclean).
4. "The British joined them with one big wall" is not shown to be a common belief. Hook on "seven islands" only.
5. No island outlines unless labelled "illustrative" (open question 1). Pins for Worli, Mazagon and Parel still need official coordinates (open question 2).

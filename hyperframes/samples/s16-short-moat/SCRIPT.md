# Sample 16 · Moat Atlas short: the Asian Paints moat (41 s, 9:16)

Structure copied from the New Coke short AK shared: hook first, one visual idea per line, key phrase on screen, punchline last.
About 105 spoken words (about 2.8 words a second). Every claim is already in the Moat 60 ledger (`scripts/ledger/a01moat.csv`,
beats l63 and l64). Nothing here is new research. Recheck both articles on recording day.

| Time | Voiceover | Visual | Source |
| --- | --- | --- | --- |
| 0–3.4 | Asian Paints is the market leader. | Podium rises, tin lands, starburst. Caption "The market leader" | Our article, 17 Aug 2026: "The market leader. The textbook moat." |
| 3.5–6.4 | But its moat isn't the paint. | Caption "But not the paint" | Same article: "the counter, not the can, is the moat" |
| 6.8–13 | Our August 2026 article says it lives at the shop counters that sell it. The counter, not the can. | Wall of tins dims, the counter glows | Same article, lines 8 and 53 |
| 13.3–16.6 | That took decades to build. | Bar "DECADES" (not to scale) | Our article, 21 Jul 2026, line 185 |
| 16.9–21 | Yet our July article says a funded rival matched its delivery service in under a year. | Red bar "UNDER 1 YEAR" | Same article, line 185; the delivery benchmark is company-reported (line 130) |
| 21.5–29 | And in the year to March 2025, big paint makers together could make about 40% more paint. For every 100 tins, 140. | 100 dots, then 40 red dots; counter 100 to 140 | Grasim disclosure as quoted in our 21 Jul 2026 article, line 67. 100 × 1.4 = 140 is our arithmetic |
| 29.4–33.6 | So the moat is real, but a rival can go round it. | Moat ring, red dashed path around it | Our 21 Jul 2026 article, line 185 |
| 34–37.4 | Now the company is rebuilding it around the can. Will that work? | Same ring; caption only | Our 17 Aug 2026 article, line 8 ("now" is as of that date) |
| 37.4–41 | (music tail) | End card: MOAT ATLAS, disclaimer, moatmarginresearch.com | Repo wording: "Educational research, not investment advice · not SEBI-registered" |

On-screen labels: tins, counter, dots and moat ring are tagged ILLUSTRATIVE; the two bars are tagged NOT TO SCALE.
The tins carry no brand mark. Avoid saying "India's leader" or any market-share number: the ledger only supports "the market leader".

## Not done yet

- No voiceover or music. Build the track with the MiniMax TTS scripts, then retime the caption `t0` values to the words
  (they are in `cap(...)` calls in `index.html`).
- Check the figures against the two articles (not in this repo; they live in `darwin-research`).

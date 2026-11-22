# Role 3: Article

**Job:** turn the checked research into a readable article: first for AK (to understand the story fast and decide),
and, if AK chooses, for the Moat & Margin newsletter or blog. Runs in parallel with the script, from the same research.

## Receives
- The research folder after step 2 (gates passed).

## Rules
- Only claims whose status allows narration; hedges kept in the words ("records suggest", "the company says").
- Plain English, short paragraphs, no jargon without a one-line explanation. Every number gets a comparison that makes
  it human (STORY_ENGINE T15).
- Shape:
  1. **Title and one-line answer** to the film's question.
  2. **Why it matters now** (3–4 sentences).
  3. **The story** in 4–7 short sections with subheads, each ending on a "but" or "therefore" that leads to the next.
  4. **What the numbers show**: a small table of the key figures, each with its source.
  5. **What we don't know**: open questions and conflicts from the research, honestly.
  6. **Sources**: primary sources only, with links.
  7. **For the film (AK only, not for publishing):** the 3 strongest moments, the best visual material found, and
     anything that surprised you.
- Every factual sentence carries its claim IDs in brackets, e.g. `[C12]`; strip them only in a publish copy.
- Moat & Margin: no buy, sell or hold, no price targets, no valuation verdicts.

## Hands over
- `productions/<id>/ARTICLE.md`.

## Done when
- Every factual sentence has claim IDs that exist in `claims.jsonl` with a narratable status.
- `STATUS.md`: step 3 "handed over".

## Never
- Feed the script: the script writer works from the research, not from this article. Publish anything.

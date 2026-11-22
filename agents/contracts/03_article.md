# Role 3: Article

**Job:** turn the checked research into a readable article: first for AK (to understand the story fast and decide),
and, if AK chooses, for the Moat & Margin newsletter or blog. Runs in parallel with the script, from the same research.

## Receives
- The research folder after step 2 (gates passed), including `verify.md`, `conflicts.md` and `open_questions.md`.
- `STATUS.md` "Blocked" and "Handover notes": the fact-checker's limits on what may be said.

## Rules
- Only narratable claims (`agents/COMMON.md` section 4), with hedges kept in the words ("records suggest"). Every
  claim with `self_claim` is written "<who> says"; allegations name who alleges.
- Plain English, short paragraphs, no jargon without a one-line explanation. Every number gets a comparison that makes
  it human (STORY_ENGINE T15). Build the comparison from arithmetic on ledger numbers (label it "our arithmetic"); if
  it needs a number the ledger does not hold, leave it out and list the gap in section 7.
- Shape:
  1. **Title and one-line answer** to the film's question, and under it one italic line saying whose figures these are
     (e.g. "Figures are the companies' own, from their annual reports").
  2. **Why it matters now** (3–4 sentences).
  3. **The story** in 4–7 short sections with subheads, each ending on a "but" or "therefore" that leads to the next;
     the last ends on the open question that section 5 takes up.
  4. **What the numbers show**: a small table of the key figures with columns figure, source, and **whose claim**.
  5. **What we don't know**: open questions and conflicts from the research, honestly.
  6. **Sources**: primary sources only, with links.
  7. **For the film (AK only, not for publishing):** the 3 strongest moments, the best visual material found, gaps
     (comparisons or visuals the ledger can't support), and anything that surprised you.
- Every factual sentence carries its claim IDs in brackets, e.g. `[C12]`; strip them only in a publish copy. A
  sentence that is our inference from cited claims carries the IDs plus `(our reading)`; a plain-words explainer of a
  term (what tinting is) carries `(explainer)` and states nothing about the companies.
- Moat & Margin: no buy, sell or hold, no price targets, no valuation verdicts.

## Hands over
- `productions/<id>/ARTICLE.md`.

## Done when
- A check (a few lines of python is fine) shows every `[Cnn]` exists in `claims.jsonl` with a narratable status;
  paste its result in the handover line.
- `STATUS.md`: step 3 "handed over".

## Never
- Feed the script: the script writer works from the research, not from this article. Publish anything.

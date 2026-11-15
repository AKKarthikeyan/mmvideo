# How our Mains answers are written (standard, 10 Nov 2026)

AK asked (10 Nov 2026) that every on-screen answer meet what the UPSC Mains examination expects. This standard rests on four kinds of
evidence, always labelled by kind:

- **[U] UPSC itself:** the CSE 2026 notice (`research/upsc/answer_writing/UPSC_OFFICIAL.md`).
- **[C] Courts and the CIC, reciting UPSC's own account:** `research/upsc/answer_writing/guides.md` section 1.
- **[T] Topper copies:** 41 answers by 9 toppers (32 GS, 9 Geography optional). All are coaching mock tests, because no real Mains script is public.
  Two toppers' copies carry evaluator marks (`toppers.md`).
- **[P] Practice:** nine institutes' guides (`guides.md`) and four transcribed answer-writing talks, including Shruti Sharma (AIR 1, 2021),
  Manuj Jindal and Vajiram & Ravi (`videos.md`).

UPSC publishes no model answers and no marking scheme. By UPSC's own account [C], examiners mark against agreed "appropriate answers"
under a Head Examiner, and marks are then moderated. As reported by Vision IAS, the Chairman described a vetted key of points (a secondary report).
So an answer scores by **hitting the points an examiner expects, clearly and briefly**. Everything below serves that.

## The rules

| # | Rule | Evidence | Check in `pyq_tool.py` |
|---|---|---|---|
| A1 | **Answer exactly what is asked.** Read the directive word and split the question into its demands. Cover every demand. Multi-part questions get one heading per part, in the question's own words. | [U] "relevant, meaningful and succinct"; [P] all institutes, SS, MJ; [T] 30 of 32 headed | every demand has a heading block (fail) |
| A2 | **Take a view where the question asks for one** ("examine", "critically", "comment", "explain whether", "to what extent"). | [U] "take a view on conflicting... goals"; [P] Mrunal, Vajiram, PW | the closing block answers the demand marked `view` (fail if missing) |
| A3 | **Word limit.** GS: within the printed limit, aiming at 80-100% of it (toppers write about 100-170 for 150 and 150-230 for 250). Optionals have no printed limit. Our working budgets are 10 marks 150-180, 15 marks 220-270, 20 marks 300-350, matching Vajiram's 350 for 20 marks and the time. | [U] word limit "should be adhered to", "economy of words"; [T]; [P] | budget (fail) |
| A4 | **Time.** About 7-8 minutes for a 10-marker, 11 for a 15-marker, 14 for a 20-marker (3 hours for 250 marks). | [P] NEXT, Insights, Vajiram; our arithmetic | shown on the clock |
| A5 | **Short introduction**, 1-3 lines, at most 15% of the words: a definition, a figure, or the context. | [P] Vision 15-20%, Drishti 10-20%, Insights 10-15%, Mrunal 20-30 words; [T] 1-3 lines | intro ≤ 15% (fail) |
| A6 | **Body in points under headings**, best point first, each point with a reason, example or figure. Paragraphs only for the intro, the conclusion, and a formula or derivation. | [T] 32 of 32 in points; [P] SS; Insights warns against forcing a fixed template | body blocks are `points` (warn) |
| A7 | **Named evidence.** Every heading carries at least one named source: an Article, a case, a committee, a report, an official figure, or a theory and its author (optionals). This is what evaluators asked for in the marked copies. | [T] Ray's and Anand's evaluator comments; PW's AIR 50 vs AIR 307 comparison; 6 of 9 optional answers name thinkers | each body block cites claims (fail) |
| A8 | **Underline the key terms**, 4 to 10 per answer: terms the examiner's key is likely to hold. | [T] 41 of 41; [P] SS, MJ, Vision | 4-10 marked terms (warn) |
| A9 | **One diagram where it earns its place**, drawable in about a minute: a map for geography (evaluators asked for maps), a flowchart or timeline for polity, a graph or table for economics. Never decoration. | [P] Vajiram, Vision, Insights (disagree on "always"); [T] evaluator: "apt diagram"; maps requested | at most one diagram per answer (warn if two) |
| A10 | **Short conclusion**, about 10% of the words: forward-looking (way forward, a named committee's recommendation, a constitutional ideal) or a balanced verdict. No new facts, no question as the ending. | [P] Vision, Drishti, Vajiram, SS; [T] 7 of 15 seen were way-forward | close ≤ 15% (warn) |
| A11 | **Current, and dated.** Use today's figures, and say when they are from. If the exam-year fact has changed, write today's and note the change. | our Gold Standard; [U] no marks for "mere superficial knowledge" | claims are CONFIRMED/CORRECTED (fail) |
| A12 | **Legible and clean.** Clear handwriting, margins, boxed headings, nothing that could identify the writer. | [U] legibility deduction; identity penalty | the look |

## How we present the rules on screen (honesty)

- Directive-word meanings are **common teaching practice, not UPSC definitions**, and the X-ray says so in a footnote.
  Institutes disagree on how to end a "critically examine" answer (Drishti: no side; Mrunal: a stand; Vajiram, PW: balanced judgment). Our answers give a balanced verdict.
- We call our answer "one good answer", never "the model answer", and never promise marks. The marked mock copies we studied score
  40-55% even for top-50 rankers, so no one should expect a "perfect" score.
- The weaker answer is written by us, never a real candidate's.

## What we could not find (open)

No real UPSC-marked script is public. We found no Economics, PSIR or Agriculture optional copy, and UPSC's own pages on "common mistakes" and
the specimen answer booklet were unreachable. Only four of fifteen videos could be transcribed, because YouTube rate-limited captions.
When any of these turns up, update this standard.

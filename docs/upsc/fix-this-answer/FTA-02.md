# FTA-02 · Fix This Answer: "You read the question back to the examiner"

**Pilot episode 2 of the Fix This Answer format** (`docs/UPSC_MAINS_PLAYBOOK.md` §3a). A GS-II question, so the pilot covers
General Studies as well as an optional (FTA-01). Draft for AK and a Mains mentor; built as a silent draft with estimated
timing, nothing voiced yet. Language: English.

| | |
| --- | --- |
| Question | UPSC CSE (Main) 2022, General Studies Paper II, Q2, 10 marks, 150 words: "Right of movement and residence throughout the territory of India are freely available to the Indian citizens, but these rights are not absolute." Comment. |
| Answer repaired | **Illustrative: written by us, not a candidate's copy**, stamped so on every page scene |
| The one mistake | **Writing gap (rule A2, take a view):** "Comment" asks for a judgement backed by cases; the answer ends by repeating the statement and names no case |
| Smaller slip | D1: the answer never says the right is for citizens only (Article 19: "All citizens"); fixed with one word |
| Kept, not repaired | The Article 19(5) line is right, and the episode says so: repair is also knowing what to keep |
| Transfer question | UPSC CSE (Main) 2017, GS-II, Q12, 15 marks: "Examine the scope of Fundamental Rights in the light of the latest judgement of the Supreme Court on Right to Privacy." Same skill: end on the verdict the directive word asks for, backed by a named case |
| Source | `research/upsc/fta/fta-02/fta.py`; build `python3 scripts/upsc/fta_storyboard.py fta-02` |
| Visual | Look B: `pyq_question`, `pyq_xray`, `fta_page`, `fta_transfer` (`src/looks/upsc_rich_b/fta/CONTRACT_FTA.md`) |
| Length | 2 min 49 s at the estimated pace (11 scenes) |

**Facts.** The repair's cases and articles are locked to `research/upsc/pyq/2022-gs2-2/claims.csv` and
`research/upsc/POL-03/claims.csv`: Article 19(1)(d), (e) and 19(5) (2022-GS2-2-01, -02), citizens only (POL03-A11),
Gurbachan Singh 1952 (-05), Ebrahim Vazir Mavat 1954 (-07), Maneka Gandhi 1978 (-10), Anuradha Bhasin 2020 (-11). The
reference answer the repair works towards is `research/upsc/pyq/2022-gs2-2/ANSWER.md` (132 words); the transfer
question's is `research/upsc/pyq/2017-gs2-12/ANSWER.md`, held back until viewers have tried it.

**The page after the repair** keeps about 103 words of the 120–150 budget, and the narration says the room left is for the
Emergency limit (Article 358) from the full answer.

## Before this is published
- [ ] The Mains mentor checks the diagnosis (A2) and that the four cases are the right ones to show.
- [ ] Watch the draft on the Mac (Noteworthy handwriting) and voice it with Maya.
- [ ] A way to collect viewers' answers exists before the last line promises it.

# UPSC episodes: production pipeline (AK, 3 Nov 2026)

**AK's rule:** Gemini does the research and writes the first draft. Claude checks the research and the script and makes the
changes. The Gold Standard (`GOLD_STANDARD.md`) still decides what may go on screen: Gemini's output is a lead, never evidence.

| # | Step | Who | Tool | Output in `research/upsc/<id>/` |
|---:|---|---|---|---|
| 0 | Pick the next episode | planner | `scripts/upsc/planner.py` | `docs/upsc/planner/QUEUE.md` |
| 1 | NCERT pass: reads the mapped NCERT chapters, writes the checklist, NCERT claims and the questions that need other sources | Gemini | `gemini_draft.py <id> --step research` | `gemini/research.json`, `research_raw.md` |
| 2 | Search pass: one question a call with Google Search; sources taken from the pages Google returned, official publishers only | Gemini | `gemini_draft.py <id> --step search` | adds `S..` claims, `gemini/grounding.json` |
| 3 | First draft of the part's script, from the checked-out ledger only, to the storytelling v2 rules | Gemini | `gemini_draft.py <id> --part N --step draft` | `gemini/draft_pN.json` |
| 4 | Check the research: open every claim the script uses at its source; fix value, attribution, strength; fill gaps the map shows; write `claims.csv` and `CHECKED.md` | Claude (with Sonnet checkers for the source reading) | | `claims.csv`, `CHECKED.md` |
| 5 | Revise the script: facts to the checked ledger, depth checklist, ELI5 rungs, story rules; `script_tool.py --story-check` | Claude | `script_tool.py` | `script_pN.py`, `SCRIPT_PN.md` |
| 6 | Independent line-by-line audit (gate S5) | Sonnet | | `SCRIPT_PN_AUDIT.md` |
| 7 | Storyboard, build, render, frame check | Claude + Sonnet builders | `mmvideo-dk-upsc` worktree | |
| 8 | Young-viewer test and subject reviewer (E1, R1), then voice | AK | | |

**Rules for the Gemini steps:** run inside `zsh -lic` on the Mini (the key is never printed). Model `gemini-3.1-pro-preview`.
Gemini sees our local NCERT text only to read it; nothing of it is published. A Gemini claim whose source host did not
come back in that call's search results is treated as unsearched. "NOT FOUND" and "UNOFFICIAL ONLY" answers go to open items.

**What the first test showed (POL-41, 3 Nov 2026):** with the search tool on and a long prompt, Gemini answered from
memory and ran no searches; a plain one-question prompt makes it search. Hence steps 1 and 2 are separate calls.
The run then stopped on HTTP 402: the Gemini API project's prepaid credits are used up (AK tops up in AI Studio).

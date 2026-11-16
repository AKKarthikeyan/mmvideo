# Fix This Answer episodes in look B: contract (15 Nov 2026)

The lead long format of the UPSC Mains channel (`docs/UPSC_MAINS_PLAYBOOK.md` §3a): one question, one answer, one named
mistake, repaired on the page, then a fresh question that needs the same repair. It is drawn in look B with the answer-video
kit, so it looks like the PYQ answer videos (`../pyq/CONTRACT_PYQ.md`; read that and `../CONTRACT_B.md` first).

## Sources of truth
- **Episode module** `research/upsc/fta/<id>/fta.py`: the page lines (the illustrative answer and the repair), the notes, and
  the narration beats with their scenes, ops and reveal words. The question and the transfer question are read from their
  answer modules (`research/upsc/pyq/<id>/answer.py`), with their budgets and minutes.
- **Builder** `python3 scripts/upsc/fta_storyboard.py <id>` writes `public/datayt/long/upsc/<id>/storyboard.json`, then runs
  `scripts/datayt/long_timeline.py` for the estimated timeline. It stops if a number on screen is not in the claims it cites
  (the illustrative answer's own numbers are listed, not locked), if a reveal word is not in its narration, if the narration
  differs from the module, or if the words left on the page differ from what the narration says.
- Set `UPSC_MAIN=<main checkout>` when the research lives in another checkout.

## Scene kinds (`fta/scenes.tsx`, player `fta/FtaLong.tsx`, entry `fta/index.tsx`)
Also used: `pyq_question`, `pyq_xray`, `pyq_card` (unchanged, from `../pyq/scenes.tsx`).

1. **fta_page** `{stamp, items, demands, budget, minutes, notes, ops0, ops}`: the ruled booklet on the desk. `items` are the
   page lines in order (`orig`: the illustrative answer, in pencil; `head` and `new`: the repair, in ink). `ops0` are the ops
   of earlier scenes, already applied; `ops` play in this scene, each from `at(key)`:
   `write` (ids appear, quickly), `stamp` (the ILLUSTRATIVE stamp), `ring` (a red loop round ids, with an arrow to the note),
   `gap` (an amber bracket and "?" in the margin), `strike` (red line through each row), `remove` (the item collapses),
   `insert` (the item opens and is written), `status` (a job box turns `miss`, `part` or `ok`; optional `word` replaces the status label), `note` (a note card:
   `diag` red, `gap` amber, `rubric` plain), `count` (the word card pulses). The page scrolls to keep the last written line
   in view. The word card counts the words actually on the page.
2. **fta_transfer** `{label, credit, text, skill, limits, checks, cta}` with keys `q`, `sk`, `lm`, `c1`, `cta`: the fresh
   question on exam paper, the skill and the limits on a card, the self-check list in pen, the call to write first.

## Rules that are the format's, not the look's
- While the answer is ours, the stamp reads ILLUSTRATIVE · WRITTEN BY US, NOT A CANDIDATE'S COPY on every page scene. A
  real aspirant's answer needs written consent, is anonymised, and changes the stamp; it never loses it silently.
- Job boxes show our rubric (answer standard A1–A12), never a mark.
- A content gap is flagged (amber) and taught first; only writing gaps are repaired on the page.

## Render
Stills: `npx remotion still src/looks/upsc_rich_b/fta/index.tsx FTA-01 <png> --frame=<n> --scale=0.5`.
Draft: `npx remotion render src/looks/upsc_rich_b/fta/index.tsx FTA-01 out/upsc/fta/FTA-01_draft.mp4`.
Final: `FTA-01-60` at `--scale=1.3333333333333333 --crf=18` (60 fps, 2560 x 1440), voice as in `../pyq/CONTRACT_PYQ.md`
(`LONG_DIR=public/datayt/long/upsc/fta-01`, `voice-maya`, `words`, then `long_timeline.py --words`, then `mix`).
Handwriting is Noteworthy (macOS); a render on Linux falls back to a serif, so judge the handwriting on the Mac.

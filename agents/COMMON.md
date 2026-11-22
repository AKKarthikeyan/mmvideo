# Rules every role shares (v1.1, 22 Nov 2026)

Written from the dry run on `productions/mm-asianpaints-dealers/` (its `STATUS.md`, "Dry-run notes", holds the 48
problems this file answers). Where this file and a contract disagree, the contract is wrong: fix it.

## 1. Which rules a channel uses

| Channel | Research rules | Research folder |
|---|---|---|
| Indica Atlas, Moat Atlas | `docs/geo/RESEARCH_RULES.md` | `docs/geo/research/<id>/` |
| The Inventor's Desk | `docs/inventors_desk/RESEARCH_RULES.md` | `docs/inventors_desk/research/<id>/` |
| Moat & Margin (until AK names its own file) | `docs/inventors_desk/RESEARCH_RULES.md` for tiers, statuses and the folder shape; section 2 below for tiers of company documents | `productions/<id>/research/` |
| Any other | the file `/Volumes/DarwinSSD/AGENTS.md` rule 2 names; if none, as Moat & Margin | `productions/<id>/research/` |

**Shorts mode** (the Shorts section of `docs/geo/RESEARCH_RULES.md`: 2–3 primary sources, then stop) applies to a
Short on any channel when the brief says "Research mode: Shorts".

## 2. Sources, tiers and "company says"

- A company's own annual report, investor presentation, exchange filing or call transcript is **P4**. A court
  judgment or regulator order is **P2**. Use these codes only, whatever older rule files say.
- Every source a company or other party publishes about itself gets `"self_claim": "<who>"` in `sources.jsonl`
  (e.g. `"self_claim": "Grasim"`). Every claim resting only on such a source repeats it in `claims.jsonl`. Article,
  script and screen must then say "<who> says" (or show "<who>'s figure"). Audited tables (BRSR with reasonable
  assurance, audited accounts) still carry `self_claim`; the notes may say they are audited.
- Allegations (in a complaint, a regulator's prima facie view, a petition) are recorded as allegations and narrated
  as allegations, always naming who alleges.
- A search engine, news site or aggregator may be used **only to find the official URL**. It is never evidence.
- A copy hosted off the publisher's site (a court judgment on a news CDN) counts as the publisher's copy only when it
  carries the publisher's own marks (neutral citation, court upload/download footer, signature stamp) and nothing
  suggests it was altered. Record which marks you checked. Before publishing, someone compares the passages we use
  with the publisher's own copy; note that in `open_questions.md`.

## 3. File formats (what `docs/inventors_desk/scripts/research_check.py` reads)

- `claims.jsonl`, one JSON per line: `id` (`C001`…), `claim`, `type` (`number`, `event`, `quote`, `visual`, …),
  `spine` (true/false), `status`, `evidence: [{src, locator, quote, quote_lang, translation}]`, `notes`, and
  `self_claim` where section 2 says.
- `sources.jsonl`: `src` (`S01`…), `tier`, `kind`, `title`, `creator`, `created`, `accessed`, `url`, `archive_url`,
  `local_file` (`;`-separated, PDF first then its `.pages.txt`), `language`, `origin`, `access`, `self_claim`.
- `myths.md`: a table whose rows start `| M<n> |`; column 3 is the verdict, one of Confirmed, Confirmed (secondary
  only), Contradicted, Embellished, Unverifiable.
- `dossier.md`: must contain a line starting `G7: PASS` or `G7: FAIL` (the researcher proposes it; section 6).
- `verify.md`: first line `G6: PASS.` or `G6: FAIL.` and one sentence.
- `script.json`: `{ "id", "beats": [ {"key", "say", "caption", "claims": [...], "pause", "link", "label", "source"} ] }`.
  A beat with no fact sets `"no_fact": true`. `label` is `"fact"` (default), `"our reading"` (an inference drawn
  from the cited claims) or `"illustration"`. `link` is the beat's logical link to the next: `BUT` or `THEREFORE`.
  Shorts may add `loop`, `hook_overlay`, `disclaimer`. The gate checks only `claims`/`no_fact`; the reviewer checks
  `label`.
- Worked example of every file: `productions/mm-asianpaints-dealers/research/` (dry run, cleared 22 Nov 2026).

## 4. Claim statuses

From `docs/inventors_desk/RESEARCH_RULES.md` 4.2. **Narratable:** VERIFIED-P, CORROBORATED (both may be spine);
SECONDARY-ONLY (hedged, never spine); RECOLLECTION (attributed); DISPUTED (only as a dispute, or only its confirmed
part when the fact-checker's note names that part). **Not narratable:** UNVERIFIED, CONTRADICTED (except as the myth
being corrected).

A claim that is half right (a confirmed number beside a wrong one) is set to **DISPUTED** by the fact-checker, with a
note naming the usable part; the research role then splits it into two claims.

## 5. Gate output

`research_check.py` exits 0 only when every gate passes. Until the fact-checker writes `verify.md`, the expected
result is every line PASS except G6, the last line `NOT CLEARED`, exit 1. That is a correct research handover.

## 6. Judgement gates

- **G7 (fresh angle):** the researcher writes a proposed `G7: PASS` or `G7: FAIL` line with one sentence of reasons;
  the fact-checker re-judges it and records agreement or the change in `verify.md`.
- **G6:** the fact-checker only.

## 7. PDFs

- Save a page-marked text extraction beside every PDF: `sources/<name>.pages.txt` with `=== PDF PAGE n ===` markers,
  and list it in `local_file`. The gate's quote re-find reads only `.txt`/`.html`/`.json`.
- Locators: `PDF p.N (printed p.X, section)`. PDF page first, because scripts and checkers use it; printed page in
  brackets for a person with a viewer. Annual reports are often spreads (two printed pages per PDF page).
- Text from PDFs has non-breaking hyphens, soft hyphens and odd spaces: normalise them before matching quotes.

## 8. Saved copies travel only on the Mac Mini

`sources/` is git-ignored (public filings can be tens of MB). So the saved copies exist only on the SSD. A role in a
cloud session re-fetches each source from its `url`, or hands the step to the Mac Mini; say which in `STATUS.md`.
`LOCAL_ONLY.md` lists only copies we may not redistribute (papers, news, paid reports); public filings and judgments
need no entry.

## 9. Working on the Mac Mini over `ssh mini-ts`

- A non-interactive shell does not have `/opt/homebrew/bin` on PATH: call `/opt/homebrew/bin/<tool>` or run
  `zsh -lic '<command>'`.
- `/usr/bin/python3` has PyMuPDF (`import fitz`); Homebrew's `python3` does not.
- Edit files with python or a heredoc, not `sed -i` (macOS sed differs and multi-line patterns break).
- A session over SSH cannot watch video or hear sound. Where a rule says "watch", read the script/code and a contact
  sheet of stills instead, and say so.

## 10. Shorts track (AK, 22 Nov 2026)

- **Length and word budget:** `docs/SHORTS_RULES.md` is the authority (H1 length, H5 pace, H6 at most 10 beats and
  140 words; section 3 timings). `docs/SHORTS_FORMAT.md`, `docs/storytelling/SHORTS_ENGINE.md` and `STORY_ENGINE`'s beat grid defer to it where
  they differ.
- **Frame 0 vs the reveal:** frame 0 and the first line carry the hook (the most surprising picture or the title's
  promise); the explanation and the reveal still land about two-thirds in. Packaging checklist item 9 is met by the
  hook, not by giving away the reveal.
- **Director:** a short treatment (section 3 of `05_director.md`) and a **key-frame board** that AK reviews in place of
  an animatic.
- **Kit:** HyperFrames (`hyperframes/README.md`, `hyperframes/tools/shorts_build.py`), the only kit with a vertical
  Shorts path.
- **"But/therefore"** means the logical link between beats, recorded in `script.json` `link`; it need not be the spoken
  word (`docs/storytelling/SHORTS_ENGINE.md` SH3 allows one spoken "but").

## 11. Pictures of documents (AK, 22 Nov 2026)

- Close-ups of companies' own published filings and of court judgments and regulator orders are **cleared by
  default**. Anything else (photos, logos used as art, news images, people) needs AK's OK before style frames.
- On any document close-up, crop or defocus every figure the voice does not say. Never show a DISPUTED, UNVERIFIED or
  CONTRADICTED figure, even in passing. The researcher flags such pages in the dossier's "Visual material"; the
  director writes the crop into the shot list; the reviewer checks it.
- Every music and sound-effect file used is listed with its licence in `TREATMENT.md` (sound plan).

## 12. Open for AK (not decided by these contracts)

- A research-rules file of Moat & Margin's own.
- Moat & Margin's channel accent colour (the dry-run director proposed highlighter yellow).
- A Moat & Margin audience profile in `docs/storytelling/STORY_ENGINE.md` section 5 (until then use
  `docs/SHORTS_RULES.md` section 8's Moat & Margin row).
- A Moat & Margin benchmark Short in `hyperframes/shorts/`, with its render kept on the Mac Mini.
- The Bhagyaraj and Nolan skills that STORY_ENGINE S13 names do not exist; until they do, S13 is done by hand and
  marked "PASS (by hand)".
- STORY_ENGINE section 4 asks for format rotation, but nothing records each channel's last format; a per-channel
  log is needed before the rule can be checked.
- Short versions of DIRECTOR.md section 5's "at least four kinds of move" and "one long held shot".

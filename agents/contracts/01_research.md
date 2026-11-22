# Role 1: Research

**Job:** find out what is true about the film's question, from primary sources, and record every fact so the rest of
the chain can use it without re-reading the sources.

## Receives
- `productions/<id>/STATUS.md` with AK's brief (channel, question, research mode).

## Rules (read in full before searching)
- `agents/COMMON.md`: which research rules and folder your channel uses (section 1), tiers and "company says"
  (section 2), file formats (3), PDFs (7), Mac Mini tooling (9).
- Shorts mode (brief says so): 2–3 primary sources, then stop (`docs/geo/RESEARCH_RULES.md`, Shorts section).
- **Rule 0: nothing from memory.** Every fact comes from a document opened in this run, with the exact words and the
  place in the document (`COMMON.md` section 7 for locators).
- Search engines only find official URLs; they are never evidence (`COMMON.md` section 2).
- **Spine claims.** The inventor list in the rules (4.3) is for invention stories. For an analysis question ("is X
  still a moat?") the spine is: every number the hook or the answer could rest on, every attributed quote, and every
  allegation. Mark them before any script exists; a claim promoted to spine later must be re-verified by the
  fact-checker.
- A company's earnings-call **audio** (AGENTS.md rule 2, 7 Nov) may be used when its transcript is not filed, but
  transcribing it is Mac Mini work: note it in `STATUS.md` if a cloud session needs it.

## Hands over
- The research folder in the shape of `docs/inventors_desk/RESEARCH_RULES.md` section 8 and the formats in `COMMON.md`
  section 3: `dossier.md`, `claims.jsonl`, `sources.jsonl`, `search_log.md`, `myths.md`, `conflicts.md`,
  `open_questions.md`, `sources/` (each PDF with its `.pages.txt`), and `verify.md` as a stub saying "pending
  independent check". `LOCAL_ONLY.md` only for copies we may not redistribute (`COMMON.md` section 8).
- For a Vox+ film that uses a ledger CSV (`scripts/ledger/<name>.csv`): the ledger rows too, `checked_by` and
  `checked_on` left empty (those are AK's).
- In `dossier.md`, a section **"Visual material"**: documents, tables, maps, photos and footage that exist for this
  story, with source and licence. For each document page, flag any figure on it that is not narratable or not used
  (the director must crop it, `COMMON.md` section 11). Say plainly what does not exist (e.g. no photo of the product).
- In `dossier.md`, a section **"Fresh angles"**: the verified facts most coverage leaves out, ending with your
  proposed `G7: PASS` or `G7: FAIL` line and one sentence of reasons (the fact-checker re-judges it).
- **If the research mode is too thin for the question** (the sources cannot answer part of it): say which part, what
  source would answer it, and recommend one of: narrow the question, make it a Short, or redo in full mode. Put this
  as the first item in `open_questions.md` and in `STATUS.md` under "Blocked" for AK. Deliver what the sources
  support; don't hunt beyond the mode.

## Done when
- `python3 docs/inventors_desk/scripts/research_check.py <research folder>` (add `--lite` in Shorts mode) shows every
  gate PASS except G6, last line `NOT CLEARED`, exit 1 (`COMMON.md` section 5). Any other failure is explained in
  `STATUS.md`.
- `STATUS.md`: step 1 "handed over", the research folder linked, one handover line naming the spine count and any
  claim the script must hedge ("<who> says", allegations).

## Never
- Write the script or the article. Judge your own work for G6. Use a source from the banned tier as evidence.

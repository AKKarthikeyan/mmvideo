# Role 1: Research

**Job:** find out what is true about the film's question, from primary sources, and record every fact so the rest of
the chain can use it without re-reading the sources.

## Receives
- `productions/<id>/STATUS.md` with AK's brief (channel, question, research mode).

## Rules (read in full before searching)
- The channel's research rules:
  - Indica Atlas, Moat Atlas: `docs/geo/RESEARCH_RULES.md`.
  - The Inventor Desk: `docs/inventors_desk/RESEARCH_RULES.md`.
  - Moat & Margin, India Ledger and others: the file named for that channel in `/Volumes/DarwinSSD/AGENTS.md` rule 2
    (Mac Mini). If you can't reach it, use `docs/inventors_desk/RESEARCH_RULES.md` and its tiers (company filings and
    regulator documents are P2/P4), and say so in `STATUS.md`.
- Shorts mode (brief says so): 2–3 primary sources, then stop (`docs/geo/RESEARCH_RULES.md`, Shorts section).
- **Rule 0: nothing from memory.** Every fact comes from a document opened in this run, with the exact words and the
  place in the document.

## Hands over
- The research folder in the shape of `docs/inventors_desk/RESEARCH_RULES.md` section 8: `dossier.md`, `claims.jsonl`,
  `sources.jsonl`, `search_log.md`, `myths.md`, `conflicts.md`, `open_questions.md`, `sources/`, and `verify.md` as a
  stub saying "pending independent check". Copies of papers, news and paid reports go in `LOCAL_ONLY.md` and stay on
  the SSD (the repo is public).
- For a Vox+ film that uses a ledger CSV (`scripts/ledger/<name>.csv`): the ledger rows too, `checked_by` and
  `checked_on` left empty (those are AK's).
- In `dossier.md`, a section **"Visual material"**: documents, tables, maps, photos and footage that exist for this
  story, with source and licence. The director needs this to find visual anchors.
- In `dossier.md`, a section **"Fresh angles"**: the verified facts most coverage leaves out (gate G7).

## Done when
- `python3 docs/inventors_desk/scripts/research_check.py <research folder>` (add `--lite` in Shorts mode) passes
  every gate except G6 (that is the
  fact-checker's), or each failure is explained in `STATUS.md`.
- `STATUS.md`: step 1 "handed over", the research folder linked, one handover line.

## Never
- Write the script or the article. Judge your own work for G6. Use a source from the banned tier as evidence.

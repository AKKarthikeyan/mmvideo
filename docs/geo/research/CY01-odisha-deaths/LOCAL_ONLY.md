# Local only: do not commit

`sources/` holds saved copies of third-party documents, kept on the SSD for re-checking quotes (RESEARCH_RULES.md 7). Commit only the .md and .jsonl files in this folder.

- **Copyrighted paper:** `mausam_2006_v57_449.pdf/.txt/.html` (Kalsi 2006, MAUSAM; CC BY-NC per the journal page, still kept local).
- **Government of India / Government of Odisha documents** (IMD reports, SRC annual reports, OSDMA pages and handbook, the Fani DLNA): `imd_*`, `src_*`, `osdma_*`. Government works are copyrighted in India; keep local.
- **World Bank / ADB text:** `wb_phailin_rdna_2013.txt` (CC BY 3.0 IGO; local anyway).
- **Derived files** made by the agent: `imd_rsmc_1999.ocr.txt`, `src_annual_2001-02.ocr.txt` (machine OCR), `imd_rsmc_1999_transcript.txt` (hand transcription of three scanned pages), `*.raw.txt` and `*.txt` (pdftotext). These may be committed if wanted, but they reproduce document text, so leave them here.
- No news pages were saved.
- The SRC Titli list (`src_annual_2018-19.*`) names every person who died: never show those names on screen.

## Edited extraction (27 Oct 2026)
`sources/osdma_fani_dlna_2019.raw.txt` differs from the unedited extraction `sources/osdma_fani_dlna_2019.raw.orig.txt` (made with plain `pdftotext`, no `-layout`; line 27126) in one line: `married <18 years` became `married &lt;18 years`, so the quote checker could read the file. That table is used by no claim. The PDF itself is unchanged and is the evidence.

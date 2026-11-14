G6: PASS

Checker: independent, 8 Nov 2026, Shorts lite mode. First pass (earlier today) failed C009; this is the re-check of what changed.

| Item | Result | Evidence |
|---|---|---|
| Spine list | PASS | claims.jsonl spine = C001, C003, C004, C005, C006, C008 (C009 now non-spine) |
| C001, C003, C004, C005, C006, C008 | PASS | Unchanged; verified in the first pass against saved copies and live archive.org copies (S01, S03 identical; S02 live scan india.history.resource.112090) |
| C009 new wording | PASS | DISPUTED, hedged. Quotes present in saved S02: p.343 "only on the 18th October 1748"; p.348 "sanction, which was obtained on the 18th October 1748" and "After a period of five years the treaty was finally ratified on the". Live scan gives the date as 15th August 1753 (saved OCR reads 1758, noted by the researcher; 1753 confirmed live) |
| 2636 days / 7.2 years | PASS | Not in dossier.md, myths.md, conflicts.md or method/; dates.py output identical to dates_output.txt |
| Dossier wording | PASS | Beat 9, twist 3, M2: "the peace treaty came years later", hedged with C009 |

Minor fix (not blocking): open_questions.md wording-risk 1 still says "peace came only in 1748 (C009)"; change to "the peace treaty came years later (C009)".

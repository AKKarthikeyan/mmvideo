# W4-03-numerals: independent verification

G6: PASS (lite, 14 Nov 2026; independent checker; 8 spine claims C001-C008 all pass; C012 stays UNVERIFIED and is correctly fenced)

Method: re-opened S01 (saved copy AND fresh Wayback fetch, HTML-stripped), S02 and S03 (saved OCR AND fresh archive.org djvu.txt). The live Bodleian page is behind Cloudflare and was not bypassed; the 30 Sep 2017 Wayback copy was used, as in sources.jsonl.

| Claim | Result | Evidence |
|---|---|---|
| C001 | PASS | S02 lines 110-111 "Incipit liber Abaci ... In Anno. M * cc* ij.°" and line 197 "Nouem figure imiorum be sunt" (OCR of indorum hee; chapter list reads yndorum). Fresh copy has the same lines. |
| C002 | PASS | S02 line 200 "quod arahicc zephirum appellatur" (OCR of arabice). Present in fresh copy. |
| C003 | PASS | S02 line 135 "publicus scriba in duana hugee pro pisanis mercatoribus", line 138 "per noucm figuras indorum intro-". Present in fresh copy. Boy/abacus "some days" at lines 136-137. |
| C004 | PASS | S03 lines 29, 34, 41 verbatim. |
| C005 | PASS | Stray "<" confirmed: S03 line 72 reads "u<" in the OCR of "almucabalah"; it breaks research_check's tag stripper, not the quote. Line 123 "Et inueni quod operati sunt yndi ex his differentiis" and lines 141-143 "circulum paruulum in simi- / litudine .0. litere ... differentia unitatum esset uacua" verbatim, both in saved and fresh copies. WARN is a checker artefact. |
| C006 | PASS | All four quotes found in saved and fresh S01 (text-stripped). |
| C007 | PASS | "buried in a field in a village called Bakhshali, near Peshawar, in what is now a region of Pakistan"; "presented it to the Bodleian Library in 1902, where it has been kept since". |
| C008 | PASS | Re-ran numerals_measure.py with python3 -I: output identical to saved; 1202-201=1001, 1202-400=802, 1202-628=574. "628 AD" in S01. Dating basis is consistent (all AD years as printed). |
| C011 | PASS (non-spine) | Re-run output matches: 5,280 / 896 / 2,505 / 5,978 km. |
| C009, C010 | PASS (non-spine) | Quotes found (C009 in S01; C010 at S02 lines 142-143). |
| C012 | UNVERIFIED (honest) | OCR "hugee" only; keep Bugia/Béjaïa and Baghdad out of the script. |

Statuses: VERIFIED-P for texts is fair (the sources are the primary texts, in 1857 editions); S01 is a holder's release, so C006 stays "the Bodleian says". C009 SECONDARY-ONLY is honest. myths.md verdicts match. Every "safe to say" line 1-10 maps to a passing claim.

## Wording risks (step 5), for AK
1. Loop candidate 2, "Europe named them after the people it learnt them from, not the people who made them": goes beyond the claims (no source says who "made" them, and C002 shows Arabic does play a role). Reword or drop.
2. Loop candidate 1 and the verdict "Contradicted" for M1: fine if said as "the books call them Indian"; do not say "the Arabs did not contribute". S03 is a Latin version of an Arabic-language text, which the dossier should say on screen.
3. Loop candidate 3, "the zero inside every one of your": S01 says the symbol "evolved from a dot"; add "evolved from".
4. Camera move Peshawar to Pisa is a measured line, not a transmission route; never caption it as the route. Peshawar is in Pakistan (dossier already says so).
5. Hook "That's what your school called them" and "The belief" are unsourced; the dossier already flags this.
6. Fresh angle 4 "oldest Indian zero": keep "carbon-dated by the holder, as early as" and some leaves.
7. Nationalist-overstatement scan: no "India invented zero/numerals" sentence found; M2 correctly keeps Babylon and Maya.

research_check.py (--lite) after this file: see report.

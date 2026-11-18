G6: PASS. Independent re-check of 11 claims, 23 evidence quotes and 8 script beats (4 Nov 2026).

# X1 Tamil Nadu northeast monsoon: independent verification (G6), 4 Nov 2026

Verifier: a separate Claude subagent (Sonnet, low effort) that did not do the research. It re-opened the three saved IMD text copies and re-ran the arithmetic. Nothing here rests on the researcher's word.

## Result
1. **Quotes:** all 23 evidence quotes are found in the cited text copies, and each supports its claim as worded. No "most", "dry" or "over the Bay of Bengal" is claimed. C004's "after the withdrawal" comes from S01 Background (the quote snippet omits it; the sentence says "after the withdrawal of SWM upto 15°N").
2. **Arithmetic:** `method/shares.py` output is identical to `method/shares_output.txt`. By hand: 442.8/921.4 = 48.06%, 328.5/921.4 = 35.65%, 328.5 + 442.8 = 771.3 mm (83.7%).
3. **Conflicts:** S01 Table-4 TN row reads "428.9 442.8 -3" (actual, normal, departure); S01 prints "47% (428.9 mm)" as the summer share, S03 prints "36% (328.5 mm)"; S01's Background list prints TN 448.9 (a typo for 442.8). K1 and K2 in conflicts.md are accurate.
4. **Beats:** every beat is covered by its listed claim IDs. Two wordings were loose and were changed after the check:
   - b1 said the rain falls "after the summer monsoon has left"; October to December overlaps the withdrawal. Now "after the summer monsoon withdraws" (IMD: "subsequent to the withdrawal of SWM").
   - b8 said "just as India's summer monsoon ends"; the "simultaneous" start is from 2025 only. Now "as".
   - b4 "in October" rests on the onset date (C005) plus the order (C011); no quote dates the withdrawal in October itself. Kept, because the normal easterly set-in is 14 October and onset 20 October.
5. **Contradictions:** none beyond K1 and K2. "Tamil Nadu" is the IMD subdivision including Puducherry and Karaikal.

## Residuals (not blocking)
- The base period of IMD's Tamil Nadu normals is not stated in S01 or S03.
- No archive.org captures (lite run); our saved copies are the evidence.

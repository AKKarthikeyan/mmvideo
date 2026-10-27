# P01 Velcro: verification

G6: PENDING. An independent verifier has not run yet. The researcher (Claude) cannot verify its own work under rule G6.

## What the researcher's own mechanical check covers (research_check.py, 27 Oct 2026)
- Every quote in claims.jsonl was searched for word for word in the saved local copy. All were found except three, which were read from the scanned PDF instead:
  - C013 "Patented Nov. 21, 1961": masthead of US 3,009,235, scan p.5.
  - C015 "about 1000 loops per square centimeter": the scan shows 1000; the online OCR text shows "100 0".
  - C033: a composite of two swisstopo API values, not a sentence.
- The absence claim C012 (no burrs or plants in either patent) was checked by a full-text search.

## For the verifier (fresh context; ledger and sources only)
1. Re-open S01 and S02 (the PDFs in sources/) and check C002, C005, C007, C008, C010, C013, C014 and C015 at their locators. Pay attention to 120 / 30% / 1000 on S02 scan p.5, col. 1.
2. Re-open S05 and check that C021's quote includes "as the story goes".
3. Read S11 on the scan, not the OCR, for C030: ceiling walkway, gym shoes, seven subjects, January 1963, C-131B.
4. Check C028 at S13 (open access).
5. Listen to the RTS films (sources/rts/*.mp4) at the timecodes for C021, C022, C023, C024, C025, C038, C040, C041, C042, C044, C045 and C049. The transcripts are machine-made.
6. Spot-check at least one in three of the rest, chosen at random.
7. Write "G6: PASS" or "G6: FAIL" on the first line of this file, with the reasons.

G6: PASS. All five claims found verbatim in the saved IMD, NDMA and Mausam copies, IMD bulletin, IMD FAQ and NDMA PDFs re-fetched byte-identical (sha256), and spoken numbers match; three minor wording fixes listed.

Verifier: independent G6 check, 3 Nov 2026. Re-fetch dir: scratchpad/verify/. S90, S01 and S10 all HTTP 200 and sha256 identical to sources/. S09 (Mausam) not re-fetched; read from saved OCR. NDMA para 1.7.4 re-read from a fresh pdftotext of the re-fetched PDF.

| claim | quote found | supports wording | re-fetch | note |
|---|---|---|---|---|
| C101 | yes (FAQ Q57: Bapatla-Kakinada, "~ 5-7m" VHRZ, ">5m") | yes, but "~" means approximate | S01 identical | NDMA gives ~8.2 m elsewhere; script uses IMD, fine. See F1 |
| C102 | yes (NB17 (iv): peak surge 1.0-1.5 m above astronomical tides; max over Bapatla, Krishna and Prakasam) | yes: forecast, "warned of" used | S90 identical | b3 omits Prakasam; fine |
| C103 | yes (NDMA 1.7.4, "persistent standing water ... even 11 days after the cyclone landfall ... Krishna delta in May 1990") | mostly: source says standing water seen on satellite, not "floodwater" | S10 identical | see F2 |
| C104 | yes (NDMA Table 1.1 row 21: 1977 Divi Seema 10000; Dube intro: Andhra cyclone, about 10,000, Nov 1977, disasters "directly attributed to storm surges") | yes, "about ten thousand" ok; "mostly to the surge" is a mild paraphrase of "directly attributed" | S10 identical | see F3 |
| C105 | yes (NB17 p1 landfall window) | not spoken (map only) | S90 identical | replace with post-landfall bulletin before final, as noted |

Required fixes
1. F1 (b1): "Five to seven metres" is IMD's approximate "~5-7 m". Reword: "About five to seven metres. That's how high the sea can surge where the Krishna and Godavari meet the Bay."
2. F2 (b4): "Two river mouths, where water lingers" generalises from one 1990 event, and "floodwater" is not in the source. Reword: "In nineteen ninety, satellites still showed standing water in the Krishna delta eleven days after a cyclone." (drop the "where water lingers" line.)
3. F3 (b5): "mostly to the surge" is stronger than the source. Reword: "About ten thousand people died, and IMD's journal blames the surge." (or "...disasters like it are blamed on surges").


## Fixes applied (3 Nov 2026, main session)
All listed fixes applied to script_v1.json and scripts/geo/cyclone.py. Spoken words now 105.

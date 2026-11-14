# W3-06 Kumbh Mela: open questions, gaps and wording risks

## Gaps that matter for the script
1. **A river-bank point for Haridwar.** Natural Earth has no Haridwar; the only coordinate read is the district point 29.58 N 78.13 E from the district's own page (a centroid roughly 40 km from the Ganga at Har-Ki-Pauri). Needed for the pin and for any distance that starts at Haridwar. Candidates: Survey of India sheet, ISRO Bhuvan, Census 2011 town point.
2. **The Skanda Purana (and Narada, Shiva, Brahma Puranas) Kumbh verses** cited by Nashik's page (C011) were not opened (GRETIL listing returned 403; no critical edition reached). Also the Bhagavata search (C026) used one e-text. A Sanskritist could settle "does any Purana name Haridwar, Prayag, Ujjain and Nashik as the Kumbh sites, and where".
3. **Madhya Pradesh's own statement of the Ujjain rule** and the exact 2016 dates (22 April-21 May is seen in PIB/NDRF snippets; only the start date was read in PIB, C015). Look at the MP Simhastha site or Ujjain district portal.
4. **Earliest dated record using "Kumbh".** Leads only: Khulasat-ut-Tawarikh (c. 1695, Persian) and Chahar Gulshan (1789) for Haridwar, Lochtefeld 2008 p. 70 and Sarkar 1901 pp. xv-xvi, 19-20, and Maclean (2008) on Allahabad. None opened (Persian OCR unusable, Sarkar scan HTTP 500, Maclean not available). If the script wants an "earliest" or "since when" line, this needs a Persian reader or the print book.
5. **Haridwar 2021 official dates** (K5): the district page lists 11-27 March; the bathing days the rule points to fall in April. Find the Uttarakhand notification (not the news).
6. **The Lahiri constant** (23 deg 15' 00.658" at 1956-03-21) and the IAU precession we applied were not opened in a source this run (they are our computation convention, recorded in `method/jupiter_signs.py`). A verifier should confirm the constant from the Calendar Reform Committee report or the Indian Astronomical Ephemeris, or re-run the sign checks with another ayanamsa to confirm that no Kumbh event changes sign.
7. **Hardwicke's apparatus.** The OCR line breaks mean the quotes are long-s OCR; check the page numbers and wording (esp. "Mela", "Hurdwar", footnote on 2.5 million) in a clean scan or the 1801 edition.
8. **2010 Haridwar year** rests on the Garhwal page read through a summariser (C031).
9. **CAG 2013 dates** came from the audit page's summary sentence (C015), not the report PDF.

## Not opened / unreachable
- UNESCO consent letters and ICH inventory PDFs (consent: `34701-EN.pdf`, inventory: `33484-EN.pdf`): the built-in browser opened the nomination form but these two were not needed.
- kumbhmela2021.iirs.gov.in (ISRO IIRS): DNS did not resolve.
- garhwal.uk.gov.in in the browser (permission denied): WebFetch only.
- indiawris.gov.in in the browser (permission denied): fetched by curl.
- Persian text of Khulasat-ut-Tawarikh; Sarkar 1901 (HTTP 500); Maclean 2008; Lochtefeld 2008.
- Prayagraj Division gazette PDF (No. 1574/1-5-2018-72-2017, 337 KB) and the Allahabad High Court judgment of 26 Feb 2019.

## Wording risks for AK (⚑ religion, communities, colonial records, a living festival)
1. **Never say the legend is why.** Say "according to the legend", name whose version (Uttar Pradesh's page: four drops). The governments tell it three different ways (K4). Do not show any deity; a drawn pitcher and four drops only.
2. **Do not say the astrology is true or false.** Say "the rule the government pages give" and then "counted with NASA's ephemeris, it matches". We checked that the sky positions match the rule; we did not and cannot check whether the rule is right in any other sense.
3. **Do not say "ancient" or "since time immemorial".** UNESCO's Committee told India to stop saying "intact" and "purest form" (C036); India's own file says nobody knows when the legend started (C025). No origin date is verified.
4. **"Every four years" is India's and UNESCO's summary.** Say "UNESCO's description says", then the real run of years. Do not say UNESCO is wrong; say the description is a summary and the calendar is uneven.
5. **Hiuen Tsang:** we read the translation, not the Chinese original. Say "in the English translation of Hiuen Tsang's Prayaga chapter I read, there is no Kumbh", and only if used; it can look like attacking the nomination. It reports what a Buddhist pilgrim saw, not a Hindu festival.
6. **The 1796 and 1911 records are colonial.** Hardwicke was a Company officer; Nevill an ICS gazetteer compiler. Both are interested parties (order, revenue). Their crowd numbers are estimates (C020, C039). Hardwicke's passage also records a violent clash between Sikh and sannyasi parties on 10 April 1796 (C038): keep out of the Short.
7. **Nashik's akhadas bathe separately because of Peshwa-era clashes (C037):** sectarian violence; keep out.
8. **Rivers:** "the Godavari is not in the Ganga system" is a drainage fact (C027, C028), not a religious claim; the nomination's sentence is faith. Say "by tradition the Godavari is the Ganga of the south" in the same breath, or leave it out. Do not say the nomination is "wrong".
9. **Names:** Allahabad became Prayagraj by a 2018 notification; the municipal resolution was challenged in court (the court called it premature, seen in a search summary only). Say "Prayagraj" and "Allahabad until 2018" once, no commentary. UNESCO still says Allahabad and Nasik.
10. **Crowd numbers:** official figures of tens of crores are promotional or projections (seen as snippets); none is used. Do not say "largest gathering on earth" except as UNESCO's words in quotation.
11. **Disputed borders:** none involved, but Haridwar is near the northern edge: show the national outline only, from the India-POV file.
12. **Voice:** AI-narrated; set "Altered or synthetic content: Yes" (house rule). Pronunciation list in search_log category 10 is a suggestion for AK to confirm.

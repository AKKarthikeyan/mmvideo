# W4-06 Gauges: search log (14-15 Nov 2026, Shorts Lite)

Researcher: Claude (research agent, one run, resumed after a usage-limit pause). Lite mode: 2-3 original sources.
Examined sources: 9 (MoSPI Year Book chapter x4 editions, PIB 2026 backgrounder, PIB 2007 feature, PIB 2023 year-end release, PIB Jan 2026 electrification note, Economic Survey 2025-26 Table 1.26, Lok Sabha USQ 588 of 22.07.2026; plus 9 web searches)
Saturation: partial (lite: the three cited owners settle the 8 spine claims; today's gauge split was NOT found: the owner's site is down)

| What | Query / URL | Result | Kept |
|---|---|---|---|
| WebSearch x9 | Year Book route km by gauge; Project Unigauge; remaining metre/narrow gauge; UNESCO 944 | Official hits: MoSPI chapters, PIB notes, Lok Sabha replies. Tier-X hits (coaching pages, wiki mirrors, indiastat) not opened | leads only |
| curl + built-in browser | indianrailways.gov.in ... Annual Report & Accounts 2023-24 PDF (and NFR mirror of 2022-23) | "Site Under Construction", HTTP 404, both days | unreachable: C11 UNVERIFIED |
| WebFetch / curl | whc.unesco.org/en/list/944 | 403 / "Just a moment" bot check; not bypassed | unreachable: C10 UNVERIFIED |
| curl | eparlib.sansad.in Standing Committee on Railways 8th report | connection timed out | none |
| curl | mospi.gov.in Statistical Year Book ch.19: ch19.pdf (2014 data), Indian Railways-writeup.pdf (2010 data) | gauge widths, 2010 split by gauge, share 72% to 88%, UNESCO lines | S01 |
| curl | mospi.gov.in railways.pdf (2013), railways_1.pdf (2011), INDIAN RAILWAYS-WRITEUP_0.pdf (2009) | same wording, older totals; no gauge table | opened, not cited |
| curl | static.pib.gov.in doc2026415847301.pdf (15 Apr 2026) | gauge categories, 1871 metre gauge, 70,142 BG route km | S02 |
| curl | pib.gov.in relid=24969 (21 Feb 2007) | Project Unigauge 1 April 1992, 13,000 km, "one country, one gauge" | S03 |
| curl | pib.gov.in relid=251887 (2023 year-end); static.pib.gov.in doc202616752101.pdf (Jan 2026: 70,001 RKM BG) | no gauge split | opened, not cited |
| curl | indiabudget.gov.in Economic Survey 2025-26 Table 1.26 | total route km 69.44 thousand (2024-25); no gauge split | opened, not cited (basis differs from S02) |
| curl | sansad.in Lok Sabha USQ 588, 22.07.2026 | "about 99.6% of Broad Gauge (BG) network" electrified; no split | opened, not cited |
| Natural Earth | populated_places_simple | method/gauge_numbers.py: Mumbai, Simla pins | camera notes |

Tier X seen and not used: rrb.iitk.ac.in coaching page, doc.surf / kiwix Wikipedia mirrors, indiastat, dataful, ibef, news sites.

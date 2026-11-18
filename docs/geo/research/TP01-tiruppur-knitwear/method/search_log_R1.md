# Search log R1 (30 Oct 2026) - trade terms and market split

| # | Date | Site / database | Query / action | Hits | Kept / why |
|---|---|---|---|---|---|
| 1 | 2026-10-30 | federalregister.gov (direct fetch) | guessed doc URL 2026/07/28/2026-15000 | 302 redirect to unblock.federalregister.gov (bot check) | Not pursued; no evasion. Used the full-text HTML endpoint found by search instead (served normally) |
| 2 | 2026-10-30 | web search (federalregister.gov, ustr.gov, govinfo.gov) | 91 FR 47318 Section 301 India notice of action | FR doc 2026-15181 (47318-47662), USTR PDF, companion 2026-15274 | KEPT S101, S102 (owner's text) |
| 3 | 2026-10-30 | federalregister.gov full text HTML + ustr.gov PDF (curl) | read item 24 India, DATES, Annex I note 52, Annex II index; grep 6109, IEEPA | India 10% from 24 Jul 2026; 6109 only under Annex II Part O (not India) | KEPT C304, C305 |
| 4 | 2026-10-30 | web search (federalregister, whitehouse, ustr) | EO 14329 India Russian oil 25% terminated/modified | EO 14329, CBP notice 2025-16419, EO 14384, EO 14389, fact sheet 9 Feb 2026 | KEPT S103-S107 |
| 5 | 2026-10-30 | whitehouse.gov, public-inspection.federalregister.gov (curl) | EO 14329, CBP notice, EO 14384, EO 14389, fact sheet | all read | C301, C302 |
| 6 | 2026-10-30 | web search (whitehouse, FR, ustr, cbp) | Section 122 tariff 150 days, India textiles | Section 122 proclamation, US-India joint statement | KEPT S108, S109; apparel treatment under s122 NOT found (annex tables not read) |
| 7 | 2026-10-30 | whitehouse.gov (curl) | s122 proclamation, joint statement | read | C303, C306 |
| 8 | 2026-10-30 | web search (EU domains) | EU-India FTA conclusion 27 Jan 2026, textiles, signature | EC pages, press release IP/26/227, Council docs 11 Sep 2026 | KEPT S110-S112 |
| 9 | 2026-10-30 | commission.europa.eu / policy.trade.ec.europa.eu / presscorner (curl) | pages read | concluded 27 Jan; proposal for signature 11 Sep; signing a later step; press release has 'we have signed' line | C308 (conflict noted) |
| 10 | 2026-10-30 | web search (EU domains) | EU duty 6109 10 00 India Access2Markets | only portal how-to pages; no rate | NOTHING KEPT; C309 UNVERIFIED (portal is script-driven; not attempted) |
| 11 | 2026-10-30 | web search (gov.uk, legislation.gov.uk, commonslibrary) | UK-India CETA entry into force, textiles | GOV.UK news 17 Jun 2026, business.gov.uk, treaty text PDF (TS 30/2026), impact assessment | KEPT S113, S114. Treaty tariff schedule NOT opened, no UK duty rate for 6109 |
| 12 | 2026-10-30 | gov.uk collection page (curl) | uk-india-trade-deal collection | page returned no usable text | nothing |
| 13 | 2026-10-30 | web search (tea-india.org, pib, aepc, texmin) | Tiruppur exports share US EU UK TEA | TEA About page (totals only), TEA news headlines | NOTHING on destination split; C313 |
| 14 | 2026-10-30 | web search (tea-india.org, pib, aepc) | TEA press release country-wise share 2025-26 | same; AEPC newsletters (no shares in excerpt) | nothing |
| 15 | 2026-10-30 | web search (pib, commerce.gov.in, aepc, tradestat) | India apparel exports 2025-26 by USA/EU/UK | PIB releases give totals/growth, no HS 61 destination shares; AEPC Market Focus 2024 PDF (not opened) | not used; went to Comtrade |
| 16 | 2026-10-30 | UN Comtrade public preview API (curl) | India (699) exports HS 61, 2024 and 2025, all partners | 200 and 203 rows, USA/UK/EU27 computed | KEPT S115; C310-C312 |
| 17 | 2026-10-30 | tradestat.commerce.gov.in | not opened (interactive query form) | - | Comtrade used as P4 stand-in; DGCI&S cross-check still open |

Open gaps: Tiruppur-only destination split (none published found); EU duty rate on Indian knitwear; UK treaty rate and phasing for HS 61; DGCI&S cross-check of Comtrade; whether Section 122 was extended after 24 Jul 2026; US-India Interim Agreement signature status.

# POL-03 search log (all on 3 Nov 2026)

Order followed: NCERT, then the publisher of record (Legislative Department, Supreme Court, DoPT, tribal.nic.in), then re-hosts for gaps, each marked. Web searches were used only to find which official page or PDF to open. No search result was used as evidence.

## 1. NCERT (tier 1)
| Source | Outcome |
|---|---|
| `research/upsc/_ncert/` keps202, keps105, hess306, hess307, gess301, gees206, hees205, iest106 and the front pages keps2/hess3/gess3/gees2/hees2/iest1/keps1 `.ps.txt` | Read (keps202 in full; others by heading and the rights passages). Editions in `ncert_map.md`. |
| `_ncert/BookletClass7/8/11.txt` (NCERT List of Rationalised Content, 2022) | Read for the relevant book codes (764, 860, 11102, 11117). |
| Count of "fundamental right" and "reservation" across `_ncert/*.txt` | Used only to find other chapters (keps206, keps203, keps208, hess301, leps208); not read in full. |

## 2. Past papers
| Source | Outcome |
|---|---|
| `research/upsc/_pyq/ocr/` (UPSC papers, OCR) | Prelims 2024 Q76 and Prelims 2026 Q54 found; also Prelims 2025 (ordinance/Fundamental Right; Directive Principle on separating judiciary) and Mains 2026 GS-II (privacy and the Transgender Act 2026 amendment; right to vote). OCR only; option letters not recorded. |

## 3. Constitution and Acts (Legislative Department)
| Source | Outcome |
|---|---|
| `legislative.gov.in/static/uploads/2025/07/95ef4710...pdf` (Constitution as on 10 Sep 2026) | Reused the copy POL-06 downloaded on 2 Nov 2026; 402 pages; all article texts and footnotes in the claims are from it. |
| `legislative.gov.in/sites/default/files/A<year>-<no>.pdf` (old direct links) | HTTP 404 for all eleven tried. |
| `indiacode.nic.in` bitstream PDFs (PoA Act, Child and Adolescent Labour Act, RTE Act, PCR Act, Bonded Labour Act) | HTTP 504 (gateway timeout) on every try on 3 Nov 2026. **BLOCKED** (X01-X04, X07). |
| `socialjustice.gov.in` PCR Act and PoA Act PDFs | HTTP 503. **BLOCKED.** |
| `tribal.nic.in/actRules/SCSTpoaact1989.pdf` | Worked: the 1989 original text only (not the amended text). |
| `labour.gov.in` legislative-provisions pages | Load but are script-built; empty text to curl. **BLOCKED.** |
| `dsel.education.gov.in/.../rte_2019.pdf` | HTTP 404. |

## 4. Supreme Court (publisher of record for judgments)
| Source | Outcome |
|---|---|
| `api.sci.gov.in/supremecourt/2012/35071/35071_2012_Judgement_24-Aug-2017.pdf` (Puttaswamy) | Worked: 547 pages, court's own PDF. |
| `api.sci.gov.in/jonew/judis/5154.pdf` (Maneka Gandhi), `.../judis/9246.pdf` (Olga Tellis), `.../judis/588.pdf` (Venkataramana Devaru), `.../ropor/rop/all/250446.pdf` (Shreya Singhal), `.../supremecourt/2019/1827/...07-Nov-2022.pdf` (Janhit Abhiyan), `.../2019/23618/...05-May-2021.pdf` (Jaishri Patil) | Worked. All court copies. judis 588 is Devaru, not Shirur Mutt (the search engine mislabelled it). |
| Aadhaar judgment 26 Sep 2018 (api.sci.gov.in/.../35071_2012_Judgement_26-Sep-2018.pdf) | Downloaded (6.7 MB) and skimmed; nothing from it is used, so it was removed from `sources/`. |
| `main.sci.gov.in` | No connection (timeout); `api.sci.gov.in` is the working host. |
| `digiscr.sci.gov.in` (eSCR viewer) | No connection. Shirur Mutt (1954) text therefore not obtained. `scr.sci.gov.in` search needs a captcha: **BLOCKED**, not bypassed (X10). |
| Indra Sawhney, Davinder Singh, Jarnail Singh, D.K. Basu, Ajay Hasia, PUDR, Subhash Kumar, Bijoe Emmanuel, Gopalan | Court copy not found by search or direct link. Read on Indian Kanoon (copies of the SCR text). Indian Kanoon throttled rapid requests (a bot check appeared once) so requests were spaced out; no challenge was bypassed. Each claim says 'court copy not reached'. |
| T.M.A. Pai (IK doc 512761) | Downloaded; the copy lists only four judges on its header and was not used for any claim. |
| Shankari Prasad, Sajjan Singh, Golaknath, Kesavananda, Minerva Mills, Property Owners Association | Reused from POL-06 (`sources/reused_from_POL-06/`, links to its saved files). Kesavananda is from the Supreme Court's own site (judgments.ecourts.gov.in/KBJ/). |

## 5. Other publishers
| Source | Outcome |
|---|---|
| DoPT, `documents.doptcirculars.nic.in/D2/D02adm/Compendium.pdf` (OBC instructions, OM 13-8-1990) and `.../D02est/ews faq...pdf` (EWS OM 31-01-2019 FAQ) | Worked. Older OMs; no current DoPT consolidated OM for SC/ST/OBC rates was downloaded. |
| Constituent Assembly Debates, `constitutionofindia.net/debates/09-dec-1948/` (mirror of CAD Vol. VII) | Worked. Third-party mirror; `eparlib.sansad.in` was not retried (POL-06 found it timing out). The 30 Nov 1948 page was also read and discarded (nothing quoted). |
| PIB, MeitY (DPDP Act), egazette (BNSS), NHRC | Not fetched. Marked UNVERIFIED or BLOCKED where a claim depends on them. |

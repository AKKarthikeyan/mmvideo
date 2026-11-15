# POL-06 search log (all on 2 Nov 2026)

Order followed: NCERT, then publishers of record (Legislative Department, Supreme Court, Gazette, Parliament), then re-hosts to fill gaps, with each marked.
Web searches were used only to find which official page to open. No search result was used as evidence.

## 1. NCERT (tier 1)
| Source | Outcome |
|---|---|
| `research/upsc/_ncert/` keps209, keps206, keps201, keps210, leps206, hees204 and the three `*.ps.txt` front pages | Read. Editions and reprints recorded in `ncert_map.md`. keps210 and keps201 do not treat the doctrine. |
| https://ncert.nic.in/pdf/BookletClass11.pdf (List of Rationalised Content, Class XI, 2022) | Downloaded. 11102 Indian Constitution at Work: "No Changes". |
| https://ncert.nic.in/pdf/BookletClass12.pdf (Class XII, 2023) | Downloaded. 12119 Politics in India since Independence: ch.6 "Controversies regarding Emergency" dropped. |
| https://ncert.nic.in/pdf/Revised_Content_2024/Revised_Updated_Content_Political_Science.pdf | Downloaded. Class XI ch.9 pp.205 and 207 updated to 106 amendments; Class VIII note gives Lok Sabha as 543. |

## 2. Constitution and Amendment Acts (Legislative Department)
| Source | Outcome |
|---|---|
| https://legislative.gov.in/constitution-of-india/ and /the-constitution-amendment-acts/ | Loads, but is a JavaScript app: scripts get an empty shell. **BLOCKED** for lists and dates (needs a browser). |
| https://lddashboard.legislative.gov.in/amendment-acts and /node/89822 | No connection (host did not respond). **BLOCKED.** |
| Web search to find direct file URLs, then curl | Worked. Downloaded: Constitution of India as on 10 Sep 2026 (`.../2025/07/95ef4710...pdf`), as on Feb 2026 and Nov 2025; 24th, 25th, 29th, 39th, 42nd, 43rd Amendment Acts. Preface of the 10 Sep 2026 text says it incorporates amendments up to the 106th. |
| 44th Amendment Act PDF, 99th Amendment Act PDF, 106th Act commencement notification | Not found on legislative.gov.in or egazette by search. Read through the Constitution's footnotes (44th) and the Supreme Court judgment (99th); 106th assent read in the Gazette of 28 Sep 2023. |
| Constitution of India May 2022 pocket edition (cdnbbsr.s3waas.gov.in link) | Downloaded; signed by the Secretary, Legislative Department; up to the 105th. Used only as a cross-check. |
| https://www.indiacode.nic.in/ | Reached the front page only (no Act text fetched). |

## 3. Supreme Court (publisher of record for judgments)
| Source | Outcome |
|---|---|
| https://judgments.ecourts.gov.in/KBJ/ (Supreme Court's own Basic Structure Judgment site) | Worked. Full SCR text of Kesavananda (1006 pages), Headnote (86 pages) and Record of Proceedings of 24 Apr 1973 downloaded through the site's own page buttons (no login, no captcha). Explainer pages saved too; they contain loose statements (POL06-D12). |
| https://www.sci.gov.in/ , /constitution/ , /landmark-judgment-summaries/ | Reached. Landmark summaries list shows no records for these cases. Not used for facts. |
| https://scr.sci.gov.in/scrsearch/ (eSCR search) | Needs a captcha. **BLOCKED**, not bypassed. |
| https://digiscr.sci.gov.in/ | Host does not resolve. **BLOCKED** (the SCR site now appears to be scr.sci.gov.in). |
| Shankari Prasad, Sajjan Singh, Golaknath, Indira Gandhi v Raj Narain, Minerva Mills, Waman Rao, I.R. Coelho, NJAC (2015), Property Owners Association (2024) | Court copy not reached. Read on Indian Kanoon (copies of the Supreme Court Reports text; doc ids 1706770, 1308308, 120358, 936707, 1939993, 1124708, 1906027, 66970168, 114205571). Every claim from these carries "copy on Indian Kanoon; court copy not reached". Lead should confirm key lines at the court copy. |

## 4. Parliament and Gazette
| Source | Outcome |
|---|---|
| https://eparlib.sansad.in and https://eparlib.nic.in (Constituent Assembly Debates) | Host resolves but connection times out (two tries, 30-40 s). **BLOCKED.** |
| https://www.constitutionofindia.net/debates/17-sep-1949/ and /25-nov-1949/ | Read as a third-party mirror of CAD Vol. IX and XI. Marked as a mirror in claims G01-G04. |
| https://sansad.in/ , https://loksabha.nic.in/ | sansad.in reached (front page); loksabha.nic.in, loksabhadocs.nic.in no connection. No division record for the 131st Amendment Bill found. |
| https://egazette.gov.in/WriteReadData/2026/271849.pdf | Worked: Gazette Extraordinary 16 Apr 2026, text of the Constitution (131st Amendment) Bill. |
| https://egazette.gov.in/WriteReadData/2023/249053.pdf | Worked: 106th Amendment Act as published 28 Sep 2023. |
| https://www.pib.gov.in/PressReleasePage.aspx?PRID=2253186 | Reached but it is a ministerial speech with party attacks; not used. |
| https://newindiasamachar.pib.gov.in/...M202605011.pdf | Reached; states the 131st Bill vote as 298-230 (government magazine; not the Lok Sabha record). Used as UNVERIFIED. |

## 5. Dead ends and things not done
- Scholars (Andhyarujina, Sathya Narayan, Minattur, Baxi, Dhavan, Tripathi): named only on the Court's own reference list; no book or article read.
- L. Chandra Kumar (1997) and other later cases on judicial review as basic structure: not read.
- Venkatachaliah Commission report: not read.
- Review of Kesavananda (the 1975 review bench): not read.
- Supreme Court Sept 2026 reference on the Election Commissioners law: news summaries only.
- No attempt was made to bypass captchas or blocked hosts.

## 6. Checks run on this dossier
- Every claim row has an anchor phrase that I checked is present in the local text file of its source (and second source): 131 anchors, 0 failures. Anchors prove the text is there; the reading of what it means was done by me and is flagged where the source is thin.
- Spot reads of the full passage (not just the anchor) for: Kesavananda headnote items (PDF p.4-5, 8, 13, 17, 22, 38, 50), signed summary and signatures (p.1005), Sajjan Singh headnote and Mudholkar J., Golaknath HELD, Indira Gandhi (Ray CJ paras 51-65, 132-134; Khanna para 211-213; Mathew paras 344-346; Beg para 696), Minerva headnote and Bhagwati J.'s final lines, Waman Rao paras 17 and 53-55, Coelho conclusions, NJAC order and Chelameswar J. para 120, Property Owners conclusion para 229, Constitution Arts 13, 31, 31B, 31C, 300A, 329A, 368 and footnotes, 24th, 25th, 29th, 39th, 42nd, 43rd Acts, and Ambedkar's 17 Sep and 25 Nov 1949 speeches.

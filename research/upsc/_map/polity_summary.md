# Polity: subtopic map and summary

Built 3 Nov 2026 from the brief `docs/upsc/MAPPING_BRIEF.md`. Mapping only: no scripts, no fact research. Companion file: `polity_subtopics.csv` (602 rows: 464 NCERT headings, 64 syllabus phrases, 74 past-paper question ideas).

**How the rows were made.** NCERT headings and subheadings were read from the PDFs' fonts (heading styles per book), then each was assigned to a catalogue topic by chapter and heading. `words` is the NCERT text under that heading up to the next heading (boxes and captions included; chapter introductions and exercises excluded), so it is approximate (about 75 to 95 per cent of each chapter's text). Page numbers are printed pages; for `leps2` they are counted from the chapter's first page in the contents, so they may be one or two pages out. Small-print run-in headings that are not set in a heading style are not picked up. Past-paper ideas come from UPSC's own nine papers (Prelims GS-I 2024 to 2026, Mains GS-I to III 2025 and 2026) read through rough OCR with a keyword scan; a missed question is possible. Question numbers read from a page image are marked 'verified on page image'; the rest say 'from OCR' and are `unverified`.

## 1. Books used

| Code | Book | Class | Edition on the front pages |
|---|---|---|---|
| keps2 | Indian Constitution at Work (11102) | 11 | First edition March 2006; Reprint 2026-27 (text updated for the 2019 J&K reorganisation) |
| leps2 | Politics in India since Independence (12119) | 12 | First edition June 2007; Reprint 2026-27 |
| keps1 | Political Theory (11117), chapters 5, 6, 8 only | 11 | First edition September 2006; Reprint 2026-27. Eight chapters in print (chapters 9 and 10 dropped) |
| jess4 | Democratic Politics-II (1072) | 10 | First edition March 2007; Reprint 2026-27 |
| iest1 | Understanding Society: India and Beyond, Part 1 (0908) | Grade 9 | First edition June 2026 |
| iest2 | Understanding Society: India and Beyond, Part 2 (0909) | Grade 9 | First edition September 2026 |
| hees1 | Exploring Society: India and Beyond, Part 1 (chs 5, 6) | Grade 8 | First edition July 2025; Reprint March 2026 |
| hees2 | Exploring Society: India and Beyond, Part 2 (0882; chs 4, 5) | Grade 8 | First edition June 2026 |
| hess3 | Social and Political Life-III (860) | 8 | First edition March 2008; Reprint 2024-25 |
| gees1 | Exploring Society, Part 1 (chs 9, 10) | Grade 7 | First edition April 2025; Reprint February 2026 |
| gees2 | Exploring Society, Part 2 (ch 6) | Grade 7 | First edition November 2025 |
| gess3 | Social and Political Life-II (764), chapters 1 to 5 | 7 | First edition February 2007; Reprint 2024-25 |
| fees1 | Exploring Society: India and Beyond (681; chs 10 to 12) | Grade 6 | First edition June 2024; Reprints February 2025 and February 2026 |

Tried and not found (HTTP 404 on the `ps.pdf` front page): `fess1` to `fess6`, `iess1` to `iess5` (so the old Class 9 Democratic Politics-I and Class 6 Social and Political Life-I are not online), `fees2` (Grade 6 Part 2 not out), `iest3` onward, `jest1` to `jest6`, `kess`, `lest`, `ieps`, `jeps`, `fesy`, `gesy`, `hesy`, `iesy`, `jesy`, and `keps3`, `leps3`. Also read but set aside as not Polity: `leps1` Contemporary World Politics (international relations), `kesy1`, `kesy2`, `lesy1`, `lesy2` (sociology), `kest1` (Statistics for Economics), and the chapters on geography, history, markets, media, family and community in the Exploring Society and Understanding Society books. All PDFs and text are in `research/upsc/_ncert/`.

## 2. Per topic: chapters, subtopics, words, estimated parts

**Estimate rule (an estimate, not a decision):** parts = the larger of (NCERT words / 1,500) and (subtopics / 8), rounded up, one part about 15 minutes. Subtopics = distinct NCERT headings + syllabus phrases + past-paper ideas for that topic. The Class 6 to 8 books repeat the Class 10 to 12 ideas at a simpler level, so two figures are shown: **all books** (an upper bound, with some repetition) and **senior books** (Class 10 to 12 and Grade 9, which set the depth). The planned column is the number of parts now in `series.csv`.

| Topic | Title | Planned | NCERT chapters used | Subtopics (all / senior) | NCERT words (all / senior) | Est. parts (all / senior) |
|---|---|---|---|---|---|---|
| POL-01 | Why India's Constitution took so long to write | 1 | keps2 ch1 (Class 11 Constitution: Why and How?); keps2 ch10 (Class 11 The Philosophy of the Constitution); hess3 ch1 (Class 8 The Indian Constitution); gees1 ch10 (Grade 7 The Constitution of India: An Introduction) | 32 / 23 | 12,555 / 6,125 | 9 / 5 |
| POL-02 | The Preamble: every word was an argument | 1 | keps2 ch10 (Class 11 The Philosophy of the Constitution); hess3 ch2 (Class 8 Understanding Secularism); gees1 ch10 (Grade 7 The Constitution of India: An Introduction); gees2 ch6 (Grade 7 The State); keps1 ch8 (Class 11 Secularism) | 22 / 18 | 13,784 / 10,642 | 10 / 8 |
| POL-03 | Fundamental Rights: what you can actually do with them | 1 | keps2 ch2 (Class 11 Rights in the Indian Constitution); hess3 ch6 (Class 8 Confronting Marginalisation); hess3 ch7 (Class 8 Public Facilities); gess3 ch1 (Class 7 On Equality); gees2 ch6 (Grade 7 The State); hees2 ch5 (Grade 8 Citizenship: Rights and Duties); iest1 ch6 (Grade 9 Democracy); keps1 ch5 (Class 11 Rights) | 33 / 24 | 14,026 / 8,136 | 10 / 6 |
| POL-04 | Writs: the five orders that can stop a government | 1 | keps2 ch2 (Class 11 Rights in the Indian Constitution); keps2 ch6 (Class 11 Judiciary); hees2 ch4 (Grade 8 The Role of the Judiciary in Our Society) | 5 / 4 | 1,780 / 1,449 | 2 / 1 |
| POL-05 | Directive Principles and Duties: promises without a court | 1 | keps2 ch2 (Class 11 Rights in the Indian Constitution); hees2 ch5 (Grade 8 Citizenship: Rights and Duties) | 7 / 5 | 2,777 / 1,360 | 2 / 1 |
| POL-06 | Basic Structure: the case that limited Parliament | 2 | keps2 ch6 (Class 11 Judiciary); keps2 ch9 (Class 11 Constitution as a Living Document); leps2 ch6 (Class 12 The Crisis of Democratic Order); gees1 ch10 (Grade 7 The Constitution of India: An Introduction); hees1 ch6 (Grade 8 The Parliamentary System: Legislature and Executive) | 18 / 16 | 8,189 / 7,764 | 6 / 6 |
| POL-07 | 1975: what the Emergency changed in the rulebook | 1 | leps2 ch6 (Class 12 The Crisis of Democratic Order) | 10 / 10 | 4,505 / 4,505 | 4 / 4 |
| POL-08 | Why India chose a Prime Minister and not a President | 1 | keps2 ch4 (Class 11 Executive); iest1 ch6 (Grade 9 Democracy) | 5 / 5 | 3,089 / 3,089 | 3 / 3 |
| POL-09 | How a bill becomes a law | 1 | keps2 ch5 (Class 11 Legislature); hess3 ch3 (Class 8 Parliament and the Making of Laws); gees2 ch6 (Grade 7 The State); hees1 ch6 (Grade 8 The Parliamentary System: Legislature and Executive) | 18 / 8 | 10,656 / 2,842 | 8 / 2 |
| POL-10 | Lok Sabha v Rajya Sabha | 1 | keps2 ch3 (Class 11 Election and Representation); keps2 ch5 (Class 11 Legislature); hees1 ch5 (Grade 8 Universal Franchise and India's Electoral System); hees1 ch6 (Grade 8 The Parliamentary System: Legislature and Executive) | 14 / 12 | 3,077 / 2,370 | 3 / 2 |
| POL-11 | Anti-defection and privileges | 1 | keps2 ch5 (Class 11 Legislature); leps2 ch5 (Class 12 Challenges to and Restoration of the Congress System) | 6 / 6 | 780 / 780 | 1 / 1 |
| POL-12 | The Cabinet and how a Ministry works | 1 | keps2 ch4 (Class 11 Executive); gees2 ch6 (Grade 7 The State); hees1 ch6 (Grade 8 The Parliamentary System: Legislature and Executive) | 6 / 2 | 2,190 / 1,506 | 2 / 2 |
| POL-13 | What the President can really do | 1 | keps2 ch4 (Class 11 Executive); leps2 ch5 (Class 12 Challenges to and Restoration of the Congress System); hees1 ch5 (Grade 8 Universal Franchise and India's Electoral System); hees1 ch6 (Grade 8 The Parliamentary System: Legislature and Executive) | 11 / 8 | 2,926 / 2,497 | 2 / 2 |
| POL-14 | Governor Chief Minister and the state assembly | 1 | gess3 ch3 (Class 7 How the State Government Works); hees1 ch6 (Grade 8 The Parliamentary System: Legislature and Executive) | 11 / 5 | 3,788 / 0 | 3 / 1 |
| POL-15 | The Supreme Court and judicial review | 1 | keps2 ch6 (Class 11 Judiciary); hess3 ch4 (Class 8 Judiciary); gees2 ch6 (Grade 7 The State); hees2 ch4 (Grade 8 The Role of the Judiciary in Our Society) | 23 / 14 | 4,765 / 3,377 | 4 / 3 |
| POL-16 | High Courts tribunals and how disputes get settled | 1 | keps2 ch6 (Class 11 Judiciary); hess3 ch4 (Class 8 Judiciary); hees2 ch4 (Grade 8 The Role of the Judiciary in Our Society) | 15 / 4 | 5,274 / 176 | 4 / 1 |
| POL-17 | Who does what? Executive legislature and courts | 1 | keps2 ch1 (Class 11 Constitution: Why and How?); fees1 ch10 (Grade 6 Grassroots Democracy Part 1: Governance); hees1 ch6 (Grade 8 The Parliamentary System: Legislature and Executive); iest1 ch6 (Grade 9 Democracy) | 6 / 4 | 1,642 / 735 | 2 / 1 |
| POL-18 | The Seventh Schedule: Union and State lists | 1 | keps2 ch7 (Class 11 Federalism); keps2 ch10 (Class 11 The Philosophy of the Constitution); jess4 ch1 (Class 10 Power-sharing); jess4 ch2 (Class 10 Federalism); fees1 ch10 (Grade 6 Grassroots Democracy Part 1: Governance); gees2 ch6 (Grade 7 The State) | 12 / 11 | 5,981 / 4,790 | 4 / 4 |
| POL-19 | Delhi v the states: where federalism fights | 1 | keps2 ch7 (Class 11 Federalism); leps2 ch2 (Class 12 Era of One-party Dominance); leps2 ch7 (Class 12 Regional Aspirations); jess4 ch2 (Class 10 Federalism) | 31 / 32 | 12,101 / 12,101 | 9 / 9 |
| POL-20 | Panchayats: the 73rd amendment and your village | 1 | keps2 ch8 (Class 11 Local Governments); jess4 ch2 (Class 10 Federalism); fees1 ch11 (Grade 6 Grassroots Democracy Part 2: Local Government in Rural Areas); fees1 ch12 (Grade 6 Grassroots Democracy Part 3: Local Government in Urban Areas); gees2 ch6 (Grade 7 The State) | 24 / 18 | 10,137 / 5,854 | 7 / 4 |
| POL-21 | The Election Commission and the rules of voting | 1 | keps2 ch3 (Class 11 Election and Representation); leps2 ch2 (Class 12 Era of One-party Dominance); hees1 ch5 (Grade 8 Universal Franchise and India's Electoral System); iest1 ch7 (Grade 9 Elections) | 34 / 24 | 16,086 / 12,260 | 11 / 9 |
| POL-22 | Parties coalitions and how India votes | 1 | leps2 ch2 (Class 12 Era of One-party Dominance); leps2 ch5 (Class 12 Challenges to and Restoration of the Congress System); leps2 ch6 (Class 12 The Crisis of Democratic Order); leps2 ch8 (Class 12 Recent Developments in Indian Politics); jess4 ch4 (Class 10 Political Parties); iest1 ch6 (Grade 9 Democracy); iest1 ch7 (Grade 9 Elections) | 42 / 43 | 19,653 / 19,653 | 14 / 14 |
| POL-23 | CAG UPSC and the watchdogs in the Constitution | 1 | none | 3 / 3 | 0 / 0 | 1 / 1 |
| POL-24 | Commissions for rights: SC ST BC women minorities NHRC | 1 | none | 6 / 6 | 0 / 0 | 1 / 1 |
| POL-25 | Regulators: who polices markets and airwaves | 1 | none | 2 / 2 | 0 / 0 | 1 / 1 |
| POL-26 | RTI: the law that lets you ask | 1 | jess4 ch5 (Class 10 Outcomes of Democracy); gees2 ch6 (Grade 7 The State); iest1 ch6 (Grade 9 Democracy); iest2 ch4 (Grade 9 Governance and Public Policy) | 9 / 8 | 4,010 / 3,133 | 3 / 3 |
| POL-27 | e-Governance: what worked and what did not | 1 | iest2 ch4 (Grade 9 Governance and Public Policy) | 3 / 3 | 360 / 360 | 1 / 1 |
| POL-28 | What a civil servant is really for | 1 | keps2 ch4 (Class 11 Executive); gees2 ch6 (Grade 7 The State) | 4 / 3 | 1,514 / 949 | 2 / 1 |
| POL-29 | India's Constitution v the world's | 1 | keps2 ch1 (Class 11 Constitution: Why and How?); keps2 ch7 (Class 11 Federalism); jess4 ch1 (Class 10 Power-sharing); gees1 ch9 (Grade 7 From the Rulers to the Ruled: Types of Governments); gees1 ch10 (Grade 7 The Constitution of India: An Introduction) | 14 / 9 | 4,502 / 2,848 | 4 / 2 |
| POL-30 | Why good schemes fail: design v delivery | 1 | iest2 ch4 (Grade 9 Governance and Public Policy) | 10 / 10 | 3,687 / 3,687 | 3 / 3 |
| POL-31 | Welfare for whom? Laws and schemes for the vulnerable | 1 | hess3 ch5 (Class 8 Understanding Marginalisation); hess3 ch6 (Class 8 Confronting Marginalisation); hess3 ch7 (Class 8 Public Facilities); hess3 ch8 (Class 8 Law and Social Justice); hees2 ch5 (Grade 8 Citizenship: Rights and Duties); iest1 ch6 (Grade 9 Democracy) | 24 / 7 | 13,016 / 474 | 9 / 1 |
| POL-32 | NGOs and self-help groups | 1 | none | 3 / 3 | 0 / 0 | 1 / 1 |
| POL-33 | Pressure groups: power without votes | 1 | none | 4 / 4 | 0 / 0 | 1 / 1 |
| POL-34 | Caste religion and the ballot | 1 | leps2 ch8 (Class 12 Recent Developments in Indian Politics); jess4 ch3 (Class 10 Gender) | 14 / 14 | 5,900 / 5,900 | 4 / 4 |
| POL-35 | Movements that changed laws | 1 | jess4 ch3 (Class 10 Gender); gess3 ch4 (Class 7 Growing up as Boys and Girls); gess3 ch5 (Class 7 Women Change the World) | 18 / 5 | 6,742 / 1,692 | 5 / 2 |
| POL-36 | Four ways to read the freedom struggle | 1 | none | 1 / 1 | 0 / 0 | 1 / 1 |
| POL-37 | The Union and its states: Articles 1 to 4 | 1 | keps2 ch7 (Class 11 Federalism) | 2 / 2 | 322 / 322 | 1 / 1 |
| POL-38 | Who is a citizen of India? | 1 | hees2 ch5 (Grade 8 Citizenship: Rights and Duties); keps1 ch6 (Class 11 Citizenship) | 7 / 6 | 5,947 / 5,512 | 4 / 4 |
| **Total** | 38 Polity topics | 39 | | | | **162 / 117** |

Reading the table: the senior-book total is the better planning figure; the all-books total is a ceiling. Either way the map asks for about three times the 39 parts now planned, which is a decision for the planner (see section 8).

Rows tagged to topics outside the Polity serial (for the Economics and History jobs to pick up): ECO-27 (10), ECO-04 (7), ECO-13 (2), ECO-07 (2), ECO-10 (2), ECO-06 (1), HIS-48 (7), HIS-50 (7), HIS-47 (4), HIS-49 (2), HIS-41 (1), AGR-05 (1).

## 3. Gaps: subtopics with topic NONE (40 rows)

| Group | Rows | Where it shows up | Proposal |
|---|---|---|---|
| Special provisions and tribal areas: Articles 370 and 371, Fifth and Sixth Schedules, Scheduled Areas | 2 NCERT (keps2 ch 7 'Special Provisions', 'Jammu and Kashmir'); PYQ 2025 Prelims Q56, 2026 Prelims Q57, 2026 Mains GS-III Q10 (Ladakh), 2024 Prelims Q84 (ST lists) | New topic POL-39: 'Special provisions: Articles 370 and 371, the Fifth and Sixth Schedules' (one to two parts). Four recent questions make this the clearest gap. |
| Union Territories and their legislatures (J&K after 2019, Delhi, Puducherry) | PYQ 2025 Mains GS-II Q4; keps2 ch 7 J&K text | Join POL-19 as an added part, or put with POL-39. |
| Eighth Schedule and the official language | PYQ 2024 Prelims Q72 | Join HIS-49 (language states and the language question) or POL-37. |
| Concept of democracy and forms of government: what a state and a government are, monarchy, theocracy, dictatorship, oligarchy, early republics, why democracy matters, principles of democracy, types of democracy | gees1 ch 9 (16 rows), gees2 ch 6 (2), iest1 ch 6 (5), fees1 ch 10 (1) | New primer topic POL-40: 'What is democracy? Forms of government and the principles behind them', placed first in Season 1 or as a prelude to POL-08. The syllabus has no phrase for it; it is the base for every later episode. |
| Outcomes of democracy: assessing outcomes, growth, inequality, diversity, dignity | jess4 ch 5 (5 rows) | Join the primer POL-40 as its last part, or fold into POL-30. |
| Foreign policy after 1964: Pakistan wars, Bangladesh war, nuclear policy | leps2 ch 4 (3 rows) | Outside the four-subject plan (international relations). Leave out, with this named reason; HIS-50 covers non-alignment and China to 1964. |
| Policing and criminal procedure (Zero FIR under the BNSS) | PYQ 2026 Prelims (number not legible) | Join POL-16 as part of 'how disputes get settled'. Class 8 SPL-III chapter 6 on the criminal justice system was dropped from NCERT, so this needs other sources. |

Near-gaps (assigned to a topic, but the topic title does not name them): the Attorney General and other constitutional posts (POL-23); Lokpal and anti-corruption bodies (POL-26); women's reservation from panchayats to Parliament (POL-20, also POL-22 and POL-35); Fundamental Duties (POL-05; keps2 prints them only as an appendix); the Ordinance power and the pardon power (POL-13); parliamentary committees and questions (POL-09); Delimitation Commissions (POL-21); judicial activism, PIL and judicial legislation (POL-15).

## 4. Topics with no NCERT chapter at all (other sources needed)

POL-23 CAG, UPSC and the watchdogs; POL-24 commissions for rights; POL-25 regulators; POL-32 NGOs and self-help groups; POL-33 pressure groups; POL-36 four ways to read the freedom struggle. Topics with only a thin NCERT base: POL-27 e-governance (one heading, iest2 ch 4), POL-37 Union and its states (one row, keps2 ch 7 'Demands for New States'; also leps2 ch 1 'Reorganisation of States' filed under HIS-49), POL-11 anti-defection and privileges (two rows), POL-04 writs, POL-17 separation of powers, POL-28 civil services. POL-08 has only three NCERT rows (keps2 ch 4 executive types and jess4/iest1 democracy in practice), none on the Westminster-versus-presidential comparison itself. For these, primary sources are the Constitution, the Acts and the bodies' own sites.

## 5. Rationalised (deleted) NCERT content the syllabus still asks for

From each book's 'Rationalisation of Content' page and NCERT's `BookletClass6` to `BookletClass12` (saved in `_ncert/`):

| Book | Dropped | Syllabus phrase it matters for | Topic |
|---|---|---|---|
| Class 12 Politics in India since Independence | Chapter 7 'Rise of Popular Movements' (pp.128-147, whole chapter); 'Controversies regarding Emergency' (pp.113-117); Chapter 3 pp.54-61 on planned development | Social movements; grassroots movements; pressure groups (PSIR 11, 5, 10); Nehruvian planning (PSIR 8) | POL-35, POL-33, POL-07, ECO-04 |
| Class 10 Democratic Politics-II | Chapter 3 'Democracy and Diversity'; Chapter 5 'Popular Struggles and Movements'; Chapter 8 'Challenges to Democracy' (all whole chapters); one page of 'Political Parties' | Movements, pressure groups, caste and religion in politics | POL-35, POL-33, POL-34 |
| Class 8 Social and Political Life-III | Chapter 6 'Understanding our Criminal Justice System' (pp.66-77); parts of chapters 3 and 4 on Parliament and lawmaking (pp.39-45, 51) | Dispute redressal mechanisms; Parliament and conduct of business | POL-16, POL-09 |
| Class 7 Social and Political Life-II | Chapter 9 'Struggles for Equality' (pp.102-109) | Women's and other movements | POL-35 |
| Class 6 Social and Political Life-I | Chapter 4 'Key Elements of a Democratic Government' (pp.35-40) | Basic democracy concepts | POL-40 (proposed primer) |
| Class 11 Political Theory | Chapter 9 'Peace' and Chapter 10 'Development' (whole chapters) | Not a Polity syllabus phrase | none |
| Class 11 Indian Constitution at Work; Class 9 Democratic Politics-I | No changes listed (the Class 9 book is no longer online; Grade 9 Understanding Society replaces it) |  |  |

Because the deleted pages are not in the current books, anything tagged to these phrases must come from other sources.

## 6. Where two NCERT books or editions differ (one line each)

- Local government: Grade 6 `fees1` teaches Panchayati Raj and urban bodies in three chapters, a whole level earlier than Class 11 `keps2` ch 8, which alone adds the 73rd and 74th Amendment detail.
- Judiciary: Grade 8 `hees2` ch 4 adds tribunals, alternative dispute resolution and digital courts; Class 11 `keps2` ch 6 has judicial activism and PIL but no tribunals.
- Elections: Class 11 `keps2` ch 3 centres on first-past-the-post versus proportional representation; Grade 8 `hees1` ch 5 and Grade 9 `iest1` ch 7 add the Model Code of Conduct, delimitation and the ECI machinery.
- Citizenship: Grade 8 `hees2` ch 5 covers the Citizenship Act 1955 and the 2019 amendment with rights and duties; Class 11 `keps1` ch 6 treats citizenship as a theory (full and equal membership, global citizenship).
- Fundamental Duties: Grade 8 `hees2` ch 5 teaches them with rights; Class 11 `keps2` prints them only as an appendix page.
- Secularism: Class 8 `hess3` ch 2 and Class 11 `keps1` ch 8 treat it as a separate chapter; Class 11 `keps2` ch 10 folds it into the Constitution's philosophy; Class 12 `leps2` ch 8 treats it through communalism and Ayodhya.
- State government: old Class 7 `gess3` ch 3 teaches the MLA, the Assembly and the ministers with a health story; new Grade 7 `gees2` ch 6 covers the state, government and tiers in the abstract and has no chapter on the state legislature.
- Both the old Class 7 and 8 books (reprint 2024-25) and the new Exploring Society books (reprints 2026) are still online, so a student may hold either.
- The J&K text in `keps2` ch 7 (reprint 2026-27) already records the 2019 reorganisation; older prints and the Class 12 book's regional chapter may still show the earlier position, so check dates when a topic builds on them.

## 7. Checks run

- 45 NCERT rows picked at random (seed 7): the heading was searched for on its printed page in the PDF text layer; 45 of 45 found (one failed only because my search string was cut short).
- Word counts: the sum of heading words was compared with each chapter's full text for 12 chapters; it sits at 75 to 95 per cent (the rest is introduction, exercises and page headers).
- Past papers: three Prelims pages (2024 p.27, 2024 p.40, 2025 p.27) were opened as images; the question numbers there are confirmed. One correction found: `topic_hits.md` files the ratification question as 2025 Q56; the page shows Q58 (Q56 is the Fifth Schedule question).
- Of 74 past-paper rows, 9 have question numbers confirmed on a page image and 1 (2024 Q66) comes from `topic_hits.md`; the other 64 carry numbers read from rough OCR (the 2025 and 2026 Mains numbers are clear in the OCR text, the Prelims numbers less so). They are marked in the `note` column; treat them as `unverified` until opened on the image. The idea each question tests was read from the OCR text. The syllabus phrases were checked against the PDF page by search, and each carries its PDF page.

## 8. For the planner to decide

1. The map needs about 117 parts (senior-book basis) to 162 (all books) against 39 planned. Decide which basis sets the part counts, or cap the depth.
2. New topics proposed: POL-39 (special provisions and tribal areas), POL-40 (what is democracy: primer). Also whether UTs and the Eighth Schedule join existing topics.
3. Six topics have no NCERT source (section 4), so they need other primary sources before scripting.

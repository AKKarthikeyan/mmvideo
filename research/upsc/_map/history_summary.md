# History: subtopic map and summary

Built 3 Nov 2026 under `docs/upsc/MAPPING_BRIEF.md`. Mapping only: no facts were researched. Rows are in `history_subtopics.csv` (same folder). Everything below that says "parts" is an **estimate**.

**Rows:** 952 NCERT headings, 289 syllabus phrases, 49 past-paper questions (1290 in total).

## 1. Books used (history chapters only; pdf at `research/upsc/_ncert/<code>.pdf`)

| Code | Book | Class / grade | Edition (front pages) | History chapters mapped |
|---|---|---|---|---|
| fees1 | Exploring Society: India and Beyond, Grade 6 | 6 | 1st ed. June 2024; reprinted Feb 2025, Feb 2026 | ch.4-8 (fees104-108) |
| gees1 | Exploring Society, Grade 7 Part 1 | 7 | 1st ed. April 2025; reprinted Feb 2026; Reprint 2026-27 | ch.4-8 |
| gees2 | Exploring Society, Grade 7 Part 2 | 7 | 1st ed. Nov 2025; Reprint 2026-27 | ch.3-5 |
| hees1 | Exploring Society, Grade 8 Part 1 | 8 | 1st ed. July 2025; reprinted Mar 2026; Reprint 2026-27 | ch.2-4 |
| hees2 | Exploring Society, Grade 8 Part 2 | 8 | 1st ed. June 2026 | ch.2, 3, 8 |
| gess1 | Our Pasts II (old Class 7 History) | 7 | 1st ed. April 2007; revised May 2022 (rationalised); Reprint 2024-25 (March 2024) | ch.1-8 |
| hess2 | Our Pasts III (old Class 8 History) | 8 | 1st ed. March 2008; revised Jan 2019 and Nov 2022 (rationalised); Reprint 2024-25 | ch.1-8 |
| iest1 | Understanding Society, Grade 9 Part 1 | 9 | 1st ed. June 2026 | ch.4-5 (history sections) |
| iest2 | Understanding Society, Grade 9 Part 2 | 9 | 1st ed. Sept 2026 | ch.3 (history section) |
| jess3 | India and the Contemporary World II (Class 10 History) | 10 | 1st ed. March 2007; Reprint 2026-27 | ch.I-V |
| kehs1 | Themes in World History (Class 11) | 11 | 1st ed. March 2006; Reprint 2026-27. Still in print, 7 of 11 themes | all 7 themes + section introductions |
| kefa1 | An Introduction to Indian Art, Part I (Class 11) | 11 | 1st ed. Sept 2012; Reprint 2026-27. Still in print | ch.1-8 |
| lehs1 | Themes in Indian History I (Class 12) | 12 | 1st ed. Jan 2007; Reprint 2026-27 (reprinted April 2026) | Themes 1-4 |
| lehs2 | Themes in Indian History II (Class 12) | 12 | 1st ed. May 2007; Reprint 2026-27 | Themes 5-8 |
| lehs3 | Themes in Indian History III (Class 12) | 12 | 1st ed. July 2007; Reprint 2026-27 (reprinted Dec 2025) | Themes 9-12 (Theme 12 is Polity's) |

Other books seen but **not mapped** (not History): the geography, polity and economics chapters of the Exploring Society and Understanding Society books; gees111 (From Barter to Money); gess2, gess3, hess3, hess4, jess1, jess2, jess4 and the Class 11/12 geography, polity and economics books that other jobs hold in the same folder.

**Probed and not found (404 on `<code>ps.pdf`):** iess1-5 (old Class 9 history/geography, so *India and the Contemporary World I* is not online); fess1-4, fehs1 (old Class 6 *Our Pasts I*); gehs1, hehs1, hess1, hess5 and gess4; fees2 (Grade 6 Part 2), gees3, hees3 and iest3 (no further parts yet); jest1-2 (no new Grade 10 book yet); kehs2-4, lehs4-5, kefa2, kecr1, lecr1, kesa1, kepa1 (no other Class 11/12 history or art parts); ihs1, ihst1, ichs1, jehs1-2, iehs1, khs1, lhis1, kfa1 and a few more guesses. First-round probes with wrong code shapes (khs, kess, lhs and so on) also returned 404. Codes that exist: the 15 in the table above plus leps1 (*Contemporary World Politics*) and leps2 (*Politics in India since Independence*), which are Political Science.

## 2. How the rows were made, and their limits

- NCERT headings were read from the chapter pdfs by font size, colour and style (PyMuPDF), one rule set per book family. `words` is the count of words directly under the heading until the next heading, ending at the chapter's exercises. It includes box text and captions, and leaves out page furniture and exercises. Against an independent whole-chapter count of 24 chapters, the sum of the rows came to 82 to 97 per cent of the chapter's words (two outliers: kefa108 and kehs103, 61 per cent, because of glossary and timeline pages).
- A heading style can hide a sub-section: the Class 12 Themes books number their sections (1.1, 1.2) but a few numbered sub-headings were not caught (for example 4.1 in Theme 7, 6.1 in Theme 6). Words of such a sub-section are folded into the heading above it. Counts are approximate; headings are never invented.
- Class 12 and Class 11 books use 'Theme' numbers after rationalisation, so the numbers differ from older guides.
- `topic_id` follows the catalogue (`docs/upsc/catalogue.csv`). Where a heading belongs to a topic that is inline in the History serial but home in another (ECO-02, ECO-03, POL-01, GEO-32, AGR-06, ECO-04), that other id is used and the note says `other serial`. They are not History gaps.
- Syllabus rows are the phrases of Optional History Paper I (24 items) and Paper II (27 items), PDF pp. 70-76, plus the History lines of Prelims Paper I and Mains GS-I (pp. 32, 34). Society lines of GS-I (diversity, women, urbanisation, globalisation) are Society, not History, and are left out.
- PYQ rows are History and culture questions in 2024-2026 Prelims GS1 (OCR of two-column pages, so only the numbers visible in the OCR are given, others marked 'number unread') and the 2025 and 2026 Mains GS1 papers (question numbers read from the page images).

## 3. Per topic: chapters, subtopics, words, estimated parts

Rule from the brief: one 15-minute part per 1,500 NCERT words or per 8 subtopics, whichever is larger. Subtopics here = NCERT heading rows plus syllabus phrases for the topic. **Two columns are given** because the same ground is told in several books (Harappa is in Grades 6, 7 and 9 and Class 12): the **sum column** follows the brief literally and over-counts; the **deepest-book column** takes only the single deepest NCERT book (or the syllabus phrase count) and under-counts for topics that need several books. Treat the true need as between the two. The existing plan in `series.csv` is shown for comparison.

| Topic | Title | NCERT books used | NCERT rows | Syl. phrases | PYQs | NCERT words | Parts (sum, brief) | Parts (deepest book) | Planned in series.csv |
|---|---|---|---|---|---|---|---|---|---|
| HIS-01 | How do we know any of this? Coins inscriptions and traveller | fees104(Cl6), fees105(Cl6), gess101(Cl7), hess201(Cl8), lehs101(Cl12), lehs102(Cl12), lehs103(Cl12), lehs104(Cl12) | 32 | 4 | 1 | 12619 | 9 | 2 | 1 |
| HIS-02 | From hunters to the first farmers | fees104(Cl6), iest104(Cl9), kefa101(Cl11) | 14 | 4 | 1 | 5430 | 4 | 2 | 1 |
| HIS-03 | The Indus cities: planned and then gone | fees106(Cl6), hees203(Cl8), iest104(Cl9), kefa102(Cl11), lehs101(Cl12) | 44 | 1 | 1 | 13472 | 9 | 5 | 1 |
| HIS-04 | The Vedic age: what the texts tell us | fees107(Cl6), iest105(Cl9), lehs103(Cl12), lehs104(Cl12) | 25 | 5 | 1 | 7215 | 5 | 2 | 1 |
| HIS-05 | Sixteen kingdoms and the rise of Magadha | gees104(Cl7), gees105(Cl7), iest105(Cl9), lehs102(Cl12) | 16 | 7 | 2 | 6238 | 5 | 2 | 1 |
| HIS-06 | Buddha and Mahavira: why new ideas spread | fees107(Cl6), gees104(Cl7), lehs104(Cl12) | 14 | 1 | 4 | 6350 | 5 | 3 | 1 |
| HIS-07 | Chandragupta and the Arthashastra | gees105(Cl7), iest105(Cl9), lehs102(Cl12) | 15 | 3 | 0 | 5533 | 4 | 2 | 1 |
| HIS-08 | Ashoka's edicts: a king writes to his people | gees105(Cl7), gees106(Cl7), iest105(Cl9), kefa103(Cl11), lehs102(Cl12) | 10 | 9 | 2 | 5638 | 4 | 2 | 1 |
| HIS-09 | Silk roads and strangers: Greeks Sakas and Kushanas | gees106(Cl7), iest105(Cl9), jess303(Cl10), kefa104(Cl11), lehs102(Cl12), lehs104(Cl12) | 17 | 2 | 1 | 7144 | 5 | 2 | 1 |
| HIS-10 | Sangam poets and Satavahana traders | gees106(Cl7), gess107(Cl7), iest105(Cl9), lehs102(Cl12) | 14 | 5 | 1 | 3359 | 3 | 1 | 1 |
| HIS-11 | The Guptas: golden age or feudal age? | gees107(Cl7), gees203(Cl7), iest105(Cl9), lehs102(Cl12), lehs103(Cl12), lehs104(Cl12) | 25 | 0 | 1 | 9696 | 7 | 3 | 1 |
| HIS-12 | How to read an Indian temple | gess107(Cl7), hees203(Cl8), iest203(Cl9), kefa106(Cl11), lehs104(Cl12) | 12 | 3 | 2 | 8571 | 6 | 5 | 1 |
| HIS-13 | Pallavas Chalukyas Palas and Rashtrakutas: the tug of war | gees107(Cl7), gees203(Cl7), gees204(Cl7), gess102(Cl7) | 22 | 5 | 1 | 6433 | 5 | 3 | 1 |
| HIS-14 | The Cholas: an empire of ships and village councils | gees204(Cl7), gess102(Cl7), kefa107(Cl11) | 7 | 2 | 1 | 4593 | 4 | 2 | 1 |
| HIS-15 | Zero and beyond: Indian science and mathematics | gees107(Cl7), gees203(Cl7), gees204(Cl7), hees208(Cl8), iest105(Cl9) | 5 | 2 | 1 | 2730 | 2 | 1 | 1 |
| HIS-16 | Bhakti and Sufi: when faith sang in local languages | gess106(Cl7), hees208(Cl8), iest105(Cl9), iest203(Cl9), lehs202(Cl12) | 34 | 1 | 0 | 13652 | 10 | 6 | 1 |
| HIS-17 | Shankara Ramanuja Madhva: three answers to one question | gess106(Cl7) | 1 | 2 | 0 | 171 | 1 | 1 | 1 |
| HIS-18 | Dance music and painting across India | fees108(Cl6), gees107(Cl7), gees203(Cl7), gess107(Cl7), hees203(Cl8), hees208(Cl8), iest105(Cl9), kefa104(Cl11), kefa105(Cl11), kefa106(Cl11), lehs104(Cl12) | 29 | 2 | 3 | 14788 | 10 | 2 | 1 |
| HIS-19 | The Delhi Sultanate: how it began | gees204(Cl7), gess103(Cl7), hees102(Cl8), iest203(Cl9) | 11 | 4 | 0 | 5264 | 4 | 2 | 1 |
| HIS-20 | Alauddin's price controls and Tughluq's copper coins | gess103(Cl7), lehs201(Cl12) | 7 | 4 | 0 | 3104 | 3 | 2 | 1 |
| HIS-21 | Vijayanagara and the Bahmanis | hees102(Cl8), iest203(Cl9), lehs203(Cl12) | 19 | 3 | 1 | 7148 | 5 | 5 | 1 |
| HIS-22 | Babur Humayun and Sher Shah's roads | gess103(Cl7), gess104(Cl7), hees102(Cl8) | 6 | 3 | 0 | 964 | 2 | 1 | 1 |
| HIS-23 | Akbar: running an empire of differences | gess104(Cl7), hees102(Cl8), iest203(Cl9), lehs204(Cl12) | 8 | 5 | 1 | 5397 | 4 | 2 | 1 |
| HIS-24 | Aurangzeb's empire and why it cracked | gess104(Cl7), hees102(Cl8), iest203(Cl9), lehs201(Cl12), lehs204(Cl12) | 12 | 5 | 0 | 5693 | 4 | 3 | 1 |
| HIS-25 | The Taj and its world: Mughal art and science | hees203(Cl8), hees208(Cl8), kefa108(Cl11) | 9 | 6 | 0 | 2915 | 2 | 2 | 1 |
| HIS-26 | Shivaji the Ahoms and the Marathas | gess105(Cl7), hees102(Cl8), hees103(Cl8), iest203(Cl9) | 17 | 3 | 0 | 6080 | 5 | 4 | 1 |
| HIS-27 | The Sikh community and the Khalsa (told without depicting th | gess106(Cl7), hees102(Cl8), iest203(Cl9), lehs202(Cl12) | 4 | 1 | 0 | 2160 | 2 | 1 | 1 |
| HIS-28 | Panipat 1761 and the Mughal collapse | gess108(Cl7) | 4 | 3 | 0 | 2721 | 2 | 2 | 1 |
| HIS-29 | Spices and guns: how Europeans arrived | hees104(Cl8), hees203(Cl8), hess202(Cl8), iest203(Cl9) | 10 | 6 | 2 | 3494 | 3 | 2 | 1 |
| HIS-30 | Plassey and Buxar: how a company got a kingdom | hees104(Cl8), hess202(Cl8) | 7 | 7 | 0 | 2894 | 2 | 2 | 2 |
| HIS-31 | Tipu the Marathas and the Punjab: the last rivals | hess202(Cl8) | 4 | 4 | 0 | 1313 | 1 | 1 | 1 |
| HIS-32 | Zamindari ryotwari mahalwari: who owned the land | hees104(Cl8), hess203(Cl8), lehs301(Cl12) | 28 | 9 | 2 | 9016 | 7 | 4 | 1 |
| HIS-33 | From the Regulating Act to 1935: how the Raj wrote its rules | hees104(Cl8), hees202(Cl8), hess202(Cl8) | 5 | 8 | 1 | 1787 | 2 | 1 | 1 |
| HIS-34 | English schools and Indian newspapers | hees104(Cl8), hess206(Cl8), jess305(Cl10) | 19 | 6 | 1 | 7127 | 5 | 3 | 1 |
| HIS-35 | Ram Mohan Roy to Dayananda: the reformers | hees202(Cl8), hess207(Cl8), jess305(Cl10) | 8 | 8 | 1 | 3955 | 3 | 2 | 1 |
| HIS-36 | Before 1857: the revolts of peasants and tribes | hees104(Cl8), hess203(Cl8), hess204(Cl8), lehs301(Cl12) | 27 | 1 | 0 | 10735 | 8 | 4 | 1 |
| HIS-37 | 1857: mutiny revolt or war? | hees104(Cl8), hess205(Cl8), lehs302(Cl12) | 36 | 2 | 0 | 15645 | 11 | 7 | 1 |
| HIS-38 | Why the Congress was born | hees202(Cl8), hess208(Cl8) | 10 | 8 | 0 | 4918 | 4 | 2 | 1 |
| HIS-39 | 1905: Bengal is cut and Swadeshi begins | hees202(Cl8), jess302(Cl10) | 3 | 3 | 0 | 1921 | 2 | 1 | 1 |
| HIS-40 | The revolutionaries: Bengal to overseas | hees202(Cl8) | 3 | 4 | 0 | 2255 | 2 | 2 | 1 |
| HIS-41 | Gandhi's rise: why millions followed | hees202(Cl8), hess208(Cl8), jess302(Cl10), lehs303(Cl12) | 14 | 4 | 1 | 6577 | 5 | 3 | 1 |
| HIS-42 | Non-cooperation and Khilafat | hees202(Cl8), hess208(Cl8), jess302(Cl10), lehs303(Cl12) | 12 | 3 | 3 | 5115 | 4 | 2 | 1 |
| HIS-43 | Salt and the Round Tables | hees202(Cl8), hess208(Cl8), jess302(Cl10), lehs303(Cl12) | 10 | 4 | 1 | 7792 | 6 | 3 | 1 |
| HIS-44 | 1937 to 1946: the road to the exit | hees202(Cl8), hess208(Cl8), lehs303(Cl12) | 3 | 5 | 0 | 1365 | 1 | 1 | 1 |
| HIS-45 | Women students workers and peasants in the struggle | hess208(Cl8), jess302(Cl10) | 4 | 4 | 1 | 2641 | 2 | 2 | 1 |
| HIS-46 | Nehru Bose and the Left | hees202(Cl8) | 1 | 3 | 1 | 352 | 1 | 1 | 1 |
| HIS-47 | Partition: how it happened | hees202(Cl8), hess208(Cl8), lehs303(Cl12) | 7 | 6 | 0 | 3271 | 3 | 2 | 1 |
| HIS-48 | Hundreds of princes and one country | none | 0 | 3 | 1 | 0 | 1 | 1 | 1 |
| HIS-49 | Language states and the language question | lehs304(Cl12) | 3 | 3 | 1 | 1550 | 2 | 2 | 1 |
| HIS-50 | Nehru's world: non-alignment and the neighbours | none | 0 | 3 | 0 | 0 | 1 | 1 | 1 |
| HIS-51 | Caste after 1947 and the Dalit movements | none | 0 | 3 | 0 | 0 | 1 | 1 | 1 |
| HIS-52 | New India: ecology science and planning politics | none | 0 | 3 | 0 | 0 | 1 | 1 | 1 |
| HIS-53 | The Enlightenment: ideas that broke kings | jess305(Cl10) | 3 | 2 | 0 | 1281 | 1 | 1 | 1 |
| HIS-54 | Communism capitalism socialism in ten minutes | none | 0 | 3 | 0 | 0 | 1 | 1 | 1 |
| HIS-55 | America: a revolution and a civil war | none | 0 | 3 | 0 | 0 | 1 | 1 | 1 |
| HIS-56 | The French Revolution | jess301(Cl10) | 1 | 1 | 1 | 962 | 1 | 1 | 1 |
| HIS-57 | Chartists and free traders: how Britain slowly gave votes | none | 0 | 1 | 0 | 0 | 1 | 1 | 1 |
| HIS-58 | The Industrial Revolution and who it left behind | jess303(Cl10), jess304(Cl10), jess305(Cl10), kehs107(Cl11) | 25 | 4 | 0 | 9823 | 7 | 3 | 1 |
| HIS-59 | Making nations: Germany Italy and falling empires | jess301(Cl10) | 15 | 5 | 0 | 7373 | 5 | 5 | 1 |
| HIS-60 | The scramble: how the world was colonised | jess301(Cl10), jess303(Cl10), kehs106(Cl11) | 18 | 5 | 0 | 10139 | 7 | 5 | 1 |
| HIS-61 | Russia 1917 | none | 0 | 1 | 0 | 0 | 1 | 1 | 1 |
| HIS-62 | Fascism: how Italy and Germany turned | none | 0 | 1 | 0 | 0 | 1 | 1 | 1 |
| HIS-63 | China 1949 | kehs107(Cl11) | 6 | 1 | 0 | 2916 | 2 | 2 | 1 |
| HIS-64 | World War I: the war nobody planned to last | jess303(Cl10) | 5 | 3 | 0 | 1972 | 2 | 2 | 1 |
| HIS-65 | World War II | kehs107(Cl11) | 1 | 1 | 0 | 263 | 1 | 1 | 1 |
| HIS-66 | Cold War non-alignment and the UN | jess303(Cl10) | 3 | 3 | 0 | 774 | 1 | 1 | 1 |
| HIS-67 | Freedom elsewhere: Bolivar Egypt Vietnam and South Africa | jess303(Cl10), kehs107(Cl11) | 8 | 7 | 0 | 3018 | 3 | 2 | 1 |
| HIS-68 | From coal and steel to the European Union | none | 0 | 3 | 0 | 0 | 1 | 1 | 1 |
| HIS-69 | The day the Soviet Union ended | none | 0 | 3 | 0 | 0 | 1 | 1 | 1 |
| HID-01 | Alberuni and the outsiders who wrote India down | gees203(Cl7), gees204(Cl7), lehs201(Cl12) | 10 | 4 | 0 | 4916 | 4 | 2 | 1 |
| HID-02 | The feudalism debate and the rise of the Rajputs | gees203(Cl7), gess102(Cl7), gess105(Cl7), gess107(Cl7), iest105(Cl9), iest203(Cl9) | 8 | 6 | 0 | 2811 | 2 | 1 | 1 |
| HID-03 | Life under the Sultans | hees102(Cl8), hees203(Cl8), hees208(Cl8), kefa108(Cl11), lehs201(Cl12) | 16 | 2 | 0 | 7675 | 6 | 2 | 1 |
| HID-04 | Kashmir Bengal Gujarat Malwa: the provincial courts | gess107(Cl7), hees208(Cl8) | 6 | 5 | 0 | 1645 | 2 | 1 | 1 |
| HID-05 | The Mughal economy and the trade revolution | iest203(Cl9), lehs204(Cl12) | 16 | 5 | 1 | 6574 | 5 | 4 | 1 |
| HID-06 | How the Marathas ran their money | hees103(Cl8) | 1 | 2 | 0 | 81 | 1 | 1 | 1 |
| HID-07 | The economy after Plassey: European business in India | hees203(Cl8), jess303(Cl10) | 2 | 3 | 0 | 416 | 1 | 1 | 1 |
| HID-08 | Tamil Bhakti and the temple economy | gees204(Cl7), gess106(Cl7), lehs202(Cl12) | 8 | 4 | 0 | 1915 | 2 | 1 | 1 |
| **Total** | 77 topics | | 799 | 283 | 43 | 333355 | **269** | **164** | 78 |

**Thin NCERT cover (under 1,000 words, but some):** HIS-17 (171 words), HIS-22 (964 words), HIS-46 (352 words), HIS-56 (962 words), HIS-65 (263 words), HIS-66 (774 words), HID-06 (81 words), HID-07 (416 words).

## 4. Topics with no NCERT history chapter at all (11)

They will need other sources. Where a Political Science book exists, it is named (those books belong to the Polity map).

- **HIS-48** Hundreds of princes and one country: leps2 Politics in India since Independence, ch.1 Challenges of nation building
- **HIS-50** Nehru's world: non-alignment and the neighbours: leps2 ch.4 India's external relations
- **HIS-51** Caste after 1947 and the Dalit movements: no History book; leps2 ch.8 Recent developments in Indian politics may carry it (headings not read here)
- **HIS-52** New India: ecology science and planning politics: leps2 ch.3 Politics of planned development; old Our Pasts III ch.10 'India After Independence' was dropped in 2022
- **HIS-54** Communism capitalism socialism in ten minutes: no History book; leps1 Contemporary World Politics ch.1 The End of Bipolarity touches the two systems
- **HIS-55** America: a revolution and a civil war: none online (old Class 9 India and the Contemporary World I is not online)
- **HIS-57** Chartists and free traders: how Britain slowly gave votes: none online
- **HIS-61** Russia 1917: none online (old Class 9 India and the Contemporary World I is not online; its contents were not checked)
- **HIS-62** Fascism: how Italy and Germany turned: none online (same book)
- **HIS-68** From coal and steel to the European Union: leps1 ch.2 Contemporary Centres of Power
- **HIS-69** The day the Soviet Union ended: leps1 ch.1 The End of Bipolarity

Partial cover only (modern world history): HIS-53 (Enlightenment) has only the print-culture chapter (jess305); HIS-56 only the French Revolution section of jess301; HIS-64, 65, 66 only a few sections of jess303; HIS-17 only one paragraph-sized section (gess106); HID-06 only a sentence-level mention (hees103 trade networks).

## 5. Gaps: NCERT subtopics with no catalogue topic (NONE)

117 rows (56991 words) are NONE; see the csv. Grouped, with a proposal:

**A. Probably worth adding or extending (inside the syllabus or likely to be asked)**

1. **Anti-caste and social-justice movements before 1947** (hess207 'Caste and Social Reform', 4 rows, 2,597 words; Phule, Periyar, Ambedkar's early work). PYQ: 2025 Mains GS1 Q11 asks for Phule. HIS-35 (Brahmo to Dayananda) does not list them and HIS-51 starts in 1947. Proposal: widen HIS-35 into two parts, or add a new topic "Caste reform before 1947".
2. **Pilgrimage and sacred geography** (gees108, 11 rows, 3,643 words). Proposal: join HIS-12 (temple as institution) as a part, or give to Geography GEO-32.
3. **Communities that came to India** (Jews, Syriac Christians, Parsis, Arab traders, Africans, Armenians, Tibetans; gees205, 12 rows, 3,732 words). Syllabus link: foreign contact (Paper I items 8 and 11) and the 'composite culture' lines of GS-I. Proposal: new short topic or a part of HID-04 / HIS-16.
4. **Tribal societies and nomads** (gess105, 5 rows, 1,247 words). Proposal: join HID-02 (society) or Geography GEO-32; the Gonds and Ahoms 'closer look' already sits in HIS-26.
5. **Medieval education and knowledge traditions, and vernacular houses** (hees208 3 rows, hees203 1 row; 1,160 words). Proposal: join HIS-18 (culture) or HID-03 (life under the Sultans).
6. **Introduction chapter of Our Pasts II** (gess101, framing chapter 700-1750, 4 rows, 1,605 words). Proposal: use as the opening part of HIS-19 or HIS-13; no new topic.
7. **History of print** (jess305 chapter V: Japan, Gutenberg, reading public, religious debates; 9 rows, 3,415 words; the India sections are mapped to HIS-34 and HIS-35). Proposal: one new part under HIS-34 ('print and press') or HIS-53.
8. **Heritage lists** (PYQs 2024 Prelims Q60 and Q67: UNESCO Intangible and World Heritage lists). Proposal: join HIS-12 or HIS-18 as an annual current-affairs update.

**B. Outside the UPSC History syllabus (world before the 18th century). Suggest leaving them out, or one optional 'background' topic at most**

- kehs101 Mesopotamia and writing (13 rows, 7,146 words); iest104 Bronze Age civilisations outside India (5 rows, 4,005 words).
- kehs102 Roman Empire and Mongols (14 rows, 14,517 words).
- kehs104 The Three Orders, medieval Europe (21 rows, 6,855 words): a possible comparison for HID-02 (feudalism debate), nothing more.
- kehs105 Renaissance, humanism, Reformation (14 rows, 5,814 words): a prelude to HIS-53 (Enlightenment); Paper II item 16 starts at the Enlightenment.
- kehs103 section introduction and timeline (1,255 words).

**C. Mapped, but with a weak fit (read the note column)**

- hees202 'Home Rule Movement and the Lucknow Pact' mapped to HIS-41; neither is named in HIS-41's covers.
- hess202 'The claim to paramountcy' and 'The Doctrine of Lapse' mapped to HIS-31; subsidiary alliance and lapse are not named in HIS-31's covers.
- gees203 'The Great King of Kings' (Harsha) mapped to HIS-11; Paper I item 10 pairs the Guptas with the Vakatakas and Vardhanas but HIS-11's covers name only the Guptas.
- jess302 'The Sense of Collective Belonging' (Bharat Mata, flags, history writing) mapped to HIS-39; low confidence.
- kehs106 Native peoples of North America and Australia mapped to HIS-60 (settler colonies; the syllabus names Australia); kehs107 Korea and Taiwan mapped to HIS-67 as a contrast case.
- Class 12 Themes 3 (kinship, caste and class) spans 600 BCE to 600 CE and is split between HIS-04 (varna), HIS-11 (women, property) and HIS-01 (the Mahabharata as a source); each part is a judgement call.

## 6. Rationalised (deleted) NCERT content that the syllabus still asks for

Read from each book's 'Rationalisation of Content' page and NCERT's booklets (`BookletClass6-12.pdf`, saved in `_ncert/`, the 2022 lists).

| Book | Dropped | Syllabus still asks for | Topic |
|---|---|---|---|
| Themes in Indian History II (Class 12) | Theme 9 'Kings and Chronicles: the Mughal Courts' (full chapter) | Paper I items 20, 21, 23: Akbar's court, nature of the Mughal state, Persian histories | HIS-23, HIS-24, HIS-25 |
| Themes in Indian History III (Class 12) | Theme 12 'Colonial Cities' and Theme 14 'Understanding Partition' (full chapters; the current Theme 11 and 12 were Themes 13 and 15) | Paper II item 12 (communalism, partition); urbanisation under colonial rule | HIS-47, HID-07 |
| Themes in World History (Class 11) | Theme 1 'From the Beginning of Time', Theme 4 'The Central Islamic Lands', Theme 8 'Confrontation of Cultures', Theme 9 'The Industrial Revolution' (full chapters) | Paper II item 18: the English Industrial Revolution; item 20 imperialism in Latin America | HIS-58, HIS-60 |
| Our Pasts II (Class 7) | ch.5 'Rulers and Buildings' and ch.6 'Towns, Traders and Craftspersons' (full chapters); pages of ch.3 and ch.4 | Paper I items 22 and 23: Mughal architecture, towns, commerce | HIS-25, HID-05 |
| Our Pasts III (Class 8) | ch.6 'Weavers, Iron Smelters and Factory Owners' and ch.10 'India After Independence' (full chapters) | Paper II item 4(b) de-industrialisation; items 13-15 | ECO-03, HIS-48 to HIS-52 |
| India and the Contemporary World I (Class 9) | Booklet says 'no changes', but the book is no longer online (404) and its place has been taken by Understanding Society, which carries no modern world history yet | Paper II items 17, 21: French and Russian Revolutions, fascism (the book's chapters were not read here) | HIS-56, HIS-61, HIS-62 |
| An Introduction to Indian Art, India and the Contemporary World II | No changes recorded | | |

The new Exploring Society and Understanding Society books (Grades 6-9) were written after rationalisation and have no deleted-content page.

## 7. Where books or editions disagree

- 1857: hess205 (Class 8) calls it a mutiny turning popular; lehs302 treats 'the Revolt' through its representations; hees104 (Grade 8) says 'the Great Rebellion'. Neutral wording needed (HIS-37 already asks 'mutiny, revolt or war?').
- Early India names: fees106 and lehs101 say 'Harappan'; iest104 says 'Sindhu-Sarasvati Civilisation'; fees107 and iest105 give more space to the Vedic texts and ethics than Class 12 does.
- Sultanate to Mughals: gess1 splits Delhi (ch.3) and the Mughals (ch.4); hees102 covers Sultanate, Vijayanagara and Mughals in one chapter; iest203 reframes the same ground as 'resistance and resilience' (Rajputs, Ahoms, Marathas, Sikhs, Jats).
- Cholas: gees106 (early Tamil kingdoms), gess102 ('a closer look') and gees204 ('masters of the seas') each give a section; only the last treats the sea power.
- Mughal courts and Partition are deleted from Class 12 but still taught in Grade 8 (hees202 Partition) and Class 7 (gess104); the weight differs by book.
- Class 12 numbering changed: today's Themes 11 and 12 were Themes 13 and 15 before 2022; older guides use the old numbers.
- Marathas: hees103 gives them a full chapter with administration and finance; gess108 gives a section; HID-06 (Maratha money) has little NCERT cover.

## 8. Checks run

- 70 random NCERT rows: heading text found on the stated page of the chapter pdf (69 of 70 by script; the one miss, the first heading of jess303, is a test artefact and was confirmed by eye on the rendered page, printed p.53). Printed page numbers come from the contents pages and the page numbers inside the pdfs; for jess301, jess303 and jess305 the chapter pdf begins with section divider pages, corrected from the in-pdf numbers.
- 24 of 24 sampled syllabus phrases found on the stated PDF page.
- Mains GS1 2025 and 2026 question numbers read from rendered page images (Q11 to Q13 confirmed). Prelims question numbers come from the OCR text only; ranges marked 'number unread' are **unverified**.
- Not verified: the topic assignment itself (it is a judgement and needs the planner's or AK's eye on the `note` column), exact word counts, and a few Prelims PYQs the OCR could not read (2025 Q21-30 and 2024 Q1-50 History items were not recovered; the PYQ rows are a **partial** list).

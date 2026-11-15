# Economics subtopic map: summary

Built 3 Nov 2026 under `docs/upsc/MAPPING_BRIEF.md`. Mapping only: no scripts, no fact research. Companion file: `research/upsc/_map/economics_subtopics.csv`.

**Rows: 734** (575 NCERT, 102 syllabus, 57 past-paper). **Gap rows (`NONE`): 218** (198 NCERT, 7 syllabus, 13 past-paper). Topics covered: ECO-01 to ECO-28 (ECO-02 and ECO-03 sit in the History serial), plus cross-references to AGR, GEO, HIS and POL topics.

## How to read the numbers

- **Words** are counted from each chapter PDF's text layer, between one heading and the next. Exercises, summaries and end matter are excluded. Boxes sit inside the section where they appear, so box rows carry no words of their own. Tables and activity text are included, so UED (Class X) and the Grade 6-9 books read longer than they teach. Treat words as +/- 25 per cent (see section 8).
- **Parts are an estimate**: `max(ceil(NCERT words / 1,500), ceil((NCERT rows + syllabus rows) / 8))`, floor 1. Pointer rows to other subjects' chapters (note says `chapter-level only`) add rows but no words. Words from several grades on one idea add up, so the all-books figure runs high; the second figure counts only Class X-XII books. The plan in `series.csv` has 28 Economics slots: one per topic, except ECO-15 (3). Section 6 of `GOLD_STANDARD.md` says no subtopic is skipped, so these numbers show where the plan is thin. They are not a final split.
- **Printed pages**: the 2026-27 chapter PDFs carry no printed page numbers. Pages for Macro, Micro and the top-level IED sections come from the book's contents page. Every other page is a `~` estimate (chapter start from the contents page plus the page's place in the PDF), good to about +/- 1 page (one checked: UED Ch 2 'Sectors in terms of ownership' is on p.33; the estimate said 32).

## 1. Books used

| Code | Book | Class | Edition (front pages) | Used for |
|---|---|---|---|---|
| keec1 | Indian Economic Development (11100) | XI | First ed. Feb 2006; Reprint 2026-27; rationalised 2022 (8 chapters now) | ECO-01 to 09, 22-24 |
| kest1 | Statistics for Economics (11098) | XI | Reprint 2026-27 (imprint page is an image; first-edition date not read) | Index numbers for ECO-15; gaps N7, N9 |
| leec1 | Introductory Macroeconomics (12105) | XII | First ed. Mar 2007; Revised Ed. Oct 2022; Reprint 2026-27 | ECO-01, 10-19; gap N4 |
| leec2 | Introductory Microeconomics (12103) | XII | First ed. Feb 2007; Revised Ed.; Reprint 2026-27. 5 chapters (Ch 6 dropped 2022). Still in print. | gaps N1-N3 |
| jess2 | Understanding Economic Development (1070) | X | First ed. Dec 2006; Reprint 2026-27; no rationalisation changes | ECO-01, 05, 08, 14, 16, 17, 20, 22, 24, 27, 28 |
| iest1 | Understanding Society Part 1 (0908) | 9 | First ed. June 2026 (Economics: Ch 8-9) | gaps N1, N2 |
| iest2 | Understanding Society Part 2 (0909) | 9 | First ed. Sept 2026 (Economics: Ch 5-6) | gaps N5, N6, N8 |
| hees1 | Exploring Society Part 1 (0881) | 8 | First ed. July 2025; Reprint 2026-27 (Ch 4, 7) | ECO-02, 03, 27; gap N3 |
| hees2 | Exploring Society Part 2 (0882) | 8 | First ed. June 2026 (Ch 6, 7) | ECO-23; GEO-34 |
| gees1 | Exploring Society Part 1 (0781) | 7 | First ed. Apr 2025; Reprint 2026-27 (Ch 11, 12) | ECO-14; gap N2 |
| gees2 | Exploring Society Part 2 (0782) | 7 | First ed. Nov 2025; Reprint 2026-27 (Ch 1, 7, 8) | ECO-16, 17, 25; AGR topics |
| fees1 | Exploring Society (0681) | 6 | First ed. June 2024 (Ch 13, 14) | ECO-01 |
| gess3, hess3, hess2 | Social and Political Life II (0764) and III (0860); Our Pasts III (0864) | VII, VIII | Older books, Reprint 2024-25; Grades 7-8 now use Exploring Society | gap N2; ECO-27; ECO-02 |
| jess3, jess1 | India and the Contemporary World II (1066); Contemporary India II (1068) | X | Reprint 2026-27 | ECO-03, 22; ECO-25, 26 (jess1 chapter level) |
| lehs3, legy1, legy2, leps2 | Themes in Indian History III; Fundamentals of Human Geography; India: People and Economy; Politics in India since Independence | XII | First eds. 2007; Reprint 2026-27 | ECO-03 (lehs3 Ch 1); chapter level for the rest |

NCERT's own list (`textbook.php`) shows Class IX Social Science as Understanding Society Parts I-II, plus an older row 'Economics [iess2]' with 4 chapters. The files for that old book return 404 (`iess2ps`, `iess201`, `iess202`), so **Class IX Economics (970) could not be read**; its rationalisation page says 'no changes'.
Codes tried that returned 404: `iess1`-`iess4` (front pages), `ieec`, `keec2`-`keec4`, `leec3`, `kest2`, `jest*`, `fees2`, `fess1`-`fess4`, `iess201`, `iess301`, `gess9`-`gess11`, `lehs310`, `keec109`, `leec107`, `leec206`, `kest109`. Codes found: the books above plus `lesy1`, `lesy2`, `kesy1`, `kesy2` (Sociology, not used), `hess4` and `gess1`, `gess2` (Geography/History, not used).

## 2. Topics: chapters used, subtopics, words, estimated parts

| Topic | NCERT chapters used (rows) | NCERT rows | Syllabus rows | PYQ rows | NCERT words | Parts (all books) | Parts (Class X-XII books) | In plan |
|---|---|---|---|---|---|---|---|---|
| ECO-01 What GDP counts and what it misses | IED XI ch2 (1); IED XI ch8 (1); Stats XI ch7 (1); Macro XII ch1 (2); Macro XII ch2 (9); UED X ch1 (1); UED X ch2 (4); Expl. Soc. 6 ch13 (2); Expl. Soc. 6 ch14 (7); Human Geog. XII ch6 (1) | 29 | 2 | 1 | 24,470 | 17 | 15 | 1 |
| ECO-02 Why India was poor in 1947: the drain of wealth | IED XI ch1 (10); Expl. Soc. 8 Pt1 ch4 (4); Our Pasts III VIII (old) ch3 (8) | 22 | 3 | 0 | 6,353 | 5 | 4 | 1 (History serial) |
| ECO-03 Jute cotton and railways: who colonial industry served | IED XI ch1 (2); Expl. Soc. 8 Pt1 ch4 (4); ICW-II X ch4 (11); Themes Hist. III XII ch1 (8) | 25 | 1 | 0 | 11,093 | 8 | 7 | 1 (History serial) |
| ECO-04 Five Year Plans to NITI Aayog: who decides India's priorities | IED XI ch2 (6); IED XI ch8 (4); People&Econ. XII ch6 (1); Politics since Ind. XII ch3 (1) | 12 | 4 | 1 | 5,064 | 4 | 4 | 1 |
| ECO-05 The Licence Raj: how a factory needed permission to grow | IED XI ch2 (3); UED X ch2 (1); Human Geog. XII ch5 (1) | 5 | 2 | 1 | 2,780 | 2 | 2 | 1 |
| ECO-06 1991: the crisis that rewrote India's economy | IED XI ch3 (6); UED X ch4 (1) | 7 | 1 | 0 | 5,081 | 4 | 4 | 1 |
| ECO-07 Who counts as poor? The poverty line fight | none | 0 | 5 | 0 | 0 | 1 | 1 | 1 |
| ECO-08 Jobs: why growth does not always hire | IED XI ch6 (11); UED X ch2 (1) | 12 | 2 | 0 | 6,806 | 5 | 5 | 1 |
| ECO-09 The rural job guarantee: a right to work | IED XI ch5 (3); IED XI ch6 (1) | 4 | 2 | 0 | 1,318 | 1 | 1 | 1 |
| ECO-10 How to read the Union Budget | Macro XII ch5 (4); Underst. Soc. 9 Pt1 ch9 (4) | 8 | 4 | 2 | 2,860 | 2 | 2 | 1 |
| ECO-11 Deficit and debt: when a government borrows too much | Macro XII ch5 (4) | 4 | 2 | 4 | 4,645 | 4 | 4 | 1 |
| ECO-12 Who really pays a tax? GST and the rest | Macro XII ch5 (1); Underst. Soc. 9 Pt2 ch5 (2) | 3 | 1 | 1 | 692 | 1 | 1 | 1 |
| ECO-13 The Finance Commission: how your state gets its share | none | 0 | 2 | 3 | 0 | 1 | 1 | 1 |
| ECO-14 What the RBI actually does | Macro XII ch3 (1); UED X ch3 (2); Expl. Soc. 7 Pt1 ch11 (7) | 10 | 2 | 6 | 4,778 | 4 | 2 | 1 |
| ECO-15 Repo rate and prices: how the RBI fights inflation | Stats XI ch7 (13); Macro XII ch3 (1); ECO-15 checklist (19) | 33 | 10 | 1 | 7,391 | 6 | 6 | 3 |
| ECO-16 How banks create money | Macro XII ch3 (7); UED X ch3 (1); Expl. Soc. 7 Pt2 ch8 (4) | 12 | 2 | 1 | 4,383 | 3 | 2 | 1 |
| ECO-17 Inclusion: why a bank account changes a family | IED XI ch5 (2); UED X ch3 (6); Underst. Soc. 9 Pt2 ch5 (1); Expl. Soc. 7 Pt2 ch8 (3) | 12 | 2 | 5 | 7,713 | 6 | 4 | 1 |
| ECO-18 Why the rupee moves | Macro XII ch6 (5) | 5 | 3 | 0 | 2,182 | 2 | 2 | 1 |
| ECO-19 Balance of payments without the jargon | Macro XII ch6 (4) | 4 | 1 | 0 | 1,511 | 2 | 2 | 1 |
| ECO-20 Foreign money in India: FDI and multinationals | IED XI ch3 (2); UED X ch4 (3); SPL-II VII (old) ch8 (2) | 7 | 2 | 0 | 1,793 | 2 | 2 | 1 |
| ECO-21 Selling the family silver? Privatisation and disinvestment | IED XI ch3 (1) | 1 | 1 | 1 | 476 | 1 | 1 | 1 |
| ECO-22 WTO: the rulebook behind every trade fight | IED XI ch3 (2); UED X ch4 (7); ICW-II X ch3 (1); People&Econ. XII ch8 (1); Human Geog. XII ch8 (1) | 12 | 5 | 2 | 5,460 | 4 | 4 | 1 |
| ECO-23 Demographic dividend: a gift with an expiry date | IED XI ch8 (1); Expl. Soc. 8 Pt2 ch6 (14); People&Econ. XII ch1 (1) | 16 | 2 | 1 | 4,466 | 3 | 3 | 1 |
| ECO-24 Beyond income: HDI basic needs and the SDGs | IED XI ch4 (1); IED XI ch7 (3); IED XI ch8 (1); Stats XI ch7 (1); Macro XII ch2 (1); UED X ch1 (5); Human Geog. XII ch3 (1) | 13 | 5 | 1 | 5,898 | 4 | 4 | 1 |
| ECO-25 Who pays for a highway? Investment models | Expl. Soc. 7 Pt2 ch7 (10); Contemp. India II X ch7 (1); People&Econ. XII ch7 (1) | 12 | 3 | 0 | 3,584 | 3 | 2 | 1 |
| ECO-26 Why India's power companies keep losing money | Contemp. India II X ch5 (1); People&Econ. XII ch5 (1) | 2 | 1 | 1 | 0 | 1 | 1 | 1 |
| ECO-27 Schools and hospitals: what the state spends and gets | IED XI ch4 (9); UED X ch1 (1); Expl. Soc. 8 Pt1 ch7 (5); SPL-III VIII (old) ch7 (8) | 23 | 3 | 1 | 11,736 | 8 | 4 | 1 |
| ECO-28 Rich states and poor states: why the gap stays | UED X ch1 (1) | 1 | 1 | 1 | 319 | 1 | 1 | 1 |

**Totals, ECO-01 to ECO-28: about 105 parts (all books), about 91 (Class X-XII only), against 28 planned slots.** Biggest drivers: ECO-01 (Macro Ch 2 alone is about 12,700 words), ECO-27, ECO-23 and ECO-22.

**ECO-15** reuses its 63-item checklist (`research/upsc/ECO-15/checklist.csv`). Its 18 NCERT concepts, 1 NCERT heading and 8 syllabus terms appear as rows with no words, so nothing is double counted. Its past-paper item is the first 2024 PYQ row (the checklist says Q40; the OCR order suggests Q42: check by eye). Its other 35 items (current positions, debates, misconceptions) are not NCERT subtopics and stay in the checklist. The checklist's own split is 3 parts (18, 31 and 14 items). The formula above gives more because Macro Ch 3 Box 3.1 and the price-index text are counted.

## 3. Gaps: subtopics with no home

| Tag | Proposed topic | Gap rows: NCERT / syllabus / PYQ | Examples |
|---|---|---|---|
| N1 | What economics studies: scarcity, choice, economic systems. Suggest a new topic ECO-29 as the Season 1 opener, ahead of ECO-01; feeds ECO-04 and ECO-05. | 21 / 0 / 0 | 1. why economics?; We cannot get something for nothing; Consumption, Production and Distribution; 1.1 A Simple Economy; 1.2 Central Problems of an Economy; 1.3 Organisation of Economic Activ |
| N2 | Demand, supply and how a price forms (markets, elasticity, price ceilings and floors). Suggest a new topic ECO-30, 'Demand, supply and prices'; also gives AGR-07 (MSP) its price-floor background. | 61 / 3 / 0 | 2.1 Utility; 2.1.1 Cardinal Utility Analysis; 2.1.2 Ordinal Utility Analysis; 2.2 The Consumer's Budget; 2.2.1 Budget Set and Budget Line; 2.2.2 Changes in the Budget Set; 2.3 Optimal Choice |
| N3 | Production, costs and the firm (factors of production, costs, perfect competition). Low priority; mostly optional-paper theory. Could be an appendix part to ECO-30. | 36 / 1 / 1 | 3.1 Production Function; 3.2 The Short Run and the Long Run; 3.3 Total Product, Average Product and Mar; 3.3.1 Total Product; 3.3.2 Average Product; 3.3.3 Marginal Product; 3.4 The Law of Di |
| N4 | How demand moves output: aggregate demand, income determination and the multiplier. Suggest a new topic after ECO-01; ECO-10 and ECO-11 need it for 'budget as stabiliser'. | 9 / 1 / 0 | 4.1 Aggregate Demand and its Components; 4.1.1 Consumption; 4.1.2 Investment; 4.2 Determination of Income in Two-sector ; 4.3 Determination of Equilibrium Income in; 4.3.1 Macroeconomic Equi |
| N5 | Capital and debt markets: stocks, bonds, mutual funds, SEBI (concepts only, SEBI-safe). Suggest a new topic; the most-asked gap in past papers. SEBI-safe: concepts only, no prices. | 4 / 0 / 7 | Sensex; Investing (Growing Wealth); Risk and Return; Stock Market |
| N6 | Personal finance and consumer rights (budgeting, saving, insurance, consumer protection). Join ECO-17 (inclusion) as a part, or a small new topic; consumer rights has no home elsewhere. | 12 / 0 / 0 | Consumer Rights (chapter opening); The consumer in the marketplace; Taking the consumer movement forward; Appendix; Managing Your Personal Finances (chapter o; Pillars of Personal Finance; I |
| N7 | How India measures itself: Census, NSO surveys, sampling errors. Join ECO-07 or ECO-08 as a short 'where the numbers come from' part, or a new topic. | 16 / 0 / 0 | 1. introduction; 2. what are the sources of data?; 3. how do we collect the data?; Preparation of Instrument; Mode of Data Collection; Pilot Survey; 4. census and sample surveys; Census or C |
| N8 | Entrepreneurship, startups and industrial policy today (MSMEs, PLI). Suggest a new topic: MSMEs, PLI, startups, food processing, digital public infrastructure. | 8 / 1 / 5 | From Ideas to Startups (chapter opening); Business Plan—A Road Map for the Business; Functional Areas of a Business; Management and Operations; Finance and Accounting; Human Resources; Marke |
| N9 | Statistics toolkit (tables, graphs, averages, correlation): short explainer cards, not full topics. Not topics: explainer cards, only if AK wants Statistics for Economics covered. | 22 / 0 / 0 | Introduction (chapter opening); 2. statistics in economics; 3. what is statistics?; 4. what statistics does?; 5. conclusion; Organisation of Data; Presentation of Data; 1. introduction; 2. a |
| N10 | Environment and sustainable development basics (join GEO-38 or GEO-39, or keep inside ECO-24). Join ECO-24 (sustainable development) or GEO-38/GEO-39; the Geography map should decide. | 6 / 1 / 0 | 7.1 Introduction; 7.2 Environment: definition and functions; 7.3 State of India's environment; Box 7.1: Global Warming; Box 7.2: Ozone Depletion; Box 7.4 : Pollution Control Boards |
| N11 | Values and non-economic activity (Grade 6): no exam topic. Leave out: values, not an exam topic. Named reason recorded here. | 3 / 0 / 0 | The Importance of Non-Economic Activities; Sevā: selfless service; The strength of community participation |

Every gap row carries its tag in the `note` column of the CSV (`gap N#`). Rows given to a topic in another serial (AGR, GEO, HIS, POL) are cross-references, not gaps; that serial's map should list them too.

**Syllabus phrases whose topic exists but whose catalogue 'covers' column lacks them:** commercialisation of agriculture (ECO-02); Vakil, Gadgil and V.K.R.V. Rao (ECO-04 or ECO-02); the Harrod and Lewis growth models (no home; ECO-28 covers balanced growth only); currency boards and speculative attacks (ECO-18); IMF and World Bank (ECO-22; asked in Prelims 2025). The quantity theory, Keynes on money demand and the ceiling on money growth are in the ECO-15 checklist.

## 4. Topics with no, or almost no, NCERT economics chapter

- **ECO-07 Who counts as poor? The poverty line fight**: 0 NCERT rows, 0 words. No NCERT chapter in print. IED Ch 4 'Poverty' was dropped in 2022; Class IX Economics (970) is unreachable; the UED chapters read contain no 'poverty' section.
- **ECO-09 The rural job guarantee: a right to work**: 4 NCERT rows, 1,318 words. Only IED Ch 6 section 6.9 and the Ch 5 opening; nothing on the rural job guarantee's design.
- **ECO-10 How to read the Union Budget**: 8 NCERT rows, 2,860 words. Thin: Macro Ch 5 section 5.1 and Grade 9 'role of government'; the Union Budget procedure is not in the economics books.
- **ECO-12 Who really pays a tax? GST and the rest**: 3 NCERT rows, 692 words. Only Macro Box 5.3 (GST) and Grade 9 personal income tax; no NCERT text on tax incidence.
- **ECO-13 The Finance Commission: how your state gets its share**: 0 NCERT rows, 0 words. None. The Finance Commission is not named in any economics book read. Fiscal federalism sits in the Polity books (not read here).
- **ECO-21 Selling the family silver? Privatisation and disinvestment**: 1 NCERT rows, 476 words. Only the IED Ch 3 'Privatisation' section (about 480 words).
- **ECO-25 Who pays for a highway? Investment models**: 12 NCERT rows, 3,584 words. Only Grade 7 Ch 7 (descriptive) plus Geography chapters. No NCERT text on PPP or hybrid annuity.
- **ECO-26 Why India's power companies keep losing money**: 2 NCERT rows, 0 words. Only Geography chapters (Class X Ch 5; Class XII People and Economy Ch 5), pointers here. IED Ch 8 'Infrastructure' was dropped in 2022.
- **ECO-28 Rich states and poor states: why the gap stays**: 1 NCERT rows, 319 words. Only the Class X Ch 1 comparison of Haryana, Kerala and Bihar; no NCERT chapter on regional disparity.

Topics whose key points are outside school books even where rows exist: ECO-02 (drain theory: Grade 8 Ch 4 names it in one sub-section; laissez-faire has no NCERT text), ECO-03 ('money and credit before 1947': no NCERT text), ECO-14 (relation with the Treasury), ECO-18 (convertibility), ECO-22 (TRIPS, TRIMS, GATS: UED Ch 4 has WTO but no mention of TRIPS), ECO-19 (adjustment). These need RBI, Economic Survey, WTO and original-author sources.

## 5. Rationalised (deleted) NCERT content that the syllabus still asks for

From NCERT's booklets of rationalised content (Class XI and XII dated 27 May 2022, Class X dated 27 Dec 2022; saved as `research/upsc/_ncert/BookletClass*.txt`) and the 'Rationalisation of Content' page of each book:

| Dropped | Still asked by | Topic |
|---|---|---|
| IED (11100) Ch 4 'Poverty', pp. 57-81, full chapter | Prelims 'Economic and Social Development: poverty'; GS-I and GS-II poverty; optional Paper II A(v) | ECO-07 |
| IED Ch 8 'Infrastructure', pp. 139-161, full chapter | GS-III: Infrastructure: Energy, Ports, Roads, Airports, Railways | ECO-25, ECO-26 |
| Micro (12103) Ch 6 'Non-competitive Markets', pp. 88-101 | Optional Paper I 1(c): monopolistic competition, duopoly, oligopoly | gap N3 |
| Macro (12105) Ch 6 Box 6.2 'Exchange Rate Management: International Experience', pp. 95-98 | Optional Paper I 4(c); Paper II B(iv) | ECO-18 |
| Statistics (11098) Ch 6 'Measures of Dispersion', pp. 74-90 | Nothing in GS; optional statistical method only | none |
| Class X UED (1070): no changes. Class IX Economics (970): 'no changes', but the book cannot be opened | Poverty and food security, once in Class IX Economics, appear in no current book I could read | ECO-07 |

The in-book 'Rationalisation' pages are generic and list no removals; the booklets are the authority. IED now has 8 chapters (the old 10 less Ch 4 and Ch 8). Exploring Society and Understanding Society are new (2024-26) and carry no rationalisation list.

## 6. Where two NCERT books or editions disagree

- **Money and the RBI:** Macro Ch 3 (XII) has the RBI control the money supply through CRR, bank rate, open market operations and repo; the RBI now targets inflation with a policy rate (see `ECO-15/ncert_map.md`). UED Ch 3 (X) and Grade 7 Ch 11-12 stop at banks, credit and payment modes.
- **1991 reforms:** IED Ch 3 (XI) covers them at length; UED Ch 4 (X) treats them only as globalisation in India.
- **Colonial economy:** Grade 8 Ch 4 (2025) names the drain of India's wealth, famines and the decline of indigenous industry; the older Our Pasts III Ch 3 (2008) covers revenue systems and indigo only; IED Ch 1 gives the statistics; Themes in Indian History III Ch 1 covers land revenue in Bengal and the Deccan.
- **Poverty:** no current book carries it (section 4), while old IED Ch 4 and the older Class IX Economics did.
- **Markets and prices:** four books at three levels with no shared vocabulary: Grade 7 Ch 12 (descriptive), Grade 9 Ch 9 (demand, supply, equilibrium), Micro Ch 2-5 (indifference curves, costs), older SPL-II Ch 7-8 (weekly markets, a shirt's supply chain).
- **Human capital:** IED Ch 4 (XI) says 'human capital'; Grade 8 Ch 7 (2025) says 'people as a resource'; UED Ch 1 says 'human development'.
- **Class X Economics keeps its 2006 structure** while refreshing data (Table 1.6 now shows 2023).

## 7. Past-paper coverage and limits

Only the nine UPSC papers on the site were read (Prelims GS I 2024-26; Mains GS I-III 2025-26). The OCR is rough, two-column and bilingual: question ideas are paraphrased, **question numbers shown as 'p.N' only are unverified**, and a zero means zero in these nine papers. Economics rows: 57. Heaviest yield: capital and debt markets (gap N5, 7 past-paper rows), fiscal deficit arithmetic (ECO-11), RBI and digital payments (ECO-14, ECO-17), the Finance Commission (ECO-13), agriculture (AGR).

## 8. Checks run, and what is unverified

- **Headings:** 551 NCERT heading and box rows were searched in their chapter's text layer: 532 found (96.6 per cent). The 19 misses are IED titles taken from the book's contents page (overprinted in the chapter PDF), one quotation (dropped from the CSV) and a few split lines. Two pages were rendered and read (UED Ch 2 ownership heading; the Ch 1 'of select states' line is a table caption and was dropped).
- **Words:** 22 sections in Macro, Micro and IED were re-counted with a second tool (pdftotext) and compared. 14 agreed within 25 per cent; 8 differ because they are parent headings (the second tool counts their sub-sections) or layout noise. Words for UED, the Grade books and cross-subject chapters were not re-counted: `unverified`.
- **Syllabus rows:** each phrase was matched to its PDF page by text search in the notification (pp. 32-36, 61-63). Optional-paper items are condensed at heading level.
- **Topic assignment** is my judgement from headings and the catalogue 'covers' column; no one has reviewed it. Headings shared by two topics are marked `shared with`.
- **Not reached:** Class IX Economics (970); Polity, History, Geography and Sociology books beyond the chapters named above (the other subject maps should list them; e.g. federalism chapters for ECO-13); Hindi and Urdu editions. Statistics for Economics Ch 3, 4, 6 and 8 are chapter-level pointers because their headings did not extract cleanly.


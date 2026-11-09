# Mains answers as videos: research and plan (draft, 6 Nov 2026)

AK asked (6 Nov 2026): check the last 10 years of UPSC Mains papers and make the answers into videos for Geography,
Economics, Polity, International relations and Agriculture, from the GS papers and the optional papers, presented in a way
that is unique for students. This is the research and the plan. Formats, names and the pilot list are AK's to decide
(AGENTS rule 7); nothing is posted (rule 1).

## 1. What we have

- **Papers:** 121 PDFs from upsc.gov.in, 2016 to 2026 (11 sittings): GS I, II, III and the Geography, Economics, PSIR and
  Agriculture optionals, Papers I and II. All were image scans, so all were OCR'd; four Sonnet agents read the English text
  question by question. Files: `research/upsc/_pyq/mains/` (git-ignored, as the question text is UPSC's).
- **Question bank:** `research/upsc/_pyq/mains/questions.csv`, 3,121 questions or parts (year, paper, number, part, marks,
  word limit, directive word, subject, first-pass catalogue topic). Built by `scripts/upsc/pyq_bank.py`. Analysis:
  `research/upsc/_pyq/mains/ANALYSIS.md`.

| Subject | GS questions | Optional questions | Total |
|---|---:|---:|---:|
| Economics | 77 (GS III) | 616 | 693 |
| Geography | 54 (GS I) | 605 | 659 |
| Agriculture | 43 (GS III) | 624 | 667 |
| Polity (incl. PSIR Paper I) | 89 (GS II) | 308 | 397 |
| International relations (incl. PSIR Paper II) | 48 (GS II) | 308 | 356 |
| **Five subjects** | **311** | **2,461** | **2,772** |

Caveats: the GS subject tag and the topic link are keyword matches, right for most rows but not all. For example, a
question on the President's pardon in India and the USA was tagged IR. Each question gets a person's check before it is
scripted. A few OCR words are marked `[?]` in the bank.

**What the ten years show**

- **UPSC repeats ideas, not questions.** Counted by the first-pass topic link (approximate), the most-asked topics return in 9 to 11 of the 11 years. Some examples: Geography has
  migration (31 questions), floods and droughts (30), rivers (21) and the monsoon (10, in 7 different years). Economics has
  comparative advantage (27), growth and regional spread (23), poverty lines (23) and how banks create money (22). Polity
  has the Election Commission (16), judicial review (14) and basic structure (14). Agriculture has the Green Revolution
  (43), watersheds (37) and seeds (29).
- **Questions want reasoning, not recall.** The directive words are "discuss" (608), "explain" (398), "examine" (220) and
  "comment" (151). Many questions are a quotation to argue with. A student who understands the idea can write all the
  variants.
- **Dated questions age.** About 306 of the 2,772 questions name a year, a scheme, a policy or "recent" events. Their facts
  need updating before a student can reuse the answer today.
- **Geography is map-first.** At least 153 of the 659 Geography questions ask for a distribution, regions, a location or
  a diagram. Geography optional Paper II Q1 is always a map question.
- **International relations is not in our catalogue.** It has 356 questions and no serial yet. PSIR Paper I's political
  theory (Plato to Rawls) and Indian nationalism are mostly outside it too: 136 Polity questions are not linked.

## 2. What students get today (YouTube scan, 6 Nov 2026)

Detail: `research/upsc/_pyq/market/PYQ_ANSWER_VIDEOS_2026-11-06.md` (16 searches, 133 videos).

- **Lectures:** about half (69 of 133) run an hour or more, mostly live streams of "PYQ discussion" or "paper analysis" (one is 8 h 47 min).
- **No single questions:** we found no title among the 133 about one question. A student looking for one question has
  to scrub a stream.
- **Talked answers:** model answers are talked over, or shown as handwritten scans. No video builds an answer on screen.
- **Short is better:** videos under 20 minutes get about twice the median views of long ones (19K vs 9K). Method videos
  with toppers or Mrunal reach 200K to 700K.
- **Diagrams as lists:** diagrams and maps are wanted, but taught as lists ("30 diagrams for GS 1"), not inside an answer.
- **Optionals only in exam week:** optional PYQ help is thin (1K to 10K views) and nearly all of it is exam-week
  analysis.

## 3. Our promise

**Understand the idea, then watch the answer being written.** Every video takes one real Mains question. It first teaches
the idea behind it, in the serial's cartoon look and the ELI5-but-deep style. Then it builds a full answer on an
on-screen answer sheet, inside the real word limit and the real time, with the diagram or map drawn as a student can draw
it in the hall. The student leaves able to write this question and its cousins.

Why nobody else does this: coaching channels are built around a teacher talking live. Our engine draws, animates and
counts, so we can show what they can only describe.

## 4. Formats (options for AK; working names only)

| # | Format | Length | What it is |
|---|---|---|---|
| A | **One Question** (main) | 4 to 7 min (10-marker), 7 to 10 min (15/20-marker) | One PYQ: the question decoded, the idea taught, the answer built on the sheet, a timer and word count running |
| B | **Ten Years, One Idea** | 10 to 14 min | Every question on one theme across ten years, on a timeline. It teaches the idea once and shows one answer skeleton that bends to each question (for example, the 10 monsoon questions, 2017 to 2026) |
| C | **Answer Sheet Short** | 45 to 60 s | The answer skeleton and its one diagram, drawn fast; revision on the phone |
| D | **Old Question, New Facts** | 3 to 5 min, or a card inside A | A dated question (2017's "recent" policy) answered with today's facts and a "facts as of <date>" card. Uses the living-facts files (`docs/upsc/living/`) |
| E | **Paper Map** | one page and a 3 min video, the week after each Mains | Each new question pointed to our concept episode and answer video. Cheap, because the bank is tagged |

**AK's choice (6 Nov 2026): A, B and C.** A is the spine, B the flagship long video for each theme, and C is cut from every A. D and E are not planned for now.

## 5. Inside a One Question video (format A)

It follows storytelling v2 (one promise, stacked loops, a turn, pay off and stop). The promise is the question itself.

1. **The question on screen** (0:00 to 0:15). The printed question, with year, paper, number and marks. The narrator reads
   it. The open loop: "most answers to this lose marks in the first line".
2. **Question X-ray** (15 to 45 s). The directive word lights up and the question splits into its demands (for example,
   "origin, progress, retreat" plus "impact on the economy" makes four boxes the answer must fill). This is the step
   students skip.
3. **The idea first** (1 to 2.5 min). A cartoon explanation in the serial's look, taken from the concept episode where
   one exists (the monsoon from GEO-07). It ends on the turn: the one insight that lifts the answer above the textbook.
4. **The answer being written** (2 to 4 min). A ruled answer sheet fills line by line in a clear handwriting font:
   introduction, a heading for each demand, the diagram drawn stroke by stroke, a sourced figure, and a way out. A word
   counter and an exam clock run in the corner (150 words, about 7 minutes; 250 words, about 11).
5. **Two answers, side by side** (30 to 60 s). A weaker version, written by us, against the built one, with what is
   missing ringed in red. It is never a real student's copy.
6. **Pay off and stop** (15 s). The demand boxes all tick, then three cousin questions from other years that the same
   answer frame can handle, plus the link to the concept episode.

## 6. Rules for these videos

- **Honesty about answers.** UPSC publishes no model answers. We say "one good answer", never "the model answer", and
  never promise marks. No topper names and no real answer copies.
- **The question's source.** Each question is shown as printed, credited "UPSC CSE (Main) <year>, <paper>, Q<n>". Showing
  UPSC's question text in a teaching video is the norm on every channel, but the legal call is AK's (see section 9).
- **The Gold Standard holds.** Every fact in an answer goes in a claims ledger and is read at the publisher (NCERT first,
  then the publisher of record). Facts carry their date. Where the exam-year fact has changed, show both, labelled.
- **Exam-real answers.** Stay inside the word limit (a script counts the words), use only diagrams a student can draw in
  60 to 90 seconds, and use plain handwriting.
- **IR is neutral.** Use India's official positions as stated by MEA, and treaty and UN texts for facts. No side-taking
  on disputes, no disputed-map borders and no party politics. The sensitive-topic rules from the series apply.
- **Hindi.** Plan Hindi from the start: Maya's Hindi voice is already chosen, and Hindi PYQ videos draw large audiences.

## 7. What to make, in what order

1. **GS questions in the five subjects first** (311): they serve every candidate, not only one optional's takers. Within
   that, use the focus order (Economics, Geography, Polity) with IR beside Polity, then Agriculture.
2. **One "Ten Years, One Idea" for each high-repeat theme** (themes asked in 9 or more of the 11 years): about 10 to 12
   per subject.
3. **The optionals, year-round**, in each serial's order, so that a Geography optional student can follow a full season.
   Optional questions are 2,461 in all. Not every one needs a video: cousin questions share one answer frame. A realistic
   target is one video per theme cluster plus the most-asked single questions.
4. **New catalogue work:** an International relations serial (GS II IR and PSIR Paper II) and the PSIR Paper I theory
   topics. These need research before their answers can be made.

## 8. Pilot (proposed)

The pilot uses topics already researched to the Gold Standard, so it tests only the new format:

| Pilot | Question | Concept episode |
|---|---|---|
| A: One Question | Geography optional 2018, Paper I, Q3(a): origin, progress and retreat of the monsoon, and its impact on the economy (20 marks) | GEO-07 (researched, scripted, rendered) |
| A: One Question | GS II 2019, Q12: Parliament's amending power is limited (15 marks, 250 words) | POL-06 (researched) |
| A: One Question | Economics optional 2025, Paper I, Q4(c): the money multiplier and how banks create money (15 marks) | ECO-16 (research prompt with AK) |
| B: Ten Years, One Idea | The monsoon: 10 questions, 2017 to 2026 (GS I 2017 Q17 and 2023 Q7, plus optional questions) | GEO-07 |

**New engine scenes the pilot needs** (in the UPSC cartoon engine): a question X-ray (highlighted directive and demand
boxes), an answer sheet (ruled page, handwriting reveal, stroke-drawn diagram, word counter, clock), a side-by-side
comparison, and a ten-year theme timeline.

**Pipeline for each video:** pick from the bank → check the question text against the PDF → claims ledger (reuse the
topic's) → answer draft (Gemini first draft, Claude checks and revises, as in the content plan) → word-limit and claims
check → storyboard → Maya voice → 60 fps 2K render → `deliver.py upsc`.

## 9. Decisions for AK

1. ~~Formats~~: decided 6 Nov 2026, A, B and C.
2. Names for the formats; the working names are above.
3. Whether to show UPSC's question text on screen with credit (the norm), or to paraphrase it.
4. The pilot list, or other questions.
5. Whether the International relations serial is added to the catalogue now (needed before IR answers), and where it
   sits in the Polity, Economics, Geography focus order.
6. English and Hindi together from the pilot, or English first.

## 10. Pilot status (7 Nov 2026)

- **Checked against the PDFs:** all three pilot questions match UPSC's printed text (2018 Geography I Q3(a) p.3; 2019 GS II Q12 p.3;
  2025 Economics I Q4(c) p.5).
- **Answer modules** (single source of sheet and narration), checked by `scripts/upsc/pyq_tool.py`:
  `research/upsc/pyq/2018-geo1-3a/answer.py` (318 words, budget 280-340, 4 demands) and `research/upsc/pyq/2019-gs2-12/answer.py`
  (237 words, limit 250). Ledgers: GEO-07 (plus M114-M118 on the economy: RBI October 2026 MPC, DA&FW third advance estimates 2025-26,
  Economic Survey 2025-26), POL-06, and `research/upsc/pyq/claims.csv` (our own counts and arithmetic).
- **Engine** (worktree `mmvideo-dk-upsc`, look B): `src/looks/upsc_rich_b/pyq/` (contract `CONTRACT_PYQ.md`), storyboards from
  `scripts/upsc/pyq_storyboard.py`, effects from `scripts/upsc/pyq_sfx.py`.
- **Still to make:** the money multiplier answer (ECO-16 is researched; Economics I 2025 Q4(c)), the Ten Years, One Idea monsoon
  video (format B), and Answer Sheet Shorts (format C) cut from each A.
- **Choices made for the pilot (AK can change them):** the question is shown as printed, with credit; English only; the handwriting is
  Noteworthy (a macOS font). Hindi needs a Devanagari handwriting font such as Kalam (OFL), which would have to be downloaded.

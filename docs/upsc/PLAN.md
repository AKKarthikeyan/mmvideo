# UPSC syllabus in cartoon: series plan (draft, 1 Nov 2026)

**Brief (AK):** cartoon-style videos for Economics, Geography, History, Polity and Agriculture, from the UPSC syllabus.
**Evergreen (AK):** the videos are not tied to any exam year. Current affairs are added as and when they happen.
**Focus (AK, 3 Nov 2026):** Economics, Geography and Polity first, one episode from each in turn (`docs/upsc/planner/QUEUE.md`),
with current affairs linked to the syllabus (`scripts/upsc/ca_scan.py`; daily picks in `docs/upsc/current/<date>.md`). History and
Agriculture start once those three serials are complete. Serial order: `docs/upsc/SERIES.md`.
**Workflow (AK, 3 Nov 2026):** AK runs Gemini with the prompt from `scripts/upsc/prompt_research.py <id>` and pastes the research note;
Claude cross-checks it at the sources and asks before writing the script (`docs/upsc/PIPELINE.md`).
**Market evidence (3 Nov 2026):** `docs/upsc/market/DEMAND_CHECK_2026-11-03.md`. Short animated explainers beat long lectures
10 to 100 times on the same topics; Hindi audiences are the largest. Proposal awaiting AK: keep the playlists in serial order, but
release first the high-demand episodes (payments and UPI fees, repo rate, GDP, CPI and WPI, the monsoon), and add a Hindi track.
**Gold Standard (AK):** NCERT first for every subject, then other sources. Every topic in depth, taught ELI5, with no loss of depth. Full rules and gates: `docs/upsc/GOLD_STANDARD.md`. It wins over this page.

**Source of the syllabus:** UPSC's Civil Services Examination 2026 notice, Section III (PDF pp. 32-38, 61-76, 136-138).
**Files:** episode list `docs/upsc/catalogue.csv`; coverage test `scripts/upsc/check_coverage.py`.
Episode titles are working titles. No fact in them has been checked yet. Nothing is scripted, voiced or built.

---

## 1. What the syllabus tells us

UPSC writes the same subjects at three depths, so the series needs depth levels.

| Layer | How it is written | Example | What we do |
|---|---|---|---|
| Prelims Paper I | One line per subject | "Indian Polity and Governance-Constitution, Political System, Panchayati Raj..." | Covered by the core episodes |
| Mains General Studies I-III | A few bullets per theme | "Issues related to direct and indirect farm subsidies and minimum support prices" | Core episodes are built on these bullets |
| Optional subject papers | Long and detailed, "honours degree level" (p33) | "Harrod's model", "C3, C4 and CAM mechanisms" | Advanced episodes |

Four findings shape the plan:

1. **Agriculture has no Prelims line of its own.** In General Studies it sits inside GS-III (crops, irrigation, MSP, PDS, food processing, land reforms). Its core is short (20 episodes). The optional paper is mostly crop science, so it adds 21 advanced episodes.
2. **"Polity" is not an optional subject.** The nearest is Political Science and International Relations. We use only its "Indian Government and Politics" part.
3. **The five subjects overlap, so one episode can serve several.** 29 episodes serve more than one optional. Land reforms is printed in GS-III, Economics, Geography, History and Political Science: one episode (AGR-06). Others include the Green Revolution, the drain of wealth, Panchayats and the Finance Commission.
4. **Parts of the printed syllabus are dated.** Examples: "Twelfth Finance Commission" (Economics II), "New Rural, Employment Guarantee Scheme" (Economics II), "vision 2020" (Agriculture II). These episodes tell the history, then give the current position as read at the source. They never stop where the syllabus stops.

### In scope
169 syllabus lines. The coverage test confirms that each has at least one episode.

### Out of scope (decided, so nobody assumes the series is complete)
- Prelims: Environment and General Science as subjects, and Paper II (aptitude). Some environment is covered through Geography and Agriculture.
- GS-I: the Indian society bullets, apart from population, poverty and urbanisation.
- GS-II: international relations. GS-III: science and technology, internal security. Disaster management only through Geography.
- GS-IV (ethics), Essay and the language papers.
- Political Science: political theory and all of Paper II.

A student cannot use this series alone, and the channel should not say they can.

---

## 2. The catalogue

| Subject | Core | Advanced | Total | Figures will change | Mostly fixed |
|---|---:|---:|---:|---:|---:|
| Economics | 28 | 16 | 44 | 22 | 22 |
| Geography | 41 | 13 | 54 | 25 | 29 |
| History | 69 | 8 | 77 | 1 | 76 |
| Polity | 36 | 0 | 36 | 27 | 9 |
| Agriculture | 20 | 21 | 41 | 23 | 18 |
| **Total** | **194** | **58** | **252** | **98** | **154** |

- **Core** (`C`) = Prelims and GS. Every viewer needs it. **Advanced** (`D`) = optional papers only, a smaller audience. Both are taught in full depth: the difference is the level of the topic, not how seriously it is taught.
- **252 is a minimum.** Topics that do not fit one video become a series under the Gold Standard. All five researched pilots came back as more than one video: 11 videos in all (Basic Structure 2, Plassey and Buxar 2, monsoon 2, repo rate 3, MSP 2). These five were not a random sample, so do not scale this up to the whole catalogue. The real count comes only after NCERT mapping.
- **Fixed / living** (the `change` column): a fixed episode explains something that does not move (Plassey, plate tectonics). A living episode holds a law, a scheme or a figure that will change.
- History is almost all fixed, Polity is mostly living. That split drives the release order (section 7).

---

## 3. Evergreen rules and the current-affairs system

### Writing so a video does not age
1. **Explain the mechanism first.** The idea should still be true when the number has moved.
2. **Banned in narration and titles:** "this year", "recently", "currently", "now", and any exam year.
3. **No figures that will change in titles or thumbnails.**
4. **Every dated figure carries its year**, on screen and spoken ("in 2023-24").
5. **Keep living figures in their own scenes**, one or two per episode, so they are easy to find and rebuild.

### Keeping a record of what can go stale
Each living episode gets `docs/upsc/living/<id>.csv`: the claim, the value, the source link, the as-of date, the next expected release, and where it appears in the video.

### How we notice a change
- **Existing job:** `com.datakadai.hotscan` already writes data-bearing releases from PIB, RBI, SEBI and Lok Sabha to `docs/datakadai/hot/<date>.md`. Add a step that matches these against the living records.
- **Add to the sources it watches:** Supreme Court constitution bench judgments and new Acts or amendments, which Polity needs.
- **Known yearly events:** Union Budget, Economic Survey, RBI policy meetings, MSP announcements, each year's UPSC notice (to catch syllabus changes).

### What we do when something changes
YouTube does not let us replace the video file on an existing upload, so updates are layered:

| Size of change | Example | Action |
|---|---|---|
| Small | A new year's figure, same story | Update the description and pinned comment with the date and source |
| Real news | A new scheme, a court judgment, a new Finance Commission award | An **Update Short** (30-45 s, "what changed") linked to and from the parent episode, and added to a Current Affairs playlist |
| The explanation is now wrong | A law the episode explains is replaced | AK decides whether to make a new full episode. The scene-by-scene build means mostly the changed scenes need new work. The old one stays up with a note, under house rule 8 |

Big current events that have no parent episode can get their own short explainer, which is then linked back to the nearest episodes.

---

## 4. What one episode pack holds

- **Long video:** 16:9, with no fixed length. The depth checklist decides, and a big topic becomes a series. Reference: the Babies film runs 9.9 min with 98 scenes.
- **Shorts:** 2-3 cut around its strongest ideas, written to `SHORTS_ENGINE.md` rather than clipped. They are doors into the episode. They never carry the teaching on their own.
- **Recall ending:** three key points and one practice question that we write ourselves. No copied coaching material.
- **Notes:** one carousel or PDF page.
- **Description:** the syllabus line it serves and every source.
- **Chapters and subtitles.**

**Languages:** English and Hindi, because the papers are set in both (p26). Voices per AK's 29 Oct picks. Regional tracks later, using the Namakkal route.

**Audience:** curious adults and aspirants. Titles lead with the question, and the syllabus tag goes in the playlist and description. Mark every video "not made for kids", since a cartoon look could otherwise be misread.

---

## 5. Research and teaching

Everything is in `docs/upsc/GOLD_STANDARD.md`: the order of sources (NCERT first), the NCERT book map, the five-rung ELI5 method, and the gates every episode must pass.

Two limits to plan around:
- **Agriculture:** I found no dedicated NCERT textbook, only chapters spread across other books. Its advanced episodes will lean on ICAR and similar material.
- **Figures and law:** NCERT is the base, but the publisher of record supplies every current figure and law, because textbooks age.

---

## 6. Look, story and engine

**Look:** the cartoon engine from Babies (`src/looks/cartoon/long`), with its cast, sets and lip sync. AK picked the Kurz look over it for Namakkal, but asked for cartoon here, so the pilots use cartoon.

**Story:** AK's storytelling rules v2 (2 Nov 2026), `docs/STORYTELLING.md` on the mmvideo branch `claude/keen-ride-f20uky`. They replace STORY_ENGINE for this series: one promise, one arc from the nine, stacked open loops, but/therefore links, pay off and stop. Check with `python3 scripts/upsc/script_tool.py research/upsc/<id>/script_<part>.py --story-check <story_check.py>`, using `scripts/story_check.py` from the same branch. Template-looking videos are still the risk: rotate arcs.

**What the engine has:** Babies uses `stage` (52 scenes), `map` (19), `statement` (8), and chart scenes (`tfr-line`, `multiples`, `slope`, `scatter`).

| To build | Needed for | Start from |
|---|---|---|
| Period cast and sets: ancient, medieval, colonial, 1947 onward, world | History | `cast_b*`, `sets.tsx` |
| Historical map: rivers and regions with moving empire extents, no modern borders | History | Indica Atlas `src/geo/engine/motion.tsx` for motion. The extents must be drawn by us from sources |
| Timeline, quote and document scenes | History, Polity | `src/looks/kurz` (`timeline.tsx`, `quote.tsx`, `doc.tsx`), branch `datakadai/namakkal-looks` |
| Earth diagrams: cross-sections, plates, wind and current arrows, globe | Geography | New |
| Process kit: how a bill moves, who appoints whom, court scenes | Polity | New |
| Economics kit: curves, flows of money, a simple bank | Economics | New, plus the existing charts |
| Farm kit: crop calendar, plant cross-section, soil layers, godown | Agriculture | New, plus `seasons.tsx` from Kurz |
| Recall ending | All | New |

---

## 7. Order of work

**Step 0: five pilots, one per subject.** Each tests something different:

| Pilot | Tests |
|---|---|
| POL-06 Basic Structure | Process kit, a court story |
| HIS-30 Plassey and Buxar | Period cast, historical map, the history source rule |
| GEO-07 The monsoon | Earth diagrams |
| ECO-15 Repo rate and prices | Economics kit, living figures |
| AGR-07 MSP | Farm kit, living figures, the update system |

Each pilot goes through every Gold Standard gate, including a real child test and an expert review. Measure the real hours, the final length and how many scenes each one reuses. AK watches and decides on the look, the length and the tone.

**Step 1: set the pace from the pilot numbers.** For scale only, since full depth may split topics and raise the count:

| Episodes a week | All 194 core | All 252 |
|---:|---:|---:|
| 3 | 65 weeks | 84 weeks |
| 5 | 39 weeks | 51 weeks |
| 7 | 28 weeks | 36 weeks |

**Step 2: release as five serials, one subject a weekday (AK, 2 Nov 2026).** The watching order, season by season, is `docs/upsc/SERIES.md` (made by `scripts/upsc/series.py`): Polity starts from the Preamble, History from Plassey. Inside a serial, episodes go in story order, so the rule below only decides which serial season to build next.

The earlier rule, kept for choosing between seasons:
1. Episodes that later ones depend on, in each subject (GDP, the Constitution, Earth's interior, sources of history, the crop calendar).
2. Fixed episodes before living ones where we have a choice: they need no upkeep and keep earning.
3. Within that, order by evidence: how often UPSC's own past papers ask a topic, and vidIQ and Jev for viewer demand. This analysis is not done yet.

**Step 3: Update Shorts start as soon as the first living episode is out,** then continue whenever something changes.

**Step 4: advanced episodes come last,** subject by subject, and only where the core has found an audience.

---

## 8. Guardrails

Existing rules hold: AK posts everything by hand, no keys printed, AI voice disclosed. For sources, AK's NCERT-first rule applies to this series; figures still come only from the original publisher.

New for this series:
- **Religious figures:** no deities, Prophet Muhammad or the Sikh Gurus shown as characters. Symbols, places and text only (extends the Inner Chariot rule). Applies to HIS-06, HIS-16, HIS-17, HIS-27 and others.
- **Contested history:** Aryans, 1857, Partition, caste and Aurangzeb get evidence and named views, with no villains and no heroes invented for the story.
- **Politics:** Polity episodes explain the text and the judgment. No party view, no caricature of living politicians. POL-07 (Emergency) covers what changed in the law.
- **Maps:** India's boundaries must follow the official Survey of India map. Check the current map data before the first map render. `CARTOON_RESEARCH.md` already flags a licence trap in DataMeet data.
- **No implied link to UPSC:** no emblem, no UPSC logo, and a plain "not affiliated" line in the channel description.
- **Accuracy:** a wrong fact costs an aspirant marks, so every subject needs a human reviewer, like the Sanskrit reviewer on the Gita (gate R1).
- **NCERT copyright:** read and teach in our own words and drawings. Never show its pages, text or figures.

---

## 9. AK's decisions

| # | Decision | Recommendation |
|---|---|---|
| 1 | Which channel, and its name | A new sixth channel. An exam-minded audience would dilute the others, and none of the five fits all five subjects. Name is AK's |
| 2 | A human expert reviewer for each subject (gate R1) | Yes, starting with the pilots. Without one, an episode cannot reach Gold |
| 3 | Go-ahead for the five pilots, including downloading their NCERT chapters | Yes |

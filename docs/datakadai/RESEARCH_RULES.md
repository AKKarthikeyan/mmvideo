# Data Kadai: research rules (v1, 27 Oct 2026)

**What this is:** the conditions every Data Kadai Short and long-form must meet before a config is written. It is written to be the brief for a research AI agent, word for word. It sits on top of PREFERENCES.md, WRITER_GUIDE.md and SOURCE_MAP.md and does not replace them: those decide the format and the house rules, and this file decides **what the data really says**. If they conflict on a fact, this file wins.

**AK's goal (27 Oct 2026):** no video that repeats the number everyone has already seen in the news. Every story comes from deep research in the official tables. Leave no stone unturned, and don't stop at one table. Primary publishers first. Never borrow a newspaper's, think tank's or YouTuber's reading of the data.

**MUST** = a hard rule; breaking it fails the research. **NEVER** = forbidden. **SHOULD** = expected; if skipped, write down why.

---

## Rule 0: nothing comes from memory
0.1 The agent's background knowledge is **not a source**. It may suggest which table to open, and NEVER supplies a number.
0.2 Every number MUST be read from the publisher's own file (PDF, XLSX, CSV or API) during this run, saved under `public/datayt/sources/`, and read in the config by table spec (WRITER_GUIDE), never typed in.
0.3 A number that can't be found in an official table is **UNVERIFIED** and can't be shown or said.

---

## 1. Source tiers (match SOURCE_MAP.md)
- **Tier 1 · the publisher of record:** MoSPI (NSS, PLFS, HCES, ASI, national accounts), Census and SRS, RBI (DBIE, Handbook of Statistics on Indian States), ministries' own reports and dashboards, Lok Sabha and Rajya Sabha answers, CAG, Finance Commission, Election Commission, regulators (SEBI, IRDAI, PFRDA, TRAI), Economic Survey and Budget documents, gazette notifications, and international bodies for cross-country figures (World Bank, IMF, UN agencies, ILO, WHO).
- **Tier 2 · research institutions** (as in SOURCE_MAP: NCAER, IIPS for NFHS, ICRISAT and the like). Use only for data the government doesn't publish; name them on screen.
- **Tier 3 · industry bodies, NGOs, private compilers** (AMFI, NSE Market Pulse, CMIE and the like). Name them on screen, and cross-check against a Tier 1 figure wherever one exists. If they disagree, say so or drop the claim.
- **Banned as evidence:** news articles and explainers (even when they quote the right number), think-tank charts and blog posts, YouTube and Instagram, data aggregator sites that re-host tables (Statista, Knoema, IndiaStat and the like; use them only to find the original), Wikipedia, AI answers, social media posts, and a PIB headline without the table behind it.

**Readings belong to us.** A ministry press release or a newspaper may say what a number "means". NEVER copy that reading. Our reading comes only from the table itself, and our own computed findings are tagged as ours (the WRITER_GUIDE `so` card).

---

## 2. Search coverage: the stones to turn
The agent MUST work through all of these and log each step in `search_log.md`, including the ones that found nothing:
1. **The latest edition.** Confirm no newer release is out (the publisher's release calendar and press-release page). Record the release date and status: advance, provisional, revised or final.
2. **The methodology note.** Read the definitions, the unit, the reference period, the sample size and design, and any caution the publisher prints (MoSPI's thin-sample warning for state item indices, for example). These go in `notes` and, where they change the meaning, on the card.
3. **The footnotes of the table itself:** which states are missing, which are estimates, which UTs are merged or split (Telangana from 2014; J&K and Ladakh from 2019; Dadra and Nagar Haveli and Daman and Diu merged in 2020).
4. **A second official source for the same quantity** (RBI Handbook vs MoSPI, a Lok Sabha answer vs the ministry dashboard, the Census vs SRS). Record whether they agree.
5. **The earlier rounds.** Find the previous edition or survey round, and check whether the series changed (base year, definition, sample frame). A then-and-now comparison across a definition change is NEVER allowed without saying so.
6. **The denominator.** For any per-person, per-household or share figure, find the population or base the publisher used. If we compute it ourselves, record the population table and its year (projected population is labelled as such).
7. **Revisions.** Check whether the figure was revised in a later release, and use the latest revised value, saying "revised" where it matters.
8. **Original-language releases** where a state publishes only in its own language (state economic surveys, state budget documents in Tamil, Hindi, Marathi and so on).
9. **Parliament.** Search Lok Sabha and Rajya Sabha answers on the topic (they often carry state-wise annexures that no dashboard shows).

---

## 3. When research may stop
Research stops only when **all** of these are true:
- every state and UT on the closing map has a value or a stated gap;
- steps 1–9 in section 2 are logged;
- the figure used is the latest edition, and its status is recorded;
- at least **two official sources** agree on the headline number, or the disagreement is written down and handled;
- the **last three tables opened** added no new caveat, revision or contradiction;
- all the gates in section 7 pass.

---

## 4. Claims
4.1 One claim per number or fact, in `claims.jsonl`: `id`, `claim`, `table` (file and table id), `cell` (row and column), `value`, `unit`, `period`, `status`, `release_status` (advance / provisional / revised / final), `source_short` (as printed on the card), `notes`.
4.2 **Statuses:**
- **VERIFIED:** read from a Tier 1 table.
- **CROSS-CHECKED:** two official sources agree.
- **TIER-3:** said only with the source named.
- **DISPUTED:** official sources disagree; said only as a range or a dispute, or cut.
- **UNVERIFIED:** not shown.
4.3 **Computed findings** (ranks, ratios, growth, per-person figures) are computed by `build_beats.py` from the table spec, never by hand. The formula is recorded, and at least one finding is carried as a test (WRITER_GUIDE).
4.4 **No cause, no motive.** "The table shows how much, not why" (WRITER_GUIDE). A cause may be said only if an official report states it, quoted with page.
4.5 **Comparability:** same year, same definition and same unit across all states on one card. Different survey years on one map are NEVER allowed.
4.6 **Rounding** must stay true. Use lakh/crore or million/billion as PREFERENCES says, and print the exact value in the post pack.

---

## 5. The popular reading is quarantined
The news headline or social-media take on the same release may be read **only** to list the claims it makes. Each one goes into `myths.md` with a verdict (Confirmed / Contradicted / Exaggerated / Unverifiable) backed by our table. Nothing from it enters the script. A video that only repeats the headline fails the fresh-angle gate.

---

## 6. Honesty and access
- Use only legal access. Respect the site's terms and rate limits; no evasion of bot checks. If a site is browser-only (SOURCE_MAP "Browser only"), AK or a browser session fetches it.
- Save the file as downloaded, with the date and time read. A live dashboard is saved as a snapshot, and no line may be voiced that a later update could make false without our knowing (WRITER_GUIDE rule 9).
- No politics, no mocking a state, no rage-bait (AK's rules). A number that shames a state is shown with the same care as any other, and the source line carries the caveats.

---

## 7. Gates: all must pass before the config is written
- **G1 Sourced:** every number on screen or in the voice traces to a saved table and cell.
- **G2 Latest:** the edition is confirmed latest, and its release status is recorded.
- **G3 Coverage:** the section 2 steps are logged.
- **G4 Cross-check:** the headline number agrees across two official sources, or the disagreement is handled.
- **G5 No banned evidence.**
- **G6 Independent check:** a second agent or person, who didn't do the research, re-opens the table for the headline number and for one in three of the other numbers.
- **G7 Fresh angle:** at least **one computed finding that no news report of the same release carried**: a rank change, a per-person flip, a gap between two states, or a long-run change. This is the reason for the video.
- **G8 Myths audited:** every headline claim in `myths.md` has a verdict.
- **G9 Data tests:** `build_beats.py <id> --check` exits 0.

---

## 8. Output
`research/<date>/<id>/` holds `dossier.md` (what the data says, in plain words, with claim IDs), `claims.jsonl`, `search_log.md`, `myths.md`, `open_questions.md` and `verify.md`. The tables themselves go under `public/datayt/sources/` as now.

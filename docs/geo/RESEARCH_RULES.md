# Indica Atlas: research rules (v1, 27 Oct 2026)

**What this is:** the conditions every Indica Atlas Short or long video must meet before a script is written. It is the brief for a research AI agent, word for word. The week scripts (for example *Week2_Scripts_and_Sources.md*) decide the format. This file decides **what is true on the map and in the history**. If they conflict, this file wins.

**AK's goal (27 Oct 2026):** no "Why" Short that tells the version every geography channel already told. Every story comes from deep research. Leave no stone unturned, and don't stop at 3–4 sources. Primary sources first; secondary only when the primary can't be reached, and never another person's interpretation or their version of the story. No YouTube, no random articles.

**MUST** = a hard rule; breaking it fails the research. **NEVER** = forbidden. **SHOULD** = expected; if skipped, write down why.

---

## Rule 0: nothing comes from memory
0.1 The agent's background knowledge is **not a source**. It may suggest where to look, and NEVER supplies a fact, a distance, a date or a border.
0.2 Every fact MUST come from a document or dataset opened during this run, with the exact words (or the dataset values) copied and the location recorded.
0.3 A famous "fact" that can't be found in a document is **UNVERIFIED** and can't be narrated.

---

## 1. Source tiers

### Tier P: primary
- **P1 · Official maps and geodata:** Survey of India maps (the official Indian view of borders, always used for any border), Natural Earth with the India point of view (house rule, `ne_10m_admin_0_countries_ind`), ISRO Bhuvan, NASA/USGS imagery and elevation (SRTM, Blue Marble), national hydrographic offices, UN DOALOS maritime-zone filings.
- **P2 · Legal and official records:** treaties and agreements (full text), gazette notifications, parliamentary answers, Census of India, government department pages (Ministry of External Affairs, Ministry of Home Affairs, state forest and wildlife departments), court judgements, UNESCO nomination dossiers, ASI excavation reports.
- **P3 · Records made at the time:** period reports and accounts written by the people involved (an explorer's own report in the *Journal of the Royal Geographical Society*, for example), colonial administrative records, period gazetteers and census reports, period newspapers, old maps with known dates.
- **P4 · The owner of a number:** UN Comtrade, FAO, World Bank, the national statistics office, and wildlife census reports from the counting body.
- **P5 · Science:** peer-reviewed papers that report their own measurements (excavation results, species counts, geology).

**Colonial and court records** are primary for *what officials recorded*, not neutral truth. Treat them as an interested party where empire, revenue or rule was at stake (rule 6.2), and say whose record it is.

### Tier S: secondary (only when the primary can't be reached)
Scholarly, footnoted work (university-press histories, peer-reviewed history or geography journals, critical editions and translations of old texts). It is used first as a **map to its footnotes**, and only as last-resort evidence for a fact whose primary can't be reached, recorded as `S → cites [P source]`. NEVER take its narrative, framing or "what it meant".

**Translations** of Persian, Sanskrit, Tamil, Pali, Chinese, Arabic or Portuguese sources: use a scholarly edition. Name the translator, and keep the original line where it can be had.

### Tier X: banned as evidence
- YouTube and every geography or history channel (including the one that inspired this channel)
- Blogs, listicles, travel sites, "amazing facts" pages, Quora, Reddit
- News features retelling history (a newspaper *from the time* is P3)
- Wikipedia (a finding aid only: open its references)
- AI answers, and maps made by unknown hands
- Tourism-board marketing copy, used only as evidence of what the board claims

---

## 2. Search coverage: the stones to turn
Log every search, including the ones that found nothing (`search_log.md`):
1. **The official map and boundary record:** Survey of India, the relevant treaty or agreement, the MEA's own statement. For any **disputed area**, record the official Indian wording and use it (house rule: borders follow the official Indian view; disputed areas are labelled as such).
2. **Measurements we make ourselves:** distances, areas and elevations computed from coordinates and official geodata. Record the method (great-circle distance, which points, which dataset) so anyone can repeat it. NEVER copy a distance from an article.
3. **Treaties, gazettes and legal texts** in full, not summaries.
4. **Period records:** gazetteers, census reports, administrative reports, explorers' own reports, ship logs where they exist.
5. **Old maps,** dated and from known collections (national archives, the British Library, the Library of Congress, the David Rumsey collection), to see how a place was drawn then.
6. **Archaeology and science:** excavation reports (ASI and foreign missions), peer-reviewed papers, species and population counts from the counting body.
7. **Data owners** for any modern number (UN Comtrade, FAO, the Census, state departments).
8. **Original-language sources:** the language of the place and of the record (Portuguese for Goa, Dutch for the VOC, Persian for Mughal records, Tamil for Chola inscriptions, Burmese for Ratnagiri's exiled king, and so on), via critical editions.
9. **The other side's record,** when two countries or communities are involved (both treaty texts, both census counts). Log what each says.
10. **Place names:** the current official name, the historical names, and the right spelling and pronunciation (for the voice).

**Chase every citation to its root,** and find the **earliest dated telling** of any famous story. How the story grew in later tellings is often the best material.

---

## 3. When research may stop
Research stops only when **all** of these are true:
- at least **10 distinct sources** have been examined, and at least **5 of them are primary** (a Short's narrower scope allows a smaller floor than the Inventor's Desk), or the log proves fewer exist;
- every step in section 2 that applies is logged;
- every spine claim is verified;
- the **last three sources** added nothing new;
- the gates in section 9 pass.

---

## 4. Claims
4.1 One fact per claim in `claims.jsonl`: `id`, `claim`, `type` (place / distance / date / event / number / name / border / quote / visual), `spine`, `status`, `evidence` (`src`, `locator`, `quote` or `values`, `quote_lang`, `translation`), `method` (for measurements), `notes`.
4.2 **Statuses:** the same as the Inventor's Desk: VERIFIED-P, CORROBORATED, SECONDARY-ONLY (hedged), RECOLLECTION (attributed), DISPUTED (said as a dispute), UNVERIFIED (not narrated) and CONTRADICTED (only as the myth corrected).
4.3 **Spine claims** MUST be VERIFIED-P or CORROBORATED: the place and its position, every distance, area, height and count said or shown, every date, the key event, and every border or name on the map.
4.4 **Borders and sensitive topics:**
- the official Indian map is always used;
- disputed areas get the official wording;
- no side-taking language;
- religious or communal history is told only from the records, with each record's author named;
- ⚠ sensitive topics are flagged for AK before scripting (the 365-idea list already marks 22).
4.5 **Ranges, not false precision:** when official counts differ (Bhitarkanika crocodiles 1,809–1,880, for example), show the range or "1,800+" and say why.
4.6 **Visual facts:** coastlines, rivers and terrain come from geodata. Anything the artist adds is tagged `artistic` and never contradicts the record.

---

## 5. The popular version is quarantined
Existing Shorts and articles on the topic may be skimmed **only** to list their claims. Each claim goes into `myths.md` with a verdict (Confirmed / Contradicted / Embellished / Unverifiable). Nothing enters the script from them. The famous version is the thing we test.

## 6. Conflicts
Record every version. Rank them: a record made at the time beats a later recollection; primary beats secondary; closer to the event beats further away; an interested party (an empire, a claimant state, a company) is weaker on points where it gains. NEVER silently pick one. If it can't be settled, it is DISPUTED. (Week 2 example: the Attock 1758 story was dropped because historians disagree.)

## 7. Honesty and access
Legal access only; no paywall tricks, no bot-check evasion. Save a local copy and an archive link for every source used as evidence. Keep quotes short. Never use CC BY-SA images (AGENTS.md rule 5); prefer drawn-in-code art, public-domain material or our own.

## 8. Output
`docs/geo/research/<id>/`: `dossier.md`, `claims.jsonl`, `sources.jsonl`, `search_log.md`, `myths.md`, `conflicts.md`, `open_questions.md`, `verify.md`, `sources/`. These use the same shapes as the Inventor's Desk (`docs/inventors_desk/RESEARCH_RULES.md` section 8), so `docs/inventors_desk/scripts/research_check.py` can run on them.

## 9. Gates: all must pass before scripting
- **G1 Sourced:** every narratable claim has evidence.
- **G2 Spine:** every spine claim, including every map label and measurement, is verified.
- **G3 Coverage:** section 2 is logged.
- **G4 Floor and saturation.**
- **G5 No banned evidence.**
- **G6 Independent verification:** a separate checker re-opens every spine source, re-runs every measurement, and spot-checks one in three of the rest.
- **G7 Fresh angle:** at least **2 verified facts the existing videos and articles leave out or get wrong**, one usable as the hook or the "why" answer.
- **G8 Myths audited.**
- **G9 Map check:** every border, label and pin on screen matches the official map and the claims ledger.

Each script line carries its claim IDs (`"claims": [...]`). The source table under each script (as in Week 2) lists the primary sources only.

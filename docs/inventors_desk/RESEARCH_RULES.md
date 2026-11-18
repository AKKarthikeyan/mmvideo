# The Inventor's Desk: research rules (v1, 27 Oct 2026)

**What this is:** the conditions every episode's research must meet before anyone writes a script. It is written so it can be the brief for a research AI agent, word for word. STORY_FORMAT.md decides *how* a story is told. This file decides *what is true*. If they conflict, this file wins.

**AK's goal (27 Oct 2026):** no script that tells the version everyone already knows. Every story comes from deep research. Leave no stone unturned, and don't stop at 3–4 sources. Use primary sources first. Use secondary sources only when the primary can't be reached, and even then never borrow another person's interpretation or their version of the story. No YouTube videos, no random articles.

Words used below: **MUST** = a hard rule; breaking it fails the research. **NEVER** = forbidden. **SHOULD** = expected; if skipped, write down why.

---

## Rule 0: nothing comes from memory

0.1 The agent's own background knowledge is **not a source**. It MAY use it to guess where to look, and NEVER as evidence.
0.2 Every fact in the output MUST come from a document the agent opened **during this research run**, with the exact words copied and the place in the document recorded.
0.3 If a fact "everyone knows" can't be found in a document, it is **UNVERIFIED** and can't be narrated, however famous it is.

---

## 1. Source tiers

### Tier P: primary (always look here first)
Made by the people involved or by an official record, at or near the time.

| Code | Kind | Examples |
|---|---|---|
| **P1** | The inventor's own words | Patents (full text, claims, drawings), patent file histories, lab notebooks, letters, diaries, the inventor's own papers, books and autobiography, speeches, Nobel lectures, recorded or transcribed interviews in their own words, oral-history transcripts |
| **P2** | Official records | Patent and trademark registers, company registries, court records, government reports, birth/death/census records, regulator decisions (FDA approvals and labels), award bodies' own citations |
| **P3** | Records made at the time by others | Newspapers and magazines from the time of the event, company annual reports, product catalogues and adverts of the time, photographs and film with known origin, objects held in museum collections with catalogue records |
| **P4** | The owner of a number | For "Today" figures: the body that collects the data (IEA, ITU, World Bank, UN agencies, industry bodies, company filings, NASA/ESA mission data). Never a news story *about* the number |
| **P5** | For Now episodes | The peer-reviewed paper itself (and its supplementary data), the preprint, the company's own press release or filing (labelled **company claim**), the regulator's document |

**Later recollections:** an interview the inventor gave decades later is primary evidence of *what they said then*, not proof of what happened. Label it `recollection (year)`. Where it conflicts with a record made at the time, the record made at the time wins, and the conflict is logged (section 6).

### Tier S: secondary (only when the primary can't be reached)
Allowed **only** if all of these are true:
- It is scholarly: a peer-reviewed history-of-technology or history-of-science journal, a university-press book, a museum curator's catalogue essay, or a biography with footnotes.
- It cites its own primary source for the fact in question.

How Tier S may be used:
- **As a map (always allowed).** Read its footnotes, then go and get the primary sources it cites. This is the main use of secondary sources.
- **As evidence, last resort only.** If the primary it cites truly can't be reached (paywalled with no legal copy, offline archive, lost), the fact may be recorded as `S → cites [P source]`, and the search for the primary is logged.
- **Facts only. NEVER** take its narrative, framing, adjectives, scene-setting, reconstructed dialogue, guesses about motive, or "what it meant". If the script needs meaning, the meaning comes from our reading of the primary sources.

### Tier X: banned as evidence
NEVER use these to support a claim:
- YouTube or any video, podcasts, TV documentaries
- Blogs, Medium, Substack, listicles, "fun facts" and trivia sites, content farms
- News features or magazine pieces that retell history (a newspaper report *from the time of the event* is P3, not X)
- **Wikipedia**: a finding aid only. Open its references and judge each one by these tiers.
- Quora, Reddit, forums, social media posts (except the inventor's or company's own account, which counts as P1/P5)
- AI-generated text of any kind, including search-engine AI answers
- Quote sites (BrainyQuote and the like)
- Children's books, and popular-history books with no footnotes
- A company's "Our story" or marketing page. This is usable only as P5 evidence of **what the company claims**, labelled that way, and never as proof that it happened.

---

## 2. Search coverage: the stones to turn

2.1 The agent MUST search **every** category below that could apply, and MUST log each search, including the ones that found nothing (section 8, `search_log.md`). A search that found nothing still counts as a turned stone. Skipping a category needs a written reason.

| # | Category | Where |
|---|---|---|
| 1 | Patents | Google Patents, Espacenet, WIPO Patentscope, USPTO full text, the inventor's own national office (e.g. Swiss IGE, DPMA, INPI, Indian Patent Office). Find **every** family member and country filing, not just the famous one. Read the description and the claims, not only the abstract. |
| 2 | Newspapers from the time | Chronicling America, Trove, Gallica, Delpher, ANNO, e-newspaperarchives.ch, British Newspaper Archive (index), the Times of India / ProQuest Historical Newspapers where reachable, and the inventor's local papers |
| 3 | Digitised books and periodicals | Internet Archive, HathiTrust, Google Books (full view), Biodiversity Heritage Library; trade magazines of the period (e.g. Popular Science, Popular Mechanics, industry journals) |
| 4 | Journals | The inventor's own papers (JSTOR, the publisher, Crossref); scholarly history articles, used for their footnotes |
| 5 | Archives and museums | National archives, the company's archive, museum collection databases (Smithsonian / Lemelson Center, Science Museum Group, Deutsches Museum, Computer History Museum, Science History Institute), university special collections |
| 6 | Oral histories and interviews | IEEE History Center, AIP, Computer History Museum, Science History Institute, national radio/TV archives (use only the transcript or recording of the person themselves) |
| 7 | Official records | Trademark registers, company registries, court cases, government and regulator documents, award bodies |
| 8 | The inventor's own publications | Autobiography, memoirs, speeches, the company's own early publications and annual reports |
| 9 | Data owners (Today beat) | IEA, ITU, World Bank, UN, industry associations, company filings, space agencies |
| 10 | Original language | Every category above MUST also be searched **in the inventor's language and country** (French and German for a Swiss inventor, Japanese for a Japanese one, Tamil or Hindi where it applies). Translate quotes and keep the original next to the translation. |

2.2 **Chase every citation to its root.** When any source cites another, follow the chain until it ends at a primary source or dies. Log where each chain ended. A fact whose chain dies in Tier S or X is not VERIFIED.

2.3 **Find the earliest telling.** For the central story (the "aha" moment), find the **earliest dated** account. Note how the story changed in later tellings; that drift is often the episode's best material.

2.4 **Outreach is AK's call.** The agent MAY draft a request to an archive, museum, company or family. It MUST NOT send emails, fill forms or create accounts. Drafts go in `open_questions.md` for AK.

---

## 3. When research is allowed to stop

There is **no fixed number of sources that counts as enough.** Research stops only when **all** of these are true:

3.1 **Floor:** at least **12 distinct sources** have been examined, and at least **6 of them are Tier P** (or the search log proves fewer exist).
3.2 **Coverage:** every category in section 2 has been searched and logged.
3.3 **Saturation:** the **last 4 sources** examined added no new claim, no new contradiction and no new lead.
3.4 **Spine complete:** every spine claim (section 4.3) is VERIFIED.
3.5 **Gates pass:** every gate in section 9 passes.

If 3.4 can't be met after full coverage, the agent stops and reports which spine claims are missing and why. **It never fills the gap with the popular version.**

---

## 4. Claims: how each fact is recorded

4.1 Break the story into **atomic claims**: one fact per line (one date, one name, one number, one event, one quote). "In [year] the engineer [name], from [country], noticed burrs after a walk" is four claims: the year, the name, the country and the event.

4.2 **Statuses:**

| Status | Meaning | May it be narrated? |
|---|---|---|
| **VERIFIED-P** | A Tier P source states it directly. The quote and its location are recorded. | Yes |
| **CORROBORATED** | Two **independent** sources agree, and at least one is Tier P | Yes |
| **SECONDARY-ONLY** | Only a Tier S source, which cites a primary the agent couldn't reach | Yes, but never as a spine claim, and the wording must be hedged ("records suggest…") |
| **RECOLLECTION** | Only the person's own later account | Yes, but attributed: "he later said…" |
| **DISPUTED** | Sources conflict | Only as a dispute ("accounts differ"), or cut |
| **UNVERIFIED** | No acceptable source found | **No** |
| **CONTRADICTED** | The evidence says it is false | **No**, except as the myth being corrected |

4.3 **Spine claims** MUST be VERIFIED-P or CORROBORATED:
- Who the inventor was, and their correct name in the original spelling
- What was invented, and what it actually did at first
- When: give the **right kind of date**. Patents have priority, filing, grant and publication dates; inventions also have date of the idea, first working model, first sale and announcement. Never mix them.
- Where
- The turning moment (the "aha" or the accident) as the earliest source tells it. Often only the inventor ever saw it. Then the spine claim is **what the inventor said** ("In 1961 he said on Swiss TV that…"): that is VERIFIED-P when a recording or text of their own words is read, and the voice attributes it ("he later said"). Added 27 Oct after the Velcro sample.
- How it works, checked against the patent or the paper, not against a later simplified explanation
- Every number said in the voice-over

4.4 **Independent** means the two sources don't come from the same origin. A newspaper that reprints a press release is not independent of the press release. Two books that both cite the same interview count as one source. Every source gets an `origin` field to make this checkable.

4.5 **Quotes and thoughts:**
- A spoken or written quote MUST be verbatim from a P1 source, with its location, its date and the original language. NEVER invent or tidy up dialogue.
- **Inner thoughts** ("he wondered why…") are allowed only if the person said or wrote it themselves. Otherwise narrate what they *did*, not what they thought.
- **Motives and feelings** ("he was frustrated", "he dreamed of…") need a source that states them. Otherwise leave them out.

4.6 **Numbers:** record the original value, unit, currency and year. Any conversion (old currency to today's money, miles to km) records its method and the source of the rate. Rounding follows STORY_FORMAT.md ("about", "more than"), and the rounded figure must stay true.

4.7 **Names and pronunciation:** record the original spelling, and a pronunciation from a primary or native-language source (a recording of the person or their family, or a native-language dictionary entry for the name). This feeds the voice track.

4.8 **Visual facts:** what the person, place, object and era looked like (clothes, the dog's breed, the machine, the landscape). Record sourced visual details as claims (type `visual`). Anything the artist has to invent is tagged `artistic` in the dossier, so the art never contradicts the record. The **voice-over NEVER states an artistic detail as fact.**

---

## 5. The popular version is quarantined

5.1 The "version everyone knows" is the thing we are checking, **not a source**. The agent MAY skim a popular telling (Tier X) **only** to list the claims it makes, and **must not copy any of its wording, structure, framing or hook**.
5.2 Every popular claim goes into `myths.md` with a verdict: **Confirmed / Contradicted / Embellished / Unverifiable**, each backed by claim IDs from the ledger.
5.3 Nothing enters the script from `myths.md` except through a ledger claim.

---

## 6. Conflicts

6.1 When sources disagree, record **every** version, with its source, date and tier.
6.2 Rank them, in this order: a record made at the time beats a later recollection; Tier P beats Tier S; the closer the source was to the event (in time and in who was involved), the stronger it is; an interested party (the company, a rival, a family member defending a legacy) is weaker on points where they gain.
6.3 NEVER silently pick one version. The dossier states which version we follow and why. If the conflict can't be settled, the claim is DISPUTED.

---

## 7. Honesty and access

7.1 Use only legal access. NEVER use Sci-Hub, LibGen, paywall bypass tricks or shared logins. If a source is paywalled, log it, look for a legal copy (the author's own copy, a library scan, an open-access version), and if there is none, list it for AK in `open_questions.md`.
7.2 Respect each site's terms and rate limits. Browse politely; no scraping floods and no evasion (the same rule as our BSE fetching).
7.3 Save a local copy (PDF or HTML) of every source used as evidence in `sources/`, and record a Wayback Machine link, so the claim can be re-checked after a link dies. These copies are private research files and are never republished.
7.4 Copyright: keep quotes in the ledger short (enough to prove the claim). The script retells facts in our own words.

---

## 8. Output: one folder per episode

`docs/inventors_desk/research/<episode-id>/`

| File | Contents |
|---|---|
| `dossier.md` | The real story in plain words: a dated timeline, the people (at most 3 who matter to the story), how it works, **fresh angles** (section 9, G7), hook and twist candidates, and artistic-licence notes. Every sentence carries claim IDs, e.g. `[C014]`. |
| `claims.jsonl` | One claim per line: `id`, `claim`, `type` (date / name / number / event / quote / mechanism / motive / visual), `spine` (true/false), `status`, `evidence` (list of `{src, locator, quote, quote_lang, translation}`), `notes` |
| `sources.jsonl` | One source per line: `src`, `tier` (P1–P5 / S), `kind`, `title`, `creator`, `created` (when the source itself was made), `accessed`, `url`, `archive_url`, `local_file`, `language`, `origin` (for independence), `access` (open / paywalled / offline) |
| `search_log.md` | Every search: date, database, query, language, number of hits, what was kept and why. Searches that found nothing are logged too. |
| `myths.md` | The popular claims and their verdicts (section 5) |
| `conflicts.md` | Every disagreement and how it was ranked (section 6) |
| `open_questions.md` | Gaps, unreachable sources, and draft requests for AK to send |
| `verify.md` | The verifier's report (G6) |
| `sources/` | Saved copies of evidence |

---

## 9. Gates: all must pass before scripting

| Gate | Check |
|---|---|
| **G1 Sourced** | Every narratable claim has at least one evidence entry with a locator and a quote |
| **G2 Spine** | Every spine claim is VERIFIED-P or CORROBORATED |
| **G3 Coverage** | Every category in section 2 appears in `search_log.md`, or has a written reason for skipping |
| **G4 Floor and saturation** | Section 3.1 and 3.3 met, shown in the log |
| **G5 No banned evidence** | No Tier X source appears as evidence for any claim |
| **G6 Independent verification** | A **separate** verifier (an agent or person who did not do the research) re-opens the source for **every spine claim** and at least **one in three of the rest**, chosen at random. For each one it confirms that the quote is really at that location *and* supports the claim (not just mentions the topic). Any failure sends the claim back and triggers a full re-check of that researcher's other claims from the same source. |
| **G7 Fresh angle** | The dossier lists **at least 3 VERIFIED facts that the popular version leaves out or gets wrong**, and at least one is strong enough to be the hook or the twist. If research finds none, the agent reports "no fresh angle", and AK decides whether the episode is worth making. |
| **G8 Myths audited** | Every claim in `myths.md` has a verdict |

---

## 10. Handing off to the script

10.1 The script writer (and the Bhagyaraj and Nolan story skills) may use **only** claims from `claims.jsonl` whose status allows narration (section 4.2). The story skills shape the structure and the heart; they never add facts.
10.2 Every line of narration in `script.json` carries the IDs of the claims it uses (a new field: `"claims": ["C003","C011"]`). Any line with no claim ID is either pure storytelling with no factual content ("So he looked closer.") or it fails review.
10.3 Hedged statuses keep their hedge in the voice-over: SECONDARY-ONLY → "records suggest"; RECOLLECTION → "he later said"; DISPUTED → "accounts differ" or "he claimed".
10.4 The on-screen source line names the **primary** source (for example "US Patent No. [number]" or "IEA, [report], [year]"), never a website that reported it.
10.5 **Visuals may dramatise; the voice may not.** The artist may stage a scene. The voice-over may only state ledger facts.

---

## 11. Building the agent (notes for the build)

- **Roles:** a **Lead** plans the claim list and the search plan; **Scouts** run the section 2 searches and fill `search_log.md` and `sources.jsonl`; **Readers** open each source and extract claims with quotes; a **Verifier**, with fresh context and no access to the researchers' notes beyond the ledger, runs G6.
- **An automated gate script** (`research_check.py`, like `structure_check.py` and `coverage_check.py`) checks G1–G5, G8 and the `claims` field in `script.json` mechanically, and exits 0 only when they pass. G6 and G7 need judgement, so they are recorded in `verify.md` and the dossier.
- **Worked sample (27 Oct 2026):** `research/P01-velcro/`. Velcro was re-researched from zero; the draft script built from it is `src/gadget/velcroglow/script_v2.json`. Run `python3 docs/inventors_desk/scripts/research_check.py docs/inventors_desk/research/P01-velcro --script src/gadget/velcroglow/script_v2.json`. On 27 Oct it was NOT CLEARED: G4 (newspaper archives behind bot checks, RTS recordings unwatched) and G6 (no independent verifier) were open.
- **Other channels:** Data Kadai, Indica Atlas and Moat Atlas each have their own RESEARCH_RULES.md (paths in /Volumes/DarwinSSD/AGENTS.md, rule 2).

# SHORTS LITE MODE (AK, 1 Nov 2026): THIS OVERRIDES THE STOP CONDITIONS AND FOLDER CONTENTS BELOW
AK: "for Shorts keep 2-3 original sources, don't go beyond that". For every Week 3 topic:
- Use **2-3 original (primary) sources** only. Choose the publishers that own the numbers or hold the document. Do not open more.
- Test the pitch against those sources. If they prove it false, say so and stop. If a spine claim cannot be verified in them, DROP the claim; do not widen the search.
- Keep at most **8 spine claims** (the ones a 90-word Short could say). Skip the long myths, conflicts and category logs: `search_log.md` is a short list of what you opened and what you kept; `myths.md` lists only the 3 most popular wrong claims with verdicts; `conflicts.md` only real disagreements between your sources.
- Still required: exact quotes with locators, saved copies in `sources/` (text only where enough), computations in `method/` (python3 -I), `LOCAL_ONLY.md`, 2 fresh angles, a 'safe to say' list, wording risks for sensitive topics, `verify.md` stub.
- Budget: about 80,000 tokens per topic. Stop as soon as the 8 claims are verified. Gate: `research_check.py <folder> --lite`.

# Indica Atlas Week 3: shared brief for every research and check agent (1 Nov 2026)

Each agent gets ONE topic from `TOPICS.json` in this folder. Research only. Never write a script, voice, render, post or publish anything. Never print or copy an API key. Today is 1 Nov 2026; your knowledge of recent events is not a source.

## Rules (read first, follow exactly)
- `/Volumes/DarwinSSD/MMVideo/docs/geo/RESEARCH_RULES.md`: Indica Atlas research rules. Rule 0: NOTHING from memory. Every fact comes from a document or dataset you open in this run, with exact words (or values) copied and the locator recorded. Tiers P1-P5 / S / X. Banned as evidence: news features, blogs, YouTube, Wikipedia (a finding aid only), think-tank explainers, tourism copy, AI answers.
- The topic's `pitch` is a CLAIM TO TEST, not a fact. If the record says otherwise, say so and give the honest wording. Say what each primary source's author gained or lost by the claim (rule 6).
- Output shapes: section 8 of `/Volumes/DarwinSSD/MMVideo/docs/inventors_desk/RESEARCH_RULES.md`. Worked examples of the exact shape (copy their style, headings and jsonl fields): `/Volumes/DarwinSSD/MMVideo/docs/geo/research/CY01-odisha-deaths/` and `CY02-bay-of-bengal/`. Gate script: `python3 /Volumes/DarwinSSD/MMVideo/docs/inventors_desk/scripts/research_check.py <folder>`; run it at the end and fix what it flags. G6 is done by a separate checker: leave verify.md as a stub saying "pending independent check".
- Output folder: `/Volumes/DarwinSSD/MMVideo/docs/geo/research/<id>/` where `<id>` is the topic's `id` (e.g. W3-01-up). Files: dossier.md, claims.jsonl, sources.jsonl, search_log.md (with "## Category N" headings for all 10 categories of section 2, including searches that found nothing), myths.md, conflicts.md, open_questions.md, verify.md (stub), sources/, LOCAL_ONLY.md (list copies that must stay on the SSD: papers, news, government PDFs; the repo is public), method/ for anything you compute (script plus saved output, `python3 -I`).
- Distances, areas, densities, rankings and comparisons are computed by us from official data, with the method recorded (rule 2.2). Never copy a computed figure from an article. Use one year and one basis for every comparison.

## What a Short needs (25-35 s, 85-100 spoken words, 70% India / 30% global audience)
Spine claims (every date, count, distance, area, name, border, label shown or said) must be VERIFIED-P or CORROBORATED. Hedged claims stay hedged. Find at least **2 fresh angles** (G7): verified facts the popular versions leave out or get wrong, one usable as the hook or the "why". List the popular claims in myths.md with a verdict; nothing from them enters the dossier. Give the dossier a "Hook and twist candidates" section, a "Map and visual notes" section (what to show; every border or pin from official geodata, house outline = Natural Earth India point of view `ne_10m_admin_0_countries_ind`, already in `public/geo/_shared/`), and a "What a 9-beat 85-100 word Short could safely say" list of the ten strongest verified one-sentence facts with claim IDs. Do NOT write the script itself.

## Sensitivity
Borders, religion, communities, colonial history and neighbours are ⚑: use official records only, name each record's author, take no side, show no disputed-map border, say what is disputed as a dispute. A topic flagged `sensitive` in TOPICS.json also gets a "Wording risks for AK" list in open_questions.md.

## Stop conditions and efficiency (AK: spend tokens carefully)
Stop when: at least 10 distinct sources examined and at least 5 primary (the log may prove fewer exist); every section-2 category logged; every spine claim verified; the last three sources added nothing new; research_check.py run. Be efficient: fetch each source once, save text rather than huge binaries where the text is enough (use `pdftotext`), do not re-read what you already have, do not search for facts that cannot change the Short, and do not pad. PIB and some government sites refuse plain fetches: use the built-in browser tools if available; never bypass a CAPTCHA, paywall or bot check (log it as unreachable and move on). Keep quotes short. Never use CC BY-SA images.

## Report back (under 250 words; do not paste file contents)
(1) Is the pitch true as worded? If not, the honest wording. (2) The five strongest verified facts with claim IDs. (3) 2+ fresh angles. (4) Wording risks. (5) Open gaps. (6) research_check.py result per gate.

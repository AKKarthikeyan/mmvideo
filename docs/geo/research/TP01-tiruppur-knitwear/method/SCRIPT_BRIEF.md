# Tiruppur: brief for the three channel scripts (30 Oct 2026)

AK asked for the three channel scripts to be rewritten in our storytelling format. One writer per channel. Same research, different engine.

## Read first (only what you need)
- `/Volumes/DarwinSSD/Common/Story Machine/STORY_ENGINE.md`: sections 1–2 (engines, toolbox), your format in 3, 4 (chooser), your channel in 5, 6 (beat grids), 8 (story gate S1–S13).
- The Bhagyaraj and Nolan skills: `/Volumes/DarwinSSD/Common/Story Machine/Skill - Bhagyaraj storytelling/` and `Skill - Nolan storytelling/` (SKILL.md, Review mode). Gate S13 needs one pass of each, written down.
- Research (the ONLY source of facts): `dossier.md` (start here), `claims.jsonl`, `myths.md`, `conflicts.md`, `open_questions.md` in `/Volumes/DarwinSSD/MMVideo/docs/geo/research/TP01-tiruppur-knitwear/`.
- A finished example of the house style: `/Volumes/DarwinSSD/darwin-research/contentengine/youtube/namakkal_egg_city/scripts/README.md`, plus one of its scripts (headings only).
- The old v1 script for this topic (beat ideas and visuals only, not facts): `/Volumes/DarwinSSD/Indica Atlas/Tiruppur Knitwear Town (Oct 2026)/SCRIPT_<channel>.md`.

## Hard rules
1. **Facts come only from claims.jsonl**, with status VERIFIED-P or CORROBORATED for anything said or shown. SECONDARY-ONLY must be hedged and attributed. DISPUTED is told as a dispute. UNVERIFIED and CONTRADICTED are never narrated, except a CONTRADICTED claim told as the myth being corrected. Every beat carries `claims: [...]`, or `no_fact: true` for pure transitions and questions.
2. **Use the corrected facts**:
   - Coimbatore is about 43 km away in a straight line (C200), not 53–60 km.
   - The nearest port city, Kochi, is about 170 km away (C001).
   - US and EU shares are India's HS 61 figures (C310–C312), never Tiruppur's own (C313).
   - The current US tariff is the Section 301 rate of 10% from 24 Jul 2026 (C304). The 50% rate is history only (C301, C302).
   - The UK deal has been in force since 15 Jul 2026 (C307). The EU deal is concluded but not in force (C308).
   - The first factory is three attributed dates (C404).
   - The reopening came "about a year and a half" later (C179).
   - The Basu quote is only the second sentence (C188).
   - The pipeline is 53.5 km from the plant to the reservoir, and the route is "illustrative between named places" (C402, C403).
   - FY26 exports: lead with the official DGCIS figure, ₹38,677 crore (C504). Credit any TEA figure to TEA.
3. **Sensitive (rule 4.4, AK decides)**: caste (Chettiar/Gounder, t45), the founders' religion (t21), and "set afire" (t52). Keep them out of the main path. Where one strengthens the story, add it as a beat marked `"optional": true, "ak_check": "<reason>"`.
4. **Followable pacing** (AK, 24 Oct): a strong hook, then one strand at a time, one idea or number per beat, a recap at each turn, and breathing pauses. Common viewers must be able to follow. Write numbers the way the voice says them, in the Indian system where natural (crore, lakh).
5. **Analysis over hooks** (AK, 5 Oct): never bend a fact for drama. Ooru Ledger and Data Kadai also need a plain verdict at the end: who captures the money, and what protects the town's position (its moat) and its margin.
6. **Long videos carry no on-screen warnings or disclaimers.** Source credits as small captions are fine and expected. Male voice.
7. **Length:** long form, about 9–12 minutes spoken (about 140–150 words a minute). Also give 3 Short cut points (beat ranges) following `SHORTS_ENGINE.md` M1–M5. Full Short scripts aren't needed.

## Channel and format
| Channel | Profile | Default format (change it only if section 4 of the chooser clearly says so, and say why) |
| --- | --- | --- |
| Indica Atlas | STORY_ENGINE §5 + `Common/Story Machine/INDICA_ATLAS_PLAYBOOK.md` | **F10 Paradox**: an inland cotton-market town (C509–C515) with no port (C001) and short of water became the knitwear town. How? |
| Data Kadai | STORY_ENGINE §5 + `WRITER_GUIDE - Data Kadai.md` + `VIDEO_TEMPLATES_AND_YT_RULES - Data Kadai.md` | **F11 Claim Check**: "Tiruppur makes 90% of India's knitwear?" (myths M1), then four FY26 figures, three of them TEA's |
| Ooru Ledger | "How Indian towns make their money": prices, margins, who captures the money, what protects it (`namakkal_egg_city/CHANNEL_NAME.md`) | **F2 Long Road** (try, but, so): from worker to owner, the 1984 strike, the town-level wage bargain, building its own water, the zero-discharge salt bill, and today's tariffs. Ends on the ledger verdict |

## Output (write only your own files)
In `/Volumes/DarwinSSD/MMVideo/docs/geo/research/TP01-tiruppur-knitwear/scripts/`:
- `<channel>_v2.json`: `{"id","ep":"TP01","product","voice","research","status":"DRAFT v2 for AK review, 30 Oct 2026. Not voiced.","format","target_seconds","beats":[{"key","move","say","caption","visual","claims":[...] or "no_fact":true,"pause", optional "optional"/"ak_check"}], "shorts":[{"name","beats":[...],"move_map"}]}`
- `<channel>_v2.md`: the readable script (beat, line, on-screen, claim IDs), then the **Story gate S1–S13** table with PASS/FAIL and a reason each, the Bhagyaraj pass notes, the Nolan pass notes, and an estimated spoken runtime.
- Then run `python3 -I /Volumes/DarwinSSD/MMVideo/docs/inventors_desk/scripts/research_check.py /Volumes/DarwinSSD/MMVideo/docs/geo/research/TP01-tiruppur-knitwear --script scripts/<channel>_v2.json` (run from the research folder). The "Script claim IDs" line must PASS. Research gates G2/G4/G6 may still FAIL for reasons outside your script; ignore those.

Channel file names: `indica_atlas`, `data_kadai`, `ooru_ledger`.

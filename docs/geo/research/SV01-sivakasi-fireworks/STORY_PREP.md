# SV01 Sivakasi: story preparation (1 Nov 2026)

**Input:** AK's research bible, `sivakasi_documentary_master_production_bible.md` (31 Oct 2026).
**Output:** a format choice, a research audit, a beat architecture and a first script: `scripts/general_v1.md` / `.json` (64 beats, about 9:14).
**Status: the script is a DRAFT and is NOT CLEARED FOR VOICING.** The bible is not research under our rules. It is a good map of what to research. Section 2 says why.

---

## 1. What the bible gives us (kept)

- A strong, checkable spine: 1922 trip → 1923 match factory → 1926 split and Bengal lights → 1938 first fireworks factory and printing press → 1940 Rules and WWII → 1942 three licences → 2018 / 2025 court orders → April 2026 blast → GI tag.
- A real fresh angle (G7 candidate): the town has no fireworks tradition; it learned them from a matchbox in 100 years. The competitor table in the bible says no one covers the 1922 transfer, the 1938 press and the licence moat together.
- Visual ideas (rain-shadow map, factory-count bars, the chain of four icons).

## 2. What our rules do to it (audit)

| Issue | Rule | What we did |
|---|---|---|
| Not one source was opened by us. Every figure, date and quote is **BRIEF-ONLY** | Rule 0 | 32 claims in `claims.jsonl`; none narratable; sources.jsonl lists the bible's 10 sources as UNREAD |
| The founding history rests on one Times of India feature and one essay (tier X, or S only if footnoted) | Tier X ban on features retelling history | Must be chased to period records (company histories, gazetteers, Tariff Board, trademark registry) |
| **The bible's thesis has no source:** "the dry sun was the moat" (C031). The hook is built on it | Rule 0 | Hook rebuilt on the myth flip (C006). The dry-sun plant and payoff (b03o, f09o) are optional and are cut together if C031 stays unsourced |
| **The 30-35% green-cracker figure is cited to a coaching site** (Anantam IAS, tier X) | Tier X | Replace with CSIR-NEERI pages and published tests (C023) |
| **Potassium perchlorate "explodes in 38 C heat" (Open Loop 3)** has no source | Rule 0 | Quarantined (C028); loop dropped. Background knowledge makes me expect it to fail, but that is not evidence: it only says to check it first |
| **DRO licence cap of 12 workers, 50+ workers, 500 rupees a day** has no source | Rule 0 | Quarantined (C027); i03o is optional and i04 is soft until sourced |
| The seasonal printing calendar (Jul-Oct / Nov-Jan / Feb-Jun) has no source | Rule 0 | Not in the script as month ranges (C021) |
| "Cousins" and "friends" are both used for the founders; ages are computed from birth years | Conflicts, rule 6 | Script says "two young men" and "about seventeen / nineteen" (C007) |
| "About 2,000 km" to Kolkata and "1,200 km" to Mumbai are the bible's own numbers | Rule 2.2: measure, never copy | Dropped. To compute. Kolkata and Mumbai are in Natural Earth; **Sivakasi is not**, so it needs a point from Census of India or Bhuvan first (C032) |
| TIDCO in 1961 (Pandiyan Chemicals) | Lead to check, not a fact | Not used (C018); one thing to check is whether TIDCO existed in 1961 |
| The toll changed (23 → 25); "mostly women" appears only in the bible's script | Conflicts | Script says "twenty-five workers" and attributes to reports; sex split dropped (C026) |
| Industry figures (80-90%, 6,000 crore, 1,000+ units, 3 lakh) come from an interested party | Rule 6 | Script says "by the industry's own count" |
| The bible's "myth" that most Indians assume an ancient craft is not shown to be widely held | Story Engine F1 needs a widely held myth (T1) | Open: collect real statements of the myth (open question 1) |

The bible's own script (about 1,750 words) also carries analogies ("cloud kitchen", "12-seater van", "ice-cream shop") that are not facts. I kept two in new words (home kitchens, paper cups), flagged `analogy`, and dropped the van.

## 3. Format choice (Story Engine sections 3-5)

- **Main format: F1 The Myth Flip.** Signal: M1 (an ancient-craft belief) is contradicted by an absence claim (C006). Long form: cold open on the myth → chapters → the real story in one line → how the telling drifted → what it changes.
- **Why not F10 Paradox (the bible's hook)?** The rotation rule: Indica Atlas's last long video (Tiruppur) used F10. Its hidden factor (the dry sun) is also the unsourced claim.
- **Layer:** F5 own words is held back: the only quotes are press quotes from today (C024, C025, C026, C030). A single F13 scale shock is used at the peak (₹6,000 crore, 60 billion rupees).
- **Channel: Indica Atlas** (geography / history of a place, 70% India and 30% global). The bible's own audience (Indian and global, 18-35) fits. Data Kadai and Ooru Ledger versions are not written; see section 8.
- **Audience rules (STORY_ENGINE section 5):** prime with the globe first (b01), explain Deepavali, crore and lakh once, say the names slowly, no exoticising, no side-taking, no gore.

## 4. Beat architecture (scale ladder)

| Part | Beats | Time | Engine / feeling |
|---|---|---|---|
| Cold open: myth stated, flipped, question | a01-a05 | 0:00 | surprise → curiosity |
| Planet → region: where it sits, name the parts | b01-b04 | 0:43 | clarity |
| Ch.1 The trip (one strand: the founders) | c01-c07 | 1:18 | wonder; loop 1 opens |
| Ch.2 Hands, not machines (plant: the hands) | d01-d08 | 2:09 | surprise → warmth; loop 1 closes at d08 |
| Ch.3 The press | e01-e07 | 3:41 | wonder |
| Ch.4 The war and the licence → **PEAK f08b at 5:40, 61%** → **click g01** | f01-g01 | 4:56 | surprise |
| Ch.5 The court (one strand: the law) | h01-h07 | 6:12 | suspense; real deadline: Oct 2025 "too close to the festival" |
| Ch.6 The shed (one strand: the people) | i01-i07 | 7:29 | weight; plant d04 pays off at i07 |
| Planet again: GI tag, recap, callback, last line | j01-j04 | 8:30 | resolve |

- **Question (S3):** a04 at 0:28. **Peak (S6):** f08b, 61%. **Click (T2):** g01. **Last line (S7):** "And its next lesson is how to keep the people who light it safe."
- **Retell (S11):** A town with no fireworks tradition copied a matchbox, coloured the flame, printed its own labels, and a war closed the door behind it. Today it is fighting for clean-air rules. Its founding hand-labour model is now its safety problem.
- **Followable pacing:** one strand per chapter, no cross-cutting; one number per beat (growth numbers get one beat each); recaps at c07, d08, e07, h07, j02.
- **Plants and payoffs:** hands (d04 → i07); dry sun (b03o → f09o, optional); squirrel vs crow (d05, a light moment); the matchbox (a04 → j04 loop).

## 5. S13 review: Bhagyaraj and Nolan (written down)

**Bhagyaraj (heart).**

| Tool | Score | Evidence | Fix |
|---|---|---|---|
| 4 Ordinary heroes | 1 | The two young men are only names (c03) | Needs a real person's detail from the founders' own words or biographies; none invented |
| 5 The other person drives the plot | 0 | No woman appears in the history part | The women of the village network (d03) and the workers (i01) are the right voices; look for a worker's testimony in the record |
| 8 Deadline | 2 | Real deadline: the Oct 2025 order "too close to the festival" (h06) | Keep |
| 10 Plants and payoffs | 2 | Hands d04 → i07 | Keep |
| 11 Humour that works | 1 | "A squirrel against a crow" (d05) | Fine; keep it light |
| 15 Joy inside sadness | 1 | The blast chapter is sober | Keep sober; end on learning (j03b) |

**Nolan (structure).**

| Tool | Score | Evidence | Fix |
|---|---|---|---|
| 1 Structure is the story | 2 | The chain of four icons: each link lights the next, as the town did | Keep |
| 3 Lock the point of view | 1 | Ch.1 is close on the founders, later chapters objective | Fine for a general audience |
| 6 Exposition as game | 1 | Name the parts first (b04) | Keep |
| 9-10 Pledge, turn, prestige | 2 | Pledge: the matchbox. Turn: it becomes a firework town. Prestige: the hands that built it are the risk. Fair play: d04 plants it | Keep |
| 11 The loop | 2 | j04 returns to the matchbox of a04 | Keep |
| 13 Dilemma without a verdict | 1 | i07 states the dilemma, h06 gives the industry's side | Do not tell viewers what to conclude |
| Followability guard | 2 | No cross-cut strands; one number per beat | Keep |

## 6. Story gates (STORY_ENGINE section 8)

| Gate | Result |
|---|---|
| S1 Facts | **FAIL.** Every claim is BRIEF-ONLY or QUARANTINED. `research_check.py --script` says NOT CLEARED: G2, G3, G4, G5, G6, G7 and the script-claims check all fail (its G1 'pass' is empty, since nothing is narratable) |
| S2 Format | PASS (F1; signal M1/C006; rotation vs Tiruppur F10) |
| S3 Question by 30 s | PASS (a04 at 0:28) |
| S4 Prime | PASS (a01-a02 and b01) |
| S5 Resolve | PASS (loop 1 at d08; hands at i07; matchbox at j04) |
| S6 Peak | PASS (f08b, 61%) |
| S7 End | PASS |
| S8 Screen text | PASS (keywords and numbers only) |
| S9 Numbers | PASS on one number per beat; perspectives: 60 billion rupees; 3 lakh = 300,000. Not yet done: a "feel" comparison for 25 workers |
| S10 Hedges | Built in: "by the industry's own count", "is said to", "local histories treat", "reports say". Must be re-checked against each source once opened |
| S11 Retell | PASS (3 sentences above) |
| S12 Audience | PASS (no exoticising; no guilt lever E17: the blast is stated, not dramatised) |
| S13 Review | Done above |

## 7. Research brief for the next step (primary sources first, per RESEARCH_RULES)

Where to look (leads only; none is evidence yet):
1. **Founding history (C006-C009, C011-C016):** the Nadars' own biographies and company histories; the Tariff Board report on the match industry (1920s); period gazetteers and census reports for Ramnad / Tinnevelly districts (Sivakasi's trades before 1923); trademark registry records for Anil and Kaaka; Tamil sources and Tamil press.
2. **Rain shadow and climate (C001, C031):** IMD district rainfall; Census district handbook; the Western Ghats ridge from geodata. For C031: any statement that dry weather suited the trade.
3. **Law (C017, C022, C025):** the full text of the Explosives Rules, 1940 (and any earlier Act it rests on); the Supreme Court's 2018 and Oct 2025 orders; PESO licence records.
4. **Green crackers (C023):** CSIR-NEERI's own pages and published test results.
5. **Numbers (C002-C005, C020):** PESO licence counts; TANFAMA's GI application (GI Registry journal); the definition of "factory" at each date.
6. **April 2026 blast (C026):** Tamil Nadu Government statement; the court or inquiry record; Tamil press from the time.
7. **Measurements (C032):** a Sivakasi point from Census of India or Bhuvan, then compute Sivakasi to Kolkata and to Mumbai (and Madurai) with `TP01-tiruppur-knitwear/method/distances.py` pattern.
8. **How the myth grew:** the earliest dated telling of "ancient craft"; the temple-town name might be a source of the confusion (a lead only).
9. **Sensitive (rule 4.4):** the founders' community is not mentioned in the script; a death-toll chapter is handled sober. AK to confirm there is nothing communal to flag.

## 8. Other channels (not written)

- **Data Kadai:** F8 Then and Now (3 → 189 → 450 → 1,000+ factories). Gate: the definition of "factory" must be the same at each date (RESEARCH_RULES 2.5).
- **Ooru Ledger:** the bible has no unit economics (prices, margins, who captures the money), so it cannot carry an Ooru Ledger story yet. It needs a money chain (F7 Follow the Thing) from a cracker's factory price to the shop price.

## 9. Files in this folder

`STORY_PREP.md` (this), `claims.jsonl`, `sources.jsonl`, `myths.md`, `search_log.md`, `scripts/general_v1.md|json` (long), `scripts/shorts_v1.md|json` (3 Shorts). The generator is in the session scratchpad only.

## 10. Update, 1 Nov 2026: no channels, general videos

AK: there is no Ooru Ledger channel, so the videos are **general** (no channel, no channel profile). Done:
- The long script is renamed `scripts/general_v1.*` and kept channel-neutral: it still primes with the globe and explains Deepavali, crore and lakh once, because the audience is Indian and global viewers aged 18-35 (the bible's own audience). Sections 3 and 8 above that mention Indica Atlas, Data Kadai and Ooru Ledger are history: ignore the channel rows. The Myth Flip choice stands, now justified by the signal (M1/C006) alone, not by channel rotation.
- Three full Shorts in `scripts/shorts_v1.md|json`: SH1 Myth Flip (about 55 s), SH2 the printing press (about 36 s), SH3 green crackers (about 34 s). No Short on the April 2026 blast.
- All still **NOT CLEARED**: the gates in section 6 and the research brief in section 7 are unchanged. The money-chain research for a town-economics video is optional now and only matters if AK wants that angle.

## 11. Format chooser, run in full (1 Nov 2026, after AK asked "which format fits")

STORY_ENGINE section 4: read the research signal for each of the 13 formats. With no channels, the rotation rule (per channel) no longer applies, so the choice rests on the signals alone.

| Format | Research signal present? | Fit now | Blocker |
|---|---|---|---|
| F1 Myth Flip | A contradicted belief: "ancient fireworks craft" vs no units before 1923 (C006) | **Main** | Must show the myth is widely held (collect real statements); contradiction needs a period record, not a feature (S03 is tier X) |
| F2 Long Road | A chain of dated steps, each causing the next: machines too costly → hand network → colour → press → war/licence | **Body of the story** (chapters 1-4 are try-but-so) | Only one real "fell short" step (the machines, C011), unsourced |
| F10 Paradox | Dry, poor-farming town vs 80-90% of India's fireworks | Fallback hook | Hidden factor (dry sun, C031) has no source |
| F13 Scale Shock | ₹6,000 crore; 1,000+ units | **Layer** (peak, f08b) | Industry figure; same-year basis |
| F8 Then and Now | 3 → 189 → 450 → 1,000+ factories | Visual inside the peak | "Factory" definition unchecked across dates (RESEARCH_RULES 2.5) |
| F4 Cold Case | "Why a press?" puzzle with one clue | SH2 only | The settling document (the 1938 press record) is unread |
| F11 Claim Check | "80-90% from one town" is a claim | Weak | No fresh news claim; GI application only |
| F7 Follow the Thing | Chain of hands | No | No money/price data in the bible |
| F3 Happy Accident, F5 Own Words, F6 Zoom, F9 Face-off, F12 Quiet Turn | No signal | No | No accident, no 3+ primary quotes, no nested mechanism, no rival, no wonder-only topic |

**Decision:** main format **F1 Myth Flip**, told with F2's try-but-so causality inside the chapters, plus one F13 layer at the peak. SH1 = F1, SH2 = F4 (one clue), SH3 = F1 (one fact: "green" is not "clean").
**Fallback if M1 is not shown to be widely held:** the same beats become **F2 Long Road** with a plain-fact hook ("this town made no fireworks 100 years ago"). Nothing in the chapters changes.

## 12. Update, 1 Nov 2026: claims verified by AK; Paradox and Long Road chosen

AK: "Claims are verified. Go for Paradox, Long Road." Done:
- `claims.jsonl`: every claim except C018 (unused), C028 (left out) and C032 (distance, still to measure) is now **AK-VERIFIED**, with the note that we did not reopen the cited sources. New claim C033 (farm-poor villages supplied the labour). Hedges stay in the voice ("by the industry's own count", "is said to", "local histories treat", "reports say").
- Two long scripts in `scripts/`: `paradox_v1.md|json` (F10, about 8:52, click at 5:35 = 63%) and `long_road_v1.md|json` (F2, about 8:34, peak = the green fix and its deadline at 6:20 = 74%). Each carries its own Short cut points. The earlier Myth Flip long script and three Shorts moved to `scripts/_superseded/`.
- Both run a little under the 9-12 minute target. The facts in the ledger are used up; length would need a new verified chapter (for example the money chain, or the founders in their own words).

**Left out on purpose: C028 (potassium perchlorate "explodes at 38 C").** The bible gives no source for it, and as stated it conflicts with what I know of fireworks chemistry (perchlorate is a common, comparatively stable oxidiser; chlorate is the notorious one). That is only a reason to look first, not evidence. If AK has a source, send it and it can become a beat.

Checks (claim IDs exist and are AK-VERIFIED; one claim list per beat): both scripts pass. `research_check.py` is not re-run, because it does not know the status AK-VERIFIED (G2, G6 and G7 rest on AK's word).

| Gate | Paradox | Long Road |
|---|---|---|
| S2 Format | F10; signal: dry and no past vs 80-90% (C001, C006, C002) | F2; signal: each step solves the last problem (C011 → C033 → C013 → C016 → C017 → C022 → C023) |
| S3 Question by 30 s | pa04 | ra03 |
| S4 Prime | pa01-pa03, pb01 | ra01-ra02, rb01 |
| S5 Resolve | Loop of "how?" closes at pk01; hands pays at pi05 | 2018 quiet returns at rf10 and rj02; hands pays at rh05 |
| S6 Peak | pk01 click, 63% | rg05 fix and deadline, 74% (late: the fix is the format's peak) |
| S7 End | "...how to keep those hands safe." | "...to keep the people who light the sky safe." |
| S9 Numbers | One number per beat; growth numbers get a beat each | Same |
| S12 | No exoticising, no gore, blast stated not dramatised | Same |
| S13 Review | Bhagyaraj: plants (hands, dry) and a real deadline (Oct 2025) work; the founders are still only names. Nolan: the clash is the structure; the two "links back to Fact A" (pd03, pe04) are the fair-play payoffs | Bhagyaraj: same people gap. Nolan: a hairpin from the 2018 cold open, a single strand per chapter; "try, but, so" is explicit in the lines |

## 13. Production, 1 Nov 2026: voiced and animated (AK: "Voice as is", then "music, rich animation, less text, 60 frames, physics")

**Voice.** MiniMax `English_Diligent_Man` (male, speed 1.0) via the DataKadai `long_voice.py` pipeline; one line per beat in `voice/<film>/vo/`. Measured: Paradox 452 s of speech, Long Road 444 s. One line re-voiced after a script fix: the Paradox promise `pa05` now says "A matchbox. A pair of hands. The sun. And, last, a printing press and a war." (the old line left out the sun, which the film then treats as piece three). `voice/*_listen.mp3` are the joined lines for listening (pauses included; no music).

**Video.** Own Remotion entry `MMVideo/src/sivakasi/` (nothing shared is touched): 1920x1080, **60 fps**, code-drawn art, 31 scenes in `scenes1-4.tsx`, motion kit in `kit.tsx`.
- Physics used: mass-spring-damper springs for arrivals; closed-form ballistic motion with gravity and drag for sparks, rain, coins and torn calendar pages; falling bodies with bounce (restitution); constant-deceleration braking for trains and ships; meshed gears (tooth-count ratios); a sun arc with shadow length from elevation; toppling dominoes with constant angular acceleration; slow-in/slow-out easing for cameras. Acts fade in over the still-playing previous act (no dip to black); the camera arrives with a settling push and drifts on the art layer only.
- Text: about a quarter of the beats carry one keyword or number (steady, whole pixels, no shake). Paradox 17, Long Road 16. No channel mark. A small "ILLUSTRATION" tag sits at the bottom on recreated historical scenes.
- Maps: Natural Earth with the India point of view (official outline). **Sivakasi's pin is approximate** (not in Natural Earth; open claim C032).
- Audio: `scripts/sivakasi/sv_audio.py`: narration at its timeline positions, a CC0 music bed ducked under speech (Paradox: curious ambience; Long Road: strings with percussion), and CC0 sound effects (stamp/gavel thump, whoosh, pops, coin dings). Final mixes in `public/sivakasi/<film>/final.wav`.
- Build chain: `build_film.py` (acts + timeline from the measured voice) → `sv_audio.py` → `render_all.sh`. Outputs: `out/sivakasi/sivakasi-paradox-60fps.mp4`, `sivakasi-longroad-60fps.mp4`.
- Not yet done: nobody has watched and listened to a full render; music is one bed per film; richness is a first pass (maps, gears, fireworks and crowds are detailed; the three-icon chain scenes and dominoes are plain).

## 14. Regional audio: Hindi, Tamil, Telugu (1 Nov 2026; AK: "Add Regional language Tamil, Hindi, Telugu")

**What exists (DRAFT, reviewed_by null, nobody has listened yet):**
- `out/sivakasi/audio/sivakasi-<film>-<hi|ta|te>-DRAFT.m4a`: six tracks, each the full film length (Paradox 493.8 s, Long Road 483.8 s, equal to the video), voice on the English timeline, plus the same CC0 music bed (ducked) and sound effects as the English cut.
- `out/sivakasi/sivakasi-<film>-60fps-multiaudio.mp4`: the picture copied, with four audio tracks tagged eng, hin, tam, tel (English first and default). For YouTube, upload the m4a files as separate language tracks.
- Translations: `voice/<film>/translations/<lang>.json` (spoken style, numbers in words, names in the target script, hedges kept; `reviewer_notes` list what to check first: quotes, the 19 April 2026 explosion lines, hedges, numbers, terms, names).
- Voices (AK, 29 Oct): Hindi Gemini "Charon" (on `gemini-2.5-flash-preview-tts`; the 3.8 model hit its quota); Tamil and Telugu Maya "Siddhant" (local).

**How it was fitted:** each regional line must end before the next line starts (the picture and its text are fixed to the English beats), and may be sped up at most 1.20x (Hindi) or 1.10x (Tamil, Telugu). The English narration runs at about 160 words a minute, so about half of the first-draft Tamil and Telugu lines were too long. Four shortening rounds followed: same facts, numbers and hedges, tighter wording (`scripts/sivakasi/overrides*.json`, applied in order by `translations.py`). Final result: 0 lines over the cap in all three languages; 11–16 lines per track are sped between 1.06x and the cap (flagged FAST in each `_report.json`).

**Changes a reviewer should know about:**
- "That is three hundred thousand" (after "three lakh") is dropped in all three: lakh is native.
- Hindi "By two thousand and one: four hundred and fifty" says "factories" (साल दो हज़ार एक तक: चार सौ पचास फ़ैक्ट्रियाँ); Gemini refused the bare line. The English leaves the unit implied by the line before.
- Some Tamil/Telugu lines drop initials and small connectives (for example "P." and "A." before the founders' names, "that is" before sixty billion). Facts are unchanged.
- Hindi/Telugu keep "matthaappu" as the Tamil word, as in the English.

**Not done:** native-speaker review (every file); listening for pronunciation of the names and numbers (Sivakasi, Nadar, Kaliswari, years); the Tamil/Telugu voice (Maya) was not compared with the English male voice for tone. Sensitive lines to hear first: the 19 April 2026 explosion (pi03 / rh03), the biometric quote, the makers' leader's quote, the Nehru and Murugan quotes.

## 15. Tamil rewritten natively (1 Nov 2026; AK: rewrite for the same length and meaning, not a literal translation)

- `scripts/sivakasi/native_ta.py` / `native_ta.json`: 85 Tamil lines written from the English beat's meaning and its time slot (a letter budget per line from the measured slot and Tamil speech rate of about 0.076 s per letter), in spoken Tamil; `translations.py` uses a `native_<lang>.json` when it exists. Same facts, numbers, names and hedges; native touches: "கல்கத்தா, இப்ப கொல்கத்தா", சரவெடி for joined crackers, காளான் (mushroom) in the Murugan quote, "சாபம் / வரம்" (curse / boon) for the sun, shorter spoken years.
- Result: 0 lines over the speed cap, and only 3 (Paradox) and 2 (Long Road) lines sped past 1.06x, against 12 and 14 with the literal translation after four shortening rounds. Tracks, music mix, multi-audio MP4s and `review/review_ta_Tamil.csv` are rebuilt from it.
- Hindi and Telugu are still the literal drafts; their review sheets should not go to reviewers until they are rewritten the same way. The Tamil native text still needs a native reviewer.

# Story Engine: the evidence behind it (27 Oct 2026)

Every technique in STORY_ENGINE.md points to a finding here. Each finding was read at its original source during this research run, following the same rules as our fact research: the paper's own abstract or text, never a blog's summary.

**Strength labels:**
- **Strong:** several studies, a large effect, or a review.
- **Moderate:** one well-designed study or one lab's line of work.
- **Mixed:** published studies disagree.
- **Failed:** a replication did not find the effect.
- **Platform:** YouTube's own documentation.

**Caution:** almost all of these were measured in labs (students reading, watching clips or doing trivia), not on YouTube. They tell us *why* a technique should work. Our own analytics decide whether it does (STORY_ENGINE section 7).

Saved records: `research/pubmed_abstracts.json`, `research/crossref_records.json`, and the PDFs `research/loewenstein_1994.pdf`, `research/mayer_moreno_2003.pdf` and `research/small_2007.pdf`.

| ID | Finding | Exact words (source) | Source | Strength |
|---|---|---|---|---|
| **E1** | Curiosity is the itch of a *noticed* gap. It needs a little prior knowledge, and it is stronger when one insight can close the whole gap | "The new account interprets curiosity as a form of cognitively induced deprivation that arises from the perception of a gap in knowledge or understanding" (p.75). "curiosity is unlikely to arise in the absence of an existing knowledge base" (p.89). "curiosity should be greater for insight than for incremental problems" (p.88) | Loewenstein, G. (1994). *Psychological Bulletin* 116(1):75–98 | Strong (classic review; 2,600+ citations) |
| **E2** | Curiosity works like an anticipated reward, and helps memory for *surprising* answers | "Higher curiosity in an initial session was correlated with better recall of surprising answers 1 to 2 weeks later" | Kang, Hsu, Krajbich et al. (2009). *Psychological Science*. PMID 19619181 | Moderate |
| **E3** | While curious, people also remember the *other* things shown at the same time | "improved memory for information that they were curious about and for incidental material learned during states of high curiosity" | Gruber, Gelman, Ranganath (2014). *Neuron*. PMID 25284006 | Moderate |
| **E4** | Asking people to *predict* first makes them more curious | "generating a prediction stimulates curiosity by increasing the relevance of the knowledge gap" | Brod & Breitwieser (2019). *npj Science of Learning*. PMID 31646002 | Moderate |
| **E5** | Learning is driven by the gap between what was expected and what arrived; good news lifts curiosity | "it is not the absolute value of information that drives learning but, rather, the gap between the reward expected and reward received, an 'information prediction error.'" Also: "positive information enhancing both curiosity and long-term memory" | Marvin & Shohamy (2016). *J Exp Psych: General*. PMID 26783880 | Moderate |
| **E6** | Stories entertain through three structures: **suspense**, **curiosity** and **surprise**. Resolved ones are liked best | Curiosity: "the reader is given enough information to know that the event is missing." Surprise: "omitted from the discourse, without letting the reader know that it has been omitted." Suspense: "discourse material is placed between the initiating event and the outcome event, to encourage the build up of the suspense." "Narratives with appropriate affect curves were liked better than those with none" | Brewer & Lichtenstein (1982). *Stories are to entertain*, CSR Technical Report 265 (also *J. Pragmatics* 6:473) | Strong (founding theory; tested in their experiments; widely cited) |
| **E7** | Being absorbed in a story ("transportation") shifts beliefs, and absorbed people notice fewer false notes. It works the same whether the story is labelled fact or fiction | "transportation entails imagery, affect, and attentional focus"; "highly transported readers found fewer false notes in a story"; "generally unaffected by labeling a story as fact or as fiction" | Green & Brock (2000). *JPSP* 79(5). PMID 11079236 | Strong (4 experiments; large later literature) |
| **E8** | Engagement rises and falls *together* across viewers, driven by emotional content, and engaged moments are remembered | "Self-reported engagement was synchronized across individuals and driven by the emotional content of the narratives"; the engagement networks "predicted recall of narrative events" | Song, Finn, Rosenberg (2021). *PNAS*. PMID 34385312 | Moderate |
| **E9** | Understanding is best when listeners can *anticipate* the teller | "the greater the anticipatory speaker-listener coupling, the greater the understanding" | Stephens, Silbert, Hasson (2010). *PNAS*. PMID 20660768 | Moderate |
| **E10** | The mind cuts experience into events; a boundary is felt where a prediction fails, and boundaries organise memory, in nested levels | "When transient errors in predictions arise, an event boundary is perceived" (Zacks 2007). "Events are segmented simultaneously at multiple timescales, and are grouped hierarchically" (Kurby & Zacks 2008) | Zacks, Speer, Swallow et al. (2007). *Psych Bulletin*. PMID 17338600; Kurby & Zacks (2008). *Trends Cog Sci*. PMID 18178125 | Strong |
| **E11** | An experience is remembered mostly by its **peak** and its **end**, not its length | Memories "largely reflect the intensity of pain at the worst part and at the final part of the experience" (1996); evaluations made "as if duration did not matter" (1993) | Redelmeier & Kahneman (1996). *Pain*. PMID 8857625; Fredrickson & Kahneman (1993). *JPSP*. PMID 8355141 | Strong for affect. Applying it to video endings is our extrapolation |
| **E12** | Nine ways to stop overload in narrated visuals, with effect sizes (median from n experiments) | Table 3, p.46: narration not on-screen text **1.17** (6); segmenting **1.36** (1); pretraining names and parts **1.00** (3); weeding extraneous material **0.90** (5); signalling **0.74** (1); words near the graphics **0.48** (1); no identical narration and on-screen text **0.69** (3); narration in sync with animation **1.30** (8). Also: "adding background music to a narrated animation may increase the amount of incidental processing" (p.45) | Mayer & Moreno (2003). *Educational Psychologist* 38(1):43–52 | Strong (a 12-year research programme) |
| **E13** | "Perspective" sentences (ratios, ranks, unit changes) help people understand and remember numbers | "perspective clauses substantially improve people's ability to recall measurements they have read" (3 experiments, over 3,200 participants) | Barrio, Goldstein, Hofman (2016). *CHI '16*. doi 10.1145/2858036.2858510 | Moderate |
| **E14** | Even in science papers, more narrative writing gets more attention | "articles with more narrative abstracts are cited more often" (732 abstracts) | Hillier, Kelly, Klinger (2016). *PLoS ONE*. PMID 27978538 | Moderate (correlational) |
| **E15** | Narrative helps non-experts understand science, but its persuasive power carries an ethical duty | "Narratives offer increased comprehension, interest, and engagement"; use "raises ethical considerations" | Dahlstrom (2014). *PNAS*. PMID 25225368 | Review |
| **E16** | Curiosity motivates learning and matters in development | curiosity is "a motivator for learning, influential in decision-making, and crucial for healthy development" | Kidd & Hayden (2015). *Neuron*. PMID 26539887 | Review |
| **E17** | **One named person beats statistics ("identifiable victim")** | FLoRA replication atlas, from the replication's abstract: "We found no empirical support for the identifiable victim effect" | Small, Loewenstein, Slovic (2007). *OBHDP*; replication: Maier, Wong, Feldman (2024). *Collabra* doi 10.1525/collabra.90203 | **Failed.** Don't rely on "one face" to make people care; use one character for *clarity* (E6, E7), not as a guilt lever |
| **E18** | **Spoilers make stories more enjoyable** | The original (2011) reported spoiled stories enjoyed more; a later study (Levine, Betzner & Autry, 2016) found spoilers given before the story *reduced* enjoyment | Leavitt & Christenfeld (2011). *Psychological Science*; Levine et al. (2016). *Discourse Processes*. Seen in search summaries only; papers not opened | **Mixed.** Don't rely on it either way |
| **E19** | YouTube's own retention signals: "Intro" (share still watching after 30 s), top moments, spikes (rewatched or shared, or unclear) and dips (abandoned or skipped) | "Intro tells you what percentage of your audience still watched your video after the first 30 seconds"; "Dips mean that viewers are abandoning or skipping at that specific part of your video" | YouTube Help, answer 9314415 (read 27 Oct 2026) | Platform |

**Not used, and why:**
- Third-party Shorts benchmarks (for example "aim for 75–80% viewed"): they come from blogs (Tier X). AK can read the official "stayed to watch / swiped away" definition in Studio.
- The van Laer (2014) and Braddock & Dillard (2016) meta-analyses on narrative persuasion: their abstracts weren't available, so they weren't read and aren't cited.
- Harp & Mayer (1998) on seductive details: not opened. The coherence effect in E12 covers the same ground.

## Added 27 Oct 2026 for the Shorts Engine

| ID | Finding | Exact words (source) | Source | Strength |
|---|---|---|---|---|
| **E20** | A complete suspense story can be five sentences: initiating event, delay, outcome | Their minimal suspense example: "The sniper was waiting outside the house. Charles got up from the chair. He walked slowly toward the window. There was the sound of a shot and the window broke. Charles fell dead." | Brewer & Lichtenstein (1982), TR 265, pp. 15–16 | Strong (same source as E6) |
| **E21** | Viewers actively work out *why* each thing is mentioned and fill the causal gaps themselves | Readers try to build a meaning representation "that explains why actions, events, and states are mentioned in the text" | Graesser, Singer, Trabasso (1994). *Psychological Review*. PMID 7938337 | Strong (major theory and review) |
| **E22** | A sudden scene or time jump costs processing; a one-line foreshadow removes the cost | "readers do not expect event shifts, but foreshadowing eliminates this"; "reading times increased when an event shift was not foreshadowed" | Pettijohn & Radvansky (2016). *Memory & Cognition*. PMID 27170375 | Moderate |
| **E23** | Slower speech is understood and remembered better (tested with degraded speech) | "slow sentences had a greater accuracy of sentence comprehension and faster RTs compared to fast sentences" | Patel, Sevich, Feng et al. (2026). *JSLHR*. PMID 42600158 | Moderate; specific population (cochlear implant users and simulated CI hearing) |
| **E24** | Shorts can run to 3 minutes (square or vertical), but any Short over one minute with an active copyright claim is blocked worldwide; YouTube Audio Library music gets no Content ID claims | "Any Short that is over one minute in duration with an active copyright claim of any type" is blocked; "You can use most songs for up to 90 seconds in a 3 minute Short" | YouTube Help, answer 15424877 (read 27 Oct 2026) | Platform |
| **E25** | A view counts from the first frame; an *engaged* view needs the viewer to keep watching. Analytics stay anchored on engaged views | "A view is now defined as counting from the very first frame"; "If you let it keep playing for some amount of seconds after that first frame, it's an engaged view"; "the vast majority of analytics remain anchored on engaged views" | YouTube Official Blog, 19 Aug 2026, "What are 'Engaged' Views on YouTube?" | Platform |

Not read: Trabasso & van den Broek (1985) and Trabasso & Sperry (1985) on causal-chain events (publisher blocked). The causal-chain rule in SHORTS_ENGINE C2 rests on E21 instead.

## Added 27 Oct 2026 for the Indica Atlas playbook (maps and places)

| ID | Finding | Exact words (source) | Source | Strength |
|---|---|---|---|---|
| **E26** | People's world maps are built from "subregions" with systematic biases, and a few accurate "seed" locations shift their estimates for whole regions | The pre- and post-seeding estimates revealed "the subjective positioning and subregionalization of regions within continents"; "differential seeding effects revealed between-region dependencies" | Friedman & Brown (2000). *J Exp Psych: General*. PMID 10868334 | Moderate–Strong (4 experiments) |
| **E27** | When people learn one new location, they update related regions too, balancing coherence against inertia | People "strike a balance between 2 principles: the need to keep their knowledge base coherent, and the inertial tendency to resist cha[nge]" | Friedman & Brown (2000). *JEP: Learning, Memory, Cognition*. PMID 10946370 | Moderate |
| **E28** | Memory straightens maps: nearly symmetric rivers and lines are remembered as more symmetric and more aligned with the main axes | "increased (horizontal or vertical) symmetry in perception and memory of nearly symmetric curves in graphs and rivers in maps" | Tversky & Schiano (1989). *J Exp Psych: General*. PMID 2531198 | Moderate |
| **E29** | **The "Mercator effect" is not in remembered areas, but it is in directions** | "Recent studies, however, have found no evidence for a Mercator effect on recalled areas for world regions"; the direction estimates provide "clear evidence of a Mercator effect" | Montello & Battersby (2022). *Annals of the AAG* 112(2):468–486, doi 10.1080/24694452.2021.1931001 (abstract via RePEc) | Moderate (replication plus new task) |
| **E30** | Linking material to oneself improves memory | "self-referent encoding strategies yielding superior memory relative to both semantic and other-referent encoding strategies" | Symons & Johnson (1997). *Psychological Bulletin*. PMID 9136641 | Strong (meta-analysis) |
| **E31** | Being quizzed improves long-term memory more than restudying | "on the delayed tests, prior testing produced substantially greater retention than studying"; "Testing is a powerful means of improving learning, not just assessing it" | Roediger & Karpicke (2006). *Psychological Science*. PMID 16507066 | Strong (widely replicated testing effect) |
| **E32** | Awe comes from vastness plus a need to rethink | Two central appraisals: "perceived vastness, and a need for accommodation, defined as an inability to assimilate an experience into current mental structures" | Keltner & Haidt (2003). *Cognition & Emotion*. PMID 29715721 | Theory (widely used prototype) |

**Our own data (not research papers, but real):**
- **D1:** Indica Atlas's first 8 Shorts, views read 25 Oct 2026. The best were "questions about India itself".
- **D2:** YouTube's public view counts for the top videos of 21 geography channels, read 25 Oct 2026.

Both are in `docs/geo/research/CONTENT_REFRESH_2026-10-25.md`.

**Leads not read:**
- Fish, Goldsberry & Battersby (2011), change blindness in animated maps (publisher and thesis blocked; only secondary summaries seen).
- Battersby & Montello (2009), seen only as an index snippet.
- Stevens & Coupe (1978), no abstract available.

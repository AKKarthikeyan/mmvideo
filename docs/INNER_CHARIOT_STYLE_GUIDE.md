# The Inner Chariot: storytelling and visual style guide

How to make the channel's videos gripping, not sermon-like, for every age. This guide covers the **story** and the **motion**. The art direction itself (Lamplight: backlit silhouettes, gold rim light, the diya) was settled in `STYLE_RESEARCH_GITHUB.md` and `style-research/DIRECTIONS.md`, and its kit is `src/katha/README.md`. This guide does not reopen it.

Prepared 24 Oct 2026 from:
- an audit of the finished Gita film (24 frames, one every 48 s, plus its beat timings from `public/katha/gita/data.json`);
- two research passes, one on storytelling and one on visual rhythm and motion;
- the content plan, `INNER_CHARIOT_CONTENT_PLAN.md`.

Tags: **[D]** is documented in a source listed at the end. **[J]** is craft judgement, a number to test and tune. No measured shot-length data exists for Kurzgesagt, Vox, TED-Ed or similar channels, so every shot-length number here is [J]. A cheap way to replace the guesses: run scene detection on three reference videos.

---

## 1. What the Gita film teaches us

The film proves the look: indigo and gold, the lamp, the verse cards and the light of chapter 11 are distinctive and premium. It also shows where a viewer could drift:

| What the audit found | Why it risks boredom | The rule that fixes it |
| --- | --- | --- |
| Nearly every frame is the same purple dusk with a gold sun; only chapter 11 breaks it | One emotional temperature for 19 minutes | A colour script by act (section 5) |
| Almost all wide or extreme-wide shots; the chariot tiny on the horizon; no close-ups | No intimacy, so the emotion rests on the voice alone | Never two shots of the same scale in a row (section 4) |
| The hall of Sanjaya and the king reused unchanged (13 beats; 4 of the 24 sampled frames) | The eye learns it can look away | A new angle or a new light each time the frame returns |
| 34 of 120 beats are text cards on a flat dark ground | Static screens | Verse cards stay still (that stillness is earned), but chapter cards get motion and a scene behind them |
| Beats run 9.8 s on average, and from the stills, one composition per beat | Slower visual change than an explainer needs | The three clocks (section 4) |
| The source plate and the OUR NOTE and speaker tags are 16 to 17 px, the plate at 70% opacity (`src/katha/Film.tsx`); the spoken caption is 44 px | The named translator is our main difference from competitors, and it is unreadable on a phone or a TV | Plate at least 26 px at 90% opacity; tags at least 22 px [J] |

The film can ship as it is, after the end-card rebrand. Apply these rules from the next video on, and to a "v2" of the film only if its retention shows a drop at the same places.

---

## 2. The storytelling: ten rules

1. **Tell it to someone who wants something.** The Mahabharata is told to listeners nested inside each other: Sauti, Vaishampayana, Sanjaya. Each listener has a reason to listen, and Janamejaya hears the epic because his father was killed [D]. Give every episode a listener with a wound or a need: a parent who has lost a child asks about the Isha's first verse; Rohan asks what the film left out.
2. **"But" or "therefore", never "and then".** Parker and Stone's test: if "and then" fits between two beats, the story is weak [D]. Apply it at every transition in script review. The blind king should ask "but why?" or "so what did he do?", not "and then?".
3. **Select, don't recite.** The full Pabuji epic takes 36 hours, so the bhopas (Rajasthani scroll singers) skip episodes [D]. One scene per video. Karna's video is the river, not his life story.
4. **One object that changes meaning.** In Pandavani the singer's tambura becomes Bhima's mace, Arjuna's bow, a chariot [D]. Plant an object at 0:20 and let it mean something new at the end: the bow is a weapon in the first frame and a hand held back in the last.
5. **Verse, silence, one plain sentence.** The phad performance alternates *gav* (the sung verse) with *arthav* (the prose gloss) [D]. Show the verse card, hold three seconds of silence, then say one plain sentence. Never read the translation aloud a second time.
6. **Disagreement in the middle.** In *Sita Sings the Blues*, three shadow puppets argue about the Ramayana, and that argument is the film's commentary [D]. At the turn (about 6:00), let the schools speak as voices that interrupt each other: "Shankara says…, but Ramanuja answers…". This is also the sectarian-safe move: we show the argument, we do not win it.
7. **The text's own teaching images.** Uddalaka teaches with salt in water and a banyan seed, and repeats "tat tvam asi" after each [D]. Yama refuses Nachiketa's question three times with better offers [D]. These are ready-made scenes with a refrain and an escalation; use them before inventing new ones.
8. **An idea fails in someone's day before it is defined.** Show Meera, 31, in Pune, pressing "send" on a job application before the word *karma* appears. Put the object on screen before the word. Use the situation word first, then the Sanskrit [J].
9. **End on an image, a question or an act, never a summary.** The Vetala tells a tale that ends in a riddle the king must answer [D]. End "Valmiki, Not the Film" on Rama's line and a question the viewer has to answer: "Did he doubt her?"
10. **Open loops pull, they do not stick.** The "Zeigarnik effect" (that unfinished things are remembered better) failed a 2025 meta-analysis; only the urge to resume held [D]. Keep one or two loops per video for pull. Don't rely on cliffhangers to make people remember.

### Making the abstract concrete (worked examples; check every verse against the corpus)

| Idea | The scene |
| --- | --- |
| Karma (Gita 2.47) | Meera presses "send". The result is decided in a room she can't enter. Show her hand, never the outcome |
| Dharma | One man in three rooms (a son, a soldier, a friend), one demand in each, and the demands collide. That is Arjuna's morning |
| Atman (Chandogya 6) | A glass of water. Taste it: salty everywhere, the salt seen nowhere. "You are that" as the refrain |
| Maya | A dark room, a coil that seems to move, a lamp, a rope. Say that this image is Advaita's, and name the other schools' objection |
| The three gunas (Gita 14) | Meera's Sunday: the 11 a.m. scroll (tamas), the frantic to-do list (rajas), the unhurried hour (sattva). The gunas rise and fall in everyone; they are not fixed types |

---

## 3. Eight episode shapes (so no two episodes feel templated)

YouTube's July 2025 and July 2026 rules allow a recurring series. What they demonetise is "templated" content: the same skeleton with the nouns swapped [D]. The single 11-minute template in the content plan (section 7) stays as the rhythm guide. On top of it, each episode takes one of these shapes, and no series uses the same shape twice in a row [J].

| Shape | Beats | Best for |
| --- | --- | --- |
| **The Case** | The charge; evidence cards (verses); two counsel (schools); the verdict marked OUR NOTE; "what would overturn it" | Valmiki, Not the Film; contested Gita verses |
| **The Mystery** | One odd detail; three suspects (readings), each with a clue from the text; a reveal that costs something | The Inner Chariot (Katha, Mundaka, Isha) |
| **The Dialogue** | Two voices, one question per scene; the student refuses the easy answer; a closing image | Nachiketa and Yama; Shvetaketu; Gargi and Yajnavalkya |
| **The Journey** | Comfort, want, crossing over, trials, the price, return changed (Harmon's story circle [D]) | Karna, Ekalavya, Rama's exile |
| **The Countdown** | A visible clock: nine nights, or the minutes between the conches in Gita 1 | Why Do We…?; Gita chapter 1 |
| **Two Versions** | Valmiki, Tulsidas and the TV serial side by side, scene by scene; end on what each version needed | Valmiki, Not the Film |
| **A Day in the Life** | An ordinary person meets four moments; the verse arrives at the worst one, not the first | One Problem, One Verse |
| **The Letter** | A text read as a letter to one person; one reader's reply at the end | Night Reading; Gita in Ink |

---

## 4. Visual rhythm: the three clocks

The documented anchors: Hollywood action averages about 4 s a shot and horror about 16 s [D]. Miyazaki avoids both very long and very short shots [D], and that is our target. Murch weights the reasons to cut: emotion 51%, story 23%, rhythm 10% [D]. Never cut for rhythm against emotion.

| Clock | What happens | Rate [J] |
| --- | --- | --- |
| **Micro** | Something in the frame visibly changes: the flame swells, a label lights, a bird crosses, the camera eases | Every 2 to 4 s (about 200 per episode) |
| **Shot** | A new composition or camera idea | Every 8 to 15 s, median about 11 s; 55 to 70 shots in 11 minutes; 40% of shots at 6 to 9 s, 15% over 18 s |
| **Set-piece** | A bigger event: a scale reveal, a morph, a diagram build, an in-world wipe | Every 60 to 90 s (7 to 9 per episode) |

The Gita film's 9.8-s beat is close to the shot clock, so what it lacks are the micro and set-piece clocks, and variety of shot scale.

**Motion budget per shot** [J]:
- One main mover, one ambient layer (flame, dust, mist) and one camera drift. Never two things competing for the eye.
- Push-in: 3 to 6% scale across a shot, about 0.5% a second.
- Parallax across four planes: sky 0.1, far 0.3, middle 0.6, subject 1.0.
- Shake: 2 to 6 px, driven by noise, only for doubt or battle.

**Shot order** [J]:
- Never two shots in a row at the same scale (wide, medium, detail).
- Vary the direction of travel.
- No shot starts already moving at full speed: ease in over 8 to 12 frames.

**Earned stillness:**
- A verse card holds 8 to 14 s with only the flame breathing. Split it: the Devanagari first, then the English, each up to about 7 s (Netflix allows up to 7 s per subtitle event [D]).
- After a hard line, 1.5 to 3 s of nothing new. These are the only true stills.

**Text and sound sync:**
- Text appears 6 to 10 frames before the spoken word and holds 0.5 s after it.
- Sound leads the picture by 6 to 12 frames (a J-cut [D]).
- Every change of shot lands on a soft sound.

**Readable for every age** [J]:
- Spoken captions 44 px or more (already the case).
- Source plate 26 px or more at 90% opacity.
- Tags 22 px or more.
- Key figures at least 18 to 20% of frame height (the kit's rule).
- At least one medium shot or close-up every 30 s, so a phone viewer sees the gesture, not a dot on the horizon.

---

## 5. Colour and light by act (11-minute episode)

Pixar's colour scripts make colour more intense as the emotion rises and mute it in sombre moments [D]. Keep two peaks at most [J].

| Time | Act | Light |
| --- | --- | --- |
| 0:00 to 0:40 | Cold open | One diya in near-dark, 90% black, the flame steady. The hook line |
| 0:40 to 2:30 | The question | Indigo and plum dusk, a narrow amber band of horizon, the flame restless. Average brightness about 10% |
| 2:30 to 5:00 | The idea | Warm lamplit paper for the diagrams, entered through a lamp flare. Ink in near-black with gold accents, about 35% |
| 5:00 to 7:30 | The complication | Deepest night; the flame dims; a low shake; cool shadows. The lowest point, about 6:30 |
| 7:30 to 8:30 | The verse | A still, near-black card with gold type. The only quiet in the film |
| 8:30 to 10:00 | Resolution | Dawn climbs from indigo through rose and saffron to gold, with rays of light, a calm flame and a wide shot: the one brightness peak (about 55%) |
| 10:00 to 11:00 | Close | Back to the single diya, now steady, and the end card. The warm bookend |

**The flame is the emotional clock** [J]:
- It flickers for doubt, holds steady for resolve, and dims for fear.
- It is driven by noise (`@remotion/noise`), so it never loops visibly.

---

## 6. Acting with silhouettes

What the tradition shows:
- **Ravanachhaya** (Odisha's shadow puppets): small, one-piece, unjointed figures that act through simple gestures [D].
- **Tholu Bommalata** (Andhra's leather shadow puppets): figures jointed at waist, shoulders, elbows and knees, which can walk, sway and flip their arms [D].
- **Wayang** (Javanese shadow puppets): character read by silhouette type alone [D].

The rules for our figures [J]:
1. One idea per pose. Fill the figure black: the gesture must still read.
2. Hands and head carry the emotion. Keep the arms off the torso, with clear space between the limbs.
3. The head's angle is the only "face": down for grief, up for resolve, turned away for refusal, a 5 to 15 degree tilt for doubt.
4. Despair is the bow lowered, shoulders dropped, kneeling. Resolve is the bow raised, chest open, weight forward.
5. Pull back 4 to 6 frames before a big gesture; hold the end pose 12 to 24 frames.
6. A held figure never freezes. It breathes 1 to 2 px at about 0.25 Hz, and the head follows the body 3 to 5 frames late.
7. Figures move pose to pose at 8 to 12 poses a second, in few, large, clear poses, while the camera and light run at the full frame rate. The contrast reads as puppetry, which is our lineage.
8. In a two-shot, height shows power, and the listener stays still while the speaker moves.

---

## 7. Fifteen techniques, ranked by impact for the effort

| # | Technique | Remotion route | Effort |
| --- | --- | --- | --- |
| 1 | Slow push and drift on every shot | `interpolate` with easing on the frame's scale and position | Easy |
| 2 | The flame as the emotional clock | `noise2D` from `@remotion/noise` | Easy |
| 3 | Multiplane parallax, 3 to 5 planes (Reiniger's *Prince Achmed* [D], Disney's multiplane camera [D]) | translateX per plane = camera x × depth factor | Easy |
| 4 | A colour script by act | One grade and one overlay gradient per act, keyed to timecode | Easy |
| 5 | Sound hit points and J-cuts | Audio starts 6 to 12 frames before its sequence; a cue map | Easy to medium |
| 6 | Diagrams that draw on in sync with the words (3Blue1Brown style) | `@remotion/paths` `evolvePath`, timed from word-level voice timestamps | Easy to medium |
| 7 | Morph instead of cut: rope to snake, tree to roots | `flubber` or path interpolation between our own paths | Medium |
| 8 | In-world wipes (section 8) | `@remotion/transitions` custom presentation, or the kit's `LightFlash` and mist | Easy to medium |
| 9 | The phad lamp pan: one long scroll, a pool of light moving panel to panel | One wide SVG strip, translateX, radial-gradient mask | Easy to medium |
| 10 | Kaavad doors: painted doors opening on the next scene | Two half-planes with CSS perspective `rotateY` | Easy to medium |
| 11 | Match cuts on shape and light: flame to sun to moon, wheel to mandala | Same position and size on the last and first frame; a flare hides the swap | Medium |
| 12 | Scale reveal: a figure, then the field, then the cosmos | Zoom interpolated in log space so the speed feels even | Medium |
| 13 | Pose-to-pose silhouette acting | Pose library per figure, stepped timing | Medium to hard |
| 14 | Breathing and gentle handheld shake | `noise2D` offset, 0.2 to 0.4 Hz | Easy |
| 15 | Depth haze and pseudo rack-focus | Crossfade a haze layer and a pre-softened far plane. Use `CameraMotionBlur` only on fast moves, since it multiplies render time | Medium |

Not recommended:
- **3D figures** (`@remotion/three`) are slow to render and off-style (DIRECTIONS.md says the same).
- **Lottie** for small ornaments only.

---

## 8. Six transitions native to Lamplight and Indian narrative art

1. **Lamp flare.** The flame swells until the frame goes gold. The scene swaps behind the gold, and a small flame sits in the same place in the new shot. Kit `LightFlash`. Easy.
2. **Lamp out, lamp lit.** The flame dies to black over 6 to 10 frames, then a new flame lights somewhere else and becomes the next scene's light. Easy.
3. **The phad pan.** A continuous painted scroll with vine borders. The camera slides sideways while the bhopi's lamp moves to the next episode [D: the bhopi lights each panel as it is sung]. Medium.
4. **Kaavad doors.** Painted doors open onto the next scene, or close at the end of a chapter [D: the Kaavad storyteller opens the doors as the story goes]. Medium.
5. **Perforation iris.** Light through a shadow puppet's punched holes grows until the holes fill the frame and become the next shot. Medium.
6. **The palm leaf turns.** A palm-leaf manuscript leaf turns over to reveal the verse card, or a diagram sheet slides under the lamp. Medium.

For travel or the passing of time, borrow continuous narration from temple reliefs: the same figure two or three times across one long pan, as in Sanchi's *Great Departure* [D].

---

## 9. Writing for the synthetic voice

Documented in voice-tool guides [D]:
- Read the script aloud. If you run out of breath, split the sentence.
- Commas give a short break, full stops a full reset, paragraph breaks a longer pause; dashes and ellipses work inline.
- Emphasis markup varies by engine, so test ours.
- Write numbers as they are spoken.

Our rules [J]:
- **Sentences:** 8 to 14 words, one idea each. Follow a long sentence with a very short one. Put the key word last; that gives emphasis without markup.
- **Tone:** contractions and "you". Never "one should". "We must" or "one should" at most twice per script.
- **The verse:** say who speaks, where and why; show the card; three seconds of silence; then one plain sentence. Echo at most 3 or 4 words of the English aloud. Sanskrit is never spoken by the synthetic voice (rule 10); a human reciter, if any.
- **Silence:** two or three designed silences per video (the card, after the turn, before the last image). None as padding.
- **Humour:** at the narrator, the modern viewer, the TV serial or our own scholarship. Never at a deity, sage, school or devotee. One dry line every 2 to 3 minutes at most. Gaiman's retellings are praised for this and criticised when the narrator's voice upstages the story [D].
- **Pace:** 140 to 155 words a minute. Respell Sanskrit names in the script, and give them one human listen.

---

## 10. The boring alarm: a checklist for every script and rough cut

Fail the video if any line is true.

**Script**
1. No concrete question or stake in the first 5 seconds.
2. A transition where "and then" fits and "but" or "therefore" does not.
3. An abstract noun on screen or in the voice for 20 seconds with no object or person.
4. Three definitions in a row, or a list of four or more with no escalation.
5. The narrator explains a feeling instead of showing a choice.
6. A verse card before the viewer needs it.
7. No disagreement, objection or surprise in the middle third.
8. The ending summarises instead of showing an image, a question or an act.
9. The planted object never pays off.
10. The shape repeats the previous episode of the same series.

**Picture**

11. Any 45 seconds with no new image, turn or question (the VoxPlus hook rule; `hook_check.py`).
12. Any 4 seconds with nothing moving in the frame, unless it is a designed still (a verse or a silence).
13. Two shots in a row at the same scale.
14. No medium shot or close-up in 30 seconds.
15. One colour temperature for more than two minutes.
16. A source plate or tag smaller than the sizes in section 4.

**Sound**

17. No joke and no silence in the last three minutes.
18. A change of shot with no sound under it.

---

## 11. What makes code-drawn video look cheap, and the fix

| Looks cheap | Fix |
| --- | --- |
| Everything moves in straight lines, all at once | Ease in and out everywhere; stagger elements by 3 to 6 frames; overlap actions |
| A flat slow zoom on one picture | 3 to 5 planes at different speeds, ambient dust, a passing foreground |
| Things pop in, or ghost through crossfades | Draw on, grow from an origin, or reveal with light or mist; only light, mist and glow may fade (kit rule) |
| Too clean: perfect gradients, no grain | Grain and vignette from the kit's finish layer, a 0.5 to 1.5 px wobble, irregular timing |
| A silent or repetitive picture | A sound under every transition; a new scale and direction each shot; a short tension beat before a reveal |

---

## 12. What to build next, in order

1. **Readability fix** in `src/katha/Film.tsx`: plate 26 px at 90% opacity; tags 22 px. Ten minutes of work. Re-render the Gita film with the end-card rebrand, so both changes go into one render.
2. **Camera layer:** a push and drift on every shot, parallax on the hall, field and chariot scenes, and the flame as the emotional clock (techniques 1 to 3 and 14). This is the biggest change for the effort.
3. **Colour script by act** (technique 4), driven from the script so each episode sets its own act times.
4. **Close-up set:** hands on the reins, the bow falling, Krishna's raised hand, the lamp's flame, the conch at the lips. The figures already exist in `src/katha/figures.ts`; these are new crops and poses.
5. **Shot-clock and scale checker:** extend `build_film.py`'s checks to flag same-scale runs, missing close-ups and long colour stretches, the way `hook_check.py` checks hooks.
6. **Transitions:** lamp out and lamp lit, the phad pan, and Kaavad doors (techniques 8 to 10).
7. **The first non-Gita episode** written in one of the shapes in section 3, with the checklist in section 10 applied before the voice pass.

## Sources

**Storytelling**
- Katha and the oral forms: [Katha (storytelling format)](https://en.wikipedia.org/wiki/Katha_(storytelling_format)), [Harikatha](https://en.wikipedia.org/wiki/Harikatha), [Bhopa](https://en.wikipedia.org/wiki/Bhopa), [Phad paintings (Sarmaya)](https://sarmaya.in/spotlight/inside-the-magical-world-of-rajasthans-phad-paintings/), [Pandavani](https://en.wikipedia.org/wiki/Pandavani), [Tholu Bommalata (Sarmaya)](https://sarmaya.in/spotlight/tholu-bommalaata-dance-of-the-shadow-puppets/), [Vetala tales](https://en.wikipedia.org/wiki/List_of_Vetala_Tales).
- The texts: [Chandogya 6.8.7](https://shlokam.org/texts/chandogya-6-8-7), [Gargi's silence](https://indianphilosophyblog.org/2020/02/05/learning-from-gargis-silence/).
- Craft: [But/therefore](https://mattrickard.com/but-therefore), [Pixar's 22 rules](https://www.openculture.com/2013/03/pixars_22_rules_of_good_storytelling.html), [Harmon's story circle](https://swipefile.com/dan-harmons-8-step-story-circle), [Abrams, the mystery box](https://www.ted.com/talks/j_j_abrams_mystery_box), [Zeigarnik effect](https://en.wikipedia.org/wiki/Zeigarnik_effect), [Sita Sings the Blues](https://gkids.com/films/sita-sings-the-blues/), [pauses in synthetic voice](https://www.narakeet.com/docs/how-to/add-pauses-to-text-to-speech-voiceovers.html), [YouTube: inauthentic content](https://support.google.com/youtube/answer/1311392).

**Picture**
- Shot length and editing: [average shot lengths (Follows)](https://stephenfollows.com/p/many-shots-average-movie), [Kohara and Niimi 2013](https://journals.sagepub.com/doi/abs/10.1177/1746847713487472), [Murch's rule of six](https://cloud.wikis.utexas.edu/wiki/spaces/rtf318/pages/80022510/Murch+s+Rule+of+Six), [J-cut](https://en.wikipedia.org/wiki/J_cut).
- Camera and colour: [multiplane camera](https://en.wikipedia.org/wiki/Multiplane_camera), [The Adventures of Prince Achmed](https://en.wikipedia.org/wiki/The_Adventures_of_Prince_Achmed), [Pixar colour scripts](https://hyperallergic.com/610771/the-art-of-pixar-chronicle-books/), [Netflix timed-text guide](https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617-Timed-Text-Style-Guide-General-Requirements).
- Puppetry and narrative art: [Tholu Bommalata](https://en.wikipedia.org/wiki/Tholu_bommalata), [Togalu Gombeyata](https://en.wikipedia.org/wiki/Togalu_gombeyaata), [Kaavad makers (QAGOMA)](https://collection.qagoma.qld.gov.au/page/kaavad-makers), [Pattachitra](https://en.wikipedia.org/wiki/Pattachitra).
- Remotion: [transitions](https://remotion.dev/docs/transitions), [custom presentations](https://remotion.dev/docs/transitions/presentations/custom), [motion blur](https://www.remotion.dev/docs/motion-blur).

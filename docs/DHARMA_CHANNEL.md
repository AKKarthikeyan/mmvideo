# The spiritual channel (working name "dharma"): how it is made

Set up 21 Oct 2026 from the research in `SPIRITUAL_CHANNEL_RESEARCH.md` and `NICHE_GAPS.md`. Same engine as Moat & Margin
(Remotion, the Vox template, MiniMax voices, the illustration kit); a different kit, a different corpus and stricter sourcing rules.

## The format: VoxPlus (AK, 21 Oct 2026: "use our VoxPlus")

The story format AK set on 11 Oct 2026 for the Moat & Margin story videos (`dmartstory`, `amckeeps`, `cablerest`, `lombardfloat`, `e2egpu` in
`scripts/vx_scripts.py`): the Vox engine plus the illustration kit, told to a viewer who has never opened the text. The pilot follows it beat for beat:

| VoxPlus element | In the pilot (`scripts/dharma/dharma_scripts.py`) |
| --- | --- |
| A real question at 0:00 (by 0:05), then a hook at most every 45 s | `hooks` list, checked by `build_dharma.py` after every build (same arithmetic as `scripts/hook_check.py`) |
| A spine, one sentence | "Who let go of the reins at two in the morning?" |
| A gate: changed, care, added, invalidate, monitor | what the text says; who it is for; what is our reading; what would make our reading wrong; what to try and watch |
| A recurring case board | the chariot (`_board()`): six parts named one by one, stamps count them, "CASE CLOSED?" at the verdict |
| Every beat illustrated | verse cards, chariot, gears (the eight-link chain), birds, rope (dark at 0:00, the lamp at the verdict), hand-written worries and comforts, cards |
| Chapter titles on mood plates | `pics` (MiniMax image-01, no people, no deities, no text), generated with `build_dharma.py --pics` |
| Marks | hook, rehooks, turn, counter, plants (the snake at 0:00 pays off at the verdict; the chariot at 0:20 closes at the end), known, unknown, monitor, handoff |
| Sources, then the end card, then the next video named | `sources`, `end`, `next_video` |

## The rules (all of them matter)

1. **Narrator, never deity.** The voice is a guide. Krishna's words are shown as quotes with chapter, verse and translator. No beat is ever written in the first person as a god.
2. **The verse is on screen.** A `verse` beat carries only a reference (`ref="gita:2.47"`). The build fills the Devanagari, transliteration, English and source line from `scripts/dharma/corpus.py`. Nobody types a verse by hand.
3. **Quotable translations only.** On screen: Shri Purohit Swami (1935, public domain) by default; Swami Sivananda (public domain in India since 2024) with attribution. Gita Press, ISKCON and other modern translations are reference-only and never shown.
4. **Our reading is marked.** Interpretation goes in beats with the kicker `OUR NOTE` (kinetic) or a heading ending `· OUR NOTE`. State the school when it matters.
5. **Draw the idea; show Krishna only as a silhouette in light.** AK asked on 21 Oct 2026 for the Gita "by Krishna to Arjuna", which overrides the earlier rule that no deity is drawn. What it allows: Krishna and Arjuna as backlit silhouettes (`src/katha/figures.ts`), known by crown, peacock feather, garland, raised hand, bow and quiver; never a face or features, never colour-filled, never by an image model. Krishna's cosmic form (Gita 11) is shown only as light. No other deity is drawn. The explainer kit (`src/vx/illus/Dharma.tsx`) keeps drawing the models the texts teach: the chariot, the two birds, the inverted tree, the three gunas, the rope and the snake, salt in water.
6. **No "research shows" without the paper on screen.**
7. **Disclosure beat** in every long video (`DISC` in `dharma_scripts.py`): verse and chapter on screen, our reading marked, drawn in code, synthetic voice, nobody here speaks for God. Same line in every description.
8. **A human reviewer signs `reviewed_by`** on the video before upload. The build writes `public/vx/<id>/review.md`: every verse, the Sanskrit, the English shown and the narration round it. Until it is signed the video is a DRAFT.
9. **Festival videos go up two weeks early.** Calendar in the research doc. Ramayana: Part 1 releases 6 Nov 2026; Gita Jayanti about 20 Dec 2026 (verify with a panchang).
10. **English original, Hindi as an audio track** (`scripts/audio_tracks.py`, same rules as `AUDIO_TRACKS.md`). Sanskrit shlokas are shown, not read by the TTS; if a shloka must be heard, a human reciter records it.

## The pieces

| What | Where | Run |
| --- | --- | --- |
| Corpus (Gita: Sanskrit, transliteration, word meanings, translations) | `scripts/dharma/corpus.py`, data in `sources/scripture/` (not in git), manifest with sha256 in `scripts/dharma/corpus_manifest.json` | `python3 scripts/dharma/corpus.py fetch` once per machine; `verse 2.47`; `chapter 2` |
| Scripts | `scripts/dharma/dharma_scripts.py` (beat format of `vx_scripts.py`; `V()` makes a verse beat) | edit |
| Build | `scripts/dharma/build_dharma.py` writes `public/vx/<id>/data.json` and `review.md`, runs the hook-cadence check, voices beats with MiniMax (`MINIMAX_API_KEY`), `--no-tts` for layout, `--pics` for the title plates | `python3 scripts/dharma/build_dharma.py --no-tts dhgita02` |
| Compositions | `src/dharma/Videos.tsx` registers `DH-<id>-long` and `DH-<id>-shortN` on the Vox engine | `npx remotion render src/index.ts DH-dhgita02-long out/dhgita02.mp4` |
| Kit | `src/vx/illus/Dharma.tsx`: scenes `verse`, `chariot`, `birds`, `tree`, `gunas`, `rope`, `salt`; icons diya, lotus, chariot, bow, flute, feather, banyan, conch; stills in `illustration-library/scenes/` and `icons/`, example props in `illustration-library/props/`. Redrawn 21 Oct after AK's note that the first pass looked like a child's drawing: the horse, the ratha (car, rail, parasol, twelve-spoke wheel), the faceless rider and driver, the songbirds, the trees, the twisted rope, the snake, the bowl and the salt crystal are built from tapered bands, hanging locks, leaf clusters and bending limbs in the kit's flat-fill, ink-outline style. The chariot board names its parts with a numbered legend and matching badges on the picture instead of six arrows across it. | `npx remotion still <bundle> ILLUS-dev out.png --props=illustration-library/props/chariot.json --frame=400`; library: `REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium python3 scripts/export_illustration_library.py` |
| Fonts | `public/fonts/NotoSerifDevanagari.ttf`, `NotoSerif.ttf` (OFL, licence files beside them) | included by the `verse` scene |
| Music | `scripts/dharma/tanpura.py`: a 64 s seamless tanpura loop (Sa = C#3) and a singing-bowl bell, code-composed, nothing to license; written to `public/dharma/` (wav not in git, regenerate) | `python3 scripts/dharma/tanpura.py` |
| Katha kit (the premium look) | `src/katha/` (guide: `src/katha/README.md`): silhouettes in light for long-form story films. Skies by mood with god rays, cloud bands, stars and dust; the armies of Kurukshetra in depth; Krishna, Arjuna and the ratha as rim-lit silhouettes; a gallop and a standing team of horses and three birds in flight traced from models by Mirada in *3 Dreams of Black* (ro.me, Apache 2.0, via three.js; `scripts/katha/trace_glb.py`); verse and chapter cards in Tiro Devanagari Sanskrit, Cormorant Garamond and Cinzel (OFL); metaphor scenes in `src/katha/metaphors/`; `Film.tsx` engine; `KATHA-thumb` thumbnail. Built 21 Oct after AK asked for the Gita "premium, rich, poetic" and the flat style was rejected twice. | `python3 scripts/katha/build_film.py scripts/katha/<id>.json` then `npx remotion render <bundle> KT-<id>`; sounds: `python3 scripts/katha/sounds.py` |

In the cloud session the browser for Remotion is `/opt/pw-browsers/chromium`: add `--browser-executable=/opt/pw-browsers/chromium --chrome-mode=chrome-for-testing` to `remotion still` and `render`.

## Open items

- Mixing the tanpura bed under the Vox narration (the Vox long has no music bed yet; the Sleep/Letter engine does). Add a ducked bed to `VoxLong` behind a flag, or mix in post with ffmpeg.
- Public-domain texts beyond the Gita (Arnold's Song Celestial, Ganguli's Mahabharata, Max Muller's Upanishads): Gutenberg and sacred-texts are blocked from the cloud session's proxy. Drop the files into `sources/scripture/` by hand and add them to `SOURCES` in `corpus.py`.
- Thumbnails for the channel: an `ILLUS-thumb` variant with the dharma kit and a single icon, three to five words, no deity.
- Channel name, handle, palette accent, narrator and reviewer: AK's decisions (listed at the end of the research doc).

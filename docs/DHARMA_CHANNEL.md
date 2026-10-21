# The spiritual channel (working name "dharma"): how it is made

Set up 21 Oct 2026 from the research in `SPIRITUAL_CHANNEL_RESEARCH.md` and `NICHE_GAPS.md`. Same engine as Moat & Margin
(Remotion, the Vox template, MiniMax voices, the illustration kit); a different kit, a different corpus and stricter sourcing rules.

## The rules (all of them matter)

1. **Narrator, never deity.** The voice is a guide. Krishna's words are shown as quotes with chapter, verse and translator. No beat is ever written in the first person as a god.
2. **The verse is on screen.** A `verse` beat carries only a reference (`ref="gita:2.47"`). The build fills the Devanagari, transliteration, English and source line from `scripts/dharma/corpus.py`. Nobody types a verse by hand.
3. **Quotable translations only.** On screen: Shri Purohit Swami (1935, public domain) by default; Swami Sivananda (public domain in India since 2024) with attribution. Gita Press, ISKCON and other modern translations are reference-only and never shown.
4. **Our reading is marked.** Interpretation goes in beats with the kicker `OUR NOTE` (kinetic) or a heading ending `· OUR NOTE`. State the school when it matters.
5. **Draw the idea, not the god.** No deity is drawn, and no image model is used for deities. The kit (`src/vx/illus/Dharma.tsx`) draws the models the texts teach: the chariot, the two birds, the inverted tree, the three gunas, the rope and the snake, salt in water.
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
| Build | `scripts/dharma/build_dharma.py` writes `public/vx/<id>/data.json` and `review.md`; voices beats with MiniMax (`MINIMAX_API_KEY`), `--no-tts` for layout | `python3 scripts/dharma/build_dharma.py --no-tts dhgita02` |
| Compositions | `src/dharma/Videos.tsx` registers `DH-<id>-long` and `DH-<id>-shortN` on the Vox engine | `npx remotion render src/index.ts DH-dhgita02-long out/dhgita02.mp4` |
| Kit | `src/vx/illus/Dharma.tsx`: scenes `verse`, `chariot`, `birds`, `tree`, `gunas`, `rope`, `salt`; icons diya, lotus, chariot, bow, flute, feather, banyan, conch; stills in `illustration-library/scenes/` and `icons/`, example props in `illustration-library/props/` | `npx remotion still <bundle> ILLUS-dev out.png --props=illustration-library/props/chariot.json --frame=400` |
| Fonts | `public/fonts/NotoSerifDevanagari.ttf`, `NotoSerif.ttf` (OFL, licence files beside them) | included by the `verse` scene |
| Music | `scripts/dharma/tanpura.py`: a 64 s seamless tanpura loop (Sa = C#3) and a singing-bowl bell, code-composed, nothing to license; written to `public/dharma/` (wav not in git, regenerate) | `python3 scripts/dharma/tanpura.py` |

In the cloud session the browser for Remotion is `/opt/pw-browsers/chromium`: add `--browser-executable=/opt/pw-browsers/chromium --chrome-mode=chrome-for-testing` to `remotion still` and `render`.

## Open items

- Mixing the tanpura bed under the Vox narration (the Vox long has no music bed yet; the Sleep/Letter engine does). Add a ducked bed to `VoxLong` behind a flag, or mix in post with ffmpeg.
- Public-domain texts beyond the Gita (Arnold's Song Celestial, Ganguli's Mahabharata, Max Muller's Upanishads): Gutenberg and sacred-texts are blocked from the cloud session's proxy. Drop the files into `sources/scripture/` by hand and add them to `SOURCES` in `corpus.py`.
- Thumbnails for the channel: an `ILLUS-thumb` variant with the dharma kit and a single icon, three to five words, no deity.
- Channel name, handle, palette accent, narrator and reviewer: AK's decisions (listed at the end of the research doc).

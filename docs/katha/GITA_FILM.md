# The Gita film: state and how to finish it on the Mini

*The Bhagavad Gita: The Song of the Lord*, as Sanjaya told it to the blind king. Composition `KT-gita`.

## Where it stands (22 Oct 2026)

- **Script**: `scripts/katha/gita.json`. 119 beats, 2,270 spoken words, all 18 chapters plus a prologue and an epilogue. Three drafts were judged by a scholar, a director and a strategist; the winner was merged and fact-checked. Every Krishna, Arjuna and Dhritarashtra line is the corpus text of its verse (Purohit Swami 1935; 4.7 from Sivananda 1949).
- **Look**: Lamplight (AK's choice). The kit is in `src/katha/` (guide: `src/katha/README.md`; every piece on the `KATHA-kit` still). Reference stills are in this folder.
- **Scenes**: all 19 metaphor scenes plus Sanjaya's hall, Krishna's cosmic form (only as light) and the end card are built and had one fix round against an art director's notes. Builders self-scored them 7 to 8.5 out of 10.
- **On screen**: every quoted line shows its chapter, verse and translator; our own readings carry OUR NOTE.
- **Licences**: horses traced from the CC0 Quaternius horse, birds drawn in code, fonts OFL, music synthesised in code. `build_film.py` checks every silhouette's credit on each build.
- **Length**: about 18.7 min estimated. The real length comes from the voice.

## On the Mini

```bash
git pull
npm ci
python3 scripts/dharma/tanpura.py        # tanpura bed and bell (wav files are not in git)
python3 scripts/katha/sounds.py          # conch, flute and swell cues
export MINIMAX_API_KEY=...               # the key that lives on the Mini
python3 scripts/katha/build_film.py scripts/katha/gita.json --tts    # voices every beat, caches the mp3s, re-times the film
npx remotion studio                      # optional: scrub KT-gita before rendering
npx remotion render src/index.ts KT-gita out/gita.mp4
```

The build prints four checks; all four should pass: quotes are corpus text, every beat resolves to a scene, every quoted line is attributed on screen, and every silhouette is CC0 or drawn in code. `public/katha/gita/description.txt` holds the YouTube description with chapter timestamps (rebuilt from the voiced timing) and credits.

## Decisions for AK before publishing

1. **A voice for Krishna.** Rule 1 says the narrator never speaks as a god. The script gives Krishna's quoted verses their own voice settings (`KRISHNA` in `VOICES`, `scripts/katha/build_film.py`), always with the verse plate on screen. Keep that, or have Sanjaya read the verses?
2. **The disclosure.** It is spoken once at the end, over the end card, not early. Keep it there?
3. **Pronunciation.** Ear-test the Sanskrit names in the MiniMax voice, and the letter "A" at beat c10b02 ("ay" or "uh").
4. **13.34.** Purohit widens the Sanskrit. Sivananda's wording would tie the verse to the chapter title, but it would be a second Sivananda exception.
5. **The printed text.** The corpus English is an edited, modernised copy. Check every quoted line against the printed 1935 Purohit (and 1949 Sivananda for 4.7) before publishing; start with 2.12, 18.72 and 4.7.

## Known rough edges

- The birds read well at flock size, but at close-up their wing upstroke snaps. The review loop was stopped to save effort.
- The scenes had one fix round, not a final independent review. Scrub the studio once before the final render.
- The standing team of four horses lines up its legs like a comb in side view.

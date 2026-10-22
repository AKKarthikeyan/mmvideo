# The Gita film: state and how to finish it on the Mini

*The Bhagavad Gita: The Song of the Lord*, as Sanjaya told it to the blind king. Composition `KT-gita`.

## Where it stands (22 Oct 2026)

- **Script**: `scripts/katha/gita.json`. 119 beats, 2,270 spoken words, all 18 chapters plus a prologue and an epilogue. Three drafts were judged by a scholar, a director and a strategist; the winner was merged and fact-checked. Every Krishna, Arjuna and Dhritarashtra line is the corpus text of its verse (Purohit Swami 1935; 4.7 from Sivananda 1949).
- **Look**: Lamplight (AK's choice). The kit is in `src/katha/` (guide: `src/katha/README.md`; every piece on the `KATHA-kit` still). Reference stills are in this folder.
- **Scenes**: all 19 metaphor scenes plus Sanjaya's hall, Krishna's cosmic form (only as light) and the end card are built and had one fix round against an art director's notes. Builders self-scored them 7 to 8.5 out of 10.
- **On screen**: every quoted line shows its chapter, verse and translator; our own readings carry OUR NOTE.
- **Licences**: horses traced from the CC0 Quaternius horse, birds drawn in code, fonts OFL, music synthesised in code. `build_film.py` checks every silhouette's credit on each build.
- **Length**: about 18.7 min estimated. The real length comes from the voice.

## On the Mini: one command

```bash
git pull && npm ci
export TYPESAFE_API_KEY=... MINIMAX_API_KEY=...    # both live on the Mini
scripts/katha/finish_gita.sh
```

It makes the tanpura, bell and sound cues, asks Jev the open decisions and applies them, voices every beat with
MiniMax, re-times the film, runs the four checks, and renders `out/gita.mp4`. The four checks: quotes are corpus
text, every beat resolves to a scene, every quoted line is attributed on screen, and every silhouette is CC0 or
drawn in code. `public/katha/gita/description.txt` holds the YouTube description with chapter timestamps and credits.
Scrub the film once in `npx remotion studio` before uploading.

## Decisions

AK, 22 Oct 2026: "Get own voice, remaining get the opinion of Jev and complete".

1. **Krishna's voice: his own.** Krishna's quoted verses get a MiniMax voice of their own, not the narrator's voice at another pitch. Jev picks it from the live English voice list (`scripts/katha/ask_jev.py`, question `voice`).
2. **The disclosure: Jev decides** between the end only (as now), early only, or a short line early as well.
3. **Pronunciation: Jev decides** how Sanjaya says the letter A in 10.33. Jev cannot listen, so the Sanskrit names still get one listen in the new voices.
4. **13.34: Jev decides** between Purohit and Sivananda, and also for 2.12 and 18.72, judged on faithfulness and on being clear when heard once.
5. **The printed text.** Jev cannot read the 1935 book. Every plate says "(EDITED TEXT)", which is what the film quotes; a check against print stays open for whenever the book is at hand.

The script keeps the current choice when Jev's confidence is below 0.45, caches Jev's answers in
`public/katha/gita/jev_answers.json`, and records them in `docs/katha/JEV_DECISIONS.md`.

## Known rough edges

- The birds read well at flock size, but at close-up their wing upstroke snaps. The review loop was stopped to save effort.
- The scenes had one fix round, not a final independent review. Scrub the studio once before the final render.
- The standing team of four horses lines up its legs like a comb in side view.

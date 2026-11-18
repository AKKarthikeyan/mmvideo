# Bhagavad Gita in 15 minutes: runbook

The 16:9 long video covering all 18 chapters. It is built entirely in code; nothing here is published.

## Files

- `scripts/gita/corpus.py`: parses sanskritdocuments.org's `bhagvadnew.html` into `sources/gita/gita.json`. This is a 701-verse edition: 13.1 is Arjuna's question, so 13.2 here is 13.1 in Gita Press. Each verse carries its speaker and any variant reading, and the IAST comes from our own transliterator.
- `scripts/gita/gita15.py`: the approved script.
  - It holds the beats and cues, 24 verse cards (word-split IAST and our translations), chapter names, and the `LABELS` used for on-screen Sanskrit.
  - `check` proves that every card, chapter name and label matches the corpus letter for letter and that every citation exists.
  - `md` writes `docs/gita/gita15_script.md`.
- `scripts/gita/build_gita15.py`: voices every cue, lays out the timeline and writes `public/gita/g15/data.json` plus `public/gita/g15/a/*.wav`. It re-voices only cues whose text or voice changed.
- `src/gita/index.ts` is the separate Remotion entry; it never touches the shared Root.tsx or Videos.tsx. `src/gita/g15/G15.tsx` assembles the video; the scenes are in `scenes1.tsx` and `scenes2.tsx`, the overlays (titles, movements, verse card, captions, mala) in `overlays.tsx`, and the shared drawing kit in `src/gita/kit.tsx`.

## Steps

```bash
python3 -I scripts/gita/gita15.py check
python3 -I scripts/gita/build_gita15.py minimax      # 06:45-22:10 IST only; Vigil/Ravens use the key at night
npx remotion bundle src/gita/index.ts --out-dir=/tmp/vxb_g15_<tag>
npx remotion render /tmp/vxb_g15_<tag> GITA-g15 out/gita/gita15_v1.mp4
```

Run `build_gita15.py` with no argument for the macOS `say -v Aman` placeholder voice, which is fine for building scenes.

## Timing knobs (build_gita15.py)

`SPEED` is the MiniMax speed (1.04). The other knobs are `GAP_CUE`, `GAP_BEAT`, `AFTER_TITLE`, `WRITE_2` / `WRITE_4` (the ritual silence while the Devanagari writes) and `AFTER_EN`. With the placeholder voice the video runs 13:01; tune these after the MiniMax voicing to land near 15:00.

## House rules on screen

- The narrator is a guide, never the deity, and Krishna appears only as symbols (feather, flute, reins).
- Quotes are italic. Our interpretation is roman in an OUR NOTE card.
- Every verse shows its speaker, the Devanagari, the IAST, our English and a seal with the reference.
- Captions are hidden under cards and title cards.
- The 18-bead japa mala at the foot lights one bead per chapter.

## Still needed before upload

A human Sanskrit / doctrine reviewer has to sign off on the cards. AK publishes only on his word.

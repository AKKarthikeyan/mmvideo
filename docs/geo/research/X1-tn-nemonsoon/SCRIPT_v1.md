# X1 tnmonsoon: script v1 (Shorts engine, F10 Paradox, 4 Nov 2026). Voice NOT yet made.

Source of truth: `scripts/geo/extra.py` (beats) and `script_v1.json` (same beats with claim IDs). Scene spec: `src/geo/extra/tnmonsoon.ts`.

| Move | Beat | Line (spoken) | Claims |
|---|---|---|---|
| M1 Hook | b1 | Forty-eight per cent of Tamil Nadu's yearly rain falls after the summer monsoon withdraws. | C001, C011 |
| M2 Ground | b2 | About seventy-five per cent of India's rain falls in that monsoon. | C002 |
| M3 Push ("but") | b3 | But in those months, IMD says, Tamil Nadu sits in a rain shadow. | C003 |
| M4 Turn | b4 | Then, in October, the summer monsoon withdraws. | C005, C011 |
| M4 Turn | b5 | Low-level winds reverse, from south-westerly to north-easterly. | C004 |
| M4 Turn (peak) | b6 | Low-pressure systems from the Bay of Bengal drift west, adding rain. | C006 |
| M5 Click | b7 | The north-east monsoon takes over: for Tamil Nadu, the chief rainy season. | C007, C011 |
| M5 Echo | b8 | So its biggest rains begin as India's summer monsoon ends. | C001, C011 |

On-screen end question: "Which month does your town's rain arrive?" Credit: IMD Chennai, IMD NEMSOF-2026.

**Length:** 87 words by whitespace (94 spoken words, hyphenated words counted as two). At Week 1's 2.9-3.4 spoken words a second, with the engine's 0.12 s gaps and 1.2 s end hold: about 30-35 s (estimate; the real length comes after voicing). Numbers: two (48%, 75%) plus the month, within C7.

**Shorts gate (self-check):** SH1 question implied by 2 s (the 48% line) ✓; SH2 words within the Indica budget ✓; SH3 one "but" (b3) ✓; SH4 each line causes the next (but/so) ✓; SH5 setting carried by the map ✓; SH6 time jump signposted ("Then, in October") ✓; SH7 numbers 2, each with a comparison ✓; SH8 the turn (winds, Bay systems) is planted by the "rain shadow" line ✓; SH9 b8 rhymes with b1 ✓; SH10 stands alone ✓. Peak at the 2/3 mark is b6 (around 60-70%).

## To finish (do not run at night: MiniMax voice window is 06:45-22:10 IST)
1. `zsh -lic 'python3 scripts/geo/voice_geo.py extra:tnmonsoon'` (from `/Volumes/DarwinSSD/MMVideo`; replaces the draft `public/geo/tnmonsoon/data.json`, which holds estimated timings and no audio).
2. Check the length (25-35 s); trim a beat if over.
3. `npx remotion render src/geo/extra/index.ts GEO-tnmonsoon out/geo/extra/tnmonsoon.mp4`, then `scripts/geo/frame_sheet.py tnmonsoon <mp4> <sheet.jpg>` and look at every beat.
4. Titles, description, pinned comment (may mention IMD's normal-season outlook, C010) and a thumbnail still, like Week 2.
5. Fold `src/geo/extra/` into `GeoRoot.tsx` only after AK approves, to avoid clashing with the Week 3 build.

## Voiced (4 Nov 2026, 23:3x IST, on AK's word, outside the usual 06:45-22:10 window)
`voice_geo.py extra:tnmonsoon` then `trim_geo.py tnmonsoon 1.07`: 8 beats, 28.0 s of speech, about 30.1 s with gaps and the end hold. Audio is in `public/geo/tnmonsoon/` (local only). Next: render and frame-check (step 3 above).

## Rendered (5 Nov 2026)
`out/geo/extra/tnmonsoon.mp4` (30.1 s, draft, not posted); frame sheet `out/geo/extra/tnmonsoon_sheet.jpg`. Still to do: titles, description, pinned comment, thumbnail; set "Altered or synthetic content: Yes" on upload.

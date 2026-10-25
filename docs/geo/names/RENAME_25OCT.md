# Monsoon Atlas rename: shortlist for AK (25 Oct 2026)

Why: there is an older YouTube channel also called "Monsoon Atlas" (UC1EQkhinJ1NpDmI3d6i2rFg, made 2011, 37 videos,
96 subscribers). It covers the same ground: Indian Ocean trade, monsoon winds, maritime history. Ours is
UCaVS1O_w63qU5izzdxPo8kQ (made 20 Oct 2026, 8 videos, 13,337 views, 11 subscribers on 25 Oct).

Names scored with Jev using the 20 Oct rubric (`scripts/geo/jev_rank_names.py`). Full scores for 46 names are in
`jev_names_rename_25oct.jsonl`. Composite = 0.3 global + 0.2 India + 0.2 fit + 0.3 memorable - 0.25 risk.
For comparison, "Monsoon Atlas" scored 0.592 on 20 Oct.

The "YouTube" column is a vidIQ search for channels with that name on 25 Oct. It does not tell us whether the @handle is free.
Check the handle in YouTube Studio.

| Name | Jev | YouTube | Notes |
|---|---|---|---|
| Peacock Atlas | 0.541 | no channel found | India's national bird; easy to draw as a logo. Shares a word with NBC's Peacock streaming service |
| Indica Atlas | 0.510 | no channel found | After Megasthenes' *Indica*, an early account of India. Clear India signal |
| Zero Mile Atlas | 0.493 | no channel found | After the Zero Mile Stone in Nagpur. Good story, weak India signal for people who don't know it |
| Spicewind Atlas | 0.489 | no channel found | Keeps the monsoon trade-wind story without the word "monsoon" |
| Mandala Maps | 0.506 | no channel found | Nearby channels are spiritual or mandala-art ones |
| Ganges to Gobi | 0.511 | no channel found | Sounds Asia-wide, not just India. Higher risk score (0.54) |
| Indigo Atlas | 0.546 | name taken (dormant, 2014, 1 sub) | Top Jev score, but the name and probably the handle are taken. Also sounds like IndiGo airline |
| Spice Route Stories | 0.524 | taken 4x (food channels) | Out |

Not checked on YouTube (the vidIQ credits ran out): Chai Atlas 0.532 (Jev risk 0.50: sounds like food),
Ink & Atlas 0.529 (no India signal), Bhoomi Atlas, Sea Lanes Atlas, Curious Atlas.
Avoid Saffron and Lotus (Jev 20 Oct): both carry political meaning in India.

Same-format competitor seen during the search: "Borderline Atlas" (UCe0sehXcYbkXV0szjTpWs1g), 30-second satellite-map
Shorts, made Jul 2026.

## After AK picks
- AK renames the channel and handle in YouTube Studio (Customisation > Basic info). The 8 videos, views and subscribers
  stay. YouTube limits name changes to twice in 14 days.
- Agent work: redo the brand art (`src/brand`), the channel description and keywords, the watermark/end card in
  `src/geo/engine/GeoShort.tsx` and `src/geo/Siliguri.tsx`, and the kit folder `/Volumes/DarwinSSD/Monsoon Atlas/`.
  Videos already posted stay as they are (rule 8).

## Decision (25 Oct 2026)
AK picked **Indica Atlas**. AK checked that the name is free on YouTube. Done the same day: wordmark and banner
(`out/brand/indica_atlas_*.png`), the top tag on Shorts, channel copy, Week 1 metadata sign-off, and the kit folder
renamed to `/Volumes/DarwinSSD/Indica Atlas/`.

Source for the "Why Indica Atlas?" line: Arrian, *Indica* 5.3 (Greek text, Hercher-Eberhard 1885, read on Perseus,
doc 2008.01.0531) says Megasthenes met Sandracottus (Chandragupta). The title *Indica* for Megasthenes' own book is
attested by Clement of Alexandria, *Stromata* 1.15. That passage was not opened at the source on 25 Oct.

# Indica Atlas Week 4: research brief (14 Nov 2026)

Week 4 is built in the **Kanyakumari format** (the Reveal Loop, AK 13 Nov 2026: "the format works").
Read the Week 3 brief `/Volumes/DarwinSSD/MMVideo/docs/geo/week3/RESEARCH_BRIEF.md` and follow it exactly, including the SHORTS LITE MODE block at its top. Only these changes apply:
- Topics live in `/Volumes/DarwinSSD/MMVideo/docs/geo/week4/TOPICS.json`.
- Today is 14 Nov 2026.
- The output folder is `/Volumes/DarwinSSD/MMVideo/docs/geo/research/<id>/`.
- Gate: `python3 /Volumes/DarwinSSD/MMVideo/docs/inventors_desk/scripts/research_check.py <folder> --lite`.

## What the Kanyakumari format needs from research
The format is described in `docs/HANDOFF.md` section 3 and `docs/SHORTS_FORMAT.md` sections 1–3. Both are on git branch `origin/claude/laughing-babbage-w6mve9`. Read them with:
```
git -C /Volumes/DarwinSSD/MMVideo show 'origin/claude/laughing-babbage-w6mve9:docs/HANDOFF.md'
```
The benchmark script and its sources are in `docs/SHORTS_BENCHMARKS.md` on the same branch, under `ia-southtip`.

Add a section **"Reveal Loop material"** to dossier.md, with these items:
1. **The belief.** What a viewer learnt at school or assumes, in their own words, ending on "Right?". It must be a belief people really hold: cite where it appears, such as a textbook, an official page or a common quiz. If you cannot show the belief is common, say so.
2. **The turn.** The verified correction, in one line, with claim IDs.
3. **The camera move.** One continuous map move that shows the answer. The map engine uses shaded relief and Sentinel-2 imagery. **Maps draw no borders** (house rule): use pins, measured lines and true-scale outlines only. Give the coordinates and where they come from.
4. **One felt comparison.** A distance, size or count the viewer can feel, computed by us in method/ and labelled "our measurement". Example from the benchmark: "eleven times closer than Kanyakumari".
5. **One human detail**, from a primary source.
6. **Three loop-line candidates.** Each must run grammatically back into the opening line.
7. **The send line:** "People forward this because ____."
8. **The topic test**, Familiar / Hidden / Send: pass or fail for each, with one reason. If it fails, say so plainly. AK decides.

Every number needs a short source line that can sit on screen. Keep the "What a 9-beat 85-100 word Short could safely say" list from the Week 3 brief, as 8 beats and 65–100 words.

Report back as the Week 3 brief says, under 250 words, and add the topic-test result.

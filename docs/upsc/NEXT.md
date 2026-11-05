# UPSC series: work still to do (kept so nothing is dropped)

## Monsoon Part 1 video (GEO-07-P1), build stopped on 2 Nov 2026 night
Worktree `/Volumes/DarwinSSD/DataKadai/mmvideo-dk-upsc`, branch `datakadai/upsc-geo07` (nothing committed).
Done: script draft 4 (checked), storyboard (55 scenes, 10:28), all new scene kinds built, 60 fps engine, 2K test still,
own sound effects and cues, Indian islands kept on both map layers, contact sheets of every scene (`out/upsc/geo07-p1/sheet/sheet0-3.png`).
Left, in order:
1. Look at the four contact sheets and fix what is wrong (known: the title card shows the Babies "uncle", not the kid).
2. Render the silent draft: `npx remotion render src/index.ts LONG-geo07-p1-60 out/upsc/geo07-p1/draft_60fps_2k.mp4 --scale=1.3333333333333333 --crf=18`.
3. Add the effects: `.venv/bin/python scripts/upsc/long_sfx_upsc.py mix --video <draft> --out <draft_sfx>`.
4. Frame-check the render, then the young-viewer test and the meteorology reviewer (Gold gates E1, R1).
5. Voice only after those, with the English voice AK picks.

## AK's decisions waiting
English voice (MiniMax or Google Iapetus) · channel and name · the kid's look and name (only if recurring) · demand check (vidIQ).

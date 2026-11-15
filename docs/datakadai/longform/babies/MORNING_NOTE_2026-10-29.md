# Morning note: 29 Oct 2026 (written 00:10 IST, for AK)

Nothing is posted, nothing is voiced, nothing is committed. Everything below is on the Mac Mini and the SSD.

## What AK needs to decide or do (in this order)

1. **Read the script changes.** `CLAIMS.md` (63 claims: 30 confirmed, 27 corrected, 6 unverified) and `SCRIPT_VERIFIED.md` (the narration with corrections applied). The wording changed in many places on purpose: no "released this June", no "today it's 2.7", "went up" only for changes of 0.3 or more. No voice is made until AK signs this off.
2. **Remotion licence.** The research found Remotion is free only for up to 3 people (contractors included). At 4 or more, a Company License is needed. Which is the channel?
3. **India map data.** Our outline (`public/datayt/india/geo.json`, built from DataMeet) has an unclear licence (see `docs/datakadai/looks/CARTOON_RESEARCH.md`, section 4). Options: pin the commit and use only the state layers, redraw from a clear source, or ask Survey of India.
4. **Mascot look.** The "uncle" host (mustache, glasses, blue vest) is a proposal. It is AK's taste call.
5. **Voice.** MiniMax runs 06:45-22:10 IST only. After sign-off, the voice step is: voice each scene, measure word times, rebuild the timeline (`scripts/datayt/long_timeline.py --words ...`), render.

## Where things are

| What | Where |
|---|---|
| Cartoon Short pilot (cola war, cw01) | `src/looks/cartoon/`, composition `DATA-cw01-look-cartoon`, review stills `out/looks/cartoon/` |
| Mouth sync (real Rhubarb, MIT) | `scripts/datayt/rhubarb_cues.py`; binary at `research/2026-10-28-cartoon/rhubarb/` (needs Rosetta, now installed); stand-in `mouth_cues.py` |
| GitHub/open-source research | `docs/datakadai/looks/CARTOON_RESEARCH.md` (also `research/2026-10-28-cartoon/verified.json`) |
| Babies long-form engine and scenes | `src/looks/cartoon/long/` (contract: `CONTRACT.md`, scenes in `scenes/`, compositions `LONG-scene` and `LONG-babies-cartoon`) |
| Verified figures | `public/datayt/long/babies/figures.json` |
| Storyboard | `public/datayt/long/babies/storyboard.json`, `STORYBOARD.md` (100 scenes, 1,432 words, about 10 min; validator 0 errors) |
| Tools | `scripts/datayt/long_validate.py`, `long_timeline.py` |
| Voice comparison | `research/2026-10-28-voices/` (21 blind clips waiting for AK to listen) |
| District research | `research/2026-10-28-districts/DISTRICT_RESEARCH.md` |

## Still running when this was written

- **Babies workflow** `wf_e249fcbc-f1b`: the storyboard revision (after the Story Engine critic).
- **Premium looks workflow** `wf_fbee117c-b23` (resumed 28 Oct): one fixer and the final step (Slab, Counter, Dispatch fixes, Indica Atlas demo, comparison sheets).
- If the 5-hour plan window fills (resets about 03:30 IST) an agent can stall. Resume with `Workflow({scriptPath, resumeFromRunId})`; scripts are in `~/.claude/projects/-Volumes-DarwinSSD-DataKadai-mmvideo-dk/<session>/workflows/scripts/`.

## Known problems to fix before a draft video

- **Duplicated scene versions.** Waking running builders by message started second copies, so these exist twice: stage (`stage.tsx` and `stage_b.tsx`), cast (`cast_people/cast_kit` and `cast_b*`/`cast_kids/men/uncle/women`), replacement and tfr-line (`*_a` files follow the contract), scatter (`scatter.tsx`, `scatter_v2.tsx`), map, slope and multiples. Render each pair, keep the better, delete the rest.
- **CONTRACT.md differs from what was built** for the map (`fillKey`, `missing`, `lists.lowKey/highKey`) and stage (`badges[].decimals`, anchors: badge x,y = centre, pill x,y = top-left, bubble x,y = tail tip). Update the contract to the built fields, then re-run `long_validate.py`.
- `figures.json` has no NFHS-3 value for India yet, so a tfr-line point for NFHS-3 throws until a verified value is added.
- Teacher character skin and hair are low contrast; the uncle's cheer grin is half hidden by the moustache.
- Nothing has been run through the full `LongCartoon` engine yet, only one scene at a time.
- The six UNVERIFIED claims in `CLAIMS.md` must not be spoken until read at the source.

## Rules that still apply

Never publish; primary sources only; never print a key; AI-voice disclosure ("Altered or synthetic content: Yes"); no share-price charts or advice; Manipur drawn blank with "not in NFHS-6 release".

## Update 00:20 IST: premium looks build finished (Slab, Counter, Dispatch)

All three looks are built and rendered for gd01 (gold) and cw01 (cola) as full videos with narration. Nothing is committed (branch `datakadai/premium-looks`).
- **Videos:** `out/looks/{slab,counter,dispatch}/{gd01,cw01}.mp4` (six files, 33.4 s each).
- **Side by side:** `out/looks/compare_gd01.png` and `out/looks/compare_cw01.png` (rows are beats, columns are Slab, Counter, Dispatch).
- **Indica Atlas demo (same code, other brand tokens):** `out/looks/indica/BRAND-DEMO_not-for-posting__gd01__overview.png`. Pixel check: 0 px of Data Kadai colours in the nine Indica stills.
- **Number lock check:** the number is never visible before its spoken word (36 of 36 frames clean, gold source label "WGC estimate, as reported" printed every time). **One caveat:** the independent reviewer found some locks land late (up to about 4.6 frames) for words starting with f or s, such as "fifteen". Late, never early. The Slab streak reels also show how many digits a number has before it is said.
- **Open items before any look ships:** gd01 must not ship until the WGC household figure is confirmed; the cw01 end note "Shares are of all soft drinks" sits badly with the Jan-Sep 2025 caveat; Counter's end cards leave the lower half empty; Dispatch end cards show a faint ghost "3x"; the source wording for cw01 is typed in three places that disagree (move it to the config's `look_opts.beatSources`).
- AK still has to choose which look (or none) per story, and sign off the six look fonts (PREFERENCES.md names Oswald and Inter).

## Update 01:00 IST: the babies cartoon draft video exists

- **Draft video (silent, with draft captions, estimated timing):** `out/long/babies/draft_v1_silent_captions.mp4`, 10:01, 1920x1080, 174 MB. No voice, no music.
- **Per-scene stills and contact sheets:** `out/long/babies/stills/` and `out/long/babies/sheet0.jpg` to `sheet4.jpg` (20 scenes per sheet).
- **Storyboard (final, revised after the Story Engine critic):** 98 scenes, 1,432 words, `public/datayt/long/babies/storyboard.json` and `STORYBOARD.md`; timeline `timeline.json` (estimated). Validator: 0 errors, 29 field-name warnings (documented in `CONTRACT.md`, "As built").
- **Wins and alternates:** live set is `stage.tsx`, `cast.tsx` (cast_people), `scatter.tsx`, and the contract-shaped `replacement.tsx` and `tfrLine.tsx`. The other copies are kept (`stage_b.tsx`, `cast_b*.tsx`, `scatter_v2.tsx`, `_alt/`). I did not compare them side by side; the live ones render cleanly.
- **Title decision (AK):** the figure check suggests "India's Fertility Rate Is Below 2.1. Here's the Map." because the rate is 2.0 and "running out of babies" claims more than the data shows.
- **What to look at first when you watch it:** (1) 52 of 98 scenes are the uncle on one of seven sets: repetitive; (2) single-state small-multiples scenes (Kerala, Tamil Nadu) are sparse; (3) the draft caption strip covers some art (draft only); (4) timing is estimated, so reveals may be a little off until the voice is measured.
- **Next after script sign-off:** voice each scene (MiniMax, 06:45-22:10 IST), measure word times, `long_timeline.py --words`, re-render, add music at -16 LUFS and SFX, burn off the captions and make an SRT.

## Update 29 Oct, daytime: voiced with MiniMax (AK picked D)

- **Voice:** all 98 scenes voiced with MiniMax `English_Diligent_Man` (AK, 29 Oct: "Use D"). 541.8 s of speech, `public/datayt/long/babies/vo/` (one mp3 per scene, `manifest.json`). Script: `scripts/datayt/long_voice.py` (`voice`, `words`, `mix`, `srt`).
- **Script change made without a line-by-line sign-off:** scene s098 no longer says "Every number is in the Data Receipt below" (claim C53, unverified). It now says only "There is a new India map on Data Kadai to look at next." The six UNVERIFIED claims are not in the narration. Before the voice: `storyboard.before-voice.json`; estimated timeline: `timeline.estimated.json`.
- **Timing:** measured with whisper (word times per scene, `word_times.json`); `long_timeline.py --words` gave 98 scenes, 17,782 frames (9:53), 129 reveals, all inside their scenes. Whisper dropped the start of three lines (s061, s069, s084) when given the script as a prompt; the script now retries without it.
- **Audio:** `vo/narration.wav` is the scenes placed on the timeline, normalised to about -16.7 LUFS, true peak -1.5 dB. No music yet (AK's pick; see the free-BGM findings in the chat: YouTube Audio Library is the one YouTube says is not claimed).
- **Outputs:** `out/long/babies/babies_final_v2.mp4` (9:52.8, 1920x1080, 365 MB, draft caption strip off, voice in; audio -16.7 LUFS; number reveals checked against the voice at four scenes), `out/long/babies/babies_english.srt` (168 cues, spoken form with numbers in words).
- **Still AK's:** read the script (CLAIMS.md, SCRIPT_VERIFIED.md), title, Remotion headcount licence, map-data route, mascot look, music pick. Not posted, not pushed. Disclosure: set "Altered or synthetic content: Yes".
- **Fix before v2:** in nine scenes (s001, s002, s025, s027, s031, s038, s062, s070, s074) the number card sat over the Data Kadai logo, top right. The cards were moved down in `storyboard.json` (y only). All 98 scenes were then looked at on contact sheets (`out/long/babies/final_check/final_sheet0-4.png`).
- **Known and left as is:** the draft is repetitive (the uncle on a few sets) and the single-state line-chart scenes (Kerala, Tamil Nadu, Meghalaya) are sparse. No music; the end card has an empty frame for YouTube's end-screen elements.

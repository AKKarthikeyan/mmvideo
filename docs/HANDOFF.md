# Handoff: Shorts work, 10–13 Nov 2026

For the next Claude session (or person) picking this up. Read this first, then `CLAUDE.md` and `README.md`.

## 1. Where everything is

- **Repo:** `AKKarthikeyan/mmvideo`. **Branch:** `claude/laughing-babbage-w6mve9`.
- **In `main` already** (PR #4, merged): the Shorts rules, the Reveal Loop format, the 5,538-Shorts study, the fact-check
  of the Gemini report, and three benchmark Shorts (`ia-southtip`, `um-parisiman`, `ma-tsmc`).
- **On the branch only, no PR yet** (seven commits ahead of `main`): six more Indica Atlas Shorts, the map engine, upload
  kits, both new looks, the trend desk, the research documents and this handoff.
- **Not in git, by design:** rendered videos, upload kits and trend sheets (`out/`). AK has them as chat downloads; the
  full set is one zip, `mmvideo-shorts-all-2026-11-12.zip`. They can be rebuilt from the repo, but the synthetic voice
  is recorded afresh and will differ slightly.

## 2. What AK has decided

| Date | Decision |
| --- | --- |
| 13 Nov 2026 | **The Kanyakumari format works.** Make more Shorts this way (section 3). AK gave no numbers in the session; ask for the view counts and record them here. |
| 11 Nov 2026 | **Channel rule:** companies and business go to Moat & Margin; other data stories go to Data Kadai. |
| 11 Nov 2026 | The cut-out cartoon look is good for Moat & Margin as well as Data Kadai. |
| 10 Nov 2026 | Hindi voice is **Maya**, a voice on AK's own machine. The cloud cannot reach it. |
| 10 Nov 2026 | AK wants every Short to reach 1M views. No rule set can promise that; the rules aim to raise the hit rate, and AK has been told so. |

## 3. The Kanyakumari format (`hyperframes/shorts/ia-southtip`)

"Kanyakumari is NOT India's southern tip": Indica Atlas, series "Not Where You Think", 30.6 s, 8 beats, 89 words.
Script, sources and numbers: `docs/SHORTS_BENCHMARKS.md`.

What the format is, so the next one can be built the same way:

1. **A belief everyone learnt at school**, said the way the viewer believes it, ending on "Right?".
2. **"Not quite."** One short line turns it.
3. **A real map, and the camera travels to the true answer** in one move: shaded relief, a pin, a measured line. No
   slide change, no borders drawn.
4. **One comparison that makes the distance felt** ("eleven times closer than Kanyakumari").
5. **One human detail** from a primary source (the 2004 earthquake, the lighthouse still standing).
6. **A loop line** that runs into the first line; the last frame is the first frame.
7. **Every number has its source on screen**; anything we measured says "our measurement".

The three Indica Atlas Shorts built after it use the same recipe and the same map engine
(`hyperframes/shared/lib/atlas.js`): `ia-sunrise`, `ia-capitals`, `ia-coastline`, each in English and Hindi.

## 4. What is built

| Short | Channel | Look | State |
| --- | --- | --- | --- |
| `ia-southtip` | Indica Atlas | Map dive | Benchmark. English only. AK says the format works. |
| `ia-sunrise`, `ia-capitals`, `ia-coastline` (+ `-hi`) | Indica Atlas | Map dive | Built, with upload kits. Hindi uses a stand-in voice. |
| `um-parisiman` | UPSC Mains (Hindi) | 3D seat map | Benchmark. Stand-in Hindi voice. |
| `ma-tsmc` | Moat Atlas | Satellite before/after | Benchmark. |
| `mm-hundred` | Moat & Margin | Cut-out cartoon | Pilot. One voice pitched two ways; needs two real voices. |
| `dk-pocket` | Data Kadai | Paper desk | Pilot. |

Tools: `hyperframes/tools/shorts_build.py` (scripts, voice, timings, mux, kits), `hyperframes/tools/shorts_kits.py`
(titles, descriptions, sources), `scripts/shorts_check.py` (the gate), `scripts/trend_desk.py` (morning trend sweep),
`hyperframes/shared/lib/` (`shorts.js`, `atlas.js`, `paper.js`).

Documents: `docs/SHORTS_RULES.md`, `SHORTS_FORMAT.md`, `SHORTS_BENCHMARKS.md`, `SHORTS_STUDY.md`,
`SHORTS_FACTCHECK.md`, `PREMIUM_LOOKS_AND_TRENDS.md`, `DATA_KADAI_FORMATS.md`.

## 5. How to build a Short

```sh
python3 hyperframes/tools/shorts_build.py story <id>     # voice the beats, write story.js and check.json
python3 hyperframes/tools/shorts_build.py verify <id>    # transcribe the voice; compare with the script
python3 hyperframes/tools/shorts_build.py check <id>     # the Shorts gate: fix every FAIL before rendering
python3 hyperframes/tools/hf.py sync <id>
python3 hyperframes/tools/hf.py check <id>               # layout and contrast
python3 hyperframes/tools/hf.py snap <id> 0.1,5,10       # stills, to look at before rendering
python3 hyperframes/tools/hf.py render <id>              # silent picture, 3-20 minutes
python3 hyperframes/tools/shorts_build.py mux <id>       # adds the voice -> out/hyperframes/<id>-final.mp4
python3 hyperframes/tools/shorts_build.py kit <id>       # upload kit -> out/hyperframes/kit/<id>/
```

- A new Short needs: a script in `S[...]` in `shorts_build.py`, a page at `hyperframes/shorts/<id>/index.html`, and a
  kit in `KITS[...]` in `shorts_kits.py`. Copy the nearest existing Short.
- Hang every picture change on a named cue (`Q("cue")`), so one page serves every language.
- A Hindi version is a second script with `base="<english id>"`.
- **Voice key:** set `MINIMAX_API_KEY` on a local machine. In the cloud environment the key is added by the proxy; never
  ask AK to paste a key into chat. `--no-tts` builds with estimated timings.
- **Maya (Hindi) on AK's machine:** `SHORTS_TTS_CMD_HI='<maya command> --text-file {text} --out {out}'`, or record one
  file per beat and pass `--clips <folder>`. Details in `docs/SHORTS_BENCHMARKS.md`.

## 6. Open items, in the order I would take them

1. **More Shorts in the Kanyakumari format** for Indica Atlas, English and Hindi. Topic ideas are in
   `docs/SHORTS_FORMAT.md` ("Not Where You Think"). Verify every number against a primary source first.
2. **Re-voice the Hindi Shorts with Maya** on AK's machine, and have a native speaker listen. Claude cannot hear audio;
   so far the voice has been checked only by transcription.
3. **Record two real voices for `mm-hundred`** before it is published.
4. **Data Kadai pilots** from `docs/DATA_KADAI_FORMATS.md`, section 5: guess first with the viewer's state lighting up;
   a state as big as a country; data you can hear.
5. **Look C, the 3D toy world**, for The Inventor Desk. Not started.
6. **Rule O5 in `docs/SHORTS_RULES.md`** says no price data from the last three months. A reported May 2026 SEBI
   circular with a 30-day lag is unverified. Check SEBI's site and update the rule.
7. **Open a PR** for this branch when AK asks. Do not open one unasked.
8. `darwin-research` has one commit on the same branch name (a note on `contentengine/templates/short_video_script.md`),
   also without a PR.

## 7. Things that will trip you up

- **Honesty with AK:** say plainly what was not checked. Do not claim a video sounds right.
- **YouTube downloads are blocked** from the cloud by a bot check. Do not work around it. Titles, statistics and
  thumbnails are available.
- **vidIQ credits:** about 70 left until 30 Nov 2026; five per call.
- **The synthetic voice sometimes misreads a beat** (a line said twice, trailing words dropped). Always run `verify`.
- **If a script line is reworded,** check the cue phrases still exist in it, or the page will not load.
- **The trend desk** cannot read Reddit from the cloud (HTTP 429) and matches Indian-language trends only through a
  short keyword list.
- **Maps draw no borders.** Keep it that way.

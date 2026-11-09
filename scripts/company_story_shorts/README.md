# Company-story Shorts (Vox-style, built in code)

30-second vertical (1080x1920, 30 fps) explainer on one company's breakout moment: paper texture, cut-out sprites,
highlighter swipes, hand-drawn circles, stamps, counters and a constant forward camera push. Pure Python (PIL, numpy)
piped into ffmpeg; the music bed is synthesised, so no audio files are needed.

Pilot episode: the original iPhone (Jan 9 to Jun 29, 2007; one billion sold by July 2016).

## Run
```
cd scripts/company_story_shorts
python3 render2.py out.mp4                 # full render, about 2 minutes
python3 render2.py out 205,365,520,690     # preview PNGs for those frame numbers
PHOTO_DIR=/path/to/photos python3 render2.py out.mp4
```
`render.py` is the engine (helpers and the v1 scenes). `render2.py` is the iPhone episode: scenes, timings, captions, audio cues.
A new episode is a new scene list plus captions.

## Real photos
Drop `rivals.jpg`, `macworld.jpg`, `queue.jpg` into `photos/` (or `PHOTO_DIR`). Missing photos fall back to drawn illustrations.
Fill `photos/credits.csv` (copy from `credits.example.csv`): `key,Photo: author / licence / source`. The credit prints under each photo.
Only use photos whose licence you have checked (public domain or CC BY / CC BY-SA, with credit). Photo files are not committed.

## Repo rules to remember
- Every on-screen number needs its source on screen (done via the `src()` line). Anything illustrative must be labelled as such
  before publishing: the generic phone drawings are illustrations, not product photos.
- Renders (`*.mp4`) and audio stay out of git (see `.gitignore`).

The story list lives in `docs/company_stories/100_global_company_stories.xlsx`.

## Voice-over (both channel pilots)
`voice_shorts.py` holds each Short's narration as beats (design window, words to say, caption). It voices every beat, then
writes `hyperframes/videos/<id>/vo.js`: the page bends its 40 s design timeline to the voice, so each visual lands under its
line and each caption shows while its words are spoken. The page's `data-duration` is updated to the voiced length.
```
python3 scripts/company_story_shorts/voice_shorts.py voice                 # MiniMax channel voice (needs MINIMAX_API_KEY)
python3 scripts/company_story_shorts/voice_shorts.py voice --engine local  # Kokoro draft voice, offline
python3 hyperframes/tools/hf.py sync mm-asianpaints ma-asml && python3 hyperframes/tools/hf.py render mm-asianpaints ma-asml
python3 scripts/company_story_shorts/voice_shorts.py mix                   # voice + ducked music bed -> out/hyperframes/<id>_final.mp4
```
Edit a line's words in `VIDEOS`, re-run `voice` (only changed lines are re-voiced), render, mix. Keep captions short (two lines).

## Channel pilots (HyperFrames)
The Moat & Margin and Moat Atlas pilots are HyperFrames projects: `hyperframes/videos/mm-asianpaints` and
`hyperframes/videos/ma-asml` (see `hyperframes/README.md`). Render, then add the draft music bed:
```
python3 hyperframes/tools/hf.py sync mm-asianpaints ma-asml
python3 hyperframes/tools/hf.py render mm-asianpaints ma-asml
python3 scripts/company_story_shorts/music_bed.py out/hyperframes/mm-asianpaints.mp4 out/hyperframes/mm-asianpaints_music.mp4 warm 4.6,17.1,20.7,28.5,35.3 29.5
python3 scripts/company_story_shorts/music_bed.py out/hyperframes/ma-asml.mp4 out/hyperframes/ma-asml_music.mp4 night 4.8,15.2,21.0,26.4,30.2,35.6 "" 11.0,13.6,18.9
```

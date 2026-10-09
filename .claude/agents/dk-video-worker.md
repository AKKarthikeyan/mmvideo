---
name: dk-video-worker
description: Data Kadai video worker (Sonnet). Turns one queued story into a finished draft Short — writes its config, builds data and music, renders it, checks frames, and checks the captions. Use for the "video" step of the daily Data Kadai routine.
model: sonnet
tools: Read, Grep, Glob, Bash, Edit, Write
---

You make ONE Data Kadai Short per run, as a **draft**. Never publish.

1. Take the story given (id, indicator, answer, decoys, side, hook) from `docs/datakadai/ops/QUEUE.md`. If
   `public/datayt/shorts/configs/<id>.json` doesn't exist, write it in the same shape as the `SHORTS` entries in
   `scripts/datayt/build_india_shorts.py` (keys: id, ind, answer, decoys, side, hook, q, optional states_only).
2. Run `python3 scripts/datayt/build_india_shorts.py <id>`. It asserts the #1 claim against the data; if the assert
   fails, **fix the story** (reword, use `states_only`, or pick another answer) — never the data.
   Narration: the build voices every section with the local Kokoro male voice (`scripts/datayt/voice_dk.py`,
   default am_michael; needs `pip install kokoro-onnx soundfile`, model downloads once to ~/.cache). Section lengths
   grow by whole bars to fit each line. Check the `vo` lines in data.json read naturally and say the same numbers as
   the screen; a story can override a line with `"vo": {"hold": "..."}`.
3. Render check stills: `npx remotion still src/index.ts DATA-<id> out/datakadai/check/<id>_<f>.png --frame=<f>` for
   the hook, quiz, reveal and top-5 frames. Look at each one: text clipped, overlaps, wrong highlight, unreadable.
4. Run `python3 scripts/datayt/post_pack.py <id> <date>` (renders short.mp4, ig.png, x.png, captions.md).
5. Read both copies of captions.md (`out/datakadai/daily/<date>/<id>/` and `docs/datakadai/posts/<date>-<id>.md`):
   English only (no Tamil until AK says so), numbers identical to data.json, the YouTube text must not reveal the answer.
6. Commit the config, data.json and posts record on the current branch (not the media files, which are git-ignored).

Report in under 150 words: id, answer and value vs India, files, checks run, anything that looked off.
Rules: official data only, small-sample cells never ranked, official India map only, neutral wording.

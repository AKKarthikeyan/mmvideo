# Indica Atlas Week 4: build brief for one Short, in the Kanyakumari format (14 Nov 2026)

You build ONE English Short in the Kanyakumari format (the HyperFrames Reveal Loop) from a CLEARED research folder.
- Never publish, upload or post anything.
- Never print an API key.
- AK says: use tokens wisely. Read only what you need, never re-read, and don't render more than twice.

## Setup (already done)
- **Worktree:** `/Volumes/DarwinSSD/MMVideo-week4`, branch `indica-atlas-week4`. Run every command from there.
- **Shell:** run each command through a login shell, so the voice key loads:
  ```
  zsh -lc 'cd /Volumes/DarwinSSD/MMVideo-week4 && export PATH="$PWD/.bin:$PWD/.venv/bin:$PATH" && <command>'
  ```
  `python` is then the project venv (numpy, Pillow, requests), and `ffmpeg` is a full build.
- **Your names:** `<id>` is `ia-<name>` (e.g. `ia-ganga`), and `<folder>` is the research folder `/Volumes/DarwinSSD/MMVideo/docs/geo/research/<folder>/`.

## Read first (only these)
1. `docs/HANDOFF.md`, sections 3, 5 and 7: the recipe, the commands and the traps.
2. `docs/SHORTS_FORMAT.md`, sections 1-4: the beat sheet, script rules and picture rules.
3. The benchmark, Kanyakumari:
   - its `S["ia-southtip"]` entry in `hyperframes/tools/shorts_build.py`
   - `hyperframes/shorts/ia-southtip/index.html`
   - its `KITS["ia-southtip"]` entry in `hyperframes/tools/shorts_kits.py`
   - For a newer page built on the map engine `hyperframes/shared/lib/atlas.js`, read `hyperframes/shorts/ia-capitals/index.html`.
4. Your research folder:
   - dossier.md: the sections "Reveal Loop material" and "What a … Short could safely say"
   - verify.md: apply every wording fix
   - open_questions.md: the wording risks

## Files you write (only these)
- `hyperframes/shorts/<id>/script.py`: `S["<id>"] = dict(...)`, in the same shape as `S["ia-southtip"]`, with `channel="Indica Atlas"`, `lang="en-IN"` and `series="Not Where You Think"` (or the series the dossier suggests). Put a `# C0xx` claim-ID comment on every beat. The loader in shorts_build.py picks the file up.
- `hyperframes/shorts/<id>/kit.py`: `KITS["<id>"] = dict(...)`, in the same shape as `KITS["ia-southtip"]`. Use the source lines from the claims, with URLs from sources.jsonl. The constants `TERRAIN` and `VOICE_EN` are available.
- `hyperframes/shorts/<id>/index.html` and `hyperframes/shorts/<id>/assets/img/*`: copy the nearest existing Short and adapt it.
  - Base maps for new places: `python hyperframes/tools/atlas_base.py <z> <lon0> <lat0> <lon1> <lat1> <out.jpg>`. Write them into your own `assets/img/`, never `shared/`.
- Do NOT edit `shared/`, `tools/`, other Shorts, `docs/` or the research folder.

## The script (most important)
- Follow the recipe:
  1. the belief, said as the viewer believes it, ending "Right?"
  2. "Not quite."
  3. one continuous camera move to the answer
  4. one felt comparison
  5. one human detail
  6. a loop line that runs into line 1
- Length: 24-38 s and 65-100 words, with a new picture every 2-3 s, each hung on a spoken cue `Q("cue")`.
- Facts: only claims that passed G6. Hedges stay. Anything we computed says "our measurement" on screen. Each beat shows a small source line.
- **Maps draw no borders**: use pins, measured lines and true-scale outlines only.
- If the dossier says the belief is not shown to be common, word the hook as a question the viewer might hold ("Is this…?") rather than claiming "everyone learnt".

## Commands (HANDOFF section 5)
1. `story <id>`
2. `check <id>`: fix every FAIL.
3. `hf.py sync <id>`
4. `hf.py check <id>`: fix errors. Small kicker-text warnings are known from the benchmark.
5. `hf.py snap <id> 1,8,16,24`: Read the contact sheet once and fix overlaps and cut-off text.
6. `hf.py render <id>`: about 1 minute.
7. `mux <id>`
8. `kit <id>`

`verify` needs faster-whisper, which is not installed, so skip it and say so in your report.

## Report (under 120 words)
- title, length, words
- claim IDs
- wording risks AK should check
- anything not done
- path of `out/hyperframes/<id>-final.mp4`

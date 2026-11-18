# Handover to the Mac Mini (18 Nov 2026)

**Read this first if you are a Claude session on the Mac Mini.** A cloud session did the planning, data and style work on
18 Nov 2026. AK has moved production to the **Mac Mini**: it runs on a different Claude account from the cloud session,
so you have no memory of that work. Everything you need is in this repo; this file is the map.

## The rules AK set (all in CLAUDE.md)
- **All video production lives on the Mac Mini only**: renders, voice, installs, media files, past and future. Not the
  MacBook Air, not cloud sessions. Always name the machine ("Mac Mini" or "MacBook Air"); never write just "Mac".
- AK does not want to run commands or search for steps. **Do the setup and the work yourself**; ask AK only for
  decisions and for secrets (the MiniMax key).
- Every number comes from a source on screen; computed numbers say "our arithmetic"; illustrations say "illustration".
- No music under narration (AK, 18 Nov). Voice each act as a few paragraphs, so the intonation flows.

## Step 1: set up the Mac Mini (once, in this order)
1. `git status`: if there are uncommitted changes, stop and ask AK. Then fetch and merge branch
   `claude/eloquent-allen-3y4ph4` from origin into the current branch. It holds all of the 18 Nov work.
2. Homebrew (https://brew.sh) if missing. Then `scripts/manim/setup_mac.sh`: Homebrew Python 3.12, cairo, pango and ffmpeg,
   plus a venv `~/.venvs/manim` with Manim. **macOS's own python3 is 3.9 and too old for Manim.**
3. Node 22+ (`brew install node`), needed by HyperFrames (`npx hyperframes@0.8.202`).
4. Python packages for the pipeline: `numpy pandas pyarrow requests pillow faster-whisper`. Use a venv, e.g.
   `~/.venvs/mmvideo`, if the system Python refuses.
5. **MiniMax key**: the voice and image scripts read `MINIMAX_API_KEY`. Ask AK for it; never write it into the repo.
   Put it in his shell profile, or in a file outside the repo that the shell loads.
6. Media from the cloud session: `mmvideo_media_2026-11-18.zip` (AK has it; likely in Downloads). Unzip it **inside** the
   repo folder; its `README.txt` says where each file lands under `out/`. It is optional: everything in it can be rebuilt,
   but the voice files save re-voicing.
7. Checks, then report to AK what passed and what failed:
   - `~/.venvs/manim/bin/manim -qh --fps 30 scripts/manim/compounding.py Compounding` renders (12.7 s)
   - `python3 hyperframes/tools/hf.py sync`, then `python3 hyperframes/tools/hf.py render s16-lottie`, renders the Lottie tick
   - `python3 scripts/india_ledger_gold.py` prints the gold numbers. It needs `out/hyperframes/cache/export-import.parquet`:
     download it from `https://github.com/Vonter/india-export-import/releases/latest/download/export-import.parquet`
   - `python3 hyperframes/tools/il_act1_build.py` voices Act 1 (or reuses the zip's voice files), then `hf.py render
     il-gold-act1` and `il_act1_build.py mux` give `out/hyperframes/il-gold-act1-final.mp4`

## Where things stand

| Area | State | Files |
| --- | --- | --- |
| Channel | **Data Kadai renamed India Ledger**, handle @IndiaLedgerOfficial, national audience (Hindi tracks first, then Tamil) | `docs/INDIA_LEDGER_PLAN.md`, `docs/INDIA_LEDGER_FACTCHECK.md` |
| Gold episode, data | 29 data points with status and source; D3 confirmed by AK; D11 (bond cost, ≈ ₹1.06 lakh crore) is a bond-by-bond model | `docs/INDIA_LEDGER_WEEK1.md` section 2, `scripts/india_ledger_gold.py`, `data/india_ledger/` |
| Gold episode, script | Full 10-minute script with humour; Act 1 rewritten for paragraph voicing | `docs/INDIA_LEDGER_EP1_SCRIPT.md` |
| Gold episode, picture | **Act 1 built and approved as the style** ("Ledger" look: ruled paper, ledger-row lower thirds, running tab, audit stamp); voiced in 5 paragraphs, no music, 55.6 s | `hyperframes/videos/il-gold-act1/`, `hyperframes/tools/il_act1_build.py` |
| Gold posters | 10-slide carousel (1080×1350) and Community posts (1080×1080) | `scripts/india_ledger_posters.py` (renders to `out/india_ledger/posters/`) |
| Tools | Motion-design skill installed (`.claude/skills/motion-design`); lottie-web sample `s16-lottie`; Manim trial; Tweakpane and three.quarks in `hyperframes/shared/vendor/` | `docs/TOOLS_RADAR.md` |

## Step 2: finish the gold video (after AK says go)
1. Re-run `scripts/india_ledger_gold.py` with RBI's latest SGB redemption price (`PRICE_TODAY`, `TODAY`). Every ⟳
   figure in the script changes with it.
2. Clear the remaining VERIFY items in `docs/INDIA_LEDGER_WEEK1.md`: D21 (DGCIS country = origin or consignment?),
   D22 (gold loans, from the RBI release itself), D23 (gold flat 2012–18, from RBI DBIE or IBJA), and the population
   behind "₹730 per Indian". Cut any line you cannot verify.
3. Build Acts 2–5 the way Act 1 is built: copy `il-gold-act1` to a new video folder per act (or extend it into one
   project), add the act's paragraphs to a builder like `il_act1_build.py`, take every number from
   `india_ledger_gold.py`, and use the HyperFrames samples named in the script (s03 document, s04 money, s05 dots,
   s07 flow map, s11 timeline, s12 scale). Run `hf.py check` (0 errors) and look at `hf.py snap` stills before each render.
4. Voice: `il_act1_build.py verify` transcribes the track; every script word must be heard. AK listens before publishing.
5. Shorts 1 and 2 of the week (scripts in `docs/INDIA_LEDGER_WEEK1.md` section 4) as Reveal Loops in
   `hyperframes/shorts/`, built with `hyperframes/tools/shorts_build.py`; `scripts/shorts_check.py <id>` with no FAIL.

## Decisions still open for AK
- Channel accent colour: ledger green (`#0e7c66`, used in Act 1) or another? The posters use gold; re-render them if
  green is confirmed (`scripts/india_ledger_posters.py`, colour constants at the top).
- Narrator: AK's own voice for long videos? If so, WhisperX word timings replace the TTS timestamps (`docs/TOOLS_RADAR.md`).
- A fourth Shorts series for episode Shorts ("Doesn't Add Up"), or run them unlabelled; keep or swap the buffalo-meat Short.
- What **The Inner Chariot** channel is about (not in this repo yet).
- Remotion licence: free only for companies of up to 3 people. Check headcount.

# MMVideo

Moat & Margin's video engine (Remotion 4): YouTube long videos, Shorts, thumbnails and Instagram carousels.

**This repo is the only home for engine code** (AK, 1 Oct 2026). Edit and commit here. Do not keep copies of these
files in other repos. Upload packages and strategy notes live in `darwin-research`
(`contentengine/youtube/letters_video/` for the Moat Files / Letter series; the daily-filings packages are in `out/vx/`).

| Area | Files |
| --- | --- |
| Daily-filings videos (Vox engine) | `src/vx/VoxEngine.tsx`, `src/vx/Videos.tsx`, `scripts/vx_scripts.py`, `scripts/build_vx.py` |
| Letters and Moat Files (Case engine) | `src/vx/LetterVideos.tsx`, `src/vx/CaseEngine.tsx`, `src/vx/scenes/`, `scripts/vx_letters.py`, `scripts/build_vx_letters.py`, `scripts/qa_vx.py`, `scripts/render_vx_letters.sh` |
| Regional audio tracks (Tamil, Hindi; English stays original) | `scripts/audio_tracks.py`, `scripts/translations/`, `docs/AUDIO_TRACKS.md` |
| Structure check and source ledger, run before rendering a long video (spec: `~/mm-content/contentengine/youtube/STRUCTURE.md`) | `scripts/structure_check.py`, `scripts/ledger/<id>.csv` |
| Flow Build (one diagram that builds with the narration; 5 skins: navyred, ivorygold, flatvector, sketch, iso) | `src/flow/FlowBuild.tsx`, `src/flow/icons.ts`, `scripts/flow_scripts.py`, `scripts/build_flow.py`, `public/flow/<id>/` |
| Carousels | `src/carousel/`, `public/carousel/<id>/carousel.json` |
| Shorts and Reels rules, all channels (and the gate that checks a built Short) | `docs/SHORTS_FORMAT.md` (the Reveal Loop), `docs/SHORTS_BENCHMARKS.md` and `hyperframes/shorts/` (three benchmark Shorts), `docs/SHORTS_RULES.md`, `docs/SHORTS_STUDY.md`, `docs/SHORTS_FACTCHECK.md`, `scripts/shorts_check.py`, `scripts/shorts_study/` |
| India Ledger growth plan (draft for AK) and the fact-check of the playbook behind it | `docs/INDIA_LEDGER_PLAN.md`, `docs/INDIA_LEDGER_FACTCHECK.md`, `docs/INDIA_LEDGER_WEEK1.md` (week of 19 Nov: gold), `docs/INDIA_LEDGER_EP1_SCRIPT.md` (episode 1 script), `scripts/india_ledger_gold.py` (its numbers) |
| Tools radar: outside AI-video tools checked against our stack, by channel | `docs/TOOLS_RADAR.md` |
| Production agents: eight roles from research to analytics, one folder per film | `agents/README.md`, `agents/contracts/`, `.claude/agents/mm-*.md`, `productions/_template/` |
| Director: how a script becomes a film (treatment, animatic, sound, review) | `docs/DIRECTOR.md`, research in `docs/DIRECTION_RESEARCH.md` |
| Lemo-Opuscar: 20 code-made film styles kept on the SSD, by channel | `docs/OPUSCAR_STYLES.md`, `scripts/vendor/fetch_opuscar_styles.sh` |
| Premium explainer visuals (HyperFrames library, 15 samples) | `hyperframes/` (`hyperframes/README.md`), `hyperframes/tools/hf.py` |

Two sessions work here: daily-filings videos edit `vx_scripts.py` and `Videos.tsx`; the Letters series edits
`vx_letters.py` and `LetterVideos.tsx`. Append to shared files, never replace another session's entries.

Not in git: `out/` (renders), `node_modules/`, generated audio (`*.mp3`, `*.wav`, rebuilt by the build scripts with
MiniMax TTS), `sources/` (PDFs) and `*.bak*` backups. Use the bundled ffmpeg: `npx remotion ffmpeg` / `npx remotion ffprobe`.

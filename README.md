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
| Carousels | `src/carousel/`, `public/carousel/<id>/carousel.json` |

Two sessions work here: daily-filings videos edit `vx_scripts.py` and `Videos.tsx`; the Letters series edits
`vx_letters.py` and `LetterVideos.tsx`. Append to shared files, never replace another session's entries.

Not in git: `out/` (renders), `node_modules/`, generated audio (`*.mp3`, `*.wav`, rebuilt by the build scripts with
MiniMax TTS), `sources/` (PDFs) and `*.bak*` backups. Use the bundled ffmpeg: `npx remotion ffmpeg` / `npx remotion ffprobe`.

# Data Kadai: fixed settings and preferences

What AK has fixed. Change these only when AK says so. Ops status and the log live in `ops/STATE.md`.

## Brand
- Name: **Data Kadai** (handle `@DataKadai`). Tagline: "India's numbers, served fresh. From official sources."
- Language: English only, no Tamil lines in videos or captions.
- Mark: tea-kadai glass holding three rising bars with steam. No India map in the logo.
- Palette (`src/datayt/IndiaShort.tsx`, `P`): cream `#F7F4EE`, ink `#1F1A17`, maroon `#7A2340`, amber `#C9822F`,
  mute `#7A6F66`. Map palettes rotate A → E → D → C → Original by queue position (`Brand.tsx`, `PALETTES`).
- Fonts: Oswald 700 (headlines, wordmark), Inter (body), Noto Sans Tamil 700 (Tamil logo variant only).
- Source of truth for the brand is code: `src/datayt/Brand.tsx`. Rendered copies are in `brand/`.

## Brand assets (`docs/datakadai/brand/`)
| File | Use | Size |
| --- | --- | --- |
| `dk-profile.png` | YouTube / social profile picture | 800×800 |
| `dk-icon.png` | App icon tile | 1024×1024 |
| `dk-logo.png` | Logo with tagline | 2400×800 |
| `dk-logo-ta.png` | Logo with Tamil line | 2400×800 |
| `dk-banner.png` | YouTube banner (safe area 1546×423) | 2560×1440 |
| `dk-endcard.png` | Shorts end card | 1080×1920 |
| `dk-chips.png` | Series title chips | 1080×1080 |
| `dk-logo-sheet.png` | Logo variants: primary, stacked, reversed, one colour, small sizes | 2400×1500 |
| `dk-palettes.png` | The five map palettes | 2400×1200 |

Re-render after a brand change: `npx remotion still src/index.ts DK-<name> docs/datakadai/brand/dk-<name>.png`
(`<name>`: profile, icon, logo, logo-ta, banner, endcard, chips, logo-sheet, palettes).

## Voice (fixed 9 Oct 2026, approved on gts01)
- MiniMax `speech-2.6-hd`, voice `English_Diligent_Man` (the Moat & Margin male voice), speed 1.0.
- Kokoro is a placeholder only. A Short marked `"voiceEngine": "kokoro"` must be re-voiced before it goes to AK.
- Code: `scripts/datayt/voice_dk.py`. It uses MiniMax whenever `MINIMAX_API_KEY` is set.

## Production machine (fixed 9 Oct 2026)
- Production runs on the **Mac Mini** (`ssh mini-ts`), repo at `~/Projects/mmvideo-dk`, Python venv at `.venv` (3.13).
- `MINIMAX_API_KEY` lives in the Mini's login shell. Never copy it to another machine, a file or a log.
- The Mini can't reach GitHub. Commit and push from the MacBook Air clone (`~/Projects/mmvideo-dk`): copy changed
  tracked files Mini → Air, commit there, push the working branch (never `main`).
- Build one Short (on the Mini, from the repo root):
  1. `.venv/bin/python scripts/datayt/build_india_shorts.py <id>`
  2. `.venv/bin/python scripts/datayt/post_pack.py <id> <YYYY-MM-DD>`
  3. Pack lands in `out/datakadai/daily/<date>/<id>/`: `short.mp4`, `ig.png`, `x.png`, `captions.md`.

## Posting
- Nothing is posted or uploaded by any agent. AK approves each pack and posts it.
- Generated audio and video are git-ignored and stay out of the repo.

## Reference Short
- `gts01` (Meghalaya, women owning house/land, NFHS-6): 35.5 s, 1080×1920, MiniMax voice. Approved by AK on
  9 Oct 2026 as the standard for the Guess the State series.

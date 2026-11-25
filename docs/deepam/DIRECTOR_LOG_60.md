# Director log: `kd-deepam60` (Karthigai Deepam, 60-second story)

## 24 Nov 2026
- **AK:** "Keep improving, make up to 60 sec video on short story on Karthigai Deepam, use our Director engine and
  interesting Shorts." The Director guide (`docs/DIRECTOR.md`, v1) is on branch `claude/jolly-planck-1yivh1`, not on this
  branch; it was read from commit 3e4526f.
- **Story chosen:** the banned flower (treatment section 3). The hook is the thalampoo never offered to Shiva; the payoff
  is at b8, after the peak at b7.
- **Script:** `S["kd-deepam60"]` in `hyperframes/tools/shorts_build.py`. Text only, 12 characters a second (new `cps`
  option for text-only Shorts; the 15 s cut keeps 15). 53.2 s, 120 words, 10 beats. `shorts_build.py check`: no FAIL;
  WARNs S1 (length over 45 s, by design), S4, S6, S7.
- **Stills:** k8–k14 are new. First try drifted to an East Asian look and lost the flower. Second try, with one subject
  per shot and an explicit Indian-art line: k8, k9, k10 and k13 kept. Third try: k11 and k14 kept (cropped in the cut);
  **k12 dropped** after three tries (Brahma drawn as an East Asian sage with seal stamps). "He made it lie" uses a
  punch-in on Brahma's face in k8. Rejected stills are in `public/deepam/img_old/`.
- **Animatic** (DIRECTOR step 4): `film.py anim` turns the 6 new stills into slow pushes; k1–k7 are the real clips.
  `film.py sound` writes our own score per the sound plan (two silences at 5.8 s and 31.7 s, peak at 34.1 s), two-pass
  loudnorm, −14.7 LUFS. Output: `out/hyperframes/kd-deepam60-final.mp4`.
- **Fixes after the first contact sheet:** the k8 punch-in moved from the crown to the face, the quote marks removed (a
  lone closing quote wrapped onto its own line), loudness raised from −16.2 to −14.7 LUFS.
- **Waiting for AK:** the animatic review (bored? confused? did the reveal land?) and the go-ahead for the 6 paid
  Hailuo clips (k8, k9, k10, k11, k13, k14). Then: `clip`, `grade`, `cut`, `sound`, full-speed review (DIRECTOR
  section 9).

## 24 Nov 2026, afternoon: made in code, rendered in Blender
- **AK:** "Use MiniMax for reference, made in code and render in Blender MCP"; then "install both and use MiniMax stills
  as flat cut-outs". The paid Hailuo clips for k8–k14 were never made.
- **Installed on the Mac Mini:** Blender 5.3.0 (Homebrew cask), uv (Homebrew), and MCP for Blender 2.3.1 (MIT,
  github.com/ahujasid/mcp-for-blender): add-on `blender_mcp.py` in `~/Library/Application Support/Blender/5.3/scripts/addons`,
  enabled; Claude Code user config entry `blender` = `uvx mcp-for-blender@2.3.1` with `DISABLE_TELEMETRY=true`. Its tools
  appear in new sessions with Blender open and "Start MCP Server" clicked. This film renders headless from code instead,
  so every shot can be rebuilt from git.
- **Cut-outs:** `scripts/deepam/cutout.swift` (Apple Vision subject lift, no download) for k3, k6, k8, k10, k11, k13;
  luminance keys for k4 (boar) and k2 (crowd), made solid silhouettes (boar black, crowd dark red); k14 keyed. All cropped
  to the subject, in `public/deepam/cut/`.
- **Scenes:** `scripts/deepam/blender/deepam3d.py`. All 13 shots (k1–k11, k13, k14) are built in code: the pillar of fire
  (core, rippling shell, red tongues, embers), stars, Arunachala, gopurams, lamp rows, rock bands, steps, lingam and lamps,
  shock rings; the gods are flat cut-out planes. Moves are drivers on the frame number. Ink lines (Freestyle) on the set,
  not on the fire (17 s → 4 s a frame) or the cut-outs.
- **Render:** `scripts/deepam/blender/render_all.sh` (4 Blender processes; Freestyle uses one core each) →
  `public/deepam/clip3d/`. `film.py grade` with `DEEPAM_CLIP=clip3d DEEPAM_GRADED=graded3d` only fits the frame: the
  palette snap turned the code-built night sky black, and the renders are already drawn in the palette.

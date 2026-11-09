# NVIDIA / Jensen build files (made on the Mac Mini, 10 Nov 2026)

The Mini cannot reach GitHub, so the build is stored here as files:

- `vx_nvidia.py`: the film (`nvidiajensen`, 39 beats) and four trailer Shorts (`nvidiasa` to `nvidiasd`). Goes to `scripts/vx_nvidia.py`.
- `engine_calm_and_registration.patch`: hooks into `vx_scripts.py`, `build_vx.py`, `Videos.tsx`, plus an opt-in **calm mode** (`calm=True`
  in a video: no scene drift, no spring overshoot, so words and numbers hold still). Default is off, so no other video changes.
- `nvidia_make.sh`: voice, QA stills and renders. Voice runs only 06:45-22:10 IST.

Ids have no underscore because Remotion rejects `_` in composition ids. Photos are converted to `public/vx/<id>/pics/` on the Mini;
the 10-K PDF stays out of git. Not voiced or rendered yet. The engine's corner chip still says Moat & Margin (channel is Moat Atlas: AK to decide).

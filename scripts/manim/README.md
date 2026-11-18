# Manim trial (AK, 18 Nov 2026)

`compounding.py` is one Moat & Margin explainer beat: ₹100 compounding for 20 years at 10% vs 15% a year, ending on
"2.4× the money". It is illustrative arithmetic, labelled on screen. No LaTeX: every label is `Text`.

**Mac Mini** (Homebrew needed), from the repo root:
```sh
scripts/manim/setup_mac.sh     # once: Python 3.12, cairo, pango, ffmpeg, a venv with manim
~/.venvs/manim/bin/manim -qh --fps 30 scripts/manim/compounding.py Compounding   # -> media/videos/compounding/1080p30/
```
Verified in the cloud container on 18 Nov 2026: Manim 0.22.1, 1920×1080, 12.7 s. The container needed
`libpango1.0-dev libcairo2-dev pkg-config` and a clean venv (the system pip could not build the `srt` dependency).
`media/` is a render folder: keep it out of git.

When to use Manim rather than HyperFrames: formula-led beats (compounding, DCF, ratios, UPSC numbers) where the maths
itself is the picture. Everything else stays in HyperFrames.

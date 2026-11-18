#!/bin/bash
# One-time Manim setup on the Mac Mini (Apple silicon or Intel). Needs Homebrew.
set -e
brew install py3cairo ffmpeg pango pkg-config
python3 -m venv ~/.venvs/manim
~/.venvs/manim/bin/pip install --upgrade pip setuptools wheel
~/.venvs/manim/bin/pip install manim
~/.venvs/manim/bin/python -c "import manim; print('manim', manim.__version__)"
echo "Ready. Render the trial from the repo root with:"
echo "  ~/.venvs/manim/bin/manim -qh --fps 30 scripts/manim/compounding.py Compounding"

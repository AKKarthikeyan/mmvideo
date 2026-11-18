#!/bin/bash
# One-time Manim setup on the Mac Mini (the production machine; Apple silicon or Intel). Needs Homebrew (https://brew.sh).
# Manim 0.22 needs Python 3.11+; macOS's own python3 is 3.9, so this uses Homebrew's Python 3.12.
set -e
brew install python@3.12 py3cairo ffmpeg pango pkg-config
PY="$(brew --prefix python@3.12)/bin/python3.12"
"$PY" -m venv ~/.venvs/manim
~/.venvs/manim/bin/pip install --upgrade pip setuptools wheel
~/.venvs/manim/bin/pip install manim
~/.venvs/manim/bin/python -c "import manim; print('manim', manim.__version__)"
echo "Ready. Render the trial from the repo root with:"
echo "  ~/.venvs/manim/bin/manim -qh --fps 30 scripts/manim/compounding.py Compounding"

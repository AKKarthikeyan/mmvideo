#!/bin/zsh
# Run a Python script with pillow, numpy and scipy from the vendor uv cache (nothing installed system-wide).
source /Volumes/DarwinSSD/vendor/env.sh
exec uv run -q --with pillow --with numpy --with scipy python "$@"

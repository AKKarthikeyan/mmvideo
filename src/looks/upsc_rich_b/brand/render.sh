#!/bin/zsh
# from the repo root: renders logos + banner + previews to out/upsc/brand/
set -e
E=src/looks/upsc_rich_b/brand/index.tsx; O=out/upsc/brand; mkdir -p $O
npx remotion still $E LOGO-1 $O/logo1.png --log=error
npx remotion still $E LOGO-2 $O/logo2.png --log=error
npx remotion still $E LOGO-3 $O/logo3.png --log=error
npx remotion still $E BANNER $O/banner.png --log=error
python3 src/looks/upsc_rich_b/brand/previews.py

#!/bin/zsh
# usage: render2.sh (from the repo root) -> out/upsc/geo07-p1/thumbs/thumb2.png + thumb2_320.png
set -e
E=src/looks/upsc_rich_b/thumbs/index.tsx; O=out/upsc/geo07-p1/thumbs
npx remotion still $E THUMB-2 $O/thumb2.png --log=error
npx remotion ffmpeg -y -loglevel error -i $O/thumb2.png -vf scale=320:180 -update 1 -frames:v 1 $O/thumb2_320.png

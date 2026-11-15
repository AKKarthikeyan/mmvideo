#!/bin/zsh
# usage: p2_render.sh [1|2|all]  (from the repo root) -> out/upsc/geo07-p2/thumbs/thumb{1,2}.png + thumb{1,2}_320.png
# Stills only, one worker at a time (a film render may be running on this machine).
set -e
E=src/looks/upsc_rich_b/thumbs/p2_index.tsx; O=out/upsc/geo07-p2/thumbs; C="--log=error --concurrency=1"
mkdir -p $O public/thumbs_tmp
w=${1:-all}
small() { ffmpeg -y -loglevel error -i $O/$1.png -vf scale=320:180 $O/$1_320.png 2>/dev/null || npx remotion ffmpeg -y -loglevel error -i $O/$1.png -vf scale=320:180 -update 1 -frames:v 1 $O/$1_320.png; }
if [[ $w == 1 || $w == all ]]; then
  npx remotion still $E P2-LAYER-K public/thumbs_tmp/p2_K.png $=C
  npx remotion still $E P2-LAYER-T public/thumbs_tmp/p2_T.png $=C
  npx remotion still $E P2-THUMB-1 $O/thumb1.png $=C
  small thumb1
fi
if [[ $w == 2 || $w == all ]]; then
  npx remotion still $E P2-LAYER-MAP public/thumbs_tmp/p2_map.png $=C
  npx remotion still $E P2-THUMB-2 $O/thumb2.png $=C
  small thumb2
fi

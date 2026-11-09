#!/bin/zsh
# usage: render1.sh  (from the repo root) -> out/upsc/geo07-p1/thumbs/thumb1.png + thumb1_320.png
set -e
E=src/looks/upsc_rich_b/thumbs/index.tsx; O=out/upsc/geo07-p1/thumbs
npx remotion still $E T1-LAYER-L public/thumbs_tmp/t1_L.png --log=error
npx remotion still $E T1-LAYER-R public/thumbs_tmp/t1_R.png --log=error
npx remotion still $E THUMB-1 $O/thumb1.png --log=error
ffmpeg -y -loglevel error -i $O/thumb1.png -vf scale=320:180 $O/thumb1_320.png 2>/dev/null || npx remotion ffmpeg -y -i $O/thumb1.png -vf scale=320:180 $O/thumb1_320.png

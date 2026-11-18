#!/bin/zsh
# swiggyq2 dev QA: a still every 2 s of the 30 fps composition (scale $1), plus contact sheets.
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd /Volumes/DarwinSSD/MMVideo
T=$(grep -o "FILM_TOTAL_S = [0-9.]*" src/voxplus/SwiggyTiming.ts | awk "{print int(\$3)}")
rm -rf out/voxplus/swiggyq2/dev out/voxplus/swiggyq2/devsheet_*
node scripts/voxplus/swiggyq2_stills.mjs SWIGGYQ2-film30 out/voxplus/swiggyq2/dev ${1:-0.3} $(seq 1 2 $T) > /tmp/sq2_stills.log 2>&1
/usr/bin/python3 scripts/voxplus/swiggyq2_sheet.py out/voxplus/swiggyq2/dev out/voxplus/swiggyq2/devsheet 5 4 384

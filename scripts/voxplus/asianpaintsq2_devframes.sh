#!/bin/zsh
# asianpaintsq2 dev QA: a still every 2 s of the 30 fps composition (scale $1), plus contact sheets.
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd /Volumes/DarwinSSD/MMVideo
T=$(grep -o "FILM_TOTAL_S = [0-9.]*" src/voxplus/AsianPaintsTiming.ts | awk "{print int(\$3)}")
rm -rf out/voxplus/asianpaintsq2/dev out/voxplus/asianpaintsq2/devsheet_*
node scripts/voxplus/asianpaintsq2_stills.mjs ASIANPAINTSQ2-film30 out/voxplus/asianpaintsq2/dev ${1:-0.3} $(seq 1 2 $T) > /tmp/apq2_stills.log 2>&1
/usr/bin/python3 scripts/voxplus/asianpaintsq2_sheet.py out/voxplus/asianpaintsq2/dev out/voxplus/asianpaintsq2/devsheet 5 4 384

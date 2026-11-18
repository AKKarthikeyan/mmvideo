#!/bin/zsh
# marutiq2 dev QA: a still every 2 s of the 30 fps composition (scale $1), plus contact sheets.
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd /Volumes/DarwinSSD/MMVideo
T=$(grep -o "FILM_TOTAL_S = [0-9.]*" src/voxplus/MarutiTiming.ts | awk "{print int(\$3)}")
rm -rf out/voxplus/marutiq2/dev out/voxplus/marutiq2/devsheet_*
node scripts/voxplus/marutiq2_stills.mjs MARUTIQ2-film30 out/voxplus/marutiq2/dev ${1:-0.3} $(seq 1 2 $T) > /tmp/mq2_stills.log 2>&1
/usr/bin/python3 scripts/voxplus/marutiq2_sheet.py out/voxplus/marutiq2/dev out/voxplus/marutiq2/devsheet 5 4 384

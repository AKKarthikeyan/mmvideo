#!/bin/zsh
# tatamotorsq2 dev QA: a still every 2 s of the 30 fps composition (scale $1), plus contact sheets.
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd /Volumes/DarwinSSD/MMVideo
T=$(grep -o "FILM_TOTAL_S = [0-9.]*" src/voxplus/TataMotorsTiming.ts | awk "{print int(\$3)}")
rm -rf out/voxplus/tatamotorsq2/dev out/voxplus/tatamotorsq2/devsheet_*
node scripts/voxplus/tatamotorsq2_stills.mjs TATAMOTORSQ2-film30 out/voxplus/tatamotorsq2/dev ${1:-0.3} $(seq 1 2 $T) > /tmp/tmq2_stills.log 2>&1
/usr/bin/python3 scripts/voxplus/tatamotorsq2_sheet.py out/voxplus/tatamotorsq2/dev out/voxplus/tatamotorsq2/devsheet 5 4 384

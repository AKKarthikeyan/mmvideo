#!/bin/zsh
# kotakq2 dev QA: a still every 2 s of the 30 fps composition (scale $1), plus contact sheets.
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
cd /Volumes/DarwinSSD/MMVideo
T=$(grep -o "FILM_TOTAL_S = [0-9.]*" src/voxplus/KotakTiming.ts | awk "{print int(\$3)}")
rm -rf out/voxplus/kotakq2/dev out/voxplus/kotakq2/devsheet_*
node scripts/voxplus/kotakq2_stills.mjs KOTAKQ2-film30 out/voxplus/kotakq2/dev ${1:-0.3} $(seq 1 2 $T) > /tmp/kq2_stills.log 2>&1
/usr/bin/python3 scripts/voxplus/kotakq2_sheet.py out/voxplus/kotakq2/dev out/voxplus/kotakq2/devsheet 5 4 384

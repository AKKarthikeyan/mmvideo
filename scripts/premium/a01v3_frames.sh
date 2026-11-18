#!/bin/zsh
# One frame per second (or every N s) of a render into contact sheets of 12: a01v3_frames.sh in.mp4 outdir [step_s=1] [width=480]
source /Volumes/DarwinSSD/vendor/env.sh
IN=$1; OUT=$2; STEP=${3:-1}; WID=${4:-480}; rm -rf $OUT; mkdir -p $OUT
ffmpeg -v error -i $IN -vf "fps=1/$STEP,scale=$WID:-1" -start_number 0 $OUT/f_%03d.png
cd $OUT; ls f_*.png > /tmp/_fl.txt
split -l 12 /tmp/_fl.txt /tmp/_fl_part_
i=0; for p in /tmp/_fl_part_*; do /Volumes/DarwinSSD/MMVideo/scripts/premium/upy.sh /Volumes/DarwinSSD/MMVideo/scripts/premium/a01v3_sheet.py sheet_$i.jpg 4 $WID $(cat $p) >/dev/null; i=$((i+1)); done
rm -f /tmp/_fl_part_*; ls $OUT/sheet_*

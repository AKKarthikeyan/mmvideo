#!/bin/zsh
# marutiq2 finalize (24 Oct 2026, copy of swiggyq2_finalize.sh): from the 1080p60 master -> phone copy (960x540, 30 fps, two-pass, under 28 MB), loudness
# report (ebur128), motion gate (huashu film_gate.py --json), QA frames every 2 s + contact sheets, SRT. Vendor tools only.
source /Volumes/DarwinSSD/vendor/env.sh
R=/Volumes/DarwinSSD/MMVideo; O=$R/out/voxplus/marutiq2; N=maruti-q2-material-cost-margin; M=$O/${N}_1080p60.mp4
cd /tmp && ffmpeg -v error -y -i $M -vf "scale=960:540,fps=30" -c:v libx264 -preset slow -b:v 330k -maxrate 450k -bufsize 900k -pass 1 -passlogfile /tmp/mq2pass -an -f mp4 /dev/null && \
  ffmpeg -v error -y -i $M -vf "scale=960:540,fps=30" -c:v libx264 -preset slow -b:v 330k -maxrate 450k -bufsize 900k -pass 2 -passlogfile /tmp/mq2pass -c:a aac -b:a 96k -movflags +faststart $O/${N}_phone_540p30.mp4
echo "phone bytes $(stat -f %z $O/${N}_phone_540p30.mp4)"
ffmpeg -hide_banner -nostats -i $M -af ebur128=peak=true -f null - 2>&1 | grep -A16 "Summary:" > $O/${N}_ebur128.txt; cat $O/${N}_ebur128.txt
rm -rf $O/qa_2s; mkdir -p $O/qa_2s
ffmpeg -v error -i $M -vf "fps=0.5,scale=480:270" -q:v 4 $O/qa_2s/f%04d.jpg
/usr/bin/python3 $R/scripts/voxplus/marutiq2_sheet.py $O/qa_2s $O/qa_2s/sheet 6 5 480 > /dev/null
python3 $R/scripts/voxplus/marutiq2_srt.py $O/${N}.en.srt
cd /Volumes/DarwinSSD/vendor/huashu-art-motion/scripts && uv run -q film_gate.py $M --json > $O/${N}_film_gate.json 2> /tmp/mq2_gate.err
python3 -c "
import json;j=json.load(open('$O/${N}_film_gate.json'))
for k in ['duration_s','shots','asl_s','fast_ratio','fast_ratio_worst_window','worst_window_start_s','still_ratio','longest_still_s','blank_run_s','push_in_per_min','max_event_gap_s','gate_light','verdict']: print(k, j.get(k))
print('non-green:', {k:v for k,v in j['lights'].items() if v not in ('green','--')}); print(j.get('explain'))"
ls -la $O

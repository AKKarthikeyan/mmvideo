#!/bin/zsh
# A01 v4 finalize: from the 1080p60 master make the 540p60 copy and a 540p30 phone copy under 28 MB (two-pass), 12 QA stills,
# the motion gate JSON (huashu film_gate.py --json) and the ebur128 loudness report. Vendor tools only.
source /Volumes/DarwinSSD/vendor/env.sh
O=/Volumes/DarwinSSD/MMVideo/out/voxplus/a01v4; M=$O/what-is-a-moat-26-loom_1080p60.mp4; S=what-is-a-moat-26-loom
ffmpeg -v error -y -i $M -vf scale=960:540 -c:v libx264 -preset slow -crf 27 -c:a aac -b:a 128k $O/${S}_540p60.mp4
echo "540p60 bytes $(stat -f %z $O/${S}_540p60.mp4)"
cd /tmp && ffmpeg -v error -y -i $M -vf "scale=960:540,fps=30" -c:v libx264 -preset slow -b:v 300k -maxrate 420k -bufsize 840k -pass 1 -an -f mp4 /dev/null && \
  ffmpeg -v error -y -i $M -vf "scale=960:540,fps=30" -c:v libx264 -preset slow -b:v 300k -maxrate 420k -bufsize 840k -pass 2 -c:a aac -b:a 96k $O/${S}_540p30.mp4
echo "540p30 bytes $(stat -f %z $O/${S}_540p30.mp4)"
rm -rf $O/qa_stills
mkdir -p $O/qa_stills
i=1
for pair in "2.3:c01_first_beat" "56.9:ch1_title_card_what_is_a_moat" "117.2:ch2_why_need_one" "172.6:ch3_made_of" "303.2:ch4_fake_moat" "350.7:ch5_star_person" \
            "375.4:ch6_last_forever" "384.6:but_turn" "463.7:ch7_test" "487.7:recap" "509.3:ending_moat_tiles" "513.5:end_card"; do
  t=${pair%%:*}; n=${pair#*:}
  ffmpeg -v error -y -ss $t -i $M -frames:v 1 $O/qa_stills/$(printf %02d $i)_${n}_t${t}s.png; i=$((i+1))
done
ffmpeg -hide_banner -nostats -i $M -af ebur128=peak=true -f null - 2>&1 | grep -A16 "Summary:" > $O/${S}_ebur128.txt
cat $O/${S}_ebur128.txt
cd /Volumes/DarwinSSD/vendor/huashu-art-motion/scripts && uv run -q film_gate.py $M --json > $O/${S}_film_gate.json 2> /tmp/a01v4_gate.err
python3 -c "
import json;j=json.load(open('$O/${S}_film_gate.json'))
for k in ['duration_s','shots','asl_s','fast_ratio','fast_ratio_worst_window','worst_window_start_s','fast_ratio_by_10s','still_ratio','longest_still_s','blank_run_s','push_in_per_min','fast_push_per_min','max_event_gap_s','dead_flat','flat_area','blue_purple_share','page_frame_share','gate_light','verdict']: print(k, j.get(k))
print('non-green:', {k:v for k,v in j['lights'].items() if v not in ('green','--')}); print(j['explain'])"
ls -la $O

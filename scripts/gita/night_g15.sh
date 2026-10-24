#!/bin/zsh
# One-off night run for the 15-minute Gita (AK, 21 Oct 2026: "Start by 2.00 am").
# 02:00 sits in the MiniMax key's gap: Ravens (22:12) is usually done by ~01:50; com.vigilv2.shadow starts 02:10 and
# com.darwinwiki.resultengine-night 02:15 (launchd, checked 21 Oct). Voicing 103 cues takes ~3-5 min.
# Waits for 02:00, makes sure no Ravens/Vigil job holds the key (skips voicing if one is still running at 02:03),
# voices every cue with MiniMax English_Diligent_Man, stretches pauses toward 15:00, re-bundles, renders, checks the mix.
#   caffeinate -i zsh scripts/gita/night_g15.sh
set -u
cd /Volumes/DarwinSSD/MMVideo
LOG=out/gita/night_g15.log
log() { echo "$(date '+%H:%M:%S') $*" | tee -a $LOG; }
F=node_modules/@remotion/compositor-darwin-arm64

log "waiting for 02:00"
sleep $(python3 -c "import datetime as d; n=d.datetime.now(); t=n.replace(hour=2,minute=0,second=0,microsecond=0); t=t if t>n else t+d.timedelta(days=1); print(int((t-n).total_seconds()))")

while pgrep -f -- "-m ravens\.|vigilv2" >/dev/null; do
  if [ "$(date +%H%M)" -ge 0203 ]; then log "a Ravens/Vigil job still holds the key at 02:03: voicing skipped so it cannot run into Vigil v2 at 02:10"; exit 2; fi
  log "Ravens/Vigil still running; waiting"; sleep 30
done

log "voicing with MiniMax"
# not -I: requests lives in the user site-packages
TARGET=900 python3 scripts/gita/build_gita15.py minimax >>$LOG 2>&1 || { log "voicing FAILED (see above)"; exit 3; }
python3 -I -c "import json; d=json.load(open('public/gita/g15/data.json')); assert all(c['voice'].startswith('minimax') for c in d['cues']), 'not all cues are MiniMax'; print('all', len(d['cues']), 'cues MiniMax;', round(d['total']//60), 'min', round(d['total']%60), 's')" >>$LOG 2>&1 || { log "voice check FAILED"; exit 4; }
log "voicing done"

B=/tmp/vxb_g15_final_$(date +%H%M)
npx remotion bundle src/gita/index.ts --out-dir=$B --log=error >>$LOG 2>&1 || { log "bundle FAILED"; exit 5; }
log "rendering"
npx remotion render $B GITA-g15 out/gita/gita15_v1.mp4 --log=error --concurrency=6 >>$LOG 2>&1 || { log "render FAILED"; exit 6; }
DYLD_LIBRARY_PATH=$F $F/ffprobe -v error -show_entries format=duration -of csv=p=0 out/gita/gita15_v1.mp4 | xargs -I{} echo "$(date '+%H:%M:%S') duration {} s" | tee -a $LOG
S=/private/tmp/claude-501/-Users-akkarthikeyan-Documents/9a05166b-40a3-4c05-afe4-8b6ca822b389/scratchpad
DYLD_LIBRARY_PATH=$F $F/ffmpeg -y -loglevel error -i out/gita/gita15_v1.mp4 -ac 1 -ar 8000 -c:a pcm_s16le $S/g15mix.wav
python3 -I - $S/g15mix.wav public/gita/g15/data.json >>$LOG 2>&1 <<'EOF'
import sys, wave, array, math, json
w = wave.open(sys.argv[1]); a = array.array('h', w.readframes(w.getnframes())); sr = w.getframerate()
cues = json.load(open(sys.argv[2]))["cues"]
speech = lambda t: any(c["start"]-0.3 <= t <= c["start"]+c["dur"]+0.3 for c in cues)
db = lambda seg: 20*math.log10((math.sqrt(sum(x*x for x in seg)/len(seg)) or 1)/32768)
win = sr//4; sp, gap = [], []
for i in range(0, len(a)-win, win): (sp if speech(i/sr) else gap).append(db(a[i:i+win]))
print("mix: peak dBFS", round(20*math.log10(max(abs(x) for x in a)/32768),1), "| speaking median", round(sorted(sp)[len(sp)//2],1), "| music-only median", round(sorted(gap)[len(gap)//2],1))
EOF
cp out/gita/gita15_v1.mp4 ~/Documents/Gita15_v1.mp4 && log "DONE: ~/Documents/Gita15_v1.mp4"

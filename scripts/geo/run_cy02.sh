#!/bin/zsh
# Voice, render and frame-check Indica Atlas CY02 (Bay of Bengal, deadliest cyclones). Never posts anything.
#   cd /Volumes/DarwinSSD/MMVideo && scripts/geo/run_cy02.sh
# Voice is allowed 06:45-22:10 IST only (the MiniMax key is busy at night: AGENTS.md section 2). Refuses outside that window.
set -e
cd "$(dirname "$0")/../.."
HM=$(TZ=Asia/Kolkata date +%H%M)
if [[ "$HM" < "0645" || "$HM" > "2210" ]]; then
  # AK may ask for a night run ("run now"). Only the second plan's key may be used then: the night jobs use MINIMAX_API_KEY.
  if [[ "$FORCE_NIGHT" == "1" && "$MINIMAX_KEY_VAR" == "MINIMAX_GO_API_KEY" ]]; then
    echo "Night run on the second plan's key (FORCE_NIGHT=1, $HM IST)."
  else
    echo "Outside the voice window (06:45-22:10 IST). It is $HM IST. Nothing was run." >&2
    echo "For a night run on the second plan's key: FORCE_NIGHT=1 MINIMAX_KEY_VAR=MINIMAX_GO_API_KEY scripts/geo/run_cy02.sh" >&2; exit 2
  fi
fi
ID=cy02bay
[[ "$1" == "--dry" ]] && { echo "dry run: the voice-window check passed, nothing was run."; exit 0; }
OUT=out/geo/cyclone; mkdir -p $OUT
# 1. Voice (re-voices only beats whose text changed; the placeholder timings file is overwritten).
zsh -lic "cd '$PWD' && MINIMAX_KEY_VAR='${MINIMAX_KEY_VAR:-MINIMAX_API_KEY}' python3 scripts/geo/voice_geo.py cyclone:$ID"
# 1b. Trim long pauses and set each beat's audio file: every finished Short uses tempo 1.07 (house pace).
python3 scripts/geo/trim_geo.py $ID 1.07
# 2. Word pace and length check before rendering.
python3 - <<EOF
import json
d=json.load(open("public/geo/$ID/data.json"))
assert "placeholder" not in d, "data.json is still the placeholder: voicing did not run"
sec=sum(b["sec"] for b in d["beats"])+0.12*len(d["beats"])+1.2
words=sum(len(b["say"].replace("-"," ").split()) for b in d["beats"])
print(f"voiced {sec:.1f}s incl. gaps and end hold, {words} words ({words/sec:.2f} w/s)")
if sec>35: print("WARNING: over 35 s. Trim beats before rendering.")
EOF
# 3. Render
npx remotion render src/geo/index.ts GEO-$ID $OUT/$ID.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 $OUT/$ID.mp4 | awk '{printf "rendered length %.1f s\n",$1}'
# 4. Frame sheet (one frame per beat plus the end card)
python3 scripts/geo/frame_sheet.py $ID $OUT/$ID.mp4 $OUT/${ID}_sheet.jpg
echo "done: $OUT/$ID.mp4 and $OUT/${ID}_sheet.jpg (not posted)"

#!/bin/zsh
# Night-look episodes (own entry src/gadget/<id>/index.ts, composition GK-<id>): voice -> align -> final render, mastered to -14 LUFS.
# usage: scripts/gadget/gk_night.sh <id> [render|now]
#   (no flag)  voice with MiniMax, only inside 06:45-22:10 IST (Vigil/Ravens use the key at night), align, render
#   now        voice outside the window on the SECOND plan (MINIMAX_GO_API_KEY), so Vigil/Ravens' key is left alone. Only when AK says so
#   render     skip voicing (reuse public/gadget/<id>/vo.wav and timing.json)
# Keys load from the Mini's login shell (zsh -lic); nothing is printed or copied.
export PATH=/opt/homebrew/bin:$PATH
id=$1; [[ -z $id ]] && { echo "usage: gk_night.sh <id> [render|now]"; exit 1; }
cd /Volumes/DarwinSSD/MMVideo || exit 1
O=out/gadget/$id; mkdir -p $O
# ffmpeg wrapper: /tmp/ffbin disappears after a reboot, so rebuild it around Remotion's bundled ffmpeg
if [[ ! -x /tmp/ffbin/ffmpeg ]]; then
  FFB=/Volumes/DarwinSSD/MMVideo/node_modules/@remotion/compositor-darwin-arm64/ffmpeg; mkdir -p /tmp/ffbin
  printf '#!/bin/zsh\nexport DYLD_LIBRARY_PATH=%s:$DYLD_LIBRARY_PATH\nexec %s "$@"\n' "$(dirname $FFB)" "$FFB" > /tmp/ffbin/ffmpeg; chmod +x /tmp/ffbin/ffmpeg
fi
if [[ $2 != render ]]; then
  now=$(TZ=Asia/Kolkata date +%H%M); KEYMAP=""
  if [[ $now < 0645 || $now > 2210 ]]; then
    if [[ $2 != now ]]; then echo "outside the 06:45-22:10 IST voice window (now $now IST): not voicing. Pass 'now' to voice on the second plan (MINIMAX_GO_API_KEY)."; exit 2; fi
    KEYMAP='export MINIMAX_API_KEY="$MINIMAX_GO_API_KEY"; '
  fi
  zsh -lic "${KEYMAP}cd /Volumes/DarwinSSD/MMVideo && python3 scripts/gadget/gk_voice.py src/gadget/$id/script.json" || exit 1
  ~/jev_full/.stt-venv/bin/python scripts/gadget/gk_align.py src/gadget/$id/script.json || exit 1
fi
npx remotion render src/gadget/$id/index.ts GK-$id $O/GK-$id.raw.mp4 --concurrency=6 --crf=18 > /tmp/gk_render_$id.log 2>&1 || { tail -30 /tmp/gk_render_$id.log; exit 1; }
cd $O; R=GK-$id.raw.mp4; FF=/tmp/ffbin/ffmpeg
M=$($FF -hide_banner -nostats -i $R -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n "/{/,/}/p")
g(){ echo "$M" | grep "\"$1\"" | grep -o "[-0-9.]*" | head -1; }
$FF -hide_banner -v error -y -i $R -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" -ar 48000 -c:a aac -b:a 192k GK-$id.mp4
$FF -hide_banner -v error -y -i GK-$id.mp4 -vf scale=720:1280 -c:v libx264 -crf 26 -preset medium -c:a aac -b:a 128k GK-${id}_phone.mp4
echo "OK $O/GK-$id.mp4"

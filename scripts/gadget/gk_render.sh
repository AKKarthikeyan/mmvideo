#!/bin/zsh
# usage: gk_render.sh <id> [draft]  -> out/gadget/<id>/GK-<id>.mp4 mastered to -14 LUFS (+ _phone copy); "draft" renders half size, fast
export PATH=/opt/homebrew/bin:$PATH
id=$1; cd /Volumes/DarwinSSD/MMVideo; O=out/gadget/$id; mkdir -p $O
if [[ $2 == draft ]]; then
  npx remotion render src/gadget/index.ts GK-$id $O/draft.mp4 --scale=0.5 --concurrency=6 --crf=24 > /tmp/gk_render_$id.log 2>&1 || { tail -30 /tmp/gk_render_$id.log; exit 1; }
  echo "OK draft $O/draft.mp4"; exit 0
fi
npx remotion render src/gadget/index.ts GK-$id $O/GK-$id.raw.mp4 --concurrency=6 --crf=18 > /tmp/gk_render_$id.log 2>&1 || { tail -30 /tmp/gk_render_$id.log; exit 1; }
cd $O; R=GK-$id.raw.mp4; FF=/tmp/ffbin/ffmpeg
M=$($FF -hide_banner -nostats -i $R -vn -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n "/{/,/}/p")
g(){ echo "$M" | grep "\"$1\"" | grep -o "[-0-9.]*" | head -1; }
$FF -hide_banner -v error -y -i $R -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" -ar 48000 -c:a aac -b:a 192k GK-$id.mp4
$FF -hide_banner -v error -y -i GK-$id.mp4 -vf scale=720:1280 -c:v libx264 -crf 26 -preset medium -c:a aac -b:a 128k GK-${id}_phone.mp4
echo "OK $O/GK-$id.mp4 $($FF -hide_banner -nostats -i GK-$id.mp4 -vn -af loudnorm=I=-14:print_format=json -f null - 2>&1 | grep '"input_i"')"

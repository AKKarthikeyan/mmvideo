#!/bin/bash
# Render one Letter video from the /tmp/ltb bundle: long (1080p), phone preview (<30 MB), 3 Shorts, 3 thumbnails (JPEG, <2 MB).
# Usage: render_vx_letters.sh <id> [--skip-long]
set -e
export PATH=/opt/homebrew/bin:$PATH
cd /Volumes/DarwinSSD/MMVideo
id=$1; B=/tmp/ltb
if [ "$2" != "--skip-long" ]; then npx remotion render $B VX-$id-long out/vx/$id-long.mp4 --log=error; fi
npx remotion render $B VX-$id-long out/vx/$id-preview-phone.mp4 --scale=0.4 --crf=38 --log=error --overwrite
for i in 1 2 3; do
  npx remotion render $B VX-$id-short$i out/vx/$id-short$i.mp4 --log=error
  if grep -q "MFT-$id-$i" src/vx/scenes/CaseThumbs.tsx 2>/dev/null; then T=MFT-$id-$i; else T=VX-$id-thumbG$i; fi
  npx remotion still $B $T out/vx/$id-thumbnail-$i.jpg --image-format=jpeg --jpeg-quality=92 --log=error
done
ls -la out/vx/$id-*

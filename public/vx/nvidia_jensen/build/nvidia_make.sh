#!/bin/zsh
# NVIDIA / Jensen film + 4 Shorts: voice (MiniMax), QA stills, render. Run on the Mini:  zsh -lic 'scripts/nvidia_make.sh'
# Voice is only allowed 06:45-22:10 IST (night key is busy). Nothing is delivered or published here.
cd /Volumes/DarwinSSD/MMVideo || exit 1
export PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH
now=$(TZ=Asia/Kolkata date +%H%M)
if [ "$now" -lt 0645 ] || [ "$now" -gt 2210 ]; then echo "Outside the voice window (06:45-22:10 IST). Now: $now. Stop."; exit 2; fi
IDS="nvidiajensen nvidiasa nvidiasb nvidiasc nvidiasd"
/usr/bin/python3 scripts/build_vx.py $IDS || exit 1                # voices every beat (MiniMax key comes from the login shell)
rm -rf /tmp/nvb && npx remotion bundle src/index.ts --out-dir=/tmp/nvb || exit 1
/usr/bin/python3 scripts/qa_vx.py nvidiajensen /tmp/nvb            # look at out/vx/qa/nvidiajensen/qa_sheet.png before the renders
mkdir -p out/vx/nvidiajensen
npx remotion render /tmp/nvb VX-nvidiajensen-long out/vx/nvidiajensen/long.mp4 --crf=18
for s in a b c d; do npx remotion render /tmp/nvb VX-nvidias$s-short1 out/vx/nvidiajensen/short_$s.mp4 --crf=18; done
npx remotion still /tmp/nvb VX-nvidiajensen-thumb out/vx/nvidiajensen/thumb.png
echo "Rendered in out/vx/nvidiajensen/. Next: re-time chapters from data.json, check length (<8:00 = no mid-roll), then deliver.py (AK picks the channel folder)."

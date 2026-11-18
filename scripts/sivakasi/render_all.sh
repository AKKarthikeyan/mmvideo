#!/bin/zsh -l
cd /Volumes/DarwinSSD/MMVideo
for F in paradox longroad; do
  echo "== $F $(date +%T)"
  npx remotion render src/sivakasi/index.ts SV-$F out/sivakasi/sivakasi-$F-60fps.mp4 --props="{\"film\":\"$F\",\"audio\":true}" --concurrency=6 --codec=h264 --crf=18 --audio-bitrate=320k --log=error
done
echo "== done $(date +%T)"

#!/bin/zsh -l
# SV01: voice both Sivakasi scripts (MiniMax, English_Diligent_Man, speed 1.0). AK 1 Nov 2026: "Voice as is".
cd /Volumes/DarwinSSD/DataKadai/mmvideo-dk-tp
for N in paradox_v1 long_road_v1; do
  echo "== $N $(date +%T)"
  LONG_DIR=/Volumes/DarwinSSD/MMVideo/docs/geo/research/SV01-sivakasi-fireworks/voice/$N .venv/bin/python scripts/datayt/long_voice.py voice
done
echo "== done $(date +%T)"

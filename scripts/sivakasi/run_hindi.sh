#!/bin/zsh -l
# Hindi for both Sivakasi films: Gemini voice Charon on gemini-2.5-flash-preview-tts (the 3.8 model hit its quota on 1 Nov 2026), with retries.
TP=/Volumes/DarwinSSD/DataKadai/mmvideo-dk-tp; export TRACKS_BASE=/Volumes/DarwinSSD/MMVideo/docs/geo/research/SV01-sivakasi-fireworks/voice
D=/Volumes/DarwinSSD/MMVideo/scripts/sivakasi
echo "== hi paradox $(date +%T)"; $TP/.venv/bin/python $D/hindi_driver.py paradox_v1
python3 $D/reuse_tracks.py hi
echo "== hi long_road $(date +%T)"; $TP/.venv/bin/python $D/hindi_driver.py long_road_v1
echo "== done hi $(date +%T)"

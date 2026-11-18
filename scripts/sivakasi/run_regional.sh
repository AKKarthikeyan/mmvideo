#!/bin/zsh -l
# usage: run_regional.sh hi | run_regional.sh ta te   (voice both films; shared lines are voiced once)
TP=/Volumes/DarwinSSD/DataKadai/mmvideo-dk-tp; MV=/Volumes/DarwinSSD/MMVideo
export TRACKS_BASE=/Volumes/DarwinSSD/MMVideo/docs/geo/research/SV01-sivakasi-fireworks/voice
cd $TP
for L in $@; do
  PY=.venv/bin/python; [ $L != hi ] && PY=/Volumes/DarwinSSD/DataKadai/research/2026-10-28-voices/work/mayavenv/bin/python
  echo "== $L paradox $(date +%T)"; $PY scripts/datayt/long_tracks.py voice paradox_v1 $L
  python3 $MV/scripts/sivakasi/reuse_tracks.py $L
  echo "== $L long_road $(date +%T)"; $PY scripts/datayt/long_tracks.py voice long_road_v1 $L
done
echo "== done $@ $(date +%T)"

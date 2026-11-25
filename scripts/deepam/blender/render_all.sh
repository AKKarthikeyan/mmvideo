#!/bin/zsh
# Render the kd-deepam60 shots in parallel Blender processes (Freestyle runs on one core per process).
# Usage: [DEEPAM_JOBS=4] scripts/deepam/blender/render_all.sh [shots...]   (default: all 13; rendered shots are skipped)
cd "$(dirname "$0")/../../.."
shots=(${@:-k1 k2 k3 k4 k5 k6 k7 k8 k9 k10 k11 k13 k14})
jobs=${DEEPAM_JOBS:-4}
groups=(); for j in $(seq 1 $jobs); do groups+=(""); done
i=0; for s in $shots; do groups[$((i % jobs + 1))]+="$s "; i=$((i + 1)); done
for g in $groups; do
  [[ -n "$g" ]] && blender -b -P scripts/deepam/blender/deepam3d.py -- ${=g} 2>&1 | grep -E "CLIP|SKIP|Error|Traceback" &
done
wait; echo ALL DONE

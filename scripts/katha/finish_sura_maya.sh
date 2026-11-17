#!/usr/bin/env bash
# Finish the Surasamharam film's Tamil, Hindi and Telugu cuts with Maya, AK's local voice (AK, 17 Nov 2026).
# Run on the machine that has Maya, from the repo root, inside `zsh -lc` on the Mini:
#   SURA_TTS_CMD='<maya command> --lang {lang} --text-file {text} --out {out}' scripts/katha/finish_sura_maya.sh
# {text} is a UTF-8 text file with one beat's narration, {out} the .wav to write, {lang} is ta, hi or te.
# Or export Maya's clips by hand (one file per beat, b01.wav ... b20.wav; `python3 scripts/katha/voice_sura.py lines ta`
# prints the lines) into ~/maya/sura/<lang>/ and run:   SURA_CLIPS=~/maya/sura scripts/katha/finish_sura_maya.sh
set -euo pipefail
LANGS="${LANGS:-ta hi te}"
for l in $LANGS; do
  if [ -n "${SURA_CLIPS:-}" ]; then python3 scripts/katha/voice_sura.py "$l" --force --clips "$SURA_CLIPS/$l"
  else : "${SURA_TTS_CMD:?set SURA_TTS_CMD to Maya's command, or SURA_CLIPS to a folder of clips}"; python3 scripts/katha/voice_sura.py "$l" --force; fi
done
python3 scripts/katha/build_sura.py $LANGS          # re-time each cut to its voice
python3 scripts/katha/sura_score.py $LANGS          # score each cut to its new timing
python3 scripts/katha/build_sura.py $LANGS          # pick up the scores
npx remotion bundle src/index.ts --out-dir /tmp/sura-bundle --public-dir public
mkdir -p out/sura
for l in $LANGS; do npx remotion render /tmp/sura-bundle "KT-sura-$l" "out/sura/sura-$l.mp4" --crf=23; done
ls -la out/sura/sura-*.mp4

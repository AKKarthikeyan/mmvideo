#!/usr/bin/env bash
# Finish the Gita film on the Mini in one go: sounds, Jev's decisions, voices, render.
# Needs TYPESAFE_API_KEY (Jev) and MINIMAX_API_KEY (voices) in the shell. Safe to re-run: Jev's answers and the
# voiced lines are cached, so a second run only redoes what changed.
set -euo pipefail
cd "$(dirname "$0")/../.."
: "${TYPESAFE_API_KEY:?set TYPESAFE_API_KEY (Jev) first}"
: "${MINIMAX_API_KEY:?set MINIMAX_API_KEY (voices) first}"
python3 scripts/dharma/tanpura.py                                  # tanpura bed and bell (wav files are not in git)
python3 scripts/katha/sounds.py                                    # conch, flute and swell cues
python3 scripts/katha/ask_jev.py                                   # Krishna's own voice and the open decisions, by Jev
python3 scripts/katha/build_film.py scripts/katha/gita.json --tts  # voice every beat, re-time, run the four checks
mkdir -p out
npx remotion render src/index.ts KT-gita out/gita.mp4
echo "Done: out/gita.mp4. Description and chapter timestamps: public/katha/gita/description.txt"

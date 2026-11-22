#!/bin/sh
# Save the 20 Lemo-Opuscar styles we picked (docs/OPUSCAR_STYLES.md) to the Mac Mini's SSD.
#
#   sh scripts/vendor/fetch_opuscar_styles.sh            # code + style prompts + 20 demo films
#   NO_FILMS=1 sh scripts/vendor/fetch_opuscar_styles.sh # skip the films
#   DEST=/some/other/folder sh scripts/vendor/fetch_opuscar_styles.sh
#
# Run it on the Mac Mini. Safe to run again: it updates what is already there.
# What lands in $DEST stays on the SSD only. Never copy their *.md docs or style prompts into this repo
# (it is public, and those are CC BY-NC); their code is MIT and may be adapted with their notice kept.
set -eu

DEST=${DEST:-/Volumes/DarwinSSD/vendor/lemo-opuscar}
REPO=https://github.com/lemomo-ai/lemo-opuscar.git
FILMS_URL=https://github.com/lemomo-ai/lemo-opuscar/releases/download/films

STYLES="spreadsheet data-physical dataviz map-explainer white-model archive-lighttable visual-investigation
precise-mechanism hardcore-info security-xray glass-product halftone-dossier kino-montage countdown
transit-map lidar-survey chalkboard whiteboard sketchnote pictogram-motion"

case "$DEST" in /Volumes/*) [ -d "$(echo "$DEST" | cut -d/ -f1-3)" ] || { echo "SSD not mounted: $DEST"; exit 1; } ;; esac
mkdir -p "$DEST"

# 1. The library, sparse: root guides and licence files, core/, tools/, LICENSES/, the style index and our 20 styles.
if [ -d "$DEST/repo/.git" ]; then
  git -C "$DEST/repo" pull -q --ff-only
else
  git clone -q --filter=blob:none --sparse "$REPO" "$DEST/repo"
fi
paths="core tools LICENSES plugin"
for s in $STYLES; do paths="$paths styles/$s"; done
# shellcheck disable=SC2086
git -C "$DEST/repo" sparse-checkout set $paths
for s in $STYLES; do
  [ -f "$DEST/repo/styles/$s/STYLE.md" ] || { echo "missing style upstream: $s"; exit 1; }
done
COMMIT=$(git -C "$DEST/repo" rev-parse --short HEAD)

# 2. The demo films (CC BY 4.0, credit "Lemo-Opuscar by Lemomo (LemoLab)"; third-party parts per each demo's CREDITS).
if [ "${NO_FILMS:-0}" != 1 ]; then
  mkdir -p "$DEST/films"
  for s in $STYLES; do
    f="$DEST/films/$s.mp4"
    if [ -s "$f" ]; then echo "have  $s.mp4"; continue; fi
    i=0
    until curl -fsSL --retry 3 -o "$f.part" "$FILMS_URL/$s.mp4"; do
      i=$((i + 1)); [ $i -ge 4 ] && { echo "FAILED $s.mp4"; rm -f "$f.part"; continue 2; }
      sleep $((i * 5))
    done
    mv "$f.part" "$f"; echo "saved $s.mp4"
  done
fi

# 3. A note saying what this folder is.
cat > "$DEST/README_MMVIDEO.txt" <<EOF
Lemo-Opuscar, 20 styles picked for MMVideo (list and channel fit: MMVideo docs/OPUSCAR_STYLES.md).
Source: $REPO  commit $COMMIT  fetched $(date '+%Y-%m-%d')
repo/   sparse clone: guides, core/, tools/, LICENSES/, styles/<20 picks>
films/  the 20 demo films (720p/1080p MP4 from the project's "films" release)
Licence (repo/LICENSE): code MIT; docs and style prompts CC BY-NC 4.0 plus a permission to follow and adapt them
for our own films; demo films CC BY 4.0. Films we make with it are ours. Keep this folder off the public repo.
EOF
echo "done: $DEST (commit $COMMIT)"
du -sh "$DEST/repo" "$DEST/films" 2>/dev/null || true

#!/bin/zsh
# Push Data Kadai commits to GitHub from the MacBook Air. The working repo lives on DarwinSSD (attached to the Mac Mini),
# and the Mini cannot reach GitHub, so the Air fetches the branch from the SSD over SSH and pushes it on.
# Usage (on the Air): zsh push_from_air.sh [branch]      Nothing is kept on the Air afterwards.
set -e
BRANCH=${1:-claude/tn-alcohol-map}
SSD=mini-ts:/Volumes/DarwinSSD/DataKadai/mmvideo-dk
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
[[ "$BRANCH" == "main" ]] && { echo "never push main from here"; exit 1; }
git clone -q --branch "$BRANCH" --single-branch "$SSD" "$TMP/repo"
git -C "$TMP/repo" remote set-url origin https://github.com/akkarthikeyan/mmvideo.git
git -C "$TMP/repo" push origin "$BRANCH"

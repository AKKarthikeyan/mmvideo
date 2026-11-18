#!/usr/bin/env python3
"""Regional AUDIO TRACKS for the "What is a moat?" explainer (AK, 2 Oct 2026: "Dub it").

The explainer is not a public/vx video: its beats carry explicit "frames" and play back to back
(src/explainer/MoatExplainer.tsx and MoatVertical.tsx: Sequence from = sum of earlier frames, Audio at the start).
This wrapper feeds that timeline to scripts/audio_tracks.py and reuses its prep/build unchanged.

    python3 scripts/audio_tracks_explainer.py prep  explainer|explainer-vertical <lang>
    python3 scripts/audio_tracks_explainer.py build explainer|explainer-vertical <lang> [--gender male|female] [--video path.mp4]

Translation files: scripts/translations/explainer.<lang>.json and explainer-vertical.<lang>.json.
Output: out/audio/explainer/ and out/audio/explainer-vertical/ (not in git).
"""
import json, sys
import audio_tracks as A

DATA = {"explainer": "public/explainer/data.json", "explainer-vertical": "public/explainer/vertical/data.json"}


def load(vid):
    if vid not in DATA:
        raise SystemExit(f"unknown explainer id {vid}: use one of {list(DATA)}")
    return json.load(open(A.ROOT / DATA[vid]))


def timeline(D, short=None):
    if short is not None:
        raise SystemExit("the explainer has no Shorts: build explainer-vertical instead")
    out, f = [], 0
    for b in D["beats"]:
        out.append((b, f, b["frames"])); f += b["frames"]
    if f != D["total"]:
        raise SystemExit(f'beat frames add up to {f}, data.json total is {D["total"]}')
    return out, f


A.load, A.timeline = load, timeline

if __name__ == "__main__":
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    opt = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
    if len(a) >= 3 and a[0] == "prep":
        A.cmd_prep(a[1], a[2], None)
    elif len(a) >= 3 and a[0] == "build":
        A.cmd_build(a[1], a[2], None, opt("--gender", "male"), opt("--video"))
    else:
        raise SystemExit(__doc__)

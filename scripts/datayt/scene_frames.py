#!/usr/bin/env python3
"""One frame from the end of every beat or scene, for the frame check: python3 scripts/datayt/scene_frames.py <video> <data.json> <out dir>.
Uses the ffmpeg that ships with Remotion (npx remotion ffmpeg), so run it in a login shell."""
import json, subprocess, sys
vid, data, out = sys.argv[1], sys.argv[2], sys.argv[3]
d = json.load(open(data)); items = d.get("scenes") or d.get("beats")
for k, s in enumerate(items):
    t = max(s["t0"] + 0.5, s["t1"] - 0.4)
    subprocess.run(["npx", "remotion", "ffmpeg", "-y", "-loglevel", "error", "-ss", f"{t:.2f}", "-i", vid, "-frames:v", "1", "-vf", "scale=540:-1", f"{out}/s{k:02d}.png"], check=True)
print(len(items), "frames")

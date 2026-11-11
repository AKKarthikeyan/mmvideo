#!/usr/bin/env python3
"""Generate illustration plates for a Moat Files video with MiniMax image-01 (the only image provider; waits on 429s).
One house style for every plate; no text, no logos, no real-person likenesses. Skips plates that already exist.
Usage: gen_images.py <video id> [name ...]     (plates come from VIDEOS[i]["images"] = {name: prompt})"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import mm
from minimax import image
from vx_letters import VIDEOS
STYLE = ("Vintage mid-century editorial illustration, muted warm palette of cream, tan, charcoal and brick red, "
         "halftone print texture, visible paper grain, dramatic cinematic lighting, documentary mood. "
         "All signs, awnings, labels and papers are completely blank and plain. Absolutely no writing anywhere: no text, no letters, no words, no numbers, no logos, no brand names, no recognizable real people; any people are anonymous, seen from behind or in silhouette.")
def main():
    vid, names = sys.argv[1], sys.argv[2:]
    V = next(v for v in VIDEOS if v["id"] == vid)
    d = mm.PUBLIC / "vx" / vid / "img"; d.mkdir(parents=True, exist_ok=True)
    for name, prompt in V.get("images", {}).items():
        if names and name not in names: continue
        out = d / f"{name}.jpeg"
        if out.exists(): continue
        if not image(f"{prompt}. {STYLE}", out, 1920, 1080): raise SystemExit("image failed: " + out.name)
        print(" image", name, flush=True)
if __name__ == "__main__":
    main()

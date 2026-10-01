#!/usr/bin/env python3
"""Generate illustration plates for a Moat Files video with MiniMax image-01 (the only image provider; waits on 429s).
One house style for every plate; no text, no logos, no real-person likenesses. Skips plates that already exist.
Usage: gen_images.py <video id> [name ...]     (plates come from VIDEOS[i]["images"] = {name: prompt})"""
import base64, os, sys, time, pathlib, requests
sys.path.insert(0, os.path.dirname(__file__))
from vx_letters import VIDEOS
STYLE = ("Vintage mid-century editorial illustration, muted warm palette of cream, tan, charcoal and brick red, "
         "halftone print texture, visible paper grain, dramatic cinematic lighting, documentary mood. "
         "All signs, awnings, labels and papers are completely blank and plain. Absolutely no writing anywhere: no text, no letters, no words, no numbers, no logos, no brand names, no recognizable real people; any people are anonymous, seen from behind or in silhouette.")
def gen(prompt, out):
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "image-01", "prompt": f"{prompt}. {STYLE}", "width": 1920, "height": 1080, "response_format": "base64", "n": 1, "prompt_optimizer": False}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/image_generation", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=180).json()
        imgs = (j.get("data") or {}).get("image_base64") or []
        if imgs: out.write_bytes(base64.b64decode(imgs[0])); return
        print("  retry", out.name, j.get("base_resp"), flush=True); time.sleep(20 * (attempt + 1))
    raise SystemExit("image failed: " + out.name)
def main():
    vid, names = sys.argv[1], sys.argv[2:]
    V = next(v for v in VIDEOS if v["id"] == vid)
    d = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx") / vid / "img"; d.mkdir(parents=True, exist_ok=True)
    for name, prompt in V.get("images", {}).items():
        if names and name not in names: continue
        out = d / f"{name}.jpeg"
        if out.exists(): continue
        gen(prompt, out); print(" image", name, flush=True)
if __name__ == "__main__":
    main()

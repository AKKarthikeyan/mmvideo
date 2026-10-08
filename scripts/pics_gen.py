#!/usr/bin/env python3
"""Generate the text-free pictures a Vox video uses (AK 6 Oct 2026: "use picture more", MiniMax only).
Reads V["pics"] = {name: (prompt, "land"|"vert")} from scripts/vx_scripts.py and writes public/vx/<id>/pics/<name>.png.
Rules: the model draws NO text or numbers (all text/figures are drawn in code); stylized render, no real people,
no logos, no identifiable real buildings (keeps images clearly synthetic). Waits on 429s; never switches provider.
Usage: pics_gen.py <video id> [...] [--force]"""
import base64, os, sys, time, pathlib, requests
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from vx_scripts import VIDEOS
ROOT = pathlib.Path(__file__).resolve().parent.parent / "public" / "vx"
STYLE = (" Stylized cinematic 3D render, editorial finance illustration, rich contrast, warm highlights, shallow depth of field."
         " Absolutely no text, no letters, no numbers, no words, no logos, no signage, no watermarks, no people's faces.")
SIZE = {"land": (1920, 1080), "vert": (1080, 1920)}

def gen(prompt, out, orient):
    key = os.environ["MINIMAX_API_KEY"]; w, h = SIZE[orient]
    body = {"model": "image-01", "prompt": prompt + STYLE, "width": w, "height": h, "response_format": "base64", "n": 1, "prompt_optimizer": False}
    for attempt in range(8):
        try:
            j = requests.post("https://api.minimax.io/v1/image_generation", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=240).json()
        except Exception as e:
            j = {"base_resp": str(e)}
        im = (j.get("data") or {}).get("image_base64") or []
        if im:
            out.write_bytes(base64.b64decode(im[0])); return True
        print("  retry", out.name, j.get("base_resp")); time.sleep(20 * (attempt + 1))
    print("  FAILED", out.name); return False

def main():
    ids = [a for a in sys.argv[1:] if not a.startswith("--")]; force = "--force" in sys.argv
    for V in VIDEOS:
        if V["id"] not in ids or not V.get("pics"): continue
        d = ROOT / V["id"] / "pics"; d.mkdir(parents=True, exist_ok=True)
        for name, (prompt, orient) in V["pics"].items():
            out = d / f"{name}.png"
            if out.exists() and not force: print("have", out.name); continue
            print("gen", V["id"], name, orient, "ok" if gen(prompt, out, orient) else "FAIL")

if __name__ == "__main__":
    main()

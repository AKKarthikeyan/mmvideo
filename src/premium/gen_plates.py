#!/usr/bin/env python3
"""Premium style test, treatment B: painted plates from MiniMax image-01 (the only image provider; waits and retries on
rate limits, never switches provider). One house style for every plate; no text in any image. Skips plates that exist.
Usage (inside zsh -lic so MINIMAX_API_KEY is set): python3 src/premium/gen_plates.py [name ...]"""
import base64, os, sys, time, pathlib, requests
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/premium/b")
STYLE = ("Warm painterly storybook illustration in soft gouache and digital painting, rich golden-hour light from the left, "
         "soft long shadows, gentle atmospheric haze and depth, harmonious palette of honey gold, deep teal water, sage and "
         "emerald green hills, terracotta roofs, cream stone and soft peach sky, rounded friendly shapes, premium animated "
         "film background quality for a children's picture book, calm uncluttered composition. "
         "Absolutely no text, no letters, no numbers, no writing on signs, no logos, no people, no animals.")
PLATES = {
  "establish": ("Wide establishing landscape. A small fairytale stone castle with three round towers and terracotta red "
                "conical roofs stands on a gentle green hill in the upper middle of the picture. A wide ring of deep "
                "blue-teal water completely surrounds the hill like a moat, with sparkling sunlight reflections. In the lower "
                "quarter of the picture an empty sunlit dirt road runs straight across the whole width of the picture through "
                "a grassy meadow, with nothing standing on it. Distant soft blue rolling hills and fluffy clouds behind, warm sunrise sky."),
  "lake": ("Wide calm panoramic landscape at golden hour. A tiny fairytale stone castle with terracotta conical roofs sits on a "
           "distant green hill at the far left edge. A broad calm lake of deep teal water fills the bottom fifth of the picture "
           "from edge to edge. Above it a huge open soft peach and pale gold sky with a few gentle clouds fills most of the "
           "picture, leaving lots of calm empty space in the middle and on the right."),
  "stage": ("Wide golden-hour landscape seen from a low angle. In the foreground a flat sunny grassy meadow plateau fills the "
            "bottom third of the picture from edge to edge. A small distant fairytale castle with terracotta conical roofs sits on a "
            "little hill at the far right edge. Soft rolling blue-green hills on the horizon. A big open soft peach and gold sky with "
            "a few gentle clouds fills the upper half, with calm empty space in the centre of the picture"),
  "shop_a": ("One small cosy village corner shop seen straight from the front, cream walls, a red and white striped cloth awning, "
             "a wooden counter with baskets of oranges and green vegetables, a small tiled roof. Single game-asset sprite: the shop alone, "
             "cut out on a solid flat pure white background, nothing else in the picture, no landscape, no water, no hills, no clouds, no plants, no ground, no shadow"),
  "shop_b": ("One small cosy village corner shop seen straight from the front, pale yellow walls, a teal and white striped cloth "
             "awning, a wooden counter with jars of sweets and sacks of rice, a small tiled roof. Single game-asset sprite: the shop "
             "alone, cut out on a solid flat pure white background, nothing else in the picture, no landscape, no water, no hills, no clouds, no plants, no ground, no shadow"),
}
def gen(name, prompt, out):
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "image-01", "prompt": f"{prompt}. {STYLE}", "width": 1920, "height": 1080, "response_format": "base64", "n": 1, "prompt_optimizer": False}
    for attempt in range(8):
        try:
            j = requests.post("https://api.minimax.io/v1/image_generation", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=240).json()
        except Exception as e:
            j = {"base_resp": str(e)}
        imgs = (j.get("data") or {}).get("image_base64") or []
        if imgs:
            out.write_bytes(base64.b64decode(imgs[0])); print(" image", name, flush=True); return
        print("  retry", name, j.get("base_resp"), flush=True); time.sleep(30 * (attempt + 1))
    raise SystemExit("image failed: " + name)
if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    want = sys.argv[1:]
    for n, p in PLATES.items():
        if want and n not in want: continue
        o = OUT / f"{n}.jpeg"
        if o.exists(): continue
        t = time.time(); gen(n, p, o); print("  took", round(time.time() - t), "s", flush=True)

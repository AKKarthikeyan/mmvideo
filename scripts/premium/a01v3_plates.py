#!/usr/bin/env python3
"""A01 v3 painted plates (MiniMax image-01 only; on rate limits wait and retry, never switch provider).
One house style prefix for every plate. Writes raw candidates to public/premium/a01v3/plates/raw/<name>_<k>.jpeg and
appends every call to plates/plate_log.jsonl. Skips names whose candidates exist.
Usage (inside zsh -lic so MINIMAX_API_KEY is set): python3 scripts/premium/a01v3_plates.py [name ...]"""
import base64, json, os, sys, time, pathlib, requests
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/premium/a01v3/plates")
STYLE = ("Warm painterly storybook illustration in soft gouache and digital painting, premium animated-film background quality "
         "for a children's picture book, rounded friendly shapes, visible soft brush texture, gentle atmospheric haze and depth, "
         "harmonious palette of honey gold, deep teal, sage and emerald green, terracotta, cream stone and soft peach. "
         "Absolutely no text, no letters, no numbers, no writing anywhere, no logos, no brand marks, no watermark, no signature, "
         "no people, no faces, no animals.")
SPRITE = (" Isolated single object, game-asset sprite, centred with generous empty margin all round, on a solid flat pure white "
          "background, nothing else in the picture, no ground, no floor, no shadow, no reflection.")
PLATES = {
  # name: (prompt, width, height, n)
  "plinth_room": ("A dark warm empty museum display hall at night. In the lower middle of the picture stands one large round low "
                  "plinth of polished honey-coloured wood with a cream stone rim, seen from slightly above, wide, flat and completely "
                  "empty on top. Behind it a deep chocolate-brown velvet curtain wall fades into darkness, soft dust haze in the air, "
                  "a dim warm glow on the plinth. Mostly dark, calm and theatrical, with lots of empty dark space above the plinth", 1920, 1080, 2),
  "soda_can": ("One plain glossy red aluminium soda can standing upright, seen from the front at eye level, cold condensation "
               "droplets, silver top rim and ring pull, the red body completely blank with no label, no logo and no writing." + SPRITE, 1024, 1024, 2),
  "razor": ("One classic chrome steel safety razor standing upright on the end of its handle, head at the top, seen from the front, "
            "polished steel with warm highlights, simple elegant shape, no engraving and no writing." + SPRITE, 1024, 1024, 2),
  "plane": ("One small friendly silver passenger jet airliner seen from the side, flying to the right, plain silver body with a soft "
            "teal stripe along the side, round windows, no airline name, no logo, no letters, no numbers, no registration marks." + SPRITE, 1024, 1024, 2),
  "fork": ("A painted path seen from a walker's eye height, splitting into two at a fork near the centre of the picture. "
           "The left branch is warm golden sunlit sand winding up a green hill toward a soft golden sunrise glow. "
           "The right branch is cracked grey stone slabs leading into a dim grey misty dusk with bare grey trees. "
           "Strong contrast: warm gold on the left half, cool grey on the right half", 1920, 1080, 2),
  "castle": ("Wide golden-hour landscape. A fairytale cream stone castle with three round towers and terracotta conical roofs stands "
             "on a gentle green hill in the centre of the picture. A wide ring of deep teal water completely surrounds the hill as a "
             "moat, with sparkling sunlight reflections and grassy banks. A golden sandy path runs from the bottom centre of the "
             "picture straight up to the water's edge in front of the castle gate. Soft distant blue-green hills, a big open warm peach "
             "and gold sky with a few soft clouds fills the top third", 1920, 1080, 2),
  "street": ("A cosy Indian neighbourhood market street at dusk, seen from slightly above at the near end, the street running away "
             "from the viewer into the distance. A row of small friendly shops on both sides with colourful striped cloth awnings and "
             "wooden counters of fruit, vegetables, spice sacks and steel pots, plain blank signboards with nothing on them, strings "
             "of small round unlit bulbs, potted plants and a parked bicycle, warm terracotta and cream walls, soft peach and lavender "
             "dusk sky. Far in the distance at the end of the street, a small fairytale castle with terracotta roofs on a green hill", 1920, 1080, 2),
  "plane2": ("One small friendly silver passenger jet airliner seen exactly from the side, flying to the right, wheels up, a completely plain "
             "unmarked silver body with one soft teal stripe along the side, round windows, absolutely no markings of any kind, no airline name, "
             "no logo, no letters, no numbers, no registration, nothing written on the engines or tail." + SPRITE, 1024, 1024, 3),
  "plinth2": ("A dark warm empty museum display hall at night. Filling the lower half of the picture stands one large wide round low plinth of "
              "polished honey-coloured wood with a cream stone rim, seen from slightly above, wide, flat and completely empty on top, its front "
              "edge close to the bottom of the picture. Behind it a deep chocolate-brown velvet curtain wall fades into darkness, soft dust haze "
              "in the air, a dim warm glow on the plinth. Mostly dark, calm and theatrical, with plain clean corners", 1920, 1080, 2),
  "castle2": ("Wide golden-hour landscape seen from slightly above. A fairytale cream stone castle with three round towers and terracotta conical "
              "roofs stands on a round green hill island in the centre of the picture. An unbroken wide ring of deep teal water surrounds the island "
              "on every side like a moat, with soft sunlight sparkles; no bridge, no causeway and no path crosses the water. A golden sandy path "
              "comes from the bottom centre of the picture and stops at the outer grassy bank of the water. Grassy meadow outside the ring, soft "
              "distant blue-green hills, a big open warm peach and gold sky with a few soft clouds fills the top third", 1920, 1080, 3),
  "street2": ("A cosy small-town Indian market lane at dusk, painted in soft gouache with loose visible brush strokes like a classic "
              "children's picture-book painting, seen from slightly above at the near end with the lane running away into the distance. Low "
              "shops on both sides with colourful striped cloth awnings and baskets of fruit, vegetables and spice sacks on wooden counters; "
              "the shops have no signboards at all and no boards above the awnings. Warm terracotta and cream walls, a few potted plants, a "
              "parked bicycle, strings of small round unlit bulbs. Soft peach and lavender dusk sky. Far away at the end of the lane, a small "
              "fairytale castle with terracotta roofs on a green hill. Clean empty corners", 1920, 1080, 3),
  "plane3": ("A children's picture-book gouache painting of one cute chubby little silver passenger airliner seen from the side, flying to "
             "the right, wheels up, simple rounded shapes, a short row of round windows, one soft teal stripe, soft gouache brush strokes, "
             "completely plain and unmarked like a toy, no letters, no numbers, no symbols anywhere on it." + SPRITE, 1024, 1024, 4),
}
def gen(name, prompt, w, h, n):
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "image-01", "prompt": f"{prompt}. {STYLE}", "width": w, "height": h, "response_format": "base64", "n": n, "prompt_optimizer": False}
    for attempt in range(10):
        try:
            j = requests.post("https://api.minimax.io/v1/image_generation", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=300).json()
        except Exception as e:
            j = {"base_resp": str(e)}
        imgs = (j.get("data") or {}).get("image_base64") or []
        if imgs:
            files = []
            for k, b in enumerate(imgs):
                p = OUT / "raw" / f"{name}_{k}.jpeg"; p.write_bytes(base64.b64decode(b)); files.append(p.name)
            with open(OUT / "plate_log.jsonl", "a") as fh:
                fh.write(json.dumps({"name": name, "prompt": body["prompt"], "size": [w, h], "files": files, "t": time.strftime("%Y-%m-%d %H:%M:%S")}) + "\n")
            print(" image", name, files, flush=True); return
        print("  retry", name, j.get("base_resp"), flush=True); time.sleep(30 * (attempt + 1))
    raise SystemExit("image failed: " + name)
if __name__ == "__main__":
    (OUT / "raw").mkdir(parents=True, exist_ok=True)
    want = sys.argv[1:]
    for nm, (p, w, h, n) in PLATES.items():
        if want and nm not in want: continue
        if not want and (OUT / "raw" / f"{nm}_0.jpeg").exists(): continue
        t = time.time(); gen(nm, p, w, h, n); print("  took", round(time.time() - t), "s", flush=True)

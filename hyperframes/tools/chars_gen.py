"""Amma and Ravi test portraits via MiniMax image-01 (made-up people; labelled Illustration on screen). Key from env, never printed."""
import base64, json, os, sys, time, urllib.request
OUT = "/Volumes/DarwinSSD/MMVideo/hyperframes/media_src/characters/"; os.makedirs(OUT, exist_ok=True)
AMMA = ("a warm Tamil grandmother in her early sixties, grey hair in a neat bun, small red bindi, cotton silk saree in deep maroon with a gold border, "
        "one thick traditional gold bangle on her wrist which she touches proudly, gentle knowing smile, waist-up, facing slightly left")
RAVI = ("a friendly Indian man in his mid thirties, short black hair, trimmed beard, light blue office shirt with sleeves rolled, "
        "holding a smartphone and smiling with quiet confidence, waist-up, facing slightly right")
BG = " Isolated on a plain flat light grey studio background, nothing else in the frame, full head and shoulders clearly visible with space around."
NOTXT = " No text, no letters, no logos, no watermark."
STYLES = {
  "illus": " Flat editorial illustration in a cut-paper collage style, bold simple shapes, gentle grain texture, limited palette of cream, maroon, gold and ink black, like a magazine explainer illustration.",
  "photo": " Realistic documentary portrait photograph, natural soft window light, 85mm lens, true skin texture, candid and dignified, not glamorous.",
}
def gen(prompt, out, w=1024, h=1280):
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "image-01", "prompt": prompt, "width": w, "height": h, "response_format": "base64", "n": 2, "prompt_optimizer": False}
    for attempt in range(5):
        req = urllib.request.Request("https://api.minimax.io/v1/image_generation", data=json.dumps(body).encode(),
                                     headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"})
        try: j = json.load(urllib.request.urlopen(req, timeout=300))
        except Exception as e: j = {"base_resp": str(e)[:200]}
        ims = (j.get("data") or {}).get("image_base64") or []
        if ims:
            for i, b in enumerate(ims): open(f"{out}_{i}.png", "wb").write(base64.b64decode(b))
            print("ok", os.path.basename(out), len(ims)); return
        print("retry", os.path.basename(out), j.get("base_resp")); time.sleep(15 * (attempt + 1))
    print("FAILED", out)
for style, s in STYLES.items():
    gen(AMMA + BG + s + NOTXT, OUT + f"amma_{style}")
    gen(RAVI + BG + s + NOTXT, OUT + f"ravi_{style}")

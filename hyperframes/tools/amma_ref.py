import base64, json, os, time, urllib.request
C = "/Volumes/DarwinSSD/MMVideo/hyperframes/media_src/characters/"
ref = "data:image/jpeg;base64," + base64.b64encode(open(C + "amma_illus_1.jpg", "rb").read()).decode()
P = {
     "amma_door2": "The same grandmother, in the same deep maroon saree with a gold border over a cream blouse, grey hair in a bun, small red bindi, stands at her front door, arms folded, politely shaking her head no at a bank officer whose back is to the camera."}
STY = " Flat editorial illustration in a cut-paper collage style, bold simple shapes, gentle grain texture, limited palette of cream, maroon, gold and ink black. Plain light grey background. No text, no letters, no logos."
for name, pr in P.items():
    body = {"model": "image-01", "prompt": pr + STY, "width": 1280, "height": 1024, "response_format": "base64", "n": 1,
            "prompt_optimizer": False, "subject_reference": [{"type": "character", "image_file": ref}]}
    for a in range(4):
        req = urllib.request.Request("https://api.minimax.io/v1/image_generation", data=json.dumps(body).encode(),
              headers={"Authorization": "Bearer " + os.environ["MINIMAX_API_KEY"], "Content-Type": "application/json"})
        try: j = json.load(urllib.request.urlopen(req, timeout=300))
        except Exception as e: j = {"base_resp": str(e)[:200]}
        ims = (j.get("data") or {}).get("image_base64") or []
        if ims: open(C + name + ".jpg", "wb").write(base64.b64decode(ims[0])); print("ok", name); break
        print("retry", name, j.get("base_resp")); time.sleep(15)

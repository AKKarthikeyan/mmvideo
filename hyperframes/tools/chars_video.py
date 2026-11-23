"""Test: animate the illustrated Amma and Ravi masters with MiniMax Hailuo image-to-video. Key from env, never printed."""
import base64, json, os, sys, time, urllib.request
C = "/Volumes/DarwinSSD/MMVideo/hyperframes/media_src/characters/"; OUT = C + "anim/"; os.makedirs(OUT, exist_ok=True)
KEY = os.environ["MINIMAX_API_KEY"]; BASE = "https://api.minimax.io/v1/"
KEEP = (" Static locked-off camera, no zoom. Keep the plain flat light grey background exactly as it is. Keep the same flat cut-paper "
        "illustration style, same face, same clothes. No new objects, no text.")
JOBS = {
 "amma_turn": ("amma_illus_1.jpg", "The grandmother slowly turns her head to look to her left, then back to the viewer with a warm smile, "
               "and lifts her right hand to show the gold bangle on her wrist, her shoulders turning slightly with the movement." + KEEP),
 "amma_no": ("amma_illus_1.jpg", "The grandmother gently shakes her head no with a knowing smile, then folds her hands together." + KEEP),
 "ravi_turn": ("ravi_illus_1.jpg", "The man looks up from his phone, turns his body slightly to his right, nods happily and gestures with his free hand "
               "as if explaining something." + KEEP),
}
def call(path, body=None):
    req = urllib.request.Request(BASE + path, data=json.dumps(body).encode() if body else None,
                                 headers={"Authorization": "Bearer " + KEY, "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=120))
tasks = {}
for name, (img, prompt) in JOBS.items():
    if os.path.exists(OUT + name + ".mp4"): continue
    ref = "data:image/jpeg;base64," + base64.b64encode(open(C + img, "rb").read()).decode()
    for model in ("MiniMax-Hailuo-02", "I2V-01"):
        try:
            j = call("video_generation", {"model": model, "prompt": prompt, "first_frame_image": ref, "duration": 6, "resolution": "768P"} if model.startswith("MiniMax") else
                     {"model": model, "prompt": prompt, "first_frame_image": ref})
        except Exception as e:
            j = {"base_resp": str(e)[:200]}
        if j.get("task_id"): tasks[name] = j["task_id"]; print("submitted", name, model, flush=True); break
        print("refused", name, model, j.get("base_resp"), flush=True)
t0 = time.time()
while tasks and time.time() - t0 < 1800:
    time.sleep(30)
    for name, tid in list(tasks.items()):
        try: j = call("query/video_generation?task_id=" + tid)
        except Exception as e: print("poll err", name, str(e)[:100]); continue
        st = j.get("status")
        if st == "Success":
            f = call("files/retrieve?file_id=" + str(j["file_id"]))["file"]["download_url"]
            open(OUT + name + ".mp4", "wb").write(urllib.request.urlopen(f, timeout=300).read())
            print("done", name, flush=True); del tasks[name]
        elif st == "Fail":
            print("failed", name, j.get("base_resp"), flush=True); del tasks[name]
print("left", list(tasks))

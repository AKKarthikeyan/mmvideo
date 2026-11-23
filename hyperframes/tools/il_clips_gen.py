"""Gold V3 character clips C4-C9: first frames from the master drawings (MiniMax image-01 + subject_reference), then 6 s
Hailuo-02 image-to-video. Key from env, never printed. Skips anything already made."""
import base64, json, os, time, urllib.request
C = "/Volumes/DarwinSSD/MMVideo/hyperframes/media_src/characters/"; A = C + "anim/"; os.makedirs(A, exist_ok=True)
KEY = os.environ["MINIMAX_API_KEY"]; BASE = "https://api.minimax.io/v1/"
def call(path, body=None):
    req = urllib.request.Request(BASE + path, data=json.dumps(body).encode() if body else None,
                                 headers={"Authorization": "Bearer " + KEY, "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=300))
b64 = lambda p: "data:image/jpeg;base64," + base64.b64encode(open(p, "rb").read()).decode()
AMMA = ("the same grandmother, in the same deep maroon saree with a gold border over a cream blouse, grey hair in a bun, small red bindi, "
        "one thick gold bangle on her wrist")
RAVI = "the same man, short black hair, trimmed beard, light blue office shirt with sleeves rolled"
STY = (" Flat editorial illustration in a cut-paper collage style, bold simple shapes, gentle grain texture, limited palette of cream, maroon, "
       "gold and ink black. No text, no letters, no numbers, no logos.")
PLAIN = " Plain flat light grey background, nothing else, whole upper body inside the frame with space around."
FIRST = {  # name: (reference master, prompt, w, h)
 "f_locker": ("amma_illus_1.jpg", AMMA + " stands alone beside an open grey steel almirah locker in a simple Indian home, seen from the side at waist height, lamp light; the inner shelf holds a small red cloth pouch. She is the only person in the picture; no second woman, no mirror, no reflection." + STY, 1280, 960),
 "f_counter": ("amma_illus_1.jpg", AMMA + " sits at a plain bank counter with a glass partition, placing her gold bangle on a small tray, a clerk's hands visible across the counter, no signs or logos." + STY, 1280, 960),
 "f_envelope": ("ravi_illus_1.jpg", RAVI + " holds a sealed cream envelope with a gold ribbon in both hands, about to open it, excited." + PLAIN + STY, 1024, 1280),
}
CLIPS = {  # name: (first frame file, motion prompt)
 "c4_locker_open": ("f_locker.jpg", "She slowly opens the locker door wider, takes out the red cloth pouch and lifts out the gold bangle, smiling at it. Static camera."),
 "c9_locker_close": ("f_locker.jpg", "She places the gold bangle into the red pouch, puts it on the shelf and gently closes the locker door, satisfied. Static camera."),
 "c5_door": ("amma_door2.jpg", "The grandmother listens to the man at her door, then politely shakes her head no with a knowing smile and begins to close the door. Static camera."),
 "c8_counter": ("f_counter.jpg", "She slides the tray with the gold bangle under the glass to the clerk, then later the clerk slides it back and she happily puts it back on her wrist. Static camera."),
 "c6_ravi_pay": ("ravi_illus_1.jpg", "The man taps his phone to pay, nods with satisfaction and shows the phone screen toward the viewer for a moment, keeping his hands inside the frame. Static camera, background stays plain."),
 "c7_ravi_envelope": ("f_envelope.jpg", "He tears open the envelope, reads what is inside and his face lights up in delighted surprise, keeping his hands inside the frame. Static camera, background stays plain."),
}
KEEP = " Keep the same flat cut-paper illustration style, same face and same clothes, no new people unless described, no text."
for name, (ref, prompt, w, h) in FIRST.items():
    out = C + name + ".jpg"
    if os.path.exists(out): continue
    for a in range(4):
        try:
            j = call("image_generation", {"model": "image-01", "prompt": prompt, "width": w, "height": h, "response_format": "base64", "n": 1,
                                          "prompt_optimizer": False, "subject_reference": [{"type": "character", "image_file": b64(C + ref)}]})
        except Exception as e: j = {"base_resp": str(e)[:150]}
        ims = (j.get("data") or {}).get("image_base64") or []
        if ims: open(out, "wb").write(base64.b64decode(ims[0])); print("image", name, flush=True); break
        print("retry image", name, j.get("base_resp"), flush=True); time.sleep(20)
tasks = {}
for name, (first, prompt) in CLIPS.items():
    if os.path.exists(A + name + ".mp4") or not os.path.exists(C + first): continue
    try:
        j = call("video_generation", {"model": "MiniMax-Hailuo-02", "prompt": prompt + KEEP, "first_frame_image": b64(C + first), "duration": 6, "resolution": "768P"})
    except Exception as e: j = {"base_resp": str(e)[:150]}
    if j.get("task_id"): tasks[name] = j["task_id"]; print("submitted", name, flush=True)
    else: print("refused", name, j.get("base_resp"), flush=True)
t0 = time.time()
while tasks and time.time() - t0 < 2400:
    time.sleep(30)
    for name, tid in list(tasks.items()):
        try: j = call("query/video_generation?task_id=" + tid)
        except Exception as e: continue
        if j.get("status") == "Success":
            url = call("files/retrieve?file_id=" + str(j["file_id"]))["file"]["download_url"]
            open(A + name + ".mp4", "wb").write(urllib.request.urlopen(url, timeout=300).read()); print("done", name, flush=True); del tasks[name]
        elif j.get("status") == "Fail":
            print("failed", name, j.get("base_resp"), flush=True); del tasks[name]
print("left", list(tasks))

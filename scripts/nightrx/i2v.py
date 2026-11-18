#!/usr/bin/env python3
"""The Night Pharmacist: turn each locked still into a moving shot with MiniMax Hailuo image-to-video.
The still is the first frame, so the face we approved is the face that moves. Submits every missing clip at once,
then polls them together. Skips clips that already exist. Each clip costs money on the MiniMax account.

  zsh -lic 'python3 scripts/nightrx/i2v.py'            # every shot in SHOTS that has no clip yet
  zsh -lic 'python3 scripts/nightrx/i2v.py p03 p08'    # just these
Writes public/nightrx/styletest/clip/<panel>.mp4 (1364x768, 24 fps). No lip-sync: talking shots move the mouth generically."""
import base64, os, socket, sys, time, pathlib, requests
import urllib3.util.connection as uc
uc.allowed_gai_family = lambda: socket.AF_INET          # the Mini's IPv6 route hangs

ROOT = pathlib.Path(__file__).resolve().parents[2]
LOOK_NAME = os.environ.get("NRX_LOOK", "ink")       # "live" = the live-action look AK chose on 24 Oct
BASE = ROOT / ("public/nightrx/styletest_live" if LOOK_NAME == "live" else "public/nightrx/styletest")
IMG, CLIP = BASE / "img/clean", BASE / "clip"
API = "https://api.minimax.io/v1"
MODEL = os.environ.get("NRX_VIDEO_MODEL", "MiniMax-Hailuo-02")
# v1 of p04 drifted toward 3D claymation by the last second; this wording holds the drawn look.
LOOK = (" Hand-drawn 2D animation in the exact ink graphic-novel style of the first frame: thick black outlines, flat cel-shaded colours; "
        "not 3D, not claymation, not photoreal. Keep the same face, hair colour and clothes. Steady cinematic camera. "
        "Absolutely no subtitles, no captions, no speech bubbles, no letters, words or writing anywhere in the frame.")
if LOOK_NAME == "live":
    LOOK = (" Photorealistic live-action film footage that matches the first frame exactly: the same real actors, faces, hair and clothes, "
            "natural skin, 35mm film look, moody night grade; subtle, natural human motion; steady cinematic camera. "
            "Absolutely no subtitles, no captions, no speech bubbles, no letters, words or writing anywhere in the frame.")
# Pass 1 (24 Oct): 7 of 12 clips burned fake subtitles into the bottom of the frame, mostly the talking shots.

# panel: (seconds, action). 10 s where the cut holds the shot longer than a 6 s clip can cover.
SHOTS = {
    "p01": (6, "Slow cinematic push-in down the empty night street toward the glowing corner pharmacy; the green neon cross flickers; "
               "a thin mist drifts under the sodium-orange street lamps; a stray dog trots across the road in the distance"),
    "p03": (6, "The woman behind the counter looks up toward the door and her face breaks into a warm amused smile; her lips move "
               "gently as she speaks; her reading glasses stay up on top of her head"),
    "p04": (6, "The old man steps in through the pharmacy doorway, smiling warmly under his moustache, and raises the steel coffee tumbler "
               "toward the camera as if offering it; the green neon light flickers softly behind him"),
    "p05": (6, "Hot coffee pours in a long stream from the steel tumbler held high into the wide steel bowl; froth swirls and steam rises; "
               "the hand keeps pouring steadily; only the hand, tumbler, bowl and steam move"),
    "p06": (10, "The young man whispers excitedly into the phone held close to his face, lips moving; his eyes dart sideways toward something "
                "off-screen and back to the phone; slight hand-held wobble"),
    "p07": (6, "The old man turns the open order book around on the counter toward the viewer, taps the bottom of the page with one finger "
               "and talks persuasively, smiling"),
    "p08": (10, "The hand signs slowly with the black fountain pen at the very bottom of the page, the nib moving in a loose signature; "
                "the many empty rows above stay blank; very slow push-in"),
    "p09": (6, "The woman laughs and wags her finger teasingly toward someone off-screen to the right, speaking with a playful grin"),
    "p09b": (6, "The old man flexes his arm like a proud strongman and laughs heartily, shoulders shaking"),
    "p10": (6, "The old man tears the thin carbon copy out of the order book with a flourish and holds the small plain sheet out across the counter "
               "with a gallant little nod; the sheet stays small and blank"),
    "p11": (6, "The hand pulls the car keys up out of the shirt pocket and the keys swing; the bright red foil strip of pills slips half out "
               "of the pocket and catches the light; slow push-in toward the red strip"),
}
if LOOK_NAME == "live":   # live pass 1: the strip multiplied into several glowing, LED-like packs
    SHOTS["p11"] = (6, "The hand lifts the car keys out of the pocket and the keys swing; one single red foil blister strip of pills slips half out "
                       "of the pocket; it is ordinary matte foil that only reflects the light, it does not glow and it does not multiply; slow push-in")
SHOTS = {**SHOTS,
    "p12": (6, "The woman sips from the steel tumbler and watches through the glass as the small cream car outside pulls away from the kerb "
               "and drives off down the street, tail lights streaking"),
}


def hdr():
    return {"Authorization": f"Bearer {os.environ['MINIMAX_API_KEY']}"}


def submit(panel):
    secs, action = SHOTS[panel]
    first = "data:image/jpeg;base64," + base64.b64encode((IMG / f"{panel}.jpeg").read_bytes()).decode()
    body = {"model": MODEL, "prompt": action.rstrip(".") + "." + LOOK, "first_frame_image": first,
            "duration": secs, "resolution": "768P", "prompt_optimizer": False}
    for attempt in range(6):
        j = requests.post(f"{API}/video_generation", headers=hdr(), json=body, timeout=120).json()
        if j.get("task_id"): return j["task_id"]
        print("  submit retry", panel, j.get("base_resp"), flush=True); time.sleep(20 * (attempt + 1))
    raise SystemExit("submit failed: " + panel)


def main():
    CLIP.mkdir(parents=True, exist_ok=True)
    todo = [p for p in (sys.argv[1:] or SHOTS) if not (CLIP / f"{p}.mp4").exists()]
    tasks = {}
    for p in todo:
        tasks[p] = submit(p); print("task", p, tasks[p], flush=True)
    t0 = time.time(); failed = []
    while tasks:
        time.sleep(20)
        for p, task in list(tasks.items()):
            q = requests.get(f"{API}/query/video_generation", headers=hdr(), params={"task_id": task}, timeout=60).json()
            st = q.get("status")
            if st == "Success":
                f = requests.get(f"{API}/files/retrieve", headers=hdr(), params={"file_id": q["file_id"]}, timeout=60).json()
                (CLIP / f"{p}.mp4").write_bytes(requests.get(f["file"]["download_url"], timeout=300).content)
                print(f" clip {p} ({int(time.time() - t0)}s)", flush=True); del tasks[p]
            elif st == "Fail":
                print(" FAILED", p, q.get("base_resp"), flush=True); failed.append(p); del tasks[p]
        if time.time() - t0 > 2400:
            print(" timed out:", list(tasks)); failed += list(tasks); break
    if failed: raise SystemExit("failed: " + " ".join(failed))


if __name__ == "__main__":
    main()

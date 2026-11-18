#!/usr/bin/env python3
"""The Night Pharmacist: animation-style sampler. AK found the ink motion comic (v1 stills, v2 moving) unsatisfying,
so the same two shots (Raghavan offers the coffee; Meena greets him) are made in four different looks for AK to pick.
Stills come from MiniMax image-01 (text-only prompts, no character reference, so each look draws its own faces),
then each still is animated with Hailuo-02 image-to-video. Writes public/nightrx/styles/{img,clip}/<style>_<shot>.*
and public/nightrx/styles/data.json for the StyleReel composition.

  zsh -lic 'python3 scripts/nightrx/styles.py img'     # 8 stills
  zsh -lic 'python3 scripts/nightrx/styles.py clip'    # 8 clips (costs money on the MiniMax account)
  zsh -lic 'python3 scripts/nightrx/styles.py data'    # timeline for src/nightrx/StyleReel.tsx"""
import base64, json, os, socket, subprocess, sys, time, pathlib, requests
import urllib3.util.connection as uc
uc.allowed_gai_family = lambda: socket.AF_INET          # the Mini's IPv6 route hangs

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "public/nightrx/styles"
IMG, CLIP = OUT / "img", OUT / "clip"
VO = ROOT / "public/nightrx/styletest/vo"                  # reuse the style-test voices: r1 (Raghavan), m1 (Meena)
API = "https://api.minimax.io/v1"
FFMPEG = ROOT / "node_modules/@remotion/compositor-darwin-arm64/ffmpeg"

NOTEXT = "Completely blank signs, labels and boxes: absolutely no text, no letters, no numbers, no logos anywhere."
STYLES = {   # key: (label on screen, still style, motion style)
    "live": ("LIVE-ACTION CINEMATIC",
             "Cinematic live-action film still shot on 35mm with an anamorphic lens, photorealistic real actors with natural skin texture, "
             "shallow depth of field, moody night colour grade with green neon and sodium-orange practical lights, subtle film grain",
             "photorealistic live-action film"),
    "cg3d": ("3D ANIMATED FEATURE",
             "3D animated feature film still, stylized expressive characters with slightly exaggerated proportions, soft subsurface skin, "
             "rich global illumination, warm cinematic lighting with green neon and sodium-orange light, high-end animation studio quality",
             "3D animated feature film"),
    "anime": ("ANIME FILM",
              "Japanese anime feature film still, hand-drawn cel-animated characters with clean line art and soft cel shading, "
              "lush hand-painted background, glowing green neon and warm street lights, theatrical anime film quality",
              "hand-drawn Japanese anime film"),
    "clay": ("STOP-MOTION",
             "Claymation stop-motion film still: the characters are obviously handmade plasticine puppets with oversized heads, "
             "simplified rounded features, bead-like eyes, visible thumbprints and sculpting marks, tiny felt and fabric clothes; "
             "a miniature handmade cardboard-and-clay pharmacy set with tiny practical lights, green neon glow, tilt-shift shallow depth of field; "
             "not a real person, not photorealistic",
             "handmade clay stop-motion film"),
}
MEENA = ("a 58-year-old South Indian Tamil woman with a round kind face, silver-streaked black hair in a low bun, thin gold wire-rimmed "
         "reading glasses pushed up and resting on top of her hair (NOT on her eyes; her eyes are bare), a small maroon bindi, a bottle-green cotton saree with a thin maroon border "
         "and a white pharmacist's coat over it")
RAGHAVAN = ("a 62-year-old South Indian Tamil man, broad and genial, with a thick grey moustache, grey hair, a thin sandalwood line "
            "on his forehead, a cream half-sleeve cotton shirt and a white veshti")
SHOTS = {   # shot: (still prompt, motion prompt, voice line)
    "raghavan": (f"Medium shot at night of {RAGHAVAN} stepping in through the glass door of a small Chennai pharmacy, smiling broadly, "
                 "holding out a South Indian steel filter-coffee tumbler toward the camera; shelves of plain medicine boxes, green neon behind him",
                 "He steps forward through the doorway, smiling warmly under his moustache, and offers the steel coffee tumbler toward the camera; "
                 "his lips move as he speaks", "r1"),
    "meena": (f"Medium close-up at night of {MEENA} behind a glass-top pharmacy counter, looking up toward the door with a warm amused smile, "
              "tube light on her face, shelves of plain medicine boxes behind her",
              "She looks up toward the door and her face breaks into a warm amused smile; her lips move gently as she speaks; "
              "her glasses stay up on top of her head", "m1"),
}


def hdr():
    return {"Authorization": f"Bearer {os.environ['MINIMAX_API_KEY']}"}


def make_images():
    IMG.mkdir(parents=True, exist_ok=True)
    for st, (_, look, _) in STYLES.items():
        for sh, (prompt, _, _) in SHOTS.items():
            out = IMG / f"{st}_{sh}.jpeg"
            if out.exists(): continue
            body = {"model": "image-01", "prompt": f"{prompt}. {look}. {NOTEXT}", "width": 1920, "height": 1080,
                    "response_format": "base64", "n": 1, "prompt_optimizer": False}
            for attempt in range(6):
                j = requests.post(f"{API}/image_generation", headers=hdr(), json=body, timeout=240).json()
                imgs = (j.get("data") or {}).get("image_base64") or []
                if imgs: out.write_bytes(base64.b64decode(imgs[0])); print(" image", out.name, flush=True); break
                print("  retry", out.name, j.get("base_resp"), flush=True); time.sleep(20 * (attempt + 1))
            else:
                raise SystemExit("image failed: " + out.name)


def make_clips():
    CLIP.mkdir(parents=True, exist_ok=True)
    tasks = {}
    for st, (_, _, motion_look) in STYLES.items():
        for sh, (_, action, _) in SHOTS.items():
            name = f"{st}_{sh}"
            if (CLIP / f"{name}.mp4").exists(): continue
            first = "data:image/jpeg;base64," + base64.b64encode((IMG / f"{name}.jpeg").read_bytes()).decode()
            prompt = (f"{action}. Keep the exact {motion_look} look of the first frame, the same face and clothes; steady cinematic camera. "
                      "Absolutely no subtitles, no captions, no speech bubbles, no letters, words or writing anywhere in the frame.")
            body = {"model": "MiniMax-Hailuo-02", "prompt": prompt, "first_frame_image": first, "duration": 6,
                    "resolution": "768P", "prompt_optimizer": False}
            for attempt in range(8):
                j = requests.post(f"{API}/video_generation", headers=hdr(), json=body, timeout=120).json()
                if j.get("task_id"): tasks[name] = j["task_id"]; print("task", name, flush=True); break
                print("  submit retry", name, j.get("base_resp"), flush=True); time.sleep(20 * (attempt + 1))
            else:
                raise SystemExit("submit failed: " + name)
    t0 = time.time()
    while tasks:
        time.sleep(20)
        for name, task in list(tasks.items()):
            q = requests.get(f"{API}/query/video_generation", headers=hdr(), params={"task_id": task}, timeout=60).json()
            if q.get("status") == "Success":
                f = requests.get(f"{API}/files/retrieve", headers=hdr(), params={"file_id": q["file_id"]}, timeout=60).json()
                (CLIP / f"{name}.mp4").write_bytes(requests.get(f["file"]["download_url"], timeout=300).content)
                print(f" clip {name} ({int(time.time() - t0)}s)", flush=True); del tasks[name]
            elif q.get("status") == "Fail":
                raise SystemExit(f"clip failed: {name} {q.get('base_resp')}")
        if time.time() - t0 > 2400: raise SystemExit("timed out: " + " ".join(tasks))


def secs(p):
    import wave
    with wave.open(str(p)) as w: return w.getnframes() / w.getframerate()


def make_data():
    """Per style: a label card over the first frame (1.6 s), then Raghavan's shot, then Meena's, each line centred in its shot."""
    LABEL, PAD = 1.6, 0.7
    t = 0.0; segs = []
    for i, (st, (label, _, _)) in enumerate(STYLES.items()):
        seg = {"style": st, "label": f"{'ABCD'[i]} · {label}", "start": round(t, 3), "shots": []}
        t += LABEL
        for sh, (_, _, line) in SHOTS.items():
            d = round(secs(VO / f"{line}.wav"), 3); dur = round(d + 2 * PAD, 3)
            seg["shots"].append({"clip": f"{st}_{sh}.mp4", "line": line, "start": round(t, 3), "dur": dur, "lineAt": round(t + PAD, 3), "lineDur": d})
            t += dur
        seg["end"] = round(t, 3); segs.append(seg)
    texts = {"r1": "Coffee for the night pharmacist! Fresh filter. Strong, like me.",
             "m1": "Good evening, Raghu! Nobody is strong at one o'clock in the morning."}
    json.dump({"total": round(t + 0.5, 3), "label": LABEL, "segs": segs, "texts": texts}, open(OUT / "data.json", "w"), indent=1)
    print("style reel", round(t, 1), "s")


if __name__ == "__main__":
    {"img": make_images, "clip": make_clips, "data": make_data}[sys.argv[1]]()

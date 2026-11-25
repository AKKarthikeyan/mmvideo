#!/usr/bin/env python3
"""Karthigai Deepam ink Short (kd-deepam): Arunachala, the pillar of fire, Shiva without end. 1080 x 1920, about 15 s.

AK, 24 Nov 2026: a 15-second hand-inked animation (look: bold brush ink, hard black shadows, fast cinematic shots) in
blue, black and red, with yellow kept for the deepam and fire only. No voice: the lines are on-screen text. Script and timings: S["kd-deepam"] in
hyperframes/tools/shorts_build.py. Runbook and shot list: docs/deepam/KD_DEEPAM.md. Runs on the Mac Mini only.

  zsh -lic 'python3 scripts/deepam/film.py img'      # 7 stills, MiniMax image-01 (review them before the next step)
  zsh -lic 'python3 scripts/deepam/film.py clip'     # 7 clips, MiniMax Hailuo-02 image-to-video (costs money)
  python3 scripts/deepam/film.py grade               # map every clip onto the 4-colour ink palette
  python3 scripts/deepam/film.py cut                 # cut the graded clips to the voiced beats, add grain, captions and
                                                     # the on-screen label -> out/hyperframes/kd-deepam.mp4 (no sound)
Then `python3 hyperframes/tools/shorts_build.py mux kd-deepam` adds our music bed (no voice: AK, 24 Nov 2026)
-> kd-deepam-final.mp4. Channel: The Inner Chariot.
`img` and `clip` take shot names (k1 k6 ...) to redo only those; delete the old file first. DEEPAM_RES=768P halves the
clip cost (default 1080P). Media goes to public/deepam/ (stills are kept in git, clips are not)."""
import base64, json, os, socket, subprocess, sys, time, pathlib, tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
SID = os.environ.get("DEEPAM_FILM", "kd-deepam")       # kd-deepam (15 s) or kd-deepam60 (the 60 s story)
MEDIA = pathlib.Path(os.environ.get("DEEPAM_MEDIA", ROOT / "public/deepam"))
IMG = MEDIA / "img"
CLIP = MEDIA / os.environ.get("DEEPAM_CLIP", "clip")        # clip3d: the Blender renders (blender/deepam3d.py)
GRADED = MEDIA / os.environ.get("DEEPAM_GRADED", "graded")
STORY = ROOT / "hyperframes/shorts" / SID / "story.js"
OUT = ROOT / "out/hyperframes"
API = "https://api.minimax.io/v1"
W, H, FPS = 1080, 1920, 30

# ---- the look ------------------------------------------------------------------------------------------------------
# Yellow belongs to fire alone, as the ball does in the reference. Each colour has a dark and a light step so the grade
# keeps shape; nothing else survives the grade (see grade()).
PALETTE = {
    "ink":       "#07070b",   # black
    "night":     "#0d1f52",   # blue, dark
    "blue":      "#2456b8",   # blue
    "sky":       "#8fb2ea",   # blue, light (highlights, the swan)
    "blood":     "#6e0d12",   # red, dark
    "red":       "#c4221a",   # red
    "deepam":    "#f2a900",   # yellow, flame body
    "flame":     "#ffe061",   # yellow, flame core
}
LOOK = ("Hand-inked graphic-novel illustration, like a frame from a bold 2D hand-drawn animated short: thick expressive "
        "black brush-ink outlines, heavy solid black shadows, flat colour with a strictly limited palette of deep indigo "
        "blue, black and crimson red; glowing golden yellow is used ONLY for fire, flames and lamp light; rough paper "
        "grain texture; dramatic cinematic composition, strong silhouettes; not 3D, not photoreal, no soft gradients")
NOTEXT = "Absolutely no text, letters, numbers, signatures, watermarks or logos anywhere in the image."
MOTION = (" Hand-drawn 2D animation in the exact ink graphic-novel style and colours of the first frame: thick black brush "
          "outlines, flat blue, black and red colour, yellow only for fire; not 3D, not claymation, not photoreal. "
          "Energetic cinematic camera. No text, captions or letters anywhere in the frame.")
SHIVA = ("Lord Shiva with blue skin, long matted dark hair piled high with a crescent moon in it, a third eye on the forehead, "
         "a cobra coiled around the neck, rudraksha beads, a trident (trishul) at his side, a serene, majestic, compassionate face")

BRAHMA = ("Lord Brahma, the Hindu creator god: an old man with a long white beard and four faces on one head (three "
          "visible), a tall golden crown, crimson red robes, holding a palm-leaf manuscript")
VISHNU = ("Lord Vishnu, the Hindu god: a young man with deep blue skin, a tall golden crown, crimson and indigo silk dhoti, "
          "holding a conch and a spinning discus")
THAZHAMPOO = ("a single thalampoo (screwpine) flower: a long, narrow, pale cream-white bud shaped like a closed corn "
              "husk or a slender boat, made of a few long pointed cream petals tightly wrapped together, as long as a forearm")
INDIAN = ("Indian Hindu mythology art, South Indian temple painting subject; not Chinese, not Japanese, no East Asian "
          "faces, clothes or architecture")

# shot: (still prompt, motion prompt). All portrait 9:16.
SHOTS = {
    "k1": ("Night at Tiruvannamalai, Tamil Nadu: the sacred hill Arunachala, a lone broad conical mountain, a solid black "
           "silhouette against a deep indigo night sky; on its very summit a huge blazing fire, the Maha Deepam, burns "
           "golden yellow with sparks rising; in the lower foreground the tall tiered gateway towers (gopurams) of the "
           "Annamalaiyar temple stand in crimson red silhouette; vertical composition, the summit fire in the upper third",
           "The summit fire flares up bigger and brighter, sparks swirl upward into the night, slow steady push-in toward the summit."),
    "k2": ("A crowd of Tamil devotees seen from behind and below, men and women in silhouette with joined hands raised "
           "above their heads, looking up at a distant hilltop blazing with fire; some hold small clay oil lamps "
           "(agal vilakku) glowing yellow; deep indigo night, black and crimson red clothing",
           "The devotees lift their joined hands higher toward the burning hilltop, small lamp flames flicker, the camera tilts up toward the hill."),
    "k3": ("A majestic swan with wide outstretched wings, the swan form of Lord Brahma, flying straight upward beside an "
           "immense column of roaring golden fire that rises past the top of the frame into a deep indigo sky; the swan "
           "is drawn in pale blue and black ink, small against the colossal pillar of fire",
           "The swan beats its wings hard and climbs fast upward along the pillar of fire; the camera tilts up with it; the fire never ends."),
    "k4": ("A powerful wild boar with long tusks, the boar form of Lord Vishnu, tearing downward through layers of black "
           "earth and crimson red rock beside the same immense column of golden fire, which plunges past the bottom of "
           "the frame; deep blue shadows, flying rock and dust",
           "The boar digs furiously downward through the earth, rocks and dust flying; the camera tilts down with it; the fire continues below."),
    "k5": ("Extreme low-angle view looking straight up an endless towering column of roaring golden fire that disappears "
           "into a deep indigo starry sky; a tiny swan far above and a tiny boar far below give the immense scale; black "
           "ink clouds around the column",
           "Slow vertical crane up along the roaring pillar of fire, flames rippling and churning; the column keeps going beyond view."),
    "k6": (f"{SHIVA}, emerging from the heart of the colossal column of golden fire, flames framing his whole figure like a "
           "doorway; his right hand raised in blessing (abhaya mudra); strong black ink shadows, blue body, red accents, "
           "the fire around him golden yellow; heroic low angle, vertical composition",
           "Lord Shiva emerges forward out of the fire, his eyes opening slowly with a calm, majestic gaze, flames roaring around him; slow push-in."),
    "k7": ("The colossal column of golden fire cooling and settling downward into the shape of a dark conical hill, the "
           "hill Arunachala forming from the fire, glowing yellow embers drifting, deep indigo night sky, black ink earth, "
           "a crimson red glow at the base",
           "The pillar of fire sinks and settles, hardening into the dark shape of the hill, embers drifting upward, a glow staying on the summit."),
    # ---- kd-deepam60 only (the 60 s story, docs/deepam/TREATMENT_60.md). One subject per shot: image-01 drifted to an
    # East Asian look and lost the flower when a prompt held many elements (first try, 24 Nov 2026).
    "k8": (f"Hindu mythology scene: {BRAHMA} on the left and {VISHNU} on the right stand face to face in profile, arguing "
           "angrily, each pointing a finger at the other, against a black starry void with a crimson red glow between them",
           "The two gods argue fiercely, pointing and gesturing at each other, robes flowing; the camera slowly pushes in between them."),
    "k9": ("A gigantic vertical pillar of roaring golden fire erupts in the centre of the frame from the bottom edge to the "
           "top edge, splitting a deep indigo night sky in two; at the bottom left and bottom right two tiny dark silhouettes "
           "of Indian gods are thrown back by the blast; black ink shockwave rings, crimson red sparks",
           "The pillar of fire erupts and blazes brighter, shockwave rings spreading outward, sparks flying; fast push-in on the fire."),
    "k10": (f"{VISHNU}, standing alone, eyes closed, head bowed, both palms pressed together in namaste at his chest, humble "
            "and truthful; warm golden firelight on his blue face from the right; black background; medium shot",
            "Vishnu bows his head slowly with palms joined, golden firelight flickering on his face; very slow push-in."),
    "k11": (f"{THAZHAMPOO}, falling through the black night sky, turning slowly, beside a towering wall of golden fire on the "
            "left side of the frame; sparks drifting; the flower is the main subject, large, in the centre",
            "The long pale flower tumbles slowly downward through the dark beside the fire, turning gently, sparks drifting past."),
    # k12 (Brahma holding up the flower) was dropped after three tries: image-01 kept drawing him as an East Asian sage
    # with seal stamps and writing. "He made it lie" uses a punch-in on Brahma's face in k8 instead.
    "k13": ("Seen from behind: two small kneeling Hindu gods in silhouette, one in crimson red robes (Brahma) and one with "
            "blue skin (Vishnu), palms joined, before a gigantic towering column of golden fire that fills the frame; inside "
            "the fire the faint giant outline of Lord Shiva with blue skin and a trident",
            "The two small gods bow low before the towering fire, which pulses and roars above them; the camera slowly tilts up the column."),
    "k14": (f"Low ground-level view of dark stone temple steps: {THAZHAMPOO} lies discarded and wilting in the foreground "
            "shadow; in the background a black stone Shiva lingam with small Indian clay oil lamps (agal vilakku) glowing "
            "golden around it; a crimson red South Indian temple wall behind",
            "The clay lamps around the lingam flicker warmly while the cast-aside flower stays in shadow; a slow sideways track."),
}

# What the picture shows while each beat is spoken: {beat: {event phrase: (shot, start second in the clip or None)}}.
# None continues the shot from where it was last cut. "k1r" plays k1 backwards and ends on the clip second that b1
# starts on, so the last frame of the Short is its first frame (the loop).
K1_START = 1.0
PLAN15 = {
    "b1": {"A whole": ("k1", K1_START)},
    "b2": {"Why this": ("k2", 0.6)},
    "b3": {"Brahma flew": ("k3", 0.6)},
    "b4": {"Vishnu dug": ("k4", 0.6)},
    "b5": {"To find": ("k5", 0.6)},
    "b6": {"Neither": ("k5", None), "Shiva has": ("k6", 0.8)},
    "b7": {"That fire": ("k7", 0.8), "So every": ("k1r", None)},
}
# kd-deepam60: a third value is a punch-in (zoom, x centre, y centre), so one clip gives a wide and a close shot.
PLAN60 = {
    "b1": {"A whole": ("k1", K1_START), "And one": ("k11", 1.6, (1.3, 0.55, 0.42))},
    "b2": {"Why": ("k8", 0.5), "Who is": ("k8", None, (1.35, 0.5, 0.45))},
    "b3": {"A pillar": ("k9", 0.4), "Find its": ("k5", 0.6)},
    "b4": {"Brahma flew": ("k3", 0.6), "Vishnu dug": ("k4", 0.6)},
    "b5": {"But the fire": ("k5", 3.2, (1.3, 0.5, 0.3)), "Vishnu came": ("k10", 0.4)},
    "b6": {"Brahma saw": ("k11", 2.3, (1.1, 0.55, 0.5)), "He made": ("k8", 1.0, (1.8, 0.33, 0.38))},
    "b7": {"But the fire": ("k6", 0.2, (1.7, 0.5, 0.22)), "Shiva stepped": ("k6", 1.6)},
    "b8": {"No worship": ("k13", 0.4), "No thalampoo": ("k14", 0.5, (1.12, 0.55, 0.5)), "Vishnu told": ("k10", 2.6, (1.3, 0.5, 0.4))},
    "b9": {"They begged": ("k13", 2.7, (1.25, 0.5, 0.6)), "It cooled": ("k7", 0.8)},
    "b10": {"So every": ("k2", 0.6), "in Thiru": ("k1r", None)},
}
PLAN = PLAN60 if SID == "kd-deepam60" else PLAN15
KICKER = "KARTHIGAI DEEPAM · THIRUVANNAMALAI"
LABEL = "Illustration · the legend of the pillar of fire (Shiva Purana; Arunachala Mahatmyam)"
if SID == "kd-deepam60":
    LABEL = "Illustration · legend (Shiva Purana, Vidyeshvara Samhita; Arunachala Mahatmyam)"


# ---- MiniMax -------------------------------------------------------------------------------------------------------
def requests_ipv4():
    import requests, urllib3.util.connection as uc
    uc.allowed_gai_family = lambda: socket.AF_INET          # the Mac Mini's IPv6 route hangs
    return requests


def hdr():
    return {"Authorization": f"Bearer {os.environ.get('MINIMAX_API_KEY', 'proxy-injected')}"}


def make_images(names):
    rq = requests_ipv4(); IMG.mkdir(parents=True, exist_ok=True)
    for sh in names:
        out = IMG / f"{sh}.jpeg"
        if out.exists():
            continue
        body = {"model": "image-01", "prompt": f"{SHOTS[sh][0]}. {LOOK}. {INDIAN + '. ' if int(sh[1:]) > 7 else ''}{NOTEXT}", "width": W, "height": H,
                "response_format": "base64", "n": 1, "prompt_optimizer": False}
        for attempt in range(6):
            j = rq.post(f"{API}/image_generation", headers=hdr(), json=body, timeout=240).json()
            imgs = (j.get("data") or {}).get("image_base64") or []
            if imgs:
                out.write_bytes(base64.b64decode(imgs[0])); print(" image", out.name, flush=True); break
            print("  retry", out.name, j.get("base_resp"), flush=True); time.sleep(20 * (attempt + 1))
        else:
            raise SystemExit("image failed: " + out.name)


def make_clips(names):
    rq = requests_ipv4(); CLIP.mkdir(parents=True, exist_ok=True); tasks = {}
    res = os.environ.get("DEEPAM_RES", "1080P")
    for sh in names:
        if (CLIP / f"{sh}.mp4").exists():
            continue
        first = "data:image/jpeg;base64," + base64.b64encode((IMG / f"{sh}.jpeg").read_bytes()).decode()
        body = {"model": "MiniMax-Hailuo-02", "prompt": SHOTS[sh][1] + MOTION, "first_frame_image": first,
                "duration": 6, "resolution": res, "prompt_optimizer": False}
        for attempt in range(6):
            j = rq.post(f"{API}/video_generation", headers=hdr(), json=body, timeout=120).json()
            if j.get("task_id"):
                tasks[sh] = j["task_id"]; print("task", sh, tasks[sh], flush=True); break
            print("  submit retry", sh, j.get("base_resp"), flush=True); time.sleep(20 * (attempt + 1))
        else:
            raise SystemExit("submit failed: " + sh)
    t0 = time.time(); failed = []
    while tasks:
        time.sleep(20)
        for sh, task in list(tasks.items()):
            q = rq.get(f"{API}/query/video_generation", headers=hdr(), params={"task_id": task}, timeout=60).json()
            st = q.get("status")
            if st == "Success":
                f = rq.get(f"{API}/files/retrieve", headers=hdr(), params={"file_id": q["file_id"]}, timeout=60).json()
                (CLIP / f"{sh}.mp4").write_bytes(rq.get(f["file"]["download_url"], timeout=300).content)
                print(f" clip {sh} ({int(time.time() - t0)}s)", flush=True); del tasks[sh]
            elif st == "Fail":
                print(" FAILED", sh, q.get("base_resp"), flush=True); failed.append(sh); del tasks[sh]
        if time.time() - t0 > 2400:
            print(" timed out:", list(tasks)); failed += list(tasks); break
    if failed:
        raise SystemExit("failed: " + " ".join(failed))


# ---- grade and cut -------------------------------------------------------------------------------------------------
def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *map(str, args)], check=True)


def palette_png():
    from PIL import Image
    cols = [tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) for h in PALETTE.values()]
    im = Image.new("RGB", (16, 16)); im.putdata([cols[i % len(cols)] for i in range(256)])
    p = MEDIA / "palette.png"; MEDIA.mkdir(parents=True, exist_ok=True); im.save(p); return p


def grade(names):
    """Fill the frame (9:16), clean the AI shimmer a little, then snap every pixel to the nearest palette colour with no
    dithering: flat ink fills, exactly the four colours, and the same look across shots made separately."""
    GRADED.mkdir(parents=True, exist_ok=True); pal = palette_png()
    for sh in names:
        src = CLIP / f"{sh}.mp4"
        if not src.exists():
            raise SystemExit(f"no clip {src}: run `film.py clip` first")
        if CLIP.name == "clip3d":            # Blender renders are already drawn in the palette: fit only, no snapping
            ff("-i", src, "-vf", f"fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H}",
               "-an", "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", GRADED / f"{sh}.mp4")
            print(" fitted", sh, flush=True); continue
        ff("-i", src, "-i", pal, "-filter_complex",
           f"[0:v]fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},"
           "hqdn3d=2:2:5:5,eq=contrast=1.12:saturation=1.3[v];[v][1:v]paletteuse=dither=none",
           "-an", "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", GRADED / f"{sh}.mp4")
        print(" graded", sh, flush=True)


def anim(names):
    """Animatic stand-in (DIRECTOR.md step 4): a shot that has a still but no clip yet becomes a 6 s slow push on the
    still, graded like a clip. `grade <shot>` after `clip <shot>` replaces it with the real clip."""
    GRADED.mkdir(parents=True, exist_ok=True); pal = palette_png()
    for sh in names:
        if (CLIP / f"{sh}.mp4").exists():
            continue
        src = IMG / f"{sh}.jpeg"
        if not src.exists():
            raise SystemExit(f"no still {src}: run `film.py img {sh}` first")
        ff("-loop", "1", "-i", src, "-i", pal, "-filter_complex",
           f"[0:v]scale={W * 2}:{H * 2},zoompan=z='1+0.0006*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={6 * FPS}:s={W}x{H}:fps={FPS},"
           "eq=contrast=1.12:saturation=1.3[v];[v][1:v]paletteuse=dither=none",
           "-frames:v", 6 * FPS, "-an", "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", GRADED / f"{sh}.mp4")
        print(" animatic still", sh, flush=True)


def sound():
    """Our own score for kd-deepam60, following DIRECTOR.md section 6 (no voice, so the music carries the feeling):
    the pad changes with each section, a drum on the pillar, a chase pulse, a thin uneasy drone under the lie, two
    planned silences (after the hook, and just before the fire opens), one peak (temple bell and drum on Shiva),
    then calm and the same level at both ends so the loop does not jump. Everything is synthesised here: nothing to
    license. Writes out/hyperframes/kd-deepam60-final.mp4 (about -14 LUFS)."""
    import numpy as np
    sys.path.insert(0, str(ROOT / "hyperframes/tools"))
    from shorts_build import bed, write_wav, SR
    st = load_story(); dur = st["dur"]; n = int(dur * SR); t = np.arange(n) / SR
    beat = {b["id"]: b for b in st["beats"]}

    def at(bid, phrase=None):
        b = beat[bid]
        if not phrase:
            return b["t0"]
        return b["t0"] + b["sec"] * b["say"].lower().find(phrase.lower()) / len(b["say"])

    def env(points):                      # piecewise-linear level over time
        xs, ys = zip(*points); return np.interp(t, xs, ys).astype(np.float32)

    low, high = bed(dur, 146.83), bed(dur, 220.0)            # D pad; A pad for the climb and the peak
    uneasy = bed(dur, 155.56)                                  # a semitone off D: under the lie only
    s1, s2 = at("b2"), at("b7")                                # the two planned silences end here
    pillar, peak, lie = at("b3"), at("b7", "Shiva stepped"), at("b6", "He made")
    mix = (low * env([(0, .30), (s1 - .5, .30), (s1 - .45, 0), (s1, 0), (s1 + .3, .28), (pillar, .30), (at("b4"), .40),
                      (at("b5"), .25), (at("b6"), .12), (s2 - .7, .10), (s2 - .65, 0), (s2 + .2, 0), (peak, .30),
                      (at("b8"), .32), (at("b9"), .28), (dur - .5, .30), (dur, .30)])
           + high * env([(0, 0), (pillar, 0), (pillar + .4, .22), (at("b5"), .18), (at("b5") + 1, 0), (peak - .1, 0),
                         (peak, .40), (peak + 3, .30), (at("b9"), .10), (at("b10"), 0), (dur, 0)])
           + uneasy * env([(0, 0), (at("b6"), 0), (lie, .16), (s2 - .7, .16), (s2 - .65, 0), (dur, 0)]))

    def drum(t0, g=1.0, f0=95, f1=42, d=.55):
        i = int(t0 * SR); k = np.arange(int(d * SR)) / SR
        x = np.sin(2 * np.pi * (f1 * k + (f0 - f1) * .06 * (1 - np.exp(-k / .06)))) * np.exp(-k / (d / 4))
        x[: int(.004 * SR)] += np.random.default_rng(1).normal(0, .5, int(.004 * SR))
        j = min(n, i + len(x)); mix[i:j] += g * x[: j - i]

    def bell(t0, g=1.0, f=392.0, d=4.0):    # a temple bell: inharmonic partials, long decay
        i = int(t0 * SR); k = np.arange(int(d * SR)) / SR
        x = sum(a * np.sin(2 * np.pi * f * r * k) * np.exp(-k / (d * dd)) for r, a, dd in
                [(1, 1, .45), (2.76, .5, .25), (5.4, .3, .12), (8.93, .15, .07)])
        j = min(n, i + len(x)); mix[i:j] += g * x[: j - i] / 2

    bell(0.02, .35)                                            # the hill lamp
    drum(pillar, 1.0); drum(pillar + .35, .5)                  # the pillar splits the sky
    t4, t5 = at("b4"), at("b5")
    for k in np.arange(t4, t5 - .2, .5):                       # the chase: a pulse under the swan and the boar
        drum(k, .32, 80, 50, .3)
    drum(peak - .02, 1.2, 110, 40, .9); bell(peak, .9, 293.66, 5.5)   # the one peak: Shiva
    bell(at("b8", "Vishnu told"), .25, 440.0, 3.0)             # the blessing
    drum(at("b9", "It cooled"), .6, 70, 36, 1.2)               # the fire settles into the hill
    mix /= np.max(np.abs(mix)) / .9
    adir = OUT / "shorts_audio" / SID; adir.mkdir(parents=True, exist_ok=True)
    write_wav(adir / "score.wav", mix)
    v = OUT / f"{SID}.mp4"; out = OUT / f"{SID}-final.mp4"
    m = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(adir / "score.wav"), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json",
                        "-f", "null", "-"], capture_output=True, text=True).stderr          # two-pass loudnorm: measure first
    j = json.loads(m[m.rindex("{"): m.rindex("}") + 1])
    ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I={j['input_i']}:measured_TP={j['input_tp']}:"
          f"measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}")
    ff("-i", v, "-i", adir / "score.wav", "-af", ln, "-ar", "48000", "-c:v", "copy",
       "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out)
    print(out, f"(score: silences at {s1 - .45:.1f} s and {s2 - .65:.1f} s, peak at {peak:.1f} s)")


def font(name, size):
    from PIL import ImageFont
    path = {"oswald": ROOT / "public/fonts/Oswald-700.woff2",
            "inter": ROOT / "hyperframes/shared/fonts/inter-latin-600-normal.woff2"}[name]
    try:
        return ImageFont.truetype(str(path), size)
    except OSError:                       # a FreeType without WOFF2 support: unpack to a temporary TTF first
        from fontTools.ttLib import TTFont
        tmp = pathlib.Path(tempfile.gettempdir()) / (path.stem + ".ttf")
        if not tmp.exists():
            f = TTFont(str(path)); f.flavor = None; f.save(str(tmp))
        return ImageFont.truetype(str(tmp), size)


def caption_png(html, path):
    """2-4 words, centred at about 66 % of the height (clear of the bottom 20 % and the right-hand rail).
    *word* (<em>) is in deepam yellow, the rest light blue, all with a heavy black ink outline."""
    import re
    from PIL import Image, ImageDraw
    f = font("oswald", 92); im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    runs = [(m.group(1) is not None, m.group(1) or m.group(2)) for m in re.finditer(r"<em>(.+?)</em>|([^<]+)", html)]
    words = [(acc, w) for acc, txt in runs for w in txt.replace("&amp;", "&").replace("&lt;", "<").upper().split()]
    lines, cur = [], []
    for wd in words:                        # wrap at 860 px
        trial = cur + [wd]
        if cur and d.textlength(" ".join(w for _, w in trial), font=f) > 860:
            lines.append(cur); cur = [wd]
        else:
            cur = trial
    lines.append(cur)
    lh = 104; y = int(H * 0.66) - lh * len(lines) // 2
    for ln in lines:
        x = (W - 60 - d.textlength(" ".join(w for _, w in ln), font=f)) / 2     # nudged left of the right rail
        for acc, w in ln:
            d.text((x, y), w, font=f, fill=PALETTE["flame"] if acc else "#e8f0ff", stroke_width=9, stroke_fill=PALETTE["ink"])
            x += d.textlength(w + " ", font=f)
        y += lh
    im.save(path)


def top_png(path):
    from PIL import Image, ImageDraw
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.text((64, 150), KICKER, font=font("oswald", 46), fill=PALETTE["flame"], stroke_width=5, stroke_fill=PALETTE["ink"])
    d.text((64, 214), LABEL, font=font("inter", 25), fill="#e8f0ff", stroke_width=4, stroke_fill=PALETTE["ink"])
    im.save(path)


def load_story():
    if not STORY.exists():
        raise SystemExit("build the timings first: python3 hyperframes/tools/shorts_build.py story kd-deepam")
    txt = STORY.read_text(encoding="utf-8")
    return json.loads(txt[txt.index("{"): txt.rindex("}") + 1])


def parts(st):
    """Picture segments in frames: (shot, first clip frame, frame count, reversed). Cut times follow the same
    proportional-to-text rule as scripts/shorts_check.py, so the gate measures what is rendered."""
    total = round(st["dur"] * FPS); segs = []
    for i, b in enumerate(st["beats"]):
        end = st["beats"][i + 1]["t0"] if i + 1 < len(st["beats"]) else st["dur"]
        cuts = []
        for phrase, how in PLAN[b["id"]].items():
            k = b["say"].lower().find(phrase.lower())
            if k < 0:
                raise SystemExit(f"{b['id']}: '{phrase}' is not in the narration")
            cuts.append((b["t0"] if not cuts else b["t0"] + b["sec"] * k / len(b["say"]), how))
        for j, (t, how) in enumerate(cuts):
            t1 = cuts[j + 1][0] if j + 1 < len(cuts) else end
            segs.append([round(t * FPS), round(t1 * FPS), how])
    segs[0][0] = 0; segs[-1][1] = total
    cursor = {}; out = []
    for f0, f1, how in segs:
        shot, start, zoom = (tuple(how) + (None,))[:3]
        n = f1 - f0
        if shot == "k1r":                    # backwards, landing on b1's first frame
            out.append(("k1", round(K1_START * FPS), n, True, None)); continue
        s = round(start * FPS) if start is not None else cursor[shot]
        out.append((shot, s, n, False, zoom)); cursor[shot] = s + n
    for shot, s, n, _, _ in out:
        if s + n > 6 * FPS - 2:
            raise SystemExit(f"{shot} needs frames {s}-{s + n}, past the end of a 6 s clip: move its start earlier")
    return out


def cut():
    st = load_story(); segs = parts(st); tmp = MEDIA / "overlay"; tmp.mkdir(parents=True, exist_ok=True)
    top_png(tmp / "top.png")
    caps = []
    for i, c in enumerate(st["caps"]):
        p = tmp / f"cap{i:02d}.png"; caption_png(c["html"], p); caps.append((p, c["t0"], c["t1"]))
    args, fc = [], []
    for i, (shot, s, n, rev, zoom) in enumerate(segs):
        args += ["-i", GRADED / f"{shot}.mp4"]
        z = ""
        if zoom:                             # punch-in: crop around (x, y) and scale back up, still on the palette
            k, cx, cy = zoom; cw, ch = round(W / k) // 2 * 2, round(H / k) // 2 * 2
            z = (f",crop={cw}:{ch}:{round(min(max(cx * W - cw / 2, 0), W - cw))}:{round(min(max(cy * H - ch / 2, 0), H - ch))}"
                 f",scale={W}:{H}:flags=neighbor")
        fc.append(f"[{i}:v]trim=start_frame={s}:end_frame={s + n},setpts=PTS-STARTPTS{',reverse' if rev else ''}{z},"
                  f"fps={FPS},setsar=1,format=yuv420p[p{i}]")
    fc.append("".join(f"[p{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[base]")
    # paper grain that moves every frame, and a soft vignette, as in a printed ink frame
    fc.append("[base]noise=alls=14:allf=t+u,vignette=angle=PI/5[g0]")
    k = len(segs); args += ["-i", tmp / "top.png"]
    fc.append(f"[g0][{k}:v]overlay=0:0[g1]")
    last = "g1"
    for j, (p, t0, t1) in enumerate(caps):
        args += ["-i", p]; nxt = f"c{j}"
        fc.append(f"[{last}][{k + 1 + j}:v]overlay=0:0:enable='between(t,{t0:.3f},{t1:.3f})'[{nxt}]"); last = nxt
    OUT.mkdir(parents=True, exist_ok=True); out = OUT / f"{SID}.mp4"
    ff(*args, "-filter_complex", ";".join(fc), "-map", f"[{last}]", "-r", FPS, "-frames:v", round(st["dur"] * FPS),
       "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out)
    print(out, f"({st['dur']:.2f} s, {len(segs)} cuts{'' if st.get('voiced') or st.get('silent') else ', ESTIMATED timings: voice it first'})")


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    used = sorted({("k1" if h[0] == "k1r" else h[0]) for b in PLAN.values() for h in b.values()}, key=lambda x: int(x[1:]))
    names = sys.argv[2:] or used          # by default, only the shots this film uses
    for n in names:
        if n not in SHOTS:
            sys.exit(f"no shot {n}; have {', '.join(SHOTS)}")
    if cmd == "img":
        make_images(names)
    elif cmd == "clip":
        make_clips(names)
    elif cmd == "grade":
        grade(names)
    elif cmd == "cut":
        cut()
    elif cmd == "anim":
        anim(names)
    elif cmd == "sound":
        sound()
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()

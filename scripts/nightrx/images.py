#!/usr/bin/env python3
"""The Night Pharmacist: 60-second style test stills (MiniMax image-01; waits on 429s, never switches provider).
Character reference portraits first, then scene panels that pass the main character's portrait as a
subject_reference so the face stays the same from panel to panel. Skips files that already exist.

  zsh -lic 'python3 scripts/nightrx/images.py refs'            # public/nightrx/ref/<who>.jpeg
  zsh -lic 'python3 scripts/nightrx/images.py panels [p01 ..]' # public/nightrx/styletest/img/<panel>.jpeg
  NRX_LOOK=live ...   the live-action look AK chose on 24 Oct (refs in ref_live/, panels in styletest_live/img/)
Bible: /Volumes/DarwinSSD/The Night Pharmacist/01 Bible/SERIES_BIBLE.md (section 9 holds the character blocks)."""
import base64, os, socket, sys, time, pathlib, requests
import urllib3.util.connection as uc
uc.allowed_gai_family = lambda: socket.AF_INET          # the Mini's IPv6 route hangs

ROOT = pathlib.Path(__file__).resolve().parents[2]
LOOK = os.environ.get("NRX_LOOK", "ink")       # "ink" = the v1/v2 motion comic; "live" = live-action cinematic
REF = ROOT / ("public/nightrx/ref_live" if LOOK == "live" else "public/nightrx/ref")
IMG = ROOT / ("public/nightrx/styletest_live/img" if LOOK == "live" else "public/nightrx/styletest/img")

STYLE = ("Graphic novel illustration, bold confident ink linework with flat limited colour and soft cel shading, "
         "cinematic film still composition, late-night mood in Chennai, India. Light: warm white tube light inside the pharmacy, "
         "green neon glow spilling through the glass, sodium-orange street lamps outside, deep blue-black shadows, fine film grain. "
         "Completely blank signs, labels, boxes and papers: absolutely no text, no letters, no numbers, no logos anywhere.")
# Close-ups drifted toward photo-real in pass 1 (p03, p09, p12); these panels get the stronger comic-art wording.
INK = ("2D comic book art with thick black ink outlines and flat colour fills, hand-inked graphic novel panel, "
       "not photorealistic, not a photograph, not 3D")
if LOOK == "live":   # AK chose look A of the style sampler (03 Style Options) on 24 Oct
    STYLE = ("Cinematic live-action film still shot on 35mm with an anamorphic lens, photorealistic real actors with natural skin texture, "
             "shallow depth of field, late-night mood in Chennai, India. Light: warm white tube light inside the pharmacy, green neon glow "
             "spilling through the glass, sodium-orange street lamps outside, moody night colour grade, subtle film grain. No signs or posters "
             "in view; completely blank labels, boxes and papers: absolutely no text, no letters, no numbers, no logos anywhere.")
    INK = "Photorealistic live-action film frame with real actors, not an illustration, not a cartoon, not a 3D render"

CAST = {
    "meena": "a 58-year-old South Indian Tamil woman with a round kind face and laugh lines, silver-streaked black hair in a low bun, "
             "thin gold wire-rimmed reading glasses pushed up on top of her head, natural unpainted lips, a small maroon bindi, a bottle-green cotton saree with a thin maroon border, "
             "a white pharmacist's coat worn open over the saree, a thin gold chain",
    "raghavan": "a 62-year-old South Indian Tamil man, broad and genial, with a thick grey moustache, receding grey hair, a thin pale-yellow sandalwood paste line across his forehead (no red mark), "
                "a cream half-sleeve cotton shirt and a white veshti, a canvas shoulder bag",
    "babu": "a boyish 22-year-old skinny South Indian college student with curly black hair, a thin youthful face, only a faint wisp of stubble, an oversized grey hoodie, one white earphone in, "
            "holding a smartphone on a small selfie grip",
}

REFS = {who: f"Character reference portrait of {desc}. Upper body, three-quarter view, looking toward the viewer, plain dark teal studio background, even soft light."
        for who, desc in CAST.items()}
if LOOK == "live":   # pass 1: Raghavan came out stern with baked-in black bars, Babu's face too small to anchor a reference
    REFS = {who: f"Head-and-shoulders casting portrait of {desc}; the face is large and sharp in the frame, looking toward the camera"
                 f"{' with a warm genial smile' if who == 'raghavan' else ''}; plain dark teal background, soft key light; "
                 "full-frame image with no black bars or letterbox"
            for who, desc in CAST.items()}

# panel: (subject_reference character or None, prompt). Each prompt repeats the character block so clothes and props hold.
PANELS = {
    "p01": (None, "Wide establishing shot at night: an empty Chennai street, sodium-orange street lamps, a small corner pharmacy glowing bright with "
                  "a green neon cross and green light spilling on the pavement, its rolling shutter up and a glass door, a tea stall closed under a tarp "
                  "across the road, the dark silhouette of a large hospital building opposite with a few lit windows, a parked auto-rickshaw"),
    "p02": ("meena", f"{INK}. Wide interior shot of a small Indian pharmacy at night, seen from the customer side of the counter: {CAST['meena']} stands behind a long glass-top counter facing us, "
                     "wooden shelves packed with plain medicine boxes behind her, a round wall clock and a paper wall calendar, a tube light overhead; "
                     f"in the corner on a stool sits {CAST['babu']}, filming with his phone"),
    "p03": ("meena", f"{INK}. Medium close-up of {CAST['meena']} behind the pharmacy counter, glancing up toward the door with a warm amused smile, tube light on her face, green neon glow at the edge of frame"),
    "p04": ("raghavan", f"{CAST['raghavan']} stepping in through the glass door of a small pharmacy at night, smiling broadly, holding up a South Indian "
                        "steel filter-coffee set (a tall steel tumbler sitting in a wide steel bowl, a dabara), green neon glow behind him, sodium-lit street outside"),
    "p05": (None, f"{INK}. Close-up of hands pouring hot South Indian filter coffee from a steel tumbler held high into a wide steel dabara bowl, a long stream of coffee, "
                  "thick froth and rising steam, on a glass-top pharmacy counter, warm tube light, green neon reflections; the background is soft dark shelves only, no signs and no street"),
    "p06": ("babu", f"Close-up of {CAST['babu']} in the corner of a pharmacy at night, whispering conspiratorially into his phone on a selfie grip, eyes wide, phone screen glow on his face"),
    "p07": ("raghavan", f"{CAST['raghavan']} leaning on a glass-top pharmacy counter, opening a thick order book with carbon pages and turning it around toward the pharmacist, "
                        "a steel coffee tumbler beside it, friendly persuasive smile"),
    "p08": (None, "Extreme close-up insert of a woman's hand signing with a black fountain pen at the very bottom of an order-book page; only the top four rows of the page "
                  "are filled with illegible scribbles and the many rows below are EMPTY and blank; a sheet of blue carbon paper under the page; glass counter, warm light"),
}
if LOOK == "live":   # live pass 1 drew a fully printed form, losing the clue: the page must be visibly half empty
    PANELS["p08"] = (None, "Top-down extreme close-up insert of a woman's hand signing with a black fountain pen at the very bottom of a plain ruled "
                           "notebook page lying on a glass counter; only the first three ruled lines at the top carry faint handwriting, and the "
                           "dozen ruled lines below them are completely EMPTY white paper; a corner of blue carbon paper peeks out underneath; warm tube light")
PANELS = {**PANELS,
    # One face per panel: a subject_reference holds only one character, so pass 1's two-shot lost Raghavan's face.
    "p09": ("meena", f"{INK}. Medium shot of {CAST['meena']} behind a glass-top pharmacy counter at night, laughing and pointing teasingly toward someone off-frame on the right, "
                     "a steel coffee tumbler in her other hand, shelves of plain boxes behind her"),
    "p09b": ("raghavan", f"{INK}. Medium shot of {CAST['raghavan']} at a pharmacy counter at night, grinning and flexing one arm like a proud strongman, "
                         "showing off playfully, shelves of plain boxes behind him"),
    "p10": ("raghavan", f"{CAST['raghavan']} tearing a thin carbon copy sheet out of an order book with a flourish and handing it across the counter, a gallant little bow"),
    "p11": (None, "Extreme close-up insert, dramatic: an older man's hand in a cream shirt pulling car keys out of his shirt pocket at night; with the keys a single "
                  "BRIGHT RED foil blister strip of pills slips half out of the pocket; the red foil is the only saturated red in the frame; sodium-orange street light"),
    "p12": ("meena", f"{INK}. Seen from inside a pharmacy through its glass door at night: in the foreground the soft silhouette of {CAST['meena']} sipping coffee from a steel tumbler; "
                     "outside, a small cream hatchback car pulls away from the kerb and turns, red tail lights streaking, sodium-orange street, green neon reflections on the glass"),
}


def data_url(p):
    return "data:image/jpeg;base64," + base64.b64encode(p.read_bytes()).decode()


def gen(prompt, out, ref=None):
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "image-01", "prompt": f"{prompt}. {STYLE}", "width": 1920, "height": 1080, "response_format": "base64",
            "n": 1, "prompt_optimizer": False}
    if ref:
        body["subject_reference"] = [{"type": "character", "image_file": data_url(REF / f"{ref}.jpeg")}]
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/image_generation", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=240).json()
        imgs = (j.get("data") or {}).get("image_base64") or []
        if imgs:
            out.write_bytes(base64.b64decode(imgs[0])); return
        print("  retry", out.name, j.get("base_resp"), flush=True); time.sleep(20 * (attempt + 1))
    raise SystemExit("image failed: " + out.name)


def main():
    mode, names = sys.argv[1], sys.argv[2:]
    if mode == "refs":
        REF.mkdir(parents=True, exist_ok=True)
        for who, prompt in REFS.items():
            out = REF / f"{who}.jpeg"
            if (names and who not in names) or out.exists(): continue
            gen(prompt, out); print(" ref", who, flush=True)
    else:
        IMG.mkdir(parents=True, exist_ok=True)
        for name, (ref, prompt) in PANELS.items():
            out = IMG / f"{name}.jpeg"
            if (names and name not in names) or out.exists(): continue
            gen(prompt, out, ref); print(" panel", name, "ref=" + str(ref), flush=True)


if __name__ == "__main__":
    main()

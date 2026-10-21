#!/usr/bin/env python3
"""Build a Katha film's data from its script: public/katha/<id>/data.json, read by src/katha/Film.tsx.

  python3 scripts/katha/build_film.py scripts/katha/gita_film.json            # estimate timings (no audio)
  python3 scripts/katha/build_film.py scripts/katha/gita_film.json --tts      # MiniMax narration per beat (MINIMAX_API_KEY)

The script (written for AK's request, 21 Oct 2026: "recreate Bhagavad Geeta by Krishna to Arjuna, premium, rich, poetic")
is a list of movements (prologue, chapters 1-18, epilogue) of beats {key, speaker, say, ref, show_sanskrit, scene, music}.
This step: checks every quoted line against the corpus (Krishna, Arjuna and Dhritarashtra speak only verse text), fills
verse scenes from the corpus (Sanskrit, transliteration, the English as quoted, the source line), maps the script's free
wording of poses and metaphors onto the kit's scene names, and times each beat (2.5 words a second plus a breath)."""
import json, re, sys, pathlib, unicodedata
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "dharma"))
from corpus import ref as corpus_ref

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
WPS = 2.5                     # spoken words per second (calm, poetic delivery)

POSE_MAP = [                  # script wording -> ChariotRig pose
    (r"rising|bow-raised|bow raised|resolve|stands? (up|ready)", "resolve"),
    (r"sink|seated|bow-down|bow down|despair|collapse|slump", "despair"),
    (r"arriv|driv|gallop|charge", "arrive"),
    (r"teach|turn|listen|krishna", "teach"),
]
KIND_MAP = [                  # metaphor wording -> (kind, variant)
    (r"windless.*gone out|lamp.*out\b|\(gone out\)", ("lamp", "out")),
    (r"stair of lamps|row of lamps|lamps? (lit|lighting)", ("lamp", "row")),
    (r"windless|lamp", ("lamp", "still")),
    (r"flame return|flame.*sun|path of light", ("flame-sun", None)),
    (r"smoke over fire|veiled by smoke|fire veiled|smoke", ("smoke", None)),
    (r"three syllables|om tat sat", ("fire", "syllables")),
    (r"sacrificial fire|fire of knowledge|havan|fire altar", ("fire", None)),
    (r"rivers?.*(reversed into fire|fire)", ("ocean", "fire")),
    (r"rivers?|ocean", ("ocean", None)),
    (r"lotus", ("lotus-leaf", None)),
    (r"tortoise", ("tortoise", None)),
    (r"garment|clothes", ("garments", None)),
    (r"thread revealed|pearls.*thread \(", ("pearls", "thread")),
    (r"pearl", ("pearls", None)),
    (r"leaf.*flower|offer", ("offering", None)),
    (r"sword", ("sword", None)),
    (r"three gates|two roads?", ("two-roads", None)),
    (r"gunas?.*released|released", ("gunas", "released")),
    (r"gunas?.*faith|as faith", ("gunas", "faith")),
    (r"three lights|gunas?", ("gunas", None)),
    (r"ashvattha|upside-down tree|inverted tree", ("ashvattha", None)),
    (r"wheel", ("wheel", None)),
    (r"sun lighting|one sun|sun-world", ("sun-world", None)),
    (r"glories.*spark|sparks", ("glories", "sparks")),
    (r"glor", ("glories", None)),
    (r"field and its knower|knower|field", ("field", None)),
    (r"friend", ("light", "friend")),
    (r"cosmic|thousand suns|universal form", ("light", None)),
]

KINDS = {"lamp", "fire", "smoke", "flame-sun", "ocean", "lotus-leaf", "tortoise", "garments", "pearls", "offering", "sword", "two-roads", "gunas", "ashvattha", "wheel", "sun-world", "glories", "field", "light"}

def norm(s):
    s = unicodedata.normalize("NFKC", s).replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"[\s]+", " ", re.sub(r"[^\w' ]+", " ", s.lower())).strip()

def check_quote(beat):
    """KRISHNA/ARJUNA/DHRITARASHTRA lines must be a contiguous excerpt of the cited verse's Purohit Swami text (or Sivananda)."""
    if beat["speaker"] == "SANJAYA" and not beat.get("ref"): return None
    r = beat.get("ref")
    if not r: return "quoted speaker without a ref"
    for author in (21, 16):
        try: v = corpus_ref(r if r.startswith("gita:") else f"gita:{r}", author=author)
        except Exception as e: return f"corpus: {e}"
        if beat["speaker"] == "SANJAYA" or norm(beat["say"]) in norm(v["en"]): return None
    return "not a contiguous excerpt of the corpus text"

def scene_for(b, mv):
    sc = dict(b.get("scene") or {}); t = sc.get("type", "chariot")
    desc = " ".join(str(sc.get(k, "")) for k in ("pose", "kind", "camera", "description", "what")).lower().replace("-", " ").replace("_", " ")
    if t == "chariot" or (t == "field" and "pose" in sc):
        pose = next((p for rx, p in POSE_MAP if re.search(rx, desc)), "teach")
        cam = str(sc.get("camera", "medium"))
        if t == "chariot" and cam == "wide": t = "field"
        sc.update(type=t, pose=pose)
        if t == "chariot" and cam == "close": sc.update(zoomFrom=1.5, zoomTo=1.58, focusX=880, focusY=430)
        tod = str(sc.get("time", sc.get("time_of_day", sc.get("light", "")))).lower()
        sc["mood"] = "night" if "night" in tod else "dawn" if ("dawn" in tod or "morning" in tod) else "gold" if ("noon" in tod or "gold" in tod) else sc.get("mood", "dusk")
    elif t == "metaphor":
        hit = next((kv for rx, kv in KIND_MAP if re.search(rx, desc)), (desc.split("(")[0].strip().replace(" ", "-"), None))
        if hit[0] not in KINDS: print(f"  note: metaphor '{desc.strip()}' has no scene yet (mapped to '{hit[0]}')")
        sc["kind"], var = hit
        if var and not sc.get("variant"): sc["variant"] = var
    elif t == "light":
        d = desc + " " + str(sc.get("variant", ""))
        sc["variant"] = sc.get("variant") or ("fade" if re.search(r"fade|soft|gentle|return", d) else "dawn" if re.search(r"begin|dawn|point", d) else "friend" if "friend" in d else "full")
    elif t == "title":
        sc.update(chapter=mv["chapter"], name=sc.get("name") or mv["name"], sanskrit=sc.get("sanskrit") or mv.get("sanskrit_name", ""))
    elif t == "verse" or (b.get("ref") and b["speaker"] in ("KRISHNA", "ARJUNA", "DHRITARASHTRA") and b.get("show_sanskrit")):
        r = b.get("ref") or sc.get("ref")
        v = corpus_ref(r if r.startswith("gita:") else f"gita:{r}", author=21)
        sc = dict(type="verse", ref=r, sa=v["sa"], tr=v["tr"], en=b["say"] if b["speaker"] != "SANJAYA" else v["en"], src=v["src"], hl=sc.get("hl") or sc.get("light_up") or [])
    return sc

def main():
    a = sys.argv[1:]; src = pathlib.Path(a[0]); S = json.load(open(src)); fid = S.get("id") or src.stem
    out = ROOT / "public" / "katha" / fid; out.mkdir(parents=True, exist_ok=True)
    beats, problems = [], []
    for mv in S["movements"]:
        ch = int(mv.get("chapter", 0)); label = f"{'Prologue' if ch == 0 else 'Epilogue' if ch >= 19 else 'Chapter ' + str(ch)} · {mv['name']}"
        for b in mv["beats"]:
            p = check_quote(b)
            if p: problems.append(f"{b['key']} {b['speaker']} {b.get('ref')}: {p}")
            sc = scene_for(b, mv)
            if "conch" in str(b.get("music", "")).lower() and sc.get("type") in ("field", "chariot"): sc["conch"] = True
            words = len(re.findall(r"\w+", b["say"]))
            sec = max(3.0, words / WPS + (1.2 if sc["type"] == "verse" else 0.4))
            if sc["type"] == "title": sec = max(sec, 4.5)
            beats.append(dict(key=b["key"], chapter=ch if 1 <= ch <= 18 else 0, movement=label if 1 <= ch <= 18 else "", speaker=b["speaker"], say=b["say"],
                              sec=round(sec, 2), scene=sc, music=b.get("music", "")))
    data = dict(id=fid, title=S["title"], subtitle=S.get("subtitle", ""), beats=beats, music="dharma/tanpura.wav", bell="dharma/bell.wav")
    json.dump(data, open(out / "data.json", "w"), ensure_ascii=False, indent=1)
    tot = sum(b["sec"] + (1.0 if b["scene"]["type"] == "title" else 0.6) for b in beats)
    print(f"{out / 'data.json'}: {len(beats)} beats, {tot / 60:.1f} min (estimated)")
    kinds = sorted({(b['scene']['type'], b['scene'].get('kind', ''), b['scene'].get('pose', ''), b['scene'].get('variant', '')) for b in beats})
    print("scenes:", "; ".join(":".join(x for x in k if x) for k in kinds))
    if problems: print("QUOTE PROBLEMS:"); [print("  " + p) for p in problems]
    else: print("quotes: every Krishna/Arjuna/Dhritarashtra line is corpus text")

if __name__ == "__main__":
    main()

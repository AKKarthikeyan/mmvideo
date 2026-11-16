#!/usr/bin/env python3
"""Build a Katha film's data from its script: public/katha/<id>/data.json, read by src/katha/Film.tsx.

  python3 scripts/katha/build_film.py scripts/katha/gita_film.json            # estimate timings (no audio)
  python3 scripts/katha/build_film.py scripts/katha/gita_film.json --tts      # MiniMax narration per beat (MINIMAX_API_KEY)
  python3 scripts/katha/build_film.py --list-voices                          # the English system voices on the account
  python3 scripts/katha/build_film.py --check [public/katha/gita/data.json]  # every beat -> a real scene (also run on each build)

The script (written for AK's request, 21 Oct 2026: "recreate Bhagavad Geeta by Krishna to Arjuna, premium, rich, poetic")
is a list of movements (prologue, chapters 1-18, epilogue) of beats {key, speaker, say, ref, show_sanskrit, scene, music}.
This step: checks every quoted line against the corpus (Krishna, Arjuna and Dhritarashtra speak only verse text), fills
verse scenes from the corpus (Sanskrit, transliteration, the English as quoted, the source line), maps the script's free
wording of poses and metaphors onto the kit's scene names, and times each beat (2.5 words a second plus a breath)."""
import json, os, re, sys, time, pathlib, unicodedata
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "dharma"))
from corpus import ref as corpus_ref

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
WPS = 2.5                     # spoken words per second (calm, poetic delivery)
# Voices by speaker (override in the script's "voices"). All four use the repo's proven Indian-accent narrator, told apart
# by pitch and pace, so nothing breaks on a wrong voice id; ear-test, then swap ids from --list-voices if wanted.
VOICES = {
    "SANJAYA": {"voice_id": "English_Diligent_Man", "speed": 0.94, "pitch": 0},
    "KRISHNA": {"voice_id": "English_Diligent_Man", "speed": 0.86, "pitch": -3},
    "ARJUNA": {"voice_id": "English_Diligent_Man", "speed": 0.95, "pitch": 1},
    "DHRITARASHTRA": {"voice_id": "English_Diligent_Man", "speed": 0.82, "pitch": -5},
}
PAD = {"verse": 1.6, "title": 0.6}
# Every silhouette in src/katha/sil/*.json names its source and licence in its "credit" field. A film may go on a
# monetised channel only if each is CC0 or drawn in code. Until 21 Oct 2026 the horses and birds came from the ro.me
# models (CC BY-NC-SA 3.0); they were replaced with the CC0 Quaternius horse and birds drawn in code, and main() checks
# the credits on every build so a non-commercial source cannot slip back in (docs/STYLE_RESEARCH_GITHUB.md).
SIL = pathlib.Path(__file__).resolve().parents[2] / "src" / "katha" / "sil"
def sil_licence_problems():
    bad = []
    for p in sorted(SIL.glob("*.json")):
        c = json.loads(p.read_text()).get("credit", "")
        if not ("CC0" in c or "Drawn in code" in c) or any(k in c for k in ("-NC", "NonCommercial", "non-commercial")):
            bad.append(f"{p.name}: {c or 'no credit field'}")
    return bad
CREDITS = [
    "Verses: Shri Purohit Swami (1935) and, for {siv}, Swami Sivananda (1949), edited texts, from the Bhagavad Gita dataset at github.com/gita/gita",
    "Horses traced from the horse model by Quaternius (CC0) · Birds drawn in code",
    "Type: Tiro Devanagari Sanskrit, Cormorant Garamond and Cinzel, SIL Open Font License",
    "Music: tanpura, bansuri and conch synthesised in code · Made in code with Remotion",
]
# Which verses are Sivananda's is decided per beat (ask_jev.py can move one), so the credits are built from the beats'
# own source lines and the script's hand-written credits are checked against them, never trusted to stay in step.
def sivananda_verses(beats):
    refs = []
    for b in beats:
        s = b["scene"]
        if "SIVANANDA" in f"{s.get('src', '')} {s.get('plate', '')}".upper() and b.get("ref"):
            r = b["ref"].replace("gita:", "")
            if r not in refs: refs.append(r)
    return refs
def credits(beats):
    refs = sivananda_verses(beats)
    if not refs: return [CREDITS[0].replace(" and, for {siv}, Swami Sivananda (1949), edited texts", ", edited text")] + CREDITS[1:]
    siv = refs[0] if len(refs) == 1 else ", ".join(refs[:-1]) + " and " + refs[-1]
    return [CREDITS[0].format(siv=siv)] + CREDITS[1:]
def credit_problems(beats, S):
    refs, bad = sivananda_verses(beats), []
    texts = {"description": S.get("description", "")}
    texts.update({f"{b['key']} end card": "\n".join(b["scene"].get("lines") or []) for b in beats if b["scene"].get("type") == "end"})
    for where, text in texts.items():
        # judge only the clause that credits him: the description's chapter-13 note also mentions 13.34
        for clause in re.split(r"(?<!\d)[.;](?!\d)|·|\n", text):
            if "sivananda" not in clause.lower(): continue
            missing = [r for r in refs if not re.search(rf"(?<![\d.]){re.escape(r)}(?!\d)", clause)]
            if missing: bad.append(f"{where} credits Sivananda but does not name {', '.join(missing)}: {clause.strip()}")
    return bad
FPS = 30
def beat_frames(b):   # mirrors beatLen in src/katha/Film.tsx
    return -(-int(round((b["sec"] + (1.0 if b["scene"]["type"] == "title" else 0.6)) * FPS * 1000)) // 1000)   # seconds of quiet after the voice, by scene type (default 0.5)

def tts(text, path, v):
    """MiniMax speech-2.6-hd, as in scripts/build_vx.py (waits on 429s; never switches provider). Returns seconds."""
    import requests
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English",
            "voice_setting": {"voice_id": v["voice_id"], "speed": v.get("speed", 1), "vol": 1, "pitch": v.get("pitch", 0)},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            open(path, "wb").write(bytes.fromhex(j["data"]["audio"])); return j["extra_info"]["audio_length"] / 1000
        print("  retry", path.name, j.get("base_resp")); time.sleep(20 * (attempt + 1))
    raise SystemExit("TTS failed: " + path.name)

def list_voices():
    import requests
    j = requests.post("https://api.minimax.io/v1/get_voice", headers={"Authorization": f"Bearer {os.environ['MINIMAX_API_KEY']}"}, json={"voice_type": "system"}, timeout=60).json()
    for v in j.get("system_voice") or []:
        if v.get("voice_id", "").startswith("English"): print(f"{v['voice_id']:42} {v.get('voice_name', '')}  {'; '.join(v.get('description') or [])[:90]}")

POSE_MAP = [                  # script wording -> ChariotRig pose
    (r"rising|bow-raised|bow raised|resolve|stands? (up|ready)", "resolve"),
    (r"sink|seated|bow-down|bow down|despair|collapse|slump", "despair"),
    (r"arriv|driv|gallop|charge", "arrive"),
    (r"teach|turn|listen|krishna", "teach"),
]
KIND_MAP = [                  # metaphor wording -> (kind, variant)
    (r"windless.*gone out|lamp.*out\b|\(gone out\)", ("lamp", "out")),
    (r"\(the wind\)|wind finds|flicker|thrash", ("lamp", "flicker")),
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

# Refinements that read the beat's free-text "detail" (the shot as the writer saw it) once the kind is known.
DETAIL_VARIANT = [            # (kind, detail regex, variant) applied only when the kind map gave no variant
    ("fire", r"offer|ghee|grain", "offering"),
    ("fire", r"\bash(es)?\b|burn(s|ed)? out", "ash"),
    ("sword", r"\bknot\b", "knot"),
    ("ashvattha", r"\baxe\b|\bcut", "cut"),
]
GLORY_ITEMS = [(r"himalaya|meru|peak|mountain", "himalaya"), (r"ganga|ganges|river", "ganga"), (r"\bsun\b", "sun"),
               (r"ocean|\bsea\b", "ocean"), (r"\blion", "lion"), (r"ashvattha|fig tree|peepal", "ashvattha"),
               (r"letter", "letter"), (r"silen|nothing in it", "silence")]
DEVA = re.compile(r"[ऀ-ॿ][ऀ-ॿ‌‍]*")
HALL_VARIANTS = ("listen", "alone", "dawn")
LIGHT_VARIANTS = ("dawn", "full", "fade", "friend")

def deva_words(t):
    return DEVA.findall(str(t or ""))

def clean_sa(lines):
    """Card Devanagari from the corpus: drop the 'X उवाच' tag (fused into the verse in chapters 12-18), the trailing
    '।।18.78।' marker, and split fused half-verses at the danda (the writer's CARD AND PLATE BUILD (c))."""
    out = []
    for l in lines:
        l = re.sub(r"।।\s*\d+\.\d+\s*।?", "", l).strip()
        l = re.sub(r"^(श्री\s*भगवानुवाच|अर्जुन\s*उवाच|सञ्जय\s*उवाच|धृतराष्ट्र\s*उवाच)\s*", "", l).strip()
        for part in re.split(r"(?<=।)", l):
            part = part.strip()
            if part: out.append(part)
    return out

def clean_tr(lines):
    return [l for l in lines if not re.fullmatch(r"\s*(śhrī[- ]bhagavān|arjuna|sañjaya|dhṛitarāśhtra)\s+uvācha\s*", l)]

def tnorm(t):
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", str(t)).replace("‘", "’").replace("'", "’")).strip().lower()

def parse_overlay(text, refs):
    """scene.overlay is 'देवनागरी · transliteration (stage note...)'. Returns {sa, en, hl, at} for the film's Label, with
    the Devanagari and the transliteration both checked against the corpus lines of the cited verse(s); None if absent.
    hl: a Devanagari fragment the note asks to light ('with क्षेत्र lit')."""
    if not text: return None
    head, _, rest = str(text).partition(" · ")
    sa = " ".join(deva_words(head)) if deva_words(head) else ""
    sas, trs = [], []
    for r in refs:
        try: v = corpus_ref(r, author=21)
        except Exception: continue
        sas += clean_sa(v["sa"]); trs += clean_tr(v["tr"])
    corpus_tr = tnorm(" ".join(trs)); toks = rest.split(); en = ""
    for k in range(len(toks), 0, -1):                       # the longest leading run of words that is corpus transliteration
        cand = " ".join(toks[:k]).rstrip(",;:")
        if tnorm(cand) and tnorm(cand) in corpus_tr: en = cand; break
    m = re.search(r"with\s+(\S+)\s+lit", rest)
    hl = m.group(1) if m and deva_words(m.group(1)) else ""
    ok = bool(sa) and any(sa in l or sa.replace(" ", "") in l.replace(" ", "") for l in sas)
    return {"sa": sa, "en": en, "hl": hl, "checked": ok and bool(en)}

def sun_for(sc, mv, b):
    """Kurukshetra's one dawn (the director's sky rule): the disc stays below the horizon (scenes put it at y = 700) with a
    rim that warms chapter by chapter, and clears it only on 'the light has dawned' (18.73) and after."""
    txt = (str(sc.get("light", "")) + " " + str(sc.get("time", ""))).lower()
    if re.search(r"clears the horizon|sunrise|full morning sun|morning sun", txt): return [960, 590], "dawn", 0.6
    ch = int(mv.get("chapter", 0))
    y = 790 if ch <= 1 else 772 if ch <= 6 else 756 if ch <= 11 else 744 if ch <= 17 else 732
    if re.search(r"about to break|burning", txt): y = 728
    return [960, y], "dawn", 0.35

# A wide field shot's camera, from the writer's "view" (FieldScene pushes about (960, 720)): a pull back starts close and
# opens out; "close" comes in on the chariot and the near ranks; "slow" halves the push. Other views stay editor notes.
VIEW_ZOOM = [(r"pull(s|ing)? back|pull-back|draws? back", (1.08, 1.0)), (r"^close|\bclose\b", (1.16, 1.22)), (r"\bslow\b", (1.0, 1.03))]

def scene_for(b, mv, ctx=None):
    """ctx carries state along the film: ctx["pose"] is the chariot's pose in the last chariot shot of this movement, so a
    wide field shot with no pose of its own continues it (the car stands where the medium shot left it) instead of
    falling back to FieldScene's gallop."""
    ctx = ctx if ctx is not None else {}
    sc = dict(b.get("scene") or {}); t = sc.get("type", "chariot")
    desc = " ".join(str(sc.get(k, "")) for k in ("pose", "kind", "camera", "description", "what")).lower().replace("-", " ").replace("_", " ")
    detail = str(sc.get("detail", "")).lower()
    if t == "chariot" or (t == "field" and "pose" in sc):
        pose = next((p for rx, p in POSE_MAP if re.search(rx, desc)), "teach")
        cam = str(sc.get("camera", "medium"))
        if t == "chariot" and cam == "wide": t = "field"
        sc.update(type=t, pose=pose)
        # close: the two figures fill ~45% of the frame; the pennant stays under the lamps row and the chapter line, the
        # feet above the captions (zoom 1.36 -> 1.42 about (880, 472))
        if t == "chariot" and cam.startswith("close"): sc.update(zoomFrom=1.36, zoomTo=1.42, focusX=880, focusY=472)
        if sc["type"] == "chariot": ctx["pose"] = pose
    elif t == "field":
        # no pose written: Krishna at the reins (or a gallop) drives; else the pose of the last chariot shot in this
        # movement; else the chariot is still arriving (chapter 1's opening) or standing between the armies (teach).
        if re.search(r"\breins\b|gallop|charg|\bdriv", detail): sc["pose"] = "arrive"
        else: sc["pose"] = ctx.get("pose") or ("arrive" if int(mv.get("chapter", 0)) <= 1 else "teach")
    if t == "field" and "zoomFrom" not in sc and sc.get("view"):
        z = next((zz for rx, zz in VIEW_ZOOM if re.search(rx, str(sc["view"]).lower())), None)
        if z: sc["zoomFrom"], sc["zoomTo"] = z
    if t in ("chariot", "field") and "sun" not in sc:
        sc["sun"], mood, rays = sun_for(sc, mv, b)
        sc.setdefault("mood", mood); sc.setdefault("rays", rays)
        tod = str(sc.get("time", "")).lower()
        if "night" in tod: sc["mood"] = "night"
    elif t == "metaphor":
        hit = next((kv for rx, kv in KIND_MAP if re.search(rx, desc)), (desc.split("(")[0].strip().replace(" ", "-"), None))
        if hit[0] not in KINDS: print(f"  note: metaphor '{desc.strip()}' has no scene yet (mapped to '{hit[0]}')")
        sc["kind"], var = hit
        if var and not sc.get("variant"): sc["variant"] = var
        if not sc.get("variant"):
            sc["variant"] = next((v for k, rx, v in DETAIL_VARIANT if k == sc["kind"] and re.search(rx, detail)), None) or sc.pop("variant", None)
            if sc.get("variant") is None: sc.pop("variant", None)
        if sc["kind"] == "fire" and sc.get("variant") == "syllables" and not sc.get("labels"):
            sc["labels"] = deva_words(sc.get("detail"))[:3]            # ॐ तत् सत् as the writer set them (never 17.23's corpus line)
        if sc["kind"] == "glories" and sc.get("variant") != "sparks" and not sc.get("items"):
            pos = sorted((m.start(), item) for rx, item in GLORY_ITEMS for m in [re.search(rx, detail)] if m)
            items = list(dict.fromkeys(i for _, i in pos))
            if items: sc["items"] = items
            if "letter" in items and not sc.get("text") and deva_words(sc.get("detail")): sc["text"] = deva_words(sc.get("detail"))[0]
        if sc["kind"] == "light":
            sc["variant"] = sc.get("variant") or "full"
    elif t == "light":
        d = (desc + " " + str(sc.get("mode", "")) + " " + detail + " " + str(sc.get("variant", ""))).lower()
        if sc.get("variant") not in LIGHT_VARIANTS:
            sc["variant"] = ("friend" if "friend" in d else
                             "fade" if re.search(r"draw in|gathers? back|single point|fade|returns?\b", d) else
                             "dawn" if re.search(r"eyelid|opens|faint|ripple|begin|point of light is born", d) else "full")
        if "tone" not in sc:                                   # 11.26-11.31: the gold deepens towards red, then cools at 'kala'
            sc["tone"] = 0.7 if re.search(r"deepens to red|red\b", d) else 0.45 if re.search(r"most overwhelming|dreadful", d) else 0.3 if re.search(r"slows|wheel", d) else 0
            if not sc["tone"]: sc.pop("tone")
    elif t == "sanjaya":
        lamp = str(sc.get("lamp", "")).lower()
        if sc.get("variant") not in HALL_VARIANTS:              # explicit, so the hall never has to guess from the prose
            sc["variant"] = ("dawn" if int(mv.get("chapter", 0)) >= 19 or re.search(r"gr[ae]y|morning|dawn", detail) else
                             "alone" if re.search(r"\balone\b|empty hall", detail + " " + lamp) else "listen")
    elif t == "title":
        name = sc.get("name") or sc.get("english") or mv["name"]
        sc.update(chapter=mv["chapter"], name=name, sanskrit=sc.get("sanskrit") or mv.get("sanskrit_name", ""))
    elif t == "verse":
        r = b.get("ref") or sc.get("ref")
        v = corpus_ref(r if r.startswith("gita:") else f"gita:{r}", author=21)
        en = sc.get("en_text") or (b["say"] if b["speaker"] != "SANJAYA" else v["en"])
        out = dict(type="verse", ref=r, sa=clean_sa(v["sa"]), tr=clean_tr(v["tr"]), en=en, src=sc.get("src") or v["src"],
                   hl=sc.get("hl") or sc.get("light_up") or [], lines=sc.get("lines") or ["sa", "tr", "en"])
        if sc.get("sa_highlight"): out["sa_hl"] = sc["sa_highlight"]
        if sc.get("highlight"): out["highlight"] = sc["highlight"]          # editor's phrases; the card lights out["hl"] words
        if sc.get("enAt") is not None: out["enAt"] = sc["enAt"]
        sc = out
    # scene.overlay (the cited Devanagari on a non-card scene) -> the film's Label, or the scene's own words where the
    # scene already draws them (the offering lights each word with its gift).
    if sc.get("overlay") and sc.get("type") != "verse":
        refs = [b["ref"]] if b.get("ref") else []
        refs += [f"gita:{m}" for m in re.findall(r"\b(\d{1,2}\.\d{1,2})\b", str(sc["overlay"]))]
        lab = parse_overlay(sc["overlay"], list(dict.fromkeys(refs)))
        if lab and sc.get("kind") == "offering" and re.search(r"each word lit", str(sc["overlay"])) and not sc.get("labels"):
            sc["labels"] = lab["sa"].split()
        elif lab and lab["sa"]:
            sc["label"] = {k: lab[k] for k in ("sa", "en", "hl") if lab[k]}
        if lab and not lab["checked"]: print(f"  note: {b['key']} overlay not matched to the corpus: {sc['overlay'][:60]}")
    return sc

# Every key a beat's scene may carry, and what reads it (the audit; check_scenes() fails on a key not listed here).
SCENE_KEYS = {
    "type": "Film.tsx -> KATHA_SCENES (scenes.tsx)", "kind": "scenes.tsx Metaphor -> METAPHORS (metaphors/index.ts)",
    "variant": "the family scene for the kind / hall / light", "mood": "every scene's sky", "pose": "ChariotScene / FieldScene (ChariotRig)",
    "sun": "ChariotScene / FieldScene", "rays": "ChariotScene / FieldScene", "conch": "FieldScene rings", "zoomFrom": "ChariotScene / FieldScene", "zoomTo": "ChariotScene / FieldScene",
    "focusX": "ChariotScene", "focusY": "ChariotScene", "lamp": "hall SanjayaHall (lampState)", "detail": "hall SanjayaHall (poses); otherwise editor note",
    "labels": "offering / fire syllables / two-roads / gunas / glories words", "items": "cosmos Glories", "text": "cosmos Glories letter", "tone": "cosmos LightScene",
    "plate": "Film.tsx Plate (attribution under the captions)", "kicker": "Film.tsx Plate ('OUR NOTE' tag); TitleCard top line on titles",
    "label": "Film.tsx -> stage.tsx Label (the cited Devanagari, from overlay)", "overlay": "editor note; parsed into label or labels by the builder",
    "strips": "Film.tsx EndStrips", "lines": "VerseCard (which of sa/tr/en) / hall End credit lines", "title": "hall End", "subtitle": "hall End",
    "ref": "VerseCard header", "sa": "VerseCard", "tr": "VerseCard", "en": "VerseCard", "src": "VerseCard source line", "hl": "VerseCard lit words",
    "sa_hl": "VerseCard lit Sanskrit", "highlight": "editor note (phrases; hl holds the words)", "enAt": "VerseScene",
    "chapter": "TitleCard numeral", "name": "TitleCard name", "sanskrit": "TitleCard Sanskrit name", "english": "editor note (copied into name)",
    "transliteration": "TitleCard small caps under the Sanskrit", "line": "TitleCard italic line (main title)",
    "camera": "builder (close -> zoom, wide -> field)", "view": "builder (field: pull back / close / slow -> zoomFrom, zoomTo); otherwise editor note", "time": "builder (sun, mood)", "light": "builder (sun stage); editor note",
    "mode": "builder (light variant)", "justification": "editor note", "king": "editor note", "sanjaya": "editor note", "setting": "editor note",
    "place": "editor note (every card is centred)", "captions": "Film.tsx Caption (false hides it)",
}

def tsx_registry():
    """The scene registries as the code has them: KATHA_SCENES types, METAPHORS kinds by family, and per kind the variant
    literals its component (and the components it renders) compares against."""
    K = SIL.parent; reg = {"types": {}, "kinds": {}, "variants": {}, "glory_items": set()}
    sc = (K / "scenes.tsx").read_text()
    m = re.search(r"KATHA_SCENES[^=]*=\s*\{(.*?)\};", sc, re.S)
    for k, v in re.findall(r"([\w-]+)\s*:\s*([^,}]+)", m.group(1)): reg["types"][k.strip()] = v.strip()
    idx = (K / "metaphors" / "index.ts").read_text()
    fams = re.findall(r'import\s*\{\s*SCENES as (\w+)\s*\}\s*from\s*"\./(\w+)"', idx)
    lit = lambda body: set(re.findall(r'(?:variant|\bv\b|\bmode\b)(?:\s*\|\|\s*"")?\)?\s*[!=]==\s*"([\w-]+)"', body)) | set(re.findall(r'(?:s\??\.variant|\bv\b)\s*(?:\|\||\?\?)\s*"([\w-]+)"', body)) | {x for arr in re.findall(r'\[((?:\s*"[\w-]+"\s*,?)+)\]\.includes\(\s*(?:s\??\.variant|\bv\b|variant|mode)\s*\)', body) for x in re.findall(r'"([\w-]+)"', arr)}
    for alias, fname in fams:
        src = (K / "metaphors" / f"{fname}.tsx").read_text()
        m = re.search(r"export const SCENES[^=]*=\s*\{(.*?)\};", src, re.S)
        tops = {mm.group(1): mm.start() for mm in re.finditer(r"^(?:export )?const (\w+)", src, re.M)}
        starts = sorted(tops.values()) + [len(src)]
        body_of = lambda name: src[tops[name]:next(x for x in starts if x > tops[name])] if name in tops else ""
        def collect(name, seen):
            if name in seen or name not in tops: return set()
            seen.add(name); body = body_of(name); out = lit(body)
            for c in set(re.findall(r"<([A-Z]\w+)", body)) | set(re.findall(r"\b([A-Z]\w+)\(", body)):
                if c in tops: out |= collect(c, seen)
            return out
        for k, comp in re.findall(r'"?([\w-]+)"?\s*:\s*(\w+)', m.group(1)):
            reg["kinds"][k] = fname; reg["variants"][k] = collect(comp, set())
        if fname == "cosmos":
            gi = re.search(r"GITEMS[^=]*=\s*\{(.*?)\};", src, re.S); ga = re.search(r"GALIAS[^=]*=\s*\{(.*?)\};", src, re.S)
            reg["glory_items"] = set(re.findall(r"(\w+)\s*:", gi.group(1))) | set(re.findall(r"(\w+)\s*:", ga.group(1))) | {"letter"}
    reg["type_targets"] = {k: re.search(r'typeScene\("([\w-]+)"\)', v).group(1) for k, v in reg["types"].items() if "typeScene" in v}
    # the chariot rig's poses: the literals ChariotRig compares pose against, plus the scenes' own defaults (s.pose || "x")
    rig = re.search(r"export const ChariotRig.*?\n\};", sc, re.S)
    reg["poses"] = set(re.findall(r'\bpose\s*===\s*"([\w-]+)"', rig.group(0) if rig else "")) | set(re.findall(r's\.pose\s*\|\|\s*"([\w-]+)"', sc))
    return reg

def check_scenes(beats):
    """Every beat must resolve to a real scene: its type in KATHA_SCENES, a metaphor kind in METAPHORS, a variant the
    scene really draws (not a silent default), glories items the scene has, and every quoted beat attributed on screen."""
    reg, bad = tsx_registry(), []
    for b in beats:
        s, key = b["scene"], b["key"]; t = s.get("type")
        if t not in reg["types"]: bad.append(f"{key}: scene type '{t}' is not in KATHA_SCENES"); continue
        kind = s.get("kind") if t == "metaphor" else reg["type_targets"].get(t)
        if t == "metaphor" or t in reg["type_targets"]:
            if kind not in reg["kinds"]: bad.append(f"{key}: {t} kind '{kind}' is not in METAPHORS"); continue
            v = s.get("variant")
            if v and v not in reg["variants"][kind]: bad.append(f"{key}: {kind} has no variant '{v}' (it knows {sorted(reg['variants'][kind]) or 'none'})")
        if t in ("chariot", "field"):          # the pose is always explicit: FieldScene's own default is a gallop
            if not s.get("pose"): bad.append(f"{key}: {t} beat with no pose (the scene would fall back to its default)")
            elif s["pose"] not in reg["poses"]: bad.append(f"{key}: {t} pose '{s['pose']}' is not one ChariotRig draws ({sorted(reg['poses'])})")
        if kind == "glories" and s.get("items"):
            miss = [i for i in s["items"] if i not in reg["glory_items"]]
            if miss: bad.append(f"{key}: glories items {miss} are not drawn")
        for k in s:
            if k not in SCENE_KEYS: bad.append(f"{key}: scene key '{k}' is read by nothing (add it to SCENE_KEYS with its reader)")
        if b["speaker"] in ("KRISHNA", "ARJUNA", "DHRITARASHTRA") and t != "verse" and not s.get("plate"):
            bad.append(f"{key}: {b['speaker']} line with no verse card and no plate (house rule 1)")
    return bad

def main():
    a = sys.argv[1:]
    if "--list-voices" in a: return list_voices()
    if "--check" in a:                     # check an existing data.json against the scene registries, without building
        files = [x for x in a if not x.startswith("--")] or [str(ROOT / "public" / "katha" / "gita" / "data.json")]
        bad = check_scenes(json.load(open(files[0]))["beats"])
        print("SCENE PROBLEMS:\n  " + "\n  ".join(bad) if bad else f"{files[0]}: every beat resolves to a real scene and variant; every quoted line is attributed on screen")
        sys.exit(1 if bad else 0)
    files = [x for x in a if not x.startswith("--")]; voice = "--tts" in a
    src = pathlib.Path(files[0]); S = json.load(open(src)); fid = S.get("id") or src.stem
    out = ROOT / "public" / "katha" / fid; out.mkdir(parents=True, exist_ok=True)
    voices = {**VOICES, **(S.get("voices") or {})}
    old = {b["key"]: b for b in json.load(open(out / "data.json"))["beats"]} if (out / "data.json").exists() else {}
    beats, problems = [], []
    for mv in S["movements"]:
        ctx = {}                           # per movement: the chariot's pose carries from shot to shot
        ch = int(mv.get("chapter", 0)); label = f"{'Prologue' if ch == 0 else 'Epilogue' if ch >= 19 else 'Chapter ' + str(ch)} · {mv['name']}"
        for b in mv["beats"]:
            p = check_quote(b)
            if p: problems.append(f"{b['key']} {b['speaker']} {b.get('ref')}: {p}")
            sc = scene_for(b, mv, ctx)
            if "conch" in str(b.get("music", "")).lower() and sc.get("type") in ("field", "chariot"): sc["conch"] = True
            if b["speaker"] in ("KRISHNA", "ARJUNA", "DHRITARASHTRA") and sc.get("type") != "verse" and not sc.get("plate") and b.get("ref"):
                sc["plate"] = corpus_ref(b["ref"] if b["ref"].startswith("gita:") else f"gita:{b['ref']}", author=21)["src"]
                print(f"  note: {b['key']} had no plate; using the corpus source line")
            if sc.get("type") == "title" and int(mv.get("chapter", 0)) == 0 and not sc.get("kicker"):
                sc["kicker"] = S["title"].split(":")[0].upper()
            if sc.get("type") == "end":
                sc.setdefault("title", S["title"].split(":")[0]); sc.setdefault("subtitle", S.get("subtitle") or "as Krishna told it to Arjuna"); sc.setdefault("lines", credits(beats))
            words = len(re.findall(r"\w+", b["say"]))
            mp3, o, v = out / f"{b['key']}.mp3", old.get(b["key"]), voices.get(b["speaker"], voices["SANJAYA"])
            pad = PAD.get(sc["type"], 0.5)
            if o and o.get("audio") and mp3.exists() and o.get("say") == b["say"] and o.get("voice") == v:
                sec, audio = o["sec"], o["audio"]                                # unchanged line: keep its audio
            elif voice:
                sec = tts(b["say"], mp3, v) + pad; audio = f"katha/{fid}/{mp3.name}"; print(f"  voiced {b['key']} {b['speaker']} {sec:.1f}s")
            else:
                sec = words / WPS + pad + (0.7 if sc["type"] == "verse" else 0); audio = None   # estimate until voiced
            sec = max(sec, 4.5 if sc["type"] == "title" else 3.0)
            beats.append(dict(key=b["key"], part=ch, chapter=ch if 1 <= ch <= 18 else 0, movement=label if 1 <= ch <= 18 else "", speaker=b["speaker"], say=b["say"], ref=b.get("ref"),
                              sec=round(sec, 2), audio=audio, voice=v if audio else None, scene=sc, music=b.get("music", "")))
    data = dict(id=fid, title=S["title"], subtitle=S.get("subtitle", ""), beats=beats, music="dharma/tanpura.wav", bell="dharma/bell.wav")
    json.dump(data, open(out / "data.json", "w"), ensure_ascii=False, indent=1)
    tot = sum(b["sec"] + (1.0 if b["scene"]["type"] == "title" else 0.6) for b in beats)
    # YouTube description with chapter timestamps (exact once every beat is voiced)
    t, marks, seen = 0, [], set()
    for b in beats:
        lab = b["movement"] or ("Epilogue" if b["part"] >= 19 else "Prologue")
        if lab not in seen: seen.add(lab); marks.append((t, lab.replace("Chapter ", "").replace(" · ", ". ", 1) if b["movement"] else lab))
        t += beat_frames(b)
    stamp = lambda fr: f"{fr // FPS // 60}:{fr // FPS % 60:02d}"
    # the script's description carries the writer's estimated chapter list; keep its labels, use the built timings
    body = [l for l in S.get("description", "").strip().split("\n") if not re.match(r"^\d+:\d\d\s", l)]
    named = [re.sub(r"^\d+:\d\d\s+", "", l) for l in S.get("description", "").split("\n") if re.match(r"^\d+:\d\d\s", l)]
    if len(named) == len(marks): marks = [(fr, nm) for (fr, _), nm in zip(marks, named)]
    while body and not body[-1].strip(): body.pop()
    desc = ["\n".join(body).strip(), "", *[f"{stamp(fr)} {lab}" for fr, lab in marks], "", "Credits", *[f"- {c}" for c in credits(beats)]]
    if S.get("youtube_title_options"): desc = ["Title options: " + " | ".join(S["youtube_title_options"]), ""] + desc
    (out / "description.txt").write_text("\n".join(desc).strip() + "\n")
    nv = sum(1 for b in beats if b["audio"])
    print(f"{out / 'data.json'}: {len(beats)} beats, {tot / 60:.1f} min ({nv} voiced, {len(beats) - nv} estimated)")
    kinds = sorted({(b['scene']['type'], b['scene'].get('kind', ''), b['scene'].get('pose', ''), b['scene'].get('variant', '')) for b in beats})
    print("scenes:", "; ".join(":".join(x for x in k if x) for k in kinds))
    if problems: print("QUOTE PROBLEMS:"); [print("  " + p) for p in problems]
    else: print("quotes: every Krishna/Arjuna/Dhritarashtra line is corpus text")
    sbad = check_scenes(beats)
    if sbad: print("SCENE PROBLEMS:"); [print("  " + p) for p in sbad]
    else: print("scenes: every beat resolves to a real scene and variant; every quoted line is attributed on screen")
    bad = sil_licence_problems()
    if bad: print("BLOCKER: these silhouettes are not cleared for a monetised channel:"); [print("  " + b) for b in bad]
    else: print("silhouettes: every horse and bird is CC0 or drawn in code")
    cbad = credit_problems(beats, S)
    if cbad: print("CREDIT PROBLEMS:"); [print("  " + p) for p in cbad]
    else: print(f"credits: Sivananda is named for {', '.join(sivananda_verses(beats)) or 'no verse'} wherever he is credited")

if __name__ == "__main__":
    main()

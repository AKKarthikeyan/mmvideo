"""The only door to MiniMax, our one voice and image provider. On a 429 we wait and try again; we never switch provider.
Needs MINIMAX_API_KEY in the environment.

    MALE, FEMALE                      the two narrator voices
    tts(text, mp3, voice)             voice one line, return its length in seconds
    narrate(text, mp3, kept, ...)     the same, but keeps a recording that still holds these words
    voice_lines(folder, lines, voice) a napkin Short: voice the changed lines, write beats.json
    image(prompt, out, width, height) one picture
"""
import base64, json, os, pathlib, time
import requests

# Narrator rotation (AK 29 Sep 2026): alternate female and male from video to video.
# Order of use so far: Sleep long form (29 Sep) = MALE; moat explainer (29 Sep) = FEMALE. Next video = MALE.
# Napkin Shorts are always MALE (AK 3 Oct 2026: Indian accent; this is MiniMax's only Indian-accent English voice).
MALE = "English_Diligent_Man"      # MiniMax, Indian-accent English
FEMALE = "English_captivating_female1"  # MiniMax "Captivating Female": American documentary/news narrator (AK switched to this 29 Sep: clear, to the point)

API = "https://api.minimax.io/v1/"


def _auth():
    return {"Authorization": f"Bearer {os.environ['MINIMAX_API_KEY']}"}


def tts(text, path, voice=MALE):
    """Voice `text` into the mp3 at `path`; returns its length in seconds."""
    path = pathlib.Path(path)
    body = {"model": "speech-2.6-hd", "text": text.replace("MoatSCORE", "Moat Score"), "stream": False, "language_boost": "English",
            "voice_setting": {"voice_id": voice, "speed": 1, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post(API + "t2a_v2", headers=_auth(), json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            open(path, "wb").write(bytes.fromhex(j["data"]["audio"])); return j["extra_info"]["audio_length"] / 1000
        print("  retry", path.name, j.get("base_resp")); time.sleep(20 * (attempt + 1))
    raise SystemExit("TTS failed: " + path.name)


def estimate(text):
    """Rough length of a line, for a build run with --no-tts."""
    return max(3.0, len(text) / 15)


def narrate(text, mp3, kept=None, voice=MALE, dry=None):
    """Seconds `text` takes to say. `kept` is the length on record when the mp3 still holds these words in this voice
    (None if the line is new or has changed): then nothing is voiced. `dry` is a length to return instead of voicing."""
    if kept is not None and mp3.exists():
        return kept
    if dry is not None:
        return dry
    sec = round(tts(text, mp3, voice), 2); print(" voiced", mp3.stem, sec, flush=True)
    return sec


def voice_lines(folder, lines, voice=MALE):
    """Voice a napkin Short: `lines` is [(key, text)]. Writes <folder>/<key>.mp3 for new or changed lines only, and
    <folder>/beats.json ([{key, text, sec, voice}]), which the player and the caption writers read. Returns the beats."""
    folder = pathlib.Path(folder); folder.mkdir(parents=True, exist_ok=True)
    bj = folder / "beats.json"
    old = {b["key"]: b for b in json.load(open(bj))} if bj.exists() else {}
    beats = []
    for key, text in lines:
        o = old.get(key)
        kept = o["sec"] if o and o["text"] == text and o.get("voice") == voice else None
        beats.append({"key": key, "text": text, "sec": narrate(text, folder / f"{key}.mp3", kept, voice), "voice": voice})
    json.dump(beats, open(bj, "w"), indent=1, ensure_ascii=False)
    return beats


def image(prompt, out, width, height):
    """Generate one picture into `out`. Returns False if MiniMax gave nothing after eight tries."""
    out = pathlib.Path(out)
    body = {"model": "image-01", "prompt": prompt, "width": width, "height": height, "response_format": "base64", "n": 1, "prompt_optimizer": False}
    for attempt in range(8):
        try:
            j = requests.post(API + "image_generation", headers=_auth(), json=body, timeout=240).json()
        except Exception as e:
            j = {"base_resp": str(e)}
        got = (j.get("data") or {}).get("image_base64") or []
        if got:
            out.write_bytes(base64.b64decode(got[0])); return True
        print("  retry", out.name, j.get("base_resp"), flush=True); time.sleep(20 * (attempt + 1))
    return False

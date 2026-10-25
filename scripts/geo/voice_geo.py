# Voice a GeoTales Short: python3 scripts/geo/voice_geo.py siliguri   (or week1:chenab)
# Writes public/geo/<id>/<key>.mp3 + data.json. Re-voices only beats whose text changed.
import importlib, json, os, socket, sys, time
from pathlib import Path
import requests, urllib3.util.connection as uc

uc.allowed_gai_family = lambda: socket.AF_INET   # the Mini's IPv6 route to api.minimax.io hangs
sys.path.insert(0, str(Path(__file__).parent))
from types import SimpleNamespace
if ":" in sys.argv[1]:          # week files: python3 voice_geo.py week1:chenab
    mod, vid = sys.argv[1].split(":")
    M = importlib.import_module(mod)
    S = SimpleNamespace(ID=vid, VOICE=M.VOICE, BEATS=[(k, say, cap, k) for k, say, cap in M.VIDEOS[vid]])
else:
    S = importlib.import_module(sys.argv[1])
OUT = Path(__file__).resolve().parents[2] / "public" / "geo" / S.ID
OUT.mkdir(parents=True, exist_ok=True)

def tts(text, path, voice):
    key = os.environ[os.environ.get("MINIMAX_KEY_VAR", "MINIMAX_API_KEY")]   # MINIMAX_KEY_VAR=MINIMAX_GO_API_KEY uses the second plan (AK, 25 Oct 2026)
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English",
            "voice_setting": {"voice_id": voice, "speed": 1.12, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            path.write_bytes(bytes.fromhex(j["data"]["audio"])); return j["extra_info"]["audio_length"] / 1000
        print("  retry", path.name, j.get("base_resp")); time.sleep(20 * (attempt + 1))   # wait on 429s; never switch provider
    raise SystemExit("TTS failed: " + path.name)

old = {}
if (OUT / "data.json").exists():
    old = {b["key"]: b for b in json.load(open(OUT / "data.json"))["beats"]}
beats = []
for key, say, cap, scene in S.BEATS:
    mp3 = OUT / f"{key}.mp3"; o = old.get(key)
    if mp3.exists() and o and o["say"] == say: sec = o["sec"]
    else: sec = round(tts(say, mp3, S.VOICE), 2); print(" voiced", key, sec)
    beats.append({"key": key, "say": say, "cap": cap, "scene": scene, "sec": sec})
json.dump({"id": S.ID, "beats": beats}, open(OUT / "data.json", "w"), indent=1, ensure_ascii=False)
print(S.ID, len(beats), "beats", round(sum(b["sec"] for b in beats), 1), "s")

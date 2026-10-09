#!/usr/bin/env python3
"""Data Kadai narrator: the same English male voice as Moat & Margin.

Engine 1 (default): MiniMax speech-2.6-hd, voice English_Diligent_Man (Indian-accent English, scripts/voices.py MALE).
  Needs MINIMAX_API_KEY in the environment. Same call as scripts/build_vx.py; retries on 429s.
Engine 2 (placeholder only): Kokoro-82M (Apache-2.0, local, free), used when no MiniMax key is present so a draft can
  still be built. Such a Short is marked voiceEngine "kokoro" and must be re-voiced with MiniMax before posting.
  Setup: pip install kokoro-onnx soundfile (model downloads once to ~/.cache/datakadai/kokoro).
Override: DK_ENGINE=minimax|kokoro, DK_VOICE=<voice id>.
"""
import hashlib, json, os, sys, time, urllib.request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from voices import MALE

ENGINE = os.environ.get("DK_ENGINE") or ("minimax" if os.environ.get("MINIMAX_API_KEY") else "kokoro")
VOICE = os.environ.get("DK_VOICE") or (MALE if ENGINE == "minimax" else "am_michael")
SPEED = 1.0 if ENGINE == "minimax" else 1.08
EXT = "mp3" if ENGINE == "minimax" else "wav"
CACHE = os.path.expanduser("~/.cache/datakadai/kokoro")
REL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"
_k = None


def _kokoro():
    global _k
    if _k is None:
        from kokoro_onnx import Kokoro
        os.makedirs(CACHE, exist_ok=True)
        for f in ("kokoro-v1.0.onnx", "voices-v1.0.bin"):
            p = os.path.join(CACHE, f)
            if not os.path.exists(p) or os.path.getsize(p) < 1_000_000:
                print(f"downloading {f} ...")
                urllib.request.urlretrieve(REL + f, p)
        _k = Kokoro(os.path.join(CACHE, "kokoro-v1.0.onnx"), os.path.join(CACHE, "voices-v1.0.bin"))
    return _k


def _minimax(text, path, voice):
    import requests
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English",
            "voice_setting": {"voice_id": voice, "speed": SPEED, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            open(path, "wb").write(bytes.fromhex(j["data"]["audio"]))
            return j["extra_info"]["audio_length"] / 1000
        print("  retry", os.path.basename(path), j.get("base_resp")); time.sleep(20 * (attempt + 1))   # never switch provider mid-Short
    raise SystemExit("TTS failed: " + path)


def _kokoro_say(text, path, voice):
    import numpy as np, soundfile as sf
    a, sr = _kokoro().create(text, voice=voice, speed=SPEED, lang="en-gb" if voice.startswith("b") else "en-us")
    # loudness-normalise speech to about -16 dBFS RMS (voiced parts only), soft-limit the peaks
    voiced = a[np.abs(a) > 0.02 * np.abs(a).max()]
    a = a * (0.16 / max(1e-6, float(np.sqrt(np.mean(voiced ** 2)))))
    a = np.tanh(a * 1.1) / np.tanh(1.1)
    sf.write(path, a, sr)
    return len(a) / sr


def say(text, stem, voice=None):
    """Voice one line to `<stem>.<mp3|wav>`; return (file name, seconds). Reuses the file when engine, voice and text
    are unchanged (a sidecar .json holds the hash)."""
    voice = voice or VOICE
    path = f"{stem}.{EXT}"
    h = hashlib.sha1(f"{ENGINE}|{voice}|{SPEED}|norm2|{text}".encode()).hexdigest()[:12]
    meta = path + ".json"
    if os.path.exists(path) and os.path.exists(meta):
        m = json.load(open(meta))
        if m.get("h") == h:
            return os.path.basename(path), m["sec"]
    sec = round((_minimax if ENGINE == "minimax" else _kokoro_say)(text, path, voice), 3)
    json.dump({"h": h, "sec": sec, "text": text, "voice": voice, "engine": ENGINE}, open(meta, "w"))
    return os.path.basename(path), sec

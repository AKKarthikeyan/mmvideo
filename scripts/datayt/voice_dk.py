#!/usr/bin/env python3
"""Data Kadai narrator: English male voice for the Shorts, made locally and free.

Engine: Kokoro-82M (Apache-2.0 model, kokoro-onnx package, MIT). Runs offline on CPU, no API key, no cost, and the
audio is ours to use on YouTube. Model files (~350 MB) download once to ~/.cache/datakadai/kokoro.
Voice: DK_VOICE env or the `voice` argument (default am_michael). Other male voices: am_onyx, am_adam, bm_george, bm_lewis.
Setup: pip install kokoro-onnx soundfile
"""
import hashlib, json, os, urllib.request

VOICE = os.environ.get("DK_VOICE", "am_michael")
SPEED = 1.08
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


def say(text, path, voice=None):
    """Write one narration line to `path` (wav, 24 kHz mono); return its length in seconds. Reuses the file when the
    text and voice are unchanged (a sidecar .json holds the hash)."""
    import soundfile as sf
    voice = voice or VOICE
    lang = "en-gb" if voice.startswith("b") else "en-us"
    h = hashlib.sha1(f"{voice}|{SPEED}|norm2|{text}".encode()).hexdigest()[:12]
    meta = path + ".json"
    if os.path.exists(path) and os.path.exists(meta):
        m = json.load(open(meta))
        if m.get("h") == h:
            return m["sec"]
    a, sr = _kokoro().create(text, voice=voice, speed=SPEED, lang=lang)
    # loudness-normalise speech to about -16 dBFS RMS (voiced parts only), soft-limit the peaks
    import numpy as np
    voiced = a[np.abs(a) > 0.02 * np.abs(a).max()]
    a = a * (0.16 / max(1e-6, float(np.sqrt(np.mean(voiced ** 2)))))
    a = np.tanh(a * 1.1) / np.tanh(1.1)
    sf.write(path, a, sr)
    sec = round(len(a) / sr, 3)
    json.dump({"h": h, "sec": sec, "text": text, "voice": voice}, open(meta, "w"))
    return sec

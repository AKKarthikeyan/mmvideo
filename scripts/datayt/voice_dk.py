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


# ---------- Tamil words inside an English narration (AK, 13 Oct 2026) ----------
# The English voice mispronounces Tamil words, so they are spoken from Tamil script by Sarvam Bulbul v3, speaker vijay,
# then trimmed and set level with the English lines around them. Needs SARVAM_API_KEY. Override: DK_TAMIL_SPEAKER.
TAMIL_SPEAKER = os.environ.get("DK_TAMIL_SPEAKER") or "vijay"
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SR = 44100


def pcm(path):
    """A narration file as mono float samples at 44.1 kHz (decoded by Remotion's ffmpeg)."""
    import subprocess, tempfile, wave, numpy as np
    with tempfile.TemporaryDirectory() as d:
        w = os.path.join(d, "a.wav")
        r = subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", os.path.abspath(path), "-vn", "-ac", "1",
                            "-ar", str(SR), "-c:a", "pcm_s16le", w], capture_output=True, text=True, cwd=ROOT)
        if r.returncode or not os.path.exists(w):
            raise SystemExit(f"could not decode {path}: {r.stderr[-200:]}")
        f = wave.open(w)
        return np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16).astype(float) / 32768


def voiced_rms(a):
    """Loudness of the spoken parts only, the same measure the Kokoro normaliser uses."""
    import numpy as np
    v = a[np.abs(a) > 0.02 * np.abs(a).max()]
    return float(np.sqrt(np.mean(v ** 2)))


def say_tamil(text, stem, match=None, speaker=None):
    """Voice Tamil script to `<stem>.wav`: silence trimmed from both ends and, when `match` is given, the voiced level set to
    it. Returns (file name, seconds). Reuses the file when speaker, text and level are unchanged."""
    import base64, wave, numpy as np, requests
    speaker = speaker or TAMIL_SPEAKER
    path = f"{stem}.wav"
    h = hashlib.sha1(f"sarvam|{speaker}|{text}|{round(match or 0, 4)}".encode()).hexdigest()[:12]
    meta = path + ".json"
    if os.path.exists(path) and os.path.exists(meta):
        m = json.load(open(meta))
        if m.get("h") == h:
            return os.path.basename(path), m["sec"]
    body = {"text": text, "target_language_code": "ta-IN", "speaker": speaker, "model": "bulbul:v3", "pace": 1.0, "speech_sample_rate": SR,
            "output_audio_codec": "mp3"}
    raw = f"{stem}.raw.mp3"
    for attempt in range(6):
        r = requests.post("https://api.sarvam.ai/text-to-speech", headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]}, json=body, timeout=120)
        if r.status_code == 200 and r.json().get("audios"):
            open(raw, "wb").write(base64.b64decode("".join(r.json()["audios"])))
            break
        print("  retry", os.path.basename(path), r.status_code, r.text[:160].replace("\n", " "))
        if r.status_code in (401, 403):
            raise SystemExit("Sarvam rejected the key (401/403): check SARVAM_API_KEY")
        time.sleep(20 * (attempt + 1))
    else:
        raise SystemExit("TTS failed: " + path)
    a = pcm(raw)
    on = np.flatnonzero(np.abs(a) > 0.02 * np.abs(a).max())
    a = a[max(0, on[0] - int(0.03 * SR)): on[-1] + int(0.08 * SR)]
    if match:
        a = a * (match / max(1e-6, voiced_rms(a)))
    a = a * min(1.0, 0.95 / max(1e-6, float(np.abs(a).max())))
    n = int(0.005 * SR)
    a[:n] *= np.linspace(0, 1, n); a[-n:] *= np.linspace(1, 0, n)
    w = wave.open(path, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((a * 32767).astype(np.int16).tobytes()); w.close()
    sec = round(len(a) / SR, 3)
    json.dump({"h": h, "sec": sec, "text": text, "voice": speaker, "engine": "sarvam"}, open(meta, "w"))
    return os.path.basename(path), sec


def hear_tamil(path):
    """What Sarvam's speech-to-text hears in a Tamil clip: a check that the word is recognisable, not a judgment of how it
    sounds. Returns "" when the service gives no transcript."""
    import requests
    try:
        r = requests.post("https://api.sarvam.ai/speech-to-text", headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                          files={"file": (os.path.basename(path), open(path, "rb"), "audio/wav")},
                          data={"model": "saarika:v2.5", "language_code": "ta-IN"}, timeout=120)
        return (r.json().get("transcript") or "").strip() if r.status_code == 200 else f"(no transcript: {r.status_code} {r.text[:120]})"
    except Exception as e:      # the check is optional: a build never fails on it
        return f"(no transcript: {e})"

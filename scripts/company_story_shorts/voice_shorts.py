"""Voice-over for the channel Shorts (HyperFrames projects in hyperframes/videos/), timed so the visuals land on the words.

Each beat has a design window [a, b] in the page's original 40 s timeline. After voicing, beat i plays at real time [A_i, B_i]
(its audio length plus a breath). vo.js stores the anchor pairs (design time, real time); the page renders design time
warp(real time), so every animation stretches or squeezes to sit under its line. Captions come from the same beats.

usage:
  python3 voice_shorts.py voice [--engine minimax|local] [ids]   voice every beat, write hyperframes/videos/<id>/vo.js
  python3 hyperframes/tools/hf.py sync <ids> && python3 hyperframes/tools/hf.py render <ids>
  python3 voice_shorts.py mix [ids]                               voice + ducked music bed -> out/hyperframes/<id>_final.mp4

engine minimax (default): the channel voice, English_Diligent_Man, same call as scripts/build_vx.py; needs MINIMAX_API_KEY.
engine local: Kokoro 82M (Apache-2.0), voice am_michael, for drafts where MiniMax is unreachable. Needs `pip install kokoro-onnx`
and kokoro-v1.0.int8.onnx + voices-v1.0.bin (github.com/thewh1teagle/kokoro-onnx releases) in $KOKORO_DIR.
"""
import json
import os
import re
import subprocess
import sys
import time
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
VID = ROOT / "hyperframes" / "videos"
OUT = ROOT / "out" / "hyperframes"
sys.path.insert(0, str(Path(__file__).parent))
from music_bed import bed  # noqa: E402

# key, design window [a, b], words to say, caption on screen ("" = no caption: the words are already on screen)
VIDEOS = {
    "mm-asianpaints": {
        "mood": "warm", "whoosh": [4.6, 17.1, 20.7, 28.5, 35.3], "thud": [29.5], "ping": [],
        "beats": [
            ("k0", 0.0, 1.6, "The paint tin is not the whole moat.", ""),
            ("k1", 1.8, 4.3, "Every hundred rupees that came into Asian Paints last year went somewhere. Let's follow it.",
             "Every ₹100 that came into Asian Paints last year went somewhere. Let's follow it."),
            ("k2", 5.8, 9.4, "Fifty-five rupees paid for raw materials and goods.", "₹55 paid for raw materials and goods."),
            ("k3", 9.6, 13.0, "Other costs, staff, wear and tear, interest and tax took thirty-three more.",
             "Other costs, staff, wear and tear, interest and tax took ₹33 more."),
            ("k4", 13.2, 16.8, "About twelve rupees was left as profit.", "About ₹12 was left as profit."),
            ("kc1", 17.2, 18.6, "Fifty-five of every hundred is materials. Rivals can buy those too.", ""),
            ("kc2", 18.8, 20.4, "So where is the edge?", ""),
            ("k5", 21.0, 24.6, "Maybe at the shop counter: Asian Paints is sold at over one lakh sixty-nine thousand retail touchpoints.",
             "Maybe at the shop counter: over 1.69 lakh retail touchpoints across India."),
            ("k6", 24.8, 28.2, "And last year it added nearly six thousand more.", "In FY26 it added nearly 6,000 more."),
            ("k7", 28.9, 31.9, "In February twenty twenty-four, Grasim launched Birla Opus with about ten thousand crore.",
             "In February 2024, Grasim launched Birla Opus with about ₹10,000 crore."),
            ("k8", 32.1, 35.0, "Asian Paints' revenue fell four and a half percent the next year, then grew four point nine.",
             "Asian Paints' revenue fell 4.5% the next year, then grew 4.9%."),
            ("k9", 35.6, 38.0, "So can ten thousand crore buy one lakh sixty-nine thousand shop counters? Tell us what you think.",
             "Tell us what you think below."),
        ],
    },
    "ma-asml": {
        "mood": "night", "whoosh": [4.8, 15.2, 21.0, 26.4, 30.2, 35.6], "thud": [], "ping": [11.0, 13.6, 18.9],
        "beats": [
            ("k0", 0.0, 1.6, "The machine only one company builds.", ""),
            ("k1", 1.8, 4.8, "Only one company in the world makes EUV chip machines.",
             "Only one company in the world makes EUV chip machines."),
            ("k2", 5.0, 9.6, "It's ASML, in Veldhoven, in the Netherlands.", "It's ASML, in Veldhoven, the Netherlands."),
            ("k3", 9.8, 12.5, "Its mirrors are made with Zeiss, in Oberkochen, Germany.", "Its mirrors are made with ZEISS, in Oberkochen, Germany."),
            ("k4", 12.7, 15.6, "The laser that powers its light comes from Trumpf, in Ditzingen.", "The laser that powers its light comes from TRUMPF, in Ditzingen."),
            ("k5", 15.8, 18.3, "The light source is built in San Diego by Cymer, which ASML bought in twenty thirteen.",
             "The light source is built in San Diego by Cymer, which ASML bought in 2013."),
            ("k6", 18.5, 20.8, "In all, ASML counts five thousand one hundred suppliers.", "In all, ASML counts 5,100 suppliers."),
            ("k7a", 21.2, 23.6, "In twenty twenty-five, it sold forty-eight EUV machines.", "In 2025 it sold 48 EUV machines."),
            ("k7b", 23.7, 26.0, "Eleven point six billion euros: about two hundred and forty million each, on average.",
             "€11.6 billion: about €240 million each, on average."),
            ("k8", 26.4, 29.9, "And eight point two billion more came from servicing and upgrading installed machines.",
             "And €8.2 billion more from servicing and upgrading installed machines."),
            ("k9", 30.3, 35.4, "So could a rival rebuild this whole web from scratch?", "Could a rival rebuild this whole web from scratch?"),
            ("k10", 35.7, 38.0, "Tell us what you think. Next on Moat Atlas: Ferrari.", "Tell us what you think below."),
        ],
    },
}
DESIGN_END = 40.0
LEAD, BREATH, TAIL = 0.15, 0.2, 2.2
LOCAL_SPEED = 1.1                            # Kokoro reads slowly at 1.0; MiniMax stays at the channel's speed 1          # silence before the first line, after each line, and after the last
# Kokoro reads some names and words badly; MiniMax gets the plain spelling
LOCAL_SAY = {"Zeiss": "Tsyce", "Oberkochen": "Oberkokhen", "Cymer": "Sighmer", "ASML": "A S M L", "EUV": "E U V",
             "lakh": "laakh", "Grasim": "Graasim", "Asian Paints'": "Asian Paints's"}


def tts_minimax(text, path, voice="English_Diligent_Man"):
    import requests
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English",
            "voice_setting": {"voice_id": voice, "speed": 1, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            mp3 = path.with_suffix(".mp3")
            mp3.write_bytes(bytes.fromhex(j["data"]["audio"]))
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-ac", "1", "-ar", "44100", str(path)], check=True)
            return
        print("  retry", path.name, j.get("base_resp")); time.sleep(20 * (attempt + 1))
    raise SystemExit("TTS failed: " + path.name)


_kok = None
def tts_local(text, path, voice="am_michael"):
    global _kok
    import soundfile as sf
    from kokoro_onnx import Kokoro
    if _kok is None:
        d = Path(os.environ.get("KOKORO_DIR", Path.home() / "models" / "kokoro"))
        _kok = Kokoro(str(d / "kokoro-v1.0.int8.onnx"), str(d / "voices-v1.0.bin"))
    for a, b in LOCAL_SAY.items():
        text = re.sub(rf"\b{re.escape(a)}", b, text)
    audio, sr = _kok.create(text, voice=voice, speed=LOCAL_SPEED, lang="en-us")
    sf.write(str(path), audio, sr)


def read_wav(p):
    with wave.open(str(p)) as w:
        sr, n, ch, sw = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
        x = np.frombuffer(w.readframes(n), dtype=np.int16 if sw == 2 else np.int32).astype(np.float64)
    x = x.reshape(-1, ch).mean(1) / (32768.0 if sw == 2 else 2 ** 31)
    return x, sr


def trim(x, sr, thr=0.01):
    """Cut leading/trailing silence so the timing is the spoken part only."""
    idx = np.where(np.abs(x) > thr)[0]
    if not len(idx):
        return x
    a, b = max(0, idx[0] - int(0.03 * sr)), min(len(x), idx[-1] + int(0.06 * sr))
    return x[a:b]


def voice(ids, engine):
    for vid in ids:
        V, d = VIDEOS[vid], OUT / "vo" / vid
        d.mkdir(parents=True, exist_ok=True)
        meta_p = d / "meta.json"
        meta = json.loads(meta_p.read_text()) if meta_p.exists() else {}
        beats, anchors, prev_b, prev_B = [], [[0.0, 0.0]], 0.0, 0.0
        for key, a, b, say, cap in V["beats"]:
            wav = d / f"{key}.wav"
            tag = [engine, say] + ([LOCAL_SPEED] if engine == "local" else [])
            if meta.get(key) != tag or not wav.exists():
                (tts_minimax if engine == "minimax" else tts_local)(say, wav)
                meta[key] = tag
                print(" voiced", vid, key)
            x, sr = read_wav(wav)
            dur = len(trim(x, sr)) / sr
            # silence between lines follows the design gap (room for a visual beat), within a breath and 1.4 s
            A = LEAD if not beats else prev_B + min(max(a - prev_b, BREATH), 1.4)
            B = A + dur
            if a > 0:
                anchors.append([a, round(A, 3)])
            anchors.append([b, round(B, 3)])
            beats.append({"id": key, "a": a, "b": b, "A": round(A, 3), "dur": round(dur, 3), "cap": cap, "say": say})
            prev_b, prev_B = b, B
        end = prev_B + TAIL
        anchors.append([DESIGN_END, round(end, 3)])
        # keep anchors strictly increasing in both columns
        clean = [anchors[0]]
        for p in anchors[1:]:
            if p[0] > clean[-1][0] + 1e-6 and p[1] > clean[-1][1] + 1e-6:
                clean.append(p)
        meta_p.write_text(json.dumps(meta, indent=1))
        D = round(end, 2)
        js = (f"// Generated by scripts/company_story_shorts/voice_shorts.py ({engine} voice). Do not edit by hand.\n"
              f"window.VO = {json.dumps({'engine': engine, 'D': D, 'anchors': clean, 'beats': beats}, ensure_ascii=False, indent=1)};\n")
        (VID / vid / "vo.js").write_text(js, encoding="utf-8")
        page = VID / vid / "index.html"
        h = page.read_text(encoding="utf-8")
        h = re.sub(r'data-duration="[\d.]+"', f'data-duration="{D}"', h)
        page.write_text(h, encoding="utf-8")
        print(f"{vid}: {len(beats)} beats, {D:.1f} s ({engine})")


def warp_inv(anchors, d):
    """Design time -> real time."""
    for (d0, r0), (d1, r1) in zip(anchors, anchors[1:]):
        if d <= d1:
            return r0 + (r1 - r0) * (d - d0) / (d1 - d0)
    return anchors[-1][1]


def mix(ids):
    for vid in ids:
        V, d = VIDEOS[vid], OUT / "vo" / vid
        vo = json.loads(re.search(r"window\.VO = (\{.*\});", (VID / vid / "vo.js").read_text(encoding="utf-8"), re.S).group(1))
        SR, D, anc = 44100, vo["D"], vo["anchors"]
        voice_tr = np.zeros(int((D + 0.5) * SR))
        for b in vo["beats"]:
            x, sr = read_wav(d / f"{b['id']}.wav")
            x = trim(x, sr)
            if sr != SR:
                x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
            x = x / (np.abs(x).max() + 1e-9) * 0.85
            s = int(b["A"] * SR)
            voice_tr[s:s + len(x)] += x[: len(voice_tr) - s]
        cues = [[warp_inv(anc, c) for c in V[k]] for k in ("whoosh", "thud", "ping")]
        music = bed(len(voice_tr) / SR, V["mood"], *cues)[: len(voice_tr)]
        env = np.convolve(np.abs(voice_tr), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode="same")
        duck = 1 - 0.62 * np.clip(env / 0.05, 0, 1)
        out = np.tanh((voice_tr + 0.55 * music * duck) * 1.1) * 0.9
        wav = OUT / f"{vid}_mix.wav"
        with wave.open(str(wav), "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((out * 32767).astype(np.int16).tobytes())
        dst = OUT / f"{vid}_final.mp4"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(OUT / f"{vid}.mp4"), "-i", str(wav), "-map", "0:v", "-map", "1:a",
                        "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                        "-shortest", "-movflags", "+faststart", str(dst)], check=True)
        print("wrote", dst)


if __name__ == "__main__":
    args = sys.argv[1:]
    cmd = args.pop(0) if args else "voice"
    engine = "minimax"
    if "--engine" in args:
        i = args.index("--engine"); engine = args[i + 1]; del args[i:i + 2]
    ids = args or list(VIDEOS)
    voice(ids, engine) if cmd == "voice" else mix(ids)

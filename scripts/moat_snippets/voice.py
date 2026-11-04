#!/usr/bin/env python3
"""Voiceover and word timing for a Moat Snippet.

    python3 scripts/moat_snippets/voice.py A1                       # MiniMax voice (needs MINIMAX_API_KEY), then word timing
    python3 scripts/moat_snippets/voice.py A1 --engine kokoro       # local US English voice, no key (KOKORO_MODEL, KOKORO_VOICES = files from kokoro-onnx releases)
    python3 scripts/moat_snippets/voice.py A1 --engine piper        # lower-quality local scratch voice (PIPER_MODEL=path/to/voice.onnx)
    python3 scripts/moat_snippets/voice.py A1 --audio my_take.mp3   # your own recording: only the timing step

Reads the final voiceover for <id> from final/FINAL_SCRIPTS.md. Writes, for the HyperFrames sample that animates it
(default hyperframes/samples/s18-snippet-<id lower>/assets/): vo.mp3 and timing.js (window.TIMING = word start/end seconds,
aligned to the script words with faster-whisper). Voices are not committed; rebuild with this script.
Moat Atlas is US English (AK, 4 Nov 2026): the MiniMax default is "English_CaptivatingStoryteller" (US male storyteller, AK picked it
from six US male samples on 4 Nov 2026) with language_boost English; the Indian-accent male voice in scripts/voices.py is not used here.
It reads slowly (about 2.3 words a second), so a 79-word snippet needs --speed 1.15 or so to stay under 30 s. Kokoro default is af_heart (US female); am_michael is US male.
Check any new voice by ear before publishing.
"""
import argparse, difflib, json, os, re, subprocess, sys, time, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
US_VOICE = "English_CaptivatingStoryteller"   # MiniMax, US male storyteller (AK, 4 Nov 2026)
KOKORO_VOICE = "af_heart"


def script_text(sid):
    t = (HERE / "final" / "FINAL_SCRIPTS.md").read_text()
    m = re.search(rf"## {sid} ·.*?\*\*Voiceover \(final\):\*\*\n> (.+?)\n", t, re.S)
    if not m:
        sys.exit(f"no snippet {sid} in FINAL_SCRIPTS.md")
    return m.group(1).strip()


def minimax(text, voice, speed, out):
    import requests
    key = os.environ.get("MINIMAX_API_KEY") or sys.exit("MINIMAX_API_KEY is not set")
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English",
            "voice_setting": {"voice_id": voice, "speed": speed, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            Path(out).write_bytes(bytes.fromhex(j["data"]["audio"]))
            return
        print("  retry", j.get("base_resp")); time.sleep(20 * (attempt + 1))
    sys.exit("TTS failed")


def piper(text, out):
    from piper import PiperVoice
    model = os.environ.get("PIPER_MODEL") or sys.exit("set PIPER_MODEL to a piper .onnx voice")
    v = PiperVoice.load(model); wav = str(out) + ".wav"
    with wave.open(wav, "wb") as wf:
        v.synthesize_wav(text, wf)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-ar", "44100", "-ac", "1", "-b:a", "128k", str(out)], check=True)
    os.remove(wav)


def kokoro(text, voice, out):
    import soundfile as sf
    from kokoro_onnx import Kokoro
    k = Kokoro(os.environ.get("KOKORO_MODEL") or sys.exit("set KOKORO_MODEL"), os.environ.get("KOKORO_VOICES") or sys.exit("set KOKORO_VOICES"))
    samples, sr = k.create(text, voice=voice, speed=1.0, lang="en-us")
    wav = str(out) + ".wav"; sf.write(wav, samples, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-ar", "44100", "-ac", "1", "-b:a", "128k", str(out)], check=True); os.remove(wav)


def norm(w):
    return re.sub(r"[^a-z0-9.%$]", "", w.lower()).rstrip(".")


def align(text, audio):
    import numpy as np
    from faster_whisper import WhisperModel
    wav = str(audio) + ".16k.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(audio), "-ac", "1", "-ar", "16000", wav], check=True)
    w = wave.open(wav); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype("float32") / 32768; dur = w.getnframes() / 16000; os.remove(wav)
    segs, _ = WhisperModel("small", compute_type="int8").transcribe(a, word_timestamps=True, language="en")
    heard = [(norm(x.word), x.start, x.end) for s in segs for x in s.words if norm(x.word)]
    words = text.split(); keys = [norm(x) for x in words]
    sm = difflib.SequenceMatcher(None, keys, [h[0] for h in heard], autojunk=False); t = [None] * len(words)
    for i, j, n in sm.get_matching_blocks():
        for k in range(n):
            t[i + k] = (heard[j + k][1], heard[j + k][2])
    # fill gaps by spreading evenly between known neighbours
    i = 0
    while i < len(t):
        if t[i] is None:
            j = i
            while j < len(t) and t[j] is None: j += 1
            a0 = t[i - 1][1] if i > 0 else 0.0; b0 = t[j][0] if j < len(t) else dur; step = (b0 - a0) / (j - i)
            for k in range(i, j): t[k] = (a0 + (k - i) * step, a0 + (k - i + 1) * step)
            i = j
        else:
            i += 1
    matched = sum(n for _, _, n in sm.get_matching_blocks())
    return [{"w": w_, "t0": round(a_, 3), "t1": round(b_, 3)} for w_, (a_, b_) in zip(words, t)], dur, matched / len(words)


def mux(a):
    s = ROOT / "hyperframes" / "samples" / f"s18-snippet-{a.id.lower()}"
    vid = ROOT / "out" / "hyperframes" / f"s18-snippet-{a.id.lower()}.mp4"; out = ROOT / "out" / "hyperframes" / f"moat-snippet-{a.id.lower()}.mp4"
    if not vid.exists(): sys.exit(f"render first: python3 hyperframes/tools/hf.py render {s.name[:3][1:]}")
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(vid), "-i", str(s / "assets" / "vo.mp3")]
    if a.music:
        cmd += ["-stream_loop", "-1", "-i", a.music, "-filter_complex", "[1:a]loudnorm=I=-16:TP=-1.5[v];[2:a]volume=0.12,loudnorm=I=-26:TP=-3[m];[v][m]amix=inputs=2:duration=first:normalize=0,apad[a]"]
    else:
        cmd += ["-filter_complex", "[1:a]loudnorm=I=-16:TP=-1.5,apad[a]"]
    # apad + -shortest hangs in newer ffmpeg builds, so stop at the video's own length instead
    vdur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(vid)], capture_output=True, text=True, check=True).stdout.strip()
    subprocess.run(cmd + ["-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", vdur, str(out)], check=True)
    print(out)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("id"); ap.add_argument("--engine", default="minimax", choices=["minimax", "kokoro", "piper"])
    ap.add_argument("--audio"); ap.add_argument("--voice"); ap.add_argument("--speed", type=float, default=1.0); ap.add_argument("--out"); ap.add_argument("--mux", action="store_true", help="mux the rendered silent video with vo.mp3 (+ --music bed) into out/hyperframes/moat-snippet-<id>.mp4"); ap.add_argument("--music")
    a = ap.parse_args(); text = script_text(a.id)
    if a.mux:
        return mux(a)
    out = Path(a.out) if a.out else ROOT / "hyperframes" / "samples" / f"s18-snippet-{a.id.lower()}" / "assets"
    out.mkdir(parents=True, exist_ok=True); mp3 = out / "vo.mp3"
    if a.audio:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.audio, "-ar", "44100", "-ac", "1", str(mp3)], check=True)
    elif a.engine == "piper":
        piper(text, mp3)
    elif a.engine == "kokoro":
        kokoro(text, a.voice or KOKORO_VOICE, mp3)
    else:
        minimax(text, a.voice or US_VOICE, a.speed, mp3)
    words, dur, cov = align(text, mp3)
    (out / "timing.js").write_text("window.TIMING = " + json.dumps({"id": a.id, "duration": round(dur, 3), "words": words}) + ";\n")
    page = out.parent / "index.html"
    if page.exists():
        total = round(dur + 0.5 + 4.0, 2)
        page.write_text(re.sub(r'data-duration="[0-9.]+"', f'data-duration="{total}"', page.read_text(), count=1))
    print(f"voice {dur:.1f}s  {len(words)} words  aligned exactly {cov:.0%}  -> {out}")


if __name__ == "__main__":
    main()

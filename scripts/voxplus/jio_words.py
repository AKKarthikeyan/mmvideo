# Word timestamps for the voiced Jio beats (20 Oct 2026): mlx-whisper large-v3-turbo over public/vx/jioipo/<key>.mp3
# -> public/voxplus/jio/vo/words.json {key: [[word, start_s, end_s], ...]}. Run with ~/jev_full/.stt-venv/bin/python.
import json, pathlib, sys
import mlx_whisper, subprocess, wave, numpy as np
FF = "/tmp/ffbin/ffmpeg"
def load16k(mp3):
    wav = "/tmp/jio_wav_" + pathlib.Path(mp3).stem + ".wav"
    subprocess.run([FF, "-v", "error", "-y", "-i", mp3, "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", wav], check=True)
    w = wave.open(wav); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768.0
    return a
ROOT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public")
D = json.load(open(ROOT / "vx/jioipo/data.json"))
out_p = ROOT / "voxplus/jio/vo/words.json"
out = json.load(open(out_p)) if out_p.exists() else {}
keys = [a for a in sys.argv[1:]] or [b["key"] for b in D["beats"]]
for b in D["beats"]:
    if b["key"] not in keys: continue
    r = mlx_whisper.transcribe(load16k(str(ROOT / "vx/jioipo" / (b["key"] + ".mp3"))), path_or_hf_repo="mlx-community/whisper-large-v3-turbo",
                               word_timestamps=True, language="en", initial_prompt=b["say"])
    out[b["key"]] = [[w["word"].strip(), round(w["start"], 3), round(w["end"], 3)] for s in r["segments"] for w in s.get("words", [])]
    print(b["key"], len(out[b["key"]]), "words", flush=True)
    json.dump(out, open(out_p, "w"), indent=0)

# Word timestamps for "Jio's Size Advantage Has a Catch" beats: mlx-whisper large-v3-turbo over public/voxplus/scale/vo/<key>.mp3
# -> public/voxplus/scale/vo/words.json {key: [[word, start_s, end_s], ...]}. Run with ~/jev_full/.stt-venv/bin/python.
import json, pathlib, subprocess, sys, wave
import numpy as np, mlx_whisper
VO = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/scale/vo"); FF = "/tmp/ffbin/ffmpeg"
B = json.load(open(VO / "beats.json")); out_p = VO / "words.json"
out = json.load(open(out_p)) if out_p.exists() else {}
keys = sys.argv[1:] or [b["key"] for b in B if b["key"] not in out]
for b in B:
    if b["key"] not in keys: continue
    wav = "/tmp/scale_" + b["key"] + ".wav"
    subprocess.run([FF, "-v", "error", "-y", "-i", str(VO / (b["key"] + ".mp3")), "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", wav], check=True)
    w = wave.open(wav); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768.0
    r = mlx_whisper.transcribe(a, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", word_timestamps=True, language="en", initial_prompt=b["say"])
    out[b["key"]] = [[x["word"].strip(), round(x["start"], 3), round(x["end"], 3)] for s in r["segments"] for x in s.get("words", [])]
    print(b["key"], len(out[b["key"]]), flush=True)
    json.dump(out, open(out_p, "w"), indent=0)

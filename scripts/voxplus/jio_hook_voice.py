# Re-voice the hook beat q00 a touch faster (speed 1.06) and trim trailing silence to 0.25 s (20 Oct 2026, AK hook A).
import json, os, subprocess, wave, requests, pathlib, shutil
import numpy as np
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx/jioipo"); FF = "/tmp/ffbin/ffmpeg"
D = json.load(open(R / "data.json")); b = next(x for x in D["beats"] if x["key"] == "q00")
body = {"model": "speech-2.6-hd", "text": b["say"], "stream": False, "language_boost": "English",
        "voice_setting": {"voice_id": "English_Diligent_Man", "speed": 1.06, "vol": 1, "pitch": 0},
        "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": "Bearer " + os.environ["MINIMAX_API_KEY"]}, json=body, timeout=120).json()
raw = "/tmp/q00_fast.mp3"; open(raw, "wb").write(bytes.fromhex(j["data"]["audio"]))
subprocess.run([FF, "-v", "error", "-y", "-i", raw, "-ac", "1", "-c:a", "pcm_s16le", "/tmp/q00_fast.wav"], check=True)
w = wave.open("/tmp/q00_fast.wav"); sr = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
env = np.convolve(np.abs(a), np.ones(int(sr * 0.02)) / int(sr * 0.02), "same")
loud = np.where(env > 0.01)[0]; end = loud[-1] / sr; keep = round(end + 0.25, 3)
subprocess.run([FF, "-v", "error", "-y", "-i", raw, "-af", f"atrim=0:{keep}", "-c:a", "libmp3lame", "-b:a", "128k", "/tmp/q00_new.mp3"], check=True)
shutil.copy("/tmp/q00_new.mp3", R / "q00.mp3")
b["sec"] = keep; json.dump(D, open(R / "data.json", "w"), indent=1, ensure_ascii=False)
print("q00 speech ends", round(end, 2), "kept", keep, "s (was 16.38)")

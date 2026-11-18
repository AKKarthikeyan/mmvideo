#!/usr/bin/env python3
"""Premium style test: one short instrumental sound bed from MiniMax music generation (the only allowed provider).
Tries the instrumental model first; prints the API status and gives up quietly if music is not available on this key."""
import os, sys, time, json, pathlib, requests
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/premium/bed.mp3")
PROMPT = ("Warm, wondrous, premium documentary explainer underscore: soft pizzicato strings, gentle marimba and celesta, "
          "light airy pads, a slow hopeful build, curious and friendly for children, cinematic, no vocals, instrumental")
def call(body):
    key = os.environ["MINIMAX_API_KEY"]
    r = requests.post("https://api.minimax.io/v1/music_generation", headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"}, json=body, timeout=400)
    try: return r.json()
    except Exception: return {"http": r.status_code, "text": r.text[:300]}
tries = [
  {"model": "music-2.0", "prompt": PROMPT, "is_instrumental": True, "audio_setting": {"sample_rate": 44100, "bitrate": 256000, "format": "mp3"}},
  {"model": "music-1.5", "prompt": PROMPT, "lyrics": "[Intro]\n(ooh)\n[Outro]\n(ooh)", "audio_setting": {"sample_rate": 44100, "bitrate": 256000, "format": "mp3"}},
]
for body in tries:
    for attempt in range(3):
        t = time.time(); j = call(body)
        audio = (j.get("data") or {}).get("audio")
        print(body["model"], "status", j.get("base_resp") or j.get("http"), "took", round(time.time() - t), "s", flush=True)
        if audio:
            OUT.write_bytes(bytes.fromhex(audio)); print("wrote", OUT, flush=True); sys.exit(0)
        code = (j.get("base_resp") or {}).get("status_code")
        if code in (1002, 1039):  # rate limited: wait and retry the same model
            time.sleep(40 * (attempt + 1)); continue
        break
print("music not available"); sys.exit(1)

#!/usr/bin/env python3
"""A01 v3 narration: MiniMax speech-2.6-hd, voice English_Diligent_Man, one mp3 per beat (as in build_vx.py), with
MiniMax's own subtitle timings saved beside it. Text is the corrected script (script.md v3.1) word for word; only
pause tags <#s#> are added (no words). Rate limits: wait and retry, never switch provider.
Usage (inside zsh -lic): python3 scripts/premium/a01v3_tts.py [beat ...]"""
import json, os, sys, time, pathlib, requests
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/premium/a01v3/vo")
BEATS = {
  "c01": "A soda. A razor. A plane. Which of these three bets broke? <#0.6#> One company, Berkshire, made all three. Years later, the soda paid it eight hundred and sixteen million dollars. <#0.25#> In one year.",
  "c02": "The plane. <#0.3#> About five years later, it stopped paying. <#0.3#> Why? <#0.5#> Same company. It started all three bets in nineteen eighty eight and nineteen eighty nine.",
  "c03": "The answer has a name, and it comes from castles. <#0.3#> Picture a castle with deep water all around. <#0.3#> That water is a moat.",
  "c04": "By the end, you will have a three-question test to try on a shop on your street. <#0.5#> The plane, the bet Buffett later called a mistake, did not lose Berkshire's money. <#0.3#> How?",
}
def tts(key_, text, path):
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English", "subtitle_enable": True,
            "voice_setting": {"voice_id": "English_Diligent_Man", "speed": 1, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(10):
        try:
            j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=180).json()
        except Exception as e:
            j = {"base_resp": str(e)}
        a = (j.get("data") or {}).get("audio")
        if a:
            path.write_bytes(bytes.fromhex(a))
            sub = (j.get("data") or {}).get("subtitle_file")
            meta = {"beat": key_, "text": text, "extra": j.get("extra_info"), "subtitle_file": bool(sub)}
            if sub:
                try: meta["subs"] = requests.get(sub, timeout=60).json()
                except Exception as e: meta["subs_err"] = str(e)
            (OUT / f"{key_}.json").write_text(json.dumps(meta, indent=1)); print(" voiced", key_, flush=True); return
        print("  retry", key_, j.get("base_resp"), flush=True); time.sleep(20 * (attempt + 1))
    raise SystemExit("TTS failed: " + key_)
if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    want = sys.argv[1:] or list(BEATS)
    for k in want: tts(k, BEATS[k], OUT / f"{k}.mp3")

#!/usr/bin/env python3
"""A01 v4 cold open narration (c01-c05): MiniMax speech-2.6-hd, voice English_Diligent_Man, one mp3 per beat, MiniMax's own
sentence timings saved beside it (vo/<beat>.json). Text = script.md v4.1 narration word for word; only pause tags <#s#> are
added (no words). Rate limits: wait and retry, never switch provider. Key only from the login shell (never printed).
Usage (inside zsh -lic): python3 scripts/voxplus/a01v4_tts.py [beat ...]"""
import json, os, sys, time, pathlib, requests
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/a01v4/vo")
BEATS = {
  "c01": "Why would anyone sell this machine for twenty six dollars? <#0.4#> It is a loom. In nineteen eighty one, Warren Buffett's company, Berkshire, bought some fairly new ones. <#0.2#> Five thousand dollars each.",
  "c02": "When Berkshire shut its cloth mill, no one would buy them, even at fifty dollars. <#0.3#> They went for scrap at twenty six dollars each. <#0.3#> Less than it cost to take them away.",
  "c03": "Now the strange part. <#0.3#> The same letter mentions a candy store. It says one See's store's goodwill was worth more than all the mill's machinery sold for. <#0.2#> So was the goodwill of two paper routes in Buffalo.",
  "c04": "Goodwill is the extra value a business has because people know and trust it. <#0.4#> Our question: why could rivals copy the mill's machines, but not that trust?",
  "c05": "Hint: you cannot touch it. <#0.2#> We think what protects it has a one word name. <#0.2#> In the letters we have, that word first shows up a year later. <#0.2#> Not about candy. <#0.3#> A three question check comes last.",
}
def tts(key_, text, path):
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": "English", "subtitle_enable": True,
            "voice_setting": {"voice_id": "English_Diligent_Man", "speed": 1, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": 44100, "bitrate": 128000, "format": "mp3", "channel": 1}}
    for attempt in range(12):
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

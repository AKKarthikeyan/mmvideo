#!/usr/bin/env python3
"""HAL / HATSOFF Short (3 Oct 2026): hand-drawn "napkin math" format (different from the Vox Short).
Voices each beat with MiniMax (Indian-accent male narrator) and writes public/hand/hal/beats.json. Re-voices only changed lines.
Every figure from HAL's Reg 30 disclosure of 2 Oct 2026 (HATSOFF stake from CAE Canada at NIL consideration)."""
import json, sys, pathlib
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
from voices import MALE
VOICE = MALE   # AK (3 Oct 2026): napkin Shorts use an Indian accent -> English_Diligent_Man (MiniMax's only Indian-accent English voice)
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/hand/hal")
BEATS = [
  ("h1", "HAL has agreed to take half a company. The price: zero rupees."),
  ("h2", "The company is HATSOFF. It trains military and civil helicopter pilots, on simulators."),
  ("h3", "Until now, it was a fifty fifty joint venture: HAL and Canada's CAE."),
  ("h4", "Last year's turnover: eighty point nine five crore rupees."),
  ("h5", "CAE's half: three crore eighty four lakh shares, ten rupees each. That's about thirty eight crore of share capital."),
  ("h6", "HAL's price for it: nil. HAL says it wants full management control."),
  ("h7", "So why would CAE walk away with nothing? The filing doesn't say. Back to the napkin: half a company, zero rupees."),
]
old = {b["key"]: b for b in json.load(open(OUT / "beats.json"))} if (OUT / "beats.json").exists() else {}
out = []
for k, say in BEATS:
    mp3 = OUT / f"{k}.mp3"; o = old.get(k)
    sec = o["sec"] if (mp3.exists() and o and o["text"] == say and o.get("voice") == VOICE) else round(tts(say, mp3, VOICE), 2)
    out.append({"key": k, "text": say, "sec": sec, "voice": VOICE}); print(k, sec)
json.dump(out, open(OUT / "beats.json", "w"), indent=1, ensure_ascii=False)
print("total narration", round(sum(b["sec"] for b in out), 1), "s")

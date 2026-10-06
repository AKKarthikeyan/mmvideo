#!/usr/bin/env python3
"""Short 2 for Shyam Metalics (3 Oct 2026): hand-drawn "napkin math" format (different from the Vox Short).
Voices each beat with MiniMax (Indian-accent male narrator) and writes public/hand/shyam/beats.json. Re-voices only changed lines.
Every figure from Shyam Metalics' filings: MoU (2 Oct 2026), FY26 press release (11 May 2026), Q1 FY27 deck (20 Jul 2026)."""
import json, sys, pathlib
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
from voices import MALE
VOICE = MALE   # AK (3 Oct 2026): napkin Shorts use an Indian accent -> English_Diligent_Man (MiniMax's only Indian-accent English voice)
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/hand/shyam")
BEATS = [
  ("n1", "Fifty thousand crore rupees. Let's check it on a napkin."),
  ("n2", "Shyam Metalics' revenue last year: eighteen thousand five hundred and fifty two crore."),
  ("n3", "Divide. This one steel plant costs about two point seven years of sales."),
  ("n4", "Its own capex plan for the next four to five years? About nine thousand five hundred crore, from its own cash."),
  ("n5", "So the plant is five times the plan. The gap: forty thousand five hundred crore."),
  ("n6", "Who pays the gap? The MoU doesn't say. And it's non binding. So, back to the napkin."),
]
old = {b["key"]: b for b in json.load(open(OUT / "beats.json"))} if (OUT / "beats.json").exists() else {}
out = []
for k, say in BEATS:
    mp3 = OUT / f"{k}.mp3"; o = old.get(k)
    sec = o["sec"] if (mp3.exists() and o and o["text"] == say and o.get("voice") == VOICE) else round(tts(say, mp3, VOICE), 2)
    out.append({"key": k, "text": say, "sec": sec, "voice": VOICE}); print(k, sec)
json.dump(out, open(OUT / "beats.json", "w"), indent=1, ensure_ascii=False)
print("total narration", round(sum(b["sec"] for b in out), 1), "s")

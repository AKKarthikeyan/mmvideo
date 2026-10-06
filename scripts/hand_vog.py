#!/usr/bin/env python3
"""Vedanta Oil & Gas Cambay Short (4 Oct 2026): hand-drawn "napkin math" format (different from the Vox Short).
Voices each beat with MiniMax (Indian-accent male narrator) and writes public/hand/vog/beats.json. Re-voices only changed lines.
Every figure from Vedanta Oil & Gas's Q2 FY27 production release (3 Oct 2026); the split of the fall is our arithmetic."""
import json, sys, pathlib
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
from voices import MALE
VOICE = MALE   # AK (3 Oct 2026): napkin Shorts use an Indian accent -> English_Diligent_Man (MiniMax's only Indian-accent English voice)
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/hand/vog")
BEATS = [
  ("v1", "Vedanta Oil and Gas lost an oil field to ONGC. Output fell nineteen percent. But the lost field isn't the main reason."),
  ("v2", "Daily output: seventy two point two thousand barrels, down from eighty nine point one. A drop of sixteen point nine."),
  ("v3", "Cambay, the field ONGC took over, fell by five point four."),
  ("v4", "Rajasthan, its biggest field, fell by eleven. The company calls it natural decline."),
  ("v5", "So Rajasthan is about two thirds of the fall. Cambay, about one third."),
  ("v6", "And Rajasthan is eighty three percent of what it produces. How long does that contract run? The filings we read don't say. Back to the napkin."),
]
old = {b["key"]: b for b in json.load(open(OUT / "beats.json"))} if (OUT / "beats.json").exists() else {}
out = []
for k, say in BEATS:
    mp3 = OUT / f"{k}.mp3"; o = old.get(k)
    sec = o["sec"] if (mp3.exists() and o and o["text"] == say and o.get("voice") == VOICE) else round(tts(say, mp3, VOICE), 2)
    out.append({"key": k, "text": say, "sec": sec, "voice": VOICE}); print(k, sec)
json.dump(out, open(OUT / "beats.json", "w"), indent=1, ensure_ascii=False)
print("total narration", round(sum(b["sec"] for b in out), 1), "s")

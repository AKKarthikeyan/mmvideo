#!/usr/bin/env python3
"""Channel intro in the napkin-math style, 16:9 (13 Oct 2026). AK-approved script, extended to 60-75 s.
The tea stalls are a made-up example. DMart: Q2 FY27 results filed 10 Oct 2026 (revenue +18.4%, profit after tax +7.6%).
Usage: hand_intro.py   -> public/hand/introN/beats.json + mp3s (only changed lines are voiced again)"""
import json, sys, pathlib
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
from voices import MALE
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/hand/introN"); OUT.mkdir(parents=True, exist_ok=True)
LINES = [
 ("i1", "Two tea stalls, same street. One sells a cup for ten rupees. The other, for fifteen. Guess which one has the queue?"),
 ("i2", "Both spend eight rupees to make a cup."),
 ("i3", "So one keeps two rupees. The other keeps seven."),
 ("i4", "Sell two hundred cups a day. One stall takes home four hundred rupees. The other, fourteen hundred."),
 ("i5", "What a business keeps is its margin."),
 ("i6", "And the reason the queue does not walk next door? That is its moat."),
 ("i7", "Maybe it is the taste. Maybe thirty years of trust. Whatever it is, next door cannot copy it."),
 ("i8", "That is our name, and our whole job. Moat and Margin."),
 ("i9", "Every working day, companies file hundreds of documents. We pick out the few that matter."),
 ("i10", "We do the same sum on real companies, from their own filings. D Mart sold eighteen percent more in one quarter. Its profit grew under eight. We went and found out why."),
 ("i11", "No tips. No targets. Just the numbers, in plain words, with the document linked."),
 ("i12", "Because once you can read a business, you see it everywhere. Even at a tea stall. Subscribe, and read along."),
]
old = {b["key"]: b for b in json.load(open(OUT / "beats.json"))} if (OUT / "beats.json").exists() else {}
out = []
for k, say in LINES:
    mp3 = OUT / f"{k}.mp3"; o = old.get(k)
    sec = o["sec"] if (mp3.exists() and o and o["text"] == say and o.get("voice") == MALE) else round(tts(say, mp3, MALE), 2)
    out.append({"key": k, "text": say, "sec": sec, "voice": MALE})
json.dump(out, open(OUT / "beats.json", "w"), indent=1, ensure_ascii=False)
print("introN", round(sum(b["sec"] + 0.15 for b in out), 1), "s", [b["sec"] for b in out])

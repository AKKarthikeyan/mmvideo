#!/usr/bin/env python3
"""Voice the moat explainer (female narrator) and write public/explainer/data.json + SRT. Usage: build_explainer.py"""
import json, math, sys, pathlib
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts"); sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts/explainer")
from build_vx import chunks, tts
from voices import FEMALE
from moat_explainer import BEATS
FPS = 30; PAD = 0.7
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/explainer"); OUT.mkdir(parents=True, exist_ok=True)
REL = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/explainer"); REL.mkdir(parents=True, exist_ok=True)
old = {b["key"]: b for b in json.load(open(OUT / "data.json"))["beats"]} if (OUT / "data.json").exists() else {}
t = 0; srt = []
for b in BEATS:
    mp3 = OUT / f"{b['key']}.mp3"; o = old.get(b["key"])
    if mp3.exists() and o and o["say"] == b["say"]: b["sec"] = o["sec"]
    else: b["sec"] = round(tts(b["say"], mp3, FEMALE), 2); print(" voiced", b["key"], b["sec"])
    b["frames"] = math.ceil((b["sec"] + PAD) * FPS); b["cues"] = chunks(b["say"], 60)
    tot = sum(len(c) for c in b["cues"]); acc = 0
    for c in b["cues"]:
        a = t / FPS + b["sec"] * acc / tot; acc += len(c); srt.append((a, t / FPS + b["sec"] * acc / tot, c))
    t += b["frames"]
json.dump({"beats": BEATS, "total": t}, open(OUT / "data.json", "w"), indent=1, ensure_ascii=False)
ts = lambda x: f"{int(x//3600):02d}:{int(x%3600//60):02d}:{int(x%60):02d},{int(round(x%1*1000))%1000:03d}"
open(REL / "moat_explainer.srt", "w").write("\n".join(f"{i+1}\n{ts(a)} --> {ts(z)}\n{c}\n" for i, (a, z, c) in enumerate(srt)))
print(f"{len(BEATS)} beats, {t/FPS:.1f}s")

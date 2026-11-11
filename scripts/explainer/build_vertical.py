#!/usr/bin/env python3
"""60-second vertical cut of the moat explainer: reuses voiced beats from public/explainer, voices two new short lines (same female voice)."""
import json, math, shutil, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
import mm
from build_vx import chunks
from minimax import FEMALE, narrate
FPS = 30; PAD = 0.45
SRC = mm.PUBLIC / "explainer"; OUT = SRC / "vertical"; OUT.mkdir(exist_ok=True)
full = {b["key"]: b for b in json.load(open(SRC / "data.json"))["beats"]}
NEW = {"we": "What do we do? Moat and Margin reads each company's own filings, scores its moat, and tells you every day what changed.",
       "end": "Moat and Margin. Educational research, not investment advice."}
ORDER = ["v1", "k2", "v2", "v4", "k4", "we", "end"]
old = {b["key"]: b for b in json.load(open(OUT / "data.json"))["beats"]} if (OUT / "data.json").exists() else {}
beats = []; t = 0
for k in ORDER:
    mp3 = OUT / f"{k}.mp3"
    if k in NEW:
        say = NEW[k]; o = old.get(k)
        sec = narrate(say, mp3, o["sec"] if o and o["say"] == say else None, FEMALE)
    else:
        say, sec = full[k]["say"], full[k]["sec"]; shutil.copy(SRC / f"{k}.mp3", mp3)
    fr = math.ceil((sec + PAD) * FPS)
    beats.append({"key": k, "say": say, "sec": sec, "frames": fr, "cues": chunks(say, 34)}); t += fr
json.dump({"beats": beats, "total": t}, open(OUT / "data.json", "w"), indent=1, ensure_ascii=False)
print(f"{len(beats)} beats, {t/FPS:.1f}s")

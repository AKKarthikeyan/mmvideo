#!/usr/bin/env python3
"""Voice the moat explainer (female narrator) and write public/explainer/data.json + SRT. Usage: build_explainer.py"""
import json, math, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
import mm
from build_vx import chunks
from minimax import FEMALE, narrate
from moat_explainer import BEATS
FPS = 30; PAD = 0.7
OUT = mm.PUBLIC / "explainer"; OUT.mkdir(parents=True, exist_ok=True)
REL = mm.OUT / "explainer"; REL.mkdir(parents=True, exist_ok=True)
old = {b["key"]: b for b in json.load(open(OUT / "data.json"))["beats"]} if (OUT / "data.json").exists() else {}
for b in BEATS:
    o = old.get(b["key"])
    b["sec"] = narrate(b["say"], OUT / f"{b['key']}.mp3", o["sec"] if o and o["say"] == b["say"] else None, FEMALE)
    b["frames"] = math.ceil((b["sec"] + PAD) * FPS); b["cues"] = chunks(b["say"], 60)
tl, t = mm.framed_timeline(BEATS)
json.dump({"beats": BEATS, "total": t}, open(OUT / "data.json", "w"), indent=1, ensure_ascii=False)
mm.write_srt(REL / "moat_explainer.srt", tl)
print(f"{len(BEATS)} beats, {t/FPS:.1f}s")

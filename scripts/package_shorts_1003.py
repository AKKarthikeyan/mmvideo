#!/usr/bin/env python3
"""SRT captions for the HAL napkin Short and the CEO-chain kinetic Short (3 Oct 2026)."""
import json, math, re, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from package_shyam import srt, split
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx")
H = json.load(open("/Volumes/DarwinSSD/MMVideo/public/hand/hal/beats.json")); t = 0; ent = []
for b in H:
    parts = [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", b["text"]) if p.strip()]
    ent += split(b["text"], t, t + b["sec"], parts); t += math.ceil((b["sec"] + 0.15) * FPS) / FPS
srt(ent, OUT / "hal-hatsoff-short-napkin-math.srt"); print(f"hal: {t:.1f}s")
D = json.load(open("/Volumes/DarwinSSD/MMVideo/public/vx/ceos/data.json")); by = {b["key"]: b for b in D["beats"]}; t = 0; ent = []
for k in D["shorts"][0]["beats"]:
    b = by[k]; ent += split(b["cap"], t, t + b["sec"], b["cues"]); t += math.ceil((b["sec"] + 0.12) * FPS) / FPS
srt(ent, OUT / "ceo-chain-icici-short-kinetic.srt"); print(f"ceo: {t:.1f}s")

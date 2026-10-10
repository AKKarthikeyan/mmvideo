#!/usr/bin/env python3
"""4 Oct 2026 kit: chapters + SRT for the Q2 bank long video, the JLR kinetic Short and the Vedanta napkin Short."""
import json, math, re, pathlib, sys
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from srt_util import srt, split  # (also refreshes the Shyam SRTs, harmless)
FPS = 30; OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx"); VX = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx")
D = json.load(open(VX / "banksq2/data.json")); t = 0; ent = []; chap = {}
for b in D["beats"]:
    chap.setdefault(b["ch"], t)
    if b["scene"]["type"] != "title": ent += split(b["cap"], t, t + b["sec"], b["cues"])
    t += math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) / FPS
srt(ent, OUT / "bank-q2-results-preview-22-banks.srt"); print(f"BANK LONG {int(t//60)}:{int(t%60):02}")
for c, s in sorted(chap.items()): print(f"{int(s//60):02}:{int(s%60):02} {D['chapters'][c]}")
S = json.load(open(VX / "jlrs/data.json")); by = {b["key"]: b for b in S["beats"]}; t = 0; ent = []
for k in S["shorts"][0]["beats"]:
    b = by[k]; ent += split(b["cap"], t, t + b["sec"], b["cues"]); t += math.ceil((b["sec"] + 0.12) * FPS) / FPS
srt(ent, OUT / "jlr-q2-short-kinetic.srt"); print(f"JLR short {t:.1f}s")
H = json.load(open("/Volumes/DarwinSSD/MMVideo/public/hand/vog/beats.json")); t = 0; ent = []
for b in H:
    parts = [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", b["text"]) if p.strip()]
    ent += split(b["text"], t, t + b["sec"], parts); t += math.ceil((b["sec"] + 0.15) * FPS) / FPS
srt(ent, OUT / "vedanta-oil-gas-cambay-short-napkin-math.srt"); print(f"VOG short {t:.1f}s")

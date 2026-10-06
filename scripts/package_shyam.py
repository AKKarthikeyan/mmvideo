#!/usr/bin/env python3
"""Shyam Metalics kit (3 Oct 2026): chapter timestamps + SRT captions for the long video and both Shorts.
Timing mirrors the engines: Vox long beat = sec + 0.5 s (titles + 1.1 s); loop Short beat = sec + 0.12 s;
hand Short beat = sec + 0.15 s. Captions split a beat by characters, like the on-screen cues."""
import json, math, re, pathlib
FPS = 30
VX = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/vx"); OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/out/vx")

def ts(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"

def srt(entries, path):
    with open(path, "w") as f:
        for i, (a, b, t) in enumerate(entries, 1): f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{t}\n\n")

def split(text, a, b, parts):
    tot = sum(len(p) for p in parts) or 1; out = []; acc = 0
    for p in parts:
        s = a + (b - a) * acc / tot; acc += len(p); out.append((s, a + (b - a) * acc / tot, p))
    return out

# long video
D = json.load(open(VX / "shyam/data.json")); t = 0; ent = []; chap = {}
for b in D["beats"]:
    n = math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * FPS) / FPS
    chap.setdefault(b["ch"], t)
    if b["scene"]["type"] not in ("title",): ent += split(b["cap"], t, t + b["sec"], b["cues"])
    t += n
srt(ent, OUT / "shyam-metalics-latest-news-50000-crore-mou.srt")
print(f"long: {int(t//60)}:{int(t%60):02}")
for c, s in sorted(chap.items()): print(f"{int(s//60):02}:{int(s%60):02} {D['chapters'][c]}")

# Short 1 (Vox loop)
S = json.load(open(VX / "shyams/data.json")); by = {b["key"]: b for b in S["beats"]}; t = 0; ent = []
for k in S["shorts"][0]["beats"]:
    b = by[k]; ent += split(b["cap"], t, t + b["sec"], b["cues"]); t += math.ceil((b["sec"] + 0.12) * FPS) / FPS
srt(ent, OUT / "shyam-metalics-short1-vox.srt"); print(f"short1: {t:.1f}s")

# Short 2 (hand-drawn napkin math)
H = json.load(open("/Volumes/DarwinSSD/MMVideo/public/hand/shyam/beats.json")); t = 0; ent = []
for b in H:
    parts = [p.strip() for p in re.findall(r"[^.!?]+[.!?]*", b["text"]) if p.strip()]
    ent += split(b["text"], t, t + b["sec"], parts); t += math.ceil((b["sec"] + 0.15) * FPS) / FPS
srt(ent, OUT / "shyam-metalics-short2-napkin-math.srt"); print(f"short2: {t:.1f}s")

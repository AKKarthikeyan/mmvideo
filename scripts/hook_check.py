#!/usr/bin/env python3
"""Hook cadence check for a long video (AK, 11 Oct 2026: a real hook at the start, then a hook at most every 45 s).
Reads the built timings in public/vx/<id>/data.json and V["hooks"] from scripts/vx_scripts.py: a list of "key|phrase"
(the beat, and the words that open or re-open a question for the viewer) or bare "key" (the beat opens on it).
A hook counts from the moment its phrase is spoken.
usage: hook_check.py <id> [--max 45]      exit 0 = cadence holds, 1 = a gap is too long or the opening has no question"""
import json, math, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from vx_scripts import VIDEOS
vid = sys.argv[1]; MAX = float(sys.argv[sys.argv.index("--max") + 1]) if "--max" in sys.argv else 45.0
V = next(v for v in VIDEOS if v["id"] == vid); hooks = V.get("hooks") or []
D = json.load(open(pathlib.Path(__file__).resolve().parent.parent / "public/vx" / vid / "data.json"))
HK = {}
for h in hooks:
    k, _, ph = h.partition("|"); HK.setdefault(k, []).append(ph)
t = 0.0; pts = []; first_q = None
for b in D["beats"]:
    say = b["say"]; n = math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * 30) / 30
    if first_q is None and "?" in say: first_q = t + b["sec"] * say.index("?") / len(say)
    for ph in HK.get(b["key"], []):
        i = say.lower().find(ph.lower()) if ph else 0      # "key|phrase": the hook is spoken at that phrase; bare "key": at the start of the beat
        if i < 0: print(f"  FAIL  hook phrase not in {b['key']}: {ph}"); i = 0
        pts.append((t + b["sec"] * i / len(say), b["key"], (ph or say)[:70]))
    t += n
pts.sort()
fmt = lambda s: f"{int(s // 60)}:{int(s % 60):02d}"
print(f"{vid}: {fmt(t)} total, {len(pts)} hook beats, limit {MAX:.0f} s")
bad = 0
if first_q is None or first_q > 5: bad += 1; print(f"  FAIL  opening question by 0:05: first question at {fmt(first_q) if first_q is not None else 'never'}")
else: print(f"  PASS  opening question by 0:05: at {first_q:.1f} s")
prev = 0.0
for s, k, txt in pts + [(t, "END", "")]:
    gap = s - prev; flag = "FAIL" if gap > MAX else "ok  "
    if gap > MAX: bad += 1
    print(f"  {flag}  {fmt(s)}  +{gap:4.0f} s  {k:5} {txt}")
    prev = s
print(f"{bad} problem(s)" if bad else "hook cadence holds"); sys.exit(1 if bad else 0)

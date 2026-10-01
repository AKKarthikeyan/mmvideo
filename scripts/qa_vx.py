#!/usr/bin/env python3
"""QA stills at 85% of each beat of VX-<id>-long + contact sheet (run before the full render). Usage: qa_vx.py <id> [bundle]"""
import json, math, subprocess, sys, pathlib
import fitz
MM = pathlib.Path("/Volumes/DarwinSSD/MMVideo")
vid = sys.argv[1]; bundle = sys.argv[2] if len(sys.argv) > 2 else "/tmp/ltb"
D = json.load(open(MM / "public/vx" / vid / "data.json"))
qa = MM / "out/vx/qa" / vid; qa.mkdir(parents=True, exist_ok=True)
at = 0; shots = []
for b in D["beats"]:
    n = math.ceil((b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5)) * 30)
    fr = at + int(n * 0.85); at += n
    png = qa / f"{b['key']}.png"
    subprocess.run(["npx", "remotion", "still", bundle, f"VX-{vid}-long", str(png), f"--frame={fr}", "--scale=0.25", "--log=error"], cwd=MM, check=True)
    shots.append((b["key"], b["scene"]["type"], png))
cols, w, h = 6, 480, 270; rows = (len(shots) + cols - 1) // cols
doc = fitz.open(); pg = doc.new_page(width=cols * w, height=rows * (h + 22))
for i, (k, t, png) in enumerate(shots):
    x, y = (i % cols) * w, (i // cols) * (h + 22)
    pg.insert_image(fitz.Rect(x, y, x + w, y + h), filename=str(png)); pg.insert_text((x + 6, y + h + 16), f"{k} · {t}", fontsize=13)
pg.get_pixmap().save(qa / "qa_sheet.png"); print("sheet", qa / "qa_sheet.png")

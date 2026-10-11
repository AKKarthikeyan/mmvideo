#!/usr/bin/env python3
"""Export the illustration library: one still and one short silent clip of every illustrated scene type, each kit icon as a
transparent PNG, and a catalogue sheet. Source of the drawings: src/vx/illus/ (kit.tsx and the scene files).
Example props: illustration-library/props/<type>.json  ({"scene": {...}, "say": "...", "sec": 12.3}).
usage: export_illustration_library.py [type ...] [--no-clips]"""
import json, math, pathlib, shutil, subprocess, sys, tempfile
from PIL import Image, ImageDraw
MM = pathlib.Path(__file__).resolve().parent.parent; LIB = MM / "illustration-library"
ICONS = ["store", "trolley", "coin", "note", "bank", "box", "person", "tag"]
want = [a for a in sys.argv[1:] if not a.startswith("--")]; clips = "--no-clips" not in sys.argv
pub = pathlib.Path(tempfile.mkdtemp()) / "public"; shutil.copytree(MM / "public/fonts", pub / "fonts"); bundle = str(pub.parent / "bundle")
r = subprocess.run(["npx", "remotion", "bundle", "src/index.ts", "--out-dir", bundle, "--public-dir", str(pub), "--log=error"], cwd=MM, capture_output=True, text=True)
if r.returncode: sys.exit("BUNDLE FAILED\n" + (r.stdout + r.stderr)[-3000:])
def run(args):
    r = subprocess.run(["npx", "remotion", *args, "--log=error"], cwd=MM, capture_output=True, text=True)
    if r.returncode: print("FAIL", args[:4], (r.stdout + r.stderr)[-800:])
    return r.returncode == 0
(LIB / "scenes").mkdir(parents=True, exist_ok=True); (LIB / "icons").mkdir(exist_ok=True); tmp = pub.parent
done = []
for pj in sorted((LIB / "props").glob("*.json")):
    k = pj.stem
    if want and k not in want: continue
    P = json.load(open(pj)); P["guides"] = False; n = math.ceil((P["sec"] + 0.5) * 30); q = tmp / f"{k}.json"; json.dump(P, open(q, "w"), ensure_ascii=False)
    ok = run(["still", bundle, "ILLUS-dev", str(LIB / "scenes" / f"{k}.png"), f"--props={q}", f"--frame={n - 2}"])
    if ok and clips: run(["render", bundle, "ILLUS-dev", str(LIB / "scenes" / f"{k}.mp4"), f"--props={q}", f"--frames=0-{n - 1}", "--muted"])
    if ok: done.append(k); print("scene", k)
if not want:
    for name in ICONS:
        q = tmp / f"icon_{name}.json"; json.dump({"name": name}, open(q, "w"))
        if run(["still", bundle, "ILLUS-icon", str(LIB / "icons" / f"{name}.png"), f"--props={q}", "--image-format=png"]): print("icon", name)
    ks = sorted(p.stem for p in (LIB / "scenes").glob("*.png")); w, h, cols = 640, 360, 4; rows = (len(ks) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * w, rows * (h + 26) + 150), "white"); d = ImageDraw.Draw(sheet)
    for i, k in enumerate(ks):
        x, y = (i % cols) * w, (i // cols) * (h + 26); sheet.paste(Image.open(LIB / "scenes" / f"{k}.png").convert("RGB").resize((w, h)), (x, y)); d.text((x + 6, y + h + 6), k, fill="black")
    for i, name in enumerate(ICONS):
        im = Image.open(LIB / "icons" / f"{name}.png").convert("RGBA").resize((120, 120)); sheet.paste(im, (20 + i * 150, rows * (h + 26) + 6), im); d.text((50 + i * 150, rows * (h + 26) + 130), name, fill="black")
    sheet.save(LIB / "catalogue.png"); print("catalogue", LIB / "catalogue.png")
shutil.rmtree(pub.parent, ignore_errors=True)

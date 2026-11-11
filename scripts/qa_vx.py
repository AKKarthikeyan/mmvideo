#!/usr/bin/env python3
"""QA stills before a full render: one still of every beat plus a labelled contact sheet, or a closer look at chosen beats.
Usage: qa_vx.py <id> [bundle]                          every beat of VX-<id>-long at 85 % of the beat, and qa_sheet.png
       qa_vx.py <id> [bundle] --keys k1,k2 [--at 0.5]  only these beats, at this point of the beat, twice the size, no sheet
       add --letter when <id> is a fund-letter episode (public/letters/<slug>/, composition LT-<slug>)
Bundle first: npx remotion bundle src/index.ts --out-dir /tmp/ltb   (/tmp/ltb is the default bundle).
Stills go to out/vx/qa/<id>/ (fund letters: out/letters/<slug>/qa/, sheet beside that folder)."""
import json, shutil, subprocess, sys
import fitz
import mm

NPX = shutil.which("npx") or "/opt/homebrew/bin/npx"


def contact_sheet(shots, path, cols=6, w=480, h=270):
    """shots: [(key, scene type, png)] -> one labelled sheet."""
    rows = (len(shots) + cols - 1) // cols
    doc = fitz.open(); pg = doc.new_page(width=cols * w, height=rows * (h + 22))
    for i, (k, t, png) in enumerate(shots):
        x, y = (i % cols) * w, (i // cols) * (h + 22)
        pg.insert_image(fitz.Rect(x, y, x + w, y + h), filename=str(png)); pg.insert_text((x + 6, y + h + 16), f"{k} · {t}", fontsize=13)
    pg.get_pixmap().save(path)


def main():
    opt = lambda name: sys.argv[sys.argv.index(name) + 1] if name in sys.argv else None
    keys, at = opt("--keys"), opt("--at")
    args = [a for a in sys.argv[1:] if not a.startswith("--") and a not in (keys, at)]
    if not args:
        sys.exit(__doc__)
    vid = args[0]; bundle = args[1] if len(args) > 1 else "/tmp/ltb"
    if "--letter" in sys.argv:
        tl, _ = mm.framed_timeline(json.load(open(mm.PUBLIC / "letters" / vid / "data.json"))["beats"])
        comp = "LT-" + vid.replace("_", "-"); qa = mm.OUT / "letters" / vid / "qa"; sheet = qa.parent / "qa_sheet.png"
    else:
        tl, _ = mm.timeline(mm.vx(vid))
        comp = f"VX-{vid}-long"; qa = mm.OUT / "vx/qa" / vid; sheet = qa / "qa_sheet.png"
    qa.mkdir(parents=True, exist_ok=True)
    want = keys.split(",") if keys else None
    frac, scale = (float(at or 0.5), 0.5) if want else (0.85, 0.25)
    shots = []
    for b, start, n in tl:
        if want and b["key"] not in want:
            continue
        png = qa / f"{b['key']}.png"
        subprocess.run([NPX, "remotion", "still", bundle, comp, str(png), f"--frame={start + int(n * frac)}", f"--scale={scale}", "--log=error"], cwd=mm.REPO, check=True)
        shots.append((b["key"], b["scene"]["type"], png))
    if not want:
        contact_sheet(shots, sheet); print("sheet", sheet, len(shots), "stills")


if __name__ == "__main__":
    main()

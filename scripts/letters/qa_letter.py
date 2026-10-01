#!/usr/bin/env python3
"""QA for a Letter episode BEFORE the full render: one still at 85% of each beat + a labelled contact sheet.
Usage: qa_letter.py <slug> [bundle_dir]   (bundle first: npx remotion bundle src/index.ts --out-dir /tmp/ltb)"""
import json, subprocess, sys, pathlib
import fitz
MM = pathlib.Path("/Volumes/DarwinSSD/MMVideo"); NPX = "/opt/homebrew/bin/npx"

def main():
    slug = sys.argv[1]; bundle = sys.argv[2] if len(sys.argv) > 2 else "/tmp/ltb"
    comp = "LT-" + slug.replace("_", "-")
    D = json.load(open(MM / "public/letters" / slug / "data.json"))
    qa = MM / "out/letters" / slug / "qa"; qa.mkdir(parents=True, exist_ok=True)
    at = 0; shots = []
    for b in D["beats"]:
        fr = at + int(b["frames"] * 0.85); at += b["frames"]
        png = qa / f"{b['key']}.png"
        subprocess.run([NPX, "remotion", "still", bundle, comp, str(png), f"--frame={fr}", "--scale=0.25", "--log=error"], cwd=MM, check=True)
        shots.append((b["key"], b["scene"]["type"], png))
    cols = 6; w, h = 480, 270; rows = (len(shots) + cols - 1) // cols
    doc = fitz.open(); pg = doc.new_page(width=cols * w, height=rows * (h + 22))
    for i, (k, t, png) in enumerate(shots):
        x, y = (i % cols) * w, (i // cols) * (h + 22)
        pg.insert_image(fitz.Rect(x, y, x + w, y + h), filename=str(png))
        pg.insert_text((x + 6, y + h + 16), f"{k} · {t}", fontsize=13)
    pg.get_pixmap().save(MM / "out/letters" / slug / "qa_sheet.png")
    print("sheet:", MM / "out/letters" / slug / "qa_sheet.png", len(shots), "stills")

if __name__ == "__main__":
    main()

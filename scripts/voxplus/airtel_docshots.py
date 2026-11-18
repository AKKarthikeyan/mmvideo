#!/usr/bin/python3
# Real document crop with the phrase highlighted, for document shots in the Airtel film (never a fabricated page).
#   /usr/bin/python3 scripts/voxplus/airtel_docshots.py --list
#   /usr/bin/python3 scripts/voxplus/airtel_docshots.py PDF "phrase" [--out NAME] [--page N] [--nth K] [--before 80] [--after 60] [--scale 3]
# PDF is a file name (or unique part of it) in .../Airtel convergence moat/raw/. Writes public/voxplus/airtel/docs/NAME.png (+ NAME.json
# with w, h, page, rect of the highlight in PNG pixels). The crop is full page width, `before`/`after` points around the phrase line(s).
import argparse, json, pathlib, re, sys
import fitz
RAW = pathlib.Path("/Volumes/DarwinSSD/Moat and Margin/01 Videos/Airtel convergence moat/raw")
OUT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/voxplus/airtel/docs")
ap = argparse.ArgumentParser(); ap.add_argument("pdf", nargs="?"); ap.add_argument("phrase", nargs="?")
ap.add_argument("--list", action="store_true"); ap.add_argument("--out"); ap.add_argument("--page", type=int, help="1-based PDF page to search (default: first hit)")
ap.add_argument("--nth", type=int, default=1, help="use the Nth hit of the phrase (default 1)"); ap.add_argument("--before", type=float, default=80); ap.add_argument("--after", type=float, default=60)
ap.add_argument("--scale", type=float, default=3)
a = ap.parse_args()
if a.list or not (a.pdf and a.phrase):
    for p in sorted(RAW.glob("*.pdf")): print(p.name); 
    sys.exit(0)
c = [p for p in sorted(RAW.glob("*.pdf")) if a.pdf.lower() in p.name.lower()]
if len(c) != 1: raise SystemExit(f"PDF name '{a.pdf}' matched {[p.name for p in c]}; give a unique part of the name (see --list)")
doc = fitz.open(c[0]); hits = []
for pn in ([a.page - 1] if a.page else range(len(doc))):
    for r in doc[pn].search_for(a.phrase): hits.append((pn, r))
if len(hits) < a.nth: raise SystemExit(f"phrase not found (hits {len(hits)}): {a.phrase!r} in {c[0].name}")
pn, r = hits[a.nth - 1]; pg = doc[pn]
clip = fitz.Rect(pg.rect.x0, max(pg.rect.y0, r.y0 - a.before), pg.rect.x1, min(pg.rect.y1, r.y1 + a.after))
same = [h for p2, h in hits if p2 == pn and h.intersects(clip)]
for h in same: pg.add_highlight_annot(h)
pix = pg.get_pixmap(matrix=fitz.Matrix(a.scale, a.scale), clip=clip)
name = a.out or re.sub(r"[^a-z0-9]+", "_", f"{c[0].stem}_p{pn+1}_{a.phrase}".lower()).strip("_")[:90]
OUT.mkdir(parents=True, exist_ok=True); pix.save(OUT / f"{name}.png")
rects = [[round((h.x0 - clip.x0) * a.scale), round((h.y0 - clip.y0) * a.scale), round(h.width * a.scale), round(h.height * a.scale)] for h in same]
json.dump({"pdf": c[0].name, "pdf_page_index": pn, "printed_page_note": "PDF page " + str(pn + 1), "phrase": a.phrase, "w": pix.width, "h": pix.height, "rects": rects}, open(OUT / f"{name}.json", "w"), indent=1)
print(f"{OUT / (name + '.png')}  {pix.width}x{pix.height}  PDF p.{pn+1}  hits in crop {len(same)}")

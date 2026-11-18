# tatamotorsq2 document excerpts (23 Oct 2026; copy of tatamotorsq2_shot.py): like rhp_shot.py, but the crop snaps to whole text lines (no half lines).
#   python3 tatamotorsq2_shot.py PDF OUT.png "ANCHOR" LINES_BEFORE LINES_AFTER "PHRASE" ...   (page found by searching ANCHOR)
# Writes OUT.png (3x) + OUT.json {w, h, page (1-based), rects: {phrase: [[x,y,w,h],...]}} in image pixels.
import sys, json, fitz
pdf, out, anchor, nb, na = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]); phrases, S = sys.argv[6:], 3
doc = fitz.open(pdf)
pno = next(i for i in range(len(doc)) if doc[i].search_for(anchor)); pg = doc[pno]; a = pg.search_for(anchor)[0]
lines = []
for b in pg.get_text("dict")["blocks"]:
    for l in b.get("lines", []):
        r = fitz.Rect(l["bbox"])
        if r.height > 3 and "".join(s["text"] for s in l["spans"]).strip(): lines.append(r)
# merge lines on the same baseline
rows = []
for r in sorted(lines, key=lambda r: (round(r.y0), r.x0)):
    if rows and abs(rows[-1].y0 - r.y0) < 2: rows[-1] |= r
    else: rows.append(fitz.Rect(r))
i = min(range(len(rows)), key=lambda k: abs(rows[k].y0 - a.y0))
sel = rows[max(0, i - nb): i + na + 1]
j0, j1 = max(0, i - nb), min(len(rows) - 1, i + na)
top = sel[0].y0 - 8 if j0 == 0 else max(sel[0].y0 - 8, rows[j0 - 1].y1 + 1)   # never show a sliver of the line above/below
bot = sel[-1].y1 + 8 if j1 == len(rows) - 1 else min(sel[-1].y1 + 8, rows[j1 + 1].y0 - 1)
clip = fitz.Rect(min(r.x0 for r in sel) - 10, top, max(r.x1 for r in sel) + 10, bot) & pg.rect
import os
if os.environ.get("CLIPX1"): clip.x1 = min(clip.x1, float(os.environ["CLIPX1"]))   # tatamotorsq2: drop slide logos / timeline column
if os.environ.get("CLIPX0"): clip.x0 = max(clip.x0, float(os.environ["CLIPX0"]))
pix = pg.get_pixmap(matrix=fitz.Matrix(S, S), clip=clip); pix.save(out)
rects = {}
for p in phrases:
    rs = [r for r in pg.search_for(p) if r.intersects(clip)]
    if not rs: print("WARNING phrase not in crop:", p); continue
    rects[p] = [[round((r.x0 - clip.x0) * S, 1), round((r.y0 - clip.y0) * S, 1), round(r.width * S, 1), round(r.height * S, 1)] for r in rs]
json.dump({"w": pix.width, "h": pix.height, "page": pno + 1, "rects": rects}, open(out[:-4] + ".json", "w"), indent=1)
print(out.split("/")[-1], pix.width, pix.height, "p.%d" % (pno + 1), {k[:20]: len(v) for k, v in rects.items()})

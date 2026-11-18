# Real RHP excerpt for DocPage (20 Oct 2026): crop the text column around ANCHOR on a PDF page and record where each
# PHRASE sits, so DocPage can wipe a highlighter across it.
#   python3 rhp_shot.py PDF PAGE_INDEX OUT.png "ANCHOR" LINES_BEFORE LINES_AFTER "PHRASE" ["PHRASE" ...]
# PAGE_INDEX is 0-based, or -1 to search every page for ANCHOR (the Jio RHP's PDF page = printed page; pass printed page - 1 only if they differ: check by eye).
# Writes OUT.png (3x) and OUT.json {w, h, lineH, source, page, rects: {phrase: [[x, y, w, h], ...]}} in image pixels.
import sys, json, fitz
pdf, pno, out, anchor, nb, na = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4], int(sys.argv[5]), int(sys.argv[6])
phrases, S = sys.argv[7:], 3
doc = fitz.open(pdf)
if pno < 0:   # search every page for the anchor
    pno = next((i for i in range(len(doc)) if doc[i].search_for(anchor)), -1)
    if pno < 0: raise SystemExit("anchor not found in " + pdf)
pg = doc[pno]
hits = pg.search_for(anchor)
if not hits: raise SystemExit(f"anchor not found on page index {pno}: {anchor}")
a = hits[0]; lh = a.height * 1.18
blk = next((fitz.Rect(b[:4]) for b in pg.get_text("blocks") if fitz.Rect(b[:4]).intersects(a)), None)
x0, x1 = (blk.x0, blk.x1) if blk else (pg.rect.x0 + 50, pg.rect.x1 - 50)
clip = fitz.Rect(x0 - 6, a.y0 - nb * lh - 3, x1 + 6, a.y1 + na * lh + 3) & pg.rect
pix = pg.get_pixmap(matrix=fitz.Matrix(S, S), clip=clip); pix.save(out)
rects = {}
for p in phrases:
    rs = [r for r in pg.search_for(p) if r.intersects(clip)]
    if not rs: print("WARNING phrase not in crop:", p); continue
    rects[p] = [[round((r.x0 - clip.x0) * S, 1), round((r.y0 - clip.y0) * S, 1), round(r.width * S, 1), round(r.height * S, 1)] for r in rs]
json.dump({"w": pix.width, "h": pix.height, "lineH": round(lh * S, 1), "source": pdf, "page": pno, "rects": rects}, open(out.replace(".png", ".json"), "w"), indent=1)
print(out, pix.width, pix.height, {k: len(v) for k, v in rects.items()})

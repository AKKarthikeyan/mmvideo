# Screenshot a short excerpt of an official Berkshire letter page (the live URL, as Chromium renders it) and record
# where chosen phrases sit, so DocPage can wipe a highlighter across them.
#   letter_shot.py URL OUT.png ANCHOR LINES_BEFORE LINES_AFTER PHRASE [PHRASE ...]
# Writes OUT.png (the excerpt at 3x scale) and OUT.json: {w, h, lineH, source, rects: {phrase: [[x, y, w, h], ...]}}
# in image pixels (one rect per text line the phrase covers).
# Run from the vendor env: uv run -q -p 3.13 --with playwright python letter_shot.py ...  (detached: nohup ... &)
import sys, json
from playwright.sync_api import sync_playwright

EXE = "/Volumes/DarwinSSD/vendor/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell"
url, out, anchor, nb, na = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5])
phrases = sys.argv[6:]
SCALE = 3

JS = r"""([anchor, phrases]) => {
  const pres = [...document.querySelectorAll("pre")];
  const nodes = [];
  for (const pre of pres) {
    const w = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) nodes.push(n);
  }
  // collapsed text (runs of whitespace -> one space) with a map back to (node, offset)
  let flat = "", map = [], lastSpace = false;
  for (const nd of nodes) {
    for (let i = 0; i < nd.data.length; i++) {
      const c = nd.data[i], sp = c === " " || c === "\n" || c === "\t" || c === "\r";
      if (sp) { if (!lastSpace) { flat += " "; map.push([nd, i]); } lastSpace = true; }
      else { flat += c; map.push([nd, i]); lastSpace = false; }
    }
  }
  const norm = (s) => s.split(/\s+/).join(" ");
  const find = (s) => {
    const k = flat.indexOf(norm(s)); if (k < 0) return null;
    const a = map[k], b = map[k + norm(s).length - 1];
    const r = document.createRange(); r.setStart(a[0], a[1]); r.setEnd(b[0], b[1] + 1); return r;
  };
  const ar = find(anchor);
  if (!ar) return {error: "anchor not found"};
  const a = ar.getClientRects()[0];
  const rects = {};
  for (const p of phrases) { const r = find(p); rects[p] = r ? [...r.getClientRects()].map(q => [q.x, q.y + scrollY, q.width, q.height]) : []; }
  const pre = pres.find(p => p.contains(ar.startContainer));
  const pr = pre.getBoundingClientRect();
  // probe one character width
  const probe = document.createRange(); probe.setStart(ar.startContainer, ar.startOffset); probe.setEnd(ar.startContainer, ar.startOffset + 1);
  return {anchorY: a.y + scrollY, lh: a.height, preX: pr.x, chW: probe.getBoundingClientRect().width, rects};
}"""

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=EXE)
    pg = b.new_page(viewport={"width": 900, "height": 1000}, device_scale_factor=SCALE)
    pg.goto(url, wait_until="load", timeout=60000)
    # the page sets no font; use a typewriter face for the browser default monospace (presentation only, text untouched)
    pg.add_style_tag(content="pre { font-family: 'Courier New', Courier, monospace !important; font-weight: 600; }")
    info = pg.evaluate(JS, [anchor, phrases])
    if "error" in info:
        raise SystemExit(info["error"])
    lh = info["lh"]
    y0 = info["anchorY"] - nb * lh
    h = (nb + na + 1) * lh
    x0 = max(0, info["preX"] - info["chW"] * 2)
    w = info["chW"] * 70  # the letters wrap at about 65 characters
    pg.screenshot(path=out, clip={"x": x0, "y": y0, "width": w, "height": h}, full_page=True)
    rects = {k: [[(r[0] - x0) * SCALE, (r[1] - y0) * SCALE, r[2] * SCALE, r[3] * SCALE] for r in v] for k, v in info["rects"].items()}
    meta = {"w": round(w * SCALE), "h": round(h * SCALE), "lineH": lh * SCALE, "source": url, "rects": rects}
    json.dump(meta, open(out.rsplit(".", 1)[0] + ".json", "w"), indent=1)
    print(json.dumps(meta))
    b.close()

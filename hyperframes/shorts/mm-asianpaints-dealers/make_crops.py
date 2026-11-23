#!/usr/bin/env python3
"""Page crops for the Short mm-asianpaints-dealers (Director, key-frame board, 22 Nov 2026).

Renders each crop from the saved PDFs in productions/mm-asianpaints-dealers/research/sources/ with PyMuPDF and
DEFOCUSES every word that is not in a `keep` phrase (COMMON.md section 11: no unspoken figure legible, never a
DISPUTED figure). Writes PNGs and crops.json (pixel boxes of each highlight phrase, for the page to draw strokes on)
to out/productions/mm-asianpaints-dealers/crops/ (not in git: company pages stay on the SSD).

usage: /usr/bin/python3 hyperframes/shorts/mm-asianpaints-dealers/make_crops.py      (Mac Mini; needs PyMuPDF, Pillow)

Crop rules carried from TREATMENT.md section 7 (builder must not change):
  - Grasim p.31: Outlook box right column only (y >= 302 pt); the Key Performance Charts with the DISPUTED 42 % badge
    (C023, at y 171-191 pt) and the Dealers Meet photo are outside every crop.
  - Asian Paints BRSR p.164: FY 2025-26 column only (x <= 496 pt); row b (72,873 dealers) and the purchase rows are
    defocused.
  - Grasim p.30: body crop starts below the Birla Opus logo (y >= 219 pt); heading crop ends above it.
  - Asian Paints p.14: pull-quote column only; Chairman's portrait and control-room photo outside.
  - Asian Paints p.17: the two text lines only; the APEX advertisement below is outside.
"""
import json
import re
import sys
from pathlib import Path

import fitz
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[3]
SRC = ROOT / "productions" / "mm-asianpaints-dealers" / "research" / "sources"
OUT = ROOT / "out" / "productions" / "mm-asianpaints-dealers" / "crops"

AP, GR, HC = "ap_iar_fy26.pdf", "grasim_iar_fy26.pdf", "bombay_hc_ap_v_cci.pdf"
W = 2000  # target crop width in px

# name: (pdf, page, clip in pt, keep phrases, highlight phrases)
CROPS = {
    "ap17_a": (AP, 17, (806, 150, 968, 194), ["The overall", "network strength remains one of our"],
               ["The overall", "network strength remains one of our"]),
    "ap17_b": (AP, 17, (981, 124, 1150, 168), ["strongest competitive advantages."], ["strongest competitive advantages."]),
    "gr12": (GR, 12, (640, 110, 872, 190),
             ["The business continues to invest aggressively behind consumer awareness and channel engagement."],
             ["The business continues to invest", "aggressively behind consumer awareness and", "channel engagement."]),
    "ap164": (AP, 164, (140, 150, 496, 272),
              # AK 22 Nov: no figure is spoken here ("almost all", "under one rupee in a hundred"), so 99.0% and 0.9% are
              # defocused with every other number; only the row labels and the year stay sharp
              ["FY 2025-26", "Sales to dealer/distributors as % of total sales",
               "Sales to top 10 dealers/distributors as % of total sales to dealers/ distributors"],
              ["Sales to dealer/distributors as % of total sales",
               "Sales to top 10 dealers/distributors as % of total sales to dealers/ distributors"]),
    "gr30_head": (GR, 30, (895, 108, 1112, 148), ["Distribution: Painting a Pan-India Canvas"], []),
    # b5, AK 22 Nov: the dealer count is shown from C012's own passage (p.20-21), not p.57; p.57 keeps only C013's line
    "gr12_c012": (GR, 12, (312, 592, 545, 682), ["Birla Opus expanded its distribution network to over 50,000 dealers"],
                  ["over 50,000", "dealers"]),
    "gr30_body": (GR, 30, (895, 380, 1145, 424),
                  ["with dealers armed with new-age compact tinting machines"], ["compact tinting machines"]),
    "gr31_outlook": (GR, 31, (893, 302, 1146, 566),
                     ["The competitive dynamics that Birla Opus helped catalyse, and that reshape the strategies of paints "
                      "companies will be most beneficial for a challenger with brand strength, capacity, and distribution "
                      "depth to capitalise on growing demand."],
                     ["brand strength, capacity, and distribution", "depth"]),
    "ap14_quote": (AP, 14, (804, 388, 975, 578),
                   ["Our growth philosophy was anchored in a multi- dimensional approach to value creation: Deeply invest in "
                    "our brand equity, consistently enhance the innovation quotient, systematically enhance our counter share "
                    "across all geographies, and capitalise on India's sustained growth momentum and rising consumer aspirations."],
                   ["systematically", "enhance our counter share", "across all geographies,"]),
    "hc29_close": (HC, 29, (150, 176, 540, 240),
                   ["(iii) Directing its dealers to return/ not use or not install the tinting machines supplied by the Informant;"],
                   ["the tinting machines", "return/ not use or not install"]),
    "hc29_page": (HC, 29, (40, 40, 580, 745),
                  ["WP-2887-2025-J.doc", "29/40",
                   "(iii) Directing its dealers to return/ not use or not install the tinting machines supplied by the Informant;"],
                  ["the tinting machines", "return/ not use or not install"]),
    # b6 and the match cut: same clip as hc29_page, only the matched words sharp, so the allegation is not readable until
    # the ALLEGATION stamp lands in b7 (rack focus hc29_tint -> hc29_page)
    "hc29_tint": (HC, 29, (40, 40, 580, 745), ["WP-2887-2025-J.doc", "29/40", "the tinting machines"],
                  ["the tinting machines", "return/ not use or not install"]),
    "hc39": (HC, 39, (40, 40, 580, 320),
             ["WP-2887-2025-J.doc", "We may also note that the Apex Court in the case of", "merely a prima facie opinion"],
             ["merely a prima facie opinion"]),
}

NORM = str.maketrans({"‑": "-", "‐": "-", "–": "-", "’": "'", "‘": "'", "“": '"', "”": '"'})


def tok(s):
    return re.sub(r"[^\w%/.,:;()\-'\"]", "", s.translate(NORM).lower())


def find(words, phrase, skip=()):
    """Word indices of the first run of `phrase` in reading order (across line breaks)."""
    want = [tok(x) for x in phrase.split()]
    have = [tok(w[4]) for w in words]
    for i in range(len(have) - len(want) + 1):
        if have[i:i + len(want)] == want and i not in skip:
            return list(range(i, i + len(want)))
    raise SystemExit(f"phrase not found: {phrase!r}")


def boxes(words, idx):
    """Merge word boxes per line into one box each."""
    lines = {}
    for i in idx:
        w = words[i]
        k = (w[5], w[6])
        b = lines.get(k)
        lines[k] = [min(b[0], w[0]), min(b[1], w[1]), max(b[2], w[2]), max(b[3], w[3])] if b else list(w[:4])
    return sorted(lines.values(), key=lambda b: (b[1], b[0]))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    meta = {}
    docs = {}
    for name, (pdf, pno, clip, keep, hl) in CROPS.items():
        doc = docs.setdefault(pdf, fitz.open(SRC / pdf))
        page = doc[pno - 1]
        clip = fitz.Rect(clip)
        z = W / clip.width
        words = [w for w in page.get_text("words") if fitz.Rect(w[:4]).intersects(clip)]
        words.sort(key=lambda w: (w[5], w[6], w[7]))
        pix = page.get_pixmap(matrix=fitz.Matrix(z, z), clip=clip, alpha=False)
        img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        # defocus: a blur about one line high, then pulled 30 % toward the page colour, so no blurred word or figure
        # can be read even on a large screen (checked by eye on every crop, 22 Nov)
        blur = img.filter(ImageFilter.GaussianBlur(radius=max(12, int(z * 5.2))))
        paper = Image.new("RGB", img.size, tuple(int(v) for v in np.median(np.asarray(img).reshape(-1, 3), axis=0)))
        blur = Image.blend(blur, paper, 0.3)
        mask = Image.new("L", img.size, 0)
        mk = np.zeros((img.height, img.width), dtype=np.uint8)
        pad = 0.6 * z
        for ph in keep:
            for b in boxes(words, find(words, ph)):
                x0, y0 = int((b[0] - clip.x0) * z - pad), int((b[1] - clip.y0) * z - pad)
                x1, y1 = int((b[2] - clip.x0) * z + pad), int((b[3] - clip.y0) * z + pad)
                mk[max(0, y0):max(0, y1), max(0, x0):max(0, x1)] = 255
        mask = Image.fromarray(mk).filter(ImageFilter.GaussianBlur(radius=z * 0.5))
        out = Image.composite(img, blur, mask)
        out.save(OUT / f"{name}.png", optimize=True)
        hls = {}
        for ph in hl:
            hls[ph] = [[round((b[0] - clip.x0) * z), round((b[1] - clip.y0) * z),
                        round((b[2] - clip.x0) * z), round((b[3] - clip.y0) * z)] for b in boxes(words, find(words, ph))]
        meta[name] = dict(pdf=pdf, page=pno, clip=list(clip), w=out.width, h=out.height, hl=hls)
        print(f"{name:13s} {out.width}x{out.height}  z={z:.2f}  hl={len(hls)}")
    (OUT / "crops.json").write_text(json.dumps(meta, indent=1))
    js = OUT / "crops.js"
    js.write_text("window.CROPS = " + json.dumps(meta) + ";\n")
    print("->", OUT)


if __name__ == "__main__":
    sys.exit(main())

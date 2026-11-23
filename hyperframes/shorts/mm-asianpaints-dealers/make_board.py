#!/usr/bin/env python3
"""Key-frame board for mm-asianpaints-dealers (director, 22 Nov 2026): copies the HyperFrames snapshots into
out/productions/<id>/keyframes/ (one PNG per beat + frame 0 + the match cut) and style/ (three style frames), then
draws board.png (two columns, line + claim IDs under each still) and board.pdf (one page per still, for a phone).

usage (Mac Mini, after `hf.py snap mm-asianpaints-dealers <times>`):
  /usr/bin/python3 hyperframes/shorts/mm-asianpaints-dealers/make_board.py
"""
import json
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SNAP = ROOT / "out" / "hyperframes" / "snap" / "mm-asianpaints-dealers"
OUT = ROOT / "out" / "productions" / "mm-asianpaints-dealers"
SCRIPT = json.loads((ROOT / "productions" / "mm-asianpaints-dealers" / "script.json").read_text())
SAY = {b["key"]: b for b in SCRIPT["beats"]}

# (file name, snapshot time, beat key, heading, what is on screen / note)
FRAMES = [
    ("f0_hook", "0.04s", "b1", "FRAME 0 · hook and Shorts cover · 0.0 s",
     "Asian Paints' own sentence, highlighter mid-stroke; STILL A MOAT? (hook overlay, gone by 1.9 s)"),
    ("b1", "3s", "b1", "b1 · 0.0-3.7 s", "The sentence fully highlighted across the two columns of MD & CEO's message (pp. 30-31)"),
    ("b2", "6.4s", "b2", "b2 · 3.7-7.4 s", "Grasim's line lands as a torn clipping on Asian Paints' claim · GRASIM SAYS"),
    ("b3", "12.6s", "b3", "b3 · 7.4-14.0 s", "BRSR table: row labels lit, every figure in the FY 2025-26 column defocused (none is spoken); "
     "callout 'under one rupee in a hundred' kept (AK fix 1)"),
    ("b4", "16.4s", "b4", "b4 · 14.0-17.3 s", "Dot field, dark dots = top 10 dealers' share, no figures on screen · OUR READING · ILLUSTRATIVE · silence 1 (0.7 s)"),
    ("b5", "21.6s", "b5", "b5 · 17.3-22.3 s", "Top: Grasim pp. 20-21, C012's own line 'over 50,000 dealers'; below: p. 57 'compact tinting machines' (C013) · GRASIM SAYS (AK fix 2)"),
    ("sig_matchcut", "22.45s", "b6", "SIGNATURE · match cut b5 -> b6 · 22.4 s",
     "Mid-wipe: Grasim's 'tinting machines' becomes the court's 'the tinting machines' under one yellow stroke"),
    ("b6", "25.2s", "b6", "b6 · 22.3-26.2 s", "Pull back: whose page is it? Court header and 29/40; only the matched words sharp · silence 2 (1.0 s)"),
    ("b7", "30s", "b7", "b7 · 26.2-31.0 s · REVEAL", "Rack focus to para 30(iii); red underline; ALLEGATION stamp on 'alleged'; Informant = Grasim"),
    ("b8", "35s", "b8", "b8 · 31.0-36.0 s · guard rail", "p.39: 'merely a prima facie opinion' (court quoting the Supreme Court); CCI named; stamp stays"),
    ("b9", "39.8s", "b9", "b9 · 36.0-40.7 s", "Grasim's Outlook, right column only (the 42% chart is outside the crop) · GRASIM SAYS"),
    ("b10", "43.4s", "b10", "b10 · 40.7-44.2 s · loop", "Asian Paints' own 'counter share' line · OUR READING; whip back to frame 0"),
]
STYLE = {"f0_hook": "style_1_frame0_hook.png", "sig_matchcut": "style_2_matchcut.png", "b7": "style_3_court_reveal.png"}

F = "/System/Library/Fonts/Supplemental/"
def font(bold, size):
    return ImageFont.truetype(F + ("Arial Bold.ttf" if bold else "Arial.ttf"), size)


def wrap(d, text, f, width):
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= width:
            cur = t
        else:
            lines.append(cur); cur = w
    return lines + [cur] if cur else lines


def text_block(d, x, y, width, items):
    for txt, f, col, gap in items:
        for ln in wrap(d, txt, f, width):
            d.text((x, y), ln, font=f, fill=col); y += int(f.size * 1.25)
        y += gap
    return y


def info(key):
    b = SAY[key]
    return b["say"], "Claims: " + " ".join(b["claims"])


def main():
    (OUT / "keyframes").mkdir(parents=True, exist_ok=True)
    (OUT / "style").mkdir(parents=True, exist_ok=True)
    stills = []
    for i, (name, ts, key, head, note) in enumerate(FRAMES):
        src = SNAP / f"frame-{i:02d}-at-{ts}.png"
        dst = OUT / "keyframes" / f"{i:02d}_{name}.png"
        shutil.copy(src, dst)
        if name in STYLE:
            shutil.copy(src, OUT / "style" / STYLE[name])
        stills.append((dst, key, head, note))

    INK, MUTED, ACC, BG = (22, 18, 12), (90, 82, 70), (246, 214, 74), (244, 239, 228)
    hdr = ["KEY-FRAME BOARD v2 (AK approved with fixes, 22 Nov) · mm-asianpaints-dealers · Moat & Margin Short (The Catch)",
           "Director, 22 Nov 2026 · for AK's review · estimated timings, NO voice, NO music · ~44 s",
           "Accent: highlighter yellow (PROPOSED, AK to confirm) · red only for the court · real pages, unspoken figures defocused"]
    # ---- board.png: two columns
    TW, TH, PAD, TXT, COLS = 500, 889, 40, 300, 2
    rows = -(-len(stills) // COLS)
    W = COLS * TW + (COLS + 1) * PAD
    HH = 270
    H = HH + rows * (TH + TXT + PAD)
    board = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(board)
    d.rectangle([0, 0, W, HH - 30], fill=INK)
    text_block(d, PAD, 26, W - 2 * PAD, [(hdr[0], font(True, 30), ACC, 10), (hdr[1], font(False, 24), (240, 235, 225), 4), (hdr[2], font(False, 24), (240, 235, 225), 0)])
    for i, (p, key, head, note) in enumerate(stills):
        r, c = divmod(i, COLS)
        x, y = PAD + c * (TW + PAD), HH + r * (TH + TXT + PAD)
        im = Image.open(p).convert("RGB").resize((TW, TH), Image.LANCZOS)
        board.paste(im, (x, y))
        say, claims = info(key)
        text_block(d, x, y + TH + 12, TW, [(head, font(True, 24), INK, 4), ("“" + say + "”", font(False, 23), INK, 4),
                                          (claims, font(True, 21), (150, 30, 20) if key in ("b7", "b8") else MUTED, 2),
                                          (note, font(False, 19), MUTED, 0)])
    board.save(OUT / "keyframes" / "board.png", optimize=True)

    # ---- board.pdf: one page per still, phone-sized type
    pages = []
    cover = Image.new("RGB", (1080, 1920), BG)
    d = ImageDraw.Draw(cover)
    y = text_block(d, 70, 120, 940, [(hdr[0], font(True, 46), INK, 20), (hdr[1], font(False, 34), MUTED, 10), (hdr[2], font(False, 34), MUTED, 40),
                                     ("How to read: one still per beat (b1-b10), plus frame 0 and the signature match cut. Under each: the narration line, its claim IDs, and what is on screen.", font(False, 34), INK, 40),
                                     ("Three questions for AK", font(True, 44), INK, 16),
                                     ("1. Bored? b3 (table) and b4 (dots) spend about 10 s on Asian Paints' own numbers before the rival arrives. Do they hold you, or should b3 be trimmed?", font(False, 34), INK, 14),
                                     ("2. Confused? On b8, is it clear that 'merely a prima facie opinion' describes the regulator's probe order (the court quoting the Supreme Court), not Grasim's allegation?", font(False, 34), INK, 14),
                                     ("3. Does the reveal land? Does the match cut (Grasim's 'compact tinting machines' -> the court's 'the tinting machines') make you lean in before the ALLEGATION stamp at b7, or does b6's blurred court page feel like a stall?", font(False, 34), INK, 14)])
    pages.append(cover)
    for p, key, head, note in stills:
        say, claims = info(key)
        pg = Image.new("RGB", (1080, 2420), BG)
        pg.paste(Image.open(p).convert("RGB"), (0, 0))
        d = ImageDraw.Draw(pg)
        text_block(d, 50, 1945, 980, [(head, font(True, 40), INK, 8), ("“" + say + "”", font(False, 38), INK, 8),
                                       (claims, font(True, 34), MUTED, 6), (note, font(False, 30), MUTED, 0)])
        pages.append(pg)
    pages[0].save(OUT / "keyframes" / "board.pdf", save_all=True, append_images=pages[1:], resolution=150)
    print("board:", OUT / "keyframes" / "board.png", board.size, "+ board.pdf,", len(pages), "pages")


if __name__ == "__main__":
    main()

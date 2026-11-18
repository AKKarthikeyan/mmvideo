#!/usr/bin/env python3
"""Hero-image thumbnails (AK 5 Oct 2026: "increase click-through rate").

One generated, TEXT-FREE hero image (MiniMax image-01) + one huge real number + a one/two-word hook + a small chip with the
second fact + a strip of the real filing with the number highlighted (proof). All text is drawn here, never by the model.
Rules from the YouTube Guide: <= 3 words of hook, never the paired title's words, number must be shown and cited in the video,
high contrast, not red/white, readable at 160 px. Standalone (PIL): does not touch the Remotion engine files.

    python3 scripts/thumb_hero.py <video id> [--gen]      # --gen makes missing hero images with MiniMax (needs MINIMAX_API_KEY)
Output: out/vx/<out-name>-thumbH-1..3.png and a 160 px check sheet out/vx/<out-name>-thumbH-sheet160.png
Needs Pillow (pip3 install --user pillow).
"""
import base64, json, os, sys, time
from pathlib import Path
import requests
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1280, 720
IMPACT = "/System/Library/Fonts/Supplemental/Impact.ttf"
YELLOW, WHITE, BLACK = (255, 214, 0), (255, 255, 255), (0, 0, 0)
NOTEXT = (" Dark moody background with a large empty dark area on the left third of the frame. Absolutely no text, no letters, "
          "no numbers, no logos, no signs, no recognizable real people.")

VIDEOS = {
    "banksq2": {
        "out": "bank-q2-results",
        "thumbs": [   # pairs with titles A, B, C of the upload package; numbers are on screen and cited in the video (b32, b41, b22)
            {"img": "gap", "chip": "UNION BANK", "big": "6.87%", "line": "DEPOSIT GROWTH", "fact": "LOANS +18.53%", "clip": "bk_union",
             "prompt": "Cinematic photograph on a dark tabletop: on the right a colossal skyscraper-tall stack of gold coins disappearing out of the top of the frame, "
                       "and next to it a tiny stack of just three coins, dramatic warm side lighting, wide gap between them, shallow depth of field, high contrast."},
            {"img": "slip", "chip": "J&K BANK", "big": "-388 BPS", "line": "CHEAP DEPOSITS", "fact": "IN ONE YEAR", "clip": "bk_jk",
             "prompt": "Cinematic photograph of a large glass hourglass filled with gold coins instead of sand, coins trickling through the neck, the upper bulb almost empty, "
                       "hourglass on the right side of the frame, dramatic warm backlight, high contrast."},
            {"img": "fast", "chip": "UJJIVAN SFB", "big": "+32.1%", "line": "TOO FAST?", "fact": "#1 ON LOAN GROWTH", "clip": "bk_ujjivan",
             "prompt": "Cinematic photograph of a very tall precarious tower of stacked gold coins leaning dangerously and about to collapse, a few coins falling through the air, "
                       "tower on the right side of the frame, dramatic warm lighting, motion, high contrast."},
        ],
    },
}


def font(size):
    return ImageFont.truetype(IMPACT, size)


def gen(prompt, out):
    key = os.environ["MINIMAX_API_KEY"]
    body = {"model": "image-01", "prompt": prompt + NOTEXT, "width": W, "height": H, "response_format": "base64", "n": 1, "prompt_optimizer": False}
    for attempt in range(6):
        j = requests.post("https://api.minimax.io/v1/image_generation", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=240).json()
        im = (j.get("data") or {}).get("image_base64") or []
        if im:
            out.write_bytes(base64.b64decode(im[0])); return
        print("  retry", out.name, j.get("base_resp")); time.sleep(15 * (attempt + 1))     # wait on 429s
    raise SystemExit("image failed: " + out.name)


def fit(text, size, maxw):
    while font(size).getlength(text) > maxw and size > 60:
        size -= 6
    return size


def proof_strip(vid, D, clip, width=520):
    """The filing line with the number highlighted: crop to the highlight's neighbourhood, tilt, shadow, tape."""
    c = D["clips"][clip]; im = Image.open(ROOT / "public" / "vx" / vid / "clips" / f"{clip}.png").convert("RGB")
    hx, hy, hw, hh = c["hl"][0]
    x0 = max(0, int((hx - 0.36) * im.width)); x1 = min(im.width, int((hx + hw + 0.04) * im.width))
    strip = im.crop((x0, 0, x1, im.height))
    d = ImageDraw.Draw(strip, "RGBA")
    d.rectangle(((hx * im.width - x0), hy * im.height, (hx + hw) * im.width - x0, (hy + hh) * im.height), fill=(240, 190, 60, 140))
    s = width / strip.width; strip = strip.resize((width, max(24, int(strip.height * s))), Image.LANCZOS)
    pad = 12; card = Image.new("RGB", (strip.width + 2 * pad, strip.height + 2 * pad), WHITE); card.paste(strip, (pad, pad))
    card = card.convert("RGBA")
    tape = Image.new("RGBA", (110, 34), (232, 220, 190, 235)); card.alpha_composite(tape, (card.width // 2 - 55, -8)) if False else None
    canvas = Image.new("RGBA", (card.width + 80, card.height + 90), (0, 0, 0, 0))
    canvas.alpha_composite(card, (40, 45))
    canvas.alpha_composite(tape, (canvas.width // 2 - 55, 28))
    sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle((46, 56, canvas.width - 34, canvas.height - 34), fill=(0, 0, 0, 170))
    sh = sh.filter(ImageFilter.GaussianBlur(14)); sh.alpha_composite(canvas)
    return sh.rotate(3, expand=True, resample=Image.BICUBIC)


def compose(vid, D, t, out_path):
    hero = Image.open(ROOT / "public" / "vx" / vid / "thumbimg" / f"{t['img']}.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
    im = hero.convert("RGBA")
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)       # left-to-right darkening so the number always reads
    for x in range(0, 860):
        gd.line((x, 0, x, H), fill=(0, 0, 0, int(205 * (1 - x / 860) ** 1.4)))
    im.alpha_composite(g)
    d = ImageDraw.Draw(im)
    bs = fit(t["big"], 340, 760)
    d.text((44, 118 + (340 - bs) // 2), t["big"], font=font(bs), fill=YELLOW, stroke_width=12, stroke_fill=BLACK)
    ls = fit(t["line"], 100, 760)
    d.text((50, 470), t["line"], font=font(ls), fill=WHITE, stroke_width=8, stroke_fill=BLACK)
    # chips: bank name (black, top-left); second fact (yellow on black, bottom-left)
    cf = font(52); cw = int(cf.getlength(t["chip"])) + 44
    d.rectangle((40, 36, 40 + cw, 108), fill=BLACK); d.text((62, 40), t["chip"], font=cf, fill=WHITE)
    ff = font(60); fw = int(ff.getlength(t["fact"])) + 44
    d.rectangle((44, 606, 44 + fw, 686), fill=YELLOW); d.text((66, 606), t["fact"], font=ff, fill=BLACK)
    strip = proof_strip(vid, D, t["clip"])
    im.alpha_composite(strip, (W - strip.width - 6, H - strip.height - 14))
    out = im.convert("RGB"); out.save(out_path)
    if out_path.stat().st_size > 1_900_000:      # YouTube limit is 2 MB
        out.save(out_path.with_suffix(".jpg"), quality=92); out_path.unlink()
    return out


def main():
    vid = sys.argv[1]; cfg = VIDEOS[vid]
    D = json.load(open(ROOT / "public" / "vx" / vid / "data.json"))
    imgdir = ROOT / "public" / "vx" / vid / "thumbimg"; imgdir.mkdir(exist_ok=True)
    outs = []
    for i, t in enumerate(cfg["thumbs"], 1):
        p = imgdir / f"{t['img']}.jpg"
        if not p.exists():
            if "--gen" not in sys.argv:
                raise SystemExit(f"missing hero image {p}; run with --gen or copy one in")
            gen(t["prompt"], p); print(" image", p.name)
        op = ROOT / "out" / "vx" / f"{cfg['out']}-thumbH-{i}.png"
        outs.append(compose(vid, D, t, op)); print(" thumb", op.name)
    sheet = Image.new("RGB", (160 * len(outs) + 10 * (len(outs) + 1), 90 + 20), (255, 255, 255))      # the feed-size check
    for i, im in enumerate(outs):
        sheet.paste(im.resize((160, 90), Image.LANCZOS), (10 + i * 170, 10))
    sheet.save(ROOT / "out" / "vx" / f"{cfg['out']}-thumbH-sheet160.png")


if __name__ == "__main__":
    main()

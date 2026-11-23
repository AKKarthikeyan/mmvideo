src = open("/tmp/collage.py").read().split("# ---------- Frame A")[0]
exec(src)
C = "/Volumes/DarwinSSD/MMVideo/hyperframes/media_src/characters/cut/"
LABEL = ImageFont.truetype("/System/Library/Fonts/Supplemental/Futura.ttc", 26)

def certificate():
    c = Image.new("RGBA", (420, 280), (0, 0, 0, 0)); d = ImageDraw.Draw(c)
    d.rectangle((0, 0, 419, 279), fill=(250, 244, 222), outline=(176, 130, 30), width=8)
    d.rectangle((18, 18, 401, 261), outline=(176, 130, 30), width=2)
    f1 = ImageFont.truetype(NM + "dm-serif-display/files/dm-serif-display-latin-400-normal.woff", 40)
    d.text((210, 80), "GOLD BOND", font=f1, fill=(60, 50, 30), anchor="mm")
    d.text((210, 140), "10 GRAMS", font=MARK_S, fill=(176, 130, 30), anchor="mm")
    d.text((210, 205), "a promise, not gold", font=LABEL, fill=(120, 100, 70), anchor="mm")
    return c.rotate(6, expand=True, resample=Image.BICUBIC)

def bangle():
    b = Image.new("RGBA", (240, 240), (0, 0, 0, 0)); d = ImageDraw.Draw(b)
    for i, col in enumerate([(150, 105, 20), (205, 160, 50), (240, 200, 90)]):
        d.ellipse((20 + i * 4, 20 + i * 4, 220 - i * 4, 220 - i * 4), outline=col, width=30 - i * 9)
    return b

def frame(kind, label):
    F = paper().convert("RGBA"); d = ImageDraw.Draw(F)
    d.text((90, 60), "TWO NEIGHBOURS", font=SERIF, fill=(30, 30, 35))
    d.text((96, 175), "same street, two bets on gold", font=MARK, fill=(176, 130, 30))
    a = Image.open(C + f"amma_{kind}.png").convert("RGBA"); a.thumbnail((640, 760))
    r = Image.open(C + f"ravi_{kind}.png").convert("RGBA"); r.thumbnail((640, 760))
    F.alpha_composite(sticker(a), (150, H - a.height - 40))
    F.alpha_composite(sticker(r), (W - r.width - 110, H - r.height - 40))
    F.alpha_composite(bangle(), (720, 540))
    F.alpha_composite(certificate(), (950, 420))
    d = ImageDraw.Draw(F)
    d.text((720, 800), "AMMA keeps\nthe real thing", font=MARK_S, fill=(200, 40, 40))
    d.text((1000, 760), "RAVI buys\npaper gold", font=MARK_S, fill=(200, 40, 40))
    d.text((W - 70, 70), "ILLUSTRATION", font=LABEL, fill=(90, 85, 75), anchor="ra")
    d.rectangle((40, 1000, 520, 1050), fill=(30, 30, 35)); d.text((60, 1010), label, font=LABEL, fill=(245, 240, 230))
    F.convert("RGB").save(f"/tmp/chars_{kind}.jpg", quality=90)

for k, l in [("illus", "OPTION 1 · ILLUSTRATED (AI)"), ("photo", "OPTION 2 · AI PHOTO"), ("stock", "OPTION 3 · STOCK PHOTO")]:
    frame(k, l)
print("ok")

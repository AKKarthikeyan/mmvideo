import sys, random, glob
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageFont, ImageEnhance, ImageChops
G = "/Volumes/DarwinSSD/MMVideo/hyperframes/media_src/govt/"
NM = "/Volumes/DarwinSSD/MMVideo/node_modules/@fontsource/"
MARK = ImageFont.truetype(NM + "permanent-marker/files/permanent-marker-latin-400-normal.woff", 64)
MARK_S = ImageFont.truetype(NM + "permanent-marker/files/permanent-marker-latin-400-normal.woff", 40)
SERIF = ImageFont.truetype(NM + "dm-serif-display/files/dm-serif-display-latin-400-normal.woff", 96)
SMALL = ImageFont.truetype("/System/Library/Fonts/Supplemental/Futura.ttc", 22)
W, H = 1920, 1080
random.seed(7)

def paper():
    base = Image.new("RGB", (W, H), (236, 229, 214))
    n = Image.effect_noise((W // 2, H // 2), 22).resize((W, H)).convert("RGB")
    base = Image.blend(base, ImageChops.multiply(base, ImageOps.colorize(n.convert("L"), (200, 190, 170), (255, 255, 255))), 0.5)
    return base

def halftone_bw(im, tint=None):
    a = im.split()[-1]
    g = ImageOps.grayscale(im.convert("RGB"))
    g = ImageEnhance.Contrast(g).enhance(1.35)
    rgb = ImageOps.colorize(g, (25, 25, 30), tint or (245, 240, 230))
    rgb.putalpha(a); return rgb

def sticker(im, border=14):
    a = im.split()[-1]
    big = a.filter(ImageFilter.MaxFilter(border * 2 + 1))
    out = Image.new("RGBA", im.size, (255, 255, 255, 0))
    white = Image.new("RGBA", im.size, (255, 255, 255, 255)); out.paste(white, (0, 0), big)
    out.alpha_composite(im)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sh.paste(Image.new("RGBA", im.size, (0, 0, 0, 90)), (0, 0), big.filter(ImageFilter.GaussianBlur(10)))
    canvas = Image.new("RGBA", (im.width + 30, im.height + 30), (0, 0, 0, 0))
    canvas.alpha_composite(sh, (18, 22)); canvas.alpha_composite(out, (0, 0)); return canvas

def torn_photo(path, width, angle, crop=None):
    im = Image.open(path).convert("RGB")
    if crop: im = im.crop(crop)
    im = im.resize((width, int(im.height * width / im.width)))
    im = ImageEnhance.Color(im).enhance(0.55)
    w, h = im.size; pad = 18
    m = Image.new("L", (w + pad * 2, h + pad * 2), 0); d = ImageDraw.Draw(m)
    pts = []
    for x in range(0, w + pad * 2, 14): pts.append((x, random.randint(0, 9)))
    for y in range(0, h + pad * 2, 14): pts.append((w + pad * 2 - random.randint(0, 9), y))
    for x in range(w + pad * 2, 0, -14): pts.append((x, h + pad * 2 - random.randint(0, 9)))
    for y in range(h + pad * 2, 0, -14): pts.append((random.randint(0, 9), y))
    d.polygon(pts, fill=255)
    card = Image.new("RGBA", m.size, (250, 247, 240, 0)); card.paste(Image.new("RGBA", m.size, (250, 247, 240, 255)), (0, 0), m)
    card.paste(im, (pad, pad))
    card.putalpha(ImageChops.multiply(card.split()[-1], m))
    sh = Image.new("RGBA", card.size, (0, 0, 0, 0)); sh.paste(Image.new("RGBA", card.size, (0, 0, 0, 80)), (0, 0), m.filter(ImageFilter.GaussianBlur(12)))
    c2 = Image.new("RGBA", (card.width + 30, card.height + 30), (0, 0, 0, 0)); c2.alpha_composite(sh, (14, 18)); c2.alpha_composite(card)
    return c2.rotate(angle, expand=True, resample=Image.BICUBIC)

def tape(img, x, y, ang):
    t = Image.new("RGBA", (170, 48), (240, 225, 160, 170)).rotate(ang, expand=True)
    img.alpha_composite(t, (x, y))

def marker_circle(d, box, col=(200, 40, 40), w=8):
    x0, y0, x1, y1 = box
    for i in range(2): d.ellipse((x0 - i * 6, y0 + i * 4, x1 + i * 5, y1 - i * 3), outline=col, width=w)

def source(d, txt):
    w = d.textlength(txt, font=SMALL); d.rectangle((W - w - 80, H - 60, W - 40, H - 22), fill=(236, 229, 214)); d.text((W - w - 60, H - 54), txt, font=SMALL, fill=(90, 85, 75))

# ---------- Frame A: 5 Nov 2015, the government makes a bet ----------
A = paper().convert("RGBA")
ph = torn_photo(G + "72061542_Narendra_Modi_launches_the_Gold_schemes.jpg", 880, -4)
A.alpha_composite(ph, (900, 150)); tape(A, 1220, 128, -6)
modi = Image.open(G + "cut/modi_portrait.png").convert("RGBA"); modi.thumbnail((760, 760))
A.alpha_composite(sticker(halftone_bw(modi)), (80, 330))
d = ImageDraw.Draw(A)
d.text((90, 70), "5 NOV 2015", font=SERIF, fill=(30, 30, 35))
d.text((96, 190), "the government makes a bet", font=MARK, fill=(176, 130, 30))
# gold envelope highlight on the photo (the bond certificate being handed over)
marker_circle(d, (1150, 470, 1420, 630))
d.text((1000, 860), "the first gold bonds, handed out", font=MARK_S, fill=(200, 40, 40))
source(d, "Photos: Prime Minister's Office / Government of India, 5 Nov 2015 and official portrait (GODL-India, via Wikimedia Commons)")
A.convert("RGB").save("/tmp/collage_A.jpg", quality=90)

# ---------- Frame B: who pays, the budget ----------
B = paper().convert("RGBA")
ph = torn_photo(G + "132627922_Smt_Nirmala_Sitharaman_presents_the_Unio.jpg", 560, 3, crop=(1080, 0, 2200, 1648))
B.alpha_composite(ph, (1230, 90)); tape(B, 1420, 70, 5)
fm = Image.open(G + "cut/fm_portrait.png").convert("RGBA"); fm = fm.resize((int(fm.width * 1.05), int(fm.height * 1.05)))
B.alpha_composite(sticker(halftone_bw(fm)), (120, 300))
d = ImageDraw.Draw(B)
d.text((90, 70), "WHO PAYS?", font=SERIF, fill=(30, 30, 35))
d.text((96, 190), "the budget, so every taxpayer", font=MARK, fill=(176, 130, 30))
# stack of notes drawn in code
for i in range(9):
    x, y = 880 + random.randint(-6, 6), 860 - i * 26
    d.rounded_rectangle((x, y, x + 260, y + 34), 6, fill=(120 + i * 3, 150, 110), outline=(70, 90, 60), width=3)
d.text((720, 960), "≈ ₹690 per Indian", font=MARK_S, fill=(200, 40, 40)) if False else d.text((830, 900), "about Rs 690\nfor every Indian", font=MARK_S, fill=(200, 40, 40))
source(d, "Photos: Ministry of Finance / Government of India, Union Budget 2023-24 (cropped) and Feb 2023 (GODL-India, via Wikimedia Commons)")
B.convert("RGB").save("/tmp/collage_B.jpg", quality=90)
print("ok")

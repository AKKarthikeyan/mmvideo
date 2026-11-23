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


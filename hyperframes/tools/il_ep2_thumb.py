"""India Ledger Episode 2 thumbnails, two options for AK (script doc, "Thumbnail (options for AK)").
A: the gold bars photo with a red "Rs 0 A YEAR" stamp, marker "WHY IT'S FALLING".
B: Rs 16,215 -> Rs 12,389 / GRAM in red, the RBI and Federal Reserve photos taped behind with "=".
Prices come from the episode's IBJA series (24 Aug and the last day), so they cannot drift from the video.
-> out/india_ledger/il-gold-ep2-thumb-A.jpg, -B.jpg (1280x720)"""
import json, random
from PIL import Image, ImageDraw, ImageFont

random.seed(11)
TOOLS = "/Volumes/DarwinSSD/MMVideo/hyperframes/tools/"
src = open(TOOLS + "il_collage_test.py").read().split("\nA = paper()")[0]
exec(src)                       # paper(), torn_photo(), tape(), marker_circle(), fonts
NM = "/Volumes/DarwinSSD/MMVideo/node_modules/@fontsource/"
OSW = lambda s: ImageFont.truetype(NM + "oswald/files/oswald-latin-700-normal.woff", s)
OSWX = lambda s: ImageFont.truetype(NM + "oswald/files/oswald-latin-ext-700-normal.woff", s)
MK = lambda s: ImageFont.truetype(NM + "permanent-marker/files/permanent-marker-latin-400-normal.woff", s)
IMG = "/Volumes/DarwinSSD/MMVideo/hyperframes/videos/il-gold-ep2/assets/img/"
OUT = "/Volumes/DarwinSSD/MMVideo/out/india_ledger/il-gold-ep2-thumb-{}.jpg"
RED, INK = (173, 53, 23), (23, 24, 27)
W, H = 1280, 720

s = json.load(open("/Volumes/DarwinSSD/MMVideo/hyperframes/videos/il-gold-ep2/assets/data/ibja_series.json"))
AUG = round(s["g999"][s["d"].index("2026-08-24")] / 10)
NOW = round(s["g999"][-1] / 10)
inr = lambda v: f"{v:,}"


def rupee(d, x, y, num, size, col):
    """the ₹ sign comes from the latin-ext face, the digits from latin"""
    rs, rn = OSWX(size), OSW(size)
    d.text((x, y), "₹", font=rs, fill=col)
    x2 = x + d.textlength("₹", font=rs) + 4
    d.text((x2, y), num, font=rn, fill=col)
    return x2 + d.textlength(num, font=rn)


def stamp(text, size, ang):
    f = OSWX(size)
    tw = ImageDraw.Draw(Image.new("RGBA", (1, 1))).textlength(text, font=f)
    w, h = int(tw + 60), int(size * 1.35)
    st = Image.new("RGBA", (w, h), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    sd.rectangle((6, 6, w - 6, h - 6), outline=RED, width=10)
    sd.text((30, 2), text, font=f, fill=RED)
    return st.rotate(ang, expand=True, resample=Image.BICUBIC)


# ---- A: Gold pays ₹0 ----
bg = paper().convert("RGBA").resize((W, H))
card = torn_photo(IMG + "bars.jpg", 640, -3)
bg.alpha_composite(card, (24, 70)); tape(bg, 250, 62, 4)
st = stamp("₹0 A YEAR", 110, 8)
bg.alpha_composite(st, (110, 300))
d = ImageDraw.Draw(bg)
d.text((735, 120), "GOLD", font=OSW(150), fill=INK)
d.text((735, 300), "WHY IT'S", font=MK(92), fill=INK)
d.text((735, 420), "FALLING", font=MK(108), fill=RED)
bg.convert("RGB").save(OUT.format("A"), quality=92)
print(OUT.format("A"))

# ---- B: the price row with America's RBI ----
bg = paper().convert("RGBA").resize((W, H))
c1 = torn_photo(IMG + "rbi.jpg", 470, -4); bg.alpha_composite(c1, (30, 40)); tape(bg, 190, 34, 3)
c2 = torn_photo(IMG + "fed.jpg", 470, 3); bg.alpha_composite(c2, (770, 30)); tape(bg, 930, 26, -4)
d = ImageDraw.Draw(bg)
d.text((585, 120), "=", font=MK(170), fill=RED)
band = Image.new("RGBA", (W, 250), (247, 243, 234, 240)); bg.alpha_composite(band, (0, 430))
d = ImageDraw.Draw(bg)
x = rupee(d, 60, 450, inr(AUG), 120, (120, 116, 106))
d.line((60, 545, x, 525), fill=RED, width=12)          # struck through
d.text((x + 24, 462), "→", font=OSWX(104), fill=INK)
x2 = rupee(d, x + 120, 450, inr(NOW), 120, RED)
d.text((x2 + 18, 515), "/ GRAM", font=OSW(64), fill=INK)
bg.convert("RGB").save(OUT.format("B"), quality=92)
print(OUT.format("B"), AUG, NOW)

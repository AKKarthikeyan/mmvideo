"""India Ledger gold V3 thumbnail (AK: use the Modi photo).
The real 5 Nov 2015 launch photo (PMO, GODL-India), black and white, not otherwise edited. The LOST stamp sits on the
gold bar, never on the photo. -> out/india_ledger/il-gold-v3-thumb.jpg (1280x720)"""
import random
from PIL import Image, ImageDraw, ImageFont, ImageOps

random.seed(7)
TOOLS = "/Volumes/DarwinSSD/MMVideo/hyperframes/tools/"
src = open(TOOLS + "il_collage_test.py").read().split("\nA = paper()")[0]
exec(src)                       # paper(), torn_photo(), tape(), fonts
NM = "/Volumes/DarwinSSD/MMVideo/node_modules/@fontsource/"
OSW = lambda s: ImageFont.truetype(NM + "oswald/files/oswald-latin-700-normal.woff", s)
OSWX = lambda s: ImageFont.truetype(NM + "oswald/files/oswald-latin-ext-700-normal.woff", s)
MK = lambda s: ImageFont.truetype(NM + "permanent-marker/files/permanent-marker-latin-400-normal.woff", s)
OUT = "/Volumes/DarwinSSD/MMVideo/out/india_ledger/il-gold-v3-thumb.jpg"

W, H = 1280, 720
bg = paper().convert("RGBA").resize((W, H))
# the launch photo, cropped to Modi handing over the first bond, in black and white
ph = Image.open(G + "72061542_Narendra_Modi_launches_the_Gold_schemes.jpg").convert("RGB")
ph = ph.crop((0, 0, 1500, 1491))
ph = ImageOps.grayscale(ph).convert("RGB")
tmp = "/tmp/il_thumb_bw.jpg"; ph.save(tmp, quality=95)
card = torn_photo(tmp, 560, -3)
bg.alpha_composite(card, (20, 46))
tape(bg, 230, 40, 4)

# the gold bar
bar = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(bar)
cx, cy, w = 955, 250, 500
d.polygon([(cx - w / 2, cy + w * 0.2), (cx - w * 0.38, cy - w * 0.2), (cx + w * 0.38, cy - w * 0.2), (cx + w / 2, cy + w * 0.2)], fill=(184, 134, 11), outline=(127, 93, 7))
d.polygon([(cx - w * 0.38, cy - w * 0.2), (cx + w * 0.38, cy - w * 0.2), (cx + w * 0.3, cy - w * 0.08), (cx - w * 0.3, cy - w * 0.08)], fill=(226, 184, 74))
d.polygon([(cx - w * 0.3, cy - w * 0.08), (cx + w * 0.3, cy - w * 0.08), (cx + w / 2, cy + w * 0.2), (cx - w / 2, cy + w * 0.2)], fill=(201, 150, 24))
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).ellipse((cx - w * 0.55, cy + w * 0.16, cx + w * 0.55, cy + w * 0.3), fill=(0, 0, 0, 70))
bg.alpha_composite(sh); bg.alpha_composite(bar)

# LOST stamp on the bar
st = Image.new("RGBA", (330, 140), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
sd.rectangle((6, 6, 324, 134), outline=(173, 53, 23), width=11)
f = OSW(104); tw = sd.textlength("LOST", font=f); sd.text(((330 - tw) / 2, 0), "LOST", font=f, fill=(173, 53, 23))
st = st.rotate(9, expand=True, resample=Image.BICUBIC)
bg.alpha_composite(st, (cx - st.width // 2, cy - st.height // 2 + 10))

# YOU PAY Rs 690
d = ImageDraw.Draw(bg)
d.text((690, 420), "YOU PAY", font=MK(78), fill=(23, 24, 27))
rs, rn = OSWX(160), OSW(160)
d.text((690, 490), "₹", font=rs, fill=(173, 53, 23))
d.text((690 + d.textlength("₹", font=rs) + 6, 490), "650", font=rn, fill=(173, 53, 23))
bg.convert("RGB").save(OUT, quality=92)
print(OUT)

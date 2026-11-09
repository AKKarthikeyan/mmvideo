# python3 -I src/looks/upsc_rich_b/brand/previews.py  -> logo_preview.png, banner_safe.png, banner_phone.png
from PIL import Image, ImageDraw
O = "out/upsc/brand/"
def circ(im, s):
    im = im.convert("RGB").resize((s, s), Image.LANCZOS)
    m = Image.new("L", (s * 4, s * 4), 0); ImageDraw.Draw(m).ellipse((0, 0, s * 4 - 1, s * 4 - 1), fill=255)
    m = m.resize((s, s), Image.LANCZOS); out = Image.new("RGBA", (s, s), (0, 0, 0, 0)); out.paste(im, (0, 0), m); return out
sheet = Image.new("RGB", (3 * 330 + 40, 2 * 220 + 20), "#ffffff")
d = ImageDraw.Draw(sheet)
for r, bg in enumerate(["#ffffff", "#0f0f0f"]):
    d.rectangle((0, r * 230, sheet.width, r * 230 + 220), fill=bg)
    for i in range(3):
        im = Image.open(f"{O}logo{i+1}.png")
        for k, s in enumerate([48, 96, 160]):
            c = circ(im, s); sheet.paste(c, (20 + i * 330 + (0 if k == 0 else 70 if k == 1 else 70 + 120), r * 230 + 20 + (80 if k == 0 else 50 if k == 1 else 0)), c)
sheet.save(O + "logo_preview.png")
b = Image.open(O + "banner.png").convert("RGB")
x0, y0 = (2560 - 1546) // 2, (1440 - 423) // 2
b.crop((x0, y0, x0 + 1546, y0 + 423)).save(O + "banner_safe.png")
# phone: safe area at roughly phone width, shown at 360 px wide (and 2x)
safe = b.crop((x0, y0, x0 + 1546, y0 + 423)); safe.resize((720, int(423 * 720 / 1546)), Image.LANCZOS).save(O + "banner_phone.png")
b.resize((1280, 720), Image.LANCZOS).save(O + "banner_small.png")

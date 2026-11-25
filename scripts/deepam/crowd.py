"""Draw the k2 devotee crowd in code (the MiniMax crowd would not key cleanly): two rows of figures seen from behind,
joined hands raised over their heads. Dark-red fill with a black ink edge -> public/deepam/cut/k2.png."""
import random
from PIL import Image, ImageDraw, ImageFilter
W, H = 2160, 1000
rnd = random.Random(7)
im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)

def figure(cx, base, s, fill):
    head_r = 34 * s; sh_w = 88 * s; body_h = 260 * s; neck = base - body_h
    d.polygon([(cx - sh_w, base + 40), (cx - sh_w * 0.95, neck + 30 * s), (cx - sh_w * 0.5, neck), (cx + sh_w * 0.5, neck),
               (cx + sh_w * 0.95, neck + 30 * s), (cx + sh_w, base + 40)], fill=fill)
    hy = neck - head_r * 0.9
    d.ellipse([cx - head_r, hy - head_r, cx + head_r, hy + head_r], fill=fill)
    lean = rnd.uniform(-12, 12) * s; top = hy - head_r - rnd.uniform(110, 170) * s
    for side in (-1, 1):                     # arms up, hands meeting above the head
        d.polygon([(cx + side * sh_w * 0.62, neck + 14 * s), (cx + side * sh_w * 0.98, neck + 30 * s),
                   (cx + lean + side * 10 * s, top + 26 * s), (cx + lean, top + 30 * s)], fill=fill)
    d.polygon([(cx + lean - 13 * s, top + 40 * s), (cx + lean, top - 10 * s), (cx + lean + 13 * s, top + 40 * s)], fill=fill)

for row, (base, s, fill, n) in enumerate([(700, 0.8, (60, 8, 12, 255), 13), (1000, 1.15, (110, 13, 18, 255), 9)]):
    xs = [W * (i + 0.5) / n + rnd.uniform(-40, 40) for i in range(n)]
    for x in xs:
        figure(x, base + rnd.uniform(-30, 20), s * rnd.uniform(0.9, 1.1), fill)
a = im.getchannel("A"); edge = a.filter(ImageFilter.MaxFilter(9))
out = Image.new("RGBA", (W, H), (7, 7, 11, 0)); out.putalpha(edge); out.alpha_composite(im)
out.crop(out.getchannel("A").getbbox()).save("public/deepam/cut/k2.png"); print("crowd", out.size)

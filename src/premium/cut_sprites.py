#!/usr/bin/env python3
"""Premium style test, treatment B: cut the two MiniMax shop paintings out of their backgrounds with a hand-placed
polygon (feathered), so they can be copied and placed on the establishing plate. Output: public/premium/b/shop_[ab].png"""
from PIL import Image, ImageDraw, ImageFilter
D = "/Volumes/DarwinSSD/MMVideo/public/premium/b/"
POLY = {
  "shop_a": [(455,138),(500,138),(500,192),(885,192),(930,268),(905,284),(905,600),(434,600),(434,284),(398,272),(440,192),(455,192)],
  "shop_b": [(835,100),(930,100),(930,200),(918,200),(950,282),(938,294),(938,600),(380,600),(382,294),(362,285),(420,195),(835,195)],
}
for n, poly in POLY.items():
    im = Image.open(D + n + "_720.jpeg").convert("RGBA")
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).polygon(poly, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(1.6))
    im.putalpha(m)
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    im.crop((min(xs) - 4, min(ys) - 4, max(xs) + 4, max(ys) + 4)).save(D + n + ".png")
    print(n, max(xs) - min(xs) + 8, max(ys) - min(ys) + 8)

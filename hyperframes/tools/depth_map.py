"""Depth map for the 2.5D photo sample: nearness grows with distance from the vanishing point; flat sky is pushed far.

usage: depth_map.py <image> <out depth.png> --vp <x>,<y> [--sky r,g,b] [--sky-max-y 0.71]
--vp is the vanishing point in pixels of the full image. --sky is the sky colour (0-255); sky pixels within 15/255 of it
that connect to the top centre (above --sky-max-y of the height) become far. White = near, black = far.
s10 used --vp 960,790 --sky 237,223,193 on public/vx/mf003-textile/img/mill_gate.jpeg. Works best on one-point
perspective pictures (streets, rail lines, corridors); other pictures need a hand-made depth map.
"""
import argparse

import numpy as np
from PIL import Image, ImageFilter


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("image"); ap.add_argument("out"); ap.add_argument("--vp", required=True)
    ap.add_argument("--sky"); ap.add_argument("--sky-max-y", type=float, default=0.71)
    a = ap.parse_args()
    src = Image.open(a.image).convert("RGB")
    W0, H0 = src.size
    w, h = 960, round(960 * H0 / W0)
    im = np.asarray(src.resize((w, h))).astype(float) / 255
    vx, vy = (float(v) * w / W0 for v in a.vp.split(","))
    yy, xx = np.mgrid[0:h, 0:w]
    near = np.clip(np.hypot((xx - vx) / w, (yy - vy) / h * 0.8) / 0.62, 0, 1) ** 0.85
    if a.sky:
        sky = np.abs(im - np.array([float(c) for c in a.sky.split(",")]) / 255).max(2) < 0.06
        mask = np.zeros((h, w), bool)
        stack = [(5, w // 2)]
        while stack:
            y, x = stack.pop()
            if 0 <= y < h * a.sky_max_y and 0 <= x < w and not mask[y, x] and sky[y, x]:
                mask[y, x] = True
                stack += [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
        m = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(7))
        near[np.asarray(m) > 127] = 0.0
    Image.fromarray((near * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5)).save(a.out)
    print(a.out, (w, h))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Bake the looks' static textures once (own work, no image model, no WebGL): film-grain tiles for shared/Grain.tsx.

  .venv/bin/python scripts/datayt/look_bake.py      -> public/looks/grain/grain-0.png ... grain-3.png

Each tile is 256x256 8-bit grey, Gaussian noise around mid-grey (so an overlay blend leaves the average colour alone),
lightly blurred so it reads as film grain rather than pixel noise. Seeds are fixed: re-running writes identical files.
"""
import os, struct, zlib
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public/looks/grain")


def png_grey(path, img):
    h, w = img.shape
    raw = b"".join(b"\x00" + img[y].tobytes() for y in range(h))
    chunk = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    data = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 0, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")
    open(path, "wb").write(data)


def tile(seed, n=256, sigma=34.0):
    r = np.random.default_rng(seed)
    a = r.normal(0, 1, (n, n))
    k = np.array([0.25, 0.5, 0.25])      # a 3-tap blur, wrapped so the tile repeats without a seam
    a = k[0] * np.roll(a, 1, 0) + k[1] * a + k[2] * np.roll(a, -1, 0)
    a = k[0] * np.roll(a, 1, 1) + k[1] * a + k[2] * np.roll(a, -1, 1)
    a = a / a.std() * sigma + 128
    return np.clip(a, 0, 255).astype(np.uint8)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for i in range(4):
        png_grey(os.path.join(OUT, f"grain-{i}.png"), tile(1009 + i))
    print(f"grain: 4 tiles -> {os.path.relpath(OUT, ROOT)}")

#!/usr/bin/env python3
"""Bake the Dispatch newsprint texture (own work, numpy only, no WebGL, no AI).

Writes public/looks/dispatch/paper-0..3.jpg: 1080x1920 greyscale maps centred on mid-grey (128). The look lays one over a
flat brand colour (newsprint, a fold band, the ink page) with mix-blend-mode soft-light, so the texture carries no colour of
its own and every brand keeps its palette. Each map has fibres, mottling, fine grain and two soft folds at seeded places.
The look picks a map per story beat (seeded) and holds it still for the whole beat (low bitrate).

  .venv/bin/python src/looks/dispatch/bake_paper.py
"""
import os, struct, subprocess, zlib
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
OUT = os.path.join(ROOT, "public/looks/dispatch")
COMP = os.path.join(ROOT, "node_modules/@remotion/compositor-darwin-arm64")
W, H = 1080, 1920


def box_blur(a, r):
    """Separable box blur of radius r (edges clamped), by cumulative sums."""
    if r < 1:
        return a
    for axis in (0, 1):
        p = np.pad(a, [(r + 1, r) if ax == axis else (0, 0) for ax in (0, 1)], mode="edge")
        c = np.cumsum(p, axis=axis)
        n = a.shape[axis]
        if axis == 0:
            a = (c[2 * r + 1:2 * r + 1 + n] - c[:n]) / (2 * r + 1)
        else:
            a = (c[:, 2 * r + 1:2 * r + 1 + n] - c[:, :n]) / (2 * r + 1)
    return a


def smooth_noise(rng, cell, amp):
    g = rng.standard_normal((H // cell + 3, W // cell + 3))
    up = np.kron(g, np.ones((cell, cell)))[:H, :W]
    for _ in range(3):
        up = box_blur(up, cell // 2)
    return up / (up.std() + 1e-9) * amp


def fibres(rng, n, amp):
    a = np.zeros((H, W))
    x0 = rng.uniform(0, W, n); y0 = rng.uniform(0, H, n)
    ang = rng.uniform(0, np.pi, n); bend = rng.uniform(-0.04, 0.04, n)
    length = rng.uniform(8, 42, n); sgn = np.where(rng.random(n) < 0.62, 1.0, -1.0) * rng.uniform(0.5, 1.0, n)
    steps = np.linspace(0, 1, 40)
    for k in range(n):
        t = steps * length[k]
        th = ang[k] + bend[k] * t
        xs = (x0[k] + np.cumsum(np.cos(th)) * length[k] / 40).astype(int)
        ys = (y0[k] + np.cumsum(np.sin(th)) * length[k] / 40).astype(int)
        ok = (xs >= 0) & (xs < W) & (ys >= 0) & (ys < H)
        np.add.at(a, (ys[ok], xs[ok]), sgn[k])
    a = box_blur(a, 1)
    return a / (np.abs(a).max() + 1e-9) * amp


def fold(y, at, width, depth, light):
    d = y - at
    return -depth * np.exp(-(d / width) ** 2) + light * np.exp(-((d - 3 * width) / (6 * width)) ** 2) * (d > 0)


def bake(seed):
    rng = np.random.default_rng(1000 + seed)
    img = np.full((H, W), 128.0)
    img += smooth_noise(rng, 96, 5.0)          # broad mottling
    img += smooth_noise(rng, 12, 2.6)          # pulp clumps
    img += fibres(rng, 9000, 20.0)             # fibres
    img += rng.standard_normal((H, W)) * 3.6   # fine grain
    yy = np.arange(H)[:, None] * np.ones((1, W))
    xx = np.ones((H, 1)) * np.arange(W)[None, :]
    fy = rng.uniform(0.42, 0.62) * H           # a horizontal fold across the page
    img += fold(yy, fy, 2.2, 12.0, 4.0)
    img += 3.5 * np.tanh((yy - fy) / 260)       # the two halves of a folded sheet catch the light differently
    fx = rng.uniform(0.38, 0.62) * W           # a faint vertical fold
    img += fold(xx, fx, 1.6, 6.0, 2.0)
    img = np.clip(img, 0, 255).astype(np.uint8)
    os.makedirs(OUT, exist_ok=True)
    out = os.path.join(OUT, f"paper-{seed}.jpg")
    png = out[:-4] + ".png"
    write_png(png, img)      # Remotion's ffmpeg has no rawvideo input: write a PNG, then let it encode the JPEG
    subprocess.run([f"{COMP}/ffmpeg", "-v", "error", "-y", "-i", png, "-q:v", "3", "-pix_fmt", "gray", out], check=True,
                   env={**os.environ, "DYLD_LIBRARY_PATH": COMP})
    os.remove(png)
    print(out, os.path.getsize(out))


def write_png(path, a):
    """8-bit greyscale PNG, no dependencies."""
    raw = b"".join(b"\x00" + a[y].tobytes() for y in range(a.shape[0]))
    chunk = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    with open(path, "wb") as fh:
        fh.write(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", a.shape[1], a.shape[0], 8, 0, 0, 0, 0))
                 + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))


if __name__ == "__main__":
    for s in range(4):
        bake(s)

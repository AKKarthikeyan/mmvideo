#!/usr/bin/env python3
"""A01 v3 sprite cut-outs: key a MiniMax sprite off its plain white background. Background = pixels close to the
border colour AND connected to the image border (so whites inside the object stay). Edge feathered; cropped to content.
Usage: uv run --with pillow --with numpy --with scipy python a01v3_cut.py in.jpeg out.png [thr=40] [cut_below_frac]"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
src, out = sys.argv[1], sys.argv[2]; thr = float(sys.argv[3]) if len(sys.argv) > 3 else 40
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
H, W, _ = im.shape
border = np.concatenate([im[0], im[-1], im[:, 0], im[:, -1]])
bg = np.median(border, axis=0)
dist = np.sqrt(((im - bg) ** 2).sum(-1))
cand = dist < thr
lab, n = nd.label(cand)
edge_labels = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
bgmask = np.isin(lab, list(edge_labels))
# close tiny holes in the object, then drop isolated specks of "object"
obj = ~bgmask
obj = nd.binary_opening(obj, iterations=1)
lab2, n2 = nd.label(obj)
if n2 > 1:
    sizes = nd.sum(obj, lab2, range(1, n2 + 1)); keep = 1 + int(np.argmax(sizes))
    big = [i + 1 for i, s in enumerate(sizes) if s > 0.02 * sizes.max()]
    obj = np.isin(lab2, big)
obj = nd.binary_fill_holes(obj) if "--fill" in sys.argv else obj
if "--largest" in sys.argv:
    lab3, n3 = nd.label(obj); sz = nd.sum(obj, lab3, range(1, n3 + 1)); obj = lab3 == (1 + int(np.argmax(sz)))
if len(sys.argv) > 4 and not sys.argv[4].startswith("--"):
    cutb = float(sys.argv[4]); ys = np.where(obj.any(1))[0]; y1 = int(ys.min() + (ys.max() - ys.min()) * cutb); obj[y1:] = False
if "--trimbase" in sys.argv:
    ys = np.where(obj.any(1))[0]; y0, y1 = ys.min(), ys.max(); hh = y1 - y0
    ref = obj[int(y1 - 0.25 * hh):int(y1 - 0.12 * hh)].any(0); xs = np.where(ref)[0]; xa, xb = xs.min() - 14, xs.max() + 14
    band = slice(int(y1 - 0.12 * hh), y1 + 1)
    obj[band, :max(0, xa)] = False; obj[band, xb:] = False
    lum = im[..., 0] * 0.3 + im[..., 1] * 0.59 + im[..., 2] * 0.11
    sub = obj[band]; sub &= ~(lum[band] > 222); obj[band] = sub
    lab4, n4 = nd.label(obj); sz = nd.sum(obj, lab4, range(1, n4 + 1)); obj = lab4 == (1 + int(np.argmax(sz)))
a = Image.fromarray((obj * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
rgba = Image.fromarray(im.astype(np.uint8)).convert("RGBA"); rgba.putalpha(a)
bb = a.getbbox(); rgba = rgba.crop((max(0, bb[0] - 6), max(0, bb[1] - 6), min(W, bb[2] + 6), min(H, bb[3] + 6)))
rgba.save(out); print(out, rgba.size, "bg", bg.round(), "components", n2)

"""Grade Sentinel-2 crops with one shared stretch (so a before/after compares like with like) and upscale them.

usage: s2_grade.py <out dir> <scale> <crop.png> [<crop.png> ...]
Writes <out dir>/<crop name>.jpg. The stretch is the 1.5th to 99.6th percentile of all crops together, gamma 0.92.
Used for s01: s2_crop.py S2A_43QBB_20180118_0 and S2C_43QBB_20260116_0 at 18.995, 73.075, 13 km, then scale 1.6.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image


def main(out, scale, *crops):
    ims = [np.asarray(Image.open(c).convert("RGB")).astype(float) for c in crops]
    allpx = np.concatenate([a.reshape(-1, 3) for a in ims])
    lo, hi = np.percentile(allpx, 1.5, axis=0), np.percentile(allpx, 99.6, axis=0)
    Path(out).mkdir(parents=True, exist_ok=True)
    for c, a in zip(crops, ims):
        x = np.clip((a - lo) / (hi - lo), 0, 1) ** 0.92
        h, w = a.shape[:2]
        im = Image.fromarray((x * 255).astype(np.uint8)).resize((round(w * float(scale)), round(h * float(scale))), Image.LANCZOS)
        dst = Path(out) / (Path(c).stem + ".jpg")
        im.save(dst, quality=92)
        print(dst, im.size)


if __name__ == "__main__":
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    main(*sys.argv[1:])

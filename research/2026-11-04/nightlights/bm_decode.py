"""Decode GIBS VIIRS_SNPP_GapFilled_BRDF_Corrected_DayNightBand_Radiance PNGs to radiance (nW/cm2/sr, bin midpoints)."""
import re, sys, numpy as np
from PIL import Image
def load_cmap(path):
    lut = {}
    for rgb, val, nd in re.findall(r'rgb="([\d,]+)"[^>]*?value="([^"]+)"([^>]*)', open(path).read()):
        r, g, b = map(int, rgb.split(','))
        if 'nodata' in nd: lut[(r, g, b)] = np.nan; continue
        lo, hi = [float(v) for v in re.findall(r'[-\d.]+', val)[:2]]
        lut[(r, g, b)] = lo if hi > 1000 else (lo + hi) / 2
    return lut
def decode(png, lut):
    im = Image.open(png)
    a = np.asarray(im.convert('RGBA'))
    key = (a[..., 0].astype(np.int32) << 16) | (a[..., 1].astype(np.int32) << 8) | a[..., 2]
    out = np.full(key.shape, np.nan)
    hit = np.zeros(key.shape, bool)
    for (r, g, b), v in lut.items():
        m = key == ((r << 16) | (g << 8) | b); out[m] = v; hit |= m
    out[a[..., 3] == 0] = np.nan
    return out, hit
if __name__ == '__main__':
    lut = load_cmap(sys.argv[1])
    for p in sys.argv[2:]:
        r, hit = decode(p, lut)
        v = r[~np.isnan(r)]
        print(p, 'matched %.3f' % hit.mean(), 'valid %.3f' % (v.size / r.size), 'mean %.3f' % v.mean(), 'lit>1 %.4f' % (v > 1).mean(), 'p99 %.1f' % np.percentile(v, 99))

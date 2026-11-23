# Vox Motion+ media prep (18 Oct 2026). Everything here is drawn in code or derived from the downloaded
# public-domain / CC0 originals in public/voxplus/src_dl/ (sources in src/voxplus/LICENSES.md).
#   upy.sh prep_media.py
# Writes into public/voxplus/:
#   tex/paper.jpg        seamless cream paper tile (code-drawn: periodic low-frequency mottling + fibres)
#   tex/paper_dark.jpg   the same tile, darker kraft tone (for page stacks / boards)
#   tex/grain.png        film-grain tile (code-drawn)
#   media/loom_draper_1987.jpg      Draper looms, HAER 1987 (PD), toned and cropped for a photo print
#   media/looms_radcliffe_1912.jpg  Northrop loom shed 1912 (PD), caption cropped off
#   media/candy_box_sticker.png     CC0 candy box cut out on alpha, with a baked white sticker border
import os
import numpy as np
from PIL import Image, ImageFilter, ImageOps
from scipy import ndimage

ROOT = "/Volumes/DarwinSSD/MMVideo/public/voxplus"
SRC = ROOT + "/src_dl"
os.makedirs(ROOT + "/tex", exist_ok=True)
os.makedirs(ROOT + "/media", exist_ok=True)
rng = np.random.default_rng(1018)


def periodic_noise(n, power):
    """Seamless (periodic) noise with a 1/f^power spectrum, normalised to 0..1."""
    f = np.fft.fftfreq(n)
    fx, fy = np.meshgrid(f, f)
    r = np.sqrt(fx ** 2 + fy ** 2)
    r[0, 0] = 1
    spec = (rng.normal(size=(n, n)) + 1j * rng.normal(size=(n, n))) / r ** power
    spec[0, 0] = 0
    img = np.real(np.fft.ifft2(spec))
    img -= img.min()
    return img / img.max()


def paper(base, n=1024):
    low = periodic_noise(n, 1.6)            # soft mottling
    mid = periodic_noise(n, 0.9)            # tooth
    img = np.zeros((n, n, 3))
    for c in range(3):
        img[..., c] = base[c] + (low - 0.5) * 22 + (mid - 0.5) * 9
    # fibres: short thin curved strokes, wrapped so the tile stays seamless
    fib = np.zeros((n, n))
    for _ in range(900):
        x, y = rng.uniform(0, n, 2)
        a = rng.uniform(0, np.pi)
        L = rng.uniform(8, 38)
        bend = rng.uniform(-0.04, 0.04)
        for t in np.linspace(0, L, int(L * 2)):
            xx = int(x + np.cos(a + bend * t) * t) % n
            yy = int(y + np.sin(a + bend * t) * t) % n
            fib[yy, xx] += 1
    fib = ndimage.gaussian_filter(fib, 0.6, mode="wrap")
    fib = fib / fib.max()
    sign = np.where(rng.uniform(size=(n, n)) > 0.5, 1, -1)
    fib_s = ndimage.gaussian_filter(fib * sign, 0.4, mode="wrap")
    for c in range(3):
        img[..., c] -= fib * 10
        img[..., c] += fib_s * 6
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))


paper((243, 238, 227)).save(ROOT + "/tex/paper.jpg", quality=92)
paper((214, 200, 176)).save(ROOT + "/tex/paper_dark.jpg", quality=92)

g = rng.normal(128, 46, size=(512, 512))
g = ndimage.gaussian_filter(g, 0.55, mode="wrap")
Image.fromarray(np.clip(g, 0, 255).astype(np.uint8)).save(ROOT + "/tex/grain.png")


def tone(im, warm=(1.0, 0.97, 0.9), contrast=1.08, lift=10):
    """Archive-print tone: grey -> slightly warm, gentle contrast, lifted blacks."""
    a = np.asarray(im.convert("L")).astype(float)
    a = (a - 128) * contrast + 128
    a = lift + a * (255 - lift) / 255
    out = np.stack([a * warm[0], a * warm[1], a * warm[2]], -1)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


d = Image.open(SRC + "/draper_looms_1987.jpg")
tone(d).save(ROOT + "/media/loom_draper_1987.jpg", quality=90)

r = Image.open(SRC + "/northrop_radcliffe_1912.png")
w, h = r.size
r = r.crop((int(w * 0.035), int(h * 0.05), int(w * 0.965), int(h * 0.925)))   # drop the printed caption and page edge
tone(r, warm=(1.0, 0.96, 0.88), contrast=1.0, lift=18).save(ROOT + "/media/looms_radcliffe_1912.jpg", quality=88)

# candy box: flood-fill the near-white studio background from the borders -> alpha; bake a white sticker border
c = Image.open(SRC + "/white_box_chocolates.jpg").convert("RGB")
a = np.asarray(c).astype(int)
bg = (a.min(-1) > 228) & (a.max(-1) - a.min(-1) < 18)
lab, _ = ndimage.label(bg)
edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
outside = np.isin(lab, list(edge))
obj = ~outside
obj = ndimage.binary_opening(obj, iterations=9)
obj = ndimage.binary_fill_holes(obj)
lab2, nl = ndimage.label(obj)
if nl > 1:
    sizes = ndimage.sum(obj, lab2, range(1, nl + 1))
    obj = lab2 == (1 + int(np.argmax(sizes)))
# the box is convex: fill its convex hull so its own white walls are not eaten by the background test
from scipy.spatial import ConvexHull
from PIL import ImageDraw
pts = np.argwhere(obj)[:, ::-1]
hull = pts[ConvexHull(pts).vertices]
hm = Image.new("L", (obj.shape[1], obj.shape[0]), 0)
ImageDraw.Draw(hm).polygon([tuple(map(int, q)) for q in hull], fill=255)
obj = np.asarray(hm) > 127
B = 22                                       # sticker border width (px at source scale)
pad = B + 30
H0, W0 = obj.shape
canvas_obj = np.zeros((H0 + 2 * pad, W0 + 2 * pad), bool)
canvas_obj[pad:pad + H0, pad:pad + W0] = obj
dist = ndimage.distance_transform_edt(~canvas_obj)
sticker = dist <= B
sticker_a = np.clip(B + 1 - dist, 0, 1)      # 1 px anti-aliased outer edge
rgb = np.full((H0 + 2 * pad, W0 + 2 * pad, 3), 252, np.uint8)
rgb[pad:pad + H0, pad:pad + W0][obj] = np.asarray(c)[obj]
obj_soft = ndimage.gaussian_filter(canvas_obj.astype(float), 0.7)
rgb = (rgb * obj_soft[..., None] + 252 * (1 - obj_soft[..., None])).astype(np.uint8)
alpha = (np.maximum(sticker_a, obj_soft) * 255).astype(np.uint8)
ys, xs = np.where(alpha > 0)
im = Image.fromarray(np.dstack([rgb, alpha]), "RGBA").crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
im.save(ROOT + "/media/candy_box_sticker.png")
print("candy sticker", im.size, "object share", obj.mean().round(3))
for n in ["loom_draper_1987.jpg", "looms_radcliffe_1912.jpg"]:
    print(n, Image.open(ROOT + "/media/" + n).size)

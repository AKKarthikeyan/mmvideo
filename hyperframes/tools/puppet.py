"""Cut-out puppet test: split each illustrated character into head / hands / body layers and animate them (head tilt, nod,
look left/right, hand gesture, body turn, breathing). Frames piped to ffmpeg. Test only; production goes into HyperFrames."""
import math, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
exec(open("/tmp/collage.py").read().split("# ---------- Frame A")[0])  # paper(), sticker(), fonts
C = "/Volumes/DarwinSSD/MMVideo/hyperframes/media_src/characters/cut/"
FPS, SEC = 30, 8

def poly_mask(size, pts, feather=2):
    m = Image.new("L", size, 0); ImageDraw.Draw(m).polygon(pts, fill=255)
    return m.filter(ImageFilter.GaussianBlur(feather))

def fill_hole(im, hole):
    """Fill a hole by normalised blur of what surrounds it (cheap inpaint)."""
    a = np.asarray(im).astype(np.float32); h = np.asarray(hole).astype(np.float32)[..., None] / 255
    keep = (1 - h) * (a[..., 3:4] / 255)
    num = np.asarray(Image.fromarray(np.clip(a[..., :3] * keep, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(28))).astype(np.float32)
    den = np.asarray(Image.fromarray((keep[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(28))).astype(np.float32)[..., None] / 255
    fill = num / np.maximum(den, 1e-3)
    out = a.copy(); out[..., :3] = a[..., :3] * (1 - h) + fill * h
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))

class Puppet:
    def __init__(self, path, head_pts, head_keep_y, head_pivot, hand_pts, hand_pivot, scale):
        im = Image.open(path).convert("RGBA")
        sz = (int(im.width * scale), int(im.height * scale)); im = im.resize(sz, Image.LANCZOS)
        S = lambda pts: [(x * scale, y * scale) for x, y in pts]
        self.size = sz
        hm = poly_mask(sz, S(head_pts))
        self.head = im.copy(); self.head.putalpha(Image.fromarray((np.asarray(im)[..., 3] * (np.asarray(hm) / 255)).astype(np.uint8)))
        hd = poly_mask(sz, S(hand_pts))
        self.hand = im.copy(); self.hand.putalpha(Image.fromarray((np.asarray(im)[..., 3] * (np.asarray(hd) / 255)).astype(np.uint8)))
        body = fill_hole(im, hd)                       # body without the hands
        top = Image.new("L", sz, 0); ImageDraw.Draw(top).polygon(S(head_pts), fill=255)
        ImageDraw.Draw(top).rectangle((0, head_keep_y * scale, sz[0], sz[1]), fill=0)   # keep the neck in the body layer
        a = np.asarray(body).copy(); a[..., 3] = (a[..., 3] * (1 - np.asarray(top) / 255)).astype(np.uint8)
        self.body = Image.fromarray(a)
        self.hp = (head_pivot[0] * scale, head_pivot[1] * scale); self.dp = (hand_pivot[0] * scale, hand_pivot[1] * scale)

    def pose(self, head_rot=0, head_dx=0, head_dy=0, head_sx=1, hand_rot=0, hand_dy=0, turn=0, breathe=0):
        W0, H0 = self.size; pad = 120
        cv = Image.new("RGBA", (W0 + 2 * pad, H0 + pad), (0, 0, 0, 0))
        b = self.body
        if breathe: b = b.resize((W0, int(H0 * (1 + breathe))), Image.BICUBIC).crop((0, int(H0 * breathe), W0, int(H0 * (1 + breathe))))
        cv.alpha_composite(b, (pad, pad))
        def place(layer, pivot, rot, dx, dy, sx=1):
            L = layer
            if sx != 1:
                L = L.resize((int(W0 * sx), H0), Image.BICUBIC); nx = pivot[0] * sx; dx += pivot[0] - nx
            L = L.rotate(rot, resample=Image.BICUBIC, center=(pivot[0] * (sx if sx != 1 else 1), pivot[1]))
            cv.alpha_composite(L, (int(pad + dx), int(pad + dy)))
        place(self.hand, self.dp, hand_rot, 0, hand_dy)
        place(self.head, self.hp, head_rot, head_dx, head_dy, head_sx)
        if turn:  # 2.5D body turn: squash width, shear, slide
            w = int(cv.width * (1 - abs(turn) * 0.10))
            cv = cv.resize((w, cv.height), Image.BICUBIC).transform((w, cv.height), Image.AFFINE, (1, 0, 0, -0.05 * turn, 1, 0.05 * turn * w / 2), Image.BICUBIC)
        return sticker(cv, border=10)

ease = lambda x: 0.5 - 0.5 * math.cos(math.pi * max(0, min(1, x)))
def bump(t, a, b):  # 0 -> 1 -> 0 between a and b
    return math.sin(math.pi * max(0, min(1, (t - a) / (b - a))))

amma = Puppet(C + "amma_illus.png",
    head_pts=[(100, 0), (520, 0), (520, 380), (440, 400), (360, 430), (280, 415), (190, 400), (100, 390)], head_keep_y=355,
    head_pivot=(330, 440), hand_pts=[(395, 690), (560, 670), (660, 780), (650, 900), (520, 950), (430, 945), (395, 820)],
    hand_pivot=(420, 900), scale=0.78)
ravi = Puppet(C + "ravi_illus.png",
    head_pts=[(260, 0), (600, 0), (600, 380), (520, 400), (430, 430), (340, 400), (260, 330)], head_keep_y=360,
    head_pivot=(430, 450), hand_pts=[(330, 600), (470, 560), (650, 570), (690, 760), (650, 900), (470, 920), (330, 860)],
    hand_pivot=(470, 900), scale=0.78)

ff = subprocess.Popen(["/opt/homebrew/bin/ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1920x1080", "-r", str(FPS), "-i", "-",
                       "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "/tmp/puppet_test.mp4"], stdin=subprocess.PIPE)
BG = paper().convert("RGBA"); d = ImageDraw.Draw(BG)
d.text((90, 60), "TEST · CUT-OUT PUPPET", font=SERIF, fill=(30, 30, 35))
d.text((96, 175), "head, hands and body move separately", font=MARK, fill=(176, 130, 30))
for f in range(FPS * SEC):
    t = f / FPS; F = BG.copy()
    br = 0.006 * math.sin(t * 2.2)
    # Amma: idle tilt, looks left (2-3.5 s), shakes head no (4-5.5 s), hand pat, body turns right (6-7.5 s)
    look = bump(t, 1.8, 3.8); shake = math.sin((t - 4) * 9) * bump(t, 4, 5.6); turnA = bump(t, 6, 7.8)
    A = amma.pose(head_rot=2 * math.sin(t * 1.3) + 5 * look + 5 * shake, head_dx=-16 * look - 6 * shake, head_sx=1 - 0.08 * look,
                  hand_rot=-4 * bump(t, 2.4, 3.4) + 3 * math.sin(t * 2) * 0.3, hand_dy=-10 * bump(t, 2.4, 3.4), turn=0.8 * turnA, breathe=br)
    # Ravi: looks at phone, looks up with a nod (2-3.5 s), gestures (4-5.5 s), turns left toward Amma (6-7.5 s)
    up = bump(t, 1.8, 3.8); nod = math.sin((t - 2.2) * 10) * bump(t, 2.2, 3.4); gest = bump(t, 4, 5.8); turnR = bump(t, 6, 7.8)
    R = ravi.pose(head_rot=-4 * (1 - up) + 3 * nod - 4 * turnR, head_dy=6 * (1 - up) + 4 * nod, head_dx=10 * turnR,
                  hand_rot=-8 * gest * math.sin(t * 6) ** 2, hand_dy=-14 * gest, turn=-0.8 * turnR, breathe=-br)
    F.alpha_composite(A, (120, 1080 - A.height + 10)); F.alpha_composite(R, (1920 - R.width - 100, 1080 - R.height + 10))
    ff.stdin.write(F.convert("RGB").tobytes())
ff.stdin.close(); ff.wait(); print("ok /tmp/puppet_test.mp4")

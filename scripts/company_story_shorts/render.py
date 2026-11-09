"""Vox-style 30s Short: 'The day the phone lost its keyboard' (iPhone, 2007).
Pure-code motion graphics: PIL frames -> ffmpeg. 1080x1920 @ 30fps."""
import math, random, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS = 1080, 1920, 30
TOTAL = 30 * FPS
OUT = sys.argv[1] if len(sys.argv) > 1 else "iphone_vox_short.mp4"
random.seed(7); np.random.seed(7)

# ---------- palette & fonts ----------
PAPER = (241, 236, 226)
INK = (24, 22, 20)
YELLOW = (255, 214, 10)
RED = (226, 54, 44)
GREY = (120, 114, 106)
F = "/usr/share/fonts/"
def font(name, size):
    paths = {"disp": F + "opentype/inter/InterDisplay-Black.otf",
             "bold": F + "opentype/inter/Inter-Bold.otf",
             "semi": F + "opentype/inter/Inter-SemiBold.otf",
             "serif": F + "truetype/freefont/FreeSerifBold.ttf",
             "serifi": F + "truetype/freefont/FreeSerifItalic.ttf",
             "mono": F + "truetype/dejavu/DejaVuSansMono-Bold.ttf"}
    return ImageFont.truetype(paths[name], size)

# ---------- easing ----------
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def prog(t, a, b): return clamp((t - a) / (b - a))
def eo(x): return 1 - (1 - x) ** 3                 # ease-out cubic
def eio(x): return 4 * x**3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
def back(x):
    c1 = 1.70158; c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2

# ---------- background: paper texture with grain (bigger than frame for parallax) ----------
BW, BH = int(W * 1.25), int(H * 1.25)
noise = np.random.normal(0, 7, (BH, BW, 1))
fibers = np.array(Image.fromarray(np.uint8(np.random.rand(BH // 6, BW // 6) * 255)).resize((BW, BH), Image.BICUBIC)).astype(float)[..., None]
base = np.array(PAPER, float)[None, None, :] + noise + (fibers - 128) * 0.06
yy, xx = np.mgrid[0:BH, 0:BW]
vig = 1 - 0.18 * (((xx - BW / 2) / (BW / 2)) ** 2 + ((yy - BH / 2) / (BH / 2)) ** 2)
PAPER_IMG = Image.fromarray(np.uint8(np.clip(base * vig[..., None], 0, 255)))
GRAIN = [Image.fromarray(np.uint8(np.clip(np.random.normal(128, 18, (H // 2, W // 2)), 0, 255))).resize((W, H)).convert("L") for _ in range(6)]

def background(f):
    z = 1.0 + 0.10 * f / TOTAL                          # slow constant push (parallax: slower than fg)
    cw, ch = W / z * 1.0, H / z * 1.0
    cx, cy = BW / 2 + 30 * math.sin(f / 90), BH / 2
    return PAPER_IMG.crop((int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))).resize((W, H), Image.BILINEAR)

# ---------- drawing helpers ----------
def layer(): return Image.new("RGBA", (W, H), (0, 0, 0, 0))

def shadowed(base_img, sprite, xy, blur=18, off=(10, 16), alpha=90):
    """Paste RGBA sprite with soft cut-out drop shadow."""
    a = sprite.split()[3]
    sh = Image.new("RGBA", sprite.size, (0, 0, 0, 0))
    sh.putalpha(a.point(lambda v: v * alpha // 255))
    pad = blur * 3
    shp = Image.new("RGBA", (sprite.width + pad * 2, sprite.height + pad * 2), (0, 0, 0, 0))
    shp.paste(sh, (pad, pad)); shp = shp.filter(ImageFilter.GaussianBlur(blur))
    base_img.alpha_composite(shp, (int(xy[0] - pad + off[0]), int(xy[1] - pad + off[1])))
    base_img.alpha_composite(sprite, (int(xy[0]), int(xy[1])))

def cutout(img, border=14):
    """Give a sprite the white 'paper cut-out' border Vox uses."""
    a = img.split()[3]
    grown = a.filter(ImageFilter.MaxFilter(border * 2 + 1))
    out = Image.new("RGBA", (img.width + border * 2, img.height + border * 2), (0, 0, 0, 0))
    g = Image.new("L", out.size, 0); g.paste(grown, (border, border))
    g = g.filter(ImageFilter.MaxFilter(border * 2 + 1)) if False else g
    white = Image.new("RGBA", out.size, (250, 248, 243, 255)); white.putalpha(Image.eval(g, lambda v: v))
    full = Image.new("L", out.size, 0); full.paste(a, (border, border))
    big = full.filter(ImageFilter.MaxFilter(2 * border + 1))
    white.putalpha(big)
    white.alpha_composite(img, (border, border))
    return white

def text_w(d, s, fnt): return d.textbbox((0, 0), s, font=fnt)[2]

def highlight(d, box, p, color=YELLOW):
    """Marker swipe left->right with slightly ragged edges."""
    if p <= 0: return
    x0, y0, x1, y1 = box
    xe = x0 + (x1 - x0) * eo(p)
    d.rounded_rectangle((x0 - 10, y0 + 6, xe + 10, y1 + 4), radius=8, fill=color + (235,))

def hand_circle(d, cx, cy, rx, ry, p, color=RED, w=9):
    """Hand-drawn ellipse that draws itself."""
    if p <= 0: return
    pts = []
    n = int(140 * p)
    for i in range(n + 1):
        a = -2.2 + 2 * math.pi * 1.08 * i / 140
        wob = 1 + 0.035 * math.sin(i * 0.31)
        pts.append((cx + rx * wob * math.cos(a), cy + ry * wob * math.sin(a)))
    if len(pts) > 1: d.line(pts, fill=color, width=w, joint="curve")

def caption(lay, txt, t, start, y=1520, hl=None):
    """Bottom caption card that slides up; optional highlighted word."""
    p = eo(prog(t, start, start + 12))
    if p <= 0: return
    d = ImageDraw.Draw(lay)
    fnt = font("bold", 54)
    lines = wrap(d, txt, fnt, 880)
    lh = 72; h = lh * len(lines) + 60
    yy = y + (1 - p) * 80
    card = Image.new("RGBA", (960, h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)
    cd.rectangle((0, 0, 960, h), fill=(250, 248, 243, int(255 * p)))
    cd.rectangle((0, 0, 12, h), fill=INK + (int(255 * p),))
    for i, ln in enumerate(lines):
        if hl:
            hw = set(hl.split()); ws = ln.split(); x = 50; run = None
            sp = fnt.getlength(" ")
            for wd in ws + [None]:
                if wd is not None and wd.strip(".,'") in hw:
                    ww = fnt.getlength(wd)
                    run = (run[0] if run else x, x + ww)
                    x += ww + sp
                    continue
                if run:
                    highlight(cd, (run[0], 30 + i * lh, run[1], 30 + i * lh + 62), prog(t, start + 14, start + 30)); run = None
                if wd is not None: x += fnt.getlength(wd) + sp
        cd.text((50, 30 + i * lh), ln, font=fnt, fill=INK + (int(255 * p),))
    shadowed(lay, card, (60, yy), blur=14, off=(6, 10), alpha=int(70 * p))

def wrap(d, txt, fnt, maxw):
    words, lines, cur = txt.split(), [], ""
    for w_ in words:
        test = (cur + " " + w_).strip()
        if text_w(d, test, fnt) > maxw and cur: lines.append(cur); cur = w_
        else: cur = test
    return lines + [cur]

# ---------- generic sprites (no logos, no real product art) ----------
def keyboard_phone(seed, w=300, h=560, body=(38, 40, 46)):
    r = random.Random(seed)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w, h), radius=44, fill=body + (255,))
    d.rounded_rectangle((26, 40, w - 26, 250), radius=10, fill=(150, 185, 205, 255))
    for i in range(4):  # fake UI rows on tiny screen
        d.rectangle((46, 66 + i * 42, 46 + r.randint(80, 190), 88 + i * 42), fill=(95, 130, 150, 255))
    d.ellipse((w / 2 - 34, 268, w / 2 + 34, 318), fill=(70, 72, 80, 255))
    cols, rows = 5, 5; kw = (w - 52) / cols; kh = (h - 345) / rows
    for rr in range(rows):
        for cc in range(cols):
            x = 26 + cc * kw; y = 335 + rr * kh
            d.rounded_rectangle((x + 4, y + 4, x + kw - 4, y + kh - 4), radius=9, fill=(205, 205, 210, 255))
    return im

def glass_phone(w=430, h=840, screen_on=1.0):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, w, h), radius=64, fill=(20, 20, 22, 255))
    d.rounded_rectangle((6, 6, w - 6, h - 6), radius=60, outline=(150, 150, 155, 255), width=4)
    sx0, sy0, sx1, sy1 = 34, 120, w - 34, h - 140
    # screen gradient
    grad = Image.new("RGBA", (sx1 - sx0, sy1 - sy0))
    gd = ImageDraw.Draw(grad)
    for i in range(sy1 - sy0):
        k = i / (sy1 - sy0)
        c = (int(30 + 40 * k * screen_on), int(60 + 90 * k * screen_on), int(110 + 110 * screen_on * (1 - k * .3)), 255)
        gd.line((0, i, sx1 - sx0, i), fill=c)
    im.alpha_composite(grad, (sx0, sy0))
    # generic app grid
    if screen_on > 0.05:
        cols, gap = 4, 22
        s = ((sx1 - sx0) - gap * (cols + 1)) / cols
        hues = [(255, 120, 90), (90, 200, 120), (255, 200, 60), (100, 160, 255), (230, 90, 160), (120, 220, 220), (250, 150, 60), (160, 120, 240)]
        k = 0
        for rr in range(4):
            for cc in range(cols):
                x = sx0 + gap + cc * (s + gap); y = sy0 + 40 + rr * (s + 46)
                col = hues[k % len(hues)]; k += 1
                d.rounded_rectangle((x, y, x + s, y + s), radius=18, fill=col + (int(255 * screen_on),))
    d.ellipse((w / 2 - 34, h - 104, w / 2 + 34, h - 36), outline=(110, 110, 115, 255), width=4)
    d.rounded_rectangle((w / 2 - 50, 58, w / 2 + 50, 70), radius=6, fill=(60, 60, 64, 255))
    # glass glare
    gl = Image.new("RGBA", (w, h), (0, 0, 0, 0)); gld = ImageDraw.Draw(gl)
    gld.polygon([(w * .55, 0), (w, 0), (w, h * .38), (w * .1, h)], fill=(255, 255, 255, 18))
    mask = Image.new("L", (w, h), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), radius=64, fill=255)
    gl.putalpha(Image.composite(gl.split()[3], Image.new("L", (w, h), 0), mask))
    im.alpha_composite(gl)
    return im

def rotate(im, deg): return im.rotate(deg, resample=Image.BICUBIC, expand=True)

KB_PHONES = [cutout(keyboard_phone(i, body=b)) for i, b in enumerate([(38, 40, 46), (60, 62, 70), (25, 45, 70), (70, 30, 30), (40, 40, 40), (90, 92, 98)])]
KB_CENTER = keyboard_phone(99, w=430, h=840, body=(30, 32, 38))

# ---------- camera: push forward on each scene layer ----------
def camera(lay, scale, alpha=1.0, cx=W / 2, cy=H / 2):
    if abs(scale - 1) > 1e-3:
        a = 1 / scale
        lay = lay.transform((W, H), Image.AFFINE, (a, 0, cx - a * cx, 0, a, cy - a * cy), resample=Image.BILINEAR)
    if alpha < 1:
        lay.putalpha(lay.split()[3].point(lambda v: int(v * alpha)))
    return lay

# ---------- scenes ----------
def scene1(t):  # 0-5s  title + date
    L = layer(); d = ImageDraw.Draw(L)
    tag = "BREAKOUT MOMENTS  ·  EP. 01"
    d.text((90, 300), tag, font=font("mono", 34), fill=RED + (int(255 * eo(prog(t, 0, 10))),))
    date = "JANUARY 9, 2007"
    n = int(len(date) * prog(t, 8, 34))
    d.text((90, 380), date[:n] + ("_" if (t // 8) % 2 == 0 and n < len(date) else ""), font=font("mono", 64), fill=INK)
    big = font("disp", 128)
    lines = ["The day", "the phone", "lost its", "keyboard."]
    for i, ln in enumerate(lines):
        p = back(prog(t, 30 + i * 7, 48 + i * 7))
        if p <= 0: continue
        y = 640 + i * 150 + (1 - p) * 60
        if i >= 2:
            highlight(d, (90, y + 10, 90 + text_w(d, ln, big), y + 130), prog(t, 70 + (i - 2) * 10, 92 + (i - 2) * 10))
        d.text((90, y), ln, font=big, fill=INK + (int(255 * clamp(p)),))
    sub = font("serifi", 50)
    d.text((92, 1300), "How one launch rewired an industry", font=sub, fill=GREY + (int(255 * prog(t, 95, 115)),))
    return L

def scene2(t):  # 5-11s  the keyboard era
    L = layer(); d = ImageDraw.Draw(L)
    d.text((90, 210), "THE STATUS QUO", font=font("mono", 40), fill=RED + (int(255 * prog(t, 0, 10)),))
    d.text((90, 270), "2006", font=font("disp", 150), fill=INK + (int(255 * prog(t, 2, 14)),))
    pos = [(70, 520, -8), (400, 480, 4), (730, 540, 10), (120, 930, 6), (450, 900, -5), (760, 960, -9)]
    for i, (x, y, r) in enumerate(pos):
        p = back(prog(t, 8 + i * 6, 26 + i * 6))
        if p <= 0: continue
        sp = rotate(KB_PHONES[i].resize((int(KB_PHONES[i].width * .78), int(KB_PHONES[i].height * .78))), r * clamp(p))
        shadowed(L, sp, (x, y + (1 - p) * 300))
    d = ImageDraw.Draw(L)
    hand_circle(d, 560, 1290, 200, 120, prog(t, 70, 100))
    caption(L, "A 'smart' phone meant tiny plastic keys and a stylus.", t, 40, hl="tiny plastic keys")
    return L

PARTS = [(random.uniform(-1, 1), random.uniform(-1.3, -0.2), random.uniform(-25, 25)) for _ in range(25)]
def scene3(t):  # 11-17s  keys fly off -> glass
    L = layer(); d = ImageDraw.Draw(L)
    d.text((90, 210), "THE BET", font=font("mono", 40), fill=RED + (int(255 * prog(t, 0, 10)),))
    px, py = 120, 470
    morph = eio(prog(t, 30, 60))
    if morph < 1:
        kb = KB_CENTER.copy(); kb.putalpha(kb.split()[3].point(lambda v: int(v * (1 - morph))))
        shadowed(L, kb, (px, py))
    gp = glass_phone(screen_on=prog(t, 50, 80))
    gp.putalpha(gp.split()[3].point(lambda v: int(v * morph)))
    shadowed(L, gp, (px, py), alpha=int(110 * morph))
    # keys fly away
    kp = prog(t, 22, 70)
    if 0 < kp < 1:
        for i, (vx, vy, rr) in enumerate(PARTS):
            col, row = i % 5, i // 5
            x0 = px + 26 + col * 76; y0 = py + 520 + row * 60
            x = x0 + vx * 700 * kp; y = y0 + vy * 900 * kp + 1600 * kp * kp
            k = Image.new("RGBA", (60, 46), (0, 0, 0, 0))
            ImageDraw.Draw(k).rounded_rectangle((0, 0, 59, 45), radius=9, fill=(205, 205, 210, int(255 * (1 - kp))))
            L.alpha_composite(rotate(k, rr * kp * 8), (int(x), int(y)))
    d = ImageDraw.Draw(L)
    labels = [("NO KEYBOARD", 640, 80), ("NO STYLUS", 880, 92), ("MULTI-TOUCH", 1120, 104)]
    lf = font("bold", 46)
    for i, (s_, y, st) in enumerate(labels):
        p = eo(prog(t, st, st + 14))
        if p <= 0: continue
        fx = px + 400; ex = 620
        d.line((fx, y, fx + (ex - fx) * p, y), fill=INK, width=5)
        d.ellipse((fx - 11, y - 11, fx + 11, y + 11), fill=RED)
        if p > .6:
            d.text((ex + 18, y - 30), s_, font=lf, fill=INK + (int(255 * prog(p, .6, 1)),))
    caption(L, "Apple bet everything on one sheet of glass.", t, 100, hl="one sheet of glass")
    return L

def price_tag(price, sub):
    im = Image.new("RGBA", (420, 250), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.polygon([(0, 125), (70, 0), (420, 0), (420, 250), (70, 250)], fill=(250, 248, 243, 255))
    d.ellipse((40, 110, 70, 140), fill=PAPER + (255,), outline=GREY + (255,), width=4)
    d.text((105, 32), price, font=font("disp", 120), fill=INK)
    d.text((110, 175), sub, font=font("mono", 38), fill=GREY)
    return im

TAGS = [price_tag("$499", "4 GB MODEL"), price_tag("$599", "8 GB MODEL")]
def scene4(t):  # 17-22s  launch price
    L = layer(); d = ImageDraw.Draw(L)
    d.text((90, 210), "THE PRICE OF ADMISSION", font=font("mono", 40), fill=RED + (int(255 * prog(t, 0, 10)),))
    for i, (tag, x, y, r) in enumerate([(TAGS[0], 120, 470, -6), (TAGS[1], 480, 820, 5)]):
        p = back(prog(t, 6 + i * 10, 26 + i * 10))
        if p <= 0: continue
        shadowed(L, rotate(tag, r), (x + (1 - p) * (600 if i else -600), y))
    # rubber stamp
    sp = prog(t, 48, 58)
    if sp > 0:
        st = Image.new("RGBA", (760, 200), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
        sd.rounded_rectangle((6, 6, 754, 194), radius=18, outline=RED + (230,), width=10)
        sd.text((40, 26), "ON SALE", font=font("disp", 70), fill=RED + (230,))
        sd.text((44, 112), "JUNE 29, 2007", font=font("mono", 52), fill=RED + (230,))
        sc = 1.6 - 0.6 * eo(sp)
        st = rotate(st.resize((int(760 * sc), int(200 * sc))), -8)
        st.putalpha(st.split()[3].point(lambda v: int(v * clamp(sp * 1.5))))
        L.alpha_composite(st, (int(W / 2 - st.width / 2), int(1230 - st.height / 2)))
    caption(L, "Launch price, with a two-year carrier contract.", t, 70, y=1560, hl="two-year")
    return L

def scene5(t):  # 22-27s  one billion
    L = layer(); d = ImageDraw.Draw(L)
    d.text((90, 210), "THE PAYOFF", font=font("mono", 40), fill=RED + (int(255 * prog(t, 0, 10)),))
    # timeline axis
    x0, x1, yax = 120, 960, 1080
    p = eio(prog(t, 4, 40))
    d.line((x0, yax, x0 + (x1 - x0) * p, yax), fill=INK, width=8)
    for yr, k in [("2007", 0), ("2016", 1)]:
        if p >= k * .98:
            x = x0 + (x1 - x0) * k
            d.ellipse((x - 22, yax - 22, x + 22, yax + 22), fill=RED if k else INK)
            d.text((x - 70, yax + 40), yr, font=font("disp", 64), fill=INK)
    # count-up
    cp = eo(prog(t, 10, 70))
    n = int(1_000_000_000 * cp ** 1.6)
    s = f"{n:,}"
    big = font("disp", 118)
    tw = text_w(d, s, big)
    if cp >= 1: highlight(d, (W / 2 - tw / 2, 600, W / 2 + tw / 2, 735), prog(t, 72, 90))
    d.text((W / 2 - tw / 2, 600), s, font=big, fill=INK)
    lab = "iPHONES SOLD"
    d.text((W / 2 - text_w(d, lab, font("mono", 48)) / 2, 790), lab, font=font("mono", 48), fill=GREY)
    caption(L, "Nine years later, Apple sold its billionth iPhone.", t, 60, y=1500, hl="billionth")
    return L

def scene6(t):  # 27-30s  end card
    L = layer(); d = ImageDraw.Draw(L)
    big = font("disp", 112)
    for i, ln in enumerate(["One sheet", "of glass."]):
        p = back(prog(t, i * 5, 16 + i * 5))
        d.text((90, 560 + i * 140 + (1 - clamp(p)) * 50), ln, font=big, fill=INK + (int(255 * clamp(p)),))
    p = prog(t, 18, 34)
    ln = "A new industry."
    highlight(d, (90, 860, 90 + text_w(d, ln, big), 990), p)
    d.text((90, 850), ln, font=big, fill=INK + (int(255 * clamp(p * 2)),))
    a = int(255 * prog(t, 34, 48))
    d.text((90, 1150), "NEXT EPISODE", font=font("mono", 38), fill=RED + (a,))
    d.text((90, 1205), "The day Netflix bet against its own DVDs", font=font("serifi", 50), fill=INK + (a,))
    d.text((90, 1720), "Source: Apple Newsroom, July 27, 2016", font=font("mono", 26), fill=GREY + (a,))
    return L

# (start_frame, end_frame, fn) — scenes overlap 10 frames for push-through transitions
SCENES = [(0, 150, scene1), (150, 330, scene2), (330, 510, scene3), (510, 660, scene4), (660, 810, scene5), (810, 900, scene6)]
XF = 10

def render(f):
    frame = background(f).convert("RGBA")
    for s, e, fn in SCENES:
        if not (s - XF <= f < e + (XF if e < TOTAL else 0)): continue
        t = f - s
        dur = e - s
        scale = 1.0 + 0.07 * clamp(t / dur)                 # constant forward drift
        alpha = 1.0
        if t < 0:                                            # arriving from behind
            k = (t + XF) / XF; scale *= 0.88 + 0.12 * eo(k); alpha = k
        if f >= e:                                           # pushing through the camera
            k = (f - e + 1) / XF; scale *= 1 + 0.9 * k * k; alpha = 1 - k
        lay = fn(max(t, 0))
        frame.alpha_composite(camera(lay, scale, alpha))
    # film grain + subtle flicker
    g = GRAIN[f % len(GRAIN)]
    frame = Image.blend(frame.convert("RGB"), Image.merge("RGB", (g, g, g)), 0.045)
    return frame

# ---------- soundtrack (synthesised: pad + pulse + whooshes + typing) ----------
def soundtrack(path):
    sr = 44100; n = TOTAL * sr // FPS; t = np.arange(n) / sr
    out = np.zeros(n)
    chords = [[110, 164.8, 220, 277.2], [98, 146.8, 196, 246.9], [87.3, 130.8, 174.6, 220], [98, 146.8, 196, 293.7]]
    seg = n // 4
    for i, ch in enumerate(chords):
        a, b = i * seg, (i + 1) * seg if i < 3 else n
        tt = t[a:b] - t[a]
        env = np.minimum(1, tt / 1.5) * np.minimum(1, (tt[-1] - tt + 1e-3) / 1.5)
        for fr in ch:
            out[a:b] += 0.05 * np.sin(2 * np.pi * fr * tt) * env + 0.02 * np.sin(2 * np.pi * fr * 2.003 * tt) * env
    # soft pulse every half second after intro
    for k in np.arange(2.0, 29.5, 0.5):
        a = int(k * sr); L_ = int(0.18 * sr)
        if a + L_ > n: break
        tt = np.arange(L_) / sr
        out[a:a + L_] += 0.22 * np.sin(2 * np.pi * (55 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 18)
    # whooshes at scene transitions
    for s, e, _ in SCENES[1:]:
        c = int(s / FPS * sr); L_ = int(0.6 * sr); a = max(0, c - L_ // 2)
        nz = np.random.randn(L_)
        sw = np.convolve(nz, np.ones(12) / 12, mode="same")
        env = np.sin(np.linspace(0, np.pi, L_)) ** 2
        out[a:a + L_] += 0.18 * sw[: min(L_, n - a)] * env[: min(L_, n - a)]
    # typing clicks on the date
    for i in range(15):
        a = int((8 + i * 26 / 15) / FPS * sr)
        L_ = int(0.02 * sr)
        out[a:a + L_] += 0.25 * np.random.randn(L_) * np.exp(-np.arange(L_) / 120)
    # stamp thud
    a = int((510 + 50) / FPS * sr); L_ = int(0.3 * sr); tt = np.arange(L_) / sr
    out[a:a + L_] += 0.5 * np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 14)
    out = np.tanh(out * 1.4) * 0.8
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((out * 32767).astype(np.int16).tobytes())

if __name__ == "__main__":
    only = [int(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 else None
    if only:
        for f in only: render(f).save(f"/home/claude/vox/preview_{f:03d}.png")
        sys.exit()
    soundtrack("/home/claude/vox/music.wav")
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-i", "/home/claude/vox/music.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
                          "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
    for f in range(TOTAL):
        p.stdin.write(render(f).tobytes())
        if f % 150 == 0: print("frame", f, flush=True)
    p.stdin.close(); p.wait()
    print("done", OUT)

"""Vox-style 30s Short v2 - 'The day the phone lost its keyboard' (iPhone, 2007).
Re-uses the engine in render.py. Real photos drop into PHOTO_DIR as rivals.jpg / macworld.jpg / queue.jpg
(+ credits.csv). Any missing photo falls back to the drawn illustration."""
import os, sys, glob, csv, math, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import render as R
from render import (W, H, FPS, TOTAL, INK, RED, YELLOW, GREY, PAPER, font, clamp, prog, eo, eio, back,
                    layer, shadowed, text_w, highlight, wrap, rotate)

HERE = os.path.dirname(os.path.abspath(__file__))
PHOTO_DIR = os.environ.get("PHOTO_DIR", os.path.join(HERE, "photos"))

# ---------------------------------------------------------------- photo system
_cache = {}
def load_photo(key):
    if key in _cache: return _cache[key]
    im = None
    for p in sorted(glob.glob(os.path.join(PHOTO_DIR, key + ".*"))):
        if p.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            im = Image.open(p).convert("RGB"); im.thumbnail((2200, 2200)); break
    _cache[key] = im
    return im

def credit_for(key):
    f = os.path.join(PHOTO_DIR, "credits.csv")
    if os.path.exists(f):
        for row in csv.reader(open(f, encoding="utf-8")):
            if row and row[0].strip() == key and len(row) > 1: return row[1].strip()
    return ""

def photo_print(key, w, h, t, rot=0.0):
    """Paper print: Ken Burns push-in, white border, tape, credit strip. None if photo missing."""
    im = load_photo(key)
    if im is None: return None
    iw, ih = im.size
    z = 1.0 + 0.12 * clamp(t / 150)
    s = max(w / iw, h / ih) * z
    rs = im.resize((max(w, int(iw * s)), max(h, int(ih * s))), Image.BILINEAR)
    x0 = (rs.width - w) // 2; y0 = (rs.height - h) // 2
    pic = rs.crop((x0, y0, x0 + w, y0 + h))
    b, strip, pad = 18, 52, 50
    card = Image.new("RGBA", (w + 2 * b + 2 * pad, h + 2 * b + strip + 2 * pad), (0, 0, 0, 0))
    paper = Image.new("RGBA", (w + 2 * b, h + 2 * b + strip), (250, 248, 243, 255))
    paper.paste(pic, (b, b))
    pd = ImageDraw.Draw(paper); cf = font("mono", 21)
    cr = credit_for(key)
    while cr and text_w(pd, cr, cf) > w and len(cr) > 8: cr = cr[:-2]
    pd.text((b, h + b + 14), cr, font=cf, fill=GREY)
    card.alpha_composite(paper, (pad, pad))
    for cx, cy, ang in [(pad + 30, pad + 6, 28), (pad + w + 2 * b - 30, pad + 6, -28)]:
        tp = Image.new("RGBA", (170, 50), (255, 236, 170, 205)).rotate(ang, expand=True, resample=Image.BICUBIC)
        card.alpha_composite(tp, (int(cx - tp.width / 2), int(cy - tp.height / 2)))
    return rotate(card, rot) if rot else card

def place(L, sprite, cx, top, p, dy=600):
    shadowed(L, sprite, (cx - sprite.width / 2, top + (1 - clamp(p)) * dy))

# ---------------------------------------------------------------- helpers
def hdr(d, txt, t):
    d.text((90, 210), txt, font=font("mono", 40), fill=RED + (int(255 * prog(t, 0, 10)),))

def src(L, txt, t, start=10):
    ImageDraw.Draw(L).text((90, 1855), txt, font=font("mono", 24), fill=GREY + (int(255 * prog(t, start, start + 12)),))

def kb_small(i, sc=0.7):
    k = R.KB_PHONES[i]
    return k.resize((int(k.width * sc), int(k.height * sc)))

# ---------------------------------------------------------------- scenes
def s1(t):  # title (re-uses v1 scene, time-compressed)
    return R.scene1(int(t * 1.45))

def s2(t):  # Q4 2006 market
    L = layer(); d = ImageDraw.Draw(L)
    hdr(d, "THE STATUS QUO  ·  Q4 2006", t)
    big = font("disp", 150)
    tw = text_w(d, "22,000,000", big)
    hp = prog(t, 52, 72)
    if hp > 0: highlight(d, (90, 292, 90 + tw, 428), hp)
    n = int(22_000_000 * eo(prog(t, 6, 50)))
    d.text((90, 270), f"{n:,}", font=big, fill=INK)
    d.text((92, 452), "SMARTPHONES SOLD WORLDWIDE IN ONE QUARTER", font=font("mono", 31), fill=GREY + (int(255 * prog(t, 20, 34)),))
    bx0, bx1, by, bh = 90, 990, 565, 84
    d.rectangle((bx0, by, bx0 + 450 * eo(prog(t, 36, 70)), by + bh), fill=INK)
    d.rectangle((bx0, by, bx1, by + bh), outline=INK, width=5)
    if t > 62: d.text((bx0 + 22, by + 15), "NOKIA ≈ HALF", font=font("bold", 44), fill=PAPER + (int(255 * prog(t, 62, 72)),))
    if t > 72: d.text((bx0, by + bh + 22), "RIM · MOTOROLA · PALM · SONY ERICSSON", font=font("mono", 29), fill=GREY + (int(255 * prog(t, 72, 84)),))
    pp = photo_print("rivals", 900, 520, t, rot=-2)
    if pp:
        place(L, pp, 540, 800, back(prog(t, 24, 44)), 500)
    else:
        for i, (x, y, r) in enumerate([(70, 850, -8), (380, 820, 5), (690, 870, 9)]):
            p = back(prog(t, 28 + i * 8, 46 + i * 8))
            if p > 0: shadowed(L, rotate(kb_small(i), r * clamp(p)), (x, y + (1 - p) * 420))
    R.caption(L, "BlackBerry, Treo, Motorola Q, Nokia E62: all built around a keyboard.", t, 70, y=1500, hl="built around a keyboard")
    src(L, "Source: Canalys via AppleInsider; Macworld 2007 keynote", t)
    return L

LABELS = [("NO KEYBOARD", 640, 55), ("NO STYLUS", 880, 66), ("MULTI-TOUCH", 1120, 77)]
def s3(t):  # the bet + the 1% goal
    L = layer(); d = ImageDraw.Draw(L)
    hdr(d, "THE BET  ·  MACWORLD, JAN 9, 2007", t)
    ph = photo_print("macworld", 900, 600, t, rot=1.5)
    if ph:
        place(L, ph, 540, 330, back(prog(t, 6, 26)), 700)
        d = ImageDraw.Draw(L)
        for i, (s_, _, st) in enumerate(LABELS):
            y = 1090 + i * 100; p = eo(prog(t, st - 20, st - 8))
            d.ellipse((100, y + 20, 124, y + 44), fill=RED + (int(255 * p),))
            d.text((150, y), s_, font=font("bold", 56), fill=INK + (int(255 * p),))
    else:
        px, py = 120, 470
        morph = eio(prog(t, 20, 48))
        if morph < 1:
            kb = R.KB_CENTER.copy(); kb.putalpha(kb.split()[3].point(lambda v: int(v * (1 - morph))))
            shadowed(L, kb, (px, py))
        gp = R.glass_phone(screen_on=prog(t, 38, 66))
        gp.putalpha(gp.split()[3].point(lambda v: int(v * morph)))
        shadowed(L, gp, (px, py), alpha=int(110 * morph))
        kp = prog(t, 14, 56)
        if 0 < kp < 1:
            for i, (vx, vy, rr) in enumerate(R.PARTS):
                col, row = i % 5, i // 5
                x = px + 26 + col * 76 + vx * 700 * kp; y = py + 520 + row * 60 + vy * 900 * kp + 1600 * kp * kp
                k = Image.new("RGBA", (60, 46), (0, 0, 0, 0))
                ImageDraw.Draw(k).rounded_rectangle((0, 0, 59, 45), radius=9, fill=(205, 205, 210, int(255 * (1 - kp))))
                L.alpha_composite(rotate(k, rr * kp * 8), (int(x), int(y)))
        d = ImageDraw.Draw(L); lf = font("bold", 46)
        for s_, y, st in LABELS:
            p = eo(prog(t, st, st + 12))
            if p <= 0: continue
            fx, ex = px + 400, 620
            d.line((fx, y, fx + (ex - fx) * p, y), fill=INK, width=5)
            d.ellipse((fx - 11, y - 11, fx + 11, y + 11), fill=RED)
            if p > .6: d.text((ex + 18, y - 30), s_, font=lf, fill=INK + (int(255 * prog(p, .6, 1)),))
    R.caption(L, "The goal: 1% of the market. Ten million phones in 2008.", t, 90, y=1500, hl="1% of the market")
    src(L, "Source: Macworld 2007 keynote (Jan 9, 2007)", t)
    return L

def stamp(L, t, cy, end_sc):
    sp = prog(t, 48, 58)
    if sp <= 0: return
    st = Image.new("RGBA", (760, 200), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    sd.rounded_rectangle((6, 6, 754, 194), radius=18, outline=RED + (230,), width=10)
    sd.text((40, 26), "ON SALE", font=font("disp", 70), fill=RED + (230,))
    sd.text((44, 112), "JUNE 29, 2007", font=font("mono", 52), fill=RED + (230,))
    sc = end_sc * (1.6 - 0.6 * eo(sp))
    st = rotate(st.resize((int(760 * sc), int(200 * sc))), -8)
    st.putalpha(st.split()[3].point(lambda v: int(v * clamp(sp * 1.5))))
    L.alpha_composite(st, (int(W / 2 - st.width / 2), int(cy - st.height / 2)))

def s4(t):  # launch
    L = layer(); d = ImageDraw.Draw(L)
    hdr(d, "THE LAUNCH  ·  $499 AND $599", t)
    pp = photo_print("queue", 900, 520, t, rot=-1.5)
    if pp:
        place(L, pp, 540, 300, back(prog(t, 4, 24)), 700)
        specs = [(R.TAGS[0], 90, 985, -6), (R.TAGS[1], 560, 1040, 5)]; sc = .8; cy, esc = 1360, .72; ty = 1445
    else:
        specs = [(R.TAGS[0], 120, 470, -6), (R.TAGS[1], 480, 820, 5)]; sc = 1.0; cy, esc = 1250, 1.0; ty = 1385
    for i, (tag, x, y, r) in enumerate(specs):
        p = back(prog(t, 8 + i * 10, 28 + i * 10))
        if p <= 0: continue
        tg = tag if sc == 1.0 else tag.resize((int(tag.width * sc), int(tag.height * sc)))
        shadowed(L, rotate(tg, r), (x + (1 - p) * (600 if i else -600), y))
    stamp(L, t, cy, esc)
    d = ImageDraw.Draw(L)
    cp = eo(prog(t, 70, 112)); n = int(270_000 * cp); big = font("disp", 100)
    tw = text_w(d, "270,000", big)
    if cp >= 1: highlight(d, (90, ty + 16, 90 + tw, ty + 118), prog(t, 114, 130))
    d.text((90, ty), f"{n:,}", font=big, fill=INK + (int(255 * prog(t, 68, 78)),))
    d.text((90 + tw + 30, ty + 52), "iPHONES, FIRST WEEKEND", font=font("mono", 28), fill=GREY + (int(255 * prog(t, 72, 84)),))
    R.caption(L, "Both models required a two-year AT&T contract.", t, 40, y=1580, hl="two-year AT&T contract")
    src(L, "Source: Apple, July 2007; CNET; TechCrunch", t)
    return L

def quote_layer(t):
    L = layer(); d = ImageDraw.Draw(L)
    hdr(d, "THE DOUBTERS  ·  APRIL 2007", t)
    qf = font("serifi", 72)
    lines = wrap(d, "There's no chance that the iPhone is going to get any significant market share.", qf, 800)
    lh = 96; ch = lh * len(lines) + 360
    card = Image.new("RGBA", (960, ch), (250, 248, 243, 255)); cd = ImageDraw.Draw(card)
    cd.text((44, 4), "“", font=font("disp", 280), fill=RED + (255,))
    for i, ln in enumerate(lines): cd.text((80, 200 + i * lh), ln, font=qf, fill=INK)
    ay = 200 + lh * len(lines) + 34
    cd.text((80, ay), "— STEVE BALLMER, MICROSOFT CEO", font=font("mono", 31), fill=INK)
    cd.text((80, ay + 48), "USA TODAY, APRIL 2007", font=font("mono", 27), fill=GREY)
    p = back(prog(t, 4, 26))
    shadowed(L, rotate(card, -2 * clamp(p)), ((W - card.width) / 2 - 10, 420 + (1 - clamp(p)) * 800))
    src(L, "Source: USA Today (Apr 2007), as reported by AppleInsider", t)
    return L

def days_layer(t):
    L = layer(); d = ImageDraw.Draw(L)
    hdr(d, "THE SLOW BURN", t)
    big = font("disp", 200); p = back(prog(t, 0, 14))
    tw = text_w(d, "74 DAYS", big)
    hp = prog(t, 20, 40)
    if hp > 0: highlight(d, (90, 350 + 20, 90 + tw, 350 + 200), hp)
    d.text((90, 330 + (1 - clamp(p)) * 60), "74 DAYS", font=big, fill=INK + (int(255 * clamp(p)),))
    d.text((92, 600), "JUNE 29  →  SEPT 10, 2007", font=font("mono", 38), fill=GREY + (int(255 * prog(t, 10, 24)),))
    cp = eo(prog(t, 14, 60)); n = int(1_000_000 * cp)
    bx0, bx1, by, bh = 90, 990, 760, 70
    d.rectangle((bx0, by, bx0 + (bx1 - bx0) * cp, by + bh), fill=YELLOW)
    d.rectangle((bx0, by, bx1, by + bh), outline=INK, width=5)
    d.text((90, 860), f"{n:,}", font=font("disp", 110), fill=INK)
    d.text((92, 1000), "FIRST-GENERATION iPHONES SOLD", font=font("mono", 34), fill=GREY)
    R.caption(L, "Some analysts called it a slow start.", t, 40, y=1280, hl="a slow start")
    src(L, "Source: Apple; Daring Fireball (Sept 10, 2007)", t)
    return L

def s5(t):  # doubters -> slow burn
    L = layer()
    if t < 86:
        L.alpha_composite(R.camera(quote_layer(t), 1 + 0.15 * eo(prog(t, 66, 84)), 1 - prog(t, 66, 84)))
    if t >= 76:
        L.alpha_composite(R.camera(days_layer(t - 76), 1.0, prog(t, 76, 90)))
    return L

def s6(t): return R.scene5(int(t * 1.45))   # one billion
def s7(t): return R.scene6(int(t * 1.2))    # end card

SCENES = [(0, 105, s1), (105, 255, s2), (255, 405, s3), (405, 555, s4), (555, 720, s5), (720, 825, s6), (825, 900, s7)]
R.SCENES = SCENES

# ---------------------------------------------------------------- audio (cues re-timed)
def soundtrack(path):
    sr = 44100; n = TOTAL * sr // FPS; t = np.arange(n) / sr
    rng = np.random.RandomState(3)
    out = np.zeros(n)
    chords = [[110, 164.8, 220, 277.2], [98, 146.8, 196, 246.9], [87.3, 130.8, 174.6, 220], [98, 146.8, 196, 293.7]]
    seg = n // 4
    for i, ch in enumerate(chords):
        a, b = i * seg, ((i + 1) * seg if i < 3 else n)
        tt = t[a:b] - t[a]
        env = np.minimum(1, tt / 1.5) * np.minimum(1, (tt[-1] - tt + 1e-3) / 1.5)
        for fr in ch:
            out[a:b] += 0.05 * np.sin(2 * np.pi * fr * tt) * env + 0.02 * np.sin(2 * np.pi * fr * 2.003 * tt) * env
    for k in np.arange(2.0, 29.5, 0.5):
        a = int(k * sr); L_ = int(0.18 * sr)
        if a + L_ > n: break
        tt = np.arange(L_) / sr
        out[a:a + L_] += 0.2 * np.sin(2 * np.pi * (55 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 18)
    for s, e, _ in SCENES[1:]:
        c = int(s / FPS * sr); L_ = int(0.6 * sr); a = max(0, c - L_ // 2)
        m = min(L_, n - a)
        sw = np.convolve(rng.randn(L_), np.ones(12) / 12, mode="same")
        out[a:a + m] += 0.18 * sw[:m] * (np.sin(np.linspace(0, np.pi, L_)) ** 2)[:m]
    for i in range(14):                                   # typing clicks on the date (scene 1)
        a = int((6 + i * 20 / 14) / FPS * sr); L_ = int(0.02 * sr)
        out[a:a + L_] += 0.25 * rng.randn(L_) * np.exp(-np.arange(L_) / 120)
    for fr in (405 + 52, 555 + 8):                        # stamp thud, quote-card slap
        a = int(fr / FPS * sr); L_ = int(0.3 * sr); tt = np.arange(L_) / sr
        out[a:a + L_] += 0.5 * np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 14)
    out = np.tanh(out * 1.4) * 0.8
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((out * 32767).astype(np.int16).tobytes())

if __name__ == "__main__":
    out = sys.argv[1]
    if len(sys.argv) > 2:
        for f in [int(x) for x in sys.argv[2].split(",")]: R.render(f).save(f"{out}_{f:03d}.png")
        sys.exit()
    wav = os.path.join(HERE, "music2.wav"); soundtrack(wav)
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-i", wav, "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
                          "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    for f in range(TOTAL):
        p.stdin.write(R.render(f).tobytes())
        if f % 150 == 0: print("frame", f, flush=True)
    p.stdin.close(); p.wait(); print("done", out)

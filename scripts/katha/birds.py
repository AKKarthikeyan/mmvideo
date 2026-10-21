#!/usr/bin/env python3
"""Flying birds for the Katha kit, drawn in code for this channel.

A white stork, a greater flamingo and a rose-ringed parakeet are each built here from simple 3D geometry written by
hand: a lofted body, neck, head and bill, trailing legs, a tail, and two wings hinged at the shoulder with an elbow, a
wrist and a fan of primary feathers. One wingbeat is animated, every frame is projected orthographically through one
fixed camera (from the ground, a little below and ahead of the bird), rasterised at high resolution with
anti-aliasing, and traced to an SVG path with potrace. The birds owe nothing to any outside model, image or tracing:
no file is read and nothing is downloaded, and there is no randomness, so a run always gives the same output.

  python3 scripts/katha/birds.py [stork|flamingo|parrot|all] [--sheet DIR]

writes src/katha/sil/<bird>.json (the shape src/katha/sil.tsx reads: "frames" are SVG paths, nonzero fill, facing
right, y down, origin at the body centre). --sheet DIR also writes a contact sheet of every traced frame to DIR as
SVG, and as PNG when headless Chromium is found (KATHA_CHROMIUM or /opt/pw-browsers/chromium).
Needs numpy, Pillow and potracer (pip install potracer; it is GPL, a tool here: its output is ours)."""
import json, math, os, pathlib, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import potrace

ROOT = pathlib.Path(__file__).resolve().parents[2]
SIL = ROOT / "src" / "katha" / "sil"
TAU = 2 * math.pi
rad = math.radians


# ---------------------------------------------------------------- small 3D helpers (x forward, y left, z up)
def Rx(a):
    c, s = math.cos(a), math.sin(a); return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])
def Ry(a):
    c, s = math.cos(a), math.sin(a); return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])
def Rz(a):
    c, s = math.cos(a), math.sin(a); return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
def unit(v):
    v = np.asarray(v, float); return v / np.linalg.norm(v)

def curve(pts, n=8):
    """A smooth (Catmull-Rom) curve through the points, n samples per span; returns the samples and their parameter
    0..len(pts)-1 so radii given per point can be interpolated along it."""
    P = np.asarray(pts, float); k = len(P)
    if k == 2: t = np.linspace(0, 1, n + 1); return P[0] + (P[1] - P[0]) * t[:, None], t
    Q = np.vstack([2 * P[0] - P[1], P, 2 * P[-1] - P[-2]]); out, par = [], []
    for i in range(k - 1):
        p0, p1, p2, p3 = Q[i], Q[i + 1], Q[i + 2], Q[i + 3]
        for t in np.linspace(0, 1, n, endpoint=False):
            out.append(0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t ** 3))
            par.append(i + t)
    out.append(P[-1]); par.append(k - 1)
    return np.array(out), np.array(par)


class Shape:
    """A bird as a bag of convex solids (drawn as the convex hull of their projection, which is exact for a convex
    piece) and thin sheets (wing panels and feathers, drawn as polygons with a minimum thickness)."""
    def __init__(self): self.solids, self.sheets = [], []

    def tube(self, pts, r, rz=None, n=8, ring=18, caps=True):
        """A tube along a smooth spine, radius r per spine point (rz: a different vertical radius for an oval
        section). Each span between two rings is convex, so the union of their hulls is the tube's silhouette."""
        C, par = curve(pts, n); idx = np.arange(len(pts))
        ry = np.interp(par, idx, r); rzz = np.interp(par, idx, rz if rz is not None else r)
        a = np.linspace(0, TAU, ring, endpoint=False); rings = []
        for i, p in enumerate(C):
            t = unit(C[min(i + 1, len(C) - 1)] - C[max(i - 1, 0)])
            b1 = np.cross(t, [0, 0, 1.0]); b1 = unit(b1) if np.linalg.norm(b1) > 1e-6 else np.array([0, 1.0, 0])
            b2 = np.cross(b1, t)
            rings.append(p + np.outer(np.cos(a) * ry[i], b1) + np.outer(np.sin(a) * rzz[i], b2))
        for i in range(len(rings) - 1): self.solids.append(np.vstack([rings[i], rings[i + 1]]))
        if caps:
            for i in (0, -1):
                if min(ry[i], rzz[i]) > 0.35: self.ball(C[i], ry[i], rzz[i])

    def ball(self, c, r, rz=None, n=10):
        th, ph = np.meshgrid(np.linspace(0, math.pi, n), np.linspace(0, TAU, 2 * n, endpoint=False))
        rz = r if rz is None else rz
        self.solids.append(np.asarray(c, float) + np.stack([r * np.sin(th) * np.cos(ph), r * np.sin(th) * np.sin(ph), rz * np.cos(th)], -1).reshape(-1, 3))

    def sheet(self, pts, thick=0.8): self.sheets.append((np.asarray(pts, float), thick))

    def moved(self, f):
        out = Shape(); out.solids = [f(S) for S in self.solids]; out.sheets = [(f(P), t) for P, t in self.sheets]; return out


# ---------------------------------------------------------------- the wingbeat
def warp(ph, down):
    """Stroke clock u: 0 -> 1/2 over the downstroke (0 <= ph < down), 1/2 -> 1 over the upstroke, smooth and periodic,
    so a longer `down` gives a slower, more deliberate downstroke and a quicker recovery."""
    k = (down - 0.5) / ((1 - math.cos(TAU * down)) / 2)
    return ph - k * (1 - math.cos(TAU * ph)) / 2

def bump(ph, centre, half):
    d = (ph - centre + 0.5) % 1 - 0.5
    return math.cos(math.pi * d / (2 * half)) ** 2 if abs(d) < half else 0.0

def beat(ph, m):
    """The pose at phase ph (0 = wings at the top, about to sweep down). m: the bird's motion settings."""
    u = warp(ph, m["down"]); c, s = math.cos(TAU * u), math.sin(TAU * u)
    up = 1 - m["down"]
    return dict(
        elev=rad((m["top"] + m["bottom"]) / 2 + (m["top"] - m["bottom"]) / 2 * c),
        fold=bump(ph, m["down"] + up * 0.48, up * 0.5),        # the wrist flexes on the upstroke, opens again at the top
        hand=rad(m["hand"] * s + m.get("hand0", 0)),             # the hand lags the arm: tips up going down, down going up
        sweep=rad(-m["reach"] * s),                              # the wing reaches a little forward on the downstroke
        lift=-m["bob"] * c,                                      # the body rises on the downstroke, settles on the upstroke
        load=max(0.0, s) ** 1.5,                                 # air pressure on the primaries (they curl up under it)
    )


# ---------------------------------------------------------------- a wing
def wing(sh, W, pose):
    """Both wings. W: the bird's wing spec (built as the left wing, outward = +y, then mirrored for the right)."""
    f, e = pose["fold"], pose["elev"]
    S = np.array(W["shoulder"], float)
    R0 = Rx(e) @ Rz(rad(W["sweep"][0] + W["fold_sweep"][0] * f) + pose["sweep"])
    E = S + R0 @ [0, W["len"][0], 0]
    R1 = R0 @ Rz(rad(W["sweep"][1] + W["fold_sweep"][1] * f)) @ Rx(pose["hand"] * W.get("elbow_share", 0.25))
    Wr = E + R1 @ [0, W["len"][1], 0]
    R2 = R1 @ Rz(rad(W["sweep"][2] + W["fold_sweep"][2] * f)) @ Rx(pose["hand"])
    T = Wr + R2 @ [0, W["len"][2], 0]
    bones = [(S, R0, W["len"][0]), (E, R1, W["len"][1]), (Wr, R2, W["len"][2])]
    # leading and trailing edge, station by station along humerus, forearm and hand
    LE, TE = [], []
    for (o, R, L), st in zip(bones, W["stations"]):
        for t, lead, trail in st:
            LE.append(o + R @ [lead, t * L, 0]); TE.append(o + R @ [-trail, t * L, 0])
    parts = []
    for i in range(len(LE) - 1): parts.append(("sheet", np.array([LE[i], LE[i + 1], TE[i + 1], TE[i]]), W.get("thick", 1.0)))
    # the arm and hand bones and the coverts over them give the wing its thickness when it is seen edge-on
    parts.append(("tube", [S, E, Wr, T], W["bone_r"]))
    # primaries: a fan from the hand, closing up as the wrist flexes; their tips curl up under load
    P = W["primaries"]; k = len(P["angle"]); fan = 1 - P.get("close", 0.55) * f
    mean = float(np.mean(P["angle"]))
    for j in range(k):
        a = rad(mean + (P["angle"][j] - mean) * fan)
        root = Wr + R2 @ [P.get("root_x", -0.5), P["root_t"][j] * W["len"][2], 0]
        d = R2 @ [-math.sin(a), math.cos(a), 0]; side = R2 @ [math.cos(a), math.sin(a), 0]; nrm = R2 @ [0, 0, 1.0]
        L, w = P["length"][j], P["width"][j]; prof = P["profile"][j] if isinstance(P["profile"][0], list) else P["profile"]
        us = np.linspace(0, 1, len(prof)); curl = P.get("curl", 0) * pose["load"] + P.get("curl0", 0)
        ctr = [root + d * L * u + nrm * curl * L * u * u for u in us]
        left = [c + side * w / 2 * q for c, q in zip(ctr, prof)]; right = [c - side * w / 2 * q for c, q in zip(ctr, prof)]
        parts.append(("sheet", np.array(left + right[::-1]), P.get("thick", 0.7)))
    for mirror in (1, -1):
        M = np.array([1, mirror, 1.0])
        for kind, pts, extra in parts:
            if kind == "sheet": sh.sheet(np.asarray(pts) * M, extra)
            else: sh.tube([np.asarray(p) * M for p in pts], extra, n=4, ring=14)


# ---------------------------------------------------------------- the birds
def stork(ph):
    """White / painted stork: neck straight out, long straight heavy bill, legs trailing well past a short tail, broad
    rectangular wings ending in splayed fingers."""
    m = dict(down=0.58, top=34, bottom=-12, hand=16, hand0=4, reach=5, bob=1.6)
    p = beat(ph, m); sh = Shape()
    # body: a deep oval, slightly arched
    sh.tube([(-30, 0, 2.5), (-22, 0, 1.6), (-10, 0, 0.4), (2, 0, 0), (13, 0, 0.4), (21, 0, 1.0)], r=[3.2, 8.2, 11.4, 12.0, 10.4, 7.0], rz=[3.0, 7.0, 10.0, 10.8, 9.4, 6.6])
    # neck held straight forward, a little below the line of the back; head; bill
    sh.tube([(18, 0, 1.6), (32, 0, 0.2), (46, 0, -1.6), (57, 0, -2.8)], r=[6.4, 4.4, 3.7, 3.7])
    sh.tube([(54, 0, -2.6), (58.5, 0, -2.5), (63, 0, -3.2), (66, 0, -3.8)], r=[4.0, 4.7, 4.0, 3.0], rz=[4.0, 4.9, 4.2, 3.2])
    sh.tube([(64, 0, -3.6), (76, 0, -5.4), (88.5, 0, -7.4)], r=[2.2, 1.4, 0.3], rz=[3.0, 2.0, 0.4], n=6)
    # short rounded tail, with a little thickness
    sh.sheet([(-22, 7, 2.6), (-33, 9.5, 2.4), (-40, 7.5, 2.0), (-44, 3.2, 1.8), (-44.5, 0, 1.8), (-44, -3.2, 1.8), (-40, -7.5, 2.0), (-33, -9.5, 2.4), (-22, -7, 2.6)], 2.4)
    # legs: thighs under the belly, then shank and foot trailing straight back, the toes a little splayed
    for y in (3.4, -3.4):
        sh.tube([(-6, y * 1.2, -6.5), (-17, y, -8.5)], r=[3.8, 2.4], n=3)
        sh.tube([(-17, y, -8.5), (-47, y * 0.85, -10.6), (-81, y * 0.75, -12.6)], r=[2.1, 1.9, 1.6], n=5)
        sh.ball((-47, y * 0.85, -10.6), 2.1)
        for dy, dz, L in ((0.0, -0.4, 8.0), (1.6, 0.6, 6.5), (-1.6, -1.3, 6.8)):
            sh.tube([(-81, y * 0.75, -12.6), (-81 - L, y * 0.75 + dy * np.sign(y), -12.6 + dz)], r=[1.4, 0.75], n=2)
    wing(sh, dict(
        shoulder=(8, 6.5, 4.5), len=(21, 31, 14), sweep=(8, -12, 4), fold_sweep=(16, -46, 62), elbow_share=0.3,
        stations=[[(0, 7, 21), (0.5, 6, 30), (1, 4.6, 33)], [(0, 4.6, 33), (0.4, 3.6, 34.5), (0.75, 3.0, 34), (1, 2.6, 33)], [(0, 2.6, 30), (1, 1.6, 14)]],
        bone_r=[3.8, 2.8, 2.0, 1.2], thick=1.2,
        primaries=dict(
            angle=[-5, 3, 11, 19, 28, 37, 48, 60, 72], root_t=[1.0, 0.92, 0.8, 0.66, 0.52, 0.38, 0.24, 0.1, 0.0],
            length=[27, 33, 35, 34, 32, 30.5, 30, 30, 30.5], width=[5.6, 6.4, 6.8, 7.0, 7.2, 7.6, 9, 10, 11],
            profile=[1, 1, 1, 0.95, 0.62, 0.5, 0.4, 0], curl=0.16, curl0=0.03, close=0.6, thick=0.8),
    ), p)
    return sh, p["lift"]


def flamingo(ph):
    """Greater flamingo: very long thin neck held out and drooping a little, the bill bent down, very long thin legs
    trailing straight behind, a slim body, narrower pointed wings."""
    m = dict(down=0.57, top=36, bottom=-14, hand=14, hand0=2, reach=4, bob=1.4)
    p = beat(ph, m); sh = Shape()
    sh.tube([(-22, 0, 1.5), (-14, 0, 0.8), (-3, 0, 0), (8, 0, 0.2), (16, 0, 0.8)], r=[3.0, 6.8, 8.4, 7.6, 4.8], rz=[2.6, 6.0, 7.6, 7.0, 4.4])
    sh.tube([(13, 0, 1.0), (30, 0, 0.6), (48, 0, -1.6), (64, 0, -4.6), (74, 0, -6.6)], r=[4.2, 2.7, 2.3, 2.2, 2.3], n=10)
    sh.tube([(72.5, 0, -6.3), (75.5, 0, -6.0), (78.5, 0, -6.6)], r=[3.0, 3.4, 2.8], n=4)
    # the bill: deep at the base, straight for half its length, then bent sharply down
    sh.tube([(78, 0, -6.4), (83.5, 0, -7.4), (87.0, 0, -9.6), (88.6, 0, -13.4)], r=[2.0, 1.7, 1.1, 0.35], rz=[2.7, 2.1, 1.4, 0.4], n=6)
    sh.sheet([(-16, 4.5, 1.6), (-24, 4.8, 1.4), (-29, 2.2, 1.2), (-30.5, 0, 1.2), (-29, -2.2, 1.2), (-24, -4.8, 1.4), (-16, -4.5, 1.6)], 2.0)
    for y in (2.4, -2.4):
        sh.tube([(-6, y * 1.3, -5.5), (-15, y, -6.8)], r=[2.8, 1.6], n=3)
        sh.tube([(-15, y, -6.8), (-48, y * 0.8, -8.4), (-82, y * 0.7, -9.6)], r=[1.35, 1.15, 1.0], n=5)
        sh.ball((-48, y * 0.8, -8.4), 1.55)
        # webbed foot, toes trailing
        sh.sheet([(-81.5, y * 0.7 + 0.6, -9.6), (-88.8, y * 0.7 + 2.6, -10.6), (-89.4, y * 0.7, -10.9), (-88.8, y * 0.7 - 2.6, -10.6), (-81.5, y * 0.7 - 0.6, -9.6)], 1.6)
    wing(sh, dict(
        shoulder=(7, 5.0, 4.0), len=(17, 25, 12), sweep=(10, -12, 8), fold_sweep=(14, -44, 58), elbow_share=0.3,
        stations=[[(0, 5.5, 15), (0.5, 4.6, 20), (1, 3.6, 21.5)], [(0, 3.6, 21.5), (0.5, 2.8, 21.5), (1, 2.2, 20)], [(0, 2.2, 18), (1, 1.4, 9)]],
        bone_r=[3.0, 2.2, 1.6, 1.0], thick=1.1,
        primaries=dict(
            angle=[2, 6, 11, 17, 24, 32, 42, 54, 66], root_t=[1.0, 0.9, 0.78, 0.64, 0.5, 0.36, 0.22, 0.1, 0.0],
            length=[30, 31, 29.5, 27.5, 25.5, 23.5, 22, 21, 20.5], width=[6.5, 7, 7.4, 7.6, 7.8, 8, 8.6, 9.4, 10],
            profile=[1, 1, 1, 0.97, 0.85, 0.66, 0.4, 0], curl=0.08, close=0.55, thick=0.7),
    ), p)
    return sh, p["lift"]


def parrot(ph):
    """Rose-ringed parakeet: compact body, round head, a short hooked beak, a long graduated pointed tail, pointed
    swept-back wings."""
    m = dict(down=0.56, top=40, bottom=-16, hand=12, hand0=0, reach=4, bob=0.9)
    p = beat(ph, m); sh = Shape()
    sh.tube([(-16, 0, 0.6), (-8, 0, 0.0), (2, 0, 0), (12, 0, 0.6), (20, 0, 1.8)], r=[3.6, 7.0, 8.4, 7.8, 6.0], rz=[3.2, 6.4, 8.0, 7.6, 6.2])
    sh.ball((25, 0, 3.0), 6.9, 6.6)
    # the beak: a stout hooked upper mandible and a small lower one
    sh.tube([(29.5, 0, 4.4), (33.6, 0, 3.7), (36.4, 0, 1.6), (36.8, 0, -1.2), (35.6, 0, -2.6)], r=[2.2, 1.9, 1.45, 0.9, 0.35], rz=[3.0, 2.5, 1.8, 1.1, 0.35], n=5)
    sh.tube([(30, 0, -0.6), (32.6, 0, -1.2), (34.0, 0, -1.4)], r=[1.6, 1.1, 0.4], n=3)
    # the tail: long and graduated, the two central feathers far longer than the rest, ending in a fine point
    tail = [(-12, 5.0), (-22, 5.4), (-30, 4.6), (-38, 3.4), (-46, 2.2), (-54, 1.2), (-61, 0.45), (-64.5, 0)]
    sh.sheet([(x, w, 0.4 - 0.06 * (-x - 12)) for x, w in tail] + [(x, -w, 0.4 - 0.06 * (-x - 12)) for x, w in tail[::-1][1:]], 1.4)
    wing(sh, dict(
        shoulder=(6, 4.6, 4.0), len=(11, 15, 9), sweep=(14, -6, 16), fold_sweep=(14, -40, 50), elbow_share=0.3,
        stations=[[(0, 5.0, 13), (0.5, 4.2, 15.5), (1, 3.4, 16)], [(0, 3.4, 16), (0.5, 2.6, 15.5), (1, 2.0, 14)], [(0, 2.0, 12.5), (1, 1.2, 6)]],
        bone_r=[3.0, 2.1, 1.5, 0.9], thick=0.9,
        primaries=dict(
            angle=[6, 10, 15, 21, 28, 36, 46, 57, 68], root_t=[1.0, 0.88, 0.75, 0.62, 0.49, 0.36, 0.23, 0.11, 0.0],
            length=[24, 24.5, 23, 21, 19, 17, 15.5, 14.5, 14], width=[5.0, 5.4, 5.6, 5.8, 6.0, 6.2, 6.6, 7.0, 7.4],
            profile=[1, 1, 1, 0.96, 0.84, 0.64, 0.38, 0], curl=0.06, close=0.5, thick=0.6),
    ), p)
    return sh, p["lift"]


BIRDS = {
    # cycle_sec, frames, target union bounds (x0, x1) in model units, camera yaw / pitch (degrees)
    "stork": dict(build=stork, cycle=1.2, frames=56, x=(-89, 89)),
    "flamingo": dict(build=flamingo, cycle=1.0, frames=56, x=(-89, 89)),
    "parrot": dict(build=parrot, cycle=0.6, frames=48, x=(-49, 52)),
}
CAMERA = dict(yaw=22.0, pitch=20.0)     # seen from the ground: a little below the bird and a little ahead of it


# ---------------------------------------------------------------- camera, raster, trace
def camera(yaw, pitch):
    """Orthographic camera on the bird's right side, `pitch` below it and `yaw` ahead of it, rolled so the bird's
    long axis stays level on screen. Returns a 2x3 matrix: model point -> (x right, y down)."""
    y, p = rad(yaw), rad(pitch)
    c = np.array([math.sin(y) * math.cos(p), -math.cos(y) * math.cos(p), -math.sin(p)])   # towards the camera
    r = unit(np.cross([0, 0, 1.0], c)); u = np.cross(c, r)
    fx = np.array([r[0], u[0]]); roll = -math.atan2(fx[1], fx[0])                           # level the forward axis
    cr, sr = math.cos(roll), math.sin(roll)
    r2, u2 = cr * r - sr * u, sr * r + cr * u
    return np.stack([r2, -u2])

def hull(P):
    P = np.unique(np.round(P, 4), axis=0)
    if len(P) < 3: return P
    P = P[np.lexsort((P[:, 1], P[:, 0]))]
    def half(pts):
        h = []
        for q in pts:
            while len(h) >= 2 and (h[-1][0] - h[-2][0]) * (q[1] - h[-2][1]) - (h[-1][1] - h[-2][1]) * (q[0] - h[-2][0]) <= 0: h.pop()
            h.append(q)
        return h
    lo, hi = half(P), half(P[::-1]); return np.array(lo[:-1] + hi[:-1])

def project(sh, lift, C):
    """2D polygons (model units, y down) for one pose: [(points, outline thickness)]."""
    off = np.array([0, 0, lift]); out = []
    for S in sh.solids: out.append((hull((S + off) @ C.T), 0.0))
    for P, t in sh.sheets: out.append(((P + off) @ C.T, t))
    return out

def raster(polys, S, box, ss=3):
    """Draw at ss x the trace resolution, then average down (anti-aliasing), soften a touch and threshold."""
    x0, y0, x1, y1 = box; W, H = int((x1 - x0) * S) + 1, int((y1 - y0) * S) + 1
    im = Image.new("L", (W * ss, H * ss), 0); d = ImageDraw.Draw(im); k = S * ss
    for P, t in polys:
        pts = [((x - x0) * k, (y - y0) * k) for x, y in P]
        if len(pts) < 3: continue
        if t > 0: d.polygon(pts, fill=255, outline=255, width=max(1, int(round(t * k))))
        else: d.polygon(pts, fill=255)
    im = im.resize((W, H), Image.Resampling.BOX).filter(ImageFilter.GaussianBlur(radius=0.9))
    return np.array(im) > 127

def trace(mask, S, box):
    x0, y0 = box[0], box[1]
    f = lambda pt: f"{pt.x / S + x0:.1f} {pt.y / S + y0:.1f}"
    path = potrace.Bitmap(~mask).trace(turdsize=30, alphamax=1.1, opticurve=True, opttolerance=0.55)
    out = []
    for c in path:
        d = f"M {f(c.start_point)}"
        for g in c.segments: d += f" L {f(g.c)} L {f(g.end_point)}" if g.is_corner else f" C {f(g.c1)} {f(g.c2)} {f(g.end_point)}"
        out.append(d + " Z")
    return " ".join(out)


def build(name, px=7.0):
    B = BIRDS[name]; n = B["frames"]; C = camera(**CAMERA)
    poses = [B["build"](i / n) for i in range(n)]
    polys = [project(sh, lift, C) for sh, lift in poses]
    pts = np.vstack([P for fr in polys for P, _ in fr])
    lo, hi = pts.min(0), pts.max(0)
    # fit: scale so the union spans the target x range; shift x only (y stays on the body centre)
    k = (B["x"][1] - B["x"][0]) / (hi[0] - lo[0]); dx = B["x"][0] - lo[0] * k
    polys = [[(P * k + [dx, 0], t * k) for P, t in fr] for fr in polys]
    lo, hi = lo * k + [dx, 0], hi * k + [dx, 0]
    box = (lo[0] - 3, lo[1] - 3, hi[0] + 3, hi[1] + 3); S = px * 178 / (B["x"][1] - B["x"][0])
    frames = []
    for i, fr in enumerate(polys):
        frames.append(trace(raster(fr, S, box), S, box))
    res = {"source": "procedural: scripts/katha/birds.py", "credit": "Drawn in code for this channel; no outside model",
           "units": "model units; +x forward (towards the head), y down, origin at the body centre",
           "cycle_sec": B["cycle"], "frames": frames, "anchors": []}
    return res


def bounds(frames):
    xs, ys = [], []
    for d in frames:
        v = [float(t) for t in d.replace("M", " ").replace("L", " ").replace("C", " ").replace("Z", " ").split()]
        xs += v[0::2]; ys += v[1::2]
    return min(xs), max(xs), min(ys), max(ys)


def sheet(name, res, out_dir):
    """Contact sheet of every traced frame (from the final path strings), plus a strip at film size (50 and 80 px)."""
    fr = res["frames"]; n = len(fr); cols = 8; rows = math.ceil(n / cols)
    x0, x1, y0, y1 = bounds(fr); cw, chh = 220, 150; k = min((cw - 20) / (x1 - x0), (chh - 24) / (y1 - y0))
    Wd, Ht = cols * cw, rows * chh + 120
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{Wd}" height="{Ht}" viewBox="0 0 {Wd} {Ht}">',
         f'<rect width="{Wd}" height="{Ht}" fill="#efe9dc"/>']
    for i, d in enumerate(fr):
        cx, cy = (i % cols) * cw, (i // cols) * chh
        tx, ty = cx + cw / 2 - (x0 + x1) / 2 * k, cy + 14 + (chh - 14) / 2 - (y0 + y1) / 2 * k
        s.append(f'<rect x="{cx + 2}" y="{cy + 2}" width="{cw - 4}" height="{chh - 4}" fill="none" stroke="#d6cdb8"/>')
        s.append(f'<text x="{cx + 8}" y="{cy + 16}" font-family="sans-serif" font-size="12" fill="#8a7f6a">{i}</text>')
        s.append(f'<path d="{d}" transform="translate({tx:.1f} {ty:.1f}) scale({k:.4f})" fill="#1d1228"/>')
    yb = rows * chh; s.append(f'<rect x="0" y="{yb}" width="{Wd}" height="120" fill="#cdb79a"/>')
    for j, i in enumerate(range(0, n, max(1, n // 12))):
        for w, yy in ((50, yb + 34), (80, yb + 88)):
            kk = w / (x1 - x0); s.append(f'<path d="{fr[i]}" transform="translate({40 + j * 140 - x0 * kk:.1f} {yy:.1f}) scale({kk:.4f})" fill="#1d1228"/>')
    s.append("</svg>")
    svg = pathlib.Path(out_dir) / f"{name}_sheet.svg"; svg.write_text("\n".join(s))
    shot(svg, svg.with_suffix(".png"), Wd, Ht)
    return svg


def shot(svg, png, w, h):
    exe = os.environ.get("KATHA_CHROMIUM", "/opt/pw-browsers/chromium")
    if not pathlib.Path(exe).exists(): return
    subprocess.run([exe, "--headless=new", "--no-sandbox", "--hide-scrollbars", f"--screenshot={png}", f"--window-size={w},{h}",
                    f"file://{pathlib.Path(svg).resolve()}"], check=False, capture_output=True, timeout=120)


if __name__ == "__main__":
    a = sys.argv[1:]; which = next((x for x in a if not x.startswith("--") and x in (*BIRDS, "all")), "all")
    out_dir = a[a.index("--sheet") + 1] if "--sheet" in a else None
    if out_dir: pathlib.Path(out_dir).mkdir(parents=True, exist_ok=True)
    for name in (BIRDS if which == "all" else [which]):
        res = build(name); p = SIL / f"{name}.json"
        p.write_text(json.dumps(res, separators=(",", ":")))
        x0, x1, y0, y1 = bounds(res["frames"])
        print(f"{p.relative_to(ROOT)}: {len(res['frames'])} frames, {p.stat().st_size // 1024} KB, x {x0:.0f}..{x1:.0f}, y {y0:.0f}..{y1:.0f}")
        if out_dir: print("  sheet", sheet(name, res, out_dir))

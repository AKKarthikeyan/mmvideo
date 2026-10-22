#!/usr/bin/env python3
"""Flying birds for the Katha kit, drawn in code for this channel.

A white stork, a greater flamingo and a rose-ringed parakeet are each built here from simple 3D geometry written by
hand: a lofted body, neck, head and bill, trailing legs, a tail, and two wings. Each wing is a planform (leading edge,
chord, thickness along the span) skinned to three bones hinged at the shoulder, elbow and wrist; the stork's outer
primaries are separate splayed fingers, the flamingo's and the parakeet's hands end in one smooth point. One wingbeat
is animated from keyframes written per bird (a periodic monotone spline per joint channel, so nothing overshoots, stops
or jumps): a slower downstroke in which the wing sweeps down and, in its second half, reaches forward; then a quicker
upstroke in which the wing rises the whole way, the wrist leading and the hand trailing back and down from it, the flex
deepest as the arm passes the horizontal and opening out again over the last part of the rise. The body rises a little
on the downstroke; neck and legs stay still. Every frame is projected orthographically through one fixed camera (from
the ground, a little below the bird and a little ahead of it, so both wings show), rasterised at high resolution with
anti-aliasing, and traced to an SVG path with potrace. The birds owe nothing to any outside model, image or tracing:
no file is read and nothing is downloaded, and there is no randomness, so a run always gives the same output.

  python3 scripts/katha/birds.py [stork|flamingo|parrot|all] [--sheet DIR]

writes src/katha/sil/<bird>.json (the shape src/katha/sil.tsx reads: "frames" are SVG paths, nonzero fill, facing
right, y down, origin near the body centre). --sheet DIR also writes a contact sheet of every traced frame to DIR as
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
def smooth01(x):
    x = min(1.0, max(0.0, x)); return x * x * (3 - 2 * x)

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
    """A bird as a bag of convex solids, each drawn as the convex hull of its projection (exact for a convex piece:
    a length of tube, a panel of wing, a length of feather). Each solid carries a tag ("body", "near", "far"): the
    wings are softened on their own layer, and the debugging views colour them."""
    def __init__(self): self.solids, self.tags = [], []

    def add(self, P, tag="body"): self.solids.append(np.asarray(P, float)); self.tags.append(tag)

    def tube(self, pts, r, rz=None, n=8, ring=18, caps=True, tag="body"):
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
        for i in range(len(rings) - 1): self.add(np.vstack([rings[i], rings[i + 1]]), tag)
        if caps:
            for i in (0, -1):
                if min(ry[i], rzz[i]) > 0.35: self.ball(C[i], ry[i], rzz[i], tag=tag)

    def ball(self, c, r, rz=None, n=10, tag="body"):
        th, ph = np.meshgrid(np.linspace(0, math.pi, n), np.linspace(0, TAU, 2 * n, endpoint=False))
        rz = r if rz is None else rz
        self.add(np.asarray(c, float) + np.stack([r * np.sin(th) * np.cos(ph), r * np.sin(th) * np.sin(ph), rz * np.cos(th)], -1).reshape(-1, 3), tag)


# ---------------------------------------------------------------- the wingbeat
def pchip(K, x):
    """A periodic monotone cubic (Fritsch-Butland) through keyframes K = [(phase, value), ...], phases ascending in
    0..1, the first at 0. Between two keys the value never leaves their range, so a channel cannot overshoot, and it
    eases to a stop only where the keys turn round (the top and bottom of the stroke)."""
    n = len(K); x %= 1.0
    T = [K[j % n][0] + math.floor(j / n) for j in range(-2, n + 2)]
    V = [K[j % n][1] for j in range(-2, n + 2)]
    i = max(j for j in range(2, n + 2) if T[j] <= x)
    def slope(j): return (V[j + 1] - V[j]) / (T[j + 1] - T[j])
    def tan(j):
        d0, d1 = slope(j - 1), slope(j); h0, h1 = T[j] - T[j - 1], T[j + 1] - T[j]
        if d0 * d1 <= 0: return 0.0
        w1, w2 = 2 * h1 + h0, h1 + 2 * h0; return (w1 + w2) / (w1 / d0 + w2 / d1)
    h = T[i + 1] - T[i]; s = (x - T[i]) / h
    return ((2 * s ** 3 - 3 * s * s + 1) * V[i] + (s ** 3 - 2 * s * s + s) * h * tan(i)
            + (-2 * s ** 3 + 3 * s * s) * V[i + 1] + (s ** 3 - s * s) * h * tan(i + 1))

def pose(ph, K):
    """The pose at phase ph (0 = wings at the top, about to sweep down) from the bird's keyframes K, one list per channel:
    e  shoulder elevation (deg, + up)       sw shoulder sweep (deg, + back, - reaching forward)
    el forearm raised at the elbow (deg)    f  wrist flex 0..1 (hand swept back, secondaries tucked)
    hd hand raised at the wrist (deg)       tw twist about the arm (deg, + leading edge down, - leading edge up)
    sp splay of the stork's fingers 0..1    ld air load on the fingers 0..1 (they bend up under it)
    tk how far the secondaries are slid together 0..1 (default: as f)
    lift  body height (model units)"""
    return {ch: pchip(k, ph) for ch, k in K.items()}


# ---------------------------------------------------------------- a wing
def wing(sh, W, P):
    """Both wings in the same pose (the near one is the mirror image of the far one). W["far"] may adjust the far
    wing's sweep a little (deg): seen from ahead of the bird, it keeps that wing from reaching out over the neck."""
    Pf = dict(P); Pf["sw"] = P["sw"] + W.get("far_sw", 0.0); Pf["hd"] = P["hd"] + W.get("far_hd", 0.0) * P["f"]
    Pf["tw"] = P["tw"] * (1 - W.get("far_tw", 0.0) * min(1.0, P["f"] / 0.6))
    for Q in wing_parts(W, Pf): sh.add(Q, "far")
    for Q in wing_parts(W, P): sh.add(Q * [1, -1, 1.0], "near")


def wing_parts(W, P):
    """One wing as a list of convex solids. W: the bird's wing spec, built as the left (far) wing, outward = +y. The
    wing is a planform (leading edge ahead of the bones, chord behind them, per station along the span) skinned to three
    bones hinged at the shoulder, elbow and wrist: each station follows a smooth blend of the bones it lies between, so
    when the wrist flexes the trailing edge folds with the hand and the outline stays smooth. As the wrist flexes the
    secondaries slide together (the chord shortens, most along the forearm), so the folded wing is a narrow arm with its
    corner at the wrist and the hand trailing from it. Each panel between two stations is a thin convex slab, deeper at
    the leading edge. The stork's outer primaries are separate fingers fixed to the hand."""
    f = P["f"]; S = np.array(W["shoulder"], float); Lh, Lf, Lm = W["len"]; sw, fd = W["sweep"], W["fold"]
    R0 = Rx(rad(P["e"])) @ Rz(rad(sw[0] + fd[0] * f + P["sw"])) @ Ry(rad(P["tw"]))
    R1 = R0 @ Rz(rad(sw[1] + fd[1] * f)) @ Rx(rad(P["el"]))
    R2 = R1 @ Rz(rad(sw[2] + fd[2] * f)) @ Rx(rad(P["hd"]))
    E0, W0 = S + [0, Lh, 0], S + [0, Lh + Lf, 0]
    E = S + R0 @ [0, Lh, 0]; Wr = E + R1 @ [0, Lf, 0]
    bones = ((R0, S, S), (R1, E0, E), (R2, W0, Wr))
    bE, bW = W.get("blend", (4.0, 6.0)); fanw = W.get("fan", 0.6 * Lf)
    def wts(y, wide=0.0):
        a = smooth01((y - Lh + bE) / (2 * bE))
        b = smooth01((y - Lh - Lf + bW + wide) / (2 * bW + wide)); return (1 - a, max(0.0, a - b), b)
    def move(p, w):
        return sum(wi * (J + R @ (p - J0)) for wi, (R, J0, J) in zip(w, bones) if wi > 0)
    def rot(w):
        U, _, Vt = np.linalg.svd(sum(wi * R for wi, (R, _, _) in zip(w, bones) if wi > 0)); return U @ Vt
    rows, _ = curve(W["plan"], n=W.get("rows", 10))
    cam = W.get("camber", 0.06); tuck = W.get("tuck", (0.0, 0.0, 0.0)); st = []
    for y, lead, chord, th in rows:
        w = wts(y); wt = wts(y, fanw)
        k = 1 - P.get("tk", f) * (tuck[0] * w[0] + tuck[1] * w[1] + tuck[2] * w[2])
        le = move(S + [lead, y, 0], w); Rt = rot(wt)
        te = le + Rt @ [-(chord * k + lead), 0, -cam * chord * k]
        st.append((le, te, rot(w) @ [0, 0, 1.0], th))
    # where the chord swings round between forearm and hand, the trailing edge could fold back on itself and leave a
    # step in the outline: smooth it along the span (the leading edge stays on the bones)
    sg = W.get("te_smooth", 6.0)
    if sg:
        TE = np.array([t for _, t, _, _ in st]); m = len(TE); idx = np.arange(m)
        Wt = np.exp(-0.5 * ((idx[:, None] - idx[None, :]) / sg) ** 2); Wt /= Wt.sum(1, keepdims=True)
        keep = np.minimum(1.0, np.minimum(idx, m - 1 - idx) / (2 * sg))[:, None]       # the ends stay where they are
        TE = TE * (1 - keep) + (Wt @ TE) * keep
        st = [(le, te, n_, th) for (le, _, n_, th), te in zip(st, TE)]
    parts = []
    for (le0, te0, n0, h0), (le1, te1, n1, h1) in zip(st[:-1], st[1:]):
        parts.append(np.array([le0 + n0 * h0, le0 - n0 * h0, te0 + n0 * h0 * 0.35, te0 - n0 * h0 * 0.35,
                               le1 + n1 * h1, le1 - n1 * h1, te1 + n1 * h1 * 0.35, te1 - n1 * h1 * 0.35]))
    Fd = W.get("fingers")
    if Fd:
        # the fingers fan from the end of the hand. Spread (sp = 1) they splay at their own angles; gathered (sp = 0,
        # or the wrist flexed) they close towards one direction but stay a little apart, so the tips remain slotted.
        g = max(1 - P.get("sp", 1.0), f * Fd.get("flex_gather", 1.0)); ga = Fd["gather"]
        tip = np.array([Fd["root_x"][0], Fd["root_y"][0]]) + Fd["length"][0] * np.array([-math.sin(rad(ga)), math.cos(rad(ga))])
        for j in range(len(Fd["angle"])):
            r2 = np.array([Fd["root_x"][j], Fd["root_y"][j]]); dv = tip - r2
            a_spread = Fd["angle"][j]; a_close = math.degrees(math.atan2(-dv[0], dv[1]))      # aimed at the common tip
            a_close += Fd.get("keep", 0.25) * (a_spread - a_close)
            a_ = rad(a_spread + (a_close - a_spread) * g)
            L = Fd["length"][j] + (float(np.hypot(*dv)) - Fd.get("stagger", 2.0) * j - Fd["length"][j]) * g * Fd.get("converge", 1.0)
            root = Wr + R2 @ [Fd["root_x"][j], Fd["root_y"][j] - Lh - Lf, 0]; wd = Fd["width"][j]
            prof = Fd["profile"][j]; ns = len(prof) - 1
            curl = Fd.get("curl", 0) * P.get("ld", 0) + Fd.get("curl0", 0)
            Rf = R2 @ Rz(a_); ctr, frs = [root], []
            for i in range(ns):
                Ri = Rf @ Rx(curl * (i + 0.5) / ns); frs.append(Ri); ctr.append(ctr[-1] + Ri @ [0, L / ns, 0])
            h = Fd.get("depth", 0.5); aft = Fd.get("aft", 0.5)
            for i in range(ns):
                Ri = frs[i]; side = Ri @ [1.0, 0, 0]; nrm = Ri @ [0, 0, 1.0]
                q = [ctr[i] + side * wd * (1 - aft) * prof[i], ctr[i + 1] + side * wd * (1 - aft) * prof[i + 1],
                     ctr[i + 1] - side * wd * aft * prof[i + 1], ctr[i] - side * wd * aft * prof[i]]
                parts.append(np.array([p_ + nrm * h * sg for p_ in q for sg in (1, -1)]))
    return parts


# ---------------------------------------------------------------- the birds
# Keyframes are (phase, value); phase 0 is the top of the stroke. Each bird's downstroke takes about 57% of the cycle.
STORK_KEYS = dict(
    e=[(0.0, 31), (0.06, 28), (0.17, 18), (0.31, 3), (0.45, -8), (0.55, -12), (0.60, -8.5), (0.66, 0), (0.74, 11), (0.83, 21), (0.91, 28), (0.97, 30.6)],
    sw=[(0.0, 12), (0.1, 9), (0.3, -2), (0.48, -12), (0.56, -14), (0.64, -8), (0.74, 2), (0.84, 9), (0.93, 12.5)],
    el=[(0.0, 0), (0.56, 0), (0.63, 6), (0.70, 14), (0.80, 20), (0.88, 13), (0.95, 3), (0.99, 0.3)],
    f=[(0.0, 0.005), (0.03, 0.0), (0.58, 0.0), (0.62, 0.06), (0.66, 0.32), (0.70, 0.7), (0.73, 0.8), (0.74, 0.7), (0.78, 0.58), (0.84, 0.44), (0.90, 0.22), (0.95, 0.06), (0.99, 0.01)],
    tk=[(0.0, 0.0), (0.59, 0.0), (0.65, 0.5), (0.70, 1.0), (0.74, 0.8), (0.78, 0.35), (0.82, 0.08), (0.86, 0.0)],
    hd=[(0.0, 4), (0.25, 6), (0.5, 9), (0.59, 5), (0.63, -8), (0.66, -24), (0.70, -33), (0.74, -24), (0.78, -14), (0.84, -6), (0.90, 2), (0.95, 5)],
    tw=[(0.0, 0), (0.25, 8), (0.5, 2), (0.6, -6), (0.72, -14), (0.88, -6)],
    sp=[(0.0, 0.75), (0.22, 1.0), (0.5, 0.85), (0.62, 0.5), (0.72, 0.25), (0.80, 0.42), (0.9, 0.6)],
    ld=[(0.0, 0.0), (0.25, 1.0), (0.5, 0.3), (0.6, 0.0), (0.95, 0.0)],
    lift=[(0.0, -1.5), (0.28, 0.2), (0.55, 1.5), (0.8, -0.2)])
STORK_WING = dict(
    shoulder=(8, 6.0, 4.0), len=(21, 31, 15), sweep=(8, -4, 4), fold=(5, -12, 118), blend=(4, 7), camber=0.06,
    tuck=(0.5, 0.75, 0.6), far_hd=40, far_tw=1.0,
    # span y, lead, chord, thickness: a broad, nearly rectangular wing
    plan=[(0, 5, 23, 2.2), (8, 6.5, 29, 2.4), (21, 6, 32, 2.2), (36, 4.8, 33, 1.8), (50, 5.0, 31, 1.5),
          (58, 3.2, 28, 1.1), (66.5, 1.0, 25, 0.9)],
    fingers=dict(                                            # the five emarginated outer primaries and an inner filler
        angle=[-4, 8, 20, 33, 47, 62], root_y=[66.5, 65.5, 64, 62, 59.5, 56.5], root_x=[0.0, -2.5, -5.5, -9, -13, -17],
        length=[27, 33, 34, 32, 29, 23], width=[6.6, 7.6, 8.2, 8.6, 9.6, 12.5], aft=0.55,
        profile=[[1, 1, 0.95, 0.62, 0.5, 0.42, 0.3, 0.05]] * 5 + [[1, 1, 1, 0.95, 0.85, 0.7, 0.45, 0.05]],
        curl=0.24, curl0=0.03, gather=6, keep=0.12, stagger=2.5, depth=0.6),
)

def stork(ph):
    """White / painted stork: neck straight out, long straight heavy bill, legs trailing well past a short tail, broad
    rectangular wings ending in splayed fingers. A shallow, unhurried beat."""
    p = pose(ph, STORK_KEYS); sh = Shape()
    # body: a deep oval, slightly arched, full underneath, running back into the rump
    sh.tube([(-26, 0, 1.0), (-18, 0, 0.4), (-8, 0, -0.8), (3, 0, -1.2), (13, 0, -0.4), (21, 0, 0.8)],
            r=[6.0, 9.6, 11.6, 12.0, 10.4, 7.6], rz=[6.0, 9.4, 12.2, 12.6, 11.0, 8.4])
    # neck held straight forward, a little below the line of the back, full where it leaves the body; head; heavy bill
    sh.tube([(15, 0, 1.0), (29, 0, -0.2), (43, 0, -1.6), (56, 0, -2.8)], r=[8.6, 6.6, 6.0, 5.8], rz=[9.6, 7.4, 6.6, 6.2])
    sh.tube([(53, 0, -2.6), (58, 0, -2.3), (62.5, 0, -3.0), (65.5, 0, -3.8)], r=[5.6, 5.9, 5.2, 4.2], rz=[6.2, 6.6, 5.8, 4.8])
    sh.tube([(63, 0, -3.6), (75.5, 0, -5.8), (88.5, 0, -7.9)], r=[3.0, 2.0, 0.3], rz=[5.0, 3.0, 0.45], n=6)
    # short tail: a rounded fan running out of the rump, deep enough that the legs leave the body beneath it
    sh.tube([(-20, 0, 0.0), (-28, 0, -1.4), (-35, 0, -2.6), (-39, 0, -3.2)], r=[8.0, 8.6, 7.4, 4.6], rz=[7.0, 5.2, 4.2, 3.2], n=5)
    # legs: thighs under the belly, then shank and foot trailing straight back under the tail, the toes a little splayed
    for y in (3.2, -3.2):
        sh.tube([(-4, y * 1.2, -7.2), (-16, y, -7.0)], r=[4.4, 3.0], n=3)
        sh.tube([(-16, y, -7.0), (-47, y * 0.85, -7.6), (-81, y * 0.75, -8.8)], r=[2.6, 2.3, 2.0], n=5)
        sh.ball((-47, y * 0.85, -7.6), 2.6)
        for dy, dz, L in ((0.0, -0.4, 8.0), (1.6, 0.6, 6.5), (-1.6, -1.3, 6.8)):
            sh.tube([(-81, y * 0.75, -8.8), (-81 - L, y * 0.75 + dy * np.sign(y), -8.8 + dz)], r=[1.7, 0.8], n=2)
    wing(sh, STORK_WING, p)
    return sh, p["lift"]


FLAMINGO_KEYS = dict(
    e=[(0.0, 32), (0.12, 27), (0.30, 9), (0.46, -7), (0.57, -12), (0.66, -6), (0.76, 8), (0.88, 24), (0.96, 31)],
    sw=[(0.0, 6), (0.2, 2), (0.42, -8), (0.55, -10), (0.66, -4), (0.78, 6), (0.9, 8)],
    el=[(0.0, 0), (0.56, 0), (0.66, 14), (0.76, 18), (0.88, 8), (0.97, 1)],
    f=[(0.0, 0.1), (0.07, 0.0), (0.56, 0.0), (0.64, 0.35), (0.72, 0.8), (0.77, 0.88), (0.84, 0.65), (0.92, 0.3)],
    hd=[(0.0, -4), (0.25, 3), (0.5, 1), (0.62, -8), (0.74, -22), (0.84, -18), (0.93, -8)],
    tw=[(0.0, 0), (0.25, 8), (0.5, 2), (0.6, -6), (0.74, -16), (0.88, -8)],
    lift=[(0.0, -1.3), (0.28, 0.2), (0.55, 1.3), (0.8, -0.2)])
FLAMINGO_WING = dict(
    shoulder=(7, 4.6, 3.6), len=(20, 28, 33), sweep=(10, -6, 12), fold=(10, -55, 140), blend=(4, 7), camber=0.06,
    tuck=(0.25, 0.5, 0.35),
    # a narrower wing tapering to a long, smoothly pointed hand
    plan=[(0, 4.4, 12, 1.9), (8.9, 5.4, 17.5, 2.0), (20, 5.0, 21, 1.8), (33.3, 3.8, 21.5, 1.5), (47.7, 2.6, 20, 1.2),
          (60, 2.2, 17, 1.0), (72, 1.7, 13.5, 0.8), (84, 1.0, 9, 0.6), (93, 0.2, 4, 0.45), (97, -1.0, 0.8, 0.3)],
)

def flamingo(ph):
    """Greater flamingo: very long thin neck held out and drooping a little, the bill bent down, very long thin legs
    trailing straight behind, a slim body, narrower pointed wings."""
    p = pose(ph, FLAMINGO_KEYS); sh = Shape()
    sh.tube([(-22, 0, 1.5), (-14, 0, 0.4), (-3, 0, -0.5), (8, 0, -0.2), (16, 0, 0.8)], r=[3.2, 6.8, 8.4, 7.6, 5.4], rz=[3.0, 6.8, 8.6, 7.8, 5.6])
    sh.tube([(13, 0, 1.0), (30, 0, 0.6), (48, 0, -1.6), (64, 0, -4.6), (74, 0, -6.6)], r=[5.0, 3.4, 3.0, 2.9, 3.0], rz=[5.6, 3.8, 3.4, 3.2, 3.2], n=10)
    sh.tube([(72.5, 0, -6.3), (75.5, 0, -6.0), (78.5, 0, -6.6)], r=[3.4, 3.8, 3.2], n=4)
    # the bill: deep at the base, straight for half its length, then bent sharply down
    sh.tube([(78, 0, -6.4), (83.5, 0, -7.4), (87.0, 0, -9.6), (88.6, 0, -13.4)], r=[2.4, 1.9, 1.1, 0.35], rz=[3.4, 2.5, 1.5, 0.4], n=6)
    # tail: short, a little wedge
    sh.tube([(-18, 0, 1.6), (-25, 0, 1.0), (-30.5, 0, 0.4)], r=[4.6, 4.4, 1.6], rz=[3.4, 2.2, 1.2], n=4)
    for y in (2.4, -2.4):
        sh.tube([(-6, y * 1.3, -5.8), (-15, y, -7.0)], r=[2.9, 1.7], n=3)
        sh.tube([(-15, y, -7.0), (-48, y * 0.8, -8.4), (-82, y * 0.7, -9.6)], r=[1.4, 1.2, 1.05], n=5)
        sh.ball((-48, y * 0.8, -8.4), 1.6)
        sh.tube([(-81.5, y * 0.7, -9.6), (-85.5, y * 0.7, -10.2), (-89.4, y * 0.7, -10.9)], r=[1.2, 2.2, 0.5], rz=[1.0, 0.9, 0.4], n=3)
    wing(sh, FLAMINGO_WING, p)
    return sh, p["lift"]


PARROT_KEYS = dict(
    e=[(0.0, 38), (0.12, 32), (0.30, 12), (0.46, -8), (0.57, -14), (0.66, -8), (0.76, 8), (0.88, 28), (0.96, 37)],
    sw=[(0.0, 4), (0.2, 0), (0.42, -12), (0.55, -16), (0.66, -8), (0.78, 4), (0.9, 6)],
    el=[(0.0, 0), (0.56, 0), (0.66, 14), (0.76, 18), (0.88, 8), (0.97, 1)],
    f=[(0.0, 0.1), (0.07, 0.0), (0.56, 0.0), (0.64, 0.35), (0.72, 0.8), (0.77, 0.9), (0.84, 0.65), (0.92, 0.3)],
    hd=[(0.0, -4), (0.25, 3), (0.5, 1), (0.62, -8), (0.74, -22), (0.84, -18), (0.93, -8)],
    tw=[(0.0, 0), (0.25, 8), (0.5, 2), (0.6, -6), (0.74, -16), (0.88, -8)],
    lift=[(0.0, -0.9), (0.28, 0.1), (0.55, 0.9), (0.8, -0.1)])
PARROT_WING = dict(
    shoulder=(6, 4.4, 3.6), len=(12, 16.5, 26.5), sweep=(12, -4, 18), fold=(10, -50, 135), blend=(3, 5), camber=0.06,
    tuck=(0.25, 0.5, 0.35),
    # narrow, the hand long and pointed
    plan=[(0, 4.0, 9, 1.6), (6.6, 4.6, 12.5, 1.7), (12.1, 4.2, 13.5, 1.5), (20.9, 3.2, 13.5, 1.3), (28.6, 2.4, 12.5, 1.1),
          (36.3, 2.0, 10.5, 0.9), (45.1, 1.5, 7.5, 0.7), (53, 0.6, 4.5, 0.5), (59, -0.6, 1.6, 0.35), (61, -1.2, 0.5, 0.3)],
)

def parrot(ph):
    """Rose-ringed parakeet: compact body, round head, a short hooked beak, a long graduated pointed tail, pointed
    swept-back wings. A quick, deep beat."""
    p = pose(ph, PARROT_KEYS); sh = Shape()
    sh.tube([(-15, 0, 0.4), (-8, 0, -0.3), (2, 0, -0.4), (12, 0, 0.3), (20, 0, 1.8)], r=[5.0, 7.2, 8.6, 8.0, 6.0], rz=[5.4, 7.6, 8.8, 8.2, 6.4])
    sh.ball((25, 0, 3.0), 6.9, 6.6)
    # the beak: a stout hooked upper mandible and a small lower one
    sh.tube([(29.5, 0, 4.4), (33.6, 0, 3.7), (36.4, 0, 1.6), (36.8, 0, -1.2), (35.6, 0, -2.6)], r=[2.2, 1.9, 1.45, 0.9, 0.35], rz=[3.0, 2.5, 1.8, 1.1, 0.35], n=5)
    sh.tube([(29.5, 0, 0.2), (32.8, 0, -0.6), (35.2, 0, -1.4)], r=[2.0, 1.6, 0.9], rz=[2.4, 1.8, 0.9], n=3)
    # the tail: a long graduated wedge that grows out of the rump, deepest at its base and tapering to a fine point
    sh.tube([(-6, 0, 0.3), (-14, 0, 0.0), (-22, 0, -0.5), (-32, 0, -1.0), (-44, 0, -1.6), (-56, 0, -2.1), (-66, 0, -2.5)],
            r=[6.4, 6.0, 5.0, 3.8, 2.5, 1.2, 0.2], rz=[6.2, 5.0, 3.7, 2.7, 1.8, 0.9, 0.2], n=6)
    wing(sh, PARROT_WING, p)
    return sh, p["lift"]


BIRDS = {
    # cycle_sec, frames per cycle, the union x extent in model units (the size the scenes were tuned for), and how much
    # the wings are softened before tracing (model units: a Gaussian on the wing layer, then a small opening).
    "stork": dict(build=stork, cycle=1.2, frames=48, x=(-89, 89), wing_blur=1.2, wing_open=1.2),
    "flamingo": dict(build=flamingo, cycle=1.0, frames=48, x=(-89, 89), wing_blur=1.0, wing_open=0.8),
    "parrot": dict(build=parrot, cycle=0.6, frames=48, x=(-49, 52), wing_blur=0.7, wing_open=0.6),
}
CAMERA = dict(yaw=18.0, pitch=20.0)     # seen from the ground: 22 degrees below the bird and 18 degrees ahead of it


# ---------------------------------------------------------------- camera, raster, trace
def camera(yaw, pitch):
    """Orthographic camera on the bird's right side, `pitch` below it and `yaw` ahead of it (negative: behind), rolled
    so the bird's long axis stays level on screen. Returns a 2x3 matrix: model point -> (x right, y down)."""
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
    """2D convex polygons (model units, y down) for one pose."""
    off = np.array([0, 0, lift]); return [hull((S + off) @ C.T) for S in sh.solids]

def raster(polys, S, box, tags=None, ss=3, close=1.0, wblur=0.0, wopen=0.0):
    """Draw at ss x the trace resolution, then average down (anti-aliasing), soften a touch and threshold. The wings
    (every solid not tagged "body") are drawn on their own layer, softened there with a Gaussian of wblur model units
    and opened (eroded then dilated) by wopen model units before they join the body: feather tips and slivers too small
    to read melt away and the notches between tips seen end on fill in, so a wing edge reads as a deliberate shape,
    never as a row of teeth."""
    x0, y0, x1, y1 = box; W, H = int((x1 - x0) * S) + 1, int((y1 - y0) * S) + 1; k = S * ss
    def layer(sel):
        im = Image.new("L", (W * ss, H * ss), 0); d = ImageDraw.Draw(im)
        for P, t in zip(polys, tags or ["body"] * len(polys)):
            if len(P) >= 3 and sel(t): d.polygon([((x - x0) * k, (y - y0) * k) for x, y in P], fill=255)
        return im.resize((W, H), Image.Resampling.BOX).filter(ImageFilter.GaussianBlur(radius=0.9))
    if tags is None or not (wblur or wopen): m = np.array(layer(lambda t: True)) > 127
    else:
        wg = layer(lambda t: t != "body").filter(ImageFilter.GaussianBlur(radius=max(wblur * S, 0.9)))
        wm = np.array(wg) > 127
        if wopen:                                  # a round opening, done as blur-and-threshold so it stays smooth
            r = wopen * S; g = lambda a, lvl: np.array(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=r * 0.6))) > lvl
            wm = g(g(wm, 200), 55)
        m = (np.array(layer(lambda t: t == "body")) > 127) | wm
    im = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=0.9))
    c = 2 * int(S * close / 2) + 1                                # a small closing seals hairline notches between parts
    if c >= 3: im = im.filter(ImageFilter.MaxFilter(c)).filter(ImageFilter.MinFilter(c))
    return np.array(im) > 127

def trace(mask, S, box, hole_min=80.0):
    """Trace the mask with potrace: absolute M/L/C/Z, 1 decimal, model units. Holes wind the other way (nonzero fill);
    holes smaller than hole_min square units (slivers caught between a wing, the tail and the legs) are filled."""
    x0, y0 = box[0], box[1]
    num = lambda v: "0.0" if f"{v:.1f}" == "-0.0" else f"{v:.1f}"
    f = lambda pt: f"{num(pt.x / S + x0)} {num(pt.y / S + y0)}"
    path = potrace.Bitmap(~mask).trace(turdsize=30, alphamax=1.2, opticurve=True, opttolerance=1.0)
    out = []
    for c in path:
        pts = [c.start_point] + [q for g in c.segments for q in ((g.c, g.end_point) if g.is_corner else (g.c1, g.c2, g.end_point))]
        x, y = np.array([q.x for q in pts]) / S, np.array([q.y for q in pts]) / S
        a = 0.5 * float(np.sum(x * np.roll(y, -1) - np.roll(x, -1) * y))
        d = f"M {f(c.start_point)}"
        for g in c.segments: d += f" L {f(g.c)} L {f(g.end_point)}" if g.is_corner else f" C {f(g.c1)} {f(g.c2)} {f(g.end_point)}"
        out.append((a, d + " Z"))
    big = max((a for a, _ in out), key=abs)
    return " ".join(d for a, d in out if a * big > 0 or abs(a) >= hole_min)


def clean(B):
    return dict(wblur=B.get("wing_blur", 0.0), wopen=B.get("wing_open", 0.0))


def fitted(name, cam=None):
    """Every frame's projected polygons (and their tags), scaled and shifted in x so the union of all frames spans the
    bird's x extent. Two passes: first on the geometry, then on the rasterised outline."""
    B = BIRDS[name]; n = B["frames"]; C = camera(**(cam or CAMERA))
    built = [B["build"](i / n) for i in range(n)]
    polys = [project(sh, lift, C) for sh, lift in built]; tags = [sh.tags for sh, _ in built]
    S = 5.5 * 178 / (B["x"][1] - B["x"][0])
    for rnd in range(2):
        pts = np.vstack([P for fr in polys for P in fr]); lo, hi = pts.min(0), pts.max(0)
        box = (lo[0] - 4, lo[1] - 4, hi[0] + 4, hi[1] + 4)
        if rnd == 0: lo_x, hi_x = lo[0], hi[0]
        else:
            cols = np.flatnonzero(np.any([raster(fr, S, box, tg, **clean(B)).any(0) for fr, tg in zip(polys, tags)], axis=0))
            lo_x, hi_x = box[0] + cols[0] / S, box[0] + (cols[-1] + 1) / S
        k = (B["x"][1] - B["x"][0]) / (hi_x - lo_x); dx = B["x"][0] - lo_x * k
        polys = [[P * k + [dx, 0] for P in fr] for fr in polys]
    pts = np.vstack([P for fr in polys for P in fr]); lo, hi = pts.min(0), pts.max(0)
    return polys, tags, S, (lo[0] - 4, lo[1] - 4, hi[0] + 4, hi[1] + 4)


def build(name):
    B = BIRDS[name]; polys, tags, S, box = fitted(name); frames = []
    for i, (fr, tg) in enumerate(zip(polys, tags)):
        frames.append(trace(raster(fr, S, box, tg, **clean(B)), S, box))
        k_out = pieces(frames[-1])
        if k_out != 1: print(f"  warning: {name} frame {i} has {k_out} separate pieces")
    return {"source": "procedural: scripts/katha/birds.py", "credit": "Drawn in code for this channel; no outside model",
            "units": "model units; +x forward (towards the head), y down, origin at the body centre",
            "cycle_sec": B["cycle"], "frames": frames, "anchors": []}


def pieces(d):
    """How many separate filled pieces a path has (outer contours; holes wind the other way)."""
    areas = []
    for sub in d.split("Z"):
        v = [float(t) for t in sub.replace("M", " ").replace("L", " ").replace("C", " ").split()]
        if len(v) < 6: continue
        x, y = np.array(v[0::2]), np.array(v[1::2]); areas.append(0.5 * float(np.sum(x * np.roll(y, -1) - np.roll(x, -1) * y)))
    if not areas: return 0
    big = max(areas, key=abs); return sum(1 for a in areas if a * big > 0)


def bounds(frames):
    """Union extent of the paths, measured on the curves themselves (control points can lie outside them)."""
    xs, ys = [], []; t = np.linspace(0, 1, 9)[:, None]
    for d in frames:
        tok = d.replace("Z", " ").split(); i = 0; cur = None
        while i < len(tok):
            c = tok[i]
            if c in "ML": cur = np.array([float(tok[i + 1]), float(tok[i + 2])]); xs.append(cur[0]); ys.append(cur[1]); i += 3
            elif c == "C":
                p1, p2, p3 = (np.array([float(tok[i + 1 + 2 * j]), float(tok[i + 2 + 2 * j])]) for j in range(3))
                b = (1 - t) ** 3 * cur + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3
                xs += list(b[:, 0]); ys += list(b[:, 1]); cur = p3; i += 7
            else: i += 1
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
    for j, i in enumerate(round(q * n / 12) for q in range(12)):
        for w, yy in ((50, yb + 30), (80, yb + 82)):
            kk = w / (x1 - x0); s.append(f'<path d="{fr[i]}" transform="translate({30 + j * 145 - x0 * kk:.1f} {yy - (y0 + y1) / 2 * kk:.1f}) scale({kk:.4f})" fill="#1d1228"/>')
    s.append("</svg>")
    svg = pathlib.Path(out_dir) / f"{name}_sheet.svg"; svg.write_text("\n".join(s))
    shot(svg, svg.with_suffix(".png"), Wd, Ht + 100)
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

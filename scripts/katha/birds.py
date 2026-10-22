#!/usr/bin/env python3
"""Flying birds for the Katha kit, drawn in code for this channel.

A white stork, a greater flamingo and a rose-ringed parakeet are each built here from simple 3D geometry written by
hand: a lofted body, neck, head and bill, trailing legs, a tail, and two wings hinged at the shoulder with an elbow and
a wrist, the stork's wing ending in splayed finger-like primaries. One wingbeat is animated (a slower, deliberate
downstroke that reaches a little forward; a quicker upstroke in which the arm rises first and the hand trails back and
down from a flexed wrist; the body rising a little on the downstroke), every frame is projected orthographically through
one fixed camera (from the ground, a little below and behind the bird), rasterised at high resolution with
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

def turn(axis, a):
    """Rotation by angle a about an axis (Rodrigues)."""
    x, y, z = unit(axis); K = np.array([[0, -z, y], [z, 0, -x], [-y, x, 0]])
    return np.eye(3) + math.sin(a) * K + (1 - math.cos(a)) * K @ K

def between(Ra, Rb, k):
    """k rotations evenly between Ra and Rb (exclusive): the frames that fill a bent joint without a gap."""
    Q = Ra.T @ Rb; a = math.acos(max(-1.0, min(1.0, (np.trace(Q) - 1) / 2)))
    if a < 1e-5: return [Ra] * k
    ax = np.array([Q[2, 1] - Q[1, 2], Q[0, 2] - Q[2, 0], Q[1, 0] - Q[0, 1]])
    return [Ra @ turn(ax, a * j / (k + 1)) for j in range(1, k + 1)]

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
    a length of tube, a panel of wing, a length of feather). Every solid carries a tag ("body", "near", "far") that
    only the debugging views use."""
    def __init__(self): self.solids, self.tags = [], []

    def add(self, P, tag="body"): self.solids.append(np.asarray(P, float)); self.tags.append(tag)

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
        for i in range(len(rings) - 1): self.add(np.vstack([rings[i], rings[i + 1]]))
        if caps:
            for i in (0, -1):
                if min(ry[i], rzz[i]) > 0.35: self.ball(C[i], ry[i], rzz[i])

    def ball(self, c, r, rz=None, n=10):
        th, ph = np.meshgrid(np.linspace(0, math.pi, n), np.linspace(0, TAU, 2 * n, endpoint=False))
        rz = r if rz is None else rz
        self.add(np.asarray(c, float) + np.stack([r * np.sin(th) * np.cos(ph), r * np.sin(th) * np.sin(ph), rz * np.cos(th)], -1).reshape(-1, 3))


# ---------------------------------------------------------------- the wingbeat
def warp(ph, down):
    """Stroke clock u: 0 -> 1/2 over the downstroke (0 <= ph < down), 1/2 -> 1 over the upstroke, smooth and periodic,
    so a longer `down` gives a slower, more deliberate downstroke and a quicker recovery."""
    k = (down - 0.5) / ((1 - math.cos(TAU * down)) / 2)
    return ph - k * (1 - math.cos(TAU * ph)) / 2

def bump(u, centre, half):
    """A smooth periodic bump on the stroke clock: 1 at centre, 0 beyond +-half."""
    d = (u - centre + 0.5) % 1 - 0.5
    return math.cos(math.pi * d / (2 * half)) ** 2 if abs(d) < half else 0.0

def beat(ph, m):
    """The pose at phase ph (0 = wings at the top, about to sweep down). m: the bird's motion settings.
    Downstroke (u 0 -> 1/2): the extended wing sweeps down and a little forward, its hand lagging (bent up by the air).
    Upstroke (u 1/2 -> 1): the arm rises first (its clock runs ahead), the wrist flexes so the hand sweeps back, and the
    hand trails down from the wrist (an inverted V) before it flicks up into the extended wing at the top."""
    u = warp(ph, m["down"]) % 1.0
    ua = u + m.get("adv", 0.12) * math.sin(TAU * (u - 0.5)) if u > 0.5 else u   # arm clock, ahead on the upstroke
    c, s = math.cos(TAU * ua), math.sin(TAU * u)
    fold = bump(u, *m["fold"])                                   # wrist flexion: hand swept back, span shortened
    droop = bump(u, *m["droop"])                                 # hand trailing down from the wrist
    return dict(
        elev=rad((m["top"] + m["bottom"]) / 2 + (m["top"] - m["bottom"]) / 2 * c),
        fold=fold,
        hand=rad(m["lag"] * max(0.0, s) ** 1.2 - m["sag"] * droop + m.get("hand0", 0)),
        elbow=rad(m.get("elbow_lag", 0) * max(0.0, s) ** 1.2 + m.get("elbow_up", 0) * droop),
        sweep=rad(-m["protract"] * bump(u, *m.get("protract_at", (0.42, 0.26))) + m.get("retract", 0) * fold),
        lift=-m["bob"] * math.cos(TAU * u),                      # the body rises on the downstroke, settles on the upstroke
        load=max(0.0, s) ** 1.5,                                 # air pressure on the primaries (they curl up under it)
    )


# ---------------------------------------------------------------- a wing
def wing(sh, W, pose):
    """Both wings. W: the bird's wing spec, built as the left wing (outward = +y) and mirrored for the right.
    The wing is a chain of stations (a point on the bone, the bone's frame, the chord ahead of and behind it); each
    panel between two stations is a thin convex slab, deep at the leading edge, thin and a little cambered at the
    trailing edge. Bent joints get extra stations with frames in between, so the outline stays closed and smooth."""
    f = pose["fold"]; S = np.array(W["shoulder"], float); Lh, Lf, Lm = W["len"]; fs = W["fold_sweep"]
    R0 = Rx(pose["elev"]) @ Rz(rad(W["sweep"][0] + fs[0] * f) + pose["sweep"])
    E = S + R0 @ [0, Lh, 0]
    R1 = R0 @ Rz(rad(W["sweep"][1] + fs[1] * f)) @ Rx(pose["elbow"])
    Wr = E + R1 @ [0, Lf, 0]
    R2 = R1 @ Rz(rad(W["sweep"][2] + fs[2] * f)) @ Rx(pose["hand"])
    narrow = 1 - W.get("narrow", 0.3) * f                        # the folded hand's feathers slide together
    st = []                                                      # (point, frame, lead, trail, half-thickness)
    def seg(o, R, L, rows, th, k=1.0):
        for t, lead, trail in rows: st.append((o + R @ [0, t * L, 0], R, lead, trail * k, th[0] + (th[1] - th[0]) * t))
    def joint(o, Ra, Rb, a, b, n=4):
        for j, R in enumerate(between(Ra, Rb, n)):
            w = (j + 1) / (n + 1); st.append((o, R, a[2] + (b[2] - a[2]) * w, a[3] + (b[3] - a[3]) * w, a[4] + (b[4] - a[4]) * w))
    th = W["thick"]
    seg(S, R0, Lh, W["arm"][0], th[0:2]); a = st[-1]
    seg(E, R1, Lf, W["arm"][1], th[1:3]); b = st[len(st) - len(W["arm"][1])]
    st[len(st) - len(W["arm"][1]):len(st) - len(W["arm"][1])] = []          # (placeholder: joints added below)
    st = []
    seg(S, R0, Lh, W["arm"][0], th[0:2]); a = st[-1]
    tmp = []; st, keep = tmp, st
    seg(E, R1, Lf, W["arm"][1], th[1:3]); fore = st; st = keep
    joint(E, R0, R1, a, fore[0], 3); st += fore; a = st[-1]
    tmp = []; st, keep = tmp, st
    seg(Wr, R2, Lm, W["hand"], th[2:4], narrow); hand = st; st = keep
    joint(Wr, R1, R2, a, hand[0], 5); st += hand
    cam = W.get("camber", 0.08); parts = []
    for (o0, R0_, l0, t0, h0), (o1, R1_, l1, t1, h1) in zip(st[:-1], st[1:]):
        q = []
        for o, R, l, t, h in ((o0, R0_, l0, t0, h0), (o1, R1_, l1, t1, h1)):
            n_ = R @ [0, 0, 1.0]; le = o + R @ [l, 0, 0]; te = o + R @ [-t, 0, -cam * t]
            q += [le + n_ * h, le - n_ * h, te + n_ * h * 0.3, te - n_ * h * 0.3]
        parts.append(np.array(q))
    # feathers beyond the hand: the stork's splayed fingers, or a few graduated tips on a pointed wing. Each fans from
    # the hand, closes up as the wrist flexes, and curls up a little under the load of the downstroke.
    P = W.get("feathers")
    if P:
        k = len(P["angle"]); fan = 1 - P.get("close", 0.6) * f; mean = float(np.mean(P["angle"]))
        for j in range(k):
            a_ = rad(mean + (P["angle"][j] - mean) * fan + P.get("fold_angle", 0) * f)
            root = Wr + R2 @ [P["root_x"][j], P["root_t"][j] * Lm, 0]
            Rf = R2 @ Rz(a_)
            L, w = P["length"][j] * (1 - P.get("shorten", 0.0) * f), P["width"][j]
            prof = P["profile"][j] if isinstance(P["profile"][0], list) else P["profile"]
            curl = P.get("curl", 0) * pose["load"] + P.get("curl0", 0); ns = len(prof) - 1
            ctr, frames = [root], []
            for i in range(ns):
                Ri = Rf @ Rx(curl * (i + 0.5) / ns); frames.append(Ri); ctr.append(ctr[-1] + Ri @ [0, L / ns, 0])
            h = P.get("depth", 0.5)
            for i in range(ns):
                Ri = frames[i]; side = Ri @ [1.0, 0, 0]; nrm = Ri @ [0, 0, 1.0]
                q = [ctr[i] + side * w / 2 * prof[i], ctr[i + 1] + side * w / 2 * prof[i + 1], ctr[i + 1] - side * w / 2 * prof[i + 1], ctr[i] - side * w / 2 * prof[i]]
                parts.append(np.array([p_ + nrm * h * sg for p_ in q for sg in (1, -1)]))
    for mirror, tag in ((1, "far"), (-1, "near")):
        for Q in parts: sh.add(Q * [1, mirror, 1.0], tag)


# ---------------------------------------------------------------- the birds
def stork(ph):
    """White / painted stork: neck straight out, long straight heavy bill, legs trailing well past a short tail, broad
    rectangular wings ending in splayed fingers. A shallow, unhurried beat."""
    m = dict(down=0.58, top=30, bottom=-6, adv=0.13, lag=8, sag=34, hand0=2, elbow_lag=2, elbow_up=10,
             fold=(0.76, 0.2), droop=(0.79, 0.17), protract=12, retract=4, bob=1.6)
    p = beat(ph, m); sh = Shape()
    # body: a deep oval, slightly arched, full underneath, running back into the rump
    sh.tube([(-26, 0, 2.2), (-18, 0, 1.0), (-8, 0, -0.2), (3, 0, -0.6), (13, 0, 0.0), (21, 0, 1.0)],
            r=[6.0, 9.6, 11.6, 12.0, 10.4, 7.4], rz=[5.0, 8.6, 11.0, 11.6, 10.2, 7.8])
    # neck held straight forward, a little below the line of the back, full where it leaves the body; head; heavy bill
    sh.tube([(16, 0, 1.6), (30, 0, 0.4), (44, 0, -1.2), (56, 0, -2.6)], r=[8.0, 5.8, 5.0, 4.8])
    sh.tube([(53, 0, -2.4), (58, 0, -2.2), (62.5, 0, -3.0), (65.5, 0, -3.8)], r=[5.2, 5.6, 4.8, 3.8], rz=[5.2, 5.8, 5.0, 4.0])
    sh.tube([(63, 0, -3.4), (75.5, 0, -5.6), (88.5, 0, -7.8)], r=[2.8, 1.8, 0.3], rz=[4.4, 2.8, 0.45], n=6)
    # short tail, broad and rounded at the end, flat but with some depth where it leaves the rump
    sh.tube([(-22, 0, 2.4), (-31, 0, 2.2), (-39, 0, 1.9), (-44.5, 0, 1.7)], r=[7.0, 8.6, 7.4, 3.0], rz=[4.4, 2.6, 1.6, 1.1], n=5)
    # legs: thighs under the belly, then shank and foot trailing straight back, the toes a little splayed
    for y in (3.4, -3.4):
        sh.tube([(-6, y * 1.2, -7.5), (-17, y, -9.0)], r=[4.0, 2.5], n=3)
        sh.tube([(-17, y, -9.0), (-47, y * 0.85, -10.8), (-81, y * 0.75, -12.6)], r=[2.2, 2.0, 1.7], n=5)
        sh.ball((-47, y * 0.85, -10.8), 2.2)
        for dy, dz, L in ((0.0, -0.4, 8.0), (1.6, 0.6, 6.5), (-1.6, -1.3, 6.8)):
            sh.tube([(-81, y * 0.75, -12.6), (-81 - L, y * 0.75 + dy * np.sign(y), -12.6 + dz)], r=[1.4, 0.75], n=2)
    wing(sh, dict(
        shoulder=(8, 6.5, 4.5), len=(21, 31, 15), sweep=(12, -8, 4), fold_sweep=(6, -16, 46), narrow=0.25, camber=0.07,
        arm=[[(0, 7, 22), (0.5, 6, 30), (1, 4.6, 33)], [(0, 4.6, 33), (0.4, 3.6, 34.5), (0.75, 3.0, 34), (1, 2.6, 33)]],
        hand=[(0, 2.6, 31), (0.5, 2.2, 27), (1, 1.6, 21)],
        thick=[2.6, 2.0, 1.4, 0.9],
        feathers=dict(                                           # the five emarginated outer primaries, splayed
            angle=[-6, 6, 18, 31, 45, 60], root_t=[1.0, 0.92, 0.8, 0.66, 0.5, 0.3], root_x=[-0.5, -2, -4, -6.5, -9, -12],
            length=[27, 33, 34, 32, 29, 24], width=[6.6, 7.6, 8.0, 8.4, 9.6, 12],
            profile=[[1, 1, 0.95, 0.62, 0.5, 0.42, 0.3, 0]] * 5 + [[1, 1, 1, 0.95, 0.85, 0.7, 0.45, 0]],
            curl=0.22, curl0=0.04, close=0.72, fold_angle=-10, depth=0.6),
    ), p)
    return sh, p["lift"]


def flamingo(ph):
    """Greater flamingo: very long thin neck held out and drooping a little, the bill bent down, very long thin legs
    trailing straight behind, a slim body, narrower pointed wings."""
    m = dict(down=0.57, top=38, bottom=-14, adv=0.12, lag=8, sag=34, hand0=1, elbow_lag=2, elbow_up=10,
             fold=(0.76, 0.2), droop=(0.79, 0.17), protract=10, retract=4, bob=1.4)
    p = beat(ph, m); sh = Shape()
    sh.tube([(-22, 0, 1.5), (-14, 0, 0.6), (-3, 0, -0.2), (8, 0, 0.0), (16, 0, 0.8)], r=[3.0, 6.8, 8.4, 7.6, 5.2], rz=[2.8, 6.4, 8.0, 7.4, 5.0])
    sh.tube([(13, 0, 1.0), (30, 0, 0.6), (48, 0, -1.6), (64, 0, -4.6), (74, 0, -6.6)], r=[4.8, 3.0, 2.6, 2.5, 2.6], n=10)
    sh.tube([(72.5, 0, -6.3), (75.5, 0, -6.0), (78.5, 0, -6.6)], r=[3.2, 3.6, 3.0], n=4)
    # the bill: deep at the base, straight for half its length, then bent sharply down
    sh.tube([(78, 0, -6.4), (83.5, 0, -7.4), (87.0, 0, -9.6), (88.6, 0, -13.4)], r=[2.2, 1.8, 1.1, 0.35], rz=[3.0, 2.3, 1.4, 0.4], n=6)
    # tail: short, a little wedge
    sh.tube([(-18, 0, 1.6), (-25, 0, 1.4), (-30.5, 0, 1.2)], r=[4.6, 4.4, 1.2], rz=[2.4, 1.4, 0.8], n=4)
    for y in (2.4, -2.4):
        sh.tube([(-6, y * 1.3, -5.5), (-15, y, -6.8)], r=[2.8, 1.6], n=3)
        sh.tube([(-15, y, -6.8), (-48, y * 0.8, -8.4), (-82, y * 0.7, -9.6)], r=[1.35, 1.15, 1.0], n=5)
        sh.ball((-48, y * 0.8, -8.4), 1.55)
        # webbed foot, toes trailing
        sh.tube([(-81.5, y * 0.7, -9.6), (-85.5, y * 0.7, -10.2), (-89.4, y * 0.7, -10.9)], r=[1.2, 2.2, 0.5], rz=[1.0, 0.9, 0.4], n=3)
    wing(sh, dict(
        shoulder=(7, 5.0, 4.0), len=(17, 24, 36), sweep=(12, -8, 10), fold_sweep=(6, -16, 44), narrow=0.3, camber=0.07,
        arm=[[(0, 5.5, 14), (0.5, 4.6, 19), (1, 3.6, 20.5)], [(0, 3.6, 20.5), (0.5, 2.8, 20.5), (1, 2.2, 19.5)]],
        hand=[(0, 2.2, 19), (0.25, 2.0, 17.5), (0.5, 1.7, 14.5), (0.7, 1.4, 10.5), (0.85, 1.0, 6.5), (0.95, 0.6, 3.0), (1.0, 0.2, 0.6)],
        thick=[2.2, 1.6, 1.1, 0.6],
        feathers=dict(                                           # a few graduated primary tips, slightly parted
            angle=[3, 9, 16], root_t=[0.6, 0.5, 0.4], root_x=[-1.5, -4.0, -6.5],
            length=[16.5, 16.0, 14.5], width=[4.2, 4.8, 5.2], profile=[1, 1, 0.9, 0.7, 0.45, 0],
            curl=0.1, close=0.6, depth=0.45),
    ), p)
    return sh, p["lift"]


def parrot(ph):
    """Rose-ringed parakeet: compact body, round head, a short hooked beak, a long graduated pointed tail, pointed
    swept-back wings. A quick, deep beat."""
    m = dict(down=0.56, top=44, bottom=-26, adv=0.12, lag=7, sag=30, hand0=0, elbow_lag=2, elbow_up=10,
             fold=(0.76, 0.2), droop=(0.79, 0.17), protract=8, retract=4, bob=0.9)
    p = beat(ph, m); sh = Shape()
    sh.tube([(-15, 0, 0.6), (-8, 0, 0.0), (2, 0, 0), (12, 0, 0.6), (20, 0, 1.8)], r=[4.6, 7.0, 8.4, 7.8, 6.0], rz=[4.4, 6.6, 8.0, 7.6, 6.2])
    sh.ball((25, 0, 3.0), 6.9, 6.6)
    # the beak: a stout hooked upper mandible and a small lower one
    sh.tube([(29.5, 0, 4.4), (33.6, 0, 3.7), (36.4, 0, 1.6), (36.8, 0, -1.2), (35.6, 0, -2.6)], r=[2.2, 1.9, 1.45, 0.9, 0.35], rz=[3.0, 2.5, 1.8, 1.1, 0.35], n=5)
    sh.tube([(29.5, 0, 0.2), (32.8, 0, -0.6), (35.2, 0, -1.4)], r=[2.0, 1.6, 0.9], rz=[2.4, 1.8, 0.9], n=3)
    # the tail: a long graduated wedge, full where it leaves the rump and tapering to the two long central feathers
    sh.tube([(-10, 0, 0.4), (-20, 0, -0.2), (-32, 0, -0.9), (-46, 0, -1.6), (-58, 0, -2.2), (-66, 0, -2.6)],
            r=[6.0, 5.0, 3.8, 2.5, 1.3, 0.25], rz=[4.6, 3.0, 1.8, 1.1, 0.7, 0.25], n=6)
    wing(sh, dict(
        shoulder=(6, 4.6, 4.0), len=(11, 15, 25), sweep=(14, -6, 18), fold_sweep=(6, -18, 42), narrow=0.3, camber=0.07,
        arm=[[(0, 5.0, 12), (0.5, 4.2, 14), (1, 3.4, 14.5)], [(0, 3.4, 14.5), (0.5, 2.6, 14), (1, 2.0, 13)]],
        hand=[(0, 2.0, 12.5), (0.3, 1.8, 11), (0.55, 1.5, 8.5), (0.75, 1.1, 5.5), (0.9, 0.7, 2.6), (1.0, 0.2, 0.5)],
        thick=[2.0, 1.4, 1.0, 0.5],
    ), p)
    return sh, p["lift"]


BIRDS = {
    # cycle_sec, frames per cycle, and the union x extent in model units (the old birds' size, so scenes need no
    # retuning). "centre": keep the body centre at the origin and only scale to the width (the parakeet's long tail
    # puts its body well right of the middle of its extent).
    "stork": dict(build=stork, cycle=1.2, frames=48, x=(-89, 89)),
    "flamingo": dict(build=flamingo, cycle=1.0, frames=48, x=(-89, 89)),
    "parrot": dict(build=parrot, cycle=0.6, frames=48, x=(-49, 52), centre=True),
}
CAMERA = dict(yaw=-8.0, pitch=18.0)     # seen from the ground: 18 degrees below the bird and 8 degrees behind it


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

def raster(polys, S, box, ss=3, close=1.0):
    """Draw at ss x the trace resolution, then average down (anti-aliasing), soften a touch and threshold."""
    x0, y0, x1, y1 = box; W, H = int((x1 - x0) * S) + 1, int((y1 - y0) * S) + 1
    im = Image.new("L", (W * ss, H * ss), 0); d = ImageDraw.Draw(im); k = S * ss
    for P in polys:
        if len(P) >= 3: d.polygon([((x - x0) * k, (y - y0) * k) for x, y in P], fill=255)
    im = im.resize((W, H), Image.Resampling.BOX).filter(ImageFilter.GaussianBlur(radius=0.9))
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


def fitted(name, cam=None):
    """Every frame's projected polygons, scaled (and for most birds shifted in x) so the union of all frames spans
    the bird's x extent. Two passes: first on the geometry, then on the rasterised outline (thickness, smoothing)."""
    B = BIRDS[name]; n = B["frames"]; C = camera(**(cam or CAMERA))
    polys = [project(*B["build"](i / n), C) for i in range(n)]
    S = 5.5 * 178 / (B["x"][1] - B["x"][0])
    for rnd in range(2):
        pts = np.vstack([P for fr in polys for P in fr]); lo, hi = pts.min(0), pts.max(0)
        box = (lo[0] - 4, lo[1] - 4, hi[0] + 4, hi[1] + 4)
        if rnd == 0: lo_x, hi_x = lo[0], hi[0]
        else:
            cols = np.flatnonzero(np.any([raster(fr, S, box).any(0) for fr in polys], axis=0))
            lo_x, hi_x = box[0] + cols[0] / S, box[0] + (cols[-1] + 1) / S
        k = (B["x"][1] - B["x"][0]) / (hi_x - lo_x); dx = 0.0 if B.get("centre") else B["x"][0] - lo_x * k
        polys = [[P * k + [dx, 0] for P in fr] for fr in polys]
    pts = np.vstack([P for fr in polys for P in fr]); lo, hi = pts.min(0), pts.max(0)
    return polys, S, (lo[0] - 4, lo[1] - 4, hi[0] + 4, hi[1] + 4)


def build(name):
    B = BIRDS[name]; polys, S, box = fitted(name); frames = []
    for i, fr in enumerate(polys):
        frames.append(trace(raster(fr, S, box), S, box))
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

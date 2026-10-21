#!/usr/bin/env python3
"""Trace a morph-animated GLB model into side-view silhouettes: one SVG path per frame, plus anchor points per frame.
The Katha kit draws these as rim-lit silhouettes (src/katha/sil.tsx), so the film stays pure SVG with no WebGL at render.

  python3 scripts/katha/trace_glb.py sources/models/Horse.glb src/katha/sil/horse.json --frames 60 --anchors horse
  python3 scripts/katha/trace_glb.py sources/models/Horse.glb src/katha/sil/horse_stand.json --stand     # standing idle

Source models (not in git; fetch with --fetch): the horse, flamingo, stork and parrot in the three.js repository
(examples/models/gltf), credited there "model by mirada from ro.me"; they come from "3 Dreams of Black" (ro.me, Google
Data Arts, 2011), whose repository (github.com/dataarts/3-dreams-of-black) states it "has been opened up with the Apache
License 2.0". Credit line for video descriptions: "Horse and bird models by Mirada, from 3 Dreams of Black (ro.me), Apache 2.0."
Needs: numpy, Pillow, potracer (pip install potracer). potracer is GPL; it is a tool here, its output is ours."""
import json, struct, sys, pathlib, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import potrace

RAW = "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/"

def load(path):
    b = open(path, "rb").read(); jl = struct.unpack("<I", b[12:16])[0]; J = json.loads(b[20:20 + jl])
    off = 20 + jl; bl = struct.unpack("<I", b[off:off + 4])[0]; BIN = b[off + 8: off + 8 + bl]
    def acc(i):
        a = J["accessors"][i]; v = J["bufferViews"][a["bufferView"]]
        n = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}[a["type"]]
        dt = {5126: np.float32, 5123: np.uint16, 5125: np.uint32, 5121: np.uint8}[a["componentType"]]
        start = v.get("byteOffset", 0) + a.get("byteOffset", 0); cnt = a["count"]
        arr = np.frombuffer(BIN, dt, count=cnt * n, offset=start)
        return arr.reshape(cnt, n) if n > 1 else arr
    p = J["meshes"][0]["primitives"][0]
    pos = acc(p["attributes"]["POSITION"]).astype(np.float64); idx = acc(p["indices"]).reshape(-1, 3)
    targets = [acc(t["POSITION"]).astype(np.float64) for t in p.get("targets", [])]
    anim = J.get("animations", [{}])[0]; times = acc(anim["samplers"][0]["input"]).tolist() if anim else []
    return pos, idx, targets, times

def poses(pos, targets, n):
    """n evenly spaced poses round the cycle, blending neighbouring morph targets (targets are deltas from the base)."""
    k = len(targets); out = []
    for i in range(n):
        u = i / n * k; a = int(u) % k; b = (a + 1) % k; t = u - int(u)
        out.append(pos + targets[a] * (1 - t) + targets[b] * t)
    return out

def raster(P, idx, W, bounds):
    (z0, z1), (y0, y1) = bounds; s = (W - 40) / (z1 - z0); Hh = int((y1 - y0) * s) + 40
    im = Image.new("L", (W, Hh), 0); d = ImageDraw.Draw(im)
    X = 20 + (P[:, 2] - z0) * s; Y = Hh - 20 - (P[:, 1] - y0) * s
    for a, b, c in idx: d.polygon([(X[a], Y[a]), (X[b], Y[b]), (X[c], Y[c])], fill=255)
    im = im.filter(ImageFilter.GaussianBlur(radius=W / 520))
    return np.array(im) > 127, s, Hh

def trace(mask, s, Hh, bounds, zmid):
    (z0, _), (y0, _) = bounds; ox, oy = 20 + (zmid - z0) * s, Hh - 20 + y0 * s
    f = lambda pt: f"{(pt.x - ox) / s:.1f} {(pt.y - oy) / s:.1f}"
    path = potrace.Bitmap(~mask).trace(turdsize=40, alphamax=1.15, opticurve=True, opttolerance=0.4)
    out = []
    for c in path:
        d = f"M {f(c.start_point)}"
        for g in c.segments: d += f" L {f(g.c)} L {f(g.end_point)}" if g.is_corner else f" C {f(g.c1)} {f(g.c2)} {f(g.end_point)}"
        out.append(d + " Z")
    return " ".join(out)

def anchors(P, zmid, kind):
    z, y = P[:, 2] - zmid, P[:, 1]; A = {}
    if kind == "horse":
        head = z > z.max() - 60
        i = np.argmax(np.where(head, z, -1e9)); A["mouth"] = [z[i], -y[i] + 6]
        i = np.argmax(np.where(head, y, -1e9)); A["poll"] = [z[i], -y[i]]
        body = (z > -60) & (z < 40); i = np.argmax(np.where(body, y, -1e9)); A["withers"] = [z[i], -y[i]]
        chest = (z > z.max() - 120) & (y < 130); i = np.argmax(np.where(chest, z, -1e9)); A["chest"] = [z[i], -y[i]]
    return {k: [round(float(v[0]), 1), round(float(v[1]), 1)] for k, v in A.items()}


def stand_cycle(path, n=24):
    """A standing horse built from a gallop: each leg grafted from the keyframe where it hangs most nearly vertical,
    straightened under its shoulder or hip, the body pitched level, the tail let down; then an idle cycle of n poses
    (a slow nod of the head and neck, the tail swaying)."""
    pos, idx, targets, times = load(path)
    frames = [pos + t for t in targets]
    allp = np.vstack(frames); 
    # body frame: the one whose back is most level (withers vs croup height)
    def level(P):
        z = P[:,2]
        fr = P[(z > -10) & (z < 40)][:,1].max(); bk = P[(z < -80) & (z > -150)][:,1].max(); return abs(fr - bk)
    bodyk = int(np.argmin([level(P) for P in frames])); print("body frame", bodyk)
    B = frames[bodyk].copy()
    LEG_TOP = 105.0
    # legs = connected pieces of the mesh below the belly (vertex identity is fixed across frames)
    base_y = pos[:,1]; LOW = 72.0
    low = base_y < LOW
    parent = list(range(len(pos)))
    # weld: vertices at the same base position are one vertex (the export splits them at UV seams)
    key = {}
    for v in range(len(pos)):
        k = tuple(np.round(pos[v], 2)); key.setdefault(k, []).append(v)
    def find(i):
        while parent[i] != i: parent[i] = parent[parent[i]]; i = parent[i]
        return i
    for group in key.values():
        for v in group[1:]: parent[find(v)] = find(group[0])
    for tri in idx:
        for a_, b_ in ((tri[0], tri[1]), (tri[1], tri[2]), (tri[0], tri[2])):
            if low[a_] and low[b_]: parent[find(a_)] = find(b_)
    comps = {}
    for v in np.where(low)[0]: comps.setdefault(find(v), []).append(v)
    comps = sorted(comps.values(), key=len, reverse=True)
    print("components below the belly:", [ (len(c), round(pos[c][:,2].mean()), round(pos[c][:,0].mean())) for c in comps[:8]])
    legs = [np.array(c) for c in comps if len(c) > 20][:4]
    print("legs:", [(len(c), round(pos[c][:,2].mean()), round(pos[c][:,0].mean())) for c in legs])
    out = B.copy()
    for L in legs:
        best, bk = 1e9, 0
        for k, P in enumerate(frames):
            Q = P[L]; hoof = Q[np.argmin(Q[:,1])]; topz = Q[Q[:,1] > np.percentile(Q[:,1], 85)][:,2].mean()
            score = abs(hoof[2] - topz)
            if score < best: best, bk = score, k
        P = frames[bk]
        # the leg's own top band, to align it with the body frame
        top = L[base_y[L] > LOW - 18]
        shift = (B[top] - P[top]).mean(0)
        w = np.clip((LOW - base_y[L]) / 18, 0, 1)[:, None]
        G = P[L] + shift
        # straighten: rotate the grafted leg about its top so the hoof sits under it (z-y plane), fully at the hoof
        T = G[w[:, 0] < 0.2].mean(0) if (w[:, 0] < 0.2).any() else G[np.argmax(G[:,1])]
        Hh = G[np.argmin(G[:,1])]; ang = np.arctan2(Hh[2] - T[2], T[1] - Hh[1])
        rel = G - T; u = w[:, 0] ** 0.7; a = -ang * u
        G2 = G.copy(); G2[:,2] = T[2] + rel[:,2] * np.cos(a) + rel[:,1] * np.sin(a); G2[:,1] = T[1] - rel[:,2] * np.sin(a) + rel[:,1] * np.cos(a)
        out[L] = w * G2 + (1 - w) * B[L]
        print("leg z", round(pos[L][:,2].mean()), "x", round(pos[L][:,0].mean()), "frame", bk, "score", round(best, 1))
    # level the body: pitch the whole horse so the front and hind hooves stand on one ground line
    front = [L for L in legs if pos[L][:,2].mean() > 0]; hind = [L for L in legs if pos[L][:,2].mean() <= 0]
    fy = np.mean([out[L][:,1].min() for L in front]); fz = np.mean([out[L][np.argmin(out[L][:,1]), 2] for L in front])
    hy = np.mean([out[L][:,1].min() for L in hind]); hz = np.mean([out[L][np.argmin(out[L][:,1]), 2] for L in hind])
    pitch = np.arctan2(fy - hy, fz - hz); c0 = out.mean(0); rel = out - c0
    out[:,2] = c0[2] + rel[:,2] * np.cos(-pitch) - rel[:,1] * np.sin(-pitch); out[:,1] = c0[1] + rel[:,2] * np.sin(-pitch) + rel[:,1] * np.cos(-pitch)
    print("pitch", round(np.degrees(pitch), 1))
    STAND = out.copy()
    def rot_zy(P, mask, piv, ang):          # rotate masked vertices about piv in the z-y plane (y up); ang may be per-vertex
        rel = P[mask] - piv; c, s_ = np.cos(ang), np.sin(ang)
        P[mask, 2] = piv[2] + rel[:,2] * c - rel[:,1] * s_; P[mask, 1] = piv[1] + rel[:,2] * s_ + rel[:,1] * c
    tail = (STAND[:,2] < STAND[:,2].min() + 75) & (STAND[:,1] > 115)
    head = (pos[:,2] > 40) & (pos[:,1] > 120)
    def idle(ph):
        P = STAND.copy()
        dock = P[tail][np.argmax(P[tail][:,2])].copy(); dist = np.clip((dock[2] - P[tail][:,2]) / 70, 0, 1)
        rot_zy(P, tail, dock, np.radians(62 + 6 * np.sin(ph + 1.0)) * dist)
        withers = P[(pos[:,2] > -10) & (pos[:,2] < 40)][np.argmax(P[(pos[:,2] > -10) & (pos[:,2] < 40)][:,1])].copy()
        dz = np.clip((P[head][:,2] - withers[2]) / 90, 0, 1)
        rot_zy(P, head, withers, np.radians(2.5 * np.sin(ph) + 1.5 * np.sin(2 * ph + 0.7)) * dz)
        P[:,1] -= P[:,1].min()
        return P
    idles = [idle(2 * np.pi * k / n) for k in range(n)]
    allp = np.vstack([pos + t for t in targets]); bounds = ((allp[:, 2].min(), allp[:, 2].max()), (min(0, allp[:, 1].min()), allp[:, 1].max()))
    return idles, idx, bounds, (bounds[0][0] + bounds[0][1]) / 2

if __name__ == "__main__":
    a = sys.argv[1:]
    if "--fetch" in a:
        dst = pathlib.Path("sources/models"); dst.mkdir(parents=True, exist_ok=True)
        for m in ["Horse", "Flamingo", "Stork", "Parrot"]: urllib.request.urlretrieve(RAW + m + ".glb", dst / f"{m}.glb"); print("fetched", m)
        sys.exit()
    if "--stand" in a:
        idles, idx, bounds, zmid = stand_cycle(a[0])
        res = {"source": pathlib.Path(a[0]).name, "credit": "Model by Mirada, from 3 Dreams of Black (ro.me, Google Data Arts), Apache License 2.0; via the three.js repository. Standing pose assembled from the gallop keyframes.",
               "units": "model units; +x forward, y down, ground at y = 0", "cycle_sec": 4.0, "frames": [], "anchors": []}
        for P in idles:
            m, s, Hh = raster(P, idx, 1400, bounds); res["frames"].append(trace(m, s, Hh, bounds, zmid)); res["anchors"].append(anchors(P, zmid, "horse"))
        json.dump(res, open(a[1], "w"), separators=(",", ":")); print(a[1], len(res["frames"]), "frames"); sys.exit()
    src, out = a[0], a[1]; n = int(a[a.index("--frames") + 1]) if "--frames" in a else 60; kind = a[a.index("--anchors") + 1] if "--anchors" in a else ""
    W = int(a[a.index("--width") + 1]) if "--width" in a else 1400
    pos, idx, targets, times = load(src); frames = poses(pos, targets, n)
    allp = np.vstack(frames); bounds = ((allp[:, 2].min(), allp[:, 2].max()), (min(0, allp[:, 1].min()), allp[:, 1].max())); zmid = (bounds[0][0] + bounds[0][1]) / 2
    res = {"source": pathlib.Path(src).name, "credit": "Model by Mirada, from 3 Dreams of Black (ro.me, Google Data Arts), Apache License 2.0; via the three.js repository",
           "units": "model units; +x forward (towards the head), y down, ground at y = 0", "cycle_sec": float(times[-1]) if times else 1.5,
           "frames": [], "anchors": []}
    for P in frames:
        m, s, Hh = raster(P, idx, W, bounds); res["frames"].append(trace(m, s, Hh, bounds, zmid))
        if kind: res["anchors"].append(anchors(P, zmid, kind))
    json.dump(res, open(out, "w"), separators=(",", ":")); print(out, len(res["frames"]), "frames", pathlib.Path(out).stat().st_size // 1024, "KB")

#!/usr/bin/env python3
"""Trace a morph-animated GLB model into side-view silhouettes: one SVG path per frame, plus anchor points per frame.
The Katha kit draws these as rim-lit silhouettes (src/katha/sil.tsx), so the film stays pure SVG with no WebGL at render.

  python3 scripts/katha/trace_glb.py sources/models/Horse.glb src/katha/sil/horse.json --frames 60 --anchors horse

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

if __name__ == "__main__":
    a = sys.argv[1:]
    if "--fetch" in a:
        dst = pathlib.Path("sources/models"); dst.mkdir(parents=True, exist_ok=True)
        for m in ["Horse", "Flamingo", "Stork", "Parrot"]: urllib.request.urlretrieve(RAW + m + ".glb", dst / f"{m}.glb"); print("fetched", m)
        sys.exit()
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

#!/usr/bin/env python3
"""Trace a skinned, animated GLB model into side-view silhouettes: one SVG path per frame, plus anchor points per frame.
The Katha kit draws these as rim-lit silhouettes (src/katha/sil.tsx), so a film stays pure SVG with no WebGL at render.

  python3 scripts/katha/trace_glb.py --fetch                       # the CC0 horse and its licence files, sha256 checked
  python3 scripts/katha/trace_glb.py sources/models/quaternius/horse.glb src/katha/sil/horse.json --clip Gallop --frames 36 --play-sec 1.2
  python3 scripts/katha/trace_glb.py sources/models/quaternius/horse.glb src/katha/sil/horse_stand.json --clip Idle --frames 24
  python3 scripts/katha/trace_glb.py ... --sheet out.png            # also write a contact sheet of the traced frames

Source model: the horse from Quaternius's Ultimate Animated Animal Pack, CC0 1.0 (public domain dedication), as repacked
in github.com/stepanMiller/wild-mustang (public/assets/characters/horse.glb). That repo adds a face-blaze mesh (material
Veter_Blaze) and a Trot clip under its own MIT licence; this script skips the blaze and we use only Quaternius's clips,
so the traced silhouettes derive from CC0 material only. The model is not kept in git (sources/ is ignored); --fetch
gets it. Credit is not required; the description may say "Horse model by Quaternius (CC0)".

The model is skinned (50 joints). Each frame samples the clip, poses the joints, skins the mesh (linear blend), projects
it side-on (+z forward becomes +x, y up becomes -y), rasterizes and traces with potrace. Units are scaled so a standing
horse's withers sit about 151 units above the ground, the same size as the kit's earlier horse, with x = 0 under the
barrel and y = 0 on the ground. Anchors follow fixed points on the mesh: mouth (the bit), poll, withers and chest.
cycle_sec is how long one cycle plays in the film; --play-sec slows it (the 0.6 s gallop plays over 1.2 s, a calm slow
motion like the kit's earlier horse) and clip_sec keeps the clip's own length.
History: until 21 Oct 2026 this script traced morph-target models from three.js's examples, which turned out to be
CC BY-NC-SA 3.0; those silhouettes were replaced (docs/STYLE_RESEARCH_GITHUB.md).
Needs: numpy, Pillow, potracer (pip install potracer). potracer is GPL; it is a tool here, its output is ours."""
import hashlib, json, struct, sys, pathlib, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import potrace

HORSE = {"url": "https://raw.githubusercontent.com/stepanMiller/wild-mustang/main/public/assets/characters/horse.glb",
         "sha256": "591007f38ed01f46a2141806abd2500c34b90eb3e509ce7ee56cf46d440508d3",
         "licences": {"quaternius-animals-license.txt": "https://raw.githubusercontent.com/stepanMiller/wild-mustang/main/public/assets/licenses/quaternius-animals-license.txt",
                      "wild-mustang-LICENSE.txt": "https://raw.githubusercontent.com/stepanMiller/wild-mustang/main/LICENSE"}}
SKIP_MATERIALS = {"Veter_Blaze"}     # the repo's own addition; not Quaternius CC0
WITHERS = 151.0                      # target withers height in output units

# ---------- glTF reading ----------
def read_glb(path):
    b = open(path, "rb").read(); jl = struct.unpack("<I", b[12:16])[0]; J = json.loads(b[20:20 + jl])
    off = 20 + jl; bl = struct.unpack("<I", b[off:off + 4])[0]; BIN = b[off + 8: off + 8 + bl]
    def acc(i):
        a = J["accessors"][i]; v = J["bufferViews"][a["bufferView"]]
        n = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT4": 16}[a["type"]]
        dt = {5126: np.float32, 5123: np.uint16, 5125: np.uint32, 5121: np.uint8}[a["componentType"]]
        arr = np.frombuffer(BIN, dt, count=a["count"] * n, offset=v.get("byteOffset", 0) + a.get("byteOffset", 0)).astype(np.float64 if dt == np.float32 else np.int64)
        if a.get("normalized"): arr = arr / {5121: 255.0, 5123: 65535.0}[a["componentType"]]
        return arr.reshape(a["count"], n) if n > 1 else arr
    return J, acc

def quat_mat(q):
    x, y, z, w = q
    return np.array([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
                     [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
                     [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]])

def trs(t, r, s):
    M = np.eye(4); M[:3, :3] = quat_mat(r) * np.asarray(s)[None, :]; M[:3, 3] = t; return M

def slerp(a, b, u):
    a, b = np.asarray(a), np.asarray(b); d = float(np.dot(a, b))
    if d < 0: b, d = -b, -d
    if d > 0.9995: q = a + u * (b - a); return q / np.linalg.norm(q)
    th = np.arccos(d); return (np.sin((1 - u) * th) * a + np.sin(u * th) * b) / np.sin(th)

class Skinned:
    """A skinned glTF model: node hierarchy, one skin, the mesh primitives (minus SKIP_MATERIALS), named clips."""
    def __init__(self, path):
        J, acc = read_glb(path); self.J = J
        N = J["nodes"]; self.names = [n.get("name", str(i)) for i, n in enumerate(N)]
        self.rest = [(np.array(n.get("translation", [0, 0, 0]), float), np.array(n.get("rotation", [0, 0, 0, 1]), float), np.array(n.get("scale", [1, 1, 1]), float)) for n in N]
        self.parent = [-1] * len(N)
        for i, n in enumerate(N):
            for c in n.get("children", []): self.parent[c] = i
        self.order = []                               # parents before children
        def visit(i): self.order.append(i); [visit(c) for c in N[i].get("children", [])]
        for r in J["scenes"][J.get("scene", 0)]["nodes"]: visit(r)
        sk = J["skins"][0]; self.joints = sk["joints"]; self.ibm = acc(sk["inverseBindMatrices"]).reshape(-1, 4, 4).transpose(0, 2, 1)
        mesh_node = next(i for i, n in enumerate(N) if "skin" in n and "mesh" in n)
        P, JT, WT, IDX, MAT = [], [], [], [], []
        for pr in J["meshes"][N[mesh_node]["mesh"]]["primitives"]:
            mat = J["materials"][pr["material"]]["name"] if "material" in pr else ""
            if mat in SKIP_MATERIALS: continue
            p = acc(pr["attributes"]["POSITION"]); base = sum(len(x) for x in P)
            P.append(p); JT.append(acc(pr["attributes"]["JOINTS_0"]).astype(int)); WT.append(acc(pr["attributes"]["WEIGHTS_0"]))
            IDX.append(acc(pr["indices"]).reshape(-1, 3) + base); MAT += [mat] * len(p)
        self.pos = np.vstack(P); self.jt = np.vstack(JT); self.wt = np.vstack(WT); self.idx = np.vstack(IDX); self.mat = np.array(MAT)
        self.wt = self.wt / self.wt.sum(1, keepdims=True)
        self.clips = {}
        for an in J.get("animations", []):
            ch = []
            for c in an["channels"]:
                s = an["samplers"][c["sampler"]]
                ch.append((c["target"]["node"], c["target"]["path"], acc(s["input"]), acc(s["output"]), s.get("interpolation", "LINEAR")))
            self.clips[an["name"]] = (ch, max(float(x[2].max()) for x in ch))

    def pose(self, clip, t):
        """World matrices of every node at time t of the clip."""
        T = [list(r) for r in self.rest]; ch, dur = self.clips[clip]
        for node, path, ti, out, interp in ch:
            k = {"translation": 0, "rotation": 1, "scale": 2}.get(path)
            if k is None: continue
            if interp == "CUBICSPLINE": out = out.reshape(len(ti), 3, -1)[:, 1]
            if t <= ti[0]: v = out[0]
            elif t >= ti[-1]: v = out[-1]
            else:
                j = int(np.searchsorted(ti, t)) - 1; u = (t - ti[j]) / (ti[j + 1] - ti[j])
                if interp == "STEP": v = out[j]
                elif k == 1: v = slerp(out[j], out[j + 1], u)
                else: v = out[j] * (1 - u) + out[j + 1] * u
            T[node][k] = np.asarray(v, float)
        Wd = [None] * len(T)
        for i in self.order:
            L = trs(*T[i]); Wd[i] = L if self.parent[i] < 0 else Wd[self.parent[i]] @ L
        return Wd

    def skin(self, clip, t):
        Wd = self.pose(clip, t)
        Jm = np.stack([Wd[j] @ self.ibm[k] for k, j in enumerate(self.joints)])          # (J, 4, 4)
        ph = np.c_[self.pos, np.ones(len(self.pos))]
        out = np.zeros((len(self.pos), 3))
        for c in range(self.jt.shape[1]):
            M = Jm[self.jt[:, c]]                                                            # (V, 4, 4)
            out += self.wt[:, c:c + 1] * np.einsum("vij,vj->vi", M, ph)[:, :3]
        return out

# ---------- raster and trace (shared with scripts/katha/birds.py) ----------
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

# ---------- the horse: units, anchor points ----------
def horse_frame(m):
    """Scale and origin from the rest pose of the Idle clip: withers at WITHERS units, x = 0 under the barrel."""
    P = m.skin("Idle", 0.0)
    dom = m.jt[np.arange(len(m.jt)), m.wt.argmax(1)]; jn = np.array([m.names[m.joints[k]] for k in dom])
    body = np.isin(jn, ["Torso3", "Neck1"]); withers_y = P[body][:, 1].max()
    ground = P[:, 1].min(); S = WITHERS / (withers_y - ground)
    legs = np.char.find(jn.astype(str), "Leg") >= 0
    front = P[legs & np.char.startswith(jn.astype(str), "Front")][:, 2].mean(); hind = P[legs & np.char.startswith(jn.astype(str), "Back")][:, 2].mean()
    return S, (front + hind) / 2, ground, P, jn

def anchor_vertices(P, jn, mat):
    """Fixed vertex indices whose skinned positions are the anchors (chosen on the rest pose)."""
    z, y = P[:, 2], P[:, 1]; A = {}
    mz = np.where(mat == "Muzzle")[0]
    lo = y[mz].min() + 0.35 * (y[mz].max() - y[mz].min())           # the corner of the mouth, where the bit sits
    A["mouth"] = mz[np.argsort(np.abs(y[mz] - lo) + 0.3 * (z[mz].max() - z[mz]))[:3]]
    head = np.where((jn == "Head") & (mat != "Hair"))[0]
    A["poll"] = head[np.argsort(-(y[head] - 0.4 * np.abs(z[head] - z[head].min())))[:3]]
    body = np.where(np.isin(jn, ["Torso3", "Neck1"]))[0]
    A["withers"] = body[np.argsort(-y[body])[:3]]
    top, g = y[body].max(), P[:, 1].min()                              # the breast: front of the body at 45 to 70% of withers height
    tor = np.where(np.isin(jn, ["Torso3", "Torso2", "FrontShoulder.L", "FrontShoulder.R", "Neck1"]) & (y > g + 0.45 * (top - g)) & (y < g + 0.7 * (top - g)))[0]
    A["chest"] = tor[np.argsort(-z[tor])[:3]]
    return A

def trace_clip(src, clip, n, W=1400, play=None):
    m = Skinned(src); S, zmid, ground, _, jn = horse_frame(m); Prest = m.skin("Idle", 0.0)
    AV = anchor_vertices(Prest, jn, m.mat)
    ch, dur = m.clips[clip]
    frames = []
    for i in range(n):
        P = m.skin(clip, dur * i / n); Q = P.copy(); Q[:, 1] = (P[:, 1] - ground) * S; Q[:, 2] = (P[:, 2] - zmid) * S; frames.append(Q)
    allp = np.vstack(frames)
    bounds = ((allp[:, 2].min() - 2, allp[:, 2].max() + 2), (min(0, allp[:, 1].min()) - 2, allp[:, 1].max() + 2))
    res = {"source": "horse.glb, Quaternius Ultimate Animated Animal Pack (via stepanMiller/wild-mustang), clip " + clip,
           "credit": "Horse model by Quaternius, CC0 1.0 (public domain dedication); traced with scripts/katha/trace_glb.py",
           "units": "+x forward (towards the head), y down, ground at y = 0; standing withers about 151 units high",
           "cycle_sec": round(play or dur, 4), "clip_sec": round(dur, 4), "frames": [], "anchors": []}
    for Q in frames:
        mk, s, Hh = raster(Q, m.idx, W, bounds); res["frames"].append(trace(mk, s, Hh, bounds, 0.0))
        res["anchors"].append({k: [round(float(Q[v, 2].mean()), 1), round(float(-Q[v, 1].mean()) + (6 if k == "mouth" else 0), 1)] for k, v in AV.items()})
    return res, frames

def sheet(res, out, cols=6, cell=330):
    """Contact sheet of the traced paths (rendered by sampling the Bezier curves), with the anchors marked."""
    import re
    n = len(res["frames"]); rows = (n + cols - 1) // cols
    from PIL import ImageChops
    im = Image.new("RGB", (cols * cell, rows * cell), (236, 228, 214)); d = ImageDraw.Draw(im)
    ink = Image.new("1", im.size, 0)
    sc = cell / 400
    for i, pth in enumerate(res["frames"]):
        ox, oy = (i % cols) * cell + cell * 0.5, (i // cols) * cell + cell * 0.82
        for sub in pth.split(" Z"):
            tok = re.findall(r"[MLC]|-?\d+\.?\d*", sub)
            if not tok: continue
            pts, k, cur = [], 0, None
            while k < len(tok):
                c = tok[k]; k += 1
                if c in "ML": cur = (float(tok[k]), float(tok[k + 1])); k += 2; pts.append(cur)
                elif c == "C":
                    p1, p2, p3 = [(float(tok[k + 2 * j]), float(tok[k + 2 * j + 1])) for j in range(3)]; k += 6
                    for u in np.linspace(0.1, 1, 8):
                        a = (1 - u) ** 3; b = 3 * (1 - u) ** 2 * u; cc = 3 * (1 - u) * u * u; e = u ** 3
                        pts.append((a * cur[0] + b * p1[0] + cc * p2[0] + e * p3[0], a * cur[1] + b * p1[1] + cc * p2[1] + e * p3[1]))
                    cur = p3
            if len(pts) > 2:
                one = Image.new("1", im.size, 0); ImageDraw.Draw(one).polygon([(ox + x * sc, oy + y * sc) for x, y in pts], fill=1)
                ink = ImageChops.logical_xor(ink, one)
        im.paste((29, 18, 40), mask=ink); ink = Image.new("1", im.size, 0); d = ImageDraw.Draw(im)
        if res["anchors"]:
            for k, (x, y) in res["anchors"][i].items():
                col = {"mouth": (230, 60, 40), "poll": (40, 160, 230), "withers": (60, 200, 90), "chest": (240, 190, 40)}[k]
                d.ellipse([ox + x * sc - 4, oy + y * sc - 4, ox + x * sc + 4, oy + y * sc + 4], fill=col)
        d.line([(ox - 170, oy), (ox + 170, oy)], fill=(160, 150, 140)); d.text((ox - cell * 0.48, oy - cell * 0.78), str(i), fill=(90, 80, 70))
    im.save(out)

def fetch(dst=pathlib.Path("sources/models/quaternius")):
    dst.mkdir(parents=True, exist_ok=True); glb = dst / "horse.glb"
    urllib.request.urlretrieve(HORSE["url"], glb)
    h = hashlib.sha256(glb.read_bytes()).hexdigest()
    if h != HORSE["sha256"]: sys.exit(f"sha256 mismatch for {glb}: {h} (expected {HORSE['sha256']}); check the licence again before using it")
    for name, url in HORSE["licences"].items(): urllib.request.urlretrieve(url, dst / name)
    print("fetched", glb, "sha256 ok, with", ", ".join(HORSE["licences"]))

if __name__ == "__main__":
    a = sys.argv[1:]
    if "--fetch" in a: fetch(); sys.exit()
    src, out = a[0], a[1]
    clip = a[a.index("--clip") + 1] if "--clip" in a else "Gallop"
    n = int(a[a.index("--frames") + 1]) if "--frames" in a else 36
    play = float(a[a.index("--play-sec") + 1]) if "--play-sec" in a else None
    res, _ = trace_clip(src, clip, n, play=play)
    json.dump(res, open(out, "w"), separators=(",", ":"))
    print(out, len(res["frames"]), "frames", round(res["cycle_sec"], 3), "s", pathlib.Path(out).stat().st_size // 1024, "KB")
    if "--sheet" in a: sheet(res, a[a.index("--sheet") + 1]); print("sheet", a[a.index("--sheet") + 1])

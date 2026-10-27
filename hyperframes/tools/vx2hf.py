"""Pilot: turn MMVideo beats (public/vx/<id>/data.json) into a HyperFrames project.

usage: vx2hf.py <data.json> <out dir> [--keys z00,z01,...] [--map india.geojson]
Writes <out>/index.html (stage + one host per beat) and <out>/compositions/<key>.html (one scene per beat).
Native scene types: title, strips, counter, cards, clip, map. Others render as a labelled placeholder.
Timing follows VoxEngine: a beat's slot is sec + 0.5 s (title: + 1.1 s); an "at" phrase lands at
sec * index(phrase) / len(say), plus an optional "|frames" offset.
"""
import argparse
import html
import json
import math
import shutil
from pathlib import Path

W, H, FPS = 1920, 1080, 30
CX, TOP, BOT, CW = W / 2, 150, 880, 1640
C = dict(tan="#C9BB9C", ink="#1A1A1A", gray="#8C8C8C", red="#D62E1F", mustard="#D9A441", paper="#EFE6D2", white="#F7F3EA")
COND = "Oswald, 'DejaVu Sans', sans-serif"
TYPE = "'IBM Plex Mono', 'DejaVu Sans Mono', monospace"
e = html.escape


def fit(text, size, max_w, k=0.52):
    return min(size, max_w / (max(1, len(text)) * k + 0.8))


def slot(b):
    return round(b["sec"] + (1.1 if b["scene"]["type"] == "title" else 0.5), 3)


def at_fn(b):
    say = b["say"].lower()

    def T(x, off_frames=0):
        if x is None:
            return 0.0
        if isinstance(x, (int, float)):
            return (x + off_frames) / FPS
        p, _, o = str(x).partition("|")
        i = say.find(p.lower())
        if i < 0:
            raise SystemExit(f"phrase not in {b['key']}: {p}")
        return round(b["sec"] * i / len(b["say"]) + ((int(o) if o else 0) + off_frames) / FPS, 3)
    return T


class Scene:
    """Collects markup, CSS and GSAP lines for one beat."""

    def __init__(self, key):
        self.k, self.html, self.css, self.js, self.n = key, [], [], [], 0

    def id(self, name):
        self.n += 1
        return f"{self.k}-{name}{self.n}"

    def strip(self, x, y, start, text, size=64, fill=C["white"], color=C["ink"], rot=0, font=COND):
        i = self.id("strip")
        w = len(text) * size * (0.62 if font == TYPE else 0.52) + size * 0.8
        h = size * 1.45
        self.html.append(f'<div id="{i}" class="strip" style="left:{x - w / 2:.0f}px;top:{y - h / 2:.0f}px;width:{w:.0f}px;height:{h:.0f}px;'
                         f'background:{fill};color:{color};font-family:{font};font-size:{size:.0f}px">{e(text)}</div>')
        self.js.append(f'tl.set("#{i}", {{rotation: {rot}, opacity: 1}}, {start:.3f});')
        self.js.append(f'tl.fromTo("#{i}", {{clipPath: "inset(0% 100% 0% 0%)"}}, {{clipPath: "inset(0% 0% 0% 0%)", duration: 0.27, ease: "power3.out"}}, {start:.3f});')

    def card(self, x, y, w, h, start, fill, rot, inner):
        i = self.id("card")
        self.html.append(f'<div id="{i}" class="card" style="left:{x:.0f}px;top:{y:.0f}px;width:{w:.0f}px;height:{h:.0f}px;background:{fill}">{inner}</div>')
        self.js.append(f'tl.set("#{i}", {{opacity: 1}}, {start:.3f});')
        self.js.append(f'tl.fromTo("#{i}", {{y: 120, scale: 0.85, rotation: {rot}}}, {{y: 0, scale: 1, rotation: {rot}, duration: 0.6, ease: "back.out(1.7)"}}, {start:.3f});')
        return i

    def stamp(self, x, y, start, text, size=70, rot=-10):
        i = self.id("stamp")
        w = len(text) * size * 0.55 + 70
        self.html.append(f'<div id="{i}" class="stamp" style="left:{x - w / 2:.0f}px;top:{y - size * 0.8:.0f}px;width:{w:.0f}px;height:{size * 1.6:.0f}px;font-size:{size:.0f}px">{e(text)}</div>')
        self.js.append(f'tl.set("#{i}", {{opacity: 0.92}}, {start:.3f});')
        self.js.append(f'tl.fromTo("#{i}", {{scale: 1.5, rotation: {rot}}}, {{scale: 1, rotation: {rot}, duration: 0.35, ease: "back.out(2)"}}, {start:.3f});')

    def heading(self, text):
        if text:
            self.strip(CX, TOP + 10, 0, text, size=fit(text, 60, CW))

    def stamps(self, s, T, y=None):
        for i, st in enumerate(s.get("stamps") or []):
            size = fit(st["text"], 62, CW - 120, 0.56)
            yy = st.get("y", y if y is not None else BOT - 40 - i * 110)
            sw = len(st["text"]) * size * 0.55 + 70
            x = st.get("x", max(sw / 2 + 60, min(W - 520, W - 70 - sw / 2)))
            self.stamp(x, yy, T(st["at"]), st["text"], size, 5 if i % 2 else -6)


def fmt_js():
    return ("function fmtIN(v, d) { const [i, f] = v.toFixed(d).split('.'); const l = i.slice(-3), r = i.slice(0, -3);"
            " const s = r ? r.replace(/\\B(?=(\\d{2})+(?!\\d))/g, ',') + ',' + l : l; return f ? s + '.' + f : s; }")


def big(x, y, text, size, color=C["ink"], font=COND, extra=""):
    w = max(200, len(text) * size * 0.62)
    return (f'<div class="big" style="left:{x - w / 2:.0f}px;top:{y - size * 0.82:.0f}px;width:{w:.0f}px;font-size:{size:.0f}px;'
            f'color:{color};font-family:{font};{extra}">{e(text)}</div>')


# ---------- scene types ----------
def sc_title(S, b, s, T, D):
    S.html.append(big(430, 760, str(b["ch"]), 560, C["mustard"]).replace('class="big"', 'class="big" data-layout-ignore'))
    lab = f"CHAPTER {b['ch']}"
    i = S.id("type")
    S.html.append(f'<div id="{i}" class="typelabel" style="left:740px;top:{330 - 42:.0f}px;font-size:40px"><span id="{i}-t"></span></div>')
    S.js.append(f'tl.set("#{i}", {{opacity: 1}}, 0);')
    S.js.append(f'(() => {{ const p = {{n: 0}}, t = {json.dumps(lab)}, el = document.querySelector("#{i}-t"); '
                f'tl.fromTo(p, {{n: 0}}, {{n: t.length, duration: {len(lab) / 3 / FPS:.3f}, ease: "none", '
                f'onUpdate: () => {{ el.textContent = t.slice(0, Math.floor(p.n)); }}}}, 0); }})();')
    for j, t in enumerate(s["lines"]):
        red = j == 1 and s.get("red")
        S.strip(1200, 500 + j * 150, (4 + j * 8) / FPS, t, size=fit(t, 88, 1300), fill=C["red"] if red else C["white"], color=C["white"] if red else C["ink"])


def sc_strips(S, b, s, T, D):
    S.heading(s.get("heading"))
    k = len(s["items"]); gap = 165
    y0 = (TOP + BOT) / 2 - (k - 1) * gap / 2 + (60 if s.get("heading") else 0)
    for i, it in enumerate(s["items"]):
        S.strip(CX, y0 + i * gap, T(it["at"]), it["text"], size=fit(it["text"], 84, CW),
                fill=C["red"] if it.get("red") else C["white"], color=C["white"] if it.get("red") else C["ink"], rot=[-1, 1, -0.5, 0.8][i % 4])
    S.stamps(s, T)


def fmt_in(v, d=0):
    i, _, f = f"{v:.{d}f}".partition(".")
    last3, rest = i[-3:], i[:-3]
    out = ""
    while len(rest) > 2:
        out = "," + rest[-2:] + out
        rest = rest[:-2]
    s = (rest + out + "," + last3) if rest or out else last3
    return f"{s}.{f}" if f else s


def sc_counter(S, b, s, T, D):
    S.heading(s.get("heading"))
    txt = f"{s.get('prefix', '')}{fmt_in(s['to'], s.get('decimals', 0))}{s.get('suffix', '')}"
    size = fit(txt, 260, CW, 0.5); start = T(s["at"])
    i = S.id("num")
    S.html.append(f'<div id="{i}" class="big" style="left:0;top:{600 - size * 0.82:.0f}px;width:{W}px;font-size:{size:.0f}px;color:{C["red"]};font-family:{COND};font-variant-numeric:tabular-nums;opacity:0"></div>')
    S.js.append(f'tl.set("#{i}", {{opacity: 1}}, {start:.3f});')
    S.js.append(f'(() => {{ const p = {{v: 0}}, el = document.querySelector("#{i}"); '
                f'tl.fromTo(p, {{v: 0}}, {{v: {s["to"]}, duration: 1.0, ease: "power3.out", onUpdate: () => {{ '
                f'el.textContent = {json.dumps(s.get("prefix", ""))} + fmtIN(p.v, {s.get("decimals", 0)}) + {json.dumps(s.get("suffix", ""))}; }}}}, {start:.3f}); }})();')
    if s.get("sub"):
        S.strip(CX, 720, T(s["at"], 20), s["sub"], size=fit(s["sub"], 44, CW))
    S.stamps(s, T)


def sc_cards(S, b, s, T, D):
    S.heading(s.get("heading"))
    k = len(s["cards"]); w = min(560, (1700 - (k - 1) * 50) / k); h = 400
    x0 = CX - (k * w + (k - 1) * 50) / 2; y = 300 if s.get("heading") else 260
    for i, c in enumerate(s["cards"]):
        fill = C["mustard"] if c.get("fill") == "mustard" else C["red"] if c.get("fill") == "red" else C["white"]
        inner = big(w / 2, h * 0.25, c["top"], fit(c["top"], 38, w - 50))
        inner += big(w / 2, h * (0.6 if c.get("sub") else 0.68), c["big"], fit(c["big"], 110, w - 50, 0.5), C["ink"] if c.get("fill") == "mustard" else C["red"])
        if c.get("sub"):
            inner += big(w / 2, h * 0.85, c["sub"], fit(c["sub"], 30, w - 50, 0.62), font=TYPE)
        S.card(x0 + i * (w + 50), y, w, h, T(c["at"]), fill, [-1.5, 1.2, -1][i % 3], inner)
    S.stamps(s, T)


def sc_clip(S, b, s, T, D, assets_from=None):
    S.heading(s.get("heading"))
    c = D["clips"][s["clip"]]; pad = 22
    w = min(1640, 640 * c["w"] / c["h"]); ih = w * c["h"] / c["w"]
    x = (W - w - pad * 2) / 2; y = max(260, 540 - (ih + pad * 2) / 2)
    hl0 = T((s.get("hl") or [0])[0])
    bands = "".join(f'<div id="{S.k}-hl{i}" class="hl" style="left:{pad + hx * w:.0f}px;top:{pad + hy * ih:.0f}px;width:{hw * w:.0f}px;height:{hh * ih:.0f}px"></div>'
                    for i, (hx, hy, hw, hh) in enumerate(c["hl"]))
    tape = (f'<div class="tape" style="left:-30px;top:-24px;width:130px;transform:rotate(-14deg)"></div>'
            f'<div class="tape" style="left:{w + pad * 2 - 100:.0f}px;top:-20px;width:130px;transform:rotate(12deg)"></div>')
    inner = f'<img src="assets/clips/{s["clip"]}.png" style="position:absolute;left:{pad}px;top:{pad}px;width:{w:.0f}px;height:{ih:.0f}px">{bands}{tape}'
    S.card(x, y, w + pad * 2, ih + pad * 2, 2 / FPS, "#ffffff", -0.8, inner)
    for i in range(len(c["hl"])):
        S.js.append(f'tl.fromTo("#{S.k}-hl{i}", {{scaleX: 0}}, {{scaleX: 1, duration: 0.33, ease: "none"}}, {hl0 + i * 8 / FPS:.3f});')
    S.stamps(s, T, y=min(BOT, y + ih + pad * 2 + 90))


def project(ring, lon0, lat0, k, ox, oy):
    return [((lon - lon0) * k * math.cos(math.radians(22)) + ox, (lat0 - lat) * k + oy) for lon, lat in ring]


def sc_map(S, b, s, T, D, geo=None):
    """Choropleth of a value per state, from district polygons; state lines drawn where neighbouring districts differ in state."""
    S.heading(s.get("heading"))
    vals = s["values"]; vmax = max(vals.values())
    # The file mixes whole-state outlines with districts; drop districts where the state outline exists.
    whole = {f["properties"]["st_nm"] for f in geo["features"] if "district" not in f["properties"]}
    feats = [f for f in geo["features"] if f["properties"]["st_nm"] not in whole or "district" not in f["properties"]]
    lon0, lat0, lon1, lat1 = 68.0, 37.2, 97.5, 6.6
    box_w, box_h = 900, 760
    k = min(box_w / ((lon1 - lon0) * math.cos(math.radians(22))), box_h / (lat0 - lat1))
    ox, oy = 120, 250
    by_state, seg_owner = {}, {}
    for f in feats:
        st = f["properties"]["st_nm"]
        g = f["geometry"]
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        d = []
        for poly in polys:
            for ring in poly:
                pts = project(ring, lon0, lat0, k, ox, oy)
                d.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z")
                for a, c2 in zip(ring, ring[1:]):
                    key = tuple(sorted([(round(a[0], 3), round(a[1], 3)), (round(c2[0], 3), round(c2[1], 3))]))
                    seg_owner.setdefault(key, []).append(st)
        by_state.setdefault(st, []).append("".join(d))
    border, outline = [], []
    for (p, q), owners in seg_owner.items():
        if len(owners) > 1 and len(set(owners)) == 1:   # between two districts of one state: hidden
            continue
        (x1, y1), (x2, y2) = project([p, q], lon0, lat0, k, ox, oy)
        (border if len(owners) > 1 else outline).append(f"M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}")
    shade = lambda v: f"color-mix(in srgb, {C['ink']} {int(12 + 70 * v / vmax)}%, {C['paper']})"
    paths = []
    order = sorted(by_state, key=lambda st: -vals.get(st, 0))
    for j, st in enumerate(order):
        sid = f"{S.k}-st{j}"
        fill = shade(vals.get(st, 0))
        paths.append(f'<path id="{sid}" d="{"".join(by_state[st])}" fill="{fill}" stroke="{fill}" stroke-width="0.6" opacity="0"/>')
        S.js.append(f'tl.to("#{sid}", {{opacity: 1, duration: 0.25, ease: "power1.out"}}, {T(s.get("reveal", 0)) + 0.04 * j:.3f});')
    hi = []
    for h in s.get("highlight", []):
        j = order.index(h["state"]); sid = f"{S.k}-hi{j}"
        edge = []
        for (p, q), owners in seg_owner.items():
            if h["state"] in owners and not (len(owners) > 1 and len(set(owners)) == 1):
                (x1, y1), (x2, y2) = project([p, q], lon0, lat0, k, ox, oy)
                edge.append(f"M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}")
        hi.append(f'<g id="{sid}" opacity="0"><path d="{"".join(by_state[h["state"]])}" fill="{C["mustard"]}" stroke="{C["mustard"]}" stroke-width="0.8"/>'
                  f'<path d="{"".join(edge)}" fill="none" stroke="{C["red"]}" stroke-width="3" stroke-linecap="round"/></g>')
        S.js.append(f'tl.to("#{sid}", {{opacity: 1, duration: 0.3, ease: "power2.out"}}, {T(h["at"]):.3f});')
    svg = (f'<svg class="map" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
           f'<g>{"".join(paths)}</g><path d="{"".join(border)}" fill="none" stroke="{C["ink"]}" stroke-width="1.1" opacity="0.55"/>'
           f'<path d="{"".join(outline)}" fill="none" stroke="{C["ink"]}" stroke-width="1.6" opacity="0.8"/>'
           f'<g>{"".join(hi)}</g></svg>')
    S.html.append(svg)
    for i, c in enumerate(s.get("cards", [])):
        inner = big(230, 90, c["top"], fit(c["top"], 40, 420)) + big(230, 250, c["big"], 150, C["red"] if i else C["ink"])
        S.card(1180 + (i % 2) * 40, 330 + i * 300, 460, 280, T(c["at"]), C["white"] if i else C["mustard"], [-1.5, 1.2][i % 2], inner)
    S.html.append(f'<div class="source">{e(s.get("source", ""))}</div>')
    S.stamps(s, T)


SCENES = dict(title=sc_title, strips=sc_strips, counter=sc_counter, cards=sc_cards, clip=sc_clip, map=sc_map)


def captions(S, b):
    tot = sum(len(c) for c in b["cues"]); acc = 0; out = []
    for j, c in enumerate(b["cues"]):
        a = b["sec"] * acc / tot; acc += len(c); z = b["sec"] * acc / tot
        cid = f"{S.k}-cap{j}"
        out.append(f'<span id="{cid}" class="cue">{e(c)}</span>')
        S.js.append(f'tl.set("#{cid}", {{opacity: 1}}, {a:.3f});')
        if j < len(b["cues"]) - 1:
            S.js.append(f'tl.set("#{cid}", {{opacity: 0}}, {z:.3f});')
    S.html.append(f'<div class="caps">{"".join(out)}</div>')


SCENE_CSS = f"""
#root {{ position: absolute; inset: 0; overflow: hidden; }}
#root .drift {{ position: absolute; inset: 0; }}
#root .strip {{ position: absolute; opacity: 0; display: flex; align-items: center; justify-content: center; font-weight: 700;
  letter-spacing: 1px; white-space: nowrap; filter: drop-shadow(6px 9px 5px rgba(43,33,18,.35)); }}
#root .card {{ position: absolute; opacity: 0; filter: drop-shadow(6px 9px 5px rgba(43,33,18,.35)); }}
#root .big {{ position: absolute; text-align: center; font-weight: 700; line-height: 1; white-space: nowrap; }}
#root .stamp {{ position: absolute; opacity: 0; display: flex; align-items: center; justify-content: center; font-family: {COND};
  font-weight: 700; color: {C['red']}; letter-spacing: 3px; border: 9px solid {C['red']}; border-radius: 10px; white-space: nowrap; }}
#root .typelabel {{ position: absolute; opacity: 0; background: {C['white']}; padding: 6px 20px; font-family: {TYPE}; color: {C['ink']};
  filter: drop-shadow(6px 9px 5px rgba(43,33,18,.35)); min-width: 260px; height: 62px; }}
#root .hl {{ position: absolute; background: {C['mustard']}; opacity: .45; mix-blend-mode: multiply; transform-origin: left center; }}
#root .tape {{ position: absolute; height: 44px; background: #efe3b8; opacity: .85; }}
#root .map {{ position: absolute; left: 0; top: 0; }}
#root .source {{ position: absolute; right: 110px; bottom: 112px; text-align: right; font-family: {TYPE}; font-size: 28px; color: {C['ink']}; opacity: .7; }}
#root .caps {{ position: absolute; left: 160px; right: 160px; bottom: 44px; text-align: center; }}
#root .cue {{ position: absolute; left: 0; right: 0; bottom: 0; opacity: 0; margin: 0 auto; width: fit-content; max-width: 1600px;
  background: rgba(255,255,255,.82); color: #1d1d1f; font-family: Inter, sans-serif; font-size: 40px; line-height: 1.4;
  padding: 6px 16px; border-radius: 8px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }}
"""


def scene_file(b, D, geo):
    S = Scene(b["key"]); T = at_fn(b); s = b["scene"]
    fn = SCENES.get(s["type"])
    if fn is sc_map:
        fn(S, b, s, T, D, geo=geo)
    elif fn:
        fn(S, b, s, T, D)
    else:
        S.strip(CX, 540, 0, f"[{s['type'].upper()} SCENE: NOT PORTED YET]", size=60)
    if b.get("cues"):
        captions(S, b)
    dur = slot(b)
    body = "".join(S.html[:-1]) if b.get("cues") else "".join(S.html)
    caps = S.html[-1] if b.get("cues") else ""
    return f"""<template>
  <style>{SCENE_CSS}</style>
  <div id="root" data-composition-id="{b['key']}" data-width="{W}" data-height="{H}">
    <div id="{b['key']}-drift" class="drift">{body}</div>
    {caps}
  </div>
  <script>
    {fmt_js()}
    const tl = gsap.timeline({{ paused: true }});
    tl.fromTo("#{b['key']}-drift", {{scale: 1, x: 0}}, {{scale: 1.02, x: -10, duration: {dur}, ease: "none"}}, 0);
    {chr(10).join('    ' + j for j in S.js).strip()}
    window.__timelines["{b['key']}"] = tl;
  </script>
</template>
"""


def stage_svg():
    lines = "".join(f'<line x1="{i * 180}" y1="0" x2="{i * 180 + 60}" y2="{H}" stroke="#a89a7c" stroke-width="1" opacity=".35"/>' for i in range(W // 180 + 2))
    lines += "".join(f'<line x1="0" y1="{i * 190}" x2="{W}" y2="{i * 190 + 20}" stroke="#a89a7c" stroke-width="1" opacity=".35"/>' for i in range(H // 190 + 2))
    k = W / 1080
    cont = "".join(f'<path d="M -50 {180 + i * 200} C {200 * k} {180 + i * 200 - 80 + (i % 3) * 30}, {420 * k} {180 + i * 200 + 90}, {640 * k} {180 + i * 200 + 10} S {980 * k} {180 + i * 200 - 70}, {W + 70} {180 + i * 200 + 30}" fill="none" stroke="#9c8d6d" stroke-width="2" opacity=".3"/>'
                   for i in range(math.ceil(H / 200)))
    return (f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs><filter id="vgrain" x="0" y="0" width="100%" height="100%">'
            f'<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/>'
            f'<feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.22 0"/></filter></defs>'
            f'<rect width="{W}" height="{H}" fill="{C["tan"]}"/>{lines}{cont}<rect width="{W}" height="{H}" filter="url(#vgrain)"/></svg>')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("data"); ap.add_argument("out")
    ap.add_argument("--keys"); ap.add_argument("--map")
    a = ap.parse_args()
    D = json.loads(Path(a.data).read_text())
    beats = D["beats"]
    if a.keys:
        want = a.keys.split(","); beats = [b for b in beats if b["key"] in want]
    geo = json.loads(Path(a.map).read_text()) if a.map else None
    out = Path(a.out); (out / "compositions").mkdir(parents=True, exist_ok=True); (out / "assets" / "clips").mkdir(parents=True, exist_ok=True)
    (out / "assets" / "fonts").mkdir(exist_ok=True)
    (out / "assets" / "lib").mkdir(exist_ok=True)
    repo = Path(__file__).resolve().parents[2]
    shutil.copy(repo / "hyperframes" / "shared" / "lib" / "gsap.min.js", out / "assets" / "lib" / "gsap.min.js")
    font = repo / "public" / "fonts" / "Oswald-700.woff2"
    if font.exists():
        shutil.copy(font, out / "assets" / "fonts" / "Oswald-700.woff2")
    src_clips = Path(a.data).parent / "clips"
    for b in beats:
        if b["scene"]["type"] == "clip" and (src_clips / f"{b['scene']['clip']}.png").exists():
            shutil.copy(src_clips / f"{b['scene']['clip']}.png", out / "assets" / "clips")
        (out / "compositions" / f"{b['key']}.html").write_text(scene_file(b, D, geo))
    t = 0.0; hosts = []
    for z, b in enumerate(beats):
        d = slot(b)
        hosts.append(f'<div id="{b["key"]}" data-composition-id="{b["key"]}" data-composition-src="compositions/{b["key"]}.html" '
                     f'data-start="{t:.3f}" data-duration="{d}" data-track-index="1" data-track-kind="graphics" data-width="{W}" data-height="{H}"></div>')
        t += d
    total = round(t, 3)
    index = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="assets/lib/gsap.min.js"></script>
    <style>
      @font-face {{ font-family: Oswald; font-weight: 700; src: url('assets/fonts/Oswald-700.woff2') format('woff2'); }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: {C['tan']}; }}
      #stage {{ position: absolute; inset: 0; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="{W}" data-height="{H}">
      <div id="stage" data-layout-ignore>{stage_svg()}</div>
      {chr(10).join('      ' + h for h in hosts).strip()}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""
    (out / "index.html").write_text(index)
    print(f"wrote {out}: {len(beats)} scenes, {total:.1f} s")


if __name__ == "__main__":
    main()

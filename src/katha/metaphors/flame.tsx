// Katha metaphor scenes: flame (21 Oct 2026). The lamp in a windless place (6.19), the sacrificial fire (4.24-25, 4.37,
// 17.23), fire veiled by smoke and the dusty mirror (3.38), the flame that climbs to the sun (8.24-26).
// Lamplight: one warm source per shot, everything else a near-black shape rimmed by it. Soft light, haze and smoke are
// radial / linear gradients only (no blur or turbulence filters: long renders dropped tiles under them).
// 22 Oct 2026 (fix round 1, on the shared kit): every flame is the kit's Flame / Fire / Diya; the niche is a devakoshta
// (kit niche: carved pilasters, cusped top, a little shikhara) in weathered laterite ashlar, beside a jali window on the
// storm; the stair of lamps is a kit ghat under a warm moon, the lamps kindled from the temple down, each mirrored in the
// river; the yajna has carved kit pillars and a brass kalasha that catch the firelight; the smoke is curling filaments
// over the same kunda; the flame climbs a column of light to a gold sun that turns into a wheel of twelve spokes.
import React, {useId} from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {K, W, H, softStops, SoftGlow, mixHex} from "../look";
import {SceneP, Frame, push, Label} from "../stage";
import {Sky, Dust, Mood, LightFlash, Haze} from "../sky";
import {smooth, ribbon, rnd, lerp, clamp01, nrmAt, wob, polyD, streamer, Pt} from "../geom";
import {Rimmed, Item} from "../sil";
import {Flame, Fire as FireBed, Diya, diyaWick} from "../fire";
import {niche, cuspedArch, pillar, ghat, ledge, temple, RELIEF, RELIEF_LT} from "../arch";
import {peepal, coconut, palmyra, neem, khejri, reeds} from "../flora";

type V2 = [number, number];
type It = Exclude<Item, string>;
// ---------- small helpers ----------
const ease = (f: number, a: number, d: number) => interpolate(f, [a, a + Math.max(0.001, d)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const sstep = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
const bump = (f: number, a: number, up: number, down: number) => ease(f, a, up) * (1 - ease(f, a + up, down));
const uid = () => "fl" + useId().replace(/[^a-zA-Z0-9]/g, "");
const MOODS: Mood[] = ["dusk", "dawn", "night", "gold"];
const moodOf = (s: any, d: Mood): Mood => (MOODS.includes(s?.mood) ? s.mood : d);
// The cool ambient that the warm light plays against, per mood.
const AMB: Record<Mood, string> = {night: "#6E78B0", dusk: "#9A5A8A", dawn: "#7A8AC0", gold: "#B07A6A"};
// A skyline through points, closed down to the bottom of the frame (yb).
const ridge = (pts: Pt[], yb = H + 80): string => `${smooth(pts, false)} L ${pts[pts.length - 1][0]} ${yb} L ${pts[0][0]} ${yb} Z`;
// A leaf blade along a curved midline (base to tip), widest a third of the way up.
const blade = (pts: number[][], wmax: number): string => {
  const n = pts.length, L: Pt[] = [], R: Pt[] = [];
  for (let i = 1; i < n - 1; i++) {
    const u = i / (n - 1), [nx, ny] = nrmAt(pts, i), w = wmax * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.75)), 0.9);
    L.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); R.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  return smooth([[pts[0][0], pts[0][1], "c"], ...L, [pts[n - 1][0], pts[n - 1][1], "c"], ...R.reverse()], {wind: "cw"});
};
// A band whose width follows ws (one width per point): smoke filaments that pinch and swell.
const ribbonW = (pts: number[][], ws: number[]): string => {
  const L: number[][] = [], R: number[][] = [];
  pts.forEach((p, i) => { const [nx, ny] = nrmAt(pts, i), w = ws[i] / 2; L.push([p[0] + nx * w, p[1] + ny * w]); R.push([p[0] - nx * w, p[1] - ny * w]); });
  return smooth([...L, ...R.reverse()] as Pt[]);
};
const dOf = (it: Item) => (typeof it === "string" ? it : it.d);
// A kit piece's joined outline split into its parts, one item each, so a point light rims every part towards itself.
const parts = (d: string, extra: Partial<It> = {}): It[] => d.split(/(?=M )/).map((x) => x.trim()).filter(Boolean).map((x) => ({...extra, d: x}));
// The bounding box of a path's coordinate pairs (M / L / C paths only).
const bbox = (d: string): [number, number, number, number] => {
  const v = (d.match(/-?\d*\.?\d+/g) || []).map(Number);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (let i = 0; i + 1 < v.length; i += 2) { x0 = Math.min(x0, v[i]); x1 = Math.max(x1, v[i]); y0 = Math.min(y0, v[i + 1]); y1 = Math.max(y1, v[i + 1]); }
  return [x0, y0, x1, y1];
};
const circ = (x: number, y: number, rx: number, ry = rx) => `M ${(x - rx).toFixed(1)} ${y.toFixed(1)} a ${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(2 * rx).toFixed(1)} 0 a ${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(-2 * rx).toFixed(1)} 0 Z `;

// Shared soft lights, all on the film's one glow falloff (softStops).
const SMOKES: [string, string][] = [["fl-sm-warm", "#8A5446"], ["fl-sm-mid", "#4C3C56"], ["fl-sm-cool", "#2C2842"], ["fl-sm-pale", "#7A7290"], ["fl-sm-ash", "#9A92A0"]];
const FlameDefs: React.FC = () => (
  <defs>
    <radialGradient id="fl-warm">{softStops("#FFEFC4", 0.78, "#E8823A", 2.2)}</radialGradient>
    <radialGradient id="fl-soft">{softStops("#FFC877", 0.5, "#C2553A", 1.8)}</radialGradient>
    <radialGradient id="fl-hot">{softStops("#FFFDF2", 1, "#FFC877", 3)}</radialGradient>
    <radialGradient id="fl-ember">{softStops("#FFB060", 0.95, "#A0301E", 2.4)}</radialGradient>
    <radialGradient id="fl-shade"><stop offset="0" stopColor="#030108" stopOpacity={0.8}/><stop offset="0.5" stopColor="#030108" stopOpacity={0.4}/><stop offset="1" stopColor="#030108" stopOpacity={0}/></radialGradient>
    <radialGradient id="fl-cool">{softStops("#DDE2F2", 0.5, "#6B78A8", 2)}</radialGradient>
    <radialGradient id="fl-floor">{softStops("#F5A85A", 0.62, "#4A2B5C", 1.7)}</radialGradient>
    {SMOKES.map(([id, c]) => <radialGradient key={id} id={id}><stop offset="0" stopColor={c} stopOpacity={0.85}/><stop offset="0.45" stopColor={c} stopOpacity={0.55}/><stop offset="1" stopColor={c} stopOpacity={0}/></radialGradient>)}
    <linearGradient id="fl-down" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#030108" stopOpacity={0.6}/><stop offset="1" stopColor="#030108" stopOpacity={0}/></linearGradient>
    <linearGradient id="fl-fade-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={K.rim} stopOpacity={0}/><stop offset="0.5" stopColor={K.rim}/><stop offset="1" stopColor={K.rim} stopOpacity={0}/></linearGradient>
  </defs>
);
const Glow: React.FC<{x: number; y: number; rx: number; ry?: number; g?: string; o?: number}> = ({x, y, rx, ry, g = "fl-warm", o = 1}) =>
  o <= 0.002 || rx <= 0 ? null : <ellipse cx={x} cy={y} rx={rx} ry={ry ?? rx} fill={`url(#${g})`} opacity={Math.min(1, o)}/>;

// ---------- stone: an uneven, weathered laterite ashlar ----------
// Courses of uneven height, blocks of uneven length with worn corners and a slightly crooked face, each its own tone;
// laterite pores and a few cracks; the edge of each block that faces the lamp (lp) catches a thin lip of light.
const Ashlar: React.FC<{lp: V2; L: number; seed?: number; tone?: string; lit?: string; reach?: number}> = ({lp, L, seed = 1, tone = "#1B1120", lit = "#FFC98A", reach = 900}) => {
  const [lx, ly] = lp, x0 = -180, x1 = W + 180, y0 = -180, y1 = H + 180;
  const blocks: React.ReactNode[] = [], lips: React.ReactNode[] = [];
  let pits = "", cracks = "";
  for (let r = 0, y = y0; y < y1; r++) {
    const ch = (rnd(r, seed + 9) < 0.35 ? 56 : 84) + rnd(r, seed + 8) * 40;
    for (let c = 0, x = x0 - rnd(r, seed) * 240; x < x1; c++) {
      const w = 130 + rnd(r * 31 + c, seed + 2) * 250, k = r * 57 + c;
      const j = (q: number, a = 5) => (rnd(k * 9 + q, seed + 4) - 0.5) * a;
      const cut = 5 + rnd(k, seed + 5) * 10;
      const xa = x + 2.5 + j(0), xb = x + w - 2.5 + j(1), ya = y + 2.5 + j(2, 3), yb = y + ch - 2.5 + j(3, 3);
      const pts = [[xa + cut, ya], [xb - cut * 0.6, ya + j(4, 2)], [xb, ya + cut * 0.7], [xb + j(5, 2), yb - cut], [xb - cut * 0.8, yb], [xa + cut * 0.5, yb + j(6, 2)], [xa, yb - cut * 0.6], [xa + j(7, 2), ya + cut]];
      blocks.push(<path key={k} d={polyD(pts)} fill={mixHex(tone, "#2A1824", rnd(k, seed + 3) * 0.7)}/>);
      const np = Math.floor(rnd(k, seed + 6) * 5);
      for (let q = 0; q < np; q++) pits += circ(xa + 14 + rnd(k * 5 + q, seed + 7) * (w - 30), ya + 10 + rnd(k * 7 + q, seed + 8) * (ch - 22), 1.4 + rnd(k * 3 + q, seed + 9) * 3.6, 1 + rnd(k * 3 + q, seed + 10) * 2.2);
      if (rnd(k, seed + 11) < 0.2) {
        let px = xa + w * (0.2 + 0.6 * rnd(k, seed + 12)), py = ya;
        cracks += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
        for (let q = 0; q < 4; q++) { px += (rnd(k * 4 + q, seed + 13) - 0.5) * 26; py += ch / 4; cracks += ` L ${px.toFixed(1)} ${Math.min(yb, py).toFixed(1)}`; }
      }
      const cx = (xa + xb) / 2, cy = (ya + yb) / 2, dx = lx - cx, dy = ly - cy, d = Math.hypot(dx, dy) || 1, a = L * Math.pow(Math.max(0, 1 - d / reach), 2);
      if (a > 0.015) {
        const ey = dy > 0 ? yb : ya, ex = dx > 0 ? xb : xa;
        lips.push(<path key={"h" + k} d={`M ${(xa + cut).toFixed(1)} ${ey.toFixed(1)} L ${(xb - cut).toFixed(1)} ${ey.toFixed(1)}`} stroke={lit} strokeWidth={1.6} opacity={Math.min(1, a * (Math.abs(dy) / d) * 0.9)}/>);
        lips.push(<path key={"v" + k} d={`M ${ex.toFixed(1)} ${(ya + cut).toFixed(1)} L ${ex.toFixed(1)} ${(yb - cut).toFixed(1)}`} stroke={lit} strokeWidth={1.6} opacity={Math.min(1, a * (Math.abs(dx) / d) * 0.9)}/>);
      }
      x += w;
    }
    y += ch;
  }
  return (
    <g>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#07040B"/>
      {blocks}
      <path d={pits} fill="#060309" opacity={0.6}/>
      <path d={cracks} stroke="#060309" strokeWidth={1.5} fill="none" opacity={0.7}/>
      {lips}
    </g>
  );
};

// ---------- the restless night: peepal leaves, grit, a twig ----------
const PEEPAL: Pt[] = [[0, 0, "c"], [-0.03, -0.14], [0.04, -0.3], [0.18, -0.38], [0.34, -0.36], [0.5, -0.26], [0.64, -0.15], [0.8, -0.05], [1, 0, "c"], [0.8, 0.05], [0.64, 0.15], [0.5, 0.26], [0.34, 0.36], [0.18, 0.38], [0.04, 0.3], [-0.03, 0.14]];
const leafPath = (L: number, narrow = 1): string => smooth(PEEPAL.map((p) => [p[0] * L, p[1] * L * narrow, p[2]] as Pt), {wind: "cw"})
  + " " + ribbon([[L * 0.03, 0], [-L * 0.14, L * 0.02], [-L * 0.3, L * 0.07]], L * 0.04, L * 0.018, 1, "cw");
// Peepal leaves tumbling through a box on the wind (v < 0 blows right to left); each is rimmed from the light point lp
// (its rim direction turned into the leaf's own spinning frame, so the lit edge stays on the side facing the light).
const Leaves: React.FC<{f: number; n?: number; v?: number; seed?: number; box: [number, number, number, number]; lp: V2; rim: string; far?: number}> = ({f, n = 6, v = 1, seed = 0, box, lp, rim, far = 900}) => {
  const [bx0, by0, bx1, by1] = box, span = bx1 - bx0 + 320;
  return (
    <g>{Array.from({length: n}, (_, i) => {
      const k = i + seed * 50, sc = 0.42 + rnd(k, 62) * 0.38, vx = (8 + rnd(k, 63) * 8) * v;
      const x = bx0 - 160 + ((((f * vx + rnd(k, 64) * span) % span) + span) % span);
      const y = by0 + rnd(k, 65) * (by1 - by0) + Math.sin(f / 13 + k) * 24 * Math.abs(v) + (x - bx0) / span * (rnd(k, 66) - 0.4) * 90;
      const rot = f * (5 + rnd(k, 67) * 7) * (rnd(k, 68) < 0.5 ? 1 : -1) + rnd(k, 69) * 360, sy = 0.2 + 0.8 * Math.abs(Math.cos(f / (5 + rnd(k, 70) * 4) + k));
      const a = (-rot * Math.PI) / 180, dx = lp[0] - x, dy = lp[1] - y;
      const lx = (dx * Math.cos(a) - dy * Math.sin(a)) / sc, ly = (dx * Math.sin(a) + dy * Math.cos(a)) / (sc * sy);
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / far);
      return <Rimmed key={i} paths={[leafPath(64, 0.8)]} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${sc.toFixed(3)} ${(sc * sy).toFixed(3)})`}
        light={[lx, ly]} fill="#0C0712" rim={mixHex("#3A2A44", rim, 0.35 + 0.65 * near)} w={1.7 / sc}/>;
    })}</g>
  );
};
// Grit and seed-fluff streaking on the wind (v < 0: right to left), brighter near the light.
const Gust: React.FC<{f: number; n?: number; v?: number; lp: V2; y0?: number; y1?: number}> = ({f, n = 60, v = 1, lp, y0 = 120, y1 = 960}) => (
  <g>{Array.from({length: n}, (_, i) => {
    const sp = (14 + rnd(i, 81) * 18) * Math.abs(v), dir = v < 0 ? -1 : 1, span = W + 300, x = (((f * sp * dir + rnd(i, 82) * span) % span) + span) % span - 150;
    const y = y0 + rnd(i, 83) * (y1 - y0) + Math.sin(f / 9 + i) * 10, len = sp * (1.6 + rnd(i, 84) * 1.4) * dir, d = Math.hypot(x - lp[0], y - lp[1]);
    return <path key={i} d={ribbon([[x - len, y - Math.abs(len) * 0.04], [x - len * 0.5, y - Math.abs(len) * 0.02], [x, y]], 0.1, 1 + rnd(i, 85) * 1.6)} fill={d < 650 ? "#FFD9A0" : "#9AA0C8"} opacity={(0.08 + Math.max(0, 1 - d / 650) * 0.5) * (0.4 + 0.6 * rnd(i, 86))}/>;
  })}</g>
);
// A peepal twig tossing in the wind: crisp silhouette, a faint rim from the light direction.
const Twig: React.FC<{f: number; x: number; y: number; s?: number; flip?: boolean; wind?: number; seed?: number; light: V2; rim?: string; fill?: string}> =
  ({f, x, y, s = 1, flip = false, wind = 1, seed = 0, light, rim = "#B88A62", fill = "#07040B"}) => {
  const sw = (Math.sin(f / 9 + seed) * 4 + Math.sin(f / 3.7 + seed * 2) * 2.2) * wind;
  const stem: number[][] = [[0, 0], [-70, 34], [-150, 64], [-232, 84], [-312, 112], [-380, 160], [-428, 222], [-452, 290]];
  const items: It[] = [];
  for (let i = 0; i < 13; i++) {
    const p = stem[1 + (i % 7)], side = i % 2 ? 1 : -1;
    const ang = 96 + side * 34 + rnd(i, seed + 3) * 30 + Math.sin(f / 2.2 + i * 1.3) * 26 * wind;
    const L = 66 + rnd(i, seed + 4) * 34, sy = 0.3 + 0.7 * Math.abs(Math.cos(f / 2.8 + i * 0.9));
    items.push({d: leafPath(L, 0.78), t: `translate(${p[0] + side * 8} ${p[1] + 6}) rotate(${ang.toFixed(1)}) scale(1 ${sy.toFixed(3)})`, rw: 0.6});
  }
  const lv: V2 = [flip ? -light[0] : light[0], light[1]];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${sw.toFixed(2)})`}>
      <Rimmed paths={[ribbon(stem, 13, 4, 1, "cw"), ...items]} light={lv} fill={fill} rim={rim} w={1.6 / s}/>
    </g>
  );
};

// ---------- 6.19: the lamp in the niche ----------
// A devakoshta in a laterite wall: the kit niche (carved pilasters on lotus bases, a cusped top, a little shikhara with
// its amalaka and kalasha) over a lotus-moulded sill, the diya inside on the lit floor of the recess. On the right a jali
// window gives on the night: a peepal thrashing, a pennant whipping, clouds racing, a temple far off. still: the flame
// dead vertical, its smoke one straight thread; flicker: the wind finds the alcove; out: the lamp gone, a thread of smoke
// in the moonlight from the window. A still beat whose detail says the lamp is relit begins dark: a soft light comes
// down to the wick and the flame catches under a small flash.
const LampNiche: React.FC<SceneP & {mode: "still" | "flicker" | "out"}> = ({s, n, mode}) => {
  const f = useCurrentFrame();
  const id = uid();
  const out = mode === "out", flick = mode === "flicker";
  const relight = mode === "still" && (s?.relight === true || /relight|light(s|ed)? again|rekindl/i.test(String(s?.detail || "")));
  const NX = 760, SY = 890, NW = 400, NH = 440, J = 40;
  const DS = 2.6, DX = NX - 44, DY = SY - 9, [FX, FY] = diyaWick(DX, DY, DS);
  const WX = 1480, WY = 820, WW = 400, WH = 600, wpw = WW * 0.13, wx0 = WX - (WW / 2 - wpw * 0.8), wx1 = WX + (WW / 2 - wpw * 0.8), wy0 = WY - WH * 0.82, JH = 150, HZ = WY - 64;
  // the storm outside (it blows right to left, in at the window)
  const storm = out ? 0.12 : flick ? 1.25 : 1;
  const gust = storm * (0.6 + 0.4 * (0.5 + 0.5 * wob(f * 0.075, 3)));
  // the flame
  const kindle = relight ? ease(f, n * 0.12, n * 0.07) : 1;
  const L = out ? 0 : flick ? 0.7 + 0.3 * (0.5 + 0.5 * wob(f * 0.31, 4)) : kindle * (1 + 0.02 * Math.sin(f / 41));
  const lean = flick ? -(0.8 + 0.9 * (0.5 + 0.5 * wob(f * 0.11, 1))) : 0;
  const hF = 52 * DS * (flick ? 0.95 + 0.2 * wob(f * 0.23, 5) + 0.08 * lean : 0.3 + 0.7 * kindle);
  const tipX = FX + lean * hF * 0.95, tipY = FY - hF;
  const lp: V2 = [FX + lean * hF * 0.35, FY - hF * 0.42];
  const mp: V2 = [WX - 30, wy0 + 120];
  const lamp = L > 0.35, P: V2 = lamp ? lp : mp;
  const moonRim = "#A6A4CC";
  const rimC = lamp ? mixHex("#5A3236", K.rim, clamp01(L)) : moonRim;
  const rimFar = lamp ? mixHex(rimC, "#2A1828", 0.5) : moonRim;
  const z = push(f, n, 1, flick ? 1.04 : 1.07);
  // the kit pieces
  const NI = niche({x: NX, y: SY, w: NW, h: NH});
  const nParts = parts(dOf(NI[0])), nLow = nParts.filter((p) => bbox(p.d)[1] > SY - NH * 1.08), nHigh = nParts.filter((p) => bbox(p.d)[1] <= SY - NH * 1.08);
  const WA = cuspedArch({x: WX, y: WY, w: WW, h: WH, lobes: 7});
  const WL = ledge({x0: WX - WW / 2 - 14, x1: WX + WW / 2 + 14, y: WY, h: 36, seed: 3});
  const SL = ledge({x0: NX - NW / 2 - NW * 0.16 * 1.7, x1: NX + NW / 2 + NW * 0.16 * 1.7, y: SY + NH * 0.11, h: 30, seed: 5});
  // the jali: a stone screen across the lower window, pierced in a lattice of lozenges
  const jx0 = WX - (WW / 2 - wpw * 0.8), jx1 = WX + (WW / 2 - wpw * 0.8), jy0 = WY - JH;
  let jali = polyD([[jx0, jy0], [jx1, jy0], [jx1, WY], [jx0, WY]], true, "cw");
  for (let r = 0, yy = jy0 + 20; yy < WY - 18; yy += 21, r++) for (let xx = jx0 + 40 + (r % 2) * 14; xx < jx1 - 36; xx += 28) jali += " " + polyD([[xx, yy - 9], [xx + 10, yy], [xx, yy + 9], [xx - 10, yy]], true, "ccw");
  // the lotus (padma) moulding under the sill: petals hanging from a fillet, each tinted by the lamp's light on it
  const PY = SY + NH * 0.11 + 30 * 0.88, petals: React.ReactNode[] = [];
  const pX0 = NX - NW / 2 - NW * 0.16 * 1.5, pX1 = NX + NW / 2 + NW * 0.16 * 1.5, np = 17, pw = (pX1 - pX0) / np;
  for (let i = 0; i < np; i++) {
    const cx = pX0 + pw * (i + 0.5), k = lamp ? L * Math.max(0, 1 - Math.abs(cx - lp[0]) / 520) : 0.25 * Math.max(0, 1 - Math.abs(cx - mp[0]) / 1100);
    const d = smooth([[cx - pw * 0.5, PY + 2, "c"], [cx - pw * 0.52, PY + 16], [cx - pw * 0.4, PY + 32], [cx - pw * 0.16, PY + 43], [cx, PY + 46, "c"], [cx + pw * 0.16, PY + 43], [cx + pw * 0.4, PY + 32], [cx + pw * 0.52, PY + 16], [cx + pw * 0.5, PY + 2, "c"]], {wind: "cw"});
    petals.push(<path key={i} d={d} fill={mixHex("#1A1020", lamp ? "#7A4028" : "#44425E", k * 0.75)}/>);
    petals.push(<path key={"r" + i} d={smooth([[cx - pw * 0.06, PY + 6, "c"], [cx - pw * 0.08, PY + 24], [cx, PY + 38, "c"], [cx + pw * 0.08, PY + 24], [cx + pw * 0.06, PY + 6, "c"]], {wind: "cw"})} fill={mixHex("#2A1A2C", lamp ? "#E0A060" : "#8A88B0", k * 0.7)} opacity={0.8}/>);
  }
  const ox0 = NX - NW / 2, ox1 = NX + NW / 2, oy0 = SY - NH * 1.03;
  return (
    <Frame f={f} zoom={z} cx={FX} cy={FY - 30}>
      <FlameDefs/>
      <defs>
        <linearGradient id={`${id}sky`} gradientUnits="userSpaceOnUse" x1={0} y1={wy0} x2={0} y2={WY}>
          <stop offset="0" stopColor="#0E1338"/><stop offset="0.5" stopColor="#1F2A5A"/><stop offset="0.78" stopColor="#3A4272"/><stop offset="0.86" stopColor="#5A4466"/><stop offset="0.93" stopColor="#8A5250"/><stop offset="1" stopColor="#5A3644"/>
        </linearGradient>
        <radialGradient id={`${id}cw`}>{softStops("#A6AEDA", 0.55, "#4A5488", 1.4)}</radialGradient>
        <radialGradient id={`${id}n`} gradientUnits="userSpaceOnUse" cx={lp[0]} cy={lp[1] + 10} r={430}>
          <stop offset="0" stopColor="#E8A262"/><stop offset="0.14" stopColor="#C47A42"/><stop offset="0.38" stopColor="#8A4628"/><stop offset="0.7" stopColor="#4A2220"/><stop offset="1" stopColor="#24121A"/>
        </radialGradient>
        <radialGradient id={`${id}fl`} gradientUnits="userSpaceOnUse" cx={FX} cy={SY - J * 0.5} r={330}>
          <stop offset="0" stopColor="#E8A058"/><stop offset="0.45" stopColor="#9A5430"/><stop offset="1" stopColor="#3A1C1C"/>
        </radialGradient>
        <linearGradient id={`${id}jl`} gradientUnits="userSpaceOnUse" x1={ox0} y1={0} x2={ox0 + J} y2={0}><stop offset="0" stopColor="#24121A"/><stop offset="1" stopColor="#8A4426"/></linearGradient>
        <linearGradient id={`${id}jr`} gradientUnits="userSpaceOnUse" x1={ox1} y1={0} x2={ox1 - J} y2={0}><stop offset="0" stopColor="#24121A"/><stop offset="1" stopColor="#9A4E2A"/></linearGradient>
        <linearGradient id={`${id}sm`} gradientUnits="userSpaceOnUse" x1={0} y1={tipY} x2={0} y2={SY - NH * 0.86}>
          <stop offset="0" stopColor="#FFF0D8" stopOpacity={0}/><stop offset="0.08" stopColor="#F4E2CC" stopOpacity={0.62}/><stop offset="0.7" stopColor="#D8C2B8" stopOpacity={0.32}/><stop offset="1" stopColor="#B8A4B0" stopOpacity={0.1}/>
        </linearGradient>
        <linearGradient id={`${id}so`} gradientUnits="userSpaceOnUse" x1={0} y1={FY} x2={0} y2={SY - NH * 0.86}>
          <stop offset="0" stopColor="#D4D0E4" stopOpacity={0.7}/><stop offset="0.5" stopColor="#A6A2C4" stopOpacity={0.34}/><stop offset="1" stopColor="#7A7898" stopOpacity={0}/>
        </linearGradient>
        <radialGradient id={`${id}d`} gradientUnits="userSpaceOnUse" cx={NX + 140} cy={SY - 300} r={1300}>
          <stop offset="0.25" stopColor="#030108" stopOpacity={0}/><stop offset="0.66" stopColor="#030108" stopOpacity={0.45}/><stop offset="1" stopColor="#030108" stopOpacity={0.85}/>
        </radialGradient>
        <clipPath id={`${id}wc`}><path clipRule="evenodd" d={`M -400 -400 H ${W + 400} V ${H + 400} H -400 Z M ${ox0} ${oy0} H ${ox1} V ${SY + 1} H ${ox0} Z M ${wx0} ${wy0 - 2} H ${wx1} V ${WY + 1} H ${wx0} Z`}/></clipPath>
        <clipPath id={`${id}rc`}><rect x={ox0} y={oy0} width={NW} height={SY + 1 - oy0}/></clipPath>
        <clipPath id={`${id}win`}><rect x={wx0} y={wy0 - 2} width={wx1 - wx0} height={WY + 3 - wy0}/></clipPath>
      </defs>

      {/* the night through the window: sky, racing cloud, a far temple and palms, the pennant, the peepal thrashing */}
      <g clipPath={`url(#${id}win)`}>
        <rect x={wx0 - 10} y={wy0 - 10} width={wx1 - wx0 + 20} height={WY - wy0 + 20} fill={`url(#${id}sky)`}/>
        <SoftGlow x={wx0 - 140} y={wy0 - 80} r={560} c0="#D6DCF4" c1="#5A68A0" o={0.55} k={1.8}/>
        {Array.from({length: 18}, (_, i) => <circle key={i} cx={wx0 + rnd(i, 301) * (wx1 - wx0)} cy={wy0 + rnd(i, 302) * 200} r={0.7 + rnd(i, 303) * 1.1} fill="#F2EAD8" opacity={0.25 + 0.4 * rnd(i, 304)}/>)}
        {Array.from({length: 7}, (_, i) => {
          const sp = (2.5 + rnd(i, 311) * 3) * storm + 0.3, span = wx1 - wx0 + 700, x = wx1 + 350 - ((f * sp + rnd(i, 312) * span) % span);
          return <ellipse key={i} cx={x} cy={wy0 + 30 + rnd(i, 313) * 300} rx={130 + rnd(i, 314) * 150} ry={14 + rnd(i, 315) * 18} fill={`url(#${id}cw)`} opacity={0.5}/>;
        })}
        <Rimmed paths={[...palmyra({x: WX + 60, y: HZ + 4, h: 230, seed: 4, wind: -gust * 0.7, t: f * 2.5}), ...coconut({x: WX - 150, y: HZ + 6, h: 200, seed: 6, wind: -gust * 0.9, t: f * 2.5, lean: -0.15})]}
          light={[-1, -0.8]} fill="#120E2A" rim="#6A70A0" w={1.3}/>
        <Rimmed paths={temple({x: WX - 52, y: HZ + 2, w: 46, porch: 1, spires: 1, flag: true, t: f * 6 * storm, wind: -1})} light={[-1, -0.8]} fill="#120E28" rim="#7076A6" w={1.3}/>
        {(() => {
          const px = WX + 30, top = wy0 + 150;
          return <Rimmed paths={[polyD([[px - 2.5, HZ + 10], [px + 2.5, HZ + 10], [px + 2, top], [px - 2, top]], true, "cw"), {d: streamer(px, top + 3, 120 + 30 * gust, 34, 6, f * 0.55, 6 + 10 * gust, -1, 12), rim: true}]}
            light={[-1, -0.8]} fill="#120D24" rim="#7A7EB0" w={1.2}/>;
        })()}
        <g transform={`rotate(${(-storm * (1.4 + 1.6 * wob(f * 0.07, 2))).toFixed(2)} ${WX + 420} ${WY + 320})`}>
          <Rimmed paths={peepal({x: WX + 420, y: WY + 320, h: 900, seed: 3, wind: -gust * 0.8, t: f * 2.6 * storm + 5, detail: 0.9, back: "#16122C"})} light={[-1, -0.7]} fill="#0B0716" rim="#7C84B4" w={1.8}/>
        </g>
        <Twig f={f} x={wx1 + 60} y={wy0 + 20} s={0.62} wind={gust * 1.4} seed={2} light={[-1, -0.7]} rim="#8088B8"/>
        <Leaves f={f} n={out ? 0 : 9} v={-storm * 1.2} seed={2} box={[wx0, wy0, wx1, WY - JH]} lp={[wx0 - 300, wy0 - 300]} rim="#8A90C0" far={2000}/>
      </g>

      {/* the recess: back wall lit by the flame (its soot streak above), jambs, floor; the smoke; the lamp */}
      <g clipPath={`url(#${id}rc)`}>
        <rect x={ox0} y={oy0} width={NW} height={SY + 1 - oy0} fill={out || L < 0.05 ? "#110D1A" : "#1A0C14"}/>
        {L > 0.01 ? <rect x={ox0} y={oy0} width={NW} height={SY + 1 - oy0} fill={`url(#${id}n)`} opacity={Math.min(1, L)}/> : null}
        <path d={[0.3, 0.55, 0.8].map((k) => `M ${ox0} ${(SY - NH * k).toFixed(1)} L ${ox1} ${(SY - NH * k + 2).toFixed(1)}`).join(" ") + ` M ${NX - 90} ${SY - NH * 0.55} l 0 ${NH * 0.25} M ${NX + 120} ${SY - NH * 0.8} l 0 ${NH * 0.25} M ${NX - 30} ${SY - NH * 0.3} l 0 ${NH * 0.25}`}
          stroke="#120608" strokeWidth={2.4} fill="none" opacity={0.32}/>
        <ellipse cx={FX} cy={tipY - 120} rx={46} ry={130} fill="url(#fl-shade)" opacity={0.55}/>
        <path d={polyD([[ox0, SY + 1], [ox0 + J, SY - 24], [ox0 + J, oy0], [ox0, oy0]])} fill={L > 0.05 ? `url(#${id}jl)` : "#0C0A16"} opacity={0.25 + 0.75 * Math.min(1, L)}/>
        <path d={polyD([[ox1, SY + 1], [ox1 - J, SY - 24], [ox1 - J, oy0], [ox1, oy0]])} fill={L > 0.05 ? `url(#${id}jr)` : "#0C0A16"} opacity={0.25 + 0.75 * Math.min(1, L)}/>
        <path d={polyD([[ox0, SY + 1], [ox1, SY + 1], [ox1 - J, SY - 24], [ox0 + J, SY - 24]])} fill={L > 0.05 ? `url(#${id}fl)` : "#1A1828"} opacity={0.15 + 0.85 * Math.min(1, L)}/>
        {out ? <rect x={ox0} y={oy0} width={NW} height={SY + 1 - oy0} fill="#6A6E9A" opacity={0.07}/> : null}
        {/* the smoke: one straight thread in the still air; torn away by the wind; a curl from the dead wick */}
        {!out && L > 0.2 && !flick ? <>
          <path d={ribbon(Array.from({length: 16}, (_, i) => [FX + 0.4 * Math.sin(i * 0.7 + f / 40), lerp(tipY - 2, SY - NH * 0.86, i / 15)]), 1.2, 2.8, 1, "cw")} fill={`url(#${id}sm)`} opacity={Math.min(1, L)}/>
        </> : null}
        {flick ? [0, 1, 2].map((k) => {
          const pts = Array.from({length: 22}, (_, i) => { const u = i / 21; return [tipX - u * (150 + 90 * k) * gust - u * u * 60 + Math.sin(f / 4 - u * 9 + k * 2) * u * 26, tipY - u * (170 + 40 * k) + u * u * 40]; });
          return <path key={k} d={ribbon(pts, 1.2, 10 + k * 6, 1, "cw")} fill={`url(#${id}sm)`} opacity={0.5 - k * 0.12}/>;
        }) : null}
        {out || (relight && kindle < 0.02) ? [0, 1].map((k) => {
          const top = SY - NH * 0.86, Hh = FY - top, grow = out ? 0.6 + 0.4 * Math.min(1, (f + k * 30) / 160) : 0.5;
          const pts = Array.from({length: 40}, (_, i) => { const u = i / 39; return [FX + Math.sin(u * 8 - f / 22 + k * 2.1) * (2 + u * 26) + u * u * 34 * (k - 0.6), FY - 4 - u * Hh * grow]; });
          return <path key={k} d={ribbon(pts, 1.6, 7 + k * 6, 1.4, "cw")} fill={`url(#${id}so)`} opacity={(out ? 0.4 + 0.6 * (1 - ease(f, n * 0.55, n * 0.45)) : 0.35) * (1 - k * 0.35)}/>;
        }) : null}
        <Diya x={DX} y={DY} s={DS} f={f} lit={Math.min(1, L)} flame={false} shadow={0.9}/>
        <Flame x={FX} y={FY} h={hF} f={f} seed={3} calm={flick ? 0 : 1} lean={lean} wind={flick ? -0.6 : 0} b={L} halo={0} licks={flick ? 4 : 1}/>
        {out ? <>
          <Glow x={FX} y={FY + 1} rx={18} g="fl-ember" o={0.85 * (1 - ease(f, 0, n * 0.45))}/>
          <circle cx={FX} cy={FY + 1} r={2.4} fill="#FFB060" opacity={1 - ease(f, 0, n * 0.45)}/>
        </> : null}
      </g>

      {/* the wall, pierced by the niche and the window */}
      <g clipPath={`url(#${id}wc)`}>
        <Ashlar lp={P} L={lamp ? Math.min(1, L) : 0.22} tone="#130B17" lit={lamp ? "#FFC98A" : "#A8A8D0"} reach={lamp ? 950 : 1100}/>
      </g>
      {/* the window: jali, carved frame, sill */}
      <Rimmed paths={[jali]} point={P} light={[-1, 0]} fill="#1A1020" rim={rimFar} w={1.6}/>
      <Rimmed paths={[...parts(dOf(WA[0])), WA[1]]} point={P} light={[-1, 0]} fill="#170E1E" rim={rimFar} w={2.2}/>
      <Rimmed paths={[...parts(dOf(WL[0])), WL[1]]} point={P} light={[-1, 0]} fill="#170E1E" rim={rimFar} w={1.8}/>
      {/* the niche: its sill and lotus moulding, the pilasters and cusped top, the little shikhara */}
      <Rimmed paths={[...parts(dOf(SL[0])), SL[1]]} point={P} light={[0, -1]} fill={lamp ? "#22152A" : "#160E1C"} rim={rimC} w={2}/>
      <path d={polyD([[pX0, PY], [pX1, PY], [pX1, PY + 6], [pX0, PY + 6]])} fill="#0E0812"/>
      {petals}
      <Rimmed paths={nLow} point={P} light={[0, -1]} fill={lamp ? "#22152A" : "#160E1C"} rim={rimC} w={2.6}/>
      <Rimmed paths={[...nHigh, NI[1]]} point={P} light={[0, -1]} fill="#170E1D" rim={mixHex(rimC, "#2A1828", 0.45)} w={2.2}/>

      {/* the lamp's light on the stone, and its halo */}
      {L > 0.01 ? <>
        <SoftGlow x={lp[0]} y={lp[1]} r={1150} ry={900} c0="#F2A458" c1="#6A2E4A" o={0.34 * L} k={1.6}/>
        <SoftGlow x={lp[0]} y={lp[1]} r={hF * 4.6} c0="#FFE9B8" c1="#F0A04B" o={0.55 * L} k={2.2}/>
      </> : null}
      {!lamp ? <SoftGlow x={WX} y={wy0 + 200} r={950} c0="#9098C8" c1="#2A2850" o={0.16} k={1.6}/> : null}
      {/* the hand of light that relights the lamp */}
      {relight ? (() => {
        const u = sstep((f - n * 0.02) / (n * 0.1)), ox = lerp(FX + 220, FX + 4, u), oy = lerp(FY - 300, FY - 6, u), o = ease(f, 0, n * 0.04) * (1 - ease(f, n * 0.13, n * 0.06));
        return <>
          {o > 0 ? <><SoftGlow x={ox} y={oy} r={90} c0="#FFF4DC" c1="#F0B060" o={0.9 * o} k={2.4}/><circle cx={ox} cy={oy} r={4} fill="#FFF8E8" opacity={o}/></> : null}
          <LightFlash p={(f - n * 0.1) / (n * 0.1)} x={FX} y={FY - 30} r={300}/>
        </>;
      })() : null}
      {/* the wind in the room once it finds the alcove */}
      {flick ? <>
        <Gust f={f} v={-1.1} lp={lp} n={60}/>
        <Leaves f={f} n={8} v={-1.3} seed={1} box={[0, 120, W, 1000]} lp={lp} rim={K.rim}/>
      </> : null}
      {!flick ? <Dust f={f} sun={lp} n={36} y0={300} y1={1000} color={lamp ? "#FFE2A8" : "#C8C8E0"}/> : null}
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={`url(#${id}d)`}/>
    </Frame>
  );
};

// ---------- the stair of lamps (12.8-12.11): a ghat under a warm moon, the lamps kindled from the temple down ----------
// The kit ghat in profile runs from the temple's platform (upper right) down to the river (lower left): many shallow
// chipped steps with landings. At frame 0 every lamp is dark; a spark leaves the lit temple and carries the flame down,
// lamp to lamp, while the camera eases down and back until the whole lit stair stands over its own reflection.
// The tread layout of the kit's side-view ghat (same weights and jitter), so the lamps stand on its treads.
type GhatG = {x0: number; y0: number; x1: number; y1: number; n: number; seed: number; landing: number};
const ghatTreads = ({x0, y0, x1, y1, n, seed, landing}: GhatG) => {
  const isLand = (i: number) => landing > 0 && i > 0 && i % landing === 0;
  const wts = Array.from({length: n}, (_, i) => (isLand(i) ? 2.6 : 1) * (0.92 + 0.16 * rnd(i, seed + 9))), tot = wts.reduce((a, b) => a + b, 0);
  const rise = (y1 - y0) / n, ar = Math.abs(rise), out: {xa: number; xb: number; y: number; land: boolean}[] = [];
  let xs = x0;
  for (let i = 0; i < n; i++) { const run = ((x1 - x0) * wts[i]) / tot; out.push({xa: xs, xb: xs + run, y: y0 + rise * i + (rnd(i, seed + 1) - 0.5) * ar * 0.12, land: isLand(i)}); xs += run; }
  return out;
};
const LampStair: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "night");
  const id = uid();
  const N = Math.max(3, Math.min(9, Math.round(Number(s.count) || 7)));
  const MOON: V2 = [300, 196], WLN = 652, NEAR = 948;
  const G: GhatG = {x0: 1540, y0: 488, x1: 250, y1: NEAR - 8, n: 24, seed: 4, landing: 4};
  const gh = ghat({...G, view: "side", bottom: H + 160});
  const stairD = dOf(gh[0]);
  const T = ghatTreads(G);
  const idx = N === 7 ? [1, 4, 8, 12, 16, 20, 23] : Array.from({length: N}, (_, k) => Math.round(lerp(1, G.n - 1, k / (N - 1))));
  const DSc = 0.62;
  const pos = idx.map((i): V2 => { const t = T[i]; return [t.xa + (t.xb - t.xa) * (t.land ? 0.5 : 0.42), t.y + (t.land ? 1 : 0)]; });
  // the kindling: the temple's light goes to lamp 0, then down the stair
  const TL = Array.from({length: N}, (_, k) => lerp(n * 0.1, n * 0.8, k / (N - 1)));
  const litOf = (k: number) => ease(f, TL[k], 14);
  const flare = (k: number) => 1 + 0.6 * bump(f, TL[k], 4, 18);
  const TX = 1760, TW = 112, tp = temple({x: TX, y: G.y0, w: TW, porch: -1, spires: 1, flag: true, t: f, wind: -0.5});
  const bay = tp.at.bay || [TX - 150, G.y0 - 70];
  const from = (k: number): V2 => (k === 0 ? [bay[0], bay[1] + 10] : [pos[k - 1][0], pos[k - 1][1] - 40 * DSc]);
  // the camera: close on the temple and the first dark lamps, easing down and back to the whole lit stair
  const e = sstep(f / (n * 0.92)), z = lerp(1.22, 1.0, e), cx = lerp(1250, 960, e), cy = lerp(440, 540, e);
  const rimM = "#EACB98", lightAt = (x: number, y: number): V2 => [MOON[0] - x, MOON[1] - y];
  const masonry: string[] = [];
  for (let yy = G.y0 + 30, r = 0; yy < NEAR; yy += 38, r++) {
    masonry.push(`M -100 ${yy} L ${W + 300} ${yy + 1.5}`);
    for (let xx = -100 + (r % 2) * 70 + rnd(r, 7) * 60; xx < W + 300; xx += 130 + rnd(r * 13 + xx, 8) * 90) masonry.push(`M ${xx.toFixed(1)} ${yy} l ${(rnd(xx, r) * 4 - 2).toFixed(1)} 38`);
  }
  return (
    <Frame f={f} zoom={1} cx={960} cy={540}>
      <FlameDefs/>
      <defs>
        <linearGradient id={`${id}r`} gradientUnits="userSpaceOnUse" x1={0} y1={WLN} x2={0} y2={H}>
          <stop offset="0" stopColor="#6A4052"/><stop offset="0.12" stopColor="#3A2A4E"/><stop offset="0.5" stopColor="#1C1634"/><stop offset="1" stopColor="#0C0A1C"/>
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C1324"/><stop offset="1" stopColor="#0C0812"/></linearGradient>
        <clipPath id={`${id}k`}><path d={stairD}/></clipPath>
      </defs>
      <g transform={`translate(960 540) scale(${z.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`}>
        <Sky mood={mood} sun={MOON} sunR={32} f={f} rays={0} id="lrow" clouds={0.5} horizon={WLN}/>
        {/* the far bank: two hazy ranges, then palms and a neem on the near shore of the far bank */}
        <path d={ridge([[-300, WLN - 18], ...Array.from({length: 14}, (_, i) => [-200 + i * 180, WLN - 34 - 22 * Math.sin(i * 1.3) - rnd(i, 21) * 16] as Pt), [W + 300, WLN - 20]], WLN + 10)} fill="#3A2848" opacity={0.85}/>
        <Haze y={WLN - 18} h={60} color="#8A5A62" op={0.35}/>
        <Rimmed paths={[ridge([[-300, WLN - 2], ...Array.from({length: 22}, (_, i) => [-260 + i * 120, WLN - 10 - rnd(i, 23) * 12] as Pt), [W + 300, WLN - 4]], WLN + 6),
          ...palmyra({x: 120, y: WLN - 6, h: 130, seed: 2, t: f}), ...coconut({x: 520, y: WLN - 6, h: 112, seed: 5, t: f, lean: 0.2}), ...neem({x: 760, y: WLN - 6, h: 90, seed: 3, t: f}), ...palmyra({x: 1020, y: WLN - 8, h: 104, seed: 7, t: f})]}
          light={lightAt(600, WLN - 60)} fill="#1E1428" rim={rimM} w={1.4}/>
        {/* the river, holding the moon and the warm band */}
        <rect x={-300} y={WLN} width={W + 600} height={H - WLN + 200} fill={`url(#${id}r)`}/>
        {Array.from({length: 46}, (_, i) => { const y = WLN + 6 + Math.pow(rnd(i, 13), 1.3) * 420, x = MOON[0] + (rnd(i, 14) - 0.5) * (40 + (y - WLN) * 0.9), len = 10 + (y - WLN) * 0.22; return <rect key={i} x={x - len / 2} y={y} width={len} height={1.6} fill="#FFE2B0" opacity={(0.14 + 0.22 * Math.sin(f / 6 + i * 2)) * (1 - (y - WLN) / 470)}/>; })}
        {/* the temple's platform and the temple; its porch glows; a peepal behind */}
        <SoftGlow x={bay[0]} y={bay[1]} r={300} ry={200} c0="#FFD890" c1="#E8823A" o={0.75} k={1.8}/>
        <Rimmed paths={peepal({x: 1990, y: G.y0, h: 380, seed: 8, t: f, back: "#140C1C"})} light={lightAt(1990, 300)} fill="#100818" rim={mixHex(rimM, "#2A1A30", 0.55)} w={1.5}/>
        <Rimmed paths={tp} light={lightAt(TX, 300)} fill="#150C1C" rim={rimM} w={2.4}/>
        <Rimmed paths={[...parts(dOf(ledge({x0: 1500, x1: W + 380, y: G.y0, h: 44, seed: 2, wall: 700})[0]))]} light={lightAt(1700, G.y0)} fill="#150C1C" rim={rimM} w={2}/>
        {/* the stair: the kit ghat, its courses, the lamps' light pooled on the stone */}
        <Rimmed paths={[gh[0]]} light={lightAt(900, 700)} fill={`url(#${id}m)`} rim={rimM} w={2.2}/>
        <g clipPath={`url(#${id}k)`}>
          <path d={masonry.join(" ")} stroke="#06030A" strokeWidth={2.4} fill="none" opacity={0.7}/>
          {pos.map(([x, y], k) => { const L = litOf(k); return L > 0 ? <SoftGlow key={k} x={x} y={y + 30} r={190} ry={130} c0="#FFC878" c1="#C2553A" o={L * 0.7 * flare(k)} k={1.8}/> : null; })}
        </g>
        {pos.map(([x, y], k) => { const L = litOf(k), t = T[idx[k]]; return L > 0 ? <rect key={k} x={Math.min(t.xa, t.xb) - 30} y={y - 1.2} width={Math.abs(t.xb - t.xa) + 60} height={2.2} fill="url(#fl-fade-h)" opacity={L}/> : null; })}
        {/* the lamps */}
        {pos.map(([x, y], k) => <Diya key={k} x={x - 12 * DSc} y={y} s={DSc} f={f} seed={k + 2} lit={litOf(k) * flare(k)} calm={0.85} shadow={0.6} halo={0.8}/>)}
        {/* the spark that carries the light down */}
        {Array.from({length: N}, (_, k) => {
          const a = k === 0 ? n * 0.03 : Math.max(TL[k - 1] + 8, TL[k] - n * 0.09), b = TL[k], u = (f - a) / (b - a);
          if (u <= 0 || u >= 1) return null;
          const [x0, y0] = from(k), [x1, y1] = diyaWick(pos[k][0] - 12 * DSc, pos[k][1], DSc), arc = 60 + Math.abs(x1 - x0) * 0.12;
          const at = (q: number): V2 => { const e2 = sstep(q); return [lerp(x0, x1, e2), lerp(y0, y1, e2) - Math.sin(q * Math.PI) * arc]; };
          const [px, py] = at(u);
          return <g key={k}>
            {[1, 2, 3, 4, 5].map((j) => { const [qx, qy] = at(Math.max(0, u - j * 0.03)); return <circle key={j} cx={qx} cy={qy} r={2.4 - j * 0.35} fill="#FFE2A8" opacity={0.55 - j * 0.09}/>; })}
            <SoftGlow x={px} y={py} r={44} c0="#FFF0C8" c1="#F0A04B" o={0.9} k={2.4}/>
            <circle cx={px} cy={py} r={3.2} fill="#FFF6DC"/>
          </g>;
        })}
        {/* the near water along the foot of the ghat: every lit lamp mirrored in it */}
        <rect x={-300} y={NEAR} width={W + 600} height={H - NEAR + 200} fill={`url(#${id}r)`}/>
        <rect x={-300} y={NEAR} width={W + 600} height={1.4} fill="#0A0612" opacity={0.8}/>
        {pos.map(([x, y], k) => {
          const L = litOf(k); if (L <= 0) return null;
          const depth = 30 + Math.min(110, (NEAR - y) * 0.26), xx = x + 30 * DSc;
          return <g key={k}>
            <SoftGlow x={xx} y={NEAR + depth * 0.5} r={60} ry={depth * 0.75} c0="#FFD08A" c1="#C2553A" o={0.45 * L} k={1.8}/>
            {Array.from({length: 9}, (_, j) => { const u = j / 8, yy = NEAR + 4 + u * depth, wv = Math.sin(f / 5 + j * 1.7 + k) * 4, len = (26 - 16 * u) * (0.6 + 0.4 * rnd(j, k + 30)); return <rect key={j} x={xx - len / 2 + wv} y={yy} width={len} height={1.8} rx={0.9} fill="#FFDCA0" opacity={L * (0.75 - 0.6 * u) * (0.6 + 0.4 * Math.sin(f / 4 + j * 2.3 + k))}/>; })}
          </g>;
        })}
        {Array.from({length: 24}, (_, i) => { const y = NEAR + 8 + rnd(i, 41) * 120, x = MOON[0] + (rnd(i, 42) - 0.5) * 140, len = 16 + rnd(i, 43) * 30; return <rect key={i} x={x - len / 2} y={y} width={len} height={1.5} fill="#FFE2B0" opacity={(0.12 + 0.18 * Math.sin(f / 7 + i * 1.9)) * (1 - (y - NEAR) / 160)}/>; })}
        <Dust f={f} sun={pos[Math.max(0, Math.min(N - 1, Math.floor(f / Math.max(1, n) * N)))]} n={50} y0={300} y1={NEAR}/>
      </g>
    </Frame>
  );
};

const Lamp: React.FC<SceneP> = ({s, n}) => {
  const v = s.variant || "still";
  if (v === "row") return <LampStair s={s} n={n}/>;
  return <LampNiche s={s} n={n} mode={v === "flicker" || v === "out" ? v : "still"}/>;
};

// Sparks rising from a fire, curling, fading, each with a short streak.
const Sparks: React.FC<{f: number; x: number; y: number; w: number; h: number; n?: number; k?: number; seed?: number; wind?: number}> = ({f, x, y, w, h, n = 34, k = 1, seed = 0, wind = 0}) => (
  <g>{k <= 0.02 ? null : Array.from({length: n}, (_, i) => {
    const P = 60 + rnd(i, seed + 1) * 70, a = ((f + rnd(i, seed + 2) * P) % P) / P, rise = h * (1.0 + rnd(i, seed + 4) * 1.1);
    const sx = x + (rnd(i, seed + 3) - 0.5) * w * 1.5 + Math.sin(a * 6 + i) * 34 * a + wind * a * 220, sy = y - h * 0.3 - a * rise;
    const vy = rise / P, vx = Math.cos(a * 6 + i) * 34 * 6 / P + wind * 220 / P;
    const op = Math.pow(Math.sin(a * Math.PI), 0.7) * Math.min(1, k) * (0.45 + 0.55 * rnd(i, seed + 5)), r = 1.1 + rnd(i, seed + 6) * 1.7;
    return <g key={i} opacity={op}>
      <path d={ribbon([[sx - vx * 2.5, sy + vy * 2.5], [sx, sy]], 0.2, r * 1.2)} fill="#FFB060" opacity={0.45}/>
      <circle cx={sx} cy={sy} r={r * 4} fill="url(#fl-warm)"/>
      <circle cx={sx} cy={sy} r={r} fill="#FFEAC0"/>
    </g>;
  })}</g>
);
// Smoke rising off a fire: soft puffs that swell, drift and fade, lit warm from below.
const Plume: React.FC<{f: number; x: number; y: number; rise: number; n?: number; op?: number; wind?: number; seed?: number; r0?: number; r1?: number; spread?: number}> =
  ({f, x, y, rise, n = 22, op = 1, wind = 0.3, seed = 0, r0 = 40, r1 = 190, spread = 40}) => (
  <g>{op <= 0.01 ? null : Array.from({length: n}, (_, i) => {
    const P = 170 + rnd(i, seed + 21) * 90, a = ((f + rnd(i, seed + 22) * P) % P) / P;
    const px = x + (rnd(i, seed + 23) - 0.5) * spread + a * wind * 320 + Math.sin(a * 4 + i) * 40 * a, py = y - a * rise;
    const r = r0 + (r1 - r0) * Math.pow(a, 0.8), o = Math.pow(Math.sin(Math.PI * Math.min(1, a * 1.15)), 0.9) * op * (0.55 + 0.45 * rnd(i, seed + 24));
    const g = a < 0.22 ? "fl-sm-warm" : a < 0.55 ? "fl-sm-mid" : "fl-sm-cool";
    return <circle key={i} cx={px} cy={py} r={r} fill={`url(#${g})`} opacity={o}/>;
  })}</g>
);
// Heat shimmer: faint wavering bands of warm air above a fire.
const Shimmer: React.FC<{f: number; x: number; y: number; w: number; h: number; k?: number}> = ({f, x, y, w, h, k = 1}) => (
  <g opacity={0.5 * Math.min(1, k)}>{Array.from({length: 7}, (_, i) => {
    const P = 70 + i * 9, a = ((f + i * 23) % P) / P, pts: number[][] = [];
    for (let j = 0; j <= 10; j++) { const u = j / 10; pts.push([x + (i - 3) * w * 0.28 + Math.sin(u * 7 + f / 7 + i) * 9 * u, y - a * h * 0.6 - u * h * 0.5]); }
    return <path key={i} d={ribbon(pts, 3, 12)} fill="#FFD9A0" opacity={0.06 * Math.sin(a * Math.PI)}/>;
  })}</g>
);

// ---------- the havan kund: a square brick fire altar, its pit stepped down in three ledges, seen a little from above ----------
// x, y: the middle of the bottom edge of its front face. P(px, pz, hy) projects a point of its plan (pz > 0 is further
// away, hy < 0 is down into the pit).
const kundGeom = (x: number, y: number, s = 1) => {
  const A = 330 * s, FH = 104 * s, slope = 0.25, drop = 0.85, yTop = y - FH, yc = yTop - A * slope;
  const P = (px: number, pz: number, hy = 0): V2 => [x + px * (1 - (pz + A) * 0.00022 / s), yc - pz * slope - hy * drop];
  return {x, y, s, A, FH, yTop, yc, P, rings: [A, A * 0.8, A * 0.66, A * 0.54], hs: [0, -14 * s, -28 * s, -46 * s], fb: yc + A * slope * 0.9};
};
type KG = ReturnType<typeof kundGeom>;
const poly = (pts: V2[]) => `M ${pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(" L ")} Z`;
const sq = (g: KG, a: number, hy: number) => poly([g.P(-a, -a, hy), g.P(a, -a, hy), g.P(a, a, hy), g.P(-a, a, hy)]);
// Brick joints across the top ledge, on the given sides (f, b, l, r): two courses of bricks, staggered.
const ledgeJoints = (g: KG, sides: string[]): string => {
  const a0 = g.rings[0], a1 = g.rings[1], m = (a0 + a1) / 2, st = 46 * g.s, out: string[] = [];
  const at = (sd: string, t: number, r: number) => (sd === "f" ? g.P(t, -r) : sd === "b" ? g.P(t, r) : sd === "l" ? g.P(-r, t) : g.P(r, t));
  for (const sd of sides) for (let t = -a0 + st; t < a0; t += st) {
    ([[a0, m, 0], [m, a1, st / 2]] as const).forEach(([o, i, off]) => {
      const tt = t + off;
      if (Math.abs(tt) >= i - 4) return;
      const p0 = at(sd, tt, o), p1 = at(sd, tt, i);
      out.push(`M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} L ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`);
    });
  }
  return out.join(" ");
};
// The bed of the pit: a low heap of charcoal glowing through its gaps, greying over with ash.
const pitBed = (g: KG) => {
  const a3 = g.rings[3], hf = g.hs[3];
  const [lx, ly] = g.P(-a3 * 0.98, -a3 * 0.6, hf), [rx, ry] = g.P(a3 * 0.98, -a3 * 0.6, hf), yb = g.P(0, a3 * 0.7, hf)[1];
  const topAt = (x: number) => { const u = clamp01((x - lx) / (rx - lx)); return yb - Math.pow(Math.sin(u * Math.PI), 0.7) * 34 * g.s - Math.sin(u * 9.4) * 5 * g.s; };
  const top: Pt[] = Array.from({length: 13}, (_, i) => { const x = lerp(lx, rx, i / 12); return [x, topAt(x) + (rnd(i, 38) - 0.5) * 9 * g.s] as Pt; });
  const mound = smooth([[lx, ly + 30, "c"], ...top, [rx, ry + 30, "c"]]);
  const chunks = Array.from({length: 46}, (_, i) => {
    const cx = lerp(lx + 16, rx - 16, rnd(i, 41)), cy = lerp(topAt(cx) + 6 * g.s, ly + 20, Math.pow(rnd(i, 42), 0.8));
    const w = (7 + rnd(i, 43) * 12) * g.s, h = (4 + rnd(i, 44) * 6) * g.s, rot = rnd(i, 45) * Math.PI;
    const pts: Pt[] = Array.from({length: 5}, (_, k) => { const an = rot + (k / 5) * Math.PI * 2, rr = 0.7 + rnd(i * 5 + k, 46) * 0.45; return [cx + Math.cos(an) * w * rr, cy + Math.sin(an) * h * rr, "c"] as Pt; });
    return {d: smooth(pts), cx, cy, w};
  });
  return {mound, chunks, cx: (lx + rx) / 2, cy: (yb + ly) / 2, rx: (rx - lx) / 2};
};
const KundBack: React.FC<{g: KG; light: number; f: number; ash?: number}> = ({g, light, f, ash = 0}) => {
  const id = uid(), {rings, hs, P} = g, L = Math.min(1.3, light);
  const bed = pitBed(g);
  const [fx, fy] = P(0, 0, hs[3]);
  return (
    <g>
      <defs>
        <radialGradient id={`${id}t`} gradientUnits="userSpaceOnUse" cx={fx} cy={fy - 20} r={g.A * 1.2}><stop offset="0" stopColor="#E0905A"/><stop offset="0.4" stopColor="#8A4228"/><stop offset="1" stopColor="#2A1416"/></radialGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F2A462"/><stop offset="1" stopColor="#9A4426"/></linearGradient>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9A929E"/><stop offset="0.6" stopColor="#6E6876"/><stop offset="1" stopColor="#4A4450"/></linearGradient>
      </defs>
      {[0, 1, 2].map((j) => {
        const a = rings[j + 1], h0 = hs[j], h1 = hs[j + 1];
        return <g key={j}>
          <path d={`${sq(g, rings[j], h0)} ${sq(g, a, h0)}`} fillRule="evenodd" fill="#1E1014"/>
          <path d={`${sq(g, rings[j], h0)} ${sq(g, a, h0)}`} fillRule="evenodd" fill={`url(#${id}t)`} opacity={0.25 + 0.55 * L}/>
          {j === 0 ? <path d={ledgeJoints(g, ["b", "l", "r"])} stroke="#140709" strokeWidth={1.6} opacity={0.7}/> : null}
          {/* the course line along the middle of the ledge */}
          <path d={sq(g, (rings[j] + a) / 2, h0)} fill="none" stroke="#1A0A0C" strokeWidth={1.6 * g.s} opacity={0.55}/>
          {/* the risers down to the next ledge: the back one faces us and the fire */}
          <path d={poly([P(-a, a, h0), P(a, a, h0), P(a, a, h1), P(-a, a, h1)])} fill="#140809"/>
          <path d={poly([P(-a, a, h0), P(a, a, h0), P(a, a, h1), P(-a, a, h1)])} fill={`url(#${id}r)`} opacity={0.18 + 0.4 * L}/>
          <path d={poly([P(-a, -a, h0), P(-a, a, h0), P(-a, a, h1), P(-a, -a, h1)])} fill="#8A4024" opacity={0.3 + 0.5 * L}/>
          <path d={poly([P(a, -a, h0), P(a, a, h0), P(a, a, h1), P(a, -a, h1)])} fill="#8A4024" opacity={0.3 + 0.5 * L}/>
          <path d={poly([P(-a, a, h0), P(a, a, h0)])} stroke={K.rim} strokeWidth={1.2} opacity={0.35 * L}/>
        </g>;
      })}
      {/* the pit floor: a bed of coals glowing through the gaps, greying over with ash */}
      <path d={sq(g, rings[3], hs[3])} fill="#2A0E0C"/>
      <defs><clipPath id={`${id}m`}><path d={bed.mound}/></clipPath></defs>
      <path d={bed.mound} fill="#1E0C0C"/>
      <g clipPath={`url(#${id}m)`}>
        <Glow x={bed.cx} y={bed.cy} rx={bed.rx * 1.1} ry={60 * g.s} g="fl-ember" o={0.95 - 0.5 * ash}/>
        {bed.chunks.map((c, i) => {
          const puls = 0.55 + 0.45 * Math.sin(f / (15 + rnd(i, 36) * 12) + i * 2.3), live = i % 5 === 2;
          return <g key={i}>
            <path d={c.d} fill="#F06A2C" opacity={(0.5 + 0.5 * puls) * (1 - 0.5 * ash)}/>
            <path d={c.d} fill={live ? "#5A1E12" : "#160A0C"} transform={`translate(0 ${(-1.8 * g.s).toFixed(2)})`}/>
            {live ? <path d={c.d} fill="#FF9A48" opacity={puls * 0.55 * (1 - 0.6 * ash)} transform={`translate(0 ${(-1.8 * g.s).toFixed(2)})`}/> : null}
          </g>;
        })}
        {ash > 0 ? <>
          <path d={bed.mound} fill={`url(#${id}a)`} opacity={0.88 * ash}/>
          {/* the ash lies in soft lumps; embers glow through its cracks */}
          {bed.chunks.filter((_, i) => i % 6 === 0).map((c, i) => <ellipse key={i} cx={c.cx} cy={c.cy + 4 * g.s} rx={c.w * 2.4} ry={c.w * 0.9} fill="url(#fl-shade)" opacity={0.3 * ash}/>)}
          {bed.chunks.filter((_, i) => i % 5 === 3).map((c, i) => {
            const pts: number[][] = [[c.cx, c.cy]];
            for (let k = 1; k < 9; k++) pts.push([pts[k - 1][0] + (8 + rnd(i * 9 + k, 57) * 8) * g.s * (i % 2 ? 1 : -1), pts[k - 1][1] + Math.sin(k * 0.9 + i) * 2.2 * g.s]);
            const pu = 0.55 + 0.45 * Math.sin(f / 23 + i * 2.1);
            return <g key={i} opacity={ash * pu}>
              <path d={ribbon(pts, 2.4 * g.s, 0.4 * g.s)} fill="#FF7A30"/>
              <path d={ribbon(pts, 1.1 * g.s, 0.3 * g.s)} fill="#FFD08A"/>
            </g>;
          })}
          {bed.chunks.filter((_, i) => i % 4 === 1).map((c, i) => {
            const pu = 0.55 + 0.45 * Math.sin(f / 19 + i * 1.7);
            return <g key={i}>
              <Glow x={c.cx} y={c.cy} rx={c.w * 1.5} ry={c.w * 0.75} g="fl-ember" o={ash * pu}/>
              <ellipse cx={c.cx} cy={c.cy} rx={c.w * 0.32} ry={c.w * 0.16} fill="#FFC27A" opacity={ash * pu * 0.9}/>
            </g>;
          })}
        </> : null}
      </g>
    </g>
  );
};
// The front of the altar, drawn over the foot of the flames: the near ledge and the brick face with its moulding.
const KundFront: React.FC<{g: KG; light: number}> = ({g, light}) => {
  const id = uid(), {x, y, s, A, yTop, rings, P} = g, L = Math.min(1.3, light);
  const bricks: string[] = [];
  const ch = (g.FH - 22 * s) / 4;
  for (let c = 0; c < 4; c++) {
    const yy = yTop + 12 * s + c * ch;
    bricks.push(`M ${x - A} ${yy.toFixed(1)} L ${x + A} ${yy.toFixed(1)}`);
    for (let bx = x - A + (c % 2 ? 36 * s : 0) + 72 * s; bx < x + A - 4; bx += 72 * s) bricks.push(`M ${bx.toFixed(1)} ${yy.toFixed(1)} l 0 ${ch.toFixed(1)}`);
  }
  return (
    <g>
      <defs>
        <radialGradient id={`${id}t`} gradientUnits="userSpaceOnUse" cx={x} cy={g.yc} r={A * 1.2}><stop offset="0" stopColor="#E0905A"/><stop offset="0.4" stopColor="#8A4228"/><stop offset="1" stopColor="#2A1416"/></radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A1C1C"/><stop offset="0.25" stopColor="#1E1016"/><stop offset="1" stopColor="#0E080C"/></linearGradient>
      </defs>
      <ellipse cx={x} cy={y + 4} rx={A * 1.25} ry={20 * s} fill="url(#fl-shade)" opacity={0.8}/>
      <path d={poly([P(-A, -A), P(A, -A), P(rings[1], -rings[1]), P(-rings[1], -rings[1])])} fill="#1E1014"/>
      <path d={poly([P(-A, -A), P(A, -A), P(rings[1], -rings[1]), P(-rings[1], -rings[1])])} fill={`url(#${id}t)`} opacity={0.25 + 0.55 * L}/>
      <path d={ledgeJoints(g, ["f"])} stroke="#140709" strokeWidth={1.6} opacity={0.7}/>
      <path d={poly([P(-rings[1], -rings[1]), P(rings[1], -rings[1])])} stroke="#FFD9A0" strokeWidth={1.4} opacity={0.6 * L}/>
      <rect x={x - A} y={yTop} width={2 * A} height={g.FH} fill={`url(#${id}f)`}/>
      <rect x={x - A - 6 * s} y={yTop} width={2 * A + 12 * s} height={12 * s} fill="#2A1418"/>
      <rect x={x - A - 6 * s} y={yTop} width={2 * A + 12 * s} height={1.8} fill={K.rim} opacity={0.75 * L}/>
      <path d={bricks.join(" ")} stroke="#060307" strokeWidth={2 * s} fill="none" opacity={0.85}/>
      <rect x={x - A - 10 * s} y={y - 10 * s} width={2 * A + 20 * s} height={10 * s} fill="#140A10"/>
    </g>
  );
};

// The offering: a long ladle (sruk) reaching in from above, a thin stream of ghee pouring into the fire.
const Ghee: React.FC<{f: number; flow: number; fb: number; fh: number}> = ({f, flow, fb, fh}) => {
  const id = uid();
  const tip: V2 = [1048, 232], tilt = 0.5 * flow;
  const end = fb - fh * 0.48;
  const bowl = smooth([[tip[0], tip[1], "c"], [tip[0] + 22, tip[1] + 18], [tip[0] + 62, tip[1] + 26], [tip[0] + 104, tip[1] + 14], [tip[0] + 128, tip[1] - 8, "c"], [tip[0] + 96, tip[1] - 14], [tip[0] + 52, tip[1] - 12], [tip[0] + 18, tip[1] - 6]]);
  const handle = ribbon([[tip[0] + 118, tip[1] - 8], [tip[0] + 340, tip[1] - 90], [tip[0] + 620, tip[1] - 188], [tip[0] + 960, tip[1] - 300]], 11, 20);
  const knob = smooth([[tip[0] + 108, tip[1] - 2], [tip[0] + 118, tip[1] - 20], [tip[0] + 138, tip[1] - 22], [tip[0] + 146, tip[1] - 6], [tip[0] + 130, tip[1] + 4]]);
  const pts: number[][] = [];
  for (let i = 0; i <= 18; i++) { const u = i / 18; pts.push([tip[0] + 2 - 24 * Math.sqrt(u) + Math.sin(f / 5 + u * 9) * 1.2 * u, tip[1] + 4 + (end - tip[1] - 4) * u]); }
  return (
    <g>
      <defs><linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1={0} y1={tip[1]} x2={0} y2={end}><stop offset="0" stopColor="#FFF2CC"/><stop offset="0.6" stopColor="#F5C870"/><stop offset="1" stopColor="#F0A04B" stopOpacity={0.3}/></linearGradient></defs>
      {flow > 0.01 ? <g opacity={flow}>
        <path d={ribbon(pts, 6, 3.2)} fill={`url(#${id}s)`}/>
        {Array.from({length: 5}, (_, i) => { const u = ((f * 0.045 + i / 5) % 1); const p = pts[Math.floor(u * 18)]; return <ellipse key={i} cx={p[0]} cy={p[1]} rx={1.5} ry={5} fill="#FFFBEA" opacity={0.8}/>; })}
        <Glow x={pts[18][0]} y={end} rx={80} ry={56} g="fl-hot" o={0.45}/>
      </g> : null}
      <g transform={`rotate(${(-tilt * 8).toFixed(2)} ${tip[0] + 130} ${tip[1]})`}>
        <Rimmed paths={[handle, bowl, knob]} light={[0.15, 1]} fill="#160C14" rim={K.rim} w={2.6}/>
      </g>
    </g>
  );
};

// ---------- smoke as filaments ----------
// Rising, curling, translucent bands that pinch and swell; a wave travels up each so its curls climb. Filled with a
// vertical gradient (userSpace, base to top): warm where the fire lights it from below, cool and thin at the top.
type Fil = {x: number; y: number; top: number; amp: number; wl: number; sp: number; ph: number; w0: number; w1: number; drift: number};
const filOf = (i: number, x: number, spread: number, y: number, top: number, w1: number, salt = 0, ampK = 1): Fil => ({
  x: x + (rnd(i, salt + 51) - 0.5) * spread, y, top: top - rnd(i, salt + 52) * 120, amp: (10 + rnd(i, salt + 53) * 34) * ampK, wl: 1.1 + rnd(i, salt + 54) * 1.6,
  sp: 0.04 + rnd(i, salt + 55) * 0.035, ph: rnd(i, salt + 56) * 6.28, w0: 4 + rnd(i, salt + 57) * 8, w1: w1 * (0.45 + 0.8 * rnd(i, salt + 58)), drift: (rnd(i, salt + 59) - 0.4) * 260,
});
const filament = (q: Fil, f: number, bend: number, i: number): string => {
  const M = 22, pts: number[][] = [], ws: number[] = [];
  for (let j = 0; j <= M; j++) {
    const u = j / M;
    pts.push([q.x + Math.sin(u * q.wl * Math.PI * 2 - f * q.sp + q.ph) * q.amp * (0.25 + u) + q.drift * u * u + bend * u * u, lerp(q.y, q.top, u)]);
    ws.push(lerp(q.w0, q.w1, Math.pow(u, 0.8)) * (0.62 + 0.38 * Math.sin(u * 7.3 + f * 0.04 + i * 1.7)));
  }
  return ribbonW(pts, ws);
};
const SmokeGrad: React.FC<{id: string; y0: number; y1: number; k?: number}> = ({id, y0, y1, k = 1}) => (
  <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={y0} x2={0} y2={y1}>
    <stop offset="0" stopColor="#C88850" stopOpacity={0}/><stop offset="0.07" stopColor="#B87A52" stopOpacity={0.62 * k}/><stop offset="0.26" stopColor="#7A5258" stopOpacity={0.52 * k}/>
    <stop offset="0.55" stopColor="#463E5C" stopOpacity={0.42 * k}/><stop offset="1" stopColor="#2C2C4C" stopOpacity={0}/>
  </linearGradient>
);

// ---------- the kalasha: a brass pot with mango leaves and a coconut, its belly catching the fire ----------
// Base at (0, 0), about 200 units tall; drawn at scale s.
const KAL_POT = smooth([[-26, 0, "c"], [-42, -8], [-58, -30], [-62, -56], [-52, -80], [-32, -94], [-18, -100], [-16, -108, "c"], [-28, -114], [-31, -120, "c"], [31, -120, "c"], [28, -114], [16, -108, "c"], [18, -100], [32, -94], [52, -80], [62, -56], [58, -30], [42, -8], [26, 0, "c"]], {wind: "cw"});
const KAL_NUT = smooth([[-24, -116], [-31, -138], [-29, -162], [-18, -182], [-6, -193], [0, -197, "c"], [6, -193], [18, -182], [29, -162], [31, -138], [24, -116]], {wind: "cw"});
// five mango leaves a side, fanned from under the coconut and drooping over the pot's shoulders
const KAL_LEAVES: string[] = Array.from({length: 10}, (_, i) => {
  const sd = i % 2 ? 1 : -1, k = Math.floor(i / 2), L = 58 + (k % 2) * 12 - k * 2, rise = 26 - k * 5, droop = 0.55 + k * 0.12, pts: number[][] = [];
  for (let j = 0; j <= 12; j++) { const u = j / 12; pts.push([sd * (8 + L * u * (0.95 - k * 0.06)), -122 - rise * Math.sin(u * Math.PI * 0.8) + droop * L * u * u]); }
  return blade(pts, 7.5);
});
const KAL_FIBRE = Array.from({length: 7}, (_, i) => { const a = -Math.PI / 2 + (i - 3) * 0.22; return ribbon([[0, -182], [Math.cos(a) * 14, -182 + Math.sin(a) * 14], [Math.cos(a) * 22 + (i - 3) * 2, -182 + Math.sin(a) * 20 + 3]], 2.2, 0.4, 1, "cw"); }).join(" ");
const Kalasha: React.FC<{x: number; y: number; s: number; lp: V2; light: number; f: number}> = ({x, y, s, lp, light, f}) => {
  const id = uid();
  // the light point in the pot's own units, and the direction the rim pass pushes the dark fill
  const lx = (lp[0] - x) / s, ly = (lp[1] - y) / s, ll = Math.hypot(lx, ly + 60) || 1, dx = lx / ll, dy = (ly + 60) / ll, w = 2.6 / s;
  const sh = Math.min(1.3, light);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}b`} gradientUnits="userSpaceOnUse" x1={-64} y1={0} x2={64} y2={0}>
          <stop offset="0" stopColor="#140A08"/><stop offset="0.42" stopColor="#2A170E"/><stop offset="0.66" stopColor={mixHex("#3A2210", "#7A4A1E", sh * 0.8)}/>
          <stop offset="0.8" stopColor={mixHex("#4A2C12", "#D89A48", sh * 0.85)}/><stop offset="0.88" stopColor={mixHex("#3A2210", "#F2C070", sh * 0.8)}/><stop offset="0.95" stopColor={mixHex("#24140C", "#8A5422", sh * 0.7)}/><stop offset="1" stopColor="#1E100A"/>
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={2} rx={84} ry={11} fill="url(#fl-shade)" opacity={0.8}/>
      <Rimmed paths={[...parts(dOf(ledge({x0: -66, x1: 66, y: 0, h: 22, seed: 9})[0])), {d: KAL_NUT, fill: "#2A160E"}, {d: KAL_FIBRE, rw: 0.5, fill: "#2A160E"}, ...KAL_LEAVES.map((d) => ({d, rw: 0.7, fill: "#0E0E0A"})), KAL_POT]} point={[lx, ly]} light={[1, -0.4]} fill="#140C10" rim={K.rim} w={w}/>
      {/* the brass: the pot again in its sheen, set back from the lit edge so the rim still shows; a hot highlight */}
      <path d={KAL_POT} transform={`translate(${(-dx * w).toFixed(2)} ${(-dy * w).toFixed(2)})`} fill={`url(#${id}b)`}/>
      <path d="M -17 -104 L 17 -104 M -18 -100.5 L 18 -100.5 M -17 -97 L 17 -97" stroke="#7A2418" strokeWidth={1.6} opacity={0.9}/>
      <path d="M 6 -104 L 17 -104 M 7 -100.5 L 18 -100.5" stroke="#FFB070" strokeWidth={0.9} opacity={0.6 * sh}/>
      <path d="M -54 -56 Q 0 -44 54 -56" stroke="#0E0806" strokeWidth={1.4} fill="none" opacity={0.6}/>
      <path d="M 24 -51 Q 40 -53 54 -56" stroke="#FFD08A" strokeWidth={1.1} fill="none" opacity={0.55 * sh}/>
      <ellipse cx={38} cy={-60} rx={7} ry={24} fill="url(#fl-hot)" opacity={0.75 * sh * (0.92 + 0.08 * Math.sin(f / 5))}/>
    </g>
  );
};

// ---------- the yajna (4.24-25, 3.9, 17.23): the kunda in a carved pavilion ----------
// The kit Fire on the havan kunda, its white cores, blue roots and licks breaking into curling smoke, the air above it
// shimmering. Two carved kit pillars and a beam frame the shot; their inner faces, the floor and the brass kalasha catch
// the firelight, flickering with it. offering: ghee poured from a ladle, grain scattered, a marigold dropped, each making
// the fire leap and throwing up sparks that climb and stay as the morning stars; syllables: the three words (s.labels,
// ॐ तत् सत्) written one by one above the fire in the film's one type rule; ash: the fire burns down to ash and embers.
const PILLARS = [{x: 150, side: 1}, {x: 1770, side: -1}];
const FireScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const v = String(s.variant || "");
  const mood = moodOf(s, "night");
  const id = uid();
  const X = 960, g = kundGeom(X, 912, 1), FB = g.fb;
  const off = v === "offering", syl = v === "syllables";
  const OF = off ? [{a: 0.08 * n, land: 0.15 * n, end: 0.42 * n}, {a: 0.47 * n, land: 0.53 * n, end: 0.58 * n}, {a: 0.63 * n, land: 0.71 * n, end: 0.73 * n}] : [];
  let k = 1, ash = 0;
  if (v === "ash") { const p = sstep((f - 0.1 * n) / (0.62 * n)); k = 1 - 0.985 * p; ash = sstep((f - 0.3 * n) / (0.5 * n)); }
  if (off) k = 1 + 0.12 * ease(f, OF[0].land, 20) * (1 - ease(f, OF[0].end, 20)) + OF.reduce((a, o) => a + 0.3 * bump(f, o.land, 5, 40), 0);
  if (syl) k = 0.96;
  const flick = 0.9 + 0.1 * wob(f * 0.13, 3), light = Math.max(v === "ash" ? 0.3 * (1 - 0.5 * ash) : 0, k) * flick;
  const FH = 390, FW = 190;
  const lp: V2 = [X, FB - FH * 0.35 * Math.max(0.3, k)];
  const labels: string[] = Array.isArray(s.labels) ? s.labels.slice(0, 3).map(String) : [];
  const HZ = 740;
  const nFil = syl ? 14 : v === "ash" ? 6 : 9;
  // the beam over the pavilion: a carved band, a dentil course, pendant buds; its underside faces the fire
  const beam: It[] = [{d: polyD([[-200, -80], [W + 200, -80], [W + 200, 58], [-200, 58]], true, "cw")}];
  let dent = "";
  for (let x = -180; x < W + 200; x += 34) dent += polyD([[x, 58], [x + 20, 58], [x + 20, 70], [x, 70]], true, "cw") + " ";
  beam.push({d: dent});
  for (let x = 330; x < W - 300; x += 210) beam.push({d: smooth([[x - 7, 70, "c"], [x - 9, 84], [x, 98, "c"], [x + 9, 84], [x + 7, 70, "c"]], {wind: "cw"})});
  const beamRel: It = {d: [polyD([[-200, 8], [W + 200, 8], [W + 200, 11], [-200, 11]], true, "cw"), polyD([[-200, 34], [W + 200, 34], [W + 200, 36], [-200, 36]], true, "cw")].join(" "), fill: RELIEF, rim: false};
  // star sparks: thrown up by each offering, climbing to a place in the sky and staying there as a star
  const stars = OF.flatMap((o, j) => Array.from({length: 6}, (_, i) => {
    const q = j * 6 + i, t0 = o.land + i * 3, dur = 70 + rnd(q, 401) * 50, u = (f - t0) / dur;
    if (u <= 0) return null;
    const sx = X + (rnd(q, 402) - 0.5) * 140, sy = FB - 280, tx = 260 + rnd(q, 403) * 1400, ty = 70 + rnd(q, 404) * 270;
    const e = sstep(Math.min(1, u)), px = lerp(sx, tx, e) + Math.sin(e * Math.PI * 2 + q) * 40 * (1 - e), py = lerp(sy, ty, Math.pow(e, 0.8));
    const fade = 1 - 0.65 * ease(f, 0.86 * n, 0.14 * n), tw = u >= 1 ? 0.6 + 0.4 * Math.sin(f / (6 + rnd(q, 405) * 6) + q) : 1;
    return <g key={q} opacity={fade * tw}>
      <SoftGlow x={px} y={py} r={u < 1 ? 26 : 12} c0="#FFF0C8" c1="#F0A04B" o={u < 1 ? 0.9 : 0.6} k={2.4}/>
      <circle cx={px} cy={py} r={u < 1 ? 2.2 : 1.6} fill="#FFF6DC"/>
    </g>;
  }));
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.05)} cx={X} cy={600}
      overlay={syl && labels.length ? <>{labels.map((t, i) => {
        const at = n * (0.44 + 0.16 * i), x = 960 + (i - (labels.length - 1) / 2) * 330, y = 300;
        return <g key={i}>
          <SoftGlow x={x} y={y - 36} r={200} ry={130} c0="#FFD890" c1="#E8823A" o={0.6 * ease(f, at, 22) * (0.92 + 0.08 * wob(f * 0.2, i))} k={2}/>
          <Label sa={t} f={f} at={at} x={x} y={y} anchor="middle" size={112}/>
        </g>;
      })}</> : null}>
      <FlameDefs/>
      <Sky mood={mood} sun={[1610, 186]} sunR={17} f={f} rays={0} id="fire" clouds={0.35} horizon={HZ}/>
      {off ? <SoftGlow x={1300} y={HZ + 10} r={1200} ry={320} c0="#F4A868" c1="#6A2E4A" o={0.4 * f / Math.max(1, n)} k={1.5}/> : null}
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#170F20"/><stop offset="1" stopColor="#07040B"/></linearGradient>
        <SmokeGrad id={`${id}s`} y0={FB - FH * 0.55} y1={-60} k={syl ? 1.15 : 1}/>
        {PILLARS.map((p, i) => <linearGradient key={i} id={`${id}p${i}`} gradientUnits="userSpaceOnUse" x1={p.x + p.side * 66} y1={0} x2={p.x + p.side * 18} y2={0}>
          <stop offset="0" stopColor="#F09850" stopOpacity={Math.min(0.42, 0.3 * light)}/><stop offset="0.45" stopColor="#D06A38" stopOpacity={Math.min(0.2, 0.12 * light)}/><stop offset="1" stopColor="#C2553A" stopOpacity={0}/>
        </linearGradient>)}
        {PILLARS.map((p, i) => <clipPath key={i} id={`${id}c${i}`}><path d={dOf(pillar({x: p.x, y: 1062, h: 1000})[0])}/></clipPath>)}
      </defs>
      {/* the far trees on the horizon, then the ground */}
      <path d={ridge([[-60, HZ - 4], ...Array.from({length: 22}, (_, i) => [i * 95 - 30, HZ - 14 - rnd(i, 31) * 22] as Pt), [W + 60, HZ - 6]], HZ + 20)} fill="#1A1228"/>
      {[...neem({x: 250, y: HZ, h: 120, seed: 4, t: f}), ...peepal({x: 610, y: HZ, h: 170, seed: 6, t: f}), ...khejri({x: 1290, y: HZ, h: 130, seed: 2, t: f}), ...palmyra({x: 1470, y: HZ, h: 190, seed: 3, t: f}), ...neem({x: 1720, y: HZ, h: 110, seed: 9, t: f})]
        .map((it, i) => <path key={i} d={dOf(it)} transform={typeof it === "string" ? undefined : it.t} fill="#1A1228"/>)}
      <rect x={-60} y={HZ} width={W + 120} height={H - HZ + 80} fill={`url(#${id}g)`}/>
      <Glow x={X} y={g.y - 24} rx={1050 * Math.max(0.3, light)} ry={250 * Math.max(0.3, light)} g="fl-floor" o={Math.min(1, 0.3 + 0.7 * light)}/>
      {stars}
      {/* the smoke above the fire, and the shimmer */}
      <g>{Array.from({length: nFil}, (_, i) => <path key={i} d={filament(filOf(i, X, 160, FB - FH * 0.55 * Math.max(0.4, k), -40, syl ? 260 : 190, 7), f, 60, i)} fill={`url(#${id}s)`} opacity={0.5}/>)}</g>
      <KundBack g={g} light={light} f={f} ash={ash}/>
      {off ? <Ghee f={f} flow={ease(f, OF[0].a, 10) * (1 - ease(f, OF[0].end, 12))} fb={FB} fh={FH}/> : null}
      <Shimmer f={f} x={X} y={FB - FH * 0.85 * k} w={FW} h={380} k={k}/>
      {k > 0.05 ? Array.from({length: 5}, (_, i) => { const u = i / 4 - 0.5, hh = FH * k * (1.02 + 0.22 * rnd(i, 21)) * (1 - 0.45 * Math.abs(u)); return <Flame key={i} x={X + u * FW * 1.3} y={FB + 4} h={hh} w={hh * 0.13} f={f} seed={30 + i} calm={0.05} lean={-u * 0.32} b={0.7} halo={0} licks={2} blue={0.4}/>; }) : null}
      <FireBed x={X} y={FB} w={FW} h={FH} f={f} seed={2} k={k} calm={0.15} sparks={0} halo={1}/>
      <FireBed x={X - 10} y={FB + 6} w={FW * 0.6} h={FH * 0.62} f={f} seed={7} k={k} calm={0.3} sparks={0} halo={0}/>
      {v === "ash" && k < 0.6 ? <Plume f={f} x={X} y={FB - 30} rise={560} n={9} op={0.75 * (1 - k)} wind={0.12} r0={16} r1={120} spread={180} seed={5}/> : null}
      <KundFront g={g} light={light}/>
      <Sparks f={f} x={X} y={FB} w={FW} h={FH} k={k} n={off ? 40 : 28}/>
      {/* the offerings: grain from a hand of light, then a marigold */}
      {off ? (() => {
        const G2 = OF[1], F3 = OF[2], gp = (f - G2.a) / (G2.land - G2.a + 10), fp = (f - F3.a) / (F3.land - F3.a);
        return <>
          {gp > -0.2 && gp < 1.3 ? <SoftGlow x={X + 90} y={300} r={70} c0="#FFF2D2" c1="#F0B060" o={0.8 * bump(f, G2.a - 8, 10, 30)} k={2.2}/> : null}
          {gp > 0 && gp < 1.4 ? Array.from({length: 36}, (_, i) => { const u = gp - rnd(i, 411) * 0.4; if (u <= 0 || u > 1) return null; return <ellipse key={i} cx={X + 90 + (rnd(i, 412) - 0.6) * 90 * u} cy={300 + (FB - 230 - 300) * u * u} rx={1.4} ry={2.4} fill="#FFE2A0" opacity={0.85}/>; }) : null}
          {fp > -0.2 && fp < 1 ? <SoftGlow x={X - 50} y={270} r={70} c0="#FFF2D2" c1="#F0B060" o={0.8 * bump(f, F3.a - 8, 10, 26)} k={2.2}/> : null}
          {fp > 0 && fp < 1 ? (() => {
            const mx = X - 50 + 40 * fp, my = 270 + (FB - 220 - 270) * fp * fp, r = 20;
            return <g transform={`translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${(f * 4).toFixed(1)})`}>
              {Array.from({length: 16}, (_, i) => { const a = (i / 16) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * r * 0.62} cy={Math.sin(a) * r * 0.62} rx={r * 0.42} ry={r * 0.24} transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * r * 0.62} ${Math.sin(a) * r * 0.62})`} fill={i % 2 ? "#D8701E" : "#F09030"}/>; })}
              <circle r={r * 0.42} fill="#B85A14"/><circle r={r * 0.2} fill="#7A3A10"/>
            </g>;
          })() : null}
        </>;
      })() : null}
      {/* the kalasha by the altar */}
      <Kalasha x={X - 560} y={986} s={1.45} lp={lp} light={light} f={f}/>
      {/* the pavilion: two carved pillars and the beam, rimmed by the fire, their inner faces flickering with it */}
      {PILLARS.map((p, i) => {
        const pp = pillar({x: p.x, y: 1062, h: 1000});
        return <g key={i}>
          <Rimmed paths={pp} point={lp} light={[p.side, 0]} fill="#0C070F" rim={K.rim} w={3}/>
          <rect x={p.x - 260} y={-60} width={520} height={1200} fill={`url(#${id}p${i})`} clipPath={`url(#${id}c${i})`}/>
        </g>;
      })}
      <Rimmed paths={[...beam, beamRel]} point={lp} light={[0, 1]} fill="#0A060D" rim={K.rim} w={2.4}/>
      <rect x={-60} y={58} width={W + 120} height={34} fill="url(#fl-down)" opacity={0.5}/>
      <Dust f={f} sun={[X, FB - 220]} n={50} y0={200} y1={1000}/>
    </Frame>
  );
};

// ---------- 3.38 / 18.48: fire covered by smoke ----------
// The same kunda as the yajna, on open ground at night. Smoke rises off the fire in curling translucent filaments, lit
// warm from below and cool at the top, so thick at first that the fire only glows through it. Three gusts sweep in from
// the left; each bends the smoke away and blows part of it off, shafts of firelight open through the gaps, and the fire
// is revealed step by step until it stands whole and bright under a thin rising thread.
const reedsAt = (x: number, y: number, h: number, wind: number, t: number, seed: number) => reeds({x, y, h, wind, t, seed});
const SmokeVeil: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "night");
  const id = uid();
  const X = 960, g = kundGeom(X, 938, 0.8), FB = g.fb, FH = 330, FW = 150, HZ = 764;
  const GU = [0.28, 0.46, 0.62].map((a) => a * n), gd = 0.13 * n;
  const clear = GU.reduce((p, a) => p + sstep((f - a) / gd), 0) / 3;
  const blow = Math.min(1.2, GU.reduce((p, a) => p + bump(f, a - gd * 0.15, gd * 0.45, gd * 0.8), 0));
  const bright = 0.86 + 0.24 * ease(f, 0.6 * n, 0.2 * n);
  const k = bright * (0.95 + 0.05 * wob(f * 0.13, 2));
  const lp: V2 = [X, FB - FH * 0.35];
  const fil = Array.from({length: 44}, (_, i) => {
    const q = filOf(i, X, 260, FB - 24, -90, 150, 3, 2.2), th = rnd(i, 61), keep = i % 9 === 0;
    const gone = Math.min(keep ? 0.55 : 1, sstep((clear - th * 0.86) / 0.16));
    return {d: filament(q, f, 160 + blow * 420 + gone * 900, i), o: (keep ? 0.62 : 0.48) * (1 - gone)};
  });
  return (
    <Frame f={f} zoom={push(f, n, 1.02, 1.07)} cx={X} cy={640}>
      <FlameDefs/>
      <Sky mood={mood} sun={null} f={f} rays={0} id="smk" clouds={0.4} horizon={HZ}/>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#160E20"/><stop offset="1" stopColor="#06030A"/></linearGradient>
        <SmokeGrad id={`${id}s`} y0={FB - 24} y1={-90}/>
        <radialGradient id={`${id}r`} gradientUnits="userSpaceOnUse" cx={lp[0]} cy={lp[1]} r={950}>{softStops("#FFDCA0", 0.55, "#F0A04B", 1.6)}</radialGradient>
      </defs>
      {/* the far tree line and the open ground */}
      <path d={ridge([[-80, HZ - 6], [240, HZ - 26], [560, HZ - 14], [880, HZ - 30], [1200, HZ - 12], [1520, HZ - 28], [W + 80, HZ - 10]], HZ + 20)} fill="#1C1328"/>
      {[...khejri({x: 210, y: HZ - 10, h: 150, seed: 3, t: f}), ...neem({x: 470, y: HZ - 8, h: 120, seed: 5, t: f}), ...peepal({x: 1420, y: HZ - 12, h: 200, seed: 2, t: f}), ...palmyra({x: 1700, y: HZ - 8, h: 210, seed: 6, t: f})]
        .map((it, i) => <path key={i} d={dOf(it)} transform={typeof it === "string" ? undefined : it.t} fill="#1C1328"/>)}
      <rect x={-60} y={HZ} width={W + 120} height={H - HZ + 80} fill={`url(#${id}g)`}/>
      <Glow x={X} y={g.y - 10} rx={980 * k} ry={220 * k} g="fl-floor" o={0.95}/>
      {/* the kunda and its fire */}
      <KundBack g={g} light={k} f={f}/>
      <Shimmer f={f} x={X} y={FB - FH * 0.85} w={FW} h={320} k={k * clear}/>
      <FireBed x={X} y={FB} w={FW} h={FH} f={f} seed={6} k={k} calm={0.15} sparks={0} halo={1}/>
      <FireBed x={X - 8} y={FB + 5} w={FW * 0.6} h={FH * 0.62} f={f} seed={9} k={k} calm={0.3} sparks={0} halo={0}/>
      <KundFront g={g} light={k}/>
      <Sparks f={f} x={X} y={FB} w={FW} h={FH} k={k} n={24} seed={3} wind={0.4 * blow}/>
      {/* the smoke, and the fire glowing through it */}
      <g>{fil.map((q, i) => (q.o > 0.004 ? <path key={i} d={q.d} fill={`url(#${id}s)`} opacity={q.o}/> : null))}</g>
      <SoftGlow x={X} y={FB - 150} r={420} ry={360} c0="#FFC878" c1="#C2553A" o={0.5 * (1 - clear) + 0.08} k={1.8}/>
      {/* shafts of firelight through the thinning smoke */}
      <g opacity={(0.1 + 0.3 * Math.sin(Math.PI * Math.min(1, clear * 1.2))) * (0.9 + 0.1 * wob(f * 0.1, 4))}>
        {Array.from({length: 7}, (_, i) => {
          const a = (-90 + (i - 3) * 15 + rnd(i, 71) * 6 + Math.sin(f / 60 + i) * 2) * Math.PI / 180, w = (2 + rnd(i, 72) * 3) * Math.PI / 180, Lr = 950, o = clamp01(clear * 3 - i * 0.28 - rnd(i, 73) * 0.3);
          // three nested wedges give each shaft a soft edge without a blur
          return o > 0 ? <g key={i}>{[1, 0.62, 0.3].map((kk, j) => <path key={j} d={`M ${lp[0]} ${lp[1]} L ${lp[0] + Math.cos(a - w * kk) * Lr} ${lp[1] + Math.sin(a - w * kk) * Lr} L ${lp[0] + Math.cos(a + w * kk) * Lr} ${lp[1] + Math.sin(a + w * kk) * Lr} Z`} fill={`url(#${id}r)`} opacity={o * 0.45}/>)}</g> : null;
        })}
      </g>
      <g opacity={Math.min(1, blow)}><Gust f={f} v={1} lp={lp} n={46} y0={250} y1={900}/></g>
      {/* kans grass in the foreground, bowing to the gusts */}
      <Rimmed paths={[...reedsAt(150, 1084, 250, 0.15 + blow * 0.7, f, 3), ...reedsAt(1790, 1086, 230, 0.15 + blow * 0.7, f, 7)]} point={lp} light={[1, -1]} fill="#0A060D" rim={K.rim} w={2}/>
      <Dust f={f} sun={lp} n={50} y0={250} y1={1000}/>
    </Frame>
  );
};

// ---------- 3.38: the mirror covered with dust ----------
const Mirror: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "night"), amb = AMB[mood];
  const id = uid();
  const MX = 1000, MY = 450, R = 226;
  const clear = sstep((f - 0.14 * n) / (0.62 * n));
  const lamp: V2 = [690, 0];
  const moon: V2 = [MX + 62, MY - 58];
  // the clearing sweeps across the face from upper left to lower right
  const sweep = lerp(-0.35, 1.35, clear);
  const specks = Array.from({length: 240}, (_, i) => {
    const a = rnd(i, 101) * Math.PI * 2, rr = Math.sqrt(rnd(i, 102)) * R;
    return {x: MX + Math.cos(a) * rr, y: MY + Math.sin(a) * rr, r: 0.6 + rnd(i, 103) * 2.2, o: 0.15 + rnd(i, 104) * 0.4};
  });
  const motes = Array.from({length: 60}, (_, i) => {
    const a = rnd(i, 111) * Math.PI * 2, rr = Math.sqrt(rnd(i, 112)) * R, x0 = MX + Math.cos(a) * rr, y0 = MY + Math.sin(a) * rr;
    const along = ((x0 - (MX - R)) + (y0 - (MY - R))) / (4 * R), born = lerp(0.14 * n, 0.76 * n, clamp01((along + 0.35) / 1.7)), age = (f - born) / 60;
    if (age <= 0 || age >= 1) return null;
    return <circle key={i} cx={x0 + age * (60 + rnd(i, 113) * 140)} cy={y0 - age * (20 + rnd(i, 114) * 90) + Math.sin(age * 6 + i) * 6} r={0.8 + rnd(i, 115) * 1.6} fill="#FFE2A8" opacity={Math.sin(age * Math.PI) * 0.8}/>;
  });
  const beads = Array.from({length: 40}, (_, i) => { const a = (i / 40) * Math.PI * 2; return smooth(Array.from({length: 8}, (_, k) => { const an = (k / 8) * Math.PI * 2; return [MX + Math.cos(a) * (R + 52) + Math.cos(an) * 9, MY + Math.sin(a) * (R + 52) + Math.sin(an) * 9] as Pt; })); });
  const ring = `M ${MX - R - 44} ${MY} a ${R + 44} ${R + 44} 0 1 0 ${2 * (R + 44)} 0 a ${R + 44} ${R + 44} 0 1 0 ${-2 * (R + 44)} 0 Z M ${MX - R} ${MY} a ${R} ${R} 0 1 1 ${2 * R} 0 a ${R} ${R} 0 1 1 ${-2 * R} 0 Z`;
  // the crest: a lotus bud between two curling leaves
  const cy0 = MY - R - 48;
  const crest = [
    smooth([[MX - 30, cy0 + 6, "c"], [MX - 34, cy0 - 30], [MX - 20, cy0 - 70], [MX, cy0 - 112, "c"], [MX + 20, cy0 - 70], [MX + 34, cy0 - 30], [MX + 30, cy0 + 6, "c"]]),
    ...[-1, 1].map((sd) => smooth([[MX + sd * 22, cy0 + 4, "c"], [MX + sd * 44, cy0 - 18], [MX + sd * 74, cy0 - 30], [MX + sd * 96, cy0 - 22], [MX + sd * 100, cy0 - 4], [MX + sd * 86, cy0 + 6], [MX + sd * 80, cy0 - 8], [MX + sd * 70, cy0 - 12], [MX + sd * 50, cy0 - 2], [MX + sd * 36, cy0 + 10, "c"]])),
    smooth([[MX - 50, cy0 + 14, "c"], [MX, cy0 - 2], [MX + 50, cy0 + 14, "c"], [MX, cy0 + 22]]),
  ];
  const stand = smooth([[MX - 20, MY + R + 40, "c"], [MX - 26, MY + R + 74], [MX - 16, MY + R + 100], [MX - 60, MY + R + 118], [MX - 112, MY + R + 132, "c"], [MX - 112, MY + R + 146, "c"], [MX + 112, MY + R + 146, "c"], [MX + 112, MY + R + 132, "c"], [MX + 60, MY + R + 118], [MX + 16, MY + R + 100], [MX + 26, MY + R + 74], [MX + 20, MY + R + 40, "c"]]);
  const knot = smooth([[MX - 30, MY + R + 70], [MX - 22, MY + R + 60], [MX + 22, MY + R + 60], [MX + 30, MY + R + 70], [MX + 22, MY + R + 80], [MX - 22, MY + R + 80]]);
  const TABLE = MY + R + 146, DS = 0.86;
  const LF: V2 = diyaWick(lamp[0], TABLE, DS * 1.6);
  const lightV: V2 = [LF[0] - MX, LF[1] - 90 - MY];
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.06)} cx={MX - 80} cy={MY}>
      <FlameDefs/>
      <defs>
        <radialGradient id={`${id}r`} cx="0.5" cy="0.25" r="0.8"><stop offset="0" stopColor="#26325E"/><stop offset="0.6" stopColor="#151C40"/><stop offset="1" stopColor="#0A0F26"/></radialGradient>
        <radialGradient id={`${id}d`} cx="0.42" cy="0.4" r="0.7"><stop offset="0" stopColor="#76674F"/><stop offset="0.7" stopColor="#584A3C"/><stop offset="1" stopColor="#3E3430"/></radialGradient>
        <radialGradient id={`${id}b`}><stop offset="0" stopColor="#2A221E" stopOpacity={0.5}/><stop offset="1" stopColor="#2A221E" stopOpacity={0}/></radialGradient>
        <linearGradient id={`${id}m`} gradientUnits="userSpaceOnUse" x1={MX - R} y1={MY - R} x2={MX + R} y2={MY + R}>
          <stop offset={Math.max(0, Math.min(1, sweep - 0.22))} stopColor="#000"/><stop offset={Math.max(0, Math.min(1, sweep + 0.22))} stopColor="#fff"/>
        </linearGradient>
        <mask id={`${id}k`} maskUnits="userSpaceOnUse" x={MX - R - 10} y={MY - R - 10} width={2 * R + 20} height={2 * R + 20}><rect x={MX - R - 10} y={MY - R - 10} width={2 * R + 20} height={2 * R + 20} fill={`url(#${id}m)`}/></mask>
        <clipPath id={`${id}c`}><circle cx={MX} cy={MY} r={R}/></clipPath>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1"><stop offset="0.3" stopColor="#fff" stopOpacity={0}/><stop offset="0.5" stopColor="#fff" stopOpacity={0.07}/><stop offset="0.7" stopColor="#fff" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A2420"/><stop offset="0.1" stopColor="#1A0E14"/><stop offset="1" stopColor="#0A0610"/></linearGradient>
        <radialGradient id={`${id}w`} cx={LF[0]} cy={LF[1] - 40} r={1150} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#8A4A32" stopOpacity={0.9}/><stop offset="0.3" stopColor="#3A1E2A" stopOpacity={0.9}/><stop offset="1" stopColor="#0A0712" stopOpacity={1}/></radialGradient>
      </defs>
      {/* a dark room: the wall warmed by the lamp, a cool breath of moonlight from behind us */}
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}w)`}/>
      <Glow x={MX} y={MY} rx={720} ry={560} g="fl-cool" o={0.32}/>
      {/* the mirror: the reflected night sky and moon, the dust over them, the bronze frame */}
      <g clipPath={`url(#${id}c)`}>
        <circle cx={MX} cy={MY} r={R} fill={`url(#${id}r)`}/>
        {Array.from({length: 40}, (_, i) => <circle key={i} cx={MX - R + rnd(i, 121) * 2 * R} cy={MY - R + rnd(i, 122) * 2 * R} r={0.6 + rnd(i, 123) * 1.2} fill="#FFF3D6" opacity={0.3 + 0.5 * rnd(i, 124)}/>)}
        <Glow x={moon[0]} y={moon[1]} rx={190} g="fl-cool" o={0.9}/>
        <circle cx={moon[0]} cy={moon[1]} r={46} fill="#F4F1E6"/>
        <circle cx={moon[0] + 12} cy={moon[1] - 8} r={9} fill="#D8D4C8" opacity={0.5}/>
        <circle cx={moon[0] - 14} cy={moon[1] + 12} r={6} fill="#D8D4C8" opacity={0.4}/>
        {[0, 1].map((k) => <ellipse key={k} cx={MX - 260 + ((f * (0.35 + k * 0.2) + k * 240) % 620)} cy={MY + 30 + k * 70} rx={150} ry={12} fill="#3A4677" opacity={0.45}/>)}
        {/* bronze gives back a little gold, and the lamp's glow at its lower edge */}
        <circle cx={MX} cy={MY} r={R} fill="#C9A060" opacity={0.08}/>
        <Glow x={MX - R * 0.8} y={MY + R * 0.75} rx={R * 0.9} ry={R * 0.6} g="fl-soft" o={0.5}/>
        <rect x={MX - R} y={MY - R} width={2 * R} height={2 * R} fill={`url(#${id}s)`}/>
        {/* the dust: a dull film, blotches and specks, and the moon only a smear through it */}
        <g mask={`url(#${id}k)`} opacity={1 - 0.6 * clear}>
          <circle cx={MX} cy={MY} r={R} fill={`url(#${id}d)`} opacity={0.95}/>
          <Glow x={moon[0]} y={moon[1]} rx={150} g="fl-cool" o={0.3}/>
          {Array.from({length: 8}, (_, i) => <ellipse key={i} cx={MX + (rnd(i, 131) - 0.5) * R * 1.3} cy={MY + (rnd(i, 132) - 0.5) * R * 1.3} rx={50 + rnd(i, 133) * 70} ry={36 + rnd(i, 134) * 50} fill={`url(#${id}b)`}/>)}
          {specks.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#C8B8A0" opacity={p.o}/>)}
        </g>
      </g>
      <Rimmed paths={[ring, ...crest, stand, knot, ...beads]} light={lightV} fill="#24160F" rim={K.rim} w={3.2} evenodd/>
      <circle cx={MX} cy={MY} r={R + 1} fill="none" stroke="#C99A5E" strokeWidth={2} opacity={0.6}/>
      <circle cx={MX} cy={MY} r={R + 22} fill="none" stroke="#0A0508" strokeWidth={3} opacity={0.6}/>
      <circle cx={MX} cy={MY} r={R + 24} fill="none" stroke="#C99A5E" strokeWidth={1} opacity={0.35}/>
      {motes}
      {/* the table and the lamp beside the mirror */}
      <rect x={-60} y={TABLE} width={W + 120} height={H - TABLE + 60} fill={`url(#${id}t)`}/>
      <rect x={-60} y={TABLE} width={W + 120} height={2} fill={K.rim} opacity={0.35}/>
      <Glow x={LF[0]} y={TABLE + 6} rx={560} ry={70} g="fl-floor" o={0.85}/>
      <Diya x={lamp[0]} y={TABLE} s={DS * 1.6} f={f} calm={1} shadow={0.7}/>
      <Dust f={f} sun={[MX, MY]} n={50} y0={150} y1={950}/>
    </Frame>
  );
};
const Smoke: React.FC<SceneP> = ({s, n}) => (s.variant === "mirror" ? <Mirror s={s} n={n}/> : <SmokeVeil s={s} n={n}/>);

// ---------- 8.24-26, 8.5: the flame that climbs the path of light to the sun ----------
// A gold dusk on the river. On the water, a diya on a leaf boat with marigolds; behind it the far shore in three hazy
// ranges, palms and a small temple with its flag; at the lower left the ghat's steps, their edges lit, petals on them.
// A faint column of light already joins the flame to the sun. The flame stretches, a flame of it lifts and climbs the
// column (brightening it as it goes), the sun pulses when it arrives, and the disc turns and gains twelve spokes of
// light: the wheel (the film cuts back to the chariot's wheel on the field).
const marigold = (x: number, y: number, r: number, rot: number, key: string | number) => (
  <g key={key} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`}>
    {Array.from({length: 14}, (_, i) => { const a = (i / 14) * 360, c = r * 0.6; return <ellipse key={i} cx={c} cy={0} rx={r * 0.44} ry={r * 0.25} transform={`rotate(${a})`} fill={i % 2 ? "#C8601A" : "#E8862A"}/>; })}
    <circle r={r * 0.45} fill="#A8501A"/><circle r={r * 0.22} cx={-r * 0.06} cy={-r * 0.06} fill="#F2A040" opacity={0.7}/>
  </g>
);
const FlameSun: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood = moodOf(s, "gold");
  const id = uid();
  const SUN: V2 = [960, 334], SR = 62, HZ = 606;
  // the leaf boat and its lamp, rocking on the river; the flame stands on the sun's axis
  const BX = 940, BY = 914 + Math.sin(f / 26) * 3, rock = Math.sin(f / 31 + 1) * 1.4;
  const DS = 1.3, DXp = SUN[0] - 38 * 1.48 * DS, [FX, FY] = diyaWick(DXp, BY - 8, DS);
  const T0 = 0.12 * n, T1 = 0.18 * n, T2 = 0.7 * n;
  const stretch = bump(f, T0, T1 - T0, 0.08 * n), u = sstep((f - T1) / (T2 - T1)), climbing = f > T1 && f < T2;
  const pulse = bump(f, T2 - 2, 0.04 * n, 0.12 * n), spokes = ease(f, T2 + 0.02 * n, 0.18 * n);
  const FH0 = 36 * DS, fh = FH0 * (1 + 0.6 * stretch) * (f > T1 ? 0.72 + 0.28 * ease(f, T1, 0.2 * n) : 1);
  const tip0 = FY - FH0 * 1.5;
  const at = (q: number) => ({x: SUN[0] + Math.sin(q * Math.PI * 3) * 10 * (1 - q), y: lerp(tip0, SUN[1] + SR * 0.4, q), s: lerp(1, 0.45, Math.pow(q, 0.8))});
  const sp = at(u);
  // the far shore, the ghat
  const G: GhatG = {x0: -90, y0: 872, x1: 610, y1: 1012, n: 9, seed: 6, landing: 0};
  const gh = ghat({...G, view: "side", bottom: H + 120}), T = ghatTreads(G);
  const lightAt = (x: number, y: number): V2 => [SUN[0] - x, SUN[1] - y];
  const rows: React.ReactNode[] = [];
  for (let r = 0; r < 44; r++) {
    const q = r / 43, y = HZ + 3 + Math.pow(q, 1.6) * (H - HZ), spread = lerp(16, 230, Math.pow(q, 1.1));
    for (let j = 0; j < 4; j++) {
      const kk = r * 4 + j, x = SUN[0] + (rnd(kk, 141) - 0.5) * 2 * spread * (0.3 + 0.7 * rnd(kk, 142)), len = lerp(8, 64, q) * (0.5 + rnd(kk, 143));
      const tw = 0.5 + 0.5 * Math.sin(f / (4 + rnd(kk, 144) * 5) + kk), lit = Math.max(0, 1 - Math.abs(x - SUN[0]) / (spread * 1.2));
      rows.push(<rect key={kk} x={x - len / 2} y={y} width={len} height={lerp(1.2, 3, q)} rx={1} fill="#FFF0C8" opacity={tw * lit * (0.4 + 0.35 * u + 0.25 * pulse)}/>);
    }
  }
  const boat = smooth([[-150, -8, "c"], [-118, 8], [-60, 22], [0, 26], [60, 22], [118, 8], [150, -8, "c"], [116, -3], [60, 2], [0, 4], [-60, 2], [-116, -3]], {wind: "cw"});
  const veins = [-100, -50, 0, 50, 100].map((x) => `M ${x} ${2 + Math.abs(x) * -0.02} Q ${x * 1.04} 12 ${x * 1.12} ${22 - Math.abs(x) * 0.12}`).join(" ");
  return (
    <Frame f={f} zoom={push(f, n, 1, 1.06)} cx={SUN[0]} cy={600} vig={0.8}>
      <FlameDefs/>
      <Sky mood={mood} sun={SUN} sunR={SR} f={f} rays={0.3 + 0.45 * pulse + 0.15 * spokes} id="fsun" clouds={0.55} horizon={HZ} glow={1 + 0.4 * pulse}/>
      <defs>
        <linearGradient id={`${id}w`} gradientUnits="userSpaceOnUse" x1={0} y1={HZ} x2={0} y2={H}><stop offset="0" stopColor="#F4BC7C"/><stop offset="0.16" stopColor="#C8785E"/><stop offset="0.5" stopColor="#6E3A58"/><stop offset="1" stopColor="#2A1630"/></linearGradient>
        <linearGradient id={`${id}c`} gradientUnits="userSpaceOnUse" x1={0} y1={SUN[1]} x2={0} y2={FY}><stop offset="0" stopColor="#FFF4D8" stopOpacity={0.9}/><stop offset="0.5" stopColor="#FFE2A8" stopOpacity={0.45}/><stop offset="0.9" stopColor="#FFD890" stopOpacity={0.55}/><stop offset="1" stopColor="#FFD890" stopOpacity={0}/></linearGradient>
        <linearGradient id={`${id}ch`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity={0}/><stop offset="0.5" stopColor="#fff"/><stop offset="1" stopColor="#fff" stopOpacity={0}/></linearGradient>
        <mask id={`${id}cm`} maskUnits="userSpaceOnUse" x={SUN[0] - 170} y={0} width={340} height={H}><rect x={SUN[0] - 170} y={0} width={340} height={H} fill={`url(#${id}ch)`}/></mask>
        <mask id={`${id}cn`} maskUnits="userSpaceOnUse" x={SUN[0] - 22} y={0} width={44} height={H}><rect x={SUN[0] - 22} y={0} width={44} height={H} fill={`url(#${id}ch)`}/></mask>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2E1C30"/><stop offset="0.3" stopColor="#1A0E1E"/><stop offset="1" stopColor="#0C0610"/></linearGradient>
        <clipPath id={`${id}k`}><path d={dOf(gh[0])}/></clipPath>
      </defs>
      {/* the far shore: three ranges going back into the haze, palms, a small temple with its flag */}
      <path d={ridge([[-80, HZ - 30], [180, HZ - 62], [420, HZ - 44], [700, HZ - 70], [980, HZ - 40], [1260, HZ - 66], [1540, HZ - 48], [1800, HZ - 74], [W + 80, HZ - 40]], HZ + 4)} fill="#D8906E" opacity={0.42}/>
      <Haze y={HZ - 30} h={70} color="#F6C890" op={0.4}/>
      <path d={ridge([[-80, HZ - 14], [260, HZ - 38], [560, HZ - 24], [900, HZ - 36], [1180, HZ - 20], [1500, HZ - 40], [W + 80, HZ - 18]], HZ + 4)} fill="#9A4E5E" opacity={0.7}/>
      <Haze y={HZ - 10} h={40} color="#F2B880" op={0.35}/>
      <Rimmed paths={[ridge([[-80, HZ - 2], ...Array.from({length: 22}, (_, i) => [-60 + i * 95, HZ - 7 - rnd(i, 151) * 9] as Pt), [W + 80, HZ - 2]], HZ + 8),
        ...palmyra({x: 250, y: HZ - 4, h: 150, seed: 2, t: f}), ...coconut({x: 380, y: HZ - 4, h: 128, seed: 5, t: f, lean: 0.25}), ...palmyra({x: 1640, y: HZ - 5, h: 138, seed: 8, t: f}), ...coconut({x: 1770, y: HZ - 4, h: 120, seed: 3, t: f, lean: -0.2}), ...neem({x: 560, y: HZ - 4, h: 66, seed: 4, t: f})]}
        light={lightAt(960, HZ)} fill="#3A1E36" rim="#FFD08A" w={1.4}/>
      <Rimmed paths={temple({x: 1340, y: HZ - 3, w: 40, porch: 1, spires: 1, flag: true, t: f, wind: 0.6})} light={lightAt(1340, HZ - 80)} fill="#3A1E36" rim="#FFD08A" w={1.4}/>
      {/* the river holding the gold, the sun's path on it */}
      <rect x={-80} y={HZ} width={W + 160} height={H - HZ + 80} fill={`url(#${id}w)`}/>
      <Glow x={SUN[0]} y={HZ + 8} rx={600} ry={70} g="fl-warm" o={0.55}/>
      {rows}
      {/* the column of light between the flame and the sun; the stretch below the climbing flame burns brighter */}
      <g mask={`url(#${id}cm)`}>
        <rect x={SUN[0] - 170} y={SUN[1]} width={340} height={FY - SUN[1]} fill={`url(#${id}c)`} opacity={0.16 + 0.22 * u + 0.2 * pulse}/>
      </g>
      <g mask={`url(#${id}cn)`}>
        <rect x={SUN[0] - 22} y={SUN[1]} width={44} height={FY - SUN[1]} fill={`url(#${id}c)`} opacity={0.4 + 0.35 * u + 0.25 * pulse}/>
        {climbing ? <rect x={SUN[0] - 22} y={sp.y} width={44} height={tip0 - sp.y} fill="#FFF0C8" opacity={0.5}/> : null}
      </g>
      {/* the sun's answer: a pulse, then the turning wheel of twelve spokes in the disc */}
      <SoftGlow x={SUN[0]} y={SUN[1]} r={SR * (2.6 + 3.6 * pulse)} c0="#FFFBEA" c1="#FFC060" o={0.25 + 0.6 * pulse} k={2.4}/>
      {spokes > 0.01 ? <g opacity={spokes} transform={`rotate(${(f * 0.45).toFixed(2)} ${SUN[0]} ${SUN[1]})`}>
        {Array.from({length: 12}, (_, i) => { const a = (i / 12) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a), r0 = SR * 0.2, r1 = SR * 0.86, w0 = 3.4, w1 = 2.2;
          return <path key={i} d={polyD([[SUN[0] + c * r0 - sn * w0, SUN[1] + sn * r0 + c * w0], [SUN[0] + c * r1 - sn * w1, SUN[1] + sn * r1 + c * w1], [SUN[0] + c * r1 + sn * w1, SUN[1] + sn * r1 - c * w1], [SUN[0] + c * r0 + sn * w0, SUN[1] + sn * r0 - c * w0]])} fill="#E2922E" opacity={0.85}/>; })}
        <circle cx={SUN[0]} cy={SUN[1]} r={SR * 0.9} fill="none" stroke="#E2922E" strokeWidth={4.5} opacity={0.85}/>
        <circle cx={SUN[0]} cy={SUN[1]} r={SR * 0.17} fill="none" stroke="#E2922E" strokeWidth={4} opacity={0.9}/>
        {Array.from({length: 12}, (_, i) => { const a = ((i + 0.5) / 12) * Math.PI * 2; return <circle key={i} cx={SUN[0] + Math.cos(a) * SR * 0.98} cy={SUN[1] + Math.sin(a) * SR * 0.98} r={2.6} fill="#E2922E" opacity={0.8}/>; })}
      </g> : null}
      {/* the ghat: steps going down into the river, their edges lit, marigold petals on the treads */}
      <Rimmed paths={[gh[0]]} light={lightAt(260, 950)} fill={`url(#${id}g)`} rim="#FFD08A" w={2.4}/>
      <g clipPath={`url(#${id}k)`}>
        <path d={Array.from({length: 7}, (_, r) => `M -100 ${900 + r * 30} L 700 ${902 + r * 30}` + Array.from({length: 5}, (_, c) => ` M ${(-60 + c * 150 + (r % 2) * 70).toFixed(0)} ${900 + r * 30} l 0 30`).join("")).join(" ")} stroke="#06030A" strokeWidth={2} fill="none" opacity={0.6}/>
        <SoftGlow x={560} y={980} r={260} ry={120} c0="#FFC878" c1="#8E3D52" o={0.25} k={1.6}/>
      </g>
      {T.map((t, i) => Array.from({length: 2}, (_, j) => { const q = i * 2 + j; return rnd(q, 161) < 0.7 ? <ellipse key={q} cx={lerp(t.xa, t.xb, 0.15 + 0.7 * rnd(q, 162))} cy={t.y - 1.6} rx={4 + rnd(q, 163) * 2} ry={1.8} transform={`rotate(${(rnd(q, 164) - 0.5) * 50} ${lerp(t.xa, t.xb, 0.15 + 0.7 * rnd(q, 162))} ${t.y - 1.6})`} fill={rnd(q, 165) < 0.5 ? "#E8862A" : "#C8601A"}/> : null; }))}
      {/* petals adrift, the ripples round the boat, the flame's reflection */}
      {Array.from({length: 9}, (_, i) => { const x = 640 + rnd(i, 171) * 700 + Math.sin(f / 50 + i) * 8 + f * 0.12, y = 960 + rnd(i, 172) * 100; return <ellipse key={i} cx={x} cy={y} rx={4.5} ry={1.6} fill={i % 2 ? "#E8862A" : "#C8601A"} opacity={0.9}/>; })}
      {[0, 1, 2].map((k) => { const a = ((f / 90 + k / 3) % 1); return <ellipse key={k} cx={BX} cy={BY + 18} rx={170 + a * 160} ry={14 + a * 14} fill="none" stroke="#FFD8A0" strokeWidth={1.2} opacity={0.3 * (1 - a)}/>; })}
      {Array.from({length: 10}, (_, j) => { const q = j / 9, yy = BY + 30 + q * 120, len = (34 - 22 * q) * (0.6 + 0.4 * rnd(j, 181)); return <rect key={j} x={FX - len / 2 + Math.sin(f / 5 + j * 1.7) * 4} y={yy} width={len} height={2} rx={1} fill="#FFE6B0" opacity={(0.8 - 0.65 * q) * (0.6 + 0.4 * Math.sin(f / 4 + j * 2.3))}/>; })}
      {/* the leaf boat, its marigolds, the diya */}
      <g transform={`rotate(${rock.toFixed(2)} ${BX} ${BY})`}>
        <g transform={`translate(${BX} ${BY})`}>
          <Rimmed paths={[boat]} light={lightAt(BX, BY)} fill="#16140C" rim="#FFD08A" w={2}/>
          <path d={veins} stroke="#2E2A18" strokeWidth={1.4} fill="none" opacity={0.8}/>
        </g>
        {marigold(BX - 104, BY - 10, 15, f * 0.2, "m1")}
        {marigold(BX + 112, BY - 9, 13, 40 - f * 0.2, "m2")}
        {marigold(BX - 72, BY - 6, 11, 70, "m3")}
        <Diya x={DXp} y={BY - 6} s={DS} f={f} seed={4} lit={1} flame={false} shadow={0.5}/>
      </g>
      <Flame x={FX} y={FY} h={fh} f={f} seed={4} calm={0.9} b={1} halo={0.8}/>
      {/* the flame that climbs */}
      {climbing ? <g>
        {Array.from({length: 10}, (_, k) => { const p = at(Math.max(0, u - (k + 1) * 0.018)); return <circle key={k} cx={p.x} cy={p.y} r={3.2 * p.s} fill="#FFE9B8" opacity={(1 - k / 10) * 0.55}/>; })}
        <Flame x={sp.x} y={sp.y + 26 * sp.s} h={60 * sp.s} f={f} seed={9} calm={0.95} b={1} halo={0.9}/>
      </g> : null}
      <Dust f={f} sun={SUN} n={60} y0={150} y1={880}/>
    </Frame>
  );
};

export const SCENES: Record<string, React.FC<SceneP>> = {lamp: Lamp, fire: FireScene, smoke: Smoke, "flame-sun": FlameSun};

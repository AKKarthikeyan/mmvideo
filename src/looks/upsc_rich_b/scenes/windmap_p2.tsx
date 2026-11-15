// WINDMAP, Part 2 additions for look B: pins, onset streams, cloud branches, the stepping front, wet-to-dry shading, the depression swirl and the easterlies.
// Everything is drawn only from at(key) of the layer or its items. No figure is typed: printed quantities come from lab() through the spec.
// Geography is lon/lat on the Natural Earth basemap (basemap_b.json); every route is hand-placed, never data.
import React, {useMemo} from "react";
import {getLength, getPointAtLength, getTangentAtLength} from "@remotion/paths";
import {lab} from "../../cartoon/long/figs";
import {Pill, SANS, SERIF, clamp, eio, eo, lerp, prog, rng} from "../kit";
import {Cloud} from "../map";
import {ANCHORS, PIN, smooth, type LL, type Pt} from "./windmap_geo";
import type {Ctx, Layer, Out} from "./windmap_layers";
import {Flow, Rain, Tag, estW} from "./windmap_parts";

const U = (c: Ctx) => c.B.k / 24.545;
const pts = (c: Ctx, l: LL[]): Pt[] => l.map(([a, b]) => c.P(a, b));
const eof = (f: number, t: number, n = 24) => eo(prog(f, t, n));
const SX0 = 96, SX1 = 1824, TOP = 64, BOT = 920;
const lerpArr = (a: number[], b: number[], u: number) => a.map((v, i) => lerp(v, b[i], u));

// ---------------------------------------------------------------------------------------------------------------- cloud arms
/** A soft arm of cloud along a path: a pale band, puffs that pop in as the arm grows, drifting a little. p = growth 0..1. */
const CloudArm: React.FC<{id: string; d: string; p: number; f: number; s?: number; n?: number; seed?: number; band?: number; a?: number}> = ({id, d, p, f, s = 0.5, n = 12, seed = 1, band = 60, a = 0.95}) => {
  const len = useMemo(() => getLength(d), [d]);
  const jit = useMemo(() => { const r = rng(seed * 313); return Array.from({length: n}).map(() => ({o: (r() - 0.5) * 2, k: 0.75 + r() * 0.5, ph: r() * 6.28, sd: 1 + Math.floor(r() * 60)})); }, [n, seed]);
  if (p <= 0.004) return null;
  const L = p * len, dash = `${L.toFixed(1)} ${(len + 60).toFixed(1)}`;
  return (
    <g>
      <path d={d} stroke="#eef7ff" strokeWidth={band * 1.6} strokeLinecap="round" fill="none" strokeDasharray={dash} opacity="0.3" filter="url(#wm-b12)"/>
      <path d={d} stroke="#ffffff" strokeWidth={band * 0.55} strokeLinecap="round" fill="none" strokeDasharray={dash} opacity="0.22" filter="url(#wm-b5)"/>
      {jit.map((j, i) => {
        const sp = ((i + 0.5) / n) * len;
        if (sp > L) return null;
        const pa = eo(clamp((L - sp) / (len * 0.06)));
        const pt = getPointAtLength(d, sp), tg = getTangentAtLength(d, sp), m = Math.hypot(tg.x, tg.y) || 1, nx = -tg.y / m, ny = tg.x / m;
        const off = j.o * band * 0.42 + Math.sin(f / 46 + j.ph) * 5;
        return <Cloud key={i} id="wmc" x={pt.x + nx * off + Math.sin(f / 60 + j.ph) * 4} y={pt.y + ny * off + Math.cos(f / 52 + j.ph) * 3} s={s * j.k * (0.55 + 0.45 * pa)} a={a * pa} seed={j.sd}/>;
      })}
    </g>
  );
};

const OR1 = "#f2923a", OR2 = "#b9480f";

// ---- streams: the first push of the monsoon
const STREAM_BAY: LL[][] = [
  [[88.5, 0.4], [92.4, 3.4], [95.2, 6.4], [97.3, 9.6]],         // into the south Andaman Sea
  [[82.5, 3.4], [86.8, 6.6], [89.8, 9.6], [91.2, 12.8]],        // over the south Bay of Bengal
];
const STREAM_ARAB: LL[][] = [
  [[60.5, 2.2], [66.5, 5], [71.2, 7.6], [75.1, 9]],
  [[60.5, 7], [66.2, 9.4], [70.8, 11.1], [74.7, 12]],
];
const stream = (routes: LL[][], tag: string) => (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key);
  return {over: <g>
    {routes.map((r, i) => {
      const d = smooth(pts(c, r)), p = eio(prog(c.f, t + i * 10, 56));
      return <React.Fragment key={i}>
        <CloudArm id={c.ID} d={d} p={p} f={c.f} s={0.6 * U(c)} n={11} seed={i + (tag === "b" ? 3 : 9)} band={58 * U(c)}/>
        <Flow id={`wm${tag}s${i}`} d={d} p={p} f={c.f} c1={OR1} c2={OR2} w={12} speed={2.8} ph={i * 0.3}/>
      </React.Fragment>;
    })}
  </g>};
};

// ---- branches: two arms of cloud
const ARM_ARAB: LL[] = [[65, 4.2], [69.5, 7.6], [72.1, 11.6], [72.5, 15.5], [72, 19.6], [71.7, 22.6], [72.3, 24.6]];
const ARM_BAY: LL[] = [[88.6, 9], [89.4, 14.4], [89.3, 19.6], [90.6, 23.8], [91.4, 25.6], [90, 26.8], [87.2, 26.7], [83.6, 26], [80.4, 26.5], [77.4, 28.2]];
const branch = (route: LL[], tag: string, seed: number) => (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), d = smooth(pts(c, route)), p = eio(prog(c.f, t, 86)), u = U(c);
  return {over: <g>
    <CloudArm id={c.ID} d={d} p={p} f={c.f} s={0.52 * u} n={tag === "a" ? 14 : 18} seed={seed} band={64 * u}/>
    <Flow id={`wmbr${tag}`} d={d} p={p} f={c.f} c1={OR1} c2={OR2} w={11} speed={2.6} op={0.95}/>
  </g>};
};

// ---------------------------------------------------------------------------------------------------------------- the front
const FLON = [60, 66, 72, 78, 84, 90, 96, 102];
const NORTH: number[][] = [
  [9, 9, 9.5, 10.5, 12.5, 15.5, 19, 21],           // Kerala's latitude
  [16.5, 17, 18.5, 20.5, 22, 24, 26.5, 28],        // up the west coast, Bengal ahead
  [24, 25, 26.5, 29, 30.5, 33, 36, 37],            // Delhi covered, the far north-west still waiting
  [39, 39, 39, 39, 39, 39, 39, 39],                // beyond the north of India: the country is covered
];
const SOUTH: number[][] = [
  [22, 22.5, 24, 28, 38, 41, 41, 41],              // the north-west corner lets go first
  [17, 18, 20, 22, 24, 27, 30, 34],
  [9.5, 10, 11, 12.5, 15, 18, 22, 24],             // most of India, the south peninsula still wet
];
const pickShape = (tab: number[][], i: number, n: number) => tab[n <= 1 ? tab.length - 1 : Math.round((i * (tab.length - 1)) / (n - 1))];
const latAt = (arr: number[], lon: number) => { const j = Math.min(FLON.length - 2, Math.max(0, FLON.findIndex((x) => x > lon) - 1)); const u = clamp((lon - FLON[j]) / (FLON[j + 1] - FLON[j])); return lerp(arr[j], arr[j + 1], u); };

const frontState = (c: Ctx, L: Layer) => {
  const steps = L.steps ?? [], n = steps.length, north = L.dir !== "south";
  if (!n) throw new Error("windmap front: no steps");
  const shapes = steps.map((_, i) => pickShape(north ? NORTH : SOUTH, i, n));
  const entry = north ? shapes[0].map((v) => v - 4) : shapes[0].map((v) => v + 9);
  const ts = steps.map((s) => c.at(s.key));
  let arr = entry, cur = -1;
  for (let i = 0; i < n; i++) if (c.f >= ts[i]) { arr = lerpArr(i ? shapes[i - 1] : entry, shapes[i], eio(prog(c.f, ts[i], 15))); cur = i; }
  return {steps, n, north, shapes, ts, arr, cur, a0: eof(c.f, ts[0], 12)};
};

/** a row of puffs riding the front, south of the line (drawn inside the India clip) */
const FrontPuffs: React.FC<{d: string; f: number; u: number}> = ({d, f, u}) => {
  const len = getLength(d), n = 16;
  return <g>{Array.from({length: n}).map((_, i) => {
    const sp = ((i + 0.5) / n) * len, pt = getPointAtLength(d, sp), tg = getTangentAtLength(d, sp), m = Math.hypot(tg.x, tg.y) || 1;
    return <Cloud key={i} id="wmc" x={pt.x - (tg.y / m) * 26 * u + Math.sin(f / 50 + i) * 4} y={pt.y + (tg.x / m) * 26 * u} s={(0.34 + 0.05 * (i % 3)) * u} a={0.92} seed={i * 3 + 2}/>;
  })}</g>;
};

const front = (c: Ctx, L: Layer): Out => {
  const S = frontState(c, L), id = `wmx-fr-${S.north ? "n" : "s"}`;
  if (S.a0 <= 0.004) return {};
  const lp = FLON.map((lo, i) => c.P(lo, S.arr[i])), d = smooth(lp);
  const far = c.P(102, S.north ? -10 : 60), far2 = c.P(60, S.north ? -10 : 60);
  const wash = `${d} L${far.x.toFixed(1)},${far.y.toFixed(1)} L${far2.x.toFixed(1)},${far2.y.toFixed(1)} Z`;
  const all = S.north && S.cur === S.n - 1 ? eof(c.f, S.ts[S.n - 1], 30) : 0;
  const pulse = 0.55 + 0.45 * Math.sin(c.f / 8);
  return {
    over: <g clipPath={`url(#${id})`} opacity={S.a0}>
      <defs><clipPath id={id}><path d={c.B.india}/></clipPath>
        <linearGradient id={id + "-w"} x1="0" y1="0" x2="0" y2="1">
          {S.north ? <><stop offset="0" stopColor="#8fd2f0" stopOpacity="0.66"/><stop offset="1" stopColor="#3d96cc" stopOpacity="0.52"/></>
                   : <><stop offset="0" stopColor="#fbf4de" stopOpacity="0.86"/><stop offset="1" stopColor="#f3e6c2" stopOpacity="0.82"/></>}
        </linearGradient></defs>
      <path d={wash} fill={`url(#${id}-w)`}/>
      <path d={d} stroke={S.north ? "#ffffff" : "#fff6e0"} strokeWidth="46" fill="none" opacity="0.3" filter="url(#wm-b12)"/>
      {S.north && <FrontPuffs d={d} f={c.f} u={U(c)}/>}
      <path d={d} stroke="#0b2a4a" strokeWidth="9" fill="none" opacity="0.28" transform="translate(0 4)"/>
      <path d={d} stroke="#ffffff" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/>
      <path d={d} stroke={S.north ? "#1b5aa8" : "#a8461a"} strokeWidth="4.6" fill="none" strokeLinecap="butt" strokeDasharray="15 10" strokeDashoffset={-c.f * 0.35}/>
      {all > 0.01 && <g opacity={all}>
        <path d={c.B.india} fill="none" stroke="#bff0ff" strokeWidth="14" strokeLinejoin="round" opacity={0.5 * pulse} filter="url(#wm-b5)"/>
        <path d={c.B.india} fill="none" stroke="#fff" strokeWidth="3.4" strokeLinejoin="round" opacity={0.9}/>
      </g>}
    </g>,
    hud: (cam) => {
      const out: React.ReactNode[] = [];
      S.steps.forEach((st, i) => {
        if (!st.lab) return;
        const t = S.ts[i], next = S.ts[i + 1], a = eof(c.f, t + 4, 14), fade = next === undefined ? 1 : 1 - eo(prog(c.f, next - 2, 10));
        const lon = S.north ? 82 : lerp(72, 87, i / Math.max(1, S.n - 1)), lat = clamp(latAt(S.shapes[i], lon), S.north ? 9 : 10, 30);
        const w = box(lab(st.lab));
        const q = cam(c.P(lon, lat)), x = clamp(q.x, SX0 + w.w / 2, SX1 - w.w / 2), y = clamp(q.y, TOP + w.h / 2 + 4, BOT - w.h / 2);
        out.push(<Tag key={"fs" + i} x={x} y={y} text={lab(st.lab)} a={a} fade={fade} size={w.size}/>);
      });
      return <>{out}</>;
    },
  };
};

/** tag size and box, same rule as the label tags */
const box = (text: string) => { let size = 29; while (size > 22 && estW(text, size) + 70 > 1100) size -= 1; return {size, w: estW(text, size) + 70, h: size + 30}; };

// ---------------------------------------------------------------------------------------------------------------- wet to dry
type Blob = {lon: number; lat: number; rx: number; ry: number; rot?: number; g: "deep" | "mid" | "light" | "tan" | "sand"};
const BLOBS: Blob[] = [
  // light green: the wide plains and the foothills
  {lon: 83, lat: 26.2, rx: 6.5, ry: 2.4, g: "light"}, {lon: 79.5, lat: 29.8, rx: 5, ry: 2, g: "light"}, {lon: 82.5, lat: 21.2, rx: 4.8, ry: 3.2, g: "light"},
  {lon: 77.5, lat: 24.6, rx: 3.4, ry: 2, g: "light"}, {lon: 79.5, lat: 17.8, rx: 3, ry: 2.2, g: "light"}, {lon: 80.2, lat: 8.8, rx: 1.4, ry: 1.2, g: "light"},
  // mid green: Bengal, Odisha, the Ghats' flanks
  {lon: 87.2, lat: 22.6, rx: 3.6, ry: 2.6, g: "mid"}, {lon: 85.5, lat: 20, rx: 2.6, ry: 2, g: "mid"}, {lon: 74.2, lat: 20.8, rx: 1.8, ry: 2.6, g: "mid"},
  {lon: 74.8, lat: 14.6, rx: 1.8, ry: 3.2, g: "mid"}, {lon: 76.6, lat: 10.6, rx: 1.6, ry: 2.4, g: "mid"}, {lon: 94.5, lat: 27.2, rx: 3, ry: 2.2, g: "mid"},
  // deep green: Konkan and the Ghats, Kerala, the north-east
  {lon: 73.4, lat: 19.6, rx: 1.15, ry: 2.1, g: "deep"}, {lon: 73.75, lat: 16.6, rx: 1.1, ry: 2.2, g: "deep"}, {lon: 74.5, lat: 13.6, rx: 1.1, ry: 2.2, g: "deep"},
  {lon: 75.4, lat: 10.9, rx: 1.15, ry: 2.2, g: "deep"}, {lon: 76.8, lat: 8.7, rx: 1, ry: 1.3, g: "deep"}, {lon: 92.4, lat: 25.8, rx: 3.2, ry: 1.7, g: "deep"},
  {lon: 95.2, lat: 27.9, rx: 2.4, ry: 1.7, g: "deep"}, {lon: 91.3, lat: 25.3, rx: 1.4, ry: 1.0, g: "deep"},
  // the rain shadow in the lee, and the dry interior
  {lon: 76.8, lat: 16, rx: 1.9, ry: 3.4, g: "tan"}, {lon: 78.4, lat: 11.2, rx: 1.5, ry: 2, g: "tan"},
  {lon: 71, lat: 26.6, rx: 3.4, ry: 3.1, g: "sand"}, {lon: 70.2, lat: 23.3, rx: 2.6, ry: 1.8, g: "sand"},
];
const GRAD: Record<Blob["g"], [string, number, string, number]> = {
  deep: ["#0e6a34", 0.96, "#1f7e3c", 0], mid: ["#3f9a47", 0.88, "#5aa845", 0], light: ["#9cc65a", 0.8, "#b7cf6a", 0], tan: ["#ead2a0", 0.85, "#ead2a0", 0], sand: ["#f6e6bc", 0.95, "#f3dca8", 0],
};
const wetdry = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), p = eof(c.f, t, 44), k = c.B.k;
  if (p <= 0.004) return {};
  const ik = k / 24.545;
  return {
    over: <g clipPath="url(#wmx-wd-clip)" opacity={p}>
      <defs>
        <clipPath id="wmx-wd-clip"><path d={c.B.india}/></clipPath>
        {(Object.keys(GRAD) as Blob["g"][]).map((g) => <radialGradient key={g} id={`wmx-wd-${g}`}><stop offset="0" stopColor={GRAD[g][0]} stopOpacity={GRAD[g][1]}/><stop offset="0.55" stopColor={GRAD[g][0]} stopOpacity={GRAD[g][1] * 0.7}/><stop offset="1" stopColor={GRAD[g][2]} stopOpacity={GRAD[g][3]}/></radialGradient>)}
      </defs>
      <rect x="0" y="0" width="1920" height="1080" fill="#efd9a4" opacity="0.9"/>
      {BLOBS.map((b, i) => { const q = c.P(b.lon, b.lat); return <ellipse key={i} cx={q.x} cy={q.y} rx={b.rx * k * (0.96 + 0.04 * Math.sin(c.f / 40 + i))} ry={b.ry * k} transform={b.rot ? `rotate(${b.rot} ${q.x} ${q.y})` : undefined} fill={`url(#wmx-wd-${b.g})`}/>; })}
      <path d={c.B.india} fill="none" stroke="#fff6dc" strokeWidth={5 * ik + 1} opacity="0.35" strokeLinejoin="round"/>
    </g>,
    hud: () => {
      const a = eof(c.f, t + 14, 16);
      return <>
        {!c.spec.chip && <Pill x={96} y={80} text="ILLUSTRATION" a={a}/>}
        <div style={{position: "absolute", left: 96, top: 780, width: 292, opacity: a, fontFamily: SANS, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: "#fff", textShadow: "0 1px 6px rgba(8,30,60,.85)"}}>
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: 8}}><span>WETTER</span><span>DRIER</span></div>
          <div style={{height: 16, borderRadius: 8, border: "1.5px solid rgba(255,246,228,.9)", boxShadow: "0 4px 12px rgba(8,30,60,.5)", background: "linear-gradient(90deg,#0e6a34,#3f9a47 30%,#9cc65a 55%,#ead2a0 80%,#f6e6bc)"}}/>
        </div>
      </>;
    },
  };
};

// ---------------------------------------------------------------------------------------------------------------- the depression
const depression = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), u0 = clamp((c.f - t) / Math.max(60, c.dur - t - 10)), a0 = eof(c.f, t, 24) * (1 - eo(prog(c.f, c.dur - 22, 20)));
  if (a0 <= 0.004) return {};
  const u = U(c), A = c.P(89.4, 21.2), B = c.P(78.6, 22.6), cx = lerp(A.x, B.x, u0), cy = lerp(A.y, B.y, u0) + Math.sin(u0 * Math.PI) * -12, R = 175 * u;
  const rot = -c.f * 0.03;
  // three spiral arms, thick and pale like a satellite swirl; a few puffs mark the arms, the eye stays clear
  const arms = [0, 1, 2].map((k) => {
    const a = (k * 2 * Math.PI) / 3 + rot;
    return Array.from({length: 22}).map((_, i) => { const q = i / 21, r = R * (0.14 + 0.88 * q), th = a - q * 3.2; return {x: cx + Math.cos(th) * r, y: cy + Math.sin(th) * r * 0.84}; });
  });
  return {over: <g opacity={a0}>
    <ellipse cx={cx + 14} cy={cy + 24} rx={R * 1.1} ry={R * 0.92} fill="#0e2a4a" opacity="0.18" filter="url(#wm-b12)"/>
    <defs><radialGradient id="wmx-dp"><stop offset="0" stopColor="#ffffff" stopOpacity="0.8"/><stop offset="0.55" stopColor="#e9f3fb" stopOpacity="0.5"/><stop offset="1" stopColor="#e9f3fb" stopOpacity="0"/></radialGradient></defs>
    <ellipse cx={cx} cy={cy} rx={R * 1.25} ry={R * 1.05} fill="url(#wmx-dp)"/>
    {arms.map((ar, k) => <g key={k}>
      <path d={smooth(ar)} stroke="#cfe0ef" strokeWidth={54 * u} strokeLinecap="round" fill="none" opacity="0.55" filter="url(#wm-b12)" transform={`translate(${6 * u} ${12 * u})`}/>
      <path d={smooth(ar)} stroke="#ffffff" strokeWidth={46 * u} strokeLinecap="round" fill="none" opacity="0.8" filter="url(#wm-b5)"/>
      <path d={smooth(ar)} stroke="#ffffff" strokeWidth={13 * u} strokeLinecap="round" fill="none" strokeDasharray={`${46 * u} ${20 * u}`} strokeDashoffset={-c.f * 0.7} opacity="0.95"/>
      {[7, 12, 17].map((i, j) => <Cloud key={j} id="wmc" x={ar[i].x} y={ar[i].y} s={(0.34 + 0.05 * j) * u} a={0.95} seed={k * 7 + j + 2}/>)}
    </g>)}
    <circle cx={cx} cy={cy} r={R * 0.13} fill="#7fa8cc" opacity="0.8"/>
    <circle cx={cx} cy={cy} r={R * 0.13} fill="none" stroke="#fff" strokeWidth={3 * u} opacity="0.9"/>
    <Rain x={cx - R * 0.8} y={cy - R * 0.1} w={R * 1.6} h={R * 1.0} f={c.f} n={44} op={0.85} seed={6}/>
  </g>};
};

// ---------------------------------------------------------------------------------------------------------------- the easterlies
const EAST: LL[][] = [
  [[97, 13.4], [90, 13.5], [85, 13.4], [81.3, 13.2]],
  [[97, 11.6], [90, 11.8], [85, 11.7], [81.5, 11.6]],
  [[97, 10], [90, 10.2], [85.5, 10.2], [81.8, 10.1]],
];
const easterlies = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), u = U(c), q = c.P(79.4, 11.9), w = 0.9 * u;
  const ca = eof(c.f, t + 44, 24);
  return {over: <g>
    {EAST.map((r, i) => <Flow key={i} id={`wmea${i}`} d={smooth(pts(c, r))} p={eio(prog(c.f, t + i * 11, 54))} f={c.f} c1="#2f86da" c2="#1b4f9c" w={12} speed={2.8} ph={i * 0.21}/>)}
    {ca > 0.01 && <g opacity={ca}>
      {[[-20, -34, 0.5], [18, -4, 0.56], [-26, 36, 0.5], [30, 40, 0.46]].map(([dx, dy, s], i) => <Cloud key={i} id="wmc" x={q.x + dx * w + Math.sin(c.f / 50 + i) * 5} y={q.y + dy * w} s={s * u} a={0.97} seed={i + 41}/>)}
      <Rain x={q.x - 60 * u} y={q.y - 10 * u} w={120 * u} h={90 * u} f={c.f} n={40} seed={12} op={ca}/>
    </g>}
  </g>};
};

// ---------------------------------------------------------------------------------------------------------------- pins (atlas pin, serif card, thin leader)
const splitTitle = (t: string): [string, string] => { const i = t.indexOf(" · "); return i > 0 ? [t.slice(0, i), t.slice(i + 3)] : [t, ""]; };
const cardBox = (text: string) => {
  const [a, b] = splitTitle(text), big = a.length <= 2 ? 64 : a.length > 30 ? 26 : 32;
  return {a, b, big, w: Math.max(estW(a, big * (a === a.toUpperCase() ? 1.02 : 0.82)), b ? estW(b, 19) : 0) + 52, h: (b ? 88 : 64) + (big > 40 ? 24 : 0)};
};

export type PinItem = {text: string; at: string; key: string; hl?: boolean};
export const renderPins = (c: Ctx, cam: (p: Pt) => Pt, items: PinItem[]): React.ReactNode => {
  const leaders: React.ReactNode[] = [], marks: React.ReactNode[] = [], cards: React.ReactNode[] = [];
  items.forEach((it, i) => {
    const cfg = PIN[it.at], base = cfg?.at ?? ANCHORS[c.focus][it.at];
    if (!base) throw new Error(`windmap: unknown pin anchor "${it.at}"`);
    const cf = it.text.length <= 2 ? {side: "r" as const, dx: 56, dy: -34} : (cfg ?? {side: "r" as const, dx: 70, dy: 20});
    const t = c.at(it.key), a = eo(prog(c.f, t, 12)), ca = eo(prog(c.f, t + 7, 14));
    if (a <= 0.01) return;
    const p = cam(c.P(base[0], base[1])), bx = cardBox(it.text);
    let cx = cf.side === "r" ? p.x + cf.dx + bx.w / 2 : p.x + cf.dx - bx.w / 2, cy = p.y + cf.dy;
    cx = clamp(cx, SX0 + bx.w / 2, SX1 - bx.w / 2); cy = clamp(cy, TOP + bx.h / 2, BOT - bx.h / 2);
    if (cy - bx.h / 2 < 126 && cx + bx.w / 2 > 1540) cx = 1540 - bx.w / 2;
    const ex = cx > p.x ? cx - bx.w / 2 : cx + bx.w / 2, hy = p.y - 30;
    const pulse = (k: number) => ((c.f * 0.022 + k) % 1);
    marks.push(<g key={"m" + i} transform={`translate(${p.x.toFixed(1)} ${(p.y - (1 - a) * 46).toFixed(1)}) scale(${0.55 + 0.45 * a})`} opacity={a}>
      {it.hl && <g transform={`translate(0 ${(1 - a) * 46})`}>
        <circle r="74" fill="url(#wmx-hl)"/>
        {[0, 0.5].map((k) => <ellipse key={k} rx={20 + 70 * pulse(k)} ry={8 + 28 * pulse(k)} fill="none" stroke="#ffd36a" strokeWidth="3" opacity={0.9 * (1 - pulse(k))}/>)}
      </g>}
      <ellipse cx="2" cy="1" rx="13" ry="4.5" fill="#0b2a4a" opacity="0.4"/>
      <path d="M0,0 C-5,-11 -17,-17 -17,-30 a17,17 0 1 1 34,0 C17,-17 5,-11 0,0Z" fill="#c2431f" stroke="#fff3d6" strokeWidth="2.6" strokeLinejoin="round"/>
      <path d="M-9,-38 a11,11 0 0 1 12,-6" stroke="#ff9a72" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
      <circle cy="-30" r="6.4" fill="#fff3d6"/>
    </g>);
    leaders.push(<g key={"l" + i} opacity={ca}>
      <path d={`M${p.x.toFixed(1)},${hy.toFixed(1)} L${lerp(p.x, ex, ca).toFixed(1)},${lerp(hy, cy, ca).toFixed(1)}`} stroke="#fff6d8" strokeWidth="4.2" opacity="0.7" strokeLinecap="round"/>
      <path d={`M${p.x.toFixed(1)},${hy.toFixed(1)} L${lerp(p.x, ex, ca).toFixed(1)},${lerp(hy, cy, ca).toFixed(1)}`} stroke="#6b3d12" strokeWidth="1.7" strokeLinecap="round"/>
    </g>);
    cards.push(<div key={"c" + i} style={{position: "absolute", left: cx - bx.w / 2 + (1 - ca) * (cx > p.x ? 18 : -18), top: cy - bx.h / 2, width: bx.w, height: bx.h, opacity: ca, boxSizing: "border-box",
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: bx.big > 40 ? "center" : "flex-start", padding: "0 22px 0 26px", whiteSpace: "nowrap",
      borderRadius: 16, background: "linear-gradient(160deg, rgba(255,252,243,.97), rgba(255,243,219,.9))", border: "1.5px solid rgba(190,110,50,.55)",
      boxShadow: "0 24px 40px -18px rgba(20,36,60,.7), 0 4px 10px -4px rgba(20,36,60,.4), inset 0 1.5px 0 rgba(255,255,255,.9)"}}>
      <span style={{position: "absolute", left: 0, top: 14, bottom: 14, width: 5, borderRadius: 3, background: "#d8682a"}}/>
      <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: bx.big, lineHeight: 1.12, color: "#5b2c12", letterSpacing: "-0.005em"}}>{bx.a}</div>
      {bx.b && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 19, letterSpacing: "0.06em", color: "#a2501f", marginTop: 5}}>{bx.b}</div>}
    </div>);
  });
  if (!marks.length) return null;
  return <>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", inset: 0}}>
      <defs><radialGradient id="wmx-hl"><stop offset="0" stopColor="#ffe08a" stopOpacity="0.95"/><stop offset="0.45" stopColor="#ffb84a" stopOpacity="0.5"/><stop offset="1" stopColor="#ff9a3a" stopOpacity="0"/></radialGradient></defs>
      {leaders}{marks}
    </svg>
    {cards}
  </>;
};
/** map furniture (place names) that a pin card would cover: hidden while the card is up */
export const pinCovers = (c: Ctx, cam: (p: Pt) => Pt, items: PinItem[], lon: number, lat: number, size: number, text: string): boolean => {
  const q = cam(c.P(lon, lat)), hw = estW(text, size) * 0.5 + 20;
  return items.some((it) => {
    const cfg = PIN[it.at], base = cfg?.at ?? ANCHORS[c.focus][it.at];
    if (!base || c.f < c.at(it.key)) return false;
    const cf = it.text.length <= 2 ? {side: "r" as const, dx: 56, dy: -34} : (cfg ?? {side: "r" as const, dx: 70, dy: 20}), p = cam(c.P(base[0], base[1])), bx = cardBox(it.text);
    const cx = clamp(cf.side === "r" ? p.x + cf.dx + bx.w / 2 : p.x + cf.dx - bx.w / 2, SX0 + bx.w / 2, SX1 - bx.w / 2), cy = clamp(p.y + cf.dy, TOP + bx.h / 2, BOT - bx.h / 2);
    return Math.abs(q.x - cx) < bx.w / 2 + hw && Math.abs(q.y - cy) < bx.h / 2 + size;
  });
};

export const P2_LAYERS: Record<string, (c: Ctx, L: Layer) => Out> = {
  pins: () => ({}),
  "stream-bay": stream(STREAM_BAY, "b"), "stream-arabian": stream(STREAM_ARAB, "a"),
  "branch-arabian": branch(ARM_ARAB, "a", 5), "branch-bay": branch(ARM_BAY, "b", 8),
  front, wetdry, depression, easterlies,
};

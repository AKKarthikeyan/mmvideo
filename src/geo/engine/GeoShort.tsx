// GeoTales Short engine (20 Oct 2026). One spec per video (src/geo/week1/specs.ts) + voiced data.json.
// Satellite globe fly-in (NASA Blue Marble, inverse orthographic) hands off at GLOBE_END to a flat local-equirectangular map
// (same scale + filter, so the switch is invisible), then a camera keyframed per beat, with timed overlay layers.
import React, {useEffect, useMemo, useRef, useState} from "react";
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, Easing} from "remotion";

export const FPS = 30, W = 1080, H = 1920;
const GAP = 0.12, END_HOLD = 1.2, GLOBE_END = 1.6;
const FONT = "Oswald, Impact, 'Arial Narrow', sans-serif";
export const C = {amber: "#FFB020", red: "#FF3B30", green: "#2ECC71", cyan: "#3DD9FF", orange: "#FF9500", white: "#FFFFFF", violet: "#B388FF", pink: "#FF5FA2"};
const MAPFILTER = "saturate(1.15) contrast(1.05)";
const ease = Easing.bezier(0.45, 0, 0.2, 1);

export type Cam = {lon: number; lat: number; span: number};
type P = [number, number];
type When = {in: string; dt?: number; out?: string; outAt?: number};   // dt = seconds after the beat starts
export type Layer = When & (
  | {kind: "fill"; iso?: string[]; state?: string[]; poly?: P[]; color: string; alpha?: number; dashed?: boolean}
  | {kind: "label"; at: P; text: string; sub?: string; color?: string; size?: number; dy?: number}
  | {kind: "pin"; at: P; text?: string; color?: string; size?: number; dy?: number}
  | {kind: "line"; pts: P[]; color?: string; width?: number; dash?: boolean; draw?: number; arrow?: boolean; flow?: boolean}
  | {kind: "ruler"; a: P; b: P; text: string; color?: string; size?: number; dy?: number}
  | {kind: "river"; names: string[]; color?: string; width?: number; clip?: [number, number, number, number]; draw?: number}
  | {kind: "particles"; pts: P[]; count?: number; color?: string; size?: number; speed?: number}
  | {kind: "night"; lonFrom: number; lonTo: number}
  | {kind: "bigtext"; text: string; sub?: string; color?: string; y?: number; size?: number; stamp?: boolean}
  | {kind: "counter"; from: number; to: number; dur?: number; prefix?: string; suffix?: string; label?: string; y?: number; color?: string; size?: number}
  | {kind: "clock"; time: string | [string, string]; label?: string; x?: number; y?: number; r?: number; color?: string}
  | {kind: "bars"; items: {label: string; value: number; color: string}[]; unit: string; y?: number}
  | {kind: "panel"; name: string; props?: any}
);
export type Spec = {id: string; globe: {lon: number; lat: number}; handoff: Cam; hi?: boolean; cams: {in: string; dt?: number; dur?: number; cam: Cam}[];
  layers: Layer[]; question: string; credit?: string};
type Beat = {key: string; say: string; cap: string; sec: number; audio: string};
export type GeoData = {id: string; beats: Beat[]};

export const layout = (D: GeoData) => {
  let t = 0;
  const beats = D.beats.map((b) => { const s = t; t += b.sec + GAP; return {...b, start: s, end: s + b.sec}; });
  return {beats, total: Math.ceil((t + END_HOLD) * FPS), end: t + END_HOLD};
};
type LB = ReturnType<typeof layout>["beats"];

// ---------- camera + projection ----------
const camAt = (t: number, S: Spec, B: LB): Cam => {
  const bs = (k: string) => B.find((b) => b.key === k)!;
  const keys = [{t0: GLOBE_END, dur: 0, cam: S.handoff}, ...S.cams.map((c) => ({t0: Math.max(GLOBE_END + 0.05, bs(c.in).start + (c.dt ?? 0)), dur: c.dur ?? 1.0, cam: c.cam}))]   // moves start after the globe hand-off
    .sort((a, b) => a.t0 - b.t0);
  let cur = keys[0].cam;
  for (const k of keys.slice(1)) {
    if (t <= k.t0) break;
    const u = ease(Math.min(1, (t - k.t0) / Math.max(0.01, k.dur)));
    cur = {lon: cur.lon + (k.cam.lon - cur.lon) * u, lat: cur.lat + (k.cam.lat - cur.lat) * u,
      span: Math.exp(Math.log(cur.span) + (Math.log(k.cam.span) - Math.log(cur.span)) * u)};
  }
  return cur;
};
const mk = (c: Cam, cos0: number) => {
  const s = W / (c.span * cos0);
  return {s, xy: (lon: number, lat: number): P => [W / 2 + (lon - c.lon) * cos0 * s, H / 2 - (lat - c.lat) * s]};
};
const win = (t: number, a: number, b: number, fade = 0.3) => Math.max(0, Math.min(1, (t - a) / fade, (b - t) / fade));

// ---------- assets ----------
type Tex = {w: number; h: number; px: Uint8ClampedArray};
type Geo = {asia: number[]; hi: Record<string, number[]>; countries: Record<string, number[][][]>; states: Record<string, number[][][]>; rivers: Record<string, number[][][]>};
async function loadTex(src: string): Promise<Tex> {
  const img = new Image(); img.src = src; await img.decode();
  const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
  const g = cv.getContext("2d")!; g.drawImage(img, 0, 0);
  return {w: img.width, h: img.height, px: g.getImageData(0, 0, img.width, img.height).data};
}
type Assets = {geo: Geo; world: Tex; asia: Tex};
let CACHE: Promise<Assets> | null = null;
function useAssets() {
  const [A, setA] = useState<Assets | null>(null);
  const [h] = useState(() => delayRender("geo assets", {timeoutInMilliseconds: 120000}));
  useEffect(() => {
    CACHE = CACHE ?? Promise.all([fetch(staticFile("geo/_shared/geo.json")).then((r) => r.json()),
      loadTex(staticFile("geo/_shared/world.jpg")), loadTex(staticFile("geo/_shared/asia.jpg"))]).then(([geo, world, asia]) => ({geo, world, asia}));
    CACHE.then((a) => { setA(a); continueRender(h); });
  }, [h]);
  return A;
}

// ---------- globe ----------
const Globe: React.FC<{A: Assets; S: Spec; t: number}> = ({A, S, t}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const u = ease(Math.min(1, t / GLOBE_END));
  const lon0 = S.globe.lon + (S.handoff.lon - S.globe.lon) * u, lat0 = S.globe.lat + (S.handoff.lat - S.globe.lat) * u;
  const cos0 = Math.cos(S.handoff.lat * Math.PI / 180);
  const Rend = (W / (S.handoff.span * cos0)) * 180 / Math.PI;
  const R = Math.exp(Math.log(470) + (Math.log(Rend) - Math.log(470)) * u);
  useEffect(() => {
    const g = ref.current!.getContext("2d")!; const img = g.createImageData(W, H); const o = img.data;
    const {world, asia, geo} = A; const [L0, L1, B0, B1] = geo.asia;
    const l0 = lon0 * Math.PI / 180, p0 = lat0 * Math.PI / 180, sp0 = Math.sin(p0), cp0 = Math.cos(p0), cx = W / 2, cy = H / 2;
    for (let y = 0; y < H; y++) {
      const py = (cy - y) / R;
      for (let x = 0; x < W; x++) {
        const px = (x - cx) / R, rr = px * px + py * py, i = (y * W + x) * 4;
        if (rr > 1) { const d = Math.sqrt(rr) - 1, gl = d < 0.06 ? (1 - d / 0.06) * 0.55 : 0; o[i] = 4 + 60 * gl; o[i + 1] = 8 + 120 * gl; o[i + 2] = 20 + 255 * gl; o[i + 3] = 255; continue; }
        const rho = Math.sqrt(rr), c = Math.asin(rho), sc = Math.sin(c), cc = Math.cos(c);
        const la = (rho === 0 ? p0 : Math.asin(cc * sp0 + (py * sc * cp0) / rho)) * 180 / Math.PI;
        let lo = (l0 + Math.atan2(px * sc, rho * cc * cp0 - py * sc * sp0)) * 180 / Math.PI; lo = ((lo + 540) % 360) - 180;
        let T: Tex, j: number;
        if (lo > L0 && lo < L1 && la > B0 && la < B1) { T = asia; j = (Math.floor((B1 - la) / (B1 - B0) * T.h) * T.w + Math.floor((lo - L0) / (L1 - L0) * T.w)) * 4; }
        else { T = world; j = (Math.min(T.h - 1, Math.floor((90 - la) / 180 * T.h)) * T.w + Math.min(T.w - 1, Math.floor((lo + 180) / 360 * T.w))) * 4; }
        const sh = 1 - 0.45 * (1 - cc) * (1 - u);
        o[i] = T.px[j] * sh; o[i + 1] = T.px[j + 1] * sh; o[i + 2] = T.px[j + 2] * sh; o[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    if (R > 1200) {
      g.lineJoin = "round";
      for (const [iso, rings] of Object.entries(geo.countries)) {
        g.strokeStyle = iso === "IND" ? "#fff" : "rgba(255,255,255,0.55)"; g.lineWidth = iso === "IND" ? 4.5 : 2;
        for (const ring of rings) {
          g.beginPath(); let ok = true;
          ring.forEach(([lo, la], k) => {
            const l = lo * Math.PI / 180 - l0, p = la * Math.PI / 180;
            if (sp0 * Math.sin(p) + cp0 * Math.cos(p) * Math.cos(l) < 0) ok = false;
            const X = cx + R * Math.cos(p) * Math.sin(l), Y = cy - R * (cp0 * Math.sin(p) - sp0 * Math.cos(p) * Math.cos(l));
            k ? g.lineTo(X, Y) : g.moveTo(X, Y);
          });
          if (ok) { g.closePath(); g.stroke(); }
        }
      }
    }
  }, [A, lon0, lat0, R, u]);
  return <canvas ref={ref} width={W} height={H} style={{position: "absolute", inset: 0, filter: MAPFILTER}}/>;
};
const Vignette: React.FC = () => <AbsoluteFill style={{background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)"}}/>;

// ---------- small pieces ----------
const shadow = "0 0 3px #000, 0 4px 14px rgba(0,0,0,0.9), 0 0 2px #000";
const Txt: React.FC<{x: number; y: number; o: number; text: string; sub?: string; color?: string; size?: number}> = ({x, y, o, text, sub, color = "#fff", size = 60}) =>
  o <= 0 ? null : (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * o})`, opacity: o, fontFamily: FONT, fontWeight: 700,
      fontSize: size, color, textAlign: "center", whiteSpace: "nowrap", lineHeight: 1.05, textShadow: shadow}}>
      {text}{sub && <div style={{fontSize: size * 0.48, color: "#fff", opacity: 0.92}}>{sub}</div>}
    </div>
  );
const ringsPath = (rings: number[][][], cos0: number) => rings.map((r) => "M" + r.map(([lo, la]) => `${(lo * cos0).toFixed(3)},${(-la).toFixed(3)}`).join("L") + "Z").join("");
const linePath = (pts: number[][], cos0: number) => "M" + pts.map(([lo, la]) => `${(lo * cos0).toFixed(4)},${(-la).toFixed(4)}`).join("L");
const polyLen = (pts: P[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const along = (pts: P[], u: number): P => {
  const L = polyLen(pts) * u; let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc + d >= L) { const k = (L - acc) / d; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]; }
    acc += d;
  }
  return pts[pts.length - 1];
};
const Clock: React.FC<{x: number; y: number; r: number; hhmm: number; label?: string; o: number; color?: string}> = ({x, y, r, hhmm, label, o, color = "#fff"}) => {
  const h = Math.floor(hhmm / 60) % 12, m = hhmm % 60;
  const am = ((m / 60) * 360 - 90) * Math.PI / 180, ah = (((h + m / 60) / 12) * 360 - 90) * Math.PI / 180;
  return <div style={{position: "absolute", left: x - r, top: y - r, opacity: o}}>
    <svg width={r * 2} height={r * 2 + 90} style={{overflow: "visible"}}>
      <circle cx={r} cy={r} r={r - 4} fill="rgba(10,14,24,0.82)" stroke={color} strokeWidth={8}/>
      {Array.from({length: 12}).map((_, i) => { const a = i * Math.PI / 6; return <line key={i} x1={r + Math.cos(a) * (r - 18)} y1={r + Math.sin(a) * (r - 18)} x2={r + Math.cos(a) * (r - 34)} y2={r + Math.sin(a) * (r - 34)} stroke="#fff" strokeWidth={6}/>; })}
      <line x1={r} y1={r} x2={r + Math.cos(ah) * r * 0.5} y2={r + Math.sin(ah) * r * 0.5} stroke="#fff" strokeWidth={12} strokeLinecap="round"/>
      <line x1={r} y1={r} x2={r + Math.cos(am) * r * 0.78} y2={r + Math.sin(am) * r * 0.78} stroke={color} strokeWidth={8} strokeLinecap="round"/>
      <circle cx={r} cy={r} r={10} fill={color}/>
    </svg>
    <div style={{position: "absolute", top: r * 2 + 6, left: -150, width: r * 2 + 300, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 46, color: "#fff", textShadow: shadow}}>
      {String(Math.floor(hhmm / 60) % 24).padStart(2, "0")}:{String(m).padStart(2, "0")}{label ? <div style={{fontSize: 38, color}}>{label}</div> : null}
    </div>
  </div>;
};
const hm = (s: string) => { const [a, b] = s.split(":").map(Number); return a * 60 + b; };

// ---------- panels (story-specific diagrams, all drawn in code) ----------
const Card: React.FC<{o: number; children: React.ReactNode; top?: number; h?: number}> = ({o, children, top = 230, h = 900}) =>
  <div style={{position: "absolute", left: 60, right: 60, top, height: h, opacity: o, background: "rgba(8,12,22,0.86)", borderRadius: 36, border: "3px solid rgba(255,255,255,0.18)", overflow: "hidden"}}>{children}</div>;
const Panels: Record<string, React.FC<{o: number; u: number; f: number; props?: any}>> = {
  // Chenab: side view of the arch, deck and the 359 m drop
  chenabArch: ({o, u}) => {
    const w = 960, h = 900, k = interpolate(u, [0, 0.6], [0, 1], {extrapolateRight: "clamp"});
    const arch = `M 90 760 Q 480 ${760 - 720 * k} 870 760`;
    return <Card o={o}><svg width={w} height={h}>
      <path d="M 0 760 L 90 760 L 90 900 L 0 900 Z M 870 760 L 960 760 L 960 900 L 870 900 Z" fill="#6b5a45"/>
      <path d="M 0 180 L 120 180 L 90 760 L 0 760 Z M 960 180 L 840 180 L 870 760 L 960 760 Z" fill="#7d6a52"/>
      <path d="M 300 880 Q 480 840 660 880" stroke={C.cyan} strokeWidth={10} fill="none"/>
      <path d={arch} stroke="#d9d9d9" strokeWidth={22} fill="none" strokeLinecap="round"/>
      <rect x={0} y={170} width={960 * k} height={16} fill="#fff"/>
            <line x1={930} y1={186} x2={930} y2={186 + 690 * u} stroke={C.amber} strokeWidth={8} strokeDasharray="20 12"/>
      <text x={900} y={520} fill={C.amber} fontFamily={FONT} fontWeight={700} fontSize={64} textAnchor="end" opacity={u > 0.4 ? 1 : 0}>359 m</text>
      <text x={480} y={680} fill="#fff" fontFamily={FONT} fontWeight={700} fontSize={56} textAnchor="middle" opacity={k > 0.9 ? 1 : 0}>arch 467 m</text>
      <text x={480} y={140} fill="#fff" fontFamily={FONT} fontWeight={700} fontSize={44} textAnchor="middle">diagram, not to scale</text>
    </svg></Card>;
  },
  // Himalaya: India drifting north, sea floor crumpling into mountains
  plates: ({o, u, props}) => {
    const stage = props?.stage ?? 0;   // 0 = drift, 1 = crumple
    const gap = stage === 0 ? interpolate(u, [0, 1], [380, 120]) : 120 - 110 * u;
    const peak = stage === 0 ? 0 : 330 * u;
    return <Card o={o}><svg width={960} height={900}>
      <rect x={0} y={560} width={960} height={340} fill="#1d3b66"/>
      <rect x={0} y={420} width={300} height={160} fill="#8a7a5c"/>
      <text x={150} y={510} fill="#fff" fontFamily={FONT} fontWeight={700} fontSize={54} textAnchor="middle">ASIA</text>
      <path d={`M ${300} 560 Q ${300 + gap / 2} ${560 - peak} ${300 + gap} 560 Z`} fill="#c9b48a"/>
      <rect x={300 + gap} y={440} width={660 - gap} height={140} fill="#b38f5a"/>
      <text x={300 + gap + (660 - gap) / 2} y={525} fill="#fff" fontFamily={FONT} fontWeight={700} fontSize={54} textAnchor="middle">INDIA ←</text>
      {stage === 1 && <text x={300 + gap / 2} y={560 - peak - 30} fill={C.amber} fontFamily={FONT} fontWeight={700} fontSize={50} textAnchor="middle" opacity={u > 0.5 ? 1 : 0}>HIMALAYAS</text>}
      <text x={480} y={110} fill="#fff" fontFamily={FONT} fontWeight={700} fontSize={50} textAnchor="middle">{stage === 0 ? "~50 million years ago" : "sea floor pushed up"}</text>
      <text x={480} y={860} fill="#ccc" fontFamily={FONT} fontWeight={700} fontSize={36} textAnchor="middle">simplified diagram</text>
    </svg></Card>;
  },
  // Enclaves: nested rings
  rings: ({o, u}) => {
    const L = [["BANGLADESH", C.green], ["INDIA", C.orange], ["BANGLADESH", C.green], ["INDIA (Dahala Khagrabari)", C.orange]] as const;
    return <Card o={o} top={260} h={860}><svg width={960} height={860}>
      {L.map(([n, col], i) => { const r = 380 - i * 92, show = u * 4 > i; return show ? <g key={i}>
        <circle cx={480} cy={430} r={r} fill={col} fillOpacity={0.22 + i * 0.12} stroke={col} strokeWidth={6}/>
        <text x={480} y={430 - r + 58} fill="#fff" fontFamily={FONT} fontWeight={700} fontSize={i === 3 ? 34 : 46} textAnchor="middle">{n}</text></g> : null; })}
      <text x={480} y={840} fill="#ccc" fontFamily={FONT} fontWeight={700} fontSize={36} textAnchor="middle">diagram, not to scale</text>
    </svg></Card>;
  },
  // Languages: script tiles appear
  tiles: ({o, u, props}) => {
    const words: string[] = props.words; const n = Math.ceil(u * words.length);
    return <Card o={o} top={250} h={980}><div style={{display: "flex", flexWrap: "wrap", gap: 18, padding: 34, justifyContent: "center"}}>
      {words.slice(0, n).map((w, i) => <div key={i} style={{fontSize: 52, color: "#fff", background: "rgba(255,176,32,0.18)", border: `3px solid ${C.amber}`, borderRadius: 18, padding: "8px 22px", fontFamily: "'Kohinoor Devanagari','Kohinoor Bangla','Tamil Sangam MN','Telugu Sangam MN','Kannada Sangam MN','Malayalam Sangam MN','Gurmukhi MN','Gujarati Sangam MN','Oriya Sangam MN','Geeza Pro',sans-serif"}}>{w}</div>)}
    </div></Card>;
  },
  // Islamabad: a sector grid drawing itself
  grid: ({o, u}) => {
    const n = 6, k = u;
    return <Card o={o} top={300} h={820}><svg width={960} height={820}>
      {Array.from({length: n + 1}).map((_, i) => <g key={i}>
        <line x1={120} y1={110 + i * 100} x2={120 + 720 * Math.min(1, k * 1.4)} y2={110 + i * 100} stroke="#fff" strokeWidth={6}/>
        <line x1={120 + i * 120} y1={110} x2={120 + i * 120} y2={110 + 600 * Math.min(1, Math.max(0, k * 1.4 - 0.3))} stroke="#fff" strokeWidth={6}/></g>)}
      {["E-7", "F-6", "F-7", "G-6", "G-7", "H-8"].map((s, i) => <text key={s} x={180 + (i % 3) * 240} y={210 + Math.floor(i / 3) * 300} fill={C.amber} fontFamily={FONT} fontWeight={700} fontSize={54} opacity={k > 0.7 ? 1 : 0}>{s}</text>)}
      <text x={480} y={790} fill="#ccc" fontFamily={FONT} fontWeight={700} fontSize={36} textAnchor="middle">sector grid, simplified</text>
    </svg></Card>;
  },
  // Timeline of dates
  timeline: ({o, u, props}) => {
    const items: {y: string; t: string}[] = props.items; const n = Math.ceil(u * items.length);
    return <Card o={o} top={300} h={760}><div style={{padding: "50px 60px", fontFamily: FONT, fontWeight: 700, color: "#fff"}}>
      {items.slice(0, n).map((it, i) => <div key={i} style={{display: "flex", gap: 30, fontSize: 64, marginBottom: 34, alignItems: "baseline"}}>
        <span style={{color: C.amber, minWidth: 270, whiteSpace: "nowrap"}}>{it.y}</span><span style={{fontSize: 52}}>{it.t}</span></div>)}
    </div></Card>;
  },
};

// ---------- main component ----------
export const GeoShort: React.FC<{D: GeoData; S: Spec}> = ({D, S}) => {
  const f = useCurrentFrame(); const t = f / FPS;
  const L = useMemo(() => layout(D), [D]); const B = L.beats;
  const A = useAssets();
  const cos0 = Math.cos(S.handoff.lat * Math.PI / 180);
  const bk = (k: string) => { const b = B.find((x) => x.key === k); if (!b) throw new Error(`${S.id}: no beat ${k}`); return b; };
  const span = (w: When): [number, number] => {
    const a = bk(w.in).start + (w.dt ?? 0);
    const lastKey = B[B.length - 1].key;
    const b = w.out === "end" || (w.out ?? w.in) === lastKey ? L.end + 1 : (w.out ? bk(w.out).end + GAP : bk(w.in).end + GAP) + (w.outAt ?? 0);   // last-beat layers hold through the end card
    return [a, b];
  };
  if (!A) return <AbsoluteFill style={{background: "#05080f"}}/>;
  const G = A.geo;
  const c = camAt(t, S, B); const {s, xy} = mk(c, cos0);
  const box = (bb: number[]) => { const [x, y] = xy(bb[0], bb[3]); return {position: "absolute" as const, left: x, top: y, width: (bb[1] - bb[0]) * cos0 * s, height: (bb[3] - bb[2]) * s}; };
  const flatO = interpolate(t, [GLOBE_END - 0.05, GLOBE_END + 0.15], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const cur = B.find((b) => t >= b.start && t < b.end + GAP) ?? B[B.length - 1];
  const sw = (px: number) => px / s;
  const Xc = c.lon * cos0, Yc = -c.lat;

  const svgLayers: React.ReactNode[] = [], htmlLayers: React.ReactNode[] = [], screenLayers: React.ReactNode[] = [];
  S.layers.forEach((Ly, i) => {
    const [a, b] = span(Ly); const o = win(t, a, b); if (o <= 0) return;
    const lu = Math.max(0, Math.min(1, (t - a) / Math.max(0.3, b - a - 0.3)));   // progress through the layer's life
    switch (Ly.kind) {
      case "fill": {
        const d = [...(Ly.iso ?? []).map((k) => G.countries[k] ? ringsPath(G.countries[k], cos0) : ""), ...(Ly.state ?? []).map((k) => G.states[k] ? ringsPath(G.states[k], cos0) : ""),
          Ly.poly ? ringsPath([Ly.poly], cos0) : ""].join("");
        svgLayers.push(<path key={i} d={d} fill={Ly.color} fillOpacity={(Ly.alpha ?? 0.33) * o} stroke={Ly.color} strokeOpacity={o} strokeWidth={sw(4)}
          strokeDasharray={Ly.dashed ? `${sw(16)} ${sw(10)}` : undefined}/>); break;
      }
      case "line": {
        const len = polyLen(Ly.pts); const draw = Ly.draw ?? 0.8; const k = Math.min(1, (t - a) / draw);
        const d = linePath(Ly.pts, cos0);
        svgLayers.push(<path key={i} d={d} fill="none" stroke={Ly.color ?? "#fff"} strokeOpacity={o} strokeWidth={sw(Ly.width ?? 8)} strokeLinecap="round" strokeLinejoin="round"
          pathLength={1} strokeDasharray={Ly.flow ? `${0.03} ${0.03}` : Ly.dash ? `0.02 0.012` : `${k} 1`} strokeDashoffset={Ly.flow ? -t * 0.08 : 0}/>);
        void len;
        if (Ly.arrow && k > 0.95) {
          const [p1, p0] = [Ly.pts[Ly.pts.length - 1], Ly.pts[Ly.pts.length - 2]];
          const [x1, y1] = xy(p1[0], p1[1]), [x0, y0] = xy(p0[0], p0[1]); const ang = Math.atan2(y1 - y0, x1 - x0); const r = (Ly.width ?? 8) * 3.2;
          htmlLayers.push(<svg key={"a" + i} width={W} height={H} style={{position: "absolute", inset: 0, opacity: o}}>
            <polygon points={`${x1 + r * Math.cos(ang)},${y1 + r * Math.sin(ang)} ${x1 + r * Math.cos(ang + 2.3)},${y1 + r * Math.sin(ang + 2.3)} ${x1 + r * Math.cos(ang - 2.3)},${y1 + r * Math.sin(ang - 2.3)}`} fill={Ly.color ?? "#fff"}/></svg>);
        }
        break;
      }
      case "river": {
        const k = Math.min(1, (t - a) / (Ly.draw ?? 1.2));
        const lines = Ly.names.flatMap((n) => G.rivers[n] ?? []);
        const clipId = `rc${i}`; const cl = Ly.clip;
        svgLayers.push(<g key={i}>
          {cl && <clipPath id={clipId}><rect x={cl[0] * cos0} y={-cl[3]} width={(cl[1] - cl[0]) * cos0} height={cl[3] - cl[2]}/></clipPath>}
          <g clipPath={cl ? `url(#${clipId})` : undefined}>{lines.map((ln, j) => <path key={j} d={linePath(ln, cos0)} fill="none" stroke={Ly.color ?? C.cyan} strokeOpacity={o}
            strokeWidth={sw(Ly.width ?? 9)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${k} 1`}/>)}</g></g>); break;
      }
      case "particles": {
        const n = Ly.count ?? 18, sp = Ly.speed ?? 0.12;
        htmlLayers.push(<svg key={i} width={W} height={H} style={{position: "absolute", inset: 0, opacity: o}}>
          {Array.from({length: n}).map((_, j) => { const [lo, la] = along(Ly.pts, ((j / n) + t * sp) % 1); const [x, y] = xy(lo, la);
            return <circle key={j} cx={x} cy={y} r={Ly.size ?? 9} fill={Ly.color ?? "#fff"} stroke="#000" strokeWidth={2}/>; })}</svg>); break;
      }
      case "night": {
        const lonE = Ly.lonFrom + (Ly.lonTo - Ly.lonFrom) * ease(lu); const [xE] = xy(lonE, c.lat);
        htmlLayers.push(<div key={i} style={{position: "absolute", top: 0, bottom: 0, left: 0, width: Math.max(0, xE), opacity: 0.62 * o,
          background: "linear-gradient(to right, #020615 0%, #020615 80%, rgba(2,6,21,0) 100%)"}}/>); break;
      }
      case "label": { const [x, y] = xy(Ly.at[0], Ly.at[1]); htmlLayers.push(<Txt key={i} x={x} y={y + (Ly.dy ?? 0)} o={o} text={Ly.text} sub={Ly.sub} color={Ly.color} size={Ly.size}/>); break; }
      case "pin": {
        const [x, y] = xy(Ly.at[0], Ly.at[1]); const k = spring({frame: f - Math.round(a * FPS), fps: FPS, config: {damping: 11}});
        htmlLayers.push(<React.Fragment key={i}>
          <svg width={W} height={H} style={{position: "absolute", inset: 0, opacity: o}}><circle cx={x} cy={y} r={16 * k} fill={Ly.color ?? C.red} stroke="#fff" strokeWidth={5}/></svg>
          {Ly.text && <Txt x={x} y={y + (Ly.dy ?? -62)} o={o} text={Ly.text} color={Ly.color ?? "#fff"} size={Ly.size ?? 50}/>}</React.Fragment>); break;
      }
      case "ruler": {
        const [ax, ay] = xy(Ly.a[0], Ly.a[1]), [bx, by] = xy(Ly.b[0], Ly.b[1]); const k = Math.min(1, (t - a) / 0.7);
        htmlLayers.push(<React.Fragment key={i}><svg width={W} height={H} style={{position: "absolute", inset: 0, opacity: o}}>
          <line x1={ax} y1={ay} x2={ax + (bx - ax) * k} y2={ay + (by - ay) * k} stroke={Ly.color ?? C.amber} strokeWidth={7} strokeLinecap="round"/>
          <circle cx={ax} cy={ay} r={11} fill={Ly.color ?? C.amber}/>{k > 0.98 && <circle cx={bx} cy={by} r={11} fill={Ly.color ?? C.amber}/>}</svg>
          <Txt x={(ax + bx) / 2} y={(ay + by) / 2 + (Ly.dy ?? -60)} o={o * (k > 0.5 ? 1 : 0)} text={Ly.text} color={Ly.color ?? C.amber} size={Ly.size ?? 58}/></React.Fragment>); break;
      }
      case "bigtext": {
        const k = Ly.stamp ? spring({frame: f - Math.round(a * FPS), fps: FPS, config: {damping: 10, mass: 0.6}}) : 1;
        screenLayers.push(<div key={i} style={{position: "absolute", left: 30, right: 30, top: Ly.y ?? 240, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 700,
          transform: Ly.stamp ? `scale(${2 - k}) rotate(-5deg)` : undefined, textShadow: "0 6px 24px #000, 0 0 4px #000"}}>
          <div style={{fontSize: Ly.size ?? 150, lineHeight: 1, color: Ly.color ?? C.amber, WebkitTextStroke: Ly.stamp ? "5px #000" : undefined}}>{Ly.text}</div>
          {Ly.sub && <div style={{fontSize: (Ly.size ?? 150) * 0.4, color: "#fff", marginTop: 8}}>{Ly.sub}</div>}</div>); break;
      }
      case "counter": {
        const v = interpolate(t, [a + 0.1, a + (Ly.dur ?? 1.2)], [Ly.from, Ly.to], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
        screenLayers.push(<div key={i} style={{position: "absolute", left: 0, right: 0, top: Ly.y ?? 240, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 700, textShadow: "0 6px 24px #000"}}>
          <div style={{fontSize: Ly.size ?? 200, lineHeight: 1, color: Ly.color ?? C.amber}}>{Ly.prefix ?? ""}{Math.round(v).toLocaleString("en-US")}{Ly.suffix ?? ""}</div>
          {Ly.label && <div style={{fontSize: 60, color: "#fff"}}>{Ly.label}</div>}</div>); break;
      }
      case "clock": {
        const tm = typeof Ly.time === "string" ? hm(Ly.time) : Math.round(interpolate(lu, [0, 0.7], [hm(Ly.time[0]), hm(Ly.time[1])], {extrapolateRight: "clamp"}));
        screenLayers.push(<Clock key={i} x={Ly.x ?? 540} y={Ly.y ?? 420} r={Ly.r ?? 130} hhmm={tm} label={Ly.label} o={o} color={Ly.color ?? C.amber}/>); break;
      }
      case "bars": {
        const mx = Math.max(...Ly.items.map((x) => x.value)); const k = Math.min(1, (t - a) / 1.0);
        screenLayers.push(<div key={i} style={{position: "absolute", left: 120, right: 120, top: Ly.y ?? 260, height: 860, opacity: o, display: "flex", alignItems: "flex-end", justifyContent: "space-around"}}>
          {Ly.items.map((it) => <div key={it.label} style={{textAlign: "center", fontFamily: FONT, fontWeight: 700, color: "#fff", textShadow: shadow}}>
            <div style={{fontSize: 72, color: it.color}}>{Math.round(it.value * k)} {Ly.unit}</div>
            <div style={{width: 230, height: 640 * (it.value / mx) * k, background: it.color, opacity: 0.9, borderRadius: "14px 14px 0 0", margin: "10px auto 0"}}/>
            <div style={{fontSize: 50, marginTop: 10}}>{it.label}</div></div>)}</div>); break;
      }
      case "panel": { const P = Panels[Ly.name]; if (!P) throw new Error("no panel " + Ly.name); screenLayers.push(<P key={i} o={o} u={lu} f={f} props={Ly.props}/>); break; }
    }
  });

  const words = cur.cap.split(" "); const lt = t - cur.start;
  const nW = Math.min(words.length, Math.floor((lt / Math.max(0.5, cur.sec * 0.85)) * words.length) + 1);
  const last = B[B.length - 1]; const qO = win(t, last.start + 0.2, L.end + 5);
  return (
    <AbsoluteFill style={{background: "#05080f", overflow: "hidden"}}>
      <style>{`@font-face{font-family:Oswald;font-weight:700;src:url(${staticFile("fonts/Oswald-700.woff2")}) format("woff2");}`}</style>
      {t < GLOBE_END + 0.2 && <><Globe A={A} S={S} t={t}/><Vignette/></>}
      <AbsoluteFill style={{opacity: flatO}}>
        <AbsoluteFill style={{filter: MAPFILTER}}>
          <Img src={staticFile("geo/_shared/asia.jpg")} style={box(G.asia)}/>   {/* Img waits for the load (plain <img> raced in stills, 25 Oct 2026) */}
          {S.hi && G.hi[S.id] && c.span < 12 && <Img src={staticFile(`geo/${S.id}/hi.jpg`)} style={{...box(G.hi[S.id]),
            WebkitMaskImage: "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent), linear-gradient(transparent, #000 5%, #000 95%, transparent)", WebkitMaskComposite: "source-in"}}/>}
        </AbsoluteFill>
        <Vignette/>
        <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
          <g transform={`matrix(${s},0,0,${s},${W / 2 - Xc * s},${H / 2 - Yc * s})`} strokeLinejoin="round">
            {Object.entries(G.countries).map(([k, r]) => <path key={k} d={ringsPath(r, cos0)} fill="none" stroke={k === "IND" ? "#fff" : "rgba(255,255,255,0.55)"} strokeWidth={sw(k === "IND" ? 4.5 : 2)}/>)}
            {svgLayers}
          </g>
        </svg>
        {htmlLayers}
      </AbsoluteFill>
      <div style={{position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center", pointerEvents: "none"}}>
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: "#fff", background: "rgba(0,0,0,0.45)", borderRadius: 999,
          padding: "8px 26px", border: "2px solid rgba(255,176,32,0.8)", textShadow: "0 1px 3px #000"}}>
          <span style={{color: "#FFB020"}}>◉</span> INDICA ATLAS
        </div>
      </div>
      {screenLayers}
      {qO > 0 && <div style={{position: "absolute", left: 60, right: 60, top: 1180, textAlign: "center", opacity: qO, fontFamily: FONT, fontWeight: 700, fontSize: 50,   // 50 (was 62, Week 1): keeps questions on one line
        color: "#fff", background: "rgba(0,0,0,0.6)", borderRadius: 24, padding: "20px 26px"}}>{S.question}</div>}
      <div style={{position: "absolute", left: 50, right: 50, top: 1380, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 76, lineHeight: 1.12, color: "#fff",
        WebkitTextStroke: "3px #000", paintOrder: "stroke", textShadow: "0 6px 18px rgba(0,0,0,0.85)"}}>
        {words.map((w, i) => <span key={i} style={{opacity: i < nW ? 1 : 0, color: i === nW - 1 ? C.amber : "#fff"}}>{w} </span>)}
      </div>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 24, color: "rgba(255,255,255,0.75)", textShadow: "0 1px 3px #000"}}>
        Imagery: NASA Blue Marble · Borders: Natural Earth (India view){S.credit ? " · " + S.credit : ""}
      </div>
      {B.map((bt) => <Sequence key={bt.key} from={Math.round(bt.start * FPS)} durationInFrames={Math.ceil(bt.sec * FPS) + 2}><Audio src={staticFile(`geo/${D.id}/${bt.audio}`)}/></Sequence>)}
    </AbsoluteFill>
  );
};

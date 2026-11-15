// WINDMAP layers for look B: every layer id in CONTRACT_UPSC.md. A layer draws only from at(layer.key) and returns SVG for the map (under = above the land,
// below the wind; over = wind and marks) and HTML cards (badges) for the overlay. Tags (label items) are drawn by windmap.tsx.
// No figure is typed here: every quantity on screen comes from lab() in windmap.tsx.
import React from "react";
import {SERIF, clamp, eio, eo, lerp, prog} from "../kit";
import {Cloud} from "../map";
import {G, closed, smooth, type Focus, type LL, type Pt} from "./windmap_geo";
import {Flow, Gauge, Rain, Shimmer} from "./windmap_parts";
import type {Box} from "../map";
import {P2_LAYERS} from "./windmap_p2";

export type Item = {text?: string; lab?: string; at: string; key: string; hl?: boolean};
export type Step = {key: string; lab?: string};
// `key` is absent on layers that are only their items (pins) or only their steps (front); nothing reads it there.
export type Layer = {id: string; key: string; badge?: {lab: string; key: string}; pos?: string; to?: string; items?: Item[]; dir?: "north" | "south"; steps?: Step[]};
export type WindmapSpec = {focus: Focus; zoomFromBeach?: boolean; chip?: string; limit?: string; layers: Layer[]};
export type Ctx = {f: number; dur: number; at: (k: string) => number; B: Box; focus: Focus; P: (lon: number, lat: number) => Pt; spec: WindmapSpec; ID: string; clip: string};
export type Out = {under?: React.ReactNode; over?: React.ReactNode; hud?: (cam: (p: Pt) => Pt) => React.ReactNode};

const pts = (P: Ctx["P"], l: LL[]): Pt[] => l.map(([a, b]) => P(a, b));
const U = (B: Box) => B.k / 24.545;               // 1 for the India box
const eof = (f: number, t: number, n = 24) => eo(prog(f, t, n));

const labelAt = (c: Ctx, has: string) => {
  for (const l of c.spec.layers) for (const it of l.items ?? []) if ((it.text ?? "").includes(has)) return c.at(it.key);
  return null;
};
const layerKey = (c: Ctx, id: string) => { const l = c.spec.layers.find((x) => x.id === id); return l ? c.at(l.key) : null; };

// ---- layers
const seabreezeGiant = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), w = c.focus === "india" ? 58 : 34, o = c.P(...G.hotNW), p = eof(c.f, t, 30), u = U(c.B);
  return {
    under: p > 0.01 ? <g clipPath={`url(#${c.clip})`} opacity={p * 0.8}>
      <defs><radialGradient id="wm-warm"><stop offset="0" stopColor="#ff9a3a" stopOpacity="0.62"/><stop offset="0.55" stopColor="#ff7a2a" stopOpacity="0.28"/><stop offset="1" stopColor="#ff7a2a" stopOpacity="0"/></radialGradient></defs>
      <ellipse cx={o.x + 70 * u} cy={o.y + 120 * u} rx={430 * u} ry={380 * u} fill="url(#wm-warm)" opacity={0.9 + 0.1 * Math.sin(c.f / 12)}/>
    </g> : null,
    over: <Flow id="wmg" d={smooth(pts(c.P, G.giant))} p={eio(prog(c.f, t, 36))} f={c.f} c1="#58c3df" c2="#1a79a6" w={w} speed={3.2}/>,
  };
};

const monsoonSw = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), w = c.focus === "ocean" ? 24 : 28;
  return {over: <>{G.swArrows.map((a, i) => <Flow key={i} id={`wmsw${i}`} d={smooth(pts(c.P, a))} p={eio(prog(c.f, t + i * 12, 42))} f={c.f} c1="#f2923a" c2="#b9480f" w={w} speed={3} ph={i * 0.3}/>)}</>};
};

const equator = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), a = c.P(c.B.lon0 - 1, 0), b = c.P(c.B.lon1 + 1, 0), p = eio(prog(c.f, t, 30));
  if (p <= 0.004) return {};
  const x2 = a.x + (b.x - a.x) * p, lx = c.P(112, 0).x;
  return {over: <g>
    <line x1={a.x} y1={a.y} x2={x2} y2={a.y} stroke="#0b2a4a" strokeWidth="6" opacity="0.2" transform="translate(0 4)"/>
    <line x1={a.x} y1={a.y} x2={x2} y2={a.y} stroke="#fffbe8" strokeWidth="3" strokeDasharray="16 9" strokeDashoffset={-c.f * 0.4} opacity="0.97" style={{filter: "drop-shadow(0 0 4px rgba(255,240,170,.9))"}}/>
    {x2 > lx + 100 && <text x={lx} y={a.y - 14} textAnchor="middle" fontFamily="'RB Schibsted', sans-serif" fontWeight={800} fontSize="21" letterSpacing="0.3em" fill="#fffbe8" opacity={eof(c.f, t + 14, 12)} style={{paintOrder: "stroke", stroke: "rgba(10,40,70,.5)", strokeWidth: 3.5}}>EQUATOR</text>}
  </g>};
};

const tradesSe = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), bd = layerKey(c, "bend");
  return {over: <>{G.trades.map((a, i) => {
    const head = bd === null ? 1 : 1 - eo(prog(c.f, bd + i * 14, 8));
    return <Flow key={i} id={`wmtr${i}`} d={smooth(pts(c.P, a.trade))} p={eio(prog(c.f, t + i * 10, 40))} f={c.f} c1="#2f86da" c2="#1b4f9c" w={13} speed={2.6} ph={i * 0.19} head={head}/>;
  })}</>};
};

const cross = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), a = c.P(40, 11), b = c.P(60, -11), p = eof(c.f, t, 24), eq = c.P(0, 0).y;
  if (p <= 0.004) return {};
  const h = (b.y - a.y) * p, y0 = eq - h / 2;
  return {under: <g opacity={p}>
    <defs><linearGradient id="wm-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff2b0" stopOpacity="0"/><stop offset="0.3" stopColor="#fff2b0" stopOpacity="0.5"/><stop offset="0.7" stopColor="#fff2b0" stopOpacity="0.5"/><stop offset="1" stopColor="#fff2b0" stopOpacity="0"/></linearGradient></defs>
    <rect x={a.x} y={y0} width={b.x - a.x} height={h} fill="url(#wm-band)"/>
    <path d={`M${a.x},${y0 + h * 0.1} V${y0 + h * 0.9} M${b.x},${y0 + h * 0.1} V${y0 + h * 0.9}`} stroke="#fff6c8" strokeWidth="2.4" strokeDasharray="3 8" strokeLinecap="round"/>
    <path d={`M${a.x},${y0 + h * 0.94} v12 H${b.x} v-12`} stroke="#fff6c8" strokeWidth="3" fill="none" strokeLinejoin="round"/>
  </g>};
};

const bend = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key);
  return {over: <>{G.trades.map((a, i) => <Flow key={i} id={`wmbd${i}`} d={smooth(pts(c.P, a.bend))} p={eio(prog(c.f, t + i * 14, 46))} f={c.f} c1="#f2923a" c2="#b9480f" w={13.5} speed={2.8} ph={i * 0.23}/>)}</>};
};

const hotGlow = (c: Ctx, t: number, k = 1): React.ReactNode => {
  const o = c.P(...G.hotNW), u = U(c.B), p = eof(c.f, t, 34), beat = 1 + 0.03 * Math.sin((c.f - t) / 7);
  if (p <= 0.004) return null;
  return (
    <g clipPath={`url(#${c.clip})`} opacity={p}>
      <defs><radialGradient id="wm-hot"><stop offset="0" stopColor="#fff0a0" stopOpacity="0.95"/><stop offset="0.28" stopColor="#ffb02e" stopOpacity="0.8"/><stop offset="0.62" stopColor="#ef5a28" stopOpacity="0.5"/><stop offset="1" stopColor="#d82e22" stopOpacity="0"/></radialGradient></defs>
      <ellipse cx={o.x} cy={o.y} rx={290 * u * k * beat} ry={230 * u * k * beat} fill="url(#wm-hot)"/>
    </g>
  );
};

const hotNw = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), o = c.P(...G.hotNW), u = U(c.B), g = labelAt(c, "HARDLY"), gp = g === null ? 0 : eof(c.f, g, 16), gp2 = c.P(66, 28.7);
  return {over: <g>
    {hotGlow(c, t)}
    <Shimmer x={o.x - 150 * u} y={o.y - 220 * u} w={300 * u} h={210 * u} f={c.f} n={8} op={eof(c.f, t + 14, 22)}/>
    <Gauge x={gp2.x} y={gp2.y} a={gp} f={c.f}/>
  </g>};
};

const heatlow = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), o = c.P(...G.hotNW), u = U(c.B), p = eof(c.f, t, 28);
  if (p <= 0.004) return {};
  const R = 190 * u, cx = o.x, cy = o.y + 12 * u;
  const arms = [0, 1, 2].map((k) => {
    const a0 = (k * 2 * Math.PI) / 3 + 0.4;
    return smooth(Array.from({length: 22}).map((_, i) => { const tt = i / 21, th = a0 - tt * 3.3, r = R * (1 - 0.86 * tt); return {x: cx + Math.cos(th) * r, y: cy + Math.sin(th) * r * 0.76}; }));
  });
  return {over: <g>
    {hotGlow(c, t, 0.9)}
    <g opacity={p}>
      <ellipse cx={cx} cy={cy} rx={R * 1.12} ry={R * 0.9} fill="none" stroke="#fff3d6" strokeWidth="2.4" strokeDasharray="10 9" strokeDashoffset={-c.f * 0.3} opacity="0.85"/>
      <ellipse cx={cx} cy={cy} rx={R * 0.74} ry={R * 0.6} fill="none" stroke="#fff3d6" strokeWidth="2" strokeDasharray="6 9" strokeDashoffset={c.f * 0.3} opacity="0.7"/>
    </g>
    {arms.map((d, i) => <Flow key={i} id={`wmhl${i}`} d={d} p={eio(prog(c.f, t + 8 + i * 6, 44))} f={c.f} c1="#ffe3b4" c2="#b83a1c" w={11} speed={2.2} ph={i / 3} head={0} dots={false}/>)}
    <Shimmer x={cx - 140 * u} y={cy - 230 * u} w={280 * u} h={200 * u} f={c.f} n={8} op={p}/>
    <g transform={`translate(${cx} ${cy}) scale(${eo(prog(c.f, t + 20, 14))})`} opacity={p}>
      <circle r="36" fill="#d03a24" stroke="#fff3d6" strokeWidth="3.5"/><circle r="36" fill="none" stroke="#7a1a10" strokeWidth="1.6" opacity="0.6"/>
      <text y="14" textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize="46" fill="#fff6e4">L</text>
    </g>
  </g>};
};

const lat20 = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), a = c.P(c.B.lon0 - 1, 20), b = c.P(c.B.lon1 + 1, 20), p = eio(prog(c.f, t, 36));
  if (p <= 0.004) return {};
  const x2 = a.x + (b.x - a.x) * p;
  return {over: <g>
    <line x1={a.x} y1={a.y} x2={x2} y2={a.y} stroke="#0b2a4a" strokeWidth="6" opacity="0.2" transform="translate(0 4)"/>
    <line x1={a.x} y1={a.y} x2={x2} y2={a.y} stroke="#fff6d8" strokeWidth="9" strokeLinecap="round" opacity="0.5" filter="url(#wm-soft)"/>
    <line x1={a.x} y1={a.y} x2={x2} y2={a.y} stroke="#d83a2a" strokeWidth="3.4" strokeDasharray="22 12" strokeDashoffset={-c.f * 0.7}/>
  </g>};
};

const itczJuly = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), slide = eio(prog(c.f, t, 56)), off = (1 - slide) * 21 * c.B.k, p = eof(c.f, t, 24), k = c.B.k;
  if (p <= 0.004) return {};
  const top: Pt[] = [], bot: Pt[] = [], mid: Pt[] = [];
  for (let i = 0; i <= 12; i++) {
    const lon = lerp(65, 99, i / 12), w = Math.sin(i * 1.1) * 0.5;
    top.push(c.P(lon, 25.2 + w)); bot.push(c.P(lon, 19.8 + w * 0.8)); mid.push(c.P(lon, 22.5 + w));
  }
  const band = smooth(top) + " L" + smooth(bot.slice().reverse()).slice(1) + " Z";
  const cl = Array.from({length: 10}).map((_, i) => { const q = mid[Math.min(12, Math.max(1, Math.round(1 + i * 1.1)))]; return {x: q.x, y: q.y + (i % 2 ? 16 : -14) * (k / 19.6), s: (0.62 + 0.1 * (i % 3)) * (k / 19.6)}; });
  const q0 = mid[1], q1 = mid[11], rp = eof(c.f, t + 50, 24);
  return {over: <g transform={`translate(0 ${off})`} opacity={p}>
    <path d={band} fill="#6a86a8" opacity="0.34"/>
    <path d={band} fill="none" stroke="#e6f4ff" strokeWidth="2.4" strokeDasharray="14 10" strokeDashoffset={-c.f * 0.35} opacity="0.9"/>
    {cl.map((q, i) => <Cloud key={i} id={c.ID} x={q.x + Math.sin(c.f / 40 + i) * 6} y={q.y} s={q.s} a={0.84} seed={i + 3}/>)}
    <Rain x={q0.x} y={q0.y + 10} w={q1.x - q0.x} h={Math.max(80, 6 * k)} f={c.f} n={110} op={rp} seed={3}/>
  </g>};
};

const lerpLL = (a: LL[], b: LL[], u: number): LL[] => a.map((p, i) => [lerp(p[0], b[i][0], u), lerp(p[1], b[i][1], u)] as LL);
const trough = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), mv = c.spec.layers.find((x) => x.id === "trough-move");
  const start = L.pos === "north" ? G.troughNorth : G.troughSouth, end = mv?.to === "south" ? G.troughSouth : G.troughNorth;
  const tm = mv ? c.at(mv.key) : null, u = tm === null ? 0 : eio(prog(c.f, tm, 70)), ll = lerpLL(start, end, u), p = eio(prog(c.f, t, 42));
  if (p <= 0.004) return {};
  const pp = pts(c.P, ll), west = pp[0], east = pp[pp.length - 1];
  const ac = labelAt(c, "ACTIVE"), br = labelAt(c, "BREAK");
  const act = ac === null ? 0 : eof(c.f, ac, 16) * (br === null ? 1 : 1 - eo(prog(c.f, br - 2, 12)));
  const brk = br === null ? 0 : eof(c.f, br, 16);
  const a = c.P(75, 21.4), b = c.P(88, 17), fa = c.P(78, 31.4), fb = c.P(93, 27.2), s = 0.8 * U(c.B) + 0.1;
  const d = smooth(pp), norm = L.pos === "normal";
  return {over: <g>
    <path d={d} stroke="#0b2a4a" strokeWidth="14" fill="none" opacity="0.25" transform="translate(0 6)" strokeDasharray={`${p * 3000} 4000`} filter="url(#wm-sh)"/>
    <path d={d} stroke="#fff3d6" strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.55" strokeDasharray={`${p * 3000} 4000`}/>
    <path d={d} stroke="#a8341a" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${p * 3000} 4000`}/>
    <path d={d} stroke="#ffd9a0" strokeWidth="2.6" fill="none" strokeDasharray="1 13" strokeLinecap="round" strokeDashoffset={-c.f * 0.9} opacity="0.95"/>
    {p > 0.95 && <circle cx={east.x} cy={east.y} r="11" fill="#a8341a" stroke="#fff3d6" strokeWidth="3"/>}
    <g transform={`translate(${west.x} ${west.y})`}><circle r="30" fill="#c23a22" stroke="#fff3d6" strokeWidth="3.5"/><text y="12" textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize="38" fill="#fff6e4">L</text></g>
    {norm && <g opacity={p}>
      {[1, 2, 3].map((i) => <Cloud key={i} id="wmc" x={pp[i].x} y={pp[i].y + 26 * U(c.B)} s={s} a={0.95} seed={i + 31}/>)}
      <Rain x={pp[1].x - 30} y={Math.min(pp[1].y, pp[3].y) + 30 * U(c.B)} w={pp[3].x - pp[1].x + 60} h={130 * U(c.B) + 20} f={c.f} n={50} seed={9}/>
    </g>}
    {!norm && act > 0.01 && <g opacity={act}>
      {[0, 1, 2].map((i) => <Cloud key={i} id={c.ID} x={lerp(a.x, b.x, 0.15 + i * 0.35)} y={a.y + (i % 2) * 22 - 6} s={s} a={0.95} seed={i + 11}/>)}
      <Rain x={a.x} y={a.y + 12} w={b.x - a.x} h={150 * U(c.B) + 40} f={c.f} n={44} seed={5}/>
    </g>}
    {!norm && brk > 0.01 && <g opacity={brk}>
      {[0, 1, 2, 3].map((i) => <Cloud key={i} id={c.ID} x={lerp(fa.x, fb.x, 0.1 + i * 0.27)} y={fa.y + (i % 2) * 14} s={s} a={0.95} seed={i + 21}/>)}
      <Rain x={fa.x} y={fa.y + 22} w={fb.x - fa.x} h={90 * U(c.B) + 30} f={c.f} n={40} seed={8}/>
    </g>}
  </g>};
};

const mascarene = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), o = c.P(...G.mascarene), p = eof(c.f, t, 18), s = 1.12 * c.B.k / 12.4;
  if (p <= 0.004) return {};
  return {over: <g transform={`translate(${o.x} ${o.y}) scale(${p * s})`}>
    {[118, 86, 58].map((r, i) => <ellipse key={r} rx={r} ry={r * 0.74} fill="none" stroke="#e6f1ff" strokeWidth={i ? 2.4 : 3} strokeDasharray={i === 1 ? "none" : "12 9"} strokeDashoffset={-c.f * 0.3 * (i ? 1 : -1)} opacity={0.85 - i * 0.12}/>)}
    <g transform={`rotate(${-c.f * 1.3})`}>{[0, 120, 240].map((a) => <g key={a} transform={`rotate(${a}) translate(86 0) scale(0.7)`}><path d="M-14,-22 L12,0 L-14,22 L-6,0 Z" fill="#fff" stroke="#1c4f9c" strokeWidth="3" strokeLinejoin="round"/></g>)}</g>
    <circle r="40" fill="#2a63b8" stroke="#e6f1ff" strokeWidth="3.5"/>
    <text y="17" textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize="54" fill="#f2f8ff">H</text>
  </g>};
};

const somali = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key);
  return {over: <Flow id="wmso" d={smooth(pts(c.P, G.somali))} p={eio(prog(c.f, t, 84))} f={c.f} c1="#2bb59a" c2="#0e6a58" w={11} speed={4.4}/>};
};

const tibet = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), p = eof(c.f, t, 24);
  if (p <= 0.004) return {};
  const cp = pts(c.P, G.tibet), cx = cp.reduce((a, q) => a + q.x, 0) / cp.length, cy = cp.reduce((a, q) => a + q.y, 0) / cp.length;
  const d = closed(cp), sc = (k: number) => `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`;
  const ib = labelAt(c, "BARRIER"), q = ib === null ? 0 : eof(c.f, ib, 18);
  const s0 = c.P(86, 17), s1 = c.P(85.5, 24), s2 = c.P(87, 27.3), u = U(c.B);
  const peaks = Array.from({length: 12}).map((_, i) => { const lon = lerp(77.5, 98, i / 11), lat = 28.4 + Math.sin(i * 1.7) * 0.5 + (i > 6 ? 0.4 : 0); const pt = c.P(lon, lat); return {x: pt.x, y: pt.y, s: 0.8 + 0.3 * Math.sin(i * 2.3 + 1)}; });
  return {
    under: <g>
      <mask id="wm-tib-m"><rect width="1920" height="1080" fill="#fff"/><path d={c.B.india} fill="#000"/></mask>
      <g mask="url(#wm-tib-m)" transform={sc(p)} opacity={p}>
        <defs>
          <radialGradient id="wm-tib-g" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stopColor="#f4eee2"/><stop offset="0.5" stopColor="#d9c4a0"/><stop offset="1" stopColor="#a78552"/></radialGradient>
          <clipPath id="wm-tib-c"><path d={d}/></clipPath>
        </defs>
        <path d={d} fill="#0b2a4a" opacity="0.3" transform="translate(6 12)" filter="url(#wm-sh)"/>
        <path d={d} fill="url(#wm-tib-g)"/>
        <g clipPath="url(#wm-tib-c)">
          {[0.84, 0.68, 0.52, 0.36].map((k, i) => <path key={k} d={d} transform={sc(k)} fill="none" stroke={i % 2 ? "#fffaf0" : "#8a6838"} strokeWidth="2.2" opacity="0.7"/>)}
          <path d={d} fill="none" stroke="#7a5a2a" strokeWidth="22" opacity="0.16" filter="url(#wm-soft)"/>
        </g>
        <path d={d} fill="none" stroke="#6e4e24" strokeWidth="2" strokeLinejoin="round" opacity="0.9"/>
      </g>
    </g>,
    over: <g>
      <g opacity={p}>
        {peaks.map((pk, i) => <g key={i} transform={`translate(${pk.x} ${pk.y}) scale(${pk.s * (0.55 + 0.45 * u)})`}><path d="M-17,10 L0,-24 L17,10 Z" fill="#e9eef5" stroke="#5a6f8c" strokeWidth="1.6" strokeLinejoin="round"/><path d="M0,-24 L17,10 L5,10 Z" fill="#9db4cf"/><path d="M-7,-5 L0,-24 L5,-8 L0,-11 Z" fill="#fff"/></g>)}
      </g>
      {q > 0.01 && <g opacity={q}>
        <Flow id="wmtb" d={smooth([s0, s1, s2])} p={1} f={c.f} c1="#e8f2ff" c2="#3a6ba8" w={14} speed={2.6}/>
        <Shimmer x={cx - 150} y={cy - 120} w={300} h={130} f={c.f} n={7} col="#ff9a6a" op={0.95}/>
      </g>}
    </g>,
  };
};

const tej = (c: Ctx, L: Layer): Out => {
  const t = c.at(L.key), p = eio(prog(c.f, t, 72)), cp = pts(c.P, G.tej), d = smooth(cp), ch = c.P(...G.chennai);
  return {over: <g>
    <g transform="translate(0 44)" opacity="0.5"><Flow id="wmtjs" d={d} p={p} f={c.f} c1="#0b2a4a" c2="#0b2a4a" w={9} speed={0} head={0} dots={false} shadow={false} core="#0b2a4a"/></g>
    <Flow id="wmtj" d={d} p={p} f={c.f} c1="#9468e0" c2="#4a2a98" w={9} speed={9} ph={0.2}/>
    {[-17, 17].map((dy, i) => <g key={dy} transform={`translate(0 ${dy})`} opacity="0.8"><Flow id={`wmtj${i}`} d={d} p={p * 0.96} f={c.f + dy * 3} c1="#d8c8f6" c2="#6a48b8" w={3} speed={12} head={0} dots={false} shadow={false} core="#fff"/></g>)}
    {p > 0.4 && <g opacity={eof(c.f, t + 30, 14)}>
      <circle cx={ch.x} cy={ch.y} r="9" fill="#d83a2a" stroke="#fff6e4" strokeWidth="3"/>
      <text x={ch.x} y={ch.y + 34} textAnchor="middle" fontFamily="'RB Schibsted', sans-serif" fontWeight={800} fontSize="19" letterSpacing="0.14em" fill="#fff6e4" style={{paintOrder: "stroke", stroke: "rgba(10,30,60,.65)", strokeWidth: 4}}>CHENNAI</text>
    </g>}
  </g>};
};

export const LAYERS: Record<string, (c: Ctx, L: Layer) => Out> = {
  "seabreeze-giant": seabreezeGiant, "monsoon-sw": monsoonSw, equator, "trades-se": tradesSe, cross, bend, "hot-nw": hotNw, heatlow, lat20, "itcz-july": itczJuly,
  trough, "trough-move": () => ({}), mascarene, somali, tibet, tej, labels: () => ({}), ...P2_LAYERS,
};
void clamp;

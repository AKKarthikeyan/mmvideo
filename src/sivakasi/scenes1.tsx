import React from "react";
import {AbsoluteFill} from "remotion";
import {C, W, H, FPS, Sky, Sparks, Burst, clamp, lerp, prog, easeIO, easeOut, sp, rnd, sec, MONO, SANS, ringPath} from "./kit";
import geo from "../../public/sivakasi/geo.json";

export type SceneProps = {f: number; dur: number; spans: {key: string; s: number; e: number}[]; p?: any};

// ---------- skyline silhouette (generic southern town: low houses, a temple tower, a tall chimney) ----------
export const Skyline: React.FC<{y?: number; color?: string; lights?: number; f?: number}> = ({y = 900, color = "#05071A", lights = 1, f = 0}) => {
  const r = rnd(11); const hs: JSX.Element[] = []; let x = -20;
  while (x < W + 40) { const w = 70 + r() * 110, h = 40 + r() * 90; hs.push(<g key={x}><rect x={x} y={y - h} width={w} height={h + 200} fill={color} />
    {r() < 0.6 && lights > 0 && <rect x={x + w * 0.3} y={y - h * 0.6} width={10} height={14} fill={C.gold} opacity={lights * (0.55 + 0.25 * Math.sin(f / 18 + x))} />}</g>); x += w + 6 + r() * 14; }
  return <g>{hs}
    <g fill={color}><path d={`M200 ${y} V${y - 150} L228 ${y - 150} V${y - 230} L252 ${y - 230} V${y - 300} L272 ${y - 300} V${y - 230} L296 ${y - 230} V${y - 150} L324 ${y - 150} V${y} Z`} /></g>
    <rect x={1500} y={y - 330} width={26} height={400} fill={color} /></g>;
};

// ---------- fireworks over a town: rockets rise under gravity, burst into drag-damped sparks ----------
export const FireSky: React.FC<SceneProps> = ({f, dur, p = {}}) => {
  const density = p.density ?? 1, dim = p.dim ?? 1, g = 900;
  const rk = rnd(p.seed ?? 3), n = Math.ceil((dur / FPS) * 1.6 * density), items: JSX.Element[] = [];
  const pal = [[C.gold, C.amber, "#fff"], [C.red, "#FF9AA6", "#fff"], [C.teal, C.mist, "#fff"], [C.leaf, "#C9FFD9", "#fff"], ["#C58BFF", "#F0D4FF", "#fff"]];
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * (dur / FPS) * 0.96 + rk() * 0.25, x = 260 + rk() * 1400, apex = 300 + rk() * 360, v0 = Math.sqrt(2 * g * apex), ta = v0 / g, t = sec(f) - t0;
    if (t < -0.05 || t > ta + 3.2) continue;
    const y0 = 880, rx = x + (rk() - 0.5) * 80;
    if (t < ta) { const yy = y0 - (v0 * t - 0.5 * g * t * t);
      items.push(<g key={`r${i}`}><circle cx={rx} cy={yy} r={4} fill={C.gold} />
        <Sparks f={f} b={{x: rx, y: yy, t0: t0 + t - 0.03, n: 5, speed: 40, g: 200, k: 3, life: 0.5, colors: [C.amber], size: 2.2, seed: i + 40, spread: 0.6, angle: Math.PI / 2}} /></g>);
    } else {
      const tb = t0 + ta, yb = y0 - (v0 * ta - 0.5 * g * ta * ta), flash = Math.exp(-(sec(f) - tb) * 7);
      items.push(<g key={`b${i}`}><circle cx={rx} cy={yb} r={240} fill={`url(#fl${i % 5})`} opacity={0.75 * flash} />
        <Sparks f={f} b={{x: rx, y: yb, t0: tb, n: 90, speed: 430 + rk() * 160, g: 330, k: 1.5, life: 2.7, colors: pal[i % 5], size: 3.4, seed: i + 7, trail: 0.09}} /></g>);
    }
  }
  return <AbsoluteFill><Sky f={f} top={C.ink} mid={C.indigo} bot={C.plum} />
    <svg width={W} height={H} style={{position: "absolute"}}><defs>{pal.map((c, i) => <radialGradient key={i} id={`fl${i}`}><stop offset="0" stopColor={c[0]} stopOpacity="0.55" /><stop offset="1" stopColor={c[0]} stopOpacity="0" /></radialGradient>)}</defs>{items}<Skyline f={f} lights={dim} /></svg></AbsoluteFill>;
};

// ---------- rain shadow: moist air is forced up the windward slope, rains out, and arrives dry on the lee side ----------
const ridgeY = (x: number) => 860 - 560 * Math.exp(-(((x - 760) / 330) ** 2)) - 40 * Math.exp(-(((x - 560) / 120) ** 2));
export const RainShadow: React.FC<SceneProps> = ({f, dur, p = {}}) => {
  const T = sec(f), pan = -prog(f, 0, dur, easeIO) * 380, r = rnd(21);
  const terrain = "M-200 1080 L-200 " + ridgeY(-200) + Array.from({length: 90}, (_, i) => ` L${-200 + (i + 1) * 30} ${ridgeY(-200 + (i + 1) * 30)}`).join("") + " L2700 1080 Z";
  const clouds = Array.from({length: 7}, (_, i) => { const x0 = -300 + i * 190, wind = 70, x = ((x0 + wind * T + 3000) % 2600) - 300, base = Math.min(520, ridgeY(x) - 150), dry = clamp((x - 760) / 500);
    return {x, y: Math.max(130, base) - (i % 3) * 40, w: 150 + (i % 3) * 40, dry}; });
  const drops = Array.from({length: 70}, (_, j) => { const c = clouds[j % 7], per = 1.1, ph = (j * 0.173) % per, t = (T + ph) % per; const fall = 0.5 * 900 * t * t;
    const x = c.x - 18 * t + ((j * 37) % 120) - 60; const y = c.y + 40 + fall; const gy = ridgeY(x);
    return c.dry < 0.15 && y < gy ? <line key={j} x1={x} y1={y} x2={x - 2} y2={y + 14} stroke={C.mist} strokeWidth={2} opacity={0.75 * (1 - c.dry * 6)} /> : null; });
  const cracks = Array.from({length: 46}, (_, i) => { const x = 1020 + r() * 1500, y = 900 + r() * 150, a = r() * 6.28, l = 25 + r() * 70; return <path key={i} d={`M${x} ${y} l${Math.cos(a) * l} ${Math.sin(a) * l * 0.4} l${Math.cos(a + 1) * l * 0.6} ${Math.sin(a + 1) * l * 0.25}`} stroke="#3A2013" strokeWidth={2.4} fill="none" />; });
  const sunA = T * 0.2;
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><linearGradient id="rs-sky" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2C3F8F" /><stop offset="0.5" stopColor="#6E7FD0" /><stop offset="1" stopColor="#F6B567" /></linearGradient>
      <linearGradient id="rs-ter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3C8F6B" /><stop offset="1" stopColor="#193D3A" /></linearGradient>
      <linearGradient id="rs-hz" gradientUnits="userSpaceOnUse" x1="780" y1="0" x2="1320" y2="0"><stop offset="0" stopColor="#3C8F6B" /><stop offset="1" stopColor="#C58A4A" /></linearGradient>
      <linearGradient id="rs-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#1A0F0A" stopOpacity="0.55" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#rs-sky)" />
    <g transform={`translate(${pan * 0.35} 0)`}><circle cx={1700} cy={190} r={90} fill={C.gold} opacity={0.92} />{Array.from({length: 14}, (_, i) => <line key={i} x1={1700 + Math.cos(sunA + i * 0.449) * 110} y1={190 + Math.sin(sunA + i * 0.449) * 110} x2={1700 + Math.cos(sunA + i * 0.449) * 170} y2={190 + Math.sin(sunA + i * 0.449) * 170} stroke={C.gold} strokeWidth={6} opacity={0.5} strokeLinecap="round" />)}</g>
    <g transform={`translate(${pan} 0)`}>
      <rect x={-200} y={820} width={560} height={300} fill="#1C5FA8" opacity={0.9} />
      {Array.from({length: 9}, (_, i) => <path key={i} d={`M${-180 + i * 62} ${850 + (i % 3) * 22} q20 -10 40 0 t40 0`} stroke="#8FD1FF" strokeWidth={3} fill="none" opacity={0.6} />)}
      <path d={terrain} fill="url(#rs-hz)" /><path d={terrain} fill="url(#rs-shade)" />{cracks}
      {clouds.map((c, i) => <g key={i} transform={`translate(${c.x} ${c.y})`} opacity={0.95 - c.dry * 0.65}>
        <ellipse cx={0} cy={0} rx={c.w} ry={46} fill="#E9EEFF" /><ellipse cx={-c.w * 0.35} cy={-22} rx={c.w * 0.5} ry={44} fill="#FFFFFF" /><ellipse cx={c.w * 0.3} cy={-26} rx={c.w * 0.45} ry={40} fill="#F2F5FF" /></g>)}
      {drops}
    </g></svg></AbsoluteFill>;
};

// ---------- globe: orthographic projection, decelerating spin to India, then a zoom ----------
const orth = (lon: number, lat: number, l0: number, p0: number) => {
  const d2r = Math.PI / 180, l = (lon - l0) * d2r, ph = lat * d2r, p = p0 * d2r;
  const cc = Math.sin(p) * Math.sin(ph) + Math.cos(p) * Math.cos(ph) * Math.cos(l);
  return {x: Math.cos(ph) * Math.sin(l), y: -(Math.cos(p) * Math.sin(ph) - Math.sin(p) * Math.cos(ph) * Math.cos(l)), vis: cc > 0};
};
export const Globe: React.FC<SceneProps> = ({f, dur, p = {}}) => {
  const spin = prog(f, 0, dur * 0.55, easeOut), zoom = prog(f, dur * 0.5, dur, easeIO), l0 = lerp(-60, 79, spin), p0 = lerp(8, 17, spin);
  const R = lerp(380, 1500, zoom), cx = lerp(W / 2, W / 2 - 40, zoom), cy = lerp(H / 2, H / 2 + 420, zoom);
  const path = (r: number[][]) => { let d = ""; r.forEach(([lo, la], i) => { const o = orth(lo, la, l0, p0); let x = o.x, y = o.y; if (!o.vis) { const m = Math.hypot(x, y) || 1; x /= m; y /= m; } d += (i ? "L" : "M") + (cx + x * R).toFixed(1) + "," + (cy + y * R).toFixed(1); }); return d + "Z"; };
  const world = (geo as any).world as {n: string; r: number[][][]}[];
  const sv = orth(77.8, 9.45, l0, p0), pulse = 1 + 0.35 * Math.sin(f / 9);
  return <AbsoluteFill><Sky f={f} top={C.ink} mid="#0A1240" bot="#1B1050" stars={140} />
    <svg width={W} height={H} style={{position: "absolute"}}><defs><radialGradient id="gl-o" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stopColor="#1E4FA0" /><stop offset="1" stopColor="#081445" /></radialGradient>
      <radialGradient id="gl-atm" cx="0.5" cy="0.5" r="0.5"><stop offset="0.9" stopColor="#6CC8FF" stopOpacity="0.5" /><stop offset="1" stopColor="#6CC8FF" stopOpacity="0" /></radialGradient></defs>
      <circle cx={cx} cy={cy} r={R * 1.08} fill="url(#gl-atm)" /><circle cx={cx} cy={cy} r={R} fill="url(#gl-o)" />
      {world.map((c, i) => c.r.map((r, j) => <path key={i + "-" + j} d={path(r)} fill={c.n === "India" ? C.amber : "#2E6E5A"} opacity={c.n === "India" ? 0.95 : 0.85} stroke="#0A1A30" strokeWidth={1} />))}
      {(geo as any).tn.map((r: number[][], i: number) => <path key={"tn" + i} d={path(r)} fill={C.flame} stroke={C.gold} strokeWidth={2} opacity={prog(f, dur * 0.45, dur * 0.7)} />)}
      {sv.vis && <g transform={`translate(${cx + sv.x * R} ${cy + sv.y * R})`} opacity={prog(f, dur * 0.55, dur * 0.8)}>
        <circle r={14 * pulse * (R / 600 + 0.4)} fill="#FFF" opacity={0.25} /><circle r={7 * (R / 600 + 0.5)} fill="#fff" /></g>}
    </svg></AbsoluteFill>;
};

// ---------- an empty town: dry fields, wind, a faint outline of what is not there ----------
export const EmptyTown: React.FC<SceneProps> = ({f, dur}) => {
  const T = sec(f), r = rnd(9), dust = Array.from({length: 60}, (_, i) => ({x0: r() * W, y: 640 + r() * 330, sp: 60 + r() * 120, s: 1.5 + r() * 3.5, ph: r() * 9}));
  const ghost = 0.5 + 0.5 * Math.sin(T * 1.4), fade = prog(f, dur * 0.55, dur * 0.85);
  return <AbsoluteFill><svg width={W} height={H} style={{position: "absolute"}}>
    <defs><linearGradient id="et-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E9A45A" /><stop offset="0.55" stopColor="#F6D79A" /><stop offset="1" stopColor="#FBE9C2" /></linearGradient></defs>
    <rect width={W} height={H} fill="url(#et-sky)" /><circle cx={1500} cy={250} r={110} fill="#FFF3CF" opacity={0.9} />
    <path d="M0 720 C 300 650 600 700 900 660 S 1500 640 1920 700 V1080 H0 Z" fill="#C99356" /><path d="M0 820 C 400 780 800 840 1200 800 S 1700 790 1920 830 V1080 H0 Z" fill="#A66F3D" />
    {[260, 620, 980, 1340].map((x, i) => <g key={i}><rect x={x} y={760 + (i % 2) * 40} width={110} height={70} fill="#7B5236" /><path d={`M${x - 14} ${760 + (i % 2) * 40} L${x + 55} ${706 + (i % 2) * 40} L${x + 124} ${760 + (i % 2) * 40} Z`} fill="#5A3A24" /></g>)}
    <g opacity={0.5 * ghost * (1 - fade)} stroke="#2B1B14" strokeWidth={4} fill="none" strokeDasharray="14 12"><path d="M1480 840 V620 H1600 V700 H1700 V620 H1820 V840 Z" /><rect x={1536} y={540} width={26} height={80} /></g>
    <g opacity={0.5 * (1 - fade)}>{Array.from({length: 10}, (_, i) => <path key={i} d={`M${1120 + i * 70} 940 q4 -34 -6 -62 M${1126 + i * 70} 940 q16 -28 28 -48`} stroke="#6B7C3A" strokeWidth={3} fill="none" />)}</g>
    {dust.map((d, i) => { const x = ((d.x0 + d.sp * T) % (W + 100)) - 50, y = d.y + 14 * Math.sin(T * 1.7 + d.ph); return <circle key={i} cx={x} cy={y} r={d.s} fill="#F4D9A6" opacity={0.5} />; })}
  </svg></AbsoluteFill>;
};

// ---------- rewind: the year counter runs backwards, a train streaks past ----------
export const Rewind: React.FC<SceneProps> = ({f, dur, p = {}}) => {
  const from = p.from ?? 2018, to = p.to ?? 1922, k = prog(f, 6, dur - 18, easeIO), year = Math.round(lerp(from, to, k)), v = Math.sin(Math.PI * k);
  const T = sec(f);
  return <AbsoluteFill><Sky f={f} top={C.ink} mid="#1A1250" bot="#4A2060" stars={50} />
    <svg width={W} height={H} style={{position: "absolute"}}>
      {Array.from({length: 26}, (_, i) => { const y = 120 + ((i * 97) % 820), L = 160 + ((i * 53) % 420) * v, x = ((W + 400) - ((T * (900 + (i % 5) * 380) * (0.3 + v)) + i * 331) % (W + 800)); return <line key={i} x1={x} y1={y} x2={x + L} y2={y} stroke="#BFD8FF" strokeWidth={2 + (i % 3)} opacity={0.12 + 0.35 * v} strokeLinecap="round" />; })}
      <rect y={820} width={W} height={260} fill="#07091C" /><line x1={0} y1={836} x2={W} y2={836} stroke="#7F8FC0" strokeWidth={3} />
      <g transform={`translate(${lerp(W + 400, -1400, k)} 0)`}><rect x={0} y={700} width={1180} height={120} rx={22} fill="#1A2350" stroke="#7F8FC0" strokeWidth={3} />
        {Array.from({length: 9}, (_, i) => <rect key={i} x={40 + i * 128} y={724} width={78} height={46} rx={8} fill={C.gold} opacity={0.85} />)}<rect x={1120} y={680} width={90} height={140} rx={16} fill="#2A3470" /></g>
      <text x={W / 2} y={560} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={230} fill={C.cream} style={{fontVariantNumeric: "tabular-nums"}} textRendering="geometricPrecision" opacity={0.95}>{year}</text>
    </svg></AbsoluteFill>;
};

// ---------- sheds that go quiet: smoke stops, lights go out one by one, months tick past ----------
export const QuietSheds: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const T = sec(f), off0 = (spans[p.offAt ?? 1]?.s ?? dur * 0.4), months = clamp((f - off0 - 40) / (dur - off0 - 60)) * 5;
  const smoke = (i: number) => Array.from({length: 14}, (_, j) => { const age = ((T * 0.5 + j / 14 + i * 0.2) % 1), life = age; const live = f < off0 + i * 14;
    return live || age < 0.6 && f < off0 + i * 14 + 120 ? <circle key={j} cx={300 + i * 280 + 14 * Math.sin(age * 5 + j) + age * 60} cy={620 - age * 330} r={14 + age * 46} fill="#8E97B8" opacity={(1 - age) * 0.4 * (live ? 1 : clamp(1 - (f - off0 - i * 14) / 120))} /> : null; });
  return <AbsoluteFill><Sky f={f} top={C.ink} mid="#0F1546" bot="#3B1D55" stars={80} />
    <svg width={W} height={H} style={{position: "absolute"}}>
      {Array.from({length: 6}, (_, i) => { const x = 160 + i * 280, on = f < off0 + i * 14, a = on ? 0.8 + 0.12 * Math.sin(f / 7 + i) : clamp(1 - (f - off0 - i * 14) / 20) * 0.8;
        return <g key={i}><rect x={x} y={640} width={220} height={260} fill="#0A0E28" /><path d={`M${x} 640 l55 -48 v48 l55 -48 v48 l55 -48 v48 l55 -48 v96`} fill="#0A0E28" /><rect x={x + 170} y={470} width={26} height={180} fill="#0A0E28" />
          {[0, 1, 2].map((k) => <rect key={k} x={x + 26 + k * 66} y={720} width={46} height={46} fill={C.gold} opacity={a} />)}{smoke(i)}</g>; })}
      <rect y={900} width={W} height={180} fill="#05071A" />
      {Array.from({length: 5}, (_, i) => <g key={i} transform={`translate(${660 + i * 120} 970)`}><rect width={96} height={64} rx={10} fill={clamp(months - i) > 0.5 ? C.steel : "none"} stroke={C.steel} strokeWidth={3} opacity={clamp(months - i + 0.2) * 0.9 + 0.1} />
        <rect x={10} y={10} width={76 * clamp(months - i)} height={44} rx={6} fill={C.indigo} opacity={0.6} /></g>)}
    </svg></AbsoluteFill>;
};

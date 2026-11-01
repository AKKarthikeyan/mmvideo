// Polish pass (1 Nov 2026): richer versions of the plainest, most-used scenes. Registered over the originals in registry.ts.
import React from "react";
import {AbsoluteFill} from "remotion";
import {C, W, H, FPS, Sky, Sparks, Icon, IconName, clamp, lerp, prog, easeIO, easeOut, sp, rnd, sec, proj, View} from "./kit";
import {SceneProps, Skyline, RainShadow as RainShadow0} from "./scenes1";
import {Hands as Hands0, RouteMap as RouteMap0, Person, IndiaBase} from "./scenes2";
import {BengalLight as BengalLight0} from "./scenes3";
import geo from "../../public/sivakasi/geo.json";

const bez = (a: number[], c: number[], b: number[], t: number) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
const ICON_COL: Record<string, string> = {match: C.flame, flame: C.amber, press: C.teal, firework: "#FF7BA8", hand: C.sand, sun: C.gold, ship: "#6CB6FF", calendar: "#FF6B7A", doc: C.cream, label: C.leaf, factory: C.amber};

// ---------- ambient layer: slow colour glows and rising embers (art only) ----------
const Ambient: React.FC<{f: number; n?: number; hue?: string}> = ({f, n = 46, hue = C.amber}) => {
  const T = sec(f), r = rnd(17), em = Array.from({length: n}, () => ({x: r() * W, s: 18 + r() * 40, o: r() * 1300, a: 0.15 + r() * 0.35, z: 1 + r() * 2.2, ph: r() * 6}));
  return <svg width={W} height={H} style={{position: "absolute", mixBlendMode: "screen" as any}}>
    <defs>{[0, 1, 2].map((i) => <radialGradient key={i} id={`am${i}`}><stop offset="0" stopColor={[hue, C.plum, "#2B5BD7"][i]} stopOpacity="0.34" /><stop offset="1" stopColor={C.ink} stopOpacity="0" /></radialGradient>)}</defs>
    {[0, 1, 2].map((i) => <circle key={i} cx={W * (0.2 + 0.3 * i) + Math.sin(T * 0.25 + i * 2) * 140} cy={H * (0.36 + 0.14 * (i % 2)) + Math.cos(T * 0.2 + i) * 70} r={560} fill={`url(#am${i})`} />)}
    {em.map((e, i) => { const y = H + 20 - ((T * e.s + e.o) % (H + 120)); return <circle key={i} cx={e.x + Math.sin(T * 0.8 + e.ph) * 24} cy={y} r={e.z} fill={hue} opacity={e.a * clamp(y / 260)} />; })}
  </svg>;
};

// ---------- the chain: a lit fuse runs from link to link; each node ignites when the fuse reaches it ----------
export const Chain: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const icons: IconName[] = p.icons ?? ["match", "flame", "press", "firework"], litAt: number[] = p.litAt ?? icons.map((_, i) => i), n = icons.length, x0 = n > 4 ? 250 : 320, gap = (W - 2 * x0) / (n - 1), y0 = p.y ?? 520, T = sec(f);
  const lf = litAt.map((b, i) => (b < 0 ? 99999 : (spans[Math.min(b, spans.length - 1)]?.s ?? 0) + 6 + i * (p.stagger ?? 0)));
  const X = (i: number) => x0 + i * gap, Y = (i: number) => y0 + Math.sin(T * 1.1 + i * 1.3) * 8;
  const link = (i: number, k: number) => bez([X(i) + 112, Y(i)], [(X(i) + X(i + 1)) / 2, Y(i) + 80], [X(i + 1) - 112, Y(i + 1)], k);
  const kk = (i: number, fr: number) => prog(fr, lf[i + 1] - 38, lf[i + 1], easeIO);
  return <AbsoluteFill><Sky f={f} top="#070A24" mid="#121A4A" bot="#2A1A58" stars={80} /><Ambient f={f} />
    <svg width={W} height={H} style={{position: "absolute"}}>
      <defs>{icons.map((ic, i) => <radialGradient key={i} id={`nd${i}`}><stop offset="0" stopColor={ICON_COL[ic] ?? C.amber} stopOpacity="0.55" /><stop offset="1" stopColor={ICON_COL[ic] ?? C.amber} stopOpacity="0" /></radialGradient>)}</defs>
      {icons.slice(1).map((_, i) => { const k = kk(i, f), A = [X(i) + 112, Y(i)], B = [X(i + 1) - 112, Y(i + 1)], Cc = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 + 80], d = `M${A[0]} ${A[1]} Q${Cc[0]} ${Cc[1] + 0} ${B[0]} ${B[1]}`, head = link(i, k);
        return <g key={i}><path d={d} stroke={C.steel} strokeWidth={6} fill="none" strokeDasharray="2 16" strokeLinecap="round" opacity={0.4} />
          {lf[i] < 99999 && <path d={d} stroke="#3A1E10" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 2`} />}
          {lf[i] < 99999 && <path d={d} stroke={C.amber} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0, k)} 2`} opacity={0.0} />}
          {k > 0 && k < 1 && <g><circle cx={head[0]} cy={head[1]} r={46} fill={C.gold} opacity={0.18} /><circle cx={head[0]} cy={head[1]} r={12} fill="#fff" />
            {Array.from({length: 7}, (_, j) => { const tj = T - j * 0.05, kj = kk(i, tj * FPS); return kj > 0 && kj < 1 ? <Sparks key={j} f={f} b={{x: link(i, kj)[0], y: link(i, kj)[1], t0: tj, n: 4, speed: 150, g: 700, k: 2, life: 0.55, colors: [C.gold, "#fff", C.flame], size: 2.4, seed: 30 + j + i * 9}} /> : null; })}</g>}</g>; })}
      {icons.map((ic, i) => { const on = f > lf[i], s = sp(f, lf[i], 9, 160), ring = prog(f, lf[i], lf[i] + 40, easeOut), col = ICON_COL[ic] ?? C.amber;
        return <g key={i} transform={`translate(${X(i)} ${Y(i)})`}>
          {on && <circle r={230 + 20 * Math.sin(T * 2 + i)} fill={`url(#nd${i})`} />}
          <circle r={108} fill={on ? "#1B2366" : "#0B0F30"} stroke={on ? col : C.steel} strokeWidth={on ? 7 : 4} opacity={on ? 1 : 0.55} />
          <circle r={90} fill="none" stroke={on ? col : C.steel} strokeWidth={2} opacity={on ? 0.5 : 0.2} strokeDasharray="6 12" strokeDashoffset={T * 20} />
          {on && ring < 1 && <circle r={108 + ring * 160} fill="none" stroke={col} strokeWidth={6 * (1 - ring)} opacity={1 - ring} />}
          <g transform={`scale(${on ? 0.5 + 0.55 * s : 0.8})`} opacity={on ? 1 : 0.45}><Icon n={ic} s={140} color={on ? C.cream : C.steel} lit={on ? 1 : 0} /></g>
          {on && f - lf[i] < 70 && <Sparks f={f} b={{x: 0, y: 0, t0: lf[i] / FPS, n: 36, speed: 360, g: 380, k: 1.7, life: 1.1, colors: [col, "#fff", C.gold], size: 3.2, seed: 70 + i}} />}</g>; })}
    </svg></AbsoluteFill>;
};

// ---------- dominoes: the camera follows the wave; each impact throws dust and a ring ----------
export const Dominoes: React.FC<SceneProps> = ({f, dur, spans, p = {}}) => {
  const icons: IconName[] = p.icons ?? ["match", "hand", "flame", "press", "ship", "factory", "firework"], n = icons.length, h = 330, wid = 104, gap = 168, base = 800, alpha = 3.4, thetaHit = Math.atan2(gap - 24, h), T = sec(f);
  const start = (spans[p.startAt ?? 0]?.s ?? 20) / FPS + 0.5, dt = Math.sqrt((2 * thetaHit) / alpha), t0 = (i: number) => start + i * dt;
  const th = (i: number) => { const t = T - t0(i); return t < 0 ? 0 : Math.min(thetaHit + 1.2, 0.5 * alpha * t * t); };
  const front = Array.from({length: n}, (_, i) => clamp(th(i) / thetaHit)).reduce((a, b) => a + b, 0), cam = -(front - (n - 1) / 2) * gap * 0.55, x0 = 960 - ((n - 1) * gap) / 2;
  return <AbsoluteFill><Sky f={f} top="#0A0F34" mid="#1D2260" bot="#4A2A70" stars={70} /><Ambient f={f} hue={C.gold} n={30} />
    <svg width={W} height={H} style={{position: "absolute"}}><g transform={`translate(${cam} 0)`}>
      <rect x={-2000} y={base} width={6000} height={400} fill="#0B0E2A" /><rect x={-2000} y={base} width={6000} height={6} fill={C.steel} opacity={0.5} />
      {icons.map((ic, i) => { const a = th(i), x = x0 + i * gap, col = ICON_COL[ic] ?? C.gold, fall = clamp(a / thetaHit);
        return <g key={i}><ellipse cx={x + wid / 2 + a * 70} cy={base + 8} rx={wid * (0.7 + a * 0.5)} ry={12} fill="#000" opacity={0.35} />
          <g transform={`translate(${x + wid / 2} ${base}) rotate(${(a * 180) / Math.PI})`}><rect x={-wid} y={-h} width={wid} height={h} rx={12} fill={`url(#dm${i % 2})`} stroke={fall > 0.05 ? col : C.gold} strokeWidth={5} />
            <rect x={-wid + 8} y={-h + 8} width={wid - 16} height={h - 16} rx={8} fill="none" stroke={col} strokeWidth={2} opacity={0.4} /><g transform={`translate(${-wid / 2} ${-h / 2})`}><Icon n={ic} s={78} color={C.cream} lit={fall > 0.05 ? 1 : 0} /></g></g>
          {a > 0 && a < 0.35 && i > 0 && <circle cx={x} cy={base - h * 0.5} r={a * 220} fill="none" stroke={col} strokeWidth={4 * (1 - a / 0.35)} opacity={1 - a / 0.35} />}
          {T - t0(i) > 0 && T - t0(i) < 0.12 && i > 0 && <Sparks f={f} b={{x, y: base - h * 0.55, t0: t0(i), n: 18, speed: 300, g: 800, k: 2, life: 0.6, colors: [col, "#fff", C.gold], size: 3, seed: 5 + i}} />}</g>; })}
    </g><defs>{[0, 1].map((i) => <linearGradient key={i} id={`dm${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={i ? "#27329C" : "#2F3BAE"} /><stop offset="1" stopColor="#141A66" /></linearGradient>)}</defs></svg></AbsoluteFill>;
};

// ---------- rain shadow with wind streaks over the ridge, a hut, a dry tree and a farmer for human scale ----------
const ridgeY = (x: number) => 860 - 560 * Math.exp(-(((x - 760) / 330) ** 2)) - 40 * Math.exp(-(((x - 560) / 120) ** 2));
export const RainShadow: React.FC<SceneProps> = (props) => {
  const {f, dur} = props, T = sec(f), pan = -prog(f, 0, dur, easeIO) * 380;
  return <AbsoluteFill><RainShadow0 {...props} />
    <svg width={W} height={H} style={{position: "absolute"}}><g transform={`translate(${pan} 0)`}>
      {Array.from({length: 16}, (_, k) => { const pts = Array.from({length: 70}, (_, i) => { const x = -200 + i * 40, y = Math.min(ridgeY(x) - 70 - k * 22, 640 - k * 18); return `${x},${y}`; });
        return <polyline key={k} points={pts.join(" ")} fill="none" stroke={C.mist} strokeWidth={2.6} strokeLinecap="round" strokeDasharray="38 180" strokeDashoffset={-T * (150 + k * 7)} opacity={0.32} />; })}
      <g transform="translate(1560 840)"><rect x={-60} y={-70} width={120} height={70} fill="#7B5236" /><path d="M-76 -70 L0 -122 L76 -70 Z" fill="#4A2C1E" /><rect x={-14} y={-40} width={28} height={40} fill="#2B1810" /></g>
      <g transform="translate(1960 850)"><path d="M0 0 V-170" stroke="#3A2013" strokeWidth={12} /><path d="M0 -120 l-70 -60 M0 -140 l60 -70 M0 -90 l60 -20" stroke="#3A2013" strokeWidth={7} fill="none" /></g>
      <Person x={1300 + prog(f, 0, dur, (t: number) => t) * 300} y={842} s={1.1} color="#E8DCC0" phase={T * 4} walk={0.8} skin="#B97C48" />
      {Array.from({length: 12}, (_, i) => <path key={i} d={`M${1100 + i * 90} ${770 - ((T * 30 + i * 17) % 90)} q9 -12 0 -24 t0 -24`} stroke="#fff" strokeWidth={2.4} fill="none" opacity={0.14} />)}
    </g></svg></AbsoluteFill>;
};

// ---------- hands network with factory smoke, rolling figures, cloud shadows and warm windows ----------
export const Hands: React.FC<SceneProps> = (props) => {
  const {f, dur} = props, T = sec(f), cx = 960, cy = 540, N = 9, r = rnd(4), homes = Array.from({length: N}, (_, i) => { const a = (i / N) * Math.PI * 2 + 0.3, rr = 330 + (i % 3) * 70; return {x: cx + Math.cos(a) * rr * 1.45, y: cy + Math.sin(a) * rr * 0.85, ph: r()}; });
  return <AbsoluteFill><Hands0 {...props} />
    <svg width={W} height={H} style={{position: "absolute"}}>
      {[0, 1, 2].map((i) => <ellipse key={i} cx={((T * 40 + i * 700) % 2600) - 340} cy={300 + i * 280} rx={360} ry={130} fill="#2A1810" opacity={0.1} />)}
      {Array.from({length: 18}, (_, i) => { const age = (T * 0.45 + i / 18) % 1, a = Math.min(age * 3, 1); return <circle key={i} cx={cx + 83 + 10 * Math.sin(age * 6 + i) + age * 90} cy={cy - 150 - age * 360} r={16 + age * 66} fill="#EDEFF9" opacity={(1 - age) * 0.38 * a} />; })}
      {homes.map((h, i) => { const s = sp(f, 14 + i * 5, 12, 150), k = Math.sin(T * 5 + h.ph * 6);
        return <g key={i} transform={`translate(${h.x - 6} ${h.y + 66}) scale(${s})`}><circle cx={0} cy={-38} r={9} fill="#D9A066" /><rect x={-9} y={-30} width={18} height={26} rx={7} fill={["#E8DCC0", "#C5584B", "#D9A441", "#5A7FB8"][i % 4]} />
          <g transform={`translate(10 -18) rotate(${k * 12})`}><rect x={-4} y={-4} width={30} height={9} rx={4.5} fill={C.cream} stroke="#7A5530" strokeWidth={1.4} /></g></g>; })}
      {homes.map((h, i) => <circle key={"w" + i} cx={h.x - 8} cy={h.y + 40} r={26 + 3 * Math.sin(T * 2 + i)} fill={C.gold} opacity={0.14} />)}
    </svg></AbsoluteFill>;
};

// ---------- route map: glowing trail, sparks at the head, city lights, a ripple at the start ----------
const VIEW: View = {lon0: 68, lon1: 93, lat0: 5, lat1: 27, x: 370, y: 0, w: 1180, h: 1080};
export const RouteMap: React.FC<SceneProps> = (props) => {
  const {f, dur, p = {}} = props, P = proj(VIEW), pl = (geo as any).places as Record<string, number[]>, from = pl[p.from ?? "Sivakasi (approx)"], to = pl[p.to ?? "Kolkata"], T = sec(f);
  const a = P(from[0], from[1]), b = P(to[0], to[1]), mid = [(a[0] + b[0]) / 2 - 140, (a[1] + b[1]) / 2 + 30], zoom = lerp(1.0, p.zoom ?? 1.12, prog(f, 0, 90, easeOut));
  const kAt = (fr: number) => prog(fr, 40, dur - 50, p.vehicle === "train" || !p.vehicle ? easeIO : (t: number) => t), k = kAt(f), head = bez(a, mid, b, k), d = `M${a[0]} ${a[1]} Q${mid[0]} ${mid[1]} ${b[0]} ${b[1]}`;
  return <AbsoluteFill><RouteMap0 {...props} />
    <svg width={W} height={H} style={{position: "absolute"}}><g transform={`translate(${W / 2} ${H / 2}) scale(${zoom}) translate(${-W / 2} ${-H / 2})`}>
      {["Mumbai", "Chennai", "Kochi", "Madurai", "Coimbatore", "New Delhi"].map((n, i) => { const q = pl[n]; if (!q || n === (p.from ?? "") || n === (p.to ?? "")) return null; const [x, y] = P(q[0], q[1]); return <g key={n}><circle cx={x} cy={y} r={14 + 5 * Math.sin(T * 2 + i)} fill={C.gold} opacity={0.16} /><circle cx={x} cy={y} r={3.5} fill="#FFF3C4" opacity={0.9} /></g>; })}
      <path d={d} stroke={C.gold} strokeWidth={22} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 2`} opacity={0.18} />
      {[0, 1, 2].map((i) => { const age = (T * 0.7 + i / 3) % 1; return <circle key={i} cx={a[0]} cy={a[1]} r={14 + age * 70} fill="none" stroke={C.gold} strokeWidth={3 * (1 - age)} opacity={1 - age} />; })}
      {k > 0 && k < 0.995 && <g><circle cx={head[0]} cy={head[1]} r={40} fill={C.gold} opacity={0.2} />{Array.from({length: 6}, (_, j) => { const tj = T - j * 0.06, q = bez(a, mid, b, kAt(tj * FPS)); return <Sparks key={j} f={f} b={{x: q[0], y: q[1], t0: tj, n: 3, speed: 90, g: 120, k: 2, life: 0.8, colors: [C.gold, "#fff"], size: 2.2, seed: 50 + j}} />; })}</g>}
    </g></svg></AbsoluteFill>;
};

// ---------- Bengal light: distant bursts in the flame's changing colours, embers rising ----------
export const BengalLight: React.FC<SceneProps> = (props) => {
  const {f, dur} = props, T = sec(f), cols = [[C.flame, C.gold], ["#FF3B4E", "#FFB3BD"], ["#4ADE80", "#C9FFD9"], ["#4FB8FF", "#CDEBFF"], [C.gold, "#fff"], ["#C58BFF", "#F0D4FF"]], per = 2.6, n = Math.floor((dur / FPS - 1.8) / per);
  return <AbsoluteFill><BengalLight0 {...props} /><Ambient f={f} hue={C.flame} n={26} />
    <svg width={W} height={H} style={{position: "absolute"}}>{Array.from({length: Math.max(0, n)}, (_, i) => { const c = cols[i % cols.length], t0 = 1.8 + i * per, side = i % 2 ? 1 : 0, x = side ? 1560 + (i % 3) * 90 : 260 + (i % 3) * 110, y = 200 + (i % 4) * 70;
      return <Sparks key={i} f={f} b={{x, y, t0, n: 70, speed: 330, g: 300, k: 1.5, life: 2.4, colors: [c[0], c[1], "#fff"], size: 3, seed: 200 + i, trail: 0.08}} />; })}</svg></AbsoluteFill>;
};


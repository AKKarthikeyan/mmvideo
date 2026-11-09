// Sample A, s038 (the peak): on the left the old giant sea-breeze arrow fades; on the right the glowing equatorial rain belt slides north
// over India, pulling the trade winds across the equator. Geography: public/datayt/long/upsc/basemap.json (asia box) only.
import React from "react";
import {AbsoluteFill} from "remotion";
import {K, W, H, Finish, Tag, Puff, Motes, Orb, Stars, clamp, easeOut, easeIO, lerp, sstep, rnd} from "./rk";
import {BOXES, LandLayer, Ocean, Stream, catmull, mkView, type Pt} from "./mapkit";

const PW = 840, PH = 700, PY = 128, LX = 96, RX = 984;
const chaikin = (p: [number, number][], n = 2): [number, number][] => { let q = p; for (let k = 0; k < n; k++) { const o: [number, number][] = [q[0]]; for (let i = 0; i < q.length - 1; i++) { const a = q[i], b = q[i + 1]; o.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]); } o.push(q[q.length - 1]); q = o; } return q; };

// The old giant sea-breeze arrow, built from slices so it can crumble away: each slice has a lit half and a shade half.
const SeaArrow: React.FC<{pts: Pt[]; grow: number; d: number}> = ({pts, grow, d}) => {
  const c = catmull(pts, 10), N = 30, W0 = 66, st: {p: Pt; n: Pt; h: number}[] = [];
  const at = (s: number) => { let i = 1; while (i < c.len.length - 1 && c.len[i] < s) i++; const a = c.pts[i - 1], b = c.pts[i], t = (s - c.len[i - 1]) / Math.max(1e-6, c.len[i] - c.len[i - 1]);
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1; return {p: {x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t)}, n: {x: dy / L, y: -dx / L}}; };
  const total = c.total * clamp(grow), headN = 7;
  for (let i = 0; i < N; i++) {
    const s = (total * i) / (N - 1), q = at(s), k = i - (N - headN);
    const h = k < 0 ? W0 * (0.55 + 0.45 * Math.min(1, i / 5)) : W0 * 1.9 * (1 - k / (headN - 1));
    if (k === 0) st.push({...q, h: W0});
    st.push({...q, h});
  }
  const r = rnd(5);
  const sl = st.slice(0, -1).map((a, i) => { const b = st[i + 1], rd = r(), ang = r() * 6.28;
    const loc = clamp(d * 1.7 - rd * 0.7), off = loc * (30 + 80 * rd);
    return {a, b, loc, dx: Math.cos(ang) * off * 0.6 + loc * 40, dy: -loc * (40 + 90 * rd), rot: (rd - 0.5) * 70 * loc}; });
  const P2 = (q: {p: Pt; n: Pt}, h: number, sgn: number) => `${(q.p.x + q.n.x * h * sgn).toFixed(1)} ${(q.p.y + q.n.y * h * sgn).toFixed(1)}`;
  const lit = "#8ED0FF", sh = "#3A6FD8";
  return <g>
    {sl.map((s, i) => { if (s.loc >= 0.99) return null; const mx = (s.a.p.x + s.b.p.x) / 2, my = (s.a.p.y + s.b.p.y) / 2;
      return <g key={i} transform={`translate(${s.dx} ${s.dy}) rotate(${s.rot} ${mx} ${my})`} opacity={(1 - s.loc) * 0.96}>
        <path d={`M ${P2(s.a, s.a.h, 1)} L ${P2(s.b, s.b.h, 1)} L ${s.b.p.x} ${s.b.p.y} L ${s.a.p.x} ${s.a.p.y} Z`} fill={lit} stroke={lit} strokeWidth={1.2}/>
        <path d={`M ${s.a.p.x} ${s.a.p.y} L ${s.b.p.x} ${s.b.p.y} L ${P2(s.b, s.b.h, -1)} L ${P2(s.a, s.a.h, -1)} Z`} fill={sh} stroke={sh} strokeWidth={1.2}/>
      </g>; })}
  </g>;
};

// The equatorial rain belt: a glowing band, a row of lit clouds, slanted rain, riding at screen height yc.
const Belt: React.FC<{yc: number; f: number; a: number; w: number}> = ({yc, f, a, w}) => {
  const r = rnd(21), puffs = Array.from({length: 27}, (_, i) => ({x0: (i / 27) * (w + 220) + r() * 20, s: 0.6 + r() * 0.5, dy: (r() - 0.5) * 40, row: i % 3, ph: r() * 6.28}));
  return <g opacity={a}>
    <defs>
      <linearGradient id="s38belt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BFF6FF" stopOpacity={0}/><stop offset="0.45" stopColor="#BFF6FF" stopOpacity={0.5}/><stop offset="1" stopColor="#7DEAE0" stopOpacity={0}/></linearGradient>
      <linearGradient id="s38rain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFF8FF" stopOpacity={0.85}/><stop offset="1" stopColor="#7DEAE0" stopOpacity={0}/></linearGradient>
    </defs>
    <rect x={-20} y={yc - 170} width={w + 40} height={340} fill="url(#s38belt)" style={{mixBlendMode: "screen"}} opacity={0.75}/>
    <ellipse cx={w / 2} cy={yc} rx={w * 0.75} ry={86} fill="#DFFBFF" opacity={0.16}/>
    {Array.from({length: 46}, (_, i) => { const x = ((i * 53 + 17) % (w + 40)) - 10, ph = (f * 0.022 + i * 0.173) % 1, y0 = yc + 14 + ((i * 37) % 60);
      return <path key={i} d={`M ${x - ph * 14} ${y0 + ph * 110} l -7 22`} stroke="url(#s38rain)" strokeWidth={3.5} strokeLinecap="round" opacity={0.75 * Math.sin(Math.PI * ph)}/>; })}
    {[2, 1, 0].map((row) => puffs.filter((p) => p.row === row).map((p, i) => { const x = ((p.x0 + f * (0.25 + row * 0.12)) % (w + 220)) - 110;
      return <Puff key={`${row}${i}`} x={x} y={yc + (row - 1) * 22 + p.dy + Math.sin(f / 45 + p.ph) * 5 - 14} s={p.s * (0.7 + row * 0.18)} c={row === 2 ? "#9FB0F0" : row === 1 ? "#D6E6FF" : "#F4FBFF"}/>; }))}
  </g>;
};

const PanelFrame: React.FC<{x: number; color: string; glow: number; children: React.ReactNode; filter?: string}> = ({x, color, glow, children, filter}) => <div style={{position: "absolute", left: x, top: PY, width: PW, height: PH, borderRadius: 40, overflow: "hidden",
  boxShadow: `0 0 0 3px ${color}66, 0 0 ${60 * glow}px ${color}88, 0 30px 70px rgba(0,0,0,0.5)`, filter}}>{children}</div>;

export const S038: React.FC<{f: number; dur: number; at: (k: string) => number}> = ({f, dur, at}) => {
  const b = BOXES.asia, nv = at("nv");
  const v = mkView(b, 0.74, 74.5 + Math.sin(f / 160) * 0.4, 14.3, PW / 2, PH / 2 + 6), P = v.P;
  const appear = easeOut(f, 0, 26);
  const aGrow = easeOut(f, 8, 52), dis = sstep(78, 176, f);          // the old arrow grows, holds, then crumbles
  const bl = lerp(0.8, 19,  easeIO(f, 96, 204)), bA = easeOut(f, 46, 80);   // the belt rises out of the equator and slides north
  const yc = P(0, bl).y;
  const lanes = [[56, 74], [60.5, 80], [65, 87]] as const;
  const laneC = (xc: number, xe: number, i: number) => { const eyy = Math.max(3, bl - 1.5);
    const pts: [number, number][] = [[xc + 34 + i * 4, -11.5], [xc + 17, -6], [xc + 6, -2.2], [xc, 0.4], [xc + 1.4, lerp(0.4, eyy, 0.28)], [lerp(xc, xe, 0.36), lerp(0.4, eyy, 0.6)], [lerp(xc, xe, 0.7), lerp(0.4, eyy, 0.88)], [xe, eyy]];
    return catmull(chaikin(pts).map(([lo, la]) => P(lo, la)), 6); };
  const laneS = (i: number) => easeOut(f, 70 + i * 6, 130 + i * 6);
  const heat = 0.95 - 0.7 * dis, sunY = P(0, bl).y;
  const arrowPts = [[66, -9.5], [64.5, -2], [67, 6.5], [72.5, 13.5], [80.5, 18.5]].map(([lo, la]) => P(lo, la));
  return <AbsoluteFill style={{background: K.night}}>
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
      <defs><radialGradient id="s38bg" cx="0.5" cy="0.4" r="0.9"><stop offset="0" stopColor="#1B2C80"/><stop offset="0.6" stopColor="#101C58"/><stop offset="1" stopColor="#070C2A"/></radialGradient></defs>
      <rect width={W} height={H} fill="url(#s38bg)"/>
      <Orb x={470 + Math.sin(f / 150) * 20} y={520} r={560} c="#5B6FD6" o={0.16}/>
      <Orb x={1430} y={480} r={620} c="#2EC4B6" o={0.14 + 0.2 * bA * sstep(90, 200, f)}/>
      <g transform={`translate(${Math.sin(f / 150) * 10} 0)`}><Stars f={f} n={90} seed={7} h={1080} o={0.8}/></g>
      <Motes f={f} n={30} seed={3} box={[0, 0, W, H]} c="#BFE9FF" r={[1.2, 3]} vx={0.12} vy={-0.1} o={0.5} glow/>
    </svg>
    <PanelFrame x={LX} color="#7C8CE0" glow={0.6 - 0.35 * dis} filter={`saturate(${1 - 0.55 * dis}) brightness(${1 - 0.18 * dis})`}>
      <svg width={PW} height={PH} style={{opacity: appear}}>
        <Ocean f={f} b={b} v={v} id="s38lo" w={PW} h={PH} warm={0.9 * heat} warmX={560} warmY={150}/>
        <LandLayer b={b} v={v} f={f} id="s38ll" indiaHeat={heat}/>
        <Orb x={P(79, 22).x} y={P(79, 22).y} r={190} c="#FF8A4C" o={0.45 * heat}/>
        <SeaArrow pts={arrowPts} grow={aGrow} d={dis}/>
        <Motes f={f} n={14} seed={9} box={[0, 0, PW, PH]} c="#FFD27A" r={[1.5, 3]} vx={0.1} vy={-0.5} o={0.5 * heat} glow/>
      </svg>
    </PanelFrame>
    <PanelFrame x={RX} color="#7DEAE0" glow={0.5 + 0.7 * sstep(60, 200, f)}>
      <svg width={PW} height={PH} style={{opacity: appear}}>
        <Ocean f={f} b={b} v={v} id="s38ro" w={PW} h={PH} warm={0.3 + 0.5 * sstep(100, 210, f)} warmX={560} warmY={150}/>
        <LandLayer b={b} v={v} f={f} id="s38rl" indiaHeat={0.4 + 0.35 * sstep(110, 210, f)}/>
        <line x1={0} y1={P(0, 0).y} x2={PW} y2={P(0, 0).y} stroke={K.yellowL} strokeWidth={3.5} strokeDasharray="22 14" strokeDashoffset={-f} opacity={0.75}/>
        {lanes.map(([xc, xe], i) => { const c = laneC(xc, xe, i), eqY = P(0, 0).y; let sCross = 0; for (let j = 0; j < c.pts.length; j++) if (c.pts[j].y >= eqY) sCross = c.len[j];
          return <Stream key={i} curve={c} s={c.total * laneS(i)} f={f} w={9} c0="#7DEAE0" c1="#FFC561" id={`s38t${i}`} split={sCross / c.total} speed={2.4} gap={80} head/>; })}
        <Belt yc={yc} f={f} a={bA} w={PW}/>
        <g transform={`translate(${PW - 54} ${sunY})`} opacity={bA}>
          <Orb x={0} y={0} r={120} c="#FFE58A" o={0.7}/>
          {Array.from({length: 10}, (_, i) => <path key={i} d={`M ${Math.cos(i * 0.628 + f / 80) * 36} ${Math.sin(i * 0.628 + f / 80) * 36} L ${Math.cos(i * 0.628 + f / 80) * 50} ${Math.sin(i * 0.628 + f / 80) * 50}`} stroke="#FFE58A" strokeWidth={6} strokeLinecap="round"/>)}
          <circle r={26} fill="#FFF3C0"/><path d="M 4 -26 A 26 26 0 0 1 4 26 A 34 34 0 0 0 4 -26 Z" fill="#FFC561"/>
        </g>
      </svg>
    </PanelFrame>
    <Tag text="OLD VIEW: A GIANT SEA BREEZE" f={f} at={16} x={LX + PW / 2} y={PY + PH + 58} color="#9AA8F0" size={34}/>
    <Tag text="NEWER VIEW: THE RAIN BELT MOVING NORTH" f={f} at={nv} x={RX + PW / 2} y={PY + PH + 58} color={K.tealL} size={34}/>
    <Finish/>
  </AbsoluteFill>;
};

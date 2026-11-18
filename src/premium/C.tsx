// Treatment C: isometric 3D-look diorama at dusk. A small floating world built from real 3D coordinates (boxes, cylinders,
// cones) projected through an orthographic camera that slowly orbits and pushes in, so the diorama turns like a toy on a
// table. Flat three-tone clay shading, glowing windows and water, stars and fireflies. All code-drawn, no images.
import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {B1, B2, FONT, Grain, H, KineticNumber, Label, M1, MBlur, NUM, Vignette, W, inOut, lin, outQuint, particles, spr} from "./common";

// ---------- camera + projection ----------
const PH = (32 * Math.PI) / 180, SPH = Math.sin(PH), CPH = Math.cos(PH);
type Cam = {th: number; S: number; cx: number; cy: number};
const pr = (P: Cam, x: number, y: number, z: number): [number, number] => {
  const c = Math.cos(P.th), s = Math.sin(P.th);
  return [P.cx + P.S * (x * c - y * s), P.cy + P.S * ((x * s + y * c) * SPH - z * CPH)];
};
const depth = (P: Cam, x: number, y: number) => x * Math.sin(P.th) + y * Math.cos(P.th);
const pts = (a: [number, number][]) => a.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");

// ---------- colour helpers: tops lit warm, left faces mid, right faces in cool dusk shadow ----------
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c: number[]) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
const mix = (a: string, b: string, t: number) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * t)); };
const DUSK = "#4B3A7A";
const tones = (base: string) => ({top: mix(base, "#FFF4E0", 0.22), left: base, right: mix(base, DUSK, 0.42)});

type Bx = [number, number, number, number, number, number];
const Box: React.FC<{P: Cam; b: Bx; color: string; top?: string; lip?: string; strata?: boolean}> = ({P, b, color, top, lip, strata}) => {
  const [x0, x1, y0, y1, z0, z1] = b, t = tones(color);
  const T = pts([pr(P, x0, y0, z1), pr(P, x1, y0, z1), pr(P, x1, y1, z1), pr(P, x0, y1, z1)]);
  const L = pts([pr(P, x0, y1, z1), pr(P, x1, y1, z1), pr(P, x1, y1, z0), pr(P, x0, y1, z0)]);
  const R = pts([pr(P, x1, y0, z1), pr(P, x1, y1, z1), pr(P, x1, y1, z0), pr(P, x1, y0, z0)]);
  const lipH = Math.min(10, z1 - z0);
  return (
    <g>
      <polygon points={L} fill={t.left}/>
      <polygon points={R} fill={t.right}/>
      {strata ? [0.45, 0.75].map((k) => {
        const z = z1 - (z1 - z0) * k;
        return <g key={k} opacity={0.35}>
          <polyline points={pts([pr(P, x0, y1, z), pr(P, x1, y1, z), pr(P, x1, y0, z)])} fill="none" stroke={mix(color, "#2A1A30", 0.5)} strokeWidth={3}/>
        </g>;
      }) : null}
      {lip ? <>
        <polygon points={pts([pr(P, x0, y1, z1), pr(P, x1, y1, z1), pr(P, x1, y1, z1 - lipH), pr(P, x0, y1, z1 - lipH)])} fill={tones(lip).left}/>
        <polygon points={pts([pr(P, x1, y0, z1), pr(P, x1, y1, z1), pr(P, x1, y1, z1 - lipH), pr(P, x1, y0, z1 - lipH)])} fill={tones(lip).right}/>
      </> : null}
      <polygon points={T} fill={top ? tones(top).top : t.top}/>
      <polyline points={pts([pr(P, x0, y1, z1), pr(P, x1, y1, z1), pr(P, x1, y0, z1)])} fill="none" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={1.5}/>
    </g>
  );
};
const Cyl: React.FC<{P: Cam; x: number; y: number; r: number; z0: number; z1: number; side: string; top: string; topStroke?: string}> = ({P, x, y, r, z0, z1, side, top, topStroke}) => {
  const [X0, Y0] = pr(P, x, y, z0), [X1, Y1] = pr(P, x, y, z1), rx = P.S * r, ry = P.S * r * SPH;
  return <g>
    <path d={`M ${X1 - rx} ${Y1} L ${X0 - rx} ${Y0} A ${rx} ${ry} 0 0 0 ${X0 + rx} ${Y0} L ${X1 + rx} ${Y1} Z`} fill={side}/>
    <ellipse cx={X1} cy={Y1} rx={rx} ry={ry} fill={top} stroke={topStroke} strokeWidth={topStroke ? 1.5 : 0}/>
  </g>;
};
const Cone: React.FC<{P: Cam; x: number; y: number; r: number; z: number; h: number; fill: string}> = ({P, x, y, r, z, h, fill}) => {
  const [X, Y] = pr(P, x, y, z), [, YA] = pr(P, x, y, z + h), rx = P.S * r, ry = P.S * r * SPH;
  return <path d={`M ${X - rx} ${Y} A ${rx} ${ry} 0 0 0 ${X + rx} ${Y} L ${X} ${YA} Z`} fill={fill}/>;
};
const Glow: React.FC<{x: number; y: number; r: number; o?: number}> = ({x, y, r, o = 1}) => <circle cx={x} cy={y} r={r} fill="url(#pc-glow)" opacity={o}/>;

const Defs: React.FC = () => (
  <svg width={0} height={0} style={{position: "absolute"}}>
    <defs>
      <radialGradient id="pc-bg" cx="0.5" cy="0.78" r="0.85"><stop offset="0" stopColor="#FFB58C"/><stop offset="0.35" stopColor="#C2709A"/><stop offset="0.7" stopColor="#4E3F84"/><stop offset="1" stopColor="#1E2050"/></radialGradient>
      <radialGradient id="pc-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFE3A0" stopOpacity="0.85"/><stop offset="1" stopColor="#FFB060" stopOpacity="0"/></radialGradient>
      <radialGradient id="pc-wglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#7FF3FF" stopOpacity="0.55"/><stop offset="1" stopColor="#7FF3FF" stopOpacity="0"/></radialGradient>
      <radialGradient id="pc-shadow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#140F30" stopOpacity="0.55"/><stop offset="1" stopColor="#140F30" stopOpacity="0"/></radialGradient>
      <linearGradient id="pc-stoneCyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FBEBD6"/><stop offset="0.5" stopColor="#E3CBAE"/><stop offset="1" stopColor="#9D86A0"/></linearGradient>
      <linearGradient id="pc-roof" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FF8A6A"/><stop offset="0.55" stopColor="#E0584A"/><stop offset="1" stopColor="#8E3A5A"/></linearGradient>
      <linearGradient id="pc-gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFE9A0"/><stop offset="0.3" stopColor="#FFCB4A"/><stop offset="0.7" stopColor="#E09A2A"/><stop offset="1" stopColor="#9A5C4A"/></linearGradient>
      <radialGradient id="pc-goldTop" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#FFF4C4"/><stop offset="0.55" stopColor="#FFD35A"/><stop offset="1" stopColor="#E6A32E"/></radialGradient>
      <linearGradient id="pc-wcol" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#A8F6FF"/><stop offset="0.45" stopColor="#3FC6D6"/><stop offset="1" stopColor="#2A6E9A"/></linearGradient>
      <radialGradient id="pc-trunk" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#B8EC8A"/><stop offset="0.55" stopColor="#5DB66A"/><stop offset="1" stopColor="#2F6A62"/></radialGradient>
      <linearGradient id="pc-diskSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#C98A64"/><stop offset="0.6" stopColor="#9C6456"/><stop offset="1" stopColor="#5A3E6A"/></linearGradient>
      <radialGradient id="pc-diskTop" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stopColor="#A8E594"/><stop offset="0.7" stopColor="#80CC7C"/><stop offset="1" stopColor="#5FA878"/></radialGradient>
      <linearGradient id="pc-plinthCyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F6E9DA"/><stop offset="0.6" stopColor="#D8C3B0"/><stop offset="1" stopColor="#8E7E9E"/></linearGradient>
    </defs>
  </svg>
);

const Backdrop: React.FC<{f: number}> = ({f}) => (
  <>
    <rect width={W} height={H} fill="url(#pc-bg)"/>
    {particles("cstar", 70).map((s, i) => <circle key={i} cx={s.x * W} cy={s.y * 520} r={0.8 + s.r * 1.8} fill="#FFFFFF" opacity={(0.25 + 0.6 * Math.abs(Math.sin(f * 0.04 + s.p))) * (1 - s.y * 0.8)}/>)}
    <circle cx={1580} cy={190} r={46} fill="#FFF4DA" opacity={0.95}/><circle cx={1580} cy={190} r={140} fill="url(#pc-glow)" opacity={0.5}/>
  </>
);
const Fireflies: React.FC<{f: number; seed: string; n?: number}> = ({f, seed, n = 26}) => (
  <>{particles(seed, n).map((q, i) => {
    const x = 300 + q.x * 1320 + Math.sin(f * 0.03 + q.p) * 40, y = 250 + q.y * 650 + Math.cos(f * 0.025 + q.p * 2) * 30, o = 0.3 + 0.7 * Math.max(0, Math.sin(f * 0.08 + q.p * 4));
    return <g key={i} opacity={o}><circle cx={x} cy={y} r={9} fill="url(#pc-glow)"/><circle cx={x} cy={y} r={2.2} fill="#FFF6C8"/></g>;
  })}</>
);

// ---------- pieces of the diorama ----------
const Tree: React.FC<{P: Cam; x: number; y: number; z?: number; k?: number}> = ({P, x, y, z = 0, k = 1}) => {
  const [sx, sy] = pr(P, x + 14, y + 10, z), [cx, cy] = pr(P, x, y, z + 44 * k);
  return <g>
    <ellipse cx={sx} cy={sy} rx={26 * k * P.S} ry={12 * k * P.S} fill="url(#pc-shadow)"/>
    <Cyl P={P} x={x} y={y} r={4 * k} z0={z} z1={z + 26 * k} side="#7A4E46" top="#8E5E50"/>
    <circle cx={cx} cy={cy} r={24 * k * P.S} fill="url(#pc-trunk)"/>
  </g>;
};
// A shop: box body, roof slab, striped awning on the front (+y) face, a glowing window. g = 0..1 growth (spring).
const ShopC: React.FC<{P: Cam; x: number; y: number; awn: string; g?: number}> = ({P, x, y, awn, g = 1}) => {
  if (g <= 0.01) return null;
  const w = 30 * Math.min(1.05, g), d = 22 * Math.min(1.05, g), h = 52 * g;
  const y1 = y + d;
  const win = pts([pr(P, x - w + 6, y1, h * 0.25), pr(P, x - 4, y1, h * 0.25), pr(P, x - 4, y1, h * 0.62), pr(P, x - w + 6, y1, h * 0.62)]);
  const door = pts([pr(P, x + 6, y1, 0), pr(P, x + w - 6, y1, 0), pr(P, x + w - 6, y1, h * 0.6), pr(P, x + 6, y1, h * 0.6)]);
  const [gx, gy] = pr(P, x - w / 2, y1, h * 0.45);
  return (
    <g>
      <polygon points={pts([pr(P, x - w, y - d, 0), pr(P, x + w + 26, y - d + 12, 0), pr(P, x + w + 26, y1 + 18, 0), pr(P, x - w, y1, 0)])} fill="#1C1440" opacity={0.22}/>
      <Box P={P} b={[x - w, x + w, y - d, y1, 0, h]} color="#F4E2CC"/>
      <polygon points={win} fill="#FFD27A"/>
      <polygon points={door} fill="#7A4A52"/>
      <Glow x={gx} y={gy} r={34 * P.S * g} o={0.8}/>
      <Box P={P} b={[x - w - 4, x + w + 4, y - d - 4, y1 + 4, h, h + 7 * g]} color="#D9604E"/>
      {Array.from({length: 4}).map((_, i) => {
        const a = x - w + (i * 2 * w) / 4, b = a + (2 * w) / 4;
        return <polygon key={i} points={pts([pr(P, a, y1, h - 4), pr(P, b, y1, h - 4), pr(P, b, y1 + 14, h - 16), pr(P, a, y1 + 14, h - 16)])} fill={i % 2 ? "#FFF6EA" : awn}/>;
      })}
    </g>
  );
};
const CastleC: React.FC<{P: Cam; f: number; z: number}> = ({P, f, z}) => {
  const parts: {d: number; el: React.ReactNode}[] = [];
  const T = 78;
  const towers: [number, number][] = [[-T, -T], [T, -T], [-T, T], [T, T]];
  towers.forEach(([x, y], i) => parts.push({d: depth(P, x, y), el: <g key={"t" + i}>
    <Cyl P={P} x={x} y={y} r={24} z0={z} z1={z + 130} side="url(#pc-stoneCyl)" top="#F6E6D2"/>
    <Cone P={P} x={x} y={y} r={30} z={z + 130} h={64} fill="url(#pc-roof)"/>
    {(() => { const [wx, wy] = pr(P, x, y + 22, z + 92); return <><Glow x={wx} y={wy} r={20 * P.S}/><rect x={wx - 4 * P.S} y={wy - 8 * P.S} width={8 * P.S} height={14 * P.S} rx={3} fill="#FFD983"/></>; })()}
  </g>}));
  // curtain walls between towers
  ([[-T, T, -T - 9, -T + 9], [-T, T, T - 9, T + 9]] as number[][]).forEach(([a, b, c, d], i) => parts.push({d: depth(P, 0, (c + d) / 2) - 1, el: <Box key={"wx" + i} P={P} b={[a, b, c, d, z, z + 86]} color="#EBD7BC"/>}));
  ([[-T - 9, -T + 9, -T, T], [T - 9, T + 9, -T, T]] as number[][]).forEach(([a, b, c, d], i) => parts.push({d: depth(P, (a + b) / 2, 0) - 1, el: <Box key={"wy" + i} P={P} b={[a, b, c, d, z, z + 86]} color="#EBD7BC"/>}));
  parts.push({d: depth(P, 0, 0), el: <g key="keep">
    <Box P={P} b={[-46, 46, -46, 46, z, z + 150]} color="#F1DFC6"/>
    {(() => { const q = (xx: number, zz: number) => pr(P, xx, 46, zz); const D = pts([q(-14, z), q(14, z), q(14, z + 44), q(-14, z + 44)]); return <polygon points={D} fill="#6E4250"/>; })()}
    {[-24, 24].map((xx) => { const [wx, wy] = pr(P, xx, 46, z + 104); return <g key={xx}><Glow x={wx} y={wy} r={18 * P.S}/><rect x={wx - 5 * P.S} y={wy - 9 * P.S} width={10 * P.S} height={16 * P.S} rx={3} fill="#FFD983"/></g>; })}
    <Cyl P={P} x={0} y={0} r={30} z0={z + 150} z1={z + 214} side="url(#pc-stoneCyl)" top="#F6E6D2"/>
    <Cone P={P} x={0} y={0} r={38} z={z + 214} h={84} fill="url(#pc-roof)"/>
    {(() => { const [fx, fy] = pr(P, 0, 0, z + 298), fl = Math.sin(f * 0.2) * 5;
      return <g><line x1={fx} y1={fy} x2={fx} y2={fy - 34} stroke="#3A2A40" strokeWidth={3}/>
        <path d={`M ${fx} ${fy - 34} Q ${fx + 14} ${fy - 38 + fl} ${fx + 30} ${fy - 31 - fl * 0.5} L ${fx + 28} ${fy - 20} Q ${fx + 14} ${fy - 24 + fl} ${fx} ${fy - 20} Z`} fill="#FF5A4A"/></g>; })()}
  </g>});
  parts.sort((a, b) => a.d - b.d);
  return <>{parts.map((p) => p.el)}</>;
};

// ---------- Moment 1: the floating island, orbiting slowly ----------
const Moment1: React.FC<{f: number}> = ({f}) => {
  const p = lin(f, 0, M1, 0, 1, inOut);
  const P: Cam = {th: ((20 + 13 * p) * Math.PI) / 180, S: 0.98 + 0.16 * p, cx: 960, cy: 506 + 10 * p};
  const R = 420, I = 190, Wz = -30;
  const A = -250, copies = [-340, -160, -70], BX = 300, SY = 336;
  const bob = Math.sin(f * 0.05) * 4;
  const P2 = {...P, cy: P.cy + bob};
  // Ground pieces first (back to front), then everything standing on them (back to front).
  const ground: {d: number; el: React.ReactNode}[] = [], items: {d: number; el: React.ReactNode}[] = [];
  const gadd = (d: number, el: React.ReactNode) => ground.push({d, el});
  const add = (d: number, el: React.ReactNode) => items.push({d, el});
  gadd(depth(P2, 0, -360), <Box key="back" P={P2} b={[-R, R, -R, -300, Wz, 0]} color="#B87A5E" top="#7CCB7A" lip="#6DBF6E"/>);
  gadd(depth(P2, -360, 0), <Box key="left" P={P2} b={[-R, -300, -300, 300, Wz, 0]} color="#B87A5E" top="#7CCB7A" lip="#6DBF6E"/>);
  gadd(depth(P2, 0, 0) - 50, <Box key="island" P={P2} b={[-I, I, -I, I, Wz, 10]} color="#B87A5E" top="#86D27E" lip="#6DBF6E"/>);
  gadd(depth(P2, 0, 0) - 40, <Box key="hill" P={P2} b={[-120, 120, -120, 120, 10, 34]} color="#78C474" top="#93DA86"/>);
  add(depth(P2, 0, 0) - 30, <CastleC key="castle" P={P2} f={f} z={34}/>);
  gadd(depth(P2, 360, 0), <Box key="right" P={P2} b={[300, R, -300, 300, Wz, 0]} color="#B87A5E" top="#7CCB7A" lip="#6DBF6E"/>);
  gadd(depth(P2, 0, 360), <g key="front">
    <Box P={P2} b={[-R, R, 300, R, Wz, 0]} color="#B87A5E" top="#7CCB7A" lip="#6DBF6E"/>
    <polygon points={pts([pr(P2, -R, 386, 0.5), pr(P2, R, 386, 0.5), pr(P2, R, 408, 0.5), pr(P2, -R, 408, 0.5)])} fill="#F2D29C"/>
  </g>);
  [[-350, -370], [-270, -350], [250, -365], [350, -350], [-370, -160], [-360, 120], [365, -180], [362, 150]].forEach(([x, y], i) =>
    add(depth(P2, x, y) + 1, <Tree key={"tr" + i} P={P2} x={x} y={y}/>));
  // shops on the front strip: A and its copies (spring out from A), B alone
  add(depth(P2, A, SY) + 2, <ShopC key="A" P={P2} x={A} y={SY} awn="#FF6B5A" g={spr(f, B1.shops, 12, 140)}/>);
  copies.forEach((cx, i) => {
    const st = B1.copy[i], s = spr(f, st, 12, 130);
    const x = A + (cx - A) * Math.min(1, s);
    add(depth(P2, x, SY) + 2, <ShopC key={"c" + i} P={P2} x={x} y={SY} awn="#E98A80" g={s}/>);
  });
  add(depth(P2, BX, SY) + 2, <ShopC key="B" P={P2} x={BX} y={SY} awn="#2FB3A6" g={spr(f, B1.shops + 8, 12, 140)}/>);
  ground.sort((a, b) => a.d - b.d); items.sort((a, b) => a.d - b.d);
  // water: the slab top inside the ring, with drifting ripple dashes and a glow when MOAT lands
  const ripples = particles("cw", 60);
  const moatK = lin(f, B1.moat, B1.moat + 26, 0, 1);
  const inRing = (x: number, y: number) => Math.max(Math.abs(x), Math.abs(y)) > I + 8 && Math.max(Math.abs(x), Math.abs(y)) < 300 - 8;
  const [mx, my] = pr(P2, 245, -40, Wz);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
        <Backdrop f={f}/>
        {(() => { const [sx, sy] = pr(P, 0, 0, -260); return <ellipse cx={sx} cy={sy + 40} rx={620 * P.S} ry={140 * P.S} fill="url(#pc-shadow)"/>; })()}
        <Box P={P2} b={[-R, R, -R, R, -150, Wz]} color="#A9705A" top="#3FC1CF" strata/>
        {(() => { const c = [pr(P2, -300, -300, Wz), pr(P2, 300, -300, Wz), pr(P2, 300, 300, Wz), pr(P2, -300, 300, Wz)];
          return <polygon points={pts(c)} fill="#47CAD6" opacity={0.6 + 0.35 * moatK}/>; })()}
        {ripples.map((q, i) => {
          const x = -295 + q.x * 590, y = -295 + q.y * 590 + ((f * 0.6 + q.p * 40) % 40) - 20;
          if (!inRing(x, y)) return null;
          const a = pr(P2, x - 12, y, Wz), b = pr(P2, x + 12, y, Wz);
          return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#E6FDFF" strokeWidth={2.5} strokeLinecap="round" opacity={0.25 + 0.5 * Math.max(0, Math.sin(f * 0.1 + q.p * 3))}/>;
        })}
        {moatK > 0 ? <ellipse cx={mx} cy={my} rx={260 * P2.S * moatK} ry={90 * P2.S * moatK} fill="url(#pc-wglow)" opacity={moatK}/> : null}
        {ground.map((it) => it.el)}
        {items.map((it) => it.el)}
        {f >= B1.alone ? (() => { const [bx, by] = pr(P2, BX, SY, 40); return <circle cx={bx} cy={by} r={120 * P2.S} fill="url(#pc-glow)" opacity={lin(f, B1.alone, B1.alone + 20, 0, 0.55)}/>; })() : null}
        <Fireflies f={f} seed="cff1"/>
      </svg>
      {f >= B1.moat ? <MBlur f={f} render={(t) => (
        <div style={{position: "absolute", left: mx, top: my - 10, transform: "translate(-50%, -50%)", display: "flex", gap: 4}}>
          {"MOAT".split("").map((ch, i) => {
            const s = spr(t, B1.moat + i * 4, 11, 150);
            return <span key={i} style={{display: "inline-block", fontFamily: FONT, fontWeight: 800, fontSize: 96, color: "#FFFFFF", letterSpacing: 10,
              transform: `translateY(${(1 - s) * 60}px) scale(${0.7 + 0.3 * s})`, opacity: Math.min(1, s * 1.8),
              textShadow: "0 0 24px rgba(90,240,255,0.85), 0 8px 24px rgba(20,10,60,0.6)"}}>{ch}</span>;
          })}
        </div>)}/> : null}
      {/* zoom-through transition into moment 2 */}
      {f > 220 ? <AbsoluteFill style={{background: "#2A2560", opacity: lin(f, 220, M1, 0, 1, inOut)}}/> : null}
    </AbsoluteFill>
  );
};

// ---------- Moment 2: two coin towers on a floating disc ----------
const KZ = 8, CRAD = 64;
const stackZ = (t: number, start: number, v: number) => v * KZ * lin(t, start, start + 34, 0, 1, outQuint);
const CoinTower: React.FC<{P: Cam; x: number; y: number; z0: number; h: number}> = ({P, x, y, z0, h}) => {
  if (h < 0.5) return null;
  const [X0, Y0] = pr(P, x, y, z0), [X1, Y1] = pr(P, x, y, z0 + h), rx = P.S * CRAD, ry = rx * SPH, n = Math.floor(h / KZ);
  return <g>
    <path d={`M ${X1 - rx} ${Y1} L ${X0 - rx} ${Y0} A ${rx} ${ry} 0 0 0 ${X0 + rx} ${Y0} L ${X1 + rx} ${Y1} Z`} fill="url(#pc-gold)"/>
    {Array.from({length: n}).map((_, i) => { const [, Y] = pr(P, x, y, z0 + (i + 1) * KZ); if (Y <= Y1 + 2) return null;
      return <path key={i} d={`M ${X0 - rx} ${Y} A ${rx} ${ry} 0 0 0 ${X0 + rx} ${Y}`} fill="none" stroke="#7A4A2A" strokeWidth={1.4} opacity={0.4}/>; })}
    <ellipse cx={X1} cy={Y1} rx={rx} ry={ry} fill="url(#pc-goldTop)"/>
    <ellipse cx={X1} cy={Y1} rx={rx - 9} ry={ry - 3} fill="none" stroke="#C98A2A" strokeWidth={2} opacity={0.6}/>
  </g>;
};
const Moment2: React.FC<{f: number}> = ({f}) => {
  const p = lin(f, 0, 240, 0, 1, inOut);
  const P: Cam = {th: ((26 + 8 * p) * Math.PI) / 180, S: 1.12 + 0.06 * p, cx: 960, cy: 700};
  const bob = Math.sin(f * 0.05) * 3, P2 = {...P, cy: P.cy + bob};
  const th0 = (30 * Math.PI) / 180, u = 215;
  const G = {x: -u * Math.cos(th0), y: u * Math.sin(th0)}, Rv = {x: u * Math.cos(th0), y: -u * Math.sin(th0)};
  const PZ = 34, gz = NUM.geico * KZ, rz = NUM.rivals * KZ;
  const fill = lin(f, B2.fill, B2.fill + 26, 0, 1, inOut), drain = lin(f, B2.drain, B2.drain + 30, 0, 1, inOut), ring = lin(f, B2.ring, B2.ring + 34, 0, 1, outQuint);
  const wz = gz + (rz - gz - 2) * fill * (1 - drain);
  const [gX, gY] = pr(P2, G.x, G.y, PZ), [rX, rY] = pr(P2, Rv.x, Rv.y, PZ);
  const [, gTopY] = pr(P2, G.x, G.y, PZ + stackZ(f, B2.geico, NUM.geico)), [, rTopY] = pr(P2, Rv.x, Rv.y, PZ + stackZ(f, B2.rivals, NUM.rivals));
  const [, gFullY] = pr(P2, G.x, G.y, PZ + gz), [, rFullY] = pr(P2, Rv.x, Rv.y, PZ + rz);
  const plinth = (c: {x: number; y: number}, k: string) => <Box key={k} P={P2} b={[c.x - 86, c.x + 86, c.y - 86, c.y + 86, 0, PZ]} color="#EADBCB"/>;
  const ringEl = ring > 0 ? (() => {
    const [cx, cy] = pr(P2, G.x, G.y, 0.5), r = (120 + 80 * ring) * P2.S;
    return <g>
      <ellipse cx={cx} cy={cy} rx={r + 8} ry={(r + 8) * SPH} fill="#E8C98E"/>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * SPH} fill="#3FC1CF"/>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * SPH} fill="url(#pc-wglow)" opacity={0.8}/>
      {particles("cring", 16).map((q, i) => { const a = q.p, rr = r * (0.75 + 0.2 * q.r); return <line key={i} x1={cx + Math.cos(a) * rr - 10} y1={cy + Math.sin(a) * rr * SPH} x2={cx + Math.cos(a) * rr + 10} y2={cy + Math.sin(a) * rr * SPH} stroke="#E6FDFF" strokeWidth={2.5} strokeLinecap="round" opacity={ring * (0.3 + 0.6 * Math.max(0, Math.sin(f * 0.1 + q.p * 3)))}/>; })}
    </g>;
  })() : null;
  const towers = [
    {d: depth(P2, G.x, G.y), el: <g key="g">{plinth(G, "pg")}<CoinTower P={P2} x={G.x} y={G.y} z0={PZ} h={stackZ(f, B2.geico, NUM.geico)}/></g>},
    {d: depth(P2, Rv.x, Rv.y), el: <g key="r">{plinth(Rv, "pr")}<CoinTower P={P2} x={Rv.x} y={Rv.y} z0={PZ} h={stackZ(f, B2.rivals, NUM.rivals)}/></g>},
  ].sort((a, b) => a.d - b.d);
  const [lx1, ly] = pr(P2, Rv.x, Rv.y, PZ + rz), [lx0, ly0] = pr(P2, G.x, G.y, PZ + rz);
  const lineK = lin(f, B2.line, B2.line + 16, 0, 1);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
        <Backdrop f={f + 240}/>
        {(() => { const [sx, sy] = pr(P, 0, 0, -200); return <ellipse cx={sx} cy={sy + 30} rx={600 * P.S} ry={120 * P.S} fill="url(#pc-shadow)"/>; })()}
        <Cyl P={P2} x={0} y={0} r={430} z0={-70} z1={0} side="url(#pc-diskSide)" top="url(#pc-diskTop)"/>
        {(() => { const [cx, cy] = pr(P2, 0, 0, 0); const r = 430 * P2.S; return <ellipse cx={cx} cy={cy} rx={r - 3} ry={(r - 3) * SPH} fill="none" stroke="#C8F5B0" strokeWidth={3} opacity={0.6}/>; })()}
        {[[-150, -330], [60, -360], [340, -40], [-330, -120]].map(([x, y], i) => <Tree key={i} P={P2} x={x} y={y} k={0.9}/>)}
        {ringEl}
        {towers.map((t) => t.el)}
        {f >= B2.line ? <line x1={lx1 + CRAD * P2.S} y1={ly} x2={lx1 + CRAD * P2.S + (lx0 - CRAD * P2.S - 30 - lx1 - CRAD * P2.S) * lineK} y2={ly + (ly0 - ly) * lineK}
          stroke="#FFFFFF" strokeWidth={4} strokeDasharray="14 12" strokeLinecap="round" opacity={0.9 * (1 - drain)}/> : null}
        {f >= B2.fill ? (() => {
          const [, Y0] = pr(P2, G.x, G.y, PZ + gz), [, Yw] = pr(P2, G.x, G.y, PZ + wz), [, Yr] = pr(P2, G.x, G.y, PZ + rz), rx = CRAD * P2.S, ry = rx * SPH;
          return <g>
            <g opacity={1 - drain}>
              <path d={`M ${gX - rx} ${Yr} L ${gX - rx} ${Y0} M ${gX + rx} ${Yr} L ${gX + rx} ${Y0}`} stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={2}/>
              <ellipse cx={gX} cy={Yr} rx={rx} ry={ry} fill="#FFFFFF" fillOpacity={0.08} stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={2}/>
            </g>
            {wz > gz + 1 ? <g>
              <path d={`M ${gX - rx} ${Yw} L ${gX - rx} ${Y0} A ${rx} ${ry} 0 0 0 ${gX + rx} ${Y0} L ${gX + rx} ${Yw} Z`} fill="url(#pc-wcol)" opacity={0.95}/>
              <ellipse cx={gX} cy={Yw} rx={rx} ry={ry} fill="#9FF2FA"/>
              <ellipse cx={gX} cy={(Yw + Y0) / 2} rx={rx * 1.6} ry={(Y0 - Yw) * 0.9 + 20} fill="url(#pc-wglow)" opacity={0.6}/>
            </g> : null}
            {drain > 0 && drain < 1 ? [-1, 1].map((sd) => <path key={sd} d={`M ${gX + sd * (rx - 6)} ${Yw + 4} Q ${gX + sd * (rx + 40)} ${Yw + 40} ${gX + sd * (rx + 70)} ${gY + 50}`} stroke="#5FE0EA" strokeWidth={13 * (1 - drain * 0.5)} fill="none" strokeLinecap="round" opacity={0.9}/>) : null}
          </g>;
        })() : null}
        {f >= B2.ring + 22 ? (() => { const s = spr(f, B2.ring + 22, 10, 160), fl = Math.sin(f * 0.2) * 6;
          return <g transform={`translate(${gX} ${gFullY}) scale(${s})`}><line x1={0} y1={0} x2={0} y2={-84} stroke="#3A2A40" strokeWidth={5}/>
            <path d={`M 0 -84 Q 26 ${-90 + fl} 54 ${-78 - fl} L 50 ${-56 - fl} Q 26 ${-62 + fl} 0 -56 Z`} fill="#FF5A4A"/></g>; })() : null}
        <Fireflies f={f + 99} seed="cff2" n={18}/>
      </svg>
      <Label f={f} start={B2.geico - 4} x={gX} y={gY + 165} text="GEICO" size={40} color="#2A2156" weight={800} bg="rgba(255,248,236,0.94)" spacing={2}/>
      <Label f={f} start={B2.rivals - 4} x={rX} y={rY + 165} text="Many rivals" size={40} color="#2A2156" weight={800} bg="rgba(255,248,236,0.94)" spacing={1}/>
      <MBlur f={f} render={(t) => {
        if (t < B2.geico) return null;
        const [, ty] = pr(P2, G.x, G.y, PZ + stackZ(t, B2.geico, NUM.geico)), mv = lin(t, B2.fill - 8, B2.fill + 14, 0, 1, inOut);
        const s = spr(t, B2.geico, 12, 140), v = NUM.geico * lin(t, B2.geico, B2.geico + 34, 0, 1, outQuint);
        return <div style={{position: "absolute", left: gX - mv * 270, top: ty - 72 + mv * 92, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * s})`, fontFamily: FONT, fontWeight: 800, fontSize: 88,
          color: "#FFFFFF", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textShadow: "0 0 24px rgba(255,200,90,0.7), 0 8px 24px rgba(20,10,60,0.55)", opacity: Math.min(1, s * 2), lineHeight: 1}}>₹{v.toFixed(2)}</div>;
      }}/>
      <MBlur f={f} render={(t) => {
        if (t < B2.rivals) return null;
        const [, ty] = pr(P2, Rv.x, Rv.y, PZ + stackZ(t, B2.rivals, NUM.rivals)), s = spr(t, B2.rivals, 12, 140), v = NUM.rivals * lin(t, B2.rivals, B2.rivals + 34, 0, 1, outQuint);
        return <div style={{position: "absolute", left: rX, top: ty - 72, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * s})`, fontFamily: FONT, fontWeight: 800, fontSize: 88,
          color: "#FFFFFF", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", textShadow: "0 0 24px rgba(255,200,90,0.7), 0 8px 24px rgba(20,10,60,0.55)", opacity: Math.min(1, s * 2), lineHeight: 1}}>₹{v.toFixed(2)}</div>;
      }}/>
      <AbsoluteFill style={{transform: `translate(${-drain * 454}px, ${drain * (gY - 40 - (gFullY + rFullY) / 2 - 6)}px) scale(${1 - drain * 0.15})`, transformOrigin: `${gX + 100}px ${(gFullY + rFullY) / 2}px`}}>
        <KineticNumber f={f} start={B2.gap} to={NUM.gap} x={gX + 84} y={(gFullY + rFullY) / 2 + 6} size={96} color="#B8FAFF" align="left" dur={18}
          shadow="0 0 26px rgba(80,230,255,0.75), 0 8px 24px rgba(20,10,60,0.6)"/>
      </AbsoluteFill>
      <Label f={f} start={B2.ring + 16} x={gX - 290} y={gY + 50} text="Moat" size={44} color="#FFFFFF" weight={800} bg="#2A9DB0" spacing={3}/>
      <Label f={f} start={B2.paid} x={960} y={78} text="Of every" size={36} color="#FFE9D2" weight={600} spacing={1}/>
      <KineticNumber f={f} start={B2.paid + 4} to={NUM.paid} from={NUM.paid} x={960} y={150} size={92} color="#FFFFFF" dur={1} shadow="0 0 26px rgba(255,190,120,0.6)"/>
      {f < 16 ? <AbsoluteFill style={{background: "#2A2560", opacity: lin(f, 0, 16, 1, 0, inOut)}}/> : null}
    </AbsoluteFill>
  );
};

export const PremiumC: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: "#2A2560", overflow: "hidden"}}>
      <Defs/>
      {frame < M1 ? <Moment1 f={frame}/> : <Moment2 f={frame - M1}/>}
      <Vignette strength={0.4} color="16,10,40"/>
      <Grain f={frame} opacity={0.06}/>
    </AbsoluteFill>
  );
};

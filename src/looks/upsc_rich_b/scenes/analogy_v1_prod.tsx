// GEO-04 Part 1, builder V1: `eruption-products`. mode "list": one eruption, five zones that light up in turn (lava, broken rock, bombs, ash, gas).
// mode "spread": bombs fall close, fine ash drifts far downwind, a tall white steam plume rises.
import React from "react";
import {Hills, type AP, type Pt} from "./analogy_kit";
import {Leader, Puffs, Speckle, coneY, curve, eo, eio, mixn, mkLabels, poly, prog, rnd, sampleY} from "./analogy_v1_kit";

type Cone = {cx: number; base: number; H: number; hw: number};
const cy = (c: Cone, x: number) => coneY(x, c.cx, c.base, c.H, c.hw, 30, 24, 1.7);

const Defs: React.FC = () => (
  <defs>
    <linearGradient id="v1e-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#52618a"/><stop offset="0.45" stopColor="#a98a95"/><stop offset="0.8" stopColor="#efbd8a"/><stop offset="1" stopColor="#f6d3a0"/></linearGradient>
    <linearGradient id="v1e-sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6f95bd"/><stop offset="0.6" stopColor="#bcd0d8"/><stop offset="1" stopColor="#f2e0bd"/></linearGradient>
    <linearGradient id="v1e-cone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7d6a62"/><stop offset="0.5" stopColor="#5b4a47"/><stop offset="1" stopColor="#32282a"/></linearGradient>
    <linearGradient id="v1e-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6f6a4a"/><stop offset="1" stopColor="#3a3a2c"/></linearGradient>
    <radialGradient id="v1e-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffb25a" stopOpacity="0.95"/><stop offset="0.45" stopColor="#ff6a2a" stopOpacity="0.45"/><stop offset="1" stopColor="#d03a14" stopOpacity="0"/></radialGradient>
    <radialGradient id="v1e-spot" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#fff2b8" stopOpacity="0.5"/><stop offset="1" stopColor="#ffd25a" stopOpacity="0"/></radialGradient>
    <filter id="v1e-b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="v1e-b14" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>
);

/** the mountain: broad composite cone, lit on the left, scree and pale ash dusting, a ground plain */
const Mountain: React.FC<{c: Cone; id: string; sky?: boolean}> = ({c, id}) => {
  const pts = sampleY((x) => cy(c, x), c.cx - c.hw, c.cx + c.hw, 6), d = `${poly(pts)} L${c.cx + c.hw},${c.base + 2} L${c.cx - c.hw},${c.base + 2} Z`;
  return (
    <g>
      <rect x={-20} y={c.base - 2} width={1960} height={1100 - c.base} fill="url(#v1e-ground)"/>
      <path d={d} fill="url(#v1e-cone)"/>
      <clipPath id={`${id}-cl`}><path d={d}/></clipPath>
      <g clipPath={`url(#${id}-cl)`}>
        {Array.from({length: 11}).map((_, k) => <path key={k} d={`M${c.cx - 12 + (k - 5) * 8},${c.base - c.H + 40} Q${c.cx + (k - 5) * 60},${c.base - c.H * 0.4} ${c.cx + (k - 5) * 100},${c.base}`} stroke={k % 2 ? "#2a1f20" : "#9c8478"} strokeWidth={3 + (k % 3)} fill="none" opacity={0.28}/>)}
        <Speckle x={c.cx - c.hw} y={c.base - c.H} w={c.hw * 2} h={c.H} n={260} seed={5} cols={["#1c1416", "#c7b8a8", "#6d5a52"]} op={0.4} rmax={3.6}/>
        <rect x={c.cx - c.hw} y={c.base - c.H} width={c.hw * 2} height={c.H} fill="#f6e6c6" opacity={0.07}/>
      </g>
      <path d={poly(pts.map(([x, y]) => [x, y - 2] as [number, number]))} fill="none" stroke="#b69a8a" strokeWidth={3} opacity={0.7}/>
      {[[-1.2, 0.55], [-0.8, 0.9], [1.0, 0.7], [1.45, 0.45]].map(([k, s], i) => <ellipse key={i} cx={c.cx + k * c.hw * 0.82} cy={c.base + 2} rx={90 * s} ry={14 * s} fill="#2a2a1e" opacity={0.35}/>)}
    </g>
  );
};

type Bomb = {x0: number; y0: number; xl: number; h: number; T: number; ph: number; s: number};
const BombF: React.FC<{b: Bomb; c: Cone; f: number; i: number; op?: number}> = ({b, c, f, i, op = 1}) => {
  const P = b.T + 60, t = (f + b.ph) % P, u = Math.min(1, t / b.T), yl = cy(c, b.xl) - 6;
  const x = mixn(b.x0, b.xl, u), y = mixn(b.y0, yl, u) - 4 * b.h * u * (1 - u), land = t > b.T;
  const fade = land ? Math.max(0, 1 - (t - b.T) / 60) : 1, hot = land ? 0.35 + 0.65 * fade : 1;
  const trail = [1, 2, 3, 4, 5].map((k) => { const uu = Math.max(0, u - k * 0.03); return [mixn(b.x0, b.xl, uu), mixn(b.y0, yl, uu) - 4 * b.h * uu * (1 - uu)] as Pt; });
  const sz = b.s, ang = (f * 3 + i * 40) * (land ? 0 : 1);
  const shape = Array.from({length: 9}).map((_, k) => { const a = (k / 9) * Math.PI * 2, r = sz * (0.78 + 0.3 * rnd(i * 9 + k, 2)); return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r * 0.88).toFixed(1)}`; }).join(" ");
  return (
    <g opacity={op}>
      {!land && trail.map((q, k) => <circle key={k} cx={q[0]} cy={q[1]} r={sz * (0.5 - k * 0.07)} fill="#ff8a2c" opacity={0.5 - k * 0.09}/>)}
      <g transform={`translate(${x} ${y}) rotate(${ang})`} opacity={land ? 0.4 + 0.6 * fade : 1}>
        <circle r={sz * 1.9} fill="url(#v1e-glow)" opacity={0.8 * hot}/>
        <polygon points={shape} fill="#321a15" stroke="#ff7a2a" strokeWidth={2.6 * hot} strokeLinejoin="round"/>
        <path d={`M${-sz * 0.5},${-sz * 0.1} L${sz * 0.1},${sz * 0.3} M${sz * 0.1},${-sz * 0.5} L${sz * 0.4},${sz * 0.1}`} stroke="#ffb04a" strokeWidth={2.2} opacity={hot} fill="none"/>
      </g>
    </g>
  );
};

/** angular rock fragments tumbling down and settling */
const Fragments: React.FC<{c: Cone; f: number; x0: number; x1: number; n: number; seed: number; dark?: boolean}> = ({c, f, x0, x1, n, seed}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const u = (f * 0.007 + i / n + rnd(i, seed) * 0.1) % 1, xa = mixn(x0, x1, rnd(i, seed + 1)), x = xa + u * 90 + Math.sin(i) * 20;
      const y = Math.min(cy(c, x) - 3, cy(c, xa) - 60 + u * 240 + 120 * u * u), sz = 5 + rnd(i, seed + 3) * 11, a = u * 220 + i * 31;
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${a})`} opacity={Math.min(1, u * 8) * (1 - Math.max(0, u - 0.85) * 5)}>
          <polygon points={`${-sz},${-sz * 0.4} ${-sz * 0.2},${-sz} ${sz},${-sz * 0.3} ${sz * 0.6},${sz * 0.8} ${-sz * 0.7},${sz * 0.7}`} fill={i % 3 ? "#6d5a52" : "#a59487"} stroke="#241a1a" strokeWidth={1.4}/>
          <polygon points={`${-sz * 0.2},${-sz} ${sz},${-sz * 0.3} ${sz * 0.3},0 ${-sz * 0.4},${-sz * 0.4}`} fill="#d8c8b8" opacity={0.35}/>
        </g>
      );
    })}
  </g>
);

const LavaFlow: React.FC<{c: Cone; f: number; p?: number; x1: number; w?: number}> = ({c, f, p = 1, x1, w = 1}) => {
  const all = sampleY((x) => cy(c, x) - 2, c.cx + 30, x1, 7), n = Math.max(2, Math.floor(all.length * p)), pts = all.slice(0, n);
  return (
    <g>
      <path d={poly(pts)} stroke="#ff5a1c" strokeWidth={34 * w} fill="none" strokeLinecap="round" opacity={0.45} filter="url(#v1e-b14)"/>
      {pts.slice(0, -1).map((a, i) => <path key={`k${i}`} d={`M${a[0]},${a[1]} L${pts[i + 1][0]},${pts[i + 1][1]}`} stroke="#2c100c" strokeWidth={(10 + (i / pts.length) * 16) * w} strokeLinecap="round" fill="none"/>)}
      {pts.slice(0, -1).map((a, i) => <path key={`r${i}`} d={`M${a[0]},${a[1] - 1} L${pts[i + 1][0]},${pts[i + 1][1] - 1}`} stroke="#e23e16" strokeWidth={(7 + (i / pts.length) * 12) * w} strokeLinecap="round" fill="none"/>)}
      <path d={poly(pts.map(([x, y]) => [x, y - 1] as [number, number]))} stroke="#ffd070" strokeWidth={4 * w} fill="none" strokeLinecap="round" strokeDasharray="12 36" strokeDashoffset={-f * 1.8}/>
    </g>
  );
};

// ---- list ----------------------------------------------------------------------------------------------------------------------
const ZONES: {k: string; x: number; y: number; rx: number; ry: number; rot: number; ly: number}[] = [
  {k: "p1", x: 780, y: 690, rx: 215, ry: 66, rot: 36, ly: 706},
  {k: "p2", x: 800, y: 590, rx: 150, ry: 96, rot: 28, ly: 566},
  {k: "p3", x: 770, y: 430, rx: 230, ry: 130, rot: -18, ly: 426},
  {k: "p4", x: 690, y: 240, rx: 250, ry: 210, rot: -28, ly: 286},
  {k: "p5", x: 1020, y: 150, rx: 230, ry: 70, rot: -6, ly: 136},
];

export const ListArt: React.FC<AP> = ({f, dur, at}) => {
  const c: Cone = {cx: 540, base: 850, H: 360, hw: 540};
  const keys = ZONES.map((z) => at(z.k)), crater = cy(c, c.cx);
  const bombs: Bomb[] = [[0, 600, 80, 70, 0], [1, 760, 150, 90, 20], [2, 840, 190, 100, 40], [3, 960, 120, 84, 10], [4, 700, 120, 78, 55], [5, 910, 170, 92, 33], [6, 820, 220, 96, 66], [7, 680, 190, 84, 80]]
    .map(([i, xl, h, T, ph]) => ({x0: c.cx + 6, y0: crater - 6, xl, h: h + 60, T, ph: ph * 3 + i * 17, s: 15 + (i % 3) * 7}));
  const lit = (i: number) => { const a = eo(prog(f, keys[i], 14)), nextAt = i < 4 ? Math.min(...keys.slice(i + 1)) : 1e9; return {a, cur: a * (1 - eo(prog(f, nextAt, 20)) * 0.62)}; };
  return (
    <g>
      <Defs/>
      <rect width={1920} height={1080} fill="url(#v1e-sky)"/>
      <ellipse cx={c.cx} cy={crater - 20} rx={420} ry={260} fill="url(#v1e-glow)" opacity={0.45}/>
      {/* gases: pale, translucent, high and to the right */}
      <Puffs f={f} n={14} x0={c.cx + 20} y0={crater - 60} rise={330} drift={600} r0={40} r1={100} speed={0.0034} seed={14} spread={120} cols={["#ffffff", "#f6f4f1", "#e4e1e6"]} op={0.62} wob={22}/>
      {/* ash and dust: big dark billows */}
      <Puffs f={f} n={22} x0={c.cx} y0={crater - 20} rise={320} drift={320} r0={40} r1={130} speed={0.0042} seed={3} spread={110} cols={["#a79a92", "#5f5658", "#2a2427"]} op={0.95} wob={16}/>
      <Hills id="v1ep-h1" base={640} amp={80} top="#8a789a" bottom="#b58e98" seed={11} wl={560} bottomY={860}/>
      <Hills id="v1ep-h2" base={720} amp={60} top="#6b5a72" bottom="#8a6a70" seed={17} wl={420} bottomY={860}/>
      <Mountain c={c} id="v1ep"/>
      <ellipse cx={c.cx} cy={crater - 4} rx={64} ry={14} fill="#ffcf72" opacity={0.9} filter="url(#v1e-b6)"/>
      <LavaFlow c={c} f={f} x1={c.cx + 430} w={1.9}/>
      <Fragments c={c} f={f} x0={c.cx + 120} x1={c.cx + 360} n={34} seed={9}/>
      {bombs.map((b, i) => <BombF key={i} b={b} c={c} f={f} i={i}/>)}
      {/* zone spotlights */}
      {ZONES.map((z, i) => {
        const {a, cur} = lit(i), pul = 0.85 + 0.15 * Math.sin(f / 7 + i);
        if (a <= 0.01) return null;
        return (
          <g key={z.k} opacity={cur} transform={`rotate(${z.rot} ${z.x} ${z.y})`}>
            <ellipse cx={z.x} cy={z.y} rx={z.rx * (1.1 - 0.1 * a)} ry={z.ry * (1.1 - 0.1 * a)} fill="url(#v1e-spot)" opacity={pul}/>
            <ellipse cx={z.x} cy={z.y} rx={z.rx} ry={z.ry} fill="none" stroke="#fff1b8" strokeWidth={5} strokeDasharray="22 14" strokeDashoffset={-f * 0.6} opacity={0.95}/>
          </g>
        );
      })}
      {ZONES.map((z, i) => <Leader key={z.k} pts={[[1240, z.ly + 40], [z.x + z.rx * 0.8, z.y]]} f={f} at={keys[i]} col="#fff1c8" w={3}/>)}
    </g>
  );
};

// ---- spread --------------------------------------------------------------------------------------------------------------------
export const SpreadArt: React.FC<AP> = ({f, dur, at}) => {
  const c: Cone = {cx: 640, base: 790, H: 330, hw: 470}, crater = cy(c, c.cx);
  const bombs: Bomb[] = [[0, 520, 70, 64, 0], [1, 440, 100, 60, 18], [2, 780, 90, 74, 41], [3, 880, 60, 80, 7], [4, 360, 70, 62, 52], [5, 700, 120, 70, 29]]
    .map(([i, xl, h, T, ph]) => ({x0: c.cx + 4, y0: crater - 6, xl, h: h + 40, T, ph: ph * 3 + i * 21, s: 14 + (i % 3) * 7}));
  const bn = eo(prog(f, at("bn"), 22)), af = eo(prog(f, at("af"), 22)), wv = eo(prog(f, at("wv"), 22));
  const hot = (a: number) => (a > 0 ? 0.8 + 0.2 * Math.sin(f / 8) : 0);
  const farX = 1790;
  return (
    <g>
      <Defs/>
      <rect width={1920} height={1080} fill="url(#v1e-sky2)"/>
      <ellipse cx={c.cx} cy={crater} rx={300} ry={150} fill="url(#v1e-glow)" opacity={0.5}/>
      {/* far ash: thin and pale, carried the farthest */}
      <Puffs f={f} n={26} x0={c.cx + 120} y0={crater - 190} rise={-30} drift={1180} r0={44} r1={120} speed={0.0016} seed={21} spread={70} cols={["#c9c1bc", "#9d948f", "#75706d"]} op={0.55} wob={26} curveK={1}/>
      <Puffs f={f} n={20} x0={c.cx + 60} y0={crater - 120} rise={140} drift={760} r0={40} r1={96} speed={0.0022} seed={22} spread={80} cols={["#a99f98", "#6d6564", "#363031"]} op={0.85} wob={20} curveK={1.1}/>
      {/* fine ash settling downwind: faint slanting streaks */}
      {Array.from({length: 46}).map((_, i) => {
        const u = (f * 0.005 + i / 46) % 1, x = 900 + rnd(i, 2) * 900, y0 = 330 + rnd(i, 3) * 90;
        return <path key={i} d={`M${x + u * 40},${y0 + u * (cy(c, 2000) - y0 - 40)} l12,26`} stroke="#7c716d" strokeWidth={2.4} strokeLinecap="round" opacity={0.5 * Math.sin(Math.PI * u) * (0.4 + (x - 900) / 1500)}/>;
      })}
      {/* tall white steam plume */}
      <Puffs f={f} n={30} x0={c.cx} y0={crater - 10} rise={520} drift={70} r0={22} r1={80} speed={0.0036} seed={31} spread={34} cols={["#ffffff", "#eef0f2", "#c6ccd6"]} op={1} wob={18}/>
      <Hills id="v1es-h1" base={640} amp={80} top="#9db4c4" bottom="#c4d0cc" seed={12} wl={520} bottomY={820}/>
      <Mountain c={c} id="v1es"/>
      <ellipse cx={c.cx} cy={crater - 2} rx={56} ry={12} fill="#ffcf72" opacity={0.85} filter="url(#v1e-b6)"/>
      <LavaFlow c={c} f={f} x1={c.cx + 250} w={0.8}/>
      {bombs.map((b, i) => <BombF key={i} b={b} c={c} f={f} i={i}/>)}
      {/* near and far brackets under the ground line */}
      <g opacity={0.95}>
        <g opacity={bn}>
          <path d={`M330,${c.base + 38} L330,${c.base + 52} L${c.cx + 250},${c.base + 52} L${c.cx + 250},${c.base + 38}`} fill="none" stroke="#ffd25a" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={hot(bn)}/>
          <ellipse cx={(330 + c.cx + 250) / 2} cy={c.base + 24} rx={(c.cx + 250 - 330) / 2 + 30} ry={30} fill="url(#v1e-spot)" opacity={0.6}/>
        </g>
        <g opacity={af}>
          <path d={`M${c.cx + 120},${c.base + 88} L${c.cx + 120},${c.base + 102} L${farX},${c.base + 102} L${farX},${c.base + 88}`} fill="none" stroke="#c8d6e8" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={hot(af)}/>
          <path d={`M${farX - 24},${c.base + 92} L${farX},${c.base + 102} L${farX - 24},${c.base + 112}`} fill="none" stroke="#c8d6e8" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      </g>
      <Leader pts={[[330, 420], [500, 620]]} f={f} at={at("bn")} col="#fff0c4"/>
      <Leader pts={[[1560, 540], [1560, 400]]} f={f} at={at("af")} col="#2f3b52"/>
      <Leader pts={[[900, 150], [c.cx + 70, 128]]} f={f} at={at("wv")} col="#2f3b52"/>
      <g opacity={wv * 0}/>
    </g>
  );
};

export const ProdArt: React.FC<AP> = (p) => ((p.spec as any).mode === "spread" ? <SpreadArt {...p}/> : <ListArt {...p}/>);

export const ProdLabels: React.FC<AP> = (p) => {
  const L = (p.spec as any).mode === "spread"
    ? mkLabels({bn: {cx: 330, y: 250, size: 32, maxW: 420, tone: "dark"}, af: {cx: 1560, y: 548, size: 34, maxW: 520, tone: "cool"}, wv: {cx: 1290, y: 80, size: 30, maxW: 700, tone: "cool"}})
    : mkLabels({p1: {cx: 1250, y: 680, size: 36, maxW: 560, tone: "dark", left: true}, p2: {cx: 1250, y: 540, size: 34, maxW: 560, tone: "dark", left: true}, p3: {cx: 1250, y: 400, size: 36, maxW: 560, tone: "dark", left: true},
      p4: {cx: 1250, y: 260, size: 36, maxW: 560, tone: "dark", left: true}, p5: {cx: 1250, y: 110, size: 27, maxW: 560, tone: "dark", left: true}});
  return <L {...p}/>;
};
void curve;
void eio;

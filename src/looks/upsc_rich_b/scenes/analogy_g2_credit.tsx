// ECO-16 Part 3, builder G2: `credit-terms` (b02). A loan agreement on a drafting desk. The lender's side (money, goods, services) and the borrower's side (a promise to pay later) show first,
// then both step aside and four stamped boxes light in turn: interest rate, documents, mode of repayment, collateral (a small house and a tractor with a padlock). Words come from spec labels at(key).
import React from "react";
import {Clock, Padlock, Shade, elabs, FCard, G2Defs, F3Defs, Desk, Stack, E, Z, pop, pulse, prog, eo, rng, SANS, SERIF, W, H} from "./analogy_g2_kit";
import {House} from "./analogy_f1_kit";
import {FlowArrow, type AP} from "./analogy_kit";

const DOC = {x: 660, y: 290, w: 600, h: 600};
const BOX = {ir: {x: 100, y: 290}, dc: {x: 100, y: 610}, mr: {x: 1360, y: 290}, co: {x: 1360, y: 610}} as const;
const BW = 460, BH = 280;
const KEYS = ["ir", "dc", "mr", "co"] as const;
const BAND_Y = {ir: 130, dc: 188, mr: 246, co: 304};

/** a signature scribble that draws itself, local coords */
const Scribble: React.FC<{x: number; y: number; k: number; col: string; seed: number}> = ({x, y, k, col, seed}) => {
  if (k <= 0.002) return null;
  const r = rng(seed * 31 + 5);
  let d = `M${x},${y}`;
  for (let i = 0; i < 4; i++) d += ` q${10 + r() * 6},${-26 - r() * 14} ${20 + r() * 8},${-2 + r() * 8} t${14 + r() * 8},${-6 + r() * 10}`;
  return <path d={d} pathLength={100} fill="none" stroke={col} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100 100" strokeDashoffset={100 * (1 - k)}/>;
};

/** the agreement itself, lying on the desk; the four term lines are highlighted when their box lights */
const Agreement: React.FC<{f: number; at: Record<string, number>}> = ({f, at}) => {
  const a = Z(f, 0, 30), r = rng(7);
  const lines = Array.from({length: 6}, (_, i) => {
    let d = `M60,${130 + i * 58}`, used = 0;
    while (used < 410) { const w = 34 + r() * 70; if (used + w > 480) break; d += ` h${w.toFixed(0)} m16,0`; used += w + 16; }
    return d;
  });
  return (
    <g transform={`translate(${DOC.x + DOC.w / 2} ${DOC.y + DOC.h / 2 + (1 - a) * 60}) rotate(${-1.2 + (1 - a) * 4}) translate(${-DOC.w / 2} ${-DOC.h / 2})`} opacity={a}>
      <rect x={14} y={24} width={DOC.w} height={DOC.h} rx={8} fill="#2a1808" opacity={0.36} filter="url(#e3-glow)"/>
      <rect x={0} y={0} width={DOC.w} height={DOC.h} rx={8} fill="url(#g2-sheet)" stroke="#bda46c" strokeWidth={2}/>
      <path d={`M${DOC.w - 56},${DOC.h} L${DOC.w},${DOC.h - 56} L${DOC.w},${DOC.h} Z`} fill="#e3d3a8" stroke="#bda46c" strokeWidth={1.6}/>
      <path d={`M${DOC.w - 56},${DOC.h} L${DOC.w},${DOC.h - 56}`} stroke="#fff" strokeWidth={2} opacity={0.6}/>
      <rect x={0} y={0} width={DOC.w} height={14} rx={7} fill="#c9822e" opacity={0.85}/>
      <text x={DOC.w / 2} y={66} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={40} letterSpacing={6} fill="#4a2f0a">LOAN AGREEMENT</text>
      <path d={`M60,86 H${DOC.w - 60} M60,94 H${DOC.w - 60}`} stroke="#8a5a20" strokeWidth={2} opacity={0.7}/>
      {/* the term bands, highlighted when the box with the same key lights */}
      {KEYS.map((k) => {
        const u = Z(f, at[k] - 4, 22);
        return <g key={k} opacity={u}><rect x={44} y={BAND_Y[k] - 26} width={(DOC.w - 88) * u} height={42} rx={6} fill="#ffe27a" opacity={0.62}/><rect x={44} y={BAND_Y[k] - 26} width={8} height={42} rx={4} fill="#d8682a"/></g>;
      })}
      {lines.map((d, i) => {
        const k = Z(f, 22 + i * 14, 40);
        return <path key={i} d={d} pathLength={100} fill="none" stroke="#6b5a40" strokeWidth={9} strokeLinecap="round" opacity={0.55} strokeDasharray="100 100" strokeDashoffset={100 * (1 - k)}/>;
      })}
      {/* signature lines */}
      <path d="M50,540 H270 M330,540 H550" stroke="#4a3a24" strokeWidth={2.4}/>
      <text x={50} y={572} fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing={3} fill="#7a6240">LENDER</text>
      <text x={330} y={572} fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing={3} fill="#7a6240">BORROWER</text>
      <Scribble x={64} y={528} k={Z(f, at.ls, 48)} col="#1f3a78" seed={1}/>
      <Scribble x={346} y={528} k={Z(f, at.bp, 48)} col="#7a2a1d" seed={2}/>
      {/* binder clip */}
      <g transform="translate(300 -6)">
        <rect x={-46} y={-4} width={92} height={36} rx={6} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
        <path d="M-30,-4 Q-30,-30 -16,-30 M30,-4 Q30,-30 16,-30" stroke="#6c4a16" strokeWidth={5} fill="none" strokeLinecap="round"/>
        <rect x={-38} y={2} width={76} height={6} rx={3} fill="#fff3c0" opacity={0.55}/>
      </g>
    </g>
  );
};

/** things on the desk that are not part of the picture's claim: an inkwell, a folder, reading glasses */
const DeskDressing: React.FC<{f: number}> = ({f}) => (
  <g>
    <g transform="translate(190 190)">
      <Shade x={0} y={46} rx={70} ry={12} o={0.34}/>
      <path d="M-44,-6 H44 L52,44 Q0,58 -52,44 Z" fill="#2b3a5c" stroke="#141c34" strokeWidth={3}/>
      <path d="M-44,-6 H44" stroke="#8aa0d6" strokeWidth={3} opacity={0.6}/>
      <ellipse cx={0} cy={-6} rx={44} ry={11} fill="#0d1226" stroke="#141c34" strokeWidth={2}/>
      <rect x={-18} y={-24} width={36} height={20} rx={4} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>
      <path d="M-30,10 Q-34,30 -26,40" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.3}/>
      <path d="M26,-8 L96,-86" stroke="#f2f6f8" strokeWidth={4} strokeLinecap="round"/><path d="M26,-8 L96,-86" stroke="#c9d4da" strokeWidth={9} strokeLinecap="round" opacity={0.25}/>
    </g>
    <g transform="translate(1706 196) rotate(8)">
      <Shade x={0} y={52} rx={100} ry={12} o={0.3}/>
      <rect x={-96} y={-40} width={192} height={96} rx={6} fill="#c0603d" stroke="#8c3a22" strokeWidth={3}/>
      <rect x={-96} y={-40} width={78} height={14} rx={4} fill="#d4755a" stroke="#8c3a22" strokeWidth={2}/>
      <rect x={-86} y={-24} width={172} height={14} fill="#f6efe0" stroke="#bda46c" strokeWidth={1.4}/>
      <path d="M-80,10 H80" stroke="#fff" strokeWidth={3} opacity={0.25}/>
    </g>
    <g transform="translate(1520 160) rotate(-10)" opacity={0.95}>
      <ellipse cx={0} cy={22} rx={80} ry={9} fill="#2a1808" opacity={0.28} filter="url(#ak-blur8)"/>
      <circle cx={-38} cy={0} r={26} fill="#fff" opacity={0.18} stroke="#4a3a24" strokeWidth={4}/><circle cx={38} cy={0} r={26} fill="#fff" opacity={0.18} stroke="#4a3a24" strokeWidth={4}/>
      <path d="M-12,-4 Q0,-12 12,-4" stroke="#4a3a24" strokeWidth={4} fill="none"/><path d="M-64,-4 L-96,-16 M64,-4 L96,-16" stroke="#4a3a24" strokeWidth={4} strokeLinecap="round"/>
    </g>
  </g>
);

// ---- the lender's items -----------------------------------------------------------------------------------------------------------
const Crate: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => (
  <g transform={`translate(${x} ${y}) scale(${k})`} opacity={Math.min(1, k * 2)}>
    <Shade x={0} y={8} rx={92} ry={14} o={0.34}/>
    <rect x={-80} y={-96} width={160} height={104} rx={6} fill="#c28a52" stroke="#6e4524" strokeWidth={3}/>
    <rect x={-80} y={-96} width={160} height={22} rx={6} fill="#dcae72" stroke="#6e4524" strokeWidth={2.4}/>
    {[-44, 0, 44].map((dx, i) => <path key={i} d={`M${dx},-74 V8`} stroke="#6e4524" strokeWidth={3.4} opacity={0.6}/>)}
    <path d="M-80,-44 H80" stroke="#6e4524" strokeWidth={3} opacity={0.55}/>
    <path d="M-72,-84 H-30" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.35}/>
    {/* a sack of grain behind */}
    <path d="M-30,-96 Q-38,-150 -8,-158 Q22,-150 28,-96 Z" fill="#e7d6a8" stroke="#8a7440" strokeWidth={2.6}/>
    <path d="M-14,-156 q6,-10 12,0 q6,-10 12,0" stroke="#8a7440" strokeWidth={3} fill="none"/>
    <path d="M-22,-130 q16,12 40,0" stroke="#8a7440" strokeWidth={2} fill="none" opacity={0.6}/>
  </g>
);

const Spanner: React.FC<{x: number; y: number; k: number}> = ({x, y, k}) => (
  <g transform={`translate(${x} ${y}) rotate(-28) scale(${k})`} opacity={Math.min(1, k * 2)}>
    <Shade x={0} y={92} rx={30} ry={8} o={0.3}/>
    <path d="M-12,-92 Q-30,-96 -30,-72 L-14,-60 V-52 L-6,-52 V-60 L10,-72 Q10,-96 -8,-92 L-8,-80 L-4,-80 Z" fill="url(#f2-steel)" stroke="#5a6872" strokeWidth={2.4}/>
    <path d="M-15,-58 V92 Q-15,100 0,100 Q15,100 15,92 V-58 Z" fill="url(#e2-steel)" stroke="#5a6872" strokeWidth={2.6}/>
    <path d="M-8,-50 V88" stroke="#fff" strokeWidth={4} opacity={0.6} strokeLinecap="round"/>
    <circle cx={0} cy={84} r={5} fill="#5a6872"/>
  </g>
);

const Pen: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) rotate(-24)`}>
    <Shade x={30} y={14} rx={110} ry={10} o={0.3}/>
    <path d="M0,0 L40,-9 V9 Z" fill="#f2d9a8" stroke="#6e4524" strokeWidth={2}/>
    <path d="M0,0 L10,-2.4 V2.4 Z" fill="#1f3a78"/>
    <rect x={40} y={-9} width={170} height={18} rx={8} fill="#1f3a78" stroke="#0f2250" strokeWidth={2}/>
    <rect x={40} y={-9} width={170} height={5} rx={2.5} fill="#7a9ae0" opacity={0.6}/>
    <rect x={150} y={-4} width={56} height={8} rx={3} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={1.4}/>
  </g>
);

// ---- the four icons (origin = icon centre) ------------------------------------------------------------------------------------------
const IconRate: React.FC<{f: number}> = ({f}) => (
  <g>
    <Shade x={0} y={64} rx={74} ry={11} o={0.32}/>
    <circle r={66} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={4}/>
    <circle r={54} fill="#fff4c9" stroke="#6c4a16" strokeWidth={2.4}/>
    <text y={22} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={74} fill="#a5302a">%</text>
    <path d="M-44,-34 A58,58 0 0 1 8,-56" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6}/>
    {[-96, 96].map((dx, i) => <g key={i} transform={`translate(${dx} ${26 - i * 10})`}><ellipse rx={30} ry={9} cy={14} fill="url(#e2-gold)" stroke="#8c5f18" strokeWidth={2}/><ellipse rx={30} ry={9} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={2}/></g>)}
    <path d={`M-70,-54 Q0,${-96 - 4 * Math.sin(f / 14)} 70,-54`} stroke="#c9822e" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="2 12" opacity={0.7}/>
  </g>
);

const IconDocs: React.FC<{f: number}> = ({f}) => (
  <g>
    <Shade x={0} y={66} rx={92} ry={11} o={0.32}/>
    {[[-30, -4, -9], [20, 2, 6], [-4, 8, -2]].map(([dx, dy, rot], i) => (
      <g key={i} transform={`translate(${dx} ${dy}) rotate(${rot})`}>
        <rect x={-52} y={-64} width={104} height={132} rx={5} fill="url(#g2-sheet)" stroke="#bda46c" strokeWidth={2.4}/>
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M-36,${-42 + k * 20} h${60 - (k % 2) * 18}`} stroke="#7a6a52" strokeWidth={5} strokeLinecap="round" opacity={0.5}/>)}
      </g>
    ))}
    <rect x={-26} y={-82} width={52} height={22} rx={5} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
    <circle cx={46} cy={44} r={26} fill="#2f9a4a" stroke="#14502a" strokeWidth={3.4}/>
    <path d="M32,44 L43,56 L62,32" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
);

const IconRepay: React.FC<{f: number}> = ({f}) => (
  <g>
    <Shade x={0} y={64} rx={92} ry={11} o={0.32}/>
    <rect x={-84} y={-62} width={168} height={128} rx={10} fill="url(#g2-sheet)" stroke="#bda46c" strokeWidth={2.6}/>
    <rect x={-84} y={-62} width={168} height={32} rx={10} fill="#c0603d" stroke="#8c3a22" strokeWidth={2.4}/>
    {[-52, 52].map((dx) => <rect key={dx} x={dx - 6} y={-74} width={12} height={26} rx={6} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2}/>)}
    {Array.from({length: 12}, (_, i) => {
      const cx = -60 + (i % 4) * 40, cy = -8 + Math.floor(i / 4) * 32, on = i % 4 === 1 || i === 11;
      return <g key={i}><rect x={cx - 15} y={cy - 12} width={30} height={24} rx={4} fill={on ? "#d8f0d8" : "#f3ead4"} stroke="#b9a678" strokeWidth={1.4}/>{on && <circle cx={cx} cy={cy} r={8} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={1.6}/>}</g>;
    })}
  </g>
);

const Tractor: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`}>
    <Shade x={0} y={0} rx={90} ry={10} o={0.34}/>
    <path d="M-86,-24 H-6 V-58 H44 V-76 H66 V-4 H34 L-86,-4 Z" fill="#3f8f4f" stroke="#1d5a2c" strokeWidth={3} strokeLinejoin="round"/>
    <rect x={30} y={-92} width={50} height={52} rx={5} fill="#cfe6f2" stroke="#1d5a2c" strokeWidth={3} opacity={0.95}/>
    <path d="M30,-92 H80 V-98 H26 Z" fill="#2a6f3a" stroke="#1d5a2c" strokeWidth={2.4}/>
    <rect x={-84} y={-44} width={58} height={20} rx={4} fill="#2a6f3a" stroke="#1d5a2c" strokeWidth={2}/>
    <rect x={-70} y={-78} width={9} height={36} fill="#5c6670" stroke="#2f3a44" strokeWidth={1.6}/>
    <circle cx={46} cy={-8} r={36} fill="#2b2b2e" stroke="#111" strokeWidth={3}/><circle cx={46} cy={-8} r={20} fill="#d8a43a" stroke="#8a5f12" strokeWidth={3}/><circle cx={46} cy={-8} r={6} fill="#8a5f12"/>
    <circle cx={-62} cy={0} r={20} fill="#2b2b2e" stroke="#111" strokeWidth={3}/><circle cx={-62} cy={0} r={10} fill="#d8a43a" stroke="#8a5f12" strokeWidth={2.4}/>
    <path d="M-60,-30 H-12" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.35}/>
  </g>
);

const IconCollateral: React.FC<{f: number; at: number}> = ({f, at}) => {
  const closed = E(f, at + 22, 12), click = clamp01((f - (at + 32)) / 18);
  return (
    <g>
      <House x={-174} y={52} w={104} h={70} wall="#ecd8b0" roof="#b5523a"/>
      <Tractor x={34} y={56}/>
      <Padlock x={0} y={-6} s={1.05} closed={closed} click={click}/>
    </g>
  );
};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// ---- a stamped box ----------------------------------------------------------------------------------------------------------------
const TermBox: React.FC<{f: number; x: number; y: number; show: number; at: number; dim: number; children: React.ReactNode}> = ({f, x, y, show, at, dim, children}) => {
  const o = Z(f, show, 20), u = pop(f, at, 20), lit = Z(f, at, 12), ring = prog(f, at, 26);
  if (o <= 0.002) return null;
  const k = 0.82 + 0.18 * u, cx = x + BW / 2, cy = y + BH / 2;
  return (
    <g opacity={o}>
      {f < at && <rect x={x} y={y} width={BW} height={BH} rx={22} fill="none" stroke="#8a5a20" strokeWidth={3} strokeDasharray="14 10" opacity={0.55}/>}
      <g transform={`translate(${cx} ${cy}) scale(${f < at ? 1 : k}) translate(${-cx} ${-cy})`} opacity={f < at ? 0 : lit * (0.74 + 0.26 * dim)}>
        {lit > 0.01 && <rect x={x - 22} y={y - 22} width={BW + 44} height={BH + 44} rx={40} fill="#ffcf6a" opacity={0.4 * lit * (0.55 + 0.45 * Math.sin(f / 9 + x) * 0.5 + 0.2) * dim} filter="url(#e3-glow)"/>}
        <rect x={x + 8} y={y + 16} width={BW} height={BH} rx={22} fill="#2a1808" opacity={0.34} filter="url(#e3-glow-s)"/>
        <rect x={x} y={y} width={BW} height={BH} rx={22} fill="url(#g2-sheet)" stroke="#a8741c" strokeWidth={4}/>
        <rect x={x + 10} y={y + 10} width={BW - 20} height={BH - 20} rx={14} fill="none" stroke="#a5302a" strokeWidth={2.4} opacity={0.5}/>
        {[[1, 1], [-1, 1], [1, -1], [-1, -1]].map(([i, j], n) => <circle key={n} cx={cx + i * (BW / 2 - 24)} cy={cy + j * (BH / 2 - 24)} r={6} fill="#e9cf8a" stroke="#6c4a16" strokeWidth={1.6}/>)}
        <g transform={`translate(${cx} ${y + BH - 92}) scale(0.92)`}>{children}</g>
        {/* the stamp thud: a ring that spreads */}
        {ring > 0 && ring < 1 && <rect x={x - ring * 30} y={y - ring * 30} width={BW + ring * 60} height={BH + ring * 60} rx={30 + ring * 20} fill="none" stroke="#a5302a" strokeWidth={5} opacity={(1 - ring) * 0.6}/>}
      </g>
    </g>
  );
};

export const CreditTermsArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const at = {ir: L.ir.at, dc: L.dc.at, mr: L.mr.at, co: L.co.at, ls: L.ls.at, bp: L.bp.at, tc: L.tc.at};
  const colOut = 1 - E(f, L.tc.at - 4, 20);                        // the lender and borrower columns step aside when the terms begin
  const lsK = (d: number) => pop(f, L.ls.at + d, 22), bpK = (d: number) => pop(f, L.bp.at + d, 22);
  const dimOf = (k: typeof KEYS[number]) => { const i = KEYS.indexOf(k), nxt = KEYS[i + 1]; return nxt ? 1 - 0.45 * E(f, at[nxt], 20) : 1; };
  const conn = (k: typeof KEYS[number], x0: number, y0: number, x1: number, y1: number) => {
    const u = Z(f, at[k] + 6, 24);
    if (u <= 0.002) return null;
    const dx = x1 - x0, mx = x0 + dx * 0.5;
    return <path key={k} d={`M${x0},${y0} C${mx},${y0} ${mx},${y1} ${x1},${y1}`} fill="none" stroke="#a8741c" strokeWidth={4} strokeDasharray="3 11" strokeLinecap="round" opacity={0.85 * u} strokeDashoffset={-p.f * 0.8}/>;
  };
  return (
    <g>
      <F3Defs/><G2Defs/>
      <defs>
        <linearGradient id="f2-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f2f6f8"/><stop offset="0.5" stopColor="#b7c4cc"/><stop offset="1" stopColor="#6f808b"/></linearGradient>
      </defs>
      <Desk f={f} id="g2ct"/>
      <DeskDressing f={f}/>
      <Agreement f={f} at={at}/>
      <Pen x={1296} y={806}/>
      {/* the lender: money, goods, services */}
      <g opacity={colOut}>
        <Stack x={150} y={560} n={7} rx={58} th={15} a={Math.min(1, lsK(0) * 1.5)} glow={0}/>
        <Stack x={236} y={578} n={4} rx={50} th={15} a={Math.min(1, lsK(6) * 1.5)}/>
        <Crate x={364} y={560} k={lsK(14)}/>
        <Spanner x={496} y={470} k={lsK(24)}/>
        <FlowArrow pts={[[512, 640], [570, 668], [640, 650]]} f={f} p={Z(f, L.ls.at + 20, 26)} w={20} c1="#e9a63c" c2="#ffe08a" op={colOut}/>
        {/* the borrower: a promise and a later date */}
        <g transform="translate(1546 480)" opacity={Math.min(1, bpK(0) * 1.4)}>
          <Shade x={0} y={100} rx={100} ry={12} o={0.32}/>
          <g transform={`rotate(${-6 + (1 - bpK(0)) * 8}) translate(0 ${(1 - bpK(0)) * -30})`}>
            <rect x={-110} y={-160} width={220} height={150} rx={8} fill="url(#g2-sheet)" stroke="#bda46c" strokeWidth={2.4}/>
            <text y={-104} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={32} letterSpacing={3} fill="#7a2a1d">PAY LATER</text>
            <path d="M-80,-76 H80 M-80,-52 H40" stroke="#7a6a52" strokeWidth={5} strokeLinecap="round" opacity={0.5}/>
            <path d="M-84,-26 q12,-22 24,-4 t26,-4" stroke="#7a2a1d" strokeWidth={3.4} fill="none" strokeLinecap="round"/>
          </g>
        </g>
        <g opacity={Math.min(1, bpK(10) * 1.4)} transform={`translate(0 ${(1 - bpK(10)) * 20})`}><Clock x={1546} y={672} r={70} f={f} speed={0.8} stand/></g>
      </g>
      {/* the four terms */}
      <TermBox f={f} x={BOX.ir.x} y={BOX.ir.y} show={at.tc} at={at.ir} dim={dimOf("ir")}><IconRate f={f}/></TermBox>
      <TermBox f={f} x={BOX.dc.x} y={BOX.dc.y} show={at.tc} at={at.dc} dim={dimOf("dc")}><IconDocs f={f}/></TermBox>
      <TermBox f={f} x={BOX.mr.x} y={BOX.mr.y} show={at.tc} at={at.mr} dim={dimOf("mr")}><IconRepay f={f}/></TermBox>
      <TermBox f={f} x={BOX.co.x} y={BOX.co.y} show={at.tc} at={at.co} dim={dimOf("co")}><IconCollateral f={f} at={at.co}/></TermBox>
      {conn("ir", BOX.ir.x + BW, BOX.ir.y + BH / 2, DOC.x + 40, DOC.y + BAND_Y.ir + 6)}
      {conn("dc", BOX.dc.x + BW, BOX.dc.y + BH / 2, DOC.x + 40, DOC.y + BAND_Y.dc + 6)}
      {conn("mr", BOX.mr.x, BOX.mr.y + BH / 2, DOC.x + DOC.w - 40, DOC.y + BAND_Y.mr + 6)}
      {conn("co", BOX.co.x, BOX.co.y + BH / 2, DOC.x + DOC.w - 40, DOC.y + BAND_Y.co + 6)}
    </g>
  );
};

export const CreditTermsLabels: React.FC<AP> = (p) => {
  const L = elabs(p), out = L.tc.at - 4;
  return (
    <>
      <FCard cx={960} y={64} text={L.cr.text} f={p.f} at={L.cr.at} size={36} maxW={1300} upper={false}/>
      <FCard cx={960} y={174} text={L.tc.text} f={p.f} at={L.tc.at} size={34} maxW={800} tone="dark"/>
      <FCard cx={330} y={660} text={L.ls.text} f={p.f} at={L.ls.at} out={out} size={28} maxW={420} upper={false}/>
      <FCard cx={1590} y={786} text={L.bp.text} f={p.f} at={L.bp.at} out={out} size={28} maxW={420} upper={false} tone="red"/>
      <FCard cx={BOX.ir.x + BW / 2} y={BOX.ir.y + 18} text={L.ir.text} f={p.f} at={L.ir.at} size={30} maxW={440}/>
      <FCard cx={BOX.dc.x + BW / 2} y={BOX.dc.y + 18} text={L.dc.text} f={p.f} at={L.dc.at} size={30} maxW={440}/>
      <FCard cx={BOX.mr.x + BW / 2} y={BOX.mr.y + 18} text={L.mr.text} f={p.f} at={L.mr.at} size={30} maxW={440}/>
      <FCard cx={BOX.co.x + BW / 2} y={BOX.co.y + 14} text={L.co.text} f={p.f} at={L.co.at} size={26} maxW={410} upper={false}/>
    </>
  );
};
export {eo, pulse, W, H};

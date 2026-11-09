// ECO-16 Part 2, builder F2: `gear-multiplier` (b08 plain, b09a leak, b09b toy). Brass gears on a workbench: a small RESERVES gear turns a big DEPOSITS gear. The teeth and the radii follow the
// table's multiplier (e16_rounds mult = 5: the big gear has five times the teeth and five times the radius). In "leak" coins roll off the big gear into a wallet; in "toy" a readout dial shows
// the plain multiplier (e16_mult plain, printed 33) and then the full one (full, printed 6.4). Printed values are fig() reads; dated captions are the storyboard's text.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import type {AP} from "./analogy_kit";
import {Wallet} from "./analogy_e2_kit";
import {Dial, Defs, DeskTop, ECard, F, Gear, Plate, Shade, Specks, Spot, elabs, ez, lerp, pop, pulse, sm, v} from "./analogy_f2_kit";

const SC = {x: 470, y: 470}, PITCH_S = 60, N_S = 12, DEPTH = 20, BENCH = 812;
const WALLET = {x: 1480, y: 804};

const Workshop: React.FC<{f: number}> = ({f}) => (
  <g>
    <defs>
      <linearGradient id="gm-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#efe0bd"/><stop offset="1" stopColor="#d9c08c"/></linearGradient>
    </defs>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#gm-wall)"/>
    {/* plank wall */}
    {Array.from({length: 12}, (_, i) => <path key={i} d={`M${i * 170 - 40},-20 V${BENCH}`} stroke="#b8975c" strokeWidth={2} opacity={0.35}/>)}
    {/* a window with a warm shaft */}
    <g opacity={0.9}>
      <rect x={1230} y={110} width={260} height={290} rx={8} fill="url(#f2-win)" stroke="#8a6a3a" strokeWidth={9}/>
      <path d="M1360,110 V400 M1230,255 H1490" stroke="#8a6a3a" strokeWidth={6}/>
      <path d={`M1240,400 L1130,${BENCH} L1560,${BENCH} L1490,400 Z`} fill="url(#f2-shaft)" opacity={0.2 + 0.04 * Math.sin(f / 40)}/>
    </g>
    {/* pegboard with tools */}
    <g>
      <rect x={1590} y={110} width={250} height={380} rx={10} fill="#c9a36a" stroke="#7a5430" strokeWidth={4}/>
      {Array.from({length: 7}, (_, r) => Array.from({length: 5}, (_, c) => <circle key={`${r}${c}`} cx={1620 + c * 50} cy={140 + r * 52} r={3.4} fill="#6a4624" opacity={0.7}/>))}
      {/* spanner */}
      <g transform="translate(1660 180) rotate(-14)"><rect x={-9} y={-10} width={18} height={150} rx={8} fill="url(#f2-steel-d)" stroke="#3d4a54" strokeWidth={2.4}/><circle cx={0} cy={-22} r={24} fill="url(#f2-steel-d)" stroke="#3d4a54" strokeWidth={2.4}/><rect x={-9} y={-52} width={18} height={26} fill="#c9a36a"/><path d="M-14,-52 L-14,-20 L14,-20 L14,-52" fill="none" stroke="#3d4a54" strokeWidth={2}/></g>
      {/* hammer */}
      <g transform="translate(1750 170) rotate(10)"><rect x={-7} y={0} width={14} height={170} rx={6} fill="#b97a3a" stroke="#6a4624" strokeWidth={2.4}/><rect x={-34} y={-20} width={68} height={32} rx={6} fill="url(#f2-steel-d)" stroke="#3d4a54" strokeWidth={2.4}/></g>
      {/* pliers */}
      <g transform="translate(1690 330) rotate(4)"><path d="M-14,0 L-4,100 M14,0 L4,100" stroke="#b32d24" strokeWidth={10} strokeLinecap="round"/><path d="M-14,0 L0,-34 L14,0 Z" fill="url(#f2-steel-d)" stroke="#3d4a54" strokeWidth={2.4}/><circle cx={0} cy={-2} r={5} fill="#3d4a54"/></g>
    </g>
    {/* a shelf with an oil can */}
    <g>
      <rect x={1230} y={470} width={300} height={14} rx={3} fill="url(#e2-wood)" stroke="#5a3418" strokeWidth={2}/>
      <path d="M1290,470 V330 M1480,470 V330" stroke="none"/>
      <g transform="translate(1330 470)"><path d="M-30,0 V-62 Q-30,-70 -22,-70 H22 Q30,-70 30,-62 V0 Z" fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/><path d="M22,-62 L62,-96 L66,-90 L28,-52" fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/><rect x={-14} y={-84} width={28} height={14} rx={4} fill="#6c4a16"/></g>
    </g>
    <DeskTop y0={BENCH}/>
    <Specks f={f} n={18} seed={11} y0={120} y1={BENCH}/>
  </g>
);

/** the gear train: small RESERVES gear driving the big DEPOSITS gear; rotation is a function of f only */
const Train: React.FC<{f: number; mult: number; plates?: number}> = ({f, mult, plates = 0}) => {
  const nB = Math.round(N_S * mult), pB = PITCH_S * mult, bx = SC.x + PITCH_S + pB, by = SC.y;
  const th1 = -f * 0.05, th2 = Math.PI + Math.PI / nB - (N_S / nB) * th1;
  return (
    <g>
      {/* the board both gears are mounted on */}
      <rect x={150} y={120} width={1040} height={BENCH - 120 - 6} rx={26} fill="url(#f2-board)" stroke="#2a180a" strokeWidth={4}/>
      <rect x={166} y={136} width={1008} height={BENCH - 120 - 38} rx={18} fill="none" stroke="#a97a44" strokeWidth={2} opacity={0.5}/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M150,${150 + i * 96} H1190`} stroke="#2a180a" strokeWidth={2} opacity={0.35}/>)}
      {[[180, 150], [1160, 150], [180, 770], [1160, 770]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={11} fill="url(#f2-steel)" stroke="#3d4a54" strokeWidth={2.4}/><path d={`M${x - 6},${y - 2} L${x + 6},${y + 2}`} stroke="#3d4a54" strokeWidth={2}/></g>)}
      <Gear id="gm-b" cx={bx} cy={by} n={nB} ro={pB + DEPTH / 2} depth={DEPTH} rot={th2} spokes={8} hub={0.13}/>
      <Gear id="gm-s" cx={SC.x} cy={SC.y} n={N_S} ro={PITCH_S + DEPTH / 2} depth={DEPTH} rot={th1} spokes={0} hub={0.22}/>
      {plates > 0.01 && <g>
        <Plate x={SC.x} y={SC.y + 130} w={190} text="RESERVES" size={22} a={plates}/>
        <Plate x={bx} y={by} w={210} text="DEPOSITS" size={26} a={plates}/>
      </g>}
    </g>
  );
};

const bigR = (mult: number) => PITCH_S * mult + DEPTH / 2;
const gx = (mult: number) => SC.x + PITCH_S + PITCH_S * mult;

/** coins that roll off the big gear through a brass chute into a wallet */
const Leak: React.FC<{f: number; t0: number; mult: number; dur: number}> = ({f, t0, mult, dur}) => {
  const bx = gx(mult), by = SC.y, R = bigR(mult), ang = 0.5, sx0 = bx + Math.cos(ang) * R, sy0 = by + Math.sin(ang) * R;
  const gap = 28, LIFE = 70, cnt = Math.max(0, Math.floor((f - t0) / gap) + 1);
  const arrived = Math.max(0, Math.min(10, Math.floor((f - t0 - LIFE * 0.95) / gap) + 1));
  const ex = sx0 - 8, ey = sy0 - 6, fx = WALLET.x - 120, fy = WALLET.y - 120, mx = WALLET.x - 10, my = WALLET.y - 178;
  const coins = Array.from({length: Math.min(cnt, 40)}, (_, i) => cnt - 1 - i).map((k) => {
    const u = (f - (t0 + k * gap)) / LIFE;
    if (u < 0 || u > 1) return null;
    // rolls along the top edge of the chute for the first part, then drops into the wallet's mouth
    const r = Math.min(1, u / 0.72), d = clamp((u - 0.72) / 0.28);
    const rx = lerp(ex + 18, fx - 10, r * r * 0.4 + r * 0.6), ry = lerp(ey - 20, fy - 26, r * r * 0.4 + r * 0.6);
    const x = lerp(rx, mx, d * d), y = lerp(ry, my, d) - Math.sin(Math.PI * d) * 34;
    const op = Math.min(1, u * 10, (1 - u) * 6), sc = 0.8 - 0.25 * d;
    return <g key={k} transform={`translate(${x} ${y}) scale(${sc})`} opacity={op}><Coin3 rot={u * 640}/></g>;
  });
  const appear = ez(f, t0 - 12, 22);
  return (
    <g>
      {/* the brass chute, fixed to the board */}
      <g opacity={appear}>
        <path d={`M${sx0 - 8},${sy0 - 6} L${WALLET.x - 120},${WALLET.y - 120} L${WALLET.x - 120},${WALLET.y - 92} L${sx0 + 6},${sy0 + 36} Z`} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3} strokeLinejoin="round" transform="translate(0 0)"/>
        <path d={`M${sx0 - 4},${sy0 - 3} L${WALLET.x - 124},${WALLET.y - 120}`} stroke="#fff3c0" strokeWidth={3} opacity={0.7}/>
        <rect x={sx0 - 24} y={sy0 - 22} width={34} height={66} rx={8} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/>
      </g>
      {coins}
      <Wallet x={WALLET.x} y={WALLET.y} s={0.95} fat={clamp(0.25 + arrived * 0.07)} coins={Math.min(arrived, 7)} f={f} notes={2} glow={0.3 * pulse(f, t0, 80)}/>
    </g>
  );
};

const Coin3: React.FC<{rot: number}> = ({rot}) => {
  const sx = Math.max(0.2, Math.abs(Math.cos((rot * Math.PI) / 180)));
  return (
    <g transform={`scale(${sx} 1)`}>
      <circle r={22} fill="url(#e2-coin)" stroke="#a8741c" strokeWidth={2}/>
      <circle r={16} fill="none" stroke="#b9831f" strokeWidth={1.6} opacity={0.8}/>
      <path d="M-14,-7 A16,16 0 0 1 -2,-15" stroke="#fffbe0" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8}/>
    </g>
  );
};

const Stamp: React.FC<{cx: number; cy: number; text: string; k: number}> = ({cx, cy, text, k}) => {
  if (k <= 0.01) return null;
  const parts = text.split("·").map((x) => x.trim()), sc = 1 + (1 - Math.min(1, k)) * 1.1;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(-7) scale(${sc})`} opacity={clamp(k * 3)}>
      <rect x={-270} y={-70} width={540} height={140} rx={14} fill="rgba(255,244,230,.55)" stroke="#b32d24" strokeWidth={9}/>
      <rect x={-254} y={-54} width={508} height={108} rx={8} fill="none" stroke="#b32d24" strokeWidth={3}/>
      {parts.map((t, i) => <text key={i} y={parts.length > 1 ? -4 + i * 54 : 16} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={parts.length > 1 ? 50 : 56} letterSpacing={5} fill="#b32d24">{t}</text>)}
    </g>
  );
};

export const GearArt: React.FC<AP> = (p) => {
  const {f, dur} = p, mode = (p.spec as any).mode ?? "plain", L = elabs(p), mult = v("e16_rounds", "mult");
  if (mode === "toy") {
    const plain = v("e16_mult", "plain"), full = v("e16_mult", "full"), mx = Math.ceil(plain / 10) * 10, sweep = 240;
    const ang = (x: number) => -sweep / 2 + (sweep * x) / mx;
    const t33 = L.c33.at, t64 = L.c64.at, tToy = L.toy.at;
    const up = sm(f, t33, 54), over = 1 + 0.06 * Math.sin(Math.PI * Math.min(1, Math.max(0, (f - t33) / 54)));
    const down = sm(f, t64, 46);
    const val = lerp(lerp(0, plain, up) * over, full, down);
    const shown = f >= t64 ? F("e16_mult", "full", 1).text : F("e16_mult", "plain", 0).text;
    const readA = f < t33 + 40 ? 0 : 1;
    const GX = 1330, GY = 530, GR = 220;
    return (
      <g>
        <Defs/>
        <Workshop f={f}/>
        <Spot id="gm-sp" cx={900} cy={440} rx={900} ry={380} c="#fff0c8" a={0.3}/>
        <g transform="translate(60 250) scale(0.62)">
          <Train f={f} mult={mult} plates={1}/>
          {f >= t64 - 20 && <Leak f={f} t0={t64} mult={mult} dur={dur}/>}
        </g>
        {/* the readout dial */}
        <g>
          <Dial id="gm-r" cx={GX} cy={GY} r={GR} ang={ang(Math.max(0, val)) + (f > t64 && f < t64 + 60 ? Math.sin((f - t64) * 0.9) * 2 * (1 - (f - t64) / 60) : 0)} sweep={sweep} ticks={40} face="#fbf3dc" lit={0.55 * pulse(f, t33, 70) + 0.4 * pulse(f, t64, 70)} a={ez(f, 4, 20)}/>
          {Array.from({length: 5}, (_, i) => { const a = (ang((mx * i) / 4) * Math.PI) / 180, rr = GR * 0.55; return <text key={i} x={GX + Math.sin(a) * rr} y={GY - Math.cos(a) * rr + 9} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={26} fill="#5a3418" opacity={ez(f, 8, 20)}>{Math.round((mx * i) / 4)}</text>; })}
          <g opacity={ez(f, t33 + 40, 14)}>
            <rect x={GX - 120} y={GY + 44} width={240} height={96} rx={14} fill="#1a1510" stroke="#6c4a16" strokeWidth={4}/>
            <text x={GX} y={GY + 118} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={82} fill="#ffd36a" stroke="#a8741c" strokeWidth={1.2} paintOrder="stroke">{shown}</text>
          </g>
        </g>
        <Stamp cx={GX} cy={GY + 232} text={L.toy.text} k={pop(f, tToy, 16)}/>
      </g>
    );
  }
  const leak = mode === "leak";
  const t0 = leak ? L.lk.at : 1e9;
  return (
    <g>
      <Defs/>
      <Workshop f={f}/>
      <Spot id="gm-sp" cx={760} cy={440} rx={760} ry={400} c="#fff0c8" a={0.34}/>
      <Train f={f} mult={mult} plates={leak ? 1 : 0}/>
      {leak && <Leak f={f} t0={t0} mult={mult} dur={dur}/>}
    </g>
  );
};

export const GearLabels: React.FC<AP> = (p) => {
  const {f} = p, mode = (p.spec as any).mode ?? "plain", L = elabs(p), mult = v("e16_rounds", "mult");
  if (mode === "toy") {
    return <>
      <ECard cx={1330} y={54} text={L.c33.text} f={f} at={L.c33.at} size={28} maxW={560} upper={false}/>
      <ECard cx={1330} y={132} text={L.c64.text} f={f} at={L.c64.at} size={28} maxW={640} upper={false} tone="cool"/>
    </>;
  }
  if (mode === "leak") {
    const s = sm(f, L.fm.at, 24);
    return <>
      <ECard cx={1400} y={296} text={L.lk.text} f={f} at={L.lk.at} size={36} maxW={520} tone="red"/>
      <ECard cx={1560} y={470} text={L.cd.text} f={f} at={L.cd.at} size={28} maxW={540} upper={false}/>
      <div style={{position: "absolute", inset: 0, transform: `translateX(${(1 - s) * 220}px)`, opacity: s}}>
        <ECard cx={1500} y={84} text={L.fm.text} f={f} at={L.fm.at} size={34} maxW={640} upper={false} tone="dark"/>
      </div>
    </>;
  }
  const s = sm(f, L.fm.at, 28);
  return <>
    <ECard cx={330} y={282} text={L.rs.text} f={f} at={L.rs.at} size={32} maxW={420} tone="dark"/>
    <ECard cx={bxLabel(mult)} y={58} text={L.dp.text} f={f} at={L.dp.at} size={34} maxW={460} tone="cool"/>
    <ECard cx={1500} y={170} text={L.mm.text} f={f} at={L.mm.at} size={40} maxW={760} tone="dark"/>
    <div style={{position: "absolute", inset: 0, transform: `translateX(${(1 - s) * 260}px)`, opacity: s}}>
      <ECard cx={1500} y={420} text={L.fm.text} f={f} at={L.fm.at} size={96} maxW={620} upper={false}/>
    </div>
  </>;
};
const bxLabel = (mult: number) => gx(mult);

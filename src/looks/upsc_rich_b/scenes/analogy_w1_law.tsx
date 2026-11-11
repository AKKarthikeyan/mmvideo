// POL-03 Part 1, builder W1: `bill-glass` (scroll -> PART III book, vote box stops at a glass wall, courthouse door opens), `state-buildings` (public
// buildings light up under THE STATE roof, a public-sector building joins) and `rulebook` (pages fan out; one that crosses a right goes VOID).
// Generic buildings only: no emblems, flags or real seals. Motion depends on f, dur and at(key) only.
import React from "react";
import {SANS, SERIF, W, clamp, eo, eio} from "../kit";
import {Cloud, FlowArrow, Hills, Sun, Tree, prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";

const labOf = (p: AP, k: string) => { const L = rlabs(p), i = ((p.spec.labels ?? []) as {key: string}[]).findIndex((l) => l.key === k); return i >= 0 ? L[i] : undefined; };
const Sky: React.FC<{id: string; h: number; f: number; sun?: boolean}> = ({id, h, f, sun = true}) => (
  <g>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fc0e6"/><stop offset="1" stopColor="#f0eccd"/></linearGradient></defs>
    <rect x={-60} y={-60} width={W + 120} height={h + 60} fill={`url(#${id})`}/>
    {sun && <Sun x={1640} y={130} r={44} f={f} glow={0.6}/>}
    <Cloud x={100} y={140} s={1.3} f={f} seed={1} speed={0.05}/><Cloud x={400} y={210} s={1} a={0.85} f={f} seed={2} speed={0.05}/>
  </g>
);

// ---- bill-glass ---------------------------------------------------------------------------------------------------------------
const Courthouse: React.FC<{x: number; y: number; open: number; f: number}> = ({x, y, open, f}) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={8} rx={300} ry={24} fill="#2a1808" opacity={0.3}/>
    <path d="M-290,-300 L0,-400 L290,-300 Z" fill="#e8dcc0" stroke="#a89470" strokeWidth={3}/><path d="M0,-400 L290,-300 H0 Z" fill="#a89470" opacity={0.3}/>
    <rect x={-290} y={-300} width={580} height={28} fill="#d8c9a4"/><rect x={-300} y={-14} width={600} height={22} fill="#cdbb90"/><rect x={-320} y={0} width={640} height={16} fill="#bfae84"/>
    {[-250, -170, -90, 90, 170, 250].map((cx) => <g key={cx}><rect x={cx - 20} y={-272} width={40} height={258} fill="#f0e6cc"/><rect x={cx + 4} y={-272} width={16} height={258} fill="#a89470" opacity={0.3}/><rect x={cx - 26} y={-284} width={52} height={14} fill="#d8c9a4"/><rect x={cx - 26} y={-24} width={52} height={12} fill="#d8c9a4"/></g>)}
    <rect x={-60} y={-244} width={120} height={230} fill="#4a3220"/>
    {/* the door, hinged on the left, swings open on the light behind it */}
    <rect x={-52} y={-236} width={104} height={222} fill="#ffe9a6" opacity={open}/>
    {open > 0.02 && <path d={`M-52,-236 H52 V-14 H-52 Z`} fill="url(#ak-sunglow)" opacity={0.7 * open}/>}
    <path d={`M-52,-236 L${-52 + 104 * (1 - open * 0.92)},${-236 + 14 * open} V${-14 - 14 * open} L-52,-14 Z`} fill="#7a4a26" stroke="#4a2a14" strokeWidth={2.4}/>
    <circle cx={-52 + 104 * (1 - open * 0.92) - 12} cy={-124} r={5} fill="#e3a53a"/>
    <path d="M-72,-14 H72 L92,10 H-92 Z" fill="#c4b088"/>
  </g>
);

const VoteBox: React.FC<{f: number; push: number}> = ({f, push}) => (
  <g style={{filter: "drop-shadow(0 12px 10px rgba(40,22,8,.4))"}}>
    <path d="M-110,-150 H110 V0 H-110 Z" fill="#3f6f9a" stroke="#1f3f5c" strokeWidth={3}/><path d="M10,-150 H110 V0 H10 Z" fill="#1f3f5c" opacity={0.3}/>
    <path d="M-124,-150 H124 L108,-176 H-108 Z" fill="#cdd8e2" stroke="#7a8a9a" strokeWidth={2.4}/><rect x={-60} y={-168} width={120} height={9} rx={4} fill="#1a2530"/>
    <rect x={-70} y={-110} width={140} height={60} rx={6} fill="#fff6d6" opacity={0.9}/>
    {[-38, -4, 30].map((x, i) => <g key={i}><rect x={x - 12} y={-100} width={24} height={40} rx={4} fill="#fff" stroke="#8a7a5a" strokeWidth={1.6}/><path d={`M${x - 6},${-84 + (i % 2) * 6} l5,5 l8,-10`} stroke="#2f7a3a" strokeWidth={3.4} fill="none" strokeLinecap="round"/></g>)}
    {[0, 1, 2].map((i) => <path key={i} d={`M${-150 - i * 30 - push * 10},${-90 + i * 24} h-44`} stroke="#d8688a" strokeWidth={5} strokeLinecap="round" opacity={0.7 * push}/>)}
  </g>
);

export const BillGlassArt: React.FC<AP> = (p) => {
  const {f, dur} = p, p3 = p.at("p3"), mj = p.at("mj"), ct = p.at("ct");
  const unroll = eio(prog(f, Math.max(4, p3 - 40), 36)), bookA = eo(prog(f, p3, 16));
  const approach = eio(prog(f, mj - 70, 60)), BX = 130 + 530 * approach, hit = f > mj - 14 ? Math.exp(-(f - (mj - 10)) / 9) * Math.sin((f - mj) / 1.7) : 0;
  const door = eio(prog(f, ct, 34));
  const GX = 780, bounce = approach >= 0.999 ? hit * 5 : 0;
  const glowHit = eo(prog(f, mj - 12, 6)) * (1 - eo(prog(f, mj - 6, 40)));
  return (
    <g>
      <Sky id="w1l-sky" h={620} f={f}/>
      <Hills id="w1l-h1" base={560} amp={60} top="#a9c3d8" bottom="#cddcd6" seed={2.2} wl={300} bottomY={760}/>
      <rect x={-60} y={700} width={W + 120} height={500} fill="#cdbf9c"/><rect x={-60} y={700} width={W + 120} height={10} fill="#e9dcb8"/>
      {Array.from({length: 12}).map((_, i) => <path key={i} d={`M${-60},${730 + i * 34} H${W + 60}`} stroke="#a89470" strokeWidth={1.4} opacity={0.35}/>)}
      <Tree x={1860} y={730} s={1} f={f} seed={6}/>
      <Courthouse x={1560} y={760} open={door} f={f}/>
      {/* the book, behind the glass: a scroll unrolls and turns into PART III */}
      <g transform="translate(1010 700)">
        <ellipse cx={0} cy={6} rx={150} ry={18} fill="#2a1808" opacity={0.3}/>
        {bookA < 0.99 && (
          <g opacity={1 - bookA}>
            <rect x={-92} y={-300 * unroll - 10} width={184} height={300 * unroll + 10 - 4} fill="#f6ebc8" stroke="#b8a074" strokeWidth={2.4}/>
            {Array.from({length: 9}).map((_, i) => <rect key={i} x={-70} y={-300 * unroll + 22 + i * 30} width={140 - (i % 3) * 20} height={5} rx={2} fill="#9a8a6a" opacity={i * 30 < 300 * unroll - 24 ? 0.75 : 0}/>)}
            <rect x={-104} y={-300 * unroll - 24} width={208} height={22} rx={11} fill="#c8a45a" stroke="#7a5a22" strokeWidth={2.4}/><rect x={-104} y={-14} width={208} height={22} rx={11} fill="#c8a45a" stroke="#7a5a22" strokeWidth={2.4}/>
          </g>
        )}
        <g opacity={bookA} transform={`translate(0 ${(1 - bookA) * 14}) scale(${0.94 + 0.06 * bookA})`}>
          <path d="M-130,-290 H130 V0 H-130 Z" fill="#1f3a63" stroke="#0f2140" strokeWidth={4}/><path d="M-130,-290 H-108 V0 H-130 Z" fill="#0f2140"/><path d="M60,-290 H130 V0 H60 Z" fill="#000" opacity={0.15}/>
          <rect x={-130} y={-12} width={260} height={12} fill="#f6ecd2"/><rect x={-118} y={-12} width={238} height={4} fill="#d8c9a4"/>
          <rect x={-86} y={-250} width={196} height={176} rx={6} fill="none" stroke="#f2d27a" strokeWidth={3}/><rect x={-78} y={-242} width={180} height={160} rx={4} fill="none" stroke="#f2d27a" strokeWidth={1.5} opacity={0.7}/>
          <path d="M20,-290 v30 l9,-8 l9,8 v-30 Z" fill="#b8321f"/>
          <text x={12} y={-176} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={36} letterSpacing="0.14em" fill="#f6dc8a">{(labOf(p, "p3")?.text ?? "").split(" ")[0]}</text>
          <text x={12} y={-122} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={64} letterSpacing="0.12em" fill="#fbe7a8">{(labOf(p, "p3")?.text ?? "").split(" ").slice(1).join(" ")}</text>
        </g>
      </g>
      {/* the glass wall */}
      <g>
        <path d={`M${GX},300 L${GX + 70},270 V700 L${GX},740 Z`} fill="#bfe3ee" opacity={0.38} stroke="#e8f6fa" strokeWidth={3}/>
        <path d={`M${GX},300 L${GX + 70},270 V700 L${GX},740 Z`} fill="#ffffff" opacity={0.2 + 0.5 * glowHit}/>
        <path d={`M${GX + 12},330 L${GX + 30},322 M${GX + 12},400 L${GX + 56},382 M${GX + 14},630 L${GX + 40},620`} stroke="#fff" strokeWidth={5} opacity={0.7} strokeLinecap="round"/>
        <path d={`M${GX - 16},740 H${GX + 84} L${GX + 70},700 H${GX} Z`} fill="#9aa4aa" stroke="#6a747a" strokeWidth={2}/>
        {glowHit > 0.02 && <circle cx={GX - 6} cy={560} r={90 * glowHit + 20} fill="#fff" opacity={0.5 * glowHit}/>}
      </g>
      {/* the vote box, pushing toward the glass and stopping at it */}
      <g transform={`translate(${BX - bounce} 720)`}><VoteBox f={f} push={1 - approach}/></g>
      <FlowArrow pts={[[BX - 280, 640], [BX - 200, 640], [BX - 120, 640]]} f={f} p={eo(prog(f, mj - 70, 30)) * (1 - eo(prog(f, mj + 4, 14)))} w={24} c1="#e0802c" dark="#7a3a10"/>
    </g>
  );
};
export const BillGlassLabels: React.FC<AP> = (p) => {
  const br = labOf(p, "br"), mj = labOf(p, "mj"), ct = labOf(p, "ct");
  return <>
    {br && <P2Card cx={960} y={78} text={br.text} f={p.f} at={br.at} size={34} maxW={1400} upper={false}/>}
    {mj && <P2Card cx={620} y={210} text={mj.text} f={p.f} at={mj.at} size={36} maxW={660} upper={false} tone="cool"/>}
    {ct && <P2Card cx={1560} y={200} text={ct.text} f={p.f} at={ct.at} size={44} maxW={560} tone="green"/>}
  </>;
};

// ---- state-buildings ------------------------------------------------------------------------------------------------------------
type Bld = {x: number; w: number; h: number; kind: string};
const BLDS: Bld[] = [{x: 330, w: 330, h: 250, kind: "parl"}, {x: 760, w: 300, h: 240, kind: "leg"}, {x: 1130, w: 300, h: 230, kind: "sec"}, {x: 1460, w: 250, h: 260, kind: "town"}];
const Windows: React.FC<{x: number; y: number; cols: number; rows: number; gx: number; gy: number; lit: number; f: number; seed: number}> = ({x, y, cols, rows, gx, gy, lit, seed}) => (
  <g>{Array.from({length: cols * rows}).map((_, i) => { const c = i % cols, r = Math.floor(i / cols), on = lit > ((i * 37 + seed) % 10) / 12;
    return <rect key={i} x={x + c * gx} y={y + r * gy} width={gx * 0.55} height={gy * 0.62} rx={2} fill={on ? "#ffe08a" : "#9fb4c4"} stroke="#6a7a88" strokeWidth={1.4} opacity={on ? 1 : 0.9}/>; })}</g>
);
const Building: React.FC<{b: Bld; lit: number; f: number; idx: number}> = ({b, lit, f, idx}) => {
  const {w, h, kind} = b, st = "#ddd0b0", sh = "#a89470";
  return (
    <g>
      {lit > 0.01 && <ellipse cx={0} cy={-h * 0.5} rx={w * 0.85} ry={h * 0.8} fill="url(#ak-sunglow)" opacity={0.75 * lit}/>}
      <g style={{filter: `saturate(${0.55 + 0.45 * lit}) brightness(${0.94 + 0.08 * lit})`}}>
        {kind === "parl" && <>
          <rect x={-w / 2} y={-h * 0.6} width={w} height={h * 0.6} fill={st} stroke={sh} strokeWidth={2.4}/>
          <path d={`M${-w * 0.2},${-h * 0.6} Q0,${-h * 1.2} ${w * 0.2},${-h * 0.6} Z`} fill="#e9dfc4" stroke={sh} strokeWidth={2.4}/><rect x={-3} y={-h * 1.14} width={6} height={22} fill={sh}/>
          {Array.from({length: 9}).map((_, i) => <rect key={i} x={-w / 2 + 12 + i * ((w - 24) / 9)} y={-h * 0.56} width={9} height={h * 0.5} fill="#efe4c8" stroke={sh} strokeWidth={1}/>)}
          <rect x={-w / 2 - 8} y={-8} width={w + 16} height={10} fill={sh}/>
        </>}
        {kind === "leg" && <>
          <rect x={-w / 2} y={-h * 0.62} width={w} height={h * 0.62} fill="#e6d8b8" stroke={sh} strokeWidth={2.4}/>
          <path d={`M${-w / 2 - 10},${-h * 0.62} L0,${-h * 0.96} L${w / 2 + 10},${-h * 0.62} Z`} fill="#d8c9a4" stroke={sh} strokeWidth={2.4}/>
          {[-0.36, -0.18, 0, 0.18, 0.36].map((u, i) => <rect key={i} x={w * u - 9} y={-h * 0.6} width={18} height={h * 0.6} fill="#f2e9d0" stroke={sh} strokeWidth={1.2}/>)}
          <rect x={-w / 2 - 14} y={-10} width={w + 28} height={12} fill={sh}/>
        </>}
        {kind === "sec" && <>
          <rect x={-w / 2} y={-h * 0.78} width={w} height={h * 0.78} fill="#e2d2ac" stroke={sh} strokeWidth={2.4}/><rect x={-w / 2} y={-h * 0.78} width={w} height={14} fill={sh} opacity={0.6}/>
          <Windows x={-w / 2 + 26} y={-h * 0.7} cols={5} rows={4} gx={48} gy={40} lit={lit} f={f} seed={3}/>
          <rect x={-22} y={-64} width={44} height={64} fill="#6a4426"/>
        </>}
        {kind === "town" && <>
          <rect x={-w / 2} y={-h * 0.5} width={w} height={h * 0.5} fill="#e6d4ae" stroke={sh} strokeWidth={2.4}/>
          <rect x={-w * 0.16} y={-h * 0.98} width={w * 0.32} height={h * 0.5} fill="#dccaa0" stroke={sh} strokeWidth={2.4}/><path d={`M${-w * 0.2},${-h * 0.98} L0,${-h * 1.14} L${w * 0.2},${-h * 0.98} Z`} fill="#a8532f"/>
          <circle cy={-h * 0.78} r={w * 0.1} fill="#fffaf0" stroke={sh} strokeWidth={3}/><path d={`M0,${-h * 0.78} V${-h * 0.78 - w * 0.07} M0,${-h * 0.78} L${w * 0.05},${-h * 0.78 + 2}`} stroke="#4a3a28" strokeWidth={3} strokeLinecap="round"/>
          <Windows x={-w / 2 + 24} y={-h * 0.42} cols={4} rows={1} gx={58} gy={50} lit={lit} f={f} seed={5}/>
        </>}
        {kind === "psu" && <>
          <rect x={-w / 2} y={-h} width={w} height={h} fill="#cfe0ea" stroke="#6a8aa0" strokeWidth={2.4}/><rect x={w * 0.1} y={-h} width={w * 0.4} height={h} fill="#8fb0c4" opacity={0.5}/>
          <Windows x={-w / 2 + 16} y={-h + 22} cols={6} rows={6} gx={(w - 32) / 6} gy={(h - 40) / 6} lit={lit} f={f} seed={9}/>
          <rect x={-w * 0.14} y={-h - 26} width={w * 0.28} height={26} fill="#6a8aa0"/>
          <g transform={`translate(0 ${-h - 52})`}><circle r={16} fill="#e3a53a" stroke="#7a5a22" strokeWidth={2.4}/>{Array.from({length: 8}).map((_, i) => <rect key={i} x={-3} y={-22} width={6} height={8} fill="#7a5a22" transform={`rotate(${i * 45})`}/>)}<circle r={6} fill="#fff3c0"/></g>
        </>}
      </g>
    </g>
  );
};

export const StateBuildingsArt: React.FC<AP> = (p) => {
  const {f, dur} = p, st = p.at("st"), ls = p.at("ls"), ah = p.at("ah");
  const GY = 700, span = Math.max(80, ah - 40 - ls);
  const lits = BLDS.map((_, i) => eo(prog(f, ls + (i * span) / 4, 22)));
  const join = eio(prog(f, ah, 40)), psuLit = eo(prog(f, ah + 34, 22));
  const roofA = eo(prog(f, st, 22));
  return (
    <g>
      <Sky id="w1s-sky" h={620} f={f}/>
      <Hills id="w1s-h1" base={600} amp={50} top="#a9c3d8" bottom="#cddcd6" seed={1.1} wl={280} bottomY={760}/>
      <rect x={-60} y={GY} width={W + 120} height={500} fill="#cdbf9c"/><rect x={-60} y={GY} width={W + 120} height={12} fill="#e9dcb8"/>
      {Array.from({length: 10}).map((_, i) => <path key={i} d={`M-60,${GY + 40 + i * 36} H${W + 60}`} stroke="#a89470" strokeWidth={1.4} opacity={0.3}/>)}
      <Tree x={60} y={GY + 14} s={0.85} f={f} seed={3}/>
      {BLDS.map((b, i) => <g key={i} transform={`translate(${b.x} ${GY + 6})`}><ellipse cx={0} cy={4} rx={b.w * 0.6} ry={12} fill="#2a1808" opacity={0.25}/><Building b={b} lit={lits[i]} f={f} idx={i}/></g>)}
      <g transform={`translate(${1780 + (1 - join) * 260} ${GY + 6})`} opacity={clamp(join * 3)}><ellipse cx={0} cy={4} rx={150} ry={12} fill="#2a1808" opacity={0.25}/><Building b={{x: 0, w: 220, h: 300, kind: "psu"}} lit={psuLit} f={f} idx={9}/></g>
      {/* the common roof: one sign above them all */}
      <g opacity={roofA} transform={`translate(0 ${-78 + (1 - roofA) * -18})`}>
        <path d="M120,372 L960,300 L1800,372 Z" fill="#b8532f" stroke="#7a2f18" strokeWidth={4} style={{filter: "drop-shadow(0 12px 10px rgba(40,22,8,.35))"}}/>
        <path d="M960,300 L1800,372 H960 Z" fill="#7a2f18" opacity={0.3}/>
        <rect x={150} y={372} width={1620} height={74} rx={6} fill="#f4e6c0" stroke="#7a2f18" strokeWidth={3}/>
        <text x={960} y={424} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={Math.min(46, 1560 / ((labOf(p, "st")?.text.length ?? 20) * 0.7))} letterSpacing="0.1em" fill="#5e2a0e">{labOf(p, "st")?.text.toUpperCase()}</text>
      </g>
    </g>
  );
};
export const StateBuildingsLabels: React.FC<AP> = (p) => {
  const ls = labOf(p, "ls"), ah = labOf(p, "ah");
  return <>
    {ls && <P2Card cx={690} y={750} text={ls.text} f={p.f} at={ls.at} size={30} maxW={880} upper={false} tone="cool"/>}
    {ah && <P2Card cx={1500} y={750} text={ah.text} f={p.f} at={ah.at} size={28} maxW={560} upper={false} tone="green"/>}
  </>;
};

// ---- rulebook -------------------------------------------------------------------------------------------------------------------
const Shield: React.FC<{s: number}> = ({s}) => (
  <g transform={`scale(${s})`}><path d="M0,-34 L28,-22 V4 Q28,26 0,38 Q-28,26 -28,4 V-22 Z" fill="#3f78b8" stroke="#1f3f7c" strokeWidth={3}/><path d="M0,-34 L28,-22 V4 Q28,26 0,38 Z" fill="#1f3f7c" opacity={0.3}/><circle cy={0} r={9} fill="#f6dc8a"/></g>
);

export const RulebookArt: React.FC<AP> = (p) => {
  const {f, dur} = p, lw = p.at("lw"), vd = p.at("vd"), a13 = p.at("a13");
  const parts = (labOf(p, "lw")?.text ?? "").split("·").map((s) => s.trim().toUpperCase()).filter(Boolean);
  const fan = eio(prog(f, Math.min(lw, vd - 70, a13 + 30), 40)), nameA = eo(prog(f, lw, 16)), grey = eio(prog(f, vd - 20, 30)), stamp = eo(prog(f, vd, 10)), tabA = eo(prog(f, a13, 18));
  const PXc = 960, PYc = 730, ang = [-66, -22, 22, 66];
  return (
    <g>
      <defs>
        <linearGradient id="w1r-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9c4a0"/><stop offset="1" stopColor="#c8ae84"/></linearGradient>
        <linearGradient id="w1r-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a6a3e"/><stop offset="1" stopColor="#6a4224"/></linearGradient>
        <linearGradient id="w1r-cover" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a4f86"/><stop offset="1" stopColor="#14284a"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={860} fill="url(#w1r-wall)"/>
      <path d="M1180,-40 L1700,-40 L1400,800 L900,800 Z" fill="#fff2c8" opacity={0.18}/>
      <g opacity={0.8}><rect x={110} y={140} width={300} height={390} rx={6} fill="#ece0c4" stroke="#8a6a44" strokeWidth={6}/><rect x={130} y={160} width={260} height={350} fill="#dbe9ee"/><path d="M260,160 V510 M130,330 H390" stroke="#8a6a44" strokeWidth={6}/></g>
      <rect x={-60} y={800} width={W + 120} height={400} fill="url(#w1r-desk)"/><rect x={-60} y={800} width={W + 120} height={10} fill="#c8935a"/>
      {Array.from({length: 10}).map((_, i) => <path key={i} d={`M-60,${830 + i * 24} Q600,${822 + i * 24} 2000,${836 + i * 24}`} stroke="#4a2a14" strokeWidth={1.6} fill="none" opacity={0.25}/>)}
      <ellipse cx={PXc} cy={812} rx={520} ry={22} fill="#2a1808" opacity={0.32}/>
      {/* fanned pages, drawn behind the book's front */}
      <clipPath id="w1r-clip"><rect x={0} y={0} width={1920} height={PYc + 8}/></clipPath>
      <g clipPath="url(#w1r-clip)">
      {parts.slice(0, 4).map((t, i) => {
        const a = ang[i] * fan, bad = i === 1, g = bad ? grey : 0, drop = bad ? g * 14 : 0;
        return (
          <g key={i} transform={`translate(${PXc} ${PYc}) rotate(${a + (bad ? g * 8 : 0)}) translate(0 ${drop})`} opacity={fan}>
            <g style={{filter: `grayscale(${g}) brightness(${1 - 0.18 * g})`}}>
              <rect x={-150} y={-470} width={300} height={440} rx={6} fill="#fbf3dc" stroke="#b8a074" strokeWidth={2.4} style={{filter: "drop-shadow(0 12px 10px rgba(40,22,8,.35))"}}/>
              <rect x={-150} y={-470} width={46} height={440} fill="#e8d9b4" opacity={0.6}/>
              <path d="M-90,-470 h180 v52 h-180 Z" fill={["#d8688a", "#e0802c", "#3f78b8", "#2f9a4a"][i]} opacity={0.9}/>
              <text x={0} y={-434} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={t.length > 9 ? 25 : 30} letterSpacing="0.09em" fill="#fff8e8" opacity={nameA}>{t}</text>
              {Array.from({length: 9}).map((_, k) => <rect key={k} x={-112} y={-398 + k * 32} width={224 - (k % 3) * 40} height={5} rx={2} fill="#9a8a6a" opacity={0.6}/>)}
              {bad && <g transform="translate(0 -250)"><Shield s={1.3 - 0.3 * g}/><path d={`M-170,${-30 + 10 * (1 - fan)} L170,30`} stroke="#c8301f" strokeWidth={9} strokeLinecap="round" strokeDasharray={`${400 * eo(prog(f, vd - 40, 24))} 400`} opacity={0.9}/></g>}
            </g>
          </g>
        );
      })}
      </g>
      {/* the thick book */}
      <g transform={`translate(${PXc} ${PYc + 6})`}>
        <path d="M-380,-10 L-340,-140 H340 L380,-10 Z" fill="#f6ecd2" stroke="#b8a074" strokeWidth={3}/>
        {Array.from({length: 7}).map((_, i) => <path key={i} d={`M-376,${-18 + i * 0} L${-338},${-136 + i * 4}`} stroke="#d8c9a4" strokeWidth={0} />)}
        <path d="M-380,-10 H380 V70 H-380 Z" fill="url(#w1r-cover)" stroke="#0f2140" strokeWidth={4}/>
        <path d="M-380,-10 H380 V8 H-380 Z" fill="#f6ecd2"/>
        {Array.from({length: 10}).map((_, i) => <path key={i} d={`M${-370 + i * 76},-8 V6`} stroke="#c8b88c" strokeWidth={2}/>)}
        <rect x={-340} y={22} width={680} height={6} fill="#f2d27a" opacity={0.7}/><rect x={-340} y={46} width={680} height={4} fill="#f2d27a" opacity={0.5}/>
        <path d="M-380,-10 L-340,-140 L-340,-110 L-380,20 Z" fill="#14284a" opacity={0.0}/>
        <g opacity={tabA} transform={`translate(0 ${-14 + (1 - tabA) * 10})`}>
          <path d="M-120,0 V-52 H120 V0 Z" fill="#b8321f" stroke="#7a1f12" strokeWidth={3} style={{filter: "drop-shadow(0 8px 6px rgba(40,22,8,.35))"}}/>
          <text x={0} y={-16} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={32} letterSpacing="0.08em" fill="#fff0cc">{labOf(p, "a13")?.text}</text>
        </g>
      </g>
      {/* VOID stamp on the page that crosses a right */}
      {stamp > 0.01 && (() => { const a = (ang[1] * fan) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), lx = 0, ly = -250 + 14 * grey, X = PXc + lx * c - ly * s, Y = PYc + lx * s + ly * c;
        const vt = (labOf(p, "vd")?.text ?? "").split("·").map((t) => t.trim()); return (
        <g transform={`translate(${X} ${Y + 90}) rotate(${-14 + (1 - stamp) * 20}) scale(${1 + (1 - stamp) * 0.7})`} opacity={clamp(stamp * 2)}>
          <rect x={-122} y={-52} width={244} height={104} rx={10} fill="none" stroke="#c8301f" strokeWidth={7}/>
          <text x={0} y={8} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={66} letterSpacing="0.12em" fill="#c8301f">{vt[0]}</text>
          <text x={0} y={40} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={24} letterSpacing="0.06em" fill="#c8301f">{vt.slice(1).join(" ")}</text>
        </g>); })()}
    </g>
  );
};
export const RulebookLabels: React.FC<AP> = () => null;

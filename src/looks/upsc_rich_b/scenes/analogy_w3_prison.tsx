// POL-03, builder W3: `prison-gate`. mode "tease" (a grey gate, the lock glints), "closed" (the same gate, calendar pages flying past for decades),
// "open" (the gate swings open onto daylight). Motion follows f, dur and at(key) only. No person's face: a lone silhouette seen from behind.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio, rng} from "../kit";
import {Cloud, Hills, Sun, Tree, prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {W3Defs, StoneWall, Motes} from "./analogy_w3_kit";

const GX = 960, GY0 = 236, GY1 = 884, LW = 400;

const Leaf: React.FC<{hx: number; dir: 1 | -1; ang: number}> = ({hx, dir, ang}) => {
  const c = Math.cos((ang * Math.PI) / 180), h = GY1 - GY0, bars = Array.from({length: 10}, (_, i) => 24 + i * 38);
  return (
    <g transform={`translate(${hx} ${((GY0 + GY1) / 2) * Math.sin((ang * Math.PI) / 180) * 0.05}) scale(${dir * c} ${1 - Math.sin((ang * Math.PI) / 180) * 0.05})`}>
      <rect x={0} y={GY0} width={LW} height={h} fill="#0c0e12" opacity={0.0}/>
      {bars.map((x, i) => (
        <g key={i}>
          <rect x={x - 7} y={GY0 + 12} width={14} height={h - 12} fill="url(#w3-iron)" stroke="#101216" strokeWidth={1.4}/>
          <path d={`M${x},${GY0 - 22} L${x + 9},${GY0 + 14} L${x - 9},${GY0 + 14} Z`} fill="url(#w3-iron)" stroke="#101216" strokeWidth={1.4}/>
          <rect x={x - 5} y={GY0 + 16} width={3} height={h - 22} fill="#fff" opacity={0.18}/>
        </g>
      ))}
      {[0.12, 0.5, 0.88].map((u, i) => <g key={i}><rect x={0} y={GY0 + u * h - 11} width={LW} height={22} fill="url(#w3-iron)" stroke="#101216" strokeWidth={1.6}/><rect x={0} y={GY0 + u * h - 10} width={LW} height={4} fill="#fff" opacity={0.2}/>
        {[24, 100, 200, 300, 376].map((rx) => <circle key={rx} cx={rx} cy={GY0 + u * h} r={3.4} fill="#6a7080" stroke="#101216" strokeWidth={0.8}/>)}</g>)}
      <rect x={-9} y={GY0 - 4} width={18} height={h + 8} fill="url(#w3-iron)" stroke="#101216" strokeWidth={2}/>
      <rect x={LW - 18} y={GY0 - 4} width={18} height={h + 8} fill="url(#w3-iron)" stroke="#101216" strokeWidth={2}/>
      <rect x={-9} y={GY0 - 6} width={LW + 9} height={16} fill="url(#w3-iron)" stroke="#101216" strokeWidth={2}/>
    </g>
  );
};

const Lock: React.FC<{x: number; y: number; f: number; glint: number}> = ({x, y, f, glint}) => {
  const p = Math.pow(Math.max(0, Math.sin(f / 15)), 8) * glint;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={58} rx={46} ry={8} fill="#000" opacity={0.3}/>
      <path d="M-22,-26 Q-22,-70 0,-70 Q22,-70 22,-26" fill="none" stroke="#9aa0ab" strokeWidth={13} strokeLinecap="round"/>
      <path d="M-22,-26 Q-22,-70 0,-70" fill="none" stroke="#e8ecf2" strokeWidth={3} opacity={0.7} strokeLinecap="round" transform="translate(-3 0)"/>
      <rect x={-42} y={-30} width={84} height={86} rx={12} fill="url(#w3-brass)" stroke="#5a3c0c" strokeWidth={3}/>
      <rect x={-36} y={-24} width={72} height={26} rx={8} fill="#fff" opacity={0.2}/>
      <circle cx={0} cy={10} r={9} fill="#2a1a06"/><path d="M-4,14 L4,14 L6,34 L-6,34 Z" fill="#2a1a06"/>
      {p > 0.02 && <g transform="translate(-30 -18)" opacity={p}>
        <path d="M0,-34 L5,-5 L34,0 L5,5 L0,34 L-5,5 L-34,0 L-5,-5 Z" fill="#fff"/><circle r={20} fill="url(#w3-glow)"/>
      </g>}
    </g>
  );
};

const Chain: React.FC<{y: number; x0: number; x1: number; sag?: number}> = ({y, x0, x1, sag = 0}) => {
  const n = Math.floor((x1 - x0) / 34);
  return (<g>{Array.from({length: n + 1}, (_, i) => {
    const u = i / n, x = x0 + u * (x1 - x0), yy = y + Math.sin(Math.PI * u) * sag;
    return i % 2 ? <rect key={i} x={x - 8} y={yy - 14} width={16} height={28} rx={8} fill="none" stroke="#3a3e48" strokeWidth={7}/> : <ellipse key={i} cx={x} cy={yy} rx={18} ry={9} fill="none" stroke="#585e6c" strokeWidth={7}/>;
  })}</g>);
};

const Page: React.FC<{x: number; y: number; r: number; s: number; a: number}> = ({x, y, r, s, a}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={a}>
    <rect x={-58} y={-72} width={116} height={146} rx={5} fill="#000" opacity={0.22} transform="translate(6 10)"/>
    <rect x={-58} y={-72} width={116} height={146} rx={5} fill="url(#w3-paper)" stroke="#a88a58" strokeWidth={2}/>
    <rect x={-58} y={-72} width={116} height={34} rx={5} fill="#c8402a"/><rect x={-58} y={-52} width={116} height={14} fill="#c8402a"/>
    {[-30, 30].map((cx) => <circle key={cx} cx={cx} cy={-72} r={5} fill="#4a4a50"/>)}
    {Array.from({length: 4}, (_, r2) => Array.from({length: 5}, (_, c) => <rect key={`${r2}${c}`} x={-48 + c * 20} y={-26 + r2 * 24} width={14} height={16} rx={2} fill="#e3d5b4" stroke="#c2ad82" strokeWidth={0.8}/>))}
  </g>
);

const Walker: React.FC<{x: number; y: number; s: number; f: number}> = ({x, y, s, f}) => {
  const sw = Math.sin(f / 5.4) * 0.42, bob = -Math.abs(Math.cos(f / 5.4)) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={2} rx={54} ry={9} fill="#1a2a10" opacity={0.3}/>
      <g transform={`translate(0 ${bob})`}>
        {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 12} -110) rotate(${sd * sw * 57})`}><path d="M-11,0 L11,0 L9,108 L-9,108 Z" fill="#2c3340"/><ellipse cx={0} cy={110} rx={13} ry={6} fill="#14100c"/></g>)}
        <path d="M-30,-216 Q-38,-170 -30,-104 L30,-104 Q38,-170 30,-216 Q0,-232 -30,-216 Z" fill="#8a6f4a" stroke="#4a3822" strokeWidth={2}/>
        <path d="M6,-218 Q34,-214 30,-216 Q38,-170 30,-104 L6,-104 Z" fill="#000" opacity={0.16}/>
        {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 30},-210 L${sd * 38},-150 L${sd * 30},-130`} stroke="#8a6f4a" strokeWidth={13} strokeLinecap="round" fill="none"/>)}
        <ellipse cx={0} cy={-246} rx={17} ry={20} fill="#2a1c14"/>
        <rect x={-62} y={-196} width={34} height={44} rx={6} fill="#c8b48a" stroke="#6a5834" strokeWidth={2} transform="rotate(-6 -45 -170)"/>
      </g>
    </g>
  );
};

export const PrisonArt: React.FC<AP> = (p) => {
  const {f, dur} = p, mode = (p.spec as any).mode ?? "tease", open = mode === "open", closed = mode === "closed", tease = mode === "tease";
  const T = clamp(f / Math.max(1, dur));
  const mg = open ? p.at("mg") : 0;
  const ang = open ? eio(prog(f, 28, 130)) * 76 : 0, oa = open ? eio(prog(f, 28, 130)) : 0;
  const lockFall = open ? eio(prog(f, 8, 24)) : 0;
  const push = tease ? 1 + 0.16 * eio(T) : 1;
  const beamX = closed ? ((f * 0.9) % 700) - 200 : tease ? 40 : 0;
  const dayCycle = closed ? 0.5 + 0.5 * Math.sin(f / 15) : 0;
  const pagesN = 12;
  const dark = open ? 0 : 1;
  return (
    <g>
      <W3Defs/>
      <g transform={`translate(${GX} 560) scale(${push}) translate(${-GX} -560)`}>
        {/* the world behind the gate */}
        <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#1c1f26"/>
        {open ? (
          <g>
            <rect x={520} y={GY0 - 20} width={880} height={GY1 - GY0 + 30} fill="url(#w3-day)"/>
            <Sun x={1090} y={380} r={44} f={f} glow={1.1}/>
            <Cloud x={560} y={330} s={0.6} f={f} speed={0.1} seed={4} a={0.85}/>
            <Hills id="w3h1" base={620} amp={50} top="#b6cde0" bottom="#d8e2de" seed={2.1} wl={260} bottomY={900}/>
            <Hills id="w3h2" base={680} amp={36} top="#9cc0a0" bottom="#c5d8a8" seed={4.2} wl={220} bottomY={900}/>
            <Tree x={640} y={730} s={0.55} f={f} seed={3} hue={8}/><Tree x={1290} y={730} s={0.5} f={f} seed={5} hue={14}/>
            <path d="M840,884 L1080,884 L1020,700 L900,700 Z" fill="#dcc596" opacity={0.95}/>
            <path d="M900,700 L1020,700 L1000,650 L920,650 Z" fill="#d8c08e" opacity={0.9}/>
            <path d="M880,884 L930,700 M1040,884 L990,700" stroke="#b79a64" strokeWidth={2} opacity={0.6}/>
            <rect x={520} y={GY0 - 20} width={880} height={GY1 - GY0 + 30} fill="url(#w3-glow)" opacity={0.25 * oa}/>
          </g>
        ) : (
          <g>
            <rect x={520} y={GY0 - 20} width={880} height={GY1 - GY0 + 30} fill="#14161c"/>
            <path d="M600,884 L1320,884 L1100,520 L820,520 Z" fill="#23262e"/>
            <rect x={820} y={400} width={280} height={150} fill="#1a1c22"/>
            <path d="M820,520 L820,400 Q960,330 1100,400 L1100,520" fill="none" stroke="#2e323b" strokeWidth={6}/>
            {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={560 + i * 170} y={300} width={4} height={560} fill="#2a2d36" opacity={0.6}/>)}
          </g>
        )}
        {/* stone wall with an arched lintel, lit from the left */}
        <StoneWall x={-60} y={-40} w={620} h={930} seed={4} base={[215, 8, 50]}/>
        <StoneWall x={1360} y={-40} w={620} h={930} seed={5} base={[215, 8, 50]}/>
        <StoneWall x={500} y={-40} w={920} h={GY0 - 16} seed={6} base={[215, 8, 46]}/>
        <path d="M520,250 L520,208 Q960,150 1400,208 L1400,250" fill="#9aa0ac" stroke="#4e535e" strokeWidth={4}/>
        <path d="M520,208 Q960,150 1400,208" fill="none" stroke="#e6eaf0" strokeWidth={3} opacity={0.45}/>
        <rect x={500} y={GY1 - 4} width={920} height={20} fill="#6a6f7a" stroke="#3a3e48" strokeWidth={2}/>
        {/* floor flagstones in perspective */}
        <path d={`M-60,${GY1 + 16} L${W + 60},${GY1 + 16} L${W + 60},${H + 60} L-60,${H + 60} Z`} fill="#555a65"/>
        {Array.from({length: 13}, (_, i) => <path key={i} d={`M${GX + (i - 6) * 70},${GY1 + 16} L${GX + (i - 6) * 330},${H + 60}`} stroke="#3a3e48" strokeWidth={2} opacity={0.7}/>)}
        {[0.2, 0.5, 0.95].map((u, i) => <path key={i} d={`M-60,${GY1 + 16 + u * 190 * u} L${W + 60},${GY1 + 16 + u * 190 * u}`} stroke="#3a3e48" strokeWidth={2} opacity={0.7}/>)}
        <rect x={-60} y={GY1 + 16} width={W + 120} height={40} fill="url(#w3-beam)" opacity={0.05}/>
        {open && <path d={`M780,${GY1 + 16} L1140,${GY1 + 16} L1500,${H + 60} L420,${H + 60} Z`} fill="#fff1c0" opacity={0.34 * oa}/>}
        {/* the gate */}
        <g>
          <Leaf hx={GX - LW} dir={1} ang={-ang * 0 + ang}/>
          <Leaf hx={GX + LW} dir={-1} ang={ang}/>
        </g>
        {!open && <Chain y={560} x0={GX - 330} x1={GX + 330}/>}
        {!open && <Chain y={600} x0={GX - 330} x1={GX + 330} sag={14}/>}
        {!open && <Lock x={GX} y={560} f={f} glint={tease ? 1.2 : 0.8}/>}
        {open && <g opacity={1}><Chain y={910} x0={640} x1={780} sag={6}/><g transform={`translate(840 ${896}) rotate(14) scale(0.5)`}><rect x={-42} y={-30} width={84} height={86} rx={12} fill="url(#w3-brass)" stroke="#5a3c0c" strokeWidth={3}/><path d="M-22,-30 Q-22,-70 0,-70 Q22,-70 22,-44" fill="none" stroke="#9aa0ab" strokeWidth={13} strokeLinecap="round"/></g></g>}
        {open && f > 150 && <Walker x={960 + Math.sin(f / 60) * 3} y={850 - 190 * eio(prog(f, 150, Math.max(60, dur - 170)))} s={0.62 - 0.28 * eio(prog(f, 150, Math.max(60, dur - 170)))} f={f}/>}
      </g>
      {/* light shaft from a high window; sweeps across the wall as the years pass */}
      {!open && <g opacity={0.9}>
        <g transform={`translate(${beamX} 0)`}>
          <path d="M-120,40 L130,40 L520,860 L170,860 Z" fill="url(#w3-beam)" opacity={tease ? 0.55 : 0.4}/>
          <path d="M60,40 L130,40 L420,860 L360,860 Z" fill="#fff" opacity={0.05}/>
        </g>
        <Motes f={f} x0={20} x1={640} y0={60} y1={860} n={26}/>
      </g>}
      {open && <g><path d="M200,40 L520,40 L900,880 L420,880 Z" fill="url(#w3-beam)" opacity={0.5 * oa}/><Motes f={f} x0={560} x1={1360} y0={260} y1={860} n={30} seed={9} col="#fff3c8"/></g>}
      {/* time passing: a slow dark-bright pulse and calendar pages in the foreground */}
      {closed && <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#0a1226" opacity={0.28 * dayCycle}/>}
      {closed && Array.from({length: pagesN}, (_, i) => {
        const g = rng(i * 13 + 5), u = ((f * 0.011 + i / pagesN) % 1), x = 1960 - u * 2080, y = 330 + g() * 320 + Math.sin(u * 9 + i) * 70;
        return <Page key={i} x={x} y={y} r={u * 640 + i * 41} s={0.7 + g() * 0.45} a={Math.min(1, u * 8, (1 - u) * 8) * 0.95}/>;
      })}
      {tease && <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#2a3040" opacity={0.18}/>}
    </g>
  );
};

export const PrisonLabels: React.FC<AP> = (p) => {
  const mode = (p.spec as any).mode ?? "tease", L = rlabs(p);
  if (mode === "tease") return L[0] ? <P2Card cx={960} y={84} text={L[0].text} f={p.f} at={L[0].at} size={44} maxW={1400} upper={false}/> : null;
  if (mode === "closed") return (
    <>
      {L[0] && <P2Card cx={960} y={84} text={L[0].text} f={p.f} at={L[0].at} size={46} maxW={1300}/>}
      {L[1] && <P2Card cx={1612} y={470} text={L[1].text} f={p.f} at={L[1].at} size={32} maxW={420} upper={false}/>}
    </>
  );
  return (
    <>
      {L[0] && <P2Card cx={326} y={300} text={L[0].text} f={p.f} at={L[0].at} size={32} maxW={430} upper={false}/>}
      {L[1] && <P2Card cx={1594} y={300} text={L[1].text} f={p.f} at={L[1].at} size={32} maxW={430} upper={false}/>}
    </>
  );
};

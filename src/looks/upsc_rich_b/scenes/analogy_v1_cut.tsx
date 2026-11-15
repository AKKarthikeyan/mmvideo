// GEO-04 Part 1, builder V1: `cutaway`. One mountain cut open: strata, vent and cone (mode "vent"), then the magma chamber, the lava flow and the ground line (mode "magma").
import React from "react";
import {Tree, Cloud, Sun, Hills, type AP} from "./analogy_kit";
import {Leader, Puffs, Speckle, coneY, curve, eo, eio, mixn, mkLabels, poly, prog, rnd, sampleY} from "./analogy_v1_kit";

export const GROUND = 700, CX = 960, CH = 380, HW = 500, CR = 36, CD = 30;
export const surf = (x: number) => coneY(x, CX, GROUND, CH, HW, CR, CD, 1.6);
const SX0 = CX - HW, SX1 = CX + HW;
const prof = sampleY(surf, SX0, SX1, 6);
const wavy = (base: number, amp: number, per: number, ph: number) => {
  const pts = sampleY((x) => base + amp * Math.sin(x / per + ph) + amp * 0.4 * Math.sin(x / (per * 0.43) + ph * 2), -20, 1940, 24);
  return pts;
};

const LAYERS: {top: number; amp: number; per: number; ph: number; c1: string; c2: string}[] = [
  {top: 704, amp: 4, per: 180, ph: 0.3, c1: "#7a5236", c2: "#5a3a26"},
  {top: 770, amp: 14, per: 210, ph: 1.4, c1: "#d3a971", c2: "#b78a54"},
  {top: 846, amp: 18, per: 260, ph: 2.6, c1: "#a29c93", c2: "#827c74"},
  {top: 926, amp: 12, per: 190, ph: 4.1, c1: "#bb7a52", c2: "#96583a"},
  {top: 996, amp: 10, per: 230, ph: 5.2, c1: "#6d5560", c2: "#4a3641"},
];

const Strata: React.FC = () => (
  <g clipPath="url(#v1c-under)">
    {LAYERS.map((L, i) => {
      const top = wavy(L.top, L.amp, L.per, L.ph);
      return (
        <g key={i}>
          <path d={`${poly(top)} L1940,1100 L-20,1100 Z`} fill={L.c1}/>
          <path d={poly(top.map(([x, y]) => [x, y + 5] as [number, number]))} fill="none" stroke="#fff" strokeWidth={2} opacity={0.18}/>
          <path d={poly(top)} fill="none" stroke={L.c2} strokeWidth={3} opacity={0.8}/>
          <path d={`${poly(top.map(([x, y]) => [x, y + 14 + (i % 2) * 6] as [number, number]))}`} fill="none" stroke={L.c2} strokeWidth={5} opacity={0.22} strokeDasharray="60 38"/>
        </g>
      );
    })}
    {LAYERS.map((L, i) => <Speckle key={`s${i}`} x={-20} y={L.top} w={1960} h={80} n={90} seed={i * 11 + 3} cols={[L.c2, "#ffffff", "#2a1a10"]} op={0.22} rmax={4}/>)}
  </g>
);

const ConeBody: React.FC<{f: number}> = () => {
  const bands = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  return (
    <g>
      <path d={`${poly(prof)} L${SX1},${GROUND + 2} L${SX0},${GROUND + 2} Z`} fill="#b3a99c"/>
      <g clipPath="url(#v1c-cone)">
        {bands.map((k) => (
          <path key={k} d={poly(prof.map(([x, y]) => [x, y + 8 + k * 21] as [number, number]))} fill="none" stroke={k % 2 ? "#6d4a40" : "#c1b6a5"} strokeWidth={k % 2 ? 11 : 13} opacity={0.95}/>
        ))}
        {bands.map((k) => (
          <path key={`h${k}`} d={poly(prof.map(([x, y]) => [x, y + 3 + k * 21] as [number, number]))} fill="none" stroke="#fff" strokeWidth={1.6} opacity={0.2}/>
        ))}
        <Speckle x={SX0} y={CH ? GROUND - CH : 360} w={HW * 2} h={CH} n={220} seed={91} cols={["#3a2a28", "#e7ddcc", "#8f7466"]} op={0.3} rmax={3.2}/>
        {/* right side in shade, left side lit */}
        <rect x={CX} y={GROUND - CH - 20} width={HW + 20} height={CH + 30} fill="#2b2038" opacity={0.2}/>
      </g>
    </g>
  );
};

/** outer skin of the mountain: green lower flank, bare grey summit, relief shading */
const Skin: React.FC = () => (
  <g>
    <path d={poly(prof)} fill="none" stroke="#4e5a3c" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round"/>
    <path d={poly(prof.filter(([x]) => x < CX - CR).map(([x, y]) => [x, y - 3] as [number, number]))} fill="none" stroke="#9cb273" strokeWidth={6} opacity={0.9}/>
    <path d={poly(prof.filter(([x]) => x > CX + CR).map(([x, y]) => [x, y - 3] as [number, number]))} fill="none" stroke="#5f7a52" strokeWidth={6} opacity={0.9}/>
    <path d={poly(prof.filter(([x]) => Math.abs(x - CX) < 130).map(([x, y]) => [x, y - 3] as [number, number]))} fill="none" stroke="#bdb6ae" strokeWidth={8} strokeLinecap="round"/>
  </g>
);

const flowFraction = (p: number) => {
  const pts = sampleY(surf, CX + CR, SX1 - 30, 6), n = Math.max(2, Math.floor(pts.length * p));
  return pts.slice(0, n).map(([x, y]) => [x, y - 2] as [number, number]);
};

export const CutArt: React.FC<AP> = ({f, dur, spec, at}) => {
  const magma = (spec as any).mode === "magma";
  const tDf = magma ? 1e9 : at("df"), tVt = magma ? 1e9 : at("vt"), tMg = magma ? at("mg") : 1e9, tLv = magma ? at("lv") : 1e9;
  const df = magma ? 0 : eo(prog(f, tDf, 22)), vt = magma ? 0 : eo(prog(f, tVt, 26));
  const pulse = 0.7 + 0.3 * Math.sin(f / 7);
  const mg = magma ? eo(prog(f, tMg - 8, 46)) : 0, rise = magma ? eio(prog(f, tMg + 4, 70)) : 0, lv = magma ? prog(f, tLv - 6, 90) : 0;
  const gl = magma ? eo(prog(f, tLv + 20, 40)) * (0.75 + 0.25 * Math.sin(f / 11)) : 0;
  const flow = flowFraction(eio(lv));
  const pipeTopY = surf(CX) + 2, pipeBotY = 818;
  const fillTop = mixn(pipeBotY, pipeTopY + 4, rise);
  const pipePts: [number, number][] = [[CX, pipeBotY], [CX + 8, 740], [CX - 7, 640], [CX + 6, 540], [CX - 4, 450], [CX, pipeTopY]];
  const pipe = curve(pipePts);
  return (
    <g>
      <defs>
        <linearGradient id="v1c-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bcd9ec"/><stop offset="0.7" stopColor="#f2e8d1"/><stop offset="1" stopColor="#f8dcb0"/></linearGradient>
        <linearGradient id="v1c-mag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffd470"/><stop offset="0.45" stopColor="#ff7a24"/><stop offset="1" stopColor="#b8200c"/></linearGradient>
        <radialGradient id="v1c-chamber" cx="50%" cy="45%" r="60%"><stop offset="0" stopColor="#ffe08a"/><stop offset="0.4" stopColor="#ff8a2a"/><stop offset="1" stopColor="#a82410"/></radialGradient>
        <radialGradient id="v1c-halo" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ff9a3c" stopOpacity="0.8"/><stop offset="1" stopColor="#ff5a1c" stopOpacity="0"/></radialGradient>
        <linearGradient id="v1c-fade" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="830"><stop offset="0" stopColor="#1f1316"/><stop offset="1" stopColor="#1f1316" stopOpacity="0"/></linearGradient>
        <linearGradient id="v1c-fade2" gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="830"><stop offset="0" stopColor="#4a2e2e"/><stop offset="1" stopColor="#4a2e2e" stopOpacity="0"/></linearGradient>
        <filter id="v1c-b8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
        <filter id="v1c-b3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
        <clipPath id="v1c-under"><rect x={-20} y={GROUND} width={1960} height={400}/></clipPath>
        <clipPath id="v1c-cone"><path d={`${poly(prof)} L${SX1},${GROUND + 2} L${SX0},${GROUND + 2} Z`}/></clipPath>
        <clipPath id="v1c-pipe"><path d={pipe} stroke="#000" strokeWidth={30} fill="none"/><rect x={CX - 20} y={fillTop} width={40} height={900}/></clipPath>
      </defs>
      <rect width={1920} height={GROUND + 20} fill="url(#v1c-sky)"/>
      <Sun x={110} y={112} r={44} f={f}/>
      <Cloud x={700} y={130} s={1.1} f={f} speed={0.12} seed={2}/>
      <Cloud x={1380} y={120} s={0.8} f={f} speed={0.1} seed={5}/>
      <Hills id="v1c-h1" base={560} amp={70} top="#a8c4cf" bottom="#cfdcd6" seed={3} wl={520} bottomY={GROUND}/>
      <Hills id="v1c-h2" base={640} amp={46} top="#8fb49a" bottom="#b9d0a8" seed={8} wl={400} bottomY={GROUND}/>
      {/* flat ground each side, with grass and trees */}
      <rect x={-20} y={GROUND - 6} width={1960} height={14} fill="#86a85c"/>
      {[[130, 1.0, 1], [330, 0.8, 2], [570, 0.62, 3], [1370, 0.64, 4], [1590, 0.82, 5], [1790, 1.0, 6]].map(([x, s, sd]) => <Tree key={sd} x={x} y={GROUND} s={s} f={f} seed={sd} hue={sd * 5}/>)}
      <Strata/>
      {/* the cut face of the cone */}
      <ConeBody f={f}/>
      <Skin/>
      {/* the pipe (vent) from the chamber to the crater: hollow & dark in "vent", filled with magma in "magma" */}
      <path d={pipe} stroke={magma ? "#1f1316" : "url(#v1c-fade)"} strokeWidth={34} fill="none" strokeLinecap="round"/>
      <path d={pipe} stroke={magma ? "#4a2e2e" : "url(#v1c-fade2)"} strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.9}/>
      {magma && (
        <g>
          <g clipPath="url(#v1c-pipe)">
            <path d={pipe} stroke="url(#v1c-mag)" strokeWidth={26} fill="none" strokeLinecap="round"/>
            <path d={pipe} stroke="#ffe7a0" strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray="30 50" strokeDashoffset={f * 1.6} opacity={0.8}/>
          </g>
          <path d={pipe} stroke="#ff7a2a" strokeWidth={40} fill="none" strokeLinecap="round" opacity={0.35 * rise} filter="url(#v1c-b8)"/>
        </g>
      )}
      {/* chamber */}
      {magma && <g>
        <path d="M660,905 Q664,840 740,822 Q860,800 960,806 Q1090,800 1190,826 Q1262,850 1266,912 Q1262,982 1180,1004 Q1060,1030 940,1026 Q800,1030 720,1000 Q656,970 660,905 Z" fill="#241218" stroke="#150a0c" strokeWidth={5}/>
        {magma && (
          <g opacity={mg}>
            <ellipse cx={960} cy={915} rx={420} ry={190} fill="url(#v1c-halo)" opacity={0.75 * (0.85 + 0.15 * Math.sin(f / 13))}/>
            <path d="M672,905 Q676,846 748,830 Q860,810 960,815 Q1086,810 1180,834 Q1250,856 1254,912 Q1250,974 1176,994 Q1060,1018 940,1014 Q806,1018 728,990 Q668,962 672,905 Z" fill="url(#v1c-chamber)"/>
            {Array.from({length: 9}).map((_, i) => {
              const x = 730 + rnd(i, 3) * 460, y = 850 + rnd(i, 4) * 130, r = 18 + rnd(i, 5) * 26;
              return <ellipse key={i} cx={x + Math.sin(f / 40 + i) * 14} cy={y + Math.cos(f / 33 + i * 2) * 8} rx={r * 1.6} ry={r * 0.7} fill={i % 2 ? "#ffcf6a" : "#ff6a1c"} opacity={0.5}/>;
            })}
          </g>
        )}
      </g>}
      {/* crater: steam and a little ash for "vent"; a lava fountain when the magma arrives */}
      <ellipse cx={CX} cy={surf(CX) - 2} rx={CR + 4} ry={9} fill={magma ? "#7a2a16" : "#3a2a2c"}/>
      {magma && <ellipse cx={CX} cy={surf(CX) - 3} rx={CR - 2} ry={6} fill="#ffcf72" opacity={rise}/>}
      <Puffs f={f} n={9} x0={CX} y0={surf(CX) - 8} rise={magma ? 80 : 150} drift={50} r0={16} r1={magma ? 36 : 54} speed={0.0045} seed={5} spread={26} wob={14}
        cols={magma ? ["#d9c7b8", "#8f7f78", "#4f4244"] : ["#ffffff", "#e6e3df", "#b6b5bb"]} op={magma ? 0.8 * rise : 0.95}/>
      {/* vent highlight: pulsing gold halo on the pipe and the crater lip */}
      {df > 0 && !magma && (
        <g opacity={df}>
          <path d={pipe} stroke="#ffd25a" strokeWidth={50} fill="none" strokeLinecap="round" opacity={0.28 * pulse} filter="url(#v1c-b8)"/>
          <path d={pipe} stroke="#ffe39a" strokeWidth={34} fill="none" strokeLinecap="round" opacity={0.5 * pulse}/>
          <path d={pipe} stroke="#2a1a1a" strokeWidth={24} fill="none" strokeLinecap="round" opacity={0.85}/>
          <ellipse cx={CX} cy={surf(CX) - 2} rx={CR + 12 + 4 * pulse} ry={14} fill="none" stroke="#ffd25a" strokeWidth={5} opacity={0.9}/>
        </g>
      )}
      {/* cone highlight: a glowing outline all along the slope and a base bracket */}
      {vt > 0 && !magma && (
        <g opacity={vt}>
          <path d={poly(prof.map(([x, y]) => [x, y - 6] as [number, number]))} fill="none" stroke="#ffe39a" strokeWidth={14} opacity={0.45 * pulse} strokeLinecap="round" filter="url(#v1c-b3)"/>
          <path d={poly(prof.map(([x, y]) => [x, y - 6] as [number, number]))} fill="none" stroke="#fff3c4" strokeWidth={4.5} strokeLinecap="round"/>
          <path d={`M${SX0},${GROUND + 30} L${SX0},${GROUND + 44} L${SX1},${GROUND + 44} L${SX1},${GROUND + 30}`} fill="none" stroke="#ffe39a" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={0.0}/>
        </g>
      )}
      {/* the red flow on the slope */}
      {magma && flow.length > 1 && (
        <g>
          <path d={poly(flow)} stroke="#ff5a1c" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.4} filter="url(#v1c-b8)"/>
          {flow.slice(0, -1).map((a, i) => <path key={`k${i}`} d={`M${a[0]},${a[1] - 2} L${flow[i + 1][0]},${flow[i + 1][1] - 2}`} stroke="#3a1410" strokeWidth={9 + (i / flow.length) * 14} strokeLinecap="round" fill="none"/>)}
          {flow.slice(0, -1).map((a, i) => <path key={`r${i}`} d={`M${a[0]},${a[1] - 3} L${flow[i + 1][0]},${flow[i + 1][1] - 3}`} stroke="#e4421a" strokeWidth={6 + (i / flow.length) * 11} strokeLinecap="round" fill="none"/>)}
          <path d={poly(flow.map(([x, y]) => [x, y - 3] as [number, number]))} stroke="#ffd070" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="14 40" strokeDashoffset={-f * 1.8} opacity={0.95}/>
        </g>
      )}
      {/* the glowing ground line: the border between "below" and "above" */}
      {gl > 0 && (
        <g opacity={gl}>
          <line x1={20} x2={1900} y1={GROUND + 2} y2={GROUND + 2} stroke="#ff8a2c" strokeWidth={12} opacity={0.35} filter="url(#v1c-b3)"/>
          <line x1={20} x2={1900} y1={GROUND + 2} y2={GROUND + 2} stroke="#ffd27a" strokeWidth={4} strokeDasharray="22 12"/>
        </g>
      )}
      <Leader pts={[[610, 330], [800, 344], [930, surf(CX) + 8]]} f={f} at={magma ? 1e9 : tDf} col="#5a2a10"/>
      <Leader pts={[[1330, 440], [1244, surf(1244) - 4]]} f={f} at={magma ? 1e9 : tVt} col="#5a2a10"/>
      <Leader pts={[[640, 842], [700, 884]]} f={f} at={tMg} col="#fff0d0"/>
      <Leader pts={[[1262, 408], [1196, surf(1196) - 4]]} f={f} at={tLv} col="#5a2a10"/>
    </g>
  );
};

export const CutLabels: React.FC<AP> = (p) => {
  const L = (p.spec as any).mode === "magma"
    ? mkLabels({mg: {cx: 320, y: 790, size: 36, maxW: 520, tone: "dark"}, lv: {cx: 1500, y: 310, size: 38, maxW: 520}, nc: {cx: 1500, y: 790, size: 27, maxW: 560, tone: "cool"}, ex: {cx: 960, y: 96, size: 46, maxW: 1000, tone: "dark"}})
    : mkLabels({df: {cx: 420, y: 190, size: 36, maxW: 560}, vt: {cx: 1500, y: 300, size: 38, maxW: 560}});
  return <L {...p}/>;
};

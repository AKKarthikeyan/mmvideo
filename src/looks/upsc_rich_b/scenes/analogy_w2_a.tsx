// POL-03 Part 1, builder W2 (a): `frame-crane` (a crane swaps bricks, the glowing inner frame cannot be touched), `two-circles` (EVERY PERSON / CITIZENS),
// `judge-scale` (one pan, two people of different rank, then two queues treated alike). Motion depends only on f, dur and at(key).
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio} from "../kit";
import {Cloud, Hills, Sun, Tree, prog, type AP} from "./analogy_kit";
import {P2Card} from "./analogy_p2b_kit";
import {Adult, reach, mix2, type Look} from "./analogy_e1_kit";
import {Person} from "./analogy_kit";
import {WDefs, lk, a01, sm, Bricks, Plaque, Tick} from "./analogy_w2_kit";

type P = [number, number];

// ---- frame-crane ---------------------------------------------------------------------------------------------------------------
const wpAt = (wp: [number, number, number][], t: number): P => {
  if (t <= wp[0][0]) return [wp[0][1], wp[0][2]];
  for (let i = 1; i < wp.length; i++) if (t <= wp[i][0]) { const u = eio((t - wp[i - 1][0]) / Math.max(1e-6, wp[i][0] - wp[i - 1][0])); return [wp[i - 1][1] + (wp[i][1] - wp[i - 1][1]) * u, wp[i - 1][2] + (wp[i][2] - wp[i - 1][2]) * u]; }
  const l = wp[wp.length - 1]; return [l[1], l[2]];
};
const STACK: P = [1225, 748], GAP1: P = [1009, 530], GAP2: P = [336, 650], FRM = 700, SHIELD_Y = 492;

const Crane: React.FC<{tx: number; hy: number; brick?: P | null; f: number}> = ({tx, hy, brick}) => {
  const TX = 1330, JY = 196;
  const lat: React.ReactNode[] = [];
  for (let y = 790; y > 230; y -= 46) lat.push(<path key={y} d={`M${TX - 20},${y} L${TX + 20},${y - 46} M${TX + 20},${y} L${TX - 20},${y - 46}`} stroke="#a8641c" strokeWidth={3} fill="none"/>);
  const jl: React.ReactNode[] = [];
  for (let x = 260; x < 1560; x += 52) jl.push(<path key={x} d={`M${x},${JY + 30} L${x + 26},${JY} L${x + 52},${JY + 30}`} stroke="#a8641c" strokeWidth={2.6} fill="none"/>);
  return (
    <g>
      <ellipse cx={TX} cy={792} rx={90} ry={12} fill="#2a1808" opacity={0.3}/>
      <rect x={TX - 56} y={772} width={112} height={22} rx={4} fill="#7a5a3a"/>
      <rect x={TX - 20} y={JY + 20} width={7} height={576} fill="#e9a23a" stroke="#a8641c" strokeWidth={1.6}/><rect x={TX + 13} y={JY + 20} width={7} height={576} fill="#e9a23a" stroke="#a8641c" strokeWidth={1.6}/>
      {lat}
      <rect x={250} y={JY - 2} width={1316} height={9} fill="#e9a23a" stroke="#a8641c" strokeWidth={1.6}/><rect x={250} y={JY + 28} width={1316} height={7} fill="#e9a23a" stroke="#a8641c" strokeWidth={1.4}/>
      {jl}
      <rect x={1470} y={JY + 2} width={86} height={56} rx={3} fill="#8a8f98" stroke="#4a4f58" strokeWidth={2}/><rect x={1480} y={JY + 12} width={66} height={36} fill="#9ea3ac" opacity={0.7}/>
      <rect x={TX - 40} y={JY - 44} width={80} height={46} rx={7} fill="#f0b84a" stroke="#a8641c" strokeWidth={2}/><rect x={TX - 30} y={JY - 36} width={36} height={28} rx={3} fill="#bfe0ee" stroke="#6d98ac" strokeWidth={1.6}/>
      <path d={`M${TX},${JY - 44} L${TX},${JY - 76} M${TX - 18},${JY - 70} L${TX + 18},${JY - 70}`} stroke="#a8641c" strokeWidth={3}/>
      <rect x={tx - 20} y={JY + 6} width={40} height={20} rx={3} fill="#3a3f48"/>
      <path d={`M${tx},${JY + 26} L${tx},${hy}`} stroke="#3a3f48" strokeWidth={3}/>
      <g transform={`translate(${tx} ${hy})`}><rect x={-9} y={0} width={18} height={14} rx={3} fill="#3a3f48"/><path d="M-12,14 Q-12,30 0,30 Q12,30 12,14" stroke="#c4372b" strokeWidth={5} fill="none" strokeLinecap="round"/></g>
      {brick && <g transform={`translate(${brick[0]} ${brick[1]})`}><rect x={-22} y={-11} width={44} height={22} rx={2} fill="url(#w2-brick)" stroke="#7d3a20" strokeWidth={1.2}/><path d="M-22,-11 L22,-11" stroke="#f0b090" strokeWidth={1.4} opacity={0.6}/></g>}
    </g>
  );
};

export const FrameCraneArt: React.FC<AP> = (p) => {
  const {f} = p, L = lk(p), tAm = L.am ? L.am.at : 40, tA4 = L.a4 ? L.a4.at : 200, tKs = L.ks ? L.ks.at : 330, tBs = L.bs ? L.bs.at : 460;
  const D1 = clamp((tA4 - tAm - 6) / 130, 0.4, 1) * 130, D2 = clamp((tKs - tA4 - 6) / 130, 0.4, 1) * 130, D3 = clamp((tBs - tKs + 70) / 150, 0.5, 1) * 150;
  const cyc = (t0: number, D: number, prev: P, gap: P): [number, number, number][] => { const k = D / 130, hy = gap[1] - 30; return [
    [t0, prev[0], prev[1]], [t0 + 16 * k, STACK[0], 300], [t0 + 36 * k, STACK[0], STACK[1] - 14], [t0 + 54 * k, STACK[0], 330],
    [t0 + 86 * k, gap[0], 330], [t0 + 106 * k, gap[0], hy], [t0 + 112 * k, gap[0], hy], [t0 + 130 * k, gap[0], 300]]; };
  const w1 = cyc(tAm, D1, [1150, 300], GAP1), w2 = cyc(tA4, D2, [GAP1[0], 300], GAP2);
  const k3 = D3 / 150, w3: [number, number, number][] = [[tKs, GAP2[0], 300], [tKs + 18 * k3, STACK[0], 300], [tKs + 36 * k3, STACK[0], STACK[1] - 14], [tKs + 52 * k3, STACK[0], 330],
    [tKs + 80 * k3, FRM, 330], [tKs + 98 * k3, FRM, SHIELD_Y - 40], [tKs + 104 * k3, FRM, SHIELD_Y - 40], [tKs + 124 * k3, FRM + 120, 330], [tKs + 146 * k3, STACK[0], 330], [tKs + 150 * k3, STACK[0], STACK[1] - 14]];
  const wp = [...w1, ...w2, ...w3].sort((a, b) => a[0] - b[0]);
  const [tx, hy] = wpAt(wp, f);
  const carry1 = f >= tAm + 36 * D1 / 130 && f < tAm + 106 * D1 / 130, placed1 = f >= tAm + 108 * D1 / 130;
  const carry2 = f >= tA4 + 36 * D2 / 130 && f < tA4 + 106 * D2 / 130, placed2 = f >= tA4 + 108 * D2 / 130;
  const carry3 = f >= tKs + 36 * k3 && f < tKs + 150 * k3;
  const brick: P | null = carry1 || carry2 || carry3 ? [tx, hy + 28] : null;
  const hitT = tKs + 98 * k3, rip = clamp((f - hitT) / 40), bounce = f >= hitT - 2;
  const glowBase = 0.55 + 0.25 * Math.sin(f / 14), glowK = 0.2 * a01(f, tKs - 4, 18) + 0.35 * Math.max(0, 1 - Math.abs(f - hitT) / 24) + 0.25 * a01(f, tBs, 20);
  const g = glowBase + glowK;
  const bsA = a01(f, tBs, 20), shield = 0.28 + 0.55 * Math.max(0, 1 - Math.abs(f - hitT) / 26) + 0.3 * bsA;
  const braces: React.ReactNode[] = [];
  for (let i = 0; i < 4; i++) braces.push(<path key={i} d={`M${446 + i * 115},506 L${446 + (i + 1) * 115},742 M${446 + (i + 1) * 115},506 L${446 + i * 115},742`} stroke="url(#w2-gold)" strokeWidth={5} opacity={0.75}/>);
  const jib = Math.sin(f / 40) * 0.4;
  return (
    <g>
      <WDefs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w2-sky)"/>
      <Sun x={1620} y={170} r={46} f={f}/>
      {[0, 1, 2].map((i) => <Cloud key={i} x={80 + i * 700} y={120 + (i % 2) * 90} s={0.85} f={f} speed={0.15} seed={i + 5} a={0.85}/>)}
      <Hills id="w2c-h1" base={730} amp={110} top="#b4cbe0" bottom="#d4dfdf" seed={0.9}/><Hills id="w2c-h2" base={800} amp={70} top="#8fb59a" bottom="#bdd2a4" seed={3.3} wl={320}/>
      <rect x={-40} y={790} width={W + 80} height={H} fill="#86b070"/><rect x={-40} y={790} width={W + 80} height={14} fill="#a8c882"/>
      {Array.from({length: 40}, (_, i) => <path key={i} d={`M${i * 52 + 10},${830 + (i * 37) % 90} q6,-14 12,0`} stroke="#5f8a4e" strokeWidth={2.4} fill="none" opacity={0.6}/>)}
      <Tree x={130} y={830} s={1.05} f={f} seed={4}/><Tree x={1760} y={845} s={0.9} f={f} seed={9}/><Tree x={60} y={800} s={0.7} f={f} seed={2} hue={0}/>
      {/* the building: cut-away front, two brick piers, stone entablature and plain pediment, steps */}
      <g filter="url(#w2-shadow)">
        <rect x={236} y={772} width={870} height={20} fill="#d6c6a0" stroke="#a8946a" strokeWidth={2}/><rect x={256} y={760} width={830} height={14} fill="#e2d4b0" stroke="#a8946a" strokeWidth={2}/>
        <rect x={400} y={470} width={540} height={290} fill="#3b2c44"/>
        <rect x={400} y={470} width={540} height={290} fill="url(#w2-gold)" opacity={0.08 + 0.1 * g}/>
        <path d="M400,470 L940,470 L940,760 L400,760 Z" fill="none"/>
        <rect x={400} y={720} width={540} height={40} fill="#5a4a66" opacity={0.7}/>
      </g>
      <Bricks x={290} y={470} w={110} h={288} gaps={placed2 ? [] : [7 * 100 + 1]}/>
      <Bricks x={940} y={470} w={110} h={288} gaps={placed1 ? [] : [2 * 100 + 1]} seed={3}/>
      {!placed1 && <rect x={986} y={519} width={46} height={22} fill="#2a1d30" opacity={0.9}/>}
      {!placed2 && <rect x={313} y={639} width={46} height={22} fill="#2a1d30" opacity={0.9}/>}
      <rect x={270} y={430} width={800} height={42} fill="#e8dcbc" stroke="#a8946a" strokeWidth={2.4}/><rect x={270} y={430} width={800} height={8} fill="#fff" opacity={0.5}/>
      <path d="M250,430 L670,346 L1090,430 Z" fill="#efe4c6" stroke="#a8946a" strokeWidth={2.6}/><path d="M290,424 L670,356 L1050,424" fill="none" stroke="#fff" strokeWidth={2} opacity={0.6}/>
      <path d="M670,346 L1090,430 L670,430 Z" fill="#cdbd94" opacity={0.45}/>
      {/* the inner frame: light shafts, a glowing gold skeleton, a lock */}
      <g>
        <path d={`M440,500 L900,500 L900,750 L440,750 Z`} fill="url(#w2-gold)" opacity={0.18 * g} filter="url(#w2-glow)"/>
        <g opacity={0.55 + 0.45 * Math.min(1, g)} filter="url(#w2-glow)" stroke="#ffd36a" strokeWidth={14} fill="none"><rect x={446} y={506} width={448} height={238}/><path d="M670,506 L670,744"/></g>
        <rect x={446} y={506} width={448} height={238} fill="none" stroke="url(#w2-gold)" strokeWidth={11}/><path d="M670,506 L670,744" stroke="url(#w2-gold)" strokeWidth={9}/>
        {braces}
        <rect x={446} y={506} width={448} height={238} fill="none" stroke="#fff7d0" strokeWidth={2.4} opacity={0.7}/>
        <g transform="translate(670 626)"><rect x={-22} y={-4} width={44} height={36} rx={6} fill="#f4c24c" stroke="#8a5a14" strokeWidth={2.4}/><path d="M-12,-4 L-12,-18 Q0,-34 12,-18 L12,-4" fill="none" stroke="#8a5a14" strokeWidth={5}/><circle cx={0} cy={14} r={4} fill="#5a3a0c"/></g>
      </g>
      {/* the shield in front of the frame */}
      <g opacity={shield}>
        <rect x={430} y={SHIELD_Y} width={480} height={266} rx={14} fill="#bfe8ff" opacity={0.13} stroke="#9fdcff" strokeWidth={3}/>
        {Array.from({length: 8}, (_, i) => <path key={i} d={`M${430 + i * 68},${SHIELD_Y} L${430 + i * 68 - 20},${SHIELD_Y + 266}`} stroke="#9fdcff" strokeWidth={1.4} opacity={0.5}/>)}
      </g>
      {bounce && rip > 0 && rip < 1 && [0, 1, 2].map((i) => <ellipse key={i} cx={FRM} cy={SHIELD_Y + 2} rx={30 + rip * 160 + i * 30} ry={8 + rip * 24 + i * 6} fill="none" stroke="#cfeeff" strokeWidth={4 - i} opacity={(1 - rip) * (0.9 - i * 0.25)}/>)}
      {/* brick stack and the placed bricks */}
      {[0, 1, 2].map((r) => [0, 1, 2].slice(r).map((c) => <rect key={`${r}${c}`} x={STACK[0] - 66 + c * 46 + r * 23} y={768 - r * 24} width={44} height={22} rx={2} fill="url(#w2-brick)" stroke="#7d3a20" strokeWidth={1.2}/>))}
      {placed1 && <rect x={GAP1[0] - 22} y={GAP1[1] - 11} width={44} height={22} rx={2} fill="url(#w2-brick)" stroke="#7d3a20" strokeWidth={1.2}/>}
      {placed2 && <rect x={GAP2[0] - 22} y={GAP2[1] - 11} width={44} height={22} rx={2} fill="url(#w2-brick)" stroke="#7d3a20" strokeWidth={1.2}/>}
      <g transform={`rotate(${jib} 1330 196)`}><Crane tx={tx} hy={hy} brick={brick} f={f}/></g>
    </g>
  );
};
export const FrameCraneLabels: React.FC<AP> = (p) => {
  const L = lk(p);
  return (
    <>
      {L.am && <P2Card cx={440} y={62} text={L.am.text} f={p.f} at={L.am.at} size={30} maxW={600}/>}
      {L.a4 && <P2Card cx={1000} y={62} text={L.a4.text} f={p.f} at={L.a4.at} size={28} maxW={760}/>}
      {L.ks && <P2Card cx={660} y={808} text={L.ks.text} f={p.f} at={L.ks.at} size={28} maxW={1000} upper={false}/>}
      {L.bs && <P2Card cx={1500} y={808} text={L.bs.text} f={p.f} at={L.bs.at} size={26} maxW={620}/>}
    </>
  );
};

// ---- two-circles ---------------------------------------------------------------------------------------------------------------
const OUT: P = [860, 520], ROUT = 300, INN: P = [860, 600], RIN = 168;
const OUT_T: [string, P][] = [["14", [740, 318]], ["20", [960, 312]], ["21", [1090, 450]], ["22", [632, 440]], ["25", [616, 650]]];
const IN_T: [string, P][] = [["15", [790, 530]], ["16", [930, 530]], ["19", [790, 625]], ["29", [930, 625]]];
const Token: React.FC<{n: string; x: number; y: number; at: number; f: number; col: [string, string]; k: number}> = ({n, x, y, at, f, col, k}) => {
  const t = at + k * 16, u = clamp((f - t) / 30);
  if (f < t) return null;
  const fall = u < 1 ? (1 - u) * (1 - u) * -520 : 0, bounce = u >= 1 ? -Math.abs(Math.sin((f - t - 30) / 3.2)) * 14 * Math.max(0, 1 - (f - t - 30) / 26) : 0;
  return (
    <g transform={`translate(${x} ${y + fall + bounce}) rotate(${(1 - u) * (k % 2 ? 18 : -18)})`} opacity={clamp(u * 4)}>
      <rect x={-40} y={-31} width={80} height={62} rx={14} fill={col[0]} stroke={col[1]} strokeWidth={3} filter="url(#w2-shadow)"/>
      <rect x={-34} y={-27} width={68} height={12} rx={6} fill="#fff" opacity={0.3}/>
      <text x={0} y={15} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={42} fill="#fffaf0">{n}</text>
    </g>
  );
};
export const TwoCirclesArt: React.FC<AP> = (p) => {
  const {f} = p, L = lk(p), tEp = L.ep ? L.ep.at : 30, tCi = L.ci ? L.ci.at : 250, tNc = L.nc ? L.nc.at : 480;
  const aE = a01(f, tEp - 6, 24), aC = a01(f, tCi - 6, 24), pulseE = 1 + 0.012 * Math.sin(f / 12), pulseC = 1 + 0.015 * Math.sin(f / 10 + 1);
  const crowd: [number, number, number, number][] = [[576, 548, 104, 2], [1146, 566, 102, 3], [1086, 362, 96, 5], [646, 336, 96, 6]];
  return (
    <g>
      <WDefs/>
      <defs>
        <radialGradient id="w2tc-o" cx="45%" cy="40%" r="75%"><stop offset="0" stopColor="#d8ecf8"/><stop offset="1" stopColor="#8fbfdc"/></radialGradient>
        <radialGradient id="w2tc-i" cx="45%" cy="40%" r="75%"><stop offset="0" stopColor="#fff0b8"/><stop offset="1" stopColor="#f0b84a"/></radialGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#efe3c6"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w2-wall)" opacity={0.6}/>
      {Array.from({length: 22}, (_, i) => <path key={i} d={`M${-60},${i * 56 - 10} L${W + 60},${i * 56 - 10}`} stroke="#c9b27e" strokeWidth={1} opacity={0.22}/>)}
      <ellipse cx={OUT[0] + 10} cy={OUT[1] + ROUT * 0.98} rx={ROUT * 0.92} ry={34} fill="#2a1808" opacity={0.2} filter="url(#w2-soft)"/>
      <g transform={`translate(${OUT[0]} ${OUT[1]}) scale(${aE * pulseE}) translate(${-OUT[0]} ${-OUT[1]})`} opacity={aE}>
        <circle cx={OUT[0]} cy={OUT[1]} r={ROUT} fill="url(#w2tc-o)" stroke="#3f7fa8" strokeWidth={6}/>
        <circle cx={OUT[0]} cy={OUT[1]} r={ROUT - 14} fill="none" stroke="#fff" strokeWidth={2} opacity={0.5} strokeDasharray="4 12"/>
        <path d={`M${OUT[0] - 220},${OUT[1] - 150} A260,260 0 0 1 ${OUT[0] + 40},${OUT[1] - 262}`} stroke="#fff" strokeWidth={10} fill="none" opacity={0.45} strokeLinecap="round"/>
        {crowd.map(([x, y, h, s], i) => <Person key={i} x={x} y={y} h={h} f={f} seed={s * 3 + i}/>)}
      </g>
      <g transform={`translate(${INN[0]} ${INN[1]}) scale(${aC * pulseC}) translate(${-INN[0]} ${-INN[1]})`} opacity={aC}>
        <circle cx={INN[0]} cy={INN[1] + 6} r={RIN} fill="#2a1808" opacity={0.22} filter="url(#w2-soft)"/>
        <circle cx={INN[0]} cy={INN[1]} r={RIN} fill="url(#w2tc-i)" stroke="#b27a1c" strokeWidth={6}/>
        <circle cx={INN[0]} cy={INN[1]} r={RIN - 14} fill="none" stroke="#fff" strokeWidth={2} opacity={0.6} strokeDasharray="4 12"/>
        <Person x={INN[0] - 62} y={INN[1] + 150} h={96} f={f} seed={41}/><Person x={INN[0] + 4} y={INN[1] + 156} h={100} f={f} seed={47}/><Person x={INN[0] + 66} y={INN[1] + 150} h={94} f={f} seed={53}/>
      </g>
      {OUT_T.map(([n, [x, y]], i) => <Token key={n} n={n} x={x} y={y} at={tEp + 18} f={f} col={["#2f78b8", "#1b4a78"]} k={i}/>)}
      {IN_T.map(([n, [x, y]], i) => <Token key={n} n={n} x={x} y={y} at={tCi + 18} f={f} col={["#c8741c", "#7a3e0a"]} k={i}/>)}
      {/* pointers from the cards to the circles */}
      {L.ep && <path d={`M${OUT[0] - 296},${OUT[1] - 40} L${380},${400}`} stroke="#3f7fa8" strokeWidth={3} strokeDasharray="6 8" fill="none" opacity={aE}/>}
      {L.ci && <path d={`M${INN[0] + 120},${INN[1] - 80} L${1230},${470}`} stroke="#b27a1c" strokeWidth={3} strokeDasharray="6 8" fill="none" opacity={aC}/>}
      {L.nc && <g opacity={a01(f, tNc, 16)}><g transform="translate(1290 740)"><circle r={20} fill="#fff" stroke="#c0352b" strokeWidth={4}/><path d="M-9,-9 L9,9 M9,-9 L-9,9" stroke="#c0352b" strokeWidth={5} strokeLinecap="round"/></g></g>}
    </g>
  );
};
export const TwoCirclesLabels: React.FC<AP> = (p) => {
  const L = lk(p);
  return (
    <>
      {L.ep && <P2Card cx={330} y={330} text={L.ep.text} f={p.f} at={L.ep.at} size={32} maxW={420} tone="cool"/>}
      {L.ci && <P2Card cx={1470} y={380} text={L.ci.text} f={p.f} at={L.ci.at} size={32} maxW={440}/>}
      {L.nc && <P2Card cx={1560} y={690} text={L.nc.text} f={p.f} at={L.nc.at} size={28} maxW={470} upper={false}/>}
    </>
  );
};

// ---- judge-scale ---------------------------------------------------------------------------------------------------------------
const OFFICIAL: Look = {kind: "plain", shirt: ["#f2efe8", "#c9c2b0"], pants: "#2c3a56", hair: "#1c1410", skin: 1, glasses: true};
const WORKER: Look = {kind: "saree", female: true, shirt: ["#6f9fb5", "#3f6e84"], pants: "#6f9fb5", hair: "#1a120d", skin: 2};
const QL: Look[] = [
  {kind: "plain", shirt: ["#c8704a", "#8f4524"], pants: "#3a3f52", hair: "#1a120d", skin: 0}, {kind: "kurta", shirt: ["#e9dfc4", "#b8a888"], pants: "#d8cfb4", hair: "#241812", skin: 3, stache: true},
  {kind: "saree", female: true, shirt: ["#b8456a", "#7a2240"], pants: "#b8456a", hair: "#1a120d", skin: 2}, {kind: "plain", female: true, shirt: ["#7fa58a", "#4d7358"], pants: "#3a3f52", hair: "#1a120d", skin: 1},
  {kind: "plain", shirt: ["#4c6a9a", "#2c4468"], pants: "#2a2a33", hair: "#2a1c14", skin: 2},
];
const Queue: React.FC<{x0: number; y: number; h: number; f: number; step: number; seeds: number[]; marks: number}> = ({x0, y, h, f, step, seeds, marks}) => (
  <g>
    {seeds.map((s, i) => {
      const x = x0 + i * 112 + step * 66, walkAmt = step > 0.01 && step < 0.99 ? 1 : 0;
      return <Adult key={i} x={x} y={y} h={h} f={f} seed={s} look={QL[(s + i) % QL.length]} lookX={0.8} walkAmt={walkAmt} walk={walkAmt > 0} ph={i * 3} smile={0.5}/>;
    })}
    {marks > 0.01 && <g opacity={marks}><Tick x={x0 + 560} y={y - h - 36} s={0.9}/></g>}
  </g>
);
export const JudgeScaleArt: React.FC<AP> = (p) => {
  const {f} = p, L = lk(p), t14 = L.a14 ? L.a14.at : 20, tEb = L.eb ? L.eb.at : 120, tEp = L.ep ? L.ep.at : 330;
  const aS = a01(f, t14 - 4, 20), aQ = a01(f, tEp - 6, 22), step = sm(f, tEp + 8, 70), tilt = Math.sin(f / 18) * 0.5 * (1 - sm(f, tEb, 40)) - 0.2 * (1 - aS);
  const cx = 540, ty = 700, rot = tilt;
  const swing = (n: number) => Math.sin(f / 22 + n) * 0.6 * (1 - sm(f, tEb, 40));
  const arm = (look: Look, x: number) => ({} as any);
  const offA: any = {L: reach(cx - 140, ty - 18, 320, "L", [cx - 190, ty - 140]), R: [8, 14]}, wkA: any = {L: [8, 12], R: [8, 12]};
  return (
    <g>
      <WDefs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#efe3c6"/><rect x={-60} y={-60} width={W + 120} height={780} fill="url(#w2-wall)"/>
      <rect x={-60} y={740} width={W + 120} height={400} fill="#b98a58"/><rect x={-60} y={740} width={W + 120} height={10} fill="#ecd09a" opacity={0.8}/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${-60},${770 + i * 44} L${W + 60},${770 + i * 44}`} stroke="#8a6034" strokeWidth={1.5} opacity={0.5}/>)}
      <g opacity={aS}>
        {/* the scale: a post, a beam with a dial, one wide shared tray hung on a bracket; both stand on it, level */}
        <ellipse cx={cx + 20} cy={ty + 40} rx={300} ry={26} fill="#2a1808" opacity={0.25} filter="url(#w2-soft)"/>
        <rect x={cx - 170} y={ty + 14} width={340} height={26} rx={8} fill="#5a3a1c" stroke="#3a2210" strokeWidth={2}/>
        <path d={`M${cx - 30},${ty + 14} L${cx - 22},${ty - 214} L${cx + 22},${ty - 214} L${cx + 30},${ty + 14} Z`} fill="url(#w2-brass)" stroke="#7a5a1c" strokeWidth={2.4}/>
        <g transform={`rotate(${rot} ${cx} ${ty - 226})`}>
          <rect x={cx - 250} y={ty - 238} width={500} height={16} rx={8} fill="url(#w2-brass)" stroke="#7a5a1c" strokeWidth={2.4}/>
          <circle cx={cx} cy={ty - 230} r={22} fill="url(#w2-brass)" stroke="#7a5a1c" strokeWidth={3}/>
          {[-1, 1].map((sd) => <path key={sd} d={`M${cx + sd * 244},${ty - 224} L${cx + sd * 150},${ty - 32} M${cx + sd * 244},${ty - 224} L${cx + sd * 244 + sd * 0},${ty - 224}`} stroke="#7a5a1c" strokeWidth={3}/>)}
          {[-1, 1].map((sd) => <path key={`c${sd}`} d={`M${cx + sd * 244},${ty - 224} L${cx + sd * 82},${ty - 32}`} stroke="#9a7a2c" strokeWidth={2.4}/>)}
        </g>
        <path d={`M${cx - 262},${ty - 10} Q${cx},${ty + 34} ${cx + 262},${ty - 10} L${cx + 236},${ty - 26} L${cx - 236},${ty - 26} Z`} fill="url(#w2-brass)" stroke="#7a5a1c" strokeWidth={3}/>
        <rect x={cx - 120} y={ty - 270} width={240} height={26} rx={13} fill="#fff8e4" stroke="#b27a1c" strokeWidth={2.4}/>
        <path d={`M${cx - 94},${ty - 258} L${cx + 94},${ty - 258}`} stroke="#b27a1c" strokeWidth={3}/><path d={`M${cx},${ty - 270} L${cx},${ty - 256}`} stroke="#c0352b" strokeWidth={4}/>
        <Adult x={cx - 118} y={ty - 22} h={330} f={f} seed={61} look={OFFICIAL} lookX={0} arms={{L: [6, 10], R: [6, 10]}} smile={0.2}/>
        <Adult x={cx + 118} y={ty - 22} h={290} f={f} seed={62} look={WORKER} lookX={0} arms={{L: [6, 10], R: [10, 22]}} smile={0.4}
          held={{R: <g transform="translate(4 -2) rotate(8)"><rect x={-1} y={-26} width={2} height={52} fill="#8a5a2a"/><path d="M-9,28 L9,28 L12,42 L-12,42 Z" fill="#c9a15a" stroke="#7a5a1c" strokeWidth={0.8}/></g>}}/>
        <Plaque x={cx} y={ty + 74} w={250} h={50} text="THE LAW" size={28}/>
      </g>
      {/* queues treated alike */}
      <g opacity={aQ}>
        <rect x={1180} y={760} width={680} height={14} rx={6} fill="#8a5a2a" opacity={0.35}/>
        <g transform="translate(1790 560)" filter="url(#w2-shadow)"><rect x={-74} y={-4} width={148} height={190} rx={10} fill="#8a5a2a" stroke="#4f2f17" strokeWidth={3}/><rect x={-58} y={14} width={116} height={78} rx={5} fill="#cfe6ee" stroke="#4f2f17" strokeWidth={3}/><rect x={-70} y={96} width={140} height={14} fill="#c9a15a"/></g>
        <Queue x0={1180} y={760} h={190} f={f} step={step} seeds={[11, 12, 13, 14]} marks={0}/>
        <Queue x0={1130} y={892} h={218} f={f} step={step} seeds={[21, 22, 23, 24]} marks={0}/>
        {step > 0.98 && <><Tick x={1700} y={466} s={0.9} a={a01(f, tEp + 90, 12)}/><Tick x={1700} y={366} s={0.9} a={a01(f, tEp + 100, 12)}/></>}
      </g>
    </g>
  );
};
export const JudgeScaleLabels: React.FC<AP> = (p) => {
  const L = lk(p);
  return (
    <>
      {L.a14 && <P2Card cx={330} y={70} text={L.a14.text} f={p.f} at={L.a14.at} size={52} maxW={520}/>}
      {L.eb && <P2Card cx={860} y={170} text={L.eb.text} f={p.f} at={L.eb.at} size={30} maxW={640} upper={false}/>}
      {L.ep && <P2Card cx={1480} y={170} text={L.ep.text} f={p.f} at={L.ep.at} size={30} maxW={600} upper={false}/>}
    </>
  );
};

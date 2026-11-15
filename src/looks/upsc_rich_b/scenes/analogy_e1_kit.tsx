// ECO-16 Part 1, builder E1: shared parts for the people and street scenes (adult people with posable arms, props, awnings, fruit, QR card, phone,
// generic note and coin, account bars). No flipped figures (text on notes stays readable). Everything is a smooth function of f.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio, rng} from "../kit";
import {prog} from "./analogy_kit";

export type Kind = "plain" | "apron" | "pagri" | "khaki" | "saree" | "gamcha" | "kurta";
export type Look = {skin?: number; shirt?: [string, string]; pants?: string; hair?: string; female?: boolean; bald?: boolean; kind?: Kind; accent?: string; stache?: boolean; glasses?: boolean; hem?: number};
export type Arm = [number, number];                    // upper-arm angle, forearm angle: degrees from straight down, positive = away from the body
export type HandKind = "relax" | "open" | "point" | "fist";
export type Arms = {L?: Arm; R?: Arm};

const SKIN: [string, string][] = [["#e0b48a", "#b9835a"], ["#c68f64", "#94603c"], ["#a9744a", "#7a4a2c"], ["#d8a47a", "#a8754f"]];
const LINE_SKIN = "#6a3f26";

/** the world position of a hand (same maths as Adult's arm, no walking bob) */
export const handPos = (x: number, y: number, h: number, arms: Arms, side: "L" | "R"): [number, number] => {
  const a = (side === "L" ? arms.L : arms.R) ?? [5, 8], sd = side === "L" ? -1 : 1, d = Math.PI / 180;
  const sx = sd * 9.4, sy = -81, ex = sx + sd * 19 * Math.sin(a[0] * d), ey = sy + 19 * Math.cos(a[0] * d);
  const wx = ex + sd * 17.8 * Math.sin(a[1] * d), wy = ey + 17.8 * Math.cos(a[1] * d);
  return [x + (wx * h) / 100, y + (wy * h) / 100];
};

const Sleeve: React.FC<{S: [number, number]; E: [number, number]; col: [string, string]}> = ({S, E, col}) => {
  const dx = E[0] - S[0], dy = E[1] - S[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, w1 = 2.9, w2 = 2.2;
  const pts = `${S[0] + nx * w1},${S[1] + ny * w1} ${E[0] + nx * w2},${E[1] + ny * w2} ${E[0] - nx * w2},${E[1] - ny * w2} ${S[0] - nx * w1},${S[1] - ny * w1}`;
  return <g strokeLinejoin="round">
    <circle cx={S[0]} cy={S[1]} r={w1} fill={col[0]} stroke={col[1]} strokeWidth={0.5}/><circle cx={E[0]} cy={E[1]} r={w2} fill={col[0]} stroke={col[1]} strokeWidth={0.5}/>
    <polygon points={pts} fill={col[0]} stroke={col[1]} strokeWidth={0.5}/>
    <circle cx={S[0]} cy={S[1]} r={w1 - 0.4} fill={col[0]}/><circle cx={E[0]} cy={E[1]} r={w2 - 0.4} fill={col[0]}/>
    <path d={`M${S[0] + nx * 1.5 - dx * 0.0},${S[1] + ny * 1.5} L${E[0] + nx * 1.1},${E[1] + ny * 1.1}`} stroke="#fff" strokeWidth={0.9} opacity={0.14}/>
  </g>;
};

/** an adult, front view, 7.5 heads tall; unit height 100, feet at the origin, scaled to height h. Held items are drawn in unit coordinates at the hand. */
export const Adult: React.FC<{x: number; y: number; h: number; f: number; seed?: number; look?: Look; arms?: Arms; hands?: {L?: HandKind; R?: HandKind}; lookX?: number;
  walk?: boolean; ph?: number; op?: number; smile?: number; talk?: boolean; lean?: number; walkAmt?: number; headRot?: number; nod?: number; held?: {L?: React.ReactNode; R?: React.ReactNode}; legsHidden?: boolean}> =
  ({x, y, h, f, seed = 1, look = {}, arms = {}, hands = {}, lookX = 0, walk = false, ph = 0, op = 1, smile = 0.4, talk = false, lean = 0, walkAmt, headRot = 0, nod = 0, held = {}, legsHidden}) => {
  const r = rng(seed * 977 + 13), sk = SKIN[look.skin ?? Math.floor(r() * SKIN.length)];
  const kind = look.kind ?? "plain", female = look.female ?? kind === "saree";
  const sh: [string, string] = look.shirt ?? ["#d9b26a", "#a5782e"], pa = look.pants ?? "#3d4658", hr = look.hair ?? "#1a120d";
  const t = (f + ph) / 5.4, wa = walkAmt ?? (walk ? 1 : 0), sw = wa * Math.sin(t) * 0.42 + (1 - wa) * Math.sin(f / 44 + ph) * 0.02;
  const bob = wa * -Math.abs(Math.cos(t)) * 1.3 + (1 - wa) * -Math.sin(f / 23 + ph) * 0.3, deg = 57.3;
  const hem = look.hem ?? (kind === "kurta" || kind === "gamcha" || kind === "pagri" ? -34 : kind === "saree" ? -46 : -50);
  const wide = female ? 11 : 8.4;
  const aL = arms.L ?? [5, 8], aR = arms.R ?? [5, 8];
  const arm = (a: Arm, sd: -1 | 1, kindH: HandKind, heldItem?: React.ReactNode) => {
    const S: [number, number] = [sd * 9.4, -81], d = Math.PI / 180;
    const E: [number, number] = [S[0] + sd * 19 * Math.sin(a[0] * d), S[1] + 19 * Math.cos(a[0] * d)];
    const Wr: [number, number] = [E[0] + sd * 16 * Math.sin(a[1] * d), E[1] + 16 * Math.cos(a[1] * d)];
    const Hd: [number, number] = [E[0] + sd * 17.8 * Math.sin(a[1] * d), E[1] + 17.8 * Math.cos(a[1] * d)];
    const long = kind === "kurta" || kind === "gamcha" || kind === "pagri" || kind === "khaki";
    const fa = `M${E[0]},${E[1]} L${Wr[0]},${Wr[1]}`, ang = sd * a[1];
    return (
      <g key={`arm${sd}`}>
        <path d={fa} stroke={LINE_SKIN} strokeWidth={4.7} strokeLinecap="round"/><path d={fa} stroke={sk[0]} strokeWidth={4} strokeLinecap="round"/>
        <path d={fa} stroke={sk[1]} strokeWidth={1.4} strokeLinecap="round" opacity={0.4} transform="translate(0.9 0.3)"/>
        {long && <path d={`M${E[0]},${E[1]} L${(E[0] + Wr[0] * 2) / 3},${(E[1] + Wr[1] * 2) / 3}`} stroke={sh[1]} strokeWidth={5.4} strokeLinecap="round"/>}
        {long && <path d={`M${E[0]},${E[1]} L${(E[0] + Wr[0] * 2) / 3},${(E[1] + Wr[1] * 2) / 3}`} stroke={sh[0]} strokeWidth={4.6} strokeLinecap="round"/>}
        <Sleeve S={S} E={E} col={sh}/>
        {female && <circle cx={Wr[0]} cy={Wr[1]} r={2.3} fill="none" stroke="#e8b84a" strokeWidth={0.6}/>}
        <g transform={`translate(${Hd[0]} ${Hd[1]}) rotate(${-sd * (a[1] - 0) + 0})`}>
          {kindH === "open" && <>
            <path d="M-2,-1 L-3.4,3.8 M-0.6,-1 L-1.1,4.6 M0.9,-1 L1.4,4.4 M2.2,-1 L3.2,3.4" stroke={sk[0]} strokeWidth={1.35} strokeLinecap="round"/>
            <path d="M-2.6,0.2 L-5.2,-1.6" stroke={sk[0]} strokeWidth={1.5} strokeLinecap="round" transform={`scale(${sd} 1)`}/>
            <ellipse cx={0} cy={0.4} rx={2.7} ry={3.1} fill={sk[0]} stroke={LINE_SKIN} strokeWidth={0.3}/>
          </>}
          {kindH === "point" && <>
            <path d="M0,0 L0,6.2" stroke={LINE_SKIN} strokeWidth={1.9} strokeLinecap="round"/><path d="M0,0 L0,6.2" stroke={sk[0]} strokeWidth={1.3} strokeLinecap="round"/>
            <ellipse cx={0} cy={0.3} rx={2.5} ry={2.9} fill={sk[0]} stroke={LINE_SKIN} strokeWidth={0.3}/>
          </>}
          {(kindH === "relax" || kindH === "fist") && <>
            <ellipse cx={0} cy={1} rx={2.3} ry={kindH === "fist" ? 2.6 : 3} fill={sk[0]} stroke={LINE_SKIN} strokeWidth={0.3}/>
            <path d="M-1.6,2.2 q1.6,1.4 3.2,0" stroke={sk[1]} strokeWidth={0.5} fill="none"/>
          </>}
        </g>
        {heldItem && <g transform={`translate(${Hd[0]} ${Hd[1]})`}>{heldItem}</g>}
      </g>
    );
  };
  const fx = lookX * 1.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${h / 100}) rotate(${lean} 0 -50)`} opacity={op}>
      <ellipse cx={0} cy={0.5} rx={17} ry={3} fill="#2a1808" opacity={0.28}/>
      <g transform={`translate(0 ${bob})`}>
        {female && <path d="M-6.4,-97 Q-8.8,-82 -6.4,-70 L6.4,-70 Q8.8,-82 6.4,-97 Z" fill={hr}/>}
        {/* legs */}
        {!legsHidden && kind !== "saree" && [-1, 1].map((sd) => (
          <g key={`l${sd}`} transform={`translate(${sd * 3.6} -48) rotate(${sd * sw * deg})`}>
            <path d="M-3.9,0 L3.9,0 L3,43 L-3,43 Z" fill={pa} stroke="#00000033" strokeWidth={0.3}/>
            <path d="M0.5,0 L3.9,0 L3,43 L0.5,43 Z" fill="#000" opacity={0.2}/>
            {kind === "pagri" && <path d="M-3.9,24 L3.9,24 L3.6,43 L-3.2,43 Z" fill="#eadfc4"/>}
            <ellipse cx={sd * 0.4 + 0.8} cy={45.4} rx={4.9} ry={2.3} fill={kind === "pagri" ? "#7a5030" : "#2a1d16"}/>
          </g>
        ))}
        {kind === "saree" && <g>
          <path d={`M-10,-50 Q-13.6,-24 -14.6,-3 L14.6,-3 Q13.6,-24 10,-50 Z`} fill={look.accent ?? "#b23a48"} stroke="#6e1f2b" strokeWidth={0.5}/>
          <path d={`M2,-50 Q5,-24 6,-3 L14.6,-3 Q13.6,-24 10,-50 Z`} fill="#000" opacity={0.2}/>
          <path d={`M-14.4,-6 L14.4,-6`} stroke="#e8b84a" strokeWidth={1.4}/>
          {[-6, 0, 6].map((p, i) => <path key={i} d={`M${p},-48 Q${p * 1.5},-24 ${p * 1.9},-4`} stroke="#6e1f2b" strokeWidth={0.5} fill="none" opacity={0.55}/>)}
          <ellipse cx={-5} cy={-1.4} rx={4} ry={1.7} fill="#2a1d16"/><ellipse cx={5} cy={-1.4} rx={4} ry={1.7} fill="#2a1d16"/>
        </g>}
        {/* torso */}
        <path d={`M-9,-83 C-10.4,-72 -8,-64 -7.6,-60 C-9,-56 ${-wide},-52 ${-wide},${hem} L${wide},${hem} C${wide},-52 9,-56 7.6,-60 C8,-64 10.4,-72 9,-83 Q0,-86.8 -9,-83 Z`} fill={sh[0]} stroke={sh[1]} strokeWidth={0.5}/>
        <path d={`M1.4,-85 Q8,-86 9,-83 C10.4,-72 8,-64 7.6,-60 C9,-56 ${wide},-52 ${wide},${hem} L1.4,${hem} Z`} fill={sh[1]} opacity={0.34}/>
        <path d={`M-8.6,-82 C-9.4,-72 -7.4,-65 -7,-60`} stroke="#fff" strokeWidth={1.2} opacity={0.2} fill="none" strokeLinecap="round"/>
        {kind !== "saree" && <path d="M-3.2,-85.6 Q0,-80.4 3.2,-85.6" stroke={sh[1]} strokeWidth={0.8} fill="none"/>}
        {(kind === "plain" || kind === "khaki") && <path d={`M0,-80.5 L0,${hem}`} stroke={sh[1]} strokeWidth={0.45} opacity={0.5}/>}
        {kind === "plain" && [-74, -66, -58].map((yy) => <circle key={yy} cx={0} cy={yy} r={0.5} fill={sh[1]}/>)}
        {kind === "kurta" && <path d={`M-7,${hem} L-7,${hem + 7} M7,${hem} L7,${hem + 7}`} stroke={sh[1]} strokeWidth={0.5}/>}
        {kind === "saree" && <g>
          <path d="M-9,-83 Q-3,-78 4,-70 Q10,-60 12,-48 L9.6,-48 Q8,-58 2,-66 Q-4,-73 -9,-76 Z" fill={look.accent ?? "#b23a48"} stroke="#6e1f2b" strokeWidth={0.4}/>
          <path d="M-9,-77 Q-4,-73.6 2,-67 Q8,-59 9.8,-49.5" stroke="#e8b84a" strokeWidth={1.2} fill="none"/>
          <path d={`M-9.4,-83 Q-14,-60 -11,-44 Q-8,-48 -9.2,-60 Q-9.5,-72 -8.4,-82 Z`} fill={look.accent ?? "#b23a48"} opacity={0.9}/>
        </g>}
        {kind === "apron" && <g>
          <path d="M-5.4,-83 L-3.8,-76 L-8.4,-70 L-8.8,-40 Q0,-37 8.8,-40 L8.4,-70 L3.8,-76 L5.4,-83" fill="#8a5a34" stroke="#4a2c14" strokeWidth={0.5}/>
          <path d="M-8,-68 L8,-68" stroke="#4a2c14" strokeWidth={0.45} strokeDasharray="1.2 1"/>
          <rect x={-5.4} y={-60} width={10.8} height={8} rx={1} fill="#7a4c28" stroke="#4a2c14" strokeWidth={0.45}/>
          <path d="M-4,-77 Q-6.6,-84 -5.2,-87 M4,-77 Q6.6,-84 5.2,-87" stroke="#6a4020" strokeWidth={0.9} fill="none"/>
          <path d="M-8.8,-56 L-12,-52 M8.8,-56 L12,-52" stroke="#6a4020" strokeWidth={0.8}/>
        </g>}
        {kind === "khaki" && <g>
          <path d="M-8,-83 L8.4,-48" stroke="#5a3a1c" strokeWidth={2.4}/><path d="M-8,-83 L8.4,-48" stroke="#8a5a30" strokeWidth={1.7}/>
          <path d="M5,-52 L13,-48 L12,-36 L3,-38 Z" fill="#8a5a30" stroke="#4a2c14" strokeWidth={0.5}/>
          <rect x={-6.4} y={-72} width={4.4} height={4.4} rx={0.6} fill="none" stroke={sh[1]} strokeWidth={0.5}/>
        </g>}
        {kind === "gamcha" && <g>
          <path d="M-9.4,-83 Q-8,-66 -5.6,-50 L-2.6,-50 Q-4,-66 -3.6,-84 Z" fill="#c9604a" stroke="#7a2a1c" strokeWidth={0.4}/>
          {Array.from({length: 6}, (_, i) => <path key={i} d={`M-9,${-80 + i * 5} L-3.4,${-80 + i * 5}`} stroke="#f4e7d0" strokeWidth={0.5}/>)}
          {Array.from({length: 3}, (_, i) => <path key={i} d={`M${-8 + i * 2.2},-82 L${-6.4 + i * 1.4},-52`} stroke="#f4e7d0" strokeWidth={0.4}/>)}
        </g>}
        {/* arms: far (screen right) first so the body overlaps neither */}
        {arm(aL, -1, hands.L ?? "relax", held.L)}
        {arm(aR, 1, hands.R ?? "relax", held.R)}
        {/* neck and head */}
        <g transform={`translate(0 ${nod}) rotate(${headRot} 0 -88)`}>
        <rect x={-2.4} y={-89.4} width={4.8} height={6.8} rx={1.5} fill={sk[1]}/>
        <ellipse cx={0} cy={-94.2} rx={5.3} ry={6.5} fill={sk[0]} stroke={LINE_SKIN} strokeWidth={0.28}/>
        <path d="M1.5,-100.6 Q6.4,-97 5.3,-91 Q4,-88 1.5,-87.8 Z" fill={sk[1]} opacity={0.3}/>
        {!look.bald && kind !== "pagri" && kind !== "khaki" && <path d={`M-5.8,-94.5 Q-6,-103 0,-102.4 Q6,-103 5.8,-94.5 Q3.2,-99 0,-98.4 Q-3.2,-99 -5.8,-94.5 Z`} fill={hr}/>}
        {female && <circle cx={4.2} cy={-101.6} r={2.7} fill={hr}/>}
        {kind === "pagri" && <g>
          <path d="M-6.2,-95 Q-7.6,-106.5 0,-107.6 Q7.6,-106.5 6.2,-95 Q3,-98.6 0,-98.6 Q-3,-98.6 -6.2,-95 Z" fill={look.accent ?? "#c8401d"} stroke="#7a2210" strokeWidth={0.4}/>
          <path d="M-6,-100 Q0,-103.6 6,-100 M-5.6,-103 Q0,-106.4 5.6,-103" stroke="#f1b4a0" strokeWidth={0.55} fill="none" opacity={0.7}/>
          <path d="M1.4,-107 Q6.8,-105 6,-95 L3,-97 Z" fill="#000" opacity={0.18}/>
        </g>}
        {kind === "khaki" && <g>
          <path d="M-6,-95 Q-6.4,-104 0,-103.8 Q6.4,-104 6,-95 L8,-95.6 Q0,-92.8 -8,-95.6 Z" fill="#c2a56a" stroke="#7a6230" strokeWidth={0.4}/>
          <path d="M-8.6,-95.2 Q0,-92.4 8.6,-95.2 L8.2,-96.4 Q0,-94 -8.2,-96.4 Z" fill="#8a7440"/><circle cx={0} cy={-99.6} r={0.9} fill="#e8c84a"/>
        </g>}
        <ellipse cx={-5.3} cy={-93.6} rx={0.9} ry={1.6} fill={sk[1]}/><ellipse cx={5.3} cy={-93.6} rx={0.9} ry={1.6} fill={sk[1]}/>
        <g transform={`translate(${fx} 0)`}>
          <path d="M-3.4,-96.4 L-1.3,-96.6 M1.3,-96.6 L3.4,-96.4" stroke={hr} strokeWidth={0.6} strokeLinecap="round"/>
          <ellipse cx={-2.2} cy={-95} rx={0.9} ry={0.5} fill="#fff" opacity={0.9}/><ellipse cx={2.2} cy={-95} rx={0.9} ry={0.5} fill="#fff" opacity={0.9}/>
          <ellipse cx={-2.2 + lookX * 0.4} cy={-95} rx={0.56} ry={0.44} fill="#2a1a10"/><ellipse cx={2.2 + lookX * 0.4} cy={-95} rx={0.56} ry={0.44} fill="#2a1a10"/>
          <path d="M-0.1,-94.2 Q0.8,-92.6 -0.1,-91.8" stroke={sk[1]} strokeWidth={0.5} fill="none"/>
          {look.glasses && <g stroke="#2a1d16" strokeWidth={0.4} fill="none"><circle cx={-2.3} cy={-95} r={1.5}/><circle cx={2.3} cy={-95} r={1.5}/><path d="M-0.8,-95 L0.8,-95"/></g>}
          {look.stache && <path d="M-2.4,-91.9 Q0,-93.4 2.4,-91.9 Q0,-91 -2.4,-91.9 Z" fill={hr}/>}
          {talk
            ? <ellipse cx={0} cy={-90.2} rx={1.1} ry={0.35 + Math.max(0, Math.sin(f / 2.2) * Math.sin(f / 4.7 + 1)) * 0.75} fill="#5a2418"/>
            : <path d={`M-1.9,-90.5 Q0,${-90.5 + smile * 1.5} 1.9,-90.5`} stroke="#7a3d2a" strokeWidth={0.55} fill="none" strokeLinecap="round"/>}
        </g>
        </g>
      </g>
    </g>
  );
};

// ---- gradients used by the props below ---------------------------------------------------------------------------------------
export const E1Defs: React.FC = () => (
  <defs>
    <radialGradient id="e1-mango" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#ffe27a"/><stop offset="0.6" stopColor="#f3a52a"/><stop offset="1" stopColor="#c9501c"/></radialGradient>
    <radialGradient id="e1-apple" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#ff8a6a"/><stop offset="0.6" stopColor="#d3302a"/><stop offset="1" stopColor="#7f1618"/></radialGradient>
    <radialGradient id="e1-guava" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#e4f2a0"/><stop offset="0.6" stopColor="#9cc454"/><stop offset="1" stopColor="#4f7f2a"/></radialGradient>
    <radialGradient id="e1-orange" cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#ffc46a"/><stop offset="0.6" stopColor="#f08a1c"/><stop offset="1" stopColor="#b3500e"/></radialGradient>
    <linearGradient id="e1-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c28a52"/><stop offset="1" stopColor="#7a4c26"/></linearGradient>
    <linearGradient id="e1-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff0a8"/><stop offset="0.45" stopColor="#f3c13a"/><stop offset="1" stopColor="#b37a14"/></linearGradient>
    <linearGradient id="e1-note" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5a98d0"/><stop offset="1" stopColor="#2a5a96"/></linearGradient>
    <linearGradient id="e1-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9bf92"/><stop offset="0.5" stopColor="#c19c6a"/><stop offset="1" stopColor="#8f6c44"/></linearGradient>
    <linearGradient id="e1-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#82b4dc"/><stop offset="0.55" stopColor="#c8dde2"/><stop offset="1" stopColor="#f8e6bd"/></linearGradient>
    <linearGradient id="e1-ray" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff2c4" stopOpacity="0.5"/><stop offset="1" stopColor="#fff2c4" stopOpacity="0"/></linearGradient>
    <filter id="e1-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>
);

// ---- small props (natural pixel sizes; pass `s` to scale) ----------------------------------------------------------------------
export const Phone: React.FC<{s?: number; screen?: "idle" | "pay" | "dark"; glow?: number}> = ({s = 1, screen = "idle", glow = 0}) => (
  <g transform={`scale(${s})`}>
    {glow > 0.01 && <ellipse cx={0} cy={0} rx={70} ry={86} fill="#bfeaff" opacity={0.5 * glow} filter="url(#ak-blur8)"/>}
    <rect x={-20} y={-40} width={40} height={80} rx={7} fill="#1e222a" stroke="#4b5566" strokeWidth={1.6}/>
    <rect x={-17} y={-36} width={34} height={72} rx={4.5} fill={screen === "pay" ? "#1f9a5a" : screen === "idle" ? "#2d7fd2" : "#10151c"}/>
    {screen === "idle" && <g fill="#dff0ff" opacity={0.9}>{[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-12 + c * 9.5} y={-28 + r * 10.5} width={7} height={7} rx={2}/>))}</g>}
    {screen === "pay" && <g><circle cx={0} cy={-6} r={10} fill="#eafff2"/><path d="M-5,-6 L-1.4,-2 L5.6,-11" stroke="#1f9a5a" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round"/><rect x={-10} y={10} width={20} height={4} rx={2} fill="#eafff2" opacity={0.85}/></g>}
    <path d="M-15,-34 L-4,-34 L-15,-12 Z" fill="#fff" opacity={0.14}/>
    <circle cx={0} cy={-38} r={1.2} fill="#0a0d12"/>
  </g>
);

/** a generic blue-and-orange banknote (no real design): border, a portrait-free oval, a plain strip and the rupee sign */
export const Note: React.FC<{s?: number; sign?: boolean}> = ({s = 1, sign = true}) => (
  <g transform={`scale(${s})`}>
    <rect x={-75} y={-35} width={150} height={70} rx={5} fill="url(#e1-note)" stroke="#173b66" strokeWidth={2}/>
    <rect x={-70} y={-30} width={140} height={60} rx={3} fill="none" stroke="#e9a35a" strokeWidth={1.4}/>
    <rect x={-75} y={-35} width={34} height={70} rx={5} fill="#e9852f" opacity={0.92}/>
    <rect x={-45} y={-35} width={4} height={70} fill="#173b66" opacity={0.5}/>
    <ellipse cx={8} cy={0} rx={30} ry={23} fill="#f6e3b8" opacity={0.9} stroke="#173b66" strokeWidth={1.2}/>
    {[10, 17, 24].map((r) => <ellipse key={r} cx={8} cy={0} rx={r} ry={r * 0.77} fill="none" stroke="#2a5a96" strokeWidth={0.8} opacity={0.6}/>)}
    <rect x={44} y={-24} width={20} height={48} rx={2} fill="#f7f1e0" opacity={0.28}/>
    {Array.from({length: 6}, (_, i) => <path key={i} d={`M-36,${-24 + i * 9.6} L-30,${-24 + i * 9.6}`} stroke="#fff3da" strokeWidth={1.2} opacity={0.8}/>)}
    {sign && <text x={-58} y={8} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={28} fill="#fff6e4">₹</text>}
  </g>
);

export const Coin: React.FC<{s?: number; f?: number; glow?: number}> = ({s = 1, f = 0, glow = 0}) => {
  const sh = (f * 0.03) % 1;
  return (
    <g transform={`scale(${s})`}>
      {glow > 0.01 && <circle r={70} fill="url(#ak-sunglow)" opacity={glow}/>}
      <circle r={32} fill="#8a5a10" transform="translate(2 3)" opacity={0.5}/>
      <circle r={32} fill="url(#e1-gold)" stroke="#8a5a10" strokeWidth={2}/>
      {Array.from({length: 24}, (_, i) => <path key={i} d={`M0,-30 V-27`} stroke="#a8740e" strokeWidth={1.3} transform={`rotate(${i * 15})`}/>)}
      <circle r={24} fill="none" stroke="#b9801a" strokeWidth={1.6}/>
      <path d="M0,-15 L4.4,-4.6 L15.6,-4.6 L6.6,2.4 L9.8,13.6 L0,7 L-9.8,13.6 L-6.6,2.4 L-15.6,-4.6 L-4.4,-4.6 Z" fill="#fff0a8" stroke="#a8740e" strokeWidth={1.2} strokeLinejoin="round"/>
      <path d="M-26,-14 Q-14,-28 8,-28" stroke="#fff" strokeWidth={3} fill="none" opacity={0.6} strokeLinecap="round"/>
      <rect x={-34 + sh * 68} y={-34} width={6} height={68} fill="#fff" opacity={0.22} transform="rotate(20)" />
    </g>
  );
};

/** QR card on a little stand: a pseudo-random grid with three finder squares (no real code) */
export const QRCard: React.FC<{w?: number; seed?: number}> = ({w = 110, seed = 7}) => {
  const n = 15, c = (w - 22) / n, g = rng(seed), cells: React.ReactNode[] = [];
  const finder = (i: number, j: number) => (i < 5 && j < 5) || (i > n - 6 && j < 5) || (i < 5 && j > n - 6);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) if (!finder(i, j) && g() < 0.5) cells.push(<rect key={`${i}-${j}`} x={11 + i * c} y={34 + j * c} width={c + 0.4} height={c + 0.4} fill="#1d1a1a"/>);
  const fdr = (fx: number, fy: number) => <g key={`${fx}${fy}`}><rect x={fx} y={fy} width={c * 5} height={c * 5} fill="#1d1a1a"/><rect x={fx + c} y={fy + c} width={c * 3} height={c * 3} fill="#fff"/><rect x={fx + c * 1.8} y={fy + c * 1.8} width={c * 1.4} height={c * 1.4} fill="#1d1a1a"/></g>;
  return (
    <g>
      <rect x={0} y={0} width={w} height={w + 36} rx={8} fill="#fffaf0" stroke="#b8a074" strokeWidth={1.6} style={{filter: "drop-shadow(0 6px 6px rgba(50,26,8,.35))"}}/>
      <rect x={0} y={0} width={w} height={26} rx={8} fill="#2a6fb8"/><rect x={0} y={16} width={w} height={10} fill="#2a6fb8"/>
      <rect x={w * 0.3} y={9} width={w * 0.4} height={5} rx={2.5} fill="#e9f3ff" opacity={0.85}/>
      {cells}{fdr(11, 34)}{fdr(11 + c * (n - 5), 34)}{fdr(11, 34 + c * (n - 5))}
    </g>
  );
};

/** wooden hand-cart stall: counter, front panel, wheels, striped awning on poles, fruit piles, hanging bananas, an optional QR card stand */
export const FruitPile: React.FC<{x: number; y: number; w: number; rows: number; kind: "mango" | "apple" | "guava" | "orange"; seed?: number; r?: number}> = ({x, y, w, rows, kind, seed = 1, r = 17}) => {
  const g = rng(seed * 31 + 3), els: React.ReactNode[] = [];
  for (let row = 0; row < rows; row++) {
    const cnt = Math.max(2, Math.floor((w - row * r * 1.2) / (r * 1.8)));
    for (let i = 0; i < cnt; i++) {
      const cx = x + (i - (cnt - 1) / 2) * r * 1.85 + (g() - 0.5) * 3, cy = y - row * r * 1.35;
      els.push(<g key={`${row}-${i}`}><circle cx={cx} cy={cy} r={r} fill={`url(#e1-${kind})`} stroke="#00000026" strokeWidth={1}/>
        <ellipse cx={cx - r * 0.3} cy={cy - r * 0.38} rx={r * 0.28} ry={r * 0.16} fill="#fff" opacity={0.5}/>
        {kind === "apple" && <path d={`M${cx},${cy - r} q2,-6 5,-6`} stroke="#4a2c14" strokeWidth={1.6} fill="none"/>}
        {kind === "mango" && <path d={`M${cx - 2},${cy - r + 1} q4,-5 8,-2`} stroke="#4f7f2a" strokeWidth={2.4} fill="none" strokeLinecap="round"/>}</g>);
    }
  }
  return <g>{els}</g>;
};
export const BananaBunch: React.FC<{x: number; y: number; s?: number; sway?: number}> = ({x, y, s = 1, sway = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${s})`}>
    <path d="M0,0 L0,14" stroke="#5a7a2a" strokeWidth={5} strokeLinecap="round"/>
    {[-2, -1, 0, 1, 2].map((i) => <path key={i} d={`M${i * 5},12 Q${i * 11 + 4},46 ${i * 7 + 8},82`} stroke="#9b7a14" strokeWidth={14} fill="none" strokeLinecap="round"/>)}
    {[-2, -1, 0, 1, 2].map((i) => <path key={`b${i}`} d={`M${i * 5},12 Q${i * 11 + 4},46 ${i * 7 + 8},82`} stroke="#f2cf3a" strokeWidth={11.4} fill="none" strokeLinecap="round"/>)}
    {[-2, -1, 0, 1, 2].map((i) => <path key={`h${i}`} d={`M${i * 5 - 2},16 Q${i * 11},46 ${i * 7 + 4},74`} stroke="#fff6b0" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.6}/>)}
    {[-2, -1, 0, 1, 2].map((i) => <circle key={`t${i}`} cx={i * 7 + 8} cy={82} r={2.4} fill="#4a3410"/>)}
  </g>
);

export const Awning: React.FC<{x: number; y: number; w: number; h: number; c1: string; c2: string; n?: number; pole?: boolean; f?: number; sway?: number}> = ({x, y, w, h, c1, c2, n = 8, pole = true, f = 0, sway = 1}) => {
  const sw = w / n, wob = Math.sin(f / 31 + x) * sway;
  return (
    <g>
      {pole && <>
        <rect x={x + 6} y={y + h} width={7} height={300} fill="#6a4a2c" opacity={0.0}/>
      </>}
      <path d={`M${x},${y + h} L${x + w * 0.04},${y} L${x + w * 0.96},${y} L${x + w},${y + h} Z`} fill={c1} stroke="#00000030" strokeWidth={1.4}/>
      {Array.from({length: n}, (_, i) => i % 2 === 0 && (
        <path key={i} d={`M${x + i * sw},${y + h} L${x + w * 0.04 + (i * sw * 0.92)},${y} L${x + w * 0.04 + ((i + 1) * sw * 0.92)},${y} L${x + (i + 1) * sw},${y + h} Z`} fill={c2}/>
      ))}
      <path d={`M${x},${y + h} L${x + w * 0.04},${y} L${x + w * 0.96},${y} L${x + w},${y + h} Z`} fill="url(#e1-ray)" opacity={0.35}/>
      {Array.from({length: n}, (_, i) => (
        <path key={`v${i}`} d={`M${x + i * sw},${y + h} q${sw / 2},${16 + wob} ${sw},0 Z`} fill={i % 2 === 0 ? c2 : c1} stroke="#00000030" strokeWidth={1.2}/>
      ))}
      <path d={`M${x + 4},${y + 7} L${x + w - 4},${y + 7}`} stroke="#fff" strokeWidth={2} opacity={0.35}/>
    </g>
  );
};

/** account bar: a stack of blocks on a plate. `blocks` may be fractional (the top block is partly drawn). */
export const AccountBar: React.FC<{x: number; baseY: number; w: number; bh: number; blocks: number; col: [string, string]; cap?: number; tag?: string; tagA?: number; tagSize?: number}> =
  ({x, baseY, w, bh, blocks, col, cap = 8, tag, tagA = 1, tagSize = 17}) => {
  const full = Math.floor(blocks + 1e-6), part = blocks - full;
  return (
    <g>
      <rect x={x - w / 2 - 12} y={baseY} width={w + 24} height={14} rx={5} fill="#5a3a1e" stroke="#2f1d0e" strokeWidth={1.4}/>
      <rect x={x - w / 2 - 6} y={baseY - cap * bh - 6} width={w + 12} height={cap * bh + 6} rx={8} fill="#ffffff" opacity={0.22} stroke="#8aa8bc" strokeWidth={1.8}/>
      {Array.from({length: full}, (_, i) => (
        <g key={i}><rect x={x - w / 2} y={baseY - (i + 1) * bh + 2} width={w} height={bh - 4} rx={5} fill={col[0]} stroke={col[1]} strokeWidth={1.6}/>
          <rect x={x - w / 2 + 6} y={baseY - (i + 1) * bh + 6} width={w * 0.5} height={5} rx={2.5} fill="#fff" opacity={0.4}/></g>
      ))}
      {part > 0.02 && <rect x={x - w / 2} y={baseY - (full + part) * bh + 2} width={w} height={Math.max(2, part * bh - 4)} rx={5} fill={col[0]} stroke={col[1]} strokeWidth={1.6} opacity={0.9}/>}
      {tag && <text x={x} y={baseY + 44} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={tagSize} letterSpacing="0.14em" fill="#5a3418" opacity={tagA}>{tag}</text>}
    </g>
  );
};

/** shared helpers */
export const arc = (a: [number, number], b: [number, number], lift: number, u: number): [number, number] => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(Math.PI * u) * lift];
export const smoothStep = (f: number, a: number, d: number) => eio(prog(f, a, d));
export const ease = (f: number, a: number, d: number) => eo(prog(f, a, d));
export const bump = (f: number, a: number, d: number) => Math.sin(Math.PI * clamp((f - a) / d));
export const wrapPage = {W, H};

/** two-link reach: the arm angles that put the hand of `side` on the world point `target` (clamped to the arm's length) */
export const reach = (x: number, y: number, h: number, side: "L" | "R", target: [number, number]): Arm => {
  const sd = side === "L" ? -1 : 1, s = h / 100, l1 = 19 * s, l2 = 17.8 * s;
  const lx = sd * (target[0] - (x + sd * 9.4 * s)), ly = target[1] - (y - 81 * s);
  const d0 = Math.hypot(lx, ly) || 1, d = Math.max(Math.abs(l1 - l2) + 0.5, Math.min(l1 + l2 - 0.5, d0));
  const phi = Math.atan2(lx, ly), A = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const c1 = phi - A, c2 = phi + A, sc = (t: number) => Math.sin(t) * 0.7 + Math.cos(t) * 0.3;
  const t1 = sc(c1) >= sc(c2) ? c1 : c2, ex = l1 * Math.sin(t1), ey = l1 * Math.cos(t1), tx = d * Math.sin(phi), ty = d * Math.cos(phi);
  return [(t1 * 180) / Math.PI, (Math.atan2(tx - ex, ty - ey) * 180) / Math.PI];
};
export const mix2 = (a: [number, number], b: [number, number], u: number): [number, number] => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

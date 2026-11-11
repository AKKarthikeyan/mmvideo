// POL-03 Part 2, builder W3: `court-shields`. A warm courtroom (empty bench, window light); three shields drop in front of a generic accused, one per Article 20 protection.
// Motion follows f and at(key) only. No real person: the accused is a generic adult.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {Adult, type Look} from "./analogy_e1_kit";
import {W3Defs, Motes, Chair, ShieldShape} from "./analogy_w3_kit";

const ACC: Look = {kind: "plain", shirt: ["#b9c6d4", "#7f93a8"], pants: "#3d4658", hair: "#2b1d14", skin: 2};
const FLOOR = 660;

const Window: React.FC<{x: number; w: number; h: number; y: number}> = ({x, w, h, y}) => (
  <g>
    <path d={`M${x - w / 2},${y + h} V${y + w / 2} Q${x - w / 2},${y} ${x},${y} Q${x + w / 2},${y} ${x + w / 2},${y + w / 2} V${y + h} Z`} fill="url(#w3-day)" stroke="#5e3a1c" strokeWidth={12}/>
    <path d={`M${x},${y} V${y + h} M${x - w / 2},${y + h * 0.5} H${x + w / 2}`} stroke="#5e3a1c" strokeWidth={7}/>
    <circle cx={x + 18} cy={y + h * 0.3} r={34} fill="#fff1b0" opacity={0.9}/>
  </g>
);

const Icon1: React.FC = () => (
  <g>
    <rect x={-52} y={-48} width={64} height={78} rx={6} fill="#fffaf0" stroke="#173a5c" strokeWidth={3}/><rect x={-52} y={-48} width={64} height={20} rx={6} fill="#c8402a"/>
    {Array.from({length: 3}, (_, r) => Array.from({length: 3}, (_, c) => <rect key={`${r}${c}`} x={-44 + c * 19} y={-20 + r * 17} width={13} height={11} rx={2} fill="#d9cdb0"/>))}
    <path d="M60,-6 Q60,-50 22,-44" fill="none" stroke="#173a5c" strokeWidth={8} strokeLinecap="round"/><path d="M18,-44 L34,-62 M18,-44 L36,-28" stroke="#173a5c" strokeWidth={8} strokeLinecap="round"/>
    <circle cx={22} cy={8} r={46} fill="none" stroke="#e03a2a" strokeWidth={9}/><path d="M-10,40 L54,-24" stroke="#e03a2a" strokeWidth={9} strokeLinecap="round"/>
  </g>
);
const Icon2: React.FC = () => (
  <g>
    {[0, 1].map((k) => <g key={k} transform={`translate(${-34 + k * 26} ${-34 + k * 18})`}><rect width={64} height={78} rx={6} fill="#fffaf0" stroke="#14502a" strokeWidth={3}/>{[0, 1, 2, 3].map((r) => <rect key={r} x={9} y={12 + r * 15} width={46 - (r % 2) * 14} height={6} rx={3} fill="#9aa890"/>)}</g>)}
    <circle cx={0} cy={6} r={52} fill="none" stroke="#e03a2a" strokeWidth={9}/><path d="M-34,40 L34,-30" stroke="#e03a2a" strokeWidth={9} strokeLinecap="round"/>
  </g>
);
const Icon3: React.FC = () => (
  <g>
    <path d="M-50,-40 H46 Q56,-40 56,-30 V10 Q56,20 46,20 H4 L-16,42 V20 H-50 Q-60,20 -60,10 V-30 Q-60,-40 -50,-40 Z" fill="#fffaf0" stroke="#7a4a10" strokeWidth={3.4}/>
    {[-22, -4].map((y) => <rect key={y} x={-42} y={y} width={84 - (y > -10 ? 30 : 0)} height={7} rx={3.5} fill="#c9a870"/>)}
    <circle cx={0} cy={-8} r={50} fill="none" stroke="#e03a2a" strokeWidth={9}/><path d="M-34,26 L34,-42" stroke="#e03a2a" strokeWidth={9} strokeLinecap="round"/>
  </g>
);

export const CourtArt: React.FC<AP> = (p) => {
  const {f} = p, ks = ["s1", "s2", "s3"].map((k) => p.at(k));
  const drop = (i: number) => { const u = prog(f, ks[i] - 6, 34); return {a: eo(prog(f, ks[i] - 6, 14)), dy: (1 - eo(u)) * -220 + Math.sin(u * Math.PI * 2.5) * (1 - u) * 14, g: Math.max(0, 1 - prog(f, ks[i], 60)) * 0.9 + 0.1}; };
  const S = [
    {x: 560, y: 548, w: 200, h: 244, fill: "blue" as const, Icon: Icon1},
    {x: 1360, y: 548, w: 200, h: 244, fill: "green" as const, Icon: Icon2},
    {x: 960, y: 700, w: 160, h: 190, fill: "amber" as const, Icon: Icon3},
  ];
  const ring = eo(prog(f, ks[2], 40));
  return (
    <g>
      <W3Defs/>
      <defs><linearGradient id="w3-courtw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c89a62"/><stop offset="1" stopColor="#9a6a3a"/></linearGradient>
        <linearGradient id="w3-panel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7e4f28"/><stop offset="0.5" stopColor="#a06a3a"/><stop offset="1" stopColor="#7e4f28"/></linearGradient></defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w3-courtw)"/>
      {/* panelled wall, pediment and windows */}
      {Array.from({length: 8}, (_, i) => <rect key={i} x={30 + i * 240} y={236} width={200} height={424} rx={6} fill="url(#w3-panel)" stroke="#4e2f18" strokeWidth={3} opacity={0.5}/>)}
      <Window x={250} w={170} h={400} y={120}/><Window x={1670} w={170} h={400} y={120}/>
      <path d="M520,262 H1400 L1300,196 H620 Z" fill="#d8b684" stroke="#5e3a1c" strokeWidth={4}/><rect x={520} y={262} width={880} height={22} fill="#b98450" stroke="#5e3a1c" strokeWidth={3}/>
      <path d="M700,230 H1220" stroke="#fff" strokeWidth={3} opacity={0.3}/>
      {/* the empty bench: three chairs and a long desk */}
      <Chair x={700} y={396} s={0.95}/><Chair x={960} y={396} s={1.05}/><Chair x={1220} y={396} s={0.95}/>
      <rect x={560} y={396} width={800} height={264} rx={8} fill="url(#w3-wood)" stroke="#4e2f18" strokeWidth={4}/>
      <rect x={560} y={396} width={800} height={14} rx={6} fill="#f2d49a" opacity={0.55}/>
      {Array.from({length: 5}, (_, i) => <rect key={i} x={586 + i * 156} y={440} width={134} height={190} rx={4} fill="none" stroke="#4e2f18" strokeWidth={3} opacity={0.6}/>)}
      <g transform="translate(1250 392)"><rect x={-34} y={-20} width={68} height={20} rx={4} fill="url(#w3-woodd)"/><rect x={-26} y={-50} width={52} height={32} rx={14} fill="url(#w3-brass)" stroke="#5a3c0c" strokeWidth={2}/></g>
      {/* floor: boards in perspective */}
      <rect x={-60} y={FLOOR - 22} width={W + 120} height={30} fill="#6e4424"/>
      <path d={`M-60,${FLOOR + 8} L${W + 60},${FLOOR + 8} L${W + 60},${H + 60} L-60,${H + 60} Z`} fill="#b98450"/>
      {Array.from({length: 17}, (_, i) => <path key={i} d={`M${960 + (i - 8) * 90},${FLOOR + 8} L${960 + (i - 8) * 250},${H + 60}`} stroke="#7a4c26" strokeWidth={2} opacity={0.6}/>)}
      {[0.3, 0.65, 1].map((u, i) => <path key={i} d={`M-60,${FLOOR + 8 + u * u * 270} L${W + 60},${FLOOR + 8 + u * u * 270}`} stroke="#7a4c26" strokeWidth={2} opacity={0.5}/>)}
      <path d={`M150,520 L350,520 L720,${FLOOR + 140} L330,${FLOOR + 140} Z`} fill="#fff1c0" opacity={0.16}/>
      <path d={`M1570,520 L1770,520 L1560,${FLOOR + 140} L1190,${FLOOR + 140} Z`} fill="#fff1c0" opacity={0.16}/>
      <Motes f={f} x0={150} x1={800} y0={200} y1={780} n={22} seed={11}/><Motes f={f} x0={1150} x1={1780} y0={200} y1={780} n={22} seed={12}/>
      {/* the generic accused on a small platform, in the dock */}
      <ellipse cx={960} cy={868} rx={170} ry={26} fill="#4e2f18" opacity={0.55}/><ellipse cx={960} cy={860} rx={160} ry={22} fill="#8a5a34"/>
      <Adult x={960} y={856} h={440} f={f} seed={77} look={ACC} arms={{L: [6, 12], R: [6, 12]}} lookX={0} smile={0}/>
      {ring > 0.01 && <ellipse cx={960} cy={560} rx={430} ry={270} fill="none" stroke="#f4dd96" strokeWidth={4} strokeDasharray="4 16" strokeLinecap="round" opacity={0.7 * ring} transform={`rotate(${f * 0.1} 960 560)`}/>}
      {S.map((s, i) => { const d = drop(i); if (d.a <= 0.01) return null; return (
        <g key={i} transform={`translate(${s.x} ${s.y + d.dy})`} opacity={d.a}>
          <ShieldShape w={s.w} h={s.h} fill={s.fill} glow={d.g}><g transform={`scale(${s.w / 200 * 1.05}) translate(0 ${s.h * 0.02})`}><s.Icon/></g></ShieldShape>
        </g>
      ); })}
    </g>
  );
};

export const CourtLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return (
    <>
      {L[0] && <P2Card cx={960} y={80} text={L[0].text} f={p.f} at={L[0].at} size={46} maxW={900}/>}
      {L[1] && <P2Card cx={560} y={704} text={L[1].text} f={p.f} at={L[1].at} size={30} maxW={420} upper={false}/>}
      {L[2] && <P2Card cx={1360} y={704} text={L[2].text} f={p.f} at={L[2].at} size={30} maxW={420} upper={false}/>}
      {L[3] && <P2Card cx={960} y={812} text={L[3].text} f={p.f} at={L[3].at} size={28} maxW={560} upper={false}/>}
    </>
  );
};

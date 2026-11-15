// POL-03 Part 1, builder W1: `balance`. A brass balance on a desk. "wobble" (s003): EQUALITY pan vs RESERVATION pan, swinging. "steady" (s016): a paper clause
// slides into the EQUALITY pan and the beam settles. "balanced" (s022): level, the limits written on the base. Motion depends on f and at(key) only.
import React from "react";
import {SANS, SERIF, W, clamp, eo, eio} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";

const PX = 960, PY = 340, BL = 340, CH = 215; // pivot, half beam, chain length
const DESK = 790;

const Book: React.FC<{x: number; y: number; w: number; h: number; c: string}> = ({x, y, w, h, c}) => (
  <g><rect x={x} y={y} width={w} height={h} fill={c}/><rect x={x} y={y} width={w * 0.22} height={h} fill="#000" opacity={0.18}/><rect x={x + 3} y={y + 12} width={w - 6} height={5} fill="#f2d27a" opacity={0.75}/><rect x={x + 3} y={y + h - 18} width={w - 6} height={3} fill="#f2d27a" opacity={0.6}/></g>
);

const Chair: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><rect x={-14} y={-52} width={28} height={28} rx={4} fill="#8a5a34" stroke="#5a3418" strokeWidth={1.5}/><rect x={-18} y={-26} width={36} height={10} rx={3} fill="#a8703e"/><rect x={-15} y={-16} width={6} height={18} fill="#6a4020"/><rect x={9} y={-16} width={6} height={18} fill="#6a4020"/></g>
);

const Pan: React.FC<{cx: number; cy: number; f: number; kind: "eq" | "rs"; clause?: React.ReactNode}> = ({cx, cy, kind, clause}) => (
  <g transform={`translate(${cx} ${cy})`}>
    <ellipse cx={0} cy={22} rx={150} ry={20} fill="url(#w1b-brass)" stroke="#6a4a1c" strokeWidth={2.4}/>
    <path d="M-150,12 Q0,80 150,12 Z" fill="url(#w1b-brass2)" stroke="#6a4a1c" strokeWidth={2.4}/>
    <ellipse cx={0} cy={12} rx={150} ry={18} fill="#e8c46c" stroke="#8a6420" strokeWidth={2}/><ellipse cx={0} cy={14} rx={132} ry={12} fill="#b98b2e" opacity={0.6}/>
    {kind === "eq" ? (
      <g transform="translate(0 -4)">
        <rect x={-58} y={-64} width={116} height={72} rx={8} fill="#d9d3c4" stroke="#8a8474" strokeWidth={2.4}/><rect x={-58} y={-64} width={40} height={72} rx={8} fill="#fff" opacity={0.25}/>
        <rect x={-30} y={-46} width={60} height={9} rx={3} fill="#5a5444"/><rect x={-30} y={-26} width={60} height={9} rx={3} fill="#5a5444"/>
      </g>
    ) : (
      <g transform="translate(0 -4)">
        <Chair x={-62} y={8} s={1.15}/><Chair x={0} y={8} s={1.15}/><Chair x={62} y={8} s={1.15}/>
        <g transform="translate(0 -50)"><rect x={-46} y={-10} width={92} height={14} rx={3} fill="#f6ecd2" stroke="#b8a074" strokeWidth={1.6}/><rect x={-40} y={-4} width={60} height={3} fill="#b8a074"/></g>
      </g>
    )}
    {clause}
  </g>
);

export const BalanceArt: React.FC<AP> = (p) => {
  const {f, dur} = p, mode = (p.spec as any).mode ?? "wobble", L = rlabs(p);
  const labs = (p.spec.labels ?? []) as {key: string}[], lm = L[labs.findIndex((l) => l.key === "lm")];
  const c4 = mode === "steady" ? p.at("c4") : 1e9, slide = mode === "steady" ? eio(prog(f, c4, 40)) : 0, land = c4 + 40;
  const env = mode === "wobble" ? 0.17 + 0.03 * Math.sin(f / 61) : mode === "steady" ? (f < land ? 0.17 : 0.17 * Math.exp(-(f - land) / 20)) : 0.05 * Math.exp(-f / 30);
  const th = env * Math.sin(f / 10.5) + (mode === "steady" && f >= c4 ? slide * 0 : 0);
  const ex = BL * Math.cos(th), ey = BL * Math.sin(th);
  const lx = PX - ex, ly = PY - ey, rx = PX + ex, ry = PY + ey;
  // the clause slides from the right into the EQUALITY pan
  const pa: [number, number] = [lerpN(1500, lx, slide), lerpN(300, ly + CH - 62 - 40 * (1 - slide) * 0, eo(slide))];
  return (
    <g>
      <defs>
        <linearGradient id="w1b-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9c4a0"/><stop offset="1" stopColor="#c8ae84"/></linearGradient>
        <linearGradient id="w1b-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9a6a3e"/><stop offset="1" stopColor="#6a4224"/></linearGradient>
        <linearGradient id="w1b-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6dc8a"/><stop offset="0.5" stopColor="#c8962e"/><stop offset="1" stopColor="#8a6420"/></linearGradient>
        <linearGradient id="w1b-brass2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8a83a"/><stop offset="1" stopColor="#7a5418"/></linearGradient>
        <linearGradient id="w1b-light" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff2c8" stopOpacity="0.55"/><stop offset="1" stopColor="#fff2c8" stopOpacity="0"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={DESK + 70} fill="url(#w1b-wall)"/>
      {/* window light and a wall of law books */}
      <path d={`M1180,-40 L1660,-40 L1360,${DESK} L860,${DESK} Z`} fill="url(#w1b-light)"/>
      <g>
        <rect x={70} y={150} width={420} height={DESK - 150} fill="#6a4226"/><rect x={78} y={158} width={404} height={DESK - 166} fill="#3a2414"/>
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x={78} y={158 + r * 150 + 138} width={404} height={10} fill="#7a4e2c"/>
            {Array.from({length: 11}).map((_, i) => <Book key={i} x={88 + i * 35.5} y={158 + r * 150 + 138 - (82 + ((i * 7 + r * 3) % 5) * 9)} w={32} h={82 + ((i * 7 + r * 3) % 5) * 9} c={["#7a2a22", "#2a4a6a", "#2f5a3e", "#6a4a2a", "#5a2a4a", "#8a6a2a"][(i + r * 2) % 6]}/>)}
          </g>
        ))}
      </g>
      <g opacity={0.9}><rect x={1480} y={170} width={300} height={380} rx={6} fill="#ece0c4" stroke="#8a6a44" strokeWidth={6}/><rect x={1500} y={190} width={260} height={340} fill="#dbe9ee"/><path d="M1630,190 V530 M1500,360 H1760" stroke="#8a6a44" strokeWidth={6}/><circle cx={1690} cy={270} r={26} fill="#fff3c0" opacity={0.9}/></g>
      {/* the desk */}
      <rect x={-60} y={DESK} width={W + 120} height={400} fill="url(#w1b-desk)"/><rect x={-60} y={DESK} width={W + 120} height={10} fill="#c8935a"/>
      {Array.from({length: 14}).map((_, i) => <path key={i} d={`M-60,${DESK + 30 + i * 22} Q${400 + i * 60},${DESK + 22 + i * 22} ${W + 60},${DESK + 36 + i * 22}`} stroke="#4a2a14" strokeWidth={1.6} fill="none" opacity={0.28}/>)}
      <ellipse cx={PX} cy={DESK + 24} rx={560} ry={22} fill="#2a1808" opacity={0.28}/>
      {/* base with the limits written on it */}
      <g>
        <path d={`M${PX - 470},${DESK - 6} L${PX - 430},${DESK - 78} H${PX + 430} L${PX + 470},${DESK - 6} Z`} fill="url(#w1b-brass2)" stroke="#5a3c12" strokeWidth={3}/>
        <path d={`M${PX - 430},${DESK - 78} H${PX + 430} L${PX + 438},${DESK - 64} H${PX - 438} Z`} fill="#f2d27a" opacity={0.8}/>
        <rect x={PX - 410} y={DESK - 70} width={820} height={58} rx={4} fill="#5e3a16" opacity={0.55}/>
        {lm && (() => { const a = eo(prog(f, lm.at, 20)), fs = Math.min(34, 780 / (lm.text.length * 0.5)); return (
          <g opacity={a}>
            <text x={PX + 1} y={DESK - 29} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={fs} fill="#fff0c4" opacity={0.5}>{lm.text}</text>
            <text x={PX} y={DESK - 30} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={fs} fill="#fbe7a8">{lm.text}</text>
          </g>); })()}
      </g>
      {/* pillar and cross bar */}
      <path d={`M${PX - 24},${DESK - 78} L${PX - 14},${PY + 20} H${PX + 14} L${PX + 24},${DESK - 78} Z`} fill="url(#w1b-brass)" stroke="#6a4a1c" strokeWidth={2.4}/>
      <rect x={PX - 8} y={PY + 40} width={5} height={DESK - PY - 140} fill="#fff" opacity={0.3}/>
      {/* chains and pans */}
      {[[lx, ly], [rx, ry]].map(([ex2, ey2], i) => (
        <g key={i}>
          <path d={`M${ex2},${ey2} L${ex2 - 110},${ey2 + CH}`} stroke="#8a6420" strokeWidth={4}/><path d={`M${ex2},${ey2} L${ex2 + 110},${ey2 + CH}`} stroke="#8a6420" strokeWidth={4}/>
          <path d={`M${ex2},${ey2} V${ey2 + CH}`} stroke="#a67a2a" strokeWidth={3} opacity={0.6}/>
        </g>
      ))}
      <Pan cx={lx} cy={ly + CH} f={f} kind="eq"/>
      <Pan cx={rx} cy={ry + CH} f={f} kind="rs"/>
      {/* beam */}
      <g transform={`rotate(${(th * 180) / Math.PI} ${PX} ${PY})`}>
        <path d={`M${PX - BL - 16},${PY - 2} Q${PX},${PY - 34} ${PX + BL + 16},${PY - 2} L${PX + BL + 16},${PY + 10} Q${PX},${PY - 14} ${PX - BL - 16},${PY + 10} Z`} fill="url(#w1b-brass)" stroke="#6a4a1c" strokeWidth={2.4}/>
        <circle cx={PX - BL - 8} cy={PY + 4} r={11} fill="#c8962e" stroke="#6a4a1c" strokeWidth={2}/><circle cx={PX + BL + 8} cy={PY + 4} r={11} fill="#c8962e" stroke="#6a4a1c" strokeWidth={2}/>
      </g>
      <circle cx={PX} cy={PY} r={24} fill="url(#w1b-brass)" stroke="#6a4a1c" strokeWidth={3}/><circle cx={PX - 6} cy={PY - 6} r={7} fill="#fff6d0" opacity={0.8}/>
      <path d={`M${PX},${PY - 24} V${PY - 60}`} stroke="#8a6420" strokeWidth={5}/><circle cx={PX} cy={PY - 66} r={9} fill="#e3a53a" stroke="#6a4a1c" strokeWidth={2}/>
      {/* the paper clause sliding into the EQUALITY pan */}
      {mode === "steady" && slide > 0.001 && (
        <g transform={`translate(${pa[0]} ${pa[1]}) rotate(${-8 * (1 - slide)}) scale(${1 - 0.0 * slide})`} opacity={clamp(slide * 5)} style={{filter: "drop-shadow(0 10px 8px rgba(40,22,8,.35))"}}>
          <rect x={-60} y={-44} width={120} height={88} rx={4} fill="#fbf2d8" stroke="#b8a074" strokeWidth={2}/>
          <text x={0} y={-12} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={20} letterSpacing="0.06em" fill="#7a2a1a">CLAUSE</text>
          {[6, 18, 30].map((yy, i) => <rect key={i} x={-44} y={yy - 4} width={88 - i * 14} height={4} rx={2} fill="#9a8a6a" opacity={0.7}/>)}
        </g>
      )}
    </g>
  );
};
const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

export const BalanceLabels: React.FC<AP> = (p) => {
  const mode = (p.spec as any).mode ?? "wobble", L = rlabs(p), labs = (p.spec.labels ?? []) as {key: string}[];
  const g = (k: string) => { const i = labs.findIndex((l) => l.key === k); return i >= 0 ? L[i] : undefined; };
  if (mode === "wobble") {
    const eq = g("eq"), rs = g("rs");
    return <>{eq && <P2Card cx={560} y={90} text={eq.text} f={p.f} at={eq.at} size={50} maxW={520}/>}{rs && <P2Card cx={1360} y={90} text={rs.text} f={p.f} at={rs.at} size={50} maxW={560}/>}</>;
  }
  if (mode === "steady") {
    const c4 = g("c4"), ar = g("ar"), nv = g("nv"), f4 = g("f4");
    return <>
      {c4 && <P2Card cx={420} y={84} text={c4.text} f={p.f} at={c4.at} size={46} maxW={520}/>}
      {ar && <P2Card cx={1250} y={78} text={ar.text} f={p.f} at={ar.at} size={31} maxW={760} upper={false}/>}
      {nv && <P2Card cx={470} y={846} text={nv.text} f={p.f} at={nv.at} size={32} maxW={600} upper={false} tone="green"/>}
      {f4 && <P2Card cx={1450} y={846} text={f4.text} f={p.f} at={f4.at} size={30} maxW={600} upper={false}/>}
    </>;
  }
  const pp = g("pp");
  return <>{pp && <P2Card cx={960} y={84} text={pp.text} f={p.f} at={pp.at} size={50} maxW={1100} tone="green"/>}</>;
};

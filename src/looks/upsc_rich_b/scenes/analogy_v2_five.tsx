// GEO-04 Part 1, builder V2: `five-types`. mode "all" (s019): five cards on the girl's desk, the first two tick. modes "caldera", "flood", "ridge": that card grows and animates.
import React from "react";
import {W, H, eo, eio, clamp} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {V2Defs, Tick, ease, mix} from "./analogy_v2_kit";
import {CardShell, DomeCard, ConeCard, CalderaCard, FloodCard, RidgeCard, CW, CH} from "./analogy_v2_cards";

const SLOT = (i: number) => 960 + (i - 2) * 352, SY = 560, S0 = 0.62, ROT = [-2.2, 1.4, -0.8, 1.8, -1.5];
const MODES: Record<string, number> = {all: -1, caldera: 2, flood: 3, ridge: 4};

const Desk: React.FC<{f: number}> = ({f}) => (
  <g>
    <defs>
      <linearGradient id="v2dk-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a62"/><stop offset="1" stopColor="#8a5a30"/></linearGradient>
      <radialGradient id="v2dk-lamp" cx="30%" cy="10%" r="90%"><stop offset="0" stopColor="#fff2c8" stopOpacity="0.55"/><stop offset="1" stopColor="#fff2c8" stopOpacity="0"/></radialGradient>
    </defs>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#v2dk-wood)"/>
    {Array.from({length: 11}, (_, i) => <path key={i} d={`M-60,${i * 100 + 20} Q960,${i * 100 + 4 + (i % 3) * 10} 1980,${i * 100 + 22}`} stroke="#6e4524" strokeWidth={1.8} fill="none" opacity={0.4}/>)}
    {Array.from({length: 22}, (_, i) => <ellipse key={i} cx={(i * 211) % 1900} cy={(i * 137) % 1060} rx={30 + (i % 4) * 14} ry={3} fill="#6e4524" opacity={0.15}/>)}
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#v2dk-lamp)"/>
    {/* notebook, pencils, eraser, a mug seen from above */}
    <g transform="translate(250 900) rotate(-8)">
      <rect x={-200} y={-90} width={400} height={230} rx={8} fill="#f3ead6" stroke="#b8a37a" strokeWidth={2} style={{filter: "drop-shadow(0 10px 8px rgba(40,22,8,.35))"}}/>
      {Array.from({length: 8}, (_, i) => <line key={i} x1={-180} y1={-60 + i * 24} x2={180} y2={-60 + i * 24} stroke="#9fb8d4" strokeWidth={1.4} opacity={0.7}/>)}
      <line x1={-150} y1={-90} x2={-150} y2={140} stroke="#d88a8a" strokeWidth={1.6} opacity={0.7}/>
    </g>
    <g transform="translate(760 960) rotate(-14)"><rect x={-130} y={-7} width={260} height={14} rx={3} fill="#e0a02a" stroke="#8a5c10" strokeWidth={1.5}/><path d="M130,-7 L168,0 L130,7 Z" fill="#e8c9a0" stroke="#8a5c10"/><path d="M158,-2.5 L168,0 L158,2.5 Z" fill="#333"/><rect x={-130} y={-7} width={30} height={14} fill="#c0c0c8"/></g>
    <rect x={1010} y={915} width={90} height={42} rx={8} fill="#e9e0d0" stroke="#b8a888" strokeWidth={2} transform="rotate(6 1055 936)" style={{filter: "drop-shadow(0 6px 5px rgba(40,22,8,.3))"}}/>
    <g transform="translate(1640 905)"><ellipse cx={4} cy={10} rx={78} ry={74} fill="#2a1808" opacity={0.25}/><circle r={74} fill="#e6e1d4" stroke="#b8b0a0" strokeWidth={3}/><circle r={58} fill="#4a2c18"/><circle r={58} fill="#8a5a38" opacity={0.25 + 0.05 * Math.sin(f / 20)}/><path d="M70,-14 q44,2 40,32 q-4,26 -40,20" fill="none" stroke="#e6e1d4" strokeWidth={16} strokeLinecap="round"/></g>
  </g>
);

export const FiveArt: React.FC<AP> = ({f, dur, spec, at}) => {
  const mode = (spec as any).mode ?? "all", sel = MODES[mode] ?? -1;
  const L = rlabs({f, dur, spec, at} as AP);
  const g = sel >= 0 ? ease(f, 6, 36) : 0;
  const tk = [eo(prog(f, (L[0]?.at ?? 20) + 34, 12)), eo(prog(f, (L[0]?.at ?? 20) + 62, 12))];
  const cdA = L[0]?.at ?? 60, clA = L[1]?.at ?? 160, T0 = Math.max(46, cdA);
  const par = {
    emp: sel === 2 ? ease(f, T0, 70) : 1, col: sel === 2 ? ease(f, T0 + 55, 70) : 1, lake: sel === 2 ? ease(f, Math.max(T0 + 130, clA - 10), 100) : 1,
    flood: sel === 3 ? prog(f, 46, Math.max(80, dur - 92)) : 1, ridge: sel === 4 ? prog(f, 40, Math.max(80, dur - 70)) : 0.85,
  };
  const kinds = [0, 1, 2, 3, 4];
  return (
    <g>
      <V2Defs/>
      <Desk f={f}/>
      {kinds.map((i) => {
        const inT = sel < 0 ? ease(f, 6 + i * 7, 26) : 1;
        const isSel = i === sel, k = isSel ? g : 0;
        const cx = isSel ? mix(SLOT(i), 640, k) : SLOT(i), cy = isSel ? mix(SY, 520, k) : SY + (1 - inT) * 160;
        const sc = isSel ? mix(S0, 1.34, k) : S0 * (1 - 0.1 * g), rot = isSel ? mix(ROT[i], 0, k) : ROT[i];
        const op = isSel ? Math.min(1, inT * 3) : (1 - g) * Math.min(1, inT * 3);
        if (op <= 0.003) return null;
        const u = `v2c${i}`;
        return (
          <g key={i} opacity={op} transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${sc}) translate(${-CW / 2} ${-CH / 2})`} style={{filter: "drop-shadow(0 16px 14px rgba(40,22,8,.42))"}}>
            <CardShell u={u}>
              {i === 0 && <DomeCard u={u} f={f}/>}
              {i === 1 && <ConeCard u={u} f={f}/>}
              {i === 2 && <CalderaCard u={u} f={f} emp={par.emp} col={par.col} lake={par.lake}/>}
              {i === 3 && <FloodCard u={u} f={f} p={par.flood}/>}
              {i === 4 && <RidgeCard u={u} f={f} p={par.ridge}/>}
            </CardShell>
            {sel < 0 && i < 2 && <g transform={`translate(${CW - 6} 20)`}><Tick x={0} y={0} a={tk[i]} r={44}/></g>}
          </g>
        );
      })}
    </g>
  );
};

export const FiveLabels: React.FC<AP> = (p) => {
  const L = rlabs(p), mode = (p.spec as any).mode ?? "all";
  if (mode === "all") return <>{L[0] && <P2Card cx={960} y={120} text={L[0].text} f={p.f} at={L[0].at} size={52} maxW={1300}/>}</>;
  if (mode === "caldera") return (
    <>
      {L[0] && <P2Card cx={1440} y={150} text={L[0].text} f={p.f} at={L[0].at} size={40} maxW={720}/>}
      {L[1] && <P2Card cx={1440} y={560} text={L[1].text} f={p.f} at={L[1].at} size={34} maxW={640} upper={false}/>}
    </>
  );
  if (mode === "flood") return <>{L[0] && <P2Card cx={1440} y={300} text={L[0].text} f={p.f} at={L[0].at} size={44} maxW={640}/>}</>;
  return (
    <>
      {L[0] && <P2Card cx={1440} y={150} text={L[0].text} f={p.f} at={L[0].at} size={42} maxW={660}/>}
      {L[1] && <P2Card cx={1440} y={560} text={L[1].text} f={p.f} at={L[1].at} size={34} maxW={640} upper={false}/>}
    </>
  );
};

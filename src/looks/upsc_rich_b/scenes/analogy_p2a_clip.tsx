// Part 2 analogy "checklist": a clipboard whose lines tick at at(key), beside a small schematic inset (Kerala coast for the onset, the
// north-west for the withdrawal). Pure function of f and at(key); no figure is typed (station counts are read from the label text).
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio} from "../kit";
import {FlowArrow, Hills, lerp, prog, Shimmer, type AP, type Pt} from "./analogy_kit";
import {Puff, items, type Item} from "./analogy_p2a_parts";

const PX = 146, PY = 150, PW = 858; // paper
const IX = 1100, IY = 262, IW = 700, IH = 616; // inset card

const Desk: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="p2c-desk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e2c69a"/><stop offset="0.6" stopColor="#c99f6b"/><stop offset="1" stopColor="#a8794a"/></linearGradient>
      <linearGradient id="p2c-board" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c68f58"/><stop offset="1" stopColor="#8b5a2c"/></linearGradient>
      <linearGradient id="p2c-steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2f4f6"/><stop offset="0.5" stopColor="#b9c1c8"/><stop offset="1" stopColor="#7d8791"/></linearGradient>
      <linearGradient id="p2c-light" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff2c8" stopOpacity="0.55"/><stop offset="1" stopColor="#fff2c8" stopOpacity="0"/></linearGradient>
    </defs>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#p2c-desk)"/>
    {Array.from({length: 17}, (_, i) => <path key={i} d={`M-60,${i * 66 - 20} Q960,${i * 66 - 34 + (i % 3) * 10} 1980,${i * 66 - 10}`} stroke="#8a5e34" strokeWidth={1.6} fill="none" opacity={0.28}/>)}
    <path d="M-60,-60 L1100,-60 L520,1140 L-60,1140 Z" fill="url(#p2c-light)"/>
  </g>
);

const Board: React.FC<{title: string}> = ({title}) => (
  <g transform="rotate(-1.1 575 500)">
    <rect x={PX - 40 + 14} y={PY - 66 + 20} width={PW + 80} height={780} rx={30} fill="#2a1808" opacity={0.28} filter="url(#ak-blur22)"/>
    <rect x={PX - 40} y={PY - 66} width={PW + 80} height={780} rx={30} fill="url(#p2c-board)" stroke="#5a3418" strokeWidth={2.4}/>
    <rect x={PX - 34} y={PY - 60} width={PW + 68} height={14} rx={7} fill="#f0cf9a" opacity={0.45}/>
    <rect x={PX} y={PY} width={PW} height={700 - 16} rx={6} fill="#fffaf0" stroke="#d8c8a8" strokeWidth={1.4} style={{filter: "drop-shadow(0 6px 8px rgba(60,34,12,.28))"}}/>
    {Array.from({length: 14}, (_, i) => <line key={i} x1={PX + 18} x2={PX + PW - 18} y1={PY + 280 + i * 40} y2={PY + 280 + i * 40} stroke="#b9cde0" strokeWidth={1.2} opacity={0.5}/>)}
    <line x1={PX + 44} x2={PX + 44} y1={PY + 8} y2={PY + 684} stroke="#e29a8a" strokeWidth={2} opacity={0.6}/>
    {/* steel clip */}
    <rect x={PX + PW / 2 - 118} y={PY - 112} width={236} height={86} rx={16} fill="url(#p2c-steel)" stroke="#5f6a74" strokeWidth={2.2} style={{filter: "drop-shadow(0 8px 6px rgba(40,22,8,.4))"}}/>
    <rect x={PX + PW / 2 - 78} y={PY - 98} width={156} height={20} rx={10} fill="#4f5a64" opacity={0.55}/>
    <circle cx={PX + PW / 2} cy={PY - 52} r={9} fill="#3b444c"/>
    <text x={PX + 66} y={PY + 82} fontFamily={SERIF} fontWeight={700} fontSize={50} fill="#3a2412">{title}</text>
    <path d={`M${PX + 66},${PY + 104} H${PX + PW - 60}`} stroke="#c0522a" strokeWidth={3.2}/>
    <path d={`M${PX + 66},${PY + 113} H${PX + PW - 60}`} stroke="#c0522a" strokeWidth={1.2} opacity={0.7}/>
  </g>
);

const Row: React.FC<{it: Item; i: number; n: number; f: number}> = ({it, i, n, f}) => {
  const sp = n > 5 ? 88 : 116, cy = PY + 196 + i * sp, bx = PX + 66, a = eo(prog(f, it.at, 12));
  const stamp = !it.isLab;
  if (stamp) {
    const s = it.text, w = Math.max(420, s.length * 36 + 60), u = prog(f, it.at, 12), sc = 1 + (1 - eo(u)) * 0.9 + Math.sin(clamp(u) * Math.PI) * 0.06;
    return (
      <g opacity={eo(prog(f, it.at, 6))} transform={`translate(${bx + w / 2 + 10} ${cy}) rotate(-3) scale(${sc})`}>
        <rect x={-w / 2} y={-40} width={w} height={80} rx={14} fill="#e5f4e6" opacity={0.7}/>
        <rect x={-w / 2} y={-40} width={w} height={80} rx={14} fill="none" stroke="#1f8a4c" strokeWidth={6}/>
        <rect x={-w / 2 + 9} y={-31} width={w - 18} height={62} rx={9} fill="none" stroke="#1f8a4c" strokeWidth={2}/>
        <text x={0} y={14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={42} letterSpacing={5} fill="#1b7a42">{s}</text>
      </g>
    );
  }
  const tk = eo(prog(f, it.at + 5, 11)), L = 90;
  return (
    <g>
      <rect x={bx} y={cy - 24} width={48} height={48} rx={9} fill="#fffdf6" stroke="#7a5a3a" strokeWidth={3.2}/>
      <path d={`M${bx + 9},${cy + 2} L${bx + 21},${cy + 15} L${bx + 45},${cy - 21}`} fill="none" stroke="#25995a" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - tk)} opacity={a > 0 ? 1 : 0}/>
      <text x={bx + 80 - (1 - a) * 14} y={cy + 14} fontFamily={SANS} fontWeight={600} fontSize={Math.min(38, 690 / (it.text.length * 0.54))} fill="#2e2a24" opacity={a}>{it.text}</text>
    </g>
  );
};

/** the inset: a schematic top-down coast. mode "on" = Kerala coast, "wd" = the north-west */
const coastX = (y: number, mode: "on" | "wd") => {
  const u = clamp(y / IH);
  return mode === "on" ? 360 - 230 * Math.pow(u, 1.15) + 9 * Math.sin(u * 14) : 330 - 40 * u + 16 * Math.sin(u * 7) + 8 * Math.sin(u * 19);
};
const Drop: React.FC<{x: number; y: number; s: number; a: number}> = ({x, y, s, a}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0,-12 C8,-2 10,4 10,8 C10,14 5,18 0,18 C-5,18 -10,14 -10,8 C-10,4 -8,-2 0,-12 Z" fill="#3c9ad8" stroke="#1d5f98" strokeWidth={1.6} opacity={a}/>
);

const Inset: React.FC<AP & {mode: "on" | "wd"; its: Item[]; N: number; frac: number}> = ({f, its, mode, N, frac}) => {
  const on = mode === "on", at = (i: number) => (its[i] ? its[i].at : 1e9), land = [] as string[];
  for (let y = -10; y <= IH + 10; y += 14) land.push(`${coastX(y, mode).toFixed(1)},${y}`);
  const landD = `M${land.join(" L")} L${IW + 20},${IH + 10} L${IW + 20},-10 Z`;
  const coastD = `M${land.join(" L")}`;
  const lit = Math.ceil(frac * N);
  const dots = Array.from({length: N}, (_, i) => { const y = 54 + i * ((IH - 120) / (N - 1)); return {x: coastX(y, mode) + (on ? 36 : 44), y}; });
  const aWind = on ? eo(prog(f, at(3), 40)) : eo(prog(f, at(3), 40));
  const cloudG = on ? eo(prog(f, at(4), 38)) : 0;
  const beamA = on ? eo(prog(f, at(4) + 10, 24)) : 0;
  const decl = on ? eo(prog(f, at(5), 16)) : 0;
  const wob = Math.sin(f / 23) * 4;
  return (
    <g>
      {/* satellite above the inset (onset only) */}
      {on && (
        <g>
          <g transform={`translate(${IX + 540 + wob} ${IY - 118}) rotate(-14)`} style={{filter: "drop-shadow(0 8px 8px rgba(40,22,8,.35))"}}>
            <rect x={-132} y={-18} width={96} height={36} rx={4} fill="#274a8a" stroke="#14295a" strokeWidth={2}/>
            <rect x={36} y={-18} width={96} height={36} rx={4} fill="#274a8a" stroke="#14295a" strokeWidth={2}/>
            {[-100, -68, 68, 100].map((x, i) => <line key={i} x1={x} x2={x} y1={-18} y2={18} stroke="#6f94d0" strokeWidth={1.6}/>)}
            <line x1={-132} x2={-36} y1={0} y2={0} stroke="#6f94d0" strokeWidth={1.4}/><line x1={36} x2={132} y1={0} y2={0} stroke="#6f94d0" strokeWidth={1.4}/>
            <rect x={-34} y={-30} width={68} height={60} rx={10} fill="#e9eef2" stroke="#6b7782" strokeWidth={2.2}/>
            <rect x={-34} y={6} width={68} height={24} rx={8} fill="#c1ccd6" opacity={0.7}/>
            <circle cx={0} cy={44} r={14} fill="#b9c4ce" stroke="#6b7782" strokeWidth={2}/><circle cx={0} cy={44} r={5} fill="#3b4650"/>
          </g>
        </g>
      )}
      <rect x={IX - 14} y={IY - 14} width={IW + 28} height={IH + 28} rx={36} fill="#fffaf0" stroke="#8a6a3e" strokeWidth={2.4} style={{filter: "drop-shadow(0 24px 22px rgba(60,34,12,.45))"}}/>
      <defs>
        <clipPath id={`p2c-clip-${mode}`}><rect x={IX} y={IY} width={IW} height={IH} rx={24}/></clipPath>
        <linearGradient id={`p2c-sea-${mode}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#58b4c4"/><stop offset="0.5" stopColor="#2f86b0"/><stop offset="1" stopColor="#1d5c92"/></linearGradient>
        <linearGradient id={`p2c-land-${mode}`} x1="0" y1="0" x2="1" y2="1">{on ? <><stop offset="0" stopColor="#a9cf7e"/><stop offset="1" stopColor="#5f9a54"/></> : <><stop offset="0" stopColor="#f0d79a"/><stop offset="1" stopColor="#cfa764"/></>}</linearGradient>
        <radialGradient id="p2c-cold" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#c9a6e6" stopOpacity="0.9"/><stop offset="0.5" stopColor="#8fd0ee" stopOpacity="0.65"/><stop offset="1" stopColor="#ffffff" stopOpacity="0"/></radialGradient>
      </defs>
      <g clipPath={`url(#p2c-clip-${mode})`}>
        <g transform={`translate(${IX} ${IY})`}>
          <rect width={IW} height={IH} fill={`url(#p2c-sea-${mode})`}/>
          {Array.from({length: 12}, (_, i) => <path key={i} d={`M${20 + (i % 3) * 40},${40 + i * 50} q22,-9 44,0 q22,9 44,0`} stroke="#e9f8ff" strokeWidth={2.4} fill="none" opacity={0.28 + 0.14 * Math.sin(f / 14 + i)} transform={`translate(${Math.sin(f / 40 + i) * 8} 0)`}/>)}
          <path d={landD} fill="none" stroke="#bfe8f0" strokeWidth={26} opacity={0.35} filter="url(#ak-blur8)"/>
          <path d={landD} fill={`url(#p2c-land-${mode})`} stroke={on ? "#3f6f3a" : "#9a7236"} strokeWidth={2.4}/>
          {/* relief: ridge band parallel to the coast */}
          {Array.from({length: 17}, (_, i) => { const y = 20 + i * 36, x = coastX(y, mode) + (on ? 150 : 250) + Math.sin(i * 1.7) * 10; return on
            ? <path key={i} d={`M${x - 26},${y + 16} L${x},${y - 18} L${x + 28},${y + 16} Z`} fill="#3e7a45" stroke="#2a5530" strokeWidth={1.6} opacity={0.75}/>
            : <path key={i} d={`M${x - 40},${y + 6} q20,-14 40,0 q20,14 40,0`} fill="none" stroke="#b58a46" strokeWidth={2.6} opacity={0.7}/>; })}
          {!on && Array.from({length: 14}, (_, i) => <path key={`d${i}`} d={`M${coastX(40 + i * 40, mode) + 90},${60 + i * 40} q30,-12 60,0 q30,12 60,0`} stroke="#fff0c4" strokeWidth={3} fill="none" opacity={0.5}/>)}
          {on && <path d={`M${coastX(60, mode) + 80},0 Q${coastX(200, mode) + 120},180 ${coastX(300, mode) + 40},300 Q${coastX(420, mode) + 30},400 ${coastX(500, mode) + 10},520`} fill="none" stroke="#4aa3d6" strokeWidth={3} opacity={0.7}/>}
          <path d={coastD} fill="none" stroke="#fffaf0" strokeWidth={3.4} opacity={0.8}/>
          {/* station dots */}
          {dots.map((d, i) => {
            const lt = on ? eo(prog(f, at(1) + i * 2.2, 8)) : 0, dry = !on ? eo(prog(f, at(1) + i * 2, 8)) : 0, rain = on ? eo(prog(f, at(2) + i * 2.2, 10)) : 0;
            return (
              <g key={i}>
                <circle cx={d.x} cy={d.y} r={13} fill={on ? (i < lit ? "#fffaf0" : "#fffaf0") : "#fffaf0"} stroke="#5a4a38" strokeWidth={2.6}/>
                {on && i < lit && <circle cx={d.x} cy={d.y} r={9.5 * lt} fill="#2f86d0"/>}
                {on && i < lit && <Drop x={d.x + 24} y={d.y - 2} s={0.62 * rain} a={rain}/>}
                {!on && <circle cx={d.x} cy={d.y} r={9.5 * dry} fill="#c9a064"/>}
                {!on && dry > 0.3 && <path d={`M${d.x - 5},${d.y} h10`} stroke="#fffaf0" strokeWidth={3} strokeLinecap="round" opacity={dry}/>}
              </g>
            );
          })}
          {/* wind */}
          {on && <FlowArrow pts={[[30, 360], [150, 340 + wob], [300, 330]] as Pt[]} f={f} p={aWind} w={24} c1="#4aa8e0" c2="#bfe6fa" dark="#1f5f94" speed={2}/>}
          {!on && <FlowArrow pts={[[560, 120], [420, 220], [250, 330], [90, 420]] as Pt[]} f={f} p={aWind} w={24} c1="#e8913a" c2="#ffd89a" dark="#8a4a14" speed={1.6}/>}
          {/* dry air */}
          {!on && [0, 1, 2, 3, 4].map((k) => <g key={k} opacity={eo(prog(f, at(2), 30))}><Shimmer x={IW - 120 - k * 84} y={IH - 40} hgt={260} f={f} k={k * 0.19} col="#c8782a" w={4}/></g>)}
          {/* fair-weather sun on the dry side */}
          {!on && <g transform={`translate(${IW - 90} 86)`} opacity={0.95}><circle r={44} fill="url(#ak-sunglow)"/><circle r={26} fill="url(#ak-sundisc)" stroke="#e8a02a" strokeWidth={1.6}/></g>}
          {/* cloud: thin cirrus drifting, then the tall cloud */}
          {on && <g opacity={1 - cloudG * 0.4}>{[0, 1].map((k) => <ellipse key={k} cx={((f * 0.4 + k * 330) % 800) - 40} cy={110 + k * 90} rx={110} ry={16} fill="#fff" opacity={0.35}/>)}</g>}
          {on && cloudG > 0 && (
            <g>
              <ellipse cx={410} cy={310} rx={200 * cloudG} ry={170 * cloudG} fill="url(#p2c-cold)"/>
              <Puff x={392} y={352} s={0.78} grow={cloudG} seed={4} f={f}/><Puff x={440} y={300} s={0.6} grow={cloudG} seed={5} f={f}/><Puff x={410} y={246} s={0.46} grow={cloudG} seed={6} f={f}/>
            </g>
          )}
          {on && decl > 0 && <circle cx={coastX(300, mode) + 36} cy={300} r={170 * decl} fill="none" stroke="#25995a" strokeWidth={5} opacity={0.6 * (1 - decl * 0.6)}/>}
          <rect x={18} y={16} width={on ? 214 : 270} height={42} rx={21} fill="#fffaf0" opacity={0.9}/>
          <text x={34} y={45} fontFamily={SANS} fontWeight={800} fontSize={21} letterSpacing={3} fill="#5a3a1c">{on ? "KERALA COAST" : "NORTH-WEST INDIA"}</text>
        </g>
      </g>
      {on && beamA > 0 && (
        <g opacity={beamA}>
          <defs><linearGradient id="p2c-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff1b8" stopOpacity="0.8"/><stop offset="1" stopColor="#fff1b8" stopOpacity="0.12"/></linearGradient></defs>
          <path d={`M${IX + 536 + wob},${IY - 84} L${IX + 250},${IY + 330} L${IX + 520},${IY + 340} Z`} fill="url(#p2c-beam)"/>
          <path d={`M${IX + 536 + wob},${IY - 84} L${IX + 250},${IY + 330} M${IX + 536 + wob},${IY - 84} L${IX + 520},${IY + 340}`} stroke="#f0b840" strokeWidth={2.4} strokeDasharray="10 8" fill="none"/>
        </g>
      )}
    </g>
  );
};

export const ChecklistArt: React.FC<AP> = (p) => {
  const {f, spec} = p, its = items(p), title = String((spec as any).title ?? ""), on = /onset/i.test(title);
  const t2 = its[1]?.text ?? "", pct = /(\d+)\s*%/.exec(t2), cnt = /(\d+)\s*(?:listed|stations)/.exec(t2);
  // station count and share are read from the label text, so the drawing can never disagree with it
  const N = cnt ? clamp(parseInt(cnt[1], 10), 4, 20) : 10, frac = pct ? clamp(parseInt(pct[1], 10) / 100, 0.1, 1) : 0.6;
  const inN = its.length;
  void eio; void lerp; void Hills; void H;
  return (
    <g>
      <Desk/>
      <Board title={title}/>
      <g transform="rotate(-1.1 575 500)">{its.map((it, i) => <Row key={i} it={it} i={i} n={inN} f={f}/>)}</g>
      <Inset {...p} mode={on ? "on" : "wd"} its={its} N={N} frac={frac}/>
    </g>
  );
};
export const ChecklistLabels: React.FC<AP> = () => null;

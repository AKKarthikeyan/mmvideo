// GEO-04 Part 1, builder V3: `hotspot` (s033). A cut-away: a fixed plume of heat under a plate that drifts left; islands are born over the plume one by one and are
// carried away on the plate, older ones lower and more worn. Motion is a function of f, dur and at(key) only.
import React from "react";
import {W, H, clamp, eo, eio, lerp} from "../kit";
import {FlowArrow, type AP, type Pt} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {V3Defs, Leader, Rise, seg, prog} from "./analogy_v3_kit";

const SEA = 392, FLOOR = 486, PLATE = 600, PX = 1270;       // sea surface, sea floor, plate base, plume x
const BIRTH = [0.03, 0.24, 0.45, 0.66, 0.87], TRAVEL = 1000;  // islands are born over the plume at these fractions of the scene; the plate carries them TRAVEL px by the end

/** one island: cross-section of a shield volcano that grows, then sinks and wears down as the plate carries it away */
const Island: React.FC<{x: number; age: number; seed: number; f: number; hot: boolean}> = ({x, age, seed, f, hot}) => {
  const grow = eo(age / 0.1), worn = eo(clamp((age - 0.08) / 0.85)), hgt = 252 * grow * lerp(1, 0.5, worn), hw = 150 + 18 * worn;
  if (grow < 0.01) return null;
  const pts: Pt[] = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40, dx = (u - 0.5) * 2 * hw, shield = Math.pow(1 - Math.pow(Math.abs(u - 0.5) * 2, 1.7), 1.15);
    // old islands are cut by valleys
    const gully = worn * 20 * Math.abs(Math.sin(u * 17 + seed * 3)) * Math.min(1, shield * 3) * (0.4 + 0.6 * Math.abs(Math.sin(u * 5 + seed)));
    pts.push([x + dx, FLOOR - Math.max(0, hgt * shield - gully)]);
  }
  const d = "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L") + `L${x + hw} ${FLOOR + 2}L${x - hw} ${FLOOR + 2}Z`;
  const peak = pts[20], top = peak[1];
  const green = clamp(worn * 1.6), id = `v3is${seed}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={green > 0.2 ? "#58814a" : "#4a3f3b"}/><stop offset="0.45" stopColor={green > 0.2 ? "#6f6a4a" : "#3c3532"}/><stop offset="1" stopColor="#2f2a2c"/></linearGradient>
        <clipPath id={`${id}c`}><path d={d}/></clipPath>
      </defs>
      <path d={d} fill={`url(#${id})`} stroke="#241c1a" strokeWidth={2} strokeLinejoin="round"/>
      <g clipPath={`url(#${id}c)`}>
        {[0.18, 0.36, 0.54, 0.72].map((u, i) => <path key={i} d={pts.map((p, k) => `${k ? "L" : "M"}${p[0].toFixed(1)} ${(p[1] + (FLOOR - top) * u * 0.55).toFixed(1)}`).join("")} fill="none" stroke="#17120f" strokeWidth={1.4} opacity={0.35}/>)}
        <path d={d} fill="url(#v3-dots)" opacity={0.6}/>
        {green > 0.15 && <path d={pts.slice(2, 39).map((p, k) => `${k ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("")} fill="none" stroke="#7fb352" strokeWidth={9 * green} strokeLinecap="round" opacity={0.9}/>}
        {worn > 0.5 && <path d={`M${x - hw},${FLOOR - 8}L${x + hw},${FLOOR - 8}`} stroke="#8fe0d4" strokeWidth={10} opacity={0.0}/>}
      </g>
      {hot && (
        <g>
          <path d={`M${peak[0] - 22},${top + 6} Q${peak[0]},${top - 8} ${peak[0] + 22},${top + 6} Q${peak[0]},${top + 16} ${peak[0] - 22},${top + 6}Z`} fill="url(#v3-lava)"/>
          <circle cx={peak[0]} cy={top} r={60} fill="url(#v3-glow)" opacity={0.7 + 0.2 * Math.sin(f / 6)}/>
          <path d={`M${peak[0] + 8},${top + 8} Q${peak[0] + 40},${top + 40} ${peak[0] + 70},${FLOOR - 70 * grow}`} fill="none" stroke="#ff7a22" strokeWidth={7} strokeLinecap="round" opacity={0.9}/>
          {[0, 1, 2, 3].map((i) => { const u = (f * 0.008 + i / 4) % 1; return <circle key={i} cx={peak[0] + 4 + u * 40} cy={top - 6 - u * 110} r={10 + u * 26} fill="url(#ak-cloud)" opacity={Math.min(1, u * 5) * (1 - u) * 0.8 * grow}/>; })}
        </g>
      )}
    </g>
  );
};

export const HotspotArt: React.FC<AP> = ({f, dur, at}) => {
  const T = f / Math.max(1, dur), tp = at("pm"), pm = eo(prog(f, tp, 40)), tk = at("ka");
  const isl = BIRTH.map((b, k) => ({k, age: T - b, x: PX - TRAVEL * Math.max(0, T - b)})).filter((s) => s.age > 0).reverse();
  const oldest = isl[isl.length - 1], plumeA = 0.55 + 0.45 * seg(f, at("jw") - 20, 40);
  const drift = (f * TRAVEL) / Math.max(1, dur);       // plate texture slides left at the same speed as the islands
  const wob = (x: number) => SEA + 3 * Math.sin(x / 70 + f / 22) + 2 * Math.sin(x / 33 - f / 15);
  let wave = ""; for (let x = -20; x <= W + 20; x += 18) wave += `${wave ? "L" : "M"}${x} ${wob(x).toFixed(1)}`;
  const young = isl.find((s) => s.age < 0.24);
  return (
    <g>
      <V3Defs/>
      <defs>
        <linearGradient id="v3h-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b6e0ee" stopOpacity="0.55"/><stop offset="1" stopColor="#2a6b99" stopOpacity="0.78"/></linearGradient>
        <linearGradient id="v3h-plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f6679"/><stop offset="0.32" stopColor="#3c5063"/><stop offset="0.34" stopColor="#8396a8"/><stop offset="1" stopColor="#687c90"/></linearGradient>
        <radialGradient id="v3h-plume" cx="50%" cy="30%" r="75%"><stop offset="0" stopColor="#fff0a8"/><stop offset="0.3" stopColor="#ffa83a"/><stop offset="0.7" stopColor="#e04a1a"/><stop offset="1" stopColor="#a8301a"/></radialGradient>
        <clipPath id="v3h-plateclip"><rect x={-20} y={FLOOR} width={W + 40} height={PLATE - FLOOR}/></clipPath>
      </defs>
      <Sky2 f={f}/>
      {/* mantle with the fixed plume */}
      <rect x={-20} y={FLOOR} width={W + 40} height={H - FLOOR + 40} fill="url(#v3-mantle)"/>
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M-40,${760 + i * 54} Q${500 + i * 60},${700 + i * 50 + Math.sin(f / 40 + i) * 10} ${1000 + i * 80},${780 + i * 50}`} fill="none" stroke="#f0a060" strokeWidth={3} opacity={0.16} strokeDasharray="30 22" strokeDashoffset={-f * 0.5}/>)}
      <ellipse cx={PX} cy={PLATE + 30} rx={260} ry={110} fill="url(#v3-glow)" opacity={0.75 * plumeA}/>
      <path d={`M${PX - 54},1100 C${PX - 70},900 ${PX - 40},760 ${PX - 118},${PLATE + 18} Q${PX},${PLATE - 14} ${PX + 118},${PLATE + 18} C${PX + 40},760 ${PX + 70},900 ${PX + 54},1100Z`} fill="url(#v3h-plume)" opacity={0.92 * plumeA}/>
      <Rise x0={PX} y0={1070} x1={PX} y1={PLATE + 6} f={f} n={12} r={8} seed={4} a={plumeA}/>
      {[0, 1, 2].map((i) => <ellipse key={i} cx={PX + Math.sin(f / 30 + i * 2) * 22} cy={880 - ((f * 0.9 + i * 120) % 360) * 0.9} rx={26} ry={9} fill="#fff4c0" opacity={0.3 * plumeA}/>)}
      {/* the plate: dark crust over lighter lithosphere, texture sliding with it */}
      <rect x={-20} y={FLOOR} width={W + 40} height={PLATE - FLOOR} fill="url(#v3h-plate)"/>
      <g clipPath="url(#v3h-plateclip)">
        <rect x={-20} y={FLOOR} width={W + 40} height={PLATE - FLOOR} fill="url(#v3-dots)" opacity={0.5}/>
        {[0, 1, 2].map((i) => <line key={i} x1={-20} y1={FLOOR + 50 + i * 20} x2={W + 20} y2={FLOOR + 50 + i * 20} stroke="#dbe6f0" strokeWidth={2} opacity={0.3} strokeDasharray="34 26" strokeDashoffset={drift}/>)}
        <rect x={-20} y={FLOOR} width={W + 40} height={4} fill="#c7d6e2" opacity={0.5}/>
        <ellipse cx={PX} cy={PLATE} rx={150} ry={46} fill="url(#v3-glow)" opacity={0.9 * plumeA}/>
      </g>
      {/* the conduit from the plume to the island that is being built */}
      <path d={`M${PX - 12},${PLATE + 4}L${PX - 8},${FLOOR - 30}L${PX + 8},${FLOOR - 30}L${PX + 12},${PLATE + 4}Z`} fill="url(#v3-lava)" opacity={0.95}/>
      <Rise x0={PX} y0={PLATE} x1={PX} y1={FLOOR - 24} f={f} n={4} r={5} seed={9}/>
      {/* islands, oldest first (far left) */}
      {isl.slice().reverse().map((s) => <Island key={s.k} x={s.x} age={s.age} seed={s.k + 1} f={f} hot={s === young && s.age < 0.2}/>)}
      <ellipse cx={PX} cy={FLOOR - 14} rx={110 * seg(f, 0, 30) * (T < BIRTH[0] ? 1 : 0)} ry={26} fill="url(#v3-glow)" opacity={0.8}/>
      {/* sea */}
      <path d={`${wave}L${W + 20},${FLOOR + 1}L-20,${FLOOR + 1}Z`} fill="url(#v3h-sea)"/>
      <path d={wave} fill="none" stroke="#e8f6fb" strokeWidth={3} opacity={0.85}/>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${80 + i * 280},${SEA + 26 + (i % 3) * 18} q22,-8 44,0 t44,0`} fill="none" stroke="#e8f6fb" strokeWidth={2} opacity={0.3}/>)}
      {/* plate motion arrow under the plate */}
      <FlowArrow pts={[[1000, PLATE + 70], [820, PLATE + 70], [560, PLATE + 70]]} f={f} p={pm} w={28} c1="#f0a43a" dark="#6a3510" op={pm}/>
      {/* leader to the oldest island (Kauai) */}
      {oldest && <Leader from={[560, 252]} to={[oldest.x, FLOOR - 252 * lerp(1, 0.5, eo(clamp((oldest.age - 0.08) / 0.85))) - 10]} a={seg(f, tk, 26)}/>}
    </g>
  );
};
const Sky2: React.FC<{f: number}> = ({f}) => (
  <g>
    <rect x={-60} y={-60} width={W + 120} height={SEA + 80} fill="url(#v3-sky)"/>
    <circle cx={1640} cy={200} r={170} fill="url(#ak-sunglow)" opacity={0.7}/>
    <circle cx={1640} cy={200} r={46} fill="url(#ak-sundisc)"/>
    {[0, 1, 2].map((i) => { const x = ((i * 760 + f * 0.22 + 200) % 2300) - 250, y = 150 + (i % 2) * 90; return <g key={i} transform={`translate(${x} ${y})`} opacity={0.75}>{[[-56, 6, 36], [-10, -10, 50], [44, 4, 40], [88, 12, 26]].map((c, k) => <circle key={k} cx={c[0]} cy={c[1]} r={c[2]} fill="url(#ak-cloud)"/>)}</g>; })}
  </g>
);

export const HotspotLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return (
    <>
      {L[0] && <P2Card cx={1560} y={742} text={L[0].text} f={p.f} at={L[0].at} size={34} maxW={470} tone="dark" upper={false}/>}
      {L[1] && <P2Card cx={700} y={712} text={L[1].text} f={p.f} at={L[1].at} size={34} maxW={460} tone="dark"/>}
      {L[2] && <P2Card cx={560} y={130} text={L[2].text} f={p.f} at={L[2].at} size={34} maxW={620} upper={false}/>}
    </>
  );
};
void eio;

// ECO-16 Part 2, builder F2: `vault-crr` (b06) and `crr-timeline` (b10a default, b10b mode "slr"). A steel bank vault door with a big dial; a deposit bar behind glass with a fixed
// shaded share; the RBI as a plain classical building; a CRR dial walking down a dated line; a second, open vault for the SLR.
// Fractions and dial positions come from the e16_* tables (rr, c45...c3, slr); no number is typed.
import React from "react";
import {SANS, SERIF, clamp, eo, prog} from "../kit";
import type {AP} from "./analogy_kit";
import {FlowArrow} from "./analogy_kit";
import {Block, Brace, Classical, CoinStack, Defs, Dial, ECard, NoteStack, OfficeBG, Plate, Shade, Specks, Spot, StopSign, F, elabs, ez, lerp, pop, pulse, sm, v} from "./analogy_f2_kit";

// ---- the vault door ----------------------------------------------------------------------------------------------------------------
/** A round steel vault door in a square frame. open 0..1 swings it on the left hinge. `dialAng` is the pointer of the big dial, `arc` (0..1) the gold share on its ring,
 *  `kids` is drawn inside the opening (clipped to the round hole). */
export const VaultDoor: React.FC<{id: string; cx: number; cy: number; r: number; open?: number; f: number; dial?: boolean; dialAng?: number; arc?: number; lit?: number; kids?: React.ReactNode; plate?: React.ReactNode}> =
  ({id, cx, cy, r, open = 0, f, dial = true, dialAng = -135, arc = 0.2, lit = 0, kids, plate}) => {
  const sx = Math.cos((open * 78 * Math.PI) / 180), hx = cx - r, fr = r + 48;
  const rad = (d: number) => ((d - 90) * Math.PI) / 180, rd = r * 0.4;
  const arcEnd = -135 + 270 * arc, P = (d: number, rr: number) => [cx + Math.cos(rad(d)) * rr, cy + Math.sin(rad(d)) * rr];
  const a0 = P(-135, rd * 0.86), a1 = P(arcEnd, rd * 0.86), b1 = P(135, rd * 0.86);
  return (
    <g>
      <defs>
        <clipPath id={`${id}-hole`}><circle cx={cx} cy={cy} r={r + 6}/></clipPath>
        <radialGradient id={`${id}-door`} cx="36%" cy="30%" r="90%"><stop offset="0" stopColor="#f4f8fa"/><stop offset="0.5" stopColor="#b9c6ce"/><stop offset="1" stopColor="#6c7d89"/></radialGradient>
        <radialGradient id={`${id}-in`} cx="50%" cy="45%" r="75%"><stop offset="0" stopColor="#6a4a26"/><stop offset="0.6" stopColor="#3a2612"/><stop offset="1" stopColor="#1c1208"/></radialGradient>
      </defs>
      {lit > 0.01 && <circle cx={cx} cy={cy} r={r * 1.5} fill="url(#ak-sunglow)" opacity={0.55 * lit}/>}
      <ellipse cx={cx + 10} cy={cy + fr + 8} rx={fr * 0.95} ry={20} fill="#1c1006" opacity={0.4} filter="url(#e3-glow)"/>
      {/* frame */}
      <rect x={cx - fr} y={cy - fr} width={fr * 2} height={fr * 2} rx={40} fill="url(#f2-steel-d)" stroke="#2e3a44" strokeWidth={3.4}/>
      <rect x={cx - fr + 12} y={cy - fr + 12} width={fr * 2 - 24} height={fr * 2 - 24} rx={30} fill="none" stroke="#fff" strokeWidth={2} opacity={0.35}/>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([i, j], k) => <g key={k}><circle cx={cx + i * (fr - 24)} cy={cy + j * (fr - 24)} r={9} fill="url(#f2-steel)" stroke="#2e3a44" strokeWidth={2}/><circle cx={cx + i * (fr - 24) - 2} cy={cy + j * (fr - 24) - 2} r={2.6} fill="#fff" opacity={0.8}/></g>)}
      {[-0.5, 0.5].map((k, i) => <g key={i}><rect x={cx - fr - 10} y={cy + k * r - 22} width={34} height={44} rx={8} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/><circle cx={cx - fr + 6} cy={cy + k * r} r={5} fill="#6c4a16"/></g>)}
      {/* the hole and what is inside it */}
      <circle cx={cx} cy={cy} r={r + 12} fill="#2a3640" stroke="#1a232b" strokeWidth={3}/>
      <circle cx={cx} cy={cy} r={r + 6} fill={`url(#${id}-in)`}/>
      <g clipPath={`url(#${id}-hole)`}>{kids}</g>
      <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#000" strokeWidth={10} opacity={0.18}/>
      {/* the door, swung about its left hinge */}
      <g transform={`translate(${hx} 0) scale(${Math.max(0.05, sx)} 1) translate(${-hx} 0)`}>
        <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-door)`} stroke="#2e3a44" strokeWidth={4}/>
        <circle cx={cx} cy={cy} r={r * 0.93} fill="none" stroke="#fff" strokeWidth={3} opacity={0.5}/>
        <circle cx={cx} cy={cy} r={r * 0.86} fill="none" stroke="#5a6a76" strokeWidth={4}/>
        {Array.from({length: 16}, (_, i) => { const p = P((i * 360) / 16, r * 0.915); return <g key={i}><circle cx={p[0]} cy={p[1]} r={r * 0.026} fill="url(#f2-steel)" stroke="#3d4a54" strokeWidth={1.4}/><circle cx={p[0] - 1.4} cy={p[1] - 1.4} r={r * 0.008} fill="#fff"/></g>; })}
        <circle cx={cx} cy={cy} r={r * 0.78} fill="none" stroke="#8a9ba6" strokeWidth={2} opacity={0.7}/>
        {Array.from({length: 12}, (_, i) => { const p1 = P(i * 30, r * 0.78), p2 = P(i * 30, r * 0.62); return <path key={i} d={`M${p1[0]},${p1[1]} L${p2[0]},${p2[1]}`} stroke="#8a9ba6" strokeWidth={i % 3 === 0 ? 7 : 4} strokeLinecap="round" opacity={0.55}/>; })}
        {dial && <g>
          <circle cx={cx} cy={cy} r={rd * 1.28} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3.4}/>
          <circle cx={cx} cy={cy} r={rd * 1.14} fill="#2a1f12" stroke="#6c4a16" strokeWidth={2}/>
          <circle cx={cx} cy={cy} r={rd * 1.02} fill="#fbf3dc" stroke="#8e6522" strokeWidth={2.6}/>
          <path d={`M${a0[0]},${a0[1]} A${rd * 0.86},${rd * 0.86} 0 ${arcEnd + 135 > 180 ? 1 : 0} 1 ${a1[0]},${a1[1]}`} fill="none" stroke="#e2a43a" strokeWidth={rd * 0.2} strokeLinecap="butt"/>
          <path d={`M${a1[0]},${a1[1]} A${rd * 0.86},${rd * 0.86} 0 ${135 - arcEnd > 180 ? 1 : 0} 1 ${b1[0]},${b1[1]}`} fill="none" stroke="#5aa4d6" strokeWidth={rd * 0.2} strokeLinecap="butt" opacity={0.85}/>
          {Array.from({length: 28}, (_, i) => { const d = -135 + (270 * i) / 27, p1 = P(d, rd * 0.98), p2 = P(d, rd * (i % 3 === 0 ? 0.62 : 0.74)); return <path key={i} d={`M${p1[0]},${p1[1]} L${p2[0]},${p2[1]}`} stroke="#4a2f0a" strokeWidth={i % 3 === 0 ? 3 : 1.8} opacity={0.8}/>; })}
          <g transform={`rotate(${dialAng} ${cx} ${cy})`}>
            <path d={`M${cx - 9},${cy + rd * 0.14} L${cx},${cy - rd * 0.96} L${cx + 9},${cy + rd * 0.14} Z`} fill="#b32d24" stroke="#5a140e" strokeWidth={2} strokeLinejoin="round"/>
            <circle cx={cx} cy={cy} r={rd * 0.2} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
          </g>
          <circle cx={cx - rd * 0.04} cy={cy - rd * 0.05} r={rd * 0.06} fill="#fff6cf" opacity={0.85}/>
          <path d={`M${cx - rd * 0.9},${cy - rd * 0.4} A${rd},${rd} 0 0 1 ${cx - rd * 0.1},${cy - rd * 0.95}`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.45}/>
        </g>}
        {plate}
        {/* the lever handle */}
        <g transform={`translate(${cx + r * 0.62} ${cy})`}>
          <rect x={-10} y={-r * 0.22} width={20} height={r * 0.44} rx={10} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
          <circle cx={0} cy={-r * 0.22} r={13} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/><circle cx={0} cy={r * 0.22} r={13} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
        </g>
        <path d={`M${cx - r * 0.78},${cy - r * 0.4} A${r * 0.88},${r * 0.88} 0 0 1 ${cx - r * 0.1},${cy - r * 0.86}`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.38}/>
      </g>
      {open > 0.02 && <rect x={hx - 4} y={cy - r} width={Math.max(4, 14 * (1 - sx) + 6)} height={2 * r} rx={5} fill="url(#f2-steel-d)" stroke="#2e3a44" strokeWidth={2} opacity={clamp(open * 3)} transform={`translate(${2 * r * sx - 0} 0)`}/>}
    </g>
  );
};

// ---- vault-crr (b06) -------------------------------------------------------------------------------------------------------------
const CASE = {x: 820, top: 290, base: 700, w: 150};
export const VaultCrrArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), rr = v("e16_rounds", "rr") / 100;
  const tSh = L.sh.at, tCr = L.cr.at, tNd = L.nd.at, tBk = L.bk.at, tLg = L.lg.at;
  const shade = sm(f, tSh, 40), dialK = sm(f, tCr, 60), brace = sm(f, tNd, 30);
  const arcOn = ez(f, tCr, 24);
  const dialAng = lerp(-135, -135 + 270 * rr, dialK) + Math.sin(f / 5) * 0.6 * pulse(f, tCr + 40, 120);
  const bh = CASE.base - CASE.top, rh = bh * rr * shade;
  const bx0 = CASE.x - CASE.w / 2, arrow = sm(f, tBk, 34), rbiA = ez(f, tBk, 26), sign = pop(f, tLg, 24);
  const coin = sm(f, tBk + 10, 50);
  return (
    <g>
      <Defs/>
      <OfficeBG f={f} deskY={720} id="vc" cool panel="#9aa9b8"/>
      <Spot id="vc-sp" cx={600} cy={430} rx={760} ry={380} c="#fff2cc" a={0.35}/>
      <VaultDoor id="vc" cx={350} cy={470} r={200} f={f} dialAng={dialAng} arc={rr * arcOn} lit={pulse(f, tCr, 90)}/>
      {/* the glass case with the deposit bar */}
      <g>
        <Shade x={CASE.x} y={CASE.base + 22} rx={170} ry={16} o={0.4}/>
        <rect x={CASE.x - 130} y={CASE.base + 4} width={260} height={30} rx={8} fill="url(#f2-steel-d)" stroke="#2e3a44" strokeWidth={2.6}/>
        <rect x={CASE.x - 118} y={CASE.top - 40} width={236} height={CASE.base - CASE.top + 52} rx={18} fill="#cfe3ee" opacity={0.28} stroke="#6f8fa2" strokeWidth={5}/>
        <defs>
          <linearGradient id="vc-bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd0f4"/><stop offset="1" stopColor="#2a74b0"/></linearGradient>
          <linearGradient id="vc-gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0.7"/><stop offset="0.25" stopColor="#fff" stopOpacity="0.05"/><stop offset="0.8" stopColor="#fff" stopOpacity="0.06"/><stop offset="1" stopColor="#fff" stopOpacity="0.45"/></linearGradient>
          <pattern id="vc-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="#f0c04e"/><rect width="5" height="14" fill="#c8921f"/></pattern>
        </defs>
        {/* the deposit bar: the whole bar is deposits; the bottom share is the reserve */}
        <rect x={bx0} y={CASE.top} width={CASE.w} height={bh} rx={10} fill="url(#vc-bar)" stroke="#164a78" strokeWidth={3}/>
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M${bx0 + 6},${CASE.top + (bh * (i + 1)) / 8} H${bx0 + CASE.w - 6}`} stroke="#fff" strokeWidth={1.6} opacity={0.2}/>)}
        <rect x={bx0 + 10} y={CASE.top + 12} width={16} height={bh - 24} rx={8} fill="#fff" opacity={0.25}/>
        {rh > 1 && <g>
          <rect x={bx0} y={CASE.base - rh} width={CASE.w} height={rh} rx={6} fill="url(#vc-hatch)" stroke="#7a4f0e" strokeWidth={3}/>
          <rect x={bx0} y={CASE.base - rh} width={CASE.w} height={10} fill="#fff" opacity={0.28}/>
          {rh > 40 && <text x={CASE.x} y={CASE.base - rh / 2 + 9} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={26} letterSpacing={3} fill="#4a2f06" stroke="#fff3bd" strokeWidth={4} paintOrder="stroke">RESERVE</text>}
        </g>}
        <rect x={CASE.x - 118} y={CASE.top - 40} width={236} height={CASE.base - CASE.top + 52} rx={18} fill="url(#vc-gl)"/>
        <path d={`M${CASE.x - 96},${CASE.top - 16} L${CASE.x - 60},${CASE.top - 16} L${CASE.x - 110},${CASE.base - 30} L${CASE.x - 112},${CASE.base - 80} Z`} fill="#fff" opacity={0.18}/>
        <rect x={CASE.x - 130} y={CASE.top - 54} width={260} height={22} rx={8} fill="url(#f2-steel-d)" stroke="#2e3a44" strokeWidth={2.6}/>
        <Brace x={bx0 - 30} y0={CASE.top + 4} y1={CASE.base - 4} dir={-1} c="#5a3418" w={6} p={brace} amp={26}/>
      </g>
      {/* the RBI and the balance kept with it */}
      <g opacity={rbiA} transform={`translate(0 ${(1 - rbiA) * 24})`}><Classical x={1400} y={724} w={420} h={340} text="RESERVE BANK" id="vc-rbi" cols={6} glow={0.3 * rbiA} stone={["#e2c892", "#a98a52"]}/></g>
      <FlowArrow pts={[[CASE.x + CASE.w / 2 + 6, CASE.base - 30], [1010, CASE.base - 78], [1150, CASE.base - 82], [1270, CASE.base - 70]]} f={f} p={arrow} w={26} c1="#f0b44a" c2="#ffe08a" dark="#7a4f0e"/>
      {coin > 0.02 && coin < 0.98 && <g transform={`translate(${lerp(CASE.x + 100, 1230, coin)} ${CASE.base - 70 - Math.sin(Math.PI * coin) * 52})`}><CoinStack id="vc-c" x={0} y={0} h={22} d={52} a={Math.min(1, coin * 8, (1 - coin) * 8)}/></g>}
      {/* the hand-stop sign */}
      <g transform={`translate(0 ${(1 - sign) * -60})`}><StopSign x={1724} y={470} r={82} a={clamp(sign * 2)} k={0.6 + 0.4 * sign} pole={720 - 470 - 82 * 0.8 - 8}/></g>
    </g>
  );
};

export const VaultCrrLabels: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  return <>
    <ECard cx={960} y={60} text={L.cr.text} f={f} at={L.cr.at} size={40} maxW={1100}/>
    <ECard cx={800} y={172} text={L.nd.text} f={f} at={L.nd.at} size={26} maxW={560} upper={false} tone="cool"/>
    <ECard cx={800} y={786} text={L.sh.text} f={f} at={L.sh.at} size={28} maxW={520} upper={false}/>
    <ECard cx={1400} y={252} text={L.bk.text} f={f} at={L.bk.at} size={30} maxW={560} upper={false}/>
    <ECard cx={1500} y={796} text={L.lg.text} f={f} at={L.lg.at} size={28} maxW={620} upper={false} tone="red"/>
  </>;
};

// ---- crr-timeline: default and slr -----------------------------------------------------------------------------------------------
const X0 = 150, XA = 330, XB = 392, XC = 760, XD = 1010, XE = 1640, AXY = 790;

export const CrrTimelineArt: React.FC<AP> = (p) => (p.spec as any).mode === "slr" ? <SlrArt {...p}/> : <CrrArt {...p}/>;
export const CrrTimelineLabels: React.FC<AP> = (p) => (p.spec as any).mode === "slr" ? <SlrLabels {...p}/> : <CrrLabels {...p}/>;

const CrrArt: React.FC<AP> = (p) => {
  const {f, dur} = p, L = elabs(p);
  const c45 = v("e16_crr", "c45"), c4 = v("e16_crr", "c4"), c3 = v("e16_crr", "c3");
  const steps = ["c375", "c35", "c325", "c3"].map((k) => v("e16_crr", k));
  const span = c45 - c3, vmin = c3 - span * 0.5, vmax = c45 + span * 0.5;
  const ang = (x: number) => -135 + (270 * (x - vmin)) / (vmax - vmin);
  const yv = (x: number) => 744 - ((x - vmin) / (vmax - vmin)) * 200;
  // the dial follows the narration's order whatever the estimated timing says: each move waits for the one before it
  const T45 = L.c45.at, T4 = Math.max(L.c4.at, T45 + 40), TC = Math.max(L.cuts.at, T4 + 40), tC3 = L.c3.at;
  const gap = clamp((dur - TC - 50) / 4, 16, 52);
  const moves = [{t: T45, to: c45, d: 36}, {t: T4, to: c4, d: 36}, ...steps.map((s, k) => ({t: TC + k * gap, to: s, d: 14}))];
  let val = vmin, prev = vmin, shake = 0;
  for (const m of moves) { if (f < m.t) break; val = lerp(prev, m.to, sm(f, m.t, m.d)); prev = m.to; if (m.d < 20) shake = Math.exp(-(f - m.t) / 7) * Math.sin((f - m.t) * 1.9) * 2.4; }
  const started = f >= T45;
  const read = started ? `${Math.max(c3, val).toFixed(2)}%` : undefined;
  const sx = (k: number) => XC + ((k + 1) * (XD - XC)) / 5;
  const piece = (d: string, a: number, dd: number) => <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez(f, a, dd)} fill="none" stroke="#1f6ea8" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"/>;
  const pieceUnder = (d: string, a: number, dd: number) => <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez(f, a, dd)} fill="none" stroke="#0e3552" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" opacity={0.35}/>;
  let cutD = `M${XC},${yv(c4)}`;
  steps.forEach((s, k) => { cutD += ` H${sx(k)} V${yv(s)}`; });
  cutD += ` H${XD}`;
  const dateTicks = [XA, XB, XC, sx(0), sx(1), sx(2), sx(3), XD];
  const tickAt = [T45, T4, TC, TC, TC + gap, TC + 2 * gap, TC + 3 * gap, TC + 3 * gap + 10];
  const flag = pop(f, tC3, 26), plate = ez(f, tC3, 20);
  const fx = XE, fy = AXY - 210;
  return (
    <g>
      <Defs/>
      <OfficeBG f={f} deskY={0} id="ct"/>
      <Spot id="ct-sp" cx={960} cy={330} rx={800} ry={330} c="#fff2cc" a={0.35}/>
      {/* the CRR dial on a bracket */}
      <g>
        <path d="M960,466 V512" stroke="#6c4a16" strokeWidth={16}/>
        <path d="M956,466 V512" stroke="#f6dc94" strokeWidth={4} opacity={0.7}/>
        <Dial id="ct-d" cx={960} cy={300} r={170} ang={ang(Math.max(vmin, val)) + shake} ticks={30} read={read} lit={0.4 * pulse(f, T45, 60) + 0.5 * pulse(f, T4, 60)}
          marks={flag > 0.05 ? [{ang: ang(c3), c: "#2f9a4a"}] : []}/>
        <Plate x={960} y={489} w={120} text="CRR" size={22} a={1}/>
      </g>
      {/* the timeline: a stepped line that follows the dial */}
      <g>
        <rect x={X0 - 40} y={512} width={XE - X0 + 220} height={326} rx={24} fill="#fffaf0" opacity={0.55} stroke="#c9ad7a" strokeWidth={2}/>
        {Array.from({length: 4}, (_, i) => <path key={i} d={`M${X0 - 20},${yv(vmin + ((i + 1) * (vmax - vmin)) / 5)} H${XE + 160}`} stroke="#a98a52" strokeWidth={1.4} strokeDasharray="4 9" opacity={0.5}/>)}
        <path d={`M${X0 - 20},${AXY} H${XE + 170}`} stroke="#5a3418" strokeWidth={6} strokeLinecap="round"/>
        <path d={`M${XE + 168},${AXY - 14} L${XE + 192},${AXY} L${XE + 168},${AXY + 14} Z`} fill="#5a3418"/>
        {dateTicks.map((x, i) => <path key={i} d={`M${x},${AXY - 12} V${AXY + 12}`} stroke="#5a3418" strokeWidth={5} opacity={ez(f, tickAt[i], 12)} strokeLinecap="round"/>)}
        {pieceUnder(`M${X0},${yv(c45)} H${XA}`, T45, 30)}{piece(`M${X0},${yv(c45)} H${XA}`, T45, 30)}
        {pieceUnder(`M${XA},${yv(c45)} L${XB},${yv(c4)}`, T4 - 6, 24)}{piece(`M${XA},${yv(c45)} L${XB},${yv(c4)}`, T4 - 6, 24)}
        {pieceUnder(`M${XB},${yv(c4)} H${XC}`, T4 + 6, 36)}{piece(`M${XB},${yv(c4)} H${XC}`, T4 + 6, 36)}
        {pieceUnder(cutD, TC, 4 * gap + 12)}{piece(cutD, TC, 4 * gap + 12)}
        {pieceUnder(`M${XD},${yv(c3)} H${XE}`, tC3, 40)}{piece(`M${XD},${yv(c3)} H${XE}`, tC3, 40)}
        {[[XA + (XB - XA) / 2, "DEC 2024", T45], [XC, "SEP 2025", TC], [XD, "NOV 2025", TC + 3 * gap + 10], [XE, "NOV 2026", tC3]].map(([x, t, at], i) => (
          <text key={i} x={x as number} y={AXY + 44} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={24} letterSpacing={2} fill="#5a3418" opacity={ez(f, at as number, 14)}>{t as string}</text>
        ))}
        {/* the date flag at the right-hand end */}
        <g opacity={clamp(flag * 3)} transform={`translate(0 ${(1 - flag) * -40})`}>
          <path d={`M${fx},${AXY} V${fy}`} stroke="#5a3418" strokeWidth={6} strokeLinecap="round"/>
          <path d={`M${fx + 3},${fy + 6} q60,-18 120,0 q-14,28 0,56 q-60,-18 -120,0 Z`} fill="#2f9a4a" stroke="#14502a" strokeWidth={3} strokeLinejoin="round"/>
          <path d={`M${fx + 10},${fy + 14} q50,-12 100,0`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.45} strokeLinecap="round"/>
          <circle cx={fx} cy={fy} r={9} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={2.4}/>
          <circle cx={fx} cy={yv(c3)} r={12} fill="#2f9a4a" stroke="#fff" strokeWidth={4}/>
        </g>
      </g>
      <Specks f={f} n={10} seed={3} y0={480} y1={740}/>
    </g>
  );
};

const CrrLabels: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  return <>
    <ECard cx={96} y={76} text={L.n5.text} f={f} at={L.n5.at} size={30} maxW={760} upper={false} left tone="cool"/>
    <ECard cx={330} y={340} text={L.c45.text} f={f} at={L.c45.at} size={28} maxW={560} upper={false}/>
    <ECard cx={640} y={420} text={L.c4.text} f={f} at={L.c4.at} size={28} maxW={460} upper={false}/>
    <ECard cx={1390} y={380} text={L.cuts.text} f={f} at={L.cuts.at} size={28} maxW={640} upper={false} tone="cool"/>
    <ECard cx={1560} y={150} text={L.c3.text} f={f} at={L.c3.at} size={36} maxW={520} upper={false} tone="green"/>
  </>;
};

// ---- SLR: a second vault, open, with cash, gold bars and bond folders ----------------------------------------------------------------
const Shelf: React.FC<{x0: number; x1: number; y: number}> = ({x0, x1, y}) => (
  <g><rect x={x0} y={y} width={x1 - x0} height={14} fill="url(#f2-board)" stroke="#2a180a" strokeWidth={2}/><rect x={x0} y={y} width={x1 - x0} height={4} fill="#d9a766" opacity={0.7}/></g>
);
const GoldBar: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 74}) => {
  const h = w * 0.36;
  return (
    <g>
      <path d={`M${x - w * 0.5},${y} L${x - w * 0.38},${y - h} L${x + w * 0.38},${y - h} L${x + w * 0.5},${y} Z`} fill="url(#e2-gold)" stroke="#7a4f0e" strokeWidth={2} strokeLinejoin="round"/>
      <path d={`M${x - w * 0.34},${y - h + 5} H${x + w * 0.34}`} stroke="#fff6cf" strokeWidth={3} opacity={0.75} strokeLinecap="round"/>
      <path d={`M${x - w * 0.2},${y - h * 0.5} H${x + w * 0.2}`} stroke="#9a6a14" strokeWidth={2} opacity={0.6}/>
    </g>
  );
};
const Folder: React.FC<{x: number; y: number; w?: number; h?: number; c?: string}> = ({x, y, w = 62, h = 96, c = "#2b4d72"}) => (
  <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx={4} fill={c} stroke="#14283f" strokeWidth={2}/>
    <rect x={x - w / 2 + 6} y={y - h + 12} width={w - 12} height={h * 0.42} rx={2} fill="#efe0bb" opacity={0.95}/>
    <path d={`M${x - w / 2 + 12},${y - h + 24} H${x + w / 2 - 12} M${x - w / 2 + 12},${y - h + 34} H${x + w / 2 - 22}`} stroke={c} strokeWidth={2.2} opacity={0.7}/>
    <circle cx={x + w * 0.16} cy={y - h * 0.34} r={9} fill="#c9382f" stroke="#8c1f1a" strokeWidth={2}/><path d={`M${x + w * 0.1},${y - h * 0.34 + 7} l-3,16 l9,-5 l4,6 l1,-16 Z`} fill="#b42f2a"/>
  </g>
);

const SlrArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const slr = v("e16_crr", "slr") / 100;
  const tLa = L.la.at, tMn = L.mn.at, tSl = L.sl.at;
  const open = sm(f, 6, 46);
  const cash = pop(f, tLa + 6), gold = pop(f, tLa + 30), docs = pop(f, tLa + 56);
  const bar = {x: 1290, top: 250, base: 700, w: 150}, bh = bar.base - bar.top, fill = slr * sm(f, tMn, 44);
  const ent = ez(f, tSl, 24);
  const CX = 560, CY = 470, R = 230;
  const kids = (
    <g>
      <rect x={CX - R} y={CY - R} width={2 * R} height={2 * R} fill="#4a3014"/>
      <ellipse cx={CX} cy={CY} rx={R} ry={R} fill="url(#ak-sunglow)" opacity={0.28}/>
      {/* three shelves: folders, gold, cash */}
      <Shelf x0={CX - R} x1={CX + R} y={CY - 112}/>
      <Shelf x0={CX - R} x1={CX + R} y={CY + 22}/>
      <Shelf x0={CX - R} x1={CX + R} y={CY + 150}/>
      <g opacity={clamp(docs * 2)} transform={`translate(0 ${(1 - docs) * -26})`}>{[-150, -80, -10, 60, 130].map((dx, i) => <Folder key={i} x={CX + dx} y={CY - 112} c={["#2b4d72", "#5a3a72", "#2b6a52", "#2b4d72", "#6a3a2a"][i]} h={86 + (i % 2) * 10}/>)}</g>
      <g opacity={clamp(gold * 2)} transform={`translate(0 ${(1 - gold) * -26})`}>
        {[-150, -76, -2, 72].map((dx, i) => <g key={i}><GoldBar x={CX + dx + 40} y={CY + 22}/><GoldBar x={CX + dx + 20} y={CY + 22 - 27 - 0}/></g>)}
        {[-110, -36, 38].map((dx, i) => <GoldBar key={`t${i}`} x={CX + dx + 40} y={CY + 22 - 54} w={74}/>)}
      </g>
      <g opacity={clamp(cash * 2)} transform={`translate(0 ${(1 - cash) * -26})`}>{[-160, -80, 0, 80, 160].map((dx, i) => <NoteStack key={i} id={`slr-n${i}`} x={CX + dx} y={CY + 150} h={54 + (i % 3) * 10} w={70} tone={i % 2 ? "violet" : "teal"}/>)}</g>
    </g>
  );
  return (
    <g>
      <Defs/>
      <OfficeBG f={f} deskY={760} id="sl" cool panel="#9aa9b8"/>
      <Spot id="sl-sp" cx={560} cy={440} rx={640} ry={380} c="#fff2cc" a={0.35}/>
      <VaultDoor id="sl" cx={CX} cy={CY} r={R} open={open} f={f} dial={false} kids={kids}
        plate={<g opacity={ent}><rect x={CX - 70} y={CY - 58} width={140} height={116} rx={16} fill="url(#e2-brass)" stroke="#6c4a16" strokeWidth={3}/><text x={CX} y={CY + 22} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={66} letterSpacing={4} fill="#4a2f0a">SLR</text></g>}/>
      {/* the deposit bar with the minimum share marked */}
      <g>
        <Shade x={bar.x} y={bar.base + 20} rx={150} ry={14} o={0.36}/>
        <rect x={bar.x - 110} y={bar.base + 4} width={220} height={28} rx={8} fill="url(#f2-steel-d)" stroke="#2e3a44" strokeWidth={2.6}/>
        <defs><linearGradient id="sl-bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd0f4"/><stop offset="1" stopColor="#2a74b0"/></linearGradient>
          <linearGradient id="sl-liq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9be0b2"/><stop offset="1" stopColor="#2f8e58"/></linearGradient></defs>
        <rect x={bar.x - bar.w / 2} y={bar.top} width={bar.w} height={bh} rx={10} fill="url(#sl-bar)" stroke="#164a78" strokeWidth={3} opacity={0.9}/>
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M${bar.x - bar.w / 2 + 6},${bar.top + (bh * (i + 1)) / 8} H${bar.x + bar.w / 2 - 6}`} stroke="#fff" strokeWidth={1.6} opacity={0.2}/>)}
        <rect x={bar.x - bar.w / 2 + 10} y={bar.top + 12} width={16} height={bh - 24} rx={8} fill="#fff" opacity={0.25}/>
        {fill > 0.003 && <g><rect x={bar.x - bar.w / 2} y={bar.base - bh * fill} width={bar.w} height={bh * fill} rx={6} fill="url(#sl-liq)" stroke="#1a5a37" strokeWidth={3}/><rect x={bar.x - bar.w / 2} y={bar.base - bh * fill} width={bar.w} height={9} fill="#fff" opacity={0.3}/>
          <path d={`M${bar.x - bar.w / 2 - 30},${bar.base - bh * fill} H${bar.x + bar.w / 2 + 30}`} stroke="#c63f2f" strokeWidth={5} strokeDasharray="14 8" strokeLinecap="round"/></g>}
        <Brace x={bar.x + bar.w / 2 + 40} y0={bar.top + 4} y1={bar.base - 4} dir={1} c="#5a3418" w={6} p={sm(f, tMn, 30)} amp={24}/>
        <rect x={bar.x - bar.w / 2 - 6} y={bar.top - 26} width={bar.w + 12} height={20} rx={8} fill="url(#f2-steel-d)" stroke="#2e3a44" strokeWidth={2.4}/>
      </g>
    </g>
  );
};

const SlrLabels: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  return <>
    <ECard cx={960} y={66} text={L.sl.text} f={f} at={L.sl.at} size={44} maxW={1100}/>
    <ECard cx={560} y={798} text={L.la.text} f={f} at={L.la.at} size={28} maxW={780} upper={false}/>
    <ECard cx={1400} y={798} text={L.mn.text} f={f} at={L.mn.at} size={28} maxW={560} upper={false} tone="green"/>
  </>;
};

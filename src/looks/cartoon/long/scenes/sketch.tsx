// Scene kind "sketch" (UPSC monsoon film): two hand-drawn lines on a sheet of paper, one rising, one falling, NO axis numbers.
// Spec: {chip, lines: [{label, dir: "up"|"down", key}], caption}. Each line is drawn on from at(key) with a boiling wobble; its label
// pops in with it. The caption sits under the sheet. Something always moves: the wobble, a pencil at the tip, drifting paper dots.
import React from "react";
import {C} from "../../palette";
import {SANS, ease, easeIO} from "../../ui";
import type {SceneProps} from "../contract";
import {Chip, INK, Pill, SW, smooth, wob, type Pt} from "./analogy_kit";

export type SketchSpec = {chip?: string; lines: {label: string; dir: "up" | "down"; key: string}[]; caption?: string; camera?: unknown; notes?: string};

const X0 = 360, X1 = 1560, YLO = 650, YHI = 270;
// the jagged shape of a year-to-year record: fixed offsets, so the line always has the same character
const JIT = [0, -26, 18, -34, 22, -12, 30, -22, 8, -30, 14, 0];
const base = (dir: "up" | "down", i: number): Pt => {
  const u = i / (JIT.length - 1), y = dir === "up" ? YLO + (YHI - YLO) * u : YHI + (YLO - YHI) * u;
  return [X0 + (X1 - X0) * u, y + JIT[(dir === "up" ? i : JIT.length - 1 - i) % JIT.length] * (dir === "up" ? 1 : -1) * 0.8];
};

export const Scene: React.FC<SceneProps<SketchSpec>> = ({f, dur, spec, at}) => {
  if (!spec || !Array.isArray(spec.lines) || spec.lines.length < 1) throw new Error("sketch: spec.lines must list the lines to draw");
  const push = 1 + 0.025 * (f / Math.max(1, dur));
  const lines = spec.lines.map((ln, k) => {
    const t0 = at(ln.key), prog = easeIO(f, t0, t0 + 46), col = ln.dir === "up" ? C.red : C.blue;
    const pts: Pt[] = Array.from({length: JIT.length}, (_, i) => { const b = base(ln.dir, i); return [b[0] + wob(`sk${k}x${i}`, f, 2.6), b[1] + wob(`sk${k}y${i}`, f, 3.2)] as Pt; });
    return {ln, t0, prog, col, pts, d: smooth(pts)};
  });
  return <div style={{position: "absolute", inset: 0, background: "#EDE4CC", overflow: "hidden"}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
      <g transform={`translate(960 480) scale(${push}) translate(-960 -480)`}>
        {/* the sheet */}
        <g transform="rotate(-0.6 960 480)">
          <rect x={186} y={190} width={1548} height={620} rx={26} fill={INK}/>
          <rect x={170} y={170} width={1548} height={620} rx={26} fill="#FFFDF4" stroke={INK} strokeWidth={SW}/>
          {Array.from({length: 7}, (_, i) => <line key={i} x1={200} x2={1688} y1={250 + i * 84} y2={250 + i * 84} stroke="#D7E4F2" strokeWidth={4}/>)}
          {/* axes, no ticks and no numbers */}
          <path d={`M 300 ${YLO + 70} L 300 230`} stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none"/>
          <path d={`M 300 ${YLO + 70} L 1630 ${YLO + 70}`} stroke={INK} strokeWidth={9} strokeLinecap="round" fill="none"/>
          <path d="M 276 262 L 300 226 L 324 262" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"/>
          <path d={`M 1594 ${YLO + 46} L 1632 ${YLO + 70} L 1594 ${YLO + 94}`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"/>
          {lines.map(({ln, prog, col, d, pts}, k) => prog > 0.001 && <g key={k}>
            <path d={d} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${prog} 2`}/>
            <path d={d} fill="none" stroke={col} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${prog} 2`}/>
            {prog < 0.999 && (() => { const p = pts[Math.min(pts.length - 1, Math.floor(prog * (pts.length - 1)))]; return <g transform={`translate(${p[0]} ${p[1]}) rotate(40)`}>
              <path d="M 0 0 L 14 -34 L 44 -22 Z" fill={C.yellow} stroke={INK} strokeWidth={5} strokeLinejoin="round"/>
              <path d="M 14 -34 L 44 -22 L 150 -200 L 120 -214 Z" fill={C.orange} stroke={INK} strokeWidth={5} strokeLinejoin="round"/></g>; })()}
          </g>)}
          {lines.map(({ln, t0, pts}, k) => <Pill key={k} text={ln.label} f={f} at={t0 + 36} cx={ln.dir === "up" ? 900 : 660} cy={ln.dir === "up" ? 652 : 232} size={42} maxW={600} color={ln.dir === "up" ? C.redDark : C.blueDark}/>)}
        </g>
      </g>
      {spec.chip ? <Chip text={spec.chip} f={f}/> : null}
      {spec.caption ? <text x={960} y={890} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={40} fill={INK} opacity={ease(f, 8, 26)}>{spec.caption}</text> : null}
    </svg>
  </div>;
};

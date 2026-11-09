// Look B scene kind "sketch": two hand-drawn lines on a ruled sheet, one rising and one falling, with NO axis numbers at all.
// Spec: {chip, lines: [{label, dir: "up"|"down", key}], caption}. Each line is drawn on from at(key) with a gently boiling wobble, a pencil
// rides its tip, and its label and doodle (a sun, a rain cloud) arrive with it. The caption sits under the sheet.
import React from "react";
import {AbsoluteFill} from "remotion";
import {getLength, getPointAtLength} from "@remotion/paths";
import type {SceneProps} from "../../cartoon/long/contract";
import {Pill, PaperFinish, SERIF, clamp, eio, eo, prog} from "../kit";
import {Tag, pathOf, smooth, tagBox, GDefs} from "./globe_b";

export type SketchSpec = {chip?: string; lines: {label: string; dir: "up" | "down"; key: string}[]; caption?: string; camera?: unknown; notes?: string};

const X0 = 400, X1 = 1600, YLO = 660, YHI = 310;
const JIT = [0, -26, 18, -34, 22, -12, 30, -22, 8, -30, 14, 0];
const hash = (s: string) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; };
const wob = (seed: string, f: number, amp: number) => { const h = hash(seed); return amp * (Math.sin(f * 0.2 + h) + 0.5 * Math.sin(f * 0.127 + h * 1.7)) / 1.5; };
const base = (dir: "up" | "down", i: number): [number, number] => {
  const u = i / (JIT.length - 1), y = dir === "up" ? YLO + (YHI - YLO) * u : YHI + (YLO - YHI) * u;
  return [X0 + (X1 - X0) * u, y + JIT[(dir === "up" ? i : JIT.length - 1 - i) % JIT.length] * (dir === "up" ? 1 : -1) * 0.8];
};
const COL = {up: ["#e0502c", "#a82a12"], down: ["#3a88d0", "#1c4f8e"]} as const;

const Pencil: React.FC<{x: number; y: number; a: number}> = ({x, y, a}) => (
  <g transform={`translate(${x} ${y}) rotate(38)`} opacity={a}>
    <path d="M10 6 L190 -70 L196 -56 L20 14 Z" fill="#2a1a0c" opacity="0.16" transform="translate(6 10)"/>
    <g transform="rotate(-90)">
      <path d="M0 0 L16 -9 L16 9 Z" fill="#e9c999" stroke="#b98d52" strokeWidth="1" strokeLinejoin="round"/>
      <path d="M0 0 L5 -3 L5 3 Z" fill="#3a3a3a"/>
      <rect x="16" y="-9" width="154" height="18" fill="#f2c443" stroke="#b8861b" strokeWidth="1"/>
      <rect x="16" y="-9" width="154" height="5" fill="#fbe08a" opacity="0.8"/>
      <rect x="16" y="4" width="154" height="5" fill="#c9941f" opacity="0.7"/>
      <rect x="170" y="-9.5" width="16" height="19" fill="#b9c0c8" stroke="#8b939c" strokeWidth="1"/>
      <rect x="186" y="-9" width="14" height="18" rx="4" fill="#e98a96" stroke="#b5606c" strokeWidth="1"/>
    </g>
  </g>
);
const SunDoodle: React.FC<{x: number; y: number; a: number; f: number}> = ({x, y, a, f}) => (
  <g transform={`translate(${x} ${y})`} opacity={a}>
    <g transform={`rotate(${f * 0.6})`}>{Array.from({length: 10}).map((_, i) => <path key={i} d={`M0,-38 q${i % 2 ? 4 : -4},-9 0,-20`} stroke="#e8a21c" strokeWidth="4" fill="none" strokeLinecap="round" transform={`rotate(${i * 36})`}/>)}</g>
    <circle r="26" fill="#ffd45e" stroke="#c9841a" strokeWidth="3"/><circle cx="-8" cy="-8" r="9" fill="#fff2b0" opacity="0.8"/>
  </g>
);
const CloudDoodle: React.FC<{x: number; y: number; a: number; f: number}> = ({x, y, a, f}) => (
  <g transform={`translate(${x} ${y})`} opacity={a}>
    {[0, 1, 2, 3].map((i) => { const ph = (f * 0.03 + i * 0.25) % 1; return <path key={i} d={`M${-34 + i * 24},${24 + ph * 34} l-6,14`} stroke="#3a88d0" strokeWidth="4" strokeLinecap="round" opacity={1 - ph}/>; })}
    <path d="M-50,16 Q-62,-6 -38,-8 Q-34,-34 -6,-26 Q18,-42 34,-18 Q62,-18 56,8 Q56,18 44,18 Z" fill="#eef4fb" stroke="#5d84ad" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M-40,8 Q-20,14 6,10" stroke="#a9bfd8" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </g>
);

export const Scene: React.FC<SceneProps<SketchSpec>> = ({f, dur, spec, at}) => {
  if (!spec || !Array.isArray(spec.lines) || spec.lines.length < 1) throw new Error("sketch: spec.lines must list the lines to draw");
  const push = 1 + 0.025 * clamp(f / Math.max(1, dur));
  const lines = spec.lines.map((ln, k) => {
    const t0 = at(ln.key), p = eio(prog(f, t0, 46));
    const pts = Array.from({length: JIT.length}, (_, i) => { const b = base(ln.dir, i); return [b[0] + wob(`sk${k}x${i}`, f, 2.2), b[1] + wob(`sk${k}y${i}`, f, 2.8)] as [number, number]; });
    const d = pathOf(smooth(pts, 8));
    return {ln, t0, p, d, len: getLength(d)};
  });
  const wrap: React.CSSProperties = {position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "960px 480px"};
  const tagFor = (l: typeof lines[number]) => l.ln.dir === "up" ? tagBox(l.ln.label, 1330, 250, "c", 32, 560) : tagBox(l.ln.label, 790, 250, "c", 32, 560);
  const axis = (a: string) => wob(a, f, 1.2);
  return (
    <AbsoluteFill style={{background: "#EFE6D2", overflow: "hidden"}}>
      <div style={wrap}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", inset: 0}}>
          <GDefs id="gb" f={f}/>
          <defs>
            <linearGradient id="sk-desk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3e9d1"/><stop offset="1" stopColor="#e2cfa6"/></linearGradient>
            <radialGradient id="sk-light" cx="0.25" cy="0.15" r="0.8"><stop offset="0" stopColor="#fff8e0" stopOpacity="0.9"/><stop offset="1" stopColor="#fff8e0" stopOpacity="0"/></radialGradient>
            <linearGradient id="sk-sheet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf5"/><stop offset="1" stopColor="#fbf3de"/></linearGradient>
            <filter id="sk-wash" filterUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><feGaussianBlur stdDeviation="3"/></filter>
          </defs>
          <rect width={1920} height={1080} fill="url(#sk-desk)"/>
          <rect width={1920} height={1080} fill="url(#sk-light)"/>
          {/* a second sheet underneath, the first with a long soft shadow */}
          <g transform="rotate(2.4 960 480)"><rect x={170} y={150} width={1590} height={680} rx={14} fill="#f1e6c8" stroke="#cdb888" strokeWidth="1.2"/></g>
          <g transform="rotate(-0.6 960 480)">
            <rect x={170} y={180} width={1580} height={680} rx={16} fill="#4a2e12" opacity="0.3" filter="url(#gb-b14)"/>
            <rect x={150} y={140} width={1580} height={680} rx={16} fill="url(#sk-sheet)" stroke="#d8c79c" strokeWidth="1.4"/>
            {Array.from({length: 8}).map((_, i) => <line key={i} x1={160} x2={1720} y1={228 + i * 70} y2={228 + i * 70} stroke="#bcd3e8" strokeWidth="1.6" opacity="0.8"/>)}
            <line x1={262} x2={262} y1={146} y2={814} stroke="#e79a9a" strokeWidth="2" opacity="0.7"/>
            {[250, 480, 710].map((y) => <g key={y}><circle cx={204} cy={y} r={14} fill="#c9b98f" opacity="0.5"/><circle cx={204} cy={y - 2} r={12} fill="#e8dcba"/></g>)}
            <g transform="rotate(-8 190 150)"><rect x={140} y={128} width={120} height={36} fill="#f3e29a" opacity="0.8" stroke="#d2bd6a" strokeWidth="1"/></g>
            <g transform="rotate(6 1690 150)"><rect x={1620} y={128} width={120} height={36} fill="#f3e29a" opacity="0.8" stroke="#d2bd6a" strokeWidth="1"/></g>
          </g>
          {/* axes: ink, hand drawn, no ticks and no numbers */}
          <g fill="none" stroke="#5e3a1c" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
            <path d={`M 340 ${YLO + 80 + axis("a1")} Q 338 ${480 + axis("a2")} 342 236`}/>
            <path d={`M 340 ${YLO + 80 + axis("a3")} Q 900 ${YLO + 84 + axis("a4")} 1660 ${YLO + 78 + axis("a5")}`}/>
            <path d="M 318 266 L 342 232 L 366 266"/>
            <path d={`M 1626 ${YLO + 54} L 1662 ${YLO + 78} L 1626 ${YLO + 102}`}/>
          </g>
          {lines.map((l, k) => l.ln.dir === "up"
            ? <SunDoodle key={k} x={1672} y={236} a={eo(prog(f, l.t0 + 20, 20))} f={f}/>
            : <CloudDoodle key={k} x={470} y={236} a={eo(prog(f, l.t0 + 20, 20))} f={f}/>)}
          {/* the lines: a wash, a core and a pencil highlight, drawn on */}
          {lines.map((l, k) => l.p > 0.001 && <g key={k} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d={l.d} stroke={COL[l.ln.dir][0]} strokeWidth={18} opacity="0.28" pathLength={1} strokeDasharray={`${l.p} 2`} filter="url(#sk-wash)"/>
            <path d={l.d} stroke={COL[l.ln.dir][0]} strokeWidth={9} pathLength={1} strokeDasharray={`${l.p} 2`}/>
            <path d={l.d} stroke={COL[l.ln.dir][1]} strokeWidth={3} opacity="0.75" pathLength={1} strokeDasharray={`${l.p} 2`} transform="translate(0.8 1.2)"/>
            <path d={l.d} stroke="#fff" strokeWidth={2} opacity="0.45" pathLength={1} strokeDasharray={`${l.p} 2`} transform="translate(-1 -2)"/>
          </g>)}
          {lines.map((l, k) => { if (l.p <= 0.001) return null; const pt = getPointAtLength(l.d, Math.min(l.len - 0.01, l.p * l.len)); return <Pencil key={k} x={pt.x} y={pt.y} a={1 - eo(prog(l.p, 0.94, 0.06))}/>; })}
        </svg>
        {lines.map((l, k) => <Tag key={k} box={tagFor(l)} f={f} t0={l.t0 + 14} dot={COL[l.ln.dir][0]}/>)}
        {spec.caption ? <div style={{position: "absolute", left: 96, width: 1728, top: 858, textAlign: "center", opacity: eo(prog(f, 8, 26)), fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 34, color: "#5e2b10", letterSpacing: "0.01em"}}>{spec.caption}</div> : null}
      </div>
      <PaperFinish id="skpf" grain={0.5} vignette={0.3}/>
      {spec.chip ? <Pill x={96} y={72} text={spec.chip} a={1}/> : null}
    </AbsoluteFill>
  );
};

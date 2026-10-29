// Scene kind "statement": a solid royal-blue card with big white text. Lines slide in one after another (or on the narrator's word),
// accent words turn yellow and get a hand-drawn circle / underline, figures print only from their reveal key, and an optional mascot
// (the uncle, or a plain bottle) peeks up from the bottom edge. Something always moves: idle bob, drifting doodles, blink, slow push-in.
import React from "react";
import {Bottle, Keeper} from "../../art";
import {C} from "../../palette";
import {ease, pop} from "../../ui";
import {SAFE, type SceneProps} from "../contract";
import {Doodles, Push, Row, fitBlock, parseLine, type AccentIn, type Cam, type LineIn, type RowStyle, type Unit} from "./statement_kit";

export type StatementSpec = {
  lines: LineIn[];                                  // a line is a string, or {text, key?, show?}: key = reveal key for its figure tokens, show = key it slides in on
  accent?: AccentIn[];                              // words (or a token's text) drawn in yellow with a hand-drawn mark; or write *stars* in the line
  mascot?: boolean | "uncle" | "bottle";            // peeks up from the bottom right; true = "uncle"
  align?: "left" | "center";                        // default "left"
  size?: number;                                    // largest font size to try (default 170)
  camera?: Cam; notes?: string;
};

const ST: RowStyle = {color: C.white, accent: C.yellow, mark: C.white};

export const Scene: React.FC<SceneProps<StatementSpec>> = ({f, dur, spec, at}) => {
  if (!spec || !Array.isArray(spec.lines) || !spec.lines.length) throw new Error("statement: spec.lines must be a non-empty array of strings");
  const mascot = spec.mascot === true || spec.mascot === "uncle" ? "uncle" : spec.mascot === "bottle" ? "bottle" : null;
  const accents = (spec.accent ?? []).map((a) => (typeof a === "string" ? {text: a} : a)), hits = new Set<string>();
  const lines = spec.lines.map((ln, i) => {
    const o = typeof ln === "string" ? {text: ln} : ln, units: Unit[] = parseLine(o.text, accents, hits, `statement line ${i + 1}`);
    const key = (o as {key?: string}).key, show = (o as {show?: string}).show;
    if (units.some((u) => u.tok) && !key) throw new Error(`statement line ${i + 1}: "${o.text}" prints a figure, so the line needs a reveal key: {text, key}`);
    return {units, revealAt: key ? at(key) : null, t0: show ? at(show) : 2 + i * 11};
  });
  accents.forEach((a) => { if (!hits.has(a.text)) throw new Error(`statement: accent "${a.text}" is not in any line`); });

  const width = mascot === "uncle" ? 1090 : mascot ? 1140 : SAFE.x1 - SAFE.x0 - 40, x0 = SAFE.x0 + 16, center = spec.align === "center";
  const {size, v} = fitBlock(lines.map((l) => l.units), width, 720, spec.size ?? 170, 76, 1.12, 14, true, "statement");
  const lh = size * 1.12, gap = 14, total = v.length * lh + (v.length - 1) * gap, top = 118 + (780 - total) / 2;

  const areas: [number, number, number, number][] = mascot ? [[1380, 130, 1860, 430]] : [];
  if (top > 215) areas.push([40, 70, mascot ? 1300 : 1700, Math.min(160, top - 60)]);
  if (top + total + 80 < 880) areas.push([40, top + total + 50, 900, 890]);
  const rise = mascot ? pop(f, 10, 130) : 0;
  const mx = 1560, bob = Math.sin(f / 14) * 3;

  return <div style={{position: "absolute", inset: 0, background: C.royal, overflow: "hidden"}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
      <Push f={f} dur={dur} cam={spec.camera} dflt={{fx: 1500, fy: 700, s0: 1, s1: 1.04}}>
        <Doodles f={f} seed="st" n={12} colors={[C.blue, C.royalDark]} area={areas}/>
        <rect x={-40} y={920} width={2000} height={200} fill={C.royalDark}/>
        <rect x={-40} y={920} width={2000} height={10} fill={C.white} opacity={0.4}/>
        {mascot === "uncle" && <g transform={`translate(0 ${(1 - rise) * 640})`}>
          <Keeper x={mx} y={1330 + bob} h={1000} f={f} pose="present" flip look={-1} mouth="smile"/></g>}
        {mascot === "bottle" && <g transform={`translate(0 ${(1 - rise) * 760}) rotate(${-10 + Math.sin(f / 18) * 3} ${mx} 1000)`}>
          <Bottle x={mx} y={1330} h={900} liquid={C.orange} label={C.white} trim={C.orange} cap={C.orange} expr="cheer" arms="cheer" f={f} seed={4} bob={4}/></g>}
      </Push>
    </svg>
    <div style={{position: "absolute", left: x0, top, width, display: "flex", flexDirection: "column", gap, alignItems: center ? "center" : "flex-start"}}>
      {v.map((row, i) => {
        const L = lines[row.src], t0 = L.t0, k = ease(f, t0, t0 + 10), settle = f > t0 + 14 ? Math.sin((f + row.src * 11) / 18) * 3 : 0;
        return <div key={i} style={{transform: `translate(${(1 - k) * -260}px, ${settle}px)`, opacity: ease(f, t0, t0 + 6), width: center ? "100%" : undefined}}>
          <Row row={row.chunks} size={size} f={f} t0={t0} revealAt={L.revealAt} st={ST} seed={40 + row.src * 5 + i} justify={center ? "center" : "flex-start"} shadow={`0 6px 0 ${C.royalDark}`}/>
        </div>;
      })}
    </div>
  </div>;
};

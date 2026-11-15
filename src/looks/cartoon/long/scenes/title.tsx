// Scene kind "title": the hook title card. The uncle fills the right of the frame on a sunburst, the headline lands in big type on white
// sticker plates (the pilot's hook style) with a chip above and one sub line below. The headline is on screen from the first frames; a slow
// push-in runs under it and the uncle talks. Figures in the headline or sub print from their reveal key only ({tfr/Bihar/nfhs6} etc.).
import React from "react";
import {Keeper} from "../../art";
import {C} from "../../palette";
import {ease, pop} from "../../ui";
import {SAFE, type SceneProps} from "../contract";
import {ICONS, Icon, type IconName} from "../icons";
import {Chip, Push, Row, fitBlock, layout, parseLine, visemeAt, type AccentIn, type Cam, type RowStyle, type Unit} from "./statement_kit";

export type TitleSpec = {
  title: string;                                    // the headline; "\\n" forces a line break (otherwise it breaks at sentences, then by width); *stars* or `accent` words turn red
  sub?: string;                                     // one line under the headline
  chip?: string;                                    // ink pill above the headline (e.g. "DATA KADAI · MAP DEEP DIVE")
  accent?: AccentIn[];
  key?: string;                                     // reveal key for figure tokens in title / sub (required when they hold any)
  mouth?: boolean;                                  // the uncle talks (default true)
  icons?: IconName[];                               // up to three stickers around the uncle (default none)
  camera?: Cam; notes?: string;
};

const ST: RowStyle = {color: C.ink, accent: C.red, mark: C.ink};
const SUB: RowStyle = {color: C.white, accent: C.yellow, mark: C.white};
const UX = 1470, UY = 1100, UH = 940;              // the uncle: middle of feet, feet y (below the frame), height
const ICON_SLOTS = [{x: 1262, y: 232, s: 1.5}, {x: 1790, y: 290, s: 1.6}, {x: 1800, y: 690, s: 1.5}];

const Rays: React.FC<{cx: number; cy: number; f: number}> = ({cx, cy, f}) => {
  const n = 22, r = 2300, rot = f * 0.0035;
  return <g>{Array.from({length: n / 2}, (_, i) => {
    const a0 = rot + (i * 2) * Math.PI * 2 / n, a1 = a0 + Math.PI * 2 / n;
    return <path key={i} d={`M ${cx} ${cy} L ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} L ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`} fill={C.sky2}/>;
  })}</g>;
};

export const Scene: React.FC<SceneProps<TitleSpec>> = ({f, dur, spec, at}) => {
  if (!spec || typeof spec.title !== "string" || !spec.title.trim()) throw new Error("title: spec.title must be a non-empty string");
  const accents = (spec.accent ?? []).map((a) => (typeof a === "string" ? {text: a} : a)), hits = new Set<string>();
  const hasTok = /\{[^}]+\}/.test(spec.title + (spec.sub ?? ""));
  if (hasTok && !spec.key) throw new Error("title: the title or sub prints a figure, so the spec needs a reveal key: {title, key}");
  const revealAt = spec.key ? at(spec.key) : null;
  const rawLines = spec.title.includes("\n") ? spec.title.split("\n") : spec.title.split(/(?<=[.!?])\s+/);
  const lines: Unit[][] = rawLines.map((t, i) => parseLine(t, accents, hits, `title line ${i + 1}`));
  const subUnits = spec.sub ? parseLine(spec.sub, accents, hits, "title sub") : null;
  accents.forEach((a) => { if (!hits.has(a.text)) throw new Error(`title: accent "${a.text}" is not in the title or sub`); });

  const x0 = SAFE.x0 + 16;
  const chipSize = 30, chipH = Math.round(chipSize * 1.64);
  const subSize = 50, subRows = subUnits ? layout([subUnits], subSize, 980, true) : [];
  const subH = subRows.length * subSize * 1.14 + 36 + 16;
  const extra = (spec.chip ? chipH + 30 : 0) + (subUnits ? 30 + subH : 0);
  const {size, v} = fitBlock(lines, 900, 824 - extra, 150, 84, 1.26, 56, true, "title");
  const plateH = size * 1.26 + 16, gap = 24;
  const blockH = extra + v.length * plateH + (v.length - 1) * gap;
  const top = 96 + (824 - blockH) / 2;

  const enter = pop(f, -4, 150), talk = spec.mouth === false ? "X" : visemeAt(f, 3, 8, dur - 14);
  const icons = (spec.icons ?? []).slice(0, 3);
  icons.forEach((n) => { if (!ICONS.includes(n)) throw new Error(`title: unknown icon "${n}" (icons: ${ICONS.join(", ")})`); });
  return <div style={{position: "absolute", inset: 0, background: C.sky, overflow: "hidden"}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
      <Push f={f} dur={dur} cam={spec.camera} dflt={{fx: UX, fy: 560, s0: 1, s1: 1.06}}>
        <Rays cx={UX} cy={470} f={f}/>
        <g transform={`translate(${UX} 470) scale(${pop(f, -4, 120)}) translate(${-UX} -470)`}>
          <circle cx={UX} cy={482} r={334} fill={C.ink}/>
          <circle cx={UX} cy={470} r={334} fill={C.white} stroke={C.ink} strokeWidth={8}/>
        </g>
        {icons.map((name, i) => {
          const sl = ICON_SLOTS[i], t = pop(f, 6 + i * 5, 150);
          return t > 0.01 ? <g key={name} transform={`translate(${sl.x} ${sl.y + Math.sin(f / 15 + i * 2) * 8}) rotate(${(i - 1) * 8}) scale(${t}) translate(${-sl.x} ${-sl.y})`}><Icon name={name} x={sl.x} y={sl.y} s={sl.s} f={f} seed={i + 1}/></g> : null;
        })}
        <g transform={`translate(${(1 - enter) * 520} 0)`}>
          <Keeper x={UX} y={UY} h={UH} f={f} pose="present" flip viseme={talk} look={-1}/>
        </g>
      </Push>
    </svg>
    <div style={{position: "absolute", left: x0, top, width: 1040}}>
      {spec.chip && <div style={{marginBottom: 30, height: chipH}}><Chip text={spec.chip} f={f} at={-3} size={chipSize}/></div>}
      <div style={{display: "flex", flexDirection: "column", gap, alignItems: "flex-start"}}>
        {v.map((row, i) => {
          const t0 = i * 5 - 3, k = ease(f, t0, t0 + 10), rot = [-1.2, 0.9, -0.7, 1][i % 4], settle = f > t0 + 14 ? Math.sin((f + i * 13) / 17) * 3 : 0;
          return <div key={i} style={{background: C.white, border: `8px solid ${C.ink}`, borderRadius: Math.min(44, plateH / 2.6), boxShadow: `0 10px 0 ${C.ink}`, padding: `${size * 0.04}px ${size * 0.22}px ${size * 0.1}px`,
            transform: `translate(${(1 - k) * -380}px, ${settle}px) rotate(${rot}deg)`, opacity: Math.min(1, 0.45 + k), transformOrigin: "0% 50%"}}>
            <Row row={row.chunks} size={size} f={f} t0={t0} revealAt={revealAt} st={ST} seed={60 + i * 5}/>
          </div>;
        })}
      </div>
      {subUnits && <div style={{marginTop: 30, display: "inline-block", background: C.royal, border: `8px solid ${C.ink}`, borderRadius: 30, boxShadow: `0 10px 0 ${C.ink}`, padding: "14px 34px 18px",
        transform: `scale(${pop(f, v.length * 5 + 8, 170)})`, transformOrigin: "0% 50%"}}>
        {subRows.map((r, i) => <Row key={i} row={r.chunks} size={subSize} f={f} t0={v.length * 5 + 8} revealAt={revealAt} st={SUB} seed={90 + i * 5}/>)}
      </div>}
    </div>
  </div>;
};

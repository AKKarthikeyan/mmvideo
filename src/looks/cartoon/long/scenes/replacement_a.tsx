// Scene kind "replacement" (CONTRACT section 2): the 2.1 explainer. Two parents, an arrow, two children plus a ghost child whose ring fills by the
// extra 0.1, then the replacement line drawn across the screen with its 2.1 badge. 1920 x 1080, flat cartoon, pilot style. Independent of cast.tsx.
// Spec: {parents?: 1-4 = 2, children?: 1-4 = 2, extra: {const: 0.1, key, caption?}, line: {const: 2.1, key, label?: "replacement level"}, title?, camera?, notes?}
// Numbers: the two printed numbers are spec constants, drawn only from at(key). Nothing else prints a digit. A malformed spec throws.
import React from "react";
import {AbsoluteFill} from "remotion";
import {C} from "../../palette";
import {Pill, ROUND, SANS, ease, easeIO, pop} from "../../ui";
import {SAFE, type SceneProps} from "../contract";
import {Person, figureTop, type PKind} from "./replacement_a_people";

type Keyed = {const: number; key: string};
export type ReplacementSpec = {
  parents?: number; children?: number;
  extra: Keyed & {caption?: string};
  line: Keyed & {label?: string};
  title?: string;
  camera?: {fx: number; fy: number; s0: number; s1: number};
  notes?: string;
};

const need = (c: any, name: string): Keyed => {
  if (!c || typeof c.const !== "number" || !Number.isFinite(c.const) || typeof c.key !== "string" || !c.key) throw new Error(`replacement: spec.${name} must be {const: number, key: string} (got ${JSON.stringify(c)})`);
  return c;
};
const count = (v: unknown, name: string, dflt: number) => {
  const n = v === undefined ? dflt : Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 4) throw new Error(`replacement: spec.${name} must be a whole number 1 to 4 (got ${JSON.stringify(v)})`);
  return n;
};

const FLOOR = 590, FEET = 706, LINE_Y = 838;
const PARENT_H = 480, KID_H = 340;
const RING_R = 128, RING_CY = FEET - 138, CIRC = 2 * Math.PI * RING_R;
const topPx = (k: PKind, h: number) => FEET - (392 - figureTop(k)) * h / 400;

// A white badge with one big number (and an optional caption) that pops on its key. Centred on (x, y), or its bottom centre on (x, y) when `bottom`.
const NumBadge: React.FC<{text: string; f: number; at: number; x: number; y: number; size: number; color: string; caption?: string; rot?: number; width?: number; bottom?: boolean}> =
  ({text, f, at, x, y, size, color, caption, rot = -2, width, bottom}) => {
  const t = pop(f, at);
  if (t <= 0.001) return null;
  const fl = Math.sin((f - at) / 11) * 3;
  return <div style={{position: "absolute", left: x, top: y + fl, transform: `translate(-50%, ${bottom ? "-100%" : "-50%"}) scale(${t}) rotate(${rot}deg)`, transformOrigin: bottom ? "50% 100%" : "50% 60%",
    display: "flex", flexDirection: "column", alignItems: "center", background: C.white, borderRadius: 44, padding: `16px 40px ${caption ? 20 : 12}px`, width,
    border: `8px solid ${C.ink}`, boxShadow: `0 12px 0 ${C.ink}`}}>
    <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: size, lineHeight: 1, color, letterSpacing: -2, whiteSpace: "nowrap", fontFeatureSettings: "'lnum' 1"}}>{text}</div>
    {caption && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 32, lineHeight: 1.16, color: C.ink, marginTop: 10, textAlign: "center"}}>{caption}</div>}
  </div>;
};

const Tag: React.FC<{text: string; f: number; at: number; x: number; y: number}> = ({text, f, at, x, y}) => {
  const t = pop(f, at, 220);
  if (t <= 0.001) return null;
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${t})`, background: C.ink, color: C.white, borderRadius: 999, padding: "8px 28px",
    fontFamily: SANS, fontWeight: 900, fontSize: 30, letterSpacing: 4, whiteSpace: "nowrap"}}>{text}</div>;
};

// Pop a figure in from its feet.
const Popped: React.FC<{f: number; at: number; x: number; y: number; children: React.ReactNode}> = ({f, at, x, y, children}) => {
  const t = pop(f, at);
  if (t <= 0.001) return null;
  return <g transform={`translate(${x} ${y}) scale(${t}) translate(${-x} ${-y})`}>{children}</g>;
};

const Cloud: React.FC<{x: number; y: number; s: number; f: number; v: number}> = ({x, y, s, f, v}) => {
  const cx = ((x + f * v + 400) % 2640) - 400;
  return <g transform={`translate(${cx} ${y}) scale(${s})`} fill={C.white} opacity={0.75}>
    <rect x={-90} y={-22} width={180} height={44} rx={22}/><circle cx={-28} cy={-28} r={34}/><circle cx={22} cy={-36} r={42}/>
  </g>;
};

export const Scene: React.FC<SceneProps<ReplacementSpec>> = ({f, dur, spec, at}) => {
  const extra = need(spec?.extra, "extra"), line = need(spec?.line, "line");
  const nPar = count(spec.parents, "parents", 2), nKid = count(spec.children, "children", 2);
  const tE = at(extra.key), tL = at(line.key);
  const cam = spec.camera ?? {fx: 960, fy: LINE_Y, s0: 1, s1: 1.035};
  const sc = cam.s0 + (cam.s1 - cam.s0) * easeIO(f, 0, Math.max(1, dur));

  // schedule (local frames): parents, arrow, children come before the narrator's "0.1" key whenever the key leaves room
  const tK = Math.max(22, Math.min(46, tE - 34));
  const tP = Math.max(1, Math.min(2, tK - 16));
  const tA = Math.max(tP + 12, tK - 18);

  const parCx = 470, parX = (i: number) => parCx + (i - (nPar - 1) / 2) * 270;
  const slot = nKid <= 2 ? 215 : nKid === 3 ? 195 : 160, ghostX = nKid <= 2 ? 1575 : 1630;
  const kidX = (i: number) => ghostX - (nKid - i) * slot;           // children stand left of the ghost slot
  const pk: PKind[] = ["mother", "father", "mother", "father"], ck: PKind[] = ["girl", "boy", "girl", "boy"];
  const fill = ease(f, tE, tE + 18) * Math.max(0, Math.min(1, extra.const));
  const cheerOf = (a: number) => { const k = (f - a) / 34; return k > 0 && k < 1 ? Math.sin(Math.PI * Math.min(1, k * 1.2)) : 0; };

  const arrowX = nKid <= 2 ? 862 : 810, arrowY = 500, ap = ease(f, tA, tA + 14);
  const nudge = Math.sin(f / 7) * 6 * ap;
  const lp = ease(f, tL, tL + 26), lineEnd = -40 + 2000 * lp, dash = -f * 1.6;
  const lineLabel = (line.label ?? "replacement level").toUpperCase();

  return <AbsoluteFill style={{background: C.sky, overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, transformOrigin: `${cam.fx}px ${cam.fy}px`, transform: `scale(${sc})`}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute", left: 0, top: 0}}>
        <rect width={1920} height={1080} fill={C.sky}/>
        <rect y={0} width={1920} height={FLOOR} fill={C.sky2} opacity={0.55}/>
        <Cloud x={260} y={190} s={1.3} f={f} v={0.35}/><Cloud x={1120} y={150} s={1} f={f} v={0.22}/><Cloud x={1650} y={300} s={0.8} f={f} v={0.3}/>
        <rect y={FLOOR} width={1920} height={520} fill={C.wall}/>
        <rect y={FLOOR} width={1920} height={14} fill={C.ink}/>
        <rect y={FLOOR + 14} width={1920} height={70} fill={C.wallLow} opacity={0.55}/>
        {/* faint guide where the line will go */}
        <line x1={0} y1={LINE_Y} x2={1920} y2={LINE_Y} stroke={C.ink} strokeOpacity={0.14} strokeWidth={8} strokeDasharray="4 30" strokeLinecap="round"/>

        {/* parents */}
        {Array.from({length: nPar}, (_, i) => <Popped key={i} f={f} at={tP + i * 6} x={parX(i)} y={FEET}>
          <Person kind={pk[i]} x={parX(i)} y={FEET} h={PARENT_H} f={f} seed={3 + i} cheer={cheerOf(tP + i * 6)}/></Popped>)}

        {/* arrow */}
        {ap > 0.01 && <g transform={`translate(${arrowX + nudge} ${arrowY}) scale(${ap} 1)`}>
          <path d="M -105 -34 L 30 -34 L 30 -78 L 112 0 L 30 78 L 30 34 L -105 34 Z" fill={C.orange} stroke={C.ink} strokeWidth={8} strokeLinejoin="round"/>
          <path d="M -88 -20 L 40 -20 L 40 -44" fill="none" stroke={C.white} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.7}/>
        </g>}

        {/* children */}
        {Array.from({length: nKid}, (_, i) => <Popped key={i} f={f} at={tK + i * 7} x={kidX(i)} y={FEET}>
          <Person kind={ck[i]} x={kidX(i)} y={FEET} h={KID_H} f={f} seed={11 + i} cheer={cheerOf(tK + i * 7)}/></Popped>)}
        {/* the ghost child: an empty slot (dashed ring and pale figure) until the extra lands; then the ring fills clockwise by the extra (0.1 of a whole) */}
        <Popped f={f} at={tK + nKid * 7 + 4} x={ghostX} y={FEET}>
          <g transform={`translate(${ghostX} ${RING_CY}) rotate(-90)`}>
            <circle r={RING_R} fill={C.white} fillOpacity={0.6} stroke={C.ink} strokeOpacity={0.4} strokeWidth={10} strokeDasharray="3 24" strokeLinecap="round"/>
            {fill > 0.0005 && <g fill="none" strokeLinecap="round">
              <circle r={RING_R} stroke={C.ink} strokeWidth={38} strokeDasharray={`${CIRC * fill} ${CIRC}`}/>
              <circle r={RING_R} stroke={C.orange} strokeWidth={22} strokeDasharray={`${CIRC * fill} ${CIRC}`}/>
            </g>}
          </g>
          <Person kind="girl" x={ghostX} y={FEET} h={KID_H} f={f} seed={19} ghost shadow/>
        </Popped>

        {/* children -> 2.1 */}
        {lp > 0.001 && <g fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M 1146 784 Q 1088 768 1030 786" strokeDasharray="140" strokeDashoffset={140 * (1 - ease(f, tL + 10, tL + 24))}/>
          {ease(f, tL + 20, tL + 26) > 0.5 && <path d="M 1072 795 L 1030 786 L 1061 756"/>}
        </g>}
        {/* the replacement line, across the whole screen */}
        {lp > 0.001 && <g>
          <line x1={-40} y1={LINE_Y} x2={lineEnd} y2={LINE_Y} stroke={C.ink} strokeWidth={22} strokeLinecap="round" strokeDasharray="30 30" strokeDashoffset={dash}/>
          <line x1={-40} y1={LINE_Y} x2={lineEnd} y2={LINE_Y} stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeDasharray="30 30" strokeDashoffset={dash}/>
        </g>}
      </svg>

      {/* overlay: words and the two numbers */}
      <div style={{position: "absolute", left: SAFE.x0, top: SAFE.y0 + 18}}><Pill text={(spec.title ?? "The magic number").toUpperCase()} f={f} at={3} dot={C.red} size={34}/></div>
      <Tag text={nPar === 2 ? "TWO PARENTS" : "PARENTS"} f={f} at={tP + 10} x={parCx} y={FEET + 52}/>
      <Tag text="CHILDREN" f={f} at={tK + 10} x={kidX((nKid - 1) / 2)} y={FEET + 52}/>
      <NumBadge text={extra.const.toFixed(1)} f={f} at={tE} x={Math.min(ghostX, SAFE.x1 - 270)} y={topPx("girl", KID_H) - 54} size={104} color={C.orangeDark} rot={3} bottom
        caption={extra.caption ?? "covers children who don't survive to adulthood"} width={430}/>
      {lp > 0.001 && <div style={{position: "absolute", left: SAFE.x0 + 20, top: LINE_Y - 39}}><Pill text={lineLabel} f={f} at={tL + 2} dot={C.red} size={34}/></div>}
      <NumBadge text={line.const.toFixed(1)} f={f} at={tL} x={900} y={LINE_Y} size={120} color={C.red} rot={-2}/>
    </div>
  </AbsoluteFill>;
};

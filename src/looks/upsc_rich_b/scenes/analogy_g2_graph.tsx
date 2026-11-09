// ECO-16 Part 3, builder G2: `graph-trap` (b05; ref e16_graph). A textbook page card with the sentence "formal lenders meet only about half" underlined in red, a bar-graph card whose formal slices
// (banks, cooperative, other formal) stack to the table's `formal` value (66) and whose informal slices stack to `informal` (34), a stamp BOTH ARE IN NCERT, and a handwritten notebook tag.
// Every slice height is read from e16_graph; the code refuses to draw if the slices do not add up to the table's totals.
import React from "react";
import {Brace, Desk, F3Defs, FCard, G2Defs, Ink, Shade, E, Z, fv, ft, pop, prog, eo, elabs, SANS, SERIF, inkFront} from "./analogy_g2_kit";
import type {AP} from "./analogy_kit";

const PG = {x: 110, y: 190, w: 650, h: 590};
const GR = {x: 1090, y: 170, w: 720, h: 610};
const COL = {x: 1280, w: 130, base: 670, per: 3.9};                 // px per percentage point
const SENT = "formal lenders meet only about half";

type Sl = {key: string; name: string; formal: boolean; tone: [string, string, string]};
const SLICES: Sl[] = [
  {key: "banks", name: "BANKS", formal: true, tone: ["#7fdad2", "#2fa3a8", "#176a7c"]},
  {key: "coop", name: "COOPERATIVE", formal: true, tone: ["#a6e6c8", "#4fb585", "#237a52"]},
  {key: "otherf", name: "OTHER FORMAL", formal: true, tone: ["#b6dcf0", "#5f9fcf", "#2c6498"]},
  {key: "mlender", name: "MONEYLENDERS", formal: false, tone: ["#ffd488", "#e9953c", "#b3591e"]},
  {key: "relatives", name: "RELATIVES", formal: false, tone: ["#ffe1a4", "#f0b45a", "#b97a24"]},
  {key: "otheri", name: "OTHER", formal: false, tone: ["#f6c8a0", "#d9855a", "#9a4a28"]},
  {key: "landlords", name: "LANDLORDS", formal: false, tone: ["#e8d0a8", "#b9966a", "#7a5a34"]},
];

/** spread label y positions so that none is closer than `gap` to its neighbour (labels keep their order) */
const relax = (ys: number[], gap: number): number[] => {
  const out = [...ys];
  for (let it = 0; it < 40; it++) for (let i = 1; i < out.length; i++) if (out[i - 1] - out[i] < gap) { const m = (out[i - 1] + out[i]) / 2; out[i - 1] = m + gap / 2; out[i] = m - gap / 2; }
  return out;
};

const TextbookPage: React.FC<{f: number; tx: number}> = ({f, tx}) => {
  const a = Z(f, 0, 30), r = (i: number) => 330 + ((i * 97) % 150);
  const wr = Z(f, 22, 44), ul = Z(f, tx + 6, 26);
  const sy = 468;
  return (
    <g opacity={a} transform={`translate(${PG.x + PG.w / 2} ${PG.y + PG.h / 2 + (1 - a) * 40}) rotate(-1.8) translate(${-PG.w / 2} ${-PG.h / 2})`}>
      <rect x={16} y={26} width={PG.w} height={PG.h} rx={10} fill="#2a1808" opacity={0.36} filter="url(#e3-glow)"/>
      <rect x={0} y={0} width={PG.w} height={PG.h} rx={8} fill="url(#g2-sheet)" stroke="#bda46c" strokeWidth={2.4}/>
      <rect x={0} y={0} width={36} height={PG.h} rx={8} fill="#000" opacity={0.08}/>
      <rect x={0} y={0} width={PG.w} height={12} rx={6} fill="#4f7aa8" opacity={0.9}/>
      {/* a heading bar and a small chapter strip */}
      <rect x={60} y={48} width={300} height={22} rx={5} fill="#3a5b82" opacity={0.75}/>
      <rect x={60} y={84} width={180} height={12} rx={4} fill="#8a9bb0" opacity={0.6}/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M60,${128 + i * 40} h${r(i) - (i % 3) * 30}`} stroke="#6b5a40" strokeWidth={9} strokeLinecap="round" opacity={0.35}/>)}
      {/* the sentence, as printed in the text */}
      <rect x={44} y={sy - 40} width={PG.w - 88} height={64} rx={8} fill="#ffe9a8" opacity={0.0 + 0.55 * Z(f, tx - 4, 16)}/>
      <g>
        <defs><clipPath id="g2tp-c"><rect x={50} y={sy - 44} width={Math.max(0.1, (PG.w - 70) * wr)} height={90}/></clipPath></defs>
        <g clipPath="url(#g2tp-c)"><text x={64} y={sy} fontFamily={SERIF} fontStyle="italic" fontWeight={600} fontSize={34} fill="#2b2418">{SENT}</text></g>
      </g>
      {/* the red underline, drawn with a slight wobble */}
      {ul > 0.01 && (
        <g>
          <path d={`M60,${sy + 14} q80,-9 160,1 t160,-1 t160,2 t30,-2`} pathLength={100} fill="none" stroke="#c63f2f" strokeWidth={6} strokeLinecap="round" strokeDasharray="100 100" strokeDashoffset={100 * (1 - ul)} filter="url(#e3-sh-s)"/>
          <path d={`M66,${sy + 26} q120,-8 260,2 t170,-1`} pathLength={100} fill="none" stroke="#c63f2f" strokeWidth={3.4} strokeLinecap="round" strokeDasharray="100 100" strokeDashoffset={100 * (1 - Z(f, tx + 18, 22))} opacity={0.8}/>
        </g>
      )}
      {Array.from({length: 2}, (_, i) => <path key={i} d={`M60,${530 + i * 38} h${360 - i * 120}`} stroke="#6b5a40" strokeWidth={9} strokeLinecap="round" opacity={0.35}/>)}
      <circle cx={PG.w - 52} cy={PG.h - 40} r={16} fill="none" stroke="#8a9bb0" strokeWidth={2.4} opacity={0.5}/>
    </g>
  );
};

/** a two-line rubber stamp that lands */
const Stamp2: React.FC<{x: number; y: number; lines: string[]; f: number; at: number; rot?: number; size?: number; col?: string}> = ({x, y, lines, f, at, rot = -8, size = 44, col = "#a5302a"}) => {
  const u = prog(f, at, 12);
  if (u <= 0.001) return null;
  const k = 1 + (1 - E(f, at, 12)) * 0.8, shake = Math.sin(f * 1.7) * Math.max(0, 1 - (f - at - 8) / 14) * Math.min(1, (f - at - 6) / 4) * 2.6;
  const w = Math.max(...lines.map((l) => l.length)) * size * 0.6 + 56, h = lines.length * size * 1.12 + 36;
  return (
    <g transform={`translate(${x + shake} ${y}) rotate(${rot}) scale(${k})`} opacity={Math.min(1, u * 3)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="#fff6e4" opacity={0.82}/>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill="none" stroke={col} strokeWidth={6}/>
      <rect x={-w / 2 + 9} y={-h / 2 + 9} width={w - 18} height={h - 18} rx={8} fill="none" stroke={col} strokeWidth={2.4}/>
      {lines.map((l, i) => <text key={i} x={0} y={(i - (lines.length - 1) / 2) * size * 1.12 + size * 0.34} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={size} letterSpacing="0.06em" fill={col}>{l}</text>)}
      {u < 1 && <circle r={size * 3.4} fill="none" stroke={col} strokeWidth={3} opacity={0.4 * (1 - u)} transform={`scale(${0.4 + 0.6 * u})`}/>}
    </g>
  );
};

export const GraphTrapArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const v = (s: string) => fv("e16_graph", s);
  const fSum = v("banks") + v("coop") + v("otherf"), iSum = v("mlender") + v("relatives") + v("otheri") + v("landlords");
  if (fSum !== v("formal") || iSum !== v("informal")) throw new Error("e16_graph: the slices must add up to the formal and informal totals");
  const gA = Z(f, L.gr.at - 24, 26), g0 = L.gr.at + 4;
  // heights and tops, bottom to top
  let acc = 0;
  const geo = SLICES.map((s, i) => {
    const h = v(s.key) * COL.per, y1 = COL.base - acc, k = E(f, g0 + i * 10, 22), cy = y1 - h / 2;
    acc += h;
    return {...s, h, y1, k, cy, v: v(s.key), i};
  });
  const fH = v("formal") * COL.per, iH = v("informal") * COL.per;
  const ly = relax(geo.map((g) => g.cy), 30);
  const brK = E(f, g0 + 52, 26), brI = E(f, g0 + 92, 24);
  const stA = L.bt.at;
  return (
    <g>
      <F3Defs/><G2Defs/>
      <Desk f={f} id="g2gt"/>
      <TextbookPage f={f} tx={L.tx.at}/>
      {/* the bar-graph card */}
      <g opacity={gA} transform={`translate(0 ${(1 - gA) * 40})`}>
        <rect x={GR.x + 14} y={GR.y + 26} width={GR.w} height={GR.h} rx={14} fill="#2a1808" opacity={0.36} filter="url(#e3-glow)"/>
        <rect x={GR.x} y={GR.y} width={GR.w} height={GR.h} rx={12} fill="url(#g2-sheet)" stroke="#bda46c" strokeWidth={2.4}/>
        <rect x={GR.x} y={GR.y} width={GR.w} height={12} rx={6} fill="#2fa3a8" opacity={0.9}/>
        {Array.from({length: 9}, (_, i) => <path key={i} d={`M${GR.x + 20},${COL.base - i * 50} H${GR.x + GR.w - 20}`} stroke="#9cb6c8" strokeWidth={1.2} opacity={0.4}/>)}
        <text x={GR.x + GR.w / 2} y={GR.y + 62} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={32} letterSpacing={5} fill="#3a5b82">SOURCES OF CREDIT</text>
        <rect x={COL.x - 8} y={COL.base - 100 * COL.per - 6} width={COL.w + 16} height={100 * COL.per + 14} rx={8} fill="none" stroke="#a8864c" strokeWidth={2.2} strokeDasharray="10 8" opacity={0.7}/>
        <path d={`M${GR.x + 24},${COL.base + 6} H${GR.x + GR.w - 24}`} stroke="#6a5538" strokeWidth={3}/>
        {/* the column */}
        {geo.map((g) => g.k > 0.002 && (
          <g key={g.key}>
            <defs><linearGradient id={`g2gs-${g.key}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={g.tone[0]}/><stop offset="0.5" stopColor={g.tone[1]}/><stop offset="1" stopColor={g.tone[2]}/></linearGradient></defs>
            <rect x={COL.x} y={g.y1 - g.h * g.k} width={COL.w} height={g.h * g.k} fill={`url(#g2gs-${g.key})`} stroke={g.tone[2]} strokeWidth={2}/>
            <polygon points={`${COL.x + COL.w},${g.y1 - g.h * g.k} ${COL.x + COL.w + 18},${g.y1 - g.h * g.k - 10} ${COL.x + COL.w + 18},${g.y1 - 10} ${COL.x + COL.w},${g.y1}`} fill={g.tone[2]} opacity={0.85}/>
            <polygon points={`${COL.x},${g.y1 - g.h * g.k} ${COL.x + 18},${g.y1 - g.h * g.k - 10} ${COL.x + COL.w + 18},${g.y1 - g.h * g.k - 10} ${COL.x + COL.w},${g.y1 - g.h * g.k}`} fill={g.tone[0]} stroke={g.tone[2]} strokeWidth={1.4}/>
            <rect x={COL.x + 6} y={g.y1 - g.h * g.k + 2} width={10} height={Math.max(0, g.h * g.k - 4)} fill="#fff" opacity={0.22}/>
            {g.v >= 10 && g.k > 0.6 && <text x={COL.x + COL.w / 2} y={g.y1 - g.h * g.k / 2 + 14} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={g.v >= 40 ? 50 : 30} fill="#fff" stroke={g.tone[2]} strokeWidth={1.6} paintOrder="stroke" opacity={Math.min(1, (g.k - 0.6) * 4)}>{ft("e16_graph", g.key)}</text>}
          </g>
        ))}
        {/* slice names with leaders */}
        {geo.map((g, i) => g.k > 0.5 && (
          <g key={`l${g.key}`} opacity={Math.min(1, (g.k - 0.5) * 3)}>
            <path d={`M${COL.x + COL.w + 22},${g.cy} L${COL.x + COL.w + 54},${ly[i]} H${COL.x + COL.w + 66}`} stroke={g.tone[2]} strokeWidth={2.2} fill="none"/>
            <circle cx={COL.x + COL.w + 20} cy={g.cy} r={3.4} fill={g.tone[2]}/>
            <text x={COL.x + COL.w + 76} y={ly[i] + 8} fontFamily={SANS} fontWeight={800} fontSize={22} letterSpacing={1.2} fill={g.tone[2]}>{ft("e16_graph", g.key)}  {g.name}</text>
          </g>
        ))}
        {/* braces and the sums */}
        <Brace x={COL.x - 22} y0={COL.base} y1={COL.base - fH} dir={-1} c="#176a7c" w={5} p={brK} amp={22}/>
        {brK > 0.4 && <text x={COL.x - 66} y={COL.base - fH / 2 + 18} textAnchor="end" fontFamily={SERIF} fontWeight={800} fontSize={54} fill="#176a7c" opacity={Math.min(1, (brK - 0.4) * 3)}>{ft("e16_graph", "formal")}%</text>}
        <Brace x={COL.x - 22} y0={COL.base - fH - 6} y1={COL.base - fH - iH} dir={-1} c="#b3591e" w={5} p={brI} amp={22}/>
        {brI > 0.4 && <text x={COL.x - 66} y={COL.base - fH - iH / 2 + 14} textAnchor="end" fontFamily={SERIF} fontWeight={800} fontSize={44} fill="#b3591e" opacity={Math.min(1, (brI - 0.4) * 3)}>{ft("e16_graph", "informal")}%</text>}
        <g opacity={brK}><text x={GR.x + GR.w / 2} y={COL.base + 54} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={32} fill="#176a7c">{ft("e16_graph", "banks")} + {ft("e16_graph", "coop")} + {ft("e16_graph", "otherf")} = {ft("e16_graph", "formal")} formal</text></g>
        <g opacity={brI}><text x={GR.x + GR.w / 2} y={COL.base + 94} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={32} fill="#b3591e">{ft("e16_graph", "mlender")} + {ft("e16_graph", "relatives")} + {ft("e16_graph", "otheri")} + {ft("e16_graph", "landlords")} = {ft("e16_graph", "informal")} informal</text></g>
      </g>
      {/* the two documents are tied to the stamp */}
      {(() => {
        const u = Z(f, stA, 26);
        return u > 0.01 ? (
          <g opacity={0.85 * u}>
            <path d={`M716,468 C760,466 790,468 818,474`} stroke="#a5302a" strokeWidth={4} fill="none" strokeDasharray="3 10" strokeLinecap="round" strokeDashoffset={-f * 0.8}/>
            <path d={`M1090,420 C1070,430 1050,446 1034,460`} stroke="#a5302a" strokeWidth={4} fill="none" strokeDasharray="3 10" strokeLinecap="round" strokeDashoffset={-f * 0.8}/>
          </g>
        ) : null;
      })()}
      <Stamp2 x={925} y={476} lines={["BOTH ARE", "IN NCERT"]} f={f} at={stA} size={42}/>
      <NoteTag f={f} at={L.sv.at} text={L.sv.text}/>
    </g>
  );
};

/** the notebook strip with the exam tip written by hand */
const NoteTag: React.FC<{f: number; at: number; text: string}> = ({f, at, text}) => {
  const a = Z(f, at - 6, 20), x = 420, y = 806, w = 1080, h = 92, size = 40;
  if (a <= 0.01) return null;
  return (
    <g opacity={a} transform={`translate(0 ${(1 - a) * 24})`}>
      <rect x={x + 10} y={y + 14} width={w} height={h} rx={12} fill="#2a1808" opacity={0.34} filter="url(#e3-glow-s)"/>
      <rect x={x - 12} y={y - 8} width={w + 24} height={h + 16} rx={16} fill="#5e3c78" stroke="#3a2250" strokeWidth={3}/>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="url(#g2-sheet)" stroke="#cbb88a" strokeWidth={1.6}/>
      {[0, 1].map((i) => <path key={i} d={`M${x + 100},${y + 40 + i * 30} H${x + w - 20}`} stroke="#b9cde0" strokeWidth={1.4} opacity={0.7}/>)}
      <path d={`M${x + 84},${y + 6} V${y + h - 6}`} stroke="#e29a8a" strokeWidth={2.2} opacity={0.7}/>
      {[0, 1].map((i) => <g key={i} transform={`translate(${x + 40} ${y + 28 + i * 40})`}><circle r={11} fill="#cdb98c" stroke="#8e7a52" strokeWidth={1.4}/><path d="M-26,0 H20" stroke="#9aa6b2" strokeWidth={5} strokeLinecap="round"/></g>)}
      <Ink id="g2nt" x={x + 112} y={y + 62} text={text} size={size} f={f} start={at} len={50} maxW={w - 150} color="#1f3a78"/>
    </g>
  );
};

export const GraphTrapLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <FCard cx={PG.x + PG.w / 2} y={64} text={L.tx.text} f={p.f} at={L.tx.at} size={32} maxW={640} upper={false} tone="red"/>
      <FCard cx={GR.x + GR.w / 2} y={64} text={L.gr.text} f={p.f} at={L.gr.at} size={32} maxW={720} upper={false} tone="cool"/>
    </>
  );
};
export {eo, pop, Shade, inkFront};

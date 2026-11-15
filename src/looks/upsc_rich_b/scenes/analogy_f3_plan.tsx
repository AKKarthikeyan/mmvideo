// ECO-16 Part 2, builder F3: `plan-steps` (mode "questions": last time's finding and two handwritten questions; mode "steps": four ticking boxes and a three-stop path).
// The bar in the finding is drawn from fig(e16_m3); every written word comes from a spec label and appears from at(key).
import React from "react";
import {fig} from "../../cartoon/long/figs";
import {SANS, SERIF, W, H, eo} from "../kit";
import {lerp, prog, type AP} from "./analogy_kit";
import {DeskBG, F3Defs, Ink, NotePage, Pencil, elabs, inkFront, inkW} from "./analogy_f3_kit";

const PG = {x: 250, y: 70, w: 1420, h: 790};

type Writing = {x: number; y: number; text: string; size: number; start: number; len: number};

/** the pencil rests at the page corner, then goes to the writing front of each line in turn */
const pencilAt = (f: number, rest: [number, number], ws: Writing[]) => {
  let px = rest[0], py = rest[1], rot = -14;
  for (const w of ws) {
    const inn = eo(prog(f, w.start - 14, 14)), out = eo(prog(f, w.start + w.len, 22)), m = inn * (1 - out);
    if (m <= 0) continue;
    const tx = inkFront(w.x, w.text, w.size, f, w.start, w.len) + 4, ty = w.y + 8;
    px = lerp(px, tx, m); py = lerp(py, ty, m); rot = lerp(rot, -44, m);
  }
  return {px, py, rot};
};

const Tick: React.FC<{x: number; y: number; k: number; s?: number; c?: string}> = ({x, y, k, s = 1, c = "#1f8a4c"}) => (
  <path d={`M${x},${y} l${17 * s},${19 * s} l${32 * s},${-42 * s}`} fill="none" stroke={c} strokeWidth={9 * s} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="90" strokeDashoffset={90 * (1 - k)}/>
);

// ---- questions ------------------------------------------------------------------------------------------------------------------
export const PlanQuestionsArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 24));
  const cash = fig({t: "e16_m3", state: "India", s: "cash"}).value, dep = fig({t: "e16_m3", state: "India", s: "dep"}).value, tot = cash + dep;
  const BARX = PG.x + PG.w - 100 - 320, BARY = 232, BARW = 320, BARH = 48;
  const ws: Writing[] = [
    {x: PG.x + 170, y: 244, text: L.pr.text, size: 42, start: L.pr.at, len: 52},
    {x: PG.x + 250, y: 544, text: L.q1.text, size: 58, start: L.q1.at, len: 52},
    {x: PG.x + 250, y: 744, text: L.q2.text, size: 58, start: L.q2.at, len: 60},
  ];
  const pen = pencilAt(f, [PG.x + PG.w - 330, PG.y + PG.h - 60], ws);
  const barK = eo(prog(f, L.pr.at + 14, 36)), cw = BARW * (cash / tot) * barK, dw = BARW * (dep / tot) * barK;
  const boxA = eo(prog(f, L.pr.at - 10, 22));
  return (
    <g>
      <F3Defs/>
      <DeskBG f={f} id="f3q"/>
      <NotePage x={PG.x} y={PG.y} w={PG.w} h={PG.h} a={a0} pitch={100} first={182}/>
      <g opacity={a0}>
        {/* last time's finding, in a highlighted frame */}
        <g opacity={boxA}>
          <rect x={PG.x + 150} y={130} width={PG.w - 190} height={170} rx={18} fill="#ffe27a" opacity={0.3}/>
          <rect x={PG.x + 150} y={130} width={PG.w - 190} height={170} rx={18} fill="none" stroke="#c9922a" strokeWidth={3} strokeDasharray="14 9" opacity={0.75}/>
          <g transform={`translate(${PG.x + 176} 160)`}><circle r={0.1} fill="none"/><path d="M0,0 l14,-6 l8,16 l-14,6 Z" fill="#c9922a" opacity={0.9}/></g>
        </g>
        <Ink id="f3q-pr" x={ws[0].x} y={ws[0].y} text={ws[0].text} size={ws[0].size} f={f} start={ws[0].start} len={ws[0].len}/>
        {f >= L.pr.at + 8 && (
          <g opacity={eo(prog(f, L.pr.at + 8, 16))}>
            <rect x={BARX - 4} y={BARY - 4} width={BARW + 8} height={BARH + 8} rx={12} fill="#fffdf3" stroke="#8e7a52" strokeWidth={2.4}/>
            <rect x={BARX} y={BARY} width={cw} height={BARH} rx={cw > 10 ? 8 : 0} fill="#e29a2c" stroke="#8a5a10" strokeWidth={1.6}/>
            <rect x={BARX + cw} y={BARY} width={dw} height={BARH} fill="#3a82c0" stroke="#1d4f7c" strokeWidth={1.6}/>
            <text x={BARX} y={BARY - 14} fontFamily={SANS} fontWeight={800} fontSize={24} fill="#8a5a10">cash</text>
            <text x={BARX + cw + dw / 2} y={BARY - 14} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={24} fill="#1d4f7c">deposits</text>
          </g>
        )}
        {/* the two questions */}
        {([1, 2] as const).map((n) => {
          const w = ws[n], k = eo(prog(f, w.start - 2, 16));
          const qx = w.x + inkW(w.text, w.size) + 70, qa = eo(prog(f, w.start + w.len, 22));
          return (
            <g key={n}>
              {k > 0 && (
                <g opacity={k}>
                  <circle cx={PG.x + 186} cy={w.y - 22} r={40} fill="none" stroke="#1f3a78" strokeWidth={4.4} strokeDasharray="260" strokeDashoffset={260 * (1 - k)} transform={`rotate(-90 ${PG.x + 186} ${w.y - 22})`}/>
                  <text x={PG.x + 186} y={w.y - 4} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={54} fill="#1f3a78">{n}</text>
                </g>
              )}
              <Ink id={`f3q-q${n}`} x={w.x} y={w.y} text={w.text} size={w.size} f={f} start={w.start} len={w.len}/>
              {qa > 0 && <text x={qx} y={w.y + 20} fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={130} fill="#d8682a" opacity={0.85 * qa} transform={`rotate(${n === 1 ? -8 : 7} ${qx} ${w.y})`}>?</text>}
            </g>
          );
        })}
      </g>
      <Pencil x={pen.px} y={pen.py} rot={pen.rot}/>
    </g>
  );
};

// ---- steps ----------------------------------------------------------------------------------------------------------------------
const PG2 = {x: 250, y: 70, w: 1420, h: 480};
const ROADY = (x: number) => 838 + 20 * Math.sin(x / 150);
const STOPX = [380, 960, 1540];

export const PlanStepsArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p), a0 = eo(prog(f, 0, 24));
  const keys = ["s1", "s2", "s3", "s4"];
  const ws: Writing[] = keys.map((k, i) => ({x: PG2.x + 250, y: PG2.y + 110 + i * 100 - 10, text: L[k].text, size: 54, start: L[k].at, len: 34}));
  const pen = pencilAt(f, [PG2.x + PG2.w - 330, PG2.y + PG2.h - 52], ws);
  const roadPts = Array.from({length: 41}, (_, i) => 160 + i * 40).map((x) => `${x},${ROADY(x).toFixed(1)}`);
  const t2 = L.p2.at, bA = eo(prog(f, t2, 22)), lit = eo(prog(f, t2, 30));
  const litX = lerp(160, STOPX[1], lit);
  const m = /^(PART \d)\s*(.*)$/.exec(L.p2.text), head2 = m ? m[1] : L.p2.text, rest2 = m ? m[2] : "";
  const boards = [
    {x: STOPX[0], head: "PART 1", rest: "", l: 0},
    {x: STOPX[1], head: head2, rest: rest2, l: lit},
    {x: STOPX[2], head: "PART 3", rest: "", l: 0},
  ];
  return (
    <g>
      <F3Defs/>
      <defs><clipPath id="f3s-lit"><rect x={0} y={640} width={Math.max(1, litX)} height={400}/></clipPath></defs>
      <DeskBG f={f} id="f3s" mug={false}/>
      <NotePage x={PG2.x} y={PG2.y} w={PG2.w} h={PG2.h} a={a0} pitch={100} first={110}/>
      <g opacity={a0}>
        {keys.map((k, i) => {
          const w = ws[i], by = w.y - 46, tk = eo(prog(f, w.start + 14, 16)), pop = eo(prog(f, w.start - 4, 12));
          return (
            <g key={k}>
              <g opacity={0.35 + 0.65 * pop}>
                <rect x={PG2.x + 150} y={by} width={68} height={68} rx={12} fill="#fffdf6" stroke="#7a5a3a" strokeWidth={4}/>
              </g>
              <Tick x={PG2.x + 160} y={by + 38} k={tk}/>
              <Ink id={`f3s-${k}`} x={w.x} y={w.y} text={w.text} size={w.size} f={f} start={w.start} len={w.len} maxW={inkW(w.text, w.size) + 30}/>
            </g>
          );
        })}
      </g>
      <Pencil x={pen.px} y={pen.py} rot={pen.rot}/>
      {/* the path with three stops */}
      <g opacity={a0}>
        <path d={`M${roadPts.join(" L")}`} fill="none" stroke="#6e4a26" strokeWidth={58} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} transform="translate(0 7)"/>
        <path d={`M${roadPts.join(" L")}`} fill="none" stroke="#7a5630" strokeWidth={56} strokeLinecap="round" strokeLinejoin="round"/>
        <path d={`M${roadPts.join(" L")}`} fill="none" stroke="#e8d3a2" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round"/>
        <path d={`M${roadPts.join(" L")}`} fill="none" stroke="#fff6dc" strokeWidth={4} strokeLinecap="round" strokeDasharray="4 22" opacity={0.8}/>
        <g clipPath="url(#f3s-lit)">
          <path d={`M${roadPts.join(" L")}`} fill="none" stroke="#ffd36a" strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" opacity={0.75} filter="url(#e3-glow-s)"/>
          <path d={`M${roadPts.join(" L")}`} fill="none" stroke="#fff0b0" strokeWidth={8} strokeLinecap="round" strokeDasharray="6 20" strokeDashoffset={-f * 1.4}/>
        </g>
        {boards.map((b, i) => {
          const y = ROADY(b.x), l = b.l, isLit = i === 1;
          return (
            <g key={i}>
              {l > 0.01 && <circle cx={b.x} cy={y} r={82} fill="url(#ak-sunglow)" opacity={l * (0.8 + 0.2 * Math.sin(f / 8))}/>}
              <ellipse cx={b.x} cy={y + 26} rx={54} ry={12} fill="#2a1808" opacity={0.35}/>
              <circle cx={b.x} cy={y} r={34} fill={isLit && l > 0.05 ? "#ffd36a" : "#a8977a"} stroke="#6a4a10" strokeWidth={4} opacity={0.55 + 0.45 * Math.max(l, i === 0 ? 0.4 : 0.2)}/>
              <circle cx={b.x} cy={y} r={14} fill="#7a5630" opacity={0.75}/>
              <g opacity={bA} transform={`translate(0 ${(1 - bA) * 14})`}>
                <rect x={b.x - 5} y={y - 100} width={10} height={70} fill="#7a5630" stroke="#4e361c" strokeWidth={2}/>
                <g filter="url(#e3-sh-s)">
                  <rect x={b.x - 210} y={y - 232} width={420} height={136} rx={18} fill={isLit ? "#fff1c4" : "#efe4cc"} stroke={isLit ? "#c9922a" : "#a8977a"} strokeWidth={4} opacity={isLit ? 1 : 0.88}/>
                  <rect x={b.x - 198} y={y - 220} width={396} height={112} rx={11} fill="none" stroke={isLit ? "#e6b24a" : "#c8b99a"} strokeWidth={1.6}/>
                  <text x={b.x} y={y - 178} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={38} letterSpacing={8} fill={isLit ? "#8a4a08" : "#6a5a44"} opacity={isLit ? 1 : 0.85}>{b.head}</text>
                  {isLit && b.rest ? <text x={b.x} y={y - 128} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={36} fill="#5e2a0e">{b.rest}</text> : null}
                  {i === 0 ? <Tick x={b.x - 20} y={y - 142} k={bA} s={0.9} c="#7aa383"/> : null}
                  {i === 2 ? <path d={`M${b.x - 60},${y - 134} H${b.x + 60}`} stroke="#a8977a" strokeWidth={5} strokeLinecap="round" strokeDasharray="2 14"/> : null}
                </g>
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};

export const PlanLabels: React.FC<AP> = () => null;
export { W, H };

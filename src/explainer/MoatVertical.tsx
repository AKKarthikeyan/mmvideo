// 60-second vertical cut (1080x1920) of "What is a moat?": castle → definition → tea shops → profits get copied → "how long" → what we do.
// Native vertical layouts (not a letterboxed 16:9). Data: public/explainer/vertical/data.json (scripts/explainer/build_vertical.py).
import React from "react";
import {AbsoluteFill, Audio, Composition, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from "remotion";
import {C, COND, TYPE, Drift, HalftoneCutout, Stage, Stamp, Strip, TornCard, VoxDefs, VoxFonts} from "../voxkit";
import {castle} from "./MoatExplainer";
import data from "../../public/explainer/vertical/data.json";

const FPS = 30, W = 1080, H = 1920;
type Beat = {key: string; say: string; sec: number; frames: number; cues: string[]};
const BEATS = (data as any).beats as Beat[];
const TOTAL = (data as any).total as number;
const SANS = "'Helvetica Neue', Arial, sans-serif";
type TFn = (p: string | number, off?: number) => number;
const makeT = (b: Beat): TFn => (p, off = 0) => {
  if (typeof p === "number") return p + off;
  const i = b.say.toLowerCase().indexOf(p.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${p}`);
  return Math.round(b.sec * FPS * i / b.say.length) + off;
};
const pr = (f: number, a: number, d: number) => interpolate(f, [a, a + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

const Board: React.FC<{b: Beat; children?: React.ReactNode}> = ({b, children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
    <VoxDefs/><Stage w={W} h={H}/><Drift frames={b.frames} cx={540} cy={960}>{children}</Drift>
  </svg>
);
const Captions: React.FC<{b: Beat}> = ({b}) => {
  const f = useCurrentFrame();
  const tot = b.cues.reduce((a, c) => a + c.length, 0); let acc = 0; let cur = b.cues[b.cues.length - 1];
  for (const c of b.cues) { acc += c.length; if (f < (acc / tot) * b.sec * FPS) { cur = c; break; } }
  return (
    <div style={{position: "absolute", left: 60, right: 60, bottom: 300, display: "flex", justifyContent: "center"}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 50, lineHeight: 1.25, textAlign: "center", color: C.ink, background: "rgba(247,243,234,0.95)", padding: "12px 26px", borderRadius: 8}}>{cur}</div>
    </div>
  );
};
type KLine = {t: string; at: string | number; em?: boolean; size?: number};
const Kinetic: React.FC<{b: Beat; T: TFn; lines: KLine[]}> = ({b, T, lines}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Board b={b}/>
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", padding: "0 70px 180px"}}>
        {lines.map((ln, li) => {
          const size = ln.size ?? Math.min(150, 940 / (ln.t.length * 0.5));
          const st = T(ln.at); const sp = spring({frame: f - st, fps, config: {damping: 11, stiffness: 170}});
          return <div key={li} style={{fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: ln.em ? C.red : C.ink, textAlign: "center",
            opacity: f >= st ? 1 : 0, transform: `translateY(${(1 - sp) * 60}px) scale(${0.8 + 0.2 * sp})`}}>{ln.t}</div>;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; start: number; color?: string}> = ({x1, y1, x2, y2, start, color = C.red}) => {
  const f = useCurrentFrame(); const p = pr(f, start, 12);
  if (p <= 0) return null;
  const x = x1 + (x2 - x1) * p, y = y1 + (y2 - y1) * p; const a = Math.atan2(y2 - y1, x2 - x1);
  return <g><line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={10} strokeLinecap="round"/>
    <path d={`M ${x} ${y} l ${-36 * Math.cos(a - 0.45)} ${-36 * Math.sin(a - 0.45)} M ${x} ${y} l ${-36 * Math.cos(a + 0.45)} ${-36 * Math.sin(a + 0.45)}`} stroke={color} strokeWidth={10} strokeLinecap="round"/></g>;
};
const Note: React.FC<{text: string}> = ({text}) => <text x={540} y={300} textAnchor="middle" fontFamily={TYPE} fontSize={34} fill={C.ink} opacity={0.75}>{text}</text>;
const Title: React.FC<{text: string}> = ({text}) => <Strip x={540} y={400} start={0} text={text} size={70}/>;

type SP = {b: Beat; T: TFn};
const V1: React.FC<SP> = ({b, T}) => {
  const f = useCurrentFrame(); const w = pr(f, T("a moat", -4), 16);
  return (<Board b={b}>
    <Title text="WHAT IS A MOAT?"/>
    <line x1={20} y1={1120} x2={1060} y2={1120} stroke={C.ink} strokeWidth={5}/>
    <HalftoneCutout d={castle} start={2} x={-420} y={420}/>
    <g opacity={w}>
      <rect x={60 + (1 - w) * 480} y={1125} width={960 * w} height={150} fill={C.gray}/>
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M 90 ${1155 + k * 32} q 40 -18 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} fill="none" stroke={C.white} strokeWidth={4} opacity={0.8}/>)}
    </g>
    <Strip x={540} y={1370} start={T("ring of deep water")} text="THE MOAT" size={76} fill={C.mustard}/>
    <Arrow x1={30} y1={880} x2={150} y2={1060} start={T("Attackers")}/>
    <Arrow x1={1050} y1={880} x2={930} y2={1060} start={T("Attackers", 6)}/>
    <Stamp x={540} y={640} start={T("cannot simply")} text="KEPT OUT" size={80}/>
  </Board>);
};
const K2: React.FC<SP> = ({b, T}) => <Kinetic b={b} T={T} lines={[
  {t: "IN BUSINESS,", at: "In business", size: 110}, {t: "A MOAT", at: "a moat is", size: 130}, {t: "STOPS COMPETITORS", at: "It is whatever", em: true, size: 110},
  {t: "FROM TAKING", at: "from taking", size: 110}, {t: "CUSTOMERS", at: "customers", em: true, size: 130}, {t: "& PROFITS", at: "and its profits", em: true, size: 130}]}/>;
const Shop: React.FC<{x: number; start: number; label: string; fill?: string}> = ({x, start, label, fill}) => (
  <TornCard x={x} y={640} w={300} h={260} start={start} fill={fill}>
    <text x={150} y={80} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={label.length > 7 ? 48 : 56} fill={C.ink}>{label}</text>
    <rect x={105} y={120} width={80} height={90} rx={8} fill="none" stroke={C.ink} strokeWidth={7}/>
    <path d="M 185 140 q 40 0 40 25 q 0 25 -40 25" fill="none" stroke={C.ink} strokeWidth={7}/>
  </TornCard>
);
const V2: React.FC<SP> = ({b, T}) => {
  const f = useCurrentFrame(); const move = pr(f, T("Shop A's customers", 6), 34);
  const dots = (x0: number, mv: number, tx: number) => Array.from({length: 6}, (_, i) => {
    const bx = x0 + (i % 3) * 70, by = 1000 + Math.floor(i / 3) * 70;
    return <circle key={i} cx={bx + (tx - x0) * mv} cy={by} r={24} fill={C.ink} opacity={pr(f, T("Two tea shops", 10 + i * 2), 6)}/>;
  });
  return (<Board b={b}>
    <Note text="MADE-UP EXAMPLE"/>
    <Title text="TWO TEA SHOPS"/>
    <Shop x={30} start={T("Two tea shops")} label="SHOP A"/>
    <Shop x={750} start={T("Two tea shops", 8)} label="SHOP B"/>
    <Shop x={390} start={T("a new shop opens")} label="NEW SHOP" fill={C.white}/>
    <Strip x={540} y={560} start={T("two rupees cheaper")} text="₹2 CHEAPER" size={64} fill={C.red} color={C.white}/>
    {dots(110, move, 470)}
    {dots(830, 0, 830)}
    <Stamp x={260} y={1260} start={T("walk over", 20)} text="CUSTOMERS LEFT" size={40}/>
    <Stamp x={830} y={1290} start={T("customers stay")} text="CUSTOMERS STAYED" size={40} rot={6}/>
  </Board>);
};
const V4: React.FC<SP> = ({b, T}) => {
  const steps: [string, string, boolean][] = [["GOOD PROFITS", "earns good profits", false], ["RIVALS COPY", "copy it", false], ["PRICES CUT", "cut prices", false], ["PROFITS SHRINK", "profits shrink", true]];
  return (<Board b={b}>
    <Title text="WHY DOES IT MATTER?"/>
    {steps.map(([t, at, red], i) => <React.Fragment key={t}>
      <Strip x={540} y={580 + i * 190} start={T(at)} text={t} size={74} fill={red ? C.red : C.white} color={red ? C.white : C.ink} rot={i % 2 ? 1.5 : -1.5}/>
      {i < 3 && <Arrow x1={540} y1={640 + i * 190} x2={540} y2={715 + i * 190} start={T(steps[i + 1][1], -8)} color={C.ink}/>}
    </React.Fragment>)}
    <Stamp x={540} y={1400} start={T("Without a moat")} text="NO MOAT = THIS HAPPENS" size={58}/>
  </Board>);
};
const K4: React.FC<SP> = ({b, T}) => <Kinetic b={b} T={T} lines={[{t: "NOT HOW MUCH", at: "Not how much", size: 130}, {t: "BUT HOW", at: "But how long", size: 150}, {t: "LONG.", at: "how long", em: true, size: 260}]}/>;
const WE: React.FC<SP> = ({b, T}) => <Kinetic b={b} T={T} lines={[
  {t: "WHAT DO WE DO?", at: 0, size: 110}, {t: "WE READ", at: "reads each", em: true, size: 150}, {t: "WE SCORE", at: "scores its moat", em: true, size: 150}, {t: "WE WATCH", at: "tells you", em: true, size: 150},
  {t: "EVERY DAY, WHAT CHANGED", at: "every day", size: 64}]}/>;
const End: React.FC<SP> = ({b, T}) => {
  const f = useCurrentFrame(); const o = pr(f, T("Educational"), 12);
  return (<Board b={b}>
    <Strip x={540} y={820} start={0} text="MOAT & MARGIN" size={120}/>
    <Strip x={540} y={980} start={6} text="RESEARCH FROM THE FILINGS" size={56} fill={C.mustard}/>
    <text x={540} y={1180} textAnchor="middle" fontFamily={TYPE} fontSize={34} fill={C.ink} opacity={o}>Educational research, not investment advice.</text>
    <text x={540} y={1235} textAnchor="middle" fontFamily={TYPE} fontSize={28} fill={C.ink} opacity={o}>Not a SEBI-registered Research Analyst</text>
    <text x={540} y={1275} textAnchor="middle" fontFamily={TYPE} fontSize={28} fill={C.ink} opacity={o}>or Investment Adviser.</text>
  </Board>);
};
const SCENES: Record<string, React.FC<SP>> = {v1: V1, k2: K2, v2: V2, v4: V4, k4: K4, we: WE, end: End};

export const MoatVertical: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill style={{background: C.tan}}>
      <VoxFonts/>
      {BEATS.map((b) => {
        const from = at; at += b.frames; const S = SCENES[b.key]; const T = makeT(b);
        return (
          <Sequence key={b.key} from={from} durationInFrames={b.frames}>
            <S b={b} T={T}/>
            {b.key.startsWith("v") && <Captions b={b}/>}
            <Audio src={staticFile(`explainer/vertical/${b.key}.mp3`)}/>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const MoatVerticalComposition: React.FC = () => (
  <Composition id="MoatExplainer-vertical" component={MoatVertical} durationInFrames={TOTAL} fps={FPS} width={W} height={H}/>
);

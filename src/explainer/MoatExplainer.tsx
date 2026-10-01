// "What is a moat?" simplified explainer (1920x1080): Vox collage scenes for the story, kinetic type for the key lines.
// One idea per scene, plain words, burned-in captions on the Vox scenes. Data: public/explainer/data.json (scripts/explainer/build_explainer.py).
import React from "react";
import {AbsoluteFill, Audio, Composition, Sequence, Still, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from "remotion";
import {C, COND, TYPE, Drift, HalftoneCutout, Stage, Stamp, Strip, TornCard, TypeLabel, VoxDefs, VoxFonts, Counter} from "../voxkit";
import data from "../../public/explainer/data.json";

const FPS = 30;
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

// ---------- shared ----------
const Board: React.FC<{b: Beat; children: React.ReactNode}> = ({b, children}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute"}}>
    <VoxDefs/><Stage w={1920} h={1080}/><Drift frames={b.frames} cx={960} cy={540}>{children}</Drift>
  </svg>
);
const Captions: React.FC<{b: Beat}> = ({b}) => {
  const f = useCurrentFrame();
  const tot = b.cues.reduce((a, c) => a + c.length, 0); let acc = 0; let cur = b.cues[b.cues.length - 1];
  for (const c of b.cues) { acc += c.length; if (f < (acc / tot) * b.sec * FPS) { cur = c; break; } }
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center"}}>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.ink, background: "rgba(247,243,234,0.95)", padding: "10px 26px", borderRadius: 6}}>{cur}</div>
    </div>
  );
};
// kinetic lines: each line arrives word by word when its phrase is spoken; emphasis words in red
type KLine = {t: string; at: string | number; em?: string[]; size?: number};
const Kinetic: React.FC<{b: Beat; lines: KLine[]; T: TFn}> = ({b, lines, T}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Board b={b}><g/></Board>
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", padding: "0 140px 60px"}}>
        {lines.map((ln, li) => {
          const size = ln.size ?? Math.min(150, 1640 / (ln.t.length * 0.5));
          const s0 = T(ln.at);
          return (
            <div key={li} style={{display: "flex", gap: size * 0.26, justifyContent: "center", lineHeight: 1.08}}>
              {ln.t.split(" ").map((w, i) => {
                const st = s0 + i * 4;
                const sp = spring({frame: f - st, fps, config: {damping: 11, stiffness: 170}});
                const em = (ln.em || []).some((e) => w.replace(/[^A-Z0-9&₹]/gi, "").toUpperCase() === e);
                return <span key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: em ? size * 1.12 : size, color: em ? C.red : C.ink,
                  opacity: f >= st ? 1 : 0, display: "inline-block", transform: `translateY(${(1 - sp) * 50}px) scale(${0.8 + 0.2 * sp})`}}>{w}</span>;
              })}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; start: number; color?: string}> = ({x1, y1, x2, y2, start, color = C.red}) => {
  const f = useCurrentFrame(); const p = pr(f, start, 12);
  if (p <= 0) return null;
  const x = x1 + (x2 - x1) * p, y = y1 + (y2 - y1) * p; const a = Math.atan2(y2 - y1, x2 - x1);
  return <g><line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={9} strokeLinecap="round"/>
    <path d={`M ${x} ${y} l ${-34 * Math.cos(a - 0.45)} ${-34 * Math.sin(a - 0.45)} M ${x} ${y} l ${-34 * Math.cos(a + 0.45)} ${-34 * Math.sin(a + 0.45)}`} stroke={color} strokeWidth={9} strokeLinecap="round"/></g>;
};
const Note: React.FC<{text: string}> = ({text}) => <text x={1860} y={70} textAnchor="end" fontFamily={TYPE} fontSize={28} fill={C.ink} opacity={0.75}>{text}</text>;

// ---------- scenes ----------
type SP = {b: Beat; T: TFn};
const K1: React.FC<SP> = ({b, T}) => <Kinetic b={b} T={T} lines={[
  {t: "1. WHAT IS A MOAT?", at: "What is a moat", size: 120}, {t: "2. WHY DOES IT MATTER?", at: "Why does it", size: 120},
  {t: "3. WHAT DO WE DO?", at: "what do we do", size: 120}]}/>;

export const castle = (() => {
  const tower = (x0: number, x1: number, top: number) => {
    let d = `L ${x0} ${top}`; const n = 4, w = (x1 - x0) / (2 * n - 1);
    for (let i = 0; i < 2 * n - 1; i++) d += i % 2 === 0 ? ` L ${x0 + (i + 1) * w} ${top}` : ` L ${x0 + i * w} ${top + 34} L ${x0 + (i + 1) * w} ${top + 34} L ${x0 + (i + 1) * w} ${top}`;
    return d;
  };
  return `M 690 700 ${tower(690, 850, 330)} L 850 440 ${tower(850, 1070, 440).replace(/^L 850 440/, "")} L 1070 330 ${tower(1070, 1230, 330).replace(/^L 1070 330/, "")} L 1230 700 Z`;
})();
const V1: React.FC<SP> = ({b, T}) => {
  const f = useCurrentFrame(); const w = pr(f, T("a moat", -4), 16);
  const water = <g opacity={w}>
    <rect x={420 + (1 - w) * 500} y={705} width={1080 * w} height={120} fill={C.gray}/>
    {[0, 1, 2].map((k) => <path key={k} d={`M ${460} ${735 + k * 32} q 40 -18 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} fill="none" stroke={C.white} strokeWidth={4} opacity={0.8}/>)}
  </g>;
  return (<Board b={b}>
    <line x1={60} y1={700} x2={1860} y2={700} stroke={C.ink} strokeWidth={5}/>
    <HalftoneCutout d={castle} start={2}/>
    {water}
    <Strip x={960} y={900} start={T("ring of deep water")} text="THE MOAT" size={70} fill={C.mustard}/>
    <Arrow x1={60} y1={600} x2={390} y2={640} start={T("Attackers")}/>
    <Arrow x1={1860} y1={600} x2={1530} y2={640} start={T("Attackers", 6)}/>
    <Stamp x={960} y={200} start={T("cannot simply")} text="KEPT OUT" size={80}/>
  </Board>);
};
const K2: React.FC<SP> = ({b, T}) => <Kinetic b={b} T={T} lines={[
  {t: "IN BUSINESS, A MOAT", at: "In business", size: 110}, {t: "STOPS COMPETITORS", at: "It is whatever", em: ["STOPS", "COMPETITORS"], size: 130},
  {t: "FROM TAKING YOUR", at: "from taking", size: 110}, {t: "CUSTOMERS & PROFITS", at: "customers", em: ["CUSTOMERS", "&", "PROFITS"], size: 130}]}/>;

const Shop: React.FC<{x: number; start: number; label: string; fill?: string}> = ({x, start, label, fill}) => (
  <TornCard x={x} y={300} w={300} h={260} start={start} fill={fill}>
    <text x={150} y={80} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={56} fill={C.ink}>{label}</text>
    <rect x={105} y={120} width={80} height={90} rx={8} fill="none" stroke={C.ink} strokeWidth={7}/>
    <path d="M 185 140 q 40 0 40 25 q 0 25 -40 25" fill="none" stroke={C.ink} strokeWidth={7}/>
    <path d="M 125 110 q 10 -20 0 -35 M 155 110 q 10 -20 0 -35" fill="none" stroke={C.ink} strokeWidth={4} opacity={0.6}/>
  </TornCard>
);
const V2: React.FC<SP> = ({b, T}) => {
  const f = useCurrentFrame();
  const move = pr(f, T("Shop A's customers", 6), 34);
  const dots = (x0: number, mv: number, tx: number) => Array.from({length: 6}, (_, i) => {
    const bx = x0 + (i % 3) * 60, by = 640 + Math.floor(i / 3) * 60;
    return <circle key={i} cx={bx + (tx + (i % 3) * 60 - x0) * mv} cy={by} r={20} fill={C.ink} opacity={pr(f, T("Two tea shops", 10 + i * 2), 6)}/>;
  });
  return (<Board b={b}>
    <Note text="MADE-UP EXAMPLE"/>
    <Shop x={180} start={T("Two tea shops")} label="SHOP A"/>
    <Shop x={1440} start={T("Two tea shops", 8)} label="SHOP B"/>
    <Shop x={810} start={T("a new shop opens")} label="NEW SHOP" fill={C.white}/>
    <Strip x={960} y={250} start={T("two rupees cheaper")} text="₹2 CHEAPER" size={64} fill={C.red} color={C.white}/>
    {dots(270, move, 900)}
    {dots(1530, 0, 1530)}
    <Stamp x={330} y={740} start={T("walk over", 20)} text="CUSTOMERS LEFT" size={50}/>
    <Stamp x={1590} y={860} start={T("customers stay")} text="CUSTOMERS STAYED" size={50} rot={6}/>
  </Board>);
};
const V3: React.FC<SP> = ({b, T}) => (
  <Board b={b}>
    <Note text="MADE-UP EXAMPLE"/>
    <Strip x={960} y={160} start={0} text="WHY DOES SHOP B KEEP THEM?" size={70}/>
    <Strip x={960} y={340} start={T("buys milk cheaper")} text="CHEAPER MILK → CAN MATCH ANY PRICE" size={62} rot={-1}/>
    <Strip x={960} y={500} start={T("loyalty card")} text="LOYALTY CARD → COSTLY TO LEAVE" size={62} rot={1}/>
    <Strip x={960} y={660} start={T("only shop open")} text="ONLY SHOP OPEN AT 5 AM" size={62} rot={-0.5}/>
    <Stamp x={960} y={850} start={T("Each of these")} text="EACH ONE IS A MOAT" size={76}/>
  </Board>
);
const K3: React.FC<SP> = ({b, T}) => <Kinetic b={b} T={T} lines={[{t: "WHY DOES A MOAT MATTER?", at: 0, em: ["MATTER?"], size: 140}]}/>;
const XS = [360, 800, 1230, 1580], YS = [260, 420, 580, 740];
const V4: React.FC<SP> = ({b, T}) => {
  const steps: [string, string, boolean][] = [["GOOD PROFITS", "earns good profits", false], ["RIVALS COPY", "copy it", false], ["PRICES CUT", "cut prices", false], ["PROFITS SHRINK", "profits shrink", true]];
  return (<Board b={b}>
    {steps.map(([t, at, red], i) => <React.Fragment key={t}>
      <Strip x={XS[i]} y={YS[i]} start={T(at)} text={t} size={62} fill={red ? C.red : C.white} color={red ? C.white : C.ink}/>
      {i < 3 && <Arrow x1={XS[i] + 60} y1={YS[i] + 60} x2={XS[i + 1] - 120} y2={YS[i + 1] - 55} start={T(steps[i + 1][1], -8)} color={C.ink}/>}
    </React.Fragment>)}
    <Stamp x={560} y={860} start={T("Without a moat")} text="NO MOAT = THIS HAPPENS" size={66}/>
  </Board>);
};
const V5: React.FC<SP> = ({b, T}) => {
  const f = useCurrentFrame();
  const x0 = 260, x1 = 1660, y0 = 730, yTop = 270;
  const no = pr(f, 4, 30), yes = pr(f, T("With a moat"), 40);
  const noPath = `M ${x0} ${yTop + 40} C 600 ${yTop + 40} 700 ${y0 - 60} 1000 ${y0 - 40} L ${x1} ${y0 - 30}`;
  const yesPath = `M ${x0} ${yTop + 40} C 700 ${yTop + 20} 1200 ${yTop + 10} ${x1} ${yTop}`;
  return (<Board b={b}>
    <Note text="ILLUSTRATION, NOT REAL DATA"/>
    <line x1={x0} y1={y0} x2={x1 + 40} y2={y0} stroke={C.ink} strokeWidth={5}/><line x1={x0} y1={y0} x2={x0} y2={yTop - 60} stroke={C.ink} strokeWidth={5}/>
    <text x={x1 + 40} y={y0 + 60} textAnchor="end" fontFamily={COND} fontWeight={700} fontSize={44} fill={C.ink}>YEARS →</text>
    <text x={x0 - 20} y={yTop - 80} fontFamily={COND} fontWeight={700} fontSize={44} fill={C.ink}>PROFITS</text>
    <path d={noPath} fill="none" stroke={C.gray} strokeWidth={12} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - no}/>
    <path d={yesPath} fill="none" stroke={C.red} strokeWidth={14} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - yes}/>
    {no > 0.9 && <text x={1100} y={y0 - 70} fontFamily={COND} fontWeight={700} fontSize={50} fill={C.gray}>NO MOAT</text>}
    {yes > 0.9 && <text x={1300} y={yTop - 30} fontFamily={COND} fontWeight={700} fontSize={54} fill={C.red}>WITH A MOAT</text>}
    <Strip x={960} y={880} start={T("long-term investor")} text="WHAT A LONG-TERM INVESTOR WANTS" size={56} fill={C.mustard}/>
  </Board>);
};
const K4: React.FC<SP> = ({b, T}) => <Kinetic b={b} T={T} lines={[{t: "NOT HOW MUCH", at: "Not how much", size: 150}, {t: "BUT HOW LONG.", at: "But how long", em: ["LONG"], size: 170}]}/>;
const K5: React.FC<SP> = ({b, T}) => <Kinetic b={b} T={T} lines={[{t: "WHAT DO WE DO?", at: 0, size: 140},
  {t: "READ · SCORE · WATCH", at: "in three steps", em: ["READ", "SCORE", "WATCH"], size: 120}]}/>;
const StepHead: React.FC<{n: number; word: string}> = ({n, word}) => <>
  <text x={170} y={330} fontFamily={COND} fontWeight={700} fontSize={300} fill={C.mustard}>{n}</text>
  <TypeLabel x={170} y={420} start={0} text={`STEP ${n}: ${word}`} size={48} cps={2}/>
</>;
const Doc: React.FC<{x: number; start: number; label: string; rot: number}> = ({x, start, label, rot}) => (
  <TornCard x={x} y={260} w={330} h={430} start={start} fill={C.white} rot={rot}>
    {Array.from({length: 9}, (_, i) => <rect key={i} x={36} y={110 + i * 30} width={i % 3 === 2 ? 170 : 258} height={10} fill={C.gray} opacity={0.6}/>)}
    <text x={165} y={70} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={label.length > 12 ? 36 : 44} fill={C.ink}>{label}</text>
  </TornCard>
);
const V6: React.FC<SP> = ({b, T}) => (
  <Board b={b}>
    <StepHead n={1} word="READ"/>
    <Doc x={640} start={T("its results")} label="RESULTS" rot={-3}/>
    <Doc x={1010} start={T("annual reports")} label="ANNUAL REPORT" rot={2}/>
    <Doc x={1380} start={T("stock exchange filings")} label="EXCHANGE FILINGS" rot={-1}/>
    <Stamp x={700} y={860} start={T("Not rumours")} text="NO RUMOURS" size={60}/>
    <Stamp x={1250} y={870} start={T("Not tips")} text="NO TIPS" size={60} rot={7}/>
  </Board>
);
const KINDS: [string, string | null][] = [["NETWORK EFFECTS", "better as more people"], ["SWITCHING COSTS", "hard to switch"], ["COST ADVANTAGE", "costs lower"],
  ["PRICING POWER", null], ["BRAND & UNIQUE ASSETS", null], ["EFFICIENT SCALE", null], ["COUNTER-POSITIONING", null]];
const V7: React.FC<SP> = ({b, T}) => {
  const f = useCurrentFrame(); const base = T("seven kinds");
  return (<Board b={b}>
    <StepHead n={2} word="SCORE"/>
    {KINDS.map(([k, at], i) => {
      const hot = at !== null && f >= T(at);
      return <Strip key={k} x={i < 4 ? 900 : 1450} y={200 + (i % 4) * 150} start={base + i * 5} text={k} size={50} fill={hot ? C.red : C.white} color={hot ? C.white : C.ink} rot={i % 2 ? 1 : -1}/>;
    })}
    <Counter x={1450} y={870} start={T("About five hundred")} to={500} prefix="~" size={170} color={C.red}/>
    {f >= T("About five hundred", 10) && <text x={1450} y={940} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={44} fill={C.ink}>INDIAN COMPANIES SCORED</text>}
    {f >= base && <text x={170} y={520} fontFamily={COND} fontWeight={700} fontSize={56} fill={C.ink}>MoatSCORE</text>}
    {f >= base && <text x={170} y={580} fontFamily={TYPE} fontSize={32} fill={C.ink}>7 kinds of moat</text>}
  </Board>);
};
const V8: React.FC<SP> = ({b, T}) => {
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  return (<Board b={b}>
    <StepHead n={3} word="WATCH"/>
    {days.map((d, i) => <TornCard key={d} x={640 + i * 230} y={250} w={200} h={220} start={T("every day", i * 5)} fill={C.white} rot={i % 2 ? 2 : -2}>
      <text x={100} y={70} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={50} fill={C.ink}>{d}</text>
      {[0, 1, 2].map((k) => <rect key={k} x={30} y={110 + k * 30} width={140} height={10} fill={C.gray} opacity={0.6}/>)}
    </TornCard>)}
    <Strip x={1200} y={590} start={T("Daily Filing Digest")} text="DAILY FILING DIGEST: WHAT CHANGED" size={58} fill={C.mustard}/>
    <Stamp x={950} y={820} start={T("stronger")} text="MOAT STRONGER?" size={56}/>
    <Stamp x={1480} y={830} start={T("weaker")} text="MOAT WEAKER?" size={56} rot={6}/>
  </Board>);
};
const K6: React.FC<SP> = ({b, T}) => <Kinetic b={b} T={T} lines={[
  {t: "A MOAT KEEPS COMPETITORS OUT.", at: "A moat keeps", size: 96, em: ["OUT."]},
  {t: "IT DECIDES HOW LONG PROFITS LAST.", at: "It decides", size: 96, em: ["LONG"]},
  {t: "WE READ, SCORE AND WATCH IT.", at: "And we read", size: 96, em: ["READ,", "SCORE", "WATCH"]}]}/>;
const End: React.FC<SP> = ({b, T}) => {
  const f = useCurrentFrame();
  return (<Board b={b}>
    <Strip x={960} y={400} start={0} text="MOAT & MARGIN" size={130}/>
    <Strip x={960} y={560} start={T("Research from")} text="RESEARCH FROM THE FILINGS" size={60} fill={C.mustard}/>
    <text x={960} y={760} textAnchor="middle" fontFamily={TYPE} fontSize={30} fill={C.ink} opacity={pr(f, T("This is educational"), 12)}>Educational research, not investment advice.</text>
    <text x={960} y={810} textAnchor="middle" fontFamily={TYPE} fontSize={30} fill={C.ink} opacity={pr(f, T("This is educational"), 12)}>Moat &amp; Margin is not a SEBI-registered Research Analyst or Investment Adviser.</text>
  </Board>);
};

const SCENES: Record<string, React.FC<SP>> = {k1: K1, v1: V1, k2: K2, v2: V2, v3: V3, k3: K3, v4: V4, v5: V5, k4: K4, k5: K5, v6: V6, v7: V7, v8: V8, k6: K6, end: End};

export const MoatExplainer: React.FC = () => {
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
            <Audio src={staticFile(`explainer/${b.key}.mp3`)}/>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Thumb: React.FC = () => (
  <AbsoluteFill style={{background: C.tan}}>
    <VoxFonts/>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: "absolute"}}>
      <VoxDefs/><Stage w={1920} h={1080}/>
      <HalftoneCutout d={castle} start={-30} x={380} y={60}/>
      <rect x={700} y={765} width={1180} height={110} fill={C.gray}/>
      <Strip x={560} y={330} start={-30} text="WHAT IS" size={130}/>
      <Strip x={560} y={510} start={-30} text="A MOAT?" size={170} fill={C.red} color={C.white}/>
      <Stamp x={560} y={760} start={-30} text="IN PLAIN WORDS" size={70}/>
    </svg>
  </AbsoluteFill>
);

export const ExplainerCompositions: React.FC = () => (
  <>
    <Composition id="MoatExplainer" component={MoatExplainer} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080}/>
    <Still id="MoatExplainer-thumb" component={Thumb} width={1920} height={1080}/>
  </>
);

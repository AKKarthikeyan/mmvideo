// "Letter Reader" style (fund-letter videos; deliberately NOT the Vox collage): cream paper, serif type, blue ink margin rule,
// the real letter page as proof, handwriting only for our own notes. Data from public/letters/<id>/data.json (scripts/letters/build_letters.py).
import React from "react";
import {AbsoluteFill, Audio, Composition, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from "remotion";

export const FPS = 30;
const P = {paper: "#F1E9D8", card: "#FBF7EC", ink: "#1E1A15", blue: "#234E7D", red: "#B3342A", gray: "#7A7266", hl: "#E9C46A"};
const SERIF = "'Iowan Old Style', Charter, Georgia, serif";
const HAND = "Virgil, 'Bradley Hand', cursive";

export type LBeat = {key: string; say: string; cap: string; sec: number; cues: string[]; scene: any};
export type LData = {id: string; title: string; beats: LBeat[]; clips: Record<string, {w: number; h: number; hl: number[][]; page: number}>};

const END_FRAMES = 4 * FPS;
export const beatFrames = (b: LBeat) => Math.ceil((b.sec + 0.45) * FPS);
export const shortTotal = (D: LData) => D.beats.reduce((a, b) => a + beatFrames(b), 0) + END_FRAMES;

const makeT = (b: LBeat) => (x: string | number, off = 0) => {
  if (typeof x === "number") return x + off;
  const i = b.say.toLowerCase().indexOf(String(x).toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${x}`);
  return Math.round(b.sec * FPS * i / b.say.length) + off;
};
const ease = Easing.out(Easing.cubic);
const prog = (f: number, start: number, dur: number) => interpolate(f, [start, start + dur], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});

const Fonts: React.FC = () => <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>;

const wrap = (text: string, max: number) => {
  const out: string[] = []; let cur = "";
  for (const w of text.split(" ")) { if ((cur + " " + w).trim().length > max) { out.push(cur.trim()); cur = w; } else cur += " " + w; }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

// ---------- page furniture ----------
const Paper: React.FC<{n: number; children: React.ReactNode}> = ({n, children}) => {
  const f = useCurrentFrame();
  const z = 1 + 0.025 * (f / Math.max(1, n));
  return (
    <AbsoluteFill style={{background: P.paper}}>
      <svg width={1080} height={1920} style={{position: "absolute"}}>
        <defs>
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
            <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 0.16 0"/></filter>
          <filter id="cardshadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#3a2d14" floodOpacity="0.28"/></filter>
        </defs>
        <rect width={1080} height={1920} filter="url(#grain)"/>
        <line x1={70} y1={0} x2={70} y2={1920} stroke={P.red} strokeWidth={2} opacity={0.35}/>
        <line x1={78} y1={0} x2={78} y2={1920} stroke={P.red} strokeWidth={1} opacity={0.25}/>
      </svg>
      <div style={{position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "50% 45%"}}>{children}</div>
    </AbsoluteFill>
  );
};
const Head: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 14);
  return (
    <div style={{position: "absolute", left: 110, right: 70, top: 130, opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}>
      <div style={{fontFamily: SERIF, fontSize: 26, letterSpacing: 6, color: P.gray}}>NOMAD LETTERS · NICK SLEEP</div>
      <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: text.length > 24 ? 60 : 72, lineHeight: 1.05, color: P.blue, marginTop: 14}}>{text}</div>
      <div style={{height: 5, width: 150 * p, background: P.blue, marginTop: 18}}/>
    </div>
  );
};
const Caption: React.FC<{b: LBeat}> = ({b}) => {
  const f = useCurrentFrame();
  const cues = b.cues; const tot = cues.reduce((a, c) => a + c.length, 0);
  let acc = 0, cur = cues[cues.length - 1];
  for (const c of cues) { const s = (acc / tot) * b.sec * FPS; acc += c.length; if (f < (acc / tot) * b.sec * FPS) { cur = c; break; } void s; }
  return (
    <div style={{position: "absolute", left: 100, right: 60, bottom: 110, display: "flex", justifyContent: "center"}}>
      <div style={{fontFamily: SERIF, fontSize: 40, lineHeight: 1.25, color: P.ink, background: "rgba(251,247,236,0.92)", padding: "14px 26px", borderRadius: 6, textAlign: "center", border: `1px solid ${P.gray}55`}}>{cur}</div>
    </div>
  );
};
const Src: React.FC<{text: string; y: number}> = ({text, y}) => (
  <div style={{position: "absolute", left: 110, right: 70, top: y, fontFamily: SERIF, fontStyle: "italic", fontSize: 27, color: P.gray}}>{text}</div>
);

// ---------- the real page clipping with a highlight band ----------
const Clip: React.FC<{D: LData; b: LBeat; y: number; maxH: number; T: (x: any, o?: number) => number}> = ({D, b, y, maxH, T}) => {
  const f = useCurrentFrame();
  const s = b.scene; const c = D.clips[s.clip];
  if (!c) return null;
  const maxW = 900; const k = Math.min(maxW / c.w, maxH / c.h);
  const w = c.w * k, h = c.h * k;
  const p = prog(f, 4, 16);
  const start = T(s.at ?? 0);
  return (
    <div style={{position: "absolute", left: 110 + (maxW - w) / 2, top: y, width: w, height: h, opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(-0.5deg)`, filter: "drop-shadow(0 10px 14px rgba(58,45,20,0.3))", background: P.card}}>
      <img src={staticFile(`letters/${D.id}/clips/${s.clip}.png`)} style={{width: w, height: h, display: "block"}}/>
      {c.hl.map((r, i) => {
        const bp = prog(f, start + i * 6, 14);
        return <div key={i} style={{position: "absolute", left: r[0] * w, top: r[1] * h, width: r[2] * w * bp, height: r[3] * h, background: P.hl, opacity: 0.5, mixBlendMode: "multiply"}}/>;
      })}
    </div>
  );
};
const clipBox = (D: LData, b: LBeat, maxH: number) => {
  const c = D.clips[b.scene.clip]; if (!c) return 0;
  return c.h * Math.min(900 / c.w, maxH / c.h);
};

// ---------- scenes ----------
type SP = {D: LData; b: LBeat; T: (x: any, o?: number) => number};

const Quote: React.FC<SP> = ({D, b, T}) => {
  const f = useCurrentFrame(); const s = b.scene;
  const size = s.q.length > 90 ? 56 : s.q.length > 40 ? 68 : 90;
  const lines = wrap("“" + s.q + "”", Math.floor(900 / (size * 0.5)));
  const words = lines.join(" ").split(" ");
  const qEnd = T(s.qat ?? 0, 34), qs = 22, gapF = Math.max(2, (qEnd - qs) / Math.max(1, words.length));
  const ch = 420; const chH = clipBox(D, b, 560);
  return (<>
    <div style={{position: "absolute", left: 110, width: 900, top: 380, height: 520, display: "flex", alignItems: "center"}}>
      <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: size, lineHeight: 1.18, color: P.ink}}>
        {words.map((w, i) => {
          const p = prog(f, qs + i * gapF, 10);
          return <span key={i} style={{opacity: p, display: "inline-block", transform: `translateY(${(1 - p) * 12}px)`, marginRight: size * 0.28}}>{w}</span>;
        })}
      </div>
    </div>
    <Clip D={D} b={b} y={1010} maxH={560} T={T}/>
    <Src text={s.src} y={1010 + Math.max(chH, 120) + 28}/>
    <span style={{display: "none"}}>{ch}</span>
  </>);
};

const Stat: React.FC<SP> = ({D, b, T}) => {
  const f = useCurrentFrame(); const s = b.scene;
  const a = prog(f, T(s.at), 40), c = prog(f, T(s.at2), 30);
  const Col = (x: number, val: number, p: number, label: string, col: string) => (
    <div style={{position: "absolute", left: x, width: 440, top: 470, textAlign: "center"}}>
      <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 108, color: col, lineHeight: 1}}>−{(val * p).toFixed(1)}%</div>
      <div style={{fontFamily: SERIF, fontSize: 34, letterSpacing: 6, color: P.gray, marginTop: 14}}>{label}</div>
    </div>);
  return (<>
    {Col(100, s.n1, a, s.l1, P.red)}{Col(550, s.n2, c, s.l2, P.blue)}
    <div style={{position: "absolute", left: 110, top: 720, width: 900, textAlign: "center", fontFamily: HAND, fontSize: 40, color: P.blue, opacity: prog(f, T(s.at2, 30), 14)}}>calendar year 2008</div>
    <Clip D={D} b={b} y={900} maxH={520} T={T}/>
    <Src text={s.src} y={900 + clipBox(D, b, 520) + 28}/>
  </>);
};

const Bars: React.FC<SP> = ({D, b, T}) => {
  const f = useCurrentFrame(); const s = b.scene;
  const p1 = prog(f, 14, 26), p2 = prog(f, T(s.at2, -20), 24);
  const base = 900, top = 420, hgt = base - top;
  const rival = hgt, cost = hgt * 0.58, margin = hgt * 0.16;
  return (<>
    <svg width={1080} height={1920} style={{position: "absolute"}}>
      <line x1={130} y1={base} x2={950} y2={base} stroke={P.ink} strokeWidth={3}/>
      <rect x={200} y={base - rival * p1} width={260} height={rival * p1} fill="none" stroke={P.ink} strokeWidth={4}/>
      <rect x={200} y={base - rival * p1} width={260} height={rival * p1} fill={P.ink} opacity={0.08}/>
      <rect x={620} y={base - cost * p2} width={260} height={cost * p2} fill={P.blue} opacity={0.85}/>
      <rect x={620} y={base - (cost + margin) * p2} width={260} height={margin * p2} fill={P.hl}/>
      <line x1={130} y1={base - rival} x2={950} y2={base - rival} stroke={P.red} strokeWidth={3} strokeDasharray="14 10" opacity={p2}/>
      <text x={330} y={base + 44} textAnchor="middle" fontFamily={SERIF} fontSize={30} fill={P.ink}>RIVAL: COST</text>
      <text x={750} y={base + 44} textAnchor="middle" fontFamily={SERIF} fontSize={30} fill={P.ink}>AMAZON: COST + MARGIN</text>
      <text x={750} y={base - (cost + margin) * p2 - 18} textAnchor="middle" fontFamily={HAND} fontSize={38} fill={P.blue} opacity={p2}>still lower</text>
    </svg>
    <div style={{position: "absolute", left: 110, top: base + 66, width: 900, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 26, color: P.gray}}>Schematic, not to scale. Sleep gives no figures for this comparison.</div>
    <Clip D={D} b={b} y={1060} maxH={330} T={T}/>
    <Src text={s.src} y={1060 + clipBox(D, b, 330) + 24}/>
  </>);
};

const Dots: React.FC<SP> = ({D, b, T}) => {
  const f = useCurrentFrame(); const s = b.scene;
  const start = T(s.at); const n = Math.min(452, Math.floor(Math.max(0, f - start) * 12));
  const cols = 26, gap = 34;
  return (<>
    <svg width={1080} height={1920} style={{position: "absolute"}}>
      {Array.from({length: 452}, (_, i) => {
        const x = 130 + (i % cols) * gap, y = 470 + Math.floor(i / cols) * gap;
        return <circle key={i} cx={x} cy={y} r={11} fill={i < n ? P.blue : "none"} stroke={i < n ? P.blue : P.gray} strokeWidth={1.5} opacity={i < n ? 1 : 0.35}/>;
      })}
    </svg>
    <div style={{position: "absolute", left: 110, width: 900, top: 470 + 18 * gap + 20, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 88, color: P.blue}}>{n} goals</div>
    <Clip D={D} b={b} y={1290} maxH={200} T={T}/>
    <Src text={s.src} y={1290 + clipBox(D, b, 200) + 22}/>
  </>);
};

const Bulb: React.FC<SP> = ({D, b, T}) => {
  const f = useCurrentFrame(); const s = b.scene;
  const on = f < T(s.off, -4); const glow = on ? 1 : 0;
  const flick = f >= T(s.off, -4) && f < T(s.off, 6) ? (f % 4 < 2 ? 0.7 : 0.2) : glow;
  const amt = prog(f, T(s.off), 24);
  return (<>
    <svg width={1080} height={1920} style={{position: "absolute"}}>
      <defs><radialGradient id="bg"><stop offset="0" stopColor="#FFE9A0" stopOpacity="0.95"/><stop offset="1" stopColor="#FFE9A0" stopOpacity="0"/></radialGradient></defs>
      <circle cx={540} cy={620} r={280} fill="url(#bg)" opacity={flick}/>
      <path d="M 540 470 C 440 470 400 560 430 640 C 450 690 490 710 490 760 L 590 760 C 590 710 630 690 650 640 C 680 560 640 470 540 470 Z" fill={flick > 0.5 ? "#FFE28A" : "none"} stroke={P.ink} strokeWidth={6}/>
      <rect x={492} y={764} width={96} height={22} fill="none" stroke={P.ink} strokeWidth={5}/><rect x={500} y={790} width={80} height={22} fill="none" stroke={P.ink} strokeWidth={5}/>
      <path d="M 510 640 L 525 590 L 540 640 L 555 590 L 570 640" fill="none" stroke={P.ink} strokeWidth={4} opacity={flick > 0.5 ? 1 : 0.4}/>
    </svg>
    <div style={{position: "absolute", left: 110, width: 900, top: 850, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 100, color: P.blue, opacity: amt}}>$20,000 a year</div>
    <div style={{position: "absolute", left: 110, width: 900, top: 985, textAlign: "center", fontFamily: HAND, fontSize: 40, color: P.blue, opacity: amt}}>from one light bulb idea</div>
    <Clip D={D} b={b} y={1100} maxH={330} T={T}/>
    <Src text={s.src} y={1100 + clipBox(D, b, 330) + 24}/>
  </>);
};

const Loop: React.FC<SP> = ({D, b, T}) => {
  const f = useCurrentFrame(); const s = b.scene;
  const start = T(s.at, -6); const t = Math.max(0, f - start);
  const cx = 585, cy = 640, R = 185;
  const nodes = [["Scale savings", 0], ["Lower prices", 1], ["Customers buy more", 2], ["Greater scale", 3]] as const;
  const ang = (i: number) => -Math.PI / 2 + i * Math.PI / 2;
  const total = 4 * Math.PI * R / 2; // half of circumference per quarter arc; draw full circle
  const circ = 2 * Math.PI * R; const draw = Math.min(1, t / 70);
  const pos = (a: number) => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  const dotA = ang(0) + (t / 70) * 2 * Math.PI + (t > 70 ? ((t - 70) / 70) * 2 * Math.PI : 0);
  const [dx, dy] = pos(dotA);
  void total;
  return (<>
    <svg width={1080} height={1920} style={{position: "absolute"}}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={P.blue} strokeWidth={6} strokeDasharray={circ} strokeDashoffset={circ * (1 - draw)} transform={`rotate(-90 ${cx} ${cy})`}/>
      {nodes.map(([label, i]) => {
        const [x, y] = pos(ang(i)); const p = prog(f, start + i * 14, 10);
        const anchor = i === 1 ? "start" : i === 3 ? "end" : "middle";
        const tx = i === 1 ? x + 34 : i === 3 ? x - 34 : x; const ty = i === 0 ? y - 38 : i === 2 ? y + 62 : y + 10;
        return <g key={i} opacity={p}><circle cx={x} cy={y} r={20} fill={P.card} stroke={P.blue} strokeWidth={5}/>
          <text x={tx} y={ty} textAnchor={anchor} fontFamily={SERIF} fontWeight={700} fontSize={36} fill={P.ink}>{label}</text></g>;
      })}
      {t > 20 && <circle cx={dx} cy={dy} r={13} fill={P.red}/>}
    </svg>
    <Clip D={D} b={b} y={1040} maxH={330} T={T}/>
    <Src text={s.src} y={1040 + clipBox(D, b, 330) + 24}/>
  </>);
};

const SCENES: Record<string, React.FC<SP>> = {quote: Quote, stat: Stat, bars: Bars, dots: Dots, bulb: Bulb, loop: Loop};

const Beat: React.FC<{D: LData; b: LBeat}> = ({D, b}) => {
  const T = makeT(b); const S = SCENES[b.scene.type];
  const n = beatFrames(b);
  return (
    <Paper n={n}>
      <Head text={b.scene.head}/>
      <S D={D} b={b} T={T}/>
      <Caption b={b}/>
    </Paper>
  );
};

const End: React.FC = () => {
  const f = useCurrentFrame(); const p = prog(f, 0, 20);
  return (
    <Paper n={END_FRAMES}>
      <div style={{position: "absolute", left: 110, right: 90, top: 560, opacity: p}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 84, color: P.blue, lineHeight: 1.05}}>Moat &amp; Margin</div>
        <div style={{height: 5, width: 150, background: P.blue, margin: "22px 0 34px"}}/>
        <div style={{fontFamily: SERIF, fontSize: 38, lineHeight: 1.4, color: P.ink}}>Every quotation is verbatim from the Nomad Investment Partnership letters, with the period and page shown. Educational research, not investment advice. No company is scored. Moat &amp; Margin is not a SEBI-registered Research Analyst or Investment Adviser.</div>
      </div>
    </Paper>
  );
};

export const LetterShort: React.FC<{D: LData}> = ({D}) => {
  let at = 0;
  return (
    <AbsoluteFill style={{background: P.paper}}>
      <Fonts/>
      <Audio src={staticFile("letters/tick.wav")} volume={0.16}/>
      {D.beats.map((b) => {
        const from = at; at += beatFrames(b);
        return (
          <Sequence key={b.key} from={from} durationInFrames={beatFrames(b)}>
            <Beat D={D} b={b}/>
            <Audio src={staticFile(`letters/${D.id}/${b.key}.mp3`)}/>
          </Sequence>
        );
      })}
      <Sequence from={at} durationInFrames={END_FRAMES}><End/></Sequence>
    </AbsoluteFill>
  );
};

import s1 from "../../public/letters/sleep_s1_lightbulb/data.json";
import s2 from "../../public/letters/sleep_s2_gameover/data.json";
import s3 from "../../public/letters/sleep_s3_walmart/data.json";
const ALL = [s1, s2, s3] as unknown as LData[];

export const LetterCompositions: React.FC = () => (
  <>
    {ALL.map((D) => (
      <Composition key={D.id} id={`LR-${D.id.replace(/_/g, "-")}`} component={LetterShort as any} defaultProps={{D}} durationInFrames={shortTotal(D)} fps={FPS} width={1080} height={1920}/>
    ))}
  </>
);

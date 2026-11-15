// KURZ look, "split" scene (cards builder, 29 Oct 2026): {left: {set, caption, tint?}, right: {set, caption}, disclaimer, discKey}.
// The ending: two windows onto the same morning, side by side, joined by a glowing seam with an egg at its centre.
// Sets drawn here: "village" (a Namakkal dawn: hills, palms, a house with smoke, long sheds, hens), "sheds" (small thatched sheds,
// deep litter, chicks, the vet on his round), "ratesheet" (a table by a window with the morning's rate sheet and a glass of tea).
// tint "sepia" ages a panel and adds its ILLUSTRATIVE pill. At at(discKey) the disclaimer appears, verbatim and small, under the rate sheet.
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {Hen, K, Person, ROUND, SANS, easeIO} from "./kit";
import {EggTex, Grain, RateSheetArt, Space, Tag, clamp, drift, popIn, rng} from "./cards_kit";
import {ArtCtx, toneFn, type Tint} from "./art/base";
import {SETS} from "./art/sets";
import {Person as ArtPerson} from "./art/cast";
import {PropArt} from "./art/props";

type Side = {set: string; caption: string; tint?: "sepia" | "warm"};
type SplitSpec = {left: Side; right: Side; disclaimer: string; discKey: string};
const PW = 840, PH = 580, PY = 150;

const Palm: React.FC<{x: number; y: number; s: number; f: number; c: string; seed: number}> = ({x, y, s, f, c, seed}) =>
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(f / 34 + seed) * 2.2})`}>
    <path d="M -6 0 Q 2 -150 14 -260 L 24 -260 Q 14 -150 8 0 Z" fill={c}/>
    {[-70, -30, 10, 50, 95, 140].map((a, i) => <path key={a} d="M 18 -262 Q 70 -300 120 -262 Q 70 -278 18 -262 Z" fill={c} transform={`rotate(${a + Math.sin(f / 22 + seed + i) * 4} 18 -262)`}/>)}
  </g>;
const Smoke: React.FC<{x: number; y: number; f: number; c?: string}> = ({x, y, f, c = K.white}) => <g>
  {[0, 1, 2, 3].map((i) => { const k = (f / 90 + i / 4) % 1; return <circle key={i} cx={x + Math.sin(f / 30 + i) * 10 + k * 30} cy={y - k * 140} r={10 + k * 22} fill={c} opacity={0.35 * Math.sin(k * Math.PI)}/>; })}
</g>;

const Village: React.FC<{f: number; id: string}> = ({f, id}) => {
  const d = drift(f, 5);
  return <g>
    <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A2C86"/><stop offset="0.45" stopColor={K.purple}/><stop offset="0.75" stopColor={K.pink}/><stop offset="1" stopColor={K.orangeL}/></linearGradient>
      <radialGradient id={`${id}-sun`}><stop offset="0" stopColor={K.yellowL} stopOpacity={0.8}/><stop offset="1" stopColor={K.orange} stopOpacity={0}/></radialGradient></defs>
    <rect width={PW} height={PH} fill={`url(#${id}-sky)`}/>
    <g transform={`translate(${560 + d.x * 0.2} ${360 - easeIO(f, 0, 200) * 40})`}><circle r={260} fill={`url(#${id}-sun)`}/><circle r={58} fill={K.yellow}/><path d="M 0 -58 A 58 58 0 0 1 0 58 Z" fill={K.orange} opacity={0.5}/></g>
    <g transform={`translate(${d.x * 0.3} 0)`}><path d="M -40 380 Q 120 320 260 350 Q 330 290 400 288 Q 470 290 520 340 Q 680 330 880 360 L 880 600 L -40 600 Z" fill="#5A3E8E"/>
      <path d="M 300 330 Q 340 292 400 288 Q 470 290 520 340" fill="none" stroke={K.orangeL} strokeWidth={5} opacity={0.7}/></g>
    <g transform={`translate(${d.x * 0.6} 0)`}>
      <path d="M -40 440 Q 200 400 440 430 T 880 420 L 880 600 L -40 600 Z" fill={K.tealD}/><path d="M -40 440 Q 200 400 440 430 T 880 420" fill="none" stroke={K.teal} strokeWidth={6}/>
      {[[60, 440, 200], [520, 434, 230]].map(([x, y, w], i) => <g key={i} transform={`translate(${x} ${y})`}><rect y={-22} width={w} height={22} fill="#1D2B6E"/>
        <path d={`M -8 -20 L ${w / 2} -42 L ${w + 8} -20 Z`} fill={K.creamD}/><path d={`M ${w / 2} -42 L ${w + 8} -20 L ${w / 2} -20 Z`} fill="#B39470"/></g>)}
      <Palm x={330} y={440} s={0.62} f={f} c="#123B5E" seed={1}/><Palm x={800} y={430} s={0.75} f={f} c="#123B5E" seed={2}/>
    </g>
    <g transform={`translate(${d.x} 0)`}>
      <path d="M -40 500 Q 300 470 600 495 T 880 488 L 880 600 L -40 600 Z" fill={K.deep}/>
      <g transform="translate(120 506)"><rect x={0} y={-90} width={160} height={90} fill={K.cream}/><rect x={100} y={-90} width={60} height={90} fill={K.creamD}/>
        <path d="M -16 -88 L 80 -150 L 176 -88 Z" fill={K.pink}/><path d="M 80 -150 L 176 -88 L 80 -88 Z" fill={K.pinkD}/>
        <rect x={60} y={-56} width={36} height={56} fill={K.orangeD}/><rect x={20} y={-70} width={26} height={24} fill={K.yellowL} opacity={0.85}/>
        <rect x={124} y={-140} width={18} height={40} fill={K.pinkD}/></g>
      <Smoke x={133} y={366} f={f}/>
      <Hen x={480} y={540} s={0.6} f={f} seed={1}/><Hen x={600} y={556} s={0.66} f={f} seed={4} flip/><Hen x={700} y={536} s={0.5} f={f} seed={7}/>
    </g>
  </g>;
};

const Sheds: React.FC<{f: number; id: string}> = ({f, id}) => {
  const d = drift(f, 9), r = rng(14);
  const chicks = Array.from({length: 16}, () => [40 + r() * 760, 470 + r() * 110, r() * 6.28] as const).sort((a, b) => a[1] - b[1]);
  const thatch = (x: number, y: number, w: number) => <g transform={`translate(${x} ${y})`}>
    <rect x={10} y={-90} width={w - 20} height={90} fill="#8C6A44"/><rect x={w / 2} y={-90} width={w / 2 - 10} height={90} fill="#6E5034"/>
    {Array.from({length: Math.floor((w - 40) / 30)}, (_, i) => <rect key={i} x={24 + i * 30} y={-70} width={18} height={50} fill="#3A2A1C" opacity={0.7}/>)}
    <path d={`M -20 -84 L ${w / 2} -170 L ${w + 20} -84 Z`} fill="#D8B26A"/><path d={`M ${w / 2} -170 L ${w + 20} -84 L ${w / 2} -84 Z`} fill="#B38A4A"/>
    {Array.from({length: 12}, (_, i) => <line key={i} x1={w / 2 + (i - 6) * 8} y1={-168} x2={(i / 11) * (w + 40) - 20} y2={-84} stroke="#8C6A3A" strokeWidth={2} opacity={0.5}/>)}
  </g>;
  return <g>
    <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4B5BA8"/><stop offset="0.6" stopColor={K.pink}/><stop offset="1" stopColor={K.orangeL}/></linearGradient></defs>
    <rect width={PW} height={PH} fill={`url(#${id}-sky)`}/>
    <g transform={`translate(${200 + d.x * 0.2} 300)`}><circle r={120} fill={K.yellowL} opacity={0.3}/><circle r={50} fill={K.yellow}/></g>
    <g transform={`translate(${d.x * 0.3} 0)`}><path d="M -40 380 Q 200 330 420 360 T 880 350 L 880 600 L -40 600 Z" fill="#6E4E8E"/></g>
    <g transform={`translate(${d.x * 0.6} 0)`}>
      <path d="M -40 450 Q 300 420 600 445 T 880 440 L 880 600 L -40 600 Z" fill="#B88A55"/>
      {thatch(60, 452, 300)}{thatch(470, 446, 260)}
      <Smoke x={780} y={420} f={f} c={K.cream}/>
    </g>
    <g transform={`translate(${d.x} 0)`}>
      <path d="M -40 470 L 880 460 L 880 600 L -40 600 Z" fill="#D9B77E"/>
      {Array.from({length: 40}, (_, i) => <path key={i} d={`M ${(i * 37) % 860} ${480 + (i * 53) % 110} l 14 -4`} stroke="#A8844E" strokeWidth={3} strokeLinecap="round" opacity={0.7}/>)}
      {chicks.map(([x, y, ph], i) => { const hop = Math.max(0, Math.sin(f / 9 + ph)) ** 3 * 8, sx = Math.sin(ph * 3) > 0 ? 1 : -1;
        return <g key={i} transform={`translate(${x + Math.sin(f / 50 + ph) * 12} ${y - hop}) scale(${sx * 0.9} 0.9)`}>
          <ellipse cx={0} cy={14 + hop} rx={14} ry={3} fill="#000" opacity={0.25}/>
          <circle r={13} fill={K.yellow}/><path d="M 0 -13 A 13 13 0 0 1 0 13 Z" fill={K.orange} opacity={0.45}/><circle cx={9} cy={-11} r={9} fill={K.yellow}/>
          <path d="M 17 -12 L 23 -10 L 17 -7 Z" fill={K.orangeD}/><circle cx={12} cy={-13} r={1.8} fill={K.ink}/>
        </g>; })}
      <Person x={380} y={560} h={250} f={f} color={K.white} shade="#C9D2EE" seed={3}/>
    </g>
  </g>;
};

const Table: React.FC<{f: number; id: string; glow: number}> = ({f, id, glow}) => {
  const d = drift(f, 12);
  return <g>
    <defs><linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={K.soft}/><stop offset="1" stopColor={K.deep}/></linearGradient>
      <radialGradient id={`${id}-glow`}><stop offset="0" stopColor={K.yellowL} stopOpacity={0.45}/><stop offset="1" stopColor={K.yellowL} stopOpacity={0}/></radialGradient>
      <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={K.yellowL} stopOpacity={0.35}/><stop offset="1" stopColor={K.yellowL} stopOpacity={0}/></linearGradient></defs>
    <rect width={PW} height={PH} fill={`url(#${id}-wall)`}/>
    <g transform={`translate(${d.x * 0.3} 0)`}>
      <rect x={560} y={50} width={230} height={250} rx={10} fill={K.orangeL}/><path d="M 560 220 Q 640 190 700 210 T 790 200 L 790 300 L 560 300 Z" fill={K.pink} opacity={0.5}/>
      <rect x={668} y={50} width={14} height={250} fill={K.deep}/><rect x={560} y={168} width={230} height={14} fill={K.deep}/>
      <rect x={550} y={40} width={250} height={270} rx={14} fill="none" stroke={K.deep} strokeWidth={16}/>
    </g>
    <path d="M 560 50 L 790 50 L 520 600 L 120 600 Z" fill={`url(#${id}-beam)`}/>
    <path d="M -20 470 L 860 455 L 860 600 L -20 600 Z" fill="#3A4FB0"/><path d="M -20 470 L 860 455 L 860 466 L -20 482 Z" fill={K.haze}/>
    <g transform={`translate(${330 + d.x * 0.7} ${290 + Math.sin(f / 40) * 4}) scale(0.72)`}>
      <circle r={420} fill={`url(#${id}-glow)`} opacity={0.6 + 0.4 * glow}/>
      <RateSheetArt f={f} id={`${id}-rs`}/>
    </g>
    <g transform={`translate(${690 + d.x * 0.9} 520)`}>
      <ellipse cx={0} cy={6} rx={40} ry={8} fill="#000" opacity={0.3}/>
      <path d="M -32 -96 L 32 -96 L 25 0 L -25 0 Z" fill={K.tealL} opacity={0.35}/><path d="M -30 -66 L 30 -66 L 25 0 L -25 0 Z" fill={K.orangeD}/><path d="M 4 -66 L 30 -66 L 25 0 L 3 0 Z" fill="#9E520A"/>
      {[0, 1, 2].map((i) => { const k = ((f / 70 + i / 3) % 1), y = -100 - k * 110; return <path key={i} d={`M ${-12 + i * 12} ${y + 40} q ${10 + Math.sin(f / 20 + i) * 6} -18 0 -36`} fill="none" stroke={K.white} strokeWidth={5} strokeLinecap="round" opacity={Math.sin(k * Math.PI) * 0.45}/>; })}
    </g>
    {/* a stack of egg trays, the top one full */}
    <g transform={`translate(${60 + d.x * 0.9} 540)`}>
      <ellipse cx={95} cy={4} rx={110} ry={12} fill="#000" opacity={0.3}/>
      {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(0 ${-i * 22})`}>
        <path d="M 0 0 L 190 0 L 182 -20 L 8 -20 Z" fill={i % 2 ? K.creamD : "#D9BE8E"}/><path d="M 110 0 L 190 0 L 182 -20 L 104 -20 Z" fill="#B39470"/>
      </g>)}
      {[0, 1, 2, 3, 4].map((j) => <g key={j} transform={`translate(${24 + j * 36} -98) scale(0.28)`}>
        <path d="M 0 -60 C 34 -60 50 -8 50 18 C 50 48 28 62 0 62 C -28 62 -50 48 -50 18 C -50 -8 -34 -60 0 -60 Z" fill={K.cream}/>
        <path d="M 8 -60 C 34 -50 50 -8 50 18 C 50 48 28 62 0 62 Z" fill={K.creamD}/></g>)}
    </g>
    {/* a phone face down glowing with the morning's message */}
    <g transform={`translate(${520 + d.x * 0.9} 545) rotate(-6)`}>
      <rect x={-6} y={-6} width={112} height={30} rx={10} fill={K.tealL} opacity={0.18 + 0.12 * Math.sin(f / 22)}/>
      <rect x={0} y={0} width={100} height={18} rx={7} fill={K.ink}/><rect x={60} y={0} width={40} height={18} rx={7} fill="#1F2B66"/>
    </g>
  </g>;
};

// The art builder's full-frame sets (art/sets.tsx), framed in the panel. The cast echoes the film's own scenes: the vet among the chicks
// (a015 / c011) and the farmer with his hens (a001 / c001), so the ending calls back to the opening.
const CAST: Record<string, {people: {who: string; x: number; y: number; h: number; flip?: boolean}[]; props: {icon: string; x: number; y: number; s: number}[]}> = {
  sheds: {people: [{who: "vet", x: 1180, y: 900, h: 440, flip: true}], props: [[640, 900], [720, 880], [800, 905], [880, 870], [960, 900], [560, 880]].map(([x, y]) => ({icon: "chick", x, y, s: 0.7}))},
  village: {people: [{who: "farmer", x: 1300, y: 900, h: 440, flip: true}], props: [{icon: "hen", x: 820, y: 880, s: 1.1}, {icon: "hen", x: 980, y: 905, s: 0.95}]},
};
const ArtSet: React.FC<{set: string; f: number; id: string; tint?: Side["tint"]}> = ({set, f, id, tint}) => {
  const S = SETS[set], t: Tint = tint ?? "day";
  const art = React.useMemo(() => ({T: toneFn(t), uid: id, tint: t}), [t, id]);
  const dx = Math.sin(f / 170) * 12 + Math.sin(f / 61) * 2, dy = Math.sin(f / 230 + 1) * 6, push = 1 + 0.04 * easeIO(f, 0, 400);
  const L = (d: number) => `translate(960 640) scale(${1 + (push - 1) * d}) translate(-960 -640) translate(${(dx * d).toFixed(2)} ${(dy * d).toFixed(2)})`;
  const cast = CAST[set] ?? {people: [], props: []};
  return <ArtCtx.Provider value={art}>
    <svg width={PW} height={PH} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{position: "absolute", left: 0, top: 0}}>
      <S.Back f={f} L={L} scroll={0}/>
      <g transform={L(1)}>
        {cast.props.map((p, i) => <g key={`p${i}`} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}><PropArt icon={p.icon} f={f + i * 13} seed={i}/></g>)}
        {cast.people.map((a, i) => <ArtPerson key={`a${i}`} who={a.who as any} x={a.x} y={a.y} h={a.h} f={f} flip={a.flip} seed={i + 2}/>)}
      </g>
      <S.Front f={f} L={L} scroll={0}/>
    </svg>
  </ArtCtx.Provider>;
};

const PanelArt: React.FC<{set: string; f: number; id: string; glow: number}> = ({set, f, id, glow}) =>
  set === "ratesheet" ? <Table f={f} id={id} glow={glow}/> : set === "sheds" ? <Sheds f={f} id={id}/> : set === "village" ? <Village f={f} id={id}/>
    : (() => { throw new Error(`kurz split: no set "${set}"`); })();

const Panel: React.FC<{side: Side; f: number; x: number; t: number; id: string; glow: number}> = ({side, f, x, t, id, glow}) => {
  const sepia = side.tint === "sepia", warm = side.tint === "warm";
  return <div style={{position: "absolute", left: x, top: PY, width: PW, height: PH, opacity: Math.min(1, t * 1.4), transform: `translateY(${(1 - t) * 60}px) scale(${0.94 + 0.06 * Math.min(1, t)})`}}>
    <div style={{position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden", boxShadow: `0 30px 60px rgba(0,0,0,0.45), 0 0 0 4px rgba(255,255,255,0.10)`,
      filter: SETS[side.set] ? undefined : sepia ? "sepia(0.6) saturate(0.8) contrast(0.95)" : warm ? "saturate(1.1) hue-rotate(-8deg)" : undefined}}>
      {SETS[side.set] ? <ArtSet set={side.set} f={f} id={id} tint={side.tint}/>
        : <svg width={PW} height={PH} style={{position: "absolute", left: 0, top: 0}}><PanelArt set={side.set} f={f} id={id} glow={glow}/></svg>}
      <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.18) 100%)"}}/>
    </div>
    {sepia && <div style={{position: "absolute", left: 22, top: 22}}><Tag text="ILLUSTRATIVE" color={K.orange} size={34}/></div>}
  </div>;
};

export const Scene: React.FC<SceneProps<SplitSpec>> = ({f, dur, spec, at}) => {
  const da = at(spec.discKey), dT = popIn(f, da, 110, 15), d = drift(f, 2);
  const lT = popIn(f, 0, 90, 14), rT = popIn(f, 8, 90, 14), cT = (i: number) => popIn(f, 18 + i * 6, 130);
  const push = 1 + 0.035 * easeIO(f, 0, Math.max(dur, 200));
  const LX = 96, RX = 1920 - 96 - PW;
  const seamT = clamp((f - 10) / 30, 0, 1);
  return <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "50% 45%"}}>
      <Space f={f} id="ksp" seed={41} cx={0.5} cy={0.4} stars={0.8}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <defs><linearGradient id="ksp-seam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.yellowL} stopOpacity={0}/><stop offset="0.5" stopColor={K.yellowL} stopOpacity={0.9}/><stop offset="1" stopColor={K.yellowL} stopOpacity={0}/></linearGradient></defs>
        <rect x={958} y={PY + PH / 2 - (PH / 2 + 40) * seamT} width={4} height={(PH + 80) * seamT} fill="url(#ksp-seam)"/>
        <rect x={948} y={PY + PH / 2 - (PH / 2 + 40) * seamT} width={24} height={(PH + 80) * seamT} fill="url(#ksp-seam)" opacity={0.25}/>
      </svg>
      <Panel side={spec.left} f={f} x={LX + d.x * 0.15} t={lT} id="ksp-l" glow={0}/>
      <Panel side={spec.right} f={f} x={RX + d.x * 0.15} t={rT} id="ksp-r" glow={spec.right.set === "ratesheet" ? dT : 0}/>
      <svg width={120} height={140} style={{position: "absolute", left: 900, top: PY + PH / 2 - 70, overflow: "visible", opacity: Math.min(1, seamT * 1.5)}}>
        <circle cx={60} cy={70} r={70} fill={K.yellowL} opacity={0.18 + 0.05 * Math.sin(f / 30)}/>
        <g transform={`translate(60 ${70 + Math.sin(f / 26) * 4}) scale(0.8)`}><EggTex f={f} id="ksp-egg"/></g>
      </svg>
    </div>
    {[spec.left, spec.right].map((s, i) => { const t = cT(i);
      return <div key={i} style={{position: "absolute", left: (i ? RX : LX) + 10, width: PW - 20, top: PY + PH + 34, textAlign: "center", fontFamily: ROUND, fontWeight: 800, fontSize: 44,
        lineHeight: 1.1, color: K.white, opacity: Math.min(1, t * 1.3), transform: `translateY(${(1 - t) * 20}px)`, textShadow: "0 4px 20px rgba(0,0,0,0.6)"}}>{s.caption}</div>; })}
    <div style={{position: "absolute", left: RX, width: PW, top: PY + PH + 104, display: "flex", justifyContent: "center", opacity: Math.min(1, dT * 1.2), transform: `translateY(${(1 - dT) * 14}px)`}}>
      {dT > 0.001 && <div style={{fontFamily: SANS, fontStyle: "italic", fontWeight: 700, fontSize: 36, color: K.cream, background: "rgba(11,20,51,0.7)", padding: "8px 24px", borderRadius: 14,
        boxShadow: "0 0 0 2px rgba(255,255,255,0.08)", whiteSpace: "nowrap"}}>“{spec.disclaimer}”</div>}
    </div>
    <Grain id="ksp"/>
  </AbsoluteFill>;
};

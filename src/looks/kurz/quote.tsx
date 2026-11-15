// KURZ look, "quote" scene (cards builder, 29 Oct 2026): {quote, who, role?, kind: "study"|"slogan"|"recollection", key}.
// The quote is printed verbatim between typographic quotes and comes in word by word from at(key). Each kind has its own staging:
//   study         a research paper floating under a lamp with a lens passing over it; the who line is a document chip
//   slogan        a cloth banner waving in warm light with marigold petals; the quote is printed on the banner
//   recollection  a soft portrait silhouette marked ILLUSTRATIVE beside the quote
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {K, ROUND, SANS, easeIO} from "./kit";
import {Grain, Space, Tag, clamp, drift, fitPx, popIn, rng} from "./cards_kit";

type QuoteSpec = {quote: string; who: string; role?: string; kind: "study" | "slogan" | "recollection"; key: string};

// Words fade and rise in from `a`, 2.6 frames apart. The quote marks hang outside the text block.
const Words: React.FC<{text: string; f: number; a: number; px: number; color: string; center?: boolean; mark?: string}> = ({text, f, a, px, color, center, mark = K.yellow}) => {
  const words = text.split(" ");
  const wordT = (i: number) => clamp((f - a - i * 2.6) / 10, 0, 1);
  const q = (side: 0 | 1) => { const t = side ? wordT(words.length - 1) : wordT(0); return <span style={{color: mark, opacity: t, textShadow: mark === K.yellow ? `0 0 30px ${K.yellow}66` : undefined}}>{side ? "”" : "“"}</span>; };
  return <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: px, lineHeight: 1.12, color, letterSpacing: -0.5, textAlign: center ? "center" : "left",
    ...({textWrap: "balance"} as any)}}>
    {q(0)}
    {words.map((w, i) => { const t = wordT(i), e = 1 - (1 - t) ** 3; return <React.Fragment key={i}>
      <span style={{display: "inline-block", opacity: e, transform: `translateY(${(1 - e) * 26}px)`, filter: t < 1 ? `blur(${(1 - e) * 6}px)` : undefined}}>{w}{i === words.length - 1 ? q(1) : null}</span>{i < words.length - 1 ? " " : ""}
    </React.Fragment>; })}
  </div>;
};

const whoLine = (s: QuoteSpec) => (s.role ? `${s.who} · ${s.role}` : s.who);

// ---- study ----------------------------------------------------------------------------------------------------------------------
const PaperArt: React.FC<{f: number}> = ({f}) => {
  const fl = Math.sin(f / 30) * 10, lens = Math.sin(f / 50);
  return <g transform={`translate(0 ${fl}) rotate(${6 + Math.sin(f / 60) * 1.5})`}>
    <rect x={-200 + 26} y={-270 + 30} width={400} height={540} rx={20} fill="#000" opacity={0.3}/>
    <rect x={-216} y={-262} width={400} height={540} rx={20} fill="#E3D2AD" transform="rotate(-5)"/>
    <rect x={-200} y={-270} width={400} height={540} rx={20} fill={K.cream}/>
    <clipPath id="kq-pp"><rect x={-200} y={-270} width={400} height={540} rx={20}/></clipPath>
    <g clipPath="url(#kq-pp)">
      <path d="M 70 -300 L 230 -300 L 230 300 L -40 300 Z" fill={K.creamD} opacity={0.55}/>
      <rect x={-160} y={-230} width={250} height={24} rx={12} fill={K.deep}/>
      <rect x={-160} y={-194} width={170} height={14} rx={7} fill={K.soft} opacity={0.7}/>
      {/* a little bar chart and two columns of text lines: a paper, not readable */}
      {[60, 110, 80, 140, 100].map((h, i) => <rect key={i} x={-150 + i * 34} y={-40 - h} width={24} height={h} rx={5} fill={i === 3 ? K.orange : K.teal} opacity={0.85}/>)}
      <rect x={-160} y={-36} width={180} height={4} rx={2} fill={K.deep} opacity={0.6}/>
      {Array.from({length: 7}, (_, i) => <rect key={i} x={50} y={-170 + i * 22} width={110 - (i % 3) * 18} height={10} rx={5} fill="#CDB88F"/>)}
      {Array.from({length: 9}, (_, i) => <rect key={i} x={-160} y={10 + i * 26} width={[320, 300, 330, 260, 310, 290, 320, 200, 150][i]} height={11} rx={5.5}
        fill={i === 2 || i === 3 ? K.yellow : "#CDB88F"} opacity={i === 2 || i === 3 ? 0.95 : 0.8}/>)}
    </g>
    <g transform={`translate(${lens * 110} ${40 + Math.cos(f / 50) * 40})`}>
      <circle r={74} fill={K.tealL} opacity={0.18}/><circle r={74} fill="none" stroke={K.deep} strokeWidth={14}/><circle r={74} fill="none" stroke={K.haze} strokeWidth={5} transform="translate(-3 -3)"/>
      <path d="M -40 -40 A 56 56 0 0 1 10 -54" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.7}/>
      <rect x={50} y={50} width={30} height={120} rx={14} fill={K.orange} transform="rotate(-45 50 50)"/>
    </g>
  </g>;
};
const Study: React.FC<SceneProps<QuoteSpec>> = ({f, dur, spec, at}) => {
  const a = at(spec.key), d = drift(f, 4), px = Math.round(fitPx(spec.quote, 1080 * 3, 92, 64, 0.5));
  const t0 = popIn(f, 0, 90, 13), chipT = popIn(f, a + 6, 140);
  return <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * easeIO(f, 0, Math.max(dur, 150))})`, transformOrigin: "75% 50%"}}>
      <Space f={f} id="kqs" seed={17} cx={0.78} cy={0.3}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <defs><radialGradient id="kq-lamp" cx="0.5" cy="0"><stop offset="0" stopColor={K.yellowL} stopOpacity={0.35}/><stop offset="1" stopColor={K.yellowL} stopOpacity={0}/></radialGradient></defs>
        {/* a lamp cone from above lights the paper */}
        <path d={`M ${1500 + d.x * 0.4} -20 L ${1180 + d.x * 0.4} 1000 L ${1860 + d.x * 0.4} 1000 Z`} fill="url(#kq-lamp)" opacity={0.9}/>
        {Array.from({length: 18}, (_, i) => { const r = rng(i + 40), x = 1260 + r() * 520, y = ((r() * 900 - f * (0.3 + r() * 0.4)) % 900 + 900) % 900 + 60;
          return <circle key={i} cx={x + Math.sin(f / 30 + i) * 12} cy={y} r={1.5 + r() * 2} fill={K.yellowL} opacity={0.4 * Math.sin((y - 60) / 900 * Math.PI)}/>; })}
        <g transform={`translate(${1500 + d.x * 0.6} ${(1 - t0) * 260 + 470 + d.y * 0.6}) scale(${0.95 * (0.6 + 0.4 * t0)})`} opacity={Math.min(1, t0 * 1.5)}><PaperArt f={f}/></g>
      </svg>
    </div>
    <div style={{position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(11,20,51,0.7) 0%, rgba(11,20,51,0.5) 50%, rgba(11,20,51,0) 68%)"}}/>
    <div style={{position: "absolute", left: 130 + d.x * 0.15, top: 64, height: 840, width: 1080, display: "flex", flexDirection: "column", justifyContent: "center"}}>
      <Words text={spec.quote} f={f} a={a} px={px} color={K.white}/>
      <div style={{marginTop: 44, opacity: Math.min(1, chipT * 1.3), transform: `translateY(${(1 - chipT) * 20}px)`, display: "flex"}}>
        <div style={{display: "inline-flex", alignItems: "center", gap: 18, padding: "12px 30px 12px 16px", borderRadius: 18, background: "rgba(244,247,255,0.94)",
          boxShadow: "0 14px 34px rgba(0,0,0,0.35)", fontFamily: SANS, fontWeight: 800, fontSize: 36, color: K.deep, whiteSpace: "nowrap"}}>
          <svg width={44} height={54} viewBox="0 0 44 54"><path d="M 4 2 L 30 2 L 42 14 L 42 52 L 4 52 Z" fill={K.teal}/><path d="M 30 2 L 30 14 L 42 14 Z" fill={K.tealD}/>
            {[22, 30, 38].map((y) => <rect key={y} x={11} y={y} width={22} height={4} rx={2} fill="#fff"/>)}</svg>
          {whoLine(spec)}
        </div>
      </div>
    </div>
    <Grain id="kqs"/>
  </AbsoluteFill>;
};

// ---- slogan ---------------------------------------------------------------------------------------------------------------------
const Slogan: React.FC<SceneProps<QuoteSpec>> = ({f, dur, spec, at}) => {
  const a = at(spec.key), d = drift(f, 6), unfurl = easeIO(f, 2, 30), whoT = popIn(f, a + spec.quote.split(" ").length * 2.6 + 8, 140);
  const X0 = 170, X1 = 1750, Y0 = 330, Y1 = 660, A = 14;
  const edge = (y: number, ph: number) => Array.from({length: 33}, (_, i) => { const x = X0 + (X1 - X0) * (i / 32) * unfurl;
    const w = Math.sin(i / 32 * Math.PI * 2.2 - f / 14 + ph) * A * (0.3 + 0.7 * i / 32); return `${x.toFixed(1)} ${(y + w).toFixed(1)}`; });
  const shape = `M ${edge(Y0, 0).join(" L ")} L ${edge(Y1, 0.4).reverse().join(" L ")} Z`;
  const r = rng(12), petals = Array.from({length: 30}, () => [r() * 1920, r() * 1200, 0.4 + r() * 0.6, r() * 6.28, r() > 0.5] as const);
  const px = Math.round(fitPx(spec.quote, 1180, 150, 90));
  return <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * easeIO(f, 0, Math.max(dur, 150))})`, transformOrigin: "50% 50%"}}>
      <Space f={f} id="kqg" seed={23} tone="warm" cx={0.5} cy={0.45} stars={0.6}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <defs><radialGradient id="kq-sb"><stop offset="0" stopColor={K.orangeL} stopOpacity={0.5}/><stop offset="1" stopColor={K.orange} stopOpacity={0}/></radialGradient></defs>
        <g transform={`translate(${960 + d.x * 0.3} ${500 + d.y * 0.3})`}>
          <circle r={760} fill="url(#kq-sb)"/>
          <g transform={`rotate(${f * 0.1})`}>{Array.from({length: 16}, (_, i) => <path key={i} d="M 0 0 L 1200 -70 L 1200 70 Z" fill={i % 2 ? K.orangeL : K.yellow} opacity={0.07} transform={`rotate(${i * 22.5})`}/>)}</g>
        </g>
        {/* poles and the waving banner */}
        <g transform={`translate(${d.x * 0.7} ${d.y * 0.7})`}>
          {[X0 - 18, X0 + (X1 - X0) * unfurl + 4].map((x, i) => <g key={i}><rect x={x - 8} y={Y0 - 60} width={16} height={Y1 - Y0 + 260} rx={8} fill={i ? K.creamD : "#C9A878"}/>
            <circle cx={x} cy={Y0 - 66} r={16} fill={K.yellow}/></g>)}
          <path d={shape} fill="#000" opacity={0.28} transform="translate(22 28)"/>
          <path d={shape} fill={K.cream}/>
          <clipPath id="kq-ban"><path d={shape}/></clipPath>
          <g clipPath="url(#kq-ban)">
            {Array.from({length: 12}, (_, i) => { const x = X0 + i * 140, w = Math.sin(i * 0.9 - f / 14) * 0.5 + 0.5; return <rect key={i} x={x} y={Y0 - 40} width={70} height={Y1 - Y0 + 80} fill={K.creamD} opacity={0.35 * w}/>; })}
            <path d={`M ${X0} ${Y1 - 40} L ${X1} ${Y0 + 120} L ${X1} ${Y1 + 40} L ${X0} ${Y1 + 40} Z`} fill={K.creamD} opacity={0.35}/>
            <rect x={X0} y={Y0 - 30} width={X1 - X0} height={58} fill={K.orange}/><rect x={X0} y={Y1 - 30} width={X1 - X0} height={58} fill={K.orange}/>
            <rect x={X0} y={Y0 + 18} width={X1 - X0} height={8} fill={K.pink} opacity={0.6}/><rect x={X0} y={Y1 - 30} width={X1 - X0} height={8} fill={K.pink} opacity={0.6}/>
          </g>
          {/* egg emblems on the banner's ends */}
          {[X0 + 120, X0 + (X1 - X0) * unfurl - 120].map((x, i) => { const y = (Y0 + Y1) / 2 + Math.sin(i * 2.2 * Math.PI - f / 14 + (i ? 2.2 * Math.PI : 0)) * A * (i ? 1 : 0.3);
            return <g key={i} transform={`translate(${x} ${y})`} opacity={unfurl > 0.5 ? 1 : 0}>
              {/* a marigold: two rings of petals round a deep centre */}
              <g transform={`rotate(${f * 0.4})`}>{Array.from({length: 14}, (_, k) => <ellipse key={k} cx={0} cy={-50} rx={17} ry={26} fill={k % 2 ? K.orange : K.orangeD} transform={`rotate(${k * 360 / 14})`}/>)}</g>
              <g transform={`rotate(${-f * 0.3 + 12})`}>{Array.from({length: 12}, (_, k) => <ellipse key={k} cx={0} cy={-32} rx={14} ry={20} fill={k % 2 ? K.yellow : K.orange} transform={`rotate(${k * 30})`}/>)}</g>
              <circle r={20} fill={K.orangeD}/><path d="M 0 -20 A 20 20 0 0 1 0 20 Z" fill={K.pinkD} opacity={0.6}/>
            </g>; })}
        </g>
        {petals.map(([x, y, sp, ph, yel], i) => { const yy = ((y + f * sp * 1.6) % 1240) - 80, xx = x + Math.sin(f / 26 + ph) * 40 + d.x;
          return <ellipse key={i} cx={xx} cy={yy} rx={9} ry={5} fill={yel ? K.yellow : K.orange} opacity={0.75} transform={`rotate(${(f * 2 + ph * 57) % 360} ${xx} ${yy})`}/>; })}
      </svg>
    </div>
    <div style={{position: "absolute", left: 230 + d.x * 0.7, top: Y0 + 40 + d.y * 0.7 + Math.sin(-f / 14 + 2.2) * 6, width: 1460, height: Y1 - Y0 - 80, display: "flex", alignItems: "center", justifyContent: "center",
      opacity: unfurl > 0.6 ? 1 : 0}}>
      <Words text={spec.quote} f={f} a={Math.max(a, 26)} px={px} color={K.deep} center mark={K.orange}/>
    </div>
    <div style={{position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", opacity: Math.min(1, whoT * 1.3), transform: `translateY(${(1 - whoT) * 20}px)`}}>
      <Tag text={whoLine(spec)} color={K.orange} size={38}/>
    </div>
    <Grain id="kqg"/>
  </AbsoluteFill>;
};

// ---- recollection ---------------------------------------------------------------------------------------------------------------
const Recollection: React.FC<SceneProps<QuoteSpec>> = ({f, dur, spec, at}) => {
  const a = at(spec.key), d = drift(f, 8), px = Math.round(fitPx(spec.quote, 1000 * 3, 92, 64, 0.5)), t0 = popIn(f, 0, 70, 14), whoT = popIn(f, a + 8, 140);
  return <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * easeIO(f, 0, Math.max(dur, 150))})`, transformOrigin: "25% 50%"}}>
      <Space f={f} id="kqr" seed={31} tone="dawn" cx={0.22} cy={0.5}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <defs>
          <radialGradient id="kq-rim"><stop offset="0.4" stopColor={K.orangeL} stopOpacity={0.55}/><stop offset="1" stopColor={K.orangeL} stopOpacity={0}/></radialGradient>
          <filter id="kq-soft"><feGaussianBlur stdDeviation={3}/></filter>
        </defs>
        <g transform={`translate(${430 + d.x * 0.5} ${560 + d.y * 0.5})`} opacity={Math.min(1, t0 * 1.2)}>
          <circle cx={0} cy={-120} r={330} fill="url(#kq-rim)"/>
          <g filter="url(#kq-soft)">
            <path d="M -250 360 C -250 160 -150 90 0 90 C 150 90 250 160 250 360 Z" fill="#2A2470"/>
            <ellipse cx={0} cy={-80} rx={130} ry={150} fill="#2A2470"/>
            <path d="M -40 40 L 40 40 L 46 110 L -46 110 Z" fill="#2A2470"/>
            <path d="M 60 -220 A 130 150 0 0 1 60 60" fill="none" stroke={K.orangeL} strokeWidth={10} opacity={0.75}/>
            <path d="M 150 120 C 220 160 250 240 250 360" fill="none" stroke={K.orangeL} strokeWidth={10} opacity={0.6}/>
          </g>
        </g>
      </svg>
    </div>
    <div style={{position: "absolute", left: 170, top: 860}}><Tag text="ILLUSTRATIVE" color={K.orange} size={34}/></div>
    <div style={{position: "absolute", left: 800 + d.x * 0.15, top: 64, height: 820, width: 1000, display: "flex", flexDirection: "column", justifyContent: "center"}}>
      <Words text={spec.quote} f={f} a={a} px={px} color={K.white}/>
      <div style={{marginTop: 40, opacity: Math.min(1, whoT * 1.3)}}><Tag text={whoLine(spec)} color={K.teal} size={36}/></div>
    </div>
    <Grain id="kqr"/>
  </AbsoluteFill>;
};

export const Scene: React.FC<SceneProps<QuoteSpec>> = (p) => {
  const k = p.spec.kind;
  if (k === "study") return <Study {...p}/>;
  if (k === "slogan") return <Slogan {...p}/>;
  if (k === "recollection") return <Recollection {...p}/>;
  throw new Error(`kurz quote: unknown kind "${k}"`);
};

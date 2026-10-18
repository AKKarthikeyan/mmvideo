// Moat Atlas channel art: banner, avatar, thumbnail and end screen. Minimal on purpose: dark ground, the mark,
// the wordmark, one line of tagline. No decorative charts; the videos carry the charts.
import React from "react";
import {AbsoluteFill} from "remotion";
import {G, GlobalFonts, Mark, SANS, Wordmark, wordmarkW} from "./theme";

export type BrandProps = {name: string; tagline: string};
export const BRAND: BrandProps = {name: "Moat Atlas", tagline: "The business behind the ticker, mapped from the filings"};

// 2560x1440; everything sits inside YouTube's 1546x423 all-device safe area (x 507-2053, y 508-931).
export const GlobalBanner: React.FC<BrandProps> = ({tagline}) => {
  const size = 150, mark = 170, gap = 56, w = mark + gap + wordmarkW(size), x0 = 1280 - w / 2;
  return (
    <AbsoluteFill style={{background: G.bg}}>
      <GlobalFonts/>
      <svg width={2560} height={1440} viewBox="0 0 2560 1440">
        <Mark x={x0} y={600} s={mark / 120}/>
        <Wordmark x={x0 + mark + gap} y={738} size={size}/>
        <line x1={1280 - 300} y1={830} x2={1280 + 300} y2={830} stroke={G.line} strokeWidth={3}/>
        <text x={1280} y={900} textAnchor="middle" fontFamily={SANS} fontSize={50} fill={G.dim}>{tagline}</text>
      </svg>
    </AbsoluteFill>
  );
};

// 800x800, read as a circle: the mark alone, centred, well inside the crop.
export const GlobalAvatar: React.FC = () => (
  <AbsoluteFill style={{background: G.bg}}>
    <svg width={800} height={800} viewBox="0 0 800 800">
      <Mark x={160} y={160} s={4}/>
    </svg>
  </AbsoluteFill>
);

// 1280x720 thumbnail: company, one number, at most four words. The number is the hook, so it gets half the frame.
// Optional `split`: where one dollar went, drawn as a stacked bar on the right (values in cents, top to bottom).
type Part = {label: string; v: number; kind: "keep" | "spend" | "neutral" | "rev"};
export type ThumbProps = {company: string; number: string; numberSub: string; line: string; accent?: Part["kind"]; split?: Part[]};
const Split: React.FC<{parts: Part[]; x: number; y: number; h: number}> = ({parts, x, y, h}) => {
  const tot = parts.reduce((a, p) => a + p.v, 0);
  let yy = y;
  return <g>{parts.map((p, i) => {
    const ph = h * p.v / tot, cy = yy + ph / 2;
    const el = <g key={i}>
      <rect x={x} y={yy} width={150} height={ph - 6} rx={6} fill={G[p.kind]}/>
      <text x={x + 180} y={cy + 4} fontFamily={SANS} fontSize={p.kind === "keep" ? 52 : 38} fontWeight={700} fill={p.kind === "keep" ? G.keep : G.ink}>
        {`${p.v}¢`}<tspan fontWeight={400} fontSize={30} fill={G.dim}>{` ${p.label}`}</tspan></text>
    </g>;
    yy += ph;
    return el;
  })}</g>;
};
export const GlobalThumb: React.FC<ThumbProps> = ({company, number, numberSub, line, accent = "keep", split}) => {
  const A = G[accent];
  return (
    <AbsoluteFill style={{background: G.bg}}>
      <GlobalFonts/>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        {split ? <Split parts={split} x={760} y={70} h={580}/> : null}
        <text x={64} y={140} fontFamily={SANS} fontSize={Math.min(120, 1100 / Math.max(4, company.length))} fontWeight={700} fill={G.ink}>{company.toUpperCase()}</text>
        <text x={56} y={415} fontFamily={SANS} fontSize={Math.min(250, 1700 / Math.max(3, number.length))} fontWeight={700} fill={A}>{number}</text>
        <text x={64} y={505} fontFamily={SANS} fontSize={40} fontWeight={500} fill={G.ink}>{numberSub.toUpperCase()}</text>
        <rect x={64} y={560} width={Math.min(1150, line.length * 30 + 60)} height={88} rx={10} fill={G.ink}/>
        <text x={94} y={621} fontFamily={SANS} fontSize={54} fontWeight={700} fill={G.bg}>{line.toUpperCase()}</text>
      </svg>
    </AbsoluteFill>
  );
};

// End screen (last 20 s of a video): two video slots and a subscribe slot for YouTube's end-screen elements,
// plus the credit line every video carries while narration is synthetic.
export const GlobalEndCard: React.FC<BrandProps> = () => (
  <AbsoluteFill style={{background: G.bg}}>
    <GlobalFonts/>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <Mark x={110} y={110} s={0.8}/>
      <Wordmark x={230} y={190} size={72}/>
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x={110 + i * 860} y={330} width={800} height={450} rx={14} fill={G.panel} stroke={G.line} strokeWidth={3} strokeDasharray="14 10"/>
          <text x={510 + i * 860} y={570} textAnchor="middle" fontFamily={SANS} fontSize={34} fill={G.dim}>{i ? "BEST FOR VIEWER" : "NEXT VIDEO"}</text>
        </g>
      ))}
      <text x={110} y={880} fontFamily={SANS} fontSize={30} fill={G.dim}>Research and script: Moat &amp; Margin research team · Narration: synthetic voice</text>
      <text x={110} y={925} fontFamily={SANS} fontSize={30} fill={G.dim}>Information, not investment advice. Sources and data for this video are linked in the description.</text>
    </svg>
  </AbsoluteFill>
);

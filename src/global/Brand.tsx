// Global channel art: banner, avatar, thumbnail and end screen. The channel name is a prop until it is chosen,
// so every still re-renders with the final name and nothing else changes.
import React from "react";
import {AbsoluteFill} from "remotion";
import {G, GlobalFonts, Mark, SANS} from "./theme";

export type BrandProps = {name: string; tagline: string};
export const BRAND: BrandProps = {name: "Flowsheet", tagline: "Where the money in AI and chips actually goes"};

// Decorative ribbons: one wide band splitting into kept (green) and spent (coral), drawn across a band of the frame.
const Flows: React.FC<{x: number; y: number; w: number; h: number; o?: number}> = ({x, y, w, h, o = 1}) => {
  const bands: [number, number, number, number, string][] = [
    [0.0, 0.62, 0.02, 0.40, G.keep], [0.62, 0.86, 0.52, 0.70, G.spend], [0.86, 1.0, 0.82, 0.96, G.amber]];
  return (
    <g opacity={o}>
      <rect x={x} y={y} width={w * 0.012} height={h} fill={G.rev}/>
      {bands.map(([a, b, c, d, col], i) => {
        const sx = x + w * 0.012, tx = x + w, m = (sx + tx) / 2;
        return <path key={i} fill={col} opacity={0.75}
          d={`M ${sx} ${y + a * h} C ${m} ${y + a * h}, ${m} ${y + c * h}, ${tx} ${y + c * h} L ${tx} ${y + d * h} C ${m} ${y + d * h}, ${m} ${y + b * h}, ${sx} ${y + b * h} Z`}/>;
      })}
    </g>
  );
};

// 2560x1440; text stays inside YouTube's 1546x423 all-device safe area (x 507-2053, y 508-931).
export const GlobalBanner: React.FC<BrandProps> = ({name, tagline}) => (
  <AbsoluteFill style={{background: G.bg}}>
    <GlobalFonts/>
    <svg width={2560} height={1440} viewBox="0 0 2560 1440">
      <Flows x={0} y={430} w={470} h={580} o={0.5}/>
      <g transform="translate(2560 0) scale(-1 1)"><Flows x={0} y={430} w={470} h={580} o={0.5}/></g>
      <Mark x={560} y={600} s={1.55}/>
      <text x={790} y={760} fontFamily={SANS} fontSize={190} fontWeight={700} fill={G.ink}>{name.toUpperCase()}</text>
      <text x={796} y={850} fontFamily={SANS} fontSize={58} fill={G.dim}>{tagline}</text>
      <text x={1280} y={1010} textAnchor="middle" fontFamily={SANS} fontSize={40} fontWeight={500} fill={G.amber}>
        EARNINGS BREAKDOWNS · FOLLOW THE DOLLAR · EVERY FIGURE SOURCED</text>
    </svg>
  </AbsoluteFill>
);

// 800x800, read as a circle: the mark sits well inside the inscribed circle.
export const GlobalAvatar: React.FC = () => (
  <AbsoluteFill style={{background: G.bg}}>
    <svg width={800} height={800} viewBox="0 0 800 800">
      <circle cx={400} cy={400} r={400} fill={G.panel}/>
      <Mark x={258} y={246} s={2.4}/>
    </svg>
  </AbsoluteFill>
);

// 1280x720 thumbnail: company, one number, at most four words. The number is the hook, so it gets half the frame.
// Optional `split`: where one dollar went, drawn as a stacked bar on the right (values in cents, top to bottom).
type Part = {label: string; v: number; kind: "keep" | "spend" | "amber" | "rev"};
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
        {split ? <Split parts={split} x={760} y={70} h={580}/> : <Flows x={700} y={90} w={600} h={540} o={0.35}/>}
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
export const GlobalEndCard: React.FC<BrandProps> = ({name}) => (
  <AbsoluteFill style={{background: G.bg}}>
    <GlobalFonts/>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <Mark x={110} y={110} s={0.8}/>
      <text x={230} y={185} fontFamily={SANS} fontSize={72} fontWeight={700} fill={G.ink}>{name.toUpperCase()}</text>
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

// The Inventor's Desk brand drafts (23 Oct 2026): two profile-logo options and the YouTube banner, in the channel's look
// (warm paper, black capitals, one cobalt accent). Drafted in code while the Canva design plugin awaits sign-in.
// Render: npx remotion still src/gadget/brand_index.ts ID-logoA out/gadget/brand/ID-logoA.png
import React from "react";
import {AbsoluteFill, Still} from "remotion";
import {C, HEAD, MONO, SERIF, useGKFonts} from "./kit";

const SPARK = "#F6C453";
const Spark: React.FC<{x: number; y: number; s: number; c?: string}> = ({x, y, s, c = SPARK}) => (
  <path transform={`translate(${x},${y}) scale(${s})`} d="M 0 -60 L 12 -12 L 60 0 L 12 12 L 0 60 L -12 12 L -60 0 L -12 -12 Z" fill={c}/>
);

/** A: monogram. Cobalt disc, white "ID", a spark: reads at 48 px, survives YouTube's circle crop */
export const LogoA: React.FC = () => {
  useGKFonts();
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <svg width={800} height={800}>
        <circle cx={400} cy={400} r={330} fill={C.accent}/>
        <text x={392} y={495} textAnchor="middle" fontFamily={HEAD} fontSize={270} fill={C.white} letterSpacing={-8}>ID</text>
        <Spark x={575} y={250} s={1.15}/>
        <circle cx={400} cy={400} r={330} fill="none" stroke={C.ink} strokeWidth={14}/>
      </svg>
    </AbsoluteFill>
  );
};

/** desk lamp, line art, with a cobalt light cone and a spark where the light lands */
const Lamp: React.FC<{s?: number; x?: number; y?: number; ink?: string}> = ({s = 1, x = 0, y = 0, ink = C.ink}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M 360 338 L 452 300 L 640 520 L 330 520 Z" fill={C.accent} opacity={0.22}/>
    <path d="M 120 600 L 360 600" stroke={ink} strokeWidth={22} strokeLinecap="round"/>
    <path d="M 240 600 L 240 560 L 150 360 L 300 210" fill="none" stroke={ink} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx={150} cy={360} r={20} fill={ink}/><circle cx={300} cy={210} r={20} fill={ink}/>
    <path d="M 300 210 L 372 168 L 452 300 L 360 338 Z" fill={ink}/>
    <path d="M 360 338 L 452 300" stroke={C.accent} strokeWidth={14} strokeLinecap="round"/>
  </g>
);

/** B: the desk lamp mark with the name under it */
export const LogoB: React.FC = () => {
  useGKFonts();
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <svg width={800} height={800}>
        <circle cx={400} cy={400} r={360} fill={C.white} opacity={0.5}/>
        <Lamp s={0.8} x={150} y={70}/>
        <Spark x={560} y={500} s={0.75}/>
        <text x={400} y={640} textAnchor="middle" fontFamily={HEAD} fontSize={74} fill={C.ink} letterSpacing={-1}>INVENTOR'S</text>
        <text x={400} y={712} textAnchor="middle" fontFamily={HEAD} fontSize={74} fill={C.accent} letterSpacing={-1}>DESK</text>
      </svg>
    </AbsoluteFill>
  );
};

/** tiny line icons of the season's objects */
const Icons: React.FC<{x: number; y: number; gap: number; s: number}> = ({x, y, gap, s}) => {
  const st = {fill: "none", stroke: C.ink, strokeWidth: 7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  const items = [
    // radio
    <g key="r"><rect x={-50} y={-30} width={100} height={66} rx={12} {...st}/><circle cx={-20} cy={3} r={16} {...st}/><rect x={10} y={-12} width={28} height={14} rx={3} {...st}/><path d="M -30 -30 L 10 -62" {...st}/></g>,
    // fridge
    <g key="f"><rect x={-32} y={-62} width={64} height={124} rx={12} {...st}/><path d="M -32 -20 L 32 -20 M 18 -48 L 18 -32 M 18 -6 L 18 18" {...st}/></g>,
    // fan
    <g key="n"><circle r={10} fill={C.ink}/>{[0, 120, 240].map((a) => <path key={a} transform={`rotate(${a})`} d="M 0 -10 Q 30 -60 6 -64 Q -18 -56 -8 -10" {...st}/>)}</g>,
    // TV
    <g key="t"><rect x={-56} y={-40} width={112} height={76} rx={10} {...st}/><path d="M -20 -62 L 0 -42 L 20 -62 M -30 56 L 30 56" {...st}/></g>,
    // AC
    <g key="a"><rect x={-62} y={-26} width={124} height={44} rx={12} {...st}/><path d="M -44 6 L 44 6 M -30 36 q 8 10 0 20 M 0 36 q 8 10 0 20 M 30 36 q 8 10 0 20" {...st}/></g>,
  ];
  return <g transform={`translate(${x},${y}) scale(${s})`}>{items.map((it, i) => <g key={i} transform={`translate(${i * gap},0)`}>{it}</g>)}</g>;
};

/** YouTube banner 2560x1440. Everything that must be read sits in the all-devices safe area (1546x423, centred). */
export const Banner: React.FC<{guides?: boolean}> = ({guides = false}) => {
  useGKFonts();
  const sx = (2560 - 1546) / 2, sy = (1440 - 423) / 2;
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <svg width={2560} height={1440} style={{position: "absolute"}}>
        {/* faint drawings outside the safe area: decoration only (seen on TVs and desktops) */}
        <g opacity={0.1}><Icons x={330} y={1240} gap={470} s={2.2}/></g>
        <g opacity={0.1}><Icons x={330} y={180} gap={470} s={1.6}/></g>
        {Array.from({length: 40}).map((_, k) => <circle key={k} cx={(k * 641) % 2560} cy={(k * 389) % 1440} r={4 + (k % 4) * 2} fill={k % 3 ? C.ink : C.accent} opacity={0.06}/>)}
        {/* safe area content (1546 x 423) */}
        <g transform={`translate(${sx},${sy})`}>
          <Lamp s={0.55} x={-20} y={10}/>
          <Spark x={300} y={300} s={0.45}/>
          <text x={400} y={140} fontFamily={HEAD} fontSize={98} fill={C.ink} letterSpacing={-2}>THE INVENTOR'S</text>
          <text x={400} y={248} fontFamily={HEAD} fontSize={98} fill={C.accent} letterSpacing={-2}>DESK</text>
          <text x={760} y={236} fontFamily={SERIF} fontStyle="italic" fontSize={50} fill={C.ink2}>how everyday things were invented</text>
          <text x={402} y={318} fontFamily={MONO} fontWeight={600} fontSize={27} letterSpacing={5} fill={C.ink}>THE SCIENCE OF EVERYDAY THINGS · EXPLAINED SIMPLY</text>
          <Icons x={450} y={378} gap={190} s={0.5}/>
        </g>
        {guides && <g fill="none" strokeWidth={6}>
          <rect x={sx} y={sy} width={1546} height={423} stroke="#E8563A"/>
          <rect x={(2560 - 2276) / 2} y={(1440 - 423) / 2} width={2276} height={423} stroke="#2348E0" strokeDasharray="20 14"/>
        </g>}
      </svg>
    </AbsoluteFill>
  );
};

export const BrandRoot: React.FC = () => (
  <>
    <Still id="ID-logoA" component={LogoA} width={800} height={800}/>
    <Still id="ID-logoB" component={LogoB} width={800} height={800}/>
    <Still id="ID-banner" component={Banner} width={2560} height={1440} defaultProps={{guides: false}}/>
    <Still id="ID-banner-guides" component={Banner} width={2560} height={1440} defaultProps={{guides: true}}/>
  </>
);

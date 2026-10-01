// Seven visual styles, same verified story (Som Distilleries, Moat & Margin article of 26 Sep 2026):
// "lost half its business — to one licence"; Q1 total income ₹530 cr (Q1 FY26) → ₹269 cr (Q1 FY27).
import React from "react";
import {AbsoluteFill, Composition, staticFile} from "remotion";
import rough from "roughjs/bin/rough";

const g = rough.generator();
const P = (d: any, k: string) => g.toPaths(d).map((p: any, i: number) =>
  <path key={`${k}${i}`} d={p.d} fill={p.fill === "none" ? "none" : p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round"/>);
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const DIDOT = "Didot, 'Bodoni 72', Georgia, serif";
const IMPACT = "Impact, 'Arial Black', sans-serif";
const MARKER = "'Marker Felt', 'Chalkboard SE', 'Comic Sans MS', sans-serif";
const Svg: React.FC<{children: React.ReactNode}> = ({children}) =>
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>{children}</svg>;
const Label: React.FC<{n: number; name: string; color: string}> = ({n, name, color}) => (
  <text x={60} y={1860} fontFamily={SANS} fontSize={30} letterSpacing={4} fill={color} opacity={0.7}>STYLE {n} · {name.toUpperCase()}</text>
);
const Filters: React.FC = () => (
  <defs>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="torn"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter>
    <filter id="shadow"><feDropShadow dx="8" dy="10" stdDeviation="6" floodOpacity="0.28"/></filter>
    <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3.2" fill="#e03131"/></pattern>
    <pattern id="dotsBlue" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="2.6" fill="#1971c2"/></pattern>
  </defs>
);

// 1. Paper cut-out collage: torn paper layers with drop shadows
const Collage: React.FC = () => (
  <AbsoluteFill style={{background: "#e9dfcc"}}><Svg><Filters/>
    <g filter="url(#shadow)">
      <rect x={70} y={180} width={940} height={330} fill="#2f3e46" filter="url(#torn)"/>
    </g>
    <text x={540} y={320} fontFamily={DIDOT} fontSize={96} textAnchor="middle" fill="#fdf6e3">Som Distilleries</text>
    <text x={540} y={430} fontFamily={SERIF} fontStyle="italic" fontSize={54} textAnchor="middle" fill="#ffd8a8">lost half its business</text>
    <g filter="url(#shadow)">
      <polygon points="260,900 540,690 820,900" fill="#c2410c" filter="url(#torn)"/>
      <rect x={290} y={900} width={500} height={420} fill="#f4a261" filter="url(#torn)"/>
      <rect x={640} y={640} width={80} height={200} fill="#6d4c41" filter="url(#torn)"/>
      <rect x={470} y={1120} width={140} height={200} fill="#2f3e46"/>
    </g>
    <g filter="url(#shadow)" transform="rotate(-6 540 1560)">
      <rect x={200} y={1460} width={680} height={200} fill="#fff" filter="url(#torn)"/>
      <text x={540} y={1585} fontFamily={DIDOT} fontSize={76} textAnchor="middle" fill="#c92a2a">to ONE licence</text>
    </g>
    <Label n={1} name="Paper cut-out collage" color="#2f3e46"/>
  </Svg></AbsoluteFill>
);

// 2. Newspaper broadsheet: masthead, columns, halftone photo
const Broadsheet: React.FC = () => (
  <AbsoluteFill style={{background: "#f3efe3"}}><Svg><Filters/>
    <text x={540} y={160} fontFamily={DIDOT} fontSize={88} textAnchor="middle" fill="#111">The Filing Times</text>
    <line x1={60} y1={195} x2={1020} y2={195} stroke="#111" strokeWidth={4}/><line x1={60} y1={205} x2={1020} y2={205} stroke="#111" strokeWidth={1}/>
    <text x={60} y={245} fontFamily={SERIF} fontSize={26} fill="#333">SATURDAY, 26 SEPTEMBER 2026 · FROM THE COMPANY'S FILINGS</text>
    <text x={60} y={380} fontFamily={SERIF} fontWeight={700} fontSize={92} fill="#111">ONE LICENCE,</text>
    <text x={60} y={485} fontFamily={SERIF} fontWeight={700} fontSize={92} fill="#111">HALF A BUSINESS</text>
    <text x={60} y={560} fontFamily={SERIF} fontStyle="italic" fontSize={36} fill="#333">Som Distilleries' Bhopal brewery shut for seven months</text>
    <rect x={60} y={620} width={960} height={620} fill="url(#dotsBlue)" opacity={0.35}/>
    <polygon points="300,900 540,760 780,900" fill="none" stroke="#111" strokeWidth={6}/>
    <rect x={320} y={900} width={440} height={300} fill="none" stroke="#111" strokeWidth={6}/>
    <text x={60} y={1290} fontFamily={SERIF} fontSize={26} fill="#555">Illustration · Bhopal brewery, licence suspended 5 Feb 2026</text>
    {[0, 1].map(c => (
      <g key={c}>
        <line x1={540} y1={1330} x2={540} y2={1790} stroke="#999" strokeWidth={1}/>
        {["Total income in the June", "quarter fell to ₹269 crore,", "from ₹530 crore a year", "earlier, the company's", "investor presentation shows."].map((t, i) =>
          c === 0 ? <text key={i} x={60} y={1380 + i * 52} fontFamily={SERIF} fontSize={36} fill="#222">{t}</text> : null)}
        {["On 24 September the High", "Court ordered the state to", "renew its licences within", "15 days, the company told", "the exchanges."].map((t, i) =>
          c === 1 ? <text key={i} x={570} y={1380 + i * 52} fontFamily={SERIF} fontSize={36} fill="#222">{t}</text> : null)}
      </g>
    ))}
    <Label n={2} name="Newspaper broadsheet" color="#111"/>
  </Svg></AbsoluteFill>
);

// 3. Isometric flat 3D
const Isometric: React.FC = () => {
  const iso = (x: number, y: number, z: number) => [540 + (x - y) * 0.866, 1050 + (x + y) * 0.5 - z];
  const box = (x: number, y: number, w: number, d: number, h: number, top: string, left: string, right: string, k: string) => {
    const pts = (a: number[][]) => a.map(p => p.join(",")).join(" ");
    const A = iso(x, y, h), B = iso(x + w, y, h), C = iso(x + w, y + d, h), D = iso(x, y + d, h);
    const B0 = iso(x + w, y, 0), C0 = iso(x + w, y + d, 0), D0 = iso(x, y + d, 0);
    return <g key={k}><polygon points={pts([A, B, C, D])} fill={top}/><polygon points={pts([D, C, C0, D0])} fill={left}/><polygon points={pts([B, C, C0, B0])} fill={right}/></g>;
  };
  return (
    <AbsoluteFill style={{background: "linear-gradient(#e7f5ff, #d0ebff)"}}><Svg>
      <text x={540} y={230} fontFamily={SANS} fontWeight={800} fontSize={84} textAnchor="middle" fill="#1c2b4a">Som Distilleries</text>
      <text x={540} y={320} fontFamily={SANS} fontSize={50} textAnchor="middle" fill="#e8590c">lost half its business</text>
      {box(-260, -260, 520, 520, 0, "#b2f2bb", "#8ce99a", "#69db7c", "ground")}
      {box(-150, -120, 300, 240, 220, "#ffe8cc", "#ffa94d", "#fd7e14", "main")}
      {box(80, -90, 60, 60, 380, "#dee2e6", "#adb5bd", "#868e96", "chimney")}
      {box(-40, 120, 80, 20, 120, "#e03131", "#c92a2a", "#a61e4d", "lock")}
      <text x={540} y={1500} fontFamily={SANS} fontWeight={800} fontSize={80} textAnchor="middle" fill="#c92a2a">to ONE licence</text>
      <text x={540} y={1590} fontFamily={SANS} fontSize={40} textAnchor="middle" fill="#1c2b4a">₹530 cr → ₹269 cr quarterly income</text>
      <Label n={3} name="Isometric flat 3D" color="#1c2b4a"/>
    </Svg></AbsoluteFill>
  );
};

// 4. Swiss / Bauhaus: grid, primary shapes, huge type
const Swiss: React.FC = () => (
  <AbsoluteFill style={{background: "#f8f9fa"}}><Svg>
    <rect x={0} y={0} width={1080} height={700} fill="#e03131"/>
    <circle cx={820} cy={430} r={260} fill="#1d1d1f"/>
    <rect x={60} y={560} width={380} height={380} fill="#ffd43b"/>
    <text x={60} y={250} fontFamily={SANS} fontWeight={800} fontSize={150} fill="#fff" letterSpacing={-4}>50%</text>
    <text x={60} y={330} fontFamily={SANS} fontSize={44} fill="#fff">of volume, one plant</text>
    <text x={60} y={1120} fontFamily={SANS} fontWeight={800} fontSize={96} fill="#1d1d1f" letterSpacing={-2}>Som</text>
    <text x={60} y={1220} fontFamily={SANS} fontWeight={800} fontSize={96} fill="#1d1d1f" letterSpacing={-2}>Distilleries</text>
    <line x1={60} y1={1290} x2={1020} y2={1290} stroke="#1d1d1f" strokeWidth={6}/>
    <text x={60} y={1380} fontFamily={SANS} fontSize={48} fill="#1d1d1f">One licence. Half the business.</text>
    <text x={60} y={1520} fontFamily={SANS} fontSize={36} fill="#495057">Q1 FY26  ₹530 cr</text>
    <text x={60} y={1580} fontFamily={SANS} fontSize={36} fill="#e03131">Q1 FY27  ₹269 cr</text>
    <Label n={4} name="Swiss / Bauhaus" color="#1d1d1f"/>
  </Svg></AbsoluteFill>
);

// 5. Risograph: two inks, misregistration, grain
const Riso: React.FC = () => (
  <AbsoluteFill style={{background: "#fff8ec"}}><Svg><Filters/>
    <g style={{mixBlendMode: "multiply"}}>
      <text x={548} y={330} fontFamily={IMPACT} fontSize={130} textAnchor="middle" fill="#ff6b9d" opacity={0.85}>ONE LICENCE</text>
      <text x={540} y={322} fontFamily={IMPACT} fontSize={130} textAnchor="middle" fill="#2f6fd6" opacity={0.85}>ONE LICENCE</text>
      <circle cx={560} cy={880} r={330} fill="#ff6b9d" opacity={0.8}/>
      <circle cx={520} cy={860} r={330} fill="none" stroke="#2f6fd6" strokeWidth={26} opacity={0.85}/>
      <text x={548} y={930} fontFamily={IMPACT} fontSize={260} textAnchor="middle" fill="#2f6fd6" opacity={0.9}>½</text>
    </g>
    <text x={540} y={1360} fontFamily={IMPACT} fontSize={86} textAnchor="middle" fill="#2f6fd6">SOM DISTILLERIES</text>
    <text x={540} y={1450} fontFamily={SANS} fontSize={44} textAnchor="middle" fill="#d6336c">lost half its business</text>
    <text x={540} y={1560} fontFamily={SANS} fontSize={38} textAnchor="middle" fill="#2f6fd6">₹530 cr → ₹269 cr, June quarter</text>
    <rect x={0} y={0} width={1080} height={1920} filter="url(#grain)"/>
    <Label n={5} name="Risograph print" color="#2f6fd6"/>
  </Svg></AbsoluteFill>
);

// 6. Comic panels: bold outlines, halftone, speech bubbles
const Comic: React.FC = () => (
  <AbsoluteFill style={{background: "#fff"}}><Svg><Filters/>
    <rect x={40} y={60} width={1000} height={560} fill="#fff9db" stroke="#111" strokeWidth={10}/>
    <rect x={40} y={660} width={480} height={620} fill="url(#dots)" stroke="#111" strokeWidth={10} opacity={0.9}/>
    <rect x={560} y={660} width={480} height={620} fill="#e7f5ff" stroke="#111" strokeWidth={10}/>
    <rect x={40} y={1320} width={1000} height={440} fill="#fff" stroke="#111" strokeWidth={10}/>
    <text x={540} y={220} fontFamily={IMPACT} fontSize={100} textAnchor="middle" fill="#111">SOM DISTILLERIES</text>
    <text x={540} y={330} fontFamily={MARKER} fontSize={52} textAnchor="middle" fill="#c92a2a">FEB 2026: THE BHOPAL LICENCE IS SUSPENDED!</text>
    <polygon points="300,560 540,420 780,560" fill="#fff" stroke="#111" strokeWidth={8}/>
    <text x={280} y={1000} fontFamily={IMPACT} fontSize={110} textAnchor="middle" fill="#fff" stroke="#111" strokeWidth={4}>SHUT!</text>
    <ellipse cx={800} cy={880} rx={210} ry={130} fill="#fff" stroke="#111" strokeWidth={6}/>
    <polygon points="700,990 740,1000 660,1080" fill="#fff" stroke="#111" strokeWidth={6}/>
    <text x={800} y={870} fontFamily={MARKER} fontSize={36} textAnchor="middle" fill="#111">"we lost about</text>
    <text x={800} y={915} fontFamily={MARKER} fontSize={36} textAnchor="middle" fill="#111">INR250 crores of revenue"</text>
    <text x={800} y={1220} fontFamily={MARKER} fontSize={30} textAnchor="middle" fill="#555">— management, Aug call</text>
    <text x={540} y={1470} fontFamily={IMPACT} fontSize={80} textAnchor="middle" fill="#111">SEP 24: COURT ORDERS</text>
    <text x={540} y={1570} fontFamily={IMPACT} fontSize={80} textAnchor="middle" fill="#c92a2a">RENEWAL IN 15 DAYS</text>
    <text x={540} y={1680} fontFamily={MARKER} fontSize={40} textAnchor="middle" fill="#555">To be continued... (restart date not stated)</text>
    <Label n={6} name="Comic panels" color="#111"/>
  </Svg></AbsoluteFill>
);

// 7. Kolam line art: South Indian dot-grid line drawing (fits the Tamil edition)
const Kolam: React.FC = () => {
  const dots: JSX.Element[] = [];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) dots.push(<circle key={`${r}-${c}`} cx={300 + c * 80} cy={620 + r * 80} r={7} fill="#f8f0e3"/>);
  const loops = [0, 1, 2].map(i => g.ellipse(540, 860, 200 + i * 130, 200 + i * 130, {roughness: 0.6, stroke: "#f8f0e3", strokeWidth: 5, seed: 40 + i}));
  const petals = [0, 1, 2, 3].map(i => g.ellipse(540 + [0, 170, 0, -170][i], 860 + [-170, 0, 170, 0][i], 160, 160, {roughness: 0.7, stroke: "#ffd43b", strokeWidth: 4, seed: 50 + i}));
  return (
    <AbsoluteFill style={{background: "#7a1f1f"}}><Svg>
      <text x={540} y={220} fontFamily={SERIF} fontSize={84} textAnchor="middle" fill="#f8f0e3">Som Distilleries</text>
      <text x={540} y={310} fontFamily="'Tamil Sangam MN', sans-serif" fontSize={50} textAnchor="middle" fill="#ffd43b">ஒரே உரிமம், பாதி வணிகம்</text>
      <text x={540} y={380} fontFamily={SERIF} fontStyle="italic" fontSize={42} textAnchor="middle" fill="#f8f0e3" opacity={0.85}>one licence, half the business</text>
      {dots}
      {loops.map((l, i) => P(l, `l${i}`))}
      {petals.map((l, i) => P(l, `p${i}`))}
      <text x={540} y={1360} fontFamily={SERIF} fontSize={58} textAnchor="middle" fill="#f8f0e3">₹530 cr → ₹269 cr</text>
      <text x={540} y={1430} fontFamily={SERIF} fontSize={38} textAnchor="middle" fill="#f8f0e3" opacity={0.8}>quarterly income, Bhopal brewery shut</text>
      <Label n={7} name="Kolam line art" color="#f8f0e3"/>
    </Svg></AbsoluteFill>
  );
};

export const STYLES: Record<string, React.FC> = {Collage, Broadsheet, Swiss, Riso, Comic};   // AK 27 Sep: Isometric and Kolam dropped
export const StyleStills: React.FC = () => (
  <>{Object.entries(STYLES).map(([k, C]) =>
    <Composition key={k} id={`S-${k}`} component={C} durationInFrames={1} fps={30} width={1080} height={1920}/>)}</>
);

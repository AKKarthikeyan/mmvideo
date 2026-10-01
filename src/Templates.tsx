// Seven weekly templates, one look each (storyboard stills first, per the "stills before motion" workflow).
// Every fact below is from a verified, published Moat & Margin digest or article (22–26 Sep 2026).
import React from "react";
import {AbsoluteFill, Composition, Img, staticFile} from "remotion";
import rough from "roughjs/bin/rough";

const g = rough.generator();
const P = (d: any, key?: any) => g.toPaths(d).map((p: any, i: number) =>
  <path key={`${key}-${i}`} d={p.d} fill={p.fill === "none" ? "none" : p.fill} stroke={p.stroke} strokeWidth={p.strokeWidth}
        strokeLinecap="round" strokeLinejoin="round"/>);
const HAND = "Virgil, 'Comic Sans MS', sans-serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "Menlo, 'Courier New', monospace";
const TAMIL = "'Tamil Sangam MN', 'Noto Sans Tamil', sans-serif";

const Font: React.FC = () => <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>;
const Svg: React.FC<{children: React.ReactNode}> = ({children}) =>
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>{children}</svg>;
const Tag: React.FC<{day: string; name: string; color: string; font?: string}> = ({day, name, color, font = SANS}) => (
  <g>
    <text x={60} y={110} fontFamily={SANS} fontSize={30} letterSpacing={6} fill={color} opacity={0.75}>{day.toUpperCase()}</text>
    <text x={60} y={165} fontFamily={font} fontSize={46} fill={color}>{name}</text>
  </g>
);
const Foot: React.FC<{color: string; font?: string}> = ({color, font = SANS}) => (
  <g opacity={0.7}>
    <text x={60} y={1860} fontFamily={font} fontSize={34} fill={color}>Moat &amp; Margin</text>
    <text x={1020} y={1860} fontFamily={SANS} fontSize={24} fill={color} textAnchor="end">Educational · not investment advice · from the filings</text>
  </g>
);

// MON — "Filing Decoder": whiteboard doodle (the pilot's look)
const Mon: React.FC = () => (
  <AbsoluteFill style={{background: "#fbf8f1"}}><Font/><Svg>
    <Tag day="Monday" name="Filing Decoder" color="#1d1d1f" font={HAND}/>
    <text x={540} y={380} fontFamily={HAND} fontSize={88} textAnchor="middle" fill="#1d1d1f">Som Distilleries</text>
    <text x={540} y={470} fontFamily={HAND} fontSize={54} textAnchor="middle" fill="#d9480f">lost half its business</text>
    {P(g.rectangle(270, 760, 540, 380, {roughness: 2, seed: 1, stroke: "#1d1d1f", strokeWidth: 4}), "a")}
    {P(g.polygon([[250, 760], [540, 580], [830, 760]], {roughness: 2, seed: 2, stroke: "#1d1d1f", strokeWidth: 4}), "b")}
    {P(g.rectangle(470, 1000, 140, 110, {roughness: 2, seed: 3, stroke: "#d9480f", strokeWidth: 6, fill: "rgba(217,72,15,.18)", fillStyle: "solid"}), "c")}
    {P(g.arc(540, 1002, 96, 130, Math.PI, 2 * Math.PI, false, {roughness: 1.6, seed: 4, stroke: "#d9480f", strokeWidth: 7}), "d")}
    <text x={540} y={1320} fontFamily={HAND} fontSize={80} textAnchor="middle" fill="#d9480f">to ONE licence</text>
    <Foot color="#1d1d1f" font={HAND}/>
  </Svg></AbsoluteFill>
);

// TUE — "Number of the Day": kinetic typography, one giant figure
const Tue: React.FC = () => (
  <AbsoluteFill style={{background: "#0e1116"}}><Svg>
    <Tag day="Tuesday" name="Number of the Day" color="#f5f1e8"/>
    <text x={540} y={540} fontFamily={SANS} fontSize={46} textAnchor="middle" fill="#9aa4b2">Nuvama Wealth Management</text>
    <text x={540} y={600} fontFamily={SANS} fontSize={40} textAnchor="middle" fill="#9aa4b2">PAG's pledged 53.12% stake</text>
    <text x={540} y={700} fontFamily={SANS} fontSize={60} textAnchor="middle" fill="#9aa4b2" textDecoration="line-through">US$265m</text>
    <text x={540} y={1010} fontFamily={SANS} fontWeight={800} fontSize={300} textAnchor="middle" fill="#ffd43b">$450m</text>
    <text x={540} y={1120} fontFamily={SANS} fontSize={58} textAnchor="middle" fill="#f5f1e8">now secured by the same shares</text>
    <rect x={200} y={1250} width={680} height={6} fill="#ffd43b"/>
    <text x={540} y={1360} fontFamily={SANS} fontSize={44} textAnchor="middle" fill="#9aa4b2">No new shares pledged · amended facility</text>
    <text x={540} y={1430} fontFamily={SANS} fontSize={40} textAnchor="middle" fill="#9aa4b2">SAST disclosure on NSE, 25 Sep 2026</text>
    <Foot color="#f5f1e8"/>
  </Svg></AbsoluteFill>
);

// WED — "Red Flag Radar": case-file / evidence board
const Wed: React.FC = () => (
  <AbsoluteFill style={{background: "#c9a877"}}><Svg>
    <Tag day="Wednesday" name="Red Flag Radar" color="#2b1d0e" font={MONO}/>
    <g transform="rotate(-3 540 900)">
      <rect x={140} y={360} width={800} height={980} fill="#fffdf6" stroke="#8a7350" strokeWidth={3}/>
      <circle cx={540} cy={390} r={22} fill="#c92a2a"/>
      <text x={190} y={470} fontFamily={MONO} fontSize={34} fill="#2b1d0e">CASE FILE · 25 SEP 2026</text>
      <text x={190} y={560} fontFamily={SERIF} fontSize={78} fill="#111">Omaxe Ltd</text>
      <text x={190} y={660} fontFamily={SERIF} fontSize={40} fill="#333">SEBI order (minimum public</text>
      <text x={190} y={712} fontFamily={SERIF} fontSize={40} fill="#333">shareholding compliance)</text>
      <rect x={190} y={790} width={700} height={250} fill="#fff3bf"/>
      <text x={210} y={860} fontFamily={SERIF} fontStyle="italic" fontSize={40} fill="#111">"restrained from accessing the</text>
      <text x={210} y={915} fontFamily={SERIF} fontStyle="italic" fontSize={40} fill="#111">securities market and prohibited</text>
      <text x={210} y={970} fontFamily={SERIF} fontStyle="italic" fontSize={40} fill="#111">from dealing in securities"</text>
      <text x={190} y={1110} fontFamily={MONO} fontSize={30} fill="#555">Source: company's filing to NSE</text>
    </g>
    <g transform="rotate(-14 760 1400)">
      <rect x={560} y={1320} width={420} height={150} fill="none" stroke="#c92a2a" strokeWidth={10} rx={12}/>
      <text x={770} y={1420} fontFamily={MONO} fontWeight={700} fontSize={84} textAnchor="middle" fill="#c92a2a">RED FLAG</text>
    </g>
    <Foot color="#2b1d0e" font={MONO}/>
  </Svg></AbsoluteFill>
);

// THU — "Moat Map": blueprint diagram of how the moat works
const Thu: React.FC = () => {
  const W = "#e7f5ff", o = {roughness: 1.3, stroke: W, strokeWidth: 3};
  return (
    <AbsoluteFill style={{background: "#123a6b", backgroundImage: "linear-gradient(#1b4a82 1px, transparent 1px), linear-gradient(90deg, #1b4a82 1px, transparent 1px)", backgroundSize: "60px 60px"}}><Svg>
      <Tag day="Thursday" name="Moat Map" color={W} font={MONO}/>
      <text x={540} y={330} fontFamily={MONO} fontSize={58} textAnchor="middle" fill={W}>ELLENBARRIE INDUSTRIAL GASES</text>
      {P(g.rectangle(140, 480, 360, 220, {...o, seed: 5}), "t1")}
      <text x={320} y={575} fontFamily={MONO} fontSize={32} textAnchor="middle" fill={W}>325 TPD air</text>
      <text x={320} y={625} fontFamily={MONO} fontSize={32} textAnchor="middle" fill={W}>separation unit</text>
      {P(g.rectangle(580, 480, 360, 220, {...o, seed: 6}), "t2")}
      <text x={760} y={575} fontFamily={MONO} fontSize={32} textAnchor="middle" fill={W}>onsite, at the</text>
      <text x={760} y={625} fontFamily={MONO} fontSize={32} textAnchor="middle" fill={W}>customer's plant</text>
      {P(g.line(500, 590, 580, 590, {...o, seed: 7}), "t3")}
      {P(g.line(540, 700, 540, 860, {...o, seed: 8}), "t4")}
      {P(g.rectangle(190, 860, 700, 260, {...o, seed: 9, stroke: "#ffd43b", strokeWidth: 5}), "t5")}
      <text x={540} y={970} fontFamily={MONO} fontSize={52} textAnchor="middle" fill="#ffd43b">15-YEAR</text>
      <text x={540} y={1045} fontFamily={MONO} fontSize={52} textAnchor="middle" fill="#ffd43b">TAKE-OR-PAY</text>
      <text x={540} y={1260} fontFamily={MONO} fontSize={40} textAnchor="middle" fill={W}>= long-term, locked-in supply</text>
      <text x={540} y={1330} fontFamily={MONO} fontSize={40} textAnchor="middle" fill={W}>(switching cost for the customer)</text>
      <text x={540} y={1480} fontFamily={MONO} fontSize={32} textAnchor="middle" fill="#a5d8ff">MOAT: DEEPEN · switching costs</text>
      <Foot color={W} font={MONO}/>
    </Svg></AbsoluteFill>
  );
};

// FRI — "Week in 60 Seconds": newsroom cards
const Fri: React.FC = () => {
  const cards: [string, string, string][] = [
    ["25 SEP", "Welspun Corp", "order book ₹45,000 cr on US orders"],
    ["25 SEP", "Omaxe", "SEBI restraint order"],
    ["25 SEP", "Nuvama", "PAG stake now secures US$450m"],
    ["26 SEP", "Som Distilleries", "court orders licence renewal"],
    ["26 SEP", "KPI Green", "35.84% vote against RPT resolution"],
  ];
  return (
    <AbsoluteFill style={{background: "#f1f3f5"}}><Svg>
      <rect x={0} y={0} width={1080} height={210} fill="#c92a2a"/>
      <text x={60} y={95} fontFamily={SANS} fontSize={30} letterSpacing={6} fill="#fff" opacity={0.85}>FRIDAY</text>
      <text x={60} y={165} fontFamily={SANS} fontWeight={800} fontSize={58} fill="#fff">The Week in 60 Seconds</text>
      {cards.map(([d, co, t], i) => {
        const y = 290 + i * 300;
        return (
          <g key={i}>
            <rect x={60} y={y} width={960} height={250} rx={20} fill="#fff" stroke="#dee2e6" strokeWidth={2}/>
            <rect x={60} y={y} width={16} height={250} rx={8} fill={i === 1 ? "#c92a2a" : "#1c64b8"}/>
            <text x={110} y={y + 70} fontFamily={SANS} fontSize={30} letterSpacing={3} fill="#868e96">{d}</text>
            <text x={110} y={y + 140} fontFamily={SANS} fontWeight={700} fontSize={56} fill="#212529">{co}</text>
            <text x={110} y={y + 205} fontFamily={SANS} fontSize={40} fill="#495057">{t}</text>
            <text x={980} y={y + 70} fontFamily={SANS} fontSize={40} fill="#adb5bd" textAnchor="end">{i + 1}/5</text>
          </g>
        );
      })}
      <Foot color="#212529"/>
    </Svg></AbsoluteFill>
  );
};

// SAT — "Promoter Watch": share-certificate look, holdings before -> after
const Sat: React.FC = () => {
  const G = "#1b5e20";
  const bar = (y: number, name: string, a: number, b: number, who: string) => (
    <g>
      <text x={120} y={y} fontFamily={SERIF} fontSize={54} fill="#1a1a1a">{name}</text>
      <text x={120} y={y + 50} fontFamily={SERIF} fontStyle="italic" fontSize={34} fill="#555">{who}</text>
      <rect x={120} y={y + 90} width={840} height={50} fill="#e9ecef"/>
      <rect x={120} y={y + 90} width={840 * a / 100} height={50} fill="#adb5bd"/>
      <text x={130 + 840 * a / 100} y={y + 128} fontFamily={SERIF} fontSize={34} fill="#555">{a}% before</text>
      <rect x={120} y={y + 160} width={840} height={50} fill="#e9ecef"/>
      <rect x={120} y={y + 160} width={840 * b / 100} height={50} fill={b < a ? "#c92a2a" : G}/>
      <text x={130 + 840 * b / 100} y={y + 198} fontFamily={SERIF} fontWeight={700} fontSize={34} fill={b < a ? "#c92a2a" : G}>{b}% after</text>
    </g>
  );
  return (
    <AbsoluteFill style={{background: "#fbf7ea"}}><Svg>
      <rect x={30} y={30} width={1020} height={1860} fill="none" stroke={G} strokeWidth={6}/>
      <rect x={50} y={50} width={980} height={1820} fill="none" stroke={G} strokeWidth={2} strokeDasharray="10 8"/>
      <Tag day="Saturday" name="Promoter Watch" color={G} font={SERIF}/>
      <text x={540} y={330} fontFamily={SERIF} fontSize={60} textAnchor="middle" fill={G}>Who sold, who bought</text>
      {bar(500, "Granules India", 31.0, 24.06, "Promoter Dr K. P. Chigurupati sold 6.94% · 11 Sep")}
      {bar(960, "Gabriel India", 42.67, 46.98, "Promoter group via preferential allotment · 11 Sep")}
      <text x={540} y={1520} fontFamily={SERIF} fontSize={36} textAnchor="middle" fill="#555">From SEBI SAST disclosures on NSE, 25 Sep 2026</text>
      <Foot color={G} font={SERIF}/>
    </Svg></AbsoluteFill>
  );
};

// SUN — "Concept of the Week": chalkboard lesson, English + Tamil
const Sun: React.FC = () => {
  const C = "#f8f9fa", o = {roughness: 2.2, stroke: C, strokeWidth: 4};
  return (
    <AbsoluteFill style={{background: "#1f3b2d"}}><Font/><Svg>
      <Tag day="Sunday" name="Concept of the Week" color={C} font={HAND}/>
      <text x={540} y={340} fontFamily={HAND} fontSize={70} textAnchor="middle" fill={C}>What is a promoter pledge?</text>
      <text x={540} y={430} fontFamily={TAMIL} fontSize={52} textAnchor="middle" fill="#ffe066">புரமோட்டர் பங்கு அடமானம் என்றால் என்ன?</text>
      {P(g.rectangle(90, 600, 320, 200, {...o, seed: 21}), "s1")}
      <text x={250} y={715} fontFamily={HAND} fontSize={48} textAnchor="middle" fill={C}>Promoter</text>
      {P(g.rectangle(670, 600, 320, 200, {...o, seed: 22}), "s2")}
      <text x={830} y={715} fontFamily={HAND} fontSize={48} textAnchor="middle" fill={C}>Lender</text>
      {P(g.line(420, 660, 660, 660, {...o, seed: 23}), "s3")}
      <text x={540} y={630} fontFamily={HAND} fontSize={30} textAnchor="middle" fill="#ffe066">shares as security</text>
      {P(g.line(660, 750, 420, 750, {...o, seed: 24}), "s4")}
      <text x={540} y={800} fontFamily={HAND} fontSize={34} textAnchor="middle" fill="#ffe066">loan</text>
      <text x={540} y={1000} fontFamily={HAND} fontSize={50} textAnchor="middle" fill={C}>If the loan isn't repaid,</text>
      <text x={540} y={1070} fontFamily={HAND} fontSize={50} textAnchor="middle" fill={C}>the lender can sell the shares.</text>
      <text x={540} y={1250} fontFamily={HAND} fontSize={42} textAnchor="middle" fill="#a9e34b">This week: Symbiotec Pharmalab —</text>
      <text x={540} y={1315} fontFamily={HAND} fontSize={38} textAnchor="middle" fill="#a9e34b">promoter-family trusts encumbered 7.38% (9 Sep)</text>
      <Foot color={C} font={HAND}/>
    </Svg></AbsoluteFill>
  );
};

export const TEMPLATES: Record<string, React.FC> = {Mon, Tue, Wed, Thu, Fri, Sat, Sun};
export const TemplateStills: React.FC = () => (
  <>{Object.entries(TEMPLATES).map(([k, C]) =>
    <Composition key={k} id={`T-${k}`} component={C} durationInFrames={1} fps={30} width={1080} height={1920}/>)}</>
);

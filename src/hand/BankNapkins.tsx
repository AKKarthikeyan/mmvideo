// Q2 bank forensic napkin Shorts (4 Oct 2026), Indian-accent narrator, loop endings.
// bka: Bank of Baroda — global vs domestic advances (overseas = global − domestic, our arithmetic).
// bkb: Bandhan Bank — QoQ deposit mix (CASA −2,348; retail TD +5,863; bulk +4,288; total +7,803 ₹ cr).
// bkc: Ujjivan SFB — group-loan share 37.9%→34.3% (our arithmetic), secured 46.8%→52.0%, GNPA 2.45%→2.10%, write-offs ₹213 cr→₹43 cr.
// Sources: each bank's Q2 FY27 business update on NSE (1–3 Oct 2026).
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import bka from "../../public/hand/bka/beats.json";
import bkb from "../../public/hand/bkb/beats.json";
import bkc from "../../public/hand/bkc/beats.json";
import {Captions, HDraw, HWrite, INK, PAPER, RED, BLUE, GREEN, HANDFONT, sh} from "../handkit";

export const BFPS = 30;
const PAD = 0.15;
type B = {key: string; text: string; sec: number};
const frames = (bs: B[]) => bs.map((b) => Math.ceil((b.sec + PAD) * BFPS));
export const bkTotal = (bs: B[]) => frames(bs).reduce((a, b) => a + b, 0);
export const BK = {bka: bka as B[], bkb: bkb as B[], bkc: bkc as B[]};

const atOf = (b: B) => (p: string, off = 0) => {
  const i = b.text.toLowerCase().indexOf(p.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${p}`);
  return Math.round(b.sec * BFPS * i / b.text.length) + off;
};
type SceneP = {b: B};
const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>{children}</svg>
);
const Napkin: React.FC<{children: React.ReactNode; rot?: number}> = ({children, rot = -2}) => (
  <g transform={`rotate(${rot} 540 930)`}>
    <rect x={80} y={330} width={920} height={1200} fill="#fffef6" stroke="#d8d2c2" strokeWidth={3}/>
    {Array.from({length: 19}, (_, i) => <line key={i} x1={80} y1={410 + i * 60} x2={1000} y2={410 + i * 60} stroke="#e9ecef" strokeWidth={2}/>)}
    {children}
  </g>
);
const Loop: React.FC<{start: number}> = ({start}) => (
  <>
    <HDraw shape={sh.arc(540, 1300, 420, 240, Math.PI * 0.1, Math.PI * 1.75, {stroke: BLUE, strokeWidth: 7, seed: 99})} start={start} dur={16}/>
    <HWrite x={540} y={1320} start={start + 6} size={54} anchor="middle" color={BLUE}>back to the napkin</HWrite>
  </>
);

// ---------------- bka: Bank of Baroda ----------------
const A1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={520} start={-9} dur={8} size={92} anchor="middle" hand={false}>Bank of Baroda</HWrite>
    <HWrite x={540} y={740} start={-9} dur={8} size={190} anchor="middle" color={RED} hand={false}>+18%</HWrite>
    <HWrite x={540} y={840} start={-9} dur={8} size={56} anchor="middle" hand={false}>loan growth, Q2</HWrite>
    <HDraw shape={sh.ellipse(540, 690, 520, 220, {stroke: RED, strokeWidth: 8, seed: 11})} start={at("Here's what")} dur={14}/>
    <HWrite x={540} y={1060} start={at("headline hides")} size={70} anchor="middle" color={BLUE}>what's hiding in it?</HWrite>
  </Canvas>
);};
const A2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Napkin>
    <HWrite x={140} y={500} start={0} size={52} color="#555">₹ lakh crore, 30 Sep 2026</HWrite>
    <HWrite x={140} y={650} start={at("fifteen point")} size={110} dur={14}>15.12</HWrite>
    <HWrite x={520} y={650} start={at("fifteen point", 6)} size={50} color="#555">all loans</HWrite>
    <HWrite x={90} y={800} start={at("eleven point")} size={110} dur={14}>− 11.88</HWrite>
    <HWrite x={520} y={800} start={at("eleven point", 6)} size={50} color="#555">in India</HWrite>
    <HDraw shape={sh.line(100, 850, 760, 850, {strokeWidth: 7, seed: 21})} start={at("That leaves")} dur={10}/>
    <HWrite x={140} y={1000} start={at("three point two four")} size={140} color={RED} dur={16}>3.24</HWrite>
    <HWrite x={520} y={1000} start={at("abroad")} size={66} color={RED}>abroad</HWrite>
    <HWrite x={140} y={1110} start={at("abroad", 2)} dur={8} size={40} color="#555" hand={false}>(global − domestic · our arithmetic)</HWrite>
  </Napkin></Canvas>
);};
const A3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={430} start={0} size={66} anchor="middle">growth in a year</HWrite>
    <HWrite x={150} y={620} start={at("forty percent")} size={60} color={RED}>abroad</HWrite>
    <HDraw shape={sh.rect(150, 660, 39.7 / 40 * 760, 110, {stroke: RED, strokeWidth: 6, seed: 31, fill: "rgba(217,72,15,0.18)", fillStyle: "hachure"})} start={at("forty percent")} dur={16}/>
    <HWrite x={760} y={890} start={at("forty percent", 10)} size={90} color={RED}>+39.7%</HWrite>
    <HWrite x={150} y={1010} start={at("Loans in India")} size={60} color={BLUE}>in India</HWrite>
    <HDraw shape={sh.rect(150, 1050, 13.5 / 40 * 760, 110, {stroke: BLUE, strokeWidth: 6, seed: 32, fill: "rgba(28,100,184,0.18)", fillStyle: "hachure"})} start={at("Loans in India", 4)} dur={14}/>
    <HWrite x={150 + 13.5 / 40 * 760 + 30} y={1135} start={at("thirteen")} size={80} color={BLUE}>+13.5%</HWrite>
  </Canvas>
);};
const A4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={300} y={560} start={0} size={130} anchor="middle" color={RED}>21%</HWrite>
    <HWrite x={300} y={650} start={4} size={46} anchor="middle">of the book</HWrite>
    <HWrite x={540} y={800} start={at("delivered")} size={110} anchor="middle">→</HWrite>
    <HWrite x={780} y={1000} start={at("thirty nine")} size={130} anchor="middle" color={RED}>39%</HWrite>
    <HWrite x={780} y={1090} start={at("thirty nine", 4)} size={46} anchor="middle">of the growth</HWrite>
    <HDraw shape={sh.ellipse(780, 980, 380, 220, {stroke: RED, strokeWidth: 7, seed: 41})} start={at("of the growth")} dur={12}/>
    <HWrite x={540} y={1270} start={at("of the growth")} dur={8} size={40} anchor="middle" color="#555" hand={false}>our arithmetic on Baroda's filed figures</HWrite>
  </Canvas>
);};
const A5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={430} start={0} size={70} anchor="middle">overseas loan growth</HWrite>
    <HWrite x={180} y={600} start={at("Baroda")} size={60}>Bank of Baroda</HWrite>
    <HWrite x={780} y={600} start={at("Baroda", 4)} size={70} color={RED}>+40%</HWrite>
    <HWrite x={180} y={720} start={at("P N B")} size={60}>PNB</HWrite>
    <HWrite x={780} y={720} start={at("sixty three")} size={70} color={RED}>+63%</HWrite>
    <HWrite x={540} y={940} start={at("So where")} size={72} anchor="middle" color={BLUE}>where's the growth from?</HWrite>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkb: Bandhan Bank ----------------
const B1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={520} start={-9} dur={8} size={92} anchor="middle" hand={false}>Bandhan Bank</HWrite>
    <HWrite x={540} y={740} start={-9} dur={8} size={160} anchor="middle" color={GREEN} hand={false}>+₹7,803 Cr</HWrite>
    <HWrite x={540} y={840} start={-9} dur={8} size={56} anchor="middle" hand={false}>deposits, in 3 months</HWrite>
    <HWrite x={540} y={1060} start={at("Sounds good")} size={72} anchor="middle">sounds good...</HWrite>
    <HWrite x={540} y={1170} start={at("Look closer")} size={80} anchor="middle" color={RED}>look closer</HWrite>
  </Canvas>
);};
const B2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Napkin>
    <HWrite x={140} y={500} start={0} size={52} color="#555">change in 3 months, ₹ crore</HWrite>
    <HWrite x={140} y={660} start={at("Retail term")} size={50}>retail term deposits</HWrite>
    <HWrite x={740} y={660} start={at("five thousand")} size={72} color={GREEN}>+5,863</HWrite>
    <HWrite x={140} y={800} start={at("Bulk deposits")} size={60}>bulk deposits</HWrite>
    <HWrite x={720} y={800} start={at("four thousand")} size={80} color={GREEN}>+4,288</HWrite>
  </Napkin></Canvas>
);};
const B3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Napkin>
    <HWrite x={140} y={500} start={-9} dur={8} size={52} color="#555" hand={false}>change in 3 months, ₹ crore</HWrite>
    <HWrite x={140} y={660} start={-9} dur={8} size={50} hand={false}>retail term deposits</HWrite>
    <HWrite x={740} y={660} start={-9} dur={8} size={72} color={GREEN} hand={false}>+5,863</HWrite>
    <HWrite x={140} y={800} start={-9} dur={8} size={60} hand={false}>bulk deposits</HWrite>
    <HWrite x={720} y={800} start={-9} dur={8} size={80} color={GREEN} hand={false}>+4,288</HWrite>
    <HWrite x={140} y={940} start={at("But CASA")} size={60} color={RED}>CASA (cheapest)</HWrite>
    <HWrite x={720} y={940} start={at("fell")} size={80} color={RED}>−2,348</HWrite>
    <HDraw shape={sh.line(120, 990, 960, 990, {strokeWidth: 7, seed: 51})} start={at("two thousand three", 6)} dur={10}/>
    <HWrite x={140} y={1110} start={at("two thousand three", 10)} size={60}>total</HWrite>
    <HWrite x={720} y={1110} start={at("two thousand three", 14)} size={80}>+7,803</HWrite>
  </Napkin></Canvas>
);};
const B4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={300} y={520} start={0} size={70} anchor="middle" color={RED}>cheap out</HWrite>
    <HWrite x={780} y={520} start={at("costly money")} size={70} anchor="middle" color={GREEN}>costly in</HWrite>
    <HWrite x={540} y={760} start={at("CASA ratio")} size={60} anchor="middle">CASA ratio</HWrite>
    <HWrite x={260} y={960} start={at("twenty nine")} size={120} anchor="middle">29.4%</HWrite>
    <HWrite x={540} y={950} start={at("to twenty six")} size={100} anchor="middle">→</HWrite>
    <HWrite x={820} y={960} start={at("to twenty six", 4)} size={120} anchor="middle" color={RED}>26.7%</HWrite>
    <HWrite x={540} y={1080} start={at("to twenty six", 8)} dur={8} size={42} anchor="middle" color="#555" hand={false}>June → September 2026</HWrite>
  </Canvas>
);};
const B5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={560} start={0} size={80} anchor="middle" color={RED}>every new loan:</HWrite>
    <HWrite x={540} y={700} start={at("cost Bandhan")} size={90} anchor="middle" color={RED}>costlier to fund?</HWrite>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

// ---------------- bkc: Ujjivan SFB ----------------
const C1: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={540} start={-9} dur={8} size={92} anchor="middle" hand={false}>Ujjivan SFB</HWrite>
    <HWrite x={540} y={720} start={-9} dur={8} size={110} anchor="middle" color={BLUE} hand={false}>microfinance?</HWrite>
    <HWrite x={540} y={860} start={-9} dur={8} size={80} anchor="middle" color={RED} hand={false}>not quite.</HWrite>
    <HWrite x={540} y={1060} start={at("Its own numbers")} size={60} anchor="middle">its own Q2 numbers</HWrite>
  </Canvas>
);};
const C2: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Napkin>
    <HWrite x={140} y={500} start={0} size={56} color="#555">group loans (microfinance)</HWrite>
    <HWrite x={140} y={620} start={0} size={56} color="#555">as % of the book</HWrite>
    <HWrite x={180} y={830} start={at("thirty eight")} size={140} dur={14}>38%</HWrite>
    <HWrite x={520} y={830} start={at("a year ago")} size={56} color="#555">a year ago</HWrite>
    <HWrite x={180} y={1020} start={at("thirty four")} size={140} color={RED} dur={14}>34%</HWrite>
    <HWrite x={520} y={1020} start={at("Now")} size={56} color={RED}>now</HWrite>
    <HWrite x={140} y={1130} start={at("thirty four", 2)} dur={8} size={40} color="#555" hand={false}>(group loans ÷ gross loan book · our arithmetic)</HWrite>
  </Napkin></Canvas>
);};
const C3: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={430} start={0} size={66} anchor="middle">secured loans, % of book</HWrite>
    <HWrite x={150} y={620} start={at("forty seven")} size={56}>a year ago</HWrite>
    <HDraw shape={sh.rect(150, 650, 46.8 / 55 * 780, 110, {strokeWidth: 6, seed: 61, fill: "rgba(0,0,0,0.08)", fillStyle: "hachure"})} start={at("forty seven")} dur={12}/>
    <HWrite x={150 + 46.8 / 55 * 780 + 20} y={735} start={at("forty seven", 6)} size={70}>46.8%</HWrite>
    <HWrite x={150} y={880} start={at("fifty two")} size={56} color={GREEN}>now</HWrite>
    <HDraw shape={sh.rect(150, 910, 52 / 55 * 780, 110, {stroke: GREEN, strokeWidth: 6, seed: 62, fill: "rgba(43,138,62,0.18)", fillStyle: "hachure"})} start={at("fifty two")} dur={12}/>
    <HWrite x={760} y={1140} start={at("fifty two", 6)} size={80} color={GREEN}>52.0%</HWrite>
  </Canvas>
);};
const C4: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas><Napkin rot={1.5}>
    <HWrite x={140} y={520} start={0} size={60}>bad loans (GNPA)</HWrite>
    <HWrite x={160} y={660} start={at("two point four five")} size={100}>2.45%</HWrite>
    <HWrite x={520} y={660} start={at("to two point one")} size={80}>→</HWrite>
    <HWrite x={640} y={660} start={at("to two point one", 4)} size={100} color={GREEN}>2.10%</HWrite>
    <HWrite x={140} y={860} start={at("write offs")} size={60}>write-offs in the quarter</HWrite>
    <HWrite x={140} y={1000} start={at("two hundred")} size={92}>₹213 Cr</HWrite>
    <HWrite x={560} y={1000} start={at("to forty three")} size={80}>→</HWrite>
    <HWrite x={670} y={1000} start={at("to forty three", 4)} size={100} color={GREEN}>₹43 Cr</HWrite>
  </Napkin></Canvas>
);};
const C5: React.FC<SceneP> = ({b}) => { const at = atOf(b); return (
  <Canvas>
    <HWrite x={540} y={520} start={0} size={80} anchor="middle" color={GREEN}>cleaner book,</HWrite>
    <HWrite x={540} y={630} start={at("without")} size={70} anchor="middle" color={GREEN}>without writing off more</HWrite>
    <HWrite x={540} y={860} start={at("Is it still")} size={70} anchor="middle" color={BLUE}>still a microfinance bank?</HWrite>
    <Loop start={at("Back to the napkin")}/>
  </Canvas>
);};

const SCENES: Record<string, React.FC<SceneP>> = {a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, b1: B1, b2: B2, b3: B3, b4: B4, b5: B5, c1: C1, c2: C2, c3: C3, c4: C4, c5: C5};

const Furniture: React.FC<{label: string}> = ({label}) => (
  <Canvas>
    <g transform="rotate(-4 220 150)">
      <rect x={60} y={90} width={420} height={110} fill="#ffe066" stroke="#e0b800" strokeWidth={2}/>
      <text x={270} y={163} fontFamily={HANDFONT} fontSize={52} textAnchor="middle" fill={INK}>napkin math</text>
    </g>
    <text x={1010} y={160} fontFamily={HANDFONT} fontSize={40} textAnchor="end" fill={INK}>{label}</text>
    <text x={540} y={1858} fontFamily={HANDFONT} fontSize={30} textAnchor="middle" fill={INK} opacity={0.6}>Moat &amp; Margin · from the filings</text>
    <text x={540} y={1896} fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize={22} textAnchor="middle" fill={INK} opacity={0.6}>Educational research, not investment advice · not SEBI-registered</text>
  </Canvas>
);

export const BankNapkin: React.FC<{sid: "bka" | "bkb" | "bkc"; label: string}> = ({sid, label}) => {
  const bs = BK[sid]; const fr = frames(bs);
  let from = 0;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
      {bs.map((b, i) => {
        const Scene = SCENES[b.key];
        const el = (
          <Sequence key={b.key} from={from} durationInFrames={fr[i]}>
            <AbsoluteFill><Scene b={b}/></AbsoluteFill>
            <Captions text={b.text} frames={fr[i]}/>
            <Audio src={staticFile(`hand/${sid}/${b.key}.mp3`)}/>
          </Sequence>
        );
        from += fr[i];
        return el;
      })}
      <Furniture label={label}/>
    </AbsoluteFill>
  );
};

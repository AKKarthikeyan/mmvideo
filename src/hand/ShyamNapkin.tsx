// Shyam Metalics Short 2 (3 Oct 2026): hand-drawn "napkin math" format — a marker works the numbers out on paper,
// in contrast to the Vox Short. Loop design (AK's Shorts formula): the last line ("back to the napkin") runs into the first.
// Figures: Shyam Metalics MoU disclosure (2 Oct 2026), FY26 press release (11 May 2026), Q1 FY27 presentation (20 Jul 2026).
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import beats from "../../public/hand/shyam/beats.json";
import {Captions, HDraw, HWrite, INK, PAPER, RED, BLUE, GREEN, HANDFONT, sh} from "../handkit";

export const NFPS = 30;
const PAD = 0.15;
type B = {key: string; text: string; sec: number};
const BS = beats as B[];
export const nFrames = BS.map((b) => Math.ceil((b.sec + PAD) * NFPS));
export const nTotal = nFrames.reduce((a, b) => a + b, 0);

// frame at which a phrase is spoken inside a beat (linear in characters, like the Vox engine)
const at = (b: B, p: string, off = 0) => {
  const i = b.text.toLowerCase().indexOf(p.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${p}`);
  return Math.round(b.sec * NFPS * i / b.text.length) + off;
};
const beat = (k: string) => BS.find((b) => b.key === k)!;

const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>{children}</svg>
);
// lined napkin sheet, slightly rotated
const Napkin: React.FC<{children: React.ReactNode; rot?: number}> = ({children, rot = -2.5}) => (
  <g transform={`rotate(${rot} 540 930)`}>
    <rect x={80} y={330} width={920} height={1200} fill="#fffef6" stroke="#d8d2c2" strokeWidth={3}/>
    {Array.from({length: 19}, (_, i) => <line key={i} x1={80} y1={410 + i * 60} x2={1000} y2={410 + i * 60} stroke="#e9ecef" strokeWidth={2}/>)}
    {children}
  </g>
);

const N1: React.FC = () => {
  const b = beat("n1");
  return (
    <Canvas>
      <HWrite x={540} y={760} start={-9} dur={8} size={150} anchor="middle" color={RED} hand={false}>₹50,000 Cr</HWrite>
      <HDraw shape={sh.line(150, 820, 930, 820, {stroke: RED, strokeWidth: 9, seed: 3})} start={0} dur={10}/>
      <HWrite x={540} y={930} start={14} size={54} anchor="middle" hand={false}>one steel plant · Chandrapur</HWrite>
      <HWrite x={540} y={1010} start={24} size={44} anchor="middle" color="#555" hand={false}>Shyam Metalics · MoU · 1 Oct 2026</HWrite>
      <HDraw shape={sh.ellipse(540, 1210, 640, 190, {stroke: BLUE, strokeWidth: 6, seed: 4})} start={at(b, "Let's check")} dur={14}/>
      <HWrite x={540} y={1230} start={at(b, "Let's check", 6)} size={78} anchor="middle" color={BLUE}>check it on a napkin</HWrite>
    </Canvas>
  );
};

const N2: React.FC = () => {
  const b = beat("n2");
  return (
    <Canvas><Napkin>
      <HWrite x={150} y={520} start={0} size={60} color="#555">Shyam Metalics</HWrite>
      <HWrite x={150} y={640} start={at(b, "revenue")} size={74}>revenue, FY26</HWrite>
      <HWrite x={195} y={835} start={at(b, "eighteen")} size={112} color={BLUE} dur={22}>₹18,552 Cr</HWrite>
      <HDraw shape={sh.rect(165, 730, 790, 150, {stroke: BLUE, strokeWidth: 5, seed: 21})} start={at(b, "fifty two")} dur={14}/>
      <HWrite x={150} y={1020} start={at(b, "fifty two", 8)} size={40} color="#555" hand={false}>(FY26 press release, +22%)</HWrite>
    </Napkin></Canvas>
  );
};

const N3: React.FC = () => {
  const b = beat("n3");
  return (
    <Canvas><Napkin rot={2}>
      <HWrite x={150} y={530} start={0} size={110} dur={18}>50,000</HWrite>
      <HWrite x={150} y={680} start={at(b, "Divide")} size={110} dur={6}>÷</HWrite>
      <HWrite x={290} y={680} start={at(b, "Divide", 6)} size={110} dur={18}>18,552</HWrite>
      <HDraw shape={sh.line(130, 730, 760, 730, {strokeWidth: 7, seed: 31})} start={at(b, "This one")} dur={10}/>
      <HWrite x={170} y={910} start={at(b, "two point seven")} size={170} color={RED} dur={16}>≈ 2.7</HWrite>
      <HWrite x={170} y={1050} start={at(b, "years of sales")} size={76} color={RED}>years of sales</HWrite>
      <HDraw shape={sh.ellipse(470, 950, 800, 340, {stroke: RED, strokeWidth: 7, seed: 32})} start={at(b, "of sales", 4)} dur={16}/>
    </Napkin></Canvas>
  );
};

const N4: React.FC = () => {
  const b = beat("n4");
  return (
    <Canvas>
      <HWrite x={540} y={360} start={0} size={68} anchor="middle">its own plan, 4–5 years</HWrite>
      <HDraw shape={sh.rect(120, 470, 230, 230, {stroke: GREEN, strokeWidth: 6, seed: 41, fill: "rgba(43,138,62,0.22)", fillStyle: "hachure"})} start={at(b, "nine thousand")} dur={16}/>
      <HWrite x={235} y={780} start={at(b, "nine thousand", 8)} size={66} anchor="middle" color={GREEN}>₹9,500 Cr</HWrite>
      <HWrite x={540} y={1300} start={at(b, "from its own cash")} size={42} anchor="middle" color={GREEN} hand={false}>the plan: own cash, no external debt</HWrite>
      <HDraw shape={sh.rect(430, 470, 540, 560, {stroke: RED, strokeWidth: 7, seed: 42, fill: "rgba(217,72,15,0.16)", fillStyle: "hachure"})} start={at(b, "from its own cash", 10)} dur={22}/>
      <HWrite x={700} y={1110} start={at(b, "from its own cash", 26)} size={70} anchor="middle" color={RED}>₹50,000 Cr</HWrite>
      <HWrite x={700} y={1180} start={at(b, "from its own cash", 34)} size={38} anchor="middle" color="#555" hand={false}>the plant (MoU)</HWrite>
    </Canvas>
  );
};

const N5: React.FC = () => {
  const b = beat("n5");
  return (
    <Canvas><Napkin rot={-1.5}>
      <HWrite x={540} y={640} start={0} size={260} anchor="middle" color={RED} dur={14}>5×</HWrite>
      <HWrite x={540} y={760} start={at(b, "the plan")} size={58} anchor="middle">the plan</HWrite>
      <HWrite x={180} y={940} start={at(b, "The gap")} size={64}>50,000 − 9,500 =</HWrite>
      <HWrite x={180} y={1110} start={at(b, "forty thousand")} size={130} color={RED} dur={20}>₹40,500 Cr</HWrite>
      <HDraw shape={sh.line(170, 1150, 900, 1150, {stroke: RED, strokeWidth: 8, seed: 51})} start={at(b, "five hundred crore")} dur={10}/>
      <HWrite x={180} y={1250} start={at(b, "five hundred crore", 8)} size={44} color="#555" hand={false}>our arithmetic</HWrite>
    </Napkin></Canvas>
  );
};

const N6: React.FC = () => {
  const b = beat("n6");
  return (
    <Canvas>
      <HWrite x={540} y={560} start={0} size={150} anchor="middle" color={RED} dur={14}>Who pays?</HWrite>
      <HDraw shape={sh.rect(170, 700, 740, 150, {seed: 61, strokeWidth: 5})} start={at(b, "doesn't say")} dur={12}/>
      <HWrite x={540} y={800} start={at(b, "doesn't say", 6)} size={62} anchor="middle">funding: not stated</HWrite>
      <HDraw shape={sh.rect(220, 920, 640, 150, {stroke: RED, strokeWidth: 9, seed: 62})} start={at(b, "non binding")} dur={10}/>
      <HWrite x={540} y={1020} start={at(b, "non binding", 4)} size={76} anchor="middle" color={RED}>NON-BINDING</HWrite>
      <HDraw shape={sh.arc(540, 1310, 420, 260, Math.PI * 0.1, Math.PI * 1.75, {stroke: BLUE, strokeWidth: 7, seed: 63})} start={at(b, "back to the napkin")} dur={16}/>
      <HWrite x={540} y={1330} start={at(b, "back to the napkin", 6)} size={56} anchor="middle" color={BLUE}>back to the napkin</HWrite>
    </Canvas>
  );
};

const SCENES: Record<string, React.FC> = {n1: N1, n2: N2, n3: N3, n4: N4, n5: N5, n6: N6};

// furniture on every frame: a sticky-note label (frame-1 hook), brand and the on-screen disclaimer footer
const Furniture: React.FC = () => (
  <Canvas>
    <g transform="rotate(-4 220 150)">
      <rect x={60} y={90} width={420} height={110} fill="#ffe066" stroke="#e0b800" strokeWidth={2}/>
      <text x={270} y={163} fontFamily={HANDFONT} fontSize={52} textAnchor="middle" fill={INK}>napkin math</text>
    </g>
    <text x={1010} y={160} fontFamily={HANDFONT} fontSize={40} textAnchor="end" fill={INK}>Shyam Metalics</text>
    <text x={540} y={1858} fontFamily={HANDFONT} fontSize={30} textAnchor="middle" fill={INK} opacity={0.6}>Moat &amp; Margin · from the filings</text>
    <text x={540} y={1896} fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize={22} textAnchor="middle" fill={INK} opacity={0.6}>Educational research, not investment advice · not SEBI-registered</text>
  </Canvas>
);

export const ShyamNapkin: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
      {BS.map((b, i) => {
        const Scene = SCENES[b.key];
        const el = (
          <Sequence key={b.key} from={from} durationInFrames={nFrames[i]}>
            <AbsoluteFill><Scene/></AbsoluteFill>
            <Captions text={b.text} frames={nFrames[i]}/>
            <Audio src={staticFile(`hand/shyam/${b.key}.mp3`)}/>
          </Sequence>
        );
        from += nFrames[i];
        return el;
      })}
      <Furniture/>
    </AbsoluteFill>
  );
};

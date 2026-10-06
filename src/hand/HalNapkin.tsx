// HAL / HATSOFF Short (3 Oct 2026): hand-drawn "napkin math" format, Indian-accent narrator, loop ending.
// Facts: HAL Reg 30 disclosure, 2 Oct 2026 — 50% of HATSOFF (3,84,04,205 shares of ₹10) from CAE Canada at NIL consideration;
// HATSOFF = 50:50 JV for military and civil helicopter pilot training on simulators; FY26 turnover ₹80.95 cr; reason: full management control.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import beats from "../../public/hand/hal/beats.json";
import {Captions, HDraw, HWrite, INK, PAPER, RED, BLUE, GREEN, HANDFONT, sh} from "../handkit";

export const HFPS2 = 30;
const PAD = 0.15;
type B = {key: string; text: string; sec: number};
const BS = beats as B[];
export const halFrames = BS.map((b) => Math.ceil((b.sec + PAD) * HFPS2));
export const halTotal = halFrames.reduce((a, b) => a + b, 0);

const at = (b: B, p: string, off = 0) => {
  const i = b.text.toLowerCase().indexOf(p.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${p}`);
  return Math.round(b.sec * HFPS2 * i / b.text.length) + off;
};
const beat = (k: string) => BS.find((b) => b.key === k)!;

const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>{children}</svg>
);
const Napkin: React.FC<{children: React.ReactNode; rot?: number}> = ({children, rot = -2.5}) => (
  <g transform={`rotate(${rot} 540 930)`}>
    <rect x={80} y={330} width={920} height={1200} fill="#fffef6" stroke="#d8d2c2" strokeWidth={3}/>
    {Array.from({length: 19}, (_, i) => <line key={i} x1={80} y1={410 + i * 60} x2={1000} y2={410 + i * 60} stroke="#e9ecef" strokeWidth={2}/>)}
    {children}
  </g>
);

const H1: React.FC = () => {
  const b = beat("h1");
  return (
    <Canvas>
      <HWrite x={540} y={560} start={-9} dur={8} size={100} anchor="middle" color={BLUE} hand={false}>half a company</HWrite>
      <HWrite x={540} y={700} start={-9} dur={8} size={70} anchor="middle" hand={false}>for</HWrite>
      <HWrite x={540} y={960} start={-9} dur={8} size={260} anchor="middle" color={RED} hand={false}>₹0</HWrite>
      <HDraw shape={sh.ellipse(540, 880, 460, 300, {stroke: RED, strokeWidth: 9, seed: 11})} start={at(b, "The price")} dur={14}/>
      <HWrite x={540} y={1180} start={at(b, "The price", 10)} size={52} anchor="middle" hand={false}>HAL · disclosed 2 Oct 2026</HWrite>
    </Canvas>
  );
};

const H2: React.FC = () => {
  const b = beat("h2");
  const o = {strokeWidth: 6, seed: 21};
  return (
    <Canvas>
      <HWrite x={540} y={420} start={0} size={110} anchor="middle" color={BLUE}>HATSOFF</HWrite>
      {/* helicopter doodle */}
      <HDraw shape={sh.ellipse(470, 760, 330, 190, {...o, seed: 22})} start={at(b, "helicopter")} dur={12}/>
      <HDraw shape={sh.line(630, 750, 880, 720, {...o, seed: 23})} start={at(b, "helicopter", 8)} dur={8}/>
      <HDraw shape={sh.line(880, 680, 880, 770, {...o, seed: 24})} start={at(b, "helicopter", 14)} dur={6}/>
      <HDraw shape={sh.line(250, 640, 700, 640, {...o, seed: 25})} start={at(b, "helicopter", 18)} dur={8}/>
      <HDraw shape={sh.line(470, 640, 470, 665, {...o, seed: 26})} start={at(b, "helicopter", 22)} dur={4}/>
      <HDraw shape={sh.line(360, 900, 600, 900, {...o, seed: 27})} start={at(b, "helicopter", 24)} dur={6}/>
      <HWrite x={540} y={1060} start={at(b, "military")} size={60} anchor="middle">military + civil pilots</HWrite>
      <HDraw shape={sh.rect(240, 1150, 600, 150, {stroke: GREEN, strokeWidth: 6, seed: 28})} start={at(b, "on simulators")} dur={12}/>
      <HWrite x={540} y={1250} start={at(b, "on simulators", 4)} size={70} anchor="middle" color={GREEN}>on simulators</HWrite>
    </Canvas>
  );
};

const H3: React.FC = () => {
  const b = beat("h3");
  return (
    <Canvas>
      <HWrite x={540} y={420} start={0} size={72} anchor="middle">a 50 : 50 joint venture</HWrite>
      <HDraw shape={sh.circle(540, 860, 560, {strokeWidth: 7, seed: 31})} start={at(b, "fifty fifty")} dur={16}/>
      <HDraw shape={sh.line(540, 580, 540, 1140, {strokeWidth: 7, seed: 32})} start={at(b, "joint venture")} dur={10}/>
      <HWrite x={400} y={850} start={at(b, "HAL and")} size={90} anchor="middle" color={BLUE}>HAL</HWrite>
      <HWrite x={400} y={950} start={at(b, "HAL and", 4)} size={60} anchor="middle" color={BLUE}>50%</HWrite>
      <HWrite x={680} y={850} start={at(b, "Canada's CAE")} size={90} anchor="middle" color={RED}>CAE</HWrite>
      <HWrite x={680} y={950} start={at(b, "Canada's CAE", 4)} size={60} anchor="middle" color={RED}>50%</HWrite>
      <HWrite x={540} y={1260} start={at(b, "Canada's CAE", 10)} size={46} anchor="middle" color="#555" hand={false}>CAE, Canada</HWrite>
    </Canvas>
  );
};

const H4: React.FC = () => {
  const b = beat("h4");
  return (
    <Canvas><Napkin>
      <HWrite x={150} y={540} start={0} size={66}>HATSOFF</HWrite>
      <HWrite x={150} y={660} start={at(b, "turnover")} size={70}>turnover, FY26</HWrite>
      <HWrite x={190} y={880} start={at(b, "eighty")} size={140} color={BLUE} dur={20}>₹80.95 Cr</HWrite>
      <HDraw shape={sh.rect(160, 760, 780, 170, {stroke: BLUE, strokeWidth: 5, seed: 41})} start={at(b, "nine five")} dur={12}/>
    </Napkin></Canvas>
  );
};

const H5: React.FC = () => {
  const b = beat("h5");
  return (
    <Canvas><Napkin rot={2}>
      <HWrite x={140} y={520} start={0} size={60} color={RED}>CAE's half</HWrite>
      <HWrite x={140} y={680} start={at(b, "three crore")} size={90} dur={20}>3,84,04,205</HWrite>
      <HWrite x={790} y={680} start={at(b, "shares")} size={48}>shares</HWrite>
      <HWrite x={140} y={820} start={at(b, "ten rupees")} size={100} dur={12}>× ₹10</HWrite>
      <HDraw shape={sh.line(120, 870, 820, 870, {strokeWidth: 7, seed: 51})} start={at(b, "That's about")} dur={10}/>
      <HWrite x={140} y={1030} start={at(b, "thirty eight")} size={125} color={RED} dur={18}>≈ ₹38.4 Cr</HWrite>
      <HWrite x={140} y={1130} start={at(b, "share capital")} size={54} color="#555">of share capital</HWrite>
      <HWrite x={140} y={1220} start={at(b, "That's about", 4)} size={40} color="#555" hand={false}>(face value · our arithmetic)</HWrite>
    </Napkin></Canvas>
  );
};

const H6: React.FC = () => {
  const b = beat("h6");
  return (
    <Canvas>
      <HWrite x={540} y={480} start={0} size={80} anchor="middle">HAL pays:</HWrite>
      <HDraw shape={sh.rect(250, 560, 580, 260, {stroke: RED, strokeWidth: 11, seed: 61})} start={at(b, "nil")} dur={10}/>
      <HWrite x={540} y={750} start={at(b, "nil", 2)} size={180} anchor="middle" color={RED}>NIL</HWrite>
      <HWrite x={540} y={1000} start={at(b, "HAL says")} size={56} anchor="middle">HAL's reason:</HWrite>
      <HWrite x={540} y={1100} start={at(b, "full management")} size={66} anchor="middle" color={BLUE}>full management control</HWrite>
      <HWrite x={540} y={1200} start={at(b, "full management", 14)} size={40} anchor="middle" color="#555" hand={false}>HATSOFF becomes 100% HAL</HWrite>
    </Canvas>
  );
};

const H7: React.FC = () => {
  const b = beat("h7");
  return (
    <Canvas>
      <HWrite x={540} y={500} start={0} size={96} anchor="middle" color={RED}>Why would CAE</HWrite>
      <HWrite x={540} y={620} start={at(b, "walk away")} size={96} anchor="middle" color={RED}>walk away for ₹0?</HWrite>
      <HDraw shape={sh.rect(200, 720, 680, 150, {seed: 71, strokeWidth: 5})} start={at(b, "doesn't say")} dur={12}/>
      <HWrite x={540} y={820} start={at(b, "doesn't say", 6)} size={62} anchor="middle">reason: not stated</HWrite>
      <HDraw shape={sh.arc(540, 1120, 420, 260, Math.PI * 0.1, Math.PI * 1.75, {stroke: BLUE, strokeWidth: 7, seed: 72})} start={at(b, "Back to the napkin")} dur={16}/>
      <HWrite x={540} y={1140} start={at(b, "Back to the napkin", 6)} size={56} anchor="middle" color={BLUE}>back to the napkin</HWrite>
    </Canvas>
  );
};

const SCENES: Record<string, React.FC> = {h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6, h7: H7};

const Furniture: React.FC = () => (
  <Canvas>
    <g transform="rotate(-4 220 150)">
      <rect x={60} y={90} width={420} height={110} fill="#ffe066" stroke="#e0b800" strokeWidth={2}/>
      <text x={270} y={163} fontFamily={HANDFONT} fontSize={52} textAnchor="middle" fill={INK}>napkin math</text>
    </g>
    <text x={1010} y={160} fontFamily={HANDFONT} fontSize={40} textAnchor="end" fill={INK}>HAL · HATSOFF</text>
    <text x={540} y={1858} fontFamily={HANDFONT} fontSize={30} textAnchor="middle" fill={INK} opacity={0.6}>Moat &amp; Margin · from the filings</text>
    <text x={540} y={1896} fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize={22} textAnchor="middle" fill={INK} opacity={0.6}>Educational research, not investment advice · not SEBI-registered</text>
  </Canvas>
);

export const HalNapkin: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
      {BS.map((b, i) => {
        const Scene = SCENES[b.key];
        const el = (
          <Sequence key={b.key} from={from} durationInFrames={halFrames[i]}>
            <AbsoluteFill><Scene/></AbsoluteFill>
            <Captions text={b.text} frames={halFrames[i]}/>
            <Audio src={staticFile(`hand/hal/${b.key}.mp3`)}/>
          </Sequence>
        );
        from += halFrames[i];
        return el;
      })}
      <Furniture/>
    </AbsoluteFill>
  );
};

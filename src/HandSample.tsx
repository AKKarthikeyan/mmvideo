// Sample: drawing hand + napkin math + stick-figure pledge story.
// Facts: Symbiotec Pharmalab SAST Reg 29(1) disclosure by Beacon Trusteeship (NSE, 25 Sep 2026), verified from the document.
import React from "react";
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import beats from "../public/hand/beats.json";
import {Captions, HDraw, HWrite, INK, PAPER, RED, BLUE, GREEN, HANDFONT, sh} from "./handkit";

export const HFPS = 30;
const PAD = 0.6;
export const hBeatFrames = beats.map((b) => Math.ceil((b.sec + PAD) * HFPS));
export const hTotal = hBeatFrames.reduce((a, b) => a + b, 0);

const Canvas: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>{children}</svg>
);
const Brand = () => <text x={60} y={1880} fontFamily={HANDFONT} fontSize={34} fill={INK} opacity={0.6}>Moat &amp; Margin · from the filings</text>;

// stick figure drawn part by part
const Stick: React.FC<{x: number; y: number; start: number; seed: number; color?: string}> = ({x, y, start, seed, color = INK}) => {
  const o = {stroke: color, seed};
  return (
    <g>
      <HDraw shape={sh.circle(x, y, 70, o)} start={start} dur={10}/>
      <HDraw shape={sh.line(x, y + 35, x, y + 150, o)} start={start + 10} dur={7}/>
      <HDraw shape={sh.line(x, y + 70, x - 50, y + 120, o)} start={start + 17} dur={6}/>
      <HDraw shape={sh.line(x, y + 70, x + 55, y + 100, o)} start={start + 23} dur={6}/>
      <HDraw shape={sh.line(x, y + 150, x - 40, y + 230, o)} start={start + 29} dur={6}/>
      <HDraw shape={sh.line(x, y + 150, x + 40, y + 230, o)} start={start + 35} dur={6}/>
    </g>
  );
};

const Hook: React.FC = () => (
  <Canvas>
    <HWrite x={540} y={300} start={4} size={92} anchor="middle">Three family trusts.</HWrite>
    <HWrite x={540} y={440} start={44} size={120} anchor="middle" color={RED}>One pledge.</HWrite>
    {/* share certificate */}
    <HDraw shape={sh.rect(170, 620, 740, 520, {seed: 13, strokeWidth: 5})} start={80} dur={24}/>
    <HDraw shape={sh.rect(200, 650, 680, 460, {seed: 14, strokeWidth: 2})} start={100} dur={18}/>
    <HWrite x={540} y={760} start={112} size={54} anchor="middle" hand={false}>SHARES</HWrite>
    {[830, 880, 930].map((y, i) => <HDraw key={y} shape={sh.line(290, y, 790 - i * 80, y, {seed: 15 + i, strokeWidth: 3})} start={120 + i * 6} dur={8}/>)}
    {/* padlock over the certificate */}
    <HDraw shape={sh.arc(540, 1010, 150, 190, Math.PI, 2 * Math.PI, {stroke: RED, strokeWidth: 9, seed: 18})} start={150} dur={14}/>
    <HDraw shape={sh.rect(445, 1005, 190, 160, {stroke: RED, strokeWidth: 9, seed: 19, fill: "rgba(217,72,15,0.2)", fillStyle: "solid"})} start={164} dur={14}/>
    <HWrite x={540} y={1330} start={180} size={62} anchor="middle" hand={false}>Symbiotec Pharmalab</HWrite>
    <HWrite x={540} y={1410} start={195} size={40} anchor="middle" color="#555" hand={false}>disclosed on NSE, 25 Sep 2026</HWrite>
    <Brand/>
  </Canvas>
);

const Story: React.FC = () => {
  const xs = [190, 400, 610];
  const names = ["Arjun", "Krishna", "Kashish & Anil"];
  return (
    <Canvas>
      <HWrite x={540} y={200} start={0} size={58} anchor="middle" hand={false}>9 Sep 2026</HWrite>
      {xs.map((x, i) => (
        <g key={i}>
          <Stick x={x} y={380} start={4 + i * 42} seed={30 + i}/>
          <HWrite x={x} y={690} start={30 + i * 42} size={34} anchor="middle" hand={false}>{names[i]}</HWrite>
        </g>
      ))}
      <HWrite x={400} y={745} start={130} size={36} anchor="middle" color="#555" hand={false}>Satwani family trusts (promoter group)</HWrite>
      {xs.map((x, i) => <HDraw key={i} shape={sh.line(x, 790, 760 + i * 30, 1010, {seed: 40 + i})} start={150 + i * 8} dur={12}/>)}
      <HWrite x={470} y={900} start={168} size={40} color={BLUE}>shares</HWrite>
      <HDraw shape={sh.rect(620, 1010, 390, 190, {seed: 44, strokeWidth: 5})} start={180} dur={18}/>
      <HWrite x={815} y={1090} start={196} size={40} anchor="middle">Beacon Trusteeship</HWrite>
      <HWrite x={815} y={1150} start={210} size={32} anchor="middle" color="#555" hand={false}>debenture trustee</HWrite>
      <HDraw shape={sh.line(815, 1200, 815, 1340, {seed: 45})} start={230} dur={10}/>
      <HWrite x={815} y={1410} start={240} size={40} anchor="middle" color={RED}>security for debentures</HWrite>
      <Brand/>
    </Canvas>
  );
};

const Napkin: React.FC = () => (
  <Canvas>
    <g transform="rotate(-3 540 900)">
      <rect x={90} y={260} width={900} height={1200} fill="#fffef6" stroke="#d8d2c2" strokeWidth={3}/>
      {Array.from({length: 19}, (_, i) => <line key={i} x1={90} y1={340 + i * 60} x2={990} y2={340 + i * 60} stroke="#e9ecef" strokeWidth={2}/>)}
      <HWrite x={150} y={370} start={0} size={52} color="#555" dur={14}>napkin math</HWrite>
      <HWrite x={320} y={540} start={18} size={84} dur={18}>21,99,104</HWrite>
      <HWrite x={180} y={660} start={42} size={84} dur={6}>+</HWrite>
      <HWrite x={320} y={660} start={48} size={84} dur={18}>21,99,104</HWrite>
      <HWrite x={180} y={780} start={88} size={84} dur={6}>+</HWrite>
      <HWrite x={372} y={780} start={94} size={84} dur={18}>3,50,000</HWrite>
      <HDraw shape={sh.line(170, 825, 800, 825, {strokeWidth: 6, seed: 50})} start={140} dur={12}/>
      <HWrite x={320} y={930} start={155} size={90} color={BLUE} dur={20}>47,48,208</HWrite>
      <HWrite x={820} y={930} start={180} size={44} color={BLUE} dur={10}>shares</HWrite>
      <HWrite x={150} y={1110} start={215} size={62} dur={26}>3.42% + 3.42% + 0.54%</HWrite>
      <HWrite x={320} y={1270} start={255} size={110} color={RED} dur={18}>= 7.38%</HWrite>
      <HDraw shape={sh.ellipse(560, 1235, 560, 200, {stroke: RED, strokeWidth: 7, seed: 51})} start={285} dur={20}/>
      <HWrite x={330} y={1390} start={305} size={42} color="#555" hand={false}>of the company</HWrite>
    </g>
    <Brand/>
  </Canvas>
);

// Proof: the trustee's actual disclosure page (scanned), pledge table boxed, total circled.
const Proof: React.FC = () => {
  const f = useCurrentFrame();
  const slide = interpolate(f, [0, 15], [160, 0], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  const op = interpolate(f, [0, 10], [0, 1], {extrapolateRight: "clamp"});
  // page image 1230x1748 px shown 900 wide at (90, 200): scale 0.7317; table fractions from the page
  const W = 900, H = 900 * 1748 / 1230, X0 = 90, Y0 = 200;
  const fx = (a: number) => X0 + a * W, fy = (a: number) => Y0 + a * H;
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: X0, top: Y0 + slide, width: W, opacity: op, boxShadow: "0 12px 40px rgba(0,0,0,0.18)"}}>
        <Img src={staticFile("hand/symb_p4-4.png")} style={{width: W, display: "block"}}/>
      </div>
      <Canvas>
        <HWrite x={540} y={140} start={2} size={58} anchor="middle" hand={false}>The trustee's own disclosure</HWrite>
        <HDraw shape={sh.rect(fx(0.095), fy(0.155), fx(0.975) - fx(0.095), fy(0.398) - fy(0.155), {stroke: RED, strokeWidth: 6, seed: 91})} start={22} dur={26}/>
        <HDraw shape={sh.ellipse((fx(0.58) + fx(0.975)) / 2, fy(0.381), fx(0.975) - fx(0.56), 64, {stroke: RED, strokeWidth: 7, seed: 92})} start={60} dur={20}/>
        <HWrite x={540} y={1560} start={70} size={34} anchor="middle" hand={false}>Beacon Trusteeship · SAST Reg 29(1) · NSE, 25 Sep 2026</HWrite>
      </Canvas>
    </AbsoluteFill>
  );
};

const Meaning: React.FC = () => (
  <Canvas>
    <HWrite x={540} y={330} start={0} size={80} anchor="middle">A pledge is security</HWrite>
    {[0, 1, 2].map(i => <HDraw key={i} shape={sh.rect(360, 820 - i * 90, 360, 80, {seed: 60 + i, fill: "rgba(28,100,184,0.15)", fillStyle: "hachure"})} start={20 + i * 10} dur={12}/>)}
    <HWrite x={540} y={960} start={50} size={40} anchor="middle" color={BLUE} hand={false}>pledged shares</HWrite>
    <HDraw shape={sh.arc(540, 560, 150, 180, Math.PI, 2 * Math.PI, {stroke: RED, strokeWidth: 8, seed: 64})} start={70} dur={16}/>
    <HDraw shape={sh.rect(450, 555, 180, 150, {stroke: RED, strokeWidth: 8, seed: 65, fill: "rgba(217,72,15,0.18)", fillStyle: "solid"})} start={86} dur={14}/>
    <HWrite x={540} y={1150} start={110} size={50} anchor="middle">If the debentures aren't repaid,</HWrite>
    <HWrite x={540} y={1230} start={145} size={50} anchor="middle" color={RED}>the trustee can enforce the pledge</HWrite>
    <Brand/>
  </Canvas>
);

const Line26: React.FC = () => (
  <Canvas>
    <HWrite x={540} y={330} start={0} size={72} anchor="middle">One line in the deal</HWrite>
    <HDraw shape={sh.rect(390, 560, 300, 640, {seed: 70, fill: "rgba(43,138,62,0.18)", fillStyle: "hachure", stroke: GREEN})} start={20} dur={18}/>
    <HWrite x={540} y={530} start={40} size={46} anchor="middle" color={GREEN} hand={false}>promoter group</HWrite>
    <HDraw shape={sh.line(150, 1030, 930, 1030, {stroke: RED, strokeWidth: 7, seed: 71})} start={60} dur={18}/>
    <HWrite x={150} y={1010} start={80} size={60} color={RED}>26%</HWrite>
    <HWrite x={540} y={1330} start={100} size={54} anchor="middle">must stay at or above 26%</HWrite>
    <Brand/>
  </Canvas>
);

const Close: React.FC = () => (
  <Canvas>
    <HWrite x={540} y={560} start={0} size={96} anchor="middle">Moat &amp; Margin</HWrite>
    <HDraw shape={sh.line(260, 610, 820, 610, {strokeWidth: 5, seed: 81})} start={30} dur={14}/>
    <HWrite x={540} y={800} start={50} size={50} anchor="middle" hand={false}>Educational research,</HWrite>
    <HWrite x={540} y={870} start={60} size={50} anchor="middle" hand={false}>not investment advice.</HWrite>
    <HWrite x={540} y={990} start={85} size={44} anchor="middle" hand={false}>Not a SEBI-registered Research Analyst</HWrite>
    <HWrite x={540} y={1050} start={95} size={44} anchor="middle" hand={false}>or Investment Adviser.</HWrite>
    <HWrite x={540} y={1190} start={120} size={40} anchor="middle" hand={false}>Source: SEBI SAST disclosure on NSE, 25 Sep 2026</HWrite>
  </Canvas>
);

const SCENES: Record<string, React.FC> = {hook: Hook, story: Story, math: Napkin, proof: Proof, meaning: Meaning, line: Line26, close: Close};

export const HandSample: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <style>{`@font-face{font-family:Virgil;src:url(${staticFile("fonts/Virgil-Regular.woff2")}) format("woff2");}`}</style>
      {beats.map((b, i) => {
        const Scene = SCENES[b.key];
        const el = (
          <Sequence key={b.key} from={from} durationInFrames={hBeatFrames[i]}>
            <AbsoluteFill><Scene/></AbsoluteFill>
            {b.key !== "close" && <Captions text={b.text} frames={hBeatFrames[i]}/>}
            <Audio src={staticFile(`hand/${b.key}.mp3`)}/>
          </Sequence>
        );
        from += hBeatFrames[i];
        return el;
      })}
    </AbsoluteFill>
  );
};

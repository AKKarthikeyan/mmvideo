// Vedanta Oil & Gas Short (4 Oct 2026): hand-drawn napkin math, Indian-accent narrator, loop ending.
// Facts: Vedanta Oil & Gas Q2 FY27 production release (3 Oct 2026): gross operated 72.2 vs 89.1 kboepd; Rajasthan 59.9 vs 70.9;
// Cambay 1.1 vs 6.5 (ONGC took over 24 Jul 2026). Split of the fall (≈65% / ≈32%) and 83% share are our arithmetic.
import React from "react";
import beats from "../../public/hand/vog/beats.json";
import {HDraw, HWrite, INK, RED, BLUE, GREEN, HANDFONT, sh, HandBeat, HandCanvas, HandShort, handTotal, spokenAt} from "../handkit";

type B = HandBeat;
const BS = beats as B[];
export const vogTotal = handTotal(BS);

const at = spokenAt;
const beat = (k: string) => BS.find((b) => b.key === k)!;

const Canvas = HandCanvas;
const Napkin: React.FC<{children: React.ReactNode; rot?: number}> = ({children, rot = -2.5}) => (
  <g transform={`rotate(${rot} 540 930)`}>
    <rect x={80} y={330} width={920} height={1200} fill="#fffef6" stroke="#d8d2c2" strokeWidth={3}/>
    {Array.from({length: 19}, (_, i) => <line key={i} x1={80} y1={410 + i * 60} x2={1000} y2={410 + i * 60} stroke="#e9ecef" strokeWidth={2}/>)}
    {children}
  </g>
);

const V1: React.FC = () => {
  const b = beat("v1");
  return (
    <Canvas>
      <HWrite x={540} y={560} start={-9} dur={8} size={110} anchor="middle" hand={false}>Lost a field.</HWrite>
      <HWrite x={540} y={800} start={-9} dur={8} size={180} anchor="middle" color={RED} hand={false}>−19%</HWrite>
      <HWrite x={540} y={930} start={-9} dur={8} size={56} anchor="middle" hand={false}>output, Q2</HWrite>
      <HDraw shape={sh.ellipse(540, 735, 500, 200, {stroke: RED, strokeWidth: 8, seed: 11})} start={at(b, "Output fell")} dur={14}/>
      <HWrite x={540} y={1120} start={at(b, "But the lost")} size={64} anchor="middle" color={BLUE}>but is the field the reason?</HWrite>
      <HWrite x={540} y={1210} start={at(b, "But the lost", 10)} size={40} anchor="middle" color="#555" hand={false}>Vedanta Oil & Gas · Q2 FY27</HWrite>
    </Canvas>
  );
};

const V2: React.FC = () => {
  const b = beat("v2");
  return (
    <Canvas><Napkin>
      <HWrite x={150} y={520} start={0} size={56} color="#555">thousand barrels a day</HWrite>
      <HWrite x={170} y={680} start={at(b, "eighty nine")} size={120} dur={14}>89.1</HWrite>
      <HWrite x={600} y={680} start={at(b, "eighty nine", 4)} size={50} color="#555">a year ago</HWrite>
      <HWrite x={110} y={830} start={at(b, "seventy two")} size={120} dur={14}>− 72.2</HWrite>
      <HWrite x={600} y={830} start={at(b, "seventy two", 4)} size={50} color="#555">this Q2</HWrite>
      <HDraw shape={sh.line(120, 880, 760, 880, {strokeWidth: 7, seed: 21})} start={at(b, "A drop")} dur={10}/>
      <HWrite x={170} y={1030} start={at(b, "sixteen point nine")} size={150} color={RED} dur={16}>16.9</HWrite>
      <HWrite x={520} y={1030} start={at(b, "sixteen point nine", 6)} size={56} color={RED}>lost</HWrite>
    </Napkin></Canvas>
  );
};

const V3: React.FC = () => {
  const b = beat("v3");
  return (
    <Canvas>
      <HWrite x={540} y={420} start={0} size={72} anchor="middle">where the 16.9 went</HWrite>
      <HWrite x={120} y={640} start={at(b, "Cambay")} size={64} color={RED}>Cambay (ONGC)</HWrite>
      <HDraw shape={sh.rect(120, 680, 5.4 / 11.0 * 780, 110, {stroke: RED, strokeWidth: 6, seed: 31, fill: "rgba(217,72,15,0.18)", fillStyle: "hachure"})} start={at(b, "fell by")} dur={14}/>
      <HWrite x={120 + 5.4 / 11.0 * 780 + 30} y={760} start={at(b, "five point four")} size={80} color={RED}>−5.4</HWrite>
    </Canvas>
  );
};

const V4: React.FC = () => {
  const b = beat("v4");
  return (
    <Canvas>
      <HWrite x={540} y={420} start={-9} dur={8} size={72} anchor="middle" hand={false}>where the 16.9 went</HWrite>
      <HWrite x={120} y={640} start={-9} dur={8} size={64} color={RED} hand={false}>Cambay (ONGC)</HWrite>
      <rect x={120} y={680} width={5.4 / 11.0 * 780} height={110} fill="rgba(217,72,15,0.18)" stroke={RED} strokeWidth={5}/>
      <HWrite x={120 + 5.4 / 11.0 * 780 + 30} y={760} start={-9} dur={8} size={80} color={RED} hand={false}>−5.4</HWrite>
      <HWrite x={120} y={920} start={at(b, "Rajasthan")} size={64} color={BLUE}>Rajasthan</HWrite>
      <HDraw shape={sh.rect(120, 960, 780, 110, {stroke: BLUE, strokeWidth: 6, seed: 41, fill: "rgba(28,100,184,0.18)", fillStyle: "hachure"})} start={at(b, "fell by eleven")} dur={18}/>
      <HWrite x={700} y={1180} start={at(b, "eleven")} size={90} color={BLUE}>−11.0</HWrite>
      <HWrite x={120} y={1300} start={at(b, "natural decline")} size={54} color="#555">"natural decline"</HWrite>
    </Canvas>
  );
};

const V5: React.FC = () => {
  const b = beat("v5");
  return (
    <Canvas>
      <HWrite x={540} y={420} start={0} size={72} anchor="middle">share of the fall</HWrite>
      <HDraw shape={sh.circle(540, 860, 560, {strokeWidth: 7, seed: 51})} start={0} dur={14}/>
      <HDraw shape={sh.line(540, 860, 540, 580, {strokeWidth: 6, seed: 52})} start={at(b, "two thirds")} dur={8}/>
      <HDraw shape={sh.line(540, 860, 280, 960, {strokeWidth: 6, seed: 53})} start={at(b, "two thirds", 6)} dur={8}/>
      <HWrite x={650} y={880} start={at(b, "Rajasthan")} size={64} anchor="middle" color={BLUE}>≈65%</HWrite>
      <HWrite x={640} y={950} start={at(b, "Rajasthan", 4)} size={40} anchor="middle" color={BLUE}>Rajasthan</HWrite>
      <HWrite x={400} y={780} start={at(b, "Cambay")} size={56} anchor="middle" color={RED}>≈32%</HWrite>
      <HWrite x={400} y={840} start={at(b, "Cambay", 4)} size={40} anchor="middle" color={RED}>Cambay</HWrite>
      <HWrite x={540} y={1260} start={at(b, "about one third", 6)} size={40} anchor="middle" color="#555" hand={false}>our arithmetic</HWrite>
    </Canvas>
  );
};

const V6: React.FC = () => {
  const b = beat("v6");
  return (
    <Canvas>
      <HWrite x={540} y={480} start={0} size={84} anchor="middle" color={BLUE}>Rajasthan = 83%</HWrite>
      <HWrite x={540} y={570} start={at(b, "of what it produces")} size={52} anchor="middle">of what it produces</HWrite>
      <HWrite x={540} y={760} start={at(b, "How long")} size={80} anchor="middle" color={RED}>its contract term?</HWrite>
      <HDraw shape={sh.rect(170, 840, 740, 130, {seed: 61, strokeWidth: 5})} start={at(b, "don't say")} dur={12}/>
      <HWrite x={540} y={925} start={at(b, "don't say", 6)} size={50} anchor="middle">not in the filings we read</HWrite>
      <HDraw shape={sh.arc(540, 1180, 420, 260, Math.PI * 0.1, Math.PI * 1.75, {stroke: BLUE, strokeWidth: 7, seed: 62})} start={at(b, "Back to the napkin")} dur={16}/>
      <HWrite x={540} y={1200} start={at(b, "Back to the napkin", 6)} size={56} anchor="middle" color={BLUE}>back to the napkin</HWrite>
    </Canvas>
  );
};

const SCENES: Record<string, React.FC> = {v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6};

export const VogNapkin: React.FC = () => <HandShort sid="vog" label="Vedanta Oil & Gas" beats={BS} scenes={SCENES}/>;

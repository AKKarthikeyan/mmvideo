// Experiment: Vox-style documentary collage short, Nuvama / PAG pledge (verified from the SAST disclosures on NSE, 25 Sep 2026).
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import beats from "../public/vox/beats.json";
import {C, COND, TYPE, Counter, Drift, HalftoneCutout, Pin, RedString, Stage, Stamp, Strip, Swipe, Tape, TornCard, TypeLabel, VoxDefs, VoxFonts} from "./voxkit";
import {Captions} from "./handkit";

export const VFPS = 30;
export const vBeatFrames = beats.map((b) => Math.ceil((b.sec + 0.5) * VFPS));
export const vTotal = vBeatFrames.reduce((a, b) => a + b, 0);

const Svg: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>
    <VoxDefs/><Stage/><Drift frames={frames}>{children}</Drift>
    <text x={60} y={1870} fontFamily={TYPE} fontSize={28} fill={C.ink} opacity={0.6}>Moat &amp; Margin · from the filings</text>
  </svg>
);
// Hard cut inside a beat: children visible only in [a, b).
const Cut: React.FC<{a: number; b: number; children: React.ReactNode}> = ({a, b, children}) => {
  const f = useCurrentFrame();
  return f >= a && f < b ? <>{children}</> : null;
};

// Highlighter band behind a line of the filing (not an underline: an underline here read as a strike-through).
const HighlightBand: React.FC<{x: number; y: number; w: number; h: number; start: number}> = ({x, y, w, h, start}) => {
  const f = useCurrentFrame();
  const p = Math.max(0, Math.min(1, (f - start) / 10));
  return p > 0 ? <rect x={x} y={y} width={w * p} height={h} fill={C.mustard} opacity={0.45} style={{mixBlendMode: "multiply"}}/> : null;
};

const SHEET = "M 0 30 L 420 0 L 460 330 L 40 370 Z";                     // a share certificate, slightly skewed
const LOCK = "M 70 150 L 70 95 C 70 20 250 20 250 95 L 250 150 L 215 150 L 215 100 C 215 55 105 55 105 100 L 105 150 Z M 30 150 L 290 150 L 290 360 L 30 360 Z";

const Hook: React.FC<{n: number}> = ({n}) => (
  <Svg frames={n}>
    <Strip x={540} y={620} start={0} text="US DOLLARS" size={54}/>
    <Counter x={540} y={990} start={4} to={450} dur={26} suffix="M" size={330} color={C.ink}/>
    <Swipe x={250} y={1030} w={590} start={32} h={18}/>
    <TypeLabel x={250} y={1230} start={40} text="NUVAMA WEALTH · 25 SEP 2026"/>
  </Svg>
);

const Stake: React.FC<{n: number}> = ({n}) => (
  <Svg frames={n}>
    <Cut a={0} b={72}>
      <Strip x={540} y={430} start={0} text="PAG'S STAKE" size={78}/>
      <HalftoneCutout d={SHEET} start={4} x={310} y={700}/>
      <Stamp x={560} y={890} start={24} text="53.12%" size={96}/>
    </Cut>
    <Cut a={72} b={n}>
      <TornCard x={90} y={640} w={380} h={300} start={72} fill={C.white} rot={-3}>
        <text x={190} y={140} fontFamily={COND} fontWeight={700} fontSize={110} textAnchor="middle" fill={C.ink}>PAG</text>
        <text x={190} y={215} fontFamily={TYPE} fontSize={26} textAnchor="middle" fill={C.ink}>PAGAC Ecstasy Pte Ltd</text>
      </TornCard>
      <TornCard x={610} y={960} w={380} h={300} start={84} fill={C.white} rot={3}>
        <text x={190} y={140} fontFamily={COND} fontWeight={700} fontSize={96} textAnchor="middle" fill={C.ink}>NUVAMA</text>
        <text x={190} y={215} fontFamily={TYPE} fontSize={28} textAnchor="middle" fill={C.ink}>53.12% of shares</text>
      </TornCard>
      <RedString pts={[[380, 950], [700, 960]]} start={100}/>
    </Cut>
  </Svg>
);

const Before: React.FC<{n: number}> = ({n}) => (
  <Svg frames={n}>
    <Cut a={0} b={130}>
      <Strip x={540} y={400} start={0} text="PLEDGED" size={96}/>
      <HalftoneCutout d={SHEET} start={4} x={300} y={760}/>
      <HalftoneCutout d={LOCK} start={26} x={380} y={640} scale={0.95}/>
      <TypeLabel x={300} y={1340} start={44} text="TO LENDERS · SINCE DEC 2024"/>
    </Cut>
    <Cut a={130} b={n}>
      <Strip x={540} y={560} start={130} text="SECURED UNTIL NOW" size={64}/>
      <TornCard x={170} y={720} w={740} h={420} start={132} fill={C.mustard} rot={-2}>
        <Counter x={370} y={290} start={140} to={265} dur={24} prefix="$" suffix="M" size={220} color={C.ink}/>
      </TornCard>
    </Cut>
  </Svg>
);

const Now: React.FC<{n: number}> = ({n}) => (
  <Svg frames={n}>
    <Cut a={0} b={70}>
      <TypeLabel x={150} y={900} start={0} text="25 SEP 2026 — SAST DISCLOSURE" size={40} cps={2}/>
    </Cut>
    <Cut a={70} b={n}>
      <text x={540} y={520} fontFamily={COND} fontWeight={700} fontSize={130} textAnchor="middle" fill={C.gray}>$265M</text>
      <Swipe x={380} y={470} w={330} start={76} h={12}/>
      <Counter x={540} y={950} start={86} from={265} to={450} dur={30} prefix="$" suffix="M" size={330} color={C.red}/>
      <Swipe x={230} y={1000} w={620} start={120} h={18}/>
      <Stamp x={540} y={1300} start={150} text="NO NEW SHARES" size={70} rot={-7}/>
    </Cut>
  </Svg>
);

const Agents: React.FC<{n: number}> = ({n}) => (
  <Svg frames={n}>
    <TornCard x={290} y={1300} w={500} h={200} start={0} fill={C.white}>
      <text x={250} y={125} fontFamily={COND} fontWeight={700} fontSize={84} textAnchor="middle" fill={C.ink}>53.12% STAKE</text>
    </TornCard>
    <Pin x={760} y={640} start={16}/>
    <TypeLabel x={520} y={520} start={30} text="DB TRUSTEES · HONG KONG" size={32}/>
    <Pin x={330} y={900} start={56}/>
    <TypeLabel x={90} y={780} start={70} text="CATALYST TRUSTEESHIP · INDIA" size={32}/>
    <RedString pts={[[760, 640], [620, 1300]]} start={100}/>
    <RedString pts={[[330, 900], [460, 1300]]} start={118}/>
    <Strip x={540} y={330} start={4} text="SECURITY AGENTS" size={72}/>
  </Svg>
);

const Proof: React.FC<{n: number}> = ({n}) => (
  <Svg frames={n}>
    <TornCard x={40} y={700} w={1000} h={260} start={0} fill="#ffffff" rot={-1.5}>
      <image href={staticFile("vox/nuvama_clip-4.png")} x={20} y={60} width={960} height={130}/>
      <HighlightBand x={26} y={124} w={438} h={30} start={24}/>
    </TornCard>
    <Tape x={60} y={680} rot={-14}/>
    <Tape x={860} y={690} rot={12}/>
    <TypeLabel x={150} y={1150} start={34} text="SAST REG 29(2) · NSE · 25 SEP 2026" size={34} cps={2.2}/>
    <Strip x={540} y={470} start={2} text="THE FILING" size={80}/>
  </Svg>
);

const Close: React.FC<{n: number}> = ({n}) => (
  <Svg frames={n}>
    <Cut a={0} b={120}>
      <Strip x={540} y={780} start={2} text="SAME COLLATERAL." size={96}/>
      <Strip x={540} y={980} start={34} text="BIGGER LOAN." size={110} fill={C.red} color={C.white}/>
    </Cut>
    <Cut a={120} b={n}>
      <Strip x={540} y={640} start={120} text="MOAT & MARGIN" size={90}/>
      <TypeLabel x={140} y={860} start={130} text="Educational research, not investment advice." size={30} cps={3}/>
      <TypeLabel x={140} y={950} start={150} text="Not a SEBI-registered Research Analyst." size={30} cps={3}/>
      <TypeLabel x={140} y={1040} start={170} text="Sources: SAST disclosures on NSE, 25 Sep 2026." size={30} cps={3}/>
    </Cut>
  </Svg>
);

const SCENES: Record<string, React.FC<{n: number}>> = {hook: Hook, stake: Stake, before: Before, now: Now, agents: Agents, proof: Proof, close: Close};

export const VoxNuvama: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: C.tan}}>
      <VoxFonts/>
      {beats.map((b, i) => {
        const Scene = SCENES[b.key]; const n = vBeatFrames[i];
        const el = (
          <Sequence key={b.key} from={from} durationInFrames={n}>
            <AbsoluteFill><Scene n={n}/></AbsoluteFill>
            {b.key !== "close" && <Captions text={b.text} frames={n}/>}
            <Audio src={staticFile(`vox/${b.key}.mp3`)}/>
          </Sequence>
        );
        from += n;
        return el;
      })}
    </AbsoluteFill>
  );
};

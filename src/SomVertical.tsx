// Vertical cut-down (~60 s) of the Som long-form pilot, plus the YouTube thumbnail. Same beats, same audio, same clippings.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {C, COND, TYPE, Counter, Drift, HalftoneCutout, RedString, Stage, Stamp, Strip, TornCard, TypeLabel, VoxDefs, VoxFonts} from "./voxkit";
import {Beat, beats, Big, Card, Clip, cueTimes, makeT, TFn, LFPS} from "./SomLong";

const KEYS = ["b00", "b01", "b22", "b24", "b34", "b61"];
const vb = KEYS.map((k) => beats.find((b) => b.key === k)!);
const END = 4 * LFPS;
export const vcFrames = vb.map((b) => Math.ceil((b.sec + 0.4) * LFPS));
export const vcTotal = vcFrames.reduce((a, b) => a + b, 0) + END;

const Svg: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: "absolute"}}>
    <VoxDefs/><Stage/><Drift frames={frames}><g transform="translate(0 200)">{children}</g></Drift>
    <text x={60} y={1860} fontFamily={TYPE} fontSize={28} fill={C.ink} opacity={0.6}>Moat &amp; Margin · from the filings</text>
  </svg>
);
const At: React.FC<{a: number; b?: number; children: React.ReactNode}> = ({a, b = 1e9, children}) => {
  const f = useCurrentFrame(); return f >= a && f < b ? <>{children}</> : null;
};
const FACTORY = "M 0 300 L 0 150 L 110 90 L 110 150 L 220 90 L 220 150 L 330 90 L 330 20 L 380 20 L 380 150 L 470 150 L 470 300 Z";

const V: Record<string, React.FC<{n: number; T: TFn}>> = {
  b00: ({n, T}) => (
    <Svg frames={n}>
      <Strip x={540} y={330} start={0} text="24 SEP 2026" size={84}/>
      <Strip x={540} y={470} start={4} text="SOM DISTILLERIES" size={64} fill={C.red} color={C.white}/>
      <Clip name="court" x={40} y={640} w={956} start={8} hlAt={[T("renew all"), T("fifteen days")]}/>
      <Stamp x={560} y={1000} start={T("fifteen days", 6)} text="RENEW IN 15 DAYS" size={66} rot={-6}/>
    </Svg>
  ),
  b01: ({n, T}) => (
    <Svg frames={n}>
      <At a={0} b={T("And the company")}>
        <Strip x={540} y={380} start={0} text="BHOPAL BREWERY" size={80}/>
        <HalftoneCutout d={FACTORY} start={2} x={305} y={560}/>
        <Stamp x={540} y={1020} start={T("shut since", 4)} text="SHUT SINCE FEB" size={78} rot={-7}/>
      </At>
      <At a={T("And the company")}>
        <Strip x={540} y={330} start={T("And the company")} text="THE LICENCE WAS WORTH" size={70}/>
        <Strip x={540} y={530} start={T("about half")} text="≈ HALF ITS VOLUME" size={76} rot={-1}/>
        <Strip x={540} y={700} start={T("half its quarterly")} text="≈ HALF ITS INCOME" size={76} rot={1}/>
        <Strip x={540} y={870} start={T("and its investment")} text="INVESTMENT GRADE" size={76} fill={C.red} color={C.white} rot={-1}/>
      </At>
    </Svg>
  ),
  b22: ({n, T}) => (
    <Svg frames={n}>
      <Strip x={540} y={330} start={0} text="TOTAL INCOME · APR–JUN" size={66}/>
      <At a={T("from five")}><Big x={540} y={560} text="₹530.1 CR" size={130} color={C.gray}/></At>
      <Counter x={540} y={820} start={T("fell to")} from={530.1} to={268.8} dur={36} decimals={1} prefix="₹" suffix=" CR" size={170} color={C.red}/>
      <Stamp x={540} y={1060} start={T("a year earlier")} text="DOWN 49%" size={90} rot={-5}/>
    </Svg>
  ),
  b24: ({n, T}) => (
    <Svg frames={n}>
      <Strip x={540} y={330} start={0} text="WHAT DID IT COST?" size={80}/>
      <Clip name="lost250" x={40} y={520} w={956} start={T("management answered", -4)} hlAt={[T("I think")]}/>
      <TypeLabel x={90} y={820} start={T("I think")} text="EARNINGS CALL · 13 AUG 2026" size={32} cps={3}/>
      <Stamp x={540} y={1040} start={T("revenue.", -8)} text="≈ ₹250 CR LOST" size={80} rot={-5}/>
    </Svg>
  ),
  b34: ({n, T}) => (
    <Svg frames={n}>
      <Strip x={540} y={560} start={0} text="A LICENSED LOCAL PLANT" size={72}/>
      <Strip x={540} y={690} start={4} text="= REAL ADVANTAGE" size={72}/>
      <Strip x={540} y={900} start={T("And it can")} text="ONE STATE ORDER" size={80} fill={C.red} color={C.white} rot={-1}/>
      <Strip x={540} y={1040} start={T("And it can", 6)} text="CAN SWITCH IT OFF" size={80} fill={C.red} color={C.white} rot={1}/>
    </Svg>
  ),
  b61: ({n, T}) => (
    <Svg frames={n}>
      <Card x={240} y={260} w={600} h={180} start={0} rot={-1} lines={[["", 0], ["THE LICENCE", 125]]}/>
      <RedString pts={[[440, 440], [330, 580]]} start={T("the moat")}/>
      <RedString pts={[[640, 440], [750, 900]]} start={T("biggest")}/>
      <Card x={60} y={570} w={560} h={260} start={T("the moat")} rot={-2} fill={C.mustard} lines={[["", 0], ["THE MOAT", 170]]}/>
      <Card x={420} y={890} w={600} h={260} start={T("biggest")} rot={2} lines={[["", 0], ["THE BIGGEST RISK", 170, C.red]]}/>
      <Stamp x={340} y={870} start={T("restores")} text="RESTORED" size={56} rot={-6}/>
      <Stamp x={720} y={1200} start={T("does not remove")} text="STILL THERE" size={56} rot={5}/>
    </Svg>
  ),
};
const EndCard: React.FC = () => (
  <Svg frames={END}>
    <Strip x={540} y={600} start={0} text="FULL STORY · 6 MIN" size={80} fill={C.red} color={C.white}/>
    <Strip x={540} y={760} start={4} text="MOAT & MARGIN" size={96}/>
    <TypeLabel x={110} y={980} start={10} text="Every figure from the company's own filings." size={30} cps={4}/>
    <TypeLabel x={110} y={1070} start={20} text="Educational research, not investment advice." size={30} cps={4}/>
    <TypeLabel x={110} y={1160} start={30} text="Not a SEBI-registered Research Analyst." size={30} cps={4}/>
  </Svg>
);
const VCaptions: React.FC<{b: Beat}> = ({b}) => {
  const f = useCurrentFrame(); const ts = cueTimes(b);
  const cur = ts.find((t) => f < t.b) ?? ts[ts.length - 1];
  return (
    <div style={{position: "absolute", left: 60, right: 60, bottom: 330, textAlign: "center"}}>
      <span style={{background: "rgba(255,255,255,0.8)", color: "#1d1d1f", fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: 40, lineHeight: 1.4, padding: "6px 14px", borderRadius: 8, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone"}}>{cur.text}</span>
    </div>
  );
};

export const SomVertical: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: C.tan}}>
      <VoxFonts/>
      {vb.map((b, i) => {
        const n = vcFrames[i]; const Scene = V[b.key];
        const el = (
          <Sequence key={b.key} from={from} durationInFrames={n}>
            <AbsoluteFill><Scene n={n} T={makeT(b)}/></AbsoluteFill>
            <VCaptions b={b}/>
            <Audio src={staticFile(`long/${b.key}.mp3`)}/>
          </Sequence>
        );
        from += n; return el;
      })}
      <Sequence from={from} durationInFrames={END}><AbsoluteFill><EndCard/></AbsoluteFill></Sequence>
    </AbsoluteFill>
  );
};

// YouTube thumbnail, 1280x720: one hero line, one real clipping, one stamp.
export const SomThumb: React.FC = () => (
  <AbsoluteFill style={{background: C.tan}}>
    <VoxFonts/>
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: "absolute"}}>
      <VoxDefs/><Stage w={1280} h={720}/>
      <Clip name="court" x={560} y={400} w={660} start={-100} hlAt={[-100, -100]} rot={2}/>
      <Strip x={420} y={150} start={-100} text="THE LICENCE" size={120}/>
      <Strip x={420} y={305} start={-100} text="WAS THE BUSINESS" size={92} fill={C.red} color={C.white} rot={-1.5}/>
      <Stamp x={270} y={540} start={-100} text="INCOME −49%" size={70} rot={-8}/>
      <text x={40} y={690} fontFamily={COND} fontWeight={700} fontSize={44} fill={C.ink}>SOM DISTILLERIES</text>
    </svg>
  </AbsoluteFill>
);

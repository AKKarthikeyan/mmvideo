// ShortStage (16 Nov 2026, INNER_CHARIOT_PLAN_DEC_JAN.md runway): the 9:16 frame for the channel's daily Shorts.
// Everything that must be read stays inside SHORT_SAFE (YouTube covers the top, the right rail and the bottom of a Short);
// `safe` draws those zones in red for frame checks. A Short is one verse or one idea, 25-45 s:
//   hook (a question or a surprise, by 0:02) -> the verse on the palm leaf (ManuscriptVerse, tall) -> one plain line -> the
//   pointer to the long video. VerseShort below is that skeleton with no voice yet (a layout sample to judge the look).
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from "remotion";
import {K, SA, EN, CAPS, KathaFonts, KathaDefs, Finish} from "./look";
import {ManuscriptVerse, MVerse, SHORT_SAFE} from "./manuscript";

export const SW = 1080, SH = 1920;
const ip = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

export const SafeZones: React.FC = () => (
  <svg width={SW} height={SH} style={{position: "absolute"}}>
    <rect x={0} y={0} width={SW} height={SHORT_SAFE.top} fill="#ff0000" opacity={0.22}/>
    <rect x={SHORT_SAFE.right} y={SHORT_SAFE.top} width={SW - SHORT_SAFE.right} height={SHORT_SAFE.bottom - SHORT_SAFE.top} fill="#ff0000" opacity={0.22}/>
    <rect x={0} y={SHORT_SAFE.bottom} width={SW} height={SH - SHORT_SAFE.bottom} fill="#ff0000" opacity={0.22}/>
    <rect x={SHORT_SAFE.left} y={SHORT_SAFE.top} width={SHORT_SAFE.right - SHORT_SAFE.left} height={SHORT_SAFE.bottom - SHORT_SAFE.top} fill="none" stroke="#00ff66" strokeWidth={3} strokeDasharray="12 10"/>
  </svg>
);
export const ShortStage: React.FC<{children: React.ReactNode; safe?: boolean}> = ({children, safe}) => (
  <AbsoluteFill style={{background: K.night, width: SW, height: SH}}>
    <KathaFonts/>
    {children}
    {safe ? <SafeZones/> : null}
  </AbsoluteFill>
);
// A line of large type inside the safe box (the hook, the plain line, the pointer).
const Say: React.FC<{f: number; at: number; until: number; text: string; sub?: string; y?: number; size?: number}> = ({f, at, until, text, sub, y = 760, size = 74}) => {
  const o = ip(f, at, at + 10) * ip(f, until - 10, until, 1, 0);
  return (
    <div style={{position: "absolute", left: SHORT_SAFE.left + 10, width: SHORT_SAFE.right - SHORT_SAFE.left - 20, top: y, textAlign: "center", opacity: o,
      transform: `translateY(${(1 - ip(f, at, at + 14)) * 20}px)`}}>
      <div style={{fontFamily: EN, fontStyle: "italic", fontWeight: 600, fontSize: size, lineHeight: 1.18, color: K.cream, textShadow: "0 2px 12px rgba(0,0,0,.6)"}}>{text}</div>
      {sub ? <div style={{fontFamily: CAPS, fontWeight: 600, fontSize: 26, letterSpacing: 6, color: K.gold, marginTop: 26}}>{sub}</div> : null}
    </div>
  );
};
export type VerseShortP = {v: MVerse; hook: string; hookSub?: string; line: string; pointer: string; safe?: boolean};
// Timing (30 fps): hook 0-75, verse 60-420, plain line 420-500, pointer 500-570.
export const VerseShort: React.FC<VerseShortP> = ({v, hook, hookSub, line, pointer, safe}) => {
  const f = useCurrentFrame();
  return (
    <ShortStage safe={safe}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 50% at 50% 40%, #2A1F4A 0%, ${K.indigo} 55%, ${K.night} 100%)`}}/>
      <Say f={f} at={0} until={75} text={hook} sub={hookSub} y={720} size={80}/>
      <Sequence from={60} durationInFrames={360}><ManuscriptVerse v={v} layout="tall" out={340} finish={false}/></Sequence>
      <Say f={f} at={420} until={500} text={line} y={760} size={70}/>
      <Say f={f} at={500} until={570} text={pointer} y={800} size={56}/>
      <svg width={SW} height={SH} style={{position: "absolute"}}><KathaDefs/><Finish f={f} w={SW} h={SH}/></svg>
    </ShortStage>
  );
};

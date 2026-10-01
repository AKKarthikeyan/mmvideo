// Instagram carousel (1080x1350, Vox style). One frame = one slide; render with `--sequence` to get PNGs.
// Slides come from public/carousel/<id>/carousel.json. Clips are the real PDF clippings from public/vx/<vid>/clips.
import React from "react";
import {AbsoluteFill, Sequence, staticFile} from "remotion";
import {C, COND, TYPE, Stage, Stamp, Strip, Tape, TornCard, TypeLabel, VoxDefs, VoxFonts} from "../voxkit";

export type Slide = {type: string; [k: string]: any};
export type CData = {id: string; vid: string; kicker: string; slides: Slide[]; clips: Record<string, {w: number; h: number; hl: number[][]}>};
const W = 1080, H = 1350;
const fit = (t: string, size: number, maxW: number, k = 0.52) => Math.min(size, maxW / (Math.max(1, t.length) * k + 0.8));
const wrap = (text: string, max: number) => {
  const out: string[] = []; let cur = "";
  for (const w of text.split(" ")) { if ((cur + " " + w).trim().length > max) { out.push(cur.trim()); cur = w; } else cur += " " + w; }
  if (cur.trim()) out.push(cur.trim()); return out;
};
const S = -100; // settled: every animated kit component shows its final state

const Frame: React.FC<{D: CData; i: number; n: number; children: React.ReactNode}> = ({D, i, n, children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}>
    <VoxDefs/><Stage w={W} h={H}/>
    {children}
    <rect x={0} y={0} width={W} height={12} fill={C.ink}/>
    <rect x={0} y={0} width={W * (i + 1) / n} height={12} fill={C.red}/>
    <text x={50} y={1300} fontFamily={TYPE} fontSize={26} fill={C.ink} opacity={0.7}>Moat &amp; Margin · from the filings</text>
    <text x={1030} y={1300} fontFamily={COND} fontWeight={700} fontSize={30} fill={C.ink} textAnchor="end">{`${i + 1}/${n}`}</text>
  </svg>
);

const ClipCard: React.FC<{D: CData; k: string; x: number; y: number; w: number; rot?: number}> = ({D, k, x, y, w, rot = -1}) => {
  const c = D.clips[k]; const pad = 18; const ih = w * c.h / c.w;
  return (
    <TornCard x={x} y={y} w={w + pad * 2} h={ih + pad * 2} start={S} fill="#fff" rot={rot}>
      <image href={staticFile(`vx/${D.vid}/clips/${k}.png`)} x={pad} y={pad} width={w} height={ih}/>
      {c.hl.map(([hx, hy, hw, hh], j) => <rect key={j} x={pad + hx * w} y={pad + hy * ih} width={hw * w} height={hh * ih} fill={C.mustard} opacity={0.45} style={{mixBlendMode: "multiply"}}/>)}
      <Tape x={-24} y={-20} rot={-12} w={110}/>
    </TornCard>
  );
};

const Cover: React.FC<{D: CData; s: Slide}> = ({D, s}) => (
  <>
    <TypeLabel x={70} y={150} start={S} text={D.kicker} size={34}/>
    {s.lines.map((t: string, i: number) => (
      <Strip key={i} x={540} y={300 + i * 150} start={S} text={t} size={fit(t, 110, 960)} fill={i === s.lines.length - 1 ? C.red : C.white} color={i === s.lines.length - 1 ? C.white : C.ink} rot={i % 2 ? 1 : -1}/>
    ))}
    {s.clip && <ClipCard D={D} k={s.clip} x={50} y={300 + s.lines.length * 150 + 20} w={940} rot={1.5}/>}
    {s.stamp && <Stamp x={540} y={1130} start={S} text={s.stamp} size={fit(s.stamp, 78, 900, 0.56)} rot={-6}/>}
    <text x={1030} y={1230} fontFamily={COND} fontWeight={700} fontSize={40} textAnchor="end" fill={C.ink}>SWIPE →</text>
  </>
);
const Stat: React.FC<{D: CData; s: Slide}> = ({s}) => (
  <>
    <Strip x={540} y={170} start={S} text={s.heading} size={fit(s.heading, 60, 960)}/>
    {s.was && <text x={540} y={430} fontFamily={COND} fontWeight={700} fontSize={fit(s.was, 110, 900, 0.5)} textAnchor="middle" fill={C.gray}>{s.was}</text>}
    <text x={540} y={s.was ? 660 : 620} fontFamily={COND} fontWeight={700} fontSize={fit(s.big, 250, 980, 0.5)} textAnchor="middle" fill={C.red}>{s.big}</text>
    {s.sub && <Strip x={540} y={s.was ? 790 : 770} start={S} text={s.sub} size={fit(s.sub, 48, 960)}/>}
    {s.body && wrap(s.body, 38).map((t, i) => <text key={i} x={540} y={930 + i * 58} fontFamily={TYPE} fontSize={40} textAnchor="middle" fill={C.ink}>{t}</text>)}
    {s.stamp && <Stamp x={540} y={1180} start={S} text={s.stamp} size={fit(s.stamp, 64, 900, 0.56)} rot={-5}/>}
  </>
);
const Bars: React.FC<{D: CData; s: Slide}> = ({s}) => {
  const max = Math.max(...s.rows.map((r: any) => r.v));
  return (
    <>
      <Strip x={540} y={170} start={S} text={s.heading} size={fit(s.heading, 58, 960)}/>
      {s.rows.map((r: any, i: number) => {
        const y = 330 + i * 200, bw = 680 * r.v / max;
        return <g key={i}>
          <text x={60} y={y} fontFamily={COND} fontWeight={700} fontSize={fit(r.name, 46, 960, 0.5)} fill={C.ink}>{r.name}</text>
          <rect x={60} y={y + 24} width={bw} height={90} fill={r.red ? C.red : C.ink}/>
          <text x={80 + bw} y={y + 92} fontFamily={COND} fontWeight={700} fontSize={60} fill={r.red ? C.red : C.ink}>{r.label}</text>
        </g>;
      })}
      {s.body && wrap(s.body, 40).map((t, i) => <text key={i} x={60} y={330 + s.rows.length * 200 + 60 + i * 56} fontFamily={TYPE} fontSize={38} fill={C.ink}>{t}</text>)}
      {s.stamp && <Stamp x={540} y={1180} start={S} text={s.stamp} size={fit(s.stamp, 64, 900, 0.56)} rot={-5}/>}
    </>
  );
};
const Quote: React.FC<{D: CData; s: Slide}> = ({D, s}) => {
  const lines = wrap(s.text, 28); const lh = 72; const h = lines.length * lh + 110;
  return (
    <>
      <Strip x={540} y={170} start={S} text={s.heading} size={fit(s.heading, 58, 960)}/>
      <TornCard x={60} y={270} w={960} h={h} start={S} fill={C.white} rot={-1}>
        {lines.map((t, i) => <text key={i} x={480} y={95 + i * lh} fontFamily={TYPE} fontSize={54} textAnchor="middle" fill={C.ink}>{t}</text>)}
      </TornCard>
      <TypeLabel x={80} y={270 + h + 80} start={S} text={s.who} size={28}/>
      {s.clip && <ClipCard D={D} k={s.clip} x={50} y={270 + h + 150} w={940} rot={1}/>}
    </>
  );
};
const List: React.FC<{D: CData; s: Slide}> = ({s}) => (
  <>
    <Strip x={540} y={170} start={S} text={s.heading} size={fit(s.heading, 60, 960)}/>
    {s.items.map((t: string, i: number) => {
      const y = 290 + i * 170, on = i === s.items.length - 1 && s.lastRed;
      return <g key={i}>
        <rect x={50} y={y} width={980} height={130} fill={on ? C.red : C.white} style={{filter: "url(#vshadow)"}}/>
        <text x={100} y={y + 88} fontFamily={COND} fontWeight={700} fontSize={64} textAnchor="middle" fill={on ? C.white : C.gray}>{i + 1}</text>
        {wrap(t, 34).slice(0, 2).map((ln, k, arr) => <text key={k} x={150} y={y + (arr.length > 1 ? 58 + k * 48 : 82)} fontFamily={COND} fontWeight={700} fontSize={arr.length > 1 ? 40 : 46} fill={on ? C.white : C.ink}>{ln}</text>)}
      </g>;
    })}
  </>
);
const Moat: React.FC<{D: CData; s: Slide}> = ({s}) => (
  <>
    <Strip x={540} y={170} start={S} text={s.heading || "THE MOAT QUESTION"} size={64}/>
    <TornCard x={60} y={270} w={960} h={300} start={S} fill={C.mustard} rot={-1}>
      <text x={480} y={90} fontFamily={COND} fontWeight={700} fontSize={40} textAnchor="middle" fill={C.ink}>{s.label || "FOCUS MOAT"}</text>
      <text x={480} y={200} fontFamily={COND} fontWeight={700} fontSize={fit(s.focus, 96, 900, 0.5)} textAnchor="middle" fill={C.ink}>{s.focus}</text>
    </TornCard>
    {wrap(s.body, 38).map((t, i) => <text key={i} x={540} y={680 + i * 58} fontFamily={TYPE} fontSize={40} textAnchor="middle" fill={C.ink}>{t}</text>)}
    <TornCard x={160} y={960} w={760} h={220} start={S} fill={C.white} rot={1}>
      <text x={380} y={80} fontFamily={COND} fontWeight={700} fontSize={40} textAnchor="middle" fill={C.ink}>MOATSCORE</text>
      <text x={380} y={170} fontFamily={COND} fontWeight={700} fontSize={fit(s.score, 80, 700, 0.5)} textAnchor="middle" fill={C.red}>{s.score}</text>
    </TornCard>
  </>
);
const End: React.FC<{D: CData; s: Slide}> = ({s}) => (
  <>
    <Strip x={540} y={260} start={S} text="MOAT & MARGIN" size={110}/>
    <Strip x={540} y={420} start={S} text="READ THE FULL ARTICLE" size={62} fill={C.red} color={C.white}/>
    <text x={540} y={540} fontFamily={TYPE} fontSize={40} textAnchor="middle" fill={C.ink}>moatmarginresearch.com · link in bio</text>
    {(s.sources || []).map((t: string, i: number) => <TypeLabel key={i} x={80} y={680 + i * 70} start={S} text={t} size={fit(t, 28, 900, 0.62)}/>)}
    {["Educational research, not investment advice.", "Not a SEBI-registered Research Analyst."].map((t, i) =>
      <text key={i} x={540} y={1130 + i * 56} fontFamily={TYPE} fontSize={34} textAnchor="middle" fill={C.ink}>{t}</text>)}
  </>
);
const KINDS: Record<string, React.FC<{D: CData; s: Slide}>> = {cover: Cover, stat: Stat, bars: Bars, quote: Quote, list: List, moat: Moat, end: End};

export const CarouselComp: React.FC<{D: CData}> = ({D}) => (
  <AbsoluteFill style={{background: C.tan}}>
    <VoxFonts/>
    {D.slides.map((s, i) => {
      const K = KINDS[s.type];
      return <Sequence key={i} from={i} durationInFrames={1}><AbsoluteFill><Frame D={D} i={i} n={D.slides.length}><K D={D} s={s}/></Frame></AbsoluteFill></Sequence>;
    })}
  </AbsoluteFill>
);

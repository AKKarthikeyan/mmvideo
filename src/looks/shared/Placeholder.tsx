// A plain, working stand-in for a look: brand ground, every beat's own text from data.json, numbers drawn only from their
// lock frame (blank shapes before it), the closing map for basket stories, the brand bug, and the Short's music and
// narration. The three look files (slab/, counter/, dispatch/) use it until their builders replace them; it also shows
// how a look reads LookData and brand tokens without typing a colour or a font.
import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import type {ColorRole, LookBrand} from "../brands/types";
import {BrandBug} from "./BrandBug";
import {fitCss, fitFont, fitLines, fitSize, measure, wrap, type FitFont} from "./fit";
import {LookAudio} from "./LookAudio";
import {shown} from "./lock";
import {MapClose} from "./MapClose";
import {plain} from "./text";
import {beatAt} from "./useLookData";
import type {LookBeat, LookData, LookNum, LookProps} from "./types";

export type Scheme = {ground: ColorRole; ink: ColorRole; acc: ColorRole; num: ColorRole; soft: ColorRole; bar: ColorRole; track: ColorRole; on: "light" | "dark"};

// A glyph-free block the size of the number it stands for.
const Blank: React.FC<{w: number; size: number; color: string}> = ({w, size, color}) =>
  <span style={{display: "inline-block", width: w, height: size * 0.68, borderRadius: size * 0.08, background: color, opacity: 0.35, verticalAlign: "baseline"}}/>;

// One script line with its *starred* words in the accent colour and every printed number gated by its lock frame.
const GatedLine: React.FC<{line: string; nums: LookNum[]; font: FitFont; size: number; ink: string; acc: string; soft: string; f: number}> = ({line, nums, font, size, ink, acc, soft, f}) => {
  // characters of the plain line, each with its emphasis and the number (index into nums) it belongs to
  const cs: {ch: string; hot: boolean; n: number}[] = [];
  let on = false;
  for (const ch of line) { if (ch === "*") { on = !on; continue; } cs.push({ch, hot: on, n: -1}); }
  const text = cs.map((c) => c.ch).join("");
  let from = 0;
  nums.forEach((n, k) => {
    const i = text.indexOf(n.text, from);
    if (i < 0 || cs.slice(i, i + n.text.length).some((c) => c.n >= 0)) return;
    for (let j = i; j < i + n.text.length; j++) cs[j].n = k;
    from = i + n.text.length;
  });
  const segs: {t: string; hot: boolean; n: number}[] = [];
  for (const c of cs) {
    const last = segs[segs.length - 1];
    if (last && last.hot === c.hot && last.n === c.n) last.t += c.ch; else segs.push({t: c.ch, hot: c.hot, n: c.n});
  }
  return <div style={{...fitCss(font, size), lineHeight: 1.04, color: ink}}>
    {segs.map((s, i) => s.n >= 0 && !shown(nums[s.n], f)
      ? <Blank key={i} w={measure(s.t, font, size)} size={size} color={soft}/>
      : <span key={i} style={{color: s.hot ? acc : ink}}>{s.t}</span>)}
  </div>;
};

const Lines: React.FC<{B: LookBrand; b: LookBeat; S: Scheme; f: number; max: number; top: number}> = ({B, b, S, f, max, top}) => {
  const font = fitFont(B.f.display), W = B.safe.x1 - B.safe.x0;
  const nums = [...b.tokens.map((t) => t.num).filter(Boolean) as LookNum[], ...b.lineNums];
  return <div style={{position: "absolute", left: B.safe.x0, top, width: W}}>
    {(() => {
      // one size for the whole stack: the largest at which every line fits the safe width
      const size = Math.min(...(b.lines ?? []).map((l) => fitSize(plain(l), font, W, max, 24)));
      return (b.lines ?? []).map((l, i) => <GatedLine key={i} line={l} nums={nums} font={font} size={size} ink={B.c[S.ink]} acc={B.c[S.acc]} soft={B.c[S.soft]} f={f}/>);
    })()}
    {b.note && <div style={{...B.f.body.css, fontWeight: 500, fontSize: 34, lineHeight: 1.3, color: B.c[S.soft], marginTop: 40}}>
      {wrap(b.note, fitFont(B.f.body), 34, W).map((x, i) => <div key={i} style={{whiteSpace: "pre"}}>{x}</div>)}</div>}
  </div>;
};

const Fact: React.FC<{L: LookData; B: LookBrand; b: LookBeat; S: Scheme; f: number; top: number}> = ({L, B, b, S, f, top}) => {
  const W = B.safe.x1 - B.safe.x0, x0 = B.safe.x0;
  const hero = fitFont(B.f.hero), disp = fitFont(B.f.display), body = fitFont(B.f.body);
  const big = b.big;
  const bigSize = big ? fitSize(big.text, hero, W, 280, 90) : 0;
  const nameSize = fitSize(b.name ?? "", disp, W, 104, 48);
  const textShowF = Math.max(b.f0 + 8, ...b.textNums.map((n) => n.lockF));
  const T = fitLines(b.text ?? "", body, W, 3, 52, 34);
  const bars = b.barsL;
  const maxFrac = Math.max(1e-9, ...bars.map((r) => r.frac));
  const nameW = Math.min(300, Math.max(...bars.map((r) => measure(r.name, body, 34)), 0) + 18);
  const labW = Math.max(...bars.map((r) => measure(r.label, hero, 44)), 0) + 14;
  const trackW = W - nameW - labW;
  let y = top;
  const kickerY = y; y += 56;
  const nameY = y; y += nameSize * 1.1 + 24;
  const bigY = y; y += bigSize * 1.02 + 26;
  const textY = y; y += T.lines.length * T.size * 1.2 + 34;
  const barsY = y;
  return <>
    <div style={{position: "absolute", left: x0, top: kickerY, width: W, ...B.f.body.css, fontWeight: 800, fontSize: fitSize(b.kicker ?? "", {...body, weight: 800, letterSpacing: 0.08}, W, 36, 22),
      letterSpacing: "0.08em", whiteSpace: "pre", color: B.c[S.acc]}}>{b.kicker}</div>
    <div style={{position: "absolute", left: x0, top: nameY, ...fitCss(disp, nameSize), lineHeight: 1.05, color: B.c[S.ink]}}>{b.name}</div>
    {big && <div style={{position: "absolute", left: x0, top: bigY, ...fitCss(hero, bigSize), lineHeight: 1, color: B.c[S.num]}}>
      {shown(big, f) ? big.text : <Blank w={measure(big.text, hero, bigSize)} size={bigSize} color={B.c[S.soft]}/>}</div>}
    {f >= textShowF && <div style={{position: "absolute", left: x0, top: textY, width: W, ...B.f.body.css, fontWeight: 600, fontSize: T.size, lineHeight: 1.2, color: B.c[S.ink]}}>
      {T.lines.map((l, i) => <div key={i} style={{whiteSpace: "pre"}}>{l}</div>)}</div>}
    {bars.map((r, i) => {
      const yy = barsY + i * 76, ok = shown(r.num, f);
      return <div key={i} style={{position: "absolute", left: x0, top: yy, width: W, height: 60, display: "flex", alignItems: "center"}}>
        <div style={{width: nameW, ...B.f.body.css, fontSize: 34, whiteSpace: "pre", color: B.c[S.ink], overflow: "hidden"}}>{r.name}</div>
        {/* no track behind the bars: a full track would read as a whole (100%) the data does not report */}
        <div style={{width: trackW, height: 34}}>
          <div style={{width: trackW * r.frac / maxFrac, height: 34, borderRadius: 6, background: r.neg ? B.c[S.soft] : B.c[S.bar]}}/></div>
        <div style={{width: labW, textAlign: "right", ...fitCss(hero, 44), color: B.c[S.num]}}>{ok ? r.label : <Blank w={measure(r.label, hero, 44)} size={44} color={B.c[S.soft]}/>}</div>
      </div>;
    })}
    {L.textLed && b.subShown && <div style={{position: "absolute", left: x0, top: barsY + bars.length * 76 + 20, width: W, ...B.f.body.css, fontWeight: 500, fontSize: 32, lineHeight: 1.3, color: B.c[S.soft]}}>
      {wrap(b.subShown, body, 32, W).map((l, i) => <div key={i} style={{whiteSpace: "pre"}}>{l}</div>)}</div>}
  </>;
};

const End: React.FC<{L: LookData; B: LookBrand; b: LookBeat; S: Scheme; f: number; top: number}> = ({L, B, b, S, f, top}) => {
  const W = B.safe.x1 - B.safe.x0, x0 = B.safe.x0;
  const disp = fitFont(B.f.display), body = fitFont(B.f.body);
  const Q = fitLines(plain(b.q), disp, W, 3, 112, 56);
  const nums = b.qNums;
  const src = fitLines(L.sourceLines.join(" · "), body, W, 7, 26, 18);
  return <>
    <div style={{position: "absolute", left: x0, top: top + 60, width: W}}>
      {Q.lines.map((l, i) => <GatedLine key={i} line={l} nums={nums} font={disp} size={Q.size} ink={B.c[S.ink]} acc={B.c[S.acc]} soft={B.c[S.soft]} f={f}/>)}
      <div style={{...B.f.body.css, fontSize: fitSize(b.sub ?? "", body, W, 46, 24), whiteSpace: "pre", color: B.c[S.acc], marginTop: 30}}>{b.sub}</div>
    </div>
    <div style={{position: "absolute", left: x0, width: W, top: B.safe.y1 - 70 - src.lines.length * Math.round(src.size * 1.3), ...B.f.body.css, fontWeight: 500,
      fontSize: src.size, lineHeight: 1.3, color: B.c[S.soft]}}>{src.lines.map((l, i) => <div key={i} style={{whiteSpace: "pre"}}>{l}</div>)}</div>
  </>;
};

export const Chrome: React.FC<{B: LookBrand; b: LookBeat; L: LookData; ground: ColorRole}> = ({B, b, L, ground}) => {
  const chip = B.c[B.chip.bg] === B.c[ground] ? {bg: B.chip.fg, fg: B.chip.bg} : {bg: B.chip.bg, fg: B.chip.fg};      // never a chip the colour of its ground
  const mono = fitFont(B.f.mono, B.chip.tracking);
  const W = B.safe.x1 - B.safe.x0;
  const text = B.chip.upper ? L.chip.toUpperCase() : L.chip;
  const srcFont = fitFont(B.f.mono);
  const light = ["paper", "newsprint", "newsprint2", "empty", "accent2"].includes(ground);
  return <>
    <div style={{position: "absolute", left: B.safe.x0, top: B.safe.y0, height: B.chip.size + 2 * B.chip.padY, display: "flex", alignItems: "center",
      background: B.c[chip.bg], color: B.c[chip.fg], borderRadius: B.chip.radius, padding: `0 ${B.chip.padX}px`,
      ...fitCss(mono, fitSize(text, mono, W - 2 * B.chip.padX, B.chip.size, 20))}}>{text}</div>
    <div style={{position: "absolute", left: B.safe.x0, top: B.safe.y0 + B.chip.size + 2 * B.chip.padY + 12, ...fitCss(srcFont, fitSize(b.src, srcFont, W, 26, 16)),
      color: light ? B.c.softInk : B.c.paper, opacity: 0.85}}>{b.src}</div>
  </>;
};

export const Placeholder: React.FC<LookProps & {scheme: Scheme}> = ({L, B, scheme: S}) => {
  const f = useCurrentFrame();
  const b = beatAt(L, f);
  const map = b.kind === "map" || b.kind === "mapend";
  const ground: ColorRole = map ? "paper" : S.ground;
  const top = B.safe.y0 + 120;
  return <AbsoluteFill style={{background: B.c[ground]}}>
    {map ? <MapClose L={L} B={B} b={b} top={top}/>
      : b.kind === "fact" ? <Fact L={L} B={B} b={b} S={S} f={f} top={top + 20}/>
      : b.kind === "end" ? <End L={L} B={B} b={b} S={S} f={f} top={top}/>
      : <Lines B={B} b={b} S={S} f={f} max={b.kind === "say" ? 120 : 132} top={top + 140}/>}
    <Chrome B={B} b={b} L={L} ground={ground}/>
    <BrandBug B={B} on={map || S.on === "light" ? "light" : "dark"}/>
    <LookAudio L={L}/>
  </AbsoluteFill>;
};

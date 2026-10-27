// Post images for a Short that has a look (critic blocker 2): src/datayt/BeatPosts.tsx sends DK-bp-x, DK-bp-ig and
// DK-bp-end here when data.json (or the props) carry a look, so the X image, every carousel slide and the last slide
// wear the look and its brand instead of the old cream template. The frame of the Short itself is the look's own
// render (through BeatStory's dispatch), measured outside the scale() transform (fit.ts), so nothing reflows.
import React, {useMemo} from "react";
import {AbsoluteFill} from "remotion";
import type {BeatData} from "../../datayt/BeatStory";
import {BeatStory} from "../../datayt/BeatStory";
import {facesFor, getBrand, lookBrand} from "../brands";
import {fitCss, fitFont, fitLines, fitSize} from "./fit";
import {LookFonts} from "./LookFonts";
import {plain, RichLines} from "./text";
import {toLookData} from "./useLookData";

const useBrand = (D: BeatData) => useMemo(() => {
  const L = toLookData(D);
  const brand = getBrand(L.brand);
  return {L, B: lookBrand(brand, L.look), faces: facesFor(brand, L.look)};
}, [D]);

// The Short at the current frame inside a box of another shape (as BeatPosts' Frame).
const ShortFrame: React.FC<{D: BeatData; scale: number; crop: number; w: number; h: number}> = ({D, scale, crop, w, h}) => (
  <div style={{width: w, height: h, overflow: "hidden", position: "relative", flexShrink: 0}}>
    <div style={{position: "absolute", left: (w - 1080 * scale) / 2, top: -crop * scale, width: 1080, height: 1920, transform: `scale(${scale})`, transformOrigin: "0 0"}}>
      <BeatStory D={D}/>
    </div>
  </div>
);

// 1600x900: the look's own frame on the left; the chip, the hook lines, the source and the brand on the brand ground.
// Everything that measures text sits in a component rendered inside <LookFonts>, so it measures the loaded faces.
type Brandish = ReturnType<typeof useBrand>;
const XText: React.FC<Brandish> = ({L, B}) => {
  const lines = L.beats[0].lines?.length ? L.beats[0].lines! : [L.D.ytTitle ?? ""];
  const disp = fitFont(B.f.display), body = fitFont(B.f.body), mono = fitFont(B.f.mono);
  const W = 1600 - 50 - 520 - 50 - 50;
  return <div style={{flex: 1, minWidth: 0, position: "relative"}}>
    <div style={{display: "inline-block", background: B.c.paper, color: B.c.ink, borderRadius: B.chip.radius, padding: `6px ${B.chip.padX}px`,
      ...fitCss(mono, fitSize(L.chip, mono, W - 2 * B.chip.padX, 26, 16))}}>{B.chip.upper ? L.chip.toUpperCase() : L.chip}</div>
    <div style={{marginTop: 34}}>{lines.map((l, i) => {
      const s = fitSize(plain(l), disp, W, 84, 40);
      return <RichLines key={i} text={l} lines={[plain(l)]} acc={B.c.accent2} lineHeight={Math.round(s * 1.08)} style={{...fitCss(disp, s), color: B.c.paper}}/>;
    })}</div>
    <div style={{position: "absolute", left: 0, right: 0, bottom: 64, ...fitCss(body, fitSize(L.sourceShort, body, W, 24, 14)), color: B.c.paper, opacity: 0.8}}>{L.sourceShort}</div>
    <div style={{position: "absolute", right: 0, bottom: 0, display: "flex", alignItems: "center", gap: 12}}>
      <B.Mark size={B.wordmark.stacked ? 64 : 46} on="dark"/><B.Wordmark size={B.wordmark.stacked ? 56 : 36} on="dark"/></div>
  </div>;
};
export const LookXPost: React.FC<{D: BeatData}> = ({D}) => {
  const br = useBrand(D);
  return <AbsoluteFill style={{background: br.B.c.ground}}>
    <LookFonts faces={br.faces}>
      <div style={{position: "absolute", left: 50, right: 50, top: 37, bottom: 37, display: "flex", gap: 50}}>
        <ShortFrame D={D} scale={826 / 1700} crop={20} w={520} h={826}/>
        <XText {...br}/>
      </div>
    </LookFonts>
  </AbsoluteFill>;
};

// 1080x1350 carousel slide: the look's frame fitted to the slide height, on the brand ground.
export const LookIgBeat: React.FC<{D: BeatData}> = ({D}) => {
  const {B} = useBrand(D);
  return <AbsoluteFill style={{background: B.c.ground}}>
    <ShortFrame D={D} scale={1350 / 1860} crop={16} w={1080} h={1350}/>
  </AbsoluteFill>;
};

// 1080x1350 last slide: the question, its sub, the full sources (look_opts.sourceLines when set) and the brand.
const EndText: React.FC<Brandish> = ({L, B}) => {
  const last = L.beats[L.beats.length - 1];
  const q = last.q ?? "";
  const disp = fitFont(B.f.display), body = fitFont(B.f.body), mono = fitFont(B.f.mono);
  const W = 1080 - 140;
  const Q = fitLines(plain(q), disp, W, 3, 120, 60);
  const S = fitLines(L.sourceLines.join(" · "), body, W, 9, 26, 16);
  return <div style={{position: "absolute", left: 70, right: 70, top: 70, bottom: 56, display: "flex", flexDirection: "column"}}>
    <div style={{alignSelf: "flex-start", background: B.c.ink, color: B.c.paper, borderRadius: B.chip.radius, padding: `6px ${B.chip.padX}px`,
      ...fitCss(mono, fitSize(L.chip, mono, W - 2 * B.chip.padX, 26, 16))}}>{B.chip.upper ? L.chip.toUpperCase() : L.chip}</div>
    <div style={{flex: 1}}/>
    <RichLines text={q} lines={Q.lines} acc={B.c.accent} lineHeight={Math.round(Q.size * 1.05)} style={{...fitCss(disp, Q.size), color: B.c.ink}}/>
    <div style={{...fitCss(body, fitSize(last.sub ?? "", body, W, 40, 20)), color: B.c.accent, marginTop: 22}}>{last.sub}</div>
    <div style={{flex: 1}}/>
    <div style={{...B.f.body.css, fontWeight: 500, fontSize: S.size, lineHeight: 1.35, color: B.c.softInk}}>
      {S.lines.map((l, i) => <div key={i} style={{whiteSpace: "pre"}}>{l}</div>)}</div>
    <div style={{height: 2, background: B.c.line, margin: "30px 0 24px"}}/>
    <div style={{display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14}}>
      <B.Mark size={B.wordmark.stacked ? 84 : 60} on="light"/><B.Wordmark size={B.wordmark.stacked ? 72 : 46} on="light"/></div>
  </div>;
};
export const LookIgEnd: React.FC<{D: BeatData}> = ({D}) => {
  const br = useBrand(D);
  return <AbsoluteFill style={{background: br.B.c.paper}}>
    <LookFonts faces={br.faces}><EndText {...br}/></LookFonts>
  </AbsoluteFill>;
};

// Jio moat Shorts: the vertical frame (1080x1920) and the pieces every Short shares: header, captions, end card, sound.
// Kit pieces that place things in absolute px (StickerLabel, BigNumber, BigWord, PhotoPrint, DocPage, Stamp, EntityTag...) work
// as is; DON'T use the kit's Desk (it assumes a 1920x1080 camera). Use VFrame instead.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from "remotion";
import {Finish, InkSurface, PaperSurface} from "../kit/Texture";
import {MusicBed, SfxTrack} from "../kit/Sound";
import {cueFrames, SCue} from "../kit/A01V4Cold";
import {layoutShots, Series, Shot, tsec} from "../kit/A01V4Parts";
import {useVoxFonts} from "../kit/fonts";
import {C, F, clamp01, ease, inOut, outCubic, tk2f, useTicks} from "../kit/tokens";
import {SHORTS, START, TAIL, WORDS} from "./shortsTiming";

export const VW = 1080, VH = 1920;
export const KINDS = ["Low cost", "A trusted name", "Hard to leave", "A crowd", "A licence"];

/** Vertical shot frame: paper or ink, a gentle zoom (s0 -> s1) about (cx, cy), grain and vignette on top. */
export const VFrame: React.FC<{f: number; d: number; tone?: "paper" | "ink" | "kraft"; z?: [number, number]; cx?: number; cy?: number; children?: React.ReactNode}> =
  ({f, d, tone = "paper", z = [1.0, 1.04], cx = 540, cy = 900, children}) => {
    const s = z[0] + (z[1] - z[0]) * ease(f, 0, d, inOut);
    return (
      <AbsoluteFill style={{overflow: "hidden"}}>
        {tone === "ink" ? <InkSurface glow={0.08}/> : <PaperSurface tone={tone === "kraft" ? "kraft" : "cream"} drift={f / Math.max(1, d)}/>}
        <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${cx}px ${cy}px`}}>{children}</AbsoluteFill>
        <Finish f={f} dark={tone === "ink"}/>
      </AbsoluteFill>
    );
  };

/** Series header, always on: JIO · 5 MOATS TESTED · n/5 KIND */
const Header: React.FC<{n: number}> = ({n}) => (
  <div style={{position: "absolute", left: 60, right: 60, top: 70, display: "flex", alignItems: "center", gap: 14, fontFamily: F.sans, fontWeight: 800, fontSize: 30, letterSpacing: 2}}>
    <span style={{background: C.ink, color: C.white, padding: "8px 16px"}}>JIO · 5 MOATS TESTED</span>
    <span style={{background: C.highlight, color: C.ink, padding: "8px 16px"}}>{n}/5 {KINDS[n - 1].toUpperCase()}</span>
  </div>
);

/** Captions: 2-4 words at a time, the spoken word highlighted; sits at y ~1460 (clear of the YouTube Shorts UI). */
const Captions: React.FC<{k: string}> = ({k}) => {
  const f = useTicks(), t = f / 30 - START;
  const ws = WORDS[k];
  const groups: number[][] = [];
  let cur: number[] = [];
  ws.forEach((w, i) => {
    cur.push(i);
    const len = cur.map((j) => ws[j][0]).join(" ").length;
    if (len > 16 || /[.,?!:;]$/.test(w[0]) || cur.length >= 4) { groups.push(cur); cur = []; }
  });
  if (cur.length) groups.push(cur);
  const g = groups.find((gr) => t >= ws[gr[0]][1] - 0.05 && t < ws[gr[gr.length - 1]][2] + 0.25);
  if (!g) return null;
  return (
    <div style={{position: "absolute", left: 60, right: 60, top: 1440, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12}}>
      {g.map((j) => {
        const on = t >= ws[j][1] && t < ws[j][2] + 0.05;
        return <span key={j} style={{fontFamily: F.sans, fontWeight: 800, fontSize: 64, lineHeight: 1.15, padding: "4px 14px", color: on ? C.ink : C.white,
          background: on ? C.highlight : C.ink, boxShadow: "0 8px 18px rgba(0,0,0,0.25)"}}>{ws[j][0].replace(/[.,;:]$/, "")}</span>;
      })}
    </div>
  );
};

/** End card over the last TAIL seconds: the full video + brand. */
const EndCard: React.FC<{k: string}> = ({k}) => {
  const f = useTicks(), t0 = (START + SHORTS[k].dur + 0.2) * 30, p = ease(f, t0, t0 + 10, outCubic);
  if (p <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: p}}>
      <InkSurface glow={0.1}/>
      <div style={{position: "absolute", left: 80, right: 80, top: 640, textAlign: "center"}}>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: C.grey}}>FULL VIDEO</div>
        <div style={{fontFamily: F.serif, fontSize: 104, lineHeight: 1.02, color: C.white, marginTop: 24}}>Jio’s size advantage <span style={{background: C.highlight, color: C.ink, padding: "0 14px"}}>has a catch</span></div>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 44, color: C.white, marginTop: 70}}>MOAT <span style={{color: C.highlightPrint}}>&</span> MARGIN</div>
      </div>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

export const shortTotal = (k: string) => tsec(SHORTS[k].total);

/** One Short: shots cut on the words, voice, a quiet bed, SFX, header, captions, end card. */
export const ShortFilm: React.FC<{k: string; n: number; shots: Shot[]; cues?: SCue[]; music?: boolean}> = ({k, n, shots, cues = [], music = true}) => {
  useVoxFonts();
  const {fps} = useVideoConfig();
  const total = shortTotal(k);
  const sorted = [...shots].sort((a, b) => a.cut - b.cut);
  const {start, dur} = layoutShots(sorted, total);
  const fs = (s: number) => tk2f(tsec(s), fps);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Series shots={sorted} start={start} dur={dur}/>
      <Header n={n}/>
      <Captions k={k}/>
      <EndCard k={k}/>
      <Sequence from={fs(START)} layout="none"><Audio src={staticFile(`voxplus/scale/shorts/vo/${k}.mp3`)}/></Sequence>
      {music ? <MusicBed src="audio/music_06_curious_ambience_reg1n0ld.wav" total={tk2f(total, fps)} voice={[[fs(START), fs(START + SHORTS[k].dur)]]} duck={0.16} open={0.3}
        startFrom={fs(30 + n * 17)} fadeIn={fs(0.6)} fadeOut={fs(1.0)}/> : null}
      <SfxTrack cues={cueFrames(cues, fps)}/>
    </AbsoluteFill>
  );
};

/** Source chip for Shorts: under the header (the kit's top-left SourceTag would sit under the header). */
export const VSource: React.FC<{text: string; dark?: boolean}> = ({text, dark}) => (
  <div style={{position: "absolute", left: 60, top: 140, display: "flex", alignItems: "center", gap: 10, fontFamily: F.mono, fontWeight: 600, fontSize: 22,
    letterSpacing: 1, textTransform: "uppercase", color: dark ? C.white : C.ink, opacity: 0.85}}>
    <span style={{width: 12, height: 12, background: C.highlight, display: "inline-block"}}/>{text}
  </div>
);

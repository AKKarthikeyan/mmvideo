// marutiq2 v2 (28 Oct 2026): own copies of ChapterQ, Words and Ring from A01V4Parts without the 1.4x opening zoom (it pushed text off screen) and with larger labels.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Icon, IconName, Paper} from "./A01V4Parts";
import {BigWord} from "./BigType";
import {Finish, InkSurface} from "./Texture";
import {C, F, H, W, clamp01, ease, inOut, outQuint} from "./tokens";
import {Chip} from "./MarutiPieces";

export const MChapterQ: React.FC<{f: number; d: number; n: number; q: string; icon?: IconName}> = ({f, d, n, q, icon = "castle"}) => {
  const k = ease(f, 0, 12, outQuint), w = ease(f, 5, 19, outQuint), u = ease(f, 20, 32, inOut);
  return (
    <AbsoluteFill>
      <Paper drift={f / d}/>
      <AbsoluteFill style={{opacity: 0.1, transform: `scale(${1 + 0.03 * clamp01(f / d)})`}}>
        {Array.from({length: 32}).map((_, i) => {
          const col = i % 8, row = Math.floor(i / 8);
          return <div key={i} style={{position: "absolute", left: 60 + col * 250 + (row % 2) * 125 - f * 0.7, top: 70 + row * 260}}><Icon name={icon} size={110} color={C.ink}/></div>;
        })}
      </AbsoluteFill>
      <div style={{position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 48, letterSpacing: 8, color: C.markerRed, opacity: k}}>CHAPTER {n}</div>
      <div style={{position: "absolute", left: 160, right: 160, top: 400, height: 330, overflow: "hidden", textAlign: "center"}}>
        <div style={{fontFamily: F.serif, fontSize: q.length > 20 ? 122 : 150, lineHeight: 1.06, color: C.ink, transform: `translateY(${(1 - w) * 330}px)`, textWrap: "balance"} as React.CSSProperties}>{q}</div>
      </div>
      <div style={{position: "absolute", left: 960 - 360, top: 760, width: 720, height: 22, background: C.highlight, transform: `scaleX(${u})`, transformOrigin: "0 50%", mixBlendMode: "multiply"}}/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

export const MWords: React.FC<{f: number; d: number; text: string; at?: number; mark?: string[]; markAt?: number; size?: number; y?: number; chip?: string}> =
  ({f, d, text, at = 2, mark = [], markAt, size = 150, y = 540, chip}) => (
    <AbsoluteFill>
      <InkSurface glow={0.08}/>
      <AbsoluteFill style={{transform: `scale(${1 + 0.02 * ease(f, d * 0.55, d, inOut)})`}}>
        <BigWord f={f} at={at} text={text} x={960} y={y} size={size} stagger={5} mark={mark} markAt={markAt} maxWidth={1500}/>
      </AbsoluteFill>
      {chip ? <Chip f={f} text={chip} dark/> : null}
      <Finish f={f} dark/>
    </AbsoluteFill>
  );

export const MRing: React.FC<{f: number; x?: number; y?: number; r?: number; from: number; to: number; at: number; dur?: number; label?: string}> =
  ({f, x = 960, y = 540, r = 230, from, to, at, dur = 36, label}) => {
    const v = from + (to - from) * ease(f, at, at + dur, (t) => 1 - Math.pow(1 - t, 3));
    const L = 2 * Math.PI * r;
    return (
      <>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <circle cx={x} cy={y} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={58}/>
          <circle cx={x} cy={y} r={r} fill="none" stroke={C.highlightPrint} strokeWidth={58} strokeDasharray={`${(L * v) / 100} ${L}`} transform={`rotate(-90 ${x} ${y})`}/>
        </svg>
        <div style={{position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", fontFamily: F.serif, fontSize: 130, color: C.white, whiteSpace: "nowrap"}}>
          {v < 0.05 ? "0" : v.toFixed(Math.abs(to - Math.round(to)) > 0.01 ? 1 : 0)}<span style={{fontSize: 70}}>%</span></div>
        {label ? <div style={{position: "absolute", left: x, top: y + r + 90, transform: "translate(-50%, -50%)", fontFamily: F.sans, fontWeight: 800, fontSize: 46, color: "#E6E0D4",
          letterSpacing: 2, whiteSpace: "nowrap"}}>{label}</div> : null}
      </>
    );
  };

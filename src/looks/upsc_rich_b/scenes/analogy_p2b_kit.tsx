// Shared helpers for the Part 2 analogy scenes of builder A2 (jars, bucket-band, rulers, cards, seesaw, decades).
import React from "react";
import {SANS, SERIF, W, H, cardStyle, eo} from "../kit";
import {lab as labQ} from "../../cartoon/long/figs";
import {Cloud, Hills, Sun, prog, type AP} from "./analogy_kit";

export type LI = {text?: string; lab?: string; key: string};
export type RLab = {text: string; at: number; isLab: boolean};

/** every spec label as {text, at}: `{lab,key}` prints lab(lab), `{text,key}` prints the text as given */
export const rlabs = (p: AP): RLab[] =>
  (((p.spec as any).labels ?? []) as LI[]).map((l) => ({text: l.lab ? labQ(l.lab) : l.text ?? "", at: p.at(l.key), isLab: !!l.lab}));

/** a paper card centred on cx, shown from frame `at`. `upper` keeps the house look for plain words; label strings with figures keep their own case. */
export const P2Card: React.FC<{cx: number; y: number; text: string; f: number; at: number; size?: number; maxW?: number; tone?: "warm" | "cool" | "green" | "dark"; upper?: boolean; left?: boolean}> =
  ({cx, y, text, f, at, size = 40, maxW = 900, tone = "warm", upper = true, left = false}) => {
  const a = eo(prog(f, at, 14));
  if (a <= 0.001) return null;
  const tint = tone === "cool" ? "70,120,180" : tone === "green" ? "50,140,80" : "190,110,50";
  const bar = tone === "cool" ? "#2f78b8" : tone === "green" ? "#2f9a4a" : tone === "dark" ? "#f0b45a" : "#d8682a";
  const st = cardStyle(cx, y, 0, 0, a, 22, tint);
  const dark = tone === "dark";
  return (
    <div style={{...st, width: "max-content", height: "auto", maxWidth: maxW, transform: left ? "none" : "translateX(-50%)", padding: `${Math.round(size * 0.42)}px ${Math.round(size * 0.8)}px ${Math.round(size * 0.46)}px`, textAlign: left ? "left" : "center",
      ...(dark ? {background: "linear-gradient(160deg, rgba(34,40,70,.92), rgba(22,26,52,.9))", border: "1.5px solid rgba(255,225,170,.45)"} : {})}}>
      <div style={{width: 46, height: 5, borderRadius: 3, background: bar, margin: left ? `0 0 ${Math.round(size * 0.3)}px` : `0 auto ${Math.round(size * 0.3)}px`, opacity: 0.9}}/>
      <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.14, letterSpacing: upper ? "0.015em" : "0.005em", color: dark ? "#fff0d4" : tone === "cool" ? "#173a5c" : tone === "green" ? "#14502a" : "#5e2a0e", textTransform: upper ? "uppercase" : "none"}}>{text}</div>
    </div>
  );
};

/** monsoon-season daylight sky with hills, sun and clouds */
export const DaySky: React.FC<{id: string; f: number; sun?: [number, number]; haze?: number}> = ({id, f, sun = [1560, 170], haze = 1}) => (
  <g>
    <defs><linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#74aedc"/><stop offset="0.7" stopColor="#c9dfe4"/><stop offset="1" stopColor="#f6e8c6"/></linearGradient></defs>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill={`url(#${id}-sky)`}/>
    <Sun x={sun[0]} y={sun[1]} r={52} f={f}/>
    {[0, 1, 2].map((i) => <Cloud key={i} x={60 + i * 700} y={130 + (i % 2) * 100} s={0.9} f={f} speed={0.2} seed={i + 3} a={0.85 * haze}/>)}
    <Hills id={`${id}-h1`} base={720} amp={120} top="#b4cbe0" bottom="#d4dfdf" seed={0.9}/>
    <Hills id={`${id}-h2`} base={790} amp={80} top="#8fb59a" bottom="#bdd2a4" seed={3.3} wl={310}/>
  </g>
);

/** a wooden table top from y0 down */
export const Table: React.FC<{id: string; y0: number}> = ({id, y0}) => (
  <g>
    <defs><linearGradient id={`${id}-wood`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a62"/><stop offset="1" stopColor="#7e4f28"/></linearGradient></defs>
    <rect x={-40} y={y0} width={W + 80} height={H - y0 + 80} fill={`url(#${id}-wood)`}/>
    {Array.from({length: 8}, (_, i) => <path key={i} d={`M-40,${y0 + 30 + i * 34} Q960,${y0 + 22 + i * 34 + (i % 2) * 8} 1960,${y0 + 30 + i * 34}`} stroke="#6e4524" strokeWidth={1.6} fill="none" opacity={0.5}/>)}
    <rect x={-40} y={y0 - 4} width={W + 80} height={8} fill="#ecd09a" opacity={0.75}/>
  </g>
);

export const SafeNote: React.FC<{x: number; y: number; text: string; a: number; size?: number; anchor?: "start" | "middle" | "end"; fill?: string}> = ({x, y, text, a, size = 22, anchor = "middle", fill = "#5a3418"}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontWeight={700} fontSize={size} letterSpacing="0.14em" fill={fill} opacity={a}>{text}</text>
);

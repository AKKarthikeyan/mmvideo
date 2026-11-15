// KURZ look, "statement" scene (cards builder, 29 Oct 2026): {lines: string[]}, *starred* words accented.
// Big type on the left over a deep space scene: an egg planet with a ring and moons on the right, nebula light, star layers with
// parallax, dust and the odd slow meteor. Lines stagger in; accents glow yellow and get a swoosh underline. The camera drifts and pushes in.
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {K, ROUND, easeIO} from "./kit";
import {EggPlanet, Grain, Meteor, Space, Starred, YolkSystem, drift, fitPx, hashStr, popIn, textW} from "./cards_kit";

type StatementSpec = {lines: (string | {text: string})[]};
const RINGS = [K.teal, K.orange, K.purple, K.pink];

export const Scene: React.FC<SceneProps<StatementSpec>> = ({f, dur, spec}) => {
  const lines = spec.lines.map((l) => (typeof l === "string" ? l : l.text));
  const h = hashStr(lines.join("|")), d = drift(f, h % 7);
  const longest = lines.reduce((a, l) => Math.max(a, l.replace(/\*/g, "").length), 0);
  const px = Math.round(fitPx("X".repeat(longest), 1100, 128, 96));
  const wide = lines.some((l) => textW(l.replace(/\*/g, ""), px) > 960);
  const push = 1 + 0.06 * easeIO(f, 0, Math.max(dur, 200));
  return <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "70% 45%"}}>
      <Space f={f} id="kst" seed={h % 50} cx={0.78} cy={0.45}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <Meteor f={f} every={300} seed={h % 11}/>
        {/* a small far moon with its own lit and shade halves */}
        <g transform={`translate(${1760 + d.x * 0.35} ${880 + d.y * 0.35})`}>
          <circle r={44} fill={K.purple}/><path d="M 10 -44 A 44 44 0 0 1 10 44 Z" fill={K.purpleD}/>
          <circle cx={-12} cy={-8} r={9} fill={K.purpleD} opacity={0.6}/><circle cx={6} cy={18} r={6} fill={K.purpleD} opacity={0.6}/>
        </g>
        {h % 2 ? <EggPlanet f={f} id="kst-p" x={(wide ? 1680 : 1600) + d.x * 0.7} y={480 + d.y * 0.7} r={wide ? 150 : 185} ring={RINGS[h % RINGS.length]} moons={3} tilt={-14 + (h % 3) * 6}/>
          : <YolkSystem f={f} id="kst-y" x={(wide ? 1700 : 1610) + d.x * 0.7} y={480 + d.y * 0.7} s={wide ? 0.8 : 0.98} tilt={-12 + (h % 3) * 5}/>}
      </svg>
    </div>
    {/* a soft dark panel keeps the type at full contrast over the art */}
    <div style={{position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(11,20,51,0.62) 0%, rgba(11,20,51,0.42) 48%, rgba(11,20,51,0) 70%)"}}/>
    <div style={{position: "absolute", left: 130 + d.x * 0.15, top: 64, height: 840, width: wide ? 1180 : 1080, display: "flex", flexDirection: "column", justifyContent: "center"}}>
      {lines.map((l, i) => { const a = 6 + i * 12, t = popIn(f, a, 120, 14), blur = Math.max(0, (1 - Math.min(1, t)) * 10);
        return <div key={i} style={{fontFamily: ROUND, fontWeight: 800, fontSize: px, lineHeight: 1.06, color: K.white, letterSpacing: -1, marginBottom: px * 0.12,
          textShadow: "0 8px 30px rgba(0,0,0,0.45)", opacity: Math.min(1, t * 1.3), transform: `translateY(${(1 - t) * 50}px)`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
          ...({textWrap: "balance"} as any)}}>
          <Starred text={l} f={f} at={a}/>
        </div>; })}
    </div>
    <Grain id="kst"/>
  </AbsoluteFill>;
};

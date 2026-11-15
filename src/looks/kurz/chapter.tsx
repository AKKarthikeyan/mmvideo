// KURZ look, "chapter" scene (cards builder, 29 Oct 2026): {n, title, icon, year?}. 2.5 s, silent; the engine's iris opens over it.
// Left: CHAPTER kicker, a big glowing number, the title and the year. Right: a hero illustration of the icon on a lit halo with orbit rings.
// The space backdrop takes the era's tone from the year (1969-1981 sepia, 1982 warm, later night).
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import {K, ROUND, SANS, easeIO} from "./kit";
import {Grain, Hero, Space, Tag, drift, popIn, type Tone} from "./cards_kit";

type ChapterSpec = {n: number; title: string; icon: string; year?: string | number};

const toneOf = (year?: string | number): Tone => {
  const y = Number(year);
  if (!y) return "night";
  return y < 1982 ? "sepia" : y === 1982 ? "warm" : "night";
};
const ACC: Record<Tone, string> = {sepia: K.orangeL, warm: K.orange, night: K.yellow, dawn: K.yellow};

export const Scene: React.FC<SceneProps<ChapterSpec>> = ({f, dur, spec}) => {
  const tone = toneOf(spec.year), acc = ACC[tone], d = drift(f, spec.n);
  const push = 1 + 0.045 * easeIO(f, 0, dur);
  const tH = popIn(f, 2, 90, 11), tN = popIn(f, 5, 140), tY = popIn(f, 17, 140);
  const words = spec.title.split(" ");
  const num = String(spec.n).padStart(2, "0");
  const flock = spec.icon === "hen" && Number(spec.year) >= 1975;
  return <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "62% 50%"}}>
      <Space f={f} id="kch" seed={spec.n * 5 + 1} tone={tone} cx={0.7} cy={0.48}/>
      <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
        <defs>
          <radialGradient id="kch-halo"><stop offset="0" stopColor={acc} stopOpacity={0.42}/><stop offset="0.45" stopColor={acc} stopOpacity={0.12}/><stop offset="1" stopColor={acc} stopOpacity={0}/></radialGradient>
          <radialGradient id="kch-pool"><stop offset="0" stopColor={K.tealL} stopOpacity={0.35}/><stop offset="1" stopColor={K.tealL} stopOpacity={0}/></radialGradient>
        </defs>
        <g transform={`translate(${1350 + d.x * 0.6} ${500 + d.y * 0.6})`}>
          <circle r={470 * (0.6 + 0.4 * tH)} fill="url(#kch-halo)"/>
          {/* light shafts behind the hero, turning very slowly */}
          <g opacity={0.5 * tH} transform={`rotate(${f * 0.12})`}>
            {Array.from({length: 10}, (_, i) => <path key={i} d="M 0 0 L 620 -46 L 620 46 Z" fill={acc} opacity={0.06} transform={`rotate(${i * 36})`}/>)}
          </g>
          {[0, 1].map((i) => <ellipse key={i} rx={330 + i * 80} ry={92 + i * 24} fill="none" stroke={i ? K.teal : acc} strokeWidth={3} opacity={0.32 * tH} strokeDasharray={i ? "4 14" : undefined}
            transform={`rotate(${-14 + i * 6}) translate(0 ${120 + i * 10})`}/>)}
          {[0, 1, 2].map((i) => { const a = f / 40 + i * 2.1; return <circle key={i} cx={Math.cos(a) * (330 + i * 40)} cy={Math.sin(a) * (92 + i * 12) + 120} r={7 - i * 1.5}
            fill={i === 1 ? K.teal : acc} opacity={(0.5 + 0.5 * Math.sin(a)) * tH} transform="rotate(-14)"/>; })}
          <ellipse cx={0} cy={250} rx={300} ry={46} fill="url(#kch-pool)" opacity={tH}/>
          {/* a boom year gets a flock behind the hero hen */}
          {flock && [[-300, 150, 0.42, 0], [250, 170, 0.46, 1], [-160, 230, 0.5, 2], [380, 250, 0.4, 3], [-420, 260, 0.36, 4], [60, 290, 0.44, 5]].map(([x, y, sc, i]) => {
            const t = popIn(f, 8 + i * 2.5, 140); return t > 0.01 && <g key={i} transform={`translate(${x} ${y + (1 - t) * 40}) scale(${sc * Math.min(1, t)}) scale(${i % 2 ? -1 : 1} 1)`} opacity={0.9}>
              <Hero icon="hen" f={f + i * 23} id={`kch-f${i}`}/></g>; })}
          <g transform={`translate(0 ${(1 - tH) * 120 + Math.sin(f / 26) * 8 - (flock ? 40 : 0)}) scale(${0.3 + 0.7 * tH}) scale(${flock ? 0.9 : 1.08})`} opacity={Math.min(1, tH * 1.5)}>
            <Hero icon={spec.icon} f={f} id="kch-h"/>
          </g>
        </g>
      </svg>
    </div>
    <div style={{position: "absolute", left: 150 + d.x * 0.25, top: 150 + d.y * 0.25, width: 820}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 10, color: K.tealL, opacity: Math.min(1, tN), transform: `translateX(${(1 - tN) * -40}px)`}}>CHAPTER</div>
      <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 290, lineHeight: 0.92, color: acc, letterSpacing: -6, marginTop: 6,
        textShadow: `0 0 60px ${acc}66, 14px 18px 0 rgba(0,0,0,0.25)`, opacity: Math.min(1, tN * 1.4), transform: `scale(${0.6 + 0.4 * tN})`, transformOrigin: "0% 70%"}}>{num}</div>
      <div style={{fontFamily: ROUND, fontWeight: 800, fontSize: 104, lineHeight: 1.02, color: K.white, marginTop: 26, letterSpacing: -1, textShadow: "0 6px 30px rgba(0,0,0,0.45)",
        ...({textWrap: "balance"} as any)}}>
        {words.map((w, i) => { const t = popIn(f, 10 + i * 2.5, 130, 14); return <span key={i} style={{display: "inline-block", opacity: Math.min(1, t * 1.3),
          transform: `translateY(${(1 - t) * 40}px)`, marginRight: "0.26em"}}>{w}</span>; })}
      </div>
      {spec.year != null && <div style={{marginTop: 34, opacity: Math.min(1, tY * 1.3), transform: `translateX(${(1 - tY) * -30}px)`}}>
        <Tag text={String(spec.year)} color={acc} size={44}/>
      </div>}
    </div>
    <Grain id="kch"/>
  </AbsoluteFill>;
};

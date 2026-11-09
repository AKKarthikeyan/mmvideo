// Look B "title" scene: the hook title card. A Nagpur rooftop at the end of a hot day, rain clouds waiting on the horizon, the girl looking out;
// the headline sits on a frosted card in Newsreader serif, on screen from the first frames. Spec {title, sub?, chip?} as in the cartoon title kind
// (no figures here). Text stays inside x 96-1824, y 64-920 and left of the brand bug.
import React, {useMemo} from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../../cartoon/long/contract";
import {Girl} from "../girl";
import {H, PaperFinish, Pill, SANS, SERIF, W, clamp, eio, eo, lerp, prog, rng} from "../kit";
import {PropDefs} from "./stage_props";
import {ROOF_FLOOR, RoofBack} from "./stage_roof";
import {SERIF_FONT, textW, wrapLines} from "./stage_ui";

export type TitleSpec = {title: string; sub?: string; chip?: string};

const CARD = {x: 96, w: 980};

/** towering rain clouds low on the horizon, waiting: soft, dark underbellies, slow billow */
const WaitingClouds: React.FC<{f: number}> = ({f}) => {
  const bl = useMemo(() => { const r = rng(12); return Array.from({length: 26}).map(() => ({x: 1050 + r() * 1100, y: 330 + r() * 130, r: 50 + r() * 90, c: r()})); }, []);
  return (
    <g>
      <defs><filter id="tt-cb" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="3.5"/></filter></defs>
      <g filter="url(#tt-cb)">
        {bl.map((b, i) => <circle key={`d${i}`} cx={b.x + 10} cy={b.y + 40 + Math.sin(f / 50 + i) * 3} r={b.r} fill="#7d6a8c" opacity="0.5"/>)}
        {bl.map((b, i) => <circle key={i} cx={b.x + Math.sin(f / 70 + i) * 4} cy={b.y - 20 - b.r * 0.4 + Math.sin(f / 60 + i * 2) * 2} r={b.r * 0.92} fill={b.c < 0.5 ? "#f4d9d0" : "#ffe9dc"} opacity="0.95"/>)}
        {bl.filter((_, i) => i % 3 === 0).map((b, i) => <circle key={`h${i}`} cx={b.x - 14} cy={b.y - 50 - b.r * 0.5} r={b.r * 0.5} fill="#fff7ee" opacity="0.85"/>)}
      </g>
    </g>
  );
};

export const Scene: React.FC<SceneProps<TitleSpec>> = ({f, dur, spec}) => {
  if (!spec || typeof spec.title !== "string" || !spec.title.trim()) throw new Error("title: spec.title must be a non-empty string");
  if (/\{[^}]+\}/.test(spec.title + (spec.sub ?? ""))) throw new Error("title (look B): figure tokens are not supported in the title or sub");
  const t = clamp(f / Math.max(1, dur)), camX = lerp(-12, 12, t), camY = lerp(3, -3, t), zoom = 1.02 + 0.035 * eio(t);

  // headline: the biggest size (124 down to 64 px) at which it wraps into at most 4 lines inside the card
  const innerW = CARD.w - 120;
  let size = 124, lines: string[] = [];
  for (; size >= 64; size -= 4) { lines = wrapLines(spec.title, SERIF_FONT(600), size, innerW); if (lines.length <= 4) break; }
  const lh = size * 1.08, subPx = 34;
  const subW = spec.sub ? textW(spec.sub.toUpperCase(), SANS_FONT_B, subPx) + spec.sub.length * subPx * 0.18 : 0;
  const cardH = Math.round(70 + lines.length * lh + (spec.sub ? 92 : 20) + 36), cardY = Math.max(176, Math.min(920 - cardH, 540 - cardH / 2 + 20));
  const cardA = eo(prog(f, 0, 12));

  return (
    <AbsoluteFill style={{background: "#EFE6D2"}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0}}>
        <PropDefs/>
        <g transform={`translate(960 540) scale(${zoom}) translate(-960 -540)`}>
          <RoofBack f={f} time="may" camX={camX} camY={camY}/>
          <WaitingClouds f={f}/>
          {/* a golden-hour wash over the whole roof */}
          <rect x="-100" y="-100" width={W + 200} height={H + 200} fill="#ff9a4a" opacity="0.1" style={{mixBlendMode: "multiply"}}/>
          <g transform={`translate(1290 ${ROOF_FLOOR + 244}) scale(-1.14 1.14)`}>
            <ellipse cx="46" cy="6" rx="170" ry="16" fill="#2e2a52" opacity="0.3" filter="url(#pp-blur)"/>
            <g transform={`translate(0 ${-14})`}><Girl f={f} id="gt" pose="point" talk/></g>
          </g>
        </g>
      </svg>
      <PaperFinish id="ttpf" grain={0.5} vignette={0.4}/>
      {spec.chip && <Pill x={CARD.x + 6} y={cardY - 74} text={spec.chip} a={cardA}/>}
      <div style={{position: "absolute", left: CARD.x, top: cardY + (1 - cardA) * 30, width: CARD.w, height: cardH, opacity: cardA, borderRadius: 26, overflow: "hidden",
        background: "linear-gradient(160deg, rgba(255,252,243,.92), rgba(255,240,212,.82))", border: "1.5px solid rgba(190,110,50,.5)",
        boxShadow: "0 40px 80px -30px rgba(80,44,18,.6), 0 8px 18px -8px rgba(80,44,18,.3), inset 0 1.5px 0 rgba(255,255,255,.9)", backdropFilter: "blur(12px)"}}>
        <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: "linear-gradient(#e2683a,#bd3a1e)"}}/>
        <div style={{padding: "36px 56px 0 64px"}}>
          {lines.map((l, i) => {
            const a = eo(prog(f, 4 + i * 6, 14)), last = i === lines.length - 1;
            return <div key={i} style={{fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: `${lh}px`, letterSpacing: "-0.015em", color: last ? "#bd3a1e" : "#2c1a0e", whiteSpace: "nowrap",
              opacity: a, transform: `translateY(${(1 - a) * 22}px)`, fontStyle: last ? "italic" : "normal"}}>{l}</div>;
          })}
        </div>
        {spec.sub && <div style={{margin: "22px 56px 0 64px", paddingTop: 18, borderTop: "2px solid rgba(190,110,50,.35)", fontFamily: SANS, fontWeight: 700, fontSize: subPx, letterSpacing: "0.18em", color: "#6a3a1c", textTransform: "uppercase", whiteSpace: "nowrap",
          opacity: eo(prog(f, 4 + lines.length * 6, 14))}}>{spec.sub}</div>}
      </div>
    </AbsoluteFill>
  );
};
const SANS_FONT_B = "700 {px}px 'RB Schibsted', 'Helvetica Neue', Arial, sans-serif";

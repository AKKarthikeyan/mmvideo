// "Desk Glow" style kit (The Inventor's Desk style pilot, 27 Oct 2026). Our own look in the bold flat-vector genre: deep
// night gradients, saturated flat shapes with a light rim and a dark shade, soft radial glows, film grain, drifting motes,
// everything breathing a little, and a log-space camera dive through nested levels. Drawn in code; no copied art.
import React, {useId} from "react";
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {FPS, H, HEAD, W} from "../kit";

export const G = {
  night0: "#0A1628", night1: "#122746", indigo: "#2A3B78", plum: "#4A3576", dusk: "#7A3E6E", horizon: "#FF9A62",
  mint: "#4FE3C1", teal: "#1C9C94", deepTeal: "#0F4F57", amber: "#FFB547", gold: "#F7D36B", coral: "#FF6B5B",
  rose: "#FF8FA3", sky: "#7FC8FF", cream: "#FFF4DC", snow: "#EAF2FF", chestnut: "#C4542D", chestnutHi: "#E9804A",
  chestnutLo: "#8E3A22", burr: "#B0803A", burrHi: "#E2B45E", burrLo: "#6E4A1E", ink: "#081120",
};

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const sm = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const outBack = (t: number) => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
/** seeded 0..1 */
export const rnd = (k: number) => { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
/** idle breathing / bobbing */
export const bob = (f: number, amp = 1, period = 2.4, phase = 0) => amp * Math.sin((f / FPS / period) * Math.PI * 2 + phase);

export const usePopAt = () => {
  const {fps} = useVideoConfig(); const f = useCurrentFrame();
  return (f0: number, damping = 12, stiffness = 160) => (f < f0 ? 0 : spring({frame: f - f0, fps, config: {damping, stiffness, mass: 0.7}}));
};

// ---------- backgrounds
/** bleed: extend past the frame (levels inside a camera dive are seen smaller than the screen on the way in) */
export const Sky: React.FC<{stops: [number, string][]; bleed?: number}> = ({stops, bleed = 0}) => (
  <div style={{position: "absolute", left: -bleed, top: -bleed, right: -bleed, bottom: -bleed, background: `linear-gradient(180deg, ${stops.map(([p, c]) => `${c} ${p * 100}%`).join(", ")})`}}/>
);

/** soft radial glow, cheap (gradient, no filter) */
export const Glow: React.FC<{x: number; y: number; r: number; color: string; o?: number}> = ({x, y, r, color, o = 1}) => {
  const id = useId().replace(/:/g, "");
  return (
    <g opacity={o}>
      <defs><radialGradient id={id}><stop offset="0" stopColor={color} stopOpacity={0.9}/><stop offset="0.35" stopColor={color} stopOpacity={0.35}/><stop offset="1" stopColor={color} stopOpacity={0}/></radialGradient></defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`}/>
    </g>
  );
};

export const Stars: React.FC<{n?: number; seed?: number; maxY?: number; o?: number}> = ({n = 70, seed = 1, maxY = H * 0.55, o = 1}) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      {Array.from({length: n}, (_, k) => {
        const x = rnd(k + seed) * W, y = rnd(k * 3.1 + seed) * maxY, r = 1.2 + rnd(k * 7.7 + seed) * 2.6;
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(f / 18 + k * 1.7));
        return <circle key={k} cx={x} cy={y} r={r} fill={G.cream} opacity={tw * (0.35 + 0.5 * rnd(k + 9))}/>;
      })}
    </g>
  );
};

/** drifting glowing motes (seeds, dust, plankton-like specks) */
export const Motes: React.FC<{n?: number; seed?: number; color?: string; rise?: number; size?: number; o?: number}> = ({n = 24, seed = 3, color = G.gold, rise = 14, size = 1, o = 1}) => {
  const f = useCurrentFrame(); const t = f / FPS;
  return (
    <g opacity={o}>
      {Array.from({length: n}, (_, k) => {
        const a = rnd(k + seed), b = rnd(k * 2.3 + seed), c = rnd(k * 5.9 + seed);
        const x = ((a * W + Math.sin(t * (0.3 + b) + k) * 40 + t * 6) % (W + 60)) - 30;
        const y = (((b * H - t * rise * (0.5 + c)) % H) + H) % H;
        const r = (3 + 7 * c) * size;
        return (
          <g key={k}>
            <circle cx={x} cy={y} r={r * 3.2} fill={color} opacity={0.07}/>
            <circle cx={x} cy={y} r={r} fill={color} opacity={0.5 + 0.4 * Math.sin(t * 2 + k)}/>
          </g>
        );
      })}
    </g>
  );
};

/** film grain (static texture, jittered every 2 frames) */
export const Grain: React.FC<{o?: number}> = ({o = 0.07}) => {
  const f = Math.floor(useCurrentFrame() / 2);
  return (
    <AbsoluteFill style={{pointerEvents: "none", opacity: o, mixBlendMode: "overlay", overflow: "hidden"}}>
      <Img src={staticFile("gadget/velcroglow/grain.png")} style={{position: "absolute", left: -(rnd(f) * 256), top: -(rnd(f + 5) * 256), width: W + 512, height: H + 512, objectFit: "none", imageRendering: "pixelated"}}/>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{o?: number}> = ({o = 0.55}) => (
  <AbsoluteFill style={{pointerEvents: "none", background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 55%, rgba(4,8,18,${o}) 100%)`}}/>
);

export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0, overflow: "visible", ...style}}>{children}</svg>
);

// ---------- camera dive: nested levels, zoom in log space about a fixed screen point
// Level j+1 sits inside level j so that zooming level j by k about p fills the screen with level j+1.
// Put the zoom target of level j+1 at the same coordinates p, and the two levels line up on the way in.
export type Stage = {f0: number; f1: number; k: number; p: [number, number]; pre?: {f0: number; s: number}};
export const Dive: React.FC<{stages: Stage[]; levels: React.ReactNode[]}> = ({stages, levels}) => {
  const f = useCurrentFrame();
  const j = stages.filter((st) => f >= st.f1).length;
  if (j >= stages.length) return <AbsoluteFill>{levels[levels.length - 1]}</AbsoluteFill>;
  const st = stages[j];
  const s0 = st.pre ? st.pre.s : 1;
  let s: number;
  if (f < st.f0) s = st.pre && f > st.pre.f0 ? Math.exp(Math.log(s0) * inOut(clamp01((f - st.pre.f0) / (st.f0 - st.pre.f0)))) : st.pre && f <= st.pre.f0 ? 1 : s0;
  else s = Math.exp(Math.log(s0) + (Math.log(st.k) - Math.log(s0)) * inOut(clamp01((f - st.f0) / (st.f1 - st.f0))));
  const u = Math.log(s) / Math.log(st.k);
  const nextO = sm(0.42, 0.8, u);
  const [px, py] = st.p;
  // soft iris: starts as a circle around p, opens past the screen corners before the outer level is dropped
  const sn = s / st.k, R = (sn * 900) / Math.max(0.06, 1 - 0.94 * sm(0.55, 0.97, u));
  const mask = `radial-gradient(circle at ${px}px ${py}px, black ${R * 0.55}px, transparent ${R}px)`;
  return (
    <AbsoluteFill>
      {u < 0.97 && <AbsoluteFill style={{transformOrigin: `${px}px ${py}px`, transform: `scale(${s})`}}>{levels[j]}</AbsoluteFill>}
      {nextO > 0 && (
        <AbsoluteFill style={{opacity: nextO, WebkitMaskImage: mask, maskImage: mask}}>
          <AbsoluteFill style={{transformOrigin: `${px}px ${py}px`, transform: `scale(${sn})`}}>{levels[j + 1]}</AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------- type
/** glowing pill label; pops in at f0, fades out at f1 */
export const Pill: React.FC<{x: number; y: number; text: string; f0: number; f1?: number; color?: string; size?: number; anchor?: "c" | "l"}> = ({x, y, text, f0, f1 = 1e9, color = G.mint, size = 44, anchor = "c"}) => {
  const f = useCurrentFrame(); const pop = usePopAt()(f0);
  const out = 1 - sm(f1 - 6, f1, f);
  if (pop <= 0 || out <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(${anchor === "c" ? "-50%" : "0"}, -50%) scale(${0.6 + 0.4 * pop})`, opacity: Math.min(1, pop) * out,
      padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: "rgba(8,17,32,0.78)", border: `4px solid ${color}`,
      boxShadow: `0 0 ${size * 0.9}px ${color}88, inset 0 0 ${size * 0.4}px ${color}33`, fontFamily: HEAD, fontSize: size, letterSpacing: 2,
      color: G.cream, whiteSpace: "nowrap"}}>{text}</div>
  );
};

/** big headline word with soft glow */
export const Big: React.FC<{x: number; y: number; text: string; f0: number; f1?: number; color?: string; size?: number}> = ({x, y, text, f0, f1 = 1e9, color = G.cream, size = 120}) => {
  const f = useCurrentFrame(); const pop = usePopAt()(f0, 11, 140);
  const out = 1 - sm(f1 - 6, f1, f);
  if (pop <= 0 || out <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * pop})`, opacity: Math.min(1, pop) * out,
      fontFamily: HEAD, fontSize: size, letterSpacing: 3, color, textShadow: `0 0 40px ${color}99, 0 6px 0 rgba(0,0,0,0.25)`, whiteSpace: "nowrap"}}>{text}</div>
  );
};

/** channel tag + thin glowing progress line at the top (inside the Shorts safe area) */
export const GlowTop: React.FC<{product: string; total: number}> = ({product, total}) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{position: "absolute", left: 70, right: 70, top: 168, height: 6, borderRadius: 3, background: "rgba(255,244,220,0.14)"}}>
        <div style={{width: `${(f / total) * 100}%`, height: "100%", borderRadius: 3, background: G.mint, boxShadow: `0 0 14px ${G.mint}`}}/>
      </div>
      <div style={{position: "absolute", left: 70, top: 192, fontFamily: HEAD, fontSize: 24, letterSpacing: 3, color: G.cream, opacity: 0.85}}>
        THE INVENTOR'S DESK <span style={{color: G.mint}}>·</span> <span style={{color: G.amber}}>{product}</span>
      </div>
    </>
  );
};

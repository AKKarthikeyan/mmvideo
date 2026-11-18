// Shared drawing pieces for scenes 05 and 06 (tower, phone and house icons, callouts, radio arcs, headline tags).
// Local to scenes 05-06: no change to devices.tsx. Everything is original artwork drawn in code.
import React from "react";
import {AbsoluteFill} from "remotion";
import {Layer, camAt, CamKey} from "./kit/Camera";
import {SourceTag} from "./kit/Cards";
import {Paper} from "./kit/A01V4Parts";
import {Finish} from "./kit/Texture";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr} from "./kit/tokens";

export const Svg: React.FC<{children?: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0, overflow: "visible", ...style}}>{children}</svg>
);

/** Phone icon (generic handset). */
export const PhoneG: React.FC<{x: number; y: number; s?: number; color?: string; op?: number; screen?: string}> = ({x, y, s = 1, color = C.ink, op = 1, screen = C.white}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <rect x={-17} y={-30} width={34} height={60} rx={7} fill={color}/>
    <rect x={-13} y={-24} width={26} height={44} rx={3} fill={screen}/>
    <circle cx={0} cy={25} r={2.2} fill={screen}/>
  </g>
);

/** House icon (home broadband). */
export const HouseG: React.FC<{x: number; y: number; s?: number; color?: string; op?: number; screen?: string}> = ({x, y, s = 1, color = C.ink, op = 1, screen = C.white}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
    <path d="M -36 -2 L 0 -34 L 36 -2" fill="none" stroke={color} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round"/>
    <rect x={-25} y={-4} width={50} height={36} fill={color}/>
    <rect x={-6} y={10} width={12} height={22} fill={screen}/>
  </g>
);

/** Lattice tower (schematic), base centre (x, yb), height h. */
export const TowerBig: React.FC<{x: number; yb: number; h: number; w?: number; color?: string; sw?: number; op?: number}> = ({x, yb, h, w = h * 0.3, color = C.ink, sw = 6, op = 1}) => {
  const yt = yb - h, wt = w * 0.1, n = 8;
  const hw = (t: number) => (wt + (w - wt) * t) / 2;
  const els: React.ReactNode[] = [];
  els.push(<path key="l" d={`M ${x - hw(0)} ${yt} L ${x - hw(1)} ${yb} M ${x + hw(0)} ${yt} L ${x + hw(1)} ${yb}`} stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round"/>);
  for (let i = 0; i <= n; i++) {
    const t = i / n, y = yt + h * t;
    els.push(<line key={"r" + i} x1={x - hw(t)} x2={x + hw(t)} y1={y} y2={y} stroke={color} strokeWidth={sw * 0.6}/>);
    if (i < n) {
      const t2 = (i + 1) / n, y2 = yt + h * t2;
      els.push(i % 2 === 0 ? <line key={"b" + i} x1={x - hw(t)} y1={y} x2={x + hw(t2)} y2={y2} stroke={color} strokeWidth={sw * 0.5}/>
        : <line key={"b" + i} x1={x + hw(t)} y1={y} x2={x - hw(t2)} y2={y2} stroke={color} strokeWidth={sw * 0.5}/>);
    }
  }
  return <g opacity={op}>{els}</g>;
};

/** Antenna panel (a small tall rectangle on the tower). */
export const PanelG: React.FC<{x: number; y: number; s?: number; color?: string; op?: number}> = ({x, y, s = 1, color = C.teal, op = 1}) => (
  <rect x={x - 8 * s} y={y - 24 * s} width={16 * s} height={48 * s} rx={3 * s} fill={color} opacity={op}/>
);

/** Photo-annotation ring: ink halo plus white line, drawn at `at`. */
export const Ring: React.FC<{f: number; at: number; x: number; y: number; r?: number; dur?: number}> = ({f, at, x, y, r = 34, dur = 12}) => {
  const p = ease(f, at, at + dur, outCubic);
  if (p <= 0) return null;
  const len = 2 * Math.PI * r;
  return (
    <g transform={`rotate(-90 ${x} ${y})`}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.ink} strokeWidth={11} strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={0.55}/>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.white} strokeWidth={5} strokeDasharray={len} strokeDashoffset={len * (1 - p)}/>
    </g>
  );
};

/** Leader line from a label to a target point, then a ring at the target. */
export const Leader: React.FC<{f: number; at: number; from: [number, number]; to: [number, number]; r?: number; dash?: boolean}> = ({f, at, from, to, r = 34, dash}) => {
  const p = ease(f, at, at + 10, outCubic);
  if (p <= 0) return null;
  const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy) || 1;
  const ex = to[0] - (dx / L) * r, ey = to[1] - (dy / L) * r;      // stop at the ring edge
  const x2 = from[0] + (ex - from[0]) * p, y2 = from[1] + (ey - from[1]) * p;
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={x2} y2={y2} stroke={C.ink} strokeWidth={9} opacity={0.5} strokeLinecap="round" strokeDasharray={dash ? "14 12" : undefined}/>
      <line x1={from[0]} y1={from[1]} x2={x2} y2={y2} stroke={C.white} strokeWidth={4} strokeLinecap="round" strokeDasharray={dash ? "14 12" : undefined}/>
      <Ring f={f} at={at + 8} x={to[0]} y={to[1]} r={r}/>
    </g>
  );
};

/** Big headline tag (SCREEN lines): charcoal box, white caps. */
export const Headline: React.FC<{f: number; at: number; text: string; x?: number; y: number; size?: number; bg?: string; color?: string; anchor?: "center" | "left"}> = ({f, at, text, x = 960, y, size = 56, bg = C.ink, color = C.white, anchor = "center"}) => {
  const p = ease(f, at, at + 12, outCubic);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(${anchor === "center" ? "-50%" : "0"}, -50%) translateY(${(1 - p) * 26}px)`, opacity: p,
      fontFamily: F.serif, fontWeight: 400, fontSize: size, letterSpacing: size * 0.01, color, background: bg, padding: `${size * 0.2}px ${size * 0.42}px ${size * 0.17}px`,
      whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(0,0,0,0.18)"}}>{text}</div>
  );
};

/** Plain text on the page (direct label). */
export const Txt: React.FC<{f: number; at: number; text: string; x: number; y: number; size?: number; color?: string; weight?: 600 | 800; align?: "center" | "left" | "right"; caps?: boolean;
  spacing?: number; out?: number}> = ({f, at, text, x, y, size = 34, color = C.ink, weight = 800, align = "center", caps, spacing = 0, out}) => {
  const p = ease(f, at, at + 10, outQuint) * (out != null ? 1 - ease(f, out, out + 8) : 1);
  if (p <= 0) return null;
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(${tx}, -50%) translateY(${(1 - p) * 14}px)`, opacity: p, fontFamily: size >= 48 ? F.serif : F.sans, fontWeight: size >= 48 ? 400 : weight, fontSize: size,
      color, letterSpacing: size >= 48 ? 0 : spacing, textTransform: caps ? "uppercase" : undefined, whiteSpace: "nowrap"}}>{text}</div>
  );
};

/** Radio arcs: concentric partial circles centred on (cx, cy) facing right (or left), drawn one after another. */
export const Arcs: React.FC<{f: number; at: number; cx: number; cy: number; radii: number[]; color: string; sw?: number; span?: number; gap?: number; dir?: 1 | -1; op?: number;
  clipId?: string}> = ({f, at, cx, cy, radii, color, sw = 7, span = 42, gap = 7, dir = 1, op = 0.95, clipId}) => (
  <g opacity={op} clipPath={clipId ? `url(#${clipId})` : undefined}>
    {radii.map((r, i) => {
      const p = ease(f, at + i * gap, at + i * gap + 14, outCubic);
      if (p <= 0) return null;
      const a0 = (-span * Math.PI) / 180, a1 = (span * Math.PI) / 180;
      const pt = (a: number) => [cx + dir * Math.cos(a) * r, cy + Math.sin(a) * r];
      const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
      const len = r * (a1 - a0);
      return <path key={i} d={`M ${x0} ${y0} A ${r} ${r} 0 0 ${dir === 1 ? 1 : 0} ${x1} ${y1}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={0.5 + 0.5 * p}/>;
    })}
  </g>
);

/** Pulse (0..1) that rises at `at` and falls away over `dur`: used for the flash at a purposeful change. */
export const pulse = (f: number, at: number, dur = 18) => (f < at ? 0 : Math.sin(Math.PI * clamp01((f - at) / dur)));
export {C, F, clamp01, ease, inOut, outCubic, outQuint, spr};

/** Standard shot frame (no random intro glide, so layouts stay where they are drawn): paper, camera layer, chip, finish. */
export const Frame: React.FC<{f: number; d: number; cam?: CamKey[]; chip?: string; over?: React.ReactNode; children?: React.ReactNode}> = ({f, d, cam, chip, over, children}) => {
  const c = camAt(f, cam ?? [[0, 1.0, 960, 540], [d, 1.02, 960, 540]]);
  return (
    <AbsoluteFill>
      <Layer cam={c} depth={0.85}><Paper drift={f / Math.max(1, d)}/></Layer>
      <Layer cam={c}>{children}</Layer>
      {over}
      {chip ? <SourceTag f={f} at={0} text={chip}/> : null}
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// "Vox style" documentary collage kit, built to the Calliope guide's spec (palette, one hero element,
// physical motion: spring/settle, counters tick, pins drop+wobble, typewriter strips, red swipes, 2% drift,
// hard cuts, text never fades in). Everything is code-drawn, so no invented text is possible.
import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing, staticFile} from "remotion";

export const C = {tan: "#C9BB9C", ink: "#1A1A1A", gray: "#8C8C8C", red: "#D62E1F", mustard: "#D9A441", paper: "#EFE6D2", white: "#F7F3EA"};
export const COND = "Oswald, Impact, 'Arial Narrow', sans-serif";
export const TYPE = "'American Typewriter', 'Courier New', monospace";

export const VoxFonts: React.FC = () => (
  <style>{`@font-face{font-family:Oswald;font-weight:700;src:url(${staticFile("fonts/Oswald-700.woff2")}) format("woff2");}`}</style>
);

export const VoxDefs: React.FC = () => (
  <defs>
    <filter id="vgrain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/>
      <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.22 0"/>
    </filter>
    <filter id="vtorn" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="11"/>
      <feDisplacementMap in="SourceGraphic" scale="12"/>
    </filter>
    <filter id="vshadow" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="6" dy="9" stdDeviation="5" floodColor="#2b2112" floodOpacity="0.35"/></filter>
    <pattern id="halftone" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="12" height="12" fill="#d9d4c9"/><circle cx="6" cy="6" r="3.6" fill="#3a3a3a"/>
    </pattern>
    <pattern id="halftoneLight" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="10" height="10" fill="#e8e2d4"/><circle cx="5" cy="5" r="2.2" fill="#6f6f6f"/>
    </pattern>
  </defs>
);

// The locked stage: archival tan, faint map contours and graticule, print grain.
export const Stage: React.FC<{w?: number; h?: number}> = ({w = 1080, h = 1920}) => {
  const k = w / 1080;
  const contours = Array.from({length: Math.ceil(h / 200)}, (_, i) => {
    const y = 180 + i * 200;
    return `M -50 ${y} C ${200 * k} ${y - 80 + (i % 3) * 30}, ${420 * k} ${y + 90}, ${640 * k} ${y + 10} S ${980 * k} ${y - 70}, ${w + 70} ${y + 30}`;
  });
  return (
    <g>
      <rect width={w} height={h} fill={C.tan}/>
      {Array.from({length: Math.ceil(w / 180) + 1}, (_, i) => <line key={`v${i}`} x1={i * 180} y1={0} x2={i * 180 + 60} y2={h} stroke="#a89a7c" strokeWidth={1} opacity={0.35}/>)}
      {Array.from({length: Math.ceil(h / 190) + 1}, (_, i) => <line key={`h${i}`} x1={0} y1={i * 190} x2={w} y2={i * 190 + 20} stroke="#a89a7c" strokeWidth={1} opacity={0.35}/>)}
      {contours.map((d, i) => <path key={i} d={d} fill="none" stroke="#9c8d6d" strokeWidth={2} opacity={0.3}/>)}
      <rect width={w} height={h} filter="url(#vgrain)"/>
    </g>
  );
};

// Spring entrance with overshoot, then settle ("cutouts spring up with slight overshoot").
export const useSpringIn = (start: number, fromY = 120) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f - start, fps, config: {damping: 11, stiffness: 140, mass: 0.8}});
  return {visible: f >= start, s, ty: (1 - s) * fromY, scale: 0.85 + 0.15 * s};
};

export const TornCard: React.FC<{x: number; y: number; w: number; h: number; start: number; fill?: string; rot?: number; children?: React.ReactNode}> =
  ({x, y, w, h, start, fill = C.paper, rot = 0, children}) => {
  const {visible, ty, scale} = useSpringIn(start);
  if (!visible) return null;
  return (
    <g transform={`translate(${x + w / 2} ${y + h / 2 + ty}) rotate(${rot}) scale(${scale}) translate(${-w / 2} ${-h / 2})`}>
      <rect x={0} y={0} width={w} height={h} fill={fill} filter="url(#vtorn)" style={{filter: "url(#vtorn) url(#vshadow)"}}/>
      {children}
    </g>
  );
};

// Condensed caps headline that arrives on a paper strip (never fades).
export const Strip: React.FC<{x: number; y: number; start: number; text: string; size?: number; fill?: string; color?: string; rot?: number; font?: string}> =
  ({x, y, start, text, size = 64, fill = C.white, color = C.ink, rot = 0, font = COND}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 8], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  if (p <= 0) return null;
  const w = text.length * size * (font === TYPE ? 0.62 : 0.52) + size * 0.8, h = size * 1.45;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <clipPath id={`strip-${x}-${y}-${start}`}><rect x={-w / 2} y={-h / 2} width={w * p} height={h}/></clipPath>
      <g clipPath={`url(#strip-${x}-${y}-${start})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={fill} filter="url(#vtorn)" style={{filter: "url(#vtorn) url(#vshadow)"}}/>
        <text x={0} y={size * 0.36} fontFamily={font} fontWeight={700} fontSize={size} textAnchor="middle" fill={color} letterSpacing={font === COND ? 1 : 0}>{text}</text>
      </g>
    </g>
  );
};

// Typewriter label: characters arrive one by one on a strip being pulled.
export const TypeLabel: React.FC<{x: number; y: number; start: number; text: string; size?: number; cps?: number}> =
  ({x, y, start, text, size = 34, cps = 1.6}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - start) * cps)));
  if (f < start) return null;
  const w = text.length * size * 0.62 + 40;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-20} y={-size * 1.05} width={w} height={size * 1.55} fill={C.white} style={{filter: "url(#vshadow)"}}/>
      <text x={0} y={0} fontFamily={TYPE} fontSize={size} fill={C.ink}>{text.slice(0, n)}</text>
    </g>
  );
};

// Red underline swipe, left to right.
export const Swipe: React.FC<{x: number; y: number; w: number; start: number; h?: number}> = ({x, y, w, start, h = 14}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 9], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad)});
  return p > 0 ? <rect x={x} y={y} width={w * p} height={h} fill={C.red} transform={`skewX(-8)`} style={{transformOrigin: `${x}px ${y}px`}}/> : null;
};

// Counter that ticks up mechanically to a value.
export const Counter: React.FC<{x: number; y: number; start: number; to: number; from?: number; dur?: number; prefix?: string; suffix?: string; size?: number; color?: string; decimals?: number}> =
  ({x, y, start, to, from = 0, dur = 22, prefix = "", suffix = "", size = 240, color = C.ink, decimals = 0}) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  const p = interpolate(f, [start, start + dur], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  const v = from + (to - from) * p;
  const shown = decimals ? v.toFixed(decimals) : String(Math.round(v));
  return <text x={x} y={y} fontFamily={COND} fontWeight={700} fontSize={size} textAnchor="middle" fill={color}>{prefix}{shown}{suffix}</text>;
};

// Rubber stamp: slams down (scale 1.5 -> 1) and stays.
export const Stamp: React.FC<{x: number; y: number; start: number; text: string; rot?: number; size?: number}> = ({x, y, start, text, rot = -10, size = 70}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const s = spring({frame: f - start, fps, config: {damping: 14, stiffness: 260}});
  const k = 1.5 - 0.5 * s;
  const w = text.length * size * 0.55 + 70, h = size * 1.6;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} opacity={0.92}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="none" stroke={C.red} strokeWidth={9} filter="url(#vtorn)"/>
      <text x={0} y={size * 0.36} fontFamily={COND} fontWeight={700} fontSize={size} textAnchor="middle" fill={C.red} letterSpacing={3}>{text}</text>
    </g>
  );
};

// Map pin: drops in and wobbles once.
export const Pin: React.FC<{x: number; y: number; start: number}> = ({x, y, start}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  if (f < start) return null;
  const s = spring({frame: f - start, fps, config: {damping: 9, stiffness: 180}});
  const wob = Math.sin((f - start) / 3) * 10 * Math.max(0, 1 - (f - start) / 24);
  return (
    <g transform={`translate(${x} ${y - (1 - s) * 220}) rotate(${wob})`}>
      <line x1={0} y1={0} x2={0} y2={-46} stroke="#6b5a2e" strokeWidth={5}/>
      <circle cx={0} cy={-58} r={20} fill={C.red} stroke="#7a130b" strokeWidth={3}/>
      <circle cx={-6} cy={-64} r={6} fill="#ff8a7a" opacity={0.7}/>
    </g>
  );
};

// Red string drawing itself between points.
export const RedString: React.FC<{pts: [number, number][]; start: number; dur?: number}> = ({pts, start, dur = 16}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + dur], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (p <= 0) return null;
  const d = pts.map((q, i) => `${i ? "L" : "M"} ${q[0]} ${q[1]}`).join(" ");
  return <path d={d} fill="none" stroke={C.red} strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p}/>;
};

// Halftone cutout: a silhouette with halftone fill, white keyline and an offset red stroke behind it.
export const HalftoneCutout: React.FC<{d: string; start: number; x?: number; y?: number; scale?: number}> = ({d, start, x = 0, y = 0, scale = 1}) => {
  const {visible, ty, scale: sc} = useSpringIn(start, 160);
  if (!visible) return null;
  return (
    <g transform={`translate(${x} ${y + ty}) scale(${scale * sc})`}>
      <path d={d} fill="none" stroke={C.red} strokeWidth={10} transform="translate(14 12)"/>
      <path d={d} fill="url(#halftone)" stroke={C.white} strokeWidth={12} strokeLinejoin="round" style={{filter: "url(#vshadow)"}}/>
      <path d={d} fill="url(#halftone)"/>
    </g>
  );
};

// Masking-tape fragment.
export const Tape: React.FC<{x: number; y: number; rot?: number; w?: number}> = ({x, y, rot = -12, w = 150}) => (
  <rect x={x} y={y} width={w} height={44} fill="#efe3b8" opacity={0.85} transform={`rotate(${rot} ${x + w / 2} ${y + 22})`} filter="url(#vtorn)"/>
);

// Slow 2% camera drift across a beat.
export const Drift: React.FC<{frames: number; cx?: number; cy?: number; children: React.ReactNode}> = ({frames, cx = 540, cy = 960, children}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, frames], [1, 1.02]);
  const dx = interpolate(f, [0, frames], [0, -10]);
  return <g transform={`translate(${cx + dx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>{children}</g>;
};

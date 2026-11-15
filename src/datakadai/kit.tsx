// Data Kadai kit: the shop palette, Trust Stamp, source bar, brand bug and draft watermark.
// Rule baked in: every data scene shows its source and a Trust Stamp (OFFICIAL / ESTIMATE / CLAIM).
import React from "react";
import {interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from "remotion";

export const K = {
  paper: "#FBF3E4", kraft: "#F1E2C6", ink: "#2B1D12", soft: "#6B5A48", line: "#D9C9AA",
  turmeric: "#E8A317", leaf: "#2F7D4F", brick: "#B5432C", chai: "#7A4A2A", base: "#EDE3CF", white: "#FFFDF7",
};
export const COND = "Oswald, Impact, 'Arial Narrow', sans-serif";
export const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
export const STAMP = {
  OFFICIAL: {color: K.leaf, sub: "Govt / regulator data"},
  ESTIMATE: {color: "#C98A0B", sub: "Analyst estimate"},
  CLAIM: {color: K.brick, sub: "Company's own claim"},
} as const;
export type StampKind = keyof typeof STAMP;

export const DkFonts: React.FC = () => (
  <style>{`@font-face{font-family:Oswald;font-weight:700;src:url(${staticFile("fonts/Oswald-700.woff2")}) format("woff2");}`}</style>
);

export const prog = (f: number, a: number, d: number) =>
  interpolate(f, [a, a + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

export const usePop = (start: number) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f - start, fps, config: {damping: 12, stiffness: 160, mass: 0.7}});
  return {on: f >= start, s};
};

export const fmt = (v: number | null | undefined, dec = 0) =>
  v == null ? "n/a" : v.toLocaleString("en-IN", {minimumFractionDigits: dec, maximumFractionDigits: dec});

// Rubber stamp that thunks down (scale overshoot) at `start` and stays.
export const TrustStamp: React.FC<{kind: StampKind; x: number; y: number; size?: number; start: number; rot?: number}> =
  ({kind, x, y, size = 1, start, rot = -8}) => {
  const {on, s} = usePop(start);
  if (!on) return null;
  const c = STAMP[kind].color;
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${(1.6 - 0.6 * s) * size})`,
      transformOrigin: "center", opacity: Math.min(1, s * 1.4), border: `${5 * size}px solid ${c}`, borderRadius: 10 * size,
      padding: `${6 * size}px ${16 * size}px`, color: c, textAlign: "center", background: "rgba(255,253,247,0.75)"}}>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 40 * size, letterSpacing: 3 * size, lineHeight: 1}}>{kind}</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 15 * size, letterSpacing: 1, textTransform: "uppercase"}}>{STAMP[kind].sub}</div>
    </div>
  );
};

export type Source = {name: string; url?: string; via?: string; checked: string};
export const SourceBar: React.FC<{src: Source; x: number; y: number; w: number; start: number; extra?: string; size?: number}> =
  ({src, x, y, w, start, extra, size = 1}) => {
  const f = useCurrentFrame();
  const p = prog(f, start, 10);
  if (p <= 0) return null;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, opacity: p, fontFamily: SANS, color: K.soft,
      fontSize: 19 * size, lineHeight: 1.35, borderTop: `2px solid ${K.line}`, paddingTop: 8 * size}}>
      <b style={{color: K.ink}}>Source:</b> {src.name}{src.url ? ` · ${src.url}` : ""}
      <br/>{src.via ? `Data via ${src.via} · ` : ""}Checked {src.checked}{extra ? ` · ${extra}` : ""}
    </div>
  );
};

// Shop-awning brand bug: striped canopy + wordmark.
export const Brand: React.FC<{x: number; y: number; size?: number}> = ({x, y, size = 1}) => (
  <div style={{position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 12 * size}}>
    <svg width={54 * size} height={44 * size} viewBox="0 0 54 44">
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${i * 9} 4 h9 v14 a4.5 4.5 0 0 1 -9 0 z`} fill={i % 2 ? K.paper : K.brick}/>)}
      <rect x={0} y={0} width={54} height={5} fill={K.ink}/>
      <rect x={6} y={24} width={42} height={18} fill={K.turmeric}/>
      <rect x={21} y={29} width={12} height={13} fill={K.ink}/>
    </svg>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: 38 * size, color: K.ink, letterSpacing: 2 * size}}>
      DATA <span style={{color: K.brick}}>KADAI</span>
    </div>
  </div>
);

export const DraftMark: React.FC<{reason?: string | null}> = ({reason}) => reason ? (
  <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none"}}>
    <div style={{transform: "rotate(-24deg)", border: `8px solid rgba(181,67,44,0.55)`, color: "rgba(181,67,44,0.55)",
      fontFamily: COND, fontWeight: 700, fontSize: 110, padding: "4px 36px", letterSpacing: 6, whiteSpace: "nowrap"}}>
      DRAFT · NOT FOR UPLOAD
    </div>
  </div>
) : null;

export const Paper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: "absolute", inset: 0, background: K.paper, overflow: "hidden"}}>
    <svg width="100%" height="100%" style={{position: "absolute", inset: 0}}>
      <defs>
        <filter id="dkgrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0.10 0"/></filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#dkgrain)"/>
    </svg>
    {children}
  </div>
);

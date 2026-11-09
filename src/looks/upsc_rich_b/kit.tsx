// Direction B: a rich, daylight, illustrated editorial look. Everything is drawn in code (SVG + CSS).
import React, {useEffect, useState} from "react";
import {cancelRender, continueRender, delayRender, staticFile} from "remotion";

export const W = 1920, H = 1080;
export const SERIF = "'RB Newsreader', Georgia, serif";
export const SANS = "'RB Schibsted', 'Helvetica Neue', Arial, sans-serif";

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const eo = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const eio = (t: number) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
/** progress 0..1 of a local timing: starts at frame a, lasts d logical frames */
export const prog = (f: number, a: number, d: number) => clamp((f - a) / d);
export const rng = (seed: number) => { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };

// fonts: Newsreader (serif headlines and numbers), Schibsted Grotesk (labels)
let fontP: Promise<void> | null = null;
const loadFonts = () => fontP ??= (async () => {
  const a = new FontFace("RB Newsreader", `url("${staticFile("fonts/looks/newsreader/Newsreader-VF.ttf")}")`, {weight: "200 800", display: "block"});
  const b = new FontFace("RB Schibsted", `url("${staticFile("fonts/looks/schibstedgrotesk/SchibstedGrotesk-VF.ttf")}")`, {weight: "400 900", display: "block"});
  const [x, y] = await Promise.all([a.load(), b.load()]);
  (document.fonts as any).add(x); (document.fonts as any).add(y);
})();
export const Fonts: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [ready, setReady] = useState(false);
  const [h] = useState(() => delayRender("rich-b fonts", {timeoutInMilliseconds: 60000}));
  useEffect(() => { loadFonts().then(() => { setReady(true); continueRender(h); }).catch((e) => cancelRender(e)); }, []); // eslint-disable-line
  return ready ? <>{children}</> : null;
};

/** fine paper grain + fibres + soft vignette, laid over the whole frame */
export const PaperFinish: React.FC<{grain?: number; vignette?: number; id?: string}> = ({grain = 0.5, vignette = 0.35, id = "pf"}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0, pointerEvents: "none"}}>
    <defs>
      <filter id={`${id}-g`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <filter id={`${id}-fib`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.5" numOctaves="3" seed="11"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <radialGradient id={`${id}-v`} cx="50%" cy="48%" r="75%">
        <stop offset="0.55" stopColor="#3a2412" stopOpacity="0"/>
        <stop offset="1" stopColor="#3a2412" stopOpacity={vignette}/>
      </radialGradient>
    </defs>
    <rect width={W} height={H} filter={`url(#${id}-g)`} opacity={grain} style={{mixBlendMode: "soft-light"}}/>
    <rect width={W} height={H} filter={`url(#${id}-fib)`} opacity={grain * 0.45} style={{mixBlendMode: "soft-light"}}/>
    <rect width={W} height={H} fill={`url(#${id}-v)`}/>
  </svg>
);

/** frosted glass-paper card */
export const cardStyle = (x: number, y: number, w: number, h: number, a: number, rise = 26, tint = "190,110,50"): React.CSSProperties => ({
  position: "absolute", left: x, top: y + (1 - a) * rise, width: w, height: h, opacity: a,
  background: "linear-gradient(160deg, rgba(255,252,243,.9), rgba(255,243,219,.76))",
  border: `1.5px solid rgba(${tint},.5)`, borderRadius: 20,
  boxShadow: "0 30px 60px -26px rgba(80,44,18,.55), 0 6px 14px -6px rgba(80,44,18,.3), inset 0 1.5px 0 rgba(255,255,255,.9)",
  backdropFilter: "blur(10px)", overflow: "hidden",
});
export const Pill: React.FC<{x: number; y: number; text: string; a: number; dot?: string}> = ({x, y, text, a, dot = "#d8682a"}) => (
  <div style={{position: "absolute", left: x, top: y - (1 - a) * 12, opacity: a, display: "flex", alignItems: "center", gap: 12,
    padding: "10px 22px 10px 16px", borderRadius: 40, background: "rgba(255,250,238,.82)", border: "1.2px solid rgba(150,90,40,.35)",
    boxShadow: "0 10px 24px -12px rgba(70,40,15,.5), inset 0 1px 0 rgba(255,255,255,.9)", backdropFilter: "blur(8px)",
    fontFamily: SANS, fontWeight: 700, fontSize: 21, letterSpacing: "0.17em", color: "#6a3a1c"}}>
    <span style={{width: 12, height: 12, borderRadius: 7, background: dot, boxShadow: `0 0 0 4px ${dot}33`}}/>{text}
  </div>
);

/** a catenary-ish wire */
export const Wire: React.FC<{x1: number; y1: number; x2: number; y2: number; sag?: number; c?: string; w?: number; sway?: number; op?: number}> = ({x1, y1, x2, y2, sag = 30, c = "#3b2f2c", w = 1.6, sway = 0, op = 0.8}) => (
  <path d={`M${x1},${y1} Q${(x1 + x2) / 2},${Math.max(y1, y2) + sag + sway} ${x2},${y2}`} fill="none" stroke={c} strokeWidth={w} opacity={op} strokeLinecap="round"/>
);

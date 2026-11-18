// Gadget Shorts kit (tech-launch series for India, started 21 Oct 2026; working name "Gadget Kadai", AK to confirm).
// Editorial kinetic look: warm paper, heavy black capitals with one cobalt accent, italic serif asides, mono labels,
// episode tag + progress bar on top, the product drawn in code and kept on screen between beats.
import React, {useEffect, useState} from "react";
import {AbsoluteFill, Easing, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/inter/900.css";

export const FPS = 30, W = 1080, H = 1920;
export const C = {
  paper: "#F2EEE7", paper2: "#E9E3D9", ink: "#151311", ink2: "#3B3632", mute: "#8C847B", line: "#D6CEC2",
  accent: "#2348E0", accentSoft: "#DCE3FB", night: "#121214", white: "#FFFFFF",
};
export const HEAD = "GKHead, Inter, sans-serif", SERIF = "GKSerif, Georgia, serif", MONO = "'IBM Plex Mono', monospace";

// ---------- fonts
let fontsReady = false;
export const useGKFonts = () => {
  const [h] = useState(() => (fontsReady ? null : delayRender("gadget fonts")));
  useEffect(() => {
    if (h === null) return;
    const faces = [
      new FontFace("GKHead", `url(${staticFile("gadget/fonts/archivo-black-latin-400-normal.woff2")})`),
      new FontFace("GKSerif", `url(${staticFile("gadget/fonts/instrument-serif-latin-400-italic.woff2")})`, {style: "italic"}),
      new FontFace("GKSerif", `url(${staticFile("gadget/fonts/instrument-serif-latin-400-normal.woff2")})`),
    ];
    Promise.all(faces.map((f) => f.load().then(() => document.fonts.add(f))))
      .then(() => document.fonts.ready)
      .then(() => { fontsReady = true; continueRender(h); });
  }, [h]);
};

// ---------- timing: cues come from the aligned narration (timing.json written by scripts/gadget/gk_align.py)
export type Timing = {total: number; beats: Record<string, [number, number]>; words: [string, number, number, string][]};
const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
export const makeCues = (T: Timing) => {
  const keys = Object.keys(T.beats);
  const f = (s: number) => Math.round(s * FPS);
  /** frame where `phrase` starts inside beat k ("phrase|+0.2" offsets in seconds); a number is seconds from beat start */
  const at = (k: string, x: number | string = 0): number => {
    const b = T.beats[k]; if (!b) throw new Error("no beat " + k);
    if (typeof x === "number") return f(b[0] + x);
    const [p, o] = x.split("|"); const toks = norm(p).split(" ");
    const ws = T.words.filter((w) => w[3] === k);
    for (let i = 0; i + toks.length <= ws.length; i++)
      if (toks.every((t, j) => norm(ws[i + j][0]) === t)) return f(ws[i][1] + (o ? parseFloat(o) : 0));
    throw new Error(`phrase not in ${k}: ${p}`);
  };
  const end = (k: string) => f(T.beats[k][1]);
  /** a beat's screen time runs from its first word to the next beat's first word */
  const next = (k: string) => { const i = keys.indexOf(k); return i + 1 < keys.length ? f(T.beats[keys[i + 1]][0]) : f(T.total) + 45; };
  return {at, end, next, keys, total: f(T.total)};
};

// ---------- motion helpers
export const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const ease = (fr: number, a: number, b: number, from = 0, to = 1, e = Easing.bezier(0.22, 1, 0.36, 1)) =>
  interpolate(fr, [a, b], [from, to], {...clamp, easing: e});
export const lin = (fr: number, a: number, b: number, from = 0, to = 1) => interpolate(fr, [a, b], [from, to], clamp);
export const usePop = () => {
  const {fps} = useVideoConfig(); const fr = useCurrentFrame();
  return (f0: number, damping = 14, stiffness = 170) => (fr < f0 ? 0 : spring({frame: fr - f0, fps, config: {damping, stiffness, mass: 0.7}}));
};
/** visible window: in at a, gone by b + 1 (the exit fade runs just before b, so the next beat never stacks on this one) */
export const win = (fr: number, a: number, b: number, out = 4) => (fr < a - 1 || fr > b + 1 ? 0 : fr > b + 1 - out ? (b + 1 - fr) / out : 1);

// ---------- Shorts safe area (AK, 22 Oct 2026: keep content clear of YouTube's top title, right buttons and bottom name).
// Page coordinates map to x' = 30 + 0.88x, y' = 150 + 0.88y (AK, 22 Oct: don't leave empty space, so a gentler box than Data
// Kadai's 0.78). Keep page content above y 1600 and left of x 1045 so it clears the bottom and right overlays.
export const SAFE = {x: 30, y: 150, s: 0.88};
/** enlarge a drawing about its own centre (cx, cy in page coordinates) */
export const Zoom: React.FC<{s: number; cx: number; cy: number; dy?: number; children: React.ReactNode}> = ({s, cx, cy, dy = 0, children}) => (
  <div style={{position: "absolute", left: 0, top: dy, width: W, height: H, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${s})`}}>{children}</div>
);
export const Safe: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: `translate(${SAFE.x}px, ${SAFE.y}px) scale(${SAFE.s})`}}>{children}</div>
);

// ---------- rich motion (AK, 22 Oct 2026: "rich motion and rich visuals")
/** one shot: slides in from the side, pushes in slowly while it plays, slides out the other way. Children keep their own cues. */
export const Cam: React.FC<{a: number; b: number; from?: "right" | "left" | "up"; push?: number; children: React.ReactNode}> = ({a, b, from = "right", push = 0.07, children}) => {
  const fr = useCurrentFrame();
  if (fr < a - 1 || fr > b) return null;
  const i = ease(fr, a - 1, a + 12), o = ease(fr, b - 8, b, 0, 1, Easing.bezier(0.55, 0, 0.75, 0.3));   // gone by b: shots never stack
  const d = 160, sx = from === "right" ? 1 : from === "left" ? -1 : 0, sy = from === "up" ? 1 : 0;
  const x = sx * ((1 - i) * d - o * d), y = sy * ((1 - i) * d - o * d * 0.6);
  const s = 1 + push * lin(fr, a, b) + (1 - i) * 0.04;
  return (
    <div style={{position: "absolute", left: 0, top: 0, width: W, height: H, opacity: Math.min(i * 1.4, 1) * (1 - o),
      transformOrigin: "540px 1080px", transform: `translate(${x}px, ${y}px) scale(${s}) rotate(${(1 - i) * sx * 1.2}deg)`}}>
      {children}
    </div>
  );
};
/** slow-drifting dots and soft washes behind everything (same paper colour family, never a border) */
export const Ambient: React.FC<{tint?: string}> = ({tint = C.accent}) => {
  const fr = useCurrentFrame(); const t = fr / FPS;
  const dots = Array.from({length: 26}, (_, k) => {
    const r = Math.sin(k * 91.7) * 0.5 + 0.5, q = Math.sin(k * 53.3) * 0.5 + 0.5;
    const x = ((r * W + t * (8 + 14 * q)) % (W + 40)) - 20, y = ((q * H - t * (10 + 18 * r)) % H + H) % H;
    return <circle key={k} cx={x} cy={y} r={3 + 5 * q} fill={k % 3 ? C.ink : tint} opacity={0.04 + 0.05 * r}/>;
  });
  return (
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
      {dots}
    </svg>
  );
};

// ---------- background, frame chrome
export const Paper: React.FC<{dark?: number}> = ({dark = 0}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 38%, rgba(255,255,255,0.35), rgba(0,0,0,0) 60%)`}}/>
      <AbsoluteFill style={{background: C.night, opacity: dark}}/>
      <svg width={W} height={H} style={{position: "absolute", opacity: 0.05 + dark * 0.03, mixBlendMode: "multiply"}}>
        <filter id="gkgrain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={fr % 6}/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width={W} height={H} filter="url(#gkgrain)"/>
      </svg>
    </AbsoluteFill>
  );
};
export const TopBar: React.FC<{ep: string; product: string; total: number; dark?: number; tag?: string}> = ({ep, product, total, dark = 0, tag = "GK"}) => {
  const fr = useCurrentFrame(); const t = Math.floor(fr / FPS);
  const ink = dark > 0.5 ? "#EDE8E0" : C.ink, mute = dark > 0.5 ? "#77716A" : C.mute;
  return (
    <div style={{position: "absolute", left: 64, right: 64, top: 86, fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: ink, textTransform: "uppercase"}}>
      <div style={{display: "flex", alignItems: "center", gap: 16}}>
        <span style={{background: C.accent, color: C.white, padding: "4px 12px", borderRadius: 6, fontWeight: 600}}>{tag}{ep}</span>
        <span style={{fontWeight: 500}}>{product}</span>
        <span style={{marginLeft: "auto", color: mute}}>{`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`}</span>
      </div>
      <div style={{marginTop: 18, height: 4, background: dark > 0.5 ? "#2A2827" : C.line, borderRadius: 2}}>
        <div style={{width: `${Math.min(100, (fr / total) * 100)}%`, height: 4, background: C.accent, borderRadius: 2}}/>
      </div>
    </div>
  );
};
export const Source: React.FC<{text: string; o: number; dark?: boolean}> = ({text, o, dark}) => (
  <div style={{position: "absolute", left: 64, right: 64, top: 1590, fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: dark ? "#77716A" : C.mute, opacity: o, textTransform: "uppercase"}}>
    {text}
  </div>
);

// ---------- type
/** heavy headline; words animate up one by one from f0. Words wrapped in {braces} take the accent colour. */
export const Head: React.FC<{text: string; f0: number; size?: number; x?: number; y: number; align?: "left" | "center"; color?: string; o?: number; stagger?: number; lh?: number; maxW?: number}> = ({text, f0, size = 120, x = 64, y, align = "left", color = C.ink, o = 1, stagger = 3, lh = 0.94, maxW = W - 128}) => {
  const pop = usePop();
  const lines = text.split("\n"); let n = 0, inAcc = false;
  return (
    <div style={{position: "absolute", left: align === "center" ? (W - maxW) / 2 : x, top: y, width: maxW, textAlign: align, fontFamily: HEAD, fontSize: size, lineHeight: lh, color, opacity: o, textTransform: "uppercase", letterSpacing: -1}}>
      {lines.map((ln, li) => (
        <div key={li} style={{whiteSpace: "nowrap"}}>
          {ln.split(" ").map((w0, wi) => {
            if (w0.startsWith("{")) inAcc = true;
            const acc = inAcc; if (w0.includes("}")) inAcc = false;
            const w = w0.replace(/[{}]/g, ""); const p = pop(f0 + stagger * n++, 13, 190);
            return (
              <span key={wi} style={{display: "inline-block", overflow: "hidden", verticalAlign: "top", marginRight: "0.22em", paddingBottom: "0.06em"}}>
                <span style={{display: "inline-block", transform: `translateY(${(1 - p) * 105}%)`, color: acc ? C.accent : undefined}}>{w}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
/** italic serif aside, typed on letter by letter */
export const Aside: React.FC<{text: string; f0: number; size?: number; x?: number; y: number; align?: "left" | "center"; color?: string; o?: number; cps?: number}> = ({text, f0, size = 76, x = 64, y, align = "left", color = C.ink2, o = 1, cps = 30}) => {
  const fr = useCurrentFrame(); const k = Math.max(0, Math.floor(((fr - f0) / FPS) * cps));
  return (
    <div style={{position: "absolute", left: align === "center" ? 0 : x, width: align === "center" ? W : W - x - 64, top: y, textAlign: align, fontFamily: SERIF, fontStyle: "italic", fontSize: size, color, opacity: o, lineHeight: 1.05}}>
      {text.slice(0, k)}<span style={{opacity: 0}}>{text.slice(k)}</span>
    </div>
  );
};
export const Mono: React.FC<{text: string; f0: number; x?: number; y: number; size?: number; align?: "left" | "center"; color?: string; o?: number}> = ({text, f0, x = 64, y, size = 28, align = "left", color = C.mute, o = 1}) => {
  const fr = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: align === "center" ? 0 : x, width: align === "center" ? W : undefined, top: y, textAlign: align, fontFamily: MONO, fontWeight: 500, fontSize: size, letterSpacing: 3, color, textTransform: "uppercase", opacity: o * lin(fr, f0, f0 + 8), transform: `translateY(${ease(fr, f0, f0 + 12, 14, 0)}px)`}}>
      {text}
    </div>
  );
};
/** black pill tag with a dot, like a product label */
export const Tag: React.FC<{text: string; f0: number; x: number; y: number; accent?: boolean; o?: number; size?: number}> = ({text, f0, x, y, accent, o = 1, size = 24}) => {
  const pop = usePop(); const p = pop(f0);
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "left center", opacity: o * Math.min(1, p * 2), background: accent ? C.accent : C.ink, color: C.white, fontFamily: MONO, fontWeight: 600, fontSize: size, letterSpacing: 2, padding: `${size / 3}px ${size * 0.75}px`, borderRadius: 999, textTransform: "uppercase", whiteSpace: "nowrap"}}>
      {text}
    </div>
  );
};
/** big spec number with a small caption under it */
export const Spec: React.FC<{big: React.ReactNode; small: string; f0: number; x?: number; y: number; size?: number; align?: "left" | "center"; o?: number; color?: string}> = ({big, small, f0, x = 64, y, size = 200, align = "left", o = 1, color = C.ink}) => {
  const pop = usePop(); const p = pop(f0, 12, 160);
  return (
    <div style={{position: "absolute", left: align === "center" ? 0 : x, width: align === "center" ? W : undefined, top: y, textAlign: align, opacity: o * Math.min(1, p * 1.6)}}>
      <div style={{fontFamily: HEAD, fontSize: size, lineHeight: 0.9, color, letterSpacing: -3, transform: `translateY(${(1 - p) * 40}px)`, whiteSpace: "nowrap"}}>{big}</div>
      <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: 3, color: color === C.ink ? C.mute : "#8F8A84", marginTop: 14, textTransform: "uppercase"}}>{small}</div>
    </div>
  );
};
/** price sticker: slaps in rotated */
export const PriceTag: React.FC<{text: React.ReactNode; f0: number; x: number; y: number; size?: number; rot?: number; o?: number}> = ({text, f0, x, y, size = 120, rot = -6, o = 1}) => {
  const pop = usePop(); const p = pop(f0, 10, 220);
  return (
    <div style={{position: "absolute", left: x, top: y, opacity: o * Math.min(1, p * 3), transform: `rotate(${rot + (1 - p) * 10}deg) scale(${1.6 - 0.6 * p})`, transformOrigin: "center"}}>
      <div style={{background: C.accent, color: C.white, fontFamily: HEAD, fontSize: size, padding: "18px 44px 22px 44px", borderRadius: 22, boxShadow: "0 18px 40px rgba(20,30,90,0.25)", position: "relative", letterSpacing: -2}}>
        {text}
      </div>
    </div>
  );
};
/** strike-through row: text, then a line draws across it */
export const Strike: React.FC<{label: string; text: string; f0: number; y: number; o?: number}> = ({label, text, f0, y, o = 1}) => {
  const fr = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 64, top: y, opacity: o * lin(fr, f0, f0 + 6)}}>
      <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: C.accent, fontWeight: 600}}>{label}</div>
      <div style={{position: "relative", fontFamily: HEAD, fontSize: 64, color: C.mute, textTransform: "uppercase", letterSpacing: -1}}>
        {text}
        <div style={{position: "absolute", left: -10, top: "52%", height: 7, width: `${ease(fr, f0 + 6, f0 + 16, 0, 104)}%`, background: C.ink, borderRadius: 4}}/>
      </div>
    </div>
  );
};
/** on/off pill switch; `on` is 0..1 */
export const Toggle: React.FC<{on: number; x: number; y: number; w?: number}> = ({on, x, y, w = 200}) => {
  const h = w / 2;
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h, border: `6px solid ${C.ink}`, boxSizing: "border-box", background: interpolateColor(on, C.paper, C.accent)}}>
      <div style={{position: "absolute", top: 6, left: 6 + on * (w - h), width: h - 24, height: h - 24, borderRadius: h, background: on > 0.5 ? C.white : C.ink}}/>
    </div>
  );
};
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
export const interpolateColor = (t: number, a: string, b: string) => {
  const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};
/** line that draws itself (svg path), progress 0..1 */
export const Draw: React.FC<{d: string; p: number; stroke?: string; w?: number; len?: number; fill?: string}> = ({d, p, stroke = C.ink, w = 6, len = 3000, fill = "none"}) => (
  <path d={d} fill={fill} stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)}/>
);

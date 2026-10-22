// The Katha look (21 Oct 2026): AK asked for the Bhagavad Gita "premium, rich, poetic". Deep indigo, saffron and gold,
// silhouettes rimmed with light, Sanskrit in Tiro Devanagari Sanskrit, English in Cormorant Garamond, titles in Cinzel.
// Fonts are OFL-1.1 from the @fontsource packages, copied into public/fonts/katha with their licences.
import React, {useId} from "react";
import {staticFile} from "remotion";
import {KATHA_FACES} from "./faces";

export const W = 1920, H = 1080, FPS = 30;
export const SA = "'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif";
export const EN = "'Cormorant Garamond', 'Noto Serif', Georgia, serif";
export const CAPS = "'Cinzel', 'Cormorant Garamond', serif";
export const K = {
  night: "#07050F", indigo: "#140F2C", violet: "#2E2350", plum: "#4A2B5C", rose: "#8E3D52", vermilion: "#C2553A",
  saffron: "#F0A04B", gold: "#E8B65A", goldLt: "#FFE3A3", goldDk: "#B8862F", cream: "#F4EBDA", parchment: "#C9B48A",
  sil: "#160C1E", silHorse: "#231833", rim: "#FFD38A", ink: "#0B0712", lotus: "#E59AA8", water: "#2B4A78",
};
export const KathaFonts: React.FC = () => (
  <style>{KATHA_FACES.map(([fam, style, weight, file, range]) =>
    `@font-face{font-family:'${fam}';font-style:${style};font-weight:${weight};src:url(${staticFile(`fonts/katha/${file}`)}) format("woff2");${range ? `unicode-range:${range};` : ""}}`).join("\n")}</style>
);
// Shared SVG definitions: gold, fades, the soft halo, text glows for cards, two small blurs, the vignette. Ids are fixed;
// put <KathaDefs/> once per <svg> (Frame does). 22 Oct 2026: k-halo falls off like a Gaussian (no visible edge at large
// radii); the large blurs (k-b8 to k-b60) and the unused turbulence grain filter are gone (the grain is a texture).
export const KathaDefs: React.FC<{seed?: number}> = () => (
  <defs>
    <linearGradient id="k-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF0C2"/><stop offset="0.45" stopColor="#F2C46A"/><stop offset="1" stopColor="#B8862F"/></linearGradient>
    <linearGradient id="k-fade-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={K.gold} stopOpacity={0}/><stop offset="0.5" stopColor={K.gold}/><stop offset="1" stopColor={K.gold} stopOpacity={0}/></linearGradient>
    <filter id="k-soft" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="k-bloom" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    {[1.5, 4].map((s) => <filter key={s} id={`k-b${String(s).replace(".", "_")}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={s}/></filter>)}
    <radialGradient id="k-halo">{softStops("#FFE9B0", 0.55, "#FFD38A")}</radialGradient>
    <radialGradient id="k-halo-soft">{softStops("#FFE9B0", 0.42, "#F0A04B", 2.6)}</radialGradient>
    <radialGradient id="k-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0}/><stop offset="1" stopColor="#000" stopOpacity={0.72}/></radialGradient>
  </defs>
);
// The one small blur a scene may use (at most one, on a small element): blur(1.5) or blur(4). Larger values clamp to 4;
// soft light, haze, smoke and glow are gradients (softStops / SoftGlow), never blur filters.
export const blur = (s: number) => `url(#k-b${s <= 2 ? "1_5" : "4"})`;
const hex = (c: string): number[] => { const h = c.replace("#", ""); const v = h.length === 3 ? h.split("").map((x) => x + x).join("") : h; return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16)); };
export const mixHex = (a: string, b: string, t: number): string => { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
// Stops for a radialGradient that falls off like a Gaussian and reaches exactly zero, with a zero slope, at the edge:
// opacity(r) = peak * exp(-k r^2) * (1 - r^2)^2. The colour runs from c0 at the centre to c1 at the rim. k: 1.5 = broad,
// 2.2 = the default glow, 4 = a tight hot core. Every glow in the film uses this one falloff.
export const softStops = (c0: string, peak = 0.6, c1?: string, k = 2.2, n = 9): React.ReactElement[] =>
  Array.from({length: n + 1}, (_, i) => {
    const r = i / n, o = peak * Math.exp(-k * r * r) * Math.pow(1 - r * r, 2);
    return <stop key={i} offset={r.toFixed(3)} stopColor={c1 ? mixHex(c0, c1, Math.pow(r, 0.7)) : c0} stopOpacity={+o.toFixed(4)}/>;
  });
// A soft glow: an ellipse filled with its own softStops gradient (per-instance id). r = the radius where it reaches zero.
export const SoftGlow: React.FC<{x: number; y: number; r: number; ry?: number; c0?: string; c1?: string; o?: number; k?: number; peak?: number}> =
  ({x, y, r, ry, c0 = "#FFE9B0", c1 = "#F0A04B", o = 1, k = 2.2, peak = 0.6}) => {
  const id = "sg" + useId().replace(/[^a-zA-Z0-9]/g, "");
  if (o <= 0.002 || r <= 0) return null;
  return (
    <g>
      <defs><radialGradient id={id}>{softStops(c0, peak, c1, k)}</radialGradient></defs>
      <ellipse cx={x} cy={y} rx={r} ry={ry ?? r} fill={`url(#${id})`} opacity={Math.min(1, o)}/>
    </g>
  );
};
// On-screen words (the one rule, 22 Oct 2026): Devanagari first in Tiro Devanagari Sanskrit, gold; English under it in
// small letter-spaced Cinzel capitals; one fixed style in one place; revealed only on cue; never inside the camera push.
// The rule is implemented once, as Label in stage.tsx (put it in Frame's overlay slot); scenes do not set their own type.
// Film grain (re-seeded every 2 frames so it lives) and a vignette: the last two layers of every frame.
// The grain is a 512 px noise texture (public/katha/grain.png), shifted every two frames: no SVG filter, so long renders
// stay fast and never drop tiles (per-frame turbulence filters made the renderer drop black tiles under load).
export const Finish: React.FC<{f: number; grain?: number; vig?: number}> = ({f, grain = 0.06, vig = 1}) => {
  const k = Math.floor(f / 2), ox = (k * 97) % 256, oy = (k * 151) % 256, id = `k-grain-${k % 5}`;
  return (
    <>
      <defs><pattern id={id} patternUnits="userSpaceOnUse" x={-ox} y={-oy} width={256} height={256}><image href={staticFile("katha/grain.png")} width={256} height={256}/></pattern></defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#k-vig)" opacity={vig}/>
      <rect x={0} y={0} width={W} height={H} fill={`url(#${id})`} opacity={grain} style={{mixBlendMode: "overlay"}}/>
    </>
  );
};

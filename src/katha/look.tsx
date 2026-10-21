// The Katha look (21 Oct 2026): AK asked for the Bhagavad Gita "premium, rich, poetic". Deep indigo, saffron and gold,
// silhouettes rimmed with light, Sanskrit in Tiro Devanagari Sanskrit, English in Cormorant Garamond, titles in Cinzel.
// Fonts are OFL-1.1 from the @fontsource packages, copied into public/fonts/katha with their licences.
import React from "react";
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
// Shared SVG definitions: soft glow, film grain, blurs. Ids are fixed; put <KathaDefs/> once per <svg>.
export const KathaDefs: React.FC<{seed?: number}> = ({seed = 3}) => (
  <defs>
    <linearGradient id="k-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF0C2"/><stop offset="0.45" stopColor="#F2C46A"/><stop offset="1" stopColor="#B8862F"/></linearGradient>
    <linearGradient id="k-fade-h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={K.gold} stopOpacity={0}/><stop offset="0.5" stopColor={K.gold}/><stop offset="1" stopColor={K.gold} stopOpacity={0}/></linearGradient>
    <filter id="k-soft" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="k-bloom" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    {[1.5, 4, 8, 14, 30, 60].map((s) => <filter key={s} id={`k-b${String(s).replace(".", "_")}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={s}/></filter>)}
    <filter id="k-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed}/><feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0"/></filter>
    <radialGradient id="k-halo"><stop offset="0" stopColor="#FFE9B0" stopOpacity={0.55}/><stop offset="0.35" stopColor="#FFD38A" stopOpacity={0.22}/><stop offset="1" stopColor="#FFD38A" stopOpacity={0}/></radialGradient>
    <radialGradient id="k-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity={0}/><stop offset="1" stopColor="#000" stopOpacity={0.72}/></radialGradient>
  </defs>
);
export const blur = (s: number) => `url(#k-b${String(s).replace(".", "_")})`;
// Film grain (re-seeded every 2 frames so it lives) and a vignette: the last two layers of every frame.
export const Finish: React.FC<{f: number; grain?: number; vig?: number}> = ({f, grain = 0.05, vig = 1}) => (
  <>
    <defs><filter id={`k-grain-${f % 7}`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(f / 2) % 97}/><feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0"/></filter></defs>
    <rect x={0} y={0} width={W} height={H} fill="url(#k-vig)" opacity={vig}/>
    <rect x={0} y={0} width={W} height={H} filter={`url(#k-grain-${f % 7})`} opacity={grain}/>
  </>
);

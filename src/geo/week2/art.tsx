// Week 2 thumbnails (1080x1920) and community-post posters (1080x1080), AK 25 Oct 2026.
// Background art: Google Nano Banana (scripts/geo/week2_art.py), with no text, maps or flags. All words and figures are set here,
// taken from the approved captions (scripts/geo/week2.py) so they match the video and its fact table.
import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {PFonts, PC, SERIF, SANS, MONO} from "../engine/premium";


export type ArtText = {l1: string; l2: string; sub: string};
export const ART_TEXT: Record<string, ArtText> = {
  minicoy: {l1: "3× CLOSER", l2: "TO THE MALDIVES", sub: "Minicoy: 398 km from Kerala, ~130 km from the Maldives"},
  austria: {l1: "AUSTRIA IN", l2: "THE NICOBARS", sub: "1778: an Austrian-backed ship reached islands now in India"},
  kuttanad: {l1: "RICE BELOW", l2: "SEA LEVEL", sub: "Kuttanad, Kerala: fields 2 m below the sea"},
  sikhpolice: {l1: "558 SIKH POLICE", l2: "IN SHANGHAI", sub: "1884: 16 constables · 1936: 558 officers"},
  seazone: {l1: "2 MILLION+ km²", l2: "OF INDIA'S SEA", sub: "How tiny islands stretch India's sea zone"},
  nainsingh: {l1: "HE COUNTED", l2: "EVERY STEP", sub: "1866: Nain Singh mapped the road to Lhasa on prayer beads"},
  thumba: {l1: "ROCKETS", l2: "IN A CHURCH", sub: "Thumba, Kerala: where India's space age began, 1963"},
  zanzibar: {l1: "INDIAN DOORS", l2: "IN AFRICA?", sub: "Stone Town, Zanzibar: 500+ carved doors"},
  barmer: {l1: "OIL UNDER", l2: "THE THAR", sub: "2004: India's biggest onshore oil find in decades"},
  berenike: {l1: "INDIAN PEPPER", l2: "IN ROMAN EGYPT", sub: "7.5+ kg of Indian pepper, buried at Berenike"},
  panipat: {l1: "OLD CLOTHES", l2: "→ NEW BLANKETS", sub: "2024: ~160,000 t of used clothes came to India"},
  bhitarkanika: {l1: "10 → 1,800+", l2: "CROCODILES", sub: "Bhitarkanika, Odisha: from 10 seen in 1973"},
  thibaw: {l1: "BURMA'S KING", l2: "EXILED TO INDIA", sub: "Thibaw, Burma's last king, died in Ratnagiri in 1916"},
  narcondam: {l1: "1 ISLAND", l2: "1 BIRD", sub: "The Narcondam hornbill lives nowhere else"},
  // Cyclone Shorts (28 Oct 2026). 21 = deaths from the storm itself in the State's count; the floods after Phailin killed 51 more (stated in the description and pinned comment).
  cy01odisha: {l1: "9,887 → 21", l2: "ODISHA STORM DEATHS", sub: "1999 super cyclone vs Phailin 2013: how Odisha learned to move people out"},
  cy02bay: {l1: "STRONGER? NO.", l2: "DEADLIEST: YES", sub: "Bay of Bengal cyclones: no sign of stronger storms, but the deadliest on record"},
};


// Shorts thumbnail: premium editorial look (matches the video theme): accent rule, serif headline, tracked caps line
export const Thumb: React.FC<{id: string}> = ({id}) => {
  const T = ART_TEXT[id];
  const big = (s: string) => Math.min(176, Math.floor(1700 / Math.max(6, s.length)));
  return (
    <AbsoluteFill style={{background: PC.ink}}>
      <PFonts/>
      <Img src={staticFile(`geo/${id}/art_thumb.png`)} style={{width: "100%", height: "100%", objectFit: "cover"}}/>
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(5,8,15,0.82) 0%, rgba(5,8,15,0.45) 30%, rgba(5,8,15,0) 50%, rgba(5,8,15,0) 82%, rgba(5,8,15,0.5) 100%)"}}/>
      <PillTag top={110}/>
      <div style={{position: "absolute", top: 250, left: 60, right: 60, textAlign: "center"}}>
        <div style={{width: 110, height: 8, background: PC.amber, borderRadius: 4, margin: "0 auto 26px"}}/>
        <div style={{fontFamily: SERIF, fontSize: big(T.l1), lineHeight: 1.0, color: PC.cream, textShadow: "0 8px 40px rgba(0,0,0,0.8)"}}>{T.l1}</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: Math.min(84, Math.floor(1500 / Math.max(8, T.l2.length))), letterSpacing: "0.08em", color: PC.amber,
          marginTop: 18, textShadow: "0 4px 24px rgba(0,0,0,0.85)"}}>{T.l2}</div>
      </div>
      <div style={{position: "absolute", bottom: 28, right: 32, fontFamily: SANS, fontWeight: 500, fontSize: 22, color: "rgba(244,236,221,0.65)"}}>AI illustration</div>
    </AbsoluteFill>
  );
};
const PillTag: React.FC<{top: number; scale?: number}> = ({top, scale = 1}) => <div style={{position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
  <div style={{background: "rgba(11,15,23,0.66)", border: "1.5px solid rgba(244,236,221,0.2)", borderRadius: 999, padding: `${10 * scale}px ${26 * scale}px`, display: "flex", alignItems: "center", gap: 12 * scale}}>
    <div style={{width: 13 * scale, height: 13 * scale, borderRadius: 7, background: PC.amber, boxShadow: `0 0 12px ${PC.amber}`}}/>
    <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 28 * scale, letterSpacing: "0.28em", color: PC.cream}}>INDICA ATLAS</span></div></div>;

// headline case: capitalise words, keep short joining words lower-case ("Rockets in a Church")
const SMALL = new Set(["a", "an", "the", "of", "in", "to", "on", "at", "for", "and", "or", "by", "from"]);
const headline = (x: string) => x.toLowerCase().split(" ").map((w, i) => i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

// Community-post poster: art on top, editorial text block at the bottom
export const Poster: React.FC<{id: string}> = ({id}) => {
  const T = ART_TEXT[id];
  return (
    <AbsoluteFill style={{background: PC.ink}}>
      <PFonts/>
      <Img src={staticFile(`geo/${id}/art_post.png`)} style={{width: "100%", height: "100%", objectFit: "cover"}}/>
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(5,8,15,0.5) 0%, rgba(5,8,15,0) 20%, rgba(5,8,15,0) 44%, rgba(5,8,15,0.9) 70%, rgba(5,8,15,0.97) 100%)"}}/>
      <PillTag top={36} scale={0.85}/>
      <div style={{position: "absolute", left: 64, right: 64, bottom: 64}}>
        <div style={{width: 80, height: 6, background: PC.amber, borderRadius: 3, marginBottom: 18}}/>
        <div style={{fontFamily: SERIF, fontSize: Math.min(92, Math.floor(1900 / Math.max(10, (T.l1 + " " + T.l2).length))), lineHeight: 1.04, color: PC.cream}}>
          {T.l1} <span style={{color: PC.amber}}>{headline(T.l2)}</span></div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 32, color: "rgba(244,236,221,0.9)", marginTop: 16, lineHeight: 1.3}}>{T.sub}</div>
        <div style={{display: "flex", alignItems: "center", gap: 14, marginTop: 24}}>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: "0.2em", color: PC.ink, background: PC.amber, borderRadius: 999, padding: "8px 22px"}}>NEW SHORT</span>
          <span style={{fontFamily: MONO, fontWeight: 600, fontSize: 24, color: "rgba(244,236,221,0.75)"}}>WHY? · 30 s</span>
          <span style={{flex: 1}}/>
          <span style={{fontFamily: SANS, fontWeight: 500, fontSize: 18, color: "rgba(244,236,221,0.55)"}}>AI illustration</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// India Charted brand kit (Data YT): logo mark, wordmark, YouTube profile + banner, title chips, end card.
// Same palette as the Shorts (IndiaShort.tsx P). No map in the logo: India's outline is legally sensitive, a mark is not.
import React from "react";
import {AbsoluteFill, Still} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import {P} from "./IndiaShort";

const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
export const BRAND = {name: "India Charted", handle: "@IndiaCharted", tagline: "India, in charts. Every number from an official source."};

// Mark: three rising bars, the tallest in gold with a data dot above it.
export const Mark: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x="14" y="54" width="18" height="32" rx="4" fill={P.cyan} opacity={0.55}/>
    <rect x="41" y="38" width="18" height="48" rx="4" fill={P.cyan}/>
    <rect x="68" y="20" width="18" height="66" rx="4" fill={P.gold}/>
    <circle cx="77" cy="9" r="6" fill={P.gold}/>
  </svg>
);

const Wordmark: React.FC<{size: number}> = ({size}) => (
  <div style={{fontFamily: COND, fontWeight: 700, fontSize: size, letterSpacing: size * 0.02, color: P.ink, lineHeight: 1}}>
    INDIA <span style={{color: P.gold}}>CHARTED</span>
  </div>
);

const Ground: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${P.bg2} 0%, ${P.bg} 72%)`}}>
    <VoxFonts/>{children}
  </AbsoluteFill>
);

export const Profile: React.FC = () => (
  <Ground>
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}><Mark size={620}/></AbsoluteFill>
  </Ground>
);

export const Logo: React.FC = () => (
  <Ground>
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 60}}>
      <Mark size={300}/>
      <div><Wordmark size={170}/>
        <div style={{fontFamily: SANS, fontSize: 46, color: P.mute, marginTop: 24}}>{BRAND.tagline}</div></div>
    </AbsoluteFill>
  </Ground>
);

// YouTube banner 2560x1440; everything important inside the 1546x423 centre safe area.
export const YTBannerIC: React.FC = () => (
  <Ground>
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
      <div style={{width: 1546, height: 423, display: "flex", alignItems: "center", gap: 48}}>
        <Mark size={260}/>
        <div>
          <Wordmark size={150}/>
          <div style={{fontFamily: SANS, fontSize: 40, color: P.ink, marginTop: 18}}>India, in charts. A new map every day.</div>
          <div style={{fontFamily: SANS, fontSize: 30, color: P.mute, marginTop: 10}}>Every number from an official source · NFHS · RBI · MoSPI · NPCI</div>
        </div>
      </div>
    </AbsoluteFill>
  </Ground>
);

const CHIPS = ["GUESS THE STATE", "MAPPED", "RANKED", "STATE vs STATE", "THEN vs NOW", "SOUTH INDIA LEAGUE", "TAMIL NADU SPECIAL", "INDIA IN MONEY"];
export const ChipSheet: React.FC = () => (
  <Ground>
    <div style={{position: "absolute", left: 80, top: 80, display: "flex", flexDirection: "column", gap: 34}}>
      <div style={{fontFamily: SANS, fontSize: 30, color: P.mute}}>Series title chips</div>
      {CHIPS.map((c) => <div key={c} style={{display: "flex", alignItems: "center", gap: 18}}>
        <div style={{background: c === "INDIA IN MONEY" ? P.gold : P.cyan, color: P.bg, fontFamily: SANS, fontWeight: 800, fontSize: 40,
          letterSpacing: 4, padding: "12px 24px", borderRadius: 10}}>{c}</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: P.mute}}>NFHS-6 · 2023-24</div>
      </div>)}
    </div>
  </Ground>
);

export const EndCard: React.FC = () => (
  <Ground>
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40, padding: 80}}>
      <Mark size={260}/>
      <Wordmark size={110}/>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 88, color: P.ink, textAlign: "center", lineHeight: 1.05}}>
        Where does <span style={{color: P.gold}}>your</span> state rank?</div>
      <div style={{fontFamily: SANS, fontSize: 44, color: P.cyan}}>Comment below · Follow for more</div>
    </AbsoluteFill>
  </Ground>
);

export const BrandStills: React.FC = () => <>
  <Still id="IC-profile" component={Profile} width={800} height={800}/>
  <Still id="IC-logo" component={Logo} width={2400} height={800}/>
  <Still id="IC-banner" component={YTBannerIC} width={2560} height={1440}/>
  <Still id="IC-chips" component={ChipSheet} width={1080} height={1080}/>
  <Still id="IC-endcard" component={EndCard} width={1080} height={1920}/>
</>;

// Data Kadai brand kit (Data YT): logo mark, wordmark, YouTube profile + banner, title chips, end card.
// Same palette as the Shorts (IndiaShort.tsx P). No map in the logo: India's outline is legally sensitive, a mark is not.
import React from "react";
import {AbsoluteFill, Still} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import {P} from "./IndiaShort";

const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
export const BRAND = {name: "Data Kadai", handle: "@DataKadai", tagline: "India's numbers, served fresh. From official sources."};

// Mark: a tea-kadai glass (cutting-chai tumbler) holding three rising bars, steam rising from the tallest.
export const Mark: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M18 34 L82 34 L75 92 Q74 96 70 96 L30 96 Q26 96 25 92 Z" fill="none" stroke={P.cyan} strokeWidth="4.5" strokeLinejoin="round"/>
    <line x1="21" y1="46" x2="79" y2="46" stroke={P.cyan} strokeWidth="2.5" opacity={0.5}/>
    <rect x="31" y="70" width="10" height="18" rx="2.5" fill={P.cyan} opacity={0.6}/>
    <rect x="45" y="60" width="10" height="28" rx="2.5" fill={P.cyan}/>
    <rect x="59" y="50" width="10" height="38" rx="2.5" fill={P.gold}/>
    <path d="M58 26 Q53 19 58 13 Q63 7 58 2" fill="none" stroke={P.gold} strokeWidth="4" strokeLinecap="round"/>
    <path d="M70 26 Q66 20 70 15" fill="none" stroke={P.gold} strokeWidth="3.5" strokeLinecap="round" opacity={0.7}/>
  </svg>
);

const Wordmark: React.FC<{size: number}> = ({size}) => (
  <div style={{fontFamily: COND, fontWeight: 700, fontSize: size, letterSpacing: size * 0.02, color: P.ink, lineHeight: 1}}>
    DATA <span style={{color: P.gold}}>KADAI</span>
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
          <div style={{fontFamily: SANS, fontSize: 40, color: P.ink, marginTop: 18}}>India's numbers, served fresh. A new chart every day.</div>
          <div style={{fontFamily: SANS, fontSize: 30, color: P.mute, marginTop: 10}}>States · Economy · Markets · India vs World · official sources only</div>
        </div>
      </div>
    </AbsoluteFill>
  </Ground>
);

const CHIPS = ["STATEWISE", "GUESS THE STATE", "MAPPED", "RANKED", "STATE vs STATE", "THEN vs NOW", "INDIA vs WORLD", "MARKETS", "TAMIL NADU SPECIAL"];
export const ChipSheet: React.FC = () => (
  <Ground>
    <div style={{position: "absolute", left: 80, top: 80, display: "flex", flexDirection: "column", gap: 24}}>
      <div style={{fontFamily: SANS, fontSize: 30, color: P.mute}}>Series title chips</div>
      {CHIPS.map((c) => <div key={c} style={{display: "flex", alignItems: "center", gap: 18}}>
        <div style={{background: c === "MARKETS" ? P.gold : P.cyan, color: P.bg, fontFamily: SANS, fontWeight: 800, fontSize: 40,
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
  <Still id="DK-profile" component={Profile} width={800} height={800}/>
  <Still id="DK-logo" component={Logo} width={2400} height={800}/>
  <Still id="DK-banner" component={YTBannerIC} width={2560} height={1440}/>
  <Still id="DK-chips" component={ChipSheet} width={1080} height={1080}/>
  <Still id="DK-endcard" component={EndCard} width={1080} height={1920}/>
</>;

// Data Kadai covers: a 1080x1920 cover for a Short (Instagram Reel cover now; YouTube Shorts thumbnail once the channel can upload one).
// AK, 25 Oct 2026: "Prepare Thumpnail ... using Google Nano Banana". The art is made by an image model and carries no text,
// numbers, maps, flags or logos; every word and figure is drawn here, so it stays exact and checked.
//   DK-cover  1080x1920  {art: path under public/, kicker, headline ("*accent*" marks the highlighted words), accent}
// scripts/datayt/covers.py makes the art and renders these through scripts/datayt/render_posts.mjs.
import React from "react";
import {AbsoluteFill, Img, Still, staticFile} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import {P} from "./IndiaShort";
import {BRAND, Mark} from "./Brand";

const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
type Props = {art: string; kicker: string; headline: string; accent: string};

const Rich: React.FC<{text: string; acc: string}> = ({text, acc}) => <>{text.split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;

// the largest size at which the headline wraps into at most four lines across the text column
const size = (text: string) => [132, 120, 108, 96, 86].find((s) => {
  const per = 900 / (s * 0.44);
  let n = 1, cur = 0;
  for (const w of text.replace(/\*/g, "").split(" ")) {
    if (cur && cur + 1 + w.length > per) { n++; cur = w.length; } else cur += (cur ? 1 : 0) + w.length;
  }
  return n <= 4;
}) ?? 80;

const Cover: React.FC<Props> = ({art, kicker, headline, accent}) => (
  <AbsoluteFill style={{background: P.bg}}>
    <VoxFonts/>
    <Img src={staticFile(art)} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover"}}/>
    {/* cream wash over the top half so the headline reads on any art */}
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${P.bg} 0%, ${P.bg} 34%, ${P.bg}E6 44%, ${P.bg}00 62%)`}}/>
    <div style={{position: "absolute", left: 90, right: 90, top: 150}}>
      <div style={{display: "inline-block", background: accent, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 30,
        letterSpacing: 3, padding: "8px 18px", borderRadius: 8}}>{kicker}</div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: size(headline), lineHeight: 1.02, color: P.ink, marginTop: 34}}>
        <Rich text={headline} acc={accent}/>
      </div>
    </div>
    <div style={{position: "absolute", right: 90, bottom: 380, display: "flex", alignItems: "center", gap: 14,
      background: `${P.bg}F2`, padding: "12px 20px", borderRadius: 12}}>
      <Mark size={52}/>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 40, color: P.ink, whiteSpace: "nowrap"}}>
        {BRAND.name.toUpperCase().split(" ")[0]} <span style={{color: P.gold}}>{BRAND.name.toUpperCase().split(" ")[1]}</span>
      </div>
    </div>
  </AbsoluteFill>
);

export const CoverStills: React.FC = () => <>
  <Still {...({id: "DK-cover", component: Cover, width: 1080, height: 1920,
    defaultProps: {art: "datayt/covers/gd01.png", kicker: "GOLD", headline: "Indian homes hold *3×* the US government's gold", accent: P.gold}} as any)}/>
</>;

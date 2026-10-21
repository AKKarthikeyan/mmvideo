// Compositions for the Katha (story-film) look. KATHA-dev renders one scene from props, for stills and checks:
//   npx remotion still <bundle> KATHA-dev out.png --props='{"scene":{"type":"chariot","pose":"teach"},"sec":8}' --frame=120
import React from "react";
import {AbsoluteFill, Composition, Still} from "remotion";
import {KathaFonts, K, FPS, SA, EN, CAPS} from "./look";
import {KATHA_SCENES} from "./scenes";
import {KathaFilm, KData, filmLayout} from "./Film";
import {FILMS} from "./films";

export const KathaDev: React.FC<{scene: any; sec: number}> = ({scene, sec}) => {
  const S = KATHA_SCENES[scene.type];
  const n = Math.ceil(sec * FPS);
  return <AbsoluteFill style={{background: K.night}}><KathaFonts/>{S ? <S s={scene} n={n}/> : <div style={{color: "#fff", font: "60px serif", padding: 80}}>no scene {String(scene.type)}</div>}</AbsoluteFill>;
};
// Thumbnail (1280 x 720): a scene behind, the title in gold Cinzel, the Sanskrit name, a line in Cormorant italic.
export const KathaThumb: React.FC<{scene: any; title: string; sanskrit?: string; line?: string; align?: "left" | "right"}> = ({scene, title, sanskrit, line, align = "left"}) => {
  const S = KATHA_SCENES[scene.type];
  const side: React.CSSProperties = align === "left" ? {left: 56, textAlign: "left"} : {right: 56, textAlign: "right"};
  return (
    <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
      <KathaFonts/>
      <div style={{position: "absolute", width: 1920, height: 1080, transform: "scale(0.6667)", transformOrigin: "0 0"}}>{S ? <S s={scene} n={300}/> : null}</div>
      <div style={{position: "absolute", inset: 0, background: `linear-gradient(${align === "left" ? 90 : 270}deg, rgba(7,5,15,.78) 0%, rgba(7,5,15,.35) 42%, rgba(7,5,15,0) 60%)`}}/>
      <div style={{position: "absolute", top: 70, width: 620, ...side}}>
        {sanskrit ? <div style={{fontFamily: SA, fontSize: 54, color: K.gold, textShadow: "0 0 18px rgba(232,182,90,.5)", marginBottom: 6}}>{sanskrit}</div> : null}
        <div style={{fontFamily: CAPS, fontWeight: 600, fontSize: 92, lineHeight: 0.98, letterSpacing: 2, color: "#FFE3A3", textShadow: "0 0 24px rgba(255,200,110,.45), 0 4px 10px rgba(0,0,0,.8)"}}>{title}</div>
        {line ? <div style={{fontFamily: EN, fontStyle: "italic", fontWeight: 500, fontSize: 46, color: K.cream, marginTop: 18, textShadow: "0 2px 8px rgba(0,0,0,.9)"}}>{line}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
export const KathaCompositions: React.FC = () => (
  <>
    <Still id="KATHA-thumb" component={KathaThumb as any} defaultProps={{scene: {type: "chariot", pose: "teach", mood: "dusk", hub: [980, 812], sun: [1240, 600]}, title: "THE BHAGAVAD GITA", sanskrit: "श्रीमद्भगवद्गीता", line: "as Krishna told it to Arjuna", align: "left"}} width={1280} height={720}/>
    {FILMS.map((D: KData) => <React.Fragment key={D.id}><Composition id={`KT-${D.id}`} component={KathaFilm as any} defaultProps={{D}} durationInFrames={filmLayout(D).total} fps={FPS} width={1920} height={1080}/></React.Fragment>)}
    <Composition id="KATHA-dev" component={KathaDev as any} defaultProps={{scene: {type: "chariot", pose: "teach"}, sec: 8}} durationInFrames={900} fps={FPS} width={1920} height={1080}/>
  </>
);

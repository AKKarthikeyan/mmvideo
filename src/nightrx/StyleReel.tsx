// The Night Pharmacist: animation-style sampler (AK, 24 Oct: the ink motion comic was not satisfying).
// The same moment in four looks, back to back: a title card, Raghavan offering the coffee, Meena's reply.
// Same voices as the style test (vo/r1, vo/m1). Data: public/nightrx/styles/data.json (scripts/nightrx/styles.py data).
import React from "react";
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {useOswald} from "./StyleTest";

export const FPS = 30, W = 1920, H = 1080;
type RShot = {clip: string; line: string; start: number; dur: number; lineAt: number; lineDur: number};
type Seg = {style: string; label: string; start: number; end: number; shots: RShot[]};
export type ReelData = {total: number; label: number; segs: Seg[]; texts: Record<string, string>};

const CREAM = "#f4ecd8", NEON = "#5dffb0", BAR = 70;
const COND = "'Oswald', 'Arial Narrow', sans-serif", SANS = "Inter, Helvetica, sans-serif";
const ip = (f: number, a: number, b: number, x = 0, y = 1) => interpolate(f, [a, b], [x, y], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
const CLIP_SECS = 5.8;                             // Hailuo 6 s clips run 5.875 s; slow a clip only if its shot is longer

const Label: React.FC<{text: string; dur: number}> = ({text, dur}) => {
  const f = useCurrentFrame();
  const [letter, name] = text.split(" · ");
  return (
    <AbsoluteFill style={{background: "#05090b", alignItems: "center", justifyContent: "center", opacity: ip(f, dur - 8, dur, 1, 0)}}>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 200, color: NEON, opacity: ip(f, 0, 8), textShadow: `0 0 40px ${NEON}88`}}>{letter}</div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: 72, letterSpacing: 10, color: CREAM, opacity: ip(f, 4, 14)}}>{name}</div>
    </AbsoluteFill>
  );
};

const Shot: React.FC<{s: RShot; text: string; tag: string}> = ({s, text, tag}) => {
  const f = useCurrentFrame();
  const d = Math.round(s.dur * FPS), la = Math.round((s.lineAt - s.start) * FPS), ld = Math.round(s.lineDur * FPS);
  return (
    <AbsoluteFill style={{opacity: ip(f, 0, 8) * ip(f, d - 6, d, 1, 0)}}>
      <OffthreadVideo src={staticFile(`nightrx/styles/clip/${s.clip}`)} muted playbackRate={Math.min(1, CLIP_SECS / s.dur)}
        style={{width: W, height: H, objectFit: "cover"}}/>
      <div style={{position: "absolute", left: 140, right: 140, bottom: BAR + 34, textAlign: "center", fontFamily: SANS, fontSize: 44,
        color: "#fffaf0", textShadow: "0 2px 4px #000, 0 0 18px rgba(0,0,0,.85)", opacity: ip(f, la, la + 4) * ip(f, la + ld, la + ld + 4, 1, 0)}}>{text}</div>
      <div style={{position: "absolute", right: 60, top: BAR + 24, fontFamily: COND, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: CREAM,
        opacity: 0.8, textShadow: "0 2px 8px #000"}}>{tag}</div>
    </AbsoluteFill>
  );
};

export const StyleReel: React.FC<{D: ReelData}> = ({D}) => {
  useOswald();
  const fr = (s: number) => Math.round(s * FPS);
  const total = fr(D.total);
  return (
    <AbsoluteFill style={{background: "#05090b"}}>
      {D.segs.map((g) => (
        <React.Fragment key={g.style}>
          <Sequence from={fr(g.start)} durationInFrames={fr(D.label)}><Label text={g.label} dur={fr(D.label)}/></Sequence>
          {g.shots.map((s) => (
            <Sequence key={s.clip} from={fr(s.start)} durationInFrames={fr(s.dur)}>
              <Shot s={s} text={D.texts[s.line]} tag={g.label}/>
            </Sequence>
          ))}
          {g.shots.map((s) => <Sequence key={`v${s.clip}`} from={fr(s.lineAt)}><Audio src={staticFile(`nightrx/styletest/vo/${s.line}.wav`)}/></Sequence>)}
        </React.Fragment>
      ))}
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: BAR, background: "#000"}}/>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: BAR, background: "#000"}}/>
      <Audio src={staticFile("nightrx/styletest/sfx/room.wav")} loop volume={(x) => 0.3 * ip(x, 0, 20) * ip(x, total - 30, total, 1, 0)}/>
    </AbsoluteFill>
  );
};

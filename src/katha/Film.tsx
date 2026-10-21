// The Katha film engine (21 Oct 2026): a long-form story film in the Katha look. Beats dissolve into each other, the
// narration is captioned in Cormorant (Krishna's and Arjuna's quoted lines in gold, with the speaker named), a row of
// eighteen lamps lights up chapter by chapter, the tanpura bed runs underneath with a bell at each chapter.
// Data: public/katha/<id>/data.json, built by scripts/katha/build_film.py from the script (scripts/katha/<id>.json).
import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {K, W, H, FPS, EN, CAPS, SA, KathaFonts} from "./look";
import {KATHA_SCENES} from "./scenes";

export type KBeat = {key: string; chapter: number; movement: string; speaker: string; say: string; cap?: string; sec: number; audio?: string; scene: any; music?: string};
export type KData = {id: string; title: string; beats: KBeat[]; music?: string; bell?: string; captions?: boolean};
export const XF = 14;   // dissolve between beats, in frames
export const beatLen = (b: KBeat) => Math.ceil((b.sec + (b.scene?.type === "title" ? 1.0 : 0.6)) * FPS);
export const filmLayout = (D: KData) => {
  const frames = D.beats.map(beatLen), starts: number[] = [];
  frames.forEach((n, i) => starts.push(i ? starts[i - 1] + frames[i - 1] : 0));
  return {frames, starts, total: frames.reduce((a, b) => a + b, 0) + XF};
};
// Split a line into caption cues of at most ~70 characters, at sentence and clause breaks.
export const cues = (text: string): string[] => {
  const parts = String(text).replace(/\s+/g, " ").trim().split(/(?<=[.!?;:])\s+|(?<=,)\s+(?=\S{4,})/).filter(Boolean), out: string[] = [];
  let cur = "";
  for (const p of parts) { if ((cur + " " + p).trim().length > 72 && cur) { out.push(cur.trim()); cur = p; } else cur = (cur + " " + p).trim(); }
  if (cur) out.push(cur.trim());
  return out;
};
const Caption: React.FC<{b: KBeat; n: number}> = ({b, n}) => {
  const f = useCurrentFrame();
  if (b.scene?.type === "verse" || b.scene?.type === "title" || b.scene?.captions === false) return null;
  const cs = cues(b.cap || b.say), tot = cs.reduce((a, c) => a + c.length, 0), span = n - XF - 10;
  let acc = 0, idx = 0;
  for (let i = 0; i < cs.length; i++) { const s0 = XF + (acc / tot) * span; if (f >= s0) idx = i; acc += cs[i].length; }
  const quote = b.speaker === "KRISHNA" || b.speaker === "ARJUNA" || b.speaker === "DHRITARASHTRA";
  const a = interpolate(f, [XF - 4, XF + 8], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) * interpolate(f, [n - 8, n], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: 64, display: "flex", flexDirection: "column", alignItems: "center", opacity: a}}>
      {quote ? <div style={{fontFamily: CAPS, fontSize: 18, letterSpacing: 6, color: K.gold, marginBottom: 10, textShadow: "0 0 12px rgba(0,0,0,.9)"}}>{b.speaker}</div> : null}
      <div style={{fontFamily: EN, fontStyle: quote ? "italic" : "normal", fontWeight: 500, fontSize: 44, lineHeight: 1.2, color: quote ? "#F6D99A" : K.cream, maxWidth: 1500, textAlign: "center",
        textShadow: "0 0 18px rgba(0,0,0,.95), 0 2px 4px rgba(0,0,0,.9)"}}>{cs[idx]}</div>
    </div>
  );
};
// Eighteen small lamps across the top: unlit, lit for chapters done, the current one flickering.
const Lamps: React.FC<{chapter: number; f: number}> = ({chapter, f}) => {
  if (!chapter || chapter > 18) return null;
  return (
    <svg width={W} height={70} style={{position: "absolute", top: 26, left: 0}}>
      {Array.from({length: 18}, (_, i) => {
        const x = W / 2 + (i - 8.5) * 34, lit = i + 1 < chapter ? 1 : i + 1 === chapter ? 0.8 + 0.2 * Math.sin(f / 3 + i) : 0;
        return <g key={i} transform={`translate(${x} 34)`} opacity={lit ? 0.95 : 0.35}>
          {lit ? <circle cx={0} cy={-6} r={9} fill="#FFD38A" opacity={0.25 * lit}/> : null}
          {lit ? <path d={`M 0 -14 Q 4 -8 2 -4 Q 0 -2 -2 -4 Q -4 -8 0 -14 Z`} fill="#FFD38A" transform={`scale(${0.8 + 0.25 * lit})`}/> : null}
          <path d="M -7 -2 Q -5 5 0 5 Q 5 5 7 -2 Z" fill={lit ? K.gold : "#7A6A55"}/>
        </g>;
      })}
    </svg>
  );
};
const Chapter: React.FC<{b: KBeat; f: number}> = ({b, f}) => {
  if (!b.movement || b.scene?.type === "title") return null;
  return <div style={{position: "absolute", top: 92, left: 0, right: 0, textAlign: "center", fontFamily: CAPS, fontSize: 16, letterSpacing: 7, color: "rgba(232,182,90,.55)"}}>{b.movement.toUpperCase()}</div>;
};
export const KathaFilm: React.FC<{D: KData}> = ({D}) => {
  const f = useCurrentFrame();
  const {frames, starts, total} = filmLayout(D);
  const cur = starts.reduce((a, s, i) => (f >= s ? i : a), 0), b = D.beats[cur];
  return (
    <AbsoluteFill style={{background: K.night}}>
      <KathaFonts/>
      {D.beats.map((bt, i) => {
        const S = KATHA_SCENES[bt.scene?.type] || KATHA_SCENES.field, n = frames[i] + XF;
        return (
          <Sequence key={bt.key} from={starts[i]} durationInFrames={n} name={`${bt.key} ${bt.scene?.type}`}>
            <Fade first={i === 0}><S s={bt.scene} n={n}/><Caption b={bt} n={n}/></Fade>
            {bt.audio ? <Sequence from={XF}><Audio src={staticFile(bt.audio)}/></Sequence> : null}
            {bt.scene?.type === "title" && D.bell !== "" ? <Audio src={staticFile(D.bell || "dharma/bell.wav")} volume={0.45}/> : null}
          </Sequence>
        );
      })}
      <Lamps chapter={b?.chapter || 0} f={f}/>
      <Chapter b={b} f={f}/>
      {D.music !== "" ? <Audio src={staticFile(D.music || "dharma/tanpura.wav")} loop volume={(fr) => interpolate(fr, [0, 60, total - 90, total], [0, 0.3, 0.3, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}/> : null}
    </AbsoluteFill>
  );
};
const Fade: React.FC<{first: boolean; children: React.ReactNode}> = ({first, children}) => {
  const f = useCurrentFrame();
  const a = first ? interpolate(f, [0, 20], [0, 1], {extrapolateRight: "clamp"}) : interpolate(f, [0, XF], [0, 1], {extrapolateRight: "clamp"});
  return <AbsoluteFill style={{opacity: a}}>{children}</AbsoluteFill>;
};

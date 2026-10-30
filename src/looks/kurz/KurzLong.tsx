// The KURZ look's long-form player: the same Timeline as LongCartoon.tsx (scripts/datayt/long_timeline.py), drawn with KURZ_SCENES.
// Between acts a soft iris of light closes and opens over the cut; inside an act scenes cut hard. Draft mode adds the narration as captions.
// Smooth output: the timeline is in 30 fps "logical" frames; at fps = 60 every composition frame is half a logical frame, so scenes see a
// fractional f and all motion (interpolate, spring) is sampled twice as often. Reveal frames and durations stay in logical frames.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {getBrand, lookBrand} from "../brands";
import {LookFonts} from "../shared/LookFonts";
import {SAFE, W, type SceneProps, type Timeline, type TimelineScene} from "../cartoon/long/contract";
import {K, SANS} from "./kit";
import {KURZ_SCENES} from "./registry";

const strict = (id: string, reveals: Record<string, number>) => (key: string) => {
  if (!(key in reveals)) throw new Error(`scene ${id}: no reveal frame for key "${key}"`);
  return reveals[key];
};
const Host: React.FC<{s: TimelineScene; draft: boolean; at: SceneProps["at"]; k: number}> = ({s, draft, at, k}) => {
  const f = useCurrentFrame() / k, Comp = KURZ_SCENES[s.kind];
  if (!Comp) throw new Error(`kurz look: no scene for kind "${s.kind}" in scene ${s.id}`);
  return <Comp f={f} dur={s.dur} spec={s.spec} at={at} draft={draft}/>;
};
// 24-frame iris centred on the cut: a dark disc grows to cover the frame, then shrinks away on the far side.
const Iris: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = (f - (at - 12)) / 24;
  if (t <= 0 || t >= 1) return null;
  const r = (t < 0.5 ? t * 2 : (1 - t) * 2) * 1200;
  return <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
    <circle cx={960} cy={540} r={r + 40} fill={K.teal} opacity={0.5}/><circle cx={960} cy={540} r={r} fill={K.night}/>
  </svg>;
};

export const KurzLong: React.FC<{timeline: Timeline; draft?: boolean; brand?: string; audio?: string[]; fps?: number}> = ({timeline, draft = true, brand, audio = [], fps = 30}) => {
  const k = fps / 30, f = useCurrentFrame() / k;          // f: logical (30 fps) frame, fractional at 60 fps
  const br = getBrand(brand), B = React.useMemo(() => lookBrand(br, "counter"), [br]);
  const cur = timeline.scenes.find((s) => f >= s.from && f < s.from + s.dur) ?? timeline.scenes[timeline.scenes.length - 1];
  const cuts = timeline.scenes.filter((s, i) => i > 0 && s.transition === "wipe").map((s) => s.from);
  return <LookFonts faces={[br.faces.bricolage, br.faces.schibsted, br.faces.oswald]}>
    <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
      {timeline.scenes.map((s) => <Sequence key={s.id} from={Math.round(s.from * k)} durationInFrames={Math.round(s.dur * k)}><Host s={s} draft={draft} at={strict(s.id, s.reveals)} k={k}/></Sequence>)}
      {cuts.map((at) => <Iris key={at} f={f} at={at}/>)}
      <div style={{position: "absolute", right: W - SAFE.x1, top: SAFE.y0 - 20, display: "flex", alignItems: "center", gap: 14, opacity: 0.9}}><B.Mark size={54} on="dark"/><B.Wordmark size={32} on="dark"/></div>
      {draft && <div style={{position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: 930, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 40, lineHeight: 1.25,
        color: K.white, textShadow: "0 2px 12px rgba(0,0,0,0.9)", padding: "0 60px"}}>{cur.vo}</div>}
      {audio.map((a) => <Audio key={a} src={staticFile(a)}/>)}
    </AbsoluteFill>
  </LookFonts>;
};

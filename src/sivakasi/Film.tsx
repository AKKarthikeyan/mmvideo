import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {C, W, H, Fonts, Finish, Key, IllusTag, prog, easeIO, easeOut, lerp} from "./kit";
import {SCENES} from "./registry";
import paradox from "./data/paradox.json";
import longroad from "./data/longroad.json";

export const FILMS: Record<string, any> = {paradox, longroad};
const OV = 24;   // frames of overlap: the next act fades in over the previous one, which keeps playing (no dip to black)

const ActView: React.FC<{act: any; idx: number}> = ({act, idx}) => {
  const f = useCurrentFrame(), S = SCENES[act.scene];
  if (!S) return <AbsoluteFill style={{background: "#400"}} />;
  const fadeIn = idx === 0 ? 1 : prog(f, 0, OV, easeIO);
  // camera on the art layer only: arrives with a settling push, then a slow drift (alternating push-in / pull-out)
  const arrive = idx === 0 ? 0 : 1 - prog(f, 0, 80, easeOut), dir = idx % 2 ? 1 : -1, drift = (f / Math.max(1, act.dur)) * 0.03 * dir;
  const scale = 1 + arrive * 0.05 + drift + (dir < 0 ? 0.03 : 0), spans = act.spans;
  return <AbsoluteFill style={{opacity: fadeIn}}>
    <AbsoluteFill style={{transform: `scale(${scale.toFixed(5)})`, transformOrigin: "50% 52%"}}><S f={f} dur={act.dur} spans={spans} p={act.p} /></AbsoluteFill>
    {act.text.map((ev: any, i: number) => {
      const s = spans[Math.min(ev.at, spans.length - 1)], e = spans[Math.min(ev.until ?? ev.at, spans.length - 1)];
      return <Key key={i} text={ev.text} sub={ev.sub ?? undefined} mono={ev.mono} f={f} at={s.s + (ev.delay ?? 12)} out={e.e - 4} size={ev.size ?? 78}
        {...(ev.center ? {align: "center" as const, x: 960, y: ev.y ?? 200} : {x: ev.x ?? 120, y: ev.y ?? 800})} />;
    })}
    {act.tag && <IllusTag f={f} />}
  </AbsoluteFill>;
};

export const Film: React.FC<{film: string; audio?: boolean}> = ({film, audio = true}) => {
  const d = FILMS[film], frame = useCurrentFrame();
  return <AbsoluteFill style={{background: C.ink}}><Fonts />
    {d.acts.map((a: any, i: number) => <Sequence key={a.id} from={a.from} durationInFrames={a.dur + (i === d.acts.length - 1 ? 0 : OV)}><ActView act={a} idx={i} /></Sequence>)}
    <Finish f={frame} vign={0.5} />
    {audio && <Audio src={staticFile(`sivakasi/${film}/final.wav`)} />}
  </AbsoluteFill>;
};

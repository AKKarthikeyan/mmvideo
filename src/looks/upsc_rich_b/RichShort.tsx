// Vertical Short (1080x1920) cut from a look-B long film (scripts/upsc/make_short.py). Each scene plays from `skip` logical frames in,
// with its full-length `dur` so its motion keeps the film's pace; the 16:9 picture sits in a band at 0.6 scale (its SAFE box stays inside).
// Hook title on screen from frame 0, captions from the film's measured word times, a text-only end card pointing to the full film.
import React from "react";
import {AbsoluteFill, Freeze, Sequence, useCurrentFrame} from "remotion";
import {RICH_SCENES} from "./registry";
import {Fonts, SANS, SERIF, clamp, eo} from "./kit";

type ShortScene = {id: string; kind: string; spec: any; reveals: Record<string, number>; from: number; dur: number; skip: number; full: number};
type Word = {w: string; start: number; end: number};
export type ShortProps = {timeline: {id: string; fps: number; total: number; scenes: ShortScene[]}; words: Word[]; kicker: string; title: string; end: string; dur: number};

const SC = 0.6, BAND_X = (1080 - 1920 * SC) / 2, BAND_Y = 600, BAND_H = 1080 * SC;
const GOLD = "#E8B86A", CREAM = "#FFF8EA";

const strict = (id: string, reveals: Record<string, number>) => (key: string) => {
  if (!(key in reveals)) throw new Error(`scene ${id}: no reveal frame for key "${key}"`);
  return reveals[key];
};
const Host: React.FC<{s: ShortScene; k: number}> = ({s, k}) => {
  const f = useCurrentFrame() / k + s.skip, Comp = RICH_SCENES[s.kind];
  if (!Comp) throw new Error(`short: no scene for kind "${s.kind}" in scene ${s.id}`);
  return <Comp f={f} dur={s.full} spec={s.spec} at={strict(s.id, s.reveals)} draft={false}/>;
};
const Picture: React.FC<{scenes: ShortScene[]; k: number}> = ({scenes, k}) => <AbsoluteFill style={{background: "#EFE6D2", overflow: "hidden"}}>
  {scenes.map((s) => <Sequence key={s.id + s.from} from={Math.round(s.from * k)} durationInFrames={Math.round(s.dur * k)}><Host s={s} k={k}/></Sequence>)}
</AbsoluteFill>;

// captions: phrases of up to 4 words, broken after punctuation; the spoken word lights up
const phrases = (words: Word[]) => {
  const out: Word[][] = []; let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= 4 || /[.,?!;:]$/.test(w.w)) { out.push(cur); cur = []; }
  }
  if (cur.length) out.push(cur);
  return out;
};

export const RichShort: React.FC<ShortProps & {fps?: number}> = ({timeline, words, kicker, title, end, dur, fps = 60}) => {
  const k = fps / 30, f = useCurrentFrame() / k, t = f / 30, total = timeline.total;
  const ph = React.useMemo(() => phrases(words), [words]);
  const live = ph.find((p, i) => t >= p[0].start - 0.05 && t < (ph[i + 1]?.[0].start ?? p[p.length - 1].end + 0.6) - 0.05);
  const onEnd = f >= total, e = eo(clamp((f - total) / 18));
  return <Fonts>
    <AbsoluteFill style={{background: "linear-gradient(180deg, #14203A 0%, #1C2C4A 55%, #14203A 100%)"}}>
      <div style={{position: "absolute", top: 250, left: 70, width: 940, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 28,
        letterSpacing: 5, color: GOLD, textTransform: "uppercase"}}>{kicker}</div>
      <div style={{position: "absolute", top: 305, left: 70, width: 940, height: 270, display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", fontFamily: SERIF, fontWeight: 600, fontSize: 74, lineHeight: 1.1, color: CREAM}}>{title}</div>
      <div style={{position: "absolute", left: 0, top: BAND_Y, width: 1080, height: BAND_H, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.45)"}}>
        <div style={{position: "absolute", left: BAND_X, top: 0, width: 1920, height: 1080, transform: `scale(${SC})`, transformOrigin: "0 0"}}>
          {onEnd ? <Freeze frame={Math.max(0, Math.round(total * k) - 1)}><Picture scenes={timeline.scenes} k={k}/></Freeze> : <Picture scenes={timeline.scenes} k={k}/>}
        </div>
        {onEnd && <AbsoluteFill style={{background: `rgba(20,32,58,${0.55 * e})`}}/>}
      </div>
      <div style={{position: "absolute", left: 0, top: BAND_Y + BAND_H + 14, height: 6, width: 1080 * clamp(f / total), background: GOLD, opacity: 0.85}}/>
      {!onEnd && live && <div style={{position: "absolute", top: 1330, left: 60, width: 880, textAlign: "center", fontFamily: SANS, fontWeight: 700,
        fontSize: 58, lineHeight: 1.2, color: CREAM, textShadow: "0 3px 12px rgba(0,0,0,0.6)"}}>
        {live.map((w, i) => <span key={i} style={{color: t >= w.start - 0.03 && t < w.end + 0.08 ? GOLD : CREAM}}>{w.w}{i < live.length - 1 ? " " : ""}</span>)}
      </div>}
      {onEnd && <div style={{position: "absolute", top: 1320, left: 60, width: 880, textAlign: "center", opacity: e, transform: `translateY(${(1 - e) * 20}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: GOLD, textTransform: "uppercase"}}>Full film on the channel</div>
        <div style={{marginTop: 14, fontFamily: SERIF, fontWeight: 600, fontSize: 62, lineHeight: 1.15, color: CREAM}}>{end}</div>
      </div>}
    </AbsoluteFill>
  </Fonts>;
};

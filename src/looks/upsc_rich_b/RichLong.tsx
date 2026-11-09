// Look B (rich daylight illustration, AK's pick 3 Nov 2026): plays the same Timeline as LongCartoon.tsx (scripts/datayt/long_timeline.py)
// with RICH_SCENES. Timeline frames are 30 fps logical frames; at fps = 60 each composition frame is half a logical frame (as KurzLong).
// Scenes cut hard inside an act; draft mode adds the narration as a caption strip. Contract: CONTRACT_B.md.
// No brand bug unless a `brand` is passed (AK, 3 Nov 2026: remove the Data Kadai logo; the UPSC channel brand is not chosen yet).
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {getBrand, lookBrand} from "../brands";
import {SAFE, W, type SceneProps, type Timeline, type TimelineScene} from "../cartoon/long/contract";
import {Fonts, SANS} from "./kit";
import {RICH_SCENES} from "./registry";

const strict = (id: string, reveals: Record<string, number>) => (key: string) => {
  if (!(key in reveals)) throw new Error(`scene ${id}: no reveal frame for key "${key}"`);
  return reveals[key];
};
const Host: React.FC<{s: TimelineScene; draft: boolean; at: SceneProps["at"]; k: number}> = ({s, draft, at, k}) => {
  const f = useCurrentFrame() / k, Comp = RICH_SCENES[s.kind];
  if (!Comp) throw new Error(`look B: no scene for kind "${s.kind}" in scene ${s.id}`);
  return <Comp f={f} dur={s.dur} spec={s.spec} at={at} draft={draft}/>;
};

export const RichLong: React.FC<{timeline: Timeline; draft?: boolean; brand?: string; audio?: string[]; fps?: number}> = ({timeline, draft = true, brand, audio = [], fps = 30}) => {
  const k = fps / 30, f = useCurrentFrame() / k;
  const br = getBrand(brand), B = React.useMemo(() => lookBrand(br, "counter"), [br]);
  const cur = timeline.scenes.find((s) => f >= s.from && f < s.from + s.dur) ?? timeline.scenes[timeline.scenes.length - 1];
  const dark = cur.kind === "statement" || (cur.kind === "stage" && cur.spec?.time === "burst") || (cur.kind === "stage" && cur.spec?.intro === "globe-band" && f - cur.from < 30);
  return <Fonts>
    <AbsoluteFill style={{background: "#EFE6D2", overflow: "hidden"}}>
      {timeline.scenes.map((s) => <Sequence key={s.id} from={Math.round(s.from * k)} durationInFrames={Math.round(s.dur * k)}><Host s={s} draft={draft} at={strict(s.id, s.reveals)} k={k}/></Sequence>)}
      {brand && <div style={{position: "absolute", right: W - SAFE.x1, top: SAFE.y0 - 20, display: "flex", alignItems: "center", gap: 14, opacity: 0.9}}><B.Mark size={54} on={dark ? "dark" : "light"}/><B.Wordmark size={32} on={dark ? "dark" : "light"}/></div>}
      {draft && <div style={{position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: 936, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 34, lineHeight: 1.25,
        color: "#FFFBF2", textShadow: "0 2px 10px rgba(30,20,10,0.9)", padding: "0 60px"}}>{cur.vo}</div>}
      {audio.map((a) => <Audio key={a} src={staticFile(a)}/>)}
    </AbsoluteFill>
  </Fonts>;
};

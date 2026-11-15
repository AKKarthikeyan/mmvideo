// The long-form cartoon engine (16:9, 1920 x 1080): plays a Timeline (timeline.json, made by scripts/datayt/long_timeline.py from the
// storyboard) scene by scene. Each scene is one component from scenes/index.ts, drawn in its own Sequence so its frame is local.
// Between acts a blue liquid-slash wipe covers the cut; inside an act scenes cut hard. Draft mode adds the narration text as a caption strip.
import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {getBrand, lookBrand} from "../../brands";
import {LookFonts} from "../../shared/LookFonts";
import {C} from "../palette";
import {SANS} from "../ui";
import {FPS, H, SAFE, W, type SceneProps, type Timeline, type TimelineScene} from "./contract";
import {SCENES} from "./scenes";

const strict = (id: string, reveals: Record<string, number>) => (key: string) => {
  if (!(key in reveals)) throw new Error(`scene ${id}: no reveal frame for key "${key}" (storyboard reveals: ${Object.keys(reveals).join(", ") || "none"})`);
  return reveals[key];
};

const Host: React.FC<{s: TimelineScene; draft: boolean; at: SceneProps["at"]; k: number}> = ({s, draft, at, k}) => {
  const f = useCurrentFrame() / k;   // logical (30 fps) frame, fractional when the film renders at 60 fps
  const Comp = SCENES[s.kind];
  if (!Comp) throw new Error(`unknown scene kind "${s.kind}" in scene ${s.id}`);
  return <Comp f={f} dur={s.dur} spec={s.spec} at={at} draft={draft}/>;
};

const ease = (t: number) => Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, t)));
// Blue slash wipe, centre frame `at`, 18 frames. Covers the whole frame at `at`.
export const WideWipe: React.FC<{f: number; at: number}> = ({f, at}) => {
  const t = (f - (at - 9)) / 18;
  if (t <= 0 || t >= 1) return null;
  const sk = 520, lead = -sk + (W + 2 * sk) * ease(t * 2), trail = -sk + (W + 2 * sk) * ease(t * 2 - 1);
  const edge = (x: number) => [0, 270, 540, 810, 1080].map((y, i) => `${x + sk * (1 - y / H) + Math.sin(i * 1.7 + t * 9) * 30},${y}`);
  return <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
    <polygon points={`${edge(lead).join(" ")} ${edge(trail).reverse().join(" ")}`} fill={C.royal}/>
    <polygon points={`${edge(lead + 60).join(" ")} ${edge(lead).reverse().join(" ")}`} fill={C.white}/>
  </svg>;
};

// fps = 60 (UPSC films): the timeline stays in 30 fps logical frames; every composition frame is half a logical frame, as in KurzLong.
export const LongCartoon: React.FC<{timeline: Timeline; draft?: boolean; brand?: string; audio?: string[]; fps?: number}> = ({timeline, draft = true, brand, audio = [], fps = 30}) => {
  const k = fps / 30, f = useCurrentFrame() / k;
  const br = getBrand(brand), B = React.useMemo(() => lookBrand(br, "counter"), [br]);
  const cur = timeline.scenes.find((s) => f >= s.from && f < s.from + s.dur) ?? timeline.scenes[timeline.scenes.length - 1];
  const dark = cur.kind === "statement" || cur.kind === "end" || (cur.kind === "stage" && cur.spec?.time === "burst") || (cur.kind === "stage" && cur.spec?.intro === "globe-band" && f - cur.from < 30);      // royal-blue cards: the brand bug takes its light-on-dark colours
  const cuts = timeline.scenes.filter((s, i) => i > 0 && s.transition === "wipe").map((s) => s.from);
  return <LookFonts faces={[br.faces.bricolage, br.faces.schibsted, br.faces.oswald]}>
    <AbsoluteFill style={{background: C.ink, overflow: "hidden"}}>
      {timeline.scenes.map((s) => <Sequence key={s.id} from={Math.round(s.from * k)} durationInFrames={Math.round(s.dur * k)}><Host s={s} draft={draft} at={strict(s.id, s.reveals)} k={k}/></Sequence>)}
      {cuts.map((at) => <WideWipe key={at} f={f} at={at}/>)}
      <div style={{position: "absolute", right: W - SAFE.x1, top: SAFE.y0 - 20, display: "flex", alignItems: "center", gap: 14, opacity: 0.95}}><B.Mark size={54} on={dark ? "dark" : "light"}/><B.Wordmark size={32} on={dark ? "dark" : "light"}/></div>
      {draft && <div style={{position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: 936, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 38, lineHeight: 1.2, color: C.white,
        textShadow: "0 3px 0 #17203A, 0 0 14px #17203A", padding: "0 40px"}}>{cur.vo}</div>}
      {audio.map((a) => <Audio key={a} src={staticFile(a)}/>)}
    </AbsoluteFill>
  </LookFonts>;
};
void interpolate; void FPS;

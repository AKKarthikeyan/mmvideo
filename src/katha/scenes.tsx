// Scenes for the Gita film (21 Oct 2026). Each scene is a full 1920x1080 SVG for one beat: s = the beat's scene props,
// n = the beat's length in frames. Every shot breathes: a slow push-in, drifting dust, living grain.
import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {K, W, H, KathaDefs, blur} from "./look";
import {SceneP, push, Frame, Flock, Foreground} from "./stage";
export type {SceneP} from "./stage";
import {Sky, Dust, Haze, Mood} from "./sky";
import {Armies, NearArmies, Ground} from "./field";
import {Rimmed, horseItem, horseAnchor, krishnaTeach, krishnaDrive, arjuna, ratha, wheel} from "./sil";
import {VerseCard, TitleCard} from "./cards";

// The chariot rig: car, wheel, two figures, four horses, reins; hub at (0, 0), ground at y = 118.
// pose: "arrive" (galloping, Krishna driving, Arjuna standing tall) | "despair" | "teach" (Krishna turned, Arjuna listening) | "resolve".
export const ChariotRig: React.FC<{f: number; pose: string; light: [number, number]; speed?: number; wind?: number}> = ({f, pose, light, speed, wind = 0}) => {
  const moving = pose === "arrive";
  const sp = speed ?? 1;                              // gallop when arriving; otherwise the standing idle (a nod, a swaying tail)
  const spin = moving ? f * 0.05 : f * 0.002;
  const t = f, w = wind + Math.sin(f / 40) * 0.3;
  const HS: [number, number, number, number][] = [[716, 106, 1.36, 0.55], [676, 110, 1.4, 0.3], [636, 114, 1.44, 0.8], [596, 118, 1.48, 0.05]];  // far to near, abreast
  const kx = 205, ky = -36, kscale = 0.95, ax = -95, ay = -36, ascale = 0.95;
  const kPaths = pose === "arrive" ? krishnaDrive(w, t) : krishnaTeach(w, t);
  const kTr = pose === "arrive" ? `translate(${kx + 30} ${ky}) scale(${kscale})` : `translate(${kx} ${ky}) scale(${kscale})`;
  const aPose = pose === "despair" ? "despair" : pose === "resolve" || pose === "arrive" ? "resolve" : "listen";
  // Krishna's rein hand in rig coordinates
  const hand: [number, number] = pose === "arrive" ? [kx + 30 + 128 * kscale, ky - 148 * kscale] : [kx + 12 * kscale, ky - 186 * kscale];
  return (
    <g>
      {/* the four horses abreast as one silhouette: backlight rims only the team's outer edge; the far ones a shade lighter */}
      <Rimmed paths={HS.map(([x, y, sc, ph], i) => horseItem(x, y, sc, f, sp, ph, ["#33243F", "#2C1E38", "#251831", "#1D1228"][i], !moving))} light={light} w={2.5} rim="#C99A5E"/>
      <Rimmed paths={ratha(t, w)} light={light} w={4}/>
      <Rimmed paths={arjuna(aPose as any, w, t)} transform={`translate(${ax} ${ay}) scale(${ascale})`} light={light} w={4 / ascale}/>
      {pose !== "arrive" ? <circle cx={kx + 2} cy={ky - 380 * kscale} r={150} fill="url(#k-halo)" opacity={0.55 + 0.1 * Math.sin(f / 45)}/> : null}
      <Rimmed paths={kPaths} transform={kTr} light={light} w={4 / kscale} glow={0.35}/>
      {HS.map(([x, y, sc, ph], i) => { const [mx, my] = horseAnchor(f, sp, ph, "mouth", !moving); const bx = x + mx * sc, by = y + my * sc;
        return <path key={i} d={`M ${hand[0]} ${hand[1]} Q ${(hand[0] + bx) / 2} ${(hand[1] + by) / 2 + (moving ? 10 : 40)} ${bx} ${by}`} fill="none" stroke={K.rim} strokeWidth={1.6} opacity={0.75}/>; })}
      <Rimmed paths={[wheel(118, spin)]} light={light} w={3} evenodd/>
    </g>
  );
};
// The field of Kurukshetra, wide: both armies, the plain, the chariot small between them.
export const FieldScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood: Mood = s.mood || "dawn", sun: [number, number] = s.sun || [960, 640], HOR = 700;
  const z = push(f, n, s.zoomFrom ?? 1, s.zoomTo ?? 1.06);
  const pose = s.pose || "arrive", moving = pose === "arrive";
  const cx = moving ? interpolate(f, [0, n], [s.fromX ?? 700, s.toX ?? 900]) : (s.x ?? 900);
  const light: [number, number] = [sun[0] - cx, sun[1] - 820];
  return (
    <Frame f={f} zoom={z} cy={720}>
      <Sky mood={mood} sun={sun} f={f} rays={s.rays ?? 0.5} id="fs"/>
      {s.birds !== false ? <Flock f={f} light={[0, -1]} kind={mood === "night" ? "stork" : "stork"} y={300} count={6} scale={0.28} seed={1}/> : null}
      <Armies horizon={HOR} f={f}/>
      <Ground y={HOR + 30} sunX={sun[0]}/>
      <NearArmies horizon={HOR} f={f}/>
      {s.conch || String(s.music || "").includes("conch") ? [[220, 690], [520, 700], [1380, 696], [1700, 690], [880, 708]].map(([x, y], i) => {
        const t0 = 8 + i * 9; return [0, 1, 2].map((k) => { const u = (f - t0 - k * 14) / 70; return u > 0 && u < 1 ? <ellipse key={`${i}-${k}`} cx={x} cy={y} rx={30 + 420 * u} ry={10 + 120 * u} fill="none" stroke={K.rim} strokeWidth={3 * (1 - u)} opacity={0.55 * (1 - u)}/> : null; });
      }) : null}
      <g transform={`translate(${cx} ${828}) scale(0.42)`}><ChariotRig f={f} pose={pose} light={light}/></g>
      {moving ? <ellipse cx={cx + 300} cy={880} rx={220} ry={26} fill="#E9B57A" opacity={0.18} filter={blur(14)}/> : null}
      <Dust f={f} sun={sun} n={140} y0={560}/>
    </Frame>
  );
};
// The chariot between the armies, medium shot: the dialogue itself.
export const ChariotScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const mood: Mood = s.mood || "dusk", sun: [number, number] = s.sun || [960, 600], HOR = 700;
  const z = push(f, n, s.zoomFrom ?? 1, s.zoomTo ?? 1.05);
  const hub: [number, number] = s.hub || [700, 812];
  const light: [number, number] = [sun[0] - (hub[0] + 100), sun[1] - (hub[1] - 200)];
  return (
    <Frame f={f} zoom={z} cx={s.focusX ?? 960} cy={s.focusY ?? 600}>
      <Sky mood={mood} sun={sun} f={f} rays={s.rays ?? 0.55} id="cs"/>
      <Flock f={f} light={[sun[0] - 960, sun[1] - 300]} y={240} count={4} scale={0.32} seed={3}/>
      <Armies horizon={HOR} f={f} gap={[640, 1300]}/>
      <Ground y={HOR + 30} sunX={sun[0]}/>
      <Haze y={HOR + 50} h={90} color="#E58A4A" op={0.28}/>
      <ellipse cx={hub[0] + 300} cy={hub[1] + 118} rx={760} ry={34} fill="#000" opacity={0.35} filter={blur(14)}/>
      <g transform={`translate(${hub[0]} ${hub[1]})`}><ChariotRig f={f} pose={s.pose || "teach"} light={light} wind={s.wind ?? 0}/></g>
      <Dust f={f} sun={sun} n={180} y0={300}/>
      <Foreground f={f} y={1010} blurPx={5}/>
    </Frame>
  );
};
export const VerseScene: React.FC<SceneP> = ({s, n}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}><KathaDefs/><VerseCard s={s} n={n} enAt={s.enAt ?? 22}/></svg>
);
export const TitleScene: React.FC<SceneP> = ({s, n}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute"}}><KathaDefs/><TitleCard s={s} n={n}/></svg>
);
// Metaphor scenes live in ./metaphors (one file per family). A missing kind falls back to a quiet sky so a film always renders.
import {METAPHORS} from "./metaphors";
const Quiet: React.FC<SceneP> = ({s, n}) => { const f = useCurrentFrame(); return <Frame f={f} zoom={push(f, n)}><Sky mood={s.mood || "night"} sun={[960, 700]} f={f} rays={0.2} id="q"/><Dust f={f} sun={[960, 700]}/></Frame>; };
const Metaphor: React.FC<SceneP> = (p) => { const M = (METAPHORS as Record<string, React.FC<SceneP>>)[p.s.kind] || Quiet; return <M {...p}/>; };
const typeScene = (t: string): React.FC<SceneP> => (p) => { const M = (METAPHORS as Record<string, React.FC<SceneP>>)[t] || Quiet; return <M {...p}/>; };
export const KATHA_SCENES: Record<string, React.FC<SceneP>> = {field: FieldScene, chariot: ChariotScene, verse: VerseScene, title: TitleScene, metaphor: Metaphor, light: typeScene("light"), sanjaya: typeScene("sanjaya"), end: typeScene("end")};

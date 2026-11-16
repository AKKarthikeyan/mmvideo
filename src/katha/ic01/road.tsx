// IC-01: the road into exile (16 Nov 2026). Dusk; Rama, Sita and Lakshmana walk in file through a forest of palmyra,
// neem and khejri (Rama leads, Lakshmana guards the rear); the camera tracks with them, so the far ridge barely drifts,
// the trees slide past and the kans grass crosses the lens. Also "cast": the three figures large on a plain dusk, for
// checking their outlines (a dev sheet, not a film beat).
// Scene props: s.speed (px a frame at the subject plane, default 1.5), s.mood (default "dusk").
import React from "react";
import {useCurrentFrame} from "remotion";
import {W, H, K} from "../look";
import {SceneP, Frame} from "../stage";
import {Sky, Mood} from "../sky";
import {Rimmed} from "../sil";
import {palmyra, neem, khejri, reeds, SIL_BACK, SIL_FAR} from "../flora";
import {smooth, rnd, Pt} from "../geom";
import {Planes} from "../planes";
import {ascetic, sita, CostumeDefs} from "./people";

const SC = 0.56;                                   // the figures' scale: ~225 px tall, the human-anchor rule (>= 18-20%)

// walked: how far they have come, in scene px (the gait turns it into steps, so no foot ever slides)
const Walkers: React.FC<{f: number; x: number; y: number; walked: number; light: [number, number]; still?: boolean}> = ({f, x, y, walked, light, still}) => {
  const d = walked / SC, w = 0.3;
  return (
    <g>
      <CostumeDefs light={light}/>
      <Rimmed transform={`translate(${x - 250} ${y}) scale(${SC})`} paths={ascetic("lakshmana", {dist: d + 61, still, w, t: f, light})} light={light} w={3}/>
      <Rimmed transform={`translate(${x - 125} ${y}) scale(${SC})`} paths={sita({dist: d + 23, still, w, t: f, light})} light={light} w={3}/>
      <Rimmed transform={`translate(${x} ${y}) scale(${SC})`} paths={ascetic("rama", {dist: d, still, w, t: f, light})} light={light} w={3}/>
    </g>
  );
};

export const RoadScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const speed = s.speed ?? 1.5, mood: Mood = s.mood ?? "dusk";
  const gy = 860, sun: [number, number] = [430, 690];
  const walk = 900 + f * speed;                                 // Rama's x on the subject plane
  const pan = speed * n * 0.85;                                  // the camera follows (they gain a little on it)
  const light: [number, number] = [-1, -0.22];                   // the sun is behind them, low on the left
  const ridge = (() => {
    const p: Pt[] = [[-400, 1100], [-400, 760]];
    for (let i = 0; i <= 46; i++) p.push([-400 + i * 64, 748 - 30 * Math.sin(i * 0.29 + 1) - 22 * rnd(i, 7) - (i % 4 === 1 ? 26 : 0)]);
    p.push([2600, 760], [2600, 1100]);
    return smooth(p, {wind: "cw"});
  })();
  // mid trees along the road, spread over the frame plus the camera's travel at depth 2.2
  const trees = Array.from({length: 9}, (_, i) => {
    const x = -260 + i * 330 + rnd(i, 3) * 120, kind = i % 3, h = 300 + rnd(i, 5) * 170;
    const P = {x, y: gy - 16, h, seed: 30 + i, t: f, wind: 0.15, fill: SIL_BACK};
    return kind === 0 ? palmyra(P) : kind === 1 ? neem({...P, h: h * 0.75}) : khejri({...P, h: h * 0.8});
  });
  return (
    <Frame f={f} vig={0.85} grain={0.07}>
      <Planes f={f} n={n} cam={{x: [0, pan], zoom: [1.02, 1.04]}} haze="#8A4A52" horizon={800} layers={[
        {depth: 12, node: <Sky mood={mood} sun={sun} sunR={70} f={f} rays={0.35} horizon={820} id="road"/>},
        {depth: 5, node: <path d={ridge} fill={SIL_FAR}/>, haze: 0.38},
        {depth: 2.2, node: <Rimmed paths={trees.flat()} point={sun} light={light} w={2} rim="#E0A060" fill={SIL_BACK}/>, haze: 0.2},
        {depth: 1, node: <g>
          <path d={`M -400 ${gy - 18} C 600 ${gy - 30} 1800 ${gy - 26} 3400 ${gy - 14} L 3400 1200 L -400 1200 Z`} fill="#1A0F1E"/>
          {/* the road: a band of pale dust, lit along its far edge */}
          <path d={`M -400 ${gy - 6} C 800 ${gy - 14} 2000 ${gy - 10} 3400 ${gy - 4} L 3400 ${gy + 44} C 2000 ${gy + 50} 800 ${gy + 46} -400 ${gy + 40} Z`} fill="#2C1C26"/>
          <path d={`M -400 ${gy - 6} C 800 ${gy - 14} 2000 ${gy - 10} 3400 ${gy - 4}`} fill="none" stroke="#C88A5A" strokeWidth={1.4} opacity={0.4}/>
          <Walkers f={f} x={walk} y={gy + 14} walked={f * speed} light={light}/>
        </g>},
        {depth: 0.45, node: <Rimmed paths={Array.from({length: 7}, (_, i) => reeds({x: -200 + i * 520 + rnd(i, 9) * 160, y: 1130, h: 260 + rnd(i, 11) * 120, seed: 40 + i, t: f, wind: 0.3, fill: "#0C0610"})).flat()} light={light} w={1.6} rim="#9A6A44" fill="#0C0610"/>},
      ]}/>
    </Frame>
  );
};

// The three figures large on a plain dusk sky (dev sheet): walking at the top row's phase, standing below.
export const CastScene: React.FC<SceneP> = ({s}) => {
  const f = useCurrentFrame(), light: [number, number] = [-1, -0.2], dist = (s.dist ?? 0) + f * 2.7;
  return (
    <Frame f={f} vig={0.7}>
      <Sky mood="dusk" sun={[960, 980]} sunR={90} f={f} rays={0} horizon={1000} id="cast"/>
      <CostumeDefs light={light}/>
      {[["rama", 380], ["sita", 960], ["lakshmana", 1540]].map(([who, x]) => (
        <Rimmed key={who as string} transform={`translate(${x} 1000) scale(2)`} paths={who === "sita" ? sita({dist, still: s.still, t: f, light}) : ascetic(who as "rama", {dist, still: s.still, t: f, light})} light={light} w={4} fill={K.sil}/>
      ))}
    </Frame>
  );
};
export const SCENES: Record<string, React.FC<SceneP>> = {road: RoadScene, cast: CastScene};

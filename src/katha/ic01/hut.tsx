// IC-01 (The Lakshman Rekha Isn't in Valmiki's Ramayana), 16 Nov 2026: the cold open. Night; the leaf hut in the
// forest; a line of light glows in the dust before the door and hums (IC01_SCRIPT_v2.md, 0:00). Built on Planes:
// sky (depth 10), the far ridge (5), the mid trees (2.2), the hut and the line (1), kans grass passing the lens (0.45).
// One light per shot: the line is the light, so every rim turns to it (point light) and the sky has no moon.
// Scene props: s.flick = the frame of the bell (the line flickers for ~20 frames); s.draw = frames for the line to draw
// itself in (0 = already there).
import React from "react";
import {useCurrentFrame} from "remotion";
import {W, H, K} from "../look";
import {SceneP, Frame} from "../stage";
import {Sky} from "../sky";
import {Rimmed, Item} from "../sil";
import {banyan, peepal, reeds, SIL_BACK, SIL_FAR} from "../flora";
import {RELIEF, RELIEF_LT} from "../arch";
import {smooth, band, rnd, wob, clamp01, Pt} from "../geom";
import {Planes} from "../planes";
import {SoftGlow} from "../look";

// The parnashala: a leaf hut on a wattle wall, a steep thatched gable with a ragged fringe, ridge poles crossed above
// the apex, an arched doorway cut through (a real hole: draw what is inside behind the Rimmed). Stands on (x, y); w = the
// wall's width. Returns path items plus the door's box for the glow behind it.
export const parnashala = ({x, y, w, seed = 3}: {x: number; y: number; w: number; seed?: number}) => {
  const hw = 0.46 * w, eave = y - hw + 14, ow = 0.17 * w, apexY = eave - 0.62 * w;
  const items: Item[] = [];
  // the wall, the doorway cut counter-clockwise
  const dw = 0.13 * w, dh = 0.36 * w;
  const wall = smooth([[x - w / 2, y + 2, "c"], [x - w / 2 + 2, eave, "c"], [x + w / 2 - 2, eave, "c"], [x + w / 2, y + 2, "c"]] as Pt[], {wind: "cw"});
  const door = smooth([[x - dw, y + 3, "c"], [x - dw, y - dh * 0.72], [x - dw * 0.7, y - dh * 0.94], [x, y - dh], [x + dw * 0.7, y - dh * 0.94], [x + dw, y - dh * 0.72], [x + dw, y + 3, "c"]] as Pt[], {wind: "ccw"});
  items.push({d: wall + " " + door, c: [x, y - hw / 2]});
  // wattle: the woven canes, drawn flat in a lighter tint (not on the doorway)
  const canes: string[] = [];
  for (let i = 0; i <= 22; i++) {
    const cx = x - w / 2 + 8 + i * ((w - 16) / 22);
    if (Math.abs(cx - x) < dw + 6) continue;
    canes.push(`M ${(cx - 1.6).toFixed(1)} ${y} L ${(cx - 1.2).toFixed(1)} ${eave + 6} L ${(cx + 1.2).toFixed(1)} ${eave + 6} L ${(cx + 1.6).toFixed(1)} ${y} Z`);
  }
  for (let k = 1; k <= 2; k++) { const yy = eave + (y - eave) * (k / 3); canes.push(`M ${x - w / 2 + 4} ${yy - 2} L ${x - dw - 6} ${yy - 2} L ${x - dw - 6} ${yy + 2} L ${x - w / 2 + 4} ${yy + 2} Z M ${x + dw + 6} ${yy - 2} L ${x + w / 2 - 4} ${yy - 2} L ${x + w / 2 - 4} ${yy + 2} L ${x + dw + 6} ${yy + 2} Z`); }
  items.push({d: canes.join(" "), fill: RELIEF, rim: false});
  // the thatched gable: slopes that sag a little, a fringe of hanging leaf-ends along the eave
  const L0: [number, number] = [x - w / 2 - ow, eave + 10], R0: [number, number] = [x + w / 2 + ow, eave + 10];
  const top: Pt[] = [L0, [x - w * 0.38, eave - 0.2 * w], [x - w * 0.18, eave - 0.45 * w], [x, apexY, "c"], [x + w * 0.18, eave - 0.45 * w], [x + w * 0.38, eave - 0.2 * w], R0];
  const fringe: Pt[] = [];
  const nF = 64;
  for (let i = 0; i <= nF; i++) {
    const u = i / nF, fx = R0[0] + (L0[0] - R0[0]) * u + (rnd(i, seed + 2) - 0.5) * 4, drop = 3 + rnd(i, seed) * 9 + (rnd(i, seed + 1) > 0.8 ? 6 : 0);
    fringe.push([fx, eave + 10 + drop] as Pt);
  }
  items.push({d: smooth([...top, ...fringe] as Pt[], {wind: "cw"}), c: [x, eave - 0.25 * w]});
  // thatch courses: flat lighter strokes following the slopes
  const th: string[] = [];
  for (let k = 1; k <= 5; k++) {
    const u = k / 6, yl = eave + 6 - (eave - apexY) * u * 0.92;
    const xl = L0[0] + (x - L0[0]) * u * 0.96, xr = R0[0] - (R0[0] - x) * u * 0.96;
    const pts = Array.from({length: 9}, (_, j) => { const v = j / 8, xx = xl + (xr - xl) * v; return [xx, yl + Math.abs(v - 0.5) * 2 * (eave - apexY) * 0.0 + Math.sin(v * 9 + k) * 1.5]; });
    th.push(band(pts, 3.2, 1.2, 1, "point"));
  }
  items.push({d: th.join(" "), fill: RELIEF, rim: false});
  // the ridge poles, crossed above the apex
  const pole = (x0: number, y0: number, x1: number, y1: number) => band([[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]], 7, 4, 1, "round");
  items.push(pole(x - 0.2 * w, eave - 0.36 * w, x + 0.09 * w, apexY - 0.13 * w));
  items.push(pole(x + 0.2 * w, eave - 0.36 * w, x - 0.09 * w, apexY - 0.13 * w));
  return {items, door: {x0: x - dw, x1: x + dw, y0: y - dh, y1: y}, eave, apexY};
};

// The line in the dust: the lower arc of an ellipse round the front of the hut, drawn in at p, humming.
const RekhaLine: React.FC<{f: number; cx: number; cy: number; rx: number; ry: number; p: number; b: number}> = ({f, cx, cy, rx, ry, p, b}) => {
  if (p <= 0 || b <= 0) return null;
  const N = 120, a0 = Math.PI * 0.97, a1 = Math.PI * 2.03;      // from the left end round the front (a = 1.5 pi) to the right end
  const pts: [number, number][] = [];
  for (let i = 0; i <= Math.round(N * p); i++) {
    const u = i / N, a = a0 + (a1 - a0) * u, hum = Math.sin(f * 0.9 + u * 40) * 0.8;
    pts.push([cx + Math.cos(a) * rx, cy - Math.sin(a) * ry + hum]);   // a from 0.97 pi through 1.5 pi (the front, nearest the viewer) to 2.03 pi
  }
  if (pts.length < 2) return null;
  const d = "M " + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ");
  const pulse = 0.88 + 0.12 * Math.sin(f * 0.55) + 0.05 * wob(f * 0.2, 3);
  const B = b * pulse;
  // a bright bead that runs along the line, the hum made visible
  const bead = pts[Math.floor(((f * 1.4) % pts.length))];
  return (
    <g>
      {[[46, 0.035], [28, 0.07], [14, 0.16], [6, 0.42]].map(([sw, o], i) => <path key={i} d={d} fill="none" stroke="#F2B45A" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" opacity={o * B}/>)}
      <path d={d} fill="none" stroke="#FFF1C8" strokeWidth={2.4} strokeLinecap="round" opacity={0.95 * B}/>
      {bead ? <SoftGlow x={bead[0]} y={bead[1]} r={34} ry={14} c0="#FFF6DC" c1="#F2B45A" o={0.9 * B} k={3}/> : null}
    </g>
  );
};

export const HutScene: React.FC<SceneP> = ({s, n}) => {
  const f = useCurrentFrame();
  const draw = s.draw ?? 0, flick = s.flick ?? -999;
  const p = draw > 0 ? clamp01(f / draw) : 1;
  // the bell: the line dips twice and comes back
  const ff = f - flick, b = ff >= 0 && ff < 22 ? 0.35 + 0.65 * Math.abs(Math.cos(ff * 0.45)) : 1;
  const gx = 960, gy = 818;                                        // the ground line under the hut
  const hut = parnashala({x: gx, y: gy, w: 360});
  const line = {cx: gx, cy: gy + 8, rx: 330, ry: 74};
  const L: [number, number] = [gx, gy + 70];                         // the light: the front of the line
  const glow = (0.55 + 0.45 * p) * b;
  const ridge = (() => {                                             // a far treeline: crowns on a low ridge
    const pts: Pt[] = [[-500, 1100], [-500, 700]];
    for (let i = 0; i <= 44; i++) { const x = -500 + i * 66, y = 690 - 40 * Math.sin(i * 0.33) - 26 * rnd(i, 4) - (i % 3 === 0 ? 34 : 0); pts.push([x, y]); }
    pts.push([2420, 700], [2420, 1100]);
    return smooth(pts, {wind: "cw"});
  })();
  return (
    <Frame f={f} vig={1} grain={0.07}>
      <Planes f={f} n={n} cam={{x: [-70, 50], zoom: [1, 1.07]}} haze="#2E2142" horizon={760} layers={[
        {depth: 10, node: <Sky mood="night" sun={null} f={f} horizon={780} band={0.7} stars={1.1} id="hut"/>},
        {depth: 5, node: <path d={ridge} fill={SIL_FAR}/>},
        {depth: 2.2, node: <g>
          <Rimmed paths={banyan({x: 250, y: 830, h: 330, seed: 21, t: f, wind: 0.1, detail: 0.9, fill: SIL_BACK})} point={[gx, gy + 70]} light={[1, 0]} w={1.5} rim="#7E5C44" fill={SIL_BACK}/>
          <Rimmed paths={peepal({x: 1700, y: 830, h: 420, seed: 8, t: f, wind: 0.1, fill: SIL_BACK})} point={[gx, gy + 70]} light={[-1, 0]} w={1.5} rim="#7E5C44" fill={SIL_BACK}/>
        </g>},
        {depth: 1, node: <g>
          {/* the forest floor, and the pool of light the line throws on it */}
          <path d={`M -400 ${gy - 6} C 400 ${gy - 22} 1500 ${gy - 18} 2320 ${gy - 4} L 2320 1200 L -400 1200 Z`} fill="#140B1A"/>
          <SoftGlow x={gx} y={gy + 40} r={720} ry={150} c0="#E8A253" c1="#7A3E2A" o={0.5 * glow} k={1.6} peak={0.7}/>
          {/* inside the doorway: a dim warm room (behind the wall) */}
          <rect x={hut.door.x0} y={hut.door.y0} width={hut.door.x1 - hut.door.x0} height={hut.door.y1 - hut.door.y0} fill="#160B0A"/>
          <SoftGlow x={gx} y={gy - 8} r={56} ry={44} c0="#7A4020" c1="#2A140C" o={0.55} k={2.4}/>
          <Rimmed paths={hut.items} point={L} light={[0, 1]} w={3.2} rim={K.rim} glow={0.5 * glow}/>
          {/* the hut's light on the ground before the door, under the line */}
          <RekhaLine f={f} {...line} p={p} b={b}/>
          {/* dust motes lifting off the line */}
          {Array.from({length: 46}, (_, i) => {
            const a = Math.PI * (0.97 + 1.06 * rnd(i, 61)), x0 = line.cx + Math.cos(a) * line.rx, y0 = line.cy - Math.sin(a) * line.ry;
            const life = 90 + rnd(i, 62) * 90, t = ((f + rnd(i, 63) * life) % life) / life, rise = t * (60 + rnd(i, 64) * 80);
            const on = clamp01((p - rnd(i, 61)) * 6);           // lit once the line has drawn past it
            return <circle key={i} cx={x0 + Math.sin(f / 24 + i) * 6} cy={y0 - rise} r={0.8 + rnd(i, 65) * 1.8} fill="#FFE2A8" opacity={on * b * 0.7 * Math.sin(Math.PI * t)}/>;
          })}
        </g>},
        {depth: 0.45, node: <g>
          <Rimmed paths={[...reeds({x: -60, y: 1110, h: 330, seed: 5, t: f, wind: 0.2, fill: "#0A050E"}), ...reeds({x: 170, y: 1130, h: 260, seed: 9, t: f, wind: 0.25, fill: "#0A050E"})]} light={[1, -0.4]} w={1.6} rim="#6A4A36" fill="#0A050E"/>
          <Rimmed paths={[...reeds({x: 1800, y: 1120, h: 300, seed: 13, t: f, wind: -0.1, fill: "#0A050E"}), ...reeds({x: 2040, y: 1110, h: 340, seed: 17, t: f, wind: -0.15, fill: "#0A050E"})]} light={[-1, -0.4]} w={1.6} rim="#6A4A36" fill="#0A050E"/>
        </g>},
      ]}/>
    </Frame>
  );
};
export const SCENES: Record<string, React.FC<SceneP>> = {hut: HutScene};

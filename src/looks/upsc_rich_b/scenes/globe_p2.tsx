// Look B "globe" modes for Part 2: belt-south (the glowing rain belt slides back south over the peninsula, Bay storms swirl in, then it
// moves on toward the equator) and pacific (the globe turns from India to the Pacific; warm red water spreads east along the equator to Peru).
// Timing is read from the labels' at(key) frames (L[i].t0), never from fixed frame numbers; with fewer labels sensible defaults apply.
import React from "react";
import {clamp, eio, eo, lerp, prog, rng} from "../kit";
import {ARW, ArrowB, BandB, GlobeB, SunB, flowPts, lat_line, lineD, pathOf, proj, tagBox, type View} from "./globe_b";
import type {Ctx, Out, TagSpec} from "./globe";

const D = Math.PI / 180, GID = "gb";
const V0: View = {cx: 960, cy: 474, R: 366, lon0: 78, lat0: 16};
const drift = (v: View, f: number, dur: number): View => ({...v, R: v.R * (1 + 0.03 * clamp(f / Math.max(1, dur)))});
const tex = (v: View, lon0: number) => -(v.lon0 - lon0) * D * v.R * Math.cos(v.lat0 * D);

/** a Bay of Bengal storm seen from above: two spiral arms of painted cloud turning slowly, a calm eye, a dark shadow beneath */
const StormB: React.FC<{x: number; y: number; r: number; f: number; a: number; seed: number; sq: number}> = ({x, y, r, f, a, seed, sq}) => {
  if (a <= 0.01) return null;
  const rr = rng(seed), arms: {px: number; py: number; s: number; t: number}[] = [];
  const rot = -f * 0.035 + seed;
  for (let arm = 0; arm < 3; arm++) for (let i = 0; i < 12; i++) {
    const t = (i + 1) / 12, ang = rot + arm * 2.094 + t * 3.4, rad = r * (0.16 + 0.84 * t);
    arms.push({px: Math.cos(ang) * rad, py: Math.sin(ang) * rad, s: r * (0.2 - 0.07 * t) * (0.8 + 0.4 * rr()), t});
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${sq} 1)`} opacity={a}>
      <ellipse cx={r * 0.12} cy={r * 0.3} rx={r * 1.1} ry={r * 0.95} fill="#0a2146" opacity="0.5" filter={`url(#${GID}-b14)`}/>
      <circle r={r * 0.92} fill="#3d6aa0" opacity="0.5" filter={`url(#${GID}-b8)`}/>
      <g filter={`url(#${GID}-b3)`}>
        {arms.map((p, i) => <ellipse key={`s${i}`} cx={p.px + 2} cy={p.py + 4} rx={p.s * 1.05} ry={p.s * 0.78} fill="#9fb2cc"/>)}
        {arms.map((p, i) => <ellipse key={`b${i}`} cx={p.px} cy={p.py} rx={p.s} ry={p.s * 0.74} fill="#e9f0f8"/>)}
        {arms.map((p, i) => <ellipse key={`h${i}`} cx={p.px - p.s * 0.2} cy={p.py - p.s * 0.28} rx={p.s * 0.56} ry={p.s * 0.38} fill="#fffaf0"/>)}
      </g>
      <circle r={r * 0.15} fill="#2f5d94" opacity="0.8" filter={`url(#${GID}-b3)`}/>
      <path d={`M0,0 ${Array.from({length: 26}).map((_, i) => { const t = (i + 1) / 26, a = rot + t * 8.2, rd = r * (0.16 + 0.8 * t); return `L${(Math.cos(a) * rd).toFixed(1)},${(Math.sin(a) * rd).toFixed(1)}`; }).join(" ")}`} fill="none" stroke="#35649c" strokeWidth={r * 0.05} opacity="0.55" strokeLinecap="round"/>
    </g>
  );
};

// ------------------------------------------------------------------ belt-south
export const BeltSouthMode = ({f, dur, L}: Ctx): Out => {
  const tBs = L[0] ? L[0].t0 : 16, tSt = L[1] ? L[1].t0 : tBs + 100, tDc = L[2] ? L[2].t0 : tSt + 240;
  const s1 = eio(prog(f, tBs - 8, 110)), s2 = eio(prog(f, tDc - 12, 130));
  // the belt: from over north India back to the south peninsula, a slow hold with a swell, then on toward the equator
  const lat = lerp(lerp(24.5, 10.5, s1), -3, s2) + 0.5 * Math.sin(f / 40) * (1 - s2);
  const sunLat = lerp(lerp(20, 0, eio(prog(f, tBs - 8, 100))), -23.4, s2);
  const v = drift({...V0, lon0: 78, lat0: lerp(17, 8, s2)}, f, dur);
  const sp = proj(v, 78, sunLat);
  // storms from the east: three, a bit apart, each crossing the Bay toward the coast of Tamil Nadu and fading as it lands
  const storms = [0, 1, 2].map((n) => {
    const t0 = tSt - 24 + n * 78, u = clamp((f - t0) / 150), e = eo(u);
    const lon = lerp(101 - n * 2.5, 85 + n * 1.2, e), la = lerp(16.5 + n * 1.4, 15 + n * 0.8, e) + 0.9 * Math.sin(f / 50 + n);
    const a = eo(clamp(u * 7)) * (1 - eo(clamp((u - 0.82) / 0.18))) * (1 - eo(prog(f, tDc, 40)));
    const p = proj(v, lon, la);
    return {p, a: a * clamp((p.c - 0.15) / 0.2), n};
  });
  const pt = (lo: number, la: number): [number, number] => { const p = proj(v, lo, la); return [p.x, p.y]; };
  const tags: TagSpec[] = [];
  if (L[0]) tags.push({text: L[0].text, t0: L[0].t0, box: tagBox(L[0].text, 960, 868)});
  if (L[1]) tags.push({text: L[1].text, t0: L[1].t0, box: tagBox(L[1].text, 1545, 360), to: pt(90, 13.5), dot: "#3b86bd"});
  if (L[2]) tags.push({text: L[2].text, t0: L[2].t0, box: tagBox(L[2].text, 960, 766)});
  L.slice(3).forEach((l, i) => tags.push({text: l.text, t0: l.t0, box: tagBox(l.text, 960, 664 - i * 100)}));
  return {
    bd: v,
    svg: <GlobeB indiaTop v={v} id="gB" f={f} texShift={tex(v, 78)} under={<>
      <path d={lineD(v, lat_line(23.4, -60, 200, 4))} fill="none" stroke="#fff6c8" strokeWidth="2.2" strokeDasharray="10 12" opacity="0.7"/>
      <path d={lineD(v, lat_line(-23.4, -60, 200, 4))} fill="none" stroke="#fff6c8" strokeWidth="2.2" strokeDasharray="10 12" opacity="0.7"/>
      <BandB v={v} gid={GID} f={f} lat={lat} glow={1}/>
      {storms.map((s) => <StormB key={s.n} x={s.p.x} y={s.p.y} r={v.R * 0.19} f={f + s.n * 40} a={s.a} seed={s.n * 3 + 1} sq={Math.sqrt(Math.max(0.2, s.p.c))}/>)}
    </>}>{sp.c > 0 && <SunB x={sp.x} y={sp.y} r={v.R * 0.05} f={f} gid={GID}/>}</GlobeB>,
    tags,
  };
};

// ------------------------------------------------------------------ pacific
export const PacificMode = ({f, dur, L}: Ctx): Out => {
  const tEn = L[0] ? L[0].t0 : 100, tEl = L[1] ? L[1].t0 : tEn + 120;
  const turn = eio(prog(f, 4, 120)), spread = eio(prog(f, tEn - 26, 190)), settle = clamp(f / Math.max(1, dur));
  const lon0 = lerp(78, 226, turn), v0: View = {cx: 960, cy: 478, R: 366, lon0, lat0: lerp(16, 8, turn)};
  const v = drift(v0, f, dur);
  const R = v.R, tx = tex(v, 78) * 0.42;
  const east = lerp(150, 281, spread);                           // the tongue of warm water, from the western warm pool to the coast of Peru
  const edge = (la: number, sw: number): [number, number][] => { const o: [number, number][] = []; for (let lo = 140; lo <= east; lo += 8) { const k = (lo - 140) / 145; o.push([lo, la * (0.5 + 0.55 * Math.sin(Math.min(1, k * 1.15 + 0.12) * 2.9)) + sw * Math.sin(lo / 9 + f / 22)]); } return o; };
  const warmPts = (la: number) => { const up = edge(la, 0.5), dn = edge(-la, 0.5).reverse(); return flowPts(v, [...up, ...dn]); };
  const outer = pathOf(warmPts(17)) + "Z", mid = pathOf(warmPts(11)) + "Z", core = pathOf(warmPts(5.5)) + "Z";
  const pulse = 0.5 + 0.5 * Math.sin(f / 13);
  const peru = proj(v, 281, -5);
  const belt = 1 - eo(prog(f, 24, 80));
  const cold = eo(prog(f, tEn - 10, 120));
  const pt = (lo: number, la: number): [number, number] => { const p = proj(v, lo, la); return [p.x, p.y]; };
  const tags: TagSpec[] = [];
  if (L[0]) tags.push({text: L[0].text, t0: L[0].t0, box: tagBox(L[0].text, 960, 104)});
  if (L[1]) tags.push({text: L[1].text, t0: L[1].t0, box: tagBox(L[1].text, 1545, 360), to: pt(236, 0), dot: "#d8452a"});
  if (L[2]) tags.push({text: L[2].text, t0: L[2].t0, box: tagBox(L[2].text, 960, 868)});
  L.slice(3).forEach((l, i) => tags.push({text: l.text, t0: l.t0, box: tagBox(l.text, 960, 784 - i * 84)}));
  void settle; void tEl; void R;
  return {
    bd: v,
    svg: <GlobeB indiaTop={false} v={v} id="gB" f={f} texShift={tx} texPad={R * 1.1} under={<>
      <path d={lineD(v, lat_line(0, -60, 340, 4))} fill="none" stroke="#fffbe8" strokeWidth="1.8" strokeDasharray="10 8" opacity="0.6"/>
      {belt > 0.01 && <BandB v={v} gid={GID} f={f} lat={lerp(12, 4, 1 - belt)} glow={0.5 * belt} op={belt}/>}
      {/* the cool western Pacific once the warm water has moved off east */}
      <ellipse cx={pt(145, -2)[0]} cy={pt(145, -2)[1]} rx={R * 0.14} ry={R * 0.1} fill="#2d7fb5" opacity={0.38 * cold} filter={`url(#${GID}-u22)`}/>
      {/* warm water: a soft red-orange tongue creeping east along the equator */}
      <path d={outer} fill="#e0301f" opacity={0.55 * clamp(spread * 6) * (0.4 + 0.6 * spread)} filter={`url(#${GID}-u22)`}/>
      <path d={mid} fill="#ee5326" opacity={0.7 * clamp(spread * 6) * (0.45 + 0.55 * spread)} filter={`url(#${GID}-u10)`}/>
      <path d={core} fill="#ffa845" opacity={clamp(spread * 6) * (0.6 + 0.1 * pulse)} filter={`url(#${GID}-u10)`}/>
      <path d={mid} fill="none" stroke="#ff9d6a" strokeWidth="2" strokeDasharray="3 7" opacity={0.5 * spread}/>
    </>}>
      <ArrowB gid={GID} id="pe1" pts={flowPts(v, [[148, 0.5], [185, 1.5], [232, 0.5], [270, -1.5]])} f={f} grow={eio(prog(f, tEn - 20, 170))} w={24} col={ARW.warm}/>
      {peru.c > 0.1 && spread > 0.85 && <g transform={`translate(${peru.x} ${peru.y})`} opacity={clamp((spread - 0.85) / 0.15)}>
        {[0, 1].map((k) => { const t = (f / 40 + k * 0.5) % 1; return <circle key={k} r={10 + t * 44} fill="none" stroke="#ff7a3a" strokeWidth={3 * (1 - t)} opacity={0.9 * (1 - t)}/>; })}
        <circle r={9} fill="#fff6dd" stroke="#8a2a14" strokeWidth="2.4"/><circle r={3.8} fill="#d8452a"/>
      </g>}
    </GlobeB>,
    tags,
  };
};

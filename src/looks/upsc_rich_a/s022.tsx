// Sample A, s022: the Indian Ocean. South-east trades cross the equator between 40 and 60 E and bend right onto India.
// Geography: public/datayt/long/upsc/basemap.json only (Natural Earth, India's official view, Andaman and Nicobar and Lakshadweep kept).
import React from "react";
import {AbsoluteFill} from "remotion";
import {lab} from "../cartoon/long/figs";
import {K, SANS, W, H, Finish, Tag, Puff, Motes, Orb, clamp, easeOut, easeIO, lerp, mix, pop, sstep, rnd} from "./rk";
import {BOXES, LandLayer, Ocean, Stream, catmull, mkView, type Pt} from "./mapkit";

// Lane control points in (lon, lat). Five main lanes cross the equator at 45-60 E and fan out to the west coast, outer lane furthest north.
const LANES: [number, number][][] = [
  [[70, -26], [62.5, -15], [52.5, -6.2], [45.5, 0], [47.8, 3.0], [50.6, 6.2], [54, 10], [58.5, 14.3], [64.5, 18.2], [69.5, 20.4], [73.6, 21.0]],
  [[78.5, -26], [66.5, -15.2], [56.8, -6], [49.2, 0], [50.4, 3.4], [53.8, 6.8], [58.5, 10.2], [64, 13.4], [69.5, 16], [74.4, 17.8]],
  [[87, -26], [70.5, -15.2], [60, -6], [53, 0], [54.6, 3.8], [58.4, 7], [63.2, 9.8], [68.5, 12.3], [73.2, 14.6], [75.4, 15.4]],
  [[95.5, -26], [74.5, -15.2], [63.5, -6], [56.5, 0], [58.5, 3.2], [62.5, 5.8], [67.5, 8], [72, 10.2], [76.2, 12.0]],
  [[104, -26], [78, -15.5], [67, -6], [59.8, 0], [62.4, 2.8], [66.8, 5], [71.4, 6.6], [75.5, 8.6], [77.6, 9.6]],
];
// Fainter lanes between the main ones (average of neighbours) and two outer ones, for fullness.
const between = (a: [number, number][], b: [number, number][]) => a.slice(0, Math.min(a.length, b.length)).map((p, i) => [(p[0] + b[i][0]) / 2, (p[1] + b[i][1]) / 2] as [number, number]);
const EXTRA = [between(LANES[0], LANES[1]), between(LANES[1], LANES[2]), between(LANES[2], LANES[3]), between(LANES[3], LANES[4])];

export const S022: React.FC<{f: number; dur: number; at: (k: string) => number}> = ({f, dur, at}) => {
  const b = BOXES.ocean, push = easeIO(f, 0, dur, 0, 1);
  const v = mkView(b, 1.3 + 0.06 * push, 62.5 - 1.6 * push + Math.sin(f / 170) * 0.5, 2.2 + Math.cos(f / 210) * 0.25, 960, 560);
  const P = v.P;
  const tEq = at("eq"), tTr = at("tr"), tCx = at("cx"), tBd = at("bd"), tEx = at("ex");
  const chaikin = (p: [number, number][], n = 2): [number, number][] => { let q = p; for (let k = 0; k < n; k++) { const o: [number, number][] = [q[0]]; for (let i = 0; i < q.length - 1; i++) { const a = q[i], b = q[i + 1]; o.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]); } o.push(q[q.length - 1]); q = o; } return q; };
  const mk = (pts: [number, number][]) => catmull(chaikin(pts).map(([lo, la]) => P(lo, la)), 6);
  const eq = P(0, 0).y;

  // equator: a glowing dashed line that draws from west to east
  const eqT = easeOut(f, tEq, tEq + 28), x0 = P(24, 0).x, x1 = P(112, 0).x;
  // crossing gate between 40 and 60 E
  const gT = easeOut(f, tCx, tCx + 22), gl = P(40, 8).x, gr = P(60, 8).x, gh = (P(0, 8).y - P(0, -8).y) / 2 * gT;
  // streams: first to the equator, then bend onto India
  const lane = (pts: [number, number][], i: number, w: number, o: number) => {
    const c = mk(pts);
    // length at the equator crossing
    let sCross = 0; for (let j = 0; j < c.pts.length; j++) if (c.pts[j].y >= eq) sCross = c.len[j];
    const a = easeOut(f, tTr + i * 3, tTr + 44 + i * 3), bnd = easeIO(f, tBd + i * 3, tBd + 52 + i * 3);
    const s = lerp(0, sCross, a) + (c.total - sCross) * bnd;
    return <Stream key={`${i}-${w}`} curve={c} s={s} f={f} w={w} c0="#7DEAE0" c1="#FFB547" id={`s22-${i}-${w}`} split={sCross / c.total} o={o} speed={2.6} gap={86}/>;
  };
  const clouds = [[73.2, 21.4, 0.62], [71.4, 17.0, 0.74], [72.9, 13.2, 0.66], [74.3, 9.8, 0.58], [70.2, 20.2, 0.5], [71.8, 10.8, 0.5]] as const;
  const rainT = easeOut(f, tEx - 4, tEx + 30);
  const rr = rnd(8);
  const nm = (txt: string, lon: number, lat: number, size = 34, o = 0.5, sp = 10) => { const p = P(lon, lat);
    return <text key={txt} x={p.x} y={p.y} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={size} letterSpacing={sp} fill="#fff" opacity={o}>{txt}</text>; };

  return <AbsoluteFill style={{background: K.night}}>
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
      <Ocean f={f} b={b} v={v} id="s22o" warmX={1450} warmY={330} warm={0.5 + 0.5 * sstep(tBd, tEx, f)}/>
      <LandLayer b={b} v={v} f={f} id="s22l" indiaHeat={0.55} landA="#4156BE" landB="#1E2E7E"/>
      {/* names */}
      {nm("AFRICA", 25, 4, 38, 0.38, 14)}{nm("INDIA", 78.2, 18.2, 44, 0.66, 18)}{nm("INDIAN OCEAN", 88, -6.5, 34, 0.38, 12)}
      {/* equator */}
      <g opacity={eqT}>
        <line x1={x0} y1={eq} x2={lerp(x0, x1, eqT)} y2={eq} stroke="#fff" strokeWidth={14} opacity={0.12} strokeLinecap="round"/>
        <line x1={x0} y1={eq} x2={lerp(x0, x1, eqT)} y2={eq} stroke={K.yellowL} strokeWidth={4.5} strokeDasharray="26 16" strokeDashoffset={-f * 1.2} strokeLinecap="round" opacity={0.9}/>
      </g>
      {/* crossing gate, 40 to 60 E */}
      {gT > 0.01 && <g>
        <defs><linearGradient id="s22g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.yellow} stopOpacity={0}/><stop offset="0.5" stopColor={K.yellow} stopOpacity={0.2 + 0.05 * Math.sin(f / 14)}/><stop offset="1" stopColor={K.yellow} stopOpacity={0}/></linearGradient></defs>
        <rect x={gl} y={eq - gh} width={gr - gl} height={gh * 2} fill="url(#s22g)"/>
        {[gl, gr].map((x) => <g key={x}><line x1={x} y1={eq - gh} x2={x} y2={eq + gh} stroke={K.yellow} strokeWidth={14} opacity={0.18}/><line x1={x} y1={eq - gh} x2={x} y2={eq + gh} stroke={K.yellowL} strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={-f * 0.8} opacity={0.95}/></g>)}
      </g>}
      {/* streams: faint ones first, main lanes on top */}
      {EXTRA.map((l, i) => lane(l, i + 5, 4, 0.5))}
      {LANES.map((l, i) => lane(l, i, 8, 1))}
      {/* the monsoon arrives: clouds and rain off the west coast */}
      {rainT > 0.01 && clouds.map(([lo, la, s], i) => { const p = P(lo, la), q = pop(f, tEx + i * 3, 110), drift = Math.sin(f / 50 + i) * 6;
        return <g key={i} opacity={rainT}>
          {Array.from({length: 7}, (_, j) => { const rx = (rr() - 0.5) * 150 * s * 1.3, ph = (f * 0.07 + j * 0.37 + i * 0.2) % 1;
            return <line key={j} x1={p.x + rx - ph * 10} y1={p.y + 10 + ph * 60} x2={p.x + rx - ph * 10 - 6} y2={p.y + 28 + ph * 60} stroke={K.tealL} strokeWidth={3} strokeLinecap="round" opacity={0.7 * (1 - ph)}/>; })}
          <Puff x={p.x + drift} y={p.y - 6} s={s * q * 0.9} c="#EDE6FA"/>
        </g>; })}
      <Motes f={f} n={36} seed={5} box={[0, 60, W, 1030]} c={K.tealL} r={[1.2, 3]} vx={0.2} vy={-0.08} o={0.5} glow/>
      <Orb x={P(76, 17).x} y={P(76, 17).y} r={380} c={K.orange} o={0.12 + 0.1 * sstep(tBd, tEx, f)}/>
    </svg>
    {/* labels */}
    <Tag text="EQUATOR" f={f} at={tEq + 10} x={P(84, 0).x} y={eq - 44} color={K.yellowL} size={34}/>
    <Tag text="SE TRADES" f={f} at={tTr + 8} x={P(97, -15).x} y={P(97, -15).y} color="#7DEAE0" size={36} fadeAt={tEx - 6}/>
    <Tag text="BENDS RIGHT" f={f} at={tBd + 6} x={P(45.5, 11).x} y={P(45.5, 11).y} color={K.orangeL} size={34} fadeAt={tEx - 6}/>
    {f >= tCx && <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}><line x1={P(31, -3.4).x + 118} y1={P(31, -3.4).y} x2={lerp(P(31, -3.4).x + 118, gl, easeOut(f, tCx + 4, tCx + 18))} y2={P(31, -3.4).y} stroke={K.yellow} strokeWidth={4} strokeLinecap="round" opacity={0.9}/></svg>
      <Tag text={lab("cross")} f={f} at={tCx} x={P(31, -3.4).x} y={P(31, -3.4).y} color={K.yellow} size={58}/></>}
    <Tag text="SE TRADES → SW MONSOON" f={f} at={tEx} x={640} y={872} color={K.orange} size={40}/>
    <Finish/>
  </AbsoluteFill>;
};

// Look B "globe" mode hadley: a painted cross-section over the rain belt (sea at the bottom, a tall cloud tower at the middle, the
// tropopause as a hazy lid), with the circulation loop on both sides and a small globe showing where the slice is cut.
import React from "react";
import {eio, prog, rng} from "../kit";
import {ARW, ArrowB, BandB, GlobeB, TowerB, smooth, type View} from "./globe_b";
import type {Ctx, Out, TagSpec} from "./globe";
import {tagBox} from "./globe_b";

const GID = "gb";
const gy = (x: number) => 690 + 110 * Math.pow((x - 960) / 780, 2);
const lid = (x: number) => 236 + 50 * Math.pow((x - 960) / 780, 2);
const mirror = (a: [number, number][]) => a.map(([x, y]) => [1920 - x, y] as [number, number]);
const xs = Array.from({length: 48}, (_, i) => 110 + i * (1700 / 47));
const groundD = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(0)} ${gy(x).toFixed(1)}`).join("");
const lidD = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(0)} ${lid(x).toFixed(1)}`).join("");

export const HadleyMode = ({f, L}: Ctx): Out => {
  const tR = L[0] ? L[0].t0 - 6 : 20, tS = L[1] ? L[1].t0 - 6 : 70, tT = L[2] ? L[2].t0 - 6 : 110, tP = Math.min(tR + 16, tS - 4);
  const g = (t: number, n = 30) => eio(prog(f, t, n));
  const v: View = {cx: 250, cy: 316, R: 96, lon0: 78, lat0: 0};
  const rise: [number, number][] = [[1082, 655], [1082, 560], [1082, 440], [1082, 335]];
  const pole = smooth([[1112, 296], [1220, 292], [1380, 294], [1470, 304], [1500, 338]], 10);
  const sink: [number, number][] = [[1500, 352], [1500, 450], [1500, 560], [1500, 642]];
  const back = smooth([[1470, 692], [1320, 674], [1190, 660], [1120, 648]], 10);
  const cell = (mir: boolean, k: string) => {
    const m = (a: [number, number][]) => (mir ? mirror(a) : a);
    return <g key={k}>
      <ArrowB gid={GID} id={`h${k}b`} pts={m(back)} f={f} grow={g(tT, 40)} w={20} col={ARW.back}/>
      <ArrowB gid={GID} id={`h${k}s`} pts={m(sink)} f={f} grow={g(tS)} w={22} col={ARW.sink}/>
      <ArrowB gid={GID} id={`h${k}p`} pts={m(pole)} f={f} grow={g(tP, 40)} w={20} col={ARW.pole}/>
      <ArrowB gid={GID} id={`h${k}r`} pts={m(rise)} f={f} grow={g(tR)} w={22} col={ARW.rise}/>
    </g>;
  };
  const wr = rng(41);
  const waves = Array.from({length: 22}, (_, i) => { const r = wr, x = 130 + r() * 1660; return {x, y: gy(x) + 14 + r() * 70, l: 30 + r() * 40, p: r() * 6.28}; });
  const shimmer = 0.5 + 0.5 * Math.sin(f / 18);
  const tags: TagSpec[] = [];
  if (L[0]) tags.push({text: L[0].text, t0: L[0].t0, box: tagBox(L[0].text, 960, 184, "c", 38, 900), to: [960, 292], dot: "#c93a1c"});
  if (L[1]) tags.push({text: L[1].text, t0: L[1].t0, box: tagBox(L[1].text, 1255, 470, "c", 38, 430), to: [1500, 470], dot: "#2a62b4"});
  if (L[2]) tags.push({text: L[2].text, t0: L[2].t0, box: tagBox(L[2].text, 1215, 810, "c", 38), to: [1215, 664], dot: "#e8a21c"});
  tags.push(...L.slice(3).map((l, i) => ({text: l.text, t0: l.t0, box: tagBox(l.text, 960, 868 - i * 84)})));
  return {
    bd: null,
    svg: <g>
      <defs>
        <clipPath id="hd-clip"><rect x={110} y={125} width={1700} height={765} rx={44}/></clipPath>
        <linearGradient id="hd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fa8d8"/><stop offset="0.35" stopColor="#a9d0ea"/><stop offset="0.72" stopColor="#dcedf1"/><stop offset="1" stopColor="#fbf0d4"/></linearGradient>
        <linearGradient id="hd-lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" stopOpacity="0"/><stop offset="0.45" stopColor="#f3f8fd" stopOpacity="0.5"/><stop offset="1" stopColor="#e9f2fa" stopOpacity="0"/></linearGradient>
        <linearGradient id="hd-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#58b6c8"/><stop offset="0.3" stopColor="#2f8db5"/><stop offset="0.7" stopColor="#1f5f99"/><stop offset="1" stopColor="#163e72"/></linearGradient>
        <radialGradient id="hd-heat" cx="0.5" cy="1" r="0.6"><stop offset="0" stopColor="#ffb257" stopOpacity="0.6"/><stop offset="1" stopColor="#ffb257" stopOpacity="0"/></radialGradient>
        <linearGradient id="hd-frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff7e2"/><stop offset="1" stopColor="#e9d3a4"/></linearGradient>
      </defs>
      {/* the picture frame: a paper mount with a long soft shadow */}
      <rect x={118} y={146} width={1700} height={765} rx={44} fill="#5a3a1a" opacity="0.28" filter="url(#gb-b14)"/>
      <rect x={98} y={113} width={1724} height={789} rx={52} fill="url(#hd-frame)" stroke="#b98d52" strokeWidth="1.4"/>
      <g clipPath="url(#hd-clip)">
        <rect x={110} y={125} width={1700} height={765} fill="url(#hd-sky)"/>
        <circle cx={1640} cy={190} r={330} fill="#fff3c8" opacity="0.5" filter="url(#gb-b14)"/>
        <circle cx={1640} cy={190} r={46} fill="#fff6d0" opacity="0.9" filter="url(#gb-b8)"/>
        {/* far, pale cloud banks (depth) */}
        {[[250, 700], [560, 740], [1380, 720], [1700, 745], [400, 520], [1560, 560], [700, 380]].map(([x, y], i) => <g key={i} transform={`translate(${x + 8 * Math.sin(f / 90 + i)} ${y}) scale(${1.1 + 0.2 * i})`} opacity="0.35" filter="url(#gb-b8)">
          {[-60, -20, 25, 65].map((dx, k) => <ellipse key={k} cx={dx} cy={k % 2 ? -8 : 0} rx={40} ry={22} fill="#fff"/>)}</g>)}
        {/* the lid: the tropopause as a hazy ceiling */}
        <path d={`${lidD}L1810 125L110 125Z`} fill="#4f86bd" opacity="0.5"/>
        <path d={`${lidD}L1810 ${lid(1810) + 60}`} fill="none"/>
        <path d={`${lidD}L1810 ${lid(1810) + 70}L110 ${lid(110) + 70}Z`} fill="url(#hd-lid)"/>
        <path d={lidD} fill="none" stroke="#f4f9ff" strokeWidth="3" opacity="0.9"/>
        <path d={lidD} fill="none" stroke="#8fb6dc" strokeWidth="1.4" transform="translate(0 4)" opacity="0.8"/>
        {/* the sea */}
        <path d={`${groundD}L1810 890L110 890Z`} fill="url(#hd-sea)"/>
        <ellipse cx={960} cy={gy(960) + 30} rx={520} ry={90} fill="url(#hd-heat)" opacity={0.7 + 0.3 * shimmer} style={{mixBlendMode: "screen"}}/>
        {waves.map((w, i) => <path key={i} d={`M${w.x},${w.y + 1.5 * Math.sin(f / 22 + w.p)} q${w.l / 4},-5 ${w.l / 2},0 t${w.l / 2},0`} stroke="#eaffff" strokeWidth="1.6" fill="none" opacity="0.3" strokeLinecap="round"/>)}
        <path d={groundD} fill="none" stroke="#e8fff6" strokeWidth="3" opacity="0.8"/>
        <path d={groundD} fill="none" stroke="#b9f2e2" strokeWidth="10" opacity="0.28" filter="url(#gb-u4)"/>
        {/* the tower and its neighbours */}
        <TowerB gid={GID} x={960} y={650} h={350} w={84} g={eio(prog(f, tR, 80))} seed={3}/>
        {[[690, 0.7], [1240, 0.78]].map(([x, s], i) => <g key={i} transform={`translate(${x} ${gy(x) - 78}) scale(${s * 0.62})`} opacity="0.95" filter="url(#gb-b3)">
          {[-90, -40, 10, 60, 100].map((dx, k) => <ellipse key={k} cx={dx} cy={k % 2 ? -12 : 4} rx={46} ry={30} fill={k % 2 ? "#fafcff" : "#e8f0f8"}/>)}</g>)}
        {cell(false, "r")}{cell(true, "l")}
      </g>
      <rect x={110} y={125} width={1700} height={765} rx={44} fill="none" stroke="#fff7e2" strokeWidth="2" opacity="0.8"/>
      {/* where the slice is cut: a small globe with the belt and the cut line */}
      <circle cx={v.cx} cy={v.cy} r={v.R + 14} fill="#fff7e2" opacity="0.85"/>
      <circle cx={v.cx} cy={v.cy} r={v.R + 14} fill="none" stroke="#b98d52" strokeWidth="1.4"/>
      <GlobeB v={v} id="gH" f={f} under={<BandB v={v} gid={GID} f={f} lat={1} glow={1} size={0.0011}/>}>
        <line x1={v.cx} y1={v.cy - v.R - 12} x2={v.cx} y2={v.cy + v.R + 12} stroke="#d8452a" strokeWidth="3.4" strokeDasharray="10 7" strokeLinecap="round"/>
      </GlobeB>
    </g>,
    tags,
  };
};

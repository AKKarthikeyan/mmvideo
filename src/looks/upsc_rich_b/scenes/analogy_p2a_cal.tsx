// Part 2 analogy "calendar-flip": a wall calendar page for the first label flips to the page of the second. The day number and month are read
// out of the label text (nothing typed); the page is blank until its label arrives.
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {LabelCard} from "./analogy_kit";
import {items, type Item} from "./analogy_p2a_parts";

const CX = 960, TOP = 112, PW = 560, PH = 640; // page frame
const day = (t: string) => (/(\d+)\s+[A-Za-z]+/.exec(t) ?? [, ""])[1] as string;
const month = (t: string) => ((/\d+\s+([A-Za-z]+)/.exec(t) ?? [, "July"])[1] as string).toUpperCase();

const Page: React.FC<{it?: Item; f: number; hl: number; n?: number}> = ({it, f, hl}) => {
  const a = it ? eo(prog(f, it.at, 12)) : 0, mon = it ? month(it.text) : "JULY";
  return (
    <g>
      <rect x={CX - PW / 2} y={TOP} width={PW} height={PH} rx={10} fill="#fffaf0" stroke="#cdb996" strokeWidth={2}/>
      <path d={`M${CX - PW / 2},${TOP + 10} Q${CX - PW / 2},${TOP} ${CX - PW / 2 + 10},${TOP} H${CX + PW / 2 - 10} Q${CX + PW / 2},${TOP} ${CX + PW / 2},${TOP + 10} V${TOP + 118} H${CX - PW / 2} Z`} fill="#b8452a"/>
      <rect x={CX - PW / 2} y={TOP + 104} width={PW} height={14} fill="#8c2f1a" opacity={0.55}/>
      <text x={CX} y={TOP + 82} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={50} letterSpacing={14} fill="#fff3dc">{mon}</text>
      {Array.from({length: 5}, (_, i) => <line key={i} x1={CX - PW / 2 + 40} x2={CX + PW / 2 - 40} y1={TOP + 470 + i * 28} y2={TOP + 470 + i * 28} stroke="#cfc0a4" strokeWidth={1.4} opacity={0.55}/>)}
      {it && <text x={CX} y={TOP + 382} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={250} fill="#2f2013" opacity={a} transform={`translate(0 ${(1 - a) * 18})`}>{day(it.text)}</text>}
      {it && hl > 0 && (
        <path d={`M${CX - 190},${TOP + 300} C${CX - 210},${TOP + 190} ${CX - 40},${TOP + 150} ${CX + 120},${TOP + 170} C${CX + 250},${TOP + 190} ${CX + 270},${TOP + 330} ${CX + 120},${TOP + 372} C${CX - 40},${TOP + 410} ${CX - 200},${TOP + 380} ${CX - 196},${TOP + 270}`}
          fill="none" stroke="#c8301c" strokeWidth={9} strokeLinecap="round" strokeDasharray={1500} strokeDashoffset={1500 * (1 - hl)} opacity={0.85}/>
      )}
    </g>
  );
};

export const CalendarArt: React.FC<AP> = (p) => {
  const {f, dur} = p, its = items(p), a = its[0], b = its[1];
  const fs = b ? Math.max(0, b.at - 6) : 1e9, fd = Math.min(18, Math.max(6, dur - fs - 2)), u = clamp((f - fs) / fd), th = eio(u) * Math.PI;
  const front = u < 0.5, sy = Math.abs(Math.cos(th));
  const hl1 = a ? eo(prog(f, a.at + 4, 26)) * (1 - eo(prog(f, fs, 6))) : 0, hl2 = b ? eo(prog(f, b.at + 8, 26)) : 0;
  const hingeY = TOP + 8, sway = Math.sin(f / 37) * 0.35;
  return (
    <g transform={`rotate(${sway} ${CX} 60)`}>
      <defs>
        <linearGradient id="p2cal-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3e3c2"/><stop offset="1" stopColor="#dcc08c"/></linearGradient>
        <linearGradient id="p2cal-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fc4e8"/><stop offset="1" stopColor="#d8e8e8"/></linearGradient>
        <linearGradient id="p2cal-sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a1808" stopOpacity="0.5"/><stop offset="1" stopColor="#2a1808" stopOpacity="0"/></linearGradient>
        <linearGradient id="p2cal-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b98450"/><stop offset="1" stopColor="#7e5028"/></linearGradient>
      </defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#p2cal-wall)"/>
      {Array.from({length: 24}, (_, i) => <line key={i} x1={i * 90 - 30} x2={i * 90 - 30} y1={-60} y2={H + 60} stroke="#b89a64" strokeWidth={1.4} opacity={0.2}/>)}
      {/* window with monsoon light on the left */}
      <g>
        <rect x={140} y={170} width={300} height={430} rx={8} fill="#6e4a28" />
        <rect x={156} y={186} width={268} height={398} fill="url(#p2cal-win)"/>
        <ellipse cx={250} cy={300} rx={70} ry={26} fill="#fff" opacity={0.9}/><ellipse cx={330} cy={270} rx={60} ry={22} fill="#fff" opacity={0.85}/>
        <path d="M156,500 Q290,450 424,500 V584 H156 Z" fill="#6fa35a"/><path d="M156,540 Q300,500 424,540 V584 H156 Z" fill="#4c8a48"/>
        <line x1={290} x2={290} y1={186} y2={584} stroke="#6e4a28" strokeWidth={8}/><line x1={156} x2={424} y1={380} y2={380} stroke="#6e4a28" strokeWidth={8}/>
        <path d="M440,190 L700,700 L440,700 Z" fill="#fff4cc" opacity={0.2} style={{mixBlendMode: "screen"}}/>
      </g>
      {/* shelf with a pot plant on the right */}
      <rect x={1440} y={640} width={360} height={22} rx={5} fill="url(#p2cal-wood)"/>
      <ellipse cx={1620} cy={666} rx={150} ry={10} fill="#2a1808" opacity={0.25}/>
      <path d="M1580,640 L1594,572 H1648 L1662,640 Z" fill="#b5552f" stroke="#7e3418" strokeWidth={2}/>
      {[-60, -26, 6, 40, 70].map((d, i) => <path key={i} d={`M${1621},572 Q${1621 + d * 1.2},${510 - (i % 2) * 36} ${1621 + d * 1.7},${470 + (i % 3) * 18} Q${1621 + d * 0.7},${520} 1621,572 Z`} fill={i % 2 ? "#4c8a48" : "#6fa35a"} stroke="#2f6232" strokeWidth={1.4} transform={`rotate(${Math.sin(f / 30 + i) * 1.4} 1621 572)`}/>)}
      {/* calendar */}
      <rect x={CX - PW / 2 + 16} y={TOP + 24} width={PW} height={PH + 40} rx={14} fill="#2a1808" opacity={0.3} filter="url(#ak-blur22)"/>
      <rect x={CX - PW / 2 - 14} y={TOP - 10} width={PW + 28} height={PH + 36} rx={16} fill="#6b4524" stroke="#3f2810" strokeWidth={2}/>
      <Page it={a} f={f} hl={hl1}/>
      {b && (
        <g>
          {/* the next page, waiting underneath, is revealed as the top page folds up over the hinge */}
          <g opacity={u > 0 ? 1 : 0}><Page it={b} f={f} hl={hl2}/></g>
        </g>
      )}
      {/* flipping page */}
      {b && u < 1 && (
        <g transform={`translate(0 ${hingeY}) scale(1 ${front ? sy : -sy}) translate(0 ${-hingeY})`} opacity={1}>
          {front ? <Page it={a} f={f} hl={hl1}/> : <g><rect x={CX - PW / 2} y={TOP} width={PW} height={PH} rx={10} fill="#efe3c8" stroke="#cdb996" strokeWidth={2}/><rect x={CX - PW / 2} y={TOP} width={PW} height={PH} rx={10} fill="url(#p2cal-sh)" opacity={0.5}/></g>}
        </g>
      )}
      {b && u > 0 && u < 1 && <rect x={CX - PW / 2} y={TOP + 8} width={PW} height={PH - 8} rx={10} fill="url(#p2cal-sh)" opacity={0.5 * (1 - u)}/>}
      {/* binder rings */}
      {Array.from({length: 7}, (_, i) => <g key={i}><rect x={CX - PW / 2 + 40 + i * ((PW - 80) / 6) - 6} y={TOP - 18} width={12} height={42} rx={6} fill="#c3ccd4" stroke="#6d7780" strokeWidth={1.6}/><circle cx={CX - PW / 2 + 40 + i * ((PW - 80) / 6)} cy={TOP + 8} r={5} fill="#3b444c"/></g>)}
      <path d={`M${CX - 30},${TOP - 24} L${CX},${TOP - 70} L${CX + 30},${TOP - 24}`} fill="none" stroke="#6d7780" strokeWidth={4}/>
      <circle cx={CX} cy={TOP - 76} r={8} fill="#7d8791" stroke="#3b444c" strokeWidth={2}/>
    </g>
  );
};

export const CalendarLabels: React.FC<AP> = (p) => {
  const its = items(p);
  return (
    <>
      {its[0] && <LabelCard cx={500} y={770} text={its[0].text} f={p.f} at={its[0].at} size={34} maxW={760} tone="cool"/>}
      {its[1] && <LabelCard cx={1420} y={770} text={its[1].text} f={p.f} at={its[1].at} size={34} maxW={760}/>}
    </>
  );
};

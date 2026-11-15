// Look B "notebook" scene: a big lined notebook on a walnut desk in warm window light, the girl small at one side holding a pencil.
// Each line is written on from its at(key): a clip that ends wider than the measured text (so nothing is ever cut), with the pencil riding the front.
// `strike` is already written at the top and is struck through in red pencil at at(strike.key). Text only: no figure is printed here.
import React, {useMemo} from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../../cartoon/long/contract";
import {Girl} from "../girl";
import {H, PaperFinish, W, clamp, eio, eo, prog, rng} from "../kit";
import {SERIF_FONT, textW, wrapLines} from "./stage_ui";

export type NotebookSpec = {who: string; lines: {text: string; key: string}[]; strike?: {text: string; key: string}};

const PAGE = {x: 110, y: 132, w: 1480, h: 788};            // ends at y 920, above the caption strip; right edge clear of the brand bug
const TEXT_X = PAGE.x + 190, TEXT_MAX = (PAGE.x + PAGE.w - 70 - TEXT_X) * 0.94;   // a margin on the right: the wrap never reaches the page edge
const INK = "#1d2f5c", RED = "#c0392b", FONT = SERIF_FONT(500);
const ital = (px: number) => `italic ${FONT.replace("{px}", String(px))}`;
const FAM = "'RB Newsreader', Georgia, serif";

type Row = {text: string; y: number; t0: number; t1: number; w: number; jx: number; rot: number};

const Desk: React.FC<{f: number}> = ({f}) => {
  const grain = useMemo(() => { const r = rng(3); return Array.from({length: 54}).map(() => ({y: r() * 1100, a: r() * 60 - 30, w: 300 + r() * 1400, x: r() * 2000 - 200, o: 0.05 + r() * 0.12})); }, []);
  return (
    <g>
      <defs>
        <linearGradient id="nb-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a8703e"/><stop offset="0.5" stopColor="#8f5a30"/><stop offset="1" stopColor="#6f4426"/></linearGradient>
        <linearGradient id="nb-paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf3"/><stop offset="1" stopColor="#f6edd6"/></linearGradient>
        <radialGradient id="nb-light" cx="0.2" cy="0.1" r="0.9"><stop offset="0" stopColor="#ffe7ae" stopOpacity="0.55"/><stop offset="1" stopColor="#ffe7ae" stopOpacity="0"/></radialGradient>
        <filter id="nb-b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="nb-b3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <rect x="-60" y="-60" width={W + 120} height={H + 120} fill="url(#nb-wood)"/>
      {Array.from({length: 7}).map((_, i) => <path key={i} d={`M-60,${i * 170 + 30} H${W + 60}`} stroke="#4a2c14" strokeWidth="3" opacity="0.5"/>)}
      {grain.map((g, i) => <path key={i} d={`M${g.x},${g.y} q${g.w / 2},${g.a} ${g.w},${g.a * 0.3}`} stroke={i % 2 ? "#4a2c14" : "#c18a52"} strokeWidth={1 + (i % 3)} fill="none" opacity={g.o}/>)}
      <rect x="-60" y="-60" width={W + 120} height={H + 120} fill="url(#nb-light)"/>
      <polygon points="-60,-60 520,-60 1100,1140 420,1140" fill="#fff0c0" opacity="0.09" filter="url(#nb-b)"/>
      {/* a giant tea glass and pencil: the girl is small on a big desk */}
      <g transform="translate(1790 250)"><ellipse cx="14" cy="104" rx="84" ry="16" fill="#2a160a" opacity="0.4" filter="url(#nb-b3)"/>
        <path d="M-52,-72 L52,-72 L40,100 L-40,100 Z" fill="#f2c58a" opacity="0.92" stroke="#7a4a1c" strokeWidth="2.4"/><path d="M-50,-72 L50,-72 L48,-60 L-48,-60 Z" fill="#fff3d6" opacity="0.9"/>
        <path d="M-40,-30 L40,-30 L36,40 L-36,40 Z" fill="#b8651e" opacity="0.5"/>
        {[0, 1, 2].map((i) => <path key={i} transform={`translate(${Math.sin(f / 24 + i * 2) * 8} ${-((f * 0.9 + i * 40) % 120)})`} d="M-6,-80 q-12,-20 0,-40 q12,-20 0,-40" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity={0.35 - ((f * 0.9 + i * 40) % 120) / 400}/>)}
      </g>
      <g transform="translate(1560 1010) rotate(-8)"><ellipse cx="170" cy="22" rx="250" ry="14" fill="#2a160a" opacity="0.35" filter="url(#nb-b3)"/>
        <rect x="0" y="-18" width="300" height="36" fill="#f0c230" stroke="#8a6212" strokeWidth="2"/><path d="M0,-6 H300 M0,6 H300" stroke="#c99a1a" strokeWidth="2"/><path d="M0,-18 l-56,18 l56,18 Z" fill="#f3d9a8" stroke="#8a6212" strokeWidth="2"/><path d="M-36,0 l-20,0" stroke="#333" strokeWidth="6"/>
        <rect x="300" y="-18" width="30" height="36" fill="#b9c4cc" stroke="#6a7a86" strokeWidth="2"/><rect x="330" y="-18" width="52" height="36" rx="12" fill="#e8808f" stroke="#9a3a4a" strokeWidth="2"/></g>
    </g>
  );
};

export const Scene: React.FC<SceneProps<NotebookSpec>> = ({f, dur, spec, at}) => {
  if (spec.who !== "girl") throw new Error(`notebook (look B): unknown who "${spec.who}" (only "girl")`);
  if (!spec.lines?.length) throw new Error("notebook: needs at least one line");
  const sk = spec.strike, skAt = sk ? at(sk.key) : 0, times = spec.lines.map((l) => at(l.key));

  // font size: the biggest (74 down to 34 px) at which every wrapped line fits on the page
  let size = 74, rows: string[][] = [];
  for (; size >= 34; size -= 2) {
    rows = spec.lines.map((l) => wrapLines(l.text, ital(size), size, TEXT_MAX));
    const n = rows.reduce((a, r) => a + r.length, 0) + (sk ? 1 : 0);
    if (n * size * 1.4 + size * 0.3 * spec.lines.length <= PAGE.h - 124 - 60) break;
  }
  const pitch = size * 1.4, TOP = PAGE.y + 112;

  const layout: Row[] = [];
  let y = TOP + (sk ? pitch : 0);
  spec.lines.forEach((_, i) => {
    const rs = rows[i], chars = rs.reduce((a, r) => a + r.length, 0) || 1;
    const span = Math.min(78, Math.max(16, Math.min(i + 1 < times.length ? times[i + 1] - times[i] - 6 : 66, dur - 6 - times[i])));
    let acc = 0;
    rs.forEach((text, k) => { layout.push({text, y: y + k * pitch, t0: times[i] + (span * acc) / chars, t1: times[i] + (span * (acc + text.length)) / chars, w: textW(text, ital(size), size), jx: Math.sin(i * 3.1 + k) * 1.5, rot: Math.sin(i * 5.3 + k * 2) * 0.28}); acc += text.length; });
    y += rs.length * pitch + size * 0.3;
  });
  const active = layout.find((r) => f >= r.t0 && f <= r.t1 + 6);
  const enter = eo(prog(f, 0, 14)), push = 1 + 0.018 * eio(clamp(f / dur));
  const cx = PAGE.x + PAGE.w / 2, cy = PAGE.y + PAGE.h / 2;
  const fillOf = (r: Row) => clamp((f - r.t0) / Math.max(4, r.t1 - r.t0));
  const wob = Math.sin(f * 0.9) * 2;
  const pencil = active ? {x: TEXT_X + active.jx + (active.w + 8) * eo(fillOf(active)), y: active.y} : null;
  const strikeW = sk ? textW(sk.text, ital(size), size) : 0;
  const nRuled = Math.floor((PAGE.y + PAGE.h - 20 - (TOP - pitch + 14)) / pitch) + 1;

  return (
    <AbsoluteFill style={{background: "#6f4426"}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", inset: 0}}>
        <Desk f={f}/>
        <g transform={`translate(${cx} ${cy}) scale(${push}) translate(${-cx} ${-cy})`}>
          <g transform={`translate(${cx} ${cy}) scale(${0.94 + 0.06 * enter}) rotate(${-0.9 * enter}) translate(${-cx} ${-cy})`} opacity={clamp(enter * 1.5)}>
            {/* notebook: shadow, cover, page stack, page */}
            <rect x={PAGE.x - 6} y={PAGE.y + 26} width={PAGE.w + 30} height={PAGE.h + 20} rx="26" fill="#1c0e05" opacity="0.5" filter="url(#nb-b)"/>
            <rect x={PAGE.x - 34} y={PAGE.y - 22} width={PAGE.w + 62} height={PAGE.h + 50} rx="30" fill="#1f4a5e" stroke="#0f2a36" strokeWidth="3"/>
            <rect x={PAGE.x - 34} y={PAGE.y - 22} width={PAGE.w + 62} height={PAGE.h + 50} rx="30" fill="none" stroke="#5fa0b8" strokeWidth="2" opacity="0.4"/>
            {[14, 9, 4].map((o, i) => <rect key={i} x={PAGE.x + o * 0.4} y={PAGE.y + o * 0.9} width={PAGE.w} height={PAGE.h} rx="18" fill={i % 2 ? "#efe3c6" : "#f6ecd2"} stroke="#b9a77c" strokeWidth="1.2"/>)}
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} rx="18" fill="url(#nb-paper)" stroke="#b9a77c" strokeWidth="1.6"/>
            <path d={`M${PAGE.x + 20},${PAGE.y + 4} H${PAGE.x + PAGE.w - 20}`} stroke="#fff" strokeWidth="2" opacity="0.8"/>
            {Array.from({length: nRuled}).map((_, i) => { const yy = TOP - pitch + 14 + i * pitch; return <path key={i} d={`M${PAGE.x + 18},${yy} H${PAGE.x + PAGE.w - 22}`} stroke="#9fc3e6" strokeWidth="1.8" opacity="0.7"/>; })}
            <path d={`M${PAGE.x + 148},${PAGE.y + 6} V${PAGE.y + PAGE.h - 6}`} stroke="#e58a8a" strokeWidth="2.4" opacity="0.8"/>
            {Array.from({length: 11}).map((_, i) => { const yy = PAGE.y + 58 + i * 68; return <g key={i}><ellipse cx={PAGE.x + 46} cy={yy} rx="12" ry="10" fill="#3a3a44" stroke="#14141a" strokeWidth="1.6"/><ellipse cx={PAGE.x + 46} cy={yy - 2} rx="5" ry="3.5" fill="#6d6d78"/>
              <path d={`M${PAGE.x - 24},${yy - 8} Q${PAGE.x + 10},${yy - 22} ${PAGE.x + 52},${yy - 4}`} stroke="#c9ced6" strokeWidth="9" strokeLinecap="round" fill="none"/><path d={`M${PAGE.x - 24},${yy - 8} Q${PAGE.x + 10},${yy - 22} ${PAGE.x + 52},${yy - 4}`} stroke="#6b707a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/></g>; })}
            {/* the struck line: written already, struck through in red at its key */}
            {sk && <g>
              <text x={TEXT_X} y={TOP} fontFamily={FAM} fontStyle="italic" fontWeight={500} fontSize={size} fill={INK}>{sk.text}</text>
              {f >= skAt && (() => { const k = eo(prog(f, skAt, 10)), x1 = TEXT_X - 14, x2 = TEXT_X + strikeW + 16, yy = TOP - size * 0.3;
                return <path d={`M${x1},${yy + 4} Q${(x1 + x2) / 2},${yy - 12} ${x1 + (x2 - x1) * k},${yy + 2 - 10 * k}`} fill="none" stroke={RED} strokeWidth="7" strokeLinecap="round" opacity="0.92"/>; })()}
            </g>}
            {layout.map((r, i) => {
              if (f < r.t0) return null;
              const k = eo(fillOf(r)), clipW = k >= 1 ? PAGE.w : (r.w + size * 0.9) * k;   // the clip always ends wider than the text
              return <g key={i} transform={`rotate(${r.rot} ${TEXT_X} ${r.y})`}>
                <clipPath id={`nbc-${i}`}><rect x={TEXT_X + r.jx - 20} y={r.y - size * 1.1} width={clipW + 20} height={size * 1.7}/></clipPath>
                <text x={TEXT_X + r.jx} y={r.y} fontFamily={FAM} fontStyle="italic" fontWeight={500} fontSize={size} fill={INK} clipPath={`url(#nbc-${i})`}>{r.text}</text>
              </g>;
            })}
            {/* the pencil, tip on the writing front */}
            {pencil && <g transform={`translate(${pencil.x + 5} ${pencil.y - 2 + wob}) rotate(34) scale(0.8)`}>
              <path d="M0,0 L40,-12 L40,12 Z" fill="#f3d9a8" stroke="#8a6212" strokeWidth="1.6" strokeLinejoin="round"/><path d="M0,0 L12,-3.6 L12,3.6 Z" fill="#3a3a3a"/>
              <rect x="40" y="-12" width="190" height="24" fill="#f0c230" stroke="#8a6212" strokeWidth="1.6"/><path d="M40,-4 H230 M40,4 H230" stroke="#c99a1a" strokeWidth="1.4"/>
              <rect x="230" y="-12" width="22" height="24" fill="#b9c4cc" stroke="#6a7a86" strokeWidth="1.6"/><rect x="252" y="-12" width="36" height="24" rx="9" fill="#e8808f" stroke="#9a3a4a" strokeWidth="1.6"/>
            </g>}
          </g>
        </g>
        {/* the girl, small, at the side, pencil in hand */}
        <g transform="translate(1735 962)"><ellipse cx="30" cy="4" rx="110" ry="16" fill="#1c0e05" opacity="0.4" filter="url(#nb-b3)"/>
          <g transform={`scale(${470 / 560})`}><Girl f={f} id="gnb" pose="write" talk={false}/></g></g>
      </svg>
      <PaperFinish id="nbpf" grain={0.5} vignette={0.4}/>
    </AbsoluteFill>
  );
};

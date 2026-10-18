// The furniture every global chart shares: header (mark, company, title, period chip), the DRAFT tag while any figure
// is unchecked, a caption bar for the current beat, and the source footer. Charts draw inside one SVG via children.
import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {G, GlobalFonts, Mark, SANS} from "./theme";

export const GFPS = 30;
export type Status = "verified" | "derived" | "check";
export type Beat = {sec: number; caption?: string; audio?: string};
export type Meta = {id: string; company: string; title: string; period: string; source: string; asOf: string; notes?: string[]};
// Money in the currency the company files in; `show` converts for display at a stated rate.
export type Money = {cur: string; unit?: string; decimals?: number; show?: {cur: string; rate: number}; tol?: number};

export const textW = (t: string, size: number) => t.length * size * 0.47;
export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
// A ground-coloured outline behind labels keeps text legible where it sits over a mark.
export const HALO: React.CSSProperties = {paintOrder: "stroke", stroke: G.bg, strokeWidth: 7, strokeLinejoin: "round"};

export const money = (M: Money, v: number, paren = false) => {
  const c = M.show ? M.show.cur : M.cur, x = M.show ? v / M.show.rate : v, s = `${c}${Math.abs(x).toFixed(M.decimals ?? 1)}${M.unit ?? ""}`;
  return paren ? `(${s})` : s;
};
export const filed = (M: Money, v: number) => `${M.cur}${Math.abs(v).toFixed(0)}${M.unit ?? ""}`;

export const timeline = (beats: Beat[], tail = 20) => {
  const starts: number[] = [];
  let t = 0;
  beats.forEach((b) => { starts.push(t); t += Math.round(b.sec * GFPS); });
  return {starts, total: t + tail};
};
export const beatAt = (starts: number[], f: number) => Math.max(0, starts.filter((s) => s <= f).length - 1);

export const assertChecks = (id: string, err: string[]) => {
  if (err.length) throw new Error(`Chart "${id}" does not reconcile:\n  ${err.join("\n  ")}`);
};

export const Frame: React.FC<{M: Meta; draft: number; beats: Beat[]; starts: number[]; children: React.ReactNode}> =
  ({M, draft, beats, starts, children}) => {
  const f = useCurrentFrame(), {width: W, height: H} = useVideoConfig();
  const cap = beats[beatAt(starts, f)]?.caption;
  const tag = `DRAFT · ${draft} FIGURE${draft > 1 ? "S" : ""} TO CHECK AGAINST THE FILING`, tw = textW(tag, 22) + 40;
  return (
    <AbsoluteFill style={{background: G.bg}}>
      <GlobalFonts/>
      {beats.map((b, i) => b.audio ? <Sequence key={i} from={starts[i]}><Audio src={staticFile(`global/${M.id}/${b.audio}`)}/></Sequence> : null)}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Mark x={60} y={72} s={0.62}/>
        <text x={150} y={112} fontFamily={SANS} fontSize={58} fontWeight={700} fill={G.ink}>{M.company.toUpperCase()}</text>
        <text x={150} y={156} fontFamily={SANS} fontSize={30} fill={G.dim}>{M.title}</text>
        <g transform={`translate(${W - 60} 70)`}>
          <rect x={-430} y={0} width={430} height={52} rx={26} fill={G.panel} stroke={G.line} strokeWidth={2}/>
          <text x={-215} y={35} textAnchor="middle" fontFamily={SANS} fontSize={26} fontWeight={500} fill={G.ink}>{M.period}</text>
          {draft ? <g transform="translate(0 68)">
            <rect x={-tw} y={0} width={tw} height={44} rx={6} fill={G.amber}/>
            <text x={-tw / 2} y={30} textAnchor="middle" fontFamily={SANS} fontSize={22} fontWeight={700} fill={G.bg}>{tag}</text>
          </g> : null}
        </g>
        {children}
        {cap ? <g>
          <rect x={W / 2 - 760} y={H - 200} width={1520} height={66} rx={10} fill={G.panel} opacity={0.94}/>
          <text x={W / 2} y={H - 156} textAnchor="middle" fontFamily={SANS} fontSize={32} fill={G.ink}>{cap}</text>
        </g> : null}
        <line x1={60} y1={H - 108} x2={W - 60} y2={H - 108} stroke={G.line} strokeWidth={2}/>
        <text x={60} y={H - 72} fontFamily={SANS} fontSize={22} fill={G.dim}>{`Source: ${M.source} · as of ${M.asOf}`}</text>
        {(M.notes ?? []).slice(0, 1).map((t, i) => <text key={i} x={60} y={H - 40} fontFamily={SANS} fontSize={20} fill={G.dim}>{t}</text>)}
      </svg>
    </AbsoluteFill>
  );
};

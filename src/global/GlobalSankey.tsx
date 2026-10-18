// GLOBAL-sankey: the animated income-statement (or follow-the-dollar) Sankey, props-driven: --props={D}.
// Columns reveal left to right on the steps' beat; a step can narrow focus to a few nodes and carry a narration clip
// (public/global/<D.id>/<audio>). The render refuses to start if the flows do not reconcile (assertSankey), and any
// node still marked "check" puts a DRAFT tag on every frame, so an unchecked chart cannot be mistaken for a final one.
import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {G, GlobalFonts, Mark, SANS} from "./theme";
import {Kind, NODE_W, PNode, SankeyData, Step, assertSankey, fmt, fmtFiled, layout, ribbon, textW, unchecked} from "./sankey";

export const GFPS = 30;
const KC: Record<Kind, string> = {rev: G.rev, keep: G.keep, spend: G.spend, neutral: G.neutral, amber: G.amber};
const VC: Record<Kind, string> = {rev: "#8FB3F5", keep: "#5FD39A", spend: "#F08A74", neutral: G.ink, amber: G.amber};

const ncolOf = (D: SankeyData) => Math.max(...D.nodes.map((n) => n.col)) + 1;
const stepsOf = (D: SankeyData): Step[] => D.steps ?? Array.from({length: ncolOf(D)}, (_, c) => ({sec: c === ncolOf(D) - 1 ? 6 : 1.6, cols: c}));

export const sankeyTimeline = (D: SankeyData) => {
  const steps = stepsOf(D), n = ncolOf(D), starts: number[] = [];
  let t = 0;
  steps.forEach((s) => { starts.push(t); t += Math.round(s.sec * GFPS); });
  // A column appears with the first step that reveals it; columns revealed together are staggered by 10 frames.
  const colStart = Array.from({length: n}, (_, c) => {
    const i = steps.findIndex((s) => (s.cols ?? n - 1) >= c);
    const prev = i > 0 ? (steps[i - 1].cols ?? n - 1) : -1;
    return starts[Math.max(0, i)] + Math.max(0, c - prev - 1) * 10;
  });
  return {steps, starts, colStart, total: t + 20};
};
export const sankeyTotal = (D: SankeyData) => { assertSankey(D); return sankeyTimeline(D).total; };

const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});

const Label: React.FC<{D: SankeyData; n: PNode; p: number}> = ({D, n, p}) => {
  if (p <= 0) return null;
  const kind = n.kind ?? "neutral", spend = kind === "spend";
  const anchor = n.side === "left" ? "end" : n.side === "right" ? "start" : "middle";
  const x = n.side === "left" ? n.x - 16 : n.side === "right" ? n.x + NODE_W + 16 : n.x + NODE_W / 2;
  const top = n.side === "above" ? n.y - n.lb : n.side === "below" ? n.y + n.h + 4 : n.y + n.h / 2 - n.lb / 2;
  const shown = n.v * p;
  let y = top;
  const lines: React.ReactNode[] = [];
  if (n.compact) {
    y += 30;
    lines.push(<text key="l" x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={28} fontWeight={500} fill={G.ink}>{n.label}</text>);
    y += 32;
    lines.push(<text key="v" x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={27} fontWeight={700} fill={VC[kind]}>
      {fmt(D, shown, spend)}<tspan fontWeight={400} fill={G.dim}>{` · ${n.sub?.[0] ?? ""}`}</tspan></text>);
    return <g opacity={Math.min(1, p * 2)} transform={`translate(0 ${(1 - p) * 10})`} style={HALO}>{lines}</g>;
  } else {
    y += 30;
    lines.push(<text key="l" x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={28} fontWeight={500} fill={G.ink}>{n.label}</text>);
    y += 38;
    lines.push(<text key="v" x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={34} fontWeight={700} fill={VC[kind]}>{fmt(D, shown, spend)}</text>);
    if (D.show) { y += 26; lines.push(<text key="f" x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={21} fill={G.dim}>{fmtFiled(D, shown)}</text>); }
  }
  (n.sub ?? []).forEach((s, i) => { y += 26; lines.push(<text key={`s${i}`} x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={21} fill={G.dim}>{s}</text>); });
  return <g opacity={Math.min(1, p * 2)} transform={`translate(0 ${(1 - p) * 10})`} style={HALO}>{lines}</g>;
};
// A ground-coloured outline behind every label keeps text legible where it sits over a ribbon.
const HALO: React.CSSProperties = {paintOrder: "stroke", stroke: G.bg, strokeWidth: 7, strokeLinejoin: "round"};

export const GlobalSankey: React.FC<{D: SankeyData}> = ({D}) => {
  const f = useCurrentFrame(), {width: W, height: H} = useVideoConfig();
  const tl = sankeyTimeline(D), cap = tl.steps.some((s) => s.caption) ? 90 : 0;
  const L = layout(D, {x: 60, y: 200, w: W - 120, h: H - 200 - 130 - cap});
  const si = Math.max(0, tl.starts.filter((s) => s <= f).length - 1), step = tl.steps[si];
  const focusAt = (i: number) => (i >= 0 ? tl.steps[i]?.focus : undefined);
  const blend = ease(f, tl.starts[si], tl.starts[si] + 8);
  const lit = (ids: string[], i: number) => { const fo = focusAt(i); return !fo || ids.some((id) => fo.includes(id)); };
  const op = (ids: string[], on: number, off: number) => {
    const a = lit(ids, si - 1) ? on : off, b = lit(ids, si) ? on : off;
    return a + (b - a) * blend;
  };
  const draft = unchecked(D);
  return (
    <AbsoluteFill style={{background: G.bg}}>
      <GlobalFonts/>
      {tl.steps.map((s, i) => s.audio ? <Sequence key={i} from={tl.starts[i]}><Audio src={staticFile(`global/${D.id}/${s.audio}`)}/></Sequence> : null)}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>{L.links.map((l, i) => {
          const c = tl.colStart[L.nodes.find((n) => n.id === l.to)!.col], p = ease(f, c, c + 18);
          return <clipPath key={i} id={`gk${i}`}><rect x={l.sx - 1} y={-1e4} width={(l.tx - l.sx + 2) * p} height={2e4}/></clipPath>;
        })}</defs>
        <Mark x={60} y={68} s={0.62}/>
        <text x={150} y={112} fontFamily={SANS} fontSize={58} fontWeight={700} fill={G.ink}>{D.company.toUpperCase()}</text>
        <text x={150} y={156} fontFamily={SANS} fontSize={30} fill={G.dim}>{D.title}</text>
        <g transform={`translate(${W - 60} 70)`}>
          <rect x={-430} y={0} width={430} height={52} rx={26} fill={G.panel} stroke={G.line} strokeWidth={2}/>
          <text x={-215} y={35} textAnchor="middle" fontFamily={SANS} fontSize={26} fontWeight={500} fill={G.ink}>{D.period}</text>
          {draft.length ? (() => {
            const t = `DRAFT · ${draft.length} FIGURE${draft.length > 1 ? "S" : ""} TO CHECK AGAINST THE FILING`, w = textW(t, 22) + 40;
            return <g transform="translate(0 68)">
              <rect x={-w} y={0} width={w} height={44} rx={6} fill={G.amber}/>
              <text x={-w / 2} y={30} textAnchor="middle" fontFamily={SANS} fontSize={22} fontWeight={700} fill={G.bg}>{t}</text>
            </g>;
          })() : null}
        </g>
        {L.links.map((l, i) => (
          <path key={i} d={ribbon(l)} clipPath={`url(#gk${i})`} fill={KC[l.kind]} opacity={op([l.from, l.to], 0.42, 0.07)}/>
        ))}
        {L.nodes.map((n) => {
          const c = tl.colStart[n.col] + (n.col === 0 ? 0 : 12), p = ease(f, c, c + 12), o = op([n.id], 1, 0.22);
          if (f < c) return null;
          return (
            <g key={n.id} opacity={o}>
              <rect x={n.x} y={n.y} width={NODE_W} height={Math.max(1.5, n.h * p)} rx={3} fill={KC[n.kind ?? "neutral"]}/>
              <Label D={D} n={n} p={ease(f, c + 4, c + 22)}/>
            </g>
          );
        })}
        {step?.caption ? <g>
          <rect x={W / 2 - 760} y={H - 200} width={1520} height={66} rx={10} fill={G.panel} opacity={0.94}/>
          <text x={W / 2} y={H - 156} textAnchor="middle" fontFamily={SANS} fontSize={32} fill={G.ink}>{step.caption}</text>
        </g> : null}
        <line x1={60} y1={H - 108} x2={W - 60} y2={H - 108} stroke={G.line} strokeWidth={2}/>
        <text x={60} y={H - 72} fontFamily={SANS} fontSize={22} fill={G.dim}>{`Source: ${D.source} · as of ${D.asOf}`}</text>
        {(D.notes ?? []).slice(0, 1).map((t, i) => <text key={i} x={60} y={H - 40} fontFamily={SANS} fontSize={20} fill={G.dim}>{t}</text>)}
      </svg>
    </AbsoluteFill>
  );
};

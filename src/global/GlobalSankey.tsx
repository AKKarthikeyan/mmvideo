// GLOBAL-sankey: the animated income-statement (or follow-the-dollar) Sankey, props-driven: --props={D}.
// Columns reveal left to right on the steps' beat; a step can narrow focus to a few nodes and carry a narration clip
// (public/global/<D.id>/<audio>). The render refuses to start if the flows do not reconcile (assertSankey), and any
// node still marked "check" puts a DRAFT tag on every frame, so an unchecked chart cannot be mistaken for a final one.
import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {G, SANS} from "./theme";
import {Frame, GFPS, HALO, beatAt, ease, filed, money, timeline} from "./frame";
import {Kind, NODE_W, PNode, SankeyData, Step, assertSankey, layout, ribbon, unchecked} from "./sankey";

export {GFPS};
const KC: Record<Kind, string> = {rev: G.rev, keep: G.keep, spend: G.spend, neutral: G.neutral};

const ncolOf = (D: SankeyData) => Math.max(...D.nodes.map((n) => n.col)) + 1;
const stepsOf = (D: SankeyData): Step[] => D.steps ?? Array.from({length: ncolOf(D)}, (_, c) => ({sec: c === ncolOf(D) - 1 ? 6 : 1.6, cols: c}));

export const sankeyTimeline = (D: SankeyData) => {
  const steps = stepsOf(D), n = ncolOf(D), {starts, total} = timeline(steps);
  // A column appears with the first step that reveals it; columns revealed together are staggered by 10 frames.
  const colStart = Array.from({length: n}, (_, c) => {
    const i = steps.findIndex((s) => (s.cols ?? n - 1) >= c);
    const prev = i > 0 ? (steps[i - 1].cols ?? n - 1) : -1;
    return starts[Math.max(0, i)] + Math.max(0, c - prev - 1) * 10;
  });
  return {steps, starts, colStart, total};
};
export const sankeyTotal = (D: SankeyData) => { assertSankey(D); return sankeyTimeline(D).total; };

const Label: React.FC<{D: SankeyData; n: PNode; p: number}> = ({D, n, p}) => {
  if (p <= 0) return null;
  const spend = n.kind === "spend";
  const anchor = n.side === "left" ? "end" : n.side === "right" ? "start" : "middle";
  const x = n.side === "left" ? n.x - 16 : n.side === "right" ? n.x + NODE_W + 16 : n.x + NODE_W / 2;
  const top = n.side === "above" ? n.y - n.lb : n.side === "below" ? n.y + n.h + 4 : n.y + n.h / 2 - n.lb / 2;
  const shown = n.v * p;
  let y = top + 30;
  const lines: React.ReactNode[] = [
    <text key="l" x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={28} fontWeight={500} fill={G.ink}>{n.label}</text>];
  if (n.compact) {
    y += 32;
    lines.push(<text key="v" x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={27} fontWeight={700} fill={G.ink}>
      {money(D, shown, spend)}<tspan fontWeight={400} fill={G.dim}>{` · ${n.sub?.[0] ?? ""}`}</tspan></text>);
  } else {
    y += 38;
    lines.push(<text key="v" x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={34} fontWeight={700} fill={G.ink}>{money(D, shown, spend)}</text>);
    if (D.show) { y += 26; lines.push(<text key="f" x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={21} fill={G.dim}>{filed(D, shown)}</text>); }
    (n.sub ?? []).forEach((s, i) => { y += 26; lines.push(<text key={`s${i}`} x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={21} fill={G.dim}>{s}</text>); });
  }
  return <g opacity={Math.min(1, p * 2)} transform={`translate(0 ${(1 - p) * 10})`} style={HALO}>{lines}</g>;
};

export const GlobalSankey: React.FC<{D: SankeyData}> = ({D}) => {
  const f = useCurrentFrame(), {width: W, height: H} = useVideoConfig();
  const tl = sankeyTimeline(D), cap = tl.steps.some((s) => s.caption) ? 90 : 0;
  const L = layout(D, {x: 60, y: 200, w: W - 120, h: H - 200 - 130 - cap});
  const si = beatAt(tl.starts, f);
  const blend = ease(f, tl.starts[si], tl.starts[si] + 8);
  const lit = (ids: string[], i: number) => { const fo = i >= 0 ? tl.steps[i]?.focus : undefined; return !fo || ids.some((id) => fo.includes(id)); };
  const op = (ids: string[], on: number, off: number) => {
    const a = lit(ids, si - 1) ? on : off, b = lit(ids, si) ? on : off;
    return a + (b - a) * blend;
  };
  return (
    <Frame M={D} draft={unchecked(D).length} beats={tl.steps} starts={tl.starts}>
      <defs>{L.links.map((l, i) => {
        const c = tl.colStart[L.nodes.find((n) => n.id === l.to)!.col], p = ease(f, c, c + 18);
        return <clipPath key={i} id={`gk${i}`}><rect x={l.sx - 1} y={-1e4} width={(l.tx - l.sx + 2) * p} height={2e4}/></clipPath>;
      })}</defs>
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
    </Frame>
  );
};

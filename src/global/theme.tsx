// Global channel look (Oct 2026): dark ink ground; blue for money in, green for money kept, orange for money spent.
// The three data hues pass the dataviz validator all-pairs on this ground (CVD and normal vision); amber is a UI
// accent only (DRAFT tag, highlights), never a data colour. Text stays in ink, never in a series colour.
// Deliberately distinct from the Moat & Margin tan Vox collage so the two channels never read as the same feed.
import React from "react";
import {staticFile} from "remotion";

export const G = {
  bg: "#0E1116", panel: "#161B22", line: "#2A313C", ink: "#E8ECF1", dim: "#8B95A3",
  rev: "#3987e5", keep: "#2fa37a", spend: "#d95926", spend2: "#e98d63", neutral: "#8B95A3", amber: "#F2B544",
};
// Ordinal blue ramp for ordered parts (process nodes, tiers), brightest first; validated with --ordinal on G.bg.
export const RAMP = ["#cde2fb", "#86b6ef", "#3987e5", "#256abf", "#184f95"];
export const SANS = "Oswald, 'Arial Narrow', sans-serif";

export const GlobalFonts: React.FC = () => (
  <style>{`
    @font-face{font-family:Oswald;font-weight:400;src:url(${staticFile("fonts/Oswald-400.woff2")}) format("woff2");}
    @font-face{font-family:Oswald;font-weight:500;src:url(${staticFile("fonts/Oswald-500.woff2")}) format("woff2");}
    @font-face{font-family:Oswald;font-weight:700;src:url(${staticFile("fonts/Oswald-700.woff2")}) format("woff2");}
  `}</style>
);

// The Moat Atlas mark: a globe (the atlas) inside a ring (the moat). Two colours, no detail that dies at 32 px.
// Drawn in a 120x120 box; x, y is its top-left corner.
export const Mark: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={60} cy={60} r={53} fill="none" stroke={G.rev} strokeWidth={10}/>
    <circle cx={60} cy={60} r={36} fill={G.ink}/>
    <ellipse cx={60} cy={60} rx={14} ry={36} fill="none" stroke={G.bg} strokeWidth={5}/>
    <line x1={24} y1={60} x2={96} y2={60} stroke={G.bg} strokeWidth={5}/>
  </g>
);

// Wordmark: MOAT in bold ink, ATLAS in regular dim, tracked out. x, baseline y; returns its width for layout.
export const wordmarkW = (size: number) => size * 5.35;
export const Wordmark: React.FC<{x: number; y: number; size: number; anchor?: "start" | "middle"}> = ({x, y, size, anchor = "start"}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={SANS} fontSize={size} letterSpacing={size * 0.08}>
    <tspan fontWeight={700} fill={G.ink}>MOAT</tspan><tspan dx={size * 0.28} fontWeight={400} fill={G.dim}>ATLAS</tspan>
  </text>
);
